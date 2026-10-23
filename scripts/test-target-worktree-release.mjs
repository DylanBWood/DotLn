import test from "node:test";
import assert from "node:assert/strict";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { createHash } from "node:crypto";
import { docPath } from "./lib/config.mjs";
import { write } from "./lib/helpers.mjs";
import { staleOrderHostRules } from "./lib/target-worktrees.mjs";
import { publicationGrant } from "./test-target-publication-fixture.mjs";
import { readGateChecks } from "./lib/gate-evidence.mjs";
import {
  git,
  fixture,
  withFixture,
  closeOrder,
  publicationSetup,
} from "./lib/target-worktree-fixture.mjs";

test("target release preparation is a read-only no-release outcome", () =>
  withFixture((f) => {
    write(
      f.main,
      "README.md",
      "# Fixture\n\n<!-- DOTLN-RELEASE-BEGIN -->\nThis source prepares DotLn `v1.0.0`.\n<!-- DOTLN-RELEASE-END -->\n",
    );
    git(f.main, "add", "README.md");
    git(
      f.main,
      "-c",
      "maintenance.auto=false",
      "commit",
      "-qm",
      "docs: instance release claim",
    );
    git(f.main, "push", "-q", "origin", "main");
    f.mapClone();
    f.start();
    const before = git(f.orderRoot, "status", "--porcelain"),
      segment = readFileSync(docPath(f.orderRoot, "orders", "WO-999.jsonl"));
    const output = f.ok(
      f.call(f.orderRoot, f.orderRoot, "release", ["prepare", "--local"]),
    );
    assert.match(output, /target order records no release/u);
    assert.equal(git(f.orderRoot, "status", "--porcelain"), before);
    assert.deepEqual(
      readFileSync(docPath(f.orderRoot, "orders", "WO-999.jsonl")),
      segment,
    );
    git(f.orderRoot, "switch", "-qc", "wrong-preparation-branch");
    const wrongBranch = f.call(f.orderRoot, f.orderRoot, "release", [
      "prepare",
      "--local",
    ]);
    assert.notEqual(wrongBranch.status, 0);
    assert.match(wrongBranch.stderr, /selected wo-NNN worktree/u);
    git(f.orderRoot, "switch", "-q", "wo-999");
    closeOrder(f);
    const closed = f.call(f.orderRoot, f.orderRoot, "release", [
      "prepare",
      "--local",
    ]);
    assert.notEqual(closed.status, 0);
    assert.match(closed.stderr, /unpublished, open work order/u);
  }));

