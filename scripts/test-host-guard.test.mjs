import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync, spawn } from "node:child_process";
import {
  mkdtempSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  existsSync,
  fstatSync,
  writeFileSync,
  rmSync,
  cpSync,
  realpathSync,
} from "node:fs";
import {
  tmpdir,
  totalmem,
  platform,
  release,
  availableParallelism,
} from "node:os";
import { join, resolve } from "node:path";
import { once } from "node:events";
import { executeSuite, runGate, suites } from "./test-runner.mjs";
import { guardCensus } from "./host-guard.mjs";
import { agentAncestor, ensureHostGuard } from "./lib/host-guard-state.mjs";
import { acquireHostLanes, laneHolderAlive } from "./lib/host-lanes.mjs";
import {
  atomicJson,
  appendIncident,
  delay,
  hostStateRoot,
  memoryBudgets,
  nativeCompiler,
  killOwned,
  observeSwapGrowth,
  ownedProcesses,
  processAlive,
  readHostSnapshot,
  readRecords,
  registerProcess,
  withHostLock,
} from "./lib/host-resources.mjs";
import { planningFailures } from "./lib/plan-failures.mjs";
import { createProcessMonitor } from "./lib/process-monitor.mjs";
import {
  unsafeFindingsAssertions,
  assertFindings,
  summarizeFindings,
} from "../corpus/harness/bounded-findings.mjs";

const root = resolve(import.meta.dirname, "..");
const native = process.platform === "darwin";
const host = {
  platform: platform(),
  release: release(),
  architecture: process.arch,
  physicalBytes: totalmem(),
};
const transcript = (label, value) =>
  console.log(`WO-185 ${label} ${JSON.stringify({ host, ...value })}`);

async function fixture(t) {
  const base = realpathSync(mkdtempSync(join(tmpdir(), "dotln-wo185-"))),
    directory = join(base, "host"),
    repo = join(base, "repo");
  mkdirSync(repo);
  mkdirSync(join(repo, "docs/control"), { recursive: true });
  writeFileSync(
    join(repo, "docs/control/budgets.json"),
    JSON.stringify({
      memory: {
        taskShare: (64 * 2 ** 20) / totalmem(),
        signalIntervalMs: 50,
        footprintIntervalMs: 100,
      },
    }),
  );
  execFileSync("git", ["init", "-q", repo]);
  execFileSync("git", ["-C", repo, "add", "."]);
  execFileSync("git", [
    "-C",
    repo,
    "-c",
    "user.name=Fixture",
    "-c",
    "user.email=fixture@example.invalid",
    "-c",
    "commit.gpgsign=false",
    "commit",
    "-qm",
    "Fixture",
  ]);
  let binary;
  if (native) {
    binary = join(base, "memory-growth");
    const { compiler, args } = nativeCompiler();
    execFileSync(compiler, [
      ...args,
      "-O2",
      join(root, "scripts/fixtures/memory-growth.c"),
      "-framework",
      "CoreFoundation",
      "-framework",
      "IOSurface",
      "-o",
      binary,
    ]);
  }
  const hostDirectories = new Set([directory]);
  const cleanups = [];
  t.after(async () => {
    for (const cleanup of cleanups) await cleanup();
    for (const directory of hostDirectories) {
      if (existsSync(join(directory, "guard.json"))) {
        const guard = JSON.parse(
          readFileSync(join(directory, "guard.json"), "utf8"),
        );
        if (
          processAlive(guard, readHostSnapshot({ footprint: false }).processes)
        )
          process.kill(guard.pid, "SIGTERM");
        for (
          let n = 0;
          n < 100 && existsSync(join(directory, "guard.json"));
          n++
        )
          await delay(20);
      }
    }
    rmSync(base, { recursive: true, force: true });
  });
  return {
    base,
    directory,
    repo,
    binary,
    hostDirectories,
    cleanups,
    limits: memoryBudgets(repo),
  };
}

// The real CLI's OS root observation is replaced only inside its fixture
// process. Production still ignores environment overrides for host rendezvous.
async function fixtureCli(f) {
  const bootstrap = join(f.base, "cli-host-root.mjs");
  writeFileSync(
    bootstrap,
    `
import childProcess from 'node:child_process';
import {syncBuiltinESMExports} from 'node:module';
const original = childProcess.execFileSync;
childProcess.execFileSync = function(file, args, ...rest) {
  if (file === '/usr/bin/getconf' && args?.[0] === 'DARWIN_USER_TEMP_DIR') return ${JSON.stringify(f.base + "\n")};
  return original(file, args, ...rest);
};
syncBuiltinESMExports();
`,
  );
  const directory = join(
    f.base,
    `dotln-host-v1-${process.getuid?.() ?? "user"}`,
  );
  f.hostDirectories.add(directory);
  const session = registerProcess(
    "sessions",
    process.pid,
    {
      protected: true,
      repo: f.repo,
      limits: memoryBudgets(root),
    },
    directory,
  );
  f.cleanups.push(() => session.release());
  // Start infrastructure outside the CLI's task tree, as the shared production
  // guard is. A disposable CLI must not leave a new child guard to its wrapper.
  await ensureHostGuard(directory);
  return ["--import", bootstrap, join(root, "scripts/harness.mjs")];
}

function cleanupChild(t, child) {
  const owner = readHostSnapshot({ footprint: false }).processes.find(
    (row) => row.pid === child.pid,
  );
  t.after(() => {
    if (owner) killOwned([owner]);
  });
}

function cleanupPidFile(t, file) {
  t.after(() => {
    // These self-expiring fixture files are written by their owned process;
    // capture its birth during the test, before any assertions can fail.
    if (owner) killOwned([owner]);
  });
  let owner;
  return () => {
    if (existsSync(file))
      owner = readHostSnapshot({ footprint: false }).processes.find(
        (row) => row.pid === Number(readFileSync(file, "utf8")),
      );
  };
}

function assertStopped(row, ceiling) {
  assert.equal(row.exitCode, 1, row.output);
  assert.equal(row.failureKind, "memory-budget", row.output);
  assert.ok(row.peakFootprintBytes > row.memoryBudgetBytes);
  assert.ok(row.peakFootprintBytes < ceiling);
  assert.ok(!row.survivingProcesses?.length);
  assert.match(
    row.output,
    /memory-budget.*budgetBytes.*measuredPeakFootprintBytes/,
  );
}

async function guardMetrics(directory, predicate) {
  let metrics;
  for (let n = 0; n < 200; n++) {
    const file = join(directory, "guard-metrics.json");
    if (existsSync(file)) {
      metrics = JSON.parse(readFileSync(file, "utf8"));
      if (predicate(metrics)) return metrics;
    }
    await delay(20);
  }
  assert.fail(
    `Guard metrics did not reach the observation: ${JSON.stringify(metrics)}`,
  );
}

test(
  "WO-185 native footprint stops zero-filled and low-resident growth as a gate task, bounded command and bare registered-session child",
  { skip: !native },
  async (t) => {
    const f = await fixture(t);
    for (const mode of ["zero", "nonresident"]) {
      const table = [
        {
          name: "build",
          build: true,
          product: true,
          command: [process.execPath, "-e", "console.log('built')"],
        },
        {
          name: `allocation-${mode}`,
          product: true,
          command: [f.binary, mode],
        },
      ];
      const gate = await runGate(["--serial", "--again"], f.repo, {
        table,
        hostDirectory: f.directory,
      });
      const row = gate.taskTimeline.find(
        (row) => row.name === `allocation-${mode}`,
      );
      assertStopped(
        { ...row, output: JSON.stringify(row.memoryFailure) },
        Math.min(totalmem() / 8, 240 * 2 ** 20),
      );
      assert.ok(gate.memory.peakFootprintBytes > 0);
      transcript(`gate-${mode}`, { row, gateMemory: gate.memory });
      const wrapper = await executeSuite(
        {
          name: `bounded-${mode}`,
          command: [f.binary, mode],
          memoryLimits: f.limits,
          hostDirectory: f.directory,
        },
        f.repo,
      );
      assertStopped(wrapper, Math.min(totalmem() / 8, 240 * 2 ** 20));
      if (mode === "nonresident")
        assert.ok(
          wrapper.peakRssBytes < wrapper.peakFootprintBytes / 2,
          JSON.stringify(wrapper),
        );
      transcript(`bounded-${mode}`, {
        row: { ...wrapper, output: wrapper.output.slice(-1800) },
      });
      const session = registerProcess(
        "sessions",
        process.pid,
        { protected: true, repo: f.repo, limits: f.limits },
        f.directory,
      );
      const guard = await ensureHostGuard(f.directory);
      const child = spawn(f.binary, [mode], {
        detached: true,
        stdio: ["ignore", "pipe", "pipe"],
      });
      cleanupChild(t, child);
      const exited = once(child, "exit");
      let output = "";
      child.stdout.on("data", (data) => {
        output += data;
      });
      child.stderr.on("data", (data) => {
        output += data;
      });
      const [code, signal] = await exited;
      assert.equal(code, null, output);
      assert.equal(signal, "SIGKILL", output);
      const incident = readFileSync(
        join(f.directory, "incidents.jsonl"),
        "utf8",
      )
        .split("\n")
        .filter(Boolean)
        .map(JSON.parse)
        .findLast((row) => row.pid === child.pid);
      assert.equal(incident.failureKind, "memory-budget");
      assert.ok(
        incident.measuredPeakFootprintBytes <
          Math.min(totalmem() / 8, 240 * 2 ** 20),
      );
      assert.ok(
        !readHostSnapshot({ footprint: false }).processes.some(
          (row) => row.pgid === child.pid,
        ),
      );
      assert.ok(
        readHostSnapshot({ footprint: false }).processes.some(
          (row) => row.pid === process.pid,
        ),
        "session root survives",
      );
      if (mode === "nonresident")
        assert.ok(
          incident.residentBytesAtStop <
            incident.measuredPeakFootprintBytes / 2,
        );
      transcript(`bare-${mode}`, {
        guardPid: guard.pid,
        incident,
        output: output.slice(-1000),
      });
      session.release();
    }
  },
);

