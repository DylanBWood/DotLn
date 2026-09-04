import test from "node:test";
import assert from "node:assert/strict";
import {
  compileLoadout,
  renderDiagnostic,
  semanticHash,
  seiriEnvironment,
  seiriLoadout,
  seiriSupports,
  withLinkedSupports,
  type CompiledProgram,
  type LoadoutGraph,
  type PrecedenceLayer,
  type SupportFacet,
} from "../src/index.js";

const expectedPrecedence = [
  "safety-invariants",
  "hard-permissions",
  "statechart-guards",
  "work-order-obligations",
  "resource-budgets",
  "policy-scores-tensions",
  "cadence",
  "voice",
  "visual-skin",
] as const satisfies readonly PrecedenceLayer[];

const compiled = (graph: LoadoutGraph): CompiledProgram => {
  const result = compileLoadout(graph, seiriEnvironment());
  if (!result.ok)
    assert.fail(result.diagnostics.map((entry) => entry.message).join("\n"));
  return result.program;
};

const addLinkedSupport = (
  source: LoadoutGraph,
  support: SupportFacet,
): LoadoutGraph => {
  const linkId = `test.link.${support.supportFacetId}`;
  return {
    ...source,
    containers: source.containers.map((container) => ({
      ...container,
      socketBudget: Math.max(container.socketBudget, source.links.length + 1),
      supportFacetIds: [...container.supportFacetIds, support.supportFacetId],
    })),
    supportFacets: [...source.supportFacets, support],
    links: [
      ...source.links,
      {
        linkId,
        linkGroupId: "seiri.links",
        activeMechanicId: "seiri",
        supportFacetId: support.supportFacetId,
      },
    ],
    linkGroups: source.linkGroups.map((group) => ({
      ...group,
      linkIds: [...group.linkIds, linkId],
    })),
  };
};

const screenshotVerification: SupportFacet = {
  ...seiriSupports.independentVerification,
  supportFacetId: "screenshot-verification",
  name: "Screenshot verification",
  requiredCapabilities: ["browser"],
  semanticsAdded: ["visual witness"],
  emissions: [],
  cost: {
    mechanismType: "verifier-episode",
    promptTokens: 0,
    runtimeCost: { quantity: 1, unit: "browser-captures" },
    extraEpisodes: 0,
  },
};

test("WO-008 AC1 incompatible link emits exact SUPPORT INACTIVE diagnosis, missing capability, and concrete corrections", () => {
  const result = compileLoadout(
    addLinkedSupport(seiriLoadout, screenshotVerification),
    seiriEnvironment(),
  );
  assert.equal(result.ok, false);
  if (result.ok) assert.fail("missing browser unexpectedly compiled");
  assert.deepEqual(result.diagnostics, [
    {
      code: "SUPPORT INACTIVE",
      message:
        'SUPPORT INACTIVE: support "screenshot-verification" linked to active "seiri" is missing capability "browser".',
      activeMechanicId: "seiri",
      supportFacetId: "screenshot-verification",
      linkGroupId: "seiri.links",
      missingCapabilities: ["browser"],
      corrections: [
        { kind: "provide-capability", capability: "browser" },
        {
          kind: "unequip-support",
          supportFacetId: "screenshot-verification",
          linkGroupId: "seiri.links",
        },
      ],
    },
  ]);
  assert.equal(
    renderDiagnostic(result.diagnostics[0]!),
    [
      'SUPPORT INACTIVE: support "screenshot-verification" linked to active "seiri" is missing capability "browser".',
      'CORRECTION 1: provide capability "browser"',
      'CORRECTION 2: unequip support "screenshot-verification" from link group "seiri.links"',
    ].join("\n"),
  );
});

test("WO-008 AC1 supplying the named capability activates the same link", () => {
  const result = compileLoadout(
    addLinkedSupport(seiriLoadout, screenshotVerification),
    {
      ...seiriEnvironment(),
      capabilities: ["fixture-repository", "browser"],
    },
  );
  assert.equal(result.ok, true);
  if (!result.ok) assert.fail("browser capability did not activate support");
  assert.ok(
    result.program.componentManifest.some(
      (entry) => entry.componentId === "screenshot-verification",
    ),
  );
});

