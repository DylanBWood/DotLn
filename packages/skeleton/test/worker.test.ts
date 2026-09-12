import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync, spawn, spawnSync } from "node:child_process";
import {
  existsSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  realpathSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  decodeLog,
  encodeLog,
  pendingCommands,
  replayOutbox,
  type JsonValue,
} from "@dotln/kernel";
import { seiriEnvironment, type ArtifactIdentityV1 } from "@dotln/compiler";
import {
  commandFromState,
  loadout,
  MINUTE,
  workOrderFromState,
} from "../src/reactor.js";
import {
  LiveReactorDriver,
  replayScenario,
  startScenario,
  type FixtureTree,
} from "../src/scenario.js";
import {
  canonicalWorkerArgs,
  ClaudeCliPrintWorkOrderTransport,
  CodexCliExecWorkOrderTransport,
  runWorkerProcess,
  type ProcessRunner,
  type WorkerLaunch,
  type WorkOrderTransport,
  type TransportDispatch,
} from "../src/worker-transport.js";
import {
  WorkerFailure,
  LEASE_MS,
  parseWorkerResult,
  type WorkerRequest,
  type WorkerResult,
  type WorkerEffort,
} from "../src/worker-protocol.js";
import { WorkerStore } from "../src/worker-store.js";
import { WorkerHost } from "../src/worker-host.js";
import { createWorkerFixture, runWorkerDemo } from "../src/worker-demo.js";
import { WorkerWorktrees } from "../src/worker-worktree.js";
import { projectWorkerStatus } from "../src/worker-status.js";

const fixture = JSON.parse(
  readFileSync(
    new URL("../../fixtures/repo-tree.json", import.meta.url),
    "utf8",
  ),
) as FixtureTree;
const processFixture = fileURLToPath(
  new URL("../../fixtures/worker-cli.mjs", import.meta.url),
);
const statusCli = fileURLToPath(new URL("../src/dotln.js", import.meta.url));
const temporary = () =>
  realpathSync(mkdtempSync(join(tmpdir(), "dotln-worker-test-")));
const cliRunner =
  (
    transport: string,
    behavior = "success",
    launches: WorkerLaunch[] = [],
  ): ProcessRunner =>
  (launch) => {
    launches.push(launch);
    return runWorkerProcess({
      ...launch,
      binary: process.execPath,
      args: [processFixture, transport, behavior, ...launch.args],
    });
  };
const claude = (behavior = "success", launches: WorkerLaunch[] = []) =>
  new ClaudeCliPrintWorkOrderTransport(
    cliRunner("claude-cli-print", behavior, launches),
    "2.1.261",
  );
const codex = (behavior = "success", launches: WorkerLaunch[] = []) =>
  new CodexCliExecWorkOrderTransport(
    cliRunner("codex-cli-exec", behavior, launches),
    "0.153.4",
  );
const stateRequest = (driver: LiveReactorDriver): WorkerRequest => ({
  command: commandFromState(driver.state),
  workOrder: workOrderFromState(driver.state),
  artifactIdentity: driver.state
    .artifactIdentity as unknown as ArtifactIdentityV1,
  episodeId: "worker_1",
  model: "required-model",
  effort: "high",
  cwd: "/fixture",
  fixture,
  profile: {
    profileId: "fixture-inspection-v1",
    mounts: [{ path: "/fixture", access: "read" }],
  },
});

// Compile-time compatibility: an existing inspection-only adapter is still a
// WorkOrderTransport without implementing the new verification profile.
const acceptsOriginalTransport = (adapter: {
  readonly name: "claude-cli-print";
  readonly harnessVersion: string;
  dispatch(request: WorkerRequest, now: () => number): TransportDispatch;
}): WorkOrderTransport => adapter;

