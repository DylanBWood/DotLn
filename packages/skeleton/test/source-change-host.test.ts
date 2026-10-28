import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  existsSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
  chmodSync,
  linkSync,
  symlinkSync,
  readlinkSync,
  mkdirSync,
  unlinkSync,
} from "node:fs";
import { join } from "node:path";
import {
  confinedTestCommand,
  writerSandboxProfilePath,
} from "../src/discovery-sandbox.js";
import { decodeLog, replay, type Event } from "@dotln/kernel";
import {
  outsideWriteEffect,
  fnv1a64,
  COMPILER_PACKAGE_VERSION,
  seiriEnvironment,
  seiriLoadout,
} from "@dotln/compiler";
import {
  isArtifactIdentityV1,
  isArtifactRefusalType,
} from "../src/artifact-identity.js";
import { LiveReactorDriver } from "../src/scenario.js";
import { SourceChangeHost } from "../src/source-change-host.js";
import {
  initialState,
  projectRuntimeEnvironment,
  seiriReactor,
  selectSourceChangeSlice,
  skeletonStateFromRuntime,
} from "../src/reactor.js";
import {
  decodeSourceObservation,
  decodeSourceRequest,
  sourceChangeDecision,
} from "../src/source-change-state.js";
import {
  sourceDigest,
  sourceGit,
  sourceObjectEnvironment,
  SourceImportRefusal,
} from "../src/source-change-worktree.js";
import { installSourceChangeCommands } from "../src/source-change-command.js";
import {
  beginHarnessSession,
  evaluateHarnessHook,
} from "../src/harness-host.js";
import { feedbackBoundary } from "../src/feedback-boundary.js";
import { contributorProgram } from "../src/loadouts/contributor.js";
import { HARNESS_HOST_VERSION } from "../src/version.js";
import {
  createSourceFixture,
  cleanupFaults,
  sourceFixtureOptions,
  fixtureGit as git,
  fixtureObjectEnvironment,
  launchpad,
} from "./source-change-fixture.js";

const launches = (root: string) =>
  readFileSync(join(root, "launches.txt"), "utf8")
    .trim()
    .split("\n")
    .filter(Boolean).length;
const events = (root: string) =>
  decodeLog(readFileSync(join(root, "store/events.jsonl"), "utf8"));
const dispose = (root: string) =>
  rmSync(root, { recursive: true, force: true });

test("WO-204-target-writer: only a live host grant admits an exclusive detached writer", async () => {
  const root = createSourceFixture();
  try {
    const options = sourceFixtureOptions(root, () => 10, "commit", "claude");
    const transport = options.transport;
    const host = new SourceChangeHost({
      ...options,
      transport: {
        name: transport.name,
        harnessVersion: transport.harnessVersion,
        dispatch(request, now) {
          const route = join(
            launchpad,
            "docs/control/local/harness/targets",
            sourceDigest(request.cwd),
            "source-change-commands.json",
          );
          const original = readFileSync(route, "utf8");
          const grant = JSON.parse(original);
          const guard = (session = request.episodeId) => {
            const run = spawnSync(
              process.execPath,
              [
                join(
                  request.cwd,
                  ".claude/hooks/concurrent-work-requires-worktrees.mjs",
                ),
              ],
              {
                cwd: request.cwd,
                encoding: "utf8",
                timeout: 10_000,
                env: {
                  ...process.env,
                  ...fixtureObjectEnvironment(request.cwd),
                  CLAUDE_PID: String(process.pid),
                },
                input: JSON.stringify({
                  hook_event_name: "PreToolUse",
                  cwd: request.cwd,
                  session_id: session,
                  tool_name: "Write",
                  tool_input: {
                    file_path: join(request.cwd, "fixture.txt"),
                    content: "synthetic",
                  },
                }),
              },
            );
            assert.equal(run.status, 0, run.stderr);
            return JSON.parse(run.stdout).hookSpecificOutput
              ?.permissionDecision;
          };
          try {
            unlinkSync(route);
            assert.equal(
              guard(),
              "deny",
              "an arbitrary detached checkout has no host-bound branch",
            );
            for (const changed of [
              { expiresAt: 0 },
              { branch: "forged" },
              { baseCommit: "0".repeat(40) },
            ]) {
              writeFileSync(route, JSON.stringify({ ...grant, ...changed }));
              assert.equal(guard(), "deny");
            }
            writeFileSync(route, original);
            assert.equal(
              guard(),
              undefined,
              "the live host route can reserve its source writer",
            );
            assert.equal(
              guard("another_writer"),
              "deny",
              "the same worktree still has one writer",
            );
          } finally {
            writeFileSync(route, original);
          }
          return transport.dispatch(request, now);
        },
      },
    });

    assert.equal((await host.run()).status, "observed");
  } finally {
    dispose(root);
  }
});

test("recovered unreceipted dirty commits close with a typed host admission refusal", async () => {
  for (const interruption of ["signal", "crash"]) {
    const root = createSourceFixture();
    try {
      if (interruption === "signal") {
        const abort = new AbortController();
        const host: SourceChangeHost = new SourceChangeHost({
          ...sourceFixtureOptions(root, () => 10),
          signal: abort.signal,
          afterResult() {
            writeFileSync(join(host.tree.path, "fixture.txt"), "dirty\n");
            abort.abort("SIGINT");
          },
        });
        await assert.rejects(host.run(), /interrupted/);
      } else {
        const script = `
          import { writeFileSync } from 'node:fs';
          import { join } from 'node:path';
          import { SourceChangeHost } from ${JSON.stringify(new URL("../src/source-change-host.js", import.meta.url).href)};
          import { sourceFixtureOptions } from ${JSON.stringify(new URL("./source-change-fixture.js", import.meta.url).href)};
          const host = new SourceChangeHost({...sourceFixtureOptions(process.argv[1], () => 10), afterResult() {
            writeFileSync(join(host.tree.path, 'fixture.txt'), 'dirty\\n');
            process.kill(process.pid, 'SIGKILL');
          }});
          await host.run();`;
        const killed = spawnSync(
          process.execPath,
          ["--input-type=module", "-e", script, root],
          {
            encoding: "utf8",
            timeout: 30_000,
          },
        );
        assert.equal(killed.signal, "SIGKILL", killed.stderr);
      }
      assert.equal(
        events(root).filter((e) => e.type === "SourceChangeRefused").length,
        0,
      );
      const abort = new AbortController();
      const interrupted = new SourceChangeHost({
        ...sourceFixtureOptions(root, () => 100),
        signal: abort.signal,
      });
      const effect = interrupted.tree.effect.bind(interrupted.tree);
      interrupted.tree.effect = (...args) => {
        try {
          return effect(...args);
        } catch (error) {
          abort.abort("SIGTERM");
          throw error;
        }
      };
      await assert.rejects(interrupted.run(), /interrupted/);
      assert.equal(
        events(root).filter((e) => e.type === "SourceChangeRefused").length,
        0,
      );
      const recovered = await new SourceChangeHost(
        sourceFixtureOptions(root, () => 100),
      ).run();
      assert.equal(recovered.status, "refused");
      if (recovered.status === "refused")
        assert.equal(
          recovered.refusal.reason,
          "committed-tree-drift:fixture.txt",
        );
      assert.equal(
        events(root).filter((e) => e.type === "SourceChangeRefused").length,
        1,
      );
      assert.equal(
        events(root).filter((e) => e.type === "CommandResult").length,
        1,
      );
      assert.deepEqual(
        await new SourceChangeHost(sourceFixtureOptions(root, () => 100)).run(),
        recovered,
      );
      assert.equal(launches(root), 1);
    } finally {
      dispose(root);
    }
  }
});