const claimSupport = (
  id: string,
  layer: PrecedenceLayer,
  value: string,
  hard = false,
  commutativity: SupportFacet["commutativity"] = "commutative",
): SupportFacet => ({
  ...seiriSupports.repositoryScope,
  supportFacetId: id,
  name: id,
  requiredCapabilities: [],
  semanticsAdded: [],
  emissions: [],
  claims: [
    {
      claimId: `${id}.claim`,
      target: "behavior.mode",
      value,
      layer,
      hard,
    },
  ],
  commutativity,
  inspection: {},
});

const graphWithSupports = (
  supports: readonly SupportFacet[],
  explicitPipelines: LoadoutGraph["explicitPipelines"] = [],
): LoadoutGraph => {
  const links = supports.map((support, index) => ({
    linkId: `conflict.link.${String(index + 1).padStart(2, "0")}`,
    linkGroupId: "conflict.links",
    activeMechanicId: "seiri",
    supportFacetId: support.supportFacetId,
  }));
  return {
    ...seiriLoadout,
    containers: [
      {
        ...seiriLoadout.containers[0]!,
        socketBudget: 12,
        supportFacetIds: supports.map((support) => support.supportFacetId),
      },
    ],
    supportFacets: supports,
    links,
    linkGroups: [
      {
        linkGroupId: "conflict.links",
        containerId: seiriLoadout.containers[0]!.containerId,
        linkIds: links.map((link) => link.linkId),
      },
    ],
    explicitPipelines,
  };
};

test("WO-008 AC3 a constructed nine-way conflict exposes the safety winner and full precedence trace", () => {
  const supports = expectedPrecedence.map((layer, index) =>
    claimSupport(`support.${String(index + 1).padStart(2, "0")}`, layer, layer),
  );
  const program = compiled(graphWithSupports(supports));
  assert.deepEqual(program.trace.precedence, expectedPrecedence);
  assert.deepEqual(program.trace.conflictResolutions, [
    {
      target: "behavior.mode",
      winner: {
        supportFacetId: "support.01",
        claimId: "support.01.claim",
        target: "behavior.mode",
        value: "safety-invariants",
        layer: "safety-invariants",
        hard: false,
      },
      overridden: expectedPrecedence.slice(1).map((layer, index) => ({
        supportFacetId: `support.${String(index + 2).padStart(2, "0")}`,
        claimId: `support.${String(index + 2).padStart(2, "0")}.claim`,
        target: "behavior.mode",
        value: layer,
        layer,
        hard: false,
      })),
    },
  ]);
  assert.deepEqual(program.effectiveClaims, [
    program.trace.conflictResolutions[0]!.winner,
  ]);
});

test("WO-008 AC3 every adjacent precedence pair selects the higher level", async (t) => {
  for (let index = 0; index < expectedPrecedence.length - 1; index += 1) {
    const higher = expectedPrecedence[index]!;
    const lower = expectedPrecedence[index + 1]!;
    await t.test(`${higher} outranks ${lower}`, () => {
      const program = compiled(
        graphWithSupports([
          claimSupport("support.higher", higher, "higher"),
          claimSupport("support.lower", lower, "lower"),
        ]),
      );
      assert.equal(
        program.trace.conflictResolutions[0]?.winner.supportFacetId,
        "support.higher",
      );
      assert.equal(program.effectiveClaims[0]?.value, "higher");
    });
  }
});

