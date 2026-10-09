import { execFileSync } from "node:child_process";
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  rmSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { Command, WorkOrder } from "@dotln/kernel";
import {
  validateVerticalJudgmentResult,
  verticalJudgmentSubjectHash,
  type IntakeResult,
  type IntakeSubject,
  type TriageResult,
  type TriageSubject,
  type VerticalJudgmentRequest,
  type VerticalJudgmentTask,
} from "./vertical-judgment-protocol.js";
import { WorkerFailure } from "./worker-protocol.js";
import {
  normalizeWorkerEffort,
  type TransportDispatch,
  type WorkOrderTransport,
} from "./worker-transport.js";

/** Only a native model CLI is labelled a model; any other transport is a
 * declared double, so a test actor can never be recorded as a model. */
const MODEL_TRANSPORTS = new Set(["claude-cli-print", "codex-cli-exec"]);
/** What the receipt says about the episode: launch selection, never readback. */
export interface VerticalJudgmentProvenance {
  readonly kind: "model" | "double";
  readonly task: VerticalJudgmentTask;
  readonly transport: string;
  readonly harnessVersion: string;
  readonly model: string;
  readonly effort: string;
  readonly mode?: "subagents";
  readonly raw?: string;
  readonly episodeId: string;
  readonly subjectHash: string;
  readonly selectionSource: "host-launch";
  readonly effectiveModel: "unknown";
  readonly effectiveEffort: "unknown";
  readonly dispatchedAt: string;
  readonly completedAt: string;
}
type Subject<T extends VerticalJudgmentTask> = T extends "intake"
  ? IntakeSubject
  : TriageSubject;
type Result<T extends VerticalJudgmentTask> = T extends "intake"
  ? IntakeResult
  : TriageResult;

/** One tool-less episode in an empty scratch directory, like the plan refuter:
 * the subject is the whole input and the host validates the whole return. No
 * reactor grant is drawn: the episode has no effect to authorize, and its
 * caller's authority (admission's presence re-sample for intake, the vertical's
 * running-authority observer for triage) bounds when it may launch. A rejected
 * return is copied under `retain` before the scratch directory is removed. */
