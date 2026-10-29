import {
  bindDispatchBound,
  recordCodexDispatch,
} from "../packages/skeleton/dist/src/harness-host.js";
import { operationalFailures, failureWindow } from "./lib/plan-failures.mjs";
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import { tmpdir } from "node:os";
import { createHash } from "node:crypto";
import {
  createFixtureRoot,
  removeTemporaryPath,
} from "./lib/temporary-roots.mjs";
import { write } from "./lib/helpers.mjs";
import {
  dispatchStanding,
  requireRedispatchBound,
  dispatchBoundActivity,
  dispatchBoundMessage,
  dispatchStandingLine,
  dispatchJournals,
  dispatchEvents,
  dispatchBoundResult,
  recordBoundStop,
} from "./lib/dispatch-bound.mjs";
import { readBudgets } from "./lib/process-budget.mjs";
import { boundedCommand } from "./lib/bounded-command.mjs";
import { formatDuration } from "./lib/duration.mjs";
import { captureTiming, recordingSession } from "./lib/off-ramps.mjs";

const source = resolve(import.meta.dirname, "..");
const id = "dispatch-bound-fixture";
const key = createHash("sha256").update(id).digest("hex");
const start = "2030-01-01T00:00:00.000Z";
const journal = {
  role: "executor",
  intent: "resume: next",
  startedAt: start,
  workOrder: "WO-999",
};
function fixture(t) {
  const root = createFixtureRoot(join(tmpdir(), "dotln-dispatch-bound-"));
  t.after(() => removeTemporaryPath(root, { recursive: true, force: true }));
  const budgets = JSON.parse(
    readFileSync(join(source, "scripts/kit/budgets.template.json"), "utf8"),
  );
  budgets.dispatches.executor.wallClockMs = 1000;
  budgets.dispatches.executor.completeRuns = 3;
  write(root, "docs/control/budgets.json", JSON.stringify(budgets));
  write(
    root,
    `docs/control/local/harness/${key}.json`,
    JSON.stringify(journal),
  );
  return { root, budgets };
}

test("each consumer derives time bounds from its own history, with an eight-hour floor and stable dispatch cutoff", (t) => {
  const hour = 60 * 60 * 1000;
  const template = JSON.parse(
    readFileSync(join(source, "scripts/kit/budgets.template.json"), "utf8"),
  );
  assert.equal(template.dispatches.executor.wallClockMs, "local-median");
  assert.equal(template.dispatches.executor.repair.wallClockMs, "local-median");
  const first = fixture(t).root;
  const second = fixture(t).root;
  for (const root of [first, second])
    write(root, "docs/control/budgets.json", JSON.stringify(template));
  const history = (root, samples) =>
    samples.forEach((hours, index) => {
      const workOrderId = `WO-${900 + index}`;
      const from = Date.parse("2029-01-01T00:00:00.000Z") + index * 24 * hour;
      write(
        root,
        `docs/control/orders/${workOrderId}.jsonl`,
        [
          {
            type: "WorkOrderActivated",
            workOrderId,
            workOrderPath: `docs/work-orders/${workOrderId}.md`,
            recordedAt: new Date(from).toISOString(),
          },
          {
            type: "ImplementationReady",
            workOrderId,
            recordedAt: new Date(from + hours * hour).toISOString(),
          },
        ]
          .map(JSON.stringify)
          .join("\n") + "\n",
      );
    });
  assert.equal(
    readBudgets(first).dispatches.executor.wallClockMs,
    8 * hour,
    "a new consumer has an eight-hour fallback",
  );
  history(first, [1, 3, 5]);
  history(second, [0.5]);
  const firstBudget = readBudgets(first).dispatches.executor;
  assert.equal(firstBudget.wallClockMs, 12 * hour);
  assert.equal(firstBudget.wallClockBasis.medianMs, 3 * hour);
  assert.equal(firstBudget.wallClockBasis.sampleCount, 3);
  assert.equal(
    readBudgets(second).dispatches.executor.wallClockMs,
    8 * hour,
    "a different consumer does not inherit the first consumer's median",
  );
  assert.equal(
    readBudgets(first).dispatches.verifier.wallClockMs,
    8 * hour,
    "another phase does not borrow implementation history",
  );
  const cutoff = "2028-12-31T23:59:59.000Z";
  assert.equal(
    readBudgets(first, { cutoff }).dispatches.executor.wallClockMs,
    8 * hour,
    "later completions cannot change a running dispatch's bound",
  );
  const standing = dispatchStanding(first, {
    session: id,
    now: Date.parse(start),
    events: [],
    gates: [],
  });
  assert.equal(standing.wallClockMs, 12 * hour);
  assert.equal(standing.wallClockBasis.cutoff, start);
});