test("WO-221 a target close deletes declared disposable output, judges the base by the fetched tree, refuses a stray .env with the registration remedy and publishes a declared target release", () =>
  withFixture(
    (f) => {
      const forge = publicationSetup(f);
      const releases = () =>
        existsSync(forge.state)
          ? JSON.parse(readFileSync(forge.state, "utf8")).releases
          : {};
      const strayCache = join(f.clone, ".angular/cache/stray.tsbuildinfo");
      f.config.classes.fixture.disposable = [
        "node_modules",
        ".nx",
        "dist",
        ".angular",
        "coverage",
      ];
      f.config.repositories.target.release = { policy: "declared" };
      f.config.repositories.target.authorityProfile.allowedEffects.push(
        "release.close",
      );
      f.config.repositories.target.gate.commands["base-write"] = {
        argv: [
          process.execPath,
          "-e",
          `const fs = require('node:fs'); fs.mkdirSync(${JSON.stringify(dirname(strayCache))}, { recursive: true }); fs.writeFileSync(${JSON.stringify(strayCache)}, 'cache')`,
        ],
        timeoutMs: 5000,
      };
      f.config.repositories.target.gate.plain = ["test", "base-write"];
      f.config.repositories.target.gate.review = ["test", "base-write"];
      write(f.main, "dotln.config.json", JSON.stringify(f.config));
      // The target release is an effect of the registered repository: the
      // operator grant names it beside the publication effects.
      write(
        f.main,
        "packages/skeleton/loadouts/grants.json",
        JSON.stringify([
          publicationGrant,
          {
            ...publicationGrant,
            grantId: "operator.target-release",
            effects: ["release.close"],
            operations: ["release.close"],
            reason: "Operator grant for the fixture target's release",
          },
        ]),
      );
      write(
        f.main,
        f.order,
        `# WO-999 — target lifecycle fixture\n\n**Model:** any.\n**Effort:** executor any; verifier any; reviewer any.\n**Repository:** target @ ${f.baseCommit}\n**Target release classification:** minor\n`,
      );
      git(f.main, "add", "-A");
      git(
        f.main,
        "-c",
        "maintenance.auto=false",
        "commit",
        "-qm",
        "test: declare disposable output and a target release",
      );
      git(f.main, "push", "-q", "origin", "main");
      f.mapClone();
      f.start();
      write(
        f.target,
        ".gitignore",
        "node_modules/\n.nx/\ndist/\n.angular/\ncoverage/\n.env\nnew.env\n",
      );
      write(f.target, "change.txt", "changed\n");
      git(f.target, "add", "-A");
      git(
        f.target,
        "-c",
        "maintenance.auto=false",
        "commit",
        "-qm",
        "feat: ignore build output",
      );
      closeOrder(f);
      // The gate recorded what its commands wrote into the clone's base checkout.
      const rowsFor = (name) =>
        readGateChecks(f.orderRoot).filter(
          (row) => row.checkId === `target:target:${name}`,
        );
      assert.deepEqual(rowsFor("test").at(-1).baseCheckoutWrites, []);
      assert.deepEqual(rowsFor("base-write").at(-1).baseCheckoutWrites, [
        ".angular/cache/stray.tsbuildinfo",
      ]);
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
      // The target change merges through another checkout, so the recorded base
      // checkout stays behind the fetched base and its working copy's rules
      // predate the merged .gitignore.
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
      for (const file of [
        "node_modules/pkg/index.js",
        ".nx/cache/entry",
        "dist/out.js",
        ".angular/cache/22/x.tsbuildinfo",
      ])
        write(f.target, file, "output\n");
      assert.ok(existsSync(strayCache));
      assert.match(
        git(f.clone, "ls-files", "--others", "--exclude-standard"),
        /stray\.tsbuildinfo/u,
      );
      // Every lane the close opens lives under the system temporary root; the
      // fixture points that root at its own directory and expects it empty.
      const laneRoot = join(f.base, "lanes");
      mkdirSync(laneRoot);
      const close = (...args) =>
        f.call(f.main, f.main, "release", ["close", "WO-999", ...args], {
          TMPDIR: laneRoot,
        });
      // A stray .env already ignored by the base still reaches the fetched
      // tree's judgment and refuses before cleanup or publication.
      const baseBefore = git(f.clone, "rev-parse", "HEAD");
      write(f.clone, ".env", "SECRET=1\n");
      const refusedBase = close("--publish");
      assert.notEqual(refusedBase.status, 0);
      assert.match(
        refusedBase.stderr,
        /target clone base main has undeclared ignored material; source retained: \.env\. Declare it disposable in the registration or remove it/u,
      );
      assert.ok(existsSync(strayCache));
      assert.equal(git(f.clone, "rev-parse", "HEAD"), baseBefore);
      assert.equal((refusedBase.stderr.match(/\.env/gu) ?? []).length, 1);
      assert.ok(existsSync(join(f.clone, ".env")));
      assert.ok(existsSync(f.target));
      assert.deepEqual(releases(), {});
      rmSync(join(f.clone, ".env"));
      // A newly ignored file gets the same registration remedy. A file the
      // incoming tree stops ignoring gets the ordinary untracked-file refusal.
      for (const [file, reason] of [
        ["new.env", /undeclared ignored material; source retained: new\.env/u],
        ["retained-cache/note.txt", /not clean \(retained-cache\/note\.txt\)/u],
      ]) {
        write(f.clone, file, "retained operator material\n");
        const refused = close("--publish");
        assert.notEqual(refused.status, 0);
        assert.match(refused.stderr, reason);
        assert.ok(existsSync(join(f.clone, file)));
        assert.ok(existsSync(f.target));
        assert.ok(existsSync(strayCache));
        assert.equal(git(f.clone, "rev-parse", "HEAD"), baseBefore);
        assert.deepEqual(releases(), {});
        rmSync(join(f.clone, file.split("/")[0]), { recursive: true });
      }
      // Another order's tag on this merged tip is a baseline, never a tag
      // owned by this close. A preview must not reserve its proposed name.
      git(merger, "tag", "-a", "v0.0.0", "-m", "Earlier target order");
      git(merger, "push", "-q", "origin", "refs/tags/v0.0.0");
      const dry = f.ok(close("--dry-run"));
      assert.match(dry, /would-remove/u);
      assert.match(dry, /Target release target: preview; tag v0\.1\.0/u);
      assert.match(dry, /title target v0\.1\.0/u);
      assert.match(
        dry,
        /disposable output would be deleted: \.angular \(1\), \.nx \(1\), dist \(1\), node_modules \(1\), base \.angular \(1\)/u,
      );
      assert.ok(existsSync(join(f.target, "dist/out.js")));
      assert.ok(existsSync(strayCache));
      assert.equal(git(f.clone, "rev-parse", "HEAD"), baseBefore);
      f.config.repositories.target.release.displayName = "Fixture Product";
      write(f.main, "dotln.config.json", JSON.stringify(f.config));
      git(f.main, "add", "dotln.config.json");
      git(
        f.main,
        "-c",
        "maintenance.auto=false",
        "commit",
        "-qm",
        "Name the registered target release",
      );
      git(f.main, "push", "-q", "origin", "main");
      assert.match(f.ok(close("--dry-run")), /title Fixture Product v0\.1\.0/u);
      // A stray .env in the target refuses once before either checkout's
      // output is deleted or the base moves.
      write(f.target, ".env", "SECRET=1\n");
      const refusedTarget = close("--publish");
      assert.notEqual(refusedTarget.status, 0);
      assert.match(
        refusedTarget.stderr,
        /target has undeclared ignored material; source retained: \.env\. Declare it disposable in the registration or remove it; regenerable build output is deleted at close, never moved to scratch\. Then rerun/u,
      );
      assert.equal((refusedTarget.stderr.match(/\.env/gu) ?? []).length, 1);
      assert.match(
        refusedTarget.stdout,
        /disposable output planned for deletion:[^\n]*base \.angular \(1\)/u,
      );
      assert.doesNotMatch(refusedTarget.stdout, /disposable output deleted:/u);
      assert.ok(existsSync(join(f.target, "node_modules/pkg/index.js")));
      assert.ok(existsSync(strayCache));
      assert.equal(git(f.clone, "rev-parse", "HEAD"), baseBefore);
      rmSync(join(f.target, ".env"));
      // A nested repository under a declared root is regenerable output too,
      // and the draft route's ref in the clone goes with the worktree.
      git(join(f.target, "node_modules/pkg"), "init", "-q");
      git(f.clone, "update-ref", "refs/dotln/draft/WO-999", f.baseCommit);
      // The candidate tag name already taken by a commit the merged base does
      // not reach refuses by name; the operator moves nothing by hand here but
      // the fixture removes the stray tag.
      git(merger, "switch", "-qc", "side");
      git(
        merger,
        "-c",
        "maintenance.auto=false",
        "commit",
        "-q",
        "--allow-empty",
        "-m",
        "Side commit",
      );
      git(merger, "tag", "v0.1.0");
      git(merger, "push", "-q", "origin", "refs/tags/v0.1.0");
      const taken = close("--publish");
      assert.notEqual(taken.status, 0);
      assert.match(
        taken.stderr,
        /target release tag v0\.1\.0 exists on github\.com\/dotln-fixture\/target at [0-9a-f]{40}, not the merged main/u,
      );
      assert.ok(
        existsSync(f.target),
        "release preconditions precede target deletion",
      );
      assert.ok(existsSync(join(f.target, "dist/out.js")));
      assert.match(taken.stdout, /disposable output planned for deletion:/u);
      assert.doesNotMatch(taken.stdout, /disposable output deleted:/u);
      git(merger, "push", "-q", "origin", ":refs/tags/v0.1.0");
      // A transport can report failure after the remote has accepted the tag.
      // The retained attempt must still own that name and commit.
      const gitFile = join(forge.bin, "git");
      const gitOriginal = readFileSync(gitFile, "utf8");
      const gitAdapter = readFileSync(forge.gitAdapter, "utf8");
      const disconnectedGit = gitAdapter.replaceAll(
        "process.exit(result.status ?? 1);",
        "if (result.status === 0 && original.includes('push') && original.some(word => word.includes('refs/tags/'))) { console.error('fixture tag push accepted then disconnected'); process.exit(78); } process.exit(result.status ?? 1);",
      );
      assert.notEqual(disconnectedGit, gitAdapter, "push fault is installed");
      // This one fault needs the adapter's post-Git branch; restore the native
      // dispatcher before exercising the remaining release and retry paths.
      writeFileSync(gitFile, disconnectedGit);
      const disconnected = close("--publish");
      writeFileSync(gitFile, gitOriginal);
      assert.notEqual(disconnected.status, 0);
      assert.match(
        disconnected.stderr,
        /fixture tag push accepted then disconnected/u,
      );
      const attemptFile = docPath(
        f.main,
        "control",
        "local/retained/WO-999/release-close.json",
      );
      const attempted = JSON.parse(readFileSync(attemptFile, "utf8"));
      assert.equal(attempted.publication.target.tagOutcome, "published");
      assert.equal(attempted.publication.target.tag, "v0.1.0");
      assert.equal(
        git(join(f.base, "target.git"), "rev-parse", "v0.1.0^{commit}"),
        attempted.publication.target.commit,
      );
      assert.deepEqual(releases(), {});
      // A Release failure after tag publication retains the tag's commit for
      // retries. Moving that tag must not create a Release or finish cleanup.
      const ghFile = join(forge.bin, "gh");
      const ghOriginal = readFileSync(ghFile, "utf8");
      writeFileSync(
        ghFile,
        ghOriginal.replace(
          "const args = process.argv.slice(2);",
          "const args = process.argv.slice(2); if (args[0] === 'release' && args[1] === 'create') { console.error('simulated release failure'); process.exit(77); }",
        ),
      );
      const interrupted = close("--publish");
      assert.notEqual(interrupted.status, 0);
      assert.match(
        interrupted.stderr,
        /tag published; GitHub Release not created/u,
      );
      assert.match(
        interrupted.stdout,
        /Target release target: partially-published/u,
      );
      assert.match(interrupted.stdout, /blocker \(publication\)/u);
      writeFileSync(ghFile, ghOriginal);
      const remote = join(f.base, "target.git");
      const merged = git(remote, "rev-parse", "main");
      const originConfig = readFileSync(f.env.GIT_CONFIG_GLOBAL, "utf8");
      const foreignUrl = "https://github.com/dotln-fixture/another.git";
      writeFileSync(
        f.env.GIT_CONFIG_GLOBAL,
        `${originConfig}\n[url "${remote}"]\n\tinsteadOf = ${foreignUrl}\n`,
      );
      git(f.clone, "config", "remote.origin.pushurl", foreignUrl);
      const foreignOrigin = close("--publish");
      assert.notEqual(foreignOrigin.status, 0);
      assert.match(
        foreignOrigin.stderr,
        /target release origin differs from the recorded origin/u,
      );
      assert.deepEqual(releases(), {});
      assert.equal(git(remote, "rev-parse", "v0.1.0^{commit}"), merged);
      git(f.clone, "config", "--unset", "remote.origin.pushurl");
      writeFileSync(f.env.GIT_CONFIG_GLOBAL, originConfig);
      git(remote, "update-ref", "refs/tags/v0.1.0", baseBefore);
      const moved = close("--publish");
      assert.notEqual(moved.status, 0);
      assert.match(moved.stderr, /not the recorded release commit/u);
      assert.equal(git(remote, "rev-parse", "v0.1.0^{commit}"), baseBefore);
      assert.deepEqual(releases(), {});
      assert.ok(existsSync(f.orderRoot));
      for (let attempt = 0; attempt < 9; attempt++) {
        const preview = close("--dry-run");
        assert.notEqual(preview.status, 0);
        assert.match(preview.stderr, /not the recorded release commit/u);
      }
      // Advancing the base and removing the tag cannot retarget the retry:
      // restore the recorded commit, then finish the one pending Release.
      git(merger, "switch", "-q", "main");
      git(
        merger,
        "-c",
        "maintenance.auto=false",
        "commit",
        "-q",
        "--allow-empty",
        "-m",
        "Later target change",
      );
      git(merger, "push", "-q", "origin", "main");
      git(f.clone, "fetch", "-q", "--no-tags", "--refmap=", remote, "main");
      git(
        f.clone,
        "update-ref",
        "refs/remotes/origin/main",
        git(f.clone, "rev-parse", "FETCH_HEAD"),
      );
      git(remote, "update-ref", "-d", "refs/tags/v0.1.0");
      const published = f.ok(close("--publish"));
      assert.match(
        published,
        /disposable output deleted: \.angular \(1\), \.nx \(1\), dist \(1\), node_modules \(1\), base \.angular \(1\); advisory/u,
      );
      assert.match(
        published,
        /advisory: gate commands wrote into the base checkout: \.angular\/cache\/stray\.tsbuildinfo/u,
      );
      assert.match(
        published,
        /Target release target: published; tag v0\.1\.0; GitHub Release created/u,
      );
      assert.equal(existsSync(f.target), false);
      assert.equal(existsSync(join(f.clone, ".angular")), false);
      assert.equal(git(f.clone, "for-each-ref", "refs/dotln/draft"), "");
      // The host keeps its writer-transition directory under the temporary
      // root; every lane the close opened is gone.
      assert.deepEqual(
        readdirSync(laneRoot).filter((name) =>
          /^dotln-(target|release)-/u.test(name),
        ),
        [],
      );
      assert.notEqual(git(remote, "rev-parse", "main"), merged);
      assert.equal(git(remote, "rev-parse", "v0.1.0^{commit}"), merged);
      assert.equal(git(remote, "cat-file", "-t", "v0.1.0"), "tag");
      const forgeState = JSON.parse(readFileSync(forge.state, "utf8"));
      assert.equal(
        forgeState.releases["v0.1.0"].name,
        "Fixture Product v0.1.0",
      );
      assert.match(
        git(remote, "for-each-ref", "--format=%(contents)", "refs/tags/v0.1.0"),
        /^Fixture Product v0\.1\.0\n/u,
      );
      assert.equal(
        forgeState.releases["v0.1.0"].repo,
        "github.com/dotln-fixture/target",
      );
      // The legacy body, byte for byte: the order has no objective paragraph.
      const legacyBody = `WO-999 — target lifecycle fixture\n\nNo objective paragraph was found in the work-order authority.\n\nClosed by WO-999; merged main at ${merged}.\n`;
      assert.equal(forgeState.releases["v0.1.0"].body, legacyBody);
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
      assert.deepEqual(record.publication.target, {
        repositoryId: "target",
        policy: "declared",
        outcome: "published",
        tag: "v0.1.0",
        release: "created",
        classification: "minor",
        latest: "v0.0.0",
        commit: merged,
        tagOutcome: "published",
        title: "Fixture Product v0.1.0",
        origin: "github.com/dotln-fixture/target",
        body: {
          source: "objective",
          digest: `sha256:${createHash("sha256").update(legacyBody).digest("hex")}`,
          review: null,
          confirmation: null,
        },
      });
      assert.deepEqual(record.targetCleanup.disposable, {
        target: [
          { path: ".angular", files: 1 },
          { path: ".nx", files: 1 },
          { path: "dist", files: 1 },
          { path: "node_modules", files: 1 },
        ],
        base: [{ path: ".angular", files: 1 }],
      });
      assert.deepEqual(record.targetCleanup.baseCheckoutWrites, [
        ".angular/cache/stray.tsbuildinfo",
      ]);
      // A retry reports current and publishes nothing twice.
      assert.match(
        f.ok(close("--publish")),
        /Target release target: current; tag v0\.1\.0; GitHub Release existing/u,
      );
      assert.equal(
        Object.keys(JSON.parse(readFileSync(forge.state, "utf8")).releases)
          .length,
        1,
      );
    },
    { baseIgnore: ".env\nretained-cache/\n" },
  ));

