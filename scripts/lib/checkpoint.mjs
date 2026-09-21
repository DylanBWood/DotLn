import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { runGit } from "./git.mjs";

// A recovery object, never a branch commit or a lifecycle event. The real
// index is untouched, and ignored intake deliberately remains outside Git.
export function createCheckpoint(root, action, workOrderId) {
  if (!/^WO-\d{3}$/.test(workOrderId))
    throw new Error("invalid checkpoint order");
  const prefix = `refs/dotln/checkpoint/${workOrderId}/`;
  const used = runGit(root, ["for-each-ref", "--format=%(refname)", prefix])
    .split("\n")
    .filter(Boolean)
    .map((ref) => Number(ref.slice(prefix.length)))
    .filter(Number.isInteger);
  const checkpointRef = `${prefix}${Math.max(0, ...used) + 1}`;
  const temporary = mkdtempSync(join(tmpdir(), "dotln-checkpoint-"));
  try {
    const env = { ...process.env, GIT_INDEX_FILE: join(temporary, "index") };
    runGit(root, ["add", "-A"], { env });
    const tree = runGit(root, ["write-tree"], { env });
    const checkpointSha = runGit(
      root,
      [
        "commit-tree",
        tree,
        "-p",
        "HEAD",
        "-m",
        `dotln checkpoint: ${action} ${workOrderId}`,
      ],
      { env },
    );
    runGit(root, ["update-ref", checkpointRef, checkpointSha, ""]);
    return { checkpointSha, checkpointRef };
  } finally {
    rmSync(temporary, { recursive: true, force: true });
  }
}
