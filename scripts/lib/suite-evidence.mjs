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
  rmSync,
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
import { fileURLToPath } from "node:url";
import {
  gateInstalledInputRoots,
  suiteSuccessDirectory,
} from "./gate-evidence.mjs";
import { releaseCases } from "./release-fixtures.mjs";
import {
  declaredPath,
  replicaMechanismVersion,
  replicaNodeOptions,
  replicaMainNodeOptions,
  supportedReplicaNodeOptions,
  replicaPlan,
  replicaSupportPaths,
} from "./suite-replica.mjs";

const version = 4;
const declarationVersion = 2;
const digest = (value) => createHash("sha256").update(value).digest("hex");
/** Git's two file modes: the executable bit is an input, other bits are not. */
export const canonicalMode = (mode) => (mode & 0o100 ? 0o755 : 0o644);
const jsonHash = (value) => digest(JSON.stringify(value));
export function suiteEnvironment(env = process.env, gateContext) {
  // This is both the execution environment and the fingerprinted environment.
  // Offline repository suites cannot see rotating proxy credentials or unrelated
  // invocation metadata. New environment-dependent coverage must extend this
  // reviewed projection, not silently reuse observations made under other inputs.
  // The scheduler's gate context (DOTLN_GATE_LOAD_CLASS, _CONCURRENCY,
  // _LOAD_FACTOR, _TASK, _PEER_FILE, _DEADLINE_LOG) is execution-only by
  // design: it names runner-owned diagnostics and this host's declared load,
  // never a suite input, and the cache is per machine.
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
    "DOTLN_GATE_CHILD",
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
        !/(?:^|_)proxy(?:_|$)/i.test(name) &&
        // A harness session injects Git configuration for its own checkouts
        // (safe.directory entries, transport settings). That is invocation
        // metadata, not a suite input: absent from execution and the key alike.
        !/^GIT_CONFIG_(?:COUNT|PARAMETERS|KEY_\d+|VALUE_\d+)$/.test(name),
    ),
  );
  child.DOTLN_GATE_CHILD = "1";
  // The stop lineage (WO-044) is runner-owned: the runner ends its own suites
  // on a stop request, and its run ids change every run, so the lineage is
  // neither a suite input nor part of the execution environment.
  delete child.DOTLN_GATE_RUNS;
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

