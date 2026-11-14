// The repository's one Markdown parser: Prettier's, at the pinned version.
// It supplies block boundaries, decoded destinations and reference
// identities; no second Markdown grammar is needed, and it is synchronous.
// The scripts carry its self-contained build under scripts/lib/vendor/, kept
// byte-identical to the pinned package by the vendored-parser check, so the
// lifecycle reads Markdown on bare Node, before any install, as it always ran.
import { parsers } from "./vendor/prettier-markdown.mjs";

/** The most source text, in bytes, whose parsed trees are kept at once. A
 * command reads one document many times (an order for its header, its
 * dependencies, its criteria), so a tree is kept by its content while the
 * command runs; past this bound the least recently read is dropped, so a
 * long-running process holds what it derived and no unbounded set of trees. */
export const PARSED_DOCUMENT_CEILING_BYTES = 8 * 1024 * 1024;
let ceiling = PARSED_DOCUMENT_CEILING_BYTES;
/** Raise the bound for one short command that reads every document several
 * times and then exits, such as the document check, whose passes would
 * otherwise parse each document again. A resident and every other caller
 * keep the default. */
export const keepParsedDocuments = (bytes) => {
  ceiling = Math.max(PARSED_DOCUMENT_CEILING_BYTES, bytes);
};
// Source text to its tree and what readers derived from it, oldest first.
const parsed = new Map();
let parsedBytes = 0;
let parses = 0;
/** How many documents this process has parsed: a second read of the same
 * text parses nothing. */
export const markdownParseCount = () => parses;

// The entry a text is kept under, most recently read last. It holds what was
// derived from the text and, once a reader asks for it, the text's tree.
const entryFor = (source) => {
  const held = parsed.get(source);
  if (held) {
    parsed.delete(source);
    parsed.set(source, held);
    return held;
  }
  const entry = {
    tree: undefined,
    bytes: Buffer.byteLength(source),
    derived: new Map(),
  };
  if (entry.bytes <= ceiling) {
    parsed.set(source, entry);
    parsedBytes += entry.bytes;
    for (const [text, oldest] of parsed) {
      if (parsedBytes <= ceiling) break;
      parsed.delete(text);
      parsedBytes -= oldest.bytes;
    }
  }
  return entry;
};

// The carried parser's extensions read inline and display math between
// dollar signs, a Liquid tag and a wiki link, none of them CommonMark, as
// spans with no children: a link, a code span or a label inside one is
// hidden from every reader, where a reader of the text saw it. The parser is
// handed a copy of the source in which the characters such a span needs
// stand as private-use characters the source does not hold, one code unit
// for one so every offset holds, and the strings the tree carries take the
// originals back. A dollar sign, and a brace before a brace or a percent
// sign, mean nothing to CommonMark and are replaced wherever they stand. A
// bracket does mean something, so a wiki link is taken apart only where the
// extension would read one: two opening brackets, a target on one line that
// holds no closing bracket and a character that is not a space or a tab, and
// two closing brackets (the carried parser reads no alias divider). There the
// inner bracket of each pair is replaced and the outer two keep the meaning
// CommonMark gives them, so a link whose text opens with a bracketed word,
// or is one, is read as written. A character after an odd count of
// backslashes is escaped and opens nothing.
const UNESCAPED = String.raw`(?<=(?:^|[^\\])(?:\\\\)*)`;
const MATH_OR_TAG = new RegExp(String.raw`${UNESCAPED}(?:\$|\{(?=[{%]))`, "gu");
const WIKI_LINK = new RegExp(
  String.raw`${UNESCAPED}\[\[(?=[^\]\r\n]*[^ \t\]\r\n])[^\]\r\n]+\]\]`,
  "gu",
);
// Four private-use characters the source does not hold, for the dollar sign,
// the brace and a wiki link's two inner brackets; null where the source holds
// the whole range, which is then parsed as written. A numeric character
// reference to one, which the parser decodes into the tree's strings, holds
// it as the character itself does.
const neutralCharacters = (source) => {
  const held = new Set(source.match(/[\uE000-\uF8FF]/gu));
  for (const [, decimal, hex] of source.matchAll(
    /&#(?:(\d{1,7})|[xX]([\da-fA-F]{1,6}));/gu,
  )) {
    const code = decimal ? Number(decimal) : Number.parseInt(hex, 16);
    if (code >= 0xe000 && code <= 0xf8ff) held.add(String.fromCharCode(code));
  }
  const chosen = [];
  for (let code = 0xe000; code <= 0xf8ff && chosen.length < 4; code += 1) {
    const character = String.fromCharCode(code);
    if (!held.has(character)) chosen.push(character);
  }
  return chosen.length === 4 ? chosen : null;
};
// The neutral copy of `source` and what takes a string of the tree back to
// the source's characters; null where nothing would form a span, or where no
// character is free.
const neutralCopy = (source) => {
  const openers = [...source.matchAll(MATH_OR_TAG)];
  const links = [...source.matchAll(WIKI_LINK)];
  if (!openers.length && !links.length) return null;
  const characters = neutralCharacters(source);
  if (!characters) return null;
  const [dollar, brace, open, close] = characters;
  const units = source.split("");
  for (const { index, 0: opener } of openers)
    units[index] = opener === "$" ? dollar : brace;
  for (const { index, 0: link } of links) {
    units[index + 1] = open;
    units[index + link.length - 2] = close;
  }
  const original = new Map([
    [dollar, "$"],
    [brace, "{"],
    [open, "["],
    [close, "]"],
  ]);
  const neutral = new RegExp(`[${characters.join("")}]`, "gu");
  return {
    text: units.join(""),
    restore: (value) =>
      value.replace(neutral, (character) => original.get(character)),
  };
};
const restoreStrings = (node, restore) => {
  for (const [key, value] of Object.entries(node))
    if (typeof value === "string" && key !== "type") node[key] = restore(value);
  for (const child of node.children ?? []) restoreStrings(child, restore);
};

