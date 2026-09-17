import { createHash } from "node:crypto";
import {
  appendFileSync,
  closeSync,
  existsSync,
  fstatSync,
  lstatSync,
  mkdirSync,
  openSync,
  readFileSync,
  readSync,
  readdirSync,
} from "node:fs";
import { join } from "node:path";
import { readGateChecks } from "./gate-evidence.mjs";
import { sessionTranscript, usageSessionKey } from "./usage-observation.mjs";

type Row = Record<string, any>;
export interface ObservationScope {
  sessionKey: string;
  workOrder: string | null;
  phase: string;
  startedAt?: string;
  usageKey?: string;
}
const digest = (value: string) =>
  createHash("sha256").update(value).digest("hex");
const directory = (root: string) => join(root, "docs/control/local/harness");
const journalPath = (root: string, scope: ObservationScope) => {
  if (!/^[a-f0-9]{64}$/.test(scope.sessionKey))
    throw new Error("Invalid observation session");
  return join(directory(root), `${scope.sessionKey}.jsonl`);
};
const rows = (path: string): Row[] => {
  if (!existsSync(path)) return [];
  if (!lstatSync(path).isFile() || lstatSync(path).isSymbolicLink())
    throw new Error("Observation source is not a regular file");
  return readFileSync(path, "utf8")
    .split("\n")
    .filter(Boolean)
    .flatMap((line) => {
      try {
        const value = JSON.parse(line);
        return value && typeof value === "object" ? [value] : [];
      } catch {
        return [];
      }
    });
};
export const journalRows = (root: string, scope: ObservationScope) =>
  rows(journalPath(root, scope));
export function appendObservation(
  root: string,
  scope: ObservationScope,
  row: Row,
  now = new Date().toISOString(),
) {
  const path = journalPath(root, scope);
  mkdirSync(directory(root), { recursive: true, mode: 0o700 });
  if (
    existsSync(path) &&
    (!lstatSync(path).isFile() || lstatSync(path).isSymbolicLink())
  )
    throw new Error("Observation journal is not a regular file");
  appendFileSync(
    path,
    `${JSON.stringify({ ...row, workOrder: scope.workOrder, phase: scope.phase, recordedAt: now })}\n`,
    { mode: 0o600 },
  );
}

// Names are recognized only when stated, never inferred from tone or meaning.
export function namedJudgmentUnits(text: string): string[] {
  return [
    ["never-guess", /\b(?:never guess|never-guess|no guessing|no-guessing)\b/i],
    [
      "correctness-over-sycophancy",
      /\b(?:correctness-over-sycophancy|accuracy over sycophancy)\b/i,
    ],
    ["anti-oscillation", /\banti-oscillation\b/i],
    [
      "fail-conservative-correction",
      /\b(?:fail-conservative-correction|over-literal|malicious compliance)\b/i,
    ],
  ]
    .filter(([, pattern]) => (pattern as RegExp).test(text))
    .map(([unit]) => unit as string);
}

export { correctionCounts } from "./correction-observation.mjs";

// Positive tool metadata projection: no prompts, results or native task IDs.
export function observeBackgroundTool(
  tool: string,
  input: Row,
  output: Row,
  at: string,
): Row | null {
  const task = output.task ?? output;
  const id =
    task.agentId ??
    task.agent_id ??
    task.task_id ??
    task.task_name ??
    input.task_id ??
    input.agent_id ??
    input.id;
  if (typeof id !== "string") return null;
  const dispatch = ["Agent", "Task", "spawn_agent"].includes(tool);
  if (
    dispatch &&
    !(
      input.run_in_background === true ||
      output.isAsync === true ||
      tool === "spawn_agent"
    )
  )
    return null;
  if (
    !dispatch &&
    !["TaskOutput", "TaskStop", "wait_agent", "close_agent"].includes(tool)
  )
    return null;
  const status = task.status;
  const state =
    output.is_error === true || output.error
      ? "unknown"
      : ["completed", "failed", "stopped", "running", "pending"].includes(
            status,
          )
        ? status
        : dispatch
          ? "dispatched"
          : "unknown";
  return {
    backgroundTask: {
      key: digest(id),
      state,
      ...(dispatch ? { dispatchedAt: at } : {}),
      observedAt: at,
    },
  };
}

