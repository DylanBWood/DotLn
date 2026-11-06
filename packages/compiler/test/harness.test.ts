import test from "node:test";
import assert from "node:assert/strict";
import {
  compileFeedbackUnits,
  compileLoadout,
  lowerToHarness,
  PUBLISH_HELPER_ALLOW_RULES,
  mergeHarnessFragments,
  HARNESS_REFUSALS,
  requireCompiled,
  seiriEnvironment,
  seiriLoadout,
  semanticHash,
  verifyHarnessBundle,
  assertOutsideWriteGrants,
  outsideWriteEffect,
  harnessPromptIntent,
  harnessPromptLine,
  harnessWorkerWords,
  operatorMessageClass,
  projectAuthorityInspection,
  type FeedbackHandler,
  type FeedbackUnit,
  type HarnessProfile,
  type HarnessProgram,
} from "../src/index.js";

test("leading resume dispatch keeps following direction without matching quoted or continued phrases", () => {
  for (const phrase of [
    "next",
    "fix",
    "verify",
    "final review",
    "release close",
    "status",
    "times",
  ])
    for (const suffix of [
      "",
      "\nKeep this direction.",
      "\r\nKeep this direction.",
      "; keep this direction.",
    ])
      assert.equal(
        harnessPromptIntent(`  resume: ${phrase}${suffix}  `),
        `resume: ${phrase}`,
      );
  for (const prompt of [
    '"resume: final review"',
    "Explain resume: next",
    "resume: next generation",
    "resume: verify-now",
    "`resume: fix`",
    "planning: refute full",
  ])
    assert.equal(harnessPromptIntent(prompt), prompt);
});

test("a pasted dispatch uses the first content line and keeps its original index", () => {
  for (const [prompt, expected, index] of [
    ["planning: fixture", "planning: fixture", 0],
    ["\n\n  resume: next\nLater text", "resume: next", 2],
    [
      "\n```text\n\n planning: refute full fable 5.1\n```",
      "planning: refute full",
      3,
    ],
    [
      "```\r\nresume: final review fable; direction\r\n```",
      "resume: final review",
      1,
    ],
    ["Example follows\nresume: next", "Example follows", 0],
    ["> resume: next", "> resume: next", 0],
    ["```\n```\nresume: next", "```", 1],
  ] as const) {
    assert.equal(harnessPromptIntent(prompt), expected);
    assert.equal(harnessPromptLine(prompt).index, index);
  }
});

