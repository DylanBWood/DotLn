import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  Cadence,
  Program,
  appendEvent,
  authorize,
  decodeLog,
  defaultEnvironmentProjection,
  encodeLog,
  evaluateCadence,
  replay,
  stepProgram,
} from "../src/index.js";
import type {
  ActIntent,
  AuthorityEnvelope,
  Event,
  EventDraft,
  JsonValue,
  KernelEnv,
  PredicateRegistry,
  Reactor,
} from "../src/index.js";

const stateValue = (state: JsonValue, key: string): JsonValue | undefined =>
  state !== null && !Array.isArray(state) && typeof state === "object"
    ? (state as Readonly<Record<string, JsonValue>>)[key]
    : undefined;
const predicates: PredicateRegistry = {
  "state.flag": { 1: ({ state }) => stateValue(state, "flag") === true },
};
const env = (now = 100, rngState = 7): KernelEnv => ({
  now,
  rngState,
  predicates,
});
const draft = <P extends JsonValue>(
  type: string,
  at: number,
  payload: P,
): EventDraft<string, P> => ({
  schemaVersion: 1,
  type,
  occurredAt: at,
  actorId: "a",
  workstreamId: "ws",
  payload,
});

// Deliberate poison-and-restore: AC2 clause 3 says replay consults nothing outside
// the log, so the ambient sources are stubbed to THROW for the duration of the
// kernel call and restored in finally. Any kernel read of Date.now/Math.random fails loudly.
const poisoned = <R>(run: () => R): R => {
  const realNow = Date.now;
  const realRandom = Math.random;
  globalThis.Date.now = () => {
    throw new Error("kernel consulted ambient Date.now");
  };
  globalThis.Math.random = () => {
    throw new Error("kernel consulted ambient Math.random");
  };
  try {
    return run();
  } finally {
    globalThis.Date.now = realNow;
    globalThis.Math.random = realRandom;
  }
};

test("WO-047 default projection preserves the reserved-key fallback", () => {
  for (const state of [
    null,
    [],
    12,
    "state",
    true,
    {},
    { seed: 17 },
    { rngState: "17" },
  ])
    assert.deepEqual(defaultEnvironmentProjection(state), { rngState: 0 });
  for (const policy of [null, false, 0, "", [], { maintenance: "read-only" }])
    assert.deepEqual(defaultEnvironmentProjection({ rngState: 17, policy }), {
      rngState: 17,
      policy,
    });
  // The omitted callback keeps the old raw-JavaScript numeric behavior too.
  for (const rngState of [NaN, Infinity, -Infinity, -0]) {
    assert.ok(
      Object.is(defaultEnvironmentProjection({ rngState }).rngState, rngState),
    );
    let calls = 0;
    replay(
      { rngState },
      [{ ...draft("Tick", 10, {}), eventId: "evt_1" }],
      (state, _event, environment) => {
        calls++;
        assert.ok(Object.is(environment.rngState, rngState));
        return {
          state,
          intents: [],
          schedules: [],
          trace: {
            reactorId: "legacy-number",
            reactorVersion: "1",
            branchPath: [],
            envInputs: [],
            cadenceEvaluations: [],
          },
        };
      },
      {},
    );
    assert.equal(calls, 1);
  }
});

test("WO-047 nested RNG and event-dependent policy project each current pre-step state", () => {
  type State = { random: { seed: number }; settings: JsonValue };
  const initial: State = { random: { seed: 42 }, settings: { enabled: true } };
  const events: Event[] = [10, 20, 30].map((at, index) => ({
    ...draft("Tick", at, { step: index }),
    eventId: `evt_${index + 1}`,
  }));
  const calls: Array<readonly [number, string]> = [];
  const projector = (state: State, event: Event) => {
    calls.push([state.random.seed, event.eventId]);
    return {
      rngState: state.random.seed,
      policy: { settings: state.settings, tick: event.payload },
    };
  };
  const reactor: Reactor<State> = (state, event, environment) => {
    assert.equal(environment.now, event.occurredAt);
    assert.equal(environment.predicates, predicates);
    const cadence = evaluateCadence(
      Cadence.Backoff(100, 2, 100000, 1, 0.5),
      state,
      environment,
    );
    return {
      state: { ...state, random: { seed: cadence.rngState } },
      intents: [
        {
          kind: "NoOp",
          reason: JSON.stringify(environment.policy ?? null),
          evidence: [event.eventId],
          reevaluation: Cadence.After(1),
          usefulWhen: { registryId: "state.flag", version: 1 },
        },
      ],
      schedules: [],
      trace: {
        reactorId: "nested",
        reactorVersion: "1",
        branchPath: [event.type],
        envInputs: [`rng:${environment.rngState}`],
        cadenceEvaluations: [cadence.trace],
      },
    };
  };
  const explicit = poisoned(() =>
    replay(initial, events, reactor, predicates, projector),
  );
  assert.deepEqual(calls, [
    [42, "evt_1"],
    [1083814273, "evt_2"],
    [378494188, "evt_3"],
  ]);
  assert.deepEqual(
    poisoned(() => replay(initial, events, reactor, predicates, projector)),
    explicit,
  );
  const fallback = replay(initial, events, reactor, predicates);
  assert.deepEqual(
    fallback.decisions.map((decision) => decision.trace.envInputs),
    [["rng:0"], ["rng:0"], ["rng:0"]],
  );
  assert.notDeepEqual(explicit.decisions, fallback.decisions);
  assert.equal(explicit.decisions[0]?.intents[0]?.kind, "NoOp");
  assert.match(
    JSON.stringify(explicit.decisions[0]?.intents),
    /enabled.*true.*step.*0/u,
  );
  assert.equal(calls.length, 6);
  assert.deepEqual(replay(initial, [], reactor, predicates, projector), {
    state: initial,
    decisions: [],
  });
  assert.equal(calls.length, 6, "empty logs do not project an environment");
});

