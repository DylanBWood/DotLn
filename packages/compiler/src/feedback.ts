import { COMPILER_PACKAGE_VERSION } from "./artifact-identity.js";
import { canonicalStringify, fnv1a64 } from "./normalize.js";
import { repositoryPath, verificationLine } from "./verification.js";
import type { WorkOrder } from "./types.js";

/** Closed v1 handler vocabulary. Personal units live in the host's loadout. */
export const FEEDBACK_HANDLERS = {
  "decision-lineage": { kind: "pre-effect-guard", rung: 2 },
  "evidence-judgment": { kind: "evaluator", rung: 5 },
  "semantic-correction": { kind: "pure-reactor", rung: 3 },
  "application-evidence": { kind: "workflow-gate", rung: 6 },
  attribution: { kind: "script", rung: 1 },
  "writer-isolation": { kind: "pre-effect-guard", rung: 2 },
  "suppression-diff": { kind: "script", rung: 1 },
  "output-review": { kind: "workflow-gate", rung: 6 },
  "complete-scope": { kind: "workflow-gate", rung: 6 },
  "cleanup-scope": { kind: "pre-effect-guard", rung: 2 },
} as const;
export type FeedbackHandler = keyof typeof FEEDBACK_HANDLERS;
export interface FeedbackUnit {
  readonly unitId: string;
  readonly version: number;
  readonly incident: {
    readonly sourceRefs: readonly string[];
    readonly sourceTreatment: "synthesized-from-public-lineage";
    readonly summary: string;
    /** Retained source is referenced, not duplicated into every derivative. */
    readonly retainedSource: "public-reference";
  };
  readonly undesiredBehavior: string;
  readonly desiredBehavior: string;
  readonly scope: readonly string[];
  readonly trigger: FeedbackHandler;
  readonly mechanism: {
    readonly handler: FeedbackHandler;
    readonly version: 1 | 2;
    readonly kind?: "prose";
    readonly rationale: string;
  };
  readonly enforcement: "hard" | "soft" | "advisory";
  readonly requiredEvidence: readonly string[];
  readonly regressionFixtures: readonly string[];
  readonly conflicts: readonly string[];
  readonly supersedes: readonly string[];
  readonly retirementCondition: string;
  readonly nextMaturityCondition: string;
  readonly proseEquivalent: string;
}
export interface CompiledFeedback {
  readonly contractVersion: "feedback-v1";
  readonly compilerPackageVersion: string;
  readonly units: readonly FeedbackUnit[];
  readonly mechanisms: readonly {
    readonly unitId: string;
    readonly handler: FeedbackHandler;
    readonly kind: string;
    readonly rung: number;
    readonly enforcement: FeedbackUnit["enforcement"];
  }[];
  readonly policyHash: string;
}
const requireFeedback: (ok: unknown, detail: string) => asserts ok = (
  ok,
  detail,
) => {
  if (!ok) throw new Error(`feedback contract: ${detail}`);
};
const strings = (
  values: readonly string[],
  name: string,
  nonempty = true,
): string[] => {
  requireFeedback(
    Array.isArray(values) &&
      values.length <= 100 &&
      (!nonempty || values.length > 0) &&
      values.every(verificationLine) &&
      new Set(values).size === values.length,
    name,
  );
  return [...values].sort();
};
const text = (value: string, name: string): string => {
  requireFeedback(verificationLine(value), name);
  return value;
};

