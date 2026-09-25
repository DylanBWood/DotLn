import { spawn } from "node:child_process";
import { createHash } from "node:crypto";
import { observedExecFileSync as execFileSync } from "./gate-deadlines.mjs";
import { startDeadline } from "./gate-deadlines.mjs";
import {
  chmodSync,
  closeSync,
  existsSync,
  fstatSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  openSync,
  readdirSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { homedir, tmpdir } from "node:os";
import { join } from "node:path";
import { feedbackClaudeSettings } from "./loadouts/feedback.js";
import { PLAN_REFUTATION_LIMITS } from "./plan-refutation-protocol.js";
import {
  MISSION_CHECK_LIMITS,
  isMissionCheckRequest,
} from "./mission-check-protocol.js";
import {
  ENTROPY_REFUTATION_LIMITS,
  ENTROPY_REVIEW_LIMITS,
  isEntropyRefutationRequest,
  isEntropyRequest,
  isEntropyReviewRequest,
  type EntropyRefutationRequest,
  type EntropyReviewRequest,
} from "./entropy-review-protocol.js";
import { decodeUsageSource, usageObservation } from "./usage-observation.mjs";
import {
  WorkerFailure,
  isWriterRequest,
  parseWriterResult,
  type WriterRequest,
  type WriterResult,
  type WriterObservations,
  normalizeWorkerEffort,
  WORKER_TIMEOUT_MS,
  type CommandReceipt,
  type WorkerRequest,
  type WorkerResult,
  type WorkerTransportName,
} from "./worker-protocol.js";
import {
  FEEDBACK_VERIFIER_LIMITS,
  parseTransportResult,
  validateTransportRequest,
  transportPrompt,
  transportResultSchema,
  isEvidenceRequest,
  isPlanRequest,
  type TransportRequest,
  type TransportResultFor,
} from "./verification-protocol.js";

import { validateSourceChangeEnvironment } from "./source-change-environment.js";

export { normalizeWorkerEffort };

export interface WorkerLaunch {
  readonly resident?: { readonly store: string; readonly episodeId: string };
  readonly binary: string;
  readonly args: readonly string[];
  readonly cwd: string;
  readonly input: string;
  readonly timeoutMs: number;
  /** The launch environment; the Codex launcher supplies an isolated home. */
  readonly env?: NodeJS.ProcessEnv;
}
export interface ProcessResult {
  readonly stdout: string;
  readonly stderr: string;
  readonly exitCode: number | null;
}
export interface RunningProcess {
  readonly accepted: Promise<void>;
  readonly completed: Promise<ProcessResult>;
  readonly alive: () => boolean;
  readonly kill: () => void;
}
export type ProcessRunner = (launch: WorkerLaunch) => RunningProcess;

/** No shell interpolation; raw harness output is private, bounded and discarded. */
export const runWorkerProcess: ProcessRunner = (launch) => {
  const observation = startDeadline(
    "worker-transport:process",
    launch.timeoutMs,
  );
  const capture = mkdtempSync(join(tmpdir(), "dotln-worker-output-"));
  const file = join(capture, "stdout");
  const fd = openSync(file, "wx", 0o600);
  const child = spawn(launch.binary, [...launch.args], {
    cwd: launch.cwd,
    stdio: ["pipe", fd, "pipe"],
    // Auth is resolved by the CLI, never copied into a prompt or log. Restrict
    // model tool environments separately in the canonical launch below.
    env: launch.resident
      ? {
          ...(launch.env ?? process.env),
          DOTLN_RESIDENT_STORE: launch.resident.store,
          DOTLN_RESIDENT_EPISODE_ID: launch.resident.episodeId,
        }
      : (launch.env ?? process.env),
    ...(launch.resident ? { detached: true } : {}),
  });
  let live = false;
  let stderr = "";
  let failure: WorkerFailure | undefined;
  const kill = () => {
    failure ??= new WorkerFailure("interrupted");
    if (launch.resident && child.pid) {
      try {
        process.kill(-child.pid, "SIGKILL");
      } catch {}
      child.stderr?.destroy();
      child.stdin?.destroy();
    } else child.kill("SIGKILL");
  };
  const accepted = new Promise<void>((resolve, reject) => {
    child.once("spawn", () => {
      live = true;
      resolve();
    });
    child.once("error", () => reject(new WorkerFailure("transport-failed")));
  });
  // Attach a rejection handler immediately even if the host first awaits spawn.
  void accepted.catch(() => {});
  const completed = new Promise<ProcessResult>((resolve, reject) => {
    const deadline = setTimeout(() => {
      observation.finish(true);
      failure = new WorkerFailure("deadline-exceeded");
      kill();
    }, launch.timeoutMs);
    const bound = setInterval(() => {
      if (fstatSync(fd).size > 1_000_000) {
        failure = new WorkerFailure("output-limit");
        kill();
      }
    }, 100);
    child.stderr!.on("data", (chunk: Buffer) => {
      if (stderr.length + chunk.length > 64_000) {
        failure = new WorkerFailure("output-limit");
        kill();
      } else stderr += chunk.toString("utf8");
    });
    child.stdin!.on("error", () => {
      /* early model/config refusal can close stdin */
    });
    child.once("error", () => {
      failure ??= new WorkerFailure("transport-failed");
    });
    child.once("exit", () => {
      live = false;
      if (launch.resident && child.pid) {
        try {
          process.kill(-child.pid, "SIGKILL");
        } catch {}
        child.stderr?.destroy();
      }
    });
    child.once("close", (exitCode, signal) => {
      observation.finish();
      live = false;
      clearTimeout(deadline);
      clearInterval(bound);
      try {
        if (fstatSync(fd).size > 1_000_000)
          failure = new WorkerFailure("output-limit");
        if (failure || signal)
          reject(failure ?? new WorkerFailure("interrupted"));
        else resolve({ stdout: readFileSync(file, "utf8"), stderr, exitCode });
      } finally {
        closeSync(fd);
        rmSync(capture, { recursive: true });
      }
    });
  });
  void completed.catch(() => {});
  child.stdin!.end(launch.input);
  return { accepted, completed, alive: () => live, kill };
};

export interface TransportDispatch<T = WorkerResult> {
  readonly receipt: Promise<CommandReceipt>;
  readonly completed: Promise<T>;
  readonly alive: () => boolean;
  readonly kill: () => void;
  readonly usage?: Promise<ReturnType<typeof usageObservation>>;
  /** Codex only: the isolated episode's record once the process has ended. */
  readonly isolation?: Promise<CodexEpisodeIsolation>;
}
export interface WorkOrderTransport<
  R extends TransportRequest = WorkerRequest,
> {
  readonly name: WorkerTransportName;
  readonly harnessVersion: string;
  dispatch(
    request: R,
    now: () => number,
  ): TransportDispatch<TransportResultFor<R>>;
}

const codexDisabled = [
  "apps",
  "browser_use",
  "computer_use",
  "image_generation",
  "in_app_browser",
  "in_app_chat",
  "in_app_local_automation",
  "multi_agent",
  "multi_agent_v2",
  "code_mode_host",
  "plugins",
  "remote_plugin",
  "hooks",
  "memories",
  "context_management",
  "skill_search",
  "skill_mcp_dependency_install",
  "tool_suggest",
  "workspace_dependencies",
  "shell_snapshot",
  "view_image",
  "shell_tool",
  "unified_exec",
];

/* ------------------------------------------------------------------------ */
/* The Codex launcher (WO-159). Every DotLn-launched Codex worker, verifier  */
/* and probe builds its argv and environment here.                          */
/* ------------------------------------------------------------------------ */

/** The flags every Codex `exec` episode shares. They govern reading and
 * session files only: `--ignore-user-config` does not stop the CLI writing a
 * project trust entry into its home (WO-111 VER-001 B1), so the isolated home
 * below, not these flags, keeps the operator's configuration unchanged. */
export const CODEX_EXEC_SHARED_FLAGS = [
  "--ephemeral",
  "--ignore-user-config",
] as const;

export interface CodexExecShape {
  /** Codex's global approval option; it precedes the subcommand. */
  readonly approval?: string;
  /** Options kept ahead of the shared flags, in their recorded position. */
  readonly leading?: readonly string[];
  /** Everything after the shared flags, ending with the prompt or `-`. */
  readonly rest: readonly string[];
}

/** The one builder of a Codex `exec` argv. */
export function codexExecArgv(shape: CodexExecShape): string[] {
  return [
    ...(shape.approval === undefined ? [] : ["-a", shape.approval]),
    "exec",
    ...(shape.leading ?? []),
    ...CODEX_EXEC_SHARED_FLAGS,
    ...shape.rest,
  ];
}

export type CodexDigestPair = {
  readonly before: string;
  readonly after: string;
};

/** What one episode did to the operator's user-level Codex state. Digests and
 * counts only: never the configuration, a project path or the auth file. */
export type CodexEpisodeIsolation = {
  readonly schemaVersion: 1;
  /** SHA-256 of the isolated home's path; its contents are never recorded. */
  readonly home: string;
  /** How the CLI reached the operator's authentication. */
  readonly authentication: "symlink" | "absent";
  /** The user-level `config.toml`, before and after the episode. */
  readonly userConfig: CodexDigestPair;
  /** Its `[projects]` trust table, before and after the episode. */
  readonly trustTable: CodexDigestPair;
  /** Trusted project entries the CLI wrote into the isolated home, or null
   * when it wrote no configuration there. Observed, not assumed. */
  readonly isolatedTrustEntries: number | null;
  readonly homeRemoved: boolean;
};

export interface CodexEpisode {
  /** The launch environment: the caller's, with `CODEX_HOME` isolated. */
  readonly env: NodeJS.ProcessEnv;
  /** Digest again, remove the home and return the record. Idempotent. */
  finish(): CodexEpisodeIsolation;
}

const sha256 = (bytes: string | Buffer) =>
  `sha256:${createHash("sha256").update(bytes).digest("hex")}`;

/** The operator's Codex home as the CLI would resolve it for this caller. */
export function userCodexHome(env: NodeJS.ProcessEnv = process.env): string {
  return env.CODEX_HOME?.trim()
    ? env.CODEX_HOME
    : join(env.HOME?.trim() ? env.HOME : homedir(), ".codex");
}

function readConfig(path: string): Buffer | "absent" | "unknown" {
  try {
    return readFileSync(path);
  } catch (error) {
    return (error as NodeJS.ErrnoException).code === "ENOENT"
      ? "absent"
      : "unknown";
  }
}

/** The `[projects]` trust table as its own lines, in file order: `[projects]`
 * and `[projects."<path>"]` tables (bare, basic or literal key) with their
 * keys, and a root-level `projects` value, dotted or inline, including the
 * lines a multi-line value continues onto. A line projection, not a TOML
 * parser: strings and comments are blanked before brackets are counted, and
 * multi-line strings are not modelled. The whole-file pair covers the rest. */
export function codexTrustTable(config: string): string {
  const lines: string[] = [];
  let table: string | null = null; // null is the root table
  let depth = 0; // brackets and braces a multi-line value left open
  let rootValue = false; // that value is a root-level projects value
  for (const line of config.split(/\r?\n/u)) {
    const code = line
      .replace(/"(?:[^"\\]|\\.)*"|'[^']*'/gu, '""')
      .replace(/#.*$/u, "");
    const header =
      depth === 0 && /^\s*\[/u.test(code)
        ? line.match(/^\s*\[\[?\s*(.*?)\s*\]\]?\s*(?:#.*)?$/u)
        : null;
    if (header) {
      table = header[1]!;
      rootValue = false;
    } else if (depth === 0 && table === null)
      rootValue = /^\s*(?:projects|"projects"|'projects')\s*[.=]/u.test(line);
    if (
      table === null
        ? rootValue
        : /^(?:projects|"projects"|'projects')\s*(?:\.|$)/u.test(table)
    )
      lines.push(line);
    if (!header)
      depth = Math.max(
        0,
        depth +
          (code.match(/[[{]/gu)?.length ?? 0) -
          (code.match(/[\]}]/gu)?.length ?? 0),
      );
  }
  return lines.join("\n");
}

function configDigests(path: string): {
  readonly file: string;
  readonly trust: string;
} {
  const bytes = readConfig(path);
  if (typeof bytes === "string") return { file: bytes, trust: bytes };
  return {
    file: sha256(bytes),
    trust: sha256(codexTrustTable(bytes.toString("utf8"))),
  };
}

/** A digest pair proves the file unchanged only when both sides were read,
 * or both were absent. */
export function codexDigestPairEqual(pair: CodexDigestPair): boolean {
  return pair.before !== "unknown" && pair.before === pair.after;
}

/** The receipt check for live Codex episodes (WO-159): each record must be a
 * well-formed isolation record whose home was removed and whose user-level
 * configuration and trust-table pairs are equal. */
export function assertCodexIsolationUnchanged(
  records: readonly unknown[],
): asserts records is readonly CodexEpisodeIsolation[] {
  const digest = /^(?:sha256:[0-9a-f]{64}|absent|unknown)$/u;
  const pair = (value: unknown): value is CodexDigestPair =>
    !!value &&
    typeof value === "object" &&
    Object.keys(value).sort().join() === "after,before" &&
    digest.test(String((value as CodexDigestPair).before)) &&
    digest.test(String((value as CodexDigestPair).after));
  if (records.length === 0)
    throw new Error("Codex isolation: no episode record");
  for (const record of records) {
    const value = record as CodexEpisodeIsolation;
    if (
      !value ||
      typeof value !== "object" ||
      value.schemaVersion !== 1 ||
      !/^sha256:[0-9a-f]{64}$/u.test(String(value.home)) ||
      !["symlink", "absent"].includes(value.authentication) ||
      !pair(value.userConfig) ||
      !pair(value.trustTable)
    )
      throw new Error("Codex isolation: malformed episode record");
    if (value.homeRemoved !== true)
      throw new Error("Codex isolation: the episode home was not removed");
    if (
      !codexDigestPairEqual(value.userConfig) ||
      !codexDigestPairEqual(value.trustTable)
    )
      throw new Error(
        "Codex isolation: the user-level Codex configuration changed across the episode",
      );
  }
}

/** Episode homes are named for the launching process. */
const CODEX_HOME_NAME = /^dotln-codex-home-(\d+)-[^/]+$/u;
/** A detached Codex group can outlive a launcher killed from its terminal, so
 * a home is also kept until it is older than twice the longest episode
 * deadline any DotLn launch sets. */
export const STALE_CODEX_HOME_MS =
  2 *
  Math.max(
    WORKER_TIMEOUT_MS,
    ENTROPY_REVIEW_LIMITS.timeoutMs,
    ENTROPY_REFUTATION_LIMITS.timeoutMs,
    MISSION_CHECK_LIMITS.timeoutMs,
    PLAN_REFUTATION_LIMITS.timeoutMs,
    FEEDBACK_VERIFIER_LIMITS.timeoutMs,
  );

/** Episode homes left behind by an abnormal end: their launching process has
 * exited and the home is older than STALE_CODEX_HOME_MS. A live launcher's
 * homes, including another lane's, are never stale. The next launch removes
 * these and `harness prune` lists them. */
export function staleCodexEpisodeHomes(
  root: string = tmpdir(),
  now: number = Date.now(),
): string[] {
  let names: string[];
  try {
    names = readdirSync(root);
  } catch {
    return [];
  }
  return names.flatMap((name) => {
    const pid = Number(name.match(CODEX_HOME_NAME)?.[1]);
    if (!Number.isSafeInteger(pid) || pid <= 1 || pid === process.pid)
      return [];
    const path = join(root, name);
    const info = lstatSync(path, { throwIfNoEntry: false });
    if (
      !info?.isDirectory() ||
      info.uid !== process.getuid?.() ||
      now - info.mtimeMs <= STALE_CODEX_HOME_MS
    )
      return [];
    try {
      process.kill(pid, 0);
      return [];
    } catch (error) {
      return (error as NodeJS.ErrnoException).code === "ESRCH" ? [path] : [];
    }
  });
}

/** Start one isolated Codex episode: a fresh `CODEX_HOME` under system temp
 * (0o700) holding only a symlink to the operator's `auth.json`. The CLI's own
 * file store opens that path for writing, so a token refresh reaches the
 * operator's file instead of dying with a copy (rust-v0.156.1
 * `FileAuthStorage::save`). Before and after the launch, `finish` digests the
 * operator's `config.toml` and its trust table. A home that cannot be built
 * refuses the launch; it never falls back to the operator's home. */
export function startCodexEpisode(
  env: NodeJS.ProcessEnv = process.env,
): CodexEpisode {
  const user = userCodexHome(env);
  const config = join(user, "config.toml");
  // Best effort: a stale home that resists removal is listed by prune again.
  for (const stale of staleCodexEpisodeHomes())
    try {
      rmSync(stale, { recursive: true, force: true });
    } catch {}
  const before = configDigests(config);
  let home: string;
  try {
    home = mkdtempSync(join(tmpdir(), `dotln-codex-home-${process.pid}-`));
  } catch {
    throw new WorkerFailure("profile-refused", "isolated Codex home");
  }
  let record: CodexEpisodeIsolation | undefined;
  try {
    chmodSync(home, 0o700);
    const auth = join(user, "auth.json");
    const authentication = existsSync(auth) ? "symlink" : "absent";
    if (authentication === "symlink")
      symlinkSync(auth, join(home, "auth.json"));
    return {
      env: { ...env, CODEX_HOME: home },
      finish() {
        if (record) return record;
        const after = configDigests(config);
        const isolated = readConfig(join(home, "config.toml"));
        const isolatedTrustEntries =
          typeof isolated === "string"
            ? null
            : codexTrustTable(isolated.toString("utf8"))
                .split("\n")
                .filter((line) =>
                  /trust_level\s*=\s*["']trusted["']/u.test(line),
                ).length;
        try {
          rmSync(home, { recursive: true, force: true });
        } catch {
          // Observed below as homeRemoved: false; the receipt check refuses it.
        }
        record = {
          schemaVersion: 1,
          home: sha256(home),
          authentication,
          userConfig: { before: before.file, after: after.file },
          trustTable: { before: before.trust, after: after.trust },
          isolatedTrustEntries,
          homeRemoved: !existsSync(home),
        };
        if (
          !codexDigestPairEqual(record.userConfig) ||
          !codexDigestPairEqual(record.trustTable)
        )
          process.stderr.write(
            "DotLn advisory: the user-level Codex configuration changed or could not be read across an isolated Codex episode.\n",
          );
        return record;
      },
    };
  } catch {
    rmSync(home, { recursive: true, force: true });
    throw new WorkerFailure("profile-refused", "isolated Codex home");
  }
}

export const OBSERVED_CLI_VERSIONS = {
  claude: "2.1.270",
  codex: "0.154.0",
} as const;

/** Version comparisons produce observations, never launch refusals. */
function meetsMinimumVersion(version: string, minimum: string): boolean {
  if (!/^\d+\.\d+\.\d+$/u.test(version)) return false;
  const actual = version.split(".").map(Number);
  const required = minimum.split(".").map(Number);
  if (!actual.every(Number.isSafeInteger)) return false;
  for (let index = 0; index < required.length; index++) {
    if (actual[index]! > required[index]!) return true;
    if (actual[index]! < required[index]!) return false;
  }
  return true;
}

export function canonicalWorkerArgs(
  name: WorkerTransportName,
  request: TransportRequest,
  schemaPath: string,
  harnessVersion = "unknown",
): readonly string[] {
  validateTransportRequest(request);
  if (typeof request.effort !== "string" || !request.effort.trim())
    throw new WorkerFailure("profile-refused", "worker effort must be present");
  const selection = normalizeWorkerEffort(request.effort);
  // Hosts can normalize ultra before dispatch while retaining its mode.
  const subagents =
    selection.mode === "subagents" ||
    ("mode" in request && request.mode === "subagents");
  if (
    !["low", "medium", "high", "xhigh", "max", "unknown"].includes(
      selection.effort,
    )
  )
    process.stderr.write(
      `DotLn advisory: requested worker effort ${JSON.stringify(request.effort)} is unrecorded; the host will evaluate it.\n`,
    );
  // Only the two CLI adapters build argv; the local-model transport is an
  // HTTP request shape and the fake never launches a process.
  if (name === "fake" || name === "local-model-http")
    throw new WorkerFailure("profile-refused");
  if (isEntropyRequest(request))
    return entropyArgs(name, request, schemaPath, selection.effort);
  if (isWriterRequest(request)) {
    try {
      validateSourceChangeEnvironment(
        request.profile,
        request.cwd,
        request.commitMessagePath,
      );
    } catch {
      throw new WorkerFailure("profile-refused", "source-change environment");
    }
    return sourceChangeArgs(name, request, schemaPath, selection.effort);
  }
  if (name === "claude-cli-print") {
    return [
      "--print",
      "--model",
      request.model,
      ...(selection.effort === "unknown" ? [] : ["--effort", selection.effort]),
      "--output-format",
      "json",
      "--json-schema",
      JSON.stringify(transportResultSchema(request)),
      "--no-session-persistence",
      "--setting-sources",
      "project,local",
      "--settings",
      "feedback" in request &&
      request.feedback?.mechanisms.some(
        (item) => item.handler === "attribution" && item.enforcement === "hard",
      )
        ? JSON.stringify(feedbackClaudeSettings)
        : '{"autoMemoryEnabled":false}',
      "--tools",
      "",
      "--disable-slash-commands",
      "--safe-mode",
      "--strict-mcp-config",
      "--mcp-config",
      '{"mcpServers":{}}',
      "--no-chrome",
      "--max-budget-usd",
      isMissionCheckRequest(request)
        ? MISSION_CHECK_LIMITS.maxBudgetUsd
        : isPlanRequest(request)
          ? PLAN_REFUTATION_LIMITS.maxBudgetUsd
          : "feedback" in request && request.feedback
            ? FEEDBACK_VERIFIER_LIMITS.maxBudgetUsd
            : "1.00",
    ];
  }
  if (!meetsMinimumVersion(harnessVersion, OBSERVED_CLI_VERSIONS.codex))
    process.stderr.write(
      `DotLn advisory: Codex CLI ${harnessVersion} is outside the recorded version observation ${OBSERVED_CLI_VERSIONS.codex}; launch continues.\n`,
    );
  return codexExecArgv({
    // The worktree-snapshot read mount is a files-only copy without Git
    // metadata, which Codex refuses unless told to skip its repository check.
    // Every other shape runs inside a Git worktree and keeps its exact bytes.
    leading:
      isEvidenceRequest(request) &&
      request.profile.profileId === "worktree-snapshot"
        ? ["--skip-git-repo-check"]
        : [],
    rest: [
      "--strict-config",
      "--model",
      request.model,
      "--json",
      "--output-schema",
      schemaPath,
      "--cd",
      request.cwd,
      "-c",
      'default_permissions="dotln-worker"',
      "-c",
      'permissions.dotln-worker.filesystem={":minimal"="read",":workspace_roots"="read"}',
      "-c",
      "permissions.dotln-worker.network.enabled=false",
      "-c",
      'approval_policy="never"',
      "-c",
      'web_search="disabled"',
      "-c",
      "project_doc_max_bytes=0",
      "-c",
      "mcp_servers={}",
      "-c",
      "memories.use_memories=false",
      "-c",
      "memories.generate_memories=false",
      "-c",
      'shell_environment_policy.inherit="none"',
      ...codexDisabled
        .filter(
          (feature) =>
            !subagents || !["multi_agent", "multi_agent_v2"].includes(feature),
        )
        .flatMap((feature) => ["--disable", feature]),
      ...(selection.effort === "unknown"
        ? []
        : ["-c", `model_reasoning_effort=${JSON.stringify(selection.effort)}`]),
      "-",
    ],
  });
}

/** The Entropy Reducer's own two shapes. Unlike every other inspection
 * profile here the reviewer and its refuter are given commands, because
 * REVIEW-001 measured one of seven findings after seven denied shell calls.
 * The tools are named, not opened: Claude confines the file tools to the
 * working directory with `--restricted` and pre-approves only the named
 * tools, so anything else is denied without a prompt; Codex adds a real
 * workspace sandbox. Claude does not path-confine a shell command, so the
 * host, not this argv, proves the frozen subject never moved. */
function entropyArgs(
  name: Exclude<WorkerTransportName, "fake" | "local-model-http">,
  request: EntropyReviewRequest | EntropyRefutationRequest,
  schemaPath: string,
  effort: string,
): readonly string[] {
  const limits = isEntropyReviewRequest(request)
    ? ENTROPY_REVIEW_LIMITS
    : ENTROPY_REFUTATION_LIMITS;
  const tools = [...request.profile.modelTools].join(",");
  if (name === "claude-cli-print")
    return [
      "--print",
      "--model",
      request.model,
      ...(effort === "unknown" ? [] : ["--effort", effort]),
      "--output-format",
      "json",
      "--json-schema",
      JSON.stringify(transportResultSchema(request)),
      "--no-session-persistence",
      // The frozen copy carries the project's own CLAUDE.md, hooks and
      // skills; neither may steer the review of that same project.
      "--safe-mode",
      "--restricted",
      "--settings",
      '{"autoMemoryEnabled":false}',
      "--disable-slash-commands",
      "--strict-mcp-config",
      "--mcp-config",
      '{"mcpServers":{}}',
      "--no-chrome",
      "--tools",
      tools,
      "--allowedTools",
      tools,
      "--permission-prompts",
      "none",
      "--max-budget-usd",
      limits.maxBudgetUsd,
    ];
  return codexExecArgv({
    approval: "never",
    rest: [
      // Perturbations belong in the frozen copy: the mutation drill asks for
      // them and the sandbox root is that copy.
      "--sandbox",
      "workspace-write",
      "--strict-config",
      "--model",
      request.model,
      "--cd",
      request.cwd,
      "--json",
      "--output-schema",
      schemaPath,
      "-c",
      'default_permissions="dotln-entropy"',
      "-c",
      'permissions.dotln-entropy.filesystem={":minimal"="read",":workspace_roots"="write"}',
      "-c",
      "permissions.dotln-entropy.network.enabled=false",
      "-c",
      'approval_policy="never"',
      "-c",
      'web_search="disabled"',
      "-c",
      "project_doc_max_bytes=0",
      "-c",
      "mcp_servers={}",
      "-c",
      "memories.use_memories=false",
      "-c",
      "memories.generate_memories=false",
      "-c",
      'shell_environment_policy.inherit="none"',
      ...codexDisabled
        .filter(
          (feature) =>
            !["shell_tool", "unified_exec", "code_mode_host"].includes(feature),
        )
        .flatMap((feature) => ["--disable", feature]),
      ...(effort === "unknown"
        ? []
        : ["-c", `model_reasoning_effort=${JSON.stringify(effort)}`]),
      "-",
    ],
  });
}

/** Two fixed shapes from writing-worker-smoke-2026-09-14, not a tool policy DSL.
 * Existing inspection arguments above intentionally retain their exact bytes.
 */
function sourceChangeArgs(
  name: Exclude<WorkerTransportName, "fake" | "local-model-http">,
  request: WriterRequest,
  schemaPath: string,
  effort: string,
): readonly string[] {
  if (name === "claude-cli-print")
    return [
      "--print",
      "--model",
      request.model,
      ...(effort === "unknown" ? [] : ["--effort", effort]),
      "--no-session-persistence", // C-W9
      "--setting-sources",
      "project,local", // C-W3, C-W4 target governance
      "--strict-mcp-config",
      "--mcp-config",
      '{"mcpServers":{}}', // C-W2
      "--no-chrome",
      "--max-budget-usd",
      "3.00", // C-W2
      "--tools",
      "Bash,Read,Edit,Write", // C-W2; C-W1 alone is ambiguous
      "--allowedTools",
      `Edit,Write,Read,Bash(${request.testCommand}),Bash(git add -A),Bash(git commit -F ${request.commitMessagePath})`,
      // C-W2 exact-pattern form; WO-051 specializes it to the three host commands.
      "--permission-prompts",
      "none", // C-W2; C-U2 establishes unattended denial
      "--output-format",
      "json",
      // WO-053 live result prose was not JSON despite the prompted schema.
      "--json-schema",
      JSON.stringify(transportResultSchema(request)),
    ];
  // The shared flags include --ignore-user-config (X-W1, X-U2).
  return codexExecArgv({
    approval: "never",
    rest: [
      "--sandbox",
      "workspace-write", // X-W1; not containment (X-W6)
      "--strict-config",
      "--model",
      request.model,
      "--cd",
      request.cwd,
      "--json", // X-W8
      "--output-schema",
      schemaPath, // Existing output-contract hardening
      "-c",
      'default_permissions="dotln-writer"', // X-W2
      "-c",
      'permissions.dotln-writer.filesystem={":minimal"="read",":workspace_roots"="write"}', // X-W2
      "-c",
      "permissions.dotln-writer.network.enabled=false", // X-W2
      // Retained hardening; project instructions/hooks are not a Codex guarantee (X-W3).
      "-c",
      'web_search="disabled"',
      "-c",
      "project_doc_max_bytes=0",
      "-c",
      "mcp_servers={}",
      "-c",
      "memories.use_memories=false",
      "-c",
      "memories.generate_memories=false",
      "-c",
      'shell_environment_policy.inherit="none"',
      // X-W1 needs native tools. WO-122's live row also requires the stable
      // code-mode host: disabling it leaves model-exposed tools unable to run.
      ...codexDisabled
        .filter(
          (feature) =>
            !["shell_tool", "unified_exec", "code_mode_host"].includes(feature),
        )
        .flatMap((feature) => ["--disable", feature]),
      ...(effort === "unknown"
        ? []
        : ["-c", `model_reasoning_effort=${JSON.stringify(effort)}`]),
      "-",
    ],
  });
}

function writerGit(cwd: string, args: readonly string[]): string {
  try {
    return execFileSync("git", [...args], {
      cwd,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
      timeout: 5_000,
    }).trim();
  } catch {
    throw new WorkerFailure(
      "profile-refused",
      "writer Git observation unavailable",
    );
  }
}

function decodeWriterResult(
  name: WorkerTransportName,
  output: ProcessResult,
  request: WriterRequest,
  before: string,
): WriterResult {
  try {
    const events =
      name === "claude-cli-print"
        ? [JSON.parse(output.stdout) as Record<string, unknown>]
        : output.stdout
            .trim()
            .split("\n")
            .map((line) => JSON.parse(line) as Record<string, unknown>);
    let reported: unknown;
    let observedDenials: WriterObservations["observedDenials"] = "unavailable";
    if (name === "claude-cli-print") {
      const terminals = events.filter((event) => event.type === "result");
      const terminal = terminals[0];
      if (
        terminals.length !== 1 ||
        terminal?.subtype !== "success" ||
        terminal.is_error === true
      )
        throw new WorkerFailure("transport-failed", "writer terminal result");
      // WO-053 requires the native schema result; display prose is not a wire contract.
      if (
        !Array.isArray(terminal.permission_denials) ||
        terminal.structured_output === undefined
      )
        throw new WorkerFailure(
          "invalid-result",
          "writer structured_output or permission_denials unavailable",
        );
      observedDenials = terminal.permission_denials.length;
      reported = terminal.structured_output;
    } else {
      if (
        events.some((event) =>
          ["error", "turn.failed"].includes(String(event.type)),
        ) ||
        !events.some((event) => event.type === "turn.completed")
      )
        throw new WorkerFailure("transport-failed", "writer turn incomplete");
      const messages = events.filter(
        (event) =>
          event.type === "item.completed" &&
          (event.item as { type?: string } | undefined)?.type ===
            "agent_message",
      );
      const text = (messages.at(-1)?.item as { text?: unknown } | undefined)
        ?.text;
      if (typeof text !== "string")
        throw new WorkerFailure(
          "invalid-result",
          "writer final message absent",
        );
      reported = JSON.parse(text); // X-W8 provides no denial field.
    }
    const sha = writerGit(request.cwd, ["rev-parse", "HEAD"]);
    return parseWriterResult(reported, request, {
      observedDenials,
      ...(sha === before
        ? {}
        : {
            observedCommit: {
              sha,
              branch: writerGit(request.cwd, [
                "rev-parse",
                "--abbrev-ref",
                "HEAD",
              ]),
            },
          }),
    });
  } catch (error) {
    if (error instanceof WorkerFailure) throw error;
    throw new WorkerFailure("invalid-result", "writer wire JSON");
  }
}

function decodeResult<R extends TransportRequest>(
  name: WorkerTransportName,
  output: ProcessResult,
  request: R,
  before?: string,
): TransportResultFor<R> {
  // The entropy capture lane sits outside the frozen copy so a retained
  // return never counts as a scratch delta.
  if (isEntropyRequest(request)) {
    mkdirSync(request.capture, { recursive: true, mode: 0o700 });
    writeFileSync(join(request.capture, "wire.jsonl"), output.stdout, {
      mode: 0o600,
    });
  }
  if (isPlanRequest(request)) {
    writeFileSync(join(request.cwd, "wire.jsonl"), output.stdout, {
      mode: 0o600,
    });
    writeFileSync(
      join(request.cwd, "statement.txt"),
      "No separate worker statement was returned; the wire file retains the complete transport return.\n",
      { mode: 0o600 },
    );
  }
  let wireDetail = `exit-${output.exitCode ?? "unknown"}`;
  if (name === "claude-cli-print") {
    try {
      const wire = JSON.parse(output.stdout) as Record<string, unknown>;
      const subtypes = [
        "success",
        "error_max_budget_usd",
        "error_max_turns",
        "error_during_execution",
        "error_max_structured_output_retries",
      ];
      wireDetail += `:${subtypes.includes(String(wire.subtype)) ? wire.subtype : "other-subtype"}:structured-${typeof wire.structured_output}`;
    } catch {
      wireDetail += ":non-json";
    }
  }
  if (output.exitCode !== 0) {
    const unavailable =
      /model.{0,100}(not found|unavailable|not supported|does not exist|invalid)|invalid.{0,40}model/iu.test(
        output.stderr + output.stdout,
      );
    throw new WorkerFailure(
      unavailable ? "model-unavailable" : "transport-failed",
      isPlanRequest(request)
        ? `${wireDetail}; stderr: ${output.stderr.slice(-4000).replace(/(?:Bearer\s+|(?:api[_-]?key|token|password)\s*[=:]\s*)\S+/gi, "[redacted credential]") || "(empty)"}`
        : wireDetail,
    );
  }
  if (isWriterRequest(request)) {
    if (before === undefined)
      throw new WorkerFailure("profile-refused", "writer baseline absent");
    return decodeWriterResult(
      name,
      output,
      request,
      before,
    ) as TransportResultFor<R>;
  }
  let parsePhase = "wire-json";
  try {
    if (name === "claude-cli-print") {
      const result = JSON.parse(output.stdout) as {
        type?: string;
        subtype?: string;
        is_error?: boolean;
        structured_output?: unknown;
        result?: unknown;
      };
      if (
        result.type !== "result" ||
        result.subtype !== "success" ||
        result.is_error === true
      )
        throw new WorkerFailure("transport-failed", wireDetail);
      if (isPlanRequest(request)) {
        writeFileSync(
          join(request.cwd, "result.json"),
          JSON.stringify(result.structured_output ?? null) + "\n",
          { mode: 0o600 },
        );
        if (typeof result.result === "string")
          writeFileSync(join(request.cwd, "statement.txt"), result.result, {
            mode: 0o600,
          });
      }
      if (isEntropyRequest(request)) {
        writeFileSync(
          join(request.capture, "result.json"),
          JSON.stringify(result.structured_output ?? null) + "\n",
          { mode: 0o600 },
        );
        writeFileSync(
          join(request.capture, "statement.txt"),
          typeof result.result === "string" ? result.result : "",
          { mode: 0o600 },
        );
      }
      return parseTransportResult(result.structured_output, request);
    }
    const events = output.stdout
      .trim()
      .split("\n")
      .map(
        (line) =>
          JSON.parse(line) as {
            type?: string;
            item?: { type?: string; text?: string };
          },
      );
    if (
      events.some((event) =>
        ["error", "turn.failed"].includes(event.type ?? ""),
      ) ||
      !events.some((event) => event.type === "turn.completed")
    )
      throw new WorkerFailure("transport-failed");
    const messages = events.filter(
      (event) =>
        event.type === "item.completed" && event.item?.type === "agent_message",
    );
    const text = messages.at(-1)?.item?.text;
    if (typeof text !== "string")
      throw new WorkerFailure("invalid-result", "final-message-absent");
    parsePhase = "final-message-json";
    if (isPlanRequest(request)) {
      writeFileSync(join(request.cwd, "result.json"), text, { mode: 0o600 });
      writeFileSync(join(request.cwd, "statement.txt"), text, { mode: 0o600 });
    }
    if (isEntropyRequest(request)) {
      writeFileSync(join(request.capture, "result.json"), text, {
        mode: 0o600,
      });
      writeFileSync(join(request.capture, "statement.txt"), text, {
        mode: 0o600,
      });
    }
    return parseTransportResult(JSON.parse(text), request);
  } catch (error) {
    if (error instanceof WorkerFailure) throw error;
    throw new WorkerFailure("invalid-result", parsePhase);
  }
}

abstract class CliWorkOrderTransport implements WorkOrderTransport {
  abstract readonly name: WorkerTransportName;
  readonly harnessVersion: string;
  constructor(
    private readonly binary: string,
    observedVersion: string,
    private readonly runner: ProcessRunner = runWorkerProcess,
    version?: string,
    private readonly onUsage?: (
      observation: ReturnType<typeof usageObservation>,
    ) => void,
    /** The environment a Codex episode isolates; the caller's by default. */
    private readonly launchEnv: NodeJS.ProcessEnv = process.env,
  ) {
    let installed = version;
    if (installed === undefined) {
      try {
        installed = execFileSync(binary, ["--version"], {
          encoding: "utf8",
          stdio: ["ignore", "pipe", "ignore"],
          timeout: 5_000,
        });
      } catch {
        process.stderr.write(
          `DotLn advisory: ${binary} version observation unavailable; launch continues.\n`,
        );
      }
    }
    this.harnessVersion =
      version ?? installed?.match(/\b\d+\.\d+\.\d+\b/u)?.[0] ?? "unknown";
    if (!meetsMinimumVersion(this.harnessVersion, observedVersion))
      process.stderr.write(
        `DotLn advisory: ${binary} CLI ${this.harnessVersion} is outside the recorded version observation ${observedVersion}; launch continues.\n`,
      );
  }
  dispatch<R extends TransportRequest>(
    request: R,
    now: () => number,
  ): TransportDispatch<TransportResultFor<R>> {
    const schemaDirectory = mkdtempSync(join(tmpdir(), "dotln-worker-schema-"));
    let episode: CodexEpisode | undefined;
    try {
      const schemaPath = join(schemaDirectory, "result.json");
      const args = canonicalWorkerArgs(
        this.name,
        request,
        schemaPath,
        this.harnessVersion,
      );
      writeFileSync(
        schemaPath,
        JSON.stringify(transportResultSchema(request)),
        {
          mode: 0o600,
        },
      );
      const before = isWriterRequest(request)
        ? writerGit(request.cwd, ["rev-parse", "HEAD"])
        : undefined;
      episode =
        this.name === "codex-cli-exec"
          ? startCodexEpisode(this.launchEnv)
          : undefined;
      const process = this.runner({
        binary: this.binary,
        args,
        cwd: request.cwd,
        input: transportPrompt(request),
        ...(episode ? { env: episode.env } : {}),
        timeoutMs: isEntropyReviewRequest(request)
          ? ENTROPY_REVIEW_LIMITS.timeoutMs
          : isEntropyRefutationRequest(request)
            ? ENTROPY_REFUTATION_LIMITS.timeoutMs
            : isMissionCheckRequest(request)
              ? MISSION_CHECK_LIMITS.timeoutMs
              : isPlanRequest(request)
                ? PLAN_REFUTATION_LIMITS.timeoutMs
                : "feedback" in request && request.feedback
                  ? FEEDBACK_VERIFIER_LIMITS.timeoutMs
                  : WORKER_TIMEOUT_MS,
      });
      const receipt = process.accepted.then(() => ({
        commandId: request.command.commandId,
        transport: this.name,
        acceptedAt: now(),
      }));
      void receipt.catch(() => {});
      // The home outlives the process, never the episode: it is removed and
      // digested once the process has ended, whichever way it ended.
      const started = episode;
      const isolation = started
        ? process.completed.then(
            () => started.finish(),
            () => started.finish(),
          )
        : undefined;
      const usage = process.completed.then((output) => {
        const observation = usageObservation(decodeUsageSource(output.stdout));
        this.onUsage?.(observation);
        return observation;
      });
      const completed = Promise.all([process.completed, usage, isolation])
        .then(([output]) => decodeResult(this.name, output, request, before))
        .finally(() => rmSync(schemaDirectory, { recursive: true }));
      void completed.catch(() => {});
      void usage.catch(() => {});
      return {
        receipt,
        completed,
        alive: process.alive,
        kill: process.kill,
        usage,
        ...(isolation ? { isolation } : {}),
      };
    } catch (error) {
      episode?.finish();
      rmSync(schemaDirectory, { recursive: true });
      throw error;
    }
  }
}

export class ClaudeCliPrintWorkOrderTransport extends CliWorkOrderTransport {
  readonly name = "claude-cli-print" as const;
  constructor(
    runner?: ProcessRunner,
    version?: string,
    onUsage?: (observation: ReturnType<typeof usageObservation>) => void,
  ) {
    super("claude", OBSERVED_CLI_VERSIONS.claude, runner, version, onUsage);
  }
}
export class CodexCliExecWorkOrderTransport extends CliWorkOrderTransport {
  readonly name = "codex-cli-exec" as const;
  constructor(
    runner?: ProcessRunner,
    version?: string,
    onUsage?: (observation: ReturnType<typeof usageObservation>) => void,
    /** Whose Codex home an episode isolates; the caller's by default. */
    launchEnv?: NodeJS.ProcessEnv,
  ) {
    super(
      "codex",
      OBSERVED_CLI_VERSIONS.codex,
      runner,
      version,
      onUsage,
      launchEnv,
    );
  }
}
