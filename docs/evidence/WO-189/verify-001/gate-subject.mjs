import { resolve } from "node:path";
import { spawnSync } from "node:child_process";
import {
  gateCodeIdentity,
  gateTreeHash,
} from "../../../../scripts/lib/gate-evidence.mjs";
import { coveringGateCheck } from "../../../../scripts/lib/gate-reuse.mjs";
const root = resolve(import.meta.dirname, "../../../..");
const selected = spawnSync(
  process.execPath,
  ["scripts/test-runner.mjs", "--review", "--list"],
  { cwd: root, encoding: "utf8" },
);
if (selected.status !== 0) throw new Error(selected.stderr);
const names = selected.stdout
  .split("\n")
  .map((line) => /^(\S+) — /u.exec(line)?.[1])
  .filter(Boolean);
const identity = gateCodeIdentity(root);
const coverage = await coveringGateCheck(root, "npm test", names, identity);
const row = coverage.row;
console.log(
  JSON.stringify(
    {
      codeIdentity: identity,
      treeHash: gateTreeHash(root),
      selection: names,
      location: coverage.location,
      missing: coverage.missing,
      covered: Boolean(row),
      row:
        row &&
        Object.fromEntries(
          [
            "checkId",
            "recordedAt",
            "durationMs",
            "executed",
            "exitCode",
            "evidenceRef",
            "requiredSuites",
            "codeIdentity",
            "identityUnchanged",
            "freshSuites",
            "gateSelection",
          ].map((key) => [
            key,
            key === "taskTimeline"
              ? row[key]?.map(
                  ({ name, exitCode, durationMs, executed, reused }) => ({
                    name,
                    exitCode,
                    durationMs,
                    executed,
                    reused,
                  }),
                )
              : row[key],
          ]),
        ),
    },
    null,
    2,
  ),
);
if (!row) process.exitCode = 1;
