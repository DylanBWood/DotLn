#!/usr/bin/env node
import { pathToFileURL } from "node:url";
import {
  capturePendingReceipts,
  readPendingReceipts,
} from "./lib/siblings.mjs";
import { refreshHarnessRuntime } from "./lib/harness-runtime.mjs";
import { isKitRoot } from "../packages/skeleton/src/runtime-inputs.mjs";
import { checksPath } from "./lib/gate-evidence.mjs";
import {
  CONFIG_FILENAME,
  docPath,
  findLaunchpad,
  loadConfig,
} from "./lib/config.mjs";
import {
  copyFileSync,
  existsSync,
  lstatSync,
  mkdirSync,
  readFileSync,
  realpathSync,
} from "node:fs";
import { basename, dirname, join, relative, resolve, sep } from "node:path";

import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  absoluteBodyLinks,
  assertGitHubBodyProfile,
  assertPullRequestBodyShape,
  withTemporaryBody,
} from "./lib/github-body.mjs";
import {
  parseReleaseNotes,
  releaseNotesPathFor,
  targetReleaseNotesSource,
} from "./lib/release-notes.mjs";
import {
  ensureGh,
  executeGh,
  parseGitHubTarget,
  pushUrl,
  resolveGitHubPushTarget,
  HOST_GIT_READ,
} from "./lib/github-repository.mjs";
import {
  gitlinkPaths,
  ensureClean,
  shellQuote,
  mainWorktree,
  parseWorktrees,
  removeMergedBranch,
  releaseCloseCommand,
  runGit,
  runGitPathList,
  spawnGit,
} from "./lib/git.mjs";
import {
  containedRegularFile,
  describeIgnoredMaterial,
  workOrderAuthorityPath,
  isMainModule,
} from "./lib/paths.mjs";
import { statusProjection, refreshControlProjection } from "./resume.mjs";
import { carryPendingOverrides } from "./lib/pending-overrides.mjs";
import { readControl } from "./lib/control-store.mjs";
import { constellation, prepareBeaconDisposal } from "./lib/beacons.mjs";
import {
  recordWorktreeRemoval,
  restoreOwnedDirectoryWrites,
} from "./lib/worktree-removal.mjs";
import { contributionSignoffRules } from "./lib/contributions.mjs";
import {
  reviewedProductGate,
  reviewedLaunchpadIdentity,
  productGateBody,
} from "./lib/release-records.mjs";
import {
  inventoryMaterial,
  parseMaterialFlags,
  removeScratchRepositories,
} from "./lib/worktree-material.mjs";
import { scratchMaterial } from "./lib/intake-reconciliation.mjs";
import { parseRepositoryDeclaration } from "./lib/work-order-repository.mjs";
import { takeConfirmTerms } from "./lib/confirm-terms.mjs";
import { umbrellaRecord } from "./lib/dependencies.mjs";
import {
  recordRepositoryClone,
  recordTargetWorktree,
  targetStartPlan,
  physicalDirectory,
  readTargetStart,
  recordTargetStart,
  forgetTargetStart,
  launchpadInvocation,
  orderHostRules,
  removeOrderHostRules,
  targetWorktreeForOrder,
  writeOrderHostRules,
  validateOrderHostRules,
} from "./lib/target-worktrees.mjs";

/** The order's reviewed release notes at HEAD: present, a contained regular
 * file, parsed as the five-section edition and laid out for the forge. */
const requireReleaseNotes = (subject, workOrderId) => {
  const releaseNotesPath = releaseNotesPathFor(workOrderId, subject);
  const releaseNotesFile = resolve(subject, releaseNotesPath);
  if (!existsSync(releaseNotesFile))
    throw new Error(`${releaseNotesPath}: release-notes file is missing`);
  if (!lstatSync(releaseNotesFile).isFile())
    throw new Error(
      `${releaseNotesPath}: release-notes path is not a regular file`,
    );
  if (
    !realpathSync(releaseNotesFile).startsWith(`${realpathSync(subject)}${sep}`)
  )
    throw new Error(
      `${releaseNotesPath}: release-notes file escapes its repository`,
    );
  const releaseNotes = readTrackedTextAtHead(
    subject,
    releaseNotesPath,
    releaseNotesPath,
  );
  parseReleaseNotes(releaseNotes, releaseNotesPath);
  assertGitHubBodyProfile(releaseNotes, releaseNotesPath);
  return releaseNotes;
};
// Scratch repositories leave once every preserved byte is proven and just
// before the worktree itself; each removal is printed as it lands, with its
// head commit and whether a remote held it, for the close record.
const removeScratch = (path, receipt) => {
  removeScratchRepositories(path, scratchMaterial(receipt), {
    prepare: (directory) => restoreOwnedDirectoryWrites(directory),
    onRemoved: (row) =>
      process.stdout.write(`Scratch removal: ${JSON.stringify(row)}\n`),
  });
};
// Git removes a worktree whose index holds a submodule only with --force,
// which would discard the submodule's unpushed commits. Refuse before any
// scratch repository leaves, so that "source retained" is the whole truth.
const refuseSubmoduleWorktree = (subject) => {
  const submodules = gitlinkPaths(
    runGitPathList(subject, ["ls-files", "-z", "--stage"]),
  );
  if (submodules.length)
    throw new Error(
      `Worktree holds a submodule (${submodules.join(", ")}); Git removes it only with --force, which would discard its unpushed commits; source retained. Push the submodule's commits, then remove this worktree from an operator terminal with git worktree remove --force ${shellQuote(subject)} and retry`,
    );
};

