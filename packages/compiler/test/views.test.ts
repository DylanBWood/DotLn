import test from "node:test";
import assert from "node:assert/strict";
import {
  compileEditableView,
  compileLoadout,
  decodeCodeDsl,
  decodeFunctionTable,
  decodeStatechartJson,
  defineLoadout,
  encodeCodeDsl,
  encodeFunctionTable,
  encodeStatechartJson,
  normalizeCodeDslView,
  normalizeFunctionTableView,
  normalizeLoadoutGraph,
  normalizeStatechartJsonView,
  seiriEnvironment,
  seiriLoadout,
  withLinkedSupports,
  type CompiledProgram,
  type EditableView,
  type FunctionTableRow,
  type FunctionTableView,
  type StatechartJsonView,
} from "../src/index.js";

const graph = normalizeLoadoutGraph(seiriLoadout);

// These fixtures are authored in each view's own shape. They do not call the
// production cross-view projection helpers used by the example exports.
const independentFunctionTable: FunctionTableView = {
  view: "function-table",
  schemaVersion: 1,
  rows: [
    ...graph.links
      .map((value): FunctionTableRow => ({
        kind: "link",
        key: value.linkId,
        value,
      }))
      .reverse(),
    {
      kind: "resource-model",
      key: graph.resourceModel.resourceModelId,
      value: graph.resourceModel,
    },
    ...graph.supportFacets
      .map((value): FunctionTableRow => ({
        kind: "support-facet",
        key: value.supportFacetId,
        value,
      }))
      .reverse(),
    {
      kind: "identity",
      key: graph.identity.identityId,
      value: graph.identity,
    },
    ...graph.containers.map((value): FunctionTableRow => ({
      kind: "container",
      key: value.containerId,
      value,
    })),
    ...graph.linkGroups.map((value): FunctionTableRow => ({
      kind: "link-group",
      key: value.linkGroupId,
      value,
    })),
    {
      kind: "role",
      key: graph.role.roleId,
      value: graph.role,
    },
    ...graph.activeMechanics.map((value): FunctionTableRow => ({
      kind: "active-mechanic",
      key: value.activeMechanicId,
      value,
    })),
    {
      kind: "loadout",
      key: graph.loadoutId,
      value: { schemaVersion: 1, loadoutId: graph.loadoutId },
    },
  ],
};

const independentStatechart: StatechartJsonView = {
  view: "statechart-json",
  schemaVersion: 1,
  id: graph.loadoutId,
  initial: "equipped",
  context: {
    identity: graph.identity,
    role: graph.role,
    resourceModel: graph.resourceModel,
    ambientEffects: [],
    polarAxes: [],
  },
  states: {
    equipped: {
      containers: graph.containers,
      activeMechanics: graph.activeMechanics,
      supportFacets: [...graph.supportFacets].reverse(),
      links: [...graph.links].reverse(),
      linkGroups: graph.linkGroups.map((group) => ({
        ...group,
        linkIds: [...group.linkIds].reverse(),
      })),
      explicitPipelines: [],
    },
  },
};

const independentViews: readonly EditableView[] = [
  defineLoadout(seiriLoadout),
  independentFunctionTable,
  independentStatechart,
];

const program = (view: EditableView): CompiledProgram => {
  const result = compileEditableView(view, seiriEnvironment());
  if (!result.ok)
    assert.fail(result.diagnostics.map((entry) => entry.message).join("\n"));
  return result.program;
};

test("WO-008 AC2 code DSL round-trip equals normalize", () => {
  const view = defineLoadout({
    ...seiriLoadout,
    links: [...seiriLoadout.links].reverse(),
  });
  assert.deepEqual(
    decodeCodeDsl(encodeCodeDsl(view)),
    normalizeCodeDslView(view),
  );
});

test("WO-008 AC2 function table round-trip equals normalize", () => {
  assert.deepEqual(
    decodeFunctionTable(encodeFunctionTable(independentFunctionTable)),
    normalizeFunctionTableView(independentFunctionTable),
  );
});

test("WO-008 AC2 statechart JSON round-trip equals normalize", () => {
  assert.deepEqual(
    decodeStatechartJson(encodeStatechartJson(independentStatechart)),
    normalizeStatechartJsonView(independentStatechart),
  );
});

