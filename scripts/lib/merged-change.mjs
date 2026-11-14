// Whether an order branch's change is in a fetched base, read from Git alone
// (WO-276 Part M): by ancestry, by patch identity, or by a commit a person
// names. Git's patch identity ignores whitespace and line numbers, so it only
// finds the base commits that may carry the change: one counts where it is
// the branch's change exactly, file by file.
import { writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnGit } from "./git.mjs";
import { HOST_GIT_READ } from "./github-repository.mjs";
import { createScratchRoot, removeTemporaryPath } from "./temporary-roots.mjs";

const OID = /^(?:[0-9a-f]{40}|[0-9a-f]{64})$/u;
/** The most patch text one read takes. A base that holds more since the
 * branch left it is not judged by identity (`unread`). */
const READ_LIMIT = 256 * 1024 * 1024;

const gitRun = (clone, args, input, limit = READ_LIMIT) =>
  spawnGit(["-C", clone, ...HOST_GIT_READ, "--no-replace-objects", ...args], {
    encoding: "utf8",
    maxBuffer: limit,
    ...(input === undefined ? {} : { input }),
  });

/** A read whose output passed the limit: what Git printed is not whole.
 * It carries what the judgment had counted when it stopped. */
class Unread extends Error {
  constructor(message, seen) {
    super(message);
    this.seen = seen;
  }
}

/** One read of the clone's history, or a refusal that names Git's failure. */
const gitRead = (clone, args, input, limit, seen) => {
  const result = gitRun(clone, args, input, limit);
  if (result.error?.code === "ENOBUFS")
    throw new Unread(`git ${args[0]} printed more than the close reads`, seen);
  if (result.error || result.status !== 0)
    throw new Error(
      `git ${args[0]} failed while reading whether the change is merged: ${(result.stderr || "").trim().split("\n")[0] || result.error?.code || `exit ${result.status}`}`,
    );
  return result.stdout;
};

const lines = (text) => text.split("\n").filter(Boolean);

/** Whether `commit` is in the history of `of`. */
export const inHistory = (clone, commit, of) =>
  gitRun(clone, ["merge-base", "--is-ancestor", commit, of]).status === 0;

/** Whether the clone is a partial clone, where reading a patch can fetch
 * the blobs it lacks. A clone that does not answer is taken for one. */
export const partialClone = (clone) =>
  gitRun(clone, [
    "config",
    "--get-regexp",
    "^(extensions\\.partialclone|remote\\..*\\.promisor)$",
  ]).status !== 1;

/** The commit where the branch and the base diverged, or null where they
 * share no history (a base rewritten after the branch was cut). */
const forkOf = (clone, branch, base) => {
  const result = gitRun(clone, ["merge-base", branch, base]);
  const fork = result.status === 0 ? result.stdout.trim() : "";
  if (OID.test(fork)) return fork;
  if (result.status === 1) return null;
  throw new Error(
    `git merge-base failed while reading whether the change is merged: ${(result.stderr || "").trim().split("\n")[0] || `exit ${result.status}`}`,
  );
};

/** The patch identity of each patch in `patches`, as `git patch-id --stable`
 * reads them: a map from the commit a patch belongs to (or the zero id for a
 * patch with no commit line) to its identity. A commit whose patch is empty
 * has no identity and no entry. */
const patchIds = (clone, patches) => {
  const ids = new Map();
  if (!patches) return ids;
  for (const line of lines(gitRead(clone, ["patch-id", "--stable"], patches))) {
    const [patch, commit] = line.split(" ");
    if (patch && commit) ids.set(commit, patch);
  }
  return ids;
};

/** The files one change touches, each with the modes and blobs it joins:
 * the rows of a raw `diff-tree` of two trees, or of a commit against its
 * parent. */
const changedFiles = (clone, revisions) => {
  const fields = gitRead(clone, [
    "diff-tree",
    "-r",
    "--no-renames",
    "--no-commit-id",
    "-z",
    ...revisions,
  ]).split("\0");
  const files = new Map();
  for (let at = 0; at + 1 < fields.length; at += 2) {
    const [oldMode, newMode, oldBlob, newBlob] = fields[at].slice(1).split(" ");
    files.set(fields[at + 1], { oldMode, newMode, oldBlob, newBlob });
  }
  return files;
};

