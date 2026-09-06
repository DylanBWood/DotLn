import test from "node:test";
import assert from "node:assert/strict";
import {
  compileFeedbackUnits,
  assertCompiledFeedback,
  evaluateFeedback,
  applyFeedbackCorrection,
  feedbackMaturity,
  hasAiAttribution,
  type FeedbackUnit,
  type FeedbackHandler,
} from "../src/index.js";

const source = (handler: FeedbackHandler = "attribution"): FeedbackUnit => ({
  unitId: "test-unit",
  version: 1,
  incident: {
    sourceRefs: ["docs/source.md"],
    sourceTreatment: "synthesized-from-public-lineage",
    summary: "A public incident.",
    retainedSource: "public-reference",
  },
  undesiredBehavior: "Unwanted result.",
  desiredBehavior: "Expected result.",
  scope: ["test"],
  trigger: handler,
  mechanism: {
    handler,
    version: 1,
    rationale: "The declared handler suffices.",
  },
  enforcement: "hard",
  requiredEvidence: ["test-evidence"],
  regressionFixtures: ["test-fixture"],
  conflicts: [],
  supersedes: [],
  retirementCondition: "Replacement proven.",
  nextMaturityCondition: "Observed use.",
  proseEquivalent: "Retain this constraint.",
});
test("WO-011 compiler validates the complete unit and rejects drift, duplicates, unsupported lowering and co-equipped supersession", () => {
  const input = source();
  const snapshot = structuredClone(input);
  const compiled = compileFeedbackUnits([input]);
  assert.deepEqual(compileFeedbackUnits([input]), compiled);
  assert.deepEqual(input, snapshot);
  assertCompiledFeedback(compiled);
  assert.equal(compiled.mechanisms[0]!.rung, 1);
  assert.throws(
    () => assertCompiledFeedback({ ...compiled, mechanisms: [] }),
    /drift/,
  );
  for (const field of [
    "sourceRefs",
    "summary",
    "sourceTreatment",
    "retainedSource",
  ] as const) {
    const broken = structuredClone(input);
    delete (broken.incident as unknown as Record<string, unknown>)[field];
    assert.throws(() => compileFeedbackUnits([broken]));
  }
  for (const field of [
    "undesiredBehavior",
    "desiredBehavior",
    "scope",
    "trigger",
    "mechanism",
    "enforcement",
    "requiredEvidence",
    "regressionFixtures",
    "conflicts",
    "supersedes",
    "retirementCondition",
  ] as const) {
    const broken = structuredClone(input);
    delete (broken as unknown as Record<string, unknown>)[field];
    assert.throws(() => compileFeedbackUnits([broken]));
  }
  assert.throws(() => compileFeedbackUnits([input, input]), /duplicate/);
  assert.throws(() => compileFeedbackUnits(Array(11).fill(input)), /bounded/);
  assert.throws(
    () => compileFeedbackUnits([{ ...input, supersedes: [input.unitId] }]),
    /superseded/,
  );
  assert.throws(
    () =>
      compileFeedbackUnits([
        {
          ...input,
          incident: {
            ...input.incident,
            sourceRefs: ["docs/intake/private.md"],
          },
        },
      ]),
    /public source/,
  );
  assert.throws(
    () =>
      compileFeedbackUnits([
        {
          ...input,
          mechanism: { ...input.mechanism, handler: "cleanup-scope" },
        },
      ]),
    /unsupported/,
  );
});
test("WO-011 optional doctrine remains inactive when unequipped and advisory cannot become a hard denial", () => {
  const request = {
    kind: "attribution" as const,
    message: "Co-authored-by: Claude <noreply@anthropic.com>",
  };
  assert.equal(
    evaluateFeedback(compileFeedbackUnits([]), request).allowed,
    true,
  );
  const advisory = evaluateFeedback(
    compileFeedbackUnits([{ ...source(), enforcement: "advisory" }]),
    request,
  );
  assert.equal(advisory.allowed, true);
  assert.equal(advisory.violations.length, 1);
});
test("WO-011 exact attribution predicate permits subjects and human coauthors but catches AI trailer variants", () => {
  for (const message of [
    "Improve Claude CLI tests",
    "Co-authored-by: Human <human@example.invalid>",
    "Document Generated with AI examples",
  ])
    assert.equal(hasAiAttribution(message), false, message);
  for (const message of [
    "Generated with [Claude Code](https://example.invalid)",
    "Co-authored-by: Fable <noreply@anthropic.com>",
    "CO-AUTHORED-BY: Codex <codex@example.invalid>",
  ])
    assert.equal(hasAiAttribution(message), true, message);
});
test("WO-011 correction is pure, typed, idempotent, and monotonically tightens every semantic correction kind", () => {
  const program = compileFeedbackUnits([source("semantic-correction")]);
  const state = Object.freeze({
    allowedEffects: Object.freeze(["read", "delete"]),
    destructiveEffects: ["delete"],
    scopeExpansionAllowed: true,
    preserveEvidence: false,
    diagnosisRequired: false,
    corrections: [],
  });
  const now = Date.now;
  const random = Math.random;
  Date.now = Math.random = () => {
    throw new Error("ambient input");
  };
  try {
    for (const type of [
      "OperatorCorrectionReceived",
      "OperatorReportsRegression",
      "OperatorRejectsUnsupportedAssumption",
      "OperatorReportsRepeatedFailure",
    ]) {
      const result = applyFeedbackCorrection(program, state, {
        type,
        eventId: type,
      });
      assert.deepEqual(result.allowedEffects, ["read"]);
      assert.equal(result.diagnosisRequired, true);
      assert.deepEqual(
        applyFeedbackCorrection(program, result, { type, eventId: type }),
        result,
      );
    }
    assert.equal(
      applyFeedbackCorrection(program, state, {
        type: "OrdinaryMessage",
        eventId: "1",
      }),
      state,
    );
    assert.equal(
      applyFeedbackCorrection(compileFeedbackUnits([]), state, {
        type: "OperatorCorrectionReceived",
        eventId: "1",
      }),
      state,
    );
  } finally {
    Date.now = now;
    Math.random = random;
  }
});
test("WO-011 maturity separates controlled fixtures from live use and refuses invented or duplicate observations", () => {
  const program = compileFeedbackUnits([source()]);
  const record = {
    unitId: "test-unit",
    episodeId: "fixture-1",
    source: "fixture" as const,
    activated: true,
    prevented: true,
    falseActivation: false,
    overridden: false,
  };
  const stats = feedbackMaturity(program, [record])[0]!;
  assert.equal(stats.awakened, false);
  assert.deepEqual(stats["fixture"], {
    eligibleEpisodes: 1,
    activations: 1,
    incidentsPrevented: 1,
    falseActivations: 0,
    overrides: 0,
  });
  assert.deepEqual(stats["live"], {
    eligibleEpisodes: 0,
    activations: 0,
    incidentsPrevented: 0,
    falseActivations: 0,
    overrides: 0,
  });
  assert.throws(
    () => feedbackMaturity(program, [record, record]),
    /observation/,
  );
  assert.throws(
    () => feedbackMaturity(program, [{ ...record, falseActivation: true }]),
    /observation/,
  );
});
