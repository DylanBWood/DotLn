import test from "node:test";
import assert from "node:assert/strict";
import { authorize, commandId } from "../src/index.js";
import type { ActIntent, AuthorityEnvelope, AuthorizationResult, EventEnvelope, JsonValue } from "../src/index.js";

const event = <P extends JsonValue = Record<string, never>>(id: string, type: string, at: number, payload: P = {} as P): EventEnvelope<string, P> => ({ schemaVersion: 1, eventId: id, type, occurredAt: at, actorId: "actor", workstreamId: "ws", episodeId: "ep", payload });
const authority = (overrides: Partial<AuthorityEnvelope> = {}): AuthorityEnvelope => ({ authorityEnvelopeId: "auth", allowedEffects: ["write"], deniedEffects: [], resourceLimits: {}, requiredEvidence: [], expiresAt: 999, revocationEventTypes: [], ...overrides });
type AuthContext = Parameters<typeof authorize>[2];
const authContext = (overrides: Partial<AuthContext> = {}): AuthContext => ({ now: 1, actorId: "a", workstreamId: "ws", episodeId: "ep", decisionIndex: 3, intentIndex: 0, evidence: [], revokedBy: [], ...overrides });
const act = (effect = "write", resource?: string): ActIntent => ({ kind: "Act", effect, ...(resource === undefined ? {} : { resource }), payload: {} });
// Simulates a deserialized continuation carrying a non-JSON-string effect (deserializeContinuation is an unchecked JSON.parse cast).
const forged = (effect: unknown): ActIntent => ({ kind: "Act", effect, payload: {} }) as unknown as ActIntent;
const requireAuthorized = (result: AuthorizationResult): Extract<AuthorizationResult, { authorized: true }> => { if (!result.authorized) assert.fail(result.refusal.payload.reason); return result; };
const requireRefused = (result: AuthorizationResult): Extract<AuthorizationResult, { authorized: false }> => { assert.equal(result.authorized, false); if (result.authorized) throw new Error("expected refusal"); return result; };
const refusalReason = (result: AuthorizationResult): string => requireRefused(result).refusal.payload.reason;

test("AC6 evidence: multi-element envelope lists bind past element one, refusing and authorizing", () => {
  // deniedEffects: second element must deny even though the first does not match.
  const denied = requireRefused(authorize(act("git.push"), authority({ allowedEffects: ["git.*"], deniedEffects: ["shell.*", "git.*"] }), authContext()));
  assert.equal(denied.refusal.payload.reason, "effect denied");
  assert.deepEqual(denied.trace.branchPath, ["refused", "effect denied"]);
  // revocationEventTypes: second element must revoke when only a Revoked event is present.
  const revoked = requireRefused(authorize(act(), authority({ revocationEventTypes: ["Paused", "Revoked"] }), authContext({ revokedBy: [event("rv1", "Revoked", 0)] })));
  assert.equal(revoked.refusal.payload.reason, "authority revoked");
  // revokedBy: the matching event may sit past element one of the revocation list too.
  assert.equal(refusalReason(authorize(act(), authority({ revocationEventTypes: ["Revoked"] }), authContext({ revokedBy: [event("rv2", "Unrelated", 0), event("rv3", "Revoked", 0)] }))), "authority revoked");
  // requiredEvidence: second requirement must be enforced when only the first is supplied.
  const missing = requireRefused(authorize(act(), authority({ requiredEvidence: ["a", "b"] }), authContext({ evidence: ["a"] })));
  assert.equal(missing.refusal.payload.reason, "required evidence missing");
  // ...and satisfied requirements found past element one of the supplied evidence must authorize.
  assert.equal(authorize(act(), authority({ requiredEvidence: ["a", "b"] }), authContext({ evidence: ["b", "a"] })).authorized, true);
  // allowedEffects: the second element must authorize (the list matters in both directions).
  const allowed = requireAuthorized(authorize(act("git.push"), authority({ allowedEffects: ["x", "git.*"] }), authContext()));
  assert.equal(allowed.command.intent.effect, "git.push");
});

test("AC6 evidence: effect glob is prefix-anchored and exact patterns are exact", () => {
  const gitOnly = authority({ allowedEffects: ["git.*"] });
  assert.equal(refusalReason(authorize(act("rm-rf-then-git.commit"), gitOnly, authContext())), "effect not allowed");
  assert.equal(refusalReason(authorize(act("not-git.push"), gitOnly, authContext())), "effect not allowed");
  assert.equal(refusalReason(authorize(act("gi"), gitOnly, authContext())), "effect not allowed");
  assert.equal(refusalReason(authorize(act("gitX"), gitOnly, authContext())), "effect not allowed");
  assert.equal(authorize(act("git.push"), gitOnly, authContext()).authorized, true);
  const exact = authority({ allowedEffects: ["git.push"] });
  assert.equal(refusalReason(authorize(act("git.pushX"), exact, authContext())), "effect not allowed");
  assert.equal(authorize(act("git.push"), exact, authContext()).authorized, true);
});

