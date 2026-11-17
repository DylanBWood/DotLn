import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { nextAdjacentItem, readAdjacentQueue } from "./adjacent-queue.mjs";
import { readFeatures } from "./features.mjs";
import {
  closeoutAdvisory,
  closeoutHeadings,
  closeoutRunnerFor,
  closeoutSatisfiedBy,
  closeoutScope,
  closeoutStandingFor,
  closeoutText,
} from "./closeout-scope.mjs";

export { closeoutRunnerFor, closeoutScope, closeoutStandingFor };

/** The closeout selection as a lifecycle briefing prints it, spelled for
 * the target worktree of a target order. It describes the order's changes as
 * they stand, so the role reads it again at closeout. `standing` is the
 * passing complete review row at the current code identity, where one
 * stands: the briefing then says the complete run is satisfied. `scope` is
 * the selection where the caller has already computed it for this order. */
export const closeoutBriefing = (root, state, runner, standing, scope) =>
  `\n${closeoutText(
    root,
    closeoutSatisfiedBy(
      scope && scope.workOrder === state?.workOrderId
        ? scope
        : closeoutScope(root, state, { runner }),
      standing,
    ),
    { heading: closeoutHeadings.briefing, qualified: true },
  )}`;

/** The same selection as one line a completion records. */
export const closeoutCompletionAdvisory = (root, state, runner) =>
  closeoutAdvisory(root, closeoutScope(root, state, { runner }));

/** Project installed equipment, never infer chat delivery or defect recognition. */
export function executorEntryBriefing(
  root,
  workOrder,
  { experiment = false } = {},
) {
  const path = join(root, ".claude/harness-manifest.json");
  const ids = existsSync(path)
    ? (JSON.parse(readFileSync(path, "utf8")).origin?.ids ?? [])
    : [];
  const lines = [];
  if (
    experiment &&
    readFeatures(root)["tinkerer-economy"] &&
    ids.includes("tinkerer-economy")
  )
    lines.push(
      "Tinkerer — Economy is equipped for this declared experiment: run the bounded comparison and record both arms and their measured cost.",
    );
  if (ids.includes("adjacent-repair"))
    lines.push(
      "Adjacent Repair is equipped: diagnose encountered defects and prefer bounded repairs within the current authority; do not wait for the operator to name this support.",
    );
  if (ids.includes("communication-intent"))
    lines.push(
      "Intent to Act is equipped: tell the operator 'I intend to' and the concrete initial action before implementation; announce each next queued action before starting it. This briefing is not chat-delivery evidence.",
    );
  if (ids.includes("communication-observation"))
    lines.push(
      "Observation is equipped: report findings without announcing automatic implementation.",
    );
  if (ids.includes("communication-recommendation"))
    lines.push(
      "Recommendation is equipped: recommend a course and retain it for operator disposition.",
    );
  if (ids.includes("decision-receipts"))
    lines.push(
      "Decision Receipts is equipped: record material choices, evidence, alternatives and reopening conditions.",
    );
  if (ids.includes("operator-check-in"))
    lines.push(
      "Operator Check-In is equipped: at a safe boundary, process available steering and reread the queue before the next item.",
    );
  if (ids.includes("follow-up-queue")) {
    const queue = readAdjacentQueue(root, workOrder);
    const running = queue.items.find((item) => item.status === "running");
    const next = nextAdjacentItem(queue);
    lines.push(
      `Follow-up Queue is equipped (revision ${queue.revision}): running ${running ? `${running.id}: ${running.spec.summary}` : "none"}; next ${next ? `${next.id}: ${next.spec.summary}` : "none"}. Record diagnosed fixes with cause, scope, checks and priority through npm run adjacent -- apply --file <request.json>. Complete or explicitly dispose every item before handoff.`,
    );
  }
  return lines.length ? `\nExecutor entry duties:\n${lines.join("\n")}` : "";
}

export { requirePlanApproval } from "./plan-first.mjs";
