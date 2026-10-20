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
    git(f.main, "commit", "-qm", "docs: instance release claim");
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
      git(f.target, "commit", "-qm", "feat: ignore build output");
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
      // The target change merges through another checkout, so the recorded base
      // checkout stays behind the fetched base and its working copy's rules
      // predate the merged .gitignore.
      const merger = join(f.base, "merger");
      git(f.base, "clone", "-q", join(f.base, "target.git"), merger);
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
      git(f.main, "commit", "-qm", "Name the registered target release");
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
      git(merger, "commit", "-q", "--allow-empty", "-m", "Side commit");
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
      writeFileSync(
        gitFile,
        gitOriginal.replaceAll(
          "process.exit(result.status ?? 1);",
          "if (result.status === 0 && original.includes('push') && original.some(word => word.includes('refs/tags/'))) { console.error('fixture tag push accepted then disconnected'); process.exit(78); } process.exit(result.status ?? 1);",
        ),
      );
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
      git(merger, "commit", "-q", "--allow-empty", "-m", "Later target change");
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
      assert.match(
        forgeState.releases["v0.1.0"].body,
        /target lifecycle fixture[\s\S]*Closed by WO-999; merged main at/u,
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
    git(f.main, "commit", "-qm", "test: opt into the literal fallback");
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
