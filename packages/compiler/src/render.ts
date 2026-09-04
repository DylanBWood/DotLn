import { canonicalStringify, semanticHash } from "./normalize.js";
import type {
  CompileCorrection,
  CompileDiagnostic,
  CompiledProgram,
  CompiledSupportCost,
  InspectionProjection,
} from "./types.js";

const renderCorrection = (correction: CompileCorrection): string => {
  switch (correction.kind) {
    case "provide-capability":
      return `provide capability "${correction.capability}"`;
    case "unequip-support":
      return `unequip support "${correction.supportFacetId}" from link group "${correction.linkGroupId}"`;
    case "link-compatible-active":
      return `link support "${correction.supportFacetId}" to an active exposing one of [${correction.supportedTags.join(", ")}]`;
    case "declare-explicit-pipeline":
      return `declare an explicit pipeline for [${correction.supportFacetIds.join(", ")}] in link group "${correction.linkGroupId}"`;
  }
};

export const renderDiagnostic = (value: CompileDiagnostic): string =>
  [
    value.message,
    ...value.corrections.map(
      (correction, index) =>
        `CORRECTION ${index + 1}: ${renderCorrection(correction)}`,
    ),
  ].join("\n");

const diffLines = (
  before: readonly string[],
  after: readonly string[],
): readonly string[] => {
  const additions = after
    .filter((value) => !before.includes(value))
    .map((value) => `+ ${value}`);
  const removals = before
    .filter((value) => !after.includes(value))
    .map((value) => `- ${value}`);
  return additions.length + removals.length === 0
    ? ["  (no change)"]
    : [...additions, ...removals];
};

const emptyInspection = (
  reference: InspectionProjection,
): InspectionProjection => ({
  ...reference,
  grants: [],
  restrictions: [],
  obligations: [],
  passive: [],
  pulse: [],
  interrupt: [],
});

const costLine = (value: CompiledSupportCost): string =>
  `${value.supportFacetId} — ${value.mechanismType}; prompt=${value.promptTokens} tokens; runtime=${value.runtimeCost.quantity} ${value.runtimeCost.unit}; episodes=${value.extraEpisodes}`;

const costDiffLines = (
  before: readonly CompiledSupportCost[],
  after: readonly CompiledSupportCost[],
): readonly string[] => {
  const beforeById = new Map(
    before.map((value) => [value.supportFacetId, canonicalStringify(value)]),
  );
  const afterById = new Map(
    after.map((value) => [value.supportFacetId, canonicalStringify(value)]),
  );
  const additions = after
    .filter(
      (value) =>
        beforeById.get(value.supportFacetId) !== canonicalStringify(value),
    )
    .map((value) => `+ ${costLine(value)}`);
  const removals = before
    .filter(
      (value) =>
        afterById.get(value.supportFacetId) !== canonicalStringify(value),
    )
    .map((value) => `- ${costLine(value)}`);
  return additions.length + removals.length === 0
    ? ["  (no change)"]
    : [...additions, ...removals];
};

export const renderCompiledDiff = (
  before: CompiledProgram | undefined,
  after: CompiledProgram | undefined,
): string => {
  const reference = after?.inspection ?? before?.inspection;
  if (reference === undefined)
    throw new Error("compiled diff requires a before or after program");
  const left = before?.inspection ?? emptyInspection(reference);
  const right = after?.inspection ?? emptyInspection(reference);
  const sections: ReadonlyArray<
    readonly [
      string,
      keyof Pick<
        InspectionProjection,
        | "grants"
        | "restrictions"
        | "obligations"
        | "passive"
        | "pulse"
        | "interrupt"
      >,
    ]
  > = [
    ["GRANTS", "grants"],
    ["RESTRICTIONS", "restrictions"],
    ["OBLIGATION", "obligations"],
    ["PASSIVE", "passive"],
    ["PULSE", "pulse"],
    ["INTERRUPT", "interrupt"],
  ];
  return [
    `${reference.originalTerm} / ${reference.translation} / ${reference.kanji}`,
    `${reference.rpgTitle} — COMPILED DIFF`,
    "",
    ...sections.flatMap(([heading, field]) => [
      heading,
      ...diffLines(left[field], right[field]),
      "",
    ]),
    "COST",
    ...costDiffLines(before?.supportCosts ?? [], after?.supportCosts ?? []),
    "",
    "SEMANTIC HASH",
    `  before=${before === undefined ? "none" : semanticHash(before)}`,
    `  after=${after === undefined ? "none" : semanticHash(after)}`,
  ].join("\n");
};

export const renderViewHashes = (
  values: readonly Readonly<{ view: string; semanticHash: string }>[],
): string =>
  [
    ...values.map((value) => `${value.view}=${value.semanticHash}`),
    `views=${new Set(values.map((value) => value.semanticHash)).size === 1 ? "equivalent" : "different"}`,
  ].join("\n");
