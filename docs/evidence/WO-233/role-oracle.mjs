import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import {
  harnessInstallation,
  harnessInstructionBlock,
} from "../../../scripts/lib/harness.mjs";
const digest = (text) => createHash("sha256").update(text).digest("hex");
const priorFile = "packages/skeleton/fixtures/wo204-role-baseline.json";
const priorBytes = readFileSync(priorFile);
const prior = JSON.parse(priorBytes);
const on = harnessInstallation(),
  off = harnessInstallation({ supports: { "tinkerer-economy": false } });
const roots = (result) =>
  Object.fromEntries(
    result.files
      .filter((file) => file.path.endsWith("/SKILL.md"))
      .map((file) => [file.path, digest(file.contents)]),
  );
const floor = readFileSync("CLAUDE.md", "utf8");
const instruction = floor.replace(
  harnessInstructionBlock(floor).trimEnd(),
  on.files.find((file) => file.path === "CLAUDE.md").contents.trimEnd(),
);
const budgets = JSON.parse(readFileSync("docs/control/budgets.json", "utf8"));
const profiles = Object.fromEntries(
  on.files
    .filter(
      (file) =>
        file.path.startsWith(".agents/skills/") &&
        file.path.endsWith("/SKILL.md"),
    )
    .map((file) => {
      const role = file.path.split("/")[2].slice("dotln-".length);
      const beforeBytes = prior.startupCost.profiles[role].bytes;
      const bytes =
        Buffer.byteLength(instruction) + Buffer.byteLength(file.contents);
      const ceiling = budgets.limits.coldStartBytes[role];
      return [
        role,
        {
          beforeBytes,
          bytes,
          ceiling,
          growthBytes: bytes - beforeBytes,
          headroomBytes: ceiling === null ? null : ceiling - bytes,
        },
      ];
    }),
);
const oracle = {
  workOrder: "WO-233",
  historicalBaseline: "wo204-role-baseline.json",
  historicalSha256: digest(priorBytes),
  upstreamBaseline: prior.upstreamBaseline,
  upstreamSha256: prior.upstreamSha256,
  method:
    "Pin the authorized active integrate-first duty, three independent reviews on every execution and fix, and verifier consumption of all three reports; preserve every historical snapshot.",
  decision: "docs/evidence/WO-233/decisions.md#wo-233-d067",
  roles: roots(on),
  optOutRoles: roots(off),
  startupCost: {
    decision: "WO-233-D067",
    followup: prior.startupCost.followup,
    profiles,
  },
};
writeFileSync(
  "packages/skeleton/fixtures/wo233-role-baseline.json",
  JSON.stringify(oracle, null, 2) + "\n",
);
const acceptance = {
  date: "2026-10-27",
  metric: "coldStartBytes.executor",
  scope: null,
  dispatch: "executor",
  ceiling: profiles.executor.bytes + 4096,
  reason: `WO-233's authorized integrate-first duty and three independent reviews on every execution and fix measure ${profiles.executor.bytes} bytes in each skill root, from ${profiles.executor.beforeBytes}, against the ${profiles.executor.ceiling} operating ceiling. Under product 07's standing route, accept the measured bytes plus one 4096-byte step while preserving the required duties. Reassess when another reviewed rule needs more. Decisions: docs/evidence/WO-233/decisions.md#wo-233-d003 and #wo-233-d067.`,
};
budgets.acceptances = budgets.acceptances.filter(
  (row) => !row.reason.startsWith("WO-233's"),
);
budgets.acceptances.unshift(acceptance);
writeFileSync(
  "docs/control/budgets.json",
  JSON.stringify(budgets, null, 2) + "\n",
);
console.log(
  JSON.stringify(
    { roots: [".agents", ".claude"], profiles, acceptance },
    null,
    2,
  ),
);
