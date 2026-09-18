import test from "node:test";
import "./test-target-harness.mjs";
import "./test-observed-facts.mjs";
import {
  journalRows,
  appendObservation,
  correctionCounts,
} from "../packages/skeleton/dist/src/observed-facts.js";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import {
  observedSpawnSync as spawnSync,
  observedSpawn as spawn,
} from "../packages/skeleton/src/gate-deadlines.mjs";
import {
  deadlineLimit,
  startDeadline,
} from "../packages/skeleton/src/gate-deadlines.mjs";
import { createHash } from "node:crypto";
import {
  cpSync,
  chmodSync,
  existsSync,
  linkSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  realpathSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, isAbsolute, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  compileFeedbackUnits,
  applyFeedbackCorrection,
  compileLoadout,
  seiriLoadout,
} from "../packages/compiler/dist/src/index.js";
import { contributorProgram } from "../packages/skeleton/dist/src/loadouts/contributor.js";
import {
  personalFeedbackUnits,
  retainedFeedbackUnitsV1,
} from "../packages/skeleton/dist/src/loadouts/feedback.js";
import { entropyReducerLoadout } from "../packages/skeleton/dist/src/loadouts/entropy-reducer.js";
import {
  feedbackBoundary,
  FeedbackRefused,
} from "../packages/skeleton/dist/src/feedback-boundary.js";
import {
  beginHarnessSession,
  measureHarnessSessionUsage,
  measureHarnessUsage,
  harnessOutputObligations,
  harnessControl,
  harnessFeedbackFacts,
  harnessHostProcess,
  harnessOutputs,
  harnessProcessAlive,
  harnessWriterView,
  evaluateHarnessHook,
  readHarnessOutput,
  releaseHarnessWriter,
  runHarnessEvidence,
  seedHarnessWriter,
} from "../packages/skeleton/dist/src/harness-host.js";
import {
  checkHarness,
  emitHarness,
  harnessInstallation,
} from "./lib/harness.mjs";
import { termsCheck } from "./terms.mjs";
import { executorWriterRelease } from "./lib/executor-handoff.mjs";
import {
  compareObservedReads,
  countReads,
  directedReads,
  scopeReadEvidence,
} from "./lib/harness-context.mjs";
import {
  checkContextMeasurement,
  measureHarnessContext,
} from "./harness-context.mjs";
import {
  activeGateRuns,
  beginGateRun,
  gateInputPath,
  gateTreeHash,
} from "./lib/gate-evidence.mjs";

