import { spawnGit } from "./git.mjs";
import { defaultDocRelative } from "./config.mjs";
import {
  markdownCodeBlocks,
  markdownComments,
  markdownHeadings,
} from "./markdown-links.mjs";
import { readWorkOrder } from "./work-order-document.mjs";
import { dirname } from "node:path";

const historyGit = (root, args, input) => {
  const result = spawnGit(args, {
    cwd: root,
    input,
    maxBuffer: 16 * 1024 * 1024,
  });
  return result.status === 0 ? result.stdout : null;
};

/** One query counts every requested blob in a snapshot, including UTF-8 bytes. */
export function coldStartSnapshot(root, revision, paths) {
  if (!revision) return new Map();
  const output = historyGit(root, [
    "ls-tree",
    "-rlz",
    revision,
    "--",
    ...paths,
  ]);
  return new Map(
    (output?.toString("utf8").split("\0") ?? []).flatMap((line) => {
      const match = /^\d+ blob [a-f0-9]+\s+(\d+)\t(.+)$/s.exec(line);
      return match ? [[match[2], Number(match[1])]] : [];
    }),
  );
}

// Read the budget snapshots together; missing blobs remain absent. Framing uses
// byte lengths, not character offsets, because reasons can contain Unicode.
function budgetSnapshots(root, revisions, path) {
  if (!revisions.length) return new Map();
  const expressions = revisions.map((revision) => `${revision}:${path}`);
  const output = historyGit(
    root,
    ["cat-file", "--batch"],
    expressions.join("\n") + "\n",
  );
  const snapshots = new Map();
  if (!output) return snapshots;
  let offset = 0;
  for (const [index, expression] of expressions.entries()) {
    const end = output.indexOf(10, offset);
    if (end < offset) return new Map();
    const header = output.subarray(offset, end).toString("utf8");
    offset = end + 1;
    if (header === `${expression} missing`) continue;
    const match = /^[a-f0-9]+ blob (\d+)$/.exec(header);
    const length = Number(match?.[1]);
    if (
      !match ||
      !Number.isSafeInteger(length) ||
      output[offset + length] !== 10
    )
      return new Map();
    try {
      snapshots.set(
        revisions[index],
        JSON.parse(output.subarray(offset, offset + length)),
      );
    } catch {
      return new Map();
    }
    offset += length + 1;
  }
  return offset === output.length ? snapshots : new Map();
}

const acceptanceKey = (entry) =>
  JSON.stringify([
    entry.date,
    entry.metric,
    entry.scope ?? null,
    entry.dispatch,
    entry.ceiling,
    entry.reason,
  ]);

/** Baselines are repository observations, never numbers extracted from prose. */
export function coldStartHistory(
  root,
  { previous, budgetPath, acceptances, paths },
) {
  const tags = historyGit(root, [
    "for-each-ref",
    "--merged=HEAD",
    "--sort=-version:refname",
    "--format=%(refname:strip=2)",
    "refs/tags",
  ]);
  const edition =
    previous ??
    tags
      ?.toString("utf8")
      .split("\n")
      .find((tag) => /^v\d+\.\d+\.\d+$/.test(tag)) ??
    null;
  const snapshots = new Map();
  const snapshot = (revision) => {
    if (!snapshots.has(revision))
      snapshots.set(revision, coldStartSnapshot(root, revision, paths));
    return snapshots.get(revision);
  };
  const latest = new Map();
  for (const entry of acceptances) {
    if (entry.scope || !entry.metric.startsWith("coldStartBytes.")) continue;
    if (
      !latest.has(entry.metric) ||
      entry.date >= latest.get(entry.metric).date
    )
      latest.set(entry.metric, entry);
  }
  const shallow = historyGit(root, ["rev-parse", "--is-shallow-repository"]);
  const log =
    latest.size && shallow?.toString().trim() === "false"
      ? historyGit(root, [
          "log",
          "--first-parent",
          "--reverse",
          "--format=%H",
          "HEAD",
          "--",
          budgetPath,
        ])
      : null;
  const revisions = log?.toString().trim().split(/\s+/).filter(Boolean) ?? [];
  const budgets = budgetSnapshots(root, revisions, budgetPath);
  const accepted = new Map(
    [...latest].map(([metric, entry]) => {
      const revision =
        revisions.find((ref) =>
          budgets
            .get(ref)
            ?.acceptances?.some(
              (candidate) => acceptanceKey(candidate) === acceptanceKey(entry),
            ),
        ) ?? null;
      return [
        metric,
        {
          date: entry.date,
          ceiling: entry.ceiling,
          revision,
          source: revision ? `${revision}:${budgetPath}` : null,
          cause: revision ? null : "acceptance-history-unavailable",
          sizes: snapshot(revision),
        },
      ];
    }),
  );
  return { edition, previous: snapshot(edition), accepted };
}