for (const transport of ["claude", "codex"] as const)
  test(`WO-052 AC1 ${transport}: governed foreign worktree, failing baseline, committed passing result, receipt and explicit finish`, async () => {
    const root = createSourceFixture();
    try {
      const options = sourceFixtureOptions(root, () => 10, "commit", transport);
      const head = git(launchpad, "rev-parse", "HEAD");
      const tree = git(launchpad, "rev-parse", "HEAD^{tree}");
      let settled = false;
      const host = new SourceChangeHost({
        ...options,
        afterResult() {
          settled = true;
          assert.equal(
            existsSync(
              join(
                launchpad,
                "docs/control/local/harness/targets",
                sourceDigest(host.tree.path),
                "source-change-commands.json",
              ),
            ),
            true,
            "the settlement hook precedes the durable result and cleanup",
          );
          assert.equal(
            existsSync(writerSandboxProfilePath(launchpad, host.tree.path)),
            true,
            "cleanup follows the durable result and integrity observation",
          );
        },
      });
      const result = await host.run();
      assert.equal(
        existsSync(writerSandboxProfilePath(launchpad, host.tree.path)),
        false,
      );
      assert.equal(settled, true);
      assert.equal(result.status, "observed");
      if (result.status !== "observed") return;
      const observation = result.observation;
      assert.equal(observation.testBefore.exitCode, 1);
      assert.equal(observation.testAfter.exitCode, 0);
      assert.equal(
        observation.commit,
        git(host.tree.path, "rev-parse", "HEAD"),
      );
      assert.equal(observation.branch, "source-fixture");
      assert.equal(
        git(host.tree.path, "rev-parse", "HEAD^"),
        options.workOrder.baseCommit,
      );
      assert.equal(
        git(
          host.tree.path,
          "diff",
          "--name-only",
          options.workOrder.baseCommit,
          "HEAD",
        ),
        "fixture.txt",
      );
      assert.match(observation.diffHash, /^[a-f0-9]{64}$/u);
      assert.equal(launches(root), 1);
      assert.ok(
        existsSync(join(host.tree.path, ".claude/target-worker-manifest.json")),
      );
      const log = events(root);
      assert.ok(
        log.findIndex((event) => event.type === "WorkerAttemptStarted") <
          log.findIndex((event) => event.type === "CommandReceipt"),
      );
      const restored = replay(
        initialState(),
        log,
        seiriReactor,
        {},
        projectRuntimeEnvironment,
      ).state;
      assert.deepEqual(
        selectSourceChangeSlice(skeletonStateFromRuntime(restored)).observation,
        observation,
      );
      assert.equal(
        restored.pendingCommand,
        null,
        "source lifecycle does not mutate the walking slice",
      );
      assert.deepEqual(
        await new SourceChangeHost(
          sourceFixtureOptions(root, () => 20, "commit", transport),
        ).run(),
        result,
      );
      assert.equal(
        events(root).filter((event) => event.type === "SourceChangeObserved")
          .length,
        1,
      );
      host.finish();
      assert.equal(existsSync(host.tree.path), false);
      assert.equal(
        git(options.workOrder.repo, "rev-parse", "source-fixture"),
        observation.commit,
      );
      assert.equal(git(launchpad, "rev-parse", "HEAD"), head);
      assert.equal(git(launchpad, "rev-parse", "HEAD^{tree}"), tree);
      assert.equal(
        readFileSync(join(root, "trees/sentinel/keep.txt"), "utf8"),
        "untouched\n",
      );
    } finally {
      dispose(root);
    }
  });

for (const transport of ["codex", "claude"] as const)
  for (const behavior of [
    "commit-blocked",
    "commit-attention",
    "commit-failed",
    "blocked",
  ])
    test(`WO-204 ${transport} ${behavior}: writer request holds before admission and stays held`, async () => {
      const root = createSourceFixture();
      try {
        const options = sourceFixtureOptions(
          root,
          () => 10,
          behavior,
          transport,
        );
        const host = new SourceChangeHost(options);
        const outcome = await host.run();
        assert.deepEqual(outcome, {
          status: "refused",
          refusal: {
            workOrderId: "wo_source_fixture",
            reason: "writer-requested-attention",
          },
        });
        const rows = events(root),
          types = rows.map((row) => row.type);
        assert.ok(
          types.indexOf("WorkerResultObserved") <
            types.indexOf("SourceChangeIntegrityChecked"),
        );
        assert.ok(
          types.lastIndexOf("SourceChangeIntegrityChecked") <
            types.indexOf("SourceChangeRefused"),
        );
        assert.ok(
          types.indexOf("CommandGrantsRevoked") <
            types.indexOf("SourceChangeRefused"),
        );
        assert.equal(
          types.includes("SourceChangeObserved") ||
            types.includes("CandidateImported"),
          false,
        );
        assert.equal(
          readdirSync(join(root, "store")).some((name) =>
            name.endsWith(".source-change.json"),
          ),
          false,
        );
        assert.throws(() =>
          sourceGit(
            options.workOrder.repo,
            "rev-parse",
            "--verify",
            "refs/heads/source-fixture",
          ),
        );
        const commit = git(host.tree.path, "rev-parse", "HEAD");
        if (behavior.startsWith("commit-")) {
          assert.notEqual(commit, options.workOrder.baseCommit);
          assert.throws(() =>
            sourceGit(options.workOrder.repo, "cat-file", "-e", commit),
          );
          assert.ok(
            existsSync(
              join(
                host.tree.objectDirectory,
                commit.slice(0, 2),
                commit.slice(2),
              ),
            ),
          );
        } else assert.equal(commit, options.workOrder.baseCommit);
        assert.deepEqual(await new SourceChangeHost(options).run(), outcome);
        assert.equal(launches(root), 1);
      } finally {
        dispose(root);
      }
    });

for (const transport of ["codex", "claude"] as const)
  test(`WO-204 ${transport}: a crash after the writer request still holds on recovery`, async () => {
    const root = createSourceFixture();
    try {
      const script = `
        import { SourceChangeHost } from ${JSON.stringify(new URL("../src/source-change-host.js", import.meta.url).href)};
        import { sourceFixtureOptions } from ${JSON.stringify(new URL("./source-change-fixture.js", import.meta.url).href)};
        await new SourceChangeHost({...sourceFixtureOptions(process.argv[1], () => 10, 'commit-blocked', process.argv[2]),
          onEvent(event) { if (event.type === 'WorkerResultObserved') process.kill(process.pid, 'SIGKILL'); }
        }).run();`;
      const killed = spawnSync(
        process.execPath,
        ["--input-type=module", "-e", script, root, transport],
        { encoding: "utf8", timeout: 30_000 },
      );
      assert.equal(killed.signal, "SIGKILL", killed.stderr);
      const options = sourceFixtureOptions(
        root,
        () => 100,
        "commit-blocked",
        transport,
      );
      assert.deepEqual(await new SourceChangeHost(options).run(), {
        status: "refused",
        refusal: {
          workOrderId: "wo_source_fixture",
          reason: "writer-requested-attention",
        },
      });
      assert.equal(launches(root), 1);
      assert.equal(
        events(root).some(
          (row) =>
            row.type === "CandidateImported" ||
            row.type === "SourceChangeObserved",
        ),
        false,
      );
      assert.throws(() =>
        sourceGit(
          options.workOrder.repo,
          "rev-parse",
          "--verify",
          "refs/heads/source-fixture",
        ),
      );
    } finally {
      dispose(root);
    }
  });

for (const transport of ["codex", "claude"] as const)
  test(`WO-204 ${transport}: detached commits are private until host import`, async () => {
    const root = createSourceFixture();
    try {
      const options = sourceFixtureOptions(root, () => 10, "commit", transport);
      const refs = git(
        options.workOrder.repo,
        "for-each-ref",
        "--format=%(refname) %(objectname)",
      );
      let privateCommit = "";
      const host = new SourceChangeHost({
        ...options,
        afterResult() {
          privateCommit = git(host.tree.path, "rev-parse", "HEAD");
          const env = sourceObjectEnvironment(host.tree.path);
          assert.equal(
            git(host.tree.path, "rev-parse", "--abbrev-ref", "HEAD"),
            "HEAD",
          );
          assert.equal(env.GIT_OBJECT_DIRECTORY, host.tree.objectDirectory);
          assert.ok(
            existsSync(
              join(
                env.GIT_OBJECT_DIRECTORY,
                privateCommit.slice(0, 2),
                privateCommit.slice(2),
              ),
            ),
          );
          assert.throws(() =>
            sourceGit(options.workOrder.repo, "cat-file", "-e", privateCommit),
          );
          assert.equal(
            git(
              options.workOrder.repo,
              "for-each-ref",
              "--format=%(refname) %(objectname)",
            ),
            refs,
          );
          // These host reads must resolve a HEAD that is absent from the common store.
          assert.equal(host.tree.verify(), privateCommit);
          host.tree.cleanAgainstCommit();
          assert.equal(host.tree.effect()?.commit, privateCommit);
          host.tree.sharedState();
        },
      });
      const outcome = await host.run();
      assert.equal(outcome.status, "observed");
      assert.equal(
        sourceGit(options.workOrder.repo, "rev-parse", "source-fixture"),
        privateCommit,
      );
      assert.equal(
        sourceGit(
          options.workOrder.repo,
          "rev-parse",
          `${privateCommit}^{tree}`,
        ),
        git(host.tree.path, "rev-parse", "HEAD^{tree}"),
      );
      const rows = events(root);
      const imported = rows.filter((row) => row.type === "CandidateImported");
      assert.equal(imported.length, 1);
      assert.equal(
        (imported[0]!.payload as { commit: string }).commit,
        privateCommit,
      );
      for (const object of (imported[0]!.payload as { objects: string[] })
        .objects)
        assert.doesNotThrow(() =>
          sourceGit(options.workOrder.repo, "cat-file", "-e", object),
        );
      assert.ok(
        rows.findIndex((row) => row.type === "CommandGrantsRevoked") <
          rows.findIndex((row) => row.type === "CandidateImported"),
      );
      assert.ok(
        rows.findIndex((row) => row.type === "CandidateImported") <
          rows.findIndex((row) => row.type === "SourceChangeObserved"),
      );
    } finally {
      dispose(root);
    }
  });

