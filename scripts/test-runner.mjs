#!/usr/bin/env node
import { spawn, spawnSync } from "node:child_process";
import { availableParallelism } from "node:os";
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  renameSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { startDeadline } from "../packages/skeleton/src/gate-deadlines.mjs";
import { evidenceSourceContent } from "../packages/skeleton/src/evidence-editions.mjs";
import { gateCriticalPath } from "./lib/gate-timeline.mjs";
import {
  beginGateRun,
  gateTreeHash,
  gateCodeIdentity,
  recordGateChecks,
} from "./lib/gate-evidence.mjs";
import {
  createReleaseFixtureContext,
  releaseCases,
} from "./lib/release-fixtures.mjs";
import { completeCoverage, suiteEnvironment } from "./lib/suite-evidence.mjs";

import { evidenceSources } from "./lib/evidence-sources.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const node = (name, file, options = {}) => ({
  name,
  command: [process.execPath, file],
  ...options,
});
const nodeTests = (name, pattern, options = {}) => ({
  name,
  command: [
    process.execPath,
    "--test",
    ...(options.skipPattern
      ? [`--test-skip-pattern=${options.skipPattern}`]
      : []),
    ...(options.namePattern
      ? [`--test-name-pattern=${options.namePattern}`]
      : []),
    ...(options.fileConcurrency
      ? [`--test-concurrency=${options.fileConcurrency}`]
      : []),
    pattern,
  ],
  needsBuild: true,
  ...options,
});
// These shells each own a checked temporary root, Git repository and PATH.
const shell = (name, file) => ({
  name,
  command: ["bash", file],
  needsBuild: true,
});