test("as-needed authorization removes both bounds early, preserves counters, and expires at phase completion", (t) => {
  const { root } = fixture(t);
  const events = ["wallClockMs", "completeRuns"].map((metric) => ({
    type: "DispatchBoundAccepted",
    workOrderId: "WO-999",
    phase: "active",
    metric,
    ceiling: null,
  }));
  const gates = Array.from({ length: 7 }, () => ({
    checkId: "npm test",
    executed: true,
    gateSelection: "review",
    recordedAt: start,
  }));
  const standing = (extra = {}) =>
    dispatchStanding(root, {
      session: id,
      now: Date.parse(start) + 1e9,
      events,
      gates,
      ...extra,
    });
  const allowed = standing();
  assert.notEqual(allowed.state, "exceeded");
  assert.equal(allowed.wallClockMs, null);
  assert.equal(allowed.bound, null);
  assert.equal(
    allowed.completeRuns,
    7,
    "unrestricted permission does not reset consumed runs",
  );
  assert.equal(allowed.startedAt, start);
  assert.match(dispatchStandingLine(allowed), /as needed/);
  assert.equal(
    standing({ events: [...events, { type: "ImplementationReady" }] }).state,
    "exceeded",
  );
  assert.equal(
    standing({
      events: events.map((event) => ({ ...event, phase: "verifying" })),
    }).state,
    "exceeded",
  );
});

test("real Codex redispatch preserves a prior thread's consumed budget and renews only on reactivation", (t) => {
  const { root } = fixture(t);
  const file = "docs/control/orders/WO-999.jsonl";
  const actor = {
    harness: "codex-cli",
    harnessVersion: "fixture",
    model: "fixture",
    effort: "max",
    source: "self-reported",
  };
  const activation = {
    type: "WorkOrderActivated",
    workOrderId: "WO-999",
    workOrderPath: "docs/work-orders/WO-999.md",
    recordedAt: start,
  };
  const accepted = (metric) => ({
    type: "DispatchBoundAccepted",
    workOrderId: "WO-999",
    phase: "active",
    metric,
    ceiling: metric === "completeRuns" ? 4 : 3000,
    reason: "operator authorizes one more review",
    capture: "docs/intake/operator.md",
    captureHash: `sha256:${"a".repeat(64)}`,
    actor,
  });
  let events = [activation, accepted("wallClockMs"), accepted("completeRuns")];
  const persist = () =>
    write(root, file, events.map(JSON.stringify).join("\n") + "\n");
  persist();
  const resetKey = createHash("sha256")
    .update("legacy-reset-thread")
    .digest("hex");
  write(
    root,
    `docs/control/local/harness/${resetKey}.json`,
    JSON.stringify({ ...journal, startedAt: "2030-01-01T00:00:02.000Z" }),
  );
  assert.equal(
    requireRedispatchBound(root, {
      workOrder: "WO-999",
      intent: "resume: next",
      now: Date.parse(start) + 2500,
    }).startedAt,
    start,
  );
  assert.throws(
    () =>
      requireRedispatchBound(root, {
        workOrder: "WO-999",
        intent: "resume: next",
        now: Date.parse(start) + 3500,
      }),
    { code: "DOTLN_DISPATCH_BOUND" },
  );
  write(
    root,
    "scripts/resume.mjs",
    'console.log(JSON.stringify({workOrder:"WO-999",phase:"active"}));\n',
  );
  const gates = Array.from({ length: 3 }, () => ({
    checkId: "npm test",
    executed: true,
    gateSelection: "review",
    recordedAt: start,
  }));
  for (const session of ["second-thread", "third-thread"]) {
    const key = createHash("sha256").update(session).digest("hex");
    const file = `docs/control/local/harness/${key}.json`;
    const ownStart = "2030-01-01T00:00:02.000Z";
    write(
      root,
      file,
      JSON.stringify({
        role: "executor",
        startedAt: ownStart,
        startingEventCount: 1,
        reads: [],
      }),
    );
    recordCodexDispatch(root, session, "next", "WO-999");
    const recorded = JSON.parse(readFileSync(join(root, file), "utf8"));
    assert.equal(
      recorded.startedAt,
      ownStart,
      "usage retains its own session start",
    );
    assert.equal(recorded.boundDispatch.startedAt, start);
    const standing = (extra) =>
      dispatchStanding(root, {
        session,
        now: Date.parse(start) + 2000,
        gates,
        ...extra,
      });
    assert.equal(standing().completeRuns, 3);
    assert.equal(standing().elapsedMs, 2000);
    assert.equal(standing().bound, 4);
    assert.equal(standing().state, "within");
    assert.equal(
      standing({ gates: [...gates, gates[0]] }).state,
      "exceeded",
      "only one additional run is admitted",
    );
  }
  const renewed = "2031-01-01T00:00:00.000Z";
  events = [
    ...events,
    {
      type: "ImplementationReady",
      workOrderId: "WO-999",
      recordedAt: "2030-01-01T00:00:03.000Z",
    },
    { ...activation, recordedAt: renewed },
  ];
  persist();
  const session = { role: "executor", startingEventCount: 0, reads: [] };
  bindDispatchBound(
    root,
    session,
    "executor",
    "resume: next",
    "WO-999",
    renewed,
  );
  assert.equal(session.boundDispatch.startedAt, renewed);
  const result = dispatchStanding(root, {
    journal: session,
    events: [events.at(-1)],
    gates,
    now: Date.parse(renewed),
  });
  assert.equal(result.completeRuns, 0);
  assert.equal(result.bound, 3);
});

