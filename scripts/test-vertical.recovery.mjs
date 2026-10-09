// The recovery cases share the vertical row and its two existing process lanes.
import test from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { decodeLog } from "@dotln/kernel";
import { WorkerStore } from "../packages/skeleton/dist/src/worker-store.js";
import { VerticalHost } from "../packages/skeleton/dist/src/vertical-host.js";
import { WorkerFailure } from "../packages/skeleton/dist/src/worker-protocol.js";
import {
  CodexCliExecWorkOrderTransport,
  runWorkerProcess,
} from "../packages/skeleton/dist/src/worker-transport.js";
import {
  verticalFixture,
  runState,
  put,
} from "./fixtures/vertical/fixture.mjs";
import {
  runVerticalIssue,
  readVerticalConfiguration,
} from "./lib/vertical-runtime.mjs";
import {
  crashRecovery,
  revokeRecovery,
} from "./fixtures/vertical/recovery.mjs";

const PRELOAD = new URL(
  "./fixtures/vertical/interrupt-preload.mjs",
  import.meta.url,
).pathname;
const CLI = new URL("../packages/skeleton/dist/src/dotln.js", import.meta.url)
  .pathname;
const HOST_CALL_PRELOAD = new URL(
  "./fixtures/vertical/host-call-preload.mjs",
  import.meta.url,
).pathname;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** The real CLI over the fixture store, with the preload's actor doubles. */
function cli(f, settings, { grouped = false } = {}) {
  const child = spawn(
    process.execPath,
    [
      "--import",
      PRELOAD,
      "--import",
      HOST_CALL_PRELOAD,
      CLI,
      "vertical",
      "1",
      "--store",
      f.directory,
    ],
    {
      env: {
        ...process.env,
        DOTLN_LAUNCHPAD: f.launchpad,
        DOTLN_LIVE_WORKERS: "1",
        DOTLN_INTERRUPT_FIXTURE: settings,
      },
      stdio: ["ignore", "pipe", "pipe"],
      detached: grouped,
    },
  );
  let stdout = "",
    stderr = "";
  child.stdout.on("data", (data) => {
    stdout += data;
  });
  child.stderr.on("data", (data) => {
    stderr += data;
  });
  const done = new Promise((resolve, reject) => {
    child.once("error", reject);
    child.once("close", (code, signal) =>
      resolve({ code, signal, stdout, stderr }),
    );
  });
  return { child, done };
}
/** `done`, or a rejection once `ms` have passed. */
const within = (done, ms, message) =>
  Promise.race([
    done,
    new Promise((_, reject) => {
      const timer = setTimeout(() => reject(new Error(message)), ms);
      void done.finally(() => clearTimeout(timer)).catch(() => {});
    }),
  ]);
/** Polls `read` until it returns a truthy value or `ms` have passed. */
async function until(read, ms, message) {
  const deadline = Date.now() + ms;
  for (;;) {
    const value = read();
    if (value) return value;
    if (Date.now() >= deadline) throw new Error(message);
    await sleep(10);
  }
}
const gone = (pid) => {
  try {
    process.kill(pid, 0);
    return false;
  } catch (error) {
    return error.code === "ESRCH";
  }
};
/** Runs `count` steps in process through the fixture's actors. The clock
 * ticks: deliverable readiness orders the baseline before the implementation. */
const steps = (f, count, external = f.external) =>
  runVerticalIssue({
    directory: f.directory,
    issue: 1,
    configuration: readVerticalConfiguration(f.directory, f.launchpad),
    now: () => {
      f.tick();
      return f.now();
    },
    external,
    steps: count,
  });
/** The fixture's actors under the transport identities the real CLI recorded,
 * as both real entries share the configured transport. */
const matchingActors = (f, identity) => {
  const named = (actor) => ({ ...actor, ...identity });
  return {
    ...f.external,
    writer: new CodexCliExecWorkOrderTransport(
      (launch) =>
        runWorkerProcess({
          ...launch,
          binary: process.execPath,
          args: [
            new URL("./fixtures/vertical/writer.mjs", import.meta.url).pathname,
          ],
        }),
      identity.harnessVersion,
    ),
    verifier: named(f.external.verifier),
    reviewer: named(f.external.reviewer),
  };
};
/** Stops a fixture writer's group: the recorded group, or the group of the
 * pid the sleeping writer double published before the record was read. */
