import test from "node:test";
import assert from "node:assert/strict";
import {
  COMPOSITION_PRECEDENCE,
  authorityGrantRegistryHash,
  canonicalStringify,
  compileEditableView,
  compileLoadout,
  decodeCodeDsl,
  decodeFunctionTable,
  decodeStatechartJson,
  defineLoadout,
  encodeCodeDsl,
  encodeFunctionTable,
  encodeStatechartJson,
  functionTableFromLoadout,
  normalizeAuthorityGrants,
  normalizeCompiledProgram,
  normalizeLoadoutGraph,
  projectAuthorityInspection,
  renderCompiledDiff,
  renderDiagnostic,
  requireCompiled,
  seiriEnvironment,
  seiriLoadout,
  semanticHash,
  statechartJsonFromLoadout,
  withLinkedSupports,
  type AuthorityGrant,
  type CompilationEnvironment,
  type LoadoutGraph,
  type PermissionEmission,
  type SupportFacet,
} from "../src/index.js";
import {
  authorityFixture,
  authorityGrant,
  authoritySupport,
} from "./authority-fixture.js";

const environment = (
  registry: readonly AuthorityGrant[] = [],
): CompilationEnvironment => ({
  ...seiriEnvironment(),
  authorityGrantRegistry: registry,
});
const compile = (
  graph: LoadoutGraph,
  registry: readonly AuthorityGrant[] = [],
) => compileLoadout(graph, environment(registry));
const program = (
  graph: LoadoutGraph,
  registry: readonly AuthorityGrant[] = [],
) => requireCompiled(compile(graph, registry));
const emission = (patch: Partial<PermissionEmission>): SupportFacet => ({
  ...authoritySupport("support.emission"),
  claims: [],
  emissions: [
    {
      kind: "permission-guard",
      emissionId: "permission.fixture",
      allowedEffects: [],
      deniedEffects: [],
      allowedOperations: [],
      prohibitedOperations: [],
      ...patch,
    },
  ],
});

test("WO-042 AC1 widening claims and both permission emission paths reject with actionable diagnostics", async (t) => {
  for (const [name, support, effect, id, baseList] of [
    [
      "VER-001 F2 base denial",
      authoritySupport(
        "support.f2",
        "safety-invariants",
        "allow",
        "repo.delete",
      ),
      "repo.delete",
      "support.f2.claim",
      "authorityEnvelope.allowedEffects",
    ],
    [
      "absent base allowance",
      authoritySupport(
        "support.absent",
        "hard-permissions",
        "allow",
        "remote.send",
      ),
      "remote.send",
      "support.absent.claim",
      "authorityEnvelope.allowedEffects",
    ],
    [
      "emitted effect",
      emission({ allowedEffects: ["repo.delete"] }),
      "repo.delete",
      "permission.fixture",
      "authorityEnvelope.allowedEffects",
    ],
    [
      "emitted operation",
      emission({ allowedOperations: ["repo.delete"] }),
      "repo.delete",
      "permission.fixture",
      "workOrder.allowedOperations",
    ],
  ] as const) {
    await t.test(name, () => {
      const graph = authorityFixture([support]);
      const result = compile(graph);
      assert.equal(result.ok, false);
      if (result.ok) assert.fail("support widened authority");
      const found = result.diagnostics.find(
        (entry) =>
          entry.code === "AUTHORITY WIDENING" &&
          entry.message.includes(baseList),
      );
      assert.ok(found);
      for (const token of [support.supportFacetId, id, effect, baseList])
        assert.ok(found.message.includes(token));
      assert.deepEqual(found.corrections, [
        {
          kind: "unequip-support",
          supportFacetId: support.supportFacetId,
          linkGroupId: "fixture.authority",
        },
        { kind: "declare-authority-grant", effect },
      ]);
      assert.match(
        renderDiagnostic(found),
        /CORRECTION 2: declare a host-admitted authority grant/u,
      );
      assert.equal(
        compile(withLinkedSupports(graph, [])).ok,
        true,
        "unequipped catalog entries are inert",
      );
      assert.equal(
        compile({ ...graph, authorityGrants: [authorityGrant] }, [
          authorityGrant,
        ]).ok,
        false,
        "a grant never launders a widening support",
      );
    });
  }
});

