import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  chmodSync,
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { unionFollowups } from "./lib/planning-followups.mjs";
import { readControl } from "./lib/control-store.mjs";
import { integrationTestCommand } from "./lib/worktree-integration.mjs";

const source = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const text = (root, path) => readFileSync(join(root, path), "utf8");
const put = (root, path, contents) => {
  mkdirSync(dirname(join(root, path)), { recursive: true });
  writeFileSync(join(root, path), contents);
};
const run = (cwd, command, args) =>
  spawnSync(command, args, {
    cwd,
    encoding: "utf8",
    maxBuffer: 32 * 1024 * 1024,
    env: { ...process.env, DOTLN_ACCOUNT_LABEL: "" },
  });
const checked = (cwd, program, args) => {
  const result = run(cwd, program, args);
  assert.equal(
    result.status,
    0,
    `${program} ${args.join(" ")}\n${result.stdout}${result.stderr}`,
  );
  return result.stdout.trim();
};
const git = (root, ...args) => checked(root, "git", args);
const entry = (name) => {
  const key = `decision:docs/evidence/WO-998/decisions.md#${name}`;
  return {
    id: `FUP-${createHash("sha256").update(key).digest("hex").slice(0, 16)}`,
    key,
    kind: "decision",
    revisions: [
      {
        hash: "a".repeat(64),
        ref: `docs/evidence/WO-998/decisions.md#${name}`,
        title: name,
        summary: name,
        missing: false,
      },
    ],
    dispositions: [
      {
        sourceRevision: 1,
        status: "open",
        reason: "fixture history",
        reopenWhen: null,
        targets: [],
        at: "2026-09-20T00:00:00Z",
      },
    ],
  };
};
const appendEntry = (root, name) => {
  const path = "docs/planning/followups.json";
  const register = JSON.parse(text(root, path));
  register.entries.push(entry(name));
  put(root, path, JSON.stringify(register, null, 2) + "\n");
};
const claim = (root, version) =>
  put(
    root,
    "README.md",
    text(root, "README.md").replace(
      /This source prepares DotLn `v[^`]+`/,
      `This source prepares DotLn \`${version}\``,
    ),
  );
const generatedConflicts = (root, name) => {
  const manifest = ".claude/harness-manifest.json";
  put(
    root,
    manifest,
    text(root, manifest).replace(
      /"compilerPackageVersion": "[^"]+"/,
      `"compilerPackageVersion": "${name}"`,
    ),
  );
  put(
    root,
    "packages/console/fixtures/expected/control.json",
    `${name} projection\n`,
  );
  const edition = "docs/publication/software-engineer-toc.md";
  put(
    root,
    edition,
    text(root, edition).replace(
      /^Source lock:.*$/m,
      `Source lock: \`sha256:${(name === "local" ? "a" : "b").repeat(64)}\``,
    ),
  );
};
const event = (workOrderId, type, extra = {}) =>
  JSON.stringify({
    schemaVersion: 1,
    recordedAt: "2026-09-20T00:00:00.000Z",
    type,
    workOrderId,
    ...extra,
  }) + "\n";

