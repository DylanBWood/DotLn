import { execFileSync } from "node:child_process";
import { existsSync, lstatSync, mkdirSync, realpathSync } from "node:fs";
import {
  canonicalStringify,
  compileFeedbackAudit,
  type AcceptanceCriterion,
  type VerificationSubject,
} from "@dotln/compiler";
import {
  appendEvent,
  decodeLog,
  replay,
  type Decision,
  type EventDraft,
  type JsonValue,
} from "@dotln/kernel";
import { WorkerStore } from "./worker-store.js";
import {
  feedbackStateFromRuntime,
  initialState,
  seiriReactor,
  type RuntimeState,
} from "./reactor.js";
import { personalFeedback } from "./loadouts/feedback.js";
import {
  readFeedbackSource,
  runFeedbackRegressions,
  type FeedbackAuditReport,
} from "./feedback-audit.js";
import { feedbackContentHash } from "./feedback-boundary.js";
import { VerificationDriver, VerificationHost } from "./verification-host.js";
import { projectAcceptanceEvidenceMatrices } from "./verification.js";
import type { WorkOrderTransport } from "./worker-transport.js";
import type { EvidenceWorkerRequest } from "./verification-protocol.js";
import type { WorkerEffort } from "./worker-protocol.js";
import { join } from "node:path";

