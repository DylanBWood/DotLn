import {
  assertMissionSubjectExtends,
  isMissionCheckRequest,
  validateMissionCheckRequest,
  validateMissionCheckResult,
  type MissionCheckObserved,
  type MissionCheckRequest,
  type MissionCheckSubject,
} from "./mission-check-protocol.js";
import {
  isWriterRequest,
  validateRequest,
  validateWriterRequest,
  parseWorkerResult,
  parseStoredWriterResult,
  type WorkerRequest,
  type WriterRequest,
  type WorkerResult,
  type WriterResult,
} from "./worker-protocol.js";
import type { CodexEpisodeIsolation } from "./worker-transport.js";

export type CliTransport = "claude-cli-print" | "codex-cli-exec";
export interface CliActorSpec {
  transport: CliTransport;
  request: WorkerRequest | WriterRequest | MissionCheckRequest;
}
export const DETACHED_LAUNCH_ROWS = {
  "claude-cli-print": {
    row: "C-U1",
    label: "observed",
    reason: "detached parent, stored CLI authentication; lifetime unknown",
  },
  "codex-cli-exec": {
    row: "X-U1",
    label: "observed",
    reason: "detached parent, stored CLI authentication; lifetime unknown",
  },
} as const;
export interface CliLaunchClaims {
  transport: CliTransport;
  row: string;
  profileId: string;
  model: string;
  effort: string;
  harnessVersion: string;
  origin: "actor";
  episodeId: string;
}
export interface CliActorObservation {
  launch: CliLaunchClaims;
  result?: WorkerResult | WriterResult | MissionCheckObserved;
  failure?: string;
  /** Only a mission check: the capsule this episode actually judged, which
   * completes the pinned one with a dispatch-time observation. */
  subject?: MissionCheckSubject;
  /** Only a Codex episode: its isolated-home record (WO-159). */
  isolation?: CodexEpisodeIsolation;
}
/** Shape only: an unequal digest pair is an observation, not a refusal. */
function isolationShaped(value: unknown): boolean {
  const v = value as CodexEpisodeIsolation;
  const digest = /^(?:sha256:[0-9a-f]{64}|absent|unknown)$/u;
  const pair = (p: unknown) =>
    !!p &&
    typeof p === "object" &&
    Object.keys(p).sort().join() === "after,before" &&
    digest.test(String((p as { before: unknown }).before)) &&
    digest.test(String((p as { after: unknown }).after));
  return (
    !!v &&
    typeof v === "object" &&
    Object.keys(v).sort().join() ===
      "authentication,home,homeRemoved,isolatedTrustEntries,schemaVersion,trustTable,userConfig" &&
    v.schemaVersion === 1 &&
    /^sha256:[0-9a-f]{64}$/u.test(String(v.home)) &&
    ["symlink", "absent"].includes(v.authentication) &&
    pair(v.userConfig) &&
    pair(v.trustTable) &&
    (v.isolatedTrustEntries === null ||
      (Number.isSafeInteger(v.isolatedTrustEntries) &&
        v.isolatedTrustEntries >= 0)) &&
    typeof v.homeRemoved === "boolean"
  );
}
export function assertCliActorSpec(
  value: unknown,
): asserts value is CliActorSpec {
  const v = value as CliActorSpec;
  if (
    !v ||
    typeof v !== "object" ||
    Array.isArray(v) ||
    Object.keys(v).some((k) => !["transport", "request"].includes(k)) ||
    !Object.hasOwn(DETACHED_LAUNCH_ROWS, v.transport) ||
    !v.request
  )
    throw new Error("invalid CLI actor declaration");
  if (isMissionCheckRequest(v.request)) validateMissionCheckRequest(v.request);
  else if (isWriterRequest(v.request)) validateWriterRequest(v.request);
  else validateRequest(v.request);
}
/** A mission check is rebuilt around its dispatch-time capsule by the episode
 * host, because its authorization is bound to the subject hash. */
export function cliActorRequest(spec: CliActorSpec, episodeId: string) {
  return { ...spec.request, episodeId };
}
export function assertCliObservation(
  value: unknown,
  spec: CliActorSpec,
  episodeId: string,
): asserts value is CliActorObservation {
  const v = value as CliActorObservation;
  const launch = v?.launch;
  if (
    !v ||
    !launch ||
    Object.keys(v).some(
      (k) =>
        !["launch", "result", "failure", "subject", "isolation"].includes(k),
    ) ||
    Object.keys(launch).some(
      (k) =>
        ![
          "transport",
          "row",
          "profileId",
          "model",
          "effort",
          "harnessVersion",
          "origin",
          "episodeId",
        ].includes(k),
    ) ||
    launch.transport !== spec.transport ||
    launch.row !== DETACHED_LAUNCH_ROWS[spec.transport].row ||
    launch.profileId !== spec.request.profile.profileId ||
    launch.model !== spec.request.model ||
    launch.effort !== spec.request.effort ||
    launch.origin !== "actor" ||
    launch.episodeId !== episodeId ||
    typeof launch.harnessVersion !== "string" ||
    !launch.harnessVersion ||
    (v.result === undefined) === (v.failure === undefined) ||
    (v.isolation !== undefined &&
      (spec.transport !== "codex-cli-exec" || !isolationShaped(v.isolation)))
  )
    throw new Error("invalid CLI actor observation");
  if (
    v.failure !== undefined &&
    ![
      "model-unavailable",
      "transport-failed",
      "interrupted",
      "invalid-result",
      "deadline-exceeded",
      "output-limit",
      "profile-refused",
      "supervisor-lost",
    ].includes(v.failure)
  )
    throw new Error("invalid CLI failure code");
  if (isMissionCheckRequest(spec.request)) {
    // The pinned capsule may be completed by a dispatch-time observation; it
    // may never be replaced, and the judgment is validated against what ran.
    // A launch that failed before observing carries no capsule and no result.
    if (v.subject === undefined) {
      if (v.result !== undefined)
        throw new Error("mission judgment without its observed capsule");
      return;
    }
    assertMissionSubjectExtends(spec.request.subject, v.subject);
    if (v.result !== undefined) validateMissionCheckResult(v.result, v.subject);
    return;
  }
  if (v.subject !== undefined)
    throw new Error("mission capsule on another CLI actor");
  const request = { ...spec.request, episodeId };
  if (v.result !== undefined) {
    if (isWriterRequest(request)) parseStoredWriterResult(v.result, request);
    else parseWorkerResult(v.result, request as WorkerRequest);
  }
}
