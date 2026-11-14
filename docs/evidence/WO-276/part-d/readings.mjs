// Part D's two comparison rows. Reads the newest fresh complete review row
// this checkout recorded at or after a given time and writes its readings:
// the row's wall, flags and identity, the `scheduled first:` line of the
// run's console log, the task timeline, and what step D6 compares.
//
//   node docs/evidence/WO-276/part-d/readings.mjs <since ISO time> <console log> <out.json> [note]
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { readGateChecks } from "../../../../packages/skeleton/src/gate-evidence.mjs";
import { lightSuiteNames, suites } from "../../../../scripts/test-runner.mjs";

const [since, logPath, outPath, note = ""] = process.argv.slice(2);
if (!since || !logPath || !outPath)
  throw new Error(
    "usage: readings.mjs <since ISO time> <console log> <out.json> [note]",
  );
const root = resolve(import.meta.dirname, "../../../..");
const row = readGateChecks(root)
  .filter(
    (entry) =>
      entry.checkId === "npm test" &&
      entry.gateSelection === "review" &&
      Date.parse(entry.startedAt ?? entry.recordedAt) >= Date.parse(since),
  )
  .at(-1);
if (!row) throw new Error(`no review row started at or after ${since}`);

// The tasks that ran, whatever depth the row keeps them at.
const flatten = (entries) =>
  entries.flatMap((entry) =>
    Array.isArray(entry.cases) && entry.cases.some((child) => child.startedAt)
      ? flatten(entry.cases)
      : [entry],
  );
const light = lightSuiteNames();
const suiteOf = (name) =>
  suites.find(
    (suite) => name === suite.name || name.startsWith(`${suite.name}:`),
  );
const tasks = flatten(row.taskTimeline ?? row.cases ?? [])
  .filter((task) => task.startedAt && task.finishedAt)
  .map((task) => ({
    name: task.name,
    startedAt: task.startedAt,
    finishedAt: task.finishedAt,
    durationMs: task.durationMs,
    exitCode: task.exitCode,
    reused: Boolean(task.reused),
    exclusive: Boolean(suiteOf(task.name)?.exclusive),
    light: light.has(task.name),
    loadClass: task.loadClass,
    reservedSlots: task.reservedSlots,
    slotCapacity: task.slotCapacity,
    concurrentAtStart: task.concurrentAtStart ?? [],
  }))
  .sort((a, b) => Date.parse(a.startedAt) - Date.parse(b.startedAt));

const at = (task, edge) => Date.parse(task[edge]);
const overlaps = (a, b) =>
  at(a, "startedAt") < at(b, "finishedAt") &&
  at(b, "startedAt") < at(a, "finishedAt");
const duration = (ms) => {
  const minutes = Math.round(ms / 60000);
  return `${Math.floor(minutes / 60)} h ${minutes % 60} min`;
};
// Time with at most three tasks running, from the first start to the last end.
const edges = tasks
  .flatMap((task) => [
    [at(task, "startedAt"), 1],
    [at(task, "finishedAt"), -1],
  ])
  .sort((a, b) => a[0] - b[0] || a[1] - b[1]);
let running = 0,
  atMostThreeMs = 0;
edges.forEach(([time, change], index) => {
  if (index > 0 && running <= 3) atMostThreeMs += time - edges[index - 1][0];
  running += change;
});
const exclusive = tasks.filter((task) => task.exclusive);
const firstExclusive = exclusive[0];
const lastExclusive = exclusive.at(-1);
const hooks = tasks.filter(
  (task) =>
    task.name === "harness-fixtures" ||
    task.name.startsWith("harness-fixtures:"),
);
const span = (members) =>
  members.length
    ? Math.max(...members.map((task) => at(task, "finishedAt"))) -
      Math.min(...members.map((task) => at(task, "startedAt")))
    : null;
const scheduledFirst =
  readFileSync(logPath, "utf8")
    .split("\n")
    .find((line) => line.startsWith("scheduled first:")) ?? null;

const readings = {
  what: "A fresh complete review run's gate row, for the comparison of WO-276 Part D (steps D1 and D6).",
  ...(note ? { note } : {}),
  command: "npm test -- --review --fresh --keep-going",
  row: {
    startedAt: row.startedAt,
    recordedAt: row.recordedAt,
    wallMs: row.durationMs,
    wall: duration(row.durationMs),
    exitCode: row.exitCode,
    executed: row.executed,
    gateSelection: row.gateSelection,
    executionMode: row.executionMode,
    freshReason: row.freshReason ?? null,
    treeHash: row.treeHash,
    codeIdentity: row.codeIdentity,
    requiredSuites: row.requiredSuites?.length ?? null,
    freshSuites: row.freshSuites?.length ?? null,
    reusedSuites: row.reusedSuites?.length ?? null,
    unrunSuites: row.unrunSuites?.length ?? null,
    stopped: Boolean(row.stopped),
    failureKind: row.failureKind ?? null,
    memoryFailure: Boolean(row.memory?.failure),
    tasks: tasks.length,
    tasksReused: tasks.filter((task) => task.reused).length,
    tasksFailed: tasks
      .filter((task) => task.exitCode !== 0)
      .map((task) => task.name),
    slotCapacity: tasks[0]?.slotCapacity ?? null,
  },
  scheduledFirst,
  readings: {
    atMostThreeTasksMs: atMostThreeMs,
    atMostThreeTasks: duration(atMostThreeMs),
    hookSuiteSpanMs: span(hooks),
    hookSuiteSpan: hooks.length ? duration(span(hooks)) : null,
    hookSuiteTasks: hooks.map((task) => task.name),
    exclusiveOrder: exclusive.map((task) => task.name),
    // Tasks that are neither exclusive nor light and started between the
    // first exclusive task's start and the last one's.
    betweenExclusiveStarts: firstExclusive
      ? tasks
          .filter(
            (task) =>
              !task.exclusive &&
              !task.light &&
              at(task, "startedAt") > at(firstExclusive, "startedAt") &&
              at(task, "startedAt") < at(lastExclusive, "startedAt"),
          )
          .map((task) => task.name)
      : [],
    // For each row that declares an overlap: the light tasks that ran
    // beside any of its tasks.
    lightPeersBeside: Object.fromEntries(
      suites
        .filter((suite) => suite.exclusive && suite.overlap)
        .map((suite) => {
          const mine = tasks.filter((task) => suiteOf(task.name) === suite);
          return [
            suite.name,
            [
              ...new Set(
                tasks
                  .filter(
                    (task) =>
                      task.light && mine.some((own) => overlaps(own, task)),
                  )
                  .map((task) => task.name),
              ),
            ],
          ];
        }),
    ),
    launchpadTasks: tasks
      .filter((task) => task.name.startsWith("launchpad:"))
      .map((task) => [task.name, task.durationMs]),
  },
  timeline: tasks,
};
writeFileSync(outPath, `${JSON.stringify(readings, null, 2)}\n`);
console.log(
  JSON.stringify(
    { out: outPath, row: readings.row, readings: readings.readings },
    null,
    1,
  ),
);
