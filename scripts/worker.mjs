#!/usr/bin/env node
// `npm run worker -- review …` launches one change review worker on Codex or
// Claude with the canonical brief; `npm run worker -- record …` records an
// Agent-route worker's returned text the same way (scripts/lib/review-worker.mjs).
import { findLaunchpad } from "./lib/config.mjs";
import { isMainModule } from "./lib/paths.mjs";
import { runGit } from "./lib/git.mjs";
import {
  RECORD_USAGE,
  REVIEW_USAGE,
  recordAgentReview,
  runChangeReview,
} from "./lib/review-worker.mjs";

/** @param {readonly string[]} args @param {string} root */
export async function main(
  args = process.argv.slice(2),
  root = findLaunchpad(),
) {
  if (runGit(root, ["rev-parse", "--show-toplevel"]) !== root)
    throw new Error("the worker command must use its Git root");
  const [command, ...rest] = args;
  if (command === "review") return runChangeReview(root, rest);
  if (command === "record") return recordAgentReview(root, rest);
  throw new Error(`${REVIEW_USAGE}\n${RECORD_USAGE}`);
}

if (isMainModule(import.meta.url)) {
  main()
    .then((result) => {
      // A refused launch and a worker that returned no report both exit
      // nonzero, so a caller never reads a missing review as a clean one.
      if (result?.refused) process.exitCode = 2;
      else if (result && !result.dryRun && !result.report) process.exitCode = 1;
    })
    .catch((error) => {
      process.stderr.write(
        `${error instanceof Error ? error.message : "worker command failed"}\n`,
      );
      process.exitCode = 1;
    });
}
