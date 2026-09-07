import type { Event } from "@dotln/kernel";
import type { WorkerEpisodeStatus } from "@dotln/skeleton/dist/src/worker-status.js";
import type {
  BoardLink,
  BoardRow,
  BoardSection,
  BoardSources,
  StoreSource,
} from "./types.js";
import { ProjectionContext } from "./context.js";
import {
  array,
  at,
  available,
  fact,
  id,
  known,
  object,
  optionalObject,
  optionalString,
  string,
  unknown,
} from "./values.js";

interface BuildRecord {
  readonly hash?: string;
  readonly hashKind: string;
  readonly loadoutHash?: string;
  readonly identity?: string;
  readonly role?: string;
  readonly authority: Record<string, unknown>;
  readonly sourceEvent?: Event;
  readonly workOrder: Record<string, unknown>;
}

function recordedBuild(
  events: readonly Event[],
  commandId: string | undefined,
  before: number,
): BuildRecord {
  const prefix = events.slice(0, before + 1);
  const commandEvent = prefix.findLast(
    (event) =>
      event.type === "CommandPersisted" &&
      at(event.payload, "command", "commandId") === commandId,
  );
  const command = at(commandEvent?.payload, "command");
  const payload = at(command, "intent", "payload");
  const capsule = optionalObject(at(payload, "capsule"));
  if (typeof capsule["inputHash"] === "string")
    return {
      hash: capsule["inputHash"],
      hashKind: "verification-v1 input hash",
      role: string(capsule["role"]),
      authority: optionalObject(at(commandEvent?.payload, "authority")),
      ...(commandEvent ? { sourceEvent: commandEvent } : {}),
      workOrder: optionalObject(capsule["workOrder"]),
    };
  const feedback = prefix.findLast(
    (event) =>
      event.type === "FeedbackAuditOpened" &&
      (!commandEvent || event.workstreamId === commandEvent.workstreamId),
  );
  if (feedback)
    return {
      hash: string(at(feedback.payload, "program", "policyHash")),
      hashKind: "feedback-v1 policy hash",
      identity: feedback.actorId,
      role: "executor",
      authority: object(at(feedback.payload, "authority")),
      sourceEvent: feedback,
      workOrder: object(at(feedback.payload, "workOrder")),
    };
  const equipped = prefix.findLast(
    (event) =>
      event.type === "LoadoutEquipped" &&
      (!commandEvent ||
        (event.workstreamId === commandEvent.workstreamId &&
          event.episodeId === at(command, "episodeId"))),
  );
  if (equipped) {
    const graph = optionalObject(at(equipped.payload, "graph"));
    const active = Array.isArray(graph["activeMechanics"])
      ? optionalObject(graph["activeMechanics"][0])
      : {};
    const hash = optionalString(
      at(equipped.payload, "artifactIdentity", "semanticHash"),
    );
    const identity = optionalString(at(graph, "identity", "name"));
    const role = optionalString(at(graph, "role", "name"));
    return {
      ...(hash ? { hash, loadoutHash: hash } : {}),
      hashKind: "LoadoutGraph semantic hash",
      ...(identity ? { identity } : {}),
      ...(role ? { role } : {}),
      authority: optionalObject(
        at(commandEvent?.payload, "authority") ?? active["authorityEnvelope"],
      ),
      sourceEvent: equipped,
      workOrder: optionalObject(
        at(payload, "workOrder") ?? active["workOrder"],
      ),
    };
  }
  return {
    hashKind: "unknown",
    authority: optionalObject(at(commandEvent?.payload, "authority")),
    workOrder: {},
  };
}

const eventEvidence = (
  ctx: ProjectionContext,
  store: StoreSource,
  event: Event | undefined,
) =>
  ctx.ref(
    store.audit.ref,
    event
      ? `event:${event.eventId} (${event.type})`
      : "governedRaw.events: requested field absent",
  );
const matrixId = (store: StoreSource, workstream: string) =>
  id("matrix", `${store.id}:${workstream}`);
const receiptId = (store: StoreSource, record: string) =>
  id("receipt", `${store.id}:${record}`);