// Machinery declarations select optional review checks by their own source paths.
const machinerySources = {
  "fixture-temp-root": [
    "scripts/test-temp-root.sh",
    "scripts/test-fixture-temp-root.sh",
  ],
  "harness-probe": [
    "scripts/harness-probe.mjs",
    "scripts/lib/subagent-probe.mjs",
    "scripts/fixtures/subagent-probe-hook.mjs",
    "scripts/lib/authority-probe.mjs",
    "scripts/fixtures/authority-effect.mjs",
    "scripts/test-authority-probe.mjs",
    "scripts/lib/writing-worker-probe.mjs",
    "scripts/probe-worker-hosts.mjs",
    "scripts/test-harness-probe.mjs",
  ],
  "harness-fixtures": [
    "packages/skeleton/src/presence-heartbeat.ts",
    "packages/skeleton/src/presence-signals.ts",
    "packages/skeleton/src/resident-store.ts",
    "scripts/terms.mjs",
    "scripts/harness-context.mjs",
    "scripts/lib/harness-context.mjs",
    "packages/skeleton/src/feedback-boundary.ts",
    "packages/skeleton/src/gate-evidence.mjs",
    "scripts/test-harness.mjs",
    "scripts/test-observed-facts.mjs",
    "scripts/lib/executor-handoff.mjs",
    "scripts/resume.mjs",
    "scripts/work-orders.mjs",
    "packages/skeleton/src/observed-facts.ts",
    "packages/skeleton/src/correction-observation.mjs",
    "scripts/test-target-harness.mjs",
    "scripts/lib/harness.mjs",
    "packages/compiler/src/harness.ts",
    "packages/skeleton/src/harness-host.ts",
    "packages/skeleton/src/subagent-budget.ts",
    "packages/skeleton/src/harness-command.ts",
    "packages/skeleton/src/loadouts/",
  ],
  harness: [
    "packages/skeleton/src/presence-heartbeat.ts",
    "packages/skeleton/src/presence-signals.ts",
    "packages/skeleton/src/resident-store.ts",
    "scripts/harness.mjs",
    "packages/skeleton/src/harness-host.ts",
    "packages/skeleton/src/subagent-budget.ts",
    "packages/skeleton/src/gate-evidence.mjs",
    "scripts/lib/harness.mjs",
    "packages/compiler/src/harness.ts",
    "packages/skeleton/src/loadouts/",
  ],
  "harness-context": [
    "scripts/lib/process-budget.mjs",
    "scripts/lib/harness.mjs",
    "scripts/harness-context.mjs",
    "scripts/lib/harness-context.mjs",
  ],
  "harness-evidence": evidenceSources["harness"],
  "plan-refutation": [
    "packages/skeleton/src/plan-refutation-host.ts",
    "packages/skeleton/src/plan-refutation-fake.ts",
    "packages/skeleton/src/worker-transport.ts",
    "scripts/test-plan-refutation.mjs",
    "scripts/refute-plan.mjs",
    "scripts/lib/plan-",
    "packages/skeleton/src/plan-refutation-protocol.ts",
    "packages/skeleton/src/loadouts/plan-refuter.ts",
  ],
  "runner-fixtures": [
    "scripts/lib/gate-timeline.mjs",
    "scripts/measure-gates.mjs",
    "scripts/lib/gate-evidence.mjs",
    "scripts/test-runner.mjs",
    "packages/skeleton/src/evidence-editions.mjs",
    "scripts/test-runner.test.mjs",
    "scripts/test-gate-deadlines.mjs",
    "scripts/test-release-fixtures.mjs",
    "scripts/test-release.sh",
    "scripts/lib/suite-evidence.mjs",
    "scripts/lib/release-fixtures.mjs",
    "packages/skeleton/src/gate-evidence.mjs",
    "packages/skeleton/src/gate-deadlines.mjs",
  ],
  "process-debt": [
    "packages/skeleton/src/correction-observation.mjs",
    "scripts/lib/meta.mjs",
    "scripts/lib/intake-reconciliation.mjs",
    "scripts/lib/evidence-preparation.mjs",
    "scripts/lib/planning-followups.mjs",
    "scripts/build.mjs",
    "scripts/work-orders.mjs",
    "scripts/discover.mjs",
    "packages/skeleton/src/usage-observation.mjs",
    "scripts/test-process-debt.mjs",
    "scripts/test-codex-session.mjs",
    "scripts/lib/harness-runtime.mjs",
    "scripts/lib/lifecycle-evidence.mjs",
    "scripts/lib/process-budget.mjs",
    "packages/skeleton/src/harness-host.ts",
    "packages/skeleton/src/subagent-budget.ts",
    "packages/skeleton/src/gate-evidence.mjs",
  ],
  mutation: ["corpus/mutation/"],
  "authority-evidence": evidenceSources["authority"],
  "artifact-evidence": evidenceSources["artifact-identity"],
  "verification-evidence": evidenceSources["verification"],
  "feedback-evidence": evidenceSources["feedback"],
  meta: [
    "packages/skeleton/src/correction-observation.mjs",
    "scripts/lib/control-store.mjs",
    "scripts/lib/control-time.mjs",
    "scripts/lib/planning-followups.mjs",
    "packages/skeleton/src/usage-observation.mjs",
    "scripts/meta.mjs",
    "scripts/lib/meta.mjs",
    "scripts/lib/process-budget.mjs",
  ],
};
const protection = {
  build: "source compiles into runnable packages",
  "release-surfaces":
    "release claims match component versions and reviewed notes",
  "release-preparation":
    "release preparation preserves source and chooses the classified target",
  "github-body": "published descriptions preserve reviewed content",
  "license-fixtures":
    "source-only publication preserves license and package privacy",
  "license-surfaces": "shipped license and private-package pins remain valid",
  "publication-fixtures":
    "public editions retain their reviewed source boundaries",
  "backup-intake": "private intake survives backup and recovery",
  resume: "work-order transitions preserve reports and legal phase order",
  checkpoint: "pending work can be recovered from named checkpoints",
  worktree: "isolated work and intake survive publish and close",
  release: "reviewed releases publish idempotently from merged main",
  kernel: "domain events and human judgment contracts replay consistently",
  compiler: "supports compile to the intended constraints and harness behavior",
  skeleton: "the local runtime executes work within admitted authority",
  console: "operators can inspect current work and recorded evidence",
  "work-orders-fixtures":
    "work-order lookup and dependencies identify executable work",
  "adjacent-queue": "operator steering controls the next bounded repair",
  "codex-continuation":
    "Codex restores only its owned unfinished task after compaction, continues once and yields to recovery controls",
  "authority-grants": "workers cannot grant themselves additional authority",
  "artifact-corpus":
    "artifact identity remains stable and collisions are refused",
};
function classifySuite(row) {
  const machinery = Object.hasOwn(machinerySources, row.name);
  const document = Boolean(
    row.document ||
    [
      "release-surfaces",
      "authority-evidence",
      "artifact-evidence",
      "verification-evidence",
      "feedback-evidence",
      "harness",
      "harness-context",
      "harness-evidence",
      "meta",
    ].includes(row.name),
  );
  return {
    ...row,
    machinery,
    document,
    product: !machinery && !document,
    protects:
      row.protects ??
      protection[row.name] ??
      `${row.name} validates its declared project surface`,
    sources: machinerySources[row.name] ?? [],
  };
}
export function changedMachinery(repo, table = suites, base = "origin/main") {
  let run = spawnSync("git", ["diff", "--name-only", base, "--"], {
    cwd: repo,
    encoding: "utf8",
  });
  if (run.status !== 0) {
    base = "main";
    run = spawnSync("git", ["diff", "--name-only", base, "--"], {
      cwd: repo,
      encoding: "utf8",
    });
  }
  if (run.status !== 0) return table.filter((row) => row.machinery);
  const files = run.stdout
    .split("\n")
    .filter(Boolean)
    .filter((file) =>
      table.some(
        (row) =>
          row.machinery &&
          row.sources.some((source) => file.startsWith(source)),
      ),
    )
    .filter((file) => {
      // Reuse the evidence projection: release literals alone change no behavior.
      const before = spawnSync("git", ["show", `${base}:${file}`], {
        cwd: repo,
        encoding: "utf8",
      });
      if (before.status !== 0) return true;
      try {
        return (
          evidenceSourceContent(file, before.stdout) !==
          evidenceSourceContent(file, readFileSync(join(repo, file), "utf8"))
        );
      } catch {
        return true;
      }
    });
  return table.filter(
    (row) =>
      row.machinery &&
      row.sources.some((source) =>
        files.some((file) => file === source || file.startsWith(source)),
      ),
  );
}

