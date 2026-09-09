import { spawnSync } from "node:child_process";
import { createHash, randomBytes } from "node:crypto";
import {
  appendFileSync,
  existsSync,
  lstatSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  realpathSync,
  renameSync,
  rmdirSync,
  rmSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { dirname, isAbsolute, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import {
  applyFeedbackCorrection,
  compileFeedbackUnits,
  COMPILER_PACKAGE_VERSION,
  fnv1a64,
  type AuthorityEnvelope,
  type CompiledFeedback,
  type CorrectionState,
  type HarnessEvent,
} from "@dotln/compiler";
import { harnessAuthorization } from "./reactor.js";
import {
  FeedbackRefused,
  feedbackContentHash,
  feedbackWriterFacts,
  type FeedbackBoundaryRequest,
  type feedbackBoundary,
} from "./feedback-boundary.js";

export const HARNESS_HOST_VERSION = "0.14.0";
export interface HarnessInput {
  readonly hook_event_name: HarnessEvent;
  readonly cwd: string;
  readonly session_id: string;
  readonly tool_name?: string;
  readonly tool_input?: Record<string, unknown>;
  readonly tool_response?: Record<string, unknown>;
  readonly prompt?: string;
  readonly effort?: { readonly level?: string };
  /** Claude sets this when it re-enters Stop because a Stop hook refused. */
  readonly stop_hook_active?: boolean;
}
export interface HarnessCheck {
  readonly checkId: string;
  readonly subject: string;
  readonly exitCode: number;
  readonly executed: boolean;
  readonly evidenceRef: string;
}
export interface HarnessSession {
  role?: string;
  intent?: string;
  expectedEvent?: string;
  startingEventCount: number;
  startingRevision?: string;
  reads: { path: string; hash: string; evidenceRef: string }[];
  byteReads?: HarnessByteRead[];
  correction?: CorrectionState;
}
interface HarnessByteRead {
  readonly path: string;
  readonly hash: string;
  readonly startByte: number;
  readonly endByte: number;
}
interface HookConfig {
  readonly compilerPackageVersion: string;
  readonly runtime: {
    readonly skeletonVersion: string;
    readonly boundaryContract: "feedback-v1";
    readonly files?: readonly {
      readonly path: string;
      readonly hash: string;
    }[];
  };
  readonly event: HarnessEvent;
  readonly kind: "feedback" | "permission" | "observe" | "session" | "finish";
  readonly policy?: CompiledFeedback;
  readonly envelope?: AuthorityEnvelope;
  readonly correctionToken?: string | null;
  readonly roles?: readonly {
    readonly name: string;
    readonly facetId: string;
    readonly intents: readonly string[];
  }[];
  readonly instructionFile?: string;
}
interface ControlView {
  readonly workOrder: string | null;
  readonly workOrderPath: string | null;
  readonly phase: string;
  readonly latestVerdict: string | null;
}
interface ReadRange {
  readonly path: string;
  readonly startLine: number;
  readonly endLine: number;
}
interface HarnessReadScope {
  readonly role: string;
  readonly skill: string;
  readonly reads: readonly ReadRange[];
  readonly commands: readonly string[];
  readonly mode?: "enforce" | "observe";
}
/** The harness process that owns a session's reservation, as the hook observed it. */
export interface HarnessProcess {
  readonly pid: number;
  readonly startedAt?: string;
  readonly source: "CLAUDE_PID" | "ancestor" | "parent";
}
export interface HarnessWriter {
  readonly actorId: string;
  readonly worktree: string;
  readonly owner?: HarnessProcess;
  readonly reservedAt?: string;
  /** Set when the owning session found its recorded owner dead: that identity never reclaims. */
  readonly liveness?: "unavailable";
  /** The instance this one replaced when its own session recorded a new fact under a new name. */
  readonly supersedes?: string;
  readonly reclaimed?: {
    readonly actorId: string;
    readonly owner?: HarnessProcess;
    readonly at: string;
  };
}
export type HarnessWriterView =
  | { readonly contract: "harness-writer-v1"; readonly reserved: false }
  | {
      readonly contract: "harness-writer-v1";
      readonly reserved: true;
      readonly actorId: string;
      readonly owner?: HarnessProcess;
      readonly reservedAt?: string;
      readonly liveness?: "unavailable";
      readonly reclaimed?: HarnessWriter["reclaimed"];
      readonly alive: boolean | "unknown";
    };
const digest = (text: string) =>
  createHash("sha256").update(text).digest("hex");
const physicalLines = (text: string) =>
  text.match(/[^\n]*\n|[^\n]+$/g)?.length ?? 0;
const lineParts = (text: string) => text.match(/[^\n]*\n|[^\n]+$/g) ?? [];
export const harnessStateDirectory = (root: string) =>
  join(root, "docs/control/local/harness");
const sessionKey = (input: HarnessInput) => digest(input.session_id);
const statePath = (root: string, input: HarnessInput) =>
  join(harnessStateDirectory(root), `${sessionKey(input)}.json`);
const git = (root: string, args: readonly string[], acceptFailure = false) => {
  const result = spawnSync("git", [...args], {
    cwd: root,
    encoding: "utf8",
    timeout: 10_000,
    maxBuffer: 32 * 1024 * 1024,
  });
  if (result.status !== 0 && !acceptFailure)
    throw new Error("Git host observation unavailable");
  return result.stdout ?? "";
};
export function harnessRoot(cwd: string): string {
  const physical = realpathSync(cwd);
  const root = realpathSync(
    git(physical, ["rev-parse", "--show-toplevel"]).trim(),
  );
  if (physical !== root)
    throw new Error("Harness requires the verified worktree root");
  return root;
}
const contained = (root: string, candidate: string) => {
  const path = resolve(root, candidate);
  if (
    !path.startsWith(`${root}${sep}`) ||
    /(?:^|\/)\.git(?:\/|$)/.test(relative(root, path))
  )
    throw new Error("Path outside the worktree surface");
  let parent = existsSync(path) ? path : dirname(path);
  while (!existsSync(parent)) parent = dirname(parent);
  const physical = realpathSync(parent);
  if (physical !== root && !physical.startsWith(`${root}${sep}`))
    throw new Error("Path resolves outside the worktree");
  return path;
};
const readJson = <T>(path: string, fallback: T): T => {
  if (!existsSync(path)) return fallback;
  if (!lstatSync(path).isFile())
    throw new Error("Host record is not a regular file");
  return JSON.parse(readFileSync(path, "utf8")) as T;
};
const writeJson = (path: string, value: unknown) => {
  mkdirSync(dirname(path), { recursive: true, mode: 0o700 });
  if (existsSync(path) && !lstatSync(path).isFile())
    throw new Error("Host record is not a regular file");
  writeFileSync(path, JSON.stringify(value) + "\n", { mode: 0o600 });
};
const localEvents = (
  root: string,
  order: string | null,
): { type: string }[] => {
  const paths = [
    join(root, "docs/control/resume.jsonl"),
    ...(order ? [join(root, `docs/control/orders/${order}.jsonl`)] : []),
  ];
  return paths.flatMap((path) =>
    existsSync(path)
      ? readFileSync(path, "utf8")
          .split("\n")
          .filter(Boolean)
          .map(
            (line) => JSON.parse(line) as { type: string; workOrderId: string },
          )
          .filter((event) => event.workOrderId === order)
      : [],
  );
};
export function harnessControl(root: string): ControlView {
  const result = spawnSync(
    process.execPath,
    [join(root, "scripts/resume.mjs"), "status", "--json"],
    {
      cwd: root,
      encoding: "utf8",
      timeout: 10_000,
      maxBuffer: 4 * 1024 * 1024,
    },
  );
  if (result.status !== 0)
    throw new Error("Canonical lifecycle observation unavailable");
  return JSON.parse(result.stdout) as ControlView;
}
const initialSession = (): HarnessSession => ({
  startingEventCount: 0,
  reads: [],
});
const record = (
  root: string,
  input: HarnessInput,
  value: Record<string, unknown>,
) => {
  const path = join(harnessStateDirectory(root), `${sessionKey(input)}.jsonl`);
  mkdirSync(dirname(path), { recursive: true, mode: 0o700 });
  if (existsSync(path) && !lstatSync(path).isFile())
    throw new Error("Host observation log is not a regular file");
  appendFileSync(
    path,
    JSON.stringify({
      event: input.hook_event_name,
      ...(input.tool_name ? { tool: input.tool_name } : {}),
      ...(input.effort?.level &&
      ["low", "medium", "high", "xhigh", "max"].includes(input.effort.level)
        ? { effort: input.effort.level }
        : {}),
      ...value,
    }) + "\n",
    { mode: 0o600 },
  );
};
interface ProcessRow {
  readonly pid: number;
  readonly ppid: number;
  readonly startedAt: string;
  readonly command: string;
}
const shells = new Set([
  "sh",
  "bash",
  "zsh",
  "dash",
  "fish",
  "ksh",
  "csh",
  "tcsh",
  "login",
]);
const validPid = (value: unknown): value is number =>
  Number.isSafeInteger(value) && (value as number) > 1;
/** Best effort: some sandboxes refuse `ps`. An empty table means unknown, never dead. */
function processTable(): readonly ProcessRow[] {
  const result = spawnSync("ps", ["-axo", "pid=,ppid=,lstart=,comm="], {
    encoding: "utf8",
    timeout: 5000,
    maxBuffer: 32 * 1024 * 1024,
  });
  if (result.error || result.status !== 0) return [];
  return result.stdout.split("\n").flatMap((line) => {
    const match =
      /^\s*(\d+)\s+(\d+)\s+(\S{3}\s+\S{3}\s+\d+\s+\d\d:\d\d:\d\d\s+\d{4})\s+(.*)$/.exec(
        line,
      );
    return match
      ? [
          {
            pid: Number(match[1]),
            ppid: Number(match[2]),
            startedAt: match[3]!,
            command: match[4]!.trim(),
          },
        ]
      : [];
  });
}
/**
 * The harness process owning this hook invocation: the declared pid when it is
 * a verified ancestor, else the nearest non-shell ancestor; when the process
 * table is unreadable, the declared pid is trusted and the parent is the last resort.
 */
export function harnessHostProcess(
  env: NodeJS.ProcessEnv = process.env,
  parent = process.ppid,
): HarnessProcess {
  const table = processTable();
  const rows = new Map(table.map((row) => [row.pid, row]));
  const ancestors: ProcessRow[] = [];
  for (let pid = parent; validPid(pid) && ancestors.length < 32;) {
    const row = rows.get(pid);
    if (!row) break;
    ancestors.push(row);
    pid = row.ppid;
  }
  const declared = /^\d+$/.test(env.CLAUDE_PID ?? "")
    ? Number(env.CLAUDE_PID)
    : NaN;
  const declaredRow = ancestors.find((row) => row.pid === declared);
  if (declaredRow)
    return {
      pid: declaredRow.pid,
      startedAt: declaredRow.startedAt,
      source: "CLAUDE_PID",
    };
  const ancestor = ancestors.find(
    (row) => !shells.has(row.command.replace(/^.*\//, "").toLowerCase()),
  );
  if (ancestor)
    return {
      pid: ancestor.pid,
      startedAt: ancestor.startedAt,
      source: "ancestor",
    };
  if (!table.length && validPid(declared))
    return { pid: declared, source: "CLAUDE_PID" };
  return { pid: parent, source: "parent" };
}
/** Signal-zero existence, then a start-time comparison when the process table is readable. */
export function harnessProcessAlive(owner: HarnessProcess): boolean {
  if (!validPid(owner.pid)) return false;
  try {
    process.kill(owner.pid, 0);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ESRCH") return false;
  }
  const row = processTable().find((entry) => entry.pid === owner.pid);
  return !(
    owner.startedAt !== undefined &&
    row !== undefined &&
    row.startedAt !== owner.startedAt
  );
}
/**
 * A reservation is a directory holding nonce-named files whose contents never
 * change after creation. A session that must record a new fact about its own
 * reservation writes a new file naming the one it supersedes and then removes
 * the superseded name, so a name always denotes exactly the facts a contender
 * observed under it. Every recovery step is therefore conditional on the
 * observed instance: `unlink` needs that exact name and fails once its facts
 * were superseded, `rmdir` needs the emptied instance, and renaming a prepared
 * instance into place succeeds only onto an absent or emptied slot. A stale
 * reclaimer cannot remove refreshed facts, and two sessions that observed the
 * same dead holder cannot remove each other's replacement; the loser
 * re-observes and honours the live holder.
 */
const writerLockDirectory = (root: string) =>
  join(harnessStateDirectory(root), "writer");
/** The pre-repair single-file layout: read, migrated or reclaimed, never created. */
const legacyWriterLock = (root: string) =>
  join(harnessStateDirectory(root), "writer.json");
const reservationName = /^reservation-[0-9a-f]{32}\.json$/;
const errorCode = (error: unknown) => (error as NodeJS.ErrnoException).code;
interface WriterInstance {
  readonly name: string;
  readonly writer: HarnessWriter;
  /** Names this instance superseded that still linger; nothing can revive them. */
  readonly superseded: readonly string[];
}
type WriterObservation =
  | { readonly state: "absent" }
  | { readonly state: "held"; readonly instance: WriterInstance };
const ownerFields = (owner: HarnessProcess | undefined) =>
  owner ? { owner } : {};
const appendWriterEvent = (root: string, event: Record<string, unknown>) => {
  const path = join(harnessStateDirectory(root), "writer-events.jsonl");
  mkdirSync(dirname(path), { recursive: true, mode: 0o700 });
  if (existsSync(path) && !lstatSync(path).isFile())
    throw new Error("Writer event log is not a regular file");
  appendFileSync(
    path,
    JSON.stringify({ at: new Date().toISOString(), ...event }) + "\n",
    { mode: 0o600 },
  );
};
/**
 * An emptied instance is retired. The current instance is the one file that no
 * other file names as superseded; superseded files of the same lineage may
 * linger after a crash and are reported for removal. Anything else refuses.
 */
function observeWriterLock(root: string): WriterObservation {
  const directory = writerLockDirectory(root);
  let names: string[];
  try {
    if (!lstatSync(directory).isDirectory())
      throw new Error("Writer reservation is not a directory");
    names = readdirSync(directory);
  } catch (error) {
    if (errorCode(error) === "ENOENT") return { state: "absent" };
    throw error;
  }
  if (!names.length) return { state: "absent" };
  const inspect = () =>
    new Error(
      "Writer reservation directory holds more than one reservation; inspect before recovery",
    );
  if (names.some((name) => !reservationName.test(name))) throw inspect();
  const entries = names.map((name) => {
    if (!lstatSync(join(directory, name)).isFile())
      throw new Error("Writer reservation is not a regular file");
    return {
      name,
      writer: JSON.parse(
        readFileSync(join(directory, name), "utf8"),
      ) as HarnessWriter,
    };
  });
  const superseded = new Set(
    entries.flatMap((entry) =>
      entry.writer.supersedes ? [entry.writer.supersedes] : [],
    ),
  );
  const current = entries.filter((entry) => !superseded.has(entry.name));
  if (
    current.length !== 1 ||
    entries.some((entry) => entry.writer.actorId !== current[0]!.writer.actorId)
  )
    throw inspect();
  return {
    state: "held",
    instance: {
      ...current[0]!,
      superseded: entries
        .filter((entry) => entry !== current[0])
        .map((entry) => entry.name),
    },
  };
}
/** Rename a prepared instance into the slot; false when a live instance holds it. */
function placeWriterInstance(root: string, writer: HarnessWriter): boolean {
  const nonce = randomBytes(16).toString("hex");
  const prepared = join(harnessStateDirectory(root), `writer.prepare-${nonce}`);
  mkdirSync(prepared, { mode: 0o700 });
  writeFileSync(
    join(prepared, `reservation-${nonce}.json`),
    JSON.stringify(writer) + "\n",
    { mode: 0o600 },
  );
  try {
    renameSync(prepared, writerLockDirectory(root));
    return true;
  } catch (error) {
    rmSync(prepared, { recursive: true, force: true });
    if (["ENOTEMPTY", "EEXIST"].includes(errorCode(error) ?? "")) return false;
    throw error;
  }
}
const unlinkIfPresent = (path: string): boolean => {
  try {
    unlinkSync(path);
    return true;
  } catch (error) {
    if (errorCode(error) !== "ENOENT") throw error;
    return false;
  }
};
/**
 * Retire only the observed instance: first its lingering superseded names,
 * which nothing can revive, then the current name, which is gone once its
 * facts were superseded or a replacement holds the slot.
 */
function retireWriterInstance(root: string, instance: WriterInstance): boolean {
  const directory = writerLockDirectory(root);
  for (const stale of instance.superseded)
    unlinkIfPresent(join(directory, stale));
  if (!unlinkIfPresent(join(directory, instance.name))) return false;
  try {
    rmdirSync(directory);
  } catch (error) {
    // A replacement already renamed over the emptied instance, or it is gone.
    if (!["ENOTEMPTY", "EEXIST", "ENOENT"].includes(errorCode(error) ?? ""))
      throw error;
  }
  return true;
}
/**
 * Record a new fact about this session's own reservation as a new instance
 * that names the observed one, then remove the observed name. A contender
 * that classified the observed name meanwhile finds it gone rather than the
 * refreshed facts. Null when the slot is no longer this session's.
 */
function refreshWriterInstance(
  root: string,
  instance: WriterInstance,
  writer: HarnessWriter,
): WriterInstance | null {
  const directory = writerLockDirectory(root);
  const nonce = randomBytes(16).toString("hex");
  const name = `reservation-${nonce}.json`;
  const temporary = join(
    harnessStateDirectory(root),
    `writer.update-${nonce}.json`,
  );
  const refreshed: HarnessWriter = { ...writer, supersedes: instance.name };
  writeFileSync(temporary, JSON.stringify(refreshed) + "\n", { mode: 0o600 });
  try {
    renameSync(temporary, join(directory, name));
  } catch (error) {
    unlinkIfPresent(temporary);
    if (errorCode(error) === "ENOENT") return null;
    throw error;
  }
  // The new instance must be the slot's current one; otherwise the slot
  // changed hands meanwhile, so withdraw the injected file and re-observe.
  let observation: WriterObservation | null = null;
  try {
    observation = observeWriterLock(root);
  } catch {
    observation = null;
  }
  if (observation?.state === "held" && observation.instance.name === name) {
    for (const stale of observation.instance.superseded)
      unlinkIfPresent(join(directory, stale));
    return { name, writer: refreshed, superseded: [] };
  }
  unlinkIfPresent(join(directory, name));
  return null;
}
/** Fixture and live-smoke seeding through the same conditional placement, never a hook path. */
export function seedHarnessWriter(root: string, writer: HarnessWriter): void {
  mkdirSync(harnessStateDirectory(root), { recursive: true, mode: 0o700 });
  if (!placeWriterInstance(root, writer))
    throw new Error("Writer reservation is already held");
}
/** The view of one observed record: a hashed session key and host process, never a path, session id or instance name. */
const writerView = (
  writer: HarnessWriter,
): Extract<HarnessWriterView, { readonly reserved: true }> => ({
  contract: "harness-writer-v1",
  reserved: true,
  actorId: writer.actorId,
  ...ownerFields(writer.owner),
  ...(writer.reservedAt ? { reservedAt: writer.reservedAt } : {}),
  ...(writer.liveness ? { liveness: writer.liveness } : {}),
  ...(writer.reclaimed ? { reclaimed: writer.reclaimed } : {}),
  alive:
    writer.owner && writer.liveness !== "unavailable"
      ? harnessProcessAlive(writer.owner)
      : "unknown",
});
/** The current holder as one observation: the directory instance, else the legacy file. */
function observeWriterHolder(root: string): {
  readonly observation: WriterObservation;
  readonly writer: HarnessWriter | null;
} {
  const observation = observeWriterLock(root);
  return {
    observation,
    writer:
      observation.state === "held"
        ? observation.instance.writer
        : readJson<HarnessWriter | null>(legacyWriterLock(root), null),
  };
}
/** Operator-facing view: a hashed session key and host process, never a path or session id. */
export function harnessWriterView(root: string): HarnessWriterView {
  const { writer } = observeWriterHolder(root);
  return writer
    ? writerView(writer)
    : { contract: "harness-writer-v1", reserved: false };
}
const ownerDead = (writer: HarnessWriter) =>
  writer.owner !== undefined &&
  writer.liveness !== "unavailable" &&
  !harnessProcessAlive(writer.owner);
function acquireHarnessWriter(
  root: string,
  input: HarnessInput,
  actorId: string,
  options: { reclaimed?: HarnessWriter; liveness?: "unavailable" } = {},
): HarnessWriter | null {
  const at = new Date().toISOString();
  const owner = harnessHostProcess();
  const previous = options.reclaimed
    ? {
        actorId: options.reclaimed.actorId,
        ...ownerFields(options.reclaimed.owner),
      }
    : undefined;
  const fresh: HarnessWriter = {
    actorId,
    worktree: root,
    owner,
    reservedAt: at,
    ...(options.liveness ? { liveness: options.liveness } : {}),
    ...(previous ? { reclaimed: { ...previous, at } } : {}),
  };
  if (!placeWriterInstance(root, fresh)) return null;
  appendWriterEvent(root, {
    event: previous ? "reclaimed" : "acquired",
    actorId,
    owner,
    ...(previous ? { previous } : {}),
  });
  record(root, input, {
    writerAcquired: { owner },
    ...(previous ? { writerReclaimed: previous } : {}),
  });
  return fresh;
}
/**
 * A pre-repair single-file reservation is migrated when it is this session's
 * and reclaimed when its owner is dead. That file is never a current-protocol
 * instance, so removing it cannot remove another session's replacement. A live
 * or unknown legacy holder is honoured.
 */
function migrateLegacyWriter(
  root: string,
  actorId: string,
): {
  readonly honoured: readonly HarnessWriter[];
  readonly reclaimed?: HarnessWriter;
  readonly liveness?: "unavailable";
} {
  const legacy = legacyWriterLock(root);
  const writer = readJson<HarnessWriter | null>(legacy, null);
  if (!writer) return { honoured: [] };
  const own = writer.actorId === actorId;
  const dead = ownerDead(writer);
  if (!own && !dead) return { honoured: [writer] };
  try {
    unlinkSync(legacy);
  } catch (error) {
    if (errorCode(error) !== "ENOENT") throw error;
    return { honoured: [] };
  }
  if (own) {
    appendWriterEvent(root, {
      event: "migrated",
      actorId,
      ...ownerFields(writer.owner),
    });
    return {
      honoured: [],
      ...(dead || writer.liveness ? { liveness: "unavailable" as const } : {}),
    };
  }
  return { honoured: [], reclaimed: writer };
}
/**
 * Reserve or refresh this session's lock. Only a foreign lock whose recorded
 * owner is dead is reclaimed, and every reclaim is logged; a live or unknown
 * holder keeps the lock until it finishes or an operator releases it. Every
 * step acts only on the observed instance, so contenders serialize through
 * the filesystem rather than through a guard that could itself be abandoned.
 */
function reserveHarnessWriter(
  root: string,
  input: HarnessInput,
  actorId: string,
): readonly HarnessWriter[] {
  mkdirSync(harnessStateDirectory(root), { recursive: true, mode: 0o700 });
  const legacy = migrateLegacyWriter(root, actorId);
  if (legacy.honoured.length) {
    // An honoured legacy holder is a writer; this session acquires nothing.
    const observation = observeWriterLock(root);
    return observation.state === "held"
      ? [...legacy.honoured, observation.instance.writer]
      : legacy.honoured;
  }
  let reclaimed = legacy.reclaimed;
  let liveness = legacy.liveness;
  for (let attempt = 0; attempt < 16; attempt++) {
    let observation: WriterObservation;
    try {
      observation = observeWriterLock(root);
    } catch (error) {
      if (errorCode(error) === "ENOENT") continue;
      throw error;
    }
    if (observation.state === "absent") {
      const fresh = acquireHarnessWriter(root, input, actorId, {
        ...(reclaimed ? { reclaimed } : {}),
        ...(liveness ? { liveness } : {}),
      });
      if (fresh) return [fresh];
      if (reclaimed) {
        appendWriterEvent(root, {
          event: "retired",
          actorId,
          previous: {
            actorId: reclaimed.actorId,
            ...ownerFields(reclaimed.owner),
          },
        });
        reclaimed = undefined;
      }
      continue;
    }
    const { instance } = observation;
    const writer = instance.writer;
    if (writer.actorId === actorId) {
      let updated: HarnessWriter | undefined;
      let event: Record<string, unknown> | undefined;
      let journal: Record<string, unknown> | undefined;
      if (!writer.owner) {
        updated = {
          ...writer,
          owner: harnessHostProcess(),
          reservedAt: writer.reservedAt ?? new Date().toISOString(),
        };
        event = { event: "owner-recorded", actorId, owner: updated.owner };
      } else if (ownerDead(writer)) {
        // This session is running its hook, so the recorded owner was not its process.
        updated = { ...writer, liveness: "unavailable" };
        event = { event: "liveness-unavailable", actorId, owner: writer.owner };
        journal = { writerLivenessUnavailable: writer.owner };
      }
      if (!updated) {
        for (const stale of instance.superseded)
          unlinkIfPresent(join(writerLockDirectory(root), stale));
        return [writer];
      }
      const refreshed = refreshWriterInstance(root, instance, updated);
      if (!refreshed) {
        // The slot changed hands; a distrusted identity stays distrusted if it acquires again.
        if (updated.liveness) liveness = "unavailable";
        continue;
      }
      appendWriterEvent(root, event!);
      if (journal) record(root, input, journal);
      return [refreshed.writer];
    }
    if (ownerDead(writer)) {
      if (!retireWriterInstance(root, instance)) continue;
      const fresh = acquireHarnessWriter(root, input, actorId, {
        reclaimed: writer,
        ...(liveness ? { liveness } : {}),
      });
      if (fresh) return [fresh];
      appendWriterEvent(root, {
        event: "retired",
        actorId,
        previous: { actorId: writer.actorId, ...ownerFields(writer.owner) },
      });
      continue;
    }
    return [writer];
  }
  throw new Error("Writer reservation recovery exceeded its retry budget");
}
export function harnessSubject(root: string): string {
  const paths = git(root, [
    "ls-files",
    "-z",
    "--cached",
    "--others",
    "--exclude-standard",
  ])
    .split("\0")
    .filter(Boolean);
  const current = [...new Set(paths)]
    .sort()
    .filter(
      (path) =>
        !path.startsWith("docs/control/") &&
        path !== "docs/work-orders/README.md" &&
        !path.startsWith("docs/verifications/") &&
        !path.startsWith("docs/final-reviews/"),
    );
  return feedbackContentHash(
    current
      .map((path) => {
        const absolute = contained(root, path);
        return `${path}\0${existsSync(absolute) && lstatSync(absolute).isFile() ? feedbackContentHash(readFileSync(absolute)) : "absent-or-link"}`;
      })
      .join("\n"),
  );
}
export function harnessOutputs(
  root: string,
  since = "HEAD",
): readonly { path: string; hash: string }[] {
  const changed = [
    ...git(
      root,
      ["diff", since, "--name-only", "--diff-filter=AM", "-z"],
      true,
    ).split("\0"),
    ...git(root, ["ls-files", "--others", "--exclude-standard", "-z"]).split(
      "\0",
    ),
  ].filter(Boolean);
  return [...new Set(changed)].sort().flatMap((path) => {
    const absolute = contained(root, path);
    return existsSync(absolute) && lstatSync(absolute).isFile()
      ? [{ path, hash: feedbackContentHash(readFileSync(absolute)) }]
      : [];
  });
}

const outputReadLimit = 16_384;
export function harnessOutputReadArgs(args: readonly string[]): {
  path: string;
  offset: number;
  length: number;
} {
  const [path, ...flags] = args;
  if (!path || flags.length % 2)
    throw new Error(
      "usage: harness read-output <path> [--offset <byte>] [--length <bytes>]",
    );
  const values = new Map<string, number>();
  for (let index = 0; index < flags.length; index += 2) {
    const flag = flags[index]!;
    const value = flags[index + 1]!;
    if (
      !["--offset", "--length"].includes(flag) ||
      values.has(flag) ||
      !/^\d+$/.test(value) ||
      !Number.isSafeInteger(Number(value))
    )
      throw new Error("Invalid output read range");
    values.set(flag, Number(value));
  }
  return {
    path,
    offset: values.get("--offset") ?? 0,
    length: values.get("--length") ?? 8192,
  };
}

/** A bounded delivery, never a read receipt. Only the post-tool observer admits it. */
export function readHarnessOutput(
  root: string,
  path: string,
  offset = 0,
  length = 8192,
) {
  const absolute = contained(root, path);
  path = relative(root, absolute);
  const visible = git(root, [
    "ls-files",
    "--cached",
    "--others",
    "--exclude-standard",
    "-z",
  ]).split("\0");
  if (!visible.includes(path) || !lstatSync(absolute).isFile())
    throw new Error("Output reader requires a Git-visible regular file");
  const bytes = readFileSync(absolute);
  if (
    !Number.isSafeInteger(offset) ||
    !Number.isSafeInteger(length) ||
    offset < 0 ||
    offset > bytes.length ||
    length < 4 ||
    length > outputReadLimit ||
    (offset < bytes.length && (bytes[offset]! & 0xc0) === 0x80)
  )
    throw new Error("Invalid output byte range or UTF-8 boundary");
  let end = Math.min(bytes.length, offset + length);
  while (end < bytes.length && (bytes[end]! & 0xc0) === 0x80) end--;
  const content = new TextDecoder("utf-8", {
    fatal: true,
    ignoreBOM: true,
  }).decode(bytes.subarray(offset, end));
  return {
    contract: "harness-output-read-v1",
    path,
    hash: feedbackContentHash(bytes),
    offset,
    nextOffset: end,
    totalBytes: bytes.length,
    content,
  };
}

function outputReadCommand(command: unknown) {
  if (typeof command !== "string") return null;
  // Direct invocation only: shell composition, substitutions and interpreters
  // cannot turn model-authored stdout into a host-observed delivery.
  const match =
    /^node scripts\/harness\.mjs read-output (?:'([^'\n]+)'|"([^"$\x60\\\n]+)"|([a-zA-Z0-9_./-]+))((?: --(?:offset|length) \d+)*)$/.exec(
      command,
    );
  if (!match) return null;
  return harnessOutputReadArgs([
    match[1] ?? match[2] ?? match[3]!,
    ...match[4]!.trim().split(/\s+/).filter(Boolean),
  ]);
}

function admitReadBytes(
  session: HarnessSession,
  path: string,
  contents: Buffer,
  startByte: number,
  endByte: number,
): void {
  const hash = feedbackContentHash(contents);
  const ranges = (session.byteReads ??= []);
  ranges.push({ path, hash, startByte, endByte });
  let covered = 0;
  for (const range of ranges
    .filter((range) => range.path === path && range.hash === hash)
    .sort((a, b) => a.startByte - b.startByte)) {
    if (range.startByte > covered) return;
    covered = Math.max(covered, range.endByte);
  }
  if (
    covered === contents.length &&
    !session.reads.some((read) => read.path === path && read.hash === hash)
  )
    session.reads.push({
      path,
      hash,
      evidenceRef: "host:observed-output-ranges",
    });
}

export function runHarnessEvidence(root: string): readonly HarnessCheck[] {
  const subject = harnessSubject(root);
  const commands = [
    { checkId: "npm test", executable: "npm", args: ["test"] },
    {
      checkId: "git diff --check",
      executable: "git",
      args: ["diff", "--check"],
    },
  ];
  const runs = commands.map(({ checkId, executable, args }): HarnessCheck => {
    const run = spawnSync(executable, args, {
      cwd: root,
      encoding: "utf8",
      timeout: 900_000,
      maxBuffer: 32 * 1024 * 1024,
    });
    process.stdout.write(run.stdout ?? "");
    process.stderr.write(run.stderr ?? "");
    return {
      checkId,
      subject,
      exitCode: run.status ?? 1,
      executed: !run.error,
      evidenceRef: `host-check:${digest(checkId + subject)}`,
    };
  });
  if (harnessSubject(root) !== subject)
    throw new Error("Source changed during required checks");
  writeJson(join(harnessStateDirectory(root), "checks.json"), runs);
  return runs;
}

const shellQuote = (value: string) => `'${value.replaceAll("'", `'\\''`)}'`;
function metadataCommand(command: string): boolean {
  if (outputReadCommand(command) !== null) return true;
  const commands = command.split(/\s*(?:&&|\n)\s*/).map((part) => part.trim());
  return (
    commands.length > 0 &&
    commands.every(
      (part) =>
        [
          "pwd",
          "git rev-parse --show-toplevel",
          "git rev-parse --abbrev-ref HEAD",
          "git status --short",
          "git status --short --branch",
          "git diff --check",
          "git worktree list --porcelain",
          "node scripts/harness.mjs writer --show",
        ].includes(part) ||
        /^(?:node scripts\/resume\.mjs|npm run resume(?: --silent)? --) (?:status(?: --json)?|times|usage(?: --json)?|next|release-close)$/.test(
          part,
        ),
    )
  );
}
/** This is a call to the existing guarded lifecycle host, not a source-writer dispatch. */
function managedReleaseCommand(
  input: HarnessInput,
  root: string,
  session: HarnessSession,
): boolean {
  if (input.tool_name !== "Bash" || session.intent !== "resume: release close")
    return false;
  const command = input.tool_input?.command;
  if (typeof command !== "string" || !command.includes("scripts/release.mjs"))
    return false;
  const control = harnessControl(root);
  if (control.phase !== "closed" || !control.workOrder) return false;
  const worktrees = git(root, ["worktree", "list", "--porcelain"])
    .trim()
    .split("\n\n")
    .map((block) => ({
      path: /^worktree (.+)$/m.exec(block)?.[1],
      branch: /^branch refs\/heads\/(.+)$/m.exec(block)?.[1],
    }));
  // The ordinary post-merge handoff starts a fresh session on main, so the
  // installed hooks survive deletion of the reviewed subject worktree.
  const main = worktrees.find((tree) => tree.branch === "main");
  if (!main?.path || realpathSync(main.path) !== root) return false;
  const subject =
    worktrees.find((tree) => tree.branch === control.workOrder!.toLowerCase())
      ?.path ?? root;
  const script = join(realpathSync(subject), "scripts/release.mjs");
  if (!existsSync(script) || !lstatSync(script).isFile()) return false;
  const suffix = `${shellQuote(script)} close ${control.workOrder} --publish`;
  return [
    `${shellQuote(process.execPath)} ${suffix}`,
    `node ${suffix}`,
    ...(subject === root
      ? [`node scripts/release.mjs close ${control.workOrder} --publish`]
      : []),
  ].includes(command.trim());
}

/** Host fact collection is separate from the sole compiled feedback predicate. */
export function harnessFeedbackFacts(
  policy: CompiledFeedback,
  input: HarnessInput,
  root: string,
  session: HarnessSession,
): readonly FeedbackBoundaryRequest[] {
  const handler = policy.units[0]?.trigger;
  const args = input.tool_input ?? {};
  if (handler === "attribution" && input.tool_name === "Bash") {
    const command = typeof args.command === "string" ? args.command : "";
    if (!/\bgit\s+(?:[^\n;]*\s)?commit\b/.test(command)) return [];
    const messages = [
      ...command.matchAll(
        /(?:^|\s)(?:-m|--message)(?:=|\s+)(?:'([^']*)'|"([^"$`]*)")/g,
      ),
    ].map((match) => match[1] ?? match[2]!);
    const file =
      /(?:^|\s)(?:-F|--file)(?:=|\s+)(?:'([^']+)'|"([^"$`]+)"|([^\s;&|]+))/.exec(
        command,
      );
    if (file)
      messages.push(
        readFileSync(contained(root, file[1] ?? file[2] ?? file[3]!), "utf8"),
      );
    if (!messages.length)
      throw new Error(
        "Commit message bytes unavailable; use an explicit message file",
      );
    return [{ kind: "attribution", message: messages.join("\n\n") }];
  }
  if (
    handler === "writer-isolation" &&
    ["Bash", "Edit", "Write"].includes(input.tool_name ?? "")
  ) {
    const actorId = sessionKey(input);
    if (
      input.tool_name === "Bash" &&
      (metadataCommand(String(args.command ?? "")) ||
        managedReleaseCommand(input, root, session))
    )
      return [{ ...feedbackWriterFacts(root, actorId, []), writable: false }];
    return [
      feedbackWriterFacts(
        root,
        actorId,
        reserveHarnessWriter(root, input, actorId),
      ),
    ];
  }
  if (
    handler === "suppression-diff" &&
    ["Edit", "Write"].includes(input.tool_name ?? "")
  ) {
    if (typeof args.file_path !== "string")
      throw new Error("Missing edit path");
    const path = relative(root, contained(root, args.file_path));
    const original = input.tool_response?.originalFile;
    const before =
      typeof original === "string"
        ? original
        : git(root, ["show", `HEAD:${path}`], true);
    return [
      {
        kind: "suppression-diff",
        files: [
          { path, before, after: readFileSync(contained(root, path), "utf8") },
        ],
      },
    ];
  }
  if (input.hook_event_name !== "Stop" || !session.expectedEvent) return [];
  const control = harnessControl(root);
  if (handler === "complete-scope") {
    const events = localEvents(root, control.workOrder).slice(
      session.startingEventCount,
    );
    const complete = events.some(
      (event) => event.type === session.expectedEvent,
    );
    return [
      {
        kind: "complete-scope",
        required: [session.expectedEvent],
        completed: complete ? [session.expectedEvent] : [],
        remaining: complete ? [] : [session.expectedEvent],
        status: complete ? "completed" : "pending",
      },
    ];
  }
  // A failed verification is a valid completed verification episode, not a pass claim.
  if (
    handler === "application-evidence" &&
    control.latestVerdict === "fail" &&
    ["verifier", "reviewer"].includes(session.role ?? "")
  )
    return [];
  if (handler === "application-evidence")
    return [
      {
        kind: "application-evidence",
        subject: harnessSubject(root),
        requiredChecks: ["npm test", "git diff --check"],
        runs: readJson<HarnessCheck[]>(
          join(harnessStateDirectory(root), "checks.json"),
          [],
        ),
      },
    ];
  if (handler === "output-review")
    return [
      {
        kind: "output-review",
        outputs: harnessOutputs(root, session.startingRevision),
        reads: session.reads,
      },
    ];
  return [];
}