const sourceRoot = fileURLToPath(new URL("../", import.meta.url));
// Fixtures own the harness-process identity: generated hooks record this test
// process as the live reservation owner, and an outer session's declared
// process cannot leak into fixture state.
process.env.CLAUDE_PID = String(process.pid);
const git = (root, ...args) =>
  execFileSync("git", args, {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();
const write = (root, path, contents) => {
  mkdirSync(dirname(join(root, path)), { recursive: true });
  writeFileSync(join(root, path), contents);
};
const json = (value) => JSON.stringify(value, null, 2) + "\n";
const writableFixtureCopy = (path) => {
  const info = lstatSync(path);
  if (info.isSymbolicLink()) return;
  chmodSync(path, info.mode | 0o200 | (info.isDirectory() ? 0o700 : 0));
  if (info.isDirectory())
    for (const name of readdirSync(path)) writableFixtureCopy(join(path, name));
};
const removeFixture = (path, options) => {
  if (existsSync(path)) writableFixtureCopy(path);
  rmSync(path, options);
};
const control = {
  workOrder: "WO-999",
  workOrderPath: "docs/work-orders/WO-999-fixture.md",
  phase: "active",
  latestVerdict: null,
};
function fixture() {
  const root = realpathSync(mkdtempSync(join(tmpdir(), "dotln-harness-test-")));
  git(root, "init", "-b", "wo-999");
  assert.equal(realpathSync(git(root, "rev-parse", "--show-toplevel")), root);
  for (const name of ["compiler", "skeleton", "kernel"]) {
    cpSync(
      join(sourceRoot, `packages/${name}/dist/src`),
      join(root, `packages/${name}/dist/src`),
      { recursive: true },
    );
    // The replica's installed graph is read-only. This fixture owns a mutable
    // copy for deliberate damage and cleanup; never follow its external links.
    writableFixtureCopy(join(root, `packages/${name}/dist`));
    cpSync(
      join(sourceRoot, `packages/${name}/package.json`),
      join(root, `packages/${name}/package.json`),
    );
    mkdirSync(join(root, "node_modules/@dotln"), { recursive: true });
    symlinkSync(
      `../../packages/${name}`,
      join(root, `node_modules/@dotln/${name}`),
    );
  }
  symlinkSync(
    join(sourceRoot, "node_modules/typescript"),
    join(root, "node_modules/typescript"),
  );
  write(root, ".gitignore", "node_modules/\n**/dist/\ndocs/control/local/\n");
  write(
    root,
    "CLAUDE.md",
    "# Fixture locked floor\nKeep fixture source isolated.\n",
  );
  write(root, "fixture.ts", "export const value = 1;\n");
  write(
    root,
    "package.json",
    json({
      private: true,
      scripts: {
        test: "node fixture-check.mjs",
        "test:full": "node fixture-check.mjs",
      },
    }),
  );
  write(
    root,
    "fixture-check.mjs",
    'import assert from "node:assert/strict"; import {readFileSync} from "node:fs"; assert.match(readFileSync("fixture.ts", "utf8"), /value = 1/);\n',
  );
  write(
    root,
    "scripts/resume.mjs",
    'import {readFileSync} from "node:fs"; console.log(readFileSync("docs/control/fixture-status.json", "utf8"));\n',
  );
  for (const path of [
    "scripts/harness.mjs",
    "scripts/lib/harness.mjs",
    "scripts/lib/terms.mjs",
    "scripts/lib/paths.mjs",
  ]) {
    mkdirSync(dirname(join(root, path)), { recursive: true });
    cpSync(join(sourceRoot, path), join(root, path));
  }
  write(root, "docs/control/fixture-status.json", json(control));
  write(
    root,
    "docs/control/orders/WO-999.jsonl",
    json({ type: "WorkOrderActivated", workOrderId: "WO-999" }).replace(
      /\n\s*/g,
      "",
    ) + "\n",
  );
  write(
    root,
    "docs/work-orders/WO-999-fixture.md",
    "# Synthetic work order\nRead fixture.ts and run npm test.\n",
  );
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
    "-m",
    "Create fixture",
  );
  emitHarness(root);
  return root;
}
const input = (root, event, extra = {}) => ({
  cwd: root,
  session_id: "synthetic-session",
  hook_event_name: event,
  ...extra,
});

test("WO-139 Codex executor and fix completion automatically release after the final index", async () => {
  const root = fixture();
  try {
    for (const path of [
      "scripts/resume.mjs",
      "scripts/work-orders.mjs",
      "scripts/lib",
      "packages/skeleton/src",
    ])
      cpSync(join(sourceRoot, path), join(root, path), { recursive: true });
    rmSync(join(root, "docs/control/orders/WO-999.jsonl"));
    write(
      root,
      "docs/work-orders/WO-999-fixture.md",
      "# WO-999 — Fixture\n\n**Model:** fixture.\n**Effort:** executor any; verifier any; reviewer any.\n**Objective:** exercise completion ownership.\n",
    );
    write(
      root,
      "docs/planning/sequence.md",
      "<!-- dotln-work-order-sequence:start -->\n- WO-999 — Fixture\n<!-- dotln-work-order-sequence:end -->\n",
    );
    const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
    pkg.scripts["work-orders"] = "node scripts/work-orders.mjs";
    write(root, "package.json", json(pkg));
    const sessionId = "synthetic-session";
    const actor = [
      "--harness",
      "codex-cli",
      "--harness-version",
      "fixture",
      "--model",
      "fixture",
      "--effort",
      "high",
      "--source",
      "self-reported",
    ];
    const resume = (...args) =>
      spawnSync(process.execPath, ["scripts/resume.mjs", ...args], {
        cwd: root,
        encoding: "utf8",
        env: { ...process.env, CODEX_THREAD_ID: sessionId },
      });
    const pass = (...args) => {
      const result = resume(...args);
      assert.equal(result.status, 0, result.stderr);
      return result;
    };
    pass("activate", "WO-999", "docs/work-orders/WO-999-fixture.md");
    const acquire = (id = sessionId) => {
      assert.equal(
        allowed(
          invoke(
            root,
            "concurrent-work-requires-worktrees",
            input(root, "PreToolUse", {
              session_id: id,
              tool_name: "Write",
              tool_input: { file_path: join(root, "fixture.ts") },
            }),
          ),
        ),
        true,
      );
      assert.equal(
        harnessWriterView(root).alive,
        true,
        "the host remains alive through handoff",
      );
    };
    acquire();
    pass("next");
    assert.equal(harnessWriterView(root).reserved, true);
    assert.notEqual(resume("implementation-ready").status, 0);
    assert.equal(
      harnessWriterView(root).reserved,
      true,
      "invalid actor flags retain ownership",
    );
    write(root, "fixture.ts", "export const value = 1;  \n");
    assert.notEqual(resume("implementation-ready", ...actor).status, 0);
    assert.equal(
      harnessWriterView(root).reserved,
      true,
      "a failed diff check retains ownership",
    );
    write(root, "fixture.ts", "export const value = 1;\n");
    pass("implementation-ready", ...actor);
    assert.equal(harnessWriterView(root).reserved, false);
    assert.match(
      readFileSync(join(root, "docs/work-orders/README.md"), "utf8"),
      /ready-to-verify/,
    );
    const indexCheck = spawnSync(
      process.execPath,
      ["scripts/work-orders.mjs", "index", "--check"],
      { cwd: root, encoding: "utf8" },
    );
    assert.equal(indexCheck.status, 0, indexCheck.stderr);
    // A different verifier can acquire immediately without operator recovery.
    acquire("verifier-session");
    releaseHarnessWriter(
      root,
      input(root, "Stop", { session_id: "verifier-session" }),
    );
    pass("verify");
    write(
      root,
      "docs/verifications/WO-999/VER-001.md",
      '# Fixture finding\n\n**Actor attestation:** {"harness":"codex-cli","harnessVersion":"fixture","model":"fixture","effort":"high","source":"self-reported"}\n',
    );
    pass("verification-result", "fail", ...actor);
    acquire();
    pass("fix");
    assert.equal(
      harnessWriterView(root).reserved,
      true,
      "repair dispatch is not a handoff",
    );
    assert.notEqual(resume("repair-complete").status, 0);
    assert.equal(harnessWriterView(root).reserved, true);
    pass("repair-complete", ...actor);
    assert.equal(harnessWriterView(root).reserved, false);
    acquire();
    pass("fix");
    write(root, "docs/work-orders/README.md", "stale index\n");
    write(
      root,
      "docs/work-orders/README.md.tmp",
      "preserved interrupted projection\n",
    );
    const interrupted = resume("repair-complete", ...actor);
    assert.notEqual(interrupted.status, 0);
    assert.match(
      interrupted.stderr,
      /Completion recorded; final handoff failed:.*EEXIST/,
    );
    assert.match(interrupted.stderr, /Do not repeat the transition/);
    assert.equal(
      JSON.parse(pass("status", "--json").stdout).phase,
      "ready-to-verify",
    );
    assert.equal(
      harnessWriterView(root).reserved,
      false,
      "a post-append projection failure cannot strand the writer",
    );
    const release = await executorWriterRelease(root, sessionId);
    release();
    assert.equal(
      harnessWriterView(root).reserved,
      false,
      "cleanup is idempotent",
    );
    acquire("verifier-session");
    const foreign = harnessWriterView(root);
    release();
    assert.deepEqual(
      harnessWriterView(root),
      foreign,
      "a subsequent holder is untouched",
    );
    (await executorWriterRelease(root, ""))();
    assert.deepEqual(
      harnessWriterView(root),
      foreign,
      "missing session identity never guesses ownership",
    );
  } finally {
    removeFixture(root, { recursive: true });
  }
});
const stopUnits = new Set([
  "verify-app-before-done",
  "no-partial-completion",
  "read-your-own-output",
]);
const hookName = (name) => (stopUnits.has(name) ? "finish" : name);
const configFor = (root, name) => {
  const config = JSON.parse(
    readFileSync(
      join(root, `.claude/hooks/${hookName(name)}.mjs`),
      "utf8",
    ).match(
      /await runHarnessHook\(([\s\S]*), feedbackBoundary(?:, input(?:, rawInput)?)?\);/,
    )[1],
  );
  if (stopUnits.has(name)) {
    config.kind = "feedback";
    config.policy = compileFeedbackUnits(
      config.policy.units.filter((unit) => unit.unitId === name),
    );
  }
  return config;
};
function invoke(root, name, payload, removed = false) {
  let path = join(root, `.claude/hooks/${hookName(name)}.mjs`);
  if (removed) {
    const source = readFileSync(path, "utf8");
    const config = configFor(root, name);
    config.policy = compileFeedbackUnits([]);
    path = join(root, ".claude/hooks/fixture-removed.mjs");
    writeFileSync(
      path,
      source.replace(
        /await runHarnessHook\([\s\S]*, feedbackBoundary(?:, input(?:, rawInput)?)?\);/,
        `await runHarnessHook(${json(config).trim()}, feedbackBoundary, input, rawInput);`,
      ),
    );
  }
  const run = spawnSync(process.execPath, [path], {
    cwd: root,
    input: JSON.stringify(payload),
    encoding: "utf8",
    timeout: deadlineLimit(1000, 20_000),
  });
  assert.equal(
    run.status,
    0,
    JSON.stringify({
      hook: name,
      inputBytes: Buffer.byteLength(JSON.stringify(payload)),
      path: payload.tool_input?.file_path?.replace(root, "<fixture>"),
      error: run.error?.code,
      signal: run.signal,
      stderr: run.stderr,
    }),
  );
  return JSON.parse(run.stdout);
}
const allowed = (result) =>
  result.decision !== "block" &&
  result.hookSpecificOutput?.permissionDecision !== "deny";

test("WO-139 generated permission, observer, Stop and usage share the root subagent cap", () => {
  const root = fixture();
  try {
    write(root, "docs/control/budgets.json", json({ subagentCap: 3 }));
    beginHarnessSession(root, "synthetic-session", "executor");
    const call = (id, tool = "Agent", extra = {}) =>
      input(root, "PreToolUse", {
        tool_name: tool,
        tool_use_id: id,
        tool_input: {},
        ...extra,
      });
    for (const id of ["one", "two", "three"]) {
      const payload = call(id);
      assert.equal(allowed(invoke(root, "permissions", payload)), true);
      assert.equal(allowed(invoke(root, "permissions", payload)), true);
      // Other PreToolUse hooks may observe the invocation but never charge it.
      invoke(root, "concurrent-work-requires-worktrees", payload);
    }
    assert.match(
      invoke(root, "permissions", call("four")).hookSpecificOutput
        .permissionDecisionReason,
      /count 3, cap 3.*subagentCap/,
    );
    assert.equal(
      allowed(invoke(root, "permissions", call("workflow", "Workflow"))),
      false,
    );
    const row = measureHarnessUsage(root, "synthetic-session").subagents;
    assert.equal(row.count, 3);
    assert.equal(row.cap, 3);
    assert.match(
      invoke(root, "finish", input(root, "Stop")).systemMessage,
      /Subagents: 3\/3.*uncounted remainder unknown/,
    );
    const counter = readdirSync(join(root, "docs/control/local/harness")).find(
      (name) => name.endsWith(".subagents.json"),
    );
    rmSync(join(root, "docs/control/local/harness", counter));
    assert.match(
      invoke(root, "permissions", call("missing")).systemMessage,
      /counter missing/,
    );
    const active = beginGateRun(root, "npm test");
    try {
      assert.equal(
        allowed(
          invoke(
            root,
            "permissions",
            call("write", "Write", {
              agent_id: "child",
              tool_input: { file_path: "package.json", content: "{}" },
            }),
          ),
        ),
        false,
      );
    } finally {
      active.release();
    }
  } finally {
    removeFixture(root, { recursive: true, force: true });
  }
});

test("WO-139 cap-module-only changes refresh the runtime and snapshot damage is detected", () => {
  const root = fixture();
  beginHarnessSession(root, "synthetic-session", "executor");
  const options = { runtimeRoot: root };
  const modulePath = "packages/skeleton/dist/src/subagent-budget.js";
  try {
    const previous = configFor(root, "permissions").runtime;
    const original = readFileSync(join(root, modulePath), "utf8");
    const changed = original
      .replaceAll("return 20;", "return 21;")
      .replace(
        "value.subagentCap === undefined ? 20 :",
        "value.subagentCap === undefined ? 21 :",
      );
    assert.notEqual(changed, original);
    write(root, modulePath, changed);
    emitHarness(root, options);
    const current = configFor(root, "permissions").runtime;
    assert.notEqual(current.snapshot, previous.snapshot);
    assert.ok(current.files.some((file) => file.path === modulePath));
    const installed = join(root, current.snapshot, modulePath);
    assert.equal(readFileSync(installed, "utf8"), changed);
    assert.equal(
      readFileSync(join(root, previous.snapshot, modulePath), "utf8"),
      original,
    );
    assert.equal(checkHarness(root, options).files, 31);
    assert.match(
      invoke(root, "finish", input(root, "Stop")).systemMessage,
      /^Subagents: 0\/21/,
    );

    for (const damage of ["changed", "missing"]) {
      if (damage === "changed") writeFileSync(installed, original);
      else rmSync(installed);
      assert.throws(
        () => checkHarness(root, options),
        /harness drift: pinned snapshot missing or changed .*subagent-budget\.js/,
      );
      const response = invoke(
        root,
        "permissions",
        input(root, "PreToolUse", {
          tool_name: "Agent",
          tool_use_id: damage,
          tool_input: {},
        }),
      );
      assert.match(
        response.systemMessage,
        damage === "changed"
          ? /DotLn advisory: pins-differ/
          : /DotLn advisory: snapshot-missing/,
      );
      assert.notEqual(response.hookSpecificOutput?.permissionDecision, "deny");
    }
  } finally {
    removeFixture(root, { recursive: true, force: true });
  }
});

test("WO-067 compiler-only release installs a fresh compatible harness snapshot", () => {
  const root = fixture();
  try {
    const previous = configFor(root, "concurrent-work-requires-worktrees");
    const identityPath = "packages/compiler/dist/src/artifact-identity.js";
    const retained = readFileSync(
      join(root, previous.runtime.snapshot, identityPath),
      "utf8",
    );
    const version = previous.compilerPackageVersion.split(".").map(Number);
    version[2] += 1;
    const updated = version.join(".");
    write(
      root,
      identityPath,
      retained.replace(
        `COMPILER_PACKAGE_VERSION = "${previous.compilerPackageVersion}"`,
        `COMPILER_PACKAGE_VERSION = "${updated}"`,
      ),
    );
    const manifest = JSON.parse(
      readFileSync(join(root, "packages/compiler/package.json"), "utf8"),
    );
    write(
      root,
      "packages/compiler/package.json",
      json({ ...manifest, version: updated }),
    );
    const emitted = spawnSync(
      process.execPath,
      ["scripts/harness.mjs", "emit"],
      { cwd: root, encoding: "utf8" },
    );
    assert.equal(emitted.status, 0, emitted.stderr);
    const current = configFor(root, "concurrent-work-requires-worktrees");
    assert.equal(current.compilerPackageVersion, updated);
    assert.notEqual(current.runtime.snapshot, previous.runtime.snapshot);
    assert.equal(
      readFileSync(join(root, previous.runtime.snapshot, identityPath), "utf8"),
      retained,
    );
    const response = invoke(
      root,
      "concurrent-work-requires-worktrees",
      input(root, "PreToolUse", {
        tool_name: "Write",
        tool_input: {
          file_path: join(root, "fixture.ts"),
          content: "planned write",
        },
      }),
    );
    assert.equal(allowed(response), true);
    assert.doesNotMatch(JSON.stringify(response), /unavailable|bootstrap/u);
    assert.ok(
      existsSync(join(root, "docs/control/local/harness/writer")),
      "emitted hook actually reserves its writer",
    );
  } finally {
    removeFixture(root, { recursive: true });
  }
});

test("WO-045 generated hooks reject malformed input before ordinary host effects", () => {
  const root = fixture();
  try {
    const initial = input(root, "PreToolUse");
    const malformed = [
      ["{", "INVALID_JSON", "$"],
      ["null", "EXPECTED_OBJECT", "$"],
      [JSON.stringify({ ...initial, cwd: 7 }), "EXPECTED_STRING", "$.cwd"],
      [
        JSON.stringify({ ...initial, session_id: 7 }),
        "EXPECTED_STRING",
        "$.session_id",
      ],
      [
        JSON.stringify({ ...initial, tool_name: {} }),
        "EXPECTED_STRING",
        "$.tool_name",
      ],
      [
        JSON.stringify({ ...initial, tool_input: [] }),
        "EXPECTED_OBJECT",
        "$.tool_input",
      ],
      [
        JSON.stringify({ ...initial, tool_response: null }),
        "EXPECTED_OBJECT",
        "$.tool_response",
      ],
      [
        JSON.stringify({ ...initial, effort: { level: "ultra" } }),
        "INVALID_EFFORT",
        "$.effort.level",
      ],
      [
        JSON.stringify({ ...initial, stop_hook_active: "yes" }),
        "EXPECTED_BOOLEAN",
        "$.stop_hook_active",
      ],
      [
        JSON.stringify({ ...initial, hook_event_name: "Stop" }),
        "EVENT_MISMATCH",
        "$.hook_event_name",
      ],
    ];
    const state = join(root, "docs/control/local/harness");
    const before = existsSync(state) ? readdirSync(state) : [];
    for (const [raw, code, path] of malformed) {
      const run = spawnSync(
        process.execPath,
        [join(root, ".claude/hooks/concurrent-work-requires-worktrees.mjs")],
        {
          cwd: root,
          input: raw,
          encoding: "utf8",
          timeout: 20000,
        },
      );
      assert.equal(run.status, 0, run.stderr);
      assert.equal(run.stderr, "");
      assert.deepEqual(JSON.parse(run.stdout).hookSpecificOutput, {
        hookEventName: "PreToolUse",
        permissionDecision: "deny",
        permissionDecisionReason: JSON.parse(run.stdout).hookSpecificOutput
          .permissionDecisionReason,
      });
      assert.ok(
        JSON.parse(
          run.stdout,
        ).hookSpecificOutput.permissionDecisionReason.includes(
          `${code} at ${path}:`,
        ),
      );
      assert.deepEqual(
        existsSync(state) ? readdirSync(state) : [],
        before,
        "malformed input wrote host state",
      );
    }
    for (const prompt of ["analysis: diagnose", "operator override: recover"]) {
      const recovery = invoke(root, "session", {
        hook_event_name: "UserPromptSubmit",
        cwd: root,
        prompt,
      });
      assert.match(
        recovery.systemMessage,
        /operator-control (analysis|override)/,
      );
      assert.equal(allowed(recovery), true);
    }
    const prompt = invoke(
      root,
      "session",
      input(root, "UserPromptSubmit", { prompt: 7 }),
    );
    assert.match(
      prompt.systemMessage,
      /prompt accepted; DOTLN_HARNESS_INPUT_REFUSED: EXPECTED_STRING at \$\.prompt/,
    );
    assert.deepEqual(existsSync(state) ? readdirSync(state) : [], before);
  } finally {
    removeFixture(root, { recursive: true });
  }
});

for (const mode of ["runner", "evidence", "entry"])
  test(
    `WO-125 F3 ${mode} refuses generated-hook writes throughout the gate and releases on exit`,
    { timeout: 300000 },
    async (t) => {
      const testDeadline = startDeadline("harness:gate-guard-test", 300000);
      t.signal.addEventListener("abort", () => testDeadline.finish(true), {
        once: true,
      });
      t.after(() => testDeadline.finish());
      const root = fixture();
      const local = "docs/control/local";
      let child;
      let finished;
      const release = () => {
        for (const stage of ["build", "checks"])
          write(root, `${local}/${stage}.go`, "go");
        if (child && child.exitCode === null) child.kill("SIGTERM");
      };
      t.signal.addEventListener("abort", release, { once: true });
      try {
        write(
          root,
          ".gitignore",
          readFileSync(join(root, ".gitignore"), "utf8") +
            "\nscratch/*\n!scratch/protected.txt\n",
        );
        write(root, "scratch/protected.txt", "protected by ignore exception\n");
        write(root, `nested/${local}/scratch.txt`, "protected in nested cwd\n");
        write(
          root,
          "nested/scripts/harness.mjs",
          'import {writeFileSync} from "node:fs"; writeFileSync("../fixture.ts", "changed\\n");\n',
        );
        write(root, `${local}/tracked.ts`, "tracked despite ignore\n");
        git(root, "add", "-f", `${local}/tracked.ts`);
        symlinkSync(
          join(root, "fixture.ts"),
          join(root, local, "input-link.ts"),
        );
        symlinkSync("../../../new-input.md", join(root, local, "dangling.md"));
        symlinkSync("dangling.md", join(root, local, "chained.md"));
        symlinkSync("../../../packages/skeleton", join(root, local, "dirlink"));
        symlinkSync("new-scratch.md", join(root, local, "scratch-link.md"));
        linkSync(join(root, "fixture.ts"), join(root, local, "hardlink.ts"));
        const packageScripts = JSON.parse(
          readFileSync(join(sourceRoot, "package.json")),
        ).scripts;
        write(
          root,
          "package.json",
          json({
            scripts: {
              "format:check": "node hold-gate.mjs checks",
              test: "node hold-gate.mjs checks",
              build: "node hold-gate.mjs build",
              harness: packageScripts.harness,
            },
          }),
        );
        write(
          root,
          "hold-gate.mjs",
          `import {existsSync, writeFileSync} from "node:fs";
import {setTimeout} from "node:timers/promises";
import {activeGateRuns} from "./packages/skeleton/dist/src/gate-evidence.mjs";
const stage = process.argv[2];
if (!activeGateRuns(process.cwd()).length) throw new Error("gate marker missing in " + stage);
writeFileSync("${local}/" + stage + ".ready", "ready");
while (!existsSync("${local}/" + stage + ".go")) {
  await setTimeout(10);
}
`,
        );
        if (mode === "entry") {
          cpSync(
            join(sourceRoot, "scripts/harness-entry.mjs"),
            join(root, "scripts/harness-entry.mjs"),
          );
          write(
            root,
            "scripts/lib/gate-evidence.mjs",
            'export * from "../../packages/skeleton/dist/src/gate-evidence.mjs";\n',
          );
          write(
            root,
            "scripts/harness.mjs",
            'process.argv[2] = "checks"; await import("../hold-gate.mjs");\n',
          );
        }
        const program =
          mode === "runner"
            ? `const {runGate} = await import(${JSON.stringify(new URL("./test-runner.mjs", import.meta.url).href)}); process.exitCode = (await runGate(["--only", "format"], process.cwd())).exitCode;`
            : 'const {runHarnessEvidence} = await import("./packages/skeleton/dist/src/harness-host.js"); const checks = runHarnessEvidence(process.cwd()); if (checks.some(row => row.exitCode !== 0)) process.exitCode = 1;';
        const before = gateTreeHash(root);
        child =
          mode === "entry"
            ? spawn("npm", ["run", "harness", "--", "evidence"], {
                cwd: root,
                stdio: ["ignore", "pipe", "pipe"],
              })
            : spawn(process.execPath, ["--input-type=module", "-e", program], {
                cwd: root,
                stdio: ["ignore", "pipe", "pipe"],
              });
        let output = "";
        child.stdout.on("data", (chunk) => {
          output += chunk;
        });
        child.stderr.on("data", (chunk) => {
          output += chunk;
        });
        finished = new Promise((resolve, reject) => {
          child.once("error", reject);
          child.once("close", (code) => resolve(code));
        });
        for (const stage of mode === "entry"
          ? ["build", "checks"]
          : ["checks"]) {
          while (!existsSync(join(root, local, `${stage}.ready`))) {
            t.signal.throwIfAborted();
            assert.equal(child.exitCode, null, output);
            await new Promise((resolve) => setTimeout(resolve, 10));
          }
          const runs = activeGateRuns(root);
          assert.ok(runs.length > 0);
          const pathAttempts = [
            `${local}/hardlink.ts`,
            `${local}/dangling.md`,
            `${local}/chained.md`,
            `${local}/dirlink/../probe-new.md`,
            ...(existsSync(join(root, "NODE_MODULES"))
              ? [
                  "NODE_MODULES/probe.js",
                  "Packages/skeleton/dist/probe.js",
                  "packages/skeleton/DIST/probe.js",
                ]
              : []),
          ].flatMap((path) => [
            {
              tool_name: "Write",
              tool_input: { file_path: path, content: "changed\n" },
            },
            {
              tool_name: "Bash",
              tool_input: { command: `printf changed > ${path}` },
            },
            { tool_name: "Bash", tool_input: { command: `touch ${path}` } },
          ]);
          const attempts = [
            {
              tool_name: "Write",
              tool_input: {
                file_path: join(root, "fixture.ts"),
                content: "changed\n",
              },
            },
            {
              tool_name: "Edit",
              tool_input: {
                file_path: join(root, "fixture.ts"),
                old_string: "1",
                new_string: "2",
              },
            },
            {
              tool_name: "Bash",
              tool_input: { command: "printf changed > fixture.ts" },
            },
            {
              tool_name: "Bash",
              tool_input: { command: "git status --short && touch fixture.ts" },
            },
            {
              tool_name: "exec_command",
              tool_input: { command: "touch fixture.ts" },
            },
            {
              tool_name: "apply_patch",
              tool_input: { patch: "opaque write adapter" },
            },
            {
              tool_name: "Write",
              tool_input: {
                file_path: `${local}/tracked.ts`,
                content: "changed\n",
              },
            },
            {
              tool_name: "Write",
              tool_input: {
                file_path: `${local}/input-link.ts`,
                content: "changed\n",
              },
            },
            {
              tool_name: "Write",
              tool_input: {
                file_path: "packages/skeleton/dist/new-input.js",
                content: "changed\n",
              },
            },
            {
              tool_name: "Write",
              tool_input: {
                file_path: ".git/dotln/suite-success/fixture/record.json",
                content: "changed\n",
              },
            },
            {
              tool_name: "Bash",
              tool_input: {
                command:
                  "mkdir -p .git/dotln/suite-success/fixture && printf changed > .git/dotln/suite-success/fixture/record.json",
              },
            },
            {
              tool_name: "Bash",
              tool_input: {
                command: `printf scratch > ${local}/scratch.txt && touch fixture.ts`,
              },
            },
            {
              tool_name: "Bash",
              tool_input: { command: 'rm scratch/"protect"*' },
            },
            {
              tool_name: "Bash",
              tool_input: { command: 'printf changed > scratch/"protect"*' },
            },
            {
              tool_name: "exec_command",
              tool_input: {
                command: `printf changed > ${local}/scratch.txt`,
                workdir: join(root, "nested"),
              },
            },
            {
              tool_name: "exec_command",
              tool_input: {
                command: "node scripts/harness.mjs writer --show",
                workdir: join(root, "nested"),
              },
            },
          ];
          for (const hook of [
            "permissions",
            "concurrent-work-requires-worktrees",
            "write-observer",
          ])
            for (const attempt of [
              ...attempts,
              // All entry points share the classifier; exercise its path matrix
              // once, while retaining every hook/stage lifetime control above.
              ...(mode === "runner" && hook === "permissions"
                ? [
                    ...pathAttempts,
                    {
                      tool_name: "Edit",
                      tool_input: {
                        file_path: `${local}/hardlink.ts`,
                        old_string: "1",
                        new_string: "2",
                      },
                    },
                    ...[">", ">>", "| tee"].map((operator) => ({
                      tool_name: "exec_command",
                      tool_input: {
                        command: `printf changed ${operator} ${local}/hardlink.ts`,
                      },
                    })),
                    {
                      tool_name: "exec_command",
                      tool_input: {
                        command: "printf changed > cwd-input.md",
                        workdir: `${root}/${local}/dirlink/..`,
                      },
                    },
                  ]
                : []),
            ]) {
              const verdict = invoke(
                root,
                hook,
                input(root, "PreToolUse", attempt),
              );
              if (allowed(verdict)) {
                if (typeof attempt.tool_input.command === "string")
                  assert.equal(
                    spawnSync("sh", ["-c", attempt.tool_input.command], {
                      cwd: attempt.tool_input.workdir ?? root,
                    }).status,
                    0,
                  );
                else {
                  const path = attempt.tool_input.file_path ?? "fixture.ts";
                  writeFileSync(
                    isAbsolute(path) ? path : `${root}/${path}`,
                    "changed\n",
                  );
                }
              }
              assert.equal(
                gateTreeHash(root),
                before,
                `${hook} admitted ${attempt.tool_name} during ${stage}`,
              );
              assert.equal(allowed(verdict), false);
              for (const path of [
                "node_modules/probe.js",
                "packages/skeleton/dist/probe.js",
              ])
                assert.equal(existsSync(join(root, path)), false, path);
              const reason =
                verdict.hookSpecificOutput.permissionDecisionReason;
              assert.match(reason, /active gate|suite-success cache/);
              assert.ok(
                reason.includes("suite-success cache") ||
                  runs.some(
                    (run) =>
                      reason.includes(run.runId) &&
                      reason.includes(run.command),
                  ),
              );
            }
          for (const hook of [
            "permissions",
            "concurrent-work-requires-worktrees",
            "write-observer",
          ])
            for (const attempt of [
              {
                tool_name: "Write",
                tool_input: {
                  file_path: `${local}/scratch-link.md`,
                  content: "local only\n",
                },
              },
              {
                tool_name: "Write",
                tool_input: {
                  file_path: `${local}/scratch.txt`,
                  content: "local only\n",
                },
              },
              {
                tool_name: "Edit",
                tool_input: {
                  file_path: `${local}/scratch.txt`,
                  old_string: "local",
                  new_string: "scratch",
                },
              },
              {
                tool_name: "Bash",
                tool_input: {
                  command: `printf scratch > ${local}/scratch.txt`,
                },
              },
              {
                tool_name: "Bash",
                tool_input: { command: `touch ${local}/scratch.txt` },
              },
              {
                tool_name: "exec_command",
                tool_input: {
                  command: "printf scratch > scratch.txt",
                  workdir: join(root, local),
                },
              },
            ]) {
              const verdict = invoke(
                root,
                hook,
                input(root, "PreToolUse", attempt),
              );
              assert.equal(
                allowed(verdict),
                true,
                `${hook} unnecessarily locked ignored scratch: ${JSON.stringify(verdict)}`,
              );
              if (typeof attempt.tool_input.command === "string")
                assert.equal(
                  spawnSync("sh", ["-c", attempt.tool_input.command], {
                    cwd: attempt.tool_input.workdir ?? root,
                  }).status,
                  0,
                );
              else
                writeFileSync(
                  `${root}/${attempt.tool_input.file_path}`,
                  "local only\n",
                );
              assert.equal(gateTreeHash(root), before);
            }
          for (const attempt of [
            {
              tool_name: "Read",
              tool_input: { file_path: join(root, "fixture.ts") },
            },
            {
              tool_name: "Bash",
              tool_input: { command: "git status --short" },
            },
            {
              tool_name: "exec_command",
              tool_input: {
                command: "git status --short",
                workdir: join(root, "nested"),
              },
            },
          ])
            assert.equal(
              allowed(
                invoke(root, "permissions", input(root, "PreToolUse", attempt)),
              ),
              true,
            );
          write(root, `${local}/${stage}.go`, "go");
        }
        assert.equal(await finished, 0, output);
        assert.deepEqual(activeGateRuns(root), []);
        assert.equal(gateTreeHash(root), before);
        assert.equal(
          allowed(
            invoke(
              root,
              "permissions",
              input(root, "PreToolUse", {
                tool_name: "Write",
                tool_input: {
                  file_path: join(root, "fixture.ts"),
                  content: "after gate\n",
                },
              }),
            ),
          ),
          true,
        );
      } finally {
        t.signal.removeEventListener("abort", release);
        release();
        if (finished) await finished;
        removeFixture(root, { recursive: true, force: true });
      }
    },
  );

test("WO-125 F3 a marker left by a killed gate owner does not block writes", async () => {
  const root = fixture();
  const markerDirectory = join(root, "docs/control/local/harness/active-gates");
  const child = spawn(
    process.execPath,
    [
      "--input-type=module",
      "-e",
      'import {beginGateRun} from "./packages/skeleton/dist/src/gate-evidence.mjs"; beginGateRun(process.cwd(), "crashed gate fixture"); process.stdout.write("ready"); setInterval(() => {}, 1000);',
    ],
    { cwd: root, stdio: ["ignore", "pipe", "pipe"] },
  );
  const exited = new Promise((resolve) => child.once("close", resolve));
  try {
    await new Promise((resolve, reject) => {
      child.stdout.once("data", resolve);
      child.once("error", reject);
      child.once("exit", () => reject(new Error("gate exited before ready")));
    });
    assert.equal(activeGateRuns(root).length, 1);
    child.kill("SIGKILL");
    await exited;
    assert.equal(
      readdirSync(markerDirectory).filter((name) => name.endsWith(".json"))
        .length,
      1,
    );
    assert.deepEqual(activeGateRuns(root), []);
    for (const hook of [
      "permissions",
      "concurrent-work-requires-worktrees",
      "write-observer",
    ])
      assert.equal(
        allowed(
          invoke(
            root,
            hook,
            input(root, "PreToolUse", {
              tool_name: "Write",
              tool_input: {
                file_path: join(root, "fixture.ts"),
                content: "after crash\n",
              },
            }),
          ),
        ),
        true,
      );
  } finally {
    if (child.exitCode === null) child.kill("SIGKILL");
    await exited;
    removeFixture(root, { recursive: true, force: true });
  }
});
const session = {
  startingEventCount: 1,
  reads: [],
  expectedEvent: "ImplementationReady",
  role: "executor",
};
const observations = (root, payload = input(root, "Stop")) => {
  const key = createHash("sha256").update(payload.session_id).digest("hex");
  return readFileSync(
    join(root, `docs/control/local/harness/${key}.jsonl`),
    "utf8",
  )
    .trim()
    .split("\n")
    .map(JSON.parse);
};
const observedSession = (root, payload = input(root, "Stop")) => {
  const key = createHash("sha256").update(payload.session_id).digest("hex");
  const state = JSON.parse(
    readFileSync(join(root, `docs/control/local/harness/${key}.json`), "utf8"),
  );
  return {
    ...state,
    reads: observations(root, payload).flatMap((row) => row.receipts ?? []),
  };
};
const writerEvents = (root) => {
  const path = join(root, "docs/control/local/harness/writer-events.jsonl");
  return existsSync(path)
    ? readFileSync(path, "utf8").trim().split("\n").map(JSON.parse)
    : [];
};
const readiness = (root, name, state = observedSession(root)) => {
  const config = configFor(root, name);
  const policy = compileFeedbackUnits(
    config.policy.units
      .filter((unit) =>
        ["application-evidence", "output-review", "complete-scope"].includes(
          unit.trigger,
        ),
      )
      .map((unit) => ({ ...unit, enforcement: "hard" })),
  );
  const facts =
    name === "finish"
      ? policy.units.flatMap((unit) =>
          harnessFeedbackFacts(
            compileFeedbackUnits([unit]),
            input(root, "Stop"),
            root,
            state,
          ),
        )
      : harnessFeedbackFacts(policy, input(root, "Stop"), root, state);
  try {
    for (const fact of facts) feedbackBoundary(policy, fact, () => {});
    return true;
  } catch (error) {
    assert.ok(error instanceof FeedbackRefused);
    return false;
  }
};
const adoptOutputs = (root) => {
  const state = observedSession(root);
  const key = createHash("sha256").update("synthetic-session").digest("hex");
  state.authoredPaths = harnessOutputs(root).map((row) => row.path);
  writeFileSync(
    join(root, `docs/control/local/harness/${key}.json`),
    json(state),
  );
};
function parity(root, name, payload, expected, state = session) {
  const config = configFor(root, name);
  if (payload.hook_event_name === "Stop")
    config.policy = compileFeedbackUnits(
      config.policy.units
        .filter((unit) =>
          ["application-evidence", "output-review", "complete-scope"].includes(
            unit.trigger,
          ),
        )
        .map((unit) => ({ ...unit, enforcement: "hard" })),
    );
  const policies =
    config.kind === "finish"
      ? config.policy.units.map((unit) => compileFeedbackUnits([unit]))
      : [config.policy];
  const requests = policies.flatMap((policy) =>
    harnessFeedbackFacts(policy, payload, root, state).map((fact) => ({
      policy,
      fact,
    })),
  );
  assert.ok(requests.length, "fixture must reach an eligible boundary");
  if (name === "finish")
    assert.deepEqual(
      requests.map(({ fact }) => fact.kind).sort(),
      ["application-evidence", "complete-scope", "output-review"],
      "finish must exercise every eligible Stop unit",
    );
  let verdict = true;
  try {
    for (const { policy, fact } of requests)
      feedbackBoundary(policy, fact, () => {});
  } catch (error) {
    assert.ok(error instanceof FeedbackRefused);
    verdict = false;
  }
  assert.equal(verdict, expected, `${name} host fact expectation`);
  const result = invoke(root, name, payload);
  assert.equal(
    allowed(result),
    name === "concurrent-work-requires-worktrees" ? verdict : true,
    `${name} generated subprocess parity: ${JSON.stringify(result)}`,
  );
  assert.equal(
    allowed(invoke(root, name, payload, true)),
    true,
    `${name} removal permits the same request`,
  );
}

test("WO-132 hooks preserve boundary observations and delegate non-writer judgments, including unit removal", () => {
  const root = fixture();
  try {
    invoke(
      root,
      "session",
      input(root, "UserPromptSubmit", { prompt: "resume: next" }),
    );
    for (const message of ["A useful change", "Generated by AI"])
      parity(
        root,
        "no-attribution",
        input(root, "PreToolUse", {
          tool_name: "Bash",
          tool_input: { command: `git commit -m '${message}'` },
        }),
        message === "A useful change",
      );
    parity(
      root,
      "concurrent-work-requires-worktrees",
      input(root, "PreToolUse", {
        tool_name: "Edit",
        tool_input: { file_path: join(root, "fixture.ts") },
      }),
      true,
    );
    git(root, "switch", "-c", "main");
    parity(
      root,
      "concurrent-work-requires-worktrees",
      input(root, "PreToolUse", {
        tool_name: "Write",
        tool_input: { file_path: join(root, "fixture.ts") },
      }),
      true,
    );
    git(root, "switch", "wo-999");
    const before = readFileSync(join(root, "fixture.ts"), "utf8");
    for (const after of [before, "// @ts-ignore\n" + before]) {
      write(root, "fixture.ts", after);
      parity(
        root,
        "no-lint-type-disables-as-fixes",
        input(root, "PostToolUse", {
          tool_name: "Edit",
          tool_input: { file_path: join(root, "fixture.ts") },
          tool_response: { originalFile: before },
        }),
        after === before,
      );
    }
    write(root, "fixture.ts", before);
    for (const name of [
      "verify-app-before-done",
      "no-partial-completion",
      "read-your-own-output",
    ])
      parity(root, name, input(root, "Stop"), name === "read-your-own-output");
    assert.equal(
      allowed(
        invoke(
          root,
          "permissions",
          input(root, "PreToolUse", {
            tool_name: "Bash",
            tool_input: { command: "ssh fixture.invalid" },
          }),
        ),
      ),
      true,
    );
    assert.equal(
      allowed(
        invoke(
          root,
          "permissions",
          input(root, "PreToolUse", {
            tool_name: "Read",
            tool_input: { file_path: join(root, "fixture.ts") },
          }),
        ),
      ),
      true,
    );
    parity(root, "finish", input(root, "Stop"), false);
    // Normal completion: executable checks, canonical event, and current-byte reads.
    assert.ok(
      runHarnessEvidence(root).every(
        (run) => run.exitCode === 0 && run.executed,
      ),
    );
    write(
      root,
      "docs/control/orders/WO-999.jsonl",
      JSON.stringify({ type: "WorkOrderActivated", workOrderId: "WO-999" }) +
        "\n" +
        JSON.stringify({ type: "ImplementationReady", workOrderId: "WO-999" }) +
        "\n",
    );
    assert.ok(
      runHarnessEvidence(root).every(
        (run) => run.executed && run.exitCode === 0,
      ),
    );
    for (const name of [
      "verify-app-before-done",
      "no-partial-completion",
      "read-your-own-output",
    ])
      assert.equal(
        allowed(invoke(root, name, input(root, "Stop"))),
        true,
        `${name} completed evidence`,
      );
    parity(root, "finish", input(root, "Stop"), true, observedSession(root));
    assert.equal(
      existsSync(join(root, "docs/control/local/harness/writer")),
      false,
    );
    assert.deepEqual(
      writerEvents(root).map((row) => row.event),
      ["acquired", "released"],
      "one session reserves once and releases at its accepted finish",
    );
    write(root, "fixture.ts", before + "// changed after evidence\n");
    const first = invoke(root, "finish", input(root, "Stop"));
    const second = invoke(
      root,
      "finish",
      input(root, "Stop", { stop_hook_active: true }),
    );
    for (const response of [first, second]) {
      assert.equal(allowed(response), true);
      assert.match(response.systemMessage, /Observed facts/);
    }
    const pendingRows = readFileSync(
      join(
        root,
        "docs/control/local/harness",
        createHash("sha256").update("synthetic-session").digest("hex") +
          ".jsonl",
      ),
      "utf8",
    )
      .trim()
      .split("\n")
      .map(JSON.parse)
      .filter((row) => row.delegated)
      .slice(-2);
    for (const row of pendingRows) {
      assert.match(
        row.advisory,
        /^DotLn advisory: pending .*verify-app-before-done/m,
      );
      assert.match(row.advisory, /^Observed facts/m);
      assert.equal(
        row.advisory
          .split("\n")
          .filter((line) => line.startsWith("DotLn advisory:")).length,
        1,
      );
    }
    assert.equal(
      existsSync(join(root, "docs/control/local/harness/writer")),
      false,
    );
  } finally {
    removeFixture(root, { recursive: true });
  }
});

const nativeRead = (root, path, startLine = 1, numLines, contentOverride) => {
  const contents = readFileSync(join(root, path), "utf8");
  const parts = contents.match(/[^\n]*\n|[^\n]+$/g) ?? [];
  numLines ??= contents.split("\n").length;
  return input(root, "PostToolUse", {
    tool_name: "Read",
    tool_input: {
      file_path: join(root, path),
      offset: startLine,
      limit: numLines,
    },
    tool_response: {
      file: {
        content:
          contentOverride ??
          parts.slice(startLine - 1, startLine - 1 + numLines).join(""),
        startLine,
        numLines,
        totalLines: contents.split("\n").length,
      },
    },
  });
};
const observeInProcess = (root, payload) =>
  evaluateHarnessHook(
    configFor(root, "read-observer"),
    payload,
    root,
    feedbackBoundary,
  );

test("WO-039 ranged receipts require complete current bytes despite gaps, duplicates and stale or mismatched deliveries", async () => {
  const root = fixture();
  try {
    write(root, "review.txt", "alpha\r\nβeta\r\nthird\nfourth\nfifth\nsixth\n");
    invoke(
      root,
      "session",
      input(root, "UserPromptSubmit", { prompt: "resume: next" }),
    );
    for (const output of harnessOutputs(root).filter(
      (row) => row.path !== "review.txt",
    ))
      await observeInProcess(root, nativeRead(root, output.path));
    adoptOutputs(root);
    const refused = () => {
      assert.equal(readiness(root, "read-your-own-output"), false);
      assert.equal(allowed(invoke(root, "finish", input(root, "Stop"))), true);
    };
    refused();
    await observeInProcess(root, nativeRead(root, "review.txt", 3, 4));
    await observeInProcess(root, nativeRead(root, "review.txt", 3, 4));
    await observeInProcess(
      root,
      nativeRead(root, "review.txt", 1, 2, "truncated"),
    );
    refused();
    await observeInProcess(root, nativeRead(root, "review.txt", 1, 2));
    assert.equal(readiness(root, "read-your-own-output"), true);

    write(root, "review.txt", "changed\nβeta\r\nthird\nfourth\nfifth\nsixth\n");
    await observeInProcess(root, nativeRead(root, "review.txt", 3, 4));
    refused();
    await observeInProcess(root, nativeRead(root, "review.txt", 1, 2));
    assert.equal(readiness(root, "read-your-own-output"), true);

    write(root, "review.txt", "");
    refused();
    await observeInProcess(root, nativeRead(root, "review.txt"));
    assert.equal(readiness(root, "read-your-own-output"), true);
    write(root, "review.txt", "without\nfinal newline");
    await observeInProcess(root, nativeRead(root, "review.txt", 2, 1));
    refused();
    await observeInProcess(root, nativeRead(root, "review.txt", 1, 1));
    assert.equal(readiness(root, "read-your-own-output"), true);
  } finally {
    removeFixture(root, { recursive: true });
  }
});

test("WO-132 inherited outputs add no reads; invalid deliveries advise without creating read receipts", async () => {
  const root = fixture();
  try {
    for (let index = 0; index < 128; index++)
      write(root, `output/inherited-${index}.txt`, "inherited\n".repeat(1000));
    invoke(
      root,
      "session",
      input(root, "UserPromptSubmit", { prompt: "resume: next" }),
    );
    assert.deepEqual(harnessOutputObligations(root, observedSession(root)), []);
    const own = "output/own.txt";
    invoke(
      root,
      "write-observer",
      input(root, "PreToolUse", {
        tool_name: "Write",
        tool_input: { file_path: join(root, own) },
      }),
    );
    write(root, own, "αβ🙂 synthetic output ".repeat(2000));
    invoke(
      root,
      "read-observer",
      input(root, "PostToolUse", {
        tool_name: "Write",
        tool_input: { file_path: join(root, own) },
        tool_response: { success: true },
      }),
    );
    assert.deepEqual(
      harnessOutputObligations(root, observedSession(root)).map(
        (row) => row.path,
      ),
      [own],
    );
    let offset = 0;
    for (;;) {
      const chunk = readHarnessOutput(root, own, offset, 8192);
      const payload = input(root, "PostToolUse", {
        tool_name: "Bash",
        tool_input: {
          command: `node scripts/harness.mjs read-output ${own} --offset ${offset} --length 8192`,
        },
        tool_response: { stdout: JSON.stringify(chunk) + "\n" },
      });
      assert.equal(readiness(root, "read-your-own-output"), false);
      if (!offset) {
        assert.equal(
          allowed(
            invoke(root, "read-observer", {
              ...payload,
              tool_response: { stdout: JSON.stringify(chunk).slice(0, -20) },
            }),
          ),
          true,
        );
        assert.equal(
          allowed(
            invoke(root, "read-observer", {
              ...payload,
              tool_response: {
                stdout: JSON.stringify({
                  ...chunk,
                  content: "Different bytes",
                }),
              },
            }),
          ),
          true,
        );
      }
      await observeInProcess(root, payload);
      if (chunk.nextOffset === chunk.totalBytes) break;
      offset = chunk.nextOffset;
    }
    assert.equal(readiness(root, "read-your-own-output"), true);
    write(root, own, "changed after delivery\n");
    assert.equal(readiness(root, "read-your-own-output"), false);
    write(root, own, "αβ🙂");
    assert.throws(() => readHarnessOutput(root, own, 1), /UTF-8 boundary/);
    assert.throws(
      () => readHarnessOutput(root, own, 0, 100000),
      /Invalid output byte range/,
    );
    write(
      root,
      "docs/control/local/not-an-output.txt",
      "Synthetic private fixture\n",
    );
    assert.throws(
      () => readHarnessOutput(root, "docs/control/local/not-an-output.txt"),
      /output|refus|contained/i,
    );
  } finally {
    removeFixture(root, { recursive: true });
  }
});

test("WO-039 installed bundle detects content, missing, unexpected and manifest drift and refuses unowned replacement", () => {
  const root = fixture();
  const outside = realpathSync(
    mkdtempSync(join(tmpdir(), "dotln-harness-outside-")),
  );
  try {
    assert.equal(checkHarness(root).localTerms.status, "unavailable");
    const path = join(root, ".claude/skills/dotln-executor/SKILL.md");
    writeFileSync(path, readFileSync(path, "utf8") + " ");
    assert.throws(() => checkHarness(root), /harness drift/);
    emitHarness(root);
    assert.ok(checkHarness(root).files > 10);
    rmSync(path);
    assert.throws(() => checkHarness(root), /harness drift: missing/);
    emitHarness(root);
    const unexpected = ".claude/hooks/unowned.mjs";
    write(root, unexpected, "// Preserve unowned content\n");
    assert.throws(() => checkHarness(root), /harness drift: unexpected/);
    const beforeRefusal = readFileSync(path);
    assert.throws(
      () => emitHarness(root),
      /unowned harness output refuses replacement/,
    );
    assert.deepEqual(readFileSync(path), beforeRefusal);
    assert.equal(
      readFileSync(join(root, unexpected), "utf8"),
      "// Preserve unowned content\n",
    );
    rmSync(join(root, unexpected));
    const manifestPath = join(root, ".claude/harness-manifest.json");
    const manifest = readFileSync(manifestPath, "utf8");
    for (const mutation of ["missing", "changed"]) {
      if (mutation === "missing") rmSync(manifestPath);
      else writeFileSync(manifestPath, manifest + " ");
      assert.throws(() => checkHarness(root), /harness drift: manifest/);
      writeFileSync(manifestPath, manifest);
    }
    const obsolete = ".claude/hooks/obsolete.mjs";
    write(root, obsolete, "// Previously owned output\n");
    const previous = JSON.parse(manifest);
    previous.installed.push({ path: obsolete });
    writeFileSync(manifestPath, json(previous));
    emitHarness(root);
    assert.equal(existsSync(join(root, obsolete)), false);
    assert.ok(checkHarness(root).files > 10);
    write(outside, "sentinel", "preserve\n");
    rmSync(path);
    symlinkSync(join(outside, "sentinel"), path);
    assert.throws(() => emitHarness(root), /symlink|regular file/);
    assert.equal(readFileSync(join(outside, "sentinel"), "utf8"), "preserve\n");
  } finally {
    removeFixture(root, { recursive: true });
    removeFixture(outside, { recursive: true });
  }
});

test("WO-054 Codex installation preserves unowned configuration before any bundle write", () => {
  const root = fixture();
  try {
    const manifestPath = join(root, ".claude/harness-manifest.json");
    const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
    manifest.installed = manifest.installed.filter(
      (file) => !file.path.startsWith(".codex/"),
    );
    writeFileSync(manifestPath, json(manifest));
    const config = join(root, ".codex/config.toml");
    writeFileSync(config, "# Operator-owned configuration.\n");
    const before = readFileSync(join(root, "CLAUDE.md"));
    assert.throws(
      () => emitHarness(root),
      /unowned Codex output refuses replacement/,
    );
    assert.equal(
      readFileSync(config, "utf8"),
      "# Operator-owned configuration.\n",
    );
    assert.deepEqual(readFileSync(join(root, "CLAUDE.md")), before);
    for (const file of [
      ".codex/config.toml",
      ".codex/hooks.json",
      ".codex/hooks/continuation.mjs",
    ])
      rmSync(join(root, file));
    write(
      root,
      ".codex/unrelated.toml",
      "# Preserve unrelated project file.\n",
    );
    emitHarness(root);
    assert.ok(checkHarness(root).files > 10);
    assert.equal(
      readFileSync(join(root, ".codex/unrelated.toml"), "utf8"),
      "# Preserve unrelated project file.\n",
    );
  } finally {
    removeFixture(root, { recursive: true });
  }
});

test("WO-039 local terms are unavailable honestly or refuse without echoing the synthetic term", () => {
  const root = fixture();
  try {
    assert.equal(termsCheck(root, ["CLAUDE.md"]).status, "unavailable");
    write(root, "docs/control/local/terms.txt", "SyntheticForbidden\n");
    write(root, "public.md", "Ordinary text\nSYNTHETIC-forbidden\n");
    assert.throws(
      () => termsCheck(root, ["public.md"]),
      (error) => {
        assert.match(error.message, /"file":"public.md","line":2,"count":1/);
        assert.doesNotMatch(error.message, /synthetic|forbidden/i);
        return true;
      },
    );
    assert.equal(termsCheck(root, ["CLAUDE.md"]).status, "present");
  } finally {
    removeFixture(root, { recursive: true });
  }
});

test("WO-039 target does not change Seiri or Entropy Reducer semantic hashes", () => {
  const baseline = JSON.parse(
    readFileSync(
      join(sourceRoot, "docs/evidence/WO-029/baseline.json"),
      "utf8",
    ),
  );
  for (const row of baseline.fixtures) {
    const result = compileLoadout(
      row.name === "seiri"
        ? seiriLoadout
        : entropyReducerLoadout(row.episodeEndsAt),
      row.environment,
    );
    assert.equal(result.ok, true);
    assert.equal(result.semanticHash, row.semanticHash);
  }
  const installation = harnessInstallation();
  assert.equal(installation.bundles.length, 2);
  assert.equal(
    contributorProgram().loadout.phenotype.identityId,
    "contributor",
  );
});

test("WO-039 control observation uses the canonical read-only lifecycle command", (t) => {
  const root = fixture();
  t.after(() => removeFixture(root, { recursive: true, force: true }));
  cpSync(join(sourceRoot, "scripts/lib"), join(root, "scripts/lib"), {
    recursive: true,
  });
  cpSync(
    join(sourceRoot, "scripts/resume.mjs"),
    join(root, "scripts/resume.mjs"),
  );
  for (const name of ["compiler", "kernel", "skeleton"])
    cpSync(
      join(sourceRoot, `packages/${name}/src`),
      join(root, `packages/${name}/src`),
      { recursive: true },
    );
  write(
    root,
    "docs/control/orders/WO-999.jsonl",
    JSON.stringify({
      schemaVersion: 1,
      type: "WorkOrderActivated",
      workOrderId: "WO-999",
      workOrderPath: "docs/work-orders/WO-999-fixture.md",
    }) + "\n",
  );
  write(
    root,
    "docs/control/current.md",
    "Synthetic stale projection must remain untouched.\n",
  );
  const projection = join(root, "docs/control/current.md");
  const before = readFileSync(projection);
  assert.ok(
    [
      "none",
      "active",
      "ready-to-verify",
      "verifying",
      "needs-fix",
      "repairing",
      "verified",
      "final-review",
      "closed",
    ].includes(harnessControl(root).phase),
  );
  assert.deepEqual(readFileSync(projection), before);
});

test("WO-132 whole-procedure context reports late and unaccounted reads with advisory growth", () => {
  const files = {
    "late.md": "first\nsecond\n",
    "order.md": "# Order\n",
    "unexpected.md": "outside\n",
  };
  const instruction = "Read[executor]: `@skills/dotln-executor/SKILL.md`\n";
  const skill = "Read: `@work-order`\nFinish the ordinary role procedure.\n";
  const options = {
    instruction,
    skill,
    role: "executor",
    skillsRoot: ".claude/skills",
    selectors: { "@work-order": ["order.md"] },
    read: (path) => files[path],
  };
  const base = directedReads(options);
  for (const surface of ["instruction", "skill"]) {
    const changed = {
      ...options,
      [surface]: options[surface] + "Read: `late.md`\n",
    };
    const actual = directedReads(changed);
    assert.ok(
      actual.some((entry) => entry.path === "late.md" && entry.endLine === 2),
    );
    assert.equal(
      compareObservedReads(actual, [
        { path: "late.md", startLine: 1, endLine: 2 },
      ]).length,
      0,
    );
  }
  assert.equal(
    compareObservedReads(base, [{ path: "late.md", startLine: 1, endLine: 2 }])
      .length,
    1,
  );
  assert.throws(
    () => directedReads({ ...options, skill: skill + "Read: `@missing`\n" }),
    /Unresolved required/,
  );
  assert.equal(
    countReads([{ path: "late.md", startLine: 1, endLine: 2 }], options.read)
      .bytes,
    13,
  );
  const measured = measureHarnessContext();
  checkContextMeasurement(measured);
  const skillPath = ".claude/skills/dotln-executor/SKILL.md";
  const emitted = harnessInstallation().files.find(
    (file) => file.path === skillPath,
  ).contents;
  const notLower = measureHarnessContext(
    new Map([
      [skillPath, emitted + "Read: `fixture/late-large.md`\n"],
      ["fixture/late-large.md", "late required input\n".repeat(4000)],
    ]),
  );
  assert.equal(notLower.profiles[0].lower, false);
  assert.ok(
    notLower.profiles[0].residue[0].files.includes("fixture/late-large.md"),
  );
  const warnings = [];
  const previousWarn = console.warn;
  try {
    console.warn = (message) => warnings.push(String(message));
    assert.doesNotThrow(() => checkContextMeasurement(notLower));
  } finally {
    console.warn = previousWarn;
  }
  assert.ok(
    warnings.some(
      (message) =>
        message.startsWith("Advisory: .claude/skills/executor:") &&
        message.includes("fixture/late-large.md"),
    ),
    "larger directed context remains visible as an advisory",
  );
});

test("WO-132 generated read observer spans the session and records alternate read routes", () => {
  const root = fixture();
  try {
    write(
      root,
      "docs/control/local/harness/read-scope.json",
      json({
        role: "executor",
        skill: "dotln-executor",
        reads: [{ path: "fixture.ts", startLine: 1, endLine: 1 }],
        commands: ["pwd"],
      }),
    );
    invoke(
      root,
      "session",
      input(root, "UserPromptSubmit", { prompt: "resume: next" }),
    );
    for (const [tool_name, tool_input, expected] of [
      ["Read", { file_path: join(root, "fixture.ts") }, true],
      ["Read", { file_path: join(root, "package.json") }, true],
      ["Bash", { command: "cat fixture.ts" }, true],
      ["Bash", { command: "pwd" }, true],
      ["Skill", { skill: "dotln-reviewer" }, true],
      ["Grep", { pattern: ".*" }, true],
    ])
      assert.equal(
        allowed(
          invoke(
            root,
            "permissions",
            input(root, "PreToolUse", { tool_name, tool_input }),
          ),
        ),
        expected,
      );
    const observed = input(root, "PostToolUse", {
      tool_name: "Read",
      tool_input: { file_path: join(root, "fixture.ts") },
      tool_response: {
        file: {
          content: "export const value = 1;\n",
          startLine: 1,
          numLines: 1,
          totalLines: 1,
        },
      },
    });
    assert.equal(allowed(invoke(root, "read-observer", observed)), true);
    assert.equal(
      allowed(
        invoke(root, "read-observer", {
          ...observed,
          tool_response: {
            file: {
              ...observed.tool_response.file,
              numLines: 2,
              totalLines: 2,
            },
          },
        }),
      ),
      true,
      "the empty line reported after a trailing newline delivers no extra bytes",
    );
    invoke(root, "finish", input(root, "Stop"));
    assert.equal(
      allowed(
        invoke(root, "read-observer", {
          ...observed,
          tool_input: { file_path: join(root, "package.json") },
        }),
      ),
      true,
      "a late read is observed after a Stop attempt",
    );
    const directed = [{ path: "fixture.ts", startLine: 1, endLine: 1 }];
    const enforced = scopeReadEvidence(directed, observations(root));
    assert.equal(enforced.refusalCounts.Read ?? 0, 0);
    assert.equal(enforced.refusalCounts.Bash ?? 0, 0);
    assert.equal(enforced.refusedReads.length, 0);
    assert.equal(enforced.unlocatedReadRefusals, 0);
    assert.equal(enforced.attemptedOutsideDirectedSet[0].path, "package.json");
    write(
      root,
      "docs/control/local/harness/read-scope.json",
      json({
        role: "executor",
        skill: "dotln-executor",
        reads: directed,
        commands: ["pwd"],
        mode: "observe",
      }),
    );
    assert.equal(
      allowed(
        invoke(
          root,
          "permissions",
          input(root, "PreToolUse", {
            tool_name: "Read",
            tool_input: { file_path: join(root, "package.json") },
          }),
        ),
      ),
      true,
      "observe mode allows the out-of-set read to expose what the role actually loads",
    );
    assert.equal(
      allowed(invoke(root, "read-observer", nativeRead(root, "package.json"))),
      true,
    );
    assert.ok(
      compareObservedReads(
        directed,
        observations(root).flatMap((row) => row.reads ?? []),
      ).some((row) => row.path === "package.json"),
    );
    const observedScope = scopeReadEvidence(directed, observations(root));
    assert.equal(
      observedScope.refusalCounts.Read ?? 0,
      0,
      "the observe-only attempt is not counted as a refused read",
    );
    assert.equal(
      observedScope.attemptedOutsideDirectedSet.length,
      2,
      "both enforced and observed attempts remain visible",
    );
    assert.equal(
      allowed(
        invoke(
          root,
          "permissions",
          input(root, "PreToolUse", {
            tool_name: "Read",
            tool_input: {
              file_path: join(
                root,
                "docs/control/local/harness/read-scope.json",
              ),
            },
          }),
        ),
      ),
      true,
      "the host decides reads outside compiled authority",
    );
    assert.equal(
      allowed(
        invoke(
          root,
          "permissions",
          input(root, "PreToolUse", {
            tool_name: "Read",
            tool_input: { file_path: "/outside-fixture/synthetic.txt" },
          }),
        ),
      ),
      true,
    );
    const outsideAttempt = scopeReadEvidence(directed, observations(root));
    assert.ok(
      outsideAttempt.attemptedOutsideDirectedSet.some(
        (read) => read.path === "<outside-worktree>",
      ),
    );
    assert.equal(outsideAttempt.unlocatedReadRefusals, 0);
    assert.ok(
      !JSON.stringify(outsideAttempt).includes("/outside-fixture"),
      "external attempted paths are reduced to a shape",
    );
  } finally {
    removeFixture(root, { recursive: true });
  }
});

test("WO-039 confirmed-token adapter uses the compiled correction and survives independent prompt bookkeeping", () => {
  const root = fixture();
  try {
    const program = {
      ...contributorProgram(),
      correctionToken: "fixture-correction:",
    };
    emitHarness(root, {
      program,
      feedback: compileFeedbackUnits(retainedFeedbackUnitsV1),
    });
    const hook = "fail-conservative-correction";
    const payload = input(root, "UserPromptSubmit", {
      prompt: "fixture-correction: synthetic signal",
    });
    assert.deepEqual(
      invoke(root, hook, { ...payload, prompt: "ordinary correction wording" }),
      {},
    );
    assert.deepEqual(invoke(root, hook, payload, true), {});
    const config = configFor(root, hook);
    const expected = applyFeedbackCorrection(
      config.policy,
      {
        allowedEffects: [...program.loadout.authorityEnvelope.allowedEffects],
        destructiveEffects: [
          "repo.write",
          "repo.delete",
          "shell.run",
          "git.local",
          "lifecycle.run",
        ],
        scopeExpansionAllowed: true,
        preserveEvidence: false,
        diagnosisRequired: false,
        corrections: [],
      },
      { type: "OperatorCorrectionReceived", eventId: "correction:0" },
    );
    const result = invoke(root, hook, payload);
    const response = JSON.parse(
      result.hookSpecificOutput.additionalContext
        .split(": ")
        .slice(1)
        .join(": "),
    );
    assert.deepEqual(response, {
      allowedEffects: expected.allowedEffects,
      scopeExpansionAllowed: expected.scopeExpansionAllowed,
      preserveEvidence: expected.preserveEvidence,
      diagnosisRequired: expected.diagnosisRequired,
    });
    invoke(
      root,
      "session",
      input(root, "UserPromptSubmit", { prompt: "resume: next" }),
    );
    for (const [tool_name, expected] of [
      ["Read", true],
      ["Edit", true],
    ])
      assert.equal(
        allowed(
          invoke(
            root,
            "permissions",
            input(root, "PreToolUse", {
              tool_name,
              tool_input: { file_path: join(root, "fixture.ts") },
            }),
          ),
        ),
        expected,
      );
  } finally {
    removeFixture(root, { recursive: true });
  }
});

test("WO-132 commit-message adapter retains publication checks; unavailable runtime delegates all tool access", () => {
  const root = fixture();
  try {
    const path = join(root, ".claude/hooks/commit-msg.mjs");
    for (const message of ["A useful change", "Generated by AI"]) {
      write(root, "docs/control/local/message.txt", message);
      const result = spawnSync(
        process.execPath,
        [path, "docs/control/local/message.txt"],
        { cwd: root, encoding: "utf8" },
      );
      let expected = 0;
      try {
        feedbackBoundary(
          compileFeedbackUnits(
            personalFeedbackUnits.filter(
              (unit) => unit.trigger === "attribution",
            ),
          ),
          { kind: "attribution", message },
          () => {},
        );
      } catch {
        expected = 1;
      }
      assert.equal(result.status, expected);
    }
    const source = readFileSync(path, "utf8");
    const config = JSON.parse(
      source.match(
        /await runCommitMessageHook\(([\s\S]*), feedbackBoundary\);/,
      )[1],
    );
    config.policy = compileFeedbackUnits([]);
    writeFileSync(
      path,
      source.replace(
        /await runCommitMessageHook\([\s\S]*, feedbackBoundary\);/,
        `await runCommitMessageHook(${json(config).trim()}, feedbackBoundary);`,
      ),
    );
    assert.equal(
      spawnSync(process.execPath, [path, "docs/control/local/message.txt"], {
        cwd: root,
      }).status,
      0,
    );
    writableFixtureCopy(
      join(root, configFor(root, "permissions").runtime.snapshot),
    );
    rmSync(
      join(
        root,
        configFor(root, "permissions").runtime.snapshot,
        "packages/skeleton/dist/src/harness-host.js",
      ),
    );
    assert.equal(
      allowed(
        invoke(
          root,
          "permissions",
          input(root, "PreToolUse", {
            tool_name: "Read",
            tool_input: { file_path: join(root, "fixture.ts") },
          }),
        ),
      ),
      true,
      "read access remains available to diagnose the unavailable adapter",
    );
    assert.equal(
      allowed(
        invoke(
          root,
          "session",
          input(root, "UserPromptSubmit", { prompt: "resume: next" }),
        ),
      ),
      true,
      "prompt submission never depends on a built adapter",
    );
    assert.equal(
      allowed(
        invoke(
          root,
          "permissions",
          input(root, "PreToolUse", {
            tool_name: "Edit",
            tool_input: { file_path: join(root, "fixture.ts") },
          }),
        ),
      ),
      true,
      "ordinary write effects delegate to host permissions when the adapter is unavailable",
    );
  } finally {
    removeFixture(root, { recursive: true });
  }
});

test("WO-039 completion tracks outputs across commits and auxiliary prompts retain the active obligation", () => {
  const root = fixture();
  try {
    invoke(
      root,
      "session",
      input(root, "UserPromptSubmit", { prompt: "resume: next" }),
    );
    invoke(
      root,
      "session",
      input(root, "UserPromptSubmit", { prompt: "resume: status" }),
    );
    assert.equal(readiness(root, "no-partial-completion"), false);
    invoke(
      root,
      "session",
      input(root, "UserPromptSubmit", {
        prompt: "ideation: synthetic capture-only",
      }),
    );
    assert.equal(readiness(root, "no-partial-completion"), false);
    const authored = (event) =>
      input(root, event, {
        tool_name: "Write",
        tool_input: { file_path: join(root, "fixture.ts") },
        ...(event === "PostToolUse"
          ? { tool_response: { success: true } }
          : {}),
      });
    invoke(root, "write-observer", authored("PreToolUse"));
    write(root, "fixture.ts", "export const value = 2;\n");
    invoke(root, "read-observer", authored("PostToolUse"));
    const before = git(root, "rev-parse", "HEAD");
    assert.deepEqual(
      harnessOutputObligations(root, observedSession(root)).map(
        (row) => row.path,
      ),
      ["fixture.ts"],
    );
    assert.equal(readiness(root, "read-your-own-output"), false);
    assert.equal(
      allowed(invoke(root, "read-observer", nativeRead(root, "fixture.ts"))),
      true,
    );
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
      "-m",
      "Commit already reviewed fixture outputs",
    );
    assert.ok(harnessOutputs(root, before).length > 0);
    assert.equal(harnessOutputs(root).length, 0);
    assert.equal(
      readiness(root, "read-your-own-output"),
      true,
      "commit does not erase the session's output set",
    );
    write(root, "fixture.ts", "export const value = 3;\n");
    assert.equal(
      readiness(root, "read-your-own-output"),
      false,
      "committed receipts cannot satisfy changed current bytes",
    );
    assert.equal(
      allowed(invoke(root, "read-observer", nativeRead(root, "fixture.ts"))),
      true,
    );
    assert.equal(readiness(root, "read-your-own-output"), true);
  } finally {
    removeFixture(root, { recursive: true });
  }
});