export const HARNESS_CONTEXT_BASE = "8b55eca3b3427146e98d34c68f67f679dc59bea5";
const lineParts = (text) => text.match(/[^\n]*\n|[^\n]+$/g) ?? [];
const normalized = (text) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
// Directed reads name launchpad-relative documents; ignored intake is refused.
const safePath = (path, intake = defaultDocRelative("intake")) =>
  /^(?:[.a-zA-Z0-9_-]+\/)*[.a-zA-Z0-9_-]+$/.test(path) &&
  !path.split("/").some((part) => part === "..") &&
  !path.startsWith(`${intake}/`);

// A procedure names several sections of one document, and a measurement
// reads the same documents for every role, so each text's headings are read
// once; the cache holds a bounded number of texts.
const headingsByText = new Map();
const documentHeadings = (text) => {
  let headings = headingsByText.get(text);
  if (!headings) {
    if (headingsByText.size >= 64) headingsByText.clear();
    headings = markdownHeadings(text).map((heading) => ({
      ...heading,
      title: normalized(heading.title),
    }));
    headingsByText.set(text, headings);
  }
  return headings;
};

/** The lines of the section a heading titled `anchor` opens, up to the next
 * heading at its depth or shallower; the whole text without an anchor. */
export function sectionRange(text, anchor) {
  const lines = lineParts(text);
  if (!anchor) return { startLine: 1, endLine: lines.length };
  const headings = documentHeadings(text);
  const target = normalized(
    anchor.replace(/\([^)]*\)/g, "").replace(/[,;.]\s*$/, ""),
  );
  const exact = headings.filter((heading) => heading.title === target);
  const matches = exact.length
    ? exact
    : headings.filter((heading) => heading.title.startsWith(target + " "));
  if (matches.length !== 1)
    throw new Error(`Unresolved required section: ${anchor}`);
  const start = matches[0];
  const next = headings.find(
    (heading) => heading.start > start.start && heading.depth <= start.depth,
  );
  return {
    startLine: start.line,
    endLine: next ? next.line - 1 : lines.length,
  };
}