export function observedFacts(
  root: string,
  scope: ObservationScope,
  now = new Date().toISOString(),
) {
  const journal = journalRows(root, scope);
  const tasks = new Map<string, Row>();
  for (const row of journal) {
    const task = row.backgroundTask;
    if (!task || typeof task.key !== "string") continue;
    tasks.set(task.key, { ...tasks.get(task.key), ...task });
  }
  const usageRows = rows(join(root, "docs/control/local/process/usage.jsonl"));
  const usage = usageRows
    .filter(
      (row) =>
        row.sessionKey === (scope.usageKey ?? scope.sessionKey) &&
        row.workOrder === scope.workOrder &&
        (!scope.startedAt || row.startedAt === scope.startedAt),
    )
    .at(-1);
  const gates = readGateChecks(root).filter(
    (row: Row) =>
      row.workOrder === scope.workOrder &&
      (!scope.startedAt || row.recordedAt >= scope.startedAt),
  );
  return {
    now,
    tasks: [...tasks.values()].map((task, index): Row => ({
      ...task,
      label: `task ${index + 1}`,
      elapsedMs: Number.isFinite(Date.parse(task.dispatchedAt))
        ? Date.parse(now) - Date.parse(task.dispatchedAt)
        : null,
    })),
    gates,
    usage: usage?.observation ?? null,
  };
}
export function renderObservedFacts(facts: ReturnType<typeof observedFacts>) {
  const value = (n: unknown, cause: string) =>
    typeof n === "number" && Number.isFinite(n)
      ? String(n)
      : `unknown (${cause})`;
  return [
    `Observed facts at ${facts.now} (session journal and gate rows):`,
    ...(facts.tasks.length
      ? facts.tasks.map(
          (task) =>
            `${task.label}: dispatched ${task.dispatchedAt ?? "unknown (dispatch-unavailable)"}; last observed state ${task.state}; elapsed since dispatch ${value(task.elapsedMs, "dispatch-unavailable")} ms; state observed ${task.observedAt}.`,
        )
      : ["Background tasks: unknown (no-session-task-observation)."]),
    ...(facts.gates.length
      ? facts.gates.map(
          (gate) =>
            `Gate ${gate.checkId}: ${value(gate.durationMs, "gate-duration-unavailable")} ms; recorded ${gate.recordedAt}.`,
        )
      : ["Gate durations: unknown (no-session-gate-row)."]),
    `Usage: ${["inputTokens", "cachedInputTokens", "cacheWriteInputTokens", "outputTokens", "reasoningOutputTokens", "totalTokens", "costUsd"].map((key) => `${key} ${value(facts.usage?.usage?.[key], "counter-unavailable")}`).join("; ")}; source ${facts.usage?.source ?? "unavailable"}; scope ${facts.usage?.scope ?? "unknown"}; cutoff ${facts.usage?.observedAt ?? "unknown (usage-unavailable)"}.`,
  ].join("\n");
}

