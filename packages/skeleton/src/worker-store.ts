import {
  closeSync,
  fsyncSync,
  linkSync,
  lstatSync,
  mkdirSync,
  openSync,
  readFileSync,
  readdirSync,
  rmdirSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { join, resolve } from "node:path";
import { createHash } from "node:crypto";
import { decodeLog, type Event } from "@dotln/kernel";
import {
  assertVerificationTask,
  canonicalStringify,
  type VerificationTask,
} from "@dotln/compiler";
import type { PlanRefutationRequest } from "./plan-refutation-protocol.js";
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
function atPath<T>(path: string, shape: string, decode: () => T): T {
  try {
    return decode();
  } catch (error) {
    throw new Error(
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
export function workerRequestKey(request: TransportRequest): string {
  // Writer kind, mount authority, command and host message path remain in the
  // stable key. Only a physical retry's episode is excluded for every kind.
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
    const guard = join(this.directory, "host-lock-recovery");
    try {
      mkdirSync(guard, { mode: 0o700 });
    } catch {
      throw new Error(
        "host lock recovery is busy or interrupted; inspect before recovery",
      );
    }
    try {
      const lock = join(this.directory, "host.lock");
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
      if (present(lock)) {
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
        // A dead host's exclusive lock may be reclaimed; no event/result changes.
        unlinkSync(lock);
      }
      durableWrite(lock, JSON.stringify({ pid: process.pid }) + "\n");
      this.#locked = true;
      if (!present(this.logPath)) durableWrite(this.logPath, "");
      syncDirectory(this.directory);
    } finally {
      this.#preflightReads = undefined;
      // Every acquirer holds this guard, so two dead-owner reclaimers cannot
      // unlink each other's newly acquired host lock. An abandoned guard refuses.
      rmdirSync(guard);
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
}