function fixture(t, { reviewed = false, third = "active" } = {}) {
  const temporary = realpathSync(
    mkdtempSync(join(tmpdir(), "dotln-integrate-test-")),
  );
  t.after(() => rmSync(temporary, { recursive: true, force: true }));
  const origin = join(temporary, "origin.git"),
    main = join(temporary, "main"),
    subject = join(temporary, "wo998");
  // Clone only Git's tracked history. No intake, credentials, ignored runtime
  // state or real remote is copied; every push below goes to this local bare repo.
  checked(temporary, "git", [
    "-c",
    "maintenance.auto=false",
    "clone",
    "--bare",
    "--no-hardlinks",
    "--quiet",
    source,
    origin,
  ]);
  git(origin, "config", "maintenance.auto", "false");
  git(origin, "config", "receive.autogc", "false");
  // The fixture's main is the source's own committed revision, not its moving
  // main, so the working-tree overlays below and the committed peers they
  // import come from one revision (WO-115 D015).
  git(
    origin,
    "update-ref",
    "refs/heads/main",
    git(source, "rev-parse", "HEAD"),
  );
  checked(temporary, "git", [
    "-c",
    "maintenance.auto=false",
    "clone",
    "--no-hardlinks",
    "--quiet",
    "--branch",
    "main",
    origin,
    main,
  ]);
  for (const [key, value] of [
    ["user.name", "Fixture"],
    ["user.email", "fixture@example.invalid"],
    ["maintenance.auto", "false"],
  ])
    git(main, "config", key, value);
  // The two entry points and the root-level peers they import statically.
  for (const path of [
    "scripts/worktree.mjs",
    "scripts/resume.mjs",
    "scripts/github-body.mjs",
    "scripts/github-repository.mjs",
    "scripts/release-notes.mjs",
  ])
    cpSync(join(source, path), join(main, path));
  // The overlay carries the whole shared library so a working-tree module and
  // its peers never split across the clone's committed copies.
  cpSync(join(source, "scripts/lib"), join(main, "scripts/lib"), {
    recursive: true,
  });
  // The library's build-free Beacon peers travel with it (WO-070).
  cpSync(join(source, "packages/beacons"), join(main, "packages/beacons"), {
    recursive: true,
  });
  for (const id of ["WO-997", "WO-998", "WO-999"]) {
    const path = `docs/work-orders/${id}-fixture.md`;
    put(
      main,
      path,
      `# ${id} — integration fixture (v9000.0.1)\n\n**Model:** any capable model.\n**Effort:** executor any; verifier any; reviewer any.\n**Release classification:** patch. Fixture.\n\n**Objective:** Preserve integration.\n\n**Non-goals:** No publication.\n`,
    );
    put(
      main,
      `docs/control/orders/${id}.jsonl`,
      event(id, "WorkOrderActivated", { workOrderPath: path }),
    );
  }
  put(
    main,
    "docs/control/orders/WO-998.jsonl",
    text(main, "docs/control/orders/WO-998.jsonl") +
      event("WO-998", "ImplementationReady") +
      event("WO-998", "VerificationRequested", {
        verificationId: "VER-001",
        reportPath: "docs/verifications/WO-998/VER-001.md",
      }) +
      event("WO-998", "VerificationCompleted", {
        verificationId: "VER-001",
        verdict: reviewed ? "pass" : "fail",
      }) +
      (reviewed
        ? event("WO-998", "FinalReviewRequested", {
            finalReviewId: "FINAL-001",
            reportPath: "docs/final-reviews/WO-998/FINAL-001.md",
          })
        : event("WO-998", "RepairRequested")),
  );
  if (third === "verifying")
    put(
      main,
      "docs/control/orders/WO-997.jsonl",
      text(main, "docs/control/orders/WO-997.jsonl") +
        event("WO-997", "ImplementationReady") +
        event("WO-997", "VerificationRequested", {
          verificationId: "VER-001",
          reportPath: "docs/verifications/WO-997/VER-001.md",
        }),
    );
  put(
    main,
    "README.md",
    text(main, "README.md").replace(
      /This source prepares DotLn `v[^`]+`/,
      "This source prepares DotLn `v9000.0.0`",
    ),
  );
  put(main, "authored-fixture.md", "base intent\n");
  git(main, "add", "-A");
  git(main, "commit", "-qm", "integration fixture base");
  git(main, "push", "-q", "origin", "main");
  git(main, "worktree", "add", "--quiet", "-b", "wo-998", subject, "main");
  // Dependencies are read-only links; workspace links point into this fixture.
  mkdirSync(join(subject, "node_modules/@dotln"), { recursive: true });
  for (const name of ["typescript", "@types", "prettier"])
    symlinkSync(
      join(source, "node_modules", name),
      join(subject, "node_modules", name),
    );
  for (const name of ["compiler", "kernel", "skeleton", "console"]) {
    symlinkSync(
      join(subject, "packages", name),
      join(subject, "node_modules/@dotln", name),
    );
    cpSync(
      join(source, "packages", name, "dist"),
      join(subject, "packages", name, "dist"),
      { recursive: true },
    );
  }
  symlinkSync(
    join(subject, "packages/beacons"),
    join(subject, "node_modules/@dotln/beacons"),
  );
  const before = git(subject, "rev-parse", "HEAD");
  if (reviewed) {
    claim(subject, "v9000.0.1");
    generatedConflicts(subject, "local");
    put(subject, "authored-fixture.md", "reviewed local intent\n");
    put(subject, "docs/lineage/decisions-index.md", "reviewed projection\n");
    appendEntry(subject, "reviewed-local");
    git(subject, "add", "-A");
    git(subject, "commit", "-qm", "reviewed fixture work");
  }
  const reviewedHead = git(subject, "rev-parse", "HEAD");
  // Main represents the already merged sibling, and publishes a colliding
  // local tag. No phase of the unrelated third order is consulted.
  put(main, "authored-fixture.md", "upstream intent\n");
  claim(main, "v9000.0.2");
  generatedConflicts(main, "upstream");
  put(main, "docs/lineage/decisions-index.md", "upstream projection\n");
  put(
    main,
    "packages/console/fixtures/expected/control.json",
    "upstream projection\n",
  );
  put(
    main,
    "CLAUDE.md",
    text(main, "CLAUDE.md").replace(
      /<!-- dotln-harness:start -->[\s\S]*?<!-- dotln-harness:end -->/,
      "<!-- dotln-harness:start -->\nupstream generated fragment\n<!-- dotln-harness:end -->",
    ),
  );
  appendEntry(main, "upstream");
  put(
    main,
    "scripts/lib/process-budget.mjs",
    text(main, "scripts/lib/process-budget.mjs") +
      "\n// fixture machinery change\n",
  );
  git(main, "add", "-A");
  git(main, "commit", "-qm", "merged sibling fixture");
  git(main, "tag", "v9000.0.1");
  git(main, "push", "-q", "origin", "main", "refs/tags/v9000.0.1");
  const upstream = git(main, "rev-parse", "HEAD");
  if (!reviewed) {
    claim(subject, "v9000.0.1");
    generatedConflicts(subject, "local");
    put(subject, "authored-fixture.md", "local intent\n");
    put(subject, "docs/lineage/decisions-index.md", "local projection\n");
    put(
      subject,
      "packages/console/fixtures/expected/control.json",
      "local projection\n",
    );
    put(
      subject,
      "CLAUDE.md",
      text(subject, "CLAUDE.md").replace(
        /<!-- dotln-harness:start -->[\s\S]*?<!-- dotln-harness:end -->/,
        "<!-- dotln-harness:start -->\nlocal generated fragment\n<!-- dotln-harness:end -->",
      ),
    );
    appendEntry(subject, "local");
  }
  put(subject, "untracked-fixture.md", "retained untracked bytes\n");
  const control = Object.fromEntries(readControl(subject).sources);
  const invoke = (...args) =>
    run(subject, process.execPath, [
      "scripts/worktree.mjs",
      "integrate",
      "WO-998",
      ...args,
    ]);
  return {
    temporary,
    origin,
    main,
    subject,
    before,
    reviewedHead,
    upstream,
    control,
    invoke,
  };
}

for (const reviewed of [false, true])
  test(`real Git ${reviewed ? "reviewed merge" : "fast-forward"} preserves recovery, histories and authored conflicts with real generators`, (t) => {
    const f = fixture(t, {
      reviewed,
      third: reviewed ? "verifying" : "active",
    });
    const first = f.invoke();
    assert.equal(first.status, 1, first.stdout + first.stderr);
    assert.match(first.stdout, /Authored conflicts: 'authored-fixture.md'/);
    const receipt = JSON.parse(
      text(f.subject, "docs/control/local/integration.json"),
    );
    assert.ok(
      receipt.checkpointRef.startsWith("refs/dotln/checkpoint/WO-998/"),
    );
    assert.equal(
      git(f.subject, "show", `${receipt.checkpointRef}:untracked-fixture.md`),
      "retained untracked bytes",
    );
    assert.ok(git(f.subject, "stash", "list").includes("WO-998 integrate"));
    assert.equal(git(f.subject, "rev-parse", "refs/stash"), receipt.stash);
    assert.equal(
      git(f.subject, "rev-parse", "HEAD"),
      reviewed ? f.reviewedHead : f.upstream,
    );
    assert.match(
      text(f.subject, "authored-fixture.md"),
      /<<<<<<<.*\n[\s\S]*=======\n[\s\S]*>>>>>>>/,
    );
    if (!reviewed) {
      assert.match(
        text(f.subject, "docs/work-orders/WO-998-fixture.md"),
        /v9000\.0\.2/,
      );
      assert.match(
        text(f.subject, "docs/evidence/WO-998/decisions.md"),
        /Carried-forward claims: \*\*reviewer to complete/,
      );
      assert.deepEqual(receipt.pending, [], first.stdout);
    }
    put(
      f.subject,
      "authored-fixture.md",
      "reviewer retained local and upstream intent\n",
    );
    git(f.subject, "add", "authored-fixture.md");
    const hookDir = join(dirname(f.subject), "failing-hooks");
    mkdirSync(hookDir, { recursive: true });
    for (const name of ["pre-commit", "prepare-commit-msg", "post-commit"])
      writeFileSync(
        join(hookDir, name),
        `#!/bin/sh\nprintf invoked > '${join(dirname(f.subject), "hook-called")}'\nexit 1\n`,
        { mode: 0o755 },
      );
    git(f.subject, "config", "core.hooksPath", hookDir);
    const continued = f.invoke("--continue");
    assert.ok(
      !existsSync(join(dirname(f.subject), "hook-called")),
      "helper disables all commit hooks",
    );
    git(f.subject, "config", "--unset", "core.hooksPath");
    assert.equal(continued.status, 0, continued.stdout + continued.stderr);
    const after = JSON.parse(
      text(f.subject, "docs/control/local/integration.json"),
    );
    assert.equal(after.complete, true);
    assert.equal(after.phase, reviewed ? "final-review" : "repairing");
    const decision = [
      ...text(f.subject, "docs/evidence/WO-998/decisions.md").matchAll(
        /```json\n([\s\S]*?)\n```/g,
      ),
    ]
      .map((match) => JSON.parse(match[1]))
      .find((row) => row.evidence?.includes(after.checkpointRef));
    assert.equal(
      decision?.dispatch,
      `resume: ${reviewed ? "final review" : "fix"}; worktree integrate WO-998`,
    );
    assert.equal(after.preservationCommit, after.checkpointSha);
    assert.equal(
      after.checkpointRef,
      receipt.checkpointRef,
      "continuation must not create another checkpoint",
    );
    assert.equal(
      git(f.subject, "rev-parse", "refs/stash"),
      receipt.stash,
      "stash was kept",
    );
    assert.equal(
      text(f.subject, "untracked-fixture.md"),
      "retained untracked bytes\n",
    );
    const register = JSON.parse(
      text(f.subject, "docs/planning/followups.json"),
    );
    for (const name of [reviewed ? "reviewed-local" : "local", "upstream"])
      assert.deepEqual(
        register.entries.find((row) => row.id === entry(name).id),
        entry(name),
      );
    assert.deepEqual(
      Object.fromEntries(readControl(f.subject).sources),
      f.control,
    );
    assert.match(continued.stdout, /npm test -- --review/);
    assert.match(continued.stdout, /npm run publication:check/);
    assert.match(continued.stdout, /node scripts\/harness.mjs check/);
    checked(f.subject, process.execPath, ["scripts/harness.mjs", "check"]);
    checked(f.subject, process.execPath, [
      "scripts/console-fixtures.mjs",
      "--check",
    ]);
    checked(f.subject, process.execPath, ["scripts/check-publication.mjs"]);
    checked(f.subject, process.execPath, [
      "scripts/work-orders.mjs",
      "index",
      "--check",
    ]);
    if (reviewed) {
      assert.equal(
        git(f.subject, "rev-parse", "HEAD"),
        after.mergeCommit,
        "helper records its merge commit",
      );
      assert.equal(
        git(f.subject, "show", "-s", "--format=%P", after.mergeCommit),
        `${f.reviewedHead} ${f.upstream}`,
      );
      assert.notEqual(
        run(f.subject, "git", ["rev-parse", "--verify", "MERGE_HEAD"]).status,
        0,
      );
    }
    // Both cases assert the retime and the stub here: in the reviewed case the
    // generators only run after the authored resolution, so the first invoke
    // cannot witness them. Printed values are read back, never asserted twice.
    const heading = text(f.subject, "docs/work-orders/WO-998-fixture.md").split(
      "\n",
    )[0];
    assert.match(heading, /v9000\.0\.2/, "the colliding target is retimed");
    assert.match(
      text(f.subject, "docs/evidence/WO-998/decisions.md"),
      /Carried-forward claims: \*\*reviewer to complete/,
    );
    console.log(
      JSON.stringify({
        case: reviewed ? "reviewed merge" : "fast-forward",
        checkpoint: after.checkpointRef,
        retainedStash: after.stash,
        retimed: heading.match(/v\d+\.\d+\.\d+/)[0],
        unchangedControl: true,
        realGenerators: true,
      }),
    );
  });

