import test, { before, after } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import {
  mkdtempSync,
  readFileSync,
  readdirSync,
  realpathSync,
  rmSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  compileVerificationTask,
  type VerificationTask,
} from "@dotln/compiler";
import {
  decodeLog,
  pendingCommands,
  replayOutbox,
  replay,
  type Event,
  type JsonValue,
} from "@dotln/kernel";
import {
  runVerificationDemo,
  VERIFICATION_WORKSTREAM,
} from "../src/verification-demo.js";
import {
  fixtureVerificationResult,
  FakeVerificationTransport,
} from "../src/verification-fake.js";
import {
  projectAcceptanceEvidenceMatrices,
  replayVerification,
  verificationReactor,
  type VerificationState,
} from "../src/verification.js";
import {
  parseEvidenceResult,
  transportPrompt,
  type EvidenceWorkerRequest,
  type VerificationWorkerResult,
} from "../src/verification-protocol.js";
import {
  ClaudeCliPrintWorkOrderTransport,
  CodexCliExecWorkOrderTransport,
  runWorkerProcess,
  type ProcessRunner,
  type WorkerLaunch,
} from "../src/worker-transport.js";
import { LEASE_MS, WorkerFailure } from "../src/worker-protocol.js";
import { WorkerStore } from "../src/worker-store.js";
import { projectWorkerStatus } from "../src/worker-status.js";
import { initialVerificationRuntime, seiriReactor } from "../src/reactor.js";

const roots: string[] = [];
const temporary = () => {
  const root = realpathSync(
    mkdtempSync(join(tmpdir(), "dotln-verification-test-")),
  );
  roots.push(root);
  return root;
};
const fixtureCli = fileURLToPath(
  new URL("../../fixtures/verification-cli.mjs", import.meta.url),
);
const statusCli = fileURLToPath(new URL("../src/dotln.js", import.meta.url));
const json = (value: unknown) => value as JsonValue;
const runner =
  (
    name: string,
    behavior: string | (() => string) = "success",
    launches: WorkerLaunch[] = [],
  ): ProcessRunner =>
  (launch) => {
    launches.push(launch);
    return runWorkerProcess({
      ...launch,
      binary: process.execPath,
      args: [
        fixtureCli,
        name,
        typeof behavior === "string" ? behavior : behavior(),
        ...launch.args,
      ],
    });
  };
const transport = (
  name: "claude-cli-print" | "codex-cli-exec",
  behavior: string | (() => string) = "success",
  launches: WorkerLaunch[] = [],
) =>
  name === "claude-cli-print"
    ? new ClaudeCliPrintWorkOrderTransport(
        runner(name, behavior, launches),
        "2.1.261",
      )
    : new CodexCliExecWorkOrderTransport(
        runner(name, behavior, launches),
        "0.153.4",
      );
const effort = (name: string) =>
  name === "claude-cli-print" ? ("high" as const) : ("unknown" as const);
let reference: Awaited<ReturnType<typeof runVerificationDemo>>;
let events: readonly Event[];
before(async () => {
  reference = await runVerificationDemo({
    directory: temporary(),
    transport: new FakeVerificationTransport(),
    model: "synthetic",
    effort: "unknown",
  });
  events = decodeLog(reference.log);
});
after(() => {
  for (const root of roots) rmSync(root, { recursive: true });
});
const resultEvent = () =>
  events.find((event) => event.type === "CommandResult")!;
const beforeResult = () =>
  replayVerification(
    events.slice(0, events.indexOf(resultEvent())),
    VERIFICATION_WORKSTREAM,
  );
const requestFor = (state = beforeResult()): EvidenceWorkerRequest => {
  const pending = state.pending!;
  return {
    kind: "evidence-worker",
    command: pending.command,
    workOrder: pending.capsule.workOrder,
    capsule: pending.capsule,
    episodeId: pending.activeEpisode!,
    model: "synthetic",
    effort: "unknown",
    cwd: "/synthetic-mount",
    profile: {
      profileId: "verification-snapshot-v1",
      mounts: [{ path: "/synthetic-mount", access: "read" }],
    },
  };
};

