import {
  appendFileSync,
  closeSync,
  existsSync,
  lstatSync,
  mkdirSync,
  openSync,
  readFileSync,
  readdirSync,
  readSync,
  realpathSync,
} from "node:fs";
import { createHash } from "node:crypto";
import { homedir } from "node:os";
import { basename, dirname, join, resolve } from "node:path";

/** @typedef {{inputTokens: number|null, cachedInputTokens: number|null, cacheWriteInputTokens: number|null, outputTokens: number|null, reasoningOutputTokens: number|null, totalTokens: number|null, costUsd: number|null}} Usage */
/** @param {unknown} value @returns {number|null} */
const count = (value) =>
  typeof value === "number" && Number.isFinite(value) && value >= 0
    ? value
    : null;
/** @param {unknown} value @returns {Record<string, any>} */
const object = (value) =>
  value && typeof value === "object" && !Array.isArray(value) ? value : {};
/** @param {unknown} value @param {boolean} claude @returns {Usage} */
function fields(value, claude = false) {
  const wire = object(value);
  const input = count(wire.input_tokens),
    output = count(wire.output_tokens);
  const cached = count(
    wire.cached_input_tokens ?? wire.cache_read_input_tokens,
  );
  const cacheWrite = count(
    wire.cache_write_input_tokens ?? wire.cache_creation_input_tokens,
  );
  return {
    inputTokens: input,
    cachedInputTokens: cached,
    cacheWriteInputTokens: cacheWrite,
    outputTokens: output,
    reasoningOutputTokens: count(wire.reasoning_output_tokens),
    totalTokens:
      count(wire.total_tokens) ??
      (input !== null && output !== null
        ? input + output + (claude ? (cached ?? 0) + (cacheWrite ?? 0) : 0)
        : null),
    costUsd: null,
  };
}
/** @param {Usage[]} values @returns {Usage} */
function sum(values) {
  const result = fields({});
  for (const key of /** @type {(keyof Usage)[]} */ (Object.keys(result))) {
    const numbers = values.map((value) => value[key]);
    result[key] =
      numbers.length && numbers.every((value) => value !== null)
        ? numbers.reduce((total, value) => (total ?? 0) + (value ?? 0), 0)
        : null;
  }
  return result;
}

/** Positive projection: no transcript text, identifiers, URLs, or paths leave
 * this reader. Cumulative counters are never mistaken for window occupancy.
 * @param {unknown[]} input @param {{since?: string, until?: string}} options
 */
export function usageObservation(input, options = {}) {
  const rows = input.map(object);
  const since = options.since ? Date.parse(options.since) : -Infinity;
  const until = options.until ? Date.parse(options.until) : Infinity;
  const inRange = /** @param {Record<string, any>} row */ (row) =>
    !row.timestamp ||
    (Date.parse(row.timestamp) >= since && Date.parse(row.timestamp) <= until);
  const calls = new Map();
  for (const row of rows.filter(inRange)) {
    const event = row.type === "response_item" ? object(row.payload) : row;
    if (
      ["function_call", "custom_tool_call"].includes(event.type) &&
      typeof event.name === "string"
    )
      calls.set(event.call_id ?? calls.size, event.name);
    for (const item of Array.isArray(row.message?.content)
      ? row.message.content
      : [])
      if (item.type === "tool_use" && typeof item.name === "string")
        calls.set(item.id ?? calls.size, item.name);
  }
  const toolNames = [...calls.values()];
  const opaqueCommands = toolNames.some((name) =>
    /(?:^|[._])exec$|node_repl|cua/i.test(name),
  );
  const activity = {
    stepCount: toolNames.length || null,
    commandsRun:
      toolNames.length && !opaqueCommands
        ? toolNames.filter((name) =>
            /(?:^|[._])(?:exec_command|Bash)$/.test(name),
          ).length
        : null,
    source: toolNames.length
      ? "transcript tool-call metadata; wrapped command count may be unavailable"
      : "unavailable",
  };
  const counters = rows.filter(
    (row) =>
      row.type === "event_msg" &&
      row.payload?.type === "token_count" &&
      row.payload?.info?.total_token_usage &&
      Date.parse(row.timestamp) <= until,
  );
  const last = counters.at(-1);
  if (last) {
    const baseline = counters
      .filter((row) => Date.parse(row.timestamp) < since)
      .at(-1);
    const start = rows.find((row) => row.type === "session_meta")?.timestamp;
    const exactScope =
      !options.since ||
      Boolean(baseline) ||
      Boolean(start && Date.parse(start) >= since);
    const total = fields(last.payload.info.total_token_usage);
    if (baseline) {
      const before = fields(baseline.payload.info.total_token_usage);
      for (const key of /** @type {(keyof Usage)[]} */ (Object.keys(total))) {
        const current = total[key],
          previous = before[key];
        total[key] =
          current !== null && previous !== null && current >= previous
            ? current - previous
            : null;
      }
    }
    return {
      activity,
      source: "codex-transcript-counter",
      scope: exactScope ? "dispatch" : "session-cumulative",
      observedAt: last.timestamp,
      usage: total,
      context: {
        capacityTokens: count(last.payload.info.model_context_window),
        lastRequestTokens: fields(last.payload.info.last_token_usage)
          .totalTokens,
        classification: "last reported request size, not live occupancy",
      },
    };
  }
  const results = rows.filter((row) => row.type === "result" && inRange(row));
  const result = results.at(-1);
  if (result?.usage) {
    const usage = fields(result.usage, true);
    usage.costUsd = count(result.total_cost_usd);
    return {
      activity,
      source: "claude-result-envelope",
      scope: "dispatch",
      observedAt: result.timestamp ?? null,
      usage,
      context: null,
    };
  }
  const turns = rows.filter(
    (row) => row.type === "turn.completed" && row.usage && inRange(row),
  );
  if (turns.length)
    return {
      activity,
      source: "codex-result-envelope",
      scope: "dispatch",
      observedAt: turns.at(-1)?.timestamp ?? null,
      usage: sum(turns.map((row) => fields(row.usage))),
      context: null,
    };
  const messages = new Map();
  for (const row of rows)
    if (
      row.type === "assistant" &&
      typeof row.message?.id === "string" &&
      row.message.usage &&
      inRange(row)
    )
      messages.set(row.message.id, row);
  if (messages.size)
    return {
      activity,
      source: "claude-transcript-message-usage",
      scope: "dispatch",
      observedAt: [...messages.values()].at(-1)?.timestamp ?? null,
      usage: sum(
        [...messages.values()].map((row) => fields(row.message.usage, true)),
      ),
      context: null,
    };
  return {
    activity,
    source: "unavailable",
    scope: "unavailable",
    observedAt: null,
    usage: fields({}),
    context: null,
  };
}

