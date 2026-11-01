import {
  closeSync,
  existsSync,
  lstatSync,
  openSync,
  readFileSync,
  readSync,
  readdirSync,
} from "node:fs";
import { homedir } from "node:os";
import { basename, isAbsolute, join, resolve } from "node:path";
import {
  decodeUsageSource,
  requireMeasuredUsage,
  transcriptUsage,
  usageObservation,
  usageSessionKey,
} from "../../packages/skeleton/dist/src/usage-observation.mjs";

// A path this reader cannot inspect is not a file it can read.
const regular = (path) => {
  try {
    const info = lstatSync(path, { throwIfNoEntry: false });
    return Boolean(info?.isFile() && !info.isSymbolicLink());
  } catch {
    return false;
  }
};
const object = (value) =>
  value && typeof value === "object" && !Array.isArray(value) ? value : {};

// The opening rows name a transcript's session and the directory it ran in.
const header = (path) => {
  const descriptor = openSync(path, "r");
  const buffer = Buffer.alloc(65536);
  try {
    const length = readSync(descriptor, buffer, 0, buffer.length, 0);
    return decodeUsageSource(buffer.subarray(0, length).toString("utf8"));
  } finally {
    closeSync(descriptor);
  }
};
// A directory this reader cannot list adds no candidates; it never stops the
// readback.
const jsonlFiles = (directory, depth) => {
  let entries;
  try {
    entries = readdirSync(directory, { withFileTypes: true });
  } catch {
    return [];
  }
  return entries.flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isFile() && entry.name.endsWith(".jsonl")) return [path];
    return entry.isDirectory() && depth > 0 ? jsonlFiles(path, depth - 1) : [];
  });
};

/** The host transcript of a session that ran in a checkout release close has
 * since removed. The checkout's path is the one the lane recorded, compared as
 * recorded because it no longer exists, and the transcript must carry the
 * usage key the session's state recorded. Claude keeps transcripts under a
 * directory named for that path, Codex under its sessions tree and Copilot
 * under the session's own directory.
 * @param {string} sessionId @param {string} key @param {string} worktree
 * @param {NodeJS.ProcessEnv} env */
function retainedTranscript(sessionId, key, worktree, env) {
  const named = (path) => {
    const name = basename(path, ".jsonl");
    return (
      name === "events" ||
      usageSessionKey(name) === key ||
      usageSessionKey(name.slice(-36)) === key
    );
  };
  const candidates = [
    ...jsonlFiles(
      join(
        env.CLAUDE_CONFIG_DIR ?? join(homedir(), ".claude"),
        "projects",
        resolve(worktree).replace(/[^a-zA-Z0-9]/g, "-"),
      ),
      0,
    ),
    ...jsonlFiles(
      join(env.CODEX_HOME ?? join(homedir(), ".codex"), "sessions"),
      3,
    ),
    ...(usageSessionKey(sessionId) === key &&
    /^[a-zA-Z0-9][a-zA-Z0-9._-]{0,127}$/.test(sessionId)
      ? [
          join(
            env.COPILOT_HOME ?? join(homedir(), ".copilot"),
            "session-state",
            sessionId,
            "events.jsonl",
          ),
        ]
      : []),
  ];
  // A candidate this reader cannot inspect, from its metadata to its opening
  // rows, is skipped; it never stops the readback.
  const inspectable = (path) => {
    try {
      return regular(path) && named(path) ? header(path) : null;
    } catch {
      return null;
    }
  };
  const matches = candidates.filter((path) => {
    const rows = inspectable(path);
    if (!rows) return false;
    const copilot = object(
      rows.find((row) => row?.type === "session.start")?.data,
    );
    const codex = object(
      rows.find((row) => row?.type === "session_meta")?.payload,
    );
    const id =
      copilot.sessionId ??
      codex.id ??
      rows.find((row) => typeof row?.sessionId === "string")?.sessionId;
    const cwd =
      object(copilot.context).cwd ??
      codex.cwd ??
      rows.find((row) => typeof row?.cwd === "string")?.cwd;
    return (
      typeof id === "string" &&
      usageSessionKey(id) === key &&
      typeof cwd === "string" &&
      resolve(cwd) === resolve(worktree)
    );
  });
  return matches.length === 1 ? matches[0] : null;
}

/** A closed order's session after its worktree is gone. Release close moved
 * the session's journal and state into the order's retained lane, an
 * `<order>/harness/` directory under the given retained directory, and
 * appended the worktree it moved them from to the lane's `sources.jsonl`; the
 * host keeps the transcript under that worktree's path. Returns null when no
 * lane holds the session, refuses a session found in more than one lane, and
 * records nothing: a closed dispatch's usage row was written while it ran.
 * @param {string} retained @param {string} sessionId
 * @param {{env?: NodeJS.ProcessEnv}} [options] */
export function readRetainedSession(retained, sessionId, options = {}) {
  const env = options.env ?? process.env;
  const key = usageSessionKey(sessionId);
  const orders = existsSync(retained)
    ? readdirSync(retained)
        .sort()
        .filter(
          (order) =>
            /^WO-\d{3}$/.test(order) &&
            regular(join(retained, order, "harness", `${key}.json`)),
        )
    : [];
  const order = orders[0];
  if (order === undefined) return null;
  if (orders.length > 1)
    throw new Error(
      `Session state is retained in ${orders.length} lanes (${orders.join(", ")}); its lane is ambiguous`,
    );
  const directory = join(retained, order, "harness");
  const state = object(
    JSON.parse(readFileSync(join(directory, `${key}.json`), "utf8")),
  );
  const sources = join(directory, "sources.jsonl");
  const worktrees = [
    ...new Set(
      (regular(sources) ? readFileSync(sources, "utf8").split("\n") : [])
        .filter(Boolean)
        .map((line) => {
          try {
            return object(JSON.parse(line)).worktree;
          } catch {
            return null;
          }
        })
        .filter((path) => typeof path === "string" && isAbsolute(path)),
    ),
  ];
  const startedAt =
    typeof state.startedAt === "string" ? state.startedAt : null;
  // The state keeps the key its counters were measured under, which differs
  // from the requested one when a named session ran inside a Codex thread.
  const usageKey =
    typeof state.usageSessionKey === "string" &&
    /^[a-f0-9]{64}$/.test(state.usageSessionKey)
      ? state.usageSessionKey
      : key;
  let observation = null;
  let cause = worktrees.length
    ? "retained-session-transcript-unavailable"
    : "retained-session-source-unrecorded";
  if (startedAt)
    for (const worktree of worktrees) {
      const transcript = retainedTranscript(sessionId, usageKey, worktree, env);
      if (!transcript) continue;
      cause = "retained-session-counters-unavailable";
      let measured;
      try {
        measured = transcriptUsage(transcript, { since: startedAt });
        observation = requireMeasuredUsage(measured, startedAt);
      } catch {
        // Credits are measured apart from tokens; they survive incomplete
        // token counters, as the live readback keeps them.
        if (measured && "aiCredits" in measured && measured.aiCredits !== null)
          observation = {
            ...measured,
            source: "unavailable",
            scope: "unknown",
            observedAt: null,
            usage: usageObservation([]).usage,
            context: null,
            cause: "session-token-counters-unavailable",
          };
      }
      break;
    }
  return {
    order,
    directory,
    role: typeof state.role === "string" ? state.role : null,
    workOrder: typeof state.workOrder === "string" ? state.workOrder : null,
    startedAt,
    observation: observation ?? {
      ...usageObservation([]),
      observedAt: new Date().toISOString(),
      scope: "dispatch",
      cause,
    },
  };
}
