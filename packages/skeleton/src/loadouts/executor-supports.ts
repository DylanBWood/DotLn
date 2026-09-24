import type { SupportFacet } from "@dotln/compiler";
import { promptSupport } from "./prompt-support.js";

export const tinkererEconomy = promptSupport(
  "tinkerer-economy",
  "Tinkerer — Economy",
  "Tinkerer — Economy: Before implementation on next or fix, name at most one economy opportunity per order, within the order's existing authority. State the question, credible alternatives, deciding observation and a wall-clock budget at most 900 s including preparation and recording; run within it or decline with a reason. Record one kind: experiment decision in docs/evidence/WO-NNN/decisions.md with question, alternatives, observation, budget.wallSeconds, execution (run or declined), cost (measured wallSeconds, tokens or null, commands and source), effect (wallSecondsPerOrder and tokensPerOrder or null, commands and summary), outcome (adopted, kept-current or inconclusive) and reopenWhen. Declining uses kept-current and a reason; keeping the current method is valid. Include regression (true, false or unknown) and history (lastAdoptedImprovementAt or null, experimentsSinceAdoption or null); a probe alone is not an improvement. Read an existing experiment before repair; do not start a second one. No new authority, gate, agent or adaptive schedule is granted. See WO-145's decisions for trial selection and the reading after three orders.",
);

export const adjacentRepair: SupportFacet = {
  ...promptSupport(
    "adjacent-repair",
    "Adjacent Repair",
    "Adjacent Repair: During resume: next or resume: fix, prefer a bounded repair to an encountered adjacent bug; neither pre-existing origin nor omission from the original assignment is by itself a reason to defer. Choose within the effective authority and the existing scope guard.",
  ),
  semanticsModified: [
    {
      from: "Repair only those obligations.",
      to: "Preserve those obligations and apply the equipped Adjacent Repair support to encountered defects.",
    },
  ],
};

export const decisionReceipts = promptSupport(
  "decision-receipts",
  "Decision Receipts",
  "Decision Receipts: Record each material decision in the established durable decision surfaces with its observed evidence, chosen option and rationale, rejected options with reasons, and a reversal condition for a deferred choice. This support supplies documentation, not a preference for intervention or a new approval step.",
);

export const followUpQueue = promptSupport(
  "follow-up-queue",
  "Follow-up Queue",
  "Follow-up Queue: After diagnosing an adjacent bug and identifying a concrete fix, add its cause, intended fix, paths, checks and priority to the worktree queue through `npm run adjacent -- apply --file <request.json>`; use `npm run adjacent -- list` for its current revision and order. Finish the current item or reach a safe boundary before starting the next. Apply operator vetoes, reprioritization, scope changes, known-issue dispositions and deferrals to another work order or planning session; a scope change requires a fresh announcement. After recording a decision that names a `followup`, run `npm run plan -- followups --sync` and dispose the deferred item onto the minted `FUP-` identifier, never onto prose; a `retarget` action links an earlier deferral, also at final review.",
);

export const operatorCheckIn = promptSupport(
  "operator-check-in",
  "Operator Check-In",
  "Operator Check-In: Before starting the next queued item, reach a safe tool boundary, offer a reasonable opportunity for steering through available asynchronous input or a turn boundary, process available operator messages, and reread the queue. Record the observation as actor-attested; never invent an inbox readback. Do not cancel an in-flight command to poll or wait indefinitely for approval. A changed queue invalidates the previous check-in.",
);

const communicationIds = [
  "communication-observation",
  "communication-recommendation",
  "communication-intent",
] as const;
const communication = (
  id: string,
  name: string,
  text: string,
): SupportFacet => ({
  ...promptSupport(id, name, text),
  conflictsWith: communicationIds.filter((other) => other !== id),
});
export const observation = communication(
  "communication-observation",
  "Observation",
  "Observation: Report the finding and its evidence as an observation. Keep a queued repair available for operator disposition; this communication level does not announce automatic implementation.",
);
export const recommendation = communication(
  "communication-recommendation",
  "Recommendation",
  "Recommendation: State the proposed course and why you recommend it, then retain it in the queue for operator disposition. This communication level does not announce automatic implementation.",
);
export const intentToAct = communication(
  "communication-intent",
  "Intent to Act",
  "Intent to Act: On entry, tell the operator in chat 'I intend to' followed by the concrete initial action and scope. Before each next queued action, announce its scope and order and record the actual announcement against the item's current revision. Proceed within existing authority after current work and a reasonable steering opportunity unless the operator vetoes or redirects; this is not a routine permission request.",
);

export const executorSupports: readonly SupportFacet[] = [
  adjacentRepair,
  decisionReceipts,
  followUpQueue,
  operatorCheckIn,
  observation,
  recommendation,
  intentToAct,
  tinkererEconomy,
];
export const executorSupportDefaults = {
  "adjacent-repair": true,
  "decision-receipts": true,
  "follow-up-queue": true,
  "operator-check-in": true,
  "communication-observation": false,
  "communication-recommendation": false,
  "communication-intent": true,
  "tinkerer-economy": true,
} as const;
export const defaultExecutorSupportIds: readonly string[] = Object.entries(
  executorSupportDefaults,
).flatMap(([id, enabled]) => (enabled ? [id] : []));

export type ExecutorSupportSwitches = Readonly<
  Partial<Record<keyof typeof executorSupportDefaults, boolean>>
>;

/** Pre-run options select immutable equipment; neither switch changes authority. */
export function executorSupportIds(
  switches: ExecutorSupportSwitches = {},
): readonly string[] {
  if (
    !switches ||
    typeof switches !== "object" ||
    Array.isArray(switches) ||
    Object.entries(switches).some(
      ([key, enabled]) =>
        !Object.hasOwn(executorSupportDefaults, key) ||
        typeof enabled !== "boolean",
    )
  )
    throw new Error(
      "executor support switches require known ids and ON/OFF booleans",
    );
  return Object.keys(executorSupportDefaults).filter(
    (id) =>
      switches[id as keyof ExecutorSupportSwitches] ??
      executorSupportDefaults[id as keyof ExecutorSupportSwitches],
  );
}
