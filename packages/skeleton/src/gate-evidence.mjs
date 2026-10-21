import { observedSpawnSync as spawnSync } from "./gate-deadlines.mjs";
import { startDeadline } from "./gate-deadlines.mjs";
import {
  isKitRoot,
  packageDirectories,
  runtimeDirectoryNames,
  runtimeEntryName,
  runtimeInfo,
  runtimeModuleDirectory,
  runtimePackageNames,
  runtimeRead,
} from "./runtime-inputs.mjs";
import { createHash, randomUUID } from "node:crypto";
import {
  existsSync,
  lstatSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  readlinkSync,
  realpathSync,
  renameSync,
  rmdirSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import {
  dirname,
  isAbsolute,
  join,
  parse,
  relative,
  resolve,
  sep,
} from "node:path";

/** Shared with the suite fingerprint: ignored installation bytes are inputs.
 * @param {string} root */
export function gateInstalledInputRoots(root) {
  let runtimeRoots = [".runtime/harness"];
  try {
    /** @type {{profiles: {profile: {runtime: {snapshot: string}}}[]}} */
    const manifest = JSON.parse(
      readFileSync(join(root, ".claude/harness-manifest.json"), "utf8"),
    );
    const selected = manifest.profiles.map(
      (profile) => profile.profile.runtime.snapshot,
    );
    if (
      !selected.length ||
      selected.some(
        (path) =>
          typeof path !== "string" ||
          !/^\.runtime\/harness\/[a-f0-9]{16}$/.test(path),
      )
    )
      throw new Error("runtime selection unavailable");
    runtimeRoots = [...new Set(selected)].sort();
  } catch {
    // Older or unreadable installations retain every runtime byte as an input.
  }
  return [
    "node_modules",
    ...runtimeRoots,
    ...packageDirectories(root).flatMap((name) => [
      `packages/${name}/dist`,
      `packages/${name}/src`,
    ]),
  ];
}
/** A consumer pass also binds the installed runtime that Git does not track.
 * Core source evidence keeps its existing identity. Invalid aliases refuse
 * instead of attesting bytes outside the selected installation.
 * @param {string} root */
export function gateInstanceInputDigest(root) {
  if (!isKitRoot(root)) return undefined;
  root = realpathSync(root);
  const digest = createHash("sha256").update("dotln-instance-inputs-v1\0");
  // Check every existing component before any selection read, including the
  // parents of missing inputs. A missing descendant cannot hide an alias.
  /** @param {string} path @param {boolean} [allowFinalLink] */
  const containedInput = (path, allowFinalLink = false) => {
    let absolute = root;
    for (const part of path.split("/")) {
      absolute = join(absolute, part);
      const logical = relative(root, absolute);
      const info = runtimeInfo(root, logical);
      if (!info) return;
      if (
        info.isSymbolicLink() &&
        allowFinalLink &&
        absolute === join(root, path)
      )
        return;
      if (
        info.isSymbolicLink() ||
        runtimeRead(logical, () => realpathSync(absolute)) !== absolute
      )
        throw new Error(
          "Instance runtime input must stay within its selected installation",
        );
    }
  };
  for (const path of [
    "KIT-MANIFEST.json",
    ".claude/harness-manifest.json",
    "packages",
  ])
    containedInput(path);
  const generated = new Set([".claude/hooks", "CLAUDE.md"]);
  const manifestPath = join(root, ".claude/harness-manifest.json");
  if (existsSync(manifestPath)) {
    const manifest = runtimeRead(".claude/harness-manifest.json", () =>
      JSON.parse(readFileSync(manifestPath, "utf8")),
    );
    for (const file of manifest.installed ?? []) {
      const path = file.path;
      if (
        typeof path !== "string" ||
        path
          .split("/")
          .some((part) => !part || part === "." || part === "..") ||
        !/^(?:CLAUDE\.md|\.claude\/(?:hooks\/[^\n]+|agents\/dotln-worker\.md|settings\.json|skills\/dotln-[^/]+\/[^\n]+)|\.agents\/skills\/dotln-[^/]+\/[^\n]+|\.codex\/(?:config\.toml|hooks\.json|hooks\/[^\n]+))$/u.test(
          path,
        )
      )
        throw new Error("Instance harness input is not a generated surface");
      generated.add(path);
    }
  }
  // Match the harness-owned inventory, including unexpected hooks and skill
  // files. Local settings, transcripts and unrelated personal skills stay out.
  for (const directory of [".claude/skills", ".agents/skills"]) {
    containedInput(directory);
    for (const name of runtimeDirectoryNames(root, directory, true))
      if (name.startsWith("dotln-")) generated.add(`${directory}/${name}`);
  }
  /** @param {string} path @param {boolean} [runtime] */
  const visit = (path, runtime = false) => {
    const workspace =
      /^(\.runtime\/harness\/[a-f0-9]{16})\/node_modules\/@dotln\/([a-z0-9-]+)$/u.exec(
        path,
      );
    containedInput(path, Boolean(workspace));
    const absolute = join(root, path);
    const info = runtimeInfo(root, path);
    digest.update(path).update("\0");
    if (!info) {
      digest.update("absent\0");
      return;
    }
    if (info.isSymbolicLink() && workspace) {
      // Emit's workspace links point to directories visited in this same
      // snapshot. Bind the link text without following it during selection.
      const target = runtimeRead(path, () => readlinkSync(absolute));
      const selected = `${workspace[1]}/packages/${workspace[2]}`;
      if (target !== `../../packages/${workspace[2]}`)
        throw new Error(
          "Instance runtime workspace link differs from its selected package",
        );
      containedInput(selected);
      if (!runtimeInfo(root, selected)?.isDirectory())
        throw new Error(
          "Instance runtime workspace link has no selected package",
        );
      digest
        .update(`link:${Buffer.byteLength(target)}\0`)
        .update(target)
        .update("\0");
    } else if (info.isDirectory()) {
      digest.update("directory\0");
      for (const name of runtimeDirectoryNames(root, path))
        if (!runtime || runtimeEntryName(name))
          visit(`${path}/${name}`, runtime);
    } else if (info.isFile()) {
      const bytes = runtimeRead(path, () => readFileSync(absolute));
      digest
        .update(`file:${Boolean(info.mode & 0o111)}:${bytes.length}\0`)
        .update(bytes)
        .update("\0");
    } else
      throw new Error(
        "Instance runtime input must be a regular file or directory",
      );
  };
  for (const path of [
    ".claude/harness-manifest.json",
    ...[...generated].sort(),
  ])
    visit(path);
  for (const path of gateInstalledInputRoots(root).filter((path) =>
    path.startsWith(".runtime/"),
  ))
    visit(path, true);
  for (const name of runtimePackageNames(root)) {
    const path = `packages/${name}`;
    containedInput(path);
    if (!runtimeInfo(root, path)?.isDirectory())
      throw new Error(`Runtime package must be a regular directory: ${path}`);
    const modules = runtimeModuleDirectory(root, path);
    visit(`${path}/package.json`);
    if (modules) visit(`${path}/${modules}`, true);
  }
  return `sha256:${digest.digest("hex")}`;
}
/** Walk before normalizing parents: the kernel follows a directory symlink
 * before applying `..`, and follows a dangling final link when creating a file.
 * Native realpath retains on-disk case for every existing component.
 * The optional I/O snapshot lets a read observer use the same traversal
 * without recursively invoking its own wrapped filesystem methods.
 * @param {string} path
 * @param {{lstatSync: typeof lstatSync, readlinkSync: typeof readlinkSync, realpathSync: typeof realpathSync.native}} [io]
 * @returns {string} */
export function prospectiveRealpath(
  path,
  io = { lstatSync, readlinkSync, realpathSync: realpathSync.native },
) {
  let physical = parse(path).root;
  const pending = path.slice(physical.length).split(sep);
  let links = 0;
  while (pending.length) {
    const part = pending.shift();
    if (!part || part === ".") continue;
    if (part === "..") {
      physical = dirname(physical);
      continue;
    }
    const next = join(physical, part);
    let info;
    try {
      info = io.lstatSync(next);
    } catch (error) {
      if (/** @type {NodeJS.ErrnoException} */ (error).code !== "ENOENT")
        throw error;
      physical = next;
      continue;
    }
    if (info.isSymbolicLink()) {
      if (++links > 40)
        throw new Error("Gate input symlink traversal unavailable");
      const target = io.readlinkSync(next);
      if (isAbsolute(target)) physical = parse(target).root;
      pending.unshift(
        ...target.slice(isAbsolute(target) ? physical.length : 0).split(sep),
      );
    } else physical = io.realpathSync(next);
  }
  return physical;
}
/** Protect candidate-tree and installed-suite inputs, including possible inode
 * aliases. Ordinary ignored scratch is excluded; tracked files stay protected.
 * @param {string} root @param {string} path */
export function gateInputPath(root, path) {
  root = realpathSync.native(root);
  const lexical = resolve(root, path);
  const physical = prospectiveRealpath(
    isAbsolute(path) ? path : `${root}${sep}${path}`,
  );
  // A hard link can share an input's inode without sharing any path component.
  // Other names are unknown, so only single-link scratch is provably excluded.
  const destination = lstatSync(physical, { throwIfNoEntry: false });
  if (destination && !destination.isDirectory() && destination.nlink > 1)
    return true;
  const caseConfig = spawnSync(
    "git",
    ["config", "--bool", "--get", "core.ignorecase"],
    {
      cwd: root,
      encoding: "utf8",
    },
  );
  if (caseConfig.status !== 0 && caseConfig.status !== 1)
    throw new Error("Gate input case classification unavailable");
  const ignoreCase = caseConfig.stdout.trim() === "true";
  /** @param {string} value */
  const spelling = (value) => (ignoreCase ? value.toLowerCase() : value);
  const installed = gateInstalledInputRoots(root).map(spelling);
  return [...new Set([lexical, physical])].some((absolute) => {
    const local = relative(root, absolute);
    if (local === ".." || local.startsWith(`..${sep}`) || isAbsolute(local))
      return false;
    const matched = spelling(local);
    if (
      matched === "docs/control/local/harness/checks.json" ||
      matched.startsWith("docs/control/local/harness/check-history/")
    )
      return true;
    if (!local || matched === ".git" || matched.startsWith(`.git${sep}`))
      return true;
    const packageName = /^packages\/([^/]+)/.exec(matched)?.[1];
    if (packageName && !existsSync(join(root, "packages", packageName)))
      return true;
    if (/^packages\/[^/]+\/dist(?:\/|$)/.test(matched)) return true;
    if (
      installed.some(
        (input) =>
          matched === input ||
          matched.startsWith(`${input}/`) ||
          input.startsWith(`${matched}/`),
      )
    )
      return true;
    // Git refuses pathspecs below a symlink. Judge that lexical link entry
    // here; the physical destination is independently checked above.
    let gitPath = local;
    let ancestor = root;
    for (const part of local.split(sep)) {
      ancestor = join(ancestor, part);
      const info = lstatSync(ancestor, { throwIfNoEntry: false });
      if (!info) break;
      if (info.isSymbolicLink()) {
        gitPath = relative(root, ancestor);
        break;
      }
    }
    if (
      git(root, [
        "ls-files",
        "--cached",
        "-z",
        "--",
        `:(${ignoreCase ? "icase," : ""}literal)${gitPath}`,
      ]).length
    )
      return true;
    const ignored = spawnSync("git", ["check-ignore", "-q", "--", gitPath], {
      cwd: root,
    });
    if (ignored.status !== 0 && ignored.status !== 1)
      throw new Error("Gate input classification unavailable");
    return ignored.status !== 0;
  });
}

/** Only a selected order's records, with neither symlink escape nor inode
 * aliasing, can be written while a product gate reads its other inputs.
 * @param {string} root @param {string} path @param {string} order */
export function gateRecordPath(root, path, order) {
  if (!/^WO-\d{3}$/.test(order)) return false;
  root = realpathSync.native(root);
  // The code identity excludes the default document tree. A relocated record
  // tree needs that same identity boundary before it can be write-admitted.
  // Until then retain the full refusal, including at the old default paths.
  const config = join(root, "dotln.config.json");
  if (existsSync(config)) {
    try {
      const { version, roots = {} } = JSON.parse(readFileSync(config, "utf8"));
      if (
        version !== 1 ||
        !roots ||
        typeof roots !== "object" ||
        Array.isArray(roots) ||
        (roots.docs ?? "docs") !== "docs" ||
        Object.entries({
          evidence: "docs/evidence",
          verifications: "docs/verifications",
          finalReviews: "docs/final-reviews",
        }).some(([key, fallback]) => (roots[key] ?? fallback) !== fallback)
      )
        return false;
    } catch {
      return false;
    }
  }
  const lexical = resolve(root, path);
  const physical = prospectiveRealpath(
    isAbsolute(path) ? path : `${root}${sep}${path}`,
  );
  const info = lstatSync(physical, { throwIfNoEntry: false });
  if (info && !info.isDirectory() && info.nlink > 1) return false;
  /** @param {string} parent @param {string} child */
  const inside = (parent, child) => {
    const local = relative(parent, child);
    return (
      local === "" ||
      (!isAbsolute(local) && local !== ".." && !local.startsWith(`..${sep}`))
    );
  };
  return ["evidence", "verifications", "final-reviews"].some((kind) => {
    const directory = join(root, "docs", kind, order);
    // Resolve the directory itself too: a substituted record-root symlink
    // must not grant another part of the worktree or a foreign directory.
    return (
      prospectiveRealpath(directory) === directory &&
      inside(directory, lexical) &&
      inside(directory, physical)
    );
  });
}

/** @typedef {{contract: "gate-run-v1", runId: string, command: string, kind?: "product"|"document"|"machinery"|"review", pid: number, startedAt: string, processStartedAt: string|null}} GateRun */
/** @typedef {{contract: "gate-stop-v1", runId: string, requestedAt: string}} GateStop */
/** @param {string} root */
const gateRunsDirectory = (root) =>
  join(realpathSync(root), "docs/control/local/harness/active-gates");
const gateRunId = /^[a-f0-9-]{36}$/;
/** Every gate process names its own run and its ancestors' runs to its
 * children here, so a stop request for any of them reaches the whole tree
 * without signals to processes whose identity a sandbox cannot verify. */
export const GATE_RUN_ENVIRONMENT = "DOTLN_GATE_RUNS";
/** @param {NodeJS.ProcessEnv} [env] */
export const gateRunLineage = (env = process.env) =>
  (env[GATE_RUN_ENVIRONMENT] ?? "")
    .split(",")
    .filter((runId) => gateRunId.test(runId));
/** @param {string} root @param {string} runId */
const gateStopPath = (root, runId) =>
  join(gateRunsDirectory(root), `${runId}.stop`);
/** Run ids among the given lineage that carry a stop request. A gate polls
 * this at every boundary it owns and stops itself; nothing here signals a pid.
 * @param {string} root @param {readonly string[]} [runIds] */
export function gateStopRequested(root, runIds = gateRunLineage()) {
  return runIds.filter((runId) => existsSync(gateStopPath(root, runId)));
}
/** Ask every live gate in this worktree to stop, then wait a bounded time for
 * the markers to clear. The request is a file the running gate reads at its
 * next boundary; a gate that has not reached one yet keeps its request and
 * stays reported as active with its pids. Requests left by dead runs are swept.
 * @param {string} root @param {{waitMs?: number}} [options] */
export function requestGateStop(root, { waitMs = 20_000 } = {}) {
  const directory = gateRunsDirectory(root);
  const runs = activeGateRuns(root);
  /** @type {string[]} */
  let names = [];
  try {
    names = readdirSync(directory);
  } catch (error) {
    if (/** @type {NodeJS.ErrnoException} */ (error).code !== "ENOENT")
      throw error;
  }
  for (const name of names) {
    const runId = name.endsWith(".stop") ? name.slice(0, -5) : null;
    if (
      runId &&
      gateRunId.test(runId) &&
      !runs.some((run) => run.runId === runId)
    )
      try {
        unlinkSync(join(directory, name));
      } catch (error) {
        if (/** @type {NodeJS.ErrnoException} */ (error).code !== "ENOENT")
          throw error;
      }
  }
  const requestedAt = new Date().toISOString();
  for (const run of runs) {
    const path = gateStopPath(root, run.runId);
    const prepared = `${path}.${randomUUID()}.prepare`;
    writeFileSync(
      prepared,
      JSON.stringify({
        contract: "gate-stop-v1",
        runId: run.runId,
        requestedAt,
      }) + "\n",
      { flag: "wx", mode: 0o600 },
    );
    renameSync(prepared, path);
  }
  const deadline = Date.now() + Math.max(0, waitMs);
  let active = runs;
  while (active.length && Date.now() < deadline) {
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 250);
    active = activeGateRuns(root);
  }
  const view = (/** @type {GateRun} */ run) => ({
    runId: run.runId,
    command: run.command,
    pid: run.pid,
    startedAt: run.startedAt,
  });
  return {
    contract: "gate-stop-v1",
    requestedAt,
    requested: runs.map(view),
    stopped: runs
      .filter((run) => !active.some((row) => row.runId === run.runId))
      .map(view),
    active: active.map(view),
  };
}
/** A PID birth observation prevents reuse from reviving an old marker when ps
 * is available. Signal zero still distinguishes an exited owner in a sandbox.
 * @param {number} pid */
