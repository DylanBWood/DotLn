import test from "node:test";
import assert from "node:assert/strict";
import { basename, dirname, join } from "node:path";
import { syncBuiltinESMExports } from "node:module";
import { tmpdir } from "node:os";
import { execFileSync } from "node:child_process";
import fs, {
  chmodSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  realpathSync,
  renameSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { compileLoadout } from "@dotln/compiler";
import { decodeLog } from "@dotln/kernel";
import {
  verticalFixture,
  runState,
  json,
  put,
} from "./fixtures/vertical/fixture.mjs";
import { fixtureGit } from "../packages/skeleton/dist/test/source-change-fixture.js";
import {
  readVerticalConfiguration,
  createVerticalEntry,
  runVerticalIssue,
} from "./lib/vertical-runtime.mjs";
import { ResidentHost } from "../packages/skeleton/dist/src/resident-host.js";
import {
  recordPresence,
  replayResident,
  ResidentStore,
} from "../packages/skeleton/dist/src/resident-store.js";
import { WorkerStore } from "../packages/skeleton/dist/src/worker-store.js";
import { WorkerFailure } from "../packages/skeleton/dist/src/worker-protocol.js";
import { RetryableTriageError } from "../packages/skeleton/dist/src/vertical-judgment-host.js";
import { verticalResident } from "../packages/skeleton/dist/src/vertical-resident.js";
import { repairHash } from "../packages/skeleton/dist/src/repair.js";
import { writerLoadout } from "./lib/target-publish.mjs";
import { validateTransportRequest } from "../packages/skeleton/dist/src/verification-protocol.js";
import {
  foldVertical,
  IntentPreparationRefusal,
} from "../packages/skeleton/dist/src/vertical.js";
import { withDetachedCheckout } from "./lib/vertical-primitives.mjs";
import {
  JudgmentRecordError,
  recordedJudgment,
} from "./lib/vertical-judgment.mjs";
import { verticalJudgmentSubjectHash } from "../packages/skeleton/dist/src/vertical-judgment-protocol.js";

/** WO-112 judgment double: a declared test actor. It answers by source unit
 * and spanId, never by reading the source's English. */
function judgmentDouble(answer) {
  const calls = [];
  return {
    calls,
    transport: {
      name: "fake",
      harnessVersion: "not-applicable",
      dispatch(request, clock) {
        // The production transports validate before launch; so does the double.
        validateTransportRequest(request);
        calls.push(request);
        // Like the CLI transports, it leaves its return in the episode's cwd.
        const completed = Promise.resolve()
          .then(() => answer(request, calls.length))
          .then((value) => {
            writeFileSync(
              join(request.cwd, "result.json"),
              JSON.stringify(value) + "\n",
            );
            return value;
          });
        void completed.catch(() => {});
        return {
          receipt: Promise.resolve({
            commandId: request.command.commandId,
            transport: "fake",
            acceptedAt: clock(),
          }),
          completed,
          alive: () => false,
          kill() {},
        };
      },
    },
  };
}
const intakeByUnit = (request) => ({
  summary: "Fixture intake double answers by source unit.",
  spans: request.subject.spans.map((span) => {
    const title = span.unit === request.subject.source[0].unit;
    return {
      spanId: span.spanId,
      class:
        span.fixedClass ??
        (title ? "requirement" : "current-behavior observation"),
      rationale: "Fixture double classifies by source unit.",
      baseline: title ? "no-existing-failure" : "existing-failure",
      baselineRationale: "Fixture double: the body unit reports the failure.",
    };
  }),
});
function useModelIntake(f) {
  const { number, draftId } = f.config.issues[0];
  f.config.issues[0] = { number, draftId, intake: "model" };
  put(join(f.directory, "vertical.json"), f.config);
}
const runIssue = (
  f,
  external,
  now = () => {
    f.tick();
    return f.now();
  },
) =>
  runVerticalIssue({
    directory: f.directory,
    issue: 1,
    configuration: readVerticalConfiguration(f.directory, f.launchpad),
    now,
    external,
  });

test("WO-112 a model intake episode classifies the screened issue and its recorded return drives admission to the terminal", async () => {
  const f = await verticalFixture();
  try {
    useModelIntake(f);
    const judge = judgmentDouble(intakeByUnit);
    const result = await runIssue(f, { ...f.external, judge: judge.transport });
    assert.equal(
      result.terminal?.kind,
      "resolved",
      JSON.stringify({ root: f.root, result }),
    );
    assert.equal(judge.calls.length, 1);
    const [request] = judge.calls;
    assert.equal(request.kind, "vertical-judgment");
    assert.equal(request.task, "intake");
    assert.deepEqual(request.profile, {
      profileId: "vertical-judgment-v1",
      modelTools: [],
    });
    // Every judged span is the screened bundle's own text at its byte range.
    const bundle = result.binding.bundle;
    const text = (span) =>
      Buffer.from(
        bundle.sections.find((s) => s.span.sectionId === span.sectionId).text,
      )
        .subarray(span.start, span.end)
        .toString();
    for (const statement of result.binding.contract.statements) {
      assert.equal(statement.origin, "inferred");
      assert.equal(
        statement.rationale,
        "Fixture double classifies by source unit.",
      );
      assert.equal(text(statement.span), statement.text);
    }
    assert.equal(result.binding.criteria.length, 1);
    // The fixture's actor is a declared double, so it is never labelled a model.
    assert.equal(result.binding.baselineAssessment.producer.kind, "double");
    assert.match(
      result.binding.baselineAssessment.producer.name,
      /^fake process-double max intake episode ep_vertical_intake_[0-9a-f]{16}$/u,
    );
    const baseline = result.receipts.find((r) => r.command.step === "baseline");
    assert.equal(baseline.value.storyClass, "defect");
    const records = readdirSync(join(f.directory, "issue-intake"));
    assert.equal(records.length, 1);
    const record = json(join(f.directory, "issue-intake", records[0]));
    assert.equal(record.provenance.kind, "double");
    assert.equal(record.provenance.task, "intake");
    assert.equal(record.provenance.effectiveModel, "unknown");
    assert.equal(record.provenance.selectionSource, "host-launch");
    assert.deepEqual(record.subject, request.subject);
    // A restarted entry converges on the admitted binding; nothing relaunches.
    const again = await runIssue(f, { ...f.external, judge: judge.transport });
    assert.equal(again.terminal.kind, "resolved");
    assert.equal(judge.calls.length, 1);
  } finally {
    f.close();
  }
});

test("WO-112 an unreachable intake actor leaves the draft undecided; a refused return holds it with its reason and is never relaunched", async () => {
  for (const [mutate, reason] of [
    [
      (r) => ({ ...r, spans: r.spans.slice(1) }),
      "invalid-result: one intake judgment per span required",
    ],
    [
      (r) => ({ ...r, spans: r.spans.map((s) => ({ ...s, class: "struck" })) }),
      "invalid-result: intake class for span-1",
    ],
    [
      (r) => ({
        ...r,
        spans: r.spans.map((s) => ({ ...s, spanId: "span-99" })),
      }),
      "invalid-result: intake span identity",
    ],
  ]) {
    const f = await verticalFixture();
    try {
      useModelIntake(f);
      const judge = judgmentDouble((request, n) =>
        n === 1
          ? Promise.reject(
              new WorkerFailure("transport-failed", "fixture down"),
            )
          : mutate(intakeByUnit(request)),
      );
      const external = { ...f.external, judge: judge.transport };
      assert.deepEqual(await runIssue(f, external), {
        kind: "NeedsHuman",
        step: "contract",
        reason: "intake episode failed: transport-failed: fixture down",
      });
      const intents = () =>
        replayResident(new ResidentStore(f.directory).read()).state.resident
          .intents?.[f.filed.workOrderId];
      assert.equal(intents(), undefined);
      const held = await runIssue(f, external);
      assert.deepEqual(held, {
        kind: "NeedsHuman",
        step: "contract",
        reason: `intake episode failed: ${reason}`,
      });
      assert.equal(intents().kind, "NeedsHuman");
      // The rejected return is kept beside the records; no record is admitted.
      const kept = readdirSync(join(f.directory, "issue-intake"));
      assert.equal(kept.length, 1);
      assert.match(kept[0], /^rejected-/u);
      assert.deepEqual(await runIssue(f, external), held);
      assert.equal(judge.calls.length, 2);
    } finally {
      f.close();
    }
  }
});

test("WO-112 without a judgment double the live intake actor still requires the explicit live-worker opt-in", async () => {
  const f = await verticalFixture();
  const previous = process.env.DOTLN_LIVE_WORKERS;
  delete process.env.DOTLN_LIVE_WORKERS;
  try {
    useModelIntake(f);
    assert.deepEqual(await runIssue(f, f.external), {
      kind: "NeedsHuman",
      step: "contract",
      reason:
        "intake episode failed: vertical live workers require DOTLN_LIVE_WORKERS=1",
    });
    assert.equal(existsSync(join(f.directory, "issue-intake")), false);
    // A host fault is reported, never recorded: opting in later can still admit.
    assert.equal(
      replayResident(new ResidentStore(f.directory).read()).state.resident
        .intents?.[f.filed.workOrderId],
      undefined,
    );
  } finally {
    if (previous !== undefined) process.env.DOTLN_LIVE_WORKERS = previous;
    f.close();
  }
});

test("WO-112 configuration admits intake model only without supplied classifications, and awaitChecks only as distinct names", async () => {
  const f = await verticalFixture();
  try {
    const saved = structuredClone(f.config);
    for (const [mutate, message] of [
      [(c) => (c.issues[0].intake = "model"), /or intake model/u],
      [
        (c) => {
          c.issues[0] = { number: 1, intake: "rule" };
        },
        /or intake model/u,
      ],
      [(c) => (c.awaitChecks = []), /awaitChecks/u],
      [(c) => (c.awaitChecks = ["unit", "unit"]), /awaitChecks/u],
      [(c) => (c.awaitChecks = [" unit"]), /awaitChecks/u],
    ]) {
      const config = structuredClone(saved);
      mutate(config);
      put(join(f.directory, "vertical.json"), config);
      assert.throws(
        () => readVerticalConfiguration(f.directory, f.launchpad),
        message,
      );
    }
  } finally {
    f.close();
  }
});

for (const [finished, checkStates, awaited, reason] of [
  [true, ["IN_PROGRESS", "IN_PROGRESS", "SUCCESS"], "unit", null],
  [
    false,
    ["IN_PROGRESS"],
    "unit",
    "declared automated review checks did not finish: unit (IN_PROGRESS)",
  ],
  [
    false,
    ["SUCCESS"],
    "review-bot",
    "declared automated review checks did not finish: review-bot (absent)",
  ],
  [
    false,
    ["IN_PROGRESS", "CANCELLED"],
    "unit",
    "declared automated review checks ended without success: unit (CANCELLED)",
  ],
])
  test(`WO-112 observation waits for a declared reviewer check: ${reason ?? "it finishes"}`, async () => {
    const f = await verticalFixture({ forge: { checkStates } });
    try {
      f.config.awaitChecks = [awaited];
      put(join(f.directory, "vertical.json"), f.config);
      const sleeps = [];
      const external = {
        ...f.external,
        settle: { timeoutMs: 60_000, pollMs: 15_000 },
        waitUntil(deadline) {
          sleeps.push(deadline - f.now());
          f.setTime(deadline);
        },
      };
      const result = await runIssue(f, external);
      const observation = result.receipts.find(
        (r) => r.command.step === "observation",
      );
      if (finished) {
        assert.equal(
          result.terminal?.kind,
          "resolved",
          JSON.stringify(result.terminal),
        );
        assert.deepEqual(sleeps, [15_000, 15_000]);
        assert.deepEqual(observation.value.observation.payload.checks, [
          { name: "unit", state: "SUCCESS" },
        ]);
      } else {
        assert.deepEqual(result.terminal, {
          kind: "NeedsHuman",
          step: "observation",
          reason,
        });
        // A check that ended unsuccessfully stops at once; others wait it out.
        if (reason.includes("ended")) assert.equal(sleeps.length, 1);
        else {
          assert.equal(sleeps.length, 4);
          assert.ok(sleeps.every((ms) => ms > 0 && ms <= 15_000));
        }
        assert.equal(
          result.receipts.some((r) => r.command.step === "resolution"),
          false,
        );
      }
    } finally {
      f.close();
    }
  });

test("WO-112 a resolution checkout clears a killed run's leftover, always removes itself, and refuses a relocated directory before any add", () => {
  const root = realpathSync(mkdtempSync(join(tmpdir(), "dotln-checkout-")));
  try {
    const target = join(root, "target");
    mkdirSync(target);
    fixtureGit(target, "init", "--initial-branch=main");
    writeFileSync(join(target, "a.txt"), "a\n");
    fixtureGit(target, "add", "a.txt");
    fixtureGit(target, "commit", "-m", "Seed");
    const head = fixtureGit(target, "rev-parse", "HEAD");
    const directory = join(root, "run");
    const child = join(directory, "resolution-1");
    const tree = join(child, "input-tree");
    const registered = () => fixtureGit(target, "worktree", "list");
    const read = (at) => readFileSync(join(at, "a.txt"), "utf8");
    mkdirSync(child, { recursive: true });
    // A kill between add and remove left both the checkout and its registration.
    fixtureGit(target, "worktree", "add", "--detach", tree, head);
    assert.equal(
      withDetachedCheckout(target, directory, child, head, read),
      "a\n",
    );
    assert.equal(existsSync(tree), false);
    assert.doesNotMatch(registered(), /input-tree/u);
    // The registration can survive even when the checkout directory did not.
    const unrelated = join(root, "unrelated");
    fixtureGit(target, "worktree", "add", "--detach", unrelated, head);
    fixtureGit(target, "worktree", "add", "--detach", tree, head);
    rmSync(tree, { recursive: true });
    assert.equal(
      withDetachedCheckout(target, directory, child, head, read),
      "a\n",
    );
    assert.equal(existsSync(tree), false);
    assert.doesNotMatch(registered(), /input-tree/u);
    assert.ok(registered().includes(unrelated));
    assert.equal(read(unrelated), "a\n");
    // A kill before registration left only a directory.
    mkdirSync(tree);
    writeFileSync(join(tree, "partial"), "x");
    assert.equal(
      withDetachedCheckout(target, directory, child, head, read),
      "a\n",
    );
    assert.equal(existsSync(tree), false);
    assert.throws(
      () =>
        withDetachedCheckout(target, directory, child, head, () => {
          throw new Error("seal failed");
        }),
      /seal failed/u,
    );
    assert.equal(existsSync(tree), false);
    assert.doesNotMatch(registered(), /input-tree/u);
    const elsewhere = join(root, "elsewhere");
    mkdirSync(elsewhere);
    symlinkSync(elsewhere, join(directory, "resolution-2"));
    assert.throws(
      () =>
        withDetachedCheckout(
          target,
          directory,
          join(directory, "resolution-2"),
          head,
          read,
        ),
      /directory identity drift/u,
    );
    symlinkSync(elsewhere, tree);
    assert.throws(
      () => withDetachedCheckout(target, directory, child, head, read),
      /directory identity drift/u,
    );
    assert.deepEqual(readdirSync(elsewhere), []);
    assert.doesNotMatch(registered(), /input-tree|elsewhere/u);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("WO-112 replay refuses a changed judgment schema or stored subject without another launch", async () => {
  const directory = realpathSync(
    mkdtempSync(join(tmpdir(), "dotln-judgment-replay-")),
  );
  try {
    const subject = {
      schemaVersion: "vertical-triage-v1",
      item: {
        id: "S1",
        class: "automated-review",
        path: null,
        line: null,
        text: "Review body.",
      },
      criteria: [
        { criterionId: "C1", description: "Page displays the expected text." },
      ],
      statements: [
        { class: "requirement", text: "Display the expected text." },
      ],
      candidate: { revision: "a".repeat(40), diff: "", files: [] },
      evidence: [{ ref: "contract", detail: "Admitted contract." }],
    };
    const judge = judgmentDouble(() => ({
      kind: "acknowledge",
      criterionId: null,
      reason: "No action.",
      evidenceRefs: ["contract"],
    }));
    const options = {
      directory,
      name: "triage",
      task: "triage",
      subject,
      transport: judge.transport,
      model: "fixture",
      effort: "max",
      now: () => 1,
    };
    const record = await recordedJudgment(options);
    const file = join(
      directory,
      readdirSync(directory).find((name) => name.startsWith("triage-")),
    );
    assert.deepEqual(await recordedJudgment(options), record);
    // A recorded triage replays without resolving its transport (D047).
    assert.deepEqual(
      await recordedJudgment({
        ...options,
        transport: () => assert.fail("a recorded subject launches nothing"),
      }),
      record,
    );
    for (const changed of [
      { ...record, schemaVersion: 2 },
      {
        ...record,
        subject: {
          ...record.subject,
          item: { ...record.subject.item, text: "Altered stored subject." },
        },
      },
    ]) {
      put(file, changed);
      await assert.rejects(
        () => recordedJudgment(options),
        /record does not bind/u,
      );
      assert.equal(judge.calls.length, 1);
      put(file, record);
    }
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test("WO-112 cached resolution preparation refuses child and receipt aliases before retrying triage", async () => {
  for (const alias of ["child", "receipt"]) {
    const f = await verticalFixture({
      forge: {
        reviews: [{ id: "S1", text: "No additional changes requested." }],
      },
    });
    try {
      const judge = judgmentDouble((request, count) => {
        if (count === 1)
          throw new WorkerFailure(
            "interrupted",
            "synthetic interruption after preparation",
          );
        return {
          kind: "acknowledge",
          criterionId: null,
          reason: "No action.",
          evidenceRefs: [request.subject.evidence[0].ref],
        };
      });
      const external = { ...f.external, judge: judge.transport };
      await assert.rejects(() => runIssue(f, external), RetryableTriageError);
      const runs = readdirSync(join(f.directory, "vertical")).filter((name) =>
        existsSync(join(f.directory, "vertical", name, "events.jsonl")),
      );
      assert.equal(runs.length, 1);
      const directory = join(f.directory, "vertical", runs[0]);
      const child = join(
        directory,
        readdirSync(directory).find(
          (name) =>
            name.startsWith("resolution-") &&
            existsSync(join(directory, name, "prepared.json")),
        ),
      );
      const elsewhere = join(f.root, "relocated");
      if (alias === "child") {
        renameSync(child, elsewhere);
        symlinkSync(elsewhere, child);
      } else {
        mkdirSync(elsewhere);
        renameSync(
          join(child, "prepared.json"),
          join(elsewhere, "prepared.json"),
        );
        symlinkSync(
          join(elsewhere, "prepared.json"),
          join(child, "prepared.json"),
        );
      }
      const before = readdirSync(elsewhere)
        .sort()
        .map((name) => [name, readFileSync(join(elsewhere, name), "utf8")]);
      const result = await runIssue(f, external);
      assert.equal(result.terminal.kind, "refused");
      assert.equal(result.terminal.step, "resolution");
      assert.equal(judge.calls.length, 1);
      assert.deepEqual(
        readdirSync(elsewhere)
          .sort()
          .map((name) => [name, readFileSync(join(elsewhere, name), "utf8")]),
        before,
      );
      assert.doesNotMatch(
        fixtureGit(f.target, "worktree", "list"),
        /input-tree|relocated/u,
      );
    } finally {
      f.close();
    }
  }
});

for (const code of ["interrupted", "model-unavailable", "untyped"])
  test(`WO-112 production resolution preserves retryable triage ${code} through restart`, async () => {
    const f = await verticalFixture({
      forge: {
        reviews: [{ id: "S1", text: "No additional changes requested." }],
      },
    });
    try {
      const failure =
        code === "untyped"
          ? new Error("synthetic unavailable triage")
          : new WorkerFailure(code, "synthetic unavailable triage");
      const judge = judgmentDouble((request, count) => {
        assert.equal(request.task, "triage");
        if (count === 1) throw failure;
        return {
          kind: "acknowledge",
          criterionId: null,
          reason: "Fresh episode found no action.",
          evidenceRefs: [request.subject.evidence[0].ref],
        };
      });
      const external = { ...f.external, judge: judge.transport };
      await assert.rejects(
        () => runIssue(f, external),
        (error) =>
          error instanceof RetryableTriageError && error.cause === failure,
      );
      const runs = readdirSync(join(f.directory, "vertical")).filter((name) =>
        existsSync(join(f.directory, "vertical", name, "events.jsonl")),
      );
      assert.equal(runs.length, 1);
      const directory = join(f.directory, "vertical", runs[0]);
      const pending = decodeLog(new WorkerStore(directory).read()).reduce(
        foldVertical,
        undefined,
      );
      assert.equal(pending.pending.step, "resolution");
      assert.equal(pending.terminal, null);
      assert.equal(
        pending.receipts.some((r) => r.command.step === "resolution"),
        false,
      );
      assert.equal(existsSync(join(directory, "host.lock")), false);
      const publication = new WorkerStore(
        join(
          pending.receipts.find((r) => r.command.step === "source-change").value
            .store,
          "publication",
        ),
      );
      assert.equal(
        decodeLog(publication.read()).some((e) =>
          ["ReviewBodyJudged", "PullRequestReviewLoopStopped"].includes(e.type),
        ),
        false,
      );
      const result = await runIssue(f, external);
      assert.equal(result.terminal.kind, "resolved");
      assert.deepEqual(
        result.receipts.slice(0, pending.receipts.length),
        pending.receipts,
      );
      assert.equal(
        result.receipts.filter((r) => r.command.step === "resolution").length,
        1,
      );
      assert.equal(judge.calls.length, 2);
      assert.equal((await runIssue(f, external)).terminal.kind, "resolved");
      assert.equal(judge.calls.length, 2);
    } finally {
      f.close();
    }
  });

test("WO-112 resident resolution preserves retryable triage scheduling through restart", async () => {
  const f = await verticalFixture({
    forge: {
      reviews: [{ id: "S1", text: "No additional changes requested." }],
    },
  });
  let host;
  try {
    const judge = judgmentDouble((request, count) => {
      assert.equal(request.task, "triage");
      if (count === 1)
        throw new WorkerFailure(
          "interrupted",
          "synthetic resident triage interruption",
        );
      return {
        kind: "acknowledge",
        criterionId: null,
        reason: "Fresh resident episode found no action.",
        evidenceRefs: [request.subject.evidence[0].ref],
      };
    });
    const cfg = readVerticalConfiguration(f.directory, f.launchpad);
    const start = async () => {
      const entry = createVerticalEntry({
        directory: f.directory,
        configuration: cfg,
        now: f.now,
        external: { ...f.external, judge: judge.transport },
      });
      const resident = new ResidentHost({
        directory: f.directory,
        configuration: cfg.resident,
        policyId: cfg.resident.policyId,
        now: f.now,
        capabilities: () => ["adapter.fixture"],
        vertical: entry.resident,
      });
      await resident.start();
      return resident;
    };
    host = await start();
    await recordPresence(f.directory, "away", f.now);
    for (let i = 0; i < 30 && judge.calls.length === 0; i++) {
      f.setTime(120 + i);
      await host.tick();
    }
    assert.equal(judge.calls.length, 1);
    let resident = replayResident(host.store.read()).state.resident;
    const binding = resident.intents[f.filed.workOrderId].binding;
    const pending = runState(f.directory, binding.key);
    assert.equal(pending.terminal, null);
    assert.equal(pending.pending.step, "resolution");
    assert.equal(resident.intentStep.commandId, pending.pending.commandId);
    const commandId = pending.pending.commandId;
    host.close();
    host = await start();
    f.tick();
    await host.tick();
    const result = runState(f.directory, binding.key);
    assert.equal(result.terminal.kind, "resolved");
    assert.deepEqual(
      result.receipts.slice(0, pending.receipts.length),
      pending.receipts,
    );
    assert.equal(judge.calls.length, 2);
    resident = replayResident(host.store.read()).state.resident;
    assert.equal(resident.intentStep, null);
    assert.equal(
      decodeLog(host.store.read()).filter(
        (e) =>
          e.type === "IntentStepStarted" && e.payload.commandId === commandId,
      ).length,
      1,
    );
    f.tick();
    await host.tick();
    assert.equal(judge.calls.length, 2);
  } finally {
    host?.close();
    f.close();
  }
});

test("WO-112 VER-004 F1 ResidentHost.run survives repeated triage failures and resolves without a restart", async () => {
  const f = await verticalFixture({
    forge: {
      reviews: [{ id: "S1", text: "No additional changes requested." }],
    },
  });
  try {
    const attempts = [];
    const failures = [
      new WorkerFailure("interrupted", "synthetic interruption"),
      new WorkerFailure("model-unavailable", "synthetic outage"),
      new Error("synthetic untyped transport failure"),
    ];
    const judge = judgmentDouble((request, count) => {
      assert.equal(request.task, "triage");
      attempts.push(f.now());
      if (count <= failures.length) throw failures[count - 1];
      return {
        kind: "acknowledge",
        criterionId: null,
        reason: "Fresh episode found no action.",
        evidenceRefs: [request.subject.evidence[0].ref],
      };
    });
    const cfg = readVerticalConfiguration(f.directory, f.launchpad);
    const entry = createVerticalEntry({
      directory: f.directory,
      configuration: cfg,
      now: f.now,
      external: { ...f.external, judge: judge.transport },
    });
    const host = new ResidentHost({
      directory: f.directory,
      configuration: cfg.resident,
      policyId: cfg.resident.policyId,
      now: f.now,
      capabilities: () => ["adapter.fixture"],
      vertical: entry.resident,
    });
    await recordPresence(f.directory, "away", f.now);
    let ticks = 0,
      pending;
    const tick = host.tick.bind(host);
    host.tick = async () => {
      f.setTime(120 + ++ticks * 250);
      await tick();
      if (judge.calls.length === 1 && !pending) {
        const resident = replayResident(host.store.read()).state.resident;
        const binding = resident.intents[f.filed.workOrderId].binding;
        pending = runState(f.directory, binding.key);
        assert.equal(pending.pending.step, "resolution");
        assert.equal(resident.intentStep.commandId, pending.pending.commandId);
      }
    };
    await host.run({ cycles: 60, tickMs: 1 });
    assert.equal(ticks, 60);
    assert.equal(judge.calls.length, 4);
    assert.deepEqual(
      attempts.slice(1).map((at, i) => at - attempts[i]),
      [1000, 2000, 4000],
    );
    const resident = replayResident(host.store.read()).state.resident;
    const result = runState(
      f.directory,
      resident.intents[f.filed.workOrderId].binding.key,
    );
    assert.equal(result.terminal.kind, "resolved");
    assert.deepEqual(
      result.receipts.slice(0, pending.receipts.length),
      pending.receipts,
    );
    assert.equal(
      result.receipts.filter((r) => r.command.step === "resolution").length,
      1,
    );
    assert.equal(resident.intentStep, null);
    assert.equal(
      decodeLog(host.store.read()).filter(
        (e) =>
          e.type === "IntentStepStarted" &&
          e.payload.commandId === pending.pending.commandId,
      ).length,
      1,
    );
  } finally {
    f.close();
  }
});

test("WO-112 VER-004 F1 continuation backoff caps repeated failures and never defers authority expiry", async () => {
  for (const mode of ["cap", "expiry"]) {
    const f = await verticalFixture({
      forge: {
        reviews: [{ id: "S1", text: "No additional changes requested." }],
      },
    });
    let host;
    try {
      const judge = judgmentDouble((request, count) => {
        if (count <= 3)
          throw new WorkerFailure("interrupted", "synthetic repeated failure");
        return {
          kind: "acknowledge",
          criterionId: null,
          reason: "Fresh episode found no action.",
          evidenceRefs: [request.subject.evidence[0].ref],
        };
      });
      const cfg = readVerticalConfiguration(f.directory, f.launchpad);
      const entry = createVerticalEntry({
        directory: f.directory,
        configuration: cfg,
        now: f.now,
        external: { ...f.external, judge: judge.transport },
      });
      host = new ResidentHost({
        directory: f.directory,
        configuration: cfg.resident,
        policyId: cfg.resident.policyId,
        now: f.now,
        capabilities: () => ["adapter.fixture"],
        vertical: verticalResident(entry.ports, entry.runs, {
          steps: 1,
          retry: {
            baseMs: mode === "expiry" ? 2000000 : 1000,
            capMs: mode === "expiry" ? 2000000 : 2000,
            unnamedAttempts: 3,
          },
        }),
      });
      await host.start();
      await recordPresence(f.directory, "away", f.now);
      for (let i = 0; i < 30 && judge.calls.length === 0; i++) {
        f.setTime(120 + i);
        await host.tick();
      }
      assert.equal(judge.calls.length, 1);
      const resident = replayResident(host.store.read()).state.resident;
      const binding = resident.intents[f.filed.workOrderId].binding;
      const pending = runState(f.directory, binding.key);
      assert.equal(pending.pending.step, "resolution");
      if (mode === "expiry") {
        f.setTime(binding.authority.expiresAt);
        await host.tick();
        const result = runState(f.directory, binding.key);
        assert.equal(result.terminal.kind, "NeedsHuman");
        assert.equal(
          result.receipts.at(-1).value.reason,
          "vertical authority or wall budget expired",
        );
        assert.equal(judge.calls.length, 1);
      } else {
        let at = f.now();
        for (const [i, wait] of [1000, 2000, 2000].entries()) {
          f.setTime(at + wait - 1);
          await host.tick();
          assert.equal(judge.calls.length, i + 1);
          f.setTime((at += wait));
          await host.tick();
          assert.equal(judge.calls.length, i + 2);
        }
        const result = runState(f.directory, binding.key);
        assert.equal(result.terminal.kind, "resolved");
        assert.deepEqual(
          result.receipts.slice(0, pending.receipts.length),
          pending.receipts,
        );
      }
    } finally {
      host?.close();
      f.close();
    }
  }
});

test("WO-112 VER-004 F1 host checkout preparation refuses without launching or retrying triage", async () => {
  const f = await verticalFixture({
    forge: {
      reviews: [{ id: "S1", text: "No additional changes requested." }],
    },
  });
  let host;
  try {
    const judge = judgmentDouble(() =>
      assert.fail("host preparation must precede a triage launch"),
    );
    const cfg = readVerticalConfiguration(f.directory, f.launchpad);
    const entry = createVerticalEntry({
      directory: f.directory,
      configuration: cfg,
      now: f.now,
      external: { ...f.external, judge: judge.transport },
    });
    let planted = false;
    const residentEntry = verticalResident(entry.ports, entry.runs, {
      steps: 1,
      afterStep(receipt) {
        if (receipt.command.step !== "observation") return;
        const resident = replayResident(host.store.read()).state.resident;
        const binding = resident.intents[f.filed.workOrderId].binding;
        const state = runState(f.directory, binding.key);
        const runDirectory = join(entry.runs, binding.key);
        const writer = compileLoadout(
          writerLoadout(json(join(runDirectory, "loadout.json"))),
          {
            environmentId: `vertical.${binding.key}`,
            version: 1,
            capabilities: [],
            repo: binding.target,
            baseCommit: state.workOrder.baseCommit,
          },
        );
        const observation = receipt.value.observation;
        const key = repairHash({
          item: observation.payload.comments.find((item) => item.id === "S1"),
          headSha: observation.payload.headSha,
          repositoryId: observation.payload.repositoryId,
          number: observation.payload.number,
          original: {
            workOrder: writer.program.workOrder,
            authorityEnvelope: writer.program.authorityEnvelope,
            criteria: binding.criteria,
            tests: binding.tests,
            surfaces: binding.derivation.surfaces.map((s) => s.path),
            roundLimit: 1,
          },
        });
        const elsewhere = join(f.root, "elsewhere");
        mkdirSync(elsewhere);
        symlinkSync(
          elsewhere,
          join(entry.runs, binding.key, `resolution-${key.slice(8)}`),
        );
        planted = true;
      },
    });
    host = new ResidentHost({
      directory: f.directory,
      configuration: cfg.resident,
      policyId: cfg.resident.policyId,
      now: f.now,
      capabilities: () => ["adapter.fixture"],
      vertical: residentEntry,
    });
    await host.start();
    await recordPresence(f.directory, "away", f.now);
    for (let i = 0; i < 30; i++) {
      f.setTime(120 + i);
      await host.tick();
    }
    assert.equal(planted, true);
    const resident = replayResident(host.store.read()).state.resident;
    const result = runState(
      f.directory,
      resident.intents[f.filed.workOrderId].binding.key,
    );
    assert.equal(result.terminal.kind, "refused");
    assert.equal(result.terminal.step, "resolution");
    assert.equal(
      result.receipts.filter((r) => r.command.step === "resolution").length,
      1,
    );
    assert.equal(judge.calls.length, 0);
    assert.deepEqual(readdirSync(join(f.root, "elsewhere")), []);
    assert.doesNotMatch(
      fixtureGit(f.target, "worktree", "list"),
      /input-tree|elsewhere/u,
    );
  } finally {
    host?.close();
    f.close();
  }
});

for (const code of ["invalid-result", "profile-refused"])
  test(`WO-112 production resolution retains non-retryable triage ${code}`, async () => {
    const f = await verticalFixture({
      forge: { reviews: [{ id: "S1", text: "Summary needs a judgment." }] },
    });
    try {
      const judge = judgmentDouble(() => {
        throw new WorkerFailure(code, "synthetic refused triage");
      });
      const external = { ...f.external, judge: judge.transport };
      const first = await runIssue(f, external);
      assert.equal(first.terminal.kind, "NeedsHuman");
      assert.match(first.terminal.reason, new RegExp(code));
      assert.deepEqual((await runIssue(f, external)).terminal, first.terminal);
      assert.equal(judge.calls.length, 1);
    } finally {
      f.close();
    }
  });

test("WO-112 an unsupplied review body is judged by the composition's own triage episode over the observed candidate, recorded once and replayed", async () => {
  const f = await verticalFixture({
    forge: {
      reviews: [
        {
          id: "REVIEW_1",
          text: "Automated review summary: nothing to change.",
        },
      ],
    },
  });
  try {
    useModelIntake(f);
    const triage = [];
    const judge = judgmentDouble((request) => {
      if (request.task === "intake") return intakeByUnit(request);
      triage.push(request.subject);
      return {
        kind: "acknowledge",
        criterionId: null,
        reason: "Fixture double: the body requests nothing.",
        evidenceRefs: [request.subject.evidence[0].ref],
      };
    });
    const external = { ...f.external, judge: judge.transport };
    const result = await runIssue(f, external);
    assert.equal(
      result.terminal?.kind,
      "resolved",
      JSON.stringify({ root: f.root, terminal: result.terminal }),
    );
    assert.equal(triage.length, 1);
    const [subject] = triage;
    const head = json(join(f.root, "published.json")).head;
    assert.deepEqual(subject.item, {
      id: "REVIEW_1",
      class: "automated-review",
      path: null,
      line: null,
      text: "Automated review summary: nothing to change.",
    });
    assert.equal(subject.candidate.revision, head);
    assert.deepEqual(
      subject.evidence.map((e) => e.ref),
      [
        result.binding.contract.contractId,
        `${head}:fixture.txt`,
        `${head}:host-test:0`,
      ],
    );
    const resolution = readdirSync(
      join(f.directory, "vertical", result.binding.key),
    ).filter(
      (name) => name.startsWith("resolution-") && !name.includes("-snapshot"),
    );
    assert.equal(resolution.length, 1);
    const records = readdirSync(
      join(f.directory, "vertical", result.binding.key, resolution[0]),
    ).filter((name) => /^triage-[0-9a-f]{16}\.json$/u.test(name));
    assert.equal(records.length, 1);
    const record = json(
      join(
        f.directory,
        "vertical",
        result.binding.key,
        resolution[0],
        records[0],
      ),
    );
    assert.equal(record.task, "triage");
    assert.equal(record.provenance.kind, "double");
    assert.deepEqual(record.subject, subject);
    const source = result.receipts.find(
      (r) => r.command.step === "source-change",
    ).value.store;
    const acknowledged = decodeLog(
      new WorkerStore(join(source, "publication")).read(),
    ).filter((e) => e.type === "ReviewBodyJudged");
    assert.equal(acknowledged.length, 1);
    assert.equal(acknowledged[0].payload.reason, null);
    assert.deepEqual(
      acknowledged[0].payload.judgment.producer,
      record.provenance,
    );
    // The intake and the triage are the only episodes; a rerun launches none.
    assert.equal(judge.calls.length, 2);
    assert.equal((await runIssue(f, external)).terminal.kind, "resolved");
    assert.equal(judge.calls.length, 2);
  } finally {
    f.close();
  }
});

test("WO-112 a retried admission replays the recorded intake instead of launching another episode", async () => {
  const f = await verticalFixture();
  try {
    useModelIntake(f);
    const judge = judgmentDouble(intakeByUnit);
    const cfg = readVerticalConfiguration(f.directory, f.launchpad);
    const entry = createVerticalEntry({
      directory: f.directory,
      configuration: cfg,
      now: f.now,
      external: { ...f.external, judge: judge.transport },
    });
    const phase = compileLoadout(cfg.resident.graph, cfg.resident.environment)
      .program.presence[0].phases[0];
    const spent = { episodes: 0, wallMs: 0, tokens: 0 };
    const first = await entry.ports.prepare(f.filed.workOrder, phase, spent);
    const again = await entry.ports.prepare(f.filed.workOrder, phase, spent);
    assert.equal(judge.calls.length, 1);
    assert.deepEqual(again.inferences, first.inferences);
    assert.deepEqual(again.baselineAssessment, first.baselineAssessment);
    // A record that no longer binds its subject's episode is refused, not used.
    const [name] = readdirSync(join(f.directory, "issue-intake"));
    const file = join(f.directory, "issue-intake", name);
    put(file, {
      ...json(file),
      provenance: { ...json(file).provenance, episodeId: "ep_other" },
    });
    await assert.rejects(
      entry.ports.prepare(f.filed.workOrder, phase, spent),
      /intake episode failed: intake record does not bind this subject's episode/u,
    );
    assert.equal(judge.calls.length, 1);
  } finally {
    f.close();
  }
});

/** The resident's own loop over model intake, one tick per simulated second
 * with the default backoff (1 s base, 300 s cap, three unnamed attempts). */
async function residentIntake(f, external, ticks = 40, override) {
  const cfg = readVerticalConfiguration(f.directory, f.launchpad);
  const entry = createVerticalEntry({
    directory: f.directory,
    configuration: cfg,
    now: f.now,
    external,
  });
  let prepares = 0;
  const ports = {
    ...entry.ports,
    async prepare(...args) {
      prepares++;
      return override
        ? override(prepares, () => entry.ports.prepare(...args))
        : entry.ports.prepare(...args);
    },
  };
  const host = new ResidentHost({
    directory: f.directory,
    configuration: cfg.resident,
    policyId: cfg.resident.policyId,
    now: f.now,
    capabilities: () => ["adapter.fixture"],
    vertical: verticalResident(ports, entry.runs, { steps: 1 }),
  });
  try {
    await host.start();
    await recordPresence(f.directory, "away", f.now);
    for (let i = 0; i < ticks; i++) {
      f.setTime(120 + i * 1000);
      await host.tick();
    }
    const log = decodeLog(host.store.read());
    return {
      prepares,
      held: log
        .filter((e) => e.type === "IntentHeld")
        .map((e) => e.payload.reason),
      admitted: log.filter((e) => e.type === "IntentAdmitted").length,
    };
  } finally {
    host.close();
  }
}

test("WO-112 D047 resident intake leaves only the episode's own launch or return undecided; every host fault ends held with its reason", async () => {
  const spanless = (request) => ({ ...intakeByUnit(request), spans: [] });
  for (const mode of [
    "episode-interrupted",
    "refused-return",
    "opt-in-missing",
    "record-unwritable",
    "record-unbinding",
    "record-corrupt",
  ]) {
    const f = await verticalFixture();
    const previous = process.env.DOTLN_LIVE_WORKERS;
    const records = join(f.directory, "issue-intake");
    try {
      useModelIntake(f);
      const judge = judgmentDouble((request) => {
        if (mode === "episode-interrupted")
          throw new WorkerFailure("interrupted", "synthetic interruption");
        return mode === "refused-return"
          ? spanless(request)
          : intakeByUnit(request);
      });
      const external =
        mode === "opt-in-missing"
          ? f.external
          : { ...f.external, judge: judge.transport };
      if (mode === "opt-in-missing") delete process.env.DOTLN_LIVE_WORKERS;
      if (mode === "record-unwritable") {
        mkdirSync(records, { recursive: true });
        chmodSync(records, 0o555);
      }
      let seeded = 0;
      if (mode === "record-unbinding" || mode === "record-corrupt") {
        // A record of another schema is met at a later preparation (VER-005 I2),
        // or bytes that do not parse.
        const cfg = readVerticalConfiguration(f.directory, f.launchpad);
        const entry = createVerticalEntry({
          directory: f.directory,
          configuration: cfg,
          now: f.now,
          external,
        });
        const phase = compileLoadout(
          cfg.resident.graph,
          cfg.resident.environment,
        ).program.presence[0].phases[0];
        await entry.ports.prepare(f.filed.workOrder, phase, {
          episodes: 0,
          wallMs: 0,
          tokens: 0,
        });
        const file = join(
          records,
          readdirSync(records).find((name) => name.endsWith(".json")),
        );
        if (mode === "record-corrupt")
          writeFileSync(file, '{"schemaVersion": 1 corrupt');
        else put(file, { ...json(file), schemaVersion: 2 });
        seeded = judge.calls.length;
      }
      const observed = await residentIntake(f, external);
      const episodes = judge.calls.length - seeded;
      const expected = {
        // Unbounded with capped backoff: 0, 1, 3, 7, 15 and 31 s.
        "episode-interrupted": [6, 6, []],
        "refused-return": [
          1,
          1,
          [
            "intake episode failed: invalid-result: one intake judgment per span required",
          ],
        ],
        "opt-in-missing": [
          3,
          0,
          [
            "intake episode failed: vertical live workers require DOTLN_LIVE_WORKERS=1",
          ],
        ],
        "record-unwritable": [
          1,
          1,
          ["intake record could not be written: EACCES"],
        ],
        "record-unbinding": [
          3,
          0,
          [
            "intake episode failed: intake record does not bind this subject's episode",
          ],
        ],
        "record-corrupt": [
          3,
          0,
          [
            "intake episode failed: intake record does not bind this subject's episode",
          ],
        ],
      }[mode];
      assert.deepEqual(
        [observed.prepares, episodes, observed.held],
        expected,
        mode,
      );
      assert.equal(observed.admitted, 0, mode);
    } finally {
      if (previous === undefined) delete process.env.DOTLN_LIVE_WORKERS;
      else process.env.DOTLN_LIVE_WORKERS = previous;
      if (existsSync(records)) chmodSync(records, 0o755);
      f.close();
    }
  }
});

test("WO-112 D047 the command holds an unrecordable intake verdict after one episode, and a record another entry linked first replays without a hold", async () => {
  {
    const f = await verticalFixture();
    const records = join(f.directory, "issue-intake");
    try {
      useModelIntake(f);
      mkdirSync(records, { recursive: true });
      chmodSync(records, 0o555);
      const judge = judgmentDouble(intakeByUnit);
      const external = { ...f.external, judge: judge.transport };
      const held = {
        kind: "NeedsHuman",
        step: "contract",
        reason: "intake record could not be written: EACCES",
      };
      assert.deepEqual(await runIssue(f, external), held);
      assert.deepEqual(await runIssue(f, external), held);
      assert.equal(judge.calls.length, 1);
      assert.equal(
        replayResident(new ResidentStore(f.directory).read()).state.resident
          .intents[f.filed.workOrderId].kind,
        "NeedsHuman",
      );
    } finally {
      chmodSync(records, 0o755);
      f.close();
    }
  }
  {
    // Not a lost verdict: a concurrent entry linked the same subject's record.
    const f = await verticalFixture();
    try {
      useModelIntake(f);
      const rival = judgmentDouble(intakeByUnit);
      const cfg = readVerticalConfiguration(f.directory, f.launchpad);
      const judge = judgmentDouble(async (request) => {
        await recordedJudgment({
          directory: join(f.directory, "issue-intake"),
          name: "1",
          task: "intake",
          subject: request.subject,
          transport: rival.transport,
          model: cfg.workers.model,
          effort: cfg.workers.effort,
          now: f.now,
        });
        return intakeByUnit(request);
      });
      const observed = await residentIntake(f, {
        ...f.external,
        judge: judge.transport,
      });
      assert.deepEqual(
        [judge.calls.length, rival.calls.length, observed.held],
        [1, 1, []],
      );
      assert.equal(observed.admitted, 1);
    } finally {
      f.close();
    }
  }
});

test("WO-112 D047 a deferred continuation holding the slot prepares no other draft, and preparation resumes once admission reopens", async () => {
  const f = await verticalFixture({
    forge: {
      reviews: [{ id: "S1", text: "No additional changes requested." }],
    },
  });
  let host;
  try {
    const judge = judgmentDouble((request, count) => {
      if (count <= 3)
        throw new WorkerFailure("interrupted", "synthetic repeated failure");
      return {
        kind: "acknowledge",
        criterionId: null,
        reason: "Fresh episode found no action.",
        evidenceRefs: [request.subject.evidence[0].ref],
      };
    });
    const cfg = readVerticalConfiguration(f.directory, f.launchpad);
    const entry = createVerticalEntry({
      directory: f.directory,
      configuration: cfg,
      now: f.now,
      external: { ...f.external, judge: judge.transport },
    });
    const second = { ...f.filed.workOrder, workOrderId: "WO-998" };
    let offerSecond = false,
      secondPrepares = 0;
    const ports = {
      ...entry.ports,
      async drafts() {
        return [
          ...(await entry.ports.drafts()),
          ...(offerSecond ? [second] : []),
        ];
      },
      async prepare(draft, phase, spent) {
        if (draft.workOrderId !== second.workOrderId)
          return entry.ports.prepare(draft, phase, spent);
        secondPrepares++;
        // Stands in for a forge-backed read; it never becomes a decision here.
        throw new IntentPreparationRefusal(
          "bundle",
          "fixture forge down",
          true,
        );
      },
    };
    host = new ResidentHost({
      directory: f.directory,
      configuration: cfg.resident,
      policyId: cfg.resident.policyId,
      now: f.now,
      capabilities: () => ["adapter.fixture"],
      vertical: verticalResident(ports, entry.runs, { steps: 1 }),
    });
    await host.start();
    await recordPresence(f.directory, "away", f.now);
    for (let i = 0; i < 30 && judge.calls.length === 0; i++) {
      f.setTime(120 + i);
      await host.tick();
    }
    assert.equal(judge.calls.length, 1);
    offerSecond = true;
    const start = f.now();
    let ticks = 0;
    // VER-005 D1: one tick per simulated second across the 1, 2 and 4 s deferrals.
    while (judge.calls.length < 4 && ticks < 60) {
      f.setTime(start + ++ticks * 1000);
      await host.tick();
    }
    assert.equal(judge.calls.length, 4);
    assert.equal(secondPrepares, 0);
    const resident = replayResident(host.store.read()).state.resident;
    const binding = resident.intents[f.filed.workOrderId].binding;
    assert.equal(runState(f.directory, binding.key).terminal.kind, "resolved");
    // The slot is free again: the second draft gets its turn.
    for (let i = 1; i <= 10 && secondPrepares === 0; i++) {
      f.setTime(start + (ticks + i) * 1000);
      await host.tick();
    }
    assert.ok(secondPrepares >= 1);
  } finally {
    host?.close();
    f.close();
  }
});

test("WO-112 D047 checkout recovery clears only its own registration and leaves every other worktree registration, stale or valid", () => {
  const root = realpathSync(mkdtempSync(join(tmpdir(), "dotln-prune-")));
  try {
    const target = join(root, "target");
    mkdirSync(target);
    fixtureGit(target, "init", "--initial-branch=main");
    writeFileSync(join(target, "a.txt"), "a\n");
    fixtureGit(target, "add", "a.txt");
    fixtureGit(target, "commit", "-m", "Seed");
    const head = fixtureGit(target, "rev-parse", "HEAD");
    // VER-005 P1: a moved worktree with staged work.
    const side = join(root, "side");
    fixtureGit(target, "worktree", "add", "-b", "side", side, head);
    writeFileSync(join(side, "a.txt"), "staged side work\n");
    fixtureGit(side, "add", "a.txt");
    const moved = join(root, "side-moved");
    renameSync(side, moved);
    // Not quoted by the report: a stale registration whose directory is gone,
    // and a valid detached one.
    const gone = join(root, "gone");
    fixtureGit(target, "worktree", "add", "--detach", gone, head);
    rmSync(gone, { recursive: true });
    const valid = join(root, "valid");
    fixtureGit(target, "worktree", "add", "--detach", valid, head);
    const locked = join(root, "locked");
    fixtureGit(target, "worktree", "add", "--lock", "--detach", locked, head);
    rmSync(locked, { recursive: true });
    const directory = join(root, "run");
    const child = join(directory, "resolution-1");
    const tree = join(child, "input-tree");
    mkdirSync(child, { recursive: true });
    // A kill during its own add can leave this checkout's registration locked.
    fixtureGit(target, "worktree", "add", "--lock", "--detach", tree, head);
    rmSync(tree, { recursive: true });
    const list = () => fixtureGit(target, "worktree", "list", "--porcelain");
    assert.equal(
      withDetachedCheckout(target, directory, child, head, (at) =>
        readFileSync(join(at, "a.txt"), "utf8"),
      ),
      "a\n",
    );
    const after = list();
    for (const path of [side, gone, valid, locked])
      assert.ok(after.split("\n").includes(`worktree ${path}`), path);
    assert.doesNotMatch(after, /input-tree/u);
    assert.equal(fixtureGit(moved, "status", "--porcelain"), "M  a.txt");
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("WO-112 D047 the host-fault bound is not spent by earlier episode failures, and a lost link race replays the winner's verdict", async () => {
  for (const mode of ["link-race", "unbinding-after-failures"]) {
    const f = await verticalFixture();
    try {
      useModelIntake(f);
      const records = join(f.directory, "issue-intake");
      const cfg = readVerticalConfiguration(f.directory, f.launchpad);
      const rival = judgmentDouble(intakeByUnit);
      const judge = judgmentDouble(async (request, count) => {
        if (count === 2 && mode === "unbinding-after-failures")
          put(
            join(
              records,
              `1-${verticalJudgmentSubjectHash(request.subject).slice(7, 23)}.json`,
            ),
            { schemaVersion: 2 },
          );
        if (count <= 2)
          throw new WorkerFailure("interrupted", "synthetic interruption");
        await recordedJudgment({
          directory: records,
          name: "1",
          task: "intake",
          subject: request.subject,
          transport: rival.transport,
          model: cfg.workers.model,
          effort: cfg.workers.effort,
          now: f.now,
        });
        return intakeByUnit(request);
      });
      const observed = await residentIntake(f, {
        ...f.external,
        judge: judge.transport,
      });
      // Two interrupted episodes, then: the third's link loses to a rival's
      // record, or three replay faults that the earlier failures do not spend.
      assert.deepEqual(
        [
          observed.prepares,
          judge.calls.length,
          observed.held,
          observed.admitted,
        ],
        mode === "link-race"
          ? [3, 3, [], 1]
          : [
              5,
              2,
              [
                "intake episode failed: intake record does not bind this subject's episode",
              ],
              0,
            ],
        mode,
      );
    } finally {
      f.close();
    }
  }
});

test("WO-112 D047 retention and cleanup never replace the episode's outcome, through the resident and the command", async () => {
  for (const mode of [
    "refused-retain-fails",
    "interrupted-retain-fails",
    "cleanup-fails",
  ]) {
    const f = await verticalFixture();
    const records = join(f.directory, "issue-intake");
    const lockedDirectories = [];
    try {
      useModelIntake(f);
      const judge = judgmentDouble((request) => {
        if (mode === "interrupted-retain-fails") {
          // Live CLIs leave their wire log behind before failing.
          writeFileSync(join(request.cwd, "wire.jsonl"), "{}\n");
          throw new WorkerFailure("interrupted", "synthetic interruption");
        }
        if (mode === "cleanup-fails") {
          const locked = join(request.cwd, "locked");
          mkdirSync(locked);
          writeFileSync(join(locked, "x"), "x");
          chmodSync(locked, 0o555);
          lockedDirectories.push(locked);
          return intakeByUnit(request);
        }
        return { ...intakeByUnit(request), spans: [] };
      });
      const external = { ...f.external, judge: judge.transport };
      if (mode !== "cleanup-fails") {
        mkdirSync(records, { recursive: true });
        chmodSync(records, 0o555);
      }
      const observed = await residentIntake(f, external);
      assert.deepEqual(
        [
          observed.prepares,
          judge.calls.length,
          observed.held,
          observed.admitted,
        ],
        {
          "refused-retain-fails": [
            1,
            1,
            [
              "intake episode failed: invalid-result: one intake judgment per span required",
            ],
            0,
          ],
          "interrupted-retain-fails": [6, 6, [], 0],
          "cleanup-fails": [1, 1, [], 1],
        }[mode],
        mode,
      );
    } finally {
      for (const locked of lockedDirectories) {
        chmodSync(locked, 0o755);
        rmSync(join(locked, ".."), { recursive: true, force: true });
      }
      if (existsSync(records)) chmodSync(records, 0o755);
      f.close();
    }
  }
  // The command holds a refused return once, even when its retention fails.
  const f = await verticalFixture();
  const records = join(f.directory, "issue-intake");
  try {
    useModelIntake(f);
    mkdirSync(records, { recursive: true });
    chmodSync(records, 0o555);
    const judge = judgmentDouble((request) => ({
      ...intakeByUnit(request),
      spans: [],
    }));
    const external = { ...f.external, judge: judge.transport };
    const held = {
      kind: "NeedsHuman",
      step: "contract",
      reason:
        "intake episode failed: invalid-result: one intake judgment per span required",
    };
    assert.deepEqual(await runIssue(f, external), held);
    assert.deepEqual(await runIssue(f, external), held);
    assert.equal(judge.calls.length, 1);
  } finally {
    chmodSync(records, 0o755);
    f.close();
  }
});

test("WO-112 D047 a recorded judgment replays without resolving a transport, so recovery needs no live-worker opt-in", async () => {
  const f = await verticalFixture();
  const previous = process.env.DOTLN_LIVE_WORKERS;
  try {
    useModelIntake(f);
    const judge = judgmentDouble(intakeByUnit);
    const cfg = readVerticalConfiguration(f.directory, f.launchpad);
    const entry = createVerticalEntry({
      directory: f.directory,
      configuration: cfg,
      now: f.now,
      external: { ...f.external, judge: judge.transport },
    });
    const phase = compileLoadout(cfg.resident.graph, cfg.resident.environment)
      .program.presence[0].phases[0];
    await entry.ports.prepare(f.filed.workOrder, phase, {
      episodes: 0,
      wallMs: 0,
      tokens: 0,
    });
    assert.equal(judge.calls.length, 1);
    // The shared replay: a factory is never called for a recorded subject.
    const records = join(f.directory, "issue-intake");
    const [name] = readdirSync(records);
    const recorded = json(join(records, name));
    assert.deepEqual(
      await recordedJudgment({
        directory: records,
        name: "1",
        task: "intake",
        subject: recorded.subject,
        transport: () => assert.fail("a recorded subject launches nothing"),
        model: cfg.workers.model,
        effort: cfg.workers.effort,
        now: f.now,
      }),
      recorded,
    );
    delete process.env.DOTLN_LIVE_WORKERS;
    const observed = await residentIntake(f, f.external);
    assert.deepEqual(
      [observed.held, observed.admitted, judge.calls.length],
      [[], 1, 1],
    );
  } finally {
    if (previous === undefined) delete process.env.DOTLN_LIVE_WORKERS;
    else process.env.DOTLN_LIVE_WORKERS = previous;
    f.close();
  }
});

test("WO-112 D047 a host fault's held reason records a system error's code, never its local path", async () => {
  const f = await verticalFixture();
  const records = join(f.directory, "issue-intake");
  let file;
  try {
    useModelIntake(f);
    const judge = judgmentDouble(intakeByUnit);
    const cfg = readVerticalConfiguration(f.directory, f.launchpad);
    const entry = createVerticalEntry({
      directory: f.directory,
      configuration: cfg,
      now: f.now,
      external: { ...f.external, judge: judge.transport },
    });
    const phase = compileLoadout(cfg.resident.graph, cfg.resident.environment)
      .program.presence[0].phases[0];
    await entry.ports.prepare(f.filed.workOrder, phase, {
      episodes: 0,
      wallMs: 0,
      tokens: 0,
    });
    file = join(
      records,
      readdirSync(records).find((name) => name.endsWith(".json")),
    );
    chmodSync(file, 0o000);
    const observed = await residentIntake(f, {
      ...f.external,
      judge: judge.transport,
    });
    assert.deepEqual(
      [observed.prepares, judge.calls.length, observed.held],
      [3, 1, ["intake episode failed: EACCES"]],
    );
    assert.ok(!new ResidentStore(f.directory).read().includes(records));
  } finally {
    if (file) chmodSync(file, 0o644);
    f.close();
  }
});

test("WO-112 D047 an unnamed failure's bound is not spent by earlier transient refusals", async () => {
  const f = await verticalFixture();
  try {
    const observed = await residentIntake(f, f.external, 40, (count) => {
      if (count <= 2)
        throw new IntentPreparationRefusal(
          "bundle",
          "fixture forge down",
          true,
        );
      throw new Error("synthetic host failure");
    });
    assert.deepEqual(
      [observed.prepares, observed.held],
      [
        5,
        [
          "intent preparation failed repeatedly outside the named transient conditions",
        ],
      ],
    );
  } finally {
    f.close();
  }
});

test("WO-112 D047 a scratch repository that cannot be initialized is a bounded host fault whose reason names no path", async () => {
  const f = await verticalFixture();
  const previous = process.env.PATH;
  try {
    useModelIntake(f);
    const judge = judgmentDouble(intakeByUnit);
    // Only the judgment's scratch init fails; every other Git call is real.
    const bin = join(f.root, "fake-bin");
    mkdirSync(bin);
    const git = execFileSync("/usr/bin/which", ["git"], {
      encoding: "utf8",
    }).trim();
    writeFileSync(
      join(bin, "git"),
      `#!/bin/sh\ncase "$*" in *init.templateDir=*) echo "fatal: cannot init $5" >&2; exit 128;; esac\nexec "${git}" "$@"\n`,
      { mode: 0o755 },
    );
    process.env.PATH = `${bin}:${previous}`;
    const observed = await residentIntake(f, {
      ...f.external,
      judge: judge.transport,
    });
    assert.deepEqual(
      [observed.prepares, judge.calls.length, observed.held],
      [
        3,
        0,
        [
          "intake episode failed: judgment scratch repository could not be initialized",
        ],
      ],
    );
  } finally {
    process.env.PATH = previous;
    f.close();
  }
});

// Fail the real sibling unlink after publication, leaving the complete record
// readable. Restore the native exports and permissions even on an assertion.
async function judgmentCleanupFailure(task, mode, execute) {
  const link = fs.linkSync;
  const unlink = fs.unlinkSync;
  let directory;
  let file;
  let partial;
  const cleanupErrors = [];
  fs.linkSync = (source, destination) => {
    if (
      !basename(destination).startsWith(task === "intake" ? "1-" : "triage-") ||
      !destination.endsWith(".json")
    )
      return link(source, destination);
    directory = dirname(destination);
    file = destination;
    partial = source;
    if (mode === "publication-fails") {
      chmodSync(directory, 0o555);
      throw Object.assign(new Error("synthetic primary publication failure"), {
        code: "EIO",
      });
    }
    if (mode === "link-race" || mode === "invalid-race") {
      const winner = json(source);
      if (mode === "invalid-race") winner.schemaVersion = 2;
      else winner.result = { ...winner.result, reason: "Fixture race winner." };
      const rival = `${destination}.rival`;
      writeFileSync(rival, JSON.stringify(winner) + "\n", { flag: "wx" });
      link(rival, destination);
      unlink(rival);
    } else link(source, destination);
    chmodSync(directory, 0o555);
    // The competitor published first; the host's exclusive link still fails.
    if (mode === "link-race" || mode === "invalid-race")
      return link(source, destination);
  };
  fs.unlinkSync = (candidate) => {
    try {
      return unlink(candidate);
    } catch (error) {
      if (
        directory &&
        dirname(candidate) === directory &&
        candidate.endsWith(".partial")
      )
        cleanupErrors.push(error.code);
      throw error;
    }
  };
  syncBuiltinESMExports();
  try {
    const value = await execute();
    assert.deepEqual(
      cleanupErrors,
      ["EACCES"],
      "the real partial unlink failed",
    );
    assert.equal(
      readdirSync(directory).filter((name) => name.endsWith(".partial")).length,
      1,
    );
    if (mode === "link-race" || mode === "invalid-race")
      assert.notEqual(fs.statSync(file).ino, fs.statSync(partial).ino);
    return { value, file };
  } finally {
    fs.linkSync = link;
    fs.unlinkSync = unlink;
    syncBuiltinESMExports();
    if (directory) chmodSync(directory, 0o755);
  }
}

for (const mode of ["published", "link-race"])
  test(`WO-112 VER-006 F1 production triage keeps its accepted verdict when partial cleanup fails (${mode})`, async () => {
    const f = await verticalFixture({
      forge: {
        reviews: [{ id: "S1", text: "No additional changes requested." }],
      },
    });
    try {
      const judge = judgmentDouble((request) => ({
        kind: "acknowledge",
        criterionId: null,
        reason: "Fixture review requests no action.",
        evidenceRefs: [request.subject.evidence[0].ref],
      }));
      const external = { ...f.external, judge: judge.transport };
      const { value: first, file } = await judgmentCleanupFailure(
        "triage",
        mode,
        () => runIssue(f, external),
      );
      assert.equal(first.terminal.kind, "resolved");
      assert.equal(json(file).result.kind, "acknowledge");
      const source = first.receipts.find(
        (row) => row.command.step === "source-change",
      ).value.store;
      const judged = decodeLog(
        new WorkerStore(join(source, "publication")).read(),
      ).filter((event) => event.type === "ReviewBodyJudged");
      assert.equal(judged.length, 1);
      assert.deepEqual(judged[0].payload.judgment, {
        ...json(file).result,
        producer: json(file).provenance,
      });
      assert.equal((await runIssue(f, external)).terminal.kind, "resolved");
      assert.equal(
        runState(f.directory, first.binding.key).terminal.kind,
        "resolved",
      );
      assert.equal(judge.calls.length, 1);
    } finally {
      f.close();
    }
  });

test("WO-112 VER-006 F1 production intake admits and replays after partial cleanup fails", async () => {
  const f = await verticalFixture();
  try {
    useModelIntake(f);
    const judge = judgmentDouble(intakeByUnit);
    const external = { ...f.external, judge: judge.transport };
    const cfg = readVerticalConfiguration(f.directory, f.launchpad);
    const entry = createVerticalEntry({
      directory: f.directory,
      configuration: cfg,
      now: f.now,
      external,
    });
    const phase = compileLoadout(cfg.resident.graph, cfg.resident.environment)
      .program.presence[0].phases[0];
    const { value: prepared, file } = await judgmentCleanupFailure(
      "intake",
      "published",
      () =>
        entry.ports.prepare(f.filed.workOrder, phase, {
          episodes: 0,
          wallMs: 0,
          tokens: 0,
        }),
    );
    assert.equal(prepared.draft.workOrderId, f.filed.workOrderId);
    assert.ok(prepared.inferences.length);
    assert.equal(json(file).task, "intake");
    const observed = await residentIntake(f, external, 1);
    assert.deepEqual(
      [observed.prepares, observed.held, observed.admitted],
      [1, [], 1],
    );
    assert.equal(judge.calls.length, 1);
  } finally {
    f.close();
  }
});

test("WO-112 VER-006 F1 cleanup cannot mask a primary publication or invalid link-race replay error", async () => {
  const f = await verticalFixture();
  try {
    useModelIntake(f);
    const cfg = readVerticalConfiguration(f.directory, f.launchpad);
    const judge = judgmentDouble(intakeByUnit);
    const entry = createVerticalEntry({
      directory: f.directory,
      configuration: cfg,
      now: f.now,
      external: { ...f.external, judge: judge.transport },
    });
    const phase = compileLoadout(cfg.resident.graph, cfg.resident.environment)
      .program.presence[0].phases[0];
    await entry.ports.prepare(f.filed.workOrder, phase, {
      episodes: 0,
      wallMs: 0,
      tokens: 0,
    });
    for (const mode of ["publication-fails", "invalid-race"]) {
      const directory = join(f.root, mode);
      await judgmentCleanupFailure("intake", mode, async () => {
        await assert.rejects(
          () =>
            recordedJudgment({
              directory,
              name: "1",
              task: "intake",
              subject: judge.calls[0].subject,
              transport: judge.transport,
              model: cfg.workers.model,
              effort: cfg.workers.effort,
              now: f.now,
            }),
          (error) => {
            if (mode === "publication-fails") {
              assert.ok(error instanceof JudgmentRecordError);
              assert.equal(error.cause.code, "EIO");
              assert.equal(
                error.cause.message,
                "synthetic primary publication failure",
              );
            } else
              assert.match(
                error.message,
                /record does not bind this subject's episode/u,
              );
            return true;
          },
        );
      });
    }
  } finally {
    f.close();
  }
});