test("WO-257 the host's command block and its pasted-content wrapper are skipped before the dispatch line, an unknown leading element is reported by name, and the embedded reader agrees", () => {
  // The block Claude Code writes before the operator's text when a slash
  // command shared the message, as the 2026-11-05 capture records it, and
  // the wrapper it puts around a pasted message.
  const block =
    "<local-command-caveat>The command below was run directly in Claude Code, not sent to you as a request, and its output goes straight to the user. It's recorded here as context for later messages.</local-command-caveat>\n<command-name>/model</command-name>\n            <command-message>model</command-message>\n            <command-args></command-args>\n<local-command-stdout>Set model to `fixture` and saved as your default for new sessions · `max` effort for this session only</local-command-stdout>\n";
  const dispatch =
    "planning: standard planning pass +\n\n1) instance planning pass:\n";
  // The generated Codex hook embeds the reader's own source.
  const embedded = new Function(
    `return (${harnessPromptLine.toString()});`,
  )() as typeof harnessPromptLine;
  for (const [prompt, index] of [
    [`${block}${dispatch}`, 5],
    [dispatch, 0],
    [
      `\n\n<pasted_content id="f1x7">\n${dispatch}</pasted_content id="f1x7">\n`,
      3,
    ],
    [`${block}\n<pasted_content id="f1x7">\n${dispatch}</pasted_content>\n`, 7],
    [`<pasted_content id="f1x7">${dispatch}</pasted_content>\n`, 0],
    [`${block}\`\`\`text\n${dispatch}\`\`\`\n`, 6],
  ] as const) {
    assert.deepEqual(harnessPromptLine(prompt), {
      text: "planning: standard planning pass +",
      index,
      element: null,
    });
    assert.deepEqual(embedded(prompt), harnessPromptLine(prompt));
    assert.deepEqual(operatorMessageClass(prompt), {
      prefix: "planning:",
      prefixLine: index,
      class: "direction",
    });
    assert.equal(
      harnessPromptIntent(prompt),
      "planning: standard planning pass +",
    );
  }
  // Prose before a quoted dispatch stays prose, block or no block.
  for (const prompt of [
    `${block}Example follows\nresume: next`,
    "Example follows\nresume: next",
  ])
    assert.deepEqual(operatorMessageClass(prompt), {
      prefix: null,
      prefixLine: null,
      class: "unclassified",
    });
  // The worker words still close the line after the block.
  assert.deepEqual(
    harnessWorkerWords(`${block}planning: standard planning pass fable`),
    { claude: "fable" },
  );
  // A known element whose closing tag never comes is reported by its name
  // at its own line instead of swallowing the dispatch below it; text after
  // a closing tag on the same line is read; and an operator line that
  // merely begins like a tag is reported, not swallowed (round 1's design F3).
  assert.deepEqual(
    harnessPromptLine(
      "<command-message>model is running\nplanning: standard planning pass",
    ),
    {
      text: "<command-message>model is running",
      index: 0,
      element: "command-message",
    },
  );
  assert.deepEqual(
    operatorMessageClass(
      "<command-message>model is running\nplanning: standard planning pass",
    ),
    {
      prefix: null,
      prefixLine: null,
      class: "unclassified",
      leadingElement: "command-message",
    },
  );
  assert.deepEqual(
    harnessPromptLine("<command-args></command-args>planning: x"),
    { text: "planning: x", index: 0, element: null },
  );
  assert.deepEqual(
    harnessPromptLine(`${block}<command-args></command-args>planning: x`),
    { text: "planning: x", index: 5, element: null },
  );
  assert.deepEqual(harnessPromptLine("<command-name> is the tag I mean"), {
    text: "<command-name> is the tag I mean",
    index: 0,
    element: "command-name",
  });
  for (const prompt of [
    "<command-message>model is running\nplanning: standard planning pass",
    "<command-args></command-args>planning: x",
    "<command-name> is the tag I mean",
  ])
    assert.deepEqual(embedded(prompt), harnessPromptLine(prompt));
  // A first content line that opens an element outside the skipped set is
  // reported by the element's name, so the next pass can read which block
  // the host wrote.
  const notification =
    "<task-notification>\n<task-id>abc</task-id>\n</task-notification>\n";
  assert.deepEqual(harnessPromptLine(notification), {
    text: "<task-notification>",
    index: 0,
    element: "task-notification",
  });
  assert.deepEqual(operatorMessageClass(notification), {
    prefix: null,
    prefixLine: null,
    class: "unclassified",
    leadingElement: "task-notification",
  });
  assert.deepEqual(embedded(notification), harnessPromptLine(notification));
  // A block with no dispatch after it reads as an empty line, not as the
  // block's own text.
  // The block alone, ending in a newline, leaves the reader past its last
  // line with nothing to read.
  assert.deepEqual(harnessPromptLine(block), {
    text: "",
    index: 6,
    element: null,
  });
});

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
  skills: { ...available, format: "agent-skills", root: ".claude/skills" },
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

test("desktop control host denials follow the supplied instance election", () => {
  const expected = [
    "mcp__computer-use__*",
    "mcp__remote-devices__computer_*",
    "enable__mcp__remote-devices__computer*",
    "mcp__claude-in-chrome__*",
    "mcp__Claude_Browser__*",
    "mcp__remote-devices__Claude_Browser__*",
    "enable__mcp__claude-in-chrome*",
    "enable__mcp__remote-devices__Claude_Browser*",
    "Skill(anthropic-skills:computer-use)",
    "Skill(anthropic-skills:computer-use *)",
    "Skill(skill:anthropic-skills:computer-use)",
    "Skill(anthropic-skills:chrome-browser)",
    "Skill(anthropic-skills:chrome-browser *)",
    "Skill(skill:anthropic-skills:chrome-browser)",
    "Skill(anthropic-skills:built-in-browser)",
    "Skill(anthropic-skills:built-in-browser *)",
    "Skill(skill:anthropic-skills:built-in-browser)",
    "Skill(claude-in-chrome)",
    "Skill(claude-in-chrome *)",
    "Skill(skill:claude-in-chrome)",
  ];
  const denies = (election?: boolean): string[] =>
    JSON.parse(
      lower({
        ...program,
        ...(election === undefined ? {} : { desktopControl: election }),
      }).files.find((file) => file.path === ".claude/settings.json")!.contents,
    ).permissions.deny;
  const on = denies(true);
  for (const off of [denies(), denies(false)]) {
    for (const rule of expected) assert.ok(off.includes(rule), rule);
    assert.deepEqual(
      off.filter((rule) => !expected.includes(rule)),
      on,
    );
    assert.ok(!off.some((rule) => rule.includes("playwright")));
  }
  for (const rule of expected) assert.ok(!on.includes(rule), rule);
});

