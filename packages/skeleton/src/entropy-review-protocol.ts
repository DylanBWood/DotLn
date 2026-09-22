import type { Command, WorkOrder } from "@dotln/kernel";
import {
  reviewerOutputContract,
  type LensBrief,
  type NonEmptyStrings,
  type RefutationAttempt,
  type RefutationSelection,
} from "./loadouts/entropy-reducer.js";
import { WorkerFailure, type WorkerEffort } from "./worker-protocol.js";

/** The dispatch shapes for the compiled Entropy Reducer. The loadout owns the
 * review contract, the selection rule and the report builder; this file only
 * carries them to a worker and binds what comes back. REVIEW-001 measured
 * 1,019.6 s and USD 10.52 for the review and 745.9 s and USD 6.22 for the
 * refutation, so both limits sit above the one observed run rather than at the
 * 180 s worker default. */
export const ENTROPY_REVIEW_LIMITS = {
  timeoutMs: 2_400_000,
  maxBudgetUsd: "20.00",
} as const;
export const ENTROPY_REFUTATION_LIMITS = {
  timeoutMs: 1_800_000,
  maxBudgetUsd: "12.00",
} as const;

/** The tools the review profile names. The file tools are confined to the
 * working directory by `--restricted`; command execution is admitted so the
 * reviewer can measure rather than infer, and its confinement to the frozen
 * copy is instructed, then checked by the tracked-status hash the host
 * records on either side of the episode. */
export const ENTROPY_REVIEW_TOOLS = ["Bash", "Read", "Glob", "Grep"] as const;

export type EntropyEpisodeKind = "entropy-review" | "entropy-refutation";

/** What was frozen, named by value rather than by trust in the worker. */
export interface EntropyReviewSubject {
  readonly schemaVersion: "entropy-review-v1";
  readonly baseCommit: string;
  readonly repository: string;
  readonly scratchRepository: string;
  readonly trackedStatusSha256: string;
  readonly scratchInventorySha256: string;
  readonly scratchInventoryCount: number;
  readonly hash: string;
}

export interface EntropyReviewRequest {
  readonly kind: "entropy-review";
  readonly command: Command;
  readonly workOrder: WorkOrder;
  readonly subject: EntropyReviewSubject;
  readonly episodeId: string;
  readonly model: string;
  readonly effort: WorkerEffort;
  readonly mode?: "subagents";
  readonly raw?: string;
  readonly cwd: string;
  /** A host-owned directory outside the frozen copy where the transport
   * retains the raw return. Writing it inside `cwd` would show up as a
   * scratch delta and make the confinement inventory lie. */
  readonly capture: string;
  readonly residue: string;
  readonly lensBriefs: readonly LensBrief[];
  /** The operator's optional concern. A hypothesis to inspect, never a
   * required finding. */
  readonly concern: string | null;
  readonly profile: {
    readonly profileId: "entropy-review-v1";
    readonly modelTools: readonly string[];
  };
}

/** Only the blinded subjects the compiled selection rule chose. No reviewer
 * narrative, observed-versus-expected conclusion, severity, proposal or
 * desired survival count crosses this boundary. */
export interface EntropyRefutationSubjects {
  readonly measured: readonly Readonly<{
    findingId: string;
    command: string;
  }>[];
  readonly inspection: readonly Readonly<{
    findingId: string;
    steps: NonEmptyStrings;
  }>[];
}

export interface EntropyRefutationRequest {
  readonly kind: "entropy-refutation";
  readonly command: Command;
  readonly workOrder: WorkOrder;
  readonly subject: EntropyReviewSubject;
  readonly subjects: EntropyRefutationSubjects;
  readonly episodeId: string;
  readonly model: string;
  readonly effort: WorkerEffort;
  readonly mode?: "subagents";
  readonly raw?: string;
  readonly cwd: string;
  readonly capture: string;
  readonly profile: {
    readonly profileId: "entropy-refutation-v1";
    readonly modelTools: readonly string[];
  };
}

export interface EntropyRefutationResult {
  readonly schemaVersion: 1;
  readonly attempts: readonly RefutationAttempt[];
}