/** @param {string} source */
export function decodeUsageSource(source) {
  try {
    return [JSON.parse(source)];
  } catch {
    /* JSONL is the other observed wire shape. */
  }
  return source
    .split("\n")
    .filter(Boolean)
    .flatMap((line) => {
      try {
        return [JSON.parse(line)];
      } catch {
        return [];
      }
    });
}
/** @param {string} path @param {{since?: string, until?: string}} options */
export function transcriptUsage(path, options = {}) {
  if (
    !existsSync(path) ||
    !lstatSync(path).isFile() ||
    lstatSync(path).isSymbolicLink()
  )
    throw new Error("Usage source must be a regular transcript file");
  return usageObservation(
    decodeUsageSource(readFileSync(path, "utf8")),
    options,
  );
}

/** Only a one-way identity stays in local observations; never publish a
 * transcript path, session identifier, message, or environment value.
 * @param {string} value
 */
export const usageSessionKey = (value) =>
  createHash("sha256").update(value).digest("hex");

/** Local record reference; not a transcript/session identifier. @param {unknown} row */
export const usageRecordIdentity = (row) =>
  createHash("sha256").update(JSON.stringify(row)).digest("hex");

/** @param {ReturnType<typeof usageObservation>} observation @param {string} [since] */
export function requireMeasuredUsage(observation, since) {
  if (
    !/^(codex|claude)-(transcript|result)-/.test(observation.source) ||
    ![
      observation.usage.inputTokens,
      observation.usage.outputTokens,
      observation.usage.totalTokens,
    ].every(
      (value) => value !== null && Number.isSafeInteger(value) && value >= 0,
    ) ||
    (since &&
      (!Number.isFinite(Date.parse(since)) ||
        !observation.observedAt ||
        !Number.isFinite(Date.parse(observation.observedAt)) ||
        Date.parse(observation.observedAt) < Date.parse(since)))
  )
    throw new Error(
      "Token measurement required: read the current Codex or Claude session counters and repair collection before handoff",
    );
  return observation;
}

/** @param {string} path */
function transcriptHeader(path) {
  const descriptor = openSync(path, "r");
  const buffer = Buffer.alloc(65536);
  try {
    const length = readSync(descriptor, buffer, 0, buffer.length, 0);
    return decodeUsageSource(buffer.subarray(0, length).toString("utf8"));
  } finally {
    closeSync(descriptor);
  }
}

/** @param {string} directory @param {number} depth @returns {string[]} */
function transcriptFiles(directory, depth) {
  if (!existsSync(directory)) return [];
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isFile() && entry.name.endsWith(".jsonl")) return [path];
    return entry.isDirectory() && depth > 0
      ? transcriptFiles(path, depth - 1)
      : [];
  });
}

