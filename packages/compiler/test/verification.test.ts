import test from "node:test";
import assert from "node:assert/strict";
import {
  affectedVerificationCriteria,
  assertVerificationTask,
  changedVerificationSurfaces,
  compileVerificationTask,
  type AcceptanceCriterion,
  type VerificationSubject,
} from "../src/index.js";

const criteria: readonly AcceptanceCriterion[] = [
  {
    criterionId: "state",
    description: "The stored count is present.",
    claimType: "state",
    evidenceSource: "synthetic-fixture",
    codeSurfaces: ["state.json"],
    requiredChecks: ["count-read"],
  },
  {
    criterionId: "behavior",
    description: "The count changes after an input.",
    claimType: "behavior",
    evidenceSource: "live",
    codeSurfaces: ["state.json", "increment.ts"],
    requiredChecks: ["increment-run"],
  },
  {
    criterionId: "other",
    description: "The unrelated descriptor remains.",
    claimType: "state",
    evidenceSource: "synthetic-fixture",
    codeSurfaces: ["README.txt"],
    requiredChecks: ["descriptor"],
  },
];
const subject: VerificationSubject = {
  repo: "public-fixture",
  baseCommit: "base",
  revision: "candidate",
  diff: "original source diff",
  files: [
    { path: "state.json", contents: "{}" },
    { path: "increment.ts", contents: "original source" },
    { path: "README.txt", contents: "descriptor" },
  ],
  evidence: [],
};
const freeze = <T>(value: T): T => {
  if (value !== null && typeof value === "object") {
    Object.freeze(value);
    Object.values(value).forEach(freeze);
  }
  return value;
};

test("WO-010 AC2 verifier compilation positively selects nested context, is pure and cannot retain implementer prose", () => {
  const marker = "IMPLEMENTER_NARRATIVE_SENTINEL";
  const input = freeze({
    ...subject,
    narrative: marker,
    transcript: [marker],
    result: { summary: marker },
    files: subject.files.map((file) => ({ ...file, narrative: marker })),
  });
  const dirtyCriteria = freeze(
    criteria.map((criterion) => ({ ...criterion, implementerResult: marker })),
  );
  const before = JSON.stringify({ input, dirtyCriteria });
  const clock = Date.now,
    random = Math.random;
  Date.now = () => {
    throw new Error("ambient clock");
  };
  Math.random = () => {
    throw new Error("ambient randomness");
  };
  try {
    const a = compileVerificationTask("test", dirtyCriteria, input);
    const b = compileVerificationTask("test", dirtyCriteria, input);
    assert.deepEqual(a, b);
    assert.doesNotMatch(JSON.stringify(a), new RegExp(marker));
    assert.deepEqual(
      a.workOrder.acceptanceCriteria,
      criteria.map(
        (criterion) => `${criterion.criterionId}: ${criterion.description}`,
      ),
    );
    assert.equal(a.subject.diff, subject.diff);
    assert.deepEqual(a.subject.files, subject.files);
    assert.deepEqual(a.workOrder.allowedOperations, ["verification.evaluate"]);
    assertVerificationTask(a);
    assert.throws(
      () =>
        assertVerificationTask({
          ...a,
          subject: { ...a.subject, diff: "changed after compilation" },
        }),
      /capsule drift/u,
    );
    assert.equal(JSON.stringify({ input, dirtyCriteria }), before);
  } finally {
    Date.now = clock;
    Math.random = random;
  }
});

test("WO-010 AC3 only complete blocking findings compile focused repair WorkOrders", () => {
  const finding = {
    findingId: "F-1",
    criterionId: "behavior",
    severity: "blocking" as const,
    observed: "count unchanged",
    expected: "count increments",
    reproductionSteps: ["Submit an increment."],
    evidenceRefs: ["run-1"],
    likelySurface: ["increment.ts"],
  };
  const task = compileVerificationTask(
    "repair",
    [criteria[1]!],
    subject,
    finding,
  );
  assert.equal(task.role, "repairer");
  assert.deepEqual(task.finding, finding);
  assert.deepEqual(task.workOrder.allowedOperations, ["repair.propose"]);
  for (const invalid of [
    { ...finding, severity: "minor" as const },
    { ...finding, observed: "" },
    { ...finding, reproductionSteps: [] },
    { ...finding, evidenceRefs: [] },
    { ...finding, likelySurface: ["../outside"] },
    { ...finding, likelySurface: ["README.txt"] },
  ])
    assert.throws(
      () => compileVerificationTask("repair", [criteria[1]!], subject, invalid),
      /verification contract/u,
    );
});

test("WO-010 AC4 repair radius follows changed dependency surfaces and fails closed on unknown surfaces", () => {
  assert.deepEqual(
    changedVerificationSurfaces(subject, { ...subject, revision: "new-id" }),
    [],
  );
  const changed = changedVerificationSurfaces(subject, {
    ...subject,
    files: subject.files.map((file) =>
      file.path === "state.json" ? { ...file, contents: '{"count":1}' } : file,
    ),
  });
  assert.deepEqual(changed, ["state.json"]);
  assert.deepEqual(affectedVerificationCriteria(criteria, changed), [
    "state",
    "behavior",
  ]);
  assert.deepEqual(
    affectedVerificationCriteria(criteria, ["unmodeled-dependency.ts"]),
    ["state", "behavior", "other"],
  );
  assert.deepEqual(affectedVerificationCriteria(criteria, []), []);
});
