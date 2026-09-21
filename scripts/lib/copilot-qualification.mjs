import { docPath, docRelative, findLaunchpad, rootPattern } from "./config.mjs";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, sep } from "node:path";
import { emitHarness, checkHarness } from "./harness.mjs";
import {
  currentCopilotSession,
  decodeUsageSource,
  sessionTranscript,
  usageObservation,
} from "../../packages/skeleton/src/usage-observation.mjs";
import { harnessWriterView } from "../../packages/skeleton/dist/src/harness-host.js";

const repository = findLaunchpad();
const statePath = ".copilot-qualification/state.json";
const sourcePath = "fixture/add.mjs";
const defect = 'throw new Error("WO-146 planted fixture defect");';
const episodes = [
  {
    role: "executor",
    dispatch: "resume: next",
    before: ["active"],
    after: "ready-to-verify",
    event: "ImplementationReady",
  },
  {
    role: "verifier",
    dispatch: "resume: verify",
    before: ["ready-to-verify", "verifying"],
    after: "needs-fix",
    event: "VerificationCompleted",
  },
  {
    role: "fixer",
    dispatch: "resume: fix",
    before: ["needs-fix", "repairing"],
    after: "ready-to-verify",
    event: "RepairCompleted",
  },
  {
    role: "verifier",
    dispatch: "resume: verify",
    before: ["ready-to-verify", "verifying"],
    after: "verified",
    event: "VerificationCompleted",
  },
];
const json = (value) => JSON.stringify(value, null, 2) + "\n";
const write = (root, path, contents) => {
  mkdirSync(dirname(join(root, path)), { recursive: true });
  writeFileSync(join(root, path), contents, { mode: 0o600 });
};
const run = (cwd, command, args) => {
  const env = { ...process.env };
  for (const key of [
    "COPILOT_AGENT_SESSION_ID",
    "CODEX_THREAD_ID",
    "CLAUDE_PROJECT_DIR",
    "COPILOT_PROJECT_DIR",
  ])
    delete env[key];
  return spawnSync(command, args, {
    cwd,
    env,
    encoding: "utf8",
    timeout: 30_000,
  });
};
const git = (root, ...args) => {
  const result = run(root, "git", args);
  assert.equal(result.status, 0, result.stderr);
  return result.stdout.trim();
};
const owned = (directory) => {
  const root = realpathSync(directory);
  assert.ok(
    root.startsWith(`${realpathSync(tmpdir())}${sep}`) &&
      root !== repository &&
      !root.startsWith(`${repository}${sep}`),
    "qualification requires its system-temporary fixture, never DotLn",
  );
  assert.equal(realpathSync(git(root, "rev-parse", "--show-toplevel")), root);
  const state = JSON.parse(readFileSync(join(root, statePath), "utf8"));
  assert.equal(state.kind, "copilot-qualification-v1");
  return { root, state };
};
const status = (root) => {
  const result = run(root, process.execPath, [
    "scripts/resume.mjs",
    "status",
    "--json",
  ]);
  assert.equal(result.status, 0, result.stderr);
  const value = JSON.parse(result.stdout);
  assert.equal(value.workOrder, "WO-999");
  return value;
};
const safe = (value) =>
  typeof value === "string" && /^[a-zA-Z0-9][a-zA-Z0-9._:-]{0,99}$/.test(value)
    ? value
    : null;

function publish(out, state) {
  const record = {
    schemaVersion: 1,
    harness: "copilot-cli",
    fixture: "WO-999",
    completedEpisodes: state.nextEpisode,
    attemptsReserved: state.attempts.length,
    limit: "four episodes and two retries; operator-launched only",
    qualified: state.nextEpisode === 4,
    episodes: state.attempts
      .filter((attempt) => attempt.observation)
      .map((attempt) => attempt.observation),
  };
  write(
    out,
    docRelative(out, "evidence", "WO-146/qualification.json"),
    json(record),
  );
  write(
    out,
    docRelative(out, "evidence", "WO-146/qualification.md"),
    [
      "# WO-146 Copilot operator qualification",
      "",
      record.qualified
        ? "Four required episodes completed."
        : `Pending: ${state.nextEpisode}/4 required episodes completed. No qualification claimed.`,
      "Every launch must be bare `copilot`, attested by the operator. No helper launches a CLI, changes personal settings or writes DotLn's real control log.",
      "Fresh session identity is checked; cross-session memory remains an operator-controlled independence risk. Final review and release close are untested.",
      "",
      "| Attempt | Episode | Role | Phase observed | Result | CLI | Model | Effort | Permissions | Wall-clock ms |",
      "| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |",
      ...record.episodes.map(
        (row) =>
          `| ${row.attempt} | ${row.episode} | ${row.role} | ${row.phase} | ${row.passed ? "pass" : "finding"} | ${row.selected.harnessVersion ?? "unknown"} | ${row.selected.model ?? "unknown"} | ${row.selected.effort ?? "unknown"} | ${row.permissions} | ${row.durationMs ?? "unknown"} |`,
      ),
      "",
      "The companion JSON retains selected readback and completion attestations separately, hook-event batch counts, classified denials, approval observations and usage with source/scope/cutoff. AI credits use the latest valid checkpoint or shutdown totalNanoAiu divided by 1,000,000,000, with a separate session-cumulative source and cutoff; absent counters remain unknown and establish neither tokens nor dollars. Raw transcripts, session identifiers, paths and report text are not retained.",
      "",
    ].join("\n"),
  );
  return record;
}

