// VER-001 probes for WO-222. Run from the repository root:
//   node scripts/harness.mjs bounded -- node docs/evidence/WO-222/verification-001/probes.mjs <probe>
// Probes: capacity-table, registry, scheduler-table, timelines, cases,
// series, baseline, host-budget. Each prints one JSON line per observation.
// Host-lane registries are private temporary directories; the real host
// registry is read, never written. Probes that stub the processor count run
// in a child process so the stub precedes every module load.
import { spawn, spawnSync } from "node:child_process";
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const repo = process.cwd();
const self = fileURLToPath(import.meta.url);
const load = (path) => import(pathToFileURL(join(repo, path)).href);
const print = (value) => console.log(JSON.stringify(value));
const [probe] = process.argv.slice(2);

// A child that stubs os.availableParallelism before loading the subject.
function child(cpus, inner, env = {}) {
  const stub = `import os from "node:os"; import { syncBuiltinESMExports } from "node:module"; os.availableParallelism = () => ${cpus}; syncBuiltinESMExports();`;
  const result = spawnSync(
    process.execPath,
    [
      "--import",
      `data:text/javascript,${encodeURIComponent(stub)}`,
      self,
      inner,
    ],
    {
      cwd: repo,
      encoding: "utf8",
      env: { ...process.env, ...env },
      timeout: 120_000,
    },
  );
  if (result.status !== 0)
    throw new Error(result.stderr || `child ${inner} failed`);
  return result.stdout
    .trim()
    .split("\n")
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}
// The same child, started without waiting, so two can contend for the lock.
function childAsync(cpus, inner, env = {}) {
  const stub = `import os from "node:os"; import { syncBuiltinESMExports } from "node:module"; os.availableParallelism = () => ${cpus}; syncBuiltinESMExports();`;
  return new Promise((done, fail) => {
    let stdout = "";
    const running = spawn(
      process.execPath,
      [
        "--import",
        `data:text/javascript,${encodeURIComponent(stub)}`,
        self,
        inner,
      ],
      {
        cwd: repo,
        env: { ...process.env, ...env },
        stdio: ["ignore", "pipe", "inherit"],
      },
    );
    running.stdout.on("data", (chunk) => (stdout += chunk));
    running.on("close", (code) =>
      code === 0
        ? done(JSON.parse(stdout.trim()))
        : fail(new Error(`child ${inner} exited ${code}`)),
    );
  });
}

