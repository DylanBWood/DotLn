import { createHash } from "node:crypto";
import {
  existsSync,
  accessSync,
  constants,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  realpathSync,
  rmSync,
  rmdirSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, isAbsolute, join, resolve } from "node:path";
import { docPath, loadConfig } from "./config.mjs";
import { containedRegularFile } from "./paths.mjs";
import {
  assertFinderMetadataTypes,
  isFinderMetadata,
} from "./finder-metadata.mjs";
import { readGateChecks } from "./gate-evidence.mjs";
import { HOST_GIT_READ, fetchRemoteBranch } from "./github-repository.mjs";
import {
  parseWorktrees,
  redactPaths,
  runGit,
  runGitPathList,
  selectGitPaths,
  releaseCloseCommand,
  spawnGit,
  worktreeHasCheckout,
} from "./git.mjs";
import {
  forgetTargetWorktree,
  physicalDirectory,
  removeOrderHostRules,
  targetWorktreeForOrder,
  validateOrderHostRules,
} from "./target-worktrees.mjs";
import {
  withWriterReservationLock,
  writerTeardownBlocker,
} from "../../packages/skeleton/src/writer-teardown.mjs";

const git = (root, args) => runGit(root, [...HOST_GIT_READ, ...args]);
const gitPaths = (root, args) =>
  runGitPathList(root, [...HOST_GIT_READ, ...args]);

// Git's own failure text can carry the tree's absolute path or its Git
// directory's (a linked worktree keeps that under the clone's .git). Name both,
// and any further paths the caller passes, by role and mask any other local
// absolute path before quoting it, through the redaction the starter refresh
// shares.
const quoteGitFailure = (error, root, label, extra = []) => {
  let gitDirectory = join(root, ".git");
  try {
    const pointer = /^gitdir: (.+)$/mu.exec(
      readFileSync(gitDirectory, "utf8"),
    )?.[1];
    if (pointer) gitDirectory = resolve(root, pointer);
  } catch {
    // A checkout whose .git is a directory keeps its Git directory there.
  }
  return redactPaths(String(error.message ?? error), [
    [gitDirectory, `<${label} Git directory>`],
    [root, `<${label}>`],
    ...extra,
  ]);
};

// A refusal names the tree by its role, never by its absolute path; the entry
// it quotes is relative to that tree. A failing Git read names the tree too.
// Each refusal ends with the close command to rerun.
const closeClean = (
  root,
  label,
  rerun,
  { ignored = new Set(), candidates } = {},
) => {
  let tracked;
  let untracked;
  try {
    tracked = git(root, ["status", "--porcelain", "--untracked-files=no"]);
    untracked =
      candidates ??
      gitPaths(root, ["ls-files", "-z", "--others", "--exclude-standard"]);
  } catch (error) {
    throw new Error(
      `${label} cannot close: ${quoteGitFailure(error, root, label)}; source retained. Fix what Git reports, then rerun ${rerun()}`,
    );
  }
  const foreign = untracked.filter(
    (file) => !isFinderMetadata(root, file) && !ignored.has(file),
  );
  if (tracked || foreign.length)
    throw new Error(
      `${label} is not clean (${tracked.split("\n")[0] || foreign[0]}); source retained. Clean it, then rerun ${rerun()}`,
    );
  return untracked;
};

// A path under a declared disposable root is regenerable output.
const underDisposable = (disposable, file) =>
  disposable.some((root) => file === root || file.startsWith(`${root}/`));

