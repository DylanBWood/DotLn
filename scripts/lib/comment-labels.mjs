import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve, sep } from "node:path";
import { sha256Hex } from "./helpers.mjs";
import { runGitPathList, spawnGit } from "./git.mjs";
import { docPath, docRelative, extensionPath, loadConfig } from "./config.mjs";
import { parseJson } from "./paths.mjs";
import { evidenceSources } from "./evidence-sources.mjs";
import { provenVendoredFile } from "./vendored-parser.mjs";
import {
  lineReader,
  sourceTrees,
  treeTokens,
} from "../../packages/skeleton/src/source-reading.mjs";
import { readShellText } from "../../packages/skeleton/src/shell-reading.mjs";

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
// A report-local finding needs its report name or finding/review context.
// Hardware, key, paper and storage names that share a short token remain prose.
const FINDING_LABEL =
  /\b(?:VER|FINAL)-\d{3}(?:[\s,/-]+(?:finding\s+)?|-)(?:[A-Z]{1,2})?\d{1,2}\b|\b(?:[Ff]indings?\s+|(?:[Ff]ix(?:es|ed)?|[Aa]ddress(?:es|ed)?|[Rr]esolv(?:es|ed))\s+)[FNRBAM]\d{1,2}\b|(?<![\w./-])[FNRBAM]\d{1,2}(?=\s+(?:from|in|of)\s+(?:the\s+)?(?:review|report)\b)|\bfinding\s+\d{1,2}\s+(?:of|in|from)\s+(?:VER|FINAL)-\d{3}\b/u;
const DECISION_NUMBER = /(?<!WO-\d{3}[\s-])(?<![\w/#-])D\d{3}\b/gu;
const CODE = /\.(?:[cm]?js|[cm]?ts|tsx|jsx|sh)$/u;
const SHELL = /\.sh$/u;
const inside = (root, path) =>
  path === root || path.startsWith(`${root}${sep}`);

/** The tracked and untracked code files the check reads: documentation roots,
 * generated and hash-pinned surfaces, build output, dependency trees and the
 * reserved root, whose code is the instance's own, are left out. */
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
        !extensionPath(file) &&
        !roots.some((path) => inside(path, resolve(root, file))) &&
        // The carried parser is the pinned package's text, not this
        // repository's: exactly the proven copy is left out.
        !provenVendoredFile(root, file),
    )
    .sort();
  if (!candidates.length) return [];
  const attributes = spawnGit(
    [
      "-C",
      root,
      "check-attr",
      "-z",
      "--stdin",
      "dotln-generated",
      "dotln-pinned-bytes",
    ],
    {
      encoding: "utf8",
      input: candidates.join("\0") + "\0",
      maxBuffer: 32 * 1024 * 1024,
    },
  );
  if (attributes.status !== 0)
    throw new Error("Generated or pinned source classification unavailable");
  const fields = attributes.stdout.split("\0"),
    excluded = new Set();
  for (let index = 0; index + 2 < fields.length; index += 3)
    if (fields[index + 2] === "set") excluded.add(fields[index]);
  return candidates.filter((file) => !excluded.has(file));
}

// Physical comment lines, each format read by the repository's one reader
// of it. JavaScript and TypeScript comments come from the syntax trees of the
// source reader (packages/skeleton/src/source-reading.mjs), one batch for the
// whole check: the grammar, not the token before a slash, tells a comment
// from the text of a regular expression, a template or JSX, which a scanner
// alone cannot do after a closing parenthesis or brace. A line is counted at
// each line feed and nowhere else, as the shell reader and the baseline's
// fingerprints count it; JSDoc continuation markers are stripped from the
// text. A shell file's comments come from the shell reader
// (packages/skeleton/src/shell-reading.mjs), which knows where a `#` begins
// a word: a comment that opens its line is judged, and a `#!` line is an
// interpreter line. A here-document is data, such as a Markdown heading a
// fixture writes, and a `#` line in it is no comment; its body is read as a
// TypeScript module whatever command it feeds, so a comment the grammar
// finds there that opens its line is judged. A here-string opens none.

