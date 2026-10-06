import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { docPath, docRelative } from "./config.mjs";
import { containedRegularFile, workOrderAuthorityPath } from "./paths.mjs";

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
// The order is read line by line, and structure counts only at the start of a
// line: no inline code, list, quote or continuation is interpreted, so
// anything indented or behind a marker is text. A field label has three exact
// forms, each with an optional parenthetical after the name: `**Name:**`,
// `**Name**:` (text may follow either) and `**Name**` alone on its line.
const labelForm = (names) =>
  `\\*\\*(?:${names})(?: ?\\([^)]*\\))?(?::\\*\\*|\\*\\*:|\\*\\*[ \\t]*$)`;
const FIELD = new RegExp(`^${labelForm(ORDER_FIELDS)}`, "iu");
// The section's label is that field's label, or a heading of that name alone
// or with its colon; [1] is a heading's marker and [2] the text after it.
const LABEL = new RegExp(
  `^(?:${labelForm(NAME)}|(#{1,6})[ \\t]+${NAME}(?: ?\\([^)]*\\))?(?::|[ \\t]*$))(.*)$`,
  "isu",
);
const HEADING = /^(#{1,6})[ \t]/u;
// A bold label sits below every heading, so any heading ends its section.
const BOLD_LABEL_LEVEL = 6;
// A fence opens at a line that starts with three or more backticks (and holds
// no later backtick, so a line opening with inline code opens nothing) or
// three or more tildes. It closes at a line of that character, at least as
// long, indented at most three spaces, with nothing after it; a shorter or
// other fence inside is text.
const FENCE = /^(?:(`{3,})[^`]*|(~{3,}).*)$/su;
const closes = (marker, line) => {
  const run = /^ {0,3}(`+|~+)[ \t]*$/u.exec(line)?.[1];
  return run?.[0] === marker[0] && run.length >= marker.length;
};
// A line whose first letters are `Known issue(s)`, behind any marker and
// however the two words are joined, and that is no label: it advises rather
// than hide a carry-in.
const NEAR_LABEL = /^[^\p{L}]*Known[\s-]+issues?(?![\p{L}\p{N}])/iu;
const clip = (line) => {
  const text = [...line.trim()];
  return text.length > 60 ? `${text.slice(0, 60).join("")}…` : text.join("");
};

/**
 * The `Known issues and carry-ins` sections of an order's text.
 *
 * A section starts at a label line. It ends before the first later line that
 * is a heading at the label's level or above (any heading, for a bold label)
 * or that follows a blank line and is an order-field label; a field label on
 * a line that continues a paragraph is that paragraph's text. Inside a fence
 * no label, field or heading is read. `lines` holds the text after the label
 * and every later line of the section as written, and `end` the line that
 * ended it with that line's label or heading, or null at the order's end.
 * `unread` lists the lines outside any section and fence that start
 * `Known issue` in another layout, and `openFence` the line of a fence the
 * order never closes.
 */
export function knownIssueSections(order) {
  const sections = [];
  const unread = [];
  let fence = null;
  let open = null;
  let blank = true;
  for (const [index, line] of order.split(/\r\n?|\n/u).entries()) {
    const opener = fence ? null : FENCE.exec(line);
    if (fence || opener) {
      if (opener) fence = { line: index + 1, marker: opener[1] ?? opener[2] };
      else if (closes(fence.marker, line)) fence = null;
      open?.lines.push(line);
      blank = false;
      continue;
    }
    const label = LABEL.exec(line);
    const heading = HEADING.exec(line)?.[1].length;
    const field = FIELD.exec(line)?.[0].trimEnd();
    if (open && (label || (blank && field) || heading <= open.level)) {
      open.end = { line: index + 1, by: field ?? clip(line) };
      open = null;
    }
    if (label) {
      open = {
        line: index + 1,
        level: label[1]?.length ?? BOLD_LABEL_LEVEL,
        lines: [label[2].trimStart()],
        end: null,
      };
      sections.push(open);
    } else if (open) open.lines.push(line);
    else if (NEAR_LABEL.test(line)) unread.push(index + 1);
    blank = !line.trim();
  }
  return {
    sections: sections.map(({ line, lines, end }) => ({ line, lines, end })),
    unread,
    openFence: fence?.line ?? null,
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
        latest = { receipt, result };
    }
  const issues = Array.isArray(latest?.result.findings)
    ? latest.result.findings.filter(
        (finding) => finding?.kind === "known-issue",
      )
    : [];
  if (issues.length)
    sections.push(
      `Planning receipt ${latest.receipt.receiptId} known issues for ${state.workOrderId}:\n${issues.map((finding) => `- ${finding.criterionId}: ${finding.reason} Reopen when: ${finding.reopenWhen}`).join("\n")}`,
    );
  return sections.length ? `\n\n${sections.join("\n\n")}` : "";
}
