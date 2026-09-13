import { observedSpawnSync as spawnSync } from "../../packages/skeleton/src/gate-deadlines.mjs";
import { createHash, randomUUID } from "node:crypto";
import {
  accessSync,
  constants,
  existsSync,
  lstatSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  readlinkSync,
  realpathSync,
  renameSync,
  writeFileSync,
} from "node:fs";
import {
  delimiter,
  dirname,
  isAbsolute,
  join,
  relative,
  resolve,
} from "node:path";
import { availableParallelism, release } from "node:os";
import { gateInstalledInputRoots } from "./gate-evidence.mjs";

const version = 2;
const digest = (value) => createHash("sha256").update(value).digest("hex");
const jsonHash = (value) => digest(JSON.stringify(value));
export function suiteEnvironment(env = process.env, gateContext) {
  // This is both the execution environment and the fingerprinted environment.
  // Offline repository suites cannot see rotating proxy credentials or unrelated
  // invocation metadata. New environment-dependent coverage must extend this
  // reviewed projection, not silently reuse observations made under other inputs.
  const names = new Set([
    "PATH",
    "HOME",
    "TMPDIR",
    "TMP",
    "TEMP",
    "SHELL",
    "LANG",
    "TZ",
    "CI",
    "BASH_ENV",
    "ENV",
    "CODEX_HOME",
    "CLAUDE_CODE_EXECPATH",
    "CLAUDE_PID",
    "CLAUDE_EFFORT",
    "SystemRoot",
    "COMSPEC",
    "PATHEXT",
  ]);
  const child = Object.fromEntries(
    Object.entries(env).filter(
      ([name]) =>
        (names.has(name) ||
          /^(?:LC_|NODE_|npm_config_|NPM_CONFIG_|DOTLN_|GIT_|XDG_)/.test(
            name,
          )) &&
        !/(?:^|_)proxy(?:_|$)/i.test(name),
    ),
  );
  child.DOTLN_GATE_CHILD = "1";
  // Nested npm scripts prepend the same tool directories again. Keep the first
  // occurrence of each exact entry: executable precedence, relative entries,
  // the current-directory entry and paths that may be created later all remain.
  // Repeated failed exec searches are especially costly under a process sandbox.
  if (typeof child.PATH === "string")
    child.PATH = [...new Set(child.PATH.split(delimiter))].join(delimiter);
  // A runner fixture may itself execute under node --test. Its private worker
  // marker would make a nested --test invocation silently omit discovered tests.
  delete child.NODE_TEST_CONTEXT;
  if (gateContext) {
    child.DOTLN_GATE_LOAD_CLASS = gateContext.loadClass;
    child.DOTLN_GATE_CONCURRENCY = String(gateContext.concurrency);
    child.DOTLN_GATE_LOAD_FACTOR = String(gateContext.loadFactor);
    child.DOTLN_GATE_TASK = gateContext.task;
    if (gateContext.peerFile) child.DOTLN_GATE_PEER_FILE = gateContext.peerFile;
    if (gateContext.deadlineLog)
      child.DOTLN_GATE_DEADLINE_LOG = gateContext.deadlineLog;
  }
  return child;
}
const inside = (root, path) => {
  const part = relative(root, path);
  return (
    part !== ".." &&
    !part.startsWith(`..${process.platform === "win32" ? "\\" : "/"}`) &&
    !isAbsolute(part)
  );
};

// Reviewed scopes include every non-doc candidate file, not just production
// source: tests, shared helpers, configs, lockfiles, root/package Markdown and
// generated harness declarations all invalidate them. The listed documents
// are real inputs read by these suites. Other declared checks may reuse the
// complete candidate tree; unknown callers still execute conservatively.
const scopes = {
  kernel: ["docs/product/02-domain-model.md"],
  compiler: [],
  skeleton: [
    "docs/product/02-domain-model.md",
    "docs/instance/entropy-reducer/",
    "docs/discovery/environment.json",
  ],
  worktree: ["docs/LEGAL.md"],
  "plan-refutation:fixtures": ["docs/control/budgets.json"],
  "process-debt": ["docs/control/budgets.json"],
};
export function suiteScope(row) {
  if (row.name.startsWith("release:case:"))
    return ["docs/LEGAL.md", "docs/releases/tag-manifest.template.json"];
  return scopes[row.name] ?? null;
}