test("configured lifecycle roots share the installed journal lane and preserve their request boundary", (t) => {
  const { root, budgets } = fixture(t);
  write(
    root,
    "dotln.config.json",
    JSON.stringify({
      version: 1,
      roots: { control: "records/state", orders: "records/state/segments" },
    }),
  );
  for (const name of ["config.mjs", "validation.mjs"])
    write(
      root,
      `scripts/lib/${name}`,
      readFileSync(join(source, "scripts/lib", name)),
    );
  write(root, "records/state/budgets.json", JSON.stringify(budgets));
  write(
    root,
    "records/state/segments/WO-999.jsonl",
    JSON.stringify({
      type: "WorkOrderActivated",
      workOrderId: "WO-999",
      workOrderPath: "docs/work-orders/WO-999.md",
      recordedAt: start,
    }) + "\n",
  );
  write(
    root,
    "scripts/resume.mjs",
    'console.log(JSON.stringify({workOrder:"WO-999",phase:"active"}));\n',
  );
  const session = "configured-root-thread";
  recordCodexDispatch(root, session, "next", "WO-999");
  const standing = dispatchStanding(root, {
    session,
    now: Date.parse(start) + 2000,
    gates: [],
  });
  assert.equal(standing.startedAt, start);
  assert.equal(
    standing.state,
    "exceeded",
    "configured roots do not turn a known exhausted budget into no-journal/unset",
  );
  assert.equal(
    recordingSession(root, { CODEX_THREAD_ID: session }).role,
    "executor",
  );
  const currentKey = createHash("sha256").update(session).digest("hex");
  const recorded = JSON.parse(
    readFileSync(
      join(root, `docs/control/local/harness/${currentKey}.json`),
      "utf8",
    ),
  );
  assert.equal(
    recorded.boundDispatch.phaseBoundary,
    "WO-999:WorkOrderActivated:0",
  );
});

test("a damaged journal names its file while refusing the read", (t) => {
  const { root } = fixture(t);
  const name = `${"b".repeat(64)}.json`;
  write(root, `docs/control/local/harness/${name}`, "not JSON");
  assert.throws(
    () => dispatchJournals(root),
    (error) =>
      error.message.includes(name) &&
      error.message.includes("Invalid dispatch journal"),
  );
});

test("capture provenance retains session birth after the dispatch anchor renews", (t) => {
  const { root } = fixture(t);
  const capture = "docs/intake/operator.md";
  write(root, capture, "Operator-authored capture fixture.\n");
  const born = statSync(join(root, capture)).birthtimeMs;
  const startedAt = new Date(born - 60_000).toISOString();
  write(
    root,
    `docs/control/local/harness/${key}.json`,
    JSON.stringify({
      ...journal,
      startedAt,
      boundDispatch: {
        ...journal,
        role: "verifier",
        startedAt: new Date(born + 60_000).toISOString(),
      },
    }),
  );
  const observed = recordingSession(root, { CODEX_THREAD_ID: id });
  assert.equal(observed.role, "verifier");
  assert.equal(observed.startedAt, startedAt);
  assert.equal(
    captureTiming(root, capture, observed),
    "created-during-session",
  );
});

test("dispatch standing covers both bounds, unset and absent journals, repair limits and phase-local acceptance", (t) => {
  const { root, budgets } = fixture(t);
  const standing = (options = {}) =>
    dispatchStanding(root, {
      session: id,
      now: Date.parse(start) + 500,
      gates: [],
      events: [],
      ...options,
    });
  assert.equal(standing().state, "within");
  assert.equal(
    standing({ now: Date.parse(start) + 1000 }).exceeded[0].metric,
    "wallClockMs",
  );
  const gate = {
    checkId: "npm test",
    executed: true,
    gateSelection: "review",
    recordedAt: start,
  };
  assert.equal(
    standing({ gates: [gate, gate, gate] }).exceeded[0].metric,
    "completeRuns",
  );
  const counted = standing({
    gates: [
      gate,
      { ...gate, gateSelection: "single" },
      { ...gate, boundStop: {} },
      { ...gate, recordedAt: "2029-12-31T23:59:59.000Z" },
    ],
  });
  assert.equal(counted.completeRuns, 1);
  const events = [
    {
      type: "DispatchBoundAccepted",
      workOrderId: "WO-999",
      phase: "active",
      metric: "wallClockMs",
      ceiling: 3000,
    },
  ];
  assert.equal(
    standing({ now: Date.parse(start) + 2000, events }).state,
    "within",
  );
  assert.equal(
    standing({
      now: Date.parse(start) + 2000,
      events: events.map((event) => ({ ...event, phase: "verifying" })),
    }).state,
    "exceeded",
  );
  assert.equal(
    standing({
      journal: { ...journal, intent: "resume: fix" },
      now: Date.parse(start) + 2000,
    }).state,
    "within",
  );
  budgets.dispatches.executor.wallClockMs = null;
  budgets.dispatches.executor.completeRuns = null;
  write(root, "docs/control/budgets.json", JSON.stringify(budgets));
  assert.equal(standing({ now: Date.parse(start) + 1e9 }).state, "unset");
  assert.equal(
    dispatchStanding(root, { session: "absent" }).cause,
    "no-journal",
  );
});

