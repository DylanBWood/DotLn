// The one reader of a work order's own format: its title, its leading header
// of bold field labels and the sections under it, read from the pinned
// Markdown parser's tree through the shared readers. Every script that needs
// an order's title or a header field reads it here, so the format is read one
// way and a change to it lands in one place.
import {
  derivedFromMarkdown,
  markdownFields,
  markdownHeadings,
  markdownLeadEnd,
  markdownSections,
  orderedListStart,
  parseMarkdown,
} from "./markdown-links.mjs";

const BOM = "﻿";

/** A work order's title, header and fields. `source` is the text without a
 * byte-order mark, and every offset and line is that text's. The header
 * runs from the title to the first later heading or the Objective field: the
 * examples and citations below it are not metadata. A field is found by its
 * label with the colon a declaration carries, `**Objective:**`: a bold
 * `**Objective**` that a wrapped citation line opens with names the field
 * and declares nothing. */
export function readWorkOrder(markdown) {
  const source = markdown.startsWith(BOM) ? markdown.slice(1) : markdown;
  // One reading a document: a command that asks for an order's header, its
  // dependencies and its criteria parses and reads it once.
  return derivedFromMarkdown(source, "work-order", () => readOrder(source));
}

function readOrder(source) {
  const tree = parseMarkdown(source);
  const headings = markdownHeadings(source, tree);
  const lead = tree.children[0];
  // The header follows the document's first block, a title or not, as the
  // lifecycle has always read it.
  const leadStart = lead?.position.start.offset ?? -1;
  const title =
    lead?.type === "heading" && lead.depth === 1 ? headings[0] : null;
  const fields = markdownFields(source, tree);
  // Metadata is written in the document's own top-level paragraphs: a field
  // inside a quotation or a list item is an example, which neither declares
  // a value nor ends the header, as the lifecycle's column-one reading held.
  const paragraphs = tree.children.filter((node) => node.type === "paragraph");
  const topLevel = (field) =>
    paragraphs.some(
      (paragraph) =>
        paragraph.position.start.offset <= field.start &&
        field.start < paragraph.position.end.offset,
    );
  const objective = fields.find(
    (field) =>
      topLevel(field) &&
      field.colon &&
      field.label === "Objective" &&
      field.start > leadStart,
  );
  const nextHeading = headings.find((heading) => heading.start > leadStart);
  const headerEnd = Math.min(
    objective?.start ?? source.length,
    nextHeading?.start ?? source.length,
  );
  const header = fields.filter(
    (field) =>
      topLevel(field) && field.start > leadStart && field.start < headerEnd,
  );
  // A label is a field opening a line of a top-level paragraph that declares
  // a value or stands alone on its line as a section label, such as
  // `**Acceptance criteria (all required)**`. A bold phrase a wrapped line
  // begins with is emphasis, and a bold word opening a list item or a
  // quotation's line belongs to that block's text. A label is written on one
  // line: a bold phrase that itself wraps onto the next line is emphasis in
  // the text it stands in, as the judged text of the orders that open a
  // paragraph with one has always read it.
  const labels = fields.filter(
    (field) =>
      (field.colon || !field.lineValue.trim()) &&
      !field.raw.includes("\n") &&
      topLevel(field),
  );
  return {
    source,
    tree,
    title,
    leadStart,
    headerEnd,
    header,
    fields,
    headings,
    labels,
    /** The header fields that declare `label`, in order. */
    headerFields: (label) =>
      header.filter((field) => field.colon && field.label === label),
    /** The sections under the title, by heading. */
    sections: () => markdownSections(source, tree),
    /** What a label or a heading leads: the text after its own words up to
     * the next label or heading, whichever comes first. A field whose value
     * is a list, such as the acceptance criteria or the execution plan,
     * reads its list here. */
    block(opening) {
      const start = opening.valueStart ?? opening.end;
      const next = (rows) =>
        rows.find((row) => row.start > opening.start)?.start ?? source.length;
      const end = Math.max(start, Math.min(next(labels), next(headings)));
      return { start, end, body: source.slice(start, end) };
    },
    /** A field's extent and text: the block it leads, as `block` reads it. */
    fieldExtent(field) {
      const { start, end } = this.block(field);
      return { start, end };
    },
    fieldText(field) {
      return this.block(field).body.trim();
    },
  };
}

