import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import {
  chmodSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { applyFeedbackCorrection, compileFeedbackUnits } from "@dotln/compiler";
import {
  retainedFeedbackUnitsV1 as personalFeedbackUnits,
  feedbackClaudeSettings,
} from "../src/loadouts/feedback.js";
import {
  feedbackBoundary,
  feedbackContentHash,
  feedbackReadOutput,
  feedbackWriterFacts,
  type FeedbackBoundaryRequest,
} from "../src/feedback-boundary.js";

// Test-only ablation. Production compiler/host/hook never reads this variable.
const ablate = process.env.DOTLN_FEEDBACK_ABLATE;
if (ablate && !personalFeedbackUnits.some((unit) => unit.unitId === ablate))
  throw new Error("unknown ablation unit");
const program = compileFeedbackUnits(
  personalFeedbackUnits.filter((unit) => unit.unitId !== ablate),
);
const effect = (request: FeedbackBoundaryRequest) =>
  feedbackBoundary(program, request, () => "effect-executed");
const temporary = (body: (directory: string) => void) => {
  const directory = realpathSync(
    mkdtempSync(join(tmpdir(), "dotln-feedback-fixture-")),
  );
  try {
    body(directory);
  } finally {
    rmSync(directory, { recursive: true });
  }
};
const git = (cwd: string, ...args: string[]) =>
  execFileSync("git", args, {
    cwd,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    timeout: 5000,
  }).trim();
const commitArgs = [
  "-c",
  "user.name=Fixture",
  "-c",
  "user.email=fixture@example.invalid",
  "-c",
  "commit.gpgsign=false",
  "commit",
  "--quiet",
  "--allow-empty",
  "--file",
];

test("WO-011 regression anti-oscillation", () => {
  const prior = {
    kind: "decision-lineage" as const,
    proposedApproach: "verbose-title",
    requiredOutcomes: ["specific", "concise"],
    preservedOutcomes: ["specific", "concise"],
    rejected: [
      { approach: "verbose-title", reason: "obscures the change" },
      { approach: "eight-word-quota", reason: "unsupported constraint" },
    ],
    explicitSupersessions: [],
    proposedHardConstraints: [],
    explicitHardConstraints: [],
  };
  assert.throws(() => effect(prior), /rejected approach/);
  assert.throws(
    () =>
      effect({
        ...prior,
        proposedApproach: "useful-title",
        proposedHardConstraints: ["eight-word-quota"],
      }),
    /hard constraint/,
  );
  assert.throws(
    () =>
      effect({
        ...prior,
        proposedApproach: "terse-vague-title",
        preservedOutcomes: ["concise"],
      }),
    /outcome lost/,
  );
  assert.equal(
    effect({ ...prior, proposedApproach: "useful-title" }),
    "effect-executed",
  );
  assert.equal(
    effect({ ...prior, explicitSupersessions: ["verbose-title"] }),
    "effect-executed",
  );
  const organization = {
    ...prior,
    proposedApproach: "mandatory-cleanup",
    rejected: [],
    requiredOutcomes: ["maintainable", "no-change-if-healthy"],
    preservedOutcomes: ["maintainable"],
  };
  assert.throws(() => effect(organization), /outcome lost/);
  assert.equal(
    effect({
      ...organization,
      proposedApproach: "leave-healthy-structure",
      preservedOutcomes: organization.requiredOutcomes,
    }),
    "effect-executed",
  );
});
test("WO-011 regression correctness-over-sycophancy", () => {
  const request = {
    kind: "evidence-judgment" as const,
    subject: "current",
    claimed: "pass" as const,
    operatorPreference: "pass" as const,
    witnesses: [
      {
        subject: "current",
        outcome: "fail" as const,
        source: "independent" as const,
        evidenceRef: "witness:failing-assertion",
      },
    ],
  };
  assert.throws(() => effect(request), /independent evidence/);
  assert.equal(effect({ ...request, claimed: "fail" }), "effect-executed");
  assert.throws(
    () =>
      effect({
        ...request,
        witnesses: [
          { ...request.witnesses[0]!, outcome: "pass", source: "implementer" },
        ],
      }),
    /independent evidence/,
  );
  assert.throws(
    () =>
      effect({
        ...request,
        witnesses: [{ ...request.witnesses[0]!, subject: "old" }],
      }),
    /independent evidence/,
  );
});
test("WO-011 regression fail-conservative-correction", () => {
  const before = {
    allowedEffects: ["repo.read", "repo.delete"],
    destructiveEffects: ["repo.delete"],
    scopeExpansionAllowed: true,
    preserveEvidence: false,
    diagnosisRequired: false,
    corrections: [],
  };
  const after = applyFeedbackCorrection(program, before, {
    type: "OperatorReportsRegression",
    eventId: "correction-1",
  });
  assert.deepEqual(after.allowedEffects, ["repo.read"]);
  assert.equal(after.scopeExpansionAllowed, false);
  assert.equal(after.preserveEvidence, true);
  assert.equal(after.diagnosisRequired, true);
  assert.deepEqual(
    applyFeedbackCorrection(program, before, {
      type: "OrdinaryMessageWithProfanity",
      eventId: "ordinary",
    }),
    before,
  );
  // Even an upstream false-positive classification cannot grant or restore anything.
  const falsePositive = applyFeedbackCorrection(program, after, {
    type: "OperatorCorrectionReceived",
    eventId: "misclassified",
  });
  assert.deepEqual(falsePositive.allowedEffects, after.allowedEffects);
  assert.equal(falsePositive.scopeExpansionAllowed, false);
  assert.deepEqual(
    applyFeedbackCorrection(program, after, {
      type: "OperatorReportsRegression",
      eventId: "correction-1",
    }),
    after,
  );
});
test("WO-011 regression verify-app-before-done", () => {
  const checked = spawnSync(
    process.execPath,
    ["-e", "require('node:assert/strict').equal(2 + 2, 4)"],
    { encoding: "utf8" },
  );
  assert.equal(checked.status, 0);
  const request = {
    kind: "application-evidence" as const,
    subject: "current",
    requiredChecks: ["application-behavior"],
    runs: [],
  };
  assert.throws(() => effect(request), /application check/);
  const run = {
    checkId: "application-behavior",
    subject: "current",
    exitCode: checked.status!,
    executed: true,
    evidenceRef: "subprocess:assertion",
  };
  assert.equal(effect({ ...request, runs: [run] }), "effect-executed");
  assert.throws(
    () => effect({ ...request, runs: [{ ...run, subject: "old" }] }),
    /application check/,
  );
  assert.throws(
    () => effect({ ...request, runs: [{ ...run, executed: false }] }),
    /application check/,
  );
  assert.throws(
    () => effect({ ...request, runs: [run, { ...run, exitCode: 1 }] }),
    /application check/,
  );
});
test("WO-011 regression no-attribution", () =>
  temporary((directory) => {
    git(directory, "init", "--quiet", "--initial-branch=fixture");
    assert.equal(
      realpathSync(git(directory, "rev-parse", "--show-toplevel")),
      directory,
    );
    assert.deepEqual(feedbackClaudeSettings.attribution, {
      commit: "",
      pr: "",
      sessionUrl: false,
    });
    if (program.mechanisms.some((item) => item.handler === "attribution")) {
      const hook = join(directory, ".git/hooks/commit-msg");
      const adapter = fileURLToPath(
        new URL("../../../../scripts/feedback-commit-msg.mjs", import.meta.url),
      );
      // A JS launcher keeps arbitrary fixture paths out of shell interpolation.
      writeFileSync(
        hook,
        `#!${process.execPath}\nconst { spawnSync } = require('node:child_process');\nconst r = spawnSync(${JSON.stringify(process.execPath)}, [${JSON.stringify(adapter)}, process.argv[2]], {stdio:'inherit'}); process.exit(r.status ?? 1);\n`,
      );
      chmodSync(hook, 0o700);
    }
    const message = join(directory, "message.txt");
    writeFileSync(
      message,
      "Implement a useful change\n\nCo-Authored-By: Claude <noreply@anthropic.com>\n",
    );
    const refused = spawnSync("git", [...commitArgs, message], {
      cwd: directory,
      encoding: "utf8",
    });
    assert.equal(
      refused.status,
      1,
      "AI-attributed commit must be refused by the real Git hook",
    );
    assert.match(refused.stderr, /Commit refused/);
    writeFileSync(
      message,
      "Add Codex transport support\n\nCo-authored-by: Human Contributor <human@example.invalid>\n",
    );
    assert.equal(
      spawnSync("git", [...commitArgs, message], {
        cwd: directory,
        encoding: "utf8",
      }).status,
      0,
    );
    assert.match(
      git(directory, "log", "-1", "--format=%B"),
      /Human Contributor/,
    );
  }));
test("WO-011 regression concurrent-work-requires-worktrees", () =>
  temporary((directory) => {
    git(directory, "init", "--quiet", "--initial-branch=fixture");
    const message = join(directory, "message");
    writeFileSync(message, "Fixture baseline\n");
    git(directory, ...commitArgs, message);
    const single = [{ actorId: "writer-a", worktree: directory }];
    assert.equal(
      effect(feedbackWriterFacts(directory, "writer-a", single)),
      "effect-executed",
    );
    assert.throws(
      () =>
        effect(
          feedbackWriterFacts(directory, "writer-a", [
            ...single,
            { actorId: "writer-b", worktree: directory },
          ]),
        ),
      /exclusive worktree/,
    );
    git(directory, "branch", "-m", "main");
    assert.throws(
      () => effect(feedbackWriterFacts(directory, "writer-a", single)),
      /exclusive worktree/,
    );
  }));
test("WO-011 regression no-lint-type-disables-as-fixes", () => {
  const before = "export const value: number = 1;\n";
  for (const directive of [
    "// @ts-ignore",
    "// @ts-expect-error",
    "/* eslint-disable */",
    "// @ts-nocheck",
    "// tslint:disable",
  ])
    assert.throws(
      () =>
        effect({
          kind: "suppression-diff",
          files: [
            {
              path: "src/value.ts",
              before,
              after: `${directive}\nexport const value: number = 'wrong';\n`,
            },
          ],
        }),
      /suppression/,
    );
  const historical =
    "// @ts-expect-error retained historical fixture\nconst old: number = '';\n";
  assert.equal(
    effect({
      kind: "suppression-diff",
      files: [
        {
          path: "src/value.ts",
          before: historical,
          after: `${historical}${before}`,
        },
      ],
    }),
    "effect-executed",
  );
  for (const after of [
    "const matcher = /'/;\n// @ts-ignore\nconst value: number = false;\n",
    "const text = `value ${(() => {\n// @ts-ignore\nreturn false as number;\n})()}`;\n",
    "const text = <div>{/* eslint-disable */ value}</div>;\n",
    "const value = 1; // eslint-disable-line\n",
  ])
    assert.throws(
      () =>
        effect({
          kind: "suppression-diff",
          files: [{ path: "src/value.tsx", before, after }],
        }),
      /suppression/,
    );
  for (const after of [
    "const example = `\n// @ts-ignore\n`;\n",
    "const example = <div>// @ts-ignore</div>;\n",
    "const matcher = /[/][/] @ts-ignore/;\n",
  ])
    assert.equal(
      effect({
        kind: "suppression-diff",
        files: [{ path: "src/value.tsx", before, after }],
      }),
      "effect-executed",
    );
  assert.equal(
    effect({
      kind: "suppression-diff",
      files: [
        {
          path: "src/value.ts",
          before,
          after: `${before}const example = '// @ts-ignore';\n`,
        },
      ],
    }),
    "effect-executed",
  );
});
test("WO-011 regression read-your-own-output", () =>
  temporary((directory) => {
    const path = join(directory, "result.txt");
    writeFileSync(path, "first result\n");
    const read = feedbackReadOutput(path, "host-read:1");
    assert.equal(read.contents.toString(), "first result\n");
    const outputs = () => [
      { path, hash: feedbackContentHash(readFileSync(path)) },
    ];
    assert.throws(
      () => effect({ kind: "output-review", outputs: outputs(), reads: [] }),
      /not read/,
    );
    assert.equal(
      effect({
        kind: "output-review",
        outputs: outputs(),
        reads: [read.receipt],
      }),
      "effect-executed",
    );
    writeFileSync(path, "changed result\n");
    assert.throws(
      () =>
        effect({
          kind: "output-review",
          outputs: outputs(),
          reads: [read.receipt],
        }),
      /not read/,
    );
  }));
test("WO-011 regression no-partial-completion", () => {
  const request = {
    kind: "complete-scope" as const,
    required: ["implementation", "evidence"],
    completed: ["implementation"],
    remaining: [],
    status: "completed",
  };
  assert.throws(() => effect(request), /incomplete/);
  assert.throws(
    () =>
      effect({
        ...request,
        completed: request.required,
        remaining: ["unresolved-source"],
      }),
    /incomplete/,
  );
  assert.equal(
    effect({ ...request, completed: request.required }),
    "effect-executed",
  );
});
test("WO-011 regression bounded-boy-scout-cleanup", () => {
  const request = {
    kind: "cleanup-scope" as const,
    path: "src/touched.ts",
    allowedPaths: ["src/touched.ts"],
    adjacent: true,
    unambiguous: true,
    lowRisk: true,
    obscuresDiff: false,
    retainedEvidence: false,
    requiredChecks: ["affected-behavior"],
    coveredChecks: ["affected-behavior"],
    assessmentRef: "host-review:scope",
  };
  assert.throws(
    () =>
      effect({
        ...request,
        path: "docs/verifications/old.md",
        retainedEvidence: true,
      }),
    /separate candidate/,
  );
  assert.throws(
    () => effect({ ...request, coveredChecks: [] }),
    /separate candidate/,
  );
  assert.throws(
    () => effect({ ...request, unambiguous: false }),
    /separate candidate/,
  );
  assert.throws(
    () => effect({ ...request, obscuresDiff: true }),
    /separate candidate/,
  );
  assert.equal(effect(request), "effect-executed");
});
