import assert from "node:assert/strict";
import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  rmSync,
} from "node:fs";
import { join, dirname } from "node:path";
import { tmpdir } from "node:os";
import { pathToFileURL } from "node:url";
const root = process.cwd(),
  records = [];
async function moduleFor(relative, mutation) {
  let text = readFileSync(join(root, relative), "utf8");
  if (mutation) {
    const next = mutation(text);
    assert.notEqual(next, text, "mutation must apply");
    text = next;
  }
  text = text
    .replace(
      /from\s+(["'])(\.[^"']+)\1/g,
      (_all, q, p) =>
        `from ${q}${pathToFileURL(join(dirname(join(root, relative)), p))}${q}`,
    )
    .replace(
      /new URL\("\.\/host-footprint.c", import.meta.url\)/g,
      `new URL(${JSON.stringify(pathToFileURL(join(root, "scripts/lib/host-footprint.c")).href)})`,
    );
  return import(
    "data:text/javascript;base64," + Buffer.from(text).toString("base64")
  );
}
const at = (ms) => new Date(ms).toISOString();
async function pair(name, file, mutation, judge) {
  const row = { name, source: file, positiveExit: null, negativeExit: null };
  for (const changed of [false, true]) {
    try {
      await judge(await moduleFor(file, changed ? mutation : null));
      row[changed ? "negativeExit" : "positiveExit"] = 0;
    } catch (e) {
      row[changed ? "negativeExit" : "positiveExit"] = 1;
      row[changed ? "negativeReason" : "positiveReason"] = e.code ?? e.name;
    }
  }
  assert.equal(row.positiveExit, 0, JSON.stringify(row));
  assert.equal(row.negativeExit, 1, JSON.stringify(row));
  records.push(row);
}
await pair(
  "parallel wait union",
  "scripts/lib/gate-timeline.mjs",
  (s) =>
    s.replace(
      "wallMs: intervalUnion(intervals)",
      "wallMs: intervals.reduce((sum, [start, end]) => sum + end - start, 0)",
    ),
  (m) => {
    assert.equal(
      m.gateHostLaneWait([
        { startedAt: at(0), hostLaneWaitMs: 1000 },
        { startedAt: at(500), hostLaneWaitMs: 1000 },
      ]).wallMs,
      1500,
    );
  },
);
await pair(
  "execution cost excludes contention",
  "scripts/lib/planning-conditions.mjs",
  (s) => s.replace("(wallMs - wait.wallMs) / 1000", "wallMs / 1000"),
  (m) => {
    let time = Date.parse("2030-01-01"),
      checks = [];
    const samples = m.measureDocumentGates(
      root,
      { remaining: () => 300000 },
      {
        now: () => time,
        clock: () => time,
        readChecks: () => checks,
        run: (_root, args) => {
          time += 100000;
          checks.push({
            checkId: "npm run test:docs",
            planningSampleId: args.at(-1),
            recordedAt: at(time),
            executed: true,
            exitCode: 0,
            durationMs: 100000,
            evidenceRef: "fixture",
            hostLaneWait: {
              wallMs: 90000,
              byRelation: { "another-checkout": 90000 },
              holders: [],
            },
          });
        },
      },
    );
    assert.equal(m.documentGateMeasurement(samples).executionMedianS, 10);
    assert.ok(samples.every((s) => s.contended));
  },
);
const { acquireHostLanes } = await import(
  pathToFileURL(join(root, "scripts/lib/host-lanes.mjs"))
);
const base = mkdtempSync(join(tmpdir(), "dotln-read-control-"));
try {
  const registry = join(base, "host"),
    repo = join(base, "repo");
  mkdirSync(repo);
  const lease = await acquireHostLanes({
    directory: registry,
    worktree: repo,
    task: "live",
    slots: 1,
    parentLease: null,
  });
  try {
    await pair(
      "inspection preserves stale records",
      "scripts/lib/host-lanes.mjs",
      (s) =>
        s.replace(
          "const live = retainedHolders(rows, table);",
          "const live = retainedHolders(rows, table); for (const row of rows) if (!live.includes(row)) rmSync(row.file);",
        ),
      (m) => {
        const stale = join(registry, "lanes/stale.json");
        writeFileSync(
          stale,
          JSON.stringify({
            pid: 2147483647,
            birth: "gone",
            slots: 1,
            task: "stale",
          }),
        );
        const before = readdirSync(join(registry, "lanes")).sort();
        const view = m.readHolders(registry, { worktree: repo });
        assert.equal(view.holders.length, 1);
        assert.deepEqual(readdirSync(join(registry, "lanes")).sort(), before);
      },
    );
  } finally {
    await lease.release();
  }
} finally {
  rmSync(base, { recursive: true, force: true });
}
writeFileSync(
  join(root, "docs/evidence/WO-229/controls.json"),
  JSON.stringify(
    {
      command:
        "node scripts/harness.mjs bounded -- node docs/evidence/WO-229/controls.mjs",
      method:
        "Identical assertions against current source and isolated in-memory single-mutation modules; repository source is never reverted.",
      records,
    },
    null,
    2,
  ) + "\n",
);
console.log(JSON.stringify(records));
