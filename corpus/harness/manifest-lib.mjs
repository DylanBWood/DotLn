import { relative } from "node:path";
import {
  CORPUS_ROOT,
  PINNED_BASE_COMMIT,
  RECORDED_SEED,
  WORK_ORDER_ID,
  fixtureDescriptor,
  jsonBytes,
  sha256,
} from "./wo101-support.mjs";
import {
  HAND_COMPUTED_COMMAND_VECTOR,
  PUBLISHED_VECTOR_SOURCE,
} from "./id-corpus-lib.mjs";
import {
  MATCHING_TABLE_ALPHABET,
  PREDICATE_REGISTRY_DATA,
  PROGRAM_ATOM_ALPHABET,
  PROGRAM_BOUNDS,
} from "./program-corpus-lib.mjs";

export const TOOLCHAIN_PROFILE = Object.freeze({
  node: "v22.2.0",
  npm: "10.8.0",
  typescript: "5.4.5",
  platform: "darwin",
  architecture: "arm64",
  osKernel: "Darwin 24.6.0",
});

export const RUN_LOG_PATH = `corpus/manifests/runs/WO-101-${PINNED_BASE_COMMIT}.log`;

function fixtureDescriptors(files) {
  return files
    .map((file) => fixtureDescriptor(file.relativePath, file.bytes, file.rows))
    .sort((left, right) => left.path.localeCompare(right.path));
}

function total(descriptors, field) {
  return descriptors.reduce((sum, descriptor) => sum + descriptor[field], 0);
}

function cartesianKeys(axes, prefix = []) {
  const entries = Object.entries(axes);
  if (entries.length === 0) return [JSON.stringify(prefix)];
  const [[name, values], ...tail] = entries;
  return values.flatMap((value) =>
    cartesianKeys(Object.fromEntries(tail), [...prefix, [name, value]]),
  );
}

function observedCoverage(rows, axes, prefixField) {
  const expected = new Set(cartesianKeys(axes));
  const observed = new Map();
  for (const row of rows.filter(
    (candidate) => candidate.dimensions.event === undefined,
  )) {
    const prefix =
      prefixField === undefined ? [] : [[prefixField, row[prefixField]]];
    const key = JSON.stringify([
      ...prefix,
      ...Object.keys(row.dimensions).map((name) => [
        name,
        row.dimensions[name],
      ]),
    ]);
    observed.set(key, (observed.get(key) ?? 0) + 1);
  }
  const missing = [...expected].filter((key) => !observed.has(key));
  const unexpected = [...observed].filter(([key]) => !expected.has(key));
  const duplicates = [...observed.values()].reduce(
    (sum, count) => sum + Math.max(0, count - 1),
    0,
  );
  return {
    distinctCartesianCells: expected.size,
    observedDistinctCells: observed.size,
    observedRows: [...observed.values()].reduce((sum, count) => sum + count, 0),
    rowsPerCell:
      observed.size === expected.size &&
      missing.length === 0 &&
      unexpected.length === 0 &&
      duplicates === 0
        ? 1
        : null,
    missingCells: missing.length,
    duplicateCells: duplicates,
    unexpectedCells: unexpected.length,
  };
}

function cellCoverage(program) {
  const axes = {
    eventType: program.summary.invokeTruthTable.levels.eventType,
    correlation: program.summary.invokeTruthTable.levels.correlationId,
    commandId: program.summary.invokeTruthTable.levels.commandId,
    payloadShape: program.summary.invokeTruthTable.levels.payloadShape,
  };
  const invoke = observedCoverage(program.invokeRows, axes);
  const awaitAxes = {
    patternMode: MATCHING_TABLE_ALPHABET.awaitPatternModes.map(
      (mode) => mode.id,
    ),
    ...axes,
  };
  const awaitTable = observedCoverage(
    program.awaitRows,
    awaitAxes,
    "patternMode",
  );
  if (
    invoke.missingCells !== 0 ||
    invoke.duplicateCells !== 0 ||
    invoke.unexpectedCells !== 0
  )
    throw new Error(
      `Invoke factorial coverage drift: ${JSON.stringify(invoke)}`,
    );
  if (
    awaitTable.missingCells !== 0 ||
    awaitTable.duplicateCells !== 0 ||
    awaitTable.unexpectedCells !== 0
  )
    throw new Error(
      `Await factorial coverage drift: ${JSON.stringify(awaitTable)}`,
    );
  return {
    invoke: {
      ...invoke,
      separateNoEventRows: program.summary.invokeTruthTable.noEventCells,
    },
    await: {
      ...awaitTable,
      separateNoEventRows: program.summary.awaitTruthTable.noEventCells,
    },
  };
}