test("WO-008 AC3 the winning authority claim governs the emitted runtime envelope", () => {
  const safety = {
    ...claimSupport("support.safety", "safety-invariants", "allow"),
    claims: [
      {
        claimId: "support.safety.claim",
        target: "authority.repo.delete",
        value: "allow",
        layer: "safety-invariants",
        hard: false,
      },
    ],
    emissions: [
      {
        kind: "permission-guard",
        emissionId: "support.safety.permission",
        allowedOperations: [],
        prohibitedOperations: [],
        allowedEffects: ["repo.delete"],
        deniedEffects: [],
      },
    ],
  } as const satisfies SupportFacet;
  const skin = {
    ...claimSupport("support.skin", "visual-skin", "deny"),
    claims: [
      {
        claimId: "support.skin.claim",
        target: "authority.repo.delete",
        value: "deny",
        layer: "visual-skin",
        hard: false,
      },
    ],
    emissions: [
      {
        kind: "permission-guard",
        emissionId: "support.skin.permission",
        allowedOperations: [],
        prohibitedOperations: [],
        allowedEffects: [],
        deniedEffects: ["repo.delete"],
      },
    ],
  } as const satisfies SupportFacet;
  const program = compiled(graphWithSupports([safety, skin]));
  assert.equal(program.effectiveClaims[0]?.supportFacetId, "support.safety");
  assert.ok(program.authorityEnvelope.allowedEffects.includes("repo.delete"));
  assert.ok(!program.authorityEnvelope.deniedEffects.includes("repo.delete"));
  assert.ok(program.workOrder.allowedOperations.includes("repo.delete"));
  assert.ok(!program.workOrder.prohibitedOperations.includes("repo.delete"));
});

test("WO-023 compiler v1 accepts claim-free prefix wildcards and still rejects wildcard precedence", () => {
  const wildcard = {
    ...seiriSupports.repositoryScope,
    supportFacetId: "support.wildcard",
    name: "Wildcard denial",
    requiredCapabilities: [],
    emissions: [
      {
        kind: "permission-guard",
        emissionId: "support.wildcard.permission",
        allowedOperations: ["probe.run:scratch*"],
        prohibitedOperations: ["repo.*"],
        allowedEffects: ["probe.run:scratch*"],
        deniedEffects: ["repo.*"],
      },
    ],
  } as const satisfies SupportFacet;
  const graph = graphWithSupports([wildcard]);
  const result = compileLoadout(graph, seiriEnvironment());
  assert.equal(result.ok, true);
  if (!result.ok) assert.fail("claim-free wildcard authority did not compile");
  assert.ok(result.program.workOrder.prohibitedOperations.includes("repo.*"));
  assert.ok(
    result.program.workOrder.allowedOperations.includes("probe.run:scratch*"),
  );
  assert.ok(result.program.authorityEnvelope.deniedEffects.includes("repo.*"));
  assert.ok(
    result.program.authorityEnvelope.allowedEffects.includes(
      "probe.run:scratch*",
    ),
  );

  const activeWildcardGraph: LoadoutGraph = {
    ...graphWithSupports([]),
    activeMechanics: graphWithSupports([]).activeMechanics.map((active) => ({
      ...active,
      workOrder: {
        ...active.workOrder,
        allowedOperations: ["repo.read*"],
        prohibitedOperations: ["repo.write*", "git.mutate*"],
      },
      authorityEnvelope: {
        ...active.authorityEnvelope,
        allowedEffects: ["repo.read*"],
        deniedEffects: ["repo.write*", "git.mutate*"],
      },
    })),
  };
  const activeResult = compileLoadout(activeWildcardGraph, seiriEnvironment());
  assert.equal(activeResult.ok, true);
  if (!activeResult.ok)
    assert.fail("claim-free active wildcards did not compile");
  assert.deepEqual(activeResult.program.workOrder.allowedOperations, [
    "repo.read*",
  ]);
  assert.deepEqual(activeResult.program.workOrder.prohibitedOperations, [
    "repo.write*",
    "git.mutate*",
  ]);
  assert.deepEqual(activeResult.program.authorityEnvelope.allowedEffects, [
    "repo.read*",
  ]);
  assert.deepEqual(activeResult.program.authorityEnvelope.deniedEffects, [
    "repo.write*",
    "git.mutate*",
  ]);
  assert.equal(
    compileLoadout(withLinkedSupports(graph, []), seiriEnvironment()).ok,
    true,
    "an unequipped catalog definition cannot affect the program",
  );

  const wildcardClaim = {
    ...wildcard,
    emissions: [],
    claims: [
      {
        claimId: "support.wildcard.claim",
        target: "authority.repo.*",
        value: "allow",
        layer: "hard-permissions",
        hard: false,
      },
    ],
  } as const satisfies SupportFacet;
  const claimResult = compileLoadout(
    graphWithSupports([wildcardClaim]),
    seiriEnvironment(),
  );
  assert.equal(claimResult.ok, false);
  if (claimResult.ok)
    assert.fail("wildcard authority claim unexpectedly compiled");
  assert.ok(
    claimResult.diagnostics.some(
      (entry) =>
        entry.code === "SEMANTICS UNSUPPORTED" &&
        entry.message.includes('targets wildcard "repo.*"'),
    ),
  );
  assert.equal(
    compileLoadout(
      withLinkedSupports(graphWithSupports([wildcardClaim]), []),
      seiriEnvironment(),
    ).ok,
    true,
    "an unequipped wildcard claim cannot affect the program",
  );

  const exactClaim = {
    ...claimSupport("support.exact-claim", "hard-permissions", "allow"),
    claims: [
      {
        claimId: "support.exact-claim.claim",
        target: "authority.repo.inspect",
        value: "allow",
        layer: "hard-permissions",
        hard: false,
      },
    ],
  } as const satisfies SupportFacet;
  const mixedResult = compileLoadout(
    graphWithSupports([wildcard, exactClaim]),
    seiriEnvironment(),
  );
  assert.equal(mixedResult.ok, false);
  if (mixedResult.ok)
    assert.fail("wildcard plus authority precedence unexpectedly compiled");
  assert.ok(
    mixedResult.diagnostics.some(
      (entry) =>
        entry.code === "SEMANTICS UNSUPPORTED" &&
        entry.message.includes(
          'cannot combine wildcard authority or operation pattern "repo.*"',
        ),
    ),
  );

  const activeMixedResult = compileLoadout(
    {
      ...activeWildcardGraph,
      containers: graphWithSupports([exactClaim]).containers,
      supportFacets: [exactClaim],
      links: graphWithSupports([exactClaim]).links,
      linkGroups: graphWithSupports([exactClaim]).linkGroups,
    },
    seiriEnvironment(),
  );
  assert.equal(activeMixedResult.ok, false);
  if (activeMixedResult.ok)
    assert.fail("active wildcard plus authority claim unexpectedly compiled");
  assert.ok(
    activeMixedResult.diagnostics.some(
      (entry) =>
        entry.code === "SEMANTICS UNSUPPORTED" &&
        entry.message.includes(
          'wildcard authority or operation pattern "repo.read*" from active',
        ),
    ),
  );
});

