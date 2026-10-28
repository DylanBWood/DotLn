// Execute the documented standalone spelling; retain aggregate evidence only.
import { spawnSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
const root = resolve(import.meta.dirname, "../../..");
const rows = [];
for (const [stage, extra] of [
  ["before", []],
  ["apply", ["--apply"]],
  ["after", []],
]) {
  const command = ["scripts/harness.mjs", "prune", ...extra];
  const result = spawnSync(process.execPath, command, {
    cwd: root,
    encoding: "utf8",
    maxBuffer: 16 * 1024 * 1024,
  });
  let report;
  if (result.status === 0) report = JSON.parse(result.stdout);
  const row = {
    stage,
    command: "node " + command.join(" "),
    exitCode: result.status,
    observedAt: new Date().toISOString(),
    ...(report
      ? {
          candidates: report.candidates.length,
          bytes: report.bytes,
          removed: report.removed.length,
          retained: report.retained.length,
          census: report.census,
          blockers: report.blockers ?? [],
        }
      : { error: result.stderr || result.stdout }),
  };
  rows.push(row);
  console.log(JSON.stringify(row));
  if (result.status !== 0) break;
}
writeFileSync(
  resolve(import.meta.dirname, "backfill.json"),
  JSON.stringify(
    {
      host: "Codex danger-full-access, approval never; no settings changed",
      rows,
    },
    null,
    2,
  ) + "\n",
);
process.exitCode = rows.some((row) => row.exitCode !== 0) ? 1 : 0;