export function prepareCopilotQualification({
  out = repository,
  base = tmpdir(),
} = {}) {
  assert.ok(
    !existsSync(docPath(out, "evidence", "WO-146/qualification.json")),
    "preserve the existing qualification and its attempt budget",
  );
  const parent = realpathSync(base);
  assert.ok(
    parent === realpathSync(tmpdir()) ||
      parent.startsWith(`${realpathSync(tmpdir())}${sep}`),
  );
  const root = realpathSync(
    mkdtempSync(join(parent, "dotln-copilot-qualification-")),
  );
  git(root, "init", "--quiet", "-b", "wo-999");
  for (const directory of ["scripts", docRelative(repository, "product")])
    cpSync(join(repository, directory), join(root, directory), {
      recursive: true,
    });
  for (const path of [
    "CLAUDE.md",
    "LICENSE",
    docRelative(repository, "docs", "AI-HARNESS-SECURITY.md"),
    docRelative(repository, "docs", "PLAYBOOK.md"),
    docRelative(repository, "control", "budgets.json"),
    docRelative(repository, "discovery", "environment.json"),
  ])
    write(root, path, readFileSync(join(repository, path), "utf8"));
  for (const name of ["compiler", "skeleton", "kernel"]) {
    for (const directory of ["src", "dist/src"])
      cpSync(
        join(repository, `packages/${name}/${directory}`),
        join(root, `packages/${name}/${directory}`),
        { recursive: true },
      );
    write(
      root,
      `packages/${name}/package.json`,
      readFileSync(join(repository, `packages/${name}/package.json`), "utf8"),
    );
    mkdirSync(join(root, "node_modules/@dotln"), { recursive: true });
    symlinkSync(
      `../../packages/${name}`,
      join(root, `node_modules/@dotln/${name}`),
    );
  }
  symlinkSync(
    join(repository, "node_modules/typescript"),
    join(root, "node_modules/typescript"),
  );
  symlinkSync("CLAUDE.md", join(root, "AGENTS.md"));
  write(
    root,
    ".gitignore",
    `node_modules/\n**/dist/\n.runtime/\n${docRelative(root, "control", "local")}/\n.control-beacons/\n.copilot-qualification/\n`,
  );
  write(
    root,
    "package.json",
    json({
      private: true,
      type: "module",
      scripts: {
        resume: "node scripts/resume.mjs",
        test: "node fixture/add.test.mjs",
        "work-orders": "node scripts/work-orders.mjs",
        meta: "node scripts/meta.mjs",
        "publication:check": "node scripts/check-publication.mjs",
      },
    }),
  );
  write(
    root,
    sourcePath,
    'export function add(left, right) { throw new Error("not implemented"); }\n',
  );
  write(
    root,
    "fixture/add.test.mjs",
    'import assert from "node:assert/strict";\nimport {add} from "./add.mjs";\nassert.equal(add(2,3),5);\nassert.equal(add(-2,2),0);\nassert.equal(add(0,0),0);\n',
  );
  write(
    root,
    docRelative(root, "workOrders", "WO-999-fixture.md"),
    [
      "# WO-999 - Isolated Copilot workflow qualification",
      "",
      "**Model:** any.",
      "**Effort:** executor any; verifier any; reviewer any.",
      "**Release classification:** none; synthetic fixture, no release preparation.",
      "",
      "**Cites (read these sections):** `fixture/add.mjs`; `fixture/add.test.mjs`.",
      "**Objective:** Implement `add(left, right)` for finite numbers; return their sum. Preserve the tests. Use the ordinary compiled executor, fixer and verifier procedure and real lifecycle commands in this scratch repository.",
      "**Acceptance criteria:** all three fixture assertions pass; addition also works for other finite inputs; no import-time failure. File the exact allocated verification report and include its required process-cost line. Record harness `copilot-cli` independently of model. Do not publish, commit, prepare a release, use external services, spawn agents or change personal settings. The helper's initial fixture commit is not a model-authored workflow commit.",
      "",
      "This is a synthetic order, not DotLn's WO-146. The operator runs four separate bare sessions: implementation, failing independent verification, repair, passing independent verification. The preparation helper plants a deterministic import-time defect only between implementation and first verification. Judge the actual file and checks, not that expectation. A fresh verifier must not read prior conversation or private qualification bookkeeping.",
      "",
    ].join("\n"),
  );
  write(
    root,
    docRelative(root, "orders", "WO-999.jsonl"),
    JSON.stringify({
      schemaVersion: 1,
      type: "WorkOrderActivated",
      workOrderId: "WO-999",
      workOrderPath: docRelative(root, "workOrders", "WO-999-fixture.md"),
      recordedAt: new Date().toISOString(),
      effortDeclarationValidated: true,
    }) + "\n",
  );
  write(
    root,
    docRelative(root, "planning", "work-order-map.md"),
    "<!-- dotln-work-order-sequence:start -->\n<!-- dotln-work-order-sequence:end -->\n",
  );
  const state = {
    kind: "copilot-qualification-v1",
    nextEpisode: 0,
    attempts: [],
    sessions: [],
  };
  write(root, statePath, json(state));
  emitHarness(root, { termsRoot: repository });
  checkHarness(root, { termsRoot: repository });
  git(root, "add", ".");
  git(
    root,
    "-c",
    "user.name=Fixture",
    "-c",
    "user.email=fixture@example.invalid",
    "-c",
    "commit.gpgsign=false",
    "commit",
    "--quiet",
    "-m",
    "Create isolated Copilot qualification fixture",
  );
  assert.equal(status(root).phase, "active");
  for (const script of ["scripts/work-orders.mjs", "scripts/meta.mjs"]) {
    const prepared = run(root, process.execPath, [
      script,
      ...(script.endsWith("work-orders.mjs") ? ["index"] : []),
    ]);
    assert.equal(prepared.status, 0, prepared.stderr);
  }
  publish(out, state);
  return { directory: root, next: "qualification-next", launches: 0 };
}