/** Lower declared corrections to executable handlers, with no prompt emission. */
export function compileFeedbackUnits(
  input: readonly FeedbackUnit[],
): CompiledFeedback {
  requireFeedback(
    Array.isArray(input) && input.length <= 10,
    "bounded unit inventory",
  );
  const units = input
    .map((unit): FeedbackUnit => {
      requireFeedback(
        unit && typeof unit === "object" && unit.incident && unit.mechanism,
        "unit shape",
      );
      requireFeedback(
        Number.isSafeInteger(unit.version) && unit.version > 0,
        "unit version",
      );
      requireFeedback(
        Object.hasOwn(FEEDBACK_HANDLERS, unit.trigger) &&
          unit.mechanism.handler === unit.trigger &&
          [1, 2].includes(unit.mechanism.version) &&
          (unit.mechanism.kind === undefined ||
            (unit.mechanism.kind === "prose" &&
              unit.version >= 2 &&
              unit.mechanism.version === 2 &&
              unit.enforcement === "advisory")),
        "unsupported mechanism or trigger",
      );
      requireFeedback(
        ["hard", "soft", "advisory"].includes(unit.enforcement),
        "enforcement",
      );
      requireFeedback(
        unit.incident.sourceTreatment === "synthesized-from-public-lineage" &&
          unit.incident.retainedSource === "public-reference",
        "declared source treatment",
      );
      const sourceRefs = strings(
        unit.incident.sourceRefs,
        "incident references",
      );
      requireFeedback(
        sourceRefs.every(
          (ref) =>
            repositoryPath(ref.split("#")[0]) &&
            !ref.startsWith("docs/intake/"),
        ),
        "public source references",
      );
      return {
        unitId: text(unit.unitId, "unit id"),
        version: unit.version,
        incident: {
          sourceRefs,
          sourceTreatment: unit.incident.sourceTreatment,
          summary: text(unit.incident.summary, "incident summary"),
          retainedSource: unit.incident.retainedSource,
        },
        undesiredBehavior: text(unit.undesiredBehavior, "undesired behavior"),
        desiredBehavior: text(unit.desiredBehavior, "desired behavior"),
        scope: strings(unit.scope, "scope"),
        trigger: unit.trigger,
        mechanism: {
          handler: unit.mechanism.handler,
          version: unit.mechanism.version,
          ...(unit.mechanism.kind ? { kind: unit.mechanism.kind } : {}),
          rationale: text(
            unit.mechanism.rationale,
            "cheapest sufficient mechanism",
          ),
        },
        enforcement: unit.enforcement,
        requiredEvidence: strings(
          unit.requiredEvidence,
          "required evidence",
          unit.mechanism.kind !== "prose",
        ),
        regressionFixtures: strings(
          unit.regressionFixtures,
          "regression fixtures",
        ),
        conflicts: strings(unit.conflicts, "conflicts", false),
        supersedes: strings(unit.supersedes, "supersedes", false),
        retirementCondition: text(
          unit.retirementCondition,
          "retirement condition",
        ),
        nextMaturityCondition: text(
          unit.nextMaturityCondition,
          "next maturity condition",
        ),
        proseEquivalent: text(unit.proseEquivalent, "prose equivalent"),
      };
    })
    .sort((a, b) => (a.unitId < b.unitId ? -1 : a.unitId > b.unitId ? 1 : 0));
  const ids = units.map((unit) => unit.unitId);
  requireFeedback(new Set(ids).size === ids.length, "duplicate unit id");
  requireFeedback(
    new Set(units.map((unit) => unit.trigger)).size === units.length,
    "duplicate handler",
  );
  for (const unit of units)
    requireFeedback(
      [...unit.conflicts, ...unit.supersedes].every((id) => !ids.includes(id)),
      "conflicting or superseded unit still equipped",
    );
  const contents = {
    contractVersion: "feedback-v1" as const,
    compilerPackageVersion: COMPILER_PACKAGE_VERSION,
    units,
    mechanisms: units.map((unit) => ({
      unitId: unit.unitId,
      handler: unit.mechanism.handler,
      ...FEEDBACK_HANDLERS[unit.mechanism.handler],
      ...(unit.mechanism.kind === "prose" ? { kind: "prose", rung: 7 } : {}),
      enforcement: unit.enforcement,
    })),
  };
  return {
    ...contents,
    policyHash: `fnv1a64:${fnv1a64(canonicalStringify(contents))}`,
  };
}
export function assertCompiledFeedback(program: CompiledFeedback): void {
  requireFeedback(
    canonicalStringify(program) ===
      canonicalStringify(compileFeedbackUnits(program.units)),
    "compiled policy drift",
  );
}

