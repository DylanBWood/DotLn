import { copyFixtureFiles } from "./lib/fixture-inputs.mjs";
import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  cpSync,
  chmodSync,
  existsSync,
  lstatSync,
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
import { dirname, join } from "node:path";
import { TOOL_ROOT, docPath } from "./lib/config.mjs";
import { redactPaths, releaseCloseCommand, runGit } from "./lib/git.mjs";
import { assertFinderMetadataTypes } from "./lib/finder-metadata.mjs";
import { write } from "./lib/helpers.mjs";
import { checkTargetHarness, runtimeModuleDirectory } from "./lib/harness.mjs";
import {
  cloneMapPath,
  readTargetStart,
  reviewedTargetSubject,
  staleOrderHostRules,
  targetRegistryPath,
} from "./lib/target-worktrees.mjs";
import { readControl } from "./lib/control-store.mjs";
import { installBeaconFixture } from "./test-beacon-fixture.mjs";
import {
  installTargetPublicationFixture,
  publicationVocabulary,
  publicationGrant,
} from "./test-target-publication-fixture.mjs";
import { createHash } from "node:crypto";
import {
  gateTreeHash,
  readGateChecks,
  recordGateChecks,
  checksPath,
} from "./lib/gate-evidence.mjs";

const git = (root, ...args) => runGit(root, args);
const recordTreeSnapshot = (root) => {
  const rows = [];
  const visit = (prefix = "") => {
    for (const name of readdirSync(join(root, prefix)).sort()) {
      if (!prefix && name === ".git") continue;
      const path = prefix ? `${prefix}/${name}` : name;
      const file = join(root, path),
        stat = lstatSync(file);
      if (stat.isDirectory()) {
        rows.push({ path, mode: stat.mode, directory: true });
        visit(path);
      } else
        rows.push({
          path,
          mode: stat.mode,
          sha256: createHash("sha256")
            .update(
              stat.isSymbolicLink() ? readlinkSync(file) : readFileSync(file),
            )
            .digest("hex"),
        });
    }
  };
  visit();
  return rows;
};
const runtimePackages = Object.keys(
  JSON.parse(readFileSync(join(TOOL_ROOT, "package-lock.json"), "utf8"))
    .packages,
)
  .filter((name) => /^packages\/[^/]+$/.test(name))
  .map((name) => name.slice("packages/".length));
const actor = {
  harness: "human",
  harnessVersion: "not-applicable",
  model: "human",
  effort: "unknown",
  source: "operator-attested",
};
const actorArgs = [
  "--harness",
  actor.harness,
  "--harness-version",
  actor.harnessVersion,
  "--model",
  actor.model,
  "--effort",
  actor.effort,
  "--source",
  actor.source,
];
const profile = {
  authorityEnvelopeId: "fixture.target",
  allowedEffects: ["repo.read", "repo.write", "repo.test"],
  deniedEffects: ["repo.push"],
  resourceLimits: {},
  requiredEvidence: [],
  expiresAt: Number.MAX_SAFE_INTEGER,
  revocationEventTypes: [],
};
const fixture = (base, { baseIgnore } = {}) => {
  symlinkSync(join(TOOL_ROOT, "node_modules"), join(base, "node_modules"));
  const env = { ...process.env, DOTLN_FIXTURE_RUNTIME: TOOL_ROOT };
  for (const key of [
    "CODEX_THREAD_ID",
    "COPILOT_AGENT_SESSION_ID",
    "CLAUDE_EFFORT",
    "DOTLN_LAUNCHPAD",
    "DOTLN_ACCOUNT_LABEL",
  ])
    delete env[key];
  const repository = (name) => {
    const origin = join(base, `${name}.git`);
    const root = join(base, name);
    mkdirSync(origin);
    git(origin, "init", "--bare", "-q", "-b", "main");
    git(base, "clone", "-q", origin, root);
    git(root, "config", "user.email", "fixture@example.invalid");
    git(root, "config", "user.name", "Fixture");
    return root;
  };
  const clone = repository("target");
  write(clone, "source.txt", "declared base\n");
  if (baseIgnore) write(clone, ".gitignore", baseIgnore);
  git(clone, "add", "-A");
  git(clone, "commit", "-qm", "Target base");
  const baseCommit = git(clone, "rev-parse", "HEAD");
  write(clone, "later.txt", "not in declared base\n");
  git(clone, "add", "-A");
  git(clone, "commit", "-qm", "Later base change");
  git(clone, "push", "-qu", "origin", "main");
  const main = repository("launchpad");
  const parent = join(base, "Targets");
  mkdirSync(parent);
  const orderRoot = join(base, "launchpad-wo999");
  const target = join(parent, "target-wo999");
  const order = "records/work-orders/WO-999-fixture.md";
  const config = {
    version: 1,
    roots: { docs: "records", control: "records/state" },
    classes: { fixture: { checks: [], supports: [] } },
    repositories: {
      target: {
        baseBranch: "main",
        worktreeParent: "../Targets",
        repositoryClass: "fixture",
        authorityProfile: profile,
        gate: {
          commands: {
            test: {
              argv: [
                process.execPath,
                "-e",
                "if (!require('node:fs').existsSync('source.txt')) process.exit(2)",
              ],
              timeoutMs: 5000,
            },
          },
          plain: ["test"],
          review: ["test"],
        },
      },
    },
  };
  write(main, "dotln.config.json", JSON.stringify(config));
  write(
    main,
    order,
    `# WO-999 — target lifecycle fixture\n\n**Model:** any.\n**Effort:** executor any; verifier any; reviewer any.\n**Repository:** target @ ${baseCommit}\n`,
  );
  write(
    main,
    ".gitignore",
    "/records/state/local/\n/docs/control/local/\n.control-beacons/\ndist/\nnode_modules/\n.runtime/\n",
  );
  write(main, "package.json", '{"private":true}\n');
  mkdirSync(join(main, "scripts"));
  copyFixtureFiles(
    TOOL_ROOT,
    main,
    "scripts/test-target-worktree.fixture-inputs.json",
  );
  cpSync(join(TOOL_ROOT, "scripts/lib"), join(main, "scripts/lib"), {
    recursive: true,
  });
  installBeaconFixture(main);
  cpSync(
    join(TOOL_ROOT, "packages/skeleton/src/evidence-editions.mjs"),
    join(main, "packages/skeleton/src/evidence-editions.mjs"),
  );
  // The fixture's bootstrap provides the installed build without a dependency
  // install; both launchpad worktrees still run the real lifecycle commands.
  write(
    main,
    "scripts/bootstrap.mjs",
    `import { cpSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
if (process.env.DOTLN_FIXTURE_BOOTSTRAP_FAIL) process.exit(7);
for (const name of ${JSON.stringify(runtimePackages)}) {
  const source = join(process.env.DOTLN_FIXTURE_RUNTIME, "packages", name);
  const dest = join(process.cwd(), "packages", name);
  mkdirSync(dest, { recursive: true });
  cpSync(join(source, "package.json"), join(dest, "package.json"));
  if (existsSync(join(source, "dist")) && !existsSync(join(dest, "dist"))) cpSync(join(source, "dist"), join(dest, "dist"), { recursive: true });
}\n`,
  );
  for (const name of runtimePackages) {
    const source = join(TOOL_ROOT, "packages", name);
    mkdirSync(join(main, "packages", name), { recursive: true });
    cpSync(
      join(source, "package.json"),
      join(main, "packages", name, "package.json"),
    );
    const modules = runtimeModuleDirectory(source);
    if (modules && !existsSync(join(main, "packages", name, modules)))
      cpSync(join(source, modules), join(main, "packages", name, modules), {
        recursive: true,
      });
  }
  git(main, "add", "-A");
  git(main, "commit", "-qm", "Launchpad fixture");
  git(main, "push", "-qu", "origin", "main");
  const call = (root, scriptRoot, script, args, override = {}) =>
    spawnSync(
      process.execPath,
      [join(scriptRoot, "scripts", `${script}.mjs`), ...args],
      {
        cwd: root,
        env: { ...env, ...override },
        encoding: "utf8",
        maxBuffer: 4 * 1024 * 1024,
      },
    );
  const ok = (result) => {
    assert.equal(result.status, 0, result.stderr || result.stdout);
    return result.stdout;
  };
  const worktree = (...args) => call(main, main, "worktree", args);
  const start = () => ok(worktree("start", "WO-999", order));
  const mapClone = () => ok(worktree("clone", "target", clone));
  const resume = (args, override = {}, cwd = target, scriptRoot = orderRoot) =>
    call(cwd, scriptRoot, "resume", args, override);
  const close = (...args) =>
    call(main, main, "release", ["close", "WO-999", ...args]);
  return {
    base,
    env,
    main,
    clone,
    parent,
    target,
    orderRoot,
    order,
    config,
    baseCommit,
    call,
    ok,
    worktree,
    start,
    mapClone,
    resume,
    close,
  };
};

