import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { docPath, docRelative } from "./config.mjs";
import { containedRegularFile, workOrderAuthorityPath } from "./paths.mjs";
import { markdownCodeBlocks, markdownHeadings } from "./markdown-links.mjs";
import { readWorkOrder } from "./work-order-document.mjs";

// The order format's field labels. A bold label outside this list inside the
// section is one of its paragraphs, so an unlisted field over-prints rather
// than hiding a carry-in.
const ORDER_FIELDS = [
  "Model",
  "Effort",
  "Track",
  "Release classification",
  "Cost",
  "Nomination provenance",
  "Depends on",
  "Recommended placement",
  "Cites",
  "Objective",
  "Observed gap",
  "Observed problems?",
  "Design",
  "Scope discipline",
  "Surfaces",
  "Deliverables",
  "Acceptance criteria",
  "Evidence gate",
  "Write-back duty",
  "Known issues and carry-ins",
  "Non-goals",
  "Operator-review assumptions",
].join("|");
const NAME = "Known issues and carry-ins";
// A field's name, with an optional parenthetical after it.
const fieldName = (names) =>
  new RegExp(`^(?:${names})(?: ?\\([^)]*\\))?$`, "iu");
const ORDER_FIELD = fieldName(ORDER_FIELDS);
const LABEL = fieldName(NAME);
// A heading labels the section when its title is the name, with an optional
// parenthetical, alone or before a colon; [1] is the text after the colon.
const HEADING_LABEL = new RegExp(
  `^${NAME}(?: ?\\([^)]*\\))?(?::([\\s\\S]*)|[ \\t]*)$`,
  "iu",
);
// A bold label sits below every heading, so any heading ends its section.
const BOLD_LABEL_LEVEL = 6;
// A line whose first letters are `Known issue(s)`, behind any marker and
// however the two words are joined, and that is no label: it advises rather
// than hide a carry-in.
const NEAR_LABEL = /^[^\p{L}]*Known[\s-]+issues?(?![\p{L}\p{N}])/iu;
const clip = (line) => {
  const text = [...line.trim()];
  return text.length > 60 ? `${text.slice(0, 60).join("")}…` : text.join("");
};
const LINE_END = /\r\n?|\n/u;

/** The order's field labels as the order format's reader finds them, each
 * opening a line of a top-level paragraph in one of three forms, with an
 * optional parenthetical after the name: `**Name:**` or `**Name**:` (text
 * may follow either) or `**Name**` alone on its line. A bold phrase with
 * other words after it labels nothing. Each carries its name, the label as
 * written, the text after it on its line and whether it opens its
 * paragraph. */
function fieldLabels(order) {
  const paragraphs = order.tree.children.filter(
    (node) => node.type === "paragraph",
  );
  return order.fields.flatMap((field) => {
    const paragraph = paragraphs.find(
      (node) =>
        node.position.start.offset <= field.start &&
        field.start < node.position.end.offset,
    );
    if (!paragraph) return [];
    const rest = order.source.slice(field.valueStart).split(LINE_END, 1)[0];
    const colon = field.raw.endsWith(":")
      ? 0
      : rest.startsWith(":")
        ? 1
        : rest.trim()
          ? -1
          : 0;
    if (colon < 0) return [];
    return [
      {
        name: field.label,
        line: field.line,
        by: order.source.slice(field.start, field.valueStart + colon),
        text: rest.slice(colon),
        opens: paragraph.children[0].position.start.offset === field.start,
      },
    ];
  });
}

/**
 * The `Known issues and carry-ins` sections of an order's text, read with
 * the order format's reader.
 *
 * A section starts at a label: a field label of that name, or a top-level
 * heading of that name alone or with its colon. It ends before the first
 * later line that holds another label, a heading at the label's level or
 * above (any heading, for a bold label) or an order-field label opening a
 * paragraph; a field label on a line that continues a paragraph is that
 * paragraph's text. Fenced code holds no label, field or heading. `lines`
 * holds the text after the label and every later line of the section as
 * written, and `end` the line that ended it with that line's label or
 * heading, or null at the order's end. `unread` lists the lines outside any
 * section and top-level fence whose first letters are `Known issue` in
 * another layout, and `openFence` the line of a top-level fence the order
 * never closes.
 */