test("WO-008 AC2 normalization is idempotent and canonicalizes set-like link order", () => {
  const once = normalizeLoadoutGraph({
    ...seiriLoadout,
    supportFacets: [...seiriLoadout.supportFacets].reverse(),
    links: [...seiriLoadout.links].reverse(),
  });
  assert.deepEqual(normalizeLoadoutGraph(once), once);
  assert.deepEqual(once, normalizeLoadoutGraph(seiriLoadout));
});

test("WO-008 AC2 normalization makes JSON numbers round-trip safe", () => {
  const negativeZero = {
    ...seiriLoadout,
    supportFacets: seiriLoadout.supportFacets.map((support, index) =>
      index === 0 ? { ...support, resourceMultiplier: -0 } : support,
    ),
  };
  const normalized = normalizeLoadoutGraph(negativeZero);
  const normalizedSupport = normalized.supportFacets.find(
    (support) =>
      support.supportFacetId === seiriLoadout.supportFacets[0]?.supportFacetId,
  );
  assert.equal(normalizedSupport?.resourceMultiplier, 0);
  assert.equal(Object.is(normalizedSupport?.resourceMultiplier, -0), false);
  assert.deepEqual(
    decodeCodeDsl(encodeCodeDsl(defineLoadout(negativeZero))),
    defineLoadout(normalized),
  );
  assert.throws(
    () =>
      normalizeLoadoutGraph({
        ...seiriLoadout,
        supportFacets: seiriLoadout.supportFacets.map((support, index) =>
          index === 0
            ? { ...support, resourceMultiplier: Number.NaN }
            : support,
        ),
      }),
    /canonical JSON requires finite numeric values/u,
  );
});

test("WO-008 AC2 three editable views compile to the same exact semantic hash", () => {
  const results = independentViews.map((view) =>
    compileEditableView(view, seiriEnvironment()),
  );
  for (const result of results) assert.equal(result.ok, true);
  const hashes = results.map((result) =>
    result.ok ? result.semanticHash : "",
  );
  assert.deepEqual(hashes, [
    "fnv1a64:9ca8d0229c6bd8db",
    "fnv1a64:9ca8d0229c6bd8db",
    "fnv1a64:9ca8d0229c6bd8db",
  ]);
  assert.deepEqual(
    program(independentViews[1]!),
    program(independentViews[0]!),
  );
  assert.deepEqual(
    program(independentViews[2]!),
    program(independentViews[0]!),
  );
});

test("WO-008 AC2 a semantic edit changes the hash, preventing a constant or lossy proof", () => {
  const baseline = compileEditableView(
    independentFunctionTable,
    seiriEnvironment(),
  );
  const edited: FunctionTableView = {
    ...independentFunctionTable,
    rows: independentFunctionTable.rows.map((row) =>
      row.kind !== "active-mechanic"
        ? row
        : {
            ...row,
            value: {
              ...row.value,
              workOrder: {
                ...row.value.workOrder,
                objective: "A semantically different objective.",
              },
            },
          },
    ),
  };
  const changed = compileEditableView(edited, seiriEnvironment());
  assert.equal(baseline.ok, true);
  assert.equal(changed.ok, true);
  if (!baseline.ok || !changed.ok) assert.fail("view did not compile");
  assert.notEqual(changed.semanticHash, baseline.semanticHash);
});

test("WO-008 AC2 equipping and unequipping changes the normalized executable program and semantic hash", () => {
  const equipped = compileLoadout(seiriLoadout, seiriEnvironment());
  const withoutScope = compileLoadout(
    withLinkedSupports(
      seiriLoadout,
      seiriLoadout.supportFacets
        .map((support) => support.supportFacetId)
        .filter((supportId) => supportId !== "seiri.repo-scope"),
    ),
    seiriEnvironment(),
  );
  assert.equal(equipped.ok, true);
  assert.equal(withoutScope.ok, true);
  if (!equipped.ok || !withoutScope.ok) assert.fail("Seiri did not compile");
  assert.notEqual(equipped.semanticHash, withoutScope.semanticHash);
  assert.notDeepEqual(equipped.program, withoutScope.program);
  assert.deepEqual(equipped.program.workOrder.constraints, [
    "Inspect only the fixture tree",
    "Do not mutate repository contents",
  ]);
  assert.deepEqual(withoutScope.program.workOrder.constraints, [
    "Do not mutate repository contents",
  ]);
});
