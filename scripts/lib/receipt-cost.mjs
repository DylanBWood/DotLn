import { rootPattern } from "./config.mjs";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { readControl } from "./control-store.mjs";

/** The closed list (WO-140). A new cause adds a code, never a free-text unknown. */
export const usageCauseCodes = {
  "hooks-fallback":
    "the session's hooks ran in their fallback, so no session observation exists",
  "no-session":
    "no harness session was found for this role and order, so usage had no subject",
  "harness-no-readback":
    "the harness exposes no complete session counter readback; utility-request counters alone are partial",
};
export const COST_LINE_PREFIX = "**Process cost:**";
/** `verify` and `final-review` stamp this on the receipt they allocate. */
export const COST_LINE_REQUIRED = "required";
export const costLineForms = `${COST_LINE_PREFIX} entry <total> tokens; handoff <total> tokens; source <source>\` or \`${COST_LINE_PREFIX} unknown; cause <${Object.keys(usageCauseCodes).join("|")}>`;
export const costLineBriefing = `Put exactly one physical cost line in the report: \`${costLineForms}\`. The result transition and npm run test:docs refuse a bare unknown.`;

const receiptPath = (root) =>
  new RegExp(
    `^(?:${rootPattern(root, "verifications")}/WO-\\d{3}/VER|${rootPattern(root, "finalReviews")}/WO-\\d{3}/FINAL)-\\d{3}\\.md$`,
  );
// The line may be indented or a list item; a fenced example is not the line.
const costLine = /^\s*(?:[-*]\s+)?\*\*Process cost:\*\*(.*)$/;
const costLines = (report) => {
  let fenced = false;
  return report.split(/\r?\n/).flatMap((line) => {
    if (/^\s*(?:```|~~~)/.test(line)) fenced = !fenced;
    const body = fenced ? null : costLine.exec(line)?.[1];
    return body === undefined || body === null ? [] : [body];
  });
};
// A counter is a number of tokens, never a digit borrowed from a date or id.
const counter = (body, name) =>
  new RegExp(
    `(?<![\\w-])${name}\\s*[:=]?\\s*(?:\\d{1,3}(?:,\\d{3})+|\\d+)\\s+tokens?\\b`,
    "i",
  ).test(body);
const sourced = (body) =>
  /(?<![\w-])source(?:\s*[:=]\s*|\s+)(?!(?:unknown|unavailable|none|n\/a|tbd|not|is|no)\b)[a-z0-9]/i.test(
    body.replace(/[`"']/g, ""),
  );
// A cause is the code that directly follows the word, never a passing mention.
const causes = (body) => [
  ...new Set(
    [
      ...body.matchAll(
        new RegExp(
          `(?<![\\w-])cause\\s*[:=]?\\s+\`?(${Object.keys(usageCauseCodes).join("|")})\`?(?![\\w-])`,
          "g",
        ),
      ),
    ].map((match) => match[1]),
  ),
];

/** @returns {string|null} the refusal, or null when the line is admitted */
export function judgeCostLine(report) {
  const lines = costLines(report);
  if (lines.length !== 1)
    return `expected exactly one ${COST_LINE_PREFIX} line outside code fences, found ${lines.length}`;
  const [body] = lines;
  // A second code mentioned beside the named cause leaves the cause ambiguous.
  const mentioned = Object.keys(usageCauseCodes).filter((code) =>
    new RegExp(`(?<![\\w.-])${code}(?![\\w-])`).test(body),
  );
  const named = mentioned.length > 1 ? mentioned : causes(body);
  const counters =
    counter(body, "entry") && counter(body, "handoff") && sourced(body);
  if (counters && !named.length) return null;
  if (!counters && named.length === 1) return null;
  if (named.length > 1)
    return `names ${named.length} cause codes (${named.join(", ")}); record exactly one`;
  if (counters)
    return "records complete counters and a cause code; record one or the other";
  return `records neither the entry and handoff counters with their source nor one cause code (${Object.keys(usageCauseCodes).join(", ")})`;
}

/**
 * New receipts only: a receipt is judged when the transition that allocated
 * it stamped the requirement. Earlier receipts, and a sibling worktree's
 * receipt allocated before it integrated this rule, carry no stamp and pass.
 */
export function requiredCostReceipts(root) {
  const allocated = receiptPath(root);
  return [...readControl(root).eventSegments.values()]
    .flat()
    .filter(
      (event) =>
        ["VerificationRequested", "FinalReviewRequested"].includes(
          event.type,
        ) &&
        event.costLine === COST_LINE_REQUIRED &&
        typeof event.reportPath === "string" &&
        allocated.test(event.reportPath),
    )
    .map((event) => event.reportPath);
}

const refusalText = (refusals) =>
  `Receipt cost lines refused:\n${refusals.join("\n")}\nUse \`${costLineForms}\`.`;

/**
 * The result transition judges the stamped report while its author can still
 * edit it; an immutable receipt must never be the first to meet this rule.
 */
export function requireReceiptCostLine(root, reportPath) {
  if (!requiredCostReceipts(root).includes(reportPath)) return;
  const refusal = judgeCostLine(readFileSync(join(root, reportPath), "utf8"));
  if (refusal)
    throw new Error(refusalText([`${reportPath}: cost line ${refusal}`]));
}

export function checkReceiptCostLines(root) {
  const refusals = [...new Set(requiredCostReceipts(root))]
    // An allocated report that is not written yet has nothing to judge.
    .filter((path) => existsSync(join(root, path)))
    .flatMap((path) => {
      const refusal = judgeCostLine(readFileSync(join(root, path), "utf8"));
      return refusal ? [`${path}: cost line ${refusal}`] : [];
    });
  if (refusals.length) throw new Error(refusalText(refusals));
  return refusals;
}
