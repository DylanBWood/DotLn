#!/usr/bin/env node
// Replays a receipt's first verification log through the acceptance-matrix fold,
// injects implementer-authored events and requires the negative result to remain
// negative. Controls show the injected position and payload are live, so the
// check fails if the fold ever honors an implementer. Build first: this reads dist.
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync, realpathSync } from "node:fs";
import { fileURLToPath } from "node:url";
import {
  appendEvent,
  decodeLog,
} from "../../../packages/kernel/dist/src/index.js";
import { COMPILER_PACKAGE_VERSION } from "../../../packages/compiler/dist/src/index.js";
import { projectAcceptanceEvidenceMatrices } from "../../../packages/skeleton/dist/src/verification.js";

const HOST = "verification-host";
const toLog = (lines) => lines.map((line) => `${line}\n`).join("");
const hostEvent = (events, type, last = false) =>
  events[last ? "findLast" : "find"](
    (event) => event.type === type && event.actorId === HOST,
  );

/** The capsule binds the compiler package version; replay recompiles under it.
 * Read from the bytes: the caller may be running a different compiler version. */
export function recordedCompilerVersion(lines) {
  const persisted = hostEvent(
    lines.map((line) => JSON.parse(line)),
    "CommandPersisted",
  );
  const version =
    persisted?.payload?.command?.intent?.payload?.capsule
      ?.compilerPackageVersion;
  assert.match(String(version), /^\d+\.\d+\.\d+$/u, "recorded capsule version");
  return version;
}

const project = (log) => {
  const matrices = projectAcceptanceEvidenceMatrices(decodeLog(log));
  assert.equal(matrices.length, 1, "one verification workstream");
  return matrices[0];
};
const summary = (matrix) => ({
  phase: matrix.phase,
  rows: matrix.rows.map((row) => ({
    criterionId: row.criterion.criterionId,
    status: row.status,
  })),
  openFindings: matrix.findings
    .filter((record) => record.status === "open")
    .map((record) => record.finding.findingId),
});

/** The facts a receipt states about a verification, projected from its log by
 * the fold. The collector records this view; the regression fixture recomputes
 * it from the published bytes and requires the two to agree. */
export function verificationView(events) {
  const matrix = projectAcceptanceEvidenceMatrices(events)[0];
  if (!matrix) return null;
  const result = hostEvent(events, "CommandResult", true);
  const persisted = hostEvent(events, "CommandPersisted");
  return {
    verifierEpisodeId: result?.payload?.value?.envelope?.episodeId ?? null,
    summary: result?.payload?.value?.envelope?.summary ?? null,
    contract:
      persisted?.payload?.command?.intent?.payload?.capsule?.subject?.snapshot
        ?.contract ?? null,
    subjectRevision: matrix.subjectRevision,
    witnesses: matrix.evidence.map((witness) => ({
      evidenceId: witness.evidenceId,
      criterionId: witness.criterionId,
      checkId: witness.checkId,
      command: witness.hostTest?.command ?? null,
      exitCode: witness.hostTest?.exitCode ?? null,
      signal: witness.hostTest?.signal ?? null,
      outcome: witness.outcome,
      observed: witness.observed,
      expected: witness.expected,
    })),
    rows: matrix.rows.map((row) => ({
      criterionId: row.criterion.criterionId,
      status: row.status,
    })),
    findings: matrix.findings.map((item) => ({
      status: item.status,
      finding: item.finding,
    })),
  };
}

