#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { beginGateRun } from "./lib/gate-evidence.mjs";

// Preserve the package command's build-before-load contract. Evidence reserves
// the worktree before that build, including preparation and the final diff check.
const args = process.argv.slice(2);
const active =
  args[0] === "evidence"
    ? beginGateRun(process.cwd(), "npm run harness -- evidence")
    : null;
try {
  const build = spawnSync("npm", ["run", "build", "--silent"], {
    stdio: "inherit",
  });
  if (build.status !== 0) process.exitCode = build.status ?? 1;
  else {
    const run = spawnSync(process.execPath, ["scripts/harness.mjs", ...args], {
      stdio: "inherit",
    });
    process.exitCode = run.status ?? 1;
  }
} finally {
  active?.release();
}
