import { spawn } from "node:child_process";
import { observedExecFileSync as execFileSync } from "./gate-deadlines.mjs";
import { startDeadline } from "./gate-deadlines.mjs";
import {
  closeSync,
  fstatSync,
  mkdtempSync,
  openSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { feedbackClaudeSettings } from "./loadouts/feedback.js";
import { PLAN_REFUTATION_LIMITS } from "./plan-refutation-protocol.js";
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
          ...process.env,
          DOTLN_RESIDENT_STORE: launch.resident.store,
          DOTLN_RESIDENT_EPISODE_ID: launch.resident.episodeId,
        }
      : process.env,
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
      isPlanRequest(request)
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
  return [
    "exec",
    // The worktree-snapshot read mount is a files-only copy without Git
    // metadata, which Codex refuses unless told to skip its repository check.
    // Every other shape runs inside a Git worktree and keeps its exact bytes.
    ...(isEvidenceRequest(request) &&
    request.profile.profileId === "worktree-snapshot"
      ? ["--skip-git-repo-check"]
      : []),
    "--ephemeral",
    "--ignore-user-config",
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
  ];
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
  return [
    "-a",
    "never",
    "exec",
    "--ephemeral",
    "--ignore-user-config", // X-W1, X-U2
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
  ];
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
      const process = this.runner({
        binary: this.binary,
        args,
        cwd: request.cwd,
        input: transportPrompt(request),
        timeoutMs: isPlanRequest(request)
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
      const usage = process.completed.then((output) => {
        const observation = usageObservation(decodeUsageSource(output.stdout));
        this.onUsage?.(observation);
        return observation;
      });
      const completed = Promise.all([process.completed, usage])
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
      };
    } catch (error) {
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
  ) {
    super("codex", OBSERVED_CLI_VERSIONS.codex, runner, version, onUsage);
  }
}
