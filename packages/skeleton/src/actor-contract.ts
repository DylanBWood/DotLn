import {
  decodeDiscoveryReport,
  discoveryOutputSha256,
  type DiscoveryReport,
} from "./work-candidate.js";
import {
  assertCliActorSpec,
  assertCliObservation,
  type CliActorSpec,
  type CliActorObservation,
} from "./cli-actor-contract.js";
import {
  assertHandoffQuestion,
  type HandoffQuestion,
  type HandoffPacket,
} from "./handoff-contract.js";
import {
  assertLocalModelActorSpec,
  assertLocalModelObservation,
  type LocalModelActorSpec,
  type LocalModelObservation,
} from "./local-model-contract.js";
/** Pure actor declarations and persisted-result validation; no process access. */
export const ACTOR_KINDS = [
  "script",
  "cli-worker",
  "human-handoff",
  "local-model",
] as const;
export type ActorKind = (typeof ACTOR_KINDS)[number];
export type ActorSpec = {
  kind: ActorKind;
  effect: string;
  surface: string;
  resources: Record<string, number>;
  command?: readonly string[];
  cwd?: string;
  timeoutMs?: number;
  expectedStdoutSha256?: string;
  outputContract?: "work-candidates-v1";
  worker?: CliActorSpec;
  handoff?: HandoffQuestion;
  local?: LocalModelActorSpec;
};
export interface ActorResult {
  worker?: CliActorObservation;
  local?: LocalModelObservation;
  discovery?: DiscoveryReport;
  exitCode: number | null;
  signal: string | null;
  stdoutSha256: string;
  firstLine: string;
  verified: boolean;
  reason: string;
}
export interface ActorRun {
  handoff?: HandoffPacket;
  completed: Promise<ActorResult>;
  kill(): void;
}
export function assertActorResult(
  value: unknown,
): asserts value is ActorResult {
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw new Error("invalid script observation");
  const v = value as ActorResult;
  if (v.discovery !== undefined) decodeDiscoveryReport(v.discovery);
  if (
    (v.exitCode !== null &&
      (!Number.isSafeInteger(v.exitCode) || v.exitCode < 0)) ||
    (v.signal !== null && typeof v.signal !== "string") ||
    typeof v.stdoutSha256 !== "string" ||
    !/^[a-f0-9]{64}$/u.test(v.stdoutSha256) ||
    typeof v.firstLine !== "string" ||
    v.firstLine.length > 160 ||
    /[\r\n]/u.test(v.firstLine) ||
    typeof v.verified !== "boolean" ||
    typeof v.reason !== "string" ||
    !v.reason
  )
    throw new Error("invalid script observation fields");
}
export interface ActorAdapter {
  kind: ActorKind;
  available(spec?: ActorSpec): string | null;
  run(
    spec: ActorSpec,
    context?: { residentStore: string; episodeId: string },
  ): ActorRun;
}
export const SCRIPT_SANDBOX = "(version 1)(allow default)(deny network*)";
export function assertActorSpec(value: unknown): asserts value is ActorSpec {
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw new Error("invalid resident actor");
  const v = value as Record<string, unknown>;
  if (
    Object.keys(v).some(
      (key) =>
        ![
          "kind",
          "effect",
          "surface",
          "resources",
          "command",
          "cwd",
          "timeoutMs",
          "expectedStdoutSha256",
          "outputContract",
          "worker",
          "handoff",
          "local",
        ].includes(key),
    ) ||
    !ACTOR_KINDS.includes(v.kind as ActorKind) ||
    typeof v.effect !== "string" ||
    !v.effect ||
    typeof v.surface !== "string" ||
    !v.surface ||
    !v.resources ||
    typeof v.resources !== "object" ||
    Array.isArray(v.resources) ||
    Object.values(v.resources).some(
      (amount) => !Number.isSafeInteger(amount) || Number(amount) < 0,
    )
  )
    throw new Error("invalid resident actor declaration");
  if (v.kind === "cli-worker") {
    assertCliActorSpec(v.worker);
    if (
      v.worker.request.command.intent.kind !== "Act" ||
      v.worker.request.command.intent.effect !== v.effect
    )
      throw new Error("CLI actor effect differs from request");
  } else if (v.worker !== undefined)
    throw new Error("worker request on another actor kind");
  if (v.kind === "human-handoff") assertHandoffQuestion(v.handoff);
  else if (v.handoff !== undefined)
    throw new Error("handoff question on another actor kind");
  // An endpoint declaration is optional: the operator's local endpoint may not
  // exist yet, and availability is a separate row. A declared one is validated,
  // and an actor without one reports unavailable rather than refusing the whole
  // configuration.
  if (v.kind === "local-model") {
    if (v.local !== undefined) {
      assertLocalModelActorSpec(v.local);
      if (
        v.local.request.command.intent.kind !== "Act" ||
        v.local.request.command.intent.effect !== v.effect
      )
        throw new Error("local-model actor effect differs from request");
    }
  } else if (v.local !== undefined)
    throw new Error("local endpoint request on another actor kind");
  if (
    v.kind === "script" &&
    (!Array.isArray(v.command) ||
      !v.command.length ||
      v.command.length > 256 ||
      v.command.some(
        (part) =>
          typeof part !== "string" ||
          part.length > 16384 ||
          part.includes("\0"),
      ) ||
      !v.command[0].startsWith("/") ||
      typeof v.cwd !== "string" ||
      !v.cwd.startsWith("/") ||
      v.cwd.includes("\0") ||
      !Number.isSafeInteger(v.timeoutMs) ||
      Number(v.timeoutMs) <= 0 ||
      Number(v.timeoutMs) > 180000 ||
      !(v.outputContract === "work-candidates-v1"
        ? v.expectedStdoutSha256 === undefined
        : v.outputContract === undefined &&
          typeof v.expectedStdoutSha256 === "string" &&
          /^[a-f0-9]{64}$/u.test(v.expectedStdoutSha256)))
  )
    throw new Error(
      "script requires absolute command/cwd, bounded timeout and exactly one output contract",
    );
}

