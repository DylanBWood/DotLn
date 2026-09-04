import {
  canonicalStringify,
  compileLoadout,
  normalizeLoadoutGraph,
  type CompilationEnvironment,
  type CompiledProgram,
  type JsonValue as CompilerJsonValue,
  type LoadoutGraph,
  type SupportFacet,
} from "@dotln/compiler";
import {
  Cadence,
  Program,
  stableHash,
  type ActIntent,
  type EventDraft,
  type JsonValue,
  type ResultEnvelope,
} from "@dotln/kernel";

export const ENTROPY_REDUCER_ACTOR_ID = "entropy-reducer";
export const ENTROPY_REDUCER_WORKSTREAM_ID = "ws_entropy_reducer";
export const ENTROPY_REDUCER_WORK_ORDER_ID = "wo_entropy_review_1";
export const ENTROPY_REDUCER_REFERENCE_EPISODE_ID =
  "ep_entropy_reducer_reference";
export const ENTROPY_REDUCER_REFERENCE_DISPATCH_AT = 0;
export const ENTROPY_REDUCER_REFERENCE_EPISODE_ENDS_AT = 86_400_000;
export const ENTROPY_REDUCER_REVIEWER_MODEL = "claude-fable-5-1";
export const ENTROPY_REDUCER_REVIEWER_EFFORT = "max";

export const ENTROPY_REDUCER_ALLOWED_EFFECTS = [
  "repo.read*",
  "probe.run:scratch*",
  "intake.capture",
  "delegate.readonly",
  "report.emit",
] as const;

export const ENTROPY_REDUCER_DENIED_EFFECTS = [
  "repo.write*",
  "git.mutate*",
  "remote.*",
  "settings.*",
  "decision.edit",
] as const;

export interface EntropyReducerMask {
  readonly mask: "Whiteface" | "Contra-Auguste" | "Watcher" | "Lazzi";
  readonly assignment: string;
  readonly guardedFailureMode: string;
  readonly guard: string;
}

export const entropyReducerMasks = [
  {
    mask: "Whiteface",
    assignment: "planning judgment and rule keeping",
    guardedFailureMode: "over-centralization",
    guard:
      "Treat authority as a boundary, never as proof that a judgment is correct.",
  },
  {
    mask: "Contra-Auguste",
    assignment: "blinded self-refutation",
    guardedFailureMode: "destructive contrarianism",
    guard:
      "Remove a finding that does not survive its independent reproduction instead of defending it.",
  },
  {
    mask: "Watcher",
    assignment: "whole-episode observation",
    guardedFailureMode: "unattributed inference",
    guard:
      "Label what was measured and what was established only by inspection.",
  },
  {
    mask: "Lazzi",
    assignment: "bounded read-only side routines",
    guardedFailureMode: "side-routine budget creep",
    guard:
      "Use fixed briefs, word budgets, and the compiled four-delegate ceiling.",
  },
] as const satisfies readonly EntropyReducerMask[];

export interface LensBrief {
  readonly lensId: string;
  readonly files: readonly string[];
  readonly questions: readonly string[];
  readonly outputShape: readonly string[];
  readonly wordBudget: number;
  readonly noFix: true;
}

export const entropyReducerLensBriefs = [
  {
    lensId: "architecture-and-semantics",
    files: ["docs/product/", "docs/decisions/", "docs/lineage/idea-ledger.md"],
    questions: [
      "Where do implementation and durable product doctrine disagree?",
      "Which settled decision is accidentally being relitigated or bypassed?",
    ],
    outputShape: [
      "criterion",
      "severity",
      "observed",
      "expected",
      "reproduction",
      "evidenceRefs",
      "surface",
    ],
    wordBudget: 650,
    noFix: true,
  },
  {
    lensId: "runtime-and-authority",
    files: ["packages/", "scripts/"],
    questions: [
      "Where can an effect escape its declared authority or resource budget?",
      "Which runtime path diverges from its compiled contract?",
    ],
    outputShape: [
      "criterion",
      "severity",
      "observed",
      "expected",
      "reproduction",
      "evidenceRefs",
      "surface",
    ],
    wordBudget: 650,
    noFix: true,
  },
  {
    lensId: "verification-and-evidence",
    files: ["packages/", "corpus/", "docs/verifications/"],
    questions: [
      "Which acceptance claim lacks an executable witness or meaningful negative control?",
      "Where does a receipt overstate what its cited evidence establishes?",
    ],
    outputShape: [
      "criterion",
      "severity",
      "observed",
      "expected",
      "reproduction",
      "evidenceRefs",
      "surface",
    ],
    wordBudget: 650,
    noFix: true,
  },
  {
    lensId: "maintainability-and-friction",
    files: [
      "README.md",
      "docs/PLAYBOOK.md",
      "docs/product/",
      "docs/publication/",
      "docs/planning/",
      "docs/work-orders/",
      "packages/",
      "scripts/",
    ],
    questions: [
      "Which repeated operator or contributor cost should be standardized?",
      "Where is accidental complexity exported to a later actor?",
    ],
    outputShape: [
      "criterion",
      "severity",
      "observed",
      "expected",
      "reproduction",
      "evidenceRefs",
      "surface",
    ],
    wordBudget: 650,
    noFix: true,
  },
] as const satisfies readonly LensBrief[];

export const lensBriefSchema = {
  $id: "dotln.entropy-reducer.lens-brief.v1",
  type: "object",
  additionalProperties: false,
  required: [
    "lensId",
    "files",
    "questions",
    "outputShape",
    "wordBudget",
    "noFix",
  ],
  properties: {
    lensId: { type: "string", minLength: 1 },
    files: {
      type: "array",
      minItems: 1,
      items: { type: "string", minLength: 1 },
      $comment:
        "The host validator also normalizes separators and case and rejects broad, parent-traversing, absolute, backslash, and docs/intake scopes.",
    },
    questions: {
      type: "array",
      minItems: 1,
      items: { type: "string", minLength: 1 },
    },
    outputShape: {
      type: "array",
      minItems: 1,
      items: { type: "string", minLength: 1 },
    },
    wordBudget: { type: "integer", minimum: 1 },
    noFix: { const: true },
  },
} as const satisfies CompilerJsonValue;

export type FindingSeverity = "blocking" | "major" | "minor";
export type FindingEvidenceLabel = "measured" | "by inspection";
export type StandardizationRung =
  "test" | "lint" | "guard" | "script" | "not-applicable";
export type NonEmptyStrings = readonly [string, ...string[]];
export type FindingReproduction =
  | Readonly<{ kind: "command"; command: string }>
  | Readonly<{ kind: "inspection"; steps: NonEmptyStrings }>;

interface VerificationFindingBase {
  readonly findingId: string;
  readonly criterion: string;
  readonly severity: FindingSeverity;
  readonly observed: string;
  readonly expected: string;
  readonly evidenceRefs: NonEmptyStrings;
  readonly surface: string;
  readonly altitude: number;
  readonly standardization:
    | Readonly<{ kind: "one-off" }>
    | Readonly<{
        kind: "recurring";
        rung: Exclude<StandardizationRung, "not-applicable">;
        rationale: string;
      }>;
}

export type VerificationFinding =
  | (VerificationFindingBase &
      Readonly<{
        evidenceLabel: "measured";
        reproduction: Readonly<{ kind: "command"; command: string }>;
      }>)
  | (VerificationFindingBase &
      Readonly<{
        evidenceLabel: "by inspection";
        reproduction: Readonly<{
          kind: "inspection";
          steps: NonEmptyStrings;
        }>;
      }>);

export interface ProductSuggestion {
  readonly suggestionId: string;
  readonly submittedBy: string;
  readonly problemOrOpportunity: string;
  readonly scope: string;
  readonly evidenceRefs: readonly string[];
  readonly affectedUsers: readonly string[];
  readonly affectedSystems: readonly string[];
  readonly expectedValue: string;
  readonly altitude: number;
  readonly uncertainty: string;
  readonly risks: readonly string[];
  readonly alternatives: readonly string[];
  readonly duplicationHints: readonly string[];
  readonly urgencyRationale: string;
}

export interface ProductSuggestionPacket {
  readonly schemaVersion: 1;
  readonly kind: "ProductSuggestionPacket";
  readonly proposedPath: string;
  readonly sourceEpisodeId: string;
  readonly provenance: NonEmptyStrings;
  readonly corroboratingEvidenceRefs: readonly string[];
  readonly dissentingEvidenceRefs: readonly string[];
  readonly suggestion: ProductSuggestion;
}

