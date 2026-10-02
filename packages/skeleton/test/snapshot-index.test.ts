import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import {
  chmodSync,
  lstatSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";
import { compileVerificationTask, decodeSnapshotIndex } from "@dotln/compiler";
import { readSnapshotIndex } from "../src/snapshot-index.js";
import { prepareWorktreeVerification } from "../src/verification-worktree.js";
import {
  snapshotCriteria,
  snapshotTests,
  snapshotContract,
} from "./verification-worktree-fixture.js";
import { createSourceFixture, fixtureGit } from "./source-change-fixture.js";

const unlock = (directory: string) => {
  const stat = lstatSync(directory);
  if (stat.isSymbolicLink()) return;
  chmodSync(directory, stat.isDirectory() ? 0o700 : 0o600);
  if (stat.isDirectory())
    for (const name of readdirSync(directory)) unlock(join(directory, name));
};
test("WO-124 criterion 3: a host-produced snapshot indexes every file's actual bytes, size and hash", (t) => {
  const root = createSourceFixture(),
    worktree = join(root, "target");
  try {
    writeFileSync(join(worktree, "unicode.txt"), "π\n");
    writeFileSync(join(worktree, "contract-test.mjs"), "process.exit(0);\n");
    fixtureGit(worktree, "add", "unicode.txt", "contract-test.mjs");
    fixtureGit(worktree, "commit", "-m", "Add synthetic snapshot inputs");
    const commit = fixtureGit(worktree, "rev-parse", "HEAD");
    const prepared = prepareWorktreeVerification({
      worktree,
      baseCommit: commit,
      observedCommit: commit,
      repo: "wo124-synthetic-target",
      contract: snapshotContract,
      criteria: snapshotCriteria,
      tests: snapshotTests,
      directory: join(root, "index-snapshot"),
    });
    const capsule = compileVerificationTask(
      "wo124-index",
      snapshotCriteria,
      prepared.subject,
    );
    const index = readSnapshotIndex(capsule, prepared.snapshotPath);
    assert.deepEqual(
      index,
      decodeSnapshotIndex(
        prepared.subject.files.map((file) => ({
          path: file.path,
          size: Buffer.byteLength(file.contents),
          hash: createHash("sha256").update(file.contents).digest("hex"),
        })),
      ),
    );
    assert.equal(index.length, prepared.subject.files.length);
    t.diagnostic(
      JSON.stringify({
        fixtureProvenance: "WO-054 host-produced synthetic snapshot",
        entries: index,
      }),
    );
    const unicode = index.find((file) => file.path === "unicode.txt")!;
    assert.equal(unicode.size, 3, "UTF-8 bytes, not two characters");
    assert.equal(
      unicode.hash,
      "d59279f283574337bf8ff32c34b0d17ead2e8290702ca429e9e4f14200939d56",
    );
    assert.equal(
      JSON.stringify(index),
      JSON.stringify(readSnapshotIndex(capsule, prepared.snapshotPath)),
    );
    assert.ok(Object.isFrozen(index) && Object.isFrozen(index[0]));
    assert.throws(
      () =>
        readSnapshotIndex(
          {
            ...capsule,
            subject: { ...capsule.subject, snapshot: undefined },
          } as unknown as typeof capsule,
          prepared.snapshotPath,
        ),
      /requires worktree-snapshot/u,
    );
    const input = join(prepared.snapshotPath, "unicode.txt");
    chmodSync(input, 0o600);
    writeFileSync(input, "changed\n");
    chmodSync(input, 0o400);
    assert.throws(
      () => readSnapshotIndex(capsule, prepared.snapshotPath),
      /snapshot input hash drift/u,
    );
  } finally {
    unlock(root);
    rmSync(root, { recursive: true, force: true });
  }
});