export const isEntropyReviewRequest = (
  request: { readonly kind?: string } | { readonly command: Command },
): request is EntropyReviewRequest =>
  "kind" in request && request.kind === "entropy-review";

export const isEntropyRefutationRequest = (
  request: { readonly kind?: string } | { readonly command: Command },
): request is EntropyRefutationRequest =>
  "kind" in request && request.kind === "entropy-refutation";

export const isEntropyRequest = (
  request: { readonly kind?: string } | { readonly command: Command },
): request is EntropyReviewRequest | EntropyRefutationRequest =>
  isEntropyReviewRequest(request) || isEntropyRefutationRequest(request);

const object = (value: unknown): Record<string, unknown> | undefined =>
  value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : undefined;
const exact = (
  value: Record<string, unknown>,
  expected: readonly string[],
): boolean =>
  Object.keys(value).sort().join(",") === [...expected].sort().join(",");
const check: (valid: unknown, reason: string) => asserts valid = (
  valid,
  reason,
) => {
  if (!valid) throw new WorkerFailure("invalid-result", reason);
};

const digest = (value: unknown): value is string =>
  typeof value === "string" && /^[0-9a-f]{64}$/u.test(value);

export function assertEntropySubject(
  value: unknown,
): asserts value is EntropyReviewSubject {
  const subject = object(value);
  check(
    subject !== undefined &&
      exact(subject, [
        "schemaVersion",
        "baseCommit",
        "repository",
        "scratchRepository",
        "trackedStatusSha256",
        "scratchInventorySha256",
        "scratchInventoryCount",
        "hash",
      ]) &&
      subject["schemaVersion"] === "entropy-review-v1" &&
      typeof subject["baseCommit"] === "string" &&
      /^[0-9a-f]{40}$/u.test(subject["baseCommit"]) &&
      typeof subject["repository"] === "string" &&
      typeof subject["scratchRepository"] === "string" &&
      digest(subject["trackedStatusSha256"]) &&
      digest(subject["scratchInventorySha256"]) &&
      Number.isSafeInteger(subject["scratchInventoryCount"]) &&
      (subject["scratchInventoryCount"] as number) >= 0 &&
      digest(subject["hash"]),
    "entropy review subject",
  );
}

const profileRefusal = (error: unknown, label: string): never => {
  throw new WorkerFailure(
    "profile-refused",
    error instanceof Error ? error.message : label,
  );
};

const commonRequestShape = (
  request: EntropyReviewRequest | EntropyRefutationRequest,
): void => {
  assertEntropySubject(request.subject);
  check(
    /^[a-zA-Z0-9][a-zA-Z0-9._:-]{0,99}$/u.test(request.model),
    "entropy request model",
  );
  check(/^[a-zA-Z0-9_-]+$/u.test(request.episodeId), "entropy request episode");
  check(
    request.cwd === request.subject.scratchRepository,
    "entropy request must run inside the frozen copy",
  );
  check(
    typeof request.capture === "string" &&
      request.capture.length > 0 &&
      request.capture !== request.cwd &&
      !request.capture.startsWith(`${request.cwd}/`),
    "entropy request capture must sit outside the frozen copy",
  );
  check(
    request.command.intent.kind === "Act",
    "entropy request intent must be an Act",
  );
  check(
    request.workOrder.workOrderId === "wo_entropy_review_1",
    "entropy request work order",
  );
  check(
    request.workOrder.prohibitedOperations.length > 0,
    "entropy request authority must prohibit the mutating families",
  );
};

export function validateEntropyReviewRequest(
  request: EntropyReviewRequest,
): void {
  try {
    commonRequestShape(request);
    check(request.kind === "entropy-review", "entropy review kind");
    check(
      request.profile.profileId === "entropy-review-v1",
      "entropy review profile",
    );
    check(
      request.profile.modelTools.length > 0 &&
        request.profile.modelTools.every((tool) =>
          (ENTROPY_REVIEW_TOOLS as readonly string[]).includes(tool),
        ),
      "entropy review profile tools",
    );
    check(
      request.command.intent.effect === "repo.read.census",
      "entropy review effect",
    );
    check(
      request.lensBriefs.length > 0 &&
        request.lensBriefs.every((brief) => brief.noFix === true),
      "entropy review lens briefs",
    );
    check(request.residue.length > 0, "entropy review residue");
    check(
      request.concern === null ||
        (typeof request.concern === "string" &&
          request.concern.trim().length > 0 &&
          request.concern.length <= 4_000),
      "entropy review concern",
    );
  } catch (error) {
    profileRefusal(error, "invalid entropy review profile");
  }
}