export interface CleanRoomResult {
  readonly status: "passed";
  readonly stopConditionsFound: false;
  readonly evidenceRefs: readonly string[];
}

export interface ReviewerOutput {
  readonly schemaVersion: 1;
  readonly findings: readonly VerificationFinding[];
  readonly proposalPackets: readonly ProductSuggestionPacket[];
  readonly resultEnvelope: ResultEnvelope;
  readonly cleanRoom: CleanRoomResult;
}

const SAFE_SUGGESTION_ID_PATTERN = "^(?!\\.{1,2}$)[A-Za-z0-9][A-Za-z0-9._-]*$";
const safeSuggestionId = new RegExp(SAFE_SUGGESTION_ID_PATTERN, "u");

const commandReproductionSchema = {
  type: "object",
  additionalProperties: false,
  required: ["kind", "command"],
  properties: {
    kind: { const: "command" },
    command: { type: "string", minLength: 1 },
  },
} as const satisfies CompilerJsonValue;

const inspectionReproductionSchema = {
  type: "object",
  additionalProperties: false,
  required: ["kind", "steps"],
  properties: {
    kind: { const: "inspection" },
    steps: {
      type: "array",
      minItems: 1,
      items: { type: "string", minLength: 1 },
    },
  },
} as const satisfies CompilerJsonValue;

const findingSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "findingId",
    "criterion",
    "severity",
    "evidenceLabel",
    "observed",
    "expected",
    "reproduction",
    "evidenceRefs",
    "surface",
    "altitude",
    "standardization",
  ],
  properties: {
    findingId: { type: "string", minLength: 1 },
    criterion: { type: "string", minLength: 1 },
    severity: { enum: ["blocking", "major", "minor"] },
    evidenceLabel: { enum: ["measured", "by inspection"] },
    observed: { type: "string", minLength: 1 },
    expected: { type: "string", minLength: 1 },
    reproduction: {
      oneOf: [commandReproductionSchema, inspectionReproductionSchema],
    },
    evidenceRefs: {
      type: "array",
      minItems: 1,
      items: { type: "string", minLength: 1 },
    },
    surface: { type: "string", minLength: 1 },
    altitude: { type: "integer", minimum: 2, maximum: 12 },
    standardization: {
      oneOf: [
        {
          type: "object",
          additionalProperties: false,
          required: ["kind"],
          properties: { kind: { const: "one-off" } },
        },
        {
          type: "object",
          additionalProperties: false,
          required: ["kind", "rung", "rationale"],
          properties: {
            kind: { const: "recurring" },
            rung: { enum: ["test", "lint", "guard", "script"] },
            rationale: { type: "string", minLength: 1 },
          },
        },
      ],
    },
  },
  oneOf: [
    {
      properties: {
        evidenceLabel: { const: "measured" },
        reproduction: commandReproductionSchema,
      },
    },
    {
      properties: {
        evidenceLabel: { const: "by inspection" },
        reproduction: inspectionReproductionSchema,
      },
    },
  ],
} as const satisfies CompilerJsonValue;

export const reviewerOutputContract = {
  $id: "dotln.entropy-reducer.output.v1",
  type: "object",
  additionalProperties: false,
  required: [
    "schemaVersion",
    "findings",
    "proposalPackets",
    "resultEnvelope",
    "cleanRoom",
  ],
  properties: {
    schemaVersion: { const: 1 },
    findings: { type: "array", items: findingSchema },
    proposalPackets: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: [
          "schemaVersion",
          "kind",
          "proposedPath",
          "sourceEpisodeId",
          "provenance",
          "corroboratingEvidenceRefs",
          "dissentingEvidenceRefs",
          "suggestion",
        ],
        properties: {
          schemaVersion: { const: 1 },
          kind: { const: "ProductSuggestionPacket" },
          proposedPath: {
            type: "string",
            minLength: 1,
            pattern:
              "^docs/proposals/(?!\\.{1,2}/$)[A-Za-z0-9][A-Za-z0-9._-]*/$",
            $comment:
              "The host validator also requires the final segment to equal suggestion.suggestionId.",
          },
          sourceEpisodeId: { type: "string", minLength: 1 },
          provenance: {
            type: "array",
            minItems: 1,
            items: { type: "string", minLength: 1 },
          },
          corroboratingEvidenceRefs: {
            type: "array",
            items: { type: "string", minLength: 1 },
          },
          dissentingEvidenceRefs: {
            type: "array",
            items: { type: "string", minLength: 1 },
          },
          suggestion: {
            type: "object",
            additionalProperties: false,
            required: [
              "suggestionId",
              "submittedBy",
              "problemOrOpportunity",
              "scope",
              "evidenceRefs",
              "affectedUsers",
              "affectedSystems",
              "expectedValue",
              "altitude",
              "uncertainty",
              "risks",
              "alternatives",
              "duplicationHints",
              "urgencyRationale",
            ],
            properties: {
              suggestionId: {
                type: "string",
                minLength: 1,
                pattern: SAFE_SUGGESTION_ID_PATTERN,
              },
              submittedBy: { type: "string", minLength: 1 },
              problemOrOpportunity: { type: "string", minLength: 1 },
              scope: { type: "string", minLength: 1 },
              evidenceRefs: {
                type: "array",
                minItems: 1,
                items: { type: "string", minLength: 1 },
              },
              affectedUsers: {
                type: "array",
                minItems: 1,
                items: { type: "string", minLength: 1 },
              },
              affectedSystems: {
                type: "array",
                minItems: 1,
                items: { type: "string", minLength: 1 },
              },
              expectedValue: { type: "string", minLength: 1 },
              altitude: { type: "integer", minimum: 2, maximum: 12 },
              uncertainty: { type: "string", minLength: 1 },
              risks: {
                type: "array",
                items: { type: "string", minLength: 1 },
              },
              alternatives: {
                type: "array",
                items: { type: "string", minLength: 1 },
              },
              duplicationHints: {
                type: "array",
                items: { type: "string", minLength: 1 },
              },
              urgencyRationale: { type: "string", minLength: 1 },
            },
          },
        },
      },
    },
    resultEnvelope: {
      type: "object",
      additionalProperties: false,
      required: [
        "workOrderId",
        "episodeId",
        "status",
        "resultId",
        "summary",
        "requiresHuman",
      ],
      properties: {
        workOrderId: { type: "string", minLength: 1 },
        episodeId: { type: "string", minLength: 1 },
        status: { enum: ["completed", "failed", "blocked"] },
        resultId: { type: "string", minLength: 1 },
        summary: {
          type: "string",
          minLength: 1,
          $comment:
            "The host validator requires fewer than 200 whitespace-delimited words.",
        },
        requiresHuman: { type: "boolean" },
      },
    },
    cleanRoom: {
      type: "object",
      additionalProperties: false,
      required: ["status", "stopConditionsFound", "evidenceRefs"],
      properties: {
        status: { const: "passed" },
        stopConditionsFound: { const: false },
        evidenceRefs: {
          type: "array",
          minItems: 1,
          items: { type: "string", minLength: 1 },
        },
      },
    },
  },
} as const satisfies CompilerJsonValue;

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