test(
  "WO-185 bounded CLI prints typed memory stop and exit 125",
  { skip: !native },
  async (t) => {
    const f = await fixture(t);
    const cli = await fixtureCli(f);
    const incidentFile = join(
      root,
      "docs/control/local/harness/memory-incidents.jsonl",
    );
    const before = existsSync(incidentFile)
      ? readFileSync(incidentFile, "utf8")
      : null;
    // This tests the actual CLI spelling; its task is detached from this wrapper.
    const row = await executeSuite(
      {
        name: "cli",
        memoryLimits: memoryBudgets(root),
        hostDirectory: f.directory,
        command: [
          process.execPath,
          ...cli,
          "bounded",
          "--budget-bytes",
          String(32 * 2 ** 20),
          "--",
          f.binary,
          "nonresident",
        ],
      },
      f.repo,
    );
    assert.equal(row.exitCode, 125, row.output);
    assert.match(row.output, /bounded-result.*memory-budget/);
    assert.equal(
      existsSync(incidentFile) ? readFileSync(incidentFile, "utf8") : null,
      before,
    );
    assert.ok(
      planningFailures(f.repo, { all: true }).localMemoryStops?.stops > 0,
    );
    transcript("bounded-cli", {
      exitCode: row.exitCode,
      output: row.output.slice(-2200),
    });
  },
);

test(
  "WO-185 a gate memory breach records a typed failed row rather than an operator stop",
  { skip: !native },
  async (t) => {
    const f = await fixture(t);
    writeFileSync(
      join(f.repo, "docs/control/budgets.json"),
      JSON.stringify({
        memory: {
          taskShare: (256 * 2 ** 20) / totalmem(),
          gateShare: (100 * 2 ** 20) / totalmem(),
          signalIntervalMs: 50,
          footprintIntervalMs: 100,
        },
      }),
    );
    const entry = join(f.repo, "gate-budget.mjs");
    writeFileSync(
      entry,
      `import {runGate} from ${JSON.stringify(join(root, "scripts/test-runner.mjs"))};
    const result=await runGate(['--again'],${JSON.stringify(f.repo)},{hostDirectory:${JSON.stringify(f.directory)},table:[
      {name:'build',build:true,product:true,command:[process.execPath,'-e',"console.log('built')"]},
      {name:'allocation',product:true,command:[${JSON.stringify(f.binary)},'zero']} ]});
    console.log('gate-budget-result '+JSON.stringify(result));`,
    );
    const row = await executeSuite(
      {
        name: "gate-budget-fixture",
        command: [process.execPath, entry],
        hostDirectory: f.directory,
      },
      root,
    );
    assert.equal(row.exitCode, 1, row.output);
    assert.equal(row.failureKind, "memory-budget");
    const check = JSON.parse(
      row.output
        .split("\n")
        .find((line) => line.startsWith("gate-budget-result "))
        .slice(19),
    );
    assert.equal(check.exitCode, 1);
    assert.equal(check.memory.failure.failureKind, "memory-budget");
    assert.equal(check.memory.failure.scope, "gate");
    assert.doesNotMatch(row.output, /no check recorded/);
    const counts = planningFailures(f.repo, { all: true }).localMemoryStops;
    assert.ok(counts?.stops > 0, JSON.stringify(counts));
    transcript("gate-budget-failed-row", {
      memory: check.memory,
      localMemoryStops: counts,
    });
  },
);

test("WO-185 kernel locks release a killed owner and serialize racing waiters", async (t) => {
  const f = await fixture(t),
    ready = join(f.base, "lock-ready");
  const owner = spawn(
    process.execPath,
    [
      "--input-type=module",
      "-e",
      `
    import {withHostLock} from ${JSON.stringify(join(root, "scripts/lib/host-resources.mjs"))};
    import {writeFileSync} from 'node:fs';
    await withHostLock(${JSON.stringify(f.directory)},'race',async()=>{writeFileSync(${JSON.stringify(ready)},'ready');await new Promise(()=>{});});
  `,
    ],
    { stdio: "ignore" },
  );
  const exit = once(owner, "exit");
  for (let n = 0; n < 150 && !existsSync(ready); n++) await delay(20);
  assert.ok(existsSync(ready));
  owner.kill("SIGKILL");
  await exit;
  let active = 0,
    peak = 0;
  await Promise.all(
    [1, 2, 3].map(() =>
      withHostLock(f.directory, "race", async () => {
        active++;
        peak = Math.max(peak, active);
        await delay(50);
        active--;
      }),
    ),
  );
  assert.equal(peak, 1);
  transcript("kernel-lock-recovery", {
    killedOwnerReleased: true,
    peakHolders: peak,
  });
});

test("WO-185 a guard retires after its registered owner exits without treating itself as a survivor", async (t) => {
  const f = await fixture(t);
  const child = spawn(
    process.execPath,
    [
      "--input-type=module",
      "-e",
      `
    import {registerProcess} from ${JSON.stringify(join(root, "scripts/lib/host-resources.mjs"))};
    import {ensureHostGuard} from ${JSON.stringify(join(root, "scripts/lib/host-guard-state.mjs"))};
    registerProcess('sessions',process.pid,{protected:true,repo:${JSON.stringify(f.repo)},limits:${JSON.stringify(f.limits)}},${JSON.stringify(f.directory)});
    await ensureHostGuard(${JSON.stringify(f.directory)}); await new Promise(resolve=>setTimeout(resolve,500));
  `,
    ],
    { stdio: "ignore" },
  );
  const [code] = await once(child, "exit");
  assert.equal(code, 0);
  for (let n = 0; n < 250 && existsSync(join(f.directory, "guard.json")); n++)
    await delay(20);
  assert.equal(existsSync(join(f.directory, "guard.json")), false);
  transcript("guard-owner-exit", { retired: true });
});

test(
  "WO-185 host aggregate counts gate runners and stops an over-budget protected runner",
  { skip: !native },
  async (t) => {
    const f = await fixture(t);
    const child = spawn(f.binary, ["zero"], {
      detached: true,
      stdio: "ignore",
    });
    const exit = once(child, "exit");
    const limits = {
      ...f.limits,
      gateBytes: 256 * 2 ** 20,
      hostBytes: 40 * 2 ** 20,
    };
    registerProcess(
      "trees",
      child.pid,
      { scope: "gate", repo: f.repo, limits },
      f.directory,
    );
    await ensureHostGuard(f.directory);
    const [code, signal] = await exit;
    assert.equal(code, null);
    assert.ok(["SIGTERM", "SIGKILL"].includes(signal));
    const incident = JSON.parse(
      readFileSync(
        join(f.directory, "latest-incidents", `${child.pid}.json`),
        "utf8",
      ),
    );
    assert.equal(incident.scope, "host");
    assert.equal(incident.failureKind, "memory-budget");
    assert.ok(incident.measuredPeakFootprintBytes < limits.gateBytes);
    transcript("host-runner-accounting", { incident, signal });
  },
);

test("WO-185 a guard prunes deleted duplicate repository registrations and preserves its last agent root", async (t) => {
  const f = await fixture(t);
  const selected = registerProcess(
    "sessions",
    process.pid,
    { protected: true, repo: f.repo, limits: f.limits },
    f.directory,
  );
  const retiredRepo = join(f.base, "retired-repo");
  mkdirSync(retiredRepo);
  const duplicate = registerProcess(
    "sessions",
    process.pid,
    { protected: true, repo: retiredRepo, limits: f.limits },
    f.directory,
  );
  await ensureHostGuard(f.directory);
  rmSync(retiredRepo, { recursive: true });
  for (let n = 0; n < 100 && existsSync(duplicate.file); n++) await delay(20);
  assert.ok(!existsSync(duplicate.file), "deleted duplicate is retired");
  assert.ok(
    existsSync(selected.file),
    "existing repository still owns the agent",
  );
  rmSync(f.repo, { recursive: true });
  await delay(150);
  assert.ok(
    existsSync(selected.file),
    "last agent root survives repository deletion",
  );
  transcript("deleted-duplicate-registration", {
    duplicateRetired: true,
    lastRootRetained: true,
  });
  selected.release();
  duplicate.release();
});