function git(repo, args, meter, env) {
  meter.commands++;
  const result = spawnSync("git", args, {
    cwd: repo,
    env,
    encoding: "utf8",
    maxBuffer: 32 * 1024 * 1024,
  });
  if (result.status !== 0)
    throw new Error("Suite input Git observation unavailable");
  return result.stdout;
}

/** One shared observation per boundary; no raw environment/config values persist. */
export function observeSuiteInputs(repo, { env = process.env } = {}) {
  env = suiteEnvironment(env);
  const started = performance.now();
  const meter = { files: 0, bytes: 0, commands: 0, durationMs: 0 };
  const physical = realpathSync(repo);
  let reusable = !["NODE_OPTIONS", "NODE_PATH", "BASH_ENV", "ENV"].some(
    (key) => env[key],
  );
  const hashFile = (path) => {
    const bytes = readFileSync(path);
    meter.files++;
    meter.bytes += bytes.length;
    return digest(bytes);
  };
  const file = (path) => {
    let stat;
    try {
      stat = lstatSync(path);
    } catch (error) {
      if (error.code === "ENOENT") return ["absent"];
      throw error;
    }
    if (stat.isSymbolicLink()) {
      // Workspace links are covered by candidate + dist observations below.
      // An unmodelled external target makes every scoped lookup a cache miss.
      let target;
      try {
        target = realpathSync(path);
      } catch {
        reusable = false;
      }
      if (!target || !inside(physical, target)) {
        reusable = false;
        return ["external-link", readlinkSync(path)];
      }
      if (
        lstatSync(target).isDirectory() &&
        !/^packages\/[^/]+$/.test(relative(physical, target))
      )
        reusable = false;
      return [
        "link",
        readlinkSync(path),
        target && lstatSync(target).isFile() ? file(target) : null,
      ];
    }
    if (!stat.isFile()) {
      reusable = false;
      return ["unsupported"];
    }
    return [stat.mode & 0o777, hashFile(path)];
  };
  const candidates = new Set(
    git(
      repo,
      ["ls-files", "--cached", "--others", "--exclude-standard", "-z"],
      meter,
      env,
    )
      .split("\0")
      .filter(Boolean),
  );
  const entries = [...candidates]
    .sort()
    .map((path) => [path, file(join(repo, path))]);
  const installed = [];
  const visit = (path) => {
    if (!existsSync(join(repo, path))) {
      installed.push([path, "absent"]);
      return;
    }
    const stat = lstatSync(join(repo, path));
    if (stat.isDirectory()) {
      installed.push([path, "directory", stat.mode & 0o777]);
      for (const name of readdirSync(join(repo, path)).sort())
        visit(`${path}/${name}`);
    } else installed.push([path, file(join(repo, path))]);
  };
  for (const path of gateInstalledInputRoots(repo)) visit(path);
  const toolchain = [];
  let npmExecutable;
  const versionedTools = new Set(["node", "git", "npm", "bash", "sh"]);
  for (const name of [
    ...versionedTools,
    "grep",
    "sed",
    "awk",
    "sort",
    "tr",
    "wc",
    "cat",
    "cp",
    "mv",
    "rm",
    "mkdir",
    "rmdir",
    "mktemp",
    "chmod",
    "touch",
    "ln",
    "dirname",
    "shasum",
    "diff",
    "cmp",
    "head",
    "tail",
    "find",
  ]) {
    const executable = (env.PATH ?? "")
      .split(delimiter)
      .map((path) => resolve(repo, path, name))
      .find((path) => {
        try {
          accessSync(path, constants.X_OK);
          return lstatSync(realpathSync(path)).isFile();
        } catch {
          return false;
        }
      });
    if (!executable) {
      reusable = false;
      toolchain.push([name, "missing"]);
      continue;
    }
    // Tool identities are digests, never local paths or config values in evidence.
    toolchain.push([
      name,
      digest(realpathSync(executable)),
      hashFile(executable),
    ]);
    if (name === "npm") npmExecutable = executable;
    if (!versionedTools.has(name)) continue;
    meter.commands++;
    const probe = spawnSync(executable, ["--version"], {
      cwd: repo,
      env,
      encoding: "utf8",
      timeout: 5000,
    });
    if (probe.status !== 0 && name !== "sh") reusable = false;
    toolchain.push([
      name,
      probe.status,
      digest((probe.stdout ?? "") + (probe.stderr ?? "")),
    ]);
  }
  const environment = Object.entries(env).sort(([a], [b]) =>
    a.localeCompare(b),
  );
  const localGitInputs = ["info/exclude", "info/attributes"].map((name) => {
    const path = resolve(
      repo,
      git(repo, ["rev-parse", "--git-path", name], meter, env).trim(),
    );
    return [name, existsSync(path) ? hashFile(path) : "absent"];
  });
  const gitUserConfig =
    env.XDG_CONFIG_HOME ?? (env.HOME ? join(env.HOME, ".config") : null);
  for (const name of ["ignore", "attributes"])
    localGitInputs.push([
      `user-${name}`,
      gitUserConfig && existsSync(join(gitUserConfig, "git", name))
        ? hashFile(join(gitUserConfig, "git", name))
        : "absent",
    ]);
  // Real npm's user configuration is an input even when a fixture executes only
  // a refused dry run. Retain its digest, never its contents or credentials.
  for (const path of [
    env.HOME && join(env.HOME, ".npmrc"),
    env.NPM_CONFIG_USERCONFIG,
    env.npm_config_userconfig,
    env.NPM_CONFIG_GLOBALCONFIG,
    env.npm_config_globalconfig,
  ].filter(Boolean))
    localGitInputs.push([
      digest(path),
      existsSync(path) ? hashFile(path) : "absent",
    ]);
  if (npmExecutable) {
    meter.commands++;
    const observed = spawnSync(
      npmExecutable,
      ["config", "get", "globalconfig"],
      { cwd: repo, env, encoding: "utf8", timeout: 5000 },
    );
    const path = observed.stdout?.trim();
    if (
      observed.status !== 0 ||
      !path ||
      !isAbsolute(path) ||
      path.includes("\n")
    )
      reusable = false;
    else
      localGitInputs.push([
        "npm-global-config",
        digest(path),
        existsSync(path) ? hashFile(path) : "absent",
      ]);
  }
  // Host-selected ignore/attribute/hook adapters can depend on arbitrary files.
  // Until their complete inputs have an adapter, do not reuse scoped evidence.
  const config = git(
    repo,
    ["config", "--null", "--list", "--show-origin"],
    meter,
    env,
  );
  if (
    /(?:core\.(?:excludesfile|attributesfile|hookspath|fsmonitor)|init\.templatedir|filter\.[^\n]+)\n/i.test(
      config,
    )
  )
    reusable = false;
  const context = jsonHash([
    process.versions,
    process.platform,
    process.arch,
    release(),
    availableParallelism(),
    digest(physical),
    environment,
    toolchain,
    git(repo, ["rev-parse", "HEAD"], meter, env),
    git(
      repo,
      ["for-each-ref", "--format=%(refname) %(objectname)"],
      meter,
      env,
    ),
    config,
    localGitInputs,
  ]);
  const runtime = jsonHash(installed);
  meter.durationMs = performance.now() - started;
  return {
    entries,
    context,
    runtime,
    reusable,
    meter,
    environmentKeys: environment.map(([key]) => key),
  };
}