export const entropyReducerSupports = {
  standardize: {
    ...supportDefaults,
    supportFacetId: "entropy-reducer.seiketsu-standardize",
    name: "Seiketsu (Standardize)",
    supportedTags: ["plan"],
    semanticsAdded: [
      "route every recurring finding to a test, lint, guard, or script rung",
    ],
    emissions: [
      {
        kind: "work-order",
        emissionId: "standardize.acceptance",
        field: "acceptanceCriteria",
        values: [
          "Route every recurring finding to a proposed test, lint, guard, or script rung",
        ],
        order: 10,
      },
      {
        kind: "prompt-fragment",
        emissionId: "standardize.residue",
        text: "Convert repetition into a cheaper executable standard.",
      },
    ],
    cost: {
      mechanismType: "work-order",
      promptTokens: 24,
      runtimeCost: { quantity: 0, unit: "effects" },
      extraEpisodes: 0,
    },
    inspection: {
      obligations: [
        "Name the cheapest executable rung for every recurring finding",
      ],
    },
  },
  verifyFirst: {
    ...supportDefaults,
    supportFacetId: "entropy-reducer.verify-first",
    name: "Verify-First",
    supportedTags: ["verify"],
    semanticsAdded: [
      "label each finding measured or by inspection",
      "attach an independent reproduction command",
    ],
    evidenceRequirements: ["reproduction"],
    emissions: [
      {
        kind: "evidence-schema",
        emissionId: "verify-first.finding-schema",
        schemaId: "dotln.entropy-reducer.finding.v1",
        schema: findingSchema,
      },
      {
        kind: "prompt-fragment",
        emissionId: "verify-first.residue",
        text: "Measure before concluding, label inspection honestly, and give every finding a runnable reproduction.",
      },
    ],
    cost: {
      mechanismType: "evidence-schema",
      promptTokens: 42,
      runtimeCost: { quantity: 1, unit: "validation-per-output" },
      extraEpisodes: 0,
    },
    inspection: {
      obligations: ["Every finding carries reproduction and evidence refs"],
    },
  },
  fanOutLens: {
    ...supportDefaults,
    supportFacetId: "entropy-reducer.fan-out-lens",
    name: "Fan-Out Lens",
    supportedTags: ["delegate"],
    semanticsAdded: [
      "delegate at most four read-only lenses with fixed briefs and word budgets",
    ],
    authorityChanges: ["consume only delegate.readonly"],
    emissions: [
      {
        kind: "evidence-schema",
        emissionId: "fan-out.lens-brief-schema",
        schemaId: "dotln.entropy-reducer.lens-brief.v1",
        schema: lensBriefSchema,
      },
      {
        kind: "work-order",
        emissionId: "fan-out.constraint",
        field: "constraints",
        values: [
          "Delegate at most four read-only lenses; every brief declares files, questions, output shape, word budget, and no-fix",
        ],
        order: 20,
      },
      {
        kind: "prompt-fragment",
        emissionId: "fan-out.residue",
        text: "Use bounded side routines for census breadth; keep synthesis in the main reviewer.",
      },
    ],
    cost: {
      mechanismType: "work-order",
      promptTokens: 38,
      runtimeCost: { quantity: 4, unit: "delegates-maximum" },
      extraEpisodes: 0,
    },
    inspection: {
      restrictions: ["At most four no-fix, read-only lens delegates"],
    },
  },
  mutationDrill: {
    ...supportDefaults,
    supportFacetId: "entropy-reducer.mutation-drill",
    name: "Mutation Drill",
    supportedTags: ["verify"],
    semanticsAdded: [
      "challenge evidence with bounded perturbations in a scratch copy",
    ],
    authorityChanges: [
      "permit probe.run:scratch* only outside the tracked tree",
    ],
    emissions: [
      {
        kind: "verifier-episode",
        emissionId: "mutation-drill.refutation",
        episodeId: "entropy-reducer-contra-auguste",
        subject: "review-findings",
        required: true,
      },
      {
        kind: "prompt-fragment",
        emissionId: "mutation-drill.residue",
        text: "Attempt to falsify findings from their reproduction commands in an isolated scratch copy.",
      },
    ],
    cost: {
      mechanismType: "verifier-episode",
      promptTokens: 28,
      runtimeCost: { quantity: 32, unit: "scratch-probes-maximum" },
      extraEpisodes: 1,
    },
    inspection: {
      obligations: ["Refute independently before promoting findings"],
    },
  },
  shapeFirst: {
    ...supportDefaults,
    supportFacetId: "entropy-reducer.shape-first",
    name: "Shape-First",
    supportedTags: ["research", "plan"],
    semanticsAdded: [
      "state literal weaknesses and fixes before carrying an analogy down the mechanism ladder",
    ],
    emissions: [
      {
        kind: "prompt-fragment",
        emissionId: "shape-first.residue",
        text: "For an operator analogy, state the literal weakness and literal fix first; only then preserve the useful relation across lower mechanisms.",
      },
    ],
    cost: {
      mechanismType: "prompt-fragment",
      promptTokens: 34,
      runtimeCost: { quantity: 0, unit: "effects" },
      extraEpisodes: 0,
    },
    inspection: {
      obligations: ["Separate literal defects from the analogy's useful shape"],
    },
  },
  constraintFirst: {
    ...supportDefaults,
    supportFacetId: "entropy-reducer.constraint-first-ordering",
    name: "Constraint-First Ordering",
    supportedTags: ["plan"],
    semanticsAdded: [
      "order proposals by the currently evidenced constraint before local polish",
    ],
    emissions: [
      {
        kind: "prompt-fragment",
        emissionId: "constraint-first.residue",
        text: "Identify the evidenced system constraint before ordering recommendations; do not mistake priority for authority.",
      },
    ],
    cost: {
      mechanismType: "prompt-fragment",
      promptTokens: 27,
      runtimeCost: { quantity: 0, unit: "effects" },
      extraEpisodes: 0,
    },
    inspection: {
      passive: ["Constraint-first proposal ordering"],
    },
  },
  altitudeTag: {
    ...supportDefaults,
    supportFacetId: "entropy-reducer.altitude-tag",
    name: "Altitude Tag",
    supportedTags: ["observe", "plan"],
    semanticsAdded: [
      "tag every finding and proposal with its mechanism altitude",
    ],
    emissions: [
      {
        kind: "work-order",
        emissionId: "altitude.acceptance",
        field: "acceptanceCriteria",
        values: [
          "Tag every finding with a Meadows mechanism altitude from 12 through 2",
        ],
        order: 30,
      },
      {
        kind: "prompt-fragment",
        emissionId: "altitude.residue",
        text: "Name the intervention altitude and prefer the highest supported mechanism over repeated parameter patching.",
      },
    ],
    cost: {
      mechanismType: "work-order",
      promptTokens: 24,
      runtimeCost: { quantity: 0, unit: "effects" },
      extraEpisodes: 0,
    },
    inspection: {
      obligations: ["Tag the likely surface and intervention altitude"],
    },
  },
  sparseReceipt: {
    ...supportDefaults,
    supportFacetId: "entropy-reducer.sparse-receipt",
    name: "Sparse Receipt",
    supportedTags: ["narrate"],
    semanticsAdded: [
      "return a terse result envelope while retaining findings and suggestions by reference",
    ],
    authorityChanges: ["validate typed output before report.emit"],
    emissions: [
      {
        kind: "evidence-schema",
        emissionId: "sparse-receipt.output-schema",
        schemaId: "dotln.entropy-reducer.output.v1",
        schema: reviewerOutputContract,
        outputContract: reviewerOutputContract,
      },
      {
        kind: "prompt-fragment",
        emissionId: "sparse-receipt.residue",
        text: "Return findings and suggestion packets as typed payloads, then summarize the episode in fewer than 200 words.",
      },
    ],
    cost: {
      mechanismType: "evidence-schema",
      promptTokens: 31,
      runtimeCost: { quantity: 1, unit: "validation-per-report" },
      extraEpisodes: 0,
    },
    inspection: {
      restrictions: ["The result-envelope summary stays under 200 words"],
    },
  },
} as const satisfies Readonly<Record<string, SupportFacet>>;

const linkedSupports = Object.values(entropyReducerSupports);
const linkedSupportIds = linkedSupports.map(
  (support) => support.supportFacetId,
);
const linkIds = linkedSupports.map(
  (_, index) => `entropy-reducer.link.${String(index + 1).padStart(2, "0")}`,
);

export const entropyReducerIdentity = {
  identityId: ENTROPY_REDUCER_ACTOR_ID,
  version: 1,
  name: "Entropy Reducer",
  dispositions: [
    "verify-first",
    "measure-rather-than-assume",
    "candid-and-fair",
    "propose-rather-than-mutate",
    "shape-first-on-operator-analogies",
  ],
  invariants: [
    "the tracked repository and control plane remain read-only during review",
    "every finding carries an independent reproduction",
    "the clean-room floor cannot be weakened",
    "settled decisions are not relitigated",
    "authority never substitutes for correctness",
    "refuted findings leave the promoted set",
    "side routines stay within declared budgets",
  ],
  updateLaws: [
    "identity changes require a new version and comparison evidence",
    "a substitute reviewer model is a different attested actor",
  ],
  lineage: [
    "second founding identity",
    "Shine active linked to Standardize",
    "generated from the WO-023 entropy-reducer definition",
  ],
} as const satisfies LoadoutGraph["identity"];

export const entropyReducerRole = {
  roleId: "planning-reviewer",
  version: 1,
  name: "Planning reviewer",
  obligations: [
    "perform a whole-repository census",
    "assess the mechanism ladder",
    "emit non-authoritative product suggestions",
  ],
  permissions: [...ENTROPY_REDUCER_ALLOWED_EFFECTS],
  objectives: [
    "reduce entropy without exporting cost to quality, authority, or operator attention",
  ],
  policyDeltas: [{ key: "proposalOrdering", value: "constraint-first" }],
} as const satisfies LoadoutGraph["role"];

