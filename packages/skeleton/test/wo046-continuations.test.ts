import test from "node:test";
import assert from "node:assert/strict";
import { Program, type Event, type JsonValue } from "@dotln/kernel";
import {
  initialState,
  initialVerificationRuntime,
  initialVerificationState,
  seiriReactor,
  verificationStateFromRuntime,
} from "../src/reactor.js";

const event: Event = {
  schemaVersion: 1,
  eventId: "evt_1",
  type: "Tick",
  occurredAt: 0,
  actorId: "test",
  workstreamId: "ws",
  payload: {},
};
const env = { now: 0, rngState: 1, predicates: {} };
const json = (value: unknown) => value as JsonValue;

test("WO-046 runtime rejects corrupt persisted continuations on fold before a result or dispatch", () => {
  for (const program of [
    Program.All([]),
    Program.Sequence([Program.Race([])]),
    { kind: "Invoke", commandId: "cmd" },
  ]) {
    const state = { ...initialState(), program: json(program) };
    const before = JSON.stringify(state);
    assert.throws(
      () => seiriReactor(state, event, env),
      /runtime program: Invalid continuation.*\$/,
    );
    assert.equal(JSON.stringify(state), before);
  }
});

test("WO-046 verification state reads and folds reject bad nested continuations", () => {
  for (const continuation of [
    Program.Compensate(Program.Done(), Program.Done()),
    { kind: "Emit", event: {}, next: Program.Done() },
  ]) {
    const state = {
      ...initialVerificationRuntime("ws"),
      verification: json({ ...initialVerificationState("ws"), continuation }),
    };
    assert.throws(
      () => verificationStateFromRuntime(state),
      /verification continuation: Invalid continuation/,
    );
    assert.throws(
      () =>
        seiriReactor(
          state,
          {
            ...event,
            type: "VerificationDispatchRequested",
            actorId: "verification-host",
          },
          env,
        ),
      /verification continuation: Invalid continuation/,
    );
  }
});

test("WO-046 a valid persisted executable tree folds without byte changes", () => {
  const program = Program.Sequence([Program.Done()]);
  const state = { ...initialState(), program: json(program) };
  assert.equal(
    JSON.stringify(seiriReactor(state, event, env).state.program),
    JSON.stringify(program),
  );
  const verification = initialVerificationRuntime("ws");
  assert.deepEqual(
    verificationStateFromRuntime(verification),
    initialVerificationState("ws"),
  );
});
