// VER-005 probes for WO-112. Synthetic fixtures through the real resident,
// vertical host and review loop; no vendor worker, forge or network. The
// script asserts nothing: it prints one JSON row per probe.
//
//   node scripts/harness.mjs bounded -- node docs/evidence/WO-112/verification-005-probes.mjs
//
// Variations on the VER-004 repair that its regressions held constant:
// C1: the cached resolution receipt as a hard link or a directory (the
//     regressions use symlinks), with an untampered control.
// R3: a retryable triage failure followed by a refused return, in the
//     resident's own run loop.
// R4: a resolution child aliased during the resident's backoff, after the
//     first episode was interrupted (the regressions alias before any episode
//     or across a one-shot restart).
// B2: the review-body bound's event record and a later, stable invocation.
import {
  existsSync,
  linkSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  renameSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { appendEvent, decodeLog } from "@dotln/kernel";
import { WorkerStore } from "../../../packages/skeleton/dist/src/worker-store.js";
import { WorkerFailure } from "../../../packages/skeleton/dist/src/worker-protocol.js";
import { validateTransportRequest } from "../../../packages/skeleton/dist/src/verification-protocol.js";
import { ResidentHost } from "../../../packages/skeleton/dist/src/resident-host.js";
import {
  recordPresence,
  replayResident,
} from "../../../packages/skeleton/dist/src/resident-store.js";
import { resolveReviewComments } from "../../../scripts/lib/review-comment-loop.mjs";
import { TARGET_PUBLISH_HOST } from "../../../scripts/lib/target-publish.mjs";
import { PULL_REQUEST_OBSERVER } from "../../../scripts/lib/pull-request-observer.mjs";
import {
  verticalFixture,
  runState,
} from "../../../scripts/fixtures/vertical/fixture.mjs";
import {
  readVerticalConfiguration,
  createVerticalEntry,
  runVerticalIssue,
} from "../../../scripts/lib/vertical-runtime.mjs";

const emit = (row) => console.log(JSON.stringify(row));
const settle = async (fn) => {
  try {
    return await fn();
  } catch (error) {
    return { thrown: `${error?.name}: ${error?.message}` };
  }
};

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
const acknowledge = (request) => ({
  kind: "acknowledge",
  criterionId: null,
  reason: "Fresh episode found no action.",
  evidenceRefs: [request.subject.evidence[0].ref],
});
const reviewFixture = () =>
  verticalFixture({
    forge: {
      reviews: [{ id: "S1", text: "No additional changes requested." }],
    },
  });
const preparedChild = (runDirectory) => {
  const name = readdirSync(runDirectory).find(
    (entry) =>
      entry.startsWith("resolution-") &&
      existsSync(join(runDirectory, entry, "prepared.json")),
  );
  return name ? join(runDirectory, name) : null;
};
const listing = (directory) =>
  existsSync(directory)
    ? readdirSync(directory)
        .sort()
        .map((name) => {
          try {
            return [name, readFileSync(join(directory, name), "utf8").length];
          } catch {
            return [name, "unreadable"];
          }
        })
    : null;

// C1: one interrupted episode prepares and caches the resolution input; the
// cache is then altered and the one-shot command re-invoked.
for (const alias of ["none", "hard-link", "directory"]) {
  const f = await reviewFixture();
  try {
    const judge = judgmentDouble((request, count) => {
      if (count === 1)
        throw new WorkerFailure("interrupted", "synthetic interruption");
      return acknowledge(request);
    });
    const external = { ...f.external, judge: judge.transport };
    const run = () =>
      settle(() =>
        runVerticalIssue({
          directory: f.directory,
          issue: 1,
          configuration: readVerticalConfiguration(f.directory, f.launchpad),
          now: () => {
            f.tick();
            return f.now();
          },
          external,
        }),
      );
    const first = await run();
    const runs = join(f.directory, "vertical");
    const runName = readdirSync(runs).find((name) =>
      existsSync(join(runs, name, "events.jsonl")),
    );
    const child = preparedChild(join(runs, runName));
    const elsewhere = join(f.root, "elsewhere");
    mkdirSync(elsewhere);
    const receipt = join(child, "prepared.json");
    if (alias === "hard-link") linkSync(receipt, join(elsewhere, "held.json"));
    if (alias === "directory") {
      renameSync(receipt, join(elsewhere, "prepared.json"));
      mkdirSync(receipt);
    }
    const before = listing(elsewhere);
    const second = await run();
    emit({
      probe:
        "C1 cached resolution receipt altered after an interrupted episode",
      alias,
      first: first.thrown ?? first.terminal?.kind ?? null,
      second: second.thrown ?? second.terminal?.kind ?? null,
      secondStep: second.terminal?.step ?? null,
      secondReason:
        second.receipts?.at(-1)?.value?.reason ?? second.thrown ?? null,
      judgeCalls: judge.calls.length,
      elsewhereUnchanged:
        JSON.stringify(listing(elsewhere)) === JSON.stringify(before),
    });
  } finally {
    f.close();
  }
}

// R3 and R4 drive ResidentHost.run, as `dotln resident` does, with a clock
// that advances 250 ms per tick.
async function residentRun(name, answer, plant) {
  const f = await reviewFixture();
  try {
    const judge = judgmentDouble(answer);
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
      planted = null;
    const tick = host.tick.bind(host);
    host.tick = async () => {
      f.setTime(120 + ++ticks * 250);
      await tick();
      if (plant && planted === null && judge.calls.length === 1) {
        const resident = replayResident(host.store.read()).state.resident;
        const binding = Object.values(resident.intents ?? {})[0]?.binding;
        const pending = binding && runState(f.directory, binding.key);
        if (pending?.pending?.step === "resolution")
          planted = plant(f, join(entry.runs, binding.key));
      }
    };
    let loop;
    try {
      await host.run({ cycles: 60, tickMs: 1 });
      loop = "cycles-exhausted";
    } catch (error) {
      loop = `threw ${error?.name}: ${error?.message}`;
    }
    const resident = replayResident(host.store.read()).state.resident;
    const binding = Object.values(resident.intents ?? {})[0]?.binding;
    const result = binding ? runState(f.directory, binding.key) : undefined;
    emit({
      probe: name,
      loop,
      ticks,
      judgeCalls: judge.calls.length,
      planted,
      terminal: result?.terminal?.kind ?? null,
      terminalStep: result?.terminal?.step ?? null,
      lastReason: result?.receipts?.at(-1)?.value?.reason ?? null,
      resolutionReceipts:
        result?.receipts?.filter((r) => r.command.step === "resolution")
          .length ?? null,
      intentStepCleared: resident.intentStep === null,
    });
  } finally {
    f.close();
  }
}

await residentRun(
  "R3 resident: retryable failure, then a refused return",
  (request, count) => {
    if (count === 1)
      throw new WorkerFailure("interrupted", "synthetic interruption");
    return { kind: "not-a-verdict" };
  },
);

await residentRun(
  "R4 resident: resolution child aliased during backoff",
  (request, count) => {
    if (count === 1)
      throw new WorkerFailure("interrupted", "synthetic interruption");
    return acknowledge(request);
  },
  (f, runDirectory) => {
    const child = preparedChild(runDirectory);
    if (!child) return "no prepared child";
    const elsewhere = join(f.root, "relocated");
    renameSync(child, elsewhere);
    symlinkSync(elsewhere, child);
    return "child symlinked";
  },
);

// B2: one invocation over a body that changes on every observation, then a
// later invocation over a stable body, then a replay.
{
  const root = mkdtempSync(join(tmpdir(), "dotln-ver005-body-"));
  try {
    const publication = new WorkerStore(join(root, "publication"));
    const repositoryId = "github.com/dotln-fixture/target",
      number = 7;
    let clock = 10,
      calls = 0,
      observations = 0,
      stable = false;
    const record = (actorId, type, payload, causationId) => {
      publication.acquire();
      try {
        const { event } = appendEvent(publication.read(), {
          schemaVersion: 1,
          type,
          occurredAt: ++clock,
          actorId,
          workstreamId: "ws_ver005_body",
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
    const options = {
      store: root,
      repositoryId,
      number,
      now: () => ++clock,
      original: { surfaces: ["fixture.txt"], criteria: [], tests: [] },
      observe() {
        observations++;
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
                text: stable
                  ? "Review summary. No changes requested."
                  : `Review summary, refreshed ${observations}. No changes requested.`,
                resolved: false,
              },
            ],
          },
          opening.eventId,
        );
        return {};
      },
      async triage(entry) {
        if (++calls > 25) throw new Error("probe cap reached");
        return {
          kind: "acknowledge",
          criterionId: null,
          reason: "No action requested.",
          evidenceRefs: [`observation:${entry.observation.eventId}`],
        };
      },
    };
    const events = () => decodeLog(publication.read());
    const invocations = [];
    for (const phase of ["changing", "stable", "replay"]) {
      stable = phase !== "changing";
      const callsBefore = calls;
      const result = await settle(() => resolveReviewComments(options));
      const log = events();
      const lastObservation = log
        .filter((e) => e.type === "PullRequestStateObserved")
        .at(-1);
      invocations.push({
        phase,
        returned: result.status ?? result.thrown,
        reason: result.reason ?? null,
        itemId: result.itemId ?? null,
        triageCalls: calls - callsBefore,
        stopNamesLastObservation:
          result.observationId === lastObservation?.eventId,
        lastObservationJudged: log.some(
          (e) =>
            e.type === "ReviewBodyJudged" &&
            e.payload.observationId === lastObservation?.eventId,
        ),
      });
    }
    emit({
      probe: "B2 review-body bound record and later invocations",
      invocations,
      bodyJudgedEvents: events().filter((e) => e.type === "ReviewBodyJudged")
        .length,
      observations,
    });
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}