/** These facts are supplied by the host, not accepted from worker result prose. */
export type FeedbackRequest =
  | {
      readonly kind: "decision-lineage";
      readonly proposedApproach: string;
      readonly requiredOutcomes: readonly string[];
      readonly preservedOutcomes: readonly string[];
      readonly rejected: readonly {
        readonly approach: string;
        readonly reason: string;
      }[];
      readonly explicitSupersessions: readonly string[];
      readonly proposedHardConstraints: readonly string[];
      readonly explicitHardConstraints: readonly string[];
    }
  | {
      readonly kind: "evidence-judgment";
      readonly subject: string;
      readonly claimed: "pass" | "fail";
      readonly operatorPreference: "pass" | "fail";
      readonly witnesses: readonly {
        readonly subject: string;
        readonly outcome: "pass" | "fail";
        readonly source: "independent" | "implementer";
        readonly evidenceRef: string;
      }[];
    }
  | {
      readonly kind: "application-evidence";
      readonly subject: string;
      readonly requiredChecks: readonly string[];
      readonly runs: readonly {
        readonly checkId: string;
        readonly subject: string;
        readonly exitCode: number;
        readonly executed: boolean;
        readonly evidenceRef: string;
      }[];
    }
  | { readonly kind: "attribution"; readonly message: string }
  | {
      readonly kind: "writer-isolation";
      readonly actorId: string;
      readonly worktree: string;
      readonly cwd: string;
      readonly gitRoot: string;
      readonly branch: string;
      readonly writable: boolean;
      readonly writers: readonly {
        readonly actorId: string;
        readonly worktree: string;
      }[];
    }
  | {
      readonly kind: "suppression-diff";
      readonly files: readonly {
        readonly path: string;
        readonly beforeComments: readonly string[];
        readonly afterComments: readonly string[];
      }[];
    }
  | {
      readonly kind: "output-review";
      readonly outputs: readonly {
        readonly path: string;
        readonly hash: string;
      }[];
      readonly reads: readonly {
        readonly path: string;
        readonly hash: string;
        readonly evidenceRef: string;
      }[];
    }
  | {
      readonly kind: "complete-scope";
      readonly required: readonly string[];
      readonly completed: readonly string[];
      readonly remaining: readonly string[];
      readonly status: string;
    }
  | {
      readonly kind: "cleanup-scope";
      readonly path: string;
      readonly allowedPaths: readonly string[];
      readonly adjacent: boolean;
      readonly unambiguous: boolean;
      readonly lowRisk: boolean;
      readonly obscuresDiff: boolean;
      readonly retainedEvidence: boolean;
      readonly requiredChecks: readonly string[];
      readonly coveredChecks: readonly string[];
      readonly assessmentRef: string;
    };
export interface FeedbackViolation {
  readonly unitId: string;
  readonly reason: string;
  readonly enforcement: FeedbackUnit["enforcement"];
}
export interface FeedbackVerdict {
  readonly allowed: boolean;
  readonly violations: readonly FeedbackViolation[];
  readonly eligibleUnits: readonly string[];
}

export { hasAiAttribution } from "./attribution.mjs";
import { hasAiAttribution } from "./attribution.mjs";