function prose(text: string) {
  let fence = "";
  return text
    .split("\n")
    .map((line) => {
      const marker = /^\s*(`{3,}|~{3,})/.exec(line)?.[1];
      if (marker) {
        if (!fence) fence = marker;
        else if (marker[0] === fence[0] && marker.length >= fence.length)
          fence = "";
        return "";
      }
      if (fence || /^\s*>/.test(line)) return "";
      return line.replace(
        /`[^`]*`|"[^"\n]*"|“[^”\n]*”|(?<!\w)'[^'\n]*'(?!\w)|‘[^’\n]*’/g,
        "",
      );
    })
    .join("\n");
}
export function scanHedges(
  text: string,
  facts: ReturnType<typeof observedFacts>,
) {
  const clauses = prose(text)
    .replace(/,\s*(probably|I think)\s*(?=[.;!?\n]|$)/gi, " $1")
    .split(/(?<!\d)[.;!?]|[.;!?](?!\d)|\n|,(?!\d)/i);
  return clauses.flatMap((phrase) => {
    const markers = [
      ...phrase.matchAll(
        /\b(?:roughly|about|approximately|around|probably|I think|should be)\b|~/gi,
      ),
    ];
    return markers.flatMap((marker, index) => {
      const part = phrase.slice(
        index === 0 ? 0 : marker.index,
        markers[index + 1]?.index,
      );
      const afterMarker = part.slice(
        part.indexOf(marker[0]) + marker[0].length,
      );
      const number =
        /\b\d+(?:,\d{3})*(?:\.\d+)?(?::\d{2})?\s*(?:milliseconds?|ms|seconds?|secs?|minutes?|mins?|hours?|tokens?|USD|dollars?)?\b/i;
      const quantity =
        number.exec(afterMarker) ??
        /\b(?:a|one|two|three|four|five|six|seven|eight|nine|ten)?\s*(?:milliseconds?|seconds?|minutes?|hours?)\b/i.exec(
          afterMarker,
        ) ??
        number.exec(part);
      if (!quantity) return [];
      let observed: string | number = "unmeasured";
      let source = "quantity-unresolved";
      const duration =
        /\b(?:milliseconds?|ms|seconds?|secs?|minutes?|mins?|hours?)\b/i.test(
          quantity[0],
        );
      const clock = /\d{1,2}:\d{2}/.test(quantity[0]);
      const dispatchClaim = /\bdispatch(?:ed)?\b/i.test(part);
      if (
        (clock && dispatchClaim) ||
        (duration &&
          ((dispatchClaim && /\b(?:ago|since|elapsed)\b/i.test(part)) ||
            /^(?:roughly|about|approximately|around|probably|I think|should be|~)\s+(?:\d+(?:\.\d+)?|a|one|two|three|four|five|six|seven|eight|nine|ten)\s*(?:milliseconds?|ms|seconds?|secs?|minutes?|mins?|hours?)\s+ago\s*$/i.test(
              part.trim(),
            )))
      ) {
        const numbered = /\btask\s+(\d+)\b/i.exec(part);
        const task = numbered
          ? facts.tasks[Number(numbered[1]) - 1]
          : facts.tasks.length === 1
            ? facts.tasks[0]
            : undefined;
        if (task?.elapsedMs != null) {
          observed = clock
            ? task.dispatchedAt
            : `${task.elapsedMs} ms since ${task.dispatchedAt}`;
          source = "session-task-dispatch";
        }
      } else if (
        duration &&
        /\bgate\b/i.test(part) &&
        /\b(?:took|duration|ran|lasted)\b/i.test(part) &&
        !/\b(?:ago|since)\b/i.test(part)
      ) {
        const matching = facts.gates.filter((gate) =>
          part.includes(gate.checkId),
        );
        if (matching.length === 1 && Number.isFinite(matching[0]?.durationMs)) {
          observed = `${matching[0]!.durationMs} ms`;
          source = "gate-row";
        }
      } else if (
        /\b(?:current time|time now|clock|it is)\b/i.test(part) &&
        clock &&
        Number.isFinite(Date.parse(facts.now))
      ) {
        observed = facts.now;
        source = "boundary-clock";
      } else if (
        /\b(?:session|dispatch|usage)\b/i.test(part) &&
        /\b(?:cost|spent)\b/i.test(part) &&
        /\b(?:USD|dollars?)\b|\$/.test(part) &&
        Number.isFinite(facts.usage?.usage?.costUsd)
      ) {
        observed = `${facts.usage!.usage.costUsd} USD`;
        source = facts.usage!.source;
      } else if (/\btokens?\b/i.test(part)) {
        const key = /\bcache[- ]write\b/i.test(part)
          ? "cacheWriteInputTokens"
          : /\bcached\b/i.test(part)
            ? "cachedInputTokens"
            : /\breasoning\b/i.test(part)
              ? "reasoningOutputTokens"
              : /\binput\b/i.test(part)
                ? "inputTokens"
                : /\boutput\b/i.test(part)
                  ? "outputTokens"
                  : "totalTokens";
        if (Number.isFinite(facts.usage?.usage?.[key])) {
          observed = facts.usage!.usage[key];
          source = facts.usage!.source;
        }
      }
      return [
        {
          phrase: part.trim(),
          quantity: quantity[0].trim(),
          marker: marker[0],
          observed,
          source,
          units: namedJudgmentUnits(part),
        },
      ];
    });
  });
}