test("WO-008 AC3 an unknown precedence layer rejects instead of outranking safety", () => {
  const unsafe = {
    ...claimSupport("support.invalid", "safety-invariants", "unsafe"),
    claims: [
      {
        claimId: "support.invalid.claim",
        target: "behavior.mode",
        value: "unsafe",
        layer: "before-safety",
        hard: false,
      },
    ],
  } as unknown as SupportFacet;
  const result = compileLoadout(
    graphWithSupports([
      claimSupport("support.safety", "safety-invariants", "safe"),
      unsafe,
    ]),
    seiriEnvironment(),
  );
  assert.equal(result.ok, false);
  if (result.ok) assert.fail("unknown precedence layer unexpectedly compiled");
  assert.ok(
    result.diagnostics.some(
      (entry) =>
        entry.code === "INVALID GRAPH" &&
        entry.message.includes('unknown precedence layer "before-safety"'),
    ),
  );
  const catalogOnly = compileLoadout(
    withLinkedSupports(graphWithSupports([unsafe]), []),
    seiriEnvironment(),
  );
  assert.equal(catalogOnly.ok, false);
  if (catalogOnly.ok)
    assert.fail("malformed catalog claim unexpectedly compiled");
  assert.ok(
    catalogOnly.diagnostics.some(
      (entry) =>
        entry.code === "INVALID GRAPH" &&
        entry.message.includes('unknown precedence layer "before-safety"'),
    ),
    "claim shape is validated across the catalog even when the support is unequipped",
  );
});

