// Independent VER-001 probes. Run from the launchpad root under harness bounded.
// Every fixture is temporary; no real remote is contacted or published to.
import assert from "node:assert/strict";
import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  realpathSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { spawnSync } from "node:child_process";

const root = realpathSync(process.cwd());
const load = (path) => import(pathToFileURL(join(root, path)));
const { createFixtureRoot, removeTemporaryPath } = await load(
  "scripts/lib/temporary-roots.mjs",
);
const { runGit } = await load("scripts/lib/git.mjs");
const { lintOutwardArtifact, conventionalTypes } = await load(
  "scripts/lib/outward-lint.mjs",
);
const { fetchIntoCheckout } = await load("scripts/lib/github-repository.mjs");
const { installLaunchpadForge } = await load(
  "scripts/test-target-publication-fixture.mjs",
);
const { evaluateHarnessHook } = await load(
  "packages/skeleton/dist/src/harness-host.js",
);
const { feedbackBoundary } = await load(
  "packages/skeleton/dist/src/feedback-boundary.js",
);
const base = realpathSync(
  createFixtureRoot(join(tmpdir(), "dotln-wo246-ver001-")),
);
const observations = [];
const check = async (name, run) => {
  try {
    observations.push({ name, result: "pass", ...(await run()) });
  } catch (error) {
    observations.push({ name, result: "fail", error: error.message });
  }
};
const write = (path, text) => {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, text);
};
const git = (cwd, ...args) =>
  runGit(cwd, ["-c", "core.hooksPath=/dev/null", ...args]);
const commit = (cwd, file, text) => {
  write(join(cwd, file), text);
  git(cwd, "add", file);
  git(
    cwd,
    "-c",
    "user.name=Verification Fixture",
    "-c",
    "user.email=fixture@example.invalid",
    "-c",
    "commit.gpgsign=false",
    "commit",
    "-qm",
    "test: fixture change",
  );
  return git(cwd, "rev-parse", "HEAD");
};