test("WO-127 hook stdin handles manifest-sized, chunked UTF-8 and truncated messages through generated processes", async () => {
  const root = fixture();
  try {
    invoke(
      root,
      "session",
      input(root, "UserPromptSubmit", { prompt: "resume: next" }),
    );
    const manifest = ".claude/harness-manifest.json";
    assert.ok(
      Buffer.byteLength(JSON.stringify(nativeRead(root, manifest))) > 32768,
    );
    assert.equal(
      allowed(invoke(root, "read-observer", nativeRead(root, manifest))),
      true,
    );
    assert.ok(observedSession(root).reads.some((row) => row.path === manifest));
    write(root, "transport.txt", "β🙂".repeat(9000));
    const bytes = Buffer.from(
      JSON.stringify(nativeRead(root, "transport.txt")),
    );
    const piped = async (bytes) => {
      const child = spawn(
        process.execPath,
        [join(root, ".claude/hooks/read-observer.mjs")],
        { cwd: root, timeout: deadlineLimit(1000, 20_000) },
      );
      let stdout = "",
        stderr = "";
      child.stdout.on("data", (chunk) => (stdout += chunk));
      child.stderr.on("data", (chunk) => (stderr += chunk));
      const done = new Promise((resolve, reject) => {
        child.on("error", reject);
        child.on("close", (code, signal) =>
          resolve({ code, signal, stdout, stderr }),
        );
      });
      // Odd chunk boundaries deliberately split multi-byte code points. Each
      // write callback waits for consumption so the parent respects backpressure.
      for (let offset = 0; offset < bytes.length; offset += 997)
        await new Promise((resolve, reject) =>
          child.stdin.write(bytes.subarray(offset, offset + 997), (error) =>
            error ? reject(error) : resolve(),
          ),
        );
      child.stdin.end();
      const result = await done;
      assert.equal(
        result.code,
        0,
        JSON.stringify({ signal: result.signal, stderr: result.stderr }),
      );
      return JSON.parse(result.stdout);
    };
    assert.equal(allowed(await piped(bytes)), true);
    assert.ok(
      observedSession(root).reads.some((row) => row.path === "transport.txt"),
    );
    assert.equal(
      allowed(await piped(bytes.subarray(0, bytes.length - 1))),
      true,
    );
  } finally {
    removeFixture(root, { recursive: true });
  }
});

