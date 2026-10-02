import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, existsSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawn, spawnSync, execFileSync } from "node:child_process";
import { once } from "node:events";
import {
  BASE,
  SEEDS,
  METRICS,
  digest,
  distribution,
  schedule,
  execute,
  summarize,
  parseRecords,
  validateRecords,
  comparison,
} from "./wo107-records.mjs";
import { metadata, scenarios, SCENARIO_IDS } from "./wo107-scenarios.mjs";
import {
  measure,
  sampleBoundary,
  CLASSIFICATION,
  validateClassification,
  protocolLineage,
  validateProvenance,
} from "./profile.mjs";
import { bounded, SAFETY, ownedProcesses } from "./wo107-bounded.mjs";

test("harness distributions interpolate quantiles and retain an outlier", () => {
  assert.deepEqual(distribution([1, 2, 3, 100]), {
    count: 4,
    min: 1,
    p25: 1.75,
    p50: 2.5,
    p90: 70.90000000000002,
    max: 100,
    mean: 26.5,
    stddev: Math.sqrt(1801.25),
  });
  assert.throws(() => distribution([]));
  assert.throws(() => distribution([NaN]));
});

test("harness deterministic dummy proves order, interleaving, warmups and every repetition", async () => {
  const registry = [
    { id: "a", warmups: 2, repetitions: 9 },
    { id: "b", warmups: 1, repetitions: 3 },
    { id: "c", warmups: 2, repetitions: 9 },
  ];
  const calls = [];
  const observed = [];
  const result = await execute(
    registry,
    SEEDS[0],
    async (s, e) => {
      calls.push(e);
      return { value: `${s.id}/${e.phase}/${e.round}` };
    },
    (e) => observed.push(e),
  );
  const plan = schedule(registry, SEEDS[0]);
  assert.deepEqual(calls, plan);
  assert.deepEqual(schedule(registry, SEEDS[0]), plan);
  assert.notDeepEqual(schedule(registry, SEEDS[1]), plan);
  assert.equal(observed.length, plan.length * 2);
  for (const s of registry) {
    assert.equal(
      result.get(s.id).filter((r) => r.phase === "measured").length,
      s.repetitions,
    );
    assert.equal(
      result.get(s.id).filter((r) => r.phase === "warmup").length,
      s.warmups,
    );
    for (const row of result.get(s.id))
      assert.equal(row.value, `${s.id}/${row.phase}/${row.round}`);
  }
  for (let round = 0; round < 3; round++)
    assert.equal(
      new Set(
        plan
          .filter((p) => p.phase === "measured" && p.round === round)
          .map((p) => p.scenarioId),
      ).size,
      3,
    );
});

test("harness stops at a failed sample and retains its observer event", async () => {
  const events = [];
  await assert.rejects(
    execute(
      [{ id: "failure", warmups: 1, repetitions: 3 }],
      "failure",
      async () => ({ outcome: { status: "failed" } }),
      (e) => events.push(e),
    ),
    /campaign stopped/,
  );
  assert.equal(events.length, 2);
  assert.equal(events[1].outcome.status, "failed");
});

test("harness resource sample derives throughput and explicitly scopes memory", async () => {
  const sample = await measure({ units: 4, run: () => [1, 2, 3, 4] });
  assert.equal(sample.outcome.status, "completed");
  assert.deepEqual(Object.keys(sample.resources), Object.keys(METRICS));
  assert.equal(sample.resources.unitsPerSecond, 4000 / sample.resources.wallMs);
  assert.equal(
    sample.resources.supervisorRssAfterBytes,
    sample.after.processMemory.rss,
  );
  const failed = await measure({
    units: 1,
    run: () => {
      throw new Error("synthetic");
    },
  });
  assert.equal(failed.outcome.status, "failed");
});

test("harness registry covers every declared scenario and command source file", async () => {
  const registry = await scenarios(() => {
    throw new Error("test must not execute build or suites");
  });
  assert.deepEqual(
    registry.map((s) => s.id),
    SCENARIO_IDS,
  );
  for (const s of registry) {
    assert.equal(s.warmups, s.family === "f" ? 1 : 2);
    assert.equal(s.repetitions, s.family === "f" ? 3 : 9);
    if (s.family !== "f") assert.notEqual(await s.run(), undefined);
  }
  for (const name of ["kernel", "skeleton"])
    assert.equal(
      registry.find((s) => s.id === `command/${name}`).parameters.files.length,
      readdirSync(`packages/${name}/test`).filter((f) => f.endsWith(".test.ts"))
        .length,
    );
  assert.equal(
    metadata(registry).some((s) => Object.hasOwn(s, "run")),
    false,
  );
});