/** A Read directive anywhere in a procedure is binding, including its last line. */
export function readDirectives(text, role) {
  const found = [];
  // A fenced code block's lines, its fences included, are an example.
  const fenced = markdownCodeBlocks(text);
  // A comment that opens its line is a marker or a note, never a directive.
  const commented = new Set(
    markdownComments(text)
      .filter(({ start }) => start === 0 || text[start - 1] === "\n")
      .map(({ line }) => line),
  );
  for (const [index, line] of text.split("\n").entries()) {
    if (
      fenced.some(
        (block) => block.line <= index + 1 && index + 1 <= block.endLine,
      ) ||
      commented.has(index + 1)
    )
      continue;
    const explicit = /^Read(?:\[([a-z-]+)\])?:\s*(.*)/.exec(line);
    if (explicit?.[1] && explicit[1] !== role) continue;
    if (!explicit && !/\b(?:read|load|consult|inspect)\b/i.test(line)) continue;
    const source = explicit ? explicit[2] : line;
    for (const match of source.matchAll(/`([^`]+)`/g)) {
      const value = match[1];
      if (
        value.startsWith("@") ||
        /^[.\w/-]+\.(?:md|ts|mjs|json)(?:#.+)?$/.test(value)
      )
        found.push({ selector: value, line: index + 1 });
    }
    if (explicit && !found.some((entry) => entry.line === index + 1))
      throw new Error(`Malformed required Read directive at line ${index + 1}`);
  }
  return found;
}

/** The reads a root names outright: the selectors of its explicit `Read:`
 * lines that name a file or a section of one, each with the lines it
 * resolves to and their bytes. A selector that begins with `@` resolves by
 * the order in hand and is no fixed read; a sentence that tells a role to
 * read something on a condition is none either. A line two selectors both
 * resolve to (one section under two spellings, a file and a section of it)
 * is counted with the first, so the bytes sum to what is read. `read`
 * returns a path's text and throws where there is none. */
export function fixedReads(text, role, read) {
  const lines = text.split("\n");
  const seen = new Set();
  const counted = new Map();
  return readDirectives(text, role)
    .filter(
      ({ selector, line }) =>
        /^Read(?:\[[a-z-]+\])?:/u.test(lines[line - 1]) &&
        !selector.startsWith("@") &&
        seen.size !== seen.add(selector).size,
    )
    .map(({ selector }) => {
      const [path, ...anchor] = selector.split("#");
      if (!safePath(path)) throw new Error(`Unsafe required path: ${path}`);
      const source = read(path);
      const range = sectionRange(source, anchor.join("#"));
      const parts = lineParts(source);
      const already = counted.get(path) ?? new Set();
      counted.set(path, already);
      let bytes = 0;
      for (let line = range.startLine; line <= range.endLine; line++) {
        if (already.has(line)) continue;
        already.add(line);
        bytes += Buffer.byteLength(parts[line - 1] ?? "");
      }
      return { selector, ...range, bytes };
    });
}

/** Resolve the work order's own Cites block, with strict heading resolution:
 * its first label `Cites …` and what that label leads, up to the next label
 * or heading. */
export function citedSelectors(text, paths, read) {
  const order = readWorkOrder(text);
  const cites = order.labels.find(
    (field) => field.colon && field.label.startsWith("Cites"),
  );
  if (!cites) throw new Error("Work order has no resolvable Cites block");
  const block = order.block(cites).body;
  const flat = block.replace(/\s+/g, " ");
  const refs = [
    ...flat.matchAll(/(?:[.\w-]+\/)*[.\w-]+\.(?:md|ts|mjs|json)|ADR-\d{4}/g),
  ];
  const result = [];
  let sourceDirectory = "";
  for (const [index, match] of refs.entries()) {
    let path = match[0];
    if (/^ADR-/.test(path))
      path =
        paths.find((candidate) =>
          candidate.startsWith(
            `${defaultDocRelative("decisions")}/${path.slice(4)}-`,
          ),
        ) ?? "";
    else if (/^\d\d-.*\.md$/.test(path))
      path = defaultDocRelative("product", path);
    else if (
      !paths.includes(path) &&
      sourceDirectory &&
      paths.includes(`${sourceDirectory}/${path}`)
    )
      path = `${sourceDirectory}/${path}`;
    else if (!paths.includes(path)) {
      const matches = paths.filter((candidate) =>
        candidate.endsWith(`/${path}`),
      );
      if (matches.length === 1) path = matches[0];
    }
    if (!safePath(path) || !paths.includes(path))
      throw new Error(`Unresolved cited file: ${match[0]}`);
    if (path.startsWith("packages/") && !match[0].includes("loadouts/"))
      sourceDirectory = dirname(path);
    const tail = flat
      .slice(
        match.index + match[0].length,
        refs[index + 1]?.index ?? flat.length,
      )
      .replace(/`/g, "")
      .replace(/\([^)]*\)/g, "");
    const anchors = [
      ...tail.matchAll(/§([^§;]+?)(?=,?\s+(?:and\s+)?§|;|$)/g),
    ].map((anchor) =>
      anchor[1]
        .replace(/\([^)]*\)/g, "")
        .replace(/,?\s+and\s*$/, "")
        .trim(),
    );
    if (!anchors.length) result.push(path);
    else
      for (const anchor of anchors) {
        sectionRange(read(path), anchor);
        result.push(`${path}#${anchor}`);
      }
  }
  return [...new Set(result)];
}

export function directedReads({
  instruction,
  skill,
  role,
  skillsRoot,
  selectors,
  read,
}) {
  const requested = [{ selector: "CLAUDE.md", source: "instruction-autoload" }];
  for (const [source, text] of [
    ["instruction", instruction],
    ["skill", skill],
  ])
    for (const directive of readDirectives(text, role))
      requested.push({ ...directive, source });
  const expanded = [];
  const expand = (selector, source) => {
    if (selector.startsWith("@skills/"))
      selector = selector.replace("@skills", skillsRoot);
    else if (selector.startsWith("@")) {
      if (!Object.hasOwn(selectors, selector))
        throw new Error(`Unresolved required selector: ${selector}`);
      for (const selected of selectors[selector])
        expand(selected, `${source}:${selector}`);
      return;
    }
    const [path, ...anchor] = selector.split("#");
    if (!safePath(path)) throw new Error(`Unsafe required path: ${path}`);
    const text =
      path === "CLAUDE.md"
        ? instruction
        : path === `${skillsRoot}/dotln-${role}/SKILL.md`
          ? skill
          : read(path);
    expanded.push({ path, ...sectionRange(text, anchor.join("#")), source });
  };
  for (const row of requested) expand(row.selector, row.source);
  return mergeReads(expanded);
}

