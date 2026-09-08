import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readdirSync, realpathSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { roles } from "./harness-context.mjs";
import { writerScenarios } from "./harness-evidence.mjs";

const root = realpathSync(fileURLToPath(new URL("../", import.meta.url)));
assert.equal(realpathSync(process.cwd()), root);
assert.equal(
  process.env.DOTLN_LIVE_HARNESS,
  "1",
  "explicit bounded live suite required",
);
const git = spawnSync("git", ["rev-parse", "--show-toplevel"], {
  cwd: root,
  encoding: "utf8",
});
assert.equal(git.status, 0);
assert.equal(realpathSync(git.stdout.trim()), root);
const directory = join(root, "docs/evidence/WO-039/harness-live");
// Four role entries, then the two writer-reservation scenarios that the
// evidence gate requires alongside them.
const runs = [
  ...roles.map((role) => ({ label: role, prefix: role, role, env: {} })),
  ...writerScenarios.map((scenario) => ({
    label: `writer-reservation ${scenario}`,
    prefix: `writer-${scenario}`,
    role: "executor",
    env: { DOTLN_LIVE_WRITER: scenario },
  })),
];
for (const run of runs) {
  const attempts = readdirSync(directory).flatMap((name) => {
    const match = new RegExp(`^${run.prefix}-(\\d{3})\\.json$`).exec(name);
    return match ? [Number(match[1])] : [];
  });
  const number = Math.max(0, ...attempts) + 1;
  assert.ok(number < 1000);
  const attempt = String(number).padStart(3, "0");
  console.log(`Running bounded ${run.label} smoke, attempt ${attempt}.`);
  const result = spawnSync(
    process.execPath,
    ["scripts/harness-live-smoke.mjs", run.role, attempt],
    {
      cwd: root,
      env: { ...process.env, ...run.env },
      stdio: "inherit",
      timeout: 260_000,
    },
  );
  if (result.status !== 0) {
    process.exitCode = 1;
    break;
  }
}