test("harness watchdog tracks owned descendants without claiming unrelated processes", () => {
  const known = new Map();
  assert.deepEqual(
    ownedProcesses(
      [
        { pid: 10, ppid: 1, pgid: 10, birth: "a" },
        { pid: 11, ppid: 10, pgid: 11, birth: "b" },
        { pid: 12, ppid: 1, pgid: 12, birth: "c" },
      ],
      10,
      known,
    ).map((p) => p.pid),
    [10, 11],
  );
  assert.deepEqual(
    ownedProcesses(
      [
        { pid: 11, ppid: 1, pgid: 11, birth: "different" },
        { pid: 12, ppid: 1, pgid: 12, birth: "c" },
      ],
      10,
      known,
    ),
    [],
  );
});

test("harness watchdog ends a tiny synthetic child and leaves a bystander alive", async () => {
  const bystander = spawn(
    process.execPath,
    ["-e", "setTimeout(()=>{},10000)"],
    { stdio: "ignore" },
  );
  const notices = [];
  try {
    const result = await bounded(["node", "-e", "setTimeout(()=>{},10000)"], {
      limits: { ...SAFETY, aggregateRssBytes: 1, deadlineMs: 5000 },
      observe: (r) => notices.push(r),
      stdio: "ignore",
    });
    assert.equal(result.reason, "aggregate-rss");
    assert.equal(result.signal, "SIGKILL");
    assert.ok(notices.some((r) => r.event === "resource-stop"));
    process.kill(bystander.pid, 0);
  } finally {
    bystander.kill();
    await once(bystander, "exit");
  }
});

test("harness watchdog records normal completion and sampled headroom", async () => {
  const result = await bounded(["node", "-e", "setTimeout(()=>{},300)"], {
    stdio: "ignore",
  });
  assert.equal(result.code, 0);
  assert.equal(result.reason, null);
  assert.ok(result.samples > 0);
  assert.ok(result.sampledPeakRssBytes < SAFETY.aggregateRssBytes);
});

test("harness full dummy executions round-trip through schema and comparison", async () => {
  const registry = [
    {
      id: "dummy",
      family: "a",
      description: "deterministic dummy",
      unit: "calls",
      units: 1,
      warmups: 1,
      repetitions: 3,
      command: [],
      run: () => 42,
    },
  ];
  const records = [];
  for (const seed of ["one", "two"]) {
    const startedAt = new Date().toISOString();
    const before = sampleBoundary();
    const samples = (await execute(registry, seed, measure)).get("dummy");
    const after = sampleBoundary();
    const finishedAt = new Date().toISOString();
    records.push({
      schemaVersion: "WO-107-provisional-1",
      baseCommit: BASE,
      sourceIdentity: digest("source"),
      protocolHash: digest("protocol"),
      environment: {
        os: { platform: "darwin", arch: "arm64", release: "test" },
        cpus: { count: 1, models: ["synthetic"] },
        toolchain: { node: "26.0.0", npm: "11.0.0", tsc: "7.0.0" },
        lockfileSha256: digest("lock"),
      },
      execution: {
        id: digest(`${BASE}:${seed}:${startedAt}`),
        seed,
        startedAt,
        finishedAt,
        before,
        after,
      },
      registry: metadata(registry),
      scenarioId: "dummy",
      warmupCount: 1,
      repetitionCount: 3,
      metricDefinitions: METRICS,
      unmeasured: [
        "child CPU and memory",
        "energy",
        "operator attention",
        "model tokens",
        "monetary cost",
      ],
      samples,
      distributions: summarize(samples),
    });
  }
  const decoded = parseRecords(
    records.map((r) => JSON.stringify(r)).join("\n") + "\n",
  );
  assert.equal(validateRecords(decoded).size, 2);
  const report = comparison(decoded);
  assert.match(report, /Between-execution differences/);
  assert.match(report, /Native pressure before/);
});

const observations = `corpus/baselines/observations-${BASE}.jsonl`;
test("harness classification exception is exact and both collector revisions preserve timed bytes", () => {
  const baseBytes = execFileSync("git", [
    "show",
    `${BASE}:${CLASSIFICATION.path}`,
  ]);
  const currentBytes = readFileSync(CLASSIFICATION.path);
  validateClassification(baseBytes, currentBytes);
  assert.throws(() => validateClassification(baseBytes, baseBytes));
  const widened = JSON.parse(currentBytes);
  widened.nonEventPaths["corpus/unapproved.jsonl"] = "unapproved";
  assert.throws(() =>
    validateClassification(baseBytes, JSON.stringify(widened)),
  );
  const { initialHash, currentHash } = protocolLineage();
  assert.notEqual(initialHash, currentHash);
  const rows = [
    { protocolHash: initialHash, execution: {} },
    {
      protocolHash: currentHash,
      execution: { classificationOverlay: CLASSIFICATION },
    },
  ];
  assert.deepEqual(validateProvenance(rows).allowedProtocols, [
    initialHash,
    currentHash,
  ]);
  const missing = structuredClone(rows);
  delete missing[1].execution.classificationOverlay;
  assert.throws(() => validateProvenance(missing));
  const unknown = structuredClone(rows);
  unknown[1].protocolHash = digest("unrecognized collector");
  assert.throws(() => validateProvenance(unknown));
});

