import { docRelative, findLaunchpad } from "./lib/config.mjs";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { appendEvent, decodeLog, replay, replayOutbox } from "@dotln/kernel";
import {
  canonicalStringify,
  COMPILER_PACKAGE_VERSION,
  compileFeedbackAudit,
  compileFeedbackUnits,
} from "@dotln/compiler";
import {
  initialState,
  initialVerificationRuntime,
  seiriReactor,
  seiriPredicates,
  feedbackStateFromRuntime,
} from "../packages/skeleton/dist/src/reactor.js";
import {
  replayScenario,
  runScenario,
  LiveReactorDriver,
  startScenario,
} from "../packages/skeleton/dist/src/scenario.js";
import { projectAuditEvents } from "../packages/skeleton/dist/src/audit.js";
import {
  projectWorkerStatus,
  renderWorkerStatus,
} from "../packages/skeleton/dist/src/worker-status.js";
import { projectAcceptanceEvidenceMatrices } from "../packages/skeleton/dist/src/verification.js";
import { retainedFeedbackUnitsV1 } from "../packages/skeleton/dist/src/loadouts/feedback.js";
import { WorkerStore } from "../packages/skeleton/dist/src/worker-store.js";
import { WorkerHost } from "../packages/skeleton/dist/src/worker-host.js";
import { runWorkerDemo } from "../packages/skeleton/dist/src/worker-demo.js";
import { runVerificationDemo } from "../packages/skeleton/dist/src/verification-demo.js";
import { FakeVerificationTransport } from "../packages/skeleton/dist/src/verification-fake.js";
import {
  ClaudeCliPrintWorkOrderTransport,
  CodexCliExecWorkOrderTransport,
  runWorkerProcess,
} from "../packages/skeleton/dist/src/worker-transport.js";
import { LEASE_MS } from "../packages/skeleton/dist/src/worker-protocol.js";

const fixtures = "packages/skeleton/fixtures/wo050";
const fixture = JSON.parse(
  readFileSync("packages/skeleton/fixtures/repo-tree.json", "utf8"),
);
const save = (name, log) =>
  writeFileSync(join(fixtures, `${name}.jsonl`), log, { flag: "wx" });