/** A blob's bytes, or null where Git does not give them whole. */
const blobBytes = (clone, id) => {
  const result = spawnGit(
    [
      "-C",
      clone,
      ...HOST_GIT_READ,
      "--no-replace-objects",
      "cat-file",
      "blob",
      id,
    ],
    { maxBuffer: READ_LIMIT },
  );
  return result.error || result.status !== 0 ? null : result.stdout;
};

/** Whether the change of a file from `from` to `to`, merged into `onto`,
 * gives exactly `result`: a clean three-way merge of the blobs, which is
 * what a squash or a replayed commit makes of a file the base had changed
 * since the branch left it. A blob that cannot be read is no match. */
const mergesTo = (clone, { onto, from, to, result }) => {
  const scratch = createScratchRoot(join(tmpdir(), "dotln-merged-change-"));
  try {
    const paths = [];
    for (const [name, id] of [
      ["onto", onto],
      ["from", from],
      ["to", to],
    ]) {
      const bytes = blobBytes(clone, id);
      if (bytes === null) return false;
      writeFileSync(join(scratch, name), bytes);
      paths.push(join(scratch, name));
    }
    const merged = spawnGit([...HOST_GIT_READ, "merge-file", "-p", ...paths], {
      maxBuffer: READ_LIMIT,
    });
    const landed = blobBytes(clone, result);
    return (
      !merged.error &&
      merged.status === 0 &&
      landed !== null &&
      merged.stdout.equals(landed)
    );
  } finally {
    removeTemporaryPath(scratch, { recursive: true, force: true });
  }
};

const REGULAR = new Set(["100644", "100755"]);

/**
 * Whether a base commit's change (`landed`) is the branch's change
 * (`ours`), exactly. They touch the same files, and for each file either
 * the base commit joins the same blobs under the same modes, or, where the
 * base had changed the file since the branch left it, the commit's result
 * is the branch's change merged cleanly into the base's file and nothing
 * else. Where a hunk sits is therefore part of the answer, and so is every
 * byte: the same edit made by someone else at another of several identical
 * places, or landed with other spacing or line endings, is another change.
 */
const sameChange = (clone, ours, landed) => {
  if (ours.size !== landed.size) return false;
  for (const [path, mine] of ours) {
    const theirs = landed.get(path);
    if (!theirs) return false;
    if (mine.oldBlob === theirs.oldBlob && mine.oldMode === theirs.oldMode) {
      if (mine.newBlob !== theirs.newBlob || mine.newMode !== theirs.newMode)
        return false;
      continue;
    }
    // The file differs where the change begins: only regular files merge.
    if (
      ![mine.oldMode, mine.newMode, theirs.oldMode, theirs.newMode].every(
        (mode) => REGULAR.has(mode),
      ) ||
      theirs.newMode !==
        (mine.newMode === mine.oldMode ? theirs.oldMode : mine.newMode) ||
      !mergesTo(clone, {
        onto: theirs.oldBlob,
        from: mine.oldBlob,
        to: mine.newBlob,
        result: theirs.newBlob,
      })
    )
      return false;
  }
  return true;
};

