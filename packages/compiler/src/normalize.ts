import type {
  ActiveMechanic,
  AmbientEffect,
  AuthorityGrant,
  CadenceSpec,
  CompiledProgram,
  Container,
  ExplicitPipeline,
  Identity,
  InspectionContribution,
  InspectionProjection,
  JsonValue,
  Link,
  LinkGroup,
  LoadoutGraph,
  PolarAxis,
  PredicateRef,
  ResourceModel,
  Role,
  SupportEmission,
  SupportFacet,
  WorkOrderSeed,
} from "./types.js";

const compareText = (left: string, right: string): number =>
  left < right ? -1 : left > right ? 1 : 0;

const sortedUnique = (values: readonly string[]): readonly string[] =>
  [...new Set(values)].sort(compareText);

const orderedUnique = (values: readonly string[]): readonly string[] => [
  ...new Set(values),
];

const by = <T>(values: readonly T[], key: (value: T) => string): readonly T[] =>
  [...values].sort((left, right) => compareText(key(left), key(right)));

const canonicalize = (value: unknown): unknown => {
  if (typeof value === "number") {
    if (!Number.isFinite(value))
      throw new Error("canonical JSON requires finite numeric values");
    return Object.is(value, -0) ? 0 : value;
  }
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value !== null && typeof value === "object") {
    const source = value as Readonly<Record<string, unknown>>;
    return Object.fromEntries(
      Object.keys(source)
        .sort(compareText)
        .map((key) => [key, canonicalize(source[key])]),
    );
  }
  return value;
};

export const canonicalStringify = (value: unknown): string =>
  JSON.stringify(canonicalize(value));

const normalizeJson = (value: JsonValue): JsonValue =>
  canonicalize(value) as JsonValue;

const normalizePredicateRef = (value: PredicateRef): PredicateRef => ({
  registryId: value.registryId,
  version: value.version,
  ...(value.params === undefined
    ? {}
    : {
        params: normalizeJson(value.params) as Readonly<
          Record<string, JsonValue>
        >,
      }),
});

const normalizeCadence = (value: CadenceSpec): CadenceSpec => {
  switch (value.kind) {
    case "Once":
      return { kind: value.kind, at: value.at };
    case "After":
      return { kind: value.kind, delayMs: value.delayMs };
    case "Every":
      return value.startAt === undefined
        ? { kind: value.kind, intervalMs: value.intervalMs }
        : {
            kind: value.kind,
            intervalMs: value.intervalMs,
            startAt: value.startAt,
          };
    case "Gate":
    case "Until":
      return {
        kind: value.kind,
        cadence: normalizeCadence(value.cadence),
        conditionRef: normalizePredicateRef(value.conditionRef),
      };
  }
};

const normalizeIdentity = (value: Identity): Identity => ({
  identityId: value.identityId,
  version: value.version,
  name: value.name,
  dispositions: sortedUnique(value.dispositions),
  invariants: sortedUnique(value.invariants),
  updateLaws: [...value.updateLaws],
  lineage: [...value.lineage],
});

const normalizeRole = (value: Role): Role => ({
  roleId: value.roleId,
  version: value.version,
  name: value.name,
  obligations: sortedUnique(value.obligations),
  permissions: sortedUnique(value.permissions),
  objectives: [...value.objectives],
  policyDeltas: value.policyDeltas.map((delta) => ({
    key: delta.key,
    value: normalizeJson(delta.value),
  })),
});

const normalizeInspection = (
  value: InspectionProjection,
): InspectionProjection => ({
  originalTerm: value.originalTerm,
  translation: value.translation,
  kanji: value.kanji,
  rpgTitle: value.rpgTitle,
  grants: [...value.grants],
  restrictions: [...value.restrictions],
  obligations: [...value.obligations],
  passive: [...value.passive],
  pulse: [...value.pulse],
  interrupt: [...value.interrupt],
});

