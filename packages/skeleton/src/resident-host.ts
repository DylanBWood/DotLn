import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";
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
  assertActorResult,
  scriptResultVerified,
  type ActorResult,
  type ActorSpec,
} from "./actor-contract.js";
import { actorFailure } from "./cli-actor.js";
import { portfolioAdapter, type PortfolioPorts } from "./portfolio-actor.js";
import type { PortfolioActivation } from "./portfolio.js";
import {
  decodeResidentConfiguration,
  isMissionActor,
  portfolioSelection,
  residentEpisodeId,
  residentMachine,
  residentRefusal,
  type ResidentConfiguration,
  type ResidentState,
} from "./resident-state.js";
import { ResidentStore } from "./resident-store.js";
import { ConsoleLoopback } from "./console-loopback.js";

/** A CLI observation the actor contract refuses is recorded as the failed
 * episode it is — `invalid-result`, with its launch and the capsule the episode
 * observed — rather than thrown out of the transaction, which would leave the
 * episode pending and nothing held. The fold then derives from that capsule
 * whatever the host can prove on its own (WO-099 VER-003 F1). The replacement
 * must pass the same contract, or the original refusal stands; a refused
 * script observation or launch is still an error. */
function admittedObservation(
  spec: ActorSpec,
  result: ActorResult,
  episodeId: string,
): ActorResult {
  try {
    assertActorResult(result);
    scriptResultVerified(spec, result, episodeId);
    return result;
  } catch (error) {
    const worker = result.worker;
    if (spec.kind !== "cli-worker" || !worker || worker.result === undefined)
      throw error;
    const failed: ActorResult = {
      ...actorFailure("worker-failed"),
      worker: {
        launch: worker.launch,
        failure: "invalid-result",
        ...(worker.subject ? { subject: worker.subject } : {}),
        ...(worker.isolation ? { isolation: worker.isolation } : {}),
      },
    };
    assertActorResult(failed);
    scriptResultVerified(spec, failed, episodeId);
    return failed;
  }
}

function observationDeadline(state: ResidentState) {
  return Math.min(
    state.present &&
      state.lastHumanAt !== null &&
      state.policy?.humanIdleMs !== undefined
      ? state.lastHumanAt + state.policy.humanIdleMs
      : Infinity,
    ...Object.values(state.actors)
      .filter((actor) => actor.status === "live")
      .map(
        (actor) =>
          actor.lastHeartbeatAt +
          (state.configuration?.heartbeatBudgetMs ?? 30000),
      ),
  );
}