for (const name of ["claude-cli-print", "codex-cli-exec"] as const) {
  test(`WO-010 AC1/2/3/5 ${name} dispatch → finding → fresh focused repair → re-verification uses the kernel loop`, async () => {
    const directory = temporary(),
      launches: WorkerLaunch[] = [],
      states: VerificationState[] = [];
    const marker = "IMPLEMENTER_NARRATIVE_NOT_ADMITTED";
    const result = await runVerificationDemo({
      directory,
      transport: transport(name, "success", launches),
      model: "required-model",
      effort: effort(name),
      implementerNarrative: marker,
      onEvent: (_event, state) => {
        states.push(state);
      },
    });
    const log = decodeLog(result.log);
    assert.equal(launches.length, 3);
    const inputs = launches.map((launch) => JSON.parse(launch.input));
    assert.deepEqual(
      inputs.map((input) => input.capsule.role),
      ["verifier", "repairer", "verifier"],
    );
    assert.equal(new Set(inputs.map((input) => input.episodeId)).size, 3);
    assert.equal(new Set(launches.map((launch) => launch.cwd)).size, 3);
    for (const input of inputs)
      assert.doesNotMatch(JSON.stringify(input), new RegExp(marker));
    assert.deepEqual(
      inputs[2].capsule.criteria.map((criterion: any) => criterion.criterionId),
      ["AC-policy", "AC-selection"],
    );
    const failure = log.find((event) => event.type === "CommandResult")!;
    const failed = (failure.payload as any).value as VerificationWorkerResult;
    assert.equal(
      failed.evaluations.find((item) => item.criterionId === "AC-selection")
        ?.verdict,
      "fail",
    );
    assert.deepEqual(failed.findings[0]?.likelySurface, ["policy.json"]);
    assert.equal(failed.findings[0]?.observed, '["unused.tmp","used.tmp"]');
    assert.equal(failed.findings[0]?.expected, '["unused.tmp"]');
    assert.ok(failed.findings[0]!.reproductionSteps.length > 0);
    assert.ok(failed.findings[0]!.evidenceRefs.length > 0);
    assert.ok(
      states.some((state) =>
        state.rows.every((row) => row.status === "incomplete"),
      ),
    );
    assert.ok(states.some((state) => state.rows[1]?.status === "failed"));
    assert.ok(
      states.some(
        (state) =>
          state.rows[0]?.status === "stale" &&
          state.rows[2]?.status === "verified",
      ),
    );
    assert.equal(result.matrix.phase, "complete");
    assert.ok(result.matrix.rows.every((row) => row.status === "verified"));
    assert.ok(
      result.matrix.baseline?.evidence.every((item) => item.outcome === "pass"),
    );
    assert.ok(
      result.matrix.evidence.every(
        (item) => item.source === "synthetic-fixture",
      ),
    );
    assert.equal(
      log.filter((event) => event.type === "VerificationContinuation").length,
      3,
    );
    assert.equal(pendingCommands(replayOutbox(log)).length, 0);
    assert.deepEqual(readdirSync(join(directory, "worktrees")), []);
    assert.deepEqual(projectAcceptanceEvidenceMatrices(log)[0], result.matrix);
    assert.deepEqual(
      replay(
        initialVerificationRuntime(VERIFICATION_WORKSTREAM),
        log,
        seiriReactor,
        {},
      ).decisions,
      result.decisions,
    );
    const before = new WorkerStore(directory).read();
    const again = await runVerificationDemo({
      directory,
      transport: transport(name, "success", launches),
      model: "required-model",
      effort: effort(name),
    });
    assert.equal(launches.length, 3);
    assert.equal(new WorkerStore(directory).read(), before);
    assert.deepEqual(again.matrix, result.matrix);
  });
}