const withFixture = (run, options) => {
  const base = realpathSync(
    mkdtempSync(join(tmpdir(), "dotln-target-worktree-")),
  );
  try {
    return run(fixture(base, options));
  } finally {
    rmSync(base, { recursive: true, force: true });
  }
};
const prepareFinalReview = (f, override = {}, verificationSuffix = "") => {
  f.ok(
    f.call(
      f.orderRoot,
      f.orderRoot,
      "target-gate",
      ["WO-999", "--review"],
      override,
    ),
  );
  f.ok(f.resume(["implementation-ready", ...actorArgs], override));
  f.ok(f.resume(["verify"], override));
  const verification = docPath(
    f.orderRoot,
    "verifications",
    "WO-999/VER-001.md",
  );
  write(
    f.orderRoot,
    "records/verifications/WO-999/VER-001.md",
    `# Verification fixture\n\n**Actor attestation:** ${JSON.stringify(actor)}\n\n**Process cost:** unknown; cause no-session\n${verificationSuffix}`,
  );
  f.ok(f.resume(["verification-result", "pass", ...actorArgs], override));
  f.ok(f.resume(["final-review"], override));
  const finalReview = docPath(
    f.orderRoot,
    "finalReviews",
    "WO-999/FINAL-001.md",
  );
  write(
    f.orderRoot,
    "records/final-reviews/WO-999/FINAL-001.md",
    `# Final fixture\n\n**Actor attestation:** ${JSON.stringify(actor)}\n\n**Process cost:** unknown; cause no-session\n`,
  );
  return { verification, finalReview };
};
const closeOrder = (f, override = {}, verificationSuffix = "") => {
  const reports = prepareFinalReview(f, override, verificationSuffix);
  f.ok(f.resume(["final-review-result", "pass", ...actorArgs], override));
  return reports;
};

const publicationSetup = (f) => {
  f.config.repositories.target.authorityProfile = {
    ...profile,
    allowedEffects: [...profile.allowedEffects, "repo.push", "pr.open"],
    deniedEffects: [],
  };
  write(f.main, "dotln.config.json", JSON.stringify(f.config));
  write(
    f.main,
    "records/state/outward-vocabulary.json",
    JSON.stringify(publicationVocabulary),
  );
  write(f.main, "records/state/local/terms.txt", "Private Fixture Term\n");
  write(
    f.main,
    "packages/skeleton/loadouts/grants.json",
    JSON.stringify([publicationGrant]),
  );
  git(f.main, "add", "-A");
  git(f.main, "commit", "-qm", "test: declare publication policy");
  git(f.main, "push", "-q", "origin", "main");
  const url = "https://github.com/dotln-fixture/target.git";
  const forge = installTargetPublicationFixture(f.base, f.env, [
    { url, origin: join(f.base, "target.git") },
  ]);
  git(f.clone, "remote", "set-url", "origin", url);
  return forge;
};

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
    noPublish(/GitHub/u);
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
      ["planning/.jsonl", "/home/fixture-user/x"],
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

test("target gate runs selected commands with failures, deadlines and tree mutation evidence", () =>
  withFixture((f) => {
    f.config.repositories.target.gate = {
      commands: {
        pass: {
          argv: [process.execPath, "-e", "console.log('synthetic output')"],
          timeoutMs: 5000,
        },
        fail: {
          argv: [
            process.execPath,
            "-e",
            "console.error('synthetic failure'); process.exit(2)",
          ],
          timeoutMs: 5000,
        },
        slow: {
          argv: [process.execPath, "-e", "setTimeout(() => {}, 10000)"],
          timeoutMs: 150,
        },
        untracked: {
          argv: [
            process.execPath,
            "-e",
            "require('node:fs').writeFileSync('new.txt', 'changed')",
          ],
          timeoutMs: 5000,
        },
        mutate: {
          argv: [
            process.execPath,
            "-e",
            "require('node:fs').writeFileSync('source.txt', 'changed')",
          ],
          timeoutMs: 5000,
        },
        after: {
          argv: [process.execPath, "-e", "process.exit(0)"],
          timeoutMs: 5000,
        },
        restore: {
          argv: [
            process.execPath,
            "-e",
            "const fs=require('node:fs'); fs.writeFileSync('source.txt', 'declared base\\n'); fs.unlinkSync('new.txt')",
          ],
          timeoutMs: 5000,
        },
        "move-head": {
          argv: [
            "git",
            "commit",
            "--allow-empty",
            "-qm",
            "test: gate mutation",
          ],
          timeoutMs: 5000,
        },
        "last-pass": {
          argv: [process.execPath, "-e", "process.exit(0)"],
          timeoutMs: 5000,
        },
      },
      plain: ["pass"],
      review: [
        "pass",
        "fail",
        "slow",
        "untracked",
        "mutate",
        "after",
        "restore",
        "move-head",
        "last-pass",
      ],
    };
    write(f.main, "dotln.config.json", JSON.stringify(f.config));
    git(f.main, "add", "-A");
    git(f.main, "commit", "-qm", "test: declare gates");
    git(f.main, "push", "-q", "origin", "main");
    f.mapClone();
    f.start();
    const treeHash = gateTreeHash(f.target);
    f.ok(f.call(f.orderRoot, f.orderRoot, "target-gate", ["WO-999"]));
    const plain = readGateChecks(f.orderRoot)
      .filter((row) => row.checkId === "target:target")
      .at(-1);
    assert.deepEqual(plain.names, ["pass"]);
    assert.equal(plain.treeHash, treeHash);
    assert.equal(plain.exitCode, 0);
    const result = f.call(f.orderRoot, f.orderRoot, "target-gate", [
      "WO-999",
      "--review",
    ]);
    assert.equal(result.status, 1);
    assert.match(result.stdout, /FAIL target target fail/u);
    const failingOutput = result.stdout.match(
      /FAIL target target fail[^\n]*; output: ([^\n]+)/u,
    )?.[1];
    assert.ok(failingOutput, result.stdout);
    assert.match(readFileSync(failingOutput, "utf8"), /synthetic failure/u);
    assert.match(result.stdout, /FAIL target target slow/u);
    assert.match(result.stdout, /untracked .*changed target bytes/u);
    assert.match(result.stdout, /mutate .*changed target bytes/u);
    assert.match(result.stdout, /PASS target target after/u);
    assert.match(result.stdout, /restore .*changed target bytes/u);
    assert.match(result.stdout, /move-head .*changed target bytes or HEAD/u);
    assert.match(result.stdout, /PASS target target last-pass/u);
    const rows = readGateChecks(f.orderRoot);
    const after = rows.find((row) => row.checkId === "target:target:after");
    const last = rows.find((row) => row.checkId === "target:target:last-pass");
    assert.equal(after.exitCode, 0);
    assert.notEqual(after.treeHash, treeHash);
    assert.equal(last.exitCode, 0);
    assert.equal(last.treeHash, treeHash);
    assert.equal(last.commit, git(f.target, "rev-parse", "HEAD"));
    assert.notEqual(last.commit, after.commit);
    assert.equal(
      rows.filter((row) => row.checkId === "target:target").at(-1).exitCode,
      1,
    );
    assert.equal(
      rows.filter((row) => row.checkId.startsWith("target:target:")).length,
      10,
    );
    const output = rows.find((row) => row.outputRef).outputRef;
    assert.match(
      readFileSync(join(f.orderRoot, output), "utf8"),
      /synthetic output/u,
    );
    assert.equal(git(f.orderRoot, "check-ignore", output), output);
    const recorded = readFileSync(checksPath(f.orderRoot));
    delete f.config.repositories.target.gate;
    write(f.orderRoot, "dotln.config.json", JSON.stringify(f.config));
    const missing = f.call(f.orderRoot, f.orderRoot, "target-gate", ["WO-999"]);
    assert.equal(missing.status, 1);
    assert.match(missing.stderr, /gate is missing/u);
    assert.deepEqual(readFileSync(checksPath(f.orderRoot)), recorded);
  }));