function gateProcessStart(pid) {
  const result = spawnSync("ps", ["-p", String(pid), "-o", "lstart="], {
    encoding: "utf8",
    timeout: 1000,
  });
  return result.status === 0 ? result.stdout.trim() || null : null;
}
/** @param {GateRun} run */
function gateOwnerAlive(run) {
  try {
    process.kill(run.pid, 0);
  } catch (error) {
    if (/** @type {NodeJS.ErrnoException} */ (error).code === "ESRCH")
      return false;
  }
  const started = gateProcessStart(run.pid);
  if (!started) return true;
  if (run.processStartedAt) return started === run.processStartedAt;
  // A legacy marker without a birth observation cannot belong to a process
  // born after that marker. Keep the fence when the observation is unavailable.
  const birth = Date.parse(started);
  return !Number.isFinite(birth) || birth <= Date.parse(run.startedAt);
}
/** Read only: dead markers never lock the tree and never let a stale observer
 * delete a newer run. Each run owns a unique, atomically published marker.
 * @param {string} root @returns {GateRun[]} */
export function activeGateRuns(root) {
  const directory = gateRunsDirectory(root);
  let names;
  try {
    names = readdirSync(directory);
  } catch (error) {
    if (/** @type {NodeJS.ErrnoException} */ (error).code === "ENOENT")
      return [];
    throw error;
  }
  return names
    .filter((name) => name.endsWith(".json"))
    .flatMap((name) => {
      let run;
      try {
        run = JSON.parse(readFileSync(join(directory, name), "utf8"));
      } catch (error) {
        if (/** @type {NodeJS.ErrnoException} */ (error).code === "ENOENT")
          return [];
        throw error;
      }
      if (
        run.contract !== "gate-run-v1" ||
        !/^[a-f0-9-]{36}$/.test(run.runId) ||
        name !== `${run.runId}.json` ||
        !Number.isSafeInteger(run.pid) ||
        run.pid <= 1 ||
        typeof run.command !== "string" ||
        !/^[a-zA-Z0-9 :./-]{1,160}$/.test(run.command) ||
        !Number.isFinite(Date.parse(run.startedAt)) ||
        !(
          run.processStartedAt === null ||
          typeof run.processStartedAt === "string"
        )
      )
        throw new Error("Malformed active gate marker");
      return gateOwnerAlive(run) ? [run] : [];
    });
}
/** Gate-owned writes (build, preparation and evidence) are internal operations;
 * this marker fences new agent tool dispatches, not the gate's subprocesses.
 * @param {string} root @param {string} command
 * @param {{kind?: "product"|"document"|"machinery"|"review"}} [options] */
