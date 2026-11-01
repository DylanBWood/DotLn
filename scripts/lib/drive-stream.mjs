import { drivenLifecycleDispatch } from "../../packages/skeleton/dist/src/harness-command.js";
import {
  commandFailed,
  commandKind,
  commandShape,
  diagnosticSignals,
  lifecycleRefusal,
  nativeBoundary,
  nativeFailureCause,
  refusalFindings,
} from "./drive-diagnostics.mjs";

// A declined phase keeps its last rows in this enumerated form, so the
// receipt shows what the host did around the decline without its narrative.
const EVENT_TAIL_ROWS = 64;
const CODEX_ROW_TYPES = new Set([
  "thread.started",
  "turn.started",
  "turn.completed",
  "turn.failed",
  "item.started",
  "item.updated",
  "item.completed",
  "error",
]);
const CODEX_ITEM_TYPES = new Set([
  "agent_message",
  "reasoning",
  "command_execution",
  "file_change",
  "mcp_tool_call",
  "collab_tool_call",
  "web_search",
  "todo_list",
  "error",
]);
const CLAUDE_ROW_TYPES = new Set(["system", "assistant", "user", "result"]);
const enumerated = (set, value) =>
  typeof value === "string" && set.has(value) ? value : "other";

// A declined item keeps one shape whichever host reports it: the command's
// shape, the reason the host printed with every URL, path and query masked
// and capped, or that it printed none (WO-247-D003). The raw text stays in
// the retained stderr, in ignored storage.
const REASON_LIMIT = 4096;
// In order: any scheme URL; a bare hostname with a path; a drive-letter path;
// a backslash token (UNC or relative); any slash-bearing token (absolute,
// home, variable or relative paths; a word such as either/or is masked too,
// which loses nothing a diagnosis needs); then a query string.
const REASON_MASKS = [
  [/\b[a-z][a-z0-9+.-]*:\/\/[^\s"'<>)\]]+/giu, "<url>"],
  [/\b(?:[\p{L}\p{N}_-]+\.)+\p{L}{2,}(?:\/[\p{L}\p{N}_.@$%+-]*)+/giu, "<url>"],
  [/\b[A-Za-z]:\\(?:[^\s\\"'<>]+\\?)+/gu, "<path>"],
  [
    /(?<![\p{L}\p{N}_\\])(?:\\\\|[\p{L}\p{N}_.@$+-]+\\)[\p{L}\p{N}_.@$%+\\-]*/gu,
    "<path>",
  ],
  [
    /(?<![\p{L}\p{N}_/])(?:~|\$[\p{L}\p{N}_]+|[A-Za-z]:)?(?:\/[\p{L}\p{N}_.@$%+-]*)+/gu,
    "<path>",
  ],
  [
    /(?<![\p{L}\p{N}_/.])[\p{L}\p{N}_.@$+-]+(?:\/[\p{L}\p{N}_.@$%+-]*)+/gu,
    "<path>",
  ],
  [
    /\?[\p{L}\p{N}_%.+-]+=[^\s"'<>)\]&]*(?:&[\p{L}\p{N}_%.+-]+=[^\s"'<>)\]&]*)*/gu,
    "<query>",
  ],
];
export function redactReason(text) {
  let reason = text;
  for (const [pattern, mask] of REASON_MASKS)
    reason = reason.replace(pattern, mask);
  return reason;
}
export function declinedItem({
  kind,
  command,
  reason = null,
  reasonSource = "none-printed",
  diagnosticSignals = [],
  sequence,
}) {
  const printed =
    typeof reason === "string" && reason.trim()
      ? redactReason(reason.trim()).slice(0, REASON_LIMIT)
      : null;
  return {
    kind: kind ?? null,
    command: command ?? null,
    status: "declined",
    exitCode: null,
    reason: printed,
    reasonSource: printed ? reasonSource : "none-printed",
    ...(printed ? { reasonRedaction: "urls-paths-queries-masked" } : {}),
    ...(diagnosticSignals.length ? { diagnosticSignals } : {}),
    sequence,
  };
}

// Codex prints a rejected command's reason on stderr as a Rejected message
// quoted inside its error, each layer escaped as a Rust string; the stream
// item carries none (WO-247-D007). The quote may itself be escaped once more.
const unescapeRust = (text) =>
  text.replace(/\\(.)/gu, (_, escaped) =>
    escaped === "n" ? "\n" : escaped === "t" ? "\t" : escaped,
  );
export function printedRejection(stderr) {
  // The declined item is the phase's last command, so its rejection is the
  // last one printed; an earlier failed process prints the same form.
  const match = [
    ...(stderr ?? "").matchAll(/Rejected\((\\?)"((?:[^"\\]|\\.)*?)\1"\)/gu),
  ].at(-1);
  if (!match) return null;
  const once = unescapeRust(match[2]);
  return match[1] ? unescapeRust(once) : once;
}

// Reduce a native host's stream to metering and protocol facts. Worker
// narrative is never retained or fed to another phase. `facts` is shared with
// the process supervisor, which records what only it can observe there too.
export function streamObservation({
  protocol = "claude",
  launchpad,
  launcherCommand = null,
  onSession,
  onSubagent,
  onCommand,
  stop = () => {},
}) {
  const facts = {
    costUsd: null,
    usage: null,
    model: null,
    effort: null,
    permissionMode: null,
    sessionId: null,
    error: false,
    refused: undefined,
    cause: undefined,
  };
  const hookEvents = new Set(),
    refusalCodes = new Set(),
    dispatches = new Set(),
    commands = new Map(),
    shapes = new Map(),
    toolCalls = [],
    commandResults = [],
    boundaryResults = [],
    nativeDiagnostics = new Map();
  // The rows around a decline, enumerated, and the declined item itself with
  // the reason the host printed, or that it printed none (WO-247).
  const eventTail = [];
  let rowCount = 0;
  let declined = null;
  const observeRow = (row) => {
    rowCount++;
    eventTail.push(row);
    if (eventTail.length > EVENT_TAIL_ROWS) eventTail.shift();
  };
  const observeNativeDiagnostic = (source, value) => {
    const entry = nativeDiagnostics.get(source) ?? {
      count: 0,
      nonemptyMessages: 0,
      unclassifiedCount: 0,
      signals: new Set(),
    };
    entry.count++;
    const message = typeof value === "string" ? value : "";
    if (message.trim()) entry.nonemptyMessages++;
    const signals = diagnosticSignals(message);
    if (!signals.length) entry.unclassifiedCount++;
    for (const signal of signals) entry.signals.add(signal);
    nativeDiagnostics.set(source, entry);
  };
  const failLauncher = (diagnostic) => {
    facts.error = true;
    facts.cause =
      /permission.*(?:denied|refused)|not allowed|not permitted|sandbox is required/i.test(
        diagnostic,
      )
        ? "native-launcher-refused"
        : "native-launcher-failed";
    facts.refused =
      "The native host did not admit or complete the canonical launcher; stop without retrying or changing launchers.";
    stop();
  };
  const failPermission = (item) => {
    facts.error = true;
    facts.cause = "native-permission-refused";
    facts.refused =
      "The native host denied a phase command; stop without another attempt until the host admission condition is resolved.";
    declined ??= declinedItem({ ...item, sequence: rowCount });
    stop();
  };
  const observeCommand = (observation) => {
    commandResults.push(observation);
    try {
      onCommand?.(observation);
    } catch {
      facts.error = true;
      facts.cause = "command-observation-failed";
      stop();
    }
  };
  const observeRefusal = (value) => {
    const { codes, boundaries } = refusalFindings(value);
    for (const code of codes) refusalCodes.add(code);
    boundaryResults.push(...boundaries);
    return codes;
  };
  const observeNativeBoundary = (diagnostic) => {
    const boundary = nativeBoundary(diagnostic);
    if (boundary) boundaryResults.push(boundary);
  };

  const codexSubagent = (item) => {
    try {
      const refusal = onSubagent?.({
        id: item.id,
        sender: item.sender_thread_id,
        children: item.receiver_thread_ids ?? [],
      });
      if (refusal) {
        facts.refused = refusal;
        stop();
      }
    } catch {
      facts.error = true;
      facts.cause = "subagent-observation-failed";
      stop();
    }
  };
  const codexItem = (item) => {
    if (item.type === "error")
      observeNativeDiagnostic("item.error", item.message);
    // Web-search items have no status field; their completed event
    // reports that results were returned to the agent.
    if (item.type === "web_search")
      observeCommand({
        kind: "public-web",
        status: item.status ?? "completed",
        exitCode: null,
      });
    const kind =
      item.type === "command_execution" &&
      (commandKind(item.command ?? "", launcherCommand) ??
        "unclassified-shell");
    const failed = commandFailed({
      status: item.status,
      exitCode: item.exit_code,
    });
    const signals = failed ? diagnosticSignals(item.aggregated_output) : [];
    if (kind && failed) {
      observeRefusal(item.aggregated_output);
      observeNativeBoundary(item.aggregated_output ?? "");
    }
    if (kind)
      observeCommand({
        kind,
        status: item.status ?? null,
        exitCode: item.exit_code ?? null,
        ...(kind === "unclassified-shell" || failed
          ? { shape: commandShape(item.command ?? "") }
          : {}),
        ...(signals.length ? { diagnosticSignals: signals } : {}),
      });
    if (kind === "driver-launch" && item.exit_code !== 0)
      failLauncher(item.aggregated_output ?? "");
    else if (kind && item.status === "declined")
      failPermission({
        kind,
        command: commandShape(item.command ?? ""),
        reason: item.aggregated_output,
        reasonSource: "command_execution.aggregated_output",
        diagnosticSignals: signals,
      });
    if (
      [
        "command_execution",
        "file_change",
        "mcp_tool_call",
        "collab_tool_call",
        "web_search",
      ].includes(item.type)
    )
      toolCalls.push(item.type);
    if (
      item.type === "command_execution" &&
      item.exit_code !== 0 &&
      drivenLifecycleDispatch(item.command ?? "", launchpad)
    )
      facts.refused =
        lifecycleRefusal(item.aggregated_output ?? "") ?? facts.refused;
    if (item.type === "collab_tool_call" && item.tool === "spawn_agent")
      codexSubagent(item);
  };
  const codexRow = (row) => {
    observeRow({
      type: enumerated(CODEX_ROW_TYPES, row.type),
      ...(row.item
        ? {
            item: enumerated(CODEX_ITEM_TYPES, row.item.type),
            ...(typeof row.item.status === "string"
              ? { status: row.item.status.slice(0, 32) }
              : {}),
            ...(Number.isInteger(row.item.exit_code)
              ? { exitCode: row.item.exit_code }
              : {}),
          }
        : {}),
    });
    if (row.type === "thread.started") {
      facts.sessionId = row.thread_id;
      try {
        onSession?.(facts.sessionId);
      } catch {
        facts.error = true;
        facts.cause = "identity-persistence-failed";
        stop();
      }
    }
    if (row.type === "turn.completed") {
      facts.usage = row.usage ?? null;
      if (facts.cause === "workspace-routing-discovery-failed")
        facts.cause = undefined;
    }
    if (["turn.failed", "error"].includes(row.type))
      observeNativeDiagnostic(
        row.type,
        row.message ?? row.error?.message ?? "",
      );
    if (row.type === "turn.failed") facts.error = true;
    if (
      ["turn.failed", "error"].includes(row.type) &&
      /workspace routing discovery failed/.test(
        row.message ?? row.error?.message ?? "",
      )
    )
      facts.cause = "workspace-routing-discovery-failed";
    if (row.type === "item.completed" && row.item) codexItem(row.item);
  };

  const claudeHookResponse = (row) => {
    for (const output of new Set([row.stdout, row.output])) {
      if (typeof output !== "string") continue;
      let hook;
      try {
        hook = JSON.parse(output);
      } catch {
        continue;
      }
      if (hook?.hookSpecificOutput?.permissionDecision === "deny")
        observeRefusal(hook.hookSpecificOutput.permissionDecisionReason);
      if (
        row.hook_event === "UserPromptSubmit" &&
        /^DotLn: prompt accepted; DOTLN_HARNESS_REFUSED:/.test(
          hook?.systemMessage ?? "",
        )
      ) {
        observeRefusal(hook.systemMessage);
        facts.refused =
          "The worker's automatic lifecycle dispatch was refused.";
      }
    }
    if (row.exit_code === 2) {
      const codes = observeRefusal(row.stderr);
      if (
        row.hook_event === "UserPromptSubmit" &&
        codes.has("DOTLN_HARNESS_REFUSED")
      )
        facts.refused =
          "The worker's automatic lifecycle dispatch was refused.";
    }
  };
  const claudeToolUse = (block) => {
    toolCalls.push(block.name);
    if (["WebSearch", "WebFetch"].includes(block.name))
      commands.set(block.id, "public-web");
    if (block.name !== "Bash") return;
    const command = block.input?.command ?? "";
    commands.set(
      block.id,
      commandKind(command, launcherCommand) ?? "unclassified-shell",
    );
    shapes.set(block.id, commandShape(command));
    if (drivenLifecycleDispatch(command, launchpad)) dispatches.add(block.id);
  };
  const claudeToolResult = (block) => {
    const kind = commands.get(block.tool_use_id);
    if (kind) {
      const signals = block.is_error ? diagnosticSignals(block.content) : [];
      observeCommand({
        kind,
        status: block.is_error ? "failed" : "completed",
        exitCode: null,
        ...(shapes.has(block.tool_use_id) &&
        (block.is_error || kind === "unclassified-shell")
          ? { shape: shapes.get(block.tool_use_id) }
          : {}),
        ...(signals.length ? { diagnosticSignals: signals } : {}),
      });
      if (block.is_error && kind === "driver-launch")
        failLauncher(JSON.stringify(block.content));
    }
    if (!block.is_error) return;
    const diagnostic = JSON.stringify(block.content);
    observeRefusal(diagnostic);
    observeNativeBoundary(diagnostic);
    if (dispatches.has(block.tool_use_id))
      facts.refused = lifecycleRefusal(diagnostic) ?? facts.refused;
  };
  const claudeResult = (row) => {
    facts.costUsd = row.total_cost_usd ?? null;
    facts.usage = row.usage ?? null;
    facts.error ||= row.is_error === true;
    if (!facts.error) return;
    const diagnostic = [
      ...(Array.isArray(row.errors) ? row.errors : [row.errors]),
      row.result,
    ]
      .filter((value) => typeof value === "string")
      .join("\n");
    if (row.is_error === true)
      observeNativeDiagnostic("result-error", diagnostic);
    facts.cause ??= nativeFailureCause(diagnostic);
    if (facts.cause === "native-provider-safeguard")
      facts.refused =
        "The provider safeguard refused this native session before phase completion; stop and inspect the recorded boundary before a fresh session.";
    if (facts.cause === "native-proxy-tunnel-refused")
      facts.refused =
        "The native worker's API connection was refused by its sandbox proxy; inspect the invocation's network allowance before re-entry.";
  };
  const claudeRow = (row) => {
    observeRow({
      type: enumerated(CLAUDE_ROW_TYPES, row.type),
      ...(typeof row.subtype === "string"
        ? { subtype: row.subtype.slice(0, 32) }
        : {}),
    });
    if (row.type === "system" && row.subtype?.startsWith("hook"))
      hookEvents.add(row.subtype);
    if (row.type === "system" && row.subtype === "permission_denied") {
      boundaryResults.push({
        kind: "native-permission",
        commandKind: commands.get(row.tool_use_id) ?? null,
        decisionSource: ["rule", "mode", "classifier", "asyncAgent"].includes(
          row.decision_reason_type,
        )
          ? row.decision_reason_type
          : "unknown",
      });
      // Claude's denial row carries the host's reason prose, which its
      // decision source already classifies; only the command shape is kept.
      failPermission({
        kind: commands.get(row.tool_use_id) ?? null,
        command: shapes.get(row.tool_use_id) ?? null,
      });
    }
    if (row.type === "system" && row.subtype === "hook_response")
      claudeHookResponse(row);
    for (const block of row.message?.content ?? []) {
      if (block.type === "tool_use") claudeToolUse(block);
      if (block.type === "tool_result") claudeToolResult(block);
    }
    if (row.type === "system" && row.subtype === "init") {
      facts.model = row.model ?? null;
      facts.effort = ["low", "medium", "high", "xhigh", "max"].includes(
        row.effort,
      )
        ? row.effort
        : null;
      facts.permissionMode = [
        "default",
        "auto",
        "acceptEdits",
        "plan",
        "dontAsk",
        "bypassPermissions",
      ].includes(row.permissionMode)
        ? row.permissionMode
        : null;
    }
    if (row.type === "result") claudeResult(row);
  };

  return {
    facts,
    observeNativeDiagnostic,
    // The process's stderr tail, read once it ended: a diagnostic source like
    // any other, and on Codex the one place the host prints the reason for an
    // item its stream reported declined without one.
    observeStderrTail(text) {
      if (typeof text !== "string" || !text.trim()) return;
      observeNativeDiagnostic("stderr-tail", text);
      if (protocol !== "codex" || !declined || declined.reason !== null) return;
      const printed = printedRejection(text);
      if (printed === null) return;
      declined = declinedItem({
        ...declined,
        reason: printed,
        reasonSource: "native-stderr",
      });
    },
    inspect(line) {
      let row;
      try {
        row = JSON.parse(line);
      } catch {
        /* Malformed stream lines supply no evidence. */
        return;
      }
      if (row === null || typeof row !== "object") return;
      try {
        if (protocol === "codex") codexRow(row);
        else claudeRow(row);
      } catch {
        // The rest of this row may be the refusal, so the phase cannot go on
        // as though it had been read.
        facts.error = true;
        facts.cause = "stream-observation-failed";
        stop();
      }
    },
    observed: () => ({
      hookEvents: [...hookEvents],
      refusalCodes: [...refusalCodes],
      toolCalls,
      commandResults,
      boundaryResults,
      nativeDiagnostics: [...nativeDiagnostics].map(([source, entry]) => ({
        source,
        count: entry.count,
        provenance: "message-pattern",
        nonemptyMessages: entry.nonemptyMessages,
        unclassifiedCount: entry.unclassifiedCount,
        signals: [...entry.signals],
      })),
      ...(declined
        ? { declined, eventTail: eventTail.slice(), eventRows: rowCount }
        : {}),
    }),
  };
}
