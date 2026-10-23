import { createHash } from "node:crypto";
import {
  lstatSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, posix } from "node:path";
import { loadConfig } from "./config.mjs";
import { eventsForOrder } from "./control-store.mjs";
import {
  mainWorktree,
  porcelainEntries,
  porcelainEntryName,
  runGit,
  runGitPathList,
} from "./git.mjs";
import { HOST_GIT_READ } from "./github-repository.mjs";
import { containedRegularFile } from "./paths.mjs";
import {
  launchpadInvocation,
  movedSourceStat,
  reviewedTargetSubject,
  targetRecordSources,
  targetWorktreeForOrder,
  readTargetOperation,
  recordTargetOperation,
  forgetTargetOperation,
} from "./target-worktrees.mjs";
import { checkLocalTerms } from "./terms.mjs";
import { privatePathLines } from "./private-paths.mjs";
import { checkOutwardArtifact } from "../outward-lint.mjs";

// Publication reads the record sources through this module.
export { targetRecordSources };

const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
const refuse = (reason) => new Error(`target records refused: ${reason}`);

/** Check even existing ancestors: lexical containment alone admits symlinks. */
export function targetRecordDestination(target, path) {
  if (
    typeof path !== "string" ||
    path.startsWith("/") ||
    path.includes("\\") ||
    posix.normalize(path) !== path ||
    path.split("/").some((part) => !part || part === "." || part === "..")
  )
    throw refuse(`path escapes the documentation root: ${path}`);
  let current = target;
  const parts = path.split("/");
  for (const [index, part] of parts.entries()) {
    current = join(current, part);
    const stat = lstatSync(current, { throwIfNoEntry: false });
    if (!stat) continue;
    if (
      stat.isSymbolicLink() ||
      (index === parts.length - 1 ? !stat.isFile() : !stat.isDirectory())
    )
      throw refuse(`${path}: destination is not a contained regular file`);
  }
  return current;
}

/** Publication rechecks both the one-parent commit and every recorded blob. */
export function validateTargetRecordsCommit(
  target,
  subject,
  records,
  repository,
) {
  if (
    !records ||
    records.repositoryId !== subject.repositoryId ||
    records.branch !== subject.branch ||
    records.parent !== subject.commit ||
    records.root !== repository.documentationRoot
  )
    throw refuse(
      "records binding differs from the reviewed target or registered documentation root",
    );
  const git = (...args) => runGit(target, [...HOST_GIT_READ, ...args]);
  if (
    git("rev-list", "--parents", "-n", "1", records.commit) !==
    `${records.commit} ${subject.commit}`
  )
    throw refuse(
      "records commit must have the reviewed target as its single parent",
    );
  const paths = new Set(records.records.map((record) => record.path));
  const changed = runGitPathList(target, [
    ...HOST_GIT_READ,
    "diff",
    "--raw",
    "--no-renames",
    "--no-ext-diff",
    "--no-textconv",
    "-z",
    subject.commit,
    records.commit,
    "--",
  ]);
  const invalid = [];
  for (let index = 0; index < changed.length; index += 2) {
    const metadata = changed[index],
      path = changed[index + 1];
    const match = /^:(\d+) (\d+) [a-f0-9]+ [a-f0-9]+ ([AM])$/u.exec(metadata);
    if (
      !paths.has(path) ||
      !path.startsWith(`${records.root}/`) ||
      !match ||
      match[2] !== "100644" ||
      !["000000", "100644"].includes(match[1])
    )
      invalid.push(path);
  }
  if (invalid.length)
    throw refuse(
      `records commit changes unrecorded paths or modes: ${invalid.join(", ")}`,
    );
  for (const record of records.records) {
    if (!record.path.startsWith(`${records.root}/`))
      throw refuse(`record outside documentation root: ${record.path}`);
    const tree = git(
      "ls-tree",
      "--format=%(objectmode) %(objecttype) %(objectname)",
      records.commit,
      "--",
      `:(literal)${record.path}`,
    );
    const object = /^100644 blob ([a-f0-9]{40}|[a-f0-9]{64})$/u.exec(tree);
    if (
      !object ||
      hash(
        runGit(target, [...HOST_GIT_READ, "cat-file", "blob", object[1]], {
          encoding: null,
          trim: false,
        }),
      ) !== record.sha256
    )
      throw refuse(`recorded bytes differ: ${record.path}`);
  }
}