test("WO-146 Copilot shares the observed Claude hook bytes, not a second registration", () => {
  const copilot: HarnessProfile = {
    ...profile,
    profileId: "copilot-cli-1.0.86",
    harness: "copilot-cli",
    observedVersion: "1.0.86",
    skills: { ...available, format: "agent-skills", root: ".agents/skills" },
    instruction: { ...available, path: "AGENTS.md" },
    settings: { ...profile.settings, deny: false },
  };
  const original = lower();
  const added = lower(program, feedback, copilot);
  const shared = (bundle: typeof original) =>
    bundle.files.filter(
      (file) =>
        file.path === ".claude/settings.json" ||
        file.path.startsWith(".claude/hooks/"),
    );
  assert.deepEqual(shared(added), shared(original));
  assert.equal(added.manifest.profile.harness, "copilot-cli");
  assert.ok(
    added.files.some((file) => file.path.startsWith(".agents/skills/")),
  );
  assert.ok(!added.files.some((file) => file.path.startsWith(".github/")));
  assert.throws(
    () => lower(program, feedback, { ...copilot, refusal: "unavailable" }),
    /observed refusal protocol/,
  );
  assert.throws(
    () =>
      lower(program, feedback, {
        ...copilot,
        kind: "target-worker-v1",
        instruction: { ...copilot.instruction, path: "CLAUDE.local.md" },
      }),
    /operator-launched only/,
  );
});