// The declared-release fixture of WO-227: an order header naming the body
// source, reviewed notes on the order branch, and the merges a close reads.
const releaseFixture = (f, { header = "", notes = null } = {}) => {
  const forge = publicationSetup(f);
  f.config.repositories.target.release = {
    policy: "declared",
    displayName: "Fixture Product",
  };
  f.config.repositories.target.authorityProfile.allowedEffects.push(
    "release.close",
  );
  write(f.main, "dotln.config.json", JSON.stringify(f.config));
  write(
    f.main,
    "packages/skeleton/loadouts/grants.json",
    JSON.stringify([
      publicationGrant,
      {
        ...publicationGrant,
        grantId: "operator.target-release",
        effects: ["release.close"],
        operations: ["release.close"],
        reason: "Operator grant for the fixture target's release",
      },
    ]),
  );
  const orderText = (notesHeader) =>
    `# WO-999 — target lifecycle fixture\n\n**Model:** any.\n**Effort:** executor any; verifier any; reviewer any.\n**Repository:** target @ ${f.baseCommit}\n**Target release classification:** minor\n${notesHeader}\n**Objective:** The fixture's objective paragraph.\n`;
  write(f.main, f.order, orderText(header));
  git(f.main, "add", "-A");
  git(
    f.main,
    "-c",
    "maintenance.auto=false",
    "commit",
    "-qm",
    "test: declare a target release",
  );
  git(f.main, "push", "-q", "origin", "main");
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
    "feat: fixture change",
  );
  closeOrder(f);
  if (notes !== null)
    write(f.orderRoot, "records/final-reviews/WO-999/RELEASE-NOTES.md", notes);
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
  const laneRoot = join(f.base, "lanes");
  mkdirSync(laneRoot);
  const remote = join(f.base, "target.git");
  const amendMain = (path, text, message) => {
    write(f.main, path, text);
    git(f.main, "add", "-A");
    git(f.main, "-c", "maintenance.auto=false", "commit", "-qm", message);
    git(f.main, "push", "-q", "origin", "main");
  };
  return {
    forge,
    remote,
    merged: git(remote, "rev-parse", "main"),
    orderText,
    amendMain,
    close: (...args) =>
      f.call(f.main, f.main, "release", ["close", "WO-999", ...args], {
        TMPDIR: laneRoot,
      }),
    releases: () =>
      existsSync(forge.state)
        ? JSON.parse(readFileSync(forge.state, "utf8")).releases
        : {},
    record: () =>
      JSON.parse(
        readFileSync(
          docPath(
            f.main,
            "control",
            "local/retained/WO-999/release-close.json",
          ),
          "utf8",
        ),
      ),
    tagMessage: () =>
      git(remote, "for-each-ref", "--format=%(contents)", "refs/tags/v0.1.0"),
    tags: () => git(remote, "for-each-ref", "refs/tags"),
  };
};
const notesText = (overview) =>
  `## Release overview\n\n${overview}\n\n## Read before upgrading\n\nNone.\n\n## Substantive changes\n\nOne change, see [D001](../../evidence/WO-999/decisions.md#wo-999-d001).\n\n## Progressive polish\n\nNone.\n\n## Evidence and compatibility\n\nSee [the order](../../work-orders/WO-999-fixture.md) and [the plan](../../planning/plan.md).\n`;
