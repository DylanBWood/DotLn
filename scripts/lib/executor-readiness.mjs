import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { nextAdjacentItem, readAdjacentQueue } from "./adjacent-queue.mjs";

/** Project installed equipment, never infer chat delivery or defect recognition. */
export function executorEntryBriefing(root, workOrder) {
  const path = join(root, ".claude/harness-manifest.json");
  const ids = existsSync(path)
    ? (JSON.parse(readFileSync(path, "utf8")).origin?.ids ?? [])
    : [];
  const lines = [];
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