// Host-parsed comment bodies only; language parsing belongs to the adapter.
function suppressionComments(comments: readonly string[]): readonly string[] {
  return comments
    .flatMap((comment) => comment.split(/\r?\n/u))
    .map((line) => line.trim().replace(/^\*\s*/u, ""))
    .filter((line) =>
      /^(?:@ts-(?:ignore|expect-error|nocheck)\b|eslint-disable(?:-next-line|-line)?\b|tslint:disable\b)/u.test(
        line,
      ),
    );
}
const includesAll = (
  available: readonly string[],
  required: readonly string[],
) => required.length > 0 && required.every((id) => available.includes(id));
function reason(
  request: FeedbackRequest,
  reuseEvidence = false,
): string | null {
  switch (request.kind) {
    case "decision-lineage":
      if (!includesAll(request.preservedOutcomes, request.requiredOutcomes))
        return "desired outcome lost";
      if (
        request.rejected.some(
          (entry) =>
            entry.approach === request.proposedApproach &&
            !request.explicitSupersessions.includes(entry.approach),
        )
      )
        return "rejected approach repeated without explicit supersession";
      return request.proposedHardConstraints.every((id) =>
        request.explicitHardConstraints.includes(id),
      )
        ? null
        : "example or inference promoted to a hard constraint";
    case "evidence-judgment": {
      const witnesses = request.witnesses.filter(
        (item) =>
          item.subject === request.subject &&
          item.source === "independent" &&
          verificationLine(item.evidenceRef),
      );
      return witnesses.length > 0 &&
        witnesses.every((item) => item.outcome === request.claimed)
        ? null
        : "claim lacks consistent independent evidence";
    }
    case "application-evidence":
      return request.requiredChecks.length > 0 &&
        request.requiredChecks.every((id) => {
          const runs = request.runs.filter(
            (run) => run.checkId === id && run.subject === request.subject,
          );
          return (
            runs.length > 0 &&
            runs[reuseEvidence ? "some" : "every"](
              (run) =>
                run.executed &&
                run.exitCode === 0 &&
                verificationLine(run.evidenceRef),
            )
          );
        })
        ? null
        : "required application check missing, stale, unexecuted, or failing";
    case "attribution":
      return hasAiAttribution(request.message)
        ? "AI attribution footer or trailer"
        : null;
    case "writer-isolation":
      return !request.writable ||
        (request.cwd === request.gitRoot &&
          request.cwd === request.worktree &&
          request.branch !== "main" &&
          request.branch !== "HEAD" &&
          request.branch.length > 0 &&
          request.writers.filter(
            (writer) => writer.worktree === request.worktree,
          ).length === 1 &&
          request.writers.some(
            (writer) =>
              writer.actorId === request.actorId &&
              writer.worktree === request.worktree,
          ))
        ? null
        : "write dispatch lacks a verified exclusive worktree";
    case "suppression-diff":
      return request.files.some((file) => {
        if (!/\.[cm]?[jt]sx?$/u.test(file.path)) return false;
        const remaining = [...suppressionComments(file.beforeComments)];
        return suppressionComments(file.afterComments).some((comment) => {
          const index = remaining.indexOf(comment);
          if (index < 0) return true;
          remaining.splice(index, 1);
          return false;
        });
      })
        ? "new lint/type suppression comment"
        : null;
    case "output-review":
      return (reuseEvidence || request.outputs.length > 0) &&
        request.outputs.every((output) =>
          request.reads.some(
            (read) =>
              read.path === output.path &&
              read.hash === output.hash &&
              verificationLine(read.evidenceRef),
          ),
        )
        ? null
        : "output not read at its current bytes";
    case "complete-scope":
      return request.status === "completed" &&
        request.remaining.length === 0 &&
        includesAll(request.completed, request.required)
        ? null
        : "required work remains incomplete";
    case "cleanup-scope":
      return request.allowedPaths.includes(request.path) &&
        request.adjacent &&
        request.unambiguous &&
        request.lowRisk &&
        !request.obscuresDiff &&
        !request.retainedEvidence &&
        verificationLine(request.assessmentRef) &&
        includesAll(request.coveredChecks, request.requiredChecks)
        ? null
        : "cleanup needs a separate candidate or retained-evidence review";
  }
}
export function evaluateFeedback(
  program: CompiledFeedback,
  request: FeedbackRequest,
): FeedbackVerdict {
  assertCompiledFeedback(program);
  const kind: string = request.kind;
  requireFeedback(
    Object.hasOwn(FEEDBACK_HANDLERS, kind) && kind !== "semantic-correction",
    "boundary request kind",
  );
  const mechanisms = program.mechanisms.filter(
    (item) => item.handler === request.kind && item.kind !== "prose",
  );
  const violation = mechanisms.length
    ? reason(
        request,
        program.units.some(
          (unit) => unit.trigger === request.kind && unit.version >= 2,
        ),
      )
    : null;
  const violations =
    violation === null
      ? []
      : mechanisms.map((item) => ({
          unitId: item.unitId,
          enforcement: item.enforcement,
          reason: violation,
        }));
  return {
    allowed: !violations.some((item) => item.enforcement === "hard"),
    violations,
    eligibleUnits: mechanisms.map((item) => item.unitId),
  };
}

export const SEMANTIC_CORRECTIONS = [
  "OperatorCorrectionReceived",
  "OperatorReportsRegression",
  "OperatorRejectsUnsupportedAssumption",
  "OperatorReportsRepeatedFailure",
] as const;
export interface CorrectionState {
  readonly allowedEffects: readonly string[];
  readonly destructiveEffects: readonly string[];
  readonly scopeExpansionAllowed: boolean;
  readonly preserveEvidence: boolean;
  readonly diagnosisRequired: boolean;
  readonly corrections: readonly string[];
}
/** Monotone meet: even a mistakenly classified typed event can only tighten. */
export function applyFeedbackCorrection(
  program: CompiledFeedback,
  state: CorrectionState,
  event: { readonly type: string; readonly eventId: string },
): CorrectionState {
  assertCompiledFeedback(program);
  if (
    !program.mechanisms.some(
      (item) =>
        item.handler === "semantic-correction" &&
        item.kind !== "prose" &&
        item.enforcement === "hard",
    ) ||
    !SEMANTIC_CORRECTIONS.some((type) => type === event.type) ||
    state.corrections.includes(event.eventId)
  )
    return state;
  requireFeedback(verificationLine(event.eventId), "correction event identity");
  return {
    ...state,
    allowedEffects: state.allowedEffects.filter(
      (effect) =>
        !effect.includes("*") && !state.destructiveEffects.includes(effect),
    ),
    scopeExpansionAllowed: false,
    preserveEvidence: true,
    diagnosisRequired: true,
    corrections: [...state.corrections, event.eventId],
  };
}

