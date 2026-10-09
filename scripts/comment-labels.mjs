#!/usr/bin/env node
import { findLaunchpad } from "./lib/config.mjs";
import { isMainModule } from "./lib/paths.mjs";
import {
  baselineRelative,
  checkCommentLabels,
  writeCommentBaseline,
} from "./lib/comment-labels.mjs";

if (isMainModule(import.meta.url)) {
  try {
    const args = process.argv.slice(2);
    if (args.some((arg) => arg !== "--write") || args.length > 1)
      throw new Error("usage: node scripts/comment-labels.mjs [--write]");
    const root = findLaunchpad();
    if (args[0] === "--write") {
      const written = writeCommentBaseline(root);
      console.log(
        `Wrote ${baselineRelative(root)}: ${written.lines} baselined comment lines in ${written.files} files.`,
      );
    } else {
      const result = checkCommentLabels(root);
      for (const failure of result.failures) console.error(`FAIL ${failure}`);
      console.log(
        `${result.failures.length ? "FAIL" : "PASS"} comment labels: ${result.scanned} code files; ${result.baselined} baselined lines; ${result.failures.length} failures`,
      );
      process.exitCode = result.failures.length ? 1 : 0;
    }
  } catch (error) {
    console.error(`FAIL comment labels: ${error.message}`);
    process.exitCode = 1;
  }
}