test("WO-047 supplied projections refuse non-finite RNG before the reactor", () => {
  const event: Event = { ...draft("Tick", 10, {}), eventId: "evt_1" };
  let invoked = false;
  const reactor: Reactor = () => {
    invoked = true;
    throw new Error("reactor called");
  };
  for (const rngState of [NaN, Infinity, -Infinity]) {
    assert.throws(
      () => replay({}, [event], reactor, {}, () => ({ rngState })),
      /projector must return a finite rngState/u,
    );
    assert.throws(
      () =>
        replay(
          { rngState },
          [event],
          reactor,
          {},
          defaultEnvironmentProjection,
        ),
      /projector must return a finite rngState/u,
    );
  }
  assert.equal(invoked, false);
});

test("WO-047 replay owns time and predicates and preserves legacy environment bytes", () => {
  const event: Event = { ...draft("Tick", 10, {}), eventId: "evt_1" };
  const state = { rngState: 7, policy: { enabled: true } };
  const seen: KernelEnv[] = [];
  const reactor: Reactor<typeof state> = (current, _event, environment) => {
    seen.push(environment);
    return {
      state: current,
      intents: [],
      schedules: [],
      trace: {
        reactorId: "env",
        reactorVersion: "1",
        branchPath: [],
        envInputs: [JSON.stringify(environment)],
        cadenceEvaluations: [],
      },
    };
  };
  const fallback = replay(state, [event], reactor, predicates);
  const explicit = replay(state, [event], reactor, predicates, () => ({
    rngState: 7,
    policy: state.policy,
    now: 999,
    predicates: {},
    extra: "ignored",
  }));
  assert.deepEqual(explicit, fallback);
  assert.equal(JSON.stringify(explicit), JSON.stringify(fallback));
  assert.deepEqual(Object.keys(seen[1]!), [
    "now",
    "rngState",
    "predicates",
    "policy",
  ]);
  assert.equal(seen[1]?.now, 10);
  assert.equal(seen[1]?.predicates, predicates);
  assert.equal(
    JSON.stringify(seen[1]),
    '{"now":10,"rngState":7,"predicates":{"state.flag":{}},"policy":{"enabled":true}}',
  );
});

test("WO-047 validates and delivers the same projected RNG sample", () => {
  let reads = 0;
  const event: Event = { ...draft("Tick", 10, {}), eventId: "evt_1" };
  const result = replay(
    {},
    [event],
    (state, _event, environment) => {
      assert.equal(environment.rngState, 7);
      return {
        state,
        intents: [],
        schedules: [],
        trace: {
          reactorId: "projection-sample",
          reactorVersion: "1",
          branchPath: [],
          envInputs: [],
          cadenceEvaluations: [],
        },
      };
    },
    {},
    () => ({
      get rngState() {
        return ++reads === 1 ? 7 : NaN;
      },
    }),
  );
  assert.equal(reads, 1);
  assert.equal(result.decisions.length, 1);
});