export function beginGateRun(root, command, { kind } = {}) {
  if (!/^[a-zA-Z0-9 :./-]{1,160}$/.test(command))
    throw new Error("Gate command must be a bounded public label");
  const directory = gateRunsDirectory(root);
  mkdirSync(directory, { recursive: true });
  /** @type {GateRun} */
  const run = {
    contract: "gate-run-v1",
    runId: randomUUID(),
    command,
    ...(kind ? { kind } : {}),
    pid: process.pid,
    startedAt: new Date().toISOString(),
    processStartedAt: gateProcessStart(process.pid),
  };
  const path = join(directory, `${run.runId}.json`);
  const prepared = `${path}.prepare`;
  writeFileSync(prepared, JSON.stringify(run) + "\n", {
    flag: "wx",
    mode: 0o600,
  });
  renameSync(prepared, path);
  // Children inherit the lineage, so one stop request reaches every process
  // of this gate; a stop for an ancestor run stops this run too.
  const ancestors = gateRunLineage();
  process.env[GATE_RUN_ENVIRONMENT] = [...ancestors, run.runId].join(",");
  const lineage = [...ancestors, run.runId];
  // Resolved now: a fixture may remove its root before releasing the marker.
  const stopFile = join(directory, `${run.runId}.stop`);
  /** @param {string} file */
  const remove = (file) => {
    try {
      unlinkSync(file);
    } catch (error) {
      if (/** @type {NodeJS.ErrnoException} */ (error).code !== "ENOENT")
        throw error;
    }
  };
  const release = () => {
    process.removeListener("exit", release);
    const remaining = gateRunLineage().filter((id) => id !== run.runId);
    if (remaining.length)
      process.env[GATE_RUN_ENVIRONMENT] = remaining.join(",");
    else delete process.env[GATE_RUN_ENVIRONMENT];
    remove(stopFile);
    remove(path);
  };
  process.once("exit", release);
  return {
    run,
    release,
    /** True once a stop was requested for this run or an ancestor run. */
    stopRequested: () => gateStopRequested(root, lineage).length > 0,
  };
}

