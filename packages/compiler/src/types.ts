export type JsonPrimitive = string | number | boolean | null;
export type JsonValue =
  JsonPrimitive | { readonly [key: string]: JsonValue } | readonly JsonValue[];

export const BEHAVIOR_TAGS = [
  "observe",
  "research",
  "plan",
  "mutate",
  "communicate",
  "verify",
  "schedule",
  "delegate",
  "narrate",
  "destructive",
] as const;
export type BehaviorTag = (typeof BEHAVIOR_TAGS)[number];

export const COMPOSITION_PRECEDENCE = [
  "safety-invariants",
  "hard-permissions",
  "statechart-guards",
  "work-order-obligations",
  "resource-budgets",
  "policy-scores-tensions",
  "cadence",
  "voice",
  "visual-skin",
] as const;
export type PrecedenceLayer = (typeof COMPOSITION_PRECEDENCE)[number];

export interface PredicateRef {
  readonly registryId: string;
  readonly version: number;
  readonly params?: Readonly<Record<string, JsonValue>>;
}

export type CadenceSpec =
  | Readonly<{ kind: "Once"; at: number }>
  | Readonly<{ kind: "After"; delayMs: number }>
  | Readonly<{ kind: "Every"; intervalMs: number; startAt?: number }>
  | Readonly<{
      kind: "Gate";
      cadence: CadenceSpec;
      conditionRef: PredicateRef;
    }>
  | Readonly<{
      kind: "Until";
      cadence: CadenceSpec;
      conditionRef: PredicateRef;
    }>;

export interface Identity {
  readonly identityId: string;
  readonly version: number;
  readonly name: string;
  readonly dispositions: readonly string[];
  readonly invariants: readonly string[];
  readonly updateLaws: readonly string[];
  readonly lineage: readonly string[];
}

export interface PolicyDelta {
  readonly key: string;
  readonly value: JsonValue;
}

export interface Role {
  readonly roleId: string;
  readonly version: number;
  readonly name: string;
  readonly obligations: readonly string[];
  readonly permissions: readonly string[];
  readonly objectives: readonly string[];
  readonly policyDeltas: readonly PolicyDelta[];
}

export interface PolarFactor {
  readonly sourceId: string;
  readonly oddsMultiplier: number;
}

export interface PolarAxis {
  readonly polarAxisId: string;
  readonly version: number;
  readonly negativePole: string;
  readonly positivePole: string;
  readonly relation:
    "inverse" | "complement" | "counterweight" | "compensation";
  readonly baselineOdds: number;
  readonly factors: readonly PolarFactor[];
}

export interface AuthorityEnvelope {
  readonly authorityEnvelopeId: string;
  readonly allowedEffects: readonly string[];
  readonly deniedEffects: readonly string[];
  readonly resourceLimits: Readonly<Record<string, number>>;
  readonly requiredEvidence: readonly string[];
  readonly expiresAt: number;
  readonly revocationEventTypes: readonly string[];
  readonly revocationConditions?: readonly PredicateRef[];
}

export interface WorkOrder {
  readonly workOrderId: string;
  readonly objective: string;
  readonly acceptanceCriteria: readonly string[];
  readonly knownFacts: readonly string[];
  readonly decisions: readonly string[];
  readonly constraints: readonly string[];
  readonly nonGoals: readonly string[];
  readonly repo: string;
  readonly baseCommit: string;
  readonly allowedOperations: readonly string[];
  readonly prohibitedOperations: readonly string[];
  readonly requiredEvidence: readonly string[];
  readonly outputContract: JsonValue;
}

export type WorkOrderSeed = Omit<WorkOrder, "repo" | "baseCommit">;

export interface InspectionProjection {
  readonly originalTerm: string;
  readonly translation: string;
  readonly kanji: string;
  readonly rpgTitle: string;
  readonly grants: readonly string[];
  readonly restrictions: readonly string[];
  readonly obligations: readonly string[];
  readonly passive: readonly string[];
  readonly pulse: readonly string[];
  readonly interrupt: readonly string[];
}

export interface InspectionContribution {
  readonly grants?: readonly string[];
  readonly restrictions?: readonly string[];
  readonly obligations?: readonly string[];
  readonly passive?: readonly string[];
  readonly pulse?: readonly string[];
  readonly interrupt?: readonly string[];
}