export function entropyReducerLoadout(episodeEndsAt: number): LoadoutGraph {
  if (!Number.isFinite(episodeEndsAt))
    throw new Error("episodeEndsAt must be a finite number");
  return {
    schemaVersion: 1,
    loadoutId: "entropy-reducer.review.v1",
    identity: entropyReducerIdentity,
    role: entropyReducerRole,
    containers: [
      {
        containerId: "entropy-reducer.helm",
        version: 1,
        name: "Entropy Reducer helm",
        kind: "equipment",
        socketBudget: linkedSupports.length,
        activeMechanicIds: ["seiso-shine"],
        supportFacetIds: linkedSupportIds,
      },
    ],
    activeMechanics: [
      {
        activeMechanicId: "seiso-shine",
        version: 1,
        name: "Seisō (Shine)",
        tags: ["observe", "research", "plan", "verify", "delegate", "narrate"],
        requiredCapabilities: [],
        semantics: [
          "review makes inspection inseparable from cleanup",
          "produce findings and proposals without implementing them",
          "stop at operator disposition",
        ],
        workOrder: {
          workOrderId: ENTROPY_REDUCER_WORK_ORDER_ID,
          objective:
            "Review the whole repository for evidenced entropy, verify findings, and emit bounded non-authoritative product suggestions without mutating the subject.",
          acceptanceCriteria: [
            "Census the declared repository surfaces before prioritizing findings",
            "Distinguish measured evidence from inspection",
            "Return typed findings, proposal packet payloads, and one terse result envelope",
          ],
          knownFacts: [
            "The repository product docs are durable shared memory",
            "The reviewer has no authority to implement or promote its own suggestions",
            "The kernel does not yet evaluate Program.All, so this review is dispatched manually",
            `The compiled reviewer is ${ENTROPY_REDUCER_REVIEWER_MODEL} at ${ENTROPY_REDUCER_REVIEWER_EFFORT} effort; a substitution is a different attested actor`,
          ],
          decisions: [
            "Entropy Reducer uses Shine linked to Standardize",
            "Constraint-first ordering applies",
            "A fresh blinded Contra-Auguste episode refutes selected findings",
          ],
          constraints: [
            "Treat tracked repository, control plane, remote systems, and settings as read-only",
            "Read only paths named by the Git index; never inspect docs/intake/** during a review episode",
            "Use scratch probes and ignored intake capture only inside their authorized roots",
            "Apply the clean-room stop screen before preparing any report emission",
            "Do not relitigate settled decisions",
          ],
          nonGoals: [
            "Implement a finding or suggestion",
            "File or promote a ProductSuggestion",
            "Edit an operator decision",
            "Claim that authority or model output establishes correctness",
          ],
          allowedOperations: [...ENTROPY_REDUCER_ALLOWED_EFFECTS],
          prohibitedOperations: [...ENTROPY_REDUCER_DENIED_EFFECTS],
          requiredEvidence: [],
          outputContract: reviewerOutputContract,
        },
        authorityEnvelope: {
          authorityEnvelopeId: "auth_entropy_reducer",
          allowedEffects: [...ENTROPY_REDUCER_ALLOWED_EFFECTS],
          deniedEffects: [...ENTROPY_REDUCER_DENIED_EFFECTS],
          resourceLimits: { delegates: 4, probes: 32 },
          requiredEvidence: [],
          expiresAt: episodeEndsAt,
          revocationEventTypes: ["OperatorStopRequested"],
          revocationConditions: [],
        },
        inspection: {
          originalTerm: "Seisō",
          translation: "Shine",
          kanji: "清掃",
          rpgTitle: "The Entropy-Reducing Shine",
          grants: [
            "Read repository evidence",
            "Run bounded scratch probes",
            "Delegate up to four read-only lenses",
            "Emit a validated report",
          ],
          restrictions: [
            "Never mutate the tracked repository or control plane",
            "Never change remotes, settings, or operator decisions",
          ],
          obligations: [
            "Reproduce every finding",
            "Apply the clean-room floor",
            "Await operator disposition",
          ],
          passive: ["Measure before assuming"],
          pulse: ["One review on explicit dispatch"],
          interrupt: ["Stop on OperatorStopRequested or episode expiry"],
        },
      },
    ],
    supportFacets: linkedSupports,
    links: linkedSupports.map((support, index) => ({
      linkId: linkIds[index]!,
      linkGroupId: "entropy-reducer.links",
      activeMechanicId: "seiso-shine",
      supportFacetId: support.supportFacetId,
    })),
    linkGroups: [
      {
        linkGroupId: "entropy-reducer.links",
        containerId: "entropy-reducer.helm",
        linkIds,
      },
    ],
    explicitPipelines: [],
    ambientEffects: [],
    resourceModel: {
      resourceModelId: "entropy-reducer.resources",
      version: 1,
      capacities: { delegates: 4, probes: 32 },
      reservations: [],
    },
    polarAxes: [],
  };
}

export interface ReviewerCompileOptions {
  readonly repo: string;
  readonly baseCommit: string;
  readonly episodeId: string;
  readonly dispatchedAt: number;
  readonly episodeEndsAt: number;
  readonly lensBriefs?: readonly LensBrief[];
}

export interface ReviewerRequirement {
  readonly harness: "claude-code";
  readonly model: "claude-fable-5-1";
  readonly displayModel: "Claude Fable 5.1";
  readonly effort: "max";
  readonly substitutionPolicy: "different-reviewer-and-must-be-attested";
}

export const entropyReducerReviewerRequirement = {
  harness: "claude-code",
  model: ENTROPY_REDUCER_REVIEWER_MODEL,
  displayModel: "Claude Fable 5.1",
  effort: ENTROPY_REDUCER_REVIEWER_EFFORT,
  substitutionPolicy: "different-reviewer-and-must-be-attested",
} as const satisfies ReviewerRequirement;

export interface ReviewerExecutionBoundary {
  readonly mode: "operator-mediated-manual";
  readonly deferredProgramKind: "All";
  readonly commandIds: "symbolic-manual-plan";
  readonly resultBinding: "host-validator";
  readonly resourceEnforcement: "authorize-each-operation-and-thread-envelope";
}

export const entropyReducerExecutionBoundary = {
  mode: "operator-mediated-manual",
  deferredProgramKind: "All",
  commandIds: "symbolic-manual-plan",
  resultBinding: "host-validator",
  resourceEnforcement: "authorize-each-operation-and-thread-envelope",
} as const satisfies ReviewerExecutionBoundary;

export interface CompiledReviewerWorkOrder {
  readonly compileInputs: ReviewerCompileOptions;
  readonly compiledProgram: CompiledProgram;
  readonly semanticHash: string;
  readonly workOrder: CompiledProgram["workOrder"];
  readonly authorityEnvelope: CompiledProgram["authorityEnvelope"];
  readonly program: Program.T;
  readonly cadence: Cadence.T;
  readonly masks: readonly EntropyReducerMask[];
  readonly reviewerRequirement: ReviewerRequirement;
  readonly executionBoundary: ReviewerExecutionBoundary;
  readonly lensBriefs: readonly LensBrief[];
  readonly lensBriefSchema: typeof lensBriefSchema;
  readonly residue: string;
}

const eventDraft = (
  type: string,
  occurredAt: number,
  episodeId: string,
  payload: JsonValue,
): EventDraft => ({
  schemaVersion: 1,
  type,
  occurredAt,
  actorId: ENTROPY_REDUCER_ACTOR_ID,
  workstreamId: ENTROPY_REDUCER_WORKSTREAM_ID,
  episodeId,
  payload,
});

const invocation = (
  commandId: string,
  effect: string,
  payload: JsonValue,
  resource?: string,
): Program.Invoke =>
  Program.Invoke(
    commandId,
    {
      kind: "Act",
      effect,
      ...(resource === undefined ? {} : { resource }),
      payload,
    },
    { completed: Program.Done() },
  );