try {
  await check("commit lint is unchanged across a varied corpus", async () => {
    const prior = git(root, "show", "HEAD:scripts/lib/outward-lint.mjs");
    assert.doesNotMatch(prior, /^import /mu);
    const old = await import(
      `data:text/javascript;base64,${Buffer.from(prior).toString("base64")}`
    );
    const vocabulary = { types: [...conventionalTypes], reviewTerms: [] };
    let comparisons = 0;
    for (const emoji of ["", "✨ ", ":memo: ", "🐛 "])
      for (const type of ["fix", "feat", "docs", "ship", "Fix"])
        for (const scope of ["", "(cli)", "(a/b)", "!"])
          for (const subject of [
            "Handle input",
            "",
            " padded ",
            "x".repeat(90),
          ])
            for (const body of ["", "\n\nBody", "\nMissing blank line"])
              for (const separator of [": ", " "]) {
                const text = `${emoji}${type}${scope}${separator}${subject}${body}`;
                const input = { kind: "commit", text, vocabulary };
                assert.deepEqual(
                  lintOutwardArtifact(input),
                  old.lintOutwardArtifact(input),
                );
                comparisons++;
              }
    const titles = [
      "✨ Handle input",
      ":memo: Plan the pass",
      "fix: handle input",
      ":sparkles: feat: handle input",
      `:memo: ${"detail ".repeat(30)}done`,
    ];
    for (const text of titles)
      assert.equal(
        lintOutwardArtifact({ kind: "pr-title", text, vocabulary }).findings
          .length,
        0,
        text,
      );
    for (const text of ["Handle input", "✨", ":memo: ", ":memo:  padded"])
      assert.ok(
        lintOutwardArtifact({
          kind: "pr-title",
          text,
          vocabulary,
        }).findings.some((entry) => entry.rule === "subject.shape"),
        text,
      );
    return { comparisons, admittedTitles: titles.length, refusedTitles: 4 };
  });

  await check(
    "planning publication from a nested directory and spaced path",
    () => {
      const fixture = join(base, "planning fixture");
      mkdirSync(fixture);
      const environment = {
        ...process.env,
        GH_REPO: "ambient/wrong",
        GH_HOST: "wrong.invalid",
      };
      const url = "https://github.invalid/verification/launchpad.git";
      const forge = installLaunchpadForge(fixture, environment, url);
      const checkout = join(fixture, "checkout with spaces");
      mkdirSync(checkout);
      const run = (...args) =>
        runGit(checkout, ["-c", "core.hooksPath=/dev/null", ...args], {
          env: environment,
        });
      run("init", "-q", "-b", "main");
      run("config", "user.name", "Verification Fixture");
      run("config", "user.email", "fixture@example.invalid");
      run("config", "commit.gpgsign", "false");
      write(join(checkout, ".gitignore"), "records/control/local/\n");
      write(
        join(checkout, "dotln.config.json"),
        JSON.stringify({ version: 1, roots: { docs: "records" } }),
      );
      run("add", ".");
      run("commit", "-qm", "test: fixture base");
      run("remote", "add", "origin", url);
      run("push", "-q", "origin", "main");
      const branch = "planning/2030-02-03-nested";
      run("switch", "-q", "-c", branch);
      write(
        join(checkout, "records/planning/passes/nested-2030-02-03.md"),
        "# A synthetic pass\n",
      );
      write(join(checkout, "records/control/local/terms.txt"), "");
      run("add", ".");
      run("commit", "-qm", "docs: plan fixture");
      const nested = join(checkout, "records/planning");
      const bodyFile = join(fixture, "body with spaces.md");
      write(bodyFile, "The fixture checks the publication route.\n");
      const before = forge.pushes().length;
      const flags = [
        "--body-file",
        "../../../body with spaces.md",
        "--title",
        ":memo: Plan nested inputs",
      ];
      const publish = (extra = flags) =>
        spawnSync(
          process.execPath,
          [join(root, "scripts/refute-plan.mjs"), "publish", ...extra],
          {
            cwd: nested,
            env: { ...environment, DOTLN_LAUNCHPAD: checkout },
            encoding: "utf8",
          },
        );
      const repeated = publish([...flags, "--title", ":memo: Repeated"]);
      assert.notEqual(repeated.status, 0);
      assert.match(repeated.stderr, /usage:/u);
      assert.equal(forge.pushes().length, before);
      const opened = publish();
      assert.equal(opened.status, 0, opened.stderr);
      assert.equal(forge.pushes().length, before + 1);
      assert.deepEqual(forge.calls()[0].slice(0, 8), [
        "pr",
        "create",
        "--repo",
        "github.invalid/verification/launchpad",
        "--head",
        branch,
        "--base",
        "main",
      ]);
      assert.equal(
        readFileSync(forge.body, "utf8"),
        readFileSync(bodyFile, "utf8"),
      );
      const head = run("rev-parse", "HEAD");
      forge.script({
        createFails: true,
        view: {
          state: "OPEN",
          url: "https://github.invalid/verification/launchpad/pull/7",
          headRefOid: head,
          headRefName: branch,
          baseRefName: "main",
        },
      });
      const retried = publish();
      assert.equal(retried.status, 0, retried.stderr);
      assert.equal(forge.pushes().length, before + 1);
      return {
        customDocumentRoot: true,
        nestedCwd: true,
        spacedPaths: true,
        repeatedFlagRefused: true,
        pushesIncludingRetry: 1,
        forge: "local bare repository and gh double",
      };
    },
  );

  await check("borrowed-object fetch works in a linked worktree", () => {
    const fixture = join(base, "fetch fixture");
    mkdirSync(fixture);
    const origin = join(fixture, "origin.git");
    git(fixture, "init", "-q", "--bare", "-b", "main", origin);
    const writer = join(fixture, "writer");
    git(fixture, "clone", "-q", origin, writer);
    commit(writer, "one.txt", "one\n");
    git(writer, "push", "-q", "origin", "main");
    const checkout = join(fixture, "checkout");
    git(fixture, "clone", "-q", origin, checkout);
    const linked = join(fixture, "linked checkout");
    git(checkout, "worktree", "add", "-q", "-b", "verification", linked);
    const refs = git(checkout, "for-each-ref");
    const heldObjects = git(checkout, "count-objects", "-v");
    let observed;
    const watch = (inLane, _commit, details) => {
      const lane = inLane(["rev-parse", "--absolute-git-dir"]);
      observed = {
        ...details,
        storeMatches:
          readFileSync(join(lane, "objects/info/alternates"), "utf8").trim() ===
          resolve(linked, git(linked, "rev-parse", "--git-path", "objects")),
      };
    };
    fetchIntoCheckout(linked, origin, "main", { beforeImport: watch });
    assert.equal(observed.fetched, false);
    assert.equal(observed.storeMatches, true);
    assert.equal(git(checkout, "count-objects", "-v"), heldObjects);
    const next = commit(writer, "two.txt", "two\n");
    git(writer, "push", "-q", "origin", "main");
    const before = git(checkout, "count-objects", "-v");
    assert.throws(
      () =>
        fetchIntoCheckout(linked, origin, "main", {
          beforeImport() {
            throw new Error("fixture veto before import");
          },
        }),
      /fixture veto/u,
    );
    assert.equal(git(checkout, "count-objects", "-v"), before);
    assert.equal(git(checkout, "for-each-ref"), refs);
    assert.equal(
      fetchIntoCheckout(linked, origin, "main", { beforeImport: watch }),
      next,
    );
    assert.equal(observed.fetched, true);
    assert.equal(observed.storeMatches, true);
    assert.equal(git(checkout, "for-each-ref"), refs);
    git(linked, "rev-list", "--objects", "--quiet", next);
    return {
      heldFetchSkipped: true,
      newHistoryImported: true,
      vetoPreservedObjectsAndRefs: true,
      linkedObjectStoreMatched: true,
      timeoutMs: observed.timeoutMs,
    };
  });

  await check(
    "repository identity keeps its host when owner and name coincide",
    async () => {
      const fixture = join(base, "repository judgment");
      mkdirSync(fixture);
      git(fixture, "init", "-q", "-b", "main");
      const source = readFileSync(
        join(root, ".claude/hooks/permissions.mjs"),
        "utf8",
      );
      const config = JSON.parse(
        source.match(
          /await runHarnessHook\(([\s\S]*), feedbackBoundary(?:, input(?:, rawInput(?:, control)?)?)?\);/u,
        )[1],
      );
      for (const file of config.runtime.files) {
        const name = config.runtime.snapshot
          ? `${config.runtime.snapshot}/${file.path}`
          : file.path;
        mkdirSync(dirname(join(fixture, name)), { recursive: true });
        cpSync(join(root, name), join(fixture, name));
      }
      git(
        fixture,
        "remote",
        "add",
        "origin",
        "https://github.com/verification/project.git",
      );
      git(
        fixture,
        "remote",
        "add",
        "upstream",
        "https://github.com/verification/parent.git",
      );
      const judge = async (command) => {
        const response = await evaluateHarnessHook(
          config,
          {
            cwd: fixture,
            session_id: "wo246-ver001-fixture",
            hook_event_name: "PreToolUse",
            tool_name: "Bash",
            tool_input: { command },
          },
          fixture,
          feedbackBoundary,
        );
        return {
          refused: response.hookSpecificOutput?.permissionDecision === "deny",
          reason: response.hookSpecificOutput?.permissionDecisionReason ?? null,
        };
      };
      const control = await judge("gh pr list");
      assert.equal(
        control.refused,
        true,
        "ordinary different-repository control must refuse",
      );
      const rows = [];
      for (const command of [
        "gh pr list",
        "gh pr create --title x",
        "gh issue list",
        "gh pr view 1",
      ]) {
        git(
          fixture,
          "remote",
          "set-url",
          "origin",
          "https://github.enterprise.invalid/verification/project.git",
        );
        git(
          fixture,
          "remote",
          "set-url",
          "upstream",
          "https://github.com/verification/project.git",
        );
        const result = await judge(command);
        rows.push({
          command,
          expected: "refuse",
          observed: result.refused ? "refuse" : "admit",
        });
      }
      git(
        fixture,
        "remote",
        "set-url",
        "origin",
        "https://github.com/verification/project.git",
      );
      const same = await judge("gh pr list");
      assert.equal(same.refused, false, "same repository control must admit");
      const explicit = await judge(
        "gh pr list -R github.com/verification/project",
      );
      assert.equal(explicit.refused, false);
      observations.push({
        name: "cross-host repository matrix",
        result: rows.every((row) => row.observed === row.expected)
          ? "pass"
          : "fail",
        origin: "github.enterprise.invalid/verification/project",
        upstream: "github.com/verification/project",
        rows,
        ordinaryDifferentRepositoryControlRefused: control.refused,
        sameRepositoryControlAdmitted: !same.refused,
        explicitRepositoryControlAdmitted: !explicit.refused,
        networkCommandsRun: 0,
      });
      assert.ok(
        rows.every((row) => row.observed === row.expected),
        "distinct hosts with the same owner/name were treated as one repository",
      );
      return { compared: rows.length };
    },
  );
} finally {
  removeTemporaryPath(base, { recursive: true, force: true });
}

const failures = observations.filter((row) => row.result === "fail");
console.log(
  JSON.stringify(
    {
      schemaVersion: 1,
      workOrder: "WO-246",
      verification: "VER-001",
      observations,
      passed: failures.length === 0,
    },
    null,
    2,
  ),
);
process.exitCode = failures.length ? 1 : 0;
