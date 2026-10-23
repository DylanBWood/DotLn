// VER-001 independent checks that pass on the subject: the read-only lane
// listing under a lock another process holds (criterion 4), the document
// condition's sample binding and medians (criterion 3), and the sizing
// recomputed from the measurement record (criterion 5's record).
// Run: node scripts/harness.mjs bounded -- node docs/evidence/WO-229/verification-001-checks.mjs
import assert from "node:assert/strict";
import {
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  realpathSync,
  rmSync,
  symlinkSync,
} from "node:fs";
import { spawn } from "node:child_process";
import { createHash } from "node:crypto";
import { tmpdir } from "node:os";
import { join } from "node:path";

const source = (path) => new URL(`../../../${path}`, import.meta.url).href;
const { acquireHostLaneCapacity, acquireHostLanes, readHolders } = await import(
  source("scripts/lib/host-lanes.mjs")
);
const { readHostSnapshot, atomicJson } = await import(
  source("scripts/lib/host-resources.mjs")
);
const { measureDocumentGates, documentGateMeasurement } = await import(
  source("scripts/lib/planning-conditions.mjs")
);
const { structuralHostSlots } = await import(source("scripts/test-runner.mjs"));
const result = {};

// Criterion 4: a deleted holder checkout, another checkout, a symlinked own
// parent with a nested own holder and a legacy record without worktree.
const base = realpathSync(mkdtempSync(join(tmpdir(), "wo229-ver001-checks-")));
try {
  const registry = join(base, "host"),
    mine = join(base, "mine"),
    gone = join(base, "gone"),
    other = join(base, "other"),
    alias = join(base, "alias");
  for (const folder of [mine, gone, other]) mkdirSync(folder);
  symlinkSync(mine, alias);
  await acquireHostLaneCapacity({ directory: registry, capacity: 8 });
  readHostSnapshot({ footprint: false, directory: registry });
  const leases = [
    await acquireHostLanes({
      directory: registry,
      slots: 2,
      worktree: gone,
      task: "gone-task",
      parentLease: null,
    }),
    await acquireHostLanes({
      directory: registry,
      slots: 3,
      worktree: other,
      task: "other-task",
      parentLease: null,
    }),
  ];
  const parent = await acquireHostLanes({
    directory: registry,
    slots: 2,
    worktree: alias,
    task: "own-parent",
    parentLease: null,
  });
  const child = await acquireHostLanes({
    directory: registry,
    slots: 1,
    worktree: mine,
    task: "own-nested",
    parentLease: parent,
  });
  const self = readHostSnapshot({
    footprint: false,
    directory: registry,
  }).processes.find((row) => row.pid === process.pid);
  atomicJson(join(registry, "lanes", "legacy.json"), {
    pid: self.pid,
    birth: self.birth,
    slots: 1,
    task: "legacy",
    acquiredAt: new Date().toISOString(),
  });
  rmSync(gone, { recursive: true });
  const snapshot = (folder) =>
    JSON.stringify(
      Object.fromEntries(
        readdirSync(folder).map((name) => {
          const path = join(folder, name),
            info = lstatSync(path);
          return [
            name,
            info.isDirectory()
              ? snapshot(path)
              : `${info.mtimeMs}:${createHash("sha256").update(readFileSync(path)).digest("hex")}`,
          ];
        }),
      ),
    );
  const locker = spawn(
    process.execPath,
    [
      "--input-type=module",
      "-e",
      `const {withHostLock}=await import(${JSON.stringify(source("scripts/lib/host-resources.mjs"))}); await withHostLock(process.argv[1],"lanes",async()=>{console.log("locked"); await new Promise(r=>setTimeout(r,3000));});`,
      registry,
    ],
    { stdio: ["ignore", "pipe", "inherit"] },
  );
  await new Promise((resolve) =>
    locker.stdout.on(
      "data",
      (data) => String(data).includes("locked") && resolve(),
    ),
  );
  const before = snapshot(registry);
  const started = performance.now();
  const view = readHolders(registry, { worktree: mine });
  const readMs = performance.now() - started;
  const after = snapshot(registry);
  await new Promise((resolve) => locker.on("exit", resolve));
  const relations = Object.fromEntries(
    view.holders.map((row) => [row.task, row.relation]),
  );
  assert.ok(readMs < 1000, `read waited ${readMs} ms behind the lock`);
  assert.equal(before, after);
  assert.deepEqual(relations, {
    "gone-task": "unknown",
    "other-task": "another-checkout",
    "own-parent": "this-checkout",
    "own-nested": "this-checkout",
    legacy: "unknown",
  });
  assert.ok(
    view.holders.every((row) => row.ownerAlive && Number.isFinite(row.ageMs)),
  );
  assert.equal(
    view.holders.find((row) => row.task === "own-nested").nested,
    true,
  );
  assert.equal(view.byRelation["this-checkout"].nestedSlots, 1);
  assert.ok(
    ![base, mine, other, gone, alias, registry].some((path) =>
      JSON.stringify(view).includes(path),
    ),
  );
  result.readOnlyListing = {
    readMsWhileLocked: Math.round(readMs),
    bytesUnchanged: true,
    relations,
  };
  await child.release();
  await parent.release();
  for (const lease of leases) await lease.release();
} finally {
  rmSync(base, { recursive: true, force: true });
}

