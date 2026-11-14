// Re-verification of VER-002: retained reproducer with repaired expectations.
import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  createScratchRoot,
  removeTemporaryPath,
} from "../../../../scripts/lib/temporary-roots.mjs";
import {
  workingTree,
  createCheckpoint,
} from "../../../../scripts/lib/checkpoint.mjs";
const root = createScratchRoot(join(tmpdir(), "dotln-ver002-checkpoint-"));
const env = {
  ...process.env,
  GIT_AUTHOR_NAME: "Fixture",
  GIT_AUTHOR_EMAIL: "fixture@example.invalid",
  GIT_COMMITTER_NAME: "Fixture",
  GIT_COMMITTER_EMAIL: "fixture@example.invalid",
};
const git = (...args) =>
  execFileSync("git", args, { cwd: root, env, encoding: "utf8" }).trim();
try {
  git("init", "-q");
  writeFileSync(join(root, "keep.txt"), "original\n");
  git("add", "keep.txt");
  git("commit", "-qm", "Fixture base");
  writeFileSync(join(root, "keep.txt"), "changed\n");
  writeFileSync(join(root, "new.txt"), "untracked\n");
  const control = workingTree(root);
  assert.equal(git("show", `${control}:keep.txt`), "changed");
  assert.equal(git("show", `${control}:new.txt`), "untracked");
  writeFileSync(join(root, ".gitignore"), "keep.txt\nignored.txt\n");
  writeFileSync(join(root, "ignored.txt"), "ignored untracked\n");
  const realTracked = git("ls-files", "keep.txt");
  assert.equal(realTracked, "keep.txt");
  // createCheckpoint needs only a normal local fixture identity, never the operator's identity.
  git("config", "user.name", "Fixture");
  git("config", "user.email", "fixture@example.invalid");
  const checkpoint = createCheckpoint(root, "checkpoint", "WO-999", {
    hookless: true,
  });
  const files = git("ls-tree", "--name-only", checkpoint.checkpointSha).split(
    "\n",
  );
  assert.ok(files.includes("keep.txt"));
  assert.equal(git("show", `${checkpoint.checkpointSha}:keep.txt`), "changed");
  assert.ok(files.includes("new.txt"));
  assert.ok(!files.includes("ignored.txt"));
  assert.equal(git("ls-files", "keep.txt"), "keep.txt");
  writeFileSync(
    process.argv[2],
    JSON.stringify(
      {
        controlPreservesTrackedAndUntracked: true,
        trackedBefore: realTracked,
        changedTrackedFileStillInRealIndex: true,
        checkpointFiles: files,
        trackedChangedFilePreserved: true,
        untrackedNonignoredPreserved: true,
        untrackedIgnoredExcluded: true,
      },
      null,
      2,
    ) + "\n",
  );
} finally {
  removeTemporaryPath(root, { recursive: true, force: true });
}
