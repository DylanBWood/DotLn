import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  Cadence,
  Program,
  appendEvent,
  applyCommandResult,
  authorize,
  commandId,
  decideProgram,
  decodeLog,
  deserializeContinuation,
  emptyOutbox,
  encodeLog,
  evaluateCadence,
  guardQueuedPulse,
  pendingCommands,
  persistCommand,
  replay,
  replayOutbox,
  serializeContinuation,
  stableHash,
  stepProgram,
} from "../src/index.js";
import type {
  ActIntent,
  AuthorityEnvelope,
  AuthorizationResult,
  EventDraft,
  EventEnvelope,
  JsonValue,
  KernelEnv,
  PredicateRegistry,
  Reactor,
} from "../src/index.js";

const event = <P extends JsonValue = Record<string, never>>(
  id: string,
  type: string,
  at: number,
  payload: P = {} as P,
): EventEnvelope<string, P> => ({
  schemaVersion: 1,
  eventId: id,
  type,
  occurredAt: at,
  actorId: "actor",
  workstreamId: "ws",
  episodeId: "ep",
  payload,
});
const draft = <P extends JsonValue = Record<string, never>>(
  type: string,
  at: number,
  payload: P = {} as P,
): EventDraft<string, P> => ({
  schemaVersion: 1,
  type,
  occurredAt: at,
  actorId: "actor",
  workstreamId: "ws",
  episodeId: "ep",
  payload,
});
const stateValue = (state: JsonValue, key: string): JsonValue | undefined =>
  state !== null && !Array.isArray(state) && typeof state === "object"
    ? (state as Readonly<Record<string, JsonValue>>)[key]
    : undefined;
const predicates: PredicateRegistry = {
  "state.flag": { 1: ({ state }) => stateValue(state, "flag") === true },
  "presence.away": {
    1: ({ state }) => stateValue(state, "presence") === "away",
  },
};
const env = (now = 100, rngState = 7): KernelEnv => ({
  now,
  rngState,
  predicates,
});
const authority = (
  overrides: Partial<AuthorityEnvelope> = {},
): AuthorityEnvelope => ({
  authorityEnvelopeId: "auth",
  allowedEffects: ["write"],
  deniedEffects: [],
  resourceLimits: {},
  requiredEvidence: [],
  expiresAt: 999,
  revocationEventTypes: [],
  ...overrides,
});
const authContext = (
  overrides: Partial<Parameters<typeof authorize>[2]> = {},
): Parameters<typeof authorize>[2] => ({
  now: 1,
  actorId: "a",
  workstreamId: "ws",
  episodeId: "ep",
  decisionIndex: 3,
  intentIndex: 0,
  evidence: [],
  revokedBy: [],
  ...overrides,
});
const requireAuthorized = (
  result: AuthorizationResult,
): Extract<AuthorizationResult, { authorized: true }> => {
  if (!result.authorized) assert.fail(result.refusal.payload.reason);
  return result;
};
const refusalReason = (result: AuthorizationResult): string => {
  assert.equal(result.authorized, false);
  if (result.authorized) throw new Error("expected refusal");
  return result.refusal.payload.reason;
};

test("AC1 reactor purity property: kernel presence reactor repeats identical Decision and trace", () => {
  for (let seed = 0; seed < 100; seed++) {
    const state = { presence: seed % 2 ? "away" : "returned", seed };
    const pulse = event(`pulse-${seed}`, "CadencePulse", seed);
    const first = guardQueuedPulse(
      state,
      pulse,
      env(seed, seed),
      { registryId: "presence.away", version: 1 },
      [`s-${seed}`],
    );
    const second = guardQueuedPulse(
      structuredClone(state),
      structuredClone(pulse),
      env(seed, seed),
      { registryId: "presence.away", version: 1 },
      [`s-${seed}`],
    );
    assert.deepEqual(second, first);
    assert.equal(
      first.trace.branchPath.at(-1),
      state.presence === "away" ? "active" : "noop",
    );
  }
});

