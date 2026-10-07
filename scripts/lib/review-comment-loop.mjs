import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { canonicalStringify } from "@dotln/compiler";
import { appendEvent, decodeLog, Program, stepProgram } from "@dotln/kernel";
import { WorkerStore } from "../../packages/skeleton/dist/src/worker-store.js";
import { RepairHost } from "../../packages/skeleton/dist/src/repair-host.js";
import {
  judgmentFailure,
  judgmentRetryable,
} from "../../packages/skeleton/dist/src/vertical-judgment-host.js";
import {
  deriveRepairOrder,
  repairHash,
  repairContains,
} from "../../packages/skeleton/dist/src/repair.js";
import { prepareWorktreeVerification } from "../../packages/skeleton/dist/src/verification-worktree.js";
import { sourceGit } from "../../packages/skeleton/dist/src/source-change-worktree.js";
import {
  observePullRequest,
  PULL_REQUEST_OBSERVER,
} from "./pull-request-observer.mjs";
import {
  pushRepairedHead,
  disposeReviewThread,
  TARGET_PUBLISH_HOST,
  readTargetPublishRequest,
  bindReviewRepairInput,
} from "./target-publish.mjs";
import {
  ClaudeCliPrintWorkOrderTransport,
  CodexCliExecWorkOrderTransport,
} from "../../packages/skeleton/dist/src/worker-transport.js";

export const REVIEW_LOOP_HOST = "review-comment-loop";
export const REVIEW_BODY_JUDGMENT_LIMIT = 8;
const same = (a, b) => canonicalStringify(a) === canonicalStringify(b);
const refuse = (reason) => new Error(`review loop refused: ${reason}`);
const env = { now: 0, rngState: 0, predicates: {} };
const invoke = (key, stage, outcomes = { completed: Program.Done() }) =>
  Program.Invoke(
    `cmd_review_${repairHash([key, stage]).slice(8)}`,
    { kind: "Act", effect: `review.${stage}`, payload: { stage } },
    outcomes,
  );
const stages = (key, names) =>
  names.reduceRight(
    (next, stage) =>
      invoke(
        key,
        stage,
        stage === "repair"
          ? { completed: next, human: Program.Done() }
          : { completed: next },
      ),
    Program.Done(),
  );
const itemProgram = (key, item) =>
  invoke(key, "triage", {
    accept: stages(key, [
      "repair",
      "push",
      ...(item.class === "automated-review" ? ["dispose"] : []),
      "observe",
    ]),
    reject: stages(key, ["dispose", "observe"]),
    human: Program.Done(),
  });

/** Fold only this host's records; effect receipts and observer events remain
 * independent inputs. Each command must be the executable program's next one. */
export function replayReviewItems(events) {
  const items = new Map();
  for (const event of events.filter(
    (entry) => entry.actorId === REVIEW_LOOP_HOST,
  )) {
    const p = event.payload;
    if (event.type === "ReviewItemOpened") {
      if (items.has(p.key) || !same(p.continuation, itemProgram(p.key, p.item)))
        throw refuse("item opening drift");
      items.set(p.key, { ...p, pending: null, results: {}, terminal: null });
    } else if (event.type === "ReviewItemCommandPersisted") {
      const state = items.get(p.key);
      const selected = state && stepProgram(state.continuation, null, env);
      if (
        !state ||
        state.pending ||
        selected.intents.length !== 1 ||
        !same(selected.intents[0], p.command.intent)
      )
        throw refuse("command not selected by continuation");
      const head =
        state.continuation.kind === "Sequence"
          ? state.continuation.programs[0]
          : state.continuation;
      if (p.command.commandId !== head.commandId)
        throw refuse("command identity drift");
      state.pending = p.command;
    } else if (event.type === "ReviewItemCommandResult") {
      const state = items.get(p.key);
      if (!state?.pending || state.pending.commandId !== p.commandId)
        throw refuse("result without pending command");
      const stage = state.pending.intent.payload.stage;
      state.continuation = stepProgram(state.continuation, null, env, {
        ...event,
        type: "CommandResult",
      }).residual;
      state.results[stage] = p.value;
      state.pending = null;
    } else if (event.type === "ReviewItemFinished") {
      const state = items.get(p.key);
      if (
        !state ||
        state.pending ||
        state.continuation.kind !== "Done" ||
        state.terminal
      )
        throw refuse("terminal item drift");
      state.terminal = p;
    } else if (
      !["PullRequestReviewLoopStopped", "ReviewBodyJudged"].includes(event.type)
    )
      throw refuse("unknown loop event");
  }
  return items;
}