const toolRoot = findLaunchpad();
const readTrackedTextAtHead = (root, path, displayPath) => {
  const tree = spawnGit(
    [
      "-C",
      root,
      ...HOST_GIT_READ,
      "ls-tree",
      "-z",
      "--format=%(objectmode) %(objecttype) %(objectname)",
      "HEAD",
      "--",
      `:(literal)${path}`,
    ],
    { encoding: "utf8" },
  );
  const tracked = /^100(?:644|755) blob ([0-9a-f]{40}|[0-9a-f]{64})\0$/u.exec(
    tree.stdout,
  );
  if (tree.status !== 0 || !tracked)
    throw new Error(`${displayPath}: file is not tracked as a regular file`);
  const object = tracked[1];
  const blob = spawnGit([
    "-C",
    root,
    ...HOST_GIT_READ,
    "cat-file",
    "blob",
    object,
  ]);
  if (blob.status !== 0)
    throw new Error(`${displayPath}: committed file cannot be read`);
  try {
    return new TextDecoder("utf-8", { fatal: true, ignoreBOM: true }).decode(
      blob.stdout,
    );
  } catch {
    throw new Error(`${displayPath}: committed file is not valid UTF-8`);
  }
};
// Every blocker is reported at once with its lane and that lane's remedy, so
// clearing N entries costs one run, not N. Only disposable material may leave;
// a scratch repository is disposable and was removed by the reconciliation.
const ensureNoIgnoredMaterial = (
  path,
  receipt = { files: [], nestedRepositories: [] },
) => {
  const reconciled = new Set([
    ...receipt.files.map((row) => row.source),
    ...(receipt.nestedRepositories ?? []).map((row) => `${row.source}/`),
  ]);
  // The unchanged gate store still owns its canonical cache when an instance
  // moves the control root. Only its index and addressed history are derived;
  // other ignored files retain the ordinary preservation/refusal rule.
  const gateIndex = relative(path, checksPath(path));
  const gateHistory = `${dirname(gateIndex)}/check-history/`;
  const gateCache = (entry) =>
    entry.kind === "file" &&
    containedRegularFile(join(path, entry.path), path) &&
    (entry.path === gateIndex ||
      (entry.path.startsWith(gateHistory) &&
        /^(?:[a-f0-9]{40}|[a-f0-9]{64}|legacy)\.json$/u.test(
          entry.path.slice(gateHistory.length),
        )));
  const blockers = runGitPathList(path, [
    "ls-files",
    "-z",
    "--others",
    "--ignored",
    "--exclude-standard",
  ])
    .filter((candidate) => !reconciled.has(candidate))
    .map((candidate) => describeIgnoredMaterial(path, candidate))
    .filter((entry) => !entry.disposable && !gateCache(entry));
  if (blockers.length > 0)
    throw new Error(
      `worktree contains ignored material and will not be removed (${blockers.length} ${blockers.length === 1 ? "entry" : "entries"}; only scratch repositories are removed):\n${blockers
        .map(
          (entry) =>
            `  ${entry.path}: ${entry.classification}; ${entry.remedy}`,
        )
        .join("\n")}`,
    );
};
// An inventoried nested repository is never dirt in a worktree about to go: a
// scratch one leaves with a record and a preserved one is byte-proven before
// removal. Main keeps every repository it holds, so only its protected intake
// units are excused there.
const ensureMaterialClean = (root, material, { leaving = true } = {}) => {
  const protectedUnits = new Set(
    material
      .filter(
        (row) =>
          leaving || (row.lane === "intake" && row.disposition === "preserve"),
      )
      .map((row) => `${row.path}/`),
  );
  if (!protectedUnits.size) return ensureClean(root);
  const tracked = runGit(root, [
    "status",
    "--porcelain",
    "--untracked-files=no",
  ]);
  const untracked = runGitPathList(root, [
    "ls-files",
    "-z",
    "--others",
    "--exclude-standard",
  ]).filter((path) => !protectedUnits.has(path));
  if (tracked || untracked.length)
    throw new Error(
      `working tree is not clean: ${root} (${tracked.split("\n")[0] || untracked[0]})`,
    );
};
const removePreservedWorktree = (
  mainPath,
  subject,
  material,
  reconciliation,
) => {
  // Git sees a re-included intake repository, and any preserved repository no
  // ignore rule covers, as untracked. Only these byte-proven units may require
  // --force: each was archived and verified just before this call, and every
  // scratch repository has already left. Writer/gate and dirt checks still
  // hold under the reservation lock.
  const units = new Set(
    material
      .filter((row) => row.disposition === "preserve")
      .map((row) => `${row.path}/`),
  );
  const untracked = runGitPathList(subject, [
    "ls-files",
    "-z",
    "--others",
    "--exclude-standard",
  ]);
  if (untracked.some((path) => !units.has(path)))
    throw new Error("Unpreserved untracked material; source retained");
  refuseSubmoduleWorktree(subject);
  const receipt = recordWorktreeRemoval(mainPath, subject, reconciliation);
  process.stdout.write(
    `Worktree removal proof: ${JSON.stringify({ subject, receipt })}\n`,
  );
  const restoreWrites = restoreOwnedDirectoryWrites(subject);
  try {
    runGit(mainPath, [
      "worktree",
      "remove",
      ...(untracked.length ? ["--force"] : []),
      subject,
    ]);
    if (existsSync(subject))
      throw new Error(`Subject directory remains: ${subject}`);
  } catch (error) {
    // Git can unregister a worktree before its filesystem removal fails.
    // The release helper recovers it under the retained proof in this run or
    // a retry. Do not report removal or delete the branch here.
    restoreWrites();
    throw error;
  }
};
// Derived worktrees: measurement siblings and temporary subjects that name the
// closing order (WO-044). A detached derivative that is clean and idle has its
// non-disposable control and intake material preserved like the subject's and
// is then removed; a missing directory is pruned; anything else is reported
// with its blocker and the exact command. Only scratch repositories are
// removed; other ignored bytes stay.
const derivedWorktree = (path, suffix) =>
  path
    .split(sep)
    .some((part) =>
      new RegExp(`(?:^|[^0-9a-z])wo${suffix}(?![0-9])`, "i").test(part),
    );
const reconcileDerivedWorktrees = (
  mainPath,
  workOrderId,
  {
    dryRun,
    listMaterial = false,
    reconcileWorktreeMaterial,
    renderIntakeReconciliation,
    verifyPreservedMaterial,
    activeGateRuns,
    withWriterReservationLock,
    writerTeardownBlocker,
    overrides = [],
    overrideWorktree = null,
  },
) => {
  const suffix = workOrderId.slice(workOrderId.indexOf("-") + 1);
  const lines = [];
  let pruned = false;
  for (const item of parseWorktrees(mainPath)) {
    if (typeof item.worktree !== "string") continue;
    const path = resolve(item.worktree);
    if (path === mainPath || !derivedWorktree(path, suffix)) continue;
    if (!existsSync(path) || item.prunable) {
      if (!dryRun && !pruned) {
        runGit(mainPath, ["worktree", "prune"]);
        pruned = true;
      }
      lines.push(
        `Derived worktree ${path}: ${dryRun ? "would prune" : "pruned"} (directory missing)`,
      );
      continue;
    }
    if (item.detached !== true) {
      lines.push(
        `Derived worktree ${path}: kept (checked out on ${String(item.branch ?? "a branch").replace(/^refs\/heads\//, "")}, not a detached derivative)`,
      );
      continue;
    }
    const blockers = [];
    const writerBlocker = writerTeardownBlocker(path);
    if (writerBlocker) blockers.push(writerBlocker);
    let material;
    try {
      material = inventoryMaterial(path, { overrides, overrideWorktree });
    } catch (error) {
      lines.push(`Derived worktree ${path}: kept (${error.message})`);
      continue;
    }
    try {
      ensureMaterialClean(path, material);
    } catch {
      blockers.push("uncommitted changes");
    }
    if (activeGateRuns(path).length > 0) blockers.push("active gate run");
    let receipt = null;
    if (!blockers.length)
      try {
        receipt = reconcileWorktreeMaterial(path, mainPath, workOrderId, {
          dryRun: true,
          material,
        });
        ensureNoIgnoredMaterial(path, receipt);
      } catch (error) {
        blockers.push(error.message);
      }
    if (blockers.length) {
      // Dirt is the operator's to settle: nothing here commits, stashes or
      // discards their changes.
      const operator = blockers.includes("uncommitted changes")
        ? `operator: commit, stash or discard the changes in ${shellQuote(path)} from an operator terminal, then `
        : "";
      lines.push(
        `Derived worktree ${path}: kept (${blockers.join("; ")}); ${operator}retry with node ${shellQuote(join(mainPath, "scripts/worktree.mjs"))} settle ${workOrderId}`,
      );
      continue;
    }
    if (!dryRun) {
      try {
        withWriterReservationLock(path, () => {
          const writer = writerTeardownBlocker(path);
          if (writer) throw new Error(writer);
          // Inventoried again under the lock, so a repository that appeared
          // since the preview is removed with a record, never silently.
          const locked = inventoryMaterial(path, {
            overrides,
            overrideWorktree,
          });
          ensureMaterialClean(path, locked);
          if (activeGateRuns(path).length) throw new Error("active gate run");
          const preserved = reconcileWorktreeMaterial(
            path,
            mainPath,
            workOrderId,
            { material: locked },
          );
          process.stdout.write(
            renderIntakeReconciliation(preserved, { listMaterial }),
          );
          ensureNoIgnoredMaterial(path, preserved);
          verifyPreservedMaterial(path, mainPath, preserved);
          refuseSubmoduleWorktree(path);
          removeScratch(path, preserved);
          const restoreBeaconPermissions = prepareBeaconDisposal(path);
          try {
            removePreservedWorktree(mainPath, path, locked, preserved);
          } catch (error) {
            restoreBeaconPermissions();
            throw error;
          }
        });
      } catch (error) {
        lines.push(`Derived worktree ${path}: kept (${error.message})`);
        continue;
      }
    }
    lines.push(
      `Derived worktree ${path}: ${dryRun ? "would remove" : "removed"} (detached, clean, idle; ${receipt.files.length} preserved files, disposable material only)`,
    );
  }
  return lines;
};
// The private local-terms list is ignored by Git, so a new worktree starts
// without one. The main checkout's list is carried into the order worktree
// when it has one; otherwise the session registers its own.
const carryLocalTerms = (mainPath, target) => {
  const source = docPath(mainPath, "control", "local/terms.txt");
  const destination = docPath(target, "control", "local/terms.txt");
  if (existsSync(destination)) return;
  if (!existsSync(source) || !lstatSync(source).isFile()) {
    process.stdout.write(
      `No local-terms list at ${mainPath}; register ${relative(target, destination)} in the new worktree before its first outward check.\n`,
    );
    return;
  }
  mkdirSync(dirname(destination), { recursive: true });
  copyFileSync(source, destination);
  process.stdout.write(`Carried the local-terms list into ${target}.\n`);
};
const carrySiblingReceipts = async (mainPath, target, pending) => {
  if (!pending.length) return;
  const { carryPendingReceipts } = await import("./siblings.mjs");
  const carried = carryPendingReceipts(mainPath, target, pending);
  process.stdout.write(`Carried sibling receipts: ${carried.join(", ")}.\n`);
};