test("WO-009 AC6 canonical launch shapes pin model, settings, memory, persistence, mounts and honest effort", () => {
  const driver = new LiveReactorDriver();
  startScenario(driver);
  const request = stateRequest(driver);
  const a = canonicalWorkerArgs("claude-cli-print", request, "/schema.json");
  const b = canonicalWorkerArgs(
    "codex-cli-exec",
    { ...request, effort: "unknown" },
    "/schema.json",
  );
  for (const args of [a, b]) {
    assert.equal(args[args.indexOf("--model") + 1], "required-model");
    assert.ok(!args.includes("--fallback-model"));
    assert.ok(!args.includes("--resume"));
    assert.ok(!args.includes("--dangerously-bypass-approvals-and-sandbox"));
  }
  assert.equal(a[a.indexOf("--setting-sources") + 1], "project,local");
  assert.equal(a[a.indexOf("--settings") + 1], '{"autoMemoryEnabled":false}');
  assert.equal(a[a.indexOf("--tools") + 1], "");
  for (const flag of [
    "--no-session-persistence",
    "--safe-mode",
    "--strict-mcp-config",
    "--json-schema",
  ])
    assert.ok(a.includes(flag));
  assert.equal(a[a.indexOf("--effort") + 1], "high");
  for (const flag of [
    "--ignore-user-config",
    "--ephemeral",
    "--strict-config",
    "--output-schema",
  ])
    assert.ok(b.includes(flag));
  assert.ok(
    b.includes(
      'permissions.dotln-worker.filesystem={":minimal"="read",":workspace_roots"="read"}',
    ),
  );
  assert.ok(b.includes("permissions.dotln-worker.network.enabled=false"));
  assert.ok(b.includes("memories.use_memories=false"));
  assert.ok(b.includes("memories.generate_memories=false"));
  assert.ok(!b.includes("--effort"));
  for (const disabled of [
    "apps",
    "plugins",
    "hooks",
    "shell_tool",
    "unified_exec",
    "view_image",
    "multi_agent",
    "memories",
  ]) {
    assert.equal(b[b.indexOf(disabled) - 1], "--disable");
  }
  assert.throws(
    () => canonicalWorkerArgs("codex-cli-exec", request, "/schema", "0.153.4"),
    WorkerFailure,
  );
  assert.throws(
    () => new CodexCliExecWorkOrderTransport(undefined, "0.999.0"),
    WorkerFailure,
  );
  assert.throws(
    () =>
      canonicalWorkerArgs(
        "claude-cli-print",
        {
          ...request,
          profile: {
            ...request.profile,
            mounts: [{ path: "/outside", access: "read" }],
          },
        },
        "/schema",
      ),
    WorkerFailure,
  );
  assert.throws(
    () =>
      canonicalWorkerArgs(
        "claude-cli-print",
        {
          ...request,
          command: {
            ...request.command,
            intent: { kind: "Act", effect: "repo.write", payload: {} },
          },
        },
        "/schema",
      ),
    WorkerFailure,
  );
});

test("WO-125 unknown Codex arguments retain the pre-change bytes on both observed versions", () => {
  const driver = new LiveReactorDriver();
  startScenario(driver);
  const request = { ...stateRequest(driver), effort: "unknown" as const };
  const before = readFileSync(
    new URL("../../fixtures/codex-unknown-args.json", import.meta.url),
    "utf8",
  );
  for (const version of ["0.153.4", "0.154.0"])
    assert.equal(
      JSON.stringify(
        canonicalWorkerArgs("codex-cli-exec", request, "/schema.json", version),
        null,
        2,
      ) + "\n",
      before,
    );
});

test("WO-125 observed efforts reach the process and durable launch claim without effective readback", async () => {
  const observed = JSON.parse(
    readFileSync(
      new URL(
        "../../../../docs/discovery/codex-effort-2026-09-11.json",
        import.meta.url,
      ),
      "utf8",
    ),
  ) as {
    harnessVersion: string;
    rows: { effort: WorkerEffort; accepted: boolean; command: string[] }[];
  };
  assert.deepEqual(
    observed.rows.map((row) => row.effort),
    ["low", "medium", "high", "xhigh", "max"],
  );
  for (const row of observed.rows) {
    assert.equal(row.accepted, true);
    const root = temporary();
    const launches: WorkerLaunch[] = [];
    const transport = new CodexCliExecWorkOrderTransport(
      cliRunner("codex-cli-exec", "success", launches),
      observed.harnessVersion,
    );
    try {
      const result = await runWorkerDemo({
        directory: root,
        fixture,
        transport,
        model: "gpt-6-astra",
        effort: row.effort,
      });
      assert.equal(result.envelope.status, "completed");
      assert.equal(launches.length, 1);
      const launch = launches[0]!;
      const schema = launch.args[launch.args.indexOf("--output-schema") + 1];
      assert.deepEqual(
        [
          "codex",
          ...launch.args.map((arg) =>
            arg === launch.cwd
              ? "<temporary-git-root>"
              : arg === schema
                ? "<schema.json>"
                : arg,
          ),
        ],
        row.command,
      );
      const claims = decodeLog(new WorkerStore(root).read()).filter(
        (event) => event.type === "WorkerAttemptStarted",
      );
      assert.equal(claims.length, 1);
      const claim = claims[0]!.payload as Record<string, JsonValue>;
      assert.equal(claim.effort, row.effort);
      assert.equal(claim.selectionSource, "host-launch");
      assert.equal(claim.effectiveEffort, "unknown");
      assert.equal(claim.effectiveModel, "unknown");
    } finally {
      rmSync(root, { recursive: true });
    }
  }
});

