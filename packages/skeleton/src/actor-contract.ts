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
};
export interface ActorResult {
  exitCode: number | null;
  signal: string | null;
  stdoutSha256: string;
  firstLine: string;
  verified: boolean;
  reason: string;
}
export interface ActorRun {
  completed: Promise<ActorResult>;
  kill(): void;
}
export function assertActorResult(
  value: unknown,
): asserts value is ActorResult {
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw new Error("invalid script observation");
  const v = value as ActorResult;
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
  available(): string | null;
  run(spec: ActorSpec): ActorRun;
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
      typeof v.expectedStdoutSha256 !== "string" ||
      !/^[a-f0-9]{64}$/u.test(v.expectedStdoutSha256))
  )
    throw new Error(
      "script requires absolute command/cwd, bounded timeout and expected stdout SHA-256",
    );
}
