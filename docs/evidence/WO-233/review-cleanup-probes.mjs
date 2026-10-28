// Bounded design comparison and regression probes. All mutations stay in
// freshly owned fixtures; the result describes the observed implementation.
import assert from "node:assert/strict";
import { createHash, randomUUID } from "node:crypto";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  createFixtureRoot,
  createScratchRoot,
  createWorkerCapture,
  createTemporaryRoot,
  promoteTemporaryRoot,
  pruneSessionTemporaryRoots,
  readTemporaryOwner,
  removeTemporaryRoot,
  withTemporaryOwner,
} from "../../../scripts/lib/temporary-roots.mjs";
import {
  finishGateTemporaryRoots,
  judgeTemporaryRoot,
  recordTemporaryGateResult,
} from "../../../scripts/lib/temporary-prune.mjs";
import { runGit } from "../../../scripts/lib/git.mjs";

const root = withTemporaryOwner(
  { gateId: undefined, suite: undefined, session: undefined },
  () => createFixtureRoot(join(tmpdir(), "dotln-cleanup-review-")),
);
const result = { observedAt: new Date().toISOString() };
try {
  const sessionId = "cleanup-review-diagnostic-retention";
  const owner = {
    repository: root,
    pid: 2147483647,
    birth: "synthetic-exited-process",
    gateId: undefined,
    suite: undefined,
    session: createHash("sha256").update(sessionId).digest("hex"),
  };
  const paths = withTemporaryOwner(owner, () => {
    const scratch = createScratchRoot(join(root, "rejected-scratch-"));
    const capture = createWorkerCapture(join(root, "rejected-capture-"));
    const durable = createWorkerCapture(join(root, "rejected-promoted-"));
    for (const directory of [scratch, capture, durable])
      writeFileSync(join(directory, "statement.txt"), "diagnostic evidence\n");
    promoteTemporaryRoot(durable);
    return { scratch, capture, durable };
  });
  const pruned = pruneSessionTemporaryRoots(root, sessionId, {
    dispatchEnded: true,
  });
  result.diagnosticRetention = {
    constructorArms: ["createScratchRoot", "createWorkerCapture", "promoted"],
    survived: Object.fromEntries(
      Object.entries(paths).map(([name, directory]) => [
        name,
        existsSync(join(directory, "statement.txt")),
      ]),
    ),
    blockers: pruned.blockers,
  };

  const gateId = randomUUID();
  const parent = createTemporaryRoot(join(root, "passed-suite-"), {
    class: "gate-fixture",
    repository: root,
    owner: { ...owner, gateId, suite: "passed" },
  });
  const child = createTemporaryRoot(join(parent, "failed-suite-"), {
    class: "gate-fixture",
    repository: root,
    owner: { ...owner, gateId, suite: "failed" },
  });
  const tasks = [
    { name: "passed", exitCode: 0 },
    { name: "failed", exitCode: 1 },
  ];
  const endedAt = new Date().toISOString();
  recordTemporaryGateResult(root, {
    temporaryGateId: gateId,
    recordedAt: endedAt,
    taskTimeline: tasks,
  });
  const finished = finishGateTemporaryRoots(root, gateId, tasks, {
    processes: [],
    worktrees: [],
    holders: [],
    endedAt,
  });
  assert.ok(existsSync(child));
  result.nestedFailure = {
    storedOutcome: readTemporaryOwner(child).outcome,
    storedRetentionHours: readTemporaryOwner(child).retentionHours,
    gateRetainedChild: finished.retained.some((row) => row.path === child),
    subsequentPruneSelectsChild: Boolean(
      judgeTemporaryRoot(root, child, {}, { processes: [] }).candidate,
    ),
    subsequentPruneSelectsParent: Boolean(
      judgeTemporaryRoot(root, parent, {}, { processes: [] }).candidate,
    ),
  };

  // This is the remaining priority-regression fixture's seed sequence.
  const seed = createFixtureRoot(join(root, "git-seed-"));
  const git = (args) => runGit(seed, args);
  git(["init", "-q"]);
  writeFileSync(join(seed, "payload"), "fixture\n");
  git(["add", "-A"]);
  git([
    "-c",
    "user.name=Fixture",
    "-c",
    "user.email=fixture@example.invalid",
    "-c",
    "commit.gpgsign=false",
    "-c",
    "maintenance.auto=false",
    "commit",
    "-qm",
    "fixture",
  ]);
  const tracked = git(["ls-files", ".dotln-owner.json"]);
  const clone = join(root, "clone");
  runGit(root, ["clone", "-q", seed, clone]);
  let cloneRefusal = null;
  try {
    readTemporaryOwner(clone);
  } catch (error) {
    cloneRefusal = error.message;
  }
  result.seedPropagation = { tracked, cloneRefusal };
  console.log(JSON.stringify(result, null, 2));
} finally {
  removeTemporaryRoot(root);
}