function buildCells(
  ctx: ProjectionContext,
  store: StoreSource,
  build: BuildRecord,
) {
  const evidence = eventEvidence(ctx, store, build.sourceEvent);
  return [
    fact("buildHash", "Recorded build hash", build.hash, evidence),
    fact("hashKind", "Hash describes", build.hashKind, evidence),
    fact(
      "loadoutHash",
      "LoadoutGraph semantic hash",
      build.loadoutHash,
      evidence,
      build.hash && !build.loadoutHash
        ? "This actor has a compiled policy or verification capsule; the source records no LoadoutGraph hash"
        : null,
    ),
    fact(
      "allowed",
      "Allowed effects",
      build.authority["allowedEffects"],
      evidence,
    ),
    fact(
      "denied",
      "Denied effects",
      build.authority["deniedEffects"],
      evidence,
    ),
    fact(
      "grantExpiresAt",
      "Recorded grant expiry",
      build.authority["expiresAt"],
      evidence,
      "Recorded bound only; the board does not decide current authority",
    ),
    fact("workOrder", "Work order", build.workOrder["workOrderId"], evidence),
  ];
}

function buildRow(
  ctx: ProjectionContext,
  store: StoreSource,
  build: BuildRecord,
): BoardRow | undefined {
  if (!build.hash) return undefined;
  const evidence = eventEvidence(ctx, store, build.sourceEvent);
  return {
    id: id("recorded-build", `${store.id}:${build.hash}`),
    title: build.identity ?? build.role ?? "Recorded build",
    cells: [
      ...buildCells(ctx, store, build),
      fact("role", "Role", build.role, evidence),
      fact("objective", "Objective", build.workOrder["objective"], evidence),
      fact(
        "requiredEvidence",
        "Required evidence",
        build.workOrder["requiredEvidence"],
        evidence,
      ),
      fact(
        "constraints",
        "Constraints",
        build.workOrder["constraints"],
        evidence,
      ),
      ...(build.loadoutHash
        ? []
        : [
            unknown(
              "editableViews",
              "Three editable views",
              evidence,
              "The compiler exposes editable views for LoadoutGraph, not for this recorded capsule or feedback policy",
            ),
          ]),
    ],
    links: [],
  };
}