test("WO-125 unobserved version/effort pairs refuse before process launch and name discovery", () => {
  const driver = new LiveReactorDriver();
  startScenario(driver);
  const transport = new CodexCliExecWorkOrderTransport(() => {
    throw new Error("unexpected process launch");
  }, "0.153.4");
  for (const effort of ["low", "medium", "high", "xhigh", "max"] as const)
    assert.throws(
      () => transport.dispatch({ ...stateRequest(driver), effort }, Date.now),
      /profile-refused.*docs\/discovery\/codex-effort-2026-09-11\.json/,
    );
});

test("WO-125 F1 rejects unobserved runtime effort values before process launch", () => {
  const driver = new LiveReactorDriver();
  startScenario(driver);
  let launches = 0;
  const transport = new CodexCliExecWorkOrderTransport(() => {
    launches++;
    throw new Error("unexpected process launch");
  }, "0.154.0");
  for (const effort of [
    "minimal",
    "none",
    "MAX",
    'max"\nsandbox_mode="danger-full-access',
    "",
    null,
    undefined,
    5,
  ])
    assert.throws(
      () =>
        transport.dispatch(
          { ...stateRequest(driver), effort: effort as WorkerEffort },
          Date.now,
        ),
      /profile-refused.*docs\/discovery\/codex-effort-2026-09-11\.json/s,
    );
  assert.equal(launches, 0);
});

test("WO-125 F2 an omitted version cannot authorize explicit effort", () => {
  const driver = new LiveReactorDriver();
  startScenario(driver);
  for (const effort of ["low", "medium", "high", "xhigh", "max"] as const)
    assert.throws(
      () =>
        canonicalWorkerArgs(
          "codex-cli-exec",
          { ...stateRequest(driver), effort },
          "/schema.json",
        ),
      /profile-refused.*unknown.*docs\/discovery\/codex-effort-2026-09-11\.json/,
    );
  assert.deepEqual(
    canonicalWorkerArgs(
      "codex-cli-exec",
      { ...stateRequest(driver), effort: "unknown" },
      "/schema.json",
    ),
    JSON.parse(
      readFileSync(
        new URL("../../fixtures/codex-unknown-args.json", import.meta.url),
        "utf8",
      ),
    ),
  );
});

test("WO-009 AC3 deterministic real-Git create, verified cwd/base, collision and dirty cleanup refusal", () => {
  const root = temporary();
  try {
    const repository = join(root, "repository");
    const base = createWorkerFixture(repository, fixture);
    const manager = new WorkerWorktrees(repository, join(root, "worktrees"));
    const worktree = manager.create("cmd_fixture", base);
    assert.equal(
      execFileSync("git", ["rev-parse", "--show-toplevel"], {
        cwd: worktree.path,
        encoding: "utf8",
      }).trim(),
      worktree.path,
    );
    assert.deepEqual(manager.create("cmd_fixture", base), worktree);
    assert.throws(() => manager.create("../outside", base));
    assert.throws(() =>
      manager.verify({ ...worktree, baseCommit: "0".repeat(40) }),
    );
    writeFileSync(join(worktree.path, "operator-note"), "keep this work\n");
    assert.throws(() => manager.cleanup(worktree), /dirty/u);
    assert.equal(
      readFileSync(join(worktree.path, "operator-note"), "utf8"),
      "keep this work\n",
    );
    // Only test-owned scratch is removed; the production cleanup never forces.
    rmSync(join(worktree.path, "operator-note"));
    manager.cleanup(worktree);
    assert.ok(!existsSync(worktree.path));
    symlinkSync(repository, worktree.path);
    assert.throws(() => manager.create("cmd_fixture", base));
    assert.ok(existsSync(repository));
  } finally {
    rmSync(root, { recursive: true });
  }
});

