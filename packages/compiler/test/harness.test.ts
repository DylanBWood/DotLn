import test from "node:test";
import assert from "node:assert/strict";
import {
  compileFeedbackUnits,
  compileLoadout,
  lowerToHarness,
  mergeHarnessFragments,
  requireCompiled,
  seiriEnvironment,
  seiriLoadout,
  semanticHash,
  verifyHarnessBundle,
  type FeedbackHandler,
  type FeedbackUnit,
  type HarnessProfile,
  type HarnessProgram,
} from "../src/index.js";

const unit = (trigger: FeedbackHandler): FeedbackUnit => ({
  unitId: `fixture-${trigger}`,
  version: 1,
  incident: {
    sourceRefs: ["docs/public.md"],
    sourceTreatment: "synthesized-from-public-lineage",
    summary: "Synthetic incident",
    retainedSource: "public-reference",
  },
  undesiredBehavior: "Unwanted result",
  desiredBehavior: "Required result",
  scope: ["fixture"],
  trigger,
  mechanism: { handler: trigger, version: 1, rationale: "Declared mechanism" },
  enforcement: "hard",
  requiredEvidence: ["fixture"],
  regressionFixtures: ["fixture"],
  conflicts: [],
  supersedes: [],
  retirementCondition: "Replaced with evidence",
  nextMaturityCondition: "Observed outside fixtures",
  proseEquivalent: "Keep the required result",
});
const available = { available: true, evidence: "docs/probe.md#observed" };
const profile: HarnessProfile = {
  profileId: "fixture-claude",
  harness: "claude-code",
  observedVersion: "2.1.263",
  events: {
    PreToolUse: available,
    PostToolUse: available,
    Stop: available,
    UserPromptSubmit: available,
  },
  skills: { ...available, root: ".claude/skills" },
  settings: {
    ...available,
    path: ".claude/settings.json",
    deny: true,
    allow: false,
  },
  instruction: { ...available, path: "CLAUDE.md" },
  refusal: "claude-command-json-v1",
  runtime: {
    skeletonVersion: "0.13.0",
    boundaryContract: "feedback-v1",
    files: [
      "packages/compiler/dist/src/feedback.js",
      "packages/skeleton/dist/src/feedback-boundary.js",
      "packages/skeleton/dist/src/feedback-source-comments.js",
      "packages/skeleton/dist/src/harness-host.js",
      "packages/skeleton/dist/src/reactor.js",
    ].map((path) => ({ path, hash: "fnv1a64:0000000000000000" })),
  },
};
const program: HarnessProgram = {
  contractVersion: "harness-v1",
  loadout: requireCompiled(compileLoadout(seiriLoadout, seiriEnvironment())),
  roles: [
    {
      facetId: "fixture.executor",
      name: "executor",
      description: "Execute the synthetic phase",
      intents: ["resume: next"],
      procedure: [
        "Read: `docs/fixture.md`",
        "Produce the phase's artifact and its executable evidence.",
      ],
      feedbackHandlers: [
        "attribution",
        "suppression-diff",
        "semantic-correction",
      ],
    },
  ],
  facets: [],
  correctionToken: null,
};
const feedback = compileFeedbackUnits([
  unit("attribution"),
  unit("suppression-diff"),
  unit("semantic-correction"),
]);
const lower = (input = program, policy = feedback, runtime = profile) =>
  lowerToHarness(input, policy, input.loadout.authorityEnvelope, runtime);
const freeze = (value: unknown) => {
  if (value && typeof value === "object") {
    Object.freeze(value);
    Object.values(value).forEach(freeze);
  }
};