/** @typedef {{exitCode: number, executed: boolean, name?: string, durationMs?: number, finishedAt?: string, reused?: boolean, sourceRow?: {location?: string, task?: string, codeIdentity?: string}, failureKind?: string, timedOut?: boolean, stopped?: boolean, partial?: unknown, excludedSuites?: unknown, output?: string, outputRef?: string, cases?: GateDiagnostic[], taskTimeline?: GateDiagnostic[]}} GateDiagnostic */
/** @typedef {{originMain: string, main: string, tags: {count: number|"unreadable", newest: string}, dotlnRefs: number|"unreadable"}} SharedRefs */
/** @typedef {GateDiagnostic & {checkId: string, treeHash: string, codeIdentity?: string, instanceInputDigest?: string, subject: string, durationMs: number, evidenceRef: string, recordedAt: string, requiredSuites?: string[], identityUnchanged?: boolean, buildOutputUnchanged?: boolean, buildOutputAttested?: boolean, memory?: {failure?: unknown}, abandonedRoots?: unknown[], sharedRefs?: {start: SharedRefs, end: SharedRefs}}} GateCheck */
/** @param {string} root @param {string[]} args */
function git(root, args) {
  const run = spawnSync("git", args, {
    cwd: root,
    encoding: "utf8",
    maxBuffer: 32 * 1024 * 1024,
  });
  if (run.status !== 0)
    throw new Error(`Tree observation failed: git ${args[0]}`);
  return run.stdout;
}

/** Small diagnostic snapshot of refs shared by linked worktrees. It never
 * participates in the gate's subject or verdict. Newest means tagger date,
 * with the full tag name breaking ties; lightweight tags are excluded.
 * Failed reads retain unreadable fields, never partial output or invented
 * counts. A clean unresolved branch read is absent, including a ref that
 * exists but cannot resolve to a commit.
 * @param {string} root @returns {SharedRefs} */
export function readSharedRefs(root) {
  /** @param {string[]} args @param {boolean} [unresolvedIsAbsent]
   * @returns {string|undefined} */
  const observe = (args, unresolvedIsAbsent = false) => {
    try {
      const result = spawnSync("git", args, {
        cwd: root,
        encoding: "utf8",
        maxBuffer: 32 * 1024 * 1024,
      });
      if (result.status === 0) return result.stdout;
      if (unresolvedIsAbsent && result.status === 1) return "absent";
      return undefined;
    } catch {
      return undefined;
    }
  };
  /** @param {string} ref */
  const commit = (ref) =>
    observe(
      ["rev-parse", "--verify", "--quiet", `${ref}^{commit}`],
      true,
    )?.trim() || "unreadable";
  const tags = observe([
    "for-each-ref",
    "--sort=refname",
    "--sort=-taggerdate",
    "--format=%(objecttype) %(refname:strip=2)",
    "refs/tags/v*",
  ])
    ?.split("\n")
    .filter((line) => line.startsWith("tag "))
    .map((line) => line.slice(4));
  const dotln = observe(["for-each-ref", "--format=%(refname)", "refs/dotln/"]);
  return {
    originMain: commit("refs/remotes/origin/main"),
    main: commit("refs/heads/main"),
    tags:
      tags === undefined
        ? { count: "unreadable", newest: "unreadable" }
        : { count: tags.length, newest: tags[0] ?? "absent" },
    dotlnRefs:
      dotln === undefined
        ? "unreadable"
        : dotln.split("\n").filter(Boolean).length,
  };
}
/** Git's own object framing, without writing an index or an object. @param {string} type @param {Buffer} bytes @param {string} algorithm */
const objectHash = (type, bytes, algorithm) =>
  createHash(algorithm)
    .update(`${type} ${bytes.length}\0`)
    .update(bytes)
    .digest("hex");

/** Exact candidate Git tree identity, including uncommitted and untracked files.
 * Ignored host evidence stays outside the tree. A re-included untracked intake
 * directory is private source material, not a candidate Git entry; tracked
 * intake files and ordinary untracked source still participate. Git filters
 * are applied by hash-object; this never writes
 * the shared object database or the user's index.
 * @param {string} root
 */
