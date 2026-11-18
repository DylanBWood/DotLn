// What a stopped drive tells its operator: one account, read from the drive's
// own record, of what ended it, what the worker left and what to do next.
// Everything printed is a count, a word of a fixed vocabulary or a command's
// shape, judged again as it is printed so that an older record's word kept
// outside its place is masked. No operand of a command, no reason a host
// printed and none of a worker's output is printed, so a router may read it
// and say it.
import { relative } from "node:path";
import {
  commandFailed,
  judgedShape,
  refusalWithReason,
} from "./drive-diagnostics.mjs";
import { lifecycleRoutes, readDriveRecord } from "./drive-route.mjs";
import { formatDuration } from "./duration.mjs";
import { spawnGit } from "./git.mjs";
import { resolveOrderWorktrees } from "./order-worktrees.mjs";

/** A duration as the operator reads one: hours and minutes, by the kit's
 * own helper. */
export const hoursMinutes = (ms) => formatDuration(Math.max(0, ms));
// The same for a time that passed, where less than a minute says so.
const elapsed = (ms) => (ms < 60000 ? "less than a minute" : hoursMinutes(ms));
const plural = (count, noun) => `${count} ${noun}${count === 1 ? "" : "s"}`;
const minuteOf = (iso) => {
  const at = new Date(iso);
  return Number.isNaN(at.getTime())
    ? "an unrecorded time"
    : `${at.toISOString().slice(0, 16).replace("T", " ")} UTC`;
};

/** The stops whose result carries no account: the operator's merge, a
 * release, and the end a live fixture declares for itself. */
const EXPECTED_STOPS = new Set([
  "released",
  "awaiting-merge",
  "fixture-endpoint",
]);
export const stopNeedsAccount = (stop) =>
  Boolean(stop?.reason) && !EXPECTED_STOPS.has(stop.reason);

// The host's word for the component that decided a denial, in plain words.
const DECIDED_BY = {
  rule: "a permission rule in the host's settings",
  mode: "the session's permission mode",
  classifier: "the host's automatic review",
  asyncAgent: "the host, for a background agent it cannot ask",
  unknown: "a component the host did not name",
};
const CAUSES = {
  "native-launcher-refused":
    "the host did not admit the driver's own launch command",
  "native-launcher-failed": "the driver's own launch command failed",
  "drive-deadline-exhausted": "the drive's deadline elapsed",
  "owner-cancelled": "the router that owned the drive ended or cancelled it",
  "launch-failed": "the host's program could not be started",
  "cli-argument-conflict": "the host's program rejected its launch arguments",
  "supervisor-ended-before-worker":
    "the drive's supervisor ended before its worker did",
  "native-provider-safeguard": "the provider's safeguard refused the session",
  "native-proxy-tunnel-refused":
    "the worker's connection to its provider was refused by its sandbox's proxy",
  "native-network-failure": "the worker lost its connection to its provider",
  "native-tls-failure": "the worker's connection failed its certificate check",
  "native-filesystem-refusal": "the host's file system refused the worker",
  "native-authentication-failure": "the host's sign-in was refused",
  "native-rate-limit": "the provider's rate limit was reached",
  "native-provider-unavailable": "the provider was unavailable",
  "native-nested-session-refusal":
    "the host refused to start inside another session",
  "native-session-unavailable": "the host could not find the session",
  "native-execution-error": "the host reported an error it did not classify",
  "stream-observation-failed":
    "the drive could not read a row of the worker's stream",
  "command-observation-failed":
    "the drive could not record one of the worker's commands",
  "subagent-observation-failed":
    "the drive could not record one of the worker's helpers",
  "identity-persistence-failed":
    "the drive could not record the worker's session",
  "workspace-routing-discovery-failed":
    "the host could not discover its workspace",
};

const shapeText = (stored, version) => {
  const shape = judgedShape(stored, version);
  return shape?.length
    ? shape.map((words) => words.join(" ")).join(" ; ")
    : null;
};
/** A denied call in words: the tool, and a shell command's shape. */
const callText = (item, version) => {
  const shape = shapeText(item.command, version);
  if (item.tool === "Bash" || item.tool === "shell" || (!item.tool && shape))
    return shape ? `the shell command \`${shape}\`` : "a shell command";
  if (item.tool === "mcp-tool") return "a call of an MCP tool";
  if (item.tool === "other") return "a call of a tool outside the host's own";
  return item.tool
    ? `a call of the ${item.tool} tool`
    : "a call it did not name";
};
const tally = (values) => {
  const counts = new Map();
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
  return [...counts].sort((a, b) => b[1] - a[1]);
};
const tallyText = (values, limit = 4) =>
  tally(values)
    .slice(0, limit)
    .map(([value, count]) => `${value} ×${count}`)
    .join(", ");

