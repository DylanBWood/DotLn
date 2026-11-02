import type { Command } from "@dotln/kernel";
import { WorkerFailure, type WorkerEffort } from "./worker-protocol.js";

/** The kit's change review (`npm run worker -- review`): one fresh worker
 * reads a work order's or a planning branch's change in its own checkout and
 * returns closed findings, which the helper writes into the subject's ignored
 * reviews lane for the executor, the verifier and the close. */
export const CHANGE_REVIEW_KINDS = [
  "criteria",
  "design",
  "consistency",
  "combined",
] as const;
export type ChangeReviewKind = (typeof CHANGE_REVIEW_KINDS)[number];

/** A reviewer over files reads them: the file tools and a shell. */
export const CHANGE_REVIEW_TOOLS = ["Read", "Grep", "Glob", "Bash"] as const;

/** The shell commands the Claude print form pre-approves; any other command
 * is denied without a prompt, and the file tools cover reading and searching.
 * A prefix rule cannot see every option a program accepts (`git diff
 * --output` writes a file, and the bounded probe runs the test file it is
 * given), so this list narrows what a worker may run and the guarantee is
 * detection: the helper compares the checkout's contents on either side of the
 * episode and names any change. */
export const CHANGE_REVIEW_SHELL = [
  "git diff",
  "git log",
  "git show",
  "git status",
  "git ls-files",
  "git rev-parse",
  "git merge-base",
  "git blame",
  "git grep",
  "grep",
  "ls",
  "wc",
  "node scripts/harness.mjs bounded -- node --test",
] as const;

/** A change review's limits. The worker is told the budget and stops itself
 * before it, returning what it has: a worker stopped at a hard limit returns
 * nothing, so the hard limits sit well above the budget. The transcript is
 * never a limit: a review's event stream echoes every command it ran (one
 * Codex review of WO-250 passed 1,000,000 bytes in six minutes), so only its
 * tail is kept, for the usage counters, and the final message has its own
 * file. The entropy review, the nearest measured episode, took 1,019.6 s and
 * USD 10.52. */
export const CHANGE_REVIEW_LIMITS = {
  budgetMinutes: 30,
  budgetToolCalls: 120,
  timeoutMs: 3_600_000,
  maxBudgetUsd: "20.00",
  transcriptTailBytes: 8_000_000,
} as const;

/** The file in the capture lane a Codex worker writes its final message to. */
export const CHANGE_REVIEW_LAST_MESSAGE = "last-message.txt";

/** The intent effect every change review command names: a read. */
export const CHANGE_REVIEW_EFFECT = "repo.read.review";

export type ChangeReviewSeverity = "blocking" | "should-fix" | "note";
/** What a finding stands on, in the vocabulary a verifier's blocking entry
 * carries: an acceptance criterion, or a behavior `main` had that the change
 * broke. A finding that stands on neither carries null. */
export type ChangeReviewBasis =
  { readonly criterion: string } | { readonly regression: string } | null;
export interface ChangeReviewFinding {
  readonly id: string;
  readonly severity: ChangeReviewSeverity;
  readonly summary: string;
  readonly file: string;
  readonly line: number | null;
  readonly basis: ChangeReviewBasis;
}
/** A recheck's judgment of one earlier finding: its fix holds or it does not. */
export interface ChangeReviewRecheck {
  readonly id: string;
  readonly outcome: "held" | "not-held";
  readonly note: string;
}
export interface ChangeReviewResult {
  readonly schemaVersion: 1;
  readonly findings: readonly ChangeReviewFinding[];
  readonly rechecks: readonly ChangeReviewRecheck[];
  /** Repository-relative paths the worker actually read. */
  readonly filesRead: readonly string[];
  /** The worker's own account, in Markdown, of what it read and found. */
  readonly report: string;
}

export interface ChangeReviewRequest {
  readonly kind: "change-review";
  readonly command: Command;
  readonly episodeId: string;
  readonly model: string;
  readonly effort: WorkerEffort;
  readonly mode?: "subagents";
  readonly raw?: string;
  /** The reviewed checkout; the worker reads it and changes nothing there. */
  readonly cwd: string;
  /** A host directory outside the checkout that retains the raw return. */
  readonly capture: string;
  readonly review: {
    readonly kind: ChangeReviewKind;
    readonly round: number;
    /** The order id, or `planning` for a planning branch. */
    readonly subject: string;
    /** The earlier findings a recheck confirms or refutes. */
    readonly priorFindingIds: readonly string[];
  };
  /** The canonical brief the helper rendered from the role text. */
  readonly brief: string;
  readonly profile: {
    readonly profileId: "change-review-v1";
    readonly modelTools: readonly string[];
  };
}