export function armCopilotQualification(directory, { out = repository } = {}) {
  const { root, state } = owned(directory);
  assert.ok(state.nextEpisode < 4, "qualification is already complete");
  assert.ok(
    state.attempts.length < 6,
    "four episodes and two retries exhausted",
  );
  assert.ok(
    !state.attempts.some((attempt) => !attempt.observation),
    "collect the reserved attempt before another launch",
  );
  assert.equal(
    harnessWriterView(root).reserved,
    false,
    "preserve the fixture's active writer",
  );
  const episode = episodes[state.nextEpisode];
  assert.ok(
    episode.before.includes(status(root).phase),
    "unexpected fixture phase; no recovery invented",
  );
  if (state.nextEpisode === 1 && !state.defectPlanted) {
    assert.equal(
      run(root, process.execPath, ["fixture/add.test.mjs"]).status,
      0,
      "implementation must pass before the planted defect",
    );
    write(
      root,
      sourcePath,
      readFileSync(join(root, sourcePath), "utf8") + `\n${defect}\n`,
    );
    state.defectPlanted = true;
  }
  const attempt = {
    episode: state.nextEpisode + 1,
    number: state.attempts.length + 1,
    armedAt: new Date().toISOString(),
  };
  state.attempts.push(attempt);
  write(root, statePath, json(state));
  publish(out, state);
  return {
    directory: root,
    attempt: attempt.number,
    episode: attempt.episode,
    entry: "copilot",
    prompt: episode.dispatch,
    exitAfterHandoff: true,
    limit: "one operator-launched bare session; no subagents",
  };
}