export interface ActiveMechanic {
  readonly activeMechanicId: string;
  readonly version: number;
  readonly name: string;
  readonly tags: readonly BehaviorTag[];
  readonly requiredCapabilities: readonly string[];
  readonly semantics: readonly string[];
  readonly workOrder: WorkOrderSeed;
  readonly authorityEnvelope: AuthorityEnvelope;
  readonly inspection: InspectionProjection;
}

export type WorkOrderListField =
  | "acceptanceCriteria"
  | "knownFacts"
  | "decisions"
  | "constraints"
  | "nonGoals";

export interface WorkOrderEmission {
  readonly kind: "work-order";
  readonly emissionId: string;
  readonly field: WorkOrderListField;
  readonly values: readonly string[];
  readonly order: number;
}

export interface PermissionEmission {
  readonly kind: "permission-guard";
  readonly emissionId: string;
  readonly allowedOperations: readonly string[];
  readonly prohibitedOperations: readonly string[];
  readonly allowedEffects: readonly string[];
  readonly deniedEffects: readonly string[];
}

export interface SchemaEmission {
  readonly kind: "evidence-schema";
  readonly emissionId: string;
  readonly schemaId: string;
  readonly schema: JsonValue;
  readonly outputContract?: JsonValue;
}

export interface CadenceEmission {
  readonly kind: "cadence";
  readonly emissionId: string;
  readonly cadenceId: string;
  readonly scheduleId: string;
  readonly queuedScheduleId: string;
  readonly queuedDelayMs: number;
  readonly cadence: CadenceSpec;
  readonly cancelOn: readonly PredicateRef[];
}

export interface StatechartGuardEmission {
  readonly kind: "statechart-gate";
  readonly emissionId: string;
  readonly activationCondition: PredicateRef;
  readonly interruptionCondition: PredicateRef;
  readonly authorityRevocationCondition: PredicateRef;
}

export interface VerifierEpisodeEmission {
  readonly kind: "verifier-episode";
  readonly emissionId: string;
  readonly episodeId: string;
  readonly subject: string;
  readonly required: boolean;
}

export interface HookEmission {
  readonly kind: "hook";
  readonly emissionId: string;
  readonly hookId: string;
  readonly event: string;
}

export interface PromptFragmentEmission {
  readonly kind: "prompt-fragment";
  readonly emissionId: string;
  readonly text: string;
}

export type SupportEmission =
  | WorkOrderEmission
  | PermissionEmission
  | SchemaEmission
  | CadenceEmission
  | StatechartGuardEmission
  | VerifierEpisodeEmission
  | HookEmission
  | PromptFragmentEmission;

export interface CompositionClaim {
  readonly claimId: string;
  readonly target: string;
  readonly value: JsonValue;
  readonly layer: PrecedenceLayer;
  readonly hard: boolean;
}

export type MechanismType = SupportEmission["kind"];

export interface RuntimeCost {
  readonly quantity: number;
  readonly unit: string;
}

export interface SupportCost {
  readonly mechanismType: MechanismType;
  readonly promptTokens: number;
  readonly runtimeCost: RuntimeCost;
  readonly extraEpisodes: number;
}

export interface SupportFacet {
  readonly supportFacetId: string;
  readonly version: number;
  readonly name: string;
  readonly supportedTags: readonly BehaviorTag[];
  readonly requiredCapabilities: readonly string[];
  readonly semanticsAdded: readonly string[];
  readonly semanticsModified: readonly Readonly<{
    from: string;
    to: string;
  }>[];
  readonly authorityChanges: readonly string[];
  readonly evidenceRequirements: readonly string[];
  readonly resourceMultiplier: number;
  readonly conflictsWith: readonly string[];
  readonly preservesDeterminism: boolean;
  readonly commutativity: "commutative" | "requires-pipeline";
  readonly emissions: readonly SupportEmission[];
  readonly claims: readonly CompositionClaim[];
  readonly cost: SupportCost;
  readonly inspection: InspectionContribution;
}

export interface Container {
  readonly containerId: string;
  readonly version: number;
  readonly name: string;
  readonly kind: "equipment" | "workspace" | "actor" | "custom";
  readonly socketBudget: number;
  readonly activeMechanicIds: readonly string[];
  readonly supportFacetIds: readonly string[];
}

export interface Link {
  readonly linkId: string;
  readonly linkGroupId: string;
  readonly activeMechanicId: string;
  readonly supportFacetId: string;
}

export interface LinkGroup {
  readonly linkGroupId: string;
  readonly containerId: string;
  readonly linkIds: readonly string[];
}

