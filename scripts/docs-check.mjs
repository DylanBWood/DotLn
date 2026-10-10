#!/usr/bin/env node
import { sha256Hex as hash } from "./lib/helpers.mjs";

import {
  existsSync,
  lstatSync,
  readFileSync,
  readdirSync,
  realpathSync,
  statSync,
} from "node:fs";
import { dirname, join, resolve, sep } from "node:path";
import {
  CONFIG_FILENAME,
  configuredRoots,
  docPath,
  docRelative,
  findLaunchpad,
  loadConfig,
} from "./lib/config.mjs";
import { runGit, runGitPathList } from "./lib/git.mjs";
import { branchFrontPage } from "./lib/front-page-scope.mjs";
import { isMainModule } from "./lib/paths.mjs";
import { readDecisions } from "./lib/meta.mjs";
import {
  RELEASE_HISTORY,
  checkReleaseHistory,
  historyCommand,
  historyEnd,
  historyStart,
  markerLine,
} from "./lib/release-history.mjs";
import { parsers } from "prettier/plugins/markdown.mjs";

const normalized = (value) => value.replace(/\s+/g, " ").trim();
const inside = (root, path) =>
  path === root || path.startsWith(`${root}${sep}`);

// The repository already pins Prettier. Its exported Markdown parser supplies
// block boundaries, decoded destinations and reference identities; no second
// Markdown grammar or new dependency is needed. The pinned parser is synchronous.
function parseMarkdown(source) {
  const ast = parsers.markdown.parse(source);
  if (ast?.type !== "root" || !Array.isArray(ast.children))
    throw new Error(
      "Unsupported Markdown parser AST; check the pinned Prettier version",
    );
  return ast;
}
function* nodes(node) {
  yield node;
  for (const child of node.children ?? []) yield* nodes(child);
}
const start = (node) => node.position.start.offset;
const end = (node) => node.position.end.offset;
// The optional `code` and `image` mappers rewrite an inline code span's text
// and an image's alt text, so a caller can judge prose apart from the code it
// quotes and the pictures it shows.
function renderedText(
  node,
  breakText = " ",
  { code = (value) => value, image = (alt) => alt } = {},
) {
  if (node.type === "text") return node.value;
  if (node.type === "inlineCode") return code(node.value);
  if (["image", "imageReference"].includes(node.type))
    return image(node.alt ?? "");
  if (node.type === "break") return breakText;
  return (node.children ?? [])
    .map((child) => renderedText(child, breakText, { code, image }))
    .join("");
}
function headingRecords(ast) {
  const seen = new Set();
  return [...nodes(ast)]
    .filter((node) => node.type === "heading")
    .map((node) => {
      const base = renderedText(node)
        .replace(/\r?\n/g, " ")
        .toLowerCase()
        .replace(/[^\p{L}\p{N}\p{M}\p{Pc} -]/gu, "")
        .trim()
        .replace(/ /g, "-");
      let anchor = base,
        suffix = 1;
      while (seen.has(anchor)) anchor = `${base}-${suffix++}`;
      seen.add(anchor);
      return { node, anchor, level: node.depth, start: start(node) };
    });
}
// `file` is relative to the configured product root, never just its basename.
export function productContent(file, source) {
  const totalBytes = Buffer.byteLength(source);
  // The parser discards leading BOMs before assigning offsets. Slice the
  // same text, but keep every BOM's three bytes in the document's total.
  source = source.replace(/^\uFEFF+/, "");
  const ast = parseMarkdown(source),
    failures = [],
    ranges = [];
  const titles = headingRecords(ast);
  // One generated block is registered, by product path and marker name: the
  // roadmap's release history (WO-086), whose rows the check below compares
  // with their recorded tags. Any other marker pair, and this one anywhere
  // else or malformed, exempts nothing; no heading exempts anything.
  if (file === RELEASE_HISTORY.product) {
    const mentions = source.split("\n").filter(markerLine).length;
    const markers = ast.children.filter(
      (node) =>
        node.type === "html" &&
        [historyStart, historyEnd].includes(node.value.trim()),
    );
    if (
      mentions === 2 &&
      markers.length === 2 &&
      markers[0].value.trim() === historyStart &&
      markers[1].value.trim() === historyEnd
    )
      ranges.push([start(markers[0]), end(markers[1])]);
    else if (mentions)
      failures.push(
        `the registered ${RELEASE_HISTORY.marker} block needs exactly one ordered pair of top-level marker lines; until then it exempts nothing`,
      );
  }
  ranges.sort((a, b) => a[0] - b[0]);
  const merged = [];
  for (const range of ranges) {
    const last = merged.at(-1);
    if (last && range[0] <= last[1]) last[1] = Math.max(last[1], range[1]);
    else merged.push([...range]);
  }
  const exempt = (node) =>
    merged.some(([left, right]) => start(node) >= left && start(node) < right);
  const shapes = [];
  for (const title of titles) {
    const raw = source.slice(start(title.node), end(title.node));
    const candidate =
      /^#{2,3}[ \t]+(Candidate —(?:\s|$)[\s\S]*?)(?:[ \t]+#+[ \t]*)?$/.exec(
        raw,
      );
    if (!exempt(title.node) && candidate)
      shapes.push({
        kind: "candidate",
        heading: title.anchor,
        label: normalized(candidate[1]),
      });
  }
  for (const node of nodes(ast)) {
    if (node.type !== "paragraph" || exempt(node)) continue;
    const strong = node.children[0];
    if (strong?.type !== "strong") continue;
    const raw = source.slice(start(strong), end(strong));
    if (!raw.startsWith("**")) continue;
    const label = normalized(raw.slice(2, -2));
    if (
      /\([^)]*\d{4}-\d{2}-\d{2}[^)]*\)\s*:/.test(label) ||
      /operator direction/i.test(label)
    )
      shapes.push({
        kind: "receipt",
        heading:
          titles.findLast((row) => row.start < start(node))?.anchor ?? "",
        label,
      });
  }
  const exemptBytes = merged.reduce(
    (sum, [left, right]) => sum + Buffer.byteLength(source.slice(left, right)),
    0,
  );
  return {
    bytes: totalBytes - exemptBytes,
    exemptBytes,
    shapes,
    failures,
  };
}

export function markdownLinks(source) {
  const ast = parseMarkdown(source),
    definitions = new Map();
  for (const node of nodes(ast))
    if (node.type === "definition" && !definitions.has(node.identifier))
      definitions.set(node.identifier, node.url);
  const links = [];
  for (const node of nodes(ast)) {
    const href = ["link", "image"].includes(node.type)
      ? node.url
      : ["linkReference", "imageReference"].includes(node.type)
        ? definitions.get(node.identifier)
        : undefined;
    if (href) links.push({ href, line: node.position.start.line });
  }
  return links;
}

function anchors(source) {
  const ast = parseMarkdown(source);
  const result = new Set(headingRecords(ast).map((row) => row.anchor));
  for (const node of nodes(ast)) {
    if (node.type !== "html") continue;
    const html = node.value.replace(/<!--[\s\S]*?-->/g, "");
    for (const match of html.matchAll(
      /<[a-z][\w:-]*\b[^>]*?\s(?:id|name)\s*=\s*(?:"([^"]+)"|'([^']+)'|([^\s"'=<>`]+))[^>]*>/gi,
    ))
      result.add(match[1] ?? match[2] ?? match[3]);
  }
  return result;
}

