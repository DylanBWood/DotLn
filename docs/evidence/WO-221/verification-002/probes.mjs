// Independent VER-002 probes. Each reuses the target-worktree suite's fixture
// helpers (local bare remotes, mocked gh) through a generated copy in system
// temp; the implementation is not edited and nothing reaches a real service.
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
const root = process.cwd();
const mode = process.argv[2];
const modes = [
  "literal-dirty-main",
  "control-dirty-main",
  "literal-ignored-rules-main",
  "literal-malformed-settings-close",
  "base-info-exclude-env",
  "literal-malformed-settings-start",
  "release-tag-moved-forward",
  "base-preignored-disposable",
];
if (!modes.includes(mode))
  throw new Error(`Specify one of: ${modes.join(", ")}`);
let source = readFileSync(
  join(root, "scripts/test-target-worktree.mjs"),
  "utf8",
);
const cut = source.indexOf('test("target release preparation');
if (cut < 0) throw new Error("fixture helper boundary missing");
source = source
  .slice(0, cut)
  .replace(
    'import test from "node:test";',
    `const test = (name, run) => { if (name !== ${JSON.stringify(mode)}) return; const start = Date.now(); try { run(); console.log(JSON.stringify({ probe: name, outcome: "passed", durationMs: Date.now() - start })); } catch (error) { console.log(JSON.stringify({ probe: name, outcome: "failed", error: error.message, durationMs: Date.now() - start })); process.exitCode = 1; } };`,
  )
  .replace(
    /from "(\.[^"]+)"/g,
    (_, file) =>
      `from ${JSON.stringify(pathToFileURL(resolve(root, "scripts", file)).href)}`,
  );