export interface FeedbackObservation {
  readonly unitId: string;
  readonly episodeId: string;
  readonly source: "fixture" | "live";
  readonly activated: boolean;
  readonly prevented: boolean;
  readonly falseActivation: boolean;
  readonly overridden: boolean;
}
export function feedbackMaturity(
  program: CompiledFeedback,
  observations: readonly FeedbackObservation[],
) {
  assertCompiledFeedback(program);
  const seen = new Set<string>();
  for (const observation of observations) {
    const key = `${observation.unitId}:${observation.episodeId}`;
    requireFeedback(
      program.units.some((unit) => unit.unitId === observation.unitId) &&
        verificationLine(observation.episodeId) &&
        !seen.has(key) &&
        ["fixture", "live"].includes(observation.source) &&
        [
          observation.activated,
          observation.prevented,
          observation.falseActivation,
          observation.overridden,
        ].every((value) => typeof value === "boolean") &&
        (!(
          observation.prevented ||
          observation.falseActivation ||
          observation.overridden
        ) ||
          observation.activated) &&
        !(observation.prevented && observation.falseActivation),
      "maturity observation",
    );
    seen.add(key);
  }
  const count = (unitId: string, source: "fixture" | "live") => {
    const rows = observations.filter(
      (item) => item.unitId === unitId && item.source === source,
    );
    return {
      eligibleEpisodes: rows.length,
      activations: rows.filter((item) => item.activated).length,
      incidentsPrevented: rows.filter((item) => item.prevented).length,
      falseActivations: rows.filter((item) => item.falseActivation).length,
      overrides: rows.filter((item) => item.overridden).length,
    };
  };
  return program.units.map((unit) => ({
    unitId: unit.unitId,
    version: unit.version,
    currentMechanism: unit.mechanism.handler,
    nextMaturityCondition: unit.nextMaturityCondition,
    awakened: false as const,
    fixture: count(unit.unitId, "fixture"),
    live: count(unit.unitId, "live"),
  }));
}

/** One bounded read-only work order; execution is a fixed host subprocess. */
export function compileFeedbackAudit(
  program: CompiledFeedback,
  repo: string,
  baseCommit: string,
  subject: string,
): WorkOrder {
  assertCompiledFeedback(program);
  requireFeedback(
    verificationLine(repo) &&
      /^[a-f0-9]{40}$/u.test(baseCommit) &&
      verificationLine(subject),
    "audit subject",
  );
  return {
    workOrderId: "WO-011-feedback-audit",
    repo,
    baseCommit,
    objective:
      "Audit this repository's ten FeedbackUnits through their executable regression and removal fixtures.",
    acceptanceCriteria: [
      "Every equipped unit's regression passes and fails when that mechanism is removed.",
      "Report measured instruction bytes using the WO-004 accounting method.",
    ],
    knownFacts: [
      `Pinned source: ${subject}`,
      `Equipped feedback: ${program.policyHash}`,
    ],
    decisions: [
      "Execute the fixed local regression runner; independently verify its pinned evidence.",
    ],
    constraints: [
      "Read-only source access",
      "Controlled fixtures do not establish general live prevention rates",
    ],
    nonGoals: [
      "Change repository source",
      "Publish",
      "General self-hosting switchover",
    ],
    allowedOperations: ["feedback.audit"],
    prohibitedOperations: ["repo.write", "repo.delete", "publish"],
    requiredEvidence: [
      "present-and-removed-fixtures",
      "context-accounting",
      "independent-verification",
    ],
    outputContract: {
      type: "feedback-audit-v1",
      policyHash: program.policyHash,
      subject,
    },
  };
}