test("WO-009 AC1/4 one process replaces only the executor; status is read-only and replay is identical", async () => {
  for (const transport of [claude(), codex()]) {
    const root = temporary();
    const store = new WorkerStore(root);
    try {
      let witnessed = false;
      const result = await runWorkerDemo({
        directory: root,
        fixture,
        transport,
        model: "required-model",
        effort: transport.name === "claude-cli-print" ? "high" : "unknown",
        beacons: true,
        onRunning: () => {
          const before = store.read();
          const status = spawnSync(
            process.execPath,
            [statusCli, "status", "--store", root, "--json"],
            { encoding: "utf8" },
          );
          assert.equal(status.status, 0, status.stderr);
          const view = JSON.parse(status.stdout) as ReturnType<
            typeof projectWorkerStatus
          >;
          assert.equal(view.runningEpisodes.length, 1);
          assert.equal(view.pendingCommands.length, 1);
          assert.equal(view.episodes[0]?.model, "required-model");
          assert.equal(view.episodes[0]?.phase, "running");
          assert.equal(store.read(), before);
          witnessed = true;
        },
      });
      assert.ok(witnessed);
      assert.equal(result.envelope.status, "completed");
      assert.deepEqual(Object.keys(result.envelope).sort(), [
        "episodeId",
        "requiresHuman",
        "resultId",
        "status",
        "summary",
        "workOrderId",
      ]);
      assert.equal(result.scenario.verified, true);
      assert.equal(result.scenario.candidates.length, 1);
      assert.deepEqual(replayScenario(store.read()), result.scenario);
      const events = decodeLog(store.read());
      assert.equal(
        events.filter((event) => event.type === "WorkerAttemptStarted").length,
        1,
      );
      for (const type of [
        "CommandResult",
        "CommandRefused",
        "VerificationCompleted",
        "QueuedPulseNoOp",
        "SchedulesCancelled",
        "WorkerWorktreeRemoved",
      ])
        assert.equal(
          events.filter((event) => event.type === type).length,
          1,
          type,
        );
      assert.ok(!store.read().includes("SYNTHETIC_PRIVATE"));
      assert.equal(projectWorkerStatus(events).pendingCommands.length, 0);
      assert.deepEqual(readdirSync(join(root, "worktrees")), []);
      // A completed demo is re-queryable without invoking any actor again.
      const previous = store.read();
      const again = await runWorkerDemo({
        directory: root,
        fixture,
        transport: new ClaudeCliPrintWorkOrderTransport(() => {
          throw new Error("unexpected dispatch");
        }, "2.1.261"),
        model: "required-model",
        effort: "high",
      }).catch((error) => {
        if (transport.name === "codex-cli-exec") return error;
        throw error;
      });
      if (transport.name === "claude-cli-print")
        assert.deepEqual(again.envelope, result.envelope);
      else assert.match(String(again), /no silent model substitution/u);
      assert.equal(store.read(), previous);
    } finally {
      rmSync(root, { recursive: true });
    }
  }
});

test("WO-009 row 2 crash after effect before result persist re-queries the durable receipt without double application", async () => {
  const root = temporary();
  let now = 10_000_000;
  const launches: WorkerLaunch[] = [];
  try {
    await assert.rejects(
      runWorkerDemo({
        directory: root,
        fixture,
        transport: claude("success", launches),
        model: "required-model",
        effort: "high",
        now: () => now,
        afterResultSaved: () => {
          throw new Error("injected host crash after effect");
        },
      }),
      /injected host crash/u,
    );
    const store = new WorkerStore(root);
    const before = decodeLog(store.read());
    assert.equal(pendingCommands(replayOutbox(before)).length, 1);
    assert.equal(
      before.filter((event) => event.type === "CommandResult").length,
      0,
    );
    assert.equal(launches.length, 1);
    now += LEASE_MS + 1;
    const recovery = new ClaudeCliPrintWorkOrderTransport(() => {
      throw new Error("recovery must query, never dispatch");
    }, "2.1.261");
    const result = await runWorkerDemo({
      directory: root,
      fixture,
      transport: recovery,
      model: "required-model",
      effort: "high",
      now: () => now,
    });
    assert.equal(result.scenario.verified, true);
    assert.equal(launches.length, 1);
    const after = decodeLog(store.read());
    assert.equal(
      after.filter((event) => event.type === "WorkerResultRecovered").length,
      1,
    );
    assert.equal(
      after.filter((event) => event.type === "CommandResult").length,
      1,
    );
    assert.equal(pendingCommands(replayOutbox(after)).length, 0);
    assert.deepEqual(replayScenario(store.read()), result.scenario);
  } finally {
    rmSync(root, { recursive: true });
  }
});

