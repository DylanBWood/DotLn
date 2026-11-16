// The fact inventory of a rewritten document: every code span, every line of
// a fenced block, every link target and every heading it holds, read from the
// repository's one Markdown parser. Run over a document before and after a
// rewrite, it shows what the rewrite dropped, so that nothing leaves the
// document unnoticed: each item of the base that the candidate lacks must be
// named, with its reason, in an `inventoryRemovals` list of a decision in
// this directory's decisions.md.
//
//   node docs/evidence/WO-281/inventory.mjs --revision <revision>
//        [--file <path>]
//
// writes one reading of the document as it stands at a Git revision
// (`inventory-base.json` for the default file, the kit guide).
//
//   node docs/evidence/WO-281/inventory.mjs
//        [--base <revision>] [--file <path>]
//
// reads the base (--base where it names one; else the commit the recorded
// base reading holds, so that the comparison stays the rewrite's own once
// main moves or the order merges; else the merge base of HEAD and main)
// and the candidate (the file in the working tree), writes both readings and
// their difference, prints the difference's summary and exits 1 while an
// item the candidate lacks is named in no decision.
//
// An item is compared by its text with runs of white space read as one
// space, so a span or a line that a rewrite wraps differently is the same
// item. A count that falls and stays above zero is no loss: the fact is
// still stated. A command the base wrote in running text and the candidate
// sets in a command block, or the reverse, is the same command: a code span
// and a block line of equal text answer for each other.
//
// Those four kinds are what the order's first criterion judges. The prose
// between them is read too, as an aid and never as a judgment: the
// difference lists each word of the base that the candidate holds nowhere,
// in its prose or in its code, with the base line it first stands on, for
// its writer to read and account for. A word the rewrite only rephrased is
// on that list beside one that carried a fact.
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  markdownCodeBlocks,
  markdownCodeSpans,
  markdownHeadings,
  markdownJsonBlocks,
  markdownLinks,
  markdownNodes,
  parseMarkdown,
} from "../../../scripts/lib/markdown-links.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "../../..");
const args = process.argv.slice(2);
const option = (name, fallback) => {
  const at = args.indexOf(`--${name}`);
  if (at < 0) return fallback;
  const [, value] = args.splice(at, 2);
  if (value === undefined) throw new Error(`--${name} takes a value`);
  return value;
};
const file = option("file", "docs/KIT.md");
const revision = option("revision");
const baseRevision = option("base");
if (args.length)
  throw new Error(
    `usage: node docs/evidence/WO-281/inventory.mjs [--revision <revision>] [--base <revision>] [--file <path>] (unread: ${args.join(" ")})`,
  );

const git = (...argv) =>
  execFileSync("git", argv, {
    cwd: root,
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
  });
const oneSpace = (text) => text.replace(/\s+/gu, " ").trim();

// The four kinds of item, each as a list of { value, count, line }, where
// line is the first place the item stands.
const KINDS = ["heading", "code span", "block line", "link target"];
function read(source) {
  const found = new Map(KINDS.map((kind) => [kind, new Map()]));
  const add = (kind, value, line) => {
    if (!value) return;
    const items = found.get(kind);
    const held = items.get(value);
    if (held) held.count += 1;
    else items.set(value, { value, count: 1, line });
  };
  for (const heading of markdownHeadings(source))
    add(
      "heading",
      `${"#".repeat(heading.depth)} ${oneSpace(heading.title)}`,
      heading.line,
    );
  for (const span of markdownCodeSpans(source))
    add("code span", oneSpace(span.value), span.line);
  for (const block of markdownCodeBlocks(source))
    block.value
      .split(/\r?\n/u)
      .forEach((text, index) =>
        add("block line", oneSpace(text), block.line + 1 + index),
      );
  for (const link of markdownLinks(source))
    add("link target", link.href, link.line);
  return Object.fromEntries(
    KINDS.map((kind) => [kind, [...found.get(kind).values()]]),
  );
}

