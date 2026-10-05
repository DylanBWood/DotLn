#!/usr/bin/env node
// WO-186 VER-001 R4 and R5: recompute the document gate's medians and the
// release and worktree task times from recorded gate rows. Read-only.
// Run from the repository root:
//   node docs/evidence/WO-186/repair-recompute.mjs --main <main checkout> --extras docs/evidence/WO-186/repair-observations.json
// The main checkout supplies the document gate's before rows; this worktree's
// index and measurements.json supply everything else. `--extras` merges
// sections that are observations rather than recomputations.
import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const { readGateChecks } = await import(
  pathToFileURL(join(root, "packages/skeleton/src/gate-evidence.mjs")).href
);
const option = (name) => {
  const index = process.argv.indexOf(name);
  return index < 0 ? undefined : process.argv[index + 1];
};
const main = option("--main");
if (!main)
  throw new Error("usage: repair-recompute.mjs --main <main checkout>");
const median = (values) => {
  const sorted = [...values].sort((a, b) => a - b);
  const count = sorted.length;
  return count % 2
    ? sorted[(count - 1) / 2]
    : (sorted[count / 2 - 1] + sorted[count / 2]) / 2;
};
const seconds = (ms) => Number((ms / 1000).toFixed(3));
const task = (row, name) => row.taskTimeline.find((item) => item.name === name);

// R4: the document gate before (main, since 2026-10-01) and after (here).
const documents = (path) =>
  readGateChecks(path).filter((row) => row.checkId === "npm run test:docs");
const mainRows = documents(resolve(main)).filter(
  (row) => row.recordedAt >= "2026-10-01",
);
const mainPassing = mainRows.filter(
  (row) => row.executed === true && row.exitCode === 0,
);
const pathEnds = {};
for (const row of mainPassing) {
  const last = row.criticalPath?.tasks?.at(-1) ?? "unknown";
  pathEnds[last] = (pathEnds[last] ?? 0) + 1;
}
const localRows = documents(root).map((row) => ({
  recordedAt: row.recordedAt,
  codeIdentity: row.codeIdentity,
  exitCode: row.exitCode,
  seconds: seconds(row.durationMs),
  tasks: row.taskTimeline.length,
  criticalPath: row.criticalPath?.tasks ?? null,
  resumeSeconds: task(row, "resume")
    ? seconds(task(row, "resume").durationMs)
    : null,
}));
const measurements = JSON.parse(
  readFileSync(join(root, "docs/evidence/WO-186/measurements.json"), "utf8"),
);
const finalIdentity = measurements.after.runs
  .filter((run) => run.name === "review-gate" && run.exitCode === 0)
  .at(-1).gate.codeIdentity;
const finalRows = localRows.filter(
  (row) => row.exitCode === 0 && row.codeIdentity === finalIdentity,
);
const before = seconds(median(mainPassing.map((row) => row.durationMs)));
const after = median(finalRows.map((row) => row.seconds));
const documentGate = {
  before: {
    source:
      "main checkout gate index, npm run test:docs, recordedAt >= 2026-10-01",
    rows: mainRows.length,
    failedRowsExcluded: mainRows.length - mainPassing.length,
    passingRows: mainPassing.length,
    taskCounts: [...new Set(mainPassing.map((row) => row.taskTimeline.length))],
    first: mainPassing[0]?.recordedAt,
    last: mainPassing.at(-1)?.recordedAt,
    medianSeconds: before,
    criticalPathEnds: pathEnds,
  },
  after: {
    source: "this worktree's gate index, npm run test:docs",
    finalIdentity,
    rows: localRows,
    finalIdentityPassingRows: finalRows.length,
    medianSeconds: after,
  },
  changeSeconds: Number((after - before).toFixed(3)),
  perOrderAtSevenGatesSeconds: Number(((after - before) * 7).toFixed(1)),
};

// R5: task time in the five before and five after plain gates of
// measurements.json, matched to their rows by recordedAt.
const product = readGateChecks(root).filter(
  (row) => row.checkId === "npm test" && Array.isArray(row.taskTimeline),
);
const plain = (phase) =>
  measurements[phase].runs
    .filter((run) => run.name === "plain-gate" && run.exitCode === 0)
    .map((run) =>
      product.find((row) => row.recordedAt === run.gate.recordedAt),
    );
const gates = { before: plain("before"), after: plain("after") };
const releaseSum = (row) =>
  row.taskTimeline
    .filter((item) => item.name.startsWith("release:"))
    .reduce((sum, item) => sum + item.durationMs, 0);
const phaseMedian = (phase, name) =>
  seconds(median(gates[phase].map((row) => task(row, name).durationMs)));
const compared = (name) => ({
  name,
  before: phaseMedian("before", name),
  after: phaseMedian("after", name),
  change: Number(
    (phaseMedian("after", name) - phaseMedian("before", name)).toFixed(3),
  ),
});
const releaseNames = gates.before[0].taskTimeline
  .map((item) => item.name)
  .filter((name) => name.startsWith("release:"));
const releaseChanges = releaseNames
  .map(compared)
  .sort((a, b) => b.change - a.change);
const releaseTasks = {
  rows: Object.fromEntries(
    Object.entries(gates).map(([phase, rows]) => [
      phase,
      rows.map((row) => row.recordedAt),
    ]),
  ),
  releaseTaskCount: releaseNames.length,
  releaseSumSeconds: Object.fromEntries(
    Object.entries(gates).map(([phase, rows]) => [
      phase,
      {
        median: seconds(median(rows.map(releaseSum))),
        min: seconds(Math.min(...rows.map(releaseSum))),
        max: seconds(Math.max(...rows.map(releaseSum))),
      },
    ]),
  ),
  grew: releaseChanges.filter((row) => row.change > 0).length,
  shrank: releaseChanges.filter((row) => row.change < 0).length,
  largestGrowth: releaseChanges.slice(0, 4),
  controls: [
    "worktree",
    "skeleton",
    "kernel",
    "compiler",
    "console",
    "browser-evidence",
    "build",
    "target-publish",
    "portfolio",
    "derived-orders",
    "license-fixtures",
  ].map(compared),
};

// Every recorded product gate with all 51 release tasks, in order. The guard
// column reads whether a release task carries a product read log.
const gateRows = product
  .filter(
    (row) =>
      row.taskTimeline.filter((item) => item.name.startsWith("release:"))
        .length === releaseNames.length && task(row, "skeleton")?.executed,
  )
  .map((row) => ({
    recordedAt: row.recordedAt,
    codeIdentity: row.codeIdentity.slice(0, 12),
    exitCode: row.exitCode,
    selection: row.gateSelection ?? null,
    skeletonSeconds: seconds(task(row, "skeleton").durationMs),
    releaseSumSeconds: seconds(releaseSum(row)),
    runtimeRefreshSeconds: seconds(
      task(row, "release:case:runtime_refresh").durationMs,
    ),
    worktreeSeconds: seconds(task(row, "worktree").durationMs),
    guardOnReleaseTasks: row.taskTimeline.some(
      (item) => item.name.startsWith("release:") && item.productReadLog,
    ),
  }));

const extras = option("--extras")
  ? JSON.parse(readFileSync(resolve(option("--extras")), "utf8"))
  : {};
console.log(
  JSON.stringify(
    { schemaVersion: 1, documentGate, releaseTasks, gateRows, ...extras },
    null,
    2,
  ),
);
