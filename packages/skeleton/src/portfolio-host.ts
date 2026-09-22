/** WO-100: the portfolio actor's hosts. A derived order is materialized
 * through the caller's WO-120 binding, changed by one WO-052 SourceChangeHost
 * episode and judged by one WO-054 VerificationHost episode over a snapshot of
 * the committed change, in the shape RepairHost already composes. */
import { execFileSync } from "node:child_process";
import { join } from "node:path";
import { decodeLog, type JsonValue } from "@dotln/kernel";
import {
  canonicalStringify,
  fnv1a64,
  type AcceptanceCriterion,
  type NamedVerificationTest,
  type WorkOrder,
  type WorktreeVerificationContract,
} from "@dotln/compiler";
import type {
  PortfolioIdentity,
  PortfolioPorts,
  PortfolioVerdict,
} from "./portfolio-actor.js";
import {
  portfolioVerificationCriterion,
  type PortfolioActivation,
} from "./portfolio.js";
import {
  SourceChangeHost,
  type SourceChangeHostOptions,
} from "./source-change-host.js";
import {
  VerificationDriver,
  VerificationHost,
  preflightVerificationRecovery,
} from "./verification-host.js";
import { prepareWorktreeVerification } from "./verification-worktree.js";
import type { EvidenceWorkerRequest } from "./verification-protocol.js";
import type { WorkOrderTransport } from "./worker-transport.js";
import { WorkerStore } from "./worker-store.js";

export interface PortfolioExecutionOptions {
  /** WO-120's `materializeOrder`, bound by a launchpad-owning caller. */
  readonly materialize: (
    compiled: WorkOrder,
    provenance: PortfolioActivation["provenance"],
    options: { readonly surfaces: readonly string[] },
  ) => Promise<PortfolioIdentity>;
  /** The bound repository's checkout, at the binding's base commit and clean. */
  readonly target: string;
  /** Retained child stores and verification copies, outside the target. */
  readonly directory: string;
  readonly source: Pick<
    SourceChangeHostOptions,
    | "authorityEvidence"
    | "artifactIdentity"
    | "worktreeParent"
    | "launchpadCheckout"
    | "model"
    | "effort"
    | "transport"
  >;
  readonly verifier: {
    readonly transport: WorkOrderTransport<EvidenceWorkerRequest>;
    readonly model: string;
    readonly effort: string;
  };
  readonly now?: () => number;
}

const CRITERION = "AC-portfolio";
/** The verification contract is the derived order's, never the writer's. */
function verificationInputs(
  activation: PortfolioActivation,
  identity: PortfolioIdentity,
  codeSurfaces: readonly string[],
) {
  const { order } = activation;
  const criteria: AcceptanceCriterion[] = [
    {
      criterionId: CRITERION,
      description: portfolioVerificationCriterion(order.tests),
      claimType: "behavior",
      evidenceSource: "live",
      codeSurfaces: [...codeSurfaces],
      requiredChecks: order.tests.map((_, i) => `portfolio-${i + 1}`),
    },
  ];
  const tests: NamedVerificationTest[] = order.tests.map((command, i) => ({
    criterionId: CRITERION,
    checkId: `portfolio-${i + 1}`,
    command,
  }));
  // WO-054 judges only what the named commands establish; WO-052 enforces the
  // surfaces, and the order's other criteria guide the writer.
  const contract: WorktreeVerificationContract = {
    workOrderId: identity.workOrderId,
    objective: order.workOrder.objective,
    acceptanceCriteria: [criteria[0]!.description],
    constraints: [...order.workOrder.constraints],
    nonGoals: [...order.workOrder.nonGoals],
    requiredEvidence: [...order.tests],
  };
  return { criteria, tests, contract };
}

/** A Sort move is checked by the host, not judged by a model: the diff is
 * exactly the old path removed and the declared home added, and the home
 * holds the old path's blob. Any Git refusal counts as not held. */
