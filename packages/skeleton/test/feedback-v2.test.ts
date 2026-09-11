import test from "node:test";
import assert from "node:assert/strict";
import {
  compileFeedbackUnits,
  evaluateFeedback,
  lowerToHarness,
  fnv1a64,
  type FeedbackRequest,
} from "@dotln/compiler";
import {
  contributorProgram,
  contributorProfiles,
} from "../src/loadouts/contributor.js";
import {
  personalFeedbackUnits,
  retainedFeedbackUnitsV1,
  correctionExample,
} from "../src/loadouts/feedback.js";
import { readFileSync } from "node:fs";
const runtimePaths = [
  "packages/compiler/dist/src/feedback.js",
  "packages/skeleton/dist/src/feedback-boundary.js",
  "packages/skeleton/dist/src/feedback-source-comments.js",
  "packages/skeleton/dist/src/harness-host.js",
  "packages/skeleton/dist/src/reactor.js",
];
const runtimeFiles = runtimePaths.map((path) => ({
  path,
  hash: `fnv1a64:${fnv1a64(readFileSync(new URL("../../../../" + path, import.meta.url), "utf8"))}`,
}));
const equipped = personalFeedbackUnits.filter(
  (unit) => unit.unitId !== process.env.DOTLN_FEEDBACK_ABLATE,
);
for (const unit of personalFeedbackUnits.filter((unit) => unit.version === 2))
  test(`WO-126 ${unit.unitId} version 2`, () => {
    const program = compileFeedbackUnits(equipped);
    if (unit.mechanism.kind === "prose") {
      for (const profile of contributorProfiles) {
        const bundle = lowerToHarness(
          contributorProgram(),
          program,
          contributorProgram().loadout.authorityEnvelope,
          { ...profile, runtime: { ...profile.runtime, files: runtimeFiles } },
        );
        for (const skill of bundle.files.filter((file) =>
          file.path.endsWith("SKILL.md"),
        )) {
          assert.ok(
            skill.contents.includes(unit.desiredBehavior),
            `${skill.path}: actual rule delivery`,
          );
          if (unit.unitId === "anti-oscillation")
            assert.ok(skill.contents.includes(correctionExample));
        }
        assert.ok(
          !bundle.residue.items.some((row) => row.originId === unit.unitId),
        );
      }
      assert.equal(unit.requiredEvidence.length, 0);
    } else {
      const requests: Record<string, FeedbackRequest> = {
        attribution: {
          kind: "attribution",
          message: "Codex-Session: https://example.invalid/session/fixture",
        },
        "application-evidence": {
          kind: "application-evidence",
          subject: "fixture",
          requiredChecks: ["npm test"],
          runs: [],
        },
        "output-review": {
          kind: "output-review",
          outputs: [{ path: "own.txt", hash: "current" }],
          reads: [],
        },
        "complete-scope": {
          kind: "complete-scope",
          status: "completed",
          required: ["criterion"],
          completed: [],
          remaining: ["criterion"],
        },
      };
      const request = requests[unit.trigger]!;
      const verdict = evaluateFeedback(program, request);
      assert.ok(verdict.violations.some((row) => row.unitId === unit.unitId));
      assert.equal(verdict.allowed, unit.enforcement !== "hard");
      if (unit.enforcement === "advisory") {
        const hard = compileFeedbackUnits(
          equipped
            .filter((row) => row.unitId === unit.unitId)
            .map((row) => ({ ...row, enforcement: "hard" })),
        );
        assert.equal(evaluateFeedback(hard, request).allowed, false);
      }
    }
  });

test("WO-126 retains v1 empty-output and all-attempt evidence semantics", () => {
  const legacy = compileFeedbackUnits(retainedFeedbackUnitsV1);
  const current = compileFeedbackUnits(personalFeedbackUnits);
  const empty: FeedbackRequest = {
    kind: "output-review",
    outputs: [],
    reads: [],
  };
  assert.equal(evaluateFeedback(legacy, empty).allowed, false);
  assert.equal(evaluateFeedback(current, empty).violations.length, 0);
  const run = {
    checkId: "npm test",
    subject: "fixture",
    exitCode: 0,
    executed: true,
    evidenceRef: "executed-fixture",
  };
  const attempts: FeedbackRequest = {
    kind: "application-evidence",
    subject: "fixture",
    requiredChecks: ["npm test"],
    runs: [{ ...run, exitCode: 1 }, run],
  };
  assert.equal(evaluateFeedback(legacy, attempts).allowed, false);
  assert.equal(evaluateFeedback(current, attempts).violations.length, 0);
});