function observeRead(
  input: HarnessInput,
  root: string,
  session: HarnessSession,
): readonly ReadRange[] {
  const paths: ReadRange[] = [];
  const args = input.tool_input ?? {};
  if (input.tool_name === "Read" && typeof args.file_path === "string") {
    const path = relative(root, contained(root, args.file_path));
    const file = input.tool_response?.file as
      | {
          content?: string;
          startLine?: number;
          numLines?: number;
          totalLines?: number;
        }
      | undefined;
    const bytes = readFileSync(contained(root, path));
    const contents = new TextDecoder("utf-8", {
      fatal: true,
      ignoreBOM: true,
    }).decode(bytes);
    if (
      !file ||
      !Number.isInteger(file.startLine) ||
      !Number.isInteger(file.numLines)
    )
      throw new Error("Read response range unavailable");
    paths.push({
      path,
      startLine: file.startLine!,
      // Claude reports the empty line after a trailing newline. It delivers
      // no additional bytes; normalize to the same physical-line convention
      // used by the directed-set accountant, without widening a section.
      endLine: Math.min(
        physicalLines(contents),
        file.startLine! + file.numLines! - 1,
      ),
    });
    const parts = lineParts(contents);
    const start = file.startLine! - 1;
    const end = Math.min(parts.length, start + file.numLines!);
    if (
      start >= 0 &&
      start <= parts.length &&
      file.numLines! >= 0 &&
      start + file.numLines! <= contents.split("\n").length &&
      [parts.length, contents.split("\n").length].includes(file.totalLines!) &&
      typeof file.content === "string" &&
      file.content.replace(/\n$/, "") ===
        parts.slice(start, end).join("").replace(/\n$/, "")
    )
      admitReadBytes(
        session,
        path,
        bytes,
        Buffer.byteLength(parts.slice(0, start).join("")),
        Buffer.byteLength(parts.slice(0, end).join("")),
      );
  }
  const request =
    input.tool_name === "Bash" ? outputReadCommand(args.command) : null;
  if (request && typeof input.tool_response?.stdout === "string") {
    const expected = readHarnessOutput(
      root,
      request.path,
      request.offset,
      request.length,
    );
    let delivered: unknown;
    try {
      delivered = JSON.parse(input.tool_response.stdout);
    } catch {
      throw new Error("Output read delivery is truncated or unavailable");
    }
    if (
      !delivered ||
      typeof delivered !== "object" ||
      Object.keys(delivered).length !== Object.keys(expected).length ||
      Object.entries(expected).some(
        ([key, value]) => (delivered as Record<string, unknown>)[key] !== value,
      )
    )
      throw new Error("Output read delivery differs from current bytes");
    const bytes = readFileSync(contained(root, expected.path));
    if (feedbackContentHash(bytes) !== expected.hash)
      throw new Error("Output changed during read observation");
    const linesBefore = (end: number) =>
      physicalLines(bytes.subarray(0, end).toString("utf8")) +
      (end > 0 && bytes[end - 1] === 10 ? 1 : 0);
    paths.push({
      path: expected.path,
      startLine: expected.offset === 0 ? 1 : linesBefore(expected.offset),
      endLine:
        expected.nextOffset === 0
          ? 0
          : physicalLines(
              bytes.subarray(0, expected.nextOffset).toString("utf8"),
            ),
    });
    admitReadBytes(
      session,
      expected.path,
      bytes,
      expected.offset,
      expected.nextOffset,
    );
  }
  if (
    input.tool_name === "Skill" &&
    typeof args.skill === "string" &&
    /^dotln-[a-z-]+$/.test(args.skill)
  ) {
    const path = `.claude/skills/${args.skill}/SKILL.md`;
    paths.push({
      path,
      startLine: 1,
      endLine: physicalLines(readFileSync(contained(root, path), "utf8")),
    });
  }
  return paths;
}
/** Optional trusted smoke input bounds shell routes and observes or enforces Read ranges. */
function readScopeRefusal(
  input: HarnessInput,
  root: string,
  scope: HarnessReadScope,
): { reason: string; attemptedRead?: ReadRange } | null {
  const args = input.tool_input ?? {};
  if (input.tool_name === "Skill")
    return args.skill === scope.skill ? null : { reason: "undeclared skill" };
  if (input.tool_name === "Bash")
    return typeof args.command === "string" &&
      args.command
        .split(/\s*(?:&&|\n)\s*/)
        .every((command) => scope.commands.includes(command.trim()))
      ? null
      : { reason: "unobserved shell read/effect route" };
  if (input.tool_name !== "Read" || typeof args.file_path !== "string")
    return { reason: "unobserved model tool route" };
  let absolute: string;
  try {
    absolute = contained(root, args.file_path);
  } catch {
    return {
      reason: "unobserved read path",
      attemptedRead: {
        path: "<outside-worktree>",
        startLine: 1,
        endLine: Number.MAX_SAFE_INTEGER,
      },
    };
  }
  const path = relative(root, absolute);
  const total = existsSync(absolute)
    ? physicalLines(readFileSync(absolute, "utf8"))
    : 0;
  const start = args.offset === undefined ? 1 : Number(args.offset);
  const end =
    args.limit === undefined
      ? total
      : Math.min(total, start + Number(args.limit) - 1);
  if (
    !Number.isInteger(start) ||
    !Number.isInteger(end) ||
    start < 1 ||
    end < start
  )
    return {
      reason: "unobserved read range",
      attemptedRead: { path, startLine: start, endLine: end },
    };
  return scope.reads.some(
    (entry) =>
      entry.path === path && entry.startLine <= start && entry.endLine >= end,
  )
    ? null
    : {
        reason: "read outside the mechanically directed set",
        attemptedRead: { path, startLine: start, endLine: end },
      };
}