test("WO-008 AC3 conflicting hard supports reject with both support ids and an exact explanation", () => {
  const result = compileLoadout(
    graphWithSupports([
      claimSupport("hard.allow", "hard-permissions", "allow", true),
      claimSupport("hard.deny", "safety-invariants", "deny", true),
    ]),
    seiriEnvironment(),
  );
  assert.equal(result.ok, false);
  if (result.ok) assert.fail("conflicting hard supports unexpectedly compiled");
  assert.equal(result.diagnostics[0]?.code, "HARD SUPPORT CONFLICT");
  assert.equal(
    result.diagnostics[0]?.message,
    'HARD SUPPORT CONFLICT: supports "hard.allow" and "hard.deny" make incompatible hard claims for "behavior.mode".',
  );
});

test("WO-008 AC3 explicitly incompatible supports reject with concrete unequip corrections", () => {
  const left = {
    ...claimSupport("declared.first", "cadence", "first"),
    conflictsWith: ["declared.second"],
  } as const satisfies SupportFacet;
  const right = claimSupport("declared.second", "voice", "second");
  const result = compileLoadout(
    graphWithSupports([left, right]),
    seiriEnvironment(),
  );
  assert.equal(result.ok, false);
  if (result.ok) assert.fail("declared conflict unexpectedly compiled");
  assert.deepEqual(
    result.diagnostics.find(
      (entry) => entry.code === "DECLARED SUPPORT CONFLICT",
    ),
    {
      code: "DECLARED SUPPORT CONFLICT",
      message:
        'DECLARED SUPPORT CONFLICT: supports "declared.first" and "declared.second" exclude each other in link group "conflict.links".',
      linkGroupId: "conflict.links",
      missingCapabilities: [],
      corrections: [
        {
          kind: "unequip-support",
          supportFacetId: "declared.first",
          linkGroupId: "conflict.links",
        },
        {
          kind: "unequip-support",
          supportFacetId: "declared.second",
          linkGroupId: "conflict.links",
        },
      ],
    },
  );
});

test("WO-008 AC3 unordered non-commuting supports reject and demand an explicit pipeline", () => {
  const supports = [
    claimSupport(
      "ordered.first",
      "cadence",
      "first",
      false,
      "requires-pipeline",
    ),
    claimSupport(
      "ordered.second",
      "voice",
      "second",
      false,
      "requires-pipeline",
    ),
  ];
  const result = compileLoadout(
    graphWithSupports(supports),
    seiriEnvironment(),
  );
  assert.equal(result.ok, false);
  if (result.ok) assert.fail("unordered transforms unexpectedly compiled");
  const nonCommuting = result.diagnostics.find(
    (entry) => entry.code === "NON-COMMUTING SUPPORTS",
  );
  assert.deepEqual(nonCommuting, {
    code: "NON-COMMUTING SUPPORTS",
    message:
      'NON-COMMUTING SUPPORTS: "ordered.first" and "ordered.second" in link group "conflict.links" require an explicit pipeline; link order is not execution order.',
    linkGroupId: "conflict.links",
    missingCapabilities: [],
    corrections: [
      {
        kind: "declare-explicit-pipeline",
        linkGroupId: "conflict.links",
        supportFacetIds: ["ordered.first", "ordered.second"],
      },
    ],
  });
});

test("WO-008 AC3 an explicit non-commuting pipeline governs transform order", () => {
  const supports: readonly SupportFacet[] = [
    {
      ...claimSupport(
        "ordered.first",
        "cadence",
        "first",
        false,
        "requires-pipeline",
      ),
      semanticsModified: [{ from: "inventory", to: "after-first" }],
    },
    {
      ...claimSupport(
        "ordered.second",
        "voice",
        "second",
        false,
        "requires-pipeline",
      ),
      semanticsModified: [{ from: "after-first", to: "after-second" }],
    },
  ];
  const reversed = compiled(
    graphWithSupports(supports, [
      {
        pipelineId: "ordered.transforms",
        linkGroupId: "conflict.links",
        orderedSupportFacetIds: ["ordered.second", "ordered.first"],
      },
    ]),
  );
  const forward = compiled(
    graphWithSupports(supports, [
      {
        pipelineId: "ordered.transforms",
        linkGroupId: "conflict.links",
        orderedSupportFacetIds: ["ordered.first", "ordered.second"],
      },
    ]),
  );
  assert.deepEqual(reversed.explicitPipelines, [
    {
      pipelineId: "ordered.transforms",
      linkGroupId: "conflict.links",
      orderedSupportFacetIds: ["ordered.second", "ordered.first"],
    },
  ]);
  assert.ok(reversed.phenotype.semantics.includes("after-first"));
  assert.ok(!reversed.phenotype.semantics.includes("after-second"));
  assert.ok(forward.phenotype.semantics.includes("after-second"));
  assert.ok(!forward.phenotype.semantics.includes("after-first"));
  assert.notEqual(semanticHash(reversed), semanticHash(forward));
});

