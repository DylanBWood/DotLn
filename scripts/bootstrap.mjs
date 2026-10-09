#!/usr/bin/env node
import { TOOL_ROOT } from "./lib/config.mjs";
import { hasPackageSources, isMainModule } from "./lib/paths.mjs";
import { existsSync, realpathSync } from "node:fs";
import { join } from "node:path";

import { spawnSync } from "node:child_process";

/** This entry point must never import dependencies or a built adapter. */
export function bootstrapWorktree(
  root,
  run = spawnSync,
  environment = process.env,
) {
  root = realpathSync(root);
  const top = run("git", ["rev-parse", "--show-toplevel"], {
    cwd: root,
    encoding: "utf8",
    env: environment,
  });
  if (top.status !== 0 || realpathSync(top.stdout.trim()) !== root)
    throw new Error("Bootstrap must run at the physical Git root");
  const browser = [
    process.execPath,
    "node_modules/playwright/cli.js",
    "install",
    "chromium",
    "--only-shell",
  ];
  const steps = [
    ...(!existsSync(join(root, "node_modules/typescript/bin/tsc"))
      ? [["npm", "ci", "--ignore-scripts", "--no-audit", "--no-fund"]]
      : []),
    ...(existsSync(join(root, "packages/browser-evidence/package.json"))
      ? [browser]
      : []),
    // A kit export (WO-075) carries the compiled runtime and no package
    // source, so it has no build step; its emit installs the snapshot from
    // packages/<name>/dist.
    ...(hasPackageSources(root) ? [["npm", "run", "build", "--silent"]] : []),
    ...(existsSync(join(root, ".claude/harness-manifest.json"))
      ? [[process.execPath, "scripts/harness.mjs", "emit"]]
      : []),
  ];
  for (const step of steps) {
    const [command, ...args] = step;
    const result = run(command, args, {
      cwd: root,
      stdio: "inherit",
      env:
        step === browser
          ? {
              ...environment,
              // Match scenario.test.mjs; never borrow the parent's INIT_CWD
              // when worktree start prepares a different checkout.
              PLAYWRIGHT_BROWSERS_PATH:
                environment.PLAYWRIGHT_BROWSERS_PATH ??
                join(root, ".runtime/playwright"),
              INIT_CWD: root,
            }
          : environment,
    });
    if (result.status !== 0)
      throw new Error(
        `Worktree preparation failed at ${command} ${args.join(" ")}; the checkout is preserved. Retry node scripts/bootstrap.mjs after resolving the reported error.`,
      );
  }
  return steps.length;
}

if (isMainModule(import.meta.url)) {
  try {
    const root = realpathSync(process.cwd());
    if (root !== realpathSync(TOOL_ROOT))
      throw new Error("Run node scripts/bootstrap.mjs from its own worktree");
    console.log(
      `Worktree ready for Claude or Codex (${bootstrapWorktree(root)} preparation steps).`,
    );
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