// The carried parser's tree of `text`, which is `source` or its neutral copy,
// with its offsets in `source`.
const parseText = (source, text) => {
  const tree = parsers.markdown.parse(text);
  parses += 1;
  if (tree?.type !== "root" || !Array.isArray(tree.children))
    throw new Error(
      "Unsupported Markdown parser AST; check the pinned Prettier version",
    );
  // The parser takes one leading byte-order mark as no character of the
  // document, so its offsets start after it. Every reader slices the text it
  // was given: the offsets are moved to that text, once, here.
  if (source.startsWith("﻿")) {
    const moved = new Set();
    const move = (point) => {
      if (!point || moved.has(point)) return;
      moved.add(point);
      point.offset += 1;
      if (point.line === 1) point.column += 1;
    };
    const walk = (node) => {
      move(node.position?.start);
      move(node.position?.end);
      for (const child of node.children ?? []) walk(child);
    };
    walk(tree);
  }
  return tree;
};

/** A document's tree as every reader takes it, with no span of the parser's
 * extensions (above). The same text is parsed once while its tree is kept;
 * a caller reads the tree and never changes it. */
export function parseMarkdown(source) {
  const entry = entryFor(source);
  if (!entry.tree) {
    const copy = neutralCopy(source);
    entry.tree = parseText(source, copy?.text ?? source);
    if (copy) restoreStrings(entry.tree, copy.restore);
  }
  return entry.tree;
}

/** The carried parser's own reading of a document, with the spans its
 * extensions read (inline and display math, a Liquid tag, a wiki link). A
 * check that judges where that reading and another renderer's differ reads
 * this, as the front page's guard does for GitHub, which reads those spans
 * another way; every other reader reads parseMarkdown's. Where no such span
 * can form, the two are one tree. */
export function parseMarkdownWithExtensions(source) {
  if (!neutralCopy(source)) return parseMarkdown(source);
  const entry = entryFor(source);
  entry.extended ??= parseText(source, source);
  return entry.extended;
}

// A line that can open an ordered list's first item as CommonMark writes it:
// up to three spaces, the number, a period or a parenthesis, then a space, a
// tab or the line's end. It spares the parse of a line that cannot; the
// parser decides about a line that can.
const ORDERED_ITEM_OPENS = /^ {0,3}(\d{1,9})[.)](?:[ \t]|\r?$)/u;

/** The number the parser reads an ordered list to start with at `offset` of
 * `source`, handed the text from there to `limit`, or null where no ordered
 * list's first item starts there. Where `expected` is given, a line written
 * with another number is not parsed. A reader of a numbered list asks this
 * where the list's numbering may resume inside a block the parser ended the
 * list with. */
export function orderedListStart(
  source,
  offset,
  limit = source.length,
  expected = null,
) {
  const end = source.indexOf("\n", offset);
  const written = ORDERED_ITEM_OPENS.exec(
    source.slice(offset, end < 0 ? source.length : end),
  );
  if (!written || (expected !== null && Number(written[1]) !== expected))
    return null;
  const list = parseMarkdown(source.slice(offset, limit)).children[0];
  return list?.type === "list" &&
    list.ordered &&
    list.children[0]?.position.start.offset === 0
    ? list.start
    : null;
}