const normalizeInspectionContribution = (
  value: InspectionContribution,
): InspectionContribution => ({
  ...(value.grants === undefined ? {} : { grants: [...value.grants] }),
  ...(value.restrictions === undefined
    ? {}
    : { restrictions: [...value.restrictions] }),
  ...(value.obligations === undefined
    ? {}
    : { obligations: [...value.obligations] }),
  ...(value.passive === undefined ? {} : { passive: [...value.passive] }),
  ...(value.pulse === undefined ? {} : { pulse: [...value.pulse] }),
  ...(value.interrupt === undefined ? {} : { interrupt: [...value.interrupt] }),
});

const normalizeWorkOrderSeed = (value: WorkOrderSeed): WorkOrderSeed => ({
  workOrderId: value.workOrderId,
  objective: value.objective,
  acceptanceCriteria: [...value.acceptanceCriteria],
  knownFacts: [...value.knownFacts],
  decisions: [...value.decisions],
  constraints: [...value.constraints],
  nonGoals: [...value.nonGoals],
  allowedOperations: orderedUnique(value.allowedOperations),
  prohibitedOperations: orderedUnique(value.prohibitedOperations),
  requiredEvidence: orderedUnique(value.requiredEvidence),
  outputContract: normalizeJson(value.outputContract),
});

const normalizeAuthority = (
  value: ActiveMechanic["authorityEnvelope"],
): ActiveMechanic["authorityEnvelope"] => ({
  authorityEnvelopeId: value.authorityEnvelopeId,
  allowedEffects: orderedUnique(value.allowedEffects),
  deniedEffects: orderedUnique(value.deniedEffects),
  resourceLimits: normalizeJson(value.resourceLimits) as Readonly<
    Record<string, number>
  >,
  requiredEvidence: orderedUnique(value.requiredEvidence),
  expiresAt: value.expiresAt,
  revocationEventTypes: orderedUnique(value.revocationEventTypes),
  ...(value.revocationConditions === undefined
    ? {}
    : {
        revocationConditions: value.revocationConditions.map(
          normalizePredicateRef,
        ),
      }),
});

const normalizeActive = (value: ActiveMechanic): ActiveMechanic => ({
  activeMechanicId: value.activeMechanicId,
  version: value.version,
  name: value.name,
  tags: sortedUnique(value.tags) as ActiveMechanic["tags"],
  requiredCapabilities: sortedUnique(value.requiredCapabilities),
  semantics: sortedUnique(value.semantics),
  workOrder: normalizeWorkOrderSeed(value.workOrder),
  authorityEnvelope: normalizeAuthority(value.authorityEnvelope),
  inspection: normalizeInspection(value.inspection),
});

const normalizeEmission = (value: SupportEmission): SupportEmission => {
  switch (value.kind) {
    case "work-order":
      return {
        kind: value.kind,
        emissionId: value.emissionId,
        field: value.field,
        values: orderedUnique(value.values),
        order: value.order,
      };
    case "permission-guard":
      return {
        kind: value.kind,
        emissionId: value.emissionId,
        allowedOperations: sortedUnique(value.allowedOperations),
        prohibitedOperations: sortedUnique(value.prohibitedOperations),
        allowedEffects: sortedUnique(value.allowedEffects),
        deniedEffects: sortedUnique(value.deniedEffects),
      };
    case "evidence-schema":
      return {
        kind: value.kind,
        emissionId: value.emissionId,
        schemaId: value.schemaId,
        schema: normalizeJson(value.schema),
        ...(value.outputContract === undefined
          ? {}
          : { outputContract: normalizeJson(value.outputContract) }),
      };
    case "cadence":
      return {
        kind: value.kind,
        emissionId: value.emissionId,
        cadenceId: value.cadenceId,
        scheduleId: value.scheduleId,
        queuedScheduleId: value.queuedScheduleId,
        queuedDelayMs: value.queuedDelayMs,
        cadence: normalizeCadence(value.cadence),
        cancelOn: value.cancelOn.map(normalizePredicateRef),
      };
    case "statechart-gate":
      return {
        kind: value.kind,
        emissionId: value.emissionId,
        activationCondition: normalizePredicateRef(value.activationCondition),
        interruptionCondition: normalizePredicateRef(
          value.interruptionCondition,
        ),
        authorityRevocationCondition: normalizePredicateRef(
          value.authorityRevocationCondition,
        ),
      };
    case "verifier-episode":
      return { ...value };
    case "hook":
      return { ...value };
    case "prompt-fragment":
      return { ...value };
  }
};