source += String.raw`
const observe = (row) => console.log(JSON.stringify(row));
// Mirror the kit's gitignore template: a real instance ignores the operator's
// local settings, so only paths the template leaves out stay visible.
const ignoreLocalSettings = (f) =>
  write(
    f.main,
    ".gitignore",
    readFileSync(join(f.main, ".gitignore"), "utf8") +
      "/.claude/settings.local.json\n",
  );
// Bring the fixture order to a merged, closed state ready for release close.
const closable = (f, { literal }) => {
  publicationSetup(f);
  ignoreLocalSettings(f);
  if (literal) f.config.repositories.target.hostRules = "literal";
  write(f.main, "dotln.config.json", JSON.stringify(f.config));
  git(f.main, "add", "-A");
  git(f.main, "commit", "-qm", "test: probe registration");
  git(f.main, "push", "-q", "origin", "main");
  f.mapClone();
  const started = f.start();
  write(f.target, "change.txt", "changed\n");
  git(f.target, "add", "-A");
  git(f.target, "commit", "-qm", "Target change");
  closeOrder(f);
  git(f.orderRoot, "add", "-A");
  git(f.orderRoot, "commit", "-qm", "Closed target order");
  git(f.main, "merge", "-q", "--no-ff", "-m", "Merge target order records", "wo-999");
  git(f.main, "push", "-q", "origin", "main");
  git(f.clone, "merge", "-q", "--no-ff", "-m", "Merge target change", "wo-999");
  git(f.clone, "push", "-q", join(f.base, "target.git"), "main:main");
  return started;
};
const state = (f) => ({
  targetExists: existsSync(f.target),
  orderRootExists: existsSync(f.orderRoot),
  registryHasOrder: Object.values(
    existsSync(targetRegistryPath(f.main))
      ? JSON.parse(readFileSync(targetRegistryPath(f.main), "utf8"))
      : {},
  ).some((entry) => entry.workOrderId === "WO-999"),
  codexRules: existsSync(join(f.main, ".codex/rules/dotln-WO-999.rules")),
  sidecar: existsSync(docPath(f.main, "control", "local/host-rules/WO-999.json")),
  cloneBranch: git(f.clone, "branch", "--list", "wo-999") !== "",
});

for (const [name, literal, ignoreRules] of [
  ["literal-dirty-main", true, false],
  ["control-dirty-main", false, false],
  ["literal-ignored-rules-main", true, true],
])
  test(name, () =>
    withFixture((f) => {
      publicationSetup(f);
      ignoreLocalSettings(f);
      // The candidate repair: the per-order Codex rules file is ignored too.
      if (ignoreRules)
        write(
          f.main,
          ".gitignore",
          readFileSync(join(f.main, ".gitignore"), "utf8") +
            "/.codex/rules/dotln-WO-*.rules\n",
        );
      if (literal) f.config.repositories.target.hostRules = "literal";
      write(f.main, "dotln.config.json", JSON.stringify(f.config));
      const second = "records/work-orders/WO-998-second.md";
      write(
        f.main,
        second,
        "# WO-998 — a second launchpad order\n\n**Model:** any.\n**Effort:** executor any; verifier any; reviewer any.\n",
      );
      git(f.main, "add", "-A");
      git(f.main, "commit", "-qm", "test: a second order");
      git(f.main, "push", "-q", "origin", "main");
      f.mapClone();
      f.start();
      const mainStatus = git(f.main, "status", "--porcelain", "--untracked-files=all");
      const secondStart = f.worktree("start", "WO-998", second);
      observe({
        probe: name,
        mainStatus,
        secondExit: secondStart.status,
        secondStderr: secondStart.stderr.split("\n")[0],
        secondCreated: existsSync(join(f.base, "launchpad-wo998")),
        secondPrintedLaunchLines: /Host launch lines|--add-dir|--allow-tool/u.test(
          secondStart.stdout,
        ),
        codexRulesPresent: existsSync(join(f.main, ".codex/rules/dotln-WO-999.rules")),
      });
      if (literal && !ignoreRules) {
        // Release close tolerates the file; another start cannot run until
        // that order closes, so one literal-fallback order blocks the next.
        assert.match(mainStatus, /^\?\? \.codex\/rules\/dotln-WO-999\.rules$/mu);
        assert.notEqual(secondStart.status, 0);
        assert.match(secondStart.stderr, /working tree is not clean/u);
      } else {
        // Without the opt-in, or with the rules file ignored, main stays clean
        // and a launchpad order starts with no host launch lines.
        assert.equal(mainStatus, "");
        assert.equal(
          existsSync(join(f.main, ".codex/rules/dotln-WO-999.rules")),
          ignoreRules,
        );
        assert.equal(secondStart.status, 0, secondStart.stderr);
        assert.doesNotMatch(secondStart.stdout, /Host launch lines|--add-dir|--allow-tool/u);
      }
    }),
  );

test("literal-malformed-settings-close", () =>
  withFixture((f) => {
    closable(f, { literal: true });
    const settings = join(f.main, ".claude/settings.local.json");
    const valid = readFileSync(settings, "utf8");
    const baseBefore = git(f.clone, "rev-parse", "HEAD");
    // An operator hand edit leaves the local settings briefly invalid.
    writeFileSync(settings, valid.replace(/\]\s*\}\s*\}\s*$/u, "],}}\n"));
    const first = f.close("--publish");
    const afterFirst = { ...state(f), baseMoved: git(f.clone, "rev-parse", "HEAD") !== baseBefore };
    writeFileSync(settings, valid);
    const retry = f.close("--publish");
    const afterRetry = state(f);
    const allow = JSON.parse(readFileSync(settings, "utf8")).permissions.allow;
    observe({
      probe: "literal-malformed-settings-close",
      firstExit: first.status,
      firstStderr: first.stderr.split("\n")[0].slice(0, 400),
      afterFirst,
      retryExit: retry.status,
      retryStderr: retry.stderr.split("\n")[0].slice(0, 400),
      afterRetry,
      orderRulesRemaining: allow.filter((rule) => rule.includes("wo-999") || rule.includes("WO-999")).length,
    });
    // Safe behavior: refuse before an irreversible step, or let the retry
    // finish once the operator repairs the file.
    assert.ok(
      (first.status !== 0 && afterFirst.targetExists && !afterFirst.baseMoved) ||
        retry.status === 0,
      "the close neither refused before its effects nor completed on retry",
    );
  }));

test("base-info-exclude-env", () =>
  withFixture((f) => {
    closable(f, { literal: false });
    const exclude = join(f.clone, git(f.clone, "rev-parse", "--git-path", "info/exclude"));
    write(f.clone, ".env", "SECRET=1\n");
    writeFileSync(exclude, readFileSync(exclude, "utf8") + ".env\n");
    const baseBefore = git(f.clone, "rev-parse", "HEAD");
    const hiddenFromStandard = !git(f.clone, "ls-files", "--others", "--exclude-standard").includes(".env");
    const refused = f.close("--publish");
    observe({
      probe: "base-info-exclude-env",
      hiddenFromStandard,
      exit: refused.status,
      stderr: refused.stderr.split("\n")[0].slice(0, 400),
      envRetained: existsSync(join(f.clone, ".env")),
      targetExists: existsSync(f.target),
      baseMoved: git(f.clone, "rev-parse", "HEAD") !== baseBefore,
    });
    assert.ok(hiddenFromStandard);
    assert.notEqual(refused.status, 0);
    assert.match(refused.stderr, /\.env/u);
    assert.ok(existsSync(join(f.clone, ".env")));
    assert.ok(existsSync(f.target));
    assert.equal(git(f.clone, "rev-parse", "HEAD"), baseBefore);
  }));

// The repaired scan also reaches output the base already ignored: a declared
// root the base checkout holds from work outside the order is deleted too.
test("base-preignored-disposable", () =>
  withFixture(
    (f) => {
      f.config.classes.fixture.disposable = ["node_modules"];
      closable(f, { literal: false });
      write(f.clone, "node_modules/pkg/index.js", "operator build output\n");
      const ignoredBefore = git(f.clone, "check-ignore", "node_modules/pkg/index.js");
      const closed = f.close("--publish");
      const record = JSON.parse(
        readFileSync(docPath(f.main, "control", "local/retained/WO-999/release-close.json"), "utf8"),
      );
      observe({
        probe: "base-preignored-disposable",
        ignoredBefore,
        exit: closed.status,
        baseNodeModules: existsSync(join(f.clone, "node_modules")),
        baseRows: record.targetCleanup?.disposable?.base ?? null,
      });
      assert.equal(closed.status, 0, closed.stderr);
      assert.equal(existsSync(join(f.clone, "node_modules")), false);
      assert.deepEqual(record.targetCleanup.disposable.base, [{ path: "node_modules", files: 1 }]);
    },
    { baseIgnore: "node_modules/\n" },
  ));

test("literal-malformed-settings-start", () =>
  withFixture((f) => {
    publicationSetup(f);
    ignoreLocalSettings(f);
    f.config.repositories.target.hostRules = "literal";
    write(f.main, "dotln.config.json", JSON.stringify(f.config));
    git(f.main, "add", "-A");
    git(f.main, "commit", "-qm", "test: opt into the literal fallback");
    git(f.main, "push", "-q", "origin", "main");
    const settings = join(f.main, ".claude/settings.local.json");
    write(f.main, ".claude/settings.local.json", '{"permissions": {"allow": ["Bash(npm test)",]}}\n');
    f.mapClone();
    const first = f.worktree("start", "WO-999", f.order);
    const afterFirst = { ...state(f), sidecar: existsSync(docPath(f.main, "control", "local/host-rules/WO-999.json")) };
    write(f.main, ".claude/settings.local.json", '{"permissions": {"allow": ["Bash(npm test)"]}}\n');
    const retry = f.worktree("start", "WO-999", f.order);
    const rewrite = f.worktree("host-rules", "--rewrite", "WO-999");
    observe({
      probe: "literal-malformed-settings-start",
      firstExit: first.status,
      firstStderr: first.stderr.split("\n")[0].slice(0, 500),
      afterFirst,
      retryExit: retry.status,
      retryStderr: retry.stderr.split("\n")[0].slice(0, 300),
      rewriteExit: rewrite.status,
      rewriteOut: (rewrite.stdout || rewrite.stderr).split("\n")[0].slice(0, 200),
      allowAfterRewrite: JSON.parse(readFileSync(settings, "utf8")).permissions.allow.length,
    });
    // The printed recovery is to rerun start; it must then succeed.
    assert.equal(retry.status, 0, "the printed start retry does not complete");
  }));

test("release-tag-moved-forward", () =>
  withFixture((f) => {
    const forge = publicationSetup(f);
    ignoreLocalSettings(f);
    f.config.repositories.target.release = { policy: "declared" };
    f.config.repositories.target.authorityProfile.allowedEffects.push("release.close");
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
    write(
      f.main,
      f.order,
      "# WO-999 — target lifecycle fixture\n\n**Model:** any.\n**Effort:** executor any; verifier any; reviewer any.\n**Repository:** target @ " + f.baseCommit + "\n**Target release classification:** minor\n",
    );
    git(f.main, "add", "-A");
    git(f.main, "commit", "-qm", "test: declare a target release");
    git(f.main, "push", "-q", "origin", "main");
    f.mapClone();
    f.start();
    write(f.target, "change.txt", "changed\n");
    git(f.target, "add", "-A");
    git(f.target, "commit", "-qm", "Target change");
    closeOrder(f);
    git(f.orderRoot, "add", "-A");
    git(f.orderRoot, "commit", "-qm", "Closed target order");
    git(f.main, "merge", "-q", "--no-ff", "-m", "Merge target order records", "wo-999");
    git(f.main, "push", "-q", "origin", "main");
    const remote = join(f.base, "target.git");
    const merger = join(f.base, "merger");
    git(f.base, "clone", "-q", remote, merger);
    git(merger, "config", "user.email", "fixture@example.invalid");
    git(merger, "config", "user.name", "Fixture");
    git(merger, "fetch", "-q", f.clone, "wo-999");
    git(merger, "merge", "-q", "--no-ff", "-m", "Merge target change", "FETCH_HEAD");
    git(merger, "push", "-q", "origin", "main");
    const releases = () =>
      existsSync(forge.state) ? JSON.parse(readFileSync(forge.state, "utf8")).releases : {};
    const ghFile = join(forge.bin, "gh");
    const ghOriginal = readFileSync(ghFile, "utf8");
    writeFileSync(
      ghFile,
      ghOriginal.replace(
        "const args = process.argv.slice(2);",
        "const args = process.argv.slice(2); if (args[0] === 'release' && args[1] === 'create') { console.error('simulated release failure'); process.exit(77); }",
      ),
    );
    const interrupted = f.close("--publish");
    writeFileSync(ghFile, ghOriginal);
    const recorded = git(remote, "rev-parse", "v0.1.0^{commit}");
    // The base advances and the remote tag moves forward to the new base
    // head, which the merged base reaches: neither is the reviewed commit.
    git(merger, "commit", "-q", "--allow-empty", "-m", "Later unreviewed change");
    git(merger, "push", "-q", "origin", "main");
    const later = git(remote, "rev-parse", "main");
    git(f.clone, "fetch", "-q", "--no-tags", "--refmap=", remote, "main");
    git(f.clone, "update-ref", "refs/remotes/origin/main", git(f.clone, "rev-parse", "FETCH_HEAD"));
    git(remote, "update-ref", "refs/tags/v0.1.0", later);
    const moved = f.close("--publish");
    const releasesAfterMoved = Object.keys(releases());
    git(remote, "update-ref", "refs/tags/v0.1.0", recorded);
    const restored = f.close("--publish");
    observe({
      probe: "release-tag-moved-forward",
      interruptedExit: interrupted.status,
      interruptedStderr: interrupted.stderr.split("\n")[0].slice(0, 200),
      recordedIsLater: recorded === later,
      movedExit: moved.status,
      movedStderr: moved.stderr.split("\n")[0].slice(0, 300),
      releasesAfterMoved,
      restoredExit: restored.status,
      restoredRelease: /GitHub Release created/u.test(restored.stdout),
      tagAtRecorded: git(remote, "rev-parse", "v0.1.0^{commit}") === recorded,
      releaseCount: Object.keys(releases()).length,
    });
    assert.notEqual(interrupted.status, 0);
    assert.notEqual(recorded, later);
    assert.notEqual(moved.status, 0);
    assert.match(moved.stderr, /not the recorded release commit/u);
    assert.deepEqual(releasesAfterMoved, []);
    assert.equal(restored.status, 0, restored.stderr);
    assert.equal(git(remote, "rev-parse", "v0.1.0^{commit}"), recorded);
    assert.equal(Object.keys(releases()).length, 1);
  }));
`;
const scratch = mkdtempSync(join(tmpdir(), "dotln-wo221-ver002-"));
const file = join(scratch, `${mode}.mjs`);
writeFileSync(file, source);
try {
  await import(pathToFileURL(file).href);
} finally {
  rmSync(scratch, { recursive: true, force: true });
}
