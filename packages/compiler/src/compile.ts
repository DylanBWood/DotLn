import {
  canonicalStringify,
  normalizeCompiledProgram,
  normalizeLoadoutGraph,
  semanticHash,
} from "./normalize.js";
import { loadoutFromEditableView } from "./views.js";
import {
  COMPOSITION_PRECEDENCE,
  type ActiveMechanic,
  type CompileCorrection,
  type CompileDiagnostic,
  type CompiledProgram,
  type CompilationEnvironment,
  type CompileResult,
  type ConflictResolution,
  type EditableView,
  type InspectionContribution,
  type InspectionProjection,
  type Link,
  type LoadoutGraph,
  type ResolvedClaim,
  type SupportEmission,
  type SupportFacet,
  type WorkOrder,
  type WorkOrderListField,
} from "./types.js";

const compareText = (left: string, right: string): number =>
  left < right ? -1 : left > right ? 1 : 0;

const orderedUnique = (values: readonly string[]): readonly string[] => [
  ...new Set(values),
];

const emissionsOf = <K extends SupportEmission["kind"]>(
  support: SupportFacet,
  kind: K,
): readonly Extract<SupportEmission, { readonly kind: K }>[] =>
  support.emissions.filter(
    (emission): emission is Extract<SupportEmission, { readonly kind: K }> =>
      emission.kind === kind,
  );

const diagnostic = (
  code: CompileDiagnostic["code"],
  message: string,
  details: Readonly<{
    activeMechanicId?: string;
    supportFacetId?: string;
    linkGroupId?: string;
    missingCapabilities?: readonly string[];
    corrections?: readonly CompileCorrection[];
  }> = {},
): CompileDiagnostic => ({
  code,
  message,
  ...(details.activeMechanicId === undefined
    ? {}
    : { activeMechanicId: details.activeMechanicId }),
  ...(details.supportFacetId === undefined
    ? {}
    : { supportFacetId: details.supportFacetId }),
  ...(details.linkGroupId === undefined
    ? {}
    : { linkGroupId: details.linkGroupId }),
  missingCapabilities: details.missingCapabilities ?? [],
  corrections: details.corrections ?? [],
});

const invalid = (message: string): CompileDiagnostic =>
  diagnostic("INVALID GRAPH", `INVALID GRAPH: ${message}`);

const duplicateDiagnostics = <T>(
  label: string,
  values: readonly T[],
  id: (value: T) => string,
): readonly CompileDiagnostic[] => {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const value of values) {
    const key = id(value);
    if (seen.has(key)) duplicates.add(key);
    seen.add(key);
  }
  return [...duplicates]
    .sort(compareText)
    .map((key) => invalid(`duplicate ${label} id "${key}"`));
};

const linkCorrections = (
  support: SupportFacet,
  link: Link,
  missingCapabilities: readonly string[],
): readonly CompileCorrection[] => [
  ...missingCapabilities.map((capability): CompileCorrection => ({
    kind: "provide-capability",
    capability,
  })),
  {
    kind: "unequip-support",
    supportFacetId: support.supportFacetId,
    linkGroupId: link.linkGroupId,
  },
];