export function suiteInputHash(row, snapshot) {
  const documents = suiteScope(row);
  if (!snapshot.reusable || (documents === null && row.reuse !== "tree"))
    return null;
  const selected = snapshot.entries.filter(
    ([path]) =>
      documents === null ||
      !path.startsWith("docs/") ||
      documents.some((input) =>
        input.endsWith("/") ? path.startsWith(input) : path === input,
      ),
  );
  return jsonHash({
    version,
    name: row.name,
    command: row.inputCommand ?? [...row.command, ...(row.args ?? [])],
    loadPolicy: row.loadPolicy ?? null,
    documents,
    selected,
    context: snapshot.context,
    runtime: snapshot.runtime,
  });
}

function cachePath(repo, name, inputHash) {
  return join(
    repo,
    "docs/control/local/harness/suite-success",
    digest(name),
    `${inputHash}.json`,
  );
}
function valid(record, name, inputHash) {
  if (
    !record ||
    record.version !== version ||
    record.name !== name ||
    record.inputHash !== inputHash ||
    !/^[a-f0-9]{64}$/.test(inputHash)
  )
    return false;
  const { seal, ...body } = record;
  const source = record.source;
  return (
    seal === jsonHash(body) &&
    source?.executed === true &&
    source.exitCode === 0 &&
    /^[a-f0-9]{40,64}$/.test(source.treeHash) &&
    typeof source.evidenceRef === "string" &&
    source.evidenceRef.length > 0 &&
    Number.isFinite(source.durationMs) &&
    source.durationMs >= 0 &&
    Number.isFinite(Date.parse(source.recordedAt))
  );
}
export function loadSuiteSuccess(repo, name, inputHash) {
  if (!inputHash) return null;
  try {
    const path = cachePath(repo, name, inputHash);
    const stat = lstatSync(path);
    if (!stat.isFile() || stat.isSymbolicLink() || stat.size > 8192)
      return null;
    const record = JSON.parse(readFileSync(path, "utf8"));
    return valid(record, name, inputHash) ? record.source : null;
  } catch {
    return null;
  }
}
export function saveSuiteSuccess(repo, row, inputHash, source) {
  if (!inputHash) return false;
  const body = {
    version,
    name: row.name,
    inputHash,
    source: {
      treeHash: source.treeHash,
      recordedAt: source.recordedAt,
      evidenceRef: source.evidenceRef,
      durationMs: source.durationMs,
      exitCode: source.exitCode,
      executed: source.executed,
      ...(source.startedAt
        ? { startedAt: source.startedAt, finishedAt: source.finishedAt }
        : {}),
    },
  };
  const record = { ...body, seal: jsonHash(body) };
  if (!valid(record, row.name, inputHash)) return false;
  const path = cachePath(repo, row.name, inputHash);
  mkdirSync(dirname(path), { recursive: true });
  const temporary = `${path}.${randomUUID()}.tmp`;
  writeFileSync(temporary, JSON.stringify(record) + "\n", {
    flag: "wx",
    mode: 0o600,
  });
  renameSync(temporary, path);
  return true;
}

export function reusableResult(row, source, inputHash) {
  return {
    name: row.name,
    exitCode: 0,
    durationMs: 0,
    executed: false,
    reused: true,
    inputHash,
    sourceExecution: source,
    output: "",
  };
}

/** Complete, unique coverage is checked independently of exit-code success. */
export function completeCoverage(table, rows) {
  return (
    rows.length === table.length &&
    new Set(rows.map((row) => row.name)).size === rows.length &&
    table.every((job) =>
      rows.some(
        (row) =>
          row.name === job.name &&
          row.exitCode === 0 &&
          (row.executed === true ||
            (row.reused === true &&
              row.sourceExecution?.executed === true &&
              row.sourceExecution.exitCode === 0)),
      ),
    )
  );
}
