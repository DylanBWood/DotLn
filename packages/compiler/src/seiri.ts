import { compileEditableView } from "./compile.js";
import {
  defineLoadout,
  functionTableFromLoadout,
  statechartJsonFromLoadout,
} from "./views.js";
import type {
  CompilationEnvironment,
  CompileResult,
  LoadoutGraph,
  PredicateRef,
  SupportFacet,
} from "./types.js";

export const SEIRI_MINUTE = 60_000;
export const SEIRI_PULSE_SCHEDULE = "schedule_seiri_20m";
export const SEIRI_QUEUED_PULSE = "schedule_seiri_already_queued";

export const seiriPresenceRefs = {
  away: { registryId: "operator.away", version: 1 },
  returned: { registryId: "operator.returned", version: 1 },
  returnEvent: { registryId: "operator.return-event", version: 1 },
} as const satisfies Readonly<Record<string, PredicateRef>>;

const supportDefaults = {
  version: 1,
  requiredCapabilities: [],
  semanticsModified: [],
  authorityChanges: [],
  evidenceRequirements: [],
  resourceMultiplier: 1,
  conflictsWith: [],
  preservesDeterminism: true,
  commutativity: "commutative",
  claims: [],
} as const;

export const seiriSupports = {
  repositoryScope: {
    ...supportDefaults,
    supportFacetId: "seiri.repo-scope",
    name: "Bounded repository scope",
    supportedTags: ["observe"],
    requiredCapabilities: ["fixture-repository"],
    semanticsAdded: ["bounded repository scope"],
    emissions: [
      {
        kind: "work-order",
        emissionId: "scope.constraint",
        field: "constraints",
        values: ["Inspect only the fixture tree"],
        order: 10,
      },
      {
        kind: "work-order",
        emissionId: "scope.non-goal",
        field: "nonGoals",
        values: ["Inspect another repository"],
        order: 20,
      },
    ],
    cost: {
      mechanismType: "work-order",
      promptTokens: 0,
      runtimeCost: { quantity: 0, unit: "operations" },
      extraEpisodes: 0,
    },
    inspection: {
      restrictions: ["Inspect only the bounded fixture repository"],
    },
  },
  readOnly: {
    ...supportDefaults,
    supportFacetId: "seiri.read-only",
    name: "Read only",
    supportedTags: ["observe", "plan"],
    semanticsAdded: ["never delete", "read only"],
    authorityChanges: ["deny repo.delete", "deny repo.write"],
    emissions: [
      {
        kind: "work-order",
        emissionId: "read-only.decision",
        field: "decisions",
        values: ["Deletion remains operator-owned"],
        order: 10,
      },
      {
        kind: "work-order",
        emissionId: "read-only.constraint",
        field: "constraints",
        values: ["Do not mutate repository contents"],
        order: 20,
      },
      {
        kind: "work-order",
        emissionId: "read-only.non-goal",
        field: "nonGoals",
        values: ["Delete files"],
        order: 10,
      },
      {
        kind: "permission-guard",
        emissionId: "read-only.permissions",
        allowedOperations: [],
        prohibitedOperations: ["repo.delete", "repo.write"],
        allowedEffects: [],
        deniedEffects: ["repo.delete", "repo.write"],
      },
    ],
    claims: [
      {
        claimId: "read-only.delete",
        target: "authority.repo.delete",
        value: "deny",
        layer: "hard-permissions",
        hard: true,
      },
    ],
    cost: {
      mechanismType: "permission-guard",
      promptTokens: 0,
      runtimeCost: { quantity: 1, unit: "guard-checks-per-effect" },
      extraEpisodes: 0,
    },
    inspection: {
      restrictions: [
        "Do not mutate repository contents",
        "Deletion remains operator-owned",
      ],
    },
  },
  evidenceCapture: {
    ...supportDefaults,
    supportFacetId: "seiri.evidence-capture",
    name: "Evidence capture",
    supportedTags: ["observe", "verify"],
    semanticsAdded: ["attach evidence"],
    evidenceRequirements: ["inventory", "classification", "reference-analysis"],
    emissions: [
      {
        kind: "work-order",
        emissionId: "evidence.acceptance",
        field: "acceptanceCriteria",
        values: ["Attach reference evidence to every candidate"],
        order: 30,
      },
      {
        kind: "evidence-schema",
        emissionId: "evidence.schema",
        schemaId: "seiri.candidates.v1",
        schema: {
          type: "array",
          items: {
            type: "object",
            required: ["path", "classification", "evidence"],
          },
        },
        outputContract: {
          type: "CommandResult",
          result: "candidates",
          candidateFields: ["path", "classification", "evidence"],
        },
      },
    ],
    cost: {
      mechanismType: "evidence-schema",
      promptTokens: 0,
      runtimeCost: { quantity: 1, unit: "schema-validations-per-result" },
      extraEpisodes: 0,
    },
    inspection: {
      obligations: [
        "Attach inventory, classification, and reference evidence to every candidate",
      ],
    },
  },
  absenceCadence: {
    ...supportDefaults,
    supportFacetId: "seiri.absence-cadence",
    name: "Absent-only cadence",
    supportedTags: ["schedule"],
    semanticsAdded: [
      "active only while operator is absent",
      "interrupt on operator return",
      "re-evaluate every 20 virtual minutes",
    ],
    authorityChanges: ["revoke inspection on operator return"],
    emissions: [
      {
        kind: "cadence",
        emissionId: "absence.cadence",
        cadenceId: "seiri.every-20m-until-return",
        scheduleId: SEIRI_PULSE_SCHEDULE,
        queuedScheduleId: SEIRI_QUEUED_PULSE,
        queuedDelayMs: 7,
        cadence: {
          kind: "Until",
          cadence: {
            kind: "Gate",
            cadence: { kind: "Every", intervalMs: 20 * SEIRI_MINUTE },
            conditionRef: seiriPresenceRefs.away,
          },
          conditionRef: seiriPresenceRefs.returned,
        },
        cancelOn: [seiriPresenceRefs.returned],
      },
      {
        kind: "statechart-gate",
        emissionId: "absence.guard",
        activationCondition: seiriPresenceRefs.away,
        interruptionCondition: seiriPresenceRefs.returned,
        authorityRevocationCondition: seiriPresenceRefs.returnEvent,
      },
    ],
    cost: {
      mechanismType: "statechart-gate",
      promptTokens: 0,
      runtimeCost: { quantity: 2, unit: "predicate-evaluations-per-pulse" },
      extraEpisodes: 0,
    },
    inspection: {
      passive: ["Active only while the operator is absent"],
      pulse: ["Re-evaluate every 20 virtual minutes"],
      interrupt: [
        "Stop on operator return; queued pulses become a traced NoOp",
      ],
    },
  },
  independentVerification: {
    ...supportDefaults,
    supportFacetId: "seiri.independent-verification",
    name: "Independent verification",
    supportedTags: ["verify"],
    semanticsAdded: ["independent verification"],
    emissions: [
      {
        kind: "verifier-episode",
        emissionId: "verification.candidates",
        episodeId: "seiri-candidate-verifier",
        subject: "candidates",
        required: true,
      },
    ],
    cost: {
      mechanismType: "verifier-episode",
      promptTokens: 0,
      runtimeCost: { quantity: 1, unit: "verifier-dispatches" },
      extraEpisodes: 1,
    },
    inspection: {
      obligations: ["Independently verify proposed candidates"],
    },
  },
} as const satisfies Readonly<Record<string, SupportFacet>>;