/** How the last attempt's process ended. */
const processEnd = (attempt) =>
  attempt.declined
    ? "the drive ended its process there"
    : attempt.timedOut
      ? "the drive ended its process at that limit"
      : attempt.exitSignal
        ? `its process was ended by ${attempt.exitSignal}`
        : Number.isInteger(attempt.exitCode)
          ? `its process exited ${attempt.exitCode}`
          : "the end of its process was not observed";

/** What ended the attempt, from the facts its record keeps. `completed` is
 * what the drive saw when the attempt ended, or null where the record does
 * not say; `stop` is the drive's stop. */
function endedBy(attempt, completed, stop) {
  if (attempt.declined) {
    const item = attempt.declined;
    const decided = item.decisionSource
      ? `, decided by ${DECIDED_BY[item.decisionSource] ?? DECIDED_BY.unknown}`
      : "";
    const when = Number.isSafeInteger(item.atMs)
      ? `, ${elapsed(item.atMs)} into the attempt`
      : "";
    // Who made the call is said where the record says it: a Codex item
    // names no caller.
    const caller =
      item.actor === "worker" ? ", which the phase worker made" : "";
    return [
      `Ended by: the host denied ${callText(item, attempt.commandShapeVersion)}${caller}${decided}${when}.`,
      "A driven phase runs with the host's permission prompts off, so a call the host would have asked about is denied instead; the drive ends a phase at its worker's own denied call, so that no worker goes around a denial or repeats it.",
      // A reason the host printed is free text and may name what the call
      // named, so it stays in the record.
      ...(item.reason
        ? [
            "The host printed a reason for it, which the drive's record keeps with paths, URLs and queries masked; an analysis: session reads it.",
          ]
        : []),
    ];
  }
  if (attempt.refused) {
    const refusal = refusalWithReason(attempt.refused, attempt.refusedReason);
    // The stop's own line is this refusal where the refusal stopped the drive.
    return [
      stop?.next === refusal
        ? "Ended by: the refusal the stop above states."
        : `Ended by: ${refusal}`,
    ];
  }
  if (attempt.timedOut) return ["Ended by: the attempt's time limit."];
  if (attempt.cause)
    return [`Ended by: ${CAUSES[attempt.cause] ?? attempt.cause}.`];
  if (attempt.error)
    return ["Ended by: an error of the host that the drive did not classify."];
  if (completed)
    return [
      "The attempt ended as its phase intends; the drive stopped for the reason the stop gives.",
    ];
  if (completed === null)
    return [
      "Ended by: nothing the drive saw go wrong; the worker's process ended cleanly.",
    ];
  return [
    "Ended by: nothing the drive saw go wrong. The worker's process ended without recording the phase's completion; a worker that ends its turn while work it started is still running ends this way.",
  ];
}

/** The host's wait for background work after a Claude worker's last turn. */
function backgroundLine(attempt) {
  if (attempt.host !== "claude") return [];
  const wait = attempt.backgroundWait;
  if (!wait)
    return [
      "Background work: this record does not say how long the host waited for it after the worker's last turn; the kit that ran the attempt left the host's default in place, which stops background agents after ten minutes, unless the drive's environment set another.",
    ];
  const length =
    wait.ceilingMs === 0
      ? "without a cap"
      : Number.isSafeInteger(wait.ceilingMs)
        ? `for at most ${hoursMinutes(wait.ceilingMs)}`
        : "for a time the environment set and the drive could not read";
  return [
    `Background work: the host waits for it after the worker's last turn ${length} (${wait.source === "drive" ? "set by the drive" : "set by the environment the drive ran in"}).`,
  ];
}

