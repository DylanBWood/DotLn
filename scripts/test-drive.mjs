import test from "./lib/test-shards.mjs";
import assert from "node:assert/strict";
import {
  chmodSync,
  cpSync,
  lstatSync,
  mkdirSync,
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
  driveRecordPath,
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
  COMMAND_SHAPE_VERSION,
  REFUSAL_CODES,
  commandShape,
  judgedShape,
  lifecycleRefusal,
  lifecycleRefusalReason,
  refusalFindings,
  refusalWithReason,
  withoutAbsolutePaths,
} from "./lib/drive-diagnostics.mjs";
import { stopRefusal } from "../packages/skeleton/src/stops.mjs";
import {
  driveAccount,
  readDriveAccount,
  stopNeedsAccount,
} from "./lib/drive-account.mjs";
import {
  PHASE_LEGAL_ACTIONS,
  STATE_LEGAL_ACTIONS,
} from "./lib/lifecycle-actions.mjs";
import { main as driveMain, printedResult } from "./drive.mjs";
import {
  nativeProfile,
  phaseWorkerNotes,
  targetLaneClause,
  targetLaneForms,
} from "./lib/drive-prompts.mjs";
import {
  deniedTool,
  printedRejection,
  redactReason,
  streamObservation,
} from "./lib/drive-stream.mjs";
import { beginGateRun } from "./lib/gate-evidence.mjs";
import {
  BACKGROUND_WAIT_CEILING,
  admitWorker,
  admittedHostChange,
  attemptTimeLimit,
  backgroundWait,
  driveLoop,
  driveStatus,
  phaseEnvironment,
  settleAttempt,
  recordedDrive,
  runDrive,
  phaseDefinition,
  nativePhaseEntry,
  phaseTimeLimit,
  awaitingMergeStop,
  unenforceableLimit,
  workerObservers,
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
import {
  fetchIntoCheckout,
  fetchRemoteBranch,
  remoteBranchCommit,
  REMOTE_FETCH_TIMEOUT_MS,
} from "./lib/github-repository.mjs";
import { originTags } from "./lib/release-tags.mjs";
import { write } from "./lib/helpers.mjs";
import {
  SANDBOX_FORMS,
  claudeLaunchArgs,
  codexObservedPolicy,
  driveHost,
  launchRole,
  nativeLaunchDirectories,
  releaseCloseAllowRules,
  retainCodexHome,
  sandboxLaunchForm,
} from "./lib/drive-worker.mjs";
import { releaseCloseCommand, runGit, shellQuote } from "./lib/git.mjs";
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

test("WO-287 criterion A4: the driver starts a phase past the drive's budget where the budget's stop advises, counting the use and saying so, and withholds it where the stop refuses", async () => {
  const base = realpathSync(
    createFixtureRoot(join(tmpdir(), "dotln-drive-budget-stop-")),
  );
  const said = [];
  const error = console.error;
  console.error = (...args) => said.push(args.join(" "));
  try {
    const budget = await import(
      new URL(
        "../packages/skeleton/dist/src/subagent-budget.js",
        import.meta.url,
      )
    );
    // A launchpad whose one line sets the level, and a drive whose budget
    // its first phase worker is already past.
    const drive = (name, config, limits = { cap: 0, ceiling: 0 }) => {
      const launchpad = join(base, name);
      write(launchpad, "dotln.config.json", JSON.stringify(config));
      const directory = join(launchpad, "drives");
      mkdirSync(directory, { recursive: true });
      const session = `drive-${name}`;
      assert.equal(budget.initializeSubagentCounter(directory, session), null);
      const record = { exhausted: false };
      const state = { saved: 0 };
      return {
        state,
        record,
        saveRecord: () => (state.saved += 1),
        budget,
        trees: { launchpad },
        directory,
        session,
        ...limits,
      };
    };
    const uses = (given) =>
      budget.subagentUsage(
        given.trees.launchpad,
        given.directory,
        given.session,
      ).count;

    // The same budget, met by the admissions a Codex worker reports after
    // the fact: each child is counted, and what the driver does about a
    // budget they passed follows the stop's level.
    const observed = (given) => {
      given.record.worker = { sessionId: "native-session" };
      return workerObservers(given, {
        worker: "worker-1",
        route: {},
        context: join(given.directory, "context.json"),
      }).onSubagent({
        id: "call-1",
        sender: "native-session",
        children: ["child-1"],
      });
    };

    // Core's level, and an instance that sets the stop to refuse: withheld.
    const refusing = { version: 1, stops: { "driven-budget": "refuse" } };
    for (const [name, config] of [
      ["core", { version: 1 }],
      ["refuse", refusing],
    ]) {
      const given = drive(name, config);
      const answer = admitWorker(given, "worker-1");
      assert.match(answer.refused, /^DOTLN_SUBAGENT_CAP_REFUSED: /u, name);
      assert.ok(
        answer.refused.includes("This is stop driven-budget, which protects "),
        answer.refused,
      );
      assert.doesNotMatch(answer.refused, /operator override/u, name);
      assert.equal(given.record.exhausted, true, name);
      assert.equal(given.state.saved, 1, name);
      assert.equal(uses(given), 0, name);
      // A child the worker reports is counted, and further work stops.
      given.record.exhausted = false;
      assert.match(
        observed(given),
        /^Observed Codex admissions exceeded the declared role-text budget; further work stopped\.$/u,
        name,
      );
      assert.equal(given.record.exhausted, true, name);
      assert.equal(uses(given), 1, name);
    }
    assert.deepEqual(said, []);

    // Set to advise: the phase starts, its use is counted and the drive
    // says what it passed, naming the stop and the line that refuses it.
    const advising = drive("advise", {
      version: 1,
      stops: { "driven-budget": "advise" },
    });
    assert.equal(admitWorker(advising, "worker-1"), undefined);
    assert.equal(advising.record.exhausted, false);
    assert.equal(advising.state.saved, 0);
    assert.equal(uses(advising), 1);
    // A child it reports is counted and stops nothing. It is the first the
    // worker launched, past the cap of none for each agent, which the drive
    // says; the drive's ceiling was passed at the admission and said there.
    assert.equal(observed(advising), undefined);
    assert.equal(advising.record.exhausted, false);
    assert.equal(uses(advising), 2);
    assert.equal(said.length, 2, said.join("\n"));
    for (const line of said) {
      assert.match(line, /^DotLn advisory: /u);
      assert.ok(
        line.includes(
          "Stop driven-budget advises in this root and the work goes on; it protects ",
        ) &&
          line.includes(
            '"stops": { "driven-budget": "refuse" } in dotln.config.json',
          ),
        line,
      );
    }
    assert.match(said[1], /past the drive's cap of 0 uses for each agent/u);

    // An exported instance with no line advises by default.
    const instance = drive("instance", { version: 1 });
    write(instance.trees.launchpad, "KIT-MANIFEST.json", "{}\n");
    assert.equal(admitWorker(instance, "worker-1"), undefined);
    assert.equal(uses(instance), 1);
    assert.equal(said.length, 3, said.join("\n"));

    // Within its budget the same admission says nothing at any level.
    const within = drive("within", refusing, { cap: 2, ceiling: 8 });
    assert.equal(admitWorker(within, "worker-1"), undefined);
    assert.equal(uses(within), 1);
    assert.equal(said.length, 3);
  } finally {
    console.error = error;
    rmSync(base, { recursive: true, force: true });
  }
});

test("WO-287 criterion A4: a phase admitted within the drive's budget whose Codex worker then reports helpers past a limit is told once for each limit, at the report that passes it, where the budget's stop advises; nothing is said at off, and further work stops at refuse", async () => {
  const base = realpathSync(
    createFixtureRoot(join(tmpdir(), "dotln-drive-observed-budget-")),
  );
  const said = [];
  const error = console.error;
  console.error = (...args) => said.push(args.join(" "));
  try {
    const budget = await import(
      new URL(
        "../packages/skeleton/dist/src/subagent-budget.js",
        import.meta.url,
      )
    );
    // A phase admitted within the budget, then the reports its worker makes,
    // each answered and followed by what the drive had said by then. A use
    // the worker makes through the kit's commands first is charged as the
    // review helper charges it in a driven session.
    let drives = 0;
    const drive = (level, limits, reports, kitLaunches = 0) => {
      const launchpad = join(base, `drive-${++drives}`);
      write(
        launchpad,
        "dotln.config.json",
        JSON.stringify({ version: 1, stops: { "driven-budget": level } }),
      );
      const directory = join(launchpad, "drives");
      mkdirSync(directory, { recursive: true });
      const session = `drive-${level}`;
      assert.equal(budget.initializeSubagentCounter(directory, session), null);
      const given = {
        record: { exhausted: false },
        saveRecord: () => {},
        budget,
        trees: { launchpad },
        directory,
        session,
        ...limits,
      };
      said.length = 0;
      assert.equal(admitWorker(given, "worker-1"), undefined, level);
      assert.deepEqual(said, [], level);
      for (let launch = 1; launch <= kitLaunches; launch++)
        assert.equal(
          budget.admitSubagentTool(
            launchpad,
            directory,
            {
              session_id: session,
              tool_use_id: `worker-1:worker-review:${launch}`,
            },
            false,
            {
              kit: { uses: 1, host: "codex" },
              cap: limits.ceiling,
              spawnerCap: limits.cap,
              spawner: "worker-1",
              enforce: false,
            },
          ).exceeded,
          undefined,
          `kit launch ${launch} is within the budget`,
        );
      given.record.worker = { sessionId: "worker-session" };
      const observers = workerObservers(given, {
        worker: "worker-1",
        route: {},
        context: join(directory, "context.json"),
      });
      const answers = reports.map(([id, sender, children]) => ({
        answer: observers.onSubagent({ id, sender, children }),
        said: said.length,
      }));
      return { given, answers };
    };
    const advises = (line) =>
      line.startsWith("DotLn advisory: ") &&
      line.includes(
        "Stop driven-budget advises in this root and the work goes on; it protects ",
      ) &&
      line.includes(
        '"stops": { "driven-budget": "refuse" } in dotln.config.json',
      );

    // A cap of one helper for each agent: the worker's second helper passes
    // it, and so do the two a helper of its own launches at once; the same
    // report again, and a third helper of the worker, say nothing more.
    const capped = drive("advise", { cap: 1, ceiling: 8 }, [
      ["call-1", "worker-session", ["child-1"]],
      ["call-2", "worker-session", ["child-2"]],
      ["call-2", "worker-session", ["child-2"]],
      ["call-3", "worker-session", ["child-3"]],
      ["call-4", "helper-session", ["grandchild-1", "grandchild-2"]],
    ]);
    assert.deepEqual(
      capped.answers.map(({ answer, said: count }) => [answer, count]),
      [
        [undefined, 0],
        [undefined, 1],
        [undefined, 1],
        [undefined, 1],
        [undefined, 2],
      ],
    );
    assert.equal(capped.given.record.exhausted, false);
    assert.ok(said.every(advises), said.join("\n"));
    assert.match(
      said[0],
      /past the drive's cap of 1 uses for each agent that launches helpers: one agent of the phase has made 2, its launches through the kit's commands counted\. /u,
    );
    assert.match(said[1], /one agent of the phase has made 2, /u);

    // The worker's first use made through the kit's own command and its
    // second by a helper of its own: the report of the helper passes the
    // cap, which the shared count of the worker's uses holds.
    const mixed = drive(
      "advise",
      { cap: 1, ceiling: 8 },
      [["call-1", "worker-session", ["child-1"]]],
      1,
    );
    assert.deepEqual(
      mixed.answers.map(({ answer, said: count }) => [answer, count]),
      [[undefined, 1]],
    );
    assert.ok(advises(said[0]), said[0]);
    assert.match(said[0], /one agent of the phase has made 2, /u);
    const mixedRefused = drive(
      "refuse",
      { cap: 1, ceiling: 8 },
      [["call-1", "worker-session", ["child-1"]]],
      1,
    );
    assert.match(
      mixedRefused.answers[0].answer,
      /^Observed Codex admissions exceeded the declared role-text budget; further work stopped\.$/u,
    );
    assert.equal(mixedRefused.given.record.exhausted, true);
    assert.deepEqual(said, []);

    // A ceiling of one use, which the phase worker's own admission meets:
    // its first helper passes it, and its second says nothing more.
    const ceiled = drive("advise", { cap: 2, ceiling: 1 }, [
      ["call-1", "worker-session", ["child-1"]],
      ["call-2", "worker-session", ["child-2"]],
    ]);
    assert.deepEqual(
      ceiled.answers.map(({ said: count }) => count),
      [1, 1],
    );
    assert.ok(advises(said[0]), said[0]);
    assert.match(
      said[0],
      /past the drive's ceiling of 1 uses: 2 are counted, the phase worker's own among them\. /u,
    );

    // Off: both limits passed, nothing said, nothing stopped.
    const off = drive("off", { cap: 1, ceiling: 1 }, [
      ["call-1", "worker-session", ["child-1", "child-2"]],
    ]);
    assert.equal(off.answers[0].answer, undefined);
    assert.deepEqual(said, []);
    assert.equal(off.given.record.exhausted, false);

    // Refuse: the report that passes the cap stops further work, as before.
    const refused = drive("refuse", { cap: 1, ceiling: 8 }, [
      ["call-1", "worker-session", ["child-1"]],
      ["call-2", "worker-session", ["child-2"]],
    ]);
    assert.equal(refused.answers[0].answer, undefined);
    assert.match(
      refused.answers[1].answer,
      /^Observed Codex admissions exceeded the declared role-text budget; further work stopped\.$/u,
    );
    assert.equal(refused.given.record.exhausted, true);
    assert.deepEqual(said, []);
  } finally {
    console.error = error;
    rmSync(base, { recursive: true, force: true });
  }
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

test("WO-254 a writer whose owner is dead is no conflict: the drive passes the writer check", async () => {
  const base = realpathSync(
    createFixtureRoot(join(tmpdir(), "dotln-drive-dead-writer-")),
  );
  const previous = process.env.DOTLN_DRIVE_DEADLINE_AT;
  const now = Date.now;
  const advance = Symbol.for("dotln.test.drive-dead-writer-clock");
  try {
    const f = fixture(base);
    f.mapClone();
    f.start();
    // Seed through this checkout's runtime, so the fixture's own module first
    // loads inside the drive, where its appended clock step runs.
    const host = await import(
      new URL("../packages/skeleton/dist/src/harness-host.js", import.meta.url)
    );
    const exited = spawnSync(process.execPath, ["-e", ""]);
    host.seedHarnessWriter(f.orderRoot, {
      actorId: createHash("sha256")
        .update("stopped-codex-session")
        .digest("hex"),
      worktree: f.orderRoot,
      owner: {
        pid: exited.pid,
        startedAt: "Thu Jan  1 00:00:00 1970",
        source: "codex-host",
      },
    });
    assert.equal(host.harnessWriterView(f.orderRoot).alive, false);
    // The deadline passes only after the writer check, so the drive stops
    // for its budget, not for a writer.
    let clock = now();
    Date.now = () => clock;
    process.env.DOTLN_DRIVE_DEADLINE_AT = String(clock + 1000);
    globalThis[advance] = () => {
      clock += 2000;
    };
    const hostFile = join(
      f.orderRoot,
      "packages/skeleton/dist/src/harness-host.js",
    );
    writeFileSync(
      hostFile,
      readFileSync(hostFile, "utf8") +
        `\n      globalThis[Symbol.for("dotln.test.drive-dead-writer-clock")]?.();\n`,
    );
    const result = await runDrive(f.main, "WO-999", { host: "codex" });
    assert.equal(result.stop.reason, "budget-exhausted");
    assert.equal(result.writerConflict ?? null, null);
  } finally {
    Date.now = now;
    delete globalThis[advance];
    if (previous === undefined) delete process.env.DOTLN_DRIVE_DEADLINE_AT;
    else process.env.DOTLN_DRIVE_DEADLINE_AT = previous;
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
    // The operator's retraction and reopened handoff stop a drive (WO-249).
    [{}, [{ type: "OffRampRetracted" }], "off-ramp"],
    [{}, [{ type: "HandoffReopened" }], "off-ramp"],
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
  // A defect record is the verifier's or reviewer's judgment, not the
  // operator's direction: the drive goes on past it (WO-249).
  assert.equal(
    routeOrder({ phase: "verified" }, [{ type: "CriterionDefectRecorded" }])
      .action,
    "final-review",
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
  for (const [script, args] of [
    ["plan-first", ["draft", "WO-NNN"]],
    ["plan-first", ["draft", "WO-NNN", "--new"]],
    ["plan-first", ["diff", "WO-NNN"]],
    ["plan-first", ["apply", "WO-NNN"]],
    ["plan-first", ["screen", "WO-NNN"]],
    ["terms", ["--plan-first", "WO-NNN"]],
    ["outward-lint", ["--plan-first", "WO-NNN"]],
  ])
    assert.ok(
      targetLaneForms.some(
        (row) => row.script === script && row.args.join(" ") === args.join(" "),
      ),
      `${script} ${args.join(" ")}`,
    );
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
    ["rm", "<flag>", "<operand>"],
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
  // A review worker's refused gate and a refused desktop tool read back too.
  assert.deepEqual(
    [
      ...refusalFindings(
        "DOTLN_WORKER_GATE_REFUSED: a review worker never starts a gate; DOTLN_DESKTOP_CONTROL_REFUSED: off",
      ).codes,
    ].sort(),
    ["DOTLN_DESKTOP_CONTROL_REFUSED", "DOTLN_WORKER_GATE_REFUSED"],
  );
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
      "refuse: Private Fixture Term\n",
    );
    write(f.orderRoot, "records/evidence/WO-999/decisions.md", "# Decisions\n");
    // The records commit precedes the filing, so the commit the footer names
    // holds every record; the moved records' removal is committed after it.
    git(f.orderRoot, "add", "-A");
    git(f.orderRoot, "commit", "-qm", "Synthetic records");
    f.ok(f.resume(["target-records", ...actorArgs]));
    git(f.orderRoot, "add", "-A");
    git(f.orderRoot, "commit", "-qm", "Synthetic moved records");
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

test("a borrowing lane fetches only what the checkout lacks, imports only that and names its bound", () => {
  const base = realpathSync(
    createFixtureRoot(join(tmpdir(), "dotln-drive-lane-borrow-")),
  );
  const run = (cwd, ...args) => runGit(cwd, args);
  const commitIn = (cwd, name) => {
    writeFileSync(join(cwd, name), `${name}\n`);
    run(cwd, "add", name);
    run(
      cwd,
      "-c",
      "user.name=Fixture",
      "-c",
      "user.email=fixture@example.invalid",
      "-c",
      "maintenance.auto=false",
      "commit",
      "-qm",
      name,
    );
    return run(cwd, "rev-parse", "HEAD");
  };
  try {
    assert.equal(REMOTE_FETCH_TIMEOUT_MS, 10 * 60 * 1000);
    const origin = join(base, "origin.git");
    run(base, "init", "-q", "--bare", "-b", "main", origin);
    const writer = join(base, "writer");
    run(base, "clone", "-q", origin, writer);
    run(writer, "switch", "-q", "-c", "main");
    for (const name of ["one.txt", "two.txt", "three.txt"])
      commitIn(writer, name);
    run(writer, "push", "-q", "origin", "main");
    const checkout = join(base, "checkout");
    run(base, "clone", "-q", origin, checkout);
    const refsBefore = run(checkout, "for-each-ref");
    const store = join(checkout, ".git/objects");
    const lane = (inLane) => ({
      objects: inLane(["count-objects", "-v"]),
      alternates: readFileSync(
        join(
          inLane(["rev-parse", "--absolute-git-dir"]),
          "objects/info/alternates",
        ),
        "utf8",
      ),
    });

    // Held whole: the lane downloads nothing, and nothing is imported.
    let seen;
    const packsBefore = run(checkout, "count-objects", "-v");
    const tip = run(writer, "rev-parse", "HEAD");
    assert.equal(
      fetchRemoteBranch(checkout, origin, "main", {
        alternates: true,
        beforeImport(inLane, commit, { fetched }) {
          seen = { ...lane(inLane), commit, fetched };
        },
      }),
      tip,
    );
    assert.equal(seen.fetched, false);
    assert.equal(seen.commit, tip);
    assert.equal(seen.alternates, `${store}\n`);
    assert.match(seen.objects, /^count: 0$/mu);
    assert.match(seen.objects, /^in-pack: 0$/mu);
    assert.equal(run(checkout, "count-objects", "-v"), packsBefore);

    // One commit behind: the lane holds that commit's objects and no others,
    // the import brings them, and no reference moves in the checkout.
    const next = commitIn(writer, "four.txt");
    run(writer, "push", "-q", "origin", "main");
    const stored = () => {
      const counted = run(checkout, "count-objects", "-v");
      return ["count", "in-pack"].reduce(
        (total, name) =>
          total +
          Number(new RegExp(`^${name}: (\\d+)$`, "mu").exec(counted)[1]),
        0,
      );
    };
    const storedBefore = stored();
    assert.equal(
      fetchRemoteBranch(checkout, origin, "main", {
        alternates: true,
        timeoutMs: REMOTE_FETCH_TIMEOUT_MS,
        beforeImport(inLane, _commit, { fetched }) {
          seen = { ...lane(inLane), fetched };
        },
      }),
      next,
    );
    assert.equal(seen.fetched, true);
    const held = (name) =>
      Number(new RegExp(`^${name}: (\\d+)$`, "mu").exec(seen.objects)[1]);
    assert.equal(held("count") + held("in-pack"), 3, seen.objects);
    // The import stops where the checkout's refs do: a bundle of the whole
    // history would store all twelve objects again. A thin pack's completed
    // bases may add a few to the three new ones.
    const imported = stored() - storedBefore;
    assert.ok(imported >= 3 && imported <= 6, `imported ${imported} objects`);
    assert.equal(run(checkout, "for-each-ref"), refsBefore);
    assert.equal(run(checkout, "rev-parse", `${next}^{commit}`), next);
    run(checkout, "rev-list", "--objects", "--quiet", next);

    // A checkout's fetch of its own remote borrows and is bounded by default.
    const bounds = [];
    for (const options of [{}, { timeoutMs: 1234 }])
      fetchIntoCheckout(checkout, origin, "main", {
        ...options,
        beforeImport(inLane, _commit, { timeoutMs }) {
          bounds.push(timeoutMs);
          assert.equal(lane(inLane).alternates, `${store}\n`);
        },
      });
    assert.deepEqual(bounds, [REMOTE_FETCH_TIMEOUT_MS, 1234]);

    // A commit whose objects are not all here is not held: it is fetched and
    // the checkout comes out whole.
    const partial = join(base, "partial");
    run(base, "clone", "-q", origin, partial);
    const later = commitIn(writer, "five.txt");
    run(writer, "push", "-q", "origin", "main");
    const object = `${later.slice(0, 2)}/${later.slice(2)}`;
    const shard = join(partial, ".git/objects", later.slice(0, 2));
    mkdirSync(shard, { recursive: true });
    cpSync(
      join(writer, ".git/objects", object),
      join(partial, ".git/objects", object),
    );
    assert.equal(run(partial, "cat-file", "-t", later), "commit");
    fetchRemoteBranch(partial, origin, "main", {
      alternates: true,
      beforeImport(_inLane, _commit, { fetched }) {
        seen = { fetched };
      },
    });
    assert.equal(seen.fetched, true);
    run(partial, "rev-list", "--objects", "--quiet", later);

    // An absent branch keeps the fetch's own failure.
    assert.throws(
      () => fetchRemoteBranch(checkout, origin, "absent", { alternates: true }),
      /git fetch failed in the host read lane: .*absent/su,
    );
    // Without the option a lane borrows nothing and imports the whole branch.
    const plain = join(base, "plain");
    run(base, "init", "-q", "-b", "main", plain);
    assert.equal(
      fetchRemoteBranch(plain, origin, "main", {
        beforeImport(inLane, _commit, { fetched }) {
          seen = {
            fetched,
            alternates: existsSync(
              join(
                inLane(["rev-parse", "--absolute-git-dir"]),
                "objects/info/alternates",
              ),
            ),
          };
        },
      }),
      later,
    );
    assert.deepEqual(seen, { fetched: true, alternates: false });
    run(plain, "rev-list", "--objects", "--quiet", later);

    // Past the bound the refusal says so and carries it, and writes nothing.
    const prior = process.env.GIT_ALLOW_PROTOCOL;
    process.env.GIT_ALLOW_PROTOCOL = "ext";
    try {
      assert.throws(
        () =>
          fetchRemoteBranch(checkout, "ext::sleep 30", "main", {
            alternates: true,
            timeoutMs: 300,
          }),
        (error) => {
          assert.equal(error.boundMs, 300);
          assert.match(
            error.message,
            /git ls-remote failed in the host read lane: it passed its bound of 0 h 0 min/u,
          );
          return true;
        },
      );
    } finally {
      if (prior === undefined) delete process.env.GIT_ALLOW_PROTOCOL;
      else process.env.GIT_ALLOW_PROTOCOL = prior;
    }
    assert.equal(run(checkout, "for-each-ref"), refsBefore);
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

test("WO-276 Part M: a target change its base holds as one squashed commit or as its commits replayed is merged to the drive as it is to the close, and one squashed with an edit is not, the stop naming the attended close", () => {
  for (const how of ["squash", "rebase", "edited"]) {
    const base = realpathSync(
      createFixtureRoot(join(tmpdir(), "dotln-drive-landed-")),
    );
    try {
      const f = fixture(base);
      f.mapClone();
      f.start();
      for (const file of ["change.txt", "second.txt"]) {
        write(f.target, file, "target change\n");
        git(f.target, "add", file);
        git(f.target, "commit", "-qm", `Synthetic target change: ${file}`);
      }
      git(f.target, "push", "-q", "origin", "wo-999");
      const hosted = join(base, "hosted-merge");
      git(base, "clone", "-q", join(base, "target.git"), hosted);
      git(hosted, "config", "user.name", "Fixture");
      git(hosted, "config", "user.email", "fixture@example.invalid");
      if (how === "rebase") {
        const fork = git(hosted, "merge-base", "HEAD", "origin/wo-999");
        for (const picked of git(
          hosted,
          "rev-list",
          "--reverse",
          `${fork}..origin/wo-999`,
        ).split("\n"))
          git(hosted, "cherry-pick", picked);
      } else {
        git(hosted, "merge", "--squash", "origin/wo-999");
        if (how === "edited")
          write(hosted, "change.txt", "target change, edited at merge\n");
        git(hosted, "add", "-A");
        git(hosted, "commit", "-qm", "Hosted squash");
      }
      git(hosted, "push", "-q", "origin", "main");
      const state = {
        phase: "closed",
        workOrderId: "WO-999",
        repositoryId: "target",
      };
      assert.equal(routeFacts(f.orderRoot, state).targetMerged, false, how);
      assert.equal(
        fetchMergedBases(f.orderRoot, "WO-999").find(
          (row) => row.label === "target",
        ),
        undefined,
        how,
      );
      assert.equal(
        routeFacts(f.orderRoot, state).targetMerged,
        how !== "edited",
        how,
      );
      // Status is a local read: in a partial clone, where comparing patches
      // could fetch their blobs, only the branch's own history is asked.
      if (how === "squash") {
        git(f.clone, "config", "remote.origin.promisor", "true");
        const partial = routeFacts(f.orderRoot, state);
        assert.deepEqual(
          [partial.targetMerged, partial.targetUncompared],
          [false, true],
        );
      }
    } finally {
      rmSync(base, { recursive: true, force: true });
    }
  }
  // The stop for a target whose own records are merged and whose base does
  // not hold the change names the attended close; any other keeps its words.
  const closed = { phase: "closed", workOrderId: "WO-999" };
  assert.match(
    routeOrder({ ...closed, repositoryId: "target" }, [], {
      merged: true,
      targetMerged: false,
    }).stop.next,
    /where it was squashed with an edit, the operator runs the release close with --merged-as <commit>/u,
  );
  // In a partial clone nothing was compared, and the stop says so and names
  // the attended close, which judges it.
  assert.match(
    routeOrder({ ...closed, repositoryId: "target" }, [], {
      merged: true,
      targetMerged: false,
      targetUncompared: true,
    }).stop.next,
    /a partial clone, where status compares no patches.*types resume: release close in the launchpad's main checkout/u,
  );
  for (const [state, facts] of [
    [
      { ...closed, repositoryId: "target" },
      { merged: false, targetMerged: false },
    ],
    [closed, { merged: false }],
  ])
    assert.equal(
      routeOrder(state, [], facts).stop.next,
      "The operator merges the reviewed pull request(s), then types the same drive phrase again.",
    );
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
    // A target that declares a release policy (WO-276 criterion M6). The
    // launchpad publishes nothing for the order, so the close's publication
    // reads not-attempted, and the target's own outcome settles it: published
    // or current with the cleanup clean and the target removed is released,
    // and status and the drive route no further step; prepared, the branch
    // deleted and the target removed, goes back to the release close and
    // never to a merge that has happened.
    const declaredClose = (outcome, extra = {}) =>
      closeReceipt({
        publication: {
          outcome: "not-attempted",
          target: { repositoryId: "target", policy: "declared", outcome },
        },
        cleanup: { outcome: "clean", branch: { outcome: "deleted" } },
        targetCleanup: { outcome: "removed" },
        ...extra,
      });
    const routed = () =>
      routeOrder(state, events, routeFacts(f.orderRoot, state, events));
    for (const outcome of ["published", "current"]) {
      declaredClose(outcome);
      assert.equal(routeFacts(f.orderRoot, state, events).released, true);
      assert.deepEqual(
        [routed().action, routed().stop.reason],
        [null, "released"],
        outcome,
      );
    }
    for (const outcome of [
      "prepared",
      "not-attempted",
      "partially-published",
      "refused",
    ]) {
      declaredClose(outcome);
      assert.equal(routeFacts(f.orderRoot, state, events).released, false);
      assert.equal(routed().action, "release-close", outcome);
    }
    // Published with its cleanup blocked, or its target retained, is not
    // settled; a dry run, another repository's row and a close of an earlier
    // activation settle nothing.
    declaredClose("published", {
      cleanup: { outcome: "blocked", branch: { outcome: "deleted" } },
    });
    assert.equal(routed().action, "release-close");
    for (const extra of [
      { targetCleanup: { outcome: "retained" } },
      { dryRun: true },
      {
        publication: {
          outcome: "not-attempted",
          target: {
            repositoryId: "other",
            policy: "declared",
            outcome: "published",
          },
        },
      },
    ]) {
      declaredClose("published", extra);
      assert.equal(routeFacts(f.orderRoot, state, events).released, false);
    }
    declaredClose("published", {
      activation: { recordedAt: "2026-10-01T00:00:00.000Z" },
    });
    assert.equal(routeFacts(f.orderRoot, state, reactivated).released, false);
    declaredClose("published", {
      activation: { recordedAt: "2026-10-30T00:00:00.000Z" },
    });
    assert.equal(routeFacts(f.orderRoot, state, reactivated).released, true);
    // A refusal after the target published rewrites the launchpad's own
    // outcome; the target's block still settles the order.
    declaredClose("published", {
      publication: {
        outcome: "refused",
        target: {
          repositoryId: "target",
          policy: "declared",
          outcome: "published",
        },
      },
    });
    assert.equal(routed().stop.reason, "released");
    // A later attempt rewrites the record and undoes nothing: after a close
    // that removed the target, deleted the branch and failed at the
    // target's Release, a dry run and a publish stopped in its
    // prerequisites both keep that attempt among the earlier ones, and the
    // order still routes to the release close; after a settled close, it
    // is still released.
    const earlier = (outcome) => ({
      workOrderId: "WO-999",
      dryRun: false,
      publication: {
        outcome: "not-attempted",
        target: { repositoryId: "target", policy: "declared", outcome },
      },
      cleanup: { outcome: "clean", branch: { outcome: "deleted" } },
      targetCleanup: { outcome: "removed" },
    });
    for (const later of [
      { dryRun: true, targetCleanup: { outcome: "removed" } },
      {
        publication: { outcome: "refused" },
        cleanup: { outcome: "not-attempted" },
        targetCleanup: undefined,
      },
    ]) {
      closeReceipt({ ...later, previousAttempts: [earlier("refused")] });
      assert.equal(routed().action, "release-close");
      closeReceipt({ ...later, previousAttempts: [earlier("published")] });
      assert.equal(routed().stop.reason, "released");
      // Another order's attempt, a dry run and one of an earlier activation
      // among the earlier ones count for nothing.
      closeReceipt({
        ...later,
        previousAttempts: [
          { ...earlier("published"), workOrderId: "WO-997" },
          { ...earlier("published"), dryRun: true },
        ],
      });
      assert.equal(routed().stop.reason, "awaiting-merge");
    }
    closeReceipt({
      dryRun: true,
      activation: { recordedAt: "2026-10-30T00:00:00.000Z" },
      previousAttempts: [
        {
          ...earlier("published"),
          activation: { recordedAt: "2026-10-01T00:00:00.000Z" },
        },
      ],
    });
    assert.equal(routeFacts(f.orderRoot, state, reactivated).released, false);
    // A no-release close routes as before this part.
    closeReceipt({
      cleanup: { outcome: "clean" },
      targetCleanup: { outcome: "removed" },
    });
    assert.equal(routed().stop.reason, "released");
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

test("WO-276 criterion M6: a settled target close stays released however many later attempts rewrite its record, by the archives the close keeps; a close of an earlier activation and a history whose archive cannot be read settle nothing", async () => {
  const { readCloseHistory } = await import("./release.mjs");
  const base = realpathSync(
    createFixtureRoot(join(tmpdir(), "dotln-drive-history-")),
  );
  try {
    const f = fixture(base);
    f.mapClone();
    f.start();
    const state = {
      phase: "closed",
      workOrderId: "WO-999",
      repositoryId: "target",
    };
    const file = "records/state/local/retained/WO-999/release-close.json";
    const settled = {
      schemaVersion: 1,
      workOrderId: "WO-999",
      dryRun: false,
      publication: {
        outcome: "not-attempted",
        target: {
          repositoryId: "target",
          policy: "declared",
          outcome: "published",
        },
      },
      cleanup: { outcome: "clean", branch: { outcome: "deleted" } },
      targetCleanup: { outcome: "removed" },
    };
    const facts = (events = []) => routeFacts(f.orderRoot, state, events);
    const published = (attempt) =>
      attempt.publication?.target?.outcome === "published";
    // The close's own writer: an attempt takes its history from the close
    // reader, which archives the record it found, and writes the reader's
    // recovered attempts into no record.
    const attemptAfter = (attempt) => {
      const { recoveryAttempts, ...history } = readCloseHistory(
        f.main,
        "WO-999",
      );
      write(
        f.main,
        file,
        JSON.stringify({
          schemaVersion: 1,
          workOrderId: "WO-999",
          ...attempt,
          ...history,
        }),
      );
      return { recoveryAttempts, ...history };
    };
    write(f.main, file, JSON.stringify(settled));
    assert.equal(facts().released, true);
    // Twelve later attempts, a dry run and a publish stopped in its
    // prerequisites by turns: the record's own eight no longer hold the
    // settled close after the ninth, and its archives still do.
    let history;
    for (let attempt = 1; attempt <= 12; attempt++) {
      history = attemptAfter(
        attempt % 2
          ? {
              dryRun: true,
              publication: { outcome: "not-attempted" },
              cleanup: { outcome: "not-attempted" },
            }
          : {
              dryRun: false,
              publication: { outcome: "refused" },
              cleanup: { outcome: "not-attempted" },
            },
      );
      assert.equal(
        history.previousAttempts.some(published),
        attempt <= 8,
        `attempt ${attempt}: the record's own attempts`,
      );
      assert.ok(history.recoveryAttempts.some(published), `attempt ${attempt}`);
      const read = facts();
      assert.equal(read.released, true, `attempt ${attempt}`);
      assert.equal(
        routeOrder(state, [], read).stop.reason,
        "released",
        `attempt ${attempt}`,
      );
    }
    assert.equal(history.previousAttempts.length, 8);
    assert.equal(history.archivedAttempts.length, 12);
    // The archived close carries no activation: after a reactivation it is
    // an earlier activation's, and settles nothing for this one.
    const reactivated = ["2026-10-01", "2026-10-30"].map((day) => ({
      type: "WorkOrderActivated",
      workOrderId: "WO-999",
      recordedAt: `${day}T00:00:00.000Z`,
    }));
    assert.equal(facts(reactivated).released, false);
    // An archive whose bytes no longer have the digest its name states is
    // not read, and the archives named after it are not reached: the route
    // no longer knows of the settled close and names the order unreleased,
    // so the close runs and names the archive.
    const first = join(f.main, history.archivedAttempts[0]);
    const bytes = readFileSync(first, "utf8");
    writeFileSync(first, `${bytes} `);
    assert.equal(facts().released, false);
    assert.match(
      readCloseHistory(f.main, "WO-999").historyFailure,
      /Close history cannot be read safely: .*\(invalid immutable archive\)/u,
    );
    writeFileSync(first, bytes);
    assert.equal(facts().released, true);
    // An archive name outside the order's own history is not followed.
    const record = JSON.parse(readFileSync(join(f.main, file), "utf8"));
    write(
      f.main,
      file,
      JSON.stringify({
        ...record,
        previousAttempts: [],
        archivedAttempts: ["records/state/local/retained/WO-998/x.json"],
      }),
    );
    assert.equal(facts().released, false);
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

test("both native hosts use every generated role with what the worker table gives it: the default worker, and the verifier worker for a verification", async () => {
  const { KIT_MODELS, KIT_WORKERS } =
    await import("../packages/skeleton/src/worker-models.mjs");
  // This checkout states no worker of its own, so each phase runs the
  // kit's binding for its host.
  const kit = (worker, host) => {
    const binding = KIT_WORKERS[worker][host];
    const model = KIT_MODELS[binding.model ?? binding];
    return { model: model.id, effort: binding.effort ?? model.effort };
  };
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
      assert.deepEqual(
        { model: value.definition.model, effort: value.definition.effort },
        kit(role === "verifier" ? "verifier" : "default", host),
        `${role} on ${host}`,
      );
      // The helper a phase's session launches is the default worker, and
      // nothing of this checkout's named a model.
      assert.deepEqual(
        {
          model: value.helpers["dotln-worker"].model,
          effort: value.helpers["dotln-worker"].effort,
        },
        kit("default", host),
      );
      assert.equal(value.modelKey, null);
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
        ["npm", "--prefix", "<operand>", "run", "resume", "--", "status"],
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
      shape: [["npm", "run", "test:docs"]],
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
        actor: "helper",
      },
      {
        kind: "native-permission",
        commandKind: null,
        decisionSource: "rule",
        actor: "worker",
      },
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
      // How far into the attempt the denial came is kept as a whole number
      // of milliseconds.
      const { atMs, ...kept } = declined;
      assert.equal(Number.isSafeInteger(atMs) && atMs >= 0, true);
      if (protocol === "codex") {
        assert.deepEqual(kept, {
          kind: "lifecycle",
          command: [["node", "resume.mjs", "implementation-ready"]],
          tool: "shell",
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
        assert.equal(declined.actor, "worker");
        assert.equal(declined.decisionSource, "classifier");
        assert.deepEqual(record.attempts[0].eventTail, [
          { type: "system", subtype: "permission_denied" },
          { type: "result" },
        ]);
      }
    } finally {
      rmSync(base, { recursive: true, force: true });
    }
  });

// The stand-in for a host's program that plays the given rows as its stream
// and then goes on for a moment, as a worker does after a call comes back.
const playRows = (rows, marker, afterMs = 400) => [
  "-e",
  `const fs = require('node:fs'); process.stdout.write(${JSON.stringify(rows.map((row) => JSON.stringify(row)).join("\n") + "\n")}); setTimeout(() => fs.writeFileSync(${JSON.stringify(marker)}, 'went on'), ${afterMs});`,
];

test("WO-287 criteria D1 and D2: a host's denial of a helper agent's call is recorded and does not end the phase, the phase worker's own denied call ends it after one launch, and the record keeps the tool, who called, what decided and when", async () => {
  const base = realpathSync(
    createFixtureRoot(join(tmpdir(), "dotln-drive-helper-denial-")),
  );
  try {
    const helperRows = [
      {
        message: {
          content: [
            {
              type: "tool_use",
              id: "helper-write",
              name: "Write",
              input: { file_path: "/private/helper/path" },
            },
          ],
        },
      },
      {
        type: "system",
        subtype: "permission_denied",
        tool_name: "Write",
        tool_use_id: "helper-write",
        agent_id: "private-helper-agent",
        decision_reason_type: "asyncAgent",
        decision_reason: "private reason",
        message: "private rejection text",
      },
      {
        type: "system",
        subtype: "permission_denied",
        tool_name: "mcp__private_server__private_tool",
        tool_use_id: "helper-mcp",
        agent_id: "private-helper-agent-2",
        decision_reason_type: "classifier",
      },
      {
        message: {
          content: [
            {
              type: "tool_use",
              id: "helper-read",
              name: "Bash",
              input: { command: "git log private-range" },
            },
          ],
        },
      },
      {
        message: {
          content: [
            {
              type: "tool_result",
              tool_use_id: "helper-read",
              is_error: true,
              content:
                "DOTLN_HARNESS_REFUSED: a driven worker's helper agent writes nothing but its session scratch. This is stop driven-helper, which protects one writer. This is stop private-stop, which protects nothing.",
            },
          ],
        },
      },
      {
        type: "result",
        is_error: false,
        permission_denials: [
          { tool_name: "Write", tool_input: { file_path: "/private/x" } },
          { tool_name: "mcp__private_server__private_tool" },
        ],
      },
      // A later turn of the same run, as the host emits one when it handles
      // a background agent's result: its own count is added, not kept alone.
      { type: "result", is_error: false, permission_denials: [] },
    ];
    const workerRows = [
      {
        message: {
          content: [
            {
              type: "tool_use",
              id: "worker-read",
              name: "Bash",
              input: {
                command: "ls private-a private-b private-c && cat private-d",
              },
            },
          ],
        },
      },
      {
        type: "system",
        subtype: "permission_denied",
        tool_name: "Bash",
        tool_use_id: "worker-read",
        decision_reason_type: "classifier",
        decision_reason: "private classifier reason",
      },
      { type: "result", is_error: false },
    ];
    const markers = [join(base, "first"), join(base, "second")];
    let launches = 0;
    const record = { attempts: [], incomplete: {} };
    const result = await driveLoop({
      record,
      status: () => ({
        phase: "active",
        route: routeOrder({ phase: "active" }, [], {
          incomplete: record.incomplete,
        }),
      }),
      launch: async () => {
        const rows = launches === 0 ? helperRows : workerRows;
        const marker = markers[launches++];
        return launchPhase({
          command: process.execPath,
          protocol: "claude",
          args: playRows(rows, marker, launches === 1 ? 400 : 1500),
          cwd: process.cwd(),
          env: process.env,
          timeoutMs: 8000,
        });
      },
    });
    // The helpers' denials ended nothing: the first worker went on to its
    // own end, and only then did the drive start the phase again.
    assert.equal(launches, 2);
    assert.equal(readFileSync(markers[0], "utf8"), "went on");
    const [first, second] = record.attempts;
    assert.equal(first.error, false);
    assert.equal(first.refused, undefined);
    assert.equal(first.cause, undefined);
    assert.equal(first.declined, undefined);
    assert.equal(first.exitCode, 0);
    assert.equal(first.helperDenials.count, 2);
    assert.deepEqual(
      first.helperDenials.items.map(
        ({ tool, actor, decisionSource, command, reason }) => ({
          tool,
          actor,
          decisionSource,
          command,
          reason,
        }),
      ),
      [
        {
          tool: "Write",
          actor: "helper",
          decisionSource: "asyncAgent",
          command: null,
          reason: null,
        },
        {
          tool: "mcp-tool",
          actor: "helper",
          decisionSource: "classifier",
          command: null,
          reason: null,
        },
      ],
    );
    assert.equal(first.hostDenialsReported, 2);
    // A refusal of the kit's own guard is counted by its code and by the
    // stop it names, where the name is one of the table's.
    assert.deepEqual(first.refusalCounts, { DOTLN_HARNESS_REFUSED: 1 });
    assert.deepEqual(first.refusalStops, { "driven-helper": 1 });
    assert.deepEqual(
      first.boundaryResults.map(({ actor }) => actor),
      ["helper", "helper"],
    );
    assert.equal(record.incomplete.next, 1);
    // What the drive saw when each attempt ended is kept on the attempt.
    assert.equal(first.completed, false);
    assert.equal(first.phaseAfter, "active");
    assert.equal(second.completed, false);
    // The phase worker's own denied call ends the phase where it came and
    // stops the drive, as before.
    assert.equal(result.stop.reason, "dispatch-refused");
    assert.match(
      result.stop.next,
      /^The host denied a call the phase worker made, and the drive ended the phase there/u,
    );
    assert.equal(second.cause, "native-permission-refused");
    assert.equal(existsSync(markers[1]), false);
    const { atMs, sequence, ...kept } = second.declined;
    assert.equal(Number.isSafeInteger(atMs) && atMs >= 0, true);
    assert.equal(sequence, 2);
    assert.deepEqual(kept, {
      kind: "unclassified-shell",
      command: [
        ["ls", "<operand>", "<operand>", "<operand>"],
        ["cat", "<operand>"],
      ],
      tool: "Bash",
      actor: "worker",
      decisionSource: "classifier",
      status: "declined",
      exitCode: null,
      reason: null,
      reasonSource: "none-printed",
    });
    assert.equal(second.helperDenials, undefined);
    // Nothing of a reason, an input or an identifier is kept of either.
    assert.equal(JSON.stringify(result).includes("private"), false);
    // The tool's name is one of the host's own or its kind alone.
    assert.equal(deniedTool("Edit"), "Edit");
    assert.equal(deniedTool("mcp__server__tool"), "mcp-tool");
    assert.equal(deniedTool("SomethingElse"), "other");
    assert.equal(deniedTool(undefined), null);
  } finally {
    rmSync(base, { recursive: true, force: true });
  }
});

test("WO-287 criterion D1: a refused dispatch keeps why in the kit's own fixed words and the stop carries it, and no other text of a refusal is kept", async () => {
  const hookRow = (message) => ({
    type: "system",
    subtype: "hook_response",
    hook_event: "UserPromptSubmit",
    exit_code: 0,
    stdout: JSON.stringify({ systemMessage: message }),
  });
  const drive = async (message, row = hookRow(message)) => {
    const record = { attempts: [], incomplete: {} };
    const result = await driveLoop({
      record,
      status: () => ({
        phase: "verified",
        route: routeOrder({ phase: "verified" }),
      }),
      launch: () =>
        launchPhase({
          command: process.execPath,
          protocol: "claude",
          args: [
            "-e",
            `console.log(${JSON.stringify(JSON.stringify(row))}); console.log(JSON.stringify({ type: "result", is_error: false }));`,
          ],
          cwd: process.cwd(),
          env: process.env,
          timeoutMs: 5000,
        }),
    });
    return { record, result };
  };
  const illegal = await drive(
    "DotLn: prompt accepted; DOTLN_HARNESS_REFUSED: resume: next is not a legal dispatch in phase verified; legal actions: final-review",
  );
  assert.equal(illegal.result.stop.reason, "dispatch-refused");
  assert.equal(
    illegal.result.stop.next,
    "The worker's automatic lifecycle dispatch was refused. The kit's reason: resume: next is not a legal dispatch in phase verified; legal actions: final-review.",
  );
  assert.equal(
    illegal.record.attempts[0].refusedReason,
    "resume: next is not a legal dispatch in phase verified; legal actions: final-review.",
  );
  // A prompt's dispatch has no tool result: its refusal is counted once,
  // where the hook's own row reports it, in either form the hook answers in.
  assert.deepEqual(illegal.record.attempts[0].refusalCounts, {
    DOTLN_HARNESS_REFUSED: 1,
  });
  const exited = await drive(null, {
    type: "system",
    subtype: "hook_response",
    hook_event: "UserPromptSubmit",
    exit_code: 2,
    stderr:
      "DOTLN_HARNESS_REFUSED: resume: next is not a legal dispatch in phase verified; legal actions: final-review",
  });
  assert.equal(exited.result.stop.next, illegal.result.stop.next);
  assert.deepEqual(exited.record.attempts[0].refusalCounts, {
    DOTLN_HARNESS_REFUSED: 1,
  });
  // A failed lifecycle command is named; what it printed is not kept.
  const failed = await drive(
    "DotLn: prompt accepted; DOTLN_HARNESS_REFUSED: dispatch next failed: private output at /private/path",
  );
  assert.equal(
    failed.result.stop.next,
    "The worker's automatic lifecycle dispatch was refused. The kit's reason: the lifecycle command for dispatch next failed.",
  );
  assert.equal(JSON.stringify(failed.result).includes("private"), false);
  // A refusal in none of the known forms keeps the fixed sentence alone.
  const other = await drive(
    "DotLn: prompt accepted; DOTLN_HARNESS_REFUSED: private words of some other refusal",
  );
  assert.equal(
    other.result.stop.next,
    "The worker's automatic lifecycle dispatch was refused.",
  );
  assert.equal(other.record.attempts[0].refusedReason, undefined);
  assert.equal(JSON.stringify(other.result).includes("private"), false);
  // A reason is returned only with the refusal it was read from: a denied
  // call after a refused dispatch stops the drive with the denial's sentence
  // and no reason of the dispatch's.
  const mixedRecord = { attempts: [], incomplete: {} };
  const mixed = await driveLoop({
    record: mixedRecord,
    status: () => ({
      phase: "verified",
      route: routeOrder({ phase: "verified" }),
    }),
    launch: () =>
      launchPhase({
        command: process.execPath,
        protocol: "claude",
        args: [
          "-e",
          `for (const row of ${JSON.stringify([
            hookRow(
              "DotLn: prompt accepted; DOTLN_HARNESS_REFUSED: resume: next is not a legal dispatch in phase verified; legal actions: final-review",
            ),
            { type: "system", subtype: "permission_denied", tool_name: "Bash" },
            { type: "result", is_error: false },
          ])}) console.log(JSON.stringify(row));`,
        ],
        cwd: process.cwd(),
        env: process.env,
        timeoutMs: 5000,
      }),
  });
  assert.match(
    mixed.stop.next,
    /^The host denied a call the phase worker made, and the drive ended the phase there/u,
  );
  assert.doesNotMatch(mixed.stop.next, /The kit's reason/u);
  assert.equal(mixedRecord.attempts[0].refusedReason, undefined);
  // The words are the kit's own, from the table canonical status answers
  // from: every phase's list of legal actions as the kit writes it, and each
  // list an order's state can add to, yields its reason.
  const written = (phase, actions) =>
    `resume: verify is not a legal dispatch in phase ${phase}; legal actions: ${actions.join(", ") || "none"}`;
  for (const [phase, actions] of Object.entries(PHASE_LEGAL_ACTIONS))
    assert.equal(
      lifecycleRefusalReason(
        `DOTLN_HARNESS_REFUSED: ${written(phase, actions)}`,
      ),
      `${written(phase, actions)}.`,
      phase,
    );
  assert.deepEqual([...STATE_LEGAL_ACTIONS].sort(), [
    "fix",
    "plan-approved",
    "plan-proposed",
    "target-records",
  ]);
  for (const [phase, actions] of [
    ["active", ["next", "plan-proposed"]],
    ["active", ["next", "plan-proposed", "plan-approved"]],
    ["active", ["next", "plan-proposed", "implementation-ready"]],
    ["closed", ["target-records", "release-close", "next", "activate"]],
    ["ready-to-verify", ["verify", "fix"]],
    ["verified", []],
  ])
    assert.equal(
      lifecycleRefusalReason(written(phase, actions)),
      `${written(phase, actions)}.`,
      `${phase}: ${actions}`,
    );
  // Each word of the sentence is checked against the kit's own vocabulary.
  for (const [text, reason] of [
    [
      "verify is not a legal dispatch in phase active; legal actions: next",
      "verify is not a legal dispatch in phase active; legal actions: next.",
    ],
    [
      "resume: fix is not a legal dispatch in phase closed; legal actions: none",
      "resume: fix is not a legal dispatch in phase closed; legal actions: none.",
    ],
    [
      "next is not a legal dispatch in phase privateword; legal actions: next",
      null,
    ],
    [
      "privateword is not a legal dispatch in phase active; legal actions: next",
      null,
    ],
    [
      "next is not a legal dispatch in phase active; legal actions: privateword",
      null,
    ],
    ["DOTLN_DISPATCH_BOUND: private", "the phase's dispatch bound is reached."],
    [
      "the worktree is reserved by another session private",
      "the order's worktree is reserved by another writer.",
    ],
    [
      "dispatch verify is already recorded (phase verifying) but its briefing is unavailable: private",
      "dispatch verify is already recorded in phase verifying, and its briefing could not be read.",
    ],
    ["resume.mjs next refused: private diagnostic", null],
    [undefined, null],
  ])
    assert.equal(lifecycleRefusalReason(text), reason, String(text));
});

test("WO-287 criterion D3: a Claude phase starts with the host's wait for background work uncapped unless the drive's own environment sets it, and a Codex phase's environment is unchanged", () => {
  assert.equal(BACKGROUND_WAIT_CEILING, "CLAUDE_CODE_PRINT_BG_WAIT_CEILING_MS");
  assert.deepEqual(backgroundWait({}), {
    env: { [BACKGROUND_WAIT_CEILING]: "0" },
    record: { ceilingMs: 0, source: "drive" },
  });
  assert.deepEqual(backgroundWait({ [BACKGROUND_WAIT_CEILING]: "" }), {
    env: { [BACKGROUND_WAIT_CEILING]: "0" },
    record: { ceilingMs: 0, source: "drive" },
  });
  assert.deepEqual(backgroundWait({ [BACKGROUND_WAIT_CEILING]: "1800000" }), {
    env: {},
    record: { ceilingMs: 1800000, source: "environment" },
  });
  assert.deepEqual(backgroundWait({ [BACKGROUND_WAIT_CEILING]: "soon" }), {
    env: {},
    record: { ceilingMs: null, source: "environment" },
  });
  const given = {
    contextEnv: { PATH: "/synthetic/tools", OTHER: "kept" },
    launchpad: "/synthetic/launchpad",
    context: "/synthetic/context.json",
    worker: "worker-id",
  };
  const claude = phaseEnvironment({ ...given, host: "claude" });
  assert.deepEqual(claude.env, {
    PATH: "/synthetic/tools",
    OTHER: "kept",
    DOTLN_LAUNCHPAD: "/synthetic/launchpad",
    DOTLN_DRIVEN_WORKER: "/synthetic/context.json",
    CLAUDE_CODE_SESSION_ID: "worker-id",
    [BACKGROUND_WAIT_CEILING]: "0",
  });
  assert.deepEqual(claude.backgroundWait, { ceilingMs: 0, source: "drive" });
  const set = phaseEnvironment({
    ...given,
    contextEnv: { ...given.contextEnv, [BACKGROUND_WAIT_CEILING]: "900000" },
    host: "claude",
  });
  assert.equal(set.env[BACKGROUND_WAIT_CEILING], "900000");
  assert.deepEqual(set.backgroundWait, {
    ceilingMs: 900000,
    source: "environment",
  });
  const codex = phaseEnvironment({ ...given, host: "codex" });
  assert.deepEqual(codex.env, {
    PATH: "/synthetic/tools",
    OTHER: "kept",
    DOTLN_LAUNCHPAD: "/synthetic/launchpad",
    DOTLN_DRIVEN_WORKER: "/synthetic/context.json",
  });
  assert.equal(codex.backgroundWait, null);
});

test("WO-287 criterion D4: the account of a stopped drive says the stop, how the last attempt ended, what ended it, what was refused and denied by count, what is recorded and what to do next, and prints no operand of a command", () => {
  const attempt = (extra) => ({
    phase: "active",
    action: "next",
    host: "claude",
    startedAt: "2026-11-17T14:00:00.000Z",
    finishedAt: "2026-11-17T15:04:00.000Z",
    timeoutMs: 28_800_000,
    exitCode: 0,
    exitSignal: null,
    error: false,
    timedOut: false,
    commandResults: [],
    refusalCodes: [],
    backgroundWait: { ceilingMs: 0, source: "drive" },
    commandShapeVersion: COMMAND_SHAPE_VERSION,
    completed: false,
    phaseAfter: "active",
    ...extra,
  });
  const text = (record, extra = {}) =>
    driveAccount({ order: "WO-999", record, ...extra }).join("\n");
  // An order no drive has run.
  assert.match(
    text(null),
    /^WO-999: no drive of this order has run from this launchpad/u,
  );
  // The worker's own denied call: two reads in one shell line, declined by
  // the host's automatic review, an hour in.
  const denied = text(
    {
      host: "claude",
      running: false,
      stop: {
        reason: "dispatch-refused",
        next: "The host denied a call the phase worker made, and the drive ended the phase there: no worker goes around a denial or repeats it. The drive's account names the call and the next step.",
      },
      attempts: [
        attempt({
          error: true,
          cause: "native-permission-refused",
          refused:
            "The host denied a call the phase worker made, and the drive ended the phase there: no worker goes around a denial or repeats it. The drive's account names the call and the next step.",
          declined: {
            kind: "unclassified-shell",
            command: [
              ["ls", "<operand>", "<operand>", "<operand>"],
              ["cat", "<operand>"],
            ],
            tool: "Bash",
            actor: "worker",
            decisionSource: "classifier",
            atMs: 3_780_000,
            status: "declined",
            reason: null,
          },
          helperDenials: {
            count: 3,
            items: [{ tool: "Write" }, { tool: "Write" }, { tool: "Bash" }],
          },
          hostDenialsReported: 4,
          refusalCodes: ["DOTLN_HARNESS_REFUSED"],
          refusalCounts: { DOTLN_HARNESS_REFUSED: 96 },
          refusalStops: { "driven-helper": 90, "outside-write": 6 },
          commandResults: [
            { kind: "unclassified-shell", status: "completed" },
            {
              kind: "public-github",
              status: "failed",
              shape: [["gh", "api", "<operand>"]],
            },
            {
              kind: "public-github",
              status: "failed",
              shape: [["gh", "api", "<operand>"]],
            },
            {
              kind: "unclassified-shell",
              status: "failed",
              shape: [["git", "log", "<operand>"]],
            },
          ],
          retained: {
            events:
              "/fixture/main/docs/control/local/drives/WO-999/w.events.jsonl",
            stderr:
              "/fixture/main/docs/control/local/drives/WO-999/w.stderr.txt",
          },
        }),
      ],
    },
    {
      status: { phase: "active", route: { stop: null } },
      worktree: { changed: 14, untracked: 6, path: "/fixture/main-wo999" },
      main: "/fixture/main",
    },
  );
  for (const line of [
    "WO-999: the last drive stopped at dispatch-refused, with 1 phase attempt recorded on claude.",
    "Stop: The host denied a call the phase worker made, and the drive ended the phase there:",
    "Attempt 1: resume: next as executor, started 2026-11-17 14:00 UTC, ran 1 h 4 min of a 8 h 0 min limit; the drive ended its process there.",
    "Ended by: the host denied the shell command `ls <operand> <operand> <operand> ; cat <operand>`, which the phase worker made, decided by the host's automatic review, 1 h 3 min into the attempt.",
    "A driven phase runs with the host's permission prompts off",
    "Background work: the host waits for it after the worker's last turn without a cap (set by the drive).",
    "Helpers: the host denied 3 calls that helper agents made, which did not end the phase (Write ×2, Bash ×1).",
    "The host's own result counted 4 denied calls in the attempt.",
    "The kit's own guard, not the host, refused calls in the attempt: DOTLN_HARNESS_REFUSED ×96; by stop: driven-helper ×90, outside-write ×6. npm run features -- list prints what each stop protects and the one line that sets its level. A refused call returns its refusal to whoever made it and ends nothing.",
    "Commands: 4 observed, 3 failed; most often `gh api <operand>` ×2, `git log <operand>` ×1.",
    "Recorded, as the drive saw it when the attempt ended: no completion of the phase; the order stood at phase active.",
    "Left in the order's worktree (../main-wo999 from the main checkout): 14 changed paths and 6 untracked paths, uncommitted.",
    "Kept beside the record: the worker's raw stream and what its process printed (docs/control/local/drives/WO-999/w.events.jsonl, docs/control/local/drives/WO-999/w.stderr.txt).",
    "Next: either type resume: next in a session in the order's worktree, where the host asks about such a call instead of denying it; or type drive: WO-999 again, which starts the phase with a fresh worker from what the worktree holds: the host's automatic review judges each call as it comes, and a fresh worker may not make this one.",
  ])
    assert.equal(denied.includes(line), true, `${line}\n---\n${denied}`);
  // A denied call of a tool that is not the shell is named by its tool.
  assert.match(
    text({
      host: "claude",
      stop: { reason: "dispatch-refused", next: "x" },
      attempts: [
        attempt({
          error: true,
          declined: {
            kind: null,
            command: null,
            tool: "Write",
            actor: "worker",
            decisionSource: "rule",
            atMs: 60_000,
          },
        }),
      ],
    }),
    /Ended by: the host denied a call of the Write tool, which the phase worker made, decided by a permission rule in the host's settings, 0 h 1 min into the attempt\.[\s\S]*Next: either type resume: next in a session in the order's worktree, where the host asks about such a call instead of denying it; or admit the call in the host's own permission settings and type drive: WO-999 again/u,
  );
  // Two endings without a completion: nothing went wrong that the drive saw,
  // and the next step is the attended phrase.
  const incomplete = text(
    {
      host: "claude",
      stop: {
        reason: "incomplete-bound",
        next: "Two workers ended without recording this phase's completion. Repair the cause and run its phrase yourself; a recorded transition clears this stop.",
      },
      attempts: [attempt({}), attempt({ backgroundWait: undefined })],
    },
    { status: { phase: "active", route: { stop: null } } },
  );
  assert.match(
    incomplete,
    /Attempt 2: resume: next as executor, .*; its process exited 0\./u,
  );
  assert.match(
    incomplete,
    /Ended by: nothing the drive saw go wrong\. The worker's process ended without recording the phase's completion/u,
  );
  assert.match(
    incomplete,
    /Background work: this record does not say how long the host waited .* ten minutes/u,
  );
  assert.match(
    incomplete,
    /Next: type resume: next in a session in the order's worktree\. A transition it records clears this stop/u,
  );
  // A refused dispatch says the kit's reason; a time limit names itself.
  const refusedText = text({
    host: "claude",
    stop: { reason: "dispatch-refused", next: "x" },
    attempts: [
      attempt({
        action: "verify",
        refused: "The worker's automatic lifecycle dispatch was refused.",
        refusedReason:
          "resume: verify is not a legal dispatch in phase verified; legal actions: final-review.",
      }),
    ],
  });
  assert.match(refusedText, /Attempt 1: resume: verify as verifier,/u);
  assert.match(
    refusedText,
    /Ended by: The worker's automatic lifecycle dispatch was refused\. The kit's reason: resume: verify is not a legal dispatch in phase verified; legal actions: final-review\./u,
  );
  const timed = text({
    host: "codex",
    stop: { reason: "incomplete-bound", next: "x" },
    attempts: [
      attempt({
        host: "codex",
        timedOut: true,
        error: true,
        timeoutMs: 900_000,
        exitSignal: "SIGTERM",
        backgroundWait: undefined,
      }),
    ],
  });
  assert.match(
    timed,
    /of a 0 h 15 min limit; the drive ended its process at that limit\./u,
  );
  assert.match(timed, /Ended by: the attempt's time limit\./u);
  assert.doesNotMatch(timed, /Background work/u);
  // Whether the attempt completed is what the drive saw when it ended, not
  // where the order stands now: after an attended session records the phase,
  // the same attempt reads as it did, and the account says the order moved.
  const stoppedTwice = {
    host: "claude",
    stop: { reason: "incomplete-bound", next: "Two workers ended." },
    attempts: [attempt({}), attempt({})],
  };
  const sawIncomplete =
    "Recorded, as the drive saw it when the attempt ended: no completion of the phase; the order stood at phase active.";
  const before = text(stoppedTwice, {
    status: { phase: "active", route: { stop: null } },
  });
  const after = text(stoppedTwice, {
    status: { phase: "ready-to-verify", route: { stop: null } },
  });
  assert.equal(before.includes(sawIncomplete), true, before);
  assert.equal(after.includes(sawIncomplete), true, after);
  assert.doesNotMatch(before, /Since then the order has moved/u);
  assert.match(
    after,
    /Since then the order has moved to phase ready-to-verify: the stop above is the last drive's, and node scripts\/drive\.mjs status WO-999 says where the order stands now\.\n.*Next: type drive: WO-999 to go on from where the order now stands\./su,
  );
  assert.match(
    after,
    /Ended by: nothing the drive saw go wrong\. The worker's process ended without recording the phase's completion/u,
  );
  // A record made before attempts kept what the drive saw says so.
  assert.match(
    text(
      {
        host: "claude",
        stop: { reason: "incomplete-bound", next: "x" },
        attempts: [attempt({ completed: undefined, phaseAfter: undefined })],
      },
      { status: { phase: "active", route: { stop: null } } },
    ),
    /Recorded: this record does not say whether the phase completed when the attempt ended; the order now stands at phase active\./u,
  );
  // A reason the host printed is free text, which can name what the call
  // named: the account says the record keeps it and prints none of it.
  const codexDenied = text({
    host: "codex",
    stop: { reason: "dispatch-refused", next: "x" },
    attempts: [
      attempt({
        host: "codex",
        error: true,
        backgroundWait: undefined,
        declined: {
          kind: "unclassified-shell",
          command: [["rm", "<operand>"]],
          tool: "shell",
          atMs: 120_000,
          status: "declined",
          reason: "Refused removal of customer-draft.txt",
          reasonSource: "command_execution.aggregated_output",
        },
      }),
    ],
  });
  assert.match(
    codexDenied,
    /Ended by: the host denied the shell command `rm <operand>`, 0 h 2 min into the attempt\./u,
  );
  assert.match(
    codexDenied,
    /The host printed a reason for it, which the drive's record keeps with paths, URLs and queries masked; an analysis: session reads it\./u,
  );
  assert.equal(codexDenied.includes("customer-draft"), false);
  assert.equal(codexDenied.includes("Refused removal"), false);
  // The stop's own line is the refusal that stopped the drive: it is said
  // once.
  const refusal =
    "The worker's automatic lifecycle dispatch was refused. The kit's reason: resume: verify is not a legal dispatch in phase repairing; legal actions: repair-complete.";
  const saidOnce = text({
    host: "claude",
    stop: { reason: "dispatch-refused", next: refusal },
    attempts: [
      attempt({
        action: "verify",
        refused: "The worker's automatic lifecycle dispatch was refused.",
        refusedReason:
          "resume: verify is not a legal dispatch in phase repairing; legal actions: repair-complete.",
      }),
    ],
  });
  assert.equal(saidOnce.split(refusal).length, 2, saidOnce);
  assert.match(saidOnce, /Ended by: the refusal the stop above states\./u);
  // A proposed plan is a stop the account explains like any other but the
  // merge and a release, and the driver's result carries it.
  const proposed = {
    host: "claude",
    stop: {
      reason: "awaiting-plan-approval",
      next: "Read the plan, proposal and conversation.",
    },
    attempts: [attempt({ completed: true })],
    budget: null,
    limits: null,
    routerUsage: null,
  };
  assert.match(
    text(proposed),
    /stopped at awaiting-plan-approval, .*\nStop: Read the plan, proposal and conversation\.\n.*\nThe attempt ended as its phase intends; the drive stopped for the reason the stop gives\./su,
  );
  assert.equal(stopNeedsAccount(proposed.stop), true);
  assert.deepEqual(
    printedResult("WO-999", proposed, () => ["the account"]).why,
    ["the account"],
  );
  // An account that cannot be read costs the drive's result one line, not
  // the result.
  const unread = printedResult("WO-999", proposed, () => {
    throw new Error("private failure at /private/path");
  });
  assert.equal(unread.stop.reason, "awaiting-plan-approval");
  assert.deepEqual(unread.why, [
    "WO-999: the account of this drive could not be read here; node scripts/drive.mjs why WO-999 reads it again and says what stopped it.",
  ]);
  for (const reason of ["awaiting-merge", "released", "fixture-endpoint"]) {
    assert.equal(stopNeedsAccount({ reason }), false, reason);
    assert.equal(
      "why" in
        printedResult(
          "WO-999",
          { ...proposed, stop: { reason, next: "x" } },
          () => assert.fail("no account is read for this stop"),
        ),
      false,
      reason,
    );
  }
  for (const reason of [
    "dispatch-refused",
    "incomplete-bound",
    "budget-exhausted",
    "verification-bound",
    "final-review-bound",
    "awaiting-close",
    "operator-finding",
    "off-ramp",
    "typed-correction",
    "analysis",
    "operator-override",
  ])
    assert.equal(stopNeedsAccount({ reason }), true, reason);
  // A release close the host declined: the stop, as the driver writes it,
  // names the attended close in the main checkout, and the next step sends
  // the reader to that line, not to the order's worktree or to a second
  // drive.
  const declinedItem = {
    kind: "unclassified-shell",
    command: [["node", "release.mjs", "close", "<operand>", "--publish"]],
    tool: "Bash",
    actor: "worker",
    decisionSource: "classifier",
    atMs: 120_000,
  };
  const closeStop = awaitingCloseStop("WO-999", {
    host: "claude",
    declined: declinedItem,
  }).stop;
  const declinedClose = text({
    host: "claude",
    running: false,
    stop: closeStop,
    attempts: [
      attempt({
        phase: "closed",
        action: "release-close",
        error: true,
        cause: "native-permission-refused",
        refused:
          "The host denied a call the phase worker made, and the drive ended the phase there: no worker goes around a denial or repeats it. The drive's account names the call and the next step.",
        declined: declinedItem,
        phaseAfter: "closed",
      }),
    ],
  });
  assert.equal(closeStop.reason, "awaiting-close");
  assert.ok(
    declinedClose.includes(`\nStop: ${closeStop.next}\n`),
    declinedClose,
  );
  assert.match(
    closeStop.next,
    /in the launchpad's main checkout type resume: release close for WO-999/u,
  );
  assert.match(
    declinedClose,
    /\nNext: as the stop says above\. To read further than this account, open an analysis: session in the order's worktree; a router reads no transcript\.$/u,
  );
  assert.doesNotMatch(declinedClose, /order's worktree, where the host asks/u);
  assert.doesNotMatch(declinedClose, /starts the phase with a fresh worker/u);
  // A drive that stopped before any launch.
  assert.match(
    text({
      host: "claude",
      stop: {
        reason: "dispatch-refused",
        next: "The worktree has another writer.",
      },
      attempts: [],
      writerConflict: { checkout: "order-launchpad", alive: "unknown" },
    }),
    /No phase worker started: the drive stopped before any launch\.\nThe order's worktree was reserved by another writer/u,
  );
});

test("WO-287 criteria D1 and D4: a command's shape keeps a word only in the place its grammar gives it, so a file whose name is also a word of the kit's commands is masked in a new record on either host and in an older record the account prints", () => {
  // What the drive records of a phase worker's denied shell call.
  const deniedShape = (protocol, command) => {
    const reader = streamObservation({ protocol, launchpad: "/launchpad" });
    const rows =
      protocol === "claude"
        ? [
            {
              type: "assistant",
              message: {
                content: [
                  {
                    type: "tool_use",
                    id: "call",
                    name: "Bash",
                    input: { command },
                  },
                ],
              },
            },
            {
              type: "system",
              subtype: "permission_denied",
              tool_name: "Bash",
              tool_use_id: "call",
              decision_reason_type: "rule",
            },
          ]
        : [
            {
              type: "item.completed",
              item: { type: "command_execution", command, status: "declined" },
            },
          ];
    for (const row of rows) reader.inspect(JSON.stringify(row));
    return reader.observed().declined?.command;
  };
  for (const protocol of ["claude", "codex"]) {
    // Files given to a program that takes no subcommand, named as the
    // lifecycle's next dispatch and Git's worktree command are, and not.
    for (const file of ["next", "worktree", "orchard-sample"])
      assert.deepEqual(
        deniedShape(protocol, `cat ${file}`),
        [["cat", "<operand>"]],
        `${protocol}: cat ${file}`,
      );
    // A redirect's target is data, and so is a word given to a script that is
    // not the kit's, wherever it stands.
    assert.deepEqual(deniedShape(protocol, "cat notes > worktree"), [
      ["cat", "<operand>", "<operand>", "<operand>"],
    ]);
    assert.deepEqual(deniedShape(protocol, "npm run lint -- next"), [
      ["npm", "run", "<operand>", "<operand>", "<operand>"],
    ]);
    // An option value can have exactly the spelling of a script, a
    // subcommand, another option, or the start of a wrapped command.
    for (const [command, prefix, masked] of [
      [
        "node --test --test-name-pattern 'drive.mjs' scripts/test-drive.mjs",
        ["node", "<flag>"],
        3,
      ],
      [
        "node --require release.mjs scripts/drive.mjs why",
        ["node", "<flag>"],
        3,
      ],
      ["git --git-dir worktree status", ["git", "<flag>"], 2],
      ["git log --grep --oneline", ["git", "log", "<flag>"], 1],
      ["npm --workspace run run resume -- status", ["npm", "<flag>"], 5],
      ["env -u git node scripts/harness.mjs usage", ["env", "<flag>"], 4],
      [
        "node scripts/harness.mjs bounded -- env -u git node",
        ["node", "harness.mjs", "bounded", "--", "env", "<flag>"],
        2,
      ],
    ]) {
      assert.deepEqual(
        deniedShape(protocol, command),
        [[...prefix, ...Array(masked).fill("<operand>")]],
        command,
      );
    }
    // Known option arity preserves the subcommand that follows it.
    assert.deepEqual(deniedShape(protocol, "npm run resume -- next"), [
      ["npm", "run", "resume", "--", "next"],
    ]);
    assert.deepEqual(
      deniedShape(protocol, "npm --prefix worktree run resume -- status"),
      [["npm", "--prefix", "<operand>", "run", "resume", "--", "status"]],
    );
    assert.deepEqual(
      deniedShape(protocol, "npm run resume -- -- --work-order"),
      [["npm", "run", "resume", "--", "<flag>", "<operand>"]],
    );
    assert.deepEqual(
      deniedShape(
        protocol,
        "node scripts/harness.mjs read-output --show --offset 0",
      ),
      [
        [
          "node",
          "harness.mjs",
          "read-output",
          "<operand>",
          "--offset",
          "<operand>",
        ],
      ],
    );
    assert.deepEqual(deniedShape(protocol, "node >scripts/drive.mjs why"), [
      ["node", "<operand>", "<operand>"],
    ]);
    assert.deepEqual(
      deniedShape(protocol, "node scripts/drive.mjs why WO-999"),
      [["node", "drive.mjs", "why", "<operand>"]],
    );
    assert.deepEqual(deniedShape(protocol, "printenv DOTLN_LAUNCHPAD"), [
      ["printenv", "<operand>"],
    ]);
    for (const conditional of [
      '[[ "" == x || git == git ]]',
      "zsh -lc '[[ cat == git && node == node ]]'",
      "(( 1 || git ))",
      "git() { :; }; true",
      "labels=(git node); printf done",
    ])
      assert.equal(deniedShape(protocol, conditional), null, conditional);
    // A redirection the shell reads as one operator, which this reader
    // would split at its bar, leaves the target where a program stands: no
    // shape is kept of such a line, whatever the target is named.
    for (const clobbered of [
      "printf ok >| git",
      "echo x >| scripts/drive.mjs",
      "printf ok 2>| node",
      "printf ok >>| git",
      "printf ok &>| git",
      "printf ok >&| git",
      "printf ok >| git status",
      "git status >| node scripts/drive.mjs why",
      // The operator set against the word before it, and after a line
      // the shell joins to the next.
      "printf ok>| git",
      "printf ok\\\n>| git",
      "printf ok 2>&1>| git",
      // A redirection left with no target, which the shell refuses: the
      // words after it are no command's.
      "printf ok > ; git status",
      "printf ok > | git status",
      "printf ok >\ngit status",
      "printf ok >& | git status",
      // A comment opened straight after the operator, which leaves it
      // without a target: the comment's words are no command's.
      "printf ok >#x; git status",
      "printf ok 2>#x | git status",
      // Quoting whose escapes this reader does not follow: to the shell
      // the second line is one command with one argument.
      "printf $'a b' git",
      "printf $'a\\' ; git status #'",
    ])
      assert.equal(deniedShape(protocol, clobbered), null, clobbered);
    // A redirection that has its target, and a pipe after a finished one,
    // are read as before.
    assert.deepEqual(deniedShape(protocol, "printf ok > git"), [
      ["printf", "<operand>", "<operand>", "<operand>"],
    ]);
    assert.deepEqual(deniedShape(protocol, "printf ok 2>&1 | git status"), [
      ["printf", "<operand>", "<operand>"],
      ["git", "status"],
    ]);
    assert.deepEqual(
      deniedShape(protocol, "env -- 'sample-key=./scratch/drive.mjs' cat"),
      [["env", "--", "<assignment>", "cat"]],
    );
    assert.deepEqual(
      deniedShape(protocol, "PATH+=./scratch/drive.mjs printf test"),
      [["<assignment>", "printf", "<operand>"]],
    );
    assert.deepEqual(
      deniedShape(protocol, "git --no-pager worktree list next"),
      [["git", "--no-pager", "worktree", "list", "<operand>"]],
    );
    // A search is data however it is spelled: a pattern that names a kit
    // script, given to a program the grammar does not know, and a kit flag's
    // name searched for after `--` has ended the options.
    assert.deepEqual(deniedShape(protocol, "rg 'drive.mjs' scripts"), [
      ["<operand>", "<operand>", "<operand>"],
    ]);
    assert.deepEqual(
      deniedShape(protocol, "grep -F -- --work-order docs/KIT.md"),
      [["grep", "-F", "--", "<operand>", "<operand>"]],
    );
  }
  // Older records discarded position evidence before saving the words.
  // Their layout still distinguishes failed commands for the frequency count.
  const older = driveAccount({
    order: "WO-999",
    record: {
      host: "claude",
      stop: { reason: "dispatch-refused", next: "x" },
      attempts: [
        {
          phase: "active",
          action: "next",
          host: "claude",
          startedAt: "2026-11-17T14:00:00.000Z",
          finishedAt: "2026-11-17T14:05:00.000Z",
          timeoutMs: 28_800_000,
          exitCode: 0,
          exitSignal: null,
          error: true,
          timedOut: false,
          refusalCodes: [],
          completed: false,
          phaseAfter: "active",
          declined: {
            kind: "unclassified-shell",
            command: [["node", "<flag>", "<flag>", "drive.mjs", "<operand>"]],
            tool: "Bash",
            actor: "worker",
            decisionSource: "rule",
            atMs: 60_000,
          },
          commandResults: [
            {
              kind: "unclassified-shell",
              status: "failed",
              shape: [["cat", "worktree"]],
            },
            {
              kind: "unclassified-shell",
              status: "failed",
              shape: [["npm", "run", "<operand>", "--", "next"]],
            },
            {
              kind: "unclassified-shell",
              status: "failed",
              shape: [["node", "drive.mjs", "why", "<operand>"]],
            },
          ],
        },
      ],
    },
  }).join("\n");
  assert.match(
    older,
    /Ended by: the host denied the shell command `<word> <flag> <flag> <word> <operand>`, which the phase worker made/u,
  );
  for (const shape of [
    "`<word> <word>` ×1",
    "`<word> <word> <operand> <flag> <word>` ×1",
    "`<word> <word> <word> <operand>` ×1",
  ])
    assert.equal(older.includes(shape), true, `${shape}\n---\n${older}`);
  for (const kept of ["drive.mjs <operand>", "`cat worktree`", "-- next`"])
    assert.equal(older.includes(kept), false, kept);
  // The two searches as the vocabulary before this grammar stored them.
  const searches = driveAccount({
    order: "WO-999",
    record: {
      host: "codex",
      stop: { reason: "incomplete-bound", next: "x" },
      attempts: [
        {
          phase: "active",
          action: "next",
          host: "codex",
          startedAt: "2026-11-17T14:00:00.000Z",
          finishedAt: "2026-11-17T14:05:00.000Z",
          timeoutMs: 28_800_000,
          exitCode: 0,
          exitSignal: null,
          error: false,
          timedOut: false,
          refusalCodes: [],
          completed: false,
          phaseAfter: "active",
          commandResults: [
            {
              kind: "unclassified-shell",
              status: "failed",
              shape: [["<operand>", "drive.mjs", "<operand>"]],
            },
            {
              kind: "unclassified-shell",
              status: "failed",
              shape: [["grep", "<operand>", "--", "--work-order", "<operand>"]],
            },
          ],
        },
      ],
    },
  }).join("\n");
  for (const shape of [
    "`<operand> <word> <operand>` ×1",
    "`<word> <operand> <flag> <flag> <operand>` ×1",
  ])
    assert.equal(searches.includes(shape), true, `${shape}\n---\n${searches}`);
  for (const kept of ["drive.mjs <operand>`", "--work-order"])
    assert.equal(searches.includes(kept), false, kept);
});

test("WO-287 criteria D3 and D4: the real driver starts a Claude phase with the wait uncapped, stops at the worker's own denied call, and says why in its result and in what its command prints", async () => {
  const base = realpathSync(
    createFixtureRoot(join(tmpdir(), "dotln-drive-account-")),
  );
  const kept = {
    PATH: process.env.PATH,
    ceiling: process.env[BACKGROUND_WAIT_CEILING],
    deadline: process.env.DOTLN_DRIVE_DEADLINE_AT,
    scenario: process.env.DOTLN_STAND_IN_SCENARIO,
    seen: process.env.DOTLN_STAND_IN_SEEN,
  };
  const log = console.log;
  try {
    const f = fixture(base);
    f.mapClone();
    f.start();
    // The fixture's order worktree carries the kit's library and no installed
    // harness, and a phase launch checks one: install it as the emit does.
    const kit = await import(
      pathToFileURL(join(f.orderRoot, "scripts/lib/harness.mjs"))
    );
    write(
      f.orderRoot,
      "CLAUDE.md",
      "# Fixture floor\nKeep fixture source isolated.\n",
    );
    kit.emitHarness(f.orderRoot, {
      runtimeRoot: f.orderRoot,
      overlay: kit.readBuildOverlay(f.orderRoot),
    });
    const bin = join(base, "stand-in-bin");
    mkdirSync(bin);
    // The stand-in for the host's program: it plays the scenario's rows and
    // records the one value of its environment the drive sets for it.
    writeFileSync(
      join(bin, "claude"),
      `#!${process.execPath}
const fs = require("node:fs");
const rows = JSON.parse(fs.readFileSync(process.env.DOTLN_STAND_IN_SCENARIO, "utf8"));
fs.appendFileSync(process.env.DOTLN_STAND_IN_SEEN, (process.env.CLAUDE_CODE_PRINT_BG_WAIT_CEILING_MS ?? "unset") + "\\n");
for (const row of rows) process.stdout.write(JSON.stringify(row) + "\\n");
setTimeout(() => process.exit(0), 300);
`,
    );
    chmodSync(join(bin, "claude"), 0o755);
    const scenario = join(base, "scenario.json");
    const seen = join(base, "seen.txt");
    process.env.PATH = [bin, kept.PATH].join(delimiter);
    process.env.DOTLN_STAND_IN_SCENARIO = scenario;
    process.env.DOTLN_STAND_IN_SEEN = seen;
    delete process.env[BACKGROUND_WAIT_CEILING];
    delete process.env.DOTLN_DRIVE_DEADLINE_AT;
    writeFileSync(
      scenario,
      JSON.stringify([
        { type: "system", subtype: "init", model: "stand-in" },
        {
          type: "assistant",
          message: {
            content: [
              {
                type: "tool_use",
                id: "read",
                name: "Bash",
                input: {
                  command:
                    "ls private-a private-b private-c && cat private-d && node --test --test-name-pattern 'drive.mjs' scripts/test-drive.mjs",
                },
              },
            ],
          },
        },
        {
          type: "system",
          subtype: "permission_denied",
          tool_name: "Bash",
          tool_use_id: "read",
          decision_reason_type: "classifier",
        },
      ]),
    );
    const printed = [];
    console.log = (line) => printed.push(String(line));
    await driveMain(["WO-999", "--host", "claude"], f.main);
    console.log = log;
    const result = JSON.parse(printed.at(-1));
    assert.equal(result.stop.reason, "dispatch-refused");
    assert.equal(result.attempts, 1);
    assert.equal(readFileSync(seen, "utf8"), "0\n");
    const record = readDriveRecord(f.main, "WO-999");
    assert.equal(record.attempts[0].commandShapeVersion, COMMAND_SHAPE_VERSION);
    assert.deepEqual(record.attempts[0].declined.command.at(-1), [
      "node",
      "<flag>",
      "<operand>",
      "<operand>",
      "<operand>",
    ]);
    assert.deepEqual(record.attempts[0].backgroundWait, {
      ceilingMs: 0,
      source: "drive",
    });
    assert.equal(record.attempts[0].declined.actor, "worker");
    // The driver's own result carries the account, and the command prints
    // the same lines.
    const account = readDriveAccount(f.main, "WO-999", () =>
      driveStatus(f.main, "WO-999"),
    );
    assert.deepEqual(result.why, account);
    const text = account.join("\n");
    for (const line of [
      "WO-999: the last drive stopped at dispatch-refused, with 1 phase attempt recorded on claude.",
      "Ended by: the host denied the shell command `ls <operand> <operand> <operand> ; cat <operand> ; node <flag> <operand> <operand> <operand>`, which the phase worker made, decided by the host's automatic review,",
      "Background work: the host waits for it after the worker's last turn without a cap (set by the drive).",
      "Recorded, as the drive saw it when the attempt ended: no completion of the phase; the order stood at phase active.",
      "Kept beside the record: the worker's raw stream and what its process printed (",
      "Next: either type resume: next in a session in the order's worktree,",
    ])
      assert.equal(text.includes(line), true, `${line}\n---\n${text}`);
    assert.equal(text.includes("private"), false);
    const asked = [];
    console.log = (line) => asked.push(String(line));
    await driveMain(["why", "WO-999"], f.main);
    console.log = log;
    assert.equal(asked.join("\n"), text);
    // A ceiling the drive's own environment sets is the one the worker gets.
    process.env[BACKGROUND_WAIT_CEILING] = "1800000";
    writeFileSync(
      scenario,
      JSON.stringify([
        { type: "system", subtype: "init", model: "stand-in" },
        { type: "result", is_error: false },
      ]),
    );
    writeFileSync(seen, "");
    console.log = () => {};
    const again = await runDrive(f.main, "WO-999", {
      host: "claude",
      onTransition: () => {},
    });
    console.log = log;
    // The worker ended twice without a completion, which stops the drive.
    assert.equal(again.stop.reason, "incomplete-bound");
    assert.equal(readFileSync(seen, "utf8"), "1800000\n1800000\n");
    assert.deepEqual(again.attempts.at(-1).backgroundWait, {
      ceilingMs: 1800000,
      source: "environment",
    });
    const stopped = readDriveAccount(f.main, "WO-999", () =>
      driveStatus(f.main, "WO-999"),
    ).join("\n");
    assert.match(
      stopped,
      /stopped at incomplete-bound, with 3 phase attempts/u,
    );
    assert.match(stopped, /Ended by: nothing the drive saw go wrong/u);
    // An attempt whose process ended cleanly without recording its phase
    // keeps its raw stream, which is the one account of what its worker did.
    const unfinished = again.attempts.at(-1);
    assert.equal(unfinished.completed, false);
    assert.equal(unfinished.retainedPending, undefined);
    assert.equal(existsSync(unfinished.retained.events), true);
    assert.match(
      stopped,
      /Kept beside the record: the worker's raw stream and what its process printed \(/u,
    );
    assert.match(
      stopped,
      /Background work: the host waits for it after the worker's last turn for at most 0 h 30 min \(set by the environment the drive ran in\)\./u,
    );
    // Replay the two spellings an earlier writer could leave on disk. The
    // account masks both the denial and the failed-command counts on read.
    const legacy = record.attempts[0];
    legacy.declined.command = [
      ["node", "<flag>", "<flag>", "drive.mjs", "<operand>"],
    ];
    legacy.commandResults = [
      {
        status: "failed",
        shape: [["node", "drive.mjs", "why"]],
      },
    ];
    // What a version-3 writer kept of `printf ok >| git`: it split the
    // redirection at its bar and left the target where a program stands.
    // Read as an older shape it names no program; only a current writer's
    // word is taken for one.
    const split = [["printf", "<operand>", "<operand>"], ["git"]];
    assert.deepEqual(judgedShape(split, 3), [
      ["<word>", "<operand>", "<operand>"],
      ["<word>"],
    ]);
    assert.deepEqual(judgedShape(split, COMMAND_SHAPE_VERSION), split);
    const file = driveRecordPath(f.main, "WO-999");
    for (const version of [undefined, 2, 3, COMMAND_SHAPE_VERSION + 1]) {
      legacy.commandShapeVersion = version;
      const stored = JSON.stringify(record);
      writeFileSync(file, stored);
      asked.length = 0;
      console.log = (line) => asked.push(String(line));
      await driveMain(["why", "WO-999"], f.main);
      const replay = asked.join("\n");
      assert.match(
        replay,
        /shell command `<word> <flag> <flag> <word> <operand>`/u,
      );
      assert.match(replay, /1 failed; most often `<word> <word> <word>` ×1/u);
      assert.equal(readFileSync(file, "utf8"), stored);
    }
  } finally {
    console.log = log;
    for (const [name, value] of [
      ["PATH", kept.PATH],
      [BACKGROUND_WAIT_CEILING, kept.ceiling],
      ["DOTLN_DRIVE_DEADLINE_AT", kept.deadline],
      ["DOTLN_STAND_IN_SCENARIO", kept.scenario],
      ["DOTLN_STAND_IN_SEEN", kept.seen],
    ])
      if (value === undefined) delete process.env[name];
      else process.env[name] = value;
    rmSync(base, { recursive: true, force: true });
  }
});

test("WO-287 criterion D4: an attempt that ends cleanly keeps its raw stream until the drive knows whether its phase completed, and then only where it did not", async () => {
  const base = realpathSync(
    createFixtureRoot(join(tmpdir(), "dotln-drive-kept-stream-")),
  );
  try {
    const clean = (name, keepUntilSettled) =>
      launchPhase({
        command: process.execPath,
        protocol: "claude",
        args: [
          "-e",
          `console.log(JSON.stringify({ type: "result", is_error: false }));`,
        ],
        cwd: process.cwd(),
        env: process.env,
        timeoutMs: 5000,
        capture: {
          directory: base,
          name,
          ...(keepUntilSettled ? { keepUntilSettled } : {}),
        },
      });
    // Without the driver's asking, a clean end keeps nothing, as before.
    const plain = await clean("plain", false);
    assert.equal(plain.error, false);
    assert.equal(plain.retained, null);
    assert.equal(plain.retainedPending, undefined);
    assert.equal(existsSync(join(base, "plain.events.jsonl")), false);
    // Asked, it keeps the capture and marks it as waiting on the driver.
    const unfinished = await clean("unfinished", true);
    assert.equal(unfinished.retainedPending, true);
    assert.equal(existsSync(unfinished.retained.events), true);
    settleAttempt(unfinished, "next", {
      phase: "active",
      route: { stop: null },
    });
    assert.equal(unfinished.completed, false);
    assert.equal(unfinished.phaseAfter, "active");
    assert.equal(unfinished.retainedPending, undefined);
    assert.equal(existsSync(unfinished.retained.events), true);
    const finished = await clean("finished", true);
    const kept = finished.retained.events;
    assert.equal(existsSync(kept), true);
    settleAttempt(finished, "next", {
      phase: "ready-to-verify",
      route: { stop: null },
    });
    assert.equal(finished.completed, true);
    assert.equal(finished.phaseAfter, "ready-to-verify");
    assert.equal(finished.retained, null);
    assert.equal(existsSync(kept), false);
    // A cancelled drive settles nothing: its attempt keeps the stream and
    // loses the mark that says the stream waits on a judgment.
    const cancel = new AbortController();
    const cancelled = { attempts: [], incomplete: {} };
    await driveLoop({
      record: cancelled,
      signal: cancel.signal,
      status: () => ({
        phase: "active",
        route: routeOrder({ phase: "active" }),
      }),
      launch: async () => {
        const ended = await clean("cancelled", true);
        cancel.abort();
        return ended;
      },
    });
    assert.equal(cancelled.attempts.length, 1);
    assert.equal(cancelled.attempts[0].retainedPending, undefined);
    assert.equal(cancelled.attempts[0].completed, undefined);
    assert.equal(existsSync(cancelled.attempts[0].retained.events), true);
    // A failed attempt's capture waits on nothing: it is kept either way.
    const failed = await launchPhase({
      command: process.execPath,
      protocol: "claude",
      args: ["-e", "process.exit(3)"],
      cwd: process.cwd(),
      env: process.env,
      timeoutMs: 5000,
      capture: { directory: base, name: "failed", keepUntilSettled: true },
    });
    assert.equal(failed.error, true);
    assert.equal(failed.retainedPending, undefined);
  } finally {
    rmSync(base, { recursive: true, force: true });
  }
});

test("WO-287 criterion D4: every refusal code a source of the kit writes is one the drive's reader keeps, a plan-first refusal of a write among them", () => {
  // The codes as the kit's sources hold them, read from the files.
  const sources = [
    ...[
      "packages/skeleton/src",
      "packages/compiler/src",
      "scripts/lib",
    ].flatMap((directory) =>
      readdirSync(directory)
        .filter((name) => /\.(?:ts|mjs)$/u.test(name))
        .map((name) => join(directory, name)),
    ),
    ...readdirSync("scripts")
      .filter((name) => name.endsWith(".mjs") && !name.startsWith("test-"))
      .map((name) => join("scripts", name)),
    // The drive's own modules are no source: they read refusals and write
    // none, and read with the others they would vouch for whatever name
    // they hold, the reader's list first of all.
  ].filter(
    (file) => !/^scripts\/(?:lib\/drive-[a-z-]+|drive)\.mjs$/u.test(file),
  );
  // A code is a name that ends as a refusal or a bound does, or any name
  // that opens a quoted message, whatever it ends in.
  const written = new Set(
    sources.flatMap((file) => {
      const text = readFileSync(file, "utf8");
      return [
        ...(text.match(/\bDOTLN_[A-Z_]+(?:_REFUSED|_BOUND)\b/gu) ?? []),
        ...[...text.matchAll(/[`"'](DOTLN_[A-Z_]+): /gu)].map(
          (match) => match[1],
        ),
      ];
    }),
  );
  assert.equal(written.size >= 16, true, [...written].join(" "));
  assert.equal(written.has("DOTLN_WORKER_TASKS_RUNNING"), true);
  assert.deepEqual(
    [...written].filter((code) => !REFUSAL_CODES.has(code)),
    [],
  );
  // And the list holds nothing the sources do not write: a name a test
  // makes up to stand for a code that is no code of the kit stays out.
  assert.deepEqual(
    [...REFUSAL_CODES].filter((code) => !written.has(code)),
    [],
  );
  // A plan-first refusal answers a write, which has no shell command: its
  // result is where it is counted, and nothing of its reason is kept.
  const reader = streamObservation({
    protocol: "claude",
    launchpad: process.cwd(),
  });
  for (const row of [
    {
      message: {
        content: [
          {
            type: "tool_use",
            id: "early-write",
            name: "Write",
            input: { file_path: "/private/implementation.ts" },
          },
        ],
      },
    },
    {
      message: {
        content: [
          {
            type: "tool_result",
            tool_use_id: "early-write",
            is_error: true,
            content:
              "DOTLN_PLAN_FIRST_REFUSED: private reason naming /private/implementation.ts",
          },
        ],
      },
    },
  ])
    reader.inspect(JSON.stringify(row));
  const observed = reader.observed();
  assert.deepEqual(observed.refusalCodes, ["DOTLN_PLAN_FIRST_REFUSED"]);
  assert.deepEqual(observed.refusalCounts, { DOTLN_PLAN_FIRST_REFUSED: 1 });
  assert.equal(JSON.stringify(observed).includes("private"), false);
  const account = driveAccount({
    order: "WO-999",
    record: {
      host: "claude",
      stop: { reason: "incomplete-bound", next: "x" },
      attempts: [
        {
          action: "next",
          host: "claude",
          startedAt: "2026-11-17T14:00:00.000Z",
          finishedAt: "2026-11-17T14:05:00.000Z",
          exitCode: 0,
          completed: false,
          phaseAfter: "active",
          backgroundWait: { ceilingMs: 0, source: "drive" },
          ...observed,
        },
      ],
    },
  }).join("\n");
  assert.match(
    account,
    /The kit's own guard, not the host, refused calls in the attempt: DOTLN_PLAN_FIRST_REFUSED ×1\./u,
  );
  // The stop a refusal names is read from the sentence the kit's own writer
  // makes, so a change of that sentence fails here and not in silence.
  assert.deepEqual(
    [
      ...refusalFindings(
        stopRefusal("driven-helper", "DOTLN_HARNESS_REFUSED: a refusal"),
      ).stops,
    ],
    ["driven-helper"],
  );
  assert.deepEqual(
    [
      ...refusalFindings(
        stopRefusal("outside-write", "DOTLN_HARNESS_REFUSED: another", {
          hook: true,
        }),
      ).stops,
    ],
    ["outside-write"],
  );
  // The emitted target hook writes the same sentence by hand for a runtime
  // it cannot reach, with a semicolon after the stop's id.
  assert.deepEqual(
    [
      ...refusalFindings(
        "DOTLN_TARGET_RUNTIME_REFUSED: target runtime unavailable at input. This is stop target-runtime; its level is this root's owner's to set.",
      ).stops,
    ],
    ["target-runtime"],
  );
  // A denied tool is named when the kit's table of host tools holds it.
  for (const name of ["Bash", "Write", "Workflow", "TodoWrite", "TaskStop"])
    assert.equal(deniedTool(name), name);
  assert.equal(deniedTool("exec_command"), "other");
  // One helper composes a refusal with its reason, and a thrown message
  // loses its absolute paths and keeps the kit's own.
  assert.equal(refusalWithReason("Refused.", undefined), "Refused.");
  assert.equal(
    refusalWithReason("Refused.", "the phase's dispatch bound is reached."),
    "Refused. The kit's reason: the phase's dispatch bound is reached.",
  );
  assert.equal(
    withoutAbsolutePaths(
      "ENOENT: no such file or directory, open '/private/home/someone/project/docs/control/local/drives/WO-999.json'",
    ),
    "ENOENT: no such file or directory, open '<path>'",
  );
  assert.equal(
    withoutAbsolutePaths(
      "Inspect it with node scripts/harness.mjs writer --show; see docs/control/budgets.json.",
    ),
    "Inspect it with node scripts/harness.mjs writer --show; see docs/control/budgets.json.",
  );
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
    ["node", "release.mjs", "close", "<operand>", "--publish"],
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
  // No phase but a release close adds a rule of its own to the host's.
  assert.equal(
    settingsOf(sandboxLaunchForm("claude", "host")).permissions,
    undefined,
  );
});

test("WO-287 the operator's direction of 18 November: a Claude release-close phase starts with the exact helper command allowed by a narrow rule for its own order, and nothing else is added for any other phase", () => {
  const base = realpathSync(
    createFixtureRoot(join(tmpdir(), "dotln-drive-close-rules-")),
  );
  try {
    const main = join(base, "launchpad");
    mkdirSync(main);
    // The rules are the helper as the kit's one printer spells it, in the
    // two modes the kit's hook admits, and for the one order.
    const rules = releaseCloseAllowRules(main, "WO-999");
    assert.deepEqual(rules, [
      `Bash(${releaseCloseCommand(main, "WO-999", "--publish")})`,
      `Bash(${releaseCloseCommand(main, "WO-999", "--dry-run")})`,
    ]);
    for (const rule of rules) {
      assert.equal(rule.includes("*"), false, "an exact rule, no wildcard");
      assert.equal(rule.includes("WO-998"), false);
    }
    // A launchpad reached through a link is named both ways, since the
    // helper is spelled with the path the main checkout reports.
    const link = join(base, "link");
    symlinkSync(main, link);
    assert.deepEqual(releaseCloseAllowRules(link, "WO-999"), [
      `Bash(${releaseCloseCommand(link, "WO-999", "--publish")})`,
      `Bash(${releaseCloseCommand(link, "WO-999", "--dry-run")})`,
      ...rules,
    ]);
    // No order, or a word that is no order, adds nothing.
    assert.deepEqual(releaseCloseAllowRules(main, undefined), []);
    assert.deepEqual(releaseCloseAllowRules(main, "WO-999 --publish; x"), []);
    // The launch carries them in its one-session settings, beside the
    // sandbox form, and carries none where none is given.
    const definition = { model: "m", effort: "xhigh", prompt: "ROLE" };
    const launch = (role, allow) => {
      const args = claudeLaunchArgs({
        worker: "worker",
        definitions: "/agents.json",
        role,
        directories: [main],
        definition,
        profile: nativeProfile({
          launchpad: main,
          role,
          phrase: "resume: release close",
          cwd: main,
          worker: "worker",
          definition,
        }),
        form: sandboxLaunchForm("claude", "host"),
        dollarLimit: null,
        phrase: "resume: release close",
        ...(allow ? { allow } : {}),
      });
      return JSON.parse(args[args.indexOf("--settings") + 1]);
    };
    assert.deepEqual(launch("release-close", rules).permissions, {
      allow: rules,
    });
    assert.equal(launch("release-close").permissions, undefined);
    assert.equal(launch("executor").permissions, undefined);
  } finally {
    rmSync(base, { recursive: true, force: true });
  }
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
  // A program given by its path is named without the directories.
  assert.deepEqual(
    commandShape(
      "/usr/local/bin/node /launchpad/scripts/release.mjs close WO-999 --publish",
    ),
    [["node", "release.mjs", "close", "<operand>", "--publish"]],
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

test("a repair a retraction opened reads no earlier cycle's failing report", () => {
  const base = realpathSync(
    createFixtureRoot(join(tmpdir(), "dotln-drive-retraction-")),
  );
  try {
    const f = fixture(base);
    f.mapClone();
    f.start();
    // An earlier cycle's failing report holds an operator-route finding.
    const reportPath = "records/verifications/WO-999/VER-001.md";
    const bytes =
      '# Verification\n\n<!-- dotln-findings:start -->\n[{"id": "F1", "route": "operator", "summary": "A choice only the operator makes."}]\n<!-- dotln-findings:end -->\n';
    write(f.orderRoot, reportPath, bytes);
    const failed = {
      type: "VerificationCompleted",
      workOrderId: "WO-999",
      verificationId: "VER-001",
      reportPath,
      reportHash: `sha256:${createHash("sha256").update(bytes).digest("hex")}`,
      verdict: "fail",
    };
    const facts = (failureSourceId) =>
      routeFacts(
        f.orderRoot,
        {
          phase: "needs-fix",
          workOrderId: "WO-999",
          repositoryId: "target",
          failureSourceId,
        },
        [failed],
      );
    assert.equal(facts("VER-001").operatorFinding, true);
    // A retraction that returned the order to repair is no report, so the
    // earlier report's finding does not stop the drive (WO-249).
    assert.equal(facts("retraction-12").operatorFinding, undefined);
    assert.equal(
      routeOrder(
        { phase: "needs-fix", failureSourceId: "retraction-12" },
        [failed],
        facts("retraction-12"),
      ).action,
      "fix",
    );
  } finally {
    rmSync(base, { recursive: true, force: true });
  }
});