const supportIds = Object.values(seiriSupports).map(
  (support) => support.supportFacetId,
);

export const seiriLoadout: LoadoutGraph = {
  schemaVersion: 1,
  loadoutId: "repo-gardener.seiri.v1",
  identity: {
    identityId: "repo-gardener",
    version: 1,
    name: "Repo Gardener",
    dispositions: ["patient", "evidence-bound", "propose-don't-destroy"],
    invariants: [
      "no deletion authority at base rank",
      "every candidate carries evidence",
    ],
    updateLaws: ["identity updates require a new version"],
    lineage: ["founding Repo Gardener"],
  },
  role: {
    roleId: "fixture-maintainer",
    version: 1,
    name: "Fixture maintainer",
    obligations: ["inspect the bounded fixture"],
    permissions: ["repo.inspect"],
    objectives: ["propose safe deletion candidates"],
    policyDeltas: [{ key: "maintenance", value: "absent-only" }],
  },
  containers: [
    {
      containerId: "repo-gardener.gloves",
      version: 1,
      name: "Repo Gardener gloves",
      kind: "equipment",
      socketBudget: 6,
      activeMechanicIds: ["seiri"],
      supportFacetIds: supportIds,
    },
  ],
  activeMechanics: [
    {
      activeMechanicId: "seiri",
      version: 1,
      name: "Seiri",
      tags: ["observe", "plan", "verify", "schedule"],
      requiredCapabilities: [],
      semantics: [
        "inventory",
        "classify",
        "analyze references",
        "propose deletion candidates",
      ],
      workOrder: {
        workOrderId: "wo_repo_inspection_1",
        objective:
          "Inspect the bounded fixture repository and propose safe deletion candidates.",
        acceptanceCriteria: [
          "Inventory every fixture path",
          "Classify every path",
        ],
        knownFacts: [
          "The repository is a deterministic fixture",
          "The operator is absent at dispatch",
        ],
        decisions: ["Repo Gardener uses Seiri"],
        constraints: [],
        nonGoals: [],
        allowedOperations: [
          "repo.inventory",
          "repo.classify",
          "repo.references",
          "repo.proposeDeletion",
        ],
        prohibitedOperations: [],
        requiredEvidence: [],
        outputContract: {
          type: "CommandResult",
          result: "candidates",
          candidateFields: [],
        },
      },
      authorityEnvelope: {
        authorityEnvelopeId: "auth_seiri",
        allowedEffects: ["repo.inspect"],
        deniedEffects: [],
        resourceLimits: { inspections: 1 },
        requiredEvidence: [],
        expiresAt: 40 * SEIRI_MINUTE,
        revocationEventTypes: [],
        revocationConditions: [],
      },
      inspection: {
        originalTerm: "Seiri",
        translation: "Sort",
        kanji: "整理",
        rpgTitle: "The Evidence-Bound Sort",
        grants: [
          "Inventory every fixture path",
          "Classify every fixture path",
          "Analyze references",
          "Propose deletion candidates",
        ],
        restrictions: [],
        obligations: [],
        passive: [],
        pulse: [],
        interrupt: [],
      },
    },
  ],
  supportFacets: Object.values(seiriSupports),
  links: Object.values(seiriSupports).map((support, index) => ({
    linkId: `seiri.link.${String(index + 1).padStart(2, "0")}`,
    linkGroupId: "seiri.links",
    activeMechanicId: "seiri",
    supportFacetId: support.supportFacetId,
  })),
  linkGroups: [
    {
      linkGroupId: "seiri.links",
      containerId: "repo-gardener.gloves",
      linkIds: Object.values(seiriSupports).map(
        (_, index) => `seiri.link.${String(index + 1).padStart(2, "0")}`,
      ),
    },
  ],
  explicitPipelines: [],
  ambientEffects: [],
  resourceModel: {
    resourceModelId: "seiri.fixture-resources",
    version: 1,
    capacities: { inspections: 1 },
    reservations: [],
  },
  polarAxes: [],
};

export const seiriCodeDslView = defineLoadout(seiriLoadout);
export const seiriFunctionTableView = functionTableFromLoadout(seiriLoadout);
export const seiriStatechartJsonView = statechartJsonFromLoadout(seiriLoadout);

export const seiriEnvironment = (
  baseCommit = "fixture-base",
): CompilationEnvironment => ({
  environmentId: "skeleton.fixture",
  version: 1,
  capabilities: ["fixture-repository"],
  repo: "packages/skeleton/fixtures/repo-tree.json",
  baseCommit,
});

export const compileSeiri = (baseCommit = "fixture-base"): CompileResult =>
  compileEditableView(seiriCodeDslView, seiriEnvironment(baseCommit));
