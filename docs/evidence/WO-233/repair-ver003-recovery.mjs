// Recover only the five source-identified leftovers inspected for this repair.
// Passing quarantine roots rejoin their recorded outer gate. Failed diagnostics
// keep their original windows and a copy of every corrected marker.
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import {
  existsSync,
  lstatSync,
  readFileSync,
  readdirSync,
  realpathSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { basename, join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { runGit } from "../../../scripts/lib/git.mjs";
import {
  activeGateRuns,
  readGateChecks,
} from "../../../scripts/lib/gate-evidence.mjs";
import {
  hostStateRoot,
  withHostLock,
} from "../../../scripts/lib/host-resources.mjs";
import { readHolders } from "../../../scripts/lib/host-lanes.mjs";
import {
  TEMPORARY_OWNER_FILE,
  ensureTemporaryRoot,
  finishTemporaryRoot,
  nestedTemporaryRoots,
  ownerAlive,
  readTemporaryOwner,
  temporaryProcessTable,
  writeTemporaryOwner,
} from "../../../scripts/lib/temporary-roots.mjs";
import {
  finishGateTemporaryRoots,
  judgeTemporaryRoot,
} from "../../../scripts/lib/temporary-prune.mjs";

const root = realpathSync(fileURLToPath(new URL("../../../", import.meta.url)));
const temp = realpathSync(tmpdir());
const apply = process.argv.includes("--apply");
assert.ok(process.argv.slice(2).every((arg) => arg === "--apply"));
const gates = readGateChecks(root);
const digest = (bytes) => createHash("sha256").update(bytes).digest("hex");
const marker = (path) => join(path, TEMPORARY_OWNER_FILE);
const plans = [];
const table = temporaryProcessTable(root);
assert.ok(table);

for (const [name, copy, gateId] of [
  [
    "dotln-wo185-quarantine-9LOzTD",
    "dotln-wo185-buEJPM",
    "10b258ee-5319-4423-9c64-1731c490f7c4",
  ],
  [
    "dotln-wo185-quarantine-q9undf",
    "dotln-wo185-TlkB8y",
    "2a47ed0d-5c31-4d6c-bcf9-2f5737a0fdb9",
  ],
]) {
  const path = join(temp, name),
    record = readTemporaryOwner(path);
  assert.equal(record.class, "gate-fixture");
  assert.equal(record.owner.repository, join(temp, copy, "repo"));
  assert.equal(existsSync(record.owner.repository), false);
  assert.equal(record.owner.gateId, gateId);
  assert.equal(record.owner.suite, "nonfinite-quarantine-roundtrip");
  assert.equal(record.retentionOverride, undefined);
  assert.equal(ownerAlive(record, table), false);
  assert.deepEqual(nestedTemporaryRoots(path), []);
  const gate = gates.findLast((row) => row.temporaryGateId === gateId);
  assert.equal(gate.exitCode, 0);
  const task = gate.taskTimeline.find((row) => row.name === "runner-fixtures");
  assert.equal(task.exitCode, 0);
  assert.ok(Date.parse(record.createdAt) >= Date.parse(task.startedAt));
  assert.ok(Date.parse(record.createdAt) <= Date.parse(task.finishedAt));
  plans.push({
    kind: "passing-quarantine",
    path,
    record,
    gate,
    original: readFileSync(marker(path), "utf8"),
  });
}

for (const name of [
  "dotln-document-base-OtlDQc",
  "dotln-document-base-uybkyR",
]) {
  const path = join(temp, name),
    record = readTemporaryOwner(path);
  assert.equal(record.class, "gate-fixture");
  assert.equal(record.outcome, "failed");
  assert.equal(record.retentionHours, 24);
  assert.equal(ownerAlive(record, table), false);
  const child = join(path, "subject"),
    original = readFileSync(marker(child), "utf8");
  const copied = JSON.parse(original);
  assert.throws(
    () => readTemporaryOwner(child),
    /invalid or the directory was replaced/,
  );
  assert.equal(copied.owner.repository, root);
  assert.equal(copied.owner.gateId, "761c7a01-c073-4aae-b9dc-8ba4117a2fa1");
  assert.equal(copied.owner.suite, "runner-fixtures");
  assert.equal(copied.owner.pid, record.owner.pid);
  assert.equal(ownerAlive(copied, table), false);
  assert.equal(copied.retentionOverride, undefined);
  assert.notEqual(copied.inode, lstatSync(child).ino);
  const commits = runGit(child, [
    "log",
    "--all",
    "--format=%H",
    "--diff-filter=A",
    "--",
    TEMPORARY_OWNER_FILE,
  ])
    .split("\n")
    .filter(Boolean);
  const proof = commits.find(
    (commit) =>
      runGit(child, ["show", `${commit}:${TEMPORARY_OWNER_FILE}`], {
        trim: false,
        onFailure: () => null,
      }) === original,
  );
  assert.ok(proof, "a matching immutable Git blob is required");
  plans.push({
    kind: "copied-marker",
    path,
    child,
    record,
    original,
    proof,
    parentOriginal: readFileSync(marker(path), "utf8"),
  });
}

const parent = join(temp, "dotln-fixture-temporary-3sHpVT");
const parentOwner = readTemporaryOwner(parent);
assert.equal(parentOwner.owner.repository, root);
assert.equal(parentOwner.owner.gateId, "b59b8fda-c3f3-4cf4-9c7d-9cb4ab8ea233");
assert.equal(parentOwner.outcome, "failed");
assert.equal(ownerAlive(parentOwner, table), false);
const scratch = join(
  parent,
  "dotln/894b8b9abe80335e64d666c7a965d4d21c013562578527e2e7d508cbe5fc1c3a/scratch",
);
const scratchOwner = readTemporaryOwner(scratch);
assert.equal(scratchOwner.class, "session-scratch");
assert.equal(scratchOwner.owner.gateId, parentOwner.owner.gateId);
assert.equal(scratchOwner.owner.suite, parentOwner.owner.suite);
assert.equal(scratchOwner.owner.pid, parentOwner.owner.pid);
assert.equal(ownerAlive(scratchOwner, table), false);
assert.equal(scratchOwner.retentionOverride, undefined);
assert.ok(scratchOwner.owner.repository.startsWith(parent + sep));
assert.deepEqual(readdirSync(scratch), [TEMPORARY_OWNER_FILE]);
plans.push({
  kind: "containing-lifetime",
  path: parent,
  child: scratch,
  record: parentOwner,
  original: readFileSync(marker(scratch), "utf8"),
  parentOriginal: readFileSync(marker(parent), "utf8"),
});

const cleanup = [];
if (apply)
  await withHostLock(hostStateRoot(), "lanes", async () => {
    assert.equal(activeGateRuns(root).length, 0);
    assert.equal(
      readHolders(hostStateRoot(), { worktree: root, includeWorktrees: true })
        .holders.length,
      0,
    );
    const current = temporaryProcessTable(root);
    assert.ok(current);
    for (const plan of plans) {
      assert.equal(readTemporaryOwner(plan.path).token, plan.record.token);
      assert.equal(ownerAlive(plan.record, current), false);
      assert.equal(
        readFileSync(marker(plan.child ?? plan.path), "utf8"),
        plan.original,
      );
      if (plan.parentOriginal)
        assert.equal(
          readFileSync(marker(plan.path), "utf8"),
          plan.parentOriginal,
        );
    }
    for (const plan of plans) {
      if (plan.kind === "passing-quarantine") {
        writeTemporaryOwner(plan.path, {
          ...plan.record,
          owner: {
            ...plan.record.owner,
            repository: root,
            suite: "runner-fixtures",
          },
        });
        ensureTemporaryRoot(plan.path, {
          class: "gate-fixture",
          repository: root,
        });
        const result = finishGateTemporaryRoots(
          root,
          plan.record.owner.gateId,
          plan.gate.taskTimeline,
          { rootPaths: [plan.path], endedAt: plan.gate.recordedAt },
        );
        assert.deepEqual(result.blockers, []);
        assert.deepEqual(result.retained, []);
        assert.ok(result.removed.includes(plan.path));
        cleanup.push({
          root: basename(plan.path),
          removed: true,
          gateId: plan.record.owner.gateId,
        });
        continue;
      }
      writeFileSync(
        join(plan.path, ".dotln-diagnosis-ver003.json"),
        JSON.stringify(
          {
            path: relative(plan.path, plan.child),
            originalMarker: plan.original,
            proof:
              plan.proof ??
              "same dead creator, gate and suite inside its physical fixture",
          },
          null,
          2,
        ) + "\n",
        { flag: "wx", mode: 0o600 },
      );
      if (plan.kind === "copied-marker") unlinkSync(marker(plan.child));
      else {
        writeTemporaryOwner(plan.child, {
          ...readTemporaryOwner(plan.child),
          fixtureOwner: {
            token: plan.record.token,
            gateId: plan.record.owner.gateId,
            suite: plan.record.owner.suite,
          },
        });
        finishTemporaryRoot(plan.child, "failed", plan.record.endedAt);
      }
      assert.equal(
        readFileSync(marker(plan.path), "utf8"),
        plan.parentOriginal,
      );
      const judgment = judgeTemporaryRoot(
        root,
        plan.path,
        {},
        {
          processes: current,
          worktrees: [],
          holders: [],
          finishingGate: { repository: root, id: plan.record.owner.gateId },
        },
      );
      assert.ok(
        judgment.retained,
        "failed diagnostics retain their existing windows",
      );
      cleanup.push({
        root: basename(plan.path),
        removed: false,
        reason: judgment.retained.reason,
        endedAt: plan.record.endedAt,
        eligibleAfter: new Date(
          Date.parse(plan.record.endedAt) + 24 * 3_600_000,
        ).toISOString(),
        originalWindowPreserved: true,
      });
    }
  });

const output = {
  observedAt: new Date().toISOString(),
  apply,
  rule: "Exact source-identified roots only; physical records and dead creators checked before mutation. Copied markers require matching Git blobs. Passing roots use normal gate completion; failed roots retain original windows and marker backups. No general ownership refusal is weakened.",
  plans: plans.map((plan) => ({
    kind: plan.kind,
    root: basename(plan.path),
    child: plan.child ? relative(plan.path, plan.child) : undefined,
    originalMarkerSha256: digest(plan.original),
    gateId: plan.record.owner.gateId,
    proof: plan.proof,
  })),
  cleanup,
};
writeFileSync(
  new URL(
    apply
      ? "./repair-ver003-recovery.json"
      : "./repair-ver003-recovery-preview.json",
    import.meta.url,
  ),
  JSON.stringify(output, null, 2) + "\n",
);
console.log(JSON.stringify(output, null, 2));