export function projectStore(
  ctx: ProjectionContext,
  store: StoreSource,
): {
  actors: BoardSection;
  builds: BoardSection;
  matrices: BoardSection;
  receipts: BoardSection;
} {
  ctx.note(store.status);
  ctx.note(store.audit);
  const builds = new Map<string, BoardRow>();
  const audit =
    store.audit.status === "available" ? store.audit.value : undefined;
  const status =
    store.status.status === "available" ? store.status.value : undefined;
  const events = audit?.governedRaw.events ?? [];
  const buildLink = (build: BuildRecord): BoardLink[] => {
    const row = buildRow(ctx, store, build);
    if (!row) return [];
    builds.set(row.id, row);
    return [{ label: "Inspect recorded build", target: row.id }];
  };
  const proofLinks = (episodeId?: string, commandId?: string): BoardLink[] => [
    ...(status?.acceptanceEvidenceMatrices ?? [])
      .filter(
        (matrix) =>
          !episodeId ||
          matrix.rows.some((row) =>
            row.evaluations.some(
              (evaluation) => evaluation.episodeId === episodeId,
            ),
          ) ||
          events.some(
            (event) =>
              event.type === "VerificationOpened" &&
              at(event.payload, "implementerEpisodeId") === episodeId &&
              event.workstreamId === matrix.workstreamId,
          ),
      )
      .map((matrix) => ({
        label: `Acceptance matrix: ${matrix.workstreamId}`,
        target: matrixId(store, matrix.workstreamId),
      })),
    ...(audit?.receipt.receipts ?? [])
      .filter(
        (receipt) =>
          (commandId && receipt.scope.commandId === commandId) ||
          (episodeId && receipt.scope.episodeId === episodeId),
      )
      .map((receipt) => ({
        label: `${receipt.action}: ${receipt.outcome}`,
        target: receiptId(store, receipt.recordId),
      })),
  ];
  const input =
    status || audit
      ? available(`store:${store.id}`, store)
      : {
          ref: `store:${store.id}`,
          status: "unavailable" as const,
          reason: "Worker status and audit sources are unavailable",
        };
  const actors = ctx.section(
    id("actors", store.id),
    store.label,
    input,
    `store:${store.id}`,
    () => {
      const rows: BoardRow[] = [];
      const usedHostEpisodes = new Set<string>();
      for (const episode of status?.episodes ?? []) {
        const startedAt = events.findIndex(
          (event) =>
            event.type === "WorkerAttemptStarted" &&
            at(event.payload, "workerEpisodeId") === episode.episodeId,
        );
        const start = events[startedAt];
        const build = recordedBuild(
          events,
          episode.commandId,
          startedAt < 0 ? events.length : startedAt,
        );
        const evidence = ctx.ref(
          store.status.ref,
          `episodes:${episode.episodeId}`,
        );
        const startEvidence = eventEvidence(ctx, store, start);
        rows.push({
          id: id("actor", `${store.id}:${episode.episodeId}`),
          title: `${build.identity ?? optionalString(at(start?.payload, "role")) ?? "Worker"} — ${episode.episodeId}`,
          cells: [
            known(
              "kind",
              "Actor kind",
              "model session",
              start ? startEvidence : evidence,
            ),
            fact(
              "identity",
              "Identity",
              build.identity,
              eventEvidence(ctx, store, build.sourceEvent),
            ),
            fact(
              "role",
              "Role",
              at(start?.payload, "role") ?? build.role,
              startEvidence,
            ),
            known("episode", "Episode", episode.episodeId, evidence),
            known("phase", "Recorded episode phase", episode.phase, evidence),
            known("transport", "Transport", episode.transport, evidence),
            known("model", "Selected model", episode.model, evidence),
            fact("effort", "Selected effort", episode.effort, evidence),
            fact(
              "selectionSource",
              "Selection source",
              at(start?.payload, "selectionSource"),
              startEvidence,
            ),
            fact(
              "effectiveModel",
              "Observed effective model",
              at(start?.payload, "effectiveModel"),
              startEvidence,
            ),
            fact(
              "effectiveEffort",
              "Observed effective effort",
              at(start?.payload, "effectiveEffort"),
              startEvidence,
            ),
            known(
              "heartbeat",
              "Last host heartbeat",
              episode.lastHeartbeatAt,
              evidence,
            ),
            known(
              "lease",
              "Recorded lease expiry",
              episode.leaseExpiresAt,
              evidence,
            ),
            ...buildCells(ctx, store, build),
          ],
          links: [
            ...buildLink(build),
            ...proofLinks(episode.episodeId, episode.commandId),
          ],
        });
      }
      for (const [index, event] of events.entries()) {
        if (event.type !== "FeedbackAuditOpened") continue;
        const episode = event.episodeId;
        if (!episode) continue;
        usedHostEpisodes.add(`${event.actorId}:${episode}`);
        const command = events.find(
          (candidate) =>
            candidate.type === "CommandPersisted" &&
            candidate.episodeId === episode,
        );
        const commandId = optionalString(
          at(command?.payload, "command", "commandId"),
        );
        const build = recordedBuild(
          events,
          commandId,
          command ? events.indexOf(command) : index,
        );
        const result = events.findLast(
          (candidate) =>
            candidate.type === "CommandResult" &&
            at(candidate.payload, "commandId") === commandId,
        );
        const evidence = eventEvidence(ctx, store, event);
        rows.push({
          id: id("actor", `${store.id}:${episode}`),
          title: `${event.actorId} — executor`,
          cells: [
            known(
              "kind",
              "Actor kind",
              "script",
              evidence,
              "FeedbackAuditOpened is the fixed host executor's recorded dispatch",
            ),
            known("identity", "Identity", event.actorId, evidence),
            known("role", "Role", "executor", evidence),
            known("episode", "Episode", episode, evidence),
            fact(
              "phase",
              "Recorded episode phase",
              result ? "result-recorded" : undefined,
              eventEvidence(ctx, store, result),
              "The script has an audit result, not a worker lease lifecycle",
            ),
            unknown(
              "transport",
              "Transport",
              evidence,
              "A fixed host script executes this audit",
            ),
            unknown(
              "model",
              "Selected model",
              evidence,
              "This executor is a script",
            ),
            unknown(
              "effort",
              "Selected effort",
              evidence,
              "This executor is a script",
            ),
            unknown("heartbeat", "Last host heartbeat", evidence),
            unknown("lease", "Recorded lease expiry", evidence),
            ...buildCells(ctx, store, build),
          ],
          links: [...buildLink(build), ...proofLinks(episode, commandId)],
        });
      }
      // Preserve other recorded actor identities without interpreting their names
      // as human/model/host classifications or inventing an episode lifecycle.
      const other = new Map<string, Event>();
      for (const event of events)
        if (!usedHostEpisodes.has(`${event.actorId}:${event.episodeId ?? ""}`))
          other.set(event.actorId, event);
      for (const [actor, event] of other) {
        const evidence = eventEvidence(ctx, store, event);
        rows.push({
          id: id("recorded-actor", `${store.id}:${actor}`),
          title: actor,
          cells: [
            known("identity", "Recorded actor id", actor, evidence),
            unknown("kind", "Actor kind", evidence),
            unknown("role", "Role", evidence),
            fact("episode", "Last event episode", event.episodeId, evidence),
            known("lastAction", "Last recorded action", event.type, evidence),
            known(
              "lastActionAt",
              "Recorded action time",
              event.occurredAt,
              evidence,
            ),
            unknown(
              "phase",
              "Episode phase",
              evidence,
              "An event actor id alone does not establish worker liveness",
            ),
          ],
          links: proofLinks(event.episodeId),
        });
      }
      return rows;
    },
  );
  const matrices = ctx.section(
    id("matrices", store.id),
    `Acceptance evidence — ${store.label}`,
    store.status,
    store.status.ref,
    (value) =>
      value.acceptanceEvidenceMatrices.map((matrix) => {
        const evidence = ctx.ref(
          store.status.ref,
          `acceptanceEvidenceMatrices:${matrix.workstreamId}`,
        );
        return {
          id: matrixId(store, matrix.workstreamId),
          title: matrix.workstreamId,
          cells: [
            known("phase", "Matrix phase", matrix.phase, evidence),
            fact(
              "subject",
              "Subject revision",
              matrix.subjectRevision,
              evidence,
            ),
            ...matrix.rows.flatMap((row) => {
              const refs = ctx.ref(
                store.status.ref,
                `acceptanceEvidenceMatrices:${matrix.workstreamId}/criterion:${row.criterion.criterionId}`,
              );
              const latest = row.evaluations.at(-1);
              return [
                known(
                  `${row.criterion.criterionId}.criterion`,
                  "Acceptance criterion",
                  row.criterion.description,
                  refs,
                ),
                known(
                  `${row.criterion.criterionId}.status`,
                  "Acceptance status",
                  row.status,
                  refs,
                ),
                known(
                  `${row.criterion.criterionId}.claimType`,
                  "Claim type",
                  row.criterion.claimType,
                  refs,
                ),
                known(
                  `${row.criterion.criterionId}.source`,
                  "Evidence source",
                  row.criterion.evidenceSource,
                  refs,
                ),
                fact(
                  `${row.criterion.criterionId}.verifier`,
                  "Producing verifier episode",
                  latest?.episodeId,
                  refs,
                ),
                fact(
                  `${row.criterion.criterionId}.stale`,
                  "Evidence stale",
                  latest?.stale,
                  refs,
                ),
                fact(
                  `${row.criterion.criterionId}.evidence`,
                  "Evidence references",
                  latest?.evidenceRefs,
                  refs,
                ),
              ];
            }),
          ],
          links: [],
        };
      }),
  );
  const receipts = ctx.section(
    id("receipts", store.id),
    `Audit receipts — ${store.label}`,
    store.audit,
    store.audit.ref,
    (value) =>
      value.receipt.receipts.map((receipt) => {
        const evidence = ctx.ref(
          store.audit.ref,
          `receipt:${receipt.recordId}; ${receipt.evidenceLinks.join(", ")}`,
        );
        return {
          id: receiptId(store, receipt.recordId),
          title: `${receipt.action} — ${receipt.outcome}`,
          cells: [
            known("action", "Action", receipt.action, evidence),
            known("outcome", "Recorded outcome", receipt.outcome, evidence),
            known("actor", "Recorded actor", receipt.actor, evidence),
            fact("episode", "Episode", receipt.scope.episodeId, evidence),
            fact("command", "Command", receipt.scope.commandId, evidence),
            fact(
              "decision",
              "Authority decision",
              receipt.authority?.decision,
              evidence,
            ),
            fact(
              "reason",
              "Authority reason",
              receipt.authority?.reason,
              evidence,
            ),
            known(
              "events",
              "Canonical events",
              receipt.evidenceLinks,
              evidence,
            ),
          ],
          links: [],
        };
      }),
  );
  return {
    actors,
    matrices,
    receipts,
    builds: {
      id: id("recorded-builds", store.id),
      title: `Recorded builds — ${store.label}`,
      status: actors.status,
      explanation:
        actors.status === "unavailable"
          ? actors.explanation
          : builds.size
            ? null
            : "The source records no compiled build identity",
      rows: [...builds.values()],
    },
  };
}