test("WO-010 AC2 implementer-emitted events and repair results cannot certify acceptance", () => {
  const state = beforeResult(),
    original = resultEvent();
  assert.deepEqual(
    verificationReactor(state, {
      ...original,
      actorId: "implementer",
      episodeId: "ep_implementer_1",
    }),
    state,
  );
  for (const type of [
    "VerificationCompleted",
    "EvaluationRecorded",
    "CriterionVerified",
  ])
    assert.deepEqual(
      verificationReactor(state, { ...original, type, actorId: "implementer" }),
      state,
    );
  const forged = structuredClone(original) as any;
  forged.payload.value.envelope.episodeId = "ep_implementer_1";
  const refused = verificationReactor(state, forged);
  assert.deepEqual(refused.rows, state.rows);
  assert.equal(refused.lastResultEventId, null);
  assert.deepEqual(refused.refusedResults, [original.eventId]);
  const start = events.find((event) => event.type === "WorkerAttemptStarted")!;
  const prior = replayVerification(
    events.slice(0, events.indexOf(start)),
    VERIFICATION_WORKSTREAM,
  );
  assert.throws(
    () =>
      verificationReactor(prior, {
        ...start,
        payload: json({
          ...(start.payload as object),
          workerEpisodeId: "ep_implementer_1",
        }),
      }),
    /fresh physical episode/u,
  );
  const repairResult = events.filter(
    (event) => event.type === "CommandResult",
  )[1]!;
  const repairState = replayVerification(
    events.slice(0, events.indexOf(repairResult)),
    VERIFICATION_WORKSTREAM,
  );
  const request = requestFor(repairState);
  assert.throws(
    () =>
      parseEvidenceResult(
        {
          ...(repairResult.payload as any).value,
          evaluations: [{ criterionId: "AC-selection", verdict: "pass" }],
        },
        request,
      ),
    /invalid-result/u,
  );
});

test("WO-010 AC2/3 claim types, evidence sources, observations, subject and result shape are host-checked", () => {
  const request = requestFor();
  const good = (resultEvent().payload as any).value as VerificationWorkerResult;
  const mutations: ((result: any) => void)[] = [
    (result) => {
      result.events = [{ type: "CriterionVerified" }];
    },
    (result) => {
      result.subjectRevision = "old-subject";
    },
    (result) => {
      result.evaluations[0].claimType = "behavior";
    },
    (result) => {
      result.evaluations[0].evidenceRefs = ["invented-proof"];
    },
    (result) => {
      result.evaluations[1].verdict = "pass";
      result.findings = [];
    },
    (result) => {
      result.findings[0].observed = "fabricated observation";
    },
    (result) => {
      result.findings[0].evidenceRefs = [];
    },
    (result) => {
      result.findings[0].reproductionSteps = [];
    },
    (result) => {
      result.findings[0].likelySurface = ["../escape"];
    },
    (result) => {
      result.findings = [];
    },
    (result) => {
      result.evaluations.push(result.evaluations[0]);
    },
    (result) => {
      result.evaluations[0].criterionId = "undeclared";
    },
    (result) => {
      result.envelope.resultId = "wrong-command";
    },
  ];
  for (const mutate of mutations) {
    const result = structuredClone(good);
    mutate(result);
    assert.throws(
      () => parseEvidenceResult(result, request),
      /invalid-result/u,
    );
  }
  const live = compileVerificationTask(
    request.workOrder.workOrderId,
    request.capsule.criteria.map((criterion) => ({
      ...criterion,
      evidenceSource: "live",
    })),
    request.capsule.subject,
  );
  assert.throws(
    () =>
      parseEvidenceResult(good, {
        ...request,
        capsule: live,
        workOrder: live.workOrder,
      }),
    /claim-typed evidence/u,
  );
  const unavailable = compileVerificationTask(
    request.workOrder.workOrderId,
    request.capsule.criteria,
    {
      ...request.capsule.subject,
      evidence: request.capsule.subject.evidence.map((item) =>
        item.criterionId === "AC-selection"
          ? { ...item, outcome: "unavailable", observed: "runner unavailable" }
          : item,
      ),
    },
  );
  const unverified = fixtureVerificationResult(
    unavailable,
    request.episodeId,
    good.envelope.resultId,
  );
  assert.equal(
    (
      parseEvidenceResult(unverified, {
        ...request,
        capsule: unavailable,
      }) as VerificationWorkerResult
    ).evaluations[1]?.verdict,
    "unverified",
  );
  assert.doesNotMatch(transportPrompt(request), /Implementation self-report/u);
});