for (const point of ["before-import", "after-import"] as const)
  test(`WO-204 recovery ${point}: retained private objects import once before one ref update`, async () => {
    const root = createSourceFixture();
    try {
      const script = `
        import { SourceChangeHost } from ${JSON.stringify(new URL("../src/source-change-host.js", import.meta.url).href)};
        import { sourceFixtureOptions } from ${JSON.stringify(new URL("./source-change-fixture.js", import.meta.url).href)};
        await new SourceChangeHost({...sourceFixtureOptions(process.argv[1], () => 10),
          onEvent(event) { if (event.type === (process.argv[2] === 'before-import' ? 'CommandGrantsRevoked' : 'CandidateImported')) process.kill(process.pid, 'SIGKILL'); }
        }).run();`;
      const killed = spawnSync(
        process.execPath,
        ["--input-type=module", "-e", script, root, point],
        { encoding: "utf8", timeout: 30_000 },
      );
      assert.equal(killed.signal, "SIGKILL", killed.stderr);
      const options = sourceFixtureOptions(root, () => 100);
      assert.throws(() =>
        sourceGit(
          options.workOrder.repo,
          "rev-parse",
          "--verify",
          "refs/heads/source-fixture",
        ),
      );
      const host = new SourceChangeHost(options);
      const candidate = git(host.tree.path, "rev-parse", "HEAD");
      const packs = join(options.workOrder.repo, ".git/objects/pack");
      const importedBefore = readdirSync(packs).filter((name) =>
        name.endsWith(".pack"),
      );
      assert.equal(importedBefore.length, point === "after-import" ? 1 : 0);
      const packBytes = importedBefore.map((name) =>
        sourceDigest(readFileSync(join(packs, name))),
      );
      assert.equal((await host.run()).status, "observed");
      assert.equal(launches(root), 1);
      assert.equal(
        sourceGit(options.workOrder.repo, "rev-parse", "source-fixture"),
        candidate,
      );
      assert.equal(
        git(
          options.workOrder.repo,
          "reflog",
          "show",
          "--format=%H",
          "source-fixture",
        ).split("\n").length,
        1,
      );
      assert.equal(
        events(root).filter((row) => row.type === "CandidateImported").length,
        1,
      );
      if (point === "after-import")
        assert.deepEqual(
          readdirSync(packs)
            .filter((name) => name.endsWith(".pack"))
            .map((name) => sourceDigest(readFileSync(join(packs, name)))),
          packBytes,
        );
      assert.equal(
        readdirSync(packs).some((name) => name.endsWith(".keep")),
        false,
      );
    } finally {
      dispose(root);
    }
  });

for (const maintenance of [
  ["gc", "--prune=now"],
  ["repack", "-ad"],
])
  for (const point of ["before-import", "after-import"] as const)
    test(`WO-204 maintenance ${maintenance.join(" ")} ${point}: admission retains every object`, async () => {
      const root = createSourceFixture();
      try {
        const options = sourceFixtureOptions(root, () => 10);
        const baseline = sourceGit(
          options.workOrder.repo,
          "rev-parse",
          "HEAD:fixture.txt",
        );
        let maintenanceExit: number | null | undefined;
        const host = new SourceChangeHost({
          ...options,
          onEvent(event) {
            if (
              event.type ===
              (point === "before-import"
                ? "CommandGrantsRevoked"
                : "CandidateImported")
            ) {
              const run = spawnSync(
                "git",
                ["-c", "core.hooksPath=/dev/null", ...maintenance],
                {
                  cwd: options.workOrder.repo,
                  encoding: "utf8",
                  timeout: 15_000,
                  env: {
                    ...process.env,
                    GIT_OBJECT_DIRECTORY: undefined,
                    GIT_ALTERNATE_OBJECT_DIRECTORIES: undefined,
                  },
                },
              );
              maintenanceExit = run.status;
              // Shared maintenance sees the detached worktree's private HEAD and
              // safely stops until import makes that object visible to it.
              if (point === "before-import")
                assert.match(run.stderr, /bad object worktrees\/.+\/HEAD/u);
              else assert.equal(run.status, 0, run.stderr);
            }
          },
        });
        let verified = 0;
        const verify = host.tree.verifyImported.bind(host.tree);
        host.tree.verifyImported = (candidate) => {
          verified++;
          verify(candidate);
        };
        const outcome = await host.run();
        assert.equal(outcome.status, "observed");
        assert.equal(maintenanceExit, point === "before-import" ? 128 : 0);
        assert.equal(
          sourceGit(options.workOrder.repo, "cat-file", "blob", baseline),
          "baseline",
        );
        assert.ok(
          verified >= 3,
          "import and both sides of ref publication verify shared objects",
        );
        const imported = events(root).find(
          (row) => row.type === "CandidateImported",
        )!.payload as { commit: string; objects: string[] };
        assert.equal(
          sourceGit(options.workOrder.repo, "rev-parse", "source-fixture"),
          imported.commit,
        );
        for (const object of imported.objects)
          assert.doesNotThrow(() =>
            sourceGit(options.workOrder.repo, "cat-file", "-e", object),
          );
        assert.doesNotThrow(
          () => sourceGit(options.workOrder.repo, ...maintenance),
          "maintenance can complete after import and publication",
        );
      } finally {
        dispose(root);
      }
    });

test("WO-204 a failed import verification names the object and moves no ref", async () => {
  const root = createSourceFixture();
  try {
    const options = sourceFixtureOptions(root, () => 10);
    const host = new SourceChangeHost(options);
    host.tree.verifyImported = (candidate) => {
      throw new SourceImportRefusal(
        candidate.commit,
        new Error("synthetic import verification failure"),
      );
    };
    await assert.rejects(host.run(), /source-change import refused/u);
    const candidate = git(host.tree.path, "rev-parse", "HEAD");
    const refusal = events(root).find(
      (row) => row.type === "SourceChangeRefused",
    )!.payload as { reason: string };
    assert.equal(refusal.reason, `import:${candidate}`);
    assert.throws(() =>
      sourceGit(
        options.workOrder.repo,
        "rev-parse",
        "--verify",
        "source-fixture",
      ),
    );
    assert.equal(
      events(root).some(
        (row) =>
          row.type === "CandidateImported" ||
          row.type === "SourceChangeObserved",
      ),
      false,
    );
    assert.equal(
      readdirSync(join(root, "store")).some((name) =>
        name.endsWith(".source-change.json"),
      ),
      false,
    );
  } finally {
    dispose(root);
  }
});

for (const point of ["before-commit", "after-commit", "after-receipt"] as const)
  test(`WO-199 real host SIGKILL ${point}: immediate recovery observes one effect`, async () => {
    const root = createSourceFixture();
    try {
      const script = `
        import { SourceChangeHost } from ${JSON.stringify(new URL("../src/source-change-host.js", import.meta.url).href)};
        import { sourceFixtureOptions } from ${JSON.stringify(new URL("./source-change-fixture.js", import.meta.url).href)};
        const options = sourceFixtureOptions(process.argv[1], () => 10);
        const die = () => process.kill(process.pid, 'SIGKILL');
        await new SourceChangeHost({...options,
          ...(process.argv[2] === 'before-commit' ? {onRunning(dispatch) { dispatch.kill(); die(); }} : {}),
          ...(process.argv[2] === 'after-commit' ? {afterResult: die} : {}),
          ...(process.argv[2] === 'after-receipt' ? {afterReceiptSaved: die} : {})
        }).run();`;
      const killed = spawnSync(
        process.execPath,
        ["--input-type=module", "-e", script, root, point],
        { encoding: "utf8", timeout: 30_000 },
      );
      assert.equal(killed.signal, "SIGKILL", killed.stderr);
      assert.equal(launches(root), 1);
      const immediate = await new SourceChangeHost(
        sourceFixtureOptions(root, () => 100),
      ).run();
      assert.equal(immediate.status, "observed");
      assert.equal(launches(root), point === "before-commit" ? 2 : 1);
      const host = new SourceChangeHost(
        sourceFixtureOptions(root, () => 6_000),
      );
      const result = await host.run();
      assert.equal(result.status, "observed");
      assert.equal(launches(root), point === "before-commit" ? 2 : 1);
      assert.equal(
        git(
          host.tree.path,
          "rev-list",
          "--count",
          `${host.options.workOrder.baseCommit}..HEAD`,
        ),
        "1",
      );
      assert.equal(
        events(root).filter((event) => event.type === "SourceChangeObserved")
          .length,
        1,
      );
      assert.equal(
        events(root).filter((event) => event.type === "WorkerAttemptStarted")
          .length,
        point === "before-commit" ? 2 : 1,
      );
      if (result.status === "observed")
        assert.equal(result.observation.testBefore.exitCode, 1);
      host.finish();
    } finally {
      dispose(root);
    }
  });