const reviewerProgram = (
  episodeId: string,
  dispatchedAt: number,
  episodeEndsAt: number,
  lensBriefs: readonly LensBrief[],
): Program.T =>
  Program.Sequence([
    invocation("entropy-reducer.census", "repo.read.census", {
      scope: "git-tracked-files",
      mode: "read-only",
      source: "git ls-files -z",
      exclude: ["docs/intake/**"],
    }),
    Program.All(
      lensBriefs.map((brief, index) =>
        invocation(
          `entropy-reducer.lens.${String(index + 1).padStart(2, "0")}`,
          "delegate.readonly",
          brief as unknown as JsonValue,
          "delegates",
        ),
      ),
    ),
    invocation(
      "entropy-reducer.probes",
      "probe.run:scratch.review",
      { scope: "scratch-copy", maximum: 32 },
      "probes",
    ),
    Program.Emit(
      eventDraft("ReviewFindingsReady", dispatchedAt, episodeId, {
        schemaId: "dotln.entropy-reducer.finding.v1",
        source: "validated-review-output",
      }),
      Program.Done(),
    ),
    Program.Emit(
      eventDraft("ProductSuggestionPacketsReady", dispatchedAt, episodeId, {
        schemaId: "dotln.entropy-reducer.output.v1",
        filingAuthority: "operator-required",
      }),
      Program.Done(),
    ),
    Program.Await(
      { type: "OperatorDisposition" },
      Cadence.Once(episodeEndsAt),
      Program.Done(),
    ),
  ]);

function validateLensFileScope(scope: string): void {
  const normalized = scope.replace(/\/+/gu, "/").toLowerCase();
  const segments = normalized.split("/");
  if (
    normalized === "." ||
    normalized === "./" ||
    normalized === "docs" ||
    normalized === "docs/" ||
    scope.startsWith("/") ||
    scope.includes("\\") ||
    segments.includes(".") ||
    segments.includes("..") ||
    normalized === "docs/intake" ||
    normalized.startsWith("docs/intake/")
  )
    throw new OutputValidationError(
      `lens brief.files contains unsafe or intake-bearing scope ${scope}`,
    );
}

export function validateLensBrief(value: unknown): LensBrief {
  const brief = objectValue(value, "lens brief");
  allowedFields(
    brief,
    ["lensId", "files", "questions", "outputShape", "wordBudget", "noFix"],
    "lens brief",
  );
  const lensId = requiredString(brief, "lensId", "lens brief");
  const files = requiredStringArray(brief, "files", "lens brief");
  files.forEach(validateLensFileScope);
  const questions = requiredStringArray(brief, "questions", "lens brief");
  const outputShape = requiredStringArray(brief, "outputShape", "lens brief");
  const wordBudget = brief["wordBudget"];
  if (!Number.isInteger(wordBudget) || (wordBudget as number) <= 0)
    throw new OutputValidationError(
      "lens brief.wordBudget must be a positive integer",
    );
  if (brief["noFix"] !== true)
    throw new OutputValidationError("lens brief.noFix must be true");
  return {
    lensId,
    files,
    questions,
    outputShape,
    wordBudget: wordBudget as number,
    noFix: true,
  };
}

export function validateLensBriefs(
  values: readonly unknown[],
  maximum = 4,
): readonly LensBrief[] {
  if (values.length > maximum)
    throw new OutputValidationError(
      `lens brief count ${values.length} exceeds compiled delegate limit ${maximum}`,
    );
  const briefs = values.map(validateLensBrief);
  if (new Set(briefs.map((brief) => brief.lensId)).size !== briefs.length)
    throw new OutputValidationError("lens brief ids must be unique");
  return briefs;
}

export function compileReviewerWorkOrder(
  options: ReviewerCompileOptions,
): CompiledReviewerWorkOrder {
  if (!Number.isFinite(options.dispatchedAt))
    throw new Error("dispatchedAt must be a finite number");
  if (
    !Number.isFinite(options.episodeEndsAt) ||
    options.episodeEndsAt <= options.dispatchedAt
  )
    throw new Error("episodeEndsAt must be finite and later than dispatchedAt");
  const source = entropyReducerLoadout(options.episodeEndsAt);
  const environment: CompilationEnvironment = {
    environmentId: "entropy-reducer.manual-review",
    version: 1,
    capabilities: [],
    repo: options.repo,
    baseCommit: options.baseCommit,
  };
  const result = compileLoadout(source, environment);
  if (!result.ok)
    throw new Error(
      result.diagnostics.map((entry) => entry.message).join("\n"),
    );
  const maximumDelegates =
    result.program.authorityEnvelope.resourceLimits["delegates"];
  if (maximumDelegates === undefined)
    throw new Error("compiled authority lacks the delegates resource");
  const briefs = validateLensBriefs(
    options.lensBriefs ?? entropyReducerLensBriefs,
    maximumDelegates,
  );
  return {
    compileInputs: {
      repo: options.repo,
      baseCommit: options.baseCommit,
      episodeId: options.episodeId,
      dispatchedAt: options.dispatchedAt,
      episodeEndsAt: options.episodeEndsAt,
      ...(options.lensBriefs === undefined
        ? {}
        : { lensBriefs: options.lensBriefs }),
    },
    compiledProgram: result.program,
    semanticHash: result.semanticHash,
    workOrder: result.program.workOrder,
    authorityEnvelope: result.program.authorityEnvelope,
    program: reviewerProgram(
      options.episodeId,
      options.dispatchedAt,
      options.episodeEndsAt,
      briefs,
    ),
    cadence: Cadence.Once(options.dispatchedAt),
    masks: entropyReducerMasks,
    reviewerRequirement: entropyReducerReviewerRequirement,
    executionBoundary: entropyReducerExecutionBoundary,
    lensBriefs: briefs,
    lensBriefSchema,
    residue: renderEntropyReducerResidue(source),
  };
}

export class OutputValidationError extends Error {
  override readonly name = "OutputValidationError";
}

const objectValue = (
  value: unknown,
  label: string,
): Readonly<Record<string, unknown>> => {
  if (value === null || Array.isArray(value) || typeof value !== "object")
    throw new OutputValidationError(`${label} must be an object`);
  return value as Readonly<Record<string, unknown>>;
};

const requiredString = (
  value: Readonly<Record<string, unknown>>,
  field: string,
  label: string,
): string => {
  const candidate = value[field];
  if (typeof candidate !== "string" || candidate.trim().length === 0)
    throw new OutputValidationError(
      `${label}.${field} must be a non-empty string`,
    );
  return candidate;
};

const requiredStringArray = (
  value: Readonly<Record<string, unknown>>,
  field: string,
  label: string,
  allowEmpty = false,
): readonly string[] => {
  const candidate = value[field];
  if (
    !Array.isArray(candidate) ||
    (!allowEmpty && candidate.length === 0) ||
    !candidate.every(
      (entry) => typeof entry === "string" && entry.trim().length > 0,
    )
  )
    throw new OutputValidationError(
      `${label}.${field} must be ${allowEmpty ? "an" : "a non-empty"} array of non-empty strings`,
    );
  return candidate as readonly string[];
};

const allowedFields = (
  value: Readonly<Record<string, unknown>>,
  fields: readonly string[],
  label: string,
): void => {
  const extra = Object.keys(value).filter((field) => !fields.includes(field));
  if (extra.length > 0)
    throw new OutputValidationError(
      `${label} has unexpected fields: ${extra.sort().join(", ")}`,
    );
};

