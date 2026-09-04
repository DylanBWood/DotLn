import { canonicalStringify, normalizeLoadoutGraph } from "./normalize.js";
import type {
  CodeDslView,
  EditableView,
  FunctionTableRow,
  FunctionTableView,
  LoadoutGraph,
  StatechartJsonView,
} from "./types.js";

const rowKindOrder: Readonly<Record<FunctionTableRow["kind"], number>> = {
  loadout: 0,
  identity: 1,
  role: 2,
  container: 3,
  "active-mechanic": 4,
  "support-facet": 5,
  link: 6,
  "link-group": 7,
  "explicit-pipeline": 8,
  "ambient-effect": 9,
  "resource-model": 10,
  "polar-axis": 11,
};

const compareRows = (left: FunctionTableRow, right: FunctionTableRow): number =>
  rowKindOrder[left.kind] - rowKindOrder[right.kind] ||
  (left.key < right.key ? -1 : left.key > right.key ? 1 : 0);

const one = <K extends FunctionTableRow["kind"]>(
  rows: readonly FunctionTableRow[],
  kind: K,
): Extract<FunctionTableRow, { readonly kind: K }> => {
  const matches = rows.filter(
    (row): row is Extract<FunctionTableRow, { readonly kind: K }> =>
      row.kind === kind,
  );
  if (matches.length !== 1)
    throw new Error(
      `function-table view requires exactly one ${kind} row; observed ${matches.length}`,
    );
  return matches[0]!;
};

const many = <K extends FunctionTableRow["kind"]>(
  rows: readonly FunctionTableRow[],
  kind: K,
): readonly Extract<FunctionTableRow, { readonly kind: K }>[] =>
  rows.filter(
    (row): row is Extract<FunctionTableRow, { readonly kind: K }> =>
      row.kind === kind,
  );

export const defineLoadout = (definition: LoadoutGraph): CodeDslView => ({
  view: "code-dsl",
  schemaVersion: 1,
  definition,
});

export const functionTableFromLoadout = (
  source: LoadoutGraph,
): FunctionTableView => {
  const graph = normalizeLoadoutGraph(source);
  const rows: FunctionTableRow[] = [
    {
      kind: "loadout",
      key: graph.loadoutId,
      value: { schemaVersion: 1, loadoutId: graph.loadoutId },
    },
    {
      kind: "identity",
      key: graph.identity.identityId,
      value: graph.identity,
    },
    { kind: "role", key: graph.role.roleId, value: graph.role },
    ...graph.containers.map((value): FunctionTableRow => ({
      kind: "container",
      key: value.containerId,
      value,
    })),
    ...graph.activeMechanics.map((value): FunctionTableRow => ({
      kind: "active-mechanic",
      key: value.activeMechanicId,
      value,
    })),
    ...graph.supportFacets.map((value): FunctionTableRow => ({
      kind: "support-facet",
      key: value.supportFacetId,
      value,
    })),
    ...graph.links.map((value): FunctionTableRow => ({
      kind: "link",
      key: value.linkId,
      value,
    })),
    ...graph.linkGroups.map((value): FunctionTableRow => ({
      kind: "link-group",
      key: value.linkGroupId,
      value,
    })),
    ...graph.explicitPipelines.map((value): FunctionTableRow => ({
      kind: "explicit-pipeline",
      key: value.pipelineId,
      value,
    })),
    ...graph.ambientEffects.map((value): FunctionTableRow => ({
      kind: "ambient-effect",
      key: value.ambientEffectId,
      value,
    })),
    {
      kind: "resource-model",
      key: graph.resourceModel.resourceModelId,
      value: graph.resourceModel,
    },
    ...graph.polarAxes.map((value): FunctionTableRow => ({
      kind: "polar-axis",
      key: value.polarAxisId,
      value,
    })),
  ];
  return {
    view: "function-table",
    schemaVersion: 1,
    rows: rows.sort(compareRows),
  };
};

export const loadoutFromFunctionTable = (
  source: FunctionTableView,
): LoadoutGraph => {
  const loadout = one(source.rows, "loadout").value;
  return normalizeLoadoutGraph({
    schemaVersion: loadout.schemaVersion,
    loadoutId: loadout.loadoutId,
    identity: one(source.rows, "identity").value,
    role: one(source.rows, "role").value,
    containers: many(source.rows, "container").map((row) => row.value),
    activeMechanics: many(source.rows, "active-mechanic").map(
      (row) => row.value,
    ),
    supportFacets: many(source.rows, "support-facet").map((row) => row.value),
    links: many(source.rows, "link").map((row) => row.value),
    linkGroups: many(source.rows, "link-group").map((row) => row.value),
    explicitPipelines: many(source.rows, "explicit-pipeline").map(
      (row) => row.value,
    ),
    ambientEffects: many(source.rows, "ambient-effect").map((row) => row.value),
    resourceModel: one(source.rows, "resource-model").value,
    polarAxes: many(source.rows, "polar-axis").map((row) => row.value),
  });
};

