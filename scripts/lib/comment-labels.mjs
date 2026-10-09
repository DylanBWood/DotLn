import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve, sep } from "node:path";
import { sha256Hex } from "./helpers.mjs";
import { runGitPathList, spawnGit } from "./git.mjs";
import { docPath, docRelative, loadConfig } from "./config.mjs";
import { parseJson } from "./paths.mjs";
import { evidenceSources } from "./evidence-sources.mjs";
import { feedbackSourcesComments } from "../../packages/skeleton/dist/src/feedback-source-comments.js";

// A comment says what the code does or why. A report-local label (a
// verification or final-review finding label, a bare decision number) names
// nothing outside its report, and an order identifier that leads a comment
// stands where the explanation belongs. Today's lines are fingerprinted in a
// baseline that only shrinks; a new or changed line is judged as written.
export const baselinePath = (root) =>
  docPath(root, "control", "comment-baseline.json");
export const baselineRelative = (root) =>
  docRelative(root, "control", "comment-baseline.json");
const normalized = (text) => text.replace(/\s+/gu, " ").trim();
const ORDER_LEAD = /^\(?WO-\d{3}\b/u;
// A report's finding label after its report name, with or without a letter
// before its number, or a bare letter-and-number label in the letters the
// reports use.
const FINDING_LABEL =
  /\b(?:VER|FINAL)-\d{3}(?:[\s,/-]+(?:finding\s+)?|-)(?:[A-Z]{1,2})?\d{1,2}\b|(?<![\w./-])[FNRBAM]\d{1,2}\b|\bfinding\s+\d{1,2}\s+(?:of|in|from)\s+(?:VER|FINAL)-\d{3}\b/u;
const DECISION_NUMBER = /(?<!WO-\d{3}[\s-])(?<![\w/-])D\d{3}\b/gu;
const CODE = /\.(?:[cm]?js|[cm]?ts|tsx|jsx|sh)$/u;
const SHELL = /\.sh$/u;
const inside = (root, path) =>
  path === root || path.startsWith(`${root}${sep}`);

/** The tracked and untracked code files the check reads: documentation roots,
 * generated surfaces, build output and dependency trees are left out. */
export function commentFiles(root) {
  const roots = Object.values(loadConfig(root).roots).map((path) =>
    resolve(root, path),
  );
  const candidates = [
    ...new Set(
      runGitPathList(root, [
        "ls-files",
        "-z",
        "--cached",
        "--others",
        "--exclude-standard",
      ]),
    ),
  ]
    .filter(
      (file) =>
        CODE.test(file) &&
        existsSync(join(root, file)) &&
        !/(?:^|\/)(?:node_modules|dist)\//u.test(file) &&
        !/^\.(?:claude|agents|codex)\//u.test(file) &&
        !roots.some((path) => inside(path, resolve(root, file))),
    )
    .sort();
  if (!candidates.length) return [];
  const attributes = spawnGit(
    ["-C", root, "check-attr", "-z", "--stdin", "dotln-generated"],
    {
      encoding: "utf8",
      input: candidates.join("\0") + "\0",
      maxBuffer: 32 * 1024 * 1024,
    },
  );
  if (attributes.status !== 0)
    throw new Error("Generated source classification unavailable");
  const fields = attributes.stdout.split("\0"),
    generated = new Set();
  for (let index = 0; index + 2 < fields.length; index += 3)
    if (fields[index + 2] === "set") generated.add(fields[index]);
  return candidates.filter((file) => !generated.has(file));
}

// Physical comment lines of one file: shell comments by line, JavaScript and
// TypeScript comments through the parser, which never reads a string, regex
// or template as a comment. Each body is located in its source to get its
// line; JSDoc continuation markers are stripped from the text.
// Inside a heredoc only a JavaScript line comment counts: a "#" line there is
// data, such as a Markdown heading a fixture writes. A here-string opens none.
const HEREDOC =
  /(?<!<)<<(?!<)(-?)\s*(?:'([^']+)'|"([^"]+)"|([A-Za-z_][A-Za-z0-9_]*))/u;