test("corpus every committed record has a complete schema, distinct execution seeds and retained statistics", () => {
  assert.ok(existsSync(observations), "run both baseline executions first");
  const text = readFileSync(observations, "utf8");
  assert.equal(
    digest(text.split("\n").slice(0, SCENARIO_IDS.length).join("\n") + "\n"),
    "34226e64115c7dacc983677268e1c228448aee34907cf2a4cf292c01bbe14ccb",
    "the first complete execution remains byte-identical after append",
  );
  const records = parseRecords(text);
  const groups = validateRecords(records, validateProvenance(records));
  assert.equal(records.length, SCENARIO_IDS.length * 2);
  assert.deepEqual(
    [...groups.values()].map((g) => g[0].execution.seed),
    SEEDS,
  );
  assert.deepEqual(
    records[0].registry.map((s) => s.id),
    SCENARIO_IDS,
  );
  for (const row of records) {
    for (const key of ["count", "availableParallelism"])
      assert.ok(
        Number.isInteger(row.environment.cpus[key]) &&
          row.environment.cpus[key] > 0,
      );
    assert.deepEqual(row.environment.safety, SAFETY);
    const command = row.scenarioId.startsWith("command/");
    assert.equal(row.repetitionCount, command ? 3 : 9);
    assert.equal(row.warmupCount, command ? 1 : 2);
    assert.ok(
      row.samples.every((s) => s.outcome.status === "completed"),
      "failed attempts must remain visible and cannot establish the successful baseline",
    );
    if (command)
      for (const sample of row.samples) {
        const result = sample.outcome.commandResult;
        assert.equal(result.code, 0);
        assert.equal(result.signal, null);
        assert.deepEqual(
          result.command,
          row.registry.find((s) => s.id === row.scenarioId).command,
        );
        for (const key of ["stdoutSha256", "stderrSha256"])
          assert.match(result[key], /^[a-f0-9]{64}$/);
        assert.equal(sample.outcome.checksum, digest(JSON.stringify(result)));
        assert.ok(Array.isArray(result.summary));
        if (row.scenarioId !== "command/build") {
          for (const label of ["fail", "cancelled", "skipped", "todo"])
            assert.ok(result.summary.includes(`# ${label} 0`));
          const tests = result.summary.find((line) =>
            /^# tests [1-9]\d*$/.test(line),
          );
          assert.ok(tests);
          assert.ok(
            result.summary.includes(tests.replace("# tests ", "# pass ")),
          );
        }
      }
  }
});

test("corpus schema refuses omissions, nonfinite values, lost outliers, duplicated execution and fabricated statistics", () => {
  const records = parseRecords(readFileSync(observations, "utf8"));
  const mutations = [
    (r) => delete r[0].environment,
    (r) => delete r[0].execution.before,
    (r) => r[0].samples.pop(),
    (r) => (r[0].samples[0].resources.wallMs = Infinity),
    (r) => r[0].distributions.wallMs.count--,
    (r) => (r[0].distributions.wallMs.p90 = 0),
    (r) => r[0].samples[0].index++,
    (r) => r.push(r[0]),
    (r) => r.splice(0, 1),
  ];
  for (const mutate of mutations) {
    const changed = structuredClone(records);
    mutate(changed);
    assert.throws(() => validateRecords(changed, validateProvenance(changed)));
  }
  assert.throws(() => parseRecords("{}"));
  assert.throws(() => parseRecords("\n"));
});

test("corpus generated comparison is byte identical and check never appends or rewrites", () => {
  const original = readFileSync(observations);
  const report = readFileSync("corpus/baselines/WO-107-comparison.md", "utf8");
  const records = parseRecords(original.toString());
  assert.equal(comparison(records, validateProvenance(records)), report);
  const run = spawnSync(
    process.execPath,
    ["corpus/harness/profile.mjs", "--compare", observations, "--check"],
    { encoding: "utf8", maxBuffer: 1024 * 1024, timeout: 30000 },
  );
  assert.equal(run.status, 0, run.stderr);
  assert.deepEqual(readFileSync(observations), original);
  assert.equal(
    readFileSync("corpus/baselines/WO-107-comparison.md", "utf8"),
    report,
  );
  const temporary = join(
    mkdtempSync(join(tmpdir(), "dotln-wo107-check-")),
    "absent.md",
  );
  const absent = spawnSync(
    process.execPath,
    [
      "corpus/harness/profile.mjs",
      "--compare",
      observations,
      "--out",
      temporary,
      "--check",
    ],
    { encoding: "utf8", maxBuffer: 1024 * 1024, timeout: 30000 },
  );
  assert.notEqual(absent.status, 0);
  assert.ok(!existsSync(temporary));
  assert.deepEqual(readFileSync(observations), original);
});
