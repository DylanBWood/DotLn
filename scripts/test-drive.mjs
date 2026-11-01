import test from "node:test";
import assert from "node:assert/strict";
import {
  chmodSync,
  lstatSync,
  readdirSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
  realpathSync,
  existsSync,
} from "node:fs";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { pathToFileURL } from "node:url";
import {
  launchPhase,
  researchCommandKind,
  commandFailed,
} from "./lib/drive-transport.mjs";
import { tmpdir } from "node:os";
import { delimiter, dirname, join } from "node:path";
import {
  awaitingCloseStop,
  fetchMergedBases,
  lifecycleRoutes,
  readDriveRecord,
  releaseHoldsActivation,
  routeOrder,
  routeFacts,
} from "./lib/drive-route.mjs";
import {
  drivenCommandEffect,
  drivenHelperScripts,
} from "../packages/skeleton/dist/src/harness-command.js";
import { docPath } from "./lib/config.mjs";
import {
  commandShape,
  lifecycleRefusal,
  refusalFindings,
} from "./lib/drive-diagnostics.mjs";
import {
  nativeProfile,
  phaseWorkerNotes,
  targetLaneClause,
  targetLaneForms,
} from "./lib/drive-prompts.mjs";
import {
  printedRejection,
  redactReason,
  streamObservation,
} from "./lib/drive-stream.mjs";
import { beginGateRun } from "./lib/gate-evidence.mjs";
import {
  admittedHostChange,
  attemptTimeLimit,
  driveLoop,
  recordedDrive,
  runDrive,
  phaseDefinition,
  nativePhaseEntry,
  phaseTimeLimit,
  awaitingMergeStop,
  unenforceableLimit,
} from "./lib/drive-session.mjs";
import {
  drivenCompletions,
  drivenObservation,
  requireDrivenGates,
  requireDrivenResearch,
} from "./lib/drive-evidence.mjs";
import {
  actorArgs,
  closeOrder,
  fixture,
  git,
  restoreFixturePolicies,
} from "./lib/target-worktree-fixture.mjs";
import { forgetTargetWorktree } from "./lib/target-worktrees.mjs";
import { orderWorktreeGrants } from "./lib/order-worktree-grants.mjs";
import { remoteBranchCommit } from "./lib/github-repository.mjs";
import { originTags } from "./lib/release-tags.mjs";
import { write } from "./lib/helpers.mjs";
import {
  SANDBOX_FORMS,
  claudeLaunchArgs,
  codexObservedPolicy,
  driveHost,
  launchRole,
  nativeLaunchDirectories,
  retainCodexHome,
  sandboxLaunchForm,
} from "./lib/drive-worker.mjs";
import { runGit, shellQuote } from "./lib/git.mjs";
import { createFixtureRoot } from "./lib/temporary-roots.mjs";

test("fixture policy restoration preserves changed settings without disclosing their contents", () => {
  const base = realpathSync(
    createFixtureRoot(join(tmpdir(), "dotln-drive-policy-")),
  );
  try {
    const created = join(base, "created.json");
    const modified = join(base, "modified.json");
    const secret = "synthetic-private-setting";
    writeFileSync(created, "fixture-applied");
    writeFileSync(modified, secret);
    const policies = [
      { file: created, applied: "fixture-applied", previous: null },
      {
        file: modified,
        applied: "fixture-applied",
        previous: "prior-settings",
      },
    ];
    const refuses = () =>
      assert.throws(
        () => restoreFixturePolicies(policies),
        (error) => {
          assert.equal(error.code, "FIXTURE_POLICY_CHANGED");
          assert.doesNotMatch(
            error.message + JSON.stringify(error),
            new RegExp(secret),
          );
          return true;
        },
      );
    refuses();
    assert.equal(readFileSync(created, "utf8"), "fixture-applied");
    assert.equal(readFileSync(modified, "utf8"), secret);
    rmSync(modified);
    symlinkSync(created, modified);
    refuses();
    assert.equal(readFileSync(created, "utf8"), "fixture-applied");
    rmSync(modified);
    writeFileSync(modified, "fixture-applied");
    restoreFixturePolicies(policies);
    assert.equal(existsSync(created), false);
    assert.equal(readFileSync(modified, "utf8"), "prior-settings");
  } finally {
    rmSync(base, { recursive: true, force: true });
  }
});

test("phase clocks are explicit and cannot shorten an unset budget or loosen a declared one", () => {
  assert.equal(phaseTimeLimit(null, undefined, undefined, 1000), null);
  assert.equal(phaseTimeLimit(undefined, null, "", 1000), null);
  const completeGateAllowance = 45 * 60 * 1000;
  assert.equal(
    phaseTimeLimit(completeGateAllowance, undefined, undefined),
    completeGateAllowance,
  );
  assert.equal(
    phaseTimeLimit(null, completeGateAllowance, undefined),
    completeGateAllowance,
  );
  assert.equal(
    phaseTimeLimit(completeGateAllowance, 60 * 60 * 1000, undefined),
    completeGateAllowance,
  );
  assert.equal(
    phaseTimeLimit(completeGateAllowance, 20 * 60 * 1000, undefined),
    20 * 60 * 1000,
  );
  assert.equal(
    phaseTimeLimit(completeGateAllowance, undefined, "3000", 1000),
    2000,
  );
  assert.equal(phaseTimeLimit(null, null, "3000", 1000), 2000);
  assert.equal(phaseTimeLimit(null, null, "999", 1000), 0);
  for (const invalid of [0, -1, 1.5, NaN, Infinity, 2147483648])
    assert.throws(
      () => phaseTimeLimit(invalid, undefined, undefined),
      /positive timer-safe integer/,
    );
  for (const invalid of ["unknown", "0", "Infinity"])
    assert.throws(
      () => phaseTimeLimit(null, null, invalid),
      /Invalid drive deadline/,
    );
});

test("native phases have no implicit timer but retain explicit deadlines and owner cancellation", async () => {
  for (const timeoutMs of [undefined, null]) {
    const result = await launchPhase({
      command: process.execPath,
      args: ["-e", "setTimeout(() => {}, 100)"],
      cwd: process.cwd(),
      env: process.env,
      timeoutMs,
    });
    assert.equal(result.exitCode, 0);
    assert.equal(result.timedOut, false);
    assert.equal(result.workerEnded, true);
  }
  const limited = await launchPhase({
    command: process.execPath,
    args: ["-e", "setInterval(() => {}, 1000)"],
    cwd: process.cwd(),
    env: process.env,
    timeoutMs: phaseTimeLimit(120, 5000, undefined),
  });
  assert.equal(limited.timedOut, true);
  assert.equal(limited.workerEnded, true);
  const controller = new AbortController();
  const cancelled = await launchPhase({
    command: process.execPath,
    args: ["-e", "setInterval(() => {}, 1000)"],
    cwd: process.cwd(),
    env: process.env,
    timeoutMs: null,
    signal: controller.signal,
    onSpawn: () => setTimeout(() => controller.abort(), 25),
  });
  assert.equal(cancelled.cause, "owner-cancelled");
  assert.equal(cancelled.timedOut, false);
  assert.equal(cancelled.workerEnded, true);
});

test("an expired drive deadline stops before admitting a phase worker", async () => {
  const base = realpathSync(
    createFixtureRoot(join(tmpdir(), "dotln-drive-expired-")),
  );
  const previous = process.env.DOTLN_DRIVE_DEADLINE_AT;
  try {
    const f = fixture(base);
    f.mapClone();
    f.start();
    process.env.DOTLN_DRIVE_DEADLINE_AT = String(Date.now() - 1000);
    const result = await runDrive(f.main, "WO-999", { host: "codex" });
    assert.equal(result.stop.reason, "budget-exhausted");
    assert.equal(result.worker, null);
    assert.deepEqual(result.attempts, []);
    assert.equal(result.limits.drivenPhaseTimeoutMs, null);
    assert.equal(result.limits.subagentCap, 20);
    assert.equal(result.limits.drivenSessionCeiling, 80);
  } finally {
    if (previous === undefined) delete process.env.DOTLN_DRIVE_DEADLINE_AT;
    else process.env.DOTLN_DRIVE_DEADLINE_AT = previous;
    rmSync(base, { recursive: true, force: true });
  }
});

test("writer conflict stops before launch and retains only bounded ownership labels", async () => {
  const base = realpathSync(
    createFixtureRoot(join(tmpdir(), "dotln-drive-writer-")),
  );
  const previous = process.env.CLAUDE_CODE_SESSION_ID;
  try {
    const f = fixture(base);
    f.mapClone();
    f.start();
    const host = await import(
      pathToFileURL(
        join(f.orderRoot, "packages/skeleton/dist/src/harness-host.js"),
      )
    );
    const session = "private-fixture-router-identity";
    process.env.CLAUDE_CODE_SESSION_ID = session;
    host.seedHarnessWriter(f.orderRoot, {
      actorId: createHash("sha256").update(session).digest("hex"),
      worktree: f.orderRoot,
    });
    const before = host.harnessWriterView(f.orderRoot);
    const result = await runDrive(f.main, "WO-999", { host: "codex" });
    assert.equal(result.stop.reason, "dispatch-refused");
    assert.deepEqual(result.attempts, []);
    assert.deepEqual(result.writerConflict, {
      checkout: "order-launchpad",
      alive: "unknown",
      relation: "router",
    });
    assert.deepEqual(host.harnessWriterView(f.orderRoot), before);
    const observation = drivenObservation(result, () => false);
    assert.deepEqual(observation.writerConflict, result.writerConflict);
    assert.doesNotMatch(
      JSON.stringify(observation.writerConflict),
      /private|actorId|pid|[0-9a-f]{64}/u,
    );
  } finally {
    if (previous === undefined) delete process.env.CLAUDE_CODE_SESSION_ID;
    else process.env.CLAUDE_CODE_SESSION_ID = previous;
    rmSync(base, { recursive: true, force: true });
  }
});

test("a drive deadline crossed during host preparation admits no worker", async () => {
  const base = realpathSync(
    createFixtureRoot(join(tmpdir(), "dotln-drive-preparation-")),
  );
  const previous = process.env.DOTLN_DRIVE_DEADLINE_AT;
  const now = Date.now;
  const advance = Symbol.for("dotln.test.drive-preparation-clock");
  try {
    const f = fixture(base);
    f.mapClone();
    f.start();
    let clock = now();
    let prepared = false;
    Date.now = () => clock;
    process.env.DOTLN_DRIVE_DEADLINE_AT = String(clock + 1000);
    globalThis[advance] = () => {
      prepared = true;
      clock += 2000;
    };
    const hostFile = join(
      f.orderRoot,
      "packages/skeleton/dist/src/harness-host.js",
    );
    writeFileSync(
      hostFile,
      readFileSync(hostFile, "utf8") +
        `
      await new Promise(resolve => setTimeout(resolve, 5));
      globalThis[Symbol.for("dotln.test.drive-preparation-clock")]?.();
    `,
    );
    const result = await runDrive(f.main, "WO-999", { host: "codex" });
    assert.equal(
      prepared,
      true,
      "the deadline was valid until asynchronous preparation",
    );
    assert.equal(result.stop.reason, "budget-exhausted");
    assert.equal(result.worker, null);
    assert.deepEqual(result.attempts, []);
    const budget = await import(
      pathToFileURL(
        join(f.orderRoot, "packages/skeleton/dist/src/subagent-budget.js"),
      )
    );
    const usage = budget.subagentUsage(
      f.orderRoot,
      join(f.main, "records/state/local/drives/WO-999"),
      result.session,
    );
    assert.equal(usage.count, 0);
  } finally {
    Date.now = now;
    delete globalThis[advance];
    if (previous === undefined) delete process.env.DOTLN_DRIVE_DEADLINE_AT;
    else process.env.DOTLN_DRIVE_DEADLINE_AT = previous;
    rmSync(base, { recursive: true, force: true });
  }
});