// Stream bounded records so early task launches survive a long session. Oversize
// rows are skipped rather than loading arbitrary tool output into memory.
export function transcriptMessages(path: string): Row[] {
  if (!lstatSync(path).isFile() || lstatSync(path).isSymbolicLink())
    throw new Error("Transcript is not a regular file");
  const fd = openSync(path, "r");
  try {
    const size = fstatSync(fd).size;
    const buffer = Buffer.alloc(65536);
    const result: Row[] = [];
    let position = 0,
      lineStart = 0,
      pending = Buffer.alloc(0),
      oversized = false;
    while (position < size) {
      const length = readSync(
        fd,
        buffer,
        0,
        Math.min(buffer.length, size - position),
        position,
      );
      if (!length) break;
      let from = 0;
      while (from < length) {
        const newline = buffer.indexOf(10, from);
        const end = newline >= 0 && newline < length ? newline : length;
        if (!oversized) {
          pending = Buffer.concat([pending, buffer.subarray(from, end)]);
          if (pending.length > 1024 * 1024) {
            pending = Buffer.alloc(0);
            oversized = true;
          }
        }
        if (end < length) {
          if (!oversized) {
            try {
              const row = JSON.parse(pending.toString("utf8"));
              if (row?.type === "response_item" || row?.message)
                result.push({ ...row, position: lineStart });
            } catch {
              /* Partial or malformed records establish no observation. */
            }
          }
          pending = Buffer.alloc(0);
          oversized = false;
          lineStart = position + end + 1;
        }
        from = end + 1;
      }
      position += length;
    }
    return result;
  } finally {
    closeSync(fd);
  }
}
const messageText = (content: unknown): string =>
  typeof content === "string"
    ? content
    : Array.isArray(content)
      ? content
          .filter((part) =>
            ["text", "output_text", "input_text"].includes(part?.type),
          )
          .map((part) => part.text ?? "")
          .join("\n")
      : "";

function transcriptTasks(
  root: string,
  scope: ObservationScope,
  transcript: Row[],
) {
  const calls = new Map<string, Row>();
  const seen = new Set(journalRows(root, scope).map((row) => row.eventId));
  const object = (value: unknown): Row => {
    try {
      const result = typeof value === "string" ? JSON.parse(value) : value;
      return result && typeof result === "object" ? (result as Row) : {};
    } catch {
      return {};
    }
  };
  for (const row of transcript) {
    if (scope.startedAt && row.timestamp < scope.startedAt) continue;
    const parts =
      row.type === "response_item" ? [row.payload] : row.message?.content;
    if (!Array.isArray(parts)) continue;
    for (const part of parts) {
      if (
        ["function_call", "custom_tool_call", "tool_use"].includes(part?.type)
      ) {
        const name = String(part.name).split(/[.:]/).at(-1)!;
        calls.set(part.call_id ?? part.id, {
          name,
          input: object(part.arguments ?? part.input),
          at: row.timestamp,
        });
      } else if (
        [
          "function_call_output",
          "custom_tool_call_output",
          "tool_result",
        ].includes(part?.type)
      ) {
        const id = part.call_id ?? part.tool_use_id;
        const call = calls.get(id);
        if (!call || !Number.isFinite(Date.parse(call.at))) continue;
        const output = object(part.output ?? part.content);
        const observation = observeBackgroundTool(
          call.name,
          call.input,
          output,
          row.timestamp,
        );
        if (observation?.backgroundTask.dispatchedAt)
          observation.backgroundTask.dispatchedAt = call.at;
        const eventId = `task:${digest(`${id}:${row.position}`)}`;
        if (observation && !seen.has(eventId))
          appendObservation(
            root,
            scope,
            { ...observation, eventId },
            row.timestamp,
          );
      }
    }
  }
}