const digestOf = (text) =>
  `sha256:${createHash("sha256").update(text).digest("hex")}`;

test("WO-227 criterion 7: the objective header keeps the legacy Release text byte for byte, and a Release published with it stays current once the order names the reviewed notes", () =>
  withFixture((f) => {
    const r = releaseFixture(f, {
      header: "**Target release notes:** objective\n",
      notes: notesText("The fixture product gains a board."),
    });
    const closeLine = `Closed by WO-999; merged main at ${r.merged}.`;
    const legacyBody = `WO-999 — target lifecycle fixture\n\nThe fixture's objective paragraph.\n\n${closeLine}\n`;
    const legacy = f.ok(r.close("--publish"));
    assert.match(
      legacy,
      /Target release body: objective; no review items; digest sha256:[0-9a-f]{64}\./u,
    );
    assert.equal(r.releases()["v0.1.0"].body, legacyBody);
    assert.equal(
      r.tagMessage(),
      `Fixture Product v0.1.0\n\nWO-999 — target lifecycle fixture\n\n${closeLine}`,
    );
    assert.deepEqual(r.record().publication.target.body, {
      source: "objective",
      digest: digestOf(legacyBody),
      review: null,
      confirmation: null,
    });
    // A release made by an older installation has no body binding yet. The
    // first recheck must bind the observed legacy bytes, then keep that binding.
    const unbound = r.record();
    delete unbound.publication.target.body;
    writeFileSync(
      docPath(f.main, "control", "local/retained/WO-999/release-close.json"),
      JSON.stringify(unbound),
    );
    // The order then names the reviewed notes: the published Release is
    // immutable, so the recheck admits its recorded body and publishes nothing.
    r.amendMain(
      f.order,
      r.orderText("**Target release notes:** reviewed\n"),
      "docs: carry the reviewed notes on the Release",
    );
    for (let check = 0; check < 3; check++) {
      const rechecked = f.ok(r.close("--publish"));
      assert.match(
        rechecked,
        /Target release target: current; tag v0\.1\.0; GitHub Release existing/u,
      );
      assert.equal(r.releases()["v0.1.0"].body, legacyBody);
      assert.deepEqual(r.record().publication.target.body, {
        source: "objective",
        digest: digestOf(legacyBody),
        review: null,
        confirmation: null,
      });
    }
    assert.equal(Object.keys(r.releases()).length, 1);
  }));

