import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  renameSync,
  rmSync,
  statSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { TOOL_ROOT, docPath } from "./lib/config.mjs";
import { runGit } from "./lib/git.mjs";
import { write } from "./lib/helpers.mjs";
import { checkTargetHarness, runtimeModuleDirectory } from "./lib/harness.mjs";
import {
  cloneMapPath,
  readTargetStart,
  targetRegistryPath,
} from "./lib/target-worktrees.mjs";
import { installBeaconFixture } from "./test-beacon-fixture.mjs";

const git = (root, ...args) => runGit(root, args);
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
const fixture = (base) => {
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
    "/records/state/local/\n.control-beacons/\ndist/\nnode_modules/\n.runtime/\n",
  );
  write(main, "package.json", '{"private":true}\n');
  mkdirSync(join(main, "scripts"));
  for (const name of [
    "worktree.mjs",
    "resume.mjs",
    "release.mjs",
    "license-surfaces.mjs",
  ])
    cpSync(join(TOOL_ROOT, "scripts", name), join(main, "scripts", name), {
      recursive: false,
    });
  cpSync(join(TOOL_ROOT, "scripts/lib"), join(main, "scripts/lib"), {
    recursive: true,
  });
  installBeaconFixture(main);
  // The fixture's bootstrap provides the installed build without a dependency
  // install; both launchpad worktrees still run the real lifecycle commands.
  write(
    main,
    "scripts/bootstrap.mjs",
    `import { cpSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";
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

const withFixture = (run) => {
  const base = realpathSync(
    mkdtempSync(join(tmpdir(), "dotln-target-worktree-")),
  );
  try {
    return run(fixture(base));
  } finally {
    rmSync(base, { recursive: true, force: true });
  }
};
const closeOrder = (f, override = {}) => {
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
    `# Verification fixture\n\n**Actor attestation:** ${JSON.stringify(actor)}\n\n**Process cost:** unknown; cause no-session\n`,
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
  f.ok(f.resume(["final-review-result", "pass", ...actorArgs], override));
  return { verification, finalReview };
};

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
    f.mapClone();
    f.start();
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
    assert.match(f.ok(f.close("--dry-run")), /would-remove/);
    assert.ok(existsSync(f.target));
    assert.ok(existsSync(f.orderRoot));
    const result = f.ok(f.close("--publish"));
    assert.match(result, /no-release/);
    assert.equal(existsSync(f.target), false);
    assert.equal(existsSync(f.orderRoot), false);
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
    assert.equal(record.publication.outcome, "no-release");
    assert.equal(record.publication.tag, null);
    assert.equal(record.targetCleanup.outcome, "removed");
    assert.equal(record.cleanup.outcome, "clean");
    assert.match(f.ok(f.close("--publish")), /no-release/);
  }));

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