test("WO-042 AC1 an allow claim must respect the independent base operation list and both base denials", () => {
  for (const field of [
    "allowedOperations",
    "prohibitedOperations",
    "deniedEffects",
  ] as const) {
    const graph = authorityFixture([
      authoritySupport("allow", "voice", "allow"),
    ]);
    const active = graph.activeMechanics[0]!;
    const changed = {
      ...graph,
      activeMechanics: [
        {
          ...active,
          workOrder: {
            ...active.workOrder,
            ...(field === "allowedOperations" ? { allowedOperations: [] } : {}),
            ...(field === "prohibitedOperations"
              ? { prohibitedOperations: ["repo.inspect"] }
              : {}),
          },
          authorityEnvelope: {
            ...active.authorityEnvelope,
            ...(field === "deniedEffects"
              ? { deniedEffects: ["repo.inspect"] }
              : {}),
          },
        },
      ],
    };
    assert.equal(compile(changed).ok, false, field);
  }
});

test("WO-042 AC2 a support denial at each of nine layers narrows effects and operations", async (t) => {
  for (const layer of COMPOSITION_PRECEDENCE)
    await t.test(layer, () => {
      const result = program(
        authorityFixture([authoritySupport(`deny.${layer}`, layer)]),
      );
      assert.deepEqual(result.authorityEnvelope.allowedEffects, ["repo.read"]);
      assert.deepEqual(result.workOrder.allowedOperations, ["repo.read"]);
      assert.deepEqual(result.authorityEnvelope.deniedEffects, [
        "repo.delete",
        "repo.write",
        "repo.inspect",
      ]);
      assert.deepEqual(
        result.workOrder.prohibitedOperations,
        result.authorityEnvelope.deniedEffects,
      );
      assert.equal(result.effectiveClaims[0]?.layer, layer);
      assert.equal(result.effectiveClaims[0]?.value, "deny");
      assert.equal(Object.hasOwn(result, "grants"), false);
    });
});

test("WO-042 AC2 only a base allowance can be restored by higher precedence; emission denials narrow", () => {
  const restored = program(
    authorityFixture([
      authoritySupport("lower", "visual-skin"),
      authoritySupport("higher", "safety-invariants", "allow"),
    ]),
  );
  assert.ok(restored.authorityEnvelope.allowedEffects.includes("repo.inspect"));
  assert.ok(!restored.authorityEnvelope.deniedEffects.includes("repo.inspect"));
  assert.deepEqual(
    restored.workOrder.allowedOperations,
    restored.authorityEnvelope.allowedEffects,
  );
  assert.equal(
    restored.trace.conflictResolutions[0]?.winner.supportFacetId,
    "higher",
  );
  assert.equal(
    restored.trace.conflictResolutions[0]?.overridden[0]?.supportFacetId,
    "lower",
  );
  const narrowed = program(
    authorityFixture([
      emission({
        deniedEffects: ["repo.read"],
        prohibitedOperations: ["repo.read"],
      }),
    ]),
  );
  assert.deepEqual(narrowed.authorityEnvelope.allowedEffects, ["repo.inspect"]);
  assert.deepEqual(narrowed.workOrder.allowedOperations, ["repo.inspect"]);
  assert.equal(
    compile(
      authorityFixture([
        emission({
          allowedEffects: ["repo.read"],
          allowedOperations: ["repo.read"],
        }),
      ]),
    ).ok,
    true,
  );
});

test("WO-042 AC3 graph provenance cannot admit itself and every authority-bearing registry field must match", () => {
  const graph = authorityFixture([], [authorityGrant]);
  const forged = compileLoadout(graph, seiriEnvironment());
  assert.equal(forged.ok, false);
  if (forged.ok) assert.fail("unregistered operator claim compiled");
  assert.equal(forged.diagnostics[0]?.code, "AUTHORITY GRANT UNADMITTED");
  const differences: readonly Partial<AuthorityGrant>[] = [
    { grantId: "different" },
    { version: 2 },
    { grantedBy: "host-policy" },
    { effects: ["repo.write"] },
    { operations: ["repo.write"] },
    { operations: [] },
    { repo: "foreign" },
  ];
  for (const difference of differences) {
    const result = compile(graph, [{ ...authorityGrant, ...difference }]);
    assert.equal(result.ok, false, JSON.stringify(difference));
    if (result.ok) assert.fail("mismatched registry entry compiled");
    assert.ok(
      result.diagnostics.some(
        (entry) => entry.code === "AUTHORITY GRANT UNADMITTED",
      ),
    );
  }
});