/** A refusal names this many missing outputs; the next refusal names the next ones. */
const namedOutputLimit = 12;
function feedbackRefusalReason(
  error: FeedbackRefused,
  facts: readonly FeedbackBoundaryRequest[],
  root: string,
): string {
  const writer = facts.find((fact) => fact.kind === "writer-isolation");
  if (writer && writer.kind === "writer-isolation" && writer.writable) {
    const holder = writer.writers.find(
      (entry) => entry.actorId !== writer.actorId,
    );
    if (holder) {
      const view = harnessWriterView(root);
      const owner =
        view.reserved && view.owner
          ? `host process ${view.owner.pid}${view.owner.startedAt ? ` started ${view.owner.startedAt}` : ""} is ${view.alive === true ? "alive" : view.alive === false ? "not alive" : "of unknown liveness"}`
          : "its host process is not recorded";
      return `${error.message}; the worktree is reserved by another session (actor ${holder.actorId.slice(0, 12)}; ${owner}). Finish that session, inspect with node scripts/harness.mjs writer --show, or release from an operator terminal with node scripts/harness.mjs writer --release.`;
    }
  }
  const review = facts.find((fact) => fact.kind === "output-review");
  if (!review || review.kind !== "output-review") return error.message;
  // Diagnostics only; feedbackBoundary owns the allow/refuse decision.
  const missing = review.outputs
    .filter(
      (output) =>
        !review.reads.some(
          (read) =>
            read.path === output.path &&
            read.hash === output.hash &&
            read.evidenceRef.trim().length > 0,
        ),
    )
    .map((output) => output.path);
  return (
    error.message +
    "; " +
    missing.length +
    " of " +
    review.outputs.length +
    " outputs missing current-byte reads: " +
    JSON.stringify(missing.slice(0, namedOutputLimit)) +
    (missing.length > namedOutputLimit
      ? ` and ${missing.length - namedOutputLimit} more`
      : "") +
    ". Read all ranges of each file. For oversized lines, run node scripts/harness.mjs read-output <path> --offset 0 --length 8192 and continue at nextOffset until totalBytes."
  );
}
function permissionEffect(input: HarnessInput, root: string): string {
  const args = input.tool_input ?? {};
  const path = typeof args.file_path === "string" ? args.file_path : "";
  if (path) {
    if (/(?:^|[\\/])\.ssh(?:[\\/]|$)|(?:^|[\\/])\.env(?:\.|$)/.test(path))
      return "credentials.access";
    if (
      path.startsWith("~") ||
      (isAbsolute(path) && !path.startsWith(`${root}${sep}`))
    )
      return "settings.user";
    const local = relative(root, contained(root, path));
    if (local.startsWith("docs/control/local/harness/")) return "settings.user";
  }
  if (input.tool_name !== "Bash")
    return ["Edit", "Write"].includes(input.tool_name ?? "")
      ? "repo.write"
      : "repo.read";
  const command = typeof args.command === "string" ? args.command : "";
  const outputRead = outputReadCommand(command);
  if (outputRead)
    return permissionEffect(
      {
        ...input,
        tool_name: "Read",
        tool_input: { file_path: outputRead.path },
      },
      root,
    );
  if (metadataCommand(command)) return "repo.read";
  if (/(?:^|[;&|]\s*)cd\s|\bgit\s+(?:-C|--git-dir|--work-tree)\b/.test(command))
    throw new Error(
      "Shell working-directory override needs a separately reviewed host adapter",
    );
  if (/(?:^|[\s;&|])(ssh|scp|sftp)(?:\s|$)/.test(command))
    return "transport.ssh";
  if (/\b(?:npm|pnpm|yarn)\s+publish\b/.test(command)) return "package.publish";
  if (
    /--dangerously-(?:skip|bypass)|bypassPermissions|danger-full-access|sandbox\.enabled\s*[:=]\s*false/.test(
      command,
    )
  )
    return "sandbox.disable";
  if (/\.ssh(?:[\/\s]|$)|\.env(?:[\s.]|$)/.test(command))
    return "credentials.access";
  if (
    /docs\/control\/local\/harness|~\/\.(?:claude|codex|agents)/.test(command)
  )
    return "settings.user";
  if (
    /\bgit\s+push\b|\bgh\s+(?:pr|release|repo)\s+(?:create|merge|edit|delete)/.test(
      command,
    )
  )
    return "remote.unapproved";
  if (
    /\b(?:npm run resume|node scripts\/resume\.mjs|npm run worktree|npm run release)\b/.test(
      command,
    )
  )
    return "lifecycle.run";
  return "shell.run";
}
/**
 * A refused Stop is reported once. Claude then re-enters Stop with
 * `stop_hook_active`; refusing again would loop until the operator interrupts,
 * so the unmet obligation is recorded, never as a finish, and the turn ends.
 * The lifecycle script remains the ground truth for every completion claim.
 */