export function gateTreeHash(root) {
  const algorithm = git(root, ["rev-parse", "--show-object-format"]).trim();
  const staged = git(root, ["ls-files", "--stage", "-z"])
    .split("\0")
    .filter(Boolean);
  /** @type {Map<string, string>} */
  const modes = new Map();
  for (const row of staged) {
    const match = /^(\d+) [a-f0-9]+ (\d)\t([\s\S]+)$/.exec(row);
    if (!match || match[2] !== "0" || !match[3] || !match[1])
      throw new Error("Unmerged tree cannot carry gate evidence");
    modes.set(match[3], match[1]);
  }
  for (const path of git(root, [
    "ls-files",
    "--others",
    "--exclude-standard",
    "-z",
  ])
    .split("\0")
    .filter(Boolean)) {
    if (
      path.startsWith("docs/intake/") &&
      path.endsWith("/") &&
      lstatSync(join(root, path)).isDirectory()
    )
      continue;
    modes.set(path, "100644");
  }
  const attributes = spawnSync(
    "git",
    [
      "check-attr",
      "-z",
      "--stdin",
      "filter",
      "text",
      "eol",
      "working-tree-encoding",
    ],
    {
      cwd: root,
      encoding: "utf8",
      input: [...modes.keys()].join("\0") + "\0",
      maxBuffer: 32 * 1024 * 1024,
    },
  );
  if (attributes.status !== 0)
    throw new Error("Git attribute observation unavailable");
  const fields = attributes.stdout.split("\0");
  const filtered = new Set();
  for (let index = 0; index + 2 < fields.length; index += 3)
    if (!["unspecified", "unset"].includes(fields[index + 2] ?? ""))
      filtered.add(fields[index]);
  const autocrlf = spawnSync("git", ["config", "--get", "core.autocrlf"], {
    cwd: root,
    encoding: "utf8",
  }).stdout.trim();
  const fileMode =
    spawnSync("git", ["config", "--bool", "core.filemode"], {
      cwd: root,
      encoding: "utf8",
    }).stdout.trim() !== "false";
  /** @typedef {{mode: string, hash?: string, children?: Map<string, TreeEntry>}} TreeEntry */
  /** @type {Map<string, TreeEntry>} */
  const tree = new Map();
  for (const [path, indexedMode] of modes) {
    const absolute = join(root, path);
    let stat;
    try {
      stat = lstatSync(absolute);
    } catch (error) {
      if (/** @type {NodeJS.ErrnoException} */ (error).code === "ENOENT")
        continue;
      throw error;
    }
    if (indexedMode === "160000")
      throw new Error("Submodule gate evidence needs an explicit adapter");
    if (!stat.isFile() && !stat.isSymbolicLink())
      throw new Error("Unsupported candidate tree entry");
    const mode = stat.isSymbolicLink()
      ? "120000"
      : fileMode
        ? stat.mode & 0o111
          ? "100755"
          : "100644"
        : indexedMode;
    const bytes = stat.isSymbolicLink()
      ? Buffer.from(readlinkSync(absolute))
      : readFileSync(absolute);
    // The project's generated attribute does not transform content. Ask Git only
    // when attributes can select a filter, to avoid a process per ordinary file.
    let hash = objectHash("blob", bytes, algorithm);
    if (
      !stat.isSymbolicLink() &&
      (filtered.has(path) || ["true", "input"].includes(autocrlf))
    ) {
      const converted = spawnSync(
        "git",
        ["hash-object", "--path", path, "--stdin"],
        { cwd: root, input: bytes, encoding: "utf8" },
      );
      if (converted.status !== 0)
        throw new Error("Git content conversion unavailable");
      hash = converted.stdout.trim();
    }
    const names = path.split("/");
    let entries = tree;
    for (const name of names.slice(0, -1)) {
      if (!entries.has(name))
        entries.set(name, { mode: "40000", children: new Map() });
      const children = entries.get(name)?.children;
      if (!children) throw new Error("Candidate file/directory collision");
      entries = children;
    }
    entries.set(names.at(-1) ?? "", { mode, hash });
  }
  /** @param {Map<string, TreeEntry>} entries @returns {string} */
  function hashTree(entries) {
    const rows = [...entries].sort(([a, av], [b, bv]) =>
      Buffer.compare(
        Buffer.from(a + (av.children ? "/" : "")),
        Buffer.from(b + (bv.children ? "/" : "")),
      ),
    );
    return objectHash(
      "tree",
      Buffer.concat(
        rows.map(([name, entry]) =>
          Buffer.concat([
            Buffer.from(`${entry.mode} ${name}\0`),
            Buffer.from(
              entry.children ? hashTree(entry.children) : (entry.hash ?? ""),
              "hex",
            ),
          ]),
        ),
      ),
      algorithm,
    );
  }
  return hashTree(tree);
}

/** @param {string} root */
export const checksPath = (root) =>
  join(root, "docs/control/local/harness/checks.json");

/** A wait needs the outcome of one evidence invocation, since that invocation
 * can record a failing npm row followed by a passing diff row, or reuse cached
 * rows. These ignored observations do not change any gate check or event. */
/** @param {string} root */
const gateOutcomesDirectory = (root) =>
  join(root, "docs/control/local/harness/gate-outcomes");
/** @param {string} root @param {{runId:string,treeHash:string,status:"passed"|"failed"|"no-row"}} outcome */
export function recordGateOutcome(root, outcome) {
  if (
    !gateRunId.test(outcome.runId) ||
    !/^[a-f0-9]{40,64}$/.test(outcome.treeHash)
  )
    throw new Error("Invalid gate outcome identity");
  const directory = gateOutcomesDirectory(root);
  mkdirSync(directory, { recursive: true, mode: 0o700 });
  const path = join(directory, `${outcome.runId}.json`);
  const prepared = `${path}.${randomUUID()}.prepare`;
  writeFileSync(
    prepared,
    JSON.stringify({ ...outcome, completedAt: new Date().toISOString() }) +
      "\n",
    { flag: "wx", mode: 0o600 },
  );
  renameSync(prepared, path);
}
/** @param {string} root @param {string} treeHash @param {readonly string[]} [runIds] */
export function latestGateOutcome(root, treeHash, runIds = []) {
  let names;
  try {
    names = readdirSync(gateOutcomesDirectory(root));
  } catch (error) {
    if (/** @type {NodeJS.ErrnoException} */ (error).code === "ENOENT")
      return null;
    throw error;
  }
  const selected = names
    .filter(
      (name) =>
        gateRunId.test(name.slice(0, -5)) &&
        name.endsWith(".json") &&
        (!runIds.length || runIds.includes(name.slice(0, -5))),
    )
    .flatMap((name) => {
      try {
        const row = JSON.parse(
          readFileSync(join(gateOutcomesDirectory(root), name), "utf8"),
        );
        return row.runId === name.slice(0, -5) &&
          row.treeHash === treeHash &&
          ["passed", "failed", "no-row"].includes(row.status) &&
          Number.isFinite(Date.parse(row.completedAt))
          ? [row]
          : [];
      } catch {
        // A malformed ignored observation cannot block a valid recorded row.
        return [];
      }
    });
  return (
    selected
      .sort((a, b) => a.completedAt.localeCompare(b.completedAt))
      .at(-1) ?? null
  );
}

/** Product evidence follows tracked and non-ignored untracked source bytes,
 * independent of staging, reports and generated projections. A path Git marks
 * `dotln-documentation` (the package
 * READMEs no suite reads) is documentation for a reader, never product code,
 * so editing it after a gate leaves the gate's key intact; a README a test
 * reads as an input stays unmarked and counts (WO-115 D026).
 * @param {string} root @param {string} [revision] */