const validateFinding = (value: unknown): VerificationFinding => {
  const finding = objectValue(value, "finding");
  allowedFields(
    finding,
    [
      "findingId",
      "criterion",
      "severity",
      "evidenceLabel",
      "observed",
      "expected",
      "reproduction",
      "evidenceRefs",
      "surface",
      "altitude",
      "standardization",
    ],
    "finding",
  );
  const severity = finding["severity"];
  if (severity !== "blocking" && severity !== "major" && severity !== "minor")
    throw new OutputValidationError(
      "finding.severity must be blocking, major, or minor",
    );
  const evidenceLabel = finding["evidenceLabel"];
  if (evidenceLabel !== "measured" && evidenceLabel !== "by inspection")
    throw new OutputValidationError(
      "finding.evidenceLabel must be measured or by inspection",
    );
  const altitude = finding["altitude"];
  if (
    !Number.isInteger(altitude) ||
    (altitude as number) < 2 ||
    (altitude as number) > 12
  )
    throw new OutputValidationError(
      "finding.altitude must be an integer from 2 through 12",
    );
  const reproduction = objectValue(
    finding["reproduction"],
    "finding.reproduction",
  );
  let validatedReproduction: FindingReproduction;
  if (evidenceLabel === "measured") {
    if (reproduction["kind"] !== "command")
      throw new OutputValidationError(
        "a measured finding requires command reproduction",
      );
    allowedFields(reproduction, ["kind", "command"], "finding.reproduction");
    validatedReproduction = {
      kind: "command",
      command: requiredString(reproduction, "command", "finding.reproduction"),
    };
  } else {
    if (reproduction["kind"] !== "inspection")
      throw new OutputValidationError(
        "a by-inspection finding requires inspection reproduction steps",
      );
    allowedFields(reproduction, ["kind", "steps"], "finding.reproduction");
    validatedReproduction = {
      kind: "inspection",
      steps: requiredStringArray(
        reproduction,
        "steps",
        "finding.reproduction",
      ) as NonEmptyStrings,
    };
  }
  const standardization = objectValue(
    finding["standardization"],
    "finding.standardization",
  );
  let validatedStandardization: VerificationFinding["standardization"];
  if (standardization["kind"] === "one-off") {
    allowedFields(standardization, ["kind"], "finding.standardization");
    validatedStandardization = { kind: "one-off" };
  } else if (standardization["kind"] === "recurring") {
    allowedFields(
      standardization,
      ["kind", "rung", "rationale"],
      "finding.standardization",
    );
    const rung = standardization["rung"];
    if (
      rung !== "test" &&
      rung !== "lint" &&
      rung !== "guard" &&
      rung !== "script"
    )
      throw new OutputValidationError(
        "a recurring finding requires a test, lint, guard, or script rung",
      );
    validatedStandardization = {
      kind: "recurring",
      rung,
      rationale: requiredString(
        standardization,
        "rationale",
        "finding.standardization",
      ),
    };
  } else {
    throw new OutputValidationError(
      "finding.standardization.kind must be one-off or recurring",
    );
  }
  const base: VerificationFindingBase = {
    findingId: requiredString(finding, "findingId", "finding"),
    criterion: requiredString(finding, "criterion", "finding"),
    severity,
    observed: requiredString(finding, "observed", "finding"),
    expected: requiredString(finding, "expected", "finding"),
    evidenceRefs: requiredStringArray(
      finding,
      "evidenceRefs",
      "finding",
    ) as NonEmptyStrings,
    surface: requiredString(finding, "surface", "finding"),
    altitude: altitude as number,
    standardization: validatedStandardization,
  };
  return evidenceLabel === "measured"
    ? {
        ...base,
        evidenceLabel,
        reproduction: validatedReproduction as Extract<
          FindingReproduction,
          { readonly kind: "command" }
        >,
      }
    : {
        ...base,
        evidenceLabel,
        reproduction: validatedReproduction as Extract<
          FindingReproduction,
          { readonly kind: "inspection" }
        >,
      };
};

const validateSuggestion = (value: unknown): ProductSuggestion => {
  const suggestion = objectValue(value, "suggestion");
  const fields = [
    "suggestionId",
    "submittedBy",
    "problemOrOpportunity",
    "scope",
    "evidenceRefs",
    "affectedUsers",
    "affectedSystems",
    "expectedValue",
    "altitude",
    "uncertainty",
    "risks",
    "alternatives",
    "duplicationHints",
    "urgencyRationale",
  ] as const;
  allowedFields(suggestion, fields, "suggestion");
  const altitude = suggestion["altitude"];
  if (
    !Number.isInteger(altitude) ||
    (altitude as number) < 2 ||
    (altitude as number) > 12
  )
    throw new OutputValidationError(
      "suggestion.altitude must be an integer from 2 through 12",
    );
  const suggestionId = requiredString(suggestion, "suggestionId", "suggestion");
  if (!safeSuggestionId.test(suggestionId))
    throw new OutputValidationError(
      "suggestion.suggestionId must be a safe single path segment",
    );
  return {
    suggestionId,
    submittedBy: requiredString(suggestion, "submittedBy", "suggestion"),
    problemOrOpportunity: requiredString(
      suggestion,
      "problemOrOpportunity",
      "suggestion",
    ),
    scope: requiredString(suggestion, "scope", "suggestion"),
    evidenceRefs: requiredStringArray(suggestion, "evidenceRefs", "suggestion"),
    affectedUsers: requiredStringArray(
      suggestion,
      "affectedUsers",
      "suggestion",
    ),
    affectedSystems: requiredStringArray(
      suggestion,
      "affectedSystems",
      "suggestion",
    ),
    expectedValue: requiredString(suggestion, "expectedValue", "suggestion"),
    altitude: altitude as number,
    uncertainty: requiredString(suggestion, "uncertainty", "suggestion"),
    risks: requiredStringArray(suggestion, "risks", "suggestion", true),
    alternatives: requiredStringArray(
      suggestion,
      "alternatives",
      "suggestion",
      true,
    ),
    duplicationHints: requiredStringArray(
      suggestion,
      "duplicationHints",
      "suggestion",
      true,
    ),
    urgencyRationale: requiredString(
      suggestion,
      "urgencyRationale",
      "suggestion",
    ),
  };
};

const validatePacket = (value: unknown): ProductSuggestionPacket => {
  const packet = objectValue(value, "proposal packet");
  allowedFields(
    packet,
    [
      "schemaVersion",
      "kind",
      "proposedPath",
      "sourceEpisodeId",
      "provenance",
      "corroboratingEvidenceRefs",
      "dissentingEvidenceRefs",
      "suggestion",
    ],
    "proposal packet",
  );
  if (packet["schemaVersion"] !== 1)
    throw new OutputValidationError("proposal packet.schemaVersion must be 1");
  if (packet["kind"] !== "ProductSuggestionPacket")
    throw new OutputValidationError(
      "proposal packet.kind must be ProductSuggestionPacket",
    );
  const suggestion = validateSuggestion(packet["suggestion"]);
  const proposedPath = requiredString(
    packet,
    "proposedPath",
    "proposal packet",
  );
  if (proposedPath !== `docs/proposals/${suggestion.suggestionId}/`)
    throw new OutputValidationError(
      "proposal packet.proposedPath must be docs/proposals/<suggestionId>/",
    );
  const sourceEpisodeId = requiredString(
    packet,
    "sourceEpisodeId",
    "proposal packet",
  );
  const provenance = requiredStringArray(
    packet,
    "provenance",
    "proposal packet",
  ) as NonEmptyStrings;
  const corroboratingEvidenceRefs = requiredStringArray(
    packet,
    "corroboratingEvidenceRefs",
    "proposal packet",
    true,
  );
  const dissentingEvidenceRefs = requiredStringArray(
    packet,
    "dissentingEvidenceRefs",
    "proposal packet",
    true,
  );
  return {
    schemaVersion: 1,
    kind: "ProductSuggestionPacket",
    proposedPath,
    sourceEpisodeId,
    provenance,
    corroboratingEvidenceRefs,
    dissentingEvidenceRefs,
    suggestion,
  };
};

export const countWords = (value: string): number => {
  const normalized = value.trim();
  return normalized.length === 0 ? 0 : normalized.split(/\s+/u).length;
};

export interface ReviewerOutputExpectation {
  readonly workOrderId: string;
  readonly episodeId: string;
}

const validateResultEnvelope = (
  value: unknown,
  expected: ReviewerOutputExpectation,
): ResultEnvelope => {
  const envelope = objectValue(value, "result envelope");
  allowedFields(
    envelope,
    [
      "workOrderId",
      "episodeId",
      "status",
      "resultId",
      "summary",
      "requiresHuman",
    ],
    "result envelope",
  );
  const status = envelope["status"];
  if (status !== "completed" && status !== "failed" && status !== "blocked")
    throw new OutputValidationError(
      "result envelope.status must be completed, failed, or blocked",
    );
  const summary = requiredString(envelope, "summary", "result envelope");
  if (countWords(summary) >= 200)
    throw new OutputValidationError(
      "result envelope.summary must contain fewer than 200 words",
    );
  if (typeof envelope["requiresHuman"] !== "boolean")
    throw new OutputValidationError(
      "result envelope.requiresHuman must be boolean",
    );
  const workOrderId = requiredString(
    envelope,
    "workOrderId",
    "result envelope",
  );
  const episodeId = requiredString(envelope, "episodeId", "result envelope");
  if (workOrderId !== expected.workOrderId)
    throw new OutputValidationError(
      `result envelope.workOrderId must be ${expected.workOrderId}`,
    );
  if (episodeId !== expected.episodeId)
    throw new OutputValidationError(
      `result envelope.episodeId must be ${expected.episodeId}`,
    );
  return {
    workOrderId,
    episodeId,
    status,
    resultId: requiredString(envelope, "resultId", "result envelope"),
    summary,
    requiresHuman: envelope["requiresHuman"] as boolean,
  };
};

