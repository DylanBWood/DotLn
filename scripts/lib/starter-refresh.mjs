import { spawnSync } from "node:child_process";
import { createHash, randomUUID } from "node:crypto";
import {
  copyFileSync,
  chmodSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readlinkSync,
  realpathSync,
  rmSync,
  renameSync,
  writeFileSync,
  symlinkSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { basename, dirname, join } from "node:path";
import { parseWorktrees, redactPaths, runGit } from "./git.mjs";
import {
  HOST_GIT_READ,
  ensureGhFor,
  ensureRelease,
  parseGitHubTarget,
  pushAnnotatedTag,
  pushUrl,
  pushObservedCommit,
  remoteTagTarget,
} from "./github-repository.mjs";
import {
  physicalDirectory,
  recordedRepositoryClone,
} from "./target-worktrees.mjs";
import {
  COMMIT,
  assertReceiptParents,
  exportSiblings,
  manifestBuildHash,
  readDeclaration,
  receiptRecorded,
  writeReceipt,
} from "./siblings.mjs";
import { sha256Hex } from "./helpers.mjs";
import { CONFIG_FILENAME, docRelative, loadConfig } from "./config.mjs";
import {
  assertFinderMetadataTypes,
  isFinderMetadata,
} from "./finder-metadata.mjs";
import { namedStarterSeed, planStarterSeeds } from "./starter-seeds.mjs";

const git = (root, args, options) =>
  runGit(root, [...HOST_GIT_READ, ...args], options);
const paths = (root, args) =>
  git(root, [...args, "-z"], { trim: false })
    .split("\0")
    .filter(Boolean);
const ancestor = (root, before, after) =>
  git(root, ["merge-base", "--is-ancestor", before, after], {
    onFailure: () => false,
  }) !== false;
const manifestFile = "KIT-MANIFEST.json";
const harnessFile = ".claude/harness-manifest.json";
const clean = (root, observeScan) => {
  const scan = assertFinderMetadataTypes(root);
  observeScan?.(scan);
  return paths(root, [
    "status",
    "--porcelain=v1",
    "--untracked-files=all",
  ]).every(
    (entry) =>
      entry.startsWith("?? ") && isFinderMetadata(root, entry.slice(3)),
  );
};
const assertCommittedConfiguration = (root) => {
  if (
    lstatSync(join(root, CONFIG_FILENAME), { throwIfNoEntry: false }) &&
    !git(root, ["ls-files", "--", CONFIG_FILENAME])
  )
    throw new Error(
      `local ${CONFIG_FILENAME} is untracked or ignored; commit the intended configuration before refreshing the starter`,
    );
};
// A seed-only refresh may follow the first refresh of the same core release.
// Its existing tag must name an ancestor with a committed manifest for that
// exact core commit and tag; ancestry alone would accept an unrelated tag.
const priorReleaseRefresh = (checkout, existing, commit, tag, head) => {
  if (!ancestor(checkout, existing, commit)) return false;
  try {
    if (
      !/^100(?:644|755) blob /u.test(
        git(checkout, ["ls-tree", existing, "--", manifestFile]),
      )
    )
      return false;
    const manifest = JSON.parse(
      git(checkout, ["show", `${existing}:${manifestFile}`]),
    );
    return manifest.commit === head && manifest.tag === tag;
  } catch {
    return false;
  }
};
// Core's release tag name lands on the sibling's refresh commit. A retry
// finds its tag and Release, while a tag without matching release provenance
// refuses. The Release body names core's Release, not its changes.
const checkSiblingTag = ({ checkout, url, commit, tag, head, origin, row }) => {
  const existing = remoteTagTarget(url, tag);
  if (
    existing &&
    existing !== commit &&
    !priorReleaseRefresh(checkout, existing, commit, tag, head)
  )
    throw new Error(
      `starter tag ${tag} exists at ${existing}, not the refresh commit ${commit} or a proven prior refresh of the same core release; move nothing and inspect the starter's tags`,
    );
  return existing;
};
const ensureSiblingRelease = (options) => {
  const { checkout, url, commit, tag, head, origin, row } = options;
  const forge = parseGitHubTarget(url);
  ensureGhFor(checkout, forge);
  const existing = checkSiblingTag(options);
  if (!existing)
    pushAnnotatedTag(checkout, url, {
      sourceRef: "refs/remotes/origin/main",
      commit,
      tag,
      message: `Starter ${tag}\n\nCore commit: ${head}`,
      tagger: git(checkout, ["var", "GIT_COMMITTER_IDENT"]),
    });
  const displayName = loadConfig(checkout).release.displayName;
  const release = ensureRelease(
    checkout,
    forge,
    tag,
    `${displayName} ${tag}`,
    `Starter refresh to core's Release ${tag} (${origin.selector}); core commit ${head}.\n`,
    // The title carries the instance's display name, which it may rename
    // later; the body binds core's Release and commit and must match.
    { matchTitle: false },
  );
  row.siblingTag = { tag, outcome: existing ? "current" : "published" };
  row.siblingRelease = release === "existing" ? "current" : "created";
};
// Each private path carries its own label as an explicit pair; a position in
// a filtered list would mislabel the remaining paths (WO-218 FINAL-001).
const redact = (error, pairs) =>
  redactPaths(
    String(error.message ?? error),
    pairs.filter(([path]) => typeof path === "string" && path),
  );
const ownCommand = (root, script, action) => {
  const env = { ...process.env };
  for (const key of [
    "DOTLN_LAUNCHPAD",
    "GIT_DIR",
    "GIT_WORK_TREE",
    "GIT_COMMON_DIR",
    "GIT_INDEX_FILE",
    "GIT_PREFIX",
  ])
    delete env[key];
  const result = spawnSync(process.execPath, [script, action], {
    cwd: root,
    env,
    encoding: "utf8",
    maxBuffer: 16 * 1024 * 1024,
  });
  if (result.status !== 0)
    throw new Error(
      `starter ${script} ${action} failed: ${result.stderr || result.stdout || result.error?.message}`,
    );
};

// Fetch from the bound URL in a host-owned bare lane, as publication does, so
// the checkout's URL rewrites and executable transport configuration cannot
// redirect the read. Import only the resulting objects into its tracking ref.
const fetchMain = (checkout, url) => {
  const lane = realpathSync(
    mkdtempSync(join(tmpdir(), "dotln-starter-fetch-")),
  );
  try {
    git(lane, ["init", "--quiet", "--bare"]);
    git(lane, [
      "fetch",
      "--quiet",
      "--no-tags",
      url,
      "refs/heads/main:refs/heads/main",
    ]);
    const head = git(lane, ["rev-parse", "refs/heads/main^{commit}"]);
    const bundle = join(lane, "main.bundle");
    git(lane, ["bundle", "create", bundle, "refs/heads/main"]);
    // Unbundle reads a local file without a transport or URL rewrite. Running
    // a second fetch here would re-admit the checkout's transport config.
    git(checkout, ["bundle", "unbundle", bundle]);
    git(checkout, ["update-ref", "refs/remotes/origin/main", head]);
    return head;
  } finally {
    rmSync(lane, { recursive: true, force: true });
  }
};
const firstTree = (source, target) => {
  const incoming = paths(source, [
    "ls-files",
    "--cached",
    "--others",
    "--exclude-standard",
  ]);
  const prior = paths(target, ["ls-files"]);
  // Preflight the complete copy before replacing anything, including parents:
  // an initial symlink or directory may never redirect a file write.
  for (const path of incoming) {
    const from = lstatSync(join(source, path));
    if (!from.isFile() && !from.isSymbolicLink())
      throw new Error(`export entry is not a file: ${path}`);
    const pieces = path.split("/");
    for (let i = 1; i < pieces.length; i++) {
      const parent = lstatSync(join(target, ...pieces.slice(0, i)), {
        throwIfNoEntry: false,
      });
      if (parent && !parent.isDirectory())
        throw new Error(
          `first-export type collision: ${pieces.slice(0, i).join("/")}`,
        );
    }
    const to = lstatSync(join(target, path), { throwIfNoEntry: false });
    if (
      to &&
      !(from.isFile() && to.isFile()) &&
      !(from.isSymbolicLink() && to.isSymbolicLink())
    )
      throw new Error(`first-export type collision: ${path}`);
  }
  // Configuration already belongs to the destination before its first kit
  // manifest exists. Preserve its bytes and use its identity in the new seed.
  const configured = lstatSync(join(target, CONFIG_FILENAME), {
    throwIfNoEntry: false,
  });
  const displayName = loadConfig(configured ? target : source).release
    .displayName;
  const copied = incoming.filter(
    (path) => !(configured && path === CONFIG_FILENAME),
  );
  for (const path of copied) {
    const from = join(source, path),
      to = join(target, path);
    mkdirSync(dirname(to), { recursive: true });
    if (lstatSync(from).isSymbolicLink()) {
      rmSync(to, { force: true });
      symlinkSync(readlinkSync(from), to);
    } else {
      if (path === "README.md")
        writeFileSync(
          to,
          namedStarterSeed(path, readFileSync(from, "utf8"), displayName),
        );
      else copyFileSync(from, to);
      chmodSync(to, lstatSync(from).mode & 0o777);
    }
  }
  const set = new Set(copied);
  return {
    incoming: copied,
    kept: prior.filter((path) => !set.has(path)),
    replaced: prior.filter((path) => set.has(path)),
  };
};

/** Confirm that Git staged the verified bytes and modes. Clean filters and
 * line-ending conversion must not silently change the published tree. */
export function assertStagedTree(root, changed) {
  const algorithm = git(root, ["rev-parse", "--show-object-format"]);
  const index = new Map(
    git(root, ["ls-files", "--stage", "-z"], { trim: false })
      .split("\0")
      .filter(Boolean)
      .map((entry) => {
        const tab = entry.indexOf("\t");
        return [entry.slice(tab + 1), entry.slice(0, tab).split(" ")];
      }),
  );
  for (const path of changed) {
    const file = join(root, path);
    const stat = lstatSync(file, { throwIfNoEntry: false });
    const staged = index.get(path);
    if (!stat && !staged) continue;
    if (!stat || (!stat.isFile() && !stat.isSymbolicLink()))
      throw new Error(`staged tree differs from verified file: ${path}`);
    const bytes = stat.isSymbolicLink()
      ? Buffer.from(readlinkSync(file))
      : readFileSync(file);
    const mode = stat.isSymbolicLink()
      ? "120000"
      : stat.mode & 0o111
        ? "100755"
        : "100644";
    const hash = createHash(algorithm)
      .update(`blob ${bytes.length}\0`)
      .update(bytes)
      .digest("hex");
    if (
      !staged ||
      staged[0] !== mode ||
      staged[1] !== hash ||
      staged[2] !== "0"
    )
      throw new Error(
        `staged tree differs from verified bytes or mode: ${path}`,
      );
  }
}

// Keep cleanup ownership in ignored control state until every owned object is
// gone. A successful push must not let a later "current" retry lose its residue.
const cleanupFile = (main, sibling) =>
  docRelative(main, "control", "local", "starter-refresh", `${sibling}.json`);
const cleanupState = (main, sibling) => {
  const relative = cleanupFile(main, sibling);
  assertReceiptParents(main, relative);
  const file = join(main, relative);
  const stat = lstatSync(file, { throwIfNoEntry: false });
  if (stat && !stat.isFile())
    throw new Error("refresh cleanup record is not a regular file");
  let record = null;
  if (stat) {
    const bytes = readFileSync(file, "utf8");
    try {
      record = JSON.parse(bytes);
    } catch {
      throw new Error(`refresh cleanup record is invalid JSON: ${relative}`);
    }
    if (!record || typeof record !== "object" || Array.isArray(record))
      throw new Error(`refresh cleanup record is not an object: ${relative}`);
  }
  return { file, relative, record };
};
const saveCleanup = (main, sibling, record) => {
  const { file, relative } = cleanupState(main, sibling);
  git(main, ["check-ignore", "--quiet", "--no-index", relative]);
  if (git(main, ["ls-files", "--", relative]))
    throw new Error("refresh cleanup record must be ignored and untracked");
  mkdirSync(dirname(file), { recursive: true });
  const pending = `${file}.${randomUUID()}.tmp`;
  try {
    writeFileSync(pending, JSON.stringify(record) + "\n", {
      flag: "wx",
      mode: 0o600,
    });
    renameSync(pending, file);
  } finally {
    rmSync(pending, { force: true });
  }
};
const removeOwnedCleanup = (
  main,
  sibling,
  { file, relative, record },
  { dryRun },
) => {
  const {
    checkout,
    scratch,
    worktree,
    branch,
    commit,
    base,
    tree,
    device,
    inode,
  } = record;
  if (
    record.schemaVersion !== 1 ||
    !COMMIT.test(base ?? "") ||
    (tree !== null && !COMMIT.test(tree ?? "")) ||
    !Number.isInteger(device) ||
    !Number.isInteger(inode) ||
    typeof checkout !== "string" ||
    typeof scratch !== "string" ||
    dirname(scratch) !== (record.temporaryBase ?? dirname(scratch)) ||
    realpathSync(dirname(scratch)) !== dirname(scratch) ||
    !/^dotln-starter-refresh-[A-Za-z0-9]+$/u.test(basename(scratch)) ||
    worktree !== join(scratch, "worktree") ||
    (branch !== null &&
      (!/^dotln-starter-refresh-[a-f0-9-]{36}$/u.test(branch) ||
        !COMMIT.test(commit ?? "")))
  )
    throw new Error(
      "refresh cleanup ownership does not match the recorded checkout",
    );
  if (checkout !== recordedRepositoryClone(main, sibling))
    throw new Error(
      `refresh cleanup ownership does not match the recorded checkout; inspect the ignored ${relative}, restore its checkout with worktree clone ${sibling} <absolute-path>, retry close to finish cleanup, then record the replacement checkout`,
    );
  physicalDirectory(checkout);
  if (
    git(checkout, ["rev-parse", "--show-toplevel"]) !== checkout ||
    checkout === realpathSync(main)
  )
    throw new Error(
      "refresh cleanup checkout is not its physical Git top level",
    );
  const stat = lstatSync(scratch, { throwIfNoEntry: false });
  if (
    stat &&
    (!stat.isDirectory() ||
      realpathSync(scratch) !== scratch ||
      stat.dev !== device ||
      stat.ino !== inode)
  )
    throw new Error("refresh cleanup scratch identity changed");
  const registeredTrees = parseWorktrees(checkout);
  const registered = registeredTrees.find((item) => item.worktree === worktree);
  // A commit can succeed before its resulting hash is journaled. The tree
  // and parent saved before commit bind that exact one-commit transition.
  const preparedCommit =
    registered &&
    commit === null &&
    branch === null &&
    tree &&
    git(checkout, ["rev-list", "--parents", "-n", "1", registered.HEAD]) ===
      `${registered.HEAD} ${base}` &&
    git(checkout, ["rev-parse", `${registered.HEAD}^{tree}`]) === tree;
  if (
    registered &&
    (!registered.detached ||
      registered.branch ||
      (registered.HEAD !== (commit ?? base) && !preparedCommit))
  )
    throw new Error("refresh cleanup worktree identity changed");
  const ref = branch ? `refs/heads/${branch}` : null;
  const tip = ref
    ? git(checkout, ["rev-parse", "--verify", ref], { onFailure: () => null })
    : null;
  if (ref && registeredTrees.some((item) => item.branch === ref))
    throw new Error("refresh cleanup branch is checked out");
  if (tip && tip !== commit) throw new Error("refresh cleanup branch changed");
  if (dryRun) return true;
  if (registered) git(checkout, ["worktree", "remove", "--force", worktree]);
  if (tip) git(checkout, ["update-ref", "-d", ref, commit]);
  rmSync(scratch, { recursive: true, force: true });
  rmSync(file);
};

const finishCleanup = (main, sibling, { dryRun = false } = {}) => {
  const state = cleanupState(main, sibling);
  if (!state.record) return;
  try {
    return removeOwnedCleanup(main, sibling, state, { dryRun });
  } catch (error) {
    // Recovery knows its retained checkout before the caller admits a new
    // one. Keep those owned paths out of every cleanup refusal.
    throw new Error(
      redact(error, [
        [main, "<core main>"],
        [state.file, "<cleanup record>"],
        [tmpdir(), "<temporary base>"],
        [state.record.checkout, "<recorded checkout>"],
        [state.record.scratch, "<refresh scratch>"],
        [state.record.worktree, "<refresh worktree>"],
      ]),
    );
  }
};

const refreshOne = async ({ main, head, tag, dryRun }, sibling) => {
  const row = {
    sibling: sibling.id,
    outcome: "refused",
    firstExport: false,
    before: null,
    after: null,
    tag,
    coreCommit: head,
    manifestHash: null,
    buildHash: null,
    receipt: null,
    reason: null,
    actions: [],
    rewrittenSeeds: [],
    timings: {},
    finderMetadata: [],
  };
  let checkout,
    scratch,
    worktree,
    branch,
    ownership,
    cleanupOwned = false;
  const timed = async (phase, fn) => {
    const started = performance.now();
    try {
      return await fn();
    } finally {
      row.timings[phase] = Math.round(performance.now() - started);
    }
  };
  try {
    const cleanupPending = finishCleanup(main, sibling.id, { dryRun });
    if (dryRun && cleanupPending) {
      row.outcome = "preview";
      row.reason =
        "would finish pending disposable refresh cleanup; preview writes nothing";
      return row;
    }
    const mainHead = git(main, ["rev-parse", "HEAD"]);
    // A close preview leaves main at its current commit while judging the
    // merged head it would fast-forward to. The published close still requires
    // main and the immutable tag to name that exact head.
    if (
      (mainHead !== head && !(dryRun && ancestor(main, mainHead, head))) ||
      (!dryRun && git(main, ["rev-parse", `${tag}^{commit}`]) !== head)
    ) {
      row.outcome = "skipped";
      row.reason =
        "main has moved past the published tag; the next release refreshes the starter";
      return row;
    }
    checkout = recordedRepositoryClone(main, sibling.id);
    if (typeof checkout !== "string")
      throw new Error(
        `no recorded checkout; use worktree clone ${sibling.id} <absolute-path>`,
      );
    physicalDirectory(checkout);
    if (git(checkout, ["rev-parse", "--show-toplevel"]) !== checkout)
      throw new Error("recorded checkout is not a physical Git top level");
    if (realpathSync(main) === checkout)
      throw new Error("recorded checkout is core main itself");
    if (
      git(checkout, ["symbolic-ref", "--short", "HEAD"], {
        onFailure: () => "",
      }) !== "main"
    )
      throw new Error("recorded checkout must be on main");
    if (!clean(checkout, (scan) => row.finderMetadata.push(scan)))
      throw new Error("recorded checkout has tracked or untracked changes");
    assertCommittedConfiguration(checkout);
    const origin = parseGitHubTarget(
      git(main, ["config", "--get", "remote.origin.url"]),
    );
    const owner = origin.selector.split("/")[1];
    const url = pushUrl(checkout, {
      selector: `${origin.host}/${owner}/${sibling.id}`,
    });
    const local = git(checkout, ["rev-parse", "HEAD"]);
    row.before = local;
    const remote = fetchMain(checkout, url);
    if (!ancestor(checkout, local, remote))
      throw new Error("checkout main is ahead of or diverged from origin/main");
    const entry = git(checkout, ["ls-tree", remote, "--", manifestFile]);
    let prior, manifestBytes;
    if (entry) {
      if (
        !entry.startsWith("100644 blob ") &&
        !entry.startsWith("100755 blob ")
      )
        throw new Error(
          `first-export type collision or non-regular manifest: ${manifestFile}`,
        );
      manifestBytes = git(checkout, ["show", `${remote}:${manifestFile}`], {
        trim: false,
      });
      prior = JSON.parse(manifestBytes);
      if (!COMMIT.test(prior.commit ?? ""))
        throw new Error("starter manifest has no valid core commit");
      if (prior.commit !== head) {
        if (ancestor(main, head, prior.commit)) {
          row.outcome = "skipped";
          row.reason = "starter already carries a later core commit";
          return row;
        }
        if (!ancestor(main, prior.commit, head))
          throw new Error(
            "starter manifest names an unrelated or unavailable core commit",
          );
      }
    }
    const seedPlan = prior
      ? planStarterSeeds({
          main,
          head,
          checkout,
          remote,
          updatesKit: prior.commit !== head,
        })
      : [];
    if (dryRun) {
      row.seedChanges = seedPlan.map(({ path }) => path);
      row.siblingTag = { tag, outcome: "preview" };
      row.siblingRelease = "preview";
      row.siblingReleaseTitle = `${loadConfig(checkout).release.displayName} ${tag}`;
      row.outcome =
        prior?.commit === head && !seedPlan.length ? "current" : "preview";
      row.reason =
        row.outcome === "current"
          ? "already current; preview writes nothing"
          : `would refresh ${remote} to ${head}`;
      return row;
    }
    if (local !== remote) git(checkout, ["merge", "--ff-only", remote]);
    row.before = remote;
    row.after = remote;
    const receipt = () => {
      row.manifestHash = `sha256:${sha256Hex(manifestBytes)}`;
      if (!receiptRecorded(main, sibling.id, row.manifestHash))
        row.receipt = writeReceipt(
          main,
          {
            sibling: sibling.id,
            coreCommit: head,
            manifestBytes,
            buildHash: row.buildHash,
          },
          { pending: true },
        ).path;
    };
    if (prior?.commit === head && !seedPlan.length) {
      row.buildHash = manifestBuildHash(
        git(checkout, ["show", `${remote}:${harnessFile}`], { trim: false }),
        harnessFile,
      );
      receipt();
      ensureSiblingRelease({
        checkout,
        url,
        commit: remote,
        tag,
        head,
        origin,
        row,
      });
      row.outcome = "current";
      row.reason = "starter already carries the released commit";
      return row;
    }
    scratch = realpathSync(
      mkdtempSync(join(tmpdir(), "dotln-starter-refresh-")),
    );
    worktree = join(scratch, "worktree");
    const scratchStat = lstatSync(scratch);
    ownership = {
      schemaVersion: 1,
      checkout,
      scratch,
      temporaryBase: dirname(scratch),
      worktree,
      base: remote,
      tree: null,
      device: scratchStat.dev,
      inode: scratchStat.ino,
    };
    saveCleanup(main, sibling.id, { ...ownership, branch: null, commit: null });
    cleanupOwned = true;
    git(checkout, ["worktree", "add", "--quiet", "--detach", worktree, remote]);
    const { exportKit, planKitUpdate, applyKitUpdate, verifyExportTree } =
      await import("../launchpad.mjs");
    let bundle, allowed, required;
    if (!prior) {
      row.firstExport = true;
      const exported = join(scratch, "export");
      const result = await timed("preparation", () =>
        exportKit(exported, { launchpad: main }),
      );
      if (result.receipt.path)
        throw new Error("temporary export unexpectedly resolved to a sibling");
      if (result.commit !== head || result.tag !== tag)
        throw new Error(
          "prepared export does not name the released commit and tag",
        );
      bundle = result.bundle;
      const copied = await timed("update", () => firstTree(exported, worktree));
      row.kept = copied.kept;
      row.replaced = copied.replaced;
      allowed = new Set(copied.incoming);
      required = new Set(
        copied.incoming.filter((path) => !copied.replaced.includes(path)),
      );
      row.buildHash = manifestBuildHash(
        readFileSync(join(exported, harnessFile)),
        harnessFile,
      );
    } else {
      const planned = await timed("preparation", () =>
        planKitUpdate(worktree, { launchpad: main }),
      );
      if (planned.receipt.sibling !== sibling.id)
        throw new Error("update resolved to a different sibling");
      if (planned.commit !== head || planned.tag !== tag)
        throw new Error(
          "prepared update does not name the released commit and tag",
        );
      const refused = planned.plan.filter((entry) => entry.kind === "refuse");
      if (refused.length)
        throw new Error(
          `update refuses ${refused.map((entry) => `${entry.path} (${entry.reason})`).join(", ")}`,
        );
      row.actions = planned.actions.map(
        (action) =>
          `preserved/no opt-in: ${action.id} (${action.date}, ${action.kind})`,
      );
      bundle = planned.prepared.bundle;
      row.buildHash = planned.buildHash;
      required = new Set(
        planned.plan
          .filter((entry) => !entry.unchanged)
          .map((entry) => entry.path),
      );
      if (JSON.stringify(planned.manifest, null, 2) + "\n" !== manifestBytes)
        required.add(manifestFile);
      for (const seed of seedPlan) required.add(seed.path);
      for (const entry of planned.plan) {
        if (entry.kind !== "add" && entry.kind !== "replace") continue;
        const write = planned.candidates.get(entry.path);
        const stat = lstatSync(join(worktree, write.path), {
          throwIfNoEntry: false,
        });
        if (
          stat?.isFile() &&
          Boolean(stat.mode & 0o111) !== Boolean(write.mode & 0o111)
        )
          required.add(write.path);
      }
      allowed = new Set([...required, "CLAUDE.md"]);
      // Only committed, proven seed paths are admitted. The worktree starts at
      // the observed remote, so none of these writes can follow a local link.
      for (const seed of seedPlan) {
        const prepared = planned.prepared.writes.find(
          ({ path }) => path === seed.path,
        );
        if (!prepared || prepared.bytes.toString("utf8") !== seed.templateBytes)
          throw new Error(`prepared seed differs from plan: ${seed.path}`);
      }
      for (const seed of seedPlan) {
        const bytes =
          seed.path === "CLAUDE.md"
            ? planned.prepared.bundle.surfaces.get(seed.path)
            : seed.bytes;
        writeFileSync(join(worktree, seed.path), bytes);
        chmodSync(join(worktree, seed.path), 0o644);
      }
      await timed("update", () =>
        applyKitUpdate({
          ...planned,
          receipt: { sibling: null, reason: "receipt held until publication" },
        }),
      );
    }
    await timed("verification", async () => {
      await verifyExportTree(worktree, bundle, { instructionBlock: true });
      ownCommand(worktree, "scripts/launchpad.mjs", "verify");
    });
    manifestBytes = readFileSync(join(worktree, manifestFile));
    row.manifestHash = `sha256:${sha256Hex(manifestBytes)}`;
    git(worktree, ["add", "-A"]);
    const changed = paths(worktree, [
      "diff",
      "--cached",
      "--name-only",
      "--no-renames",
    ]);
    const unplanned = changed.filter((path) => !allowed.has(path)),
      unstaged = [...required].filter((path) => !changed.includes(path));
    if (unplanned.length || unstaged.length) {
      const raw = git(
        worktree,
        ["diff", "--cached", "--raw", "--no-renames", "--no-abbrev", "-z"],
        { trim: false },
      ).split("\0");
      const kinds = new Map(),
        statuses = new Map();
      for (let i = 0; i + 1 < raw.length; i += 2) {
        const [oldMode, newMode, oldId, newId, status] = raw[i]
          .slice(1)
          .split(" ");
        statuses.set(raw[i + 1], status);
        kinds.set(
          raw[i + 1],
          status === "A"
            ? newMode === "120000"
              ? "added link"
              : "added"
            : status === "D"
              ? "deleted"
              : oldId === newId
                ? `mode ${oldMode} to ${newMode}`
                : oldMode === newMode
                  ? "content"
                  : `content and mode ${oldMode} to ${newMode}`,
        );
      }
      const listed = (items) =>
        `${items
          .slice(0, 5)
          .map((path) =>
            kinds.has(path) ? `${path} (${kinds.get(path)})` : path,
          )
          .join(
            ", ",
          )}${items.length > 5 ? `, ... (${items.length} paths)` : ""}`;
      // Only an added path or an unstaged planned path can come from ignore
      // rules: a tracked path's change is staged whatever .gitignore says.
      // A tracked planned path that stayed unstaged did not fall to an ignore
      // rule either: Git stages a tracked path's change whatever the rules say.
      const ignoreRules =
        unstaged.some(
          (path) => !git(worktree, ["ls-files", "--", path], { trim: false }),
        ) || unplanned.some((path) => statuses.get(path) === "A");
      throw new Error(
        `staged change set differs from the export/update plan: ${[
          unplanned.length && `staged outside the plan: ${listed(unplanned)}`,
          unstaged.length && `planned but not staged: ${listed(unstaged)}`,
        ]
          .filter(Boolean)
          .join(
            "; ",
          )}. ${ignoreRules ? "One possible cause is ignore rules: the starter's .gitignore or the host's core.excludesFile can admit an untracked path or hide a planned one; compare the starter's .gitignore with scripts/kit/gitignore.template. " : ""}Inspect each named difference against the update plan; no commit was made or pushed. Retry refresh once it is resolved`,
      );
    }
    if (
      row.firstExport &&
      paths(worktree, ["diff", "--cached", "--name-only", "--diff-filter=D"])
        .length
    )
      throw new Error("first export must not delete an initial path");
    assertStagedTree(worktree, [...allowed]);
    ownership.tree = git(worktree, ["write-tree"]);
    saveCleanup(main, sibling.id, { ...ownership, branch: null, commit: null });
    await timed("commit", () => {
      // Commit hooks stay disabled. Signing uses the host's configured policy;
      // read-only Git's deliberately inert signing programs do not apply here.
      runGit(worktree, [
        "-c",
        "core.hooksPath=/dev/null",
        "-c",
        "core.fsmonitor=false",
        "commit",
        "--quiet",
        "-m",
        `Refresh starter to ${tag}`,
        "-m",
        `Core commit: ${head}\nManifest: ${row.manifestHash}\nBuild: ${row.buildHash}`,
      ]);
    });
    const commit = git(worktree, ["rev-parse", "HEAD"]);
    saveCleanup(main, sibling.id, { ...ownership, branch: null, commit });
    manifestBytes = git(worktree, ["show", `${commit}:${manifestFile}`], {
      encoding: null,
      trim: false,
    });
    row.manifestHash = `sha256:${sha256Hex(manifestBytes)}`;
    if (git(worktree, ["rev-parse", "HEAD^"]) !== remote)
      throw new Error(
        "refresh commit parent differs from observed remote main",
      );
    if (
      git(checkout, ["rev-parse", "HEAD"]) !== remote ||
      !clean(checkout, (scan) => row.finderMetadata.push(scan))
    )
      throw new Error("checkout changed while the refresh was prepared");
    assertCommittedConfiguration(checkout);
    branch = `dotln-starter-refresh-${randomUUID()}`;
    saveCleanup(main, sibling.id, { ...ownership, branch, commit });
    git(checkout, ["branch", branch, commit]);
    checkSiblingTag({ checkout, url, commit, tag, head, origin, row });
    ensureGhFor(checkout, parseGitHubTarget(url));
    await timed("push", () =>
      pushObservedCommit(checkout, url, branch, commit, "main"),
    );
    row.rewrittenSeeds = seedPlan.map(({ path }) => path);
    row.after = commit;
    git(checkout, ["merge", "--ff-only", commit]);
    git(checkout, ["update-ref", "refs/remotes/origin/main", commit, remote]);
    receipt();
    await timed("tag", () =>
      ensureSiblingRelease({ checkout, url, commit, tag, head, origin, row }),
    );
    row.outcome = "refreshed";
    row.reason = "verified starter commit published";
  } catch (error) {
    row.outcome = "refused";
    row.reason = redact(error, [
      [main, "<core main>"],
      [checkout, "<recorded checkout>"],
      [scratch, "<refresh scratch>"],
      [tmpdir(), "<temporary base>"],
    ]);
  } finally {
    try {
      if (cleanupOwned) finishCleanup(main, sibling.id);
      else if (scratch) rmSync(scratch, { recursive: true, force: true });
    } catch (error) {
      row.outcome = "refused";
      row.reason = `${row.reason ?? ""}; disposable refresh cleanup failed: ${redact(
        error,
        [
          [main, "<core main>"],
          [checkout, "<recorded checkout>"],
          [scratch, "<refresh scratch>"],
          [tmpdir(), "<temporary base>"],
        ],
      )}`;
    }
  }
  if (
    row.outcome === "refused" &&
    row.after &&
    row.before &&
    row.after !== row.before
  )
    row.reason += `; push landed: ${row.before} -> ${row.after}`;
  return row;
};

/** One independently recorded outcome per declared export sibling. */
export async function refreshStarters(options) {
  const siblings = exportSiblings(readDeclaration(options.main));
  const rows = [];
  for (const sibling of siblings) rows.push(await refreshOne(options, sibling));
  return rows;
}