export function gateCodeIdentity(root, revision) {
  /** @type {{path:string,mode?:string,object?:string}[]} */
  const entries = revision
    ? git(root, ["ls-tree", "-r", "-z", revision])
        .split("\0")
        .filter(Boolean)
        .map((row) => {
          const match = /^(\d+) (?:blob|commit) ([a-f0-9]+)\t([\s\S]+)$/.exec(
            row,
          );
          if (!match || !match[1] || !match[2] || !match[3])
            throw new Error("Unsupported committed code entry");
          return { path: match[3], mode: match[1], object: match[2] };
        })
    : [
        ...new Set(
          git(root, [
            "ls-files",
            "--cached",
            "--others",
            "--exclude-standard",
            "-z",
          ])
            .split("\0")
            .filter(Boolean),
        ),
      ].map((path) => ({ path }));
  // A submodule is a pointer the tree records: its identity is the commit it
  // names, never the nested working tree. In the working tree the index holds
  // that pointer.
  if (!revision)
    for (const row of git(root, ["ls-files", "-s", "-z"]).split("\0")) {
      const pointer = /^160000 ([0-9a-f]+) \d+\t(.+)$/su.exec(row);
      if (!pointer) continue;
      const entry = entries.find((candidate) => candidate.path === pointer[2]);
      if (entry) Object.assign(entry, { mode: "160000", object: pointer[1] });
    }
  const attributes = spawnSync(
    "git",
    [
      "check-attr",
      ...(revision ? [`--source=${revision}`] : []),
      "-z",
      "--stdin",
      "dotln-generated",
      "dotln-documentation",
    ],
    {
      cwd: root,
      encoding: "utf8",
      input: entries.map((row) => row.path).join("\0") + "\0",
      maxBuffer: 32 * 1024 * 1024,
    },
  );
  if (attributes.status !== 0)
    throw new Error("Generated source classification unavailable");
  const fields = attributes.stdout.split("\0"),
    excluded = new Set();
  for (let index = 0; index + 2 < fields.length; index += 3)
    if (fields[index + 2] === "set") excluded.add(fields[index]);
  const selected = entries
    .filter(
      ({ path }) =>
        path === "docs/control/outward-vocabulary.json" ||
        !(
          /^(?:docs|\.claude|\.agents)\//.test(path) ||
          /^[^/]+\.md$/i.test(path) ||
          excluded.has(path)
        ),
    )
    .sort((a, b) => a.path.localeCompare(b.path, "en"));
  const blobs = new Map();
  const committed = selected.filter((row) => row.mode !== "160000");
  if (revision && committed.length) {
    const result = spawnSync("git", ["cat-file", "--batch"], {
      cwd: root,
      input: committed.map((row) => row.object).join("\n") + "\n",
      maxBuffer: 128 * 1024 * 1024,
    });
    if (result.status !== 0)
      throw new Error("Committed code bytes unavailable");
    const output = Buffer.from(result.stdout);
    let offset = 0;
    for (const row of committed) {
      const end = output.indexOf(10, offset),
        header = output.subarray(offset, end).toString("utf8");
      const match = /^[a-f0-9]+ blob (\d+)$/.exec(header);
      if (!match) throw new Error("Unsupported committed code object");
      const size = Number(match[1]);
      blobs.set(row.path, output.subarray(end + 1, end + 1 + size));
      offset = end + size + 2;
    }
  }
  const digest = createHash("sha256").update("dotln-code-v1\0");
  for (const row of selected) {
    let bytes, mode;
    if (row.mode === "160000") {
      if (typeof row.object !== "string")
        throw new Error(`Submodule object id unavailable: ${row.path}`);
      bytes = Buffer.from(row.object);
      mode = "gitlink";
    } else if (revision) {
      if (row.mode === "120000")
        throw new Error(
          `Code identity does not support symbolic source aliases: ${row.path}`,
        );
      bytes = blobs.get(row.path);
      mode = row.mode === "100755" ? "executable" : "file";
    } else {
      const absolute = join(root, row.path),
        stat = lstatSync(absolute, { throwIfNoEntry: false });
      if (!stat) continue;
      if (stat.isSymbolicLink())
        throw new Error(
          `Code identity does not support symbolic source aliases: ${row.path}`,
        );
      if (!stat.isFile()) throw new Error("Unsupported code identity entry");
      bytes = readFileSync(absolute);
      mode = stat.mode & 0o111 ? "executable" : "file";
    }
    digest.update(`${row.path}\0${mode}\0${bytes.length}\0`).update(bytes);
  }
  return digest.digest("hex");
}
/** The hot index stays bounded; older executable observations remain addressed
 * by tree for reuse and meter history. Suite stdout is not an evidence field.
 */
export const gateCacheRows = 256;
/** @param {GateCheck[]} rows */
const uniqueChecks = (rows) => [
  ...new Map(rows.map((row) => [JSON.stringify(row), row])).values(),
];
/** @param {string} root */
const archiveDirectory = (root) =>
  join(dirname(checksPath(root)), "check-history");
/** @param {string} path @returns {GateCheck[]} */
function readChecksFile(path) {
  if (!existsSync(path)) return [];
  const rows = JSON.parse(readFileSync(path, "utf8"));
  if (!Array.isArray(rows)) throw new Error("Malformed host gate evidence");
  return rows;
}
/** @param {string} root @param {string} [treeHash] @returns {GateCheck[]} */
export function readGateChecks(root, treeHash) {
  const path = checksPath(root);
  // Writers archive evictions before replacing the hot index. Reading the
  // hot rows first therefore cannot miss a row moved during this observation.
  const hot = readChecksFile(path);
  const directory = archiveDirectory(root);
  const archives = treeHash
    ? /^[a-f0-9]{40,64}$/.test(treeHash)
      ? [`${treeHash}.json`]
      : []
    : existsSync(directory)
      ? readdirSync(directory).filter((name) =>
          /^(?:[a-f0-9]{40,64}|legacy)\.json$/.test(name),
        )
      : [];
  const rows = uniqueChecks([
    ...archives.flatMap((name) => readChecksFile(join(directory, name))),
    ...hot,
  ]);
  return (
    treeHash ? rows.filter((row) => row.treeHash === treeHash) : rows
  ).sort((a, b) => (a.recordedAt ?? "").localeCompare(b.recordedAt ?? ""));
}
/** @param {string} root @param {GateCheck[]} additions
 * @param {{sourceRoot?: string}} [options] */