export function validateReviewerOutput(
  value: unknown,
  expected: ReviewerOutputExpectation,
): ReviewerOutput {
  const output = objectValue(value, "reviewer output");
  allowedFields(
    output,
    [
      "schemaVersion",
      "findings",
      "proposalPackets",
      "resultEnvelope",
      "cleanRoom",
    ],
    "reviewer output",
  );
  if (output["schemaVersion"] !== 1)
    throw new OutputValidationError("reviewer output.schemaVersion must be 1");
  if (!Array.isArray(output["findings"]))
    throw new OutputValidationError(
      "reviewer output.findings must be an array",
    );
  const findings = output["findings"].map(validateFinding);
  if (
    new Set(findings.map((finding) => finding.findingId)).size !==
    findings.length
  )
    throw new OutputValidationError("finding ids must be unique");
  if (!Array.isArray(output["proposalPackets"]))
    throw new OutputValidationError(
      "reviewer output.proposalPackets must be an array",
    );
  const proposalPackets = output["proposalPackets"].map(validatePacket);
  if (
    new Set(proposalPackets.map((packet) => packet.suggestion.suggestionId))
      .size !== proposalPackets.length
  )
    throw new OutputValidationError("suggestion ids must be unique");
  for (const packet of proposalPackets)
    if (packet.sourceEpisodeId !== expected.episodeId)
      throw new OutputValidationError(
        `proposal packet.sourceEpisodeId must be ${expected.episodeId}`,
      );
  const resultEnvelope = validateResultEnvelope(
    output["resultEnvelope"],
    expected,
  );
  const cleanRoom = objectValue(output["cleanRoom"], "clean-room result");
  allowedFields(
    cleanRoom,
    ["status", "stopConditionsFound", "evidenceRefs"],
    "clean-room result",
  );
  if (
    cleanRoom["status"] !== "passed" ||
    cleanRoom["stopConditionsFound"] !== false
  )
    throw new OutputValidationError(
      "clean-room result must pass with no stop conditions before report.emit",
    );
  const validatedCleanRoom: CleanRoomResult = {
    status: "passed",
    stopConditionsFound: false,
    evidenceRefs: requiredStringArray(
      cleanRoom,
      "evidenceRefs",
      "clean-room result",
    ),
  };
  return {
    schemaVersion: 1,
    findings,
    proposalPackets,
    resultEnvelope,
    cleanRoom: validatedCleanRoom,
  };
}

export interface PreparedReviewerEmission {
  readonly output: ReviewerOutput;
  readonly intent: ActIntent;
}

export function prepareReportEmit(
  value: unknown,
  expected: ReviewerOutputExpectation,
): PreparedReviewerEmission {
  const output = validateReviewerOutput(value, expected);
  return {
    output,
    intent: {
      kind: "Act",
      effect: "report.emit",
      payload: output as unknown as JsonValue,
    },
  };
}

export interface RefutationSelection {
  readonly measuredDenominator: number;
  readonly measuredStatus: "selected" | "not-applicable";
  readonly inspectionDenominator: number;
  readonly inspectionStatus: "all" | "sampled" | "not-applicable";
  readonly inspectionSampleSize: number;
  readonly selectionRule: string;
  readonly measuredSubjects: readonly Readonly<{
    findingId: string;
    command: string;
  }>[];
  readonly inspectionSubjects: readonly Readonly<{
    findingId: string;
    steps: NonEmptyStrings;
  }>[];
  readonly selectedFindingIds: readonly string[];
}

const severityRank: Readonly<Record<FindingSeverity, number>> = {
  blocking: 0,
  major: 1,
  minor: 2,
};

const compareCodeUnits = (left: string, right: string): number =>
  left < right ? -1 : left > right ? 1 : 0;

const compareFinding = (
  left: VerificationFinding,
  right: VerificationFinding,
): number =>
  compareCodeUnits(left.surface, right.surface) ||
  severityRank[left.severity] - severityRank[right.severity] ||
  compareCodeUnits(left.findingId, right.findingId);

const stratifiedInspectionSample = (
  findings: readonly VerificationFinding[],
  target: number,
): readonly VerificationFinding[] => {
  const groups = new Map<string, VerificationFinding[]>();
  for (const finding of [...findings].sort(compareFinding)) {
    const key = `${finding.surface}\u0000${finding.severity}`;
    const group = groups.get(key) ?? [];
    group.push(finding);
    groups.set(key, group);
  }
  const orderedGroups = [...groups.entries()]
    .sort(([left], [right]) => compareCodeUnits(left, right))
    .map(([, group]) => group);
  const selected: VerificationFinding[] = [];
  for (let offset = 0; selected.length < target; offset += 1) {
    let advanced = false;
    for (const group of orderedGroups) {
      const candidate = group[offset];
      if (candidate === undefined) continue;
      selected.push(candidate);
      advanced = true;
      if (selected.length === target) break;
    }
    if (!advanced) break;
  }
  return selected;
};

export function selectFindingsForRefutation(
  findings: readonly VerificationFinding[],
): RefutationSelection {
  const measured = findings
    .filter(
      (
        finding,
      ): finding is Extract<
        VerificationFinding,
        { readonly evidenceLabel: "measured" }
      > => finding.evidenceLabel === "measured",
    )
    .sort(compareFinding);
  const inspected = findings
    .filter(
      (
        finding,
      ): finding is Extract<
        VerificationFinding,
        { readonly evidenceLabel: "by inspection" }
      > => finding.evidenceLabel === "by inspection",
    )
    .sort(compareFinding);
  const inspectionTarget =
    inspected.length <= 6
      ? inspected.length
      : Math.max(6, Math.ceil(inspected.length / 3));
  const inspectionSelected =
    inspected.length <= 6
      ? inspected
      : stratifiedInspectionSample(inspected, inspectionTarget);
  return {
    measuredDenominator: measured.length,
    measuredStatus: measured.length === 0 ? "not-applicable" : "selected",
    inspectionDenominator: inspected.length,
    inspectionStatus:
      inspected.length === 0
        ? "not-applicable"
        : inspected.length <= 6
          ? "all"
          : "sampled",
    inspectionSampleSize: inspectionSelected.length,
    selectionRule:
      inspected.length <= 6
        ? "every measured finding and every by-inspection finding"
        : "every measured finding plus a deterministic surface-and-severity round-robin sample of max(6, ceil(by-inspection/3))",
    measuredSubjects: measured.map((finding) => ({
      findingId: finding.findingId,
      command: finding.reproduction.command,
    })),
    inspectionSubjects: inspectionSelected.map((finding) => {
      if (finding.reproduction.kind !== "inspection")
        throw new Error(
          `inspection selection contains measured finding ${finding.findingId}`,
        );
      return {
        findingId: finding.findingId,
        steps: finding.reproduction.steps,
      };
    }),
    selectedFindingIds: [...measured, ...inspectionSelected].map(
      (finding) => finding.findingId,
    ),
  };
}

export interface RefutationAttempt {
  readonly findingId: string;
  readonly result: "survived" | "refuted" | "blocked";
  readonly reason: string;
  readonly evidenceRefs: readonly string[];
}

export interface RefutationRow extends RefutationAttempt {
  readonly evidenceLabel: FindingEvidenceLabel;
  readonly severity: FindingSeverity;
  readonly surface: string;
  readonly reproduction: FindingReproduction;
}

export interface RefutationReport {
  readonly schemaVersion: 1;
  readonly selection: RefutationSelection;
  readonly attempts: readonly RefutationRow[];
  readonly promotedFindingIds: readonly string[];
  readonly refutedFindingIds: readonly string[];
  readonly blockedFindingIds: readonly string[];
  readonly unselectedFindingIds: readonly string[];
}

const validateRefutationAttempt = (value: unknown): RefutationAttempt => {
  const attempt = objectValue(value, "refutation attempt");
  allowedFields(
    attempt,
    ["findingId", "result", "reason", "evidenceRefs"],
    "refutation attempt",
  );
  const result = attempt["result"];
  if (result !== "survived" && result !== "refuted" && result !== "blocked")
    throw new OutputValidationError(
      "refutation attempt.result must be survived, refuted, or blocked",
    );
  return {
    findingId: requiredString(attempt, "findingId", "refutation attempt"),
    result,
    reason: requiredString(attempt, "reason", "refutation attempt"),
    evidenceRefs: requiredStringArray(
      attempt,
      "evidenceRefs",
      "refutation attempt",
    ),
  };
};