test("WO-042 AC3 admitted grants apply after claims, keep provenance and reverse to the original hash", () => {
  const base = authorityFixture([
    authoritySupport("deny", "safety-invariants", "deny", "repo.delete"),
  ]);
  const before = program(base);
  for (const grantedBy of [
    "operator",
    "host-policy",
    "registered-repository",
  ] as const) {
    const grant = { ...authorityGrant, grantedBy };
    const after = program({ ...base, authorityGrants: [grant] }, [grant]);
    assert.deepEqual(after.grants, [grant]);
    assert.deepEqual(after.trace.authorityGrants, {
      applied: [grant],
      registryHash: authorityGrantRegistryHash([grant]),
    });
    assert.ok(after.authorityEnvelope.allowedEffects.includes("repo.delete"));
    assert.ok(!after.authorityEnvelope.deniedEffects.includes("repo.delete"));
    assert.ok(after.workOrder.allowedOperations.includes("repo.delete"));
    assert.ok(!after.workOrder.prohibitedOperations.includes("repo.delete"));
    assert.notEqual(semanticHash(after), semanticHash(before));
    assert.equal(
      semanticHash(program({ ...base, authorityGrants: [] }, [grant])),
      semanticHash(before),
    );
    assert.deepEqual(after.inspection, before.inspection);
  }
  assert.equal(
    Object.hasOwn(
      normalizeCompiledProgram({ ...before, grants: [] }),
      "grants",
    ),
    false,
  );
  const { operations: _operations, ...effectOnly } = authorityGrant;
  const effectOnlyProgram = program(authorityFixture([], [effectOnly]), [
    effectOnly,
  ]);
  assert.ok(
    effectOnlyProgram.workOrder.prohibitedOperations.includes("repo.delete"),
  );
});

test("WO-042 AC3 grant validation names malformed fields and rejects duplicate grant ids in either input", () => {
  const malformed: readonly [string, unknown][] = [
    ["grantId", ""],
    ["version", 0],
    ["version", 1.5],
    ["grantedBy", "support"],
    ["effects", ["repo.*"]],
    ["effects", ["repo.*.delete"]],
    ["effects", [""]],
    ["effects", ["repo.\ndelete"]],
    ["effects", "repo.delete"],
    ["operations", ["*"]],
    ["repo", ""],
    ["repo", "foreign"],
    ["reason", undefined],
    ["reason", "   "],
  ];
  for (const [field, value] of malformed) {
    const grant = { ...authorityGrant, [field]: value } as AuthorityGrant;
    const result = compile(authorityFixture([], [grant]), [authorityGrant]);
    assert.equal(result.ok, false, field);
    if (result.ok) assert.fail("malformed grant compiled");
    assert.ok(
      result.diagnostics.some((entry) => entry.message.includes(field)),
      field,
    );
  }
  for (const [grants, registry] of [
    [[authorityGrant, authorityGrant], [authorityGrant]],
    [[authorityGrant], [authorityGrant, authorityGrant]],
  ]) {
    const result = compile(authorityFixture([], grants), registry);
    assert.equal(result.ok, false);
    if (result.ok) assert.fail("duplicate grant compiled");
    assert.match(result.diagnostics[0]!.message, /duplicate grantId/u);
  }
});

