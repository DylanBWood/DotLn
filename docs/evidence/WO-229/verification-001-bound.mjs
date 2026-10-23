// VER-001 F2: the executor's sibling-gate fixture with one variation. The
// complete gate's staggered peers keep it admitting work after its longest
// task ends, so "while a complete gate runs" holds through the document gate.
// Run: node scripts/harness.mjs bounded -- node docs/evidence/WO-229/verification-001-bound.mjs
// Exit 1 while the measured document gate's total lane wait exceeds the
// complete gate's longest single task in that variation.
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const source = (path) => new URL(`../../../${path}`, import.meta.url).href;
const { runGate, suites, STRUCTURAL_TASKS, structuralHostSlots } = await import(
  source("scripts/test-runner.mjs")
);
const { acquireHostLaneCapacity } = await import(
  source("scripts/lib/host-lanes.mjs")
);
const { delay, processAlive, readHostSnapshot } = await import(
  source("scripts/lib/host-resources.mjs")
);
const { runGit } = await import(source("scripts/lib/git.mjs"));

const base = realpathSync(mkdtempSync(join(tmpdir(), "wo229-ver001-f2-")));
const results = [];

async function arm(shape, sizing) {
  const folder = join(base, `${shape}-${sizing}`),
    registry = join(folder, "host"),
    completeRepo = join(folder, "complete"),
    documentRepo = join(folder, "document");
  for (const repo of [completeRepo, documentRepo]) {
    mkdirSync(repo, { recursive: true });
    runGit(repo, ["init", "-q", "-b", "main"]);
    writeFileSync(join(repo, "README.md"), "Fixture\n");
    runGit(repo, ["add", "."]);
    runGit(repo, [
      "-c",
      "user.name=Fixture",
      "-c",
      "user.email=fixture@example.invalid",
      "-c",
      "commit.gpgsign=false",
      "-c",
      "maintenance.auto=false",
      "commit",
      "-qm",
      "Fixture",
    ]);
  }
  await acquireHostLaneCapacity({ directory: registry, capacity: 8 });
  const marker = join(folder, "long-started");
  const command = (ms, code = "") => [
    process.execPath,
    "-e",
    `${code};setTimeout(()=>{},${ms})`,
  ];
  // "executor": scripts/test-gate-deadlines.mjs's six 250 ms peers, which end
  // long before the 3 s task. "staggered": eight peers of 900 to 1859 ms, two
  // at a time, so the complete gate keeps a holder until about 6 s.
  const peers = shape === "executor" ? 6 : 8;
  const table = [
    {
      name: "build",
      build: true,
      product: true,
      command: command(20),
      outputs: [],
    },
    {
      name: "long",
      product: true,
      loadSlots: 2,
      command: command(
        3000,
        `require('node:fs').writeFileSync(${JSON.stringify(marker)},'ready')`,
      ),
    },
    ...Array.from({ length: peers }, (_, index) => ({
      name: `peer-${index}`,
      product: true,
      loadSlots: 2,
      group: "peers",
      groupLimit: 2,
      command: command(shape === "executor" ? 250 : 900 + 137 * index),
    })),
  ];
  const complete = runGate(["--review", "--again"], completeRepo, {
    table,
    hostDirectory: registry,
  });
  complete.catch(() => {});
  try {
    for (let i = 0; i < 500 && !existsSync(marker); i++) await delay(10);
    const documentTable = [
      {
        name: "kit-verify",
        build: true,
        document: true,
        command: command(250),
        hostSlots:
          sizing === "measured" ? structuralHostSlots["kit-verify"] : 8,
      },
      ...STRUCTURAL_TASKS.map((name) => ({
        ...suites.find((row) => row.name === name),
        args: [],
        command: command(250),
        needsBuild: false,
        document: true,
        hostSlots:
          sizing === "measured"
            ? suites.find((row) => row.name === name).hostSlots
            : 8,
      })),
    ];
    const doc = await runGate(["--document", "--again"], documentRepo, {
      table: documentTable,
      hostDirectory: registry,
    });
    const full = await complete;
    const completeEnd = Math.max(
      ...full.taskTimeline.map((row) => Date.parse(row.finishedAt)),
    );
    const longest = Math.max(...full.taskTimeline.map((row) => row.durationMs));
    const admissions = doc.taskTimeline.map((row) => ({
      task: row.name,
      hostLaneSlots: row.hostLaneSlots,
      waitMs: row.hostLaneWaitMs,
      // Positive: admitted while the complete gate still held work.
      admittedBeforeCompleteEndMs:
        completeEnd - (Date.parse(row.startedAt) + (row.hostLaneWaitMs ?? 0)),
    }));
    return {
      shape,
      sizing,
      documentExit: doc.exitCode,
      completeExit: full.exitCode,
      documentLaneWaitMs: doc.hostLaneWait.wallMs,
      longestCompleteTaskMs: longest,
      completeWallMs: full.durationMs,
      boundHolds: doc.hostLaneWait.wallMs < longest,
      completeRanThroughDocument: admissions.every(
        (row) => row.admittedBeforeCompleteEndMs > 0,
      ),
      admissions,
    };
  } finally {
    await complete.catch(() => {});
    const file = join(registry, "guard.json");
    if (existsSync(file)) {
      const guard = JSON.parse(readFileSync(file, "utf8"));
      if (processAlive(guard, readHostSnapshot({ footprint: false }).processes))
        process.kill(guard.pid, "SIGTERM");
      for (let i = 0; i < 100 && existsSync(file); i++) await delay(20);
    }
  }
}

try {
  for (const shape of ["executor", "staggered"])
    for (const sizing of ["full-capacity", "measured"])
      results.push(await arm(shape, sizing));
} finally {
  rmSync(base, { recursive: true, force: true });
}
console.log(JSON.stringify(results, null, 2));
const staggered = results.find(
  (row) => row.shape === "staggered" && row.sizing === "measured",
);
process.exitCode = staggered.documentExit === 0 && staggered.boundHolds ? 0 : 1;