// Which of `paths` the ignore rules of one committed tree ignore: the tree's
// .gitignore blobs are laid out in a scratch repository and judged there, so
// the pre-fast-forward working copy's rules never decide.
const ignoredByTree = (clone, commit, paths) => {
  if (!paths.length) return new Set();
  const rules = selectGitPaths(
    clone,
    [...HOST_GIT_READ, "ls-tree", "-r", "--name-only", "-z", commit],
    (file) => file === ".gitignore" || file.endsWith("/.gitignore"),
  );
  const scratch = mkdtempSync(join(tmpdir(), "dotln-target-ignore-"));
  try {
    // Only committed ignore blobs supply policy: neither an init template's
    // info/exclude nor the operator's global excludes may authorize deletion.
    git(scratch, ["init", "--quiet", "--template="]);
    for (const file of rules) {
      mkdirSync(dirname(join(scratch, file)), { recursive: true });
      writeFileSync(
        join(scratch, file),
        runGit(clone, [...HOST_GIT_READ, "show", `${commit}:${file}`], {
          trim: false,
        }),
      );
    }
    const judged = spawnGit(
      [
        "-C",
        scratch,
        ...HOST_GIT_READ,
        "-c",
        "core.excludesFile=",
        "check-ignore",
        "--no-index",
        "-z",
        "--stdin",
      ],
      {
        input: `${paths.join("\0")}\0`,
        encoding: "utf8",
        // The output is a subset of the candidate paths; match the 16 MiB
        // ceiling of runGitPathList, which reads those candidates.
        maxBuffer: 16 * 1024 * 1024,
      },
    );
    if (judged.error || ![0, 1].includes(judged.status))
      throw new Error(
        `base ignore judgment unavailable: ${judged.error?.code ?? (judged.stderr.trim() || `git check-ignore exited ${judged.status}`)}`,
      );
    return new Set(judged.stdout.split("\0").filter(Boolean));
  } finally {
    rmSync(scratch, { recursive: true, force: true });
  }
};

// Delete the listed files and prune the directories they leave empty under
// each declared root; a root that still holds other files stays.
const deleteDisposable = (root, files, disposable) => {
  for (const file of files) {
    const path = join(root, file);
    const info = lstatSync(path, { throwIfNoEntry: false });
    if (!info) continue;
    // Git lists a nested repository under a declared root as one directory
    // entry; it is regenerable output like the rest and goes whole.
    if (info.isDirectory()) rmSync(path, { recursive: true, force: true });
    else unlinkSync(path);
  }
  const prune = (directory) => {
    const info = lstatSync(directory, { throwIfNoEntry: false });
    if (!info?.isDirectory() || info.isSymbolicLink()) return;
    for (const name of readdirSync(directory)) prune(join(directory, name));
    if (!readdirSync(directory).length) rmdirSync(directory);
  };
  for (const declared of disposable) prune(join(root, declared));
};
const disposableRows = (files, disposable) =>
  disposable
    .map((path) => ({
      path,
      files: files.filter((file) => underDisposable([path], file)).length,
    }))
    .filter((row) => row.files);

const inspectDisposable = (root, disposable, label, rerun, writable = true) => {
  const inspect = (directory) => {
    const info = lstatSync(directory, { throwIfNoEntry: false });
    if (!info?.isDirectory() || info.isSymbolicLink()) return;
    try {
      accessSync(
        directory,
        constants.R_OK | constants.X_OK | (writable ? constants.W_OK : 0),
      );
    } catch {
      throw new Error(
        `${label} cannot close: declared directory ${directory.slice(root.length + 1) || "."} needs ${writable ? "write, read and search" : "read and search"} access; source retained. Restore access, then rerun ${rerun()}`,
      );
    }
    for (const name of readdirSync(directory)) inspect(join(directory, name));
  };
  for (const declared of disposable) {
    let directory = root;
    for (const segment of declared.split("/")) {
      directory = join(directory, segment);
      const info = lstatSync(directory, { throwIfNoEntry: false });
      if (!info) break;
      if (
        info.isSymbolicLink() ||
        !realpathSync(directory).startsWith(`${root}/`)
      )
        throw new Error(
          `${label} cannot close: declared root ${declared} has a symlinked component; source retained. Correct the registration or path, then rerun ${rerun()}`,
        );
    }
    inspect(join(root, declared));
    if (writable && existsSync(join(root, declared))) {
      try {
        accessSync(
          dirname(join(root, declared)),
          constants.W_OK | constants.X_OK,
        );
      } catch {
        throw new Error(
          `${label} cannot close: parent of declared root ${declared} needs write and search access; source retained. Restore access, then rerun ${rerun()}`,
        );
      }
    }
  }
};

const removeFinderMetadata = (root, files) => {
  for (const file of files)
    if (isFinderMetadata(root, file)) unlinkSync(join(root, file));
};