async function stopWriter(group, ready) {
  let target = group;
  if (!target && existsSync(ready)) {
    const { readHostSnapshot } = await import("./lib/host-resources.mjs");
    target = readHostSnapshot({ footprint: false }).processes.find(
      (row) => row.pid === Number(readFileSync(ready, "utf8")),
    )?.pgid;
  }
  if (target)
    try {
      process.kill(-target, "SIGKILL");
    } catch {}
}

test("WO-199 dotln vertical forwards SIGINT, SIGTERM and SIGHUP and resumes the same issue", async () => {
  for (const [signal, expectedCode] of [
    ["SIGINT", 130],
    ["SIGTERM", 143],
    ["SIGHUP", 129],
  ]) {
    const f = await verticalFixture();
    let child, group;
    try {
      const state = await steps(f, 5);
      assert.ok(state.receipts, JSON.stringify(state));
      assert.equal(state.receipts.at(-1).command.step, "baseline");
      const ready = join(f.root, "writer-ready"),
        settings = join(f.root, "interrupt.json");
      put(settings, {
        at: f.now() + 1,
        ready,
        sleep: true,
        ...(signal === "SIGINT" ? { ignoreSignal: signal } : {}),
      });
      const first = cli(f, settings);
      child = first.child;
      const source = new WorkerStore(
        join(f.directory, "vertical", state.binding.key, "source"),
      );
      const started = await until(
        () => {
          const row = decodeLog(source.read()).find(
            (event) => event.type === "SourceChangeProcessStarted",
          );
          return row && existsSync(ready) ? row : undefined;
        },
        10_000,
        "the real CLI launched and recorded its writer",
      );
      group = started.payload.processGroup;
      const { readHostSnapshot } = await import("./lib/host-resources.mjs");
      assert.equal(
        readHostSnapshot({ footprint: false }).processes.find(
          (row) => row.pid === Number(readFileSync(ready, "utf8")),
        )?.pgid,
        group,
      );
      const host = child;
      host.kill(signal);
      // A repeated signal never extends the wait: the host ignores it, and
      // the writer that ignores SIGINT is still stopped within the bound.
      if (signal === "SIGINT") setTimeout(() => host.kill(signal), 1_000);
      const stopped = await within(
        first.done,
        10_000,
        "interrupted vertical exceeded 10 seconds",
      );
      assert.equal(stopped.code, expectedCode, stopped.stderr);
      assert.throws(() => process.kill(-group, 0), { code: "ESRCH" });
      const rows = decodeLog(source.read());
      const interruption = rows.find(
        (event) => event.type === "WorkerInterrupted",
      );
      assert.equal(interruption?.payload.signal, signal);
      assert.equal(interruption?.payload.reason, "interrupted");
      assert.ok(
        rows.find((event) => event.type === "SourceChangeProcessStopped"),
      );
      const pending = runState(f.directory, state.binding.key);
      assert.equal(pending.terminal, null);
      assert.equal(pending.pending.step, "source-change");
      put(settings, { at: f.now() + 2, ready, sleep: false });
      const rerun = cli(f, settings);
      child = rerun.child;
      const resumed = await rerun.done;
      assert.equal(resumed.code, 0, `${resumed.stderr}\n${resumed.stdout}`);
      assert.equal(
        runState(f.directory, state.binding.key).terminal?.kind,
        "resolved",
      );
    } finally {
      child?.kill("SIGKILL");
      await stopWriter(group, join(f.root, "writer-ready"));
      f.close();
    }
  }
});

