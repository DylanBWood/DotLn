import type { JsonValue } from "@dotln/kernel";
import type {
  AuthorityEnvelope,
  Command,
  ResultEnvelope,
  WorkOrder,
} from "@dotln/kernel";
import type { ArtifactIdentityV1 } from "@dotln/compiler";
import type { Candidate } from "./reactor.js";
import type { FixtureTree } from "./scenario.js";
import type { FixtureInspectionProfile } from "./execution-environment.js";
import type { SourceChangeProfile } from "./execution-environment.js";

export type WorkerTransportName =
  "claude-cli-print" | "codex-cli-exec" | "local-model-http" | "fake";
/** A requested selector is a log value, not a discovery-registry gate. */
export type WorkerEffort = string;
export interface WorkerEffortSelection {
  readonly effort: string;
  readonly mode?: "subagents";
  readonly raw?: string;
}
export function normalizeWorkerEffort(effort: string): WorkerEffortSelection {
  return ["ultra", "ultra code", "ultracode"].includes(effort.toLowerCase())
    ? { effort: "xhigh", mode: "subagents", raw: effort }
    : { effort };
}

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
  readonly profile: FixtureInspectionProfile;
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

/** Supplied by the compilation host; a launch profile cannot grant authority. */
export interface WriterRequest {
  readonly kind: "source-change";
  readonly command: Command;
  readonly workOrder: WorkOrder;
  readonly authorityEnvelope: AuthorityEnvelope;
  readonly artifactIdentity: ArtifactIdentityV1;
  readonly episodeId: string;
  readonly model: string;
  readonly effort: WorkerEffort;
  readonly cwd: string;
  readonly profile: SourceChangeProfile;
  readonly testCommand: string;
  readonly commitMessagePath: string;
}

export interface WriterObservations {
  readonly observedCommit?: { readonly sha: string; readonly branch: string };
  readonly observedDenials: number | "unavailable";
}
export interface WriterResult {
  readonly envelope: ResultEnvelope & WriterObservations;
}
export const isWriterRequest = (
  request: { readonly kind?: string } | WorkerRequest,
): request is WriterRequest =>
  "kind" in request && request.kind === "source-change";

export const SOURCE_CHANGE_DENIED = [
  "repo.push",
  "remote.*",
  "credentials.*",
  "settings.*",
  "sandbox.*",
  "transport.*",
  "package.publish",
] as const;
const writerAllowed = new Set([
  "repo.read",
  "repo.inspect",
  "repo.write",
  "git.local",
  "shell.run",
]);
const matchesEffect = (pattern: string, effect: string): boolean =>
  pattern.endsWith("*")
    ? effect.startsWith(pattern.slice(0, -1))
    : pattern === effect;

export function validateWriterRequest(request: WriterRequest): void {
  try {
    const { authorityEnvelope: authority, workOrder } = request;
    if (
      request.kind !== "source-change" ||
      request.command.intent.kind !== "Act" ||
      request.command.intent.effect !== "repo.write" ||
      !line(request.model, 100) ||
      !/^[a-zA-Z0-9][a-zA-Z0-9._:-]*$/u.test(request.model) ||
      !/^[a-zA-Z0-9_-]+$/u.test(request.episodeId) ||
      !line(request.testCommand, 320) ||
      !/^[a-zA-Z0-9_./-]+(?: [a-zA-Z0-9_./=-]+)*$/u.test(request.testCommand) ||
      !/^[a-zA-Z0-9_./-]+$/u.test(request.commitMessagePath) ||
      !["repo.write", "git.local"].every(
        (effect) =>
          workOrder.allowedOperations.includes(effect) &&
          authority.allowedEffects.includes(effect) &&
          !workOrder.prohibitedOperations.some((pattern) =>
            matchesEffect(pattern, effect),
          ) &&
          !authority.deniedEffects.some((pattern) =>
            matchesEffect(pattern, effect),
          ),
      ) ||
      !workOrder.allowedOperations.every((effect) =>
        writerAllowed.has(effect),
      ) ||
      !authority.allowedEffects.every((effect) => writerAllowed.has(effect)) ||
      !workOrder.allowedOperations.every((effect) =>
        authority.allowedEffects.includes(effect),
      ) ||
      [...workOrder.allowedOperations, ...authority.allowedEffects].some(
        (effect) =>
          workOrder.prohibitedOperations.some((pattern) =>
            matchesEffect(pattern, effect),
          ) ||
          authority.deniedEffects.some((pattern) =>
            matchesEffect(pattern, effect),
          ),
      ) ||
      !SOURCE_CHANGE_DENIED.every(
        (effect) =>
          workOrder.prohibitedOperations.some((pattern) =>
            matchesEffect(pattern, effect),
          ) &&
          authority.deniedEffects.some((pattern) =>
            matchesEffect(pattern, effect),
          ),
      )
    )
      throw new Error("writer authority or request mismatch");
    const { profile, cwd, commitMessagePath } = request;
    const canonical = (path: string) =>
      typeof path === "string" &&
      path.startsWith("/") &&
      path !== "/" &&
      !path.endsWith("/") &&
      !path.includes("//") &&
      !path.split("/").some((part) => part === "." || part === "..");
    const inside = (parent: string, path: string) =>
      path.startsWith(`${parent}/`);
    if (
      profile.profileId !== "source-change-v1" ||
      profile.mounts.length !== 1 ||
      profile.mounts[0]?.path !== cwd ||
      profile.mounts[0]?.access !== "read-write" ||
      profile.writableSurfaces.length !== 1 ||
      profile.writableSurfaces[0] !== cwd ||
      ![
        cwd,
        profile.worktreeParent,
        profile.launchpadCheckout,
        commitMessagePath,
      ].every(canonical) ||
      !inside(profile.worktreeParent, cwd) ||
      !inside(cwd, commitMessagePath) ||
      cwd === profile.launchpadCheckout ||
      inside(cwd, profile.launchpadCheckout) ||
      inside(profile.launchpadCheckout, cwd)
    )
      throw new Error("writer mount declaration mismatch");
    // Filesystem/Git observations belong to the transport host, never the reactor.
  } catch {
    throw new WorkerFailure(
      "profile-refused",
      "source-change request or environment",
    );
  }
}

