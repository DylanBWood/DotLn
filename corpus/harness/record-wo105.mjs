import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync, writeFileSync } from "node:fs";
import { platform, arch } from "node:os";
import { resolve } from "node:path";
import {
  args,
  BASE,
  brief,
  exactFiles,
  GOLDEN,
  jsonBytes,
  MANIFEST,
  OBSERVATIONS,
  read,
  readJson,
  ROOT,
  SEED,
  sha256,
} from "./wo105-common.mjs";
import { buildStoreFiles, SIZES, DEPTH } from "./generate-store-corpus.mjs";
import { buildTreeFiles, treeFamilies } from "./generate-tree-corpus.mjs";
import {
  assertBaseSources,
  buildGoldenFiles,
} from "./generate-golden-corpus.mjs";
import { storeSweep } from "./truncation-sweep.mjs";
import { skeletonSweep } from "./skeleton-crash-sweep.mjs";

const { seed } = args(process.argv.slice(2), ["write"]);
assert.ok(
  !existsSync(resolve(ROOT, MANIFEST)),
  "recording already exists; use generators --check and sweeps to verify it",
);
assertBaseSources();
const fixtures = {
  ...buildStoreFiles(seed),
  ...buildTreeFiles(seed),
  ...buildGoldenFiles(),
  "corpus/fixtures/skeleton-trees/README.md": read(
    "corpus/fixtures/skeleton-trees/README.md",
  ),
};
exactFiles(fixtures, "write");
const store = storeSweep(seed);
console.log(JSON.stringify(brief("store", store)));
const skeleton = skeletonSweep(seed);
console.log(JSON.stringify(brief("skeleton", skeleton)));
const observations =
  [
    ...store.sweeps,
    ...skeleton.sweeps,
    ...store.families.map((family) => ({
      lane: "store-family",
      seed,
      ...family,
    })),
    ...skeleton.families.map((family) => ({
      lane: "skeleton-family",
      seed,
      ...family,
    })),
  ]
    .map((row) =>
      JSON.stringify({ recording: `WO-105-${BASE.slice(0, 8)}`, ...row }),
    )
    .join("\n") + "\n";