export const isChangeReviewRequest = (
  request: { readonly kind?: string } | { readonly command: unknown },
): request is ChangeReviewRequest =>
  "kind" in request && request.kind === "change-review";

const refuse = (reason: string): never => {
  throw new WorkerFailure("profile-refused", reason);
};
const check = (valid: unknown, reason: string) => {
  if (!valid) refuse(reason);
};

export function validateChangeReviewRequest(
  request: ChangeReviewRequest,
): void {
  check(request.kind === "change-review", "change review kind");
  check(
    typeof request.command?.commandId === "string" &&
      /^[a-zA-Z0-9][a-zA-Z0-9._:-]{0,127}$/u.test(request.command.commandId) &&
      request.command.intent?.kind === "Act" &&
      request.command.intent.effect === CHANGE_REVIEW_EFFECT,
    "change review command",
  );
  check(
    /^[a-zA-Z0-9][a-zA-Z0-9._:-]{0,99}$/u.test(request.model),
    "change review model",
  );
  check(/^[a-zA-Z0-9_-]+$/u.test(request.episodeId), "change review episode");
  check(
    typeof request.cwd === "string" && request.cwd.startsWith("/"),
    "change review checkout must be absolute",
  );
  check(
    typeof request.capture === "string" &&
      request.capture.startsWith("/") &&
      request.capture !== request.cwd &&
      !request.capture.startsWith(`${request.cwd}/`),
    "change review capture must sit outside the reviewed checkout",
  );
  check(
    (CHANGE_REVIEW_KINDS as readonly string[]).includes(request.review?.kind),
    "change review kind of review",
  );
  check(
    Number.isSafeInteger(request.review.round) && request.review.round >= 1,
    "change review round",
  );
  check(
    request.review.subject === "planning" ||
      /^WO-\d{3}$/u.test(request.review.subject),
    "change review subject",
  );
  check(
    Array.isArray(request.review.priorFindingIds) &&
      request.review.priorFindingIds.every(
        (id) => typeof id === "string" && id.length > 0 && id.length <= 64,
      ) &&
      new Set(request.review.priorFindingIds).size ===
        request.review.priorFindingIds.length,
    "change review prior findings",
  );
  check(
    typeof request.brief === "string" &&
      request.brief.trim().length > 0 &&
      request.brief.length <= 400_000,
    "change review brief",
  );
  check(
    request.profile?.profileId === "change-review-v1" &&
      request.profile.modelTools.length > 0 &&
      request.profile.modelTools.every((tool) =>
        (CHANGE_REVIEW_TOOLS as readonly string[]).includes(tool),
      ),
    "change review profile",
  );
}

/** The closed shape every change review returns, strict enough for Codex's
 * output schema: every property is required and an absent value is null. */
export function changeReviewResultSchema(): object {
  const text = { type: "string" };
  return {
    type: "object",
    additionalProperties: false,
    required: ["schemaVersion", "findings", "rechecks", "filesRead", "report"],
    properties: {
      schemaVersion: { type: "integer", enum: [1] },
      findings: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          required: ["id", "severity", "summary", "file", "line", "basis"],
          properties: {
            id: text,
            severity: {
              type: "string",
              enum: ["blocking", "should-fix", "note"],
            },
            summary: text,
            file: text,
            line: { type: ["integer", "null"] },
            basis: {
              anyOf: [
                { type: "null" },
                {
                  type: "object",
                  additionalProperties: false,
                  required: ["criterion"],
                  properties: { criterion: text },
                },
                {
                  type: "object",
                  additionalProperties: false,
                  required: ["regression"],
                  properties: { regression: text },
                },
              ],
            },
          },
        },
      },
      rechecks: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          required: ["id", "outcome", "note"],
          properties: {
            id: text,
            outcome: { type: "string", enum: ["held", "not-held"] },
            note: text,
          },
        },
      },
      filesRead: { type: "array", items: text },
      report: text,
    },
  };
}

const budget = () =>
  `Your budget is about ${CHANGE_REVIEW_LIMITS.budgetMinutes} minutes and ${CHANGE_REVIEW_LIMITS.budgetToolCalls} tool calls. Keep count as you work; when you near either, stop exploring and return the findings you have, naming in your report what you did not reach. A worker stopped at its hard limit (${CHANGE_REVIEW_LIMITS.timeoutMs / 60_000} minutes) returns nothing, so a partial report returned in time is worth far more than a complete one that never arrives.`;