test("three required refusals leave the tree, index, HEAD and recovery refs unchanged", (t) => {
  const f = fixture(t);
  const snapshot = () => ({
    head: git(f.subject, "rev-parse", "HEAD"),
    diff: git(f.subject, "diff", "--binary", "HEAD"),
    status: git(f.subject, "status", "--porcelain", "--untracked-files=all"),
    refs: git(
      f.subject,
      "for-each-ref",
      "--format=%(refname) %(objectname)",
      "refs/dotln",
      "refs/stash",
    ),
    index: readFileSync(git(f.subject, "rev-parse", "--git-path", "index")),
  });
  const original = snapshot();
  const mismatch = run(f.subject, process.execPath, [
    "scripts/worktree.mjs",
    "integrate",
    "WO-999",
  ]);
  assert.notEqual(mismatch.status, 0);
  assert.match(mismatch.stderr, /matching wo-NNN/);
  assert.deepEqual(snapshot(), original);
  git(
    f.subject,
    "remote",
    "set-url",
    "origin",
    join(f.temporary, "absent.git"),
  );
  const missing = f.invoke();
  assert.notEqual(missing.status, 0);
  assert.deepEqual(snapshot(), original);
  git(f.subject, "remote", "set-url", "origin", f.origin);
  put(f.subject, "docs/intake/fixture.md", "private fixture intake\n");
  const intake = f.invoke();
  assert.notEqual(intake.status, 0);
  assert.match(intake.stderr, /intake-backup/);
  assert.deepEqual(snapshot(), original);
  assert.equal(
    text(f.subject, "docs/intake/fixture.md"),
    "private fixture intake\n",
  );
  checked(f.subject, "zip", [
    "-q",
    join(f.temporary, "named-backup.zip"),
    "docs/intake/fixture.md",
  ]);
  put(f.subject, "docs/intake/fixture.md", "changed after backup\n");
  const stale = f.invoke(
    "--intake-backup",
    join(f.temporary, "named-backup.zip"),
  );
  assert.notEqual(stale.status, 0);
  assert.match(stale.stderr, /does not preserve/);
  assert.deepEqual(snapshot(), original);
  put(f.subject, "docs/intake/fixture.md", "private fixture intake\n");
  const admitted = f.invoke(
    "--intake-backup",
    join(f.temporary, "named-backup.zip"),
  );
  assert.match(
    admitted.stdout,
    /Checkpoint:/,
    admitted.stdout + admitted.stderr,
  );
  assert.equal(
    text(f.subject, "docs/intake/fixture.md"),
    "private fixture intake\n",
  );
});