test("same-phase redispatch cannot reset an exhausted dispatch and operator acceptance extends it", (t) => {
  const { root } = fixture(t);
  const activation = {
    type: "WorkOrderActivated",
    workOrderId: "WO-999",
    recordedAt: start,
  };
  const file = "docs/control/orders/WO-999.jsonl";
  write(root, file, JSON.stringify(activation) + "\n");
  assert.throws(
    () =>
      requireRedispatchBound(root, {
        workOrder: "WO-999",
        intent: "resume: next",
        now: Date.parse(start) + 2000,
      }),
    { code: "DOTLN_DISPATCH_BOUND" },
  );
  write(
    root,
    file,
    [
      activation,
      {
        type: "DispatchBoundAccepted",
        workOrderId: "WO-999",
        phase: "active",
        metric: "wallClockMs",
        ceiling: 3000,
        reason: "fixture",
        capture: "docs/intake/fixture.md",
        captureHash: `sha256:${"a".repeat(64)}`,
        actor: {
          harness: "human",
          harnessVersion: "fixture",
          model: "human",
          effort: "unknown",
          source: "operator-attested",
        },
      },
    ]
      .map(JSON.stringify)
      .join("\n") + "\n",
  );
  assert.equal(
    requireRedispatchBound(root, {
      workOrder: "WO-999",
      intent: "resume: next",
      now: Date.parse(start) + 2000,
    }).state,
    "within",
  );
});

test("probe refusal precedes launching the command; an in-bound probe retains its exit", async (t) => {
  const { root, budgets } = fixture(t);
  const envName = "CODEX_THREAD_ID",
    previous = process.env[envName];
  process.env[envName] = id;
  write(
    root,
    `docs/control/local/harness/${key}.json`,
    JSON.stringify({ ...journal, startedAt: "2000-01-01T00:00:00.000Z" }),
  );
  t.after(() =>
    previous === undefined
      ? delete process.env[envName]
      : (process.env[envName] = previous),
  );
  await assert.rejects(
    boundedCommand(["--", "nonexistent-dispatch-bound-probe"], root),
    /DOTLN_DISPATCH_BOUND.*analysis:.*accept-overrun/u,
  );
  budgets.dispatches.executor.wallClockMs = 60000;
  budgets.dispatches.executor.completeRuns = 3;
  write(
    root,
    `docs/control/local/harness/${key}.json`,
    JSON.stringify({ ...journal, startedAt: new Date().toISOString() }),
  );
  write(root, "docs/control/budgets.json", JSON.stringify(budgets));
  const result = await boundedCommand(
    ["--", process.execPath, "-e", "process.exit(7)"],
    root,
    { report: () => {}, output: () => {} },
  );
  assert.equal(result.exitCode, 7);
});

test("bound activity records the next same-order lifecycle event and its delay", () => {
  const at = "2030-01-01T00:01:00.000Z";
  const events = [
    {
      type: "RepairRequested",
      recordedAt: "2030-01-01T00:03:00.000Z",
      workOrderId: "WO-999",
    },
  ];
  const result = dispatchBoundActivity(events, [
    {
      metric: "wallClockMs",
      value: 1,
      bound: 0,
      at,
      workOrder: "WO-999",
      role: "executor",
    },
  ]);
  assert.equal(result.boundStops.count, 1);
  assert.equal(result.afterStop[0].nextEvent, "RepairRequested");
  assert.equal(result.afterStop[0].delayMs, 120000);
});

test("operator-facing duration messages use hours and minutes", () => {
  assert.equal(formatDuration(5_000_000), "1 h 23 min");
  assert.equal(formatDuration(null), "unknown");
  assert.equal(formatDuration(-3_600_000), "-1 h 0 min");
  const message = dispatchBoundMessage({
    elapsedMs: 5_000_000,
    wallClockMs: 3_600_000,
    completeRuns: 0,
    bound: 3,
    state: "exceeded",
    exceeded: [{ metric: "wallClockMs", value: 5_000_000, bound: 3_600_000 }],
    routes: "analysis:; accept-overrun",
  });
  assert.match(message, /1 h 23 min/u);
  assert.doesNotMatch(message, /5000000|3600000| ms/u);
});