const gitIn =
  (target: string) =>
  (...args: string[]) =>
    execFileSync("git", ["-C", target, ...args], {
      encoding: "utf8",
      timeout: 15_000,
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
export function relocationHolds(
  target: string,
  baseCommit: string,
  commit: string,
  move: { readonly from: string; readonly to: string },
): boolean {
  const git = gitIn(target);
  try {
    const fields = git(
      "diff",
      "--no-ext-diff",
      "--no-renames",
      "--name-status",
      "-z",
      baseCommit,
      commit,
      "--",
    )
      .split("\0")
      .filter(Boolean);
    const changes = new Set<string>();
    for (let i = 0; i + 1 < fields.length; i += 2)
      changes.add(`${fields[i]} ${fields[i + 1]}`);
    return (
      fields.length === 4 &&
      changes.size === 2 &&
      changes.has(`D ${move.from}`) &&
      changes.has(`A ${move.to}`) &&
      git("rev-parse", "--verify", `${baseCommit}:${move.from}`) ===
        git("rev-parse", "--verify", `${commit}:${move.to}`)
    );
  } catch {
    return false;
  }
}

/** WO-054 needs criterion surfaces present in both snapshots: the order's
 * paths that survive the change, plus the files its named commands run. When
 * none is in both (a Sort move checked by `npm test`), the commands still run
 * over the whole tree, so the surfaces are every file both snapshots hold. */
export function verificationSurfaces(
  target: string,
  baseCommit: string,
  commit: string,
  activation: PortfolioActivation,
): string[] {
  const git = gitIn(target);
  const tree = (revision: string) =>
    new Set(
      git("ls-tree", "-r", "-z", "--name-only", revision)
        .split("\0")
        .filter(Boolean),
    );
  const base = tree(baseCommit);
  const changed = tree(commit);
  const shared = (paths: Iterable<string>) =>
    [...new Set([...paths].filter((path) => changed.has(path)))].sort();
  const { order } = activation;
  const named = shared(
    [...order.surfaces, ...order.tests.flatMap((c) => c.split(" "))].filter(
      (path) => base.has(path),
    ),
  );
  return named.length ? named : shared(base);
}

export function portfolioExecution(
  options: PortfolioExecutionOptions,
): PortfolioPorts {
  const now = options.now ?? Date.now;
  const key = (identity: PortfolioIdentity) =>
    fnv1a64(canonicalStringify([identity.workOrderId, "portfolio"]));
  const sourceHost = (
    activation: PortfolioActivation,
    identity: PortfolioIdentity,
  ) => {
    const { order } = activation;
    return new SourceChangeHost({
      ...options.source,
      store: new WorkerStore(
        join(options.directory, `source-${identity.workOrderId}`),
      ),
      // WO-120 names the repository; WO-052 needs the bound checkout.
      workOrder: {
        ...order.workOrder,
        workOrderId: identity.workOrderId,
        repo: options.target,
      },
      authorityEnvelope: order.authorityEnvelope,
      branch: `dotln-portfolio-${key(identity)}`,
      surfaces: order.surfaces,
      testCommand: order.tests[0]!,
      commitMessage: `${identity.workOrderId}: ${order.workOrder.objective}\n`,
      now,
    });
  };
  return {
    materialize: (activation) =>
      options.materialize(activation.order.workOrder, activation.provenance, {
        surfaces: activation.order.surfaces,
      }),
    async change(activation, identity) {
      const outcome = await sourceHost(activation, identity).run();
      return outcome.status === "observed"
        ? {
            status: "observed",
            commit: outcome.observation.commit,
            branch: outcome.observation.branch,
            diffHash: outcome.observation.diffHash,
          }
        : { status: "refused", reason: outcome.refusal.reason };
    },
    async verify(activation, identity, change): Promise<PortfolioVerdict> {
      const { baseCommit, repo } = activation.order.workOrder;
      const surfaces = verificationSurfaces(
        options.target,
        baseCommit,
        change.commit,
        activation,
      );
      if (!surfaces.length)
        throw new Error("portfolio verification has no surface in both trees");
      const { criteria, tests, contract } = verificationInputs(
        activation,
        identity,
        surfaces,
      );
      // A Sort move's obligation is a host-checked criterion ahead of WO-054;
      // a failed relocation is a failed order and no verifier is dispatched.
      const move = activation.order.relocation;
      const hostCriteria = move ? 1 : 0;
      if (
        move &&
        !relocationHolds(options.target, baseCommit, change.commit, move)
      )
        return {
          verdict: "fail",
          criteria: criteria.length + hostCriteria,
          passed: 0,
          findings: 1,
        };
      const common = { baseCommit, repo, contract, criteria, tests };
      const stream = `portfolio_${key(identity)}_verify`;
      const store = new WorkerStore(
        join(options.directory, `verification-${identity.workOrderId}`),
      );
      const snapshotPath = join(
        options.directory,
        `subject-${identity.workOrderId}`,
        "snapshot",
      );
      store.acquire(() =>
        preflightVerificationRecovery(
          store,
          stream,
          () => snapshotPath,
          options.verifier.model,
          options.verifier.effort,
        ),
      );
      try {
        const driver = new VerificationDriver(store, stream);
        if (driver.state.next === "unopened") {
          const baseline = prepareWorktreeVerification({
            ...common,
            worktree: options.target,
            observedCommit: baseCommit,
            directory: join(
              options.directory,
              `baseline-${identity.workOrderId}`,
            ),
          });
          const subject = prepareWorktreeVerification({
            ...common,
            worktree: sourceHost(activation, identity).tree.path,
            observedCommit: change.commit,
            directory: join(
              options.directory,
              `subject-${identity.workOrderId}`,
            ),
          });
          const authority = activation.order.authorityEnvelope;
          driver.record("VerificationOpened", now(), {
            baseline: baseline.subject,
            subject: subject.subject,
            criteria,
            implementerEpisodeId: `portfolio_source_${key(identity)}`,
            episodeNamespace: stream,
            maxRepairs: 0,
            authority: {
              authorityEnvelopeId: "portfolio.verifier",
              allowedEffects: ["verification.evaluate"],
              deniedEffects: ["repo.write", "repair.propose"],
              resourceLimits: { episodes: 1 },
              requiredEvidence: [],
              expiresAt: authority.expiresAt,
              revocationEventTypes: [...authority.revocationEventTypes],
            },
          });
        }
        if (!driver.state.lastResultEventId) {
          driver.persistNext(now());
          await new VerificationHost({
            driver,
            transport: options.verifier.transport,
            now,
          }).run(snapshotPath, options.verifier.model, options.verifier.effort);
        }
        const events = decodeLog(driver.log);
        const admitted = events.find(
          (e) => e.eventId === driver.state.lastResultEventId,
        );
        if (!admitted)
          throw new Error("portfolio verification has no admitted result");
        const value = (admitted.payload as Record<string, JsonValue>)[
          "value"
        ] as unknown as {
          envelope: { requiresHuman: boolean };
          evaluations: { verdict: string }[];
          findings: unknown[];
        };
        const passed = value.evaluations.filter(
          (e) => e.verdict === "pass",
        ).length;
        // RepairHost's rule: no human escalation, every criterion evaluated
        // and every one passing; here also no finding at all.
        const verdict =
          !value.envelope.requiresHuman &&
          value.evaluations.length === criteria.length &&
          passed === criteria.length &&
          !value.findings.length
            ? "pass"
            : "fail";
        return {
          verdict,
          criteria: criteria.length + hostCriteria,
          passed: passed + hostCriteria,
          findings: value.findings.length,
        };
      } finally {
        store.release();
      }
    },
  };
}