// Capture once on the pre-refactor source. Checks only replay these fixed bytes.
async function capture(directory) {
  mkdirSync(fixtures, { recursive: true });
  const transport = (
    kind = "claude",
    behavior = "success",
    wrap = (child) => child,
  ) => {
    const name = kind === "claude" ? "claude-cli-print" : "codex-cli-exec";
    const runner = (launch) =>
      wrap(
        runWorkerProcess({
          ...launch,
          binary: process.execPath,
          args: [
            "packages/skeleton/fixtures/worker-cli.mjs",
            name,
            behavior,
            ...launch.args,
          ].map((arg, index) => (index === 0 ? join(process.cwd(), arg) : arg)),
        }),
      );
    return kind === "claude"
      ? new ClaudeCliPrintWorkOrderTransport(runner, "2.1.270")
      : new CodexCliExecWorkOrderTransport(runner, "0.154.0");
  };
  for (const kind of ["claude", "codex"]) {
    const result = await runWorkerDemo({
      directory: join(directory, kind),
      fixture,
      transport: transport(kind),
      model: "required-model",
      effort: kind === "claude" ? "high" : "unknown",
      now: () => 10000000,
    });
    assert.equal(result.scenario.verified, true);
    save(`worker-${kind}`, result.scenario.log);
  }
  for (const row of [2, 6]) {
    let at = row * 10000000;
    const directoryForRow = join(directory, `row${row}`);
    const options = {
      directory: directoryForRow,
      fixture,
      model: "required-model",
      effort: "high",
      now: () => at,
    };
    await assert.rejects(
      runWorkerDemo({
        ...options,
        transport: transport("claude", row === 6 ? "wait" : "success"),
        ...(row === 2
          ? {
              afterResultSaved: () => {
                throw new Error("injected crash");
              },
            }
          : { onRunning: (dispatch) => dispatch.kill() }),
      }),
      row === 2 ? /injected crash/ : /interrupted/,
    );
    save(
      `worker-row${row}-interrupted`,
      new WorkerStore(directoryForRow).read(),
    );
    at += LEASE_MS + 1;
    const result = await runWorkerDemo({
      ...options,
      transport:
        row === 2
          ? new ClaudeCliPrintWorkOrderTransport(() => {
              throw new Error("cached recovery dispatched");
            }, "2.1.270")
          : transport(),
    });
    assert.equal(result.scenario.verified, true);
    save(`worker-row${row}-recovered`, result.scenario.log);
  }
  const store = new WorkerStore(join(directory, "row4"));
  store.acquire();
  try {
    let at = 1200001;
    const driver = new LiveReactorDriver(undefined, store.append);
    startScenario(driver);
    const host = new WorkerHost({
      store,
      driver,
      transport: transport("claude", "success", (child) => ({
        ...child,
        completed: child.completed.then((result) => {
          at = 2400000;
          return result;
        }),
      })),
      now: () => at,
    });
    await assert.rejects(
      host.run(
        store.directory ?? join(directory, "row4"),
        fixture,
        "required-model",
        "high",
      ),
      /profile-refused/,
    );
    save("worker-row4-quarantined", store.read());
  } finally {
    store.release();
  }
  let at = 1000000;
  const verified = await runVerificationDemo({
    directory: join(directory, "verification"),
    transport: new FakeVerificationTransport(),
    model: "synthetic",
    effort: "unknown",
    now: () => at++,
  });
  assert.equal(verified.matrix.phase, "complete");
  save("verification", verified.log);
  save("scenario", runScenario(fixture).log);
  save(
    "scenario-recovery",
    runScenario(fixture, { crashAfterPersist: true }).log,
  );
  const program = compileFeedbackUnits(retainedFeedbackUnitsV1);
  const workOrder = compileFeedbackAudit(
    program,
    "fixture",
    "a".repeat(40),
    "source-1",
  );
  let log = "",
    state = initialState();
  const feed = (type, occurredAt, payload, actorId = "feedback-host") => {
    const appended = appendEvent(log, {
      schemaVersion: 1,
      type,
      occurredAt,
      actorId,
      workstreamId: "test_feedback",
      payload,
    });
    state = seiriReactor(state, appended.event, {
      now: occurredAt,
      rngState: 17,
      predicates: {},
    }).state;
    log = appended.log;
  };
  feed("FeedbackAuditOpened", 0, {
    program,
    workOrder,
    subject: "source-1",
    authority: {
      authorityEnvelopeId: "fixture-authority",
      allowedEffects: ["feedback.audit", "repo.delete"],
      deniedEffects: [],
      resourceLimits: { audits: 1 },
      requiredEvidence: ["feedback-policy", "pinned-source"],
      expiresAt: 10,
      revocationEventTypes: [],
    },
  });
  feed("FeedbackAuditRequested", 1, {});
  feed("CommandPersisted", 2, {
    command: feedbackStateFromRuntime(state).pending,
  });
  feed("FeedbackAuditExecutionRequested", 3, {});
  feed("FeedbackAuditExecutionRequested", 11, {});
  feed(
    "OperatorCorrectionReceived",
    12,
    { message: "ordinary content" },
    "worker",
  );
  feed("OrdinaryMessage", 13, { message: "ordinary content" }, "operator");
  feed("OperatorReportsRegression", 14, {}, "operator");
  feed("FeedbackAuditExecutionRequested", 15, {});
  save("feedback-correction", log);
}

