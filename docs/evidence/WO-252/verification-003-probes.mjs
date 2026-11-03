// Independent verification of repeated stopped closes with multiple owned
// roots and journal updates. All writes stay in the local target fixture.
import assert from "node:assert/strict";
import test from "node:test";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { docPath } from "../../../scripts/lib/config.mjs";
import {
  closeOrder,
  git,
  withFixture,
} from "../../../scripts/lib/target-worktree-fixture.mjs";
import {
  ensureTemporaryRoot,
  readTemporaryOwner,
  removeTemporaryRoot,
  writeTemporaryOwner,
} from "../../../scripts/lib/temporary-roots.mjs";
import { judgeTemporaryRoot } from "../../../scripts/lib/temporary-prune.mjs";

test("VER-003 repeated locked closes preserve both root registrations and merge journals before successful retry", (t) =>
  withFixture(
    (f) => {
      f.mapClone();
      f.start();
      closeOrder(f);
      git(f.orderRoot, "add", "-A");
      git(f.orderRoot, "commit", "-qm", "test: repeated-close fixture");
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
      const context = {
        processes: [],
        openPaths: [],
        holders: [],
        gateLive: false,
      };
      const roots = ["first", "second"].map((name) => {
        const path = ensureTemporaryRoot(join(f.base, `dotln-${name}`), {
          class: "session-scratch",
          repository: f.target,
          retentionHours: 0,
          owner: {
            pid: 2147483647,
            birth: "1.0",
            session: "0".repeat(64),
          },
        });
        const owner = readTemporaryOwner(path);
        delete owner.fixtureOwner;
        owner.createdAt = "2020-01-01T00:00:00.000Z";
        owner.endedAt = owner.createdAt;
        writeTemporaryOwner(path, owner);
        const segment = join(
          f.target,
          ".runtime/temporary-roots/roots",
          `${owner.token}.jsonl`,
        );
        assert.ok(judgeTemporaryRoot(f.main, path, {}, context)?.candidate);
        return { path, segment, bytes: readFileSync(segment), owner };
      });
      const session = "d".repeat(64);
      const journal = join(
        f.target,
        "docs/control/local/harness",
        `${session}.jsonl`,
      );
      const retained = docPath(
        f.main,
        "control",
        `local/retained/WO-999/harness/${session}.jsonl`,
      );
      const report = () =>
        JSON.parse(
          readFileSync(
            docPath(
              f.main,
              "control",
              "local/retained/WO-999/release-close.json",
            ),
            "utf8",
          ),
        );
      const observations = [];
      git(f.clone, "worktree", "lock", f.target);
      let locked = true;
      try {
        for (const attempt of [1, 2]) {
          mkdirSync(dirname(journal), { recursive: true });
          writeFileSync(
            journal,
            JSON.stringify({ typedEvent: "OperatorMessageObserved", attempt }) +
              "\n",
          );
          const stopped = f.close("--publish");
          assert.notEqual(stopped.status, 0);
          assert.ok(existsSync(f.target));
          const record = report();
          const ledger = record.targetCleanup.residue.deleted.find(
            (row) => row.kind === "temporary-root ledger",
          );
          assert.equal(ledger.outcome, "restored");
          assert.equal(ledger.files, 2);
          for (const root of roots) {
            assert.deepEqual(readFileSync(root.segment), root.bytes);
            assert.ok(
              judgeTemporaryRoot(f.main, root.path, {}, context)?.candidate,
            );
            assert.equal(
              record.ownedTemporaryRoots.filter(
                (saved) => saved.path === root.path,
              ).length,
              1,
            );
          }
          assert.equal(existsSync(journal), false);
          assert.deepEqual(
            readFileSync(retained, "utf8")
              .trim()
              .split("\n")
              .map((line) => JSON.parse(line).attempt),
            Array.from({ length: attempt }, (_, index) => index + 1),
          );
          observations.push({
            attempt,
            ledgerOutcome: ledger.outcome,
            registrations: ledger.files,
            prunableRoots: roots.length,
            retainedJournalRows: attempt,
          });
        }
        git(f.clone, "worktree", "unlock", f.target);
        locked = false;
        const closed = f.close("--publish");
        assert.equal(closed.status, 0, closed.stderr);
        assert.equal(report().blocker, null);
        assert.equal(existsSync(f.target), false);
        for (const root of roots) assert.equal(existsSync(root.path), false);
        assert.equal(
          readFileSync(retained, "utf8").trim().split("\n").length,
          2,
        );
        t.diagnostic(JSON.stringify({ observations, finalOutcome: "removed" }));
      } finally {
        if (locked && existsSync(f.target))
          git(f.clone, "worktree", "unlock", f.target);
        for (const root of roots)
          if (existsSync(root.path))
            removeTemporaryRoot(root.path, readTemporaryOwner(root.path).token);
      }
    },
    { baseIgnore: ".runtime/\ndocs/control/local/\n" },
  ));
