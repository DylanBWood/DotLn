import { compileLoadout, type LoadoutGraph } from "@dotln/compiler";
import { Cadence } from "@dotln/kernel";
import { MISSION_CHECK_LIMITS } from "../mission-check-protocol.js";
import {
  entropyReducerLoadout,
  entropyReducerIdentity,
} from "./entropy-reducer.js";

/** The refuter judges planning passes; this judges running work. Same read-only
 * shape, a different subject. */
export const MISSION_CHECK_QUESTIONS = [
  "Does the observed diff stay inside the contract's declared surfaces?",
  "Does any clause of the contract now read differently from the pinned capsule?",
  "Does the work in this diff contradict a vision thesis or an exclusion?",
  "Does a recent decision commit the session to something the contract excludes?",
] as const;
/** The judge reads the capsule it was handed and returns a judgment through the
 * transport. It needs no other effect, so the Contributor build can host the
 * phase inside its existing base authority rather than widening it. */
export const MISSION_CHECK_ALLOWED = ["repo.read"] as const;
export const MISSION_CHECK_DENIED = [
  "repo.write*",
  "git.mutate*",
  "remote.*",
  "settings.*",
  "decision.*",
  "decision.edit",
] as const;
export const MISSION_CHECK_WORK_ORDER_ID = "wo_mission_check";

export function missionCheckLoadout(expiresAt: number): LoadoutGraph {
  const base = entropyReducerLoadout(expiresAt);
  const active = base.activeMechanics[0]!;
  return {
    ...base,
    loadoutId: "mission-check.v1",
    identity: entropyReducerIdentity,
    role: {
      ...base.role,
      roleId: "mission-check",
      // This judge keeps its own identity when the review route changes.
      version: 1,
      name: "Mission check",
      permissions: [...MISSION_CHECK_ALLOWED],
      obligations: [...MISSION_CHECK_QUESTIONS],
      objectives: [
        "Judge running work against its own contract and the vision, without the implementer's narrative",
      ],
      policyDeltas: [],
    },
    containers: [
      { ...base.containers[0]!, socketBudget: 0, supportFacetIds: [] },
    ],
    activeMechanics: [
      {
        ...active,
        // Preserve this judge's existing identity and vocabulary.
        version: 2,
        tags: ["observe", "research", "plan", "verify", "delegate", "narrate"],
        semantics: [
          "one read-only mission check; a drift finding holds unattended dispatch and decides nothing else",
        ],
        inspection: {
          ...active.inspection,
          grants: [
            "Read the pinned mission-check capsule",
            "Emit a validated mission-check judgment",
          ],
          restrictions: [
            "No model tools, writes, remotes, settings changes, repairs or operator decisions",
          ],
          obligations: [
            "Name a supplied clause, thesis or exclusion in every finding",
            "Name a supplied changed path, decision or contract hash as its evidence",
            "Apply the clean-room floor",
          ],
          passive: ["Read-only judge of running work"],
          pulse: ["One episode on the presence policy's mission-check cadence"],
          interrupt: ["Stop at episode expiry or operator return"],
        },
        workOrder: {
          ...active.workOrder,
          workOrderId: MISSION_CHECK_WORK_ORDER_ID,
          objective:
            "Judge whether the observed work is still inside its contract and on the vision's theses.",
          acceptanceCriteria: [...MISSION_CHECK_QUESTIONS],
          knownFacts: [
            "Only the pinned capsule is visible",
            "The host adds the structural drift the capsule already proves",
          ],
          decisions: [
            "Read-only inspection profile; the capsule carries no implementer narrative",
          ],
          constraints: [
            "No implementer narrative, transcript or previous verdict",
            "Every finding names a supplied clause, thesis or exclusion and supplied evidence",
            "No model tools",
            "The clean-room floor is locked",
          ],
          nonGoals: [
            "Repairing the drift",
            "Judging a planning pass",
            "Clearing a hold",
            "Certifying this instrument",
          ],
          allowedOperations: [...MISSION_CHECK_ALLOWED],
          prohibitedOperations: [...MISSION_CHECK_DENIED],
          outputContract: { schema: "mission-check-v1" },
        },
        authorityEnvelope: {
          ...active.authorityEnvelope,
          authorityEnvelopeId: "auth_mission_check",
          allowedEffects: [...MISSION_CHECK_ALLOWED],
          deniedEffects: [...MISSION_CHECK_DENIED],
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

export function compileMissionCheck(revision: string, dispatchedAt: number) {
  const compiled = compileLoadout(
    missionCheckLoadout(dispatchedAt + MISSION_CHECK_LIMITS.timeoutMs),
    {
      environmentId: "mission-check-v1",
      version: 1,
      capabilities: [],
      repo: "mission-subject",
      baseCommit: revision,
    },
  );
  if (!compiled.ok)
    throw new Error(
      compiled.diagnostics.map(({ message }) => message).join("\n"),
    );
  return { ...compiled, cadence: Cadence.Once(dispatchedAt) };
}