for (const expired of [true, false])
  test(`native setup ${expired ? "refuses an elapsed deadline before admission" : "uses the current deadline remainder"}`, async () => {
    const root = createFixtureRoot(join(tmpdir(), "dotln-drive-clock-setup-"));
    try {
      write(root, "package.json", '{"type":"module"}');
      symlinkSync(process.execPath, join(root, "codex"));
      const marker = join(root, "finished");
      write(
        root,
        "packages/skeleton/dist/src/worker-transport.js",
        `
        import {writeFileSync} from "node:fs";
        await new Promise(resolve => setTimeout(resolve, 150));
        export const startCodexEpisode = env => ({env, finish() {writeFileSync(${JSON.stringify(marker)}, "finished");}});
        export const codexExecArgv = () => ["-e", "setTimeout(() => {}, 10)"];
      `,
      );
      const allowance = expired ? 75 : 5000;
      const deadlineAt = Date.now() + allowance;
      let admissions = 0;
      let spawned = 0;
      let applied;
      const result = await launchRole({
        host: "codex",
        launchpad: root,
        role: "executor",
        definition: { model: "test", effort: "max", prompt: "" },
        cwd: root,
        env: { ...process.env, PATH: root },
        timeoutMs: 10000,
        deadlineAt,
        sandbox: "host",
        beforeLaunch: () => {
          admissions++;
        },
        onSpawn: (_pid, clock) => {
          spawned++;
          applied = clock.timeoutMs;
        },
      });
      assert.equal(readFileSync(marker, "utf8"), "finished");
      if (expired) {
        assert.equal(result.cause, "drive-deadline-exhausted");
        assert.equal(admissions, 0);
        assert.equal(spawned, 0);
        assert.equal(result.startedAt, undefined);
      } else {
        assert.equal(admissions, 1);
        assert.equal(spawned, 1);
        assert.equal(result.exitCode, 0);
        assert.equal(result.timedOut, false);
        assert.ok(result.timeoutMs > 0 && result.timeoutMs <= allowance - 150);
        assert.equal(applied, result.timeoutMs);
        // Every launch records the election it ran under, what the host
        // itself reported, and the bytes the worker started with.
        assert.equal(result.selectedPolicy.sandboxElection, "host");
        assert.equal(result.selectedPolicy.sandbox, "workspace-write");
        assert.equal(result.selectedPolicy.reviewer, "auto-review");
        assert.deepEqual(result.observedPolicy, {
          sandbox: null,
          approval: null,
          reviewer: null,
          sandboxSource: "codex-session-rollout-absent",
          permissionMode: null,
          permissionModeSource: "not-exposed-by-native-json-stream",
        });
        assert.equal(
          result.selectedPolicy.gitMetadataWrites,
          "one-command-host-permission-request",
        );
        assert.equal(result.drivenStart.role, "executor");
        assert.equal(result.drivenStart.host, "codex");
        assert.equal(result.drivenStart.installedBytes, null);
        assert.equal(result.drivenStart.bytes, null);
        assert.ok(result.drivenStart.launchTextBytes > 0);
        assert.equal(result.retained, undefined);
      }
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

test("the native supervisor refuses a deadline crossed during startup", async () => {
  const root = createFixtureRoot(
    join(tmpdir(), "dotln-drive-supervisor-clock-"),
  );
  try {
    const delayed = join(root, "delay.mjs");
    const marker = join(root, "spawned");
    writeFileSync(
      delayed,
      "await new Promise(resolve => setTimeout(resolve, 150));\n",
    );
    let spawned = 0;
    const pending = launchPhase({
      command: "/bin/sh",
      args: ["-c", `printf spawned > ${shellQuote(marker)}`],
      cwd: root,
      env: {
        ...process.env,
        NODE_OPTIONS: `--import=${pathToFileURL(delayed)}`,
      },
      deadlineAt: Date.now() + 75,
      onSpawn: () => {
        spawned++;
      },
    });
    // Hold the driver's timer so only the supervisor's own check can prevent
    // the queued launch from creating a native process after the deadline.
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 500);
    const result = await pending;
    assert.equal(result.cause, "drive-deadline-exhausted");
    assert.equal(result.timedOut, true);
    assert.equal(result.workerStarted, false);
    assert.equal(result.workerEnded, true);
    assert.equal(spawned, 0);
    assert.equal(existsSync(marker), false);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("router chooses one action for every phase and requires both target and launchpad merges", () => {
  for (const [phase, action] of Object.entries({
    active: "next",
    "ready-to-verify": "verify",
    verifying: "verify",
    "needs-fix": "fix",
    repairing: "fix",
    verified: "final-review",
    "final-review": "final-review",
  })) {
    const route = routeOrder({ phase });
    assert.equal(route.action, action);
    assert.equal(route.stop, null);
    assert.match(route.phrase, /^resume: /);
  }
  assert.equal(routeOrder({ phase: "none" }).stop.reason, "dispatch-refused");
  assert.equal(routeOrder({ phase: "withdrawn" }).stop.reason, "off-ramp");
  assert.equal(routeOrder({ phase: "closed" }).stop.reason, "awaiting-merge");
  assert.equal(
    routeOrder({ phase: "closed" }, [], { merged: true }).action,
    "release-close",
  );
  assert.equal(
    routeOrder({ phase: "closed", repositoryId: "target" }, [], {
      merged: true,
      targetMerged: false,
    }).stop.reason,
    "awaiting-merge",
  );
  assert.equal(
    routeOrder({ phase: "closed", repositoryId: "target" }, [], {
      merged: true,
      targetMerged: true,
    }).action,
    "release-close",
  );
  assert.equal(
    routeOrder({ phase: "closed" }, [], { released: true }).stop.reason,
    "released",
  );
});

test("router stop table covers controls, operator disposition, refusals, repair bounds and exhausted budgets", () => {
  const cases = [
    [{ operatorMode: "analysis" }, [], "analysis"],
    [{ operatorMode: "override" }, [], "operator-override"],
    [{ operatorFinding: true }, [], "operator-finding"],
    [{ refused: "recorded refusal" }, [], "dispatch-refused"],
    [{ exhausted: true }, [], "budget-exhausted"],
    [{ incomplete: { next: 2 } }, [], "incomplete-bound"],
    [{}, [{ type: "RecordCorrected" }], "typed-correction"],
    [{}, [{ type: "CriterionWaived" }], "off-ramp"],
    [{}, [{ type: "OperatorOverrideRecorded" }], "off-ramp"],
    [
      {},
      Array.from({ length: 3 }, () => ({
        type: "VerificationCompleted",
        verdict: "fail",
      })),
      "verification-bound",
      "needs-fix",
    ],
    [
      {},
      Array.from({ length: 2 }, () => ({
        type: "FinalReviewCompleted",
        verdict: "fail",
      })),
      "final-review-bound",
      "needs-fix",
    ],
  ];
  for (const [facts, events, reason, phase = "active"] of cases) {
    const route = routeOrder({ phase }, events, facts);
    assert.equal(route.action, null, reason);
    assert.equal(route.stop.reason, reason);
    assert.ok(route.stop.next.length);
  }
  assert.equal(
    routeOrder({ phase: "active" }, [
      { type: "VerificationCompleted", verdict: "fail" },
      { type: "WorkOrderActivated" },
    ]).action,
    "next",
  );
});

test("the host's router phrases are exactly the route's lifecycle phrases", async () => {
  const { routerPhrases } =
    await import("../packages/skeleton/dist/src/harness-host.js");
  assert.deepEqual(
    routerPhrases,
    Object.fromEntries(
      Object.values(lifecycleRoutes).map(({ phrase, role }) => [
        phrase,
        `dotln-${role}`,
      ]),
    ),
  );
});

test("each stream protocol reduces to the same facts without a process", () => {
  const read = (protocol, rows) => {
    const observation = streamObservation({
      protocol,
      launchpad: "/launchpad",
    });
    for (const row of rows) observation.inspect(JSON.stringify(row));
    observation.inspect("not json");
    return { ...observation.facts, ...observation.observed() };
  };
  const claude = read("claude", [
    { type: "system", subtype: "init", model: "m", effort: "xhigh" },
    {
      type: "assistant",
      message: {
        content: [
          {
            type: "tool_use",
            id: "t1",
            name: "Bash",
            input: { command: "ls" },
          },
        ],
      },
    },
    {
      type: "user",
      message: {
        content: [{ type: "tool_result", tool_use_id: "t1", is_error: false }],
      },
    },
    { type: "result", total_cost_usd: 0.5, usage: { input_tokens: 1 } },
  ]);
  assert.equal(claude.model, "m");
  assert.equal(claude.effort, "xhigh");
  assert.equal(claude.costUsd, 0.5);
  assert.deepEqual(claude.toolCalls, ["Bash"]);
  assert.equal(claude.commandResults[0].status, "completed");
  assert.equal(claude.error, false);
  const codex = read("codex", [
    { type: "thread.started", thread_id: "thread" },
    { type: "turn.completed", usage: { input_tokens: 2 } },
  ]);
  assert.equal(codex.sessionId, "thread");
  assert.deepEqual(codex.usage, { input_tokens: 2 });
});

test("a lifecycle refusal names the dispatch bound and its way forward", () => {
  assert.match(
    lifecycleRefusal("DOTLN_DISPATCH_BOUND: wall clock=9 h 0 min"),
    /accept-overrun/,
  );
  assert.match(lifecycleRefusal("not a legal dispatch"), /was refused/);
  assert.equal(lifecycleRefusal("an ordinary failure"), null);
});

test("a router and a phase worker differ in one computed profile", () => {
  const definition = { model: "m", effort: "xhigh", prompt: "ROLE TEXT" };
  const profile = (role, cwd = "/launchpad") =>
    nativeProfile({
      launchpad: "/launchpad",
      role,
      phrase: role === "router" ? "drive: WO-999" : "resume: next",
      cwd,
      worker: "worker",
      definition,
    });
  const router = profile("router");
  assert.equal(router.routerCommand, "node scripts/drive.mjs WO-999");
  assert.match(
    router.codexInstructions,
    /begin "\$CODEX_THREAD_ID" router WO-999\./,
  );
  assert.equal(router.webSearch, "disabled");
  assert.doesNotMatch(router.tools, /WebSearch/);
  assert.deepEqual(router.env, {});
  const phase = profile("executor");
  assert.equal(phase.routerCommand, null);
  assert.match(phase.tools, /WebSearch,WebFetch$/);
  assert.match(phase.claudeAppendix, /For every lifecycle command/);
  assert.match(
    profile("executor", "/target").claudeAppendix,
    /registered target/,
  );
  for (const row of [router, phase])
    assert.ok(row.codexInstructions.endsWith("ROLE TEXT"));
  assert.match(phaseWorkerNotes("/launchpad"), /Public documentation research/);
  // The note names the forms the target lane admits, nothing broader: each
  // listed form is one drivenCommandEffect admits for the roles it names,
  // refuses for the others, and the note spells every one.
  const note = phaseWorkerNotes("/launchpad");
  assert.match(
    note,
    /the lane admits these forms: sync, work-orders, meta, check-publication, adjacent-work and reader with their ordinary arguments/,
  );
  assert.match(
    note,
    /worktree integrate WO-NNN, for the executor and the reviewer/,
  );
  assert.match(note, /Other forms are refused/);
  assert.doesNotMatch(note, /normal arguments|no others/);
  for (const { script, args, roles } of targetLaneForms) {
    const filled = args.map((arg) => (arg === "WO-NNN" ? "WO-999" : arg));
    for (const role of ["executor", "verifier", "reviewer"])
      assert.equal(
        drivenCommandEffect(script, filled, { role, workOrder: "WO-999" }) !==
          null,
        roles.includes(role),
        `${role}: ${script} ${args.join(" ")}`,
      );
    assert.ok(note.includes(`scripts/${script}.mjs`), script);
  }
  // The forms clause is rendered from the table, so a row cannot go missing.
  assert.ok(note.includes(targetLaneClause()));
  assert.match(
    targetLaneClause(),
    /^sync, work-orders, meta, check-publication, adjacent-work and reader with their ordinary arguments; resume status, briefing, times and usage beside this role's own lifecycle actions; release prepare --local; worktree integrate WO-NNN, for the executor and the reviewer; /,
  );
  for (const [script, args] of [
    ["release", ["close", "WO-999", "--publish"]],
    ["release", ["prepare"]],
    ["release", ["prepare", "--local", "--local"]],
    ["worktree", ["start", "WO-999"]],
    ["harness", ["evidence"]],
    ["target-gate", ["WO-998"]],
  ])
    assert.equal(
      drivenCommandEffect(script, args, {
        role: "executor",
        workOrder: "WO-999",
      }),
      null,
      `${script} ${args.join(" ")}`,
    );
  assert.deepEqual(Object.keys(phase.launchText), ["codex", "claude"]);
  assert.equal(phase.launchText.claude, phase.claudeAppendix);
  assert.ok(phase.codexInstructions.startsWith(phase.launchText.codex));
  assert.match(note, /\/launchpad\/scripts\/harness\.mjs/);
  // A Codex phase under the host's policy requests each Git-metadata write;
  // under full access there is no approval step to request.
  assert.match(
    phase.launchText.codex,
    /request the host's normal one-invocation outside-sandbox approval/,
  );
  const unsandboxed = nativeProfile({
    launchpad: "/launchpad",
    role: "executor",
    phrase: "resume: next",
    cwd: "/launchpad",
    worker: "worker",
    definition,
    sandbox: "off",
  });
  assert.match(
    unsandboxed.launchText.codex,
    /full access and no approval step: after the role's required command and source inspection, run each exact authorized lifecycle command or other Git-metadata write directly, once/,
  );
  assert.doesNotMatch(
    unsandboxed.launchText.codex,
    /approval for each|retain the native sandbox/,
  );
  assert.match(
    unsandboxed.launchText.codex,
    /stop without retrying or using an alternative command/,
  );
});

test("a role's dispatch wall clock bounds each driven attempt, and an operator's acceptance moves it", () => {
  const hour = 3600000;
  const budgets = {
    dispatches: {
      executor: { wallClockMs: 8 * hour, repair: { wallClockMs: 2 * hour } },
      verifier: { wallClockMs: 3 * hour },
      "release-close": { wallClockMs: null },
    },
  };
  const record = (drivenPhaseTimeoutMs = null) => ({
    limits: { drivenPhaseTimeoutMs },
  });
  const route = (role, phrase) => ({ role, phrase });
  const next = route("executor", "resume: next");
  assert.equal(attemptTimeLimit(record(), budgets, next, []), 8 * hour);
  assert.equal(
    attemptTimeLimit(record(), budgets, route("executor", "resume: fix"), []),
    2 * hour,
  );
  assert.equal(
    attemptTimeLimit(
      record(),
      budgets,
      route("verifier", "resume: verify"),
      [],
    ),
    3 * hour,
  );
  assert.equal(
    attemptTimeLimit(
      record(),
      budgets,
      route("release-close", "resume: release close"),
      [],
    ),
    null,
  );
  assert.equal(attemptTimeLimit(record(hour), budgets, next, []), hour);
  assert.equal(attemptTimeLimit(record(), budgets, next, [], hour), hour);
  // An accepted ceiling longer than a timer can hold is not a launch failure.
  assert.equal(
    attemptTimeLimit(record(), budgets, next, [
      {
        type: "DispatchBoundAccepted",
        phase: "active",
        metric: "wallClockMs",
        ceiling: 2_592_000_000,
      },
    ]),
    2147483647,
  );
  assert.equal(
    attemptTimeLimit(record(), budgets, next, [
      {
        type: "DispatchBoundAccepted",
        phase: "active",
        metric: "wallClockMs",
        ceiling: null,
      },
    ]),
    null,
  );
});

test("a repair bound limits repairs still to come, and a release outranks every bound", () => {
  const fails = (type, count) =>
    Array.from({ length: count }, () => ({ type, verdict: "fail" }));
  const verification = fails("VerificationCompleted", 3);
  const review = fails("FinalReviewCompleted", 2);
  assert.equal(
    routeOrder({ phase: "verified" }, verification).action,
    "final-review",
  );
  for (const events of [verification, review]) {
    assert.equal(
      routeOrder({ phase: "closed" }, events, { merged: true }).action,
      "release-close",
    );
    assert.equal(
      routeOrder({ phase: "closed" }, events, { released: true }).stop.reason,
      "released",
    );
  }
  assert.equal(
    routeOrder({ phase: "needs-fix" }, verification).stop.reason,
    "verification-bound",
  );
  assert.equal(
    routeOrder({ phase: "needs-fix" }, review).stop.reason,
    "final-review-bound",
  );
  // A repair already underway is still one to come; every other phase has
  // none pending, so it runs on.
  assert.equal(
    routeOrder({ phase: "repairing" }, verification).stop.reason,
    "verification-bound",
  );
  for (const events of [verification, review])
    for (const [phase, action] of [
      ["ready-to-verify", "verify"],
      ["verifying", "verify"],
      ["verified", "final-review"],
      ["final-review", "final-review"],
    ])
      assert.equal(routeOrder({ phase }, events).action, action, phase);
});

test("a reader's own failure stops the phase instead of reading as a malformed line", () => {
  let stopped = 0;
  const observation = streamObservation({
    protocol: "claude",
    launchpad: "/fixture",
    stop: () => stopped++,
  });
  for (const line of ["not json", "7", "null"]) observation.inspect(line);
  assert.equal(stopped, 0);
  observation.inspect(JSON.stringify({ message: { content: 1 } }));
  assert.equal(stopped, 1);
  assert.equal(observation.facts.cause, "stream-observation-failed");
});

test("a helper's refusal in the target lane reads as that, not as unclassified", () => {
  const { boundaries } = refusalFindings(
    "DOTLN_TARGET_REFUSED: a driven worker's helper agent writes nothing but its session scratch",
  );
  assert.deepEqual(boundaries, [
    { kind: "target-permission", category: "helper-write" },
  ]);
});

test("a command's shape names its program and masks what it was given", () => {
  assert.deepEqual(commandShape("rm -rf /private/detail"), [
    ["rm", "<operand>", "<operand>"],
  ]);
});

test("refusal readback keeps the bound and router codes and drops unknown ones", () => {
  const { codes } = refusalFindings(
    "DOTLN_DISPATCH_BOUND: x DOTLN_ROUTER_WRITE_REFUSED: y DOTLN_INVENTED: z",
  );
  assert.deepEqual([...codes].sort(), [
    "DOTLN_DISPATCH_BOUND",
    "DOTLN_ROUTER_WRITE_REFUSED",
  ]);
});

test("a refused attempt stamps the log its worker left, so the refusal is not read as stale", async () => {
  const route = (eventCount) => ({
    action: "next",
    role: "executor",
    phrase: "resume: next",
    eventCount,
  });
  const run = async (second) => {
    const states = [{ phase: "active", route: route(2) }, second];
    const record = { attempts: [], incomplete: {} };
    const result = await driveLoop({
      status: async () => {
        const next = states.shift();
        if (next instanceof Error) throw next;
        return next;
      },
      launch: async () => ({ refused: "refused after its dispatch" }),
      record,
    });
    assert.equal(result.stop.next, "refused after its dispatch");
    return record;
  };
  assert.equal((await run({ phase: "active", route: route(3) })).factsAt, 3);
  // A status that cannot be read must not cost the refusal its report.
  assert.equal((await run(new Error("status unavailable"))).factsAt, 2);
});

test("a limit the host cannot meter refuses with the step that clears it", () => {
  const limits = { tokens: null, costUsd: null };
  const record = (host, overrides = {}) => ({
    host,
    limits: { ...limits, ...overrides },
    routerUsage: { totalTokens: null },
    attempts: [],
  });
  assert.equal(unenforceableLimit(record("codex")), null);
  assert.match(
    unenforceableLimit(record("codex", { costUsd: 5 })),
    /no dollar counter.*Clear dispatches\.router\.costUsd/,
  );
  assert.match(unenforceableLimit(record("codex"), 5), /no dollar counter/);
  assert.match(
    unenforceableLimit(record("claude", { tokens: 5 })),
    /Clear dispatches\.router\.tokens/,
  );
});

test("the incomplete bound keys on the routed action, so release close is bounded too", () => {
  const incomplete = { "release-close": 2 };
  const bound = routeOrder({ phase: "closed" }, [], {
    merged: true,
    incomplete,
  });
  assert.equal(bound.stop.reason, "incomplete-bound");
  assert.match(bound.stop.next, /recorded transition clears this stop/);
  assert.equal(
    routeOrder({ phase: "closed" }, [], { released: true, incomplete }).stop
      .reason,
    "released",
  );
});

test("an unreadable observation names itself before recorded history can replace it", () => {
  const route = routeOrder({ phase: "active" }, [{ type: "RecordCorrected" }], {
    unavailable: "Route observation unavailable: the named cause",
  });
  assert.equal(route.stop.reason, "dispatch-refused");
  assert.match(route.stop.next, /the named cause/);
});

test("re-entry resumes an addressable worker and otherwise delivers the recorded phase's same phrase", () => {
  for (const phase of ["verifying", "repairing", "final-review"]) {
    const fresh = routeOrder({ phase });
    const resumed = routeOrder({ phase }, [], {
      worker: {
        id: "fixture-worker",
        role: fresh.role,
        action: fresh.action,
        addressable: true,
      },
    });
    assert.equal(fresh.mode, "briefing");
    assert.equal(resumed.mode, "resume");
    assert.equal(resumed.worker, "fixture-worker");
    assert.equal(resumed.phrase, fresh.phrase);
    assert.equal(
      routeOrder({ phase: "ready-to-verify" }, [], {
        worker: {
          id: "prior-executor",
          role: "executor",
          action: "next",
          addressable: true,
        },
      }).mode,
      "dispatch",
    );
  }
});

test("driver repeats only from canonical status, carries no narrative, and stops after two incomplete workers", async () => {
  const record = { attempts: [], incomplete: {} };
  let phase = "ready-to-verify";
  const prompts = [];
  const result = await driveLoop({
    record,
    status: () => ({
      phase,
      route: routeOrder({ phase }, [], { incomplete: record.incomplete }),
    }),
    launch: (route) => {
      prompts.push(route.phrase);
      phase = "verifying";
      return { exitCode: 0 };
    },
  });
  assert.deepEqual(prompts, ["resume: verify", "resume: verify"]);
  assert.equal(result.stop.reason, "incomplete-bound");
  assert.equal(record.incomplete.verify, 2);
});

test("driver follows the verification repair loop to its declared bound and release close after a merge", async () => {
  let phase = "ready-to-verify";
  const events = [];
  const record = { attempts: [], incomplete: {} };
  const result = await driveLoop({
    record,
    status: () => ({ phase, route: routeOrder({ phase }, events) }),
    launch: (route) => {
      if (route.action === "verify") {
        events.push({ type: "VerificationCompleted", verdict: "fail" });
        phase = "needs-fix";
      } else {
        assert.equal(route.action, "fix");
        phase = "ready-to-verify";
      }
      return { exitCode: 0 };
    },
  });
  assert.equal(result.stop.reason, "verification-bound");
  assert.deepEqual(
    record.attempts.map((row) => row.action),
    ["verify", "fix", "verify", "fix", "verify"],
  );
  let released = false;
  const close = await driveLoop({
    record: { attempts: [], incomplete: {} },
    status: () => ({
      phase: "closed",
      route: routeOrder({ phase: "closed" }, [], { merged: true, released }),
    }),
    launch: (route) => {
      assert.equal(route.action, "release-close");
      released = true;
      return { exitCode: 0 };
    },
  });
  assert.equal(close.stop.reason, "released");
});

test("harness evidence refuses a target worktree before it writes anything there", () => {
  const base = realpathSync(
    createFixtureRoot(join(tmpdir(), "dotln-drive-evidence-")),
  );
  try {
    const f = fixture(base);
    f.mapClone();
    f.start();
    const result = spawnSync(
      process.execPath,
      [new URL("./harness.mjs", import.meta.url).pathname, "evidence"],
      {
        cwd: f.target,
        env: { ...f.env, DOTLN_LAUNCHPAD: f.orderRoot },
        encoding: "utf8",
      },
    );
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /judges the launchpad/);
    assert.equal(existsSync(join(f.target, "docs/control")), false);
    assert.equal(git(f.target, "status", "--porcelain"), "");
  } finally {
    rmSync(base, { recursive: true, force: true });
  }
});

test("drive facts describe the log they saw, and a never-driven order's history stops nothing", () => {
  const base = realpathSync(
    createFixtureRoot(join(tmpdir(), "dotln-drive-facts-")),
  );
  try {
    const f = fixture(base);
    f.mapClone();
    f.start();
    const state = { phase: "active", workOrderId: "WO-999" };
    const corrected = [{ type: "RecordCorrected" }];
    assert.equal(
      routeOrder(state, corrected, routeFacts(f.orderRoot, state, corrected))
        .action,
      "next",
    );
    write(
      f.main,
      "records/state/local/drives/WO-999.json",
      JSON.stringify({
        factsAt: 1,
        attentionSince: 1,
        incomplete: { next: 2 },
        refused: "A refusal of the earlier log",
        exhausted: true,
      }),
    );
    const seen = routeFacts(f.orderRoot, state, corrected);
    assert.equal(seen.refused, "A refusal of the earlier log");
    assert.deepEqual(seen.incomplete, { next: 2 });
    const moved = routeFacts(f.orderRoot, state, [...corrected, {}]);
    for (const fact of ["refused", "incomplete", "exhausted"])
      assert.equal(moved[fact], undefined, fact);
  } finally {
    rmSync(base, { recursive: true, force: true });
  }
});

test("an order reads as merged once its pass reaches the base, however its records moved", () => {
  const base = realpathSync(
    createFixtureRoot(join(tmpdir(), "dotln-drive-merge-reading-")),
  );
  try {
    const f = fixture(base);
    f.mapClone();
    f.start();
    write(f.target, "reviewed.txt", "Reviewed change.\n");
    git(f.target, "add", "reviewed.txt");
    git(f.target, "commit", "-qm", "fix: reviewed change");
    closeOrder(f);
    const state = {
      phase: "closed",
      workOrderId: "WO-999",
      repositoryId: "target",
    };
    const facts = () => {
      const events = readFileSync(
        docPath(f.orderRoot, "orders", "WO-999.jsonl"),
        "utf8",
      )
        .trim()
        .split("\n")
        .map((line) => JSON.parse(line));
      return { events, facts: routeFacts(f.orderRoot, state, events) };
    };
    // A worker can die here, its pass recorded and nothing committed, with the
    // launchpad branch still at its base and so an ancestor of it.
    assert.equal(facts().facts.merged, false);
    // The real step that moves the reports out of the launchpad. This fixture
    // keeps its local origin, so no command here can reach a real host.
    write(
      f.main,
      `${f.config.roots.control}/local/terms.txt`,
      "Private Fixture Term\n",
    );
    write(f.orderRoot, "records/evidence/WO-999/decisions.md", "# Decisions\n");
    f.ok(f.resume(["target-records", ...actorArgs]));
    git(f.orderRoot, "add", "-A");
    git(f.orderRoot, "commit", "-qm", "Synthetic records");
    assert.equal(facts().facts.merged, false);
    // Tracking refs stand in for the hosted merge, so nothing leaves this machine.
    for (const checkout of [f.main, f.clone]) {
      git(checkout, "merge", "-q", "--no-ff", "-m", "Merge", "wo-999");
      git(checkout, "update-ref", "refs/remotes/origin/main", "HEAD");
    }
    // A later order's newer event type is no reason to doubt this one.
    writeFileSync(
      docPath(f.main, "orders", "WO-998.jsonl"),
      `${JSON.stringify({ type: "EventFromANewerOrder" })}\n`,
    );
    git(f.main, "add", "-A");
    git(f.main, "commit", "-qm", "A later order");
    git(f.main, "update-ref", "refs/remotes/origin/main", "HEAD");
    const merged = facts();
    assert.equal(merged.facts.merged, true);
    assert.equal(merged.facts.targetMerged, true);
    assert.equal(
      routeOrder(state, merged.events, merged.facts).action,
      "release-close",
    );
    // Without the order's events there is no pass to find at the base, so the
    // same bases read as not merged rather than merged by ancestry alone.
    assert.equal(routeFacts(f.orderRoot, state, []).merged, false);
    assert.equal(
      routeOrder(state, [], routeFacts(f.orderRoot, state, [])).stop.reason,
      "awaiting-merge",
    );
  } finally {
    rmSync(base, { recursive: true, force: true });
  }
});

test("a target order whose branch never left its base has nothing to merge", () => {
  const base = realpathSync(
    createFixtureRoot(join(tmpdir(), "dotln-drive-empty-merge-")),
  );
  try {
    const f = fixture(base);
    f.mapClone();
    f.start();
    assert.equal(
      routeFacts(f.orderRoot, {
        phase: "closed",
        workOrderId: "WO-999",
        repositoryId: "target",
      }).targetMerged,
      false,
    );
  } finally {
    rmSync(base, { recursive: true, force: true });
  }
});

test("a lane failure says why, including a remote that never answered, and the limit ends the transport child too", async () => {
  const prior = process.env.GIT_ALLOW_PROTOCOL;
  process.env.GIT_ALLOW_PROTOCOL = "ext";
  const base = realpathSync(
    createFixtureRoot(join(tmpdir(), "dotln-drive-lane-child-")),
  );
  try {
    assert.throws(
      () => remoteBranchCommit("ext::sleep 1", "main", { timeoutMs: 200 }),
      /remote read refused: git ls-remote failed in the host read lane: \S/,
    );
    // The remote helper git starts is its transport child. spawnSync's limit
    // ends git alone; the lane ends the group git led (WO-192-D098).
    const pidFile = join(base, "helper.pid");
    const helper = join(base, "helper.sh");
    writeFileSync(
      helper,
      `#!/bin/sh\necho $$ > ${shellQuote(pidFile)}\nexec sleep 30\n`,
    );
    chmodSync(helper, 0o755);
    assert.throws(
      () => remoteBranchCommit(`ext::${helper}`, "main", { timeoutMs: 1500 }),
      /host read lane/,
    );
    assert.ok(existsSync(pidFile), "the transport child started");
    const child = Number(readFileSync(pidFile, "utf8").trim());
    // A child that outlives the limit is recorded as alive, then killed so
    // the fixture can end. The pid is checked before any signal: 0 would name
    // this process's own group.
    const awaitEnded = async (pid, message) => {
      assert.ok(
        Number.isSafeInteger(pid) && pid > 1,
        `${message}: the child wrote its pid`,
      );
      const alive = () => {
        try {
          process.kill(pid, 0);
          return true;
        } catch (error) {
          return error.code !== "ESRCH";
        }
      };
      const until = Date.now() + 2000;
      while (alive() && Date.now() < until)
        await new Promise((done) => setTimeout(done, 25));
      const ended = !alive();
      if (!ended) process.kill(pid, "SIGKILL");
      assert.equal(ended, true, message);
    };
    await awaitEnded(child, "the transport child ended with the limit");
    // The handoff's origin tag read is a time-limited Git call too: its limit
    // ends the helper the same way (WO-247-D012).
    const repo = join(base, "repo");
    runGit(base, ["init", "--quiet", "--initial-branch=main", repo]);
    runGit(repo, ["remote", "add", "origin", `ext::${helper}`]);
    rmSync(pidFile, { force: true });
    assert.throws(
      () => originTags(repo, { timeoutMs: 1500 }),
      /git ls-remote --tags origin failed/,
    );
    assert.ok(existsSync(pidFile), "the second transport child started");
    const second = Number(readFileSync(pidFile, "utf8").trim());
    await awaitEnded(second, "the handoff read's child ended too");
  } finally {
    if (prior === undefined) delete process.env.GIT_ALLOW_PROTOCOL;
    else process.env.GIT_ALLOW_PROTOCOL = prior;
    rmSync(base, { recursive: true, force: true });
  }
});

test("a hosted merge reaches release close through the remote base a drive fetches", () => {
  const base = realpathSync(
    createFixtureRoot(join(tmpdir(), "dotln-drive-hosted-")),
  );
  try {
    const f = fixture(base);
    f.mapClone();
    f.start();
    write(f.target, "source.txt", "target change\n");
    git(f.target, "add", "source.txt");
    git(f.target, "commit", "-qm", "Synthetic target change");
    git(f.target, "push", "-q", "origin", "wo-999");
    // Merge where a host would: beside the clone, whose refs stay stale.
    const hosted = join(base, "hosted-merge");
    git(base, "clone", "-q", join(base, "target.git"), hosted);
    git(hosted, "config", "user.name", "Fixture");
    git(hosted, "config", "user.email", "fixture@example.invalid");
    git(hosted, "merge", "--no-ff", "-m", "Hosted merge", "origin/wo-999");
    git(hosted, "push", "-q", "origin", "main");
    const state = {
      phase: "closed",
      workOrderId: "WO-999",
      repositoryId: "target",
    };
    assert.equal(routeFacts(f.orderRoot, state).targetMerged, false);
    const localBase = git(f.clone, "rev-parse", "main");
    // The clone's own transport configuration runs nothing during this fetch.
    const ran = join(base, "clone-program-ran");
    const hook = join(base, "clone-hooks/reference-transaction");
    write(
      base,
      "clone-hooks/reference-transaction",
      `#!/bin/sh\ntouch ${shellQuote(ran)}\n`,
    );
    chmodSync(hook, 0o755);
    git(f.clone, "config", "core.hooksPath", dirname(hook));
    git(
      f.clone,
      "config",
      "remote.origin.uploadpack",
      `touch ${shellQuote(ran)}; git-upload-pack`,
    );
    const failedTarget = () =>
      fetchMergedBases(f.orderRoot, "WO-999").find(
        (row) => row.label === "target",
      );
    assert.equal(failedTarget(), undefined);
    assert.equal(existsSync(ran), false);
    assert.equal(routeFacts(f.orderRoot, state).targetMerged, true);
    assert.equal(git(f.clone, "rev-parse", "main"), localBase);
    // The commit is already here, so another drive adds no pack to the clone.
    const packs = () =>
      readdirSync(
        join(git(f.clone, "rev-parse", "--absolute-git-dir"), "objects/pack"),
      ).length;
    const heldPacks = packs();
    assert.equal(failedTarget(), undefined);
    assert.equal(packs(), heldPacks);
    // A remote that cannot be reached is named rather than read as unmerged.
    git(f.clone, "remote", "set-url", "origin", join(base, "missing.git"));
    assert.ok(failedTarget().cause);
    assert.match(
      awaitingMergeStop(
        { reason: "awaiting-merge", next: "The operator merges." },
        [{ label: "target", cause: "remote detail" }],
      ).next,
      /^The target remote could not be fetched/,
    );
  } finally {
    rmSync(base, { recursive: true, force: true });
  }
});

test("target roots derive from the registered order and survive an alias spelling; other orders get no grant", () => {
  const base = realpathSync(
    createFixtureRoot(join(tmpdir(), "dotln-drive-grants-")),
  );
  try {
    const f = fixture(base);
    f.mapClone();
    f.start();
    assert.deepEqual(orderWorktreeGrants(f.main, "WO-999"), [
      f.orderRoot,
      f.target,
    ]);
    assert.deepEqual(orderWorktreeGrants(f.main, "WO-998"), []);
    const outerDirectories = nativeLaunchDirectories(
      f.main,
      "router",
      "drive: WO-999",
    );
    assert.ok(outerDirectories.includes(f.target));
    assert.ok(outerDirectories.includes(f.orderRoot));
    assert.equal(outerDirectories.length, new Set(outerDirectories).size);
    assert.throws(
      () =>
        nativeLaunchDirectories(
          f.main,
          "router",
          "drive: WO-999 and another order",
        ),
      /requires exactly/,
    );
    const alias = join(base, "launchpad-alias");
    symlinkSync(f.orderRoot, alias);
    assert.deepEqual(orderWorktreeGrants(alias, "WO-999"), [
      f.orderRoot,
      f.target,
    ]);
    write(f.target, "source.txt", "target change\n");
    git(f.target, "add", "source.txt");
    git(f.target, "commit", "-qm", "Synthetic target change");
    const state = {
      phase: "closed",
      workOrderId: "WO-999",
      repositoryId: "target",
    };
    // The launchpad merge: the order's pass in its control record at the
    // base, which a read with no events can no longer stand in for.
    const pass = {
      type: "FinalReviewCompleted",
      workOrderId: "WO-999",
      verdict: "pass",
      recordedAt: "2026-10-31T00:00:00.000Z",
    };
    const log = join(f.main, "records/state/orders/WO-999.jsonl");
    write(
      f.main,
      "records/state/orders/WO-999.jsonl",
      (existsSync(log) ? readFileSync(log, "utf8") : "") +
        `${JSON.stringify(pass)}\n`,
    );
    git(f.main, "add", "-A");
    git(f.main, "commit", "-qm", "Record the pass at the base");
    git(f.main, "update-ref", "refs/remotes/origin/main", "HEAD");
    const events = [pass];
    const before = routeFacts(f.orderRoot, state, events);
    assert.equal(before.targetMerged, false);
    const closeReceipt = (extra = {}) =>
      write(
        f.main,
        "records/state/local/retained/WO-999/release-close.json",
        JSON.stringify({
          workOrderId: "WO-999",
          publication: { outcome: "no-release" },
          dryRun: false,
          ...extra,
        }),
      );
    closeReceipt({
      cleanup: { outcome: "not-attempted" },
      targetCleanup: { outcome: "retained" },
    });
    assert.equal(routeFacts(f.orderRoot, state, events).released, false);
    git(f.clone, "merge", "--no-ff", "-m", "Merge synthetic target", "wo-999");
    // A merge left in the clone is not one close can act on.
    assert.equal(routeFacts(f.orderRoot, state, events).targetMerged, false);
    git(f.clone, "push", "-q", "origin", "main");
    assert.equal(
      routeOrder(state, events, routeFacts(f.orderRoot, state, events)).action,
      "release-close",
    );
    // The same bases read with no events have no pass to find there.
    assert.equal(
      routeOrder(state, [], routeFacts(f.orderRoot, state, [])).stop.reason,
      "awaiting-merge",
    );
    closeReceipt({
      cleanup: { outcome: "blocked" },
      targetCleanup: { outcome: "removed" },
    });
    forgetTargetWorktree(f.main, f.target);
    forgetTargetWorktree(f.orderRoot, f.target);
    assert.equal(
      routeOrder(state, events, routeFacts(f.orderRoot, state, events)).action,
      "release-close",
    );
    closeReceipt({
      cleanup: { outcome: "clean" },
      targetCleanup: { outcome: "removed" },
      dryRun: true,
    });
    assert.equal(routeFacts(f.orderRoot, state, events).released, false);
    closeReceipt({
      cleanup: { outcome: "clean" },
      targetCleanup: { outcome: "removed" },
    });
    assert.equal(routeFacts(f.orderRoot, state, events).released, true);
    // A reactivated order inherits the receipt of an earlier activation's
    // close; only a receipt stamped with the current activation reads as
    // released (WO-192-D099).
    const activated = (recordedAt) => ({
      type: "WorkOrderActivated",
      workOrderId: "WO-999",
      recordedAt,
    });
    const reactivated = [
      activated("2026-10-01T00:00:00.000Z"),
      { type: "FinalReviewCompleted", verdict: "pass" },
      activated("2026-10-30T00:00:00.000Z"),
    ];
    assert.equal(routeFacts(f.orderRoot, state, reactivated).released, false);
    closeReceipt({
      cleanup: { outcome: "clean" },
      targetCleanup: { outcome: "removed" },
      activation: { recordedAt: "2026-10-01T00:00:00.000Z" },
    });
    assert.equal(routeFacts(f.orderRoot, state, reactivated).released, false);
    closeReceipt({
      cleanup: { outcome: "clean" },
      targetCleanup: { outcome: "removed" },
      activation: { recordedAt: "2026-10-30T00:00:00.000Z" },
    });
    assert.equal(routeFacts(f.orderRoot, state, reactivated).released, true);
    closeReceipt({
      cleanup: { outcome: "clean" },
      targetCleanup: { outcome: "removed" },
    });
    const removedState = { ...state, workOrderId: "WO-998" };
    const removedReceipt = (workOrderId, dryRun = false) =>
      write(
        f.main,
        "records/state/local/retained/WO-998/release-close.json",
        JSON.stringify({
          workOrderId,
          dryRun,
          publication: { outcome: "no-release" },
          cleanup: { outcome: "blocked", branch: { outcome: "deleted" } },
          targetCleanup: { outcome: "removed" },
        }),
      );
    removedReceipt("WO-998");
    assert.equal(
      routeOrder(removedState, [], routeFacts(f.main, removedState)).action,
      "release-close",
    );
    removedReceipt("WO-997");
    assert.equal(
      routeOrder(removedState, [], routeFacts(f.main, removedState)).stop
        .reason,
      "awaiting-merge",
    );
    removedReceipt("WO-998", true);
    assert.equal(
      routeOrder(removedState, [], routeFacts(f.main, removedState)).stop
        .reason,
      "awaiting-merge",
    );
  } finally {
    rmSync(base, { recursive: true, force: true });
  }
});

test("driven target permissions admit the recorded pair and aliases, refuse another order, and record grant provenance", async () => {
  const base = realpathSync(
    createFixtureRoot(join(tmpdir(), "dotln-drive-permission-")),
  );
  try {
    const f = fixture(base);
    f.mapClone();
    f.start();
    const budget = await import(
      pathToFileURL(
        join(f.orderRoot, "packages/skeleton/dist/src/subagent-budget.js"),
      )
    );
    const directory = join(f.main, "records/state/local/drive-counter");
    budget.initializeSubagentCounter(directory, "drive-test");
    const context = join(directory, "context.json");
    writeFileSync(
      context,
      JSON.stringify({
        schemaVersion: 1,
        root: f.orderRoot,
        directory,
        session: "drive-test",
        worker: "phase-test",
        role: "executor",
        workOrder: "WO-999",
        cap: 20,
        ceiling: 80,
      }),
    );
    const hostModule = await import(
      pathToFileURL(
        join(f.orderRoot, "packages/skeleton/dist/src/harness-host.js"),
      )
    );
    const nativeThread = "synthetic-native-phase";
    hostModule.beginCodexPhase(
      f.orderRoot,
      f.orderRoot,
      nativeThread,
      "executor",
    );
    assert.equal(
      existsSync(join(f.target, "scripts/resume.mjs")),
      false,
      "a target has no launchpad lifecycle command",
    );
    hostModule.beginCodexPhase(
      f.target,
      f.main,
      nativeThread,
      "executor",
      f.orderRoot,
    );
    for (const [checkout, runtime] of [
      [f.orderRoot, f.orderRoot],
      [f.target, f.main],
    ]) {
      assert.equal(
        hostModule.phaseWriterView(checkout, runtime).actorId,
        createHash("sha256").update(nativeThread).digest("hex"),
      );
      assert.deepEqual(
        hostModule.phaseEntryReadback(checkout, runtime, nativeThread),
        { entered: true, role: "executor", workOrder: "WO-999" },
      );
      assert.throws(
        () =>
          hostModule.beginCodexPhase(
            checkout,
            runtime,
            "synthetic-foreign-phase",
            "verifier",
            f.orderRoot,
          ),
        /reserved/,
      );
      assert.equal(
        hostModule.phaseEntryReadback(
          checkout,
          runtime,
          "synthetic-foreign-phase",
        ).entered,
        false,
      );
      hostModule.releasePhaseWriter(checkout, runtime, nativeThread);
      assert.equal(
        hostModule.phaseWriterView(checkout, runtime).reserved,
        false,
      );
    }
    const alias = join(base, "order-alias");
    symlinkSync(f.orderRoot, alias);
    const other = join(f.parent, "other-wo998");
    git(f.clone, "worktree", "add", "-qb", "wo-998", other, "main");
    const call = (file_path, extra = {}, hook = "permissions") => {
      const result = spawnSync(
        process.execPath,
        [join(f.target, `.claude/hooks/${hook}.mjs`)],
        {
          cwd: f.target,
          env: { ...f.env, DOTLN_DRIVEN_WORKER: context },
          encoding: "utf8",
          input: JSON.stringify({
            session_id: "phase-test",
            cwd: f.target,
            hook_event_name: "PreToolUse",
            tool_name: "Write",
            tool_input: { file_path, content: "synthetic\n" },
            ...extra,
          }),
        },
      );
      assert.equal(result.status, 0, result.stderr);
      return JSON.parse(result.stdout);
    };
    for (const command of [
      'npx ctx7@latest library "Node.js" "readFileSync utf8 encoding"',
      'npx ctx7@latest docs /nodejs/node "readFileSync utf8 encoding"',
      'gh search repos "repo:upstash/context7" --limit 1 --json fullName,url',
      "gh repo view upstash/context7",
      'curl --disable --fail --silent --show-error --max-time 60 "https://api.github.com/repos/upstash/context7"',
      'curl --disable --fail --silent --show-error --max-time 60 "https://api.github.com/search/repositories?q=context7+user:upstash&per_page=1"',
      `node '${f.orderRoot}/scripts/adjacent-work.mjs' list`,
    ])
      assert.equal(
        call(null, { tool_name: "Bash", tool_input: { command } })
          .hookSpecificOutput,
        undefined,
        command,
      );
    for (const command of [
      "npx ctx7@latest login",
      "npx another-package library Node.js query",
      "gh repo view upstash/context7 --web",
      "gh repo delete upstash/context7 --yes",
      "gh search repos node --json fullName > /outside/research.json",
    ])
      assert.equal(
        call(null, { tool_name: "Bash", tool_input: { command } })
          .hookSpecificOutput?.permissionDecision,
        "deny",
        command,
      );
    for (const root of [f.target, f.orderRoot, alias])
      assert.equal(
        call(join(root, "allowed.txt")).hookSpecificOutput,
        undefined,
        root,
      );
    assert.equal(
      call(join(other, "refused.txt")).hookSpecificOutput.permissionDecision,
      "deny",
    );
    assert.equal(
      call(
        join(f.target, "allowed.txt"),
        {},
        "concurrent-work-requires-worktrees",
      ).hookSpecificOutput,
      undefined,
    );
    for (const [tool_name, tool_input] of [
      ["Bash", { command: "git --no-pager status --short" }],
      [
        "Bash",
        {
          command:
            'npx ctx7@latest library "Node.js" "readFileSync utf8 encoding"',
        },
      ],
      [
        "Bash",
        {
          command:
            'npx ctx7@latest docs /nodejs/node "readFileSync utf8 encoding"',
        },
      ],
      [
        "Bash",
        {
          command:
            'gh search repos "repo:upstash/context7" --limit 1 --json fullName,url',
        },
      ],
      ["Bash", { command: "gh repo view upstash/context7" }],
      ["SubagentHandback", { message: "The assigned review is complete." }],
    ]) {
      for (const hook of ["permissions", "concurrent-work-requires-worktrees"])
        assert.equal(
          call(
            undefined,
            {
              agent_id: "read-only-reviewer",
              tool_name,
              tool_input,
            },
            hook,
          ).hookSpecificOutput,
          undefined,
          tool_name,
        );
    }
    // A helper shares its worker's session, so the writer guard sees one actor;
    // the rule at the worker's reservation is what keeps a helper read-only.
    for (const extra of [
      { agent_id: "read-only-reviewer" },
      {
        agent_id: "read-only-reviewer",
        tool_name: "Bash",
        tool_input: {
          command: `touch ${shellQuote(join(f.target, "child-shell.txt"))}`,
        },
      },
    ]) {
      const refused = call(
        extra.tool_name ? null : join(f.target, "child-write.txt"),
        extra,
      ).hookSpecificOutput;
      assert.equal(refused?.permissionDecision, "deny");
      assert.match(refused.permissionDecisionReason, /helper agent writes/);
    }
    // The briefing prints each launchpad command with its literal assignment.
    const scripts = join(f.orderRoot, "scripts");
    const shellCall = (command) =>
      call(null, { tool_name: "Bash", tool_input: { command } })
        .hookSpecificOutput?.permissionDecision;
    const prefix = `DOTLN_LAUNCHPAD=${shellQuote(f.orderRoot)}`;
    for (const command of [
      `${prefix} node ${shellQuote(join(scripts, "test-runner.mjs"))} --document`,
      `node ${shellQuote(join(scripts, "harness.mjs"))} writer --show`,
      `node ${shellQuote(join(scripts, "harness.mjs"))} evidence --wait`,
    ])
      assert.equal(shellCall(command), undefined, command);
    for (const command of [
      `DOTLN_LAUNCHPAD=/another/launchpad node ${shellQuote(join(scripts, "test-runner.mjs"))} --document`,
      `${prefix} node -e 0`,
      `node ${shellQuote(join(scripts, "harness.mjs"))} evidence`,
      `node ${shellQuote(join(scripts, "harness.mjs"))} bounded -- node -e 0`,
    ])
      assert.equal(shellCall(command), "deny", command);
    // Every command the worker note names reaches its launchpad script here.
    for (const name of drivenHelperScripts)
      assert.equal(
        shellCall(`node ${shellQuote(join(scripts, `${name}.mjs`))}`),
        undefined,
        name,
      );
    assert.equal(
      shellCall(
        `node ${shellQuote(join(scripts, "release.mjs"))} prepare --local`,
      ),
      undefined,
    );
    const integrate = `node ${shellQuote(join(scripts, "worktree.mjs"))} integrate WO-999`;
    assert.equal(shellCall(integrate), undefined);
    const note = phaseWorkerNotes(f.orderRoot);
    for (const name of [...drivenHelperScripts, "worktree", "refute-plan"])
      assert.ok(note.includes(`scripts/${name}.mjs`), name);
    assert.equal(
      shellCall(
        `node ${shellQuote(join(scripts, "refute-plan.mjs"))} followups --sync`,
      ),
      undefined,
    );
    // A read is a read for a helper too: it neither takes the writer nor reads
    // as an attempt to write.
    const helperCall = (command) =>
      call(null, {
        agent_id: "read-only-reviewer",
        tool_name: "Bash",
        tool_input: { command },
      }).hookSpecificOutput;
    for (const command of [
      "ls",
      "cat README.md",
      `node ${shellQuote(join(scripts, "resume.mjs"))} status --json`,
      `node ${shellQuote(join(scripts, "resume.mjs"))} briefing`,
      `node ${shellQuote(join(scripts, "harness.mjs"))} writer --show`,
      `node ${shellQuote(join(scripts, "harness.mjs"))} evidence --wait`,
    ])
      assert.equal(helperCall(command), undefined, command);
    for (const form of ["sync.mjs", "reader.mjs score --record"]) {
      const [script, ...args] = form.split(" ");
      assert.match(
        helperCall(
          ["node", shellQuote(join(scripts, script)), ...args].join(" "),
        ).permissionDecisionReason,
        /helper agent writes/,
        form,
      );
    }
    // Session scratch is the outside write a target phase keeps, and a helper
    // that writes nothing else may still use it; the temp root as a whole is not.
    const scratchPath = join(
      tmpdir(),
      "dotln",
      createHash("sha256").update("phase-test").digest("hex"),
      "scratch",
      "probe.mjs",
    );
    for (const extra of [{}, { agent_id: "read-only-reviewer" }])
      assert.equal(
        call(scratchPath, extra).hookSpecificOutput,
        undefined,
        JSON.stringify(extra),
      );
    assert.equal(
      call(join(base, "not-scratch.txt")).hookSpecificOutput
        ?.permissionDecision,
      "deny",
    );
    // The launchpad's live gate binds this hook too. Its own lane refuses these
    // writes, so the pair's other lane must not open a way around that.
    const gate = beginGateRun(f.orderRoot, "npm run test:docs", {
      kind: "document",
    });
    try {
      for (const path of ["scripts/resume.mjs", "README.md"]) {
        const refused = call(join(f.orderRoot, path)).hookSpecificOutput;
        assert.equal(refused?.permissionDecision, "deny", path);
      }
      assert.equal(
        call(null, {
          tool_name: "Bash",
          tool_input: {
            command: `echo x > ${shellQuote(join(f.orderRoot, "scripts/resume.mjs"))}`,
          },
        }).hookSpecificOutput?.permissionDecision,
        "deny",
      );
      // A launchpad command writes the same inputs however it was admitted.
      for (const form of [
        "sync.mjs",
        "meta.mjs",
        "reader.mjs score --record",
        "work-orders.mjs index",
        "adjacent-work.mjs apply request.json",
        "resume.mjs implementation-ready",
        "test-runner.mjs --document",
      ]) {
        const [script, ...args] = form.split(" ");
        const refused = call(null, {
          tool_name: "Bash",
          tool_input: {
            command: ["node", shellQuote(join(scripts, script)), ...args].join(
              " ",
            ),
          },
        }).hookSpecificOutput;
        assert.equal(refused?.permissionDecision, "deny", form);
        assert.match(refused.permissionDecisionReason, /active gate/, form);
      }
      // The reads stay open, so a worker can watch and wait for that gate.
      for (const form of [
        "harness.mjs writer --show",
        "harness.mjs evidence --wait",
        "resume.mjs status --json",
      ]) {
        const [script, ...args] = form.split(" ");
        assert.equal(
          shellCall(
            ["node", shellQuote(join(scripts, script)), ...args].join(" "),
          ),
          undefined,
          form,
        );
      }
      // A worker waits for the launchpad's gate, not its own worktree's.
      const started = Date.now();
      const waited = spawnSync(
        process.execPath,
        [
          join(import.meta.dirname, "harness.mjs"),
          "evidence",
          "--wait",
          "--timeout",
          "1",
        ],
        {
          cwd: f.target,
          env: { ...f.env, DOTLN_LAUNCHPAD: f.orderRoot },
          encoding: "utf8",
        },
      );
      assert.equal(waited.status, 2, waited.stderr);
      assert.ok(Date.now() - started >= 900, "the wait returned at once");
    } finally {
      gate.release();
    }
    const hash = (text) => createHash("sha256").update(text).digest("hex");
    const state = JSON.parse(
      readFileSync(
        join(
          f.main,
          "docs/control/local/harness/targets",
          hash(f.target),
          `${hash("phase-test")}.json`,
        ),
        "utf8",
      ),
    );
    assert.equal(state.role, "executor");
    assert.equal(state.outsideWriteGrants[0].kind, "order-worktree");
    assert.match(state.outsideWriteGrants[0].source, /WO-192/);
    assert.ok(state.outsideWriteGrants[0].authorityGrantId);
    const record = JSON.parse(readFileSync(context));
    const commit = (directory) =>
      call(undefined, {
        tool_name: "Bash",
        tool_input: {
          command: `git -C ${shellQuote(directory)} commit -m 'Synthetic records'`,
        },
      });
    assert.equal(
      commit(f.orderRoot).hookSpecificOutput.permissionDecision,
      "deny",
      "executor cannot commit records",
    );
    writeFileSync(context, JSON.stringify({ ...record, role: "reviewer" }));
    for (const directory of [f.target, f.orderRoot, alias])
      assert.equal(
        commit(directory).hookSpecificOutput,
        undefined,
        "reviewer can commit within the recorded physical pair",
      );
    assert.equal(shellCall(integrate), undefined);
    writeFileSync(context, JSON.stringify({ ...record, role: "verifier" }));
    assert.equal(shellCall(integrate), "deny");
    writeFileSync(context, JSON.stringify({ ...record, role: "reviewer" }));
    // A commit in the launchpad changes the inputs of a gate running there;
    // the target's own commit does not.
    const reviewGate = beginGateRun(f.orderRoot, "npm run test:docs", {
      kind: "document",
    });
    try {
      for (const directory of [f.orderRoot, alias]) {
        const refused = commit(directory).hookSpecificOutput;
        assert.equal(refused?.permissionDecision, "deny", directory);
        assert.match(refused.permissionDecisionReason, /active gate/);
      }
      assert.equal(commit(f.target).hookSpecificOutput, undefined);
    } finally {
      reviewGate.release();
    }
    const reviewerShell = (command, hook = "permissions") =>
      call(undefined, { tool_name: "Bash", tool_input: { command } }, hook);
    const pairedCommit = `git -C ${shellQuote(f.orderRoot)} commit -m 'Synthetic records'`;
    assert.throws(
      () =>
        hostModule.permissionEffect(
          { tool_name: "Bash", tool_input: { command: pairedCommit } },
          f.target,
        ),
      /working-directory override/,
      "the general classifier retains its refusal without the target adapter",
    );
    assert.equal(
      reviewerShell(`git -C ${shellQuote(alias)} add -- records.txt`)
        .hookSpecificOutput,
      undefined,
    );
    for (const command of [
      `git -C ${shellQuote(f.orderRoot)} push`,
      `git -C ${shellQuote(f.orderRoot)} commit -m ok && git push`,
      `git -C ${shellQuote(f.orderRoot)} commit -m ok > /outside/result`,
      `git -C "$PWD" commit -m ok`,
      `git -C ${shellQuote(f.orderRoot)} -c alias.commit=push commit`,
    ])
      assert.equal(
        reviewerShell(command).hookSpecificOutput?.permissionDecision,
        "deny",
        command,
      );
    for (const hook of ["concurrent-work-requires-worktrees", "no-attribution"])
      assert.equal(
        reviewerShell(pairedCommit, hook).hookSpecificOutput,
        undefined,
        hook,
      );
    assert.equal(
      reviewerShell(
        `git -C ${shellQuote(f.orderRoot)} commit -m 'Generated by Claude'`,
        "no-attribution",
      ).hookSpecificOutput?.permissionDecision,
      "deny",
    );
    const messageFile = "synthetic-commit-message.txt";
    const fileCommit = `git -C ${shellQuote(alias)} commit -F ${messageFile}`;
    write(f.target, messageFile, "fix: ordinary target message\n");
    write(f.orderRoot, messageFile, "Generated by Claude\n");
    assert.equal(
      reviewerShell(fileCommit, "no-attribution").hookSpecificOutput
        ?.permissionDecision,
      "deny",
      "relative message input is read from the selected paired worktree",
    );
    write(f.target, messageFile, "Generated by Claude\n");
    write(f.orderRoot, messageFile, "fix: ordinary paired message\n");
    assert.equal(
      reviewerShell(fileCommit, "no-attribution").hookSpecificOutput,
      undefined,
      "the target cwd does not replace the selected Git destination",
    );
    assert.equal(
      commit(other).hookSpecificOutput.permissionDecision,
      "deny",
      "another order remains outside the grant",
    );
  } finally {
    rmSync(base, { recursive: true, force: true });
  }
});

test("a transport-observed lifecycle refusal stops the drive after one launch", async () => {
  let launches = 0;
  const lines = [
    {
      message: {
        content: [
          {
            type: "tool_use",
            id: "dispatch",
            name: "Bash",
            input: {
              command: `node ${shellQuote(join(process.cwd(), "scripts/resume.mjs"))} verify`,
            },
          },
        ],
      },
    },
    {
      message: {
        content: [
          {
            type: "tool_result",
            tool_use_id: "dispatch",
            is_error: true,
            content:
              "DOTLN_HARNESS_REFUSED: worktree reserved by another session",
          },
        ],
      },
    },
    {
      type: "result",
      is_error: false,
      total_cost_usd: 0.1,
      usage: { input_tokens: 3 },
    },
  ];
  const result = await driveLoop({
    record: { attempts: [], incomplete: {} },
    status: () => ({
      phase: "ready-to-verify",
      route: routeOrder({ phase: "ready-to-verify" }),
    }),
    launch: () => {
      launches++;
      return launchPhase({
        command: process.execPath,
        args: [
          "-e",
          `process.stdout.write(${JSON.stringify(lines.map((row) => JSON.stringify(row)).join("\n") + "\n")})`,
        ],
        cwd: process.cwd(),
        env: process.env,
        timeoutMs: 5000,
      });
    },
  });
  assert.equal(launches, 1);
  assert.equal(result.stop.reason, "dispatch-refused");
  assert.equal(result.attempts[0].costUsd, 0.1);
});

for (const protocol of ["codex", "claude"])
  test(`${protocol} dispatch refusal requires one parsed helper invocation`, async (t) => {
    const launchpad = "/fixture with spaces";
    const helper = `node ${shellQuote(join(launchpad, "scripts/resume.mjs"))}`;
    const cases = [
      [
        "printing",
        "node -e 'console.error(\"resume.mjs next refused\");process.exit(1)'",
        false,
      ],
      ["searching", "rg 'resume.mjs next refused' missing-refused-file", false],
      [
        "compound",
        `${helper} next && node -e 'console.error("refused");process.exit(1)'`,
        false,
      ],
      [
        "wrapped compound",
        `/bin/zsh -lc ${shellQuote(`${helper} next && printf refused >&2 && false`)}`,
        false,
      ],
      ["read action", "node scripts/resume.mjs status --next-preview", false],
      ["dynamic helper", 'node "$PHASE_HELPER" next', false],
      ["expanded helper", "node /fixture/*/resume.mjs next", false],
      ["negated helper", `! ${helper} next`, false],
      [
        "negated wrapper",
        `! /bin/zsh -lc ${shellQuote(`${helper} next`)}`,
        false,
      ],
      ["background helper", `${helper} next &`, false],
      ["conditional helper", `if ${helper} next; then :; fi`, false],
      ["unqualified helper", "node scripts/resume.mjs verify", false],
      [
        "unrelated target helper",
        "node /target/scripts/resume.mjs next",
        false,
      ],
      [
        "unrelated npm package",
        "npm --prefix /target run resume -- next",
        false,
      ],
      ["relative npm prefix", "npm --prefix . run resume -- next", false],
      ["direct helper", `${helper} verify`, true],
      [
        "native shell wrapper",
        `/bin/zsh -lc ${shellQuote(`${helper} verify`)}`,
        true,
      ],
      [
        "qualified helper",
        "/usr/local/bin/node '/fixture with spaces/scripts/resume.mjs' fix",
        true,
      ],
      [
        "literal environment",
        `DOTLN_LAUNCHPAD=${shellQuote(launchpad)} ${helper} next`,
        true,
      ],
      ["unqualified npm helper", "npm run resume -- final-review", false],
      [
        "qualified npm helper",
        `npm --prefix ${shellQuote(launchpad)} run --silent resume -- verify`,
        true,
      ],
      [
        "quiet npm helper",
        `npm --prefix ${shellQuote(launchpad)} run resume --silent -- next`,
        true,
      ],
    ];
    for (const [name, command, isDispatch] of cases)
      await t.test(name, async () => {
        const output = "resume.mjs next refused: private diagnostic";
        const rows =
          protocol === "codex"
            ? [
                {
                  type: "item.completed",
                  item: {
                    type: "command_execution",
                    command,
                    status: "failed",
                    exit_code: 1,
                    aggregated_output: output,
                  },
                },
              ]
            : [
                {
                  message: {
                    content: [
                      {
                        type: "tool_use",
                        id: "command",
                        name: "Bash",
                        input: { command },
                      },
                    ],
                  },
                },
                {
                  message: {
                    content: [
                      {
                        type: "tool_result",
                        tool_use_id: "command",
                        is_error: true,
                        content: output,
                      },
                    ],
                  },
                },
              ];
        let phase = "active";
        const actions = [];
        const result = await driveLoop({
          record: { attempts: [], incomplete: {} },
          stopAt: "verified",
          status: () => ({ phase, route: routeOrder({ phase }) }),
          launch: async (route) => {
            actions.push(route.action);
            const observed = await launchPhase({
              command: process.execPath,
              protocol,
              args: [
                "-e",
                `for (const row of ${JSON.stringify(rows)}) console.log(JSON.stringify(row));`,
              ],
              cwd: process.cwd(),
              launchpad,
              env: process.env,
              timeoutMs: 5000,
            });
            if (!isDispatch)
              phase = route.action === "next" ? "ready-to-verify" : "verified";
            return observed;
          },
        });
        assert.deepEqual(actions, isDispatch ? ["next"] : ["next", "verify"]);
        assert.equal(
          result.stop.reason,
          isDispatch ? "dispatch-refused" : "fixture-endpoint",
        );
        for (const attempt of result.attempts) {
          assert.equal(Boolean(attempt.refused), isDispatch);
          assert.equal(attempt.workerEnded, true);
        }
        assert.equal(JSON.stringify(result).includes("private"), false);
      });
  });

test("transport observes the worker end even when saving its PID fails", async () => {
  let pid;
  await assert.rejects(
    launchPhase({
      command: process.execPath,
      args: ["-e", "setInterval(()=>{},1000)"],
      cwd: process.cwd(),
      env: process.env,
      timeoutMs: 5000,
      onSpawn: (value) => {
        pid = value;
        throw new Error("synthetic record write failure");
      },
    }),
    /synthetic record write failure/,
  );
  assert.throws(
    () => process.kill(pid, 0),
    (error) => error.code === "ESRCH",
  );
});

test("concurrent runDrive entries admit only one lifecycle runner", async () => {
  const base = realpathSync(
    createFixtureRoot(join(tmpdir(), "dotln-drive-concurrent-")),
  );
  let release;
  try {
    const f = fixture(base);
    f.mapClone();
    f.start();
    let launches = 0,
      entered;
    const acquired = new Promise((resolve) => {
      entered = resolve;
    });
    const hold = new Promise((resolve) => {
      release = resolve;
    });
    const execute = async () => {
      launches++;
      entered();
      await hold;
      return { stop: { reason: "fixture-endpoint" } };
    };
    const first = runDrive(f.main, "WO-999", {}, execute);
    await acquired;
    await assert.rejects(
      runDrive(f.main, "WO-999", {}, execute),
      /Another drive of WO-999 is already running/,
    );
    release();
    await first;
    assert.equal(launches, 1);
  } finally {
    release?.();
    rmSync(base, { recursive: true, force: true });
  }
});

test("supervisor death terminates its detached native worker before transport returns", async () => {
  let nativePid;
  const result = await launchPhase({
    command: process.execPath,
    args: ["-e", "setInterval(()=>{},1000)"],
    cwd: process.cwd(),
    env: process.env,
    timeoutMs: 10000,
    onSpawn: (pid) => {
      nativePid = pid;
      const parent = spawnSync("ps", ["-o", "ppid=", "-p", String(pid)], {
        encoding: "utf8",
      });
      assert.equal(parent.status, 0);
      const supervisor = Number(parent.stdout.trim());
      assert.ok(
        Number.isSafeInteger(supervisor) &&
          supervisor > 1 &&
          supervisor !== process.pid,
      );
      process.kill(supervisor, "SIGKILL");
    },
  });
  assert.equal(result.cause, "supervisor-ended-before-worker");
  assert.equal(result.error, true);
  assert.equal(result.workerEnded, true);
  assert.throws(
    () => process.kill(nativePid, 0),
    (error) => error.code === "ESRCH",
  );
});

test("both native hosts use every generated role with the shared host pins", async () => {
  for (const host of ["claude", "codex"]) {
    for (const role of [
      "router",
      "executor",
      "verifier",
      "reviewer",
      "release-close",
    ]) {
      const value = await phaseDefinition(process.cwd(), role, host);
      assert.equal(value.name, `dotln-${role}`);
      assert.equal(
        value.definition.model,
        host === "codex" ? "gpt-6.1-sol" : "claude-opus-5-5",
      );
      assert.equal(
        value.definition.effort,
        host === "codex" && role !== "verifier" ? "max" : "xhigh",
      );
      assert.match(value.definition.prompt, new RegExp(`name: dotln-${role}`));
      if (role === "router") {
        assert.match(
          value.definition.prompt,
          /Bash dangerouslyDisableSandbox: true/,
        );
        assert.match(
          value.definition.prompt,
          /in Codex use its normal tool approval request/,
        );
      }
    }
  }
  assert.throws(() => driveHost("unrecognized"), /drive host must/);
});

test("native Codex stream retains identities and usage without inventing hook or model readback", async () => {
  const events = [
    { type: "thread.started", thread_id: "fixture-native-thread" },
    {
      type: "item.started",
      item: { id: "search", type: "web_search", query: "private query" },
    },
    {
      type: "item.completed",
      item: { id: "search", type: "web_search", query: "private query" },
    },
    {
      type: "item.completed",
      item: {
        id: "failed-search",
        type: "web_search",
        query: "private query",
        status: "failed",
      },
    },
    {
      type: "item.completed",
      item: {
        type: "command_execution",
        command: "npm --prefix /private-fixture-path run resume -- status",
        status: "failed",
        exit_code: 1,
        aggregated_output: "private diagnostic",
      },
    },
    {
      type: "item.completed",
      item: {
        type: "command_execution",
        command:
          "/bin/zsh -lc 'node /private-fixture-path/scripts/harness.mjs usage private-session'",
        status: "failed",
        exit_code: 1,
        aggregated_output: "Begin the harness session; private diagnostic",
      },
    },
    {
      type: "item.completed",
      item: {
        type: "command_execution",
        command: "npm run test:docs",
        status: "failed",
        exit_code: 1,
        aggregated_output:
          "private fixture diagnostic; EACCES cache: fetch failed TLS",
      },
    },
    {
      type: "item.completed",
      item: {
        id: "spawn-1",
        type: "collab_tool_call",
        tool: "spawn_agent",
        sender_thread_id: "fixture-native-thread",
        receiver_thread_ids: ["fixture-child"],
        prompt: "private worker narrative",
      },
    },
    {
      type: "item.completed",
      item: { type: "agent_message", text: "private result narrative" },
    },
    {
      type: "turn.completed",
      usage: { input_tokens: 12, cached_input_tokens: 4, output_tokens: 3 },
    },
  ];
  const sessions = [],
    spawns = [],
    commands = [];
  const result = await launchPhase({
    command: process.execPath,
    protocol: "codex",
    args: [
      "-e",
      `process.stdout.write(${JSON.stringify(events.map(JSON.stringify).join("\n") + "\n")})`,
    ],
    cwd: process.cwd(),
    env: process.env,
    timeoutMs: 5000,
    onSession: (id) => sessions.push(id),
    onCommand: (row) => commands.push(row),
    onSubagent: (row) => {
      spawns.push(row);
    },
  });

  assert.deepEqual(sessions, ["fixture-native-thread"]);
  assert.deepEqual(spawns, [
    {
      id: "spawn-1",
      sender: "fixture-native-thread",
      children: ["fixture-child"],
    },
  ]);
  assert.equal(result.usage.input_tokens, 12);
  assert.equal(result.model, null);
  assert.deepEqual(result.nativeReadback, {
    effort: null,
    permissionMode: null,
  });
  assert.equal(result.costUsd, null);
  assert.deepEqual(result.hookEvents, []);
  assert.deepEqual(commands, [
    { kind: "public-web", status: "completed", exitCode: null },
    { kind: "public-web", status: "failed", exitCode: null },
    {
      kind: "unclassified-shell",
      status: "failed",
      exitCode: 1,
      shape: [
        ["npm", "--prefix", "<operand>", "run", "<operand>", "--", "status"],
      ],
    },
    {
      kind: "harness",
      status: "failed",
      exitCode: 1,
      shape: [["node", "harness.mjs", "usage", "<operand>"]],
      diagnosticSignals: ["session-unavailable"],
    },
    {
      kind: "document-gate",
      status: "failed",
      exitCode: 1,
      shape: [["npm", "run", "<operand>"]],
      diagnosticSignals: [
        "fetch-failed",
        "certificate",
        "filesystem-permission",
        "cache",
      ],
    },
  ]);
  assert.deepEqual(result.commandResults, commands);
  assert.deepEqual(result.boundaryResults, [
    {
      kind: "native-tool",
      category: "host-os-refusal",
      codes: ["EACCES"],
      operations: [],
      components: [],
    },
  ]);
  assert.equal(JSON.stringify(result).includes("private"), false);
});

for (const supplied of [true, false]) {
  test(`native Claude readback keeps fixed permission labels with ${supplied ? "supported" : "unknown"} values`, async () => {
    const rows = [
      {
        type: "system",
        subtype: "init",
        model: "fixture-model",
        effort: supplied ? "xhigh" : "private-effort",
        permissionMode: supplied ? "auto" : "private-mode",
      },
      {
        type: "assistant",
        message: {
          content: [
            {
              type: "tool_use",
              id: "private-tool",
              name: "Bash",
              input: {
                command: "node scripts/harness.mjs usage private-session",
              },
            },
          ],
        },
      },
      {
        type: "system",
        subtype: "permission_denied",
        tool_name: "Bash",
        tool_use_id: "private-tool",
        agent_id: "private-agent",
        decision_reason_type: supplied ? "classifier" : "private-source",
        decision_reason: "private reason",
        message: "private rejection text",
      },
      {
        type: "system",
        subtype: "permission_denied",
        tool_use_id: "private-unknown-tool",
        decision_reason_type: "rule",
        decision_reason: "private rule",
      },
      { type: "result", is_error: false },
    ];
    const result = await launchPhase({
      command: process.execPath,
      args: [
        "-e",
        `for (const row of ${JSON.stringify(rows)}) console.log(JSON.stringify(row));`,
      ],
      cwd: process.cwd(),
      env: process.env,
      timeoutMs: 5000,
    });
    assert.equal(result.model, "fixture-model");
    assert.deepEqual(result.nativeReadback, {
      effort: supplied ? "xhigh" : null,
      permissionMode: supplied ? "auto" : null,
    });
    assert.deepEqual(result.boundaryResults, [
      {
        kind: "native-permission",
        commandKind: "harness",
        decisionSource: supplied ? "classifier" : "unknown",
      },
      { kind: "native-permission", commandKind: null, decisionSource: "rule" },
    ]);
    assert.equal(JSON.stringify(result).includes("private"), false);
  });
}

test("native failure history retains a declined command and nonzero exits", async () => {
  const observed = [];
  const outcomes = [
    { status: "declined" },
    { status: "completed", exit_code: 1 },
    { status: "failed", exit_code: 1 },
    { status: "completed", exit_code: 0 },
  ];
  const rows = outcomes.map((outcome) => ({
    type: "item.completed",
    item: {
      type: "command_execution",
      command: "node scripts/harness.mjs usage private-session",
      aggregated_output: "private output",
      ...outcome,
    },
  }));
  for (const stream of [rows.slice(0, 1), rows.slice(1)])
    await launchPhase({
      command: process.execPath,
      protocol: "codex",
      args: [
        "-e",
        `for (const row of ${JSON.stringify(stream)}) console.log(JSON.stringify(row));`,
      ],
      cwd: process.cwd(),
      env: process.env,
      timeoutMs: 5000,
      onCommand: (row) => {
        if (commandFailed(row)) observed.push(row);
      },
    });
  assert.deepEqual(
    observed.map((row) => [row.status, row.exitCode]),
    [
      ["declined", null],
      ["completed", 1],
      ["failed", 1],
    ],
  );
  assert.equal(JSON.stringify(observed).includes("private"), false);
});

for (const protocol of ["claude", "codex"])
  test(`${protocol} refusal evidence excludes queries, successful output and narrative`, async () => {
    const quoted =
      "DOTLN_PRIVATE_REFUSED DOTLN_ROUTER_SPAWN_REFUSED DOTLN_TARGET_REFUSED target shell destinations unavailable DOTLN_TARGET_RUNTIME_REFUSED unavailable at runtime-integrity (EPERM)";
    const failures = [
      "DOTLN_TARGET_REFUSED: target shell destinations unavailable DOTLN_PRIVATE_REFUSED",
      "DOTLN_TARGET_RUNTIME_REFUSED: unavailable at runtime-integrity (EPERM) DOTLN_PRIVATE_REFUSED",
    ];
    const rows =
      protocol === "claude"
        ? [
            {
              type: "assistant",
              message: {
                content: [
                  {
                    type: "tool_use",
                    id: "web",
                    name: "WebSearch",
                    input: { query: quoted },
                  },
                ],
              },
            },
            {
              type: "user",
              message: {
                content: [
                  { type: "tool_result", tool_use_id: "web", content: quoted },
                ],
              },
            },
            {
              type: "assistant",
              message: { content: [{ type: "text", text: quoted }] },
            },
            {
              type: "system",
              subtype: "hook_response",
              hook_event: "PreToolUse",
              outcome: "success",
              stdout: JSON.stringify({
                hookSpecificOutput: {
                  permissionDecision: "allow",
                  additionalContext: quoted,
                },
              }),
            },
            ...failures.flatMap((failure, index) => [
              {
                type: "assistant",
                message: {
                  content: [
                    {
                      type: "tool_use",
                      id: `failure-${index}`,
                      name: "Bash",
                      input: {
                        command:
                          "node scripts/harness.mjs usage private-session",
                      },
                    },
                  ],
                },
              },
              {
                type: "user",
                message: {
                  content: [
                    {
                      type: "tool_result",
                      tool_use_id: `failure-${index}`,
                      is_error: true,
                      content: failure,
                    },
                  ],
                },
              },
            ]),
            {
              type: "system",
              subtype: "hook_response",
              hook_event: "PreToolUse",
              outcome: "success",
              stdout: JSON.stringify({
                hookSpecificOutput: {
                  permissionDecision: "deny",
                  permissionDecisionReason:
                    "DOTLN_SUBAGENT_CAP_REFUSED: cap reached DOTLN_PRIVATE_REFUSED",
                },
              }),
            },
          ]
        : [
            {
              type: "item.completed",
              item: { type: "web_search", query: quoted },
            },
            {
              type: "item.completed",
              item: { type: "agent_message", text: quoted },
            },
            {
              type: "item.completed",
              item: {
                type: "command_execution",
                command: "node scripts/harness.mjs usage private-session",
                status: "completed",
                exit_code: 0,
                aggregated_output: quoted,
              },
            },
            ...failures.map((failure) => ({
              type: "item.completed",
              item: {
                type: "command_execution",
                command: "node scripts/harness.mjs usage private-session",
                status: "failed",
                exit_code: 1,
                aggregated_output: failure,
              },
            })),
          ];
    const result = await launchPhase({
      command: process.execPath,
      protocol,
      args: [
        "-e",
        `for (const row of ${JSON.stringify(rows)}) console.log(JSON.stringify(row));`,
      ],
      cwd: process.cwd(),
      env: process.env,
      timeoutMs: 5000,
    });
    assert.deepEqual(
      result.refusalCodes.sort(),
      [
        "DOTLN_TARGET_REFUSED",
        "DOTLN_TARGET_RUNTIME_REFUSED",
        ...(protocol === "claude" ? ["DOTLN_SUBAGENT_CAP_REFUSED"] : []),
      ].sort(),
    );
    assert.deepEqual(
      result.boundaryResults.filter((row) =>
        ["target-runtime", "target-permission"].includes(row.kind),
      ),
      [
        { kind: "target-permission", category: "opaque-shell" },
        { kind: "target-runtime", stage: "runtime-integrity", code: "EPERM" },
      ],
    );
    assert.equal(JSON.stringify(result).includes("PRIVATE"), false);
    assert.equal(JSON.stringify(result).includes("private-session"), false);
  });

test("automatic dispatch refusal requires the hook's structured refusal message", async () => {
  for (const refused of [false, true]) {
    const row = {
      type: "system",
      subtype: "hook_response",
      hook_event: "UserPromptSubmit",
      outcome: "success",
      stdout: JSON.stringify({
        systemMessage: `${refused ? "DotLn: prompt accepted; " : "Quoted documentation: "}DOTLN_HARNESS_REFUSED: synthetic refusal`,
      }),
    };
    const result = await launchPhase({
      command: process.execPath,
      args: ["-e", `console.log(${JSON.stringify(JSON.stringify(row))});`],
      cwd: process.cwd(),
      env: process.env,
      timeoutMs: 5000,
    });
    assert.equal(Boolean(result.refused), refused);
    assert.deepEqual(
      result.refusalCodes,
      refused ? ["DOTLN_HARNESS_REFUSED"] : [],
    );
  }
});

for (const protocol of ["claude", "codex"])
  test(`${protocol} denied canonical launcher stops before another launcher runs`, async () => {
    const base = createFixtureRoot(join(tmpdir(), "dotln-launch-denial-"));
    const marker = join(base, "alternative-ran");
    const launcherCommand = "node scripts/drive.mjs WO-999";
    const rows =
      protocol === "claude"
        ? [
            {
              type: "assistant",
              message: {
                content: [
                  {
                    type: "tool_use",
                    id: "launch",
                    name: "Bash",
                    input: {
                      command: launcherCommand,
                      dangerouslyDisableSandbox: true,
                    },
                  },
                ],
              },
            },
            {
              type: "user",
              message: {
                content: [
                  {
                    type: "tool_result",
                    tool_use_id: "launch",
                    is_error: true,
                    content: "Permission denied: private host diagnostic",
                  },
                ],
              },
            },
          ]
        : [
            {
              type: "item.completed",
              item: {
                type: "command_execution",
                command: `/bin/zsh -lc '${launcherCommand}'`,
                status: "failed",
                exit_code: 1,
                aggregated_output: "Permission denied: private host diagnostic",
              },
            },
          ];
    try {
      const result = await launchPhase({
        command: process.execPath,
        args: [
          "-e",
          `const fs = require('node:fs'); for (const row of ${JSON.stringify(rows)}) console.log(JSON.stringify(row)); setTimeout(() => { fs.writeFileSync(${JSON.stringify(marker)}, 'alternative launcher'); }, 1000);`,
        ],
        launcherCommand,
        protocol,
        cwd: process.cwd(),
        env: process.env,
        timeoutMs: 5000,
      });
      assert.equal(result.cause, "native-launcher-refused");
      assert.ok(result.refused);
      assert.equal(result.workerEnded, true);
      assert.deepEqual(result.commandResults, [
        {
          kind: "driver-launch",
          status: "failed",
          exitCode: protocol === "claude" ? null : 1,
          shape: [["node", "drive.mjs", "<operand>"]],
          diagnosticSignals: ["host-permission"],
        },
      ]);
      assert.equal(existsSync(marker), false);
      assert.equal(JSON.stringify(result).includes("private"), false);
    } finally {
      rmSync(base, { recursive: true, force: true });
    }
  });

for (const protocol of ["claude", "codex"])
  test(`${protocol} denied phase command stops the driver before another attempt`, async () => {
    const base = createFixtureRoot(join(tmpdir(), "dotln-phase-denial-"));
    const marker = join(base, "alternative-ran");
    const rows =
      protocol === "codex"
        ? [
            {
              type: "item.completed",
              item: { type: "agent_message", text: "private narrative" },
            },
            {
              type: "item.completed",
              item: {
                type: "command_execution",
                command: "node scripts/resume.mjs implementation-ready",
                status: "declined",
                aggregated_output: "the host printed this reason",
              },
            },
          ]
        : [
            {
              type: "system",
              subtype: "permission_denied",
              tool_use_id: "private-tool",
              decision_reason_type: "classifier",
              decision_reason: "private permission reason",
            },
            { type: "result", is_error: false },
          ];
    let launches = 0;
    const record = { attempts: [], incomplete: {} };
    try {
      const result = await driveLoop({
        record,
        status: () => ({
          phase: "active",
          route: routeOrder({ phase: "active" }, [], {
            incomplete: record.incomplete,
          }),
        }),
        launch: async () => {
          launches++;
          return launchPhase({
            command: process.execPath,
            protocol,
            args: [
              "-e",
              `const fs = require('node:fs'); process.stdout.write(${JSON.stringify(rows.map(JSON.stringify).join("\n") + "\n")}); setTimeout(() => fs.writeFileSync(${JSON.stringify(marker)}, 'alternative'), 1000);`,
            ],
            cwd: process.cwd(),
            env: process.env,
            timeoutMs: 5000,
          });
        },
      });
      assert.equal(launches, 1);
      assert.equal(result.stop.reason, "dispatch-refused");
      assert.equal(record.attempts[0].cause, "native-permission-refused");
      assert.equal(record.attempts[0].error, true);
      assert.equal(record.attempts[0].workerEnded, true);
      assert.equal(record.incomplete.next, undefined);
      assert.equal(existsSync(marker), false);
      assert.equal(JSON.stringify(result).includes("private"), false);
      // The declined item is retained in the enumerated vocabulary with the
      // reason the host printed, masked of URLs, paths and queries, or that it
      // printed none (WO-247-D003).
      const declined = record.attempts[0].declined;
      if (protocol === "codex") {
        assert.deepEqual(declined, {
          kind: "lifecycle",
          command: [["node", "resume.mjs", "implementation-ready"]],
          status: "declined",
          exitCode: null,
          reason: "the host printed this reason",
          reasonSource: "command_execution.aggregated_output",
          reasonRedaction: "urls-paths-queries-masked",
          sequence: 2,
        });
        assert.deepEqual(record.attempts[0].eventTail, [
          { type: "item.completed", item: "agent_message" },
          {
            type: "item.completed",
            item: "command_execution",
            status: "declined",
          },
        ]);
        assert.equal(record.attempts[0].eventRows, 2);
      } else {
        assert.equal(declined.status, "declined");
        assert.equal(declined.reason, null);
        assert.equal(declined.reasonSource, "none-printed");
        assert.deepEqual(record.attempts[0].eventTail, [
          { type: "system", subtype: "permission_denied" },
          { type: "result" },
        ]);
      }
    } finally {
      rmSync(base, { recursive: true, force: true });
    }
  });

// A synthetic native process that prints the given stream rows, then any
// stderr text, and exits with the given code.
const emitRows = (rows, { stderr = "", exitCode = 0 } = {}) => [
  "-e",
  `for (const row of ${JSON.stringify(rows)}) console.log(JSON.stringify(row)); if (${JSON.stringify(stderr)}) console.error(${JSON.stringify(stderr)}); process.exitCode = ${exitCode};`,
];
const declinedCloseRows = [
  {
    type: "item.completed",
    item: {
      type: "command_execution",
      command:
        "/usr/local/bin/node /launchpad/scripts/release.mjs close WO-999 --publish",
      status: "declined",
      aggregated_output: "",
    },
  },
];
// The host's automatic review prints its rejection on stderr, as Codex CLI
// 0.166.0 did on 2026-11-01, while the stream item carries no reason.
const rejectionLine =
  'ERROR codex_core::tools::router: error=exec_command failed: CreateProcess { message: "Rejected(\\"This action was rejected due to unacceptable risk.\\\\nReason: the exact helper would publish.\\")" }';

test("Codex's printed rejection is read from its last Rejected message, doubly escaped or plain", () => {
  assert.equal(
    printedRejection(rejectionLine),
    "This action was rejected due to unacceptable risk.\nReason: the exact helper would publish.",
  );
  assert.equal(
    printedRejection('Rejected("plain quoted reason")'),
    "plain quoted reason",
  );
  assert.equal(
    printedRejection('Rejected("an earlier one") and Rejected("the last one")'),
    "the last one",
  );
  assert.equal(printedRejection("no rejection here"), null);
  assert.equal(printedRejection(undefined), null);
});

test("a declined reason keeps no URL, path or query: each is masked before it reaches a receipt", () => {
  assert.equal(
    redactReason(
      "The exact helper will push a tag/release; see https://example.invalid/x?q=secret-term and /Users/alice/Projects/private-repo/scripts/release.mjs, docs/README.md, ~/private/notes.txt and api.github.com/repos/owner/repo; v0.106.0 stays.",
    ),
    "The exact helper will push a <path>; see <url> and <path>, <path>, <path> and <url>; v0.106.0 stays.",
  );
  assert.equal(
    redactReason("rejected ?q=secret-term&per_page=1 now"),
    "rejected <query> now",
  );
  for (const [input, masked] of [
    ["see file:///Users/alice/private-repo/notes.txt now", "see <url> now"],
    [
      "writes into docs/control/local/drives and scripts/release now",
      "writes into <path> and <path> now",
    ],
    ["touches /private and ~/secrets now", "touches <path> and <path> now"],
    ["under $HOME/private/notes now", "under <path> now"],
    ["path /Users/alice/My Projects/secret-plan now", "path <path> <path> now"],
    [
      "WO-999 at v0.106.0 with --dry-run on 2026-11-01",
      "WO-999 at v0.106.0 with --dry-run on 2026-11-01",
    ],
    ["home /Users/日本語/secret/plan.txt now", "home <path> now"],
    ["home /Users/jöran/private-repo/notes.txt now", "home <path> now"],
    ["drive C:\\Users\\alice\\secret\\plan.txt now", "drive <path> now"],
    [
      "drive C:\\Users\\alice\\My Documents\\secret-plan.txt now",
      "drive <path> <path> now",
    ],
    ["share \\\\fileserver\\private-share\\plan.txt now", "share <path> now"],
    ["under Documents\\alice\\plan.txt now", "under <path> now"],
    ["asked ?名前=値 now", "asked <query> now"],
    ["under $HOME/private/notes now", "under <path> now"],
  ])
    assert.equal(redactReason(input), masked, input);
  assert.equal(
    redactReason("Reason: the exact helper would publish."),
    "Reason: the exact helper would publish.",
  );
});

test("a declined release close stops at awaiting-close with the attended phrase and, after a Codex decline, the admitted host change", async () => {
  const closedStatus = () => ({
    phase: "closed",
    route: {
      ...routeOrder({ phase: "closed", workOrderId: "WO-999" }, [], {
        merged: true,
      }),
      eventCount: 7,
    },
  });
  const saved = [];
  const record = {
    workOrder: "WO-999",
    host: "codex",
    attempts: [],
    incomplete: {},
  };
  const result = await driveLoop({
    record,
    saveRecord: (value) => saved.push(JSON.parse(JSON.stringify(value))),
    status: closedStatus,
    launch: () =>
      launchPhase({
        command: process.execPath,
        protocol: "codex",
        args: emitRows(declinedCloseRows, { stderr: rejectionLine }),
        cwd: process.cwd(),
        env: process.env,
        timeoutMs: 5000,
      }),
  });
  assert.equal(result.stop.reason, "awaiting-close");
  assert.match(result.stop.next, /resume: release close for WO-999/);
  assert.match(
    result.stop.next,
    /node scripts\/drive\.mjs WO-999 --host claude/,
  );
  assert.match(result.stop.next, /with the host's reason/);
  assert.equal(record.refused, undefined, "a declined close is not a refusal");
  assert.equal(record.factsAt, 7);
  assert.equal(record.awaitingClose.host, "codex");
  assert.deepEqual(record.awaitingClose.declined.command, [
    ["<operand>", "release.mjs", "close", "<operand>", "--publish"],
  ]);
  assert.equal(record.awaitingClose.declined.reasonSource, "native-stderr");
  assert.equal(
    record.awaitingClose.declined.reason,
    "This action was rejected due to unacceptable risk.\nReason: the exact helper would publish.",
  );
  assert.equal(
    record.awaitingClose.declined.reasonRedaction,
    "urls-paths-queries-masked",
  );
  assert.deepEqual(
    record.attempts[0].nativeDiagnostics.find(
      (row) => row.source === "stderr-tail",
    ).signals,
    ["auto-review-rejected"],
  );
  assert.equal(saved.length, 1);
  // Status and the driver build the same row from the record, after release
  // and before any refusal; a close attended since reads as released, and a
  // reactivated order routes by its phase, not by a decline it no longer has.
  const facts = { merged: true, awaitingClose: record.awaitingClose };
  const status = routeOrder(
    { phase: "closed", workOrderId: "WO-999" },
    [],
    facts,
  );
  assert.equal(status.stop.reason, "awaiting-close");
  assert.equal(
    status.stop.next,
    awaitingCloseStop("WO-999", record.awaitingClose).stop.next,
  );
  assert.equal(
    routeOrder({ phase: "closed" }, [], { ...facts, released: true }).stop
      .reason,
    "released",
  );
  assert.equal(
    routeOrder({ phase: "active", workOrderId: "WO-999" }, [], facts).action,
    "next",
  );
  // A same-host re-entry stops at the same row instead of retrying the close.
  const again = await driveLoop({
    record: { ...record, attempts: [] },
    status: () => ({
      phase: "closed",
      route: routeOrder({ phase: "closed", workOrderId: "WO-999" }, [], facts),
    }),
    launch: () => assert.fail("a declined close is not retried"),
  });
  assert.equal(again.stop.reason, "awaiting-close");
  // A reason with a path or a query reaches the record masked; the raw text
  // stays only in the retained stderr.
  const masked = {
    workOrder: "WO-999",
    host: "codex",
    attempts: [],
    incomplete: {},
  };
  await driveLoop({
    record: masked,
    status: closedStatus,
    launch: () =>
      launchPhase({
        command: process.execPath,
        protocol: "codex",
        args: emitRows(declinedCloseRows, {
          stderr:
            'Rejected("The helper /Users/alice/Projects/private-repo/scripts/release.mjs would publish; see https://example.invalid/x?q=secret-term")',
        }),
        cwd: process.cwd(),
        env: process.env,
        timeoutMs: 5000,
      }),
  });
  assert.equal(
    masked.awaitingClose.declined.reason,
    "The helper <path> would publish; see <url>",
  );
  assert.equal(JSON.stringify(masked).includes("alice"), false);
  assert.equal(JSON.stringify(masked).includes("secret-term"), false);
  // A close the Claude host declines stops at the same row, with no reason
  // (its denial row carries prose the host already classified) and without
  // the host change, which is admitted after a Codex decline alone.
  const claudeRecord = {
    workOrder: "WO-999",
    host: "claude",
    attempts: [],
    incomplete: {},
  };
  const claudeStop = await driveLoop({
    record: claudeRecord,
    status: closedStatus,
    launch: () =>
      launchPhase({
        command: process.execPath,
        protocol: "claude",
        args: emitRows([
          {
            type: "assistant",
            message: {
              content: [
                {
                  type: "tool_use",
                  id: "close",
                  name: "Bash",
                  input: {
                    command:
                      "node /launchpad/scripts/release.mjs close WO-999 --publish",
                  },
                },
              ],
            },
          },
          {
            type: "system",
            subtype: "permission_denied",
            tool_use_id: "close",
            decision_reason_type: "classifier",
          },
        ]),
        cwd: process.cwd(),
        env: process.env,
        timeoutMs: 5000,
      }),
  });
  assert.equal(claudeStop.stop.reason, "awaiting-close");
  assert.match(claudeStop.stop.next, /The claude host declined/);
  assert.match(claudeStop.stop.next, /resume: release close for WO-999/);
  assert.doesNotMatch(
    claudeStop.stop.next,
    /--host claude|admitted host change/,
  );
  assert.match(claudeStop.stop.next, /printed no reason/);
  assert.equal(claudeRecord.awaitingClose.declined.reason, null);
  assert.equal(
    claudeRecord.awaitingClose.declined.reasonSource,
    "none-printed",
  );
  assert.equal(claudeRecord.awaitingClose.declined.reasonRedaction, undefined);
  // Any other declined phase keeps the dispatch-refused stop.
  const other = await driveLoop({
    record: { attempts: [], incomplete: {} },
    status: () => ({ phase: "active", route: routeOrder({ phase: "active" }) }),
    launch: () =>
      launchPhase({
        command: process.execPath,
        protocol: "codex",
        args: emitRows(declinedCloseRows),
        cwd: process.cwd(),
        env: process.env,
        timeoutMs: 5000,
      }),
  });
  assert.equal(other.stop.reason, "dispatch-refused");
});

test("re-entry admits one host change, Codex to Claude for a current declined close, and refuses every other", async () => {
  const awaiting = { host: "codex", at: "2026-10-31T00:00:00.000Z" };
  const old = { host: "codex", awaitingClose: awaiting, factsAt: 1 };
  assert.equal(admittedHostChange(null, "claude", true), null);
  assert.equal(admittedHostChange({ host: "codex" }, "codex", true), null);
  const change = admittedHostChange(
    old,
    "claude",
    true,
    "2026-10-31T00:00:00.000Z",
  );
  assert.equal(change.from, "codex");
  assert.equal(change.to, "claude");
  assert.equal(change.phase, "release-close");
  assert.equal(change.cause, "awaiting-close");
  assert.equal(change.activation, "2026-10-31T00:00:00.000Z");
  assert.throws(
    () => admittedHostChange(old, "claude", true),
    /needs the activation it belongs to; pass null when the log records none/,
  );
  assert.equal(admittedHostChange(old, "claude", true, null).activation, null);
  const keeps = /^Error: Drive re-entry must keep its recorded host$/;
  assert.throws(
    () => admittedHostChange({ host: "codex" }, "claude", false),
    keeps,
  );
  // The decline must be the order's current fact, which the driver judges
  // once: a record stamped at an earlier log, or an order no longer closed,
  // admits no change.
  assert.throws(() => admittedHostChange(old, "claude", false), keeps);
  // A close the Claude host declined admits no host change at all.
  assert.throws(
    () =>
      admittedHostChange(
        { host: "claude", awaitingClose: { host: "claude" }, factsAt: 1 },
        "codex",
        true,
      ),
    /must keep its recorded host; a close the Claude host declined is attended in the launchpad's main checkout with resume: release close$/,
  );
  // The change covers one activation's close: under a later activation the
  // order drives on the host recorded before it and the ended change is
  // dropped; a change without an activation stamp is kept.
  const changedRecord = {
    host: "claude",
    hostChange: {
      from: "codex",
      to: "claude",
      phase: "release-close",
      activation: "2026-10-31T00:00:00.000Z",
    },
    awaitingClose: null,
  };
  assert.equal(
    recordedDrive(changedRecord, "2026-10-31T00:00:00.000Z", "closed"),
    changedRecord,
  );
  assert.deepEqual(
    recordedDrive(changedRecord, "2026-11-02T00:00:00.000Z", "active"),
    { host: "codex", hostChange: null, awaitingClose: null },
  );
  // A change without a stamp ends with the closed phase, so a reactivated
  // order is driven on the earlier host instead of being refused by both.
  const unstamped = {
    ...changedRecord,
    hostChange: { from: "codex", to: "claude", phase: "release-close" },
  };
  assert.equal(
    recordedDrive(unstamped, "2026-11-02T00:00:00.000Z", "closed"),
    unstamped,
  );
  assert.deepEqual(
    recordedDrive(unstamped, "2026-11-02T00:00:00.000Z", "active"),
    { host: "codex", hostChange: null, awaitingClose: null },
  );
  assert.equal(recordedDrive(null, "2026-10-31T00:00:00.000Z", "closed"), null);
  // While the change stands, the driver launches the close and nothing else.
  const refused = await driveLoop({
    record: {
      ...changedRecord,
      workOrder: "WO-999",
      attempts: [],
      incomplete: {},
    },
    status: () => ({ phase: "active", route: routeOrder({ phase: "active" }) }),
    launch: () => assert.fail("the host change admits release close alone"),
  });
  assert.equal(refused.stop.reason, "dispatch-refused");
  assert.match(
    refused.stop.next,
    /covers release close only, and this order now routes to next; drive it on its recorded host, --host codex/,
  );
  // The driver records the change and clears the stop it answers, before the
  // Claude close runs; a same-host re-entry keeps the stop.
  const base = realpathSync(
    createFixtureRoot(join(tmpdir(), "dotln-drive-host-change-")),
  );
  const previous = process.env.DOTLN_DRIVE_DEADLINE_AT;
  try {
    const f = fixture(base);
    f.mapClone();
    f.start();
    closeOrder(f);
    const eventCount = readFileSync(
      docPath(f.orderRoot, "orders", "WO-999.jsonl"),
      "utf8",
    )
      .split("\n")
      .filter(Boolean).length;
    const recordPath = join(f.main, "records/state/local/drives/WO-999.json");
    const seed = (extra) =>
      write(
        f.main,
        "records/state/local/drives/WO-999.json",
        JSON.stringify({
          schemaVersion: 1,
          workOrder: "WO-999",
          host: "codex",
          attempts: [],
          incomplete: {},
          factsAt: eventCount,
          ...extra,
        }),
      );
    process.env.DOTLN_DRIVE_DEADLINE_AT = String(Date.now() - 1000);
    seed({});
    await assert.rejects(
      runDrive(f.main, "WO-999", { host: "claude" }),
      /must keep its recorded host/,
    );
    seed({ awaitingClose: awaiting });
    const same = await runDrive(f.main, "WO-999", { host: "codex" });
    assert.equal(same.host, "codex");
    assert.deepEqual(same.awaitingClose, awaiting);
    assert.equal(same.hostChange, null);
    assert.equal(same.sandbox, "host");
    // A decline stamped at an earlier log is not carried into the re-entry.
    seed({ awaitingClose: awaiting, factsAt: eventCount - 1 });
    const moved = await runDrive(f.main, "WO-999", { host: "codex" });
    assert.equal(moved.awaitingClose, null);
    seed({ awaitingClose: awaiting, factsAt: eventCount - 1 });
    await assert.rejects(
      runDrive(f.main, "WO-999", { host: "claude" }),
      /must keep its recorded host/,
    );
    seed({ awaitingClose: awaiting });
    const changed = await runDrive(f.main, "WO-999", { host: "claude" });
    assert.equal(changed.host, "claude");
    assert.equal(changed.awaitingClose, null);
    assert.equal(changed.hostChange.from, "codex");
    assert.equal(changed.hostChange.to, "claude");
    assert.equal(changed.hostChange.phase, "release-close");
    assert.equal(typeof changed.hostChange.activation, "string");
    assert.equal(readDriveRecord(f.main, "WO-999").hostChange.to, "claude");
    assert.ok(existsSync(recordPath));
    // The admitted close completes on Claude and the record keeps the change.
    let released = false;
    const closed = await driveLoop({
      record: { ...changed, attempts: [] },
      status: () => ({
        phase: "closed",
        route: routeOrder({ phase: "closed", workOrderId: "WO-999" }, [], {
          merged: true,
          released,
        }),
      }),
      launch: (route) => {
        assert.equal(route.action, "release-close");
        released = true;
        return { exitCode: 0 };
      },
    });
    assert.equal(closed.stop.reason, "released");
    assert.equal(closed.hostChange.to, "claude");
    assert.deepEqual(
      drivenObservation(closed, () => false).hostChange,
      closed.hostChange,
    );
  } finally {
    if (previous === undefined) delete process.env.DOTLN_DRIVE_DEADLINE_AT;
    else process.env.DOTLN_DRIVE_DEADLINE_AT = previous;
    rmSync(base, { recursive: true, force: true });
  }
});

test("a release from before a reactivation does not hold the current activation", () => {
  const base = realpathSync(
    createFixtureRoot(join(tmpdir(), "dotln-drive-release-activation-")),
  );
  try {
    const f = fixture(base);
    const log = "records/state/orders/WO-999.jsonl";
    const row = (recordedAt) =>
      `${JSON.stringify({ type: "WorkOrderActivated", workOrderId: "WO-999", recordedAt })}\n`;
    write(f.main, log, row("2026-10-01T00:00:00.000Z"));
    git(f.main, "add", "-A");
    git(f.main, "commit", "-qm", "First activation");
    git(f.main, "tag", "v0.0.1");
    write(
      f.main,
      log,
      row("2026-10-01T00:00:00.000Z") + row("2026-10-30T00:00:00.000Z"),
    );
    git(f.main, "add", "-A");
    git(f.main, "commit", "-qm", "Reactivated");
    git(f.main, "tag", "v0.0.2");
    const first = { recordedAt: "2026-10-01T00:00:00.000Z" };
    const second = { recordedAt: "2026-10-30T00:00:00.000Z" };
    assert.equal(
      releaseHoldsActivation(f.main, "v0.0.1", "WO-999", first),
      true,
    );
    assert.equal(
      releaseHoldsActivation(f.main, "v0.0.1", "WO-999", second),
      false,
    );
    assert.equal(
      releaseHoldsActivation(f.main, "v0.0.2", "WO-999", second),
      true,
    );
    assert.equal(
      releaseHoldsActivation(f.main, "v0.0.1", "WO-998", first),
      false,
    );
  } finally {
    rmSync(base, { recursive: true, force: true });
  }
});

test("the phase capture keeps a declined or failed phase's raw stream and removes a clean one", async () => {
  const base = realpathSync(
    createFixtureRoot(join(tmpdir(), "dotln-drive-capture-")),
  );
  try {
    const run = (rows, exitCode = 0) =>
      launchPhase({
        command: process.execPath,
        protocol: "codex",
        args: [
          "-e",
          `for (const row of ${JSON.stringify(rows)}) console.log(JSON.stringify(row)); console.error("stderr text"); process.exitCode = ${exitCode};`,
        ],
        cwd: process.cwd(),
        env: process.env,
        timeoutMs: 5000,
        capture: { directory: join(base, "drives"), name: "phase" },
      });
    const clean = await run([{ type: "turn.completed", usage: {} }]);
    assert.equal(clean.retained, null);
    assert.equal(existsSync(join(base, "drives/phase.events.jsonl")), false);
    assert.equal(existsSync(join(base, "drives/phase.stderr.txt")), false);
    const declined = await run([
      {
        type: "item.completed",
        item: {
          type: "command_execution",
          command: "node scripts/resume.mjs verify",
          status: "declined",
          aggregated_output: "",
        },
      },
    ]);
    assert.equal(declined.cause, "native-permission-refused");
    assert.equal(
      declined.retained.events,
      join(base, "drives/phase.events.jsonl"),
    );
    assert.equal(
      declined.retained.stderr,
      join(base, "drives/phase.stderr.txt"),
    );
    assert.match(
      readFileSync(declined.retained.events, "utf8"),
      /"status":"declined"/,
    );
    assert.equal(
      readFileSync(declined.retained.stderr, "utf8"),
      "stderr text\n",
    );
    const failed = await run([{ type: "turn.completed", usage: {} }], 3);
    assert.equal(failed.exitCode, 3);
    assert.ok(failed.retained.events);
    // Only the files the phase wrote are named: a declined phase that printed
    // nothing on stderr retains its stream alone.
    const quiet = await launchPhase({
      command: process.execPath,
      protocol: "codex",
      args: emitRows(declinedCloseRows),
      cwd: process.cwd(),
      env: process.env,
      timeoutMs: 5000,
      capture: { directory: join(base, "drives"), name: "quiet" },
    });
    assert.equal(quiet.cause, "native-permission-refused");
    assert.ok(quiet.retained.events);
    assert.equal(quiet.retained.stderr, undefined);
    assert.equal(quiet.retained.captureFailed, undefined);
    // A capture that cannot be written leaves the phase to run and says so.
    writeFileSync(join(base, "not-a-directory"), "");
    const unwritable = await launchPhase({
      command: process.execPath,
      protocol: "codex",
      args: emitRows(declinedCloseRows),
      cwd: process.cwd(),
      env: process.env,
      timeoutMs: 5000,
      capture: { directory: join(base, "not-a-directory"), name: "phase" },
    });
    assert.equal(unwritable.cause, "native-permission-refused");
    assert.deepEqual(unwritable.retained, {
      source: "native-stdout-and-stderr",
      captureFailed: true,
    });
  } finally {
    rmSync(base, { recursive: true, force: true });
  }
});

test("the sandbox election maps to each host's documented launch form and refuses an undocumented one", () => {
  assert.deepEqual(sandboxLaunchForm("codex", "host").argv, [
    "--approve-for-me",
    "-c",
    "sandbox_workspace_write.network_access=true",
  ]);
  assert.deepEqual(sandboxLaunchForm("codex", "off").argv, [
    "--sandbox",
    "danger-full-access",
  ]);
  assert.equal(sandboxLaunchForm("codex", "off").selected.approval, "never");
  // One table holds every documented pair, with what each form selects.
  assert.deepEqual(Object.keys(SANDBOX_FORMS), ["codex", "claude"]);
  for (const host of Object.keys(SANDBOX_FORMS))
    assert.deepEqual(Object.keys(SANDBOX_FORMS[host]), ["host", "off"]);
  assert.equal(
    sandboxLaunchForm("codex", "host").selected.gitMetadataWrites,
    "one-command-host-permission-request",
  );
  assert.equal(
    sandboxLaunchForm("codex", "off").selected.gitMetadataWrites,
    "no-approval-under-full-access",
  );
  assert.equal(
    sandboxLaunchForm("claude", "host").selected.networkAccess,
    "native-api-context7-and-public-github-domains",
  );
  assert.equal(
    sandboxLaunchForm("claude", "off").selected.networkAccess,
    "unrestricted-by-the-disabled-launch-sandbox",
  );
  assert.deepEqual(sandboxLaunchForm("claude", "host").settings, {});
  assert.deepEqual(sandboxLaunchForm("claude", "off").settings, {
    enabled: false,
  });
  for (const [host, election] of [
    ["copilot", "off"],
    ["claude", "danger-full-access"],
    ["codex", "read-only"],
    ["constructor", "off"],
    ["codex", "__proto__"],
    ["codex", "constructor"],
  ])
    assert.throws(
      () => sandboxLaunchForm(host, election),
      new RegExp(
        `drive\\.sandbox "${election}" has no documented launch form on host "${host}"`,
      ),
    );
  const definition = { model: "m", effort: "xhigh", prompt: "ROLE" };
  const profile = nativeProfile({
    launchpad: "/launchpad",
    role: "executor",
    phrase: "resume: next",
    cwd: "/launchpad",
    worker: "worker",
    definition,
  });
  const settingsOf = (form) => {
    const args = claudeLaunchArgs({
      worker: "worker",
      definitions: "/agents.json",
      role: "executor",
      directories: ["/launchpad"],
      definition,
      profile,
      form,
      dollarLimit: null,
      phrase: "resume: next",
    });
    return JSON.parse(args[args.indexOf("--settings") + 1]);
  };
  assert.equal(
    settingsOf(sandboxLaunchForm("claude", "host")).sandbox.enabled,
    undefined,
  );
  assert.equal(
    settingsOf(sandboxLaunchForm("claude", "off")).sandbox.enabled,
    false,
  );
  assert.ok(
    settingsOf(sandboxLaunchForm("claude", "off")).sandbox.network
      .allowedDomains.length,
  );
});

test("a declined Codex phase retains its home's session files alone, a failed copy keeps the result, and the observed policy reads the phase's own rollout", () => {
  const base = realpathSync(
    createFixtureRoot(join(tmpdir(), "dotln-drive-codex-home-")),
  );
  try {
    const home = join(base, "home");
    const session = "01a19467-4fb9-7bc0-b5a6-f2012aadefa3";
    const rollout = `sessions/2026/10/31/rollout-2026-10-31T19-59-21-${session}.jsonl`;
    write(home, "auth.json", '{"token":"private-token"}');
    write(home, "config.toml", 'model = "m"\n');
    write(home, "session_index.jsonl", '{"id":"x"}\n');
    write(home, "shell_snapshots/snap.sh", "export PRIVATE=1\n");
    write(
      home,
      rollout,
      `${[
        JSON.stringify({ type: "session_meta", payload: { id: session } }),
        JSON.stringify({
          type: "turn_context",
          payload: {
            approval_policy: "on-request",
            approvals_reviewer: "auto_review",
            sandbox_policy: { type: "workspace-write", network_access: true },
          },
        }),
      ].join("\n")}\n`,
    );
    symlinkSync(join(home, "auth.json"), join(home, "sessions/auth-link.json"));
    const capture = {
      directory: join(base, "drives"),
      name: "release-close-1",
    };
    const retained = retainCodexHome(home, capture);
    assert.equal(retained.entries, 2);
    assert.equal(retained.source, "isolated-codex-home-sessions");
    assert.deepEqual(readdirSync(retained.path).sort(), [
      "session_index.jsonl",
      "sessions",
    ]);
    assert.match(
      readFileSync(join(retained.path, rollout), "utf8"),
      /workspace-write/,
    );
    // The link is copied as a link, never followed into the auth file.
    assert.equal(
      lstatSync(
        join(retained.path, "sessions/auth-link.json"),
      ).isSymbolicLink(),
      true,
    );
    assert.equal(
      JSON.stringify(readdirSync(retained.path, { recursive: true })).includes(
        "auth.json",
      ),
      false,
    );
    assert.equal(retainCodexHome(join(base, "missing"), capture), null);
    writeFileSync(join(base, "not-a-directory"), "");
    assert.deepEqual(
      retainCodexHome(home, {
        directory: join(base, "not-a-directory"),
        name: "x",
      }),
      {
        path: null,
        entries: 0,
        source: "isolated-codex-home-sessions",
        failed: "ENOTDIR",
      },
    );
    assert.deepEqual(codexObservedPolicy(home, session), {
      sandbox: "workspace-write",
      approval: "on-request",
      reviewer: "auto_review",
      sandboxSource: "codex-session-turn-context",
    });
    assert.deepEqual(codexObservedPolicy(home, "another-session"), {
      sandbox: null,
      approval: null,
      reviewer: null,
      sandboxSource: "codex-session-rollout-absent",
    });
    assert.equal(
      codexObservedPolicy(undefined, session).sandboxSource,
      "codex-session-rollout-absent",
    );
  } finally {
    rmSync(base, { recursive: true, force: true });
  }
});

test("a command's shape names the close and its publish flag with the order masked", () => {
  assert.deepEqual(
    commandShape(
      "/usr/local/bin/node /launchpad/scripts/release.mjs close WO-999 --publish",
    ),
    [["<operand>", "release.mjs", "close", "<operand>", "--publish"]],
  );
  assert.deepEqual(
    commandShape("node /launchpad/scripts/worktree.mjs integrate WO-999"),
    [["node", "worktree.mjs", "integrate", "<operand>"]],
  );
});

test("a failed native worker entry stops after one launch", async () => {
  let launches = 0;
  const event = {
    type: "item.completed",
    item: {
      type: "command_execution",
      command: "node '/fixture/scripts/drive.mjs' worker-entry",
      exit_code: 1,
      aggregated_output:
        "Drive stopped: Canonical lifecycle observation unavailable",
    },
  };
  const result = await driveLoop({
    record: { attempts: [], incomplete: {} },
    status: () => ({ phase: "active", route: routeOrder({ phase: "active" }) }),
    launch: async () => {
      launches++;
      const result = await launchPhase({
        command: process.execPath,
        protocol: "codex",
        args: ["-e", `console.log(${JSON.stringify(JSON.stringify(event))})`],
        env: process.env,
        cwd: process.cwd(),
        timeoutMs: 5000,
      });
      return {
        ...result,
        ...nativePhaseEntry(
          {
            phaseEntryReadback: () => ({
              entered: false,
              role: null,
              workOrder: null,
            }),
          },
          [["target", "launchpad"]],
          "fixture-native-thread",
          "executor",
          "WO-999",
        ),
      };
    },
  });
  assert.equal(launches, 1);
  assert.equal(result.stop.reason, "dispatch-refused");
  assert.deepEqual(result.incomplete, {});
});

test("recorded native entry survives a later compound gate failure without hiding a genuine dispatch refusal", async () => {
  const entered = { entered: true, role: "executor", workOrder: "WO-999" };
  const host = { phaseEntryReadback: () => entered };
  const entry = nativePhaseEntry(
    host,
    [
      ["launchpad", "launchpad"],
      ["target", "launchpad"],
    ],
    "fixture-native-thread",
    "executor",
    "WO-999",
  );
  assert.equal(entry.entry.complete, true);
  const event = {
    type: "item.completed",
    item: {
      type: "command_execution",
      command:
        "node scripts/drive.mjs worker-entry > /dev/null && node scripts/target-gate.mjs WO-999",
      exit_code: 1,
      aggregated_output: "private failing gate output",
    },
  };
  const transport = await launchPhase({
    command: process.execPath,
    protocol: "codex",
    args: ["-e", `console.log(${JSON.stringify(JSON.stringify(event))})`],
    env: process.env,
    cwd: process.cwd(),
    timeoutMs: 5000,
  });
  assert.equal(transport.refused, undefined);
  assert.equal(JSON.stringify(transport).includes("private"), false);
  let phase = "active";
  const actions = [];
  const result = await driveLoop({
    record: { attempts: [], incomplete: {} },
    stopAt: "verified",
    status: () => ({ phase, route: routeOrder({ phase }) }),
    launch: (route) => {
      actions.push(route.action);
      phase = route.action === "next" ? "ready-to-verify" : "verified";
      return { ...transport, ...entry };
    },
  });
  assert.deepEqual(actions, ["next", "verify"]);
  assert.equal(result.stop.reason, "fixture-endpoint");
  const refusal = await driveLoop({
    record: { attempts: [], incomplete: {} },
    status: () => ({ phase: "active", route: routeOrder({ phase: "active" }) }),
    launch: () => ({
      ...transport,
      refused: "genuine lifecycle dispatch refusal",
      ...entry,
    }),
  });
  assert.equal(refusal.stop.reason, "dispatch-refused");
  const partial = nativePhaseEntry(
    {
      phaseEntryReadback: (checkout) =>
        checkout === "target" ? { ...entered, entered: false } : entered,
    },
    [
      ["launchpad", "launchpad"],
      ["target", "launchpad"],
    ],
    "fixture-native-thread",
    "executor",
    "WO-999",
  );
  assert.equal(partial.entry.complete, false);
  assert.ok(partial.refused);
  assert.equal(
    nativePhaseEntry(
      host,
      [["main", "main"]],
      "fixture-native-thread",
      "release-close",
      "WO-999",
    ).entry.complete,
    false,
    "a different role cannot reuse executor entry",
  );
  assert.equal(
    nativePhaseEntry(
      { phaseEntryReadback: () => ({ ...entered, role: "release-close" }) },
      [["main", "main"]],
      "fixture-native-thread",
      "release-close",
      "WO-999",
    ).entry.complete,
    true,
    "release close requires only main",
  );
});

test("interrupted drive evidence preserves current observations separately from completed attempts", () => {
  const command = { kind: "lifecycle", status: "completed", exitCode: 0 };
  const row = drivenObservation(
    {
      running: true,
      driverPid: 12,
      attempts: [{ action: "next" }],
      incomplete: { verify: 1 },
      worker: {
        id: "worker",
        sessionId: "native",
        pid: 13,
        role: "verifier",
        action: "verify",
        running: true,
        lastCommand: command,
        commandFailures: Array(20).fill({
          kind: "unclassified-shell",
          status: "failed",
          exitCode: 1,
        }),
        prompt: "private narrative",
      },
    },
    () => false,
  );
  assert.equal(row.completedAttempts, 1);
  assert.equal(row.recordedRunning, true);
  assert.equal(row.observedDriverAlive, false);
  assert.deepEqual(row.incomplete, { verify: 1 });
  assert.equal(row.currentWorker.role, "verifier");
  assert.equal(row.currentWorker.recordedRunning, true);
  assert.equal(row.currentWorker.observedAlive, false);
  assert.deepEqual(row.currentWorker.lastCommand, command);
  assert.equal(row.currentWorker.commandFailures.length, 16);
  assert.equal(Object.hasOwn(row.currentWorker, "workerEnded"), false);
  assert.equal(Object.hasOwn(row.currentWorker, "usage"), false);
  assert.equal(JSON.stringify(row).includes("private"), false);
  assert.equal(
    drivenObservation(null, () => true),
    null,
  );
});

test("live completion evidence retains both gates and rejects a missing or failed document row", () => {
  const targetGate = {
    repositoryId: "target",
    treeHash: "target-tree",
    evidenceRef: "target-row",
  };
  const documentGate = {
    treeHash: "document-tree",
    codeIdentity: "code",
    evidenceRef: "document-row",
    executed: true,
    exitCode: 0,
  };
  const events = [
    { type: "ImplementationReady", evidence: { targetGate, documentGate } },
    {
      type: "VerificationCompleted",
      verdict: "pass",
      evidence: { targetGate, documentGate },
    },
    {
      type: "FinalReviewCompleted",
      verdict: "pass",
      evidence: { targetGate, documentGate },
    },
  ];
  const rows = drivenCompletions(events);
  requireDrivenGates(rows);
  assert.deepEqual(
    rows.map((row) => row.documentGate),
    [documentGate, documentGate, documentGate],
  );
  for (const bad of [
    null,
    { ...documentGate, exitCode: 1 },
    { ...documentGate, executed: false },
    { ...documentGate, codeIdentity: null },
  ])
    assert.throws(
      () => requireDrivenGates([{ ...rows[0], documentGate: bad }]),
      /document gate evidence/,
    );
  assert.throws(
    () => requireDrivenGates([{ ...rows[0], targetGate: null }]),
    /target gate evidence/,
  );
});

for (const protocol of ["codex", "claude"])
  test(`${protocol} research evidence excludes shell status transformations`, async () => {
    const commands = [
      "! npx ctx7@latest docs /nodejs/node readFileSync",
      "npx ctx7@latest docs /nodejs/node readFileSync &",
      "! /bin/zsh -lc 'npx ctx7@latest docs /nodejs/node readFileSync'",
      "npx ctx7@latest docs /nodejs/node readFileSync; true",
    ];
    const rows = commands.flatMap((command, index) =>
      protocol === "codex"
        ? [
            {
              type: "item.completed",
              item: {
                type: "command_execution",
                command,
                status: "completed",
                exit_code: 0,
              },
            },
          ]
        : [
            {
              message: {
                content: [
                  {
                    type: "tool_use",
                    id: String(index),
                    name: "Bash",
                    input: { command },
                  },
                ],
              },
            },
            {
              message: {
                content: [
                  {
                    type: "tool_result",
                    tool_use_id: String(index),
                    is_error: false,
                    content: "",
                  },
                ],
              },
            },
          ],
    );
    const result = await launchPhase({
      command: process.execPath,
      protocol,
      args: [
        "-e",
        `for (const row of ${JSON.stringify(rows)}) console.log(JSON.stringify(row));`,
      ],
      cwd: process.cwd(),
      env: process.env,
      timeoutMs: 5000,
    });
    assert.equal(result.commandResults.length, commands.length);
    assert.ok(
      result.commandResults.every((row) => row.kind === "unclassified-shell"),
    );
    assert.throws(() => requireDrivenResearch([result]), /lacks a successful/);
  });

test("research evidence rejects compound commands and missing or failed lookups", () => {
  for (const command of [
    "! npx ctx7@latest docs /nodejs/node readFileSync",
    "npx ctx7@latest docs /nodejs/node readFileSync &",
    "! /bin/zsh -lc 'npx ctx7@latest docs /nodejs/node readFileSync'",
    "if npx ctx7@latest docs /nodejs/node readFileSync; then :; fi",
    "gh repo view --help",
    "gh search repos --help",
    "gh repo view upstash/context7 --help",
    "npx ctx7@latest library Node.js --help",
    "npx ctx7@latest docs --help query",
    "npx ctx7@latest docs /nodejs/node query --help",
    "gh search repos node --web",
    'curl --fail --silent --show-error --max-time 60 "https://api.github.com/repos/upstash/context7"',
    'curl --disable --fail --silent --show-error --max-time 60 "https://api.github.com/repos/upstash/context7" --output result.json',
    'curl --disable --fail --silent --show-error --max-time 60 "https://api.github.com/repos/upstash/context7" -H Authorization:secret',
    'curl --disable --fail --silent --show-error --max-time 60 "https://example.invalid/repos/upstash/context7"',
    'curl --disable --fail --silent --show-error --max-time 60 "https://api.github.com/search/repositories?q=context7&per_page=0"',
    'curl --disable --fail --silent --show-error --max-time 60 "https://api.github.com/search/repositories?q=context7&per_page=1&unknown=value"',
    'curl --disable --fail --silent --show-error --max-time 60 "https://api.github.com/search/repositories?q=$QUERY&per_page=1"',
    'curl --disable --fail --silent --show-error --max-time 60 "https://api.github.com/search/repositories?q={context7,context8}&per_page=1"',
    'curl --disable --fail --silent --show-error --max-time 60 "https://api.github.com/search/repositories?q=context[1-9]&per_page=1"',
    'curl --disable --fail --silent --show-error --max-time 60 "https://api.github.com/search/repositories?q=context7"\u0026"per_page=1"',
  ])
    assert.equal(researchCommandKind(command), null, command);
  assert.equal(
    researchCommandKind(
      'npx ctx7@latest library "Node.js" "readFileSync utf8 encoding"',
    ),
    "context7-library",
  );
  assert.equal(
    researchCommandKind(
      "/bin/zsh -lc 'npx ctx7@latest docs /nodejs/node readFileSync'",
    ),
    "context7-docs",
  );
  assert.equal(
    researchCommandKind("npx ctx7@latest docs /nodejs/node readFileSync; true"),
    null,
  );
  assert.equal(
    researchCommandKind(
      'echo "npx ctx7@latest docs /nodejs/node readFileSync"',
    ),
    null,
  );
  assert.equal(
    researchCommandKind('gh search repos "repo:upstash/context7" --limit 1'),
    "github-search",
  );
  assert.equal(
    researchCommandKind("gh repo view upstash/context7"),
    "github-read",
  );
  for (const [url, kind] of [
    ["https://api.github.com/repos/upstash/context7", "github-read"],
    [
      "https://api.github.com/search/repositories?q=context7+user:upstash&per_page=1",
      "github-search",
    ],
  ])
    assert.equal(
      researchCommandKind(
        `curl --disable --fail --silent --show-error --max-time 60 "${url}"`,
      ),
      kind,
    );
  const commandResults = [
    "context7-library",
    "context7-docs",
    "github-search",
    "github-read",
    "public-web",
  ].map((kind) => ({ kind, status: "completed", exitCode: 0 }));
  requireDrivenResearch([{ commandResults }]);
  for (let index = 0; index < commandResults.length; index++) {
    assert.throws(
      () =>
        requireDrivenResearch([
          { commandResults: commandResults.filter((_, i) => i !== index) },
        ]),
      /lacks a successful/,
    );
    assert.throws(
      () =>
        requireDrivenResearch([
          {
            commandResults: commandResults.map((row, i) =>
              i === index ? { ...row, status: "failed", exitCode: 1 } : row,
            ),
          },
        ]),
      /lacks a successful/,
    );
  }
});

test("Codex tool environment selects launcher Node and finishes isolation after setup failure", async () => {
  const root = createFixtureRoot(join(tmpdir(), "dotln-drive-setup-"));
  try {
    write(root, "package.json", '{"type":"module"}');
    const marker = join(root, "finished");
    const captured = join(root, "arguments.json");
    write(
      root,
      "packages/skeleton/dist/src/worker-transport.js",
      `
      import { writeFileSync } from "node:fs";
      export const startCodexEpisode = () => ({ env: {}, finish() { writeFileSync(${JSON.stringify(marker)}, "finished"); } });
      export const codexExecArgv = ({rest}) => { writeFileSync(${JSON.stringify(captured)}, JSON.stringify(rest)); throw new Error("synthetic argument setup failure"); };
    `,
    );
    // The election is the caller's to supply; a launch without it refuses
    // before any host process starts.
    await assert.rejects(
      launchRole({
        host: "codex",
        launchpad: root,
        role: "executor",
        definition: { model: "test", effort: "max", prompt: "" },
        env: { PATH: "/synthetic/other-tools" },
      }),
      /launchRole requires the drive's sandbox election, host or off/,
    );
    assert.equal(existsSync(marker), false);
    await assert.rejects(
      launchRole({
        host: "codex",
        launchpad: root,
        role: "executor",
        definition: { model: "test", effort: "max", prompt: "" },
        env: { PATH: "/synthetic/other-tools" },
        sandbox: "host",
      }),
      /synthetic argument setup failure/,
    );
    assert.equal(readFileSync(marker, "utf8"), "finished");
    const args = JSON.parse(readFileSync(captured, "utf8"));
    const setting = args.findIndex((arg) =>
      arg.startsWith("shell_environment_policy.set.PATH="),
    );
    assert.ok(setting > 0);
    assert.equal(args[setting - 1], "-c");
    assert.equal(
      JSON.parse(args[setting].slice(args[setting].indexOf("=") + 1)),
      [dirname(process.execPath), "/synthetic/other-tools"].join(delimiter),
    );
    const instructions = JSON.parse(
      args
        .find((arg) => arg.startsWith("developer_instructions="))
        .slice("developer_instructions=".length),
    );
    assert.match(instructions, /completion's intent-to-add check/);
    assert.match(
      instructions,
      /normal one-invocation outside-sandbox approval/,
    );
    assert.match(
      instructions,
      /If the host denies the request, stop without retrying/,
    );
    assert.ok(
      instructions.includes(
        `For every lifecycle command, use node ${shellQuote(join(root, "scripts/resume.mjs"))}`,
      ),
    );
    assert.match(
      instructions,
      /including when the shared skill spells npm run resume/,
    );
    // The election selects the documented form: automatic review under
    // workspace-write by default, full access under off, never both.
    assert.ok(args.includes("--approve-for-me"));
    assert.ok(args.includes("sandbox_workspace_write.network_access=true"));
    assert.ok(!args.includes("danger-full-access"));
    await assert.rejects(
      launchRole({
        host: "codex",
        launchpad: root,
        role: "executor",
        definition: { model: "test", effort: "max", prompt: "" },
        phrase: "resume: next",
        env: { PATH: "/synthetic/other-tools" },
        sandbox: "off",
      }),
      /synthetic argument setup failure/,
    );
    const unsandboxed = JSON.parse(readFileSync(captured, "utf8"));
    // The worker's text follows the election: no approval request under
    // full access.
    const unsandboxedInstructions = JSON.parse(
      unsandboxed
        .find((arg) => arg.startsWith("developer_instructions="))
        .slice("developer_instructions=".length),
    );
    assert.match(unsandboxedInstructions, /full access and no approval step/);
    assert.doesNotMatch(
      unsandboxedInstructions,
      /normal one-invocation outside-sandbox approval/,
    );
    assert.deepEqual(unsandboxed.slice(0, 2), [
      "--sandbox",
      "danger-full-access",
    ]);
    assert.ok(!unsandboxed.includes("--approve-for-me"));
    assert.ok(
      !unsandboxed.some(
        (arg) => typeof arg === "string" && arg.includes("network_access"),
      ),
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("router termination ends a nested phase before its records are removed", async () => {
  const base = realpathSync(
    createFixtureRoot(join(tmpdir(), "dotln-drive-cancel-")),
  );
  const alive = (pid) => {
    try {
      process.kill(pid, 0);
      return true;
    } catch (error) {
      if (error.code === "ESRCH") return false;
      throw error;
    }
  };
  const waitFor = async (predicate) => {
    const until = Date.now() + 7000;
    while (!predicate() && Date.now() < until)
      await new Promise((done) => setTimeout(done, 25));
    assert.ok(predicate(), "owned process must reach the observed boundary");
  };
  const owned = [];
  try {
    const f = fixture(base);
    f.mapClone();
    f.start();
    for (const detachedDriver of [false, true]) {
      const pidFile = join(base, `phase-${detachedDriver}`);
      const driverPid = join(base, `driver-${detachedDriver}`);
      const ended = join(base, `ended-${detachedDriver}`);
      const driver = join(base, `driver-${detachedDriver}.mjs`);
      writeFileSync(
        driver,
        `
        import { writeFileSync } from "node:fs";
        import { runDrive } from ${JSON.stringify(new URL("./lib/drive-session.mjs", import.meta.url).href)};
        import { launchPhase } from ${JSON.stringify(new URL("./lib/drive-transport.mjs", import.meta.url).href)};
        writeFileSync(${JSON.stringify(driverPid)}, String(process.pid));
        await runDrive(${JSON.stringify(f.main)}, "WO-999", {}, async (root, order, { signal }) =>
          launchPhase({ command: process.execPath, args: ["-e", ${JSON.stringify(`require('node:fs').writeFileSync(${JSON.stringify(pidFile)},String(process.pid));setInterval(()=>{},1000)`)}],
            cwd: root, env: process.env, timeoutMs: 30000, signal }));
        writeFileSync(${JSON.stringify(ended)}, "observed");
      `,
      );
      const args = detachedDriver
        ? [
            "-e",
            `require('node:child_process').spawn(process.execPath,[${JSON.stringify(driver)}],{detached:true,stdio:'ignore',env:process.env}).unref();setInterval(()=>{},1000)`,
          ]
        : [driver];
      await launchPhase({
        command: process.execPath,
        args,
        cwd: f.main,
        env: f.env,
        timeoutMs: 15000,
        onSpawn: async (pid) => {
          await waitFor(() => existsSync(pidFile));
          owned.push(
            Number(readFileSync(pidFile)),
            Number(readFileSync(driverPid)),
          );
          process.kill(pid, "SIGKILL");
        },
      });
      await waitFor(() => !alive(Number(readFileSync(pidFile))));
      if (detachedDriver) await waitFor(() => existsSync(ended));
      await waitFor(() => !alive(Number(readFileSync(driverPid))));
      assert.equal(
        existsSync(pidFile),
        true,
        "records survive until the phase ended",
      );
    }
  } finally {
    for (const pid of owned)
      if (alive(pid)) {
        try {
          process.kill(pid, "SIGKILL");
        } catch {}
      }
    rmSync(base, { recursive: true, force: true });
  }
});

test("native failure observations retain event counts and signals without raw diagnostics", async () => {
  const rows = [
    { type: "error", message: "private endpoint ETIMEDOUT" },
    { type: "error", message: "private diagnostic" },
    { type: "turn.failed", error: { message: "private token rate limit 429" } },
  ];
  const result = await launchPhase({
    command: process.execPath,
    protocol: "codex",
    args: [
      "-e",
      `for (const row of ${JSON.stringify(rows)}) console.log(JSON.stringify(row)); console.error("private endpoint ENOTFOUND"); process.exitCode = 1;`,
    ],
    cwd: process.cwd(),
    env: process.env,
    timeoutMs: 5000,
  });
  assert.equal(result.exitCode, 1);
  assert.equal(result.exitSignal, null);
  assert.equal(result.error, true);
  assert.equal(
    result.cause,
    undefined,
    "lexical signals do not invent a causal classification",
  );
  assert.equal(result.refused, undefined);
  assert.deepEqual(result.nativeDiagnostics, [
    {
      source: "error",
      count: 2,
      provenance: "message-pattern",
      nonemptyMessages: 2,
      unclassifiedCount: 1,
      signals: ["network-timeout"],
    },
    {
      source: "turn.failed",
      count: 1,
      provenance: "message-pattern",
      nonemptyMessages: 1,
      unclassifiedCount: 0,
      signals: ["quota"],
    },
    {
      source: "stderr-tail",
      count: 1,
      provenance: "message-pattern",
      nonemptyMessages: 1,
      unclassifiedCount: 0,
      signals: ["network-resolution"],
    },
  ]);
  assert.equal(JSON.stringify(result).includes("private"), false);
});

test("native error-item diagnostics distinguish unmatched and absent messages without changing routing", async () => {
  const messages = [
    "context_length_exceeded private detail",
    "You have hit your usage limit: private detail",
    "Authentication failed: private detail",
    "Server overloaded: private detail",
    "stream disconnected before completion: private detail",
    "private unmatched detail",
    "",
    undefined,
  ];
  const rows = messages.map((message) => ({
    type: "item.completed",
    item: { type: "error", message },
  }));
  const result = await launchPhase({
    command: process.execPath,
    protocol: "codex",
    args: [
      "-e",
      `for (const row of ${JSON.stringify(rows)}) console.log(JSON.stringify(row));`,
    ],
    cwd: process.cwd(),
    env: process.env,
    timeoutMs: 5000,
  });
  assert.equal(result.exitCode, 0);
  assert.equal(
    result.error,
    false,
    "a nonfatal error item does not become a failed turn",
  );
  assert.equal(result.cause, undefined);
  assert.equal(result.refused, undefined);
  assert.deepEqual(result.nativeDiagnostics, [
    {
      source: "item.error",
      count: 8,
      provenance: "message-pattern",
      nonemptyMessages: 6,
      unclassifiedCount: 3,
      signals: [
        "context-limit",
        "usage-limit",
        "authentication",
        "provider-unavailable",
        "stream-disconnected",
      ],
    },
  ]);
  assert.equal(JSON.stringify(result).includes("private"), false);
});

test("native termination retains its observed signal", async () => {
  const result = await launchPhase({
    command: process.execPath,
    args: ["-e", 'process.kill(process.pid, "SIGTERM")'],
    cwd: process.cwd(),
    env: process.env,
    timeoutMs: 5000,
  });
  assert.equal(result.exitCode, null);
  assert.equal(result.exitSignal, "SIGTERM");
  assert.equal(result.workerEnded, true);
  assert.equal(result.error, true);
});

test("Claude native diagnostic availability counts message text rather than JSON wrappers", async () => {
  for (const fields of [
    {},
    { errors: [], result: "" },
    { errors: ["", " "] },
    { errors: ["private authentication failed"], result: "" },
  ]) {
    const row = { type: "result", is_error: true, ...fields };
    const result = await launchPhase({
      command: process.execPath,
      args: ["-e", `console.log(${JSON.stringify(JSON.stringify(row))});`],
      cwd: process.cwd(),
      env: process.env,
      timeoutMs: 5000,
    });
    const present = fields.errors?.some((value) => value.trim()) ?? false;
    assert.deepEqual(result.nativeDiagnostics, [
      {
        source: "result-error",
        count: 1,
        provenance: "message-pattern",
        nonemptyMessages: present ? 1 : 0,
        unclassifiedCount: present ? 0 : 1,
        signals: present ? ["authentication"] : [],
      },
    ]);
    assert.equal(JSON.stringify(result).includes("private"), false);
  }
});

test("native execution diagnostics retain only a typed cause", async () => {
  const row = {
    type: "result",
    is_error: true,
    total_cost_usd: 0,
    errors: [
      "Connection error contacting private endpoint with private credential",
    ],
    usage: { input_tokens: 0, output_tokens: 0 },
  };
  const result = await launchPhase({
    command: process.execPath,
    args: ["-e", `console.log(${JSON.stringify(JSON.stringify(row))})`],
    cwd: process.cwd(),
    env: process.env,
    timeoutMs: 5000,
  });
  assert.equal(result.cause, "native-network-failure");
  assert.equal(JSON.stringify(result).includes("private"), false);
});

for (const [cause, diagnostic] of [
  [
    "native-proxy-tunnel-refused",
    "API Error: ERR_PROXY_TUNNEL; proxy refused the tunnel",
  ],
  [
    "native-provider-safeguard",
    "API Error: safeguards flagged this session [cyber]; private request identifier",
  ],
])
  test(`${cause} stops before another worker is launched`, async () => {
    let launches = 0;
    const row = {
      type: "result",
      is_error: true,
      result: diagnostic,
      total_cost_usd: 0,
    };
    const result = await driveLoop({
      record: { attempts: [], incomplete: {} },
      status: () => ({
        phase: "active",
        route: routeOrder({ phase: "active" }),
      }),
      launch: () => {
        launches++;
        return launchPhase({
          command: process.execPath,
          args: ["-e", `console.log(${JSON.stringify(JSON.stringify(row))})`],
          cwd: process.cwd(),
          env: process.env,
          timeoutMs: 5000,
        });
      },
    });
    assert.equal(launches, 1);
    assert.equal(result.stop.reason, "dispatch-refused");
    assert.equal(result.attempts[0].cause, cause);
    assert.equal(JSON.stringify(result).includes("private"), false);
  });