// A registry failure preserves the new worktree. The printed recovery invokes
// the same finish sequence with the branch, base and authority bound to the
// initial creation, rather than creating a second branch or discarding files.
export async function completeSelfStart(
  mainPath,
  target,
  branch,
  base,
  workOrderId,
  workOrderPath,
  authorityHash,
  siblingReceipts,
) {
  physicalDirectory(mainPath);
  if (
    runGit(mainPath, ["rev-parse", "--show-toplevel"]) !== mainPath ||
    mainWorktree(mainPath) !== mainPath ||
    runGit(mainPath, ["symbolic-ref", "--short", "HEAD"]) !== "main"
  )
    throw new Error("preserved start main identity differs");
  const registered = parseWorktrees(mainPath).find(
    (row) => row.worktree === target,
  );
  physicalDirectory(target);
  if (
    registered?.branch !== `refs/heads/${branch}` ||
    runGit(target, ["rev-parse", "--show-toplevel"]) !== target ||
    runGit(target, ["rev-parse", "HEAD"]) !== base ||
    runGit(target, ["symbolic-ref", "--short", "HEAD"]) !== branch
  )
    throw new Error(
      "preserved start worktree differs from its creation identity",
    );
  if (
    createHash("sha256")
      .update(
        readFileSync(
          workOrderAuthorityPath(target, workOrderId, workOrderPath),
        ),
      )
      .digest("hex") !== authorityHash
  )
    throw new Error("preserved start authority differs");
  await carrySiblingReceipts(mainPath, target, siblingReceipts);
  carryLocalTerms(mainPath, target);
  carryPendingOverrides(mainPath, target, refreshControlProjection);
  const state = readControl(target).orders.get(workOrderId)?.state;
  let output = "";
  if (!state || ["closed", "withdrawn"].includes(state.phase)) {
    const activated = spawnSync(
      process.execPath,
      [
        join(target, "scripts/resume.mjs"),
        "activate",
        workOrderId,
        workOrderPath,
      ],
      {
        cwd: target,
        encoding: "utf8",
        env: { ...process.env, DOTLN_LAUNCHPAD: target },
      },
    );
    if (activated.status !== 0)
      throw new Error(
        `resume activation failed: ${(activated.stderr || activated.stdout).trim()}`,
      );
    output = activated.stdout;
  } else if (state.phase !== "active" || state.workOrderPath !== workOrderPath)
    throw new Error("preserved start activation differs");
  const bootstrap = join(target, "scripts/bootstrap.mjs");
  if (existsSync(bootstrap)) {
    const prepared = spawnSync(process.execPath, [bootstrap], {
      cwd: target,
      stdio: "inherit",
      env: { ...process.env, DOTLN_LAUNCHPAD: target },
    });
    if (prepared.status !== 0) throw new Error("worktree preparation failed");
  }
  return output;
}

// Executor sessions start in the launchpad, where lifecycle and role skills
// live. Codex adds the target directory; Claude's executor grant resolves it
// from the registry. Copilot takes the publication tools for the session.
// Under the registration's literal fallback the order's exact rules are also
// written to the main checkout's local settings and its Codex rules file;
// release close removes them.
const hostLaunchLines = (mainPath, entry, repository) => {
  let selector;
  try {
    selector = parseGitHubTarget(pushUrl(entry.target)).selector;
  } catch {
    // Editing the registered target does not require a publication origin.
  }
  const copilotRules = selector
    ? orderHostRules(mainPath, entry, selector)
        .copilot.map((rule) => `--allow-tool ${shellQuote(rule)}`)
        .join(" ")
    : "";
  const lines = [
    "Host launch lines for this target order:",
    `  Codex workspace-write session: cd ${shellQuote(entry.launchpad)} && codex --add-dir ${shellQuote(entry.target)}`,
    `  Copilot default mode: cd ${shellQuote(entry.launchpad)} && copilot${copilotRules ? ` ${copilotRules}` : ""}`,
    `  Claude Code: cd ${shellQuote(entry.launchpad)} && claude; enter: resume: next. The executor's target-worktree grant admits ${shellQuote(entry.target)} for this order while active or repairing;${selector ? " the hook admits the registered publication commands at verified and closed;" : ""} host deny and ask rules still apply.`,
  ];
  if (!selector)
    lines.push(
      "  Publication host rules: unavailable; the target's origin is not one GitHub push URL.",
    );
  if (selector && repository.hostRules === "literal") {
    const written = writeOrderHostRules(mainPath, entry, selector);
    lines.push(
      `  Literal rules written for ${entry.workOrderId}: ${written.settings} (Claude Code local settings) and ${written.codex} (Codex rules); release close removes them.`,
    );
  }
  return `${lines.join("\n")}\n`;
};

// A retained start receipt owns only the exact pair it preflighted. Retrying
// resumes preparation; it never adopts a different directory or resets a branch.
const signoffAdvisory = (root) => {
  if (!loadConfig(root).contributions?.operatorAuthor)
    process.stdout.write(
      "Advisory: every commit on this branch needs a Signed-off-by trailer matching its author (DCO 1.1), or declare that identity as contributions.operatorAuthor in dotln.config.json through a reviewed change.\n",
    );
};

