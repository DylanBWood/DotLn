import { canonicalStringify, type ArtifactIdentityV1 } from "@dotln/compiler";
import {
  decodeLog,
  pendingCommands,
  replayOutbox,
  type Event,
  type JsonValue,
} from "@dotln/kernel";
import {
  ACTOR,
  WORKSTREAM,
  EPISODE,
  commandFromState,
  workOrderFromState,
} from "./reactor.js";
import {
  LiveReactorDriver,
  type FixtureTree,
  type ReactorStep,
} from "./scenario.js";
import {
  HEARTBEAT_MS,
  LEASE_MS,
  WorkerFailure,
  type ResultEnvelope,
  type WorkerEffort,
  type WorkerRequest,
  type WorkerResult,
} from "./worker-protocol.js";
import type {
  WorkOrderTransport,
  TransportDispatch,
} from "./worker-transport.js";
import { WorkerStore } from "./worker-store.js";
import { projectWorkerStatus } from "./worker-status.js";
import type { BeaconClaimRecord } from "./beacon.js";

export interface WorkerHostOptions {
  readonly store: WorkerStore;
  readonly driver: LiveReactorDriver;
  readonly transport: WorkOrderTransport;
  readonly now?: () => number;
  readonly onClaim?: (claim: BeaconClaimRecord) => void;
  readonly onRunning?: (dispatch: TransportDispatch) => void;
  readonly afterResultSaved?: () => void;
}

