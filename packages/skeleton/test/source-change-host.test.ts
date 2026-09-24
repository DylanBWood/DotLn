import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  existsSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";
import { decodeLog, replay, type Event } from "@dotln/kernel";
import {
  outsideWriteEffect,
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
import { sourceDigest } from "../src/source-change-worktree.js";
import { installSourceChangeCommands } from "../src/source-change-command.js";
import {
  createSourceFixture,
  sourceFixtureOptions,
  fixtureGit as git,
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

for (const transport of ["claude", "codex"] as const)
  test(`WO-052 AC1 ${transport}: governed foreign worktree, failing baseline, committed passing result, receipt and explicit finish`, async () => {
    const root = createSourceFixture();
    try {
      const options = sourceFixtureOptions(root, () => 10, "commit", transport);
      const head = git(launchpad, "rev-parse", "HEAD");
      const tree = git(launchpad, "rev-parse", "HEAD^{tree}");
      const host = new SourceChangeHost(options);
      const result = await host.run();
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

for (const point of ["before-commit", "after-commit", "after-receipt"] as const)
  test(`WO-052 AC2 real host SIGKILL ${point}: expired lease recovers one effect`, async () => {
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
      await assert.rejects(
        () => new SourceChangeHost(sourceFixtureOptions(root, () => 100)).run(),
        /lease has not expired/,
      );
      assert.equal(launches(root), 1);
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
    await assert.rejects(
      () => new SourceChangeHost(sourceFixtureOptions(root, () => 6_000)).run(),
      /committed tree is dirty/,
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
    const revoke = installSourceChangeCommands({
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
    });
    for (const command of [
      testCommand,
      "git add -A",
      `git commit -F ${host.tree.messagePath}`,
    ])
      assert.equal(hook(command), true, command);
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
      hook(testCommand),
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
      await assert.rejects(() =>
        new SourceChangeHost(sourceFixtureOptions(root, () => 6_000)).run(),
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
  // The refusal names the removed path and the configured ceiling (VER-001 F1).
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