test("WO-052 AC3 no commit refuses and retains edits; finish never discards them", async () => {
  const root = createSourceFixture();
  try {
    const host = new SourceChangeHost(
      sourceFixtureOptions(root, () => 10, "dirty"),
    );
    assert.deepEqual(await host.run(), {
      status: "refused",
      refusal: {
        workOrderId: "wo_source_fixture",
        reason: "worker-returned-no-commit",
      },
    });
    assert.equal(
      git(host.tree.path, "rev-parse", "HEAD"),
      host.options.workOrder.baseCommit,
    );
    assert.match(git(host.tree.path, "status", "--porcelain"), /fixture.txt/);
    assert.throws(() => host.finish(), /persisted receipt/);
    assert.equal(launches(root), 1);
  } finally {
    dispose(root);
  }
});

test("WO-052 effect receipt and stable request are positively decoded before reclaim or redispatch", async () => {
  const root = createSourceFixture();
  try {
    const host = new SourceChangeHost(sourceFixtureOptions(root, () => 10));
    await host.run();
    const path = join(
      root,
      "store",
      readdirSync(join(root, "store")).find((name) =>
        name.endsWith(".source-change.json"),
      )!,
    );
    const receipt = readFileSync(path, "utf8");
    await assert.rejects(
      () =>
        new SourceChangeHost({
          ...sourceFixtureOptions(root, () => 20),
          model: "changed-model",
        }).run(),
      /request drift/,
    );
    const malformed = JSON.parse(receipt);
    malformed.observation.testBefore.exitCode = "1";
    writeFileSync(path, JSON.stringify(malformed));
    await assert.rejects(
      () => new SourceChangeHost(sourceFixtureOptions(root, () => 20)).run(),
      /invalid source-change effect receipt/,
    );
    assert.equal(readFileSync(path, "utf8"), JSON.stringify(malformed));
    assert.equal(launches(root), 1);
    writeFileSync(path, receipt);
    host.finish();
  } finally {
    dispose(root);
  }
});

test("WO-052 dirty committed tree and unowned ignored files refuse while preserving contents", async () => {
  const root = createSourceFixture();
  try {
    const options = sourceFixtureOptions(root, () => 10);
    const host: SourceChangeHost = new SourceChangeHost({
      ...options,
      afterResult: () =>
        writeFileSync(join(host.tree.path, "fixture.txt"), "uncommitted\n"),
    });
    await assert.rejects(() => host.run(), /committed tree is dirty/);
    assert.equal(launches(root), 1);
    assert.equal(
      (
        await new SourceChangeHost(
          sourceFixtureOptions(root, () => 6_000),
        ).run()
      ).status,
      "refused",
    );
    assert.equal(
      readFileSync(join(host.tree.path, "fixture.txt"), "utf8"),
      "uncommitted\n",
    );
  } finally {
    dispose(root);
  }
  const other = createSourceFixture();
  try {
    const host = new SourceChangeHost(sourceFixtureOptions(other, () => 10));
    await host.run();
    writeFileSync(join(host.tree.path, ".dotln/keep.txt"), "keep");
    assert.throws(() => host.finish(), /unowned/);
    assert.ok(
      existsSync(join(host.tree.path, ".claude/target-worker-manifest.json")),
    );
    assert.equal(
      readFileSync(join(host.tree.path, ".dotln/keep.txt"), "utf8"),
      "keep",
    );
  } finally {
    dispose(other);
  }
});

test("WO-052 authority expiry fences initial dispatch and post-worker admission", async () => {
  const root = createSourceFixture();
  try {
    const required = sourceFixtureOptions(root, () => 10);
    await assert.rejects(
      () =>
        new SourceChangeHost({
          ...required,
          authorityEnvelope: {
            ...required.authorityEnvelope,
            requiredEvidence: ["operator-approval"],
          },
          workOrder: {
            ...required.workOrder,
            requiredEvidence: ["operator-approval"],
          },
        }).run(),
      /profile-refused/,
    );
    await assert.rejects(
      () =>
        new SourceChangeHost(sourceFixtureOptions(root, () => 1_000_001)).run(),
      /profile-refused/,
    );
    assert.equal(launches(root), 0);
    let now = 10;
    const host = new SourceChangeHost({
      ...sourceFixtureOptions(root, () => now),
      afterResult: () => {
        now = 1_000_001;
      },
    });
    await assert.rejects(() => host.run(), /profile-refused/);
    assert.equal(
      events(root).some((event) => event.type === "SourceChangeObserved"),
      false,
    );
    assert.equal(
      events(root).some((event) => event.type === "CommandResult"),
      false,
    );
    assert.equal(
      git(
        host.tree.path,
        "rev-list",
        "--count",
        `${host.options.workOrder.baseCommit}..HEAD`,
      ),
      "1",
    );
  } finally {
    dispose(root);
  }
});

test("WO-052 AC4 source payloads reject malformed identity, cross-order/branch results and terminal rewrites", () => {
  const request = {
    workOrderId: "wo",
    repo: "/fixture",
    baseCommit: "a".repeat(40),
    branch: "branch",
    surfaces: ["src"],
  };
  const result = {
    command: "node test.mjs",
    exitCode: 0,
    signal: null,
    stdoutHash: sourceDigest(""),
    stderrHash: sourceDigest(""),
  };
  const observation = {
    workOrderId: "wo",
    commit: "b".repeat(40),
    branch: "branch",
    diffHash: sourceDigest("diff"),
    testBefore: { ...result, exitCode: 1 },
    testAfter: result,
  };
  for (const bad of [
    { ...request, surfaces: ["../escape"] },
    { ...request, baseCommit: "main" },
    { ...request, extra: true },
  ])
    assert.throws(() => decodeSourceRequest(bad));
  for (const bad of [
    { ...observation, commit: [] },
    { ...observation, diffHash: "bad" },
    { ...observation, testAfter: { ...result, exitCode: [0] } },
  ])
    assert.throws(() => decodeSourceObservation(bad));
  const event = (type: string, payload: unknown): Event => ({
    schemaVersion: 1,
    eventId: "evt_1",
    actorId: "source-change-host",
    workstreamId: "source",
    occurredAt: 1,
    type,
    payload: payload as Event["payload"],
  });
  const opened = sourceChangeDecision(
    {},
    event("SourceChangeRequested", request),
  ).state;
  assert.throws(
    () => sourceChangeDecision({}, event("SourceChangeObserved", observation)),
    /no request/,
  );
  for (const changed of [
    { ...observation, workOrderId: "other" },
    { ...observation, branch: "other" },
  ])
    assert.throws(
      () =>
        sourceChangeDecision(opened, event("SourceChangeObserved", changed)),
      /conflicts/,
    );
  const completed = sourceChangeDecision(
    opened,
    event("SourceChangeObserved", observation),
  ).state;
  assert.equal(
    sourceChangeDecision(completed, event("SourceChangeObserved", observation))
      .state,
    completed,
  );
  assert.throws(
    () =>
      sourceChangeDecision(
        completed,
        event("SourceChangeRefused", { workOrderId: "wo", reason: "late" }),
      ),
    /conflicts/,
  );
});