const completionRoles: Readonly<Record<string, string>> = {
  ImplementationReady: "executor",
  RepairCompleted: "executor (repair)",
  VerificationCompleted: "verifier",
  FinalReviewCompleted: "final reviewer",
};
const operatorRequests = new Set([
  "WorkOrderActivated",
  "VerificationRequested",
  "FinalReviewRequested",
  "RepairRequested",
]);

export function projectControlActors(
  ctx: ProjectionContext,
  sources: BoardSources,
): BoardSection {
  return ctx.section(
    "control-actors",
    "People and recorded workflow actors",
    sources.controlLog,
    "control:canonical-segments",
    (documents) => {
      const rows: BoardRow[] = [];
      const requests = new Map<
        string,
        { ref: string; ordinal: number; event: Record<string, unknown> }[]
      >();
      for (const doc of documents)
        for (const [index, item] of array(doc.value).entries()) {
          const event = object(item);
          const action = string(event["type"]),
            order = string(event["workOrderId"]);
          const evidence = ctx.ref(
            doc.ref,
            `append:${index + 1} (${action}, ${order})`,
          );
          const actor = optionalObject(event["actor"]);
          if (Object.keys(actor).length)
            rows.push({
              id: id("control-actor", `${doc.ref}:${index + 1}`),
              title: `${optionalString(actor["model"]) ?? "Actor"} — ${completionRoles[action] ?? "recorded role"}`,
              cells: [
                known(
                  "kind",
                  "Actor kind",
                  actor["harness"] === "human"
                    ? "person"
                    : "recorded workflow actor",
                  evidence,
                ),
                unknown(
                  "identity",
                  "Person or session identity",
                  evidence,
                  "Harness and model fields do not identify a unique person or session",
                ),
                fact(
                  "role",
                  "Recorded role",
                  completionRoles[action],
                  evidence,
                ),
                known("workOrder", "Work order", order, evidence),
                known("lastAction", "Last recorded action", action, evidence),
                fact(
                  "lastActionAt",
                  "Recorded action time",
                  event["recordedAt"],
                  evidence,
                ),
                ...[
                  "harness",
                  "harnessVersion",
                  "model",
                  "effort",
                  "source",
                ].map((key) =>
                  fact(
                    key,
                    {
                      harness: "Harness",
                      harnessVersion: "Harness version",
                      model: "Recorded model",
                      effort: "Recorded effort",
                      source: "How the selection was recorded",
                    }[key]!,
                    actor[key],
                    evidence,
                  ),
                ),
                fact(
                  "report",
                  "Evidence report",
                  event["reportPath"],
                  evidence,
                ),
                unknown(
                  "phase",
                  "Episode phase",
                  evidence,
                  "A completed workflow action is not a live session observation",
                ),
              ],
              links: [],
            });
          else if (operatorRequests.has(action))
            requests.set(order, [
              ...(requests.get(order) ?? []),
              { ref: doc.ref, ordinal: index + 1, event },
            ]);
        }
      for (const [order, events] of requests) {
        const last = events.at(-1)!;
        const refs = events.flatMap(({ ref, ordinal }) =>
          ctx.ref(ref, `append:${ordinal}`),
        );
        const protocol = ctx.ref(
          "docs/product/07-execution-guide.md",
          "Operator resume phrases — operator dispatch role",
        );
        rows.push({
          id: id("operator", order),
          title: `Operator — identity not recorded (${order})`,
          cells: [
            known(
              "kind",
              "Actor kind",
              "person role",
              [...refs, ...protocol],
              "The workflow defines an operator role; these events do not identify their author or prove that the requests came from one person",
            ),
            unknown("identity", "Identity", refs),
            unknown("authorship", "Who issued these requests", refs),
            known("role", "Role", "operator", [...refs, ...protocol]),
            known("workOrder", "Work order", order, refs),
            known(
              "actions",
              "Recorded requests",
              events.map(({ event }) => string(event["type"])),
              refs,
            ),
            known(
              "lastAction",
              "Last recorded request",
              string(last.event["type"]),
              ctx.ref(last.ref, `append:${last.ordinal}`),
            ),
            fact(
              "lastActionAt",
              "Recorded request time",
              last.event["recordedAt"],
              ctx.ref(last.ref, `append:${last.ordinal}`),
            ),
            unknown(
              "phase",
              "Episode phase",
              refs,
              "No person presence or attention is inferred",
            ),
          ],
          links: refs.map((target) => ({ label: "Recorded request", target })),
        });
      }
      return rows;
    },
  );
}
