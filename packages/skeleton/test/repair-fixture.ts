import {
  appendFileSync,
  writeFileSync,
  readFileSync,
  chmodSync,
  lstatSync,
  readdirSync,
  rmSync,
} from "node:fs";
import { join } from "node:path";
import type { WorkOrderTransport } from "../src/worker-transport.js";
import { writerPrompt, type WriterRequest } from "../src/worker-protocol.js";
import { SourceChangeHost } from "../src/source-change-host.js";
import { WorkerStore } from "../src/worker-store.js";
import { prepareWorktreeVerification } from "../src/verification-worktree.js";
import { RepairHost, type RepairHostOptions } from "../src/repair-host.js";
import {
  createSourceFixture,
  sourceFixtureOptions,
  fixtureGit,
} from "./source-change-fixture.js";
import {
  snapshotContract,
  snapshotCriteria,
  snapshotTests,
  snapshotTransport,
} from "./verification-worktree-fixture.js";

export function repairTransport(
  root: string,
  wrong = false,
): WorkOrderTransport<WriterRequest> {
  return {
    name: "fake",
    harnessVersion: "fixture",
    dispatch(request, now) {
      const prompt = JSON.parse(writerPrompt(request));
      appendFileSync(
        join(root, "repair-launches.jsonl"),
        JSON.stringify({
          episodeId: request.episodeId,
          workOrder: request.workOrder,
          prompt,
        }) + "\n",
      );
      writeFileSync(
        join(request.cwd, "fixture.txt"),
        `changed by synthetic worker\n${wrong ? `wrong-${prompt.repair.round}` : "contract-satisfied"}\n`,
      );
      fixtureGit(request.cwd, "add", "fixture.txt");
      fixtureGit(request.cwd, "commit", "-F", request.commitMessagePath);
      const commit = fixtureGit(request.cwd, "rev-parse", "HEAD");
      return {
        receipt: Promise.resolve({
          commandId: request.command.commandId,
          transport: "fake",
          acceptedAt: now(),
        }),
        completed: Promise.resolve({
          envelope: {
            workOrderId: request.workOrder.workOrderId,
            episodeId: request.episodeId,
            status: "completed",
            resultId: `result_${request.command.commandId}`,
            summary: "Synthetic repair fixture",
            requiresHuman: false,
            observedCommit: {
              sha: commit,
              branch: fixtureGit(
                request.cwd,
                "symbolic-ref",
                "--short",
                "HEAD",
              ),
            },
            observedDenials: "unavailable",
          },
        }),
        alive: () => false,
        kill: () => {},
      };
    },
  };
}
export async function createRepairFixture() {
  const root = createSourceFixture();
  const repo = join(root, "target");
  writeFileSync(
    join(repo, "fixture-test.mjs"),
    "import assert from 'node:assert/strict'; import {readFileSync} from 'node:fs'; assert.match(readFileSync('fixture.txt','utf8'), /changed by synthetic worker/);\n",
  );
  writeFileSync(
    join(repo, "contract-test.mjs"),
    "import assert from 'node:assert/strict'; import {readFileSync} from 'node:fs'; assert.match(readFileSync('fixture.txt','utf8'), /contract-satisfied/);\n",
  );
  fixtureGit(repo, "add", "-A");
  fixtureGit(repo, "commit", "-m", "Repair contract fixture");
  const baseCommit = fixtureGit(repo, "rev-parse", "HEAD");
  writeFileSync(join(root, "base.txt"), baseCommit);
  const sourceOptions = sourceFixtureOptions(root, () => 10);
  const workOrder = {
    ...sourceOptions.workOrder,
    ...snapshotContract,
    knownFacts: ["IMPLEMENTER_NARRATIVE_SENTINEL"],
    decisions: ["IMPLEMENTER_NARRATIVE_SENTINEL"],
  };
  const source = new SourceChangeHost({ ...sourceOptions, workOrder });
  const baseline = prepareWorktreeVerification({
    worktree: repo,
    baseCommit,
    observedCommit: baseCommit,
    repo: "repair-fixture",
    contract: snapshotContract,
    criteria: snapshotCriteria,
    tests: snapshotTests,
    directory: join(root, "baseline"),
  });
  const outcome = await source.run();
  if (outcome.status !== "observed") throw new Error("fixture source failed");
  const prepared = prepareWorktreeVerification({
    worktree: source.tree.path,
    baseCommit,
    observedCommit: outcome.observation.commit,
    repo: "repair-fixture",
    contract: snapshotContract,
    criteria: snapshotCriteria,
    tests: snapshotTests,
    directory: join(root, "initial-verification"),
  });
  const data = {
    original: {
      workOrder,
      authorityEnvelope: sourceOptions.authorityEnvelope,
      surfaces: snapshotCriteria[0]!.codeSurfaces,
      criteria: snapshotCriteria,
      tests: snapshotTests,
    },
    baseline: baseline.subject,
    subject: prepared.subject,
    snapshotPath: prepared.snapshotPath,
  };
  writeFileSync(join(root, "repair-input.json"), JSON.stringify(data));
  writeFileSync(join(root, "repair-launches.jsonl"), "");
  writeFileSync(join(root, "verifier-launches.jsonl"), "");
  return { root, source, ...data };
}
export function repairFixtureOptions(
  root: string,
  wrong = false,
): RepairHostOptions {
  const data = JSON.parse(
    readFileSync(join(root, "repair-input.json"), "utf8"),
  );
  const sourceOptions = sourceFixtureOptions(root, () => 10);
  return {
    ...data,
    store: new WorkerStore(join(root, "repair-store")),
    directory: join(root, "repair-children"),
    source: {
      authorityEvidence: sourceOptions.authorityEvidence,
      artifactIdentity: sourceOptions.artifactIdentity,
      worktreeParent: sourceOptions.worktreeParent,
      launchpadCheckout: sourceOptions.launchpadCheckout,
      model: "fixture",
      effort: "xhigh",
      transport: repairTransport(root, wrong),
    },
    verifier: {
      model: "fixture",
      effort: "xhigh",
      transport: snapshotTransport((request) => {
        appendFileSync(
          join(root, "verifier-launches.jsonl"),
          JSON.stringify({
            episodeId: request.episodeId,
            capsule: request.capsule,
          }) + "\n",
        );
      }),
    },
    now: () => 10,
  };
}
export const fixtureHost = (root: string, wrong = false) =>
  new RepairHost(repairFixtureOptions(root, wrong));
export function disposeRepairFixture(root: string) {
  const unlock = (path: string) => {
    const stat = lstatSync(path);
    if (stat.isSymbolicLink()) return;
    chmodSync(path, stat.isDirectory() ? 0o700 : 0o600);
    if (stat.isDirectory())
      for (const name of readdirSync(path)) unlock(join(path, name));
  };
  unlock(root);
  rmSync(root, { recursive: true, force: true });
}