test("an intent-to-add entry is refused before any write, and a failed stash leaves no pending receipt", (t) => {
  const f = fixture(t);
  const receiptPath = join(f.subject, "docs/control/local/integration.json");
  const snapshot = () => ({
    head: git(f.subject, "rev-parse", "HEAD"),
    stage: git(f.subject, "ls-files", "--stage"),
    status: git(f.subject, "status", "--porcelain", "--untracked-files=all"),
    refs: git(
      f.subject,
      "for-each-ref",
      "--format=%(refname) %(objectname)",
      "refs/dotln",
      "refs/stash",
    ),
    stashes: git(f.subject, "stash", "list"),
    receipt: existsSync(receiptPath),
  });
  put(f.subject, "intent to add.md", "marked with git add -N\n");
  git(f.subject, "add", "-N", "intent to add.md");
  const original = snapshot();
  const refused = f.invoke();
  assert.notEqual(refused.status, 0, refused.stdout + refused.stderr);
  assert.match(refused.stderr, /intent-to-add/);
  assert.match(refused.stderr, /'intent to add\.md'/);
  assert.match(refused.stderr, /git add -- 'intent to add\.md'/);
  assert.deepEqual(snapshot(), original);
  assert.equal(original.receipt, false);
  assert.equal(original.stashes, "");
  git(f.subject, "add", "--", "intent to add.md");
  // Any other failure of the stash push (here a held index lock) happens after
  // the checkpoint; nothing is stashed, so no pending receipt may remain.
  const lock = resolve(
    f.subject,
    git(f.subject, "rev-parse", "--git-path", "index.lock"),
  );
  writeFileSync(lock, "");
  const staged = snapshot();
  const failed = f.invoke();
  rmSync(lock);
  assert.notEqual(failed.status, 0, failed.stdout + failed.stderr);
  assert.match(failed.stderr, /index\.lock/);
  assert.equal(existsSync(receiptPath), false);
  assert.equal(git(f.subject, "stash", "list"), "");
  assert.equal(git(f.subject, "rev-parse", "HEAD"), staged.head);
  assert.equal(git(f.subject, "ls-files", "--stage"), staged.stage);
  const fresh = f.invoke();
  assert.equal(fresh.status, 1, fresh.stdout + fresh.stderr);
  assert.match(fresh.stdout, /Authored conflicts: 'authored-fixture.md'/);
  assert.equal(text(f.subject, "intent to add.md"), "marked with git add -N\n");
});