/** How much of a long document a reader of its leading fields may hand the
 * parser and still read those fields as the whole document gives them: the
 * offset just past the first blank line after the first line, below the
 * document's first, that opens a heading at the margin or the bold label
 * `stopLabel` with its colon. Null where the document has no such line or
 * no text below that blank line, and where the text before the offset could
 * read differently in the whole document.
 *
 * The line found is a candidate only: a line is recognized without a parse
 * here, as in orderedListStart, only to bound what the parser is handed. No
 * field is read here. The text before the offset holds the candidate line
 * and the whole paragraph it stands in, so the parser decides what that line
 * is (a field, or text inside a code span, a link, a quotation's lazy line
 * or the paragraph a line of hyphens under it turns into a heading), and the
 * caller reads the whole document where the parser finds no end of the lead
 * in that text. A cut after a blank line splits no paragraph, and a block
 * left open at the cut (a fence, a comment or another HTML block, a math
 * block) runs to the end of the text the parser was handed, so a candidate
 * line inside one is no end of the lead to the parser either.
 *
 * Two things the text before the offset cannot show, each read here from the
 * text itself, are answered with null:
 * - front matter is front matter only where its closing delimiter follows,
 *   so a document that opens with a delimiter line is read whole;
 * - a link or footnote definition below the offset makes a bracketed label
 *   above it a reference, which can take a line's bold label inside a link,
 *   so a document with a closing bracket and colon below the offset is read
 *   whole. */
export function markdownLeadEnd(source, stopLabel) {
  if (source.startsWith("---") || source.startsWith("+++")) return null;
  const stop = `**${stopLabel}:**`;
  const first = source.search(/\S/u);
  for (
    let at = first < 0 ? -1 : source.indexOf("\n", first);
    at >= 0;
    at = source.indexOf("\n", at + 1)
  ) {
    if (
      !source.startsWith(stop, at + 1) &&
      !/^#{1,6}[ \t]/u.test(source.slice(at + 1, at + 8))
    )
      continue;
    // The first line after the candidate's that holds nothing but spaces
    // and tabs: every reading of Markdown ends a paragraph there.
    for (
      let line = source.indexOf("\n", at + 1);
      line >= 0;
      line = source.indexOf("\n", line + 1)
    ) {
      const next = source.indexOf("\n", line + 1);
      if (next < 0) return null;
      if (!/^[ \t]*\r?$/u.test(source.slice(line + 1, next))) continue;
      const end = next + 1;
      return end >= source.length || source.includes("]:", end)
        ? null
        : { end };
    }
    return null;
  }
  return null;
}

// A comment as HTML writes it. Only this module reads one from raw text:
// every other source takes comments and marker blocks from the readers below.
const COMMENT = /<!--([\s\S]*?)-->/gu;

/** Every HTML comment of a document, where the parser reads raw HTML and
 * never inside a code block or a code span: its text between the comment's
 * delimiters, trimmed; the offsets of the whole comment in `source`; and
 * its line. In order. */
export function markdownComments(source, tree = parseMarkdown(source)) {
  const starts = [0];
  for (
    let at = source.indexOf("\n");
    at >= 0;
    at = source.indexOf("\n", at + 1)
  )
    starts.push(at + 1);
  const lineOf = (offset) => {
    let low = 0,
      high = starts.length - 1;
    while (low < high) {
      const middle = (low + high + 1) >> 1;
      if (starts[middle] <= offset) low = middle;
      else high = middle - 1;
    }
    return low + 1;
  };
  const found = [];
  for (const node of markdownNodes(tree)) {
    if (node.type !== "html") continue;
    const base = node.position.start.offset;
    const raw = source.slice(base, node.position.end.offset);
    for (const match of raw.matchAll(COMMENT)) {
      const start = base + match.index;
      found.push({
        text: match[1].trim(),
        start,
        end: start + match[0].length,
        line: lineOf(start),
      });
    }
  }
  return found.sort((left, right) => left.start - right.start);
}

/** The marker blocks of a document: each comment whose text is `opens`
 * with the next comment whose text is `closes`. A block gives the offsets
 * from its opening comment's first byte to its closing comment's last, where
 * the opening comment ends and the closing one starts, the offsets and the
 * text of what stands between the two marker lines, and both lines. A marker left open, or a closing one with none open, forms no
 * block and is counted in the result's `unbalanced`. */