/** The code a refused numbered list carries, so that a caller that reads an
 * unreadable order as one with no list can tell this refusal apart from a
 * missing file and let it stand. */
export const LIST_UNREAD = "DOTLN_ORDER_LIST_UNREAD";

const BLOCK_NAMES = {
  paragraph: "paragraph",
  blockquote: "quotation",
  list: "bulleted list",
  table: "table",
};

/**
 * Refuses where the parser reads the numbered list that `opening` leads as
 * less than the author wrote, so that no reader of the list returns a
 * shorter one. The reading it is held to is the line reader's the lifecycle
 * used before the shared parser: every line from the opening to the next
 * label or heading written at the margin that opens a numbered item was an
 * item, with the number written on it, so a list that skips a number (1, 3,
 * 4) was read as written, and it still is. Where the parser leaves such a
 * line inside another block, the list it reads is shorter, whatever the
 * number on that line: a skipped one, a falling one or one an item already
 * holds is an item lost as surely as the next one, with its text and the
 * gate it names.
 *
 * So, between the opening and the next label or heading, a block other than
 * the list that holds, after its own first line, a line from which the
 * parser would read an ordered list refuses the list. The common cause is a
 * raw HTML block: a wrapped line that opens with a tag's name, such as a
 * placeholder `<option>`, starts a block that ends the list and holds every
 * line after it, to the next blank line, as text. A wrapped line that opens
 * with three backticks or tildes opens a fenced code block that holds every
 * line after it, to its closing fence, as code. A paragraph or a quotation
 * takes a numbered line after it as its own text where the number is not
 * one, since only a list that starts at one interrupts a paragraph; and a
 * label alone on its line whose paragraph runs on does the same. Other text
 * in the block is the author's, as the derived orders' Required evidence and
 * Output contract are: an indented code block's lines are indented past any
 * item's opening.
 *
 * The label or heading that ends the block may be one the parser reads
 * inside the list: a wrapped line indented short of an item's text or
 * written straight after one of its lines, which opens with a number sign
 * or a bold label. The line reader read on past such a line to the next
 * label or heading written at the margin, so every block up to that one is
 * read as the block's own: an ordered list or a numbered line there, whatever
 * its number, is a criterion lost. A label or a heading the author set at the
 * margin between groups of criteria ended the line reader's list too; past
 * one, every block up to the first ordered list is read for the next number
 * after the last item, and a later section's own list, which starts at one,
 * ends that reading. Only the next number is taken there: prose after the
 * criteria may wrap onto a line that opens with any other number, and no
 * reader of the list read it as one. The refusal names the lines and the
 * remedy; `name` names the list, such as `acceptance criteria`.
 */
