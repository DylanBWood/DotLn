import { absoluteBodyLinks, relativeLinkFailures } from "./lib/github-body.mjs";
import { readDecisions, writeDecisionsIndex } from "./lib/meta.mjs";
import { syncFollowups } from "./lib/planning-followups.mjs";
import { readTargetRecord } from "./lib/target-record-reader.mjs";
import test from "node:test";
import assert from "node:assert/strict";
import {
  chmodSync,
  existsSync,
  mkdirSync,
  readFileSync,
  renameSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { docPath } from "./lib/config.mjs";
import { releaseCloseCommand, runGit } from "./lib/git.mjs";
import { write } from "./lib/helpers.mjs";
import { readControl } from "./lib/control-store.mjs";
import { publicationGrant } from "./test-target-publication-fixture.mjs";
import { createHash } from "node:crypto";
import { appendEvent } from "../packages/kernel/dist/src/index.js";
import {
  git,
  recordTreeSnapshot,
  actor,
  actorArgs,
  profile,
  fixture,
  withFixture,
  closeOrder,
  publicationSetup,
  launchpadCommands,
} from "./lib/target-worktree-fixture.mjs";

test("target records preserve reviewed reports, refuse changed inputs and publish only the bound records commit", () =>
  withFixture((f) => {
    const forge = publicationSetup(f);
    f.mapClone();
    f.start();
    write(f.target, "reviewed.txt", "Reviewed change.\n");
    write(f.target, ".gitignore", "deps/\n");
    git(f.target, "add", "reviewed.txt", ".gitignore");
    git(f.target, "commit", "-qm", "fix: preserve reviewed text");
    const reviewed = git(f.target, "rev-parse", "HEAD");
    const reports = closeOrder(f);
    const decisions = "records/evidence/WO-999/decisions.md";
    write(
      f.orderRoot,
      decisions,
      "# Decisions\n\nThe fixture keeps the reviewed behavior at <home>/x.\n",
    );
    const segment = docPath(f.orderRoot, "orders", "WO-999.jsonl");
    const before = readFileSync(segment);
    const targetBefore = recordTreeSnapshot(f.target),
      refsBefore = git(f.target, "show-ref"),
      originBefore = git(join(f.base, "target.git"), "show-ref");
    const refuse = (pattern) => {
      const result = f.resume(["target-records", ...actorArgs]);
      assert.notEqual(result.status, 0);
      assert.match(result.stderr, pattern);
      assert.deepEqual(readFileSync(segment), before);
      assert.equal(git(f.target, "rev-parse", "HEAD"), reviewed);
      assert.equal(git(f.target, "status", "--porcelain"), "");
      assert.deepEqual(recordTreeSnapshot(f.target), targetBefore);
      assert.equal(git(f.target, "show-ref"), refsBefore);
      assert.equal(git(join(f.base, "target.git"), "show-ref"), originBefore);
      assert.equal(existsSync(forge.log), false);
      return result;
    };
    const report = readFileSync(reports.verification);
    writeFileSync(reports.verification, "Changed report bytes.\n");
    refuse(/report hash differs/u);
    writeFileSync(reports.verification, report);
    const decisionBytes = readFileSync(join(f.orderRoot, decisions));
    write(
      f.orderRoot,
      decisions,
      decisionBytes.toString("utf8").replace("<home>", "/Users/fixture-user"),
    );
    const privateDecision = refuse(
      /docs\/evidence\/WO-999\/decisions\.md:3: private absolute path/u,
    );
    assert.doesNotMatch(
      privateDecision.stdout + privateDecision.stderr,
      /fixture-user/u,
    );
    assert.match(privateDecision.stderr, /<home>/u);
    write(f.orderRoot, decisions, "# Decisions\n\nPrivate Fixture Term\n");
    refuse(/local-terms.*line/u);
    writeFileSync(join(f.orderRoot, decisions), decisionBytes);
    renameSync(
      join(f.orderRoot, decisions),
      join(f.orderRoot, `${decisions}.saved`),
    );
    symlinkSync(
      `${decisions.split("/").at(-1)}.saved`,
      join(f.orderRoot, decisions),
    );
    refuse(/contained regular file/u);
    rmSync(join(f.orderRoot, decisions));
    renameSync(
      join(f.orderRoot, `${decisions}.saved`),
      join(f.orderRoot, decisions),
    );
    f.ok(f.resume(["target-records", ...actorArgs]));
    const event = readFileSync(segment, "utf8")
      .trim()
      .split("\n")
      .map(JSON.parse)
      .filter((row) => row.type === "TargetRecordsCommitted")
      .at(-1);
    assert.equal(event.parent, reviewed);
    assert.equal(event.root, "docs");
    assert.equal(event.records.length, 4);
    assert.match(
      readFileSync(join(f.target, "docs/evidence/WO-999/decisions.md"), "utf8"),
      /<home>\/x/u,
    );
    assert.equal(
      git(f.target, "rev-list", "--parents", "-n", "1", "HEAD"),
      `${event.commit} ${reviewed}`,
    );
    for (const row of event.records)
      assert.equal(
        createHash("sha256")
          .update(readFileSync(join(f.target, row.path)))
          .digest("hex"),
        row.sha256,
      );
    assert.ok(existsSync(join(f.orderRoot, f.order)));
    assert.ok(!existsSync(join(f.orderRoot, decisions)));
    assert.ok(!existsSync(reports.verification));
    assert.ok(!existsSync(reports.finalReview));
    assert.match(
      f.ok(f.resume(["target-records", ...actorArgs])),
      /Already recorded/u,
    );
    write(
      f.orderRoot,
      "reviewed-body.md",
      "## Result\n\nPreserve reviewed text and its validation.\n",
    );
    git(f.orderRoot, "add", "-A");
    git(f.orderRoot, "commit", "-qm", "docs: preserve validation links");
    const launchpadHead = git(f.orderRoot, "rev-parse", "HEAD");
    const publish = (...args) =>
      f.worktree(
        "publish",
        "WO-999",
        "--target-worktree",
        "--branch",
        "fix/preserve-reviewed-text",
        "--title",
        "fix: preserve reviewed text",
        "--body-file",
        "reviewed-body.md",
        ...args,
      );
    const origin = join(f.base, "target.git"),
      originRefs = git(origin, "show-ref");
    const noPublish = (pattern, options = {}) => {
      const result = f.worktree(
        "publish",
        "WO-999",
        "--target-worktree",
        "--branch",
        options.branch ?? "fix/preserve-reviewed-text",
        "--title",
        options.title ?? "fix: preserve reviewed text",
        "--body-file",
        options.body ?? "reviewed-body.md",
      );
      assert.notEqual(result.status, 0, "invalid publication must refuse");
      assert.match(result.stderr, pattern);
      assert.equal(git(origin, "show-ref"), originRefs);
      assert.equal(
        existsSync(forge.log),
        false,
        "local refusal must precede gh",
      );
      return result;
    };
    const save = (path) => readFileSync(join(f.orderRoot, path));
    const committedMutation = (path, bytes, pattern, root = f.orderRoot) => {
      const original = readFileSync(join(root, path));
      write(root, path, bytes);
      git(root, "add", "-A");
      git(root, "commit", "-qm", "test: invalid publication input");
      noPublish(pattern);
      write(root, path, original);
      git(root, "add", "-A");
      git(root, "commit", "-qm", "test: restore publication input");
    };
    for (const [root, path] of [
      [f.target, "reviewed.txt"],
      [f.target, "untracked.txt"],
      [f.orderRoot, "reviewed-body.md"],
      [f.orderRoot, "untracked.txt"],
    ]) {
      const file = join(root, path),
        original = existsSync(file) ? readFileSync(file) : undefined;
      write(root, path, "dirty fixture input\n");
      const refusal = noPublish(/dirty|uncommitted|untracked|changes|clean/u);
      if (root === f.target) {
        assert.ok(refusal.stderr.includes(path));
        assert.match(
          refusal.stderr,
          /do not add a commit after the passing review/u,
        );
      }
      if (original) writeFileSync(file, original);
      else rmSync(file);
    }
    const committedEvents = readFileSync(segment, "utf8")
      .trim()
      .split("\n")
      .map(JSON.parse);
    for (const field of ["targetSubject", "targetGate", "records"]) {
      const invalid = structuredClone(committedEvents).filter((row) =>
        field === "records" ? row.type !== "TargetRecordsCommitted" : true,
      );
      if (field !== "records") {
        // A historical final review may lack optional bindings; records cannot
        // exist without a subject, so remove that dependent event as well.
        delete invalid.findLast((row) => row.type === "FinalReviewCompleted")[
          field
        ];
        if (field === "targetSubject") {
          delete invalid.findLast((row) => row.type === "FinalReviewCompleted")
            .targetGate;
          invalid.splice(
            invalid.findIndex((row) => row.type === "TargetRecordsCommitted"),
            1,
          );
        }
      }
      committedMutation(
        "records/state/orders/WO-999.jsonl",
        invalid.map((row) => JSON.stringify(row)).join("\n") + "\n",
        /targetSubject|targetGate|TargetRecordsCommitted/u,
      );
    }
    const unfinished = committedEvents.filter(
      (row) =>
        !["FinalReviewCompleted", "TargetRecordsCommitted"].includes(row.type),
    );
    committedMutation(
      "records/state/orders/WO-999.jsonl",
      unfinished.map((row) => JSON.stringify(row)).join("\n") + "\n",
      /no committed passing final review/u,
    );
    const unchangedSubject = structuredClone(committedEvents);
    const unchangedReview = unchangedSubject.findLast(
      (row) => row.type === "FinalReviewCompleted",
    );
    unchangedReview.targetSubject.commit = f.baseCommit;
    unchangedReview.targetGate.commit = f.baseCommit;
    unchangedSubject.findLast(
      (row) => row.type === "TargetRecordsCommitted",
    ).parent = f.baseCommit;
    committedMutation(
      "records/state/orders/WO-999.jsonl",
      unchangedSubject.map(JSON.stringify).join("\n") + "\n",
      /reviewed target commit equals the base/u,
    );
    const badMessage = git(
      f.target,
      "commit-tree",
      `${event.commit}^{tree}`,
      "-p",
      reviewed,
      "-m",
      "docs: record evt_123",
    );
    git(f.target, "update-ref", "refs/heads/wo-999", badMessage);
    const badMessageEvents = structuredClone(committedEvents);
    badMessageEvents.findLast(
      (row) => row.type === "TargetRecordsCommitted",
    ).commit = badMessage;
    committedMutation(
      "records/state/orders/WO-999.jsonl",
      badMessageEvents.map(JSON.stringify).join("\n") + "\n",
      /identifier.runtime/u,
    );
    git(f.target, "update-ref", "refs/heads/wo-999", event.commit);
    const bundlePath = join(f.target, ".claude/target-worker-manifest.json"),
      bundleBytes = readFileSync(bundlePath);
    const bundle = JSON.parse(bundleBytes);
    bundle.installed.push({ path: "reviewed.txt" });
    writeFileSync(bundlePath, JSON.stringify(bundle));
    noPublish(/bundle ownership.*manifest/u);
    writeFileSync(bundlePath, bundleBytes);
    rmSync(bundlePath);
    noPublish(/bundle ownership/u);
    writeFileSync(bundlePath, bundleBytes);
    const changedHead = git(
      f.target,
      "commit-tree",
      `${event.commit}^{tree}`,
      "-p",
      event.commit,
      "-m",
      "docs: later target commit",
    );
    git(f.target, "update-ref", "refs/heads/wo-999", changedHead);
    noPublish(/differs from records commit/u);
    git(f.target, "update-ref", "refs/heads/wo-999", event.commit);
    const config = JSON.parse(save("dotln.config.json"));
    for (const override of [
      { deniedEffects: ["repo.push"] },
      { allowedEffects: ["repo.read"] },
      { expiresAt: 1 },
      { requiredEvidence: ["needed"] },
      { revocationConditions: [{ registryId: "unknown", version: 1 }] },
    ]) {
      const invalid = structuredClone(config);
      Object.assign(invalid.repositories.target.authorityProfile, override);
      committedMutation(
        "dotln.config.json",
        JSON.stringify(invalid),
        /repo.push|pr.open|revocation|authority/u,
        f.main,
      );
    }
    for (const grant of [
      null,
      { ...publicationGrant, grantedBy: "host-policy" },
      { ...publicationGrant, repo: "another" },
      { ...publicationGrant, effects: ["repo.push"] },
      { ...publicationGrant, operations: ["repo.push"] },
    ])
      committedMutation(
        "packages/skeleton/loadouts/grants.json",
        JSON.stringify(grant ? [grant] : []),
        /operator grant|cannot admit/u,
        f.main,
      );
    for (const path of [
      "dotln.config.json",
      "packages/skeleton/loadouts/grants.json",
    ]) {
      const original = readFileSync(join(f.main, path));
      const changed = path === "dotln.config.json" ? JSON.parse(original) : [];
      if (changed.repositories)
        changed.repositories.target.authorityProfile.deniedEffects = [
          "repo.push",
        ];
      write(f.main, path, JSON.stringify(changed));
      noPublish(/main's publication authority.*committed/u);
      writeFileSync(join(f.main, path), original);
    }
    // The order branch commits authority main lacks. The session publication
    // reads only main's committed profile and grant registry, so it refuses
    // before any push while the branch holds a valid grant or profile.
    const onBranchOnly = (path, lacking, pattern) => {
      const granted = readFileSync(join(f.orderRoot, path), "utf8");
      for (const bytes of [lacking, granted]) {
        write(f.orderRoot, path, bytes);
        git(f.orderRoot, "add", "-A");
        git(f.orderRoot, "commit", "-qm", "test: order branch authority");
      }
      committedMutation(path, lacking, pattern, f.main);
      assert.equal(readFileSync(join(f.orderRoot, path), "utf8"), granted);
    };
    onBranchOnly(
      "packages/skeleton/loadouts/grants.json",
      "[]",
      /operator grant naming target/u,
    );
    const unpublishable = structuredClone(config);
    unpublishable.repositories.target.authorityProfile.allowedEffects = [
      "repo.read",
    ];
    onBranchOnly(
      "dotln.config.json",
      JSON.stringify(unpublishable),
      /repo\.push/u,
    );
    const unregistered = structuredClone(config);
    delete unregistered.repositories.target;
    onBranchOnly(
      "dotln.config.json",
      JSON.stringify(unregistered),
      /repository target is not registered in main's committed authority/u,
    );
    git(
      f.target,
      "config",
      "--add",
      "remote.origin.pushurl",
      "https://github.com/dotln-fixture/target.git",
    );
    git(
      f.target,
      "config",
      "--add",
      "remote.origin.pushurl",
      "https://github.com/dotln-fixture/second.git",
    );
    noPublish(/one push URL/u);
    git(f.target, "config", "--unset-all", "remote.origin.pushurl");
    git(
      f.target,
      "config",
      "remote.origin.pushurl",
      "https://example.invalid/owner/repo.git",
    );
    noPublish(/origin differs from the registered target repository/u);
    git(f.target, "config", "--unset-all", "remote.origin.pushurl");
    noPublish(/identifier.runtime/u, { branch: "fix/evt_123" });
    noPublish(/identifier.runtime/u, { title: "fix: preserve evt_123" });
    committedMutation(
      "reviewed-body.md",
      "## Result\n\nReview source-event:123.\n",
      /identifier.runtime/u,
    );
    committedMutation(
      "reviewed-body.md",
      "## Result\n\nGenerated with ChatGPT\n",
      /attribution/u,
    );
    committedMutation(
      "reviewed-body.md",
      "## Result\n\nA paragraph split\nacross physical lines.\n",
      /body|wrap|paragraph/u,
    );
    const terms = join(f.main, "records/state/local/terms.txt"),
      termBytes = readFileSync(terms);
    rmSync(terms);
    noPublish(/local-terms list absent/u);
    writeFileSync(terms, termBytes);
    noPublish(/contained regular file/u, { body: "../missing.md" });
    write(
      f.orderRoot,
      "records/state/local/body.md",
      "## Result\n\nIgnored body.\n",
    );
    noPublish(/committed|tracked|HEAD/u, {
      body: "records/state/local/body.md",
    });
    rmSync(join(f.orderRoot, "records/state/local/body.md"));
    symlinkSync("reviewed-body.md", join(f.orderRoot, "body-link.md"));
    git(f.orderRoot, "add", "body-link.md");
    git(f.orderRoot, "commit", "-qm", "test: symbolic body");
    noPublish(/contained regular file/u, { body: "body-link.md" });
    rmSync(join(f.orderRoot, "body-link.md"));
    git(f.orderRoot, "add", "-A");
    git(f.orderRoot, "commit", "-qm", "test: remove symbolic body");
    const gitWrapper = join(forge.bin, "git"),
      gitWrapperBytes = readFileSync(gitWrapper);
    writeFileSync(
      gitWrapper,
      gitWrapperBytes
        .toString("utf8")
        .replace(
          "process.stdout.write(result.stdout); process.exit(result.status ?? 1);",
          "process.stdout.write('https://github.com/dotln-fixture/other.git\\n'); process.exit(0);",
        ),
    );
    const wrongForge = publish();
    assert.notEqual(wrongForge.status, 0);
    assert.match(
      wrongForge.stderr,
      /origin differs from the bound target repository/u,
    );
    assert.equal(git(origin, "show-ref"), originRefs);
    assert.ok(!readFileSync(forge.log, "utf8").includes('"pr","create"'));
    writeFileSync(gitWrapper, gitWrapperBytes);
    rmSync(forge.log);
    const validLaunchpadHead = git(f.orderRoot, "rev-parse", "HEAD");
    const instanceRefs = git(f.main, "show-ref"),
      instanceOriginRefs = git(join(f.base, "launchpad.git"), "show-ref");
    const output = f.ok(publish());
    assert.match(output, /opened pull request #7/u);
    assert.equal(git(f.main, "show-ref"), instanceRefs);
    assert.equal(
      git(join(f.base, "launchpad.git"), "show-ref"),
      instanceOriginRefs,
    );
    assert.equal(
      git(
        join(f.base, "target.git"),
        "rev-parse",
        "refs/heads/fix/preserve-reviewed-text",
      ),
      event.commit,
    );
    const calls = readFileSync(forge.log, "utf8");
    assert.match(f.ok(publish()), /Already published/u);
    assert.equal(readFileSync(forge.log, "utf8"), calls);
    assert.notEqual(validLaunchpadHead, launchpadHead);
    assert.equal(git(f.orderRoot, "rev-parse", "HEAD"), validLaunchpadHead);
    const body = readFileSync(forge.body, "utf8");
    assert.match(body, /## Change/u);
    assert.match(body, /## Target checks/u);
    assert.ok(body.includes(reviewed));
    assert.doesNotMatch(body, /target-gate:|source-event:|argv/u);
    git(f.main, "merge", "-q", "--no-ff", "-m", "Merge records", "wo-999");
    git(f.main, "push", "-q", "origin", "main");
    write(
      f.orderRoot,
      "docs/control/local/harness/unrelated.json",
      "Retain this unknown ignored file.\n",
    );
    const unknownCache = f.worktree("finish", "WO-999", "--dry-run");
    assert.notEqual(unknownCache.status, 0);
    assert.match(unknownCache.stderr, /ignored material[\s\S]*unrelated.json/u);
    assert.ok(
      existsSync(
        join(f.orderRoot, "docs/control/local/harness/unrelated.json"),
      ),
    );
    rmSync(join(f.orderRoot, "docs/control/local/harness/unrelated.json"));
    const cloneBase = git(f.clone, "rev-parse", "main");
    const merged = join(f.base, "forge-merge");
    git(f.base, "clone", "-q", join(f.base, "target.git"), merged);
    git(merged, "config", "user.name", "Fixture");
    git(merged, "config", "user.email", "fixture@example.invalid");
    git(
      merged,
      "merge",
      "-q",
      "--no-ff",
      "-m",
      "Merge reviewed change",
      "origin/fix/preserve-reviewed-text",
    );
    git(merged, "push", "-q", "origin", "main");
    assert.equal(
      git(f.clone, "rev-parse", "main"),
      cloneBase,
      "only the forge has merged the target",
    );
    const fetchedBase = git(merged, "rev-parse", "HEAD");
    const cloneRefs = git(f.clone, "show-ref"),
      sourceBytes = readFileSync(join(f.clone, "source.txt"));
    const refusedClose = (pattern, refs = cloneRefs, mode = "--publish") => {
      const result = f.close(mode);
      assert.notEqual(result.status, 0);
      assert.match(result.stderr, pattern);
      assert.ok(
        result.stderr.includes(releaseCloseCommand(f.main, "WO-999", mode)),
        result.stderr,
      );
      assert.equal(git(f.clone, "show-ref"), refs);
      assert.ok(existsSync(f.orderRoot));
      assert.ok(
        existsSync(join(f.target, ".claude/target-worker-manifest.json")),
      );
    };
    write(f.clone, "source.txt", "dirty clone base\n");
    refusedClose(/source.txt/u);
    refusedClose(/source.txt/u, cloneRefs, "--dry-run");
    writeFileSync(join(f.clone, "source.txt"), sourceBytes);
    const divergent = git(
      f.clone,
      "commit-tree",
      `${cloneBase}^{tree}`,
      "-p",
      cloneBase,
      "-m",
      "test: divergent clone base",
    );
    git(f.clone, "update-ref", "refs/heads/main", divergent);
    refusedClose(/cannot fast-forward/u, git(f.clone, "show-ref"));
    refusedClose(/cannot fast-forward/u, git(f.clone, "show-ref"), "--dry-run");
    git(f.clone, "update-ref", "refs/heads/main", cloneBase);
    const cloneUrl = git(f.clone, "config", "remote.origin.url");
    git(
      f.clone,
      "config",
      "remote.origin.url",
      join(f.base, "absent-origin.git"),
    );
    refusedClose(/fetch failed/u);
    git(f.clone, "config", "remote.origin.url", cloneUrl);
    assert.match(f.ok(f.close("--dry-run")), /would-remove/u);
    assert.equal(git(f.clone, "rev-parse", "main"), cloneBase);
    write(f.target, "deps/pkg/one.txt", "ignored one\n");
    write(f.target, "deps/pkg/two.txt", "ignored two\n");
    const dryIgnored = f.close("--dry-run");
    assert.notEqual(dryIgnored.status, 0);
    assert.match(dryIgnored.stderr, /ignored material.*deps\//u);
    assert.doesNotMatch(
      dryIgnored.stderr,
      /deps\/pkg\/|target-worker-manifest/u,
    );
    assert.match(dryIgnored.stderr, /close WO-999 --dry-run/u);
    git(f.clone, "switch", "--detach", "-q", "HEAD");
    const ignored = f.close("--publish");
    assert.notEqual(ignored.status, 0);
    assert.match(ignored.stderr, /ignored material.*deps\//u);
    assert.doesNotMatch(ignored.stderr, /deps\/pkg\/|target-worker-manifest/u);
    assert.match(
      ignored.stderr,
      /Declare it disposable in the registration or remove it.*release.mjs.*close WO-999 --publish/u,
    );
    assert.ok(existsSync(f.orderRoot));
    assert.ok(
      existsSync(join(f.target, ".claude/target-worker-manifest.json")),
    );
    rmSync(join(f.target, "deps"), { recursive: true });
    assert.match(f.ok(f.close("--publish")), /no-release/u);
    assert.equal(git(f.clone, "rev-parse", "main"), fetchedBase);
    for (const root of [f.main, f.clone]) {
      assert.equal(git(root, "branch", "--list", "wo-999"), "");
      assert.equal(git(root, "tag", "--list"), "");
    }
    assert.equal(existsSync(f.target), false);
    assert.equal(existsSync(f.orderRoot), false);
    git(f.clone, "switch", "-q", "main");
    for (const row of event.records)
      assert.ok(existsSync(join(f.clone, row.path)));
  }));

test("target records refuse missing review, dirty targets and destination collisions without losing inputs", () =>
  withFixture((f) => {
    publicationSetup(f);
    f.mapClone();
    f.start();
    const early = f.resume(["target-records", ...actorArgs]);
    assert.notEqual(early.status, 0);
    assert.match(early.stderr, /closed|phase/u);
    write(
      f.target,
      "docs/evidence/WO-999/decisions.md",
      "Existing target history.\n",
    );
    git(f.target, "add", "docs");
    git(f.target, "commit", "-qm", "docs: existing target history");
    const reports = closeOrder(f);
    write(
      f.orderRoot,
      "records/evidence/WO-999/decisions.md",
      "# Decisions\n\nNew order history.\n",
    );
    const segment = docPath(f.orderRoot, "orders", "WO-999.jsonl"),
      original = readFileSync(segment),
      head = git(f.target, "rev-parse", "HEAD");
    const refuse = (pattern) => {
      const before = git(f.target, "status", "--porcelain");
      const result = f.resume(["target-records", ...actorArgs]);
      assert.notEqual(result.status, 0);
      assert.match(result.stderr, pattern);
      assert.deepEqual(readFileSync(segment), original);
      assert.equal(git(f.target, "rev-parse", "HEAD"), head);
      assert.equal(git(f.target, "status", "--porcelain"), before);
      assert.ok(existsSync(reports.verification));
      assert.ok(existsSync(reports.finalReview));
    };
    refuse(/destination already holds different bytes/u);
    const source = readFileSync(join(f.target, "source.txt"));
    write(f.target, "source.txt", "dirty\n");
    refuse(/tracked changes/u);
    writeFileSync(join(f.target, "source.txt"), source);
    write(f.target, "untracked.txt", "new input\n");
    refuse(/untracked/u);
    rmSync(join(f.target, "untracked.txt"));
  }));

test("target records screen a hash-bound verification before writing and admit its placeholder", () => {
  for (const [location, refused] of [
    ["/private/var/folders/fixture-user/T/x", true],
    ["<tmp>/x", false],
  ])
    withFixture((f) => {
      const forge = publicationSetup(f);
      f.mapClone();
      f.start();
      const reports = closeOrder(f, {}, `\nInspected ${location}.\n`);
      write(
        f.orderRoot,
        "records/evidence/WO-999/decisions.md",
        "# Decisions\n\nPreserve the reviewed fixture behavior.\n",
      );
      const segment = docPath(f.orderRoot, "orders", "WO-999.jsonl");
      const before = readFileSync(segment),
        files = recordTreeSnapshot(f.target),
        refs = git(f.target, "show-ref"),
        origin = git(join(f.base, "target.git"), "show-ref"),
        verification = readFileSync(reports.verification);
      const result = f.resume(["target-records", ...actorArgs]);
      if (refused) {
        assert.notEqual(result.status, 0);
        assert.match(
          result.stderr,
          /docs\/verifications\/WO-999\/VER-001\.md:\d+: private absolute path/u,
        );
        assert.doesNotMatch(result.stdout + result.stderr, /fixture-user/u);
        assert.match(result.stderr, /<tmp>/u);
        assert.deepEqual(readFileSync(segment), before);
        assert.deepEqual(recordTreeSnapshot(f.target), files);
        assert.equal(git(f.target, "show-ref"), refs);
        assert.deepEqual(readFileSync(reports.verification), verification);
      } else {
        f.ok(result);
        assert.deepEqual(
          readFileSync(join(f.target, "docs/verifications/WO-999/VER-001.md")),
          verification,
        );
      }
      assert.equal(git(join(f.base, "target.git"), "show-ref"), origin);
      assert.equal(existsSync(forge.log), false);
    });
});

test("target records resume interrupted commits and removals with literal document roots", async () => {
  const { commitTargetRecords, targetRecordSources } =
    await import("./lib/target-records.mjs");
  const { readControl } = await import("./lib/control-store.mjs");
  withFixture((f) => {
    f.config.repositories.target.documentationRoot = ":(literal)manual";
    publicationSetup(f);
    f.mapClone();
    f.start();
    write(f.target, "reviewed.txt", "Reviewed change.\n");
    git(f.target, "add", "reviewed.txt");
    git(f.target, "commit", "-qm", "fix: reviewed change");
    const reports = closeOrder(f);
    write(
      f.orderRoot,
      "records/evidence/WO-999/decisions.md",
      "# Decisions\n\nKeep reviewed behavior.\n",
    );
    const control = readControl(f.orderRoot),
      state = control.orders.get("WO-999").state;
    const verificationBytes = readFileSync(reports.verification);
    const signer = join(f.base, "fixture-signer"),
      signAttempt = join(f.base, "signing-requested");
    writeFileSync(
      signer,
      `#!/bin/sh\nprintf attempted > '${signAttempt}'\nexit 1\n`,
    );
    chmodSync(signer, 0o755);
    git(f.target, "config", "gpg.format", "openpgp");
    git(f.target, "config", "gpg.program", signer);
    git(f.target, "config", "commit.gpgsign", "true");
    assert.throws(
      () => commitTargetRecords(f.orderRoot, state, control),
      /sign|gpg/u,
    );
    assert.ok(
      existsSync(signAttempt),
      "records commit honors the host signing policy",
    );
    assert.equal(
      git(f.target, "rev-parse", "HEAD"),
      state.targetSubject.commit,
    );
    assert.ok(existsSync(reports.verification));
    git(f.target, "config", "commit.gpgsign", "false");
    // Stop at the real commit/event boundary, then use the public command.
    const result = commitTargetRecords(f.orderRoot, state, control);
    const receipt = docPath(
      f.orderRoot,
      "control",
      "local/target-operations/records/WO-999.json",
    );
    const receiptBytes = readFileSync(receipt);
    const offered = () =>
      JSON.parse(
        f.ok(f.resume(["status", "--json"])),
      ).legalNextActions.includes("target-records");
    assert.equal(
      readControl(f.orderRoot).orders.get("WO-999").state.targetRecords,
      undefined,
    );
    assert.ok(existsSync(reports.verification));
    assert.equal(
      git(f.target, "ls-tree", "HEAD", "--", result.payload.records[0].path),
      "",
    );
    assert.notEqual(
      git(
        f.target,
        "ls-tree",
        "HEAD",
        "--",
        `:(literal)${result.payload.records[0].path}`,
      ),
      "",
    );
    // A retry reads each -z entry whole: a staged rename in the target is
    // named by both of its paths, and nothing records.
    git(f.target, "mv", "reviewed.txt", "renamed-reviewed.txt");
    const renamed = f.resume(["target-records", ...actorArgs]);
    assert.notEqual(renamed.status, 0);
    assert.match(
      renamed.stderr,
      /pending operation has changed or unrelated input: reviewed\.txt -> renamed-reviewed\.txt$/mu,
    );
    git(f.target, "mv", "renamed-reviewed.txt", "reviewed.txt");
    assert.equal(
      readControl(f.orderRoot).orders.get("WO-999").state.targetRecords,
      undefined,
    );
    f.ok(f.resume(["target-records", ...actorArgs]));
    assert.equal(git(f.target, "rev-parse", "HEAD"), result.payload.commit);
    assert.equal(existsSync(reports.verification), false);
    assert.equal(offered(), false);
    // Model interruption after the event and the removals but before the
    // receipt is forgotten: status keeps offering the rerun that finishes it.
    writeFileSync(receipt, receiptBytes);
    assert.equal(offered(), true);
    // The committed projection stays a fold of the segments: the receipt
    // shows only on one status line after it, and no drift is reported.
    const projection = readFileSync(
      docPath(f.orderRoot, "control", "current.md"),
      "utf8",
    );
    assert.match(
      projection,
      /Legal next actions: release-close, next, activate/u,
    );
    const human = f.resume(["status"]);
    assert.equal(human.status, 0, human.stderr);
    assert.doesNotMatch(human.stderr, /disagrees/u);
    assert.ok(human.stdout.startsWith(projection));
    assert.match(
      human.stdout.slice(projection.length),
      /^\nLocal recovery \(WO-999\): target-records can rerun; a records receipt or moved source remains\.\n/u,
    );
    assert.match(
      f.ok(f.resume(["target-records", ...actorArgs])),
      /Already recorded/u,
    );
    assert.equal(existsSync(receipt), false);
    assert.equal(offered(), false);
    assert.doesNotMatch(f.ok(f.resume(["status"])), /Local recovery/u);
    // Model interruption after the event and before every source is removed.
    writeFileSync(reports.verification, "Changed source must survive.\n");
    assert.equal(offered(), true);
    const changedSource = f.resume(["target-records", ...actorArgs]);
    assert.notEqual(changedSource.status, 0);
    // The source is named relative to the launchpad, and the rerun in the
    // launchpad form the briefings print.
    assert.match(
      changedSource.stderr,
      /target records refused: records\/verifications\/WO-999\/VER-001\.md: moved source differs from its recorded bytes; source retained\./u,
    );
    const [rerun] = launchpadCommands(f, changedSource.stderr);
    assert.equal(rerun.command, "scripts/resume.mjs target-records");
    assert.equal(offered(), true);
    assert.equal(
      readFileSync(reports.verification, "utf8"),
      "Changed source must survive.\n",
    );
    writeFileSync(reports.verification, verificationBytes);
    const retry = rerun.run();
    assert.equal(retry.status, 0, retry.stderr);
    assert.match(retry.stdout, /Already recorded/u);
    assert.equal(existsSync(reports.verification), false);
    assert.equal(offered(), false);
    // A file in place of a moved report's directory is local state the check
    // reports on and never throws over: the report cannot be there, so status
    // offers nothing; with the receipt back, the rerun finishes past it.
    const reportDirectory = dirname(reports.verification);
    rmSync(reportDirectory, { recursive: true });
    writeFileSync(reportDirectory, "Not a directory.\n");
    f.ok(f.resume(["status"]));
    f.ok(f.resume(["next"]));
    assert.equal(offered(), false);
    writeFileSync(receipt, receiptBytes);
    assert.equal(offered(), true);
    assert.match(
      f.ok(f.resume(["target-records", ...actorArgs])),
      /Already recorded/u,
    );
    assert.equal(existsSync(receipt), false);
    assert.equal(offered(), false);
    rmSync(reportDirectory);
    mkdirSync(reportDirectory);
    assert.equal(git(f.target, "rev-parse", "HEAD"), result.payload.commit);
    const original = "records/verifications/WO-999/VER-001.md",
      corrected = "records/verifications/WO-999/filed/VER-001.md";
    const rows = targetRecordSources(
      f.orderRoot,
      {
        ...state,
        corrections: [
          {
            subject: { type: "VerificationCompleted", reportPath: original },
            fields: { reportPath: corrected },
          },
        ],
      },
      [
        {
          type: "VerificationCompleted",
          reportPath: original,
          reportHash: "sha256:" + "a".repeat(64),
        },
      ],
    );
    assert.equal(
      rows.find((row) => row.kind === "verification").source,
      corrected,
    );
  });
});

test("records publication validates parent, paths, modes and every recorded blob", async () => {
  const { validateTargetRecordsCommit } =
    await import("./lib/target-records.mjs");
  withFixture((f) => {
    write(f.clone, "docs/record.md", "Old record.\n");
    git(f.clone, "add", "docs");
    git(f.clone, "commit", "-qm", "docs: original record");
    const parent = git(f.clone, "rev-parse", "HEAD"),
      bytes = "Reviewed record.\n",
      sha256 = createHash("sha256").update(bytes).digest("hex");
    const blob = runGit(f.clone, ["hash-object", "-w", "--stdin"], {
      input: bytes,
    });
    const env = {
      ...process.env,
      GIT_INDEX_FILE: join(f.base, "record-validation-index"),
    };
    const treeCommit = (changes, parents = [parent]) => {
      runGit(f.clone, ["read-tree", parent], { env });
      for (const [path, mode] of changes)
        runGit(
          f.clone,
          mode
            ? [
                "update-index",
                "--add",
                "--cacheinfo",
                `${mode},${blob},${path}`,
              ]
            : ["update-index", "--force-remove", path],
          { env },
        );
      const tree = runGit(f.clone, ["write-tree"], { env });
      return runGit(f.clone, [
        "commit-tree",
        tree,
        ...parents.flatMap((value) => ["-p", value]),
        "-m",
        "docs: reviewed records",
      ]);
    };
    const subject = {
      repositoryId: "target",
      branch: "wo-999",
      baseCommit: f.baseCommit,
      commit: parent,
    };
    const record = { kind: "decisions", path: "docs/record.md", sha256 };
    const binding = (commit, records = [record]) => ({
      repositoryId: "target",
      branch: "wo-999",
      parent,
      commit,
      root: "docs",
      records,
    });
    const repository = { documentationRoot: "docs" };
    const valid = treeCommit([[record.path, "100644"]]);
    validateTargetRecordsCommit(f.clone, subject, binding(valid), repository);
    const invalid = (commit, pattern, records) =>
      assert.throws(
        () =>
          validateTargetRecordsCommit(
            f.clone,
            subject,
            binding(commit, records),
            repository,
          ),
        pattern,
      );
    invalid(
      treeCommit([[record.path, "100644"]], [f.baseCommit]),
      /single parent/u,
    );
    invalid(
      treeCommit([[record.path, "100644"]], [parent, f.baseCommit]),
      /single parent/u,
    );
    invalid(
      treeCommit([
        [record.path, "100644"],
        ["outside.txt", "100644"],
      ]),
      /outside.txt/u,
    );
    invalid(treeCommit([[record.path, null]]), /docs\/record.md/u);
    invalid(
      treeCommit([
        [record.path, null],
        ["docs/renamed.md", "100644"],
      ]),
      /docs\/record.md/u,
      [{ ...record, path: "docs/renamed.md" }],
    );
    invalid(treeCommit([[record.path, "100755"]]), /docs\/record.md/u);
    invalid(
      treeCommit([
        [record.path, "100644"],
        ["docs/unrecorded.md", "100644"],
      ]),
      /docs\/unrecorded.md/u,
    );
    invalid(valid, /recorded bytes differ.*docs\/record.md/u, [
      { ...record, sha256: "0".repeat(64) },
    ]);
  });
});

test("target planning publishes only product and planning documents under the registered root", () =>
  withFixture((f) => {
    f.config.repositories.target.documentationRoot = ":(literal)manual";
    const forge = publicationSetup(f);
    f.mapClone();
    const from = join(f.base, "planning-input"),
      bodyFile = join(f.base, "planning-body.md");
    write(from, "product/purpose.md", "# Purpose\n\nA synthetic target.\n");
    write(
      from,
      "planning/next.md",
      "# Plan\n\nImplement the reviewed change.\n",
    );
    writeFileSync(
      bodyFile,
      "## Result\n\nRecord the target purpose and plan.\n",
    );
    const call = (extra = {}) =>
      f.call(f.main, f.main, "refute-plan", [
        "target-publish",
        "target",
        "--base",
        extra.base ?? f.baseCommit,
        "--from",
        from,
        "--branch",
        extra.branch ?? "docs/target-plan",
        "--title",
        extra.title ?? "docs(api): record target plan",
        "--body-file",
        bodyFile,
      ]);
    const refs = git(join(f.base, "target.git"), "show-ref");
    const refuse = (pattern, extra) => {
      const cloneBefore = recordTreeSnapshot(f.clone),
        cloneRefs = git(f.clone, "show-ref"),
        worktrees = git(f.clone, "worktree", "list", "--porcelain");
      const result = call(extra);
      assert.notEqual(result.status, 0);
      assert.match(result.stderr, pattern);
      assert.equal(git(join(f.base, "target.git"), "show-ref"), refs);
      assert.equal(existsSync(forge.log), false);
      assert.equal(git(f.clone, "branch", "--list", "docs/target-plan"), "");
      assert.deepEqual(recordTreeSnapshot(f.clone), cloneBefore);
      assert.equal(git(f.clone, "show-ref"), cloneRefs);
      assert.equal(git(f.clone, "worktree", "list", "--porcelain"), worktrees);
      return result;
    };
    for (const [path, location] of [
      ["planning/next.md", "/Users/fixture-user/x"],
      ["product/purpose.md", "/private/var/folders/fixture-user/T/x"],
      ["planning/record.json", "/home/fixture-user/x"],
      ["product/record.JSON", "/home/fixture-user/x"],
    ]) {
      const original = existsSync(join(from, path))
        ? readFileSync(join(from, path))
        : null;
      write(from, path, `Inspected ${location}.\n`);
      const result = refuse(
        /manual\/(?:planning|product)\/[^:]+:1: private absolute path/u,
      );
      assert.doesNotMatch(result.stdout + result.stderr, /fixture-user/u);
      assert.match(result.stderr, /<home>/u);
      if (original) writeFileSync(join(from, path), original);
      else rmSync(join(from, path));
    }
    for (const name of [
      "planning/.DS_Store",
      "planning/.jsonl",
      "planning/note.md~",
      "product/editor.swp",
      "product/program.js",
    ]) {
      write(from, name, "editor residue\n");
      refuse(
        /file type|hidden|editor|unsupported|admitted planning files are/u,
      );
      rmSync(join(from, name));
    }
    // The title and body reach the commit and the forge; both take the
    // Markdown rule before any write, commit or forge call.
    let screened = refuse(
      /pull-request title \(also the commit message\): private absolute path/u,
      { title: "docs(api): record /Users/fixture-user/x" },
    );
    assert.doesNotMatch(screened.stdout + screened.stderr, /fixture-user/u);
    const bodyBytes = readFileSync(bodyFile);
    writeFileSync(
      bodyFile,
      "## Result\n\nInspect /private/var/folders/fixture-user/T/x.\n",
    );
    screened = refuse(/pull-request body line 3: private absolute path/u);
    assert.doesNotMatch(screened.stdout + screened.stderr, /fixture-user/u);
    writeFileSync(bodyFile, bodyBytes);
    write(from, "planning/next.md", "# Plan\n\nInspect <home>/x.\n");
    write(
      from,
      "planning/record.json",
      '{"path":"<home>/x","temporary":"/tmp/fixture/x"}\n',
    );
    write(from, "source.txt", "not a document");
    refuse(/only planning and product/u);
    rmSync(join(from, "source.txt"));
    symlinkSync(bodyFile, join(from, "planning/symbolic.md"));
    refuse(/not a regular file/u);
    rmSync(join(from, "planning/symbolic.md"));
    write(from, "product/bad\\name.md", "Invalid path.\n");
    refuse(/normalized path/u);
    rmSync(join(from, "product/bad\\name.md"));
    refuse(/outward lint.*identifier.runtime/u, {
      title: "docs: record evt_123",
    });
    refuse(/title.*docs/u, { title: "feat: record target plan" });
    refuse(/title.*docs/u, { title: "fix(api): record target plan" });
    const configBytes = readFileSync(join(f.main, "dotln.config.json"));
    f.config.repositories.target.authorityProfile.deniedEffects = ["repo.push"];
    write(f.main, "dotln.config.json", JSON.stringify(f.config));
    refuse(/repo.push/u);
    writeFileSync(join(f.main, "dotln.config.json"), configBytes);
    const grants = join(f.main, "packages/skeleton/loadouts/grants.json"),
      grantBytes = readFileSync(grants);
    writeFileSync(grants, "[]");
    refuse(/operator grant/u);
    git(f.main, "add", "packages/skeleton/loadouts/grants.json");
    git(f.main, "commit", "-qm", "test: revoke committed grant");
    writeFileSync(grants, grantBytes);
    refuse(/grant registry differs from committed authority/u);
    git(f.main, "add", "packages/skeleton/loadouts/grants.json");
    git(f.main, "commit", "-qm", "test: restore committed grant");
    const monitor = join(f.base, "monitor-fired"),
      hook = join(f.base, "monitor.sh");
    writeFileSync(
      hook,
      `#!/bin/sh\n: > '${monitor}'\nprintf 'token\\000/\\000'\n`,
    );
    chmodSync(hook, 0o755);
    git(f.clone, "config", "core.fsmonitor", hook);
    git(f.clone, "config", "core.fsmonitorHookVersion", "2");
    git(f.clone, "switch", "-qc", "divergent-planning-base");
    write(f.clone, "divergent.txt", "unmerged\n");
    git(f.clone, "add", "-A");
    git(f.clone, "commit", "-qm", "test: divergent base");
    const divergent = git(f.clone, "rev-parse", "HEAD");
    git(f.clone, "switch", "-q", "main");
    refuse(/not an ancestor/u, { base: divergent });
    rmSync(monitor, { force: true });
    const gh = join(forge.bin, "gh"),
      ghBytes = readFileSync(gh);
    const signer = join(f.base, "planning-signer"),
      signAttempt = join(f.base, "planning-signing-requested");
    writeFileSync(
      signer,
      `#!/bin/sh\nprintf attempted > '${signAttempt}'\nexit 1\n`,
    );
    chmodSync(signer, 0o755);
    git(f.clone, "config", "gpg.format", "openpgp");
    git(f.clone, "config", "gpg.program", signer);
    git(f.clone, "config", "commit.gpgsign", "true");
    const signingRefused = call();
    assert.notEqual(signingRefused.status, 0);
    assert.ok(
      existsSync(signAttempt),
      "planning commit honors the host signing policy",
    );
    assert.equal(git(join(f.base, "target.git"), "show-ref"), refs);
    git(f.clone, "config", "commit.gpgsign", "false");
    writeFileSync(gh, "#!/bin/sh\nexit 71\n");
    const interrupted = call();
    assert.notEqual(interrupted.status, 0);
    assert.match(
      interrupted.stderr,
      /planning recovery retained.*retry the same/u,
    );
    assert.match(
      interrupted.stderr,
      /gh is required before any remote mutation/u,
    );
    assert.equal(
      existsSync(monitor),
      false,
      "publication must disable fsmonitor",
    );
    git(f.clone, "config", "core.fsmonitor", "false");
    const retained = git(f.clone, "rev-parse", "docs/target-plan");
    const originalPlan = readFileSync(join(from, "planning/next.md"));
    write(from, "planning/next.md", "Changed plan.\n");
    const changedInput = call();
    assert.notEqual(changedInput.status, 0);
    assert.match(changedInput.stderr, /pending publication differs/u);
    assert.equal(git(f.clone, "rev-parse", "docs/target-plan"), retained);
    writeFileSync(join(from, "planning/next.md"), originalPlan);
    writeFileSync(gh, ghBytes);
    const retainedWorktree = git(f.clone, "worktree", "list", "--porcelain")
      .split("\n\n")
      .find((row) => row.includes("branch refs/heads/docs/target-plan"))
      .split("\n")[0]
      .slice("worktree ".length);
    const retainedNote = join(dirname(retainedWorktree), "operator-note.txt");
    writeFileSync(retainedNote, "Preserve this fixture note.\n");
    const cleanupInterrupted = call();
    assert.notEqual(cleanupInterrupted.status, 0);
    assert.match(
      cleanupInterrupted.stderr,
      /ENOTEMPTY.*planning recovery retained/u,
    );
    assert.equal(
      readFileSync(retainedNote, "utf8"),
      "Preserve this fixture note.\n",
    );
    rmSync(retainedNote);
    const output = f.ok(call());
    assert.equal(
      readFileSync(forge.log, "utf8")
        .split("\n")
        .filter((line) => line.includes('"pr","create"')).length,
      1,
    );
    assert.equal(
      git(
        join(f.base, "target.git"),
        "rev-parse",
        "refs/heads/docs/target-plan",
      ),
      retained,
    );
    const commit = git(
      join(f.base, "target.git"),
      "rev-parse",
      "refs/heads/docs/target-plan",
    );
    assert.ok(output.includes(commit));
    assert.match(output, /manual\/product\/purpose.md/u);
    assert.match(output, /manual\/planning\/next.md/u);
    assert.match(
      git(
        join(f.base, "target.git"),
        "show",
        `${commit}::(literal)manual/product/purpose.md`,
      ),
      /synthetic target/u,
    );
    assert.equal(git(f.clone, "branch", "--list", "docs/target-plan"), "");
    assert.equal(
      git(f.clone, "worktree", "list", "--porcelain").split("worktree ")
        .length - 1,
      1,
    );
    assert.ok(readFileSync(forge.log, "utf8").includes('"--base","main"'));
  }));

test("WO-221 the draft form at verified pushes the working tree under a draft pull request that the closed-phase publish reuses", () =>
  withFixture((f) => {
    const forge = publicationSetup(f);
    f.mapClone();
    f.start();
    // Uncommitted target work: the draft carries the working tree while HEAD
    // and the index stay where the executor rule leaves them.
    write(f.target, "reviewed.txt", "Reviewed change.\n");
    const headBefore = git(f.target, "rev-parse", "HEAD");
    const statusBefore = git(f.target, "status", "--porcelain");
    write(
      f.orderRoot,
      "draft-body.md",
      "## Draft\n\nPreserve reviewed behavior.\n",
    );
    const draftArgs = [
      "publish",
      "WO-999",
      "--target-worktree",
      "--draft",
      "--branch",
      "feat/reviewed-behavior",
      "--title",
      "feat: preserve reviewed behavior",
      "--body-file",
      "draft-body.md",
    ];
    const early = f.worktree(...draftArgs);
    assert.notEqual(early.status, 0);
    assert.match(early.stderr, /legal at verified[^\n]*WO-999 is active/u);
    f.ok(
      f.call(f.orderRoot, f.orderRoot, "target-gate", ["WO-999", "--review"]),
    );
    f.ok(f.resume(["implementation-ready", ...actorArgs]));
    const ready = f.worktree(...draftArgs);
    assert.notEqual(ready.status, 0);
    assert.match(ready.stderr, /WO-999 is ready-to-verify/u);
    f.ok(f.resume(["verify"]));
    write(
      f.orderRoot,
      "records/verifications/WO-999/VER-001.md",
      `# Verification fixture\n\n**Actor attestation:** ${JSON.stringify(actor)}\n\n**Process cost:** unknown; cause no-session\n`,
    );
    f.ok(f.resume(["verification-result", "pass", ...actorArgs]));
    write(
      f.orderRoot,
      "records/intake/private-body.md",
      "## Draft\n\nPrivate fixture body.\n",
    );
    const intakeDraft = f.worktree(
      ...draftArgs.map((arg) =>
        arg === "draft-body.md" ? "records/intake/private-body.md" : arg,
      ),
    );
    assert.notEqual(intakeDraft.status, 0);
    assert.match(intakeDraft.stderr, /ignored or intake/u);
    const ghFile = join(forge.bin, "gh"),
      originalGh = readFileSync(ghFile);
    writeFileSync(ghFile, "#!/bin/sh\nexit 71\n");
    const beforePushFailure = f.worktree(...draftArgs);
    assert.notEqual(beforePushFailure.status, 0);
    assert.match(beforePushFailure.stderr, /gh is required/u);
    assert.equal(
      git(
        join(f.base, "target.git"),
        "branch",
        "--list",
        "feat/reviewed-behavior",
      ),
      "",
    );
    writeFileSync(
      ghFile,
      `#!/bin/sh\nif [ "$1" = pr ] && [ "$2" = create ]; then exit 72; fi\nexec '${ghFile}.original.mjs' "$@"\n`,
    );
    writeFileSync(`${ghFile}.original.mjs`, originalGh);
    chmodSync(`${ghFile}.original.mjs`, 0o755);
    const failedDraft = f.worktree(...draftArgs);
    assert.notEqual(failedDraft.status, 0);
    assert.match(failedDraft.stderr, /prepared commit is retained/u);
    const preparedHead = git(f.target, "rev-parse", "refs/dotln/draft/WO-999");
    writeFileSync(ghFile, originalGh);
    const drafted = f.ok(f.worktree(...draftArgs));
    assert.equal(
      git(f.target, "rev-parse", "refs/dotln/draft/WO-999"),
      preparedHead,
    );
    assert.match(
      drafted,
      /Pushed draft feat\/reviewed-behavior at [0-9a-f]{40} and opened draft pull request #7 on github\.com\/dotln-fixture\/target; HEAD and the index are unchanged/u,
    );
    assert.equal(git(f.target, "rev-parse", "HEAD"), headBefore);
    assert.equal(git(f.target, "status", "--porcelain"), statusBefore);
    const remote = join(f.base, "target.git");
    const draftHead = git(
      remote,
      "rev-parse",
      "refs/heads/feat/reviewed-behavior",
    );
    assert.equal(git(remote, "rev-parse", `${draftHead}^`), headBefore);
    assert.equal(
      git(remote, "show", `${draftHead}:reviewed.txt`),
      "Reviewed change.",
    );
    const calls = () =>
      readFileSync(forge.log, "utf8")
        .trim()
        .split("\n")
        .map(JSON.parse)
        .filter((args) => !(args[0] === "pr" && args[1] === "view"));
    assert.ok(
      calls().some(
        (args) =>
          args[0] === "pr" && args[1] === "create" && args.includes("--draft"),
      ),
    );
    const store = join(
      docPath(f.main, "control", "local/target-publications", "WO-999"),
      "events.jsonl",
    );
    const events = () =>
      readFileSync(store, "utf8").trim().split("\n").map(JSON.parse);
    const refuseForeignDraft = (args) => {
      const original = readFileSync(store, "utf8");
      const prior = events().findLast(
        (event) => event.type === "PullRequestOpened" && event.payload.draft,
      );
      writeFileSync(
        store,
        appendEvent(original, {
          ...prior,
          payload: {
            ...prior.payload,
            repositoryId: "github.com/dotln-fixture/another",
          },
        }).log,
      );
      try {
        const refused = f.worktree(...args);
        assert.notEqual(refused.status, 0);
        assert.match(
          refused.stderr,
          /origin differs from the recorded draft repository/u,
        );
      } finally {
        writeFileSync(store, original);
      }
    };
    assert.deepEqual(
      events().map((event) => [
        event.type,
        event.payload.draft,
        event.payload.headSha,
        event.payload.branch,
      ]),
      [
        ["DraftPrepared", undefined, draftHead, "feat/reviewed-behavior"],
        ["PullRequestOpened", true, draftHead, "feat/reviewed-behavior"],
      ],
    );
    const originalUrl = git(f.target, "config", "--get", "remote.origin.url");
    refuseForeignDraft(draftArgs);
    git(
      f.target,
      "config",
      "remote.origin.url",
      "https://github.com/dotln-fixture/another",
    );
    const wrongOrigin = f.worktree(...draftArgs);
    assert.notEqual(wrongOrigin.status, 0);
    assert.match(wrongOrigin.stderr, /origin differs/u);
    git(f.target, "config", "remote.origin.url", originalUrl);
    // A second draft at the same tree reports already published; nothing is pushed.
    assert.match(f.ok(f.worktree(...draftArgs)), /Already published draft/u);
    for (const replacement of [f.baseCommit, null]) {
      git(
        remote,
        "update-ref",
        ...(replacement
          ? ["refs/heads/feat/reviewed-behavior", replacement]
          : ["-d", "refs/heads/feat/reviewed-behavior"]),
      );
      const changedRemote = f.worktree(...draftArgs);
      assert.notEqual(changedRemote.status, 0);
      assert.match(
        changedRemote.stderr,
        /remote draft branch feat\/reviewed-behavior for pull request #7 moved from the recorded head/u,
      );
      assert.ok(
        changedRemote.stderr.includes(
          `moved from the recorded head ${draftHead} to ${replacement ?? "absent"}; preserve the remote change, integrate and review it, then explicitly rebind publication before retrying`,
        ),
        changedRemote.stderr,
      );
      assert.equal(git(f.target, "rev-parse", "HEAD"), headBefore);
      assert.equal(git(f.target, "status", "--porcelain"), statusBefore);
      git(remote, "update-ref", "refs/heads/feat/reviewed-behavior", draftHead);
    }
    assert.equal(calls().filter((args) => args[0] === "pr").length, 1);
    // The reviewed commit on wo-999, the final review and the records.
    git(f.target, "add", "reviewed.txt");
    git(f.target, "commit", "-qm", "feat: preserve reviewed behavior");
    f.ok(
      f.call(f.orderRoot, f.orderRoot, "target-gate", ["WO-999", "--review"]),
    );
    f.ok(f.resume(["final-review"]));
    write(
      f.orderRoot,
      "records/final-reviews/WO-999/FINAL-001.md",
      `# Final fixture\n\n**Actor attestation:** ${JSON.stringify(actor)}\n\n**Process cost:** unknown; cause no-session\n`,
    );
    f.ok(f.resume(["final-review-result", "pass", ...actorArgs]));
    write(
      f.orderRoot,
      "records/evidence/WO-999/decisions.md",
      "# Decisions\n\nPreserve reviewed behavior.\n",
    );
    f.ok(f.resume(["target-records", ...actorArgs]));
    write(
      f.orderRoot,
      "reviewed-body.md",
      "## Result\n\nPreserve reviewed behavior.\n",
    );
    git(f.orderRoot, "add", "-A");
    git(f.orderRoot, "commit", "-qm", "docs: record validation");
    const publishArgs = (branch) => [
      "publish",
      "WO-999",
      "--target-worktree",
      "--branch",
      branch,
      "--title",
      "feat: preserve reviewed behavior",
      "--body-file",
      "reviewed-body.md",
    ];
    const wrongBranch = f.worktree(...publishArgs("fix/other"));
    assert.notEqual(wrongBranch.status, 0);
    assert.match(
      wrongBranch.stderr,
      /one pull request per order: the draft is on feat\/reviewed-behavior/u,
    );
    refuseForeignDraft(publishArgs("feat/reviewed-behavior"));
    git(
      remote,
      "update-ref",
      "refs/heads/feat/reviewed-behavior",
      f.baseCommit,
    );
    const movedDraft = f.worktree(...publishArgs("feat/reviewed-behavior"));
    assert.notEqual(movedDraft.status, 0);
    assert.match(
      movedDraft.stderr,
      /remote draft branch feat\/reviewed-behavior for pull request #7 moved from the recorded head/u,
    );
    assert.ok(
      movedDraft.stderr.includes(
        `moved from the recorded head ${draftHead} to ${f.baseCommit}; preserve the remote change, integrate and review it, then explicitly rebind publication before retrying`,
      ),
      movedDraft.stderr,
    );
    git(remote, "update-ref", "refs/heads/feat/reviewed-behavior", draftHead);
    const published = f.ok(
      f.worktree(...publishArgs("feat/reviewed-behavior")),
    );
    assert.match(
      published,
      /over draft [0-9a-f]{40} and marked pull request #7 on github\.com\/dotln-fixture\/target ready/u,
    );
    const reviewed = git(f.target, "rev-parse", "HEAD");
    assert.equal(
      git(remote, "rev-parse", "refs/heads/feat/reviewed-behavior"),
      reviewed,
    );
    assert.deepEqual(
      calls()
        .filter((args) => args[0] === "pr")
        .map((args) => args.slice(0, 3)),
      [
        ["pr", "create", "--draft"],
        ["pr", "edit", "7"],
        ["pr", "ready", "7"],
      ],
    );
    const forgeState = JSON.parse(readFileSync(forge.state, "utf8"));
    assert.equal(forgeState.pulls[7].draft, false);
    assert.equal(forgeState.pulls[7].ready, true);
    assert.equal(forgeState.pulls[7].title, "feat: preserve reviewed behavior");
    const last = events().at(-1).payload;
    assert.equal(last.reusedDraft, draftHead);
    assert.equal(last.headSha, reviewed);
    assert.equal(last.number, 7);
    // A rerun reports the recorded publication and pushes nothing.
    assert.match(
      f.ok(f.worktree(...publishArgs("feat/reviewed-behavior"))),
      /Already published commit/u,
    );
    assert.equal(calls().filter((args) => args[0] === "pr").length, 3);
  }));

test("target publication retains installation ownership when its live manifest disappears", () =>
  withFixture((f) => {
    const forge = publicationSetup(f);
    f.mapClone();
    f.start();
    const manifest = join(f.target, ".claude/target-worker-manifest.json");
    const bytes = readFileSync(manifest);
    write(f.target, "reviewed.txt", "Reviewed change.\n");
    git(f.target, "add", "reviewed.txt");
    git(f.target, "add", "-f", ".claude/settings.json");
    git(f.target, "commit", "-qm", "fix: preserve reviewed behavior");
    closeOrder(f);
    write(
      f.orderRoot,
      "records/evidence/WO-999/decisions.md",
      "# Decisions\n\nPreserve reviewed behavior.\n",
    );
    f.ok(f.resume(["target-records", ...actorArgs]));
    write(
      f.orderRoot,
      "reviewed-body.md",
      "## Result\n\nPreserve reviewed behavior.\n",
    );
    git(f.orderRoot, "add", "-A");
    git(f.orderRoot, "commit", "-qm", "docs: record validation");
    const before = git(join(f.base, "target.git"), "show-ref");
    for (const missing of [false, true]) {
      if (missing) rmSync(manifest);
      const result = f.worktree(
        "publish",
        "WO-999",
        "--target-worktree",
        "--branch",
        "fix/reviewed-behavior",
        "--title",
        "fix: preserve reviewed behavior",
        "--body-file",
        "reviewed-body.md",
      );
      assert.notEqual(result.status, 0);
      assert.match(result.stderr, /bundle ownership/u);
      assert.equal(git(join(f.base, "target.git"), "show-ref"), before);
      assert.equal(existsSync(forge.log), false);
    }
    writeFileSync(manifest, bytes);
  }));

test("moved decisions and reports resolve from the bound immutable target commit", () =>
  withFixture((f) => {
    publicationSetup(f);
    f.mapClone();
    f.start();
    closeOrder(f);
    const decision = {
      id: "WO-999-D001",
      date: "2026-10-19",
      dispatch: "resume: next",
      decision: "Keep the fixture behavior.",
      evidence: ["Fixture commit."],
      rejected: [],
      followup: "Recheck the fixture when its contract changes.",
      reopenWhen: "The fixture contract changes.",
    };
    write(
      f.orderRoot,
      "records/evidence/WO-999/decisions.md",
      `# Decisions\n\n## WO-999-D001\n\n\`\`\`json\n${JSON.stringify(decision)}\n\`\`\`\n`,
    );
    f.ok(f.resume(["target-records", ...actorArgs]));
    const state = readControl(f.orderRoot).orders.get("WO-999").state;
    assert.equal(
      readDecisions(f.orderRoot).find((row) => row.id === decision.id)
        .targetRecord.commit,
      state.targetRecords.commit,
    );
    writeDecisionsIndex(f.orderRoot);
    writeDecisionsIndex(f.orderRoot, { check: true });
    write(
      f.orderRoot,
      "records/evidence/WO-998/decisions.md",
      `# Decisions\n\n## WO-998-D001\n\n\`\`\`json\n${JSON.stringify({ ...decision, id: "WO-998-D001", followup: undefined, reopens: { decisionId: decision.id, observation: "The fixture contract changed." } })}\n\`\`\`\n`,
    );
    syncFollowups(f.orderRoot);
    syncFollowups(f.orderRoot, { check: true });
    const projection = JSON.parse(f.ok(f.resume(["status", "--json"])));
    assert.equal(
      projection.verificationRecord.commit,
      state.targetRecords.commit,
    );
    assert.equal(
      projection.finalReviewRecord.commit,
      state.targetRecords.commit,
    );
    assert.match(
      readFileSync(docPath(f.orderRoot, "control", "current.md"), "utf8"),
      /target@[a-f0-9]{40}:docs\/verifications/u,
    );
    const record = readDecisions(f.orderRoot).find(
      (row) => row.id === decision.id,
    ).targetRecord;
    assert.throws(
      () =>
        readTargetRecord(f.orderRoot, state, {
          ...record,
          sha256: "0".repeat(64),
        }),
      /binding differs/u,
    );
    assert.throws(
      () =>
        readTargetRecord(f.orderRoot, state, {
          ...record,
          repositoryId: "other-fixture",
        }),
      /binding differs/u,
    );
    write(f.target, record.path, "working copy is irrelevant\n");
    assert.ok(
      readTargetRecord(f.orderRoot, state, record).includes(decision.id),
    );
    const blob = git(f.target, "rev-parse", `${record.commit}:${record.path}`);
    const replacement = git(f.target, "hash-object", "-w", record.path);
    git(f.target, "replace", blob, replacement);
    assert.ok(
      readTargetRecord(f.orderRoot, state, record).includes(decision.id),
    );
    git(f.target, "replace", "-d", blob);
    const config = JSON.parse(
      readFileSync(join(f.orderRoot, "dotln.config.json"), "utf8"),
    );
    config.repositories.target.documentationRoot = "changed-documents";
    write(f.orderRoot, "dotln.config.json", JSON.stringify(config));
    assert.equal(
      readDecisions(f.orderRoot).find((row) => row.id === decision.id)
        .targetRecord.path,
      record.path,
    );
  }));

test("target publication normalizes nested links and preserves encoded paths and queries", () => {
  const options = {
    from: "docs/PR.md",
    repository: { selector: "github.com/fixture/target" },
    revision: "reviewed",
  };
  const body = absoluteBodyLinks(
    "[outer [inner]()](file%281%29.md?plain=1#here) ![image](pic.png?size=2)\n",
    options,
  );
  assert.ok(body.includes("file%281%29.md?plain=1#here"));
  assert.ok(body.includes("pic.png?size=2&raw=true"));
  assert.deepEqual(relativeLinkFailures(body), []);
  assert.equal(absoluteBodyLinks(body, options), body);
});
