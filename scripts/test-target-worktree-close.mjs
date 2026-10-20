import test from "node:test";
import assert from "node:assert/strict";
import {
  chmodSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  readlinkSync,
  realpathSync,
  renameSync,
  rmSync,
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
import { checkTargetHarness } from "./lib/harness.mjs";
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
    git(f.main, "commit", "-qm", "Declare export sibling");
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
    git(f.target, "commit", "-qm", "test: target change");
    closeOrder(f);
    git(f.orderRoot, "add", "-A");
    git(f.orderRoot, "commit", "-qm", "Closed target order");
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
    mkdtempSync(join(tmpdir(), "dotln-finder-permissions-")),
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
      git(f.clone, "commit", "-qm", "test: declare metadata policy");
      git(f.clone, "push", "-q", "origin", "main");
      f.mapClone();
      f.start();
      git(f.target, "merge", "-q", "main");
      closeOrder(f);
      git(f.orderRoot, "add", "-A");
      git(f.orderRoot, "commit", "-qm", "test: close target order");
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
  git(f.orderRoot, "commit", "-qm", "test: close target order");
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
      git(f.main, "commit", "-qm", "test: declare output cleanup");
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
      git(f.main, "commit", "-qm", "test: declare cleanup roots");
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
        git(f.target, "commit", "-qm", "test: target change");
        mergedCloseFixture(f);
        // The forge merges the target change; the clone has not fetched it.
        const upstream = join(f.base, "upstream");
        git(f.base, "clone", "-q", join(f.base, "target.git"), upstream);
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
          git(f.base, "clone", "-q", join(f.base, "target.git"), repository);
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
    git(f.clone, "commit", "-qm", "test: track nested base material");
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
      /target clone base main cannot close: fetch failed: target publish refused: git fetch failed in the publish lane: fatal: '<target origin>' does not appear to be a git repository.*; source retained\. Fix the fetch, then rerun /su,
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
      git(f.clone, "commit", "-qm", "test: track nested material");
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
    git(f.target, "commit", "-qm", "test: target change");
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
      git(f.clone, "commit", "-qm", "test: ignore metadata and writer state");
      git(f.clone, "push", "-q", "origin", "main");
      f.mapClone();
      f.start();
      git(f.target, "merge", "-q", "main");
      write(f.target, "change.txt", "target change\n");
      git(f.target, "add", "change.txt");
      git(f.target, "commit", "-qm", "test: target change");
      closeOrder(f);
      git(f.orderRoot, "add", "-A");
      git(f.orderRoot, "commit", "-qm", "test: close records");
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
        git(f.main, "commit", "-qm", "test: declare cleanup policy");
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
        git(f.main, "commit", "-qm", "test: declare disposable output");
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
  const root = mkdtempSync(join(tmpdir(), "dotln-path-list-limit-"));
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
      git(f.main, "commit", "-qm", "test: keep base output");
      git(f.main, "push", "-q", "origin", "main");
      f.mapClone();
      f.start();
      git(f.target, "merge", "-q", "main");
      write(f.target, "dist/tracked.txt", "new tracked content\n");
      git(f.target, "add", "-f", "dist/tracked.txt");
      git(f.target, "commit", "-qm", "test: add a tracked output path");
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