const normalizeSupport = (value: SupportFacet): SupportFacet => ({
  supportFacetId: value.supportFacetId,
  version: value.version,
  name: value.name,
  supportedTags: sortedUnique(
    value.supportedTags,
  ) as SupportFacet["supportedTags"],
  requiredCapabilities: sortedUnique(value.requiredCapabilities),
  semanticsAdded: sortedUnique(value.semanticsAdded),
  semanticsModified: by(
    value.semanticsModified.map((entry) => ({ ...entry })),
    (entry) => `${entry.from}\u0000${entry.to}`,
  ),
  authorityChanges: sortedUnique(value.authorityChanges),
  evidenceRequirements: orderedUnique(value.evidenceRequirements),
  resourceMultiplier: value.resourceMultiplier,
  conflictsWith: sortedUnique(value.conflictsWith),
  preservesDeterminism: value.preservesDeterminism,
  commutativity: value.commutativity,
  emissions: by(
    value.emissions.map(normalizeEmission),
    (entry) => entry.emissionId,
  ),
  claims: by(
    value.claims.map((claim) => ({
      ...claim,
      value: normalizeJson(claim.value),
    })),
    (claim) => claim.claimId,
  ),
  cost: {
    mechanismType: value.cost.mechanismType,
    promptTokens: value.cost.promptTokens,
    runtimeCost: { ...value.cost.runtimeCost },
    extraEpisodes: value.cost.extraEpisodes,
  },
  inspection: normalizeInspectionContribution(value.inspection),
});

const normalizeContainer = (value: Container): Container => ({
  ...value,
  activeMechanicIds: sortedUnique(value.activeMechanicIds),
  supportFacetIds: sortedUnique(value.supportFacetIds),
});

const normalizeLink = (value: Link): Link => ({ ...value });

const normalizeLinkGroup = (value: LinkGroup): LinkGroup => ({
  ...value,
  linkIds: sortedUnique(value.linkIds),
});

const normalizePipeline = (value: ExplicitPipeline): ExplicitPipeline => ({
  ...value,
  // Pipeline order is executable semantics. Never sort this list.
  orderedSupportFacetIds: [...value.orderedSupportFacetIds],
});

const normalizeAmbientEffect = (value: AmbientEffect): AmbientEffect => ({
  ...value,
  reservationCost: normalizeJson(value.reservationCost) as Readonly<
    Record<string, number>
  >,
  emissions: by(
    value.emissions.map(normalizeEmission),
    (entry) => entry.emissionId,
  ),
});

const normalizeResourceModel = (value: ResourceModel): ResourceModel => ({
  ...value,
  capacities: normalizeJson(value.capacities) as Readonly<
    Record<string, number>
  >,
  reservations: by(
    value.reservations.map((reservation) => ({ ...reservation })),
    (reservation) => reservation.reservationId,
  ),
});

const normalizePolarAxis = (value: PolarAxis): PolarAxis => ({
  ...value,
  factors: by(
    value.factors.map((factor) => ({ ...factor })),
    (factor) => factor.sourceId,
  ),
});