const startTargetWorktree = async (mainPath, entry) => {
  const {
    target,
    clone,
    branch,
    baseCommit,
    launchpad,
    launchpadBase,
    workOrderId,
    workOrderPath,
  } = entry;
  const ensureWorktree = (root, directory, base) => {
    const worktrees = parseWorktrees(root);
    const registered = worktrees.find((item) => item.worktree === directory);
    if (existsSync(directory)) {
      physicalDirectory(directory);
      if (
        registered?.branch !== `refs/heads/${branch}` ||
        runGit(directory, ["rev-parse", "--show-toplevel"]) !== directory ||
        runGit(directory, ["symbolic-ref", "--short", "HEAD"]) !== branch
      )
        throw new Error(
          "pending start worktree identity differs; source retained",
        );
      runGit(directory, ["merge-base", "--is-ancestor", base, "HEAD"]);
      return;
    }
    if (
      registered ||
      worktrees.some((item) => item.branch === `refs/heads/${branch}`)
    )
      throw new Error(
        "pending start has a missing or differently registered worktree; source retained",
      );
    const existing = runGit(root, ["branch", "--list", branch]);
    if (existing) {
      if (runGit(root, ["rev-parse", branch]) !== base)
        throw new Error(
          "pending start branch differs from its base; source retained",
        );
      runGit(root, ["worktree", "add", directory, branch]);
    } else runGit(root, ["worktree", "add", "-b", branch, directory, base]);
  };
  try {
    if (
      loadConfig(mainPath).repositories[entry.repositoryId]?.hostRules ===
      "literal"
    )
      validateOrderHostRules(mainPath, workOrderId, { creating: true });
    ensureWorktree(clone, target, baseCommit);
    ensureWorktree(mainPath, launchpad, launchpadBase);
    signoffAdvisory(launchpad);
    const source = readFileSync(
      workOrderAuthorityPath(launchpad, workOrderId, workOrderPath),
      "utf8",
    );
    if (
      createHash("sha256").update(source).digest("hex") !== entry.authorityHash
    )
      throw new Error("pending start authority differs; source retained");
    await carrySiblingReceipts(
      mainPath,
      launchpad,
      entry.siblingReceipts ?? capturePendingReceipts(mainPath),
    );
    carryLocalTerms(mainPath, launchpad);
    carryPendingOverrides(mainPath, launchpad, refreshControlProjection);
    const state = readControl(launchpad).orders.get(workOrderId)?.state;
    if (!state || ["closed", "withdrawn"].includes(state.phase)) {
      const activated = spawnSync(
        process.execPath,
        [
          join(launchpad, "scripts/resume.mjs"),
          "activate",
          workOrderId,
          workOrderPath,
        ],
        {
          cwd: launchpad,
          encoding: "utf8",
          env: { ...process.env, DOTLN_LAUNCHPAD: launchpad },
        },
      );
      if (activated.status !== 0)
        throw new Error(
          `resume activation failed: ${(activated.stderr || activated.stdout).trim()}`,
        );
    } else if (
      state.phase !== "active" ||
      state.repositoryId !== entry.repositoryId ||
      state.baseCommit !== baseCommit
    ) {
      throw new Error("pending start activation differs; source retained");
    }
    const bootstrap = join(launchpad, "scripts/bootstrap.mjs");
    if (existsSync(bootstrap)) {
      const prepared = spawnSync(process.execPath, [bootstrap], {
        cwd: launchpad,
        stdio: "inherit",
        env: { ...process.env, DOTLN_LAUNCHPAD: launchpad },
      });
      if (prepared.status !== 0)
        throw new Error("launchpad preparation failed");
    }
    const { emitTargetHarness, checkTargetHarness } =
      await import("./lib/harness.mjs");
    const options = { runtimeRoot: mainPath };
    emitTargetHarness(target, options);
    checkTargetHarness(target, options);
    recordTargetWorktree(mainPath, entry);
    recordTargetWorktree(launchpad, entry);
    const repository = loadConfig(mainPath).repositories[entry.repositoryId];
    const launchLines = hostLaunchLines(mainPath, entry, repository);
    forgetTargetStart(mainPath, workOrderId);
    process.stdout.write(
      `Target worktree ${target} on ${branch}.\nAuthority profile: ${JSON.stringify(repository.authorityProfile)}\nTarget status: ${launchpadInvocation(launchpad, "resume")} status\nCreated ${launchpad} on ${branch}.\nActivated ${workOrderId}.\nPhase: active.\n${launchLines}Next (run manually):\n  cd ${shellQuote(launchpad)}\n  codex --add-dir ${shellQuote(target)}\n  enter: resume: next\n`,
    );
  } catch (error) {
    throw new Error(
      `${error.message}. Target start is preserved; correct the reported condition and retry from ${mainPath}: node ${shellQuote(join(mainPath, "scripts/worktree.mjs"))} start ${workOrderId} ${shellQuote(workOrderPath)}`,
    );
  }
};

