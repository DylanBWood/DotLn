#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { readFileSync, realpathSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
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
if (
  process.argv[1] &&
  realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  try {
    if (process.argv[2] !== "check")
      throw new Error("usage: terms check <paths>");
    const root = realpathSync(process.cwd());
    if (
      realpathSync(
        execFileSync("git", ["rev-parse", "--show-toplevel"], {
          encoding: "utf8",
        }).trim(),
      ) !== root
    )
      throw new Error("terms check requires repository root");
    console.log(
      `local-terms list: ${termsCheck(root, process.argv.slice(3)).status}`,
    );
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