export function recordGateChecks(root, additions, { sourceRoot } = {}) {
  const path = checksPath(root);
  mkdirSync(dirname(path), { recursive: true });
  // Concurrent suites and sessions share this cache. Serialize the short
  // read/replace transaction so one successful record cannot erase another.
  const lock = `${path}.lock`;
  const deadline = startDeadline("gate-evidence:record-lock", 5000);
  for (;;) {
    try {
      mkdirSync(lock);
      deadline.finish();
      break;
    } catch (error) {
      if (/** @type {NodeJS.ErrnoException} */ (error).code !== "EEXIST")
        throw new Error(
          "Host gate evidence lock unavailable; no evidence overwritten",
        );
      deadline.check();
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 10);
    }
  }
  try {
    /** @template {GateDiagnostic} T @param {T} row @returns {Omit<T, "output">} */
    const retainDiagnostic = (row) => {
      let { output, ...metadata } = row;
      if (
        sourceRoot &&
        !output &&
        row.outputRef &&
        (row.exitCode !== 0 || !row.executed)
      ) {
        const expected =
          /^docs\/control\/local\/harness\/check-output\/([a-f0-9]{64})\.log$/.exec(
            row.outputRef,
          );
        if (expected) {
          const source = join(realpathSync(sourceRoot), row.outputRef);
          if (
            existsSync(source) &&
            realpathSync(source) === source &&
            lstatSync(source).isFile()
          ) {
            const bytes = readFileSync(source, "utf8");
            if (
              createHash("sha256").update(bytes).digest("hex") === expected[1]
            )
              output = bytes;
          }
        }
      }
      if (row.cases) metadata.cases = row.cases.map(retainDiagnostic);
      if (row.taskTimeline)
        metadata.taskTimeline = row.taskTimeline.map(retainDiagnostic);
      if (row.exitCode === 0 && row.executed) delete metadata.outputRef;
      // Passing stdout was only a transient diagnostic. Failed suite and case
      // output share addressed logs; evidence lookup parses metadata alone.
      if (output && (row.exitCode !== 0 || !row.executed)) {
        const digest = createHash("sha256").update(output).digest("hex");
        const outputRef = `docs/control/local/harness/check-output/${digest}.log`;
        mkdirSync(dirname(join(root, outputRef)), { recursive: true });
        if (!existsSync(join(root, outputRef)))
          writeFileSync(join(root, outputRef), output, { mode: 0o600 });
        return { ...metadata, outputRef };
      }
      return metadata;
    };
    const rows = uniqueChecks(
      [...readChecksFile(path), ...additions].map(retainDiagnostic),
    );
    const evicted = rows.slice(0, Math.max(0, rows.length - gateCacheRows));
    const archives = new Map();
    for (const row of evicted) {
      const key = /^[a-f0-9]{40,64}$/.test(row.treeHash ?? "")
        ? row.treeHash
        : "legacy";
      const records = archives.get(key) ?? [];
      records.push(row);
      archives.set(key, records);
    }
    for (const [key, records] of archives) {
      const archived = join(archiveDirectory(root), `${key}.json`);
      mkdirSync(dirname(archived), { recursive: true });
      const temporary = `${archived}.${randomUUID()}.tmp`;
      writeFileSync(
        temporary,
        JSON.stringify(
          uniqueChecks([...readChecksFile(archived), ...records]),
        ) + "\n",
        { mode: 0o600 },
      );
      renameSync(temporary, archived);
    }
    const temporary = `${path}.${randomUUID()}.tmp`;
    writeFileSync(
      temporary,
      JSON.stringify(rows.slice(-gateCacheRows), null, 2) + "\n",
      { mode: 0o600 },
    );
    renameSync(temporary, path);
  } finally {
    rmdirSync(lock);
  }
}
/** A row that left suites out is a partial result under any identity, never a
 * complete check (WO-140).
 * Any other shape of either field is read as partial, never as complete.
 * @param {{partial?: unknown, excludedSuites?: unknown}} row
 */
export const partialGateCheck = (row) =>
  (row.partial !== undefined && row.partial !== false) ||
  (row.excludedSuites !== undefined &&
    !(Array.isArray(row.excludedSuites) && row.excludedSuites.length === 0));
/** Why a recorded npm test row cannot stand for the current installed runtime:
 * "missing" when the row records no digest (its gate ran where none was
 * computed), "different" when it records another one; null when they agree or
 * none is computed here.
 * @param {{instanceInputDigest?: string}} row @param {string|undefined} current */
export const instanceDigestMismatch = (row, current) =>
  current === undefined || row.instanceInputDigest === current
    ? null
    : row.instanceInputDigest === undefined
      ? "missing"
      : "different";
/** Row integrity applies to executions under every check, including runs
 * that supply no pass to the product gate.
 * @param {GateCheck} row */
export const intactGateExecutionRow = (row) =>
  row.identityUnchanged !== false &&
  row.buildOutputUnchanged !== false &&
  row.buildOutputAttested !== false &&
  !row.stopped &&
  !row.failureKind &&
  !row.timedOut &&
  !row.memory?.failure &&
  !row.abandonedRoots?.length &&
  (row.exitCode === 0 || row.identityUnchanged === true) &&
  Number.isFinite(row.durationMs) &&
  row.durationMs >= 0 &&
  Boolean(row.evidenceRef) &&
  Number.isFinite(Date.parse(row.recordedAt)) &&
  Array.isArray(row.requiredSuites);

/** @param {GateDiagnostic} result */
export const passingGateResult = (result) =>
  result.exitCode === 0 &&
  !result.failureKind &&
  !result.stopped &&
  !partialGateCheck(result) &&
  !result.timedOut &&
  Number.isFinite(result.durationMs) &&
  typeof result.durationMs === "number" &&
  result.durationMs >= 0;

/** Declared suites need a named execution or carried result in the row.
 * A legacy row without a declaration covers only an empty claim.
 * @param {GateCheck} row */
export function missingGateSuites(row) {
  const observed = row.taskTimeline ?? row.cases;
  const tasks = Array.isArray(observed) ? observed : [];
  return (Array.isArray(row.requiredSuites) ? row.requiredSuites : []).filter(
    (name) =>
      typeof name !== "string" ||
      !tasks.some(
        (task) =>
          typeof task?.name === "string" &&
          (task.name === name || task.name.startsWith(`${name}:`)),
      ),
  );
}

/** The execution of `name` that finished last among these rows. A result
 * carried from another row and a task that never started are not executions:
 * they neither supply a pass nor displace one. A run recorded under another
 * check answers no claim and supplies nothing. When the task's latest run
 * there did not pass, and no gate execution finished after it, that failure
 * is the task's latest run; when it passed, the latest gate execution
 * decides as if the other runs had not happened. Overlapping gates are
 * ordered by when the task finished, then by when its row was recorded.
 * `citesMain` reports a carried result this worktree took from main.
 * @param {GateCheck[]} rows @param {GateCheck[]} other
 * @param {string} name @param {string|undefined} identity */