test("WO-039 pure lowering preserves inputs and semantic hashes, and verifies all file identities", () => {
  const before = structuredClone({ program, feedback, profile });
  [program, feedback, profile].forEach(freeze);
  const now = Date.now,
    random = Math.random;
  let bundle;
  try {
    Date.now = () => {
      throw new Error("ambient clock");
    };
    Math.random = () => {
      throw new Error("ambient randomness");
    };
    bundle = lower();
    assert.deepEqual(lower(), bundle);
  } finally {
    Date.now = now;
    Math.random = random;
  }
  assert.deepEqual({ program, feedback, profile }, before);
  assert.equal(verifyHarnessBundle(bundle), true);
  assert.equal(
    bundle.manifest.loadout.semanticHash,
    semanticHash(before.program.loadout),
  );
  for (const file of bundle.files) {
    assert.equal(
      file.origin.semanticHash,
      bundle.manifest.loadout.semanticHash,
    );
    assert.equal(file.origin.loadoutId, program.loadout.loadoutId);
  }
  const drift = structuredClone(bundle);
  (drift.files[0] as { contents: string }).contents += " ";
  assert.equal(verifyHarnessBundle(drift), false);
});
test("WO-039 one changed unit affects only files naming that unit", () => {
  const original = lower();
  const changedId = "fixture-attribution";
  const changed = lower(
    program,
    compileFeedbackUnits(
      feedback.units.map((item) =>
        item.unitId === changedId
          ? {
              ...item,
              version: item.version + 1,
              desiredBehavior: "A corrected required result",
            }
          : item,
      ),
    ),
  );
  const differences = changed.files.filter(
    (file, index) => original.files[index]?.contents !== file.contents,
  );
  assert.ok(differences.length > 0);
  assert.ok(differences.every((file) => file.origin.ids.includes(changedId)));
  assert.equal(
    original.manifest.loadout.semanticHash,
    changed.manifest.loadout.semanticHash,
  );
});
test("WO-039 profile observations, authority identity and bounded residue refuse unsupported assumptions", () => {
  assert.throws(
    () =>
      lower(program, feedback, {
        ...profile,
        settings: { ...profile.settings, allow: true },
      }),
    /allow entries/,
  );
  assert.throws(
    () =>
      lowerToHarness(
        program,
        feedback,
        { ...program.loadout.authorityEnvelope, allowedEffects: ["*"] },
        profile,
      ),
    /compiled build envelope/,
  );
  assert.throws(
    () =>
      lower({
        ...program,
        facets: [
          {
            facetId: "fixture.residue",
            kind: "prompt-fragment",
            text: program.roles[0]!.procedure[1]!,
          },
        ],
      }),
    /duplicates role procedure/,
  );
  const unconfirmed = lower();
  assert.ok(
    unconfirmed.residue.items.some(
      (row) =>
        row.originId === "fixture-semantic-correction" &&
        row.missingCapabilities.includes("operator.correction-token.confirmed"),
    ),
  );
  assert.ok(
    unconfirmed.files.some(
      (file) =>
        file.path.endsWith("SKILL.md") &&
        file.origin.ids.includes("fixture-semantic-correction"),
    ),
  );
  assert.ok(
    !unconfirmed.files.some((file) =>
      file.path.endsWith("/fixture-semantic-correction.mjs"),
    ),
  );
  assert.ok(
    lower({ ...program, correctionToken: "correction:" }).files.some((file) =>
      file.path.endsWith("/fixture-semantic-correction.mjs"),
    ),
  );
  const unavailable = {
    available: false,
    evidence: "docs/probe.md#unobserved",
    reason: "No project hook fired",
  };
  const fallback = lower(program, feedback, {
    ...profile,
    events: {
      PreToolUse: unavailable,
      PostToolUse: unavailable,
      Stop: unavailable,
      UserPromptSubmit: unavailable,
    },
  });
  assert.ok(
    fallback.residue.items.some((row) =>
      row.missingCapabilities.includes("hooks.PreToolUse"),
    ),
  );
  assert.ok(!fallback.files.some((file) => file.path.endsWith(".mjs")));
});

test("WO-132 both harness roles receive identical duties and the shared instruction includes missing-hook residue", () => {
  const availableBundle = lower();
  const unavailable = {
    available: false,
    evidence: "docs/probe.md#unobserved",
    reason: "No project hook fired",
  };
  const noHooksBundle = lower(program, feedback, {
    ...profile,
    profileId: "fixture-codex",
    harness: "codex-cli",
    skills: { ...profile.skills, root: ".agents/skills" },
    instruction: { ...profile.instruction, path: "AGENTS.md" },
    settings: {
      ...unavailable,
      path: ".claude/settings.json",
      deny: false,
      allow: false,
    },
    refusal: "unavailable",
    events: {
      PreToolUse: unavailable,
      PostToolUse: unavailable,
      Stop: unavailable,
      UserPromptSubmit: unavailable,
    },
  });
  assert.equal(
    availableBundle.files.find((file) => file.path.endsWith("SKILL.md"))!
      .contents,
    noHooksBundle.files.find((file) => file.path.endsWith("SKILL.md"))!
      .contents,
  );
  const merged = mergeHarnessFragments([availableBundle, noHooksBundle]);
  assert.match(
    merged,
    /fixture-codex: fixture-attribution: No project hook fired/,
  );
  assert.match(merged, /one writer per worktree on any branch, including main/);
  assert.match(merged, /success record during a live npm test/);
  assert.match(merged, /node scripts\/harness\.mjs evidence --stop/);
  assert.match(merged, /four refusals \(WO-135, WO-139\)/);
  assert.match(
    merged,
    /planning\/ branches refuses repository writes outside docs\/ and root Markdown/,
  );
  assert.match(merged, /operator override:/);
  assert.match(
    merged,
    /Codex carries the duties and cap as role text without automatic enforcement/,
  );
  for (const file of availableBundle.files.filter(
    (file) =>
      file.path.endsWith(".mjs") && !file.path.endsWith("commit-msg.mjs"),
  )) {
    if (file.path.includes("/presence-"))
      assert.match(
        file.contents,
        /DotLn advisory: presence heartbeat unavailable/,
      );
    else {
      assert.match(file.contents, /built adapter unavailable/);
      assert.match(file.contents, /delegated: true/);
    }
    assert.doesNotMatch(file.contents, /permissionDecision: "deny"/);
  }
});