// An entry counts as the base checkout only while its directory is this
// clone's checkout of the base branch. Otherwise, whatever is at the path (
// nothing, an empty directory, another repository, a link to another
// checkout) is out of reach, and the caller never moves the branch under the
// entry. A path that cannot be inspected refuses, so the close never moves a
// branch underneath files it cannot see.
const checkoutExists = (directory, branch, commonDirectory, rerun) => {
  try {
    return worktreeHasCheckout(directory, {
      commonDirectory,
      branch,
      gitArgs: HOST_GIT_READ,
    });
  } catch (error) {
    throw new Error(
      `target clone base ${branch} checkout cannot be inspected (${error.code ?? error.message}); source retained. Restore access to the worktree that holds ${branch}, which git worktree list names, then rerun ${rerun()}`,
    );
  }
};

/** Target teardown has no release ladder. Keep its receipt separate from the
 * launchpad cleanup, whose recovery paths belong to a different repository. */
export const closeTargetWorktree = async (
  root,
  state,
  dryRun,
  record,
  { retryMode = dryRun ? "--dry-run" : "--publish" } = {},
) => {
  validateOrderHostRules(root, state.workOrderId);
  const entry = targetWorktreeForOrder(root, state.workOrderId);
  if (!entry) {
    const prior = [...(record.recoveryAttempts ?? record.previousAttempts)]
      .reverse()
      .find(
        (attempt) => attempt.targetCleanup?.outcome === "removed",
      )?.targetCleanup;
    if (!prior) throw new Error("target worktree registry entry is missing");
    record.targetCleanup = prior;
    if (!dryRun) removeOrderHostRules(root, state.workOrderId);
    return;
  }
  if (
    entry.repositoryId !== state.repositoryId ||
    entry.baseCommit !== state.baseCommit
  )
    throw new Error("target registry differs from the merged order");
  physicalDirectory(entry.clone);
  // The registration's disposable paths (class first, never removed) and the
  // gate's advisory of what commands wrote into the clone's base checkout.
  const registration = loadConfig(root).repositories[state.repositoryId];
  const disposable = registration?.disposable ?? [];
  const baseDisposablePolicy = registration?.baseDisposablePolicy ?? "delete";
  // The order's launchpad worktree holds the gate index until the launchpad
  // cleanup that follows this close; main's copy is the fallback.
  let baseCheckoutWrites;
  try {
    const gateRows = readGateChecks(
      existsSync(entry.launchpad) ? entry.launchpad : root,
    ).filter(
      (gateRow) =>
        gateRow.repositoryId === state.repositoryId &&
        typeof gateRow.checkId === "string" &&
        gateRow.checkId.startsWith(`target:${state.repositoryId}:`),
    );
    baseCheckoutWrites = gateRows.some(
      (gateRow) => gateRow.baseCheckoutWrites === null,
    )
      ? null
      : [
          ...new Set(
            gateRows
              .filter(
                (gateRow) =>
                  gateRow.repositoryId === state.repositoryId &&
                  typeof gateRow.checkId === "string" &&
                  gateRow.checkId.startsWith(`target:${state.repositoryId}:`) &&
                  Array.isArray(gateRow.baseCheckoutWrites),
              )
              .flatMap((gateRow) => gateRow.baseCheckoutWrites),
          ),
        ].sort();
  } catch {
    // This observation is advisory. An unreadable record says nothing about
    // base writes; the actual checkout still undergoes every close judgment.
    baseCheckoutWrites = null;
  }
  const row = (record.targetCleanup = {
    path: entry.target,
    branch: entry.branch,
    outcome: "retained",
    finderMetadata: {},
    disposable: { target: [], base: [] },
    baseCheckoutWrites,
    baseDisposablePolicy,
  });
  const manifestPath = ".claude/target-worker-manifest.json";
  const targetId = createHash("sha256").update(entry.target).digest("hex");
  const lane = docPath(
    entry.runtimeRoot,
    "control",
    "local/harness/targets",
    targetId,
  );
  const requireReleasedBundleOwnership = () => {
    const exclude = resolve(
      entry.clone,
      git(entry.clone, ["rev-parse", "--git-path", "info/exclude"]),
    );
    const registryPath = docPath(
      entry.runtimeRoot,
      "control",
      "local/harness/excludes",
      `${createHash("sha256").update(exclude).digest("hex")}.json`,
    );
    let member = false;
    if (existsSync(registryPath)) {
      if (!containedRegularFile(registryPath, entry.runtimeRoot))
        throw new Error(
          "target exclude registry is not a contained regular file; source retained",
        );
      const registry = JSON.parse(readFileSync(registryPath, "utf8"));
      if (!registry.members || typeof registry.members !== "object")
        throw new Error(
          "target exclude ownership is unreadable; source retained",
        );
      member = Object.hasOwn(registry.members, targetId);
    }
    if (existsSync(join(lane, "installation.json")) || member)
      throw new Error(
        `target bundle manifest is missing while installation ownership remains; source retained. Restore the installed ${manifestPath} and its bundle files before rerunning ${releaseCloseCommand(root, state.workOrderId, retryMode)}`,
      );
  };
  if (!existsSync(entry.target)) requireReleasedBundleOwnership();
  const { checkTargetHarness, removeTargetHarness } =
    await import("./harness.mjs");
  const rerun = () => releaseCloseCommand(root, state.workOrderId, retryMode);
  const holders = parseWorktrees(entry.clone).filter(
    (item) => item.branch === `refs/heads/${entry.baseBranch}`,
  );
  const commonDirectory = resolve(
    entry.clone,
    git(entry.clone, ["rev-parse", "--git-common-dir"]),
  );
  const baseCheckout = holders.find((item) =>
    checkoutExists(item.worktree, entry.baseBranch, commonDirectory, rerun),
  )?.worktree;
  // With no checkout present, an entry whose checkout is gone, locked or not,
  // still holds the branch: Git's own `branch -f` and
  // `fetch origin <base>:<base>` refuse to move it, and a checkout restored or
  // remounted there would show the merged change staged as a deletion. The
  // close then completes only when the base needs no move.
  const staleHolder = baseCheckout ? undefined : holders[0];
  const mutationRoot = baseCheckout ?? entry.clone;
  const locked = (directory, label, operation) => {
    try {
      return withWriterReservationLock(directory, operation);
    } catch (error) {
      if (
        /writer registration.*(?:in progress|requires inspection)/u.test(
          error.message,
        )
      )
        throw new Error(
          `${label}: writer transition lock requires inspection; source retained. Confirm no registration or teardown is running, inspect the named lock through the writer diagnostics and remove only a proven abandoned lock, then rerun ${rerun()}`,
        );
      throw error;
    }
  };
  locked(mutationRoot, `target clone base ${entry.baseBranch}`, () => {
    const blocker = writerTeardownBlocker(mutationRoot);
    if (blocker)
      throw new Error(
        `target clone base ${entry.baseBranch}: ${blocker}; source retained. Release that writer, then rerun ${rerun()}`,
      );
    // Fetch objects before updating any ref, so a failed fetch or a divergent
    // local base cannot partially change the clone's references. The base
    // checkout is judged by the fetched tree's ignore rules, so the fetch
    // comes first; no ref moves until the judgment passes.
    let fetched;
    try {
      const urls = git(entry.clone, [
        "config",
        "--get-all",
        "remote.origin.url",
      ]).split("\n");
      if (urls.length !== 1 || !urls[0])
        throw new Error("origin must have one fetch URL");
      fetched = fetchRemoteBranch(entry.clone, urls[0], entry.baseBranch);
    } catch (error) {
      // A local-path origin is named by role too; it may share the clone's
      // path as a prefix, so it is listed as well and the longer one wins.
      const origin = runGit(
        entry.clone,
        [...HOST_GIT_READ, "remote", "get-url", "origin"],
        { onFailure: () => "" },
      );
      throw new Error(
        `target clone base ${entry.baseBranch} cannot close: fetch failed: ${redactPaths(
          error.message,
          [
            [isAbsolute(origin) ? origin : "", "<target origin>"],
            [entry.clone, "<target clone>"],
          ],
        )}; source retained. Fix the fetch, then rerun ${rerun()}`,
      );
    }
    let baseMetadata = [];
    let baseDisposable = [];
    if (baseCheckout) {
      const base = `target clone base ${entry.baseBranch}`;
      try {
        row.finderMetadata.base = assertFinderMetadataTypes(baseCheckout);
      } catch (error) {
        throw new Error(
          `${base} cannot close: ${error.message}. Then rerun ${rerun()}`,
        );
      }
      if (row.finderMetadata.base.skippedIgnoredDirectories.length)
        throw new Error(
          `${base} cannot close: cannot inspect ignored directories: ${row.finderMetadata.base.skippedIgnoredDirectories.join(", ")}; restore directory read and search access; source retained. Then rerun ${rerun()}`,
        );
      // Include paths ignored by the current checkout: only the fetched
      // tree decides which files are ignored, including files it stops
      // ignoring. An untracked file the fetched base ignores is judged like the
      // target's ignored material: under a declared disposable path it is
      // deleted; undeclared, it refuses with the registration remedy; a
      // file the fetched base does not ignore keeps the ordinary refusal.
      let ignored, candidates;
      try {
        candidates = gitPaths(baseCheckout, ["ls-files", "-z", "--others"]);
        ignored = ignoredByTree(entry.clone, fetched, candidates);
      } catch (error) {
        throw new Error(
          `${base} cannot close: ${quoteGitFailure(error, baseCheckout, base)}; source retained. Fix what Git reports, then rerun ${rerun()}`,
        );
      }
      // Name the actual ignored file; a tracked ancestor is never a remedy.
      const undeclared = [
        ...new Set(
          [...ignored].filter(
            (file) =>
              !underDisposable(disposable, file) &&
              !isFinderMetadata(baseCheckout, file),
          ),
        ),
      ].sort();
      if (undeclared.length)
        throw new Error(
          `${base} has undeclared ignored material; source retained: ${undeclared.slice(0, 20).join(", ")}${undeclared.length > 20 ? ` and ${undeclared.length - 20} more` : ""}. Declare it disposable in the registration or remove it; regenerable build output is deleted at close, never moved to scratch. Then rerun ${rerun()}`,
        );
      baseMetadata = closeClean(baseCheckout, base, rerun, {
        ignored,
        candidates,
      });
      baseDisposable = [...ignored].filter((file) =>
        underDisposable(disposable, file),
      );
      row.disposable.base = disposableRows(baseDisposable, disposable);
      if (baseDisposablePolicy === "judge-only" && candidates.length) {
        const originals = new Set(candidates),
          prefixes = new Set(candidates);
        for (const file of candidates) {
          const parts = file.split("/");
          while (parts.length > 1) {
            parts.pop();
            prefixes.add(parts.join("/"));
          }
        }
        const collisions = selectGitPaths(
          entry.clone,
          [...HOST_GIT_READ, "ls-tree", "-r", "--name-only", "-z", fetched],
          (file) => {
            if (prefixes.has(file)) return true;
            const parts = file.split("/");
            while (parts.length > 1) {
              parts.pop();
              if (originals.has(parts.join("/"))) return true;
            }
            return false;
          },
        );
        if (collisions.length)
          throw new Error(
            `${base} judge-only output collides with fetched tracked paths: ${collisions.slice(0, 20).join(", ")}; source retained. Preserve that output outside those paths, then rerun ${rerun()}`,
          );
      }
      inspectDisposable(
        baseCheckout,
        disposable,
        base,
        rerun,
        baseDisposablePolicy === "delete",
      );
    }
    const localBase = runGit(
      entry.clone,
      [
        ...HOST_GIT_READ,
        "rev-parse",
        "--verify",
        `refs/heads/${entry.baseBranch}`,
      ],
      { onFailure: () => null },
    );
    if (
      localBase &&
      spawnGit([
        "-C",
        entry.clone,
        ...HOST_GIT_READ,
        "merge-base",
        "--is-ancestor",
        localBase,
        fetched,
      ]).status !== 0
    )
      throw new Error(
        `target clone base ${entry.baseBranch} cannot fast-forward to fetched base ${fetched}; source retained. Reconcile the local ${entry.baseBranch} with origin/${entry.baseBranch}, then rerun ${rerun()}`,
      );
    if (staleHolder && localBase !== fetched) {
      const state = staleHolder.locked
        ? `locked${typeof staleHolder.locked === "string" ? `: ${staleHolder.locked}` : ""}`
        : staleHolder.prunable
          ? "prunable"
          : "its path holds another checkout";
      const clear = staleHolder.locked
        ? "clear the entry with git worktree unlock, then git worktree prune"
        : staleHolder.prunable
          ? "clear the entry with git worktree prune"
          : "move what sits at its path elsewhere, then clear the entry with git worktree prune";
      throw new Error(
        `target clone base ${entry.baseBranch} is held by a worktree entry whose checkout is gone (${state}), so the close cannot move it to the fetched base; source retained. Restore or remount that worktree and fast-forward it, or ${clear} (git worktree list names it), then rerun ${rerun()}`,
      );
    }
    // A stale ref lock makes these moves fail with Git's text, which names the
    // clone's Git directory; quote it by role.
    const moveRef = (cwd, args) => {
      try {
        git(cwd, args);
      } catch (error) {
        throw new Error(
          `target clone base ${entry.baseBranch} cannot close: ${quoteGitFailure(
            error,
            cwd,
            cwd === entry.clone
              ? "target clone"
              : `target clone base ${entry.baseBranch}`,
            [[commonDirectory, "<target clone Git directory>"]],
          )}; source retained. Fix what Git reports, then rerun ${rerun()}`,
        );
      }
    };
    moveRef(entry.clone, [
      "update-ref",
      `refs/remotes/origin/${entry.baseBranch}`,
      fetched,
    ]);
    // Containment is judged against the fetched base. The local base moves
    // only after the target worktree is judged, so a close refused on the
    // target leaves the base checkout, its output and its branch untouched.
    const moveBase = () => {
      if (baseCheckout) {
        if (baseDisposablePolicy === "delete") {
          removeFinderMetadata(baseCheckout, baseMetadata);
          deleteDisposable(baseCheckout, baseDisposable, disposable);
        }
        moveRef(baseCheckout, [
          "merge",
          "--ff-only",
          ...(baseDisposablePolicy === "judge-only"
            ? ["--no-overwrite-ignore"]
            : []),
          `origin/${entry.baseBranch}`,
        ]);
      } else if (localBase !== fetched)
        moveRef(entry.clone, [
          "fetch",
          "--no-tags",
          ".",
          `${fetched}:refs/heads/${entry.baseBranch}`,
        ]);
    };
    const containsBranch = () => {
      if (git(entry.clone, ["branch", "--list", entry.branch]))
        if (
          spawnGit([
            "-C",
            entry.clone,
            ...HOST_GIT_READ,
            "merge-base",
            "--is-ancestor",
            entry.branch,
            `origin/${entry.baseBranch}`,
          ]).status !== 0
        )
          throw new Error(
            `target branch ${entry.branch} is not merged into origin/${entry.baseBranch}; source retained. Merge the reviewed branch, then rerun ${rerun()}`,
          );
    };
    containsBranch();
    const registered = parseWorktrees(entry.clone).find(
      (item) => item.worktree === entry.target,
    );
    if (existsSync(entry.target)) {
      physicalDirectory(entry.target);
      if (registered?.branch !== `refs/heads/${entry.branch}`)
        throw new Error(
          `target worktree registration differs; source retained. Inspect git worktree list in the clone, then rerun ${rerun()}`,
        );
      locked(entry.target, "target worktree", () => {
        const blocker = writerTeardownBlocker(entry.target);
        if (blocker)
          throw new Error(
            `target worktree: ${blocker}; source retained. Release that writer, then rerun ${rerun()}`,
          );
        const writer = join(lane, "writer");
        if (
          existsSync(join(lane, "writer.json")) ||
          (existsSync(writer) &&
            (!lstatSync(writer).isDirectory() || readdirSync(writer).length))
        )
          throw new Error(
            `target writer reservation is not proven released; source retained. Release that writer, then rerun ${rerun()}`,
          );
        try {
          row.finderMetadata.target = assertFinderMetadataTypes(entry.target);
        } catch (error) {
          throw new Error(
            `target worktree cannot close: ${error.message}. Then rerun ${rerun()}`,
          );
        }
        const unreadableDisposable =
          row.finderMetadata.target.skippedIgnoredDirectories.filter(
            (directory) => underDisposable(disposable, directory),
          );
        if (unreadableDisposable.length)
          throw new Error(
            `target worktree cannot close: cannot inspect declared disposable directories: ${unreadableDisposable.join(", ")}; restore directory read and search access; source retained. Then rerun ${rerun()}`,
          );
        const metadata = closeClean(entry.target, "target worktree", rerun);
        containsBranch();
        const installed = existsSync(join(entry.target, manifestPath));
        if (!installed) requireReleasedBundleOwnership();
        if (installed)
          checkTargetHarness(entry.target, { runtimeRoot: entry.runtimeRoot });
        const owned = installed
          ? new Set([
              manifestPath,
              ...JSON.parse(
                readFileSync(join(entry.target, manifestPath), "utf8"),
              ).installed.map((file) => file.path),
            ])
          : new Set();
        const ignoredFiles = gitPaths(entry.target, [
          "ls-files",
          "-z",
          "--others",
          "--ignored",
          "--exclude-standard",
        ]);
        // Declared regenerable output is deleted before the judgment of what
        // remains; nothing bundle-owned is ever counted as disposable.
        const targetDisposable = ignoredFiles.filter(
          (file) => !owned.has(file) && underDisposable(disposable, file),
        );
        row.disposable.target = disposableRows(targetDisposable, disposable);
        const otherFiles = [
          ...ignoredFiles.filter(
            (file) =>
              !owned.has(file) &&
              !isFinderMetadata(entry.target, file) &&
              !underDisposable(disposable, file),
          ),
          ...row.finderMetadata.target.skippedIgnoredDirectories
            .filter((directory) => !underDisposable(disposable, directory))
            .map((directory) => `${directory}/`),
        ];
        const directories = gitPaths(entry.target, [
          "ls-files",
          "-z",
          "--others",
          "--ignored",
          "--exclude-standard",
          "--directory",
        ]).filter(
          (directory) =>
            directory.endsWith("/") &&
            otherFiles.some((file) => file.startsWith(directory)) &&
            ![...owned].some((file) => file.startsWith(directory)),
        );
        // A removal remedy must never name an ancestor of an installed file.
        // Keep each remaining path once, covered by its outermost safe directory.
        const other = [...new Set([...directories, ...otherFiles])]
          .filter(
            (file) =>
              !directories.some(
                (directory) => file !== directory && file.startsWith(directory),
              ),
          )
          .sort();
        if (other.length)
          throw new Error(
            `target has undeclared ignored material; source retained: ${other.join(", ")}. Declare it disposable in the registration or remove it; regenerable build output is deleted at close, never moved to scratch. Then rerun ${releaseCloseCommand(root, state.workOrderId, retryMode)}`,
          );
        inspectDisposable(entry.target, disposable, "target worktree", rerun);
        if (dryRun) return;
        // Declared output goes before the bundle, so a failure there retains
        // the bundle and a retry judges the same tree.
        removeFinderMetadata(entry.target, [...metadata, ...ignoredFiles]);
        deleteDisposable(entry.target, targetDisposable, disposable);
        if (installed)
          removeTargetHarness(entry.target, { runtimeRoot: entry.runtimeRoot });
        git(entry.clone, ["worktree", "remove", entry.target]);
        // The ref the opt-in draft route left in the clone goes with the
        // worktree.
        runGit(
          entry.clone,
          [
            ...HOST_GIT_READ,
            "update-ref",
            "-d",
            `refs/dotln/draft/${state.workOrderId}`,
          ],
          { onFailure: () => null },
        );
      });
    } else if (registered) {
      throw new Error(
        `target directory missing but still registered; source retained. Inspect git worktree list in the clone, then rerun ${rerun()}`,
      );
    }
    if (dryRun) {
      row.outcome = "would-remove";
      return;
    }
    moveBase();
    containsBranch();
    // Containment is proven against the declared base above. Git's ordinary
    // branch deletion checks HEAD, which may be detached at an older commit.
    if (git(entry.clone, ["branch", "--list", entry.branch]))
      git(entry.clone, ["branch", "-D", entry.branch]);
    // The literal-rule fallback's rules never outlive the order (WO-221).
    row.hostRules = removeOrderHostRules(root, state.workOrderId)
      ? "removed"
      : "none";
    if (existsSync(entry.launchpad))
      forgetTargetWorktree(entry.launchpad, entry.target);
    forgetTargetWorktree(root, entry.target);
    row.outcome = "removed";
  });
};