export function knownIssueSections(text) {
  const order = readWorkOrder(text);
  const lines = order.source.split(LINE_END);
  const fields = fieldLabels(order);
  const headings = markdownHeadings(order.source, order.tree).map(
    (heading) => ({
      line: heading.line,
      depth: heading.depth,
      label: HEADING_LABEL.exec(heading.title),
      by: clip(lines[heading.line - 1]),
    }),
  );
  const labels = [
    ...fields
      .filter((field) => LABEL.test(field.name))
      .map(({ line, by, text }) => ({
        line,
        by,
        level: BOLD_LABEL_LEVEL,
        text,
      })),
    ...headings
      .filter((heading) => heading.label)
      .map(({ line, by, depth, label }) => ({
        line,
        by,
        level: depth,
        text: label[1] ?? "",
      })),
  ].sort((a, b) => a.line - b.line);
  const fieldEnds = fields.filter(
    (field) => field.opens && ORDER_FIELD.test(field.name),
  );
  const sections = labels.map((label) => {
    const end = [
      ...labels,
      ...fieldEnds,
      ...headings.filter((heading) => heading.depth <= label.level),
    ]
      .filter((other) => other.line > label.line)
      .sort((a, b) => a.line - b.line)[0];
    return {
      line: label.line,
      lines: [
        label.text.trimStart(),
        ...lines.slice(label.line, end ? end.line - 1 : lines.length),
      ],
      end: end ? { line: end.line, by: end.by } : null,
    };
  });
  const fences = markdownCodeBlocks(order.source, order.tree).filter((block) =>
    order.tree.children.some(
      (node) => node.position.start.offset === block.start,
    ),
  );
  const unread = lines.flatMap((line, index) => {
    const number = index + 1;
    const read =
      sections.some(
        (section) =>
          number >= section.line && number < (section.end?.line ?? Infinity),
      ) ||
      fences.some((fence) => number >= fence.line && number <= fence.endLine);
    return !read && NEAR_LABEL.test(line) ? [number] : [];
  });
  return {
    sections,
    unread,
    openFence: fences.find((fence) => !fence.closed)?.line ?? null,
  };
}

/**
 * What the verify briefing prints for an order: each section's lines under a
 * header naming its label's line, the last line printed and what ended it;
 * one advisory for an empty section, one for the `unread` lines and one for an
 * unclosed fence; then the latest planning receipt's known issues for the
 * order.
 */
export function verificationKnownIssues(root, state) {
  const sections = [];
  const order = readFileSync(
    workOrderAuthorityPath(root, state.workOrderId, state.workOrderPath),
    "utf8",
  );
  const found = knownIssueSections(order);
  if (found.openFence)
    sections.push(
      `Advisory: ${state.workOrderPath} line ${found.openFence} opens a code fence that never closes, so no Known issues label or order field after it is read; read the order from that line for carry-ins.`,
    );
  if (found.unread.length)
    sections.push(
      `Advisory: ${state.workOrderPath} line${found.unread.length === 1 ? "" : "s"} ${found.unread.join(", ")} start${found.unread.length === 1 ? "s" : ""} with \`Known issue\` in a layout this briefing does not read; nothing is printed from ${found.unread.length === 1 ? "it" : "them"}.`,
    );
  for (const section of found.sections) {
    const first = section.lines.findIndex((line) => line.trim());
    const last = section.lines.findLastIndex((line) => line.trim());
    const where = `${state.workOrderPath}:${section.line}`;
    const end = section.end
      ? `before line ${section.end.line}, ${section.end.by}`
      : "with the order";
    sections.push(
      first < 0
        ? `Advisory: ${where} labels Known issues and carry-ins but holds no text; it ends ${end}, and nothing is printed from it.`
        : `Known issues and carry-ins (${where}${last ? `-${section.line + last}` : ""}; ends ${end}):\n${section.lines.slice(first, last + 1).join("\n")}`,
    );
  }
  // This is a projection of already-filed receipts, not a new judgment or a
  // validation gate. The planning check retains receipt integrity validation.
  const directory = docPath(root, "refutations");
  let latest;
  if (existsSync(directory))
    for (const name of readdirSync(directory).sort()) {
      if (!/^\d{4}-\d{2}-\d{2}-[a-z][a-z0-9-]*-\d{3}\.json$/u.test(name))
        continue;
      const file = join(directory, name);
      if (!containedRegularFile(file, directory)) continue;
      let receipt;
      try {
        receipt = JSON.parse(readFileSync(file, "utf8"));
      } catch {
        sections.push(
          `Planning known issues unavailable: ${docRelative(root, "refutations", name)} is not readable JSON.`,
        );
        continue;
      }
      if (
        receipt?.schemaVersion !== "plan-refutation-receipt-v1" ||
        receipt.pass?.kind !== "planning" ||
        !Number.isSafeInteger(receipt.ordinal)
      )
        continue;
      const result = Array.isArray(receipt.result?.orders)
        ? receipt.result.orders.find(
            (row) => row?.workOrderId === state.workOrderId,
          )
        : null;
      if (result && (!latest || receipt.ordinal > latest.receipt.ordinal))
        latest = { receipt, result, name };
    }
  const issues = Array.isArray(latest?.result.findings)
    ? latest.result.findings.filter(
        (finding) => finding?.kind === "known-issue",
      )
    : [];
  const receiptId =
    latest?.receipt.receiptId ?? latest?.name.replace(/\.json$/u, "");
  if (latest && !Array.isArray(latest.result.findings))
    sections.push(
      `Planning known issues unavailable: ${docRelative(root, "refutations", latest.name)} has missing or non-array findings for ${state.workOrderId}; an earlier receipt is not its current judgment.`,
    );
  else if (issues.length)
    sections.push(
      `Planning receipt ${receiptId} known issues for ${state.workOrderId}:\n${issues.map((finding) => `- ${finding.criterionId}: ${finding.reason} Reopen when: ${finding.reopenWhen}`).join("\n")}`,
    );
  else if (latest)
    sections.push(
      `Planning receipt ${receiptId} known issues for ${state.workOrderId}: none.`,
    );
  return sections.length ? `\n\n${sections.join("\n\n")}` : "";
}