test("WO-039 foreign writer reservations refuse while their owner lives, reclaim with a record when it is dead, and stay inspectable", () => {
  const root = fixture();
  try {
    invoke(
      root,
      "session",
      input(root, "UserPromptSubmit", { prompt: "resume: next" }),
    );
    const lock = join(root, "docs/control/local/harness/writer");
    const reserve = (writer) => {
      rmSync(lock, { recursive: true, force: true });
      seedHarnessWriter(root, writer);
    };
    const current = () => {
      const [name, ...rest] = readdirSync(lock);
      assert.match(name ?? "", /^reservation-[0-9a-f]{32}\.json$/);
      assert.deepEqual(rest, [], "one reservation file per instance");
      return JSON.parse(readFileSync(join(lock, name), "utf8"));
    };
    const cli = (...args) =>
      spawnSync(process.execPath, ["scripts/harness.mjs", "writer", ...args], {
        cwd: root,
        encoding: "utf8",
      });
    const reason = (payload) =>
      invoke(root, "concurrent-work-requires-worktrees", payload)
        .hookSpecificOutput.permissionDecisionReason;
    const edit = input(root, "PreToolUse", {
      tool_name: "Edit",
      tool_input: { file_path: join(root, "fixture.ts") },
    });
    const command = (text) =>
      input(root, "PreToolUse", {
        tool_name: "Bash",
        tool_input: { command: text },
      });
    const self = createHash("sha256").update("synthetic-session").digest("hex");
    const foreign = createHash("sha256")
      .update("foreign-fixture-session")
      .digest("hex");
    const exited = spawnSync(process.execPath, ["-e", ""]);
    assert.equal(exited.status, 0);
    const dead = {
      pid: exited.pid,
      startedAt: "Thu Jan  1 00:00:00 1970",
      source: "CLAUDE_PID",
    };
    const live = { pid: process.pid, source: "CLAUDE_PID" };
    assert.equal(harnessProcessAlive(live), true);
    assert.equal(harnessProcessAlive(dead), false);
    assert.equal(harnessProcessAlive({ pid: 1, source: "parent" }), false);
    const host = harnessHostProcess();
    assert.ok(host.pid > 1 && harnessProcessAlive(host), "live host process");
    assert.ok(["CLAUDE_PID", "ancestor", "parent"].includes(host.source));

    // A live foreign reservation refuses every write dispatch and names its holder.
    reserve({
      actorId: foreign,
      worktree: root,
      owner: live,
      reservedAt: "2026-09-07T00:00:00.000Z",
    });
    parity(root, "concurrent-work-requires-worktrees", edit, false);
    const refused = reason(edit);
    assert.match(
      refused,
      /reserved by another session \(actor [0-9a-f]{12}; host process \d+ is alive\)/,
    );
    assert.ok(
      refused.includes(foreign.slice(0, 12)) &&
        refused.includes("writer --show") &&
        refused.includes("writer --release"),
    );
    assert.ok(
      !refused.includes(root) && !refused.includes(foreign.slice(12)),
      "the refusal names no path and no full actor key",
    );
    assert.equal(
      allowed(
        invoke(
          root,
          "concurrent-work-requires-worktrees",
          input(root, "PreToolUse", {
            tool_name: "Write",
            tool_input: { file_path: join(root, "fixture.ts") },
          }),
        ),
      ),
      false,
    );
    assert.equal(
      current().actorId,
      foreign,
      "a live foreign reservation is never replaced",
    );
    // The refused session keeps metadata and the operator view; neither reserves.
    parity(
      root,
      "concurrent-work-requires-worktrees",
      command("node scripts/harness.mjs writer --show"),
      true,
    );
    assert.equal(
      allowed(
        invoke(
          root,
          "permissions",
          command("node scripts/harness.mjs writer --show"),
        ),
      ),
      true,
    );
    const shown = cli("--show");
    assert.equal(shown.status, 0, shown.stderr);
    const view = JSON.parse(shown.stdout);
    assert.deepEqual(
      {
        contract: view.contract,
        reserved: view.reserved,
        actorId: view.actorId,
        pid: view.owner.pid,
        alive: view.alive,
      },
      {
        contract: "harness-writer-v1",
        reserved: true,
        actorId: foreign,
        pid: process.pid,
        alive: true,
      },
    );
    assert.ok(!shown.stdout.includes(root), "the view names no absolute path");
    assert.equal(
      current().actorId,
      foreign,
      "showing never reserves or releases",
    );
    // A governed session cannot release a live foreign reservation; an operator must force it.
    parity(
      root,
      "concurrent-work-requires-worktrees",
      command("node scripts/harness.mjs writer --release"),
      false,
    );
    const declined = cli("--release");
    assert.equal(declined.status, 1);
    assert.match(declined.stderr, /alive/);
    assert.equal(current().actorId, foreign);
    const forced = cli("--release", "--force");
    assert.equal(forced.status, 0, forced.stderr);
    assert.equal(JSON.parse(forced.stdout).released, true);
    assert.equal(existsSync(lock), false);
    assert.deepEqual(
      writerEvents(root)
        .map((row) => row.event)
        .slice(-1),
      ["operator-released"],
    );
    // A foreign reservation without a recorded owner is honoured until an operator releases it.
    reserve({ actorId: foreign, worktree: root });
    parity(root, "concurrent-work-requires-worktrees", edit, false);
    assert.match(reason(edit), /host process is not recorded/);
    assert.equal(current().actorId, foreign);
    assert.equal(JSON.parse(cli("--show").stdout).alive, "unknown");
    const unknown = cli("--release");
    assert.equal(unknown.status, 0, unknown.stderr);
    assert.equal(JSON.parse(unknown.stdout).alive, "unknown");
    assert.equal(existsSync(lock), false);
    // A foreign reservation whose owner is dead is reclaimed once, with a record, and work proceeds.
    reserve({
      actorId: foreign,
      worktree: root,
      owner: dead,
      reservedAt: "2026-09-07T00:00:00.000Z",
    });
    parity(root, "concurrent-work-requires-worktrees", edit, true);
    const reclaimed = current();
    assert.equal(reclaimed.actorId, self);
    assert.equal(reclaimed.reclaimed.actorId, foreign);
    assert.equal(reclaimed.reclaimed.owner.pid, exited.pid);
    assert.ok(
      harnessProcessAlive(reclaimed.owner),
      "the reclaiming session records its live owner",
    );
    assert.ok(
      observations(root).some(
        (row) =>
          row.writerReclaimed?.actorId === foreign &&
          row.writerReclaimed.owner.pid === exited.pid,
      ),
    );
    assert.ok(
      writerEvents(root).some(
        (row) => row.event === "reclaimed" && row.previous.actorId === foreign,
      ),
    );
    assert.equal(
      allowed(invoke(root, "concurrent-work-requires-worktrees", edit)),
      true,
    );
    assert.equal(
      current().actorId,
      self,
      "the reclaiming session keeps its reservation",
    );
    // An operator releases a dead-owner reservation without force.
    reserve({ actorId: foreign, worktree: root, owner: dead });
    const released = cli("--release");
    assert.equal(released.status, 0, released.stderr);
    assert.equal(JSON.parse(released.stdout).alive, false);
    assert.equal(existsSync(lock), false);
    assert.deepEqual(
      {
        event: writerEvents(root).at(-1).event,
        actorId: writerEvents(root).at(-1).actorId,
        alive: writerEvents(root).at(-1).alive,
      },
      { event: "operator-released", actorId: foreign, alive: false },
      "the release journal names the reservation it judged and retired",
    );
    // A self-owned reservation without an owner gains one; a self-owned dead
    // owner disables liveness for that lock instead of trusting the identity.
    reserve({ actorId: self, worktree: root });
    const unowned = readdirSync(lock)[0];
    assert.equal(
      allowed(invoke(root, "concurrent-work-requires-worktrees", edit)),
      true,
    );
    assert.deepEqual(
      { pid: current().owner.pid, source: current().owner.source },
      { pid: process.pid, source: "CLAUDE_PID" },
    );
    assert.deepEqual(
      {
        renamed: readdirSync(lock)[0] !== unowned,
        supersedes: current().supersedes,
      },
      { renamed: true, supersedes: unowned },
      "a recorded fact is a new instance naming the one it replaced",
    );
    reserve({ actorId: self, worktree: root, owner: dead });
    const distrusted = readdirSync(lock)[0];
    assert.equal(
      allowed(invoke(root, "concurrent-work-requires-worktrees", edit)),
      true,
    );
    assert.equal(current().liveness, "unavailable");
    assert.deepEqual(
      {
        renamed: readdirSync(lock)[0] !== distrusted,
        supersedes: current().supersedes,
      },
      { renamed: true, supersedes: distrusted },
    );
    assert.ok(
      !cli("--show").stdout.includes("supersedes"),
      "the view never names an instance",
    );
    assert.ok(
      observations(root).some(
        (row) => row.writerLivenessUnavailable?.pid === exited.pid,
      ),
    );
    reserve({ ...current(), actorId: foreign });
    parity(root, "concurrent-work-requires-worktrees", edit, false);
    assert.match(reason(edit), /unknown liveness/);
    assert.equal(
      current().actorId,
      foreign,
      "an untrusted owner identity never reclaims",
    );
    assert.equal(JSON.parse(cli("--show").stdout).alive, "unknown");
    // Pre-repair single-file reservations are honoured while live, reclaimed
    // when dead, and migrated when they belong to this session; none is created.
    rmSync(lock, { recursive: true, force: true });
    const legacy = join(root, "docs/control/local/harness/writer.json");
    const legacyWriter = (writer) =>
      writeFileSync(legacy, JSON.stringify(writer) + "\n");
    legacyWriter({ actorId: foreign, worktree: root, owner: live });
    parity(root, "concurrent-work-requires-worktrees", edit, false);
    assert.match(reason(edit), /host process \d+ is alive/);
    assert.equal(JSON.parse(cli("--show").stdout).actorId, foreign);
    assert.ok(
      existsSync(legacy) && !existsSync(lock),
      "a live legacy holder is honoured",
    );
    legacyWriter({ actorId: foreign, worktree: root, owner: dead });
    parity(root, "concurrent-work-requires-worktrees", edit, true);
    assert.equal(
      existsSync(legacy),
      false,
      "a dead legacy holder is reclaimed",
    );
    assert.deepEqual(
      { actorId: current().actorId, previous: current().reclaimed.actorId },
      { actorId: self, previous: foreign },
    );
    assert.equal(writerEvents(root).at(-1).event, "reclaimed");
    rmSync(lock, { recursive: true, force: true });
    legacyWriter({ actorId: self, worktree: root, owner: live });
    assert.equal(
      allowed(invoke(root, "concurrent-work-requires-worktrees", edit)),
      true,
    );
    assert.equal(
      existsSync(legacy),
      false,
      "this session's legacy file migrates",
    );
    assert.deepEqual(
      { actorId: current().actorId, liveness: current().liveness },
      { actorId: self, liveness: undefined },
    );
    assert.deepEqual(
      writerEvents(root)
        .slice(-2)
        .map((row) => row.event),
      ["migrated", "acquired"],
    );
    legacyWriter({ actorId: self, worktree: root, owner: dead });
    assert.equal(
      allowed(invoke(root, "concurrent-work-requires-worktrees", edit)),
      true,
    );
    assert.ok(
      !existsSync(legacy) && current().liveness === undefined,
      "a stale legacy file beside a live instance is only removed",
    );
    rmSync(lock, { recursive: true, force: true });
    legacyWriter({ actorId: self, worktree: root, owner: dead });
    assert.equal(
      allowed(invoke(root, "concurrent-work-requires-worktrees", edit)),
      true,
    );
    assert.equal(
      current().liveness,
      "unavailable",
      "a migrated self-distrusted identity stays untrusted",
    );
  } finally {
    removeFixture(root, { recursive: true });
  }
});

