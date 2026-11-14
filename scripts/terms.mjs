#!/usr/bin/env node
import { execGit } from "./lib/git.mjs";
import { isMainModule } from "./lib/paths.mjs";

import { readFileSync, realpathSync } from "node:fs";
import { resolve } from "node:path";

import {
  checkLocalTerms,
  localTermFindings,
  localTermLine,
} from "./lib/terms.mjs";
import { containedRegularFile } from "./lib/paths.mjs";

const namedSurfaces = (root, paths) => {
  if (!paths.length)
    throw new Error("terms check requires explicit file paths");
  return [...new Set(paths)].sort().map((name) => {
    const path = resolve(root, name);
    if (!containedRegularFile(path, root))
      throw new Error("terms check requires contained regular files");
    return { name, text: readFileSync(path, "utf8") };
  });
};

/** The named files screened against the private list: a refuse-mode match
 * throws, and the list's status comes back with its context-mode findings. */
export function termsCheck(root, paths) {
  return checkLocalTerms(root, namedSurfaces(root, paths));
}

/** What the command prints for one screen. The status line gives the list's
 * state, the entries in each class, what was screened and the lines found in
 * each class. Each context-mode finding follows on standard output, for the
 * stage at hand to read beside the entry it matched; each refuse-mode finding
 * goes to standard error as a failure. A finding names a file, a line and a
 * mode, never a term. Returns whether anything refuses. */
export function printTermsScreen(result, screened, out = console) {
  const found = (mode) =>
    result.findings.filter((finding) => finding.mode === mode);
  const [refused, context] = [found("refuse"), found("context")];
  out.log(
    `local-terms list: present; entries: ${result.refuse} refuse, ${result.context} context; ${screened}; lines found: ${refused.length} refuse, ${context.length} context`,
  );
  for (const finding of context) out.log(`CONTEXT ${localTermLine(finding)}`);
  for (const finding of refused) out.error(`FAIL ${localTermLine(finding)}`);
  return refused.length > 0;
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
      if (action === "check") {
        const paths = process.argv.slice(3);
        const result = localTermFindings(root, namedSurfaces(root, paths));
        if (result.status === "unavailable")
          console.log("local-terms list: unavailable");
        else if (
          printTermsScreen(
            result,
            `named files screened: ${new Set(paths).size}`,
          )
        )
          process.exitCode = 1;
      } else {
        // The document gate's terms task: the lines this branch adds, against
        // its merge base with main (on main, what the last merge brought in).
        const { branchTermFindings } = await import("./lib/branch-terms.mjs");
        const { docRelative } = await import("./lib/config.mjs");
        const result = branchTermFindings(root);
        if (result.status === "no merge base")
          console.log(`local-terms list: not read; ${result.reason}`);
        else if (result.status === "unavailable")
          console.log(
            `local-terms list: unavailable\nAdvisory: no local-terms list is registered at ${docRelative(root, "control", "local/terms.txt")}, so the ${result.files} files this branch changes were not screened; register it to screen them.`,
          );
        else if (
          printTermsScreen(result, `changed files screened: ${result.files}`)
        )
          process.exitCode = 1;
      }
    }
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