test("WO-199 a signal during a judgment step stops the judgment at once, keeps the step pending and a rerun resumes after its lease", async () => {
  const f = await verticalFixture();
  let child, judgment;
  try {
    const state = await steps(f, 5);
    assert.equal(state.receipts.at(-1).command.step, "baseline");
    const ready = join(f.root, "writer-ready"),
      settings = join(f.root, "interrupt.json"),
      judgmentPid = join(f.root, "judgment-pid");
    // The writer completes; the verification judgment that follows is held.
    put(settings, {
      at: f.now() + 1,
      ready,
      sleep: false,
      holdJudgment: "verification",
      judgmentPid,
    });
    const first = cli(f, settings);
    child = first.child;
    judgment = Number(
      await until(
        () => existsSync(judgmentPid) && readFileSync(judgmentPid, "utf8"),
        30_000,
        "the real CLI reached the held verification judgment",
      ),
    );
    assert.equal(gone(judgment), false);
    assert.equal(
      runState(f.directory, state.binding.key).pending?.step,
      "verification",
    );
    child.kill("SIGTERM");
    const stopped = await within(
      first.done,
      5_000,
      "interrupted judgment step exceeded 5 seconds",
    );
    assert.equal(stopped.code, 143, stopped.stderr);
    assert.match(stopped.stderr, /Vertical interrupted: SIGTERM/u);
    await until(() => gone(judgment), 2_000, "the judgment child survived");
    const verification = new WorkerStore(
      join(f.directory, "vertical", state.binding.key, "verification-0"),
    );
    const rows = decodeLog(verification.read());
    assert.equal(
      rows.find((event) => event.type === "WorkerInterrupted")?.payload.reason,
      "interrupted",
    );
    assert.equal(
      rows.filter((event) => event.type === "WorkerAttemptStarted").length,
      1,
    );
    const pending = runState(f.directory, state.binding.key);
    assert.equal(pending.terminal, null);
    assert.equal(pending.pending.step, "verification");
    // The witnesses step before the held judgment kept its receipt.
    assert.equal(pending.receipts.at(-1).command.step, "witnesses");
    // The stopped episode keeps its lease. The rerun starts 2 s inside it,
    // waits it out instead of being refused as still leased, and launches
    // the one fresh attempt once it has expired.
    const lease = Math.max(
      ...rows
        .filter((event) =>
          ["WorkerAttemptStarted", "WorkerHeartbeat"].includes(event.type),
        )
        .map((event) => event.payload.leaseExpiresAt),
    );
    put(settings, { at: lease - 2_000, ready, sleep: false });
    const rerun = cli(f, settings);
    child = rerun.child;
    const resumed = await rerun.done;
    assert.equal(resumed.code, 0, `${resumed.stderr}\n${resumed.stdout}`);
    const final = runState(f.directory, state.binding.key);
    assert.equal(final.terminal?.kind, "resolved");
    assert.equal(
      final.receipts.filter((r) => r.command.step === "verification").length,
      1,
    );
    // The round's store also holds the review that follows; the interrupted
    // verification attempt and its one fresh attempt are the two without kind.
    const after = decodeLog(verification.read());
    const expired = after.find((event) => event.type === "WorkerLeaseExpired");
    assert.ok(expired && expired.occurredAt >= lease, JSON.stringify(expired));
    const attempts = after.filter(
      (event) => event.type === "WorkerAttemptStarted",
    );
    const fresh = attempts.filter((e) => !e.payload.episodeKind);
    assert.equal(fresh.length, 2);
    assert.ok(fresh[1].occurredAt >= lease);
    assert.equal(
      attempts.filter((e) => e.payload.episodeKind === "review").length,
      1,
    );
  } finally {
    child?.kill("SIGKILL");
    if (judgment)
      try {
        process.kill(judgment, "SIGKILL");
      } catch {}
    f.close();
  }
});

test("WO-199 a signal during the observation settle wait ends the wait at once, keeps the step pending and a rerun resumes", async () => {
  const f = await verticalFixture({
    forge: { checkStates: ["IN_PROGRESS", "SUCCESS"] },
  });
  let child;
  try {
    f.config.awaitChecks = ["unit"];
    put(join(f.directory, "vertical.json"), f.config);
    const state = await steps(f, 12);
    assert.equal(state.receipts.at(-1).command.step, "publish");
    const ready = join(f.root, "writer-ready"),
      settings = join(f.root, "interrupt.json"),
      counter = join(f.root, "check-counter");
    const queries = () =>
      existsSync(counter) ? Number(readFileSync(counter, "utf8")) : 0;
    assert.equal(queries(), 0);
    put(settings, { at: f.now() + 1, ready, sleep: false });
    const first = cli(f, settings);
    child = first.child;
    await until(
      () => queries() >= 1,
      30_000,
      "the real CLI observed the declared check",
    );
    assert.equal(
      runState(f.directory, state.binding.key).pending?.step,
      "observation",
    );
    // Give the host time to enter its 15 s poll wait; the interrupt is
    // honored either way.
    await sleep(300);
    child.kill("SIGINT");
    const stopped = await within(
      first.done,
      5_000,
      "interrupted settle wait exceeded 5 seconds",
    );
    assert.equal(stopped.code, 130, stopped.stderr);
    assert.match(stopped.stderr, /Vertical interrupted: SIGINT/u);
    assert.equal(queries(), 1);
    const pending = runState(f.directory, state.binding.key);
    assert.equal(pending.terminal, null);
    assert.equal(pending.pending.step, "observation");
    put(settings, { at: f.now() + 2, ready, sleep: false });
    const rerun = cli(f, settings);
    child = rerun.child;
    const resumed = await rerun.done;
    assert.equal(resumed.code, 0, `${resumed.stderr}\n${resumed.stdout}`);
    const final = runState(f.directory, state.binding.key);
    assert.equal(final.terminal?.kind, "resolved");
    assert.deepEqual(
      final.receipts.find((r) => r.command.step === "observation").value
        .observation.payload.checks,
      [{ name: "unit", state: "SUCCESS" }],
    );
  } finally {
    child?.kill("SIGKILL");
    f.close();
  }
});

