import { createHash } from "node:crypto";
import {
  lstatSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmdirSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { docPath, loadConfig, targetDocRelative } from "./config.mjs";
import { mainWorktree, parseWorktrees, runGit, spawnGit } from "./git.mjs";
import {
  HOST_GIT_READ,
  parseGitHubTarget,
  pushUrl,
} from "./github-repository.mjs";
import { containedRegularFile } from "./paths.mjs";
import {
  physicalDirectory,
  directoryIdentity,
  recordedRepositoryClone,
  readTargetOperation,
  recordTargetOperation,
  forgetTargetOperation,
} from "./target-worktrees.mjs";
import {
  targetRecordDestination,
  validateTargetRecordsCommit,
  verifyPendingRecordChanges,
} from "./target-records.mjs";
import {
  COMMITTED_AUTHORITY_GRANTS,
  readAuthorityGrantRegistry,
} from "./authority-grants.mjs";
import {
  authorizeRegisteredPublication,
  lintArtifacts,
  publishBoundTargetCommit,
} from "./target-publish.mjs";
import { assertGitHubBodyProfile } from "./github-body.mjs";
import { hasAiAttribution } from "../../packages/compiler/src/attribution.mjs";
import { checkLocalTerms } from "./terms.mjs";
import {
  PRIVATE_PATH,
  linesMatching,
  privatePathLines,
} from "./private-paths.mjs";
import { WorkerStore } from "../../packages/skeleton/dist/src/worker-store.js";

export function publishTargetPlanning({
  launchpad,
  repositoryId,
  base,
  from,
  branch,
  title,
  bodyFile,
  now = Date.now(),
  log = console.log,
}) {
  const refuse = (reason) => {
    throw new Error(`target planning publish refused: ${reason}`);
  };
  const repository = loadConfig(launchpad).repositories[repositoryId];
  if (!repository) refuse(`unknown repository ${repositoryId}`);
  if (!/^(?:[a-f0-9]{40}|[a-f0-9]{64})$/u.test(base ?? ""))
    refuse("base must be a full commit id");
  const branchParts = (branch ?? "").split("/");
  // "docs" is the outward branch type; the document directory is configured.
  if (
    branchParts.length !== 2 ||
    branchParts[0] !== "docs" ||
    !/^[a-z0-9]+(?:-[a-z0-9]+)*$/u.test(branchParts[1])
  )
    refuse("branch must be docs/<slug>");
  if (!/^docs(?:\([^()\r\n]+\))?!?: /u.test(title ?? ""))
    refuse(
      "title must use the conventional docs: or docs(scope): type for a planning commit",
    );
  const main = mainWorktree(launchpad);
  const clone = recordedRepositoryClone(main, repositoryId);
  if (!clone) refuse(`no clone recorded for ${repositoryId}`);
  physicalDirectory(clone);
  const key = createHash("sha256")
    .update(`${repositoryId}\0${branch}`)
    .digest("hex");
  const pending = readTargetOperation(main, "planning", key);
  if (!pending && runGit(clone, [...HOST_GIT_READ, "branch", "--list", branch]))
    refuse(`branch already exists: ${branch}`);
  runGit(clone, [...HOST_GIT_READ, "cat-file", "-e", `${base}^{commit}`]);
  const source = physicalDirectory(resolve(from));
  const files = [];
  const visit = (directory, prefix = "") => {
    for (const name of readdirSync(directory).sort()) {
      const path = prefix ? `${prefix}/${name}` : name;
      const file = join(directory, name),
        stat = lstatSync(file);
      if (stat.isSymbolicLink() || (!stat.isDirectory() && !stat.isFile()))
        refuse(`${path}: source is not a regular file or directory`);
      if (!["planning", "product"].includes(path.split("/")[0]))
        refuse(`${path}: only planning and product documents are admitted`);
      if (name.startsWith(".") || /(?:~|\.(?:swp|swo|bak))$/iu.test(name))
        refuse(
          `${path}: Finder metadata, hidden files and editor residue are not planning documents`,
        );
      if (stat.isDirectory()) visit(file, path);
      else {
        if (!path.includes("/") || path.includes("\\"))
          refuse(
            `${path}: document must be a normalized path under planning or product`,
          );
        if (!/\.(?:md|json|svg|png|jpe?g|webp|pdf)$/iu.test(name))
          refuse(
            `${path}: admitted planning files are Markdown, JSON, SVG, PNG, JPEG, WebP and PDF`,
          );
        const destination = targetDocRelative(repository, "docs", path);
        // Validate the base tree's ancestors before fetching or creating a worktree.
        const segments = destination.split("/");
        for (let length = 1; length <= segments.length; length++) {
          const at = segments.slice(0, length).join("/");
          const mode = runGit(clone, [
            ...HOST_GIT_READ,
            "ls-tree",
            "--format=%(objectmode)",
            base,
            "--",
            `:(literal)${at}`,
          ]);
          if (
            mode &&
            mode !== (length === segments.length ? "100644" : "040000")
          )
            refuse(`${destination}: base path is not a contained regular file`);
        }
        files.push({ path: destination, bytes: readFileSync(file) });
      }
    }
  };
  visit(source);
  if (!files.length) refuse("source directory has no documents");
  const bodyPath = resolve(bodyFile);
  if (!containedRegularFile(bodyPath, dirname(bodyPath)))
    refuse("body must be a contained regular file");
  const body = readFileSync(bodyPath, "utf8"),
    message = title;
  authorizeRegisteredPublication(
    repository,
    readAuthorityGrantRegistry(launchpad),
    now,
    `planning:${repositoryId}`,
  );
  const grantsFile = join(launchpad, COMMITTED_AUTHORITY_GRANTS);
  if (
    !containedRegularFile(grantsFile, launchpad) ||
    readFileSync(grantsFile, "utf8") !==
      runGit(
        launchpad,
        [...HOST_GIT_READ, "show", `HEAD:${COMMITTED_AUTHORITY_GRANTS}`],
        { trim: false, onFailure: () => null },
      )
  )
    refuse(
      `operator grant registry differs from committed authority: ${COMMITTED_AUTHORITY_GRANTS}`,
    );
  const boundUrl = pushUrl(clone),
    forge = parseGitHubTarget(boundUrl);
  lintArtifacts(main, [
    { kind: "branch", text: branch },
    { kind: "commit", text: message },
    { kind: "pr-title", text: title },
    { kind: "pr-body", text: body },
  ]);
  assertGitHubBodyProfile(body, "planning body");
  if (hasAiAttribution(title) || hasAiAttribution(body))
    refuse("planning publication contains AI attribution");
  if (
    checkLocalTerms(
      main,
      files.map((file) => ({
        name: file.path,
        text: file.bytes.toString("utf8"),
      })),
    ).status !== "present"
  )
    refuse("local-terms list absent");
  for (const file of files) {
    const [line] = privatePathLines(file.path, file.bytes.toString("utf8"));
    if (line !== undefined)
      refuse(
        `${file.path}:${line}: private absolute path; write a repository-relative path or a placeholder such as <home>/, <worktree>/ or <tmp>/`,
      );
  }
  // The title becomes the commit message and, with the body, the pull request
  // the forge renders as Markdown; both take the Markdown rule.
  if (linesMatching(PRIVATE_PATH, title).length)
    refuse(
      "pull-request title (also the commit message): private absolute path; write a repository-relative path or a placeholder such as <home>/, <worktree>/ or <tmp>/",
    );
  const [bodyLine] = linesMatching(PRIVATE_PATH, body);
  if (bodyLine !== undefined)
    refuse(
      `pull-request body line ${bodyLine}: private absolute path; write a repository-relative path or a placeholder such as <home>/, <worktree>/ or <tmp>/`,
    );
  runGit(clone, [...HOST_GIT_READ, "var", "GIT_AUTHOR_IDENT"]);
  const records = files.map((file) => ({
    kind: "planning",
    path: file.path,
    sha256: createHash("sha256").update(file.bytes).digest("hex"),
  }));
  const inputHash = createHash("sha256")
    .update(
      JSON.stringify({
        repositoryId,
        base,
        branch,
        title,
        body,
        boundUrl,
        records,
      }),
    )
    .digest("hex");
  const temporaryRoot = directoryIdentity(tmpdir());
  if (
    pending &&
    (pending.inputHash !== inputHash ||
      pending.clone !== clone ||
      dirname(pending.target) !== pending.scratch ||
      dirname(pending.scratch) !== temporaryRoot ||
      !pending.scratch.startsWith(
        join(temporaryRoot, "dotln-target-planning-"),
      ))
  )
    refuse(
      "pending publication differs from these inputs; preserved work was not changed",
    );
  runGit(clone, [
    ...HOST_GIT_READ,
    "fetch",
    "--no-tags",
    "origin",
    repository.baseBranch,
  ]);
  if (
    spawnGit([
      "-C",
      clone,
      ...HOST_GIT_READ,
      "merge-base",
      "--is-ancestor",
      base,
      `origin/${repository.baseBranch}`,
    ]).status !== 0
  )
    refuse(
      `base ${base} is not an ancestor of fetched origin/${repository.baseBranch}`,
    );
  const scratch =
    pending?.scratch ??
    mkdtempSync(join(temporaryRoot, "dotln-target-planning-"));
  const target = pending?.target ?? join(scratch, "worktree");
  const operation = { ...pending, inputHash, clone, scratch, target };
  recordTargetOperation(main, "planning", key, operation);
  try {
    const registration = parseWorktrees(clone).find(
      (row) => row.worktree === target,
    );
    if (registration && registration.branch !== `refs/heads/${branch}`)
      refuse("preserved worktree has a different branch");
    if (!registration) {
      if (existsSync(target))
        refuse("preserved directory is not a registered worktree");
      const existing = runGit(clone, [
        ...HOST_GIT_READ,
        "branch",
        "--list",
        branch,
      ]);
      runGit(clone, [
        ...HOST_GIT_READ,
        "worktree",
        "add",
        "-q",
        ...(existing
          ? [target, branch]
          : ["-b", branch, target, pending?.commit ?? base]),
      ]);
    }
    physicalDirectory(target);
    let commit = runGit(target, [...HOST_GIT_READ, "rev-parse", "HEAD"]);
    if (commit === base) {
      verifyPendingRecordChanges(target, records);
      for (const file of files) {
        const destination = targetRecordDestination(target, file.path);
        mkdirSync(dirname(destination), { recursive: true });
        writeFileSync(destination, file.bytes);
      }
      runGit(target, [
        ...HOST_GIT_READ,
        "add",
        "--",
        ...files.map((file) => `:(literal)${file.path}`),
      ]);
      runGit(target, [
        "-c",
        "core.hooksPath=/dev/null",
        "-c",
        "core.fsmonitor=false",
        "commit",
        "--allow-empty",
        "-qm",
        message,
      ]);
      commit = runGit(target, [...HOST_GIT_READ, "rev-parse", "HEAD"]);
    }
    if (runGit(target, [...HOST_GIT_READ, "status", "--porcelain"]))
      refuse("planning worktree is not clean");
    validateTargetRecordsCommit(
      target,
      { repositoryId, branch, commit: base },
      {
        repositoryId,
        branch,
        parent: base,
        commit,
        root: repository.documentationRoot,
        records,
      },
      repository,
    );
    if (
      runGit(target, [...HOST_GIT_READ, "log", "-1", "--format=%B"]) !== message
    )
      refuse("preserved commit message differs from the reviewed title");
    recordTargetOperation(main, "planning", key, { ...operation, commit });
    const publication = new WorkerStore(
      docPath(
        main,
        "control",
        "local/target-publications/planning",
        repositoryId,
        key,
      ),
    );
    const opened = publishBoundTargetCommit({
      target,
      sourceBranch: branch,
      commit,
      branch,
      title,
      body,
      repository,
      forge,
      boundUrl,
      publication,
      workstreamId: `planning:${repositoryId}:${key}`,
      now,
      log,
    });
    const links = files.map(({ path }) => ({ repositoryId, commit, path }));
    runGit(clone, [...HOST_GIT_READ, "worktree", "remove", target]);
    runGit(clone, [...HOST_GIT_READ, "branch", "-D", branch]);
    rmdirSync(scratch);
    forgetTargetOperation(main, "planning", key);
    for (const row of links) log(`${repositoryId} at ${commit}: ${row.path}`);
    return { ...opened, records: links };
  } catch (error) {
    throw new Error(
      `${error.message}; planning recovery retained at ${scratch}, worktree ${target} on ${branch}; retry the same target-publish command after correcting the cause`,
    );
  }
}