export function validateEntropyRefutationRequest(
  request: EntropyRefutationRequest,
): void {
  try {
    commonRequestShape(request);
    check(request.kind === "entropy-refutation", "entropy refutation kind");
    check(
      request.profile.profileId === "entropy-refutation-v1",
      "entropy refutation profile",
    );
    check(
      request.command.intent.effect === "probe.run:scratch.review",
      "entropy refutation effect",
    );
    const ids = [
      ...request.subjects.measured.map((item) => item.findingId),
      ...request.subjects.inspection.map((item) => item.findingId),
    ];
    check(ids.length > 0, "entropy refutation needs at least one subject");
    check(
      new Set(ids).size === ids.length,
      "entropy refutation subjects must be unique",
    );
  } catch (error) {
    profileRefusal(error, "invalid entropy refutation profile");
  }
}

/** The review returns exactly the loadout's own output contract. The host
 * revalidates it with `validateReviewerOutput` against this episode. */
export const entropyReviewResultSchema = (): object => ({
  ...reviewerOutputContract,
});

export const entropyRefutationResultSchema = (
  request: EntropyRefutationRequest,
): object => {
  const findingIds = [
    ...request.subjects.measured.map((item) => item.findingId),
    ...request.subjects.inspection.map((item) => item.findingId),
  ];
  return {
    type: "object",
    additionalProperties: false,
    required: ["schemaVersion", "attempts"],
    properties: {
      schemaVersion: { const: 1 },
      attempts: {
        type: "array",
        minItems: findingIds.length,
        maxItems: findingIds.length,
        items: {
          type: "object",
          additionalProperties: false,
          required: ["findingId", "result", "reason", "evidenceRefs"],
          properties: {
            findingId: { type: "string", enum: findingIds },
            result: { enum: ["survived", "refuted", "blocked"] },
            reason: { type: "string", minLength: 1 },
            evidenceRefs: {
              type: "array",
              minItems: 1,
              items: { type: "string", minLength: 1 },
            },
          },
        },
      },
    },
  };
};

export function validateEntropyRefutationResult(
  value: unknown,
  request: EntropyRefutationRequest,
): EntropyRefutationResult {
  const root = object(value);
  check(
    root !== undefined && exact(root, ["schemaVersion", "attempts"]),
    "entropy refutation result shape",
  );
  check(root!["schemaVersion"] === 1, "entropy refutation schemaVersion");
  const attempts = root!["attempts"];
  check(Array.isArray(attempts), "entropy refutation attempts");
  const selected = new Set([
    ...request.subjects.measured.map((item) => item.findingId),
    ...request.subjects.inspection.map((item) => item.findingId),
  ]);
  const seen = new Set<string>();
  const rows = (attempts as readonly unknown[]).map((candidate) => {
    const attempt = object(candidate);
    check(
      attempt !== undefined &&
        exact(attempt, ["findingId", "result", "reason", "evidenceRefs"]),
      "entropy refutation attempt shape",
    );
    const findingId = attempt!["findingId"];
    check(
      typeof findingId === "string" && selected.has(findingId),
      "entropy refutation attempt names an unselected finding",
    );
    check(
      !seen.has(findingId as string),
      `duplicate entropy refutation attempt for ${String(findingId)}`,
    );
    seen.add(findingId as string);
    const result = attempt!["result"];
    check(
      result === "survived" || result === "refuted" || result === "blocked",
      "entropy refutation attempt result",
    );
    const reason = attempt!["reason"];
    check(
      typeof reason === "string" && reason.trim().length > 0,
      "entropy refutation attempt reason",
    );
    const evidenceRefs = attempt!["evidenceRefs"];
    check(
      Array.isArray(evidenceRefs) &&
        evidenceRefs.length > 0 &&
        evidenceRefs.every(
          (ref) => typeof ref === "string" && ref.trim().length > 0,
        ),
      "entropy refutation attempt evidence",
    );
    return {
      findingId: findingId as string,
      result,
      reason,
      evidenceRefs: evidenceRefs as readonly string[],
    } satisfies RefutationAttempt;
  });
  check(
    seen.size === selected.size,
    "entropy refutation must attempt every selected subject",
  );
  return { schemaVersion: 1, attempts: rows };
}