const compileLinkDiagnostics = (
  graph: LoadoutGraph,
  environment: CompilationEnvironment,
): readonly CompileDiagnostic[] => {
  const diagnostics: CompileDiagnostic[] = [];
  const activeById = new Map(
    graph.activeMechanics.map((active) => [active.activeMechanicId, active]),
  );
  const supportById = new Map(
    graph.supportFacets.map((support) => [support.supportFacetId, support]),
  );
  const groupById = new Map(
    graph.linkGroups.map((group) => [group.linkGroupId, group]),
  );
  const capabilities = new Set(environment.capabilities);

  for (const active of graph.activeMechanics) {
    const missingCapabilities = active.requiredCapabilities.filter(
      (capability) => !capabilities.has(capability),
    );
    if (missingCapabilities.length > 0)
      diagnostics.push(
        diagnostic(
          "ACTIVE INACTIVE",
          `ACTIVE INACTIVE: active "${active.activeMechanicId}" is missing ${missingCapabilities.map((value) => `capability "${value}"`).join(", ")}.`,
          {
            activeMechanicId: active.activeMechanicId,
            missingCapabilities,
            corrections: missingCapabilities.map((capability) => ({
              kind: "provide-capability" as const,
              capability,
            })),
          },
        ),
      );
  }

  for (const link of graph.links) {
    const active = activeById.get(link.activeMechanicId);
    const support = supportById.get(link.supportFacetId);
    const group = groupById.get(link.linkGroupId);
    if (active === undefined)
      diagnostics.push(
        invalid(
          `link "${link.linkId}" references missing active "${link.activeMechanicId}"`,
        ),
      );
    if (support === undefined)
      diagnostics.push(
        invalid(
          `link "${link.linkId}" references missing support "${link.supportFacetId}"`,
        ),
      );
    if (group === undefined)
      diagnostics.push(
        invalid(
          `link "${link.linkId}" references missing group "${link.linkGroupId}"`,
        ),
      );
    else if (!group.linkIds.includes(link.linkId))
      diagnostics.push(
        invalid(
          `group "${group.linkGroupId}" does not include link "${link.linkId}"`,
        ),
      );
    if (active === undefined || support === undefined) continue;

    const tagCompatible = support.supportedTags.some((tag) =>
      active.tags.includes(tag),
    );
    const missingCapabilities = support.requiredCapabilities.filter(
      (capability) => !capabilities.has(capability),
    );
    if (missingCapabilities.length > 0) {
      diagnostics.push(
        diagnostic(
          "SUPPORT INACTIVE",
          `SUPPORT INACTIVE: support "${support.supportFacetId}" linked to active "${active.activeMechanicId}" is missing ${missingCapabilities.map((value) => `capability "${value}"`).join(", ")}.`,
          {
            activeMechanicId: active.activeMechanicId,
            supportFacetId: support.supportFacetId,
            linkGroupId: link.linkGroupId,
            missingCapabilities,
            corrections: linkCorrections(support, link, missingCapabilities),
          },
        ),
      );
    }
    if (!tagCompatible)
      diagnostics.push(
        diagnostic(
          "SUPPORT INACTIVE",
          `SUPPORT INACTIVE: support "${support.supportFacetId}" supports tags [${support.supportedTags.join(", ")}], but active "${active.activeMechanicId}" exposes [${active.tags.join(", ")}].`,
          {
            activeMechanicId: active.activeMechanicId,
            supportFacetId: support.supportFacetId,
            linkGroupId: link.linkGroupId,
            corrections: [
              {
                kind: "link-compatible-active",
                supportFacetId: support.supportFacetId,
                supportedTags: support.supportedTags,
              },
              ...linkCorrections(support, link, []),
            ],
          },
        ),
      );
  }
  return diagnostics;
};

const supportsInGroup = (
  graph: LoadoutGraph,
  linkGroupId: string,
): readonly SupportFacet[] => {
  const supportById = new Map(
    graph.supportFacets.map((support) => [support.supportFacetId, support]),
  );
  return graph.links
    .filter((link) => link.linkGroupId === linkGroupId)
    .map((link) => supportById.get(link.supportFacetId))
    .filter((support): support is SupportFacet => support !== undefined)
    .filter(
      (support, index, supports) =>
        supports.findIndex(
          (candidate) => candidate.supportFacetId === support.supportFacetId,
        ) === index,
    )
    .sort((left, right) =>
      compareText(left.supportFacetId, right.supportFacetId),
    );
};

const conflictDiagnostics = (
  graph: LoadoutGraph,
): readonly CompileDiagnostic[] => {
  const diagnostics: CompileDiagnostic[] = [];
  for (const group of graph.linkGroups) {
    const supports = supportsInGroup(graph, group.linkGroupId);
    for (let leftIndex = 0; leftIndex < supports.length; leftIndex += 1) {
      const left = supports[leftIndex]!;
      for (
        let rightIndex = leftIndex + 1;
        rightIndex < supports.length;
        rightIndex += 1
      ) {
        const right = supports[rightIndex]!;
        if (
          left.conflictsWith.includes(right.supportFacetId) ||
          right.conflictsWith.includes(left.supportFacetId)
        )
          diagnostics.push(
            diagnostic(
              "DECLARED SUPPORT CONFLICT",
              `DECLARED SUPPORT CONFLICT: supports "${left.supportFacetId}" and "${right.supportFacetId}" exclude each other in link group "${group.linkGroupId}".`,
              {
                linkGroupId: group.linkGroupId,
                corrections: [
                  {
                    kind: "unequip-support",
                    supportFacetId: left.supportFacetId,
                    linkGroupId: group.linkGroupId,
                  },
                  {
                    kind: "unequip-support",
                    supportFacetId: right.supportFacetId,
                    linkGroupId: group.linkGroupId,
                  },
                ],
              },
            ),
          );

        if (
          left.commutativity === "requires-pipeline" ||
          right.commutativity === "requires-pipeline"
        ) {
          const pipeline = graph.explicitPipelines.find(
            (candidate) =>
              candidate.linkGroupId === group.linkGroupId &&
              candidate.orderedSupportFacetIds.includes(left.supportFacetId) &&
              candidate.orderedSupportFacetIds.includes(right.supportFacetId),
          );
          if (pipeline === undefined)
            diagnostics.push(
              diagnostic(
                "NON-COMMUTING SUPPORTS",
                `NON-COMMUTING SUPPORTS: "${left.supportFacetId}" and "${right.supportFacetId}" in link group "${group.linkGroupId}" require an explicit pipeline; link order is not execution order.`,
                {
                  linkGroupId: group.linkGroupId,
                  corrections: [
                    {
                      kind: "declare-explicit-pipeline",
                      linkGroupId: group.linkGroupId,
                      supportFacetIds: [
                        left.supportFacetId,
                        right.supportFacetId,
                      ],
                    },
                  ],
                },
              ),
            );
        }
      }
    }
  }
  return diagnostics;
};