export const statechartJsonFromLoadout = (
  source: LoadoutGraph,
): StatechartJsonView => {
  const graph = normalizeLoadoutGraph(source);
  return {
    view: "statechart-json",
    schemaVersion: 1,
    id: graph.loadoutId,
    initial: "equipped",
    context: {
      identity: graph.identity,
      role: graph.role,
      resourceModel: graph.resourceModel,
      ambientEffects: graph.ambientEffects,
      polarAxes: graph.polarAxes,
    },
    states: {
      equipped: {
        containers: graph.containers,
        activeMechanics: graph.activeMechanics,
        supportFacets: graph.supportFacets,
        links: graph.links,
        linkGroups: graph.linkGroups,
        explicitPipelines: graph.explicitPipelines,
      },
    },
  };
};

export const loadoutFromStatechartJson = (
  source: StatechartJsonView,
): LoadoutGraph =>
  normalizeLoadoutGraph({
    schemaVersion: source.schemaVersion,
    loadoutId: source.id,
    identity: source.context.identity,
    role: source.context.role,
    containers: source.states.equipped.containers,
    activeMechanics: source.states.equipped.activeMechanics,
    supportFacets: source.states.equipped.supportFacets,
    links: source.states.equipped.links,
    linkGroups: source.states.equipped.linkGroups,
    explicitPipelines: source.states.equipped.explicitPipelines,
    ambientEffects: source.context.ambientEffects,
    resourceModel: source.context.resourceModel,
    polarAxes: source.context.polarAxes,
  });

export const loadoutFromEditableView = (source: EditableView): LoadoutGraph => {
  switch (source.view) {
    case "code-dsl":
      return normalizeLoadoutGraph(source.definition);
    case "function-table":
      return loadoutFromFunctionTable(source);
    case "statechart-json":
      return loadoutFromStatechartJson(source);
  }
};

export const normalizeCodeDslView = (source: CodeDslView): CodeDslView =>
  defineLoadout(normalizeLoadoutGraph(source.definition));

export const normalizeFunctionTableView = (
  source: FunctionTableView,
): FunctionTableView =>
  functionTableFromLoadout(loadoutFromFunctionTable(source));

export const normalizeStatechartJsonView = (
  source: StatechartJsonView,
): StatechartJsonView =>
  statechartJsonFromLoadout(loadoutFromStatechartJson(source));

const parsedObject = (encoded: string): Readonly<Record<string, unknown>> => {
  const parsed: unknown = JSON.parse(encoded);
  if (parsed === null || Array.isArray(parsed) || typeof parsed !== "object")
    throw new Error("editable view must decode to an object");
  return parsed as Readonly<Record<string, unknown>>;
};

export const encodeCodeDsl = (source: CodeDslView): string =>
  canonicalStringify(normalizeCodeDslView(source));

export const decodeCodeDsl = (encoded: string): CodeDslView => {
  const parsed = parsedObject(encoded);
  if (parsed["view"] !== "code-dsl" || parsed["schemaVersion"] !== 1)
    throw new Error("expected code-dsl view schema version 1");
  return normalizeCodeDslView(parsed as unknown as CodeDslView);
};

export const encodeFunctionTable = (source: FunctionTableView): string =>
  canonicalStringify(normalizeFunctionTableView(source));

export const decodeFunctionTable = (encoded: string): FunctionTableView => {
  const parsed = parsedObject(encoded);
  if (parsed["view"] !== "function-table" || parsed["schemaVersion"] !== 1)
    throw new Error("expected function-table view schema version 1");
  return normalizeFunctionTableView(parsed as unknown as FunctionTableView);
};

export const encodeStatechartJson = (source: StatechartJsonView): string =>
  canonicalStringify(normalizeStatechartJsonView(source));

export const decodeStatechartJson = (encoded: string): StatechartJsonView => {
  const parsed = parsedObject(encoded);
  if (parsed["view"] !== "statechart-json" || parsed["schemaVersion"] !== 1)
    throw new Error("expected statechart-json view schema version 1");
  return normalizeStatechartJsonView(parsed as unknown as StatechartJsonView);
};
