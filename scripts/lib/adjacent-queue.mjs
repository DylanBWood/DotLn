import {
  appendFileSync,
  lstatSync,
  mkdirSync,
  readFileSync,
  realpathSync,
  rmdirSync,
} from "node:fs";
import { join } from "node:path";

export const ADJACENT_QUEUE = "docs/control/local/adjacent-work.jsonl";
const requireQueue = (condition, reason) => {
  if (!condition) throw new Error(`adjacent queue: ${reason}`);
};
const exact = (value, keys) =>
  value &&
  typeof value === "object" &&
  !Array.isArray(value) &&
  Object.keys(value).sort().join(",") === [...keys].sort().join(",");
const text = (value) =>
  typeof value === "string" &&
  Boolean(value.trim()) &&
  value.length <= 4000 &&
  !/[\u0000-\u001f\u007f]/u.test(value);
const strings = (values) =>
  Array.isArray(values) &&
  values.length > 0 &&
  values.every(text) &&
  new Set(values).size === values.length;
const specKeys = ["summary", "cause", "fix", "paths", "checks", "priority"];
const validSpec = (spec) =>
  exact(spec, specKeys) &&
  [spec.summary, spec.cause, spec.fix].every(text) &&
  strings(spec.paths) &&
  spec.paths.every(
    (path) =>
      !path.startsWith("/") &&
      !path.includes("\\") &&
      path.split("/").every((part) => part && part !== "." && part !== ".."),
  ) &&
  strings(spec.checks) &&
  Number.isSafeInteger(spec.priority) &&
  spec.priority >= 0;
const selected = (state, action) => {
  const item = state.items.find((entry) => entry.id === action.itemId);
  requireQueue(
    item && item.revision === action.itemRevision,
    "missing item or stale item revision",
  );
  return item;
};
export const nextAdjacentItem = (state) =>
  state.items
    .filter((item) => item.status === "queued")
    .sort(
      (a, b) => a.spec.priority - b.spec.priority || a.ordinal - b.ordinal,
    )[0] ?? null;

/** Operational replay; reported chat and check results are not host observations. */
export function foldAdjacentQueue(events, workOrderId) {
  requireQueue(/^WO-\d{3}$/u.test(workOrderId), "work-order identity");
  const state = { workOrderId, revision: 0, items: [], checkIn: null };
  for (const event of events) {
    requireQueue(
      exact(event, [
        "schemaVersion",
        "seq",
        "workOrderId",
        "at",
        "actor",
        "action",
      ]) &&
        event.schemaVersion === 1 &&
        event.seq === state.revision + 1 &&
        event.workOrderId === workOrderId &&
        ["executor", "operator"].includes(event.actor) &&
        typeof event.at === "string" &&
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/u.test(event.at) &&
        Number.isFinite(Date.parse(event.at)),
      "event shape, sequence, actor or work-order mismatch",
    );
    const a = event.action;
    requireQueue(a && typeof a === "object", "action shape");
    switch (a.kind) {
      case "queue": {
        requireQueue(
          exact(a, ["kind", "item"]) && validSpec(a.item),
          "diagnosed cause, concrete fix, paths, checks and priority required",
        );
        const ordinal = state.items.length + 1;
        state.items.push({
          id: `adjacent-${String(ordinal).padStart(4, "0")}`,
          ordinal,
          revision: 1,
          spec: structuredClone(a.item),
          status: "queued",
          announcement: null,
          directedRevision: null,
          disposition: null,
          results: [],
        });
        break;
      }
      case "revise": {
        requireQueue(
          exact(a, ["kind", "itemId", "itemRevision", "changes", "reason"]) &&
            text(a.reason) &&
            a.changes &&
            typeof a.changes === "object" &&
            !Array.isArray(a.changes) &&
            Object.keys(a.changes).length > 0 &&
            Object.keys(a.changes).every((key) => specKeys.includes(key)),
          "revision shape",
        );
        const item = selected(state, a);
        requireQueue(
          item.status !== "completed",
          "completed item requires a new candidate",
        );
        const spec = { ...item.spec, ...a.changes };
        requireQueue(validSpec(spec), "revised scope is incomplete");
        Object.assign(item, {
          spec,
          revision: item.revision + 1,
          status: "queued",
          announcement: null,
          directedRevision: null,
          disposition: null,
          results: [],
        });
        break;
      }
      case "announce": {
        requireQueue(
          exact(a, ["kind", "itemId", "itemRevision", "level", "statement"]) &&
            ["observation", "recommendation", "intent"].includes(a.level) &&
            text(a.statement) &&
            (a.level !== "intent" || a.statement.startsWith("I intend to ")),
          "announcement shape or intent wording",
        );
        const item = selected(state, a);
        requireQueue(
          item.status === "queued",
          "only a queued item can be announced",
        );
        item.announcement = {
          revision: item.revision,
          level: a.level,
          statement: a.statement,
          source: "actor-attested",
        };
        break;
      }
      case "dispose": {
        requireQueue(
          exact(a, [
            "kind",
            "itemId",
            "itemRevision",
            "status",
            "reason",
            "target",
          ]) &&
            ["vetoed", "known-issue", "deferred"].includes(a.status) &&
            text(a.reason) &&
            (a.status === "deferred" ? text(a.target) : a.target === null) &&
            (a.status !== "vetoed" || event.actor === "operator"),
          "disposition shape or operator veto attribution",
        );
        const item = selected(state, a);
        requireQueue(
          item.status !== "completed",
          "cannot erase completed work",
        );
        item.status = a.status;
        item.disposition = {
          reason: a.reason,
          target: a.target,
          actor: event.actor,
        };
        break;
      }
      case "direct": {
        requireQueue(
          exact(a, ["kind", "itemId", "itemRevision", "reason"]) &&
            event.actor === "operator" &&
            text(a.reason),
          "operator direction attribution required",
        );
        const item = selected(state, a);
        requireQueue(
          item.status === "queued",
          "direction applies to a queued item",
        );
        item.directedRevision = item.revision;
        break;
      }
      case "check-in":
        requireQueue(
          exact(a, ["kind", "channel", "observation"]) &&
            ["async-input", "message-boundary", "unavailable"].includes(
              a.channel,
            ) &&
            text(a.observation),
          "check-in channel and observation required",
        );
        state.checkIn = {
          revision: event.seq,
          channel: a.channel,
          observation: a.observation,
          source: "actor-attested",
        };
        break;
      case "start": {
        requireQueue(
          exact(a, ["kind", "itemId", "itemRevision"]),
          "start shape",
        );
        const item = selected(state, a);
        requireQueue(
          !state.items.some((entry) => entry.status === "running"),
          "one item is already running",
        );
        requireQueue(
          nextAdjacentItem(state)?.id === item.id,
          "start the next queued priority",
        );
        requireQueue(
          item.announcement?.revision === item.revision &&
            (item.announcement.level === "intent" ||
              item.directedRevision === item.revision),
          "current intent announcement or operator-directed recommendation required",
        );
        requireQueue(
          state.checkIn?.revision === state.revision &&
            state.checkIn.channel !== "unavailable",
          "fresh operator-message check-in required after the last queue change",
        );
        item.status = "running";
        break;
      }
      case "complete": {
        requireQueue(
          exact(a, ["kind", "itemId", "itemRevision", "results"]) &&
            Array.isArray(a.results) &&
            a.results.every(
              (result) =>
                exact(result, ["command", "exitCode", "evidenceRef"]) &&
                text(result.command) &&
                result.exitCode === 0 &&
                text(result.evidenceRef),
            ),
          "passing executed results and evidence references required",
        );
        const item = selected(state, a);
        requireQueue(
          item.status === "running",
          "only the running item can complete",
        );
        const commands = a.results.map(({ command }) => command);
        requireQueue(
          new Set(commands).size === commands.length &&
            item.spec.checks.every((command) => commands.includes(command)),
          "required checks are incomplete",
        );
        item.status = "completed";
        item.results = structuredClone(a.results);
        break;
      }
      default:
        throw new Error("adjacent queue: unknown action");
    }
    state.revision = event.seq;
  }
  return state;
}