const resolveClaims = (
  graph: LoadoutGraph,
): Readonly<{
  diagnostics: readonly CompileDiagnostic[];
  resolutions: readonly ConflictResolution[];
  effectiveClaims: readonly ResolvedClaim[];
}> => {
  const groupForSupport = new Map<string, string>();
  for (const link of graph.links)
    if (!groupForSupport.has(link.supportFacetId))
      groupForSupport.set(link.supportFacetId, link.linkGroupId);

  const linkedIds = new Set(graph.links.map((link) => link.supportFacetId));
  const claims: ResolvedClaim[] = graph.supportFacets
    .filter((support) => linkedIds.has(support.supportFacetId))
    .flatMap((support) =>
      support.claims.map((claim) => ({
        supportFacetId: support.supportFacetId,
        claimId: claim.claimId,
        target: claim.target,
        value: claim.value,
        layer: claim.layer,
        hard: claim.hard,
      })),
    );
  const targets = [...new Set(claims.map((claim) => claim.target))].sort(
    compareText,
  );
  const diagnostics: CompileDiagnostic[] = [];
  const resolutions: ConflictResolution[] = [];
  const effectiveClaims: ResolvedClaim[] = [];

  for (const target of targets) {
    const candidates = claims.filter((claim) => claim.target === target);
    const distinctValues = new Set(
      candidates.map((claim) => canonicalStringify(claim.value)),
    );

    const hard = candidates.filter((claim) => claim.hard);
    if (
      new Set(hard.map((claim) => canonicalStringify(claim.value))).size > 1
    ) {
      const ids = hard.map((claim) => claim.supportFacetId).sort(compareText);
      const linkGroupId = groupForSupport.get(ids[0] ?? "");
      diagnostics.push(
        diagnostic(
          "HARD SUPPORT CONFLICT",
          `HARD SUPPORT CONFLICT: supports ${ids.map((id) => `"${id}"`).join(" and ")} make incompatible hard claims for "${target}".`,
          {
            ...(linkGroupId === undefined ? {} : { linkGroupId }),
            corrections:
              linkGroupId === undefined
                ? []
                : ids.map((supportFacetId) => ({
                    kind: "unequip-support" as const,
                    supportFacetId,
                    linkGroupId,
                  })),
          },
        ),
      );
      continue;
    }

    const ordered = [...candidates].sort((left, right) => {
      const leftPrecedence = COMPOSITION_PRECEDENCE.indexOf(left.layer);
      const rightPrecedence = COMPOSITION_PRECEDENCE.indexOf(right.layer);
      const precedence =
        (leftPrecedence === -1 ? Number.MAX_SAFE_INTEGER : leftPrecedence) -
        (rightPrecedence === -1 ? Number.MAX_SAFE_INTEGER : rightPrecedence);
      if (precedence !== 0) return precedence;
      if (left.hard !== right.hard) return left.hard ? -1 : 1;
      return (
        compareText(left.supportFacetId, right.supportFacetId) ||
        compareText(left.claimId, right.claimId)
      );
    });
    const winner = ordered[0]!;
    const tied =
      distinctValues.size < 2
        ? undefined
        : ordered.find(
            (candidate, index) =>
              index > 0 &&
              candidate.layer === winner.layer &&
              candidate.hard === winner.hard &&
              canonicalStringify(candidate.value) !==
                canonicalStringify(winner.value),
          );
    if (tied !== undefined) {
      diagnostics.push(
        diagnostic(
          "AMBIGUOUS SUPPORT CONFLICT",
          `AMBIGUOUS SUPPORT CONFLICT: supports "${winner.supportFacetId}" and "${tied.supportFacetId}" make equal-precedence claims for "${target}".`,
        ),
      );
      continue;
    }
    effectiveClaims.push(winner);
    if (distinctValues.size > 1)
      resolutions.push({
        target,
        winner,
        overridden: ordered.slice(1),
      });
  }
  return { diagnostics, resolutions, effectiveClaims };
};