test("planning reports the next same-order event despite other-order chronology", (t) => {
  const { root } = fixture(t);
  const stopAt = "2030-01-01T00:01:00.000Z";
  write(
    root,
    `docs/control/local/harness/${key}.jsonl`,
    JSON.stringify({
      at: stopAt,
      workOrder: "WO-999",
      role: "executor",
      phase: "active",
      source: "probe",
      boundStop: { metric: "wallClockMs", value: 1000, bound: 1000 },
    }) + "\n",
  );
  const events = [
    {
      type: "RepairRequested",
      workOrderId: "WO-998",
      recordedAt: "2030-01-01T00:02:00.000Z",
    },
    {
      type: "RepairCompleted",
      workOrderId: "WO-999",
      recordedAt: "2030-01-01T00:05:00.000Z",
    },
    {
      type: "RepairRequested",
      workOrderId: "WO-999",
      recordedAt: "2030-01-01T00:03:00.000Z",
    },
  ];
  events.push({
    type: "DispatchBoundAccepted",
    workOrderId: "WO-999",
    phase: "active",
    metric: "wallClockMs",
    ceiling: 3000,
    recordedAt: "2030-01-01T00:04:00.000Z",
  });
  const result = operationalFailures(
    root,
    { eventSegments: new Map([["fixture", events]]), orders: new Map() },
    failureWindow(root, { all: true }).includes,
  );
  assert.equal(result.boundStops.count, 1);
  assert.equal(result.boundStops.stops[0].phase, "implementation");
  assert.equal(result.boundStops.afterStop[0].nextEvent, "RepairRequested");
  assert.equal(result.boundStops.afterStop[0].delayMs, 120000);
});

test("planning retains readable stop snapshots when historical meters are damaged", (t) => {
  const { root } = fixture(t);
  const stop = {
    metric: "completeRuns",
    value: 3,
    bound: 3,
    role: "executor",
    phase: "repairing",
    at: start,
  };
  const bodies = [
    "{",
    JSON.stringify({ orders: {} }),
    JSON.stringify({
      orders: [{ workOrder: "WO-902", boundStops: { stops: {} } }],
    }),
    JSON.stringify({
      orders: [{ workOrder: "WO-903", boundStops: { stops: [null] } }],
    }),
    JSON.stringify({
      orders: [{ workOrder: "WO-904", boundStops: { stops: [stop] } }],
    }),
  ];
  const orders = new Map();
  bodies.forEach((body, index) => {
    const order = `WO-${900 + index}`;
    write(root, `docs/evidence/${order}/meta.json`, body);
    orders.set(order, { state: { phase: "closed" } });
  });
  const result = operationalFailures(
    root,
    { orders, eventSegments: new Map() },
    () => true,
  );
  assert.equal(result.boundStops.unreadableSnapshots, 4);
  assert.equal(result.boundStops.count, 1);
  assert.equal(result.boundStops.stops[0].workOrder, "WO-904");
  assert.equal(result.boundStops.stops[0].phase, "repair");
});

test("dispatch anchors renew on new phase attempts and preserve session observations", (t) => {
  const { root } = fixture(t);
  const session = {
    ...journal,
    startingEventCount: 1,
    reads: [],
    authoredPaths: ["kept.txt"],
  };
  const file = "docs/control/orders/WO-999.jsonl";
  const events = [
    { type: "WorkOrderActivated", workOrderId: "WO-999", recordedAt: start },
  ];
  const persist = () =>
    write(root, file, events.map(JSON.stringify).join("\n") + "\n");
  persist();
  bindDispatchBound(root, session, "executor", "resume: next", "WO-999", start);
  bindDispatchBound(
    root,
    session,
    "executor",
    "resume: next",
    "WO-999",
    "2030-01-01T00:01:00.000Z",
  );
  assert.equal(session.boundDispatch.startedAt, start);
  events.push({
    type: "RepairRequested",
    workOrderId: "WO-999",
    recordedAt: "2030-01-01T00:02:00.000Z",
  });
  persist();
  bindDispatchBound(
    root,
    session,
    "executor",
    "resume: fix",
    "WO-999",
    "2030-01-01T00:02:00.000Z",
  );
  let result = dispatchStanding(root, {
    journal: session,
    events: [],
    gates: [
      {
        checkId: "npm test",
        executed: true,
        gateSelection: "review",
        recordedAt: start,
      },
    ],
    now: Date.parse("2030-01-01T00:02:01.000Z"),
  });
  assert.equal(result.phase, "repairing");
  assert.equal(result.completeRuns, 0);
  assert.equal(result.elapsedMs, 1000);
  events.push(
    { type: "RepairCompleted", workOrderId: "WO-999" },
    { type: "RepairRequested", workOrderId: "WO-999" },
  );
  persist();
  bindDispatchBound(
    root,
    session,
    "executor",
    "resume: fix",
    "WO-999",
    "2030-01-01T00:03:00.000Z",
  );
  assert.equal(session.boundDispatch.startedAt, "2030-01-01T00:03:00.000Z");
  events.push({ type: "VerificationRequested", workOrderId: "WO-999" });
  persist();
  bindDispatchBound(
    root,
    session,
    "verifier",
    "resume: verify",
    "WO-999",
    "2030-01-01T00:04:00.000Z",
  );
  result = dispatchStanding(root, {
    journal: session,
    events: [],
    gates: [],
    now: Date.parse("2030-01-01T00:04:01.000Z"),
  });
  assert.equal(result.role, "verifier");
  assert.equal(result.phase, "verifying");
  assert.equal(result.elapsedMs, 1000);
  assert.equal(session.startedAt, start);
  assert.deepEqual(session.authoredPaths, ["kept.txt"]);
});

