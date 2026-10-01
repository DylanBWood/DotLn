#!/usr/bin/env node
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { isDeepStrictEqual } from "node:util";
import {
  BUDGET,
  GRID,
  KINDS,
  PINNED_BASE_COMMIT,
  REGISTRY,
  REPO_ROOT,
  countRows,
  encodeNumbers,
  enumerateGrid,
  inspectCorpus,
  json,
  sampleGrid,
  sha256,
} from "./wo102-cadence-lib.mjs";
import { HAND_COMPUTED_BACKOFF } from "./wo102-reference.mjs";

// Historical generator environment, not a requirement to impersonate that host.
export const TOOLCHAIN_PROFILE = {
  node: "v26.9.0",
  npm: "11.19.1",
  typescript: "7.0.2",
  platform: "darwin",
  architecture: "arm64",
  osKernel: "27.0.0",
};
export const MANIFEST_PATH = "corpus/manifests/WO-102.json";
export const FINDINGS_PATH = "corpus/manifests/findings-WO-102.md";

export function parseArgs(args) {
  let seed;
  let mode;
  for (let index = 0; index < args.length; index++) {
    const arg = args[index];
    if (arg === "--seed") {
      if (seed !== undefined) throw new Error("--seed may appear only once");
      seed = args[++index];
      if (!seed || seed.startsWith("--"))
        throw new Error("--seed requires a value");
    } else if (arg === "--check" || arg === "--write") {
      if (mode !== undefined) throw new Error("choose exactly one mode");
      mode = arg.slice(2);
    } else throw new Error(`unknown argument: ${arg}`);
  }
  if (!mode) throw new Error("choose exactly one mode");
  if (!seed) throw new Error("--seed is required");
  return { seed, mode };
}
export function renderFindings(findings) {
  return (
    "# WO-102 Cadence findings\n\nThese are shipped-formula drift alarms or declared-grid property violations, not external-spec violations. The kernel is unchanged. Each numbered record includes its complete reproducer.\n\n" +
    findings
      .map(
        (finding) =>
          `## ${finding.number}\n\n\`\`\`json\n${JSON.stringify(finding, null, 2)}\n\`\`\`\n`,
      )
      .join("\n")
  );
}
export function buildCorpus(seed) {
  const full = enumerateGrid();
  const committed = sampleGrid(full, seed);
  const findings = inspectCorpus(full);
  const files = [];
  for (const kind of KINDS) {
    const rows = committed.filter((row) => row.kind === kind);
    for (let offset = 0; offset < rows.length; offset += BUDGET.shardRows) {
      const shard = rows.slice(offset, offset + BUDGET.shardRows);
      const path = `corpus/fixtures/cadence/${kind.toLowerCase()}-${String(offset / BUDGET.shardRows + 1).padStart(3, "0")}.jsonl`;
      const bytes =
        shard
          .map((row, index) =>
            json({
              schemaVersion: 1,
              eventId: `evt_${index + 1}`,
              type: "CadenceGoldenVector",
              occurredAt: row.env.now,
              actorId: "corpus",
              workstreamId: "cadence",
              payload: row,
            }),
          )
          .join("\n") + "\n";
      files.push({
        path,
        bytes,
        descriptor: {
          path,
          rows: shard.length,
          bytes: Buffer.byteLength(bytes),
          sha256: sha256(bytes),
        },
      });
    }
  }
  const fixtureBytes = files.reduce(
    (sum, file) => sum + file.descriptor.bytes,
    0,
  );
  if (fixtureBytes > BUDGET.maximumTotalFixtureBytes)
    throw new Error("Committed-size budget exceeded");
  const manifest = {
    schemaVersion: 1,
    workOrderId: "WO-102",
    seed,
    pinnedBaseCommit: PINNED_BASE_COMMIT,
    oracle:
      "Pins the shipped evaluateCadence formula at the base; drift/porting alarm only, no external-spec conformance claim. Backoff/LCG use an independent BigInt modulo and repeated-multiplication path.",
    numberEncoding:
      'Nonfinite scalar = {"$number":"NaN"|"+Infinity"|"-Infinity"}; absence is an omitted key. The finite Backoff grid uses unsigned 32-bit integer RNG inputs; no wider/noninteger/nonfinite RNG claim.',
    fixtureEncoding:
      "Each JSONL shard is a standard schemaVersion 1 EventEnvelope stream, evt_1 onward per shard, type CadenceGoldenVector, explicit virtual occurredAt=payload.env.now; payload is the complete vector with cadence/state/env/optional event/expected outcome/predicate calls. These are original synthetic observations, not execution-history claims.",
    grid: GRID,
    predicateRegistry: REGISTRY,
    toolchainProfile: TOOLCHAIN_PROFILE,
    counts: {
      full: countRows(full),
      committed: countRows(committed),
      classCountMeaning:
        "Labels overlap; each count is the number of vectors carrying that label, not a disjoint partition.",
    },
    selection: {
      rule: `Once/After/Every exhaustive; Gate/Until/Backoff: seed SHA-256 rank, first uncovered class/outcome representatives, then rank fill to ${BUDGET.maximumRowsPerSampledConstructor} per root. Full set independent of seed.`,
      budget: BUDGET,
    },
    fixtures: files.map((file) => file.descriptor),
    fixtureTotals: {
      files: files.length,
      rows: committed.length,
      bytes: fixtureBytes,
    },
    handComputedBackoff: HAND_COMPUTED_BACKOFF,
    findings,
    evidence: {
      runLog: `corpus/manifests/runs/WO-102-${PINNED_BASE_COMMIT}.log`,
      runLogCommitMeaning:
        "Filename identifies the pinned pre-implementation base, not an implementation commit; no executor branch commit is made.",
      commands: [
        "npm run build",
        `node corpus/harness/generate-cadence-corpus.mjs --seed ${seed} --check`,
        "node --test corpus/harness/wo102-*.test.mjs",
        "npm test",
        "npm run test:docs",
        "git diff --check",
      ],
      lane: "Manual offline corpus; no addition to root test or release-evidence commands. Existing deferred-kind pins stay in WO-017's root suite.",
    },
  };
  files.push({
    path: MANIFEST_PATH,
    bytes: JSON.stringify(encodeNumbers(manifest), null, 2) + "\n",
  });
  if (findings.length)
    files.push({ path: FINDINGS_PATH, bytes: renderFindings(findings) });
  return { files, manifest, full, committed };
}
export function checkCorpus(built, root = REPO_ROOT) {
  for (const file of built.files) {
    const path = join(root, file.path);
    if (!existsSync(path) || readFileSync(path, "utf8") !== file.bytes)
      throw new Error(`Regeneration differs: ${file.path}`);
  }
  const actual = readdirSync(join(root, "corpus/fixtures/cadence")).sort();
  const expected = built.manifest.fixtures
    .map((file) => file.path.split("/").at(-1))
    .sort();
  if (!isDeepStrictEqual(actual, expected))
    throw new Error("Unmanifested or missing cadence fixture");
  if (!built.manifest.findings.length && existsSync(join(root, FINDINGS_PATH)))
    throw new Error("Unexpected findings file; preserve and investigate it");
  return true;
}
export function runGenerator(args) {
  const { seed, mode } = parseArgs(args);
  const built = buildCorpus(seed);
  if (mode === "write") {
    for (const file of built.files) {
      const path = join(REPO_ROOT, file.path);
      mkdirSync(dirname(path), { recursive: true });
      writeFileSync(path, file.bytes);
    }
  } else checkCorpus(built);
  console.log(
    JSON.stringify({
      mode,
      seed,
      full: built.manifest.counts.full.byConstructor,
      committed: built.manifest.counts.committed.byConstructor,
      fixtureTotals: built.manifest.fixtureTotals,
      findings: built.manifest.findings.length,
    }),
  );
  return built.manifest;
}
if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href
) {
  try {
    runGenerator(process.argv.slice(2));
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