/** A review body has no thread to resolve or path to repair. Its judgment is
 * recorded per subject: an acknowledgement, citing evidence, that it asks for nothing
 * actionable is its only disposition; any other verdict leaves it to a human
 * while the loop goes on to the other items. */
const isReviewBody = (item) =>
  item.class === "automated-review" && !item.threadId && !item.path;
const reviewBodyKey = (item, observation, original) =>
  repairHash({
    item,
    headSha: observation.payload.headSha,
    repositoryId: observation.payload.repositoryId,
    number: observation.payload.number,
    original,
  });
const judgedReviewBodies = (events) =>
  new Map(
    events
      .filter(
        (event) =>
          event.actorId === REVIEW_LOOP_HOST &&
          event.type === "ReviewBodyJudged",
      )
      .map((event) => [event.payload.subjectKey, event.payload]),
  );
const citesEvidence = (judgment) =>
  Array.isArray(judgment?.evidenceRefs) &&
  judgment.evidenceRefs.length > 0 &&
  judgment.evidenceRefs.every((ref) => typeof ref === "string" && ref.trim());
const acknowledges = (judgment) =>
  judgment?.kind === "acknowledge" && citesEvidence(judgment);
/** A supplied verdict is the host's input; only a launched episode is a model. */
const claimsModel = (judgment) => judgment?.producer?.kind === "model";

/** Why no judgment could dispose this item, or null. A model episode is never
 * launched for an item every verdict would leave to a human. */
function triageBlocker(item, original, checkTests) {
  if (item.class === "ci-failure")
    return checkTests[item.text]
      ? null
      : `check mapping does not name ${item.text}`;
  if (item.class !== "automated-review")
    return `unknown item class ${item.class}`;
  if (!item.path || !repairContains(original.surfaces, item.path))
    return `path outside original surfaces: ${item.path ?? "missing path"}`;
  if (!item.threadId) return "comment has no actionable review thread";
  if (!Number.isSafeInteger(item.line) || item.line < 1)
    return `comment has no positive integer line: ${item.id}`;
  return null;
}

function admittedTriage(item, judgment, observation, original, checkTests) {
  const human = (reason) => ({
    result: "human",
    value: { reason, itemId: item.id },
  });
  const blocked = triageBlocker(item, original, checkTests);
  if (blocked) return human(blocked);
  if (!judgment || !["accept", "reject", "NeedsHuman"].includes(judgment.kind))
    return human("no supplied triage judgment");
  if (judgment.kind === "NeedsHuman")
    return human(judgment.reason ?? "supplied judgment needs human");
  if (!citesEvidence(judgment))
    return human("triage judgment lacks evidence references");
  if (judgment.kind === "reject") {
    if (item.class !== "automated-review")
      return human("a failing check cannot be rejected as a review thread");
    return { result: "reject", value: { judgment } };
  }
  const test = original.tests.find((test) =>
    item.class === "ci-failure"
      ? test.command === checkTests[item.text]
      : test.criterionId === judgment.criterionId &&
        original.criteria
          .find((criterion) => criterion.criterionId === test.criterionId)
          ?.codeSurfaces.some((surface) =>
            repairContains([surface], item.path),
          ),
  );
  if (!test) return human("item has no original named test and criterion");
  const criterion = original.criteria.find(
    (entry) => entry.criterionId === test.criterionId,
  );
  const witness = {
    evidenceId: `${observation.eventId}:${item.id}`,
    subjectRevision: observation.payload.headSha,
    criterionId: test.criterionId,
    itemId: item.id,
    class: item.class,
    ...(item.class === "automated-review"
      ? { path: item.path, line: item.line }
      : { checkName: item.text }),
    testCommand: test.command,
    observed: `Unresolved ${item.class} item ${item.id}`,
    expected: criterion.description,
  };
  const finding = {
    findingId: `review_${repairHash(item.id).slice(8)}`,
    criterionId: test.criterionId,
    severity: "blocking",
    observed: witness.observed,
    expected: witness.expected,
    evidenceRefs: [witness.evidenceId],
    reproductionSteps: [test.command],
    likelySurface:
      item.class === "automated-review" ? [item.path] : criterion.codeSurfaces,
  };
  return { result: "accept", value: { judgment, witness, finding } };
}