const probes = {
  // Criterion 1: defaults from the observed (stubbed) processor count, no
  // explicit parallelism or capacity argument.
  async "capacity-table"() {
    for (const cpus of [1, 2, 3, 4, 8, 15, 16, 17, 32, 64])
      print(child(cpus, "capacity-child")[0]);
  },
  async "capacity-child"() {
    const { hostLaneCapacity, DEFAULT_MEMORY } = await load(
      "scripts/lib/host-resources.mjs",
    );
    const { scheduleSuites } = await load("scripts/test-runner.mjs");
    const seen = [];
    await scheduleSuites(
      [
        { name: "build", build: true, command: ["x"] },
        { name: "a", command: ["x"] },
      ],
      {
        execute: async (row) => {
          seen.push([
            row.name,
            row.gateContext.slotCapacity,
            row.gateContext.hostCapacity,
            row.gateContext.reservedSlots,
          ]);
          return { name: row.name, executed: true, exitCode: 0 };
        },
      },
    );
    let refused = "";
    try {
      await scheduleSuites([{ name: "build", build: true, command: ["x"] }], {
        concurrency: hostLaneCapacity() + 1,
        execute: async (row) => ({ name: row.name, exitCode: 0 }),
      });
    } catch (error) {
      refused = error.message;
    }
    print({
      cpus: (await import("node:os")).availableParallelism(),
      capacity: hostLaneCapacity(),
      defaultHostLanes: DEFAULT_MEMORY.hostLanes,
      seen,
      refused,
    });
  },
  // Criterion 1: first acquirer records, later derivations inherit, a request
  // above the record refuses naming both; concurrent first acquirers; forged
  // and malformed records.
  async registry() {
    const base = mkdtempSync(join(tmpdir(), "wo222-ver-registry-"));
    try {
      const acquire = (cpus, directory, slots, holdMs = 0) =>
        child(cpus, "acquire-child", {
          PROBE_DIR: directory,
          PROBE_SLOTS: String(slots),
          PROBE_HOLD_MS: String(holdMs),
        })[0];
      const a = join(base, "a");
      print({
        step: "first",
        ...acquire(4, a, 1),
        record: readFileSync(join(a, "lane-capacity.json"), "utf8").trim(),
      });
      print({ step: "later-larger-derivation", ...acquire(32, a, 2) });
      print({ step: "later-over-record", ...acquire(32, a, 3) });
      print({ step: "later-smaller-derivation", ...acquire(2, a, 2) });
      const b = join(base, "b");
      const racers = await Promise.all(
        [4, 32].map((cpus) =>
          childAsync(cpus, "acquire-child", {
            PROBE_DIR: b,
            PROBE_SLOTS: "1",
            PROBE_HOLD_MS: "300",
          }),
        ),
      );
      print({
        step: "race",
        racers,
        record: readFileSync(join(b, "lane-capacity.json"), "utf8").trim(),
      });
      for (const record of [
        '{"capacity":0}',
        '{"capacity":9}',
        '{"capacity":"8"}',
        "{}",
        "not json",
        "",
      ]) {
        const f = join(base, `forged-${Math.random().toString(16).slice(2)}`);
        mkdirSync(f, { mode: 0o700 });
        writeFileSync(join(f, "lane-capacity.json"), record, { mode: 0o600 });
        print({ step: "forged", record, ...acquire(16, f, 1) });
      }
    } finally {
      rmSync(base, { recursive: true, force: true });
    }
  },
  async "acquire-child"() {
    const { acquireHostLanes } = await load("scripts/lib/host-lanes.mjs");
    const { hostLaneCapacity } = await load("scripts/lib/host-resources.mjs");
    const directory = process.env.PROBE_DIR,
      slots = Number(process.env.PROBE_SLOTS ?? 1);
    try {
      const lease = await acquireHostLanes({
        directory,
        slots,
        parentLease: null,
        task: "probe",
        worktree: directory,
        waitHeartbeatMs: 60_000,
      });
      print({
        derived: hostLaneCapacity(),
        slots,
        recorded: lease.record.capacity,
      });
      await new Promise((done) =>
        setTimeout(done, Number(process.env.PROBE_HOLD_MS ?? 0)),
      );
      await lease.release();
    } catch (error) {
      print({ derived: hostLaneCapacity(), slots, refused: error.message });
    }
  },
  // Criterion 3: the real suite table, the real light classification and the
  // after series' durations (scaled 1:4000, randomized), at four capacities.
  async "scheduler-table"() {
    for (const cpus of [16, 8, 4, 2])
      for (const seed of [1, 7])
        print(child(cpus, "scheduler-child", { PROBE_SEED: String(seed) })[0]);
  },
  async "scheduler-child"() {
    const { suites, expandSuiteTasks, scheduleSuites, lightSuiteNames } =
      await load("scripts/test-runner.mjs");
    const after = JSON.parse(
      readFileSync(join(repo, "docs/evidence/WO-222/after.json"), "utf8"),
    );
    const measured = new Map(
      after.runs[0].gate.taskTimeline.map((t) => [t.name, t.durationMs]),
    );
    const light = lightSuiteNames();
    const selected = new Set(
      after.runs[0].gate.taskTimeline.map((t) => t.name.split(":")[0]),
    );
    const table = expandSuiteTasks(
      suites.filter((r) => selected.has(r.name)),
      repo,
      "<gate-template>",
    );
    const isolated = (r) =>
      Boolean(r.build || r.exclusive || r.loadClass === "isolated");
    let seed = Number(process.env.PROBE_SEED);
    const random = () =>
      (seed = (seed * 1103515245 + 12345) % 2 ** 31) / 2 ** 31;
    const violations = [],
      active = new Map(),
      exclusivePeers = {},
      groupPeak = {};
    let peakSlots = 0;
    const rows = await scheduleSuites(table, {
      lightTasks: light,
      execute: async (row) => {
        active.set(row.name, { row, slots: row.gateContext.reservedSlots });
        const total = [...active.values()].reduce((sum, a) => sum + a.slots, 0);
        peakSlots = Math.max(peakSlots, total);
        if (total > row.gateContext.slotCapacity)
          violations.push(`slots ${total} at ${row.name}`);
        const exclusive = [...active.values()].filter(
          (a) => isolated(a.row) && !a.row.build,
        );
        if (exclusive.length > 1) violations.push("two exclusive rows");
        for (const e of exclusive) {
          const others = [...active.keys()].filter(
            (name) => name !== e.row.name,
          );
          exclusivePeers[e.row.name] = Math.max(
            exclusivePeers[e.row.name] ?? 0,
            others.length,
          );
          if (
            others.length >
            Math.min(e.row.overlap ?? 0, row.gateContext.slotCapacity - 1)
          )
            violations.push(`${e.row.name} peers ${others.length}`);
          for (const other of others)
            if (!light.has(other))
              violations.push(`heavy ${other} beside ${e.row.name}`);
        }
        for (const group of [
          "target-worktree",
          "launchpad-files",
          "hook-heavy",
        ])
          groupPeak[group] = Math.max(
            groupPeak[group] ?? 0,
            [...active.values()].filter((a) => a.row.group === group).length,
          );
        if (
          row.exclusive &&
          row.gateContext.slotCapacity >= 3 &&
          (row.gateContext.concurrency !== 3 ||
            row.gateContext.loadFactor !== 6 ||
            row.gateContext.loadClass !== "shared")
        )
          violations.push(`declaration ${row.name}`);
        await new Promise((done) =>
          setTimeout(
            done,
            ((measured.get(row.name) ?? 1000) / 4000) * (0.5 + random()),
          ),
        );
        active.delete(row.name);
        return { name: row.name, executed: true, exitCode: 0 };
      },
    });
    const counts = new Map();
    for (const row of rows)
      counts.set(row.name, (counts.get(row.name) ?? 0) + 1);
    print({
      cpus: (await import("node:os")).availableParallelism(),
      seed: process.env.PROBE_SEED,
      tasks: table.length,
      results: rows.length,
      failed: rows.filter((r) => r.exitCode).length,
      notOnce: table.filter((t) => counts.get(t.name) !== 1).map((t) => t.name),
      peakSlots,
      exclusivePeers,
      groupPeak,
      violations: violations.slice(0, 5),
      violationCount: violations.length,
    });
  },
  // Criterion 3 and 4 in the recorded after series: actual overlap of the
  // exclusive tasks, reserved-slot totals and the target-worktree group.
  async timelines() {
    const { lightSuiteNames } = await load("scripts/test-runner.mjs");
    const light = lightSuiteNames();
    const after = JSON.parse(
      readFileSync(join(repo, "docs/evidence/WO-222/after.json"), "utf8"),
    );
    const peak = (intervals) => {
      let current = 0,
        best = 0;
      for (const [, delta] of intervals
        .flatMap(([s, f, w = 1]) => [
          [s, w],
          [f, -w],
        ])
        .sort((a, b) => a[0] - b[0] || a[1] - b[1]))
        best = Math.max(best, (current += delta));
      return best;
    };
    for (const run of after.runs) {
      const tasks = run.gate.taskTimeline.map((t) => ({
        ...t,
        s: Date.parse(t.startedAt),
        f: Date.parse(t.finishedAt),
      }));
      const exclusive = {};
      for (const e of tasks.filter((t) =>
        ["harness-fixtures", "process-debt", "worktree-integration"].includes(
          t.name,
        ),
      )) {
        const overlapping = tasks.filter(
          (t) => t !== e && t.s < e.f && t.f > e.s,
        );
        exclusive[e.name] = {
          overlapping: overlapping.length,
          peakPeers: peak(
            overlapping.map((t) => [Math.max(t.s, e.s), Math.min(t.f, e.f)]),
          ),
          notLight: overlapping
            .filter((t) => !light.has(t.name))
            .map((t) => t.name),
          reservedSlots: e.reservedSlots,
          declared: `${e.loadClass}/${e.peerCap + 1}`,
        };
      }
      const targetWorktree = tasks.filter((t) =>
        t.name.startsWith("target-worktree:file:"),
      );
      print({
        ordinal: run.ordinal,
        exclusive,
        peakReservedSlots: peak(
          tasks.map((t) => [t.s, t.f, t.reservedSlots ?? 1]),
        ),
        targetWorktreePeak: peak(targetWorktree.map((t) => [t.s, t.f])),
        targetWorktreeTimeouts: [
          ...new Set(targetWorktree.map((t) => t.timeoutMs)),
        ],
      });
    }
  },
  // Criterion 4: registration-only collection of node:test names from the
  // base file (git show HEAD) and the four split files.
  async cases() {
    const scripts = join(repo, "scripts");
    const collect = async (text) => {
      const names = [];
      globalThis.__probeNames = names;
      const stub =
        "const test = new Proxy(function (name) { globalThis.__probeNames.push(String(name)); }, { get: (target, key) => ['skip', 'only', 'todo'].includes(key) ? ((name) => globalThis.__probeNames.push(key + ':' + name)) : (() => {}) });";
      let source = text.replace(
        /^import test(, \{[^}]*\})? from "node:test";/m,
        (_, more) =>
          (more ? `import ${more.slice(2)} from "node:test";\n` : "") + stub,
      );
      if (source === text) throw new Error("no node:test default import");
      source = source
        .replace(
          /from "(\.\.?\/[^"]+)"/gu,
          (_, spec) =>
            `from ${JSON.stringify(pathToFileURL(resolve(scripts, spec)).href)}`,
        )
        .replace(
          /import "(\.\.?\/[^"]+)";/gu,
          (_, spec) =>
            `import ${JSON.stringify(pathToFileURL(resolve(scripts, spec)).href)};`,
        );
      await import(
        `data:text/javascript;base64,${Buffer.from(source).toString("base64")}`
      );
      return names;
    };
    const baseText = spawnSync(
      "git",
      ["--no-pager", "show", "HEAD:scripts/test-target-worktree.mjs"],
      { cwd: repo, encoding: "utf8", maxBuffer: 64 * 2 ** 20 },
    ).stdout;
    const base = await collect(baseText);
    const split = {};
    for (const group of ["start", "publish", "close", "release"])
      split[group] = await collect(
        readFileSync(
          join(scripts, `test-target-worktree-${group}.mjs`),
          "utf8",
        ),
      );
    const after = Object.values(split).flat();
    const sorted = (list) => JSON.stringify([...list].sort());
    const lines = (text) =>
      text
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);
    const remaining = new Map();
    for (const line of lines(
      ["start", "publish", "close", "release"]
        .map((g) =>
          readFileSync(join(scripts, `test-target-worktree-${g}.mjs`), "utf8"),
        )
        .join("\n") +
        readFileSync(join(scripts, "lib/target-worktree-fixture.mjs"), "utf8"),
    ))
      remaining.set(line, (remaining.get(line) ?? 0) + 1);
    const absent = [];
    for (const line of lines(baseText)) {
      if (remaining.get(line)) remaining.set(line, remaining.get(line) - 1);
      else absent.push(line);
    }
    print({
      baseNames: base.length,
      baseUnique: new Set(base).size,
      baseDeclarations: [...baseText.matchAll(/^\s*test(?:\.\w+)?\(/gm)].length,
      perFile: Object.fromEntries(
        Object.entries(split).map(([k, v]) => [k, v.length]),
      ),
      afterNames: after.length,
      afterUnique: new Set(after).size,
      equal: sorted(base) === sorted(after),
      skipOrOnly: [...base, ...after].filter((n) =>
        /^(skip|only|todo):/.test(n),
      ).length,
      baseLinesAbsentFromSplit: absent,
    });
  },
  // Criterion 5: recompute medians, threshold, identities, host and deadline
  // observations from the two committed series files.
  async series() {
    const before = JSON.parse(
      readFileSync(join(repo, "docs/evidence/WO-222/before.json"), "utf8"),
    );
    const after = JSON.parse(
      readFileSync(join(repo, "docs/evidence/WO-222/after.json"), "utf8"),
    );
    const median = (values) => [...values].sort((a, b) => a - b)[1];
    const b = before.runs.map((r) => r.gate ?? r),
      a = after.runs.map((r) => r.gate);
    const names = (g) => new Set(g.taskTimeline.map((t) => t.name));
    const inventory = {};
    for (const name of new Set([...b, ...a].flatMap((g) => [...names(g)]))) {
      const pattern = [...b, ...a]
        .map((g) => (names(g).has(name) ? "1" : "0"))
        .join("");
      if (pattern !== "111111") inventory[name] = pattern;
    }
    print({
      before: b.map((g) => ({
        recordedAt: g.recordedAt,
        checkId: g.checkId,
        durationMs: g.durationMs,
        codeIdentity: g.codeIdentity,
        fresh: g.freshSuites,
        reused: g.reusedSuites,
        physicalBytes: g.memory?.budgets?.physicalBytes,
      })),
      after: after.runs.map((r) => ({
        ordinal: r.ordinal,
        startedAt: r.startedAt,
        finishedAt: r.finishedAt,
        recordedAt: r.gate.recordedAt,
        mode: r.gate.executionMode,
        exit: [r.processExitCode, r.gate.exitCode],
        durationMs: r.gate.durationMs,
        codeIdentity: r.gate.codeIdentity,
        fresh: r.gate.freshSuites,
        reused: r.gate.reusedSuites,
        host: r.host,
        maxDurationToTimeout: Math.max(
          ...r.gate.taskTimeline.map((t) => t.durationMs / t.timeoutMs),
        ),
        timedOut: r.gate.taskTimeline
          .filter(
            (t) => t.timedOut || t.failureKind === "timeout" || t.exitCode,
          )
          .map((t) => t.name),
        hits: r.deadlines
          .filter((d) => d.hits)
          .map((d) => `${d.task} ${d.site}`),
      })),
      beforeMedianMs: median(b.map((g) => g.durationMs)),
      afterMedianMs: median(a.map((g) => g.durationMs)),
      reductionVsMedian:
        1 -
        median(a.map((g) => g.durationMs)) / median(b.map((g) => g.durationMs)),
      reductionVsFastestBefore:
        1 -
        median(a.map((g) => g.durationMs)) /
          Math.min(...b.map((g) => g.durationMs)),
      inventoryDifferences: inventory,
    });
  },
  // Criteria 2 and 3: the committed scheduling baseline is the projection of
  // before.json the order names (largest task peak per row; latest sample).
  async baseline() {
    const before = JSON.parse(
      readFileSync(join(repo, "docs/evidence/WO-222/before.json"), "utf8"),
    );
    const baseline = JSON.parse(
      readFileSync(
        join(repo, "scripts/lib/gate-scheduling-baseline.json"),
        "utf8",
      ),
    );
    const rows = before.runs.map((r) => r.gate ?? r);
    const peaks = rows.map((g) => {
      const top = g.taskTimeline.reduce(
        (best, t) => (t.peakRssBytes > (best?.peakRssBytes ?? -1) ? t : best),
        null,
      );
      return {
        recordedAt: g.recordedAt,
        codeIdentity: g.codeIdentity,
        name: top.name,
        peakRssBytes: top.peakRssBytes,
      };
    });
    const latest = new Map();
    for (const g of [...rows].sort((x, y) =>
      x.recordedAt.localeCompare(y.recordedAt),
    ))
      for (const t of g.taskTimeline)
        latest.set(t.name, {
          name: t.name,
          loadClass: t.loadClass,
          durationMs: t.durationMs,
          peakRssBytes: t.peakRssBytes,
        });
    const { lightSuiteNames } = await load("scripts/test-runner.mjs");
    const recomputed = [...latest.values()]
      .filter(
        (t) =>
          t.loadClass === "shared" &&
          t.durationMs < 60_000 &&
          t.peakRssBytes < 512 * 2 ** 20,
      )
      .map((t) => t.name)
      .sort();
    print({
      taskPeaksMatch:
        JSON.stringify(peaks) === JSON.stringify(baseline.taskPeaks),
      samplesMatch:
        JSON.stringify(
          [...latest.values()].sort((x, y) => x.name.localeCompare(y.name)),
        ) ===
        JSON.stringify(
          [...baseline.taskSamples].sort((x, y) =>
            x.name.localeCompare(y.name),
          ),
        ),
      lightFromBefore: recomputed.length,
      lightFromModule: lightSuiteNames().size,
      lightSetsEqual:
        JSON.stringify(recomputed) ===
        JSON.stringify([...lightSuiteNames()].sort()),
      exclusiveNotLight: [
        "harness-fixtures",
        "process-debt",
        "worktree-integration",
      ].filter((n) => lightSuiteNames().has(n)),
    });
  },
  // Criterion 2: the structural host task on this host, and the admission
  // screen across processor and memory shapes (synthetic physical memory).
  async "host-budget"() {
    const { memoryBudgets, largestTaskPeakRss, recordedHostLaneCapacity } =
      await load("scripts/lib/host-resources.mjs");
    const { checkHost } = await load("scripts/structural-checks.mjs");
    const real = checkHost();
    print({
      host: "this",
      exitCode: real.exitCode,
      taskBudgetBytes: real.taskBudgetBytes,
      requiredPeakBytes: real.requiredPeakBytes,
      recordedCapacity: recordedHostLaneCapacity(),
      output: real.output.split("\n")[1],
    });
    const empty = mkdtempSync(join(tmpdir(), "wo222-ver-budget-"));
    try {
      const sample = {
        level: "normal",
        pressure: 1,
        swapBytes: 0,
        physicalBytes: 0,
        source: "probe",
      };
      for (const [cpus, gib] of [
        [16, 48],
        [16, 16],
        [16, 24],
        [8, 16],
        [8, 8],
        [4, 8],
        [32, 64],
      ]) {
        const capacity = Math.max(1, Math.min(8, Math.floor(cpus / 2)));
        const limits = memoryBudgets(empty, {
          capacity,
          physicalBytes: gib * 2 ** 30,
        });
        const result = checkHost(sample, {
          limits,
          requiredPeakBytes: largestTaskPeakRss(),
        });
        print({
          cpus,
          gib,
          capacity,
          taskBytes: limits.taskBytes,
          gateBytes: limits.gateBytes,
          exitCode: result.exitCode,
          line: result.output.split("\n")[1],
        });
      }
    } finally {
      rmSync(empty, { recursive: true, force: true });
    }
  },
};

if (!probes[probe]) {
  console.error(
    `usage: probes.mjs ${Object.keys(probes)
      .filter((name) => !name.endsWith("-child"))
      .join("|")}`,
  );
  process.exit(2);
}
await probes[probe]();