const graphDiagnostics = (
  graph: LoadoutGraph,
): readonly CompileDiagnostic[] => {
  const diagnostics: CompileDiagnostic[] = [
    ...duplicateDiagnostics(
      "container",
      graph.containers,
      (value) => value.containerId,
    ),
    ...duplicateDiagnostics(
      "active mechanic",
      graph.activeMechanics,
      (value) => value.activeMechanicId,
    ),
    ...duplicateDiagnostics(
      "support facet",
      graph.supportFacets,
      (value) => value.supportFacetId,
    ),
    ...duplicateDiagnostics("link", graph.links, (value) => value.linkId),
    ...duplicateDiagnostics(
      "link group",
      graph.linkGroups,
      (value) => value.linkGroupId,
    ),
    ...duplicateDiagnostics(
      "explicit pipeline",
      graph.explicitPipelines,
      (value) => value.pipelineId,
    ),
    ...duplicateDiagnostics(
      "ambient effect",
      graph.ambientEffects,
      (value) => value.ambientEffectId,
    ),
    ...duplicateDiagnostics(
      "polar axis",
      graph.polarAxes,
      (value) => value.polarAxisId,
    ),
  ];
  const linkedSupportIds = new Set(
    graph.links.map((link) => link.supportFacetId),
  );
  const linkedAuthorityClaims = graph.supportFacets
    .filter((support) => linkedSupportIds.has(support.supportFacetId))
    .flatMap((support) =>
      support.claims.filter((claim) => claim.target.startsWith("authority.")),
    );
  for (const support of graph.supportFacets)
    for (const claim of support.claims) {
      if (!(COMPOSITION_PRECEDENCE as readonly string[]).includes(claim.layer))
        diagnostics.push(
          invalid(
            `support "${support.supportFacetId}" claim "${claim.claimId}" uses unknown precedence layer "${claim.layer}"`,
          ),
        );
      else if (
        claim.target.startsWith("authority.") &&
        (claim.target === "authority." ||
          (claim.value !== "allow" && claim.value !== "deny"))
      )
        diagnostics.push(
          invalid(
            `support "${support.supportFacetId}" claim "${claim.claimId}" must use "allow" or "deny" for authority target "${claim.target}"`,
          ),
        );
      else if (
        linkedSupportIds.has(support.supportFacetId) &&
        claim.target.startsWith("authority.") &&
        claim.target.slice("authority.".length).endsWith("*")
      )
        diagnostics.push(
          diagnostic(
            "SEMANTICS UNSUPPORTED",
            `SEMANTICS UNSUPPORTED: compiler v1 requires exact authority and operation patterns; support "${support.supportFacetId}" claim "${claim.claimId}" targets wildcard "${claim.target.slice("authority.".length)}".`,
          ),
        );
    }
  for (const active of graph.activeMechanics)
    for (const pattern of [
      ...active.workOrder.allowedOperations,
      ...active.workOrder.prohibitedOperations,
      ...active.authorityEnvelope.allowedEffects,
      ...active.authorityEnvelope.deniedEffects,
    ])
      if (pattern.endsWith("*") && linkedAuthorityClaims.length > 0)
        diagnostics.push(
          diagnostic(
            "SEMANTICS UNSUPPORTED",
            `SEMANTICS UNSUPPORTED: compiler v1 cannot combine wildcard authority or operation pattern "${pattern}" from active "${active.activeMechanicId}" with linked authority claims; remove the wildcard or the claims.`,
          ),
        );
  for (const support of graph.supportFacets.filter((candidate) =>
    linkedSupportIds.has(candidate.supportFacetId),
  ))
    for (const emission of emissionsOf(support, "permission-guard"))
      for (const pattern of [
        ...emission.allowedOperations,
        ...emission.prohibitedOperations,
        ...emission.allowedEffects,
        ...emission.deniedEffects,
      ])
        if (pattern.endsWith("*") && linkedAuthorityClaims.length > 0)
          diagnostics.push(
            diagnostic(
              "SEMANTICS UNSUPPORTED",
              `SEMANTICS UNSUPPORTED: compiler v1 cannot combine wildcard authority or operation pattern "${pattern}" from support "${support.supportFacetId}" with linked authority claims; remove the wildcard or the claims.`,
            ),
          );
  if (graph.activeMechanics.length !== 1)
    diagnostics.push(
      diagnostic(
        "SEMANTICS UNSUPPORTED",
        `SEMANTICS UNSUPPORTED: compiler v1 requires exactly one active mechanic; observed ${graph.activeMechanics.length}.`,
      ),
    );
  const participatingLinkGroups = new Set(
    graph.links.map((link) => link.linkGroupId),
  );
  if (participatingLinkGroups.size > 1)
    diagnostics.push(
      diagnostic(
        "SEMANTICS UNSUPPORTED",
        `SEMANTICS UNSUPPORTED: compiler v1 lowers at most one participating link group; observed ${participatingLinkGroups.size}.`,
      ),
    );
  const participatingPipelines = graph.explicitPipelines.filter((pipeline) =>
    participatingLinkGroups.has(pipeline.linkGroupId),
  );
  if (participatingPipelines.length > 1)
    diagnostics.push(
      diagnostic(
        "SEMANTICS UNSUPPORTED",
        `SEMANTICS UNSUPPORTED: compiler v1 lowers at most one explicit pipeline in a participating link group; observed ${participatingPipelines.length}.`,
      ),
    );
  const resourceMultiplier = graph.supportFacets
    .filter((support) => linkedSupportIds.has(support.supportFacetId))
    .reduce((total, support) => total * support.resourceMultiplier, 1);
  if (!Number.isFinite(resourceMultiplier))
    diagnostics.push(
      invalid("linked support resource multipliers exceed finite JSON range"),
    );
  const containerById = new Map(
    graph.containers.map((value) => [value.containerId, value]),
  );
  const activeIds = new Set(
    graph.activeMechanics.map((value) => value.activeMechanicId),
  );
  const supportIds = new Set(
    graph.supportFacets.map((value) => value.supportFacetId),
  );
  const linkById = new Map(graph.links.map((value) => [value.linkId, value]));
  const groupIds = new Set(graph.linkGroups.map((value) => value.linkGroupId));
  for (const container of graph.containers) {
    for (const activeId of container.activeMechanicIds)
      if (!activeIds.has(activeId))
        diagnostics.push(
          invalid(
            `container "${container.containerId}" references missing active "${activeId}"`,
          ),
        );
    for (const supportId of container.supportFacetIds)
      if (!supportIds.has(supportId))
        diagnostics.push(
          invalid(
            `container "${container.containerId}" references missing support "${supportId}"`,
          ),
        );
  }
  for (const group of graph.linkGroups) {
    const container = containerById.get(group.containerId);
    if (container === undefined)
      diagnostics.push(
        invalid(
          `link group "${group.linkGroupId}" references missing container "${group.containerId}"`,
        ),
      );
    else if (group.linkIds.length > container.socketBudget)
      diagnostics.push(
        invalid(
          `link group "${group.linkGroupId}" has ${group.linkIds.length} links but container "${container.containerId}" permits ${container.socketBudget}`,
        ),
      );
    for (const linkId of group.linkIds) {
      const link = linkById.get(linkId);
      if (link === undefined)
        diagnostics.push(
          invalid(
            `link group "${group.linkGroupId}" references missing link "${linkId}"`,
          ),
        );
      else if (link.linkGroupId !== group.linkGroupId)
        diagnostics.push(
          invalid(
            `link "${link.linkId}" belongs to group "${link.linkGroupId}", not "${group.linkGroupId}"`,
          ),
        );
      else if (
        container !== undefined &&
        (!container.activeMechanicIds.includes(link.activeMechanicId) ||
          !container.supportFacetIds.includes(link.supportFacetId))
      )
        diagnostics.push(
          invalid(
            `link "${link.linkId}" references a component outside container "${container.containerId}"`,
          ),
        );
    }
  }
  for (const pipeline of graph.explicitPipelines) {
    if (!groupIds.has(pipeline.linkGroupId))
      diagnostics.push(
        invalid(
          `pipeline "${pipeline.pipelineId}" references missing group "${pipeline.linkGroupId}"`,
        ),
      );
    const linkedSupportIds = new Set(
      graph.links
        .filter((link) => link.linkGroupId === pipeline.linkGroupId)
        .map((link) => link.supportFacetId),
    );
    for (const supportId of pipeline.orderedSupportFacetIds)
      if (!linkedSupportIds.has(supportId))
        diagnostics.push(
          invalid(
            `pipeline "${pipeline.pipelineId}" references unlinked support "${supportId}"`,
          ),
        );
  }
  return diagnostics;
};