test("WO-185 duplicate pruning preserves an already observed detached descendant", async (t) => {
  const f = await fixture(t);
  const retiredRepo = join(f.base, "retired-repo"),
    childFile = join(f.base, "grandchild.pid"),
    startFile = join(f.base, "start"),
    intermediateFile = join(f.base, "intermediate.pid"),
    intermediateExitFile = join(f.base, "intermediate.exit"),
    detachFile = join(f.base, "detach"),
    allocateFile = join(f.base, "allocate");
  mkdirSync(retiredRepo);
  const grandchildCode = `const fs=require('node:fs');let allocation;
    setInterval(()=>{if(!allocation&&fs.existsSync(${JSON.stringify(allocateFile)})) allocation=Buffer.alloc(83886080,1)},20);
    setTimeout(()=>process.exit(0),10000);`;
  const intermediateCode = `
    const fs=require('node:fs'),{spawn}=require('node:child_process');
    const child=spawn(process.execPath,['-e',${JSON.stringify(grandchildCode)}],{detached:true,stdio:'ignore'});
    child.unref();fs.writeFileSync(${JSON.stringify(childFile + ".tmp")},String(child.pid));
    fs.renameSync(${JSON.stringify(childFile + ".tmp")},${JSON.stringify(childFile)});
    setInterval(()=>{if(fs.existsSync(${JSON.stringify(detachFile)})) process.exit(0)},20);
    setTimeout(()=>process.exit(0),10000);`;
  // This owner spawns only the two intended descendants. Registering the test
  // worker lets its census helpers satisfy a three-process count prematurely.
  const owner = spawn(
    process.execPath,
    [
      "-e",
      `
    const fs=require('node:fs'),{spawn}=require('node:child_process');let started=false;
    setInterval(()=>{if(!started&&fs.existsSync(${JSON.stringify(startFile)})) {
      started=true;
      const child=spawn(process.execPath,['-e',${JSON.stringify(intermediateCode)}],{stdio:'ignore'});
      fs.writeFileSync(${JSON.stringify(intermediateFile + ".tmp")},String(child.pid));
      fs.renameSync(${JSON.stringify(intermediateFile + ".tmp")},${JSON.stringify(intermediateFile)});
      child.once('exit',(code,signal)=>{
        fs.writeFileSync(${JSON.stringify(intermediateExitFile + ".tmp")},JSON.stringify({code,signal}));
        fs.renameSync(${JSON.stringify(intermediateExitFile + ".tmp")},${JSON.stringify(intermediateExitFile)});
      });
    }},20);
    setTimeout(()=>process.exit(0),30000);`,
    ],
    { stdio: "ignore" },
  );
  const ownerClosed = once(owner, "close");
  const original = registerProcess(
    "sessions",
    owner.pid,
    { protected: true, repo: retiredRepo, limits: f.limits },
    f.directory,
  );
  let grandchild, intermediateOwner;
  f.cleanups.push(async () => {
    const table = readHostSnapshot({ footprint: false }).processes;
    const attached = ownedProcesses(table, owner.pid, new Map(), {
      group: false,
      birth: original.record.birth,
      uniqueId: original.record.uniqueId,
    });
    killOwned([
      ...attached,
      ...[grandchild, intermediateOwner, original.record].filter(Boolean),
    ]);
    await ownerClosed;
    original.release();
  });
  await ensureHostGuard(f.directory);
  const initial = await guardMetrics(
    f.directory,
    (row) => row.trackedRegistrations === 1 && row.trackedProcesses === 1,
  );
  writeFileSync(startFile, "start\n");
  for (
    let n = 0;
    n < 100 && (!existsSync(childFile) || !existsSync(intermediateFile));
    n++
  )
    await delay(20);
  const intermediatePid = existsSync(intermediateFile)
    ? Number(readFileSync(intermediateFile, "utf8"))
    : undefined;
  const grandchildPid = existsSync(childFile)
    ? Number(readFileSync(childFile, "utf8"))
    : undefined;
  const beforeDetach = readHostSnapshot({ footprint: false }).processes;
  intermediateOwner = beforeDetach.find((row) => row.pid === intermediatePid);
  grandchild = beforeDetach.find((row) => row.pid === grandchildPid);
  assert.ok(existsSync(childFile), "intermediate publishes its grandchild");
  assert.ok(existsSync(intermediateFile), "owner publishes its intermediate");
  assert.ok(intermediateOwner);
  assert.ok(grandchild);
  const observed = await guardMetrics(
    f.directory,
    (row) =>
      row.samples > initial.samples &&
      row.trackedRegistrations === 1 &&
      row.trackedProcesses === 3,
  );
  writeFileSync(detachFile, "detach\n");
  for (let n = 0; n < 100 && !existsSync(intermediateExitFile); n++)
    await delay(20);
  assert.ok(existsSync(intermediateExitFile), "intermediate exit is observed");
  assert.deepEqual(JSON.parse(readFileSync(intermediateExitFile, "utf8")), {
    code: 0,
    signal: null,
  });
  const detached = readHostSnapshot({ footprint: false }).processes.find(
    (row) => row.pid === grandchildPid,
  );
  assert.equal(
    detached.ppid,
    1,
    "grandchild has reparented before the new registration",
  );
  const survivor = registerProcess(
    "sessions",
    owner.pid,
    { protected: true, repo: f.repo, limits: f.limits },
    f.directory,
  );
  t.after(() => survivor.release());
  rmSync(retiredRepo, { recursive: true });
  for (let n = 0; n < 100 && existsSync(original.file); n++) await delay(20);
  assert.ok(!existsSync(original.file));
  writeFileSync(allocateFile, "allocate\n");
  for (let n = 0; n < 100; n++) {
    if (
      !processAlive(
        grandchild,
        readHostSnapshot({ footprint: false }).processes,
      )
    )
      break;
    await delay(20);
  }
  const stopped = !processAlive(
    grandchild,
    readHostSnapshot({ footprint: false }).processes,
  );
  assert.ok(
    stopped,
    "transferred ownership stops the detached descendant" +
      (stopped
        ? ""
        : ": " +
          JSON.stringify({
            observed,
            latest: JSON.parse(
              readFileSync(join(f.directory, "guard-metrics.json"), "utf8"),
            ),
            guardLog: readFileSync(join(f.directory, "guard.log"), "utf8"),
          })),
  );
  const incident = JSON.parse(
    readFileSync(
      join(f.directory, "latest-incidents", `${grandchildPid}.json`),
      "utf8",
    ),
  );
  assert.equal(incident.failureKind, "memory-budget");
  assert.ok(incident.killedProcesses.some((row) => row.pid === grandchildPid));
  transcript("duplicate-ownership-transfer", {
    observedProcesses: observed.trackedProcesses,
    incident,
  });
});

test("WO-185 the long-lived guard drops released registration histories", async (t) => {
  const f = await fixture(t);
  const selected = registerProcess(
    "sessions",
    process.pid,
    { protected: true, repo: f.repo, limits: f.limits },
    f.directory,
  );
  await ensureHostGuard(f.directory);
  const temporary = Array.from({ length: 8 }, () =>
    registerProcess(
      "sessions",
      process.pid,
      { protected: true, repo: f.repo, limits: f.limits },
      f.directory,
    ),
  );
  t.after(() => {
    selected.release();
    for (const registration of temporary) registration.release();
  });
  const before = await guardMetrics(
    f.directory,
    (row) => row.trackedRegistrations === 9,
  );
  for (const registration of temporary) registration.release();
  const after = await guardMetrics(
    f.directory,
    (row) => row.trackedRegistrations === 1,
  );
  transcript("released-registration-histories", {
    before: before.trackedRegistrations,
    after: after.trackedRegistrations,
  });
});

test("WO-185 document base comparisons pass their four-lane lease to nested gates", async (t) => {
  const f = await fixture(t);
  writeFileSync(
    join(f.repo, "docs/control/budgets.json"),
    JSON.stringify({ memory: { taskShare: 2 ** 30 / totalmem() } }),
  );
  const entry = join(f.repo, "nested-base.mjs");
  writeFileSync(
    entry,
    `import {runGate} from ${JSON.stringify(join(root, "scripts/test-runner.mjs"))};
    const timer=setTimeout(()=>process.kill(process.pid,'SIGTERM'),5000);timer.unref();
    try { const result=await runGate(['--again'],process.cwd(),{hostDirectory:${JSON.stringify(f.directory)},table:[
      {name:'build',build:true,product:true,command:[process.execPath,'-e',"console.log('built')"]},
      {name:'nested-check',exclusive:true,product:true,command:[process.execPath,'-e',"console.log('nested check passed')"]}]});
      process.exitCode=result.exitCode||1;
    } catch(error) {console.error(error.message);process.exitCode=1}
    finally {clearTimeout(timer)};`,
  );
  execFileSync("git", ["-C", f.repo, "add", "."]);
  execFileSync("git", [
    "-C",
    f.repo,
    "-c",
    "user.name=Fixture",
    "-c",
    "user.email=fixture@example.invalid",
    "-c",
    "commit.gpgsign=false",
    "commit",
    "-qm",
    "Nested base fixture",
  ]);
  const base = execFileSync("git", ["-C", f.repo, "rev-parse", "HEAD"], {
    encoding: "utf8",
  }).trim();
  const result = await runGate(
    ["--document", "--again", "--against", base],
    f.repo,
    {
      hostDirectory: f.directory,
      table: [
        {
          name: "nested-base",
          document: true,
          exclusive: true,
          command: [process.execPath, "nested-base.mjs"],
        },
      ],
    },
  );
  assert.equal(result.exitCode, 1, "an ordinary current failure stays red");
  const comparison = result.failureComparisons[0];
  assert.equal(
    comparison.classification,
    "inherited",
    JSON.stringify(comparison),
  );
  assert.match(comparison.baseOutput, /PASS nested-check/);
  assert.doesNotMatch(comparison.baseOutput, /WAIT host lanes/);
  transcript("nested-base-comparison", { comparison });
});

