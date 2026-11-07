import test from "node:test";
import assert from "node:assert/strict";
import {
  appendFileSync,
  cpSync,
  mkdirSync,
  readdirSync,
  writeFileSync,
  realpathSync,
  readFileSync,
} from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { planFixture } from "./lib/plan-first-fixture.mjs";
import { planDigest, planFirstRefusal } from "./lib/plan-first.mjs";
import {
  emitHarness,
  emitTargetHarness,
  runtimeModuleDirectory,
} from "./lib/harness.mjs";
import { initializeSubagentCounter } from "../packages/skeleton/dist/src/subagent-budget.js";
import { write } from "./lib/helpers.mjs";
import { TOOL_ROOT } from "./lib/config.mjs";
import { releasePlanCandidates } from "./lib/plan-first.mjs";
import { removeTemporaryPath } from "./lib/temporary-roots.mjs";
const source = TOOL_ROOT;
const cleanEnv = Object.fromEntries(
  Object.entries(process.env).filter(
    ([key]) => !/^(?:CLAUDE|CODEX|COPILOT|DOTLN_|GIT_)/.test(key),
  ),
);
function hook(root, file, tool_input, environment = {}, tool_name = "Write") {
  const response = spawnSync(process.execPath, [file], {
    cwd: root,
    encoding: "utf8",
    env: { ...cleanEnv, CLAUDE_PID: String(process.pid), ...environment },
    input: JSON.stringify({
      cwd: root,
      session_id: "plan-regression",
      hook_event_name: "PreToolUse",
      tool_name,
      tool_input,
    }),
  });
  assert.equal(response.status, 0, response.stderr);
  const result = JSON.parse(response.stdout);
  assert.doesNotMatch(
    response.stdout,
    /runtime unavailable|RUNTIME_REFUSED|snapshot-missing/,
  );
  return result;
}
const denied = (result) =>
  result.hookSpecificOutput?.permissionDecision === "deny";
function normalSetup(f) {
  appendFileSync(
    join(f.root, ".gitignore"),
    ".runtime/\nnode_modules/\n**/dist/\n",
  );
  write(
    f.root,
    "CLAUDE.md",
    "# Fixture floor\nKeep synthetic source isolated.\n",
  );
  emitHarness(f.root);
  write(
    f.root,
    "docs/control/local/harness/" + planDigest("plan-regression") + ".json",
    JSON.stringify({
      role: "executor",
      workOrder: "WO-099",
      startingEventCount: 0,
      reads: [],
    }),
  );
}
test("plan-first missing approval state permits diagnostics but refuses writes", () => {
  const f = planFixture(true);
  try {
    normalSetup(f);
    write(
      f.root,
      "docs/control/local/harness/" + planDigest("plan-regression") + ".json",
      JSON.stringify({ role: "executor", startingEventCount: 0, reads: [] }),
    );
    const call = (tool, args) =>
      hook(
        realpathSync(f.root),
        join(f.root, ".claude/hooks/permissions.mjs"),
        args,
        {},
        tool,
      );
    assert.equal(
      denied(
        call("Read", {
          file_path: join(f.context.directory, "conversation.md"),
        }),
      ),
      false,
    );
    for (const command of ["pwd", "true >/dev/null", "unknown-program"])
      assert.equal(denied(call("Bash", { command })), false, command);
    const refused = call("Write", {
      file_path: join(f.target, "hello.txt"),
      content: "Unapproved.\n",
    });
    assert.equal(denied(refused), true);
    assert.match(
      refused.hookSpecificOutput.permissionDecisionReason,
      /DOTLN_PLAN_FIRST_REFUSED/,
    );
  } finally {
    f.cleanup();
  }
});