const judgePatches = (clone, branch, base, readLimit) => {
  if (inHistory(clone, branch, base))
    return { merged: true, by: "ancestor", commits: [], read: 0 };
  const none = { merged: false, by: null, commits: [], read: 0 };
  const fork = forkOf(clone, branch, base);
  if (!fork) return none;
  // Newest first in the order the base's history gives them, a commit never
  // before one it descends from: the rebase rule reads that order.
  const candidates = lines(
    gitRead(clone, [
      "rev-list",
      "--no-merges",
      "--topo-order",
      `${fork}..${base}`,
    ]),
  );
  if (!candidates.length) return none;
  const seen = { ...none, read: candidates.length };
  const inBase = patchIds(
    clone,
    gitRead(
      clone,
      ["diff-tree", "-p", "--stdin"],
      `${candidates.join("\n")}\n`,
      readLimit,
      seen,
    ),
  );
  // By identity, the base commits that carry it, oldest first, and each
  // base commit's place in the base, the oldest first.
  const holders = new Map();
  const place = new Map();
  for (const commit of [...candidates].reverse()) {
    place.set(commit, place.size);
    const patch = inBase.get(commit);
    if (patch) holders.set(patch, [...(holders.get(patch) ?? []), commit]);
  }
  // Of the commits with an identity that stand later in the base than
  // `after`, the first that is the change exactly.
  const holder = (identity, ours, after = -1) =>
    holders
      .get(identity)
      ?.find(
        (commit) =>
          place.get(commit) > after &&
          sameChange(clone, ours, changedFiles(clone, [commit])),
      );
  // A squash: the branch's whole change as one patch.
  const wholeIdentity = [
    ...patchIds(
      clone,
      gitRead(
        clone,
        ["diff-tree", "-p", fork, branch],
        undefined,
        readLimit,
        seen,
      ),
    ).values(),
  ][0];
  const squashed =
    wholeIdentity && holder(wholeIdentity, changedFiles(clone, [fork, branch]));
  if (squashed)
    return { ...seen, merged: true, by: "squash", commits: [squashed] };
  // A rebase: each of the branch's own commits, merges apart. A merge that
  // carries a change of its own (its result is neither side's) is replayed by
  // no commit, so a branch that holds one is not found this way.
  for (const merge of lines(
    gitRead(clone, ["rev-list", "--merges", `${fork}..${branch}`]),
  ))
    if (gitRead(clone, ["diff-tree", "--cc", "--no-commit-id", merge]).trim())
      return seen;
  // The branch's own commits, parents before children whatever their dates,
  // as the base's are read: the rule below compares the two orders.
  const own = lines(
    gitRead(clone, [
      "rev-list",
      "--no-merges",
      "--topo-order",
      "--reverse",
      `${fork}..${branch}`,
    ]),
  );
  if (!own.length) return seen;
  const onBranch = patchIds(
    clone,
    gitRead(
      clone,
      ["diff-tree", "-p", "--stdin"],
      `${own.join("\n")}\n`,
      readLimit,
      seen,
    ),
  );
  // A rebase replays the branch's commits in their order, one base commit
  // for each. So each commit takes a base commit later in the base than the
  // one the commit before it took, and no base commit answers for two: a
  // branch that makes a change, reverts it and makes it again holds two
  // commits with one change, and a base that replayed only the first of them
  // does not hold the branch's last change.
  const matched = [];
  let after = -1;
  for (const commit of own) {
    const patch = onBranch.get(commit);
    // A commit with an empty patch carries no change to find.
    if (!patch) continue;
    const replayed = holder(patch, changedFiles(clone, [commit]), after);
    if (!replayed) return seen;
    matched.push(replayed);
    after = place.get(replayed);
  }
  return matched.length
    ? { ...seen, merged: true, by: "rebase", commits: matched }
    : seen;
};

/** The judgment, with a patch read past the limit, the base's or the
 * branch's own, as its answer: nothing matched, and not all was read. */
const judge = (clone, branch, base, readLimit) => {
  try {
    return judgePatches(clone, branch, base, readLimit);
  } catch (error) {
    if (error instanceof Unread && error.seen)
      return { ...error.seen, unread: true };
    throw error;
  }
};

// What was found for a pair of commits holds for as long as they exist, so a
// close that asks at each of its sites reads the base's patches once.
const found = new Map();