/** One command invocation drains currently observed actionable items. Its
 * observer may wait for declared checks and return `{ unsettled }` naming any
 * that did not finish. A supplied judgment wins; otherwise `triage` may judge an
 * unblocked item, or a review body, with a recorded model episode. A triage
 * episode raises RetryableTriageError for an undecided launch/return; unmarked
 * preparation errors remain host failures. At most eight fresh review-body
 * judgments run per invocation. Doubles may replace triage/worker/verifier,
 * never resolution provenance. The original and host selections are pinned
 * before effects. */
export async function resolveReviewComments(options) {
  const {
    store,
    number,
    repositoryId,
    original,
    checkTests = {},
    judgments = {},
    now = Date.now,
  } = options;
  const publication = new WorkerStore(join(store, "publication"));
  const lease = new WorkerStore(join(store, "publication", "review-loop"));
  const events = () => decodeLog(publication.read());
  const opened = events().filter(
    (event) =>
      event.type === "PullRequestOpened" &&
      event.actorId === TARGET_PUBLISH_HOST &&
      event.payload.number === number &&
      event.payload.repositoryId === repositoryId,
  );
  if (opened.length !== 1)
    throw refuse("exactly one recorded pull request is required");
  const opening = opened[0];
  const readObservation = () =>
    events()
      .filter(
        (event) =>
          event.type === "PullRequestStateObserved" &&
          event.actorId === PULL_REQUEST_OBSERVER &&
          event.causationId === opening.eventId,
      )
      .at(-1);
  const append = (type, payload) => {
    publication.acquire();
    try {
      const { event } = appendEvent(publication.read(), {
        schemaVersion: 1,
        type,
        occurredAt: now(),
        actorId: REVIEW_LOOP_HOST,
        workstreamId: opening.workstreamId,
        causationId: opening.eventId,
        payload,
      });
      publication.append(event);
      return event;
    } finally {
      publication.release();
    }
  };
  const observe =
    options.observe ??
    (() =>
      observePullRequest({
        cwd: options.launchpad,
        store,
        number,
        repositoryId,
        now: now(),
      }));
  const stop = (status, reason, itemId = null) => {
    const payload = {
      repositoryId,
      number,
      status,
      reason,
      itemId,
      observationId: readObservation()?.eventId ?? null,
    };
    append("PullRequestReviewLoopStopped", payload);
    return payload;
  };
  lease.acquire();
  try {
    let bodyJudgments = 0;
    let items = replayReviewItems(events());
    let active = [...items.values()].find((item) => !item.terminal);
    if (!active) {
      const unsettled = (await observe())?.unsettled ?? null;
      if (unsettled) return stop("needs-human", unsettled);
    }
    while (true) {
      items = replayReviewItems(events());
      active = [...items.values()].find((item) => !item.terminal);
      const observation = readObservation();
      if (!observation) throw refuse("no recorded PullRequestStateObserved");
      const refused = observation.payload.comments.find((item) => item.refused);
      if (refused)
        return stop(
          "refused",
          `comment screen refused ${refused.id}`,
          refused.id,
        );
      if (!active) {
        const bodies = judgedReviewBodies(events());
        const bodyKey = (item) => reviewBodyKey(item, observation, original);
        const bodyJudgment = (item) =>
          isReviewBody(item) ? bodies.get(bodyKey(item)) : undefined;
        const unresolved = observation.payload.comments.filter(
          (item) =>
            !item.resolved &&
            item.class !== "resolved" &&
            !acknowledges(bodyJudgment(item)?.judgment),
        );
        const candidate = unresolved.find(
          (item) =>
            item.class !== "human-review" &&
            !bodyJudgment(item) &&
            (isReviewBody(item) ||
              !items.has(repairHash([repositoryId, number, item.id]))),
        );
        if (candidate && isReviewBody(candidate)) {
          if (bodyJudgments >= REVIEW_BODY_JUDGMENT_LIMIT)
            return stop(
              "needs-human",
              `review-body judgment limit ${REVIEW_BODY_JUDGMENT_LIMIT} reached before judging item ${candidate.id}`,
              candidate.id,
            );
          const subjectKey = bodyKey(candidate);
          const changedSubject = events().some(
            (event) =>
              event.actorId === REVIEW_LOOP_HOST &&
              event.type === "ReviewBodyJudged" &&
              event.payload.itemId === candidate.id &&
              event.payload.subjectKey !== subjectKey,
          );
          // An old ID-only supplied input is not a fresh judgment of edited
          // text or a new head. A caller may bind a replacement by subject key.
          let judgment =
              judgments[subjectKey] ??
              (changedSubject ? undefined : judgments[candidate.id]),
            failure = claimsModel(judgment)
              ? "a supplied judgment cannot claim a model producer"
              : null;
          if (!judgment && options.triage)
            try {
              judgment = await options.triage({
                key: subjectKey,
                item: candidate,
                observation,
              });
            } catch (error) {
              // A failed attempt has made no decision. Leave the body open
              // for a fresh episode instead of sealing a transient outage.
              if (judgmentRetryable(error)) throw error;
              failure = `triage episode failed: ${judgmentFailure(error)}`;
            }
          append("ReviewBodyJudged", {
            itemId: candidate.id,
            subjectKey,
            observationId: observation.eventId,
            headSha: observation.payload.headSha,
            judgment: failure ? null : judgment,
            reason:
              failure ??
              (acknowledges(judgment)
                ? null
                : (judgment?.reason ?? "review body requires human attention")),
          });
          bodyJudgments++;
          const unsettled = (await observe())?.unsettled ?? null;
          if (unsettled) return stop("needs-human", unsettled);
          continue;
        }
        if (!candidate) {
          const unfinished = [...items.values()].find(
            (item) =>
              !isReviewBody(item.item) && item.terminal?.status !== "resolved",
          );
          if (unfinished)
            return stop(
              "needs-human",
              unfinished.terminal?.reason ?? "item requires human attention",
              unfinished.item.id,
            );
          const remaining = unresolved[0];
          return remaining
            ? stop(
                "needs-human",
                bodyJudgment(remaining)?.reason ??
                  "observed unresolved item requires human attention",
                remaining.id,
              )
            : stop("resolved", "fresh observation has no unresolved items");
        }
        const key = repairHash([repositoryId, number, candidate.id]);
        append("ReviewItemOpened", {
          key,
          item: candidate,
          observation,
          original: { ...original, roundLimit: 1 },
          checkTests,
          judgment: judgments[candidate.id] ?? null,
          continuation: itemProgram(key, candidate),
        });
        continue;
      }
      if (
        !same(active.original, { ...original, roundLimit: 1 }) ||
        !same(active.checkTests, checkTests) ||
        !same(active.judgment, judgments[active.item.id] ?? null)
      )
        throw refuse("recovery request drift");
      if (active.continuation.kind === "Done") {
        const human = Object.values(active.results).find(
          (value) => value.reason,
        )?.reason;
        append("ReviewItemFinished", {
          key: active.key,
          status: human ? "needs-human" : "resolved",
          reason: human ?? null,
        });
        continue;
      }
      let command = active.pending;
      if (!command) {
        const selected = stepProgram(active.continuation, null, env);
        if (!selected.intents.length)
          throw refuse("continuation did not select an effect");
        const head =
          active.continuation.kind === "Sequence"
            ? active.continuation.programs[0]
            : active.continuation;
        command = {
          commandId: head.commandId,
          workstreamId: opening.workstreamId,
          intent: selected.intents[0],
        };
        append("ReviewItemCommandPersisted", { key: active.key, command });
      }
      const stage = command.intent.payload.stage;
      let result = "completed",
        value;
      if (stage === "triage") {
        let judgment = active.judgment,
          failure = null;
        if (claimsModel(judgment))
          failure = "a supplied judgment cannot claim a model producer";
        else if (
          !judgment &&
          options.triage &&
          active.item.class === "automated-review" &&
          !triageBlocker(active.item, active.original, checkTests)
        )
          try {
            judgment = await options.triage(active);
          } catch (error) {
            // Keep this persisted triage command pending until an episode
            // returns a decision; recovery can safely launch a fresh one.
            if (judgmentRetryable(error)) throw error;
            failure = `triage episode failed: ${judgmentFailure(error)}`;
          }
        ({ result, value } = failure
          ? {
              result: "human",
              value: { reason: failure, itemId: active.item.id },
            }
          : admittedTriage(
              active.item,
              judgment,
              active.observation,
              active.original,
              checkTests,
            ));
      } else if (stage === "repair") {
        const triage = active.results.triage;
        const prepared = await options.prepareRepair(active);
        const derivation = deriveRepairOrder(triage.finding, {
          ...active.original,
          subject: prepared.subject,
          round: 0,
          reviewItem: triage.witness,
        });
        if (derivation.kind !== "derived") {
          result = "human";
          value = {
            reason: `repair derivation: ${derivation.reason}: ${derivation.offending}`,
            itemId: active.item.id,
          };
        } else {
          const host = (
            options.createRepairHost ??
            ((configuration) => new RepairHost(configuration))
          )({
            ...prepared,
            original: active.original,
            reviewItem: { witness: triage.witness, finding: triage.finding },
            episodeNamespace: active.key.slice(8),
          });
          const repaired = await host.run();
          value = {
            status: repaired.status,
            headSha: repaired.currentCommit,
            repairStore: host.sourceHost().options.store.directory,
            verificationStore: join(host.options.directory, "verification-1"),
          };
          if (repaired.status !== "complete") {
            // A failed verification must terminate, without reaching push.
            result = "human";
            value.reason = "repair did not independently verify";
          }
        }
      } else if (stage === "push") {
        if (active.results.repair.status !== "complete")
          return stop(
            "needs-human",
            "repair did not independently verify",
            active.item.id,
          );
        value = pushRepairedHead({
          ...options.publication,
          itemKey: active.key,
          repairStore: active.results.repair.repairStore,
          verificationStore: active.results.repair.verificationStore,
          now: now(),
        }).payload;
        options.afterPush?.();
      } else if (stage === "dispose") {
        value = disposeReviewThread({
          ...options.publication,
          itemKey: active.key,
          item: active.item,
          judgment: active.results.triage.judgment,
          now: now(),
        }).payload;
      } else if (stage === "observe") {
        const receipt = events()
          .filter(
            (event) =>
              event.actorId === TARGET_PUBLISH_HOST &&
              event.payload.itemKey === active.key &&
              ["PullRequestRepairPushed", "PullRequestThreadDisposed"].includes(
                event.type,
              ),
          )
          .at(-1);
        const unsettled = (await observe())?.unsettled ?? null;
        const fresh = readObservation();
        const head =
          active.results.repair?.headSha ?? active.observation.payload.headSha;
        const item = fresh?.payload.comments.find(
          (item) => item.id === active.item.id,
        );
        const resolved =
          !unsettled &&
          fresh &&
          receipt &&
          Number(fresh.eventId.slice(4)) > Number(receipt.eventId.slice(4)) &&
          fresh.payload.headSha === head &&
          (active.item.class === "ci-failure"
            ? fresh.payload.checks.some(
                (check) =>
                  check.name === active.item.text && check.state === "SUCCESS",
              )
            : item?.resolved === true && item.class === "resolved");
        value = {
          observationId: fresh?.eventId ?? null,
          ...(resolved
            ? {}
            : {
                reason:
                  unsettled ??
                  "no fresh post-disposition resolution observation",
              }),
        };
      } else throw refuse("unknown continuation effect");
      append("ReviewItemCommandResult", {
        key: active.key,
        commandId: command.commandId,
        result,
        value,
      });
    }
  } finally {
    lease.release();
  }
}