test("WO-049 target lowering is explicit, omits importRoot from metadata and emits PreToolUse only", () => {
  const targetProgram: HarnessProgram = {
    ...program,
    facets: [
      {
        facetId: "fixture.permissions",
        kind: "permission-guard",
        matchers: [
          {
            effect: program.loadout.authorityEnvelope.deniedEffects[0]!,
            deny: "Bash(ssh *)",
          },
        ],
      },
    ],
  };
  const policy = compileFeedbackUnits([
    unit("writer-isolation"),
    unit("attribution"),
  ]);
  const unavailable = {
    available: false,
    evidence: "docs/probe.md",
    reason: "Target omits lifecycle and skills",
  };
  const target: HarnessProfile = {
    ...profile,
    kind: "target-worker-v1",
    profileId: "target-worker-fixture",
    instruction: { ...available, path: "CLAUDE.local.md" },
    skills: { ...unavailable, root: ".claude/skills" },
    events: {
      PreToolUse: available,
      PostToolUse: unavailable,
      Stop: unavailable,
      UserPromptSubmit: unavailable,
    },
    runtime: {
      ...profile.runtime,
      snapshot: ".runtime/harness/0123456789abcdef",
      importRoot: "/fixture launchpad/#unicode-é",
      targetId: "a".repeat(64),
    },
  };
  const bundle = lower(targetProgram, policy, target);
  assert.equal(verifyHarnessBundle(bundle), true);
  assert.deepEqual(bundle, lower(targetProgram, policy, target));
  assert.ok(!JSON.stringify(bundle.manifest).includes("importRoot"));
  assert.ok(!JSON.stringify(bundle.manifest).includes("/fixture launchpad"));
  const settings = JSON.parse(
    bundle.files.find((file) => file.path === ".claude/settings.json")!
      .contents,
  );
  assert.deepEqual(Object.keys(settings.hooks), ["PreToolUse"]);
  assert.ok(
    !bundle.files.some((file) => /SKILL.md|commit-msg.mjs/.test(file.path)),
  );
  for (const file of bundle.files.filter((file) =>
    file.path.endsWith(".mjs"),
  )) {
    if (file.path.includes("/presence-")) {
      assert.equal(file.path, ".claude/hooks/presence-pretooluse.mjs");
      assert.match(
        file.contents,
        /import\("file:\/\/\/fixture%20launchpad\/%23unicode-%C3%A9/,
      );
      assert.match(
        file.contents,
        /recordHarnessHeartbeat\("PreToolUse", input\)/,
      );
      assert.doesNotMatch(file.contents, /permissionDecision/);
    } else {
      assert.match(
        file.contents,
        /new URL\("file:\/\/\/fixture%20launchpad\/%23unicode-%C3%A9/,
      );
      assert.match(file.contents, /permissionDecision: "deny"/);
    }
    assert.ok(!file.contents.includes("operatorControl"));
    assert.ok(!file.contents.includes('"importRoot"'));
  }
  for (const importRoot of [
    "relative",
    "/fixture/../launchpad",
    "/fixture\nlaunchpad",
    "/fixture/back\\slash",
  ])
    assert.throws(
      () =>
        lower(targetProgram, policy, {
          ...target,
          runtime: { ...target.runtime, importRoot },
        }),
      /absolute target import root/,
    );
  assert.throws(
    () =>
      lower(targetProgram, policy, {
        ...target,
        skills: { ...target.skills, available: true },
      }),
    /PreToolUse only/,
  );
});