// Delays one real filesystem call on the observed reservation until a barrier
// file appears; liveness, contents, host facts and the hook verdict are untouched.
const interleavePreload = `import fs from "node:fs";
import { syncBuiltinESMExports } from "node:module";
import { deadlineLimit, startDeadline } from ${JSON.stringify(new URL("../packages/skeleton/src/gate-deadlines.mjs", import.meta.url).href)};
const stage = process.env.RACE_STAGE;
const original = fs[stage];
const sleeper = new Int32Array(new SharedArrayBuffer(4));
fs[stage] = function () {
  const lock = process.env.RACE_LOCK_DIR;
  const under = (path) => typeof path === "string" && (path === lock || path.startsWith(lock + "/"));
  if ([...arguments].some(under)) {
    fs.writeFileSync(process.env.RACE_READY, "ready");
    const deadline = startDeadline("harness:held-barrier", deadlineLimit(1000, 20000));
    while (!fs.existsSync(process.env.RACE_GO)) {
      deadline.check();
      Atomics.wait(sleeper, 0, 0, 5);
    }
    deadline.finish();
  }
  return original.apply(this, arguments);
};
syncBuiltinESMExports();
`;

// The shared race harness: a dead holder to seed, generated-hook contenders
// and the public operator command started under the interleaving preload,
// barriers, and the fixture's view of the reservation and its event log.
function raceHarness(root, children) {
  const stateDir = join(root, "docs/control/local/harness");
  const lock = join(stateDir, "writer");
  const exited = spawnSync(process.execPath, ["-e", ""]);
  assert.equal(exited.status, 0);
  const dead = {
    pid: exited.pid,
    startedAt: "Thu Jan  1 00:00:00 1970",
    source: "CLAUDE_PID",
  };
  const actor = (label) =>
    createHash("sha256").update(`fixture-${label}`).digest("hex");
  const seed = (writer) => {
    rmSync(lock, { recursive: true, force: true });
    seedHarnessWriter(root, {
      worktree: root,
      reservedAt: "2026-09-07T00:00:00.000Z",
      ...writer,
    });
  };
  const seedDead = () => seed({ actorId: actor("dead"), owner: dead });
  const preload = join(stateDir, "interleave.mjs");
  mkdirSync(stateDir, { recursive: true });
  writeFileSync(preload, interleavePreload);
  const edit = (label) =>
    input(root, "PreToolUse", {
      session_id: `fixture-${label}`,
      tool_name: "Edit",
      tool_input: { file_path: join(root, "fixture.ts") },
    });
  const start = (label, stage, args, payload) => {
    const child = spawn(process.execPath, ["--import", preload, ...args], {
      cwd: root,
      env: {
        ...process.env,
        CLAUDE_PID: String(process.pid),
        RACE_STAGE: stage,
        RACE_LOCK_DIR: lock,
        RACE_READY: join(stateDir, `${label}.ready`),
        RACE_GO: join(stateDir, `${label}.go`),
      },
      stdio: ["pipe", "pipe", "pipe"],
    });
    children.push(child);
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => (stdout += chunk));
    child.stderr.on("data", (chunk) => (stderr += chunk));
    const done = new Promise((resolve, reject) => {
      child.on("error", reject);
      child.on("close", (code) => resolve({ code, stdout, stderr }));
    });
    child.stdin.end(payload ? JSON.stringify(payload) : "");
    return done;
  };
  const contend = (label, stage) =>
    start(
      label,
      stage,
      [".claude/hooks/concurrent-work-requires-worktrees.mjs"],
      edit(label),
    );
  const operate = (label, stage, ...flags) =>
    start(
      label,
      stage,
      ["scripts/harness.mjs", "writer", "--release", ...flags],
      null,
    );
  const paused = async (label) => {
    const deadline = startDeadline(
      "harness:await-barrier",
      deadlineLimit(1000, 20_000),
    );
    while (!existsSync(join(stateDir, `${label}.ready`))) {
      deadline.check();
      await new Promise((resolve) => setTimeout(resolve, 5));
    }
    deadline.finish();
  };
  const release = (label) => writeFileSync(join(stateDir, `${label}.go`), "go");
  const verdict = async (done) => {
    const run = await done;
    assert.equal(run.code, 0, run.stderr);
    return JSON.parse(run.stdout);
  };
  const names = () => readdirSync(lock);
  const holder = () => JSON.parse(readFileSync(join(lock, names()[0]), "utf8"));
  const events = () => writerEvents(root).map((row) => row.event);
  const dispatch = (label) =>
    allowed(invoke(root, "concurrent-work-requires-worktrees", edit(label)));
  return {
    lock,
    dead,
    actor,
    seed,
    seedDead,
    edit,
    contend,
    operate,
    paused,
    release,
    verdict,
    names,
    holder,
    events,
    dispatch,
  };
}

