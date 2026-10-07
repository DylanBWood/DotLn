// D033's known limitation, not a passing preservation claim. Run after build:
// node scripts/harness.mjs bounded -- node docs/evidence/WO-112/shared-object-counterexample.mjs
import assert from "node:assert/strict";
import { readFileSync, writeFileSync, unlinkSync, rmSync } from "node:fs";
import { join } from "node:path";
import { decodeLog } from "@dotln/kernel";
import { SourceChangeHost } from "../../../packages/skeleton/dist/src/source-change-host.js";
import {
  createSourceFixture,
  sourceFixtureOptions,
  fixtureGit as git,
} from "../../../packages/skeleton/dist/test/source-change-fixture.js";

const root = createSourceFixture();
try {
  const repo = join(root, "target");
  const sibling = join(root, "sibling");
  git(repo, "worktree", "add", "-b", "independent", sibling, "HEAD");
  writeFileSync(join(sibling, "unique.txt"), "Independent synthetic bytes.\n");
  git(sibling, "add", "unique.txt");
  git(sibling, "commit", "-m", "Independent fixture");
  const blob = git(sibling, "rev-parse", "HEAD:unique.txt");
  const blobPath = join(repo, ".git/objects", blob.slice(0, 2), blob.slice(2));
  const host = new SourceChangeHost({
    ...sourceFixtureOptions(root, () => 10),
    afterResult() {
      unlinkSync(blobPath);
    },
  });
  const outcome = await host.run();
  const observed = decodeLog(
    readFileSync(join(root, "store/events.jsonl"), "utf8"),
  ).some((event) => event.type === "SourceChangeObserved");
  assert.throws(() => git(repo, "cat-file", "blob", blob));
  assert.equal(outcome.status, "observed");
  assert.equal(observed, true);
  console.log(
    "Known D033 gap reproduced: candidate accepted, sibling blob missing.",
  );
} finally {
  rmSync(root, { recursive: true, force: true });
}
