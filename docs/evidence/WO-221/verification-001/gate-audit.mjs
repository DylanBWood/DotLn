// Read the complete review row at this subject; execute no gate.
import { execFileSync } from "node:child_process";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
const root = process.cwd();
const { gateCodeIdentity } = await import(
  pathToFileURL(resolve(root, "scripts/lib/gate-evidence.mjs"))
);
const { coveringGateCheck } = await import(
  pathToFileURL(resolve(root, "scripts/lib/gate-reuse.mjs"))
);
const required = execFileSync(
  process.execPath,
  ["scripts/test-runner.mjs", "--review", "--list"],
  { encoding: "utf8" },
)
  .trim()
  .split("\n")
  .map((line) => line.split(" — ")[0]);
const found = await coveringGateCheck(root, "npm test", required);
const row = found.row;
console.log(
  JSON.stringify({
    probe: "executor-row",
    codeIdentity: gateCodeIdentity(root),
    location: found.location,
    displaced: found.displaced,
    row: row && {
      evidenceRef: row.evidenceRef,
      recordedAt: row.recordedAt,
      exitCode: row.exitCode,
      gateSelection: row.gateSelection,
      durationMs: row.durationMs,
      suiteCount: row.requiredSuites?.length,
      freshTasks: row.taskTimeline?.filter(
        (task) => task.executed && !task.reused,
      ).length,
      failedTasks: row.taskTimeline
        ?.filter((task) => task.exitCode !== 0)
        .map((task) => task.name),
    },
  }),
);
if (!row || row.exitCode !== 0) process.exitCode = 1;