test("WO-185 runner cuts output to a tail and names and kills an escaped descendant", async (t) => {
  const f = await fixture(t);
  const output = await executeSuite(
    {
      name: "output-tail",
      command: [
        process.execPath,
        "-e",
        "process.stdout.write('x'.repeat(40000));console.error('DIAGNOSTIC last line');process.exitCode=3",
      ],
      memoryLimits: { ...memoryBudgets(root), outputTailBytes: 2048 },
      hostDirectory: f.directory,
    },
    f.repo,
  );
  assert.equal(output.exitCode, 3);
  assert.ok(output.droppedOutputBytes >= 37900);
  assert.match(output.output, /DIAGNOSTIC last line/);
  assert.ok(Buffer.byteLength(output.output) < 2200);
  const early = await executeSuite(
    {
      name: "early-diagnostic",
      command: [
        process.execPath,
        "-e",
        "console.error('DIAGNOSTIC early failure');process.stdout.write('x'.repeat(40000));process.exitCode=3",
      ],
      memoryLimits: { ...memoryBudgets(root), outputTailBytes: 2048 },
      hostDirectory: f.directory,
    },
    f.repo,
  );
  assert.match(early.output, /DIAGNOSTIC early failure/);
  const childFile = join(f.repo, "survivor.pid");
  const captureSurvivor = cleanupPidFile(t, childFile);
  const row = await executeSuite(
    {
      name: "escape",
      command: [
        process.execPath,
        "-e",
        `
    const {spawn}=require('node:child_process');const fs=require('node:fs');
    const child=spawn(process.execPath,['-e','setTimeout(()=>process.exit(),8000).unref();setInterval(()=>{},1000)'],{detached:true,stdio:'ignore'});
    child.unref();fs.writeFileSync(${JSON.stringify(childFile)},String(child.pid));process.exit(0);`,
      ],
      memoryLimits: {
        ...memoryBudgets(root),
        signalIntervalMs: 50,
        footprintIntervalMs: 100,
      },
      hostDirectory: f.directory,
    },
    f.repo,
  );
  captureSurvivor();
  assert.equal(row.failureKind, "surviving-process", row.output);
  const pid = Number(readFileSync(childFile));
  assert.ok(row.survivingProcesses.some((child) => child.pid === pid));
  await delay(100);
  assert.ok(
    !readHostSnapshot({ footprint: false }).processes.some(
      (child) => child.pid === pid,
    ),
  );
  transcript("tail-and-survivor", {
    droppedBytes: output.droppedOutputBytes,
    row,
  });
});

test("WO-185 interrupt, termination and hang-up end task groups without a gate row", async (t) => {
  const f = await fixture(t);
  for (const signal of ["SIGINT", "SIGTERM", "SIGHUP"]) {
    const pidFile = join(f.repo, `${signal}.pid`);
    const captureTask = cleanupPidFile(t, pidFile);
    const entry = join(f.repo, "gate.mjs");
    writeFileSync(
      entry,
      `import {runGate} from ${JSON.stringify(join(root, "scripts/test-runner.mjs"))};
      const table=[{name:'build',build:true,product:true,command:[process.execPath,'-e',"console.log('built')"]},
      {name:'hang',product:true,command:[process.execPath,'-e',${JSON.stringify(`require('node:fs').writeFileSync(${JSON.stringify(pidFile)},String(process.pid));setTimeout(()=>process.exit(),8000).unref();setInterval(()=>{},1000)`)}]}];
      try {await runGate(['--again'],${JSON.stringify(f.repo)},{table,hostDirectory:${JSON.stringify(f.directory)}})} catch(e){console.error(e.message);process.exitCode=1}`,
    );
    const child = spawn(process.execPath, [entry], {
      detached: true,
      stdio: ["ignore", "pipe", "pipe"],
    });
    cleanupChild(t, child);
    const exit = once(child, "exit");
    let output = "";
    child.stdout.on("data", (data) => {
      output += data;
    });
    child.stderr.on("data", (data) => {
      output += data;
    });
    for (let n = 0; n < 200 && !existsSync(pidFile); n++) await delay(20);
    captureTask();
    assert.ok(existsSync(pidFile), output);
    const pid = Number(readFileSync(pidFile));
    process.kill(child.pid, signal);
    await exit;
    await delay(50);
    assert.ok(
      !readHostSnapshot({ footprint: false }).processes.some(
        (row) => row.pid === pid,
      ),
    );
    assert.ok(
      !existsSync(join(f.repo, "docs/control/local/harness/checks.json")),
    );
    assert.match(output, /no check recorded/);
    transcript(signal, { taskPid: pid, output: output.slice(-1200) });
  }
});

test("WO-185 independent worktrees and separate clones share lanes, wait, reclaim a dead holder and reuse one guard", async (t) => {
  const f = await fixture(t);
  const worktree = join(f.base, "worktree"),
    clone = join(f.base, "clone");
  execFileSync("git", [
    "-C",
    f.repo,
    "worktree",
    "add",
    "-q",
    "--detach",
    worktree,
  ]);
  execFileSync("git", ["clone", "-q", "--local", f.repo, clone]);
  for (const [other, cpuCount] of [worktree, clone].flatMap((repo) =>
    [availableParallelism(), 4, 2].map((count) => [repo, count]),
  )) {
    const slots = Math.max(1, Math.min(4, Math.floor(cpuCount / 2)));
    // Leave one gate's actual reservation available on smaller machines too.
    const blocker =
      slots < 4
        ? await acquireHostLanes({
            directory: f.directory,
            slots: 4 - slots,
            parentLease: null,
            worktree: f.repo,
            task: "fixture-unused-capacity",
          })
        : null;
    let blockerReleased = false;
    f.cleanups.push(async () => {
      if (!blockerReleased) await blocker?.release();
    });
    const entry = join(f.base, "lanes.mjs"),
      events = join(f.base, "lane-events.jsonl");
    writeFileSync(events, "");
    const workload = `const fs=require('node:fs');const f=${JSON.stringify(events)};fs.appendFileSync(f,JSON.stringify({event:'start',pid:process.pid,time:Date.now(),repo:process.cwd()})+'\\n');setTimeout(()=>{fs.appendFileSync(f,JSON.stringify({event:'end',pid:process.pid,time:Date.now(),repo:process.cwd()})+'\\n')},600)`;
    writeFileSync(
      entry,
      `import os from 'node:os';import {syncBuiltinESMExports} from 'node:module';
      os.availableParallelism=()=>${cpuCount};syncBuiltinESMExports();
      const {runGate}=await import(${JSON.stringify(join(root, "scripts/test-runner.mjs"))});
      const repo=process.argv[2];const script=${JSON.stringify(workload)};
      const table=[{name:'build',build:true,product:true,command:[process.execPath,'-e',script]}];
      const row=await runGate(['--again'],repo,{table,hostDirectory:${JSON.stringify(f.directory)}});console.log('gate-fixture-result '+JSON.stringify({exitCode:row.exitCode,memory:row.memory}));process.exitCode=row.exitCode;`,
    );
    const one = spawn(process.execPath, [entry, f.repo], {
      stdio: ["ignore", "pipe", "pipe"],
    });
    const two = spawn(process.execPath, [entry, other], {
      stdio: ["ignore", "pipe", "pipe"],
    });
    cleanupChild(t, one);
    cleanupChild(t, two);
    const exits = [once(one, "exit"), once(two, "exit")];
    let output = "";
    for (const child of [one, two]) {
      child.stdout.on("data", (data) => {
        output += data;
      });
      child.stderr.on("data", (data) => {
        output += data;
      });
    }
    const codes = await Promise.all(exits);
    await blocker?.release();
    blockerReleased = true;
    assert.ok(
      codes.every(([code]) => code === 0),
      output,
    );
    assert.match(output, /WAIT host lanes.*held by/);
    const rows = readFileSync(events, "utf8")
      .trim()
      .split("\n")
      .map(JSON.parse)
      .sort((a, b) => a.time - b.time);
    let active = 0,
      peak = 0;
    for (const row of rows) {
      active += row.event === "start" ? slots : -slots;
      peak = Math.max(peak, active);
    }
    assert.equal(peak, slots);
    assert.ok(peak + (4 - slots) <= 4);
    assert.equal(active, 0);
    const guard = await ensureHostGuard(f.directory),
      secondGuard = await ensureHostGuard(f.directory);
    assert.equal(guard.pid, secondGuard.pid);
    assert.equal(secondGuard.reused, true);
    transcript(other === clone ? "separate-clones" : "two-worktrees", {
      peakLanes: peak,
      gateSlots: slots,
      cpuCount,
      oneGuard: guard.pid,
      output: output.slice(-1600),
    });
  }
  readRecords(f.directory, "lanes");
  atomicJson(join(f.directory, "lanes/stale.json"), {
    pid: 999999999,
    birth: "dead",
    slots: 4,
    worktree: "dead",
    task: "stale",
  });
  const lease = await acquireHostLanes({
    slots: 4,
    directory: f.directory,
    worktree: clone,
    task: "reclaim",
  });
  assert.equal(readRecords(f.directory, "lanes").length, 1);
  await lease.release();
  const session = registerProcess(
    "sessions",
    process.pid,
    { protected: true, repo: clone, limits: f.limits },
    f.directory,
  );
  const child = spawn(f.binary, ["zero"], { detached: true, stdio: "ignore" });
  const [code, signal] = await once(child, "exit");
  assert.equal(code, null);
  assert.equal(signal, "SIGKILL");
  session.release();
  transcript("reclaimed-and-second-clone-child", {
    reclaimed: true,
    killedPid: child.pid,
  });
});