// The launchpad commands a target order's text tells its session to run. A
// session works in the target worktree, where a bare npm run form reads the
// target's own package.json, so each is printed in the start handoff's form:
// DOTLN_LAUNCHPAD naming the order launchpad and node running that
// launchpad's own script. `run` executes one there as printed, with its
// placeholders filled.
const launchpadCommands = (f, text) => {
  assert.doesNotMatch(text, /npm run (?:resume|worktree|plan|adjacent) --/u);
  const unquote = (value) => value.slice(1, -1).replaceAll("'\\''", "'");
  return [
    // The actor placeholder holds a space; read it as one token.
    ...text
      .replaceAll("<actor flags>", "<actor-flags>")
      .matchAll(
        /DOTLN_LAUNCHPAD=('[^']*') node ('[^']*') ([a-z-]+)((?: (?:[-<"[0-9]|WO-|sha256:)(?:[^\s,)]*[^\s,.)])?)*)/gu,
      ),
  ].map(([printed, launchpad, script, action, args]) => {
    assert.equal(unquote(launchpad), f.orderRoot, printed);
    assert.ok(existsSync(unquote(script)), printed);
    const filled = args
      .replace(
        /--harness <harness> .*\[--account-label <label>\]/u,
        actorArgs.join(" "),
      )
      .replaceAll("<actor-flags>", actorArgs.join(" "))
      .replaceAll("<type>/<slug>", "fix/printed")
      .replace(/"?<title>"?/gu, "printed")
      .replaceAll("<text>", "printed")
      .replaceAll("sha256:<digest>", `sha256:${"0".repeat(64)}`)
      .replace(/<[a-z-]*path>/gu, "reviewed-body.md")
      .replaceAll("<request.json>", join(f.base, "queue-request.json"));
    assert.doesNotMatch(filled, /[<>]/u, printed);
    return {
      command: `${unquote(script).slice(f.orderRoot.length + 1)} ${action}`,
      run: () =>
        spawnSync(
          "/bin/sh",
          [
            "-c",
            `DOTLN_LAUNCHPAD=${launchpad} node ${script} ${action}${filled}`,
          ],
          { cwd: f.target, env: f.env, encoding: "utf8" },
        ),
    };
  });
};
const printedCommands = [
  "scripts/resume.mjs target-records",
  "scripts/worktree.mjs publish",
  "scripts/worktree.mjs publish",
];
const documentGate = "scripts/test-runner.mjs --document";
const names = (commands) => commands.map(({ command }) => command);

test("target briefings name a missing repository throughout dispatch and print launchpad commands that resolve from the target worktree", () => {
  withFixture((f) => {
    write(
      f.main,
      f.order,
      `# WO-999 — target lifecycle fixture\n\n**Model:** any.\n**Effort:** executor any; verifier any; reviewer any.\n**Repository:** target @ ${f.baseCommit}\n\n**Acceptance criteria (all required)**\n\n1. Prose only.\n`,
    );
    git(f.main, "add", "-A");
    git(f.main, "commit", "-qm", "Order with one criterion");
    git(f.main, "push", "-q", "origin", "main");
    f.mapClone();
    f.start();
    const configFile = join(f.orderRoot, "dotln.config.json");
    const restore = () => writeFileSync(configFile, JSON.stringify(f.config));
    const missing = (args, phase) => {
      writeFileSync(
        configFile,
        JSON.stringify({
          ...f.config,
          repositories: { other: f.config.repositories.target },
        }),
      );
      const output = f.ok(f.resume(args, {}, f.orderRoot));
      assert.match(output, /repositories\.target.*not registered/u);
      assert.doesNotMatch(output, /Cannot read properties|TypeError/u);
      assert.equal(
        JSON.parse(f.ok(f.resume(["status", "--json"], {}, f.orderRoot))).phase,
        phase,
      );
      assert.match(
        f.ok(f.resume(["briefing"], {}, f.orderRoot)),
        /repositories\.target.*not registered/u,
      );
      restore();
    };
    missing(["next"], "active");
    f.ok(
      f.call(f.orderRoot, f.orderRoot, "target-gate", ["WO-999", "--review"]),
    );
    // With the Follow-up Queue equipped through the repair, each briefing's
    // queue command is in the same form and reaches the launchpad's own queue:
    // a request at a stale revision is refused against its revision 0.
    const manifest = join(f.orderRoot, ".claude/harness-manifest.json");
    const queueScript = join(f.orderRoot, "scripts/adjacent-work.mjs");
    assert.ok(!existsSync(manifest) && !existsSync(queueScript));
    write(
      f.orderRoot,
      ".claude/harness-manifest.json",
      JSON.stringify({ origin: { ids: ["follow-up-queue"] } }),
    );
    cpSync(join(TOOL_ROOT, "scripts/adjacent-work.mjs"), queueScript);
    writeFileSync(
      join(f.base, "queue-request.json"),
      JSON.stringify({ expectedRevision: 5, actor: "executor", action: {} }),
    );
    const queueRefuses = (command) => {
      const result = command.run();
      assert.notEqual(result.status, 0);
      assert.match(result.stderr, /stale queue revision/u);
    };
    // The executor records the order's one criterion unmet.
    write(
      f.orderRoot,
      "records/evidence/WO-999/handoff.md",
      "**Criterion 1:** unmet. Not run in the fixture.\n\nself-review: found 0; fixed 0; recorded 0\n",
    );
    const execution = launchpadCommands(f, f.ok(f.resume(["briefing"])));
    assert.deepEqual(names(execution), [
      "scripts/resume.mjs implementation-ready",
      "scripts/adjacent-work.mjs apply",
      documentGate,
    ]);
    queueRefuses(execution[1]);
    // The completion the execution briefing prints records from the target
    // worktree as printed.
    f.ok(execution[0].run());
    missing(["verify"], "verifying");
    // The routes past the unmet criterion run from the target worktree as
    // printed and answer from the launchpad's own scripts.
    const verification = launchpadCommands(f, f.ok(f.resume(["briefing"])));
    assert.deepEqual(names(verification), [
      "scripts/resume.mjs waive",
      "scripts/refute-plan.mjs amend-order",
      documentGate,
    ]);
    const waive = verification[0].run();
    assert.notEqual(waive.status, 0);
    assert.match(
      waive.stderr,
      /waive requires --capture <path> naming an ignored capture under records\/intake\//u,
    );
    const amend = verification[1].run();
    assert.notEqual(amend.status, 0);
    assert.match(amend.stderr, /usage: plan amend-order <WO-NNN>/u);
    const report = `# Fixture\n\n**Actor attestation:** ${JSON.stringify(actor)}\n\n**Process cost:** unknown; cause no-session\n`;
    write(f.orderRoot, "records/verifications/WO-999/VER-001.md", report);
    f.ok(f.resume(["verification-result", "pass", ...actorArgs]));
    missing(["final-review"], "final-review");
    const briefing = f.ok(f.resume(["briefing"]));
    assert.ok(
      existsSync(
        /Target gate claims stand on node '([^']*)' WO-999 --review;/u.exec(
          briefing,
        )[1],
      ),
    );
    assert.match(
      briefing,
      /the instance document gate, which a criterion names as npm run test:docs, runs as DOTLN_LAUNCHPAD=/u,
    );
    const printed = launchpadCommands(f, briefing);
    assert.deepEqual(names(printed), [
      "scripts/resume.mjs waive",
      "scripts/refute-plan.mjs amend-order",
      documentGate,
      ...printedCommands,
    ]);
    const [, , gate, records, ...publications] = printed;
    // Run from the target worktree, each reaches the launchpad's own script:
    // the document gate reports what it reports from the launchpad itself,
    // the records action refuses the phase, and both publications refuse the
    // order worktree's uncommitted records.
    const timings = (result) =>
      `${result.status}\n${result.stdout}`
        .replace(/[0-9]+\.[0-9]+ s/gu, "<t>")
        .replace(/(dotln-[a-z-]+-)[A-Za-z0-9]{6}\b/gu, "$1<tmp>");
    assert.equal(
      timings(gate.run()),
      timings(
        spawnSync(process.execPath, ["scripts/test-runner.mjs", "--document"], {
          cwd: f.orderRoot,
          env: f.env,
          encoding: "utf8",
        }),
      ),
    );
    const recordsRun = records.run();
    assert.notEqual(recordsRun.status, 0);
    assert.match(
      recordsRun.stderr,
      /cannot perform action in phase final-review/u,
    );
    for (const publication of publications) {
      const result = publication.run();
      assert.notEqual(result.status, 0);
      assert.match(result.stderr, /working tree is not clean/u);
    }
    // A refusal's hint prints the legal command in the same form.
    const hint = f.resume(["verify"]);
    assert.notEqual(hint.status, 0);
    assert.match(
      hint.stderr,
      /cannot perform action in phase final-review; run: DOTLN_LAUNCHPAD='[^']*' node '[^']*\/scripts\/resume\.mjs' final-review-result pass\|fail /u,
    );
    assert.doesNotMatch(hint.stderr, /npm run resume --/u);
    write(f.orderRoot, "records/final-reviews/WO-999/FINAL-001.md", report);
    f.ok(f.resume(["final-review-result", "fail", ...actorArgs]));
    missing(["fix"], "repairing");
    const repair = launchpadCommands(f, f.ok(f.resume(["briefing"])));
    assert.deepEqual(names(repair), [
      "scripts/adjacent-work.mjs apply",
      documentGate,
    ]);
    queueRefuses(repair[0]);
    rmSync(join(f.orderRoot, ".claude"), { recursive: true });
    rmSync(queueScript);
  });
  // A self order prints no target sentence and no launchpad-qualified command.
  withFixture((f) => {
    write(
      f.main,
      f.order,
      "# WO-999 — self fixture\n\n**Model:** any.\n**Effort:** executor any; verifier any; reviewer any.\n",
    );
    git(f.main, "add", "-A");
    git(f.main, "commit", "-qm", "Self order fixture");
    git(f.main, "push", "-q", "origin", "main");
    f.start();
    const briefing = f.ok(f.resume(["briefing"], {}, f.orderRoot));
    assert.match(
      briefing,
      /^Execute records\/work-orders\/WO-999-fixture\.md\./u,
    );
    assert.doesNotMatch(
      briefing,
      /Repo-native|target-gate|target-records|DOTLN_LAUNCHPAD|--target-worktree/u,
    );
  });
});

test("WO-210 target final review binds clean commits through both launchpad routes and refuses without recording", () => {
  for (const explicit of [false, true])
    withFixture((f) => {
      f.mapClone();
      f.start();
      const routed = {
        ...f,
        resume: (args, override = {}, cwd = f.target) =>
          f.resume(
            args,
            {
              ...override,
              ...(explicit ? { DOTLN_LAUNCHPAD: f.orderRoot } : {}),
            },
            cwd,
            explicit ? f.main : f.orderRoot,
          ),
      };
      write(f.target, "reviewed.txt", "Reviewed target change.\n");
      git(f.target, "add", "reviewed.txt");
      git(f.target, "commit", "-qm", "fix: preserve reviewed source");
      const commit = git(f.target, "rev-parse", "HEAD");
      prepareFinalReview(routed);
      const segment = docPath(f.orderRoot, "orders", "WO-999.jsonl");
      const before = readFileSync(segment);
      const refuse = (pattern, cwd = f.target) => {
        const result = routed.resume(
          ["final-review-result", "pass", ...actorArgs],
          {},
          cwd,
        );
        assert.notEqual(result.status, 0);
        assert.match(result.stderr, pattern);
        assert.deepEqual(readFileSync(segment), before);
      };
      const original = readFileSync(join(f.target, "source.txt"));
      write(f.target, "source.txt", "Uncommitted edit.\n");
      refuse(/tracked changes/u);
      writeFileSync(join(f.target, "source.txt"), original);
      write(f.target, "untracked.txt", "Not reviewed.\n");
      refuse(/untracked files/u);
      rmSync(join(f.target, "untracked.txt"));
      // A staged rename is one entry naming its old and new path; beside a
      // modified file it is listed under tracked changes, and the untracked
      // file under its own heading, each named plainly with no status prefix.
      mkdirSync(join(f.target, "moved notes"));
      git(f.target, "mv", "source.txt", "moved notes/renamed source.txt");
      write(f.target, "reviewed.txt", "Edited after the review.\n");
      write(f.target, "draft notes.txt", "Not reviewed.\n");
      refuse(
        /target has tracked changes: source\.txt -> moved notes\/renamed source\.txt, reviewed\.txt; non-ignored untracked files: draft notes\.txt; commit the reviewed target change/u,
      );
      git(f.target, "mv", "moved notes/renamed source.txt", "source.txt");
      git(f.target, "checkout", "--", "reviewed.txt");
      rmSync(join(f.target, "draft notes.txt"));
      // A pending record path admits only its own plain entry, never a rename
      // onto it, even one whose original path ends in that pending path.
      git(f.target, "mv", "reviewed.txt", "iewed.txt");
      assert.throws(
        () =>
          reviewedTargetSubject(
            f.orderRoot,
            readControl(f.orderRoot).orders.get("WO-999").state,
            { pendingRecordPaths: ["iewed.txt"] },
          ),
        /target has tracked changes: reviewed\.txt -> iewed\.txt;/u,
      );
      git(f.target, "mv", "iewed.txt", "reviewed.txt");
      git(f.target, "switch", "-qc", "other-review-branch");
      refuse(/branch differs/u);
      git(f.target, "switch", "-q", "wo-999");
      const registry = targetRegistryPath(f.orderRoot);
      renameSync(registry, `${registry}.saved`);
      refuse(/registry entry is missing/u, f.orderRoot);
      renameSync(`${registry}.saved`, registry);
      const configPath = join(f.orderRoot, "dotln.config.json");
      const configBytes = readFileSync(configPath);
      const missingGate = JSON.parse(configBytes);
      delete missingGate.repositories.target.gate;
      writeFileSync(configPath, JSON.stringify(missingGate));
      refuse(/gate is missing/u);
      writeFileSync(configPath, configBytes);
      const gateFile = checksPath(f.orderRoot);
      const savedRows = readFileSync(gateFile);
      writeFileSync(gateFile, "[]\n");
      refuse(/review target gate is missing/u);
      const row = JSON.parse(savedRows)
        .filter((row) => row.checkId === "target:target")
        .at(-1);
      writeFileSync(
        gateFile,
        JSON.stringify([{ ...row, treeHash: "f".repeat(40) }]),
      );
      refuse(/review target gate is stale/u);
      writeFileSync(
        gateFile,
        JSON.stringify([
          row,
          {
            ...row,
            exitCode: 1,
            evidenceRef: "fixture:failed",
            recordedAt: new Date(Date.now() + 1000).toISOString(),
          },
        ]),
      );
      refuse(/review target gate is failed/u);
      // A truncated index refuses in one line naming it and the rerun.
      writeFileSync(gateFile, '[{"checkId":"target:');
      refuse(
        /^error: target review target gate index cannot be read: docs\/control\/local\/harness\/checks\.json [^\n]*target-gate\.mjs' WO-999 --review$/mu,
      );
      writeFileSync(gateFile, savedRows);
      const output = routed.ok(
        routed.resume(["final-review-result", "pass", ...actorArgs]),
      );
      assert.match(output, /committed before this result/u);
      assert.deepEqual(
        launchpadCommands(f, output).map(({ command }) => command),
        printedCommands,
      );
      assert.match(output, /target-records <actor flags>, then commit/u);
      assert.match(output, /publish WO-999 --target-worktree --branch/u);
      // The closed order's hint qualifies what the session runs from its
      // worktree and keeps the main-checkout commands in npm form, saying so.
      const hint = routed.resume(["verify"]);
      assert.notEqual(hint.status, 0);
      assert.match(
        hint.stderr,
        /cannot perform action in phase closed; run: DOTLN_LAUNCHPAD='[^']*' node '[^']*\/scripts\/resume\.mjs' target-records --harness .*? --work-order WO-999 or npm run release -- close WO-NNN --publish \(in the main checkout\) or DOTLN_LAUNCHPAD='[^']*' node '[^']*\/scripts\/resume\.mjs' next --work-order WO-999 or npm run worktree -- start WO-NNN docs\/work-orders\/WO-NNN-name\.md \(in the main checkout\)$/mu,
      );
      assert.doesNotMatch(hint.stderr, /worktree\.mjs' start|release\.mjs/u);
      const event = readFileSync(segment, "utf8")
        .trim()
        .split("\n")
        .map(JSON.parse)
        .filter((row) => row.type === "FinalReviewCompleted")
        .at(-1);
      assert.deepEqual(event.targetSubject, {
        repositoryId: "target",
        branch: "wo-999",
        baseCommit: f.baseCommit,
        commit,
      });
      assert.ok(!JSON.stringify(event.targetSubject).includes(f.base));
      assert.deepEqual(Object.keys(event.targetGate).sort(), [
        "commit",
        "durationMs",
        "evidenceRef",
        "names",
        "recordedAt",
        "repositoryId",
        "selection",
        "treeHash",
      ]);
      assert.equal(event.targetGate.commit, commit);
      assert.equal(event.targetGate.selection, "review");
    });
});

test("WO-210 a failed target final review records no target subject", () =>
  withFixture((f) => {
    f.mapClone();
    f.start();
    prepareFinalReview(f);
    write(
      f.target,
      "untracked.txt",
      "Failing review retains uncommitted work.\n",
    );
    f.ok(f.resume(["final-review-result", "fail", ...actorArgs]));
    const event = readFileSync(
      docPath(f.orderRoot, "orders", "WO-999.jsonl"),
      "utf8",
    )
      .trim()
      .split("\n")
      .map(JSON.parse)
      .filter((row) => row.type === "FinalReviewCompleted")
      .at(-1);
    assert.equal(Object.hasOwn(event, "targetSubject"), false);
  }));

const launchpadSpellings = (f, t) => {
  const alias = join(f.base, "launchpad-alias");
  const chained = join(f.base, "launchpad-alias-chain");
  symlinkSync(f.orderRoot, alias);
  symlinkSync(alias, chained);
  const spellings = [f.orderRoot, alias, chained];
  const sameDirectory = (candidate) => {
    if (!existsSync(candidate)) return false;
    const expected = statSync(f.orderRoot);
    const actual = statSync(candidate);
    return expected.dev === actual.dev && expected.ino === actual.ino;
  };
  const caseVariant = join(f.base, "LAUNCHPAD-WO999");
  if (sameDirectory(caseVariant)) {
    spellings.push(caseVariant);
    t.diagnostic(
      "launchpad case variants exercised: volume is case-insensitive",
    );
  } else
    t.diagnostic("skipped launchpad case variants: volume is case-sensitive");
  const volumeAlias = join("/System/Volumes/Data", f.orderRoot);
  if (sameDirectory(volumeAlias)) {
    spellings.push(volumeAlias);
    t.diagnostic("launchpad volume alias exercised");
  } else
    t.diagnostic("skipped launchpad volume alias: unavailable on this host");
  return spellings;
};

test("launchpad spellings preserve self and registered-target selection and report ownership", (t) =>
  withFixture((f) => {
    f.mapClone();
    f.start();
    const spellings = launchpadSpellings(f, t);
    const launchpadChild = join(f.orderRoot, "subdirectory");
    const targetChild = join(f.target, "subdirectory");
    mkdirSync(launchpadChild);
    mkdirSync(targetChild);
    const segment = docPath(f.orderRoot, "orders", "WO-999.jsonl");
    const before = readFileSync(segment, "utf8");
    for (const spelling of spellings)
      for (const cwd of [f.orderRoot, launchpadChild, f.target, targetChild])
        for (const explicit of [false, true]) {
          const result = f.resume(
            ["status", "--json"],
            explicit ? { DOTLN_LAUNCHPAD: spelling } : {},
            cwd,
            explicit ? f.main : spelling,
          );
          assert.equal(JSON.parse(f.ok(result)).workOrder, "WO-999");
        }
    assert.equal(readFileSync(segment, "utf8"), before);
    const override = { DOTLN_LAUNCHPAD: spellings[2] };
    assert.match(
      f.ok(f.resume(["next"], override)),
      /Execute records\/work-orders\/WO-999/,
    );
    const reports = closeOrder(f, override);
    for (const file of Object.values(reports)) assert.ok(existsSync(file));
    assert.equal(existsSync(join(f.target, "records")), false);
    assert.equal(existsSync(docPath(f.main, "orders", "WO-999.jsonl")), false);
    assert.equal(git(f.target, "status", "--porcelain"), "");
  }));

test("self-order launchpad spellings select the branch with repository declarations or only a registry", (t) =>
  withFixture((f) => {
    write(
      f.main,
      f.order,
      "# WO-999 — self fixture\n\n**Model:** any.\n**Effort:** executor any; verifier any; reviewer any.\n",
    );
    git(f.main, "add", "-A");
    git(f.main, "commit", "-qm", "Self order fixture");
    git(f.main, "push", "-q", "origin", "main");
    f.start();
    const spellings = launchpadSpellings(f, t);
    const segment = docPath(f.orderRoot, "orders", "WO-999.jsonl");
    const before = readFileSync(segment, "utf8");
    for (const registryOnly of [false, true]) {
      if (registryOnly) {
        delete f.config.repositories;
        write(f.orderRoot, "dotln.config.json", JSON.stringify(f.config));
        write(f.orderRoot, "records/state/local/target-worktrees.json", "{}\n");
      }
      for (const spelling of spellings)
        for (const explicit of [false, true])
          assert.equal(
            JSON.parse(
              f.ok(
                f.resume(
                  ["status", "--json"],
                  explicit ? { DOTLN_LAUNCHPAD: spelling } : {},
                  f.orderRoot,
                  explicit ? f.main : spelling,
                ),
              ),
            ).workOrder,
            "WO-999",
          );
    }
    assert.equal(readFileSync(segment, "utf8"), before);
  }));

test("WO-072 criterion 1: declared target base, governed ignored bundle and conventional commits", () =>
  withFixture((f) => {
    f.mapClone();
    const output = f.start();
    assert.match(output, /Authority profile:/);
    assert.ok(output.includes(JSON.stringify(profile)));
    assert.equal(git(f.target, "rev-parse", "HEAD"), f.baseCommit);
    assert.equal(existsSync(join(f.target, "later.txt")), false);
    assert.equal(
      checkTargetHarness(f.target, { runtimeRoot: f.main }).files,
      7,
    );
    assert.equal(git(f.target, "status", "--porcelain"), "");
    for (const [file, args] of [
      ["first.txt", ["add", "first.txt"]],
      ["second.txt", ["add", "-A"]],
    ]) {
      write(f.target, file, "target code\n");
      git(f.target, ...args);
      git(f.target, "commit", "-qm", "Target source change");
      assert.doesNotMatch(
        git(f.target, "ls-tree", "-r", "--name-only", "HEAD"),
        /(?:CLAUDE|AGENTS|\.claude|\.codex|\.dotln|docs\/|records\/)/,
      );
      assert.equal(git(f.target, "status", "--porcelain"), "");
    }
    const segment = readFileSync(
      docPath(f.orderRoot, "orders", "WO-999.jsonl"),
      "utf8",
    );
    assert.ok(!segment.includes(f.base), "local paths never enter control");
  }));

test("WO-072 criterion 2: both launchpad routes select target order and keep reports in the launchpad", () => {
  for (const explicit of [false, true])
    withFixture((f) => {
      f.mapClone();
      f.start();
      const override = explicit ? { DOTLN_LAUNCHPAD: f.orderRoot } : {};
      const route = (args, cwd = f.target) =>
        f.resume(args, override, cwd, explicit ? f.main : f.orderRoot);
      assert.equal(
        JSON.parse(f.ok(route(["status", "--json"]))).workOrder,
        "WO-999",
      );
      assert.match(
        f.ok(route(["next"])),
        /Execute records\/work-orders\/WO-999/,
      );
      const segment = docPath(f.orderRoot, "orders", "WO-999.jsonl");
      const before = readFileSync(segment, "utf8");
      for (const action of ["status", "next", "verify", "final-review"]) {
        assert.match(
          f.ok(route([action], f.clone)),
          /not a registered target worktree; no order selected/,
        );
        assert.match(
          f.ok(route([action], f.base)),
          /not a registered target worktree; no order selected/,
        );
      }
      for (const cwd of [f.clone, f.base]) {
        const result = route(["status", "--json"], cwd);
        assert.equal(result.status, 1);
        assert.equal(result.stdout, "");
        assert.match(
          result.stderr,
          /not a registered target worktree; no order selected/,
        );
      }
      assert.equal(readFileSync(segment, "utf8"), before);
      git(f.target, "switch", "-q", "-c", "wrong-branch");
      assert.match(route(["status"]).stderr, /branch differs/);
      git(f.target, "switch", "-q", "wo-999");
      const reports = closeOrder(f, override);
      for (const file of Object.values(reports)) assert.ok(existsSync(file));
      const events = readFileSync(segment, "utf8")
        .trim()
        .split("\n")
        .map(JSON.parse);
      assert.ok(
        events.some(
          (event) =>
            event.type === "VerificationRequested" &&
            event.reportPath === "records/verifications/WO-999/VER-001.md",
        ),
      );
      assert.ok(
        events.some(
          (event) =>
            event.type === "FinalReviewRequested" &&
            event.reportPath === "records/final-reviews/WO-999/FINAL-001.md",
        ),
      );
      assert.equal(
        existsSync(docPath(f.main, "orders", "WO-999.jsonl")),
        false,
      );
      assert.equal(existsSync(join(f.target, "records")), false);
      assert.equal(git(f.target, "status", "--porcelain"), "");
    });
});

test("WO-072 criterion 3: unreadable start inputs refuse without worktree, branch or registry residue", (t) =>
  withFixture((f) => {
    const refuse = (pattern) => {
      const result = f.worktree("start", "WO-999", f.order);
      assert.notEqual(result.status, 0);
      assert.match(result.stderr, pattern);
      for (const repo of [f.main, f.clone])
        assert.equal(git(repo, "branch", "--list", "wo-999"), "");
      assert.equal(existsSync(f.target), false);
      assert.equal(existsSync(f.orderRoot), false);
      assert.equal(existsSync(targetRegistryPath(f.main)), false);
    };
    refuse(/repository target: no local clone recorded/);
    f.mapClone();
    const child = join(f.clone, "subdirectory");
    mkdirSync(child);
    writeFileSync(cloneMapPath(f.main), JSON.stringify({ target: child }));
    refuse(/repository target: not a Git top level/);
    f.mapClone();
    const probe = join(f.parent, "Probe");
    writeFileSync(probe, "case probe");
    let insensitive = false;
    try {
      insensitive =
        statSync(probe).ino === statSync(join(f.parent, "probe")).ino;
    } catch {}
    t.diagnostic(
      `fixture volume is ${insensitive ? "case-insensitive" : "case-sensitive"}`,
    );
    if (insensitive) {
      f.config.repositories.target.worktreeParent = "../targets";
      writeFileSync(
        join(f.main, "dotln.config.json"),
        JSON.stringify(f.config),
      );
      git(f.main, "add", "dotln.config.json");
      git(f.main, "commit", "-qm", "Variant parent fixture");
      git(f.main, "push", "-q", "origin", "main");
      refuse(/repository target: spelling differs from filesystem identity/);
    } else
      t.diagnostic("skipped variant-case parent: volume is case-sensitive");
  }));

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
    git(f.target, "commit", "-qm", "Target change");
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
    assert.match(unmerged.stderr, /merge-base --is-ancestor/);
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
    const drafted = f.ok(f.worktree(...draftArgs));
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
      readFileSync(forge.log, "utf8").trim().split("\n").map(JSON.parse);
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
    assert.deepEqual(
      events().map((event) => [
        event.type,
        event.payload.draft,
        event.payload.headSha,
        event.payload.branch,
      ]),
      [["PullRequestOpened", true, draftHead, "feat/reviewed-behavior"]],
    );
    // A second draft at the same tree reports already published; nothing is pushed.
    assert.match(f.ok(f.worktree(...draftArgs)), /Already published draft/u);
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
      const dry = f.ok(close("--dry-run"));
      assert.match(dry, /would-remove/u);
      assert.match(dry, /Target release target: preview; tag v0\.1\.0/u);
      assert.match(
        dry,
        /disposable output would be deleted: \.angular \(1\), \.nx \(1\), dist \(1\), node_modules \(1\), base \.angular \(1\)/u,
      );
      assert.ok(existsSync(join(f.target, "dist/out.js")));
      assert.ok(existsSync(strayCache));
      assert.equal(git(f.clone, "rev-parse", "HEAD"), baseBefore);
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
      git(merger, "push", "-q", "origin", ":refs/tags/v0.1.0");
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
      writeFileSync(ghFile, ghOriginal);
      const remote = join(f.base, "target.git");
      const merged = git(remote, "rev-parse", "main");
      git(remote, "update-ref", "refs/tags/v0.1.0", baseBefore);
      const moved = close("--publish");
      assert.notEqual(moved.status, 0);
      assert.match(moved.stderr, /not the recorded release commit/u);
      assert.equal(git(remote, "rev-parse", "v0.1.0^{commit}"), baseBefore);
      assert.deepEqual(releases(), {});
      assert.ok(existsSync(f.orderRoot));
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
      assert.equal(forgeState.releases["v0.1.0"].name, "target v0.1.0");
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
        latest: null,
        commit: merged,
        tagOutcome: "published",
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
    assert.match(
      started,
      new RegExp(
        `copilot --allow-tool 'shell\\(git -C ${f.target.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&")} push -u origin wo-999\\)'`,
        "u",
      ),
    );
    assert.match(
      started,
      /--allow-tool 'shell\(gh pr create --draft --repo github\.com\/dotln-fixture\/target:\*\)'/u,
    );
    assert.match(
      started,
      /--allow-tool 'shell\(npm run worktree -- publish WO-999 --target-worktree:\*\)'/u,
    );
    assert.doesNotMatch(started, /push:\*/u);
    assert.match(started, /Literal rules written for WO-999/u);
    const local = JSON.parse(
      readFileSync(join(f.main, ".claude/settings.local.json"), "utf8"),
    );
    const rules = local.permissions.allow;
    assert.ok(rules.includes(`Bash(git -C ${f.target} push -u origin wo-999)`));
    assert.ok(
      rules.includes(
        "Bash(gh pr create --draft --repo github.com/dotln-fixture/target *)",
      ),
    );
    assert.ok(rules.every((rule) => !/elsewhere|other/u.test(rule)));
    assert.ok(
      rules.every((rule) => !rule.includes("push") || rule.includes(f.target)),
    );
    const codex = readFileSync(
      join(f.main, ".codex/rules/dotln-WO-999.rules"),
      "utf8",
    );
    assert.match(codex, /^# dotln:WO-999:start$/mu);
    assert.match(
      codex,
      new RegExp(
        `pattern = \\["git","-C",${JSON.stringify(f.target).replace(/[.*+?^${}()|[\]\\]/gu, "\\$&")},"push","-u","origin","wo-999"\\]`,
        "u",
      ),
    );
    assert.match(codex, /decision = "allow"/u);
    assert.doesNotMatch(codex, /elsewhere/u);
    // The sidecar's rules are current while the order's worktree is registered.
    assert.deepEqual(staleOrderHostRules(f.main), []);
    write(f.target, "change.txt", "changed\n");
    git(f.target, "add", "-A");
    git(f.target, "commit", "-qm", "Target change");
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

const mergedCloseFixture = (f) => {
  closeOrder(f);
  git(f.orderRoot, "add", "-A");
  git(f.orderRoot, "commit", "-qm", "test: close target order");
  git(f.main, "merge", "-q", "--no-ff", "-m", "Merge records", "wo-999");
  git(f.main, "push", "-q", "origin", "main");
};

test("host-rule rewrite requires a committed opt-in and preserves operator rules through repair and removal", () =>
  withFixture((f) => {
    publicationSetup(f);
    f.mapClone();
    f.start();
    const settings = join(f.main, ".claude/settings.local.json");
    const codex = join(f.main, ".codex/rules/dotln-WO-999.rules");
    const sidecar = docPath(f.main, "control", "local/host-rules/WO-999.json");
    const rewrite = () => f.worktree("host-rules", "--rewrite", "WO-999");
    const optedOut = rewrite();
    assert.notEqual(optedOut.status, 0);
    assert.match(optedOut.stderr, /has not opted into hostRules literal/u);
    for (const file of [settings, codex, sidecar])
      assert.equal(existsSync(file), false);

    f.config.repositories.target.hostRules = "literal";
    write(f.main, "dotln.config.json", JSON.stringify(f.config));
    const uncommitted = rewrite();
    assert.notEqual(uncommitted.status, 0);
    assert.match(
      uncommitted.stderr,
      /requires main's committed dotln\.config\.json/u,
    );
    for (const file of [settings, codex, sidecar])
      assert.equal(existsSync(file), false);
    git(f.main, "add", "dotln.config.json");
    git(f.main, "commit", "-qm", "test: opt into host-rule recovery");

    const operatorRules = [
      "Bash(npm test)",
      "Bash(gh pr view --repo github.com/dotln-fixture/target *)",
    ];
    write(
      f.main,
      ".claude/settings.local.json",
      JSON.stringify({ permissions: { allow: operatorRules } }),
    );
    f.ok(rewrite());
    assert.deepEqual(staleOrderHostRules(f.main), []);
    const owned = JSON.parse(readFileSync(sidecar, "utf8"));
    assert.ok(owned.claude.every((rule) => !operatorRules.includes(rule)));
    const local = JSON.parse(readFileSync(settings, "utf8"));
    local.permissions.allow = local.permissions.allow.filter(
      (rule) => rule !== owned.claude[0],
    );
    writeFileSync(settings, JSON.stringify(local));
    assert.equal(staleOrderHostRules(f.main).length, 1);
    f.ok(rewrite());
    assert.deepEqual(staleOrderHostRules(f.main), []);

    const before = [settings, codex, sidecar].map((file) =>
      readFileSync(file, "utf8"),
    );
    git(f.target, "switch", "-qc", "unexpected-target-branch");
    const rebound = rewrite();
    assert.notEqual(rebound.status, 0);
    assert.match(rebound.stderr, /target differs from its registration/u);
    assert.deepEqual(
      [settings, codex, sidecar].map((file) => readFileSync(file, "utf8")),
      before,
    );
    git(f.target, "switch", "-q", "wo-999");
    delete f.config.repositories.target.hostRules;
    write(f.main, "dotln.config.json", JSON.stringify(f.config));
    git(f.main, "add", "dotln.config.json");
    git(f.main, "commit", "-qm", "test: withdraw literal opt-in");
    assert.notEqual(rewrite().status, 0);
    assert.deepEqual(
      [settings, codex, sidecar].map((file) => readFileSync(file, "utf8")),
      before,
    );
    f.ok(f.worktree("host-rules", "--remove", "WO-999"));
    assert.deepEqual(
      JSON.parse(readFileSync(settings, "utf8")).permissions.allow,
      operatorRules,
    );
    assert.equal(existsSync(codex), false);
    assert.equal(existsSync(sidecar), false);
  }));
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
        /undeclared ignored material; source retained: large-cache\/\. Declare it disposable/u,
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
        git(f.target, "commit", "-qm", "Target change");
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
      /target clone base main cannot close: fetch failed: fatal: '<target origin>' does not appear to be a git repository.*; source retained\. Fix the fetch, then rerun /su,
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

test("umbrella start refuses before creating the launchpad or target worktree", () =>
  withFixture((f) => {
    f.mapClone();
    write(
      f.main,
      f.order,
      `# WO-999 — umbrella fixture\n\n**Umbrella record:** superseded whole.\n**Model:** any.\n**Effort:** executor any; verifier any; reviewer any.\n**Repository:** target @ ${f.baseCommit}\n\n<!-- dotln-dependencies:start -->\n[{"workOrderId":"WO-998","relation":"superseded","by":"WO-998","reason":"bounded successor"}]\n<!-- dotln-dependencies:end -->\n`,
    );
    git(f.main, "add", "-A");
    git(f.main, "commit", "-qm", "Umbrella fixture");
    git(f.main, "push", "-q", "origin", "main");
    const result = f.worktree("start", "WO-999", f.order);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /umbrella record superseded by WO-998/);
    for (const repo of [f.main, f.clone])
      assert.equal(git(repo, "branch", "--list", "wo-999"), "");
    assert.equal(existsSync(f.target), false);
    assert.equal(existsSync(f.orderRoot), false);
    assert.equal(existsSync(targetRegistryPath(f.main)), false);
  }));

for (const cloneName of ["launchpad", "Launchpad"])
  test(`planned target and launchpad paths refuse ${cloneName} name collision`, () =>
    withFixture((f) => {
      const container = join(f.base, "other");
      mkdirSync(container);
      const sameName = join(container, cloneName);
      renameSync(f.clone, sameName);
      f.config.repositories.target.worktreeParent = "..";
      writeFileSync(
        join(f.main, "dotln.config.json"),
        JSON.stringify(f.config),
      );
      git(f.main, "add", "-A");
      git(f.main, "commit", "-qm", "Collision fixture");
      git(f.main, "push", "-q", "origin", "main");
      f.ok(f.worktree("clone", "target", sameName));
      const result = f.worktree("start", "WO-999", f.order);
      assert.notEqual(result.status, 0);
      assert.match(
        result.stderr,
        /target and launchpad worktree paths overlap/,
      );
      for (const repo of [f.main, sameName])
        assert.equal(git(repo, "branch", "--list", "wo-999"), "");
      assert.equal(existsSync(f.orderRoot), false);
      assert.equal(readTargetStart(f.main, "WO-999"), undefined);
      assert.equal(existsSync(targetRegistryPath(f.main)), false);
    }));

test("preparation retry resumes the recorded pair after bootstrap or harness failure", () => {
  for (const phase of ["bootstrap", "harness"])
    withFixture((f) => {
      f.mapClone();
      const runtime = join(f.main, "packages/compiler/dist");
      const retainedRuntime = join(f.base, "retained-compiler-dist");
      if (phase === "harness") renameSync(runtime, retainedRuntime);
      const result = f.call(
        f.main,
        f.main,
        "worktree",
        ["start", "WO-999", f.order],
        phase === "bootstrap" ? { DOTLN_FIXTURE_BOOTSTRAP_FAIL: "1" } : {},
      );
      assert.notEqual(result.status, 0);
      assert.match(
        result.stderr,
        phase === "bootstrap"
          ? /launchpad preparation failed/
          : /Cannot find module/,
      );
      assert.match(result.stderr, /Target start is preserved.*retry from/);
      assert.ok(readTargetStart(f.main, "WO-999"));
      assert.ok(existsSync(f.target));
      assert.ok(existsSync(f.orderRoot));
      assert.equal(existsSync(targetRegistryPath(f.main)), false);
      const launchpadHead = git(f.orderRoot, "rev-parse", "HEAD");
      write(f.target, "preserved.txt", "work after interruption\n");
      git(f.target, "add", "-A");
      git(f.target, "commit", "-qm", "Preserved target work");
      const targetHead = git(f.target, "rev-parse", "HEAD");
      if (phase === "harness") renameSync(retainedRuntime, runtime);
      f.start();
      assert.equal(git(f.target, "rev-parse", "HEAD"), targetHead);
      assert.equal(git(f.orderRoot, "rev-parse", "HEAD"), launchpadHead);
      assert.equal(
        checkTargetHarness(f.target, { runtimeRoot: f.main }).files,
        7,
      );
      assert.equal(readTargetStart(f.main, "WO-999"), undefined);
      const events = readFileSync(
        docPath(f.orderRoot, "orders", "WO-999.jsonl"),
        "utf8",
      )
        .trim()
        .split("\n")
        .map(JSON.parse);
      assert.equal(
        events.filter((event) => event.type === "WorkOrderActivated").length,
        1,
      );
      assert.equal(
        JSON.parse(f.ok(f.resume(["status", "--json"]))).workOrder,
        "WO-999",
      );
    });
});

test("clone admits declared export siblings, never consumers or unknown names", () =>
  withFixture((f) => {
    write(
      f.main,
      "records/siblings/siblings.json",
      JSON.stringify({
        schemaVersion: 1,
        siblings: [
          {
            id: "starter-fixture",
            purpose: "Fixture export",
            relation: { kind: "export", coreCommit: null },
            capabilityRows: [],
          },
          {
            id: "consumer-fixture",
            purpose: "Fixture consumer",
            relation: { kind: "consumer", contractVersion: "v1" },
            capabilityRows: [],
          },
        ],
      }),
    );
    f.ok(f.worktree("clone", "starter-fixture", f.clone));
    assert.equal(
      JSON.parse(readFileSync(cloneMapPath(f.main), "utf8"))["starter-fixture"],
      f.clone,
    );
    assert.equal(git(f.main, "ls-files", "--", cloneMapPath(f.main)), "");
    git(f.main, "check-ignore", "--quiet", "--no-index", cloneMapPath(f.main));
    for (const id of ["consumer-fixture", "undeclared"]) {
      const refused = f.worktree("clone", id, f.clone);
      assert.equal(refused.status, 1);
      assert.match(refused.stderr, /unknown repository id/);
    }
  }));

test("self start preserves a failed receipt carry and its printed retry completes activation", () =>
  withFixture((f) => {
    write(
      f.main,
      "records/siblings/siblings.json",
      JSON.stringify({
        schemaVersion: 1,
        siblings: [
          {
            id: "starter-fixture",
            purpose: "Fixture export",
            relation: { kind: "export", coreCommit: null },
            capabilityRows: [],
          },
        ],
      }),
    );
    write(
      f.main,
      "records/siblings/README.md/obstruction",
      "registry failure fixture",
    );
    const authority = readFileSync(join(f.main, f.order), "utf8").replace(
      /^\*\*Repository:\*\*.*\n/m,
      "",
    );
    write(f.main, f.order, authority);
    git(f.main, "add", "-A");
    git(f.main, "commit", "-qm", "Self carry failure fixture");
    git(f.main, "push", "-q", "origin", "main");
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
    const failed = f.worktree("start", "WO-999", f.order);
    assert.notEqual(failed.status, 0);
    assert.match(
      failed.stderr,
      /created and preserved.*contained regular file/,
    );
    assert.ok(existsSync(f.orderRoot));
    assert.ok(existsSync(join(f.main, pending)));
    assert.equal(
      existsSync(join(f.orderRoot, "records/state/orders/WO-999.jsonl")),
      false,
    );
    const carried = join(
      f.orderRoot,
      "records/evidence/siblings/starter-fixture/2026-10-13T12-00-00-000Z.json",
    );
    assert.deepEqual(
      readFileSync(carried),
      readFileSync(join(f.main, pending)),
    );
    rmSync(join(f.orderRoot, "records/siblings/README.md"), {
      recursive: true,
    });
    const command = failed.stderr.match(
      /retry: (node --input-type=module -e .*)/,
    )[1];
    const retried = spawnSync("/bin/zsh", ["-c", command], {
      cwd: f.main,
      env: f.env,
      encoding: "utf8",
    });
    assert.equal(retried.status, 0, retried.stderr || retried.stdout);
    assert.equal(existsSync(join(f.main, pending)), false);
    assert.match(
      f.ok(f.call(f.orderRoot, f.orderRoot, "siblings", ["index", "--check"])),
      /current/,
    );
    assert.equal(
      JSON.parse(
        f.ok(f.call(f.orderRoot, f.orderRoot, "resume", ["status", "--json"])),
      ).phase,
      "active",
    );
    assert.equal(
      git(f.main, "status", "--porcelain", "--untracked-files=all"),
      "",
    );
  }));

test("worktree start carries the main checkout's local-terms list and a clone record accepts an id the order checkout declares", () =>
  withFixture((f) => {
    const terms = "FixturePrivateTerm\n";
    write(f.main, "records/state/local/terms.txt", terms);
    f.mapClone();
    const started = f.start();
    assert.match(started, /Carried the local-terms list into /u);
    const carried = docPath(f.orderRoot, "control", "local/terms.txt");
    assert.equal(readFileSync(carried, "utf8"), terms);
    assert.equal(git(f.orderRoot, "check-ignore", "--quiet", carried), "");
    // A registration lands on an order branch before main: the clone record
    // validates its id against the running checkout as well as main.
    const config = JSON.parse(
      readFileSync(join(f.orderRoot, "dotln.config.json"), "utf8"),
    );
    config.repositories.second = config.repositories.target;
    write(f.orderRoot, "dotln.config.json", JSON.stringify(config));
    const fromOrder = (id) =>
      f.call(f.orderRoot, f.orderRoot, "worktree", ["clone", id, f.clone]);
    f.ok(fromOrder("second"));
    assert.equal(
      JSON.parse(readFileSync(cloneMapPath(f.main), "utf8")).second,
      f.clone,
    );
    assert.equal(
      existsSync(cloneMapPath(f.orderRoot)),
      false,
      "the record lives in the main checkout's map",
    );
    const undeclared = fromOrder("third");
    assert.equal(undeclared.status, 1);
    assert.match(undeclared.stderr, /unknown repository id "third"/u);
  }));

test("worktree start names the local-terms registration step when the main checkout has no list", () =>
  withFixture((f) => {
    f.mapClone();
    const started = f.start();
    assert.match(
      started,
      /No local-terms list at .*; register records\/state\/local\/terms\.txt in the new worktree/u,
    );
    assert.equal(
      existsSync(docPath(f.orderRoot, "control", "local/terms.txt")),
      false,
    );
  }));

for (const kind of [
  "absent-target",
  "clone-hook",
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
      const result = f.close("--publish");

      if (["clone-hook", "missing-base"].includes(kind)) {
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
