import {
  closeSync,
  existsSync,
  fsyncSync,
  linkSync,
  lstatSync,
  mkdirSync,
  openSync,
  readFileSync,
  rmdirSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { join, resolve } from "node:path";
import { createHash } from "node:crypto";
import { decodeLog, type Event } from "@dotln/kernel";
import { canonicalStringify } from "@dotln/compiler";
import {
  parseWorkerResult,
  type WorkerRequest,
  type WorkerResult,
} from "./worker-protocol.js";

function regularFile(path: string): void {
  if (!lstatSync(path).isFile() || lstatSync(path).isSymbolicLink())
    throw new Error("worker store requires regular files");
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
export function workerRequestKey(request: WorkerRequest): string {
  const { episodeId: _attempt, ...stable } = request;
  return createHash("sha256").update(canonicalStringify(stable)).digest("hex");
}

/** A single host holds the lock; status only reads the canonical JSONL file. */
export class WorkerStore {
  readonly directory: string;
  readonly logPath: string;
  #locked = false;
  constructor(directory: string) {
    this.directory = resolve(directory);
    this.logPath = join(this.directory, "events.jsonl");
  }
  read(): string {
    if (!existsSync(this.logPath)) return "";
    regularFile(this.logPath);
    const log = readFileSync(this.logPath, "utf8");
    decodeLog(log); // Torn or malformed appends refuse; never silently truncate.
    return log;
  }
  acquire(): void {
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
      if (existsSync(lock)) {
        regularFile(lock);
        const owner = JSON.parse(readFileSync(lock, "utf8")) as { pid: number };
        if (!Number.isSafeInteger(owner.pid) || owner.pid <= 0)
          throw new Error("invalid host lock; inspect before recovery");
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
      if (!existsSync(this.logPath)) durableWrite(this.logPath, "");
      syncDirectory(this.directory);
    } finally {
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
  saveResult(request: WorkerRequest, result: WorkerResult): void {
    if (!this.#locked) throw new Error("result writer lacks its host lock");
    const validated = parseWorkerResult(result, request);
    const existing = this.loadResult(request);
    if (existing) return;
    const path = this.resultPath(request);
    const staging = `${path}.pending`;
    // A leftover unpublished staging file cannot be accepted as a result.
    if (existsSync(staging)) {
      regularFile(staging);
      unlinkSync(staging);
    }
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
  loadResult(request: WorkerRequest): WorkerResult | undefined {
    const path = this.resultPath(request);
    if (!existsSync(path)) return undefined;
    regularFile(path);
    const cached = JSON.parse(readFileSync(path, "utf8")) as {
      requestKey: string;
      result: WorkerResult;
    };
    if (cached.requestKey !== workerRequestKey(request))
      throw new Error("cached worker result belongs to a different request");
    // Keep the original producing episode, even when a fresh recovery host queries it.
    return parseWorkerResult(cached.result, {
      ...request,
      episodeId: cached.result.envelope.episodeId,
    });
  }
  private resultPath(request: WorkerRequest): string {
    if (!/^cmd_[a-zA-Z0-9_-]+$/u.test(request.command.commandId))
      throw new Error("invalid result command id");
    return join(this.directory, `${request.command.commandId}.result.json`);
  }
}
