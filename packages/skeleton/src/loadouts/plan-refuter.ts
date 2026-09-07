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
  "For each planned order: thesis-advancing, machinery, or drift?",
  "Which vision thesis or exclusion passage supports that verdict?",
  "Which capability row would the order move or create?",
  "Which of the five UIFA roles gets a surface?",
  "What is the single largest remaining gap to the one-paragraph story?",
  "Does the horizon pass or hold, and which order and criterion must answer each hold?",
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
            "No drift finding without a vision passage",
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
          outputContract: { schema: "plan-refutation-v1" },
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