test("WO-010 AC3 each blocking finding has its own compiled repair; repair limits stop without greenwashing", async () => {
  const state = beforeResult(),
    original = resultEvent();
  const value = structuredClone((original.payload as any).value) as any;
  value.findings.push({
    ...value.findings[0],
    findingId: "another-blocking-finding",
  });
  const after = verificationReactor(state, {
    ...original,
    payload: json({ ...(original.payload as object), value }),
  });
  assert.equal(after.repairPlans.length, 2);
  assert.deepEqual(
    after.repairPlans.map((plan) => plan.capsule.finding?.findingId),
    value.findings.map((finding: any) => finding.findingId),
  );
  const stopped = await runVerificationDemo({
    directory: temporary(),
    transport: new FakeVerificationTransport(),
    model: "synthetic",
    effort: "unknown",
    maxRepairs: 0,
  });
  assert.equal(stopped.matrix.phase, "attention");
  assert.equal(stopped.matrix.rows[1]?.status, "failed");
  assert.equal(
    decodeLog(stopped.log).filter(
      (event) => event.type === "WorkerAttemptStarted",
    ).length,
    1,
  );
});

test("WO-010 AC4/5 dotln status exposes stale evidence mid-workstream and is read-only", async () => {
  const directory = temporary();
  await assert.rejects(
    runVerificationDemo({
      directory,
      transport: new FakeVerificationTransport(),
      model: "synthetic",
      effort: "unknown",
      onEvent: (event) => {
        if (event.type === "VerificationSubjectSubmitted")
          throw new Error("pause-after-repair");
      },
    }),
    /pause-after-repair/u,
  );
  const store = new WorkerStore(directory),
    before = store.read();
  const status = JSON.parse(
    execFileSync(
      process.execPath,
      [statusCli, "status", "--store", directory, "--json"],
      { encoding: "utf8" },
    ),
  );
  const matrix = status.acceptanceEvidenceMatrices[0];
  assert.deepEqual(
    matrix.rows.map((row: any) => row.status),
    ["stale", "stale", "verified"],
  );
  assert.deepEqual(matrix.staleness[0].criterionIds, [
    "AC-policy",
    "AC-selection",
  ]);
  assert.equal(matrix.rows[0].evaluations[0].stale, true);
  const text = execFileSync(
    process.execPath,
    [statusCli, "status", "--store", directory],
    { encoding: "utf8" },
  );
  assert.match(text, /AC-selection behavior stale/u);
  assert.equal(store.read(), before);
  const finished = await runVerificationDemo({
    directory,
    transport: new FakeVerificationTransport(),
    model: "synthetic",
    effort: "unknown",
  });
  assert.equal(finished.matrix.phase, "complete");
  assert.equal(finished.matrix.rows[0]?.evaluations.length, 2);
  assert.equal(finished.matrix.rows[2]?.evaluations.length, 1);
});