test("AC6 evidence: deny is evaluated before allow for an effect present in both lists", () => {
  const both = requireRefused(authorize(act("git.push"), authority({ allowedEffects: ["git.push"], deniedEffects: ["git.push"] }), authContext()));
  assert.equal(both.refusal.payload.reason, "effect denied");
  assert.deepEqual(both.trace.branchPath, ["refused", "effect denied"]);
});

test("AC6 evidence: refusal draft and trace are structurally complete, episodeId present and absent", () => {
  const withEpisode = requireRefused(authorize(act("read"), authority(), authContext({ now: 777, intentIndex: 4 })));
  assert.deepEqual(withEpisode.refusal, { schemaVersion: 1, type: "CommandRefused", occurredAt: 777, actorId: "a", workstreamId: "ws", episodeId: "ep", payload: { intentIndex: 4, reason: "effect not allowed", authorityEnvelopeId: "auth" } });
  assert.deepEqual(withEpisode.trace, { reactorId: "authority-guard", reactorVersion: "1", branchPath: ["refused", "effect not allowed"], envInputs: ["now", "authorityEnvelope", "evidence", "revocations"], cadenceEvaluations: [] });
  assert.equal(Object.hasOwn(withEpisode.refusal, "eventId"), false);
  const sansEpisode: AuthContext = { now: 9, actorId: "a", workstreamId: "ws", decisionIndex: 5, intentIndex: 2, evidence: [], revokedBy: [] };
  const refused = requireRefused(authorize(act("deploy"), authority({ deniedEffects: ["deploy"] }), sansEpisode));
  assert.deepEqual(refused.refusal, { schemaVersion: 1, type: "CommandRefused", occurredAt: 9, actorId: "a", workstreamId: "ws", payload: { intentIndex: 2, reason: "effect denied", authorityEnvelopeId: "auth" } });
  assert.equal(Object.hasOwn(refused.refusal, "episodeId"), false);
  assert.deepEqual(refused.trace, { reactorId: "authority-guard", reactorVersion: "1", branchPath: ["refused", "effect denied"], envInputs: ["now", "authorityEnvelope", "evidence", "revocations"], cadenceEvaluations: [] });
});

test("AC6 evidence: authorize never mutates the caller's envelope; decrement is copy-on-write", () => {
  const envelope = authority({ allowedEffects: ["git.*"], resourceLimits: { cpu: 2, disk: 5 } });
  Object.freeze(envelope);
  Object.freeze(envelope.resourceLimits);
  Object.freeze(envelope.allowedEffects);
  Object.freeze(envelope.deniedEffects);
  Object.freeze(envelope.requiredEvidence);
  Object.freeze(envelope.revocationEventTypes);
  const snapshot = structuredClone(envelope);
  // Test modules run in strict mode, so any in-place write to the frozen envelope would throw here.
  const result = requireAuthorized(authorize(act("git.push", "cpu"), envelope, authContext()));
  assert.deepEqual(envelope, snapshot);
  assert.equal(envelope.resourceLimits["cpu"], 2);
  assert.deepEqual(result.authority, { ...snapshot, resourceLimits: { cpu: 1, disk: 5 } });
});

test("AC6 regression B2: non-string effect refuses with reason, never throws", () => {
  // Glob patterns in both lists force the effect matcher onto the path that used to throw TypeError.
  const globbed = authority({ allowedEffects: ["git.*"], deniedEffects: ["shell.*"] });
  for (const bad of [123, null, undefined, {}, [], true]) {
    const refused = requireRefused(authorize(forged(bad), globbed, authContext()));
    assert.equal(refused.refusal.payload.reason, "effect is not a string");
    assert.deepEqual(refused.trace.branchPath, ["refused", "effect is not a string"]);
  }
});

test("AC6 evidence: authorized command carries recomputed commandId and mirrors context episodeId", () => {
  const intent = act("git.push");
  const withEpisode = requireAuthorized(authorize(intent, authority({ allowedEffects: ["git.*"] }), authContext()));
  assert.deepEqual(withEpisode.command, { commandId: commandId("ws", "ep", 3, 0), episodeId: "ep", workstreamId: "ws", intent });
  assert.equal(withEpisode.command.commandId, "cmd_c835adb882f3d562");
  const sansEpisode: AuthContext = { now: 1, actorId: "a", workstreamId: "ws", decisionIndex: 5, intentIndex: 2, evidence: [], revokedBy: [] };
  const bare = requireAuthorized(authorize(intent, authority({ allowedEffects: ["git.*"] }), sansEpisode));
  assert.deepEqual(bare.command, { commandId: commandId("ws", undefined, 5, 2), workstreamId: "ws", intent });
  assert.equal(Object.hasOwn(bare.command, "episodeId"), false);
  assert.equal(bare.command.commandId, "cmd_1510809f958568d0");
  assert.notEqual(commandId("ws", "ep", 3, 0), commandId("ws", undefined, 3, 0));
});