// Candidate declarations are the replica's complete world. Installed roots are
// separate, shared inputs; package metadata closes their workspace links.
const packagePaths = [...replicaSupportPaths, "packages/"];
const fixturePaths = [
  ...packagePaths,
  "scripts/",
  ".gitignore",
  ".gitattributes",
  "CLAUDE.md",
  "LICENSE",
  "LICENSE-docs",
  "NOTICE",
  "tsconfig.json",
  "package-lock.json",
  ".prettierrc.json",
];
// Shell/Node/npm/Git behavior shared by the fixture suites. Session identities,
// transport commands and harness homes are deliberately absent. Startup adapters
// remain declared so an unsupported override still refuses narrowing.
const fixtureEnvironment = [
  "PATH",
  "HOME",
  "SHELL",
  "LANG",
  "TZ",
  "CI",
  "DOTLN_GATE_CHILD",
  "LC_ALL",
  "LC_CTYPE",
  "LC_COLLATE",
  "LC_MESSAGES",
  "LC_MONETARY",
  "LC_NUMERIC",
  "LC_TIME",
  "SystemRoot",
  "COMSPEC",
  "PATHEXT",
  "NODE_OPTIONS",
  "NODE_PATH",
  "NODE_NO_WARNINGS",
  "BASH_ENV",
  "ENV",
  "GIT_CONFIG_GLOBAL",
  "GIT_CONFIG_SYSTEM",
  "GIT_CONFIG_NOSYSTEM",
  "GIT_DIR",
  "GIT_WORK_TREE",
  "GIT_COMMON_DIR",
  "GIT_INDEX_FILE",
  "GIT_OBJECT_DIRECTORY",
  "GIT_ALTERNATE_OBJECT_DIRECTORIES",
  "GIT_TEMPLATE_DIR",
  "npm_config_userconfig",
  "NPM_CONFIG_USERCONFIG",
  "npm_config_globalconfig",
  "NPM_CONFIG_GLOBALCONFIG",
  "npm_config_local_prefix",
  "NPM_CONFIG_LOCAL_PREFIX",
  "npm_config_ignore_scripts",
  "npm_config_audit",
];
const replicaScopes = {
  kernel: [...packagePaths, "docs/product/02-domain-model.md"],
  compiler: [
    ...packagePaths,
    "corpus/harness/id-corpus-lib.mjs",
    "corpus/harness/wo101-support.mjs",
  ],
  skeleton: [
    ...packagePaths,
    ".gitignore",
    "package-lock.json",
    "scripts/resume.mjs",
    "scripts/worktree.mjs",
    "scripts/github-body.mjs",
    "scripts/github-repository.mjs",
    "scripts/release-notes.mjs",
    "scripts/lib/",
    "scripts/feedback-commit-msg.mjs",
    "scripts/benchmark-beacon.mjs",
    "scripts/benchmark-beacon-contention.mjs",
    "docs/product/02-domain-model.md",
    "docs/instance/entropy-reducer/",
    "docs/discovery/environment.json",
    "docs/discovery/codex-effort-2026-09-11.json",
  ],
  worktree: [...fixturePaths, "docs/LEGAL.md"],
  "plan-refutation:fixtures": [...fixturePaths, "docs/control/budgets.json"],
  "process-debt": [...fixturePaths, "docs/control/budgets.json"],
  resume: [
    ...fixturePaths,
    "docs/control/resume.jsonl",
    "docs/evidence/WO-030/legacy-fold.json",
    "docs/evidence/WO-030/legacy-times.json",
  ],
  checkpoint: fixturePaths,
  "work-orders-fixtures": fixturePaths,
  "publication-fixtures": fixturePaths,
  "backup-intake": fixturePaths,
  "fixture-temp-root": fixturePaths,
  "github-body": fixturePaths,
  "release-preparation": fixturePaths,
  "license-fixtures": [
    ...fixturePaths,
    "docs/LEGAL.md",
    "docs/releases/tag-manifest.template.json",
  ],
  "adjacent-queue": fixturePaths,
  "harness-probe": fixturePaths,
  "authority-grants": fixturePaths,
  "harness-fixtures": [
    ...fixturePaths,
    "docs/evidence/WO-029/baseline.json",
    "docs/product/07-execution-guide.md",
    "docs/product/08-publication-compiler.md",
  ],
  "runner-fixtures": [...fixturePaths, "corpus/", "docs/control/budgets.json"],
  "artifact-corpus": [...packagePaths, "corpus/"],
  mutation: [...fixturePaths, "corpus/mutation/"],
  "console:fixtures": [
    ...fixturePaths,
    "packages/console/fixtures/",
    "docs/product/13-uifa-roles.md",
    "docs/control/orders/WO-031.jsonl",
    "docs/evidence/WO-044/feedback-002/feedback.json",
    "docs/evidence/WO-044/feedback-002/selfhost-audit.jsonl",
    "docs/evidence/WO-044/feedback-002/selfhost-verification.jsonl",
    "docs/planning/refutations/2026-09-06-phase-two-redirect-002.json",
    "docs/planning/refutations/2026-09-06-phase-two-redirect-003.json",
    "docs/planning/refutations/2026-09-06-phase-two-redirect-004.json",
    "docs/planning/refutations/2026-09-06-phase-two-redirect-005.json",
    "docs/planning/refutations/2026-09-06-phase-two-redirect-006.json",
    "docs/planning/refutations/2026-09-06-phase-two-redirect.json",
    "docs/planning/refutations/2026-09-07-wo041-live-001.json",
  ],
};
const retentionReasons = {
  console:
    "Expanded into declared fixtures and the current host collection check.",
  "console:current":
    "Real host collection checks current documents and shipped exports.",
  build: "Build must publish this invocation's package outputs.",
  "document-barrier": "Scheduling barrier for the current document gate.",
  "release-surfaces":
    "Live release/component checks use this checkout and its release refs.",
  "license-surfaces":
    "Live check of the current repository's publication surfaces.",
  harness: "Live check of installed generated hooks and local terms.",
  "harness-context": "Live check of installed role context and local terms.",
  "harness-evidence": "Live check of the current installed harness evidence.",
  meta: "Live cost and follow-up projections include local observations.",
  format: "Current-tree formatting covers every candidate code file.",
  index:
    "Current work-order index reads candidate documents, HEAD and release refs.",
  publication: "Current publication locks cover the real product documents.",
  plan: "Current planning check reads candidate planning documents and HEAD.",
  "plan-refutation:current":
    "Current planning check reads candidate planning documents and HEAD.",
  "authority-evidence":
    "Current authority evidence reads candidate artifacts and the historical release ref.",
  "artifact-evidence":
    "Current artifact evidence validates the real repository's recorded edition.",
  "verification-evidence":
    "Current verification evidence validates the real repository's recorded edition.",
  "feedback-evidence":
    "Current feedback evidence validates the real repository's recorded edition.",
  release:
    "Expanded into declared preparation and case tasks before execution.",
  "plan-refutation":
    "Expanded into declared fixtures and the current planning check before execution.",
};
const scopes = Object.fromEntries(
  [
    "format",
    "build",
    "document-barrier",
    "release-surfaces",
    "release-preparation",
    "github-body",
    "license-fixtures",
    "license-surfaces",
    "fixture-temp-root",
    "publication-fixtures",
    "backup-intake",
    "resume",
    "checkpoint",
    "worktree",
    "release",
    "release:prepare",
    "work-orders-fixtures",
    "publication",
    "index",
    "kernel",
    "compiler",
    "skeleton",
    "console",
    "console:fixtures",
    "console:current",
    "adjacent-queue",
    "harness-probe",
    "authority-grants",
    "authority-evidence",
    "harness-fixtures",
    "harness",
    "harness-context",
    "harness-evidence",
    "plan-refutation",
    "plan-refutation:fixtures",
    "plan-refutation:current",
    "artifact-corpus",
    "artifact-evidence",
    "verification-evidence",
    "feedback-evidence",
    "mutation",
    "runner-fixtures",
    "process-debt",
    "meta",
    "plan",
    ...releaseCases(fileURLToPath(new URL("../../", import.meta.url))).map(
      (name) => `release:case:${name}`,
    ),
  ].map((name) => [
    name,
    {
      version: declarationVersion,
      ...(retentionReasons[name]
        ? { retention: retentionReasons[name] }
        : {
            environment: [
              ...fixtureEnvironment,
              ...(name === "skeleton" ? ["DOTLN_FEEDBACK_ABLATE"] : []),
            ],
          }),
      paths:
        name.startsWith("release:case:") || name === "release:prepare"
          ? [
              ...fixturePaths,
              "docs/LEGAL.md",
              "docs/releases/tag-manifest.template.json",
            ]
          : (replicaScopes[name] ?? null),
      git:
        [
          "skeleton",
          "worktree",
          "process-debt",
          "plan-refutation:fixtures",
          "resume",
          "checkpoint",
          "work-orders-fixtures",
          "publication-fixtures",
          "harness-fixtures",
          "runner-fixtures",
          "console:fixtures",
          "license-fixtures",
        ].includes(name) ||
        name.startsWith("release:case:") ||
        name === "release:prepare"
          ? "replica-repo"
          : name === "index"
            ? ["HEAD", "refs/tags/*"]
            : name === "authority-evidence"
              ? ["refs/tags/v0.16.0"]
              : ["plan", "plan-refutation:current"].includes(name)
                ? "HEAD"
                : "none",
      nodeOptions: [
        "kernel",
        "compiler",
        "skeleton",
        "console:fixtures",
      ].includes(name)
        ? replicaMainNodeOptions
        : replicaNodeOptions,
    },
  ]),
);
export function suiteDeclaration(row) {
  return Object.hasOwn(scopes, row.name) ? scopes[row.name] : null;
}
export function suiteScope(row) {
  return suiteDeclaration(row)?.paths ?? null;
}

