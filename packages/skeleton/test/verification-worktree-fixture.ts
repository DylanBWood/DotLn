import { writeFileSync } from "node:fs";
import { join } from "node:path";
import type {
  AcceptanceCriterion,
  NamedVerificationTest,
  WorktreeVerificationContract,
} from "@dotln/compiler";
import { SourceChangeHost } from "../src/source-change-host.js";
import {
  VerificationDriver,
  VerificationHost,
} from "../src/verification-host.js";
import { prepareWorktreeVerification } from "../src/verification-worktree.js";
import { WorkerStore } from "../src/worker-store.js";
import { fixtureVerificationResult } from "../src/verification-fake.js";
import {
  parseEvidenceResult,
  type EvidenceWorkerRequest,
  type VerificationWorkerResult,
} from "../src/verification-protocol.js";
import type { WorkOrderTransport } from "../src/worker-transport.js";
import {
  createSourceFixture,
  fixtureGit,
  sourceFixtureOptions,
} from "./source-change-fixture.js";

export const snapshotCriteria: readonly AcceptanceCriterion[] = [
  {
    criterionId: "AC-contract",
    description: "The changed file also contains the contract marker.",
    claimType: "behavior",
    evidenceSource: "live",
    codeSurfaces: ["fixture.txt", "fixture-test.mjs", "contract-test.mjs"],
    requiredChecks: ["superficial", "contract"],
  },
];
export const snapshotTests: readonly NamedVerificationTest[] = [
  {
    criterionId: "AC-contract",
    checkId: "superficial",
    command: "node fixture-test.mjs",
  },
  {
    criterionId: "AC-contract",
    checkId: "contract",
    command: "node contract-test.mjs",
  },
];
export const snapshotContract: WorktreeVerificationContract = {
  workOrderId: "wo_source_fixture",
  objective: "Change the fixture and preserve the contract marker.",
  acceptanceCriteria: snapshotCriteria.map((c) => c.description),
  constraints: ["Change only fixture.txt."],
  nonGoals: [],
  requiredEvidence: snapshotTests.map((test) => test.command),
};
export function snapshotResult(
  request: EvidenceWorkerRequest,
): VerificationWorkerResult {
  const result = fixtureVerificationResult(
    request.capsule,
    request.episodeId,
    `result_${request.command.commandId}`,
  ) as VerificationWorkerResult;
  return {
    ...result,
    findings: result.findings.map((finding) => ({
      ...finding,
      likelySurface: ["fixture.txt"],
    })),
  };
}
export function snapshotTransport(
  onDispatch: (request: EvidenceWorkerRequest) => void = () => {},
): WorkOrderTransport<EvidenceWorkerRequest> {
  return {
    name: "fake",
    harnessVersion: "not-applicable",
    dispatch(request, now) {
      onDispatch(request);
      const result = parseEvidenceResult(snapshotResult(request), request);
      return {
        receipt: Promise.resolve({
          commandId: request.command.commandId,
          transport: "fake",
          acceptedAt: now(),
        }),
        completed: Promise.resolve(result),
        alive: () => false,
        kill: () => {},
      };
    },
  };
}
export async function sourceSnapshotFixture() {
  const root = createSourceFixture(),
    repo = join(root, "target");
  writeFileSync(
    join(repo, "contract-test.mjs"),
    "import assert from 'node:assert/strict'; import {readFileSync} from 'node:fs'; assert.match(readFileSync('fixture.txt','utf8'), /contract-satisfied/);\n",
  );
  fixtureGit(repo, "add", "contract-test.mjs");
  fixtureGit(repo, "commit", "-m", "Name the contract-focused check");
  const baseCommit = fixtureGit(repo, "rev-parse", "HEAD");
  writeFileSync(join(root, "base.txt"), baseCommit);
  const baseline = prepareWorktreeVerification({
    worktree: repo,
    baseCommit,
    observedCommit: baseCommit,
    repo: "wo052-scratch-target",
    criteria: snapshotCriteria,
    tests: snapshotTests,
    contract: snapshotContract,
    directory: join(root, "baseline-verification"),
  });
  const sourceOptions = sourceFixtureOptions(root, () => 10);
  const source = new SourceChangeHost({
    ...sourceOptions,
    workOrder: { ...sourceOptions.workOrder, ...snapshotContract },
  });
  const result = await source.run();
  if (result.status !== "observed")
    throw new Error("source fixture did not produce a commit");
  const options = {
    worktree: source.tree.path,
    baseCommit,
    observedCommit: result.observation.commit,
    repo: "wo052-scratch-target",
    criteria: snapshotCriteria,
    tests: snapshotTests,
    contract: snapshotContract,
  };
  const prepared = prepareWorktreeVerification({
    ...options,
    directory: join(root, "verification"),
  });
  return { root, source, result, baseline, options, prepared };
}
export function openSnapshotDriver(
  fixture: Awaited<ReturnType<typeof sourceSnapshotFixture>>,
  name: string,
) {
  const store = new WorkerStore(join(fixture.root, name));
  store.acquire();
  const driver = new VerificationDriver(store, "ws_snapshot_fixture");
  driver.record("VerificationOpened", 10, {
    baseline: fixture.baseline.subject,
    subject: fixture.prepared.subject,
    criteria: snapshotCriteria,
    implementerEpisodeId: "ep_source_implementer",
    maxRepairs: 0,
    authority: {
      authorityEnvelopeId: "auth_snapshot",
      allowedEffects: ["verification.evaluate", "repair.propose"],
      deniedEffects: ["repo.write", "repo.delete", "network"],
      resourceLimits: { episodes: 1 },
      requiredEvidence: [],
      expiresAt: 100000,
      revocationEventTypes: [],
    },
  });
  driver.persistNext(11);
  const host = new VerificationHost({
    driver,
    transport: snapshotTransport(),
    now: () => 12,
  });
  return { store, driver, host };
}