test("WO-039 concurrent dead-owner recovery admits exactly one writer while the first owner's work is outstanding", async () => {
  const root = fixture();
  const children = [];
  try {
    const {
      actor,
      seedDead,
      edit,
      contend,
      paused,
      release,
      verdict,
      holder,
      events,
      dispatch,
    } = raceHarness(root, children);

    // VER-002 F1: two contenders classify the same dead holder, pause before
    // their first mutation, and then act in turn.
    seedDead();
    const b = contend("B", "unlinkSync");
    await paused("B");
    const a = contend("A", "unlinkSync");
    await paused("A");
    release("A");
    assert.equal(allowed(await verdict(a)), true);
    assert.deepEqual(
      { actorId: holder().actorId, previous: holder().reclaimed.actorId },
      { actorId: actor("A"), previous: actor("dead") },
    );
    assert.ok(
      harnessProcessAlive(holder().owner),
      "the first owner's authorized work is outstanding",
    );
    release("B");
    const second = await verdict(b);
    assert.equal(
      allowed(second),
      false,
      "a second reclaimer of the same dead holder is refused",
    );
    assert.match(
      second.hookSpecificOutput.permissionDecisionReason,
      new RegExp(
        `reserved by another session \\(actor ${actor("A").slice(0, 12)}; host process \\d+(?: started [^)]+)? is alive\\)`,
      ),
    );
    assert.equal(
      holder().actorId,
      actor("A"),
      "the loser preserved the winner's reservation",
    );
    assert.deepEqual(events(), ["reclaimed"]);
    assert.equal(writerEvents(root)[0].previous.actorId, actor("dead"));
    assert.deepEqual([dispatch("A"), dispatch("B")], [true, false]);
    // The loser proceeds only after the winner's accepted finish releases.
    releaseHarnessWriter(root, edit("A"));
    assert.equal(dispatch("B"), true);
    assert.equal(holder().actorId, actor("B"));
    assert.deepEqual(events(), ["reclaimed", "released", "acquired"]);

    // A contender paused after emptying the dead instance but before removing
    // it loses to a placement over the emptied slot and records the retirement.
    releaseHarnessWriter(root, edit("B"));
    seedDead();
    const c = contend("C", "rmdirSync");
    await paused("C");
    assert.equal(dispatch("D"), true, "an emptied instance is an open slot");
    assert.equal(holder().actorId, actor("D"));
    release("C");
    assert.equal(allowed(await verdict(c)), false);
    assert.equal(holder().actorId, actor("D"));
    assert.deepEqual(events().slice(-3), ["released", "acquired", "retired"]);
    assert.equal(writerEvents(root).at(-1).previous.actorId, actor("dead"));
    assert.deepEqual([dispatch("D"), dispatch("C")], [true, false]);
  } finally {
    for (const child of children)
      if (child.exitCode === null) child.kill("SIGKILL");
    removeFixture(root, { recursive: true });
  }
});

