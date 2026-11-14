// Part J's evidence: a worker definition emitted from an instance's own
// workers and models, the listing and the launches of criteria J1 and J2
// as the commands print them, criterion J3's refusals, and the usage
// report with and without prices.
//
//   node scripts/harness.mjs bounded -- node --test docs/evidence/WO-276/part-j/evidence.mjs
//
// It writes, beside itself: dotln-worker.emitted.txt (the definition `node
// scripts/harness.mjs emit` wrote in the instance), launches.txt (the
// listing, one name shown, the review helper's dry run, the refuter's
// printed launch and the drive's arguments for two phases), refusals.txt
// (criterion J3), usage.txt (criterion J6's two reports) and results.json.
// The instance is the launchpad tests' exported fixture, committed and
// installed, with a `workers` section written into its configuration and
// a models file beside it; the usage reports are read from a small ledger
// written for them, since a fresh export has recorded no session.
import test from "node:test";
import assert from "node:assert/strict";
import {
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import {
  commitWarmExport,
  env,
  harness,
  initRepository,
  ok,
  run,
  scratch,
} from "../../../../scripts/lib/launchpad-fixture.mjs";
import {
  CONFIG_FILENAME,
  WORKER_MODELS_FILE,
  loadConfig,
} from "../../../../scripts/lib/config.mjs";
import { metaMain } from "../../../../scripts/meta.mjs";

// The usage report counts an observation on the host's own calendar day;
// the zone is named here so that the saved report does not depend on, or
// state, the zone of the machine that wrote it.
process.env.TZ = "America/New_York";

const here = dirname(fileURLToPath(import.meta.url));
const save = (name, text) => writeFileSync(join(here, name), text);
// No session of this host stands behind the instance's commands.
const quiet = {
  ...env,
  CLAUDE_CODE_SESSION_ID: "",
  CLAUDE_SESSION_ID: "",
  DOTLN_DRIVEN_WORKER: "",
  TZ: "America/New_York",
};

test("Part J: the emitted definition, the listing and the launches, the refusals and the usage report", async () => {
  const results = {
    what: "Part J's observations in an exported instance that names a model and three workers of its own.",
    command:
      "node scripts/harness.mjs bounded -- node --test docs/evidence/WO-276/part-j/evidence.mjs",
  };
  const instance = commitWarmExport(join(scratch, "part-j-instance"));
  // Nothing of this host in a saved output.
  const plain = (text) =>
    text.replaceAll(instance, "<instance>").replaceAll(scratch, "<scratch>");
  const node = (args) =>
    run(process.execPath, args, { cwd: instance, env: quiet });

  // Criterion J1: a model of the instance's own, the default worker and the
  // verifier bound to it for Claude, and a worker of the instance's own.
  const workers = {
    default: { claude: "small" },
    verifier: { claude: { model: "small", effort: "max" } },
    "night-review": {
      description: "Reviews that run unattended.",
      codex: { model: "astra", effort: "high" },
    },
  };
  const models = {
    schemaVersion: 1,
    models: { small: { provider: "claude", id: "model-a", effort: "high" } },
  };
  const configuration = JSON.parse(
    readFileSync(join(instance, CONFIG_FILENAME), "utf8"),
  );
  const never = readFileSync(
    join(instance, ".claude/agents/dotln-worker.md"),
    "utf8",
  );
  writeFileSync(
    join(instance, CONFIG_FILENAME),
    `${JSON.stringify({ ...configuration, workers }, null, 2)}\n`,
  );
  writeFileSync(
    join(instance, WORKER_MODELS_FILE),
    `${JSON.stringify(models, null, 2)}\n`,
  );
  const stale = harness(instance, "check", [], { env: quiet });
  const emit = ok(harness(instance, "emit", [], { env: quiet }), "emit");
  const check = ok(harness(instance, "check", [], { env: quiet }), "check");
  const definition = readFileSync(
    join(instance, ".claude/agents/dotln-worker.md"),
    "utf8",
  );
  const front = definition.split("\n");
  assert.ok(front.includes("model: model-a"));
  assert.ok(front.includes("effort: high"));
  assert.notEqual(definition, never);
  assert.notEqual(stale.status, 0, "check before the instance's own emit");
  save("dotln-worker.emitted.txt", definition);
  // No emitted definition is named for a model.
  const agents = readdirSync(join(instance, ".claude/agents")).sort();
  assert.deepEqual(agents, [
    "dotln-executor.md",
    "dotln-release-close.md",
    "dotln-reviewer.md",
    "dotln-verifier.md",
    "dotln-worker.md",
  ]);
  results.definition = {
    workers,
    models,
    agents,
    path: ".claude/agents/dotln-worker.md",
    checkBeforeEmit: stale.status,
    emit: emit.status,
    check: check.status,
    frontMatter: front.filter((line) => /^(?:model|effort): /u.test(line)),
  };

  // Criterion J2: what a session reads. The listing, and one name shown.
  const listing = ok(node(["scripts/worker.mjs", "list"]), "the listing");
  assert.match(
    listing.stdout,
    /^ {2}night-review: Reviews that run unattended\.\n {4}codex: astra \(.+\) at high; /mu,
  );
  const shown = JSON.parse(
    ok(node(["scripts/worker.mjs", "show", "night-review"]), "one name shown")
      .stdout,
  );
  assert.deepEqual(
    [shown.provider, shown.model.name, shown.effort, shown.receipt],
    ["codex", "astra", "high", "--worker-type codex-spawn-agent"],
  );
  // The preamble is the worker's standing rules, a long paragraph the
  // generated definition also holds; the saved output names its length.
  const preamble = shown.session.preamble;
  assert.match(preamble, /never start a test-runner gate in any form/u);
  shown.session.preamble = `<the worker's standing rules, ${preamble.length} characters>`;

  // First launch: the review helper's dry run.
  const review = ok(
    node([
      "scripts/worker.mjs",
      "review",
      "--kind",
      "criteria",
      "--host",
      "claude",
      "--order",
      "WO-001",
      "--dry-run",
    ]),
    "the review helper's dry run",
  );
  const dry = JSON.parse(review.stdout);
  const flag = (argv, name) => argv[argv.indexOf(name) + 1];
  assert.deepEqual(
    [flag(dry.argv, "--model"), flag(dry.argv, "--effort")],
    ["model-a", "high"],
  );

  // Second launch: the one the refuter prints beside its prompt for the
  // option. A fresh export holds no planning pass for the command to judge,
  // so the launch is read from the command's own function in the instance;
  // the direct-command case of scripts/test-plan-refutation.mjs asserts the
  // same launch through the command, on a launchpad that holds a pass.
  const refuter = await import(
    pathToFileURL(join(instance, "scripts/refute-plan.mjs"))
  );
  const sessions = [
    "CODEX_THREAD_ID",
    "CLAUDE_CODE_SESSION_ID",
    "CLAUDE_SESSION_ID",
  ];
  const held = Object.fromEntries(
    sessions.map((key) => [key, process.env[key]]),
  );
  let launch;
  try {
    for (const key of sessions) delete process.env[key];
    launch = await refuter.directLaunch(instance, "small");
  } finally {
    for (const [key, value] of Object.entries(held))
      if (value !== undefined) process.env[key] = value;
  }
  assert.deepEqual(
    [
      launch.model.id,
      launch.effort,
      launch.session.arguments.subagent_type,
      launch.session.exact,
    ],
    ["model-a", "high", "dotln-worker", true],
  );

  // Third launch: the arguments the drive gives a phase's session. The
  // drive's own builder makes them from the phase's definition; the parts
  // that are not this criterion's (the session's settings, its tools and
  // its appended prompt) are placeholders here.
  const drive = await import(
    pathToFileURL(join(instance, "scripts/lib/drive-session.mjs"))
  );
  const { claudeLaunchArgs, sandboxLaunchForm } = await import(
    pathToFileURL(join(instance, "scripts/lib/drive-worker.mjs"))
  );
  const phases = {};
  for (const role of ["executor", "verifier"]) {
    const phase = await drive.phaseDefinition(instance, role, "claude");
    const argv = claudeLaunchArgs({
      worker: "<worker>",
      definitions: "<definitions>",
      role,
      directories: ["<launchpad>"],
      definition: phase.definition,
      profile: { claudeAppendix: "<appendix>", tools: "<tools>" },
      form: sandboxLaunchForm("claude", "host"),
      dollarLimit: null,
      phrase: role === "executor" ? "resume: next" : "resume: verify",
    });
    phases[role] = {
      arguments: argv.slice(
        argv.indexOf("--agent"),
        argv.indexOf("--effort") + 2,
      ),
      modelKey: phase.modelKey,
    };
  }
  assert.deepEqual(
    [
      flag(phases.executor.arguments, "--model"),
      flag(phases.executor.arguments, "--effort"),
      flag(phases.verifier.arguments, "--model"),
      flag(phases.verifier.arguments, "--effort"),
    ],
    ["model-a", "high", "model-a", "max"],
  );
  const words = (argv) =>
    argv
      .map((word) => (/^[\w@%+=:,./<>-]+$/u.test(word) ? word : `'${word}'`))
      .join(" ");
  save(
    "launches.txt",
    [
      `# In an exported instance whose ${CONFIG_FILENAME} holds "workers": ${JSON.stringify(workers)}`,
      `# and whose ${WORKER_MODELS_FILE} holds ${JSON.stringify(models)}.`,
      "",
      "## npm run worker -- list",
      plain(listing.stdout).trimEnd(),
      "",
      "## npm run worker -- show night-review",
      JSON.stringify(shown, null, 2),
      "",
      "## 1. npm run worker -- review --kind criteria --host claude --order WO-001 --dry-run",
      `option: ${JSON.stringify(dry.option)}`,
      `launch: ${plain(words(dry.argv.slice(0, dry.argv.indexOf("--effort") + 2)))} ...`,
      "",
      "## 2. npm run plan -- refute --model small (the launch it prints beside the prompt, from the command's own function)",
      JSON.stringify(launch, null, 2),
      "",
      "## 3. The drive's arguments for a phase's Claude session (the phase's agent, model and effort)",
      `resume: next   ${words(phases.executor.arguments)}`,
      `resume: verify ${words(phases.verifier.arguments)}`,
      `where a failed launch says the instance wrote the executor's model: ${phases.executor.modelKey}`,
      `and the verifier's: ${phases.verifier.modelKey}`,
      "",
    ].join("\n"),
  );
  results.launches = {
    review: {
      model: flag(dry.argv, "--model"),
      effort: flag(dry.argv, "--effort"),
    },
    refute: { model: launch.model.id, effort: launch.effort },
    show: {
      name: shown.name,
      provider: shown.provider,
      model: shown.model.id,
      effort: shown.effort,
    },
    drive: Object.fromEntries(
      Object.entries(phases).map(([role, phase]) => [
        role,
        {
          model: flag(phase.arguments, "--model"),
          effort: flag(phase.arguments, "--effort"),
        },
      ]),
    ),
  };

  // Criterion J3: each malformed section or models file is refused as the
  // configuration loads, naming the file and the key.
  const malformed = join(scratch, "part-j-malformed");
  mkdirSync(malformed, { recursive: true });
  const refusals = [
    [
      "an unknown key",
      { night: { claude: { model: "fable", temperature: 1 } } },
    ],
    ["a binding to a model that is not listed", { night: { claude: "small" } }],
    ["a name that would mean two things", { fable: { claude: "opus" } }],
    [
      "an effort outside its provider's levels",
      { night: { claude: { model: "fable", effort: "extreme" } } },
    ],
    [
      "a negative price",
      {},
      {
        schemaVersion: 1,
        prices: {
          "model-a": {
            uncachedInput: 3,
            cacheRead: 0.3,
            cacheWrite: 3.75,
            output: -1,
          },
        },
      },
    ],
  ].map(([label, section, file]) => {
    writeFileSync(
      join(malformed, CONFIG_FILENAME),
      `${JSON.stringify({ version: 1, workers: section })}\n`,
    );
    if (file)
      writeFileSync(
        join(malformed, WORKER_MODELS_FILE),
        `${JSON.stringify(file)}\n`,
      );
    else rmSync(join(malformed, WORKER_MODELS_FILE), { force: true });
    let message = null;
    try {
      loadConfig(malformed);
    } catch (error) {
      message = plain(error.message).replaceAll(malformed, "<root>");
    }
    assert.ok(message, label);
    assert.match(message, /dotln\.(?:config|models)\.json#/u, label);
    return { label, section, file, message };
  });
  save(
    "refusals.txt",
    [
      `# loadConfig on a ${CONFIG_FILENAME} holding each workers section below, with the models file shown where there is one.`,
      ...refusals.flatMap(({ label, section, file, message }) => [
        "",
        `## ${label}`,
        `workers: ${JSON.stringify(section)}`,
        ...(file ? [`${WORKER_MODELS_FILE}: ${JSON.stringify(file)}`] : []),
        `refused: ${message}`,
      ]),
      "",
    ].join("\n"),
  );
  results.refusals = refusals.map(({ label, message }) => ({ label, message }));

  // Criterion J6: the usage report of a small ledger, without a price and
  // with one. One executor session on Claude Code is observed twice, each
  // time counted from its start: at half past three in the morning UTC,
  // which is the evening before in the report's zone, and again that
  // afternoon at twice the count. One verifier session on Codex follows.
  // The order's log attests model-a in the executor's session and model-c
  // in the verifier's.
  const ledger = join(scratch, "part-j-usage");
  mkdirSync(join(ledger, "docs/control/orders"), { recursive: true });
  mkdirSync(join(ledger, "docs/control/local/process"), { recursive: true });
  initRepository(ledger);
  const lines = (rows) =>
    rows.map((row) => JSON.stringify(row)).join("\n") + "\n";
  writeFileSync(join(ledger, ".gitignore"), "docs/control/local/\n");
  writeFileSync(
    join(ledger, "package.json"),
    `${JSON.stringify({ type: "module" })}\n`,
  );
  writeFileSync(
    join(ledger, "docs/control/orders/WO-999.jsonl"),
    lines(
      [
        {
          type: "WorkOrderActivated",
          workOrderPath: "docs/work-orders/WO-999-fixture.md",
          recordedAt: "2026-11-09T00:00:00.000Z",
        },
        {
          type: "ImplementationReady",
          recordedAt: "2026-11-10T15:30:00.000Z",
          actor: { model: "model-a" },
        },
        {
          type: "VerificationRequested",
          recordedAt: "2026-11-10T15:30:01.000Z",
          verificationId: "VER-001",
        },
        {
          type: "VerificationCompleted",
          recordedAt: "2026-11-11T15:30:00.000Z",
          verificationId: "VER-001",
          verdict: "pass",
          actor: { model: "model-c" },
        },
      ].map((event) => ({ schemaVersion: 1, workOrderId: "WO-999", ...event })),
    ),
  );
  const observed = (role, source, usage, startedAt, observedAt) => ({
    workOrder: "WO-999",
    role,
    startedAt,
    durationMs: Date.parse(observedAt) - Date.parse(startedAt),
    sessionKey: `${role} session`,
    observation: { source, scope: "dispatch", observedAt, usage },
    recordedAt: observedAt,
  });
  const claude = {
    inputTokens: 1000,
    cachedInputTokens: 400,
    cacheWriteInputTokens: 50,
    outputTokens: 200,
    totalTokens: 1650,
    costUsd: null,
  };
  const codex = {
    inputTokens: 1000,
    cachedInputTokens: 400,
    cacheWriteInputTokens: null,
    outputTokens: 200,
    totalTokens: 1200,
    costUsd: null,
  };
  writeFileSync(
    join(ledger, "docs/control/local/process/usage.jsonl"),
    lines([
      observed(
        "executor",
        "claude-transcript-message-usage",
        claude,
        "2026-11-10T02:00:00.000Z",
        "2026-11-10T03:30:00.000Z",
      ),
      observed(
        "executor",
        "claude-transcript-message-usage",
        Object.fromEntries(
          Object.entries(claude).map(([name, value]) => [
            name,
            typeof value === "number" ? value * 2 : value,
          ]),
        ),
        "2026-11-10T02:00:00.000Z",
        "2026-11-10T15:00:00.000Z",
      ),
      observed(
        "verifier",
        "codex-transcript-counter",
        codex,
        "2026-11-11T14:00:00.000Z",
        "2026-11-11T15:00:00.000Z",
      ),
    ]),
  );
  const report = async () => {
    const printed = [];
    const log = console.log;
    console.log = (line) => printed.push(line);
    try {
      await metaMain(["--usage"], ledger);
    } finally {
      console.log = log;
    }
    return printed.join("\n");
  };
  const unpriced = await report();
  const prices = {
    "model-a": {
      uncachedInput: 3,
      cacheRead: 0.3,
      cacheWrite: 3.75,
      output: 15,
    },
  };
  writeFileSync(
    join(ledger, WORKER_MODELS_FILE),
    `${JSON.stringify({ schemaVersion: 1, prices }, null, 2)}\n`,
  );
  const priced = await report();
  assert.match(unpriced, /^No price is declared in dotln\.models\.json/mu);
  assert.doesNotMatch(unpriced, /\(an estimate\)/u);
  assert.match(
    priced,
    /^  WO-999 executor \(model-a\): .*; estimate \$0\.01 \(an estimate\)$/mu,
  );
  assert.match(
    priced,
    /^  WO-999 verifier \(model-c\): .*cache write unknown; .*; estimate unknown$/mu,
  );
  assert.match(priced, /^2026-11-09: /mu);
  save(
    "usage.txt",
    [
      "# npm run meta -- --usage, over a ledger of three observations of two sessions (see evidence.mjs), in the zone America/New_York.",
      "",
      "## With no price declared",
      unpriced,
      "",
      `## With ${WORKER_MODELS_FILE} holding "prices": ${JSON.stringify(prices)}`,
      priced,
      "",
    ].join("\n"),
  );
  results.usage = {
    timeZone: "America/New_York",
    observations: 3,
    days: [...priced.matchAll(/^(\d{4}-\d{2}-\d{2}): /gmu)].map(
      (row) => row[1],
    ),
    prices,
  };

  // No saved output names this host.
  for (const name of [
    "dotln-worker.emitted.txt",
    "launches.txt",
    "refusals.txt",
    "usage.txt",
  ])
    assert.doesNotMatch(
      readFileSync(join(here, name), "utf8"),
      /\/(?:Users|home|private|var|tmp)\//u,
      name,
    );
  save("results.json", `${JSON.stringify(results, null, 2)}\n`);
});
