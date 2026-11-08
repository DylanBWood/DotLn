#!/usr/bin/env node
import { execGit } from "./lib/git.mjs";
import { isMainModule } from "./lib/paths.mjs";

import { readFileSync, realpathSync } from "node:fs";
import { resolve } from "node:path";

import { checkLocalTerms } from "./lib/terms.mjs";
import { containedRegularFile } from "./lib/paths.mjs";

export function termsCheck(root, paths) {
  if (!paths.length)
    throw new Error("terms check requires explicit file paths");
  const names = paths;
  const surfaces = [...new Set(names)].sort().map((name) => {
    const path = resolve(root, name);
    if (!containedRegularFile(path, root))
      throw new Error("terms check requires contained regular files");
    return { name, text: readFileSync(path, "utf8") };
  });
  return checkLocalTerms(root, surfaces);
}
if (isMainModule(import.meta.url)) {
  try {
    if (process.argv[2] === "--plan-first") {
      const { findLaunchpad } = await import("./lib/config.mjs");
      const { selectedPlanState } = await import("./lib/plan-first.mjs");
      const { screenPlanFirst } = await import("./lib/plan-first-screen.mjs");
      if (process.argv.length !== 4)
        throw new Error("usage: terms --plan-first WO-NNN");
      const root = findLaunchpad();
      const result = screenPlanFirst(
        root,
        selectedPlanState(root, process.argv[3]),
        process.stdin.isTTY ? undefined : readFileSync(0, "utf8"),
      );
      console.log(JSON.stringify(result));
      if (result.status === "refused") process.exitCode = 1;
    } else {
      const action = process.argv[2];
      if (
        !["check", "branch"].includes(action) ||
        (action === "branch" && process.argv.length !== 3)
      )
        throw new Error("usage: terms check <paths> | terms branch");
      const root = realpathSync(process.cwd());
      if (
        realpathSync(
          execGit(["rev-parse", "--show-toplevel"], {
            encoding: "utf8",
          }).trim(),
        ) !== root
      )
        throw new Error(`terms ${action} requires repository root`);
      if (action === "check")
        console.log(
          `local-terms list: ${termsCheck(root, process.argv.slice(3)).status}`,
        );
      else {
        // The document gate's terms task: the lines this branch adds, against
        // its merge base with main (on main, what the last merge brought in).
        const { branchTermFindings, branchTermLines } =
          await import("./lib/branch-terms.mjs");
        const { docRelative } = await import("./lib/config.mjs");
        const result = branchTermFindings(root);
        if (result.status === "no merge base")
          console.log(`local-terms list: not read; ${result.reason}`);
        else if (result.status === "unavailable")
          console.log(
            `local-terms list: unavailable\nAdvisory: no local-terms list is registered at ${docRelative(root, "control", "local/terms.txt")}, so the ${result.files} files this branch changes were not screened; register it to screen them.`,
          );
        else {
          console.log(
            `local-terms list: present; ${result.files} changed files screened, ${result.findings.length} findings`,
          );
          for (const line of branchTermLines(result.findings))
            console.error(`FAIL ${line}`);
          if (result.findings.length) process.exitCode = 1;
        }
      }
    }
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