const shellComments = (source) => {
  const rows = [];
  let heredoc = null;
  source.split("\n").forEach((line, index) => {
    if (heredoc) {
      const body = heredoc.strip ? line.replace(/^\t+/u, "") : line;
      if (body === heredoc.word) heredoc = null;
      else {
        const match = /^\s*\/\/\s?(.*)$/u.exec(line);
        if (match) rows.push({ line: index + 1, text: match[1] });
      }
      return;
    }
    const match = /^\s*(?:#(?!!)|\/\/)\s?(.*)$/u.exec(line);
    if (match) rows.push({ line: index + 1, text: match[1] });
    else {
      const opener = HEREDOC.exec(line);
      if (opener)
        heredoc = {
          word: opener[2] ?? opener[3] ?? opener[4],
          strip: opener[1] === "-",
        };
    }
  });
  return rows;
};
const locateBodies = (source, bodies) => {
  const rows = [];
  let cursor = 0;
  for (const body of bodies) {
    let at = source.indexOf(body, cursor);
    while (at >= 0 && !["//", "/*"].includes(source.slice(at - 2, at)))
      at = source.indexOf(body, at + 1);
    if (at < 0) continue;
    cursor = at + body.length;
    const startLine = source.slice(0, at).split("\n").length;
    body.split("\n").forEach((text, index) =>
      rows.push({
        line: startLine + index,
        // A JSDoc body opens with its own star on the first row too.
        text: text.replace(/^\s*\*+\s?/u, "").replace(/^\s?/u, ""),
        block: rows.length && index > 0 ? rows.at(-1).block : rows.length,
      }),
    );
  }
  return rows;
};
export function fileComments(path, source, bodies) {
  const rows = SHELL.test(path)
    ? shellComments(source).map((row, index) => ({ ...row, block: index }))
    : locateBodies(source, bodies);
  // Consecutive single-line comments form one block; a multi-line body is one.
  const blocks = [];
  for (const row of rows) {
    const previous = blocks.at(-1);
    if (
      previous &&
      (row.block === previous.at(-1).block ||
        row.line === previous.at(-1).line + 1)
    )
      previous.push(row);
    else blocks.push([row]);
  }
  return blocks;
}

/** Every finding in one file: {line, kind, fingerprint}. The fingerprint is
 * of the physical line's text, so the line text itself is never stored. */
export function commentLabelFindings(path, source, bodies) {
  const findings = [];
  const seen = new Set();
  const push = (row, kind) => {
    const key = `${row.line}:${kind}`;
    if (seen.has(key)) return;
    seen.add(key);
    findings.push({
      line: row.line,
      kind,
      fingerprint: sha256Hex(normalized(row.text)),
    });
  };
  for (const block of fileComments(path, source, bodies)) {
    const lead = block.find((row) => row.text.trim() !== "");
    if (lead && ORDER_LEAD.test(lead.text.trimStart()))
      push(lead, "order-lead");
    for (const row of block)
      if (FINDING_LABEL.test(row.text)) push(row, "finding-label");
    // A decision number is judged on the whole block, so a qualifying order
    // identifier at the end of the previous line still qualifies it.
    const offsets = [];
    let joined = "";
    for (const row of block) {
      offsets.push(joined.length);
      joined += (joined ? " " : "") + row.text;
    }
    for (const match of joined.matchAll(DECISION_NUMBER)) {
      const index = offsets.findLastIndex((offset) => offset <= match.index);
      push(block[index], "decision-number");
    }
  }
  return findings;
}

const readBaseline = (root, baseline) => {
  baseline ??= existsSync(baselinePath(root))
    ? parseJson(
        readFileSync(baselinePath(root), "utf8"),
        baselineRelative(root),
      )
    : { schemaVersion: 1, admitted: {}, lines: {} };
  if (
    baseline.schemaVersion !== 1 ||
    !baseline.lines ||
    typeof baseline.lines !== "object" ||
    Array.isArray(baseline.lines) ||
    Object.values(baseline.lines).some(
      (entries) =>
        !entries ||
        typeof entries !== "object" ||
        Array.isArray(entries) ||
        Object.entries(entries).some(
          ([fingerprint, count]) =>
            !/^[0-9a-f]{64}$/u.test(fingerprint) ||
            !Number.isSafeInteger(count) ||
            count < 1,
        ),
    )
  )
    throw new Error(
      "Comment baseline requires files, SHA-256 line fingerprints and positive counts",
    );
  return baseline;
};
// What the writer does about each kind of finding.
const REMEDY = {
  "finding-label":
    "say what the finding changed, in words a reader who has not seen the report understands",
  "decision-number":
    "qualify it with its order (WO-NNN D0NN) or say what the decision decided",
  "order-lead":
    "lead with what the code does or why; an order identifier may follow the explanation",
};
const registeredFiles = (root) =>
  new Set(Object.values(evidenceSources(root)).flat());

/** Judge every comment line against the baseline. Returns the failures the
 * document gate prints, the findings, the stale baseline entries and counts. */
export function checkCommentLabels(
  root,
  { baseline, files = commentFiles(root) } = {},
) {
  baseline = readBaseline(root, baseline);
  const sources = files.map((file) => ({
    path: file,
    source: readFileSync(join(root, file), "utf8"),
  }));
  const bodies = feedbackSourcesComments(sources);
  const remaining = new Map(
    Object.entries(baseline.lines).map(([file, entries]) => [
      file,
      { ...entries },
    ]),
  );
  const failures = [];
  const findings = [];
  let baselined = 0;
  const registered = registeredFiles(root);
  const admitted = baseline.admitted ?? {};
  for (const file of Object.keys(baseline.lines))
    if (!registered.has(file) && !(file in admitted))
      failures.push(
        `${baselineRelative(root)}: ${file} is in no evidence edition and carries no admission; fix its comments instead of baselining them`,
      );
  sources.forEach(({ path, source }, index) => {
    for (const finding of commentLabelFindings(path, source, bodies[index])) {
      findings.push({ file: path, ...finding });
      const entries = remaining.get(path);
      if (entries?.[finding.fingerprint] > 0) {
        entries[finding.fingerprint] -= 1;
        baselined += 1;
      } else
        failures.push(
          `${path}:${finding.line}: comment ${finding.kind}; ${REMEDY[finding.kind]}`,
        );
    }
  });
  const stale = [];
  for (const [file, entries] of remaining)
    for (const [fingerprint, count] of Object.entries(entries))
      if (count > 0) stale.push({ file, fingerprint, count });
  for (const row of stale)
    failures.push(
      `${baselineRelative(root)}: ${row.file} no longer holds ${row.count} baselined comment line${row.count === 1 ? "" : "s"}; run node scripts/comment-labels.mjs --write to shrink the baseline`,
    );
  return { failures, findings, stale, baselined, scanned: files.length };
}

/** Rewrite the baseline from today's findings. By default only entries the
 * check consumed survive, so the file shrinks; `grow` admits every current
 * finding once, which only this check's first installation does. */
export function writeCommentBaseline(
  root,
  { grow = false, admitted, date, decision, source } = {},
) {
  const current = existsSync(baselinePath(root))
    ? readBaseline(root)
    : { schemaVersion: 1, admitted: {}, lines: {} };
  const result = checkCommentLabels(root, {
    baseline: grow ? { ...current, lines: {} } : current,
  });
  if (
    !grow &&
    result.findings.some(
      (finding) => !(current.lines[finding.file]?.[finding.fingerprint] > 0),
    )
  )
    throw new Error(
      "A comment line outside the baseline is fixed, never baselined; run the check for its line",
    );
  const lines = {};
  for (const finding of result.findings) {
    if (!grow && !(current.lines[finding.file]?.[finding.fingerprint] > 0))
      continue;
    lines[finding.file] ??= {};
    lines[finding.file][finding.fingerprint] =
      (lines[finding.file][finding.fingerprint] ?? 0) + 1;
  }
  const next = {
    schemaVersion: 1,
    date: date ?? current.date ?? new Date().toISOString().slice(0, 10),
    decision: decision ?? current.decision ?? null,
    source:
      source ??
      current.source ??
      "Fingerprints of the comment lines that carried a report-local label or led with an order identifier when the check was installed; never the lines themselves. The file only shrinks: a line that is fixed leaves it, and a line in a file outside every evidence edition is never added.",
    admitted: admitted ?? current.admitted ?? {},
    lines: Object.fromEntries(
      Object.entries(lines).sort(([a], [b]) => a.localeCompare(b)),
    ),
  };
  mkdirSync(dirname(baselinePath(root)), { recursive: true });
  writeFileSync(baselinePath(root), JSON.stringify(next, null, 2) + "\n");
  return {
    files: Object.keys(lines).length,
    lines: Object.values(lines).reduce(
      (sum, entries) =>
        sum + Object.values(entries).reduce((n, count) => n + count, 0),
      0,
    ),
  };
}
