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
  operatorMessageClass,
  projectAuthorityInspection,
  type FeedbackHandler,
  type FeedbackUnit,
  type HarnessProfile,
  type HarnessProgram,
  EVERY_TOOL,
  unitMatcher,
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

test("WO-276 a dispatch phrase ends where the instance's worker names begin, and the names select nothing", () => {
  // The names an emit writes into the session hook: the instance's workers
  // and models, one of its own among them.
  const names = ["default", "advanced", "fable", "astra", "night-shift"];
  for (const [prompt, expected] of [
    ["resume: next astra; then part two", "resume: next"],
    ["resume: verify fable 5.2", "resume: verify"],
    ["planning: refute full advanced", "planning: refute full"],
    ["resume: next fable and astra", "resume: next"],
    ["resume: next Fable 5.2 and night-shift; go", "resume: next"],
    ["resume: release close", "resume: release close"],
    ["resume: final review \t astra", "resume: final review"],
    // Any other word after the phrase leaves the line prose, as does a run
    // that opens with a number or closes on the joining word.
    ["resume: next generation", "resume: next generation"],
    ["resume: release close later", "resume: release close later"],
    ["resume: next astra later", "resume: next astra later"],
    ["resume: next 5.2", "resume: next 5.2"],
    ["resume: next fable and", "resume: next fable and"],
    ["resume: next gemini", "resume: next gemini"],
  ] as const)
    assert.equal(harnessPromptIntent(prompt, names), expected, prompt);
  // A name the hook was not given closes nothing: the recovery embedded in
  // every hook reads the phrase with none.
  assert.equal(harnessPromptIntent("resume: next astra"), "resume: next astra");
  assert.equal(harnessPromptIntent("resume: next; astra"), "resume: next");
  // The function is embedded by its source and reads only the line reader.
  const embedded = new Function(
    "harnessPromptLine",
    `return (${harnessPromptIntent.toString()});`,
  )(harnessPromptLine) as typeof harnessPromptIntent;
  assert.equal(embedded("resume: verify fable 5.2", names), "resume: verify");
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
    assert.equal(harnessPromptIntent(prompt, ["fable"]), expected);
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
  // A worker's name still closes a dispatch phrase after the block.
  assert.equal(
    harnessPromptIntent(`${block}planning: refute fable`, ["fable"]),
    "planning: refute",
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

test("WO-276 criterion Q1: a unit that states the kinds it judges is registered for every tool but the names the table maps to another kind, a name the table does not hold among them, and a unit that states none is registered for every tool", () => {
  const tools = {
    Read: "read",
    Glob: "read",
    Bash: "shell",
    exec_command: "shell",
    "functions.exec": "shell",
    Edit: "write",
    Write: "write",
    Agent: "spawn",
    "mcp__desk__*": "desktop",
  } as const;
  // The excluding form, for a host observed to read one: one anchored
  // pattern that leaves the other kinds' names out, each name written
  // literally and a name that ends in a star as a prefix.
  assert.equal(unitMatcher(tools, undefined), EVERY_TOOL);
  assert.equal(unitMatcher(tools, undefined, true), EVERY_TOOL);
  const shell = unitMatcher(tools, ["shell"], true);
  assert.equal(
    shell,
    "^(?!(?:Agent|Edit|Glob|Read|Write|mcp__desk__[\\s\\S]*)$)[\\s\\S]*$",
  );
  // A host reads a pattern as the whole name or as a search: the anchors
  // give one answer under both.
  for (const admits of [
    (name: string) => new RegExp("^(?:" + shell + ")$", "u").test(name),
    (name: string) => new RegExp(shell, "u").test(name),
  ]) {
    for (const name of ["Bash", "exec_command", "functions.exec"])
      assert.ok(admits(name), name);
    // A name the table does not hold starts the hook, as before.
    for (const name of ["SomethingNew", "mcp__other__tool", "Reader", "ARead"])
      assert.ok(admits(name), name);
    for (const name of ["Read", "Glob", "Edit", "Agent", "mcp__desk__click"])
      assert.ok(!admits(name), name);
    // A line break in a name stops neither: a name the table does not hold
    // still starts the hook, and a prefix still leaves its names out.
    for (const name of [
      "Some\nTool",
      "Some\rTool",
      "Some\u2028Tool",
      "Some\u2029Tool",
      "Bash\n",
      "Read\n",
      "\nRead",
    ])
      assert.ok(admits(name), JSON.stringify(name));
    assert.ok(!admits("mcp__desk__a\nb"));
  }
  // A dot in a table name leaves out that name alone.
  const dotted = unitMatcher({ "a.b": "read" }, ["shell"], true);
  assert.ok(!new RegExp(dotted, "u").test("a.b"));
  assert.ok(new RegExp(dotted, "u").test("aXb"));
  // Every kind judged leaves nothing out, in either form.
  assert.equal(unitMatcher({ Bash: "shell" }, ["shell"], true), EVERY_TOOL);
  assert.equal(unitMatcher({ Bash: "shell" }, ["shell"]), EVERY_TOOL);

  // The list form, where no observation of the excluding form is given: the
  // names of the unit's kinds, as they are written, joined by a bar. It holds
  // no lookahead, so it compiles wherever a pattern does.
  const listed = unitMatcher(tools, ["shell"]);
  assert.equal(listed, "Bash|exec_command|functions.exec");
  assert.equal(unitMatcher(tools, ["shell", "write"]).split("|").length, 5);
  assert.doesNotMatch(listed, /[(?!\\^$[\]]/u);
  // A host that compares each listed name with the tool's, one that reads
  // the whole name as a pattern and one that searches for it all start the
  // hook for the unit's names and for no other name of the table.
  for (const admits of [
    (name: string) => listed.split("|").includes(name),
    (name: string) => new RegExp("^(?:" + listed + ")$", "u").test(name),
    (name: string) => new RegExp(listed, "u").test(name),
  ]) {
    for (const name of ["Bash", "exec_command", "functions.exec"])
      assert.ok(admits(name), name);
    for (const name of ["Read", "Glob", "Edit", "Write", "Agent"])
      assert.ok(!admits(name), name);
    assert.ok(!admits("mcp__desk__click"));
    // A name the table does not hold starts no narrowed hook in this form.
    assert.ok(!admits("SomethingNew"));
  }
  // A prefix of the table is listed as one, and a kind with no name to list
  // or a name a list cannot hold as written is refused.
  assert.equal(
    unitMatcher({ ...tools, "pre__*": "shell" }, ["shell"]),
    "Bash|exec_command|functions.exec|pre__.*",
  );
  assert.throws(() => unitMatcher(tools, ["absent"]), /unit tool kinds/u);
  assert.throws(
    () => unitMatcher({ ...tools, "a|b": "shell" }, ["shell"]),
    /listed tool name/u,
  );
  // The emitted settings: each unit's hook in a group of its own matcher,
  // every other hook in the group for every tool.
  const narrowed: HarnessProfile = {
    ...profile,
    tools,
    unitToolKinds: {
      "fixture-attribution": ["shell"],
      "fixture-suppression-diff": ["write"],
    },
    matcherExclusion: {
      available: true,
      evidence: "docs/discovery/harness-smoke-2026-09-07.md#C1",
    },
  };
  type Group = { matcher?: string; hooks: { command: string }[] };
  const groups = (runtime: HarnessProfile, policy = feedback) =>
    JSON.parse(
      lower(program, policy, runtime).files.find(
        (file) => file.path === ".claude/settings.json",
      )!.contents,
    ).hooks as Record<string, Group[]>;
  const named = (group: Group) =>
    group.hooks.map((hook) => /hooks\/([a-z-]+)\.mjs/u.exec(hook.command)![1]);
  const emitted = groups(narrowed);
  const attribution = emitted.PreToolUse!.find((group) =>
    named(group).includes("fixture-attribution"),
  )!;
  assert.deepEqual(named(attribution), ["fixture-attribution"]);
  assert.equal(attribution.matcher, shell);
  const lint = emitted.PostToolUse!.find((group) =>
    named(group).includes("fixture-suppression-diff"),
  )!;
  assert.deepEqual(named(lint), ["fixture-suppression-diff"]);
  assert.equal(lint.matcher, unitMatcher(tools, ["write"], true));
  // The same profile with no observation of the excluding form, or with one
  // that says the host was not observed, emits the list form.
  const { matcherExclusion: _observed, ...unstated } = narrowed;
  for (const runtime of [
    unstated,
    {
      ...unstated,
      matcherExclusion: {
        available: false,
        evidence: "docs/discovery/harness-smoke-2026-09-07.md#C1",
        reason: "No run has shown how this host reads an excluding matcher",
      },
    },
  ]) {
    const plainly = groups(runtime);
    assert.equal(
      plainly.PreToolUse!.find((group) =>
        named(group).includes("fixture-attribution"),
      )!.matcher,
      "Bash|exec_command|functions.exec",
    );
    assert.equal(
      plainly.PostToolUse!.find((group) =>
        named(group).includes("fixture-suppression-diff"),
      )!.matcher,
      "Edit|Write",
    );
  }
  // An observation is a capability like any other: unavailable, it says why.
  assert.throws(
    () =>
      lower(program, feedback, {
        ...unstated,
        matcherExclusion: {
          available: false,
          evidence: "docs/discovery/harness-smoke-2026-09-07.md#C1",
        },
      }),
    /unavailable capability must explain why/u,
  );
  for (const event of ["PreToolUse", "PostToolUse"])
    for (const group of emitted[event]!)
      if (group !== attribution && group !== lint)
        assert.equal(group.matcher, EVERY_TOOL, named(group).join(","));
  // The same program with no kinds stated: one group for every tool at each
  // tool event, and the hook files the same bytes.
  const plain = groups({ ...profile, tools });
  for (const event of ["PreToolUse", "PostToolUse"]) {
    assert.equal(plain[event]!.length, 1);
    assert.equal(plain[event]![0]!.matcher, EVERY_TOOL);
    assert.deepEqual(
      named(plain[event]![0]!).sort(),
      emitted[event]!.flatMap(named).sort(),
    );
  }
  const hookFiles = (runtime: HarnessProfile) =>
    lower(program, feedback, runtime).files.filter((file) =>
      file.path.startsWith(".claude/hooks/"),
    );
  assert.deepEqual(hookFiles(narrowed), hookFiles({ ...profile, tools }));
  // A unit named with no kinds is refused when the profile loads, and so is
  // a kind no tool of the table has, which would register the unit's hook
  // for none of the table's tools.
  for (const kinds of [[], ["Shell"], ["shell", "writes"]])
    assert.throws(
      () =>
        lower(program, feedback, {
          ...profile,
          tools,
          unitToolKinds: { "fixture-attribution": kinds },
        }),
      /unit tool kinds/u,
      JSON.stringify(kinds),
    );
  // A unit's kinds are the declaration's own member: a unit the profile does
  // not name is registered for every tool, whatever it is called.
  const inherited = groups(
    {
      ...profile,
      tools,
      unitToolKinds: { "fixture-suppression-diff": ["write"] },
    },
    compileFeedbackUnits(
      feedback.units.map((item) =>
        item.unitId === "fixture-attribution"
          ? { ...item, unitId: "constructor" }
          : item,
      ),
    ),
  );
  assert.equal(
    inherited.PreToolUse!.find((group) => named(group).includes("constructor"))!
      .matcher,
    EVERY_TOOL,
  );
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

test("multiple workers retain the default definition and bind each further definition", () => {
  const pinned = {
    name: "dotln-worker",
    model: "claude-opus-5-5",
    effort: "xhigh" as const,
  };
  const second = {
    name: "fixture-second",
    model: "fixture-model-b",
    effort: "high" as const,
  };
  const single = lower({ ...program, worker: pinned });
  const bundle = lower({ ...program, workers: [pinned, second] });
  assert.equal(
    bundle.files.find((file) => file.path === ".claude/agents/dotln-worker.md")
      ?.contents,
    single.files.find((file) => file.path === ".claude/agents/dotln-worker.md")
      ?.contents,
  );
  const added = bundle.files.find(
    (file) => file.path === ".claude/agents/fixture-second.md",
  );
  assert.ok(added);
  assert.match(added.contents, /^model: fixture-model-b$/m);
  assert.match(added.contents, /^effort: high$/m);
  assert.equal(
    verifyHarnessBundle({
      ...bundle,
      files: bundle.files.map((file) =>
        file === added
          ? {
              ...file,
              contents: file.contents.replace(
                "model: fixture-model-b",
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
  const spawned = {
    name: "fixture-codex",
    host: "codex" as const,
    model: "fixture-model-c",
    effort: "max" as const,
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
  const claude = lower({ ...program, workers: [pinned, spawned] });
  assert.ok(
    claude.files.some((file) => file.path === ".claude/agents/dotln-worker.md"),
  );
  assert.ok(
    !claude.files.some((file) => /fixture-codex/u.test(file.path)),
    "a Claude bundle carries no Codex agent",
  );
  const codex = lower(
    { ...program, workers: [pinned, spawned] },
    feedback,
    codexProfile,
  );
  assert.ok(
    !codex.files.some((file) => file.path.startsWith(".claude/agents/")),
  );
  const added = codex.files.find(
    (file) => file.path === ".codex/agents/fixture-codex.toml",
  );
  assert.ok(added);
  for (const line of [
    'name = "fixture-codex"',
    'model = "fixture-model-c"',
    'model_reasoning_effort = "max"',
  ])
    assert.ok(added.contents.split("\n").includes(line), line);
  // The definition's instructions are one quoted field; what they say is the
  // generated text, which regeneration checks and no case retypes.
  assert.match(added.contents, /^developer_instructions = ".+"$/mu);
  assert.throws(
    () =>
      lower({
        ...program,
        workers: [pinned, { ...spawned, host: "copilot" as never }],
      }),
    /worker host/,
  );
  // The names that may close a dispatch line reach the session hook's
  // configuration, and a program without them emits what it always did.
  const sessionHook = (bundle: ReturnType<typeof lower>) =>
    bundle.files.find((file) => file.path.endsWith("/session.mjs"))?.contents;
  const withNames = lower({ ...program, workerNames: ["default", "fixture"] });
  assert.match(
    sessionHook(withNames) ?? "",
    /"workerNames":\s*\[\s*"default",\s*"fixture"\s*\]/u,
  );
  assert.equal(
    sessionHook(lower({ ...program, workerNames: [] })),
    sessionHook(lower()),
  );
  assert.doesNotMatch(sessionHook(lower()) ?? "", /workerNames/u);
  // The recovery embedded in a hook reads the phrase with the same names,
  // so a release-close line that closes on a worker's name is recovered as
  // it is on the session path; with no names its text is what it was.
  assert.ok(
    (sessionHook(withNames) ?? "").includes(
      '(input?.prompt, ["default","fixture"]) !== "resume: release close"',
    ),
  );
  assert.ok(
    (sessionHook(lower()) ?? "").includes(
      '(input?.prompt) !== "resume: release close"',
    ),
  );
  assert.throws(
    () => lower({ ...program, workerNames: ["Not A Name"] }),
    /worker names/,
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
    // The heartbeat rides the hooks that already run, so the bundle holds no
    // presence hook of its own (WO-276 criterion Q1).
    assert.ok(!file.path.includes("/presence-"), file.path);
    assert.match(file.contents, /built adapter unavailable/);
    assert.match(file.contents, /delegated: true/);
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
    // A target's bundle holds no presence hook; its permission hook carries
    // the heartbeat (WO-276 criterion Q1).
    assert.ok(!file.path.includes("/presence-"), file.path);
    assert.match(
      file.contents,
      /new URL\("file:\/\/\/fixture%20launchpad\/%23unicode-%C3%A9/,
    );
    assert.match(file.contents, /permissionDecision: "deny"/);
    // Each guard asks the recovery controls ahead of every runtime import,
    // as the launchpad's hooks do.
    assert.ok(file.contents.includes("async function operatorControl("));
    assert.ok(
      file.contents.indexOf("async function operatorControl(") <
        file.contents.indexOf("import(new URL("),
    );
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