/** Whether only blanks stand before an offset on its line. */
const opensLine = (text, offset) =>
  !text.slice(text.lastIndexOf("\n", offset - 1) + 1, offset).trim();

/** Each input's comments beside its text, every source of the batch parsed
 * from one start of the compiler's API; null for a shell file. A code path
 * the reader parses in no dialect is refused, never skipped, so every file
 * the selector admits is judged. */
const readSources = (inputs) =>
  sourceTrees(inputs).map((read, index) => {
    if (read) {
      // The compiler's own line map also breaks at U+2028, U+2029 and a lone
      // carriage return, which a string or template may hold; count line
      // feeds alone.
      const line = lineReader(read.file.text);
      return {
        comments: treeTokens(read.file).comments.map((comment) => ({
          ...comment,
          line: line(comment.start),
        })),
        file: { text: read.file.text },
      };
    }
    if (!SHELL.test(inputs[index].path))
      throw new Error(
        `comment check: the source reader parses no dialect for ${inputs[index].path}`,
      );
    return null;
  });

/** The rows of one source's comments, each with its line and block. */
const sourceRows = (read, { firstLine = 1, leading = false } = {}) =>
  read.comments
    .filter((comment) => !leading || opensLine(read.file.text, comment.start))
    .flatMap((comment, block) =>
      comment.body.split("\n").map((text, index) => ({
        line: firstLine - 1 + comment.line + index,
        // A JSDoc body opens with its own star on the first row too.
        text: text.replace(/^\s*\*+\s?/u, "").replace(/^\s?/u, ""),
        block,
      })),
    );

/** A shell file's comments that open their lines, and its here-documents. */
function shellComments(source) {
  const reading = readShellText(source, { whole: true });
  if (!reading)
    throw new Error("shell text nests deeper than the shell reader follows");
  const lineOf = lineReader(source);
  const rows = [];
  for (const { start, end } of reading.comments) {
    const text = source.slice(start + 1, end);
    if (!text.startsWith("!") && opensLine(source, start))
      rows.push({ line: lineOf(start), text: text.replace(/^\s/u, "") });
  }
  return {
    rows,
    heredocs: reading.heredocs.map((heredoc) => ({
      line: lineOf(heredoc.start),
      source: source.slice(heredoc.start, heredoc.end),
    })),
  };
}

/** Every source's comment rows. The JavaScript and TypeScript sources, and
 * the here-documents of the shell files, are parsed in one batch. */
function commentRows(sources) {
  const shells = sources.map(({ path, source }) =>
    SHELL.test(path) ? shellComments(source) : null,
  );
  const reads = readSources([
    ...sources.map(({ path, source }, index) => ({
      path: shells[index] ? "shell.sh" : path,
      source,
    })),
    ...shells.flatMap((shell) =>
      (shell?.heredocs ?? []).map(({ source }) => ({
        path: "here-document.ts",
        source,
      })),
    ),
  ]);
  let next = sources.length;
  return sources.map((_, index) => {
    const shell = shells[index];
    if (!shell) return reads[index] ? sourceRows(reads[index]) : [];
    const rows = [...shell.rows];
    for (const heredoc of shell.heredocs) {
      rows.push(
        ...sourceRows(reads[next++], {
          firstLine: heredoc.line,
          leading: true,
        }),
      );
    }
    // Each shell row is its own block; consecutive lines join below.
    return rows
      .sort((a, b) => a.line - b.line)
      .map((row, block) => ({ ...row, block }));
  });
}

/** Comment rows grouped into blocks. */
function commentBlocks(rows) {
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

/** One file's comments, grouped into blocks. */
export const fileComments = (path, source) =>
  commentBlocks(commentRows([{ path, source }])[0]);

/** Every finding in one file: {line, kind, fingerprint}. The fingerprint is
 * of the physical line's text, so the line text itself is never stored. */
export const commentLabelFindings = (path, source) =>
  blockFindings(fileComments(path, source));

function blockFindings(blocks) {
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
  for (const block of blocks) {
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
  const rows = commentRows(sources);
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
  sources.forEach(({ path }, index) => {
    for (const finding of blockFindings(commentBlocks(rows[index]))) {
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