test("phase acceptances expire with completion while needs-fix covers the upcoming repair", (t) => {
  const { root, budgets } = fixture(t);
  budgets.dispatches.executor.repair = { wallClockMs: 1000, completeRuns: 3 };
  write(root, "docs/control/budgets.json", JSON.stringify(budgets));
  const repair = { ...journal, intent: "resume: fix" };
  const acceptance = {
    type: "DispatchBoundAccepted",
    phase: "repairing",
    metric: "wallClockMs",
    ceiling: 5000,
  };
  const current = (events) =>
    dispatchStanding(root, {
      journal: repair,
      events,
      gates: [],
      now: Date.parse(start) + 2000,
    });
  assert.equal(current([acceptance]).state, "within");
  assert.equal(
    current([
      acceptance,
      { type: "RepairCompleted" },
      { type: "RepairRequested" },
    ]).state,
    "exceeded",
  );
  assert.equal(
    current([
      acceptance,
      { type: "RepairCompleted" },
      { ...acceptance, phase: "needs-fix" },
      { type: "RepairRequested" },
    ]).state,
    "within",
  );
});

test("standing names its own damaged journal for malformed JSON and invalid anchors", (t) => {
  const { root } = fixture(t);
  const file = `docs/control/local/harness/${key}.json`;
  for (const contents of [
    "{ truncated",
    JSON.stringify({ ...journal, boundDispatch: {} }),
  ]) {
    write(root, file, contents);
    assert.throws(
      () => dispatchStanding(root, { session: id }),
      (error) =>
        error.message.includes(file) &&
        error.message.includes("Invalid dispatch journal"),
    );
  }
});

test("Codex binds a fresh role beside damaged history and recovers the original anchor after repair", (t) => {
  const { root } = fixture(t);
  const start = "2020-01-01T00:00:00.000Z";
  const prior = { ...journal, startedAt: start };
  write(root, `docs/control/local/harness/${key}.json`, JSON.stringify(prior));
  write(
    root,
    "docs/control/orders/WO-999.jsonl",
    JSON.stringify({
      type: "WorkOrderActivated",
      workOrderId: "WO-999",
      workOrderPath: "docs/work-orders/WO-999.md",
      recordedAt: start,
    }) + "\n",
  );
  write(
    root,
    "scripts/resume.mjs",
    'console.log(JSON.stringify({workOrder:"WO-999",phase:"active"}));\n',
  );
  const broken = `docs/control/local/harness/${"b".repeat(64)}.json`;
  const session = "fresh-damaged-codex";
  write(root, broken, "{ truncated");
  recordCodexDispatch(root, session, "next", "WO-999");
  const file = `docs/control/local/harness/${createHash("sha256").update(session).digest("hex")}.json`;
  const saved = JSON.parse(readFileSync(join(root, file), "utf8"));
  assert.equal(saved.role, "executor");
  assert.equal(saved.intent, "resume: next");
  assert.equal(saved.workOrder, "WO-999");
  assert.throws(
    () => dispatchStanding(root, { session }),
    (error) => error.message.includes(broken),
  );
  // Restoring readable history makes the earlier consumed anchor observable;
  // the failed binding must neither poison later scans nor reset the clock.
  write(root, broken, JSON.stringify(prior));
  recordCodexDispatch(root, session, "next", "WO-999");
  const standing = dispatchStanding(root, {
    session,
    now: Date.parse(start) + 2000,
    gates: [],
  });
  assert.equal(standing.startedAt, start);
  assert.equal(standing.state, "exceeded");
});

