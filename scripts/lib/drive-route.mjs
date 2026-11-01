import { existsSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { createHash } from "node:crypto";
import { docPath } from "./config.mjs";
import { resolveOrderWorktrees } from "./order-worktrees.mjs";
import { localReleaseRecords } from "./release-tags.mjs";
import {
  HOST_GIT_READ,
  fetchRemoteBranch,
  remoteBranchCommit,
} from "./github-repository.mjs";
import { parseWorktrees, runGit, spawnGit } from "./git.mjs";

export const lifecycleRoutes = Object.freeze({
  next: { role: "executor", phrase: "resume: next" },
  fix: { role: "executor", phrase: "resume: fix" },
  verify: { role: "verifier", phrase: "resume: verify" },
  "final-review": { role: "reviewer", phrase: "resume: final review" },
  "release-close": { role: "release-close", phrase: "resume: release close" },
});
const phaseAction = {
  active: "next",
  "ready-to-verify": "verify",
  verifying: "verify",
  "needs-fix": "fix",
  repairing: "fix",
  verified: "final-review",
  "final-review": "final-review",
};
const stopped = (reason, next) => ({
  action: null,
  role: null,
  phrase: null,
  stop: { reason, next },
});

// A close the host declined is not retried. The stop names the attended
// command and, after a Codex decline, the one admitted re-entry, a Claude
// close; the driver and canonical status build the same row from the record
// (WO-247-D004).
export const awaitingCloseStop = (order, awaiting) =>
  stopped(
    "awaiting-close",
    `The ${awaiting?.host ?? "native"} host declined the release close and a declined launcher is not retried. Attend it: in the launchpad's main checkout type resume: release close for ${order}${awaiting?.host === "codex" ? `; or re-enter with node scripts/drive.mjs ${order} --host claude, the one admitted host change, for release close only` : ""}. The drive record's awaitingClose holds the declined item${awaiting?.declined?.reason ? " with the host's reason" : ", for which the host printed no reason"}${awaiting?.retained ? " and the retained observation" : ""}.`,
  );

// A single route table serves both status and the driver. Observations are
// explicit inputs, so a fixture never needs a live worker or a remote fetch.
export function routeOrder(state, events = [], facts = {}) {
  if (facts.operatorMode === "analysis")
    return stopped(
      "analysis",
      "Await operator direction; use analysis: off before driving again.",
    );
  if (facts.operatorMode === "override")
    return stopped(
      "operator-override",
      "Finish operator recovery and use operator override: off before driving again.",
    );
  if (facts.unavailable) return stopped("dispatch-refused", facts.unavailable);
  const activation = events.findLastIndex(
    (row) => row.type === "WorkOrderActivated",
  );
  const current = events.slice(activation + 1);
  if (state.phase === "withdrawn")
    return stopped(
      "off-ramp",
      "The order is withdrawn; a reviewed reactivation is required.",
    );
  const attention = events
    .slice(facts.attentionSince ?? 0)
    .findLast((row) =>
      [
        "RecordCorrected",
        "CriterionWaived",
        "OperatorOverrideRecorded",
        "WorkOrderWithdrawn",
      ].includes(row.type),
    );
  if (attention)
    return stopped(
      attention.type === "RecordCorrected" ? "typed-correction" : "off-ramp",
      "Inspect the operator's recorded direction before another drive phrase.",
    );
  if (facts.operatorFinding)
    return stopped(
      "operator-finding",
      "The recorded finding needs the operator's disposition.",
    );
  if (facts.refused) return stopped("dispatch-refused", facts.refused);
  if (facts.released)
    return stopped(
      "released",
      "The local release attribution or no-release close is recorded.",
    );
  if (facts.awaitingClose && state.phase === "closed")
    return awaitingCloseStop(
      state.workOrderId ?? "WO-NNN",
      facts.awaitingClose,
    );
  // A repair bound limits the repairs still to come, so an order carried past
  // one, by hand or otherwise, finishes normally.
  const repairPending = ["needs-fix", "repairing"].includes(state.phase);
  if (
    repairPending &&
    current.filter(
      (row) => row.type === "VerificationCompleted" && row.verdict === "fail",
    ).length >= 3
  )
    return stopped(
      "verification-bound",
      "Three verification failures reached the repair bound; request operator direction.",
    );
  if (
    repairPending &&
    current.filter(
      (row) => row.type === "FinalReviewCompleted" && row.verdict === "fail",
    ).length >= 2
  )
    return stopped(
      "final-review-bound",
      "Two final-review failures reached the repair bound; request operator direction.",
    );
  const action =
    state.phase === "closed" ? "release-close" : phaseAction[state.phase];
  if ((facts.incomplete?.[action] ?? 0) >= 2)
    return stopped(
      "incomplete-bound",
      "Two workers ended without recording this phase's completion. Repair the cause and run its phrase yourself; a recorded transition clears this stop.",
    );
  if (facts.exhausted)
    return stopped(
      "budget-exhausted",
      "The declared drive budget is exhausted; stop and report spent against the configured keys.",
    );
  if (
    state.phase === "closed" &&
    (!facts.merged || (state.repositoryId && !facts.targetMerged))
  )
    return stopped(
      "awaiting-merge",
      "The operator merges the reviewed pull request(s), then types the same drive phrase again.",
    );
  if (!action)
    return stopped(
      "dispatch-refused",
      "No routable lifecycle action exists for the current phase.",
    );
  const worker =
    facts.worker?.role === lifecycleRoutes[action].role &&
    facts.worker.action === action
      ? facts.worker
      : null;
  return {
    action,
    ...lifecycleRoutes[action],
    stop: null,
    mode: worker?.addressable
      ? "resume"
      : ["verifying", "repairing", "final-review"].includes(state.phase)
        ? "briefing"
        : "dispatch",
    ...(worker?.addressable ? { worker: worker.id } : {}),
    transport: facts.transport ?? "claude-cli-print",
    ...(facts.cwd ? { cwd: facts.cwd, launchpad: facts.launchpad } : {}),
  };
}

// Whether an attempt at an action finished, read from where the order stands
// after it. Anything else counts toward the incomplete bound.
const finishedPhases = {
  next: ["ready-to-verify"],
  fix: ["ready-to-verify"],
  verify: ["verified", "needs-fix"],
  "final-review": ["closed", "needs-fix"],
};
export const attemptFinished = (action, after) =>
  action === "release-close"
    ? after.route.stop?.reason === "released"
    : Boolean(finishedPhases[action]?.includes(after.phase));

export const driveRecordPath = (root, id) =>
  docPath(root, "control", "local/drives", `${id}.json`);
export function readDriveRecord(root, id) {
  const file = driveRecordPath(root, id);
  return existsSync(file) ? JSON.parse(readFileSync(file, "utf8")) : null;
}
const ancestor = (root, branch, base) =>
  spawnGit(["merge-base", "--is-ancestor", branch, base], {
    cwd: root,
    stdio: "ignore",
    timeout: 10000,
  }).status === 0;
// The order's control record as one revision holds it, or null when that
// revision has no record of the order at all.
function orderEventsAt(main, revision, order) {
  const segment = relative(main, docPath(main, "orders", `${order}.jsonl`));
  const read = spawnGit(["show", `${revision}:${segment}`], {
    cwd: main,
    encoding: "utf8",
    maxBuffer: 16 * 1024 * 1024,
    timeout: 10000,
  });
  if (read.error) throw read.error;
  if (read.status !== 0) return null;
  return read.stdout
    .split("\n")
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

// Whether the base holds this exact pass, read from the order's own record
// alone, as close asks of it: the order's worktree can be older than the
// base, so a later order's newer events must not stop it reading a merge that
// happened, and a base without this record has not received the order at all.
function passAtBase(main, order, passed) {
  return (
    orderEventsAt(main, "origin/main", order)?.some(
      (row) =>
        row.type === "FinalReviewCompleted" &&
        row.recordedAt === passed.recordedAt,
    ) ?? false
  );
}

// Whether a release tag's control record for the order holds the current
// activation, read at the tag: a release from before a reactivation does not.
export function releaseHoldsActivation(main, tag, order, activation) {
  return (
    orderEventsAt(main, tag, order)?.some(
      (row) =>
        row.type === "WorkOrderActivated" &&
        row.recordedAt === activation.recordedAt,
    ) ?? false
  );
}

// A batched status read shares observations only for the life of that read.
export function routeFacts(root, state, events = [], context = {}) {
  if (!state.workOrderId) return {};
  try {
    const trees = resolveOrderWorktrees(root, state.workOrderId, {
      worktrees: (context.worktrees ??= parseWorktrees(root)),
    });
    const drive = readDriveRecord(trees.main, state.workOrderId);
    // A drive's refusals and counts describe the log it last saw: a transition
    // recorded since, by hand or otherwise, has already moved past them.
    const current = drive?.factsAt === events.length;
    const facts = {
      transport: drive?.transport,
      cwd: trees.cwd,
      launchpad: trees.launchpad,
      ...(current
        ? {
            incomplete: drive.incomplete,
            refused: drive.refused,
            exhausted: drive.exhausted,
            ...(drive.awaitingClose
              ? { awaitingClose: drive.awaitingClose }
              : {}),
          }
        : {}),
      // An order never driven has no operator attention to wait on: a drive
      // starts past its history, so status must not report a stop it ignores.
      attentionSince: drive?.attentionSince ?? events.length,
      worker: drive?.worker?.addressable
        ? {
            id: drive.worker.id,
            role: drive.worker.role,
            action: drive.worker.action,
            addressable: true,
          }
        : null,
    };
    // The canonical projection exposes only a disposition bit from the bound
    // report; the router never receives report prose or another actor's case.
    if (state.phase === "needs-fix") {
      const failure = events.findLast(
        (row) =>
          ["VerificationCompleted", "FinalReviewCompleted"].includes(
            row.type,
          ) && row.verdict === "fail",
      );
      if (failure?.reportPath && failure.reportHash) {
        const bytes = readFileSync(join(root, failure.reportPath));
        if (
          createHash("sha256").update(bytes).digest("hex") !==
          failure.reportHash.replace(/^sha256:/, "")
        )
          throw new Error("bound failure report changed");
        const block =
          /<!-- dotln-findings:start -->\s*([\s\S]*?)\s*<!-- dotln-findings:end -->/.exec(
            bytes.toString(),
          );
        if (block)
          facts.operatorFinding = JSON.parse(
            block[1].replace(/^```(?:json)?\s*|\s*```$/g, ""),
          ).some((row) => row.route === "operator");
      }
    }
    if (state.phase !== "closed") {
      if (!trees.present)
        facts.refused =
          "The selected order has no registered worktree; restore its worktree before driving. Main cannot select its phase implicitly.";
      return facts;
    }
    const receipt = docPath(
      trees.main,
      "control",
      `local/retained/${state.workOrderId}/release-close.json`,
    );
    const close = existsSync(receipt)
      ? JSON.parse(readFileSync(receipt, "utf8"))
      : null;
    const releaseCache = (context.releases ??= new Map());
    if (!releaseCache.has(trees.main))
      releaseCache.set(trees.main, localReleaseRecords(trees.main));
    // A reactivated order inherits the receipt and the release that closed an
    // earlier activation; only a close of this activation reads as released.
    const activations = events.filter(
      (row) => row.type === "WorkOrderActivated",
    );
    const activation = activations.at(-1);
    const reactivated = activations.length > 1;
    const thisActivation = (recordedAt) =>
      !reactivated ||
      (typeof recordedAt === "string" && recordedAt === activation.recordedAt);
    const noReleaseClose =
      close?.workOrderId === state.workOrderId &&
      close.dryRun !== true &&
      close.publication?.outcome === "no-release" &&
      thisActivation(close.activation?.recordedAt);
    const targetRemoved =
      noReleaseClose && close.targetCleanup?.outcome === "removed";
    facts.released =
      releaseCache
        .get(trees.main)
        .some(
          (row) =>
            row.workOrders.includes(state.workOrderId) &&
            (!reactivated ||
              releaseHoldsActivation(
                trees.main,
                row.name,
                state.workOrderId,
                activation,
              )),
        ) ||
      (noReleaseClose &&
        close.cleanup?.outcome === "clean" &&
        (!state.repositoryId || targetRemoved));
    if (facts.released) return facts;
    const branch = `wo-${state.workOrderId.slice(3)}`;
    // Ancestry alone is true of a branch with no commits, so, as close does, ask
    // whether the order's pass reached the base too. Its report is no use for
    // this, since a target order moves that into the target.
    const passed = events.findLast(
      (row) => row.type === "FinalReviewCompleted" && row.verdict === "pass",
    );
    // Without the order's pass in hand there is nothing to find at the base:
    // a closed order always has one, so a read with no events is not merged.
    facts.merged =
      (ancestor(trees.main, branch, "origin/main") &&
        passed !== undefined &&
        passAtBase(trees.main, state.workOrderId, passed)) ||
      (noReleaseClose && close.cleanup?.branch?.outcome === "deleted");
    // Close judges the remote base and moves the local one afterward, so a
    // merge counts only once it is in the clone's remote-tracking branch, and
    // a target branch still at its base has nothing to merge.
    facts.targetMerged =
      !state.repositoryId ||
      targetRemoved ||
      Boolean(
        trees.target &&
        ancestor(
          trees.target.clone,
          trees.target.branch,
          `origin/${trees.target.baseBranch}`,
        ) &&
        !(
          trees.target.baseCommit &&
          ancestor(
            trees.target.clone,
            trees.target.branch,
            trees.target.baseCommit,
          )
        ),
      );
    if (facts.merged) facts.cwd = facts.launchpad = trees.main;
    return facts;
  } catch (error) {
    return { unavailable: `Route observation unavailable: ${error.message}` };
  }
}

// Status stays a local read. A drive of a closed order fetches first, because a
// hosted merge reaches neither clone by itself and release close would fetch
// them anyway. It fetches as close does, through a host lane, so a clone's own
// transport configuration never runs. That lane starts empty, so a commit the
// clone already holds is named without fetching it. A failed fetch leaves the
// earlier read, not merged yet, and is returned so the stop can name it.
const LOOKUP_TIMEOUT_MS = 60000;
// A new tip brings whole history into that empty lane. The drive cannot be
// cancelled while it waits, so this stays a bounded minutes, not an open wait.
const HISTORY_TIMEOUT_MS = 300000;
export function fetchMergedBases(root, order) {
  const trees = resolveOrderWorktrees(root, order);
  const failed = [];
  const fetch = (label, cwd, branch) => {
    try {
      const url = runGit(cwd, [
        ...HOST_GIT_READ,
        "remote",
        "get-url",
        "origin",
      ]);
      const tip = remoteBranchCommit(url, branch, {
        timeoutMs: LOOKUP_TIMEOUT_MS,
      });
      if (!tip) throw new Error(`the remote has no ${branch}`);
      const held =
        spawnGit([...HOST_GIT_READ, "cat-file", "-e", `${tip}^{commit}`], {
          cwd,
          stdio: "ignore",
        }).status === 0;
      const commit = held
        ? tip
        : fetchRemoteBranch(cwd, url, branch, {
            timeoutMs: HISTORY_TIMEOUT_MS,
          });
      runGit(cwd, [
        ...HOST_GIT_READ,
        "update-ref",
        `refs/remotes/origin/${branch}`,
        commit,
      ]);
    } catch (error) {
      failed.push({ label, cause: error.message });
    }
  };
  fetch("launchpad", trees.main, "main");
  if (trees.target)
    fetch("target", trees.target.clone, trees.target.baseBranch);
  return failed;
}
