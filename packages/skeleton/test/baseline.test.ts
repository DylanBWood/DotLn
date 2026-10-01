import test from "node:test";
import assert from "node:assert/strict";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { writeFileSync, mkdirSync } from "node:fs";
import { decodeLog } from "@dotln/kernel";
import {
  baselineDisposition,
  baselineWitnessRows,
  compareBaseline,
  parseEvidenceResult,
  transportPrompt,
  validateBaselineWitness,
  validateTransportRequest,
} from "../src/verification-protocol.js";
import {
  VerificationDriver,
  VerificationHost,
  preflightVerificationRecovery,
} from "../src/verification-host.js";
import { replayVerification } from "../src/verification.js";
// The same generator supplies the process doubles and both live harness rows.
const loadFixture = () =>
  import(
    pathToFileURL(join(process.cwd(), "docs/evidence/WO-180/fixture.mjs")).href
  );

test("[document] WO-180 AC1: named base failure precedes the repaired candidate and survives replay", async () => {
  const fixture = await loadFixture();
  const target = fixture.createBaselineFixture();
  const result = await fixture.composeDouble(target);
  assert.equal(
    result.baseline.witness.outcome,
    process.platform === "darwin" ? "reproduced" : "not-reproduced",
  );
  if (process.platform !== "darwin") {
    assert.equal(result.implementationDispatched, false);
    return;
  }
  assert.equal(result.baseline.state.next, "baseline-witnessed");
  assert.ok(
    result.baseline.state.rows.every((row: any) => row.status === "incomplete"),
  );
  const rows = baselineWitnessRows(result.baseline.witness);
  const signed = rows.find((row) => row.criterionId === "AC-signed")!;
  assert.equal(signed.hostTest?.exitCode, 1);
  assert.equal(signed.outcome, "fail");
  assert.deepEqual(
    [signed.subject, signed.origin, signed.source],
    ["baseline", "host", "live"],
  );
  assert.equal(
    result.baseline.witness.capsule.subject.revision,
    target.options.baseCommit,
  );
  assert.equal(result.candidate.state.next, "complete");
  assert.deepEqual(result.candidate.matrix.baselineFindings, []);
  assert.ok(
    result.candidate.state.rows.every((row: any) => row.status === "verified"),
  );
  assert.deepEqual(
    replayVerification(
      decodeLog(result.baseline.log),
      result.baseline.state.workstreamId,
    ),
    result.baseline.state,
  );
  assert.deepEqual(
    replayVerification(
      decodeLog(result.candidate.log),
      result.candidate.state.workstreamId,
    ),
    result.candidate.state,
  );
});

test("[document] WO-180 AC2: non-reproduction stops the composition before implementation; new stories walk and continue", async () => {
  const fixture = await loadFixture();
  const stopped = await fixture.composeDouble(
    fixture.createBaselineFixture("passing"),
  );
  assert.equal(stopped.baseline.witness.outcome, "not-reproduced");
  assert.match(
    stopped.baseline.witness.limitation,
    process.platform === "darwin"
      ? /expected exit 1; observed exit 0/u
      : /unavailable/u,
  );
  assert.deepEqual(
    baselineDisposition(stopped.baseline.witness),
    stopped.disposition,
  );
  assert.equal(stopped.disposition.kind, "BaselineNotReproduced");
  assert.equal(stopped.disposition.storyId, "story-signed-addition");
  assert.equal(stopped.implementationDispatched, false);
  assert.equal(stopped.candidate, undefined);
  const walked = await fixture.composeDouble(
    fixture.createBaselineFixture("passing"),
    { story: { kind: "new", storyId: "story-new-addition" } },
  );
  assert.equal(walked.baseline.witness.outcome, "walked");
  assert.equal(walked.disposition.kind, "Continue");
  assert.equal(walked.implementationDispatched, true);
});

