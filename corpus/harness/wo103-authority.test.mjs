import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import * as kernel from "../../packages/kernel/dist/src/index.js";
import * as audit from "../../packages/skeleton/dist/src/audit.js";
import {
  FACTORS,
  SEED,
  defaultDimensions,
  dimensionAt,
  totalCells,
  inputFor,
  materialize,
  oracle,
  runCell,
  sweepAuthority,
  referenceCommandId,
} from "./wo103-authority-lib.mjs";
import { auditCarryIns, ROOT } from "./generate-authority-corpus.mjs";
const manifest = JSON.parse(
  readFileSync(`${ROOT}/corpus/manifests/WO-103.json`, "utf8"),
);
const planted = (overrides) =>
  inputFor({ ...defaultDimensions(), ...overrides });

test("WO-103 complete authority factorial: exact results, traces, IDs, limits, calls and never-throws", () => {
  const result = sweepAuthority(kernel);
  assert.equal(result.count, totalCells());
  assert.equal(result.count, manifest.authority.expectedCells);
  assert.equal(result.count, 2694384);
  assert.equal(result.sha256, manifest.authority.expectedStreamSha256);
  assert.deepEqual(result.winners, manifest.authority.winners);
  assert.equal(result.calls, manifest.authority.observedPredicateCalls);
  // Any divergence must be explicitly numbered with reproducible golden examples.
  if (result.findingExamples.length) {
    assert.ok(manifest.findingNumbers.includes("WO-103-F004"));
    assert.equal(
      result.findingCounts.divergence,
      manifest.authority.divergences,
    );
    const findings = readFileSync(
      `${ROOT}/corpus/manifests/findings-WO-103.md`,
      "utf8",
    );
    for (const example of result.findingExamples)
      assert.ok(findings.includes(example.cellId));
  } else assert.equal(manifest.authority.divergences, 0);
});

test("WO-103 planted independent precedence winners and literal trace anchors", () => {
  const cases = [
    [
      {
        effect: "non-string",
        clock: "after",
        environment: "missing-env",
        conditions: 1,
      },
      "effect is not a string",
    ],
    [
      { clock: "at", conditions: 1, environment: "missing-env" },
      "authority expired",
    ],
    [
      {
        conditions: 1,
        environment: "unknown",
        eventTypes: 1,
        events: 1,
        typeMatch: true,
      },
      "cannot evaluate revocation",
    ],
    [
      { eventTypes: 1, events: 1, typeMatch: true, patterns: "deny-star" },
      "authority revoked",
    ],
    [
      { patterns: "deny-prefix", evidence: "empty", resource: "zero" },
      "effect denied",
    ],
    [
      { patterns: "allow-miss", evidence: "empty", resource: "zero" },
      "effect not allowed",
    ],
    [{ evidence: "subset", resource: "zero" }, "required evidence missing"],
    [{ resource: "zero" }, "resource limit exceeded"],
  ];
  for (const [d, reason] of cases) {
    const input = planted(d),
      expected = oracle(input),
      run = runCell(kernel, input);
    assert.equal(expected.result.refusal.payload.reason, reason);
    assert.deepEqual(expected.result.trace.branchPath, ["refused", reason]);
    assert.equal(run.mismatch, false);
  }
  const tailDeny = planted({});
  tailDeny.envelope.deniedEffects = ["other", "a*"];
  const tailRun = runCell(kernel, tailDeny);
  assert.equal(tailRun.mismatch, false);
  assert.equal(tailRun.observed.refusal.payload.reason, "effect denied");
  const grant = oracle(planted({ resource: "one" })).result;
  assert.equal(grant.command.commandId, "cmd_c835adb882f3d562");
  assert.deepEqual(grant.authority.resourceLimits, { units: 0 });
  assert.deepEqual(grant.trace, {
    reactorId: "authority-guard",
    reactorVersion: "1",
    branchPath: ["authorized", "act"],
    envInputs: [
      "now:9",
      "authorityEnvelope:auth",
      "evidence",
      "revocations",
      "resource:units",
    ],
    cadenceEvaluations: [],
  });
});

test("WO-103 every condition sees every event; early true cannot mask late error; unknown preflight", () => {
  const complete = runCell(
    kernel,
    planted({
      conditions: 2,
      events: 2,
      semanticMatch: "early",
      environment: "policy",
    }),
  );
  assert.equal(complete.mismatch, false);
  assert.deepEqual(
    complete.calls.map((c) => [c.condition, c.eventId]),
    [
      [0, "rev-0"],
      [0, "rev-1"],
      [1, "rev-0"],
      [1, "rev-1"],
    ],
  );
  for (const c of complete.calls) {
    assert.equal(c.now, 9);
    assert.equal(c.state.marker, SEED);
    assert.equal(c.policy.tag, SEED);
    assert.equal(c.rngState, c.params.expectedRng);
  }
  const broken = runCell(
    kernel,
    planted({
      conditions: 2,
      events: 2,
      semanticMatch: "early",
      environment: "throw-late",
    }),
  );
  assert.equal(broken.calls.length, 4);
  assert.equal(
    broken.observed.refusal.payload.reason,
    "cannot evaluate revocation",
  );
  assert.equal(broken.mismatch, false);
  const unknown = runCell(
    kernel,
    planted({ conditions: 2, events: 0, environment: "unknown" }),
  );
  assert.equal(unknown.calls.length, 0);
  assert.equal(
    unknown.observed.refusal.payload.reason,
    "cannot evaluate revocation",
  );
  const noCalls = runCell(
    kernel,
    planted({ conditions: 2, events: 0, environment: "throw-late" }),
  );
  assert.equal(noCalls.observed.authorized, true);
  for (const clock of ["at", "after"]) {
    const skipped = runCell(
      kernel,
      planted({ clock, conditions: 2, events: 2, environment: "throw-early" }),
    );
    assert.equal(skipped.calls.length, 0);
    assert.deepEqual(skipped.observed.trace.envInputs, [
      "now",
      "authorityEnvelope",
      "evidence",
      "revocations",
    ]);
  }
});

