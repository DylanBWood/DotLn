#!/usr/bin/env node
import { refreshHarnessRuntime } from "./lib/harness-runtime.mjs";
import {
  existsSync,
  lstatSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { basename, dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { assertGitHubBodyProfile } from "./github-body.mjs";
import { parseReleaseNotes, releaseNotesPathFor } from "./release-notes.mjs";
import {
  environmentWithoutGhRepo,
  resolveGitHubPushTarget,
} from "./github-repository.mjs";
import {
  ensureClean,
  mainWorktree,
  parseWorktrees,
  removeMergedBranch,
  runGit,
  runGitPathList,
} from "./lib/git.mjs";
import {
  containedRegularFile,
  describeIgnoredMaterial,
  workOrderAuthorityPath,
} from "./lib/paths.mjs";
import { statusProjection } from "./resume.mjs";
import { readControl } from "./lib/control-store.mjs";
import { constellation, prepareBeaconDisposal } from "./lib/beacons.mjs";
import { contributionSignoffRules } from "./lib/contributions.mjs";
import {
  reviewedProductGate,
  productGateBody,
} from "./lib/release-records.mjs";

const toolRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const shellQuote = (value) => `'${value.replaceAll("'", `'\\''`)}'`;
const executeGh = (cwd, args) =>
  spawnSync("gh", args, {
    cwd,
    encoding: "utf8",
    env: environmentWithoutGhRepo(),
  });
const ensureGh = (path) => {
  const repository = resolveGitHubPushTarget(path);
  const available = executeGh(path, ["--version"]);
  if (available.status !== 0)
    throw new Error(
      "gh is required before any remote mutation; install and authenticate GitHub CLI, then retry publish",
    );
  const authenticated = executeGh(path, [
    "auth",
    "status",
    "--hostname",
    repository.host,
  ]);
  if (authenticated.status !== 0)
    throw new Error(
      "gh authentication is required before any remote mutation; authenticate GitHub CLI, then retry publish",
    );
  return repository;
};
const readTrackedTextAtHead = (root, path, displayPath) => {
  const tree = spawnSync(
    "git",
    [
      "-C",
      root,
      "ls-tree",
      "-z",
      "--format=%(objectname)",
      "HEAD",
      "--",
      `:(literal)${path}`,
    ],
    { encoding: "utf8" },
  );
  if (tree.status !== 0 || !/^[0-9a-f]{40,64}\0$/.test(tree.stdout))
    throw new Error(`${displayPath}: file is not tracked`);
  const object = tree.stdout.slice(0, -1);
  const blob = spawnSync("git", ["-C", root, "cat-file", "blob", object]);
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
const withTemporaryBody = (body, operation) => {
  const directory = mkdtempSync(join(tmpdir(), "dotln-pr-body-"));
  const path = join(directory, "PR.md");
  try {
    writeFileSync(path, body, "utf8");
    return operation(path);
  } finally {
    try {
      rmSync(directory, { recursive: true, force: true });
    } catch {
      // A cleanup failure must not mask whether the remote operation ran.
    }
  }
};
// Every blocker is reported at once with its lane and that lane's remedy, so
// clearing N entries costs one run, not N. Nothing here deletes ignored bytes.
const ensureNoIgnoredMaterial = (
  path,
  receipt = { files: [], nestedRepositories: [] },
) => {
  const reconciled = new Set([
    ...receipt.files.map((row) => row.source),
    ...(receipt.nestedRepositories ?? []).map((row) => `${row.source}/`),
  ]);
  const blockers = runGitPathList(path, [
    "ls-files",
    "-z",
    "--others",
    "--ignored",
    "--exclude-standard",
  ])
    .filter((candidate) => !reconciled.has(candidate))
    .map((candidate) => describeIgnoredMaterial(path, candidate))
    .filter((entry) => !entry.disposable);
  if (blockers.length > 0)
    throw new Error(
      `worktree contains ignored material and will not be removed (${blockers.length} ${blockers.length === 1 ? "entry" : "entries"}; nothing here deletes ignored material):\n${blockers
        .map(
          (entry) =>
            `  ${entry.path}: ${entry.classification}; ${entry.remedy}`,
        )
        .join("\n")}`,
    );
};
// Derived worktrees: measurement siblings and temporary subjects that name the
// closing order (WO-044). A detached derivative that is clean and idle has its
// non-disposable control and intake material preserved like the subject's and
// is then removed; a missing directory is pruned; anything else is reported
// with its blocker and the exact command. Nothing here deletes ignored bytes.
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
    reconcileWorktreeMaterial,
    verifyPreservedMaterial,
    activeGateRuns,
    withWriterReservationLock,
    writerTeardownBlocker,
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
    if (runGit(path, ["status", "--porcelain", "--untracked-files=all"]) !== "")
      blockers.push("uncommitted changes");
    if (activeGateRuns(path).length > 0) blockers.push("active gate run");
    let receipt = null;
    if (!blockers.length)
      try {
        receipt = reconcileWorktreeMaterial(path, mainPath, workOrderId, {
          dryRun: true,
        });
        ensureNoIgnoredMaterial(path, receipt);
      } catch (error) {
        blockers.push(error.message.split("\n")[0]);
      }
    if (blockers.length) {
      lines.push(
        `Derived worktree ${path}: kept (${blockers.join("; ")}); remove it from an operator terminal with git worktree remove --force ${shellQuote(path)}`,
      );
      continue;
    }
    if (!dryRun) {
      try {
        withWriterReservationLock(path, () => {
          const writer = writerTeardownBlocker(path);
          if (writer) throw new Error(writer);
          ensureClean(path);
          if (activeGateRuns(path).length) throw new Error("active gate run");
          const preserved = reconcileWorktreeMaterial(
            path,
            mainPath,
            workOrderId,
          );
          ensureNoIgnoredMaterial(path, preserved);
          verifyPreservedMaterial(path, mainPath, preserved);
          const restoreBeaconPermissions = prepareBeaconDisposal(path);
          try {
            runGit(mainPath, ["worktree", "remove", path]);
          } catch (error) {
            restoreBeaconPermissions();
            throw error;
          }
        });
      } catch (error) {
        lines.push(
          `Derived worktree ${path}: kept (${error.message.split("\n")[0]})`,
        );
        continue;
      }
    }
    lines.push(
      `Derived worktree ${path}: ${dryRun ? "would remove" : "removed"} (detached, clean, idle; ${receipt.files.length} preserved files, disposable material only)`,
    );
  }
  return lines;
};
const main = async () => {
  const [action, workOrderId, ...actionArgs] = process.argv.slice(2);
  const repoRoot = ["finish", "settle"].includes(action)
    ? resolve(process.cwd())
    : toolRoot;
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
  const mainPath = mainWorktree(toolRoot);

  const workOrderPath = actionArgs[0];
  if (!/^WO-[0-9]{3}$/.test(workOrderId ?? ""))
    throw new Error("work order id must look like WO-003");
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
    workOrderAuthorityPath(mainPath, workOrderId, workOrderPath);
    ensureClean(mainPath);
    if (existsSync(target)) throw new Error(`target already exists: ${target}`);
    if (runGit(mainPath, ["branch", "--list", branch]) !== "")
      throw new Error(`branch already exists: ${branch}`);
    runGit(mainPath, ["fetch", "origin", "main"]);
    runGit(mainPath, ["merge", "--ff-only", "origin/main"]);
    runGit(mainPath, ["worktree", "add", target, "-b", branch, "origin/main"]);
    const activated = spawnSync(
      "node",
      [
        join(target, "scripts/resume.mjs"),
        "activate",
        workOrderId,
        workOrderPath,
      ],
      { cwd: target, encoding: "utf8" },
    );
    if (activated.status !== 0)
      throw new Error(
        `worktree created but resume activation failed: ${(activated.stderr || activated.stdout).trim()}`,
      );
    // A fresh Git worktree has no ignored dependencies or pinned hook runtime.
    // Prepare it before telling the operator to enter either model session.
    const bootstrap = join(target, "scripts/bootstrap.mjs");
    if (existsSync(bootstrap)) {
      const prepared = spawnSync(process.execPath, [bootstrap], {
        cwd: target,
        stdio: "inherit",
      });
      if (prepared.status !== 0)
        throw new Error(
          `worktree created and preserved at ${target}; preparation failed. Retry node scripts/bootstrap.mjs there. Prompts remain available.`,
        );
    }
    process.stdout.write(
      `Created ${target} on ${branch}.\n${activated.stdout}Phase: active.\nNext (run manually):\n  cd ${shellQuote(target)}\n  codex\n  enter: resume: next\n`,
    );
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
    const { hasAiAttribution } =
      await import("../packages/compiler/src/attribution.mjs");
    if (hasAiAttribution(title) || hasAiAttribution(body))
      throw new Error(
        "PR title or body contains AI attribution or a session trailer/URL",
      );
    const releaseNotesPath = releaseNotesPathFor(workOrderId);
    const releaseNotesFile = resolve(subject, releaseNotesPath);
    if (!existsSync(releaseNotesFile))
      throw new Error(`${releaseNotesPath}: release-notes file is missing`);
    if (!lstatSync(releaseNotesFile).isFile())
      throw new Error(
        `${releaseNotesPath}: release-notes path is not a regular file`,
      );
    if (
      !realpathSync(releaseNotesFile).startsWith(
        `${realpathSync(subject)}${sep}`,
      )
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
    const gate = reviewedProductGate(subject, workOrderId);
    const gateBlock = productGateBody(gate);
    const publicationBody = body.includes("<!-- dotln-product-gate:start -->")
      ? body.replace(
          /<!-- dotln-product-gate:start -->[\s\S]*?<!-- dotln-product-gate:end -->/,
          gateBlock,
        )
      : `${body.trimEnd()}\n\n${gateBlock}\n`;
    const opened = withTemporaryBody(publicationBody, (committedBodyPath) => {
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
    const releaseHandoff = `  cd ${shellQuote(mainPath)}\n  ${shellQuote(process.execPath)} ${shellQuote(join(mainPath, "scripts/release.mjs"))} close ${workOrderId} --publish`;
    process.stdout.write(
      `Pushed ${branch} and opened ${opened.stdout.trim()}\nAfter the operator merges the PR and authorizes resume: release close, run:\n${releaseHandoff}\nThe authorized close needs network egress to the GitHub host; --dry-run proves reachability and host permissions govern execution.\n`,
    );
  } else if (action === "finish") {
    if (actionArgs.some((arg) => arg !== "--dry-run") || actionArgs.length > 1)
      throw new Error("usage: worktree finish WO-NNN [--dry-run]");
    if (repoRoot !== mainPath)
      throw new Error(
        `run finish from the main control-plane checkout: ${mainPath}`,
      );
    const item = parseWorktrees(repoRoot).find(
      (candidate) => candidate.branch === `refs/heads/${branch}`,
    );
    if (!item?.worktree) throw new Error(`no worktree found for ${branch}`);
    const subject = resolve(item.worktree);
    ensureClean(mainPath);
    ensureClean(subject);
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
    });
    ensureNoIgnoredMaterial(subject, preview);
    const control = statusProjection(readControl(subject, "HEAD"), workOrderId);
    if (control?.phase !== "closed" || control.workOrder !== workOrderId)
      throw new Error(`${workOrderId} has not passed final review and closed`);
    if (actionArgs.includes("--dry-run")) {
      process.stdout.write(renderIntakeReconciliation(preview));
      for (const line of reconcileDerivedWorktrees(mainPath, workOrderId, {
        dryRun: true,
        reconcileWorktreeMaterial,
        verifyPreservedMaterial,
        activeGateRuns,
        ...writerTeardown,
      }))
        process.stdout.write(`${line}\n`);
      process.stdout.write(
        `Dry run: would fetch main, verify merge and closed state, preserve intake and retained control state, and remove merged ${branch}. No changes made.\n`,
      );
      return;
    }
    runGit(mainPath, ["fetch", "origin", "main"]);
    runGit(mainPath, ["merge", "--ff-only", "origin/main"]);
    const merged = spawnSync("git", [
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
    refreshHarnessRuntime(mainPath, () => {
      const built = spawnSync("npm", ["run", "build"], {
        cwd: mainPath,
        stdio: "inherit",
      });
      if (built.status !== 0)
        throw new Error(
          "Pinned runtime build failed; worktree preserved; run node scripts/bootstrap.mjs",
        );
    });
    const reconciliation = reconcileWorktreeMaterial(
      subject,
      mainPath,
      workOrderId,
    );
    process.stdout.write(renderIntakeReconciliation(reconciliation));
    const { readGateChecks, recordGateChecks } =
      await import("./lib/gate-evidence.mjs");
    const checks = readGateChecks(subject);
    if (checks.length) recordGateChecks(mainPath, checks);
    ensureNoIgnoredMaterial(subject, reconciliation);
    verifyPreservedMaterial(subject, mainPath, reconciliation);
    const restoreBeaconPermissions = prepareBeaconDisposal(subject);
    try {
      runGit(mainPath, ["worktree", "remove", subject]);
    } catch (error) {
      restoreBeaconPermissions();
      throw error;
    }
    removeMergedBranch(mainPath, branch);
    for (const line of reconcileDerivedWorktrees(mainPath, workOrderId, {
      dryRun: false,
      reconcileWorktreeMaterial,
      verifyPreservedMaterial,
      activeGateRuns,
      ...writerTeardown,
    }))
      process.stdout.write(`${line}\n`);
    process.stdout.write(
      `Updated main and removed merged ${branch} worktree/branch.\n`,
    );
  } else if (action === "settle") {
    // A release close whose subject worktree is already gone still settles
    // the order's derived worktrees (WO-044).
    if (actionArgs.some((arg) => arg !== "--dry-run") || actionArgs.length > 1)
      throw new Error("usage: worktree settle WO-NNN [--dry-run]");
    if (repoRoot !== mainPath)
      throw new Error(
        `run settle from the main control-plane checkout: ${mainPath}`,
      );
    const { reconcileWorktreeMaterial, verifyPreservedMaterial } =
      await import("./lib/intake-reconciliation.mjs");
    const { activeGateRuns } = await import("./lib/gate-evidence.mjs");
    const writerTeardown =
      await import("../packages/skeleton/src/writer-teardown.mjs");
    const lines = reconcileDerivedWorktrees(mainPath, workOrderId, {
      dryRun: actionArgs.includes("--dry-run"),
      reconcileWorktreeMaterial,
      verifyPreservedMaterial,
      activeGateRuns,
      ...writerTeardown,
    });
    process.stdout.write(
      lines.length
        ? `${lines.join("\n")}\n`
        : `No derived worktrees for ${workOrderId}.\n`,
    );
  } else {
    throw new Error(
      "usage: worktree start WO-NNN <work-order-path> | worktree publish WO-NNN --title <title> --body-file <path> | worktree finish WO-NNN [--dry-run] | worktree settle WO-NNN [--dry-run]",
    );
  }
};

try {
  await main();
} catch (error) {
  process.stderr.write(
    `error: ${error instanceof Error ? error.message : String(error)}\n`,
  );
  process.exitCode = 1;
}
