// Part E, step E5: the vertical row's task times before and after the
// statement wordings moved to a table. Before: the row's tasks in the two
// complete rows Part D recorded (part-d/before.json and part-d/after.json).
// After: the newest passing row this checkout recorded for the vertical
// suite alone at or after a given time.
//
//   node docs/evidence/WO-276/part-e/vertical-times.mjs <since ISO time>
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { readGateChecks } from "../../../../packages/skeleton/src/gate-evidence.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "../../../..");
const [since] = process.argv.slice(2);
if (!since) throw new Error("usage: vertical-times.mjs <since ISO time>");

const flatten = (entries) =>
  entries.flatMap((entry) =>
    Array.isArray(entry.cases) && entry.cases.some((child) => child.startedAt)
      ? flatten(entry.cases)
      : [entry],
  );
const vertical = (tasks) =>
  tasks
    .filter((task) => task.name.startsWith("vertical:"))
    .map((task) => ({
      name: task.name,
      startedAt: task.startedAt,
      finishedAt: task.finishedAt,
      durationMs: task.durationMs,
      exitCode: task.exitCode,
      concurrentAtStart: task.concurrentAtStart ?? [],
    }));
const summed = (tasks) =>
  tasks.reduce((total, task) => total + task.durationMs, 0);
const span = (tasks) =>
  Math.max(...tasks.map((task) => Date.parse(task.finishedAt))) -
  Math.min(...tasks.map((task) => Date.parse(task.startedAt)));
const reading = (what, tasks) => ({
  what,
  tasks,
  taskCount: tasks.length,
  summedTaskMs: summed(tasks),
  spanMs: span(tasks),
});

const complete = (name) =>
  vertical(
    JSON.parse(readFileSync(join(here, "../part-d", name), "utf8")).timeline,
  );
const row = readGateChecks(root)
  .filter(
    (entry) =>
      entry.checkId === "suite:vertical" &&
      entry.exitCode === 0 &&
      Date.parse(entry.startedAt ?? entry.recordedAt) >= Date.parse(since) &&
      flatten(entry.taskTimeline ?? entry.cases ?? []).some((task) =>
        task.name?.startsWith("vertical:"),
      ),
  )
  .at(-1);
if (!row)
  throw new Error(`no passing row with the vertical row since ${since}`);
const after = vertical(
  flatten(row.taskTimeline ?? row.cases ?? []).filter(
    (task) => task.startedAt && task.finishedAt,
  ),
);
const record = {
  what: "The vertical row's task times before and after Part E. The two rows before are complete runs, where the row's tasks ran beside other suites; the row after is the vertical suite alone, so the pair shows what the tasks are and what the end-to-end file costs, and is no comparison of the row's span under a complete run's load. The order's closing complete run supplies that.",
  command: `node docs/evidence/WO-276/part-e/vertical-times.mjs ${since}`,
  before: [
    reading(
      "part-d/before.json: the control, a complete review run started 2026-11-11T03:20Z",
      complete("before.json"),
    ),
    reading(
      "part-d/after.json: Part D's after row, a complete review run started 2026-11-11T06:17Z",
      complete("after.json"),
    ),
  ],
  after: {
    ...reading(
      `the vertical suite alone (${row.gateSelection ?? "plain"} selection), recorded ${row.recordedAt}`,
      after,
    ),
    rowWallMs: row.durationMs ?? null,
    codeIdentity: row.codeIdentity ?? null,
  },
};
writeFileSync(
  join(here, "vertical-times.json"),
  `${JSON.stringify(record, null, 2)}\n`,
);
for (const entry of [...record.before, record.after])
  console.log(
    `${entry.what}\n  ${entry.tasks.map((task) => `${task.name} ${(task.durationMs / 1000).toFixed(1)} s`).join("; ")}\n  summed ${(entry.summedTaskMs / 1000).toFixed(1)} s, span ${(entry.spanMs / 1000).toFixed(1)} s`,
  );
