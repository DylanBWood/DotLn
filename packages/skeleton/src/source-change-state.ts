import { canonicalStringify } from "@dotln/compiler";
import type { Decision, Event } from "@dotln/kernel";

export type FocusedTestResult = {
  readonly command: string;
  readonly exitCode: number | null;
  readonly signal: string | null;
  readonly stdoutHash: string;
  readonly stderrHash: string;
};
export type SourceChangeRequested = {
  readonly workOrderId: string;
  readonly repo: string;
  readonly baseCommit: string;
  readonly branch: string;
  readonly surfaces: readonly string[];
};
export type SourceChangeObserved = {
  readonly workOrderId: string;
  readonly commit: string;
  readonly branch: string;
  readonly diffHash: string;
  readonly testBefore: FocusedTestResult;
  readonly testAfter: FocusedTestResult;
};
export type SourceChangeRefused = {
  readonly workOrderId: string;
  readonly reason: string;
};
export type SourceChangeSlice = {
  readonly workstreamId?: string;
  readonly request?: SourceChangeRequested;
  readonly observation?: SourceChangeObserved;
  readonly refusal?: SourceChangeRefused;
};
export const sourceChangeEventTypes = [
  "SourceChangeRequested",
  "SourceChangeObserved",
  "SourceChangeRefused",
] as const;
export const SOURCE_CHANGE_HOST = "source-change-host";

function record(
  value: unknown,
  fields: readonly string[],
): Record<string, unknown> {
  if (value === null || typeof value !== "object" || Array.isArray(value))
    throw new Error("source-change payload must be an object");
  const object = value as Record<string, unknown>;
  if (Object.keys(object).sort().join(",") !== [...fields].sort().join(","))
    throw new Error(
      `source-change payload requires exactly ${fields.join(", ")}`,
    );
  return object;
}
function line(value: unknown): asserts value is string {
  if (
    typeof value !== "string" ||
    !value ||
    value.length > 4096 ||
    /[\u0000-\u001f\u007f]/u.test(value)
  )
    throw new Error("source-change payload requires a nonempty line");
}
export function assertSourceCommit(value: unknown): asserts value is string {
  if (
    typeof value !== "string" ||
    !/^(?:[a-f0-9]{40}|[a-f0-9]{64})$/u.test(value)
  )
    throw new Error("source-change commit must be an immutable Git identity");
}
function digest(value: unknown): void {
  if (typeof value !== "string" || !/^[a-f0-9]{64}$/u.test(value))
    throw new Error("source-change digest must be SHA-256");
}
export function assertSourceSurface(value: unknown): asserts value is string {
  line(value);
  if (
    value.startsWith("/") ||
    value.includes("\\") ||
    value
      .split("/")
      .some((part) => !part || part === "." || part === ".." || part === ".git")
  )
    throw new Error(
      "source-change surface must be a relative file or directory",
    );
}
export function decodeFocusedTest(value: unknown): FocusedTestResult {
  const item = record(value, [
    "command",
    "exitCode",
    "signal",
    "stdoutHash",
    "stderrHash",
  ]);
  line(item.command);
  if (
    item.exitCode !== null &&
    (!Number.isSafeInteger(item.exitCode) || Number(item.exitCode) < 0)
  )
    throw new Error("source-change test exit code is invalid");
  if (item.signal !== null) line(item.signal);
  if (item.exitCode === null && item.signal === null)
    throw new Error("source-change test lacks an outcome");
  digest(item.stdoutHash);
  digest(item.stderrHash);
  return item as unknown as FocusedTestResult;
}
export function decodeSourceRequest(value: unknown): SourceChangeRequested {
  const item = record(value, [
    "workOrderId",
    "repo",
    "baseCommit",
    "branch",
    "surfaces",
  ]);
  line(item.workOrderId);
  line(item.repo);
  line(item.branch);
  assertSourceCommit(item.baseCommit);
  if (
    !Array.isArray(item.surfaces) ||
    !item.surfaces.length ||
    new Set(item.surfaces).size !== item.surfaces.length
  )
    throw new Error("source-change surfaces must be unique and nonempty");
  for (const surface of item.surfaces) assertSourceSurface(surface);
  return item as unknown as SourceChangeRequested;
}
export function decodeSourceObservation(value: unknown): SourceChangeObserved {
  const item = record(value, [
    "workOrderId",
    "commit",
    "branch",
    "diffHash",
    "testBefore",
    "testAfter",
  ]);
  line(item.workOrderId);
  line(item.branch);
  assertSourceCommit(item.commit);
  digest(item.diffHash);
  const before = decodeFocusedTest(item.testBefore);
  const after = decodeFocusedTest(item.testAfter);
  if (before.command !== after.command)
    throw new Error("source-change focused test changed");
  return item as unknown as SourceChangeObserved;
}
export function decodeSourceRefusal(value: unknown): SourceChangeRefused {
  const item = record(value, ["workOrderId", "reason"]);
  line(item.workOrderId);
  line(item.reason);
  return item as unknown as SourceChangeRefused;
}
export const sameSourceValue = (left: unknown, right: unknown): boolean =>
  canonicalStringify(left) === canonicalStringify(right);

/** The host observes effects. This fold neither performs nor verifies a change. */
export function sourceChangeDecision(
  state: SourceChangeSlice,
  event: Event,
): Decision<SourceChangeSlice> {
  let next = state;
  let branch = "observed";
  if (sourceChangeEventTypes.some((type) => event.type === type)) {
    if (event.actorId !== SOURCE_CHANGE_HOST)
      throw new Error("source-change event requires the host actor");
    if (
      state.workstreamId !== undefined &&
      event.workstreamId !== state.workstreamId
    )
      throw new Error("source-change workstream mismatch");
    if (event.type === "SourceChangeRequested") {
      const request = decodeSourceRequest(event.payload);
      if (state.request && !sameSourceValue(state.request, request))
        throw new Error("source-change request drift");
      next = state.request
        ? state
        : { workstreamId: event.workstreamId!, request };
    } else {
      if (!state.request)
        throw new Error("source-change result has no request");
      if (event.type === "SourceChangeObserved") {
        const observation = decodeSourceObservation(event.payload);
        if (
          observation.workOrderId !== state.request.workOrderId ||
          observation.branch !== state.request.branch ||
          observation.commit === state.request.baseCommit ||
          state.refusal ||
          (state.observation &&
            !sameSourceValue(state.observation, observation))
        )
          throw new Error(
            "source-change observation conflicts with its request or receipt",
          );
        next = state.observation ? state : { ...state, observation };
      } else {
        const refusal = decodeSourceRefusal(event.payload);
        if (
          refusal.workOrderId !== state.request.workOrderId ||
          state.observation ||
          (state.refusal && !sameSourceValue(state.refusal, refusal))
        )
          throw new Error(
            "source-change refusal conflicts with its request or receipt",
          );
        next = state.refusal ? state : { ...state, refusal };
      }
    }
    branch = next === state ? "dedup" : "folded";
  }
  return {
    state: next,
    intents: [],
    schedules: [],
    trace: {
      reactorId: "source-change",
      reactorVersion: "1",
      branchPath: [event.type, branch],
      envInputs: ["event"],
      cadenceEvaluations: [],
    },
  };
}