export function buildManifest(program, ids) {
  const programFixtures = fixtureDescriptors(program.files);
  const idFixtures = fixtureDescriptors(ids.files);
  const allFixtures = [...programFixtures, ...idFixtures].sort((left, right) =>
    left.path.localeCompare(right.path),
  );
  const manifest = {
    schemaVersion: 1,
    workOrderId: WORK_ORDER_ID,
    corpusVersion: 1,
    pinnedBaseCommit: PINNED_BASE_COMMIT,
    seeds: { program: RECORDED_SEED, ids: RECORDED_SEED },
    generators: {
      program: "corpus/harness/generate-program-corpus.mjs",
      ids: "corpus/harness/generate-id-corpus.mjs",
      modes: ["--write", "--check"],
    },
    program: {
      bounds: PROGRAM_BOUNDS,
      atomAlphabet: PROGRAM_ATOM_ALPHABET,
      matchingTableAlphabet: MATCHING_TABLE_ALPHABET,
      predicateRegistry: {
        data: PREDICATE_REGISTRY_DATA,
        sha256: sha256(jsonBytes(PREDICATE_REGISTRY_DATA)),
      },
      counts: program.summary,
      cellCoverage: cellCoverage(program),
      committedBudget: {
        maximumFiles: 8,
        maximumRows: 2_000,
        maximumBytesPerFile: 8_388_608,
        maximumTotalBytes: 16_777_216,
        fullEnumerationPolicy:
          "All ASTs and execution contexts regenerate from seed and run in the harness; only a root-kind-stratified golden sample is committed.",
      },
    },
    ids: {
      algorithm: "FNV-1a-64 over UTF-8 bytes, lowercase 16-hex output",
      referenceImplementation:
        "independent unsigned 32-bit high/low pair arithmetic using Buffer UTF-8 encoding",
      publishedVectorSource: PUBLISHED_VECTOR_SOURCE,
      handComputedCommandAnchor: HAND_COMPUTED_COMMAND_VECTOR,
      normalizationPolicy:
        "Byte-honest: no Unicode normalization; paired NFC and NFD inputs are expected to hash differently.",
      counts: ids.summary,
      committedBudget: {
        maximumFiles: 2,
        maximumRows: 5_000,
        maximumBytesPerFile: 12_582_912,
        maximumTotalBytes: 16_777_216,
      },
    },
    fixtures: allFixtures,
    fixtureTotals: {
      files: allFixtures.length,
      rows: total(allFixtures, "rows"),
      bytes: total(allFixtures, "bytes"),
    },
    toolchainProfile: TOOLCHAIN_PROFILE,
    evidence: {
      runLog: RUN_LOG_PATH,
      runLogCommitMeaning:
        "The filename keys the run to the pinned base commit because implementation evidence is captured before the final reviewed commit exists.",
      findings: "corpus/manifests/findings-WO-101.md",
    },
    layoutExtension: {
      generatedCorpusRoot: relative(CORPUS_ROOT, CORPUS_ROOT) || ".",
      architectureSyncRequired:
        "docs/product/03-architecture.md §Corpus policy requires a later authorized documentation pass.",
    },
  };

  const programBytes = total(programFixtures, "bytes");
  const idBytes = total(idFixtures, "bytes");
  if (
    programFixtures.length > manifest.program.committedBudget.maximumFiles ||
    programBytes > manifest.program.committedBudget.maximumTotalBytes ||
    programFixtures.some(
      (file) =>
        file.bytes > manifest.program.committedBudget.maximumBytesPerFile,
    ) ||
    total(programFixtures, "rows") >
      manifest.program.committedBudget.maximumRows
  )
    throw new Error("program fixtures exceed committed budget");
  if (
    idFixtures.length > manifest.ids.committedBudget.maximumFiles ||
    idBytes > manifest.ids.committedBudget.maximumTotalBytes ||
    idFixtures.some(
      (file) => file.bytes > manifest.ids.committedBudget.maximumBytesPerFile,
    ) ||
    total(idFixtures, "rows") > manifest.ids.committedBudget.maximumRows
  )
    throw new Error("id fixtures exceed committed budget");
  return manifest;
}