test("[document] WO-180 comparison reports the non-failing named base test and refuses greenwashing", async () => {
  const fixture = await loadFixture();
  const target = fixture.createBaselineFixture("passing");
  const baseline = await fixture.runBaseline(target);
  let request: any;
  const candidate = await fixture.runCandidate(target, baseline.witness, {
    transport: fixture.doubleTransport((value: any) => {
      request = value;
    }),
  });
  const findings = compareBaseline(request.baseline, request.capsule);
  assert.equal(findings.length, 1);
  assert.equal(findings[0]!.kind, "baseline-test-did-not-fail");
  assert.equal(findings[0]!.checkId, "contract");
  assert.equal(
    findings[0]!.baselineEvidenceId,
    baseline.witness.capsule.subject.evidence[1].evidenceId,
  );
  assert.equal(candidate.state.next, "attention");
  assert.deepEqual(candidate.matrix.baselineFindings, findings);
  if (process.platform === "darwin") {
    const green = fixture.doubleResult(request);
    green.evaluations[1].verdict = "pass";
    assert.throws(
      () => parseEvidenceResult(green, request),
      /defect baseline did not fail/u,
    );
  }
  const omitted = fixture.doubleResult(request);
  delete omitted.baselineFindings;
  assert.throws(
    () => parseEvidenceResult(omitted, request),
    /episode result shape/u,
  );
  assert.match(transportPrompt(request), /baseline-test-did-not-fail/u);
});

test("[document] WO-180 AC3: implementer-supplied baseline rows and forged host events cannot certify reproduction", async () => {
  const fixture = await loadFixture();
  const target = fixture.createBaselineFixture();
  let request: any;
  const baseline = await fixture.runBaseline(target, {
    transport: fixture.doubleTransport((value: any) => {
      request = value;
    }),
  });
  for (const key of ["rows", "baseline", "outcome"]) {
    const supplied = {
      ...fixture.doubleResult(request),
      [key]:
        key === "outcome"
          ? "reproduced"
          : baselineWitnessRows(baseline.witness),
    };
    assert.throws(
      () => parseEvidenceResult(supplied, request),
      /episode result shape/u,
    );
  }
  const event = decodeLog(baseline.log).find(
    (event) => event.type === "BaselineWitnessed",
  )!;
  const forged = { ...event, actorId: "implementer" };
  const events = decodeLog(baseline.log).map((entry) =>
    entry.eventId === event.eventId ? forged : entry,
  );
  assert.equal(
    replayVerification(
      events.slice(
        0,
        events.findIndex((entry) => entry.eventId === event.eventId) + 1,
      ),
      baseline.state.workstreamId,
    ).baselineWitness,
    undefined,
  );
  assert.throws(
    () => replayVerification(events, baseline.state.workstreamId),
    /continuation identity/u,
  );
  const changed = structuredClone(baseline.witness);
  changed.outcome =
    changed.outcome === "reproduced" ? "not-reproduced" : "reproduced";
  assert.throws(() => validateBaselineWitness(changed), /witness drift/u);
  const redirected = {
    ...request,
    baseline: {
      kind: "baseline",
      story: {
        ...fixture.story,
        tests: [
          { ...fixture.story.tests[0], command: "node focused-test.mjs" },
        ],
      },
    },
  };
  assert.throws(() => validateTransportRequest(redirected), /sealed test/u);
});

