import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  decodeSnapshotIndex,
  type SnapshotIndex,
  type VerificationTask,
} from "@dotln/compiler";
import { assertWorktreeSnapshot } from "./verification-worktree.js";
import { WorkerFailure } from "./worker-protocol.js";

/** Read only a WO-054 host-produced sealed mount. The existing validator owns
 * its inventory, bounds and seal; this module neither creates nor widens it.
 * Unavailable/refused snapshots have no index (deriveSurfaces accepts null).
 */
export function readSnapshotIndex(
  capsule: VerificationTask,
  snapshotPath: string,
): SnapshotIndex {
  if (!capsule.subject.snapshot)
    throw new WorkerFailure(
      "profile-refused",
      "snapshot index requires worktree-snapshot",
    );
  assertWorktreeSnapshot(capsule, snapshotPath);
  const entries = capsule.subject.files.map((file) => {
    const bytes = readFileSync(join(snapshotPath, file.path));
    if (!bytes.equals(Buffer.from(file.contents, "utf8")))
      throw new WorkerFailure(
        "profile-refused",
        `snapshot input drift while indexing: ${file.path}`,
      );
    return {
      path: file.path,
      size: bytes.length,
      hash: createHash("sha256").update(bytes).digest("hex"),
    };
  });
  assertWorktreeSnapshot(capsule, snapshotPath);
  return decodeSnapshotIndex(entries);
}