test("WO-199 a signal during a repair writer stops its group, records the signal and a rerun resumes the repair", async () => {
  const f = await verticalFixture({
    plantReview: true,
    reviewFindings(request, count) {
      return count === 1
        ? [
            {
              class: "review",
              findingId: "one-line",
              criterionId: request.capsule.criteria[0].criterionId,
              severity: "blocking",
              observed: "fixture.txt has an extra blank line.",
              expected: "Keep fixture.txt as a single line.",
              reproductionSteps: ["Read fixture.txt and CONVENTIONS.md."],
              evidenceRefs: [
                "conventions:CONVENTIONS.md",
                "file:fixture.txt",
                "diff",
              ],
              likelySurface: ["fixture.txt"],
            },
          ]
        : [];
    },
  });
  let child, group, judgment;
  try {
    const state = await steps(f, 9);
    assert.equal(state.receipts.at(-1).command.step, "review");
    assert.equal(state.receipts.at(-1).result, "repair");
    const ready = join(f.root, "writer-ready"),
      settings = join(f.root, "interrupt.json");
    put(settings, { at: f.now() + 1, ready, sleep: true });
    const first = cli(f, settings);
    child = first.child;
    // The repair host's child source store, named by the repair order's round.
    const children = join(
      f.directory,
      "vertical",
      state.binding.key,
      "repair-0",
      "children",
    );
    let source;
    const started = await until(
      () => {
        const name = existsSync(children)
          ? readdirSync(children).find((entry) => /^source-\d+$/u.test(entry))
          : undefined;
        if (!name) return undefined;
        source = new WorkerStore(join(children, name));
        const row = decodeLog(source.read()).find(
          (event) => event.type === "SourceChangeProcessStarted",
        );
        return row && existsSync(ready) ? row : undefined;
      },
      30_000,
      "the real CLI launched and recorded the repair writer",
    );
    group = started.payload.processGroup;
    assert.equal(typeof group, "number");
    child.kill("SIGHUP");
    const stopped = await within(
      first.done,
      10_000,
      "interrupted repair writer exceeded 10 seconds",
    );
    assert.equal(stopped.code, 129, stopped.stderr);
    assert.throws(() => process.kill(-group, 0), { code: "ESRCH" });
    const rows = decodeLog(source.read());
    const interruption = rows.find(
      (event) => event.type === "WorkerInterrupted",
    );
    assert.equal(interruption?.payload.signal, "SIGHUP");
    assert.equal(interruption?.payload.reason, "interrupted");
    assert.ok(
      rows.find((event) => event.type === "SourceChangeProcessStopped"),
    );
    const pending = runState(f.directory, state.binding.key);
    assert.equal(pending.terminal, null);
    assert.equal(pending.pending.step, "repair");
    // The rerun redispatches the repair writer, which completes; the repair
    // verifier that follows is held, and the signal stops it at once.
    const judgmentPid = join(f.root, "judgment-pid");
    put(settings, {
      at: f.now() + 2,
      ready,
      sleep: false,
      holdJudgment: "verification",
      judgmentPid,
    });
    const second = cli(f, settings);
    child = second.child;
    judgment = Number(
      await until(
        () => existsSync(judgmentPid) && readFileSync(judgmentPid, "utf8"),
        30_000,
        "the rerun reached the held repair verifier",
      ),
    );
    child.kill("SIGTERM");
    const held = await within(
      second.done,
      5_000,
      "interrupted repair verifier exceeded 5 seconds",
    );
    assert.equal(held.code, 143, held.stderr);
    await until(() => gone(judgment), 2_000, "the verifier child survived");
    // The repair host names its verifier store by the derived order's round.
    const verification = new WorkerStore(
      join(
        children,
        readdirSync(children).find((entry) =>
          /^verification-\d+$/u.test(entry),
        ),
      ),
    );
    const judged = decodeLog(verification.read());
    assert.equal(
      judged.find((event) => event.type === "WorkerInterrupted")?.payload
        .reason,
      "interrupted",
    );
    assert.equal(
      runState(f.directory, state.binding.key).pending.step,
      "repair",
    );
    // The run's abort and the lease waiter never enter the recorded opening,
    // so the other entry, here the in-process actors without a signal, resumes
    // the repair the CLI opened instead of refusing it as drifted; it resumes
    // inside the stopped verifier's lease, which the repair host waits out.
    const opened = decodeLog(
      new WorkerStore(
        join(f.directory, "vertical", state.binding.key, "repair-0"),
      ).read(),
    ).find((event) => event.type === "RepairOpened");
    assert.ok(opened);
    assert.equal("signal" in opened.payload.host.source, false);
    assert.equal("awaitLease" in opened.payload.host.verifier, false);
    const lease = Math.max(
      ...judged
        .filter((event) =>
          ["WorkerAttemptStarted", "WorkerHeartbeat"].includes(event.type),
        )
        .map((event) => event.payload.leaseExpiresAt),
    );
    f.setTime(lease - 2_000);
    const final = await steps(
      f,
      20,
      matchingActors(f, opened.payload.host.source.transport),
    );
    assert.equal(
      final.terminal?.kind,
      "resolved",
      JSON.stringify(final.terminal),
    );
    const after = decodeLog(verification.read());
    const expired = after.find((event) => event.type === "WorkerLeaseExpired");
    assert.ok(expired && expired.occurredAt >= lease, JSON.stringify(expired));
    assert.equal(
      after.filter((event) => event.type === "WorkerAttemptStarted").length,
      2,
    );
    assert.equal(
      final.receipts.filter((r) => r.command.step === "repair").length,
      1,
    );
    assert.equal(
      final.receipts.filter((r) => r.command.step === "verification").length,
      2,
    );
  } finally {
    child?.kill("SIGKILL");
    await stopWriter(group, join(f.root, "writer-ready"));
    if (judgment)
      try {
        process.kill(judgment, "SIGKILL");
      } catch {}
    f.close();
  }
});

