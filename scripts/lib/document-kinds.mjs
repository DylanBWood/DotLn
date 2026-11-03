// Every committed document is one of three kinds. A standing document states
// what is so for a reader and is replaced in place; a record is dated and
// immutable, reached by link; a generated document is written by a command.
// The kind is derived from the path, with a short override list, so no
// document carries a field of its own. A standing document's reader binding
// is derived too: the entry points a session starts from, and the links that
// reach it from there through standing and generated pages.
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { docPath, docRelative, loadConfig } from "./config.mjs";
import { currentPath, moveIndex, referencePath } from "./document-moves.mjs";
import { runGit, runGitPathList } from "./git.mjs";
import { documentEntry, readDocumentInput } from "./paths.mjs";
import {
  markdownCodeSpans,
  markdownLinks,
  markdownNodes,
  parseMarkdown,
} from "./markdown-links.mjs";

export const DOCUMENT_KINDS = Object.freeze([
  "standing",
  "record",
  "generated",
]);
export const DOCUMENTS_CONTROL = "documents.json";
export const RED_TAG_START = "<!-- dotln-red-tags:start -->";
export const RED_TAG_END = "<!-- dotln-red-tags:end -->";

/** The configured roots whose documents are records: one file per event,
 * dated and never rewritten. A README at the top of such a root is the
 * root's standing convention page. */
const RECORD_ROOTS = [
  "evidence",
  "verifications",
  "finalReviews",
  "refutations",
  "releases",
  "decisions",
  "orders",
];

/** The four places a session starts reading. Product 07 and the kit guide
 * may live under another document root, so the defaults resolve through the
 * configuration; an instance's `documents.json` may replace them. */
export const defaultEntryPoints = (root) => [
  {
    id: "instruction-start-here",
    files: ["CLAUDE.md", "AGENTS.md"],
    heading: "Start here",
  },
  {
    id: "role-read-lines",
    files: [
      ".claude/skills/*/SKILL.md",
      ".agents/skills/*/SKILL.md",
      ".claude/agents/*.md",
    ],
    lines: "^Read(?:\\[[a-z-]+\\])?:",
  },
  {
    id: "cold-start-read-order",
    files: [docRelative(root, "product", "07-execution-guide.md")],
    heading: "Read order for a cold start",
  },
  {
    id: "kit-first-steps",
    files: [docRelative(root, "docs", "KIT.md")],
    heading: "First steps",
  },
];

const failFor = (root) => (message) => {
  throw new Error(
    `${docRelative(root, "control", DOCUMENTS_CONTROL)}: ${message}`,
  );
};

/** The override list and the entry points. An absent file leaves the derived
 * kinds and the default entry points; a malformed one refuses. */
export function readDocumentControl(root) {
  const fail = failFor(root);
  const path = docPath(root, "control", DOCUMENTS_CONTROL);
  if (!existsSync(path))
    return {
      entryPoints: defaultEntryPoints(root),
      kinds: [],
      declared: false,
    };
  let control;
  try {
    control = JSON.parse(readFileSync(path, "utf8"));
  } catch {
    fail("invalid JSON");
  }
  if (control?.schemaVersion !== 1) fail("schemaVersion must be 1");
  const allowed = ["schemaVersion", "purpose", "entryPoints", "kinds"];
  for (const key of Object.keys(control))
    if (!allowed.includes(key)) fail(`unknown field ${key}`);
  if (!Array.isArray(control.entryPoints) || !control.entryPoints.length)
    fail("entryPoints must list at least one entry point");
  const ids = new Set();
  for (const entry of control.entryPoints) {
    if (typeof entry?.id !== "string" || !/^[a-z][a-z0-9-]*$/u.test(entry.id))
      fail("an entry point needs a lowercase id");
    if (ids.has(entry.id)) fail(`duplicate entry point ${entry.id}`);
    ids.add(entry.id);
    if (
      !Array.isArray(entry.files) ||
      !entry.files.length ||
      entry.files.some((file) => typeof file !== "string" || !file)
    )
      fail(`entry point ${entry.id} needs files`);
    if ((entry.heading === undefined) === (entry.lines === undefined))
      fail(`entry point ${entry.id} needs exactly one of heading or lines`);
    if (entry.heading !== undefined && typeof entry.heading !== "string")
      fail(`entry point ${entry.id} heading must be a string`);
    if (entry.lines !== undefined) {
      try {
        new RegExp(entry.lines, "u");
      } catch {
        fail(`entry point ${entry.id} lines must be a regular expression`);
      }
    }
  }
  if (!Array.isArray(control.kinds)) fail("kinds must be an array");
  for (const row of control.kinds)
    if (
      typeof row?.path !== "string" ||
      !row.path ||
      !DOCUMENT_KINDS.includes(row.kind) ||
      typeof row.reason !== "string" ||
      !row.reason.trim()
    )
      fail("each kinds row needs a path, a kind and a reason");
  return {
    entryPoints: control.entryPoints,
    kinds: control.kinds,
    declared: true,
  };
}

