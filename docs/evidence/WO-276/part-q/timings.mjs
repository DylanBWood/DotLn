// Part Q's two readings of what a tool call costs in hooks: runs the harness
// suite's timing case with the file to write named in the environment.
//
//   node docs/evidence/WO-276/part-q/timings.mjs before|after
//
// The case starts, for a read, a search, a shell command, an edit and a
// write, each ten times, every hook the harness fixture's own settings
// register for that tool, and writes each hook's timings and the count of
// processes started.
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "../../../..");
const [reading] = process.argv.slice(2);
if (!["before", "after"].includes(reading))
  throw new Error("usage: node timings.mjs before|after");
const out = join(here, `${reading}.json`);
const run = spawnSync(
  process.execPath,
  [
    "--test",
    "--test-name-pattern",
    "each hook the settings register for a tool starts for a read",
    join(root, "scripts/test-harness.mjs"),
  ],
  {
    cwd: root,
    env: { ...process.env, DOTLN_HOOK_TIMINGS: out },
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
  },
);
if (run.status !== 0 || !existsSync(out))
  throw new Error(`the timing case did not pass: ${run.stdout.slice(-2000)}`);
console.log(`${reading}.json written`);