/** File interface: host-authored pinned repair inputs plus supplied judgments.
 * The executable CLI uses real transports; fixture doubles enter through the API. */
export async function runReviewLoopRequest(launchpad, file, registry) {
  const directory = dirname(resolve(file));
  const input = JSON.parse(readFileSync(file, "utf8"));
  if (
    input.schemaVersion !== 1 ||
    !input.targetRequest ||
    !input.repairInput ||
    !input.children ||
    !input.workOrderId ||
    !input.number
  )
    throw refuse(
      "request requires schemaVersion 1, targetRequest, repairInput, children, workOrderId and number",
    );
  const request = readTargetPublishRequest(
    resolve(directory, input.targetRequest),
  );
  const repair = JSON.parse(
    readFileSync(resolve(directory, input.repairInput), "utf8"),
  );
  bindReviewRepairInput(
    { workOrderId: input.workOrderId, request, registry },
    repair,
  );
  const transport = (selection) => {
    if (
      !selection?.model ||
      !selection.effort ||
      process.env.DOTLN_LIVE_WORKERS !== "1"
    )
      throw refuse(
        "live workers require explicit model/effort and DOTLN_LIVE_WORKERS=1",
      );
    if (selection.transport === "claude-cli-print")
      return new ClaudeCliPrintWorkOrderTransport();
    if (selection.transport === "codex-cli-exec")
      return new CodexCliExecWorkOrderTransport();
    throw refuse("unknown worker transport");
  };
  const children = resolve(directory, input.children);
  const source = { ...repair.source, transport: transport(repair.source) };
  const verifier = {
    ...repair.verifier,
    transport: transport(repair.verifier),
  };
  mkdirSync(children, { recursive: true });
  return resolveReviewComments({
    store: request.store,
    number: input.number,
    repositoryId: request.repositoryId,
    original: repair.original,
    launchpad,
    judgments: input.judgments,
    checkTests: input.checkTests,
    publication: {
      launchpad,
      workOrderId: input.workOrderId,
      request,
      registry,
    },
    prepareRepair(active) {
      const directory = join(children, active.key.slice(8));
      mkdirSync(directory, { recursive: true });
      const saved = join(directory, "prepared.json");
      let subject, snapshotPath;
      if (existsSync(saved))
        ({ subject, snapshotPath } = JSON.parse(readFileSync(saved, "utf8")));
      else {
        const tree = join(directory, "input-tree");
        sourceGit(
          repair.original.workOrder.repo,
          "worktree",
          "add",
          "--detach",
          tree,
          active.observation.payload.headSha,
        );
        try {
          ({ subject, snapshotPath } = prepareWorktreeVerification({
            worktree: tree,
            baseCommit: repair.original.workOrder.baseCommit,
            observedCommit: active.observation.payload.headSha,
            repo: repair.subject.repo,
            contract: repair.subject.snapshot.contract,
            criteria: repair.original.criteria,
            tests: repair.original.tests,
            directory: join(directory, "snapshot-input"),
          }));
        } finally {
          sourceGit(repair.original.workOrder.repo, "worktree", "remove", tree);
        }
        // Persist the preparation before a worker can run, like RepairHost's snapshots.
        // A partial preparation remains inspectable rather than silently reused.
        writeFileSync(saved, JSON.stringify({ subject, snapshotPath }) + "\n", {
          flag: "wx",
        });
      }
      return {
        baseline: repair.baseline,
        subject,
        snapshotPath,
        source,
        verifier,
        store: new WorkerStore(join(directory, "repair")),
        directory: join(directory, "children"),
      };
    },
  });
}