test("WO-009 row 4 a result after authority expiry is persisted and quarantined without candidate state mutation", async () => {
  const root = temporary();
  const store = new WorkerStore(root);
  store.acquire();
  try {
    let now = 20 * MINUTE + 1;
    const driver = new LiveReactorDriver(undefined, store.append);
    startScenario(driver);
    const runner: ProcessRunner = (launch) => {
      const child = cliRunner("claude-cli-print")(launch);
      return {
        ...child,
        completed: child.completed.then((result) => {
          now = 40 * MINUTE;
          return result;
        }),
      };
    };
    const host = new WorkerHost({
      store,
      driver,
      transport: new ClaudeCliPrintWorkOrderTransport(runner, "2.1.261"),
      now: () => now,
    });
    await assert.rejects(
      host.run(root, fixture, "required-model", "high"),
      /profile-refused/u,
    );
    const events = decodeLog(store.read());
    const index = events.findIndex(
      (event) => event.type === "WorkerResultObserved",
    );
    assert.ok(index > 0);
    assert.equal(driver.state.candidates.length, 0);
    const decision = driver.decisions[index]!;
    assert.deepEqual(decision.state, driver.decisions[index - 1]!.state);
    assert.deepEqual(decision.trace.branchPath, [
      "WorkerResultObserved",
      "quarantine",
      "authority expired",
    ]);
    assert.ok(
      decision.trace.envInputs.includes("authorityEnvelope:auth_seiri"),
    );
    assert.equal(decision.intents[0]?.kind, "NoOp");
    assert.equal(
      pendingCommands(replayOutbox(events)).length,
      1,
      "quarantine cannot acknowledge the command",
    );
    assert.ok(events.some((event) => event.type === "WorkerResultQuarantined"));
    assert.deepEqual(replayScenario(store.read()).decisions, driver.decisions);
  } finally {
    store.release();
    rmSync(root, { recursive: true });
  }
});

test("WO-009 row 6 SIGKILL leaves a recoverable command and continuation; lease expiry admits a fresh episode", async () => {
  const root = temporary();
  let now = 20_000_000;
  const store = new WorkerStore(root);
  try {
    await assert.rejects(
      runWorkerDemo({
        directory: root,
        fixture,
        transport: claude("wait"),
        model: "required-model",
        effort: "high",
        now: () => now,
        onRunning: (dispatch) => {
          assert.equal(
            projectWorkerStatus(decodeLog(store.read())).runningEpisodes.length,
            1,
          );
          dispatch.kill();
        },
      }),
      /interrupted/u,
    );
    const failed = replayScenario(store.read());
    const before = projectWorkerStatus(decodeLog(store.read()));
    assert.equal(before.pendingCommands.length, 1);
    assert.equal(before.episodes[0]?.phase, "interrupted");
    assert.ok(failed.workOrder);
    assert.ok(failed.decisions.at(-1)!.state.program);
    assert.ok(existsSync(join(root, "worktrees", before.pendingCommands[0]!)));
    await assert.rejects(
      runWorkerDemo({
        directory: root,
        fixture,
        transport: claude(),
        model: "required-model",
        effort: "high",
        now: () => now,
      }),
      /lease has not expired/u,
    );
    now += LEASE_MS + 1;
    const recovered = await runWorkerDemo({
      directory: root,
      fixture,
      transport: claude(),
      model: "required-model",
      effort: "high",
      now: () => now,
    });
    assert.equal(recovered.scenario.verified, true);
    assert.deepEqual(recovered.scenario.workOrder, failed.workOrder);
    const after = projectWorkerStatus(decodeLog(store.read()));
    assert.equal(after.episodes.length, 2);
    assert.notEqual(after.episodes[0]?.episodeId, after.episodes[1]?.episodeId);
    assert.equal(after.episodes[0]?.phase, "lease-expired");
    assert.equal(after.episodes[1]?.phase, "completed");
    assert.equal(after.pendingCommands.length, 0);
    assert.deepEqual(replayScenario(store.read()), recovered.scenario);
  } finally {
    rmSync(root, { recursive: true });
  }
});