test("WO-185 PID reuse cannot adopt a new root and unreadable footprint fails supervision", async () => {
  const reused = [
    { pid: 7, ppid: 1, pgid: 7, birth: "new" },
    { pid: 8, ppid: 7, pgid: 7, birth: "child" },
  ];
  assert.equal(
    ownedProcesses(reused, 7, new Map(), { birth: "old" }).length,
    0,
  );
  assert.equal(
    laneHolderAlive(
      { pid: 6, birth: "gone", taskRoot: { pid: 7, birth: "old" } },
      reused,
    ),
    false,
  );
  const killed = [];
  const monitor = createProcessMonitor({
    limits: memoryBudgets(root),
    sample: () => {
      throw new Error("planted inventory outage");
    },
    report() {},
  });
  monitor.add(999999999, "outage", (kind) => killed.push(kind));
  monitor.close();
  assert.equal(killed[0], "monitor-unavailable");
  const row = await executeSuite(
    { name: "fast-success", command: ["/usr/bin/true"] },
    root,
  );
  assert.equal(row.exitCode, 0, row.output);
});

test(
  "WO-185 a short task records executable footprint before the normal sample interval",
  { skip: !native },
  async () => {
    const row = await executeSuite(
      {
        name: "short-task-footprint",
        command: [
          process.execPath,
          "-e",
          "const allocation = Buffer.alloc(67108864, 1); setTimeout(() => console.log(allocation.length), 350)",
        ],
      },
      root,
    );
    assert.equal(row.exitCode, 0, row.output);
    assert.ok(row.peakFootprintBytes >= 64 * 2 ** 20, JSON.stringify(row));
    transcript("short-task-footprint", { row });
  },
);

test("WO-185 nested gates suballocate one reservation and a dead runner's live task retains its lanes", async (t) => {
  const f = await fixture(t);
  const parent = await acquireHostLanes({
    slots: 4,
    directory: f.directory,
    worktree: f.repo,
    task: "parent",
    parentLease: null,
  });
  const token = {
    file: parent.file,
    record: parent.record,
    directory: f.directory,
  };
  const one = await acquireHostLanes({
    slots: 4,
    directory: f.directory,
    worktree: f.repo,
    task: "nested-one",
    parentLease: token,
  });
  let acquired = false,
    waited = false;
  const pending = acquireHostLanes({
    slots: 4,
    directory: f.directory,
    worktree: f.repo,
    task: "nested-two",
    parentLease: token,
    onWait() {
      waited = true;
    },
  }).then((lease) => {
    acquired = true;
    return lease;
  });
  await delay(150);
  assert.equal(acquired, false);
  assert.equal(waited, true);
  await one.release();
  const two = await pending;
  await two.release();
  await parent.release();
  const child = spawn(process.execPath, ["-e", "setTimeout(()=>{},600)"], {
    detached: true,
    stdio: "ignore",
  });
  const exit = once(child, "exit"),
    member = readHostSnapshot({ footprint: false }).processes.find(
      (row) => row.pid === child.pid,
    );
  atomicJson(join(f.directory, "lanes/orphan.json"), {
    pid: 999999999,
    birth: "dead-runner",
    slots: 4,
    taskRoot: { pid: member.pid, birth: member.birth },
    members: [member],
    worktree: "dead-runner",
    task: "surviving-task",
  });
  acquired = false;
  const after = acquireHostLanes({
    slots: 4,
    directory: f.directory,
    worktree: f.repo,
    task: "after-orphan",
    parentLease: null,
    onWait() {},
  }).then((lease) => {
    acquired = true;
    return lease;
  });
  await delay(150);
  assert.equal(acquired, false);
  await exit;
  const reclaimed = await after;
  await reclaimed.release();
  transcript("nested-and-orphan-lanes", {
    suballocationWaited: true,
    retainedUntilTaskExit: true,
  });
});

test("WO-185 host coordination ignores temporary environment, ancestry is verified and corpus assertion guard rejects sweep aliases", () => {
  const before = process.env.TMPDIR;
  try {
    const one = hostStateRoot();
    process.env.TMPDIR = "/tmp/different-clone";
    assert.equal(hostStateRoot(), one);
  } finally {
    if (before === undefined) delete process.env.TMPDIR;
    else process.env.TMPDIR = before;
  }
  const table = [
    { pid: 10, ppid: 20, name: "node" },
    { pid: 20, ppid: 30, name: "zsh" },
    { pid: 30, ppid: 1, name: "codex-code-mode" },
  ];
  assert.equal(agentAncestor(table, 10, { CLAUDE_PID: "999" }).pid, 30);
  assert.equal(agentAncestor(table, 10, { CLAUDE_PID: "20" }).pid, 20);
  assert.ok(
    unsafeFindingsAssertions(
      "const x=inspectGrid(rows);const alias=x;assert.deepStrictEqual(alias,[])",
    ).length,
  );
  assert.ok(
    unsafeFindingsAssertions(
      "assert.deepEqual(manifest.findings.filter(x=>x),[])",
    ).length,
  );
  assert.ok(
    unsafeFindingsAssertions(
      "const {kept: alias} = inspectGrid(rows);assert.deepStrictEqual(alias,[])",
    ).length,
  );
  assert.ok(
    unsafeFindingsAssertions(
      "const {findings} = manifest;assert.deepEqual(findings,[])",
    ).length,
  );
  assert.ok(
    unsafeFindingsAssertions("assert.deepEqual(manifest['findings'],[])")
      .length,
  );
  assert.ok(
    unsafeFindingsAssertions("assert['deepStrictEqual'](inspectGrid(rows),[])")
      .length,
  );
  assert.ok(
    unsafeFindingsAssertions(
      "const compare=assert.deepStrictEqual;compare(inspectGrid(rows),[])",
    ).length,
  );
  assert.ok(
    unsafeFindingsAssertions(
      "const {deepStrictEqual:compare}=assert;compare(inspectGrid(rows),[])",
    ).length,
  );
  assert.equal(
    unsafeFindingsAssertions("assertFindings(inspectGrid(rows),[])").length,
    0,
  );
  const consumers = readdirSync(join(root, "corpus/harness"))
    .filter((name) => name.endsWith(".test.mjs"))
    .filter(
      (name) =>
        name.startsWith("wo102-") ||
        /(?:bounded-findings|wo102-cadence-lib)\.mjs/.test(
          readFileSync(join(root, "corpus/harness", name), "utf8"),
        ),
    );
  for (const name of consumers)
    assert.equal(
      unsafeFindingsAssertions(
        readFileSync(join(root, "corpus/harness", name), "utf8"),
      ).length,
      0,
      name,
    );
  transcript("assertion-consumers", { consumers });
  const first = summarizeFindings(
    Array.from({ length: 10000 }, (_, index) => ({ index })),
  );
  assert.equal(first.total, 10000);
  assert.equal(first.kept.length, 32);
  assert.throws(
    () => assertFindings(first, []),
    /total=10000; kept=32; digest=/,
  );
});

test(
  "WO-185 double and triple forks retain descriptor ownership through gate and bounded completion",
  { skip: !native },
  async (t) => {
    const f = await fixture(t);
    const cli = await fixtureCli(f);
    const binary = join(f.base, "detached-descendant");
    const { compiler, args } = nativeCompiler();
    execFileSync(compiler, [
      ...args,
      "-O2",
      join(root, "scripts/fixtures/detached-descendant.c"),
      "-o",
      binary,
    ]);
    // A separate live process must never be adopted by a socket census.
    const unrelated = spawn("sleep", ["20"], {
      detached: true,
      stdio: "ignore",
    });
    t.after(() => unrelated.kill("SIGKILL"));
    for (const depth of [2, 3]) {
      const pidFile = join(f.base, `descendant-${depth}.pid`);
      const gate = await runGate(["--again"], f.repo, {
        hostDirectory: f.directory,
        table: [
          {
            name: "build",
            build: true,
            product: true,
            command: [process.execPath, "-e", ""],
          },
          {
            name: "detach",
            product: true,
            command: [binary, pidFile, String(depth)],
          },
        ],
      });
      const pid = Number(readFileSync(pidFile));
      const row = gate.taskTimeline.find((task) => task.name === "detach");
      assert.equal(gate.exitCode, 1);
      assert.equal(row.failureKind, "surviving-process");
      assert.ok(
        row.survivingProcesses.some(
          (child) => child.pid === pid && child.name === "detached-descen",
        ),
      );
      await delay(50);
      const table = readHostSnapshot({ footprint: false }).processes;
      assert.ok(!table.some((child) => child.pid === pid));
      assert.ok(table.some((child) => child.pid === unrelated.pid));
      transcript(`descriptor-gate-${depth}`, {
        exitCode: gate.exitCode,
        row,
        unrelatedAlive: true,
      });
    }
    const pidFile = join(f.base, "bounded-descendant.pid");
    const row = await executeSuite(
      {
        name: "bounded-detach-cli",
        command: [
          process.execPath,
          ...cli,
          "bounded",
          "--",
          binary,
          pidFile,
          "2",
        ],
        hostDirectory: f.directory,
      },
      f.repo,
    );
    assert.equal(row.exitCode, 1, row.output);
    assert.match(row.output, /bounded-result.*surviving-process/);
    const pid = Number(readFileSync(pidFile));
    await delay(50);
    assert.ok(
      !readHostSnapshot({ footprint: false }).processes.some(
        (child) => child.pid === pid,
      ),
    );
    transcript("descriptor-bounded-cli", {
      exitCode: row.exitCode,
      output: row.output,
    });
  },
);