const stopReentry = (input: HarnessInput) =>
  input.hook_event_name === "Stop" && input.stop_hook_active === true;
const protocolRefusal = (event: HarnessEvent, reason: string) =>
  event === "PreToolUse"
    ? {
        hookSpecificOutput: {
          hookEventName: event,
          permissionDecision: "deny",
          permissionDecisionReason: reason,
        },
      }
    : { decision: "block", reason };

function assertHarnessRuntime(
  config: Pick<HookConfig, "compilerPackageVersion" | "runtime">,
  root: string,
): void {
  if (
    config.compilerPackageVersion !== COMPILER_PACKAGE_VERSION ||
    config.runtime.skeletonVersion !== HARNESS_HOST_VERSION ||
    config.runtime.boundaryContract !== "feedback-v1"
  )
    throw new Error(
      "Pinned harness runtime unavailable; build the reviewed source",
    );
  if (
    !config.runtime.files?.length ||
    config.runtime.files.some(
      (file) =>
        `fnv1a64:${fnv1a64(readFileSync(contained(root, file.path), "utf8"))}` !==
        file.hash,
    )
  )
    throw new Error("Pinned harness runtime bytes differ");
}
export async function evaluateHarnessHook(
  config: HookConfig,
  input: HarnessInput,
  root: string,
  boundary: typeof feedbackBoundary,
): Promise<Record<string, unknown>> {
  assertHarnessRuntime(config, root);
  if (input.hook_event_name !== config.event || !input.session_id)
    throw new Error("Hook input contract mismatch");
  const session = readJson(statePath(root, input), initialSession());
  const correctionPath = join(
    harnessStateDirectory(root),
    `${sessionKey(input)}.correction.json`,
  );
  const correction = readJson<CorrectionState | null>(correctionPath, null);
  if (correction) session.correction = correction;
  else delete session.correction;
  const scope = readJson<HarnessReadScope | null>(
    join(harnessStateDirectory(root), "read-scope.json"),
    null,
  );
  const journal = join(
    harnessStateDirectory(root),
    `${sessionKey(input)}.jsonl`,
  );
  if (existsSync(journal)) {
    const observations = readFileSync(journal, "utf8")
      .split("\n")
      .filter(Boolean)
      .map(
        (line) =>
          JSON.parse(line) as {
            receipts?: HarnessSession["reads"];
            byteReads?: HarnessByteRead[];
          },
      );
    session.reads = observations.flatMap((row) => row.receipts ?? []);
    session.byteReads = observations.flatMap((row) => row.byteReads ?? []);
  }
  if (config.kind === "session") {
    let additionalContext: string | undefined;
    const intent = input.prompt?.trim() ?? "";
    const role = config.roles?.find(
      (role) =>
        role.intents.includes(intent) ||
        role.intents.some(
          (prefix) =>
            ["planning:", "ideation:"].includes(prefix) &&
            intent.startsWith(prefix),
        ),
    );
    if (role) {
      const auxiliary =
        role.name === "planner" ||
        ["resume: status", "resume: times"].includes(intent);
      const control = auxiliary
        ? { workOrder: null, workOrderPath: null, phase: "none" }
        : harnessControl(root);
      additionalContext = `DotLn resolved role ${role.name}. Load the dotln-${role.name} skill.${control.workOrderPath ? ` Read the selected work order ${control.workOrderPath} before interpreting the phase, including a closed phase.` : " Follow its requested observation or planning/ideation procedure."} A skill grants no authority.`;
      const expected: Record<string, string> = {
        "resume: next": "ImplementationReady",
        "resume: fix": "RepairCompleted",
        "resume: verify": "VerificationCompleted",
        "resume: final review": "FinalReviewCompleted",
      };
      if (!auxiliary || !session.role) {
        session.role = role.name;
        session.intent = intent;
        session.startingEventCount = localEvents(
          root,
          control.workOrder,
        ).length;
        session.startingRevision = git(root, ["rev-parse", "HEAD"]).trim();
        if (expected[intent] && control.phase !== "closed")
          session.expectedEvent = expected[intent]!;
        else delete session.expectedEvent;
      }
      const path = config.instructionFile ?? "CLAUDE.md";
      record(root, input, {
        role: role.name,
        reads: [
          {
            path,
            startLine: 1,
            endLine: physicalLines(readFileSync(contained(root, path), "utf8")),
          },
        ],
        source: "instruction-autoload",
      });
    }
    writeJson(statePath(root, input), session);
    return additionalContext
      ? {
          hookSpecificOutput: {
            hookEventName: "UserPromptSubmit",
            additionalContext,
          },
        }
      : {};
  }
  if (config.kind === "observe") {
    const before = session.reads.length;
    const rangesBefore = session.byteReads?.length ?? 0;
    const paths = observeRead(input, root, session);
    const outside = scope
      ? paths.filter(
          (read) =>
            !scope.reads.some(
              (entry) =>
                entry.path === read.path &&
                entry.startLine <= read.startLine &&
                entry.endLine >= read.endLine,
            ),
        )
      : [];
    record(root, input, {
      reads: paths,
      receipts: session.reads.slice(before),
      byteReads: session.byteReads?.slice(rangesBefore) ?? [],
      ...(outside.length ? { outsideDirectedSet: outside } : {}),
    });
    if (outside.length && scope?.mode !== "observe")
      return protocolRefusal(
        config.event,
        "DOTLN_HARNESS_REFUSED: observed read outside the directed set",
      );
    return {};
  }
  if (config.kind === "finish") {
    if (!config.policy) throw new Error("Missing compiled finish policy");
    let currentFacts: readonly FeedbackBoundaryRequest[] = [];
    try {
      for (const unit of config.policy.units) {
        const policy = compileFeedbackUnits([unit]);
        currentFacts = harnessFeedbackFacts(policy, input, root, session);
        for (const fact of currentFacts) boundary(policy, fact, () => {});
      }
      releaseHarnessWriter(root, input);
      record(root, input, { finished: true });
      return {};
    } catch (error) {
      if (!(error instanceof FeedbackRefused)) throw error;
      if (stopReentry(input)) {
        record(root, input, { finished: false, stopReentry: true });
        return {};
      }
      record(root, input, { finished: false });
      return protocolRefusal(
        config.event,
        `DOTLN_HARNESS_REFUSED: ${feedbackRefusalReason(error, currentFacts, root)}`,
      );
    }
  }
  if (config.kind === "permission") {
    if (!config.envelope) throw new Error("Missing compiled authority");
    const scopeResult = scope ? readScopeRefusal(input, root, scope) : null;
    const observedOnly =
      scope?.mode === "observe" &&
      scopeResult?.reason === "read outside the mechanically directed set";
    if (scopeResult) {
      record(root, input, {
        allowed: observedOnly,
        ...(observedOnly
          ? { readScopeObservation: scopeResult.reason }
          : { readScopeRefusal: scopeResult.reason }),
        ...(scopeResult.attemptedRead
          ? { attemptedRead: scopeResult.attemptedRead }
          : {}),
      });
    }
    if (scopeResult && !observedOnly) {
      return protocolRefusal(
        config.event,
        `DOTLN_HARNESS_REFUSED: ${scopeResult.reason}`,
      );
    }
    const effect = managedReleaseCommand(input, root, session)
      ? "lifecycle.run"
      : permissionEffect(input, root);
    const decision = harnessAuthorization(
      session.correction
        ? {
            ...config.envelope,
            allowedEffects: config.envelope.allowedEffects.filter((effect) =>
              session.correction!.allowedEffects.includes(effect),
            ),
          }
        : config.envelope,
      effect,
      Date.now(),
    );
    record(root, input, { effect, allowed: decision.authorized });
    return decision.authorized
      ? {}
      : protocolRefusal(
          config.event,
          "DOTLN_HARNESS_REFUSED: compiled authority does not permit this effect",
        );
  }
  if (!config.policy) throw new Error("Missing compiled unit");
  if (
    config.policy.units[0]?.trigger === "semantic-correction" &&
    config.correctionToken &&
    input.prompt?.startsWith(config.correctionToken)
  ) {
    session.correction = applyFeedbackCorrection(
      config.policy,
      session.correction ?? {
        allowedEffects: [...(config.envelope?.allowedEffects ?? [])],
        destructiveEffects: [
          "repo.write",
          "repo.delete",
          "shell.run",
          "git.local",
          "lifecycle.run",
        ],
        scopeExpansionAllowed: true,
        preserveEvidence: false,
        diagnosisRequired: false,
        corrections: [],
      },
      {
        type: "OperatorCorrectionReceived",
        eventId: `correction:${session.correction?.corrections.length ?? 0}`,
      },
    );
    writeJson(correctionPath, session.correction);
    record(root, input, {
      typedEvent: "OperatorCorrectionReceived",
      correction: session.correction,
    });
    return {
      hookSpecificOutput: {
        hookEventName: "UserPromptSubmit",
        additionalContext: `Compiled typed-correction response: ${JSON.stringify({ allowedEffects: session.correction.allowedEffects, scopeExpansionAllowed: session.correction.scopeExpansionAllowed, preserveEvidence: session.correction.preserveEvidence, diagnosisRequired: session.correction.diagnosisRequired })}`,
      },
    };
  }
  const facts = harnessFeedbackFacts(config.policy, input, root, session);
  try {
    for (const fact of facts) boundary(config.policy, fact, () => {});
    record(root, input, {
      unitIds: config.policy.units.map((unit) => unit.unitId),
      allowed: true,
      factKinds: facts.map((fact) => fact.kind),
    });
    return {};
  } catch (error) {
    if (!(error instanceof FeedbackRefused)) throw error;
    const reentry = stopReentry(input);
    record(root, input, {
      unitIds: config.policy.units.map((unit) => unit.unitId),
      allowed: false,
      factKinds: facts.map((fact) => fact.kind),
      ...(reentry ? { stopReentry: true } : {}),
    });
    if (reentry) return {};
    return protocolRefusal(
      config.event,
      `DOTLN_HARNESS_REFUSED: ${feedbackRefusalReason(error, facts, root)}`,
    );
  }
}