test("WO-039 a refreshed reservation survives a stale reclaimer that classified its previous facts", async () => {
  const root = fixture();
  const children = [];
  try {
    const {
      dead,
      actor,
      seed,
      edit,
      contend,
      paused,
      release,
      verdict,
      names,
      holder,
      events,
      dispatch,
    } = raceHarness(root, children);
    // VER-003 F1: the owning session finds its recorded owner dead and records
    // that fact while a contender that classified the previous facts as dead
    // is paused before its unlink. The owner's authorized work is outstanding,
    // so the contender must not remove the refreshed reservation and proceed.
    seed({ actorId: actor("A"), owner: dead });
    const seeded = names()[0];
    const stale = contend("E", "unlinkSync");
    await paused("E");
    assert.equal(
      dispatch("A"),
      true,
      "the owning session keeps its reservation",
    );
    assert.equal(holder().liveness, "unavailable");
    release("E");
    const staleVerdict = await verdict(stale);
    assert.equal(
      allowed(staleVerdict),
      false,
      "a stale reclaimer removed refreshed facts and was admitted",
    );
    assert.match(
      staleVerdict.hookSpecificOutput.permissionDecisionReason,
      new RegExp(
        `reserved by another session \\(actor ${actor("A").slice(0, 12)}; host process \\d+(?: started [^)]+)? is of unknown liveness\\)`,
      ),
    );
    assert.deepEqual(
      {
        actorId: holder().actorId,
        liveness: holder().liveness,
        supersedes: holder().supersedes,
        renamed: names()[0] !== seeded,
        files: names().length,
      },
      {
        actorId: actor("A"),
        liveness: "unavailable",
        supersedes: seeded,
        renamed: true,
        files: 1,
      },
      "the refreshed facts live under a new name that names the superseded one",
    );
    assert.deepEqual(events(), ["liveness-unavailable"]);
    assert.deepEqual([dispatch("A"), dispatch("E")], [true, false]);

    // The other order: the reclaimer removes the previous facts and takes the
    // slot before the owner's refresh lands, so the refresh finds the slot no
    // longer its own, withdraws, and honours the live replacement.
    releaseHarnessWriter(root, edit("A"));
    seed({ actorId: actor("A"), owner: dead });
    const owner = contend("A", "renameSync");
    await paused("A");
    assert.equal(dispatch("M"), true, "the reclaimer takes the emptied slot");
    assert.deepEqual(
      { actorId: holder().actorId, previous: holder().reclaimed.actorId },
      { actorId: actor("M"), previous: actor("A") },
    );
    release("A");
    const ownerVerdict = await verdict(owner);
    assert.equal(allowed(ownerVerdict), false);
    assert.match(
      ownerVerdict.hookSpecificOutput.permissionDecisionReason,
      new RegExp(
        `reserved by another session \\(actor ${actor("M").slice(0, 12)}; host process \\d+(?: started [^)]+)? is alive\\)`,
      ),
    );
    assert.deepEqual(
      { actorId: holder().actorId, files: names().length },
      { actorId: actor("M"), files: 1 },
      "the withdrawn refresh left the replacement's instance alone",
    );
    assert.deepEqual(events().slice(-2), ["released", "reclaimed"]);
    assert.deepEqual([dispatch("M"), dispatch("A")], [true, false]);
  } finally {
    for (const child of children)
      if (child.exitCode === null) child.kill("SIGKILL");
    removeFixture(root, { recursive: true });
  }
});

test("WO-039 an operator release judges, retires and journals one observed reservation", async () => {
  const root = fixture();
  const children = [];
  try {
    const {
      lock,
      actor,
      seedDead,
      edit,
      operate,
      paused,
      release,
      holder,
      events,
      dispatch,
    } = raceHarness(root, children);
    // VER-003 F2: a reclaimer replaces the dead holder after the public
    // release command judged it. The unforced release judges the replacement
    // by the same rule and, finding it alive, refuses; the replacement survives.
    seedDead();
    const unforced = operate("F", "unlinkSync");
    await paused("F");
    assert.equal(dispatch("G"), true);
    assert.deepEqual(
      { actorId: holder().actorId, previous: holder().reclaimed.actorId },
      { actorId: actor("G"), previous: actor("dead") },
    );
    release("F");
    const refusedRelease = await unforced;
    assert.equal(
      refusedRelease.code,
      1,
      `an unforced release removed the live replacement: ${refusedRelease.stdout}`,
    );
    assert.match(refusedRelease.stderr, /owner is alive/);
    assert.equal(
      holder().actorId,
      actor("G"),
      "the live replacement survives an unforced operator release",
    );
    assert.deepEqual(events(), ["reclaimed"]);
    assert.deepEqual([dispatch("G"), dispatch("H")], [true, false]);
    // A forced release binds to the holder the operator judged; once that
    // holder changed, it refuses instead of removing the replacement.
    releaseHarnessWriter(root, edit("G"));
    seedDead();
    const forced = operate("I", "unlinkSync", "--force");
    await paused("I");
    assert.equal(dispatch("J"), true);
    release("I");
    const refusedForce = await forced;
    assert.equal(refusedForce.code, 1, refusedForce.stdout);
    assert.match(refusedForce.stderr, /changed while releasing/);
    assert.equal(holder().actorId, actor("J"));
    assert.ok(!events().includes("operator-released"));
    assert.deepEqual([dispatch("J"), dispatch("K")], [true, false]);
    // Uncontended, the same command releases the dead holder it judged and
    // journals that holder.
    releaseHarnessWriter(root, edit("J"));
    seedDead();
    const plain = spawnSync(
      process.execPath,
      ["scripts/harness.mjs", "writer", "--release"],
      { cwd: root, encoding: "utf8" },
    );
    assert.equal(plain.status, 0, plain.stderr);
    assert.deepEqual(
      {
        released: JSON.parse(plain.stdout).released,
        alive: JSON.parse(plain.stdout).alive,
        lock: existsSync(lock),
        journaled: writerEvents(root).at(-1).actorId,
      },
      { released: true, alive: false, lock: false, journaled: actor("dead") },
    );
  } finally {
    for (const child of children)
      if (child.exitCode === null) child.kill("SIGKILL");
    removeFixture(root, { recursive: true });
  }
});

test("WO-132 generated hooks delegate classification, attribution, scope and runtime gaps with advisory journal rows", () => {
  const root = fixture();
  try {
    const journal = join(
      root,
      "docs/control/local/harness",
      createHash("sha256").update("synthetic-session").digest("hex") + ".jsonl",
    );
    const seen = new Set();
    const delegated = (hook, payload) => {
      const result = invoke(root, hook, payload);
      assert.equal(allowed(result), true, JSON.stringify(result));
      const rows = readFileSync(journal, "utf8")
        .trim()
        .split("\n")
        .map(JSON.parse);
      const advisory = rows.at(-1).advisory;
      assert.match(advisory, /DotLn advisory:.*host permissions decide/);
      assert.equal(rows.at(-1).delegated, true);
      const cause =
        /snapshot-missing|runtime-unavailable|pins-differ/.exec(
          advisory,
        )?.[0] ?? "classification";
      if (payload.hook_event_name === "PostToolUse" || seen.has(cause))
        assert.equal(result.systemMessage, undefined);
      else {
        assert.equal(result.systemMessage, advisory);
        seen.add(cause);
      }
      return result;
    };
    for (const name of ["SubagentHandback", "SendMessage", "SomeNewTool"])
      delegated(
        "permissions",
        input(root, "PreToolUse", { tool_name: name, tool_input: {} }),
      );
    for (const command of [
      "for file in a b; do printf '%s' \"$file\"; done",
      "echo $(printf value)",
    ])
      delegated(
        "permissions",
        input(root, "PreToolUse", {
          tool_name: "Bash",
          tool_input: { command },
        }),
      );
    delegated(
      "permissions",
      input(root, "PreToolUse", {
        tool_name: "Read",
        tool_input: { file_path: "/outside/fixture.txt" },
      }),
    );
    delegated(
      "no-attribution",
      input(root, "PreToolUse", {
        tool_name: "Bash",
        tool_input: { command: "git commit -m 'Generated by Codex'" },
      }),
    );
    write(
      root,
      "docs/control/local/harness/read-scope.json",
      json({
        role: "executor",
        skill: "fixture",
        reads: [],
        commands: [],
        mode: "enforce",
      }),
    );
    delegated(
      "permissions",
      input(root, "PreToolUse", {
        tool_name: "Read",
        tool_input: { file_path: join(root, "fixture.ts") },
      }),
    );
    delegated(
      "read-observer",
      input(root, "PostToolUse", {
        tool_name: "Read",
        tool_input: { file_path: "/outside/fixture.txt" },
        tool_response: {},
      }),
    );
    // Missing pinned runtime takes the generated, self-contained fallback.
    removeFixture(join(root, ".runtime"), { recursive: true, force: true });
    delegated(
      "permissions",
      input(root, "PreToolUse", {
        tool_name: "Write",
        tool_input: { file_path: join(root, "fixture.ts") },
      }),
    );
  } finally {
    removeFixture(root, { recursive: true });
  }
});

test("WO-132 main uses one reservation for build, bootstrap, history and release; coordination tools do not become writers", () => {
  const root = fixture();
  try {
    git(root, "switch", "-c", "main");
    assert.equal(
      allowed(
        invoke(
          root,
          "concurrent-work-requires-worktrees",
          input(root, "PreToolUse", {
            tool_name: "Bash",
            tool_input: { command: "pwd" },
          }),
        ),
      ),
      true,
    );
    assert.equal(
      existsSync(join(root, "docs/control/local/harness/writer")),
      false,
    );
    const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
    pkg.scripts.build = "node scripts/bootstrap.mjs";
    write(root, "package.json", json(pkg));
    write(
      root,
      "scripts/bootstrap.mjs",
      "process.stdout.write('fixture bootstrap\\n');\n",
    );
    write(
      root,
      "scripts/release.mjs",
      "process.stdout.write('fixture release\\n');\n",
    );
    for (const [command, binary, args] of [
      ["npm run build", "npm", ["run", "build"]],
      [
        "node scripts/bootstrap.mjs",
        process.execPath,
        ["scripts/bootstrap.mjs"],
      ],
      ["git log --oneline", "git", ["log", "--oneline"]],
      [
        "node scripts/release.mjs close WO-999 --publish",
        process.execPath,
        ["scripts/release.mjs", "close", "WO-999", "--publish"],
      ],
    ]) {
      const payload = input(root, "PreToolUse", {
        tool_name: "Bash",
        tool_input: { command },
      });
      assert.equal(
        allowed(invoke(root, "concurrent-work-requires-worktrees", payload)),
        true,
      );
      assert.equal(allowed(invoke(root, "permissions", payload)), true);
      assert.equal(
        spawnSync(binary, args, { cwd: root, encoding: "utf8" }).status,
        0,
      );
    }
    const second = input(root, "PreToolUse", {
      session_id: "other-writer",
      tool_name: "Bash",
      tool_input: { command: "npm run build" },
    });
    const refusal = invoke(root, "concurrent-work-requires-worktrees", second);
    assert.equal(refusal.hookSpecificOutput?.permissionDecision, "deny");
    assert.match(
      refusal.hookSpecificOutput.permissionDecisionReason,
      /reserved by another session/,
    );
    for (const tool_name of ["SubagentHandback", "SendMessage", "SomeNewTool"])
      assert.equal(
        allowed(
          invoke(root, "concurrent-work-requires-worktrees", {
            ...second,
            tool_name,
            tool_input: {},
          }),
        ),
        true,
      );
    releaseHarnessWriter(root, input(root, "Stop"));
    seedHarnessWriter(root, {
      actorId: "dead-holder",
      worktree: root,
      owner: { pid: 99999999, source: "parent" },
      reservedAt: new Date().toISOString(),
    });
    assert.equal(
      allowed(invoke(root, "concurrent-work-requires-worktrees", second)),
      true,
    );
    assert.match(
      readFileSync(
        join(root, "docs/control/local/harness/writer-events.jsonl"),
        "utf8",
      ),
      /"event":"reclaimed"/,
    );
  } finally {
    removeFixture(root, { recursive: true });
  }
});