export function latestGateExecution(rows, other, name, identity) {
  /** @type {{row: GateCheck, result?: GateDiagnostic|undefined, at: number}|undefined} */
  let latest;
  /** @type {{row: GateCheck, at: number, passed: boolean}|undefined} */
  let elsewhere;
  let citesMain = false;
  /** @type {[GateCheck, boolean][]} */
  const pairs = [
    ...rows.map((row) => /** @type {[GateCheck,boolean]} */ ([row, true])),
    ...other.map((row) => /** @type {[GateCheck,boolean]} */ ([row, false])),
  ];
  const ordered = pairs.sort(([a], [b]) =>
    String(a.recordedAt ?? "").localeCompare(String(b.recordedAt ?? "")),
  );
  for (const [row, supplies] of ordered) {
    if (row.executed !== true) continue;
    const observed = row.taskTimeline ?? row.cases;
    if (!Array.isArray(observed)) continue;
    const named = observed.filter((result) => result?.name === name);
    if (!named.length) continue;
    // A row that repeats a name cannot say which result ran: it counts as an
    // execution of every task it names and supplies nothing.
    const [result] =
      new Set(observed.map((entry) => entry?.name)).size === observed.length
        ? named
        : [];
    if (result?.reused) {
      citesMain ||=
        supplies &&
        result.sourceRow?.location === "main" &&
        result.sourceRow.task === name &&
        result.sourceRow.codeIdentity === identity;
      continue;
    }
    if (result && result.executed !== true) continue;
    // A passing partial observation neither supplies nor revokes a complete
    // pass. A failing partial still displaces it and names the failed task.
    if (
      partialGateCheck(row) &&
      row.exitCode === 0 &&
      intactGateExecutionRow(row) &&
      result &&
      passingGateResult(result)
    )
      continue;
    if (!supplies && !result) continue;
    const recorded = Date.parse(row.recordedAt);
    const finished = Date.parse(result?.finishedAt ?? "");
    const future = Number.isFinite(finished) && finished > recorded;
    const at = Number.isFinite(finished) && !future ? finished : recorded;
    // Rows arrive in recorded order, so an equal finish keeps the later row.
    if (!supplies) {
      if (!elsewhere || !(at < elsewhere.at))
        elsewhere = {
          row,
          at,
          passed:
            !future &&
            intactGateExecutionRow(row) &&
            Boolean(result && passingGateResult(result)),
        };
    } else if (!latest || !(at < latest.at)) latest = { row, result, at };
  }
  if (
    elsewhere &&
    !elsewhere.passed &&
    !(elsewhere.at < (latest?.at ?? -Infinity))
  )
    return { row: elsewhere.row, at: elsewhere.at, citesMain };
  return { ...latest, citesMain };
}

/** A complete row stands on the same execution decision used by the runner.
 * A carried main result is revalidated against main only when local history
 * supplies no execution of that task.
 * @param {GateCheck} candidate @param {GateCheck[]} rows @param {string} [root]
 */
export function gateCheckStands(candidate, rows, root) {
  if (
    !intactGateExecutionRow(
      candidate.requiredSuites === undefined
        ? { ...candidate, requiredSuites: [] }
        : candidate,
    ) ||
    missingGateSuites(candidate).length
  )
    return false;
  /** @param {GateCheck[]} entries */
  const partition = (entries) => {
    const at = entries.filter(
      (row) =>
        !row.stopped &&
        row.codeIdentity === candidate.codeIdentity &&
        (candidate.instanceInputDigest === undefined ||
          row.instanceInputDigest === candidate.instanceInputDigest),
    );
    return {
      rows: at.filter((row) => row.checkId === candidate.checkId),
      other: at.filter(
        (row) =>
          row.checkId !== candidate.checkId &&
          row.checkId !== "npm run test:docs",
      ),
    };
  };
  const local = partition(rows);
  /** @type {ReturnType<typeof partition>|null|undefined} */
  let main;
  const consultMain = () => {
    if (main !== undefined) return main;
    main = null;
    if (!root) return main;
    try {
      const record = git(root, ["worktree", "list", "--porcelain"])
        .split("\n\n")
        .find((record) =>
          record.split("\n").includes("branch refs/heads/main"),
        );
      const directory = record
        ?.split("\n")
        .find((line) => line.startsWith("worktree "))
        ?.slice(9);
      if (directory && realpathSync(directory) !== realpathSync(root))
        main = partition(readGateChecks(directory));
    } catch {
      /* Unreadable main cannot supply a pass. */
    }
    return main;
  };
  return (candidate.taskTimeline ?? candidate.cases ?? []).every((task) => {
    if (
      typeof task.name !== "string" ||
      Date.parse(task.finishedAt ?? "") > Date.parse(candidate.recordedAt)
    )
      return false;
    let latest = latestGateExecution(
      local.rows,
      local.other,
      task.name,
      candidate.codeIdentity,
    );
    if (!latest.row && (!local.rows.length || latest.citesMain)) {
      const main = consultMain();
      if (main)
        latest = latestGateExecution(
          main.rows,
          main.other,
          task.name,
          candidate.codeIdentity,
        );
    }
    return Boolean(
      latest.row &&
      latest.result &&
      !partialGateCheck(latest.row) &&
      intactGateExecutionRow(
        latest.row === candidate && candidate.requiredSuites === undefined
          ? { ...latest.row, requiredSuites: [] }
          : latest.row,
      ) &&
      passingGateResult(latest.result) &&
      Number.isFinite(Date.parse(latest.result.finishedAt ?? "")) &&
      Date.parse(latest.result.finishedAt ?? "") <=
        Date.parse(latest.row.recordedAt),
    );
  });
}

/** Generic tree checks retain successful evidence; product checks also
 * reject complete rows displaced by a task's later failing execution.
 * @param {string} root @param {string} checkId @param {string} treeHash
 */
export const findGateCheck = (root, checkId, treeHash) => {
  const codeIdentity =
    checkId === "npm test" ? gateCodeIdentity(root) : undefined;
  const instanceInputDigest =
    checkId === "npm test" ? gateInstanceInputDigest(root) : undefined;
  const rows = readGateChecks(
    root,
    checkId === "npm test" ? undefined : treeHash,
  );
  return [...rows]
    .reverse()
    .find(
      (row) =>
        row.checkId === checkId &&
        (instanceInputDigest === undefined ||
          row.instanceInputDigest === instanceInputDigest) &&
        (checkId === "npm test"
          ? row.codeIdentity === codeIdentity
          : row.treeHash === treeHash) &&
        !partialGateCheck(row) &&
        row.executed === true &&
        row.exitCode === 0 &&
        (checkId !== "npm test" || gateCheckStands(row, rows, root)) &&
        Number.isFinite(row.durationMs) &&
        row.durationMs >= 0 &&
        Boolean(row.evidenceRef),
    );
};

/** @param {string} root @param {string[]} required */
export function requireGateChecks(root, required) {
  const treeHash = gateTreeHash(root);
  const missing = required.filter(
    (check) => !findGateCheck(root, check, treeHash),
  );
  if (missing.length)
    throw new Error(
      `Required application check missing, stale, unexecuted, or failing: ${missing.join(", ")}; run it at the current tree`,
    );
  return treeHash;
}