test("WO-185 budgets refuse a lane count the shared host lanes cannot honor", (t) => {
  const repo = mkdtempSync(join(tmpdir(), "dotln-wo185-"));
  t.after(() => rmSync(repo, { recursive: true, force: true }));
  mkdirSync(join(repo, "docs/control"), { recursive: true });
  const budgets = (hostLanes) =>
    writeFileSync(
      join(repo, "docs/control/budgets.json"),
      JSON.stringify({ memory: { hostLanes } }),
    );
  for (const hostLanes of [2, 6]) {
    budgets(hostLanes);
    assert.throws(
      () => memoryBudgets(repo),
      /hostLanes: every clone on the host shares 4 lanes/,
    );
  }
  budgets(4);
  assert.equal(memoryBudgets(repo).hostLanes, 4);
});

test("WO-185 a guard census that straddles a runner's withdrawal keeps no tag from the withdrawn watch", (t) => {
  const base = mkdtempSync(join(tmpdir(), "dotln-wo185-")),
    published = join(base, "published.json"),
    withdrawn = join(base, "withdrawn.json");
  t.after(() => rmSync(base, { recursive: true, force: true }));
  writeFileSync(published, "{}");
  writeFileSync(withdrawn, "{}");
  const registrations = [
    { file: published, descriptorOwnership: { key: "published" } },
    { file: withdrawn, descriptorOwnership: { key: "withdrawn" } },
    { file: join(base, "unwatched.json") },
  ];
  const sample = guardCensus(registrations, { footprint: false }, (options) => {
    assert.deepEqual(
      options.descriptorOwners.map((owner) => owner.key),
      ["published", "withdrawn"],
    );
    // The runner removes its registration and then releases the endpoint;
    // the kernel recycles that identity for a sibling this census reads.
    rmSync(withdrawn);
    return {
      processes: [
        {
          pid: 41,
          ppid: 1,
          pgid: 41,
          birth: "2.0",
          descriptorOwners: ["withdrawn"],
        },
        {
          pid: 42,
          ppid: 1,
          pgid: 42,
          birth: "2.0",
          descriptorOwners: ["published", "withdrawn"],
        },
      ],
      unavailable: [],
    };
  });
  assert.deepEqual(
    sample.processes.map((row) => row.descriptorOwners),
    [[], ["published"]],
  );
  const owned = (descriptorOwner) =>
    ownedProcesses(sample.processes, 40, new Map(), {
      birth: "1.0",
      descriptorOwner,
    }).map((row) => row.pid);
  assert.deepEqual(owned("withdrawn"), []);
  assert.deepEqual(owned("published"), [42]);
});

test(
  "WO-185 a task watch stays on its held endpoint through the final census and adopts no sibling on a released descriptor",
  { skip: !native },
  async (t) => {
    const f = await fixture(t);
    const limits = {
      ...f.limits,
      signalIntervalMs: 50,
      footprintIntervalMs: 100,
    };
    const identity = (fd) => {
      try {
        return String(fstatSync(fd).ino);
      } catch (error) {
        return error.code;
      }
    };
    const captured = new Map(),
      released = new Set(),
      siblings = [],
      violations = [];
    let censuses = 0;
    const sample = (options) => {
      const watched = options.descriptorOwners ?? [];
      for (const { key, descriptors } of watched)
        for (const { fd } of descriptors) {
          const watch = `${key}:${fd}`;
          if (!captured.has(watch)) {
            const held = identity(fd);
            assert.match(held, /^\d+$/);
            captured.set(watch, held);
            // The stream's own descriptor for this endpoint closes at EOF, so
            // a later sibling's fresh pipe can take its number.
            for (let other = 0; other < 1024; other++)
              if (other !== fd && identity(other) === held) released.add(other);
          } else if (identity(fd) !== captured.get(watch))
            violations.push({
              watch,
              captured: captured.get(watch),
              observed: identity(fd),
            });
        }
      // Every watched census starts a sibling on the lowest free descriptors,
      // where the kernel also hands out the most recently freed socket.
      if (watched.length) {
        censuses++;
        if (siblings.length < 24)
          siblings.push(
            spawn("sleep", ["5"], { stdio: ["ignore", "pipe", "pipe"] }),
          );
      }
      const snapshot = readHostSnapshot(options);
      const roots = new Map(
        readRecords(f.directory, "trees")
          .filter((row) => row.descriptorOwnership)
          .map((row) => [row.descriptorOwnership.key, row.pid]),
      );
      for (const row of snapshot.processes)
        for (const key of row.descriptorOwners ?? [])
          if (roots.get(key) !== row.pid)
            violations.push({ adopted: row.pid, name: row.name, key });
      return snapshot;
    };
    const monitor = createProcessMonitor({
      limits,
      repo: f.repo,
      directory: f.directory,
      sample,
    });
    t.after(() => {
      monitor.close();
      for (const sibling of siblings) sibling.kill("SIGKILL");
    });
    const rows = [];
    for (const [name, script] of [
      // Closing its outputs frees the stream descriptors while the task runs.
      [
        "closes-outputs-early",
        "const fs=require('node:fs');fs.closeSync(1);fs.closeSync(2);setTimeout(()=>{},600)",
      ],
      // The docs gate shape VER-002 observed: spawns nothing, exits at once.
      ["exits-at-once", ""],
    ])
      rows.push(
        await executeSuite(
          {
            name,
            command: [process.execPath, "-e", script],
            memoryLimits: limits,
            hostDirectory: f.directory,
            resourceMonitor: monitor,
          },
          f.repo,
        ),
      );
    for (const row of rows) {
      assert.equal(row.exitCode, 0, row.output);
      assert.equal(row.failureKind, undefined, row.output);
      assert.equal(row.survivingProcesses, undefined, row.output);
    }
    assert.deepEqual(violations, []);
    assert.equal(captured.size, 4);
    // Withdrawal precedes release: no registration remains and no held
    // endpoint still answers to its captured identity.
    assert.deepEqual(readRecords(f.directory, "trees"), []);
    for (const [watch, captureIdentity] of captured)
      assert.notEqual(
        identity(Number(watch.split(":").at(-1))),
        captureIdentity,
      );
    const onReleased = siblings.filter((sibling) =>
      [sibling.stdout._handle?.fd, sibling.stderr._handle?.fd].some((fd) =>
        released.has(fd),
      ),
    ).length;
    transcript("held-watch-siblings", {
      censuses,
      siblings: siblings.length,
      siblingsOnReleasedDescriptors: onReleased,
      releasedDescriptors: [...released],
      rows: rows.map(({ name, exitCode, failureKind }) => ({
        name,
        exitCode,
        failureKind,
      })),
    });
  },
);

test("WO-185 a docs-shaped gate of concurrent tasks that start nothing records no survivor", async (t) => {
  const f = await fixture(t);
  const table = [
    {
      name: "build",
      build: true,
      product: true,
      command: [process.execPath, "-e", ""],
    },
    ...Array.from({ length: 16 }, (_, index) => ({
      name: `ordinary-${index}`,
      product: true,
      command: [process.execPath, "-e", index % 2 ? "console.log('ok')" : ""],
    })),
  ];
  const runs = [];
  for (let run = 0; run < 2; run++) {
    const gate = await runGate(["--again"], f.repo, {
      hostDirectory: f.directory,
      table,
    });
    const failed = gate.taskTimeline.filter(
      (row) => row.exitCode || row.failureKind || row.survivingProcesses,
    );
    assert.equal(gate.exitCode, 0, JSON.stringify(failed));
    assert.deepEqual(failed, []);
    runs.push({ exitCode: gate.exitCode, tasks: gate.taskTimeline.length });
  }
  transcript("docs-shaped-gate", { runs });
});