test("WO-227 criterion 7: the reviewed header refuses an absent or invalid notes file before any tag push, carries the rendered notes with a confirmed review, binds the body's digest and refuses changed notes on retry", () =>
  withFixture((f) => {
    const r = releaseFixture(f, {
      header: "**Target release notes:** reviewed\n",
    });
    const notesPath = "records/final-reviews/WO-999/RELEASE-NOTES.md";
    const absent = r.close("--publish");
    assert.notEqual(absent.status, 0);
    assert.match(
      absent.stderr,
      /RELEASE-NOTES\.md: \*\*Target release notes:\*\* reviewed needs the reviewed notes at the merged revision, and the file is absent/u,
    );
    assert.equal(r.tags(), "");
    assert.deepEqual(r.releases(), {});
    assert.ok(existsSync(f.target), "the refusal precedes the cleanup");
    r.amendMain(
      notesPath,
      "## Release overview\n\nNo second heading.\n",
      "docs: invalid notes",
    );
    const invalid = r.close("--publish");
    assert.notEqual(invalid.status, 0);
    assert.match(invalid.stderr, /missing required heading/u);
    assert.equal(r.tags(), "");
    assert.deepEqual(r.releases(), {});
    r.amendMain(
      notesPath,
      notesText("The fixture product gains a launchpad board."),
      "docs: reviewed notes",
    );
    const merged = git(r.remote, "rev-parse", "main");
    const dry = f.ok(r.close("--dry-run"));
    assert.match(
      dry,
      /Target release body: reviewed; 1 review item waits for --confirm-terms sha256:[0-9a-f]{64}: release-body: vocabulary\.review: launchpad \(line 5, reviewed notes\)/u,
    );
    assert.match(dry, /Target release target: preview; tag v0\.1\.0/u);
    assert.equal(r.tags(), "");
    const unconfirmed = r.close("--publish");
    assert.notEqual(unconfirmed.status, 0);
    assert.match(
      unconfirmed.stderr,
      /target release refused: outward lint: 1 review item waits for the reviewer: release-body: vocabulary\.review: launchpad \(line 5, reviewed notes\)/u,
    );
    assert.equal(r.tags(), "");
    const digest = /sha256:[0-9a-f]{64}/u.exec(unconfirmed.stderr)[0];
    // The tag is pushed but the Release fails: the attempt binds the body's
    // digest and still owes the Release.
    const ghFile = join(r.forge.bin, "gh");
    const ghOriginal = readFileSync(ghFile, "utf8");
    writeFileSync(
      ghFile,
      ghOriginal.replace(
        "const args = process.argv.slice(2);",
        "const args = process.argv.slice(2); if (args[0] === 'release' && args[1] === 'create') { console.error('simulated release failure'); process.exit(77); }",
      ),
    );
    const partial = r.close("--publish", "--confirm-terms", digest);
    writeFileSync(ghFile, ghOriginal);
    assert.notEqual(partial.status, 0);
    assert.match(partial.stderr, /tag published; GitHub Release not created/u);
    const bound = r.record().publication.target;
    assert.equal(bound.tagOutcome, "published");
    assert.equal(bound.body.digest, digest);
    assert.equal(bound.body.confirmation.confirmedDigest, digest);
    // Changed notes differ from the bytes the attempt bound.
    r.amendMain(
      notesPath,
      notesText("The fixture product gains a launchpad board, revised."),
      "docs: revised notes",
    );
    const changed = r.close("--publish");
    assert.notEqual(changed.status, 0);
    assert.match(
      changed.stderr,
      /target release body \(reviewed\) differs from the bytes the recorded attempt bound/u,
    );
    assert.deepEqual(r.releases(), {});
    // With the bound bytes restored, the recorded confirmation stands and the
    // Release is created from them.
    r.amendMain(
      notesPath,
      notesText("The fixture product gains a launchpad board."),
      "docs: restore the reviewed notes",
    );
    const published = f.ok(r.close("--publish"));
    assert.match(
      published,
      /Target release body: reviewed; 1 review item confirmed under sha256:[0-9a-f]{64}; journal row (?:recorded|unobserved)\./u,
    );
    assert.match(
      published,
      /Target release target: published; tag v0\.1\.0; GitHub Release created/u,
    );
    const link = (path) =>
      `https://github.com/dotln-fixture/target/blob/${merged}/${path}`;
    const body = `## Release overview\n\n**WO-999 — target lifecycle fixture**\n\nThe fixture product gains a launchpad board.\n\n## Read before upgrading\n\nNone.\n\n## Substantive changes\n\nOne change, see [D001](${link("docs/evidence/WO-999/decisions.md")}#wo-999-d001).\n\n## Progressive polish\n\nNone.\n\n## Evidence and compatibility\n\nSee [the order](${link("docs/work-orders/WO-999-fixture.md")}) and the plan.\n\nClosed by WO-999; merged main at ${merged}.\n`;
    assert.equal(r.releases()["v0.1.0"].body, body);
    assert.equal(digest, digestOf(body));
    assert.equal(
      r.tagMessage(),
      `Fixture Product v0.1.0\n\nWO-999 — target lifecycle fixture\n\nClosed by WO-999; merged main at ${merged}.`,
    );
    const recorded = r.record().publication.target.body;
    assert.equal(recorded.source, "reviewed");
    assert.equal(recorded.digest, digest);
    assert.equal(recorded.confirmation.confirmedDigest, digest);
    assert.equal(recorded.confirmation.matches, 1);
    assert.deepEqual(Object.keys(recorded.confirmation.attestation).sort(), [
      "effort",
      "harness",
      "model",
      "role",
      "source",
    ]);
    // A retry of the same bytes reports current.
    assert.match(
      f.ok(r.close("--publish")),
      /Target release target: current; tag v0\.1\.0; GitHub Release existing/u,
    );
    // Later notes are reviewed for this check, but an existing Release keeps
    // its published source, digest and confirmation across every retry.
    r.amendMain(
      notesPath,
      notesText("The fixture product gains a launchpad board, revised again."),
      "docs: later notes",
    );
    const later = r.close("--publish");
    assert.notEqual(later.status, 0);
    assert.match(later.stderr, /1 review item waits for the reviewer/u);
    const laterDigest = /sha256:[0-9a-f]{64}/u.exec(later.stderr)[0];
    assert.notEqual(laterDigest, digest);
    for (let check = 0; check < 3; check++) {
      assert.match(
        f.ok(r.close("--publish", "--confirm-terms", laterDigest)),
        /Target release target: current; tag v0\.1\.0; GitHub Release existing/u,
      );
      assert.deepEqual(r.record().publication.target.body, recorded);
    }
    // A transient metadata failure must not turn a completed publication
    // into an incomplete attempt bound to the unpublished candidate.
    writeFileSync(
      ghFile,
      ghOriginal.replace(
        "const args = process.argv.slice(2);",
        "const args = process.argv.slice(2); if (args[0] === 'release' && args[1] === 'view') { console.error('simulated metadata failure'); process.exit(77); }",
      ),
    );
    const interrupted = r.close("--publish", "--confirm-terms", laterDigest);
    writeFileSync(ghFile, ghOriginal);
    assert.notEqual(interrupted.status, 0);
    assert.match(interrupted.stderr, /simulated metadata failure/u);
    assert.deepEqual(r.record().publication.target.body, recorded);
    f.ok(r.close("--publish", "--confirm-terms", laterDigest));
    assert.deepEqual(r.record().publication.target.body, recorded);
    assert.equal(Object.keys(r.releases()).length, 1);
    assert.equal(r.releases()["v0.1.0"].body, body);
  }));

