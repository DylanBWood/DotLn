import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { decodeLog, type Event } from "@dotln/kernel";
import {
  SEMANTIC_CORRECTIONS,
  compileFeedbackUnits,
  compileFeedbackAudit,
  type CompiledFeedback,
} from "@dotln/compiler";
import { runScenario } from "../src/scenario.js";
import { ARTIFACT_REFUSAL_TYPES } from "../src/artifact-identity.js";
import {
  initialState,
  initialVerificationRuntime,
  seiriReactor,
  seiriPredicates,
  skeletonStateFromRuntime,
  selectEventSlice,
  selectSourceChangeSlice,
  sliceEventTypes,
} from "../src/reactor.js";

const root = fileURLToPath(new URL("../../../../", import.meta.url));
const read = (path: string) =>
  readFileSync(new URL(path, `file://${root}`), "utf8");
const event = (type: string): Event => ({
  schemaVersion: 1,
  eventId: "fixture",
  type,
  occurredAt: 0,
  actorId: "fixture",
  workstreamId: "fixture",
  payload: {},
});

test("WO-050 full pre-refactor Decision bytes and every retained semantic projection stay identical", () => {
  assert.match(
    execFileSync(
      process.execPath,
      ["scripts/reactor-identity.mjs", "--check"],
      { cwd: root, encoding: "utf8", maxBuffer: 1024 * 1024 },
    ),
    /Verified 19 complete Decision/,
  );
});

test("WO-050 slices have exclusive event ownership; WO-052 fills only the reserved source-change slot", () => {
  const walking = skeletonStateFromRuntime(initialState());
  const verification = skeletonStateFromRuntime(
    initialVerificationRuntime("fixture"),
  );
  assert.equal(walking.version, 1);
  assert.deepEqual(Object.keys(walking), [
    "version",
    "walking",
    "worker",
    "verification",
    "feedback",
    "sourceChange",
    "resident",
  ]);
  assert.deepEqual(selectSourceChangeSlice(walking), {});
  assert.equal(
    Object.hasOwn(initialState(), "sourceChange"),
    false,
    "reservation adds no serialized Decision field",
  );
  const reserved = skeletonStateFromRuntime({
    ...initialState(),
    sourceChange: {},
  });
  assert.equal(
    Object.hasOwn(reserved.walking, "sourceChange"),
    false,
    "the next source-change payload cannot become walking state",
  );
  assert.deepEqual(selectSourceChangeSlice(reserved), {});
  assert.deepEqual(sliceEventTypes.sourceChange, [
    "SourceChangeRequested",
    "SourceChangeObserved",
    "SourceChangeRefused",
  ]);
  const walkingEvents = [...sliceEventTypes.walking, ...sliceEventTypes.worker];
  assert.equal(
    new Set(walkingEvents).size,
    walkingEvents.length,
    "two slices claim the same event in walking mode",
  );
  for (const [slice, types] of Object.entries(sliceEventTypes)) {
    assert.equal(
      new Set(types).size,
      types.length,
      `${slice}: duplicate event`,
    );
    for (const type of types) {
      if (slice === "verification")
        assert.equal(selectEventSlice(verification, event(type)), slice);
      else if (slice !== "feedback")
        assert.equal(selectEventSlice(walking, event(type)), slice);
    }
  }
  const correctionLog = decodeLog(
    read("packages/skeleton/fixtures/wo050/feedback-correction.jsonl"),
  );
  const opening = correctionLog[0]!;
  const program = compileFeedbackUnits(
    (opening.payload as unknown as { program: CompiledFeedback }).program.units,
  );
  const opened = seiriReactor(
    initialState(),
    {
      ...opening,
      payload: {
        ...(opening.payload as Record<string, never>),
        program,
        workOrder: compileFeedbackAudit(
          program,
          "fixture",
          "a".repeat(40),
          "source-1",
        ),
      } as unknown as Event["payload"],
    },
    {
      now: 0,
      rngState: 17,
      predicates: {},
    },
  ).state;
  const feedback = skeletonStateFromRuntime(opened);
  for (const type of sliceEventTypes.feedback)
    assert.equal(selectEventSlice(feedback, event(type)), "feedback");
  for (const type of walkingEvents)
    assert.equal(
      selectEventSlice(feedback, event(type)),
      "feedback",
      "feedback mode owns even unrelated observations",
    );
  assert.equal(
    selectEventSlice(verification, event("FeedbackAuditOpened")),
    "feedback",
    "opening precedence is unchanged",
  );
  for (const type of ["DecisionRecorded", "UnknownFutureObservation"]) {
    assert.equal(selectEventSlice(walking, event(type)), "walking");
    assert.equal(selectEventSlice(verification, event(type)), "verification");
    assert.equal(selectEventSlice(feedback, event(type)), "feedback");
  }
  // Independently inspect actual fold cases, so deleting a registry entry cannot
  // hide an unowned implemented event, and adding a case requires declaration.
  const source = read("packages/skeleton/src/reactor.ts");
  for (const [name, end, types] of [
    [
      "const foldWalkingEvent",
      "const walkingDecision",
      sliceEventTypes.walking,
    ],
    [
      "function foldWorkerEvent",
      "export const seiriReactor",
      sliceEventTypes.worker,
    ],
    [
      "function foldVerificationEvent",
      "export const initialVerificationRuntime",
      sliceEventTypes.verification,
    ],
  ] as const) {
    const body = source.slice(source.indexOf(name), source.indexOf(end));
    for (const match of body.matchAll(/case "([^"]+)":/gu))
      assert.ok(
        (types as readonly string[]).includes(match[1]!),
        `${name}: undeclared ${match[1]}`,
      );
  }
  const cases = (start: string, end: string) =>
    [
      ...source
        .slice(source.indexOf(start), source.indexOf(end))
        .matchAll(/case "([^"]+)":/gu),
    ].map((match) => match[1]!);
  const literalBranches = (body: string) =>
    [...body.matchAll(/event\.type === "([^"]+)"/gu)].map((match) => match[1]!);
  assert.deepEqual(
    [...sliceEventTypes.walking].sort(),
    [
      ...new Set([
        ...cases("const foldWalkingEvent", "const walkingDecision"),
        ...literalBranches(
          source.slice(
            source.indexOf("const walkingDecision"),
            source.indexOf("function foldWorkerEvent"),
          ),
        ).filter((type) => !["CommandResult", "CommandRefused"].includes(type)),
        ...ARTIFACT_REFUSAL_TYPES,
      ]),
    ].sort(),
  );
  assert.deepEqual(
    [...sliceEventTypes.worker].sort(),
    cases("function foldWorkerEvent", "export const seiriReactor").sort(),
  );
  assert.deepEqual(
    [...sliceEventTypes.verification].sort(),
    cases(
      "function foldVerificationEvent",
      "export const initialVerificationRuntime",
    ).sort(),
  );
  assert.deepEqual(
    [...sliceEventTypes.feedback].sort(),
    [
      ...literalBranches(
        source.slice(source.indexOf("function feedbackDecision")),
      ),
      ...SEMANTIC_CORRECTIONS,
    ].sort(),
  );
  const revoked = seiriReactor(
    {
      ...initialVerificationRuntime("fixture"),
      verification: {
        ...verification.verification,
        authority: {
          authorityEnvelopeId: "fixture",
          allowedEffects: [],
          deniedEffects: [],
          resourceLimits: {},
          requiredEvidence: [],
          expiresAt: 100,
          revocationEventTypes: ["FixtureRevoked"],
        },
      } as unknown as import("@dotln/kernel").JsonValue,
    },
    event("FixtureRevoked"),
    { now: 0, rngState: 17, predicates: {} },
  );
  assert.deepEqual(
    skeletonStateFromRuntime(revoked.state).verification?.revocations,
    [event("FixtureRevoked")],
  );
});