const isDocumentName = (file) => /\.(?:md|json)$/iu.test(file);
const inside = (parent, path) =>
  path === parent || path.startsWith(`${parent}/`);
const toPosix = (path) => path.split("\\").join("/");

/** Tracked documents and untracked ones Git would not ignore, under the
 * configured roots and at the repository top, without the private roots. */
export function documentFiles(root) {
  const roots = Object.values(loadConfig(root).roots).map((path) =>
    toPosix(path).replace(/\/+$/u, ""),
  );
  const privateRoots = [
    docRelative(root, "intake"),
    docRelative(root, "control", "local"),
  ];
  return [
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
    .map(toPosix)
    .filter(
      (file) =>
        isDocumentName(file) &&
        (!file.includes("/")
          ? /\.md$/iu.test(file)
          : roots.some((path) => inside(path, file))) &&
        !privateRoots.some((path) => inside(path, file)) &&
        documentEntry(root, file),
    )
    .sort();
}

// A path segment carrying a calendar date names one event: a dated pass, a
// dated probe, a dated disposition.
const DATED_SEGMENT = /(?:^|[-_.])\d{4}-\d{2}-\d{2}(?:[-_.]|$)/u;

/** The line that marks a page as written by a command, outside fenced code
 * and outside any marker block the page holds. */
const GENERATED_LINE =
  /^(?:Generated (?:by|from) |This (?:file|page) is generated by )/u;
export function hasGeneratedMarker(source) {
  let fence = null,
    block = null;
  for (const line of source.split("\n").slice(0, 80)) {
    const trimmed = line.trim();
    if (fence) {
      if (trimmed.startsWith(fence)) fence = null;
      continue;
    }
    const opening = /^(`{3,}|~{3,})/u.exec(trimmed);
    if (opening) {
      fence = opening[1];
      continue;
    }
    if (block) {
      if (trimmed === block) block = null;
      continue;
    }
    const marker = /^<!-- ([\w.-]+):start -->$/u.exec(trimmed);
    if (marker) {
      block = `<!-- ${marker[1]}:end -->`;
      continue;
    }
    if (GENERATED_LINE.test(trimmed)) return true;
  }
  return false;
}

const overrideFor = (kinds, file) =>
  kinds
    .filter((row) =>
      row.path.endsWith("/") ? file.startsWith(row.path) : file === row.path,
    )
    .sort((a, b) => b.path.length - a.path.length)[0];

/** The documents whose kind the kit's own commands fix, wherever the kit
 * runs, so an instance needs no override list for them: entropy disposal
 * files proposal packets and the reducer files its receipts once; the
 * planner appends to the idea ledger and never rewrites it; the follow-up
 * feed, its register and the planning cost table are written by commands;
 * and the release manifest template the kit carries is not a release. A row
 * in documents.json still decides first. */
export const kitKinds = (root) => [
  {
    path: `${docRelative(root, "docs", "proposals")}/`,
    kind: "record",
  },
  {
    path: `${docRelative(root, "docs", "instance", "entropy-reducer", "runs")}/`,
    kind: "record",
  },
  { path: docRelative(root, "lineage", "idea-ledger.md"), kind: "record" },
  { path: docRelative(root, "planning", "followups.md"), kind: "generated" },
  { path: docRelative(root, "planning", "followups.json"), kind: "generated" },
  { path: docRelative(root, "planning", "cost-table.json"), kind: "generated" },
  {
    path: docRelative(root, "releases", "tag-manifest.template.json"),
    kind: "standing",
  },
];

/** The derived kind of one document and the rule that decided it. */
export function documentKind(
  root,
  file,
  { kinds = [], source, kit = kitKinds(root) } = {},
) {
  const override = overrideFor(kinds, file);
  if (override)
    return { kind: override.kind, rule: `override ${override.path}` };
  const fixed = overrideFor(kit, file);
  if (fixed) return { kind: fixed.kind, rule: `kit ${fixed.path}` };
  const passes = `${docRelative(root, "planning", "passes")}/`;
  if (file.startsWith(passes)) return { kind: "record", rule: "planning pass" };
  for (const key of RECORD_ROOTS) {
    const base = docRelative(root, key);
    if (!inside(base, file)) continue;
    if (file === `${base}/README.md`)
      return { kind: "standing", rule: `${key} root convention page` };
    return { kind: "record", rule: `${key} root` };
  }
  if (file.split("/").some((segment) => DATED_SEGMENT.test(segment)))
    return { kind: "record", rule: "dated name" };
  if (/\.md$/iu.test(file)) {
    const text = source ?? readDocumentInput(root, file, "document");
    if (hasGeneratedMarker(text))
      return { kind: "generated", rule: "generated marker" };
  }
  return { kind: "standing", rule: "default" };
}

/** Every document's kind, with the rule that decided it. */
export function documentKinds(root, { files, control } = {}) {
  control ??= readDocumentControl(root);
  files ??= documentFiles(root);
  const kinds = new Map();
  const kit = kitKinds(root);
  for (const file of files)
    kinds.set(file, documentKind(root, file, { kinds: control.kinds, kit }));
  return kinds;
}

const globPattern = (pattern) =>
  new RegExp(
    `^${pattern
      .split("*")
      .map((part) => part.replace(/[.+?^${}()|[\]\\]/gu, "\\$&"))
      .join("[^/]*")}$`,
    "u",
  );

/** The files an entry point reads: its own paths, with a `*` matching
 * within one path segment. */
function entryPointFiles(root, entry, tracked) {
  const files = new Set();
  for (const pattern of entry.files)
    if (pattern.includes("*")) {
      const matcher = globPattern(pattern);
      for (const file of tracked) if (matcher.test(file)) files.add(file);
    } else if (documentEntry(root, pattern)) files.add(pattern);
  return [...files].sort();
}

/** The lines of a Markdown file under one heading, up to the next heading of
 * the same or a higher level: [first, end) by line number, or null. */
export function sectionLines(source, heading) {
  const ast = parseMarkdown(source);
  const headings = [...markdownNodes(ast)].filter(
    (node) => node.type === "heading",
  );
  const text = (node) =>
    [...markdownNodes(node)]
      .filter((child) => ["text", "inlineCode"].includes(child.type))
      .map((child) => child.value)
      .join("")
      .trim();
  const at = headings.findIndex((node) => text(node) === heading);
  if (at < 0) return null;
  const next = headings
    .slice(at + 1)
    .find((node) => node.depth <= headings[at].depth);
  return [
    headings[at].position.start.line,
    next ? next.position.start.line : Number.POSITIVE_INFINITY,
  ];
}

/** The part of a Markdown file under one heading, up to the next heading of
 * the same or a higher level. */
export function sectionText(source, heading) {
  const ast = parseMarkdown(source);
  const headings = [...markdownNodes(ast)].filter(
    (node) => node.type === "heading",
  );
  const text = (node) =>
    [...markdownNodes(node)]
      .filter((child) => ["text", "inlineCode"].includes(child.type))
      .map((child) => child.value)
      .join("")
      .trim();
  const at = headings.findIndex((node) => text(node) === heading);
  if (at < 0) return null;
  const next = headings
    .slice(at + 1)
    .find((node) => node.depth <= headings[at].depth);
  return source.slice(
    headings[at].position.start.offset,
    next ? next.position.start.offset : source.length,
  );
}

const pathPart = (value) => {
  if (/^[a-z][a-z0-9+.-]*:|^\/\/|^#|^@/iu.test(value)) return null;
  try {
    return decodeURIComponent(value.split("#")[0].split("?")[0].trim()) || null;
  } catch {
    return null;
  }
};
/** A Markdown destination as the document it names, by the reference
 * resolution the document check uses: relative to the directory the linking
 * file was written in, or to the repository when it starts with a slash, and
 * through the move map. */
function linkTarget(moves, from, href, documents) {
  const path = pathPart(href);
  if (!path) return null;
  const target = referencePath(moves, from, toPosix(path));
  return documents.has(target) ? target : null;
}
/** A path an entry point quotes in code or a Read line: repository-relative,
 * as the roles read it, or else relative to the quoting file, each by the
 * same reference resolution. */
function quotedPath(moves, from, value, documents) {
  const path = pathPart(value);
  if (!path) return null;
  const reference = toPosix(path).replace(/^\/+/u, "");
  return (
    [`/${reference}`, reference]
      .map((candidate) => referencePath(moves, from, candidate))
      .find((candidate) => documents.has(candidate)) ?? null
  );
}

/** What each entry point names: its links and the paths its code spans
 * quote, kept when they name a document. */
export function entryPointNames(
  root,
  { control, documents, tracked, moves } = {},
) {
  control ??= readDocumentControl(root);
  documents ??= new Set(documentFiles(root));
  moves ??= moveIndex(root);
  tracked ??= runGitPathList(root, [
    "ls-files",
    "-z",
    "--cached",
    "--others",
    "--exclude-standard",
  ]).map(toPosix);
  const rows = [];
  for (const entry of control.entryPoints)
    for (const file of entryPointFiles(root, entry, tracked)) {
      const source = readDocumentInput(root, file, "document");
      // The whole document is parsed, so a reference link under the entry
      // point resolves through a definition anywhere in the file; the entry
      // point's own lines decide which links and quotes it names.
      let inScope;
      if (entry.heading !== undefined) {
        const range = sectionLines(source, entry.heading);
        inScope = range
          ? (line) => line >= range[0] && line < range[1]
          : () => false;
      } else {
        const matcher = new RegExp(entry.lines, "u");
        const lines = new Set(
          source
            .split("\n")
            .flatMap((line, index) => (matcher.test(line) ? [index + 1] : [])),
        );
        inScope = (line) => lines.has(line);
      }
      const named = new Set();
      for (const { href, line } of markdownLinks(source))
        if (inScope(line)) {
          const path = linkTarget(moves, file, href, documents);
          if (path) named.add(path);
        }
      const spans =
        entry.heading !== undefined
          ? markdownCodeSpans(source)
          : source.split("\n").flatMap((text, index) =>
              [...text.matchAll(/`([^`\n]+)`/gu)].map((match) => ({
                value: match[1],
                line: index + 1,
              })),
            );
      for (const { value, line } of spans)
        if (inScope(line)) {
          const path = quotedPath(moves, file, value, documents);
          if (path) named.add(path);
        }
      rows.push({
        entryPoint: entry.id,
        file,
        found:
          entry.heading === undefined ||
          sectionLines(source, entry.heading) !== null,
        names: [...named].sort(),
      });
    }
  return rows;
}

/** The tracked program sources a command runs: scripts and package sources,
 * without tests and fixtures, whose naming a file is not a reader. */
function programText(root) {
  return runGitPathList(root, [
    "ls-files",
    "-z",
    "--cached",
    "--others",
    "--exclude-standard",
    "--",
    "scripts",
    "packages",
  ])
    .map(toPosix)
    .filter(
      (file) =>
        /\.(?:mjs|cjs|js|ts)$/u.test(file) &&
        !/(?:^|\/)(?:test-[^/]*|[^/]*\.test\.[a-z]+)$/u.test(file) &&
        !/(?:^|\/)(?:fixtures|test|dist)\//u.test(file) &&
        !file.endsWith(".d.ts"),
    )
    .map((file) => {
      try {
        return readFileSync(join(root, file), "utf8");
      } catch {
        return "";
      }
    })
    .join("\n");
}

/** The names a program would use for a document: its repository path and
 * its path under its configured root, never a bare README. */
const escapePattern = (text) => text.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
const quoted = (text) => `["'\`]${escapePattern(text)}["'\`]`;
// A whole path in program text is a complete token: it starts after a
// delimiter and ends at one, at a fragment, query or line suffix, or at a
// sentence's final period, never inside a longer path on either side.
const PATH_START = "(?<=^|[\\s\"'`(\\[{<,;:=])";
const PATH_END = "(?=$|[\\s\"'`)\\]}>,;:#?!]|\\.(?:$|[\\s\"'`)\\]}>]))";

/** The most specific configured root holding a document: its key and the
 * document's path beneath it. */
function rootOf(roots, file) {
  const [key, path] =
    roots
      .filter(([, base]) => inside(base, file) && base !== file)
      .sort(([, a], [, b]) => b.length - a.length)[0] ?? [];
  return key === undefined ? null : { key, name: file.slice(path.length + 1) };
}

/** Whether the program text reads a document, by a reference that names it
 * and no other document: its repository path as a whole path, neither the
 * tail nor the head of a longer one; its path under its configured root after
 * that root's key, as in docPath(root, "control", "budgets.json"); or that
 * path alone as a string literal when no other document has it under its own
 * root. A bare README name binds nothing. */
function programReader(root, files) {
  const roots = Object.entries(loadConfig(root).roots).map(([key, path]) => [
    key,
    toPosix(path).replace(/\/+$/u, ""),
  ]);
  const shared = new Map();
  for (const file of files) {
    const under = rootOf(roots, file);
    if (under) shared.set(under.name, (shared.get(under.name) ?? 0) + 1);
  }
  let program = null;
  return (file) => {
    if (/(?:^|\/)README\.md$/u.test(file)) return false;
    program ??= programText(root);
    if (
      new RegExp(`${PATH_START}${escapePattern(file)}${PATH_END}`, "u").test(
        program,
      )
    )
      return true;
    const under = rootOf(roots, file);
    if (!under || under.name.length <= 5) return false;
    const segments = under.name.split("/").map(quoted).join("\\s*,\\s*");
    if (
      new RegExp(
        `${quoted(under.key)}\\s*,\\s*(?:${quoted(under.name)}|${segments})`,
        "u",
      ).test(program)
    )
      return true;
    return (
      shared.get(under.name) === 1 &&
      new RegExp(quoted(under.name), "u").test(program)
    );
  };
}

/** For each standing document, the entry points that name it, the standing
 * or generated documents that link to it, whether a program names it, and
 * whether a reader reaches it: from an entry point's own file or a document
 * it names, along links through standing and generated pages, or by a
 * command that reads it. A record's links bind nothing: a reader who follows
 * a record is reading what happened. `links` keeps each parsed page's links
 * for a caller that judges them. */
export function readerBindings(
  root,
  { files, control, kinds, names, moves } = {},
) {
  control ??= readDocumentControl(root);
  files ??= documentFiles(root);
  kinds ??= documentKinds(root, { files, control });
  moves ??= moveIndex(root);
  const documents = new Set(files);
  names ??= entryPointNames(root, { control, documents, moves });
  const kindOf = (file) => kinds.get(file)?.kind;
  const namedBy = new Map(),
    linkedFrom = new Map(),
    links = new Map(),
    parsed = new Map();
  for (const row of names) {
    for (const path of [row.file, ...row.names]) {
      if (!documents.has(path)) continue;
      if (!namedBy.has(path)) namedBy.set(path, new Set());
      namedBy.get(path).add(row.entryPoint);
    }
  }
  for (const file of files) {
    if (!/\.md$/iu.test(file) || kindOf(file) === "record") continue;
    const targets = new Set();
    const found = markdownLinks(readDocumentInput(root, file, "document"));
    parsed.set(file, found);
    for (const { href } of found) {
      const path = linkTarget(moves, file, href, documents);
      if (path && path !== file) targets.add(path);
    }
    links.set(file, targets);
    for (const target of targets) {
      if (!linkedFrom.has(target)) linkedFrom.set(target, new Set());
      linkedFrom.get(target).add(file);
    }
  }
  const reached = new Set(namedBy.keys());
  const queue = [...reached];
  while (queue.length) {
    const file = queue.shift();
    if (kindOf(file) === "record") continue;
    for (const target of links.get(file) ?? [])
      if (!reached.has(target)) {
        reached.add(target);
        queue.push(target);
      }
  }
  const readsDocument = programReader(root, files);
  const bindings = new Map();
  for (const file of files) {
    if (kindOf(file) !== "standing") continue;
    const readByProgram = !reached.has(file) && readsDocument(file);
    bindings.set(file, {
      entryPoints: [...(namedBy.get(file) ?? [])].sort(),
      linkedFrom: [...(linkedFrom.get(file) ?? [])]
        .filter((source) => kindOf(source) !== "record")
        .sort(),
      readByProgram,
      bound: reached.has(file) || readByProgram,
    });
  }
  return Object.assign(bindings, { links: parsed });
}

const KIT_MANIFEST = "KIT-MANIFEST.json";
/** Files the kit carries byte for byte into an instance; the instance cannot
 * edit them, so their kinds and readers are the kit's to judge. */
export function kitFiles(root) {
  const path = join(root, KIT_MANIFEST);
  if (!existsSync(path)) return new Set();
  return new Set(
    JSON.parse(readFileSync(path, "utf8")).files.map((entry) => entry.path),
  );
}

/** The red-tag block a planning pass document carries between its markers:
 * the pass whose block this one follows (null for the first block) and the
 * tags. Naming the predecessor makes the order of passes a recorded fact, so
 * no date, commit time or slug decides which pass came later. */
export function redTagBlock(source, file) {
  const starts = source.split(RED_TAG_START).length - 1,
    ends = source.split(RED_TAG_END).length - 1;
  if (!starts && !ends) return null;
  if (
    starts !== 1 ||
    ends !== 1 ||
    source.indexOf(RED_TAG_END) < source.indexOf(RED_TAG_START)
  )
    throw new Error(`${file}: the red-tag block needs one ordered marker pair`);
  const inner = source
    .slice(
      source.indexOf(RED_TAG_START) + RED_TAG_START.length,
      source.indexOf(RED_TAG_END),
    )
    .replace(/^\s*```json\s*\n/u, "")
    .replace(/\n```\s*$/u, "")
    .trim();
  let block;
  try {
    block = JSON.parse(inner);
  } catch {
    throw new Error(`${file}: the red-tag block holds invalid JSON`);
  }
  if (
    !block ||
    typeof block !== "object" ||
    Array.isArray(block) ||
    !(
      block.after === null ||
      (typeof block.after === "string" && block.after)
    ) ||
    !Array.isArray(block.tags)
  )
    throw new Error(
      `${file}: the red-tag block holds an object with after, the pass whose block it follows or null for the first block, and tags`,
    );
  if (
    block.tags.some(
      (row) =>
        typeof row?.path !== "string" ||
        !row.path ||
        typeof row.since !== "string" ||
        !row.since ||
        (row.disposition !== undefined && typeof row.disposition !== "string"),
    )
  )
    throw new Error(
      `${file}: each red tag needs a path, a since naming the pass that tagged it and an optional disposition`,
    );
  return { after: block.after, tags: block.tags };
}

export function renderRedTagBlock({ after = null, tags = [] } = {}) {
  return `${RED_TAG_START}\n\n\`\`\`json\n${JSON.stringify({ after, tags }, null, 2)}\n\`\`\`\n\n${RED_TAG_END}\n`;
}

const passDate = (file) =>
  /(\d{4}-\d{2}-\d{2})(?=\.md$)/u.exec(file)?.[1] ?? "";

/** The commit that first recorded a pass document at its path, or null for a
 * document no commit holds yet. */
function addedIn(root, file) {
  const commits = runGit(
    root,
    ["log", "--diff-filter=AR", "--format=%H", "--", file],
    { onFailure: () => "" },
  )
    .split("\n")
    .filter(Boolean);
  return commits.at(-1) ?? null;
}

const descends = (root, older, newer) =>
  runGit(root, ["merge-base", "--is-ancestor", older, newer], {
    onFailure: () => null,
  }) !== null;

/** The dated planning pass documents, by the date their names end with. */
export function passDocuments(root, files) {
  const passes = `${docRelative(root, "planning", "passes")}/`;
  return (files ?? documentFiles(root))
    .filter(
      (file) =>
        file.startsWith(passes) && /\.md$/iu.test(file) && passDate(file),
    )
    .sort(
      (a, b) => passDate(a).localeCompare(passDate(b)) || a.localeCompare(b),
    );
}

/** Whether a pass document that holds no block ran after the newest block's
 * pass. A later date says so; on the same date Git's history does, never a
 * commit time or a name: a document no commit holds yet is later than a
 * committed one, and of two committed ones the later is the one whose first
 * commit descends from the other's. Two documents one commit or one
 * uncommitted change brought are one pass's; first commits on lines that do
 * not descend from each other count as later, so that pass writes its block. */
function ranAfter(root, file, than) {
  const date = passDate(file),
    thanDate = passDate(than);
  if (date !== thanDate) return date > thanDate;
  const commit = addedIn(root, file),
    thanCommit = addedIn(root, than);
  if (commit === null) return thanCommit !== null;
  if (thanCommit === null || commit === thanCommit) return false;
  if (descends(root, thanCommit, commit)) return true;
  return !descends(root, commit, thanCommit);
}

/** The red-tag blocks in the order their passes ran, which each block states
 * by naming the pass it follows, and the dated pass documents after the
 * newest block that hold no block. Two blocks that follow one pass, two
 * first blocks or a block off the chain are refused: the later pass names
 * the other as the one it follows and carries its open tags. */
export function redTagHistory(root, files, moves = moveIndex(root)) {
  const dated = passDocuments(root, files);
  // A block is a record and keeps its bytes, so a document it names that a
  // later move took elsewhere is read where the map says it lives now.
  const current = (path) => currentPath(moves, path);
  const held = new Map();
  for (const file of dated) {
    const block = redTagBlock(readDocumentInput(root, file, "document"), file);
    if (block)
      held.set(file, {
        file,
        after: block.after === null ? null : current(block.after),
        rows: block.tags.map((row) => ({
          ...row,
          path: current(row.path),
          since: current(row.since),
        })),
      });
  }
  const blocks = [];
  if (held.size) {
    const firsts = [...held.values()].filter((block) => block.after === null);
    const next = new Map();
    for (const block of held.values()) {
      if (block.after === null) continue;
      if (!held.has(block.after))
        throw new Error(
          `${block.file}: the red-tag block follows ${block.after}, which holds no red-tag block`,
        );
      if (next.has(block.after))
        throw new Error(
          `${next.get(block.after).file} and ${block.file} both follow ${block.after}; the later pass names the other as the pass it follows and carries its open tags`,
        );
      next.set(block.after, block);
    }
    if (firsts.length !== 1)
      throw new Error(
        firsts.length
          ? `${firsts.map((block) => block.file).join(" and ")} each hold a first red-tag block; the later pass names the other as the pass it follows and carries its open tags`
          : `no red-tag block is the first: every block of ${[...held.keys()].join(", ")} follows another`,
      );
    for (let block = firsts[0]; block; block = next.get(block.file))
      blocks.push(block);
    if (blocks.length !== held.size)
      throw new Error(
        `the red-tag blocks of ${[...held.keys()]
          .filter((file) => !blocks.some((block) => block.file === file))
          .join(", ")} are not on the chain from ${firsts[0].file}`,
      );
  }
  const head = blocks.at(-1);
  const newer = head
    ? dated.filter((file) => !held.has(file) && ranAfter(root, file, head.file))
    : [];
  return { blocks, newer };
}

/** The newest pass document that holds a red-tag block, with its rows. */
export function latestRedTags(root, files) {
  return redTagHistory(root, files).blocks.at(-1) ?? null;
}

/** The tags still open after the newest block, read from the whole chain: a
 * tag stays open from the pass that raised it until a block disposes of it,
 * whether or not the blocks between carried it and whether or not its
 * document still exists. */
export function openRedTags(history) {
  const open = new Map();
  for (const block of history.blocks)
    for (const row of block.rows)
      if (row.disposition?.trim()) open.delete(row.path);
      else
        open.set(row.path, {
          path: row.path,
          since: open.get(row.path)?.since ?? row.since,
        });
  return [...open.values()];
}

/** The tags left undisposed past their one pass: every open tag the newest
 * block did not raise, whether it carried the tag or dropped it, and every
 * open tag when a later pass holds no block. */
export function staleRedTags(history) {
  const head = history.blocks.at(-1);
  if (!head) return [];
  const open = openRedTags(history);
  if (history.newer.length)
    return open.map((row) => ({
      ...row,
      pass: history.newer.at(-1),
      reason: "the newer pass holds no red-tag block",
    }));
  const carried = new Set(head.rows.map((row) => row.path));
  return open
    .filter((row) => row.since !== head.file)
    .map((row) => ({
      ...row,
      pass: head.file,
      ...(carried.has(row.path)
        ? {}
        : { reason: "the newer pass dropped it without a disposition" }),
    }));
}

/** The structural report the document check reads: what each entry point
 * names, the records among them, the standing documents no reader reaches
 * and the red tags the newest pass left undisposed past their one pass. */
export function documentReport(root, { files } = {}) {
  const control = readDocumentControl(root);
  files ??= documentFiles(root);
  const kinds = documentKinds(root, { files, control });
  const documents = new Set(files);
  const moves = moveIndex(root);
  const names = entryPointNames(root, { control, documents, moves });
  const bindings = readerBindings(root, {
    files,
    control,
    kinds,
    names,
    moves,
  });
  const kit = kitFiles(root);
  const counts = Object.fromEntries(DOCUMENT_KINDS.map((kind) => [kind, 0]));
  for (const { kind } of kinds.values()) counts[kind]++;
  const recordsNamed = names.flatMap((row) =>
    row.names
      .filter((path) => kinds.get(path)?.kind === "record")
      .map((path) => ({ entryPoint: row.entryPoint, file: row.file, path })),
  );
  const missingEntryPoints = control.entryPoints
    .filter((entry) => !names.some((row) => row.entryPoint === entry.id))
    .map((entry) => entry.id);
  const unbound = [...bindings]
    .filter(([file, binding]) => !binding.bound && !kit.has(file))
    .map(([file]) => file);
  const history = redTagHistory(root, files, moves);
  const latest = history.blocks.at(-1) ?? null;
  const open = openRedTags(history);
  const stale = staleRedTags(history);
  return {
    control,
    counts,
    kinds,
    names,
    bindings,
    recordsNamed,
    missingEntryPoints,
    unbound,
    latestRedTags: latest,
    openRedTags: open,
    staleRedTags: stale,
  };
}
