import {
  closeSync,
  fsyncSync,
  openSync,
  writeFileSync,
  existsSync,
  lstatSync,
  statSync,
  readFileSync,
  renameSync,
  unlinkSync,
} from "node:fs";
import { randomUUID } from "node:crypto";
import { isAbsolute, join, resolve } from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import {
  decodeLog,
  replay,
  type Event,
  type JsonValue,
  type PredicateRegistry,
} from "@dotln/kernel";
import {
  initialState,
  projectRuntimeEnvironment,
  seiriReactor,
  type RuntimeState,
} from "./reactor.js";
import { type ResidentState } from "./resident-state.js";
import { WorkerStore } from "./worker-store.js";
import { projectRuntimeStatus } from "./runtime-status.js";
import {
  classifyPresenceSignal,
  decodePresenceObservation,
  type PresenceSignal,
  type ResidentStamp,
} from "./presence-signals.js";

export function replayResident(
  log: string,
  predicates: PredicateRegistry = {},
) {
  return replay(
    initialState(),
    decodeLog(log),
    seiriReactor,
    predicates,
    projectRuntimeEnvironment,
  );
}
export class ResidentTransaction {
  readonly events: Event[];
  state: RuntimeState;
  published = false;
  constructor(
    private readonly store: WorkerStore,
    readonly predicates: PredicateRegistry,
    private readonly publish: (tx: ResidentTransaction) => void,
  ) {
    const log = store.read();
    this.events = [...decodeLog(log)];
    if (this.events.some((event) => event.workstreamId !== "resident"))
      throw new Error("resident requires a dedicated launchpad store");
    this.state = replayResident(log, predicates).state;
  }
  get resident(): ResidentState | undefined {
    return this.state.resident as unknown as ResidentState | undefined;
  }
  append(
    type: string,
    payload: object,
    occurredAt = this.resident?.at ?? 0,
    actorId?: "operator" | "resident-host" | "console",
  ) {
    const event: Event = {
      schemaVersion: 1,
      eventId: `evt_${this.events.length + 1}`,
      type,
      occurredAt,
      actorId:
        actorId ??
        (["OperatorPresenceChanged", "HandoffAnswered"].includes(type)
          ? "operator"
          : "resident-host"),
      workstreamId: "resident",
      payload: payload as JsonValue,
    };
    // Validate the complete new fold before making the event durable.
    const decision = seiriReactor(this.state, event, {
      ...projectRuntimeEnvironment(this.state),
      now: event.occurredAt,
      predicates: this.predicates,
    });
    const fd = openSync(this.store.logPath, "a", 0o600);
    try {
      writeFileSync(fd, JSON.stringify(event) + "\n");
      fsyncSync(fd);
    } finally {
      closeSync(fd);
    }
    this.events.push(event);
    this.state = decision.state;
    this.publish(this);
    this.published = true;
  }
  sample(at: number) {
    this.append("ClockSampled", { at }, at);
  }
}

/** Lifetime ownership and short append ownership reuse the inspected worker lock.
 * Presence only takes the latter, so it remains usable during a running episode. */
