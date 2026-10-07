/** Production bindings: the vertical has no replacement worker, verifier,
 * reviewer, repairer or publisher. Every effect below calls a landed host. */
import {
  existsSync,
  lstatSync,
  mkdirSync,
  readFileSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { basename, join } from "node:path";
import { compileLoadout, compileVerificationTask } from "@dotln/compiler";
import { decodeLog } from "@dotln/kernel";
import { WorkerStore } from "../../packages/skeleton/dist/src/worker-store.js";
import { SourceChangeHost } from "../../packages/skeleton/dist/src/source-change-host.js";
import {
  VerificationDriver,
  VerificationHost,
  preflightVerificationRecovery,
} from "../../packages/skeleton/dist/src/verification-host.js";
import {
  prepareWorktreeVerification,
  assertWorktreeSnapshot,
} from "../../packages/skeleton/dist/src/verification-worktree.js";
import { RepairHost } from "../../packages/skeleton/dist/src/repair-host.js";
import { repairContract } from "../../packages/skeleton/dist/src/repair.js";
import { routeReview } from "../../packages/skeleton/dist/src/review.js";
import {
  baselineStoryClass,
  verticalEqual,
} from "../../packages/skeleton/dist/src/vertical.js";
import { SOURCE_CHANGE_DENIED } from "../../packages/skeleton/dist/src/worker-protocol.js";
import { sourceGit } from "../../packages/skeleton/dist/src/source-change-worktree.js";
import { writerLoadout, publishTargetOrder } from "./target-publish.mjs";
import { deliveryContractHash } from "./github-body.mjs";
import {
  observePullRequest,
  UNFINISHED_CHECK_STATES,
} from "./pull-request-observer.mjs";
import { resolveReviewComments } from "./review-comment-loop.mjs";
import { TOOL_ROOT } from "./config.mjs";
import { verticalTransport } from "./vertical-transport.mjs";
import {
  liveTransport,
  recordedJudgment,
  triageSubject,
} from "./vertical-judgment.mjs";

const read = (file) => JSON.parse(readFileSync(file, "utf8"));
const write = (file, value) =>
  writeFileSync(file, JSON.stringify(value, null, 2) + "\n", { flag: "wx" });
const last = (state, ...steps) =>
  state.receipts.findLast((r) => steps.includes(r.command.step))?.value;
const complete = (value) => ({ result: "completed", value });
const held = (reason, value = {}) => ({
  result: "NeedsHuman",
  value: { ...value, reason },
});
const requireCompiled = (r) => {
  if (!r.ok)
    throw new Error(
      `vertical compile refused: ${r.diagnostics.map((d) => d.code).join(", ")}`,
    );
  return r;
};

const SETTLE_LIMITS = { timeoutMs: 900_000, pollMs: 15_000 };

function assertResolutionDirectory(directory, child) {
  mkdirSync(child, { recursive: true });
  const stat = lstatSync(child);
  if (
    !stat.isDirectory() ||
    stat.isSymbolicLink() ||
    realpathSync(child) !== join(realpathSync(directory), basename(child))
  )
    throw new Error("vertical resolution checkout directory identity drift");
}

/** A detached checkout of `revision` at `<child>/input-tree`, used once and
 * always removed. The child must be the run directory's own real child; a
 * checkout or registration left by a kill between add and remove is cleared
 * first, so a recovered resolution never adds over a stale registration. */
export function withDetachedCheckout(target, directory, child, revision, use) {
  assertResolutionDirectory(directory, child);
  const tree = join(child, "input-tree");
  const leftover = lstatSync(tree, { throwIfNoEntry: false });
  if (leftover?.isSymbolicLink())
    throw new Error("vertical resolution checkout directory identity drift");
  if (leftover)
    try {
      sourceGit(target, "worktree", "remove", "--force", tree);
    } catch {
      rmSync(tree, { recursive: true, force: true });
    }
  // Clear only this checkout's own registration when it outlived its
  // directory; another registration, stale or valid, is the operator's (D047).
  const own = join(realpathSync(child), "input-tree");
  if (
    sourceGit(target, "worktree", "list", "--porcelain")
      .split("\n")
      .includes(`worktree ${own}`)
  )
    // Twice forced: a kill during `worktree add` can leave it locked.
    sourceGit(target, "worktree", "remove", "--force", "--force", own);
  sourceGit(target, "worktree", "add", "--detach", tree, revision);
  try {
    return use(tree);
  } finally {
    sourceGit(target, "worktree", "remove", "--force", tree);
  }
}

function loadout(state) {
  const { binding, workOrder } = state;
  const local = ["repo.read", "repo.write", "git.local", "shell.run"];
  const denied = [
    ...new Set([...binding.authority.deniedEffects, ...SOURCE_CHANGE_DENIED]),
  ];
  const authorityEnvelope = {
    ...binding.authority,
    allowedEffects: local,
    deniedEffects: denied,
  };
  const identity = { version: 1, name: "Bounded source worker" };
  return {
    schemaVersion: 1,
    loadoutId: `vertical.${binding.key}`,
    identity: {
      ...identity,
      identityId: "vertical-source",
      dispositions: ["evidence-bound"],
      invariants: ["One writer per worktree"],
      updateLaws: ["Explicit authority only"],
      lineage: ["source-change"],
    },
    role: {
      ...identity,
      roleId: "vertical-source",
      obligations: ["Implement the bounded contract"],
      permissions: [],
      objectives: [workOrder.objective],
      policyDeltas: [],
    },
    containers: [
      {
        ...identity,
        containerId: "source-worktree",
        kind: "workspace",
        socketBudget: 0,
        activeMechanicIds: ["source-change"],
        supportFacetIds: [],
      },
    ],
    activeMechanics: [
      {
        ...identity,
        activeMechanicId: "source-change",
        tags: ["mutate"],
        requiredCapabilities: [],
        semantics: ["One bounded local source change"],
        authorityEnvelope,
        workOrder: {
          ...workOrder,
          allowedOperations: local,
          prohibitedOperations: denied,
        },
        inspection: {
          originalTerm: "Source change",
          translation: "Source change",
          kanji: "",
          rpgTitle: "Source worker",
          grants: [],
          restrictions: [],
          obligations: [],
          passive: [],
          pulse: [],
          interrupt: [],
        },
      },
    ],
    supportFacets: [],
    links: [],
    linkGroups: [],
    explicitPipelines: [],
    ambientEffects: [],
    authorityGrants: binding.grants.filter(
      (g) =>
        g.grantedBy === "operator" &&
        g.repo === binding.target &&
        g.effects.every((e) =>
          ["repo.push", "pr.open", "pr.thread.resolve"].includes(e),
        ) &&
        (g.operations ?? []).every((e) =>
          ["repo.push", "pr.open", "pr.thread.resolve"].includes(e),
        ) &&
        g.effects.some((e) =>
          ["repo.push", "pr.open", "pr.thread.resolve"].includes(e),
        ),
    ),
    resourceModel: {
      resourceModelId: "vertical-writer",
      version: 1,
      capacities: { writers: 1 },
      reservations: [],
    },
    polarAxes: [],
  };
}
export function createVerticalPrimitives({
  configuration: cfg,
  directory,
  now = Date.now,
  external = {},
  active,
}) {
  mkdirSync(directory, { recursive: true });
  const transport = (kind) =>
    verticalTransport(external[kind] ?? liveTransport(cfg), active);
  const waitUntil =
    external.waitUntil ??
    ((deadline) =>
      new Promise((done) => setTimeout(done, Math.max(0, deadline - now()))));
  /** A declared automated reviewer posts before its check run finishes. Wait,
   * bounded by the settle limit, authority expiry and running authority, until
   * every declared check has finished at the observed head, so a reviewer still
   * running is never read as an empty review. Returns the unsettled reason. */
  async function observeSettled(observeOnce, expiresAt) {
    const settle = external.settle ?? SETTLE_LIMITS;
    const deadline = Math.min(now() + settle.timeoutMs, expiresAt);
    for (;;) {
      const observed = observeOnce();
      // A declared reviewer that was cancelled, skipped or failed may never have
      // posted; only a finished, successful run settles it.
      const states = (name) =>
        observed.payload.checks
          .filter((c) => c.name === name)
          .map((c) => c.state);
      const waiting = [],
        ended = [];
      for (const name of cfg.awaitChecks ?? []) {
        const seen = states(name);
        if (
          !seen.length ||
          seen.some((state) => UNFINISHED_CHECK_STATES.has(state))
        )
          waiting.push(`${name} (${seen.join(", ") || "absent"})`);
        else if (seen.some((state) => !["SUCCESS", "NEUTRAL"].includes(state)))
          ended.push(`${name} (${seen.join(", ")})`);
      }
      if (ended.length)
        return {
          observed,
          unsettled: `declared automated review checks ended without success: ${ended.join(", ")}`,
        };
      if (!waiting.length) return { observed, unsettled: null };
      if (now() >= deadline)
        return {
          observed,
          unsettled:
            deadline === expiresAt
              ? `authority expired while awaiting declared checks: ${waiting.join(", ")}`
              : `declared automated review checks did not finish: ${waiting.join(", ")}`,
        };
      if (active && !(await active(false)))
        return {
          observed,
          unsettled: "running authority ended while awaiting declared checks",
        };
      await waitUntil(Math.min(now() + settle.pollMs, deadline));
    }
  }
  function compiled(state) {
    const graph = loadout(state);
    const environment = {
      environmentId: `vertical.${state.binding.key}`,
      version: 1,
      capabilities: [],
      repo: state.binding.target,
      baseCommit: state.workOrder.baseCommit,
    };
    const file = join(directory, "loadout.json");
    if (existsSync(file)) {
      if (!verticalEqual(read(file), graph))
        throw new Error("vertical loadout drift");
    } else write(file, graph);
    const writer = requireCompiled(
      compileLoadout(writerLoadout(graph), environment),
    );
    requireCompiled(
      compileLoadout(graph, {
        ...environment,
        authorityGrantRegistry: cfg.grants,
      }),
    );
    return { graph, environment, writer, file };
  }
  function original(state) {
    const { writer } = compiled(state);
    return {
      workOrder: writer.program.workOrder,
      authorityEnvelope: writer.program.authorityEnvelope,
      criteria: state.binding.criteria,
      tests: state.binding.tests,
      surfaces: state.binding.derivation.surfaces.map((s) => s.path),
      roundLimit: 1,
    };
  }
  function sourceOptions(state) {
    const { writer } = compiled(state);
    return {
      authorityEvidence: cfg.resident.evidence,
      artifactIdentity: writer.artifactIdentity,
      worktreeParent: cfg.worktreeParent,
      launchpadCheckout: TOOL_ROOT,
      model: cfg.workers.model,
      effort: cfg.workers.effort,
      transport: transport("writer"),
    };
  }
  function snapshot(state, name, tree, commit) {
    const saved = join(directory, `${name}.json`);
    let prepared;
    if (existsSync(saved)) prepared = read(saved);
    else {
      prepared = prepareWorktreeVerification({
        worktree: tree,
        baseCommit: state.workOrder.baseCommit,
        observedCommit: commit,
        repo: cfg.repositoryId,
        contract: repairContract(compiled(state).writer.program.workOrder),
        criteria: state.binding.criteria,
        tests: state.binding.tests,
        directory: join(directory, name),
      });
      write(saved, prepared);
    }
    if (
      prepared.subject.revision !== commit ||
      !verticalEqual(
        prepared.subject.snapshot.contract,
        repairContract(compiled(state).writer.program.workOrder),
      )
    )
      throw new Error("vertical snapshot binding drift");
    assertWorktreeSnapshot(
      compileVerificationTask(
        state.workOrder.workOrderId,
        state.binding.criteria,
        prepared.subject,
      ),
      prepared.snapshotPath,
    );
    return prepared;
  }
  async function judge(state, command, prepared, baseline, context) {
    const storePath = join(
      directory,
      command.step === "baseline"
        ? "baseline-verifier"
        : `verification-${command.round}`,
    );
    const store = new WorkerStore(storePath);
    const stream = `vertical_${state.binding.key}_${command.step === "baseline" ? "baseline" : command.round}`;
    store.acquire(() =>
      preflightVerificationRecovery(
        store,
        stream,
        () => prepared.snapshotPath,
        cfg.workers.model,
        cfg.workers.effort,
      ),
    );
    try {
      const driver = new VerificationDriver(store, stream);
      if (!store.read()) {
        driver.record("VerificationOpened", now(), {
          baseline,
          subject: prepared.subject,
          criteria: state.binding.criteria,
          implementerEpisodeId:
            command.step === "baseline"
              ? `prechange_${state.binding.key}`
              : last(state, "source-change", "repair").implementerEpisodes.at(
                  -1,
                ),
          ...(command.step === "baseline"
            ? {}
            : {
                implementerEpisodeIds: last(state, "source-change", "repair")
                  .implementerEpisodes,
              }),
          episodeNamespace: `vertical_${state.binding.key}_${command.round}`,
          ...(command.step === "baseline"
            ? {}
            : {
                reviewConventionsPath: cfg.conventionsPath ?? null,
                reviewNotice: true,
              }),
          baselineContext: context,
          maxRepairs: 0,
          authority: {
            authorityEnvelopeId: `judge:${state.binding.key}`,
            allowedEffects: ["verification.evaluate"],
            deniedEffects: ["repo.write", "repo.delete", "network"],
            resourceLimits: { episodes: 4 },
            requiredEvidence: [],
            expiresAt: state.binding.authority.expiresAt,
            revocationEventTypes: [],
          },
        });
      }
      if (!driver.state.pending) driver.persistNext(now());
      // A failed actor retains the primitive's lease until it expires. Honor
      // that boundary before asking the same host for its one fresh attempt.
      if (
        command.step === "review" &&
        command.attempt === 1 &&
        driver.state.pending?.activeEpisode
      ) {
        const deadline = driver.state.pending.leaseExpiresAt;
        if (external.waitUntil) await external.waitUntil(deadline);
        else
          while (now() < deadline)
            await new Promise((done) =>
              setTimeout(done, Math.min(1000, deadline - now())),
            );
      }
      await new VerificationHost({
        driver,
        transport: transport(
          command.step === "review" ? "reviewer" : "verifier",
        ),
        now,
      }).run(prepared.snapshotPath, cfg.workers.model, cfg.workers.effort);
      return { state: driver.state, storePath };
    } finally {
      store.release();
    }
  }
  function publication(state) {
    const { file, environment } = compiled(state);
    const source = last(state, "source-change");
    const current = last(state, "source-change", "repair");
    const verified = last(state, "verification");
    return {
      launchpad: cfg.root,
      workOrderId: state.workOrder.workOrderId,
      registry: cfg.grants,
      requireDeliverableReady: true,
      now: now(),
      log() {},
      request: {
        loadout: file,
        environment,
        store: source.store,
        baseBranch: cfg.baseBranch,
        repositoryId: cfg.repositoryId,
        verificationStore: verified.storePath,
        reviewStore: verified.storePath,
        baselineStore: last(state, "baseline").storePath,
        repairStores: current.repairStores,
      },
    };
  }
  return {
    async execute(command, state) {
      if (command.step === "baseline") {
        const classification = baselineStoryClass(
          state.binding.contract,
          state.binding.baselineAssessment,
        );
        if (classification.kind === "unresolved")
          return held(classification.findings[0]);
        const prepared = snapshot(
          state,
          "baseline-snapshot",
          state.binding.target,
          state.workOrder.baseCommit,
        );
        const story = {
          storyId: state.binding.contract.contractId,
          kind: classification.kind,
          ...(classification.kind === "defect"
            ? {
                tests: state.binding.tests.map((t) => ({
                  ...t,
                  expectedExitCode: 1,
                })),
              }
            : {}),
        };
        const judged = await judge(state, command, prepared, prepared.subject, {
          kind: "baseline",
          story,
        });
        const witness = judged.state.baselineWitness;
        if (!witness)
          return held("baseline episode produced no admitted witness");
        return complete({
          prepared,
          witness,
          storePath: judged.storePath,
          storyClass: story.kind,
          storyClassification: classification,
          outcome: witness.outcome,
        });
      }
      if (command.step === "source-change") {
        const o = original(state);
        const host = new SourceChangeHost({
          ...sourceOptions(state),
          store: new WorkerStore(join(directory, "source")),
          workOrder: o.workOrder,
          authorityEnvelope: o.authorityEnvelope,
          branch: `fix/intent-${state.binding.key}`,
          surfaces: o.surfaces,
          testCommand: o.tests[0].command,
          commitMessage: "fix: implement requested behavior\n",
          now,
        });
        const result = await host.run();
        if (result.status !== "observed")
          return {
            result: "refused",
            value: {
              reason: "source-change host refused",
              refusal: result.refusal,
            },
          };
        const implementerEpisodes = decodeLog(host.options.store.read())
          .filter((e) => e.type === "WorkerAttemptStarted")
          .map((e) => e.payload.workerEpisodeId);
        return complete({
          ...result.observation,
          tree: host.tree.path,
          store: host.options.store.directory,
          implementerEpisodes,
          repairStores: [],
        });
      }
      if (command.step === "witnesses") {
        const current = last(state, "source-change", "repair");
        const visual = state.binding.criteria.some(
          (c) => c.claimType === "visual",
        );
        // WO-059's installed adapter targets its declared synthetic app. It is
        // never relabelled as live evidence about an arbitrary target.
        if (visual && !cfg.browserScenario)
          return held(
            "browser scenario is not configured for the visual claim",
          );
        let browser = null;
        if (cfg.browserScenario) {
          const { runScenario } =
            await import("../../packages/browser-evidence/dist/src/index.js");
          browser = await (external.browser ?? runScenario)(
            cfg.browserScenario,
            {
              subjectRevision: current.commit,
              directory: join(directory, `browser-${command.round}`),
            },
          );
          if (visual)
            return held(
              "installed browser adapter supplies synthetic-fixture evidence; live target evidence is unavailable",
              { browser },
            );
        }
        const prepared = snapshot(
          state,
          `candidate-${command.round}`,
          current.tree,
          current.commit,
        );
        return complete({
          prepared,
          browser,
          browserApplicability: visual ? "required" : "no visual criterion",
        });
      }
      if (command.step === "verification" || command.step === "review") {
        const prepared = last(state, "witnesses").prepared;
        const base = last(state, "baseline");
        const judged = await judge(
          state,
          command,
          prepared,
          base.prepared.subject,
          { kind: "comparison", witness: base.witness },
        );
        const v = judged.state;
        if (command.step === "verification") {
          const passed =
            v.next === "review" &&
            v.subject.revision === prepared.subject.revision &&
            v.rows.length === state.binding.criteria.length &&
            v.rows.every(
              (r) =>
                r.status === "verified" &&
                r.evaluations.some(
                  (e) =>
                    !e.stale && e.subjectRevision === prepared.subject.revision,
                ),
            );
          return {
            result: passed
              ? "completed"
              : v.next === "attention"
                ? "NeedsHuman"
                : "repair",
            value: {
              storePath: judged.storePath,
              prepared,
              rows: v.rows,
              evidence: v.evidence,
              reason: passed
                ? "all criteria verified at current revision"
                : "behavior verification did not pass",
            },
          };
        }
        if (!v.reviewCompleted)
          return {
            result: "retry",
            value: {
              reason: "review failed, timed out or was unavailable",
              storePath: judged.storePath,
            },
          };
        const route = routeReview(
          v.reviewCompleted,
          original(state),
          prepared.subject,
        );
        return {
          result:
            route.kind === "NeedsHuman"
              ? "NeedsHuman"
              : route.repairs.length
                ? "repair"
                : "completed",
          value: {
            storePath: judged.storePath,
            review: v.reviewCompleted,
            route,
            surfaces: state.binding.derivation.surfaces,
            reason:
              route.kind === "NeedsHuman"
                ? "review requires human judgment or scope expansion"
                : "independent review completed",
          },
        };
      }
      if (command.step === "repair") {
        const prior = last(state, "source-change", "repair");
        const prepared = last(state, "witnesses").prepared;
        const review = last(state, "review");
        const reviewed =
          state.receipts.at(-1)?.command.step === "review"
            ? review.route.repairs[0]
            : null;
        const repairDirectory = join(directory, `repair-${command.round}`);
        const host = new RepairHost({
          store: new WorkerStore(repairDirectory),
          original: original(state),
          baseline: last(state, "baseline").prepared.subject,
          subject: prepared.subject,
          snapshotPath: prepared.snapshotPath,
          episodeNamespace: command.episodeId,
          directory: join(repairDirectory, "children"),
          source: sourceOptions(state),
          verifier: {
            transport: transport("verifier"),
            model: cfg.workers.model,
            effort: cfg.workers.effort,
          },
          ...(reviewed ? { reviewItem: reviewed.reviewItem } : {}),
          now,
        });
        const repaired = await host.run();
        if (repaired.status !== "complete")
          return held(`bounded repair ended ${repaired.status}`, {
            repairStore: repairDirectory,
            reasonDetail: repaired.reason,
          });
        const child = host.sourceHost();
        const implementerEpisodes = [
          ...prior.implementerEpisodes,
          ...decodeLog(child.options.store.read())
            .filter((e) => e.type === "WorkerAttemptStarted")
            .map((e) => e.payload.workerEpisodeId),
        ];
        return complete({
          commit: repaired.currentCommit,
          tree: child.tree.path,
          store: child.options.store.directory,
          implementerEpisodes,
          repairStores: [...prior.repairStores, repairDirectory],
        });
      }
      if (command.step === "preparation") {
        if (state.binding.contract.openDecisions.length)
          return held("contract has unresolved material ambiguities");
        const verified = last(state, "verification");
        const current = last(state, "source-change", "repair");
        const subject = verified.prepared.subject;
        const named = state.binding.tests.map((t) => t.command);
        const evidence = subject.evidence.filter(
          (e) =>
            e.source === "live" &&
            e.outcome === "pass" &&
            e.subjectRevision === current.commit &&
            e.hostTest?.origin === "host" &&
            named.includes(e.hostTest.command),
        );
        if (
          named.some(
            (name) => !evidence.some((e) => e.hostTest.command === name),
          )
        )
          return held(
            "named checks have no passing host-run evidence at current revision",
          );
        const selection = (kind) => {
          const matches = evidence.filter((e) =>
            new RegExp(`(?:^|[ /:_-])${kind}(?:$|[ /:_-])`, "u").test(
              e.hostTest.command,
            ),
          );
          return matches.length
            ? matches.map((e) => e.evidenceId)
            : {
                status: "not-applicable",
                reason: `The contract names no ${kind} step.`,
              };
        };
        const preparation = {
          schemaVersion: 1,
          workOrderId: state.workOrder.workOrderId,
          subjectRevision: current.commit,
          contractHash: deliveryContractHash(
            compiled(state).writer.program.workOrder,
          ),
          diffHash: (await import("node:crypto"))
            .createHash("sha256")
            .update(subject.diff)
            .digest("hex"),
          unresolvedMaterialAmbiguities: [],
          checks: {
            tests: evidence.map((e) => e.evidenceId),
            build: selection("build"),
            lint: selection("lint"),
          },
          monitoring: {
            owner: "resident",
            repositoryId: cfg.repositoryId,
            headRevision: current.commit,
            command: "worktree resolve-pr",
            ciFailure: "classify-before-repair",
            reviewComments: "triage-by-type",
            sourceDrift: "stop",
            terminalState: "human-controlled",
          },
        };
        const file = join(
          last(state, "source-change").store,
          "delivery-preparation.json",
        );
        if (existsSync(file)) {
          if (!verticalEqual(read(file), preparation))
            throw new Error("delivery preparation drift");
        } else write(file, preparation);
        return complete({ preparation });
      }
      if (command.step === "lint")
        return complete(
          publishTargetOrder({ ...publication(state), preview: true }),
        );
      if (command.step === "publish")
        return complete(publishTargetOrder(publication(state)));
      if (command.step === "observation") {
        const published = last(state, "publish");
        const { observed: event, unsettled } = await observeSettled(
          () =>
            observePullRequest({
              cwd: state.binding.target,
              store: last(state, "source-change").store,
              number: published.number,
              repositoryId: cfg.repositoryId,
              now: now(),
            }),
          state.binding.authority.expiresAt,
        );
        if (unsettled) return held(unsettled, { observation: event });
        if (event.payload.comments.some((c) => c.refused))
          return held(
            `review source screen refused item ${event.payload.comments
              .filter((c) => c.refused)
              .map((c) => c.id)
              .join(", ")}`,
            {
              observation: event,
            },
          );
        return complete({ observation: event });
      }
      if (command.step === "resolution") {
        const published = last(state, "publish");
        /** The candidate the item was observed on, sealed once per item and
         * shared by its triage episode and any repair. */
        const resolutionInput = (active) => {
          const child = join(directory, `resolution-${active.key.slice(8)}`);
          assertResolutionDirectory(directory, child);
          const receipt = join(child, "prepared.json");
          const cached = lstatSync(receipt, { throwIfNoEntry: false });
          if (cached) {
            if (
              !cached.isFile() ||
              cached.isSymbolicLink() ||
              cached.nlink !== 1
            )
              throw new Error(
                "vertical resolution input is not an ordinary file",
              );
            return { child, input: read(receipt) };
          }
          const input = withDetachedCheckout(
            state.binding.target,
            directory,
            child,
            active.observation.payload.headSha,
            (tree) =>
              snapshot(
                state,
                `resolution-${active.key.slice(8)}-snapshot`,
                tree,
                active.observation.payload.headSha,
              ),
          );
          write(receipt, input);
          return { child, input };
        };
        const result = await resolveReviewComments({
          store: last(state, "source-change").store,
          number: published.number,
          repositoryId: cfg.repositoryId,
          original: original(state),
          launchpad: cfg.root,
          judgments: cfg.judgments ?? {},
          checkTests: cfg.checkTests ?? {},
          publication: publication(state),
          now,
          async observe() {
            const { unsettled } = await observeSettled(
              () =>
                observePullRequest({
                  cwd: cfg.root,
                  store: last(state, "source-change").store,
                  number: published.number,
                  repositoryId: cfg.repositoryId,
                  now: now(),
                }),
              state.binding.authority.expiresAt,
            );
            return { unsettled };
          },
          /** An item without a supplied judgment gets one recorded model
           * episode over the candidate it was observed on. `entry` is the
           * loop's item; `active` stays the run's authority observer. */
          async triage(entry) {
            const { child, input } = resolutionInput(entry);
            const record = await recordedJudgment({
              directory: child,
              name: "triage",
              task: "triage",
              subject: triageSubject(state, entry, input.subject),
              transport: () => transport("judge"),
              model: cfg.workers.model,
              effort: cfg.workers.effort,
              now,
            });
            return { ...record.result, producer: record.provenance };
          },
          prepareRepair(active) {
            const { child, input } = resolutionInput(active);
            return {
              store: new WorkerStore(join(child, "repair")),
              baseline: last(state, "baseline").prepared.subject,
              subject: input.subject,
              snapshotPath: input.snapshotPath,
              directory: join(child, "children"),
              source: sourceOptions(state),
              verifier: {
                transport: transport("verifier"),
                model: cfg.workers.model,
                effort: cfg.workers.effort,
              },
              now,
            };
          },
        });
        return result.status === "resolved"
          ? complete(result)
          : held(result.reason ?? "resolution requires a human", {
              resolution: result,
            });
      }
      throw new Error("vertical primitive not bound");
    },
  };
}