test("WO-009 AC5 missing models fail closed in both directions and both transports; diagnostics stay private", async () => {
  for (const kind of ["claude-cli-print", "codex-cli-exec"] as const)
    for (const model of ["required-higher-model", "required-lower-model"]) {
      const root = temporary();
      const launches: WorkerLaunch[] = [];
      try {
        const transport =
          kind === "claude-cli-print"
            ? claude("unavailable", launches)
            : codex("unavailable", launches);
        await assert.rejects(
          runWorkerDemo({
            directory: root,
            fixture,
            transport,
            model,
            effort: kind === "claude-cli-print" ? "high" : "unknown",
          }),
          /model-unavailable/u,
        );
        assert.equal(launches.length, 1);
        const args = launches[0]!.args;
        assert.equal(args[args.indexOf("--model") + 1], model);
        assert.ok(!args.includes("--fallback-model"));
        const log = new WorkerStore(root).read();
        assert.ok(!log.includes("SYNTHETIC_PRIVATE"));
        assert.equal(pendingCommands(replayOutbox(decodeLog(log))).length, 1);
        assert.ok(
          !decodeLog(log).some((event) => event.type === "CommandResult"),
        );
      } finally {
        rmSync(root, { recursive: true });
      }
    }
});

test("WO-009 invalid correlation, malformed output and success-shaped nonzero exits never complete commands", async () => {
  for (const kind of ["claude-cli-print", "codex-cli-exec"] as const)
    for (const behavior of ["wrong-id", "malformed", "nonzero"]) {
      const root = temporary();
      try {
        await assert.rejects(
          runWorkerDemo({
            directory: root,
            fixture,
            transport:
              kind === "claude-cli-print" ? claude(behavior) : codex(behavior),
            model: "required-model",
            effort: kind === "claude-cli-print" ? "high" : "unknown",
          }),
          WorkerFailure,
        );
        const events = decodeLog(new WorkerStore(root).read());
        assert.equal(pendingCommands(replayOutbox(events)).length, 1);
        assert.ok(!events.some((event) => event.type === "CommandResult"));
      } finally {
        rmSync(root, { recursive: true });
      }
    }
});

test("WO-009 store rejects concurrent hosts and torn logs without truncation; status creates no missing store", () => {
  const root = temporary();
  const store = new WorkerStore(root);
  try {
    store.acquire();
    assert.throws(() => new WorkerStore(root).acquire(), /live host/u);
    writeFileSync(store.logPath, '{"eventId":"evt_1"}');
    assert.throws(() => store.read(), /missing final newline/u);
    assert.equal(readFileSync(store.logPath, "utf8"), '{"eventId":"evt_1"}');
    const missing = join(root, "absent");
    const status = spawnSync(
      process.execPath,
      [statusCli, "status", "--store", missing, "--json"],
      { encoding: "utf8" },
    );
    assert.equal(status.status, 0);
    assert.deepEqual(JSON.parse(status.stdout).episodes, []);
    assert.ok(!existsSync(missing));
    const gated = spawnSync(
      process.execPath,
      [
        statusCli,
        "demo",
        "--store",
        missing,
        "--transport",
        "claude-cli-print",
        "--model",
        "required-model",
        "--effort",
        "high",
      ],
      { encoding: "utf8", env: { ...process.env, DOTLN_LIVE_WORKERS: "0" } },
    );
    assert.equal(gated.status, 1);
    assert.match(gated.stderr, /live demo requires/u);
    assert.ok(!existsSync(missing));
  } finally {
    store.release();
    rmSync(root, { recursive: true });
  }
});

test("WO-009 incomplete envelopes retain partial evidence without applying candidates or forcing human input", async () => {
  const root = temporary();
  let now = 50_000_000;
  try {
    const result = await runWorkerDemo({
      directory: root,
      fixture,
      transport: claude("blocked"),
      model: "required-model",
      effort: "high",
      now: () => now,
    });
    assert.equal(result.envelope.status, "blocked");
    assert.equal(result.envelope.requiresHuman, false);
    assert.equal(result.scenario.candidates.length, 0);
    assert.equal(result.scenario.verified, false);
    const store = new WorkerStore(root);
    const events = decodeLog(store.read());
    assert.equal(pendingCommands(replayOutbox(events)).length, 1);
    assert.ok(!events.some((event) => event.type === "CommandResult"));
    assert.ok(
      events.some(
        (event) =>
          event.type === "WorkerInterrupted" &&
          (event.payload as { result?: { candidates?: unknown[] } }).result
            ?.candidates?.length === 1,
      ),
    );
    now += LEASE_MS + 1;
    const retry = await runWorkerDemo({
      directory: root,
      fixture,
      transport: claude(),
      model: "required-model",
      effort: "high",
      now: () => now,
    });
    assert.equal(
      retry.scenario.verified,
      true,
      "an incomplete result must not poison the idempotent success cache",
    );
  } finally {
    rmSync(root, { recursive: true });
  }
});

