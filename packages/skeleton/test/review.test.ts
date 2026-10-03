import test from "node:test";
import assert from "node:assert/strict";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { chmodSync, readFileSync, writeFileSync } from "node:fs";
import { decodeLog } from "@dotln/kernel";
import {
  parseEvidenceResult,
  transportPrompt,
  evidenceResultSchema,
  validateTransportRequest,
} from "../src/verification-protocol.js";
import {
  VerificationDriver,
  VerificationHost,
  preflightVerificationRecovery,
} from "../src/verification-host.js";
import { WorkerStore } from "../src/worker-store.js";
import {
  replayVerification,
  projectAcceptanceEvidenceMatrices,
} from "../src/verification.js";
import { routeReview, validateReviewContext } from "../src/review.js";
import { deriveRepairOrder } from "../src/repair.js";
import { LEASE_MS } from "../src/worker-protocol.js";
import { canonicalStringify, fnv1a64 } from "@dotln/compiler";

// Historical fixture inputs belong to the document selection; load only inside its cases.
const loadFixture = () =>
  import(
    pathToFileURL(join(process.cwd(), "docs/evidence/WO-181/fixture.mjs")).href
  );
const options = { skip: process.platform !== "darwin" };

test("[document] WO-184 R9: committed no-notice replay preserves the pre-edit command and prompt", async () => {
  const { checkLegacyNotice } = await import(
    pathToFileURL(
      join(process.cwd(), "docs/evidence/WO-184/check-legacy-notice.mjs"),
    ).href
  );
  assert.deepEqual(checkLegacyNotice(), {
    commandByteIdentical: true,
    promptByteIdentical: true,
  });
});

test(
  "[document] WO-184 criterion 13: persisted notice survives a release-only compiler relabel",
  options,
  async () => {
    const fixture = await import(
      pathToFileURL(join(process.cwd(), "docs/evidence/WO-184/fixture.mjs"))
        .href
    );
    const target = fixture.createReviewFixture();
    const session = fixture.openReview(target);
    try {
      const changed = decodeLog(session.driver.log).map((event) =>
        JSON.parse(
          JSON.stringify(event, (key, value) => {
            if (key !== "capsule") return value;
            const { inputHash, ...contents } = value;
            void inputHash;
            contents.compilerPackageVersion = "0.0.1";
            return {
              ...contents,
              inputHash: `fnv1a64:${fnv1a64(canonicalStringify(contents))}`,
            };
          }),
        ),
      );
      const replayed = replayVerification(changed, session.driver.workstreamId);
      assert.equal(replayed.pending!.capsule.compilerPackageVersion, "0.0.1");
      assert.equal(
        (replayed.pending!.command.intent.payload as { reviewNotice?: true })
          .reviewNotice,
        true,
      );
      const removed = structuredClone(changed);
      delete removed.find((event) => event.type === "CommandPersisted").payload
        .command.intent.payload.reviewNotice;
      assert.throws(
        () => replayVerification(removed, session.driver.workstreamId),
        /persisted compilation drift/u,
      );
    } finally {
      session.store.release();
    }
  },
);

test(
  "[document] WO-184 criteria 12/13: a sealed kernel/driver stream re-verifies every criterion after a one-criterion repair",
  options,
  async () => {
    const fixture = await import(
      pathToFileURL(join(process.cwd(), "docs/evidence/WO-184/fixture.mjs"))
        .href
    );
    const result = await fixture.repairReviewDriverFixture();
    assert.equal(result.allReverified, true);
    assert.equal(result.reviewDispatched, true);
    assert.equal(result.nativeSnapshotRepairClaimed, false);
  },
);