test("WO-144 role grants are closed, source-bearing target data in hooks and manifests", () => {
  for (const invalid of [
    null,
    {},
    [{ kind: "ambient", source: "fixture" }],
    [{ kind: "system-temp" }],
    [{ kind: "operator-root", source: "fixture", root: "relative" }],
    [{ kind: "system-temp", source: "fixture", root: "/unexpected" }],
  ]) {
    assert.throws(() => assertOutsideWriteGrants(invalid), /outside-write/);
  }
  const rootGrant = {
    kind: "operator-root" as const,
    root: "/fixture/authorized",
    source: "Fixture operator direction",
  };
  const authority = {
    grantId: "fixture.outside",
    version: 1,
    grantedBy: "operator" as const,
    effects: [outsideWriteEffect(rootGrant)],
    repo: seiriEnvironment().repo,
    reason: rootGrant.source,
  };
  const admitted = requireCompiled(
    compileLoadout(
      { ...seiriLoadout, authorityGrants: [authority] },
      { ...seiriEnvironment(), authorityGrantRegistry: [authority] },
    ),
  );
  const input: HarnessProgram = {
    ...program,
    loadout: admitted,
    roles: program.roles.map((role) => ({
      ...role,
      outsideWriteGrants: [
        {
          kind: "operator-root",
          root: "/fixture/authorized",
          source: "Fixture operator direction",
        },
      ],
    })),
  };
  const bundle = lower(input);
  assert.deepEqual(bundle.manifest.outsideWriteGrants, [
    {
      role: "executor",
      grants: [
        {
          kind: "operator-root",
          root: "/fixture/authorized",
          source: "Fixture operator direction",
          originId: "fixture.executor",
          authorityGrantId: "fixture.outside",
        },
      ],
    },
  ]);
  assert.notEqual(
    bundle.manifest.loadout.targetHash,
    lower().manifest.loadout.targetHash,
  );
  assert.equal(
    bundle.manifest.loadout.semanticHash,
    lower({ ...program, loadout: admitted }).manifest.loadout.semanticHash,
  );
  assert.throws(
    () => lower({ ...input, loadout: program.loadout }),
    /provenance-bearing grant/,
  );
  assert.throws(
    () =>
      lower({
        ...input,
        loadout: {
          ...admitted,
          authorityEnvelope: {
            ...admitted.authorityEnvelope,
            deniedEffects: ["outside.write:*"],
          },
        },
      }),
    /effective envelope/,
  );
  assert.match(
    projectAuthorityInspection(admitted).grants.join("\n"),
    /outside.write:operator-root:.*fixture.outside/,
  );
  assert.doesNotMatch(
    outsideWriteEffect({ ...rootGrant, root: "/fixture/a*b" }),
    /\*/,
  );
  const hook = bundle.files.find((file) =>
    file.path.endsWith("write-observer.mjs"),
  )!;
  assert.match(hook.contents, /outsideWriteGrants/);
  assert.ok(hook.origin.ids.includes("fixture.executor"));
  assert.throws(
    () =>
      lower({
        ...input,
        facets: [
          {
            facetId: "unequipped",
            kind: "role-procedure",
            roleName: "executor",
            text: input.roles[0]!.procedure[0]!,
            outsideWriteGrants: [
              {
                kind: "operator-root",
                root: "/fixture/unauthorized",
                source: "Untrusted fixture",
              },
            ],
          },
        ],
      }),
    /equipped prompt support/,
  );
});
test("target-worktree grants carry authority without accepting a baked-in root", () => {
  const grant = {
    kind: "target-worktree" as const,
    source: "Fixture target authorization",
  };
  assertOutsideWriteGrants([grant]);
  assert.throws(
    () => assertOutsideWriteGrants([{ ...grant, root: "/fixture/target" }]),
    /outside-write/,
  );
  assert.equal(outsideWriteEffect(grant), "outside.write:target-worktree");
  const authority = {
    grantId: "fixture.target",
    version: 1,
    grantedBy: "operator" as const,
    effects: [outsideWriteEffect(grant)],
    repo: seiriEnvironment().repo,
    reason: grant.source,
  };
  const loadout = requireCompiled(
    compileLoadout(
      { ...seiriLoadout, authorityGrants: [authority] },
      { ...seiriEnvironment(), authorityGrantRegistry: [authority] },
    ),
  );
  const bundle = lower({
    ...program,
    loadout,
    roles: program.roles.map((role) => ({
      ...role,
      outsideWriteGrants: [grant],
    })),
  });
  assert.ok(bundle.manifest.outsideWriteGrants);
  assert.deepEqual(bundle.manifest.outsideWriteGrants[0]!.grants, [
    {
      ...grant,
      originId: "fixture.executor",
      authorityGrantId: authority.grantId,
    },
  ]);
  assert.match(
    bundle.files.find((file) => file.path.endsWith("/SKILL.md"))!.contents,
    /Outside-write grants for executor: target-worktree;/,
  );
  assert.throws(
    () =>
      lower({
        ...program,
        roles: program.roles.map((role) => ({
          ...role,
          outsideWriteGrants: [grant],
        })),
      }),
    /provenance-bearing grant/,
  );
});

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
  // Allow rules need a read host contract, and the flag decides the bytes.
  const settingsOf = (bundle: ReturnType<typeof lower>) =>
    JSON.parse(
      bundle.files.find((file) => file.path === ".claude/settings.json")!
        .contents,
    );
  assert.throws(
    () =>
      lower(program, feedback, {
        ...profile,
        settings: { ...profile.settings, allow: true },
      }),
    /allow entries/,
  );
  assert.deepEqual(
    settingsOf(
      lower(program, feedback, {
        ...profile,
        settings: {
          ...profile.settings,
          allow: true,
          allowEvidence: "docs/probe.md#read",
        },
      }),
    ).permissions.allow,
    [...PUBLISH_HELPER_ALLOW_RULES],
  );
  assert.equal(settingsOf(lower()).permissions.allow, undefined);
  // A profile that does not share Claude's settings file carries no rules.
  assert.throws(
    () =>
      lower(program, feedback, {
        ...profile,
        profileId: "fixture-codex",
        harness: "codex-cli",
        skills: {
          ...available,
          format: "agent-skills",
          root: ".agents/skills",
        },
        instruction: { ...available, path: "AGENTS.md" },
        settings: {
          ...profile.settings,
          allow: true,
          allowEvidence: "docs/probe.md#read",
        },
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

test("WO-187 a worker definition pins model and effort independently of its root and participates in bundle integrity", () => {
  const input: HarnessProgram = {
    ...program,
    worker: { name: "dotln-worker", model: "claude-opus-5-5", effort: "xhigh" },
  };
  const bundle = lower(input);
  const worker = bundle.files.find(
    (file) => file.path === ".claude/agents/dotln-worker.md",
  )!;
  assert.ok(worker);
  assert.match(worker.contents, /^model: claude-opus-5-5$/m);
  assert.match(worker.contents, /^effort: xhigh$/m);
  assert.equal(verifyHarnessBundle(bundle), true);
  for (const [before, after] of [
    ["model: claude-opus-5-5", "model: inherit"],
    ["effort: xhigh", "effort: low"],
  ]) {
    const edited = {
      ...bundle,
      files: bundle.files.map((file) =>
        file.path === worker.path
          ? { ...file, contents: file.contents.replace(before!, after!) }
          : file,
      ),
    };
    assert.equal(verifyHarnessBundle(edited), false);
  }
  assert.notEqual(
    lower({ ...input, worker: { ...input.worker!, effort: "low" } }).manifest
      .loadout.targetHash,
    bundle.manifest.loadout.targetHash,
  );
});

test("multiple workers retain the default definition and bind each opt-in definition", () => {
  const pinned = {
    name: "dotln-worker",
    model: "claude-opus-5-5",
    effort: "xhigh" as const,
  };
  const fable = {
    name: "dotln-worker-fable",
    model: "claude-fable-5-1",
    effort: "xhigh" as const,
    optIn: true,
    optInLabel: "Fable (fable or fable 5.1)",
  };
  const single = lower({ ...program, worker: pinned });
  const bundle = lower({ ...program, workers: [pinned, fable] });
  assert.equal(
    bundle.files.find((file) => file.path === ".claude/agents/dotln-worker.md")
      ?.contents,
    single.files.find((file) => file.path === ".claude/agents/dotln-worker.md")
      ?.contents,
  );
  const added = bundle.files.find(
    (file) => file.path === ".claude/agents/dotln-worker-fable.md",
  );
  assert.ok(added);
  assert.match(added.contents, /^model: claude-fable-5-1$/m);
  assert.match(added.contents, /^effort: xhigh$/m);
  assert.match(
    added.contents,
    /only when the operator's planning: or resume: dispatch line names Fable/,
  );
  assert.equal(
    verifyHarnessBundle({
      ...bundle,
      files: bundle.files.map((file) =>
        file === added
          ? {
              ...file,
              contents: file.contents.replace(
                "model: claude-fable-5-1",
                "model: inherit",
              ),
            }
          : file,
      ),
    }),
    false,
  );
  assert.throws(
    () => lower({ ...program, workers: [pinned, pinned] }),
    /unique worker names/,
  );
});

test("a Codex worker is a generated Codex custom agent and never a Claude agent type", () => {
  const pinned = {
    name: "dotln-worker",
    model: "claude-opus-5-5",
    effort: "xhigh" as const,
  };
  const astra = {
    name: "dotln-worker-astra",
    host: "codex" as const,
    model: "gpt-6-astra",
    effort: "max" as const,
    optIn: true,
    optInLabel: "Astra (astra)",
  };
  const unavailable = {
    available: false,
    evidence: "docs/probe.md#unobserved",
    reason: "No project hook fired",
  };
  const codexProfile: HarnessProfile = {
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
  };
  const claude = lower({ ...program, workers: [pinned, astra] });
  assert.ok(
    claude.files.some((file) => file.path === ".claude/agents/dotln-worker.md"),
  );
  assert.ok(
    !claude.files.some((file) => /dotln-worker-astra/u.test(file.path)),
    "a Claude bundle carries no Codex agent",
  );
  const codex = lower(
    { ...program, workers: [pinned, astra] },
    feedback,
    codexProfile,
  );
  assert.ok(
    !codex.files.some((file) => file.path.startsWith(".claude/agents/")),
  );
  const added = codex.files.find(
    (file) => file.path === ".codex/agents/dotln-worker-astra.toml",
  );
  assert.ok(added);
  for (const line of [
    'name = "dotln-worker-astra"',
    'model = "gpt-6-astra"',
    'model_reasoning_effort = "max"',
  ])
    assert.ok(added.contents.split("\n").includes(line), line);
  assert.match(
    added.contents,
    /^developer_instructions = ".*dispatch line names Astra \(astra\)\. Record the worker type in the receipt and response\."$/mu,
  );
  assert.throws(
    () =>
      lower({
        ...program,
        workers: [pinned, { ...astra, host: "copilot" as never }],
      }),
    /worker host/,
  );
  // An opt-in label belongs to an opt-in worker, and every opt-in worker
  // names its dispatch word.
  assert.throws(
    () =>
      lower({
        ...program,
        workers: [{ ...pinned, optInLabel: "Opus (opus)" }],
      }),
    /worker opt-in label/,
  );
  const { optInLabel: _label, ...unlabelled } = astra;
  assert.throws(
    () => lower({ ...program, workers: [pinned, unlabelled] }),
    /worker opt-in label/,
  );
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
  // One residue line per profile names each reason once, after the ids that
  // share it.
  assert.match(
    merged,
    /^fixture-codex: [^\n]*\bfixture-attribution(?:, [a-z-]+)*: No project hook fired/mu,
  );
  assert.match(merged, /one writer per worktree on any branch, including main/);
  assert.match(merged, /success record during a live gate/);
  assert.match(
    merged,
    /active order's own evidence, verification and final-review directories at the default document roots during a product gate/,
  );
  assert.match(
    merged,
    /document and mixed review gates retain the full refusal/,
  );
  assert.match(merged, /node scripts\/harness\.mjs evidence --stop/);
  assert.ok(merged.includes(`DotLn has ${HARNESS_REFUSALS.length} refusals (`));
  assert.ok(
    merged.includes(
      `Claude hooks enforce these ${HARNESS_REFUSALS.length} refusals`,
    ),
  );
  assert.ok(HARNESS_REFUSALS.some((row) => row.id === "desktop-control"));
  // A review or refutation worker's gate is refused at the hook too, so the
  // count above includes its row.
  assert.ok(
    HARNESS_REFUSALS.some(
      (row) =>
        row.id === "worker-gate" &&
        row.clause.includes("review worker's test-runner gate"),
    ),
  );
  for (const row of HARNESS_REFUSALS) assert.ok(merged.includes(row.clause));
  assert.match(
    merged,
    /planning\/ branches refuses repository writes outside docs\/ and root Markdown/,
  );
  assert.match(merged, /operator override:/);
  assert.match(
    merged,
    /under Codex a lifecycle dispatch reserves the writer and refuses a foreign holder, the gate, bounded wrapper and lifecycle enforce dispatch bounds in process; the other duties and grants are role text because Codex tool calls are unhooked/,
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
    skills: { ...unavailable, format: "agent-skills", root: ".claude/skills" },
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

test("the shared instruction carries one residue line per profile, naming once the rules that share a reason", () => {
  const bundle = (
    profileId: string,
    items: readonly { originId: string; reason: string }[],
  ) =>
    ({
      manifest: { profile: { profileId } },
      residue: {
        items: items.map((item) => ({ ...item, missingCapabilities: [] })),
      },
    }) as unknown as Parameters<typeof mergeHarnessFragments>[0][number];
  const shared =
    "No project hook fired; the role skill carries the remaining duty.";
  const merged = mergeHarnessFragments([
    bundle("fixture-claude", [
      { originId: "clean-room", reason: "Provenance needs judgment." },
    ]),
    bundle("fixture-codex", [
      { originId: "no-attribution", reason: shared },
      { originId: "read-your-own-output", reason: shared },
      { originId: "permissions", reason: "Pre-effect checks unavailable." },
      { originId: "clean-room", reason: "Provenance needs judgment." },
    ]),
    bundle("fixture-quiet", []),
  ]);
  const lines = merged.split("\n");
  assert.deepEqual(
    lines.filter((line) => line.startsWith("fixture-codex: ")),
    [
      `fixture-codex: no-attribution, read-your-own-output: ${shared} permissions: Pre-effect checks unavailable. clean-room: Provenance needs judgment.`,
    ],
  );
  assert.deepEqual(
    lines.filter((line) => line.startsWith("fixture-claude: ")),
    ["fixture-claude: clean-room: Provenance needs judgment."],
  );
  assert.equal(
    lines.filter((line) => line.startsWith("fixture-quiet")).length,
    0,
  );
  assert.equal(merged.split(shared).length - 1, 1);
});