const appendInspection = (
  target: InspectionProjection,
  contribution: InspectionContribution,
): InspectionProjection => ({
  ...target,
  grants: [...target.grants, ...(contribution.grants ?? [])],
  restrictions: [...target.restrictions, ...(contribution.restrictions ?? [])],
  obligations: [...target.obligations, ...(contribution.obligations ?? [])],
  passive: [...target.passive, ...(contribution.passive ?? [])],
  pulse: [...target.pulse, ...(contribution.pulse ?? [])],
  interrupt: [...target.interrupt, ...(contribution.interrupt ?? [])],
});

const applySemantics = (
  active: ActiveMechanic,
  supports: readonly SupportFacet[],
): readonly string[] => {
  let semantics = [...active.semantics];
  for (const support of supports) {
    for (const modification of support.semanticsModified)
      semantics = semantics.map((value) =>
        value === modification.from ? modification.to : value,
      );
    semantics.push(...support.semanticsAdded);
  }
  return [...new Set(semantics)].sort(compareText);
};

const supportsInSemanticOrder = (
  graph: LoadoutGraph,
  linkedSupports: readonly SupportFacet[],
): readonly SupportFacet[] => {
  const supportById = new Map(
    linkedSupports.map((support) => [support.supportFacetId, support]),
  );
  const pipelinedIds = new Set(
    graph.explicitPipelines.flatMap(
      (pipeline) => pipeline.orderedSupportFacetIds,
    ),
  );
  return [
    ...graph.explicitPipelines.flatMap((pipeline) =>
      pipeline.orderedSupportFacetIds.map((supportFacetId) => {
        const support = supportById.get(supportFacetId);
        if (support === undefined)
          throw new Error(
            `validated pipeline references unavailable support "${supportFacetId}"`,
          );
        return support;
      }),
    ),
    ...linkedSupports.filter(
      (support) => !pipelinedIds.has(support.supportFacetId),
    ),
  ];
};