export function markdownMarkerBlocks(source, opens, closes, tree) {
  const blocks = [];
  let unbalanced = 0;
  let open = null;
  for (const comment of markdownComments(source, tree)) {
    if (comment.text === opens) {
      if (open) unbalanced += 1;
      open = comment;
    } else if (comment.text === closes) {
      if (!open) {
        unbalanced += 1;
        continue;
      }
      const lineEnd = source.indexOf("\n", open.end);
      const innerStart =
        lineEnd < 0 || lineEnd > comment.start ? open.end : lineEnd + 1;
      const innerEnd = Math.max(
        innerStart,
        source.lastIndexOf("\n", comment.start - 1) + 1,
      );
      blocks.push({
        start: open.start,
        openEnd: open.end,
        closeStart: comment.start,
        end: comment.end,
        innerStart,
        innerEnd,
        inner: source.slice(innerStart, innerEnd),
        line: open.line,
        endLine: comment.line,
      });
      open = null;
    }
  }
  if (open) unbalanced += 1;
  return Object.assign(blocks, { unbalanced });
}

/** The lines, counted from zero, on which a comment whose text is `text`
 * stands alone, written as `htmlComment` writes it: the exact marker lines a
 * block's reader requires. The same words inside a fenced example are code
 * and are not found. */
export function markdownMarkerLines(source, text, tree) {
  const lines = source.split(/\r?\n/u);
  const written = htmlComment(text);
  return markdownComments(source, tree)
    .filter(
      (comment) =>
        comment.text === text && lines[comment.line - 1]?.trim() === written,
    )
    .map((comment) => comment.line - 1);
}

/** `source` with each such marker block replaced by what `replace` returns
 * for it, given the block's own text and the block. */
export function replaceMarkerBlocks(source, opens, closes, replace) {
  let result = source;
  for (const block of [
    ...markdownMarkerBlocks(source, opens, closes),
  ].reverse())
    result = `${result.slice(0, block.start)}${replace(source.slice(block.start, block.end), block)}${result.slice(block.end)}`;
  return result;
}

/** A comment as a writer puts it on a line: `<!-- text -->`. */
export const htmlComment = (text) => `<!-- ${text} -->`;

/** A piece of raw HTML the parser returned, or one line of a document, with
 * its comments taken out. A comment left open runs to the end of the text
 * unless `unclosed` is false, which keeps it as written. */
export const withoutHtmlComments = (html, replacement = "", unclosed = true) =>
  html.replace(
    unclosed ? /<!--[\s\S]*?(?:-->|$)/gu : /<!--[\s\S]*?-->/gu,
    replacement,
  );

/** Whether a piece of raw HTML the parser returned holds a comment's
 * opening or closing delimiter. */
export const holdsHtmlComment = (html) =>
  html.includes("<!--") || html.includes("-->");

/** Whether a line is a comment from its first mark to its last, blanks
 * around it aside: the form a marker line has. */
export const isCommentLine = (line) =>
  typeof line === "string" && /^\s*<!--[\s\S]*-->\s*$/u.test(line);

/** Whether a line opens with a comment, after any blanks. */
export const opensHtmlComment = (line) => /^\s*<!--/u.test(line);

/** The text inside a piece of raw HTML that is one comment and nothing else
 * but blanks around it, as a marker line is; null for anything else. */
export const htmlCommentText = (html) => {
  const comment =
    typeof html === "string"
      ? /^\s*<!--((?:(?!-->)[\s\S])*)-->\s*$/u.exec(html)
      : null;
  return comment ? comment[1].trim() : null;
};

/** What a reader derived from a text, kept with it: `compute` runs once for
 * a text and a key while the text is kept. It parses nothing itself, so a
 * reader that needs only part of a document can derive from that part. */
export function derivedFromMarkdown(source, key, compute) {
  const { derived } = entryFor(source);
  if (!derived.has(key)) derived.set(key, compute());
  return derived.get(key);
}

export function* markdownNodes(node) {
  yield node;
  for (const child of node.children ?? []) yield* markdownNodes(child);
}

// One named reference as HTML decodes it, through the pinned parser's table.
const decodeNamedReference = (reference) => {
  const text = [...markdownNodes(parseMarkdown(`a${reference}a`))]
    .filter((node) => node.type === "text")
    .map((node) => node.value)
    .join("");
  return /^a[\s\S]*a$/u.test(text) ? text.slice(1, -1) : reference;
};

/** Character references as HTML decodes them: numeric ones of any length,
 * with or without the semicolon, an invalid code point read as U+FFFD, and
 * named ones through the pinned parser's table. The document check and the
 * target records' link reader share it (WO-259-D021). */
