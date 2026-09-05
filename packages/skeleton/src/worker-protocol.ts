import type { Command, ResultEnvelope, WorkOrder } from "@dotln/kernel";
import type { ArtifactIdentityV1 } from "@dotln/compiler";
import type { Candidate } from "./reactor.js";
import type { FixtureTree } from "./scenario.js";

export type WorkerTransportName = "claude-cli-print" | "codex-cli-exec";
export type WorkerEffort =
  "low" | "medium" | "high" | "xhigh" | "max" | "unknown";

export type { CommandReceipt, ResultEnvelope } from "@dotln/kernel";

export interface WorkerResult {
  readonly envelope: ResultEnvelope;
  readonly candidates: readonly Candidate[];
  readonly beaconClaim: "inspection-completed" | "blocked";
}

export interface WorkerRequest {
  readonly command: Command;
  readonly workOrder: WorkOrder;
  readonly artifactIdentity: ArtifactIdentityV1;
  readonly episodeId: string;
  readonly model: string;
  readonly effort: WorkerEffort;
  readonly cwd: string;
  readonly fixture: FixtureTree;
  readonly profile: {
    readonly profileId: "fixture-inspection-v1";
    readonly mounts: readonly [
      { readonly path: string; readonly access: "read" },
    ];
  };
}

export const HEARTBEAT_MS = 1_000;
export const LEASE_MS = 5_000;
export const WORKER_TIMEOUT_MS = 180_000;

export class WorkerFailure extends Error {
  constructor(
    readonly code:
      | "model-unavailable"
      | "transport-failed"
      | "interrupted"
      | "invalid-result"
      | "deadline-exceeded"
      | "output-limit"
      | "profile-refused",
    readonly detail?: string,
  ) {
    super(detail ? `${code}: ${detail}` : code);
  }
}

const object = (value: unknown): Record<string, unknown> | undefined =>
  value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : undefined;
const line = (value: unknown, max: number): value is string =>
  typeof value === "string" &&
  value.length > 0 &&
  value.length <= max &&
  !/[\u0000-\u001f\u007f\u2028\u2029]/u.test(value);
const keys = (value: Record<string, unknown>, expected: readonly string[]) =>
  Object.keys(value).sort().join(",") === [...expected].sort().join(",");
export const resultId = (command: Command): string =>
  `result_${command.commandId}`;

export function workerResultSchema(request: WorkerRequest): object {
  const text = { type: "string" };
  return {
    type: "object",
    additionalProperties: false,
    required: ["envelope", "candidates", "beaconClaim"],
    properties: {
      envelope: {
        type: "object",
        additionalProperties: false,
        required: [
          "workOrderId",
          "episodeId",
          "status",
          "resultId",
          "summary",
          "requiresHuman",
        ],
        properties: {
          workOrderId: { ...text, enum: [request.workOrder.workOrderId] },
          episodeId: { ...text, enum: [request.episodeId] },
          resultId: { ...text, enum: [resultId(request.command)] },
          status: { ...text, enum: ["completed", "blocked", "failed"] },
          summary: text,
          requiresHuman: { type: "boolean" },
        },
      },
      candidates: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          required: ["path", "classification", "evidence"],
          properties: {
            path: text,
            classification: text,
            evidence: { type: "array", items: text },
          },
        },
      },
      beaconClaim: { ...text, enum: ["inspection-completed", "blocked"] },
    },
  };
}

/** Validate again at the host boundary; a vendor schema claim is not validation. */
export function parseWorkerResult(
  value: unknown,
  request: WorkerRequest,
): WorkerResult {
  const root = object(value);
  const envelope = object(root?.envelope);
  if (
    !root ||
    !envelope ||
    !keys(root, ["envelope", "candidates", "beaconClaim"]) ||
    !keys(envelope, [
      "workOrderId",
      "episodeId",
      "status",
      "resultId",
      "summary",
      "requiresHuman",
    ]) ||
    envelope.workOrderId !== request.workOrder.workOrderId ||
    envelope.episodeId !== request.episodeId ||
    envelope.resultId !== resultId(request.command) ||
    !["completed", "blocked", "failed"].includes(String(envelope.status)) ||
    !line(envelope.summary, 320) ||
    typeof envelope.requiresHuman !== "boolean" ||
    !["inspection-completed", "blocked"].includes(String(root.beaconClaim)) ||
    !Array.isArray(root.candidates) ||
    root.candidates.length > 100
  )
    throw new WorkerFailure(
      "invalid-result",
      !root
        ? "result-object-absent"
        : !envelope
          ? "envelope-object-absent"
          : "envelope-or-root-contract",
    );
  const seen = new Set<string>();
  for (const candidate of root.candidates) {
    const entry = object(candidate);
    if (
      !entry ||
      !keys(entry, ["path", "classification", "evidence"]) ||
      !line(entry.path, 256) ||
      !request.fixture.files.some((file) => file.path === entry.path) ||
      seen.has(entry.path) ||
      !line(entry.classification, 100) ||
      !Array.isArray(entry.evidence) ||
      entry.evidence.length < 1 ||
      entry.evidence.length > 10 ||
      !entry.evidence.every((item) => line(item, 320))
    )
      throw new WorkerFailure("invalid-result", "candidate-contract");
    seen.add(entry.path);
  }
  return root as unknown as WorkerResult;
}

export function workerPrompt(request: WorkerRequest): string {
  // Compiled WorkOrder plus explicitly mounted inventory, never transcript history.
  return JSON.stringify({
    workOrder: request.workOrder,
    artifactReceipt: {
      semanticHash: request.artifactIdentity.semanticHash,
      compilerContractVersion: request.artifactIdentity.compilerContractVersion,
      compilerPackageVersion: request.artifactIdentity.compilerPackageVersion,
    },
    episodeId: request.episodeId,
    resultId: resultId(request.command),
    inventory: request.fixture,
    outputInstructions:
      "This is the executor inspection phase. The supplied inventory is the complete mounted sense projection; no file opening or tools are needed. Inspect it and propose only generated-stale files with no references. Evidence uses inventory:<path>, classification:<classification>, references:none. The host handles deletion refusal and independent verification separately. Set status completed when your inspection and candidate proposal are complete; this is a self-report, not verified completion. Set requiresHuman only when an operator decision is needed. Return the schema object and keep summary under 320 characters. No other context or tool access is granted.",
  });
}

export function validateRequest(request: WorkerRequest): void {
  if (
    request.command.intent.kind !== "Act" ||
    request.command.intent.effect !== "repo.inspect" ||
    !line(request.model, 100) ||
    !/^[a-zA-Z0-9][a-zA-Z0-9._:-]*$/u.test(request.model) ||
    !/^[a-zA-Z0-9_-]+$/u.test(request.episodeId) ||
    request.profile.profileId !== "fixture-inspection-v1" ||
    request.profile.mounts.length !== 1 ||
    request.profile.mounts[0].path !== request.cwd ||
    request.profile.mounts[0].access !== "read" ||
    !request.workOrder.prohibitedOperations.includes("repo.write") ||
    !request.workOrder.prohibitedOperations.includes("repo.delete")
  )
    throw new WorkerFailure("profile-refused");
}