test("plan-first required capture and paired evidence remain writable", () => {
  const f = planFixture(true);
  try {
    normalSetup(f);
    const cases = [
      ["source", join(f.target, "hello.txt")],
      ["plan", join(f.context.directory, "plan.md")],
      ["capture", join(f.root, "docs/intake/approval.txt")],
      ["launchpad-evidence", join(f.root, "docs/evidence/WO-099/decisions.md")],
    ];
    const actual = {};
    for (const [name, path] of cases) {
      const response = hook(
        realpathSync(f.root),
        join(f.root, ".claude/hooks/permissions.mjs"),
        { file_path: path, content: "synthetic\n" },
      );
      actual[name] = !denied(response);
    }
    assert.deepEqual(actual, {
      source: false,
      plan: true,
      capture: true,
      "launchpad-evidence": true,
    });
  } finally {
    f.cleanup();
  }
});
test("plan-first target-installed hook enforces the same plan wait", () => {
  const f = planFixture(true);
  try {
    for (const name of readdirSync(join(source, "packages"))) {
      const modules = runtimeModuleDirectory(join(source, "packages", name));
      if (!modules) continue;
      mkdirSync(join(f.root, "packages", name), { recursive: true });
      cpSync(
        join(source, "packages", name, "package.json"),
        join(f.root, "packages", name, "package.json"),
      );
      cpSync(
        join(source, "packages", name, modules),
        join(f.root, "packages", name, modules),
        { recursive: true },
      );
    }
    emitTargetHarness(f.target, { runtimeRoot: f.root });
    const directory = join(f.root, "docs/control/local/drives/WO-099");
    initializeSubagentCounter(directory, "plan-regression-drive");
    const context = join(directory, "context.json");
    writeFileSync(
      context,
      JSON.stringify({
        schemaVersion: 1,
        root: realpathSync(f.root),
        directory,
        session: "plan-regression-drive",
        worker: "plan-regression-phase",
        role: "executor",
        workOrder: "WO-099",
        cap: 20,
        ceiling: 80,
      }),
    );
    assert.match(planFirstRefusal(f.root, f.state()), /PLAN_FIRST_REFUSED/);
    const result = hook(
      realpathSync(f.target),
      join(f.target, ".claude/hooks/permissions.mjs"),
      {
        file_path: join(f.target, "hello.txt"),
        content: "Changed without a proposal.\n",
      },
      { DOTLN_DRIVEN_WORKER: context, DOTLN_LAUNCHPAD: realpathSync(f.root) },
    );

    const candidateResult = hook(
      realpathSync(f.target),
      join(f.target, ".claude/hooks/permissions.mjs"),
      {
        file_path: join(f.candidate.path, "hello.txt"),
        content: "Draft candidate.\n",
      },
      { DOTLN_DRIVEN_WORKER: context, DOTLN_LAUNCHPAD: realpathSync(f.root) },
    );

    assert.equal(
      denied(result),
      true,
      "installed target executor hook must reject source before a proposal or approval",
    );
    assert.equal(
      denied(candidateResult),
      false,
      "owned candidate remains writable",
    );
    const environment = {
      DOTLN_DRIVEN_WORKER: context,
      DOTLN_LAUNCHPAD: realpathSync(f.root),
    };
    const call = (file) =>
      hook(
        realpathSync(f.target),
        join(f.target, ".claude/hooks/permissions.mjs"),
        { file_path: file, content: "fixture\n" },
        environment,
      );
    const actor = [
      "--harness",
      "codex-cli",
      "--harness-version",
      "fixture",
      "--model",
      "fixture",
      "--effort",
      "max",
      "--source",
      "operator-attested",
    ];
    f.propose();
    const proposed = f.call(["plan-proposed", "WO-099", ...actor]);
    assert.equal(proposed.status, 0, proposed.stderr);
    assert.equal(denied(call(join(f.target, "hello.txt"))), true);
    for (const file of [
      join(f.context.directory, "plan.md"),
      join(f.root, "docs/evidence/WO-099/decisions.md"),
      join(f.root, "docs/intake/approval.txt"),
    ])
      assert.equal(denied(call(file)), false, file);
    write(f.root, "docs/intake/approval.txt", "Looks good, build it.");
    const approvedDiff = f.state().planFirst.diffDigest;
    appendFileSync(
      join(f.context.directory, "conversation.md"),
      `\n### 2026-11-06 — Agent, paraphrasing the terminal\n\nThe operator approved this greeting. Capture sha256:${planDigest("Looks good, build it.")}\n`,
    );
    f.propose();
    const refreshed = f.call(["plan-proposed", "WO-099", ...actor]);
    assert.equal(refreshed.status, 0, refreshed.stderr);
    assert.equal(f.state().planFirst.diffDigest, approvedDiff);
    const approved = f.call([
      "plan-approved",
      "WO-099",
      "--capture",
      "docs/intake/approval.txt",
      "--capture-hash",
      `sha256:${planDigest("Looks good, build it.")}`,
      ...actor,
    ]);
    assert.equal(approved.status, 0, approved.stderr);
    assert.equal(denied(call(join(f.target, "hello.txt"))), false);
    appendFileSync(
      join(f.context.directory, "conversation.md"),
      "\n### 2026-11-06 — Operator\nReconsider.\n",
    );
    assert.equal(denied(call(join(f.target, "hello.txt"))), true);
    const settings = JSON.parse(readFileSync(context, "utf8"));
    writeFileSync(context, JSON.stringify({ ...settings, role: "verifier" }));
    assert.equal(
      denied(call(join(f.target, "hello.txt"))),
      false,
      "verifier unaffected",
    );
  } finally {
    f.cleanup();
  }
});