export const decodeCharacterReferences = (text) =>
  text.replace(
    /&#(\d+);?|&#x([\da-f]+);?|&[a-z][a-z\d]*;/giu,
    (reference, decimal, hex) => {
      if (decimal === undefined && hex === undefined)
        return decodeNamedReference(reference);
      const point = decimal ? Number(decimal) : parseInt(hex, 16);
      return point > 0 &&
        point <= 0x10ffff &&
        (point < 0xd800 || point > 0xdfff)
        ? String.fromCodePoint(point)
        : "�";
    },
  );

// The first definition of each reference label in a document's tree.
const linkDefinitions = (tree) => {
  const definitions = new Map();
  for (const node of markdownNodes(tree))
    if (node.type === "definition" && !definitions.has(node.identifier))
      definitions.set(node.identifier, node.url);
  return definitions;
};

// A link's or an image's destination, a reference resolved through the
// document's definitions; undefined for any other node.
const linkDestination = (node, definitions) =>
  ["link", "image"].includes(node.type)
    ? node.url
    : ["linkReference", "imageReference"].includes(node.type)
      ? definitions.get(node.identifier)
      : undefined;

/** Every link and image destination in a Markdown source, with its line;
 * a reference resolves through the first definition of its label. */
export function markdownLinks(source) {
  const ast = parseMarkdown(source),
    definitions = linkDefinitions(ast);
  const links = [];
  for (const node of markdownNodes(ast)) {
    const href = linkDestination(node, definitions);
    if (href) links.push({ href, line: node.position.start.line });
  }
  return links;
}

/** The source ranges of a Markdown document that hold an address or code and
 * no prose, as `[start, end)` offsets: the destination of each link,
 * image and definition, and each inline code span. A link's text is prose
 * and stays outside its range, and so does a title, which a destination may
 * be followed by: the range ends where the destination does. A reader
 * that compares a document's words (the verbatim screen) reads each range as
 * one word. */
export function markdownAddressRanges(source) {
  const ranges = [];
  for (const node of markdownNodes(parseMarkdown(source))) {
    const start = node.position?.start.offset;
    const end = node.position?.end.offset;
    if (start === undefined || end === undefined) continue;
    let from;
    if (node.type === "inlineCode") from = start;
    // A link's destination follows its text; an autolink's text is its own
    // destination and is left to the caller's reading of a bare address.
    else if (node.type === "link" && node.children?.length)
      from = node.children.at(-1).position.end.offset;
    else if (node.type === "link" || node.type === "image") {
      const at = source.slice(start, end).lastIndexOf("](");
      from = at < 0 ? start : start + at;
    } else if (node.type === "definition") {
      const at = source.slice(start, end).indexOf("]:");
      from = at < 0 ? start : start + at + 1;
    } else continue;
    // A destination ends at the first space after it begins, or at the
    // bracket that closes one written between angle brackets; what follows
    // it is the title.
    let stop = end;
    if (node.type !== "inlineCode" && node.title) {
      let at = from + (node.type === "definition" ? 1 : 2);
      while (at < end && /\s/u.test(source[at])) at += 1;
      if (source[at] === "<") {
        const close = source.indexOf(">", at);
        at = close < 0 || close >= end ? end : close + 1;
      } else while (at < end && !/\s/u.test(source[at])) at += 1;
      stop = at;
    }
    if (/[\p{L}\p{N}]/u.test(source.slice(from, stop)))
      ranges.push({ start: from, end: stop });
  }
  return ranges.sort((a, b) => a.start - b.start);
}

/** The text of every inline code span, with its line. */
export function markdownCodeSpans(source) {
  return [...markdownNodes(parseMarkdown(source))]
    .filter((node) => node.type === "inlineCode")
    .map((node) => ({ value: node.value, line: node.position.start.line }));
}

// The shared readers. Every source in the repository that needs a Markdown
// document's structure reads it here, from the pinned parser's tree, so a
// format is read one way: headings and the sections under them, fenced code
// blocks, tables, list items and the bold field labels a work order's header
// carries. Offsets and lines are the source's own, so a caller that rewrites
// part of a document edits exactly the bytes the reader named.

/** A node's source text, exactly as written. */
export const nodeSource = (source, node) =>
  source.slice(node.position.start.offset, node.position.end.offset);

/** The source text of a block's inline content: a heading's title without
 * its markers, a paragraph's or a table cell's text. */
export function inlineSource(source, node) {
  const children = node.children ?? [];
  return children.length
    ? source.slice(
        children[0].position.start.offset,
        children.at(-1).position.end.offset,
      )
    : "";
}

