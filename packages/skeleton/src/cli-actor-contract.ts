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

export type CliTransport = "claude-cli-print" | "codex-cli-exec";
export interface CliActorSpec {
  transport: CliTransport;
  request: WorkerRequest | WriterRequest;
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
  result?: WorkerResult | WriterResult;
  failure?: string;
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
  if (isWriterRequest(v.request)) validateWriterRequest(v.request);
  else validateRequest(v.request);
}
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
    Object.keys(v).some((k) => !["launch", "result", "failure"].includes(k)) ||
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
    (v.result === undefined) === (v.failure === undefined)
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
  const request = cliActorRequest(spec, episodeId);
  if (v.result !== undefined) {
    if (isWriterRequest(request)) parseStoredWriterResult(v.result, request);
    else parseWorkerResult(v.result, request);
  }
}