const stat = (path) => {
  try {
    return lstatSync(path);
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw error;
  }
};
const directory = (root, create) => {
  let path = realpathSync(root);
  for (const part of ["docs", "control", "local"]) {
    path = join(path, part);
    if (!stat(path) && create) mkdirSync(path);
    const info = stat(path);
    requireQueue(
      !info || (info.isDirectory() && !info.isSymbolicLink()),
      "queue directory must not be a symlink",
    );
  }
  return path;
};
const readEvents = (root) => {
  directory(root, false);
  const path = join(root, ADJACENT_QUEUE);
  const info = stat(path);
  if (!info) return [];
  requireQueue(
    info.isFile() && !info.isSymbolicLink(),
    "queue must be a regular file",
  );
  const source = readFileSync(path, "utf8");
  requireQueue(
    !source || source.endsWith("\n"),
    "incomplete queue tail; preserve and inspect it",
  );
  return source
    ? source
        .slice(0, -1)
        .split("\n")
        .map((line) => JSON.parse(line))
    : [];
};
export const readAdjacentQueue = (root, workOrderId) =>
  foldAdjacentQueue(readEvents(root), workOrderId);

export function applyAdjacentCommand(
  root,
  workOrderId,
  command,
  at = new Date().toISOString(),
) {
  requireQueue(
    exact(command, ["expectedRevision", "actor", "action"]),
    "command shape",
  );
  const local = directory(root, true);
  const lock = join(local, "adjacent-work.lock");
  try {
    mkdirSync(lock);
  } catch {
    throw new Error(
      "adjacent queue: writer active; inspect an interrupted writer before retrying",
    );
  }
  try {
    const events = readEvents(root);
    const state = foldAdjacentQueue(events, workOrderId);
    requireQueue(
      command.expectedRevision === state.revision,
      "stale queue revision; reread operator steering",
    );
    const event = {
      schemaVersion: 1,
      seq: state.revision + 1,
      workOrderId,
      at,
      actor: command.actor,
      action: command.action,
    };
    const next = foldAdjacentQueue([...events, event], workOrderId);
    appendFileSync(join(root, ADJACENT_QUEUE), JSON.stringify(event) + "\n", {
      mode: 0o600,
    });
    return next;
  } finally {
    rmdirSync(lock);
  }
}