test("WO-199 a step failure caused by a terminal-wide signal is left pending as interrupted, never recorded refused", async () => {
  const f = await verticalFixture();
  try {
    const state = await steps(f, 5);
    const controller = new AbortController();
    const directory = join(f.directory, "vertical", state.binding.key);
    const host = new VerticalHost({
      directory,
      binding: state.binding,
      ports: {
        async materialize() {
          throw new Error("the run is already open");
        },
        async execute() {
          // The job-wide signal killed a synchronous child; this process
          // handles the signal only once its loop turns.
          setImmediate(() => controller.abort("SIGINT"));
          throw new Error("git: terminated by signal");
        },
      },
      now: () => {
        f.tick();
        return f.now();
      },
      signal: controller.signal,
    });
    await assert.rejects(host.run({ steps: 1 }), /terminated by signal/u);
    const pending = runState(f.directory, state.binding.key);
    assert.equal(pending.terminal, null);
    assert.equal(pending.pending.step, "source-change");
    assert.equal(pending.receipts.at(-1).command.step, "baseline");
    assert.equal(existsSync(join(directory, "host.lock")), false);
    // A step that returned despite the signal keeps its receipt, so a rerun
    // never repeats its effect; the run stops before the next step.
    const late = new AbortController();
    const kept = new VerticalHost({
      directory,
      binding: state.binding,
      ports: {
        async materialize() {
          throw new Error("the run is already open");
        },
        async execute() {
          late.abort("SIGTERM");
          return {
            result: "completed",
            value: { recorded: "despite the signal" },
          };
        },
      },
      now: () => {
        f.tick();
        return f.now();
      },
      signal: late.signal,
    });
    await assert.rejects(
      kept.run({ steps: 2 }),
      (error) => error instanceof WorkerFailure && error.code === "interrupted",
    );
    const recorded = runState(f.directory, state.binding.key);
    assert.equal(recorded.terminal, null);
    assert.deepEqual(recorded.receipts.at(-1).command.step, "source-change");
    assert.equal(recorded.receipts.at(-1).result, "completed");
    assert.equal(recorded.pending, null);
  } finally {
    f.close();
  }
});

