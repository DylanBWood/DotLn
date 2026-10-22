#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { beginGateRun } from "./lib/gate-evidence.mjs";
import { isKitRoot } from "../packages/skeleton/src/runtime-inputs.mjs";

// Prepare the selected runtime before loading it. Evidence reserves the
// worktree before preparation and holds it through the final diff check.
const args = process.argv.slice(2);
// A stop request neither builds nor marks a run: it must be admitted while a
// gate holds the tree, and a build would change that gate's inputs.
const stop = args[0] === "evidence" && args[1] === "--stop";
const active =
  args[0] === "evidence" && !stop
    ? beginGateRun(process.cwd(), "npm run harness -- evidence")
    : null;
try {
  let build = { status: 0 };
  if (!stop) {
    const kit = isKitRoot(process.cwd());
    if (kit) console.log("Preparing carried runtime; carried-runtime restore.");
    build = kit
      ? spawnSync(
          process.execPath,
          ["scripts/lib/release-kit-runtime.mjs", process.cwd()],
          { stdio: "inherit" },
        )
      : spawnSync("npm", ["run", "build", "--silent"], { stdio: "inherit" });
  }
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