test("one stop retains both exceeded measurements through the log, meter projection and planning", (t) => {
  const { root, budgets } = fixture(t);
  budgets.dispatches.executor.completeRuns = 0;
  write(root, "docs/control/budgets.json", JSON.stringify(budgets));
  const at = "2030-01-01T00:01:00.000Z";
  const standing = dispatchStanding(root, {
    session: id,
    now: Date.parse(at),
    gates: [],
  });
  const expected = [
    { metric: "wallClockMs", value: 60000, bound: 1000 },
    { metric: "completeRuns", value: 0, bound: 0 },
  ];
  assert.deepEqual(dispatchBoundResult(standing).boundStop.exceeded, expected);
  recordBoundStop(root, standing, "probe", at);
  const rows = readFileSync(
    join(root, `docs/control/local/harness/${key}.jsonl`),
    "utf8",
  )
    .trim()
    .split("\n")
    .map(JSON.parse);
  assert.equal(rows.length, 1);
  assert.deepEqual(rows[0].boundStop.exceeded, expected);
  const activity = dispatchBoundActivity(
    [],
    [{ ...rows[0].boundStop, at, workOrder: "WO-999" }],
  );
  assert.equal(activity.boundStops.count, 1);
  assert.deepEqual(activity.boundStops.stops[0].exceeded, expected);
  assert.deepEqual(activity.afterStop[0].exceeded, expected);
  const observe = (control) =>
    operationalFailures(
      root,
      control,
      failureWindow(root, { all: true }).includes,
    );
  const control = { eventSegments: new Map(), orders: new Map() };
  const result = observe(control);
  assert.equal(result.boundStops.count, 1);
  assert.deepEqual(result.boundStops.stops[0].exceeded, expected);
  // A closed order is read from its filed snapshot after the local lane goes.
  removeTemporaryPath(join(root, `docs/control/local/harness/${key}.jsonl`));
  write(
    root,
    "docs/evidence/WO-999/meta.json",
    JSON.stringify({
      orders: [{ workOrder: "WO-999", boundStops: activity.boundStops }],
    }),
  );
  control.orders.set("WO-999", { state: { phase: "closed" } });
  assert.deepEqual(observe(control).boundStops.stops[0].exceeded, expected);
});

test("redispatch recovers a marked earliest anchor from repaired history without an internal rebind", (t) => {
  const { root } = fixture(t);
  const other = {
    ...journal,
    role: "reviewer",
    intent: "resume: final review",
  };
  write(root, `docs/control/local/harness/${key}.json`, JSON.stringify(other));
  write(
    root,
    "scripts/resume.mjs",
    'console.log(JSON.stringify({workOrder:"WO-999",phase:"active"}));\n',
  );
  write(
    root,
    "docs/control/orders/WO-999.jsonl",
    JSON.stringify({
      type: "WorkOrderActivated",
      workOrderId: "WO-999",
      workOrderPath: "docs/work-orders/WO-999.md",
      recordedAt: "2020-01-01T00:00:00.000Z",
    }) + "\n",
  );
  const damaged = `docs/control/local/harness/${"b".repeat(64)}.json`;
  write(root, damaged, "{ truncated");
  const session = "marked-earliest-anchor";
  recordCodexDispatch(root, session, "next", "WO-999");
  const file = join(
    root,
    `docs/control/local/harness/${createHash("sha256").update(session).digest("hex")}.json`,
  );
  const before = readFileSync(file, "utf8");
  const startedAt = JSON.parse(before).boundDispatch.startedAt;
  const options = {
    workOrder: "WO-999",
    intent: "resume: next",
    now: Date.parse(startedAt) + 500,
  };
  assert.throws(
    () => requireRedispatchBound(root, options),
    (error) => error.message.includes(damaged),
  );
  write(root, damaged, JSON.stringify(other));
  const recovered = requireRedispatchBound(root, options);
  assert.equal(recovered.startedAt, startedAt);
  assert.equal(recovered.elapsedMs, 500);
  assert.equal(recovered.state, "within");
  assert.throws(
    () =>
      requireRedispatchBound(root, {
        ...options,
        now: Date.parse(startedAt) + 1000,
      }),
    { code: "DOTLN_DISPATCH_BOUND" },
  );
  const consumed = dispatchStanding(root, {
    session,
    now: options.now,
    gates: Array.from({ length: 3 }, () => ({
      checkId: "npm test",
      executed: true,
      gateSelection: "review",
      recordedAt: startedAt,
    })),
  });
  assert.equal(consumed.completeRuns, 3);
  assert.equal(consumed.state, "exceeded");
  assert.equal(
    readFileSync(file, "utf8"),
    before,
    "read-only recovery does not rewrite the journal",
  );
  const earlier = new Date(Date.parse(startedAt) - 1000).toISOString();
  write(root, damaged, JSON.stringify({ ...journal, startedAt: earlier }));
  const restored = dispatchStanding(root, {
    session,
    now: options.now,
    gates: [],
  });
  assert.equal(restored.startedAt, earlier);
  assert.equal(restored.elapsedMs, 1500);
  assert.equal(restored.state, "exceeded");
  assert.equal(readFileSync(file, "utf8"), before);
});