/** Select the actual session, never every transcript sharing a worktree.
 * Hook inputs supply Claude identity; the explicit Codex adapter uses the
 * running thread's environment. Directory overrides support isolated fixtures.
 * @param {string} root
 * @param {{sessionKey?: string, transcriptPath?: string, since?: string, until?: string, codexDirectory?: string, claudeDirectory?: string, env?: NodeJS.ProcessEnv}} [options]
 */
export function sessionTranscript(root, options = {}) {
  const env = options.env ?? process.env;
  const key =
    options.sessionKey ??
    (env.CODEX_THREAD_ID ? usageSessionKey(env.CODEX_THREAD_ID) : undefined);
  if (!key || !/^[a-f0-9]{64}$/.test(key))
    throw new Error(
      "Token measurement requires the current harness session identity",
    );
  if (options.since && !Number.isFinite(Date.parse(options.since)))
    throw new Error("Token measurement requires a valid dispatch start time");
  const matches = /** @param {string} path */ (path) => {
    if (!lstatSync(path).isFile() || lstatSync(path).isSymbolicLink())
      return false;
    const name = basename(path, ".jsonl");
    if (
      usageSessionKey(name) !== key &&
      usageSessionKey(name.slice(-36)) !== key
    )
      return false;
    const rows = transcriptHeader(path);
    const codex = rows.find((row) => row.type === "session_meta");
    const id =
      codex?.payload?.id ??
      rows.find((row) => typeof row.sessionId === "string")?.sessionId ??
      basename(path, ".jsonl");
    const cwd =
      codex?.payload?.cwd ??
      rows.find((row) => typeof row.cwd === "string")?.cwd;
    return (
      typeof id === "string" &&
      usageSessionKey(id) === key &&
      typeof cwd === "string" &&
      existsSync(cwd) &&
      realpathSync(cwd) === realpathSync(root)
    );
  };
  const files = options.transcriptPath
    ? [resolve(options.transcriptPath)]
    : [
        ...transcriptFiles(
          options.codexDirectory ??
            join(env.CODEX_HOME ?? join(homedir(), ".codex"), "sessions"),
          3,
        ),
        ...transcriptFiles(
          options.claudeDirectory ??
            join(
              env.CLAUDE_CONFIG_DIR ?? join(homedir(), ".claude"),
              "projects",
              resolve(root).replace(/[^a-zA-Z0-9]/g, "-"),
            ),
          0,
        ),
      ];
  const selected = files.filter((path) => existsSync(path) && matches(path));
  const path = selected[0];
  if (selected.length !== 1 || !path)
    throw new Error(
      `Token measurement requires exactly one transcript for the current session and worktree; found ${selected.length}`,
    );
  return path;
}

/** Usage freshness is independent of the session's model/effort metadata.
 * @param {string} root
 * @param {Parameters<typeof sessionTranscript>[1]} [options]
 */
export function collectSessionUsage(root, options = {}) {
  return requireMeasuredUsage(
    transcriptUsage(sessionTranscript(root, options), options),
    options.since,
  );
}

/** Current Codex harness metadata only: never transcript text, IDs or paths.
 * Missing readback is informational and cannot refuse a workflow action.
 * @param {string} root
 * @param {Parameters<typeof sessionTranscript>[1]} [options]
 */
export function currentCodexSession(root, options = {}) {
  try {
    const rows = decodeUsageSource(
      readFileSync(sessionTranscript(root, options), "utf8"),
    );
    const meta = rows.find((row) => row.type === "session_meta")?.payload;
    const turn = rows.filter((row) => row.type === "turn_context").at(-1);
    const model =
      typeof turn?.payload?.model === "string" &&
      /^[a-zA-Z0-9][a-zA-Z0-9._:-]{0,99}$/.test(turn.payload.model)
        ? turn.payload.model
        : null;
    const effort = [
      "none",
      "minimal",
      "low",
      "medium",
      "high",
      "xhigh",
      "max",
      "ultra",
      "ultra code",
    ].includes(turn?.payload?.effort)
      ? turn.payload.effort
      : null;
    const version =
      typeof meta?.cli_version === "string" &&
      /^\d+\.\d+\.\d+(?:[-+][a-zA-Z0-9.-]+)?$/.test(meta.cli_version)
        ? meta.cli_version
        : null;
    if (model === null && effort === null && version === null)
      return {
        available: false,
        source: "unavailable",
        reason: "Current Codex session metadata is incomplete",
      };
    return {
      available: true,
      harness: "codex-cli",
      harnessVersion: version,
      model,
      effort,
      source: "codex-session-readback",
      observedAt:
        typeof turn?.timestamp === "string" &&
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z$/.test(
          turn.timestamp,
        ) &&
        Number.isFinite(Date.parse(turn.timestamp))
          ? turn.timestamp
          : null,
    };
  } catch {
    return {
      available: false,
      source: "unavailable",
      reason: "Current Codex session metadata could not be read",
    };
  }
}