/** Resume only our exact partial record writes; unrelated changes stay protected. */
export function verifyPendingRecordChanges(target, records) {
  const expected = new Map(records.map((row) => [row.path, row.sha256]));
  const entries = porcelainEntries(
    runGitPathList(target, [
      ...HOST_GIT_READ,
      "status",
      "--porcelain=v1",
      "-z",
      "--untracked-files=all",
    ]),
  );
  for (const entry of entries) {
    const { status, path, origin } = entry,
      destination = targetRecordDestination(target, path);
    const stat = lstatSync(destination, { throwIfNoEntry: false });
    if (
      origin !== undefined ||
      !/^(?:[ AM]{2}|\?\?)$/u.test(status) ||
      !expected.has(path) ||
      !stat?.isFile() ||
      stat.mode & 0o111 ||
      hash(readFileSync(destination)) !== expected.get(path)
    )
      throw refuse(
        `pending operation has changed or unrelated input: ${porcelainEntryName(entry)}`,
      );
  }
}

export function commitTargetRecords(root, state, control) {
  if (state.phase !== "closed" || !state.targetSubject)
    throw refuse("a passing final review with targetSubject is required");
  const entry = targetWorktreeForOrder(root, state.workOrderId);
  const repository = loadConfig(root).repositories[state.repositoryId];
  const sources = targetRecordSources(
    root,
    state,
    eventsForOrder(control, state.workOrderId),
  );
  const pending = readTargetOperation(root, "records", state.workOrderId);
  const movedSources = (records) =>
    sources
      .filter((row) => row.kind !== "order")
      .map((row) => ({
        source: row.source,
        sha256: records.find((record) => record.path === row.path)?.sha256,
      }));
  if (state.targetRecords) {
    const observed = reviewedTargetSubject(root, state);
    if (observed.commit !== state.targetRecords.commit)
      throw refuse(
        `target commit ${observed.commit} differs from recorded records commit ${state.targetRecords.commit}`,
      );
    validateTargetRecordsCommit(
      entry.target,
      state.targetSubject,
      state.targetRecords,
      repository,
    );
    return {
      payload: state.targetRecords,
      already: true,
      moved: movedSources(state.targetRecords.records),
    };
  }
  if (
    state.documentationRoot &&
    state.documentationRoot !== repository.documentationRoot
  )
    throw refuse("registered documentation root differs from the activation");
  // The ordinary path checks cleanliness before inspecting destinations.
  const observed = pending ? undefined : reviewedTargetSubject(root, state);
  if (observed && observed.commit !== state.targetSubject.commit)
    throw refuse(
      `target commit ${observed.commit} differs from reviewed commit ${state.targetSubject.commit}`,
    );
  const rows = sources.map((row) => {
    const source = join(root, row.source);
    if (!containedRegularFile(source, root))
      throw refuse(`${row.source}: source is not a contained regular file`);
    const bytes = readFileSync(source),
      sha256 = hash(bytes);
    if (
      row.expectedHash !== undefined &&
      row.expectedHash !== `sha256:${sha256}`
    )
      throw refuse(`${row.source}: report hash differs from its recorded hash`);
    if (
      ["verification", "final-review"].includes(row.kind) &&
      !row.expectedHash
    )
      throw refuse(`${row.source}: report has no recorded hash`);
    const destination = targetRecordDestination(entry.target, row.path);
    const stat = lstatSync(destination, { throwIfNoEntry: false });
    if (stat && (!readFileSync(destination).equals(bytes) || stat.mode & 0o111))
      throw refuse(
        `${row.path}: destination already holds different bytes or mode`,
      );
    return { ...row, bytes, sha256, destination };
  });
  const binding = {
    repositoryId: state.repositoryId,
    branch: state.targetSubject.branch,
    parent: state.targetSubject.commit,
    root: repository.documentationRoot,
    records: rows.map(({ kind, path, sha256 }) => ({ kind, path, sha256 })),
  };
  if (
    pending &&
    (pending.target !== entry.target ||
      JSON.stringify(pending.binding) !== JSON.stringify(binding))
  )
    throw refuse(
      "pending records differ from the current review or source bytes",
    );
  const main = mainWorktree(root);
  if (
    checkLocalTerms(
      main,
      rows.map((row) => ({
        name: row.source,
        text: row.bytes.toString("utf8"),
      })),
    ).status !== "present"
  )
    throw refuse("local-terms list absent");
  for (const row of rows) {
    const [line] = privatePathLines(row.path, row.bytes.toString("utf8"));
    if (line !== undefined)
      throw refuse(
        `${row.path}:${line}: private absolute path; write a repository-relative path or a placeholder such as <home>/, <worktree>/ or <tmp>/`,
      );
  }
  // The kit's own fixed message is a target commit: identifiers would refuse,
  // and a review word an instance happens to list is the kit's word, not a
  // review item for the publish.
  const message = "docs: record reviewed change and validation";
  const lint = checkOutwardArtifact(main, {
    kind: "commit",
    text: message,
    target: true,
  });
  if (!["pass", "review"].includes(lint.status))
    throw refuse(
      `record commit outward lint ${lint.status}: ${lint.findings.map((row) => row.rule).join(", ")}`,
    );
  runGit(entry.target, [...HOST_GIT_READ, "var", "GIT_AUTHOR_IDENT"]);
  if (pending) verifyPendingRecordChanges(entry.target, binding.records);
  // Permit only byte-checked partial writes from the saved operation when
  // validating the registered root, branch and ancestry on a retry.
  const current = reviewedTargetSubject(root, state, {
    pendingRecordPaths: pending ? binding.records.map((row) => row.path) : [],
  });
  if (current.commit === binding.parent) {
    recordTargetOperation(root, "records", state.workOrderId, {
      target: entry.target,
      binding,
    });
    for (const row of rows) {
      mkdirSync(dirname(row.destination), { recursive: true });
      writeFileSync(row.destination, row.bytes);
    }
    runGit(entry.target, [
      ...HOST_GIT_READ,
      "add",
      "--",
      ...rows.map((row) => `:(literal)${row.path}`),
    ]);
    runGit(entry.target, [
      "-c",
      "core.hooksPath=/dev/null",
      "-c",
      "core.fsmonitor=false",
      "commit",
      "--allow-empty",
      "-qm",
      message,
    ]);
  } else if (!pending) {
    throw refuse(
      `target commit ${current.commit} differs from reviewed commit ${binding.parent}`,
    );
  } else {
    reviewedTargetSubject(root, state);
  }
  const payload = {
    ...binding,
    commit: runGit(entry.target, [...HOST_GIT_READ, "rev-parse", "HEAD"]),
  };
  validateTargetRecordsCommit(
    entry.target,
    state.targetSubject,
    payload,
    repository,
  );
  return { payload, moved: movedSources(payload.records) };
}

export function removeMovedTargetRecords(root, paths, workOrderId) {
  const present = [];
  // Check the complete removal set before deleting any remaining source.
  for (const { source, sha256 } of paths ?? []) {
    const path = join(root, source);
    if (!movedSourceStat(path)) continue;
    if (
      !containedRegularFile(path, root) ||
      hash(readFileSync(path)) !== sha256
    )
      throw refuse(
        `${source}: moved source differs from its recorded bytes; source retained. The target's records commit holds the recorded bytes: move the changed file out of the launchpad or restore those bytes, then rerun ${launchpadInvocation(root, "resume")} target-records <actor flags> to finish removing the moved sources`,
      );
    present.push(path);
  }
  for (const path of present) rmSync(path);
  forgetTargetOperation(root, "records", workOrderId);
}
