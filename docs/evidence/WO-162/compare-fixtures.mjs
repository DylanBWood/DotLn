import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { runGit } from "../../../scripts/lib/git.mjs";
import { sha256Hex } from "../../../scripts/lib/helpers.mjs";

const root = resolve(import.meta.dirname, "../../..");
const baseline = "6f9494649db9a4984911801ae320788264d84ff9";
// Every path with a fixtures/ directory segment, plus the corpus.
const fixtureTree = (path) => /(?:^|\/)fixtures\/|^corpus\//u.test(path);
const paths = runGit(root, ["ls-tree", "-r", "--name-only", baseline])
  .split("\n")
  .filter(fixtureTree);
// Tracked and untracked working-tree paths of the same set.
const added = runGit(root, [
  "ls-files",
  "--cached",
  "--others",
  "--exclude-standard",
])
  .split("\n")
  .filter((path) => fixtureTree(path) && !paths.includes(path));
const rows = paths.map((path) => {
  const before = runGit(root, ["show", `${baseline}:${path}`], {
    trim: false,
    encoding: null,
  });
  const after = readFileSync(resolve(root, path));
  return { path, before: sha256Hex(before), after: sha256Hex(after) };
});
const changed = rows.filter((row) => row.before !== row.after);
assert.equal(rows.length, 177);
assert.deepEqual(added, []);
assert.deepEqual(
  changed.map((row) => row.path),
  [
    "packages/console/fixtures/expected/selfhost.html",
    "packages/console/fixtures/expected/selfhost.json",
    "packages/console/fixtures/expected/selfhost.txt",
    "packages/console/fixtures/manifest.json",
  ],
);
console.log(
  JSON.stringify(
    {
      baseline,
      unchanged: rows.length - changed.length,
      added,
      changedReason:
        "Required compiler label 0.19.3 to 0.19.4 enters the feedback policy hash, which the three expected self-host outputs record; the matching WO-162 feedback edition then changes their labels and references and the manifest's maturity path and digest. Console source is unchanged, and the current code under the 0.19.3 label reproduces the baseline fixtures. Fixed-input helper parity is separately tested in scripts/test-helper-reuse.mjs.",
      rows,
    },
    null,
    2,
  ),
);