assert.ok(
  Buffer.byteLength(observations) <= 65536,
  "committed observation budget",
);
// Exclusive creation first, and no subsequent rewrites: observations are append-only.
writeFileSync(resolve(ROOT, OBSERVATIONS), observations, { flag: "ax" });
const oracles = [
  "packages/kernel/src/core.ts",
  "packages/kernel/src/store.ts",
  "packages/skeleton/src/scenario.ts",
  "packages/skeleton/src/live-reactor-driver.ts",
  "packages/skeleton/src/reactor.ts",
  "packages/skeleton/fixtures/repo-tree.json",
  "packages/skeleton/fixtures/wo003-decision-traces.json",
];
const manifest = {
  schemaVersion: 1,
  workOrder: "WO-105",
  baseCommit: BASE,
  seed,
  bounds: {
    generatedEventCounts: SIZES,
    appendChainLength: 512,
    deepPayloadDepth: DEPTH,
    treeFamilyCap: 4,
  },
  purpose:
    "Pin the declared crash shapes as compatibility evidence; no discovery, reconciliation, policy or runtime-change claim.",
  scope: {
    store:
      "Every UTF-8 byte offset from 0 through log byte length inclusive, for all six generated fixtures and a freshly run canonical demo.",
    skeleton:
      "Every UTF-8 byte offset of the canonical demo's persisted crash opening, plus complete CRLF and depth-12000 mutations. Each offset calls the shipped runScenario hook. Tree families separately run live/replay; they are not additional crash sweeps.",
    effectAttribution:
      "The declared skeleton shapes contain at most one commandId; adapterEffects and the independent onExecutorClaim callback count its effects. Dispatch retries are separate.",
    findings:
      "A violation fails loudly with its fixture/seed/offset; record it in corpus/manifests/findings-WO-105.md before accepting a changed classification. No runtime repair is authorized.",
    retainedFamilies: ["CRLF", "depth-12000"],
    excludedFamilies: [
      "Malformed physical lines (WO-017 root tests)",
      "Repeated/out-of-order eventId or whole-line duplicates (WO-045 EVENT_ORDER root tests)",
    ],
    duplicates:
      "Generated CommandResult payloads repeat with fresh sequential eventId values; no duplicate physical line is generated.",
    crlfStorage:
      "corpus/fixtures/store/crlf.json contains the exact CRLF log as an escaped JSON string; index.json bytes/sha256 describe the decoded log, while manifest fixture hashes describe file bytes.",
  },
  toolchain: {
    node: process.version,
    npm: execFileSync("npm", ["--version"], { encoding: "utf8" }).trim(),
    typescript: readJson("node_modules/typescript/package.json").version,
    platform: platform(),
    arch: arch(),
    compatibility:
      "Historical profile, not a requirement for byte checks; use the repository's supported Node toolchain.",
  },
  executionLimits: {
    runner: "node corpus/harness/run-wo105.mjs",
    nodeOldSpaceMiB: 512,
    concurrentTestFiles: 1,
    scope:
      "Canonical runner child processes; V8 old-space limit, not a total process RSS guarantee. Root gates use --serial.",
  },
  commands: [
    "npm run build",
    `node corpus/harness/generate-store-corpus.mjs --seed ${SEED} --check`,
    `node corpus/harness/truncation-sweep.mjs --seed ${SEED}`,
    `node corpus/harness/generate-tree-corpus.mjs --seed ${SEED} --check`,
    `node corpus/harness/generate-golden-corpus.mjs --seed ${SEED} --check`,
    `node corpus/harness/skeleton-crash-sweep.mjs --seed ${SEED}`,
    "node --test corpus/harness/wo105-*.test.mjs",
  ],
  regeneration: {
    store: `node corpus/harness/generate-store-corpus.mjs --seed ${SEED} --write`,
    trees: `node corpus/harness/generate-tree-corpus.mjs --seed ${SEED} --write`,
    golden: `node corpus/harness/generate-golden-corpus.mjs --seed ${SEED} --write`,
    rawStoreRecords: `node corpus/harness/truncation-sweep.mjs --seed ${SEED} --records`,
    rawSkeletonRecords: `node corpus/harness/skeleton-crash-sweep.mjs --seed ${SEED} --records`,
    transcript: "node corpus/harness/run-wo105.mjs",
  },
  retention: {
    observationBudgetBytes: 65536,
    observationBytes: Buffer.byteLength(observations),
    format:
      "One compact range per adjacent identical cut classification, inclusive offset/through; expansion yields one raw row per offset. Raw JSONL digests cover those exact rows in increasing order. Whole-family observations have null offsets where applicable.",
    observationsPath: OBSERVATIONS,
    observationsSha256: sha256(observations),
    transcript: `corpus/manifests/runs/WO-105-${BASE.slice(0, 8)}.log`,
  },
  golden: GOLDEN,
  oracles: Object.fromEntries(
    oracles.map((path) => [path, sha256(read(path))]),
  ),
  fixtures: Object.fromEntries(
    Object.entries(fixtures).map(([path, bytes]) => [
      path,
      { bytes: Buffer.byteLength(bytes), sha256: sha256(bytes) },
    ]),
  ),
  treeFamilies: treeFamilies(seed).map(
    ({ tree: _tree, truth: _truth, ...family }) => family,
  ),
  store,
  skeleton,
  findings: [],
};
exactFiles({ [MANIFEST]: jsonBytes(manifest) }, "write");
console.log(
  JSON.stringify({
    recorded: MANIFEST,
    storeCutPoints: store.cutPoints,
    skeletonCutPoints: skeleton.cutPoints,
    observationBytes: Buffer.byteLength(observations),
  }),
);