test("a stash Git stores and then fails to finish resumes with --continue; --continue refuses intent-to-add entries", (t) => {
  const f = fixture(t);
  const receiptPath = join(f.subject, "docs/control/local/integration.json");
  // Git stores the stash and then cannot remove an untracked file inside a
  // read-only directory, so the push exits non-zero after moving the work.
  put(f.subject, "locked/untracked.md", "locked untracked bytes\n");
  chmodSync(join(f.subject, "locked"), 0o555);
  t.after(() => {
    if (existsSync(join(f.subject, "locked")))
      chmodSync(join(f.subject, "locked"), 0o755);
  });
  const head = git(f.subject, "rev-parse", "HEAD");
  const failed = f.invoke();
  assert.notEqual(failed.status, 0, failed.stdout + failed.stderr);
  assert.match(
    failed.stderr,
    /stash push stored ([0-9a-f]{40}) and then failed; nothing was merged/,
  );
  const retained = /stash push stored ([0-9a-f]{40})/.exec(failed.stderr)[1];
  assert.match(failed.stderr, /--continue once the tree is clean/);
  const pending = JSON.parse(readFileSync(receiptPath, "utf8"));
  assert.equal(pending.stage, "preserved");
  assert.equal(pending.stash, retained);
  assert.equal(git(f.subject, "rev-parse", "HEAD"), head);
  assert.equal(
    git(f.subject, "show", `${retained}^3:locked/untracked.md`),
    "locked untracked bytes",
  );
  // A dirty tree cannot resume: the retained stash already holds the work.
  chmodSync(join(f.subject, "locked"), 0o755);
  const dirty = f.invoke("--continue");
  assert.notEqual(dirty.status, 0);
  assert.match(
    dirty.stderr,
    /holds this integration's work but the tree is not clean/,
  );
  git(f.subject, "reset", "-q", "--hard", "HEAD");
  git(f.subject, "clean", "-q", "-f", "-d");
  // An intent-to-add entry is refused at --continue before anything moves.
  put(f.subject, "late.md", "marked late\n");
  git(f.subject, "add", "-N", "late.md");
  const receiptBytes = readFileSync(receiptPath);
  const marked = f.invoke("--continue");
  assert.notEqual(marked.status, 0);
  assert.match(
    marked.stderr,
    /refuses intent-to-add entries.*'late\.md'.*--continue again/,
  );
  assert.deepEqual(readFileSync(receiptPath), receiptBytes);
  git(f.subject, "rm", "-q", "--cached", "late.md");
  rmSync(join(f.subject, "late.md"));
  // WO-160: simulate a crash after Git saved the named stash but before the
  // helper recorded its SHA. The tree is clean and --continue must adopt it.
  const stranded = JSON.parse(readFileSync(receiptPath, "utf8"));
  stranded.stash = null;
  writeFileSync(receiptPath, JSON.stringify(stranded));
  const resumed = f.invoke("--continue");
  assert.equal(resumed.status, 1, resumed.stdout + resumed.stderr);
  assert.match(resumed.stdout, /Authored conflicts: 'authored-fixture.md'/);
  const merged = JSON.parse(readFileSync(receiptPath, "utf8"));
  assert.equal(merged.stash, retained);
  assert.notEqual(merged.stage, "preserved");
});