function git(repo, args, meter, env, allowMissing = false) {
  meter.commands++;
  const result = spawnSync("git", args, {
    cwd: repo,
    env,
    encoding: "utf8",
    maxBuffer: 32 * 1024 * 1024,
  });
  if (result.status !== 0 && !(allowMissing && result.status === 1))
    throw new Error("Suite input Git observation unavailable");
  return result.stdout;
}

/** One shared observation per boundary; no raw environment/config values persist. */
export function observeSuiteInputs(repo, { env = process.env } = {}) {
  env = suiteEnvironment(env);
  const started = performance.now();
  const meter = { files: 0, bytes: 0, commands: 0, durationMs: 0 };
  const physical = realpathSync(repo);
  const pathIdentity = (path) =>
    inside(physical, path)
      ? `<worktree>/${relative(physical, path)}`
      : inside(resolve(repo), path)
        ? `<worktree>/${relative(resolve(repo), path)}`
        : path;
  let reusable =
    !["NODE_PATH", "BASH_ENV", "ENV"].some((key) => env[key]) &&
    supportedReplicaNodeOptions(env.NODE_OPTIONS);
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
        !/^(?:\.runtime\/harness\/[^/]+\/)?packages\/[^/]+$/.test(
          relative(physical, target),
        )
      )
        reusable = false;
      return [
        "link",
        readlinkSync(path),
        target && lstatSync(target).isFile() ? file(target) : null,
      ];
    }
    // Git records content and the executable bit. Other permission bits are
    // checkout residue (umask, a tool's private write) that Git never shows
    // and a suite never depends on; keying them forked reviewed successes
    // between a 0600 file in main and its 0644 worktree copy (WO-044).
    if (stat.isDirectory()) return ["directory", 0o755];
    if (!stat.isFile()) {
      reusable = false;
      return ["unsupported"];
    }
    return [canonicalMode(stat.mode), hashFile(path)];
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
  const installedRoots = gateInstalledInputRoots(repo);
  const isInstalled = (path) =>
    installedRoots.some((root) => path === root || path.startsWith(`${root}/`));
  for (const path of [...candidates]) {
    if (isInstalled(path)) {
      candidates.delete(path);
      continue;
    }
    for (let parent = dirname(path); parent !== "."; parent = dirname(parent))
      candidates.add(parent);
  }
  for (const declaration of Object.values(scopes))
    for (const path of declaration.paths ?? [])
      if (!isInstalled(path.replace(/\/$/, "")))
        candidates.add(path.replace(/\/$/, ""));
  const entries = [...candidates]
    .sort()
    .map((path) => [path, file(join(repo, path))]);
  const candidateReusable = reusable;
  reusable = true;
  const installed = [];
  const visit = (path) => {
    if (!existsSync(join(repo, path))) {
      installed.push([path, "absent"]);
      return;
    }
    const stat = lstatSync(join(repo, path));
    if (stat.isDirectory()) {
      installed.push([path, "directory", 0o755]);
      for (const name of readdirSync(join(repo, path)).sort())
        visit(`${path}/${name}`);
    } else installed.push([path, file(join(repo, path))]);
  };
  for (const path of installedRoots) visit(path);
  const installedReusable = reusable;
  reusable &&= candidateReusable;
  const toolchain = [];
  let toolchainReusable = true;
  const candidateTools = [];
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
      toolchainReusable = false;
      toolchain.push([name, "missing"]);
      continue;
    }
    if (inside(physical, realpathSync(executable)))
      candidateTools.push(relative(physical, realpathSync(executable)));
    // Tool identities are digests, never local paths or config values in evidence.
    toolchain.push([
      name,
      digest(pathIdentity(realpathSync(executable))),
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
    if (probe.status !== 0 && name !== "sh") {
      reusable = false;
      toolchainReusable = false;
    }
    toolchain.push([
      name,
      probe.status,
      digest((probe.stdout ?? "") + (probe.stderr ?? "")),
    ]);
  }
  // npm supplies the checkout directory to script children as local_prefix.
  // Like PATH, its checkout-relative meaning is stable across worktrees; keep
  // the real value in execution and retain distinct external prefix identities.
  const environment = Object.entries(env)
    .map(([name, value]) => [
      name,
      name === "PATH"
        ? value
            .split(delimiter)
            .map((path) => (isAbsolute(path) ? pathIdentity(path) : path))
            .join(delimiter)
        : name.toLowerCase() === "npm_config_local_prefix" && isAbsolute(value)
          ? pathIdentity(value)
          : value,
    ])
    .sort(([a], [b]) => a.localeCompare(b));
  const localGitInputs = ["info/exclude", "info/attributes"].map((name) => {
    const path = resolve(
      repo,
      git(repo, ["rev-parse", "--git-path", name], meter, env).trim(),
    );
    return [name, existsSync(path) ? hashFile(path) : "absent"];
  });
  const hostInputs = [];
  const gitUserConfig =
    env.XDG_CONFIG_HOME ?? (env.HOME ? join(env.HOME, ".config") : null);
  for (const name of ["ignore", "attributes"])
    hostInputs.push([
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
    hostInputs.push([
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
    ) {
      reusable = false;
      toolchainReusable = false;
    } else
      hostInputs.push([
        "npm-global-config",
        digest(path),
        existsSync(path) ? hashFile(path) : "absent",
      ]);
  }
  // Host-selected ignore/attribute/hook adapters can depend on arbitrary files.
  // Until their complete inputs have an adapter, do not reuse scoped evidence.
  const config = git(
    repo,
    [
      "config",
      "--null",
      "--get-regexp",
      "^(core\\.|filter\\.|init\\.templatedir$|extensions\\.worktreeconfig$)",
    ],
    meter,
    env,
    true,
  );
  if (
    /(?:core\.(?:excludesfile|attributesfile|hookspath|fsmonitor)|init\.templatedir|filter\.[^\n]+)\n/i.test(
      config,
    )
  )
    reusable = false;
  // Observe declared state once, without folding it into every suite's key.
  const gitState = {};
  for (const input of new Set(
    Object.values(scopes).flatMap((scope) =>
      ["none", "replica-repo"].includes(scope.git) ? [] : [].concat(scope.git),
    ),
  )) {
    gitState[input] = jsonHash(
      git(
        repo,
        input === "HEAD"
          ? ["rev-parse", "HEAD"]
          : ["for-each-ref", "--format=%(refname) %(objectname)", input],
        meter,
        env,
      ),
    );
  }
  const globalConfig = git(
    repo,
    ["config", "--global", "--null", "--get-regexp", ".*"],
    meter,
    env,
    true,
  );
  const replicaHostReusable =
    !/(?:core\.(?:excludesfile|attributesfile|hookspath|fsmonitor)|init\.templatedir|filter\.[^\n]+)\n/i.test(
      globalConfig,
    );
  const context = {
    environment: jsonHash(environment),
    toolchain: jsonHash([
      process.versions,
      process.platform,
      process.arch,
      toolchain,
    ]),
    git: jsonHash([config, localGitInputs, hostInputs]),
    replicaGit: jsonHash([globalConfig, hostInputs]),
  };
  const runtime = jsonHash(installed);
  meter.durationMs = performance.now() - started;
  return {
    entries,
    repo: resolve(repo),
    physical,
    env,
    installed,
    installedRoots,
    installedReusable,
    replicaHostReusable,
    toolchainReusable,
    candidateTools,
    context,
    gitState,
    runtime,
    reusable,
    meter,
    environmentKeys: environment.map(([key]) => key),
    // Per-variable digests let a fresh explanation name the variable that
    // changed; no value is retained.
    environmentDigests: Object.fromEntries(
      environment.map(([key, value]) => [key, digest(value)]),
    ),
    executionFacts: {
      checkout: digest(physical),
      cpus: availableParallelism(),
      osRelease: release(),
    },
  };
}

export function suiteInputIdentity(row, snapshot) {
  const declaration = suiteDeclaration(row);
  if (!snapshot || !declaration) return null;
  const replica = replicaPlan(row, declaration, snapshot);
  const narrowed = Boolean(replica && !replica.refusal);
  // A refused narrowing executes under the complete candidate contract. It may
  // read any candidate document, including documents outside its declaration.
  // Its key never coincides with a replica key: the declaration digest names
  // the execution root, and only replica runs carry the mechanism version.
  const selected = narrowed ? replica.entries : snapshot.entries;
  const paths = Object.fromEntries(
    selected.map(([path, value]) => [path, jsonHash(value)]),
  );
  const digests = {
    source: jsonHash(selected.filter(([path]) => !path.startsWith("docs/"))),
    documents: jsonHash(selected.filter(([path]) => path.startsWith("docs/"))),
    git: jsonHash([
      narrowed ? snapshot.context.replicaGit : snapshot.context.git,
      ["none", "replica-repo"].includes(declaration.git)
        ? []
        : []
            .concat(declaration.git)
            .map((input) => [input, snapshot.gitState[input]]),
    ]),
    environment: narrowed
      ? jsonHash(
          Object.entries(replica.environment).sort(([a], [b]) =>
            a.localeCompare(b),
          ),
        )
      : snapshot.context.environment,
    toolchain: snapshot.context.toolchain,
    runtime: snapshot.runtime,
    declaration: jsonHash({
      ...declaration,
      execution: narrowed ? "replica" : "candidate",
      ...(narrowed ? { replicaMechanismVersion } : {}),
      command: row.inputCommand ?? [...row.command, ...(row.args ?? [])],
      loadPolicy: row.loadPolicy ?? null,
    }),
  };
  // Variable digests are diagnostics beside the key, never part of it: a
  // fresh explanation names the changed variables, and no value is retained.
  const variables = Object.fromEntries(
    (narrowed
      ? Object.entries(replica.environment).map(([name, value]) => [
          name,
          digest(String(value)),
        ])
      : Object.entries(snapshot.environmentDigests ?? {})
    ).sort(([a], [b]) => a.localeCompare(b)),
  );
  return {
    execution: narrowed ? "replica" : "candidate",
    inputHash: jsonHash({ version, name: row.name, digests }),
    digests,
    paths,
    variables,
  };
}

export function suiteInputHash(row, snapshot) {
  if (
    !snapshot ||
    row.build ||
    row.reuse === "live" ||
    row.name === "release:prepare"
  )
    return null;
  // A narrowed suite is keyed by its replica plan alone. A refused narrowing
  // falls back to the whole-tree contract, which needs a reusable snapshot.
  const replica = replicaPlan(row, suiteDeclaration(row), snapshot);
  if (!(replica && !replica.refusal) && !snapshot.reusable) return null;
  return suiteInputIdentity(row, snapshot)?.inputHash ?? null;
}

export function suiteCacheDirectory(repo, name) {
  return join(suiteSuccessDirectory(repo), ...(name ? [digest(name)] : []));
}
function cachePath(repo, name, inputHash) {
  return join(suiteCacheDirectory(repo, name), `${inputHash}.json`);
}
const inputClasses = [
  "source",
  "documents",
  "git",
  "environment",
  "toolchain",
  "runtime",
  "declaration",
];
const hashPattern = /^[a-f0-9]{64}$/;
function valid(record, name, inputHash) {
  if (
    !record ||
    record.version !== version ||
    !["replica", "candidate"].includes(record.execution) ||
    record.name !== name ||
    record.inputHash !== inputHash ||
    !hashPattern.test(inputHash) ||
    !record.digests ||
    Object.keys(record.digests).sort().join() !==
      [...inputClasses].sort().join() ||
    !inputClasses.every((key) => hashPattern.test(record.digests[key])) ||
    inputHash !== jsonHash({ version, name, digests: record.digests }) ||
    !record.paths ||
    typeof record.paths !== "object" ||
    Array.isArray(record.paths) ||
    !Object.entries(record.paths).every(
      ([path, hash]) =>
        path &&
        !isAbsolute(path) &&
        !path.split("/").includes("..") &&
        hashPattern.test(hash),
    ) ||
    (record.variables !== undefined &&
      !(
        record.variables &&
        typeof record.variables === "object" &&
        !Array.isArray(record.variables) &&
        Object.entries(record.variables).every(
          ([name, hash]) =>
            /^[^\s=]{1,200}$/.test(name) && hashPattern.test(hash),
        )
      ))
  )
    return false;
  const { seal, ...body } = record;
  const source = record.source;
  // Kernel-denial provenance is recorded and sealed, never a validity
  // condition: a replica success carries whether its execution was wrapped,
  // and a session that cannot start the sandbox reuses it under the same key.
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
function readSuccess(path, name, inputHash) {
  try {
    const stat = lstatSync(path);
    if (!stat.isFile() || stat.isSymbolicLink() || stat.size > 4 * 1024 * 1024)
      return null;
    const record = JSON.parse(readFileSync(path, "utf8"));
    return valid(record, name, inputHash) ? record : null;
  } catch {
    return null;
  }
}
export function loadSuiteSuccess(repo, name, inputHash) {
  if (!inputHash) return null;
  try {
    const path = cachePath(repo, name, inputHash);
    return readSuccess(path, name, inputHash)?.source ?? null;
  } catch {
    return null;
  }
}
export function explainSuiteFresh(repo, row, identity, policy) {
  let prior = null;
  if (identity) {
    const directory = suiteCacheDirectory(repo, row.name);
    if (existsSync(directory))
      for (const file of readdirSync(directory).sort()) {
        if (!/^[a-f0-9]{64}\.json$/.test(file)) continue;
        const record = readSuccess(
          join(directory, file),
          row.name,
          file.slice(0, -5),
        );
        if (
          record &&
          (!prior ||
            Date.parse(record.source.recordedAt) >=
              Date.parse(prior.source.recordedAt))
        )
          prior = record;
      }
  }
  const changes = prior
    ? inputClasses
        .filter((key) => prior.digests[key] !== identity.digests[key])
        .map((inputClass) => {
          const paths = ["source", "documents"].includes(inputClass)
            ? [
                ...new Set([
                  ...Object.keys(prior.paths),
                  ...Object.keys(identity.paths),
                ]),
              ]
                .filter(
                  (path) =>
                    path.startsWith("docs/") === (inputClass === "documents") &&
                    prior.paths[path] !== identity.paths[path],
                )
                .sort()
            : inputClass === "environment" &&
                prior.variables &&
                identity.variables
              ? [
                  ...new Set([
                    ...Object.keys(prior.variables),
                    ...Object.keys(identity.variables),
                  ]),
                ]
                  .filter(
                    (name) =>
                      prior.variables[name] !== identity.variables[name],
                  )
                  .sort()
              : [];
          return {
            inputClass,
            paths: paths
              .slice(0, 5)
              .map((path) =>
                path.replace(/[\u0000-\u001f\u007f]/g, "?").slice(0, 180),
              ),
            omittedPaths: Math.max(0, paths.length - 5),
          };
        })
    : [];
  return {
    reason: prior
      ? changes.length
        ? "inputs changed"
        : "inputs unchanged"
      : "no prior success",
    ...(policy ? { policy } : {}),
    changes,
  };
}
export function formatSuiteFresh(reason) {
  return [
    reason.policy,
    reason.changes.length
      ? reason.changes
          .map(
            (change) =>
              `${change.inputClass}${change.paths.length ? `: ${change.paths.join(", ")}${change.omittedPaths ? ` (+${change.omittedPaths} more)` : ""}` : ""}`,
          )
          .join("; ")
      : reason.reason,
  ]
    .filter(Boolean)
    .join("; ");
}
// Successes are a cache, not evidence: the gate ledger keeps the rows. Only
// the newest records per suite can still match a live tree, so the cache stays
// bounded instead of growing by every whole-tree inventory per gate.
export const retainedSuccessesPerSuite = 24;
export function pruneSuiteSuccesses(directory, keep) {
  let files;
  try {
    files = readdirSync(directory).filter((file) =>
      /^[a-f0-9]{64}\.json$/.test(file),
    );
  } catch {
    return 0;
  }
  if (files.length <= retainedSuccessesPerSuite) return 0;
  const dated = files
    .map((file) => {
      let modified = 0;
      try {
        modified = lstatSync(join(directory, file)).mtimeMs;
      } catch {
        /* Removed by a concurrent gate; nothing to order. */
      }
      return { file, modified };
    })
    .sort((a, b) => b.modified - a.modified || a.file.localeCompare(b.file));
  let pruned = 0;
  for (const { file } of dated.slice(retainedSuccessesPerSuite)) {
    if (file === keep) continue;
    try {
      rmSync(join(directory, file));
      pruned++;
    } catch {
      /* A concurrent gate may already have removed it. */
    }
  }
  return pruned;
}
export function saveSuiteSuccess(repo, row, inputHash, source, identity) {
  if (!inputHash || identity?.inputHash !== inputHash) return false;
  const body = {
    version,
    execution: identity.execution,
    name: row.name,
    inputHash,
    digests: identity.digests,
    paths: identity.paths,
    ...(identity.variables ? { variables: identity.variables } : {}),
    source: {
      treeHash: source.treeHash,
      recordedAt: source.recordedAt,
      evidenceRef: source.evidenceRef,
      durationMs: source.durationMs,
      exitCode: source.exitCode,
      executed: source.executed,
      ...(source.kernelDenial ? { kernelDenial: source.kernelDenial } : {}),
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
  pruneSuiteSuccesses(dirname(path), `${inputHash}.json`);
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