test("WO-199 real wrapped writers recover after crash, revocation and a surviving orphan", async () => {
  for (const options of [
    { wrapped: true },
    { wrapped: false },
    { alive: true },
    { alive: true, leaderless: true },
    { alive: true, leaderless: true, grandchild: true },
  ]) {
    const row = await crashRecovery(options);
    assert.equal(row.hostSignal, "SIGKILL");
    assert.equal(typeof row.recordedProcessGroup, "number");
    assert.deepEqual(row.recovery, { status: "observed" });
    assert.equal(row.writerAlive, false);
    assert.equal(row.processStoppedRecorded, true);
    if (options.leaderless) assert.equal(row.descendantStopped, true);
  }
  const row = await revokeRecovery();
  assert.match(row.first.error, /authority was interrupted/);
  assert.equal(row.processStoppedRecorded, true);
  assert.equal(row.workerInterruptedRecorded, true);
  assert.equal(row.workerInterruptionReason, "interrupted");
  const held = await crashRecovery({ beforeRecord: true, alive: true });
  assert.equal(held.recordedProcessGroup, null);
  assert.equal(held.writerStarted, false);
  assert.deepEqual(held.recovery, { status: "observed" });
  assert.equal(held.writerAlive, false);
});

// The returned-result class, where a terminal signal during post-result
// admission becomes the writer's result, includes a runner that traps the
// signal and exits normally with a failure, and killed git reads inside
// admission.
test("WO-199 terminal signals during post-result host calls admit no observation or refusal; reruns reuse the commit without redispatch", async () => {
  for (const [kind, signal, expectedCode, trapSignal] of [
    ["focused-test", "SIGINT", 130, false],
    ["focused-test", "SIGTERM", 143, false],
    ["focused-test", "SIGHUP", 129, false],
    ["focused-test", "SIGINT", 130, true],
    ["integrity", "SIGINT", 130, false],
    ["worktree", "SIGTERM", 143, false],
    ["effect", "SIGHUP", 129, false],
  ]) {
    const f = await verticalFixture();
    let child;
    try {
      const state = await steps(f, 5);
      const settings = join(f.root, "interrupt.json"),
        marker = join(f.root, "host-call");
      put(settings, {
        at: f.now() + 1,
        ready: join(f.root, "ready"),
        sleep: false,
        hostCall: { kind, marker, trapSignal },
      });
      const first = cli(f, settings, { grouped: true });
      child = first.child;
      await until(() => existsSync(marker), 20_000, `${kind} did not start`);
      // The marker precedes spawnSync; allow its child to enter the job.
      await sleep(150);
      process.kill(-child.pid, signal);
      const stopped = await within(
        first.done,
        10_000,
        `${kind} interruption exceeded 10 s`,
      );
      assert.equal(stopped.code, expectedCode, stopped.stderr);
      const source = new WorkerStore(
        join(f.directory, "vertical", state.binding.key, "source"),
      );
      const rows = decodeLog(source.read());
      assert.equal(
        rows.some((e) =>
          [
            "SourceChangeObserved",
            "SourceChangeRefused",
            "CommandResult",
          ].includes(e.type),
        ),
        false,
        kind,
      );
      assert.equal(
        rows.some(
          (e) =>
            e.type === "SourceChangeIntegrityChecked" &&
            e.payload.outcome !== "unchanged",
        ),
        false,
        kind,
      );
      assert.equal(
        rows.find((e) => e.type === "WorkerInterrupted")?.payload.signal,
        signal,
      );
      assert.equal(
        readdirSync(source.directory).some((name) =>
          name.endsWith(".source-change.json"),
        ),
        false,
      );
      const pending = runState(f.directory, state.binding.key);
      assert.equal(pending.terminal, null);
      assert.equal(pending.pending?.step, "source-change");
      assert.equal(pending.receipts.at(-1).command.step, "baseline");
      put(settings, {
        at: f.now() + 2,
        ready: join(f.root, "ready"),
        sleep: false,
      });
      const rerun = cli(f, settings);
      child = rerun.child;
      const resumed = await within(
        rerun.done,
        30_000,
        "post-result rerun did not finish",
      );
      assert.equal(
        resumed.code,
        0,
        `${kind}: ${resumed.stderr}\n${resumed.stdout}`,
      );
      const final = runState(f.directory, state.binding.key);
      assert.equal(final.terminal?.kind, "resolved");
      const receipt = final.receipts.find(
        (r) => r.command.step === "source-change",
      );
      assert.equal(receipt.value.testAfter.exitCode, 0);
      assert.equal(receipt.value.testAfter.signal, null);
      assert.equal(
        decodeLog(source.read()).filter(
          (e) => e.type === "WorkerAttemptStarted",
        ).length,
        1,
        "host re-observation must spend no writer dispatch",
      );
    } finally {
      if (child) {
        try {
          process.kill(-child.pid, "SIGKILL");
        } catch {}
        child.kill("SIGKILL");
      }
      f.close();
    }
  }
});

