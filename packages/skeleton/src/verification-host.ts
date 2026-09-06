import {
  appendEvent,
  decodeLog,
  replay,
  type Decision,
  type Event,
  type EventDraft,
  type ResultEnvelope,
} from "@dotln/kernel";
import { canonicalStringify } from "@dotln/compiler";
import { WorkerStore } from "./worker-store.js";
import {
  HEARTBEAT_MS,
  LEASE_MS,
  WorkerFailure,
  type WorkerEffort,
} from "./worker-protocol.js";
import type {
  WorkOrderTransport,
  TransportDispatch,
} from "./worker-transport.js";
import {
  parseEvidenceResult,
  validateTransportRequest,
  type EvidenceWorkerRequest,
  type EvidenceWorkerResult,
} from "./verification-protocol.js";
import {
  initialVerificationRuntime,
  verificationAuthorization,
  verificationDraft,
  verificationStateFromRuntime,
  type VerificationState,
} from "./verification.js";
import { seiriReactor, type RuntimeState } from "./reactor.js";

export class VerificationDriver {
  #log: string;
  #runtime: RuntimeState;
  #decisions: Decision<RuntimeState>[];
  constructor(
    readonly store: WorkerStore,
    readonly workstreamId: string,
    private readonly onEvent?: (event: Event, state: VerificationState) => void,
  ) {
    this.#log = store.read();
    const restored = replay(
      initialVerificationRuntime(workstreamId),
      decodeLog(this.#log),
      seiriReactor,
      {},
    );
    this.#runtime = restored.state;
    this.#decisions = [...restored.decisions];
  }
  get state(): VerificationState {
    return verificationStateFromRuntime(this.#runtime);
  }
  get decisions(): readonly Decision<RuntimeState>[] {
    return this.#decisions;
  }
  get log(): string {
    return this.#log;
  }
  feed(draft: EventDraft): Event {
    const appended = appendEvent(this.#log, draft);
    const decision = seiriReactor(this.#runtime, appended.event, {
      now: appended.event.occurredAt,
      rngState: 17,
      predicates: {},
    });
    // Contract/refusal checks run before committing an invalid canonical event.
    this.store.append(appended.event);
    this.#log = appended.log;
    this.#runtime = decision.state;
    this.#decisions.push(decision);
    this.onEvent?.(appended.event, this.state);
    return appended.event;
  }
  record(
    type: string,
    at: number,
    payload: unknown,
    correlationId?: string,
  ): Event {
    return this.feed(
      verificationDraft(this.workstreamId, type, at, payload, correlationId),
    );
  }
  drainContinuation(at: number): void {
    if (this.state.continuation.kind === "Emit")
      this.feed({ ...this.state.continuation.event, occurredAt: at });
  }
  persistNext(at: number): void {
    this.drainContinuation(at);
    if (!this.state.pending)
      this.record("VerificationDispatchRequested", at, {});
    if (!this.state.pending!.persisted) {
      const grant = verificationAuthorization(this.state, at);
      if (!grant.authorized) {
        this.feed(grant.refusal);
        throw new WorkerFailure("profile-refused");
      }
      if (
        canonicalStringify(grant.command) !==
        canonicalStringify(this.state.pending!.command)
      )
        throw new WorkerFailure("profile-refused");
      this.record(
        "CommandPersisted",
        at,
        {
          command: grant.command,
          authority: grant.authority,
          trace: grant.trace,
        },
        grant.command.commandId,
      );
    }
  }
  admitResult(draft: EventDraft): Event | null {
    const candidate = appendEvent(this.#log, draft).event;
    if (
      verificationStateFromRuntime(
        seiriReactor(this.#runtime, candidate, {
          now: candidate.occurredAt,
          rngState: 17,
          predicates: {},
        }).state,
      ).lastResultEventId !== candidate.eventId
    )
      return null;
    return this.feed(draft);
  }
}

export interface VerificationHostOptions {
  readonly driver: VerificationDriver;
  readonly transport: WorkOrderTransport<EvidenceWorkerRequest>;
  readonly now: () => number;
  readonly afterResultSaved?: () => void;
  readonly onRunning?: (
    dispatch: TransportDispatch<EvidenceWorkerResult>,
  ) => void;
}

/** Narrow counterpart of WorkerHost for pinned verification/repair capsules. */
export class VerificationHost {
  constructor(private readonly options: VerificationHostOptions) {}
  private expire(): void {
    const { driver, now } = this.options;
    const pending = driver.state.pending;
    if (
      pending?.activeEpisode &&
      !pending.leaseExpired &&
      now() >= pending.leaseExpiresAt
    )
      driver.record(
        "WorkerLeaseExpired",
        now(),
        {
          commandId: pending.command.commandId,
          workerEpisodeId: pending.activeEpisode,
          leaseExpiresAt: pending.leaseExpiresAt,
        },
        pending.command.commandId,
      );
  }
  async run(
    cwd: string,
    model: string,
    effort: WorkerEffort,
  ): Promise<ResultEnvelope> {
    const { driver, transport, now } = this.options;
    const pending = driver.state.pending;
    if (
      !pending?.persisted ||
      !verificationAuthorization(driver.state, now()).authorized
    )
      throw new WorkerFailure("profile-refused");
    this.expire();
    const episodeId = `${pending.command.episodeId}_attempt_${pending.attempts.length + 1}`;
    const request: EvidenceWorkerRequest = {
      kind: "evidence-worker",
      command: pending.command,
      capsule: pending.capsule,
      workOrder: pending.capsule.workOrder,
      episodeId,
      cwd,
      model,
      effort,
      profile: {
        profileId: "verification-snapshot-v1",
        mounts: [{ path: cwd, access: "read" }],
      },
    };
    validateTransportRequest(request);
    const cached = driver.store.loadResult(request);
    if (
      !cached &&
      driver.state.pending!.activeEpisode &&
      !driver.state.pending!.leaseExpired
    )
      throw new WorkerFailure("profile-refused", "prior episode still leased");
    driver.record(
      "WorkerAttemptStarted",
      now(),
      {
        commandId: pending.command.commandId,
        workerEpisodeId: episodeId,
        role: pending.capsule.role,
        mode: cached ? "cached-result-query" : "fresh-transport",
        inputHash: pending.capsule.inputHash,
        model,
        effort,
        transport: transport.name,
        harnessVersion: transport.harnessVersion,
        selectionSource: "host-launch",
        effectiveModel: "unknown",
        effectiveEffort: "unknown",
        heartbeatMs: HEARTBEAT_MS,
        leaseMs: LEASE_MS,
        leaseExpiresAt: now() + LEASE_MS,
        profileId: request.profile.profileId,
      },
      pending.command.commandId,
    );
    let result: EvidenceWorkerResult;
    if (cached) {
      result = cached;
      driver.record(
        "WorkerResultRecovered",
        now(),
        {
          commandId: pending.command.commandId,
          workerEpisodeId: episodeId,
          producingEpisodeId: result.envelope.episodeId,
        },
        pending.command.commandId,
      );
    } else {
      let timer: ReturnType<typeof setInterval> | undefined;
      let dispatch: TransportDispatch<EvidenceWorkerResult> | undefined;
      let heartbeatError: unknown;
      try {
        dispatch = transport.dispatch(request, now);
        const receipt = await dispatch.receipt;
        if (receipt.commandId !== pending.command.commandId)
          throw new WorkerFailure("invalid-result");
        driver.record(
          "CommandReceipt",
          now(),
          { ...receipt, workerEpisodeId: episodeId },
          pending.command.commandId,
        );
        timer = setInterval(() => {
          try {
            this.expire();
            if (driver.state.pending!.leaseExpired) {
              dispatch!.kill();
              return;
            }
            if (dispatch!.alive())
              driver.record(
                "WorkerHeartbeat",
                now(),
                {
                  commandId: pending.command.commandId,
                  workerEpisodeId: episodeId,
                  evidence: "host-observed-child-process",
                  leaseExpiresAt: now() + LEASE_MS,
                },
                pending.command.commandId,
              );
          } catch (error) {
            heartbeatError = error;
            dispatch!.kill();
          }
        }, HEARTBEAT_MS);
        this.options.onRunning?.(dispatch);
        result = parseEvidenceResult(await dispatch.completed, request);
        if (heartbeatError) throw heartbeatError;
      } catch (error) {
        dispatch?.kill();
        const code =
          error instanceof WorkerFailure ? error.code : "transport-failed";
        driver.record(
          "WorkerInterrupted",
          now(),
          {
            commandId: pending.command.commandId,
            workerEpisodeId: episodeId,
            reason: code,
          },
          pending.command.commandId,
        );
        throw new WorkerFailure(code);
      } finally {
        if (timer) clearInterval(timer);
      }
      if (result.envelope.status === "completed") {
        driver.store.saveResult(request, result);
        this.options.afterResultSaved?.();
      }
    }
    if (result.envelope.status !== "completed") {
      driver.record(
        "WorkerInterrupted",
        now(),
        {
          commandId: pending.command.commandId,
          workerEpisodeId: episodeId,
          reason: "worker-incomplete",
          result,
        },
        pending.command.commandId,
      );
      return result.envelope;
    }
    this.expire();
    const at = now();
    const payload = {
      commandId: pending.command.commandId,
      workerEpisodeId: episodeId,
      verificationResultVersion: 1,
      result: "completed",
      value: result,
    };
    const observation = driver.record(
      "VerificationWorkerResultObserved",
      at,
      payload,
      pending.command.commandId,
    );
    const accepted = driver.admitResult({
      ...verificationDraft(
        driver.workstreamId,
        "CommandResult",
        at,
        payload,
        pending.command.commandId,
      ),
      causationId: observation.eventId,
    });
    if (!accepted) {
      driver.record(
        "WorkerResultQuarantined",
        at,
        {
          commandId: pending.command.commandId,
          workerEpisodeId: episodeId,
          resultEventId: observation.eventId,
        },
        pending.command.commandId,
      );
      throw new WorkerFailure("profile-refused");
    }
    driver.record(
      "WorkerCompleted",
      at,
      {
        commandId: pending.command.commandId,
        workerEpisodeId: episodeId,
        envelope: result.envelope,
        resultEventId: accepted.eventId,
      },
      pending.command.commandId,
    );
    driver.drainContinuation(at);
    return result.envelope;
  }
}