const subjectProjection = (subject: EntropyReviewSubject) => ({
  baseCommit: subject.baseCommit,
  frozenSubjectPath: subject.scratchRepository,
  trackedStatusSha256: subject.trackedStatusSha256,
  scratchInventorySha256: subject.scratchInventorySha256,
  scratchInventoryCount: subject.scratchInventoryCount,
  subjectHash: subject.hash,
});

export const entropyReviewPrompt = (request: EntropyReviewRequest): string => {
  validateEntropyReviewRequest(request);
  return JSON.stringify({
    identity: "Entropy Reducer",
    role: "planning reviewer",
    workOrder: request.workOrder,
    episodeId: request.episodeId,
    residue: request.residue,
    lensBriefs: request.lensBriefs,
    subject: subjectProjection(request.subject),
    concern: request.concern,
    outputSchema: reviewerOutputContract,
    outputInstructions:
      "Run one Entropy Reducer review of the frozen copy at `subject.frozenSubjectPath`, which is your working directory. Follow the compiled Program in order: a whole-repository census of the paths `git ls-files` names, the bounded lens briefs above, then isolated probes. Commands run here and nowhere else: the original repository, the control plane, remotes, settings and operator decisions are read-only and outside this copy, and nothing outside this working directory may be written. Never read `docs/intake/**`. Label every finding `measured` with a reproduction command you actually ran, or `by inspection` with the steps; do not call a finding measured because a command exists. Attach an independent reproduction and evidence references to each. Tag each finding's surface and intervention altitude, and route a recurring finding to the cheapest executable rung. For an operator analogy, extract the intended relationship first and evaluate a literal detail only where a claim depends on it. `concern`, when present, is the operator's hypothesis to inspect, not a finding you must produce. Emit non-authoritative ProductSuggestion packets for `docs/proposals/<suggestionId>/`; you cannot file, promote, implement or verify them, and you do not advance any lifecycle. Apply the clean-room stop screen before returning: stop instead of incorporating employer material, credentials, private identifiers or internal service details. Return only the `outputSchema` object, with `resultEnvelope.workOrderId` and `resultEnvelope.episodeId` exactly as supplied and a summary under 200 words. The host revalidates everything you return and then stops for operator disposition.",
  });
};

export const entropyRefutationPrompt = (
  request: EntropyRefutationRequest,
): string => {
  validateEntropyRefutationRequest(request);
  return JSON.stringify({
    identity: "Entropy Reducer",
    mask: "Contra-Auguste",
    role: "blinded refuter",
    workOrder: request.workOrder,
    episodeId: request.episodeId,
    subject: subjectProjection(request.subject),
    subjects: request.subjects,
    outputInstructions:
      "Attempt to falsify each supplied subject independently, inside the frozen copy at `subject.frozenSubjectPath`, which is your working directory. `subjects.measured` gives a reproduction command and `subjects.inspection` gives steps; repository state and that command or those steps are the whole evidence source. Finding identifiers exist only for attribution: you have not been given, and must not ask for, any reviewer narrative, observed-versus-expected conclusion, severity, proposal or target survival count. Run each reproduction, then judge it: `refuted` when the reproduction does not show what it claims to show, `survived` when it does, `blocked` when you could not run it, with a non-empty reason and evidence references either way. There is no survival quota and no vote; an all-refuted run and an all-survived run are both valid results. Perturbations stay inside this working directory and nothing outside it is written. Return exactly one attempt per supplied subject and only the result schema object.",
  });
};

export type { RefutationAttempt, RefutationSelection };