const applyAuthorityClaims = (
  allowedSource: readonly string[],
  deniedSource: readonly string[],
  effectiveClaims: readonly ResolvedClaim[],
): Readonly<{
  allowed: readonly string[];
  denied: readonly string[];
}> => {
  let allowed = [...orderedUnique(allowedSource)];
  let denied = [...orderedUnique(deniedSource)];
  for (const claim of effectiveClaims) {
    if (!claim.target.startsWith("authority.")) continue;
    const effect = claim.target.slice("authority.".length);
    if (claim.value === "allow") {
      denied = denied.filter((candidate) => candidate !== effect);
      if (!allowed.includes(effect)) allowed.push(effect);
    }
    if (claim.value === "deny") {
      allowed = allowed.filter((candidate) => candidate !== effect);
      if (!denied.includes(effect)) denied.push(effect);
    }
  }
  return { allowed, denied };
};

const emitProgram = (
  graph: LoadoutGraph,
  environment: CompilationEnvironment,
  resolutions: readonly ConflictResolution[],
  effectiveClaims: readonly ResolvedClaim[],
): CompiledProgram => {
  const active = graph.activeMechanics[0]!;
  const linkedIds = new Set(graph.links.map((link) => link.supportFacetId));
  const supports = graph.supportFacets.filter((support) =>
    linkedIds.has(support.supportFacetId),
  );
  const semanticSupports = supportsInSemanticOrder(graph, supports);
  const workOrderEmissions = supports
    .flatMap((support) =>
      emissionsOf(support, "work-order").map((emission) => ({
        supportFacetId: support.supportFacetId,
        emission,
      })),
    )
    .sort(
      (left, right) =>
        left.emission.order - right.emission.order ||
        compareText(left.emission.emissionId, right.emission.emissionId) ||
        compareText(left.supportFacetId, right.supportFacetId),
    );
  const listField = (field: WorkOrderListField): readonly string[] => [
    ...active.workOrder[field],
    ...workOrderEmissions
      .filter((entry) => entry.emission.field === field)
      .flatMap((entry) => entry.emission.values),
  ];
  const permissionEmissions = supports.flatMap((support) =>
    emissionsOf(support, "permission-guard"),
  );
  const schemaEmissions = supports.flatMap((support) =>
    emissionsOf(support, "evidence-schema").map((emission) => ({
      supportFacetId: support.supportFacetId,
      emission,
    })),
  );
  const outputContract =
    [...schemaEmissions]
      .reverse()
      .find((entry) => entry.emission.outputContract !== undefined)?.emission
      .outputContract ?? active.workOrder.outputContract;
  const claimedOperations = applyAuthorityClaims(
    orderedUnique([
      ...active.workOrder.allowedOperations,
      ...permissionEmissions.flatMap((emission) => emission.allowedOperations),
    ]),
    orderedUnique([
      ...active.workOrder.prohibitedOperations,
      ...permissionEmissions.flatMap(
        (emission) => emission.prohibitedOperations,
      ),
    ]),
    effectiveClaims,
  );
  const workOrder: WorkOrder = {
    workOrderId: active.workOrder.workOrderId,
    objective: active.workOrder.objective,
    acceptanceCriteria: listField("acceptanceCriteria"),
    knownFacts: listField("knownFacts"),
    decisions: listField("decisions"),
    constraints: listField("constraints"),
    nonGoals: listField("nonGoals"),
    repo: environment.repo,
    baseCommit: environment.baseCommit,
    allowedOperations: claimedOperations.allowed,
    prohibitedOperations: claimedOperations.denied,
    requiredEvidence: orderedUnique([
      ...active.workOrder.requiredEvidence,
      ...supports.flatMap((support) => support.evidenceRequirements),
    ]),
    outputContract,
  };
  const guardEmissions = supports.flatMap((support) =>
    emissionsOf(support, "statechart-gate").map((emission) => ({
      supportFacetId: support.supportFacetId,
      emission,
    })),
  );
  const claimedAuthority = applyAuthorityClaims(
    orderedUnique([
      ...active.authorityEnvelope.allowedEffects,
      ...permissionEmissions.flatMap((emission) => emission.allowedEffects),
    ]),
    orderedUnique([
      ...active.authorityEnvelope.deniedEffects,
      ...permissionEmissions.flatMap((emission) => emission.deniedEffects),
    ]),
    effectiveClaims,
  );
  const authorityEnvelope = {
    ...active.authorityEnvelope,
    allowedEffects: claimedAuthority.allowed,
    deniedEffects: claimedAuthority.denied,
    requiredEvidence: orderedUnique([
      ...active.authorityEnvelope.requiredEvidence,
    ]),
    revocationConditions: orderedUnique([
      ...(active.authorityEnvelope.revocationConditions ?? []).map((value) =>
        canonicalStringify(value),
      ),
      ...guardEmissions.map((entry) =>
        canonicalStringify(entry.emission.authorityRevocationCondition),
      ),
    ]).map(
      (value) => JSON.parse(value) as { registryId: string; version: number },
    ),
  };
  let inspection = active.inspection;
  for (const support of supports)
    inspection = appendInspection(inspection, support.inspection);
  const groupForSupport = new Map(
    graph.links.map((link) => [link.supportFacetId, link.linkGroupId]),
  );

  const program: CompiledProgram = {
    schemaVersion: 1,
    compilerVersion: "1",
    loadoutId: graph.loadoutId,
    phenotype: {
      identityId: graph.identity.identityId,
      identityVersion: graph.identity.version,
      roleId: graph.role.roleId,
      roleVersion: graph.role.version,
      activeMechanicIds: graph.activeMechanics.map(
        (mechanic) => mechanic.activeMechanicId,
      ),
      linkedSupportFacetIds: supports.map((support) => support.supportFacetId),
      semantics: applySemantics(active, semanticSupports),
      consumedCapabilities: [
        ...orderedUnique([
          ...active.requiredCapabilities,
          ...supports.flatMap((support) => support.requiredCapabilities),
        ]),
      ].sort(compareText),
      // PolarAxis v1 is carried as typed, inspectable input. Seiri does not
      // consume it, so the compiler performs no policy evaluation here.
      polarAxes: graph.polarAxes,
    },
    workOrder,
    authorityEnvelope,
    cadences: supports.flatMap((support) =>
      emissionsOf(support, "cadence").map((emission) => ({
        supportFacetId: support.supportFacetId,
        cadenceId: emission.cadenceId,
        scheduleId: emission.scheduleId,
        queuedScheduleId: emission.queuedScheduleId,
        queuedDelayMs: emission.queuedDelayMs,
        cadence: emission.cadence,
        cancelOn: emission.cancelOn,
      })),
    ),
    statechartGuards: guardEmissions.map((entry) => ({
      supportFacetId: entry.supportFacetId,
      activationCondition: entry.emission.activationCondition,
      interruptionCondition: entry.emission.interruptionCondition,
    })),
    schemas: schemaEmissions.map((entry) => ({
      supportFacetId: entry.supportFacetId,
      schemaId: entry.emission.schemaId,
      schema: entry.emission.schema,
    })),
    hooks: supports.flatMap((support) =>
      emissionsOf(support, "hook").map((emission) => ({
        supportFacetId: support.supportFacetId,
        hookId: emission.hookId,
        event: emission.event,
      })),
    ),
    verificationPlan: supports.flatMap((support) =>
      emissionsOf(support, "verifier-episode").map((emission) => ({
        supportFacetId: support.supportFacetId,
        episodeId: emission.episodeId,
        subject: emission.subject,
        required: emission.required,
      })),
    ),
    promptFragments: supports.flatMap((support) =>
      emissionsOf(support, "prompt-fragment").map((emission) => emission.text),
    ),
    supportCosts: supports.map((support) => ({
      supportFacetId: support.supportFacetId,
      ...support.cost,
    })),
    resourceMultiplier: supports.reduce(
      (total, support) => total * support.resourceMultiplier,
      1,
    ),
    resourceModel: graph.resourceModel,
    ambientEffects: graph.ambientEffects,
    explicitPipelines: graph.explicitPipelines,
    effectiveClaims,
    componentManifest: [
      ...graph.activeMechanics.map((mechanic) => ({
        componentKind: "active-mechanic" as const,
        componentId: mechanic.activeMechanicId,
        version: mechanic.version,
        mechanismTypes: ["work-order" as const],
      })),
      ...supports.map((support) => ({
        componentKind: "support-facet" as const,
        componentId: support.supportFacetId,
        version: support.version,
        ...(groupForSupport.get(support.supportFacetId) === undefined
          ? {}
          : { linkGroupId: groupForSupport.get(support.supportFacetId)! }),
        mechanismTypes: [
          ...new Set(support.emissions.map((emission) => emission.kind)),
        ].sort(compareText),
      })),
      ...graph.ambientEffects.map((effect) => ({
        componentKind: "ambient-effect" as const,
        componentId: effect.ambientEffectId,
        version: effect.version,
        mechanismTypes: [
          ...new Set(effect.emissions.map((emission) => emission.kind)),
        ].sort(compareText),
      })),
    ],
    inspection,
    trace: {
      steps: [
        "1 resolve phenotype",
        "2 type-check links",
        "3 resolve precedence and commutativity",
        "4 emit program",
      ],
      precedence: COMPOSITION_PRECEDENCE,
      conflictResolutions: resolutions,
    },
  };
  return normalizeCompiledProgram(program);
};