// Criterion 3: injected children record rows; the condition must bind each
// sample to its own row and judge execution cost.
function children(plan) {
  let time = 1_000_000,
    index = 0;
  const rows = [
    {
      checkId: "npm run test:docs",
      recordedAt: new Date(time - 5000).toISOString(),
      exitCode: 0,
      executed: true,
      durationMs: 1,
      evidenceRef: "stale",
      hostLaneWait: { wallMs: 0, byRelation: {} },
    },
  ];
  return {
    now: () => time,
    clock: () => time,
    readChecks: () => rows,
    run: (_root, args) => {
      const step = plan[index++];
      time += step.wall;
      if (step.row !== false)
        rows.push({
          checkId: "npm run test:docs",
          planningSampleId: step.foreign ? "another-sample" : args.at(-1),
          recordedAt: new Date(time - 1).toISOString(),
          exitCode: step.exit ?? 0,
          executed: true,
          durationMs: step.wall - 5,
          evidenceRef: "host-gate:fixture:npm run test:docs",
          taskTimeline: [{ name: "docs-check", exitCode: 0, durationMs: 4000 }],
          hostLaneWait: {
            wallMs: step.wait,
            byRelation: {
              "this-checkout": 0,
              "another-checkout": step.other ?? 0,
              unknown: step.wait - (step.other ?? 0),
            },
          },
        });
      if (step.throws) throw new Error("child timed out");
    },
  };
}
const context = { remaining: () => 300_000 };
const measure = (plan) =>
  measureDocumentGates("/fixture", context, children(plan));
const contended = measure([
  { wall: 12000, wait: 0 },
  { wall: 200000, wait: 190000, other: 190000 },
  { wall: 14000, wait: 1000 },
]);
const judged = documentGateMeasurement(contended);
assert.equal(judged.wallMedianS, 14);
assert.equal(judged.executionMedianS, 12);
assert.equal(judged.value, 12);
assert.deepEqual(
  contended.map((row) => row.contended),
  [false, true, false],
);
assert.equal(
  measure([{ wall: 12000, wait: 0, foreign: true }])[0].unavailable,
  "child did not record a document row",
);
assert.equal(
  measure([{ wall: 12000, wait: 0, row: false }])[0].unavailable,
  "child did not record a document row",
);
assert.equal(
  measure([{ wall: 12000, wait: 20000 }])[0].unavailable,
  "document row has no valid lane-wait measurement",
);
const timedOut = measure([
  { wall: 300000, wait: 250000, other: 250000, throws: true, exit: 1 },
]);
assert.equal(timedOut[0].contended, true);
assert.equal(documentGateMeasurement(timedOut).value, null);
result.documentCondition = {
  wallMedianS: judged.wallMedianS,
  executionMedianS: judged.executionMedianS,
  contended: contended.map((row) => row.contended),
  timedOutContended: timedOut[0].contended,
};

// Criterion 5's record: recompute each request with an independent formula.
const evidence = (name) =>
  JSON.parse(readFileSync(new URL(name, import.meta.url), "utf8"));
const need = evidence("structural-need.json");
const attempts = [
  "structural-attempt001.json",
  "structural-attempt002.json",
].map(evidence);
const cells = {};
for (const row of need.runs)
  cells[`${row.context}/${row.task}`] =
    (cells[`${row.context}/${row.task}`] ?? 0) + 1;
assert.equal(Object.keys(cells).length, 14);
assert.ok(Object.values(cells).every((count) => count === 3));
assert.ok(
  need.runs.every(
    (row) =>
      row.exitCode === 0 &&
      [row.cpuMs, row.rssPeakBytes, row.wallMs].every(Number.isFinite),
  ),
);
const requests = {};
for (const task of [...new Set(need.runs.map((row) => row.task))]) {
  const samples = [need, ...attempts]
    .flatMap((record) => record.runs)
    .filter((row) => row.task === task && row.exitCode === 0);
  const integer = Math.max(
    1,
    ...samples.map((row) =>
      Math.ceil(
        Math.max(
          (row.cpuMs / row.wallMs) * 1.25,
          row.rssPeakBytes / need.taskBudgetBytes,
        ),
      ),
    ),
  );
  requests[task] = {
    need: integer,
    request: integer < need.capacity / 2 ? integer : need.capacity,
    code: structuralHostSlots[task] ?? need.capacity,
  };
  assert.equal(requests[task].request, requests[task].code, task);
}
result.sizing = requests;
console.log(JSON.stringify(result, null, 2));
