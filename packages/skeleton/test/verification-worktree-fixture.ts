import { writeFileSync, readFileSync, chmodSync, mkdirSync } from "node:fs";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
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
  fixtureGit(
    repo,
    "-c",
    "maintenance.auto=false",
    "commit",
    "-m",
    "Name the contract-focused check",
  );
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

// Synthetic SHA-1 commit-graph corruption using Git's documented CDAT format.
// Recompute the checksum so the host cannot rely on a malformed-file warning.
export const forgeGraph = (
  file: string,
  commit: string,
  change: { tree: string } | { parent: string },
) => {
  const bytes = readFileSync(file);
  assert.equal(bytes.toString("ascii", 0, 4), "CGPH");
  assert.equal(bytes[5], 1);
  const chunks = new Map<string, number>();
  for (let i = 0; i < bytes[6]!; i++) {
    const at = 8 + i * 12;
    chunks.set(
      bytes.toString("ascii", at, at + 4),
      Number(bytes.readBigUInt64BE(at + 4)),
    );
  }
  const oidl = chunks.get("OIDL")!,
    cdat = chunks.get("CDAT")!,
    count = bytes.readUInt32BE(chunks.get("OIDF")! + 255 * 4);
  const position = (oid: string) => {
    for (let i = 0; i < count; i++)
      if (bytes.toString("hex", oidl + i * 20, oidl + (i + 1) * 20) === oid)
        return i;
    throw new Error("synthetic commit missing from graph");
  };
  const at = cdat + position(commit) * 36;
  if ("tree" in change) Buffer.from(change.tree, "hex").copy(bytes, at);
  else {
    const parent = position(change.parent);
    bytes.writeUInt32BE(parent, at + 20);
    // Keep generation-v1 levels consistent with the forged ancestry edge.
    assert.equal(chunks.has("GDA2"), false);
    const parentLevel = bytes.readUInt32BE(cdat + parent * 36 + 28) >>> 2;
    bytes.writeUInt32BE(
      (parentLevel + 1) * 4 + (bytes.readUInt32BE(at + 28) & 3),
      at + 28,
    );
  }
  createHash("sha1")
    .update(bytes.subarray(0, -20))
    .digest()
    .copy(bytes, bytes.length - 20);
  chmodSync(file, 0o644);
  writeFileSync(file, bytes);
};

/** Each planted interpretation has a control that ordinary Git would consume. */
export function plantGitInterpretation(
  root: string,
  worktree: string,
  kind: "replace" | "graph" | "hooks",
  commit: string,
  base: string,
) {
  const common = fixtureGit(
    worktree,
    "rev-parse",
    "--path-format=absolute",
    "--git-common-dir",
  );
  const marker = join(root, "hook-executed");
  if (kind === "replace") fixtureGit(worktree, "replace", commit, base);
  if (kind === "graph") {
    fixtureGit(worktree, "config", "core.commitGraph", "true");
    fixtureGit(
      worktree,
      "-c",
      "commitGraph.generationVersion=1",
      "commit-graph",
      "write",
      "--reachable",
    );
    forgeGraph(join(common, "objects/info/commit-graph"), commit, {
      tree: fixtureGit(worktree, "rev-parse", `${base}^{tree}`),
    });
  }
  if (kind === "hooks") {
    const hooks = join(root, "planted-hooks");
    mkdirSync(hooks);
    const script = `#!/bin/sh\nprintf executed > '${marker}'\n`;
    for (const name of ["post-checkout", "fsmonitor"]) {
      writeFileSync(join(hooks, name), script, { mode: 0o755 });
    }
    fixtureGit(worktree, "config", "core.hooksPath", hooks);
    fixtureGit(worktree, "config", "core.fsmonitor", join(hooks, "fsmonitor"));
  }
  return { common, marker };
}