export function buildRefutationReport(
  findings: readonly VerificationFinding[],
  attempts: readonly unknown[],
): RefutationReport {
  const selection = selectFindingsForRefutation(findings);
  const findingById = new Map(
    findings.map((finding) => [finding.findingId, finding]),
  );
  const attemptById = new Map<string, RefutationAttempt>();
  for (const candidate of attempts) {
    const attempt = validateRefutationAttempt(candidate);
    if (attemptById.has(attempt.findingId))
      throw new OutputValidationError(
        `duplicate refutation attempt for ${attempt.findingId}`,
      );
    if (!selection.selectedFindingIds.includes(attempt.findingId))
      throw new OutputValidationError(
        `refutation attempt ${attempt.findingId} was not selected`,
      );
    attemptById.set(attempt.findingId, attempt);
  }
  const missing = selection.selectedFindingIds.filter(
    (findingId) => !attemptById.has(findingId),
  );
  if (missing.length > 0)
    throw new OutputValidationError(
      `missing refutation attempts: ${missing.join(", ")}`,
    );
  const rows = selection.selectedFindingIds.map((findingId): RefutationRow => {
    const finding = findingById.get(findingId);
    const attempt = attemptById.get(findingId);
    if (finding === undefined || attempt === undefined)
      throw new Error(`refutation selection references unknown ${findingId}`);
    return {
      ...attempt,
      evidenceLabel: finding.evidenceLabel,
      severity: finding.severity,
      surface: finding.surface,
      reproduction: finding.reproduction,
    };
  });
  const refutedFindingIds = rows
    .filter((row) => row.result === "refuted")
    .map((row) => row.findingId);
  const blockedFindingIds = rows
    .filter((row) => row.result === "blocked")
    .map((row) => row.findingId);
  const survived = new Set(
    rows.filter((row) => row.result === "survived").map((row) => row.findingId),
  );
  const selected = new Set(selection.selectedFindingIds);
  return {
    schemaVersion: 1,
    selection,
    attempts: rows,
    promotedFindingIds: findings
      .filter((finding) => survived.has(finding.findingId))
      .sort(compareFinding)
      .map((finding) => finding.findingId),
    refutedFindingIds,
    blockedFindingIds,
    unselectedFindingIds: findings
      .filter((finding) => !selected.has(finding.findingId))
      .sort(compareFinding)
      .map((finding) => finding.findingId),
  };
}

const list = (values: readonly string[]): string =>
  values.length === 0 ? "none" : values.join("; ");

const inspectionList = (support: SupportFacet): readonly string[] => [
  ...(support.inspection.grants ?? []).map((value) => `grant ${value}`),
  ...(support.inspection.restrictions ?? []).map(
    (value) => `restrict ${value}`,
  ),
  ...(support.inspection.obligations ?? []).map((value) => `oblige ${value}`),
  ...(support.inspection.passive ?? []).map((value) => `passive ${value}`),
  ...(support.inspection.pulse ?? []).map((value) => `pulse ${value}`),
  ...(support.inspection.interrupt ?? []).map((value) => `interrupt ${value}`),
];

const supportParagraph = (support: SupportFacet): string => {
  const modified = support.semanticsModified.map(
    (entry) => `${entry.from} -> ${entry.to}`,
  );
  const emissions = support.emissions.map((emission) => {
    const digest = `fnv1a64:${stableHash(
      canonicalStringify(emission as unknown as CompilerJsonValue),
    )}`;
    return emission.kind === "prompt-fragment"
      ? `${emission.kind}:${emission.emissionId}@${digest} (${emission.text})`
      : `${emission.kind}:${emission.emissionId}@${digest}`;
  });
  const claims = support.claims.map(
    (claim) =>
      `${claim.target}=${canonicalStringify(claim.value)} at ${claim.layer}${claim.hard ? " hard" : ""}`,
  );
  return `**${support.name} (\`${support.supportFacetId}@${support.version}\`).** Supports ${list(support.supportedTags)}; requires capabilities ${list(support.requiredCapabilities)}; conflicts with ${list(support.conflictsWith)}. Adds ${list(support.semanticsAdded)}; modifies ${list(modified)}. Authority: ${list(support.authorityChanges)}. Evidence: ${list(support.evidenceRequirements)}. Emissions: ${list(emissions)}. Claims: ${list(claims)}. Cost: mechanism ${support.cost.mechanismType}, ${support.cost.promptTokens} prompt tokens, ${support.cost.runtimeCost.quantity} ${support.cost.runtimeCost.unit}, ${support.cost.extraEpisodes} extra episodes, resource multiplier ${support.resourceMultiplier}. Determinism: ${support.preservesDeterminism ? "preserved" : "not preserved"}; composition: ${support.commutativity}. Inspection: ${list(inspectionList(support))}.`;
};

export function renderEntropyReducerResidue(source: LoadoutGraph): string {
  const graph = normalizeLoadoutGraph(source);
  const active = graph.activeMechanics[0];
  if (active === undefined)
    throw new Error("residue requires exactly one active mechanic");
  const supportById = new Map(
    graph.supportFacets.map((support) => [support.supportFacetId, support]),
  );
  const supports = graph.links.map((link) => {
    const support = supportById.get(link.supportFacetId);
    if (support === undefined)
      throw new Error(`linked support ${link.supportFacetId} is missing`);
    return support;
  });
  if (
    new Set(supports.map((support) => support.supportFacetId)).size !==
    supports.length
  )
    throw new Error("residue requires each linked support exactly once");
  const maskLines = entropyReducerMasks.map(
    (mask) =>
      `- **${mask.mask}:** ${mask.assignment}. Guard against ${mask.guardedFailureMode}: ${mask.guard}`,
  );
  const supportLines = supports.flatMap((support) => [
    `<!-- support:${support.supportFacetId} -->`,
    "",
    supportParagraph(support),
    "",
  ]);
  return [
    "# Entropy Reducer — generated review residue",
    "",
    "> Generated from `entropyReducerLoadout`; do not hand-edit this projection.",
    "",
    `Identity: **${graph.identity.name} (\`${graph.identity.identityId}@${graph.identity.version}\`)**. Role: **${graph.role.name} (\`${graph.role.roleId}@${graph.role.version}\`)**. Active: **${active.name}**.`,
    "",
    `Identity dispositions: ${list(graph.identity.dispositions)}. Identity invariants: ${list(graph.identity.invariants)}.`,
    "",
    `Role obligations: ${list(graph.role.obligations)}. Active semantics: ${list(active.semantics)}. Active work-order constraints: ${list(active.workOrder.constraints)}.`,
    "",
    "Read in order: the execution guide, the active work order, only its cited blueprint surfaces, then the implementation and executable evidence. Treat settled decisions as constraints. For an operator analogy, state literal weaknesses and fixes before transferring its useful shape. Identify the evidenced constraint before ordering recommendations.",
    "",
    "The clean-room floor is mandatory. Stop instead of incorporating employer material, credentials, private identifiers, internal service details, or any other inadmissible source. Census and delegate reads are limited to paths named by `git ls-files`; never inspect `docs/intake/**` during this review. The tracked repository, control plane, remotes, settings, and operator decisions stay read-only. The dispatch host must separately confine scratch probes and ignored intake capture to authorized roots; the compiled envelope names effect families and resource budgets, not filesystem roots.",
    "",
    "Execution boundary: this typed Program is an operator-mediated manual plan while the kernel's `All` kind remains deferred. Its invocation ids are symbolic, result data is bound by the host validator, and each delegated or probe operation must be authorized separately while threading the returned resource envelope; a numeric maximum inside an intent payload is not kernel enforcement.",
    "",
    "## Masks and failure guards",
    "",
    ...maskLines,
    "",
    "## Linked supports",
    "",
    ...supportLines,
    "## Output and stop condition",
    "",
    "Return schema-v1 findings, ProductSuggestion packet payloads proposed for `docs/proposals/<suggestionId>/`, the clean-room result, and a ResultEnvelope whose summary contains fewer than 200 words. Validate all output before preparing `report.emit`. Findings never authorize fixes; proposal filing and promotion require a separate operator act. Await `OperatorDisposition` after emitting the validated payloads.",
    "",
  ].join("\n");
}

export const referenceEntropyReducerResidue = (): string =>
  renderEntropyReducerResidue(
    entropyReducerLoadout(ENTROPY_REDUCER_REFERENCE_EPISODE_ENDS_AT),
  );