/** The exact command a session runs to read back its own counters (WO-140).
 * @param {string} sessionId
 */
export const usageReadbackCommand = (sessionId) =>
  `node scripts/harness.mjs usage ${/^[a-zA-Z0-9][a-zA-Z0-9._-]{0,127}$/.test(sessionId) ? sessionId : `'${sessionId.replaceAll("'", `'\\''`)}'`}`;
/** @param {string} sessionId */
export const usageReadbackLine = (sessionId) =>
  `DotLn session: ${sessionId}. Usage readback: ${usageReadbackCommand(sessionId)}`;
/** @param {ReturnType<typeof currentCodexSession>} session */
export function renderCodexSession(session) {
  if (!session.available)
    return `Current Codex session: ${session.reason}; no default substituted.`;
  const mode = ["ultra", "ultra code"].includes(session.effort ?? "")
    ? " (xhigh + workflows)"
    : "";
  return `Current Codex session: ${session.model ?? "unknown"}; effort ${session.effort ?? "unknown"}${mode}; CLI ${session.harnessVersion ?? "unknown"}; source ${session.source}.`;
}
/** @param {string} root @param {{workOrder: string|null, role: string, dispatch?: string, observation: ReturnType<typeof usageObservation>, startedAt?: string, durationMs?: number, ordinal?: number, sessionKey?: string, supersedes?: string[]}} row */
export function recordUsageObservation(root, row) {
  // Missing counters are an honest observation; callers can still require a
  // measured value explicitly when a test or comparison needs one.
  if (row.observation.source !== "unavailable")
    requireMeasuredUsage(row.observation);
  const planning =
    row.workOrder === null &&
    ["planner", "refuter"].includes(row.role) &&
    typeof row.dispatch === "string" &&
    /^[a-z0-9][a-z0-9-]{0,100}$/.test(row.dispatch);
  if (
    !(
      (typeof row.workOrder === "string" && /^WO-\d{3}$/.test(row.workOrder)) ||
      planning
    ) ||
    ![
      "executor",
      "verifier",
      "reviewer",
      "release-close",
      "planner",
      "refuter",
    ].includes(row.role)
  )
    throw new Error(
      "Usage attribution requires a work order or named planning pass and dispatch kind",
    );
  const path = join(root, "docs/control/local/process/usage.jsonl");
  if (row.supersedes) {
    const previous = existsSync(path)
      ? readFileSync(path, "utf8")
          .trim()
          .split("\n")
          .filter(Boolean)
          .map((line) => JSON.parse(line))
      : [];
    const known = new Map(
      previous.map((entry) => [usageRecordIdentity(entry), entry]),
    );
    if (
      !row.sessionKey ||
      !row.startedAt ||
      !row.supersedes.length ||
      new Set(row.supersedes).size !== row.supersedes.length ||
      row.supersedes.some((ref) => {
        const old = known.get(ref);
        return (
          !old ||
          old.workOrder !== row.workOrder ||
          old.role !== row.role ||
          old.observation.source !== row.observation.source ||
          !Number.isFinite(Date.parse(old.startedAt)) ||
          !Number.isFinite(Date.parse(old.observation.observedAt)) ||
          !(Date.parse(row.startedAt ?? "") <= Date.parse(old.startedAt)) ||
          !(
            Date.parse(row.observation.observedAt ?? "") >=
            Date.parse(old.observation.observedAt)
          ) ||
          row.observation.usage.totalTokens === null ||
          !Number.isSafeInteger(old.observation.usage.totalTokens) ||
          row.observation.usage.totalTokens < old.observation.usage.totalTokens
        );
      })
    )
      throw new Error(
        "Usage reconciliation requires known same-role observations inside the measured replacement window",
      );
  }
  mkdirSync(dirname(path), { recursive: true });
  appendFileSync(
    path,
    JSON.stringify({
      workOrder: row.workOrder,
      role: row.role,
      ...(row.dispatch ? { dispatch: row.dispatch } : {}),
      ...(row.startedAt ? { startedAt: row.startedAt } : {}),
      ...(row.durationMs === undefined ? {} : { durationMs: row.durationMs }),
      ...(row.ordinal === undefined ? {} : { ordinal: row.ordinal }),
      ...(row.sessionKey ? { sessionKey: row.sessionKey } : {}),
      ...(row.supersedes ? { supersedes: row.supersedes } : {}),
      observation: row.observation,
      recordedAt: new Date().toISOString(),
    }) + "\n",
    { mode: 0o600 },
  );
}
