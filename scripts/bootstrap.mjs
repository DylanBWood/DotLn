#!/usr/bin/env node
import { existsSync, realpathSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

/** This entry point must never import dependencies or a built adapter. */
export function bootstrapWorktree(root, run = spawnSync) {
  root = realpathSync(root);
  const top = run("git", ["rev-parse", "--show-toplevel"], {
    cwd: root,
    encoding: "utf8",
  });
  if (top.status !== 0 || realpathSync(top.stdout.trim()) !== root)
    throw new Error("Bootstrap must run at the physical Git root");
  const steps = [
    ...(!existsSync(join(root, "node_modules/typescript/bin/tsc"))
      ? [["npm", "ci", "--ignore-scripts", "--no-audit", "--no-fund"]]
      : []),
    ["npm", "run", "build", "--silent"],
    ...(existsSync(join(root, ".claude/harness-manifest.json"))
      ? [[process.execPath, "scripts/harness.mjs", "emit"]]
      : []),
  ];
  for (const [command, ...args] of steps) {
    const result = run(command, args, { cwd: root, stdio: "inherit" });
    if (result.status !== 0)
      throw new Error(
        `Worktree preparation failed at ${command} ${args.join(" ")}; the checkout is preserved. Retry node scripts/bootstrap.mjs after resolving the reported error.`,
      );
  }
  return steps.length;
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  try {
    const root = realpathSync(process.cwd());
    if (
      root !==
      realpathSync(resolve(dirname(fileURLToPath(import.meta.url)), ".."))
    )
      throw new Error("Run node scripts/bootstrap.mjs from its own worktree");
    console.log(
      `Worktree ready for Claude or Codex (${bootstrapWorktree(root)} preparation steps).`,
    );
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
