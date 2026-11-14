// The documents a resident's mission check judges, read through the
// repository's readers for the runtime package, which reads no Markdown: a
// work order's contract clauses, the JSON blocks of its decision history and
// the product vision. scripts/resident.mjs hands this reader to the
// resident, and scripts/resident-bind.mjs pins the capsule with it.
import { markdownJsonBlocks, markdownListItems } from "./markdown-links.mjs";
import { readVision } from "./vision-document.mjs";
import { readWorkOrder, refuseUnreadList } from "./work-order-document.mjs";

/** A contract's clauses: the text its Objective, Non-goals and Evidence gate
 * fields introduce (`null` when absent or empty), and each item of the
 * ordered list its Acceptance criteria field introduces, with the number
 * written before it. A criteria list the parser would read as shorter than
 * written is refused, as the lifecycle's reader refuses it, so a mission
 * check never judges against part of the list. */
export function missionContract(markdown) {
  const order = readWorkOrder(markdown);
  // A clause is introduced by a label of the order's own text: a field a
  // quotation or a list item shows is an example and introduces nothing.
  const text = (label) => {
    const field = order.labels.find((candidate) => candidate.label === label);
    return (field && order.fieldText(field)) || null;
  };
  const criteria = order.labels.find((candidate) =>
    candidate.label.startsWith("Acceptance criteria"),
  );
  if (criteria) refuseUnreadList(order, criteria, "acceptance criteria");
  const extent = criteria && order.fieldExtent(criteria);
  return {
    objective: text("Objective"),
    criteria: extent
      ? markdownListItems(order.source, order.tree)
          .filter(
            (item) =>
              item.ordered &&
              item.start >= extent.start &&
              item.start < extent.end,
          )
          .map((item) => ({ number: item.written, text: item.text }))
      : [],
    nonGoals: text("Non-goals"),
    evidenceGate: text("Evidence gate"),
  };
}

/** The text of each decision a decisions file records, in order: its
 * top-level fenced blocks marked `json`, which is what the decision index
 * reads. A fenced example inside a quotation or a list is prose about a
 * decision and records none, so it cannot take a real decision's place in
 * the mission's window. */
export const decisionBlocks = (markdown) =>
  markdownJsonBlocks(markdown).map((block) => block.value);

/** The reader `mission-check-source.ts` takes from its script-side caller. */
export const missionDocumentReader = Object.freeze({
  contract: missionContract,
  decisions: decisionBlocks,
  vision: readVision,
});
