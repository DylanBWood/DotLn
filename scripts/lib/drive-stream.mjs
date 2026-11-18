import {
  drivenLifecycleDispatch,
  harnessToolEffects,
} from "../../packages/skeleton/dist/src/harness-command.js";
import {
  COMMAND_SHAPE_VERSION,
  commandFailed,
  commandKind,
  commandShape,
  diagnosticSignals,
  lifecycleRefusal,
  lifecycleRefusalReason,
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
// What a denial keeps of the tool: its name when it is one of the host's own,
// and otherwise only that it was an MCP tool or some other. The host's own
// are the plainly named tools of the table the harness classifies every call
// by, so a tool added there is named here.
const DENIED_TOOLS = new Set(
  Object.keys(harnessToolEffects).filter((name) =>
    /^[A-Z][A-Za-z]+$/u.test(name),
  ),
);
export const deniedTool = (name) =>
  typeof name !== "string" || !name
    ? null
    : DENIED_TOOLS.has(name)
      ? name
      : name.startsWith("mcp__")
        ? "mcp-tool"
        : "other";
// The components the host names as having decided a denial.
const DECISION_SOURCES = ["rule", "mode", "classifier", "asyncAgent"];
// A phase's helpers can be denied many calls; the record counts every one
// and keeps the first of them.
const HELPER_DENIAL_ITEMS = 12;
const contentText = (content) =>
  typeof content === "string"
    ? content
    : Array.isArray(content)
      ? content
          .map((part) => (typeof part?.text === "string" ? part.text : ""))
          .join("\n")
      : "";

export function declinedItem({
  kind,
  command,
  reason = null,
  reasonSource = "none-printed",
  diagnosticSignals = [],
  sequence,
  tool,
  actor,
  decisionSource,
  atMs,
}) {
  const printed =
    typeof reason === "string" && reason.trim()
      ? redactReason(reason.trim()).slice(0, REASON_LIMIT)
      : null;
  return {
    kind: kind ?? null,
    command: command ?? null,
    // The tool's name from a fixed list, who made the call, the component
    // that decided and how far into the attempt it came, where the host said.
    ...(tool ? { tool } : {}),
    ...(actor ? { actor } : {}),
    ...(decisionSource ? { decisionSource } : {}),
    ...(Number.isSafeInteger(atMs) && atMs >= 0 ? { atMs } : {}),
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
  now = Date.now,
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
    refusedReason: undefined,
    refusedReasonOf: undefined,
    cause: undefined,
  };
  const openedAt = now();
  const hookEvents = new Set(),
    refusalCodes = new Set(),
    refusalCounts = new Map(),
    refusalStops = new Map(),
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
  let hostDenials = null;
  const helperDenials = { count: 0, items: [] };
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
      "The host denied a call the phase worker made, and the drive ended the phase there: no worker goes around a denial or repeats it. The drive's account names the call and the next step.";
    declined ??= declinedItem({ ...item, sequence: rowCount });
    stop();
  };
  // A helper agent's denied call is the helper's to report to its worker.
  // The phase goes on; the record keeps that it happened and what it was.
  const observeHelperDenial = (item) => {
    helperDenials.count++;
    if (helperDenials.items.length < HELPER_DENIAL_ITEMS)
      helperDenials.items.push(declinedItem({ ...item, sequence: rowCount }));
  };
  // A reason belongs to the refusal it was read from, so it is kept with
  // that refusal's sentence: a later stop of another kind does not carry it.
  const reasonFor = (reason) => {
    facts.refusedReason = reason ?? undefined;
    facts.refusedReasonOf = reason ? facts.refused : undefined;
  };
  // A refused lifecycle dispatch keeps why in the kit's own fixed words,
  // where the refusal is one of the forms those words cover.
  const refuseDispatch = (diagnostic, text) => {
    const refusal = lifecycleRefusal(diagnostic);
    if (!refusal) return;
    facts.refused = refusal;
    reasonFor(lifecycleRefusalReason(text));
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
  // A refused call is counted once, where its result comes back; a hook's
  // own row for the same call names its code and is not counted again.
  const observeRefusal = (value, counted = false) => {
    const { codes, boundaries, stops } = refusalFindings(value);
    for (const code of codes) {
      refusalCodes.add(code);
      if (counted) refusalCounts.set(code, (refusalCounts.get(code) ?? 0) + 1);
    }
    if (counted)
      for (const id of stops)
        refusalStops.set(id, (refusalStops.get(id) ?? 0) + 1);
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
      observeRefusal(item.aggregated_output, true);
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
        tool: "shell",
        atMs: now() - openedAt,
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
      refuseDispatch(
        item.aggregated_output ?? "",
        item.aggregated_output ?? "",
      );
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
    // The host can print one answer in two fields of the row that differ
    // (its output beside what else the hook wrote): one row counts once.
    let counted = false;
    const once = () => {
      const first = !counted;
      counted = true;
      return first;
    };
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
      // A hook that blocks a stop answers with a decision and a reason, and
      // no tool result follows it: its refusal is counted here, once.
      if (hook?.decision === "block") observeRefusal(hook.reason, once());
      if (
        row.hook_event === "UserPromptSubmit" &&
        /^DotLn: prompt accepted; DOTLN_HARNESS_REFUSED:/.test(
          hook?.systemMessage ?? "",
        )
      ) {
        // A prompt's dispatch has no tool result to be counted at, so its
        // refusal is counted here, once.
        observeRefusal(hook.systemMessage, once());
        facts.refused =
          "The worker's automatic lifecycle dispatch was refused.";
        reasonFor(lifecycleRefusalReason(hook.systemMessage));
      }
    }
    if (row.exit_code === 2) {
      const codes = observeRefusal(
        row.stderr,
        row.hook_event === "UserPromptSubmit" && once(),
      );
      if (
        row.hook_event === "UserPromptSubmit" &&
        codes.has("DOTLN_HARNESS_REFUSED")
      ) {
        facts.refused =
          "The worker's automatic lifecycle dispatch was refused.";
        reasonFor(lifecycleRefusalReason(row.stderr));
      }
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
    observeRefusal(diagnostic, true);
    observeNativeBoundary(diagnostic);
    if (dispatches.has(block.tool_use_id))
      refuseDispatch(diagnostic, contentText(block.content));
  };
  const claudeResult = (row) => {
    // The host's result row is its own count of the calls it denied; a
    // denial's event is best effort. A run has a result row for each of its
    // turns, a turn that handles a background agent's result among them, and
    // each counts its own turn's denials.
    if (Array.isArray(row.permission_denials))
      hostDenials = (hostDenials ?? 0) + row.permission_denials.length;
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
      const decisionSource = DECISION_SOURCES.includes(row.decision_reason_type)
        ? row.decision_reason_type
        : "unknown";
      // The host names a subagent's call by its agent's id; that it has one
      // is all that is kept of it.
      const actor =
        typeof row.agent_id === "string" && row.agent_id ? "helper" : "worker";
      boundaryResults.push({
        kind: "native-permission",
        commandKind: commands.get(row.tool_use_id) ?? null,
        decisionSource,
        actor,
      });
      // Claude's denial row carries the host's reason prose, which its
      // decision source already classifies. Kept: the tool's name from a
      // fixed list, the command shape, who called, what decided and when.
      const item = {
        kind: commands.get(row.tool_use_id) ?? null,
        command: shapes.get(row.tool_use_id) ?? null,
        tool: deniedTool(row.tool_name),
        actor,
        decisionSource,
        atMs: now() - openedAt,
      };
      // The phase worker's own denied call ends the phase, so that no worker
      // goes around it or repeats it (WO-192-D048). A helper's does not: the
      // helper reports it and the worker judges what it means.
      if (actor === "helper") observeHelperDenial(item);
      else failPermission(item);
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
      ...(refusalCounts.size
        ? { refusalCounts: Object.fromEntries(refusalCounts) }
        : {}),
      ...(refusalStops.size
        ? { refusalStops: Object.fromEntries(refusalStops) }
        : {}),
      toolCalls,
      commandShapeVersion: COMMAND_SHAPE_VERSION,
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
      ...(helperDenials.count
        ? {
            helperDenials: {
              count: helperDenials.count,
              items: helperDenials.items.slice(),
            },
          }
        : {}),
      ...(hostDenials === null ? {} : { hostDenialsReported: hostDenials }),
    }),
  };
}