/** Validate at the normalization boundary, including deserialized view input. */
export const normalizeAuthorityGrants = (
  values: readonly AuthorityGrant[],
): readonly AuthorityGrant[] => {
  if (!Array.isArray(values))
    throw new Error("authorityGrants must be an array");
  const ids = new Set<string>();
  const grants = values.map((value, index): AuthorityGrant => {
    const fail = (field: string): never => {
      throw new Error(`authorityGrants[${index}] has invalid ${field}`);
    };
    if (value === null || typeof value !== "object" || Array.isArray(value))
      fail("grant");
    const text = (field: "grantId" | "repo" | "reason") => {
      const content = value[field];
      if (
        typeof content !== "string" ||
        !content.trim() ||
        /[\u0000-\u001f\u007f\u2028\u2029]/u.test(content)
      )
        fail(field);
      return content;
    };
    const grantId = text("grantId");
    if (ids.has(grantId))
      throw new Error(`authorityGrants has duplicate grantId "${grantId}"`);
    ids.add(grantId);
    if (!Number.isSafeInteger(value.version) || value.version < 1)
      fail("version");
    if (
      !["operator", "host-policy", "registered-repository"].includes(
        value.grantedBy,
      )
    )
      fail("grantedBy");
    const exactIds = (field: "effects" | "operations") => {
      const entries = value[field];
      if (
        !Array.isArray(entries) ||
        entries.some(
          (entry) =>
            typeof entry !== "string" ||
            !entry.length ||
            /[\s*\u0000-\u001f\u007f]/u.test(entry),
        )
      )
        fail(field);
      return sortedUnique(entries!);
    };
    return {
      grantId,
      version: value.version,
      grantedBy: value.grantedBy,
      effects: exactIds("effects"),
      ...(value.operations === undefined
        ? {}
        : { operations: exactIds("operations") }),
      repo: text("repo"),
      reason: text("reason"),
    };
  });
  return by(grants, (grant) => grant.grantId);
};

export const normalizeLoadoutGraph = (value: LoadoutGraph): LoadoutGraph =>
  canonicalize({
    schemaVersion: 1,
    loadoutId: value.loadoutId,
    identity: normalizeIdentity(value.identity),
    role: normalizeRole(value.role),
    containers: by(
      value.containers.map(normalizeContainer),
      (entry) => entry.containerId,
    ),
    activeMechanics: by(
      value.activeMechanics.map(normalizeActive),
      (entry) => entry.activeMechanicId,
    ),
    supportFacets: by(
      value.supportFacets.map(normalizeSupport),
      (entry) => entry.supportFacetId,
    ),
    links: by(value.links.map(normalizeLink), (entry) => entry.linkId),
    linkGroups: by(
      value.linkGroups.map(normalizeLinkGroup),
      (entry) => entry.linkGroupId,
    ),
    explicitPipelines: by(
      value.explicitPipelines.map(normalizePipeline),
      (entry) => entry.pipelineId,
    ),
    ambientEffects: by(
      value.ambientEffects.map(normalizeAmbientEffect),
      (entry) => entry.ambientEffectId,
    ),
    resourceModel: normalizeResourceModel(value.resourceModel),
    polarAxes: by(
      value.polarAxes.map(normalizePolarAxis),
      (entry) => entry.polarAxisId,
    ),
    authorityGrants: normalizeAuthorityGrants(value.authorityGrants ?? []),
  }) as LoadoutGraph;

export const normalizeCompiledProgram = (
  value: CompiledProgram,
): CompiledProgram =>
  // Compile output already gives every array its semantic order. This canonical
  // object-key pass makes equivalent construction orders hash identically while
  // preserving WorkOrder prose order and explicit pipeline order.
  JSON.parse(
    canonicalStringify({
      ...value,
      grants: value.grants?.length
        ? normalizeAuthorityGrants(value.grants)
        : undefined,
    }),
  ) as CompiledProgram;

export const fnv1a64 = (value: string): string => {
  let hash = 0xcbf29ce484222325n;
  for (const byte of new TextEncoder().encode(value))
    hash = ((hash ^ BigInt(byte)) * 0x100000001b3n) & 0xffffffffffffffffn;
  return hash.toString(16).padStart(16, "0");
};

export const semanticHash = (value: CompiledProgram): string =>
  `fnv1a64:${fnv1a64(canonicalStringify(normalizeCompiledProgram(value)))}`;
