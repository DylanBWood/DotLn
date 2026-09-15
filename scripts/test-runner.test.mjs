import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync, spawn } from "node:child_process";
import {
  existsSync,
  linkSync,
  mkdtempSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  writeFileSync,
  rmSync,
  symlinkSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import {
  suites,
  validateSuites,
  expand,
  executeSuite,
  scheduleSuites,
  runGate,
  expandSuiteTasks,
  aggregateSuiteRows,
} from "./test-runner.mjs";
import {
  activeGateRuns,
  beginGateRun,
  gateInputPath,
  gateRunLineage,
  gateStopRequested,
  GATE_RUN_ENVIRONMENT,
  recordGateChecks,
  readGateChecks,
  requestGateStop,
} from "./lib/gate-evidence.mjs";

const root = resolve(import.meta.dirname, "..");
const barrier = { name: "build", command: ["build"], build: true };
test("full inventory retains every command in the previous package test chain", () => {
  const before = JSON.parse(
    readFileSync(
      join(root, "scripts/fixtures/runner-baseline-v0.16.0.json"),
      "utf8",
    ),
  ).scripts.test.split(" && ");
  assert.equal(before.length, 37);
  const commands = suites.map((row) =>
    [...row.command, ...(row.args ?? [])]
      .filter((part) => !part.startsWith("--test-concurrency="))
      .map((part) => (part === process.execPath ? "node" : part))
      .join(" "),
  );
  for (const command of before) {
    if (
      command.startsWith("rm -rf ") ||
      command === "tsc -b --force" ||
      command.startsWith("ls packages/")
    ) {
      assert.ok(
        suites.some(
          (row) => row.build && row.command[1] === "scripts/build.mjs",
        ),
      );
      continue;
    }
    if (command.includes("packages/kernel/dist/test")) {
      for (const name of ["kernel", "compiler", "skeleton"])
        assert.ok(suites.some((row) => row.name === name));
      continue;
    }
    const normalized = command
      .replace(
        "npm run test:mutation --silent",
        "node --test corpus/mutation/wo108-selftest.test.mjs",
      )
      .replace(
        /^(node scripts\/(?:authority|feedback)-evidence\.mjs --check) --edition WO-\d{3}(?: --revision \d{3})?$/,
        "$1",
      )
      .replace(
        /^node (scripts\/test-(?:github-body|plan-refutation)\.mjs)$/,
        "node --test $1",
      );
    assert.ok(
      commands.includes(normalized),
      `missing prior command: ${command}`,
    );
  }
});
test("package suites bound child-file concurrency as well as outer scheduling", () => {
  for (const name of ["kernel", "compiler", "skeleton", "console"]) {
    const row = suites.find((suite) => suite.name === name);
    assert.ok(row.fileConcurrency >= 1 && row.fileConcurrency <= 2);
    assert.ok(
      row.command.includes(`--test-concurrency=${row.fileConcurrency}`),
    );
  }
});
test("build is a barrier, independent suites overlap, shared groups cannot overlap", async () => {
  const events = [],
    active = new Set();
  let built = false,
    overlap = false;
  const table = [
    barrier,
    { name: "a", command: ["a"], group: "shared" },
    { name: "b", command: ["b"], group: "shared" },
    { name: "c", command: ["c"] },
  ];
  const results = await scheduleSuites(table, {
    concurrency: 3,
    execute: async (row) => {
      events.push(`start:${row.name}`);
      if (!row.build) {
        assert.ok(built);
        if (row.group) assert.ok(!active.has(row.group));
        if (active.size) overlap = true;
      }
      active.add(row.group ?? row.name);
      await new Promise((done) => setTimeout(done, 10));
      active.delete(row.group ?? row.name);
      if (row.build) built = true;
      events.push(`end:${row.name}`);
      return { name: row.name, exitCode: 0 };
    },
  });
  assert.equal(results.length, 4);
  assert.ok(overlap);
  assert.ok(events.indexOf("end:build") < events.indexOf("start:a"));
  assert.ok(events.indexOf("end:a") < events.indexOf("start:b"));
});
test("serial scheduling has one active suite and failed build launches no dependents", async () => {
  let active = 0,
    peak = 0;
  await scheduleSuites(
    [
      barrier,
      { name: "one", command: ["one"] },
      { name: "two", command: ["two"] },
    ],
    {
      concurrency: 1,
      execute: async (row) => {
        peak = Math.max(peak, ++active);
        await Promise.resolve();
        active--;
        return { name: row.name, exitCode: 0 };
      },
    },
  );
  assert.equal(peak, 1);
  const rows = await scheduleSuites(
    [barrier, { name: "never", command: ["never"] }],
    { execute: async (row) => ({ name: row.name, exitCode: 1 }) },
  );
  assert.deepEqual(
    rows.map((row) => row.name),
    ["build"],
  );
  assert.throws(() => validateSuites([barrier, barrier]), /duplicate/);
});
test("stale generated evidence stops the gate before expensive fixtures", async () => {
  const selected = suites.filter((row) =>
    ["build", "authority-evidence", "index", "harness-fixtures"].includes(
      row.name,
    ),
  );
  const started = [];
  const rows = await scheduleSuites(expandSuiteTasks(selected, root), {
    execute: async (row) => {
      started.push(row.name);
      return {
        name: row.name,
        executed: true,
        exitCode: row.name === "authority-evidence" ? 1 : 0,
      };
    },
  });
  assert.ok(started.includes("authority-evidence"));
  assert.ok(started.includes("index"));
  assert.ok(!started.includes("harness-fixtures"));
  assert.equal(
    rows.find((row) => row.name === "harness-fixtures").executed,
    false,
  );
});
test("package tests and fixtures wait for preflights and never start after a failed preflight", async () => {
  for (const indexExit of [0, 1]) {
    const selected = suites.filter((row) =>
      ["build", "skeleton", "console", "index", "resume"].includes(row.name),
    );
    const events = [];
    const rows = await scheduleSuites(expandSuiteTasks(selected, root), {
      concurrency: 4,
      execute: async (row) => {
        events.push(`start:${row.name}`);
        if (row.name === "index")
          await new Promise((done) => setTimeout(done, 15));
        events.push(`end:${row.name}`);
        return {
          name: row.name,
          executed: true,
          exitCode: row.name === "index" ? indexExit : 0,
        };
      },
    });
    for (const name of [
      "skeleton",
      "console:fixtures",
      "console:current",
      "resume",
    ]) {
      if (indexExit) {
        assert.ok(!events.includes(`start:${name}`));
        assert.equal(rows.find((row) => row.name === name).executed, false);
        assert.ok(rows.some((row) => row.exitCode !== 0));
      } else
        assert.ok(
          events.indexOf("end:index") < events.indexOf(`start:${name}`),
        );
    }
  }
});

test("failed split-case diagnostics survive aggregate evidence as addressed logs", (t) => {
  const repo = mkdtempSync(join(tmpdir(), "dotln-case-output-"));
  t.after(() => rmSync(repo, { recursive: true, force: true }));
  const selected = [{ name: "release" }];
  const tasks = [
    "release:prepare",
    "release:case:concurrent",
    "release:case:passing",
  ].map((name) => ({ name }));
  const rows = tasks.map(({ name }) => ({
    name,
    executed: true,
    exitCode: name.endsWith(":concurrent") ? 1 : 0,
    output: name.endsWith(":concurrent")
      ? "retained failure details\n"
      : "passing noise\n",
  }));
  recordGateChecks(repo, [
    {
      ...aggregateSuiteRows(selected, tasks, rows)[0],
      checkId: "suite:release",
      treeHash: "a".repeat(40),
      recordedAt: new Date().toISOString(),
    },
  ]);
  const [recorded] = readGateChecks(repo);
  assert.equal(recorded.exitCode, 1);
  const failed = recorded.cases.find((row) => row.name.endsWith(":concurrent"));
  assert.ok(failed.outputRef);
  assert.equal(
    readFileSync(join(repo, failed.outputRef), "utf8"),
    "retained failure details\n",
  );
  assert.ok(recorded.cases.every((row) => !Object.hasOwn(row, "output")));
  assert.ok(
    recorded.cases
      .filter((row) => row.exitCode === 0)
      .every((row) => !row.outputRef),
  );
});
test("constraint suites keep one-piece flow and the measured lane budget", () => {
  const tasks = expandSuiteTasks(
    suites.filter((row) => !row.document || row.fast),
    root,
    "/synthetic-template",
  );
  assert.equal(tasks.length, 82);
  const planning = tasks.find((row) => row.name === "plan-refutation:fixtures");
  assert.equal(planning?.loadClass, undefined);
  assert.equal(planning?.loadSlots, 1);
  assert.ok(planning?.after.includes("harness-fixtures"));
  assert.equal(
    tasks.find((row) => row.name === "runner-fixtures")?.loadClass,
    "isolated",
  );
});
test("weighted lanes admit one light hook peer and pair cost-ranked heavy tasks", async () => {
  const selected = suites.filter((row) =>
    [
      "build",
      "skeleton",
      "console",
      "harness-fixtures",
      "process-debt",
    ].includes(row.name),
  );
  const active = new Map(),
    overlap = new Set();
  const rows = await scheduleSuites(expandSuiteTasks(selected, root), {
    concurrency: 4,
    execute: async (row) => {
      assert.equal(
        row.gateContext.loadClass,
        row.build ? "isolated" : "shared",
      );
      assert.ok(
        [...active.values()].reduce((sum, slots) => sum + slots, 0) +
          row.gateContext.reservedSlots <=
          4,
      );
      if (["harness-fixtures", "process-debt"].includes(row.name)) {
        assert.equal(row.gateContext.reservedSlots, 3);
        assert.equal(row.gateContext.concurrency, 2);
        assert.ok(
          !["harness-fixtures", "process-debt"].some((name) =>
            active.has(name),
          ),
        );
      }
      if (
        [...active.keys()].some((name) =>
          ["harness-fixtures", "process-debt"].includes(name),
        )
      )
        assert.equal(row.gateContext.reservedSlots, 1);
      active.set(row.name, row.gateContext.reservedSlots);
      if (active.has("harness-fixtures") && active.has("process-debt"))
        overlap.add("hooks");
      if (active.has("harness-fixtures") && active.has("console:fixtures"))
        overlap.add("hook-light");
      if (active.has("skeleton") && active.has("console:current"))
        overlap.add("heavy-pair");
      await new Promise((done) => setTimeout(done, 10));
      active.delete(row.name);
      return { name: row.name, exitCode: 0, executed: true };
    },
  });
  assert.equal(rows.length, selected.length + 1);
  assert.ok(overlap.has("hook-light"));
  assert.ok(overlap.has("heavy-pair"));
  assert.equal(overlap.has("hooks"), false);
  for (const concurrency of [1, 2, 4]) {
    await scheduleSuites(
      [
        barrier,
        { name: "running", command: ["fixture"], priority: 2 },
        {
          name: "exclusive",
          command: ["fixture"],
          exclusive: true,
          priority: 1,
        },
        { name: "later", command: ["fixture"] },
      ],
      {
        concurrency,
        execute: async (row) => {
          if (row.exclusive) assert.equal(active.size, 0);
          else assert.ok(!active.has("exclusive"));
          active.set(row.name, row.gateContext.reservedSlots);
          await new Promise((done) => setTimeout(done, 5));
          active.delete(row.name);
          return { name: row.name, exitCode: 0 };
        },
      },
    );
  }
});
test("test discovery refuses missing compiled cases instead of silently succeeding", () => {
  const repo = mkdtempSync(join(tmpdir(), "dotln-runner-"));
  try {
    assert.throws(
      () => expand(["packages/missing/dist/test/*.test.js"], repo),
      /Missing built test suite/,
    );
    mkdirSync(join(repo, "test"));
    writeFileSync(join(repo, "test/one.test.js"), "");
    assert.deepEqual(expand(["test/*.test.js"], repo), ["test/one.test.js"]);
  } finally {
    rmSync(repo, { recursive: true, force: true });
  }
});
test("timeout is an executed failure with suite identity and measured duration", async () => {
  const row = await executeSuite(
    {
      name: "slow-fixture",
      command: [process.execPath, "-e", "setInterval(() => {}, 1000)"],
    },
    root,
    35,
  );
  assert.equal(row.executed, true);
  assert.notEqual(row.exitCode, 0);
  assert.ok(row.durationMs >= 35);
  assert.match(row.output, /Suite slow-fixture timed out/);
});

test("only and document CLI selection execute their declared checks without a code build", async () => {
  const repo = mkdtempSync(join(tmpdir(), "dotln-runner-cli-"));
  try {
    const git = (...args) =>
      execFileSync("git", args, {
        cwd: repo,
        encoding: "utf8",
        stdio: ["ignore", "pipe", "pipe"],
      });
    git("init", "-q");
    git("config", "user.name", "Fixture");
    git("config", "user.email", "fixture@example.invalid");
    writeFileSync(
      join(repo, ".gitignore"),
      "docs/control/local/\nobserved.jsonl\n",
    );
    mkdirSync(join(repo, "scripts"));
    const observer =
      'require("node:fs").appendFileSync("observed.jsonl", JSON.stringify(process.argv.slice(1))+"\\n");';
    for (const file of [
      "format.cjs",
      "check-publication.mjs",
      "work-orders.mjs",
      "refute-plan.mjs",
    ])
      writeFileSync(
        join(repo, "scripts", file),
        file.endsWith(".mjs")
          ? observer
              .replace('require("node:fs")', "fs")
              .replace(/^/, 'import fs from "node:fs";\n')
          : observer,
      );
    writeFileSync(
      join(repo, "scripts/build.mjs"),
      'throw new Error("document gate ran a code build");',
    );
    writeFileSync(
      join(repo, "package.json"),
      JSON.stringify({
        scripts: { "format:check": "node scripts/format.cjs" },
      }),
    );
    git("add", ".");
    git("commit", "-qm", "Runner fixture");
    assert.equal(
      (await runGate(["--only", "format", "--serial"], repo)).exitCode,
      0,
    );
    let observed = readFileSync(join(repo, "observed.jsonl"), "utf8")
      .trim()
      .split("\n")
      .map(JSON.parse);
    assert.equal(observed.length, 1);
    assert.ok(observed[0][0].endsWith("format.cjs"));
    assert.equal((await runGate(["--document", "--serial"], repo)).exitCode, 0);
    observed = readFileSync(join(repo, "observed.jsonl"), "utf8")
      .trim()
      .split("\n")
      .map(JSON.parse);
    assert.equal(observed.length, 4);
    assert.ok(!observed.some((row) => row[0].includes("build")));
    assert.deepEqual(observed.at(-1).slice(1), ["check"]);
    const repeated = await runGate(["--document", "--serial"], repo);
    assert.equal(
      repeated.reusedSuites,
      3,
      "source checks reuse the same tree while publication observes local terms",
    );
    assert.equal(
      readFileSync(join(repo, "observed.jsonl"), "utf8").trim().split("\n")
        .length,
      5,
    );
    await assert.rejects(runGate(["--only", "unknown"], repo), /Unknown suite/);
    assert.deepEqual(
      activeGateRuns(repo),
      [],
      "normal and throwing runs release their markers",
    );
  } finally {
    rmSync(repo, { recursive: true, force: true });
  }
});

test("WO-125 nested gate markers remain independent and local to their worktree", (t) => {
  const repo = mkdtempSync(join(tmpdir(), "dotln-gate-markers-"));
  const other = mkdtempSync(join(tmpdir(), "dotln-gate-other-"));
  t.after(() => {
    rmSync(repo, { recursive: true, force: true });
    rmSync(other, { recursive: true, force: true });
  });
  const first = beginGateRun(repo, "outer evidence fixture");
  const second = beginGateRun(repo, "inner runner fixture");
  try {
    assert.equal(activeGateRuns(repo).length, 2);
    assert.deepEqual(activeGateRuns(other), []);
    first.release();
    assert.deepEqual(
      activeGateRuns(repo).map((run) => run.runId),
      [second.run.runId],
    );
  } finally {
    first.release();
    second.release();
  }
  assert.deepEqual(activeGateRuns(repo), []);
});

test("WO-044 a stop request reaches a gate through its marker lineage and is consumed with the marker", async (t) => {
  const repo = mkdtempSync(join(tmpdir(), "dotln-gate-stop-"));
  const markers = join(repo, "docs/control/local/harness/active-gates");
  const saved = process.env[GATE_RUN_ENVIRONMENT];
  t.after(() => {
    if (saved === undefined) delete process.env[GATE_RUN_ENVIRONMENT];
    else process.env[GATE_RUN_ENVIRONMENT] = saved;
    rmSync(repo, { recursive: true, force: true });
  });
  delete process.env[GATE_RUN_ENVIRONMENT];
  const idle = requestGateStop(repo, { waitMs: 0 });
  assert.deepEqual(idle, {
    contract: "gate-stop-v1",
    requestedAt: idle.requestedAt,
    requested: [],
    stopped: [],
    active: [],
  });
  assert.ok(Number.isFinite(Date.parse(idle.requestedAt)));
  // A stale request left by a dead run is swept, never honoured by a new run.
  mkdirSync(markers, { recursive: true });
  const stale = "00000000-0000-4000-8000-000000000000";
  writeFileSync(join(markers, `${stale}.stop`), "{}\n");
  requestGateStop(repo, { waitMs: 0 });
  assert.equal(existsSync(join(markers, `${stale}.stop`)), false);
  const outer = beginGateRun(repo, "outer evidence fixture");
  assert.deepEqual(gateRunLineage(), [outer.run.runId]);
  const inner = beginGateRun(repo, "inner runner fixture");
  assert.deepEqual(gateRunLineage(), [outer.run.runId, inner.run.runId]);
  try {
    assert.equal(outer.stopRequested(), false);
    assert.equal(inner.stopRequested(), false);
    // This process owns both runs, so they stay active for the bounded wait;
    // each carries a request afterwards and reads it at its next boundary.
    const outcome = requestGateStop(repo, { waitMs: 0 });
    assert.deepEqual(
      outcome.requested.map((run) => run.runId).sort(),
      [outer.run.runId, inner.run.runId].sort(),
    );
    assert.deepEqual(outcome.stopped, []);
    assert.equal(outcome.active.length, 2);
    assert.ok(
      outcome.active.every(
        (run) => run.pid === process.pid && run.command && run.startedAt,
      ),
    );
    assert.equal(outer.stopRequested(), true);
    assert.equal(inner.stopRequested(), true);
    assert.deepEqual(gateStopRequested(repo, [inner.run.runId]), [
      inner.run.runId,
    ]);
    // A child of the inner run inherits both ids and sees the request.
    const child = spawn(
      process.execPath,
      [
        "--input-type=module",
        "-e",
        `import {gateStopRequested} from ${JSON.stringify(resolve(root, "scripts/lib/gate-evidence.mjs"))}; process.stdout.write(JSON.stringify(gateStopRequested(process.cwd())));`,
      ],
      { cwd: repo, stdio: ["ignore", "pipe", "pipe"] },
    );
    let stdout = "";
    child.stdout.on("data", (chunk) => (stdout += chunk));
    await new Promise((resolveExit) => child.once("close", resolveExit));
    assert.deepEqual(
      JSON.parse(stdout).sort(),
      [outer.run.runId, inner.run.runId].sort(),
    );
  } finally {
    inner.release();
    outer.release();
  }
  assert.deepEqual(gateRunLineage(), []);
  assert.equal(process.env[GATE_RUN_ENVIRONMENT], undefined);
  assert.deepEqual(
    readdirSync(markers).filter((name) => /\.(?:json|stop)$/.test(name)),
    [],
    "release removes the marker and its consumed request",
  );
});

test("WO-044 a gate that polls its request ends within the stop command's wait and leaves nothing behind", async (t) => {
  const repo = mkdtempSync(join(tmpdir(), "dotln-gate-stop-child-"));
  t.after(() => rmSync(repo, { recursive: true, force: true }));
  const markers = join(repo, "docs/control/local/harness/active-gates");
  const child = spawn(
    process.execPath,
    [
      "--input-type=module",
      "-e",
      `import {beginGateRun} from ${JSON.stringify(resolve(root, "scripts/lib/gate-evidence.mjs"))}; const active = beginGateRun(process.cwd(), "polling gate fixture"); process.stdout.write("ready"); const timer = setInterval(() => { if (active.stopRequested()) { clearInterval(timer); active.release(); process.exit(0); } }, 50);`,
    ],
    { cwd: repo, stdio: ["ignore", "pipe", "pipe"] },
  );
  const exited = new Promise((resolveExit) => child.once("close", resolveExit));
  await new Promise((resolveReady, reject) => {
    child.stdout.once("data", resolveReady);
    child.once("error", reject);
    child.once("exit", () => reject(new Error("gate exited before ready")));
  });
  assert.equal(activeGateRuns(repo).length, 1);
  const outcome = requestGateStop(repo, { waitMs: 10_000 });
  assert.equal(outcome.requested.length, 1);
  assert.equal(outcome.requested[0].pid, child.pid);
  assert.deepEqual(outcome.stopped, outcome.requested);
  assert.deepEqual(outcome.active, []);
  assert.equal(await exited, 0);
  assert.deepEqual(activeGateRuns(repo), []);
  assert.deepEqual(
    readdirSync(markers).filter((name) => /\.(?:json|stop)$/.test(name)),
    [],
  );
});

test("WO-044 the runner honours a stop request at its next boundary, ends running suites and records no check", async () => {
  const repo = mkdtempSync(join(tmpdir(), "dotln-runner-stop-"));
  try {
    const git = (...args) =>
      execFileSync("git", args, {
        cwd: repo,
        encoding: "utf8",
        stdio: ["ignore", "pipe", "pipe"],
      });
    git("init", "-q");
    git("config", "user.name", "Fixture");
    git("config", "user.email", "fixture@example.invalid");
    writeFileSync(
      join(repo, ".gitignore"),
      "docs/control/local/\nobserved.jsonl\n",
    );
    mkdirSync(join(repo, "scripts"));
    // The suite announces itself, then stays resident long enough for the
    // runner's poll to end it; a run to completion would take five seconds.
    writeFileSync(
      join(repo, "scripts/format.cjs"),
      'require("node:fs").appendFileSync("observed.jsonl", "format\\n"); setTimeout(() => {}, 5000);',
    );
    writeFileSync(
      join(repo, "package.json"),
      JSON.stringify({
        scripts: { "format:check": "node scripts/format.cjs" },
      }),
    );
    git("add", ".");
    git("commit", "-qm", "Runner stop fixture");
    // A request already present ends the gate before its first suite.
    await assert.rejects(
      runGate(["--only", "format", "--serial"], repo, {
        stopRequested: () => true,
      }),
      /^Error: Gate stopped by request after [\d.]+ s; no check recorded for tree [a-f0-9]{40,64}$/,
    );
    assert.equal(existsSync(join(repo, "observed.jsonl")), false);
    assert.deepEqual(readGateChecks(repo), []);
    assert.deepEqual(activeGateRuns(repo), []);
    // A request that arrives while a suite runs ends that suite through the
    // runner's own abort signal; the suite reports the stop, not a pass.
    const started = Date.now();
    await assert.rejects(
      runGate(["--only", "format", "--serial"], repo, {
        stopRequested: () => existsSync(join(repo, "observed.jsonl")),
      }),
      /Gate stopped by request/,
    );
    assert.ok(
      Date.now() - started < 4000,
      "the resident suite was ended, not awaited",
    );
    assert.equal(
      readFileSync(join(repo, "observed.jsonl"), "utf8"),
      "format\n",
    );
    assert.deepEqual(readGateChecks(repo), []);
    assert.deepEqual(activeGateRuns(repo), []);
  } finally {
    rmSync(repo, { recursive: true, force: true });
  }
});

test("WO-044 an aborted signal ends a running suite and its result names the stop", async () => {
  const controller = new AbortController();
  const started = Date.now();
  setTimeout(() => controller.abort(), 200);
  const result = await executeSuite(
    {
      name: "resident",
      command: [
        process.execPath,
        "-e",
        'process.on("SIGTERM", () => {}); setInterval(() => {}, 1000);',
      ],
    },
    root,
    60_000,
    () => {},
    controller.signal,
  );
  assert.equal(result.exitCode, 1);
  assert.equal(result.stopped, true);
  assert.match(result.output, /Suite resident stopped by gate request/);
  assert.ok(
    Date.now() - started < 10_000,
    "SIGKILL follows an ignored SIGTERM",
  );
  const already = await executeSuite(
    {
      name: "never",
      command: [process.execPath, "-e", "setInterval(() => {}, 1000)"],
    },
    root,
    60_000,
    () => {},
    AbortSignal.abort(),
  );
  assert.equal(already.stopped, true);
  assert.equal(already.exitCode, 1);
});

test("WO-044 VER-001 cancellation ends a grandchild holding inherited output pipes", async (t) => {
  const repo = mkdtempSync(join(tmpdir(), "dotln-suite-descendants-"));
  let descendant;
  t.after(() => {
    if (descendant)
      try {
        process.kill(descendant, "SIGKILL");
      } catch {}
    rmSync(repo, { recursive: true, force: true });
  });
  const controller = new AbortController();
  const running = executeSuite(
    {
      name: "descendants",
      command: [
        process.execPath,
        "-e",
        `
    const {spawn} = require('node:child_process');
    const child = spawn(process.execPath, ['-e', 'process.on("SIGTERM",()=>{});require("node:fs").writeFileSync("ready", "yes");setInterval(()=>{},1000)'], {stdio:'inherit'});
    require('node:fs').writeFileSync('descendant.pid', String(child.pid));
    setInterval(()=>{},1000);
  `,
      ],
    },
    repo,
    10000,
    () => {},
    controller.signal,
  );
  for (let i = 0; i < 100 && !existsSync(join(repo, "ready")); i++)
    await new Promise((resolve) => setTimeout(resolve, 20));
  descendant = Number(readFileSync(join(repo, "descendant.pid"), "utf8"));
  const started = Date.now();
  controller.abort();
  const result = await running;
  assert.equal(result.stopped, true);
  assert.equal(result.exitCode, 1);
  assert.ok(
    Date.now() - started < 2500,
    "inherited descriptors cannot hang cancellation",
  );
});

test("WO-125 gate inputs include tracked ignored files and new installed roots, excluding scratch", (t) => {
  const repo = mkdtempSync(join(tmpdir(), "dotln-gate-inputs-"));
  t.after(() => rmSync(repo, { recursive: true, force: true }));
  execFileSync("git", ["init", "-q"], { cwd: repo });
  mkdirSync(join(repo, "scratch"));
  writeFileSync(join(repo, ".gitignore"), "scratch/\nnode_modules/\ndist/\n");
  writeFileSync(join(repo, "scratch/retained.txt"), "tracked\n");
  execFileSync("git", ["add", "-f", "scratch/retained.txt"], { cwd: repo });
  assert.equal(gateInputPath(repo, "scratch/new.txt"), false);
  assert.equal(gateInputPath(repo, "scratch/retained.txt"), true);
  assert.equal(gateInputPath(repo, "new-source.ts"), true);
  assert.equal(
    gateInputPath(repo, "node_modules/new-dependency/index.js"),
    true,
  );
  assert.equal(gateInputPath(repo, "packages/new-package/dist/index.js"), true);
});

test("WO-125 VER-002 installed input case aliases include prospective roots", (t) => {
  const repo = mkdtempSync(join(tmpdir(), "dotln-gate-case-"));
  t.after(() => rmSync(repo, { recursive: true, force: true }));
  execFileSync("git", ["init", "-q"], { cwd: repo });
  mkdirSync(join(repo, "node_modules"));
  mkdirSync(join(repo, "packages/skeleton/dist"), { recursive: true });
  mkdirSync(join(repo, "packages/future"));
  writeFileSync(join(repo, ".gitignore"), "node_modules/\ndist/\n");
  if (!existsSync(join(repo, "NODE_MODULES"))) {
    t.skip("requires a case-insensitive filesystem");
    return;
  }
  for (const path of [
    "NODE_MODULES/probe.js",
    "Node_Modules/probe.js",
    "Packages/skeleton/dist/probe.js",
    "packages/skeleton/DIST/probe.js",
    "packages/future/DIST/probe.js",
  ])
    assert.equal(gateInputPath(repo, path), true, path);
});

test("WO-125 VER-002 resolves dangling links and physical parent traversal", (t) => {
  const repo = mkdtempSync(join(tmpdir(), "dotln-gate-symlink-"));
  t.after(() => rmSync(repo, { recursive: true, force: true }));
  execFileSync("git", ["init", "-q"], { cwd: repo });
  mkdirSync(join(repo, "scratch"));
  mkdirSync(join(repo, "packages/skeleton"), { recursive: true });
  writeFileSync(join(repo, ".gitignore"), "scratch/\n");
  symlinkSync("../new-input.md", join(repo, "scratch/dangling.md"));
  symlinkSync("dangling.md", join(repo, "scratch/chained.md"));
  symlinkSync("../packages/skeleton", join(repo, "scratch/dirlink"));
  symlinkSync("dirlink/../linked.md", join(repo, "scratch/parent.md"));
  for (const path of [
    "scratch/dangling.md",
    "scratch/chained.md",
    "scratch/parent.md",
    "scratch/dirlink/../probe-new.md",
    "scratch/dirlink/../../new-input.md",
  ])
    assert.equal(gateInputPath(repo, path), true, path);
  symlinkSync("new-scratch.md", join(repo, "scratch/local.md"));
  symlinkSync(".", join(repo, "scratch/local-dir"));
  assert.equal(gateInputPath(repo, "scratch/local.md"), false);
  assert.equal(gateInputPath(repo, "scratch/local-dir/new.md"), false);
  symlinkSync("cycle.md", join(repo, "scratch/cycle.md"));
  assert.throws(() => gateInputPath(repo, "scratch/cycle.md"));
});

test("WO-125 VER-003 protects pre-existing hard links while ordinary scratch stays writable", (t) => {
  const repo = mkdtempSync(join(tmpdir(), "dotln-gate-hardlink-"));
  t.after(() => rmSync(repo, { recursive: true, force: true }));
  execFileSync("git", ["init", "-q"], { cwd: repo });
  mkdirSync(join(repo, "scratch"));
  writeFileSync(join(repo, ".gitignore"), "scratch/\n");
  writeFileSync(join(repo, "input.ts"), "export const value = 1;\n");
  execFileSync("git", ["add", "input.ts"], { cwd: repo });
  linkSync(join(repo, "input.ts"), join(repo, "scratch/input-link.ts"));
  symlinkSync("input-link.ts", join(repo, "scratch/via-symlink.ts"));
  for (const path of ["scratch/input-link.ts", "scratch/via-symlink.ts"])
    assert.equal(gateInputPath(repo, path), true, path);

  writeFileSync(join(repo, "scratch/local.txt"), "scratch\n");
  assert.equal(gateInputPath(repo, "scratch/local.txt"), false);
  assert.equal(gateInputPath(repo, "scratch/new.txt"), false);
  assert.equal(gateInputPath(repo, "scratch"), false);
  linkSync(
    join(repo, "scratch/local.txt"),
    join(repo, "scratch/local-link.txt"),
  );
  assert.equal(gateInputPath(repo, "scratch/local-link.txt"), true);
});

test("release cases use one background lane, wait for preparation and require complete coverage", async () => {
  const selected = [barrier, suites.find((row) => row.name === "release")];
  const tasks = expandSuiteTasks(selected, root, "/synthetic-template");
  assert.equal(
    tasks.filter((row) => row.name.startsWith("release:case:")).length,
    42,
  );
  let active = 0,
    activeCases = 0,
    peak = 0,
    prepared = false;
  const rows = await scheduleSuites(tasks, {
    concurrency: 4,
    execute: async (row) => {
      if (row.name.startsWith("release:case:")) {
        assert.ok(prepared);
        assert.equal(activeCases++, 0);
      }
      peak = Math.max(peak, ++active);
      await new Promise((done) => setTimeout(done, 1));
      active--;
      if (row.name.startsWith("release:case:")) activeCases--;
      if (row.name === "release:prepare") prepared = true;
      return { name: row.name, exitCode: 0, executed: true, durationMs: 1 };
    },
  });
  assert.equal(peak, 1);
  assert.equal(aggregateSuiteRows(selected, tasks, rows)[1].exitCode, 0);
  assert.equal(
    aggregateSuiteRows(selected, tasks, rows.slice(0, -1))[1].exitCode,
    1,
  );
  assert.equal(
    aggregateSuiteRows(selected, tasks, [...rows, rows.at(-1)])[1].exitCode,
    1,
  );
  const refused = await scheduleSuites(tasks, {
    execute: async (row) => ({
      name: row.name,
      exitCode: row.name === "release:prepare" ? 1 : 0,
      executed: true,
    }),
  });
  assert.equal(
    refused.filter(
      (row) => row.name.startsWith("release:case:") && row.executed,
    ).length,
    0,
  );
  assert.equal(aggregateSuiteRows(selected, tasks, refused)[1].exitCode, 1);
});

test("console split executes every fixture and the current check exactly once", async (t) => {
  const repo = mkdtempSync(join(tmpdir(), "dotln-console-dispatch-"));
  t.after(() => rmSync(repo, { recursive: true, force: true }));
  const directory = join(repo, "packages/console/dist/test");
  mkdirSync(directory, { recursive: true });
  const names = [
    "WO-032 AC1/6 fixture",
    "WO-032 schema fixture",
    "WO-032 host collection reads current sources and all shipped exports",
  ];
  writeFileSync(
    join(directory, "board.test.js"),
    `const test = require('node:test');\n${names
      .map((name) => `test(${JSON.stringify(name)}, () => {});`)
      .join("\n")}\n`,
  );
  const tasks = expandSuiteTasks(
    [suites.find((row) => row.name === "console")],
    repo,
  );
  const observed = [];
  for (const [index, row] of tasks.entries()) {
    const result = await executeSuite(row, repo);
    assert.equal(result.exitCode, 0, result.output);
    const executed = [...result.output.matchAll(/^ok \d+ - (.+)$/gm)].map(
      (match) => match[1],
    );
    assert.deepEqual(
      executed,
      index === 0 ? names.slice(0, 2) : names.slice(2),
    );
    observed.push(...executed);
  }
  assert.deepEqual(observed, names);
});

test("planning task dispatch delivers each selection flag to the executable", async (t) => {
  const repo = mkdtempSync(join(tmpdir(), "dotln-plan-dispatch-"));
  t.after(() => rmSync(repo, { recursive: true, force: true }));
  mkdirSync(join(repo, "scripts"));
  writeFileSync(
    join(repo, "scripts/test-plan-refutation.mjs"),
    "console.log(JSON.stringify(process.argv.slice(2)));\n",
  );
  const tasks = expandSuiteTasks(
    [suites.find((row) => row.name === "plan-refutation")],
    repo,
  );
  assert.equal(tasks.length, 2);
  for (const [index, flag] of ["--fixtures-only", "--check-only"].entries()) {
    const result = await executeSuite(tasks[index], repo);
    assert.equal(result.exitCode, 0);
    assert.deepEqual(JSON.parse(result.output), [flag]);
  }
});

test("live progress arrives before a running process completes and remains bounded", async () => {
  const observed = [];
  let finished = false;
  let observeStarted;
  const started = new Promise((done) => {
    observeStarted = done;
  });
  const running = executeSuite(
    {
      name: "progress",
      command: [
        process.execPath,
        "-e",
        'console.log("PROGRESS fixture begun"); setTimeout(() => console.log("done"), 100);',
      ],
    },
    root,
    1000,
    (row) => {
      observed.push(row);
      assert.equal(finished, false);
      if (row.message === "PROGRESS fixture begun") observeStarted();
    },
  );
  await Promise.race([started, running]);
  assert.ok(observed.some((row) => row.message === "PROGRESS fixture begun"));
  const result = await running;
  finished = true;
  assert.equal(result.exitCode, 0);
  assert.ok(Date.parse(result.finishedAt) >= Date.parse(result.startedAt));
  const lots = [];
  await executeSuite(
    {
      name: "bounded",
      command: [
        process.execPath,
        "-e",
        'for(let i=0;i<100;i++) console.log("PROGRESS "+"x".repeat(500));',
      ],
    },
    root,
    1000,
    (row) => lots.push(row),
  );
  assert.equal(lots.length, 81);
  assert.ok(lots.every((row) => row.message.length <= 200));
});