export function replayNegative(lines) {
  assert.equal(
    recordedCompilerVersion(lines),
    COMPILER_PACKAGE_VERSION,
    "replay requires the recorded compiler identity; use replayRecorded",
  );
  const log = toLog(lines);
  const events = decodeLog(log);
  const opened = hostEvent(events, "VerificationOpened");
  const result = hostEvent(events, "CommandResult", true);
  assert.ok(opened && result, "log needs an opening and an admitted result");
  const implementer = opened.payload.implementerEpisodeId;
  const { eventId: _eventId, causationId: _causationId, ...draft } = result;
  const genuine = result.payload.value;
  const before = project(log);
  const failed = summary(before)
    .rows.filter((row) => row.status === "failed")
    .map((row) => row.criterionId);
  const authored = (overrides, value, identity = {}) => ({
    ...draft,
    ...overrides,
    payload: { ...result.payload, ...identity, value },
  });
  const asImplementerEpisode = (value) => ({
    ...value,
    envelope: { ...value.envelope, episodeId: implementer },
  });
  // Admissible from the verifier, and it erases the negative: the failed
  // criterion becomes unverified and its finding disappears.
  const erasure = {
    ...genuine,
    evaluations: genuine.evaluations.map((item) =>
      failed.includes(item.criterionId)
        ? { ...item, verdict: "unverified" }
        : item,
    ),
    findings: [],
  };
  const allPass = {
    ...genuine,
    evaluations: genuine.evaluations.map((item) => ({
      ...item,
      verdict: "pass",
    })),
    findings: [],
  };

  // After the admitted result: appended to the complete, unedited log.
  const at = events.at(-1).occurredAt + 1;
  const injections = [
    [
      "implementer-success-event",
      authored(
        { actorId: "implementer", episodeId: implementer, occurredAt: at },
        { envelope: { status: "completed", summary: "Everything passed" } },
      ),
    ],
    [
      "implementer-episode-forged-pass",
      authored({ occurredAt: at }, asImplementerEpisode(allPass), {
        workerEpisodeId: implementer,
      }),
    ],
  ].map(([name, injected]) => {
    const after = project(appendEvent(log, injected).log);
    return {
      name,
      ...summary(after),
      unchanged: JSON.stringify(after) === JSON.stringify(before),
    };
  });

  // While the verifier command is still pending and leased: the recorded prefix
  // is replayed unedited and the forgery lands where the genuine result would.
  const cut = events.findIndex(
    (event) => event.type === "VerificationWorkerResultObserved",
  );
  assert.ok(cut > 0, "log needs a pending prefix");
  const prefix = toLog(lines.slice(0, cut));
  const pending = project(prefix);
  const pendingAt = events[cut - 1].occurredAt;
  // The recorded tail follows a forgery only in memory. Event identifiers are
  // positional, so references into the tail shift by the one inserted event.
  const shifted = (value) =>
    typeof value === "string"
      ? value.replace(/^evt_(\d+)$/u, (id, n) =>
          Number(n) > cut ? `evt_${Number(n) + 1}` : id,
        )
      : Array.isArray(value)
        ? value.map(shifted)
        : value && typeof value === "object"
          ? Object.fromEntries(
              Object.entries(value).map(([key, item]) => [key, shifted(item)]),
            )
          : value;
  const withTail = (start) =>
    events.slice(cut).reduce((current, event) => {
      const { eventId: _id, ...rest } = shifted(event);
      return appendEvent(current, rest).log;
    }, start);

  const control = {
    // The position is live: the genuine result, appended here, is admitted.
    genuineResultAdmitted:
      JSON.stringify(summary(project(appendEvent(prefix, draft).log)).rows) ===
      JSON.stringify(summary(before).rows),
    // The erasure payload is live: authored by the verifier it would be honored.
    erasureHonoredFromVerifier: (() => {
      const view = summary(
        project(
          appendEvent(prefix, authored({ occurredAt: pendingAt }, erasure)).log,
        ),
      );
      return (
        view.openFindings.length === 0 &&
        view.rows.every((row) => row.status !== "failed") &&
        JSON.stringify(view) !== JSON.stringify(summary(pending))
      );
    })(),
  };
  const pendingInjections = [
    [
      "pending-implementer-actor-erasure",
      authored({ actorId: "implementer", occurredAt: pendingAt }, erasure),
    ],
    [
      "pending-implementer-episode-erasure",
      authored({ occurredAt: pendingAt }, asImplementerEpisode(erasure), {
        workerEpisodeId: implementer,
      }),
    ],
    // The two episode guards overlap, so each is also exercised alone.
    [
      "pending-implementer-envelope-under-verifier-attempt",
      authored({ occurredAt: pendingAt }, asImplementerEpisode(erasure)),
    ],
    [
      "pending-verifier-envelope-under-implementer-attempt",
      authored({ occurredAt: pendingAt }, erasure, {
        workerEpisodeId: implementer,
      }),
    ],
    [
      "pending-implementer-actor-pass",
      authored({ actorId: "implementer", occurredAt: pendingAt }, allPass),
    ],
    [
      // Even under the genuine verifier episode, a pass that contradicts the
      // adverse host witness is refused.
      "pending-verifier-episode-pass-against-witness",
      authored({ occurredAt: pendingAt }, allPass),
    ],
  ].map(([name, injected]) => {
    const forged = appendEvent(prefix, injected).log;
    const after = summary(project(withTail(forged)));
    return {
      name,
      matrixUnchanged:
        JSON.stringify(project(forged)) === JSON.stringify(pending),
      afterRecordedTail: after,
      tailEqualsRecorded:
        JSON.stringify(after) === JSON.stringify(summary(before)),
    };
  });

  const negative = (view) =>
    view.rows.some((row) => row.status === "failed") &&
    view.openFindings.length > 0;
  return {
    compilerPackageVersion: COMPILER_PACKAGE_VERSION,
    events: events.length,
    before: summary(before),
    control,
    injections,
    pendingInjections,
    negativeRetained:
      negative(summary(before)) &&
      control.genuineResultAdmitted &&
      control.erasureHonoredFromVerifier &&
      injections.every(
        (injection) => injection.unchanged && negative(injection),
      ) &&
      pendingInjections.every(
        (injection) =>
          injection.matrixUnchanged &&
          injection.tailEqualsRecorded &&
          negative(injection.afterRecordedTail),
      ),
  };
}

/** Durable entry: a child process pins the receipt's recorded compiler identity
 * and returns the replay together with the fold's view of the recorded log. */
export function replayRecorded(lines) {
  return JSON.parse(
    execFileSync(
      process.execPath,
      [
        "--import",
        fileURLToPath(
          new URL("./recorded-compiler-loader.mjs", import.meta.url),
        ),
        fileURLToPath(import.meta.url),
        "--replay-recorded",
      ],
      {
        encoding: "utf8",
        // A refusal surfaces as the thrown error, not as parent stderr noise.
        stdio: ["pipe", "pipe", "pipe"],
        input: JSON.stringify(lines),
        env: {
          ...process.env,
          DOTLN_WO056_RECORDED_COMPILER: recordedCompilerVersion(lines),
        },
        timeout: 60_000,
      },
    ),
  );
}

if (
  process.argv[1] &&
  realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const [mode] = process.argv.slice(2);
  if (mode === "--replay-recorded") {
    const lines = JSON.parse(readFileSync(0, "utf8"));
    process.stdout.write(
      JSON.stringify({
        replay: replayNegative(lines),
        view: verificationView(decodeLog(toLog(lines))),
      }),
    );
  } else if (mode && mode.endsWith(".json")) {
    const receipt = JSON.parse(readFileSync(mode, "utf8"));
    assert.equal(
      receipt.eventLog?.epistemic,
      "observed",
      "this receipt withheld its event log",
    );
    console.log(
      JSON.stringify(
        replayRecorded(receipt.eventLog.value.lines).replay,
        null,
        2,
      ),
    );
  } else throw new Error("usage: replay.mjs <receipt.json>");
}