test("plan-first proposed candidate survives an ordinary turn end", async () => {
  const { existsSync } = await import("node:fs");
  const { pruneCompletedHarnessSession } =
    await import("../packages/skeleton/dist/src/harness-host.js");
  const f = planFixture();
  try {
    const session = "plan-regression-turn";
    const env = {
      ...cleanEnv,
      CODEX_THREAD_ID: session,
      DOTLN_LAUNCHPAD: f.root,
      TMPDIR: f.base,
    };
    const create = spawnSync(
      process.execPath,
      [join(source, "scripts/plan-first.mjs"), "draft", "WO-099", "--new"],
      { cwd: f.root, encoding: "utf8", env },
    );
    assert.equal(create.status, 0, create.stderr);
    const candidate = JSON.parse(create.stdout);
    writeFileSync(join(candidate.path, "hello.txt"), "Draft to retain.\n");
    f.append({
      type: "PlanProposed",
      ...f.propose(),
      actor: {
        harness: "codex-cli",
        harnessVersion: "fixture",
        model: "fixture",
        effort: "max",
        source: "operator-attested",
      },
    });
    write(
      f.root,
      "docs/control/local/harness/" + planDigest(session) + ".json",
      JSON.stringify({
        role: "executor",
        workOrder: "WO-099",
        expectedEvent: "ImplementationReady",
        startingEventCount: 0,
        reads: [],
      }),
    );
    assert.equal(existsSync(candidate.path), true);
    const prune = pruneCompletedHarnessSession(f.root, session, {
      dispatchEnded: false,
    });
    const retained = existsSync(candidate.path);
    const recreate = spawnSync(
      process.execPath,
      [join(source, "scripts/plan-first.mjs"), "draft", "WO-099", "--new"],
      { cwd: f.root, encoding: "utf8", env },
    );

    assert.equal(
      retained,
      true,
      "proposal candidate must survive the required operator wait",
    );
    assert.equal(recreate.status, 0, recreate.stderr);
    const renewed = JSON.parse(recreate.stdout);
    removeTemporaryPath(renewed.scratch, { recursive: true, force: true });
    const recovery = spawnSync(
      process.execPath,
      [join(source, "scripts/plan-first.mjs"), "draft", "WO-099", "--new"],
      { cwd: f.root, encoding: "utf8", env },
    );
    assert.equal(recovery.status, 0, recovery.stderr);
    const recovered = JSON.parse(recovery.stdout);
    assert.ok(
      releasePlanCandidates(f.root, f.state()).includes(recovered.scratch),
    );
    pruneCompletedHarnessSession(f.root, session, { dispatchEnded: true });
    assert.equal(
      existsSync(recovered.path),
      false,
      "completed order releases candidate retention",
    );
  } finally {
    f.cleanup();
  }
});
