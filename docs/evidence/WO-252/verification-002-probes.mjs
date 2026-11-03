// Independent re-verification: real pre-record installer source, preserved
// byte-for-byte from this project's history. All effects stay in the existing
// local-only target fixture. No operator checkout or publication is changed.
import assert from "node:assert/strict";
import test from "node:test";
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { docPath } from "../../../scripts/lib/config.mjs";
import {
  harnessInstallation,
  preserveHarnessRuntime,
} from "../../../scripts/lib/harness.mjs";
import {
  closeOrder,
  git,
  withFixture,
} from "../../../scripts/lib/target-worktree-fixture.mjs";
import {
  ensureTemporaryRoot,
  readTemporaryOwner,
  writeTemporaryOwner,
} from "../../../scripts/lib/temporary-roots.mjs";
import { judgeTemporaryRoot } from "../../../scripts/lib/temporary-prune.mjs";
import { targetRegistryPath } from "../../../scripts/lib/target-worktrees.mjs";

const legacyRevision = "dc447da848e4a14c2c61e48ff91ba969351c6040";
const sourceAt = (revision, file) => {
  const result = spawnSync("git", ["show", `${revision}:${file}`], {
    cwd: process.cwd(),
    encoding: "utf8",
    maxBuffer: 4 * 1024 * 1024,
  });
  assert.equal(result.status, 0, result.stderr);
  return result.stdout;
};
const legacySource = sourceAt(legacyRevision, "scripts/lib/harness.mjs");
const baselineCloseSource = sourceAt(
  "b9e843b6978e057d6794b9d0a76af557e9547ba0",
  "scripts/lib/target-worktree-close.mjs",
);

const prepared = (f) => {
  f.mapClone();
  f.start();
  closeOrder(f);
  git(f.orderRoot, "add", "-A");
  git(
    f.orderRoot,
    "commit",
    "-qm",
    "test: legacy snapshot verification fixture",
  );
  git(
    f.main,
    "merge",
    "-q",
    "--no-ff",
    "-m",
    "Merge fixture records",
    "wo-999",
  );
  git(f.main, "push", "-q", "origin", "main");
  return Object.values(
    JSON.parse(readFileSync(targetRegistryPath(f.main), "utf8")),
  ).find((row) => row.workOrderId === "WO-999");
};

test("VER-002 a pre-record installer with its historical pinned list leaves owned residue that closes after update", (t) =>
  withFixture(
    (f) => {
      const entry = prepared(f);
      const legacyModule = join(
        f.main,
        "scripts/lib/ver002-legacy-harness.mjs",
      );
      writeFileSync(legacyModule, legacySource);
      let previous;
      try {
        // Use the original installer's own list and snapshot generation,
        // unmodified. The copied fixture packages supply its runtime payload.
        const run = spawnSync(
          process.execPath,
          [
            "--input-type=module",
            "-e",
            `
        import { pathToFileURL } from 'node:url';
        const [modulePath, runtimeRoot, target] = process.argv.slice(1);
        const legacy = await import(pathToFileURL(modulePath));
        const installation = legacy.harnessInstallation({ runtimeRoot });
        legacy.preserveHarnessRuntime(target, installation);
        console.log(JSON.stringify({snapshot: installation.runtimeSnapshot,
          files: installation.runtimeFiles.map(file => file.path)}));
      `,
            legacyModule,
            entry.runtimeRoot,
            f.target,
          ],
          {
            cwd: f.main,
            env: f.env,
            encoding: "utf8",
            maxBuffer: 1024 * 1024,
          },
        );
        assert.equal(run.status, 0, run.stderr);
        previous = JSON.parse(run.stdout.trim());
      } finally {
        unlinkSync(legacyModule);
      }
      const current = harnessInstallation({ runtimeRoot: entry.runtimeRoot });
      const currentFiles = current.runtimeFiles.map((file) => file.path);
      assert.notDeepEqual(previous.files, currentFiles);
      assert.notEqual(previous.snapshot, current.runtimeSnapshot);
      assert.equal(
        existsSync(join(f.target, previous.snapshot, ".dotln-snapshot.json")),
        false,
      );
      preserveHarnessRuntime(f.target, current);
      const result = f.close("--publish");
      const record = JSON.parse(
        readFileSync(
          docPath(
            f.main,
            "control",
            "local/retained/WO-999/release-close.json",
          ),
          "utf8",
        ),
      );
      t.diagnostic(
        JSON.stringify({
          legacyRevision,
          previousPins: previous.files.length,
          currentPins: currentFiles.length,
          addedPins: currentFiles.filter(
            (file) => !previous.files.includes(file),
          ),
          previousHasRecord: false,
          closeStatus: result.status,
          outcome: record.targetCleanup?.outcome,
          blockerClass: record.blocker?.class,
          blockerStep: record.blocker?.step,
          namesLegacySnapshot:
            record.blocker?.message.includes(previous.snapshot) ?? false,
          previousRetained: existsSync(join(f.target, previous.snapshot)),
          currentRetained: existsSync(join(f.target, current.runtimeSnapshot)),
        }),
      );
      assert.equal(
        result.status,
        0,
        "a snapshot emitted by the pre-record production installer must remain recognizable after its pinned list changes",
      );
      assert.equal(record.blocker, null);
      assert.equal(existsSync(f.target), false);
    },
    { baseIgnore: ".runtime/\ndocs/control/local/\n" },
  ));

