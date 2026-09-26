import { compileLoadout, type LoadoutGraph } from "@dotln/compiler";
import { Cadence } from "@dotln/kernel";
import { PLAN_REFUTATION_LIMITS } from "../plan-refutation-protocol.js";
import {
  entropyReducerLoadout,
  entropyReducerIdentity,
  entropyReducerLensBriefs,
  entropyReducerMasks,
} from "./entropy-reducer.js";

export const PLAN_REFUTER_QUESTIONS = [
  "For each order, which critical-path gate does it unblock and what is the NoOp cost in the records?",
  "How do all eight system traps apply to the order's own process cost?",
  "Does the Cost line name a removal larger than the addition?",
  "Does failure of the mechanism degrade to the old behavior rather than refusing?",
] as const;
export const PLAN_REFUTER_ALLOWED = ["repo.read*", "report.emit"] as const;
export const PLAN_REFUTER_DENIED = [
  "repo.write*",
  "git.mutate*",
  "remote.*",
  "settings.*",
  "decision.*",
  "decision.edit",
] as const;

export function planRefuterLoadout(expiresAt: number): LoadoutGraph {
  const base = entropyReducerLoadout(expiresAt);
  const active = base.activeMechanics[0]!;
  return {
    ...base,
    loadoutId: "plan-refuter.v1",
    identity: entropyReducerIdentity,
    role: {
      ...base.role,
      roleId: "plan-refuter",
      // This role keeps its own identity when the review route changes.
      version: 1,
      name: "Plan refuter",
      permissions: [...PLAN_REFUTER_ALLOWED],
      obligations: [...PLAN_REFUTER_QUESTIONS],
      objectives: [
        "Challenge the planning horizon against the vision without planner narrative",
      ],
      policyDeltas: [],
    },
    containers: [
      { ...base.containers[0]!, socketBudget: 0, supportFacetIds: [] },
    ],
    activeMechanics: [
      {
        ...active,
        // Its own version: WO-100 versioned Seisō for the entropy reviewer pin,
        // a known fact this active overrides, so the refuter is unchanged.
        version: 1,
        // Preserve this plan's vocabulary; it grants no delegate effects.
        tags: ["observe", "research", "plan", "verify", "delegate", "narrate"],
        semantics: [
          "one blinded plan refutation; findings confer no decision authority",
        ],
        inspection: {
          ...active.inspection,
          grants: [
            "Read the compiled planning subject",
            "Emit a validated refutation",
          ],
          restrictions: [
            "No model tools, writes, remotes, settings changes or operator decisions",
          ],
          obligations: [
            "Name the vision passage behind every drift finding",
            "Preserve all unanswered holds",
            "Apply the clean-room floor",
          ],
          passive: ["Contra-Auguste; architecture-and-semantics lens"],
          pulse: ["One blinded episode on explicit planning dispatch"],
          interrupt: ["Stop at episode expiry"],
        },
        workOrder: {
          ...active.workOrder,
          workOrderId: "wo_plan_refuter",
          objective:
            "Refute the proposed horizon against the vision and the five roles.",
          acceptanceCriteria: [...PLAN_REFUTER_QUESTIONS],
          knownFacts: [
            "Only the compiled subject is visible",
            "WO-041's own verdict is advisory",
          ],
          decisions: ["Contra-Auguste mask; architecture-and-semantics lens"],
          constraints: [
            "No planner narrative or previous receipts",
            "Only observed failure or vision contradiction holds; hypothetical issues name reopening observations",
            "No model tools",
            "The clean-room floor is locked",
          ],
          nonGoals: [
            "Planning or implementing changes",
            "Overriding a hold",
            "Certifying the refutation mechanism",
          ],
          allowedOperations: [...PLAN_REFUTER_ALLOWED],
          prohibitedOperations: [...PLAN_REFUTER_DENIED],
          outputContract: { schema: "plan-goal-review-v1" },
        },
        authorityEnvelope: {
          ...active.authorityEnvelope,
          authorityEnvelopeId: "auth_plan_refuter",
          allowedEffects: [...PLAN_REFUTER_ALLOWED],
          deniedEffects: [...PLAN_REFUTER_DENIED],
          resourceLimits: {},
        },
      },
    ],
    supportFacets: [],
    links: [],
    linkGroups: [],
    resourceModel: { ...base.resourceModel, capacities: {}, reservations: [] },
  };
}

export function compilePlanRefuter(revision: string, dispatchedAt: number) {
  const compiled = compileLoadout(
    planRefuterLoadout(dispatchedAt + PLAN_REFUTATION_LIMITS.timeoutMs),
    {
      environmentId: "plan-refutation-v1",
      version: 1,
      capabilities: [],
      repo: "plan-subject",
      baseCommit: revision,
    },
  );
  if (!compiled.ok)
    throw new Error(
      compiled.diagnostics.map(({ message }) => message).join("\n"),
    );
  return {
    ...compiled,
    cadence: Cadence.Once(dispatchedAt),
    mask: entropyReducerMasks.find(({ mask }) => mask === "Contra-Auguste")!,
    lens: entropyReducerLensBriefs.find(
      ({ lensId }) => lensId === "architecture-and-semantics",
    )!.lensId,
  };
}