export function writerResultSchema(request: WriterRequest): object {
  return {
    type: "object",
    additionalProperties: false,
    required: ["envelope"],
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
          workOrderId: {
            type: "string",
            enum: [request.workOrder.workOrderId],
          },
          episodeId: { type: "string", enum: [request.episodeId] },
          resultId: { type: "string", enum: [resultId(request.command)] },
          status: { type: "string", enum: ["completed", "blocked", "failed"] },
          summary: { type: "string", maxLength: 320 },
          requiresHuman: { type: "boolean" },
        },
      },
    },
  };
}

/** Vendor prose is never a source of Git/denial observations. */
export function parseWriterResult(
  value: unknown,
  request: WriterRequest,
  observations: WriterObservations,
): WriterResult {
  const root = object(value);
  const envelope = object(root?.envelope);
  if (
    !root ||
    !keys(root, ["envelope"]) ||
    !envelope ||
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
    typeof envelope.status !== "string" ||
    !["completed", "blocked", "failed"].includes(envelope.status) ||
    !line(envelope.summary, 320) ||
    typeof envelope.requiresHuman !== "boolean"
  )
    throw new WorkerFailure("invalid-result", "writer envelope");
  const commit = object(observations.observedCommit);
  if (
    !(
      observations.observedDenials === "unavailable" ||
      (Number.isSafeInteger(observations.observedDenials) &&
        observations.observedDenials >= 0)
    ) ||
    (observations.observedCommit !== undefined &&
      (!commit ||
        !keys(commit, ["sha", "branch"]) ||
        typeof commit.sha !== "string" ||
        !/^(?:[a-f0-9]{40}|[a-f0-9]{64})$/u.test(commit.sha) ||
        !line(commit.branch, 256)))
  )
    throw new WorkerFailure("invalid-result", "writer observations");
  return {
    envelope: { ...(envelope as unknown as ResultEnvelope), ...observations },
  };
}

/** Only the host-owned store consumes already-observed fields. */
export function parseStoredWriterResult(
  value: unknown,
  request: WriterRequest,
): WriterResult {
  const root = object(value);
  const envelope = object(root?.envelope);
  if (
    !root ||
    !keys(root, ["envelope"]) ||
    !envelope ||
    !("observedDenials" in envelope)
  )
    throw new WorkerFailure("invalid-result", "stored writer envelope");
  const { observedCommit, observedDenials, ...reported } = envelope;
  return parseWriterResult({ envelope: reported }, request, {
    observedDenials: observedDenials as WriterObservations["observedDenials"],
    ...(observedCommit === undefined
      ? {}
      : {
          observedCommit: observedCommit as NonNullable<
            WriterObservations["observedCommit"]
          >,
        }),
  });
}

export function writerPrompt(request: WriterRequest): string {
  const source = request.command.intent.payload as Readonly<
    Record<string, JsonValue>
  >;
  return JSON.stringify({
    ...(source.executionBaseCommit
      ? { executionBaseCommit: source.executionBaseCommit }
      : {}),
    ...(source.repairContext ? { repair: source.repairContext } : {}),
    ...(source.surfaces ? { surfaces: source.surfaces } : {}),
    workOrder: request.workOrder,
    artifactReceipt: {
      semanticHash: request.artifactIdentity.semanticHash,
      compilerContractVersion: request.artifactIdentity.compilerContractVersion,
      compilerPackageVersion: request.artifactIdentity.compilerPackageVersion,
    },
    episodeId: request.episodeId,
    resultId: resultId(request.command),
    mount: request.profile.mounts[0],
    testCommand: request.testCommand,
    commitCommand: `git commit -F ${request.commitMessagePath}`,
    outputSchema: writerResultSchema(request),
    inspectionInstructions:
      "Inspect only the assigned worktree. Use native read tools when available. Otherwise read-only shell inspection is authorized: pwd; git rev-parse --show-toplevel; git status --short; git ls-files; git diff --no-ext-diff --no-textconv; git diff --cached --no-ext-diff --no-textconv; cat -- <worktree-relative-file>. For cat, use a literal relative file path without shell metacharacters, parent traversal or symlinks, and never read credentials or paths outside this worktree. Run each command separately; no shell composition, redirection, substitutions or interpreters. Native tool permissions still apply; if a diff command is unavailable, read the diff in the declared test output.",
    outputInstructions:
      "Edit only the declared surfaces within the worktree mount. Never modify .claude/, .dotln/ or the host-written commit-message file. Never compose a commit message. Run exactly the declared test command. Read the diff, then run git add -A and the exact commitCommand. These are the only effectful shell commands authorized; the separate inspectionInstructions authorize bounded reads. No other shell commands, remote, credential, settings or sandbox effects are authorized. Return the schema object containing only the six-field envelope; no Markdown or prose outside it. Completion is a self-report, not verification; report blocked or failed when work cannot finish, and requiresHuman when an operator decision is needed. Git identity and denial accounting are observed separately by the host.",
  });
}