test("VER-002 a stopped target removal preserves an expired root's ordinary prune eligibility", (t) =>
  withFixture(
    (f) => {
      prepared(f);
      const scratch = ensureTemporaryRoot(join(f.base, "dotln-ledger-probe"), {
        class: "session-scratch",
        repository: f.target,
        retentionHours: 0,
        owner: {
          pid: 2147483647,
          birth: "1.0",
          session: "0".repeat(64),
          gateId: undefined,
          suite: undefined,
        },
      });
      const owner = readTemporaryOwner(scratch);
      delete owner.fixtureOwner;
      owner.createdAt = "2020-01-01T00:00:00.000Z";
      owner.endedAt = owner.createdAt;
      writeTemporaryOwner(scratch, owner);
      const context = {
        processes: [],
        openPaths: [],
        holders: [],
        gateLive: false,
      };
      const before = judgeTemporaryRoot(f.main, scratch, {}, context);
      assert.ok(before?.candidate, JSON.stringify(before));
      git(f.clone, "worktree", "lock", f.target);
      // The exact baseline close helper runs first in the same local fixture.
      // Its refusal leaves the ledger and the ordinary prune route usable.
      const closeHelper = join(f.main, "scripts/lib/target-worktree-close.mjs");
      const repairedCloseSource = readFileSync(closeHelper, "utf8");
      const replaceFixtureHelper = (bytes, message) => {
        writeFileSync(closeHelper, bytes);
        git(f.main, "add", "scripts/lib/target-worktree-close.mjs");
        git(f.main, "commit", "-qm", message);
        git(f.main, "push", "-q", "origin", "main");
      };
      let baseline;
      try {
        replaceFixtureHelper(
          baselineCloseSource,
          "test: baseline close helper control",
        );
        const stopped = f.close("--publish");
        baseline = {
          closeStatus: stopped.status,
          ledgerRetained: existsSync(
            join(
              f.target,
              ".runtime/temporary-roots/roots",
              `${owner.token}.jsonl`,
            ),
          ),
          pruneCandidate: Boolean(
            judgeTemporaryRoot(f.main, scratch, {}, context)?.candidate,
          ),
        };
        assert.notEqual(baseline.closeStatus, 0);
        assert.equal(baseline.ledgerRetained, true);
        assert.equal(baseline.pruneCandidate, true);
      } finally {
        replaceFixtureHelper(
          repairedCloseSource,
          "test: restored current close helper",
        );
      }
      try {
        const stopped = f.close("--publish");
        assert.notEqual(stopped.status, 0);
        assert.ok(existsSync(f.target));
        const record = JSON.parse(
          readFileSync(
            docPath(
              f.main,
              "control",
              "local/retained/WO-999/release-close.json",
            ),
            "utf8",
          ),
        );
        const after = judgeTemporaryRoot(f.main, scratch, {}, context);
        t.diagnostic(
          JSON.stringify({
            baseline,
            beforeCandidate: Boolean(before?.candidate),
            targetRetained: existsSync(f.target),
            ledgerRetained: existsSync(
              join(
                f.target,
                ".runtime/temporary-roots/roots",
                `${owner.token}.jsonl`,
              ),
            ),
            registeredRootCaptured:
              record.ownedTemporaryRoots?.some((row) => row.path === scratch) ??
              false,
            afterCandidate: Boolean(after?.candidate),
            afterReason: after?.retained?.reason,
            blockerClass: record.blocker?.class,
            blockerStep: record.blocker?.step,
          }),
        );
        assert.ok(
          after?.candidate,
          "a stopped close must not strand a previously prunable root by deleting its ledger while its owner checkout remains",
        );
      } finally {
        git(f.clone, "worktree", "unlock", f.target);
        f.ok(f.close("--publish"));
      }
    },
    { baseIgnore: ".runtime/\ndocs/control/local/\n" },
  ));