test("WO-010 completed-result crash recovery retains the producing verifier and invokes no duplicate effect", async () => {
  const directory = temporary(),
    launches: WorkerLaunch[] = [];
  let crash = true;
  const options = {
    directory,
    transport: transport("claude-cli-print", "success", launches),
    model: "required-model",
    effort: "high" as const,
  };
  await assert.rejects(
    runVerificationDemo({
      ...options,
      afterResultSaved: () => {
        if (crash) {
          crash = false;
          throw new Error("after-result-saved");
        }
      },
    }),
    /after-result-saved/u,
  );
  assert.equal(
    pendingCommands(replayOutbox(decodeLog(new WorkerStore(directory).read())))
      .length,
    1,
  );
  const result = await runVerificationDemo(options);
  assert.equal(launches.length, 3);
  const recovered = decodeLog(result.log).find(
    (event) => event.type === "WorkerResultRecovered",
  )!;
  assert.equal(
    (recovered.payload as any).producingEpisodeId,
    "ep_verifier_1_attempt_1",
  );
  assert.equal(
    result.matrix.rows[0]?.evaluations[0]?.episodeId,
    "ep_verifier_1_attempt_1",
  );
  assert.equal(result.matrix.phase, "complete");
});

test("WO-010 a committed repair recovers before its event without repeating the write", async () => {
  const directory = temporary();
  const options = {
    directory,
    transport: new FakeVerificationTransport(),
    model: "synthetic",
    effort: "unknown" as const,
  };
  await assert.rejects(
    runVerificationDemo({
      ...options,
      afterRepairApplied: () => {
        throw new Error("after-repair-commit");
      },
    }),
    /after-repair-commit/u,
  );
  const repository = join(directory, "repository");
  const before = execFileSync("git", ["rev-parse", "HEAD"], {
    cwd: repository,
    encoding: "utf8",
  });
  const result = await runVerificationDemo(options);
  assert.equal(result.matrix.phase, "complete");
  assert.equal(
    execFileSync("git", ["rev-parse", "HEAD"], {
      cwd: repository,
      encoding: "utf8",
    }),
    before,
  );
  assert.equal(
    decodeLog(result.log).filter(
      (event) => event.type === "VerificationSubjectSubmitted",
    ).length,
    1,
  );
});

test("WO-010 an admitted-result prefix recovers completion status and its continuation exactly once", async () => {
  const directory = temporary(),
    launches: WorkerLaunch[] = [];
  const options = {
    directory,
    transport: transport("claude-cli-print", "success", launches),
    model: "required-model",
    effort: "high" as const,
  };
  await assert.rejects(
    runVerificationDemo({
      ...options,
      onEvent: (event) => {
        if (event.type === "CommandResult")
          throw new Error("after-command-result");
      },
    }),
    /after-command-result/u,
  );
  const result = await runVerificationDemo(options);
  assert.equal(result.matrix.phase, "complete");
  assert.equal(launches.length, 3);
  const log = decodeLog(result.log);
  assert.equal(projectWorkerStatus(log).runningEpisodes.length, 0);
  assert.equal(
    log.filter((event) => event.type === "WorkerCompleted").length,
    3,
  );
  assert.equal(
    log.filter((event) => event.type === "VerificationContinuation").length,
    3,
  );
});

test("WO-010 explicit human disposition holds a completed repair proposal before application", () => {
  const original = events.filter((event) => event.type === "CommandResult")[1]!;
  const state = replayVerification(
    events.slice(0, events.indexOf(original)),
    VERIFICATION_WORKSTREAM,
  );
  const value = structuredClone((original.payload as any).value);
  value.envelope.requiresHuman = true;
  const result = verificationReactor(state, {
    ...original,
    payload: json({ ...(original.payload as object), value }),
  });
  assert.equal(result.next, "attention");
  assert.equal(result.subject?.revision, state.subject?.revision);
  assert.deepEqual(result.rows, state.rows);
});

