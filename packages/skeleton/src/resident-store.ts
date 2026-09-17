import {
  closeSync,
  fsyncSync,
  openSync,
  writeFileSync,
  existsSync,
  lstatSync,
  statSync,
} from "node:fs";
import { join } from "node:path";
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
  constructor(
    private readonly store: WorkerStore,
    readonly predicates: PredicateRegistry,
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
  append(type: string, payload: object, occurredAt = this.resident?.at ?? 0) {
    const event: Event = {
      schemaVersion: 1,
      eventId: `evt_${this.events.length + 1}`,
      type,
      occurredAt,
      actorId: ["OperatorPresenceChanged", "HandoffAnswered"].includes(type)
        ? "operator"
        : "resident-host",
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
  ) {
    this.store = new WorkerStore(directory);
    this.appendStore = new WorkerStore(join(directory, ".resident-append"));
  }
  async transaction<T>(operation: (tx: ResidentTransaction) => T): Promise<T> {
    if (
      existsSync(this.store.directory) &&
      lstatSync(this.store.directory).isSymbolicLink()
    )
      throw new Error("resident store may not be a symlink");
    for (let attempt = 0; ; attempt++) {
      try {
        this.appendStore.acquire();
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
      const result = operation(
        new ResidentTransaction(this.store, this.predicates),
      );
      this.observedBytes = existsSync(this.store.logPath)
        ? statSync(this.store.logPath).size
        : 0;
      return result;
    } finally {
      this.appendStore.release();
    }
  }
  async acquire() {
    await this.transaction(() =>
      this.store.acquire(() => {
        // Positive replay inspection occurs before dead-owner reclaim.
        new ResidentTransaction(this.store, this.predicates);
      }),
    );
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
