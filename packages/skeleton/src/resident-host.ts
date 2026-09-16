import { readFileSync } from "node:fs";
import { join } from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import { canonicalStringify } from "@dotln/compiler";
import { type PredicateRegistry } from "@dotln/kernel";
import {
  actorCatalog,
  type ActorAdapter,
  type ActorKind,
  type ActorRun,
} from "./actor-catalog.js";
import {
  decodeResidentConfiguration,
  residentEpisodeId,
  residentMachine,
  residentRefusal,
  type ResidentConfiguration,
} from "./resident-state.js";
import { ResidentStore } from "./resident-store.js";

export interface ResidentHostOptions {
  directory: string;
  policyId: string;
  configuration?: ResidentConfiguration;
  now?: () => number;
  catalog?: Readonly<Record<ActorKind, ActorAdapter>>;
  predicates?: PredicateRegistry;
  capabilities?: () => readonly string[];
}
export class ResidentHost {
  readonly store: ResidentStore;
  private readonly now: () => number;
  private readonly catalog: Readonly<Record<ActorKind, ActorAdapter>>;
  private firstTick = true;
  private started = false;
  constructor(private readonly options: ResidentHostOptions) {
    this.store = new ResidentStore(options.directory, options.predicates);
    this.now = options.now ?? Date.now;
    this.catalog = options.catalog ?? actorCatalog;
  }
  async start() {
    if (this.started) throw new Error("resident is already started");
    await this.store.acquire();
    try {
      await this.store.transaction((tx) => {
        const configuration = decodeResidentConfiguration(
          this.options.configuration ??
            JSON.parse(
              readFileSync(
                join(this.options.directory, "resident.json"),
                "utf8",
              ),
            ),
        );
        if (configuration.policyId !== this.options.policyId)
          throw new Error(
            "resident selected policy differs from configuration",
          );
        if (!tx.resident?.configuration)
          tx.append("ResidentConfigured", { configuration });
        else if (
          canonicalStringify(configuration) !==
          canonicalStringify(tx.resident.configuration)
        )
          throw new Error("resident configuration changed; use a fresh store");
      });
      this.started = true;
    } catch (error) {
      this.store.release();
      throw error;
    }
  }
  close() {
    this.store.release();
    this.started = false;
  }
  async tick(): Promise<void> {
    if (!this.started) throw new Error("resident is not started");
    const dispatched = await this.store.transaction(
      (tx): { id: string; run: ActorRun } | null => {
        tx.sample(this.now());
        if (this.firstTick) {
          for (const [episodeId, status] of Object.entries(
            tx.resident!.episodes,
          ))
            if (status === "dispatched")
              tx.append("ScriptEpisodeLost", {
                episodeId,
                reason: "resident restarted without an observation",
              });
          this.firstTick = false;
        }
        const state = tx.resident!;
        const machine = residentMachine(state, this.options.predicates);
        const dueAt = machine.due(state.at);
        const phase = machine.phase();
        if (!phase) return null;
        const noOp = (
          type: "ActorUnavailable" | "ScriptEpisodeRefused",
          reason: string,
        ) => {
          if (state.lastNoOp !== reason)
            tx.append(type, { reason, phaseId: phase.phaseId });
          return null;
        };
        if (phase.availability.kind === "NoOp")
          return noOp("ActorUnavailable", phase.availability.reason);
        if (dueAt === null) return null;
        const spec = state.configuration!.actors[phase.phaseId]!;
        const adapter = this.catalog[spec.kind];
        const unavailable = adapter.available();
        if (unavailable) return noOp("ActorUnavailable", unavailable);
        const capabilities = this.options.capabilities?.() ?? ["actor.script"];
        const missing = phase.requiredCapabilities.filter(
          (capability) => !capabilities.includes(capability),
        );
        if (missing.length)
          return noOp(
            "ActorUnavailable",
            `runtime capability unavailable: ${missing.join(", ")}`,
          );
        const refusal = residentRefusal(state, machine);
        if (refusal) return noOp("ScriptEpisodeRefused", refusal);
        const id = residentEpisodeId(machine, dueAt);
        if (Object.hasOwn(state.episodes, id)) return null;
        tx.append("ScriptEpisodeDispatched", {
          episodeId: id,
          dueAt,
          phaseId: phase.phaseId,
          kind: spec.kind,
          effect: spec.effect,
          authorityEnvelopeId: phase.effectiveEnvelope.authorityEnvelopeId,
        });
        // Append/fsync precedes spawn; the same short lock orders presence against both.
        return { id, run: adapter.run(spec) };
      },
    );
    if (!dispatched) return;
    let killed = false;
    let complete = false;
    const resultPromise = dispatched.run.completed.finally(() => {
      complete = true;
    });
    while (!complete) {
      await Promise.race([resultPromise, delay(20)]);
      if (complete) break;
      if (!this.store.changed()) continue;
      await this.store.transaction((tx) => {
        if (!killed && tx.resident!.machine!.current?.id !== dispatched.id) {
          killed = true;
          dispatched.run.kill();
        }
      });
    }
    const result = await resultPromise;
    await this.store.transaction((tx) => {
      // Presence already in the canonical log wins before accepting this result.
      tx.sample(this.now());
      tx.append("ScriptEpisodeObserved", {
        episodeId: dispatched.id,
        ...result,
      });
    });
  }
  async run(
    options: {
      once?: boolean;
      tickMs?: number;
      cycles?: number;
      signal?: AbortSignal;
    } = {},
  ) {
    const tickMs = options.tickMs ?? 1000;
    if (!Number.isSafeInteger(tickMs) || tickMs < 1 || tickMs > 3600000)
      throw new Error("resident tick must be 1..3600000 ms");
    await this.start();
    try {
      for (let cycle = 0; !options.signal?.aborted; cycle++) {
        await this.tick();
        if (
          options.once ||
          (options.cycles !== undefined && cycle + 1 >= options.cycles)
        )
          break;
        await delay(tickMs, undefined, { signal: options.signal }).catch(
          (error: unknown) => {
            if (!options.signal?.aborted) throw error;
          },
        );
      }
    } finally {
      this.close();
    }
  }
}
