#!/usr/bin/env node
// `npm run worker -- list` prints the workers and models this launchpad
// has and `npm run worker -- show <name>` the launch of one, both from the
// one table (scripts/lib/worker-launch.mjs); neither launches anything.
// `npm run worker -- review …` launches one change review worker on Codex
// or Claude with the canonical brief; `npm run worker -- record …` records
// an Agent-route worker's returned text the same way
// (scripts/lib/review-worker.mjs).
import { findLaunchpad } from "./lib/config.mjs";
import { isMainModule } from "./lib/paths.mjs";
import { runGit } from "./lib/git.mjs";
import {
  RECORD_USAGE,
  REVIEW_USAGE,
  recordAgentReview,
  runChangeReview,
} from "./lib/review-worker.mjs";
import {
  listWorkerRows,
  renderWorkerList,
  showWorker,
} from "./lib/worker-launch.mjs";

export const LIST_USAGE = "usage: npm run worker -- list [--json]";
export const SHOW_USAGE =
  "usage: npm run worker -- show <worker or model> [--provider <provider>] [--effort <level>]";

/** @param {readonly string[]} args @param {string} usage @param {readonly string[]} valued @param {readonly string[]} [switches] */
function flags(args, usage, valued, switches = []) {
  const named = {};
  const words = [];
  for (let index = 0; index < args.length; index++) {
    const arg = args[index];
    if (switches.includes(arg)) named[arg] = true;
    else if (valued.includes(arg)) {
      const next = args[++index];
      if (next === undefined || next.startsWith("--"))
        throw new Error(`${arg} needs a value; ${usage}`);
      named[arg] = next;
    } else if (arg.startsWith("--"))
      throw new Error(`unknown option ${arg}; ${usage}`);
    else words.push(arg);
  }
  return { named, words };
}

/** @param {readonly string[]} args @param {string} root */
export async function main(
  args = process.argv.slice(2),
  root = findLaunchpad(),
) {
  if (runGit(root, ["rev-parse", "--show-toplevel"]) !== root)
    throw new Error("the worker command must use its Git root");
  const [command, ...rest] = args;
  if (command === "list") {
    const { named, words } = flags(rest, LIST_USAGE, [], ["--json"]);
    if (words.length) throw new Error(LIST_USAGE);
    const rows = listWorkerRows(root);
    process.stdout.write(
      named["--json"]
        ? `${JSON.stringify(rows, null, 2)}\n`
        : renderWorkerList(rows),
    );
    return undefined;
  }
  if (command === "show") {
    const { named, words } = flags(rest, SHOW_USAGE, [
      "--provider",
      "--effort",
    ]);
    if (words.length !== 1) throw new Error(SHOW_USAGE);
    process.stdout.write(
      `${JSON.stringify(
        await showWorker(root, words[0], {
          provider: named["--provider"],
          effort: named["--effort"],
        }),
        null,
        2,
      )}\n`,
    );
    return undefined;
  }
  if (command === "review") return runChangeReview(root, rest);
  if (command === "record") return recordAgentReview(root, rest);
  throw new Error(
    [LIST_USAGE, SHOW_USAGE, REVIEW_USAGE, RECORD_USAGE].join("\n"),
  );
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
