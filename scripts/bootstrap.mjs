#!/usr/bin/env node
import { TOOL_ROOT, docPath, docRelative, loadConfig } from "./lib/config.mjs";
import { resolveRecordedClone } from "./lib/target-worktrees.mjs";
import { isMainModule } from "./lib/paths.mjs";
import { hasPackageSources } from "../packages/skeleton/src/runtime-inputs.mjs";
import { existsSync, readFileSync, realpathSync } from "node:fs";
import { join } from "node:path";

import { spawnSync } from "node:child_process";

/** A registered target whose local clone is recorded in none of the places
 * the gates read (this checkout, the primary checkout, the main worktree)
 * fails the first plan check and document gate with "recorded target clone
 * unavailable" and no earlier word; this names each such target and the
 * registration command before any preparation step runs. A mapping that
 * does not parse is named by its path, and a configuration that does not
 * load is left to the checks that report it. */
export function missingTargetClones(root) {
  let repositories;
  try {
    repositories = Object.keys(loadConfig(root).repositories ?? {});
  } catch {
    return [];
  }
  if (!repositories.length) return [];
  const mappingPath = docRelative(
    root,
    "control",
    "local/repository-clones.json",
  );
  const lines = [];
  for (const id of repositories) {
    let resolved;
    try {
      resolved = resolveRecordedClone(root, id);
    } catch (error) {
      lines.push(
        `Registered target ${id}: the local clone mapping could not be read (${error.message}); plan check and the document gate refuse until it is repaired`,
      );
      continue;
    }
    if (typeof resolved.clone !== "string")
      lines.push(
        `Registered target ${id} has no local clone recorded in ${mappingPath} of this checkout, the primary checkout or the main worktree (read: ${resolved.places.join(", ")}); plan check and the document gate refuse with "recorded target clone unavailable" until it is registered: node scripts/worktree.mjs clone ${id} <absolute path to its clone>`,
      );
  }
  return lines;
}

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
  for (const line of missingTargetClones(root)) console.log(line);
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
