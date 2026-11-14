import { docRelative, findLaunchpad } from "./config.mjs";
import {
  holdsHtmlComment,
  inlineSource,
  markdownNodes,
  parseMarkdown,
} from "./markdown-links.mjs";
import { readWorkOrder } from "./work-order-document.mjs";
export const releaseNoteHeadings = Object.freeze([
  "Release overview",
  "Read before upgrading",
  "Substantive changes",
  "Progressive polish",
  "Evidence and compatibility",
]);

export const releaseNotesPathFor = (workOrderId, root = findLaunchpad()) =>
  docRelative(root, "finalReviews", `${workOrderId}/RELEASE-NOTES.md`);

const BOM = "﻿";
const reservedHeading =
  /^(?:WO-\d{3}[ \t]+[—–-][ \t]+|Derived from the diff[ \t]*#*[ \t]*$|Machine-derived release evidence[ \t]*#*[ \t]*$)/;

// The text a reader sees in a heading: its text and code as the parser
// decodes them, with emphasis, links, escapes and character references
// resolved. A generated title spelled through decoration or references is
// still the generated title.
const visibleText = (node) =>
  node.type === "text" || node.type === "inlineCode"
    ? node.value
    : (node.children ?? []).map(visibleText).join("");

// A setext heading spans its text and its underline; an ATX heading is one
// line.
const setext = (heading) =>
  heading.position.start.line !== heading.position.end.line;

// On one line, a reserved title is named before raw HTML, and raw HTML
// before a heading's form.
const refusalOrder = Object.freeze({
  reserved: 0,
  comment: 1,
  html: 2,
  setext: 3,
  markers: 4,
});

/** The notes' section headings, read from the parser's tree, after the
 * first structural refusal in document order is thrown. A section heading is
 * a level-two ATX heading at the top level, opening its line, with a title.
 * Every heading is judged: a generated title is reserved at any depth and in
 * any container, a setext level-two heading is refused, and a level-two ATX
 * heading that is indented, nested in a quotation or a list, or empty is
 * refused. Raw HTML, comments included, is refused wherever the parser reads
 * it; HTML-like text in code is code. */
const sectionHeadings = (source, displayPath, { marked }) => {
  const tree = parseMarkdown(source);
  const topLevel = new Set(tree.children);
  const refusals = [];
  const refuse = (kind, line, message) =>
    refusals.push({ rank: refusalOrder[kind], line, message });
  const headings = [];
  for (const node of markdownNodes(tree)) {
    if (node.type === "html") {
      const comment = holdsHtmlComment(node.value);
      const line = node.position.start.line;
      refuse(
        comment ? "comment" : "html",
        line,
        `${displayPath}: ${comment ? "HTML comments are" : "raw HTML is"} not allowed in reviewed notes (line ${line})`,
      );
      continue;
    }
    if (node.type !== "heading") continue;
    // The parser drops a leading byte-order mark that the Release body and
    // the tag message keep: the line it opens holds the mark before any `#`,
    // so it is read as text, never as a heading.
    if (marked && node.position.start.line === 1) continue;
    const line = setext(node)
      ? node.position.end.line
      : node.position.start.line;
    if (reservedHeading.test(visibleText(node).replace(/\s+/g, " ").trim()))
      refuse(
        "reserved",
        line,
        `${displayPath}: generated release heading is reserved (line ${line})`,
      );
    if (node.depth !== 2) continue;
    if (setext(node))
      refuse(
        "setext",
        line,
        `${displayPath}: setext level-two headings are not allowed (line ${line}); use only the five exact required headings`,
      );
    else if (
      !topLevel.has(node) ||
      node.position.start.column !== 1 ||
      !node.children.length
    )
      refuse(
        "markers",
        line,
        `${displayPath}: level-two heading markers are allowed only as exact column-one section headings (line ${line})`,
      );
    else
      headings.push({
        name: inlineSource(source, node).trim(),
        line,
        start: node.position.start.offset,
        end: node.position.end.offset,
      });
  }
  const [first] = refusals.sort(
    (left, right) => left.line - right.line || left.rank - right.rank,
  );
  if (first) throw new Error(first.message);
  return headings;
};

// A section's text without the blank lines that open or close it; every
// other line keeps its bytes.
const sectionBody = (text) => {
  const body = text.split("\n");
  while (body.length > 0 && /^\s*$/.test(body[0])) body.shift();
  while (body.length > 0 && /^\s*$/.test(body.at(-1))) body.pop();
  return body.join("\n");
};

export const parseReleaseNotes = (markdown, displayPath) => {
  const reserved = /^(DOTLN-MANIFEST-(?:BEGIN|END))\r?$/m.exec(markdown);
  if (reserved)
    throw new Error(
      `${displayPath}: reserved tag marker line "${reserved[1]}" is not allowed in reviewed notes`,
    );
  const marked = markdown.startsWith(BOM);
  // The parser's offsets count from after a leading byte-order mark.
  const source = marked ? markdown.slice(BOM.length) : markdown;
  const headings = sectionHeadings(source, displayPath, { marked });
  const observed = headings.map(({ name }) => name);

  for (const required of releaseNoteHeadings) {
    const duplicates = headings.filter(({ name }) => name === required);
    if (duplicates.length > 1)
      throw new Error(
        `${displayPath}: duplicated required heading "## ${required}" at line ${duplicates[1].line}`,
      );
  }

  const extra = headings.find(
    ({ name }) => !releaseNoteHeadings.includes(name),
  );
  if (extra)
    throw new Error(
      `${displayPath}: extra level-two heading "## ${extra.name}" at line ${extra.line}`,
    );

  for (const required of releaseNoteHeadings) {
    if (!observed.includes(required))
      throw new Error(
        `${displayPath}: missing required heading "## ${required}"`,
      );
  }

  if (observed.some((heading, index) => heading !== releaseNoteHeadings[index]))
    throw new Error(
      `${displayPath}: required headings are misordered; expected ${releaseNoteHeadings.map((heading) => `"## ${heading}"`).join(", ")}`,
    );

  const preamble = sectionBody(source.slice(0, headings[0].start));
  if (preamble !== "")
    throw new Error(
      `${displayPath}: content appears before the first required heading`,
    );

  const sections = {};
  headings.forEach((heading, index) => {
    const next = headings[index + 1];
    const body = sectionBody(
      source.slice(heading.end, next?.start ?? source.length),
    );
    if (body === "")
      throw new Error(
        `${displayPath}: empty required section "## ${heading.name}"; use the literal line "None." when there is nothing to say`,
      );
    sections[heading.name] = body;
  });

  return { sections };
};

/** The body source a target order names for its Release (WO-227): the header
 * field `**Target release notes:** reviewed` makes the Release body the
 * order's rendered RELEASE-NOTES.md; `objective`, or no field, keeps the
 * title, objective and close line. The field is read from the order's header
 * through the work-order reader, as its value's first word; a field with no
 * value names no source. More than one field, or another word, refuses. */
export const targetReleaseNotesSource = (markdown, displayPath) => {
  const headers = readWorkOrder(markdown)
    .headerFields("Target release notes")
    .filter((field) => field.value !== "");
  if (!headers.length) return "objective";
  if (headers.length > 1)
    throw new Error(
      `${displayPath}: carries ${headers.length} **Target release notes:** headers; at most one is read`,
    );
  const value = headers[0].value.split(/\s/u)[0].replace(/[.,;]$/u, "");
  if (!["reviewed", "objective"].includes(value))
    throw new Error(
      `${displayPath}: **Target release notes:** must be reviewed or objective, not ${value}`,
    );
  return value;
};
