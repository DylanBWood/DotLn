#!/usr/bin/env node
import { refreshHarnessRuntime } from "./lib/harness-runtime.mjs";
import { findLaunchpad } from "./lib/config.mjs";
import { existsSync, lstatSync, realpathSync } from "node:fs";
import { basename, dirname, join, relative, resolve, sep } from "node:path";

import { spawnSync } from "node:child_process";
import {
  assertGitHubBodyProfile,
  withTemporaryBody,
} from "./lib/github-body.mjs";
import {
  parseReleaseNotes,
  releaseNotesPathFor,
} from "./lib/release-notes.mjs";
import {
  ensureGh,
  executeGh,
  resolveGitHubPushTarget,
} from "./lib/github-repository.mjs";
import {
  ensureClean,
  shellQuote,
  mainWorktree,
  parseWorktrees,
  removeMergedBranch,
  runGit,
  runGitPathList,
  spawnGit,
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
import {
  committedMaterial,
  declareMaterial,
  inventoryMaterial,
  materialCloseCommand,
  materialDeclareCommand,
  parseMaterialFlags,
} from "./lib/worktree-material.mjs";

const toolRoot = findLaunchpad();
const readTrackedTextAtHead = (root, path, displayPath) => {
  const tree = spawnGit(
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
  const blob = spawnGit(["-C", root, "cat-file", "blob", object]);
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
// clearing N entries costs one run, not N. Only disposable material may leave.
const ensureNoIgnoredMaterial = (
  path,
  receipt = { files: [], nestedRepositories: [] },
  { mainPath, workOrderId } = {},
) => {
  const reconciled = new Set([
    ...receipt.files.map((row) => row.source),
    ...(receipt.nestedRepositories ?? []).map((row) => `${row.source}/`),
  ]);
  const inventoried = new Map(
    (receipt.material ?? []).map((row) => [`${row.path}/`, row]),
  );
  const blockers = runGitPathList(path, [
    "ls-files",
    "-z",
    "--others",
    "--ignored",
    "--exclude-standard",
  ])
    .filter((candidate) => !reconciled.has(candidate))
    .map((candidate) => {
      const entry = describeIgnoredMaterial(path, candidate);
      const row = inventoried.get(candidate);
      if (row?.disposition === "undeclared") {
        entry.disposable = false;
        entry.classification = row.reason;
      }
      return entry;
    })
    .filter((entry) => !entry.disposable);
  const repositories = blockers
    .filter((entry) => entry.kind === "nested-repository")
    .map((entry) => ({ path: entry.path, worktree: path }));
  for (const entry of blockers)
    if (entry.kind === "nested-repository")
      entry.remedy = `${mainPath && workOrderId ? `after publication retry: ${materialCloseCommand(mainPath, workOrderId, repositories)}; to discard instead: ${materialCloseCommand(mainPath, workOrderId, repositories, "disposable")}; ` : ""}before review, declare and record a new executor completion: ${materialDeclareCommand(entry.path)}`;
  if (blockers.length > 0)
    throw new Error(
      `worktree contains ignored material and will not be removed (${blockers.length} ${blockers.length === 1 ? "entry" : "entries"}; undeclared material is retained):\n${blockers
        .map(
          (entry) =>
            `  ${entry.path}: ${entry.classification}; ${entry.remedy}`,
        )
        .join("\n")}`,
    );
};
const ensureMaterialClean = (root, material) => {
  const protectedUnits = new Set(
    material
      .filter((row) => row.lane === "intake" && row.disposition === "preserve")
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
const removePreservedWorktree = (mainPath, subject, material) => {
  // Git sees re-included intake repository directories as untracked. Only
  // these byte-proven units may require --force; writer/gate and dirt checks
  // still hold under the reservation lock immediately before this call.
  const units = new Set(
    material
      .filter((row) => row.lane === "intake" && row.disposition === "preserve")
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
  runGit(mainPath, [
    "worktree",
    "remove",
    ...(untracked.length ? ["--force"] : []),
    subject,
  ]);
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
    renderIntakeReconciliation,
    verifyPreservedMaterial,
    activeGateRuns,
    withWriterReservationLock,
    writerTeardownBlocker,
    material: declarations = [],
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
      material = inventoryMaterial(path, {
        declarations,
        overrides,
        overrideWorktree,
      });
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
        ensureNoIgnoredMaterial(path, receipt, { mainPath, workOrderId });
      } catch (error) {
        blockers.push(error.message);
      }
    if (blockers.length) {
      lines.push(
        `Derived worktree ${path}: kept (${blockers.join("; ")}); retry with node ${shellQuote(join(mainPath, "scripts/worktree.mjs"))} settle ${workOrderId}`,
      );
      continue;
    }
    if (!dryRun) {
      try {
        withWriterReservationLock(path, () => {
          const writer = writerTeardownBlocker(path);
          if (writer) throw new Error(writer);
          ensureMaterialClean(path, material);
          if (activeGateRuns(path).length) throw new Error("active gate run");
          const preserved = reconcileWorktreeMaterial(
            path,
            mainPath,
            workOrderId,
            { material },
          );
          process.stdout.write(renderIntakeReconciliation(preserved));
          ensureNoIgnoredMaterial(path, preserved, { mainPath, workOrderId });
          verifyPreservedMaterial(path, mainPath, preserved);
          const restoreBeaconPermissions = prepareBeaconDisposal(path);
          try {
            removePreservedWorktree(mainPath, path, material);
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
  if (action === "material") {
    const [flag, reasonFlag, reason, ...extra] = actionArgs;
    if (
      !["--disposable", "--preserve"].includes(flag) ||
      reasonFlag !== "--reason" ||
      !reason ||
      extra.length
    )
      throw new Error(
        "usage: worktree material <path> --disposable|--preserve --reason <text>",
      );
    const row = declareMaterial(repoRoot, workOrderId, flag.slice(2), reason);
    process.stdout.write(`Material declared: ${JSON.stringify(row)}\n`);
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
        !["--store", "--number", "--repository"].includes(args[i]) ||
        !args[i + 1] ||
        flags.has(args[i])
      )
        throw new Error(
          "usage: worktree observe-pr --store <episode-store> --number <N> [--repository HOST/OWNER/REPO]",
        );
      flags.set(args[i], args[i + 1]);
    }
    if (
      !flags.has("--store") ||
      !/^[1-9][0-9]*$/u.test(flags.get("--number") ?? "")
    )
      throw new Error(
        "usage: worktree observe-pr --store <episode-store> --number <N> [--repository HOST/OWNER/REPO]",
      );
    const { observePullRequest } =
      await import("./lib/pull-request-observer.mjs");
    observePullRequest({
      cwd: toolRoot,
      store: resolve(flags.get("--store")),
      number: Number(flags.get("--number")),
      repositoryId: flags.get("--repository"),
      log: (line) => process.stdout.write(`${line}\n`),
    });
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
  } else if (action === "publish" && actionArgs[0] === "--target") {
    // A target order publishes its source-change episode in the target
    // repository under an operator grant (WO-064); no launchpad branch moves.
    if (
      ![2, 3].includes(actionArgs.length) ||
      !actionArgs[1] ||
      (actionArgs.length === 3 &&
        actionArgs[2] !== "--require-deliverable-ready")
    )
      throw new Error(
        "usage: worktree publish WO-NNN --target <target-publish-request.json> [--require-deliverable-ready]",
      );
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
    });
  } else if (action === "publish") {
    if (
      actionArgs.length !== 4 ||
      !["--title", "--body-file"].includes(actionArgs[0]) ||
      !["--title", "--body-file"].includes(actionArgs[2]) ||
      actionArgs[0] === actionArgs[2] ||
      !actionArgs[1] ||
      !actionArgs[3]
    )
      throw new Error(
        'usage: worktree publish WO-NNN --title "<title>" --body-file <contained regular-file path>; quote titles with spaces',
      );
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
    const releaseNotesPath = releaseNotesPathFor(workOrderId, subject);
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
    const { flags, material: overrides } = parseMaterialFlags(actionArgs, [
      "--dry-run",
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
    const declarations = [
      ...committedMaterial(
        mainPath,
        workOrderId,
        process.env.DOTLN_RELEASE_MATERIAL_REVISION ?? "HEAD",
      ),
    ];
    const material = inventoryMaterial(subject, {
      declarations,
      overrides,
      overrideWorktree: subject,
    });
    ensureMaterialClean(
      mainPath,
      inventoryMaterial(mainPath, { declarations: [] }),
    );
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
    process.stdout.write(renderIntakeReconciliation(preview));
    ensureNoIgnoredMaterial(subject, preview, { mainPath, workOrderId });
    const control = statusProjection(readControl(subject, "HEAD"), workOrderId);
    if (control?.phase !== "closed" || control.workOrder !== workOrderId)
      throw new Error(`${workOrderId} has not passed final review and closed`);
    if (flags.includes("--dry-run")) {
      for (const line of reconcileDerivedWorktrees(mainPath, workOrderId, {
        dryRun: true,
        reconcileWorktreeMaterial,
        renderIntakeReconciliation,
        verifyPreservedMaterial,
        activeGateRuns,
        ...writerTeardown,
        material: declarations,
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
    const mergedDeclarations = [
      ...committedMaterial(mainPath, workOrderId, "origin/main"),
    ];
    const mergedMaterial = inventoryMaterial(subject, {
      declarations: mergedDeclarations,
      overrides,
      overrideWorktree: subject,
    });
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
    const { readGateChecks, recordGateChecks } =
      await import("./lib/gate-evidence.mjs");
    writerTeardown.withWriterReservationLock(subject, () => {
      const blocker = writerTeardown.writerTeardownBlocker(subject);
      if (blocker) throw new Error(blocker);
      ensureMaterialClean(subject, mergedMaterial);
      if (activeGateRuns(subject).length)
        throw new Error("active gate run; source retained");
      const reconciliation = reconcileWorktreeMaterial(
        subject,
        mainPath,
        workOrderId,
        { material: mergedMaterial },
      );
      process.stdout.write(renderIntakeReconciliation(reconciliation));
      const checks = readGateChecks(subject);
      if (checks.length) recordGateChecks(mainPath, checks);
      ensureNoIgnoredMaterial(subject, reconciliation, {
        mainPath,
        workOrderId,
      });
      verifyPreservedMaterial(subject, mainPath, reconciliation);
      const restoreBeaconPermissions = prepareBeaconDisposal(subject);
      try {
        removePreservedWorktree(mainPath, subject, mergedMaterial);
      } catch (error) {
        restoreBeaconPermissions();
        throw error;
      }
    });
    removeMergedBranch(mainPath, branch);
    for (const line of reconcileDerivedWorktrees(mainPath, workOrderId, {
      dryRun: false,
      reconcileWorktreeMaterial,
      renderIntakeReconciliation,
      verifyPreservedMaterial,
      activeGateRuns,
      ...writerTeardown,
      material: mergedDeclarations,
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
      reconcileWorktreeMaterial,
      verifyPreservedMaterial,
      renderIntakeReconciliation,
      activeGateRuns,
      ...writerTeardown,
      material: [
        ...committedMaterial(
          mainPath,
          workOrderId,
          process.env.DOTLN_RELEASE_MATERIAL_REVISION ?? "HEAD",
        ),
      ],
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
      "usage: worktree start WO-NNN <work-order-path> | worktree integrate WO-NNN [--intake-backup <archive.zip>] [--continue] | worktree publish WO-NNN --title <title> --body-file <path> | worktree publish WO-NNN --target <request.json> [--require-deliverable-ready] | worktree observe-pr --store <episode-store> --number <N> [--repository HOST/OWNER/REPO] | worktree resolve-pr --request <review-loop-request.json> | worktree finish WO-NNN [--dry-run] | worktree settle WO-NNN [--dry-run]",
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