const output = (request: ChangeReviewRequest) =>
  [
    "Return only the schema object.",
    "findings: one entry per distinct defect, each with a short id unique in this report (F1, F2, …), severity blocking (an acceptance criterion is unmet or a behavior main had is broken, with the input or probe that shows it), should-fix (a concrete defect to fix before merging) or note, a one-paragraph summary naming the evidence, the repository-relative file and line it is about (line null for a whole file, file empty for no single file), and basis: {criterion: <id>} when it stands on an acceptance criterion, {regression: <the behavior main had>} when it stands on a broken behavior, or null.",
    request.review.priorFindingIds.length
      ? `rechecks: one entry for each earlier finding (${request.review.priorFindingIds.join(", ")}), outcome held when its fix holds on the current tree and not-held otherwise, with a note naming the evidence.`
      : "rechecks: an empty list; this is not a recheck.",
    "filesRead: every repository-relative path you actually read, so the report cites what it judged.",
    "report: your own account in Markdown of what you read, what you ran and what you found; never claim a read or a run you did not make.",
  ].join(" ");

/** The prompt is the helper's canonical brief, the budget the worker keeps
 * itself within, and the output contract. */
export function changeReviewPrompt(request: ChangeReviewRequest): string {
  validateChangeReviewRequest(request);
  return `${request.brief.trimEnd()}\n\n## Budget\n\n${budget()}\n\n## Output\n\n${output(request)}\n`;
}

const invalid = (reason: string): never => {
  throw new WorkerFailure("invalid-result", reason);
};
const object = (value: unknown): Record<string, unknown> | undefined =>
  value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : undefined;
const exact = (value: Record<string, unknown>, keys: readonly string[]) =>
  Object.keys(value).sort().join(",") === [...keys].sort().join(",");
const nonEmpty = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

/** Bind a return to the closed shape and to this request's earlier findings. */
export function validateChangeReviewResult(
  value: unknown,
  request: ChangeReviewRequest,
): ChangeReviewResult {
  const result = object(value) ?? invalid("change review result shape");
  if (
    !exact(result, [
      "schemaVersion",
      "findings",
      "rechecks",
      "filesRead",
      "report",
    ]) ||
    result["schemaVersion"] !== 1 ||
    !Array.isArray(result["findings"]) ||
    !Array.isArray(result["rechecks"]) ||
    !Array.isArray(result["filesRead"]) ||
    typeof result["report"] !== "string"
  )
    invalid("change review result shape");
  const ids = new Set<string>();
  for (const entry of result["findings"] as unknown[]) {
    const finding = object(entry) ?? invalid("change review finding shape");
    const basis = finding["basis"];
    const grounds = object(basis);
    const line = finding["line"];
    if (
      !exact(finding, ["id", "severity", "summary", "file", "line", "basis"]) ||
      typeof finding["id"] !== "string" ||
      !/^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$/u.test(finding["id"]) ||
      ids.has(finding["id"]) ||
      !["blocking", "should-fix", "note"].includes(
        finding["severity"] as string,
      ) ||
      !nonEmpty(finding["summary"]) ||
      typeof finding["file"] !== "string" ||
      !(
        line === null ||
        (Number.isSafeInteger(line) && (line as number) >= 1)
      ) ||
      !(
        basis === null ||
        (grounds !== undefined &&
          ((exact(grounds, ["criterion"]) && nonEmpty(grounds["criterion"])) ||
            (exact(grounds, ["regression"]) &&
              nonEmpty(grounds["regression"]))))
      )
    )
      invalid("change review finding shape");
    ids.add(finding["id"] as string);
  }
  const prior = new Set(request.review.priorFindingIds);
  const judged = new Set<string>();
  for (const entry of result["rechecks"] as unknown[]) {
    const recheck = object(entry) ?? invalid("change review recheck shape");
    if (
      !exact(recheck, ["id", "outcome", "note"]) ||
      typeof recheck["id"] !== "string" ||
      !prior.has(recheck["id"]) ||
      judged.has(recheck["id"]) ||
      !["held", "not-held"].includes(recheck["outcome"] as string) ||
      typeof recheck["note"] !== "string"
    )
      invalid("change review recheck shape");
    judged.add(recheck["id"] as string);
  }
  if (!(result["filesRead"] as unknown[]).every(nonEmpty))
    invalid("change review files read");
  return result as unknown as ChangeReviewResult;
}