function nextStep(order, attempt, stop, completed, moved = false) {
  // The order has moved since the drive stopped: its stop is no longer where
  // the order stands.
  if (moved)
    return `Next: type drive: ${order} to go on from where the order now stands.`;
  const phrase = lifecycleRoutes[attempt?.action]?.phrase;
  const attended = phrase
    ? `type ${phrase} in a session in the order's worktree`
    : "run the phase's phrase in a session in the order's worktree";
  const again = `type drive: ${order} again, which starts the phase with a fresh worker from what the worktree holds`;
  const limit = attempt?.timedOut
    ? " The limit that ended the attempt is the shorter of its role's dispatch wall clock and budgets.drivenPhaseTimeoutMs (docs/control/budgets.json)."
    : "";
  // Two endings without a completion stop the drive until a transition is
  // recorded: driving again meets the same stop, whatever ended them.
  if (stop?.reason === "incomplete-bound")
    return `Next: ${attended}${attempt?.timedOut ? ", which the drive's limit does not end" : ""}. A transition it records clears this stop, and drive: ${order} goes on from there; typing it before then meets the same stop.${limit}`;
  // A release close the host declined is attended from the launchpad's main
  // checkout and is not started again by the same drive. The stop's own line
  // says where and how, so the reader is sent to it below and not to the
  // order's worktree or to a second drive.
  if (attempt?.declined && stop?.reason !== "awaiting-close")
    // A rule or a mode is the owner's to change; the host's automatic review
    // judges each call as it comes and gives no rule to change.
    return `Next: either ${attended}, where the host asks about such a call instead of denying it; or ${
      attempt.declined.decisionSource === "classifier"
        ? `${again}: the host's automatic review judges each call as it comes, and a fresh worker may not make this one`
        : `admit the call in the host's own permission settings and ${again}`
    }.`;
  if (attempt?.timedOut)
    return `Next: either ${attended}, which the drive's limit does not end, or change that limit and ${again}.${limit}`;
  if (attempt?.refused && attempt.refusedReason)
    return `Next: the reason above is the kit's own. node scripts/drive.mjs status ${order} prints where the order stands; once the reason is cleared, ${again}.`;
  if (attempt && !attempt.error && !attempt.refused && completed === false)
    return `Next: ${again}, or ${attended} to run it attended. Two endings like this one in the same phase stop the drive until its phrase is run by hand.`;
  return stop?.next
    ? `Next: as the stop says above. To read further than this account, open an analysis: session in the order's worktree; a router reads no transcript.`
    : `Next: node scripts/drive.mjs status ${order} prints where the order stands.`;
}

/**
 * The account of an order's last drive, as lines. `record` is the drive's
 * record or null, `status` canonical status as it reads now or null,
 * `worktree` the counts of the order's worktree or null, and `main` the root
 * the kept files' paths are printed against. Whether the last attempt
 * completed is what the drive recorded when the attempt ended, never what
 * status says now: the order may have moved since.
 */