test("WO-008 AC3 compiler v1 rejects pipeline-id-controlled inter-pipeline order", () => {
  const supports: readonly SupportFacet[] = [
    {
      ...claimSupport(
        "ordered.first",
        "cadence",
        "first",
        false,
        "requires-pipeline",
      ),
      semanticsModified: [{ from: "inventory", to: "intermediate" }],
    },
    {
      ...claimSupport(
        "ordered.second",
        "voice",
        "second",
        false,
        "requires-pipeline",
      ),
      semanticsModified: [{ from: "intermediate", to: "inventory" }],
    },
  ];
  const result = compileLoadout(
    graphWithSupports(supports, [
      {
        pipelineId: "alpha",
        linkGroupId: "conflict.links",
        orderedSupportFacetIds: ["ordered.first", "ordered.second"],
      },
      {
        pipelineId: "zeta",
        linkGroupId: "conflict.links",
        orderedSupportFacetIds: ["ordered.second", "ordered.first"],
      },
    ]),
    seiriEnvironment(),
  );
  assert.equal(result.ok, false);
  if (result.ok) assert.fail("multiple participating pipelines compiled");
  assert.ok(
    result.diagnostics.some(
      (entry) =>
        entry.code === "SEMANTICS UNSUPPORTED" &&
        entry.message ===
          "SEMANTICS UNSUPPORTED: compiler v1 lowers at most one explicit pipeline in a participating link group; observed 2.",
    ),
  );
});

test("WO-008 AC3 compiler v1 rejects undeclared transform order across link groups", () => {
  const supports = [
    {
      ...claimSupport(
        "cross-group.first",
        "cadence",
        "first",
        false,
        "requires-pipeline",
      ),
      semanticsModified: [{ from: "inventory", to: "cross-group-mid" }],
    },
    {
      ...claimSupport(
        "cross-group.second",
        "voice",
        "second",
        false,
        "requires-pipeline",
      ),
      semanticsModified: [{ from: "cross-group-mid", to: "cross-group-final" }],
    },
  ];
  const source = graphWithSupports(supports);
  const links = source.links.map((link, index) => ({
    ...link,
    linkGroupId: `cross-group.${index + 1}`,
  }));
  const result = compileLoadout(
    {
      ...source,
      links,
      linkGroups: links.map((link) => ({
        linkGroupId: link.linkGroupId,
        containerId: source.containers[0]!.containerId,
        linkIds: [link.linkId],
      })),
    },
    seiriEnvironment(),
  );
  assert.equal(result.ok, false);
  if (result.ok) assert.fail("cross-group transforms unexpectedly compiled");
  assert.ok(
    result.diagnostics.some(
      (entry) =>
        entry.code === "SEMANTICS UNSUPPORTED" &&
        entry.message.includes("at most one participating link group"),
    ),
  );
});

test("WO-008 AC3 commuting support and link permutations normalize identically", () => {
  const graph = graphWithSupports([
    claimSupport("commuting.first", "cadence", "shared"),
    claimSupport("commuting.second", "voice", "shared"),
  ]);
  const left = compileLoadout(graph, seiriEnvironment());
  const right = compileLoadout(
    {
      ...graph,
      supportFacets: [...graph.supportFacets].reverse(),
      links: [...graph.links].reverse(),
      linkGroups: graph.linkGroups.map((group) => ({
        ...group,
        linkIds: [...group.linkIds].reverse(),
      })),
    },
    seiriEnvironment(),
  );
  assert.equal(left.ok, true);
  assert.equal(right.ok, true);
  if (!left.ok || !right.ok) assert.fail("commuting graph did not compile");
  assert.equal(left.semanticHash, right.semanticHash);
  assert.deepEqual(left.program, right.program);
});