export interface ResidentHostOptions {
  directory: string;
  policyId: string;
  commandRoot?: string;
  workOrderIndexPath?: string;
  configuration?: ResidentConfiguration;
  now?: () => number;
  catalog?: Readonly<Record<ActorKind, ActorAdapter>>;
  predicates?: PredicateRegistry;
  capabilities?: () => readonly string[];
  /** WO-100: the WO-120, WO-052 and WO-054 hosts a portfolio actor runs through. */
  portfolio?: PortfolioPorts;
}
export class ResidentHost {
  readonly store: ResidentStore;
  private console: ConsoleLoopback | undefined;
  private readonly now: () => number;
  private readonly catalog: Readonly<Record<ActorKind, ActorAdapter>>;
  private firstTick = true;
  private started = false;
  constructor(private readonly options: ResidentHostOptions) {
    this.store = new ResidentStore(
      options.directory,
      options.predicates,
      options.workOrderIndexPath,
    );
    this.now = options.now ?? Date.now;
    this.catalog =
      options.catalog ??
      (options.portfolio
        ? { ...actorCatalog, portfolio: portfolioAdapter(options.portfolio) }
        : actorCatalog);
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
      (tx): { id: string; run: ActorRun; deadline: number } | null => {
        tx.sample(this.now());
        if (this.firstTick) {
          for (const [episodeId, status] of Object.entries(
            tx.resident!.episodes,
          ))
            if (status === "dispatched") {
              const spec =
                tx.resident!.configuration!.actors[
                  tx.resident!.episodePhases[episodeId]!
                ]!;
              if (spec.kind === "human-handoff") {
                const run = this.catalog[spec.kind].run(spec, {
                  residentStore: resolve(this.options.directory),
                  episodeId,
                });
                if (!run.handoff)
                  throw new Error("handoff adapter returned no packet");
                tx.append("HandoffRequested", { packet: run.handoff });
              } else
                tx.append("ScriptEpisodeLost", {
                  episodeId,
                  reason: "resident restarted without an observation",
                });
            }
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
        const unavailable = adapter.available(spec);
        if (unavailable) return noOp("ActorUnavailable", unavailable);
        const capabilities = this.options.capabilities?.() ?? [
          "actor.script",
          "actor.cli-worker",
          "actor.human-handoff",
        ];
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
        // WO-100: the activation, with its host-policy grant, is durable before
        // any identity is allocated or any source changes.
        let portfolio: PortfolioActivation | undefined;
        if (spec.kind === "portfolio") {
          const selection = portfolioSelection(tx.resident!, phase);
          if (!("activation" in selection))
            throw new Error("portfolio selection changed within its dispatch");
          portfolio = selection.activation;
          tx.append("PortfolioOrderActivated", {
            episodeId: id,
            activation: portfolio,
          });
        }
        // Append/fsync precedes spawn; the same short lock orders presence against both.
        const run = adapter.run(spec, {
          residentStore: resolve(this.options.directory),
          episodeId: id,
          ...(portfolio ? { portfolio } : {}),
        });
        if (spec.kind === "human-handoff") {
          if (!run.handoff)
            throw new Error("handoff adapter returned no packet");
          tx.append("HandoffRequested", { packet: run.handoff });
          return null;
        }
        return {
          id,
          deadline: observationDeadline(tx.resident!),
          run,
        };
      },
    );
    if (!dispatched) return;
    let killed = false;
    let complete = false;
    let nextSampleAt = dispatched.deadline;
    const resultPromise = dispatched.run.completed.finally(() => {
      complete = true;
    });
    while (!complete) {
      await Promise.race([resultPromise, delay(20)]);
      if (complete) break;
      if (killed) continue;
      const at = this.now();
      if (!this.store.changed() && at < nextSampleAt) continue;
      await this.store.transaction((tx) => {
        if (at >= nextSampleAt) tx.sample(at);
        nextSampleAt = observationDeadline(tx.resident!);
        if (!killed && tx.resident!.machine!.current?.id !== dispatched.id) {
          killed = true;
          dispatched.run.kill();
        }
      });
    }
    const observed = await resultPromise;
    await this.store.transaction((tx) => {
      // Presence already in the canonical log wins before accepting this result.
      tx.sample(this.now());
      const spec =
        tx.resident!.configuration!.actors[
          tx.resident!.episodePhases[dispatched.id]!
        ]!;
      const result = admittedObservation(spec, observed, dispatched.id);
      tx.append(
        spec.kind === "cli-worker"
          ? "CliWorkerObserved"
          : spec.kind === "portfolio"
            ? "PortfolioOrderObserved"
            : "ScriptEpisodeObserved",
        {
          episodeId: dispatched.id,
          ...result,
        },
      );
      tx.append("OperatorPresenceObserved", {
        signal: { kind: "progress", taskId: dispatched.id },
        origin: "task",
        at: tx.resident!.at,
      });
      // A drift is a semantic correction with a producer: record it beside the
      // hold it raised, so the correction surface sees the finding itself.
      const held = tx.resident!.dispatchHeld;
      if (held?.verdict === "drift" && held.correctionEventId === undefined)
        tx.append("MissionDriftObserved", {
          episodeId: held.episodeId,
          subjectHash: held.subjectHash,
          findings: held.findings,
        });
      // The repair clearance the hold promises. The verdict is the one the
      // fold derived from the validated observation, never the worker's claim,
      // and the capsule must be one the held judgment did not cover. Without
      // this the resident could only ever raise a hold, and every repair would
      // still wait for a human answer.
      const judged = result.worker;
      if (
        held &&
        isMissionActor(spec) &&
        tx.resident!.missionChecks[dispatched.id]?.verdict === "on-mission" &&
        judged?.subject &&
        judged.subject.hash !== held.subjectHash &&
        dispatched.id !== held.episodeId
      )
        tx.append("MissionHoldCleared", {
          origin: "verified-repair",
          episodeId: dispatched.id,
          subject: judged.subject,
          judgment: judged.result,
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
      this.console = new ConsoleLoopback(
        this.store,
        this.options.commandRoot ?? process.cwd(),
        this.now,
      );
      await this.console.start();
      // A stop request ends console admission at once; a running tick finishes.
      const loopback = this.console;
      options.signal?.addEventListener(
        "abort",
        () => void loopback.close().catch(() => undefined),
        { once: true },
      );
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
      try {
        await this.console?.close();
      } finally {
        this.console = undefined;
        this.close();
      }
    }
  }
}