// The words of a document: each run of letters and digits, in lower case,
// joined across an apostrophe or a hyphen, with the line it first stands on.
// Prose is the text outside code; a word counts as held wherever the
// document writes it, whole or as the parts a hyphen joins.
const WORD = /[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu;
const parts = (word) => word.split(/['’-]/u);
function words(source) {
  const prose = new Map();
  const anywhere = new Set();
  for (const node of markdownNodes(parseMarkdown(source))) {
    if (typeof node.value !== "string") continue;
    const code = node.type === "inlineCode" || node.type === "code";
    if (!code && node.type !== "text") continue;
    for (const [match] of node.value.matchAll(WORD)) {
      const word = match.toLowerCase();
      anywhere.add(word);
      for (const part of parts(word)) anywhere.add(part);
      if (!code && !prose.has(word)) prose.set(word, node.position.start.line);
    }
  }
  return { prose, anywhere };
}

const reading = (source, from) => {
  const items = read(source);
  return {
    file,
    ...from,
    sha256: createHash("sha256").update(source).digest("hex"),
    lines: source.split("\n").length - 1,
    counts: Object.fromEntries(
      KINDS.map((kind) => [
        kind,
        {
          distinct: items[kind].length,
          total: items[kind].reduce((sum, item) => sum + item.count, 0),
        },
      ]),
    ),
    items,
  };
};
const atRevision = (name) => {
  const commit = git("rev-parse", "--verify", `${name}^{commit}`).trim();
  return reading(git("show", `${commit}:${file}`), { revision: name, commit });
};
// The readings of the kit guide keep the plain names; another file's carry
// its own name, so the map's readings stand beside the guide's.
const label = file === "docs/KIT.md" ? "" : `-${basename(file, ".md")}`;
const write = (name, value) => {
  const path = join(here, name);
  writeFileSync(
    path,
    typeof value === "string" ? value : `${JSON.stringify(value, null, 2)}\n`,
  );
  return `docs/evidence/WO-281/${name}`;
};

if (revision !== undefined) {
  const base = atRevision(revision);
  const path = write(`inventory${label}-base.json`, base);
  console.log(
    `${file} at ${revision} (${base.commit.slice(0, 9)}): ${base.lines} lines; ${KINDS.map((kind) => `${base.counts[kind].distinct} ${kind}s`).join(", ")}; ${path}`,
  );
  process.exit(0);
}

// The commit the recorded base reading was made at, where one is recorded.
const recordedBase = () => {
  const path = join(here, `inventory${label}-base.json`);
  if (!existsSync(path)) return undefined;
  try {
    return JSON.parse(readFileSync(path, "utf8")).commit ?? undefined;
  } catch {
    return undefined;
  }
};
const base = atRevision(
  baseRevision ?? recordedBase() ?? git("merge-base", "HEAD", "main").trim(),
);
const candidate = reading(readFileSync(join(root, file), "utf8"), {
  revision: "working tree",
  commit: null,
});

// What the decisions name as removed or renamed: every entry of an
// `inventoryRemovals` list, in any decision of this order.
const decisionsPath = join(here, "decisions.md");
const named = new Map();
if (existsSync(decisionsPath))
  for (const block of markdownJsonBlocks(readFileSync(decisionsPath, "utf8"))) {
    let decision;
    try {
      decision = JSON.parse(block.value);
    } catch {
      continue;
    }
    for (const removal of decision.inventoryRemovals ?? [])
      if ((removal.file ?? "docs/KIT.md") === file)
        named.set(`${removal.kind}\n${oneSpace(String(removal.value))}`, {
          decision: decision.id,
          reason: removal.reason,
        });
  }

const absent = [];
const added = [];
// The kinds whose items answer for an item of this kind: its own, and for a
// command the other form a command is written in.
const answering = (kind) =>
  kind === "code span" || kind === "block line"
    ? ["code span", "block line"]
    : [kind];
const values = (side, kind) =>
  new Set(
    answering(kind).flatMap((other) =>
      side.items[other].map((item) => item.value),
    ),
  );
for (const kind of KINDS) {
  const after = values(candidate, kind);
  const before = values(base, kind);
  for (const item of base.items[kind])
    if (!after.has(item.value))
      absent.push({
        kind,
        ...item,
        named: named.get(`${kind}\n${item.value}`) ?? null,
      });
  for (const item of candidate.items[kind])
    if (!before.has(item.value)) added.push({ kind, ...item });
}
const unnamed = absent.filter((item) => !item.named?.reason);

// The aid: the base's prose words the candidate nowhere holds.
const baseSource = git("show", `${base.commit}:${file}`);
const held = words(readFileSync(join(root, file), "utf8")).anywhere;
const baseLines = baseSource.split("\n");
const lostWords = [...words(baseSource).prose]
  .filter(
    ([word]) => !held.has(word) && !parts(word).every((part) => held.has(part)),
  )
  .sort((a, b) => a[1] - b[1]);

const code = (text) => {
  const fence = "`".repeat(
    Math.max(0, ...[...text.matchAll(/`+/gu)].map((run) => run[0].length)) + 1,
  );
  const pad = text.startsWith("`") || text.endsWith("`") ? " " : "";
  return `${fence}${pad}${text}${pad}${fence}`;
};
const lines = [
  `# The inventory's difference: ${file}`,
  "",
  `Written by \`node docs/evidence/WO-281/inventory.mjs${file === "docs/KIT.md" ? "" : ` --file ${file}`}\`. The base is \`${base.commit.slice(0, 9)}\` (${base.lines} lines, SHA-256 \`${base.sha256}\`); the candidate is the working tree's file (${candidate.lines} lines, SHA-256 \`${candidate.sha256}\`).`,
  "",
  "| Kind | Base, distinct | Candidate, distinct | Absent from the candidate | Named in a decision | Unnamed | New in the candidate |",
  "| --- | --- | --- | --- | --- | --- | --- |",
  ...KINDS.map(
    (kind) =>
      `| ${kind} | ${base.counts[kind].distinct} | ${candidate.counts[kind].distinct} | ${absent.filter((item) => item.kind === kind).length} | ${absent.filter((item) => item.kind === kind && item.named?.reason).length} | ${unnamed.filter((item) => item.kind === kind).length} | ${added.filter((item) => item.kind === kind).length} |`,
  ),
  "",
  "## Absent from the candidate",
  "",
  ...(absent.length
    ? absent.map(
        (item) =>
          `- ${item.kind}, base line ${item.line}: ${code(item.value)}: ${item.named?.reason ? `${item.named.decision}: ${item.named.reason}` : "**unnamed**"}`,
      )
    : ["None."]),
  "",
  "## Words of the base's prose the candidate nowhere holds",
  "",
  "An aid to reading, outside the four kinds: each word with the base line it first stands on, and that line.",
  "",
  ...(lostWords.length
    ? lostWords.map(
        ([word, line]) =>
          `- ${code(word)}, base line ${line}: ${code(oneSpace(baseLines[line - 1] ?? ""))}`,
      )
    : ["None."]),
  "",
  "## New in the candidate",
  "",
  ...(added.length
    ? added.map(
        (item) =>
          `- ${item.kind}, candidate line ${item.line}: ${code(item.value)}`,
      )
    : ["None."]),
  "",
];
write(`inventory${label}-base.json`, base);
write(`inventory${label}-candidate.json`, candidate);
const path = write(`inventory${label}-difference.md`, lines.join("\n"));
console.log(
  `${file}: base ${base.commit.slice(0, 9)} ${base.lines} lines, candidate ${candidate.lines} lines; absent ${absent.length} (named ${absent.length - unnamed.length}, unnamed ${unnamed.length}); new ${added.length}; base prose words not held ${lostWords.length}; ${path}`,
);
for (const item of unnamed)
  console.log(`unnamed: ${item.kind}, base line ${item.line}: ${item.value}`);
process.exit(unnamed.length ? 1 : 0);