const main = async () => {
  const [action, workOrderId, ...actionArgs] = process.argv.slice(2);
  if (action === "integrate") {
    const { integrateWorktree } =
      await import("./lib/worktree-integration.mjs");
    const result = await integrateWorktree(
      resolve(process.cwd()),
      workOrderId,
      actionArgs,
    );
    if (!result.complete) process.exitCode = 1;
    return;
  }
  const repoRoot = ["finish", "settle"].includes(action)
    ? resolve(process.cwd())
    : toolRoot;
  if (action === "host-rules") {
    // The drift remedies `harness check` prints: remove the rules of an order
    // that no longer has a target worktree, or rewrite an order's rules from
    // its committed registration after a hand edit. Validate the rewrite
    // before removing any existing rule; removal remains a recovery route.
    const [mode, order] = [workOrderId, actionArgs[0]];
    const main = mainWorktree(toolRoot);
    if (
      !["--remove", "--rewrite"].includes(mode) ||
      !/^WO-\d{3}$/u.test(order ?? "") ||
      actionArgs.length !== 1
    )
      throw new Error(
        "usage: worktree host-rules --remove WO-NNN | worktree host-rules --rewrite WO-NNN",
      );
    if (mode === "--remove") {
      const removed = removeOrderHostRules(main, order);
      process.stdout.write(
        removed
          ? `Removed the literal host rules of ${order}.\n`
          : `No literal host rules are recorded for ${order}.\n`,
      );
      return;
    }
    const entry = targetWorktreeForOrder(main, order);
    if (!entry) throw new Error(`${order} has no registered target worktree`);
    const committed = readTrackedTextAtHead(
      main,
      CONFIG_FILENAME,
      CONFIG_FILENAME,
    );
    if (
      !containedRegularFile(join(main, CONFIG_FILENAME), main) ||
      readFileSync(join(main, CONFIG_FILENAME), "utf8") !== committed
    )
      throw new Error(
        `host-rule rewrite requires main's committed ${CONFIG_FILENAME}; merge the intended registration before rewriting`,
      );
    const repository = loadConfig(main).repositories[entry.repositoryId];
    if (repository?.hostRules !== "literal")
      throw new Error(
        `repository ${entry.repositoryId} has not opted into hostRules literal; no host rules changed`,
      );
    const planned = targetStartPlan(
      main,
      { id: entry.repositoryId, baseCommit: entry.baseCommit },
      order,
      { recovery: true },
    );
    if (
      Object.keys(planned).some((key) => planned[key] !== entry[key]) ||
      !parseWorktrees(entry.clone).some(
        (worktree) =>
          worktree.worktree === entry.target &&
          worktree.branch === `refs/heads/${entry.branch}`,
      )
    )
      throw new Error(
        "host-rule rewrite target differs from its registration; no host rules changed",
      );
    const forge = parseGitHubTarget(pushUrl(entry.clone));
    if (!entry.origin || forge.identity !== entry.origin)
      throw new Error(
        "host-rule rewrite origin differs from the origin recorded at start; no host rules changed",
      );
    const selector = forge.selector;
    pushUrl(entry.target, { selector });
    if (validateOrderHostRules(main, order)?.removal)
      throw new Error(
        `host-rule removal is incomplete; run node ${shellQuote(join(main, "scripts/worktree.mjs"))} host-rules --remove ${order}, then retry the rewrite`,
      );
    removeOrderHostRules(main, order);
    const written = writeOrderHostRules(main, entry, selector);
    process.stdout.write(
      `Rewrote the literal host rules of ${order}: ${written.settings} and ${written.codex}.\n`,
    );
    return;
  }
  if (action === "constellation") {
    if (!workOrderId && !actionArgs.length)
      process.stdout.write(`${constellation(repoRoot)}\n`);
    else {
      if (
        workOrderId !== "--agent" ||
        actionArgs.length !== 3 ||
        actionArgs[1] !== "--log"
      )
        throw new Error(
          "usage: worktree constellation [--agent <host-request.json> --log docs/observations/<name>.jsonl]",
        );
      const { agentConstellation } = await import("./lib/beacon-observe.mjs");
      const result = await agentConstellation(
        repoRoot,
        actionArgs[0],
        actionArgs[2],
      );
      process.stdout.write(`${result.text}\n`);
      if (!result.authorized) process.exitCode = 1;
    }
    return;
  }
  if (action === "observe-pr") {
    const args = process.argv.slice(3);
    const flags = new Map();
    for (let i = 0; i < args.length; i += 2) {
      if (
        !["--store", "--number", "--repository", "--request"].includes(
          args[i],
        ) ||
        !args[i + 1] ||
        flags.has(args[i])
      )
        throw new Error(
          "usage: worktree observe-pr --store <episode-store> --number <N> [--repository HOST/OWNER/REPO] [--request <target-request.json>]",
        );
      flags.set(args[i], args[i + 1]);
    }
    if (
      !flags.has("--store") ||
      !/^[1-9][0-9]*$/u.test(flags.get("--number") ?? "")
    )
      throw new Error(
        "usage: worktree observe-pr --store <episode-store> --number <N> [--repository HOST/OWNER/REPO] [--request <target-request.json>]",
      );
    const { observePullRequest, observationErrorMessage } =
      await import("./lib/pull-request-observer.mjs");
    try {
      const { readTargetPublishRequest } =
        await import("./lib/target-publish.mjs");
      const request = flags.has("--request")
        ? readTargetPublishRequest(flags.get("--request"), toolRoot)
        : undefined;
      if (
        request &&
        (request.store !== resolve(flags.get("--store")) ||
          (flags.has("--repository") &&
            request.repositoryId !== flags.get("--repository")))
      )
        throw new Error(
          "observation target request differs from the selected store or repository",
        );
      observePullRequest({
        cwd: toolRoot,
        store: resolve(flags.get("--store")),
        number: Number(flags.get("--number")),
        repositoryId: request?.repositoryId ?? flags.get("--repository"),
        automationLogins: request?.automationLogins,
        linkHosts: request?.linkHosts,
        log: (line) => process.stdout.write(`${line}\n`),
      });
    } catch (error) {
      throw new Error(observationErrorMessage(error));
    }
    return;
  }
  if (action === "resolve-pr") {
    if (workOrderId !== "--request" || actionArgs.length !== 1)
      throw new Error(
        "usage: worktree resolve-pr --request <review-loop-request.json>",
      );
    const { runReviewLoopRequest } =
      await import("./lib/review-comment-loop.mjs");
    const { readAuthorityGrantRegistry } =
      await import("./lib/authority-grants.mjs");
    const result = await runReviewLoopRequest(
      toolRoot,
      actionArgs[0],
      readAuthorityGrantRegistry(toolRoot),
    );
    process.stdout.write(`${JSON.stringify(result)}\n`);
    return;
  }
  // Usage is independent of whether this checkout has a main worktree.
  if (action === "clone") {
    if (!workOrderId || actionArgs.length !== 1)
      throw new Error(
        "usage: worktree clone <repository-or-export-sibling-id> <absolute-path>",
      );
  } else if (!/^WO-[0-9]{3}$/.test(workOrderId ?? "")) {
    throw new Error("work order id must look like WO-003");
  }
  const confirmTerms =
    action === "publish" &&
    ["--target", "--target-worktree"].includes(actionArgs[0])
      ? takeConfirmTerms(actionArgs)
      : undefined;
  if (action === "publish") {
    if (actionArgs[0] === "--target") {
      if (
        ![2, 3].includes(actionArgs.length) ||
        !actionArgs[1] ||
        (actionArgs.length === 3 &&
          actionArgs[2] !== "--require-deliverable-ready")
      )
        throw new Error(
          "usage: worktree publish WO-NNN --target <target-publish-request.json> [--require-deliverable-ready] [--confirm-terms sha256:<digest>]",
        );
    } else if (actionArgs[0] === "--target-worktree") {
      // `--draft`, the opt-in form at verified, comes right after
      // `--target-worktree`; the three valued flags are the same either way.
      const draftForm = actionArgs[1] === "--draft";
      const pairs = actionArgs.slice(draftForm ? 2 : 1);
      const flags = pairs.filter((_, index) => index % 2 === 0);
      if (
        pairs.length !== 6 ||
        new Set(flags).size !== 3 ||
        flags.some(
          (flag) => !["--branch", "--title", "--body-file"].includes(flag),
        ) ||
        pairs.some((value, index) => index % 2 === 1 && !value)
      )
        throw new Error(
          'usage: worktree publish WO-NNN --target-worktree [--draft] --branch <type>/<slug> --title "<title>" --body-file <contained reviewed path> [--confirm-terms sha256:<digest>]',
        );
    } else if (
      actionArgs.length !== 4 ||
      !["--title", "--body-file"].includes(actionArgs[0]) ||
      !["--title", "--body-file"].includes(actionArgs[2]) ||
      actionArgs[0] === actionArgs[2] ||
      !actionArgs[1] ||
      !actionArgs[3]
    ) {
      throw new Error(
        'usage: worktree publish WO-NNN --title "<title>" --body-file <contained regular-file path>; quote titles with spaces',
      );
    }
  }
  const mainPath = mainWorktree(toolRoot);

  if (action === "clone") {
    recordRepositoryClone(mainPath, workOrderId, actionArgs[0], {
      declaredIn: toolRoot,
    });
    process.stdout.write(`Recorded local clone for ${workOrderId}.\n`);
    return;
  }

  const workOrderPath = actionArgs[0];
  const suffix = workOrderId.slice(workOrderId.indexOf("-") + 1);
  const branch = `wo-${suffix}`;
  const target = join(dirname(mainPath), `${basename(mainPath)}-wo${suffix}`);

  if (action === "start") {
    if (repoRoot !== mainPath)
      throw new Error(
        `run start from the main control-plane checkout: ${mainPath}`,
      );
    if (!workOrderPath)
      throw new Error(
        "usage: worktree start WO-NNN docs/work-orders/<file>.md",
      );
    const pending = readTargetStart(mainPath, workOrderId);
    const readStartAuthority = (recovery = false) => {
      const source = readFileSync(
        workOrderAuthorityPath(mainPath, workOrderId, workOrderPath),
        "utf8",
      );
      const umbrella = umbrellaRecord(source, workOrderPath, workOrderId);
      if (umbrella)
        throw new Error(
          `${workOrderId} is an umbrella record superseded by ${umbrella.successors.join(", ")}; activate a successor instead`,
        );
      const declaration = parseRepositoryDeclaration(source, workOrderPath);
      return declaration
        ? targetStartPlan(mainPath, declaration, workOrderId, { recovery })
        : undefined;
    };
    const initial = readStartAuthority(Boolean(pending));
    ensureClean(mainPath);
    readPendingReceipts(mainPath);
    if (pending) {
      if (
        !initial ||
        Object.entries(initial).some(
          ([key, value]) => pending[key] !== value,
        ) ||
        pending.launchpad !== target ||
        pending.runtimeRoot !== mainPath ||
        pending.workOrderPath !== workOrderPath ||
        createHash("sha256")
          .update(readFileSync(join(mainPath, workOrderPath)))
          .digest("hex") !== pending.authorityHash
      )
        throw new Error(
          "pending target start differs from the current authority; source retained",
        );
      await startTargetWorktree(mainPath, pending);
      return;
    }
    if (existsSync(target)) throw new Error(`target already exists: ${target}`);
    if (runGit(mainPath, ["branch", "--list", branch]) !== "")
      throw new Error(`branch already exists: ${branch}`);
    runGit(mainPath, ["fetch", "origin", "main"]);
    runGit(mainPath, ["merge", "--ff-only", "origin/main"]);
    // Re-read the authority after fast-forwarding, before either worktree exists.
    const targetPlan = readStartAuthority();
    const siblingReceipts = capturePendingReceipts(mainPath);
    if (targetPlan) {
      if (
        loadConfig(mainPath).repositories[targetPlan.repositoryId]
          ?.hostRules === "literal"
      )
        validateOrderHostRules(mainPath, workOrderId, { creating: true });
      // The clone's forge identity at start binds the hook's admission to
      // this origin for the order's lifetime; a non-GitHub origin records
      // null and the admission then binds nothing extra.
      let origin = null;
      try {
        origin = parseGitHubTarget(pushUrl(targetPlan.clone)).identity;
      } catch (error) {
        const remote = runGit(
          targetPlan.clone,
          ["config", "--get", "remote.origin.url"],
          { onFailure: () => "" },
        );
        if (/^(?:https?:|ssh:|git@)/u.test(remote))
          throw new Error(
            `target origin cannot be bound to a GitHub repository; correct the origin before starting: ${error.message}`,
          );
        origin = null;
      }
      const entry = {
        ...targetPlan,
        origin,
        siblingReceipts,
        launchpad: target,
        runtimeRoot: mainPath,
        workOrderPath,
        launchpadBase: runGit(mainPath, ["rev-parse", "origin/main"]),
        authorityHash: createHash("sha256")
          .update(readFileSync(join(mainPath, workOrderPath)))
          .digest("hex"),
      };
      recordTargetStart(mainPath, entry);
      await startTargetWorktree(mainPath, entry);
      return;
    }
    runGit(mainPath, ["worktree", "add", target, "-b", branch, "origin/main"]);
    signoffAdvisory(target);
    const base = runGit(target, ["rev-parse", "HEAD"]);
    const authorityHash = createHash("sha256")
      .update(readFileSync(join(target, workOrderPath)))
      .digest("hex");
    const bindings = [
      mainPath,
      target,
      branch,
      base,
      workOrderId,
      workOrderPath,
      authorityHash,
      siblingReceipts,
    ];
    let activatedOutput;
    try {
      activatedOutput = await completeSelfStart(...bindings);
    } catch (error) {
      const program = `import {completeSelfStart} from ${JSON.stringify(pathToFileURL(join(mainPath, "scripts/worktree.mjs")).href)}; process.stdout.write(await completeSelfStart(...${JSON.stringify(bindings)})); console.log(${JSON.stringify(`Phase: active.\nNext: cd ${shellQuote(target)}; start codex and enter resume: next`)});`;
      throw new Error(
        `worktree created and preserved at ${target}; ${error.message}. Correct the reported condition and retry: node --input-type=module -e ${shellQuote(program)}`,
      );
    }
    process.stdout.write(
      `Created ${target} on ${branch}.\n${activatedOutput}Phase: active.\nNext (run manually):\n  cd ${shellQuote(target)}\n  codex\n  enter: resume: next\n`,
    );
  } else if (action === "publish" && actionArgs[0] === "--target") {
    // A target order publishes its source-change episode in the target
    // repository under an operator grant (WO-064); no launchpad branch moves.
    const { publishTargetOrder, readTargetPublishRequest } =
      await import("./lib/target-publish.mjs");
    const { readAuthorityGrantRegistry } =
      await import("./lib/authority-grants.mjs");
    publishTargetOrder({
      launchpad: toolRoot,
      workOrderId,
      request: readTargetPublishRequest(actionArgs[1]),
      registry: readAuthorityGrantRegistry(toolRoot),
      requireDeliverableReady: actionArgs.includes(
        "--require-deliverable-ready",
      ),
      confirmTerms,
    });
  } else if (action === "publish" && actionArgs[0] === "--target-worktree") {
    const item = parseWorktrees(repoRoot).find(
      (candidate) => candidate.branch === `refs/heads/${branch}`,
    );
    if (!item?.worktree) throw new Error(`no worktree found for ${branch}`);
    const subject = resolve(item.worktree);
    // The draft form runs at verified, before the order worktree's records
    // are committed, so it reads the body's working bytes and needs no clean
    // launchpad; the final publish keeps both requirements (WO-221).
    const draft = actionArgs[1] === "--draft";
    if (!draft) ensureClean(subject);
    const flag = (name) => actionArgs[actionArgs.indexOf(name) + 1];
    const bodyFile = flag("--body-file");
    const bodyPath = resolve(subject, bodyFile);
    if (
      !bodyPath.startsWith(`${subject}${sep}`) ||
      !containedRegularFile(bodyPath, subject)
    )
      throw new Error(
        `${bodyFile}: body must be a contained regular file of the order worktree`,
      );
    const body = draft
      ? readFileSync(bodyPath, "utf8")
      : readTrackedTextAtHead(subject, relative(subject, bodyPath), bodyFile);
    if (draft) {
      const intake = docPath(subject, "intake");
      const physical = realpathSync(bodyPath);
      if (
        [bodyPath, physical].some(
          (file) => file === intake || file.startsWith(`${intake}${sep}`),
        ) ||
        runGit(
          subject,
          [
            "check-ignore",
            "--no-index",
            "--",
            relative(subject, bodyPath),
            relative(subject, physical),
          ],
          { onFailure: () => "" },
        )
      )
        throw new Error("draft body must not be ignored or intake material");
    }
    const { publishTargetWorktree, publishTargetDraft } =
      await import("./lib/target-publish.mjs");
    (draft ? publishTargetDraft : publishTargetWorktree)({
      launchpad: subject,
      workOrderId,
      branch: flag("--branch"),
      title: flag("--title"),
      body,
      confirmTerms,
    });
  } else if (action === "publish") {
    const item = parseWorktrees(repoRoot).find(
      (candidate) => candidate.branch === `refs/heads/${branch}`,
    );
    if (!item?.worktree) throw new Error(`no worktree found for ${branch}`);
    const subject = resolve(item.worktree);
    ensureClean(subject);
    resolveGitHubPushTarget(subject);
    const surfaces = spawnSync(
      process.execPath,
      [
        join(subject, "scripts/release.mjs"),
        "check-surfaces",
        "--committed",
        workOrderId,
      ],
      { cwd: subject, encoding: "utf8" },
    );
    process.stdout.write(surfaces.stdout ?? "");
    process.stderr.write(surfaces.stderr ?? "");
    if (surfaces.status !== 0) {
      process.exitCode = surfaces.status ?? 1;
      return;
    }
    const titleAt = actionArgs.indexOf("--title");
    const bodyAt = actionArgs.indexOf("--body-file");
    const title = titleAt >= 0 ? actionArgs[titleAt + 1] : undefined;
    const bodyFile = bodyAt >= 0 ? actionArgs[bodyAt + 1] : undefined;
    const bodyPath = bodyFile ? resolve(subject, bodyFile) : undefined;
    if (
      !title ||
      !bodyPath ||
      !bodyPath.startsWith(`${subject}${sep}`) ||
      !containedRegularFile(bodyPath, subject)
    )
      throw new Error(
        "usage: worktree publish WO-NNN --title <title> --body-file <contained regular-file path>",
      );
    const bodyRelativePath = relative(subject, bodyPath);
    const body = readTrackedTextAtHead(subject, bodyRelativePath, bodyFile);
    assertGitHubBodyProfile(body, bodyFile);
    assertPullRequestBodyShape(body, bodyFile);
    const { hasAiAttribution } =
      await import("../packages/compiler/src/attribution.mjs");
    if (hasAiAttribution(title) || hasAiAttribution(body))
      throw new Error(
        "PR title or body contains AI attribution or a session trailer/URL",
      );
    const control = readControl(subject, "HEAD");
    const state = control.orders.get(workOrderId)?.state;
    let gateBlock;
    if (state?.repositoryId) {
      if (!state.targetRecords)
        throw new Error(
          `${workOrderId}: committed control has no TargetRecordsCommitted`,
        );
      const { targetRecordSources } = await import("./lib/target-records.mjs");
      const { eventsForOrder } = await import("./lib/control-store.mjs");
      const moved = targetRecordSources(
        subject,
        state,
        eventsForOrder(control, workOrderId),
      )
        .filter((row) => row.kind !== "order")
        .map((row) => row.source);
      const added = new Set(
        runGitPathList(subject, [
          "diff",
          "--name-only",
          "--diff-filter=A",
          "-z",
          "origin/main...HEAD",
          "--",
        ]),
      );
      const copies = moved.filter((path) => added.has(path));
      if (copies.length)
        throw new Error(
          `records branch adds moved target records: ${copies.join(", ")}`,
        );
      // An order whose Release carries the reviewed notes has them reviewed
      // here, beside the body, before the close reads them.
      if (
        targetReleaseNotesSource(
          readTrackedTextAtHead(
            subject,
            state.workOrderPath,
            state.workOrderPath,
          ),
          state.workOrderPath,
        ) === "reviewed"
      )
        requireReleaseNotes(subject, workOrderId);
      gateBlock = reviewedLaunchpadIdentity(subject, workOrderId).body;
      process.stdout.write(
        `${workOrderId}: target order records no release; records live in ${state.targetRecords.repositoryId} at ${state.targetRecords.commit}.\n`,
      );
    } else {
      requireReleaseNotes(subject, workOrderId);
      gateBlock = productGateBody(
        reviewedProductGate(subject, workOrderId, "HEAD", {
          liveInstance: true,
        }),
      );
    }
    const contributions = contributionSignoffRules(subject);
    process.stdout.write(
      `${contributions.map(({ line }) => line).join("\n")}\n`,
    );
    if (contributions.some(({ pass }) => !pass)) {
      process.exitCode = 1;
      return;
    }
    const repository = ensureGh(subject);
    const { mergedSubjects } = await import("./lib/meta.mjs");
    process.stdout.write(
      "Last five merged subjects (characters; visibility only):\n",
    );
    for (const row of mergedSubjects(mainPath))
      process.stdout.write(`  ${row.characters}: ${row.title}\n`);
    process.stdout.write(`Proposed ${[...title].length}: ${title}\n`);
    const { writingGuidance } = await import("./lib/reader-profiles.mjs");
    process.stdout.write(
      `${writingGuidance("prTitle", subject)}\n${writingGuidance("prBody", subject)}\n`,
    );
    const publicationBody = body.includes("<!-- dotln-product-gate:start -->")
      ? body.replace(
          /<!-- dotln-product-gate:start -->[\s\S]*?<!-- dotln-product-gate:end -->/,
          gateBlock,
        )
      : `${body.trimEnd()}\n\n${gateBlock}\n`;
    // The stored body links file-relative, the form the document gate
    // resolves; on the forge those resolve nowhere, so the published body
    // links absolute to the repository at the reviewed revision.
    const publishedBody = absoluteBodyLinks(publicationBody, {
      from: bodyRelativePath,
      repository,
      revision: runGit(subject, ["rev-parse", "HEAD"]),
    });
    assertGitHubBodyProfile(publishedBody, bodyFile, { links: true });
    assertPullRequestBodyShape(publishedBody, bodyFile, { published: true });
    const opened = withTemporaryBody(publishedBody, (committedBodyPath) => {
      runGit(subject, ["push", "--no-follow-tags", "-u", "origin", branch]);
      return executeGh(subject, [
        "pr",
        "create",
        "--repo",
        repository.selector,
        "--head",
        branch,
        "--base",
        "main",
        "--title",
        title,
        "--body-file",
        committedBodyPath,
      ]);
    });
    if (opened.status !== 0)
      throw new Error(
        `branch pushed but PR creation failed: ${(opened.stderr || opened.stdout).trim()}`,
      );
    const releaseHandoff = `  Start a session in main (${shellQuote(mainPath)}); run exactly:\n  ${releaseCloseCommand(mainPath, workOrderId)}`;
    process.stdout.write(
      `Pushed ${branch} and opened ${opened.stdout.trim()}\nAfter the operator merges the PR and authorizes resume: release close, run:\n${releaseHandoff}\nThe authorized close needs network egress to the GitHub host; run the printed --publish command once. --dry-run is optional when a prerequisite is in doubt; host permissions govern execution.\n`,
    );
  } else if (action === "finish") {
    const { flags, material: overrides } = parseMaterialFlags(actionArgs, [
      "--dry-run",
      "--list-material",
    ]);
    if (repoRoot !== mainPath)
      throw new Error(
        `run finish from the main control-plane checkout: ${mainPath}`,
      );
    const item = parseWorktrees(repoRoot).find(
      (candidate) => candidate.branch === `refs/heads/${branch}`,
    );
    if (!item?.worktree) throw new Error(`no worktree found for ${branch}`);
    const subject = resolve(item.worktree);
    const material = inventoryMaterial(subject, {
      overrides,
      overrideWorktree: subject,
    });
    ensureMaterialClean(mainPath, inventoryMaterial(mainPath), {
      leaving: false,
    });
    ensureMaterialClean(subject, material);
    const {
      reconcileWorktreeMaterial,
      renderIntakeReconciliation,
      verifyPreservedMaterial,
    } = await import("./lib/intake-reconciliation.mjs");
    const { activeGateRuns } = await import("./lib/gate-evidence.mjs");
    const writerTeardown =
      await import("../packages/skeleton/src/writer-teardown.mjs");
    const preview = reconcileWorktreeMaterial(subject, mainPath, workOrderId, {
      dryRun: true,
      material,
    });
    process.stdout.write(
      renderIntakeReconciliation(preview, {
        listMaterial: flags.includes("--list-material"),
      }),
    );
    ensureNoIgnoredMaterial(subject, preview);
    const control = statusProjection(readControl(subject, "HEAD"), workOrderId);
    if (control?.phase !== "closed" || control.workOrder !== workOrderId)
      throw new Error(`${workOrderId} has not passed final review and closed`);
    if (flags.includes("--dry-run")) {
      for (const line of reconcileDerivedWorktrees(mainPath, workOrderId, {
        dryRun: true,
        listMaterial: flags.includes("--list-material"),
        reconcileWorktreeMaterial,
        renderIntakeReconciliation,
        verifyPreservedMaterial,
        activeGateRuns,
        ...writerTeardown,
        overrides,
        overrideWorktree: subject,
      }))
        process.stdout.write(`${line}\n`);
      process.stdout.write(
        `Dry run: would fetch main, verify merge and closed state, preserve intake and retained control state, and remove merged ${branch}. No changes made.\n`,
      );
      return;
    }
    runGit(mainPath, ["fetch", "origin", "main"]);
    runGit(mainPath, ["merge", "--ff-only", "origin/main"]);
    const merged = spawnGit([
      "-C",
      mainPath,
      "merge-base",
      "--is-ancestor",
      branch,
      "origin/main",
    ]);
    if (merged.status !== 0)
      throw new Error(
        `${branch} is not merged into origin/main; merge the PR first`,
      );
    const integrated = statusProjection(
      readControl(mainPath, "origin/main"),
      workOrderId,
    );
    if (integrated.phase !== "closed")
      throw new Error(`${workOrderId} is not closed in merged control state`);
    refreshHarnessRuntime(
      mainPath,
      isKitRoot(mainPath)
        ? undefined
        : () => {
            const built = spawnSync("npm", ["run", "build"], {
              cwd: mainPath,
              stdio: "inherit",
            });
            if (built.status !== 0)
              throw new Error(
                "Pinned runtime build failed; worktree preserved; run node scripts/bootstrap.mjs",
              );
          },
    );
    const { readGateChecks, recordGateChecks } =
      await import("./lib/gate-evidence.mjs");
    writerTeardown.withWriterReservationLock(subject, () => {
      const blocker = writerTeardown.writerTeardownBlocker(subject);
      if (blocker) throw new Error(blocker);
      // Inventoried again under the lock, so a repository that appeared since
      // the preview is removed with a record, never silently.
      const locked = inventoryMaterial(subject, {
        overrides,
        overrideWorktree: subject,
      });
      ensureMaterialClean(subject, locked);
      if (activeGateRuns(subject).length)
        throw new Error("active gate run; source retained");
      const reconciliation = reconcileWorktreeMaterial(
        subject,
        mainPath,
        workOrderId,
        { material: locked },
      );
      process.stdout.write(
        renderIntakeReconciliation(reconciliation, {
          listMaterial: flags.includes("--list-material"),
        }),
      );
      const checks = readGateChecks(subject);
      if (checks.length)
        recordGateChecks(mainPath, checks, { sourceRoot: subject });
      ensureNoIgnoredMaterial(subject, reconciliation);
      verifyPreservedMaterial(subject, mainPath, reconciliation);
      refuseSubmoduleWorktree(subject);
      removeScratch(subject, reconciliation);
      const restoreBeaconPermissions = prepareBeaconDisposal(subject);
      try {
        removePreservedWorktree(mainPath, subject, locked, reconciliation);
      } catch (error) {
        restoreBeaconPermissions();
        throw error;
      }
    });
    removeMergedBranch(mainPath, branch);
    for (const line of reconcileDerivedWorktrees(mainPath, workOrderId, {
      dryRun: false,
      listMaterial: flags.includes("--list-material"),
      reconcileWorktreeMaterial,
      renderIntakeReconciliation,
      verifyPreservedMaterial,
      activeGateRuns,
      ...writerTeardown,
      overrides,
      overrideWorktree: subject,
    }))
      process.stdout.write(`${line}\n`);
    process.stdout.write(
      `Updated main and removed merged ${branch} worktree/branch.\n`,
    );
  } else if (action === "settle") {
    // A release close whose subject worktree is already gone still settles
    // the order's derived worktrees (WO-044).
    const { flags, material: overrides } = parseMaterialFlags(actionArgs, [
      "--dry-run",
      "--list-material",
    ]);
    if (repoRoot !== mainPath)
      throw new Error(
        `run settle from the main control-plane checkout: ${mainPath}`,
      );
    const {
      reconcileWorktreeMaterial,
      renderIntakeReconciliation,
      verifyPreservedMaterial,
    } = await import("./lib/intake-reconciliation.mjs");
    const { activeGateRuns } = await import("./lib/gate-evidence.mjs");
    const writerTeardown =
      await import("../packages/skeleton/src/writer-teardown.mjs");
    const lines = reconcileDerivedWorktrees(mainPath, workOrderId, {
      dryRun: flags.includes("--dry-run"),
      listMaterial: flags.includes("--list-material"),
      reconcileWorktreeMaterial,
      verifyPreservedMaterial,
      renderIntakeReconciliation,
      activeGateRuns,
      ...writerTeardown,
      overrides,
      overrideWorktree:
        parseWorktrees(mainPath).find(
          (item) => item.branch === `refs/heads/${branch}`,
        )?.worktree ?? null,
    });
    process.stdout.write(
      lines.length
        ? `${lines.join("\n")}\n`
        : `No derived worktrees for ${workOrderId}.\n`,
    );
  } else {
    throw new Error(
      "usage: worktree clone <repository-or-export-sibling-id> <absolute-path> | worktree start WO-NNN <work-order-path> | worktree integrate WO-NNN [--intake-backup <archive.zip>] [--continue] | worktree publish WO-NNN --title <title> --body-file <path> | worktree publish WO-NNN --target <request.json> [--require-deliverable-ready] [--confirm-terms sha256:<digest>] | worktree publish WO-NNN --target-worktree [--draft] --branch <type>/<slug> --title <title> --body-file <path> [--confirm-terms sha256:<digest>] | worktree observe-pr --store <episode-store> --number <N> [--repository HOST/OWNER/REPO] | worktree resolve-pr --request <review-loop-request.json> | worktree finish WO-NNN [--dry-run] [--list-material] | worktree settle WO-NNN [--dry-run] [--list-material]",
    );
  }
};

if (isMainModule(import.meta.url))
  try {
    await main();
  } catch (error) {
    process.stderr.write(
      `error: ${error instanceof Error ? error.message : String(error)}\n`,
    );
    process.exitCode = 1;
  }