test("WO-132 only the live product gate refuses input and success-record writes, including opaque shell writes", () => {
  const root = fixture();
  try {
    // VER-003 F1: these literal append destinations are protected gate inputs.
    for (const path of ["1", "-"]) write(root, path, "seed\n");
    git(root, "add", "--", "1", "-");
    for (const path of ["1", "-"])
      assert.equal(gateInputPath(root, path), true, path);
    const payload = (tool_name, tool_input) =>
      input(root, "PreToolUse", { tool_name, tool_input });
    const shellPayloads = (command) => [
      payload("Bash", { command }),
      payload("exec_command", { command }),
      payload("exec_command", { cmd: command }),
    ];
    const writes = [
      payload("Write", {
        file_path: join(root, "fixture.ts"),
        content: "changed",
      }),
      payload("Write", {
        file_path: join(root, "docs/control/local/harness/checks.json"),
        content: "[]",
      }),
      payload("Bash", {
        command: 'for file in fixture.ts; do printf change > "$file"; done',
      }),
      payload("Bash", { command: "echo $(printf change) > fixture.ts" }),
      ...[
        "ls scripts > fixture.ts",
        "head -5 fixture.ts >> docs/control/local/harness/checks.json",
        "grep -n value fixture.ts | tee fixture.ts",
        "ls scripts && touch fixture.ts",
        'ls "$(touch fixture.ts)"',
        "for file in fixture.ts; do head -5 fixture.ts; done",
        "head -5 <(cat fixture.ts)",
        "grep value *.ts",
        'ls "$TARGET"',
        "env ls scripts",
        "rg --pre script value fixture.ts",
        // VER-002 F1: descriptor-style redirects open their operand as a file.
        "ls scripts >&packages/skeleton/dist/src/harness-command.js",
        "ls scripts 1>&packages/skeleton/dist/src/harness-command.js",
        "ls scripts >>&packages/skeleton/dist/src/harness-command.js",
        `head -5 fixture.ts >&${join(root, "packages/skeleton/dist/src/harness-command.js")}`,
        "grep value fixture.ts >&./node_modules/y",
        "ls scripts >& fixture.ts",
      ].map((command) => payload("Bash", { command })),
      ...[
        "echo marker >>&1",
        "echo marker >>&-",
        "echo marker >>& 1",
        "echo marker >>& -",
        "echo marker 1>>&1",
        "ls scripts >>&1",
        "head -1 fixture.ts >>&-",
        // VER-004 F1: shell-special prefixes must never be classified as
        // literal paths that the unanchored dist/node_modules rules ignore.
        "ls scripts >!packages/skeleton/dist/src/harness-command.js",
        "ls scripts 1>!packages/skeleton/dist/src/harness-command.js",
        "ls scripts >>!packages/skeleton/dist/src/harness-command.js",
        "ls scripts >&!packages/skeleton/dist/src/harness-command.js",
        "ls scripts >>&!packages/skeleton/dist/src/harness-command.js",
        "ls scripts &>!packages/skeleton/dist/src/harness-command.js",
        "ls scripts &>>!packages/skeleton/dist/src/harness-command.js",
        `head -1 fixture.ts >!${join(root, "packages/skeleton/dist/src/harness-command.js")}`,
        "grep value fixture.ts >!./node_modules/y",
        "echo x >!packages/skeleton/dist/src/harness-command.js",
        "ls scripts >! packages/skeleton/dist/src/harness-command.js",
        "ls scripts >&! ./node_modules/y",
        "ls scripts >=packages/skeleton/dist/src/harness-command.js",
        "ls scripts >& =./node_modules/y",
      ].flatMap(shellPayloads),
    ];
    const reads = [
      payload("Bash", { command: "ls scripts" }),
      payload("Bash", { command: "head -5 fixture.ts" }),
      payload("Bash", { command: "grep -n value fixture.ts | head -40" }),
      ...[
        "ls scripts 2>&-",
        "ls scripts >&-",
        "ls scripts 2>& 1",
        "grep -n value fixture.ts 2>&1 | head -3",
      ].flatMap(shellPayloads),
      payload("exec_command", { command: "ls -l scripts" }),
      payload("Bash", { command: "node scripts/harness.mjs evidence --stop" }),
      payload("Read", { file_path: join(root, "fixture.ts") }),
    ];
    const active = beginGateRun(root, "npm test");
    try {
      for (const hook of [
        "permissions",
        "concurrent-work-requires-worktrees",
        "write-observer",
      ]) {
        for (const request of writes)
          assert.equal(
            invoke(root, hook, request).hookSpecificOutput?.permissionDecision,
            "deny",
            `${hook}: ${JSON.stringify(request.tool_input)}`,
          );
        for (const request of reads)
          assert.equal(
            allowed(invoke(root, hook, request)),
            true,
            `${hook}: ${JSON.stringify(request.tool_input)}`,
          );
      }
    } finally {
      active.release();
    }
    for (const request of writes)
      assert.equal(allowed(invoke(root, "permissions", request)), true);
  } finally {
    removeFixture(root, { recursive: true });
  }
});

test("WO-135 generated planning hooks refuse repository code paths and preserve documents, scratch and override", () => {
  const root = fixture();
  const scratch = realpathSync(
    mkdtempSync(join(tmpdir(), "dotln-planning-scratch-")),
  );
  const sessionId = `wo135-planning-${root}`;
  try {
    git(root, "switch", "-c", "planning/2030-01-02-fixture");
    mkdirSync(join(root, "docs"), { recursive: true });
    symlinkSync(join(root, "scripts"), join(root, "docs/source"));
    symlinkSync(scratch, join(root, "docs/scratch"));
    symlinkSync(join(root, "scripts"), join(scratch, "source"));
    const payload = (tool, args) =>
      input(root, "PreToolUse", {
        session_id: sessionId,
        tool_name: tool,
        tool_input: args,
      });
    const denied = [
      payload("Write", { file_path: "scripts/new.mjs" }),
      payload("Edit", { file_path: join(root, "package.json") }),
      payload("NotebookEdit", { notebook_path: "nested/notes.md" }),
      payload("Write", { file_path: "docs/source/new.mjs" }),
      payload("Write", { file_path: join(scratch, "source/new.mjs") }),
      payload("Bash", { command: "printf x > scripts/new.mjs" }),
      payload("Bash", { command: "touch -h scripts/new.mjs" }),
      payload("Bash", { command: "touch docs/source" }),
      payload("Bash", {
        command: "touch ../scripts/new.mjs",
        workdir: join(root, "docs"),
      }),
    ];
    const admitted = [
      payload("Write", { file_path: "docs/new.json" }),
      payload("Write", { file_path: "README.md" }),
      payload("Write", { file_path: join(scratch, "new.txt") }),
      payload("Write", { file_path: "docs/scratch/new.txt" }),
      payload("Write", { file_path: "../outside-planning-scratch.txt" }),
      payload("Bash", { command: "printf x > docs/new.json" }),
      payload("Bash", { command: "touch new.txt", workdir: scratch }),
      payload("Bash", { command: "node arbitrary.mjs" }),
      payload("Bash", { command: "rm docs/source" }),
      payload("Bash", { command: "touch -h docs/source" }),
      payload("Bash", { command: "touch -mh docs/source" }),
      payload("Bash", { command: `rm ${scratch}/source` }),
      payload("Read", { file_path: "scripts/harness.mjs" }),
    ];
    for (const hook of [
      "permissions",
      "concurrent-work-requires-worktrees",
      "write-observer",
    ]) {
      for (const request of denied) {
        const result = invoke(root, hook, request).hookSpecificOutput;
        assert.equal(
          result?.permissionDecision,
          "deny",
          JSON.stringify(request),
        );
        assert.match(result.permissionDecisionReason, /operator override:/);
        const path =
          request.tool_input.file_path ?? request.tool_input.notebook_path;
        if (path) assert.ok(result.permissionDecisionReason.includes(path));
      }
      for (const request of admitted)
        assert.equal(
          allowed(invoke(root, hook, request)),
          true,
          JSON.stringify(request),
        );
    }
    invoke(
      root,
      "session",
      input(root, "UserPromptSubmit", {
        session_id: sessionId,
        prompt: "operator override: fixture recovery",
      }),
    );
    assert.equal(allowed(invoke(root, "permissions", denied[0])), true);
    invoke(
      root,
      "session",
      input(root, "UserPromptSubmit", {
        session_id: sessionId,
        prompt: "operator override: off",
      }),
    );
    assert.equal(
      invoke(root, "permissions", denied[0]).hookSpecificOutput
        ?.permissionDecision,
      "deny",
    );
    git(root, "switch", "wo-999");
    assert.equal(allowed(invoke(root, "permissions", denied[0])), true);
  } finally {
    removeFixture(root, { recursive: true });
    removeFixture(scratch, { recursive: true });
  }
});

test("WO-132 missing process-cost counters record unknown at the current dispatch cutoff", () => {
  const root = fixture();
  try {
    const startedAt = new Date().toISOString();
    const observation = measureHarnessSessionUsage(
      root,
      {
        role: "executor",
        workOrder: "WO-999",
        startedAt,
        reads: [],
        startingEventCount: 0,
      },
      "unobserved-session",
      join(root, "missing-transcript.jsonl"),
    );
    assert.equal(observation.source, "unavailable");
    assert.equal(observation.scope, "dispatch");
    assert.equal(observation.usage.totalTokens, null);
    assert.ok(Date.parse(observation.observedAt) >= Date.parse(startedAt));
    const rows = readFileSync(
      join(root, "docs/control/local/process/usage.jsonl"),
      "utf8",
    )
      .trim()
      .split("\n")
      .map(JSON.parse);
    const { subagents, ...processObservation } = observation;
    assert.deepEqual(rows.at(-1).observation, processObservation);
    assert.equal(subagents.countKind, "unknown");
    assert.equal(subagents.reason, "counter missing");
  } finally {
    removeFixture(root, { recursive: true });
  }
});

test("WO-133 stale generated hooks emit once per session/cause, retain every row and silence observers", () => {
  const root = fixture();
  try {
    const settings = JSON.parse(
      readFileSync(join(root, ".claude/settings.json"), "utf8"),
    );
    assert.deepEqual(
      settings.hooks.SessionStart,
      settings.hooks.UserPromptSubmit.map((row) => ({
        ...row,
        hooks: row.hooks.filter((hook) => !hook.command.includes("/presence-")),
      })),
    );
    assert.doesNotMatch(
      JSON.stringify(settings.hooks.SessionStart),
      /presence-/,
    );
    assert.deepEqual(invoke(root, "session", input(root, "SessionStart")), {});
    const hooks = [
      "permissions",
      "write-observer",
      "concurrent-work-requires-worktrees",
      "session",
      "read-observer",
    ];
    for (const hook of hooks) {
      const path = join(root, `.claude/hooks/${hook}.mjs`);
      writeFileSync(
        path,
        readFileSync(path, "utf8").replace(
          /"hash": "fnv1a64:[^"]+"/,
          '"hash": "fnv1a64:0000000000000000"',
        ),
      );
    }
    const journal = (session) =>
      join(
        root,
        "docs/control/local/harness",
        createHash("sha256").update(session).digest("hex") + ".jsonl",
      );
    const responses = [];
    for (let i = 0; i < 20; i++) {
      const hook = hooks[i % 3];
      responses.push(
        invoke(
          root,
          hook,
          input(root, "PreToolUse", {
            session_id: "stale",
            tool_name: "Read",
            tool_input: { file_path: "fixture.ts" },
          }),
        ),
      );
    }
    assert.equal(responses.filter((row) => row.systemMessage).length, 1);
    assert.match(
      responses[0].systemMessage,
      /pins-differ.*node scripts\/bootstrap\.mjs/,
    );
    const rows = readFileSync(journal("stale"), "utf8")
      .trim()
      .split("\n")
      .map(JSON.parse);
    assert.equal(rows.length, 20);
    assert.ok(
      rows.every((row) => row.delegated && /pins-differ/.test(row.advisory)),
    );
    for (let i = 0; i < 3; i++)
      assert.deepEqual(
        invoke(
          root,
          "read-observer",
          input(root, "PostToolUse", {
            session_id: "observer-first",
            tool_name: "Read",
            tool_input: {},
            tool_response: {},
          }),
        ),
        {},
      );
    const startup = invoke(
      root,
      "session",
      input(root, "SessionStart", { session_id: "observer-first" }),
    );
    assert.match(
      startup.systemMessage,
      /pins-differ.*node scripts\/bootstrap\.mjs/,
    );
    assert.equal(startup.systemMessage.split("\n").length, 1);
    assert.deepEqual(
      invoke(
        root,
        "session",
        input(root, "SessionStart", { session_id: "observer-first" }),
      ),
      {},
    );
    // Missing immutable snapshot uses the prelude, sharing the same marker rules.
    removeFixture(join(root, ".runtime"), { recursive: true, force: true });
    const first = invoke(
      root,
      "session",
      input(root, "SessionStart", { session_id: "missing" }),
    );
    assert.match(
      first.systemMessage,
      /snapshot-missing.*node scripts\/bootstrap\.mjs/,
    );
    assert.deepEqual(
      invoke(
        root,
        "permissions",
        input(root, "PreToolUse", {
          session_id: "missing",
          tool_name: "Read",
          tool_input: {},
        }),
      ),
      {},
    );
    assert.deepEqual(
      invoke(
        root,
        "read-observer",
        input(root, "PostToolUse", {
          session_id: "missing-observer",
          tool_response: {},
        }),
      ),
      {},
    );
    // If local observation storage is unavailable, messages remain visible.
    removeFixture(join(root, "docs/control/local/harness"), {
      recursive: true,
      force: true,
    });
    write(root, "docs/control/local/harness", "unwritable directory fixture");
    for (let i = 0; i < 2; i++)
      assert.match(
        invoke(
          root,
          "session",
          input(root, "SessionStart", { session_id: "no-store" }),
        ).systemMessage,
        /snapshot-missing/,
      );
  } finally {
    removeFixture(root, { recursive: true });
  }
});

test("WO-141 confirmed correction token counts once across both prompt hooks", () => {
  const root = fixture();
  try {
    emitHarness(root, {
      program: { ...contributorProgram(), correctionToken: "correction:" },
      feedback: compileFeedbackUnits(retainedFeedbackUnitsV1),
    });
    const payload = input(root, "UserPromptSubmit", {
      prompt: "correction: anti-oscillation",
    });
    for (let index = 0; index < 2; index++) {
      for (const name of index === 0
        ? ["fail-conservative-correction", "session"]
        : ["session", "fail-conservative-correction"])
        invoke(root, name, payload);
    }
    const sessionKey = createHash("sha256")
      .update("synthetic-session")
      .digest("hex");
    const count = correctionCounts(
      journalRows(root, { sessionKey, workOrder: null, phase: "unknown" }),
    );
    assert.equal(count.total, 2);
    assert.equal(count.byUnit["anti-oscillation"], 2);
  } finally {
    removeFixture(root, { recursive: true });
  }
});

test("WO-141 generated prompt and repeated Stop deliver facts and a single deferred hedge advisory", () => {
  const root = fixture();
  try {
    const sessionKey = createHash("sha256")
      .update("synthetic-session")
      .digest("hex");
    const scope = { sessionKey, workOrder: null, phase: "unknown" };
    const dispatchedAt = new Date(Date.now() - 1560000).toISOString();
    appendObservation(root, scope, {
      backgroundTask: {
        key: "fixture",
        dispatchedAt,
        state: "running",
        observedAt: dispatchedAt,
      },
    });
    const transcriptPath = join(root, "synthetic-session.jsonl");
    writeFileSync(
      transcriptPath,
      JSON.stringify({ sessionId: "synthetic-session", cwd: root }) +
        "\n" +
        JSON.stringify({
          type: "assistant",
          uuid: "fixture-final",
          message: {
            role: "assistant",
            content: [
              {
                type: "text",
                text: "I dispatched the background review roughly 10 minutes ago.",
              },
            ],
          },
        }) +
        "\n",
    );
    for (const stop_hook_active of [false, true, false]) {
      const response = invoke(
        root,
        "finish",
        input(root, "Stop", {
          transcript_path: transcriptPath,
          stop_hook_active,
        }),
      );
      assert.equal(response.decision, undefined);
      assert.match(response.systemMessage, /Observed facts/);
      assert.match(response.systemMessage, /task 1/);
    }
    assert.equal(
      journalRows(root, scope).filter(
        (row) => row.typedEvent === "HedgedQuantityObserved",
      ).length,
      1,
    );
    const first = invoke(
      root,
      "session",
      input(root, "UserPromptSubmit", { prompt: "Continue" }),
    );
    assert.match(
      first.hookSpecificOutput.additionalContext,
      /measurement advisory/,
    );
    const second = invoke(
      root,
      "session",
      input(root, "UserPromptSubmit", { prompt: "Continue" }),
    );
    assert.match(second.hookSpecificOutput.additionalContext, /Observed facts/);
    assert.doesNotMatch(
      second.hookSpecificOutput.additionalContext,
      /measurement advisory/,
    );
  } finally {
    removeFixture(root, { recursive: true });
  }
});