test("WO-009 stale episode observations cannot close pending commands; duplicate admitted results are inert", async () => {
  const root = temporary();
  const store = new WorkerStore(root);
  store.acquire();
  try {
    const driver = new LiveReactorDriver(undefined, store.append);
    startScenario(driver);
    const command = commandFromState(driver.state);
    const event = (type: string, payload: JsonValue) => ({
      schemaVersion: 1 as const,
      type,
      occurredAt: 20 * MINUTE + 1,
      actorId: "worker-host",
      workstreamId: command.workstreamId,
      episodeId: command.episodeId!,
      payload,
    });
    driver.feed(
      event("WorkerAttemptStarted", { workerEpisodeId: "new_episode" }),
    );
    const stale = driver.feed(
      event("WorkerResultObserved", {
        workerResultVersion: 1,
        workerEpisodeId: "old_episode",
        commandId: command.commandId,
        candidates: [],
      }),
    );
    assert.ok(stale.decision.trace.branchPath.includes("stale worker lease"));
    assert.equal(
      pendingCommands(replayOutbox(decodeLog(store.read()))).length,
      1,
    );
    const result = event("CommandResult", {
      workerResultVersion: 1,
      workerEpisodeId: "new_episode",
      commandId: command.commandId,
      result: "candidates",
      candidates: [],
    });
    const first = driver.feed(result);
    const duplicate = driver.feed(result);
    assert.deepEqual(duplicate.decision.state, first.decision.state);
    assert.ok(duplicate.decision.trace.branchPath.includes("dedup"));
  } finally {
    store.release();
    rmSync(root, { recursive: true });
  }
});

test("WO-009 a legacy or drifted equip cannot reach a real transport", async () => {
  for (const kind of ["legacy", "drift"]) {
    const root = temporary();
    const store = new WorkerStore(root);
    store.acquire();
    try {
      const source = new LiveReactorDriver();
      startScenario(source);
      let events = decodeLog(source.log).filter(
        (event) =>
          kind !== "legacy" ||
          event.type !== "ArtifactIdentityEnforcementStarted",
      );
      events = events.map((event) => {
        if (event.type !== "LoadoutEquipped") return event;
        const payload = event.payload as {
          graph: JsonValue;
          artifactIdentity: { semanticHash: string };
        };
        return {
          ...event,
          payload:
            kind === "legacy"
              ? payload.graph
              : {
                  ...payload,
                  artifactIdentity: {
                    ...payload.artifactIdentity,
                    semanticHash: "fnv1a64:0000000000000000",
                  },
                },
        } as typeof event;
      });
      // Restore the old observation first, then attempt a new external dispatch.
      writeFileSync(
        store.logPath,
        encodeLog(
          events.map((event, i) => ({ ...event, eventId: `evt_${i + 1}` })),
        ),
      );
      const driver = new LiveReactorDriver(undefined, store.append);
      driver.restore(store.read());
      let launches = 0;
      const transport = new ClaudeCliPrintWorkOrderTransport(() => {
        launches++;
        throw new Error("adapter must remain unreachable");
      }, "2.1.261");
      const host = new WorkerHost({
        store,
        driver,
        transport,
        now: () => 20 * MINUTE + 1,
      });
      await assert.rejects(host.run(root, fixture, "required-model", "high"));
      assert.equal(launches, 0);
      assert.equal(
        pendingCommands(replayOutbox(decodeLog(store.read()))).length,
        1,
      );
    } finally {
      store.release();
      rmSync(root, { recursive: true });
    }
  }
});