for (const name of ["claude-cli-print", "codex-cli-exec"] as const) {
  test(`WO-010 ${name} killed verifier retains its command and recovers in a fresh leased episode`, async () => {
    const directory = temporary(),
      launches: WorkerLaunch[] = [];
    let at = 1_000_000,
      first = true;
    const adapter = transport(
      name,
      () => (first ? "wait" : "success"),
      launches,
    );
    const options = {
      directory,
      transport: adapter,
      model: "required-model",
      effort: effort(name),
      now: () => at,
    };
    await assert.rejects(
      runVerificationDemo({
        ...options,
        onRunning: (dispatch) => {
          setTimeout(() => dispatch.kill(), 30);
        },
      }),
      (error: unknown) =>
        error instanceof WorkerFailure && error.code === "interrupted",
    );
    assert.equal(
      pendingCommands(
        replayOutbox(decodeLog(new WorkerStore(directory).read())),
      ).length,
      1,
    );
    first = false;
    await assert.rejects(runVerificationDemo(options), /profile-refused/u);
    assert.equal(launches.length, 1);
    at += LEASE_MS + 1;
    const result = await runVerificationDemo(options);
    assert.equal(result.matrix.phase, "complete");
    assert.equal(launches.length, 4);
    assert.match(launches[1]!.input, /ep_verifier_1_attempt_2/u);
  });
  test(`WO-010 ${name} model refusal and forged passes retain pending work`, async () => {
    for (const behavior of ["unavailable", "forge-pass", "incomplete"]) {
      const directory = temporary(),
        launches: WorkerLaunch[] = [];
      const promise = runVerificationDemo({
        directory,
        transport: transport(name, behavior, launches),
        model: "required-model",
        effort: effort(name),
      });
      if (behavior === "incomplete")
        assert.notEqual((await promise).matrix.phase, "complete");
      else
        await assert.rejects(
          promise,
          (error: unknown) =>
            error instanceof WorkerFailure &&
            error.code ===
              (behavior === "unavailable"
                ? "model-unavailable"
                : "invalid-result"),
        );
      const log = decodeLog(new WorkerStore(directory).read());
      assert.equal(pendingCommands(replayOutbox(log)).length, 1);
      assert.equal(
        projectAcceptanceEvidenceMatrices(log)[0]?.rows.every(
          (row) => row.status === "incomplete",
        ),
        true,
      );
      assert.equal(launches.length, 1);
      assert.ok(!launches[0]!.args.includes("--fallback-model"));
    }
  });
}

test("WO-010 expired authority or lease quarantines acceptance and replay remains pure", async () => {
  const state = beforeResult(),
    event = resultEvent();
  for (const changed of [
    {
      ...state,
      authority: { ...state.authority!, expiresAt: event.occurredAt },
    },
    {
      ...state,
      pending: { ...state.pending!, leaseExpiresAt: event.occurredAt },
    },
    { ...state, revocations: [{ ...event, type: "VerificationRevoked" }] },
  ])
    assert.equal(verificationReactor(changed, event).lastResultEventId, null);
  const directory = temporary();
  let at = 1_000_000;
  await assert.rejects(
    runVerificationDemo({
      directory,
      transport: transport("claude-cli-print"),
      model: "required-model",
      effort: "high",
      now: () => at,
      onRunning: () => {
        at += LEASE_MS + 1;
      },
    }),
    /profile-refused/u,
  );
  const log = decodeLog(new WorkerStore(directory).read());
  assert.ok(log.some((event) => event.type === "WorkerResultQuarantined"));
  assert.ok(!log.some((event) => event.type === "CommandResult"));
  assert.equal(pendingCommands(replayOutbox(log)).length, 1);
  const priorNow = Date.now,
    priorRandom = Math.random;
  Date.now = () => {
    throw new Error("ambient clock");
  };
  Math.random = () => {
    throw new Error("ambient randomness");
  };
  try {
    assert.deepEqual(
      projectAcceptanceEvidenceMatrices(events)[0],
      reference.matrix,
    );
    assert.equal(
      projectWorkerStatus(events).acceptanceEvidenceMatrices[0]?.phase,
      "complete",
    );
  } finally {
    Date.now = priorNow;
    Math.random = priorRandom;
  }
});
