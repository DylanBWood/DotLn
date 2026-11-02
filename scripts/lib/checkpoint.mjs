import {
  createScratchRoot,
  removeTemporaryPath as rmSync,
} from "./temporary-roots.mjs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { runGit } from "./git.mjs";

/** The working tree as one Git tree object: tracked and untracked files,
 * ignored files left out. It is written through a temporary index, so the
 * real index is untouched; only the objects land in the repository's store.
 * @param {string} root */
export function workingTree(root) {
  const temporary = createScratchRoot(join(tmpdir(), "dotln-checkpoint-"));
  try {
    const env = { ...process.env, GIT_INDEX_FILE: join(temporary, "index") };
    runGit(root, ["add", "-A"], { env });
    return runGit(root, ["write-tree"], { env });
  } finally {
    rmSync(temporary, { recursive: true, force: true });
  }
}

// A recovery object, never a branch commit or a lifecycle event. The real
// index is untouched, and ignored intake deliberately remains outside Git.
export function createCheckpoint(
  root,
  action,
  workOrderId,
  { hookless = false } = {},
) {
  if (!/^WO-\d{3}$/.test(workOrderId))
    throw new Error("invalid checkpoint order");
  const prefix = `refs/dotln/checkpoint/${workOrderId}/`;
  const used = runGit(root, ["for-each-ref", "--format=%(refname)", prefix])
    .split("\n")
    .filter(Boolean)
    .map((ref) => Number(ref.slice(prefix.length)))
    .filter(Number.isInteger);
  const checkpointRef = `${prefix}${Math.max(0, ...used) + 1}`;
  const tree = workingTree(root);
  const checkpointSha = runGit(root, [
    ...(hookless ? ["-c", "core.hooksPath=/dev/null"] : []),
    "commit-tree",
    tree,
    "-p",
    "HEAD",
    "-m",
    `dotln checkpoint: ${action} ${workOrderId}`,
  ]);
  runGit(root, ["update-ref", checkpointRef, checkpointSha, ""]);
  return { checkpointSha, checkpointRef };
}