export function markdownFiles(root) {
  const roots = Object.values(loadConfig(root).roots).map((path) =>
    resolve(root, path),
  );
  const privateRoots = [
    docPath(root, "intake"),
    docPath(root, "control", "local"),
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
    .filter(
      (file) =>
        file.endsWith(".md") &&
        existsSync(join(root, file)) &&
        (dirname(file) === "." ||
          roots.some((path) => inside(path, resolve(root, file)))) &&
        !privateRoots.some((path) => inside(path, resolve(root, file))),
    )
    .sort();
}

export function linkFailures(root, files = markdownFiles(root)) {
  const failures = [],
    cache = new Map();
  const physicalRoot = realpathSync(root);
  for (const file of files) {
    const source = readFileSync(join(root, file), "utf8");
    for (const { href, line } of markdownLinks(source)) {
      if (/^[a-z][a-z0-9+.-]*:|^\/\//i.test(href)) continue;
      let pathname, fragment;
      try {
        const [pathQuery, ...parts] = href.split("#");
        pathname = decodeURIComponent(pathQuery.split("?")[0]);
        fragment = decodeURIComponent(parts.join("#"));
      } catch {
        failures.push({ file, href, line, reason: "invalid URL encoding" });
        continue;
      }
      // Relative navigation is judged in the repository file's context,
      // including PR body sources. Publishing does not rewrite their links.
      const target = pathname
        ? resolve(
            pathname.startsWith("/") ? root : dirname(join(root, file)),
            pathname.replace(/^\//, ""),
          )
        : join(root, file);
      const fail = (reason) => failures.push({ file, href, line, reason });
      if (!inside(root, target)) {
        fail("destination escapes the repository");
        continue;
      }
      if (!existsSync(target)) {
        fail("missing file");
        continue;
      }
      if (!inside(physicalRoot, realpathSync(target))) {
        fail("destination escapes the repository through a symlink");
        continue;
      }
      if (!fragment || !/\.md$/i.test(target)) continue;
      if (!statSync(target).isFile()) {
        fail("anchor target is not a file");
        continue;
      }
      if (
        [docPath(root, "intake"), docPath(root, "control", "local")].some(
          (path) => inside(path, target),
        )
      ) {
        fail("anchor target is private");
        continue;
      }
      if (!cache.has(target)) {
        const content = readFileSync(target, "utf8");
        cache.set(target, {
          lines: content.trimEnd().split("\n").length,
          anchors: anchors(content),
        });
      }
      const targetInfo = cache.get(target);
      const lineAnchor = /^L(\d+)(?:-L(\d+))?$/.exec(fragment);
      if (
        lineAnchor &&
        Number(lineAnchor[1]) > 0 &&
        Number(lineAnchor[2] ?? lineAnchor[1]) >= Number(lineAnchor[1]) &&
        Number(lineAnchor[2] ?? lineAnchor[1]) <= targetInfo.lines
      )
        continue;
      if (!targetInfo.anchors.has(fragment)) fail("missing anchor");
    }
  }
  return failures;
}

const shapeKey = (shape) => JSON.stringify(shape);
const dispatchKey = (row) => `${row.path}#${row.id}`;
export const dispatchFingerprint = (row) => hash(row.dispatch);
export const validDispatch = (value) => {
  if (typeof value !== "string") return false;
  const match =
    /^(?:planning|ideation|resume|scope expand|conversation only|analysis|operator override):([^\r\n\u2028\u2029]*)$/.exec(
      value,
    );
  return Boolean(
    match && [...match[1].trim()].length <= 240 && match[1].trim().length,
  );
};

// A prospective advisory with content fingerprints for historical records.
// The output names records and never repeats the attributed words. A field an
// operator-named key attributes needs no quotation to count; a paraphrase
// marked as one does not count.
const PARAPHRASED = /^Paraphrase:/u;
const OPERATOR_FIELD = /^operator[A-Z]/u;
const CAPTURE_DIGEST = /^sha256:[0-9a-f]{64}$/u;
const attributedWords = (text) =>
  /\boperator\b[^.!?]*(?:["“]|(?:\s|:)['‘])/iu.test(normalized(text));
const quotedDispatch = (text) => /["“]|(?:^|[\s:])['‘]/u.test(text);
const captureCitation = (text) =>
  /(?:SHA-256[\s:()=-]*(?:sha256:)?|--capture-hash[\s=]+(?:sha256:)?)[a-f0-9]{64}\b/iu.test(
    text,
  );
function* provenanceRecords(paragraph, source) {
  // Several header fields can share a paragraph. Only a bold label at a
  // line boundary starts a field; inline bold prose stays in its record.
  const fields = paragraph.children
    .map((child, index) => ({ child, index, label: renderedText(child) }))
    .filter(
      ({ child, label }) =>
        child.type === "strong" &&
        /^[^:\r\n]+:$/u.test(label) &&
        /(?:^|\n)[\t ]*$/u.test(source.slice(start(paragraph), start(child))),
    );
  const textBetween = (from, to) =>
    paragraph.children
      .slice(from, to)
      .map((child) => renderedText(child))
      .join("")
      .trimEnd();
  // Preserve the original plain-label standalone paragraph form too.
  const leading = textBetween(0, fields[0]?.index);
  if (/^(?:Nomination )?Provenance:/iu.test(leading)) yield leading;
  for (let index = 0; index < fields.length; index++)
    if (/^(?:Nomination )?Provenance:$/iu.test(fields[index].label))
      yield textBetween(fields[index].index, fields[index + 1]?.index);
}
export function operatorWordFindings(root, files) {
  const findings = [];
  const push = (file, record, text, dispatch = "", line) =>
    findings.push({
      file,
      record,
      fingerprint: hash(normalized(JSON.stringify([text, dispatch]))),
      ...(line ? { line } : {}),
    });
  const check = (file, record, text, dispatch = "", captureText = text) => {
    if (
      (!attributedWords(text) && !quotedDispatch(dispatch)) ||
      captureCitation(captureText)
    )
      return;
    push(file, record, text, dispatch);
  };
  const orders = docPath(root, "workOrders");
  if (existsSync(orders))
    for (const name of readdirSync(orders)
      .filter((name) => /^WO-\d{3}.*\.md$/u.test(name))
      .sort()) {
      const file = docRelative(root, "workOrders", name),
        source = readFileSync(join(orders, name), "utf8");
      // Every provenance field counts in document order, whether or not it
      // attributes words, so a record's key never depends on an earlier one.
      let ordinal = 0;
      for (const node of nodes(parseMarkdown(source))) {
        if (node.type !== "paragraph") continue;
        for (const text of provenanceRecords(node, source))
          check(
            file,
            ++ordinal === 1 ? "provenance" : `provenance-${ordinal}`,
            text,
          );
      }
    }
  // A decisions file is read and split once for all of its records.
  const sections = new Map();
  for (const row of readDecisions(root)) {
    if (!sections.has(row.path))
      sections.set(
        row.path,
        readFileSync(join(root, row.path), "utf8").split(/(?=^##\s)/mu),
      );
    const section =
      sections
        .get(row.path)
        .find((part) => new RegExp(`^##\\s+${row.id}\\b`, "u").test(part)) ??
      "";
    // A JSON block is removed whole from its fence line, so a backquote run
    // inside one of its strings cannot open a fence that swallows the rest.
    const prose = section
      .replace(/^```json\n[\s\S]*?^```[^\n]*/gmu, "")
      .replace(/```[\s\S]*?```/gu, "");
    const captureText = JSON.stringify(row) + prose;
    check(
      row.path,
      row.id,
      `${row.decision}\n${prose}`,
      row.dispatch,
      captureText,
    );
    // The fields that quote words are read too, each under its own record.
    const fields = [
      ...(Array.isArray(row.evidence) ? row.evidence : []).map(
        (text, index) => [`evidence-${index + 1}`, text],
      ),
      ...(Array.isArray(row.rejected) ? row.rejected : []).map(
        (entry, index) => [`rejected-${index + 1}.reason`, entry?.reason],
      ),
      ...["reason", "misread", "meant"].map((key) => [key, row[key]]),
    ];
    for (const [key, text] of fields)
      if (typeof text === "string")
        check(row.path, `${row.id}/${key}`, text, "", captureText);
    // An operator-named field attributes its value by its key alone.
    for (const key of Object.keys(row)) {
      if (!OPERATOR_FIELD.test(key) || key === "operatorQuote") continue;
      const values = [row[key]].flat();
      values.forEach((value, index) => {
        if (
          typeof value !== "string" ||
          PARAPHRASED.test(value) ||
          captureCitation(captureText)
        )
          return;
        push(
          row.path,
          `${row.id}/${key}${values.length > 1 ? `-${index + 1}` : ""}`,
          value,
        );
      });
    }
  }
  // Reports and planning documents: each paragraph that attributes words is a
  // record keyed by its own content, so an insertion above it keeps its key.
  const documentRoots = ["verifications", "finalReviews", "planning"].map(
    (key) => docPath(root, key),
  );
  for (const file of files ?? markdownFiles(root)) {
    const absolute = resolve(root, file);
    if (!documentRoots.some((path) => inside(path, absolute))) continue;
    const source = readFileSync(absolute, "utf8");
    if (!/operator/iu.test(source)) continue;
    const seen = new Map();
    for (const node of nodes(parseMarkdown(source))) {
      if (node.type !== "paragraph") continue;
      const text = renderedText(node);
      if (!attributedWords(text) || captureCitation(text)) continue;
      const base = `paragraph-${hash(normalized(text)).slice(0, 12)}`;
      const count = (seen.get(base) ?? 0) + 1;
      seen.set(base, count);
      push(
        file,
        count === 1 ? base : `${base}-${count}`,
        text,
        "",
        node.position?.start?.line,
      );
    }
  }
  return findings;
}

/** A typed operator quotation must carry the capture digest of the words it
 * quotes; one that lacks it is a failure, never an advisory. */
export function operatorQuoteFailures(rows) {
  const failures = [];
  for (const row of rows) {
    if (row.operatorQuote === undefined) continue;
    [row.operatorQuote].flat().forEach((quote, index) => {
      if (!(
        quote &&
        typeof quote === "object" &&
        typeof quote.text === "string" &&
        quote.text.trim() &&
        CAPTURE_DIGEST.test(quote.captureSha256 ?? "")
      ))
        failures.push(
          `${row.path}#${row.id}: operatorQuote ${index + 1} needs text and captureSha256 (sha256:<digest> of the captured words in ignored intake); paraphrase instead of quoting`,
        );
    });
  }
  return failures;
}

// A private absolute path: a home directory or a private temporary directory.
// Placeholders such as /Users/... and relative tails such as .runtime/tmp/ are
// not paths; a bare /tmp/ mention names no file.
const HOME_PATH =
  /(?<![\w.~-])\/(?:(?:Users|home)\/[A-Za-z0-9_][\w.-]*|(?:private\/)?(?:var\/folders|tmp)\/[A-Za-z0-9_])/u;
export function homePathFindings(root, files = markdownFiles(root)) {
  const findings = [];
  for (const file of files)
    readFileSync(join(root, file), "utf8")
      .split("\n")
      .forEach((text, index) => {
        if (HOME_PATH.test(text))
          findings.push({
            file,
            line: index + 1,
            fingerprint: hash(normalized(text)),
          });
      });
  return findings;
}

export function operatorWordAdvisories(root, baseline = {}, files) {
  const findings = operatorWordFindings(root, files);
  const current = findings.filter(
    (row) => baseline[`${row.file}#${row.record}`] !== row.fingerprint,
  );
  return {
    current: current.length,
    historical: findings.length - current.length,
    rows: current,
  };
}

// The front page is owned, not appended to. The control record names the
// page, the marker pairs of its generated blocks (written by commands, never
// by hand) and the "What runs today" section with its line budget, one
// sentence per physical line. The record that governs is the one at the merge
// base with main, so a branch cannot switch the guard off by editing the
// record; the working-tree record is read only when the base has none, which
// is the one branch that installs the guard. A change to the page outside the
// generated blocks, or to the record itself, is admitted only when the
// branch's order declares the page in its leading header. Without any record
// there is no judgment; without a resolvable base only the shape, the budget
// and the identifier screen are judged.
export const FRONT_PAGE_CONTROL = "front-page.json";
const FRONT_PAGE_BASE = "main";
const exactMarker = (text) =>
  typeof text === "string" && /^<!--.*-->$/.test(text) && text === text.trim();
function parseFrontPageControl(text, label) {
  let control;
  try {
    control = JSON.parse(text);
  } catch (error) {
    return {
      failure: `${label}: invalid front-page control record: ${error.message}`,
    };
  }
  const section = control?.whatRunsToday;
  const problem =
    control?.schemaVersion !== 1
      ? "schemaVersion must be 1"
      : typeof control.page !== "string" || !control.page.endsWith(".md")
        ? "page must name a Markdown file"
        : !Array.isArray(control.generatedBlocks) ||
            control.generatedBlocks.some(
              (block) => !exactMarker(block?.start) || !exactMarker(block?.end),
            )
          ? "generatedBlocks must list objects whose start and end are exact HTML comment lines"
          : !exactMarker(section?.start) || !exactMarker(section?.end)
            ? "whatRunsToday.start and whatRunsToday.end must be exact HTML comment lines"
            : control.generatedBlocks.some(
                  (block) =>
                    [block.start, block.end].includes(section.start) ||
                    [block.start, block.end].includes(section.end),
                )
              ? "whatRunsToday markers cannot also bound a generated block"
              : !Number.isSafeInteger(section.lineBudget) ||
                  section.lineBudget < 1
                ? "whatRunsToday.lineBudget must be a positive integer"
                : null;
  return problem
    ? { failure: `${label}: invalid front-page control record: ${problem}` }
    : { control };
}
// The page's lines with every generated block's interior removed, each with
// its line number, so two versions differ only where hands, not commands,
// wrote, and a finding can name its line.
function outsideGeneratedBlocks(text, blocks) {
  const lines = text.split("\n").map((line) => line.replace(/\r$/, ""));
  const kept = [];
  let skipping = null;
  lines.forEach((line, index) => {
    if (skipping) {
      if (line === skipping) skipping = null;
      else return kept.at(-1).interior.push(line);
    }
    const block = blocks.find((entry) => entry.start === line);
    kept.push({ line, number: index + 1, ...(block ? { interior: [] } : {}) });
    if (block) skipping = block.end;
  });
  // A block whose end never comes is reported by the caller instead of
  // masking the rest of the page. A block's opening row carries the lines it
  // encloses as `interior`, so the section rules can read them.
  return Object.assign(kept, { unterminated: skipping });
}
const WHAT_RUNS_HEADING = "## What runs today";
// The guard judges the page as GitHub will show it, and GitHub's renderer is
// not the check's parser: rendering pages through GitHub shows the two
// disagree on where raw HTML begins and ends, on comments and references
// inside it, on elements GitHub hides, and on spellings the parser extends
// beyond GitHub's grammar (the corpus records each case). So the guard closes
// those surfaces instead of modelling them: the page holds no raw HTML outside
// code and its marker lines, and none of the parser's extensions. Each counted
// line is read twice, from the parser's rendering and from its raw source with
// the markup removed, and must be one sentence in both. The section's name is
// searched for in every parsed heading and in every raw line that could render
// as a heading.
//
// Inline node types whose rendered text the check knows: a reader sees the
// node's own value (text, inline code), its children's text (emphasis,
// strong, strikethrough, links and the link references the parser forms only
// for a label the page defines), an image, or a line break. The list is
// closed: a counted line holding any other type is refused rather than judged
// without that text, and each refusal names the fix.
const PROSE_INLINE = new Set([
  "text",
  "inlineCode",
  "emphasis",
  "strong",
  "delete",
  "link",
  "linkReference",
  "image",
  "imageReference",
  "break",
]);
// The pinned parser's extensions, which GitHub does not share: the page holds
// none of them anywhere, since each reads text GitHub shows another way.
const UNSHARED = new Set([
  "frontMatter",
  "math",
  "inlineMath",
  "liquidNode",
  "wikiLink",
]);
const NODE_FIX = {
  html: "raw HTML; write it as Markdown, put it in inline code, or escape the bracket as \\<",
  frontMatter: "front matter, which GitHub shows as page text; remove it",
  math: "a math block; put the expression in a fenced code block",
  liquidNode:
    "a template tag; escape its first brace with a backslash or put it in inline code",
  wikiLink:
    "a wiki link; escape its first bracket with a backslash or write a Markdown link",
  inlineMath:
    "inline math; escape each dollar sign with a backslash or put the expression in inline code",
  footnoteReference:
    "a footnote, whose note renders at the page foot outside the count; fold the note into the sentence",
};
const nodeFix = (type) =>
  NODE_FIX[type] ?? `a ${type} node; write it as Markdown text`;
// What a block between the markers is, and how to make it a counted sentence.
const BLOCKS = {
  list: "a list; drop the list marker and write each item as its own sentence",
  heading: "a heading; the section has no subheadings",
  html: "raw HTML; remove it, and keep notes for maintainers in the order's evidence",
  definition:
    "a link reference definition; move it to the end of the page or write an inline link",
  blockquote: "a block quote; drop the > and write the sentence plainly",
  code: "a code block; quote the code inline in a sentence",
  table: "a table; write each row's fact as its own sentence",
  thematicBreak: "a thematic break; remove it",
};
// The rendered text of a paragraph or heading, or the first descendant type
// outside the closed list.
export function proseText(node, breakText = " ") {
  const refused = [...nodes(node)].find(
    (child) => child !== node && !PROSE_INLINE.has(child.type),
  );
  return refused
    ? { refused: refused.type }
    : { text: renderedText(node, breakText) };
}
// Raw HTML: a "<" that starts a tag, comment, declaration or processing
// instruction. An autolink such as <https://…> or <name@host> is a link, and an
// escaped "\<" is text.
const HTML_OPENER =
  /(?<!\\)<(?=[A-Za-z/!?])(?!(?:[A-Za-z][A-Za-z0-9+.-]{1,31}:[^\s<>]*|[^\s<>@]+@[^\s<>@]+)>)/;
const withoutCodeSpans = (line) => line.replace(/(`+)(.+?)\1(?!`)/g, "");
// GitHub draws an emoji shortcode such as :rocket: as a picture. In a counted
// line it is refused, so the emoji itself is judged as a character; in a
// heading the name is read both with the picture and as typed.
// An alias that starts with a digit holds a letter, so a time such as 10:30:45
// is not one.
const SHORTCODE =
  ":(?:[a-z][a-z0-9_+-]*|[0-9][a-z0-9_+-]*[a-z_][a-z0-9_+-]*|\\+1|-1|100|1234):";
// Two names are the same when their letters and digits agree once invisible
// characters are removed and compatibility normalization and case folding
// applied. A look-alike letter from another script is a different letter, and
// so a different name.
const SECTION_NAME = "whatrunstoday";
const nameKey = (text) =>
  text
    .replace(/\p{Default_Ignorable_Code_Point}/gu, "")
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]/gu, "");
const namesSection = (text) =>
  [text.replace(new RegExp(SHORTCODE, "g"), " "), text]
    .map(nameKey)
    .includes(SECTION_NAME);
// Character references as HTML decodes them: numeric ones of any length, with
// or without the semicolon, and named ones through the pinned parser's table.
const decodeReference = (reference) => {
  const text = renderedText(parseMarkdown(`a${reference}a`));
  return /^a[\s\S]*a$/.test(text) ? text.slice(1, -1) : reference;
};
const decodeReferences = (text) =>
  text.replace(
    /&#(\d+);?|&#x([\da-f]+);?|&[a-z][a-z\d]*;/gi,
    (reference, decimal, hex) => {
      if (decimal === undefined && hex === undefined)
        return decodeReference(reference);
      const point = decimal ? Number(decimal) : parseInt(hex, 16);
      return point > 0 &&
        point <= 0x10ffff &&
        (point < 0xd800 || point > 0xdfff)
        ? String.fromCodePoint(point)
        : "\ufffd";
    },
  );
// An autolink such as <https://…> or <name@host> shows its address, which
// the raw reading masks; any other "<" is text, since the page holds no raw
// HTML.
const AUTOLINK =
  /<(?:[A-Za-z][A-Za-z0-9+.-]{1,31}:[^\s<>]*|[^\s<>@]+@[^\s<>@]+)>/g;
// Tags as HTML reads them: a quoted attribute value is part of its tag.
const HTML_TAG = /<(?:[^>"']|"[^"]*"|'[^']*')*>/g;
const unescape = (text) => text.replace(/\\([!-/:-@[-`{-~])/g, "$1");
// Bidirectional controls reorder what a reader sees, whether typed or written
// as a character reference.
const BIDI = /[\u202A-\u202E\u2066-\u2069]/;
// A line that could render as a heading: an ATX opener or setext underline,
// after any block-quote, list or footnote prefixes.
const CONTAINER = String.raw`^[ \t]*(?:(?:>|[-*+]|\d{1,9}[.)]|\[\^[^\]]+\]:)[ \t]*)*`;
const ATX_LINE = new RegExp(`${CONTAINER}#{1,6}(?:[ \\t]|$)`);
const SETEXT_UNDERLINE = new RegExp(`${CONTAINER}(?:=+|-+)[ \\t]*$`);
// Judge prose as a reader sees it. Invisible characters (format and other
// default-ignorable characters, controls, the blank braille pattern, the
// replacement character) read as spaces, so none can join two sentences out of
// the check's sight. A sentence ends at a Unicode sentence terminal, an
// ellipsis, the Greek question mark or an exclamation or question emoji; what
// may follow before the space is anything but a letter, a digit, a space or
// clause punctuation (closing quotes and brackets, note marks, dashes,
// emphasis delimiters GitHub may or may not render), or a short bracketed note
// mark such as [1]. Another sentence starts after whitespace; directly after
// an ideographic or fullwidth stop when a letter follows; where a lowercase letter or digit and a
// stop meet a capitalized word with no space (a name such as Socket.IO, whose
// stop meets capitals, is not a join); where two
// capitals and a stop meet a capitalized word; or where a stop meets a letter
// of a script without case.
// A trailing emoji after the final stop is decoration, not an unfinished
// sentence, unless the emoji is itself the stop.
const sentenceText = (text) =>
  text
    .replace(
      /[\p{Cf}\p{Default_Ignorable_Code_Point}\p{Cc}\u2800\ufffd\u{1D159}]/gu,
      " ",
    )
    .replace(/(?:\s|(?![❗❕❓❔‼⁉])\p{Extended_Pictographic})+$/u, "")
    .trim();
// The Greek question mark (U+037E) is written as an escape: it looks like an
// ASCII semicolon, which continues a sentence.
// Look-alike stops the property omits (enclosed "1." to "20.", vertical and
// Mongolian ellipses, Tibetan shad) end a sentence too.
const TERMINAL =
  "\\p{Sentence_Terminal}…‥⋯\\u037E❗❕❓❔\\u2488-\\u249B\\uFE19\\uFE30\\u1801\\u0F0D\\u0F0E";
// The alternatives share no character, so a long run cannot backtrack.
const TRAILING =
  "(?:[^\\p{L}\\p{Nd}\\s,;:،、，；：]|\\p{Lm}|[\\[(]\\^?[\\p{Lu}\\p{Ll}\\p{Lt}\\p{Lo}\\p{Nd}]{1,3}[\\])])*";
const SPACELESS = "。．！？｡︒︕︖﹒﹖﹗";
const SENTENCE_END = new RegExp(`[${TERMINAL}]${TRAILING}$`, "u");
const SENTENCE_BREAK = new RegExp(
  `[${TERMINAL}]${TRAILING}\\s+\\S|[${SPACELESS}]${TRAILING}\\p{L}`,
  "gu",
);
const SPACELESS_JOIN = new RegExp(
  `(?:\\p{Ll}|\\p{Nd})[${TERMINAL}]${TRAILING}\\p{Lu}(?:\\p{Ll}|\\s|$)|\\p{Lu}{2}[${TERMINAL}]${TRAILING}\\p{Lu}(?:\\p{Ll}|\\s|$)|\\p{Sentence_Terminal}${TRAILING}\\p{Lo}`,
  "gu",
);
// Inline code is judged apart: a quoted operator or dotted name is not a
// sentence break, but code that holds a sentence break before a capitalized
// word (after any quotes, brackets, dashes or numbers) holds two sentences, and a span
// that ends in a stop after a word ends one.
const CODE_SENTENCE = new RegExp(
  `[${TERMINAL}]${TRAILING}\\s+(?:[^\\p{L}\\s]+\\s+)*[^\\p{L}\\s]*\\p{Lu}`,
  "u",
);
const KEPT_STOP = new RegExp(
  `[^\\s${TERMINAL}]([${TERMINAL}]${TRAILING}\\s*)$`,
  "u",
);
const mask = (value) => {
  const kept = KEPT_STOP.exec(value)?.[1] ?? "";
  return value.slice(0, value.length - kept.length).replace(/\S/g, "0") + kept;
};
// A web or e-mail address shows as itself, so its stops are not prose; an
// address is ASCII, so text in another script after it stays prose.
const maskAddresses = (text) =>
  text.replace(
    /(?:https?:\/\/|www\.)[!-;=?-~]*(?=[!-;=?-~])[^\s<.!?,:;"')\]*_~]|[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+/g,
    mask,
  );
const breaks = (text) =>
  (text.match(SENTENCE_BREAK) ?? []).length +
  (text.match(SPACELESS_JOIN) ?? []).length;
// The raw reading of one source line: code spans set apart, link destinations
// and titles and autolinks removed, references decoded, escapes resolved
// and emphasis delimiters dropped.
function rawReading(line) {
  const code = [];
  const prose = unescape(
    decodeReferences(
      line
        .replace(/(`+)(.+?)\1(?!`)/g, (_, ticks, value) => {
          code.push(value);
          return mask(value);
        })
        .replace(/(?<!\\)\]\((?:[^)"']|"[^"]*"|'[^']*')*\)/g, "]")
        .replace(AUTOLINK, " "),
    ),
  )
    .replace(/!\[/g, " [")
    .replace(/[*_~]/g, "");
  return { prose: maskAddresses(sentenceText(prose)), code };
}
const quote = (text) =>
  JSON.stringify(text.length > 40 ? `${text.slice(0, 40)}…` : text);
// Constructs the page holds nowhere outside code and its generated blocks'
// interiors: raw HTML other than the registered marker lines, a parser
// extension GitHub does not share, and a bidirectional control. Generated
// interiors are read for bidirectional controls too.
function pageConstructs(rows, ast, page, markerLine) {
  const failures = [];
  const rowOf = (node) => rows[node.position.start.line - 1].number;
  const inCode = new Set(
    [...nodes(ast)]
      .filter((node) => node.type === "code")
      .flatMap((node) =>
        Array.from(
          { length: node.position.end.line - node.position.start.line + 1 },
          (_, offset) => node.position.start.line - 1 + offset,
        ),
      ),
  );
  const html = new Set();
  rows.forEach(({ line, number, interior }, index) => {
    for (const text of [line, ...(interior ?? [])])
      if (BIDI.test(text) || BIDI.test(decodeReferences(text)))
        failures.push(
          `${page}:${number}: a bidirectional control character, which reorders what a reader sees; remove it`,
        );
    if (!markerLine(line) && !inCode.has(index)) {
      const opener = HTML_OPENER.exec(withoutCodeSpans(line));
      if (opener) {
        html.add(index);
        failures.push(
          /^\s*<!--[\s\S]*-->\s*$/.test(line)
            ? `${page}:${number}: an HTML comment line; a generated block's marker lines are listed in the control record's generatedBlocks by the front-page order that adds the block, and a note for maintainers belongs in the order's evidence: ${quote(line.trim())}`
            : `${page}:${number}: ${nodeFix("html")}; the front page holds none outside its marker lines, since GitHub and the check's parser read it differently: ${quote(withoutCodeSpans(line).slice(opener.index))}`,
        );
      }
    }
  });
  for (const node of nodes(ast)) {
    const index = node.position.start.line - 1;
    if (UNSHARED.has(node.type))
      failures.push(`${page}:${rowOf(node)}: ${nodeFix(node.type)}`);
    else if (
      node.type === "html" &&
      !markerLine(rows[index].line) &&
      !html.has(index)
    ) {
      html.add(index);
      failures.push(
        `${page}:${rowOf(node)}: ${nodeFix("html")}; the front page holds none outside its marker lines: ${quote(node.value)}`,
      );
    }
  }
  return failures;
}
// The "What runs today" section is judged as one range: it opens at its
// heading and closes at the next heading of the same or a higher level, or
// the end of the page. The marker pair stands inside that range, in order,
// and nothing in the range but blank lines, generated blocks and the markers
// stands outside the pair, so every sentence under the heading is a line the
// budget counts; a sentence cannot escape the count by standing above the
// opening marker, below the closing one, under a subheading, or in a second
// section under the same heading, and the pair cannot move away from the
// heading. A blank line holds only spaces and tabs, as CommonMark defines it.
// `rows` are the page's lines outside the generated blocks' interiors, each
// with its line number, and `ast` their parse. Returns the counted rows, or
// null when the shape is not found, with the failures that say why.
function whatRunsSection(rows, ast, control, page) {
  const failures = [];
  const { start, end } = control.whatRunsToday;
  const blank = (line) => !/[^ \t]/.test(line);
  const generated = (line) =>
    control.generatedBlocks.find(
      (block) => block.start === line || block.end === line,
    );
  const at = (wanted) =>
    rows.flatMap((row, index) => (row.line === wanted ? [index] : []));
  const starts = at(start),
    ends = at(end);
  if (starts.length !== 1 || ends.length !== 1 || starts[0] >= ends[0]) {
    failures.push(
      `${page}: needs exactly one ordered pair of marker lines ${start} and ${end} around "What runs today"`,
    );
    return { failures, lines: null };
  }
  const rowOf = (node) => rows[node.position.start.line - 1].number;
  const linesOf = (node) =>
    Array.from(
      { length: node.position.end.line - node.position.start.line + 1 },
      (_, offset) => node.position.start.line - 1 + offset,
    );
  // The section's name is searched for twice: in every parsed heading at any
  // depth or nesting, with and without its pictures' alt text; and in every
  // raw line that could render as a heading (an ATX line, or the text over a
  // setext underline), generated interiors included, apart from the parsed
  // headings' own lines. A contents link or a sentence mentioning the section
  // is not a heading.
  const headings = [...nodes(ast)].filter(
    (node) =>
      node.type === "heading" &&
      [renderedText(node), renderedText(node, " ", { image: () => "" })].some(
        namesSection,
      ),
  );
  const own = new Set(headings.flatMap(linesOf));
  const raw = [];
  const candidates = rows.flatMap((row, index) => [
    ...(own.has(index)
      ? []
      : [
          ATX_LINE.test(row.line) ||
          SETEXT_UNDERLINE.test(rows[index + 1]?.line ?? "")
            ? { line: row.line, number: row.number, index }
            : null,
        ]),
    ...(row.interior ?? []).map((line) => ({ line, number: row.number })),
  ]);
  for (const candidate of candidates)
    if (
      candidate &&
      namesSection(
        unescape(decodeReferences(candidate.line.replace(HTML_TAG, " "))),
      )
    )
      raw.push(candidate);
  const inCode = new Set(
    [...nodes(ast)].filter((node) => node.type === "code").flatMap(linesOf),
  );
  const exampled = raw.some((candidate) => inCode.has(candidate.index));
  const found = headings.length + raw.length;
  if (found !== 1 || !headings.length) {
    failures.push(
      found > 1
        ? `${page}: needs exactly one heading ${WHAT_RUNS_HEADING}; found ${found}${raw.length ? `, ${raw.length} of them in a raw line at line ${raw.map((candidate) => candidate.number).join(", ")}` : ""}; the page names the section once${exampled ? ", even in an example in a code block, so change the example's heading" : ", so rename or remove the other heading"}`
        : `${page}: needs the heading ${WHAT_RUNS_HEADING}`,
    );
    return { failures, lines: null };
  }
  const [heading] = headings;
  if (heading.depth !== 2 || !ast.children.includes(heading)) {
    failures.push(`${page}: needs the top-level heading ${WHAT_RUNS_HEADING}`);
    return { failures, lines: null };
  }
  const headingAt = heading.position.start.line - 1,
    headingEndAt = heading.position.end.line - 1,
    [startAt] = starts,
    [endAt] = ends;
  const closer = ast.children.find(
    (node) =>
      node.type === "heading" &&
      node.depth <= heading.depth &&
      node.position.start.line - 1 > headingAt,
  );
  const closeAt = closer ? closer.position.start.line - 1 : rows.length;
  if (startAt <= headingEndAt || endAt >= closeAt) {
    failures.push(
      `${page}: the marker lines ${start} and ${end} stand under ${WHAT_RUNS_HEADING} and before the next heading; found them at lines ${rows[startAt].number} and ${rows[endAt].number}`,
    );
    return { failures, lines: null };
  }
  // The heading that closes the section names the next one on one line; a
  // heading whose only letters are a picture's alt text, or that renders no
  // letter or digit, or that spans lines, reads as the section running on.
  if (
    closer &&
    !nameKey(
      renderedText(closer, " ", { image: () => "" }).replace(
        new RegExp(SHORTCODE, "g"),
        " ",
      ),
    )
  )
    failures.push(
      `${page}:${rowOf(closer)}: the heading after ${WHAT_RUNS_HEADING} renders no letter or digit outside pictures and emoji, so a reader sees the section run on; name the next section`,
    );
  if (closer && renderedText(closer, "\n").includes("\n"))
    failures.push(
      `${page}:${rowOf(closer)}: the heading after ${WHAT_RUNS_HEADING} spans lines; write the next section's heading on one line`,
    );
  // Outside the pair, the range holds blank lines and generated blocks, each
  // of which holds only the one line its writer puts there.
  let run = null;
  const flushRun = () => {
    if (run)
      failures.push(
        `${page}:${run.join("-")}: prose under ${WHAT_RUNS_HEADING} outside the markers ${start} and ${end}; move each sentence between them, where the budget counts it, or end the section with a Markdown heading`,
      );
    run = null;
  };
  for (const { line, number, interior } of [
    ...rows.slice(headingEndAt + 1, startAt),
    ...rows.slice(endAt + 1, closeAt),
  ]) {
    const block = generated(line);
    if (block && (control.addedBlocks ?? []).includes(line))
      failures.push(
        `${page}:${number}: ${line} is a generated block main's record does not list; a new generated block stands in a section of its own, outside ${WHAT_RUNS_HEADING}`,
      );
    if (interior && interior.filter((text) => !blank(text)).length > 1)
      failures.push(
        `${page}:${number}: ${block.start} holds only the line ${block.writer ? `\`${block.writer}\`` : "its writer"} puts there; move other text between ${start} and ${end}`,
      );
    if (blank(line) || block) flushRun();
    else run = run ? [run[0], number] : [number];
  }
  flushRun();
  // Each counted line is one sentence of Markdown prose, read twice. The
  // parser reads each paragraph between the markers, refusing blocks, inline
  // types outside the closed list and inline code spanning lines; its
  // rendering must break into exactly the paragraph's lines, each one
  // sentence. Each line's raw reading must also be one sentence.
  const lines = rows.flatMap((row, index) =>
    index > startAt && index < endAt && !blank(row.line)
      ? [{ ...row, index }]
      : [],
  );
  const judged = new Set();
  const refuse = (row, reason) =>
    failures.push(
      `${page}:${row.number}: a "What runs today" line ${reason}: ${quote(row.line)}`,
    );
  for (const node of ast.children) {
    const first = node.position.start.line - 1,
      last = node.position.end.line - 1;
    if (first <= startAt || last >= endAt) continue;
    const counted = lines.filter(
      (row) => row.index >= first && row.index <= last,
    );
    counted.forEach((row) => judged.add(row.index));
    if (node.type !== "paragraph") {
      if (counted.length)
        refuse(
          counted[0],
          `must be Markdown prose, one sentence per line; it starts ${BLOCKS[node.type] ?? `a ${node.type} block`}`,
        );
      continue;
    }
    const inline = [...nodes(node)].find(
      (child) => child !== node && !PROSE_INLINE.has(child.type),
    );
    if (inline) {
      const row =
        counted.find(
          (entry) => entry.index === inline.position.start.line - 1,
        ) ?? counted[0];
      refuse(
        row,
        `must be Markdown prose, one sentence per line; it holds ${nodeFix(inline.type)}`,
      );
      continue;
    }
    const before = failures.length;
    counted.forEach((row, offset) => {
      const { prose, code } = rawReading(row.line);
      const next = counted[offset + 1];
      if (new RegExp(SHORTCODE).test(prose))
        refuse(
          row,
          "holds an emoji shortcode, which GitHub draws as a picture the check does not read; write the emoji itself or quote the code in inline code",
        );
      else if (!SENTENCE_END.test(prose))
        refuse(
          row,
          next && /^\s*\p{Ll}/u.test(next.line)
            ? `does not end a sentence; line ${next.number} continues it, and sentences here are never wrapped, so join the two lines`
            : "does not end a sentence; end it with a full stop, question or exclamation mark, or ellipsis",
        );
      else if (breaks(prose)) {
        const at = prose.search(
          new RegExp(`[${TERMINAL}]${TRAILING}\\s+\\S`, "u"),
        );
        refuse(
          row,
          `holds more than one sentence${at >= 0 ? `; the next starts at ${quote(prose.slice(at + 1).trimStart())}` : ""}. A stop followed by a space, or by a capitalized word with no space, starts a sentence wherever it stands (after an abbreviation such as "e.g.", inside quotation marks, at the end of inline code), so put each sentence on its own line, or reword that stop; a dotted name belongs in inline code`,
        );
      } else if (code.some((value) => CODE_SENTENCE.test(sentenceText(value))))
        refuse(
          row,
          "quotes inline code holding more than one sentence; quote one sentence's worth of code, or put each sentence on its own line",
        );
    });
    if (failures.length !== before) continue;
    const shown = maskAddresses(
      renderedText(node, "\n", { code: mask, image: (alt) => ` ${alt} ` }),
    )
      .split("\n")
      .map(sentenceText);
    if (
      shown.length !== counted.length ||
      shown.some((text) => !SENTENCE_END.test(text) || breaks(text))
    )
      refuse(
        counted[0],
        `and the paragraph it opens render as ${shown.length} line${shown.length === 1 ? "" : "s"} that are not one whole sentence each; write each sentence of plain prose on its own line`,
      );
  }
  for (const row of lines)
    if (!judged.has(row.index))
      refuse(row, "must be Markdown prose, one sentence per line");
  return { failures, lines };
}
const RECEIPT_SHAPES = [
  [/\bWO-\d{3}\b/i, "a work-order identifier"],
  [/\bD\d{3}\b/, "a decision identifier"],
  [/\b\d{4}-\d{2}-\d{2}\b/, "a date"],
  // A version may end a sentence, so a trailing full stop is allowed where
  // the release claim's stricter form would not count it.
  [/\bv\d+\.\d+\.\d+(?!\w|\.\d)/, "a version"],
  [/(?<![\w.])\d+\.\d+\.\d+(?!\w|\.\d)/, "a version number"],
];
// A receipt is screened as typed and as shown: with references decoded,
// escapes resolved, markup and emphasis removed, compatibility forms folded
// and every dash read as a hyphen.
const receiptReadings = (line) =>
  [
    line,
    unescape(
      decodeReferences(
        line.replace(/<!--[\s\S]*?(?:-->|$)/g, "").replace(HTML_TAG, ""),
      ),
    ).replace(/[*_~]/g, ""),
  ].map((text) => text.normalize("NFKC").replace(/[\p{Pd}−]/gu, "-"));
// The page's shape, judged from its text and the record alone: what a reader
// sees under "What runs today", and anywhere the page could carry a receipt, a
// second section or a construct GitHub reads differently. It reads no Git and
// no files, so the corpus judges each of its pages directly.
export function frontPageShapeFindings(
  current,
  control,
  page,
  recordPath = FRONT_PAGE_CONTROL,
) {
  const failures = [];
  const outside = outsideGeneratedBlocks(current, control.generatedBlocks);
  // CommonMark ends a line at a carriage return with no line feed, so such a
  // page means one thing to GitHub and another to a reader of its lines, and
  // the parser's line numbers would no longer match the rows every later rule
  // reads.
  const lone = /\r(?!\n)/.exec(current);
  if (lone) {
    failures.push(
      `${page}:${current.slice(0, lone.index).split("\n").length}: a carriage return without a line feed; save the page with LF or CRLF line endings`,
    );
    return { failures, lines: null, outside };
  }
  // GitHub's renderer reads a form feed or vertical tab as whitespace inside
  // links, labels and list markers where the check's parser does not, and the
  // two limit a link label's length differently, so the page holds neither a
  // control character nor a bracketed run of 1000 bytes.
  const controlChar =
    /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F]/.exec(current);
  if (controlChar) {
    failures.push(
      `${page}:${current.slice(0, controlChar.index).split("\n").length}: a control character U+${controlChar[0].codePointAt(0).toString(16).toUpperCase().padStart(4, "0")}, which GitHub and the check's parser read differently; remove it`,
    );
    return { failures, lines: null, outside };
  }
  for (const run of current.matchAll(/\[[^[\]]*\]/g))
    if (Buffer.byteLength(run[0]) >= 1000)
      failures.push(
        `${page}:${current.slice(0, run.index).split("\n").length}: a bracketed run of ${Buffer.byteLength(run[0])} bytes, whose link label GitHub and the check's parser read differently; shorten it below 1000 bytes`,
      );
  if (outside.unterminated)
    failures.push(
      `${page}: a generated block opens and never closes with ${outside.unterminated}`,
    );
  for (const block of control.generatedBlocks) {
    const opens = outside.filter((row) => row.line === block.start).length;
    if (opens !== 1)
      failures.push(
        opens
          ? `${page}: the generated block ${block.start} opens ${opens} times; it stands once, where its writer puts it`
          : `${page}: the generated block ${block.start} listed in ${recordPath} is not on the page; its writer puts it there, or a front-page order removes it from the record`,
      );
  }
  const markerLine = (line) =>
    [control.whatRunsToday.start, control.whatRunsToday.end].includes(line) ||
    control.generatedBlocks.some(
      (block) => block.start === line || block.end === line,
    );
  const ast = parseMarkdown(outside.map((row) => row.line).join("\n"));
  failures.push(...pageConstructs(outside, ast, page, markerLine));
  const section = whatRunsSection(outside, ast, control, page);
  failures.push(...section.failures);
  const { lineBudget } = control.whatRunsToday;
  if (section.lines && section.lines.length > lineBudget)
    failures.push(
      `${page}: "What runs today" holds ${section.lines.length} counted lines (the non-empty lines between its markers); the budget in ${recordPath} is ${lineBudget}. Rewrite the line your capability supersedes, or fold it into a related line as one sentence; planning moves the budget on ${FRONT_PAGE_BASE}`,
    );
  for (const { line, number } of outside)
    for (const reading of receiptReadings(line)) {
      const shape = RECEIPT_SHAPES.find(([pattern]) => pattern.test(reading));
      if (shape) {
        failures.push(
          `${page}:${number}: ${quote(reading.match(shape[0])[0])} is ${shape[1]} outside a generated block; the page names no order, decision, date or version in text, code or link paths, so drop it or link a page whose path carries none, and keep the receipt in the order's evidence`,
        );
        break;
      }
    }
  return { failures, lines: section.lines, outside };
}
export function frontPageFindings(root) {
  const failures = [],
    notices = [];
  let base = null;
  try {
    base = runGit(root, ["merge-base", "HEAD", FRONT_PAGE_BASE]);
  } catch {
    base = null;
  }
  const atBase = (path) => {
    try {
      return runGit(root, ["show", `${base}:${path}`], { trim: false });
    } catch {
      return null;
    }
  };
  // The record is found where the merge base's configuration puts the control
  // root, so a branch cannot move the record out of the check's sight by
  // editing the configuration.
  let recordPath;
  try {
    recordPath =
      base === null
        ? docRelative(root, "control", FRONT_PAGE_CONTROL)
        : `${configuredRoots(atBase(CONFIG_FILENAME)).control}/${FRONT_PAGE_CONTROL}`;
  } catch (error) {
    failures.push(
      `${CONFIG_FILENAME} at the merge base with ${FRONT_PAGE_BASE}: ${error.message}; the front-page control record cannot be found`,
    );
    return { failures, notices };
  }
  const recordFile = join(root, recordPath);
  const workingText = existsSync(recordFile)
    ? readFileSync(recordFile, "utf8")
    : null;
  const baseText = base ? atBase(recordPath) : null;
  if (workingText === null && baseText === null) return { failures, notices };
  const baseRecord =
    baseText === null
      ? null
      : parseFrontPageControl(
          baseText,
          `${recordPath} at ${base.slice(0, 12)}`,
        );
  if (baseRecord?.failure) {
    failures.push(baseRecord.failure);
    return { failures, notices };
  }
  const branch = runGit(root, ["branch", "--show-current"]);
  // The declaration is read at the merge base: an order filed on main carries
  // its field there, and a field added on the branch itself declares nothing.
  const scope = branchFrontPage(root, branch, (file) =>
    base === null ? null : atBase(file),
  );
  const pageOf = (record) => record?.control?.page ?? null;
  const declares = (record) =>
    pageOf(record) !== null && (scope.files?.includes(pageOf(record)) ?? false);
  // A declared order may move the record's page and generated blocks and is
  // judged by the record it wrote; every other branch is judged by the base's
  // record, which it cannot change.
  const workingRecord =
    workingText === null || workingText === baseText
      ? null
      : parseFrontPageControl(workingText, recordPath);
  if (workingRecord?.failure) failures.push(workingRecord.failure);
  const governing =
    baseRecord === null
      ? workingRecord
      : workingRecord && !workingRecord.failure && declares(baseRecord)
        ? workingRecord
        : baseRecord;
  if (!governing || governing.failure) return { failures, notices };
  // Whenever main has a record, the page and the section's markers and budget
  // are main's: a branch may add a generated block outside the section, but
  // cannot move the page or raise the budget that judges it.
  const baseControl = baseRecord?.control;
  const control = baseControl
    ? {
        ...baseControl,
        generatedBlocks: governing.control.generatedBlocks,
        addedBlocks: governing.control.generatedBlocks
          .filter(
            (block) =>
              !baseControl.generatedBlocks.some(
                (listed) => listed.start === block.start,
              ),
          )
          .map((block) => block.start),
      }
    : governing.control;
  if (
    baseControl &&
    workingRecord?.control &&
    workingRecord.control.page !== baseControl.page
  )
    failures.push(
      `${recordPath}: moves the front page from ${baseControl.page} to ${workingRecord.control.page}; the page moves only on ${FRONT_PAGE_BASE}, where planning moves it`,
    );
  const page = control.page;
  const admitted = declares(governing);
  const rule = `the front page changes only through an order whose leading header carries \`**Front page:** ${page}\`, and a sentence the page should carry is proposed in the order's evidence README`;
  if (baseText !== null && workingText !== baseText && !declares(baseRecord))
    failures.push(
      `${recordPath}: differs from its version at the merge base with ${FRONT_PAGE_BASE} ${scope.reason}; the record moves only with a front-page order`,
    );
  // GitHub may show another README in place of the page: one under .github,
  // or another README beside it.
  if (!page.includes("/"))
    for (const directory of [".github", "."]) {
      const path = join(root, directory);
      if (!existsSync(path) || !lstatSync(path).isDirectory()) continue;
      for (const name of readdirSync(path))
        if (
          /^readme(?:\.[a-z0-9]+)?$/i.test(name) &&
          !(directory === "." && name === page)
        )
          failures.push(
            `${directory === "." ? "" : `${directory}/`}${name}: GitHub may show this README in place of ${page}; the front page is ${page}, which the control record owns`,
          );
    }
  const file = join(root, page);
  if (!existsSync(file)) {
    failures.push(
      `${page}: the front-page control record names a missing page`,
    );
    return { failures, notices };
  }
  if (!lstatSync(file).isFile()) {
    failures.push(
      `${page}: the front page must be a regular file, not a link or directory`,
    );
    return { failures, notices };
  }
  const current = readFileSync(file, "utf8");
  const before = base === null ? null : atBase(page);
  const shape = frontPageShapeFindings(
    current,
    control,
    page,
    baseRecord ? `${recordPath} at the merge base` : recordPath,
  );
  const outside = shape.outside;
  const beforeOutside =
    before === null
      ? null
      : outsideGeneratedBlocks(before, control.generatedBlocks);
  const text = (rows) => rows.map((row) => row.line).join("\n");
  // An order is judged on its own change: on a branch that may not change the
  // page and has not, what the page shows is main's to repair, so it is
  // reported, not refused.
  const untouched =
    !admitted &&
    workingText === baseText &&
    beforeOutside !== null &&
    text(beforeOutside) === text(outside);
  if (untouched)
    notices.push(
      ...shape.failures.map(
        (finding) =>
          `${finding} (on ${FRONT_PAGE_BASE}; this branch does not change the page)`,
      ),
    );
  else failures.push(...shape.failures);
  if (base === null) {
    notices.push(
      `${page}: no merge base with ${FRONT_PAGE_BASE}; the front-page change is not compared`,
    );
    return { failures, notices };
  }
  // A base page that holds neither marker line is being brought under guard;
  // any other base page is compared.
  if (
    beforeOutside === null ||
    !beforeOutside.some((row) =>
      [control.whatRunsToday.start, control.whatRunsToday.end].includes(
        row.line,
      ),
    )
  )
    return { failures, notices };
  if (text(beforeOutside) === text(outside)) return { failures, notices };
  if (!admitted)
    failures.push(
      `${page}: changed outside its generated blocks ${scope.reason}; see \`git diff ${base.slice(0, 12)} -- ${page}\`; ${rule}. If the change is a command's output between marker lines, that block is not in ${recordPath}'s generatedBlocks; a front-page order lists it`,
    );
  return { failures, notices };
}

export function checkDocs(root, { ceilings, baseline, files } = {}) {
  ceilings ??= JSON.parse(
    readFileSync(docPath(root, "control", "doc-ceilings.json"), "utf8"),
  );
  baseline ??= JSON.parse(
    readFileSync(docPath(root, "control", "doc-baseline.json"), "utf8"),
  );
  if (ceilings.schemaVersion !== 1 || baseline.schemaVersion !== 1)
    throw new Error("Unsupported document control schema");
  if (
    !ceilings.documents ||
    !baseline.products ||
    !baseline.dispatches ||
    !Array.isArray(baseline.links)
  )
    throw new Error("Invalid document control records");
  for (const entry of baseline.links) {
    if (
      ![entry.file, entry.href, entry.reason].every(
        (value) => typeof value === "string" && value.length,
      ) ||
      !Number.isSafeInteger(entry.count) ||
      entry.count < 1
    )
      throw new Error(
        "Historical link exceptions require a source, destination, reason and positive safe-integer count",
      );
  }
  const homePaths = baseline.homePaths ?? {};
  if (
    homePaths === null ||
    typeof homePaths !== "object" ||
    Array.isArray(homePaths) ||
    Object.values(homePaths).some(
      (list) =>
        !Array.isArray(list) ||
        list.some((fingerprint) => !/^[0-9a-f]{64}$/u.test(fingerprint)),
    )
  )
    throw new Error(
      "Historical home-path exceptions require a file and SHA-256 line fingerprints",
    );
  files ??= markdownFiles(root);
  const failures = [],
    rows = [];
  const directory = docPath(root, "product");
  const products = readdirSync(directory, { recursive: true })
    .filter((file) => file.endsWith(".md"))
    .sort();
  const notices = [];
  for (const name of products) {
    const file = docRelative(root, "product", name);
    const source = readFileSync(join(directory, name), "utf8");
    const measured = productContent(name, source);
    failures.push(...measured.failures.map((failure) => `${file}: ${failure}`));
    if (name === RELEASE_HISTORY.product) {
      // The exemption stands on this comparison: the index's rule for tags.
      const history = checkReleaseHistory(root, source, file);
      failures.push(...history.failures);
      if (history.newer.length)
        notices.push(
          `NEWER local release tags not in ${file}: ${history.newer.join(", ")}; the table stays valid for its recorded tags; run ${historyCommand} to add them`,
        );
    }
    const entry = ceilings.documents[name];
    if (!entry)
      failures.push(
        `${file}: missing ceiling; record non-exempt bytes plus two per cent with a dated decision`,
      );
    else if (
      !Number.isSafeInteger(entry.ceiling) ||
      entry.ceiling < 0 ||
      !Number.isSafeInteger(entry.nonExemptBytesAtLanding) ||
      entry.nonExemptBytesAtLanding < 0 ||
      !/^\d{4}-\d{2}-\d{2}$/.test(entry.date ?? "") ||
      typeof entry.decision !== "string" ||
      !entry.decision.trim()
    )
      failures.push(`${file}: invalid ceiling metadata`);
    else if (measured.bytes > entry.ceiling)
      notices.push(
        `ADVISORY ${file}: ${measured.bytes - entry.ceiling} bytes over ceiling; planning resets ceilings`,
      );
    rows.push({
      document: file,
      bytes: measured.bytes,
      exemptBytes: measured.exemptBytes,
      ceiling: entry?.ceiling ?? null,
      headroom: entry ? entry.ceiling - measured.bytes : null,
    });
    const available = new Map();
    for (const shape of baseline.products[name] ?? [])
      available.set(shapeKey(shape), (available.get(shapeKey(shape)) ?? 0) + 1);
    for (const shape of measured.shapes) {
      const key = shapeKey(shape),
        count = available.get(key) ?? 0;
      if (count) available.set(key, count - 1);
      else
        failures.push(
          `${file}#${shape.heading}: new ${shape.kind}; ${shape.kind === "receipt" ? "edit the sentence the change amends; a receipt belongs in the order's evidence README" : "candidates go to the planning map"}`,
        );
    }
  }
  for (const name of Object.keys(ceilings.documents))
    if (!products.includes(name))
      failures.push(
        `${docRelative(root, "product", name)}: ceiling names a missing product document`,
      );
  const decisions = readDecisions(root);
  for (const row of decisions) {
    if (baseline.dispatches[dispatchKey(row)] === dispatchFingerprint(row))
      continue;
    if (!validDispatch(row.dispatch))
      failures.push(
        `${dispatchKey(row)}: dispatch needs a control prefix and at most 240 characters of paraphrase on one line`,
      );
  }
  failures.push(...operatorQuoteFailures(decisions));
  const exceptions = new Map();
  for (const entry of baseline.links)
    exceptions.set(
      `${entry.file}\0${entry.href}\0${entry.reason}`,
      entry.count,
    );
  let historicalLinks = 0;
  for (const failure of linkFailures(root, files)) {
    const key = `${failure.file}\0${failure.href}\0${failure.reason}`,
      count = exceptions.get(key) ?? 0;
    if (count > 0) {
      exceptions.set(key, count - 1);
      historicalLinks++;
    } else
      failures.push(
        `${failure.file}:${failure.line}: ${failure.reason}: ${failure.href}`,
      );
  }
  // A line that holds a private path today passes by its fingerprint; a new
  // or edited one fails. The failure never prints the path.
  const remainingHomePaths = new Map(
    Object.entries(homePaths).map(([file, list]) => [file, [...list]]),
  );
  let historicalHomePaths = 0;
  for (const row of homePathFindings(root, files)) {
    const list = remainingHomePaths.get(row.file) ?? [];
    const at = list.indexOf(row.fingerprint);
    if (at >= 0) {
      list.splice(at, 1);
      historicalHomePaths++;
    } else
      failures.push(
        `${row.file}:${row.line}: absolute home or private temporary path; write a repository-relative path or a placeholder such as <worktree>/ or <tmp>/`,
      );
  }
  const frontPage = frontPageFindings(root);
  failures.push(...frontPage.failures);
  notices.push(...frontPage.notices);
  const operatorWords = operatorWordAdvisories(
    root,
    baseline.operatorWords,
    files,
  );
  return {
    rows,
    failures,
    historicalLinks,
    historicalHomePaths,
    notices,
    operatorWords,
  };
}

if (isMainModule(import.meta.url)) {
  try {
    if (process.argv.length > 2)
      throw new Error("usage: node scripts/docs-check.mjs");
    const result = checkDocs(findLaunchpad());
    console.log("Document | Bytes | Exempt bytes | Ceiling | Headroom");
    for (const row of result.rows)
      console.log(
        `${row.document} | ${row.bytes} | ${row.exemptBytes} | ${row.ceiling ?? "missing"} | ${row.headroom ?? "unknown"}`,
      );
    for (const notice of result.notices) console.log(notice);
    for (const row of result.operatorWords.rows)
      console.log(
        `ADVISORY ${row.file}#${row.record}: operator-attributed words need a capture digest (SHA-256 or --capture-hash), or a paraphrase`,
      );
    console.log(
      `Operator-word advisories: ${result.operatorWords.current}; historical baseline: ${result.operatorWords.historical}.`,
    );
    for (const failure of result.failures) console.error(`FAIL ${failure}`);
    console.log(
      `${result.failures.length ? "FAIL" : "PASS"} docs check: ${result.rows.length} product documents; ${result.historicalLinks} declared historical link occurrences; ${result.historicalHomePaths} declared historical home-path lines; ${result.failures.length} failures`,
    );
    process.exitCode = result.failures.length ? 1 : 0;
  } catch (error) {
    console.error(`FAIL docs check: ${error.message}`);
    process.exitCode = 1;
  }
}