export function refuseUnreadList(order, opening, name) {
  const { source, tree } = order;
  const { start, end } = order.block(opening);
  const own = tree.children.find(
    (node) =>
      node.position.start.offset <= opening.start &&
      opening.start < node.position.end.offset,
  );
  const refuse = (detail) => {
    const error = new Error(`${name}: ${detail}`);
    error.code = LIST_UNREAD;
    throw error;
  };
  // The first line inside `node`, after its own first line, from which the
  // parser would read an ordered list (with `expected`, one that starts at
  // that number alone): its line and the number written there. `limit`
  // bounds the text handed to the parser: the block's end, or the node's own
  // end for a node after the block.
  const resumption = (node, expected, limit = end) => {
    const to = Math.min(node.position.end.offset, limit);
    for (
      let at = source.indexOf(
        "\n",
        Math.max(node.position.start.offset, start),
      );
      at >= 0 && at + 1 < to;
      at = source.indexOf("\n", at + 1)
    ) {
      const number = orderedListStart(source, at + 1, limit, expected);
      if (number !== null)
        return { line: source.slice(0, at + 1).split("\n").length, number };
    }
    return null;
  };
  // A label alone on its line whose paragraph runs on takes what follows it.
  if (
    own?.type === "paragraph" &&
    typeof opening.lineValue === "string" &&
    !opening.lineValue.trim()
  ) {
    const resumed = resumption(own, null);
    if (resumed)
      refuse(
        `line ${resumed.line} opens criterion ${resumed.number}, which the label's own paragraph holds as its text: put a blank line between the label and the list.`,
      );
  }
  // The number the author wrote on the last item read; null until the list
  // has begun.
  let last = null;
  for (const node of tree.children) {
    if (
      node === own ||
      node.position.end.offset <= start ||
      node.position.start.offset >= end
    )
      continue;
    if (node.type === "list" && node.ordered) {
      const item = node.children.at(-1).position.start.offset;
      last = Number.parseInt(source.slice(item, item + 16), 10);
      continue;
    }
    const resumed = resumption(node, null);
    if (!resumed) continue;
    const line = node.position.start.line;
    if (node.type === "html")
      refuse(
        `line ${line} opens a raw HTML block (the line opens with a tag's name or a comment), which ends the numbered list there and holds criterion ${resumed.number} on line ${resumed.line} and the lines after it, to the next blank line, as text: write the tag in a code span, put a backslash before its bracket, or re-wrap the line so that it does not open with the tag.`,
      );
    // Only a fenced code block can hold such a line: an indented one's lines
    // stand four spaces in, past where an item opens.
    if (node.type === "code")
      refuse(
        `line ${line} opens a fenced code block (the line opens with three backticks or tildes), which ends the numbered list there and holds criterion ${resumed.number} on line ${resumed.line} and the lines after it, to the closing fence, as code: re-wrap the line so that it does not open with the fence, or write the fence in a code span.`,
      );
    refuse(
      `line ${resumed.line} opens criterion ${resumed.number}, which the ${BLOCK_NAMES[node.type] ?? `${node.type} block`} that begins on line ${line} holds as its text, so the list ends before it: put a blank line before the item, or move the ${BLOCK_NAMES[node.type] ?? "block"} out of the list.`,
    );
  }
  if (last === null) return;
  // The node that holds the next label, or the next heading itself.
  const closingAt = tree.children.findIndex(
    (node) => node.position.end.offset > end,
  );
  const closing = tree.children[closingAt];
  if (!closing) return;
  // The closing line itself: indented, or written straight after a line of
  // the list, it is a wrapped line of an item; at the margin after a blank
  // line, the author set it between groups of criteria.
  const lines = source.split("\n");
  const at = source.slice(0, end).split("\n").length;
  const inside =
    /^[ \t]/u.test(lines[at - 1]) || (at > 1 && lines[at - 2].trim() !== "");
  // A label or a heading whose line opens with it at the margin: where the
  // line reader ended the criteria.
  const section = (node) =>
    (node.position.start.offset === 0 ||
      source[node.position.start.offset - 1] === "\n") &&
    (node.type === "heading" ||
      order.labels.some((label) => label.start === node.position.start.offset));
  let resumed = null;
  let from = closingAt;
  if (inside)
    for (; from < tree.children.length; from += 1) {
      const node = tree.children[from];
      if (from > closingAt && section(node)) break;
      if (node.type === "list" && node.ordered) {
        resumed = { line: node.position.start.line, number: node.start ?? 1 };
        break;
      }
      resumed = resumption(node, null, node.position.end.offset);
      if (resumed) break;
    }
  if (!resumed)
    for (const node of tree.children.slice(from)) {
      if (node.type === "code") continue;
      if (node.type === "list" && node.ordered) {
        if ((node.start ?? 1) === last + 1)
          resumed = { line: node.position.start.line, number: last + 1 };
        break;
      }
      resumed = resumption(node, last + 1, node.position.end.offset);
      if (resumed) break;
    }
  if (!resumed) return;
  const kind = closing.type === "heading" ? "a heading" : "a label";
  if (inside)
    refuse(
      `line ${at} reads as ${kind} inside the list, and criterion ${resumed.number} on line ${resumed.line} goes on after it, so the list ends before it: indent the line to the item's text, or re-wrap it so that it does not open with ${closing.type === "heading" ? "a number sign" : "a bold label"}.`,
    );
  refuse(
    `line ${at} sets ${kind} between the criteria, which ends their list there, and criterion ${resumed.number} on line ${resumed.line} goes on after it: the criteria are one numbered list under their label, so name a group in its items' text, such as (B1), and not as ${kind} between them.`,
  );
}