test("WO-050 hosts read raw runtime fields only through exported selectors", () => {
  for (const path of [
    "scenario.ts",
    "worker-host.ts",
    "verification-host.ts",
    "feedback-selfhost.ts",
    "worker-demo.ts",
    "beacon-observe.ts",
  ]) {
    const source = read(`packages/skeleton/src/${path}`);
    assert.doesNotMatch(
      source,
      /(?:#runtime|#state|\.decision\.state)\s*(?:\?\.)?\s*(?:\.|\[)/u,
      `${path}: raw runtime field access`,
    );
    if (path !== "verification-host.ts" && path !== "feedback-selfhost.ts")
      assert.doesNotMatch(
        source,
        /driver\.state\s*(?:\.|\[)/u,
        `${path}: host bypasses a selector`,
      );
  }
  assert.match(
    read("packages/skeleton/src/verification-host.ts"),
    /get state\(\): VerificationState \{\s*return verificationStateFromRuntime\(this\.#runtime\)/u,
  );
  assert.match(
    read("packages/skeleton/src/scenario.ts"),
    /const state = walkingStateFromRuntime\(runtime\)/u,
  );
});

test("WO-050 malformed verification continuation and custom predicate context preserve the boundary", () => {
  assert.throws(
    () =>
      seiriReactor(
        { ...initialState(), verification: null },
        event("Observation"),
        { now: 0, rngState: 17, predicates: {} },
      ),
    /verification continuation:/u,
  );
  const log = decodeLog(
    runScenario(JSON.parse(read("packages/skeleton/fixtures/repo-tree.json")))
      .log,
  );
  let state = initialState(),
    observations = 0;
  const predicates = Object.fromEntries(
    Object.entries(seiriPredicates).map(([name, versions]) => [
      name,
      Object.fromEntries(
        Object.entries(versions).map(([version, predicate]) => [
          version,
          (...args: Parameters<typeof predicate>) => {
            const [context] = args;
            assert.ok(
              context.state &&
                typeof context.state === "object" &&
                "workerEpisodeId" in context.state,
            );
            observations++;
            return predicate(...args);
          },
        ]),
      ),
    ]),
  );
  for (const entry of log)
    state = seiriReactor(state, entry, {
      now: entry.occurredAt,
      rngState: state.rngState,
      predicates,
    }).state;
  assert.ok(observations > 0);
});