test(
  "[document] WO-184 criterion 19: failed and rejected reviews stay pending and rerun a fresh attempt",
  options,
  async () => {
    const fixture = await loadFixture();
    for (const failure of ["failed", "rejected"] as const) {
      const target = fixture.createReviewFixture();
      const session = fixture.openReview(target, { name: `wo184_${failure}` });
      try {
        await session.host.run(
          target.prepared.snapshotPath,
          "process-double",
          "unknown",
        );
        session.driver.persistNext(Date.now());
        const failing = {
          name: "fake" as const,
          harnessVersion: "not-applicable",
          dispatch(request: any, now: () => number) {
            const result = fixture.doubleResult(request);
            result.envelope.status = "failed";
            const completed =
              failure === "failed"
                ? Promise.resolve(result)
                : Promise.reject(new Error("fixture rejection"));
            return {
              receipt: Promise.resolve({
                commandId: request.command.commandId,
                transport: "fake" as const,
                acceptedAt: now(),
              }),
              completed,
              alive: () => false,
              kill() {},
            };
          },
        };
        let at = Date.now();
        const host = new VerificationHost({
          driver: session.driver,
          transport: failing,
          now: () => at,
        });
        const attempt = host.run(
          target.prepared.snapshotPath,
          "process-double",
          "unknown",
        );
        if (failure === "failed")
          assert.equal((await attempt).status, "failed");
        else await assert.rejects(attempt, /transport-failed/u);
        const log = decodeLog(session.driver.log);
        assert.equal(
          log.filter((event) => event.type === "WorkerInterrupted").length,
          1,
        );
        assert.equal(session.driver.state.next, "review");
        assert.ok(session.driver.state.pending!.review);
        assert.equal(
          log.filter((event) => event.type === "ReviewCompleted").length,
          0,
        );
        const old = log
          .filter((event) => event.type === "WorkerAttemptStarted")
          .at(-1)!.payload as any;
        at += LEASE_MS + 1;
        await new VerificationHost({
          driver: session.driver,
          transport: fixture.doubleTransport(),
          now: () => at,
        }).run(target.prepared.snapshotPath, "process-double", "unknown");
        const fresh = decodeLog(session.driver.log)
          .filter((event) => event.type === "WorkerAttemptStarted")
          .at(-1)!.payload as any;
        assert.notEqual(fresh.workerEpisodeId, old.workerEpisodeId);
        assert.equal(session.driver.state.next, "reviewed");
      } finally {
        session.store.release();
      }
    }
  },
);

test(
  "[document] WO-181 AC1: independent review finds planted naming and scope defects without changing snapshot or behavior rows",
  options,
  async () => {
    const fixture = await loadFixture();
    const target = fixture.createReviewFixture();
    const requests: any[] = [];
    const result = await fixture.runReview(target, {
      transport: fixture.doubleTransport((request: any) =>
        requests.push(request),
      ),
    });
    assert.deepEqual(result.review.counts, { blocking: 2, should: 0, nit: 0 });
    assert.deepEqual(
      result.review.findings.map((finding: any) => [
        finding.findingId,
        finding.expected,
      ]),
      [
        ["naming", fixture.conventionRule],
        ["scope", fixture.scopeRule],
      ],
    );
    assert.equal(result.snapshotUnchanged, true);
    assert.ok(
      result.behaviorRows.every((row: any) => row.status === "verified"),
    );
    assert.equal(
      new Set([
        result.review.reviewerEpisodeId,
        ...result.review.verifierEpisodeIds,
        ...result.review.implementerEpisodeIds,
      ]).size,
      3,
    );
    assert.equal(requests[1].review.rows.length, 2);
    assert.equal(requests[1].review.baseline.evidence.length, 2);
    assert.match(transportPrompt(requests[1]), /CONVENTIONS.md/u);
    assert.doesNotMatch(
      transportPrompt(requests[1]),
      /Untrusted implementer success/u,
    );
    assert.equal(
      (evidenceResultSchema(requests[1]) as any).properties.kind.enum[0],
      "review",
    );
    const replayed = replayVerification(
      decodeLog(result.log),
      result.driver.workstreamId,
    );
    assert.deepEqual(replayed, result.driver.state);
    assert.deepEqual(
      projectAcceptanceEvidenceMatrices(decodeLog(result.log))[0]!.review,
      result.review,
    );
  },
);

test(
  "[document] WO-181 AC2: file edits, patches, diff and behavior verdicts are refused by closed review admission",
  options,
  async () => {
    const fixture = await loadFixture();
    const target = fixture.createReviewFixture();
    let request: any;
    await fixture.runReview(target, {
      transport: fixture.doubleTransport((value: any) => {
        if (value.review) request = value;
      }),
    });
    const result = fixture.doubleResult(request);
    for (const key of ["edits", "patch", "diff", "files", "replacements"])
      assert.throws(
        () => parseEvidenceResult({ ...result, [key]: [] }, request),
        /review cannot return edits or diff/u,
      );
    assert.throws(
      () => parseEvidenceResult({ ...result, evaluations: [] }, request),
      /episode result shape/u,
    );
    for (const edit of [
      (finding: any) => {
        finding.severity = "major";
      },
      (finding: any) => {
        delete finding.class;
      },
      (finding: any) => {
        finding.evidenceRefs = ["file:sum.mjs"];
      },
      (finding: any) => {
        finding.likelySurface = ["outside.mjs"];
      },
      (finding: any) => {
        finding.diff = "patch";
      },
    ]) {
      const changed = structuredClone(result);
      edit(changed.findings[0]);
      assert.throws(
        () => parseEvidenceResult(changed, request),
        /review finding contract/u,
      );
    }
    for (const episodeId of [
      request.review.rows[0].episodeId,
      ...request.review.implementerEpisodes,
    ]) {
      const changed = {
        ...result,
        envelope: { ...result.envelope, episodeId },
      };
      assert.throws(
        () => parseEvidenceResult(changed, { ...request, episodeId }),
        /review episode identity/u,
      );
    }
  },
);