export function identityCases(root = findLaunchpad()) {
  return [
    ...readdirSync(fixtures)
      .filter((name) => name.endsWith(".jsonl"))
      .map((name) => `${fixtures}/${name}`),
    "packages/skeleton/fixtures/wo029-legacy-scenario.jsonl",
    docRelative(root, "evidence", "WO-010/events.jsonl"),
    docRelative(root, "evidence", "WO-011/verification/events.jsonl"),
    docRelative(root, "evidence", "WO-011/selfhost-audit.jsonl"),
    docRelative(root, "evidence", "WO-011/selfhost-verification.jsonl"),
    docRelative(root, "evidence", "WO-048/verification/events.jsonl"),
    docRelative(root, "evidence", "WO-048/feedback-002/selfhost-audit.jsonl"),
    docRelative(
      root,
      "evidence",
      "WO-048/feedback-002/selfhost-verification.jsonl",
    ),
  ];
}
export function identityObservation(path) {
  const log = readFileSync(path, "utf8"),
    events = decodeLog(log);
  const opening = events.find((event) => event.type === "VerificationOpened");
  let state = opening
    ? initialVerificationRuntime(opening.workstreamId)
    : initialState();
  const decisions = [];
  let refusal = null;
  for (const event of events) {
    try {
      const step = replay(state, [event], seiriReactor, seiriPredicates);
      state = step.state;
      decisions.push(...step.decisions);
    } catch (error) {
      refusal = { eventId: event.eventId, message: error.message };
      break;
    }
  }
  const projections = refusal
    ? null
    : opening
      ? {
          matrices: projectAcceptanceEvidenceMatrices(events),
          status: projectWorkerStatus(events),
        }
      : events.some((event) => event.type === "FeedbackAuditOpened")
        ? {
            feedback: feedbackStateFromRuntime(state),
            audit: projectAuditEvents(events),
          }
        : {
            scenario: replayScenario(log),
            status: projectWorkerStatus(events),
            audit: projectAuditEvents(events),
          };
  const prefixes = refusal
    ? null
    : events.map((_, index) => {
        const prefix = events.slice(0, index + 1);
        const status = projectWorkerStatus(prefix);
        return {
          status,
          text: renderWorkerStatus(status),
          outbox: replayOutbox(prefix),
        };
      });
  return (
    canonicalStringify({ decisions, projections, prefixes, refusal }) + "\n"
  );
}
export const identityDigest = (bytes) =>
  createHash("sha256").update(bytes).digest("hex");
const [mode, destination] = process.argv.slice(2);
if (mode === "--capture") await capture(destination);
if (mode === "--check") {
  process.stdout.write(
    execFileSync(
      process.execPath,
      [
        "--import",
        fileURLToPath(
          new URL("./fixtures/historical-compiler-loader.mjs", import.meta.url),
        ),
        fileURLToPath(import.meta.url),
        "--check-historical",
      ],
      { encoding: "utf8" },
    ),
  );
}
if (mode === "--check-historical") {
  assert.equal(
    COMPILER_PACKAGE_VERSION,
    "0.11.1",
    "WO-050 historical compiler identity",
  );
  const manifest = JSON.parse(
    readFileSync("packages/skeleton/fixtures/wo050-identity.json", "utf8"),
  );
  assert.deepEqual(
    identityCases(),
    manifest.map((row) => row.path),
  );
  for (const row of manifest) {
    assert.equal(
      identityDigest(readFileSync(row.path)),
      row.inputSha256,
      `${row.path}: fixed input drift`,
    );
    const bytes = identityObservation(row.path);
    assert.equal(
      Buffer.byteLength(bytes),
      row.bytes,
      `${row.path}: full observation length`,
    );
    assert.equal(
      identityDigest(bytes),
      row.sha256,
      `${row.path}: full Decision/projection identity`,
    );
  }
  console.log(
    `Verified ${manifest.length} complete Decision/projection fixtures under recorded compiler identity 0.11.1, without state normalization.`,
  );
}
if (mode === "--snapshot") {
  mkdirSync(destination, { recursive: true });
  const manifest = identityCases().map((path, index) => {
    const bytes = identityObservation(path);
    writeFileSync(join(destination, `${index}.json`), bytes);
    const value = JSON.parse(bytes);
    return {
      path,
      inputSha256: identityDigest(readFileSync(path)),
      bytes: Buffer.byteLength(bytes),
      sha256: identityDigest(bytes),
      decisions: value.decisions.length,
      refusal: value.refusal,
    };
  });
  writeFileSync(
    join(destination, "manifest.json"),
    JSON.stringify(manifest, null, 2) + "\n",
  );
  console.log(
    `Captured ${manifest.length} full Decision/projection observations.`,
  );
}