// Every command from the 2026-09-09 chain has one declared owner below. Build
// deletion and shell glob assertions are replaced by atomic-build and expand().
export const suites = [
  {
    name: "format",
    command: ["npm", "run", "format:check", "--silent"],
    fast: true,
    document: true,
    preflight: true,
  },
  node("build", "scripts/build.mjs", { fast: true, build: true }),
  node("release-surfaces", "scripts/release.mjs", {
    args: ["check-surfaces", "--local"],
    fast: true,
    needsBuild: true,
    preflight: true,
  }),
  nodeTests("release-preparation", "scripts/test-release-preparation.mjs"),
  nodeTests("github-body", "scripts/test-github-body.mjs"),
  nodeTests("license-fixtures", "scripts/test-license-surfaces.mjs"),
  node("license-surfaces", "scripts/license-surfaces.mjs", {
    preflight: true,
  }),
  shell("fixture-temp-root", "scripts/test-fixture-temp-root.sh"),
  shell("publication-fixtures", "scripts/test-publication.sh"),
  shell("backup-intake", "scripts/test-backup-intake.sh"),
  shell("resume", "scripts/test-resume.sh"),
  shell("checkpoint", "scripts/test-checkpoint.sh"),
  shell("worktree", "scripts/test-worktree.sh"),
  shell("release", "scripts/test-release.sh"),
  shell("work-orders-fixtures", "scripts/test-work-orders.sh"),
  node("publication", "scripts/check-publication.mjs", {
    fast: true,
    document: true,
    preflight: true,
  }),
  node("index", "scripts/work-orders.mjs", {
    args: ["index", "--check"],
    fast: true,
    document: true,
    preflight: true,
  }),
  ...["kernel", "compiler", "skeleton", "console"].map((name) =>
    nodeTests(name, `packages/${name}/dist/test/*.test.js`, {
      fast: true,
      packageTest: true,
      ...(["skeleton", "console"].includes(name)
        ? { skipPattern: "\\[document\\]" }
        : {}),
      ...(name === "console" ? {} : { group: "package-tests" }),
      // The outer runner owns parallelism. Node otherwise launches one test
      // process per available CPU on top of every other active suite.
      fileConcurrency: Math.max(
        1,
        Math.min(2, Math.floor(availableParallelism() / 4)),
      ),
    }),
  ),
  ...["skeleton", "console"].map((name) =>
    nodeTests(`${name}-docs`, `packages/${name}/dist/test/*.test.js`, {
      document: true,
      namePattern: "\\[document\\]",
      fileConcurrency: 2,
      protects:
        "current product documentation and recorded inputs agree with their runtime projections",
    }),
  ),
  nodeTests("adjacent-queue", "scripts/test-adjacent-queue.mjs"),
  nodeTests("codex-continuation", "scripts/test-codex-continuation.mjs"),
  nodeTests("harness-probe", "scripts/test-harness-probe.mjs", {
    command: [
      process.execPath,
      "--test",
      "--test-concurrency=1",
      "scripts/test-harness-probe.mjs",
      "scripts/test-authority-probe.mjs",
    ],
  }),
  nodeTests("authority-grants", "scripts/test-authority-grants.mjs"),
  nodeTests(
    "local-runner-double",
    "scripts/probes/local-runner-smoke.test.mjs",
    {
      command: [
        process.execPath,
        "--test",
        "--test-concurrency=1",
        "scripts/probes/local-runner-smoke.test.mjs",
        "scripts/probes/local-runner-load.test.mjs",
      ],
      protects:
        "local runner research preserves failures, validates responses and observes cancellation using loopback doubles only",
    },
  ),
  node("authority-evidence", "scripts/authority-evidence.mjs", {
    args: ["--check"],
    needsBuild: true,
    preflight: true,
  }),
  nodeTests("harness-fixtures", "scripts/test-harness.mjs", {
    group: "hook-heavy",
    exclusive: true,
  }),
  node("harness", "scripts/harness.mjs", {
    args: ["check"],
    fast: true,
    needsBuild: true,
    preflight: true,
  }),
  node("harness-context", "scripts/harness-context.mjs", {
    args: ["--check"],
    fast: true,
    needsBuild: true,
    preflight: true,
  }),
  node("harness-evidence", "scripts/harness-evidence.mjs", {
    needsBuild: true,
    preflight: true,
  }),
  node("plan-refutation", "scripts/test-plan-refutation.mjs", {
    args: ["--fixtures-only"],
    needsBuild: true,
  }),
  node("plan-refutation-current", "scripts/test-plan-refutation.mjs", {
    args: ["--check-only"],
    document: true,
  }),
  nodeTests("artifact-corpus", "corpus/harness/wo101-id-corpus.test.mjs"),
  node("artifact-evidence", "scripts/artifact-identity-evidence.mjs", {
    args: ["--check"],
    needsBuild: true,
    preflight: true,
  }),
  node("verification-evidence", "scripts/verification-evidence.mjs", {
    args: ["--check"],
    needsBuild: true,
    preflight: true,
  }),
  node("feedback-evidence", "scripts/feedback-evidence.mjs", {
    args: ["--check"],
    needsBuild: true,
    preflight: true,
  }),
  nodeTests("mutation", "corpus/mutation/wo108-selftest.test.mjs"),
  nodeTests("runner-fixtures", "scripts/test-runner.test.mjs"),
  nodeTests("process-debt", "scripts/test-process-debt.mjs", {
    group: "hook-heavy",
    exclusive: true,
  }),
  node("meta", "scripts/meta.mjs", {
    args: ["--check"],
    fast: true,
    preflight: true,
  }),
  node("plan", "scripts/refute-plan.mjs", { args: ["check"], document: true }),
].map(classifySuite);