export function driveAccount({
  order,
  record,
  status = null,
  worktree = null,
  main = null,
}) {
  if (!record)
    return [
      `${order}: no drive of this order has run from this launchpad, so there is no stop to explain. node scripts/drive.mjs status ${order} prints where the order stands.`,
    ];
  const attempts = record.attempts ?? [];
  const stop = record.stop ?? null;
  const host = record.host ?? "an unrecorded host";
  const lines = [
    record.running
      ? `${order}: a drive is running on ${host}, with ${plural(attempts.length, "phase attempt")} recorded so far.`
      : `${order}: the last drive stopped at ${stop?.reason ?? "a stop it did not record"}, with ${plural(attempts.length, "phase attempt")} recorded on ${host}.`,
  ];
  if (stop?.next) lines.push(`Stop: ${stop.next}`);
  const last = attempts.at(-1);
  if (!last) {
    lines.push(
      "No phase worker started: the drive stopped before any launch.",
      ...(record.writerConflict
        ? [
            "The order's worktree was reserved by another writer whose owner is live or of unknown liveness.",
          ]
        : []),
      nextStep(order, null, stop, null),
    );
    return lines;
  }
  const route = lifecycleRoutes[last.action];
  const completed = typeof last.completed === "boolean" ? last.completed : null;
  const moved = Boolean(
    status?.phase && last.phaseAfter && status.phase !== last.phaseAfter,
  );
  const ran =
    last.startedAt && last.finishedAt
      ? Date.parse(last.finishedAt) - Date.parse(last.startedAt)
      : null;
  lines.push(
    `Attempt ${attempts.length}: ${route?.phrase ?? last.action ?? "a phase"}${route ? ` as ${route.role}` : ""}, started ${minuteOf(last.startedAt)}, ${ran === null || Number.isNaN(ran) ? "for a time the record does not hold" : `ran ${elapsed(ran)}`}${Number.isSafeInteger(last.timeoutMs) ? (last.timeoutMs < 60000 ? " of a limit of less than a minute" : ` of a ${hoursMinutes(last.timeoutMs)} limit`) : ", under no time limit"}; ${processEnd(last)}.`,
    ...endedBy(last, completed, stop),
    ...backgroundLine(last),
  );
  if (last.helperDenials?.count)
    lines.push(
      `Helpers: the host denied ${plural(last.helperDenials.count, "call")} that helper agents made, which did not end the phase${last.helperDenials.items?.length ? ` (${tallyText(last.helperDenials.items.map((item) => item.tool ?? "unnamed"))})` : ""}. A helper reports its own denial to the worker.`,
    );
  if (Number.isSafeInteger(last.hostDenialsReported))
    lines.push(
      `The host's own result counted ${plural(last.hostDenialsReported, "denied call")} in the attempt.`,
    );
  const refusals = Object.entries(last.refusalCounts ?? {});
  const codes = refusals.length
    ? refusals.map(([code, count]) => `${code} ×${count}`).join(", ")
    : (last.refusalCodes ?? []).join(", ");
  const stops = Object.entries(last.refusalStops ?? {})
    .sort((a, b) => b[1] - a[1])
    .map(([id, count]) => `${id} ×${count}`)
    .join(", ");
  if (codes)
    lines.push(
      `The kit's own guard, not the host, refused calls in the attempt: ${codes}${stops ? `; by stop: ${stops}. npm run features -- list prints what each stop protects and the one line that sets its level` : ""}. A refused call returns its refusal to whoever made it and ends nothing.`,
    );
  const commands = last.commandResults ?? [];
  const failed = commands.filter(commandFailed);
  const shapes = failed
    .map((row) => shapeText(row.shape, last.commandShapeVersion))
    .filter(Boolean);
  if (commands.length)
    lines.push(
      `Commands: ${commands.length} observed, ${failed.length} failed${
        shapes.length
          ? `; most often ${tallyText(
              shapes.map((shape) => `\`${shape}\``),
              3,
            )}`
          : ""
      }.`,
    );
  lines.push(
    completed === null
      ? `Recorded: this record does not say whether the phase completed when the attempt ended${status?.phase ? `; the order now stands at phase ${status.phase}` : ""}.`
      : `Recorded, as the drive saw it when the attempt ended: ${completed ? "the phase's completion" : "no completion of the phase"}${last.phaseAfter ? `; the order stood at phase ${last.phaseAfter}` : ""}.`,
  );
  if (moved)
    lines.push(
      `Since then the order has moved to phase ${status.phase}: the stop above is the last drive's, and node scripts/drive.mjs status ${order} says where the order stands now.`,
    );
  // Where the order's worktree is, as a path from the main checkout, so that
  // no home directory is printed.
  const where =
    worktree?.path && main
      ? ` (${relative(main, worktree.path) || "."} from the main checkout)`
      : "";
  if (worktree)
    lines.push(
      worktree.changed + worktree.untracked
        ? `Left in the order's worktree${where}: ${plural(worktree.changed, "changed path")} and ${plural(worktree.untracked, "untracked path")}, uncommitted. Nothing was discarded: a fresh worker or an attended session starts from them.`
        : `The order's worktree${where} holds no uncommitted change.`,
    );
  const kept = last.retained
    ? ["events", "stderr"]
        .map((name) => last.retained[name])
        .filter((path) => typeof path === "string")
        .map((path) => (main ? relative(main, path) : path))
    : [];
  if (kept.length)
    lines.push(
      `Kept beside the record: the worker's raw stream and what its process printed (${kept.join(", ")}). They hold the worker's commands and their output: an analysis: session reads them, a router does not.`,
    );
  else if (completed === false)
    lines.push("The worker's raw stream was not kept for this attempt.");
  lines.push(nextStep(order, last, stop, completed, moved));
  return lines;
}

/** The uncommitted paths of a worktree, counted; null where Git cannot say. */
export function worktreeChanges(cwd) {
  const read = spawnGit(["status", "--porcelain"], {
    cwd,
    encoding: "utf8",
    timeout: 10000,
    maxBuffer: 16 * 1024 * 1024,
  });
  if (read.error || read.status !== 0) return null;
  const rows = read.stdout.split("\n").filter(Boolean);
  const untracked = rows.filter((row) => row.startsWith("??")).length;
  return { changed: rows.length - untracked, untracked, path: cwd };
}

/** The account of `order`'s last drive from this launchpad; `readStatus`
 * reads canonical status and may throw. */
export function readDriveAccount(root, order, readStatus = () => null) {
  const trees = resolveOrderWorktrees(root, order);
  const record = readDriveRecord(trees.main, order);
  let status = null;
  try {
    status = readStatus() ?? null;
  } catch {
    /* The account says that status could not be read. */
  }
  return driveAccount({
    order,
    record,
    status,
    // An order whose own worktree is gone resolves to the main checkout,
    // whose uncommitted paths are not the order's.
    worktree:
      record && trees.cwd !== trees.main ? worktreeChanges(trees.cwd) : null,
    main: trees.main,
  });
}