/** Schema verification is an observation contract, never repair verification. */
export function scriptResultVerified(
  spec: ActorSpec,
  result: ActorResult,
  episodeId?: string,
): boolean {
  if (spec.kind === "cli-worker") {
    assertCliObservation(
      result.worker,
      spec.worker!,
      episodeId ?? result.worker?.launch.episodeId ?? "",
    );
    return false; // A harness completion claim is not independent verification.
  }
  if (result.worker !== undefined)
    throw new Error("CLI result on another actor kind");
  if (spec.kind === "local-model") {
    if (!spec.local)
      throw new Error("local-model result without a declared endpoint");
    assertLocalModelObservation(
      result.local,
      spec.local,
      episodeId ?? result.local?.launch.episodeId ?? "",
    );
    return false; // A local completion claim is not independent verification.
  }
  if (result.local !== undefined)
    throw new Error("local-model result on another actor kind");
  if (spec.kind !== "script") return false;
  if (spec.outputContract === "work-candidates-v1") {
    if (result.discovery === undefined) return false;
    decodeDiscoveryReport(result.discovery);
    if (result.stdoutSha256 !== discoveryOutputSha256(result.discovery))
      throw new Error("discovery digest differs from structured output");
    if (result.firstLine !== JSON.stringify(result.discovery).slice(0, 160))
      throw new Error("discovery first line differs from structured output");
  } else if (result.discovery !== undefined) {
    throw new Error("discovery result on a digest-only actor");
  }
  return (
    result.exitCode === 0 &&
    result.signal === null &&
    result.reason === "completed" &&
    (spec.outputContract === "work-candidates-v1" ||
      result.stdoutSha256 === spec.expectedStdoutSha256)
  );
}