test("marked standing recovers its original attempt after completion and reactivation", (t) => {
  const { root } = fixture(t);
  const marked = {
    ...journal,
    startedAt: "2030-01-01T00:00:00.500Z",
    phaseBoundary: "WO-999:WorkOrderActivated:0",
    unavailable: "previously damaged history",
  };
  const damaged = `docs/control/local/harness/${"b".repeat(64)}.json`;
  const future = `docs/control/local/harness/${"c".repeat(64)}.json`;
  const events = [
    {
      type: "WorkOrderActivated",
      workOrderId: "WO-999",
      recordedAt: "2029-01-01T00:00:00.000Z",
    },
    {
      type: "ImplementationReady",
      workOrderId: "WO-999",
      recordedAt: "2030-01-01T00:00:01.000Z",
    },
    {
      type: "WorkOrderActivated",
      workOrderId: "WO-999",
      recordedAt: "2030-01-01T00:00:02.000Z",
    },
  ];
  write(
    root,
    "docs/control/orders/WO-999.jsonl",
    events.map(JSON.stringify).join("\n") + "\n",
  );
  write(root, damaged, "{ truncated");
  const observe = () =>
    dispatchStanding(root, {
      journal: marked,
      now: Date.parse(start) + 6000,
      gates: [
        {
          checkId: "npm test",
          executed: true,
          gateSelection: "review",
          recordedAt: start,
        },
      ],
    });
  assert.throws(observe, (error) => error.message.includes(damaged));
  write(root, damaged, JSON.stringify(journal));
  write(
    root,
    future,
    JSON.stringify({ ...journal, startedAt: "2030-01-01T00:00:05.000Z" }),
  );
  const recovered = observe();
  assert.equal(recovered.startedAt, start);
  assert.equal(recovered.elapsedMs, 6000);
  assert.equal(recovered.completeRuns, 1);
  assert.equal(recovered.state, "exceeded");
  assert.equal(
    marked.unavailable,
    "previously damaged history",
    "a read does not rewrite the stored marker",
  );
  // Without an earlier readable anchor, retain this dispatch's own start.
  removeTemporaryPath(join(root, damaged));
  removeTemporaryPath(join(root, `docs/control/local/harness/${key}.json`));
  assert.equal(observe().startedAt, marked.startedAt);
  assert.equal(observe().elapsedMs, 5500);
});

test("complete-run counts distinguish host refusals from admitted failures and interruptions", (t) => {
  const { root } = fixture(t);
  const gate = {
    checkId: "npm test",
    executed: true,
    gateSelection: "review",
    recordedAt: start,
    exitCode: 1,
  };
  const host = { name: "host", executed: true, exitCode: 0 };
  for (const [label, extra, count] of [
    ["legacy without host evidence", {}, 1],
    ["admitted failure", { taskTimeline: [host] }, 1],
    ["admitted interruption", { stopped: true, taskTimeline: [host] }, 1],
    ["refused host", { taskTimeline: [{ ...host, exitCode: 1 }] }, 0],
    ["unexecuted host", { taskTimeline: [{ ...host, executed: false }] }, 0],
    [
      "stopped before host",
      { stopped: true, taskTimeline: [], unrunSuites: ["host"] },
      0,
    ],
    ["legacy refusal in cases", { cases: [{ ...host, exitCode: 1 }] }, 0],
    [
      "focused admitted selection",
      { gateSelection: "single", taskTimeline: [host] },
      0,
    ],
  ]) {
    const standing = dispatchStanding(root, {
      session: id,
      now: Date.parse(start),
      events: [],
      gates: [{ ...gate, ...extra }],
    });
    assert.equal(standing.completeRuns, count, label);
  }
});

test("a completion at the marked dispatch timestamp cannot reset its recovered anchor", (t) => {
  const { root } = fixture(t);
  for (const prefix of [
    [],
    [
      {
        type: "WorkOrderActivated",
        workOrderId: "WO-999",
        recordedAt: "2028-01-01T00:00:00.000Z",
      },
      {
        type: "ImplementationReady",
        workOrderId: "WO-999",
        recordedAt: "2028-02-01T00:00:00.000Z",
      },
    ],
  ]) {
    const marked = {
      ...journal,
      startedAt: "2030-01-01T00:00:01.000Z",
      phaseBoundary: `WO-999:WorkOrderActivated:${prefix.length}`,
      unavailable: "history was damaged",
    };
    const events = [
      ...prefix,
      {
        type: "WorkOrderActivated",
        workOrderId: "WO-999",
        recordedAt: "2029-01-01T00:00:00.000Z",
      },
      {
        type: "ImplementationReady",
        workOrderId: "WO-999",
        recordedAt: marked.startedAt,
      },
    ];
    write(
      root,
      "docs/control/orders/WO-999.jsonl",
      events.map(JSON.stringify).join("\n") + "\n",
    );
    const standing = dispatchStanding(root, {
      journal: marked,
      events: dispatchEvents(root, "WO-999"),
      gates: [],
      now: Date.parse(start) + 1500,
    });
    assert.equal(standing.startedAt, start);
    assert.equal(standing.elapsedMs, 1500);
    assert.equal(standing.state, "exceeded");
  }
});
