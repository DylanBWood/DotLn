// Independent WO-252 verification probes. Effects stay inside the existing
// target-worktree fixture's owned, local-only repositories.
import assert from "node:assert/strict";
import test from "node:test";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { docPath } from "../../../scripts/lib/config.mjs";
import {
  harnessInstallation,
  preserveHarnessRuntime,
} from "../../../scripts/lib/harness.mjs";
import { disposableMatchRoot } from "../../../scripts/lib/target-worktree-close.mjs";
import {
  closeOrder,
  git,
  withFixture,
} from "../../../scripts/lib/target-worktree-fixture.mjs";
import { targetRegistryPath } from "../../../scripts/lib/target-worktrees.mjs";

const prepared = (f) => {
  f.mapClone();
  f.start();
  closeOrder(f);
  git(f.orderRoot, "add", "-A");
  git(f.orderRoot, "commit", "-qm", "test: verified target fixture");
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

test("VER-001 glob depth, literal punctuation, Unicode and shortest-root controls", () => {
  const cases = [
    ["**/node_modules", "node_modules/.cache/x", "node_modules"],
    ["**/node_modules", "a/b/node_modules/x", "a/b/node_modules"],
    ["**/node_modules", "a/node_modules/b/node_modules/x", "a/node_modules"],
    ["**/node_modules", "a/not_node_modules/x", null],
    ["**/node_modules", "a/node_modules_backup/x", null],
    ["libs/*/dist", "libs/a/dist/x", "libs/a/dist"],
    ["libs/*/dist", "libs/a/src/dist/x", null],
    ["libs/*/dist", "libs/dist/x", null],
    ["libs/*/dist", "libs/.hidden/dist/x", "libs/.hidden/dist"],
    ["libs/*/dist", "libs/café/dist/x", "libs/café/dist"],
    ["**/*.tsbuildinfo", "a/b/build.tsbuildinfo", "a/b/build.tsbuildinfo"],
    ["**/*.tsbuildinfo", "build.tsbuildinfo", "build.tsbuildinfo"],
    ["**/*.tsbuildinfo", "build.tsbuildinfo.bak", null],
    ["**/a[b].cache", "x/a[b].cache/child", "x/a[b].cache"],
    ["**/a[b].cache", "x/ab.cache/child", null],
    ["**/ab*cd*ef", "x/abXcdYef/file", "x/abXcdYef"],
    ["**/ab*cd*ef", "x/abefcd/file", null],
    ["**/a/**/dist", "a/dist/file", "a/dist"],
    ["**/a/**/dist", "b/a/x/y/dist/file", "b/a/x/y/dist"],
    ["cache", "cache2/file", null],
  ];
  for (const [pattern, file, expected] of cases)
    assert.equal(
      disposableMatchRoot(pattern, file),
      expected,
      `${pattern}: ${file}`,
    );
});

test("VER-001 every emitted role root communicates the required prune ownership and denial fallback", (t) => {
  const roles = harnessInstallation().files.filter((file) =>
    file.path.endsWith("/SKILL.md"),
  );
  const missing = roles
    .filter(
      (file) =>
        !file.contents.includes("harness.mjs prune --apply") ||
        !file.contents.includes("recorded host denial of that exact command"),
    )
    .map((file) => file.path);
  t.diagnostic(JSON.stringify({ roots: roles.length, missing }));
  assert.deepEqual(
    missing,
    [],
    "criterion 6 says every root; the router may retain its read-only rule while explaining the delegated phase session's cleanup duty",
  );
});

test("VER-001 a complete production-emitted current snapshot closes on the first attempt", (t) =>
  withFixture(
    (f) => {
      const entry = prepared(f);
      const installation = harnessInstallation({
        runtimeRoot: entry.runtimeRoot,
      });
      preserveHarnessRuntime(f.target, installation);
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
          outcome: record.targetCleanup?.outcome,
          blocker: record.blocker,
          snapshotFiles: installation.runtimeInventory.filter(
            (row) => row.kind === "file",
          ).length,
          deleted: record.targetCleanup?.residue?.deleted.map(
            ({ kind, files }) => ({ kind, files }),
          ),
        }),
      );
      assert.equal(result.status, 0, result.stderr);
      assert.equal(record.blocker, null);
      assert.equal(existsSync(f.target), false);
    },
    { baseIgnore: ".runtime/\ndocs/control/local/\n" },
  ));

test("VER-001 a production-emitted snapshot retained across a runtime update is owned residue", (t) =>
  withFixture(
    (f) => {
      const entry = prepared(f);
      // The serving runtime is this fixture's copy, never the verification
      // worktree. A public package-version change models a kit update;
      // both snapshot trees are produced by the production installer.
      assert.ok(entry.runtimeRoot.startsWith(`${f.base}/`));
      const manifest = join(
        entry.runtimeRoot,
        "packages/skeleton/package.json",
      );
      const currentBytes = readFileSync(manifest, "utf8");
      const previous = JSON.parse(currentBytes);
      previous.version = "0.79.0";
      let earlier;
      try {
        writeFileSync(manifest, JSON.stringify(previous, null, 2) + "\n");
        earlier = harnessInstallation({ runtimeRoot: entry.runtimeRoot });
        preserveHarnessRuntime(f.target, earlier);
      } finally {
        writeFileSync(manifest, currentBytes);
      }
      const current = harnessInstallation({ runtimeRoot: entry.runtimeRoot });
      assert.notEqual(earlier.runtimeSnapshot, current.runtimeSnapshot);
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
          status: result.status,
          outcome: record.targetCleanup?.outcome,
          blockerClass: record.blocker?.class,
          blockerStep: record.blocker?.step,
          namesEarlierSnapshot: record.blocker?.message.includes(
            earlier.runtimeSnapshot,
          ),
          earlierSnapshotRetained: existsSync(
            join(f.target, earlier.runtimeSnapshot),
          ),
          currentSnapshotRetained: existsSync(
            join(f.target, current.runtimeSnapshot),
          ),
        }),
      );
      assert.equal(
        result.status,
        0,
        "a snapshot the kit installed must not become undeclared material after a runtime update",
      );
      assert.equal(record.blocker, null);
      assert.equal(existsSync(f.target), false);
    },
    { baseIgnore: ".runtime/\ndocs/control/local/\n" },
  ));