test("WO-052 emitted Claude permission hook admits only live host-issued exact commands", async () => {
  const root = createSourceFixture();
  try {
    const host = new SourceChangeHost(
      sourceFixtureOptions(root, () => 10, "commit", "claude"),
    );
    await host.run();
    const hook = (command: string, cwd = host.tree.path, tool = "Bash") => {
      const result = spawnSync(
        process.execPath,
        [join(host.tree.path, ".claude/hooks/permissions.mjs")],
        {
          cwd: host.tree.path,
          encoding: "utf8",
          timeout: 10_000,
          input: JSON.stringify({
            hook_event_name: "PreToolUse",
            cwd: host.tree.path,
            session_id: "route-check",
            tool_name: tool,
            tool_input: { command, cwd },
          }),
        },
      );
      assert.equal(result.status, 0, result.stderr);
      return (
        JSON.parse(result.stdout).hookSpecificOutput?.permissionDecision !==
        "deny"
      );
    };
    assert.equal(
      hook("schema result data", host.tree.path, "StructuredOutput"),
      true,
    );
    assert.equal(
      hook("schema result data", host.tree.path, "UnknownOutputTool"),
      false,
    );
    const testCommand = host.options.testCommand;
    assert.equal(
      hook(testCommand),
      false,
      "completed dispatch has revoked its grant",
    );
    const grantInput = {
      launchpad,
      target: host.tree.path,
      commandId: host.command.commandId,
      requestKey: sourceDigest("fixture"),
      episodeId: "fixture_route",
      baseCommit: host.options.workOrder.baseCommit,
      branch: host.options.branch,
      testCommand,
      messagePath: host.tree.messagePath,
      expiresAt: Date.now() + 60_000,
    };
    const revoke = installSourceChangeCommands(grantInput);
    const profileFile = writerSandboxProfilePath(launchpad, host.tree.path);
    const confined = confinedTestCommand(
      host.tree.path,
      testCommand,
      profileFile,
    );
    for (const command of [
      confined,
      "git add -A",
      `git commit -F ${host.tree.messagePath}`,
    ])
      assert.equal(hook(command), true, command);
    assert.equal(hook(`${confined}x`), false, "one changed character refuses");
    assert.equal(
      hook(profileFile, host.tree.path, "Write"),
      false,
      "the writer cannot alter the host profile",
    );
    const profile = readFileSync(profileFile, "utf8");
    chmodSync(profileFile, 0o600);
    writeFileSync(profileFile, profile + " ");
    assert.equal(hook(confined), false, "changed profile bytes refuse");
    writeFileSync(profileFile, profile);
    chmodSync(profileFile, 0o400);
    assert.equal(
      hook(testCommand),
      false,
      "raw test command bypasses confinement",
    );
    for (const command of [
      `${testCommand} && git push`,
      "git push",
      "git add -A --force",
      `git commit -F ${host.tree.messagePath}.other`,
    ])
      assert.equal(hook(command), false, command);
    assert.equal(hook(testCommand, join(root, "target")), false);
    const path = join(
      launchpad,
      "docs/control/local/harness/targets",
      sourceDigest(host.tree.path),
      "source-change-commands.json",
    );
    const grant = JSON.parse(readFileSync(path, "utf8"));
    writeFileSync(path, JSON.stringify({ ...grant, expiresAt: 1 }));
    assert.equal(hook(testCommand), false);
    const dead = spawnSync(
      process.execPath,
      ["-e", "console.log(process.pid)"],
      { encoding: "utf8" },
    );
    writeFileSync(
      path,
      JSON.stringify({ ...grant, pid: Number(dead.stdout.trim()) }),
    );
    assert.equal(hook(testCommand), false);
    writeFileSync(path, JSON.stringify(grant));
    const permissionPath = join(
      host.tree.path,
      ".claude/hooks/permissions.mjs",
    );
    const permission = readFileSync(permissionPath, "utf8");
    const match =
      /await runTargetHarnessHook\(([\s\S]*?), feedbackBoundary\);/u.exec(
        permission,
      )!;
    const config = JSON.parse(match[1]!);
    config.envelope.deniedEffects.push("git.local");
    writeFileSync(
      permissionPath,
      permission.replace(match[1]!, JSON.stringify(config)),
    );
    assert.equal(
      hook(confined),
      true,
      "the narrowed target still permits shell.run",
    );
    assert.equal(
      hook("git add -A"),
      false,
      "the route cannot widen target git.local authority",
    );
    writeFileSync(permissionPath, permission);
    revoke();
    assert.equal(hook(testCommand), false);
    const alias = join(root, "hook-alias");
    linkSync(permissionPath, alias);
    assert.throws(
      () => installSourceChangeCommands(grantInput),
      /not ordinary/u,
      "a preexisting alias to a governed hook refuses before launch",
    );
    unlinkSync(alias);
    writeFileSync(profileFile, profile, { mode: 0o400 });
    const recovered = installSourceChangeCommands(grantInput);
    assert.equal(
      hook(confined),
      true,
      "an exact ordinary orphan profile recovers",
    );
    recovered();
    writeFileSync(profileFile, "changed orphan", { mode: 0o400 });
    assert.throws(
      () => installSourceChangeCommands(grantInput),
      /orphaned.*profile drift/u,
    );
    unlinkSync(profileFile);
    host.finish();
  } finally {
    dispose(root);
  }
});

test("WO-052 wrong branch and outside-surface commits refuse without redispatch or discard", async () => {
  for (const change of ["branch", "surface"]) {
    const root = createSourceFixture();
    try {
      const host: SourceChangeHost = new SourceChangeHost({
        ...sourceFixtureOptions(root, () => 10),
        afterResult: () => {
          if (change === "branch")
            git(host.tree.path, "checkout", "-b", "unexpected-branch");
          else {
            writeFileSync(join(host.tree.path, "unexpected.txt"), "preserve\n");
            git(host.tree.path, "add", "unexpected.txt");
            git(
              host.tree.path,
              "-c",
              "maintenance.auto=false",
              "commit",
              "-m",
              "Synthetic out-of-scope effect",
            );
          }
        },
      });
      await assert.rejects(
        () => host.run(),
        change === "branch"
          ? /identity drift/
          : /outside the declared surfaces/,
      );
      assert.equal(
        (
          await new SourceChangeHost(
            sourceFixtureOptions(root, () => 6_000),
          ).run()
        ).status,
        "refused",
      );
      assert.equal(launches(root), 1);
      assert.ok(existsSync(host.tree.path));
      assert.equal(
        events(root).some((event) => event.type === "SourceChangeObserved"),
        false,
      );
    } finally {
      dispose(root);
    }
  }
});

for (const name of ["claude", "codex"] as const)
  test(`WO-112 ${name}: unexplained shared changes are refused and preserved`, async () => {
    const root = createSourceFixture();
    const repo = join(root, "target");
    const base = readFileSync(join(root, "base.txt"), "utf8");
    try {
      git(root, "init", "--bare", join(root, "alternate"));
      const host: SourceChangeHost = new SourceChangeHost({
        ...sourceFixtureOptions(root, () => 10, "commit", name),
        afterResult: () => {
          const head = git(host.tree.path, "rev-parse", "HEAD");
          git(host.tree.path, "update-ref", "refs/heads/main", head);
          git(host.tree.path, "update-ref", "refs/tags/stray", head);
          git(host.tree.path, "replace", head, base);
          writeFileSync(
            join(repo, ".git/objects/info/alternates"),
            `${join(root, "alternate", "objects")}\n`,
          );
        },
      });
      const outcome = await host.run();
      assert.equal(outcome.status, "refused");
      assert.equal(
        outcome.status === "refused" && outcome.refusal.reason,
        "shared-repository-changed",
      );
      assert.notEqual(git(repo, "rev-parse", "refs/heads/main"), base);
      assert.notEqual(
        git(repo, "for-each-ref", "refs/tags", "refs/replace"),
        "",
      );
      assert.equal(
        existsSync(join(repo, ".git/objects/info/alternates")),
        true,
      );
      assert.notEqual(git(host.tree.path, "rev-parse", "HEAD"), base);
      assert.throws(() =>
        git(repo, "rev-parse", "--verify", "refs/heads/source-fixture"),
      );
      assert.equal(launches(root), 1);
      assert.equal(
        events(root).some((event) => event.type === "SourceChangeObserved"),
        false,
      );
    } finally {
      dispose(root);
    }
  });

test("WO-112 a result that is not one commit with the host message refuses for any writer", async () => {
  for (const change of ["two-commits", "message"]) {
    const root = createSourceFixture();
    try {
      const host: SourceChangeHost = new SourceChangeHost({
        ...sourceFixtureOptions(root, () => 10),
        afterResult: () => {
          if (change === "message")
            git(
              host.tree.path,
              "-c",
              "maintenance.auto=false",
              "commit",
              "--amend",
              "-m",
              "Writer's own message",
            );
          else {
            writeFileSync(join(host.tree.path, "fixture.txt"), "second\n");
            git(
              host.tree.path,
              "-c",
              "maintenance.auto=false",
              "commit",
              "-am",
              "Synthetic source change",
            );
          }
        },
      });
      await assert.rejects(
        () => host.run(),
        /not one commit with the host message/,
      );
      assert.equal(
        (
          events(root).find((event) => event.type === "SourceChangeRefused")
            ?.payload as { reason: string } | undefined
        )?.reason,
        "host-admission-effect",
      );
      assert.equal(
        events(root).some((event) => event.type === "WorkerInterrupted"),
        false,
      );
      assert.equal(launches(root), 1);
      assert.equal(
        events(root).some((event) => event.type === "SourceChangeObserved"),
        false,
      );
    } finally {
      dispose(root);
    }
  }
});

test("WO-112 a replace ref cannot hide a change outside the surfaces from the host", async () => {
  const root = createSourceFixture();
  const repo = join(root, "target");
  const base = readFileSync(join(root, "base.txt"), "utf8");
  try {
    let plant = () => {};
    const host: SourceChangeHost = new SourceChangeHost({
      ...sourceFixtureOptions(root, () => 10),
      afterResult: () => {
        // The writer's commit carries a file outside its surfaces; a replace
        // ref dresses it as the in-surface change alone.
        const tree = host.tree.path;
        const inSurface = git(tree, "rev-parse", "HEAD^{tree}");
        writeFileSync(join(tree, "outside.txt"), "hidden\n");
        git(tree, "add", "outside.txt");
        git(
          tree,
          "-c",
          "maintenance.auto=false",
          "commit",
          "--amend",
          "--no-edit",
        );
        const head = git(tree, "rev-parse", "HEAD");
        const disguise = git(
          tree,
          "commit-tree",
          inSurface,
          "-p",
          base,
          "-m",
          "Synthetic source change",
        );
        plant = () => git(tree, "replace", head, disguise);
        plant();
      },
    });
    const outcome = await host.run();
    assert.equal(
      outcome.status === "refused" && outcome.refusal.reason,
      "shared-repository-changed",
    );
    assert.notEqual(git(host.tree.path, "for-each-ref", "refs/replace"), "");
    // Planted where no snapshot saw it, as after a lost host, the host's own
    // Git still judges the real commit.
    assert.throws(() => host.tree.effect(), /outside the declared surfaces/);
  } finally {
    dispose(root);
  }
});

