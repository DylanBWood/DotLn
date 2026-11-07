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
      if (process.argv[2] !== "check")
        throw new Error("usage: terms check <paths>");
      const root = realpathSync(process.cwd());
      if (
        realpathSync(
          execGit(["rev-parse", "--show-toplevel"], {
            encoding: "utf8",
          }).trim(),
        ) !== root
      )
        throw new Error("terms check requires repository root");
      console.log(
        `local-terms list: ${termsCheck(root, process.argv.slice(3)).status}`,
      );
    }
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