export interface ExplicitPipeline {
  readonly pipelineId: string;
  readonly linkGroupId: string;
  readonly orderedSupportFacetIds: readonly string[];
}

export interface AmbientEffect {
  readonly ambientEffectId: string;
  readonly version: number;
  readonly name: string;
  readonly scope: string;
  readonly reservationCost: Readonly<Record<string, number>>;
  readonly emissions: readonly SupportEmission[];
}

export interface ResourceReservation {
  readonly reservationId: string;
  readonly resource: string;
  readonly quantity: number;
  readonly sourceId: string;
}

export interface ResourceModel {
  readonly resourceModelId: string;
  readonly version: number;
  readonly capacities: Readonly<Record<string, number>>;
  readonly reservations: readonly ResourceReservation[];
}

export interface LoadoutGraph {
  readonly schemaVersion: 1;
  readonly loadoutId: string;
  readonly identity: Identity;
  readonly role: Role;
  readonly containers: readonly Container[];
  readonly activeMechanics: readonly ActiveMechanic[];
  readonly supportFacets: readonly SupportFacet[];
  readonly links: readonly Link[];
  readonly linkGroups: readonly LinkGroup[];
  readonly explicitPipelines: readonly ExplicitPipeline[];
  readonly ambientEffects: readonly AmbientEffect[];
  readonly resourceModel: ResourceModel;
  readonly polarAxes: readonly PolarAxis[];
}

export interface Phenotype {
  readonly identityId: string;
  readonly identityVersion: number;
  readonly roleId: string;
  readonly roleVersion: number;
  readonly activeMechanicIds: readonly string[];
  readonly linkedSupportFacetIds: readonly string[];
  readonly semantics: readonly string[];
  readonly consumedCapabilities: readonly string[];
  readonly polarAxes: readonly PolarAxis[];
}

export interface CompilationEnvironment {
  readonly environmentId: string;
  readonly version: number;
  readonly capabilities: readonly string[];
  readonly repo: string;
  readonly baseCommit: string;
}

export type DiagnosticCode =
  | "ACTIVE INACTIVE"
  | "SUPPORT INACTIVE"
  | "INVALID GRAPH"
  | "DECLARED SUPPORT CONFLICT"
  | "HARD SUPPORT CONFLICT"
  | "AMBIGUOUS SUPPORT CONFLICT"
  | "NON-COMMUTING SUPPORTS"
  | "SEMANTICS UNSUPPORTED";

export type CompileCorrection =
  | Readonly<{ kind: "provide-capability"; capability: string }>
  | Readonly<{
      kind: "unequip-support";
      supportFacetId: string;
      linkGroupId: string;
    }>
  | Readonly<{
      kind: "link-compatible-active";
      supportFacetId: string;
      supportedTags: readonly BehaviorTag[];
    }>
  | Readonly<{
      kind: "declare-explicit-pipeline";
      linkGroupId: string;
      supportFacetIds: readonly string[];
    }>;

export interface CompileDiagnostic {
  readonly code: DiagnosticCode;
  readonly message: string;
  readonly activeMechanicId?: string;
  readonly supportFacetId?: string;
  readonly linkGroupId?: string;
  readonly missingCapabilities: readonly string[];
  readonly corrections: readonly CompileCorrection[];
}

export interface CompiledCadence {
  readonly supportFacetId: string;
  readonly cadenceId: string;
  readonly scheduleId: string;
  readonly queuedScheduleId: string;
  readonly queuedDelayMs: number;
  readonly cadence: CadenceSpec;
  readonly cancelOn: readonly PredicateRef[];
}

export interface CompiledStatechartGuard {
  readonly supportFacetId: string;
  readonly activationCondition: PredicateRef;
  readonly interruptionCondition: PredicateRef;
}

export interface VerificationEpisode {
  readonly supportFacetId: string;
  readonly episodeId: string;
  readonly subject: string;
  readonly required: boolean;
}

export interface CompiledSchema {
  readonly supportFacetId: string;
  readonly schemaId: string;
  readonly schema: JsonValue;
}

export interface CompiledHook {
  readonly supportFacetId: string;
  readonly hookId: string;
  readonly event: string;
}

export interface CompiledSupportCost extends SupportCost {
  readonly supportFacetId: string;
}

export interface ComponentManifestEntry {
  readonly componentKind:
    "active-mechanic" | "support-facet" | "ambient-effect";
  readonly componentId: string;
  readonly version: number;
  readonly linkGroupId?: string;
  readonly mechanismTypes: readonly MechanismType[];
}