export class ResidentStore {
  readonly store: WorkerStore;
  private readonly appendStore: WorkerStore;
  private observedBytes = 0;
  constructor(
    directory: string,
    private readonly predicates: PredicateRegistry = {},
    private readonly indexPath?: string,
  ) {
    this.store = new WorkerStore(directory);
    this.appendStore = new WorkerStore(join(directory, ".resident-append"));
  }
  private get sourcePath() {
    return join(this.store.directory, ".runtime-status-source.json");
  }
  private readIndex(): string | null {
    try {
      const source = JSON.parse(readFileSync(this.sourcePath, "utf8"));
      if (
        source.version !== 1 ||
        typeof source.indexPath !== "string" ||
        !isAbsolute(source.indexPath)
      )
        return null;
      return readFileSync(source.indexPath, "utf8");
    } catch {
      return null;
    }
  }
  /** Only the lifetime owner selects the source. Helpers, including installed
   * harness snapshots, read this private binding instead of their own checkout. */
  private bindIndex() {
    if (this.indexPath === undefined) return;
    const bytes =
      JSON.stringify({ version: 1, indexPath: resolve(this.indexPath) }) + "\n";
    try {
      if (
        existsSync(this.sourcePath) &&
        readFileSync(this.sourcePath, "utf8") === bytes
      )
        return;
      this.replaceProjection(this.sourcePath, bytes);
    } catch {
      // Projection configuration cannot abort authoritative resident work.
    }
  }
  /** Readers see the old complete file or the new complete file. The log is
   * authoritative; an interrupted projection write is rebuilt next transaction. */
  private publish(tx: ResidentTransaction) {
    try {
      const view = projectRuntimeStatus(
        tx.resident,
        tx.events,
        this.readIndex(),
        this.predicates,
      );
      this.replaceProjection(
        join(this.store.directory, "runtime-status-v1.json"),
        JSON.stringify(view, null, 2) + "\n",
      );
    } catch {
      // The durable append already succeeded. A later event or tick rebuilds
      // the disposable file; a UI failure must never prevent actor dispatch.
    }
  }
  private replaceProjection(target: string, bytes: string) {
    const temporary = join(
      this.store.directory,
      `.runtime-status-${randomUUID()}.tmp`,
    );
    const fd = openSync(temporary, "wx", 0o600);
    try {
      try {
        writeFileSync(fd, bytes);
      } finally {
        closeSync(fd);
      }
      renameSync(temporary, target);
    } finally {
      if (existsSync(temporary)) unlinkSync(temporary);
    }
  }
  /** `observe: false` leaves the host's change baseline alone, so another
   * in-process writer (the console's receipts) cannot hide a concurrent
   * append such as a served presence change from a running tick. */
  async transaction<T>(
    operation: (tx: ResidentTransaction) => T,
    { observe = true }: { observe?: boolean } = {},
  ): Promise<T> {
    if (
      existsSync(this.store.directory) &&
      lstatSync(this.store.directory).isSymbolicLink()
    )
      throw new Error("resident store may not be a symlink");
    let inspected: ResidentTransaction;
    for (let attempt = 0; ; attempt++) {
      try {
        this.appendStore.acquire(() => {
          // The append lock protects the resident log, not just its auxiliary
          // store. Validate that actual state before reclaiming either owner.
          inspected = new ResidentTransaction(
            this.store,
            this.predicates,
            (tx) => this.publish(tx),
          );
        });
        break;
      } catch (error) {
        if (
          attempt >= 200 ||
          !(error instanceof Error) ||
          !/already has a live host|recovery is busy/u.test(error.message)
        )
          throw error;
        await delay(10);
      }
    }
    try {
      const result = operation(inspected!);
      if (!inspected!.published) this.publish(inspected!);
      if (observe)
        this.observedBytes = existsSync(this.store.logPath)
          ? statSync(this.store.logPath).size
          : 0;
      return result;
    } finally {
      this.appendStore.release();
    }
  }
  async acquire() {
    await this.transaction(() => {
      this.store.acquire(() => {
        // Positive replay inspection occurs before dead-owner reclaim.
        new ResidentTransaction(this.store, this.predicates, (tx) =>
          this.publish(tx),
        );
      });
      this.bindIndex();
    });
  }
  release() {
    this.store.release();
  }
  read() {
    return this.store.read();
  }
  changed() {
    return (
      (existsSync(this.store.logPath)
        ? statSync(this.store.logPath).size
        : 0) !== this.observedBytes
    );
  }
}
export async function recordPresence(
  directory: string,
  presence: "away" | "returned",
  now = Date.now,
) {
  if (!["away", "returned"].includes(presence))
    throw new Error("invalid resident presence");
  await recordPresenceObservation(
    directory,
    { kind: presence === "away" ? "away" : "back" },
    undefined,
    now,
  );
}
export async function answerHandoff(
  directory: string,
  input: {
    episodeId: string;
    workOrderId: string;
    optionId: string;
  },
  now = Date.now,
) {
  if (process.env["DOTLN_RESIDENT_EPISODE_ID"])
    throw new Error("resident actors cannot answer a human handoff");
  const store = new ResidentStore(directory);
  await store.transaction((tx) => {
    tx.append(
      "HandoffAnswered",
      { ...input, origin: "human" },
      Math.max(now(), tx.resident?.at ?? 0),
    );
  });
}
/** A human answer or a fresh passing judgment over a repair. A resident actor
 * cannot clear the hold its own drift raised. */
export async function clearMissionHold(
  directory: string,
  input:
    | { origin: "human"; episodeId: string; answer: string }
    | {
        origin: "verified-repair";
        episodeId: string;
        subject: unknown;
        judgment: unknown;
      },
  now = Date.now,
) {
  if (process.env["DOTLN_RESIDENT_EPISODE_ID"])
    throw new Error("resident actors cannot clear a mission hold");
  const store = new ResidentStore(directory);
  await store.transaction((tx) => {
    tx.append(
      "MissionHoldCleared",
      input,
      Math.max(now(), tx.resident?.at ?? 0),
      input.origin === "human" ? "operator" : "resident-host",
    );
  });
}
export async function recordPresenceObservation(
  directory: string,
  signal: PresenceSignal,
  stamp?: ResidentStamp,
  now = Date.now,
) {
  const observation = decodePresenceObservation({
    signal,
    origin: classifyPresenceSignal(signal, stamp),
    at: now(),
    ...(stamp ? { stamp } : {}),
  });
  const store = new ResidentStore(directory);
  await store.transaction((tx) => {
    const sampledAt = observation.at;
    // Live commands retain their explicit intent when the wall clock moves back.
    observation.at = Math.max(sampledAt, tx.resident?.at ?? 0);
    // Observe human return before evaluating a deadline at the same time.
    tx.append("OperatorPresenceObserved", observation, observation.at);
    tx.sample(sampledAt);
  });
}