test(
  "[document] WO-181 AC3: only blocking review findings enter real bounded repair and fresh re-verification",
  options,
  async () => {
    const fixture = await loadFixture();
    const target = fixture.createReviewFixture({ scopeDefect: false });
    const result = await fixture.runReview(target, {
      transport: fixture.doubleTransport(() => {}, { minor: true }),
    });
    const composed = await fixture.composeRepairDouble(target, result.review);
    assert.equal(composed.route.kind, "RepairAndReverify");
    assert.deepEqual(
      composed.route.knownItems.map((finding: any) => finding.severity),
      ["should", "nit"],
    );
    assert.deepEqual(
      composed.launches.map((launch: any) => launch.role),
      ["repairer", "verifier"],
    );
    assert.equal(composed.states[0].status, "complete");
    assert.deepEqual(
      composed.states[0].original.criteria,
      target.original.criteria,
    );
    assert.deepEqual(composed.states[0].original.tests, target.original.tests);
    assert.deepEqual(composed.states[0].order.surfaces, ["sum.mjs"]);
    assert.deepEqual(composed.states[0].order.grantIds, []);
    const minorOnly = {
      ...result.review,
      findings: result.review.findings.filter(
        (finding: any) => finding.severity !== "blocking",
      ),
      counts: { blocking: 0, should: 1, nit: 1 },
    };
    const known = await fixture.composeRepairDouble(target, minorOnly);
    assert.equal(known.route.kind, "DeliverableKnownItems");
    assert.deepEqual(known.launches, []);
    assert.equal(known.route.repairs.length, 0);
  },
);

test(
  "[document] WO-181 scope defects cannot widen repair authority and human attention dispatches nothing",
  options,
  async () => {
    const fixture = await loadFixture();
    const target = fixture.createReviewFixture();
    const result = await fixture.runReview(target);
    const route = routeReview(
      result.review,
      target.original,
      target.prepared.subject,
    );
    assert.equal(route.kind, "NeedsHuman");
    const refusal = route.repairs.find(
      (entry) => entry.reviewItem.finding.findingId === "scope",
    )!.derivation;
    assert.equal(refusal.kind, "NeedsHuman");
    if (refusal.kind === "NeedsHuman")
      assert.equal(refusal.reason, "path outside original surfaces");
    assert.deepEqual(
      routeReview(
        { ...result.review, requiresHuman: true },
        target.original,
        target.prepared.subject,
      ).repairs,
      [],
    );
    assert.throws(
      () => routeReview(result.review, target.original, target.base.subject),
      /stale review/u,
    );
    assert.equal(
      deriveRepairOrder(result.review.findings[0], {
        ...target.original,
        subject: target.prepared.subject,
        round: 0,
      }).kind,
      "NeedsHuman",
    );
  },
);

test(
  "[document] WO-181 absent conventions are explicit and forbid a convention reference",
  options,
  async () => {
    const fixture = await loadFixture();
    const target = fixture.createReviewFixture({ conventions: false });
    let request: any;
    const result = await fixture.runReview(target, {
      transport: fixture.doubleTransport((value: any) => {
        if (value.review) request = value;
      }),
    });
    assert.equal(result.review.conventionsPath, null);
    assert.deepEqual(
      result.review.findings.map((finding: any) => finding.findingId),
      ["scope"],
    );
    assert.match(transportPrompt(request), /Declared conventions are absent/u);
    const forged = fixture.doubleResult(request);
    forged.findings[0].evidenceRefs.push("conventions:CONVENTIONS.md");
    assert.throws(
      () => parseEvidenceResult(forged, request),
      /review finding contract/u,
    );
    assert.throws(
      () =>
        validateReviewContext(
          { ...request.review, conventionsPath: "README.md" },
          request.capsule,
        ),
      /unchanged sealed file/u,
    );
  },
);