test("WO-227 criterion 7: only the bytes the renderer writes for a moved record are the Release's kit frame; a target URL or a link fragment the notes' author wrote is judged like the rest of the notes, whatever its commit or bytes", () =>
  withFixture((f) => {
    const r = releaseFixture(f, {
      header: "**Target release notes:** reviewed\n",
      notes: notesText("The fixture product gains a board."),
    });
    const notesPath = "records/final-reviews/WO-999/RELEASE-NOTES.md";
    const at = (revision, path) =>
      `https://github.com/dotln-fixture/target/blob/${revision}/${path}`;
    const refused = (overview, pattern) => {
      r.amendMain(notesPath, notesText(overview), "docs: author a target link");
      const result = r.close("--publish");
      assert.notEqual(result.status, 0);
      assert.match(result.stderr, pattern);
      assert.equal(
        result.stderr.match(/identifier\.launchpad/gu).length,
        1,
        result.stderr,
      );
      assert.equal(r.tags(), "", "the refusal precedes any tag push");
      assert.deepEqual(r.releases(), {});
    };
    // A path neither the target nor the moved records hold refuses at
    // another revision and at the tagged commit alike.
    for (const revision of ["a".repeat(40), r.merged])
      refused(
        `See [the implementation](${at(revision, "docs/WO-006-notes.md")}).`,
        /target release refused: outward lint: release-body refused: identifier\.launchpad: WO-006 \(line 5, reviewed notes\)/u,
      );
    // The exact bytes of the order's record link refuse where the author
    // wrote them, while the link the renderer writes on line 21 is not
    // reported.
    refused(
      `See [the order](${at(r.merged, "docs/work-orders/WO-999-fixture.md")}).`,
      /release-body refused: identifier\.launchpad: WO-999 \(line 5, reviewed notes\)/u,
    );
    // The fragment a record link carries is the author's: another order's
    // identifier there refuses, while the closing order's own anchor, which
    // the close line and the moved decisions already publish, passes.
    refused(
      "See [a decision](../../evidence/WO-999/decisions.md#wo-006-d001).",
      /release-body refused: identifier\.launchpad: wo-006-d001 \(line 5, reviewed notes\)/u,
    );
    // A query is the author's too, and only a fragment names an anchor.
    refused(
      "See [the decisions](../../evidence/WO-999/decisions.md?plain=WO-999).",
      /release-body refused: identifier\.launchpad: WO-999 \(line 5, reviewed notes\)/u,
    );
    r.amendMain(
      notesPath,
      notesText(
        "See [the decision](../../evidence/WO-999/decisions.md#wo-999-d001--the-launchpad-board).",
      ),
      "docs: carry a worded anchor",
    );
    assert.match(
      f.ok(r.close("--dry-run")),
      /Target release body: reviewed; 1 review item waits for --confirm-terms sha256:[0-9a-f]{64}: release-body: vocabulary\.review: launchpad \(line 5, reviewed notes\)\./u,
    );
    // An authored address is read for review words, in its path and in the
    // target's own owner name alike; each is a review item, never a refusal.
    r.amendMain(
      notesPath,
      notesText(`See [the board](${at(r.merged, "docs/launchpad-board.md")}).`),
      "docs: author a worded target link",
    );
    assert.match(
      f.ok(r.close("--dry-run")),
      /Target release body: reviewed; 2 review items wait for --confirm-terms sha256:[0-9a-f]{64}: release-body: vocabulary\.review: DotLn \(line 5, reviewed notes\); release-body: vocabulary\.review: launchpad \(line 5, reviewed notes\)\./u,
    );
    // A listed term that runs from a record link's written path into the
    // fragment or query the author wrote holds the author's bytes, so the
    // close waits for the reviewer before any tag.
    const vocabularyPath = docPath(
      f.main,
      "control",
      "outward-vocabulary.json",
    );
    const vocabularyFile = vocabularyPath.slice(f.main.length + 1);
    const vocabularyText = readFileSync(vocabularyPath, "utf8");
    const vocabulary = JSON.parse(vocabularyText);
    delete vocabulary.terms;
    vocabulary.reviewTerms = ["md launchpad"];
    r.amendMain(
      vocabularyFile,
      JSON.stringify(vocabulary),
      "docs: list a compound review term",
    );
    for (const rest of ["#launchpad", "?launchpad"]) {
      r.amendMain(
        notesPath,
        notesText(
          `See [the record](../../evidence/WO-999/decisions.md${rest}).`,
        ),
        "docs: carry an authored fragment",
      );
      const result = r.close("--publish");
      assert.notEqual(result.status, 0);
      assert.match(
        result.stderr,
        /target release refused: outward lint: 1 review item waits for the reviewer: release-body: vocabulary\.review: md launchpad \(line 5, record link\)/u,
      );
      assert.equal(r.tags(), "", "the refusal precedes any tag push");
      assert.deepEqual(r.releases(), {});
    }
    r.amendMain(
      vocabularyFile,
      vocabularyText,
      "docs: restore the review list",
    );
    // Control: the renderer's own record links, whose order paths carry the
    // closing order's identifier, publish with no finding.
    r.amendMain(
      notesPath,
      notesText("The fixture product gains a board."),
      "docs: restore the reviewed notes",
    );
    assert.match(
      f.ok(r.close("--publish")),
      /Target release body: reviewed; no review items; digest sha256:[0-9a-f]{64}\./u,
    );
    const body = r.releases()["v0.1.0"].body;
    assert.ok(
      body.includes(
        `[D001](${at(r.merged, "docs/evidence/WO-999/decisions.md")}#wo-999-d001)`,
      ),
      body,
    );
    assert.ok(
      body.includes(
        `[the order](${at(r.merged, "docs/work-orders/WO-999-fixture.md")})`,
      ),
      body,
    );
  }));