export function validateSuites(table) {
  if (
    !table.length ||
    new Set(table.map((row) => row.name)).size !== table.length
  )
    throw new Error("Empty or duplicate suite inventory");
  if (table.filter((row) => row.build).length !== 1)
    throw new Error("Exactly one build must be declared");
  for (const row of table)
    if (
      !row.name ||
      !Array.isArray(row.command) ||
      (!row.command.length && row.name !== "document-barrier")
    )
      throw new Error("Invalid suite declaration");
  for (const row of table)
    if (
      row.loadSlots !== undefined &&
      (!Number.isInteger(row.loadSlots) ||
        row.loadSlots < 1 ||
        row.loadSlots > 4)
    )
      throw new Error(`Invalid scheduler lane reservation: ${row.name}`);
}

const explicitlyIsolated = (row) =>
  Boolean(row.build || row.exclusive || row.loadClass === "isolated");
const reservedSlots = (row, concurrency) =>
  explicitlyIsolated(row)
    ? concurrency
    : Math.min(row.loadSlots ?? 1, concurrency);

export function expand(command, repo) {
  return command.flatMap((part) => {
    if (part.startsWith("--") || !part.includes("*")) return [part];
    if (!/^[^*]+\/\*\.test\.js$/.test(part))
      throw new Error(`Unsupported test glob: ${part}`);
    const directory = dirname(part);
    const paths = existsSync(join(repo, directory))
      ? readdirSync(join(repo, directory))
          .filter((name) => name.endsWith(".test.js"))
          .sort()
          .map((name) => `${directory}/${name}`)
      : [];
    if (!paths.length) throw new Error(`Missing built test suite: ${part}`);
    return paths;
  });
}