/** A work order's title and leading header alone, for a reader that needs
 * its header fields and nothing below them (the index reads every order's):
 * the same `source`, `title`, `leadStart`, `headerEnd`, `header` and
 * `headerFields` that `readWorkOrder` gives. A long order's body is not
 * parsed for its header where the order's lead is enough to know it: the
 * text through the paragraph of the first line that could end the header is
 * parsed, and its reading stands where the parser itself finds the header's
 * end in it, at the Objective field or a heading. Where it finds none (the
 * line stood inside a code span, a link, a fence, a comment or a quotation),
 * or where the lead could read differently in the whole document
 * (`markdownLeadEnd`), the whole document is parsed. */
export function readWorkOrderHeader(markdown) {
  const source = markdown.startsWith(BOM) ? markdown.slice(1) : markdown;
  return derivedFromMarkdown(source, "work-order-header", () => {
    const cut = markdownLeadEnd(source, "Objective");
    if (cut) {
      const read = readOrder(source.slice(0, cut.end));
      // The header ends inside the parsed text: every block up to that end
      // is closed there, so the whole document reads them the same.
      if (read.headerEnd < cut.end) return headerOf(source, read);
    }
    const order = readWorkOrder(source);
    return headerOf(order.source, order);
  });
}

const headerOf = (source, order) => ({
  source,
  title: order.title,
  leadStart: order.leadStart,
  headerEnd: order.headerEnd,
  header: order.header,
  /** The text this reading parsed, the whole document or its lead, with its
   * tree: what a reader of the header's own comments reads. */
  lead: { source: order.source, tree: order.tree },
  headerFields: (label) =>
    order.header.filter((field) => field.colon && field.label === label),
});

/** The sizes an order's header may give its first review round. */
export const REVIEW_LADDERS = Object.freeze(["full", "combined", "paired"]);

/** Each `**Review ladder:**` line of an order's leading header, in order:
 * the value on the label's own line and that line's number. An order with
 * no such line runs the full ladder. The caller judges the value: only an
 * order still open is held to the three sizes, and a settled order keeps
 * whatever it closed with. */
export const reviewLadderLines = (markdown) =>
  readWorkOrderHeader(markdown)
    .headerFields("Review ladder")
    .map((field) => ({ value: field.lineValue.trim(), line: field.line }));

/** The one header field `label`, undefined when absent; two refuse with
 * `duplicate`'s message. */
export function headerField(order, label, duplicate) {
  const found = order.headerFields(label);
  if (found.length > 1) throw new Error(duplicate);
  return found[0];
}

/** A work order's title alone, the same `title` `readWorkOrder` gives, for
 * a caller that reads many orders' titles and nothing else (the release
 * history's order links). The title is the document's first block, and a
 * first block ends at the first blank line after it begins, so only the text
 * before that line is parsed. */
export function readWorkOrderTitle(markdown) {
  const source = markdown.startsWith(BOM) ? markdown.slice(1) : markdown;
  const begins = source.search(/\S/u);
  const blank =
    begins < 0
      ? -1
      : source.slice(begins).search(/(?:\r\n|\r|\n)[ \t]*(?:\r\n|\r|\n)/u);
  return readWorkOrder(blank < 0 ? source : source.slice(0, begins + blank))
    .title;
}
