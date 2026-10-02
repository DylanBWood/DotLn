#!/usr/bin/env node
import assert from "node:assert/strict";
import { spawn, execFileSync } from "node:child_process";
import {
  appendFileSync,
  existsSync,
  readFileSync,
  writeFileSync,
  realpathSync,
  mkdtempSync,
  mkdirSync,
  createWriteStream,
} from "node:fs";
import { createHash } from "node:crypto";
import { finished } from "node:stream/promises";
import { dirname, resolve, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import {
  availableParallelism,
  cpus,
  freemem,
  loadavg,
  release,
  totalmem,
  tmpdir,
} from "node:os";
import { performance } from "node:perf_hooks";
import {
  BASE,
  METRICS,
  digest,
  execute,
  summarize,
  validateRecords,
  parseRecords,
  comparison,
} from "./wo107-records.mjs";
import { metadata, scenarios, SCENARIO_IDS } from "./wo107-scenarios.mjs";
import { SAFETY, bounded, health } from "./wo107-bounded.mjs";

const root = realpathSync(fileURLToPath(new URL("../../", import.meta.url)));
const git = (...args) =>
  execFileSync("git", args, {
    cwd: root,
    encoding: "utf8",
    maxBuffer: 32 * 1024 * 1024,
  });
const emit = (value) => console.log(JSON.stringify(value));

export function sampleBoundary() {
  const totalMemoryBytes = totalmem();
  const freeMemoryBytes = freemem();
  return {
    kind: "boundary-sample",
    at: new Date().toISOString(),
    loadavg: loadavg(),
    freeMemoryBytes,
    totalMemoryBytes,
    usedMemoryFraction: 1 - freeMemoryBytes / totalMemoryBytes,
    processMemory: process.memoryUsage(),
    nativeMemory: health(),
    pressureInterpretation:
      "occupancy proxy plus macOS pressure level and swap boundary samples",
  };
}

export async function measure(scenario) {
  const before = sampleBoundary();
  const cpu = process.cpuUsage();
  const monotonic = process.hrtime.bigint();
  const start = performance.now();
  let value;
  let failure;
  try {
    value = await scenario.run();
  } catch (error) {
    failure = error;
  }
  const wallMs = performance.now() - start;
  const monotonicMs = Number(process.hrtime.bigint() - monotonic) / 1e6;
  const usage = process.cpuUsage(cpu);
  const after = sampleBoundary();
  return {
    before,
    after,
    resources: {
      wallMs,
      monotonicMs,
      supervisorUserCpuMs: usage.user / 1000,
      supervisorSystemCpuMs: usage.system / 1000,
      supervisorRssAfterBytes: after.processMemory.rss,
      supervisorHeapUsedAfterBytes: after.processMemory.heapUsed,
      supervisorHeapDeltaBytes:
        after.processMemory.heapUsed - before.processMemory.heapUsed,
      unitsPerSecond: (scenario.units * 1000) / wallMs,
    },
    outcome: failure
      ? {
          status: "failed",
          error: failure.name,
          detail:
            failure.publicDetail ??
            "Assertion or scenario error; private diagnostic retained by command runner",
        }
      : {
          status: "completed",
          checksum: digest(JSON.stringify(value)),
          ...(scenario.family === "f" ? { commandResult: value } : {}),
        },
  };
}

// The command transcript retains digests and TAP aggregate lines; full output
// stays in system temp to avoid copying paths or incidental fixture diagnostics.
function commandRunner(diagnostics) {
  let ordinal = 0;
  return async (command) => {
    const id = ordinal++;
    const [name, ...args] = command;
    const child = spawn(name === "node" ? process.execPath : name, args, {
      cwd: root,
      stdio: ["ignore", "pipe", "pipe"],
    });
    const stdout = createWriteStream(join(diagnostics, `${id}-stdout.log`), {
      flags: "wx",
    });
    const stderr = createWriteStream(join(diagnostics, `${id}-stderr.log`), {
      flags: "wx",
    });
    const outHash = createHash("sha256");
    const errHash = createHash("sha256");
    let tail = "";
    child.stdout.on("data", (chunk) => {
      outHash.update(chunk);
      tail = (tail + chunk.toString("utf8")).slice(-65536);
    });
    child.stderr.on("data", (chunk) => errHash.update(chunk));
    child.stdout.pipe(stdout);
    child.stderr.pipe(stderr);
    const result = await new Promise((resolveResult, reject) => {
      child.on("error", reject);
      child.on("close", (code, signal) => resolveResult({ code, signal }));
    });
    await Promise.all([finished(stdout), finished(stderr)]);
    const summary = tail
      .split("\n")
      .filter((line) =>
        /^# (tests|suites|pass|fail|cancelled|skipped|todo) \d+$/.test(line),
      );
    const receipt = {
      command,
      ...result,
      stdoutSha256: outHash.digest("hex"),
      stderrSha256: errHash.digest("hex"),
      summary,
    };
    emit({ event: "command-result", ...receipt });
    if (result.code !== 0) {
      const error = new Error("command failed");
      error.publicDetail = receipt;
      throw error;
    }
    return receipt;
  };
}

export const CLASSIFICATION = {
  decision: "WO-107-D007",
  path: "packages/kernel/test/fixtures/jsonl-protocols.json",
  addedPath: `corpus/baselines/observations-${BASE}.jsonl`,
  declaration:
    "WO-107 provisional profiling observations; validated by corpus/harness/wo107-schema.test.mjs",
  baseSha256:
    "51c064626464be838010cb0605f09520279cb69239bec48dd2cdd44ba4c8e8aa",
  currentSha256:
    "335e66e7d907abf7f3ef54cbb606a9bccb6853886adfb31533a97ca02891156a",
};

export function validateClassification(baseBytes, currentBytes) {
  assert.equal(digest(baseBytes), CLASSIFICATION.baseSha256);
  assert.equal(digest(currentBytes), CLASSIFICATION.currentSha256);
  const expected = JSON.parse(baseBytes);
  assert.ok(!Object.hasOwn(expected.nonEventPaths, CLASSIFICATION.addedPath));
  expected.nonEventPaths[CLASSIFICATION.addedPath] = CLASSIFICATION.declaration;
  assert.deepEqual(
    JSON.parse(currentBytes),
    expected,
    "only the authorized declaration",
  );
}

export function pinnedSourceIdentity() {
  assert.equal(realpathSync(process.cwd()), root, "run from the worktree root");
  assert.equal(realpathSync(git("rev-parse", "--show-toplevel").trim()), root);
  assert.equal(
    git("rev-parse", "HEAD").trim(),
    BASE,
    "measurement requires the pinned base HEAD",
  );
  const scopes = [
    "packages",
    "scripts",
    "package.json",
    "package-lock.json",
    "tsconfig.json",
  ];
  assert.equal(
    git("diff", BASE, "--", ...scopes, `:(exclude)${CLASSIFICATION.path}`),
    "",
    "measured sources must match base",
  );
  assert.equal(
    git("ls-files", "--others", "--exclude-standard", "--", ...scopes),
    "",
    "no untracked measured sources",
  );
  const files = git("ls-files", "-z", "--", ...scopes)
    .split("\0")
    .filter(Boolean)
    .sort();
  const classificationBase = git("show", `${BASE}:${CLASSIFICATION.path}`);
  validateClassification(
    classificationBase,
    readFileSync(join(root, CLASSIFICATION.path)),
  );
  return digest(
    JSON.stringify(
      files.map((file) => [
        file,
        digest(
          file === CLASSIFICATION.path
            ? classificationBase
            : readFileSync(join(root, file)),
        ),
      ]),
    ),
  );
}

const protocolHash = () =>
  digest(
    [
      "profile.mjs",
      "wo107-records.mjs",
      "wo107-scenarios.mjs",
      "wo107-bounded.mjs",
    ]
      .map(
        (file) =>
          `${file}\n${readFileSync(new URL(file, import.meta.url), "utf8")}`,
      )
      .join("\n"),
  );

// Only provenance, preflight, validation and reporting changed after D007.
// The initial archive is hash-pinned; all timed paths must remain exact bytes.
export function protocolLineage() {
  const names = [
    "profile.mjs",
    "wo107-records.mjs",
    "wo107-scenarios.mjs",
    "wo107-bounded.mjs",
  ];
  const initial = Object.fromEntries(
    names.map((name) => [
      name,
      readFileSync(
        new URL(`wo107-initial-protocol/${name}.txt`, import.meta.url),
        "utf8",
      ),
    ]),
  );
  const current = Object.fromEntries(
    names.map((name) => [
      name,
      readFileSync(new URL(name, import.meta.url), "utf8"),
    ]),
  );
  const initialHash = digest(
    names.map((name) => `${name}\n${initial[name]}`).join("\n"),
  );
  assert.equal(
    initialHash,
    "feada88b7313d88268cf944257b879acb3d1492dc1651b649a44c37fbe3d2ba4",
  );
  for (const name of ["wo107-scenarios.mjs", "wo107-bounded.mjs"])
    assert.equal(current[name], initial[name], `${name} must remain unchanged`);
  const section = (source, start, end) => {
    const from = source.indexOf(start);
    const to = source.indexOf(end, from);
    assert.ok(from >= 0 && to > from);
    return source.slice(from, to);
  };
  for (const [name, start, end] of [
    [
      "profile.mjs",
      "export function sampleBoundary()",
      "// The command transcript",
    ],
    ["profile.mjs", "function commandRunner", "\nexport "],
    ["wo107-records.mjs", "export const METRICS", "const iso"],
  ])
    assert.equal(
      section(current[name], start, end),
      section(initial[name], start, end),
      `timed protocol unchanged: ${name}/${start}`,
    );
  return { initialHash, currentHash: protocolHash() };
}

export function validateProvenance(records) {
  const { initialHash, currentHash } = protocolLineage();
  for (const row of records) {
    assert.ok(
      [initialHash, currentHash].includes(row.protocolHash),
      "known collector revision",
    );
    assert.deepEqual(
      row.execution.classificationOverlay,
      row.protocolHash === initialHash ? undefined : CLASSIFICATION,
      "classification overlay must be disclosed exactly",
    );
  }
  return { allowedProtocols: [initialHash, currentHash] };
}

async function main(argv) {
  const options = {};
  for (let i = 0; i < argv.length; i++) {
    const key = argv[i];
    assert.ok(
      ["--seed", "--out", "--compare", "--check"].includes(key),
      `unknown option ${key}`,
    );
    assert.ok(!Object.hasOwn(options, key), `duplicate ${key}`);
    if (key === "--check") options[key] = true;
    else {
      assert.ok(
        argv[i + 1] && !argv[i + 1].startsWith("--"),
        `missing ${key} value`,
      );
      options[key] = argv[++i];
    }
  }
  if (options["--compare"]) {
    assert.ok(!options["--seed"]);
    const input = resolve(options["--compare"]);
    const output = resolve(
      options["--out"] ?? join(dirname(input), "WO-107-comparison.md"),
    );
    assert.notEqual(input, output, "comparison cannot overwrite observations");
    const bytes = readFileSync(input);
    const records = parseRecords(bytes.toString("utf8"));
    const provenance = validateProvenance(records);
    validateRecords(records, provenance);
    assert.deepEqual(
      records[0].registry.map((s) => s.id),
      SCENARIO_IDS,
    );
    const report = comparison(records, provenance);
    if (options["--check"])
      assert.equal(
        readFileSync(output, "utf8"),
        report,
        "comparison byte identity",
      );
    else writeFileSync(output, report, { flag: "wx" });
    assert.deepEqual(
      readFileSync(input),
      bytes,
      "comparison is read-only on observations",
    );
    emit({
      event: options["--check"] ? "comparison-checked" : "comparison-generated",
      records: records.length,
      inputSha256: digest(bytes),
      reportSha256: digest(report),
    });
    return;
  }
  assert.ok(
    options["--seed"] && options["--out"] && !options["--check"],
    "usage: profile --seed <seed> --out <jsonl> | --compare <jsonl> [--out <md>] [--check]",
  );
  if (process.env.DOTLN_WO107_MONITORED !== "1") {
    const result = await bounded(
      ["node", fileURLToPath(import.meta.url), ...argv],
      { observe: emit },
    );
    process.exitCode = result.reason ? 125 : (result.code ?? 1);
    return;
  }
  const output = resolve(options["--out"]);
  assert.ok(
    relative(join(root, "corpus/baselines"), output) ===
      `observations-${BASE}.jsonl`,
    "use the commit-keyed baseline path",
  );
  const existing = existsSync(output) ? readFileSync(output) : Buffer.alloc(0);
  const previous = existing.length
    ? parseRecords(existing.toString("utf8"))
    : [];
  if (previous.length) {
    validateRecords(previous, { pair: false, ...validateProvenance(previous) });
    assert.ok(
      previous.every((r) => r.execution.seed !== options["--seed"]),
      "retain previous execution; seed already recorded",
    );
  }
  const sourceIdentity = pinnedSourceIdentity();
  const environment = {
    os: { platform: process.platform, release: release(), arch: process.arch },
    cpus: {
      count: cpus().length,
      availableParallelism: availableParallelism(),
      models: [...new Set(cpus().map((cpu) => cpu.model))],
    },
    toolchain: {
      node: process.version,
      npm: execFileSync("npm", ["--version"], { encoding: "utf8" }).trim(),
      tsc: execFileSync(
        process.execPath,
        ["node_modules/typescript/bin/tsc", "--version"],
        { encoding: "utf8" },
      ).trim(),
    },
    lockfileSha256: digest(readFileSync("package-lock.json")),
    safety: SAFETY,
  };
  const diagnostics = mkdtempSync(join(tmpdir(), "dotln-wo107-profile-"));
  const registry = await scenarios(commandRunner(diagnostics));
  const specs = metadata(registry);
  const protocol = protocolHash();
  protocolLineage();
  if (previous.length)
    for (const [key, value] of Object.entries({
      registry: specs,
      sourceIdentity,
      environment,
    }))
      assert.deepEqual(previous[0][key], value);
  const startedAt = new Date().toISOString();
  const before = sampleBoundary();
  const seed = options["--seed"];
  const execution = {
    id: digest(`${BASE}:${seed}:${startedAt}`),
    seed,
    startedAt,
    classificationOverlay: CLASSIFICATION,
  };
  emit({
    event: "execution-start",
    baseCommit: BASE,
    execution,
    environment,
    sourceIdentity,
    protocolHash: protocol,
    registry: specs,
  });
  const samples = await execute(registry, seed, measure, emit);
  const after = sampleBoundary();
  const finishedAt = new Date().toISOString();
  assert.equal(
    pinnedSourceIdentity(),
    sourceIdentity,
    "source drift during execution",
  );
  assert.equal(protocolHash(), protocol, "protocol drift during execution");
  const records = specs.map((s) => ({
    schemaVersion: "WO-107-provisional-1",
    baseCommit: BASE,
    sourceIdentity,
    protocolHash: protocol,
    environment,
    execution: { ...execution, finishedAt, before, after },
    registry: specs,
    scenarioId: s.id,
    warmupCount: s.warmups,
    repetitionCount: s.repetitions,
    metricDefinitions: METRICS,
    unmeasured: [
      "child CPU and memory",
      "energy",
      "operator attention",
      "model tokens",
      "monetary cost",
    ],
    samples: samples.get(s.id),
    distributions: summarize(samples.get(s.id)),
  }));
  validateRecords(records, { expectedRegistry: specs, pair: false });
  assert.deepEqual(
    existsSync(output) ? readFileSync(output) : Buffer.alloc(0),
    existing,
    "append target changed during execution",
  );
  mkdirSync(dirname(output), { recursive: true });
  appendFileSync(
    output,
    records.map((row) => JSON.stringify(row)).join("\n") + "\n",
  );
  const failed = records
    .flatMap((r) => r.samples)
    .filter((s) => s.outcome.status === "failed").length;
  emit({
    event: "execution-recorded",
    id: execution.id,
    records: records.length,
    failed,
    observationsSha256: digest(readFileSync(output)),
  });
  if (failed) {
    console.error(`Failed samples retained. Diagnostics: ${diagnostics}`);
    process.exitCode = 1;
  }
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  main(process.argv.slice(2)).catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
