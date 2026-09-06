import { pendingCommands, replayOutbox, type Event } from "@dotln/kernel";
import {
  projectAcceptanceEvidenceMatrices,
  type AcceptanceEvidenceMatrix,
} from "./verification.js";

export interface WorkerEpisodeStatus {
  readonly episodeId: string;
  readonly commandId: string;
  readonly model: string;
  readonly effort: string;
  readonly transport: string;
  readonly mode: string;
  readonly phase:
    | "starting"
    | "running"
    | "interrupted"
    | "lease-expired"
    | "completed"
    | "quarantined";
  readonly startedAt: number;
  readonly lastHeartbeatAt: number;
  readonly leaseExpiresAt: number;
}
export interface WorkerStatus {
  readonly acceptanceEvidenceMatrices: readonly AcceptanceEvidenceMatrix[];
  readonly episodes: readonly WorkerEpisodeStatus[];
  readonly runningEpisodes: readonly string[];
  readonly pendingCommands: readonly string[];
  readonly recentEvents: readonly {
    readonly eventId: string;
    readonly type: string;
    readonly occurredAt: number;
  }[];
}

/** No clock, filesystem, transport, mutation or synthesized lifecycle state. */
export function projectWorkerStatus(events: readonly Event[]): WorkerStatus {
  const episodes = new Map<string, WorkerEpisodeStatus>();
  for (const event of events) {
    const payload = event.payload as unknown as {
      workerEpisodeId?: string;
      commandId: string;
      model: string;
      effort: string;
      transport: string;
      mode: string;
      leaseExpiresAt: number;
    } | null;
    const id = payload?.workerEpisodeId;
    if (!id || !payload) continue;
    if (event.type === "WorkerAttemptStarted") {
      episodes.set(id, {
        episodeId: id,
        commandId: payload.commandId,
        model: payload.model,
        effort: payload.effort,
        transport: payload.transport,
        mode: payload.mode,
        phase: "starting",
        startedAt: event.occurredAt,
        lastHeartbeatAt: event.occurredAt,
        leaseExpiresAt: payload.leaseExpiresAt,
      });
      continue;
    }
    const prior = episodes.get(id);
    if (!prior) continue;
    switch (event.type) {
      case "CommandReceipt":
        episodes.set(id, { ...prior, phase: "running" });
        break;
      case "WorkerHeartbeat":
        if (prior.phase === "running")
          episodes.set(id, {
            ...prior,
            lastHeartbeatAt: event.occurredAt,
            leaseExpiresAt: payload.leaseExpiresAt,
          });
        break;
      case "WorkerInterrupted":
        if (prior.phase !== "lease-expired")
          episodes.set(id, { ...prior, phase: "interrupted" });
        break;
      case "WorkerLeaseExpired":
        episodes.set(id, { ...prior, phase: "lease-expired" });
        break;
      case "WorkerCompleted":
        episodes.set(id, { ...prior, phase: "completed" });
        break;
      case "WorkerResultQuarantined":
        episodes.set(id, { ...prior, phase: "quarantined" });
        break;
    }
  }
  return {
    acceptanceEvidenceMatrices: projectAcceptanceEvidenceMatrices(events),
    episodes: [...episodes.values()],
    runningEpisodes: [...episodes.values()]
      .filter((episode) => ["starting", "running"].includes(episode.phase))
      .map((episode) => episode.episodeId),
    pendingCommands: pendingCommands(replayOutbox(events)).map(
      (command) => command.commandId,
    ),
    recentEvents: events
      .slice(-8)
      .map(({ eventId, type, occurredAt }) => ({ eventId, type, occurredAt })),
  };
}

export function renderWorkerStatus(status: WorkerStatus): string {
  return [
    `running=${status.runningEpisodes.length} pending=${status.pendingCommands.length}`,
    ...status.episodes.map(
      (episode) =>
        `${episode.episodeId} ${episode.phase} ${episode.transport} model=${episode.model} effort=${episode.effort} heartbeat=${episode.lastHeartbeatAt} lease=${episode.leaseExpiresAt} mode=${episode.mode}`,
    ),
    `pending commands: ${status.pendingCommands.join(", ") || "none"}`,
    ...status.acceptanceEvidenceMatrices.flatMap((matrix) => [
      `acceptance ${matrix.workstreamId} phase=${matrix.phase} revision=${matrix.subjectRevision ?? "unknown"}`,
      ...matrix.rows.map(
        (row) =>
          `  ${row.criterion.criterionId} ${row.criterion.claimType} ${row.status} source=${row.criterion.evidenceSource} evidence=${row.evaluations.at(-1)?.evidenceRefs.join(",") || "none"}`,
      ),
    ]),
    "recent events:",
    ...status.recentEvents.map(
      (event) => `  ${event.eventId} ${event.type} ${event.occurredAt}`,
    ),
  ].join("\n");
}
