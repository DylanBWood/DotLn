// Reproduce criterion 3's comparison-base census against a real, unchanged
// runtime consumer and its existing entry points. No repository bytes change.
import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { changedAgainstMain } from "../../../scripts/lib/planning-followups.mjs";
import { runGit } from "../../../scripts/lib/git.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
const decisions = readFileSync(
  join(root, "docs/evidence/WO-243/decisions.md"),
  "utf8",
);
const census = decisions.split("## WO-243-D006")[1].split("## WO-243-D007")[0];
const changed = changedAgainstMain(root);
const mainBase = runGit(root, ["merge-base", "HEAD", "main"]);
const consumer = "scripts/lib/planning-followups.mjs";
const source = readFileSync(join(root, consumer), "utf8");
const exported = source.indexOf("export function changedAgainstMain(");
const line = source.slice(0, exported).split("\n").length;
const callers = [
  "scripts/lib/lifecycle-evidence.mjs",
  "scripts/refute-plan.mjs",
].map((path) => ({
  path,
  callsChangedAgainstMain: /changedAgainstMain\(root/u.test(
    readFileSync(join(root, path), "utf8"),
  ),
}));
const listed = census.includes(`\`${consumer}\``);
const result = {
  schemaVersion: 1,
  workOrder: "WO-243",
  criterion: "3",
  recordedAt: new Date().toISOString(),
  input:
    "the current worktree, through the exported changedAgainstMain(root) used by lifecycle evidence and plan followups --touching",
  consumer,
  line,
  observedBase: changed.base,
  currentMergeBaseWithMain: mainBase,
  sameBase: changed.base === mainBase,
  changedPathCount: changed.paths.length,
  callers,
  listedInD006: listed,
  expected:
    "D006 names this comparison-base reader and states whether its existing semantics are kept or moved, with the reason",
  result: listed ? "pass" : "fail",
};
console.log(JSON.stringify(result, null, 2));
process.exitCode = listed ? 0 : 1;