test("a later stash failure with nothing stashed restores the completed receipt it replaced", (t) => {
  const f = fixture(t);
  const receiptPath = join(f.subject, "docs/control/local/integration.json");
  const first = f.invoke();
  assert.equal(first.status, 1, first.stdout + first.stderr);
  put(
    f.subject,
    "untracked-fixture.md",
    readFileSync(join(f.subject, "untracked-fixture.md"), "utf8"),
  );
  put(f.subject, "authored-fixture.md", "explicitly combined intent\n");
  git(f.subject, "add", "authored-fixture.md");
  const done = f.invoke("--continue");
  assert.equal(done.status, 0, done.stdout + done.stderr);
  const completed = readFileSync(receiptPath);
  assert.equal(JSON.parse(completed).complete, true);
  put(f.subject, "authored-fixture.md", "work after integration\n");
  const lock = resolve(
    f.subject,
    git(f.subject, "rev-parse", "--git-path", "index.lock"),
  );
  writeFileSync(lock, "");
  const failed = f.invoke();
  rmSync(lock);
  assert.notEqual(failed.status, 0);
  assert.match(
    failed.stderr,
    /nothing was stashed and no pending receipt remains/,
  );
  assert.deepEqual(readFileSync(receiptPath), completed);
});

test("follow-up union preserves compatible histories and refuses divergent same-entry histories", () => {
  const a = entry("same"),
    b = structuredClone(a);
  b.revisions.push({
    ...a.revisions[0],
    hash: "b".repeat(64),
    summary: "next",
  });
  const state = (entries) => ({ schemaVersion: 1, entries });
  assert.deepEqual(unionFollowups(state([a]), state([b])).entries, [b]);
  const incompatible = structuredClone(b);
  incompatible.revisions[1].summary = "different";
  assert.throws(
    () => unionFollowups(state([b]), state([incompatible])),
    /divergent history/,
  );
  assert.equal(a.revisions.length, 1, "input is immutable");
});

