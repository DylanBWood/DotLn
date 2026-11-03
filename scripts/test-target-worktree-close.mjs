import {
  createFixtureRoot,
  ensureTemporaryRoot,
  readTemporaryOwner,
  removeTemporaryRoot,
  removeTemporaryPath as rmSync,
  writeTemporaryOwner,
} from "./lib/temporary-roots.mjs";
import { judgeTemporaryRoot } from "./lib/temporary-prune.mjs";
import { spawnSync } from "node:child_process";
import test from "node:test";
import assert from "node:assert/strict";
import {
  chmodSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  readlinkSync,
  realpathSync,
  renameSync,
  statSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { docPath } from "./lib/config.mjs";
import {
  redactPaths,
  releaseCloseCommand,
  shellQuote,
  spawnGit,
} from "./lib/git.mjs";
import { assertFinderMetadataTypes } from "./lib/finder-metadata.mjs";
import { write } from "./lib/helpers.mjs";
import {
  checkTargetHarness,
  harnessInstallation,
  preserveHarnessRuntime,
  PRE_RECORD_RUNTIME_FILE_LISTS,
  RUNTIME_SNAPSHOT_RECORD,
  runtimeSnapshotContent,
  runtimeSnapshotPath,
} from "./lib/harness.mjs";
import { targetRegistryPath } from "./lib/target-worktrees.mjs";
import { createHash } from "node:crypto";
import { checksPath } from "./lib/gate-evidence.mjs";
import { withWriterReservationLock } from "../packages/skeleton/src/writer-teardown.mjs";
import {
  git,
  fixture,
  withFixture,
  closeOrder,
  publicationSetup,
} from "./lib/target-worktree-fixture.mjs";

test("WO-072 criterion 4: target close requires containment, removes both worktrees, creates no tag and retries", () =>
  withFixture((f) => {
    write(
      f.main,
      "records/siblings/siblings.json",
      JSON.stringify({
        schemaVersion: 1,
        siblings: [
          {
            id: "starter-fixture",
            purpose: "Export fixture",
            relation: { kind: "export", coreCommit: null },
            capabilityRows: [],
          },
        ],
      }),
    );
    git(f.main, "add", "records/siblings/siblings.json");
    git(
      f.main,
      "-c",
      "maintenance.auto=false",
      "commit",
      "-qm",
      "Declare export sibling",
    );
    git(f.main, "push", "-q", "origin", "main");
    f.mapClone();
    const pending =
      "records/state/local/sibling-receipts/starter-fixture/2026-10-13T12-00-00-000Z.json";
    write(
      f.main,
      pending,
      JSON.stringify({
        sibling: "starter-fixture",
        coreCommit: git(f.main, "rev-parse", "HEAD"),
        manifestHash: `sha256:${"1".repeat(64)}`,
        buildHash: "fnv1a64:1234567890abcdef",
        date: "2026-10-13T12:00:00.000Z",
      }) + "\n",
    );
    f.start();
    assert.equal(existsSync(join(f.main, pending)), false);
    assert.match(
      f.ok(f.call(f.orderRoot, f.orderRoot, "siblings", ["index", "--check"])),
      /current/,
    );

    write(f.target, "change.txt", "changed\n");
    write(
      f.target,
      ".gitignore",
      ".claude/settings.local.json\n.claude/hooks/local-cache/\ndeps/\n",
    );
    git(f.target, "add", "-A");
    git(
      f.target,
      "-c",
      "maintenance.auto=false",
      "commit",
      "-qm",
      "test: target change",
    );
    closeOrder(f);
    git(f.orderRoot, "add", "-A");
    git(
      f.orderRoot,
      "-c",
      "maintenance.auto=false",
      "commit",
      "-qm",
      "Closed target order",
    );
    git(
      f.main,
      "merge",
      "-q",
      "--no-ff",
      "-m",
      "Merge target order records",
      "wo-999",
    );
    git(f.main, "push", "-q", "origin", "main");
    const unmerged = f.close("--publish");
    assert.notEqual(unmerged.status, 0);
    assert.match(
      unmerged.stderr,
      /target branch wo-999 is not merged into origin\/main; source retained/,
    );
    assert.ok(
      existsSync(join(f.target, ".claude/target-worker-manifest.json")),
    );
    assert.ok(existsSync(f.orderRoot));
    git(
      f.clone,
      "merge",
      "-q",
      "--no-ff",
      "-m",
      "Merge target change",
      "wo-999",
    );
    git(f.clone, "push", "-q", "origin", "main");
    write(f.target, ".claude/settings.local.json", "local settings\n");
    write(f.target, ".claude/hooks/local-cache/entry.json", "local cache\n");
    write(f.target, "deps/pkg/entry.txt", "local dependency\n");
    for (const mode of ["--dry-run", "--publish"]) {
      const refused = f.close(mode);
      assert.notEqual(refused.status, 0);
      const listed = refused.stderr
        .match(
          /target has undeclared ignored material; source retained: (.*)\. Declare it disposable in the registration or remove it; regenerable build output is deleted at close, never moved to scratch/u,
        )?.[1]
        .split(", ");
      assert.deepEqual(listed?.sort(), [
        ".claude/hooks/local-cache/",
        ".claude/settings.local.json",
        "deps/",
      ]);
      assert.ok(refused.stderr.includes(`close WO-999 ${mode}`));
      assert.ok(existsSync(join(f.target, ".claude/settings.local.json")));
      assert.ok(existsSync(join(f.target, "deps/pkg/entry.txt")));
      checkTargetHarness(f.target, { runtimeRoot: f.main });
    }
    rmSync(join(f.target, ".claude/settings.local.json"));
    rmSync(join(f.target, ".claude/hooks/local-cache"), { recursive: true });
    rmSync(join(f.target, "deps"), { recursive: true });
    const bundle = JSON.parse(
      readFileSync(
        join(f.target, ".claude/target-worker-manifest.json"),
        "utf8",
      ),
    ).installed.map(({ path }) => ({
      path,
      bytes: readFileSync(join(f.target, path)),
    }));
    const installation = docPath(
      f.main,
      "control",
      "local/harness/targets",
      createHash("sha256").update(f.target).digest("hex"),
      "installation.json",
    );
    const installationBytes = readFileSync(installation);
    const exclude = join(f.clone, ".git/info/exclude");
    const excludeBytes = readFileSync(exclude);
    const excludeRegistry = docPath(
      f.main,
      "control",
      "local/harness/excludes",
      `${createHash("sha256").update(exclude).digest("hex")}.json`,
    );
    const registryBytes = readFileSync(excludeRegistry);
    for (const file of bundle) rmSync(join(f.target, file.path));
    for (const keepReceipt of [true, false]) {
      if (!keepReceipt) rmSync(installation);
      for (const mode of ["--dry-run", "--publish"]) {
        const refused = f.close(mode);
        assert.notEqual(refused.status, 0);
        assert.match(
          refused.stderr,
          /bundle manifest.*missing.*source retained/u,
        );
        assert.match(refused.stderr, /Restore.*target-worker-manifest/u);
        assert.ok(existsSync(f.target));
        assert.ok(existsSync(f.orderRoot));
        assert.deepEqual(readFileSync(exclude), excludeBytes);
        assert.deepEqual(readFileSync(excludeRegistry), registryBytes);
      }
    }
    writeFileSync(installation, installationBytes);
    for (const file of bundle) write(f.target, file.path, file.bytes);
    assert.match(f.ok(f.close("--dry-run")), /would-remove/);
    assert.ok(existsSync(f.target));
    assert.ok(existsSync(f.orderRoot));
    const result = f.ok(f.close("--publish"));
    assert.match(result, /no-release/);
    assert.equal(existsSync(f.target), false);
    assert.equal(existsSync(f.orderRoot), false, result);
    for (const repo of [f.main, f.clone]) {
      assert.equal(git(repo, "branch", "--list", "wo-999"), "");
      assert.equal(git(repo, "tag", "--list"), "");
    }
    assert.deepEqual(
      JSON.parse(readFileSync(targetRegistryPath(f.main), "utf8")),
      {},
    );
    const record = JSON.parse(
      readFileSync(
        docPath(f.main, "control", "local/retained/WO-999/release-close.json"),
        "utf8",
      ),
    );
    assert.deepEqual(record.starterRefresh, []);
    assert.equal(record.publication.outcome, "no-release");
    assert.equal(record.publication.tag, null);
    assert.equal(record.targetCleanup.outcome, "removed");
    assert.equal(record.cleanup.outcome, "clean");
    assert.doesNotMatch(
      readFileSync(join(f.clone, ".git/info/exclude"), "utf8"),
      /# target-worker/u,
    );
    assert.match(f.ok(f.close("--publish")), /no-release/);
  }));

test("Finder metadata scans retain unreadable ignored directories and name other unreadable paths relatively", (t) => {
  if (process.getuid?.() === 0)
    return t.skip("root bypasses directory read permissions");
  const root = realpathSync(
    createFixtureRoot(join(tmpdir(), "dotln-finder-permissions-")),
  );
  const cache = join(root, "cache");
  try {
    git(root, "init", "-q");
    write(root, ".gitignore", "cache/\n");
    write(root, "cache/retained.txt", "retained\n");
    chmodSync(cache, 0);
    const scan = assertFinderMetadataTypes(root);
    assert.deepEqual(scan.skippedIgnoredDirectories, ["cache"]);
    assert.ok(scan.durationMs >= 0);
    write(root, ".gitignore", "");
    assert.throws(
      () => assertFinderMetadataTypes(root),
      (error) =>
        /cannot inspect Finder metadata in cache .*restore directory read and search access/u.test(
          error.message,
        ) && !error.message.includes(root),
    );
  } finally {
    if (existsSync(cache)) chmodSync(cache, 0o755);
    rmSync(root, { recursive: true, force: true });
  }
});

test("refusal masking names passed paths by label and masks other absolute paths only where they start", () => {
  const clone = "/srv/work/target";
  assert.equal(
    redactPaths(
      `fatal: '${clone}.git' does not appear to be a git repository; see ${clone}/.git/packed-refs`,
      [
        [`${clone}.git`, "<target origin>"],
        [clone, "<target clone>"],
      ],
    ),
    "fatal: '<target origin>' does not appear to be a git repository; see <target clone>/.git/packed-refs",
  );
  assert.equal(
    redactPaths(
      "under /Volumes/Data/x and '/workspaces/p/.git/index' (src/tmp/cache.txt, web/home/index.html, https://example.invalid/a, <label>/index)",
      [],
    ),
    "under <local> and '<local>' (src/tmp/cache.txt, web/home/index.html, https://example.invalid/a, <label>/index)",
  );
  assert.equal(
    redactPaths(
      `file://${clone}/private.txt; error:${clone}/private.txt; file:///tmp/elsewhere; error:/tmp/elsewhere; https://example.invalid/tmp/public`,
      [[clone, "<target clone>"]],
    ),
    "file://<local>; error:<local>; file://<local>; error:<local>; https://example.invalid/tmp/public",
  );
});

for (const ignored of [false, true])
  test(`target close tolerates ${ignored ? "ignored" : "non-ignored"} Finder metadata and preserves other material`, () =>
    withFixture((f) => {
      // Override any host-wide ignore rule so both Git-visible and ignored
      // metadata are exercised on every host.
      write(
        f.clone,
        ".gitignore",
        `${ignored ? ".DS_Store" : "!.DS_Store"}\n/unreadable-cache/\n`,
      );
      write(f.clone, "tracked/.DS_Store", "tracked metadata\n");
      git(f.clone, "add", ".gitignore");
      git(f.clone, "add", "-f", "tracked/.DS_Store");
      git(
        f.clone,
        "-c",
        "maintenance.auto=false",
        "commit",
        "-qm",
        "test: declare metadata policy",
      );
      git(f.clone, "push", "-q", "origin", "main");
      f.mapClone();
      f.start();
      git(f.target, "merge", "-q", "main");
      closeOrder(f);
      git(f.orderRoot, "add", "-A");
      git(
        f.orderRoot,
        "-c",
        "maintenance.auto=false",
        "commit",
        "-qm",
        "test: close target order",
      );
      git(f.main, "merge", "-q", "--no-ff", "-m", "Merge records", "wo-999");
      git(f.main, "push", "-q", "origin", "main");
      const metadata = [
        ".DS_Store",
        "assets with spaces/nested/.DS_Store",
        ".claude/.DS_Store",
      ];
      for (const root of [f.target, f.clone])
        for (const file of metadata) write(root, file, "Finder metadata\n");
      const refuse = (pattern) => {
        const result = f.close("--publish");
        assert.notEqual(result.status, 0);
        assert.match(result.stderr, pattern);
        assert.ok(existsSync(f.target));
        assert.ok(existsSync(f.orderRoot));
        checkTargetHarness(f.target, { runtimeRoot: f.main });
      };
      write(f.target, "tracked/.DS_Store", "uncommitted tracked change\n");
      refuse(/not clean/u);
      write(f.target, "tracked/.DS_Store", "tracked metadata\n");
      const link = join(f.target, ".DS_Store");
      rmSync(link);
      symlinkSync("source.txt", link);
      refuse(/non-regular Finder metadata/u);
      assert.equal(
        readFileSync(join(f.target, "source.txt"), "utf8"),
        "declared base\n",
      );
      rmSync(link);
      write(f.target, ".DS_Store/keep.txt", "directory is not metadata\n");
      refuse(/non-regular Finder metadata/u);
      assert.equal(
        readFileSync(join(link, "keep.txt"), "utf8"),
        "directory is not metadata\n",
      );
      rmSync(link, { recursive: true });
      mkdirSync(link);
      refuse(/non-regular Finder metadata/u);
      rmSync(link, { recursive: true });
      write(f.target, ".DS_Store", "Finder metadata\n");
      for (const kind of ["symlink", "directory"]) {
        const cloneMetadata = join(f.clone, ".DS_Store");
        rmSync(cloneMetadata, { force: true });
        if (kind === "symlink") symlinkSync("source.txt", cloneMetadata);
        else mkdirSync(cloneMetadata);
        const before = git(f.clone, "rev-parse", "HEAD");
        refuse(/non-regular Finder metadata/u);
        assert.equal(git(f.clone, "rev-parse", "HEAD"), before);
        rmSync(cloneMetadata, { recursive: true });
      }
      // Prior publishing attempts may already have cleared disposable metadata
      // from the clone before the target's protected-material refusal.
      for (const root of [f.target, f.clone])
        for (const file of metadata) write(root, file, "Finder metadata\n");
      assert.match(f.ok(f.close("--dry-run")), /would-remove/u);
      for (const root of [f.target, f.clone])
        for (const file of metadata)
          assert.equal(
            readFileSync(join(root, file), "utf8"),
            "Finder metadata\n",
          );
      assert.match(f.ok(f.close("--publish")), /no-release/u);
      assert.equal(existsSync(f.target), false);
      assert.equal(existsSync(f.orderRoot), false);
      assert.equal(
        readFileSync(join(f.clone, "tracked/.DS_Store"), "utf8"),
        "tracked metadata\n",
      );
      assert.doesNotMatch(
        readFileSync(join(f.clone, ".git/info/exclude"), "utf8"),
        /# target-worker/u,
      );
    }));

const mergedCloseFixture = (f) => {
  closeOrder(f);
  git(f.orderRoot, "add", "-A");
  git(
    f.orderRoot,
    "-c",
    "maintenance.auto=false",
    "commit",
    "-qm",
    "test: close target order",
  );
  git(f.main, "merge", "-q", "--no-ff", "-m", "Merge records", "wo-999");
  git(f.main, "push", "-q", "origin", "main");
};

const cloneRefMap = (f) =>
  Object.fromEntries(
    git(f.clone, "for-each-ref", "--format=%(refname) %(objectname)")
      .split("\n")
      .map((line) => line.split(" ")),
  );
// A close refusal ends with the exact command to rerun; apart from that
// command it names no absolute path of any fixture repository.
const assertCloseRefusal = (f, refused, mode, pattern) => {
  assert.notEqual(refused.status, 0);
  assert.match(refused.stderr, pattern);
  const rerun = releaseCloseCommand(f.main, "WO-999", mode);
  assert.ok(refused.stderr.includes(rerun), refused.stderr);
  assert.ok(
    !refused.stderr.replace(rerun, "").includes(f.base),
    refused.stderr,
  );
};
// Both close modes refuse with the pattern and leave both worktrees, the
// bundle and the clone's refs.
const refuseCloseBoth = (f, pattern, refs) => {
  for (const mode of ["--dry-run", "--publish"]) {
    assertCloseRefusal(f, f.close(mode), mode, pattern);
    assert.ok(existsSync(f.target));
    assert.ok(existsSync(f.orderRoot));
    checkTargetHarness(f.target, { runtimeRoot: f.main });
    assert.deepEqual(cloneRefMap(f), refs);
  }
};

test("target close judges large NUL-framed base path lists before deleting declared output", () =>
  withFixture(
    (f) => {
      publicationSetup(f);
      f.config.classes.fixture.disposable = ["node_modules"];
      write(f.main, "dotln.config.json", JSON.stringify(f.config));
      git(f.main, "add", "-A");
      git(
        f.main,
        "-c",
        "maintenance.auto=false",
        "commit",
        "-qm",
        "test: declare output cleanup",
      );
      git(f.main, "push", "-q", "origin", "main");
      f.mapClone();
      f.start();
      mergedCloseFixture(f);
      const before = cloneRefMap(f);
      const directory = `large-cache/${"é".repeat(70)}/line\nbreak`;
      const files = Array.from(
        { length: 8192 },
        (_, index) => `${directory}/widget-${index}.js`,
      );
      for (const file of files) write(f.clone, file, "output\n");
      assert.ok(Buffer.byteLength(`${files.join("\0")}\0`) > 1024 * 1024);
      // The whole tree must be judged before its policy is applied. Large
      // undeclared output gets the ordinary remedy, never a buffer failure.
      refuseCloseBoth(
        f,
        /undeclared ignored material; source retained: large-cache\/[\s\S]*and \d+ more\. Declare it disposable/u,
        before,
      );
      assert.equal(
        readFileSync(join(f.clone, files.at(-1)), "utf8"),
        "output\n",
      );
      renameSync(join(f.clone, "large-cache"), join(f.clone, "node_modules"));
      // A nonignored file is still foreign beside a large declared tree.
      write(f.clone, "operator-note.txt", "retain\n");
      refuseCloseBoth(f, /not clean \(operator-note\.txt\)/u, before);
      assert.ok(existsSync(join(f.clone, "node_modules")));
      rmSync(join(f.clone, "operator-note.txt"));
      const dry = f.ok(f.close("--dry-run"));
      assert.match(
        dry,
        /disposable output would be deleted: base node_modules \(8192\)/u,
      );
      assert.ok(existsSync(join(f.clone, "node_modules")));
      assert.ok(existsSync(f.target));
      assert.deepEqual(cloneRefMap(f), before);
      const published = f.ok(f.close("--publish"));
      assert.match(
        published,
        /disposable output deleted: base node_modules \(8192\)/u,
      );
      assert.equal(existsSync(join(f.clone, "node_modules")), false);
      assert.equal(existsSync(f.target), false);
      const receipt = JSON.parse(
        readFileSync(
          docPath(
            f.main,
            "control",
            "local/retained/WO-999/release-close.json",
          ),
          "utf8",
        ),
      );
      assert.deepEqual(receipt.targetCleanup.disposable.base, [
        { path: "node_modules", files: 8192 },
      ]);
    },
    { baseIgnore: "node_modules/\nlarge-cache/\n" },
  ));

test("target close isolates fetched ignore rules, retains unreadable output and tolerates unavailable gate advisories", () =>
  withFixture(
    (f) => {
      publicationSetup(f);
      f.config.classes.fixture.disposable = [
        "node_modules",
        "ambient",
        "template",
      ];
      write(f.main, "dotln.config.json", JSON.stringify(f.config));
      git(f.main, "add", "-A");
      git(
        f.main,
        "-c",
        "maintenance.auto=false",
        "commit",
        "-qm",
        "test: declare cleanup roots",
      );
      git(f.main, "push", "-q", "origin", "main");
      f.mapClone();
      f.start();
      mergedCloseFixture(f);
      const before = cloneRefMap(f);
      const close = (mode, env = {}) =>
        f.call(f.main, f.main, "release", ["close", "WO-999", mode], env);
      const globalConfig = join(f.base, "global.gitconfig");
      const excludes = join(f.base, "global.excludes");
      const template = join(f.base, "git-template");
      writeFileSync(excludes, "ambient/\n");
      writeFileSync(
        globalConfig,
        // Preserve the fixture's local forge transport while adding policy.
        `${readFileSync(f.env.GIT_CONFIG_GLOBAL, "utf8")}\n[core]\n\texcludesFile = ${JSON.stringify(excludes)}\n`,
      );
      write(template, "info/exclude", "template/\n");
      for (const [directory, env] of [
        ["ambient", { GIT_CONFIG_GLOBAL: globalConfig }],
        ["template", { GIT_TEMPLATE_DIR: template }],
      ]) {
        write(f.clone, `${directory}/keep.txt`, "operator material\n");
        for (const mode of ["--dry-run", "--publish"]) {
          assertCloseRefusal(
            f,
            close(mode, env),
            mode,
            new RegExp(`not clean \\(${directory}/keep\\.txt\\)`, "u"),
          );
          assert.equal(
            readFileSync(join(f.clone, directory, "keep.txt"), "utf8"),
            "operator material\n",
          );
          assert.deepEqual(cloneRefMap(f), before);
          assert.ok(existsSync(f.target));
        }
        rmSync(join(f.clone, directory), { recursive: true });
      }
      for (const root of [f.clone, f.target])
        write(root, "node_modules/readable.txt", "output\n");
      // Root can bypass chmod; the other policy and advisory cases still run.
      if (process.getuid?.() !== 0) {
        for (const [root, label] of [
          [f.clone, "ignored"],
          [f.target, "declared disposable"],
        ]) {
          const unreadable = join(root, "node_modules/private");
          write(root, "node_modules/private/keep.txt", "unreadable output\n");
          chmodSync(unreadable, 0);
          try {
            refuseCloseBoth(
              f,
              new RegExp(
                `cannot inspect ${label} directories: node_modules/private; restore directory read and search access; source retained`,
                "u",
              ),
              before,
            );
            for (const checkout of [f.clone, f.target])
              assert.equal(
                readFileSync(
                  join(checkout, "node_modules/readable.txt"),
                  "utf8",
                ),
                "output\n",
              );
          } finally {
            chmodSync(unreadable, 0o755);
          }
          assert.equal(
            readFileSync(join(unreadable, "keep.txt"), "utf8"),
            "unreadable output\n",
          );
          rmSync(unreadable, { recursive: true });
        }
      }
      const index = checksPath(f.orderRoot);
      const originalIndex = readFileSync(index);
      for (const source of ["{malformed\n", "[null]\n"]) {
        writeFileSync(index, source);
        const dry = f.ok(close("--dry-run"));
        assert.match(dry, /advisory: gate base-checkout writes unavailable/u);
        assert.equal(readFileSync(index, "utf8"), source);
        assert.deepEqual(cloneRefMap(f), before);
        for (const root of [f.clone, f.target])
          assert.ok(existsSync(join(root, "node_modules/readable.txt")));
      }
      const published = f.ok(close("--publish"));
      assert.match(
        published,
        /advisory: gate base-checkout writes unavailable/u,
      );
      assert.equal(existsSync(f.target), false);
      assert.equal(existsSync(join(f.clone, "node_modules")), false);
      const receipt = JSON.parse(
        readFileSync(
          docPath(
            f.main,
            "control",
            "local/retained/WO-999/release-close.json",
          ),
          "utf8",
        ),
      );
      assert.equal(receipt.targetCleanup.baseCheckoutWrites, null);
      assert.equal(receipt.targetCleanup.outcome, "removed");
      // The advisory cannot block target cleanup. The separate evidence-copy
      // safeguard still retains a launchpad whose gate index cannot be read.
      assert.equal(receipt.cleanup.outcome, "blocked");
      assert.ok(existsSync(f.orderRoot));
      assert.equal(readFileSync(index, "utf8"), "[null]\n");
      writeFileSync(index, originalIndex);
      f.ok(close("--publish"));
      assert.equal(existsSync(f.orderRoot), false);
      const retried = JSON.parse(
        readFileSync(
          docPath(
            f.main,
            "control",
            "local/retained/WO-999/release-close.json",
          ),
          "utf8",
        ),
      );
      assert.equal(retried.cleanup.outcome, "clean");
    },
    { baseIgnore: "node_modules/\n" },
  ));

test("target close preserves unavailable gate-write observations in mixed valid rows", () =>
  withFixture((f) => {
    f.mapClone();
    f.start();
    mergedCloseFixture(f);
    const index = checksPath(f.orderRoot);
    const original = readFileSync(index);
    const row = (name, writes, repositoryId = "target") => ({
      checkId: `target:${repositoryId}:${name}`,
      repositoryId,
      baseCheckoutWrites: writes,
      recordedAt: "2026-10-20T00:00:00.000Z",
      treeHash: "a".repeat(64),
      exitCode: 0,
    });
    try {
      for (const [rows, expected] of [
        [[row("known", ["dist/b", "dist/a", "dist/a"])], ["dist/a", "dist/b"]],
        [[row("empty", []), row("foreign", null, "other")], []],
        [[row("unavailable", null)], null],
        [[row("known", ["dist/a"]), row("unavailable", null)], null],
        [[row("unavailable", null), row("known", ["dist/a"])], null],
      ]) {
        writeFileSync(index, JSON.stringify(rows));
        const output = f.ok(f.close("--dry-run"));
        const receipt = JSON.parse(
          readFileSync(
            docPath(
              f.main,
              "control",
              "local/retained/WO-999/release-close.json",
            ),
            "utf8",
          ),
        );
        assert.deepEqual(receipt.targetCleanup.baseCheckoutWrites, expected);
        assert.equal(
          output.includes("advisory: gate base-checkout writes unavailable"),
          expected === null,
        );
        assert.ok(existsSync(f.target));
      }
    } finally {
      writeFileSync(index, original);
    }
  }));

// Every file under a tree by path with its bytes' digest, and links by target.
const treeDigest = (root, { skipGit = false } = {}) => {
  const digest = {};
  const walk = (directory) => {
    for (const item of readdirSync(join(root, directory), {
      withFileTypes: true,
    })) {
      const path = join(directory, item.name);
      if (skipGit && item.name === ".git") continue;
      if (item.isSymbolicLink())
        digest[path] = `link ${readlinkSync(join(root, path))}`;
      else if (item.isDirectory()) walk(path);
      else
        digest[path] = createHash("sha256")
          .update(readFileSync(join(root, path)))
          .digest("hex");
    }
  };
  walk("");
  return digest;
};

for (const [stale, locked, remains, flavors] of [
  ["deleted", false, null, [false, true]],
  ["locked and deleted", true, null, [false, true]],
  ["emptied", false, "directory", [false, true]],
  ["locked and emptied", true, "directory", [false, true]],
  ["replaced by a file", false, "file", [false, true]],
  ["reused by another clone", false, "clone", [false, true]],
  ["reused by another repository's worktree", false, "worktree", [false, true]],
  ["reused by a link to the clone", false, "link", [false, true]],
])
  for (const behind of flavors)
    test(`target close with a base branch whose worktree is ${stale} and a ${behind ? "behind" : "synced"} local base ${behind ? "refuses to move it" : "closes"} in both modes`, () =>
      withFixture((f) => {
        f.mapClone();
        f.start();
        write(f.target, "change.txt", "changed\n");
        git(f.target, "add", "-A");
        git(
          f.target,
          "-c",
          "maintenance.auto=false",
          "commit",
          "-qm",
          "test: target change",
        );
        mergedCloseFixture(f);
        // The forge merges the target change; the clone has not fetched it.
        const upstream = join(f.base, "upstream");
        git(
          f.base,
          "-c",
          "maintenance.auto=false",
          "clone",
          "-q",
          join(f.base, "target.git"),
          upstream,
        );
        git(upstream, "config", "user.email", "fixture@example.invalid");
        git(upstream, "config", "user.name", "Fixture");
        git(upstream, "fetch", "-q", f.clone, "wo-999");
        git(upstream, "merge", "-q", "--no-ff", "-m", "Merge", "FETCH_HEAD");
        git(upstream, "push", "-q", "origin", "main");
        const merged = git(upstream, "rev-parse", "HEAD");
        // The clone works on another branch while the base branch stays held by
        // a linked worktree whose checkout is gone. A locked entry survives
        // `git worktree prune`, so Git never reports it as prunable; an empty
        // directory stands for an unmounted volume. A synced base took the
        // merge in that worktree before it went.
        const held = join(f.base, "held-main");
        git(f.clone, "switch", "-qc", "work");
        git(f.clone, "worktree", "add", "-q", held, "main");
        if (!behind) {
          git(f.clone, "fetch", "-q", "origin");
          git(held, "merge", "-q", "--ff-only", "origin/main");
        }
        if (locked)
          git(
            f.clone,
            "worktree",
            "lock",
            "--reason",
            "removable volume",
            held,
          );
        rmSync(held, { recursive: true });
        if (remains === "directory") mkdirSync(held);
        if (remains === "file") writeFileSync(held, "not a checkout\n");
        if (locked) git(f.clone, "worktree", "prune");
        // A reused path holds a `.git` that is not this clone's checkout of
        // the base; the close must not run Git or delete files there.
        const other = join(f.base, "other-repository");
        if (remains === "clone" || remains === "worktree") {
          const repository = remains === "clone" ? held : other;
          git(
            f.base,
            "-c",
            "maintenance.auto=false",
            "clone",
            "-q",
            join(f.base, "target.git"),
            repository,
          );
          git(repository, "reset", "-q", "--hard", "HEAD~1");
          if (remains === "worktree") {
            git(other, "branch", "side");
            git(other, "worktree", "add", "-q", held, "side");
          }
          writeFileSync(join(held, ".DS_Store"), "Finder metadata\n");
        }
        if (remains === "link") symlinkSync(f.clone, held);
        const reused = () =>
          remains === "clone"
            ? treeDigest(held)
            : remains === "worktree"
              ? { held: treeDigest(held), other: treeDigest(other) }
              : remains === "link"
                ? treeDigest(f.clone, { skipGit: true })
                : null;
        const reusedBefore = reused();
        const heldEntry = () =>
          git(f.clone, "worktree", "list", "--porcelain")
            .split("\n\n")
            .find((entry) => entry.startsWith(`worktree ${held}\n`)) ?? "";
        assert.match(heldEntry(), /^branch refs\/heads\/main$/mu);
        if (reusedBefore)
          assert.doesNotMatch(heldEntry(), /^(?:prunable|locked)\b/mu);
        else
          assert.match(heldEntry(), locked ? /^locked\b/mu : /^prunable\b/mu);
        if (locked) assert.doesNotMatch(heldEntry(), /^prunable/mu);
        const localBase = git(f.clone, "rev-parse", "refs/heads/main");
        assert.equal(localBase === merged, !behind);
        const before = cloneRefMap(f);
        if (behind) {
          // Git still treats the branch as checked out there, so the close
          // moves no ref until the entry is restored or cleared.
          const [state, clear] = locked
            ? [
                "locked: removable volume",
                "clear the entry with git worktree unlock, then git worktree prune",
              ]
            : reusedBefore
              ? [
                  "its path holds another checkout",
                  "move what sits at its path elsewhere, then clear the entry with git worktree prune",
                ]
              : ["prunable", "clear the entry with git worktree prune"];
          refuseCloseBoth(
            f,
            new RegExp(
              `target clone base main is held by a worktree entry whose checkout is gone \\(${state}\\), so the close cannot move it to the fetched base; source retained\\. Restore or remount that worktree and fast-forward it, or ${clear} \\(git worktree list names it\\), then rerun `,
              "u",
            ),
            before,
          );
          if (reusedBefore) {
            assert.deepEqual(reused(), reusedBefore);
            return;
          }
          // Once the entry is cleared, nothing holds the base and the close
          // moves it by its ref.
          if (locked) git(f.clone, "worktree", "unlock", held);
          git(f.clone, "worktree", "prune");
          assert.equal(heldEntry(), "");
        }
        assert.match(f.ok(f.close("--dry-run")), /would-remove/u);
        assert.ok(existsSync(f.target));
        assert.ok(existsSync(f.orderRoot));
        assert.equal(git(f.clone, "rev-parse", "refs/heads/main"), localBase);
        const result = f.ok(f.close("--publish"));
        assert.match(result, /no-release/u);
        assert.equal(existsSync(f.target), false);
        assert.equal(existsSync(f.orderRoot), false, result);
        for (const repo of [f.main, f.clone])
          assert.equal(git(repo, "branch", "--list", "wo-999"), "");
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
        assert.equal(record.publication.outcome, "no-release");
        assert.equal(record.targetCleanup.outcome, "removed");
        // Only the two base refs move and the closed branch goes; the close
        // leaves the stale entry, and anything at its path, to its owner.
        const after = cloneRefMap(f);
        assert.equal(after["refs/heads/main"], merged);
        assert.equal(after["refs/remotes/origin/main"], merged);
        const others = (refs) =>
          Object.entries(refs).filter(
            ([name]) =>
              ![
                "refs/heads/main",
                "refs/remotes/origin/main",
                "refs/heads/wo-999",
              ].includes(name),
          );
        assert.ok(others(before).some(([name]) => name === "refs/heads/work"));
        assert.deepEqual(others(after), others(before));
        if (!behind) assert.match(heldEntry(), /^branch refs\/heads\/main$/mu);
        if (remains === "directory") assert.ok(statSync(held).isDirectory());
        if (remains === "file")
          assert.equal(readFileSync(held, "utf8"), "not a checkout\n");
        if (reusedBefore) assert.deepEqual(reused(), reusedBefore);
      }));

test("target close refuses an unreadable, dirty or broken base and a dirty or broken target by role and relative path in both modes", (t) => {
  if (process.getuid?.() === 0)
    return t.skip("root bypasses directory read permissions");
  return withFixture((f) => {
    // Tracked content keeps the base checkout clean once read access returns.
    write(f.clone, "assets/private/keep.txt", "tracked base material\n");
    git(f.clone, "add", "-A");
    git(
      f.clone,
      "-c",
      "maintenance.auto=false",
      "commit",
      "-qm",
      "test: track nested base material",
    );
    git(f.clone, "push", "-q", "origin", "main");
    f.mapClone();
    f.start();
    git(f.target, "merge", "-q", "main");
    mergedCloseFixture(f);
    const before = cloneRefMap(f);
    const unreadable = join(f.clone, "assets/private");
    chmodSync(unreadable, 0);
    try {
      refuseCloseBoth(
        f,
        /target clone base main cannot close: cannot inspect Finder metadata in assets\/private \((EACCES|EPERM)\); restore directory read and search access and retry; source retained/u,
        before,
      );
    } finally {
      chmodSync(unreadable, 0o755);
    }
    write(f.clone, "assets/private/keep.txt", "uncommitted base edit\n");
    refuseCloseBoth(
      f,
      /target clone base main is not clean \(M assets\/private\/keep\.txt\); source retained\. Clean it, then rerun /u,
      before,
    );
    write(f.clone, "assets/private/keep.txt", "tracked base material\n");
    // A Git failure inside the base's cleanliness check still names the base.
    const index = join(f.clone, ".git/index");
    const indexBytes = readFileSync(index);
    writeFileSync(index, "DIRC");
    refuseCloseBoth(f, /target clone base main cannot close: .*index/u, before);
    writeFileSync(index, indexBytes);
    // A failed fetch from a local-path origin masks that path.
    const origin = join(f.base, "target.git");
    renameSync(origin, `${origin}.away`);
    refuseCloseBoth(
      f,
      /target clone base main cannot close: fetch failed: remote read refused: git fetch failed in the host read lane: fatal: '<target origin>' does not appear to be a git repository.*; source retained\. Fix the fetch, then rerun /su,
      before,
    );
    renameSync(`${origin}.away`, origin);
    // A stale ref lock makes the ref move fail; Git's text names the clone's
    // Git directory, which the refusal quotes by role.
    const refLock = join(f.clone, ".git/refs/remotes/origin/main.lock");
    writeFileSync(refLock, "");
    refuseCloseBoth(
      f,
      /target clone base main cannot close: .*'<target clone Git directory>\/refs\/remotes\/origin\/main\.lock'.*; source retained\. Fix what Git reports, then rerun /su,
      before,
    );
    rmSync(refLock);
    // One inside the target names its Git directory, kept in the clone, by role.
    const targetIndex = join(
      git(f.target, "rev-parse", "--absolute-git-dir"),
      "index",
    );
    const targetIndexBytes = readFileSync(targetIndex);
    writeFileSync(targetIndex, "DIRC");
    for (const mode of ["--dry-run", "--publish"]) {
      assertCloseRefusal(
        f,
        f.close(mode),
        mode,
        /target worktree cannot close: fatal: <target worktree Git directory>\/index: index file smaller than expected; source retained\. Fix what Git reports, then rerun /u,
      );
      assert.ok(existsSync(f.target));
      assert.ok(existsSync(f.orderRoot));
      assert.deepEqual(cloneRefMap(f), before);
    }
    writeFileSync(targetIndex, targetIndexBytes);
    // The bundle check reads the target's index, so it runs once that is back.
    checkTargetHarness(f.target, { runtimeRoot: f.main });
    write(f.target, "notes.txt", "untracked target note\n");
    refuseCloseBoth(
      f,
      /target worktree is not clean \(notes\.txt\); source retained\. Clean it, then rerun /u,
      before,
    );
    rmSync(join(f.target, "notes.txt"));
    assert.match(f.ok(f.close("--publish")), /no-release/u);
    assert.equal(existsSync(f.target), false);
    assert.equal(existsSync(f.orderRoot), false);
    assert.equal(
      readFileSync(join(unreadable, "keep.txt"), "utf8"),
      "tracked base material\n",
    );
  });
});

for (const side of ["base", "target"])
  test(`target close refuses a listable but unsearchable ${side} directory before any removal in both modes`, (t) => {
    if (process.getuid?.() === 0)
      return t.skip("root bypasses directory search permissions");
    return withFixture((f) => {
      write(f.clone, "assets/private/keep.txt", "tracked material\n");
      git(f.clone, "add", "-A");
      git(
        f.clone,
        "-c",
        "maintenance.auto=false",
        "commit",
        "-qm",
        "test: track nested material",
      );
      git(f.clone, "push", "-q", "origin", "main");
      f.mapClone();
      f.start();
      git(f.target, "merge", "-q", "main");
      mergedCloseFixture(f);
      // Mode 0644 lets a directory be listed but not searched, so Git's status
      // cannot see the tracked edit inside it.
      const root = side === "base" ? f.clone : f.target;
      write(root, "assets/private/keep.txt", "uncommitted edit\n");
      const before = cloneRefMap(f);
      const hidden = join(root, "assets/private");
      chmodSync(hidden, 0o644);
      try {
        refuseCloseBoth(
          f,
          new RegExp(
            `^error: target ${side === "base" ? "clone base main" : "worktree"} cannot close: cannot inspect Finder metadata in assets/private \\((EACCES|EPERM)\\); restore directory read and search access and retry; source retained\\. Then rerun `,
            "mu",
          ),
          before,
        );
      } finally {
        chmodSync(hidden, 0o755);
      }
      // Once searchable again, the same edit refuses as a dirty tree.
      const dirty = f.close("--dry-run");
      assert.notEqual(dirty.status, 0);
      assert.match(
        dirty.stderr,
        side === "base"
          ? /target clone base main is not clean \(M assets\/private\/keep\.txt\)/u
          : /target worktree is not clean \(M assets\/private\/keep\.txt\)/u,
      );
      assert.equal(
        readFileSync(join(hidden, "keep.txt"), "utf8"),
        "uncommitted edit\n",
      );
    });
  });

test("target close refuses a linked base checkout it cannot reach without naming its path, then closes it", (t) => {
  if (process.getuid?.() === 0)
    return t.skip("root bypasses directory read permissions");
  return withFixture((f) => {
    f.mapClone();
    f.start();
    git(f.target, "merge", "-q", "main");
    mergedCloseFixture(f);
    const box = join(f.base, "box");
    const held = join(box, "held-main");
    git(f.clone, "switch", "-qc", "work");
    git(f.clone, "worktree", "add", "-q", held, "main");
    const before = cloneRefMap(f);
    chmodSync(box, 0);
    try {
      refuseCloseBoth(
        f,
        /target clone base main checkout cannot be inspected \((EACCES|EPERM)\); source retained\. Restore access to the worktree that holds main, which git worktree list names, then rerun /u,
        before,
      );
    } finally {
      chmodSync(box, 0o755);
    }
    // A reachable linked base checkout still closes through its own checkout.
    assert.match(f.ok(f.close("--publish")), /no-release/u);
    assert.equal(existsSync(f.target), false);
    assert.equal(
      git(held, "rev-parse", "HEAD"),
      git(f.clone, "rev-parse", "refs/remotes/origin/main"),
    );
    assert.equal(git(held, "status", "--porcelain"), "");
  });
});

test("target close names a stale writer transition by role and gives its recovery", () =>
  withFixture((f) => {
    f.mapClone();
    f.start();
    mergedCloseFixture(f);
    for (const [directory, role] of [
      [f.clone, "target clone base main"],
      [f.target, "target worktree"],
    ]) {
      withWriterReservationLock(directory, () => {
        refuseCloseBoth(
          f,
          new RegExp(
            `${role}: writer transition lock requires inspection; source retained\\. Confirm no registration or teardown is running.*then rerun`,
            "u",
          ),
          cloneRefMap(f),
        );
      });
    }
  }));

test("target close keeps Git's guard for an unchecked-out base being rebased", () =>
  withFixture((f) => {
    f.mapClone();
    f.start();
    write(f.target, "new-target.txt", "merged target change\n");
    git(f.target, "add", "new-target.txt");
    git(
      f.target,
      "-c",
      "maintenance.auto=false",
      "commit",
      "-qm",
      "test: target change",
    );
    git(
      f.target,
      "merge",
      "-q",
      "-m",
      "test: incorporate fixture base",
      "main",
    );
    git(f.target, "push", "-q", "origin", "HEAD:main");
    mergedCloseFixture(f);
    const before = git(f.clone, "rev-parse", "main");
    const editor = join(f.base, "edit-rebase.cjs");
    writeFileSync(
      editor,
      "const fs = require('node:fs'); const file = process.argv[2]; fs.writeFileSync(file, fs.readFileSync(file, 'utf8').replace(/^pick /m, 'edit '));\n",
    );
    const started = spawnGit(["-C", f.clone, "rebase", "-i", "--root"], {
      env: {
        ...f.env,
        GIT_SEQUENCE_EDITOR: `${shellQuote(process.execPath)} ${shellQuote(editor)}`,
      },
      encoding: "utf8",
    });
    assert.equal(started.status, 0, started.stderr);
    assert.match(started.stdout + started.stderr, /Stopped at/);
    try {
      assert.match(f.ok(f.close("--dry-run")), /would-remove/);
      const refused = f.close("--publish");
      assert.notEqual(refused.status, 0);
      assert.match(refused.stderr, /refusing to fetch into branch.*main/);
      assert.equal(git(f.clone, "rev-parse", "main"), before);
    } finally {
      git(f.clone, "rebase", "--abort");
    }
  }));

for (const kind of [
  "absent-target",
  "clone-hook",
  "clone-urlrewrite",
  "clone-writer",
  "missing-base",
])
  test(`target close protects ownership and disables hooks: ${kind}`, () =>
    withFixture((f) => {
      write(f.clone, ".gitignore", ".DS_Store\n/docs/control/local/\n");
      git(f.clone, "add", ".gitignore");
      git(
        f.clone,
        "-c",
        "maintenance.auto=false",
        "commit",
        "-qm",
        "test: ignore metadata and writer state",
      );
      git(f.clone, "push", "-q", "origin", "main");
      f.mapClone();
      f.start();
      git(f.target, "merge", "-q", "main");
      write(f.target, "change.txt", "target change\n");
      git(f.target, "add", "change.txt");
      git(
        f.target,
        "-c",
        "maintenance.auto=false",
        "commit",
        "-qm",
        "test: target change",
      );
      closeOrder(f);
      git(f.orderRoot, "add", "-A");
      git(
        f.orderRoot,
        "-c",
        "maintenance.auto=false",
        "commit",
        "-qm",
        "test: close records",
      );
      git(f.main, "merge", "-q", "--no-ff", "-m", "Merge records", "wo-999");
      git(f.main, "push", "-q", "origin", "main");
      git(f.target, "push", "-q", "origin", "HEAD:refs/heads/main");
      const before = git(f.clone, "rev-parse", "HEAD");
      const mergedTarget = git(f.target, "rev-parse", "HEAD");
      if (kind === "missing-base") {
        git(f.clone, "switch", "--detach", "-q");
        git(f.clone, "branch", "-D", "main");
        assert.match(f.ok(f.close("--dry-run")), /would-remove/u);
        assert.equal(git(f.clone, "branch", "--list", "main"), "");
      }
      if (kind === "clone-writer")
        write(f.clone, "docs/control/local/harness/writer.json", "{}\n");
      if (kind === "absent-target")
        git(f.clone, "worktree", "remove", "--force", f.target);
      const sentinel = join(f.base, "hook-fired");
      if (kind === "clone-hook") {
        const hook = join(f.clone, ".git/hooks/post-merge");
        writeFileSync(hook, `#!/bin/sh\n: > '${sentinel}'\n`);
        chmodSync(hook, 0o755);
      }
      if (kind === "clone-urlrewrite") {
        const origin = git(f.clone, "config", "--get", "remote.origin.url");
        git(
          f.clone,
          "config",
          `url.${join(f.base, "missing-remote")}.insteadOf`,
          origin,
        );
      }
      const result = f.close("--publish");

      if (["clone-hook", "clone-urlrewrite", "missing-base"].includes(kind)) {
        assert.equal(result.status, 0, result.stderr);
        assert.equal(git(f.clone, "rev-parse", "main"), mergedTarget);
        assert.equal(
          existsSync(sentinel),
          false,
          "close must not execute a target hook",
        );
      } else {
        assert.notEqual(
          result.status,
          0,
          `${kind} should retain ownership residue`,
        );
        if (kind === "clone-writer")
          assert.match(
            result.stderr,
            /target clone base main: writer reservation \(not proven released\); source retained\. Release that writer, then rerun /u,
          );
        assert.equal(git(f.clone, "rev-parse", "HEAD"), before);
        assert.ok(existsSync(f.orderRoot));
        assert.ok(
          JSON.parse(readFileSync(targetRegistryPath(f.main), "utf8"))[
            f.target
          ],
        );
      }
    }));

for (const policy of ["delete", "judge-only"])
  test(`target close keeps the base judgment and applies ${policy} only to base output`, () =>
    withFixture(
      (f) => {
        f.config.repositories.target.disposable = ["node_modules", "dist"];
        f.config.repositories.target.baseDisposablePolicy = policy;
        write(f.main, "dotln.config.json", JSON.stringify(f.config));
        git(f.main, "add", "-A");
        git(
          f.main,
          "-c",
          "maintenance.auto=false",
          "commit",
          "-qm",
          "test: declare cleanup policy",
        );
        git(f.main, "push", "-q", "origin", "main");
        f.mapClone();
        f.start();
        mergedCloseFixture(f);
        write(f.clone, "node_modules/base.txt", "base output\n");
        write(f.target, "dist/target.txt", "target output\n");
        write(f.clone, "nested/.env", "operator material\n");
        const refused = f.close("--publish");
        assert.notEqual(refused.status, 0);
        assert.match(refused.stderr, /nested\/\.env/u);
        assert.ok(existsSync(join(f.target, "dist/target.txt")));
        rmSync(join(f.clone, "nested"), { recursive: true });
        const preview = f.ok(f.close("--dry-run"));
        assert.ok(preview.includes(`base disposable policy ${policy}`));
        assert.ok(existsSync(join(f.clone, "node_modules/base.txt")));
        const closed = f.ok(f.close("--publish"));
        assert.ok(closed.includes(`base disposable policy ${policy}`));
        assert.equal(existsSync(f.target), false);
        assert.equal(
          existsSync(join(f.clone, "node_modules/base.txt")),
          policy === "judge-only",
        );
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
        assert.equal(record.targetCleanup.baseDisposablePolicy, policy);
      },
      { baseIgnore: "node_modules/\ndist/\n.env\n" },
    ));

for (const side of ["base", "target"])
  test(`target close judges ${side} disposable directory write access before deleting either checkout`, () =>
    withFixture(
      (f) => {
        f.config.repositories.target.disposable = ["node_modules"];
        write(f.main, "dotln.config.json", JSON.stringify(f.config));
        git(f.main, "add", "-A");
        git(
          f.main,
          "-c",
          "maintenance.auto=false",
          "commit",
          "-qm",
          "test: declare disposable output",
        );
        git(f.main, "push", "-q", "origin", "main");
        f.mapClone();
        f.start();
        mergedCloseFixture(f);
        for (const root of [f.clone, f.target])
          write(root, "node_modules/deep/keep.txt", "output\n");
        const directory = join(
          side === "base" ? f.clone : f.target,
          "node_modules/deep",
        );
        try {
          chmodSync(directory, 0o555);
          const result = f.close("--publish");
          assert.notEqual(result.status, 0);
          assert.match(
            result.stderr,
            /node_modules\/deep needs write, read and search access/u,
          );
          for (const root of [f.clone, f.target])
            assert.ok(existsSync(join(root, "node_modules/deep/keep.txt")));
        } finally {
          chmodSync(directory, 0o755);
        }
        const root = side === "base" ? f.clone : f.target;
        renameSync(join(root, "node_modules"), join(f.base, "outside-output"));
        symlinkSync(join(f.base, "outside-output"), join(root, "node_modules"));
        const linked = f.close("--publish");
        assert.notEqual(linked.status, 0);
        assert.match(linked.stderr, /symlinked component/u);
        assert.ok(existsSync(join(f.base, "outside-output/deep/keep.txt")));
      },
      { baseIgnore: "node_modules\n" },
    ));

test("path-list overflow is bounded while the tree selector streams beyond the same ceiling", async (t) => {
  const root = createFixtureRoot(join(tmpdir(), "dotln-path-list-limit-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const { spawnSync } = await import("node:child_process");
  const fake = join(root, "git");
  writeFileSync(
    fake,
    `#!${process.execPath}\nfor(let i=0;i<19000;i++)process.stdout.write('a'.repeat(1000)+'/'+i+'\\0');process.stdout.write('.gitignore\\0');\n`,
  );
  chmodSync(fake, 0o755);
  const script = `import {runGitPathList,selectGitPaths} from ${JSON.stringify(new URL("./lib/git.mjs", import.meta.url).href)};
    try{runGitPathList(${JSON.stringify(root)},['ls-files','-z']);process.exitCode=1;}catch(error){if(error.message.length>500||!error.message.includes('16 MiB'))throw error;console.log(error.message);}
    const selected=selectGitPaths(${JSON.stringify(root)},['ls-tree','-z'],p=>p==='.gitignore');if(JSON.stringify(selected)!=='[".gitignore"]')throw Error('stream selection differs');`;
  const run = spawnSync(
    process.execPath,
    ["--input-type=module", "-e", script],
    {
      env: { ...process.env, PATH: `${root}:${process.env.PATH}` },
      encoding: "utf8",
    },
  );
  assert.equal(run.status, 0, run.stderr);
  assert.match(run.stdout, /16 MiB/u);
  assert.ok(run.stdout.length < 500);
});

test("judge-only refuses fetched tracked paths that would overwrite retained ignored output", () =>
  withFixture(
    (f) => {
      f.config.repositories.target.disposable = ["dist"];
      f.config.repositories.target.baseDisposablePolicy = "judge-only";
      write(f.main, "dotln.config.json", JSON.stringify(f.config));
      git(f.main, "add", "-A");
      git(
        f.main,
        "-c",
        "maintenance.auto=false",
        "commit",
        "-qm",
        "test: keep base output",
      );
      git(f.main, "push", "-q", "origin", "main");
      f.mapClone();
      f.start();
      git(f.target, "merge", "-q", "main");
      write(f.target, "dist/tracked.txt", "new tracked content\n");
      git(f.target, "add", "-f", "dist/tracked.txt");
      git(
        f.target,
        "-c",
        "maintenance.auto=false",
        "commit",
        "-qm",
        "test: add a tracked output path",
      );
      mergedCloseFixture(f);
      git(f.target, "push", "-q", "origin", "HEAD:refs/heads/main");
      write(f.clone, "dist/tracked.txt", "retained local output\n");
      for (const mode of ["--dry-run", "--publish"]) {
        const result = f.close(mode);
        assert.notEqual(result.status, 0);
        assert.match(
          result.stderr,
          /judge-only output collides.*dist\/tracked.txt/u,
        );
        assert.equal(
          readFileSync(join(f.clone, "dist/tracked.txt"), "utf8"),
          "retained local output\n",
        );
        assert.ok(existsSync(f.target));
      }
    },
    { baseIgnore: "dist/\n" },
  ));

for (const side of ["base", "target"])
  test(`immutable ${side} disposable output stops deletion with the checkout role and retry command`, (t) => {
    if (process.platform !== "darwin") {
      t.skip("the filesystem immutable flag is unavailable on this platform");
      return;
    }
    return withFixture(
      (f) => {
        f.config.repositories.target.disposable = ["node_modules"];
        write(f.main, "dotln.config.json", JSON.stringify(f.config));
        git(f.main, "add", "-A");
        git(
          f.main,
          "-c",
          "maintenance.auto=false",
          "commit",
          "-qm",
          "Declare disposable output",
        );
        git(f.main, "push", "-q", "origin", "main");
        f.mapClone();
        f.start();
        mergedCloseFixture(f);
        const root = side === "base" ? f.clone : f.target;
        for (const name of ["a-first.txt", "b-immutable.txt", "c-after.txt"])
          write(root, `node_modules/${name}`, "regenerable output\n");
        const locked = join(root, "node_modules/b-immutable.txt");
        const set = spawnSync("chflags", ["uchg", locked], {
          encoding: "utf8",
        });
        if (
          set.status !== 0 &&
          /not supported|unsupported|ENOTSUP/iu.test(set.stderr ?? "")
        ) {
          t.skip("this filesystem does not support immutable flags");
          return;
        }
        assert.equal(set.status, 0, set.stderr);
        try {
          const refused = f.close("--publish");
          assertCloseRefusal(
            f,
            refused,
            "--publish",
            new RegExp(
              `${side === "base" ? "target clone base main" : "target worktree"} cannot close: disposable directory node_modules could not remove node_modules/b-immutable.txt`,
            ),
          );
          assert.match(
            refused.stderr,
            /no further deletion attempted.*chflags nouchg/u,
          );
          assert.ok(
            existsSync(join(root, "node_modules/c-after.txt")),
            "nothing after the failing entry is deleted",
          );
          // The stopped attempt still records what its deletion removed and
          // the time it took.
          const removal = closeRecord(f).steps.find(
            (step) => step.name === "worktree-removal",
          );
          const deletion = removal.children.find(
            (child) => child.name === "disposable-deletion",
          );
          assert.equal(deletion.files, 1);
          assert.equal(deletion.bytes, "regenerable output\n".length);
          assert.ok(deletion.durationMs > 0);
          assert.equal(
            closeRecord(f).blocker.class,
            "declared-root-unreadable",
          );
        } finally {
          assert.equal(
            spawnSync("chflags", ["nouchg", locked], { encoding: "utf8" })
              .status,
            0,
          );
        }
      },
      { baseIgnore: "node_modules\n" },
    );
  });

for (const vector of ["target-files", "target-directories", "judge-only"])
  test(`oversized ${vector} listing names its checkout role and a runnable close retry`, () =>
    withFixture(
      (f) => {
        f.config.repositories.target.disposable = ["dist"];
        if (vector === "judge-only")
          f.config.repositories.target.baseDisposablePolicy = "judge-only";
        write(f.main, "dotln.config.json", JSON.stringify(f.config));
        git(f.main, "add", "-A");
        git(
          f.main,
          "-c",
          "maintenance.auto=false",
          "commit",
          "-qm",
          "Declare disposable listing fixture",
        );
        git(f.main, "push", "-q", "origin", "main");
        f.mapClone();
        f.start();
        mergedCloseFixture(f);
        if (vector === "judge-only")
          write(f.clone, "dist/keep.txt", "retained ignored output\n");
        const bin = join(f.base, "listing-bin");
        mkdirSync(bin);
        const realGit = spawnSync("/bin/sh", ["-c", "command -v git"], {
          env: f.env,
          encoding: "utf8",
        }).stdout.trim();
        const counter = join(bin, "tree-count");
        const fakeGit = `#!${process.execPath}
import {readFileSync,writeFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
function main(){
const args=process.argv.slice(2),cwd=args[args.indexOf('-C')+1],vector=${JSON.stringify(vector)},target=${JSON.stringify(f.target)},clone=${JSON.stringify(f.clone)};
let overflow=cwd===target&&args.includes('ls-files')&&(vector==='target-directories'?args.includes('--directory'):vector==='target-files'&&args.includes('--ignored')&&!args.includes('--directory'));
if(vector==='judge-only'&&cwd===clone&&args.includes('ls-files')&&args.includes('--others')) {process.stdout.write('dist\\0');return;}
if(vector==='judge-only'&&cwd===clone&&args.includes('ls-tree')&&args.includes('--name-only')) {let n=0;try{n=Number(readFileSync(${JSON.stringify(counter)},'utf8'));}catch{}writeFileSync(${JSON.stringify(counter)},String(++n));overflow=n===2;}
// Natural exit lets piped output drain before the parent judges its size.
if(overflow){for(let n=0;n<19000;n++)process.stdout.write('dist/'+('a'.repeat(1000))+'/'+n+'\\0');return;}
const result=spawnSync(${JSON.stringify(realGit)},args,{stdio:'inherit'});process.exitCode=result.status??1;
}
main();
`;
        writeFileSync(join(bin, "git"), fakeGit, { mode: 0o755 });
        const refused = f.call(
          f.main,
          f.main,
          "release",
          ["close", "WO-999", "--publish"],
          { PATH: `${bin}:${f.env.PATH}` },
        );
        assertCloseRefusal(
          f,
          refused,
          "--publish",
          new RegExp(
            `${vector === "judge-only" ? "target clone base main" : "target worktree"} cannot close: .*16 MiB`,
          ),
        );
        assert.doesNotMatch(refused.stderr, /[Ff]ix what Git reports/u);
        assert.ok(
          existsSync(f.target),
          "the listing refuses before worktree removal",
        );
      },
      { baseIgnore: "dist\n" },
    ));

// The close record of the fixture order, as main retains it.
const closeRecord = (f) =>
  JSON.parse(
    readFileSync(
      docPath(f.main, "control", "local/retained/WO-999/release-close.json"),
      "utf8",
    ),
  );
const declareDisposable = (f, disposable) => {
  f.config.repositories.target.disposable = disposable;
  write(f.main, "dotln.config.json", JSON.stringify(f.config));
  git(f.main, "add", "-A");
  git(
    f.main,
    "-c",
    "maintenance.auto=false",
    "commit",
    "-qm",
    "test: declare disposable output",
  );
  git(f.main, "push", "-q", "origin", "main");
  f.mapClone();
  f.start();
  mergedCloseFixture(f);
};
// The harness snapshot the launchpad runtime the target's hooks load
// installs, as an emit run against the target writes it: the snapshot's
// content-addressed name, and package files with that runtime's own bytes.
const kitSnapshot = (f) => {
  const registered = Object.values(
    JSON.parse(readFileSync(targetRegistryPath(f.main), "utf8")),
  ).find((row) => row.workOrderId === "WO-999");
  return {
    runtimeRoot: registered.runtimeRoot,
    snapshot: harnessInstallation({ runtimeRoot: registered.runtimeRoot })
      .runtimeSnapshot,
  };
};
const plantSnapshotFile = (f, path = "packages/skeleton/package.json") => {
  const { runtimeRoot, snapshot } = kitSnapshot(f);
  write(
    f.target,
    `${snapshot}/${path}`,
    readFileSync(join(runtimeRoot, path), "utf8"),
  );
  return snapshot;
};
// What a session run inside the target leaves of the kit's: its journal
// lane, the order's change reviews, a released writer directory, the Spotlight
// marker and a harness snapshot. The temporary-root ledger comes from a root
// registered with the target as its repository, as session scratch is.
const plantKitResidue = (f) => {
  const session = "e".repeat(64);
  write(
    f.target,
    `docs/control/local/harness/${session}.jsonl`,
    '{"typedEvent":"OperatorMessageObserved","workOrder":"WO-999"}\n',
  );
  write(
    f.target,
    `docs/control/local/harness/${session}.json`,
    '{"role":"release-close","workOrder":"WO-999"}\n',
  );
  write(
    f.target,
    "docs/control/local/reviews/WO-999/round-1-criteria.md",
    "# Change review: criteria, round 1, WO-999\n",
  );
  mkdirSync(join(f.target, "docs/control/local/harness/writer"), {
    recursive: true,
  });
  write(f.target, ".runtime/.metadata_never_index", "");
  const snapshot = plantSnapshotFile(f);
  const scratch = ensureTemporaryRoot(join(f.base, "dotln-target-session"), {
    class: "session-scratch",
    repository: f.target,
  });
  return { session, scratch, snapshot };
};
// The worktree-removal row's children: the seven named parts, each timed,
// whose sum stays within the row's own duration.
const assertRemovalChildren = (record) => {
  const row = record.steps.find((step) => step.name === "worktree-removal");
  assert.deepEqual(
    record.steps.map((step) => step.name),
    [
      "prerequisites",
      "runtime",
      "worktree-removal",
      "publication",
      "starter-refresh",
      "prune",
      "record",
    ],
  );
  assert.deepEqual(
    row.children.map((child) => child.name),
    [
      "base-fetch",
      "disposable-deletion",
      "finder-metadata",
      "journal-retention",
      "git-worktree-remove",
      "branch-delete",
      "preservation",
    ],
  );
  for (const child of row.children)
    assert.ok(
      Number.isFinite(child.durationMs) && child.durationMs >= 0,
      child.name,
    );
  assert.ok(
    row.children.reduce((sum, child) => sum + child.durationMs, 0) <=
      row.durationMs,
    JSON.stringify(row),
  );
  return Object.fromEntries(row.children.map((child) => [child.name, child]));
};

test("WO-252 a fork-shaped target closes on its first attempt: sixteen nested caches under one glob, the kit's residue moved or deleted, no blocker, timed children and the printed handoff", (t) =>
  withFixture(
    (f) => {
      declareDisposable(f, ["**/node_modules"]);
      const reviewed = git(f.target, "rev-parse", "HEAD");
      for (let index = 0; index < 16; index++)
        write(
          f.target,
          `libs/project-${index}/node_modules/${index % 2 ? ".vitest" : ".vite"}/results.json`,
          "regenerable\n",
        );
      write(f.target, "node_modules/.cache/nx/state.json", "regenerable\n");
      const { session, scratch, snapshot } = plantKitResidue(f);
      try {
        const closed = f.ok(f.close("--publish"));
        assert.equal(existsSync(f.target), false);
        // The handoff names what an instance's profile records.
        assert.match(
          closed,
          /^Target target published tag: none \(no-release policy\)\.$/mu,
        );
        assert.ok(
          closed
            .split("\n")
            .includes(`Target target reviewed commit: ${reviewed}.`),
          closed,
        );
        const record = closeRecord(f);
        assert.equal(record.blocker, null);
        assert.deepEqual(
          record.previousAttempts.filter((attempt) => attempt.blocker),
          [],
          "no earlier attempt stopped",
        );
        assert.equal(record.targetCleanup.outcome, "removed");
        const [glob] = record.targetCleanup.disposable.target;
        assert.equal(glob.path, "**/node_modules");
        assert.equal(glob.files, 17);
        assert.deepEqual(
          glob.matches,
          [
            ...Array.from({ length: 16 }, (_, index) => ({
              path: `libs/project-${index}/node_modules`,
              files: 1,
            })),
            { path: "node_modules", files: 1 },
          ].sort((a, b) => (a.path < b.path ? -1 : 1)),
        );
        const { residue } = record.targetCleanup;
        assert.equal(residue.journals.outcome, "moved");
        assert.equal(residue.journals.files, 3);
        assert.deepEqual(
          residue.deleted.map(({ path, kind, outcome }) => ({
            path,
            kind,
            outcome,
          })),
          [
            {
              path: "docs/control/local/harness/writer",
              kind: "released writer",
              outcome: "deleted",
            },
            {
              path: ".runtime/.metadata_never_index",
              kind: "Spotlight marker",
              outcome: "deleted",
            },
            {
              path: snapshot,
              kind: "harness snapshot",
              outcome: "deleted",
            },
            {
              path: ".runtime/temporary-roots/roots",
              kind: "temporary-root ledger",
              outcome: "deleted",
            },
          ],
        );
        assert.equal(residue.ledgerRoots, 1);
        // The target's journals and reviews are in main's retained lane for
        // the order, where the launchpad worktree's go.
        const lane = docPath(
          f.main,
          "control",
          "local/retained/WO-999/harness",
        );
        assert.equal(
          readFileSync(join(lane, `${session}.jsonl`), "utf8"),
          '{"typedEvent":"OperatorMessageObserved","workOrder":"WO-999"}\n',
        );
        assert.ok(existsSync(join(lane, `${session}.json`)));
        assert.equal(
          readFileSync(join(lane, "reviews/round-1-criteria.md"), "utf8"),
          "# Change review: criteria, round 1, WO-999\n",
        );
        assert.ok(
          readFileSync(join(lane, "sources.jsonl"), "utf8")
            .split("\n")
            .filter(Boolean)
            .some((line) => JSON.parse(line).worktree === f.target),
        );
        // The root the target's ledger registered outlives that ledger in
        // the close record, and the close's prune judged it.
        assert.ok(
          record.ownedTemporaryRoots.some((saved) => saved.path === scratch),
        );
        const children = assertRemovalChildren(record);
        // What the step spent its time on, for the order's measurements.
        const removal = record.steps.find(
          (step) => step.name === "worktree-removal",
        );
        t.diagnostic(
          `worktree-removal ${removal.durationMs.toFixed(1)} ms: ${Object.values(
            children,
          )
            .map((child) => `${child.name} ${child.durationMs.toFixed(1)}`)
            .join(", ")}`,
        );
        // The seventeen caches, then the marker, the snapshot's file and the
        // ledger's segment; the released writer directory holds no file.
        assert.equal(children["disposable-deletion"].files, 17 + 3);
        assert.ok(children["disposable-deletion"].bytes > 0);
        assert.ok(children["base-fetch"].durationMs > 0);
        assert.ok(children["git-worktree-remove"].durationMs > 0);
      } finally {
        if (existsSync(scratch))
          removeTemporaryRoot(scratch, readTemporaryOwner(scratch).token);
      }
    },
    { baseIgnore: "node_modules\ndocs/control/local/\n" },
  ));

test("WO-252 one **/node_modules entry closes nested Vite and Vitest caches and the root's cache on the first attempt, listing each under that entry", () =>
  withFixture(
    (f) => {
      declareDisposable(f, ["**/node_modules"]);
      write(f.target, "libs/a/node_modules/.vite/deps/a.js", "cache\n");
      write(f.target, "libs/a/node_modules/.vite/deps/b.js", "cache\n");
      write(f.target, "libs/b/node_modules/.vitest/results.json", "{}\n");
      write(f.target, "node_modules/.cache/nx/state.json", "{}\n");
      write(f.target, "node_modules/.cache/nx/lock", "\n");
      write(f.target, "node_modules/.cache/nx/terminal", "\n");
      const closed = f.ok(f.close("--publish"));
      assert.match(
        closed,
        /disposable output deleted: \*\*\/node_modules \(6 in 3 matches\)/u,
      );
      const record = closeRecord(f);
      assert.equal(record.blocker, null);
      assert.deepEqual(record.previousAttempts, []);
      assert.deepEqual(record.targetCleanup.disposable.target, [
        {
          path: "**/node_modules",
          files: 6,
          matches: [
            { path: "libs/a/node_modules", files: 2 },
            { path: "libs/b/node_modules", files: 1 },
            { path: "node_modules", files: 3 },
          ],
        },
      ]);
      assert.equal(existsSync(f.target), false);
    },
    { baseIgnore: "node_modules\n" },
  ));

test("WO-252 a one-segment glob takes only its depth, and a glob match through a link still refuses as a declared root does", () =>
  withFixture(
    (f) => {
      declareDisposable(f, ["libs/*/dist", "**/node_modules"]);
      write(f.target, "libs/a/dist/main.js", "built\n");
      write(f.target, "libs/a/src/dist/main.js", "built\n");
      const deeper = f.close("--publish");
      assertCloseRefusal(
        f,
        deeper,
        "--publish",
        /target has undeclared ignored material; source retained: libs\/a\/src\/\. Declare it disposable/u,
      );
      assert.ok(existsSync(join(f.target, "libs/a/dist/main.js")));
      assert.equal(closeRecord(f).blocker.class, "undeclared-ignored-material");
      assert.equal(closeRecord(f).blocker.step, "worktree-removal");
      // The launchpad session removes it by the target's path.
      rmSync(join(f.target, "libs/a/src/dist"), { recursive: true });
      mkdirSync(join(f.base, "outside-cache"));
      write(f.base, "outside-cache/keep.txt", "outside\n");
      mkdirSync(join(f.target, "libs/c"), { recursive: true });
      symlinkSync(
        join(f.base, "outside-cache"),
        join(f.target, "libs/c/node_modules"),
      );
      const linked = f.close("--publish");
      assertCloseRefusal(
        f,
        linked,
        "--publish",
        /declared root libs\/c\/node_modules \(matched by \*\*\/node_modules\) has a symlinked component/u,
      );
      assert.equal(closeRecord(f).blocker.class, "declared-root-unreadable");
      assert.ok(existsSync(join(f.base, "outside-cache/keep.txt")));
      assert.ok(existsSync(join(f.target, "libs/a/dist/main.js")));
      rmSync(join(f.target, "libs/c/node_modules"));
      f.ok(f.close("--publish"));
      const record = closeRecord(f);
      assert.equal(record.blocker, null);
      assert.deepEqual(record.targetCleanup.disposable.target, [
        {
          path: "libs/*/dist",
          files: 1,
          matches: [{ path: "libs/a/dist", files: 1 }],
        },
      ]);
      assert.deepEqual(
        record.previousAttempts.map((attempt) => attempt.blocker?.class),
        ["undeclared-ignored-material", "declared-root-unreadable"],
      );
      assert.ok(existsSync(join(f.base, "outside-cache/keep.txt")));
    },
    { baseIgnore: "dist/\nnode_modules\n" },
  ));

test("WO-252 a target close refuses what the kit did not write and stops on a held writer before deleting anything", () =>
  withFixture(
    (f) => {
      declareDisposable(f, []);
      const { session, scratch, snapshot } = plantKitResidue(f);
      const residue = [
        `docs/control/local/harness/${session}.jsonl`,
        "docs/control/local/reviews/WO-999/round-1-criteria.md",
        ".runtime/.metadata_never_index",
        `${snapshot}/packages/skeleton/package.json`,
      ];
      const kept = () => {
        for (const path of residue)
          assert.ok(existsSync(join(f.target, path)), path);
        assert.ok(
          existsSync(join(f.target, "docs/control/local/harness/writer")),
        );
      };
      try {
        write(f.target, "docs/control/local/notes.txt", "operator note\n");
        write(f.target, ".env", "KEY=value\n");
        write(f.target, ".runtime/notes.txt", "not the kit's\n");
        // Nothing in a snapshot's directory is the kit's unless the
        // runtime's own package source lists it with those bytes, even where
        // a launchpad holds the same file at the same path: a note beside
        // the snapshot's packages or inside one, and a package file under a
        // snapshot name no runtime computes, each mirrored into main, and an
        // edited package file are all judged like any other path (the
        // combined review's round 3 F1).
        const packageBytes = readFileSync(
          join(f.target, `${snapshot}/packages/skeleton/package.json`),
          "utf8",
        );
        const mirrored = [
          [`${snapshot}/operator-note.txt`, "not the kit's either\n"],
          [`${snapshot}/packages/skeleton/operator-note.txt`, "nor this\n"],
          [
            ".runtime/harness/0123456789abcdef/packages/skeleton/package.json",
            packageBytes,
          ],
        ];
        for (const [path, contents] of mirrored)
          for (const root of [f.main, f.target]) write(root, path, contents);
        const edited = `${snapshot}/packages/compiler/package.json`;
        write(f.target, edited, '{"name":"edited"}\n');
        const foreign = [
          ...mirrored.map(([path]) => path),
          edited,
          "docs/control/local/notes.txt",
          ".env",
          ".runtime/notes.txt",
        ];
        const escaped = (path) => path.replace(/[.*+?^${}()|[\]\\/]/gu, "\\$&");
        for (const mode of ["--dry-run", "--publish"]) {
          const refused = f.close(mode);
          assertCloseRefusal(
            f,
            refused,
            mode,
            new RegExp(
              `target has undeclared ignored material; source retained: ${[
                ...foreign,
              ]
                .sort()
                .map(escaped)
                .join(
                  ", ",
                )}\\. Declare it disposable in the registration or remove it; regenerable build output is deleted at close`,
              "u",
            ),
          );
          kept();
          for (const path of foreign)
            assert.ok(existsSync(join(f.target, path)), path);
        }
        assert.equal(
          closeRecord(f).blocker.class,
          "undeclared-ignored-material",
        );
        for (const path of foreign) rmSync(join(f.target, path));
        for (const [path] of mirrored) rmSync(join(f.main, path));
        // A held writer, as a record or as a non-empty writer directory,
        // stops the close before anything is moved or deleted.
        write(f.target, "docs/control/local/harness/writer.json", "{}\n");
        const legacy = f.close("--publish");
        assertCloseRefusal(
          f,
          legacy,
          "--publish",
          /target worktree: writer reservation \(not proven released\); source retained/u,
        );
        assert.equal(closeRecord(f).blocker.class, "writer-held");
        kept();
        rmSync(join(f.target, "docs/control/local/harness/writer.json"));
        write(
          f.target,
          "docs/control/local/harness/writer/holder.json",
          "{}\n",
        );
        const held = f.close("--publish");
        assertCloseRefusal(
          f,
          held,
          "--publish",
          /target worktree: writer reservation \(not proven released\); source retained/u,
        );
        assert.equal(closeRecord(f).blocker.class, "writer-held");
        kept();
        rmSync(join(f.target, "docs/control/local/harness/writer/holder.json"));
        f.ok(f.close("--publish"));
        const record = closeRecord(f);
        assert.equal(record.blocker, null);
        assert.equal(record.targetCleanup.residue.journals.outcome, "moved");
        assert.equal(existsSync(f.target), false);
      } finally {
        if (existsSync(scratch))
          removeTemporaryRoot(scratch, readTemporaryOwner(scratch).token);
      }
    },
    { baseIgnore: "docs/control/local/\n.runtime/\n.env\n" },
  ));

// The reviewed target change, committed on the order's target branch, merged
// into the target's base as a reviewer's merge would.
const mergeTargetChange = (f) => {
  const merger = join(f.base, "merger");
  git(
    f.base,
    "-c",
    "maintenance.auto=false",
    "clone",
    "-q",
    join(f.base, "target.git"),
    merger,
  );
  git(merger, "config", "user.email", "fixture@example.invalid");
  git(merger, "config", "user.name", "Fixture");
  git(merger, "fetch", "-q", f.clone, "wo-999");
  git(
    merger,
    "merge",
    "-q",
    "--no-ff",
    "-m",
    "Merge target change",
    "FETCH_HEAD",
  );
  git(merger, "push", "-q", "origin", "main");
};

test("WO-252 the kit's snapshot cleanup removes only its listed files, so a tracked file beside them survives", () => {
  // The reviewed change tracks a file inside the harness snapshot's directory
  // and one at its record's path: the record itself, which stays and keeps
  // proving the snapshot, or a file the kit did not write, which stops the
  // close before anything is deleted.
  for (const mode of ["record", "foreign"])
    withFixture(
      (f) => {
        f.mapClone();
        f.start();
        const { runtimeRoot, snapshot } = kitSnapshot(f);
        const current = harnessInstallation({ runtimeRoot });
        const recordText = runtimeSnapshotContent(
          current.runtimeFiles,
          current.runtimeInventory,
        ).get(RUNTIME_SNAPSHOT_RECORD).text;
        const tracked = `${snapshot}/keep.txt`;
        const recordPath = `${snapshot}/${RUNTIME_SNAPSHOT_RECORD}`;
        write(f.target, tracked, "tracked\n");
        write(
          f.target,
          recordPath,
          mode === "record" ? recordText : "not the record\n",
        );
        git(f.target, "add", "-f", tracked, recordPath);
        git(
          f.target,
          "-c",
          "maintenance.auto=false",
          "commit",
          "-qm",
          "test: track files beside a snapshot",
        );
        mergedCloseFixture(f);
        mergeTargetChange(f);
        // A package file and a package link, as the emit installs them.
        plantSnapshotFile(f);
        mkdirSync(join(f.target, snapshot, "node_modules/@dotln"), {
          recursive: true,
        });
        symlinkSync(
          "../../packages/skeleton",
          join(f.target, snapshot, "node_modules/@dotln/skeleton"),
        );
        if (mode === "foreign") {
          const escaped = (text) =>
            text.replace(/[.*+?^${}()|[\]\\/]/gu, "\\$&");
          for (const closeMode of ["--dry-run", "--publish"])
            assertCloseRefusal(
              f,
              f.close(closeMode),
              closeMode,
              new RegExp(
                `the kit's harness snapshot ${escaped(snapshot)} holds ${escaped(recordPath)}, a file the kit did not write at its record's path`,
                "u",
              ),
            );
          assert.equal(
            closeRecord(f).blocker.class,
            "declared-root-unreadable",
          );
          assert.ok(
            existsSync(
              join(f.target, snapshot, "packages/skeleton/package.json"),
            ),
          );
          assert.equal(
            readlinkSync(
              join(f.target, snapshot, "node_modules/@dotln/skeleton"),
            ),
            "../../packages/skeleton",
          );
          return;
        }
        f.ok(f.close("--publish"));
        const record = closeRecord(f);
        assert.equal(record.blocker, null);
        assert.deepEqual(record.previousAttempts, []);
        assert.deepEqual(
          record.targetCleanup.residue.deleted.map(
            ({ path, kind, files, outcome }) => ({
              path,
              kind,
              files,
              outcome,
            }),
          ),
          [
            {
              path: snapshot,
              kind: "harness snapshot",
              files: 2,
              outcome: "deleted",
            },
          ],
        );
        assert.equal(
          git(join(f.base, "target.git"), "show", `main:${tracked}`),
          "tracked",
        );
        assert.equal(
          git(join(f.base, "target.git"), "show", `main:${recordPath}`),
          recordText,
        );
      },
      { baseIgnore: ".runtime/\n" },
    );
});

test("WO-252 a foreign file at a snapshot's record path under a declared root is deleted as declared output, and the kit's snapshot goes with it", () =>
  withFixture(
    (f) => {
      declareDisposable(f, [".runtime"]);
      // A file the listing names at the record's path is judged like any
      // other path: here the registration declares it disposable.
      const snapshot = plantSnapshotFile(f);
      const recordPath = `${snapshot}/${RUNTIME_SNAPSHOT_RECORD}`;
      write(f.target, recordPath, "not the record\n");
      f.ok(f.close("--publish"));
      const record = closeRecord(f);
      assert.equal(record.blocker, null);
      assert.deepEqual(record.previousAttempts, []);
      assert.deepEqual(
        record.targetCleanup.residue.deleted
          .filter((row) => row.kind === "harness snapshot")
          .map(({ path, files }) => ({ path, files })),
        [{ path: snapshot, files: 1 }],
      );
      assert.deepEqual(record.targetCleanup.disposable.target, [
        { path: ".runtime", files: 1 },
      ]);
      assert.equal(existsSync(f.target), false);
    },
    { baseIgnore: ".runtime/\n" },
  ));

test("WO-252 snapshots earlier runtimes installed are the kit's residue too, proven by the record a changed pinned list left or, before records, by their own package files with the list their release pinned, while a file the kit did not write in one is still refused", () =>
  withFixture(
    (f) => {
      declareDisposable(f, []);
      const { runtimeRoot } = kitSnapshot(f);
      // The serving runtime is this fixture's copy, never this checkout.
      assert.ok(runtimeRoot.startsWith(`${f.base}/`));
      const current = harnessInstallation({ runtimeRoot });
      // A runtime whose pinned file list differed: only the record its
      // installer wrote can prove that snapshot once the runtime is gone.
      const changedList = {
        runtimeFiles: current.runtimeFiles.slice(1),
        runtimeInventory: current.runtimeInventory,
        sourceRoot: runtimeRoot,
      };
      changedList.runtimeSnapshot = runtimeSnapshotPath(
        changedList.runtimeFiles,
        changedList.runtimeInventory,
      );
      preserveHarnessRuntime(f.target, changedList);
      // The list v0.83.0 to v0.102.0 pinned, installed before records: the
      // serving runtime pins another list, so only the list that release
      // pinned proves the snapshot by its own package files.
      const releaseList = {
        runtimeFiles: PRE_RECORD_RUNTIME_FILE_LISTS[0].map((path) =>
          current.runtimeFiles.find((file) => file.path === path),
        ),
        runtimeInventory: current.runtimeInventory,
        sourceRoot: runtimeRoot,
      };
      releaseList.runtimeSnapshot = runtimeSnapshotPath(
        releaseList.runtimeFiles,
        releaseList.runtimeInventory,
      );
      assert.notDeepEqual(
        releaseList.runtimeFiles.map((file) => file.path),
        current.runtimeFiles.map((file) => file.path),
      );
      preserveHarnessRuntime(f.target, releaseList);
      rmSync(
        join(f.target, releaseList.runtimeSnapshot, RUNTIME_SNAPSHOT_RECORD),
      );
      // A runtime with the same list and another package version, installed
      // before snapshots carried a record: its own package files prove it.
      const manifest = join(runtimeRoot, "packages/skeleton/package.json");
      const manifestBytes = readFileSync(manifest, "utf8");
      let beforeRecords;
      try {
        writeFileSync(
          manifest,
          `${JSON.stringify({ ...JSON.parse(manifestBytes), version: "0.0.1" }, null, 2)}\n`,
        );
        beforeRecords = harnessInstallation({ runtimeRoot });
        preserveHarnessRuntime(f.target, beforeRecords);
      } finally {
        writeFileSync(manifest, manifestBytes);
      }
      rmSync(
        join(f.target, beforeRecords.runtimeSnapshot, RUNTIME_SNAPSHOT_RECORD),
      );
      preserveHarnessRuntime(f.target, current);
      const snapshots = [changedList, releaseList, beforeRecords, current]
        .map((installation) => installation.runtimeSnapshot)
        .sort();
      assert.equal(new Set(snapshots).size, 4);
      const kept = () => {
        for (const snapshot of snapshots)
          assert.ok(existsSync(join(f.target, snapshot)), snapshot);
      };
      // A note inside a package of the snapshot its record proves is named on
      // its own; nothing is deleted.
      const note = `${changedList.runtimeSnapshot}/packages/skeleton/dist/notes.txt`;
      write(f.target, note, "operator note\n");
      assertCloseRefusal(
        f,
        f.close("--publish"),
        "--publish",
        new RegExp(
          `target has undeclared ignored material; source retained: ${note.replace(/[.*+?^${}()|[\]\\/]/gu, "\\$&")}\\. Declare it disposable`,
          "u",
        ),
      );
      kept();
      rmSync(join(f.target, note));
      // A changed package byte leaves the snapshot installed before records
      // unproven, so every file of it is refused and none is deleted, while
      // the other three are never named.
      const edited = join(
        f.target,
        beforeRecords.runtimeSnapshot,
        "packages/skeleton/package.json",
      );
      const editedBytes = readFileSync(edited);
      writeFileSync(edited, "{}\n");
      const unproven = f.close("--publish");
      assertCloseRefusal(
        f,
        unproven,
        "--publish",
        /target has undeclared ignored material; source retained: /u,
      );
      assert.ok(
        unproven.stderr.includes(
          `${beforeRecords.runtimeSnapshot}/packages/skeleton/package.json`,
        ),
        unproven.stderr.slice(0, 2000),
      );
      for (const proven of [changedList, releaseList, current])
        assert.ok(
          !unproven.stderr.includes(proven.runtimeSnapshot),
          proven.runtimeSnapshot,
        );
      assert.equal(closeRecord(f).blocker.class, "undeclared-ignored-material");
      kept();
      writeFileSync(edited, editedBytes);
      // A deletion that stops part way takes a snapshot's record last, and a
      // snapshot proven without one is given it first, so the next attempt
      // still proves what remains, whichever snapshot it stopped in. Each
      // attempt stops in the first of those still unwritable.
      const earlier = [beforeRecords, changedList, releaseList].map(
        (installation) => installation.runtimeSnapshot,
      );
      const unwritable = (snapshot) =>
        join(f.target, snapshot, "packages/skeleton/dist/src");
      for (const snapshot of earlier) chmodSync(unwritable(snapshot), 0o555);
      const stoppedIn = [];
      try {
        for (const attempt of [1, 2, 3]) {
          const stopped = f.close("--publish");
          assertCloseRefusal(
            f,
            stopped,
            "--publish",
            /the kit's harness snapshot \.runtime\/harness\/[a-f0-9]{16} could not be removed \(EACCES\)/u,
          );
          const halted =
            /the kit's harness snapshot (\.runtime\/harness\/[a-f0-9]{16}) could not be removed/u.exec(
              stopped.stderr,
            )[1];
          assert.equal(
            closeRecord(f).blocker.class,
            "declared-root-unreadable",
            `attempt ${attempt}`,
          );
          assert.equal(
            existsSync(
              join(f.target, halted, "packages/compiler/package.json"),
            ),
            false,
            `${halted}: the deletion stopped part way through it`,
          );
          assert.ok(
            existsSync(join(f.target, halted, RUNTIME_SNAPSHOT_RECORD)),
            `${halted}: its record survives`,
          );
          chmodSync(unwritable(halted), 0o755);
          stoppedIn.push(halted);
        }
      } finally {
        for (const snapshot of earlier)
          if (existsSync(unwritable(snapshot)))
            chmodSync(unwritable(snapshot), 0o755);
      }
      assert.deepEqual(stoppedIn.sort(), [...earlier].sort());
      f.ok(f.close("--publish"));
      const record = closeRecord(f);
      assert.equal(record.blocker, null);
      for (const snapshot of snapshots)
        assert.equal(existsSync(join(f.target, snapshot)), false, snapshot);
      assert.equal(existsSync(f.target), false);
    },
    { baseIgnore: ".runtime/\n" },
  ));

// A session's scratch registered with the target, its retention passed and
// its owner gone, so a prune may remove it once the target's ledger binds it.
const expiredTargetScratch = (f, name) => {
  const path = ensureTemporaryRoot(join(f.base, name), {
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
  const owner = readTemporaryOwner(path);
  delete owner.fixtureOwner;
  owner.createdAt = "2020-01-01T00:00:00.000Z";
  owner.endedAt = owner.createdAt;
  writeTemporaryOwner(path, owner);
  return {
    path,
    token: owner.token,
    segment: join(
      f.target,
      ".runtime/temporary-roots/roots",
      `${owner.token}.jsonl`,
    ),
  };
};
// Whether a prune judging from main may remove the root, with no process,
// open path, live lane or gate in the way.
const prunable = (f, path) =>
  Boolean(
    judgeTemporaryRoot(
      f.main,
      path,
      {},
      { processes: [], openPaths: [], holders: [], gateLive: false },
    )?.candidate,
  );
const ledgerRows = (record) =>
  record.targetCleanup.residue.deleted.filter(
    (row) => row.kind === "temporary-root ledger",
  );

test("WO-252 a target removal that Git stops leaves the temporary-root ledger as it was, so a root it registers stays prunable until a retry removes the target", () =>
  withFixture(
    (f) => {
      declareDisposable(f, []);
      const scratch = expiredTargetScratch(f, "dotln-target-ledger-locked");
      try {
        const bytes = readFileSync(scratch.segment);
        assert.ok(prunable(f, scratch.path), "prunable before the close");
        const marker = existsSync(
          join(f.target, ".runtime/.metadata_never_index"),
        );
        git(f.clone, "worktree", "lock", f.target);
        let stopped;
        try {
          stopped = f.close("--publish");
        } finally {
          git(f.clone, "worktree", "unlock", f.target);
        }
        assert.notEqual(stopped.status, 0, stopped.stdout);
        assert.ok(existsSync(f.target));
        // The segment is back byte for byte, so the root is as prunable
        // while the target stands as it was before the attempt.
        assert.deepEqual(readFileSync(scratch.segment), bytes);
        assert.ok(prunable(f, scratch.path), "prunable after the stop");
        const record = closeRecord(f);
        assert.equal(record.blocker.step, "worktree-removal");
        assert.deepEqual(ledgerRows(record), [
          {
            path: ".runtime/temporary-roots/roots",
            kind: "temporary-root ledger",
            files: 1,
            bytes: bytes.length,
            outcome: "restored",
          },
        ]);
        // What was written back is not counted as deleted.
        assert.equal(
          assertRemovalChildren(record)["disposable-deletion"].files,
          marker ? 1 : 0,
        );
        assert.ok(
          record.ownedTemporaryRoots.some(
            (saved) => saved.path === scratch.path,
          ),
        );
        // The retry removes the target, and the close's own prune then
        // judges the carried root by its marker and removes it.
        f.ok(f.close("--publish"));
        assert.equal(existsSync(f.target), false);
        const retried = closeRecord(f);
        assert.equal(retried.blocker, null);
        assert.deepEqual(
          ledgerRows(retried).map((row) => row.outcome),
          ["deleted"],
        );
        assert.ok(
          retried.prune.removed.some((row) => row.path === scratch.path),
          JSON.stringify(retried.prune.retained),
        );
        assert.equal(existsSync(scratch.path), false);
      } finally {
        if (existsSync(scratch.path))
          removeTemporaryRoot(scratch.path, scratch.token);
      }
    },
    { baseIgnore: ".runtime/\n" },
  ));

test("WO-252 a declared-output deletion that stops leaves the temporary-root ledger untouched, so a root it registers stays prunable", (t) => {
  if (process.platform !== "darwin") {
    t.skip("the filesystem immutable flag is unavailable on this platform");
    return;
  }
  return withFixture(
    (f) => {
      declareDisposable(f, ["node_modules"]);
      const scratch = expiredTargetScratch(f, "dotln-target-ledger-output");
      const bytes = readFileSync(scratch.segment);
      for (const name of ["a-first.txt", "b-immutable.txt"])
        write(f.target, `node_modules/${name}`, "regenerable output\n");
      const locked = join(f.target, "node_modules/b-immutable.txt");
      const set = spawnSync("chflags", ["uchg", locked], { encoding: "utf8" });
      if (
        set.status !== 0 &&
        /not supported|unsupported|ENOTSUP/iu.test(set.stderr ?? "")
      ) {
        t.skip("this filesystem does not support immutable flags");
        return;
      }
      assert.equal(set.status, 0, set.stderr);
      try {
        assertCloseRefusal(
          f,
          f.close("--publish"),
          "--publish",
          /target worktree cannot close: disposable directory node_modules could not remove node_modules\/b-immutable\.txt/u,
        );
        // The ledger goes only immediately before Git's removal, so this
        // stop never reached it.
        assert.deepEqual(readFileSync(scratch.segment), bytes);
        assert.deepEqual(ledgerRows(closeRecord(f)), []);
        assert.ok(prunable(f, scratch.path));
      } finally {
        assert.equal(
          spawnSync("chflags", ["nouchg", locked], { encoding: "utf8" }).status,
          0,
        );
        if (existsSync(scratch.path))
          removeTemporaryRoot(scratch.path, scratch.token);
      }
    },
    { baseIgnore: "node_modules\n.runtime/\n" },
  );
});

test("WO-252 what a tracked link in the target reaches is not the close's to move or delete, so a journal lane behind it stays where the link points", () =>
  withFixture(
    (f) => {
      f.mapClone();
      f.start();
      // The reviewed change tracks docs/control as a link to a directory
      // outside the target that holds what a session's lane would: a
      // journal, an empty writer directory and a change review.
      const outside = join(f.base, "outside-control");
      const session = "e".repeat(64);
      write(outside, `local/harness/${session}.jsonl`, "external journal\n");
      write(
        outside,
        "local/reviews/WO-999/round-1-criteria.md",
        "external review\n",
      );
      mkdirSync(join(outside, "local/harness/writer"), { recursive: true });
      rmSync(join(f.target, "docs/control"), { recursive: true, force: true });
      mkdirSync(join(f.target, "docs"), { recursive: true });
      symlinkSync(outside, join(f.target, "docs/control"));
      git(f.target, "add", "docs/control");
      git(
        f.target,
        "-c",
        "maintenance.auto=false",
        "commit",
        "-qm",
        "test: track a linked control directory",
      );
      mergedCloseFixture(f);
      mergeTargetChange(f);
      f.ok(f.close("--publish"));
      assert.equal(existsSync(f.target), false);
      const record = closeRecord(f);
      assert.equal(record.blocker, null);
      assert.equal(record.targetCleanup.residue.journals.outcome, "nothing");
      assert.deepEqual(record.targetCleanup.residue.deleted, []);
      assert.equal(
        readFileSync(join(outside, `local/harness/${session}.jsonl`), "utf8"),
        "external journal\n",
      );
      assert.equal(
        readFileSync(
          join(outside, "local/reviews/WO-999/round-1-criteria.md"),
          "utf8",
        ),
        "external review\n",
      );
      assert.ok(existsSync(join(outside, "local/harness/writer")));
      assert.equal(
        existsSync(
          join(
            docPath(f.main, "control", "local/retained/WO-999/harness"),
            `${session}.jsonl`,
          ),
        ),
        false,
      );
    },
    { baseIgnore: ".runtime/\n" },
  ));

test("WO-252 a declared file at a snapshot's record path gives way to the record before any of the snapshot goes, so a deletion that stops part way stays provable", () =>
  withFixture(
    (f) => {
      declareDisposable(f, ["**/.dotln-snapshot.json"]);
      const { runtimeRoot } = kitSnapshot(f);
      const current = harnessInstallation({ runtimeRoot });
      // A snapshot of the list v0.83.0 to v0.102.0 pinned, installed before
      // records: only its own package files prove it.
      const release = {
        runtimeFiles: PRE_RECORD_RUNTIME_FILE_LISTS[0].map((path) =>
          current.runtimeFiles.find((file) => file.path === path),
        ),
        runtimeInventory: current.runtimeInventory,
        sourceRoot: runtimeRoot,
      };
      release.runtimeSnapshot = runtimeSnapshotPath(
        release.runtimeFiles,
        release.runtimeInventory,
      );
      preserveHarnessRuntime(f.target, release);
      const record = join(
        f.target,
        release.runtimeSnapshot,
        RUNTIME_SNAPSHOT_RECORD,
      );
      // Declared output at the record's path, as a registration's pattern
      // may name it.
      writeFileSync(record, "not the record\n");
      const unwritable = join(
        f.target,
        release.runtimeSnapshot,
        "packages/skeleton/dist/src",
      );
      chmodSync(unwritable, 0o555);
      try {
        assertCloseRefusal(
          f,
          f.close("--publish"),
          "--publish",
          /the kit's harness snapshot \.runtime\/harness\/[a-f0-9]{16} could not be removed \(EACCES\)/u,
        );
        assert.equal(
          readFileSync(record, "utf8"),
          runtimeSnapshotContent(
            release.runtimeFiles,
            release.runtimeInventory,
          ).get(RUNTIME_SNAPSHOT_RECORD).text,
          "the record took the declared file's place before the deletion began",
        );
        assert.equal(
          existsSync(
            join(
              f.target,
              release.runtimeSnapshot,
              "packages/compiler/package.json",
            ),
          ),
          false,
          "the deletion stopped part way",
        );
      } finally {
        chmodSync(unwritable, 0o755);
      }
      f.ok(f.close("--publish"));
      assert.equal(closeRecord(f).blocker, null);
      assert.equal(existsSync(f.target), false);
    },
    { baseIgnore: ".runtime/\n" },
  ));

test("WO-252 a journal move the lane refuses stops a target close as preservation-refused, in its preview as in the move", () =>
  withFixture(
    (f) => {
      declareDisposable(f, []);
      const session = "e".repeat(64);
      const journal = `docs/control/local/harness/${session}.jsonl`;
      write(f.target, journal, '{"workOrder":"WO-999"}\n');
      // A directory where main's lane keeps that journal.
      mkdirSync(
        join(
          docPath(f.main, "control", "local/retained/WO-999/harness"),
          `${session}.jsonl`,
        ),
        { recursive: true },
      );
      for (const mode of ["--dry-run", "--publish"]) {
        const refused = f.close(mode);
        assert.notEqual(refused.status, 0, mode);
        assert.match(
          refused.stderr,
          /Journal lane entry is not a regular file/u,
          mode,
        );
        assert.deepEqual(
          {
            class: closeRecord(f).blocker.class,
            step: closeRecord(f).blocker.step,
          },
          { class: "preservation-refused", step: "worktree-removal" },
          mode,
        );
        assert.equal(
          readFileSync(join(f.target, journal), "utf8"),
          '{"workOrder":"WO-999"}\n',
        );
      }
    },
    { baseIgnore: "docs/control/local/\n" },
  ));

test("WO-252 a nested repository under declared output counts each file its removal took before it stopped", (t) => {
  if (process.platform !== "darwin") {
    t.skip("the filesystem immutable flag is unavailable on this platform");
    return;
  }
  return withFixture(
    (f) => {
      declareDisposable(f, ["node_modules"]);
      // Git lists an ignored nested repository as one directory entry, which
      // the close removes by walking it.
      const repository = join(f.target, "node_modules/pkg");
      mkdirSync(repository, { recursive: true });
      git(repository, "init", "-q");
      for (const name of ["a-first.txt", "b-immutable.txt", "c-after.txt"])
        write(repository, name, "regenerable output\n");
      const locked = join(repository, "b-immutable.txt");
      const set = spawnSync("chflags", ["uchg", locked], { encoding: "utf8" });
      if (
        set.status !== 0 &&
        /not supported|unsupported|ENOTSUP/iu.test(set.stderr ?? "")
      ) {
        t.skip("this filesystem does not support immutable flags");
        return;
      }
      assert.equal(set.status, 0, set.stderr);
      try {
        const refused = f.close("--publish");
        assertCloseRefusal(
          f,
          refused,
          "--publish",
          /target worktree cannot close: disposable directory node_modules could not remove node_modules\/pkg\//u,
        );
        assert.equal(existsSync(join(repository, "a-first.txt")), false);
        assert.ok(existsSync(join(repository, "c-after.txt")));
        const deletion = closeRecord(f)
          .steps.find((step) => step.name === "worktree-removal")
          .children.find((child) => child.name === "disposable-deletion");
        // The nested repository's Git directory and its first file went
        // before the immutable file stopped the walk, and each counted.
        assert.ok(deletion.files >= 2, JSON.stringify(deletion));
        assert.ok(
          deletion.bytes >= "regenerable output\n".length,
          JSON.stringify(deletion),
        );
        assert.ok(deletion.durationMs > 0);
      } finally {
        assert.equal(
          spawnSync("chflags", ["nouchg", locked], { encoding: "utf8" }).status,
          0,
        );
      }
    },
    { baseIgnore: "node_modules\n" },
  );
});