/** This host only admits idempotent read-only inspection, never arbitrary writes. */
export class WorkerHost {
  readonly now: () => number;
  constructor(private readonly options: WorkerHostOptions) {
    this.now = options.now ?? Date.now;
  }
  private record(
    type: string,
    payload: object,
    cause?: Event,
    occurredAt = this.now(),
  ): ReactorStep {
    return this.options.driver.feed({
      schemaVersion: 1,
      type,
      occurredAt,
      actorId: "worker-host",
      workstreamId: WORKSTREAM,
      episodeId: EPISODE,
      correlationId: commandFromState(this.options.driver.state).commandId,
      ...(cause ? { causationId: cause.eventId } : {}),
      payload: payload as unknown as JsonValue,
    });
  }
  expireLeases(): void {
    const episodes = projectWorkerStatus(
      decodeLog(this.options.driver.log),
    ).episodes;
    for (const episode of episodes)
      if (
        ["starting", "running", "interrupted"].includes(episode.phase) &&
        this.now() >= episode.leaseExpiresAt
      )
        this.record("WorkerLeaseExpired", {
          workerEpisodeId: episode.episodeId,
          commandId: episode.commandId,
          leaseExpiresAt: episode.leaseExpiresAt,
        });
  }
  async run(
    cwd: string,
    fixture: FixtureTree,
    model: string,
    effort: WorkerEffort,
  ): Promise<{ envelope: ResultEnvelope; resultStep: ReactorStep | null }> {
    const { driver, store, transport } = this.options;
    const command = commandFromState(driver.state);
    if (
      !pendingCommands(replayOutbox(decodeLog(driver.log))).some(
        (pending) => pending.commandId === command.commandId,
      )
    )
      throw new Error("worker command is not pending in the durable outbox");
    const source = decodeLog(driver.log).find(
      (event) =>
        event.type === "CommandPersisted" &&
        (event.payload as unknown as { command?: { commandId?: string } })
          .command?.commandId === command.commandId,
    );
    if (!source) throw new Error("worker command lacks its persist event");
    const gate = this.record(
      "CommandRedispatchRequested",
      { commandId: command.commandId, workerDispatchVersion: 1 },
      source,
    );
    if (gate.decision.trace.branchPath.at(-1) !== "redispatch-ready")
      throw new WorkerFailure("profile-refused");
    const workOrder = workOrderFromState(driver.state);
    if (
      canonicalStringify(
        (command.intent.payload as { workOrder?: unknown }).workOrder,
      ) !== canonicalStringify(workOrder)
    )
      throw new WorkerFailure("profile-refused");
    this.expireLeases();
    const episodes = projectWorkerStatus(decodeLog(driver.log)).episodes;
    const episodeId = `${EPISODE}_worker_${episodes.length + 1}`;
    const request: WorkerRequest = {
      command,
      workOrder,
      artifactIdentity: driver.state
        .artifactIdentity as unknown as ArtifactIdentityV1,
      episodeId,
      model,
      effort,
      cwd,
      fixture,
      profile: {
        profileId: "fixture-inspection-v1",
        mounts: [{ path: cwd, access: "read" }],
      },
    };
    const cached = store.loadResult(request);
    if (
      !cached &&
      episodes.some((episode) =>
        ["starting", "running", "interrupted"].includes(episode.phase),
      )
    )
      throw new Error("worker lease has not expired; keep the pending command");
    const started = this.record(
      "WorkerAttemptStarted",
      {
        workerEpisodeId: episodeId,
        commandId: command.commandId,
        workOrderId: workOrder.workOrderId,
        mode: cached ? "cached-result-query" : "fresh-cli",
        transport: transport.name,
        model,
        effort,
        harnessVersion: transport.harnessVersion,
        selectionSource: "host-launch",
        effectiveModel: "unknown",
        effectiveEffort: "unknown",
        heartbeatMs: HEARTBEAT_MS,
        leaseMs: LEASE_MS,
        leaseExpiresAt: this.now() + LEASE_MS,
        profile: request.profile,
        artifactIdentity: request.artifactIdentity,
      },
      gate.event,
    );
    let result: WorkerResult;
    if (cached) {
      result = cached;
      this.record(
        "WorkerResultRecovered",
        {
          workerEpisodeId: episodeId,
          producingEpisodeId: result.envelope.episodeId,
          commandId: command.commandId,
          resultId: result.envelope.resultId,
        },
        started.event,
      );
    } else {
      let timer: ReturnType<typeof setInterval> | undefined;
      let dispatch: TransportDispatch | undefined;
      let heartbeatError: unknown;
      try {
        dispatch = transport.dispatch(request, this.now);
        const receipt = await dispatch.receipt;
        const accepted = this.record(
          "CommandReceipt",
          { ...receipt, workerEpisodeId: episodeId },
          started.event,
        );
        timer = setInterval(() => {
          try {
            // A delayed host callback cannot renew a lease it already missed.
            this.expireLeases();
            if (driver.state.workerLeaseExpired) {
              dispatch!.kill();
              return;
            }
            if (dispatch!.alive())
              this.record(
                "WorkerHeartbeat",
                {
                  workerEpisodeId: episodeId,
                  commandId: command.commandId,
                  evidence: "host-observed-child-process",
                  leaseExpiresAt: this.now() + LEASE_MS,
                },
                accepted.event,
              );
          } catch (error) {
            heartbeatError = error;
            dispatch!.kill();
          }
        }, HEARTBEAT_MS);
        this.options.onRunning?.(dispatch);
        result = await dispatch.completed;
        if (heartbeatError) throw heartbeatError;
      } catch (error) {
        dispatch?.kill();
        const code =
          error instanceof WorkerFailure ? error.code : "transport-failed";
        const detail =
          error instanceof WorkerFailure ? error.detail : undefined;
        this.record(
          "WorkerInterrupted",
          {
            workerEpisodeId: episodeId,
            commandId: command.commandId,
            reason: code,
            ...(detail ? { detail } : {}),
          },
          started.event,
        );
        throw new WorkerFailure(code, detail);
      } finally {
        if (timer) clearInterval(timer);
      }
      // Commit the validated effect receipt before appending CommandResult.
      // A host crash here is row 2; recovery queries this immutable result.
      if (result.envelope.status === "completed") {
        store.saveResult(request, result);
        this.options.afterResultSaved?.();
      }
    }
    this.options.onClaim?.({
      recordType: "beacon-claim",
      codebookVersion: 1,
      provenance: "self-reported",
      actor: transport.name,
      scope: { workstreamId: WORKSTREAM, episodeId },
      claimedAt: this.now(),
      actionClass: "result",
      outcome:
        result.beaconClaim === "inspection-completed"
          ? "returned"
          : "terminated",
      refusalCount: 0,
    });
    if (result.envelope.status !== "completed") {
      this.record(
        "WorkerInterrupted",
        {
          workerEpisodeId: episodeId,
          commandId: command.commandId,
          reason: "worker-incomplete",
          envelope: result.envelope,
          result,
        },
        started.event,
      );
      return { envelope: result.envelope, resultStep: null };
    }
    const payload = {
      commandId: command.commandId,
      result: "candidates",
      candidates: result.candidates,
      workerResultVersion: 1,
      workerEpisodeId: episodeId,
      producingEpisodeId: result.envelope.episodeId,
      envelope: result.envelope,
    };
    this.expireLeases();
    const observation = this.record(
      "WorkerResultObserved",
      payload,
      started.event,
    );
    if (
      observation.decision.trace.branchPath.at(-1) !==
      "worker-result-admissible"
    ) {
      this.record(
        "WorkerResultQuarantined",
        {
          workerEpisodeId: episodeId,
          commandId: command.commandId,
          envelope: result.envelope,
          resultEventId: observation.event.eventId,
        },
        observation.event,
      );
      throw new WorkerFailure("profile-refused");
    }
    // Admission and acknowledgement share one host observation time. A slow
    // durable append cannot move the acknowledgement across an expiry boundary.
    const resultStep = this.record(
      "CommandResult",
      payload,
      observation.event,
      observation.event.occurredAt,
    );
    this.record(
      "WorkerCompleted",
      {
        workerEpisodeId: episodeId,
        commandId: command.commandId,
        envelope: result.envelope,
        resultEventId: resultStep.event.eventId,
      },
      resultStep.event,
    );
    return { envelope: result.envelope, resultStep };
  }
}