export interface ResolvedClaim {
  readonly supportFacetId: string;
  readonly claimId: string;
  readonly target: string;
  readonly value: JsonValue;
  readonly layer: PrecedenceLayer;
  readonly hard: boolean;
}

export interface ConflictResolution {
  readonly target: string;
  readonly winner: ResolvedClaim;
  readonly overridden: readonly ResolvedClaim[];
}

export interface CompileTrace {
  readonly steps: readonly [
    "1 resolve phenotype",
    "2 type-check links",
    "3 resolve precedence and commutativity",
    "4 emit program",
  ];
  readonly precedence: typeof COMPOSITION_PRECEDENCE;
  readonly conflictResolutions: readonly ConflictResolution[];
}

export interface CompiledProgram {
  readonly schemaVersion: 1;
  readonly compilerVersion: "1";
  readonly loadoutId: string;
  readonly phenotype: Phenotype;
  readonly workOrder: WorkOrder;
  readonly authorityEnvelope: AuthorityEnvelope;
  readonly cadences: readonly CompiledCadence[];
  readonly statechartGuards: readonly CompiledStatechartGuard[];
  readonly schemas: readonly CompiledSchema[];
  readonly hooks: readonly CompiledHook[];
  readonly verificationPlan: readonly VerificationEpisode[];
  readonly promptFragments: readonly string[];
  readonly supportCosts: readonly CompiledSupportCost[];
  readonly resourceMultiplier: number;
  readonly resourceModel: ResourceModel;
  readonly ambientEffects: readonly AmbientEffect[];
  readonly explicitPipelines: readonly ExplicitPipeline[];
  readonly effectiveClaims: readonly ResolvedClaim[];
  readonly componentManifest: readonly ComponentManifestEntry[];
  readonly inspection: InspectionProjection;
  readonly trace: CompileTrace;
}

export type CompileResult =
  | Readonly<{
      ok: true;
      program: CompiledProgram;
      semanticHash: string;
      diagnostics: readonly [];
    }>
  | Readonly<{
      ok: false;
      diagnostics: readonly CompileDiagnostic[];
    }>;

export interface CodeDslView {
  readonly view: "code-dsl";
  readonly schemaVersion: 1;
  readonly definition: LoadoutGraph;
}

export type FunctionTableRow =
  | Readonly<{
      kind: "loadout";
      key: string;
      value: Readonly<{ schemaVersion: 1; loadoutId: string }>;
    }>
  | Readonly<{ kind: "identity"; key: string; value: Identity }>
  | Readonly<{ kind: "role"; key: string; value: Role }>
  | Readonly<{ kind: "container"; key: string; value: Container }>
  | Readonly<{
      kind: "active-mechanic";
      key: string;
      value: ActiveMechanic;
    }>
  | Readonly<{ kind: "support-facet"; key: string; value: SupportFacet }>
  | Readonly<{ kind: "link"; key: string; value: Link }>
  | Readonly<{ kind: "link-group"; key: string; value: LinkGroup }>
  | Readonly<{
      kind: "explicit-pipeline";
      key: string;
      value: ExplicitPipeline;
    }>
  | Readonly<{
      kind: "ambient-effect";
      key: string;
      value: AmbientEffect;
    }>
  | Readonly<{
      kind: "resource-model";
      key: string;
      value: ResourceModel;
    }>
  | Readonly<{ kind: "polar-axis"; key: string; value: PolarAxis }>;

export interface FunctionTableView {
  readonly view: "function-table";
  readonly schemaVersion: 1;
  readonly rows: readonly FunctionTableRow[];
}

export interface StatechartJsonView {
  readonly view: "statechart-json";
  readonly schemaVersion: 1;
  readonly id: string;
  readonly initial: "equipped";
  readonly context: Readonly<{
    identity: Identity;
    role: Role;
    resourceModel: ResourceModel;
    ambientEffects: readonly AmbientEffect[];
    polarAxes: readonly PolarAxis[];
  }>;
  readonly states: Readonly<{
    equipped: Readonly<{
      containers: readonly Container[];
      activeMechanics: readonly ActiveMechanic[];
      supportFacets: readonly SupportFacet[];
      links: readonly Link[];
      linkGroups: readonly LinkGroup[];
      explicitPipelines: readonly ExplicitPipeline[];
    }>;
  }>;
}

export type EditableView = CodeDslView | FunctionTableView | StatechartJsonView;