export async function runHarnessHook(
  config: HookConfig,
  boundary: typeof feedbackBoundary,
): Promise<void> {
  try {
    const input = JSON.parse(readFileSync(0, "utf8")) as HarnessInput;
    const root = harnessRoot(input.cwd);
    const installedRoot = realpathSync(
      fileURLToPath(new URL("../../../../", import.meta.url)),
    );
    if (installedRoot !== root)
      throw new Error("Hook and worktree roots disagree");
    process.stdout.write(
      JSON.stringify(await evaluateHarnessHook(config, input, root, boundary)),
    );
  } catch {
    process.stdout.write(
      JSON.stringify(
        protocolRefusal(
          config.event,
          "DOTLN_HARNESS_REFUSED: host facts or pinned runtime unavailable",
        ),
      ),
    );
  }
}
export async function runCommitMessageHook(
  config: Pick<HookConfig, "compilerPackageVersion" | "runtime"> & {
    readonly policy: CompiledFeedback;
  },
  boundary: typeof feedbackBoundary,
): Promise<void> {
  try {
    assertHarnessRuntime(config, harnessRoot(process.cwd()));
    if (process.argv.length !== 3)
      throw new Error("Missing commit message path");
    boundary(
      config.policy,
      { kind: "attribution", message: readFileSync(process.argv[2]!, "utf8") },
      () => {},
    );
  } catch {
    process.stderr.write("DOTLN_HARNESS_REFUSED: commit-message boundary\n");
    process.exitCode = 1;
  }
}
/** Release only this session's reservation, after the host has observed completion. */
export function releaseHarnessWriter(root: string, input: HarnessInput): void {
  const actorId = sessionKey(input);
  const legacy = readJson<HarnessWriter | null>(legacyWriterLock(root), null);
  if (legacy?.actorId === actorId) {
    rmSync(legacyWriterLock(root), { force: true });
    appendWriterEvent(root, {
      event: "released",
      actorId,
      ...ownerFields(legacy.owner),
    });
  }
  const observation = observeWriterLock(root);
  if (observation.state !== "held") return;
  const { instance } = observation;
  if (
    instance.writer.actorId !== actorId ||
    !retireWriterInstance(root, instance)
  )
    return;
  appendWriterEvent(root, {
    event: "released",
    actorId,
    ...ownerFields(instance.writer.owner),
  });
}
/**
 * Operator-facing release from outside a governed session. The liveness
 * decision, the retirement and the recorded event describe one observed
 * reservation. A holder that changes after the decision is judged again by
 * the same rule; a forced release of a holder that changed refuses, because
 * the operator judged a different one. A live owner refuses without force.
 */
export function releaseHarnessWriterByOperator(root: string, force = false) {
  for (let attempt = 0; attempt < 16; attempt++) {
    const { observation, writer } = observeWriterHolder(root);
    if (!writer)
      return {
        contract: "harness-writer-v1" as const,
        reserved: false as const,
        released: false,
      };
    const view = writerView(writer);
    if (view.alive === true && !force)
      throw new Error(
        "Writer reservation owner is alive; end that session or pass --force",
      );
    const retired =
      observation.state === "held"
        ? retireWriterInstance(root, observation.instance)
        : unlinkIfPresent(legacyWriterLock(root));
    if (!retired) {
      if (force)
        throw new Error(
          "Writer reservation changed while releasing; inspect it again before forcing",
        );
      continue;
    }
    appendWriterEvent(root, {
      event: "operator-released",
      actorId: view.actorId,
      ...ownerFields(view.owner),
      alive: view.alive,
      forced: force,
    });
    return { ...view, released: true };
  }
  throw new Error("Writer reservation release exceeded its retry budget");
}
