import {
  closeSync,
  fsyncSync,
  linkSync,
  lstatSync,
  mkdirSync,
  openSync,
  readFileSync,
  readdirSync,
  readlinkSync,
  rmSync,
  symlinkSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { join, resolve } from "node:path";
import { createHash, randomUUID } from "node:crypto";
import { decodeLog, type Event } from "@dotln/kernel";
import {
  assertVerificationTask,
  canonicalStringify,
  type VerificationTask,
} from "@dotln/compiler";
import type { PlanRefutationRequest } from "./plan-refutation-protocol.js";
import type { WriterRequest } from "./worker-protocol.js";
import {
  decodeSourceObservation,
  sameSourceValue,
  type SourceChangeObserved,
} from "./source-change-state.js";
import {
  parseTransportResult,
  parseEvidenceResult,
  type TransportRequest,
  type TransportResultFor,
} from "./verification-protocol.js";

type StoredRequest = Exclude<TransportRequest, PlanRefutationRequest>;

const object = (value: unknown): Record<string, unknown> => {
  if (value === null || typeof value !== "object" || Array.isArray(value))
    throw new Error("expected object");
  return value as Record<string, unknown>;
};
// Unlike existsSync, this also observes dangling symlinks for refusal.
const present = (path: string): boolean =>
  lstatSync(path, { throwIfNoEntry: false }) !== undefined;
function exact(value: Record<string, unknown>, keys: readonly string[]): void {
  if (Object.keys(value).sort().join(",") !== [...keys].sort().join(","))
    throw new Error(`expected exactly ${keys.join(", ")}`);
}
class StorePathError extends Error {}
function atPath<T>(path: string, shape: string, decode: () => T): T {
  try {
    return decode();
  } catch (error) {
    if (error instanceof StorePathError) throw error;
    throw new StorePathError(
      `${path}: invalid ${shape}: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}
function commandKey(value: unknown): asserts value is string {
  if (typeof value !== "string" || !/^cmd_[a-zA-Z0-9_-]+$/u.test(value))
    throw new Error("expected canonical command key");
}
function decodeReceipt(value: unknown) {
  const receipt = object(value);
  exact(receipt, ["requestKey", "result"]);
  if (
    typeof receipt.requestKey !== "string" ||
    !/^[a-f0-9]{64}$/u.test(receipt.requestKey)
  )
    throw new Error("expected canonical request key (lowercase SHA-256)");
  const result = object(receipt.result);
  const envelope = object(result.envelope);
  exact(envelope, [
    "workOrderId",
    "episodeId",
    "status",
    "resultId",
    "summary",
    "requiresHuman",
    ...("observedDenials" in envelope ? ["observedDenials"] : []),
    ...("observedCommit" in envelope ? ["observedCommit"] : []),
  ]);
  if (
    typeof envelope.episodeId !== "string" ||
    !/^[a-zA-Z0-9_-]+$/u.test(envelope.episodeId)
  )
    throw new Error("expected producing episode id");
  if (envelope.status !== "completed")
    throw new Error("expected completed result");
  return {
    requestKey: receipt.requestKey,
    result,
    episodeId: envelope.episodeId,
  };
}

function regularFile(path: string): void {
  if (!lstatSync(path).isFile() || lstatSync(path).isSymbolicLink())
    throw new Error(`${path}: worker store requires regular files`);
}
function durableWrite(path: string, contents: string): void {
  const fd = openSync(path, "wx", 0o600);
  try {
    writeFileSync(fd, contents);
    fsyncSync(fd);
  } finally {
    closeSync(fd);
  }
}
function syncDirectory(path: string): void {
  const fd = openSync(path, "r");
  try {
    fsyncSync(fd);
  } finally {
    closeSync(fd);
  }
}

const ownerToken = /^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/u;
type GuardOwner = { pid: number; token: string };
function readGuardOwner(path: string): GuardOwner {
  return atPath(path, "guard owner", () => {
    regularFile(path);
    const owner = object(JSON.parse(readFileSync(path, "utf8")));
    exact(owner, ["pid", "token"]);
    if (
      !Number.isSafeInteger(owner.pid) ||
      Number(owner.pid) <= 0 ||
      typeof owner.token !== "string" ||
      !ownerToken.test(owner.token)
    )
      throw new Error("invalid guard owner");
    return owner as GuardOwner;
  });
}
function dead(pid: number): boolean {
  try {
    process.kill(pid, 0);
    return false;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ESRCH") return true;
    throw error;
  }
}

/** The canonical link only ever exposes a complete owner directory. Immutable
 * successor claims serialize recovery without introducing another stale mutex.
 * All claim paths use the unique target, never the reusable canonical name. */
function acquireGuard(directory: string) {
  const guard = join(directory, "host-lock-recovery");
  const refuse = () =>
    new Error(
      `${guard}: host lock recovery is busy or interrupted; inspect before recovery`,
    );
  const token = randomUUID();
  const preparedName = `.host-lock-${token}`;
  const prepared = join(directory, preparedName);
  let targetName = preparedName;
  let target = prepared;
  let claim: string | undefined;
  let held = false;
  let preparedCreated = false;
  try {
    mkdirSync(prepared, { mode: 0o700 });
    preparedCreated = true;
    const ownerPath = join(prepared, "owner.json");
    durableWrite(ownerPath, JSON.stringify({ pid: process.pid, token }) + "\n");
    syncDirectory(prepared);
    try {
      // Exclusive even when an older version left an empty guard directory.
      symlinkSync(preparedName, guard, "dir");
      held = true;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "EEXIST") throw error;
      if (!lstatSync(guard).isSymbolicLink()) throw refuse();
      targetName = readlinkSync(guard);
      const initialToken = targetName.slice(".host-lock-".length);
      if (
        !targetName.startsWith(".host-lock-") ||
        !ownerToken.test(initialToken)
      )
        throw refuse();
      target = join(directory, targetName);
      if (!lstatSync(target).isDirectory()) throw refuse();
      let owner = readGuardOwner(join(target, "owner.json"));
      if (owner.token !== initialToken) throw refuse();
      const seen = new Set<string>();
      for (;;) {
        if (seen.has(owner.token) || !dead(owner.pid)) throw refuse();
        seen.add(owner.token);
        const next = join(target, `next-${owner.token}.json`);
        if (present(next)) {
          owner = readGuardOwner(next);
          continue;
        }
        // Only one contender can extend this exact dead owner's chain.
        linkSync(ownerPath, next);
        claim = next;
        // A retired target can outlive its canonical link. Never act on a
        // successor guard after claiming an orphaned old target.
        if (readlinkSync(guard) !== targetName) throw refuse();
        held = true;
        break;
      }
    }
    syncDirectory(directory);
    return {
      prepared,
      release(inspected: boolean) {
        if (!claim || inspected) {
          // A live terminal owner cannot be superseded. Retire atomically,
          // before private cleanup, so cleanup kills cannot strand the guard.
          if (readlinkSync(guard) !== targetName) throw refuse();
          unlinkSync(guard);
          rmSync(target, { recursive: true, force: true });
        } else {
          // Failed inspection preserves the abandoned guard and its evidence.
          unlinkSync(claim);
        }
        if (prepared !== target)
          rmSync(prepared, { recursive: true, force: true });
      },
    };
  } catch {
    if (claim) rmSync(claim, { force: true });
    if (held && !claim) unlinkSync(guard);
    if (preparedCreated) rmSync(prepared, { recursive: true, force: true });
    throw refuse();
  }
}
export function workerRequestKey(request: TransportRequest): string {
  // Every request field participates: kind, WorkOrder, command, artifact,
  // environment, model/effort, profile, mounts, authority and host message path.
  // Only the physical attempt's episodeId is omitted for every request kind.
  const { episodeId: _attempt, ...stable } = request;
  return createHash("sha256").update(canonicalStringify(stable)).digest("hex");
}

/** A single host holds the lock; status only reads the canonical JSONL file. */
export class WorkerStore {
  readonly directory: string;
  readonly logPath: string;
  #locked = false;
  #preflightReads: Set<string> | undefined;
  constructor(directory: string) {
    this.directory = resolve(directory);
    this.logPath = join(this.directory, "events.jsonl");
  }
  read(): string {
    if (!present(this.logPath)) return "";
    regularFile(this.logPath);
    return atPath(this.logPath, "event log", () => {
      const log = readFileSync(this.logPath, "utf8");
      decodeLog(log); // Torn or malformed appends refuse; never silently truncate.
      return log;
    });
  }
  /** Inspect every stored artifact before reclaiming a lock. Contextual callers
   * additionally load their receipts here, while the acquisition guard is held. */
  acquire(preflight?: () => void): void {
    mkdirSync(this.directory, { recursive: true, mode: 0o700 });
    if (lstatSync(this.directory).isSymbolicLink())
      throw new Error("worker store may not be a symlink");
    const guard = acquireGuard(this.directory);
    let inspected = false;
    try {
      const lock = join(this.directory, "host.lock");
      // Exclude a current writer before inspecting its mutable log. The guard
      // prevents any new writer from arriving after this dead/absent check.
      const abandonedLock = present(lock);
      if (abandonedLock) {
        regularFile(lock);
        const owner = atPath(lock, "host lock", () => {
          const value = object(JSON.parse(readFileSync(lock, "utf8")));
          exact(value, ["pid"]);
          if (!Number.isSafeInteger(value.pid) || Number(value.pid) <= 0)
            throw new Error(
              "expected positive safe integer pid; inspect before recovery",
            );
          return { pid: value.pid as number };
        });
        try {
          process.kill(owner.pid, 0);
          throw new Error("worker store already has a live host");
        } catch (error) {
          if ((error as NodeJS.ErrnoException).code !== "ESRCH") throw error;
        }
      }
      const receiptPaths: string[] = [];
      const events = decodeLog(this.read());
      const commands = new Map<
        string,
        { command: StoredRequest["command"]; capsule?: VerificationTask }
      >();
      for (const event of events) {
        if (
          [
            "WorkerAttemptStarted",
            "WorkerHeartbeat",
            "WorkerLeaseExpired",
          ].includes(event.type)
        )
          atPath(
            `${this.logPath}#${event.eventId}.payload`,
            "worker lease",
            () => {
              const payload = object(event.payload);
              commandKey(payload.commandId);
              if (
                typeof payload.workerEpisodeId !== "string" ||
                !/^[a-zA-Z0-9_-]+$/u.test(payload.workerEpisodeId) ||
                typeof payload.leaseExpiresAt !== "number" ||
                !Number.isFinite(payload.leaseExpiresAt)
              )
                throw new Error(
                  "expected worker episode and finite lease expiry",
                );
              if (event.type === "WorkerAttemptStarted")
                for (const key of ["model", "effort", "transport", "mode"])
                  if (typeof payload[key] !== "string" || !payload[key])
                    throw new Error(`expected ${key}`);
            },
          );
        if (event.type !== "CommandPersisted") continue;
        atPath(
          `${this.logPath}#${event.eventId}.payload.command`,
          "stored command/capsule",
          () => {
            const command = object(object(event.payload).command);
            commandKey(command.commandId);
            const intent = object(command.intent);
            const payload = object(intent.payload);
            const evidence = [
              "verification.evaluate",
              "repair.propose",
            ].includes(String(intent.effect));
            let capsule: VerificationTask | undefined;
            if (evidence || Object.hasOwn(payload, "capsule")) {
              capsule = object(payload.capsule) as unknown as VerificationTask;
              assertVerificationTask(capsule);
            }
            commands.set(command.commandId, {
              command: command as unknown as StoredRequest["command"],
              ...(capsule ? { capsule } : {}),
            });
          },
        );
      }
      for (const name of readdirSync(this.directory).sort()) {
        const path = join(this.directory, name);
        if (name.endsWith(".pending"))
          throw new Error(
            `${path}: unpublished pending result; inspect before recovery`,
          );
        if (name.endsWith(".source-change.json")) {
          atPath(path, "source-change effect receipt", () => {
            const key = name.slice(0, -".source-change.json".length);
            commandKey(key);
            regularFile(path);
            const receipt = object(JSON.parse(readFileSync(path, "utf8")));
            exact(receipt, ["requestKey", "observation"]);
            if (
              typeof receipt.requestKey !== "string" ||
              !/^[a-f0-9]{64}$/u.test(receipt.requestKey)
            )
              throw new Error("expected canonical request key");
            decodeSourceObservation(receipt.observation);
            if (!commands.has(key))
              throw new Error("receipt has no persisted command");
            receiptPaths.push(path);
          });
          continue;
        }
        if (!name.endsWith(".result.json")) continue;
        atPath(path, "saved result receipt", () => {
          const key = name.slice(0, -".result.json".length);
          commandKey(key);
          regularFile(path);
          const receipt = decodeReceipt(JSON.parse(readFileSync(path, "utf8")));
          const stored = commands.get(key);
          if (!stored) throw new Error("receipt has no persisted command");
          if (stored.capsule)
            parseEvidenceResult(receipt.result, {
              command: stored.command,
              capsule: stored.capsule,
              workOrder: stored.capsule.workOrder,
              episodeId: receipt.episodeId,
            });
          receiptPaths.push(path);
        });
      }
      this.#preflightReads = new Set();
      if (preflight) atPath(this.logPath, "recovery state", preflight);
      for (const path of receiptPaths)
        if (!this.#preflightReads.has(path))
          throw new Error(
            `${path}: saved result receipt requires original request context before recovery`,
          );
      inspected = true;
      // Publish a complete owner even if killed between any two calls here.
      durableWrite(
        join(guard.prepared, "host.lock"),
        JSON.stringify({ pid: process.pid }) + "\n",
      );
      if (abandonedLock) unlinkSync(lock);
      linkSync(join(guard.prepared, "host.lock"), lock);
      this.#locked = true;
      if (!present(this.logPath)) durableWrite(this.logPath, "");
      syncDirectory(this.directory);
    } finally {
      this.#preflightReads = undefined;
      guard.release(inspected);
    }
  }
  release(): void {
    if (this.#locked) {
      unlinkSync(join(this.directory, "host.lock"));
      this.#locked = false;
    }
  }
  append = (event: Event): void => {
    if (!this.#locked)
      throw new Error("worker store writer lacks its host lock");
    const events = decodeLog(this.read());
    if (event.eventId !== `evt_${events.length + 1}`)
      throw new Error("worker store append order conflict");
    const fd = openSync(this.logPath, "a");
    try {
      writeFileSync(fd, JSON.stringify(event) + "\n");
      fsyncSync(fd);
    } finally {
      closeSync(fd);
    }
  };
  saveResult<R extends StoredRequest>(
    request: R,
    result: TransportResultFor<R>,
  ): void {
    if (!this.#locked) throw new Error("result writer lacks its host lock");
    const validated = parseTransportResult(result, request);
    const existing = this.loadResult(request);
    if (existing) return;
    const path = this.resultPath(request);
    const staging = `${path}.pending`;
    // Preserve unpublished bytes for inspection, even if they look successful.
    if (present(staging))
      throw new Error(
        `${staging}: unpublished pending result; inspect before recovery`,
      );
    durableWrite(
      staging,
      JSON.stringify({
        requestKey: workerRequestKey(request),
        result: validated,
      }) + "\n",
    );
    try {
      linkSync(staging, path);
      syncDirectory(this.directory);
    } finally {
      unlinkSync(staging);
    }
  }
  loadResult<R extends StoredRequest>(
    request: R,
  ): TransportResultFor<R> | undefined {
    const path = this.resultPath(request);
    const staging = `${path}.pending`;
    if (present(staging))
      throw new Error(
        `${staging}: unpublished pending result; inspect before recovery`,
      );
    if (!present(path)) return undefined;
    return atPath(path, "saved result receipt", () => {
      regularFile(path);
      const cached = decodeReceipt(JSON.parse(readFileSync(path, "utf8")));
      if (cached.requestKey !== workerRequestKey(request))
        throw new Error("cached worker result belongs to a different request");
      // Keep the validated producing episode across a fresh recovery attempt.
      const result = parseTransportResult(cached.result, {
        ...request,
        episodeId: cached.episodeId,
      });
      this.#preflightReads?.add(path);
      return result;
    });
  }
  private resultPath(request: TransportRequest): string {
    commandKey(request.command.commandId);
    return join(this.directory, `${request.command.commandId}.result.json`);
  }

  /** A Git observation is an effect receipt, never a fabricated worker result. */
  saveSourceChangeReceipt(
    request: WriterRequest,
    observation: SourceChangeObserved,
  ): void {
    if (!this.#locked)
      throw new Error("effect receipt writer lacks its host lock");
    decodeSourceObservation(observation);
    if (
      observation.workOrderId !== request.workOrder.workOrderId ||
      observation.testBefore.command !== request.testCommand
    )
      throw new Error("source-change receipt request mismatch");
    const existing = this.loadSourceChangeReceipt(request);
    if (existing) {
      if (!sameSourceValue(existing, observation))
        throw new Error("source-change effect receipt is immutable");
      return;
    }
    const path = this.sourceChangePath(request);
    const staging = `${path}.pending`;
    durableWrite(
      staging,
      JSON.stringify({ requestKey: workerRequestKey(request), observation }) +
        "\n",
    );
    try {
      linkSync(staging, path);
      syncDirectory(this.directory);
    } finally {
      unlinkSync(staging);
    }
  }

  loadSourceChangeReceipt(
    request: WriterRequest,
  ): SourceChangeObserved | undefined {
    const path = this.sourceChangePath(request);
    if (present(`${path}.pending`))
      throw new Error(
        `${path}.pending: unpublished pending effect; inspect before recovery`,
      );
    if (!present(path)) return undefined;
    return atPath(path, "source-change effect receipt", () => {
      regularFile(path);
      const receipt = object(JSON.parse(readFileSync(path, "utf8")));
      exact(receipt, ["requestKey", "observation"]);
      if (receipt.requestKey !== workerRequestKey(request))
        throw new Error("source-change receipt belongs to a different request");
      const observation = decodeSourceObservation(receipt.observation);
      if (
        observation.workOrderId !== request.workOrder.workOrderId ||
        observation.testBefore.command !== request.testCommand
      )
        throw new Error("source-change receipt request mismatch");
      this.#preflightReads?.add(path);
      return observation;
    });
  }

  private sourceChangePath(request: WriterRequest): string {
    commandKey(request.command.commandId);
    return join(
      this.directory,
      `${request.command.commandId}.source-change.json`,
    );
  }
}