test("WO-221 a registration without a release policy closes with no-release and the literal fallback writes and removes one order's rules", () =>
  withFixture((f) => {
    publicationSetup(f);
    const operatorRules = [
      "Bash(npm test)",
      "Bash(gh pr view --repo github.com/dotln-fixture/target *)",
    ];
    f.config.repositories.target.hostRules = "literal";
    write(f.main, "dotln.config.json", JSON.stringify(f.config));
    git(f.main, "add", "-A");
    git(
      f.main,
      "-c",
      "maintenance.auto=false",
      "commit",
      "-qm",
      "test: opt into the literal fallback",
    );
    git(f.main, "push", "-q", "origin", "main");
    write(
      f.main,
      ".claude/settings.local.json",
      JSON.stringify({ permissions: { allow: operatorRules } }),
    );
    f.mapClone();
    const started = f.start();
    assert.match(started, /Codex workspace-write session: codex --add-dir/u);
    assert.match(started, /copilot --allow-tool 'shell\(/u);
    assert.ok(started.includes(`${f.orderRoot}/scripts/worktree.mjs`));
    assert.doesNotMatch(started, /shell\(git|shell\(gh|shell\(npm/u);
    assert.match(started, /Literal rules written for WO-999/u);
    const local = JSON.parse(
      readFileSync(join(f.main, ".claude/settings.local.json"), "utf8"),
    );
    const rules = local.permissions.allow;
    assert.ok(
      rules.includes(
        `Bash(${process.execPath} ${f.orderRoot}/scripts/worktree.mjs publish WO-999 --target-worktree *)`,
      ),
    );
    assert.deepEqual(
      rules.filter((rule) => rule.startsWith("Bash(gh")),
      operatorRules.filter((rule) => rule.startsWith("Bash(gh")),
    );
    const codex = readFileSync(
      join(f.main, ".codex/rules/dotln-WO-999.rules"),
      "utf8",
    );
    assert.match(codex, /^# dotln:WO-999:start$/mu);
    assert.ok(codex.includes(JSON.stringify(process.execPath)));
    assert.ok(
      codex.includes(JSON.stringify(`${f.orderRoot}/scripts/worktree.mjs`)),
    );
    assert.doesNotMatch(codex, /"git"|"gh"|"npm"/u);
    assert.match(codex, /decision = "allow"/u);
    assert.doesNotMatch(codex, /elsewhere/u);
    // The sidecar's rules are current while the order's worktree is registered.
    assert.deepEqual(staleOrderHostRules(f.main), []);
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
    git(
      f.clone,
      "merge",
      "-q",
      "--no-ff",
      "-m",
      "Merge target change",
      "wo-999",
    );
    // The clone's origin is the forge URL; the test pushes to the bare path.
    git(f.clone, "push", "-q", join(f.base, "target.git"), "main:main");
    const closed = f.ok(f.close("--publish"));
    assert.match(closed, /no-release/u);
    assert.doesNotMatch(closed, /Target release/u);
    const after = JSON.parse(
      readFileSync(join(f.main, ".claude/settings.local.json"), "utf8"),
    );
    assert.deepEqual(after.permissions.allow, operatorRules);
    assert.equal(
      existsSync(join(f.main, ".codex/rules/dotln-WO-999.rules")),
      false,
    );
    const record = JSON.parse(
      readFileSync(
        docPath(f.main, "control", "local/retained/WO-999/release-close.json"),
        "utf8",
      ),
    );
    assert.equal(record.targetCleanup.hostRules, "removed");
    assert.equal(record.publication.target.policy, "no-release");
    assert.deepEqual(staleOrderHostRules(f.main), []);
    // A sidecar left behind for an order with no target worktree is stale and
    // names its remedy.
    write(
      f.main,
      "records/state/local/host-rules/WO-998.json",
      JSON.stringify({
        schemaVersion: 1,
        workOrderId: "WO-998",
        repositoryId: "target",
        target: f.target,
        claude: ["Bash(git -C /nowhere push -u origin wo-998)"],
        codex: ".codex/rules/dotln-WO-998.rules",
      }),
    );
    const stale = staleOrderHostRules(f.main);
    assert.equal(stale.length, 1);
    assert.equal(stale[0].workOrderId, "WO-998");
    assert.match(stale[0].reason, /no registered target worktree/u);
    assert.match(
      stale[0].remedy,
      /worktree\.mjs' host-rules --remove WO-998$/u,
    );
    assert.match(
      f.ok(f.worktree("host-rules", "--remove", "WO-998")),
      /Removed the literal host rules of WO-998/u,
    );
    assert.deepEqual(staleOrderHostRules(f.main), []);
  }));
