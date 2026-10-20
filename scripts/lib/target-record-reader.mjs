import { createHash } from "node:crypto";
import { posix } from "node:path";
import { docRelative } from "./config.mjs";
import { readControl, eventsForOrder } from "./control-store.mjs";
import { mainWorktree, runGit } from "./git.mjs";
import { HOST_GIT_READ } from "./github-repository.mjs";
import {
  physicalDirectory,
  recordedRepositoryClone,
  targetRecordSources,
  targetWorktreeForOrder,
} from "./target-worktrees.mjs";

/** Location metadata is available even after the local report is moved. */
export const targetRecordReference = (root, state, source, events) => {
  const binding = state.targetRecords;
  if (!binding || !source) return undefined;
  const declared = targetRecordSources(root, state, events, {
    documentationRoot: binding.root,
  }).find((row) => row.source === source);
  const record = binding.records.find(
    (row) => row.path === declared?.path && row.kind === declared?.kind,
  );
  return record
    ? {
        repositoryId: binding.repositoryId,
        commit: binding.commit,
        path: record.path,
        sha256: record.sha256,
      }
    : undefined;
};
export const formatTargetRecord = (record) =>
  `${record.repositoryId}@${record.commit}:${record.path}`;

/** Read only the immutable regular blob bound by the lifecycle receipt.
 * The clone's working copy, replacement refs and current branch are irrelevant. */
export function readTargetRecord(root, state, record) {
  const binding = state.targetRecords,
    subject = state.targetSubject;
  if (
    !binding ||
    !subject ||
    binding.repositoryId !== state.repositoryId ||
    binding.repositoryId !== subject.repositoryId ||
    record.repositoryId !== binding.repositoryId ||
    binding.parent !== subject.commit ||
    binding.branch !== subject.branch ||
    record.commit !== binding.commit ||
    !binding.records.some(
      (row) => row.path === record.path && row.sha256 === record.sha256,
    ) ||
    posix.normalize(record.path) !== record.path ||
    !record.path.startsWith(`${binding.root}/`) ||
    record.path.includes("\\")
  )
    throw new Error("target record binding differs from its reviewed subject");
  let owner = root;
  let clone = recordedRepositoryClone(owner, state.repositoryId);
  if (!clone) {
    owner = mainWorktree(root);
    clone = recordedRepositoryClone(owner, state.repositoryId);
  }
  clone ??= targetWorktreeForOrder(root, state.workOrderId)?.clone;
  if (!clone)
    throw new Error(
      `${state.workOrderId}: recorded target clone unavailable; restore its local clone mapping to read moved records`,
    );
  physicalDirectory(clone);
  const git = (args, options) =>
    runGit(clone, ["--no-replace-objects", ...HOST_GIT_READ, ...args], options);
  if (
    git(["rev-list", "--parents", "-n", "1", binding.commit]) !==
    `${binding.commit} ${binding.parent}`
  )
    throw new Error(
      `${state.workOrderId}: moved records commit differs from its recorded parent`,
    );
  const tree = git([
    "ls-tree",
    "--format=%(objectmode) %(objecttype) %(objectname)",
    binding.commit,
    "--",
    `:(literal)${record.path}`,
  ]);
  const object = /^100644 blob ([a-f0-9]{40}|[a-f0-9]{64})$/u.exec(tree);
  if (!object)
    throw new Error(
      `${state.workOrderId}: moved record is not a regular committed blob`,
    );
  const bytes = git(["cat-file", "blob", object[1]], {
    encoding: null,
    trim: false,
  });
  if (createHash("sha256").update(bytes).digest("hex") !== record.sha256)
    throw new Error(
      `${state.workOrderId}: moved record bytes differ from their recorded hash`,
    );
  return bytes.toString("utf8");
}

export function movedDecisions(root, workOrder) {
  const control = readControl(root),
    rows = [];
  for (const [name, { state }] of control.orders) {
    if (!state.targetRecords || (workOrder && name !== workOrder)) continue;
    const path = docRelative(root, "evidence", name, "decisions.md");
    const record = targetRecordReference(
      root,
      state,
      path,
      eventsForOrder(control, name),
    );
    if (record) rows.push({ name, path, record, state });
  }
  return rows;
}