test("WO-185 a signal during completed-row aggregation cannot record a gate row", async (t) => {
  const f = await fixture(t);
  for (const signal of ["SIGINT", "SIGTERM", "SIGHUP"]) {
    let sent = false;
    const build = {
      build: true,
      product: true,
      command: [process.execPath, "-e", ""],
    };
    Object.defineProperty(build, "name", {
      enumerable: true,
      get() {
        // This accessor belongs to the original selection, after all tasks have
        // finished. It delivers the signal after the earlier stop checks, while
        // the runner is assembling its final row.
        if (!sent && new Error().stack.includes("aggregateSuiteRows")) {
          sent = true;
          process.emit(signal);
          // A later resource observation must not turn an operator interruption
          // into a recorded failure, even in the final aggregation window.
          appendIncident(f.directory, {
            failureKind: "memory-budget",
            scope: "gate",
            pid: process.pid,
            process: "node",
            budgetBytes: 1,
            measuredPeakFootprintBytes: 2,
          });
        }
        return "build";
      },
    });
    await assert.rejects(
      runGate(["--again"], f.repo, {
        hostDirectory: f.directory,
        table: [build],
      }),
      /no check recorded/,
    );
    assert.equal(sent, true);
    assert.equal(
      existsSync(join(f.repo, "docs/control/local/harness/checks.json")),
      false,
    );
    transcript("late-signal", { signal, noRow: true });
  }
});

test(
  "WO-185 a budget kill survives unavailable host and checkout incident ledgers",
  { skip: !native },
  async (t) => {
    const f = await fixture(t);
    // executeSuite's own monitor has no guard in this private directory. This
    // closes the report's masked path, plus an unwritable host-ledger case.
    const local = join(f.repo, "docs/control/local");
    writeFileSync(local, "not a directory\n");
    mkdirSync(join(f.directory, "incidents.jsonl"), {
      recursive: true,
      mode: 0o700,
    });
    const row = await executeSuite(
      {
        name: "unwritable-ledgers",
        command: [f.binary, "zero"],
        memoryLimits: f.limits,
        hostDirectory: f.directory,
      },
      f.repo,
      8000,
    );
    assertStopped(row, 240 * 2 ** 20);
    assert.deepEqual(
      row.memoryFailure.recordingUnavailable
        .map((item) => item.destination)
        .sort(),
      ["checkout incidents", "host incidents"],
    );
    assert.equal(row.memoryFailure.process, "memory-growth");
    const snapshot = readHostSnapshot({ footprint: false }).processes;
    assert.equal(
      snapshot.some((member) => member.pid === row.memoryFailure.pid),
      false,
    );
    transcript("unwritable-ledgers", { row });

    // Keep checks.json writable while denying only the checkout's incident
    // destination. Stop the fixture guard in the build so this row also depends
    // on the runner, not on an independent guard catching its mistake.
    rmSync(local);
    mkdirSync(join(local, "harness/memory-incidents.jsonl"), {
      recursive: true,
    });
    rmSync(join(f.directory, "incidents.jsonl"), { recursive: true });
    const stopGuard = join(f.repo, "stop-fixture-guard.mjs");
    writeFileSync(
      stopGuard,
      `
import {readFileSync, existsSync} from 'node:fs';
const file=${JSON.stringify(join(f.directory, "guard.json"))};
const guard=JSON.parse(readFileSync(file,'utf8'));
process.kill(guard.pid,'SIGTERM');
for(let n=0;n<100 && existsSync(file);n++) await new Promise(resolve=>setTimeout(resolve,20));
if(existsSync(file)) throw new Error('fixture guard did not stop');
`,
    );
    const gate = await runGate(["--serial", "--again"], f.repo, {
      hostDirectory: f.directory,
      table: [
        {
          name: "build",
          build: true,
          product: true,
          command: [process.execPath, stopGuard],
        },
        { name: "allocation", product: true, command: [f.binary, "zero"] },
      ],
    });
    const task = gate.taskTimeline.find((item) => item.name === "allocation");
    assertStopped(
      { ...task, output: JSON.stringify(task.memoryFailure) },
      240 * 2 ** 20,
    );
    assert.equal(gate.exitCode, 1);
    assert.ok(
      task.memoryFailure.recordingUnavailable.some(
        (item) => item.destination === "checkout incidents",
      ),
    );
    const checks = JSON.parse(
      readFileSync(join(local, "harness/checks.json"), "utf8"),
    );
    assert.ok(JSON.stringify(checks).includes('"failureKind":"memory-budget"'));
    transcript("unwritable-ledger-gate", { task, recorded: true });
  },
);

test("WO-185 membership publication cannot prevent a task or gate budget stop", (t) => {
  const directory = mkdtempSync(join(tmpdir(), "dotln-wo185-monitor-writes-"));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  for (const scope of ["task", "gate"]) {
    const rootPid = 999999990,
      taskPid = 999999991;
    let footprint = 0,
      failure,
      publications = 0;
    const monitor = createProcessMonitor({
      directory,
      gatePid: scope === "gate" ? rootPid : undefined,
      limits: { ...memoryBudgets(root), taskBytes: 1, gateBytes: 1 },
      sample: () => ({
        processes: [
          {
            pid: rootPid,
            ppid: 1,
            pgid: rootPid,
            birth: "runner",
            footprintBytes: 0,
            rssBytes: 0,
            name: "runner",
          },
          {
            pid: taskPid,
            ppid: rootPid,
            pgid: taskPid,
            birth: "task",
            footprintBytes: footprint,
            rssBytes: 0,
            name: "growing-task",
          },
        ],
        source: "fixture",
        swapBytes: 0,
        pressure: 1,
        unavailable: [],
      }),
      report() {},
    });
    t.after(() => monitor.close());
    const task = monitor.add(
      taskPid,
      "publication-outage",
      (kind, details) => {
        failure = { kind, details };
      },
      1,
      "task",
      () => {
        publications++;
        throw new Error("planted registration/lease write failure");
      },
    );
    footprint = 2;
    const result = monitor.finish(task);
    const stats = monitor.close();
    assert.equal(failure.kind, "memory-budget");
    assert.equal(failure.details.scope, scope);
    assert.equal(
      failure.details.process,
      scope === "gate" ? "runner" : "growing-task",
    );
    assert.ok(publications >= 2);
    assert.match(
      result.observationUnavailable,
      /registration\/lease write failure/,
    );
    assert.ok(
      stats.unavailable.some((reason) => reason.includes("publication")),
    );
  }
});

test(
  "WO-185 bounded CLI preserves literal argv, caller environment, cwd and exit status",
  { skip: !native },
  async (t) => {
    const f = await fixture(t),
      cli = await fixtureCli(f);
    let failure;
    try {
      execFileSync(
        process.execPath,
        [
          ...cli,
          "bounded",
          "--",
          process.execPath,
          "-e",
          "console.log('probe-fidelity '+JSON.stringify({value:2*3,args:process.argv.slice(1),visible:process.env.WO185_PROBE_VALUE,cwd:process.cwd()}));process.exitCode=7",
          "*.mjs",
          "a b",
          "",
        ],
        {
          cwd: f.repo,
          env: { ...process.env, WO185_PROBE_VALUE: "visible" },
          timeout: 10000,
          encoding: "utf8",
          stdio: ["ignore", "pipe", "pipe"],
        },
      );
    } catch (error) {
      failure = error;
    }
    assert.equal(failure?.status, 7, failure?.stderr);
    const observed = JSON.parse(
      failure.stdout
        .split("\n")
        .find((line) => line.startsWith("probe-fidelity "))
        .slice(15),
    );
    assert.deepEqual(observed, {
      value: 6,
      args: ["*.mjs", "a b", ""],
      visible: "visible",
      cwd: f.repo,
    });
    assert.match(failure.stderr, /bounded-result.*"exitCode":7/);
    assert.equal(
      readFileSync(
        join(
          f.base,
          `dotln-host-v1-${process.getuid?.() ?? "user"}`,
          "guard.json",
        ),
        "utf8",
      ).includes('"pid"'),
      true,
    );
    transcript("probe-fidelity", { observed, exitCode: failure.status });
  },
);

test("WO-185 swap escalation resets after a census and catches renewed growth", () => {
  const state = {},
    unit = 2 ** 20;
  assert.equal(observeSwapGrowth(state, -1), false);
  assert.equal(observeSwapGrowth(state, 400 * unit), false);
  assert.equal(observeSwapGrowth(state, 600 * unit), true);
  observeSwapGrowth(state, 600 * unit, true);
  for (let tick = 0; tick < 20; tick++)
    assert.equal(observeSwapGrowth(state, 600 * unit), false);
  assert.equal(observeSwapGrowth(state, 700 * unit), false);
  assert.equal(observeSwapGrowth(state, 750 * unit), true);
  observeSwapGrowth(state, 750 * unit, true);
  assert.equal(observeSwapGrowth(state, 300 * unit), false);
  assert.equal(observeSwapGrowth(state, 450 * unit), true);
});

test("WO-185 cleanup uses current groups, survives denied signals and targets a late group escape", () => {
  const stale = [
    { pid: 999999991, pgid: 999999991, birth: "one", name: "denied" },
    { pid: 999999992, pgid: 999999991, birth: "two", name: "escaped" },
    { pid: 999999993, pgid: 999999993, birth: "old", name: "reused" },
  ];
  const current = stale.map((row) => ({ ...row, pgid: row.pid }));
  current[2].birth = "new";
  const signals = [],
    errors = [];
  const killed = killOwned(stale, {
    sample: () => ({ processes: current }),
    sendSignal(pid) {
      signals.push(pid);
      if (Math.abs(pid) === stale[0].pid)
        throw Object.assign(new Error("planted EPERM"), { code: "EPERM" });
      // The second process may setsid again after this census; its direct PID
      // must still be targeted even after a successful group signal.
    },
    onError: (error) => errors.push(error),
  });
  assert.deepEqual(signals, [-999999991, -999999992, 999999991, 999999992]);
  assert.equal(errors.length, 2);
  assert.deepEqual(killed, [{ pid: 999999992, name: "escaped" }]);
});