/** The inline spans the parser's own extensions read as one node with no
 * children: inline math between dollar signs, a Liquid tag and a wiki link.
 * None is CommonMark, and parseMarkdown hands the parser a text in which none
 * forms; in the parser's own reading, which parseMarkdownWithExtensions
 * gives, each is read as the text it holds. */
export const EXTENSION_SPANS = Object.freeze([
  "inlineMath",
  "liquidNode",
  "wikiLink",
]);

/** The text a reader sees in a node: text and code as written without their
 * marks, a link by its label, an image by its alt text and a hard break as
 * `breakText`. The optional mappers rewrite an inline code span's text, an
 * image's alt text and an inline HTML tag, which reads as nothing unless
 * `html` says otherwise. */
export function markdownText(
  node,
  breakText = " ",
  { code = (value) => value, image = (alt) => alt, html = () => "" } = {},
) {
  if (node.type === "text") return node.value;
  if (node.type === "inlineCode") return code(node.value);
  if (["image", "imageReference"].includes(node.type))
    return image(node.alt ?? "");
  if (node.type === "break") return breakText;
  if (node.type === "html") return html(node.value);
  // The parser's own extensions read these spans as one node with no
  // children; a reader still sees their text.
  if (EXTENSION_SPANS.includes(node.type)) return node.value ?? "";
  return (node.children ?? [])
    .map((child) => markdownText(child, breakText, { code, image, html }))
    .join("");
}

/** Every heading of the document's top level, in order. */
export function markdownHeadings(source, tree = parseMarkdown(source)) {
  return tree.children
    .filter((node) => node.type === "heading")
    .map((node) => ({
      depth: node.depth,
      title: inlineSource(source, node).trim(),
      line: node.position.start.line,
      start: node.position.start.offset,
      end: node.position.end.offset,
    }));
}

/** Each top-level heading with the body under it, up to the next heading at
 * its depth or shallower: what a reader means by the section "under" it. */
export function markdownSections(source, tree = parseMarkdown(source)) {
  const headings = markdownHeadings(source, tree);
  return headings.map((heading, index) => {
    const next = headings
      .slice(index + 1)
      .find((other) => other.depth <= heading.depth);
    const bodyEnd = next ? next.start : source.length;
    return {
      ...heading,
      bodyStart: heading.end,
      bodyEnd,
      body: source.slice(heading.end, bodyEnd),
    };
  });
}

/** The first section whose title is `title`, at one of `depths`. */
export function markdownSection(
  source,
  title,
  { depths = [1, 2, 3, 4, 5, 6], tree } = {},
) {
  return markdownSections(source, tree).find(
    (section) => section.title === title && depths.includes(section.depth),
  );
}