test("WO-047 reserved application-state reads occur only in the exported default projector", () => {
  const source = readFileSync(
    new URL("../../src/core.ts", import.meta.url),
    "utf8",
  );
  const start = source.indexOf("export function defaultEnvironmentProjection(");
  const end = source.indexOf("export function replay<", start);
  assert.ok(start >= 0 && end > start);
  const projection = source.slice(start, end);
  assert.deepEqual(
    [...projection.matchAll(/stateField\(state, "([^"]+)"\)/gu)].map(
      (match) => match[1],
    ),
    ["rngState", "policy"],
  );
  const outside = source.slice(0, start) + source.slice(end);
  assert.doesNotMatch(
    outside,
    /stateField\([^)]*,\s*["'](?:rngState|policy)["']|\bstate\s*(?:\.\s*(?:rngState|policy)\b|\[\s*["'](?:rngState|policy)["']\s*\])/u,
  );
});

test("AC2 evidence: replay consults nothing outside the log — Date.now and Math.random poisoned to throw", () => {
  let log = "";
  ({ log } = appendEvent(log, {
    schemaVersion: 1,
    type: "Added",
    occurredAt: 10,
    actorId: "a",
    workstreamId: "ws",
    episodeId: "ep-1",
    correlationId: "corr-1",
    causationId: "evt_0",
    payload: { amount: 2 },
  }));
  ({ log } = appendEvent(log, {
    schemaVersion: 1,
    type: "Added",
    occurredAt: 20,
    actorId: "a",
    workstreamId: "ws",
    payload: { amount: 3 },
  }));
  ({ log } = appendEvent(log, {
    schemaVersion: 1,
    type: "Added",
    occurredAt: 30,
    actorId: "a",
    workstreamId: "ws",
    payload: { amount: 5 },
  }));
  type SumState = {
    readonly total: number;
    readonly rngState: number;
    readonly seenTimes: readonly number[];
  };
  const reactor: Reactor<SumState> = (state, incoming, environment) => {
    const payload = incoming.payload as Readonly<Record<string, JsonValue>>;
    return {
      state: {
        total: state.total + Number(payload.amount),
        rngState: environment.rngState,
        seenTimes: [...state.seenTimes, environment.now],
      },
      intents: [],
      schedules: [],
      trace: {
        reactorId: "sum",
        reactorVersion: "1",
        branchPath: [incoming.type],
        envInputs: [`now:${environment.now}`, `rng:${environment.rngState}`],
        cadenceEvaluations: [],
      },
    };
  };
  const initial: SumState = { total: 0, rngState: 11, seenTimes: [] };
  const first = poisoned(() =>
    replay(initial, decodeLog(log), reactor, predicates),
  );
  const second = poisoned(() =>
    replay(initial, decodeLog(encodeLog(decodeLog(log))), reactor, predicates),
  );
  assert.deepEqual(second, first);
  assert.deepEqual(first.state, {
    total: 10,
    rngState: 11,
    seenTimes: [10, 20, 30],
  });
  assert.deepEqual(
    first.decisions.map((decision) => decision.trace.envInputs),
    [
      ["now:10", "rng:11"],
      ["now:20", "rng:11"],
      ["now:30", "rng:11"],
    ],
  );
});

test("AC2 evidence: evaluateCadence, stepProgram, and authorize never read ambient time or randomness under poison", () => {
  poisoned(() => {
    // Cadence: every evaluated kind that touches time or RNG, with literal pins.
    assert.equal(evaluateCadence(Cadence.Once(150), {}, env()).dueAt, 150);
    assert.equal(evaluateCadence(Cadence.After(25), {}, env()).dueAt, 125);
    assert.equal(
      evaluateCadence(Cadence.Every(20, 50), {}, env(110)).dueAt,
      130,
    );
    assert.equal(
      evaluateCadence(
        Cadence.Until(Cadence.Every(20), {
          registryId: "state.flag",
          version: 1,
        }),
        { flag: true },
        env(),
      ).dueAt,
      null,
    );
    assert.deepEqual(
      evaluateCadence(
        Cadence.Backoff(100, 2, 100000, 1, 0.5),
        {},
        env(1000, 42),
      ),
      { dueAt: 1150, rngState: 1083814273, trace: "Backoff:1:150" },
    );
    assert.deepEqual(
      evaluateCadence(
        Cadence.Backoff(100, 2, 100000, 1, 0.5),
        {},
        env(1000, 7),
      ),
      { dueAt: 1148, rngState: 1025555898, trace: "Backoff:1:148" },
    );

    // Program: Invoke dispatch, result consumption, and Await matching.
    const program = Program.Sequence([
      Program.Invoke(
        "cmd_1",
        { kind: "Act", effect: "model.call", payload: {} },
        {
          ok: Program.Await(
            { type: "Approved", correlationId: "c1" },
            Cadence.After(5),
            Program.Done(),
          ),
        },
      ),
    ]);
    const dispatch = stepProgram(program, { flag: true }, env());
    assert.deepEqual(dispatch.intents, [
      { kind: "Act", effect: "model.call", payload: {} },
    ]);
    const resultEvent: Event = {
      schemaVersion: 1,
      eventId: "r1",
      type: "CommandResult",
      occurredAt: 5,
      actorId: "a",
      workstreamId: "ws",
      payload: { commandId: "cmd_1", result: "ok" },
    };
    const consumed = stepProgram(
      dispatch.residual,
      { flag: true },
      env(),
      resultEvent,
    );
    assert.deepEqual(
      consumed.residual,
      Program.Sequence([
        Program.Await(
          { type: "Approved", correlationId: "c1" },
          Cadence.After(5),
          Program.Done(),
        ),
      ]),
    );
    const approved: Event = {
      schemaVersion: 1,
      eventId: "ap1",
      type: "Approved",
      occurredAt: 6,
      actorId: "a",
      workstreamId: "ws",
      correlationId: "c1",
      payload: {},
    };
    assert.deepEqual(
      stepProgram(consumed.residual, { flag: true }, env(), approved).residual,
      Program.Done(),
    );

    // Authorization: one grant with resource accounting, one structural refusal.
    const intent: ActIntent = {
      kind: "Act",
      effect: "write",
      resource: "cpu",
      payload: {},
    };
    const envelope: AuthorityEnvelope = {
      authorityEnvelopeId: "auth-1",
      allowedEffects: ["write"],
      deniedEffects: [],
      resourceLimits: { cpu: 1 },
      requiredEvidence: [],
      expiresAt: 999,
      revocationEventTypes: [],
    };
    const context = {
      now: 1,
      actorId: "a",
      workstreamId: "ws",
      episodeId: "ep",
      decisionIndex: 3,
      intentIndex: 0,
      evidence: [],
      revokedBy: [],
    };
    const granted = authorize(intent, envelope, context);
    assert.equal(granted.authorized, true);
    if (granted.authorized)
      assert.deepEqual(granted.authority.resourceLimits, { cpu: 0 });
    const refused = authorize(
      { kind: "Act", effect: "read", payload: {} },
      envelope,
      context,
    );
    assert.equal(refused.authorized, false);
    if (!refused.authorized) {
      assert.equal(refused.refusal.payload.reason, "effect not allowed");
      assert.deepEqual(refused.trace.branchPath, [
        "refused",
        "effect not allowed",
      ]);
    }
  });
});

test("AC2 evidence: appendEvent edge-assigns sequential literal eventIds evt_1..evt_4", () => {
  let log = "";
  const returned: Event[] = [];
  for (const amount of [1, 2, 3, 4]) {
    const appended = appendEvent(log, draft("Added", amount * 10, { amount }));
    log = appended.log;
    returned.push(appended.event);
  }
  assert.deepEqual(
    returned.map((event) => event.eventId),
    ["evt_1", "evt_2", "evt_3", "evt_4"],
  );
  const decoded = decodeLog(log);
  assert.deepEqual(
    decoded.map((event) => event.eventId),
    ["evt_1", "evt_2", "evt_3", "evt_4"],
  );
  assert.deepEqual(decoded, returned);
  const lines = log.trimEnd().split("\n");
  assert.equal(lines.length, 4);
  lines.forEach((line, index) =>
    assert.equal((JSON.parse(line) as Event).eventId, `evt_${index + 1}`),
  );
});

test("AC2 evidence: store round trip preserves correlationId, causationId, and episodeId", () => {
  const { log, event: assigned } = appendEvent("", {
    schemaVersion: 1,
    type: "Linked",
    occurredAt: 42,
    actorId: "actor-1",
    workstreamId: "ws-1",
    episodeId: "ep-9",
    correlationId: "corr-7",
    causationId: "evt_0",
    payload: { ref: "r" },
  });
  assert.deepEqual(assigned, {
    schemaVersion: 1,
    eventId: "evt_1",
    type: "Linked",
    occurredAt: 42,
    actorId: "actor-1",
    workstreamId: "ws-1",
    episodeId: "ep-9",
    correlationId: "corr-7",
    causationId: "evt_0",
    payload: { ref: "r" },
  });
  const decoded = decodeLog(log);
  assert.deepEqual(decoded, [assigned]);
  const roundTripped = decodeLog(encodeLog(decoded));
  assert.deepEqual(roundTripped, decoded);
  assert.equal(roundTripped[0]?.correlationId, "corr-7");
  assert.equal(roundTripped[0]?.causationId, "evt_0");
  assert.equal(roundTripped[0]?.episodeId, "ep-9");
});

test("AC2 evidence: encodeLog ends with a newline so appendEvent after a round trip stays well-formed", () => {
  assert.equal(encodeLog([]), "");
  let log = "";
  ({ log } = appendEvent(log, draft("Added", 10, { amount: 2 })));
  ({ log } = appendEvent(log, draft("Added", 20, { amount: 3 })));
  const reencoded = encodeLog(decodeLog(log));
  assert.ok(
    reencoded.endsWith("\n"),
    "encodeLog must terminate the log with a newline",
  );
  assert.equal(reencoded, log);
  const third = appendEvent(reencoded, draft("Added", 30, { amount: 5 }));
  const decoded = decodeLog(third.log);
  assert.equal(decoded.length, 3);
  assert.deepEqual(
    decoded.map((event) => event.eventId),
    ["evt_1", "evt_2", "evt_3"],
  );
  assert.deepEqual(decoded[2]?.payload, { amount: 5 });
  assert.equal(decoded[2]?.occurredAt, 30);
});

test("WO-017 store contract: partial tail refuses decode and append at the offending line", () => {
  const first = appendEvent("", draft("Added", 10, { amount: 1 }));
  const partial = `${first.log}{"schemaVersion":1,"eventId":"evt_2"`;
  assert.throws(() => decodeLog(partial), /line 2: missing final newline/);
  assert.throws(
    () => appendEvent(partial, draft("Added", 30, { amount: 3 })),
    /line 2: missing final newline/,
  );
});

test("WO-017 store contract: blank interior line refuses decode and append without shifting ids", () => {
  const first = appendEvent("", draft("Added", 10, { amount: 1 }));
  const third = JSON.stringify({
    ...draft("Added", 30, { amount: 3 }),
    eventId: "evt_3",
  });
  const blankInterior = `${first.log}\n${third}\n`;
  assert.throws(
    () => decodeLog(blankInterior),
    /line 2: expected a JSON object/,
  );
  assert.throws(
    () => appendEvent(blankInterior, draft("Added", 40, { amount: 4 })),
    /line 2: expected a JSON object/,
  );
});

test("WO-017 store contract: whitespace-only log refuses decode and append as line one", () => {
  const whitespaceOnly = " \t\r\n";
  assert.throws(
    () => decodeLog(whitespaceOnly),
    /line 1: expected a JSON object/,
  );
  assert.throws(
    () => appendEvent(whitespaceOnly, draft("Added", 10, { amount: 1 })),
    /line 1: expected a JSON object/,
  );
});

test("WO-017 store contract: a complete JSON object without its final newline refuses both boundaries", () => {
  const completeButUnterminated = JSON.stringify({
    ...draft("Added", 10, { amount: 1 }),
    eventId: "evt_1",
  });
  assert.throws(
    () => decodeLog(completeButUnterminated),
    /line 1: missing final newline/,
  );
  assert.throws(
    () =>
      appendEvent(completeButUnterminated, draft("Added", 20, { amount: 2 })),
    /line 1: missing final newline/,
  );
});

test("WO-017 store contract: every line must decode to a JSON object", () => {
  for (const nonObject of ["null", "[]", '"event"', "42", "true"]) {
    assert.throws(
      () => decodeLog(`${nonObject}\n`),
      /line 1: expected a JSON object/,
    );
  }
});

test("WO-017 store contract: newline-terminated invalid JSON names its physical line", () => {
  const first = appendEvent("", draft("Added", 10, { amount: 1 }));
  const invalid = `${first.log}{not-json}\n`;
  assert.throws(() => decodeLog(invalid), /line 2: invalid JSON/);
  assert.throws(
    () => appendEvent(invalid, draft("Added", 30, { amount: 3 })),
    /line 2: invalid JSON/,
  );
});

test("WO-017 store contract: well-formed logs retain exact bytes and count only object lines", () => {
  const first = appendEvent("", draft("Added", 10, { amount: 1 }));
  const second = appendEvent(first.log, draft("Added", 20, { amount: 2 }));
  const before = second.log;
  const decodedBefore = decodeLog(before);
  assert.equal(encodeLog(decodedBefore), before);

  const third = appendEvent(before, draft("Added", 30, { amount: 3 }));
  assert.equal(third.event.eventId, "evt_3");
  assert.equal(third.log.slice(0, before.length), before);
  assert.deepEqual(decodeLog(third.log).slice(0, 2), decodedBefore);
  assert.equal(
    third.log,
    `${before}${JSON.stringify(third.event)}\n`,
    "append changes a well-formed log only by adding the assigned object line",
  );
});