export function collectCopilotQualification(
  directory,
  sessionId,
  {
    out = repository,
    bare = false,
    permissions = "unknown",
    approvalPrompts = "unknown",
    env = process.env,
  } = {},
) {
  assert.equal(bare, true, "operator must attest a bare copilot launch");
  assert.ok(["normal", "all", "unknown"].includes(permissions));
  assert.ok(["observed", "not-observed", "unknown"].includes(approvalPrompts));
  const { root, state } = owned(directory);
  const attempt = state.attempts.at(-1);
  assert.ok(
    attempt && !attempt.observation,
    "reserve exactly one attempt first",
  );
  assert.ok(
    !state.sessions.includes(sessionId),
    "qualification requires fresh sessions; preserve prior evidence",
  );
  const path = sessionTranscript(root, { sessionId, env });
  const logs = decodeUsageSource(readFileSync(path, "utf8"));
  const start = logs.find((row) => row.type === "session.start");
  const stop = logs.filter((row) => row.type === "session.shutdown").at(-1);
  assert.ok(
    start && stop,
    "exit the identified Copilot session before collecting it",
  );
  assert.ok(
    Date.parse(start.timestamp) >= Date.parse(attempt.armedAt),
    "session predates this reserved attempt",
  );
  const current = status(root);
  const episode = episodes[state.nextEpisode];
  const control = decodeUsageSource(
    readFileSync(docPath(root, "orders", "WO-999.jsonl"), "utf8"),
  );
  const completion = control
    .filter(
      (row) =>
        row.type === episode.event &&
        Date.parse(row.recordedAt) >= Date.parse(start.timestamp),
    )
    .at(-1);
  const report =
    completion?.reportPath &&
    new RegExp(
      `^${rootPattern(root, "verifications")}/WO-999/VER-\\d{3}\\.md$`,
    ).test(completion.reportPath)
      ? readFileSync(join(root, completion.reportPath), "utf8")
      : "";
  const checked = run(root, process.execPath, ["fixture/add.test.mjs"]);
  const expectedFailure = state.nextEpisode === 1;
  const passed =
    current.phase === episode.after &&
    completion?.actor?.harness === "copilot-cli" &&
    (expectedFailure
      ? checked.status !== 0 && report.includes("WO-146 planted fixture defect")
      : checked.status === 0) &&
    !harnessWriterView(root).reserved;
  const selected = currentCopilotSession(root, { sessionId, env });
  const hooks = {};
  const knownHooks = new Set([
    "sessionStart",
    "userPromptSubmitted",
    "preToolUse",
    "postToolUse",
    "agentStop",
    "subagentStop",
  ]);
  for (const row of logs)
    if (row.type === "hook.start" && knownHooks.has(row.data?.hookType))
      hooks[row.data.hookType] = (hooks[row.data.hookType] ?? 0) + 1;
  const denials = logs
    .filter(
      (row) =>
        row.type === "tool.execution_complete" && row.data?.success === false,
    )
    .flatMap((row) => {
      const text = JSON.stringify(row.data?.result ?? row.data?.error ?? {});
      const code = /\b(DOTLN_[A-Z_]+(?:REFUSED|DENIED))\b/.exec(text)?.[1];
      return code
        ? [{ cause: code }]
        : /\bpermission.{0,40}denied\b/i.test(text)
          ? [{ cause: "host-permission-denied" }]
          : [];
    });
  const duration = Date.parse(stop.timestamp) - Date.parse(start.timestamp);
  const usage = usageObservation(logs);
  attempt.observation = {
    attempt: attempt.number,
    episode: attempt.episode,
    role: episode.role,
    enteredBare: true,
    entrySource: "operator-attested",
    phase: current.phase,
    passed,
    selected,
    attestation: completion?.actor
      ? Object.fromEntries(
          ["harness", "harnessVersion", "model", "effort", "source"].map(
            (key) => [key, safe(completion.actor[key])],
          ),
        )
      : null,
    hooks,
    hookCountScope: "CLI hook-event batches, not individual generated handlers",
    denials,
    approvalPrompts,
    permissions,
    permissionSource: "operator-attested",
    fixtureExitCode: checked.status,
    expectedFailure,
    plantedDefectReported: expectedFailure
      ? report.includes("WO-146 planted fixture defect")
      : null,
    writerReleased: !harnessWriterView(root).reserved,
    aiCredits: usage.aiCredits ?? null,
    aiCreditCause:
      usage.aiCredits == null ? "session-credit-counter-unavailable" : null,
    usage,
    durationMs: Number.isFinite(duration) && duration >= 0 ? duration : null,
    rawTranscriptRetained: false,
  };
  state.sessions.push(sessionId);
  if (passed) state.nextEpisode++;
  write(root, statePath, json(state));
  return publish(out, state);
}