test("AC2 replay identity: JSONL round trip yields same state and decisions from log-derived environment", () => {
  let log = "";
  for (const [at, amount] of [
    [10, 2],
    [20, 3],
  ] as const)
    ({ log } = appendEvent(log, {
      schemaVersion: 1,
      type: "Added",
      occurredAt: at,
      actorId: "a",
      workstreamId: "ws",
      payload: { amount },
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
      continuation: Program.Done(),
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
  const first = replay(
    { total: 0, rngState: 11, seenTimes: [] },
    decodeLog(log),
    reactor,
    predicates,
  );
  const second = replay(
    { total: 0, rngState: 11, seenTimes: [] },
    decodeLog(encodeLog(decodeLog(log))),
    reactor,
    predicates,
  );
  assert.deepEqual(second, first);
  assert.deepEqual(first.state, {
    total: 5,
    rngState: 11,
    seenTimes: [10, 20],
  });
  assert.deepEqual(
    first.decisions.map((decision) => decision.trace.envInputs),
    [
      ["now:10", "rng:11"],
      ["now:20", "rng:11"],
    ],
  );
});

test("AC3 cadence virtual time: Every boundaries, Gate, bounded Backoff, Until, Once and After", () => {
  assert.equal(evaluateCadence(Cadence.Once(150), {}, env()).dueAt, 150);
  assert.equal(evaluateCadence(Cadence.After(25), {}, env()).dueAt, 125);
  assert.equal(evaluateCadence(Cadence.Every(20), {}, env(101)).dueAt, 120);
  assert.equal(evaluateCadence(Cadence.Every(20, 50), {}, env(110)).dueAt, 130);
  assert.throws(() => evaluateCadence(Cadence.Every(0), {}, env()), /positive/);
  assert.equal(
    evaluateCadence(
      Cadence.Gate(Cadence.After(10), { registryId: "state.flag", version: 1 }),
      { flag: false },
      env(),
    ).dueAt,
    null,
  );
  assert.equal(
    evaluateCadence(
      Cadence.Gate(Cadence.After(10), { registryId: "state.flag", version: 1 }),
      { flag: true },
      env(),
    ).dueAt,
    110,
  );
  const b1 = evaluateCadence(
    Cadence.Backoff(1000, 2, 1000, 2, 0.5),
    {},
    env(100, 42),
  );
  const b2 = evaluateCadence(
    Cadence.Backoff(1000, 2, 1000, 2, 0.5),
    {},
    env(100, 42),
  );
  assert.deepEqual(b1, b2);
  assert.notEqual(b1.rngState, 42);
  assert.notEqual(b1.dueAt, null);
  if (b1.dueAt !== null) assert.ok(b1.dueAt <= 1100);
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
});

test("AC4 continuations: correlated Invoke/Await sequence serializes and resumes without closures", () => {
  const finished = draft("Finished", 0);
  const program = Program.Sequence([
    Program.Invoke(
      "cmd_1",
      { kind: "Act", effect: "model.call", payload: { prompt: "original" } },
      { ok: Program.Done() },
    ),
    Program.Await(
      { type: "Approved", correlationId: "corr-1" },
      Cadence.After(1000),
      Program.Guard(
        { registryId: "state.flag", version: 1 },
        Program.Emit(finished, Program.Done()),
        Program.Done(),
      ),
    ),
  ]);
  let step = stepProgram(program, { flag: true }, env());
  assert.equal(step.intents.length, 1);
  assert.deepEqual(
    decideProgram(program, { flag: true }, env()).continuation,
    step.residual,
  );
  let residual = deserializeContinuation(serializeContinuation(step.residual));
  assert.deepEqual(residual, step.residual);
  assert.equal(findFunctions(residual), false);
  step = stepProgram(
    residual,
    { flag: true },
    env(),
    event("r1", "CommandResult", 5, { commandId: "wrong", result: "ok" }),
  );
  assert.equal(step.residual.kind, "Sequence");
  step = stepProgram(
    step.residual,
    { flag: true },
    env(),
    event("r2", "CommandResult", 5, { commandId: "cmd_1", result: "ok" }),
  );
  residual = step.residual;
  step = stepProgram(residual, { flag: true }, env(), {
    ...event("approved", "Approved", 6),
    correlationId: "corr-1",
  });
  step = stepProgram(step.residual, { flag: true }, env());
  assert.deepEqual(step.emitted, [finished]);
  const malformed = Program.Await(
    { type: "CommandResult", commandId: "cmd_1" },
    Cadence.After(1),
    Program.Done(),
  );
  assert.equal(
    stepProgram(malformed, {}, env(), event("null", "CommandResult", 7, null))
      .residual.kind,
    "Await",
  );
});

function findFunctions(value: unknown): boolean {
  if (typeof value === "function") return true;
  if (value === null || typeof value !== "object") return false;
  return Object.values(value).some(findFunctions);
}

test("AC5 row 1: replay recovers persisted pending command for idempotent redispatch", () => {
  const authorized = requireAuthorized(
    authorize(
      { kind: "Act", effect: "write", payload: { value: 1 } },
      authority(),
      authContext(),
    ),
  );
  const persisted = persistCommand(emptyOutbox(), authorized.command);
  const persistedEvent = event("persist-1", "CommandPersisted", 1, {
    command: authorized.command as unknown as JsonValue,
  });
  const recovered = replayOutbox(decodeLog(encodeLog([persistedEvent])));
  assert.deepEqual(pendingCommands(recovered), pendingCommands(persisted));
  assert.equal(
    pendingCommands(recovered)[0]?.commandId,
    commandId("ws", "ep", 3, 0),
  );
});

test("AC5 row 3: duplicate result is ignored by kernel outbox with dedup trace", () => {
  const authorized = requireAuthorized(
    authorize(
      { kind: "Act", effect: "write", payload: {} },
      authority(),
      authContext(),
    ),
  );
  const pending = persistCommand(emptyOutbox(), authorized.command);
  const result = event("r1", "CommandResult", 2, {
    commandId: authorized.command.commandId,
    result: "ok",
  });
  const first = applyCommandResult(pending, result);
  const duplicate = applyCommandResult(first.state, {
    ...result,
    eventId: "r2",
  });
  assert.deepEqual(duplicate.state, first.state);
  assert.deepEqual(duplicate.trace.branchPath, ["result", "dedup"]);
  assert.deepEqual(
    applyCommandResult(
      pending,
      event("other", "Unrelated", 3, {
        commandId: authorized.command.commandId,
      }),
    ).state,
    pending,
  );
});

test("AC5 row 5: queued pulse rechecks predicate, emits NoOp trace, and cancels future pulses", () => {
  const decision = guardQueuedPulse(
    { presence: "returned" },
    event("pulse", "CadencePulse", 10),
    env(),
    { registryId: "presence.away", version: 1 },
    ["future-1", "future-2"],
  );
  assert.equal(decision.intents[0]?.kind, "NoOp");
  assert.deepEqual(decision.trace.branchPath, ["queued-pulse", "noop"]);
  assert.deepEqual(decision.trace.cadenceEvaluations, [
    "cancel:future-1",
    "cancel:future-2",
  ]);
  assert.deepEqual(
    ["future-1", "future-2", "unrelated"].filter(
      (id) => !decision.cancelledScheduleIds.includes(id),
    ),
    ["unrelated"],
  );
});

test("AC6 authorization guard: all refusal branches, patterns, own resources, and accounting", () => {
  const act = (effect = "write", resource?: string): ActIntent => ({
    kind: "Act",
    effect,
    ...(resource === undefined ? {} : { resource }),
    payload: {},
  });
  assert.equal(
    refusalReason(
      authorize(
        act("deploy"),
        authority({ deniedEffects: ["deploy"] }),
        authContext(),
      ),
    ),
    "effect denied",
  );
  assert.equal(
    refusalReason(authorize(act("read"), authority(), authContext())),
    "effect not allowed",
  );
  assert.equal(
    refusalReason(authorize(act(), authority({ expiresAt: 0 }), authContext())),
    "authority expired",
  );
  assert.equal(
    refusalReason(
      authorize(
        act(),
        authority({ revocationEventTypes: ["Revoked"] }),
        authContext({ revokedBy: [event("x", "Revoked", 0)] }),
      ),
    ),
    "authority revoked",
  );
  assert.equal(
    refusalReason(
      authorize(
        act(),
        authority({ requiredEvidence: ["test"] }),
        authContext(),
      ),
    ),
    "required evidence missing",
  );
  for (const resource of [
    "constructor",
    "__proto__",
    "toString",
    "valueOf",
    "hasOwnProperty",
  ])
    assert.equal(
      refusalReason(
        authorize(act("write", resource), authority(), authContext()),
      ),
      "resource limit exceeded",
    );
  assert.equal(
    authorize(
      act("git.commit"),
      authority({ allowedEffects: ["git.*"] }),
      authContext(),
    ).authorized,
    true,
  );
  let envelope: AuthorityEnvelope = authority({ resourceLimits: { cpu: 2 } });
  for (let index = 0; index < 2; index++)
    envelope = requireAuthorized(
      authorize(
        act("write", "cpu"),
        envelope,
        authContext({ intentIndex: index }),
      ),
    ).authority;
  assert.equal(
    refusalReason(
      authorize(act("write", "cpu"), envelope, authContext({ intentIndex: 2 })),
    ),
    "resource limit exceeded",
  );
});

test("AC7 README maps every public export and package import target is valid", async () => {
  const readme = readFileSync(
    new URL("../../README.md", import.meta.url),
    "utf8",
  );
  const map =
    readme.split("## Domain-model map")[1]?.split("\n\nCadence exports")[0] ??
    "";
  const declarations = ["types.d.ts", "core.d.ts", "store.d.ts"]
    .map((file) =>
      readFileSync(new URL(`../src/${file}`, import.meta.url), "utf8"),
    )
    .join("\n");
  const exported = [
    ...declarations.matchAll(
      /^export (?:declare )?(?:type|interface|class|function|const|namespace) ([A-Za-z]\w*)/gm,
    ),
  ].map((match) => match[1]);
  assert.ok(exported.length > 40, `only discovered ${exported.length} exports`);
  for (const name of exported)
    assert.match(map, new RegExp(`\\b${name}\\b`), `${name} is unmapped`);
  const manifest = JSON.parse(
    readFileSync(new URL("../../package.json", import.meta.url), "utf8"),
  ) as { exports: { ".": { import: string; types: string } } };
  assert.match(manifest.exports["."].import, /^\.\//);
  assert.match(manifest.exports["."].types, /^\.\//);
  assert.equal(typeof (await import("@dotln/kernel")).replay, "function");
  assert.equal(stableHash("é"), "0ac21707b7181e01");
  assert.equal(commandId("ws", "", 3, 0), commandId("ws", undefined, 3, 0));
});