export function mergeReads(reads) {
  const merged = [];
  for (const row of [...reads].sort(
    (a, b) => a.path.localeCompare(b.path) || a.startLine - b.startLine,
  )) {
    const previous = merged.at(-1);
    if (previous?.path === row.path && row.startLine <= previous.endLine + 1) {
      previous.endLine = Math.max(previous.endLine, row.endLine);
      previous.sources = [
        ...new Set([...previous.sources, row.source ?? "declared-input"]),
      ];
    } else
      merged.push({
        path: row.path,
        startLine: row.startLine,
        endLine: row.endLine,
        sources: [row.source ?? "declared-input"],
      });
  }
  return merged;
}

export function countReads(reads, read) {
  const files = reads.map((row) => {
    const parts = lineParts(read(row.path)).slice(
      row.startLine - 1,
      row.endLine,
    );
    return {
      ...row,
      bytes: Buffer.byteLength(parts.join("")),
      lines: parts.length,
    };
  });
  return {
    bytes: files.reduce((sum, file) => sum + file.bytes, 0),
    lines: files.reduce((sum, file) => sum + file.lines, 0),
    files,
  };
}

export function compareObservedReads(directed, observed) {
  return observed.filter(
    (read) =>
      !directed.some(
        (entry) =>
          entry.path === read.path &&
          entry.startLine <= read.startLine &&
          entry.endLine >= read.endLine,
      ),
  );
}

export function scopeReadEvidence(directed, observations) {
  const refused = observations.filter((row) => row.readScopeRefusal);
  return {
    refusalCounts: {
      Read: refused.filter((row) => row.tool === "Read").length,
      Bash: refused.filter((row) => row.tool === "Bash").length,
      Skill: refused.filter((row) => row.tool === "Skill").length,
      other: refused.filter(
        (row) => !["Read", "Bash", "Skill"].includes(row.tool),
      ).length,
    },
    unlocatedReadRefusals: refused.filter(
      (row) => row.tool === "Read" && !row.attemptedRead,
    ).length,
    refusedReads: refused.flatMap((row) =>
      row.attemptedRead ? [row.attemptedRead] : [],
    ),
    attemptedOutsideDirectedSet: compareObservedReads(
      directed,
      observations.flatMap((row) =>
        row.attemptedRead ? [row.attemptedRead] : [],
      ),
    ),
  };
}

/** Legacy syntax is audited against the frozen activation source, never inferred from the new skill. */
export function legacyDirectedReads(instruction, guide, role, selectors, read) {
  const floor = /Cold-start read order:([\s\S]*?)Settled questions/.exec(
    instruction,
  )?.[1];
  if (
    !floor ||
    // The frozen activation bytes carry the default layout by construction.
    !floor.includes(defaultDocRelative("product", "07-execution-guide.md")) ||
    !floor.includes("your work order") ||
    !floor.includes("sections it cites")
  )
    throw new Error("Unrecognized activation read order");
  const selected = [
    "CLAUDE.md",
    defaultDocRelative("product", "07-execution-guide.md"),
    ...selectors["@work-order"],
    ...selectors["@citations"],
  ];
  if (!guide.includes("Read your own diff before reporting"))
    throw new Error("Unrecognized legacy output review");
  selected.push(...selectors["@subject-files"]);
  if (
    ["verifier", "reviewer"].includes(role) &&
    /verifier reads[\s\S]*?prior reports/.test(guide)
  )
    selected.push(...selectors["@verification-reports"]);
  if (role === "executor" && /repair episode reads both/.test(guide))
    selected.push(...selectors["@failure-report"]);
  if (role === "reviewer" && guide.includes("PR body file"))
    selected.push(...selectors["@final-review"]);
  if (role === "release-close" && guide.includes("RELEASE-NOTES.md"))
    selected.push(...selectors["@final-review"]);
  if (role !== "release-close" && guide.includes("in\n   `package.json`"))
    selected.push("package.json");
  return mergeReads(
    selected.map((selector) => {
      const [path, ...anchor] = selector.split("#");
      return {
        path,
        ...sectionRange(
          path === "CLAUDE.md" ? instruction : read(path),
          anchor.join("#"),
        ),
        source: "activation-read-order-and-role-procedure",
      };
    }),
  );
}