export async function runVerticalJudgment<T extends VerticalJudgmentTask>(
  options: {
    readonly task: T;
    readonly subject: Subject<T>;
    readonly transport: WorkOrderTransport<VerticalJudgmentRequest>;
    readonly model: string;
    readonly effort: string;
    readonly retain?: string;
  },
  now: () => number = Date.now,
): Promise<{
  readonly result: Result<T>;
  readonly provenance: VerticalJudgmentProvenance;
}> {
  const { task, subject, transport, model } = options;
  const selection = normalizeWorkerEffort(options.effort);
  const subjectHash = verticalJudgmentSubjectHash(subject);
  const identity = `${task}_${subjectHash.slice(7, 23)}`;
  const episodeId = `ep_vertical_${identity}`;
  const command: Command = {
    commandId: `cmd_vertical_${identity}`,
    episodeId,
    workstreamId: `vertical-${task}`,
    intent: {
      kind: "Act",
      effect: "verification.evaluate",
      payload: { task, subjectHash },
    },
  };
  const workOrder: WorkOrder = {
    workOrderId: `vertical_${identity}`,
    objective:
      task === "intake"
        ? "Classify the screened issue's spans and their baseline meaning."
        : "Judge one observed automated pull-request item against its contract.",
    acceptanceCriteria: ["Return only the validated schema object."],
    knownFacts: [],
    decisions: [],
    constraints: ["No tools, files, network or writes are granted."],
    nonGoals: [],
    repo: "vertical-judgment",
    baseCommit: subjectHash,
    allowedOperations: ["verification.evaluate"],
    prohibitedOperations: ["repo.write", "repo.delete", "network"],
    requiredEvidence: [],
    outputContract: { type: "VerticalJudgment", task },
  };
  const dispatchedAt = now();
  // An empty Git directory satisfies Codex trust without adding any context.
  const cwd = mkdtempSync(join(tmpdir(), `dotln-vertical-${task}-`));
  let dispatch: TransportDispatch<IntakeResult | TriageResult> | undefined;
  try {
    try {
      execFileSync("git", ["-c", "init.templateDir=", "init", "--quiet", cwd], {
        stdio: "pipe",
      });
    } catch (error) {
      // A host fault named without the command line, which carries a path.
      throw new Error("judgment scratch repository could not be initialized", {
        cause: error,
      });
    }
    const request: VerticalJudgmentRequest = {
      kind: "vertical-judgment",
      task,
      command,
      workOrder,
      subject,
      episodeId,
      model,
      ...selection,
      cwd,
      profile: { profileId: "vertical-judgment-v1", modelTools: [] },
    };
    let result: Result<T>;
    try {
      dispatch = transport.dispatch(request, now);
      const receipt = await dispatch.receipt;
      if (
        receipt.commandId !== command.commandId ||
        receipt.transport !== transport.name
      )
        throw new WorkerFailure("invalid-result", "judgment receipt identity");
      result = validateVerticalJudgmentResult(
        await dispatch.completed,
        request,
      ) as Result<T>;
    } catch (error) {
      // Only the episode's launch and return certify an undecided judgment,
      // for intake as for triage. Preparation, replay, record publication and
      // cleanup failures pass unmarked and are host faults (WO-112 D047).
      if (judgmentRetryable(error))
        throw task === "triage"
          ? new RetryableTriageError(error)
          : new RetryableJudgmentError(task, error);
      throw error;
    }
    return {
      result,
      provenance: {
        kind: MODEL_TRANSPORTS.has(transport.name) ? "model" : "double",
        task,
        transport: transport.name,
        harnessVersion: transport.harnessVersion,
        model,
        ...selection,
        episodeId,
        subjectHash,
        selectionSource: "host-launch",
        effectiveModel: "unknown",
        effectiveEffort: "unknown",
        dispatchedAt: new Date(dispatchedAt).toISOString(),
        completedAt: new Date(now()).toISOString(),
      },
    };
  } catch (error) {
    dispatch?.kill();
    // The transport leaves the wire and returned object in cwd; keep them.
    // Retention is diagnostic: its failure never replaces the episode's
    // classified outcome (WO-112 D047).
    try {
      const kept = ["result.json", "statement.txt", "wire.jsonl"].filter(
        (name) => existsSync(join(cwd, name)),
      );
      if (options.retain && kept.length) {
        mkdirSync(options.retain, { recursive: true, mode: 0o700 });
        const retained = mkdtempSync(join(options.retain, "rejected-"));
        for (const name of kept)
          copyFileSync(join(cwd, name), join(retained, name));
      }
    } catch {
      /* the episode's own error stands */
    }
    throw error;
  } finally {
    // Nor does removing the scratch directory: a leftover temporary
    // directory costs nothing, while a lost verdict costs an episode.
    try {
      rmSync(cwd, { recursive: true, force: true });
    } catch {
      /* the episode's outcome stands */
    }
  }
}

/** A failed episode's recorded reason: its typed code and detail, or the
 * message of an untyped error, bounded so a stop names its cause. */
export function judgmentFailure(error: unknown): string {
  const reason =
    error instanceof WorkerFailure
      ? `${error.code}${error.detail ? `: ${error.detail}` : ""}`
      : error instanceof Error
        ? error.message
        : "unavailable";
  return reason.replace(/\s+/gu, " ").slice(0, 300);
}
/** Whether a fresh episode could succeed: an unreachable or interrupted actor,
 * never a return the host refused. */
export const judgmentRetryable = (error: unknown): boolean =>
  !(
    error instanceof WorkerFailure &&
    ["invalid-result", "profile-refused"].includes(error.code)
  );

/** An episode's own launch or return made no decision; `cause` is that
 * failure. Nothing else may leave a judgment undecided for a fresh episode. */
export class RetryableJudgmentError extends Error {
  constructor(
    readonly task: VerticalJudgmentTask,
    error: unknown,
  ) {
    super(`${task} episode failed: ${judgmentFailure(error)}`, {
      cause: error,
    });
    this.name = "RetryableJudgmentError";
  }
}
/** A triage episode made no decision. Its consumer retains the pending command
 * and the resident defers it with backoff rather than ending its run loop. */
export class RetryableTriageError extends RetryableJudgmentError {
  constructor(error: unknown) {
    super("triage", error);
    this.name = "RetryableTriageError";
  }
}