// A fenced block opens with its fence where the parser places the node; an
// indented block opens with its indentation.
const FENCE = /^(`{3,}|~{3,})([^\r\n]*)/u;

/** Every fenced code block, in any container, with its fence, its info
 * string as written and whether a closing fence ends it. */
export function markdownCodeBlocks(source, tree = parseMarkdown(source)) {
  const blocks = [];
  for (const node of markdownNodes(tree)) {
    if (node.type !== "code") continue;
    const text = nodeSource(source, node);
    const opening = FENCE.exec(text);
    if (!opening) continue;
    const lines = text.split(/\r?\n/u);
    // The closing line as the block's own: inside a quotation each line
    // still carries the quotation's marker, which is no part of the fence.
    // Only the markers of the quotations the fence opened in are set aside,
    // counted on its opening line: a `>` beyond them is the block's text,
    // and a line of text closes nothing.
    const opened = node.position.start.offset;
    const depth = [
      ...source.slice(source.lastIndexOf("\n", opened - 1) + 1, opened),
    ].filter((character) => character === ">").length;
    let last = lines.at(-1);
    for (let marker = 0; marker < depth; marker++)
      last = last.replace(/^[ \t]*>/u, "");
    last = last.trim();
    // The parser's own reading settles what a look at the line cannot: a
    // closing fence is no part of the block's text, so a closed block's
    // source holds a line more than its text and its opening do. A last
    // line that only looks like a fence (indented as code is, or shorter
    // than the opening) is among the text's lines and closes nothing.
    const textLines = node.value === "" ? 0 : node.value.split(/\r?\n/u).length;
    blocks.push({
      lang: node.lang ?? "",
      meta: node.meta ?? "",
      info: opening[2].trim(),
      fence: opening[1],
      value: node.value,
      line: node.position.start.line,
      endLine: node.position.end.line,
      start: node.position.start.offset,
      end: node.position.end.offset,
      closed:
        lines.length - 1 > textLines &&
        last.length >= opening[1].length &&
        [...last].every((character) => character === opening[1][0]),
    });
  }
  return blocks;
}

/** The document's typed records: each top-level fenced block whose info
 * string is exactly `json`, with the top-level heading it sits under (the
 * nearest one before it, or null). A block nested in a list or a quotation
 * is an example inside prose, not a record. A decision file's entries and a
 * pass document's marked blocks are read here, and JSON.parse reads each
 * block's `value`. */
export function markdownJsonBlocks(source, tree = parseMarkdown(source)) {
  const records = new Set(
    tree.children
      .filter((node) => node.type === "code")
      .map((node) => node.position.start.offset),
  );
  const headings = markdownHeadings(source, tree);
  return markdownCodeBlocks(source, tree)
    .filter((block) => block.info === "json" && records.has(block.start))
    .map((block) => ({
      ...block,
      heading:
        headings.findLast((heading) => heading.start < block.start) ?? null,
    }));
}

// A table cell writes a line break as an HTML `<br>` tag.
const LINE_BREAK_TAG = /^<br\s*\/?\s*>$/iu;

/** Every table: its rows, the header row first, each cell's text as written
 * with an escaped pipe read as a pipe; beside it, each cell's text as a reader
 * sees it (a `<br>` read as a newline) and the destinations of its links and
 * images, a reference resolved through the document's first definition. */
// A cell's bytes between its pipes. The parser places each cell from the
// pipe that opens it, and the row's last cell through the pipe that closes
// the row and any spaces after it.
const cellBytes = (source, cell, last) => {
  const text = nodeSource(source, cell);
  const opened = text.startsWith("|") ? text.slice(1) : text;
  const closed = last ? opened.trimEnd() : opened;
  return last && closed.endsWith("|") && !closed.endsWith("\\|")
    ? closed.slice(0, -1)
    : closed;
};

export function markdownTables(source, tree = parseMarkdown(source)) {
  const definitions = linkDefinitions(tree);
  const destinations = (cell) =>
    [...markdownNodes(cell)].flatMap((node) => {
      const href = linkDestination(node, definitions);
      return href ? [href] : [];
    });
  return [...markdownNodes(tree)]
    .filter((node) => node.type === "table")
    .map((table) => ({
      line: table.position.start.line,
      start: table.position.start.offset,
      end: table.position.end.offset,
      rows: table.children.map((row) => ({
        line: row.position.start.line,
        start: row.position.start.offset,
        end: row.position.end.offset,
        cells: row.children.map((cell) =>
          inlineSource(source, cell).trim().replaceAll("\\|", "|"),
        ),
        // Each cell's bytes between its pipes, padding and escapes included,
        // for a reader that binds them.
        raw: row.children.map((cell, index) =>
          cellBytes(source, cell, index === row.children.length - 1),
        ),
        texts: row.children.map((cell) =>
          markdownText(cell, "\n", {
            html: (value) => (LINE_BREAK_TAG.test(value) ? "\n" : ""),
          }).trim(),
        ),
        links: row.children.map(destinations),
      })),
    }));
}

/** Every list item of the document's top-level lists (nested lists are an
 * item's own text): its line, its marker as written, its number when
 * ordered, and its text. `number` counts from the list's first number, as
 * the list renders; `written` is the number the item itself carries, which
 * a document that numbers its items by hand uses as their identity. */
export function markdownListItems(source, tree = parseMarkdown(source)) {
  const items = [];
  for (const list of tree.children.filter((node) => node.type === "list"))
    list.children.forEach((item, index) => {
      const first = item.children[0];
      // The marker is what precedes the item's first block: `-`, `3.`, `3)`.
      const marker = source
        .slice(
          item.position.start.offset,
          first ? first.position.start.offset : item.position.end.offset,
        )
        .trim();
      items.push({
        line: item.position.start.line,
        ordered: Boolean(list.ordered),
        marker,
        number: list.ordered ? (list.start ?? 1) + index : null,
        written: list.ordered ? Number.parseInt(marker, 10) : null,
        text: first
          ? source
              .slice(first.position.start.offset, item.position.end.offset)
              .trim()
          : "",
        start: item.position.start.offset,
        end: item.position.end.offset,
      });
    });
  return items;
}

// A label the parser left as text: at a line's start, after any indentation,
// two asterisks, a label ending in a colon, two asterisks and, with no space
// between, the value's first character.
const UNCLOSED_LABEL = /(?<=^|\n)([ \t]*)\*\*([^*\n]*[^*\s]:)\*\*(?=[^\s*])/gu;
// A label inside a span the parser's extensions read as one node: at the
// start of a line within the span, after any indentation, a bold phrase
// written as the parser would read it outside the span.
const SPAN_LABEL = /(?<=\n)([ \t]*)\*\*([^*\n]*[^*\s])\*\*(?!\*)/gu;
// The inline nodes, none of them CommonMark, whose children are lines the
// author wrote and that can run across a line break: GFM's strikethrough
// between two tildes. What CommonMark itself reads across lines (emphasis, a
// link's text, a code span, inline HTML) holds its lines as CommonMark
// reads them, as the work-order reader's readings that differ from the
// base's by CommonMark are admitted.
const INLINE_CONTAINERS = new Set(["delete"]);

/** The bold field labels of a document's paragraphs, as a work order's
 * header writes them: `**Label:** value`, each label opening a line. A
 * field's value runs to the next label opening a line in the same paragraph,
 * or to the paragraph's end; `lineValue` is the part of it on the label's own
 * line, as written, which is all a one-line field such as a registered
 * repository declares. `colon` says the label ends in a colon, as a field
 * that declares a value does; a bold phrase without one opening a line is a
 * section label such as `**Acceptance criteria (all required)**`, or
 * emphasis that a wrapped line happens to begin with.
 *
 * A label written with no space before its value, `**Label:**value`, is not
 * bold to the parser: asterisks after a colon and before a letter cannot
 * close, so the line stays text. It still opens a field here, with its value
 * starting right after the label. Read as no field at all, a mistyped
 * declaration would pass for an absent one; read as a field, a reader that
 * needs a space before the value refuses it by name.
 *
 * The parser's extensions read some spans as one node with no children:
 * inline math between two dollar signs, a Liquid tag and a wiki link
 * (`EXTENSION_SPANS`). parseMarkdown keeps them from forming. In a tree that
 * holds them, the parser's own reading, a span can run across lines, and
 * with a dollar figure in each of two fields the label between them stands
 * inside one; a span is read here as the text it is, and a label that opens
 * a line inside it opens a field as it would outside it. A strikethrough between two tildes, which GFM reads across a
 * line break, holds the lines inside it as its children, and a label that
 * opens one of them opens a field too. */
export function markdownFields(source, tree = parseMarkdown(source)) {
  const fields = [];
  for (const paragraph of markdownNodes(tree)) {
    if (paragraph.type !== "paragraph") continue;
    const openings = [];
    // Each label `pattern` finds in a child's text, with its line.
    const textLabels = (child, pattern, opensLine) => {
      const text = nodeSource(source, child);
      for (const match of text.matchAll(pattern)) {
        if (match.index === 0 && !opensLine) continue;
        const start =
          child.position.start.offset + match.index + match[1].length;
        openings.push({
          raw: match[2],
          start,
          valueStart: start + match[2].length + 4,
          line:
            child.position.start.line +
            text.slice(0, match.index).split("\n").length -
            1,
        });
      }
    };
    // A label opens a line of the paragraph's own inline text, or of a
    // strikethrough that runs across a line break and holds the lines inside
    // it as its own children.
    const visit = (children, first) =>
      children.forEach((child, index) => {
        // A task-list item's checkbox opens its first line, before the
        // paragraph's first child.
        const opensLine =
          index === 0
            ? first(child)
            : /\n$/u.test(nodeSource(source, children[index - 1]));
        if (child.type === "strong" && opensLine)
          openings.push({
            raw: inlineSource(source, child),
            start: child.position.start.offset,
            valueStart: child.position.end.offset,
            line: child.position.start.line,
          });
        if (child.type === "text") textLabels(child, UNCLOSED_LABEL, opensLine);
        else if (EXTENSION_SPANS.includes(child.type))
          textLabels(child, SPAN_LABEL, false);
        else if (INLINE_CONTAINERS.has(child.type) && child.children?.length)
          visit(child.children, () => false);
      });
    visit(
      paragraph.children,
      (child) =>
        child.position.start.offset === paragraph.position.start.offset,
    );
    openings.sort((left, right) => left.start - right.start);
    openings.forEach((opening, index) => {
      const next = openings[index + 1];
      const end = next ? next.start : paragraph.position.end.offset;
      const value = source.slice(opening.valueStart, end);
      fields.push({
        label: opening.raw.replace(/:\s*$/u, ""),
        raw: opening.raw,
        colon: /:\s*$/u.test(opening.raw),
        value: value.trim(),
        lineValue: value.split(/\r?\n|\r/u, 1)[0],
        line: opening.line,
        start: opening.start,
        valueStart: opening.valueStart,
        end,
        endLine: next ? next.line : paragraph.position.end.line,
      });
    });
  }
  return fields;
}