export const compileLoadout = (
  source: LoadoutGraph,
  environment: CompilationEnvironment,
): CompileResult => {
  let graph: LoadoutGraph;
  try {
    graph = normalizeLoadoutGraph(source);
  } catch (error) {
    return {
      ok: false,
      diagnostics: [
        invalid(
          error instanceof Error ? error.message : "normalization failed",
        ),
      ],
    };
  }
  const claimResult = resolveClaims(graph);
  const diagnostics = [
    ...graphDiagnostics(graph),
    ...compileLinkDiagnostics(graph, environment),
    ...conflictDiagnostics(graph),
    ...claimResult.diagnostics,
  ].sort((left, right) =>
    compareText(
      `${left.code}\u0000${left.message}`,
      `${right.code}\u0000${right.message}`,
    ),
  );
  if (diagnostics.length > 0) return { ok: false, diagnostics };
  const program = emitProgram(
    graph,
    environment,
    claimResult.resolutions,
    claimResult.effectiveClaims,
  );
  return {
    ok: true,
    program,
    semanticHash: semanticHash(program),
    diagnostics: [],
  };
};

export const compileEditableView = (
  source: EditableView,
  environment: CompilationEnvironment,
): CompileResult => {
  try {
    return compileLoadout(loadoutFromEditableView(source), environment);
  } catch (error) {
    return {
      ok: false,
      diagnostics: [
        invalid(
          error instanceof Error ? error.message : "view decoding failed",
        ),
      ],
    };
  }
};

export const requireCompiled = (result: CompileResult): CompiledProgram => {
  if (!result.ok)
    throw new Error(
      result.diagnostics.map((entry) => entry.message).join("\n"),
    );
  return result.program;
};

export const withLinkedSupports = (
  source: LoadoutGraph,
  supportFacetIds: readonly string[],
): LoadoutGraph => {
  const selected = new Set(supportFacetIds);
  const links = source.links.filter((link) =>
    selected.has(link.supportFacetId),
  );
  const linkIds = new Set(links.map((link) => link.linkId));
  return normalizeLoadoutGraph({
    ...source,
    links,
    linkGroups: source.linkGroups.map((group) => ({
      ...group,
      linkIds: group.linkIds.filter((linkId) => linkIds.has(linkId)),
    })),
    explicitPipelines: source.explicitPipelines.filter((pipeline) =>
      pipeline.orderedSupportFacetIds.every((id) => selected.has(id)),
    ),
  });
};
