#!/usr/bin/env node
import { spawn } from "node:child_process";
import { availableParallelism } from "node:os";
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { gateTreeHash, recordGateChecks } from "./lib/gate-evidence.mjs";
import { readBudgets, budgetVerdict } from "./lib/process-budget.mjs";
import {
  createReleaseFixtureContext,
  releaseCases,
} from "./lib/release-fixtures.mjs";
import {
  completeCoverage,
  loadSuiteSuccess,
  observeSuiteInputs,
  reusableResult,
  saveSuiteSuccess,
  suiteInputHash,
  suiteScope,
  suiteEnvironment,
} from "./lib/suite-evidence.mjs";

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
    reuse: "live",
  }),
  nodeTests("release-preparation", "scripts/test-release-preparation.mjs"),
  nodeTests("github-body", "scripts/test-github-body.mjs"),
  nodeTests("license-fixtures", "scripts/test-license-surfaces.mjs"),
  node("license-surfaces", "scripts/license-surfaces.mjs", {
    preflight: true,
    reuse: "live",
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
    reuse: "live",
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
      ...(name === "console" ? {} : { group: "package-tests" }),
      // The outer runner owns parallelism. Node otherwise launches one test
      // process per available CPU on top of every other active suite.
      fileConcurrency: Math.max(
        1,
        Math.min(2, Math.floor(availableParallelism() / 4)),
      ),
    }),
  ),
  nodeTests("adjacent-queue", "scripts/test-adjacent-queue.mjs"),
  nodeTests("authority-grants", "scripts/test-authority-grants.mjs"),
  node("authority-evidence", "scripts/authority-evidence.mjs", {
    args: ["--check"],
    needsBuild: true,
    preflight: true,
  }),
  nodeTests("harness-fixtures", "scripts/test-harness.mjs", {
    exclusive: true,
  }),
  node("harness", "scripts/harness.mjs", {
    args: ["check"],
    fast: true,
    needsBuild: true,
    preflight: true,
    reuse: "live",
  }),
  node("harness-context", "scripts/harness-context.mjs", {
    args: ["--check"],
    fast: true,
    needsBuild: true,
    preflight: true,
    reuse: "live",
  }),
  node("harness-evidence", "scripts/harness-evidence.mjs", {
    needsBuild: true,
    preflight: true,
    reuse: "live",
  }),
  nodeTests("plan-refutation", "scripts/test-plan-refutation.mjs"),
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
    args: ["--check", "--edition", "WO-126", "--revision", "002"],
    needsBuild: true,
    preflight: true,
  }),
  nodeTests("mutation", "corpus/mutation/wo108-selftest.test.mjs"),
  nodeTests("runner-fixtures", "scripts/test-runner.test.mjs"),
  nodeTests("process-debt", "scripts/test-process-debt.mjs", {
    exclusive: true,
  }),
  node("meta", "scripts/meta.mjs", {
    args: ["--check"],
    fast: true,
    preflight: true,
    reuse: "live",
  }),
  node("plan", "scripts/refute-plan.mjs", { args: ["check"], document: true }),
];

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
}