test("WO-052 a second interrupted attempt exhausts recovery; no third dispatch", async () => {
  const root = createSourceFixture();
  try {
    let now = 10,
      dispatches = 0;
    const options = sourceFixtureOptions(root, () => now);
    const transport = {
      name: options.transport.name,
      harnessVersion: options.transport.harnessVersion,
      dispatch() {
        dispatches++;
        throw new Error("synthetic interruption");
      },
    };
    await assert.rejects(
      () => new SourceChangeHost({ ...options, transport }).run(),
      /synthetic interruption/,
    );
    now = 6_000;
    await assert.rejects(
      () => new SourceChangeHost({ ...options, transport }).run(),
      /synthetic interruption/,
    );
    now = 12_000;
    const result = await new SourceChangeHost({ ...options, transport }).run();
    assert.deepEqual(result, {
      status: "refused",
      refusal: {
        workOrderId: "wo_source_fixture",
        reason: "recovery-dispatch-exhausted",
      },
    });
    assert.equal(dispatches, 2);
  } finally {
    dispose(root);
  }
});

test("an executor permission hook admits its registered target and refuses the sibling directory", async () => {
  const fixture = createSourceFixture();
  const root = join(fixture, "target");
  const target = join(fixture, "registered-target");
  const temporary = join(fixture, "temporary");
  const before = process.env.TMPDIR;
  try {
    mkdirSync(target);
    mkdirSync(temporary);
    process.env.TMPDIR = temporary;
    mkdirSync(join(root, "scripts"), { recursive: true });
    mkdirSync(join(root, "docs/control/local"), { recursive: true });
    writeFileSync(
      join(root, "dotln.config.json"),
      JSON.stringify({ version: 1 }),
    );
    writeFileSync(
      join(root, "scripts/resume.mjs"),
      'console.log(JSON.stringify({ workOrder: "WO-999", phase: "active" }));\n',
    );
    writeFileSync(
      join(root, "docs/control/local/target-worktrees.json"),
      JSON.stringify({
        [target]: { target, launchpad: root, workOrderId: "WO-999" },
      }),
    );
    const program = contributorProgram();
    const config = {
      compilerPackageVersion: COMPILER_PACKAGE_VERSION,
      runtime: {
        skeletonVersion: HARNESS_HOST_VERSION,
        boundaryContract: "feedback-v1" as const,
        files: [
          {
            path: "fixture.txt",
            hash: `fnv1a64:${fnv1a64(readFileSync(join(root, "fixture.txt"), "utf8"))}`,
          },
        ],
      },
      event: "PreToolUse" as const,
      kind: "permission" as const,
      envelope: program.loadout.authorityEnvelope,
      grants: program.loadout.grants ?? [],
      outsideWriteGrants: [
        {
          role: "executor",
          grants: [
            {
              kind: "target-worktree" as const,
              source: "Fixture target registration",
              originId: "contributor.executor",
              authorityGrantId: "contributor.target-worktree",
            },
          ],
        },
      ],
    };
    beginHarnessSession(root, "registered-executor", "executor");
    const call = (file_path: string) =>
      evaluateHarnessHook(
        config,
        {
          cwd: root,
          session_id: "registered-executor",
          hook_event_name: "PreToolUse",
          tool_name: "Edit",
          tool_input: { file_path },
        },
        root,
        feedbackBoundary,
      );
    const admitted = await call(join(target, "new.txt"));
    assert.notEqual(
      (
        admitted.hookSpecificOutput as
          { permissionDecision?: string } | undefined
      )?.permissionDecision,
      "deny",
      JSON.stringify(admitted),
    );
    const refused = await call(join(fixture, "beside.txt"));
    assert.equal(
      (refused.hookSpecificOutput as { permissionDecision?: string })
        .permissionDecision,
      "deny",
    );
  } finally {
    if (before === undefined) delete process.env.TMPDIR;
    else process.env.TMPDIR = before;
    dispose(fixture);
  }
});

test("WO-157 a grant-bearing artifact identity equips and runs through the source-change host; a malformed registry still refuses", async () => {
  const grant = {
    grantId: "fixture.outside",
    version: 1,
    grantedBy: "operator" as const,
    effects: [
      outsideWriteEffect({
        kind: "operator-root",
        root: "/fixture/authorized",
        source: "Fixture operator direction",
      }),
    ],
    repo: seiriEnvironment().repo,
    reason: "Fixture operator direction",
  };
  const graph = { ...seiriLoadout, authorityGrants: [grant] };
  const environment = {
    ...seiriEnvironment(),
    authorityGrantRegistry: [grant],
  };
  const driver = new LiveReactorDriver();
  driver.equip(graph, environment);
  const refusals = (log: string) =>
    decodeLog(log)
      .map((event) => event.type)
      .filter((type) => isArtifactRefusalType(type));
  assert.deepEqual(refusals(driver.log), []);
  const identity: unknown = driver.state.artifactIdentity;
  if (!isArtifactIdentityV1(identity))
    assert.fail("the equip pinned no artifact identity");
  assert.deepEqual(identity.compilationEnvironment.authorityGrantRegistry, [
    grant,
  ]);
  const root = createSourceFixture();
  try {
    const result = await new SourceChangeHost({
      ...sourceFixtureOptions(root, () => 10),
      artifactIdentity: identity,
    }).run();
    assert.equal(result.status, "observed");
    assert.equal(launches(root), 1);
    assert.throws(
      () =>
        new SourceChangeHost({
          ...sourceFixtureOptions(root, () => 10),
          artifactIdentity: {
            ...identity,
            compilationEnvironment: {
              ...identity.compilationEnvironment,
              authorityGrantRegistry: "not a registry",
            },
          } as unknown as typeof identity,
        }),
      /compiled artifact identity is invalid/u,
    );
  } finally {
    dispose(root);
  }
  const malformed = new LiveReactorDriver();
  malformed.equip(graph, {
    ...environment,
    authorityGrantRegistry: [{ ...grant, grantedBy: "worker" as "operator" }],
  });
  assert.deepEqual(refusals(malformed.log), ["ArtifactCompilationRefused"]);
  assert.equal(
    isArtifactIdentityV1({
      ...identity,
      compilationEnvironment: {
        ...identity.compilationEnvironment,
        authorityGrantRegistry: [{ ...grant, version: 0 }],
      },
    }),
    false,
  );
});