test("WO-009 missed leases fence delayed heartbeats and results while authority remains valid", async () => {
  for (const phase of ["heartbeat", "result"]) {
    const root = temporary();
    let now = 70_000_000;
    try {
      const runner: ProcessRunner = (launch) => {
        const child = cliRunner(
          "claude-cli-print",
          phase === "heartbeat" ? "wait" : "success",
        )(launch);
        return {
          ...child,
          completed: child.completed.then((output) => {
            now += LEASE_MS + 1;
            return output;
          }),
        };
      };
      await assert.rejects(
        runWorkerDemo({
          directory: root,
          fixture,
          transport: new ClaudeCliPrintWorkOrderTransport(runner, "2.1.261"),
          model: "required-model",
          effort: "high",
          now: () => now,
          onRunning: () => {
            if (phase === "heartbeat") now += LEASE_MS + 1;
          },
        }),
        WorkerFailure,
      );
      const log = new WorkerStore(root).read();
      const events = decodeLog(log);
      assert.equal(
        events.filter((event) => event.type === "WorkerLeaseExpired").length,
        1,
      );
      assert.equal(
        events.filter((event) => event.type === "WorkerHeartbeat").length,
        0,
      );
      assert.equal(pendingCommands(replayOutbox(events)).length, 1);
      assert.equal(replayScenario(log).candidates.length, 0);
      if (phase === "result")
        assert.ok(
          replayScenario(log).decisions.some((decision) =>
            decision.trace.branchPath.includes("stale worker lease"),
          ),
        );
      else
        assert.equal(
          projectWorkerStatus(events).episodes[0]?.phase,
          "lease-expired",
        );
    } finally {
      rmSync(root, { recursive: true });
    }
  }
});

test("WO-009 recovery from a durable result prefix closes the episode and runs the demo suffix once", async () => {
  const root = temporary();
  const options = {
    directory: root,
    fixture,
    model: "required-model",
    effort: "high" as const,
  };
  try {
    const first = await runWorkerDemo({ ...options, transport: claude() });
    const store = new WorkerStore(root);
    const events = decodeLog(store.read());
    const resultIndex = events.findIndex(
      (event) => event.type === "CommandResult",
    );
    // Restore exactly the durable prefix a crash at this boundary would leave.
    writeFileSync(store.logPath, encodeLog(events.slice(0, resultIndex + 1)));
    const recovery = new ClaudeCliPrintWorkOrderTransport(() => {
      throw new Error("unexpected redispatch");
    }, "2.1.261");
    const recovered = await runWorkerDemo({ ...options, transport: recovery });
    assert.deepEqual(recovered.envelope, first.envelope);
    assert.ok(recovered.scenario.verified);
    assert.deepEqual(replayScenario(store.read()), recovered.scenario);
    for (const type of [
      "CommandResult",
      "WorkerCompleted",
      "VerificationCompleted",
      "WorkerWorktreeRemoved",
    ])
      assert.equal(
        decodeLog(store.read()).filter((event) => event.type === type).length,
        1,
      );
    assert.equal(
      projectWorkerStatus(decodeLog(store.read())).runningEpisodes.length,
      0,
    );
    const stable = store.read();
    await runWorkerDemo({ ...options, transport: recovery });
    assert.equal(store.read(), stable);
  } finally {
    rmSync(root, { recursive: true });
  }
});

test("WO-009 concurrent dead-host reclaimers admit only one writer and abandoned guards refuse", async () => {
  const root = temporary();
  const children: ReturnType<typeof spawn>[] = [];
  try {
    const dead = spawnSync(process.execPath, ["-e", ""], { encoding: "utf8" });
    assert.equal(dead.status, 0);
    writeFileSync(join(root, "host.lock"), JSON.stringify({ pid: dead.pid }));
    const module = new URL("../src/worker-store.js", import.meta.url).href;
    const outcomes = await Promise.all(
      Array.from(
        { length: 4 },
        () =>
          new Promise<boolean>((resolve, reject) => {
            const script = `import { WorkerStore } from ${JSON.stringify(module)};
        const store = new WorkerStore(${JSON.stringify(root)});
        let acquired = false;
        try { store.acquire(); acquired = true; } catch {}
        process.send(acquired);
        process.on("message", () => { store.release(); process.exit(0); });`;
            const child = spawn(
              process.execPath,
              ["--input-type=module", "-e", script],
              { stdio: ["ignore", "ignore", "pipe", "ipc"] },
            );
            children.push(child);
            child.once("error", reject);
            child.once("message", (value) => resolve(value === true));
            child.once("exit", () =>
              reject(new Error("lock contender exited before reporting")),
            );
          }),
      ),
    );
    assert.equal(outcomes.filter(Boolean).length, 1);
    await Promise.all(
      children.map(
        (child) =>
          new Promise<void>((resolve) => {
            child.once("exit", () => resolve());
            child.send("release");
          }),
      ),
    );
    mkdirSync(join(root, "host-lock-recovery"));
    assert.throws(
      () => new WorkerStore(root).acquire(),
      /inspect before recovery/u,
    );
  } finally {
    for (const child of children)
      if (child.exitCode === null) child.kill("SIGKILL");
    rmSync(root, { recursive: true });
  }
});