test("WO-103 forged runtime effects refuse structurally, terminal-star matching, namespace IDs", () => {
  for (const effect of [null, true, {}, [], undefined]) {
    const input = planted({});
    if (effect === undefined) delete input.intent.effect;
    else input.intent.effect = effect;
    const run = runCell(kernel, input);
    assert.equal(run.observed.refusal.payload.reason, "effect is not a string");
    assert.equal(run.mismatch, false);
  }
  for (const [pattern, effect, allowed] of [
    ["a*", "a", true],
    ["*", "", true],
    ["a*b", "axxb", false],
    ["a**", "a*tail", true],
    ["a**", "abc", false],
  ]) {
    const input = planted({});
    input.envelope.allowedEffects = [pattern];
    input.intent.effect = effect;
    const run = runCell(kernel, input);
    assert.equal(run.observed.authorized, allowed);
    assert.equal(run.mismatch, false);
  }
  for (const episodeId of ["ep", "", undefined]) {
    const input = planted({});
    if (episodeId === undefined) delete input.context.episodeId;
    else input.context.episodeId = episodeId;
    const run = runCell(kernel, input);
    assert.equal(run.mismatch, false);
    assert.equal(
      run.observed.command.commandId,
      episodeId === "ep" ? "cmd_c835adb882f3d562" : "cmd_030cb49f8b1f142c",
    );
  }
  assert.equal(
    referenceCommandId({
      workstreamId: "ws",
      decisionIndex: 3,
      intentIndex: 0,
    }),
    "cmd_030cb49f8b1f142c",
  );
});

test("WO-103 consumed envelope threading exhausts exactly at every declared limit/key", () => {
  for (const resource of manifest.auxiliary.resourceKeys)
    for (const limit of manifest.auxiliary.threadingLimits) {
      const input = planted({ resource: "one" });
      input.intent.resource = resource;
      input.envelope.resourceLimits = Object.fromEntries([[resource, limit]]);
      for (let consumed = 0; consumed <= limit; consumed++) {
        input.context.intentIndex = consumed;
        const runtime = materialize(input);
        const before = structuredClone(runtime.envelope);
        kernel.authorize(runtime.intent, runtime.envelope, runtime.context);
        assert.deepEqual(
          runtime.envelope,
          before,
          "kernel leaves supplied envelope unchanged",
        );
        const run = runCell(kernel, input);
        assert.equal(run.mismatch, false);
        assert.equal(run.observed.authorized, consumed < limit);
        if (run.observed.authorized) {
          assert.equal(
            run.observed.authority.resourceLimits[resource],
            limit - consumed - 1,
          );
          input.envelope = run.observed.authority;
        } else
          assert.equal(
            run.observed.refusal.payload.reason,
            "resource limit exceeded",
          );
      }
    }
});

test("WO-103 missing-input partial traces reproduce both numbered audit carry-ins", () => {
  const findings = auditCarryIns(kernel, audit);
  for (const f of findings) {
    assert.equal(
      f.expected.refusal.payload.reason,
      "cannot evaluate revocation",
    );
    assert.equal(f.traceLinked, false);
    assert.deepEqual(f.auditRecords[0].eventIds, [f.events[0].eventId]);
    assert.ok(manifest.findingNumbers.includes(f.number));
  }
  assert.deepEqual(findings[0].expected.trace.envInputs.slice(4), [
    `rngState:${findings[0].input.environment.rngState}`,
    "predicates",
  ]);
  assert.deepEqual(findings[1].expected.trace.envInputs.slice(4), ["state"]);
  // Positive audit control: a complete semantic refusal DOES link its trace.
  const input = planted({ conditions: 1, events: 1, semanticMatch: "early" });
  const result = runCell(kernel, input).observed;
  const refused = { ...result.refusal, eventId: "complete-refusal" };
  const decision = {
    ...findings[0].events[1],
    eventId: "complete-trace",
    payload: { trace: result.trace },
  };
  assert.deepEqual(audit.deriveAuditRecords([refused, decision])[0].eventIds, [
    "complete-refusal",
    "complete-trace",
  ]);
});

test("WO-103 mixed-radix labels match independently traversed Cartesian prefixes and bounds", () => {
  assert.deepEqual(dimensionAt(0), defaultDimensions());
  assert.deepEqual(
    dimensionAt(totalCells() - 1),
    Object.fromEntries(
      Object.entries(FACTORS).map(([k, levels]) => [k, levels.at(-1)]),
    ),
  );
  assert.throws(() => dimensionAt(-1));
  assert.throws(() => dimensionAt(totalCells()));
  for (let index = 0; index < totalCells(); index += 8191) {
    let encoded = 0;
    for (const [key, levels] of Object.entries(FACTORS))
      encoded =
        encoded * levels.length + levels.indexOf(dimensionAt(index)[key]);
    assert.equal(encoded, index);
  }
});