test(
  "[document] WO-181 unpassed, foreign or narrative-bearing review context refuses",
  options,
  async () => {
    const fixture = await loadFixture();
    const target = fixture.createReviewFixture();
    let request: any;
    await fixture.runReview(target, {
      transport: fixture.doubleTransport((value: any) => {
        if (value.review) request = value;
      }),
    });
    for (const edit of [
      (review: any) => {
        review.rows[0].evaluation.verdict = "unverified";
      },
      (review: any) => {
        review.rows[0].episodeId = review.implementerEpisodes[0];
      },
      (review: any) => {
        review.rows[0].evaluation.evidenceRefs = [];
      },
      (review: any) => {
        review.implementerSummary = "Untrusted implementer success";
      },
      (review: any) => {
        review.baseline.summary = "Untrusted implementer success";
      },
    ]) {
      const changed = structuredClone(request.review);
      edit(changed);
      assert.throws(() => validateReviewContext(changed, request.capsule));
      assert.throws(() =>
        validateTransportRequest({ ...request, review: changed }),
      );
    }
  },
);

test(
  "[document] WO-181 cached review recovers its producing identity without another model call and completed recovery is idempotent",
  options,
  async () => {
    const fixture = await loadFixture();
    const target = fixture.createReviewFixture();
    let calls = 0;
    let saved = 0;
    await assert.rejects(
      fixture.runReview(target, {
        transport: fixture.doubleTransport(() => calls++),
        afterResultSaved: () => {
          if (++saved === 2) throw new Error("synthetic interruption");
        },
      }),
      /synthetic interruption/u,
    );
    const store = new WorkerStore(join(target.root, "review"));
    store.acquire(() =>
      preflightVerificationRecovery(
        store,
        "ws_review",
        () => target.prepared.snapshotPath,
        "process-double",
        "unknown",
      ),
    );
    try {
      const driver = new VerificationDriver(store, "ws_review");
      const host = new VerificationHost({
        driver,
        transport: fixture.doubleTransport(() => calls++),
        now: Date.now,
      });
      await host.run(target.prepared.snapshotPath, "process-double", "unknown");
      assert.equal(calls, 2);
      assert.match(
        driver.state.reviewCompleted!.reviewerEpisodeId,
        /attempt_1$/u,
      );
      assert.equal(
        decodeLog(driver.log).filter(
          (event) => event.type === "ReviewCompleted",
        ).length,
        1,
      );
      const before = driver.log;
      await host.run(target.prepared.snapshotPath, "process-double", "unknown");
      assert.equal(driver.log, before);
    } finally {
      store.release();
    }
  },
);

test(
  "[document] WO-181 review completion requires the admitted host result and intact snapshot permissions",
  options,
  async () => {
    const fixture = await loadFixture();
    const target = fixture.createReviewFixture();
    const result = await fixture.runReview(target);
    const events = decodeLog(result.log);
    const index = events.findIndex((event) => event.type === "ReviewCompleted");
    const forged = [
      ...events.slice(0, index),
      { ...events[index]!, actorId: "implementer" },
    ];
    assert.equal(
      replayVerification(forged, result.driver.workstreamId).reviewCompleted,
      undefined,
    );
    const changed = structuredClone(events[index]!);
    (changed.payload as any).counts.blocking = 0;
    assert.throws(
      () =>
        replayVerification(
          [...events.slice(0, index), changed],
          result.driver.workstreamId,
        ),
      /review result provenance/u,
    );
    const file = join(target.prepared.snapshotPath, "sum.mjs");
    const originalBytes = readFileSync(file, "utf8");
    chmodSync(file, 0o600);
    writeFileSync(file, originalBytes + "// tampered\n");
    const store = new WorkerStore(join(target.root, "review"));
    assert.throws(
      () =>
        store.acquire(() =>
          preflightVerificationRecovery(
            store,
            "ws_review",
            () => target.prepared.snapshotPath,
            "process-double",
            "unknown",
          ),
        ),
      /snapshot/u,
    );
  },
);

test(
  "[document] WO-181 failed behavior never dispatches a reviewer",
  options,
  async () => {
    const fixture = await loadFixture();
    const target = fixture.createReviewFixture();
    let calls = 0;
    const session = fixture.openReview(
      { ...target, prepared: target.base },
      { transport: fixture.doubleTransport(() => calls++) },
    );
    try {
      await session.host.run(
        target.base.snapshotPath,
        "process-double",
        "unknown",
      );
      assert.equal(session.driver.state.next, "attention");
      assert.equal(session.driver.state.reviewCompleted, undefined);
      assert.equal(calls, 1);
      assert.throws(
        () => session.driver.persistNext(Date.now()),
        /dispatch phase/u,
      );
    } finally {
      session.store.release();
    }
  },
);
