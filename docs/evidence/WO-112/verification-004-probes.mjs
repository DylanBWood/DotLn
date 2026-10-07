// VER-004 probes for WO-112. Synthetic fixtures through the real resident,
// vertical host and review loop; no vendor worker, forge or network. The
// script asserts nothing: it prints one JSON row per probe.
//
//   node scripts/harness.mjs bounded -- node docs/evidence/WO-112/verification-004-probes.mjs
//
// R1: a retryable triage failure during the resolution step, driven by the
// resident's own run loop (`dotln resident` calls ResidentHost.run).
// R2: the same failure kind during intake, for contrast with the existing
// resident backoff path.
// B1: a review body edited on every observation, judged within one
// invocation of the review loop, with a probe-side cap on episodes.
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { appendEvent } from "@dotln/kernel";
import { WorkerStore } from "../../../packages/skeleton/dist/src/worker-store.js";
import { resolveReviewComments } from "../../../scripts/lib/review-comment-loop.mjs";
import { TARGET_PUBLISH_HOST } from "../../../scripts/lib/target-publish.mjs";
import { PULL_REQUEST_OBSERVER } from "../../../scripts/lib/pull-request-observer.mjs";
import {
  verticalFixture,
  runState,
  put,
} from "../../../scripts/fixtures/vertical/fixture.mjs";
import {
  readVerticalConfiguration,
  createVerticalEntry,
} from "../../../scripts/lib/vertical-runtime.mjs";
import { ResidentHost } from "../../../packages/skeleton/dist/src/resident-host.js";
import {
  recordPresence,
  replayResident,
} from "../../../packages/skeleton/dist/src/resident-store.js";
import { WorkerFailure } from "../../../packages/skeleton/dist/src/worker-protocol.js";
import { validateTransportRequest } from "../../../packages/skeleton/dist/src/verification-protocol.js";

const emit = (row) => console.log(JSON.stringify(row));

// The same declared double as the executor's judgment tests.
function judgmentDouble(answer) {
  const calls = [];
  return {
    calls,
    transport: {
      name: "fake",
      harnessVersion: "not-applicable",
      dispatch(request, clock) {
        validateTransportRequest(request);
        calls.push(request);
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

// The executor's intake double: it answers by source unit, never by text.
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

async function residentLoop(failingTask) {
  const f = await verticalFixture({
    forge: {
      reviews: [{ id: "S1", text: "No additional changes requested." }],
    },
  });
  try {
    if (failingTask === "intake") {
      // As the executor's useModelIntake: the issue is judged by an episode.
      const { number, draftId } = f.config.issues[0];
      f.config.issues[0] = { number, draftId, intake: "model" };
      put(join(f.directory, "vertical.json"), f.config);
    }
    const judge = judgmentDouble((request, count) => {
      if (request.task === failingTask && count <= 1)
        throw new WorkerFailure("interrupted", "synthetic transient outage");
      if (request.task === "intake") return intakeByUnit(request);
      if (request.task === "triage")
        return {
          kind: "acknowledge",
          criterionId: null,
          reason: "Fresh episode found no action.",
          evidenceRefs: [request.subject.evidence[0].ref],
        };
      throw new Error(`unexpected task ${request.task}`);
    });
    const cfg = readVerticalConfiguration(f.directory, f.launchpad);
    const entry = createVerticalEntry({
      directory: f.directory,
      configuration: cfg,
      now: f.now,
      external: { ...f.external, judge: judge.transport },
    });
    f.setTime(120);
    // The resident's clock advances each time it is read, as wall time would.
    const clock = () => {
      f.tick();
      return f.now();
    };
    const host = new ResidentHost({
      directory: f.directory,
      configuration: cfg.resident,
      policyId: cfg.resident.policyId,
      now: clock,
      capabilities: () => ["adapter.fixture"],
      vertical: entry.resident,
    });
    await recordPresence(f.directory, "away", f.now);
    let ticks = 0;
    const tick = host.tick.bind(host);
    host.tick = async () => {
      ticks++;
      return tick();
    };
    let loop;
    try {
      await host.run({ cycles: 60, tickMs: 1 });
      loop = { ended: "cycles-exhausted" };
    } catch (error) {
      loop = { ended: "threw", error: error?.name, message: error?.message };
    }
    const resident = replayResident(host.store.read()).state.resident;
    const intent = Object.values(resident.intents ?? {})[0];
    const run = intent?.binding
      ? runState(f.directory, intent.binding.key)
      : undefined;
    return {
      failingTask,
      loop,
      ticksBeforeLoopEnded: ticks,
      cyclesRequested: 60,
      judgeCalls: judge.calls.map((r) => r.task),
      intentKind: intent?.kind ?? null,
      runTerminal: run?.terminal?.kind ?? null,
      pendingStep: run?.pending?.step ?? null,
    };
  } finally {
    f.close();
  }
}

emit({
  probe: "R1 resident loop, retryable triage failure",
  ...(await residentLoop("triage")),
});
emit({
  probe: "R2 resident loop, retryable intake failure",
  ...(await residentLoop("intake")),
});

async function changingBody(cap) {
  const root = mkdtempSync(join(tmpdir(), "dotln-ver004-body-"));
  try {
    const publication = new WorkerStore(join(root, "publication"));
    const repositoryId = "github.com/dotln-fixture/target",
      number = 7;
    let clock = 10,
      calls = 0,
      observations = 0;
    const record = (actorId, type, payload, causationId) => {
      publication.acquire();
      try {
        const { event } = appendEvent(publication.read(), {
          schemaVersion: 1,
          type,
          occurredAt: ++clock,
          actorId,
          workstreamId: "ws_ver004_body",
          ...(causationId ? { causationId } : {}),
          payload,
        });
        publication.append(event);
        return event;
      } finally {
        publication.release();
      }
    };
    const opening = record(TARGET_PUBLISH_HOST, "PullRequestOpened", {
      repositoryId,
      number,
    });
    let outcome;
    try {
      const result = await resolveReviewComments({
        store: root,
        repositoryId,
        number,
        now: () => ++clock,
        original: { surfaces: ["fixture.txt"], criteria: [], tests: [] },
        observe() {
          observations++;
          // An automated summary that carries a changing status line.
          record(
            PULL_REQUEST_OBSERVER,
            "PullRequestStateObserved",
            {
              repositoryId,
              number,
              headSha: "a".repeat(40),
              checks: [],
              comments: [
                {
                  id: "S1",
                  class: "automated-review",
                  text: `Review summary, refreshed ${observations}. No changes requested.`,
                  resolved: false,
                },
              ],
            },
            opening.eventId,
          );
          return {};
        },
        async triage(entry) {
          if (++calls > cap) throw new Error("probe cap reached");
          return {
            kind: "acknowledge",
            criterionId: null,
            reason: "No action requested.",
            evidenceRefs: [`observation:${entry.observation.eventId}`],
          };
        },
      });
      outcome = { returned: result.status };
    } catch (error) {
      outcome = { threw: error?.name, message: error?.message };
    }
    return { cap, triageCalls: calls, observations, ...outcome };
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}
emit({
  probe: "B1 review body edited on every observation",
  ...(await changingBody(25)),
});
