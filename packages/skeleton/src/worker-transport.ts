import { spawn, execFileSync } from "node:child_process";
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
import {
  WorkerFailure,
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
  isPlanRequest,
  type TransportRequest,
  type TransportResultFor,
} from "./verification-protocol.js";

export interface WorkerLaunch {
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
  const capture = mkdtempSync(join(tmpdir(), "dotln-worker-output-"));
  const file = join(capture, "stdout");
  const fd = openSync(file, "wx", 0o600);
  const child = spawn(launch.binary, [...launch.args], {
    cwd: launch.cwd,
    stdio: ["pipe", fd, "pipe"],
    // Auth is resolved by the CLI, never copied into a prompt or log. Restrict
    // model tool environments separately in the canonical launch below.
    env: process.env,
  });
  let live = false;
  let stderr = "";
  let failure: WorkerFailure | undefined;
  const kill = () => {
    failure ??= new WorkerFailure("interrupted");
    child.kill("SIGKILL");
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
    });
    child.once("close", (exitCode, signal) => {
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

export function canonicalWorkerArgs(
  name: WorkerTransportName,
  request: TransportRequest,
  schemaPath: string,
): readonly string[] {
  validateTransportRequest(request);
  if (name === "fake") throw new WorkerFailure("profile-refused");
  if (name === "claude-cli-print") {
    if (request.effort === "unknown")
      throw new WorkerFailure("profile-refused");
    return [
      "--print",
      "--model",
      request.model,
      "--effort",
      request.effort,
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
  if (request.effort !== "unknown") throw new WorkerFailure("profile-refused");
  return [
    "exec",
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
    ...codexDisabled.flatMap((name) => ["--disable", name]),
    "-",
  ];
}

function decodeResult<R extends TransportRequest>(
  name: WorkerTransportName,
  output: ProcessResult,
  request: R,
): TransportResultFor<R> {
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
      wireDetail,
    );
  }
  let parsePhase = "wire-json";
  try {
    if (name === "claude-cli-print") {
      const result = JSON.parse(output.stdout) as {
        type?: string;
        subtype?: string;
        is_error?: boolean;
        structured_output?: unknown;
      };
      if (
        result.type !== "result" ||
        result.subtype !== "success" ||
        result.is_error === true
      )
        throw new WorkerFailure("transport-failed", wireDetail);
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
    observedVersions: readonly string[],
    private readonly runner: ProcessRunner = runWorkerProcess,
    version?: string,
  ) {
    const installed =
      version ??
      execFileSync(binary, ["--version"], {
        encoding: "utf8",
        stdio: ["ignore", "pipe", "ignore"],
        timeout: 5_000,
      });
    this.harnessVersion =
      installed.match(/\b\d+\.\d+\.\d+\b/u)?.[0] ?? "unknown";
    if (!observedVersions.includes(this.harnessVersion))
      throw new WorkerFailure("profile-refused");
  }
  dispatch<R extends TransportRequest>(
    request: R,
    now: () => number,
  ): TransportDispatch<TransportResultFor<R>> {
    const schemaDirectory = mkdtempSync(join(tmpdir(), "dotln-worker-schema-"));
    try {
      const schemaPath = join(schemaDirectory, "result.json");
      const args = canonicalWorkerArgs(this.name, request, schemaPath);
      writeFileSync(
        schemaPath,
        JSON.stringify(transportResultSchema(request)),
        {
          mode: 0o600,
        },
      );
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
      const completed = process.completed
        .then((output) => decodeResult(this.name, output, request))
        .finally(() => rmSync(schemaDirectory, { recursive: true }));
      void completed.catch(() => {});
      return { receipt, completed, alive: process.alive, kill: process.kill };
    } catch (error) {
      rmSync(schemaDirectory, { recursive: true });
      throw error;
    }
  }
}

export class ClaudeCliPrintWorkOrderTransport extends CliWorkOrderTransport {
  readonly name = "claude-cli-print" as const;
  constructor(runner?: ProcessRunner, version?: string) {
    super("claude", ["2.1.261", "2.1.263"], runner, version);
  }
}
export class CodexCliExecWorkOrderTransport extends CliWorkOrderTransport {
  readonly name = "codex-cli-exec" as const;
  constructor(runner?: ProcessRunner, version?: string) {
    super("codex", ["0.153.4"], runner, version);
  }
}