test("WO-185 incident attempts retain cleanup errors and count one stopped tree once", async (t) => {
  const f = await fixture(t);
  const row = {
    failureKind: "memory-budget",
    scope: "task",
    repo: f.repo,
    pid: 999999991,
    stopId: "999999991:birth-one",
    process: "fixture",
    budgetBytes: 1,
    measuredPeakFootprintBytes: 2,
    killedProcesses: [{ pid: 999999991, name: "fixture" }],
    killErrors: [{ pid: 999999992, code: "EPERM", message: "planted denial" }],
  };
  appendIncident(f.directory, row);
  appendIncident(f.directory, { ...row, killedProcesses: [] });
  const local = readFileSync(
    join(f.repo, "docs/control/local/harness/memory-incidents.jsonl"),
    "utf8",
  )
    .trim()
    .split("\n")
    .map(JSON.parse);
  assert.equal(local.length, 2);
  assert.deepEqual(local[0].killedProcesses, row.killedProcesses);
  assert.equal(local[1].killErrors[0].code, "EPERM");
  assert.equal(
    planningFailures(f.repo, { all: true }).localMemoryStops.stops,
    1,
  );
});

test("WO-185 indented TAP failures remain in stdout diagnostics after head truncation", async (t) => {
  const f = await fixture(t);
  const row = await executeSuite(
    {
      name: "indented-tap",
      hostDirectory: f.directory,
      memoryLimits: { ...memoryBudgets(root), outputTailBytes: 2048 },
      command: [
        process.execPath,
        "-e",
        "console.log('    not ok 1 - nested failing case\\n      ---\\n      message: nested assertion detail\\n      ...');process.stdout.write('tail'.repeat(12000));process.exitCode=1",
      ],
    },
    f.repo,
  );
  assert.equal(row.exitCode, 1);
  assert.ok(row.droppedOutputBytes > 40000);
  assert.match(row.output, /nested failing case/);
  assert.match(row.output, /nested assertion detail/);
  assert.ok(Buffer.byteLength(row.output) < 3000);
});

test("WO-185 detached fixture changes select runner-fixtures at final review", () => {
  assert.ok(
    suites
      .find((row) => row.name === "runner-fixtures")
      .sources.includes("scripts/fixtures/detached-descendant.c"),
  );
});

test(
  "WO-185 a bare group names its largest member and retains the group kill",
  { skip: !native },
  async (t) => {
    const f = await fixture(t);
    const session = registerProcess(
      "sessions",
      process.pid,
      { protected: true, repo: f.repo, limits: f.limits },
      f.directory,
    );
    f.cleanups.push(() => session.release());
    await ensureHostGuard(f.directory);
    const child = spawn(
      "/bin/sh",
      ["-c", '"$1" zero & wait', "fixture-shell", f.binary],
      { detached: true, stdio: ["ignore", "pipe", "pipe"] },
    );
    cleanupChild(t, child);
    const [code, signal] = await once(child, "exit");
    assert.equal(code, null);
    assert.equal(signal, "SIGKILL");
    await delay(50);
    const incidents = readFileSync(join(f.directory, "incidents.jsonl"), "utf8")
      .trim()
      .split("\n")
      .map(JSON.parse);
    const incident = incidents.find((row) => row.pid === child.pid);
    assert.equal(incident.process, "memory-growth");
    assert.notEqual(incident.processPid, child.pid);
    assert.ok(incident.killedProcesses.some((row) => row.pid === child.pid));
    assert.equal(
      readHostSnapshot({ footprint: false }).processes.some(
        (row) => row.pgid === child.pid,
      ),
      false,
    );
    transcript("bare-shell-largest-member", { incident });
  },
);

test("WO-185 a nested gate keeps its validated parent lease when later lookup would fail", async (t) => {
  const f = await fixture(t);
  const parent = await acquireHostLanes({
    slots: 4,
    directory: f.directory,
    worktree: f.repo,
    task: "fixture-parent",
    parentLease: null,
  });
  f.cleanups.push(() => parent.release());
  const previous = process.env.DOTLN_HOST_LANE_LEASE;
  process.env.DOTLN_HOST_LANE_LEASE = JSON.stringify({
    directory: f.directory,
    file: parent.file,
  });
  let invalidated = false;
  const build = { name: "build", build: true, product: true };
  Object.defineProperty(build, "command", {
    enumerable: true,
    get() {
      if (new Error().stack.includes("expandSuiteTasks")) {
        invalidated = true;
        process.env.DOTLN_HOST_LANE_LEASE = "planted unreadable token";
      }
      return [process.execPath, "-e", "console.log('built')"];
    },
  });
  const deadline = Date.now() + 5000;
  let gate;
  try {
    gate = await runGate(["--again"], f.repo, {
      hostDirectory: f.directory,
      stopRequested: () => Date.now() >= deadline,
      table: [
        build,
        {
          name: "nested-task",
          product: true,
          command: [process.execPath, "-e", "console.log('nested passed')"],
        },
      ],
    });
  } finally {
    if (previous === undefined) delete process.env.DOTLN_HOST_LANE_LEASE;
    else process.env.DOTLN_HOST_LANE_LEASE = previous;
  }
  assert.equal(invalidated, true);
  assert.equal(gate.exitCode, 0);
  assert.equal(gate.taskTimeline.length, 2);
  transcript("cached-parent-lease", {
    passed: true,
    tasks: gate.taskTimeline.length,
  });
});

test("WO-185 a generated quarantine with nonfinite findings passes all three wo102 files", async (t) => {
  const f = await fixture(t);
  const { buildCorpus, MANIFEST_PATH } =
    await import("../corpus/harness/generate-cadence-corpus.mjs");
  const { RECORDED_SEED } =
    await import("../corpus/harness/wo102-cadence-lib.mjs");
  const control = buildCorpus(RECORDED_SEED);
  const selected = new Set(control.committed.map((row) => row.id));
  const target = control.full.find(
    (row) => row.kind === "Backoff" && !selected.has(row.id),
  );
  assert.ok(target);
  mkdirSync(join(f.repo, "corpus/harness"), { recursive: true });
  mkdirSync(join(f.repo, "packages/kernel"), { recursive: true });
  const files = [
    "wo102-generators.test.mjs",
    "wo102-properties.test.mjs",
    "wo102-replay.test.mjs",
  ];
  for (const name of [
    "bounded-findings.mjs",
    "generate-cadence-corpus.mjs",
    "wo102-cadence-lib.mjs",
    "wo102-reference.mjs",
    ...files,
  ])
    cpSync(
      join(root, "corpus/harness", name),
      join(f.repo, "corpus/harness", name),
    );
  cpSync(
    join(root, "packages/kernel/dist"),
    join(f.repo, "packages/kernel/dist"),
    { recursive: true },
  );
  cpSync(
    join(root, "packages/kernel/package.json"),
    join(f.repo, "packages/kernel/package.json"),
  );
  const lib = join(f.repo, "corpus/harness/wo102-cadence-lib.mjs");
  const original = readFileSync(lib, "utf8"),
    needle = "export function shipped(row, calls = []) {";
  assert.equal(original.split(needle).length, 2);
  writeFileSync(
    lib,
    original.replace(
      needle,
      needle +
        `
  if (row.id === ${JSON.stringify(target.id)}) {
    const value = reference(row, calls);
    value.result.dueAt = NaN;
    return value;
  }
`,
    ),
  );
  const generator = await executeSuite(
    {
      name: "nonfinite-quarantine-generation",
      hostDirectory: f.directory,
      memoryLimits: memoryBudgets(root),
      command: [
        process.execPath,
        "corpus/harness/generate-cadence-corpus.mjs",
        "--seed",
        RECORDED_SEED,
        "--write",
      ],
    },
    f.repo,
    30000,
  );
  assert.equal(generator.exitCode, 0, generator.output);
  const manifest = JSON.parse(
    readFileSync(join(f.repo, MANIFEST_PATH), "utf8"),
  );
  assert.ok(manifest.findings.length > 0 && manifest.findings.length <= 32);
  assert.match(JSON.stringify(manifest.findings), /\"\$number\":\"NaN\"/);
  const result = await executeSuite(
    {
      name: "nonfinite-quarantine-roundtrip",
      hostDirectory: f.directory,
      memoryLimits: memoryBudgets(root),
      command: [
        process.execPath,
        "--test",
        ...files.map((name) => `corpus/harness/${name}`),
      ],
    },
    f.repo,
    30000,
  );
  assert.equal(result.exitCode, 0, result.output);
  transcript("nonfinite-quarantine-roundtrip", {
    target: target.id,
    findings: manifest.findings.length,
    durationMs: result.durationMs,
    peakFootprintBytes: result.peakFootprintBytes,
    output: result.output,
  });
});