export function scanMessage(
  root: string,
  scope: ObservationScope,
  text: string,
  identity: string,
  now: string,
) {
  const prior = new Set(journalRows(root, scope).map((row) => row.eventId));
  const facts = observedFacts(root, scope, now);
  for (const [index, hedge] of scanHedges(text, facts).entries()) {
    const eventId = `hedge:${digest(identity)}:${index}`;
    if (!prior.has(eventId))
      appendObservation(
        root,
        scope,
        {
          typedEvent: "HedgedQuantityObserved",
          eventId,
          ...hedge,
          observedAt: now,
        },
        now,
      );
  }
}
export function deliverHedgeAdvisories(root: string, scope: ObservationScope) {
  const journal = journalRows(root, scope);
  const delivered = new Set(
    journal.flatMap((row) => row.hedgeAdvisoriesDelivered ?? []),
  );
  const pending = journal.filter(
    (row) =>
      row.typedEvent === "HedgedQuantityObserved" &&
      !delivered.has(row.eventId),
  );
  if (!pending.length) return "";
  const text = pending
    .map(
      (row) =>
        `DotLn measurement advisory: hedged ${row.quantity}; observed ${row.observed} (${row.source}) at ${row.observedAt}. State the observed value or unknown in the next message. This advisory holds no turn.`,
    )
    .join("\n");
  appendObservation(root, scope, {
    hedgeAdvisoriesDelivered: pending.map((row) => row.eventId),
  });
  return text;
}

export function observeTypedCorrection(
  root: string,
  scope: ObservationScope,
  prompt: string,
  eventId?: string,
) {
  if (!prompt.startsWith("correction:")) return;
  const journal = journalRows(root, scope);
  const id =
    eventId ??
    `correction-prompt:${journal.filter((row) => row.typedEvent === "OperatorCorrectionReceived" && row.measurement !== false).length}`;
  if (!journal.some((row) => row.eventId === id))
    appendObservation(root, scope, {
      typedEvent: "OperatorCorrectionReceived",
      eventId: id,
      units: namedJudgmentUnits(prompt),
    });
}

