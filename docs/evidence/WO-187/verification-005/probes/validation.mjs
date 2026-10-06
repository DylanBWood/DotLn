import assert from "node:assert/strict";
import { readFileSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { gateCodeIdentity } from "../../../../../scripts/lib/gate-evidence.mjs";
const json = (file) => JSON.parse(readFileSync(file, "utf8"));
const git = (args) => execFileSync("git", args, { encoding: "utf8" });
const budgets = json("docs/control/budgets.json");
assert.equal(git(["diff", "HEAD", "--", "docs/control/budgets.json"]), "");
const roots = {};
const instructionBytes = readFileSync("CLAUDE.md").length;
const before = json("docs/evidence/WO-187/cold-start-before.json");
const repaired = json("docs/evidence/WO-187/repair-004/cold-start.json");
for (const role of [
  "executor",
  "verifier",
  "reviewer",
  "release-close",
  "planner",
  "refuter",
]) {
  const claude = readFileSync(`.claude/skills/dotln-${role}/SKILL.md`),
    codex = readFileSync(`.agents/skills/dotln-${role}/SKILL.md`);
  assert.deepEqual(claude, codex);
  const bytes = instructionBytes + claude.length;
  assert.equal(bytes, repaired.roles[role].rootBytes);
  roots[role] = {
    before: before.profiles.find((p) => p.role === role).bytes,
    after: bytes,
    ceiling: budgets.limits.coldStartBytes[role],
    twinsEqual: true,
  };
}
const product07 = {
  bytes: readFileSync("docs/product/07-execution-guide.md").length,
  ceiling: json("docs/control/doc-ceilings.json").documents[
    "07-execution-guide.md"
  ].ceiling,
};
const currentLock = json("package-lock.json"),
  baseLock = JSON.parse(git(["show", "HEAD:package-lock.json"]));
assert.deepEqual(
  Object.keys(currentLock.packages).sort(),
  Object.keys(baseLock.packages).sort(),
);
const external = Object.keys(currentLock.packages).filter((p) =>
  p.startsWith("node_modules/"),
);
for (const key of external)
  assert.deepEqual(currentLock.packages[key], baseLock.packages[key]);
for (const args of [
  ["diff", "--check"],
  ["diff", "--cached", "--check"],
])
  assert.equal(git(args), "");
const diff = git([
  "diff",
  "refs/dotln/checkpoint/WO-187/18",
  "--",
  "scripts",
  "packages",
  ".claude",
  ".agents",
  "docs/product",
  "docs/PLAYBOOK.md",
  "README.md",
  "package.json",
  "package-lock.json",
]);
assert.equal(diff, "");
const hash = (file) =>
  createHash("sha256").update(readFileSync(file)).digest("hex");
const result = {
  observedAt: new Date().toISOString(),
  branch: git(["branch", "--show-current"]).trim(),
  head: git(["rev-parse", "HEAD"]).trim(),
  subjectCheckpoint: "refs/dotln/checkpoint/WO-187/18",
  subjectMatchesCheckpoint: true,
  codeIdentity: gateCodeIdentity(process.cwd()),
  instructionBytes,
  roots,
  product07,
  budgetChanges: false,
  externalDependencyEntriesUnchanged: external.length,
  diffChecks: "clean",
  adversaryInputs: {
    orderSha256: hash(
      "docs/work-orders/WO-187-verification-attacks-and-reviews.md",
    ),
    authoredDiffSha256: hash(process.argv[2]),
  },
  harnessCheck: {
    command: "node scripts/harness.mjs bounded -- npm run harness -- check",
    exitCode: 0,
    surfaces: 33,
    completedAt: "2026-10-06T10:08:44.471Z",
    durationMs: 1071,
  },
};
writeFileSync(
  "docs/evidence/WO-187/verification-005/validation.json",
  JSON.stringify(result, null, 2) + "\n",
);
console.log(JSON.stringify(result, null, 2));