test("WO-199 terminal signals during baseline and candidate witness tests leave no admitted snapshot; reruns test a fresh retained copy", async () => {
  for (const [kind, beforeSteps, signal, expectedCode, trapSignal] of [
    ["baseline-test", 4, "SIGINT", 130, false],
    ["witness-test", 6, "SIGHUP", 129, false],
    ["witness-test", 6, "SIGTERM", 143, true],
  ]) {
    const f = await verticalFixture();
    let child;
    try {
      const state = await steps(f, beforeSteps);
      const settings = join(f.root, "interrupt.json"),
        marker = join(f.root, "host-call");
      put(settings, {
        at: f.now() + 1,
        ready: join(f.root, "ready"),
        sleep: false,
        hostCall: { kind, marker, trapSignal },
      });
      const first = cli(f, settings, { grouped: true });
      child = first.child;
      await until(() => existsSync(marker), 20_000, `${kind} did not start`);
      await sleep(150);
      process.kill(-child.pid, signal);
      const stopped = await within(
        first.done,
        10_000,
        "witness interruption exceeded 10 s",
      );
      assert.equal(stopped.code, expectedCode, stopped.stderr);
      const directory = join(f.directory, "vertical", state.binding.key);
      const name =
        kind === "baseline-test" ? "baseline-snapshot" : "candidate-0";
      const pending = runState(f.directory, state.binding.key);
      assert.equal(pending.terminal, null);
      assert.equal(
        pending.pending?.step,
        kind === "baseline-test" ? "baseline" : "witnesses",
      );
      assert.equal(
        existsSync(join(directory, `${name}.json`)),
        false,
        "a killed witness must never enter a prepared receipt",
      );
      assert.equal(
        existsSync(join(directory, name, "test-0")),
        true,
        "retain the interrupted copy",
      );
      put(settings, {
        at: f.now() + 2,
        ready: join(f.root, "ready"),
        sleep: false,
      });
      const rerun = cli(f, settings);
      child = rerun.child;
      const resumed = await within(
        rerun.done,
        30_000,
        "witness rerun did not finish",
      );
      assert.equal(resumed.code, 0, `${resumed.stderr}\n${resumed.stdout}`);
      assert.equal(
        runState(f.directory, state.binding.key).terminal?.kind,
        "resolved",
      );
      const prepared = JSON.parse(
        readFileSync(join(directory, `${name}.json`), "utf8"),
      );
      assert.equal(
        prepared.snapshotPath,
        join(directory, `${name}-1`, "snapshot"),
      );
      assert.equal(existsSync(join(directory, name, "test-0")), true);
      assert.equal(prepared.subject.evidence[0].hostTest.signal, null);
      assert.equal(
        prepared.subject.evidence[0].hostTest.exitCode,
        kind === "baseline-test" ? 1 : 0,
      );
    } finally {
      if (child) {
        try {
          process.kill(-child.pid, "SIGKILL");
        } catch {}
        child.kill("SIGKILL");
      }
      f.close();
    }
  }
});

test("WO-199 a signal queued at the final return is delivered before the CLI removes its listeners", async () => {
  const f = await verticalFixture();
  let child;
  try {
    await steps(f, 5);
    const settings = join(f.root, "interrupt.json");
    put(settings, {
      at: f.now() + 1,
      ready: join(f.root, "ready"),
      sleep: false,
      signalAfterRun: "SIGTERM",
    });
    const first = cli(f, settings);
    child = first.child;
    const stopped = await within(first.done, 30_000, "the CLI did not finish");
    assert.equal(stopped.code, 143, stopped.stderr);
    assert.match(stopped.stderr, /Vertical interrupted: SIGTERM/u);
    assert.equal(stopped.stdout, "");
  } finally {
    child?.kill("SIGKILL");
    f.close();
  }
});