test("WO-042 AC3 three editable grant views round-trip, canonicalize grant order and hash equally", () => {
  const second = {
    ...authorityGrant,
    grantId: "fixture.write",
    effects: ["repo.write", "repo.delete", "repo.write"],
    operations: ["repo.write"],
  };
  const graph = authorityFixture([], [second, authorityGrant]);
  const registry = [authorityGrant, second];
  const views = [
    decodeCodeDsl(encodeCodeDsl(defineLoadout(graph))),
    decodeFunctionTable(encodeFunctionTable(functionTableFromLoadout(graph))),
    decodeStatechartJson(
      encodeStatechartJson(statechartJsonFromLoadout(graph)),
    ),
  ];
  const expected = compile(graph, registry);
  for (const view of views)
    assert.deepEqual(
      compileEditableView(view, environment(registry)),
      expected,
    );
  assert.deepEqual(
    normalizeLoadoutGraph(graph).authorityGrants?.map((grant) => grant.grantId),
    ["fixture.delete", "fixture.write"],
  );
  assert.equal(
    authorityGrantRegistryHash(registry),
    authorityGrantRegistryHash([...registry].reverse()),
  );
  assert.deepEqual(normalizeAuthorityGrants(registry)[1]?.effects, [
    "repo.delete",
    "repo.write",
  ]);
  assert.deepEqual(normalizeLoadoutGraph(seiriLoadout).authorityGrants, []);
});

test("WO-042 AC3 exact grants cannot remove a wider wildcard denial", () => {
  const graph = authorityFixture([], [authorityGrant]);
  for (const field of ["effects", "operations"] as const) {
    const active = graph.activeMechanics[0]!;
    const result = compile(
      {
        ...graph,
        activeMechanics: [
          {
            ...active,
            authorityEnvelope: {
              ...active.authorityEnvelope,
              ...(field === "effects" ? { deniedEffects: ["repo.*"] } : {}),
            },
            workOrder: {
              ...active.workOrder,
              ...(field === "operations"
                ? { prohibitedOperations: ["repo.*"] }
                : {}),
            },
          },
        ],
      },
      [authorityGrant],
    );
    assert.equal(result.ok, false);
    if (result.ok) assert.fail("wildcard exception cannot be enforced");
    assert.equal(result.diagnostics[0]?.code, "SEMANTICS UNSUPPORTED");
  }
});

test("WO-042 AC5 projected tooltip uses envelope authority; authored notes remain non-enforcing and immutable", () => {
  const seiri = requireCompiled(
    compileLoadout(seiriLoadout, seiriEnvironment()),
  );
  assert.deepEqual(projectAuthorityInspection(seiri), {
    grants: ["repo.inspect"],
    restrictions: ["repo.delete", "repo.write"],
  });
  const granted = program(authorityFixture([], [authorityGrant]), [
    authorityGrant,
  ]);
  const inspection = canonicalStringify(granted.inspection);
  assert.deepEqual(projectAuthorityInspection(granted), {
    grants: [
      "repo.inspect",
      "repo.read",
      "repo.delete (grant fixture.delete; operator)",
    ],
    restrictions: ["repo.write"],
  });
  const rendered = renderCompiledDiff(undefined, granted);
  assert.match(
    rendered,
    /GRANTS\n\+ repo.inspect\n\+ repo.read\n\+ repo.delete \(grant fixture.delete; operator\)\n\nRESTRICTIONS\n\+ repo.write\n/u,
  );
  assert.match(
    rendered,
    /AUTHORED NOTES \(non-enforcing\)\nAuthored grants\n\+ Inventory every fixture path/u,
  );
  assert.equal(canonicalStringify(granted.inspection), inspection);
});

test("WO-042 AC5 exact contradictory authored tokens reject in both directions, including support notes", () => {
  for (const [field, note] of [
    ["restrictions", "Never `repo.inspect`."],
    ["grants", "Allows (repo.delete)."],
  ] as const) {
    const support = {
      ...authoritySupport("notes"),
      claims: [],
      inspection: { [field]: [note] },
    };
    const result = compile(authorityFixture([support]));
    assert.equal(result.ok, false);
    if (result.ok) assert.fail("contradictory note compiled");
    assert.equal(result.diagnostics[0]?.code, "INSPECTION CONTRADICTION");
    assert.ok(result.diagnostics[0]?.message.includes(`inspection.${field}`));
  }
  assert.equal(
    compile(
      authorityFixture([
        {
          ...authoritySupport("notes"),
          claims: [],
          inspection: {
            restrictions: ["repo.inspectExtra", "prefixrepo.inspect"],
          },
        },
      ]),
    ).ok,
    true,
  );
});