test("WO-008 AC4 every compiled Seiri support emits exact mechanism, prompt-token, runtime, and extra-episode costs", () => {
  assert.deepEqual(compiled(seiriLoadout).supportCosts, [
    {
      supportFacetId: "seiri.absence-cadence",
      mechanismType: "statechart-gate",
      promptTokens: 0,
      runtimeCost: {
        quantity: 2,
        unit: "predicate-evaluations-per-pulse",
      },
      extraEpisodes: 0,
    },
    {
      supportFacetId: "seiri.evidence-capture",
      mechanismType: "evidence-schema",
      promptTokens: 0,
      runtimeCost: {
        quantity: 1,
        unit: "schema-validations-per-result",
      },
      extraEpisodes: 0,
    },
    {
      supportFacetId: "seiri.independent-verification",
      mechanismType: "verifier-episode",
      promptTokens: 0,
      runtimeCost: { quantity: 1, unit: "verifier-dispatches" },
      extraEpisodes: 1,
    },
    {
      supportFacetId: "seiri.read-only",
      mechanismType: "permission-guard",
      promptTokens: 0,
      runtimeCost: { quantity: 1, unit: "guard-checks-per-effect" },
      extraEpisodes: 0,
    },
    {
      supportFacetId: "seiri.repo-scope",
      mechanismType: "work-order",
      promptTokens: 0,
      runtimeCost: { quantity: 0, unit: "operations" },
      extraEpisodes: 0,
    },
  ]);
});

test("WO-008 AC4 Seiri lowers to heterogeneous mechanism types", () => {
  const program = compiled(seiriLoadout);
  assert.deepEqual(
    [...new Set(program.supportCosts.map((cost) => cost.mechanismType))].sort(),
    [
      "evidence-schema",
      "permission-guard",
      "statechart-gate",
      "verifier-episode",
      "work-order",
    ],
  );
  assert.deepEqual(
    program.componentManifest
      .filter((entry) => entry.componentKind === "support-facet")
      .map((entry) => [entry.componentId, entry.mechanismTypes]),
    [
      ["seiri.absence-cadence", ["cadence", "statechart-gate"]],
      ["seiri.evidence-capture", ["evidence-schema", "work-order"]],
      ["seiri.independent-verification", ["verifier-episode"]],
      ["seiri.read-only", ["permission-guard", "work-order"]],
      ["seiri.repo-scope", ["work-order"]],
    ],
  );
  assert.deepEqual(
    {
      cadences: program.cadences.map((value) => value.supportFacetId),
      statechartGuards: program.statechartGuards.map(
        (value) => value.supportFacetId,
      ),
      schemas: program.schemas.map((value) => value.supportFacetId),
      verificationPlan: program.verificationPlan.map(
        (value) => value.supportFacetId,
      ),
    },
    {
      cadences: ["seiri.absence-cadence"],
      statechartGuards: ["seiri.absence-cadence"],
      schemas: ["seiri.evidence-capture"],
      verificationPlan: ["seiri.independent-verification"],
    },
  );
});

test("WO-008 compiler reports resource-multiplier overflow as an invalid graph", () => {
  const result = compileLoadout(
    {
      ...seiriLoadout,
      supportFacets: seiriLoadout.supportFacets.map((support, index) =>
        index < 2
          ? { ...support, resourceMultiplier: Number.MAX_VALUE }
          : support,
      ),
    },
    seiriEnvironment(),
  );
  assert.equal(result.ok, false);
  if (result.ok) assert.fail("overflowing multipliers unexpectedly compiled");
  assert.ok(
    result.diagnostics.some(
      (entry) =>
        entry.code === "INVALID GRAPH" &&
        entry.message.includes("exceed finite JSON range"),
    ),
  );
});