test("[document] WO-180 cached baseline result recovers without redispatch and retains its producing episode", async () => {
  const fixture = await loadFixture();
  const target = fixture.createBaselineFixture();
  let dispatches = 0;
  let savedSession: any;
  await assert.rejects(
    fixture.runBaseline(target, {
      transport: fixture.doubleTransport(() => {
        dispatches++;
      }),
      afterResultSaved: () => {
        throw new Error("synthetic host interruption");
      },
    }),
    /synthetic host interruption/u,
  );
  const { WorkerStore } = await import("../src/worker-store.js");
  const store = new WorkerStore(join(target.root, "baseline-store"));
  store.acquire(() =>
    preflightVerificationRecovery(
      store,
      "ws_baseline_store",
      () => target.base.snapshotPath,
      "process-double",
      "unknown",
    ),
  );
  try {
    const driver = new VerificationDriver(store, "ws_baseline_store");
    const host = new VerificationHost({
      driver,
      transport: fixture.doubleTransport(() => {
        dispatches++;
      }),
      now: () => Date.now(),
    });
    await host.run(target.base.snapshotPath, "process-double", "unknown");
    savedSession = driver.state;
    assert.equal(dispatches, 1);
    assert.match(savedSession.baselineWitness.episodeId, /attempt_1$/u);
    assert.equal(savedSession.pending, null);
    assert.equal(
      decodeLog(driver.log).filter(
        (event) => event.type === "BaselineWitnessed",
      ).length,
      1,
    );
  } finally {
    store.release();
  }
});

test("[document] WO-180 a wrong failing exit is non-reproduction, not a reproduced defect", async () => {
  const fixture = await loadFixture();
  const baseline = await fixture.runBaseline(fixture.createBaselineFixture(), {
    story: {
      ...fixture.story,
      tests: [{ ...fixture.story.tests[0], expectedExitCode: 2 }],
    },
  });
  assert.equal(baseline.witness.outcome, "not-reproduced");
  assert.match(baseline.witness.limitation, /expected exit 2/u);
});

test("[document] WO-180 a baseline actor's human-attention request holds before implementation", async () => {
  const fixture = await loadFixture();
  const transport = fixture.doubleTransport();
  const dispatch = transport.dispatch.bind(transport);
  transport.dispatch = (request: any, now: () => number) => {
    const running = dispatch(request, now);
    return {
      ...running,
      completed: running.completed.then((result: any) => ({
        ...result,
        envelope: { ...result.envelope, requiresHuman: true },
      })),
    };
  };
  const result = await fixture.composeDouble(fixture.createBaselineFixture(), {
    transport,
  });
  assert.equal(result.baseline.envelope.requiresHuman, true);
  assert.equal(result.baseline.state.next, "attention");
  assert.equal(result.baseline.witness, undefined);
  assert.equal(result.implementationDispatched, false);
  assert.equal(result.disposition.kind, "BaselineNeedsHuman");
  assert.equal(
    decodeLog(result.baseline.log).some(
      (event) => event.type === "BaselineWitnessed",
    ),
    false,
  );
});

test("[document] WO-180 an accepted-result prefix emits the baseline witness and continuation once on recovery", async () => {
  const fixture = await loadFixture();
  const target = fixture.createBaselineFixture();
  const baseline = await fixture.runBaseline(target);
  const events = decodeLog(baseline.log);
  const { WorkerStore } = await import("../src/worker-store.js");
  for (const boundary of ["CommandResult", "BaselineWitnessed"]) {
    const at = events.findIndex((event) => event.type === boundary);
    const directory = join(target.root, `prefix-${boundary}`);
    mkdirSync(directory);
    writeFileSync(
      join(directory, "events.jsonl"),
      events
        .slice(0, at + 1)
        .map((event) => JSON.stringify(event))
        .join("\n") + "\n",
    );
    const store = new WorkerStore(directory);
    store.acquire();
    try {
      const driver = new VerificationDriver(store, baseline.state.workstreamId);
      const host = new VerificationHost({
        driver,
        transport: fixture.doubleTransport(() =>
          assert.fail("must not redispatch"),
        ),
        now: () => Date.now(),
      });
      await host.run(target.base.snapshotPath, "process-double", "unknown");
      driver.persistNext(Date.now());
      assert.equal(driver.state.continuation.kind, "Done");
      assert.deepEqual(driver.state.baselineWitness, baseline.witness);
      assert.equal(
        decodeLog(driver.log).filter(
          (event) => event.type === "BaselineWitnessed",
        ).length,
        1,
      );
    } finally {
      store.release();
    }
  }
});