test("untracked stash collision remains explicit and recoverable until continuation", (t) => {
  const f = fixture(t);
  put(f.main, "untracked-fixture.md", "upstream authored addition\n");
  git(f.main, "add", "untracked-fixture.md");
  git(f.main, "commit", "-qm", "upstream untracked collision");
  git(f.main, "push", "-q", "origin", "main");
  const first = f.invoke();
  assert.equal(first.status, 1, first.stdout + first.stderr);
  assert.match(
    first.stdout,
    /Untracked stash collisions require explicit resolution/,
  );
  const receipt = JSON.parse(
    text(f.subject, "docs/control/local/integration.json"),
  );
  assert.deepEqual(receipt.untrackedConflicts, ["untracked-fixture.md"]);
  assert.equal(
    git(f.subject, "show", `${receipt.stash}^3:untracked-fixture.md`),
    "retained untracked bytes",
  );
  put(
    f.subject,
    "untracked-fixture.md",
    "explicitly combined upstream and local addition\n",
  );
  put(f.subject, "authored-fixture.md", "explicitly combined intent\n");
  git(f.subject, "add", "untracked-fixture.md", "authored-fixture.md");
  const continued = f.invoke("--continue");
  assert.equal(continued.status, 0, continued.stdout + continued.stderr);
  assert.equal(
    text(f.subject, "untracked-fixture.md"),
    "explicitly combined upstream and local addition\n",
  );
  assert.equal(git(f.subject, "rev-parse", "refs/stash"), receipt.stash);
});

test("printed checks use the runner's declared machinery sources, including package code", async (t) => {
  const root = realpathSync(
    mkdtempSync(join(tmpdir(), "dotln-integrate-checks-")),
  );
  t.after(() => rmSync(root, { recursive: true, force: true }));
  git(root, "init", "-q", "-b", "main");
  git(root, "config", "user.name", "Fixture");
  git(root, "config", "user.email", "fixture@example.invalid");
  put(root, "packages/compiler/src/verification.ts", "// baseline\n");
  git(root, "add", "-A");
  git(root, "commit", "-qm", "baseline");
  assert.equal(await integrationTestCommand(root, "HEAD"), "npm test");
  put(
    root,
    "packages/compiler/src/verification.ts",
    "// changed machinery source\n",
  );
  assert.equal(
    await integrationTestCommand(root, "HEAD"),
    "npm test -- --review",
  );
});