export function expand(command, repo) {
  return command.flatMap((part) => {
    if (!part.includes("*")) return [part];
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
) {
  const started = Date.now();
  onProgress({ name: row.name, message: "started", elapsedMs: 0 });
  let command;
  try {
    command = expand([...row.command, ...(row.args ?? [])], repo);
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
    const child = spawn(command[0], command.slice(1), {
      cwd: repo,
      stdio: ["ignore", "pipe", "pipe"],
      env: suiteEnvironment(),
    });
    let output = "";
    let timedOut = false;
    let failure;
    let killTimer;
    const timer = setTimeout(() => {
      timedOut = true;
      child.kill("SIGTERM");
      killTimer = setTimeout(() => child.kill("SIGKILL"), 1000);
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
    child.on("close", (code) => {
      clearTimeout(timer);
      clearTimeout(killTimer);
      clearInterval(heartbeat);
      const durationMs = Date.now() - started;
      resolveRun({
        name: row.name,
        durationMs,
        startedAt: new Date(started).toISOString(),
        finishedAt: new Date().toISOString(),
        exitCode: code ?? 1,
        executed: true,
        output: `${output}${failure ? `\n${failure}` : ""}${timedOut ? `\nSuite ${row.name} timed out after ${durationMs} ms` : ""}`,
      });
    });
  });
}

/** Explicit barriers and exclusive groups; unrelated suites use separate slots. */
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
  } = {},
) {
  validateSuites(table);
  if (!Number.isInteger(concurrency) || concurrency < 1)
    throw new Error("Concurrency must be a positive integer");
  const build = table.find((row) => row.build);
  const results = [];
  const finish = (result) => {
    results.push(result);
    onResult(result);
  };
  finish(await execute(build, repo));
  if (results[0].exitCode !== 0) return results;
  const pending = table.filter((row) => row !== build);
  for (const row of pending)
    for (const dependency of row.after ?? [])
      if (!table.some((item) => item.name === dependency))
        throw new Error(`Missing dependency: ${dependency}`);
  if (concurrency > 1)
    pending.sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
  const active = new Map();
  const groups = new Set();
  let exclusive = false;
  while (pending.length || active.size) {
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
    while (!exclusive && active.size < concurrency) {
      const index = pending.findIndex(
        (row) =>
          (!row.group || !groups.has(row.group)) &&
          (!row.exclusive || active.size === 0) &&
          (row.after ?? []).every((name) =>
            results.some(
              (result) => result.name === name && result.exitCode === 0,
            ),
          ),
      );
      if (index < 0) break;
      const [row] = pending.splice(index, 1);
      if (row.exclusive) exclusive = true;
      if (row.group) groups.add(row.group);
      const task = Promise.resolve()
        .then(() => execute(row, repo))
        .then((result) => {
          finish(result);
          active.delete(row.name);
          if (row.exclusive) exclusive = false;
          if (row.group) groups.delete(row.group);
        });
      active.set(row.name, task);
    }
    if (active.size) await Promise.race(active.values());
    else if (pending.length)
      throw new Error("Cyclic or unsatisfied suite dependencies");
  }
  return results;
}

export function expandSuiteTasks(selected, repo, template) {
  const priorities = {
    worktree: 100,
    skeleton: 90,
    console: 85,
    "harness-fixtures": 130,
    resume: 70,
    "process-debt": 120,
  };
  const tasks = selected.flatMap((row) => {
    if (row.name === "release") {
      if (!template) throw new Error("Release fixture template is required");
      return [
        {
          ...row,
          name: "release:prepare",
          priority: 110,
          args: ["--prepare-template", template],
        },
        ...releaseCases(repo).map((name) => ({
          ...row,
          name: `release:case:${name}`,
          priority: 60,
          after: ["release:prepare"],
          args: ["--case", name, "--template", template],
          inputCommand: [
            ...row.command,
            "--case",
            name,
            "--template",
            "<prepared-from-suite-inputs>",
          ],
        })),
      ];
    }
    if (row.name === "plan-refutation")
      return [
        {
          ...row,
          name: "plan-refutation:fixtures",
          // node --test discards script arguments on the supported Node line.
          // This file already awaits node:test cases when launched directly.
          command: [process.execPath, "scripts/test-plan-refutation.mjs"],
          priority: 100,
          args: ["--fixtures-only"],
        },
        {
          ...row,
          name: "plan-refutation:current",
          command: [process.execPath, "scripts/test-plan-refutation.mjs"],
          args: ["--check-only"],
        },
      ];
    if (row.name === "runner-fixtures")
      return [
        {
          ...row,
          args: [
            "scripts/test-suite-evidence.mjs",
            "scripts/test-release-fixtures.mjs",
          ],
        },
      ];
    return [{ ...row, priority: priorities[row.name] ?? 0 }];
  });
  const preflight = tasks.filter((row) => row.preflight).map((row) => row.name);
  return tasks.map((row) => ({
    ...row,
    // Checks can reuse their complete inputs even when no narrower document
    // scope is known. Preparation has effects needed by this invocation.
    ...(!row.build && row.name !== "release:prepare" && !row.reuse
      ? { reuse: "tree" }
      : {}),
    ...(!row.build && !row.preflight && !row.packageTest && preflight.length
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

export async function runGate(args = process.argv.slice(2), repo = root) {
  let full = false,
    document = false,
    serial = false,
    fresh = false,
    only;
  for (let index = 0; index < args.length; index++) {
    const arg = args[index];
    if (arg === "--full") full = true;
    else if (arg === "--document") document = true;
    else if (arg === "--serial") serial = true;
    else if (arg === "--fresh") fresh = true;
    else if (arg === "--only" && !only) only = args[++index];
    else
      throw new Error(
        "usage: test-runner [--full|--document] [--only <suite>] [--serial] [--fresh]",
      );
  }
  if (document && full) throw new Error("Select one gate");
  if (only && !suites.some((row) => row.name === only))
    throw new Error(`Unknown suite: ${only}`);
  const checkId = document
    ? "npm run test:docs"
    : full
      ? "npm run test:full"
      : "npm test";
  const treeHash = gateTreeHash(repo);
  const started = Date.now();
  let selected = suites.filter((row) =>
    only
      ? row.name === only
      : document
        ? row.document
        : full
          ? !row.document || row.fast
          : row.fast,
  );
  // The document gate needs no compilation. A synthetic barrier keeps scheduling
  // invariants identical without executing a build or any code suite.
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
  const tasks = expandSuiteTasks(selected, repo, fixture?.template);
  const scoped = tasks.some(
    (task) => task.reuse === "tree" || suiteScope(task) !== null,
  );
  let before;
  let taskRows;
  try {
    taskRows = await scheduleSuites(tasks, {
      repo,
      ...(serial ? { concurrency: 1 } : {}),
      execute: async (row, cwd) => {
        if (row.name === "document-barrier")
          return {
            name: row.name,
            exitCode: 0,
            durationMs: 0,
            executed: true,
            output: "",
          };
        if (scoped && !row.build && !before) before = observeSuiteInputs(repo);
        const inputHash =
          row.build || !before ? null : suiteInputHash(row, before);
        const cached = !fresh && loadSuiteSuccess(repo, row.name, inputHash);
        if (cached) return reusableResult(row, cached, inputHash);
        const result = await executeSuite(
          row,
          cwd,
          900_000,
          ({ name, message, elapsedMs }) =>
            console.log(
              `PROGRESS [${name}] ${(elapsedMs / 1000).toFixed(1)} s ${message}`,
            ),
        );
        return { ...result, inputHash };
      },
      onResult(row) {
        if (row.name === "document-barrier") return;
        console.log(
          `${row.reused ? "REUSE" : row.exitCode === 0 ? "PASS" : "FAIL"} ${row.name} ${row.reused ? `original ${(row.sourceExecution.durationMs / 1000).toFixed(2)} s at ${row.sourceExecution.recordedAt}` : `${(row.durationMs / 1000).toFixed(2)} s`}${row.durationMs > 30_000 ? " — split candidate (>30 s)" : ""}`,
        );
        if (row.exitCode !== 0 || /^FAIL /m.test(row.output))
          for (const line of row.output.trimEnd().split("\n"))
            console.log(`  [${row.name}] ${line}`);
      },
    });
  } finally {
    fixture?.cleanup();
  }
  const after = before ? observeSuiteInputs(repo) : null;
  for (const row of taskRows) {
    const task = tasks.find((task) => task.name === row.name);
    if (row.inputHash && row.inputHash !== suiteInputHash(task, after)) {
      row.exitCode = 1;
      row.output += "\nSuite inputs changed during the gate";
    }
  }
  const rows = aggregateSuiteRows(selected, tasks, taskRows);
  const unchanged = gateTreeHash(repo) === treeHash;
  const durationMs = Date.now() - started;
  let withinBudget;
  const recordedAt = new Date().toISOString();
  const check = {
    checkId: only ? `suite:${only}` : checkId,
    treeHash,
    subject: treeHash,
    durationMs,
    exitCode: 1,
    executed: true,
    evidenceRef: `host-gate:${treeHash}:${only ?? checkId}`,
    recordedAt,
    executionMode: fresh
      ? "forced-fresh"
      : taskRows.some((row) => row.reused)
        ? "composed"
        : "fresh",
    freshSuites: taskRows.filter((row) => row.executed).length,
    reusedSuites: taskRows.filter((row) => row.reused).length,
    inputObservation: [before, after]
      .filter(Boolean)
      .map((snapshot) => snapshot.meter),
    ...(before ? { inputEnvironmentKeys: before.environmentKeys } : {}),
    requiredSuites: selected.map((row) => row.name),
  };
  try {
    const { readControl } = await import("./lib/control-store.mjs");
    const control = readControl(repo);
    const active = [...control.orders].filter(
      ([, row]) => row.state.phase !== "closed",
    );
    if (active.length === 1) check.workOrder = active[0][0];
  } catch {
    /* Isolated runner fixtures may have no lifecycle store. */
  }
  const budgets = readBudgets(repo);
  withinBudget = Boolean(
    full ||
    document ||
    only ||
    budgetVerdict(
      budgets,
      "fastGateMs",
      durationMs,
      budgets?.limits.fastGateMs ?? 120_000,
      check.workOrder,
    ) !== "breach",
  );
  check.exitCode =
    completeCoverage(tasks, taskRows) &&
    rows.every((row) => row.exitCode === 0) &&
    unchanged &&
    withinBudget
      ? 0
      : 1;
  // Only the runner records its own successful completion; a subprocess cannot
  // supply a green aggregate. Preserve timed-out/failed attempts as executed.
  recordGateChecks(repo, [
    ...rows
      .filter((row) => row.name !== "document-barrier")
      .map((row) => ({
        ...check,
        ...row,
        checkId: `suite:${row.name}`,
        exitCode: unchanged ? row.exitCode : 1,
      })),
    check,
  ]);
  // Preserve only executed successes at matching before/after inputs. These can
  // survive an unrelated document edit; the aggregate still requires exact tree.
  for (const row of taskRows)
    if (row.executed && row.exitCode === 0 && row.inputHash)
      saveSuiteSuccess(repo, row, row.inputHash, {
        ...check,
        ...row,
        evidenceRef: `host-suite:${treeHash}:${row.name}`,
      });
  console.log(
    `${checkId}: ${rows.filter((row) => row.exitCode === 0).length} passed; ${rows.filter((row) => row.exitCode !== 0).length} failed; ${(durationMs / 1000).toFixed(2)} s; ${check.freshSuites} fresh / ${check.reusedSuites} reused tasks${unchanged ? "" : "; tree changed"}${withinBudget ? "" : "; fast gate exceeds 120 s budget"}`,
  );
  return check;
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