export function executeSuite(
  row,
  repo,
  timeoutMs = 900_000,
  onProgress = () => {},
  signal = undefined,
) {
  const started = Date.now();
  const env = suiteEnvironment(
    row.executionEnvironment ?? process.env,
    row.gateContext,
  );
  const deadline = startDeadline(`suite:${row.name}`, timeoutMs, { env });
  onProgress({ name: row.name, message: "started", elapsedMs: 0 });
  let command;
  try {
    command = expand([...row.command, ...(row.args ?? [])], repo);
    if (row.executionWrapper) command = [...row.executionWrapper, ...command];
  } catch (error) {
    return Promise.resolve({
      name: row.name,
      exitCode: 1,
      durationMs: Date.now() - started,
      output: error.message,
      executed: true,
    });
  }
  return new Promise((resolveRun) => {
    // Each POSIX suite owns a process group, including descendants inheriting
    // its pipes. Cancellation signals that group, never a scanned process list.
    const grouped = process.platform !== "win32";
    const child = spawn(command[0], command.slice(1), {
      cwd: repo,
      stdio: ["ignore", "pipe", "pipe"],
      env,
      detached: grouped,
    });
    let output = "";
    let timedOut = false;
    let stopped = false;
    let failure;
    let killTimer;
    let finishTimer;
    let escalated = false;
    const terminate = (kind) => {
      try {
        if (grouped && child.pid) process.kill(-child.pid, kind);
        else child.kill(kind);
      } catch (error) {
        if (error.code !== "ESRCH") failure ??= error.message;
      }
    };
    const cancel = () => {
      terminate("SIGTERM");
      killTimer ??= setTimeout(() => {
        escalated = true;
        terminate("SIGKILL");
        // A descendant may deliberately leave the group or the host may deny
        // signalling. Its inherited descriptors must not hold the gate open.
        child.stdout.destroy();
        child.stderr.destroy();
        child.unref();
        finishTimer = setTimeout(() => finish(null), 100);
      }, 1000);
    };
    const stop = () => {
      stopped = true;
      onProgress({
        name: row.name,
        message: "stopped by gate request",
        elapsedMs: Date.now() - started,
      });
      cancel();
    };
    if (signal?.aborted) stop();
    else signal?.addEventListener("abort", stop, { once: true });
    const timer = setTimeout(() => {
      timedOut = true;
      deadline.finish(true);
      cancel();
    }, timeoutMs);
    let progressCount = 0;
    let lastProgressAt = started;
    let lastMessage = "waiting for the next case report";
    const progress = (message) => {
      if (progressCount >= 80) return;
      progressCount++;
      lastProgressAt = Date.now();
      onProgress({
        name: row.name,
        message: message.slice(0, 200),
        elapsedMs: lastProgressAt - started,
      });
    };
    const heartbeat = setInterval(() => {
      if (Date.now() - lastProgressAt >= 15_000)
        progress(`running; last report: ${lastMessage}`);
    }, 15_000);
    const capture = () => {
      let partial = "";
      return (chunk) => {
        output += chunk.toString();
        partial += chunk.toString();
        const lines = partial.split("\n");
        partial = lines.pop().slice(-1024);
        for (const line of lines)
          if (/^(?:PROGRESS |# Subtest:|ok \d+ -|not ok \d+ -)/.test(line)) {
            lastMessage = line.slice(0, 200);
            if (
              !progressCount ||
              /^(?:PROGRESS |not ok )/.test(line) ||
              Date.now() - lastProgressAt >= 1000
            )
              progress(lastMessage);
          }
      };
    };
    child.stdout.on("data", capture());
    child.stderr.on("data", capture());
    child.on("error", (error) => {
      failure = error.message;
    });
    let finished = false;
    const finish = (code) => {
      if (finished) return;
      finished = true;
      clearTimeout(timer);
      clearTimeout(killTimer);
      clearTimeout(finishTimer);
      clearInterval(heartbeat);
      signal?.removeEventListener("abort", stop);
      const durationMs = Date.now() - started;
      deadline.finish();
      resolveRun({
        name: row.name,
        durationMs,
        startedAt: new Date(started).toISOString(),
        finishedAt: new Date().toISOString(),
        exitCode: timedOut || stopped ? 1 : (code ?? 1),
        executed: true,
        ...(stopped ? { stopped: true } : {}),
        output: `${output}${failure ? `\n${failure}` : ""}${timedOut ? `\nSuite ${row.name} timed out after ${durationMs} ms` : ""}${stopped ? `\nSuite ${row.name} stopped by gate request after ${durationMs} ms` : ""}`,
      });
    };
    child.on("close", (code) => {
      if (!killTimer || escalated) finish(code);
    });
  });
}

/** Weighted lanes, explicit barriers and groups bound process-heavy overlap. */
export async function scheduleSuites(
  table,
  {
    repo = root,
    concurrency = Math.max(
      1,
      Math.min(4, Math.floor(availableParallelism() / 2)),
    ),
    execute = executeSuite,
    onResult = () => {},
    onActiveChange = () => {},
    diagnosticContext = {},
    stopRequested = () => false,
  } = {},
) {
  validateSuites(table);
  if (!Number.isInteger(concurrency) || concurrency < 1)
    throw new Error("Concurrency must be a positive integer");
  if (concurrency > 4)
    throw new Error("Declared gate load caps concurrency at four");
  const build = table.find((row) => row.build);
  const results = [];
  const active = new Map();
  const lanes = Array.from({ length: concurrency }, () => ({
    active: null,
    previous: null,
  }));
  const executeTask = async (
    row,
    laneIndexes,
    predecessors,
    observation = {
      startedAt: new Date().toISOString(),
      concurrentAtStart: [...active.keys()],
    },
  ) => {
    const { startedAt, concurrentAtStart } = observation;
    const isolated = explicitlyIsolated(row);
    const occupiedSlots = laneIndexes.length;
    const peerConcurrency = isolated
      ? 1
      : Math.max(1, concurrency - occupiedSlots + 1);
    const gateContext = {
      ...diagnosticContext,
      task: row.name,
      loadClass: isolated ? "isolated" : "shared",
      concurrency: peerConcurrency,
      loadFactor: peerConcurrency * 2,
      reservedSlots: occupiedSlots,
      slotCapacity: concurrency,
    };
    const result = await execute({ ...row, gateContext }, repo);
    const finishedAt = new Date().toISOString();
    return {
      ...result,
      startedAt,
      finishedAt,
      concurrentAtStart,
      predecessors: [...new Set(predecessors.filter(Boolean))],
      schedulerDurationMs: Date.parse(finishedAt) - Date.parse(startedAt),
      loadClass: gateContext.loadClass,
      loadFactor: gateContext.loadFactor,
      peerCap: gateContext.concurrency - 1,
      reservedSlots: occupiedSlots,
      lanes: laneIndexes,
    };
  };
  const finish = (result) => {
    results.push(result);
    onResult(result);
  };
  onActiveChange([build.name]);
  finish(
    await executeTask(
      build,
      lanes.map((_, index) => index),
      [],
    ),
  );
  onActiveChange([]);
  for (const lane of lanes) lane.previous = build.name;
  if (results[0].exitCode !== 0) return results;
  const pending = table.filter((row) => row !== build);
  for (const row of pending)
    for (const dependency of row.after ?? [])
      if (!table.some((item) => item.name === dependency))
        throw new Error(`Missing dependency: ${dependency}`);
  if (concurrency > 1)
    pending.sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
  const groups = new Set();
  let exclusive = false;
  while (pending.length || active.size) {
    // A stop request ends scheduling at this boundary; the suites already
    // running are ended by their execute adapter and settle below.
    if (stopRequested())
      while (pending.length) {
        const row = pending.pop();
        finish({
          name: row.name,
          exitCode: 1,
          durationMs: 0,
          executed: false,
          output: "Gate stopped by request before this suite started",
        });
      }
    for (let index = pending.length - 1; index >= 0; index--)
      if (
        (pending[index].after ?? []).some((name) =>
          results.some(
            (result) => result.name === name && result.exitCode !== 0,
          ),
        )
      ) {
        const [row] = pending.splice(index, 1);
        finish({
          name: row.name,
          exitCode: 1,
          durationMs: 0,
          executed: false,
          output: "Required preflight or fixture preparation failed",
        });
      }
    while (!exclusive && lanes.some((lane) => lane.active === null)) {
      const freeLanes = lanes
        .map((lane, index) => ({ lane, index }))
        .filter(({ lane }) => lane.active === null)
        .map(({ index }) => index);
      const index = pending.findIndex(
        (row) =>
          reservedSlots(row, concurrency) <= freeLanes.length &&
          (!row.group || !groups.has(row.group)) &&
          (!explicitlyIsolated(row) || active.size === 0) &&
          (row.after ?? []).every((name) =>
            results.some(
              (result) => result.name === name && result.exitCode === 0,
            ),
          ),
      );
      if (index < 0) break;
      const [row] = pending.splice(index, 1);
      const isolated = explicitlyIsolated(row);
      if (isolated) exclusive = true;
      if (row.group) groups.add(row.group);
      const laneIndexes = freeLanes.slice(0, reservedSlots(row, concurrency));
      const predecessors = [
        build.name,
        ...(row.after ?? []),
        ...laneIndexes.map((index) => lanes[index].previous),
        // A task skipped for a failed dependency never started, so it is not
        // a timeline edge (VER-001 F1).
        ...results
          .filter(
            (result) =>
              result.startedAt &&
              table.find((task) => task.name === result.name)?.group ===
                row.group &&
              row.group,
          )
          .slice(-1)
          .map((result) => result.name),
      ];
      for (const index of laneIndexes) lanes[index].active = row.name;
      const observation = {
        startedAt: new Date().toISOString(),
        concurrentAtStart: [...active.keys()],
      };
      const task = Promise.resolve()
        .then(() => executeTask(row, laneIndexes, predecessors, observation))
        .then((result) => {
          finish(result);
          active.delete(row.name);
          for (const index of laneIndexes) {
            lanes[index].active = null;
            lanes[index].previous = row.name;
          }
          onActiveChange([...active.keys()]);
          if (isolated) exclusive = false;
          if (row.group) groups.delete(row.group);
        });
      active.set(row.name, task);
      onActiveChange([...active.keys()]);
    }
    if (active.size) await Promise.race(active.values());
    else if (pending.length)
      throw new Error("Cyclic or unsatisfied suite dependencies");
  }
  return results;
}

export function expandSuiteTasks(selected, repo, template) {
  const preflight = selected
    .filter((row) => row.preflight)
    .map((row) => row.name);
  return selected
    .flatMap((row) => {
      if (row.name === "release") {
        if (!template) throw new Error("Release fixture template is required");
        return [
          {
            ...row,
            name: "release:prepare",
            priority: 100,
            args: ["--prepare-template", template],
          },
          ...releaseCases(repo).map((name) => ({
            ...row,
            name: `release:case:${name}`,
            priority: 60,
            after: ["release:prepare"],
            args: ["--case", name, "--template", template],
          })),
        ];
      }
      if (row.name === "runner-fixtures")
        return [
          {
            ...row,
            args: [
              "scripts/test-release-fixtures.mjs",
              "scripts/test-gate-deadlines.mjs",
            ],
          },
        ];
      return [row];
    })
    .map((row) => ({
      ...row,
      priority:
        row.priority ??
        (row.exclusive
          ? 200
          : ["skeleton", "worktree", "resume"].includes(row.name)
            ? 80
            : 0),
      ...(!row.build && !row.preflight && preflight.length
        ? { after: [...new Set([...(row.after ?? []), ...preflight])] }
        : {}),
    }));
}

export function aggregateSuiteRows(selected, tasks, rows) {
  return selected.map((suite) => {
    const members = tasks.filter(
      (task) =>
        task.name === suite.name || task.name.startsWith(`${suite.name}:`),
    );
    const observed = rows.filter((row) =>
      members.some((member) => member.name === row.name),
    );
    if (
      members.length === 1 &&
      members[0].name === suite.name &&
      observed.length === 1
    )
      return observed[0];
    const starts = observed
      .filter((row) => row.startedAt)
      .map((row) => Date.parse(row.startedAt));
    const ends = observed
      .filter((row) => row.finishedAt)
      .map((row) => Date.parse(row.finishedAt));
    return {
      name: suite.name,
      exitCode: completeCoverage(members, observed) ? 0 : 1,
      durationMs:
        starts.length && ends.length
          ? Math.max(...ends) - Math.min(...starts)
          : 0,
      executed: observed.some((row) => row.executed),
      reused: observed.some((row) => row.reused),
      expectedCases: members.map((row) => row.name),
      cases: observed.map(({ output, ...row }) => ({
        ...row,
        ...(output && (row.exitCode !== 0 || !row.executed) ? { output } : {}),
      })),
      output: "",
    };
  });
}

export async function runGate(
  args = process.argv.slice(2),
  repo = root,
  options = {},
) {
  if (args.includes("--list")) return runGateChecks(args, repo, options);
  const active = beginGateRun(repo, "scripts/test-runner.mjs");
  try {
    return await runGateChecks(args, repo, {
      stopRequested: active.stopRequested,
      ...options,
    });
  } finally {
    active.release();
  }
}

async function runGateChecks(args, repo, { stopRequested = () => false } = {}) {
  let document = false,
    machinery = false,
    review = false,
    serial = false,
    list = false,
    only;
  for (let index = 0; index < args.length; index++) {
    const arg = args[index];
    if (arg === "--document") document = true;
    else if (arg === "--machinery") machinery = true;
    else if (arg === "--review" || arg === "--full") review = true;
    else if (arg === "--serial") serial = true;
    else if (arg === "--list") list = true;
    else if (arg === "--fresh") {
      /* Every invocation is fresh. */
    } else if (arg === "--only" && !only) only = args[++index];
    else
      throw new Error(
        "usage: test-runner [--document|--machinery|--review] [--only <suite>] [--serial] [--list]",
      );
  }
  if (only && !suites.some((row) => row.name === only))
    throw new Error(`Unknown suite: ${only}`);
  let selected = suites.filter((row) =>
    only
      ? row.name === only
      : document
        ? row.document
        : machinery
          ? row.machinery
          : row.product,
  );
  if (review && !only && !document && !machinery)
    selected = [...new Set([...selected, ...changedMachinery(repo)])];
  if (list) {
    for (const row of selected)
      console.log(`${row.name} — protects: ${row.protects}`);
    return { exitCode: 0 };
  }
  const checkId = only
    ? `suite:${only}`
    : document
      ? "npm run test:docs"
      : machinery
        ? "npm run test:machinery"
        : "npm test";
  const treeHash = gateTreeHash(repo),
    codeIdentity = gateCodeIdentity(repo),
    started = Date.now();
  const needsBuild = selected.some((row) => row.needsBuild || row.build);
  selected = [
    needsBuild
      ? suites.find((row) => row.build)
      : { name: "document-barrier", build: true, command: [] },
    ...selected.filter((row) => !row.build),
  ];
  const fixture = selected.some((row) => row.name === "release")
    ? createReleaseFixtureContext()
    : null;
  const diagnosticRoot = join(repo, "docs/control/local/harness/runner");
  mkdirSync(diagnosticRoot, { recursive: true });
  const peerFile = join(diagnosticRoot, "active.json"),
    deadlineLog = join(diagnosticRoot, "deadlines.jsonl");
  writeFileSync(deadlineLog, "");
  const concurrency = serial
    ? 1
    : Math.max(1, Math.min(4, Math.floor(availableParallelism() / 2)));
  const tasks = expandSuiteTasks(selected, repo, fixture?.template);
  const stop = new AbortController();
  const stopping = () => {
    if (stopRequested()) stop.abort();
    return stop.signal.aborted;
  };
  const poll = setInterval(stopping, 500);
  try {
    const taskRows = await scheduleSuites(tasks, {
      repo,
      concurrency,
      stopRequested: stopping,
      diagnosticContext: { peerFile, deadlineLog },
      onActiveChange(names) {
        writeFileSync(`${peerFile}.tmp`, JSON.stringify({ tasks: names }));
        renameSync(`${peerFile}.tmp`, peerFile);
      },
      execute: async (row, cwd) =>
        row.name === "document-barrier"
          ? {
              name: row.name,
              exitCode: 0,
              durationMs: 0,
              executed: true,
              output: "",
            }
          : executeSuite(
              row,
              cwd,
              900_000,
              ({ name, message, elapsedMs }) =>
                console.log(
                  `PROGRESS [${name}] ${(elapsedMs / 1000).toFixed(1)} s ${message}`,
                ),
              stop.signal,
            ),
      onResult(row) {
        if (row.name === "document-barrier") return;
        console.log(
          `${row.exitCode === 0 ? "PASS" : "FAIL"} ${row.name} ${(row.durationMs / 1000).toFixed(2)} s`,
        );
        if (row.exitCode !== 0)
          for (const line of (row.output ?? "").trimEnd().split("\n"))
            console.log(`  [${row.name}] ${line}`);
      },
    });
    if (stopping())
      throw new Error(
        `Gate stopped by request after ${((Date.now() - started) / 1000).toFixed(1)} s; no check recorded for tree ${treeHash}`,
      );
    const rows = aggregateSuiteRows(selected, tasks, taskRows);
    const unchanged = gateCodeIdentity(repo) === codeIdentity;
    const check = {
      checkId,
      treeHash,
      codeIdentity,
      subject: treeHash,
      durationMs: Date.now() - started,
      exitCode: completeCoverage(tasks, taskRows) && unchanged ? 0 : 1,
      executed: true,
      evidenceRef: `host-gate:${codeIdentity}:${only ?? checkId}`,
      recordedAt: new Date().toISOString(),
      executionMode: "fresh",
      freshSuites: taskRows.filter((row) => row.executed).length,
      reusedSuites: 0,
      requiredSuites: selected.map((row) => row.name),
      cases: rows,
      loadClass: {
        sharedCap: concurrency,
        factorPerSlot: 2,
        maxHostLoadPerCpu: 2,
        scheduler: "exclusive-machinery-v1",
      },
      taskTimeline: taskRows
        .filter((row) => row.startedAt)
        .map(({ output, ...row }) => row),
      deadlineDiagnostics: existsSync(deadlineLog)
        ? readFileSync(deadlineLog, "utf8")
            .split("\n")
            .filter(Boolean)
            .map(JSON.parse)
            .filter((row) => row.hit)
        : [],
    };
    check.criticalPath = gateCriticalPath(check);
    try {
      const { readControl } = await import("./lib/control-store.mjs");
      const active = [...readControl(repo).orders].filter(
        ([, row]) => row.state.phase !== "closed",
      );
      if (active.length === 1) check.workOrder = active[0][0];
    } catch {
      /* Standalone fixture. */
    }
    if (!only && !document && !machinery) recordGateChecks(repo, [check]);
    console.log(
      `${checkId}: ${rows.filter((row) => row.exitCode === 0).length} passed; ${rows.filter((row) => row.exitCode !== 0).length} failed; ${(check.durationMs / 1000).toFixed(2)} s; ${check.freshSuites} fresh tasks${unchanged ? "" : "; code changed"}`,
    );
    return check;
  } finally {
    clearInterval(poll);
    fixture?.cleanup();
  }
}

if (
  process.argv[1] &&
  pathToFileURL(resolve(process.argv[1])).href === import.meta.url
) {
  try {
    process.exitCode = (await runGate()).exitCode;
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