test("WO-042 VER-001 F1 Unicode prose punctuation delimits contradictions in both directions", async (t) => {
  for (const [field, effect] of [
    ["restrictions", "repo.inspect"],
    ["grants", "repo.delete"],
  ] as const) {
    for (const [punctuation, note] of [
      ["em dash", `Authored ${effect}—ever.`],
      ["en dash", `Authored ${effect}–ever.`],
      ["ellipsis", `Authored ${effect}…ever.`],
      ["curly double quotes", `Authored “${effect}”.`],
      ["curly single quotes", `Authored ‘${effect}’.`],
    ] as const) {
      await t.test(`${field}: ${punctuation}`, () => {
        const result = compile(
          authorityFixture([
            {
              ...authoritySupport("notes"),
              claims: [],
              inspection: { [field]: [note] },
            },
          ]),
        );
        assert.equal(result.ok, false, note);
        if (result.ok) assert.fail("Unicode-delimited contradiction compiled");
        assert.equal(result.diagnostics[0]?.code, "INSPECTION CONTRADICTION");
        assert.ok(
          result.diagnostics[0]?.message.includes(`inspection.${field}`),
        );
        assert.ok(result.diagnostics[0]?.message.includes(`\"${effect}\"`));
      });
    }
  }
});

test("WO-042 AC5 punctuation boundaries preserve literal effect ids and exclude longer tokens", () => {
  for (const [field, envelopeField] of [
    ["restrictions", "allowedEffects"],
    ["grants", "deniedEffects"],
  ] as const) {
    for (const effect of [
      "repo.inspect",
      "repo.inspect:dry-run",
      "repo.inspect_extra",
      "repo.inspect+metadata",
      "repo.inspect(v2)",
    ]) {
      const withNotes = (notes: readonly string[]): LoadoutGraph => {
        const graph = authorityFixture([
          {
            ...authoritySupport("notes"),
            claims: [],
            inspection: { [field]: notes },
          },
        ]);
        const active = graph.activeMechanics[0]!;
        return {
          ...graph,
          activeMechanics: [
            {
              ...active,
              authorityEnvelope: {
                ...active.authorityEnvelope,
                [envelopeField]: [effect],
              },
            },
          ],
        };
      };
      const result = compile(withNotes([`Authored “${effect}”.`]));
      assert.equal(result.ok, false, `${field}: ${effect}`);
      if (result.ok) assert.fail("complete literal effect id was not matched");
      assert.equal(result.diagnostics[0]?.code, "INSPECTION CONTRADICTION");
      assert.equal(
        compile(
          withNotes([
            `“prefix${effect}”`,
            `“${effect}Extra”`,
            `“prefix.${effect}”`,
            `“${effect}.child”`,
            `“prefix:${effect}”`,
            `“${effect}:child”`,
          ]),
        ).ok,
        true,
        `${field}: longer tokens containing ${effect} are not exact matches`,
      );
    }
  }
});

test("WO-042 AC7 F-00001 incompatible tags reject even when every capability exists", () => {
  const support = {
    ...authoritySupport("wrong-tags"),
    claims: [],
    supportedTags: ["communicate"] as const,
    requiredCapabilities: ["fixture-repository"],
  };
  const result = compile(authorityFixture([support]));
  assert.equal(result.ok, false);
  if (result.ok) assert.fail("incompatible tags compiled");
  assert.equal(result.diagnostics[0]?.code, "SUPPORT INACTIVE");
  assert.deepEqual(result.diagnostics[0]?.missingCapabilities, []);
  assert.ok(
    result.diagnostics[0]?.corrections.some(
      (entry) => entry.kind === "link-compatible-active",
    ),
  );
});

test("WO-042 AC7 F-00002 equal-precedence incompatible claims reject independent of source order", () => {
  const supports = [
    authoritySupport("first", "voice"),
    authoritySupport("second", "voice", "allow"),
  ];
  for (const order of [supports, [...supports].reverse()]) {
    const result = compile(authorityFixture(order));
    assert.equal(result.ok, false);
    if (result.ok) assert.fail("ambiguous authority compiled");
    assert.equal(result.diagnostics[0]?.code, "AMBIGUOUS SUPPORT CONFLICT");
    assert.match(result.diagnostics[0]!.message, /equal-precedence/u);
  }
});