class FeedbackDriver {
  state: RuntimeState;
  log: string;
  readonly decisions: Decision<RuntimeState>[];
  constructor(readonly store: WorkerStore) {
    this.log = store.read();
    const restored = replay(
      initialState(),
      decodeLog(this.log),
      seiriReactor,
      {},
    );
    this.state = restored.state;
    this.decisions = [...restored.decisions];
  }
  feed(draft: EventDraft): Decision<RuntimeState> {
    const appended = appendEvent(this.log, draft);
    const decision = seiriReactor(this.state, appended.event, {
      now: appended.event.occurredAt,
      rngState: 17,
      predicates: {},
    });
    this.store.append(appended.event);
    this.log = appended.log;
    this.state = decision.state;
    this.decisions.push(decision);
    return decision;
  }
}
export interface FeedbackSelfhostOptions {
  readonly root: string;
  readonly directory: string;
  readonly transport: WorkOrderTransport<EvidenceWorkerRequest>;
  readonly model: string;
  readonly effort: WorkerEffort;
  readonly now?: () => number;
  readonly afterAuditSaved?: () => void;
}
/** Actual repository audit, deterministic executor, separate blinded verifier episode. */
export async function runFeedbackSelfhost(options: FeedbackSelfhostOptions) {
  const now = options.now ?? Date.now;
  const source = readFeedbackSource(options.root);
  const program = personalFeedback();
  const baseCommit = execFileSync("git", ["rev-parse", "HEAD"], {
    cwd: options.root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    timeout: 5000,
  }).trim();
  const baselinePaths = new Set(
    execFileSync(
      "git",
      [
        "ls-tree",
        "-r",
        "--name-only",
        "-z",
        baseCommit,
        "--",
        ...source.files.map((file) => file.path),
      ],
      {
        cwd: options.root,
        encoding: "utf8",
        stdio: ["ignore", "pipe", "pipe"],
        timeout: 5000,
      },
    ).split("\0"),
  );
  const baselineFiles = source.files
    .filter((file) => baselinePaths.has(file.path))
    .map((file) => ({
      path: file.path,
      contents: execFileSync("git", ["show", `${baseCommit}:${file.path}`], {
        cwd: options.root,
        encoding: "utf8",
        stdio: ["ignore", "pipe", "pipe"],
        timeout: 5000,
      }),
    }));
  if (baselineFiles.length === 0)
    throw new Error("feedback baseline source unavailable");
  const workOrder = compileFeedbackAudit(
    program,
    "DotLn-working-source",
    baseCommit,
    source.subject,
  );
  const auditStore = new WorkerStore(join(options.directory, "audit"));
  auditStore.acquire();
  let report: FeedbackAuditReport, auditLog: string;
  try {
    const driver = new FeedbackDriver(auditStore);
    const record = (type: string, payload: unknown) =>
      driver.feed({
        schemaVersion: 1,
        type,
        actorId: "feedback-host",
        workstreamId: "ws_feedback_audit",
        occurredAt: now(),
        episodeId: "ep_feedback_executor",
        payload: payload as JsonValue,
      });
    if (driver.state.feedback === undefined)
      record("FeedbackAuditOpened", {
        program,
        workOrder,
        subject: source.subject,
        authority: {
          authorityEnvelopeId: "feedback-audit-grant",
          allowedEffects: ["feedback.audit"],
          deniedEffects: ["repo.write", "repo.delete", "publish"],
          resourceLimits: { audits: 1 },
          requiredEvidence: ["feedback-policy", "pinned-source"],
          expiresAt: now() + 60 * 60_000,
          revocationEventTypes: [],
        },
      });
    let state = feedbackStateFromRuntime(driver.state);
    if (
      state.subject !== source.subject ||
      !same(state.workOrder, workOrder) ||
      !same(state.program, program)
    )
      throw new Error("feedback selfhost recovery source or policy drift");
    if (!state.pending) record("FeedbackAuditRequested", {});
    state = feedbackStateFromRuntime(driver.state);
    if (!state.pending) throw new Error("feedback audit dispatch refused");
    if (!state.persisted)
      record("CommandPersisted", { command: state.pending });
    if (state.result === null) {
      const ready = record("FeedbackAuditExecutionRequested", {});
      if (ready.trace.branchPath.at(-1) !== "feedback-execution-ready")
        throw new Error("feedback execution refused");
      report = runFeedbackRegressions(options.root, program);
      record("CommandResult", {
        commandId: state.pending.commandId,
        subject: source.subject,
        policyHash: program.policyHash,
        report,
      });
      options.afterAuditSaved?.();
    } else report = state.result as unknown as FeedbackAuditReport;
    auditLog = driver.log;
    const replayed = replay(
      initialState(),
      decodeLog(driver.log),
      seiriReactor,
      {},
    );
    if (
      !same(replayed.state, driver.state) ||
      !same(replayed.decisions, driver.decisions)
    )
      throw new Error("feedback audit replay mismatch");
  } finally {
    auditStore.release();
  }

  if (readFeedbackSource(options.root).subject !== source.subject)
    throw new Error("feedback source drift before verification");
  const files = [
    ...source.files,
    {
      path: "docs/evidence/WO-011/feedback.json",
      contents: JSON.stringify(report, null, 2) + "\n",
    },
  ];
  const revision = feedbackContentHash(canonicalStringify(files));
  const criteria: readonly AcceptanceCriterion[] = [
    {
      criterionId: "AC-causal-fixtures",
      description:
        "All ten feedback regression episodes pass with mechanisms present and fail by assertion with only their mechanism removed.",
      claimType: "behavior",
      evidenceSource: "synthetic-fixture",
      codeSurfaces: files.map((file) => file.path),
      requiredChecks: ["present-removed-pairs"],
    },
    {
      criterionId: "AC-context",
      description:
        "The matched instruction projection reduces UTF-8 bytes relative to the WO-004 baseline plus the ten prose equivalents; it makes no effective-session token claim.",
      claimType: "state",
      evidenceSource: "synthetic-fixture",
      codeSurfaces: files.map((file) => file.path),
      requiredChecks: ["instruction-byte-accounting"],
    },
  ];
  const subject: VerificationSubject = {
    repo: workOrder.repo,
    baseCommit,
    revision,
    diff: "Host audit adds its command results to the pinned working-source snapshot. No source mutation is part of this work order.",
    files,
    evidence: criteria.map((criterion, index) => ({
      evidenceId: `${revision}:${criterion.criterionId}`,
      criterionId: criterion.criterionId,
      checkId: criterion.requiredChecks[0]!,
      claimType: criterion.claimType,
      source: criterion.evidenceSource,
      subjectRevision: revision,
      codeSurfaces: criterion.codeSurfaces,
      automatedTest:
        index === 0
          ? "WO-011 isolated present/removal regression pairs"
          : "feedbackContextAccounting",
      observed:
        index === 0
          ? `${report.fixtures.length} present passes; ${report.fixtures.length} removed assertion failures`
          : `${report.context.savedBytes} fewer UTF-8 bytes`,
      expected:
        index === 0
          ? "10 present passes; 10 removed assertion failures"
          : "positive reduction with matched baseline",
      outcome: (
        index === 0
          ? report.fixtures.length === 10
          : report.context.savedBytes > 0
      )
        ? "pass"
        : "fail",
      reproductionSteps: [
        "npm run evidence:feedback -- --write",
        "Inspect the present/removal captures and instruction accounting in feedback.json.",
      ],
    })),
  };
  const verifierStore = new WorkerStore(join(options.directory, "verifier"));
  verifierStore.acquire();
  try {
    const driver = new VerificationDriver(
      verifierStore,
      "ws_feedback_audit_verification",
    );
    const selection = {
      transport: options.transport.name,
      harnessVersion: options.transport.harnessVersion,
      model: options.model,
      effort: options.effort,
    };
    const configured = decodeLog(driver.log).find(
      (event) => event.type === "VerificationHostConfigured",
    );
    if (configured && !same(configured.payload, selection))
      throw new Error("feedback verifier selection drift");
    if (!configured)
      driver.record("VerificationHostConfigured", now(), selection);
    if (driver.state.next === "unopened")
      driver.record("VerificationOpened", now(), {
        baseline: {
          ...subject,
          revision: baseCommit,
          files: baselineFiles,
          diff: "",
          evidence: subject.evidence.map((item) => ({
            ...item,
            evidenceId: `${baseCommit}:${item.criterionId}`,
            subjectRevision: baseCommit,
            codeSurfaces: baselineFiles.map((file) => file.path),
            automatedTest: null,
            observed:
              "No feedback audit was executed against the base revision.",
            outcome: "unavailable",
          })),
        },
        subject,
        criteria,
        implementerEpisodeId: "ep_feedback_executor",
        maxRepairs: 0,
        authority: {
          authorityEnvelopeId: "feedback-verification-grant",
          allowedEffects: ["verification.evaluate"],
          deniedEffects: [
            "repo.write",
            "repo.delete",
            "repair.propose",
            "publish",
          ],
          resourceLimits: { episodes: 1 },
          requiredEvidence: ["pinned-subject", "baseline-witness"],
          expiresAt: now() + 60 * 60_000,
          revocationEventTypes: ["VerificationRevoked"],
        },
      });
    if (!same(driver.state.subject, subject))
      throw new Error("feedback verifier subject drift");
    if (driver.state.next === "verify") {
      driver.persistNext(now());
      const host = new VerificationHost({
        driver,
        transport: options.transport,
        now,
        feedback: program,
      });
      const mount = join(verifierStore.directory, "mount");
      if (!existsSync(mount)) mkdirSync(mount, { mode: 0o700 });
      if (lstatSync(mount).isSymbolicLink() || realpathSync(mount) !== mount)
        throw new Error("feedback verifier mount alias");
      if (!existsSync(join(mount, ".git")))
        execFileSync("git", ["init", "--quiet"], { cwd: mount, stdio: "pipe" });
      const mountRoot = execFileSync("git", ["rev-parse", "--show-toplevel"], {
        cwd: mount,
        encoding: "utf8",
        stdio: ["ignore", "pipe", "pipe"],
      }).trim();
      const dirty = execFileSync(
        "git",
        [
          "status",
          "--porcelain",
          "--untracked-files=all",
          "--ignored=matching",
        ],
        { cwd: mount, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] },
      ).trim();
      if (realpathSync(mountRoot) !== mount || dirty)
        throw new Error("feedback verifier mount contains extra context");
      // No model filesystem tools: the capsule is the complete explicit read projection.
      const envelope = await host.run(mount, options.model, options.effort);
      if (envelope.status !== "completed")
        throw new Error("feedback verifier incomplete");
    }
    const matrix = projectAcceptanceEvidenceMatrices(decodeLog(driver.log))[0]!;
    return {
      report,
      workOrder,
      auditLog,
      verificationLog: driver.log,
      matrix,
      complete: matrix.phase === "complete",
    };
  } finally {
    verifierStore.release();
  }
}
const same = (a: unknown, b: unknown) =>
  canonicalStringify(a) === canonicalStringify(b);