test("WO-157 the host counts committed paths against the files ceiling and refuses a removal without repo.delete, except a declared Sort move", async () => {
  const run = async (
    behavior: string,
    surfaces: string[],
    change: { files?: number; relocation?: { from: string; to: string } },
  ) => {
    const root = createSourceFixture();
    try {
      const base = sourceFixtureOptions(root, () => 10, behavior);
      const envelope = base.authorityEnvelope;
      const outcome = await new SourceChangeHost({
        ...base,
        surfaces,
        authorityEnvelope: {
          ...envelope,
          resourceLimits: {
            ...envelope.resourceLimits,
            ...(change.files === undefined ? {} : { files: change.files }),
          },
        },
        ...(change.relocation ? { relocation: change.relocation } : {}),
      })
        .run()
        .then(
          (result) => ({ status: result.status, error: "" }),
          (error: Error) => ({ status: "thrown", error: error.message }),
        );
      return { ...outcome, launches: launches(root) };
    } finally {
      dispose(root);
    }
  };
  const refused = (
    outcome: { status: string; error: string },
    pattern: RegExp,
  ) => {
    assert.equal(outcome.status, "thrown", JSON.stringify(outcome));
    assert.match(outcome.error, pattern);
  };
  // Shine: the writer turns a file surface into a directory of files, all of
  // them inside the surface and within the ceiling.
  // The refusal names the removed path and the configured ceiling.
  refused(
    await run("commit-directory", ["fixture.txt"], { files: 3 }),
    /removes or changes the type of paths without repo\.delete \(3 paths against the envelope's files ceiling of 3\): D fixture\.txt$/u,
  );
  refused(
    await run("commit-directory", ["fixture.txt"], {}),
    /without repo\.delete \(3 paths against no files ceiling\): D fixture\.txt$/u,
  );
  refused(
    await run("commit-wide", ["fixture.txt", "fixture-extra.txt"], {
      files: 1,
    }),
    /touches 2 paths, above the envelope's files ceiling of 1: fixture-extra\.txt, fixture\.txt$/u,
  );
  // Standardize within its ceiling, and the declared Sort move, still pass.
  // No writer envelope can carry repo.delete (validateWriterRequest admits
  // only repo.write, git.local and shell.run), so a removal is always refused.
  assert.deepEqual(await run("commit", ["fixture.txt"], { files: 1 }), {
    status: "observed",
    error: "",
    launches: 1,
  });
  const move = { from: "fixture.txt", to: "sorted/fixture.txt" };
  assert.deepEqual(
    await run("commit-move", [move.from, move.to], {
      files: 2,
      relocation: move,
    }),
    { status: "observed", error: "", launches: 1 },
  );
  refused(
    await run("commit-move", [move.from, move.to], { files: 2 }),
    /without repo\.delete \(2 paths against the envelope's files ceiling of 2\): D fixture\.txt$/u,
  );
});

for (const transport of ["claude", "codex"] as const) {
  test(`WO-204 ${transport}: a previously removed profile still revokes the route`, async () => {
    const root = createSourceFixture();
    try {
      const host = new SourceChangeHost({
        ...sourceFixtureOptions(root, () => 10, "commit", transport),
        afterResult() {
          unlinkSync(writerSandboxProfilePath(launchpad, host.tree.path));
        },
      });
      assert.equal((await host.run()).status, "observed");
      const rows = events(root);
      const revoked = rows.find(
        (event) => event.type === "CommandGrantsRevoked",
      )!;
      const removed = (revoked.payload as { removed: string[] }).removed;
      assert.equal(removed.length, 2);
      assert.ok(removed.every((path) => !existsSync(path)));
      assert.equal(
        rows.some((event) => event.type === "CommandCleanupFailed"),
        false,
      );
      assert.ok(
        rows.findIndex(
          (event) => event.type === "SourceChangeIntegrityChecked",
        ) < rows.indexOf(revoked),
      );
    } finally {
      dispose(root);
    }
  });
  for (const fail of [
    { profile: [1] },
    { route: [1] },
    { profile: [1], route: [1] },
    { profile: "always" },
    { route: "always" },
    { profile: "always", route: "always" },
  ] as const)
    for (const interrupted of [false, true])
      test(`WO-204 ${transport}: cleanup ${JSON.stringify(fail)}, interrupted=${interrupted}`, async () => {
        const root = createSourceFixture();
        try {
          const faults = cleanupFaults(fail);
          const options = sourceFixtureOptions(
            root,
            () => 10,
            "commit",
            transport,
          );
          const host = new SourceChangeHost({
            ...options,
            unlinkCommandFile: faults.unlink,
            ...(interrupted
              ? {
                  onRunning(
                    dispatch: import("../src/worker-transport.js").TransportDispatch<
                      import("../src/worker-protocol.js").WriterResult
                    >,
                  ) {
                    dispatch.kill();
                  },
                }
              : {}),
          });
          let effects = 0;
          const effect = host.tree.effect.bind(host.tree);
          host.tree.effect = (...args) => {
            effects++;
            return effect(...args);
          };
          const first = await host.run();
          assert.equal(first.status, "refused");
          if (first.status === "refused")
            assert.match(first.refusal.reason, /^command-route-live:/u);
          // The initial baseline-effect read is the only one: no candidate
          // admission, after-test, import, receipt or terminal command result.
          assert.equal(effects, 1);
          assert.deepEqual(
            faults.calls.map((call) => call.kind),
            ["profile", "route"],
          );
          assert.ok(faults.calls.every((call) => call.count === 1));
          const rows = events(root),
            failed = rows.findIndex(
              (event) => event.type === "CommandCleanupFailed",
            );
          const stopped = rows.findIndex(
            (event) => event.type === "SourceChangeProcessStopped",
          );
          const integrity = rows.findIndex(
            (event) => event.type === "SourceChangeIntegrityChecked",
          );
          assert.ok(stopped >= 0 && stopped < integrity && integrity < failed);
          if (interrupted) {
            const index = rows.findIndex(
              (event) => event.type === "WorkerInterrupted",
            );
            assert.ok(stopped < index && index < integrity);
          } else
            assert.ok(
              rows.findIndex((event) => event.type === "WorkerResultObserved") <
                integrity,
            );
          for (const type of [
            "SourceChangeObserved",
            "CommandResult",
            "CandidateImported",
            "CommandGrantsRevoked",
          ])
            assert.equal(
              rows.some((event) => event.type === type),
              false,
              type,
            );
          const survivors = rows
            .filter((event) => event.type === "CommandCleanupFailed")
            .map((event) => event.payload as { path: string; code: string });
          assert.ok(survivors.length > 0);
          for (const survivor of survivors) {
            assert.equal(survivor.code, "EACCES");
            assert.equal(existsSync(survivor.path), true);
            if (first.status === "refused")
              assert.ok(first.refusal.reason.includes(survivor.path));
          }
          // A restarted host has the real unlink. It must revoke the original
          // survivors before observing the candidate or starting a replacement.
          const next = await new SourceChangeHost(
            sourceFixtureOptions(root, () => 100, "commit", transport),
          ).run();
          assert.equal(next.status, "observed");
          assert.ok(survivors.every((survivor) => !existsSync(survivor.path)));
          assert.equal(launches(root), interrupted ? 2 : 1);
        } finally {
          dispose(root);
        }
      });
}

test("WO-204 cleanup injection counts each path independently", () => {
  const faults = cleanupFaults({ profile: [1], route: [2] });
  assert.throws(() => faults.unlink("/synthetic/profile"), { code: "EACCES" });
  assert.throws(() => faults.unlink("/synthetic/source-change-commands.json"), {
    code: "ENOENT",
  });
  assert.throws(() => faults.unlink("/synthetic/source-change-commands.json"), {
    code: "EACCES",
  });
  assert.deepEqual(
    faults.calls.map(({ kind, count }) => [kind, count]),
    [
      ["profile", 1],
      ["route", 1],
      ["route", 2],
    ],
  );
});

for (const flag of ["skip-worktree", "assume-unchanged", "none"] as const)
  for (const drift of ["modified", "deleted", "executable"] as const)
    test(`WO-204 committed bytes: ${flag} with ${drift} refuses before after-testing`, async () => {
      const root = createSourceFixture();
      try {
        const host = new SourceChangeHost({
          ...sourceFixtureOptions(root, () => 10),
          afterResult() {
            if (flag !== "none")
              git(host.tree.path, "update-index", `--${flag}`, "fixture.txt");
            const path = join(host.tree.path, "fixture.txt");
            if (drift === "modified")
              writeFileSync(path, "uncommitted bytes\n");
            if (drift === "deleted") unlinkSync(path);
            if (drift === "executable") chmodSync(path, 0o755);
          },
        });
        let admittedEffects = 0;
        const effect = host.tree.effect.bind(host.tree);
        host.tree.effect = (admit = false) => {
          if (admit) admittedEffects++;
          return effect(admit);
        };
        await assert.rejects(
          host.run(),
          /committed tree is dirty: fixture.txt/u,
        );
        assert.equal(admittedEffects, 0);
        const rows = events(root);
        const refusal = rows.find(
          (event) => event.type === "SourceChangeRefused",
        )!.payload as { reason: string };
        assert.equal(
          refusal.reason,
          `${flag === "none" ? "committed-tree-drift" : "index-flags"}:fixture.txt`,
        );
        assert.equal(
          rows.some((event) =>
            ["SourceChangeObserved", "CandidateImported"].includes(event.type),
          ),
          false,
        );
        const file = join(host.tree.path, "fixture.txt");
        if (drift === "modified")
          assert.equal(readFileSync(file, "utf8"), "uncommitted bytes\n");
        if (drift === "deleted") assert.equal(existsSync(file), false);
        if (drift === "executable")
          assert.ok((await import("node:fs")).lstatSync(file).mode & 0o111);
        if (flag !== "none")
          assert.match(
            git(host.tree.path, "ls-files", "-v", "fixture.txt"),
            flag === "skip-worktree" ? /^S /u : /^h /u,
          );
      } finally {
        dispose(root);
      }
    });

for (const transport of ["codex", "claude"] as const) {
  for (const kind of ["symlink", "dangling-symlink", "gitlink"] as const)
    test(`WO-204 clean committed entry: ${transport} ${kind}`, async () => {
      const root = createSourceFixture();
      try {
        const repo = join(root, "target");
        if (kind === "gitlink")
          git(
            repo,
            "update-index",
            "--add",
            "--cacheinfo",
            `160000,${git(repo, "rev-parse", "HEAD")},vendor/sub`,
          );
        else {
          symlinkSync(
            kind === "symlink" ? "fixture.txt" : "absent.txt",
            join(repo, "link.txt"),
          );
          git(repo, "add", "link.txt");
        }
        git(repo, "commit", "-m", "Track an entry beside the candidate");
        writeFileSync(join(root, "base.txt"), git(repo, "rev-parse", "HEAD"));
        const host = new SourceChangeHost(
          sourceFixtureOptions(root, () => 10, "commit", transport),
        );
        assert.equal((await host.run()).status, "observed");
      } finally {
        dispose(root);
      }
    });

  for (const drift of ["target", "symlink-to-file", "file-to-symlink"] as const)
    test(`WO-204 committed entry drift: ${transport} ${drift}`, async () => {
      const root = createSourceFixture();
      try {
        const repo = join(root, "target");
        symlinkSync("fixture.txt", join(repo, "link.txt"));
        git(repo, "add", "link.txt");
        git(repo, "commit", "-m", "Track a symlink beside the candidate");
        writeFileSync(join(root, "base.txt"), git(repo, "rev-parse", "HEAD"));
        const name = drift === "file-to-symlink" ? "fixture.txt" : "link.txt";
        const host = new SourceChangeHost({
          ...sourceFixtureOptions(root, () => 10, "commit", transport),
          afterResult() {
            const path = join(host.tree.path, name);
            unlinkSync(path);
            if (drift === "symlink-to-file") writeFileSync(path, "fixture.txt");
            else symlinkSync("absent.txt", path);
          },
        });
        let afterEffects = 0;
        const effect = host.tree.effect.bind(host.tree);
        host.tree.effect = (admit = false) => {
          if (admit) afterEffects++;
          return effect(admit);
        };
        await assert.rejects(
          host.run(),
          new RegExp(`committed-tree-drift:${name}`),
        );
        assert.equal(afterEffects, 0);
        assert.equal(
          events(root).some((event) => event.type === "CandidateImported"),
          false,
        );
        if (drift !== "symlink-to-file")
          assert.equal(readlinkSync(join(host.tree.path, name)), "absent.txt");
      } finally {
        dispose(root);
      }
    });

  for (const outcome of [
    "admission",
    "hold",
    "cleanup",
    "interrupted",
  ] as const)
    test(`WO-204 retained candidate: ${transport} ${outcome} preserves shared Git and recovery`, async () => {
      const root = createSourceFixture();
      try {
        const repo = join(root, "target");
        symlinkSync("fixture.txt", join(repo, "link.txt"));
        git(repo, "add", "link.txt");
        git(repo, "commit", "-m", "Track a symlink through candidate recovery");
        writeFileSync(join(root, "base.txt"), git(repo, "rev-parse", "HEAD"));
        const options = sourceFixtureOptions(
          root,
          () => 10,
          outcome === "hold"
            ? "commit-blocked"
            : outcome === "admission"
              ? "commit-wide"
              : "commit",
          transport,
        );
        const abort = new AbortController();
        let originalHead: Buffer, originalIndex: Buffer;
        const host = new SourceChangeHost({
          ...options,
          ...(outcome === "cleanup"
            ? { unlinkCommandFile: cleanupFaults({ profile: [1] }).unlink }
            : {}),
          ...(outcome === "interrupted" ? { signal: abort.signal } : {}),
          afterResult() {
            const directory = git(
              host.tree.path,
              "rev-parse",
              "--absolute-git-dir",
            );
            originalHead = readFileSync(join(directory, "HEAD"));
            originalIndex = readFileSync(join(directory, "index"));
            if (outcome === "interrupted") abort.abort("SIGINT");
          },
        });
        if (outcome === "admission")
          await assert.rejects(host.run(), /outside the declared surfaces/);
        else if (outcome === "interrupted")
          await assert.rejects(host.run(), /interrupted/);
        else assert.equal((await host.run()).status, "refused");
        const candidate = git(host.tree.path, "rev-parse", "HEAD");
        const directory = git(
          host.tree.path,
          "rev-parse",
          "--absolute-git-dir",
        );
        const head = readFileSync(join(directory, "HEAD"));
        const index = readFileSync(join(directory, "index"));
        assert.deepEqual(head, originalHead!);
        assert.deepEqual(index, originalIndex!);
        const plainEnv = {
          ...process.env,
          GIT_OBJECT_DIRECTORY: undefined,
          GIT_ALTERNATE_OBJECT_DIRECTORIES: undefined,
        };
        for (const args of [
          ["log", "--all", "--oneline"],
          ["rev-list", "--all", "--count"],
          ["fsck"],
          ["repack", "-ad"],
          ["gc", "--prune=now"],
          ["worktree", "prune", "--expire", "now"],
        ]) {
          const result = spawnSync("git", args, {
            cwd: repo,
            env: plainEnv,
            encoding: "utf8",
          });
          assert.equal(result.status, 0, `${args.join(" ")}: ${result.stderr}`);
        }
        assert.equal(
          spawnSync("git", ["cat-file", "-e", candidate], {
            cwd: repo,
            env: plainEnv,
          }).status,
          1,
        );
        const retained = events(root).find(
          (event) => event.type === "SourceChangeCandidateRetained",
        )!.payload as { inspectionCommand: string };
        const inspect = spawnSync(
          "/bin/sh",
          ["-c", retained.inspectionCommand],
          { env: plainEnv, encoding: "utf8" },
        );
        assert.equal(inspect.status, 0, inspect.stderr);
        assert.ok(inspect.stdout.includes(candidate));
        assert.deepEqual(readFileSync(join(directory, "HEAD")), head);
        assert.deepEqual(readFileSync(join(directory, "index")), index);
        const resumed = new SourceChangeHost(options);
        const result = await resumed.run();
        const recoverable = outcome === "cleanup" || outcome === "interrupted";
        assert.equal(result.status, recoverable ? "observed" : "refused");
        assert.equal(
          readlinkSync(join(host.tree.path, "link.txt")),
          "fixture.txt",
        );
        assert.equal(launches(root), 1);
        if (recoverable) {
          assert.equal(existsSync(join(directory, "gitdir")), true);
          assert.equal(
            existsSync(join(directory, "dotln-retained-gitdir")),
            false,
          );
          resumed.finish();
          assert.equal(existsSync(host.tree.path), false);
        } else {
          assert.equal(git(host.tree.path, "rev-parse", "HEAD"), candidate);
          assert.equal(
            events(root).filter((event) => event.type === "CandidateImported")
              .length,
            0,
          );
        }
      } finally {
        dispose(root);
      }
    });
}

for (const transport of ["codex", "claude"] as const)
  for (const planted of ["alternates", "commit-graph", "symlink"] as const)
    test(`WO-204 private-store-layout: ${transport} refuses ${planted} before private Git reads`, async () => {
      const root = createSourceFixture();
      try {
        const host = new SourceChangeHost({
          ...sourceFixtureOptions(root, () => 10, "commit", transport),
          afterResult() {
            const info = join(host.tree.objectDirectory, "info");
            if (planted === "symlink")
              symlinkSync(join(root, "target/.git/objects/info"), info);
            else {
              mkdirSync(info, { recursive: true });
              writeFileSync(
                join(info, planted),
                planted === "alternates"
                  ? join(root, "target/.git/objects") + "\n"
                  : "planted graph",
              );
            }
          },
        });
        await assert.rejects(
          host.run(),
          /private object store contains unsupported metadata/,
        );
        assert.equal(
          (
            events(root).find((event) => event.type === "SourceChangeRefused")!
              .payload as { reason: string }
          ).reason,
          "private-object-layout",
        );
        assert.equal(
          events(root).some((event) =>
            ["CandidateImported", "SourceChangeObserved"].includes(event.type),
          ),
          false,
        );
        assert.equal(existsSync(join(host.tree.objectDirectory, "info")), true);
        assert.equal(
          spawnSync("git", ["fsck"], {
            cwd: join(root, "target"),
            env: {
              ...process.env,
              GIT_OBJECT_DIRECTORY: undefined,
              GIT_ALTERNATE_OBJECT_DIRECTORIES: undefined,
            },
          }).status,
          0,
        );
      } finally {
        dispose(root);
      }
    });

for (const transport of ["codex", "claude"] as const)
  test(`WO-204 saved-receipt recovery: ${transport} finishes an already imported candidate`, async () => {
    const root = createSourceFixture();
    try {
      const options = sourceFixtureOptions(root, () => 10, "commit", transport);
      const host = new SourceChangeHost({
        ...options,
        afterReceiptSaved() {
          throw new Error("synthetic post-receipt exception");
        },
      });
      await assert.rejects(host.run(), /synthetic post-receipt exception/);
      assert.equal(
        events(root).filter((event) => event.type === "CandidateImported")
          .length,
        1,
      );
      const resumed = new SourceChangeHost(options);
      assert.equal((await resumed.run()).status, "observed");
      assert.equal(launches(root), 1);
      resumed.finish();
      assert.equal(existsSync(host.tree.path), false);
    } finally {
      dispose(root);
    }
  });