/** All failures are informational. Stop never returns a blocking decision. */
export function observationBoundary(
  root: string,
  scope: ObservationScope,
  options: {
    transcriptPath?: string;
    stop?: boolean;
    reentry?: boolean;
    output?: string;
    now?: string;
    codex?: boolean;
  } = {},
) {
  try {
    const now = options.now ?? new Date().toISOString();
    // Capture facts before acknowledging delivery; a broken optional source must
    // not consume pending corrections without displaying them.
    let factsText: string;
    try {
      factsText = renderObservedFacts(observedFacts(root, scope, now));
    } catch {
      factsText = `Observed facts at ${now}: unknown (session-observation-unavailable).`;
    }
    const pending = options.stop ? "" : deliverHedgeAdvisories(root, scope);
    let scanCause = "";
    if (!options.reentry && (options.stop || options.codex)) {
      try {
        const path = sessionTranscript(root, {
          sessionKey: scope.usageKey ?? scope.sessionKey,
          ...(options.transcriptPath
            ? { transcriptPath: options.transcriptPath }
            : {}),
        });
        const transcript = transcriptMessages(path);
        if (options.codex) transcriptTasks(root, scope, transcript);
        const messages: Row[] = transcript.flatMap((row) => {
          const message =
            row.type === "response_item" ? row.payload : row.message;
          if (
            !message ||
            (scope.startedAt &&
              row.timestamp &&
              row.timestamp < scope.startedAt)
          )
            return [];
          return [{ ...row, message }];
        });
        if (options.codex) {
          const seen = new Set(
            journalRows(root, scope).map((row) => row.eventId),
          );
          for (const row of messages) {
            const text = messageText(row.message.content);
            const eventId = `correction:${digest(String(row.position))}`;
            if (
              row.message.role === "user" &&
              text.startsWith("correction:") &&
              !seen.has(eventId)
            )
              appendObservation(
                root,
                scope,
                {
                  typedEvent: "OperatorCorrectionReceived",
                  eventId,
                  units: namedJudgmentUnits(text),
                },
                row.timestamp ?? now,
              );
          }
        }
        const last = messages
          .filter(
            (row) =>
              row.message.role === "assistant" &&
              (!options.codex || row.message.channel === "final") &&
              messageText(row.message.content),
          )
          .at(-1);
        if (last)
          scanMessage(
            root,
            scope,
            messageText(last.message.content),
            String(last.message.id ?? last.uuid ?? last.position),
            now,
          );
        else
          scanCause =
            "Final-message scan: unknown (final-message-unavailable).";
      } catch {
        scanCause =
          "Final-message scan: unknown (session-transcript-unavailable).";
      }
    }
    try {
      if (options.output)
        scanMessage(
          root,
          scope,
          options.output,
          `output:${digest(options.output)}`,
          now,
        );
      factsText = renderObservedFacts(observedFacts(root, scope, now));
    } catch {
      scanCause =
        "Final-message scan: unknown (session-observation-unavailable).";
    }
    return [factsText, pending, scanCause].filter(Boolean).join("\n");
  } catch {
    return "Observed facts: unknown (session-observation-unavailable); advisory only, no turn held.";
  }
}

export function codexObservationScope(
  sessionId: string,
  workOrder: string | null,
  phase: string,
  root?: string,
): ObservationScope {
  const key = usageSessionKey(sessionId);
  const scope: ObservationScope = {
    sessionKey: key,
    usageKey: key,
    workOrder,
    phase,
  };
  if (!root) return scope;
  const states = existsSync(directory(root))
    ? readdirSync(directory(root))
        .filter((name) => /^[a-f0-9]{64}\.json$/.test(name))
        .flatMap((name) => {
          try {
            const path = join(directory(root), name);
            if (!lstatSync(path).isFile() || lstatSync(path).isSymbolicLink())
              return [];
            const state = JSON.parse(readFileSync(path, "utf8"));
            const statePhase =
              state.expectedEvent === "RepairCompleted"
                ? "repair"
                : ((
                    {
                      executor: "implementation",
                      verifier: "verification",
                      reviewer: "finalReview",
                    } as Row
                  )[state.role] ?? state.role);
            return state.usageSessionKey === key &&
              state.workOrder === workOrder &&
              statePhase === phase
              ? [state]
              : [];
          } catch {
            return [];
          }
        })
    : [];
  const startedAt = states
    .map((state) => state.startedAt)
    .filter((at) => Number.isFinite(Date.parse(at)))
    .sort()
    .at(-1);
  const previous = journalRows(root, scope)
    .filter((row) => row.observationDispatch)
    .at(-1);
  scope.startedAt =
    startedAt ??
    (previous?.workOrder === workOrder && previous?.phase === phase
      ? previous?.recordedAt
      : undefined) ??
    new Date().toISOString();
  if (!previous || previous.workOrder !== workOrder || previous.phase !== phase)
    appendObservation(
      root,
      scope,
      { observationDispatch: true },
      scope.startedAt,
    );
  return scope;
}