/**
 * Whether the change of `branch` is in `base`, and by what:
 * - `ancestor`: the branch is an ancestor of the base (a merge commit, a
 *   fast-forward, or a branch with no change of its own);
 * - `squash`: one commit of the base since the two diverged whose patch
 *   identity equals that of the branch's whole change and whose change is
 *   that change exactly (`sameChange`);
 * - `rebase`: for each commit of the branch that is not itself a merge, in
 *   the branch's order, a commit of the base since they diverged that is
 *   that commit's change exactly and stands later in the base than the one
 *   the commit before it took, where no merge of the branch carries a change
 *   of its own. No base commit answers for two of the branch's.
 * `commits` names the base commits matched, and `read` counts the base
 * commits whose patches were read, which is what the check costs. A change
 * the base holds under another patch matches none of these (a squash edited
 * at merge or carrying other changes, a base that changed lines beside the
 * change after the branch was cut, a base rewritten since): `merged` is
 * false and the caller names its own route. `unread` is set where the base's
 * patches, or the branch's own, are more than one read takes (`readLimit` bytes; a case sets it).
 * @param {string} clone @param {string} branch @param {string} base
 * @param {{readLimit?: number}} [options]
 * @returns {{merged: boolean, by: "ancestor" | "squash" | "rebase" | null, commits: string[], read: number, unread?: true}}
 */
export function mergedChange(clone, branch, base, { readLimit } = {}) {
  const ids = [branch, base].map((name) =>
    (
      gitRun(clone, ["rev-parse", "--verify", "--quiet", `${name}^{commit}`])
        .stdout ?? ""
    ).trim(),
  );
  const key = ids.every((id) => OID.test(id))
    ? [clone, ...ids].join("\0")
    : null;
  const known = key ? found.get(key) : undefined;
  if (known) return structuredClone(known);
  const result = judge(clone, branch, base, readLimit);
  if (key && result.merged) found.set(key, result);
  return structuredClone(result);
}

/** The paths the branch's whole change touches, against the point where it
 * and the base diverged, or against `from` (the base commit an order
 * recorded) where they share no history. */
export function changePaths(clone, branch, base, { from } = {}) {
  const fork = forkOf(clone, branch, base) ?? from;
  if (!fork)
    throw new Error(
      `${branch} and ${base} share no history, and no recorded base says where the change began`,
    );
  return gitRead(clone, [
    "diff-tree",
    "-r",
    "--no-renames",
    "--name-only",
    "-z",
    fork,
    branch,
  ])
    .split("\0")
    .filter(Boolean);
}

/**
 * The commit a person names as carrying the branch's change where no
 * identity matches: it is a commit the clone holds under that id, it is in
 * the base, it came after the point where the branch left the base, and it
 * changes at least one path the branch's change touches. Each refusal names
 * the commit as it was given. The person naming it takes the judgment that
 * it carries the change; its subject is returned so that the close prints
 * what was named. No patch of the base is read.
 * @param {string} clone @param {string} branch @param {string} base
 * @param {string} named @param {{from?: string}} [recorded]
 * @returns {{commit: string, subject: string}}
 */
export function namedMerge(clone, branch, base, named, { from } = {}) {
  const resolved = gitRun(clone, [
    "rev-parse",
    "--verify",
    "--quiet",
    `${named}^{commit}`,
  ]);
  const commit = resolved.status === 0 ? resolved.stdout.trim() : "";
  // A word that is also a ref's name resolves to the ref: only an id counts.
  if (!OID.test(commit) || !commit.startsWith(named))
    throw new Error(`--merged-as ${named} names no commit this clone holds`);
  if (!inHistory(clone, commit, base))
    throw new Error(`--merged-as ${named} is not in ${base}`);
  const fork = forkOf(clone, branch, base);
  if (fork && inHistory(clone, commit, fork))
    throw new Error(
      `--merged-as ${named} is at or before the commit where ${branch} left ${base}, so it cannot carry the change`,
    );
  const touched = new Set(
    gitRead(clone, [
      "diff-tree",
      "-r",
      "-m",
      "--root",
      "--no-commit-id",
      "--no-renames",
      "--name-only",
      "-z",
      commit,
    ])
      .split("\0")
      .filter(Boolean),
  );
  if (
    !changePaths(clone, branch, base, { from }).some((path) =>
      touched.has(path),
    )
  )
    throw new Error(
      `--merged-as ${named} changes none of the paths the reviewed change touches`,
    );
  return {
    commit,
    subject: gitRead(clone, ["log", "-1", "--format=%s", commit]).trim(),
  };
}
