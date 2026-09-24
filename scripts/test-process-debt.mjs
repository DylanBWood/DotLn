import "./test-codex-session.mjs";
import test from "node:test";
import { fnv1a64 } from "../packages/compiler/dist/src/index.js";
import {
  currentHarnessSessionReport,
  harnessRuntimeCause,
  refreshHarnessRuntime,
  reportHarnessRuntime,
} from "./lib/harness-runtime.mjs";
import assert from "node:assert/strict";
import { execFileSync, spawn } from "node:child_process";
import { observedSpawnSync as spawnSync } from "../packages/skeleton/src/gate-deadlines.mjs";
import { createHash } from "node:crypto";
import {
  copyFileSync,
  cpSync,
  chmodSync,
  existsSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  realpathSync,
  rmSync,
  symlinkSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import {
  activeGateRuns,
  beginGateRun,
  gateTreeHash,
  gateCodeIdentity,
  findGateCheck,
  readGateChecks,
  recordGateChecks,
  requireGateChecks,
  gateCacheRows,
} from "./lib/gate-evidence.mjs";
import {
  reconcileIntake,
  reconcileWorktreeMaterial,
  renderIntakeReconciliation,
  verifyPreservedMaterial,
} from "./lib/intake-reconciliation.mjs";
import {
  classifyIgnoredMaterial,
  describeIgnoredMaterial,
  inspectNestedRepository,
} from "./lib/paths.mjs";
import {
  budgetVerdict,
  measureColdStarts,
  readBudgets,
  requireBudgets,
} from "./lib/process-budget.mjs";
import {
  collectMeta,
  reconcileCost,
  renderMeta,
  renderMetaTable,
  codeDiffBytes,
  readDecisions,
  writeDecisionsIndex,
  inheritedLedgerDuty,
  trapRows,
} from "./lib/meta.mjs";
import { requireLifecycleEvidence } from "./lib/lifecycle-evidence.mjs";
import { installBeaconFixture } from "./test-beacon-fixture.mjs";
import { prepareHarnessEvidence } from "./lib/evidence-preparation.mjs";
import { main as workOrders } from "./work-orders.mjs";
import { probeHarness, discoverHarness } from "./discover.mjs";
import {
  collectSessionUsage,
  currentCopilotSession,
  renderCopilotSession,
  requireMeasuredUsage,
  recordUsageObservation,
  usageObservation,
  usageSessionKey,
  usageRecordIdentity,
} from "../packages/skeleton/src/usage-observation.mjs";
import {
  harnessInstallation,
  emitHarness,
  checkHarness,
} from "./lib/harness.mjs";
import {
  beginHarnessSession,
  measureHarnessUsage,
  harnessOutputObligations,
  dispatchAdmissionPolicy,
  evaluateHarnessHook,
  harnessWriterView,
  releaseHarnessWriter,
  seedHarnessWriter,
  permissionEffect,
  observeHarnessDelivery,
  readHarnessOutput,
  runHarnessEvidence,
  observeSessionHarnessVersion,
} from "../packages/skeleton/dist/src/harness-host.js";
import { feedbackBoundary } from "../packages/skeleton/dist/src/feedback-boundary.js";
import {
  compileFeedbackUnits,
  hasAiAttribution,
} from "../packages/compiler/dist/src/feedback.js";
import {
  invocationEffects,
  shellInvocations,
  shellWritePaths,
  commitMessageInputs,
} from "../packages/skeleton/dist/src/harness-command.js";
import { atomicBuild, publishBuildTree } from "./build.mjs";
import { bootstrapWorktree } from "./bootstrap.mjs";
import {
  FOLLOWUPS,
  collectFollowupSources,
  syncFollowups,
  readFollowups,
  planningFollowups,
  disposeFollowup,
  followupStatus,
  requirePlanningHandoffs,
} from "./lib/planning-followups.mjs";
import {
  applyAdjacentCommand,
  readAdjacentQueue,
} from "./lib/adjacent-queue.mjs";
import { main as planMain } from "./refute-plan.mjs";
import {
  appendObservation,
  observeTypedCorrection,
  scanMessage,
} from "../packages/skeleton/dist/src/observed-facts.js";
const source = resolve(import.meta.dirname, "..");

test("WO-141 meter counts journal events under their original order and phase", async (t) => {
  const root = repo(t);
  const key = createHash("sha256").update("correction-fixture").digest("hex");
  const scope = {
    sessionKey: key,
    workOrder: "WO-999",
    phase: "implementation",
  };
  // Mutable current state has moved on; immutable event attribution wins.
  write(
    root,
    `docs/control/local/harness/${key}.json`,
    json({ workOrder: "WO-998" }),
  );
  observeTypedCorrection(root, scope, "correction: anti-oscillation");
  observeTypedCorrection(
    root,
    { ...scope, phase: "verification" },
    "correction: accuracy over sycophancy",
  );
  scanMessage(
    root,
    scope,
    "roughly 10 minutes ago",
    "final",
    "2026-09-17T14:32:00.000Z",
  );
  appendObservation(
    root,
    { ...scope, workOrder: "WO-998" },
    { typedEvent: "OperatorCorrectionReceived", eventId: "correction:other" },
  );
  const meta = await collectMeta(root);
  const order = meta.orders.find((row) => row.workOrder === "WO-999");
  assert.equal(order.metrics.operatorCorrections, 3);
  assert.deepEqual(order.corrections.byPhase, {
    implementation: 2,
    verification: 1,
  });
  const trap = meta.traps.find(
    (row) => row.id === "shifting-the-burden-to-the-intervenor",
  );
  assert.equal(
    trap.corrections.find((row) => row.workOrder === "WO-999").byUnit[
      "anti-oscillation"
    ],
    1,
  );
});
test("WO-141 meter retains only journal-derived historical correction counts", async (t) => {
  const root = repo(t);
  const workOrder = "WO-999";
  const corrections = {
    total: 3,
    byPhase: { implementation: 2, verification: 1 },
    byUnit: { "anti-oscillation": 1, unnamed: 2 },
    byPhaseAndUnit: {
      implementation: { "anti-oscillation": 1, unnamed: 1 },
      verification: { unnamed: 1 },
    },
    source: "session-journal",
  };
  write(
    root,
    `docs/evidence/${workOrder}/meta.json`,
    json({
      orders: [{ workOrder, metrics: { operatorCorrections: 3 }, corrections }],
    }),
  );
  const retained = (await collectMeta(root)).orders.find(
    (row) => row.workOrder === workOrder,
  );
  assert.equal(retained.metrics.operatorCorrections, 3);
  assert.deepEqual(retained.corrections, corrections);
  write(
    root,
    `docs/evidence/${workOrder}/meta.json`,
    json({
      orders: [{ workOrder, metrics: { operatorCorrections: 9 } }],
    }),
  );
  const legacy = (await collectMeta(root)).orders.find(
    (row) => row.workOrder === workOrder,
  );
  assert.equal(legacy.metrics.operatorCorrections, 0);
});
const json = (value) => JSON.stringify(value, null, 2) + "\n";
const write = (root, path, value) => {
  mkdirSync(dirname(join(root, path)), { recursive: true });
  writeFileSync(join(root, path), value);
};
const git = (root, ...args) =>
  execFileSync("git", args, {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();
const snapshot = (root) => {
  const result = {};
  const walk = (base = "") => {
    for (const name of readdirSync(join(root, base), { withFileTypes: true })) {
      if (name.name === ".git") continue;
      const path = join(base, name.name);
      if (name.isDirectory()) walk(path);
      else if (name.isFile())
        result[path] = createHash("sha256")
          .update(readFileSync(join(root, path)))
          .digest("hex");
    }
  };
  walk();
  return result;
};
const writableOwnedTree = (path) => {
  const info = lstatSync(path);
  if (info.isSymbolicLink()) return;
  chmodSync(path, (info.mode & 0o777) | (info.isDirectory() ? 0o700 : 0o200));
  if (info.isDirectory())
    for (const entry of readdirSync(path)) writableOwnedTree(join(path, entry));
};
function repo(t, { runtime = false } = {}) {
  const root = realpathSync(mkdtempSync(join(tmpdir(), "dotln-debt-")));
  t.after(() => {
    // Snapshot copies can retain read-only mount modes. Restore only this
    // fixture's owned entries, without following links back to installed roots.
    writableOwnedTree(root);
    // Git's default background maintenance can spawn a detached `gc` that
    // recreates .git/info/refs and .git/objects/info/packs after rimraf has
    // already walked those directories, throwing ENOTEMPTY on a race the fixture
    // does not own. Bounded retries let the owned removal converge once the
    // collection finishes, so the suite result stays decided by its assertions
    // rather than by whether a gc lands mid-teardown. Git's default background
    // maintenance is left in force; only the removal tolerates its residue.
    rmSync(root, {
      recursive: true,
      force: true,
      maxRetries: 10,
      retryDelay: 100,
    });
  });
  git(root, "init", "-q", "-b", "wo-999");
  assert.equal(realpathSync(git(root, "rev-parse", "--show-toplevel")), root);
  git(root, "config", "user.name", "Fixture");
  git(root, "config", "user.email", "fixture@example.invalid");
  write(
    root,
    ".gitignore",
    "node_modules/\n.runtime/\n**/dist/\ndocs/control/local/\ndocs/intake/\n",
  );
  write(root, "CLAUDE.md", "# Fixture floor\nPersonal source only.\n");
  write(
    root,
    "package.json",
    json({
      type: "module",
      scripts: { test: "node -e ''" },
    }),
  );
  write(root, "own.txt", "original\n");
  write(
    root,
    "scripts/resume.mjs",
    'console.log(JSON.stringify({workOrder:"WO-999",workOrderPath:"docs/work-orders/WO-999-fixture.md",phase:"active"}));\n',
  );
  write(
    root,
    "docs/control/orders/WO-999.jsonl",
    JSON.stringify({
      schemaVersion: 1,
      type: "WorkOrderActivated",
      workOrderId: "WO-999",
      workOrderPath: "docs/work-orders/WO-999-fixture.md",
      recordedAt: "2026-09-09T00:00:00.000Z",
    }) + "\n",
  );
  if (runtime) {
    mkdirSync(join(root, "node_modules/@dotln"), { recursive: true });
    for (const name of ["compiler", "kernel", "skeleton"]) {
      cpSync(
        join(source, `packages/${name}/dist`),
        join(root, `packages/${name}/dist`),
        { recursive: true, dereference: true },
      );
      // A replica mounts its installed runtime read-only. This fixture owns a
      // writable copy so its publication and deliberate-damage checks stay local.
      writableOwnedTree(join(root, `packages/${name}/dist`));
      cpSync(
        join(source, `packages/${name}/package.json`),
        join(root, `packages/${name}/package.json`),
      );
      symlinkSync(
        `../../packages/${name}`,
        join(root, `node_modules/@dotln/${name}`),
      );
    }
    symlinkSync(
      join(source, "node_modules/typescript"),
      join(root, "node_modules/typescript"),
    );
  }
  git(root, "add", ".");
  git(root, "commit", "-qm", "Fixture base");
  return root;
}

test("WO-146 Copilot readback selects the parent, follows changes, and preserves honest unknowns", (t) => {
  const root = repo(t);
  const env = {
    COPILOT_HOME: join(root, "copilot"),
    COPILOT_AGENT_SESSION_ID: "parent",
  };
  const path = "copilot/session-state/parent/events.jsonl";
  const start = {
    type: "session.start",
    timestamp: "2030-01-01T00:00:00.000Z",
    data: {
      sessionId: "parent",
      copilotVersion: "1.0.86",
      context: { cwd: root, gitRoot: root },
    },
  };
  const change = (
    newModel,
    reasoningEffort,
    timestamp = "2030-01-01T00:00:01.000Z",
  ) => ({
    type: "session.model_change",
    timestamp,
    data: { newModel, reasoningEffort, source: "model_picker" },
  });
  const save = (rows) =>
    write(root, path, rows.map(JSON.stringify).join("\n") + "\n");
  save([start, change("claude-sonnet-5", "high")]);
  write(
    root,
    "copilot/session-state/child/events.jsonl",
    [
      { ...start, data: { ...start.data, sessionId: "child" } },
      change("child-model", "low"),
    ]
      .map(JSON.stringify)
      .join("\n") + "\n",
  );
  const options = { env };
  let result = currentCopilotSession(root, options);
  assert.equal(result.model, "claude-sonnet-5");
  assert.equal(result.effort, "high");
  assert.equal(result.harness, "copilot-cli");
  assert.equal(result.source, "copilot-session-readback");
  assert.equal(result.harnessVersion, "1.0.86");
  save([
    start,
    change("claude-sonnet-5", "high"),
    change("gpt-6-astra", "xhigh", "2030-01-01T00:00:02.000Z"),
  ]);
  result = currentCopilotSession(root, options);
  assert.equal(result.model, "gpt-6-astra");
  assert.equal(result.effort, "xhigh");
  assert.doesNotMatch(
    JSON.stringify(result),
    /parent|child-model|sessionId|cwd|gitRoot/,
  );
  save([start, change("auto", null)]);
  result = currentCopilotSession(root, options);
  assert.equal(result.model, null);
  assert.equal(result.effort, null);
  assert.deepEqual(result.causes, [
    "model-auto-unresolved",
    "effort-unreported",
  ]);
  assert.match(renderCopilotSession(result), /unknown.*not effective effort/);
  assert.equal(
    currentCopilotSession(root, { env: {} }).causes[0],
    "session-unidentified",
  );
  assert.equal(
    currentCopilotSession(root, { env, sessionId: "missing" }).causes[0],
    "session-log-missing",
  );
  assert.equal(
    currentCopilotSession(root, { env, sessionId: "../parent" }).available,
    false,
  );
  save([
    { ...start, data: { ...start.data, context: { cwd: dirname(root) } } },
  ]);
  assert.equal(currentCopilotSession(root, options).available, false);
  save([
    {
      ...start,
      data: { ...start.data, context: { cwd: root, gitRoot: dirname(root) } },
    },
  ]);
  assert.equal(currentCopilotSession(root, options).available, false);
  write(root, path, "corrupt fixture\n");
  assert.equal(currentCopilotSession(root, options).available, false);
});

test("WO-146 Copilot counters deduplicate requests and do not turn checkpoints into token usage", () => {
  const row = {
    type: "model.model_call_success",
    timestamp: "2030-01-01T00:00:01.000Z",
    data: {
      callId: "one",
      responseUsage: {
        prompt_tokens: 10,
        completion_tokens: 3,
        total_tokens: 13,
        prompt_tokens_details: { cached_tokens: 2, cache_creation_tokens: 0 },
        completion_tokens_details: { reasoning_tokens: 1 },
      },
      responseChunk: { usage: { prompt_tokens: 99999 } },
      copilotUsage: { total_nano_aiu: 99999 },
    },
  };
  const observed = usageObservation([
    row,
    row,
    {
      type: "tool.execution_start",
      data: { toolCallId: "tool", toolName: "bash" },
    },
  ]);
  assert.equal(observed.source, "copilot-transcript-request-usage");
  assert.equal(observed.scope, "observed-requests-only");
  assert.match(observed.coverage, /not a session total/);
  assert.equal(observed.usage.totalTokens, 13);
  assert.equal(observed.usage.cachedInputTokens, 2);
  assert.equal(observed.usage.costUsd, null);
  assert.equal(observed.activity.commandsRun, 1);
  assert.equal(requireMeasuredUsage(observed).usage.totalTokens, 13);
  assert.equal(
    usageObservation([
      {
        type: "session.usage_checkpoint",
        data: { totalNanoAiu: 99999 },
      },
    ]).source,
    "unavailable",
  );
  const shutdown = usageObservation(
    [
      {
        type: "session.shutdown",
        timestamp: "2030-01-01T00:00:04.000Z",
        data: {
          totalNanoAiu: 99999,
          tokenDetails: {
            input: { tokenCount: 10 },
            cache_read: { tokenCount: 2 },
            cache_write: { tokenCount: 1 },
            output: { tokenCount: 3 },
          },
        },
      },
    ],
    { since: "2030-01-01T00:00:02.000Z" },
  );
  assert.equal(shutdown.scope, "session-cumulative");
  assert.equal(shutdown.usage.totalTokens, 16);
  assert.equal(shutdown.usage.costUsd, null);
  const credits = usageObservation(
    [
      {
        type: "session.usage_checkpoint",
        timestamp: "2030-01-01T00:00:02.000Z",
        data: { totalNanoAiu: 4_971_480_870_000 },
      },
    ],
    { since: "2030-01-01T00:00:01.000Z" },
  );
  assert.equal(credits.aiCredits, 4971.48087);
  assert.equal(credits.creditScope, "session-cumulative");
  assert.equal(credits.creditSource, "copilot-session.usage_checkpoint");
  assert.equal(credits.usage.totalTokens, null);
  assert.equal(credits.usage.costUsd, null);
  assert.equal(
    usageObservation([
      {
        type: "session.shutdown",
        timestamp: "2030-01-01T00:00:03.000Z",
        data: { totalNanoAiu: -1 },
      },
    ]).aiCredits,
    null,
  );
});

test("WO-146 credit-only and incomplete-token logs remain recordable without inventing tokens", (t) => {
  const root = repo(t);
  const env = {
    COPILOT_HOME: join(root, "copilot"),
    COPILOT_AGENT_SESSION_ID: "credits",
  };
  const start = {
    type: "session.start",
    timestamp: "2030-01-01T00:00:00.000Z",
    data: { sessionId: "credits", context: { cwd: root, gitRoot: root } },
  };
  for (const tokenDetails of [undefined, {}, { input: { tokenCount: 2 } }]) {
    write(
      root,
      "copilot/session-state/credits/events.jsonl",
      [
        start,
        {
          type: "session.shutdown",
          timestamp: "2030-01-01T00:00:01.000Z",
          data: {
            totalNanoAiu: 1_000_000_000,
            ...(tokenDetails ? { tokenDetails } : {}),
          },
        },
      ]
        .map(JSON.stringify)
        .join("\n") + "\n",
    );
    const observation = collectSessionUsage(root, { env });
    assert.doesNotThrow(() =>
      recordUsageObservation(root, {
        workOrder: "WO-146",
        role: "executor",
        observation,
      }),
    );
    assert.equal(observation.aiCredits, 1);
    assert.equal(observation.creditSource, "copilot-session.shutdown");
    assert.equal(observation.creditObservedAt, "2030-01-01T00:00:01.000Z");
    assert.equal(observation.creditScope, "session-cumulative");
    assert.equal(observation.source, "unavailable");
    assert.equal(observation.cause, "session-token-counters-unavailable");
    assert.equal(observation.usage.totalTokens, null);
    assert.equal(observation.usage.costUsd, null);
  }
});

test("WO-146 discovery admits the Copilot executable without declaring effective effort", (t) => {
  const root = repo(t);
  const commands = [];
  const observed = probeHarness(
    "copilot-cli",
    (command, args) => {
      commands.push([command, ...args]);
      return {
        status: 0,
        stdout:
          args[0] === "--version"
            ? "GitHub Copilot CLI 1.0.86"
            : "--model --allow-all",
      };
    },
    {},
  );
  assert.deepEqual(commands, [
    ["copilot", "--version"],
    ["copilot", "--help"],
  ]);
  assert.equal(observed.probe.readbackChannelPresent, false);
  write(
    root,
    "docs/discovery/environment.json",
    json({
      effortReadbackProbe: { harnesses: { "copilot-cli": { versions: [] } } },
    }),
  );
  const result = discoverHarness(root, "copilot-cli", () => observed);
  assert.equal(result.harness, "copilot-cli");
  const stored = JSON.parse(
    readFileSync(join(root, "docs/discovery/environment.json"), "utf8"),
  ).effortReadbackProbe.harnesses["copilot-cli"];
  assert.equal(stored.versionLines[0].line, "1.0");
  assert.equal(stored.effectiveEffortReadback, undefined);
});

test("WO-146 Copilot briefing warns outside its observed version line without refusing readback", async (t) => {
  const root = repo(t);
  const keys = ["COPILOT_HOME", "COPILOT_AGENT_SESSION_ID", "CODEX_THREAD_ID"];
  const prior = Object.fromEntries(keys.map((key) => [key, process.env[key]]));
  t.after(() => {
    for (const key of keys) {
      if (prior[key] === undefined) delete process.env[key];
      else process.env[key] = prior[key];
    }
  });
  process.env.COPILOT_HOME = join(root, "copilot");
  process.env.COPILOT_AGENT_SESSION_ID = "parent";
  delete process.env.CODEX_THREAD_ID;
  write(
    root,
    "docs/discovery/environment.json",
    json({
      effortReadbackProbe: {
        harnesses: {
          "copilot-cli": {
            versionLines: [{ line: "1.0", classification: "observed" }],
          },
        },
      },
    }),
  );
  for (const copilotVersion of ["1.0.86", "2.0.0"]) {
    write(
      root,
      "copilot/session-state/parent/events.jsonl",
      [
        {
          type: "session.start",
          timestamp: "2030-01-01T00:00:00.000Z",
          data: { sessionId: "parent", copilotVersion, context: { cwd: root } },
        },
        {
          type: "session.model_change",
          timestamp: "2030-01-01T00:00:01.000Z",
          data: { newModel: "gpt-6-astra", reasoningEffort: "xhigh" },
        },
      ]
        .map(JSON.stringify)
        .join("\n") + "\n",
    );
    const report = await currentHarnessSessionReport(root);
    assert.equal(report.session.available, true);
    assert.equal(report.session.harnessVersion, copilotVersion);
    if (copilotVersion === "2.0.0")
      assert.match(report.text, /leaves observed lines 1\.0/);
    else assert.doesNotMatch(report.text, /leaves observed lines/);
  }
});

test("WO-146 planning actors admit Copilot independently of a Claude or GPT model", async (t) => {
  const { readOverrides } = await import("./lib/plan-receipts.mjs");
  const root = repo(t);
  const event = {
    schemaVersion: 1,
    type: "PlanHoldOverridden",
    recordedAt: "2030-01-02T00:00:00.000Z",
    receiptId: "2030-01-02-planning-fixture-001",
    receiptHash: `sha256:${"0".repeat(64)}`,
    holdId: `hold-${"1".repeat(24)}`,
    reason: "Synthetic operator authorization",
    captureHash: `sha256:${"2".repeat(64)}`,
    actor: {
      harness: "copilot-cli",
      harnessVersion: "1.0.86",
      model: "claude-sonnet-5",
      effort: "xhigh",
      source: "operator-attested",
    },
  };
  for (const model of ["claude-sonnet-5", "gpt-6-astra"]) {
    event.actor.model = model;
    write(
      root,
      "docs/control/plan-refutations.jsonl",
      JSON.stringify(event) + "\n",
    );
    assert.equal(readOverrides(root)[0].actor.harness, "copilot-cli");
  }
  event.actor.harness = "not-a-harness";
  write(
    root,
    "docs/control/plan-refutations.jsonl",
    JSON.stringify(event) + "\n",
  );
  assert.throws(() => readOverrides(root), /invalid override actor/);
});

test("WO-146 two actual completions retain Copilot, their different models and operator attestations", (t) => {
  for (const model of ["claude-sonnet-5", "gpt-6-astra"]) {
    const root = repo(t, { runtime: true });
    cpSync(
      join(source, "scripts/harness.mjs"),
      join(root, "scripts/harness.mjs"),
    );
    cpSync(
      join(source, "scripts/resume.mjs"),
      join(root, "scripts/resume.mjs"),
    );
    cpSync(join(source, "scripts/lib"), join(root, "scripts/lib"), {
      recursive: true,
    });
    for (const name of ["compiler", "kernel", "skeleton"])
      cpSync(
        join(source, `packages/${name}/src`),
        join(root, `packages/${name}/src`),
        { recursive: true },
      );
    write(
      root,
      "docs/work-orders/WO-999-fixture.md",
      "# WO-999 fixture\n\n**Model:** any capable model.\n**Effort:** executor any; verifier any; reviewer any.\n",
    );
    const env = {
      ...process.env,
      CODEX_THREAD_ID: "",
      COPILOT_AGENT_SESSION_ID: "fixture-session",
      COPILOT_HOME: join(root, "copilot"),
    };
    seedHarnessWriter(root, {
      actorId: usageSessionKey("fixture-session"),
      worktree: root,
      owner: { pid: process.pid, source: "parent" },
      reservedAt: new Date().toISOString(),
    });
    const run = (...args) =>
      spawnSync(process.execPath, ["scripts/resume.mjs", ...args], {
        cwd: root,
        encoding: "utf8",
        env,
        timeout: 30_000,
      });
    const adapter = (...args) =>
      spawnSync(process.execPath, ["scripts/harness.mjs", ...args], {
        cwd: root,
        encoding: "utf8",
        env,
        timeout: 30_000,
      });
    const empty = adapter("usage", "fixture-session");
    assert.equal(empty.status, 0, empty.stderr);
    assert.equal(JSON.parse(empty.stdout).cause, "active-dispatch-unavailable");
    const begun = adapter("begin", "fixture-session", "executor");
    assert.equal(begun.status, 0, begun.stderr);
    const timestamp = new Date().toISOString();
    write(
      root,
      "copilot/session-state/fixture-session/events.jsonl",
      [
        {
          type: "session.start",
          timestamp,
          data: {
            sessionId: "fixture-session",
            copilotVersion: "1.0.86",
            context: { cwd: root, gitRoot: root },
          },
        },
        {
          type: "session.model_change",
          timestamp,
          data: { newModel: model, reasoningEffort: "high" },
        },
        {
          type: "model.model_call_success",
          timestamp,
          data: {
            callId: "request",
            responseUsage: {
              prompt_tokens: 10,
              completion_tokens: 3,
              total_tokens: 13,
            },
          },
        },
      ]
        .map(JSON.stringify)
        .join("\n") + "\n",
    );
    const measured = adapter("usage", "fixture-session");
    assert.equal(measured.status, 0, measured.stderr);
    assert.equal(JSON.parse(measured.stdout).usage.totalTokens, 13);
    const explicit = spawnSync(
      process.execPath,
      ["scripts/harness.mjs", "usage", "fixture-session"],
      {
        cwd: root,
        encoding: "utf8",
        env: { ...env, COPILOT_AGENT_SESSION_ID: "" },
      },
    );
    assert.equal(explicit.status, 0, explicit.stderr);
    assert.equal(JSON.parse(explicit.stdout).usage.totalTokens, 13);
    assert.equal(
      JSON.parse(explicit.stdout).currentSession.source,
      "copilot-session-readback",
    );
    const completed = run(
      "implementation-ready",
      "--harness",
      "copilot-cli",
      "--harness-version",
      "1.0.86",
      "--model",
      model,
      "--effort",
      "xhigh",
      "--source",
      "operator-attested",
    );
    assert.equal(completed.status, 0, completed.stderr);
    assert.equal(harnessWriterView(root).reserved, false);
    const event = readFileSync(
      join(root, "docs/control/orders/WO-999.jsonl"),
      "utf8",
    )
      .trim()
      .split("\n")
      .map(JSON.parse)
      .at(-1);
    assert.equal(event.actor.harness, "copilot-cli");
    assert.equal(event.actor.model, model);
    assert.equal(
      event.actor.effort,
      "xhigh",
      "selected high does not overwrite supplied xhigh",
    );
    assert.equal(event.actor.source, "operator-attested");
    const status = run("status");
    assert.equal(status.status, 0, status.stderr);
    assert.match(status.stdout, /harness copilot-cli/);
    assert.ok(status.stdout.includes(model));
  }
});

const input = (root, event, session = "fixture", extra = {}) => ({
  cwd: root,
  hook_event_name: event,
  session_id: session,
  ...extra,
});
const config = (root, name) =>
  JSON.parse(
    readFileSync(join(root, `.claude/hooks/${name}.mjs`), "utf8").match(
      /await runHarnessHook\(([\s\S]*), feedbackBoundary(?:, input(?:, rawInput)?)?\);/,
    )[1],
  );
const statePath = (root, session = "fixture") =>
  join(
    root,
    `docs/control/local/harness/${createHash("sha256").update(session).digest("hex")}.json`,
  );
const advisoryRows = (root, session = "fixture") => {
  const path = statePath(root, session).replace(/\.json$/, ".jsonl");
  return existsSync(path)
    ? readFileSync(path, "utf8")
        .trim()
        .split("\n")
        .map(JSON.parse)
        .filter((row) => row.delegated)
    : [];
};

test("WO-132 VER-002 F1 / VER-003 F1 output redirects distinguish append filenames from descriptor operands", () => {
  const dist = "packages/skeleton/dist/src/harness-command.js";
  for (const [command, paths] of [
    [`ls scripts >&${dist}`, [dist]],
    [`ls scripts 1>&${dist}`, [dist]],
    [`ls scripts >>&${dist}`, [dist]],
    [`head -5 fixture.ts >& ${dist}`, [dist]],
    ["grep value fixture.ts >&./node_modules/y", ["./node_modules/y"]],
    [`ls scripts &>${dist}`, [dist]],
    ["ls scripts > fixture.ts 2>&1", ["fixture.ts"]],
    ["ls scripts 2>&-", []],
    ["ls scripts >&-", []],
    ["ls scripts 2>& 1", []],
    ["grep -n value fixture.ts 2>&1 | head -3", []],
    // zsh's append operator always opens a file, including numeric/dash names.
    ["echo marker >>&1", ["1"]],
    ["echo marker >>&-", ["-"]],
    ["echo marker >>& 1", ["1"]],
    ["echo marker >>& -", ["-"]],
    ["echo marker 1>>&1", ["1"]],
    ["ls scripts >>&1", ["1"]],
    ["head -1 fixture.ts >>&-", ["-"]],
  ])
    assert.deepEqual(shellWritePaths(command), paths, command);
  // Input duplication, a missing operand and expanded operands stay opaque.
  for (const command of [
    "ls scripts <&fixture.ts",
    "ls scripts >&",
    "ls scripts >&$TARGET",
    "ls scripts >&*.js",
    "ls scripts >>&",
    "ls scripts >>&$TARGET",
    "ls scripts >>&*.js",
  ])
    assert.equal(shellWritePaths(command), null, command);
});

test("WO-132 VER-004 F1 shell-special redirect operands stay opaque", () => {
  const dist = "packages/skeleton/dist/src/harness-command.js";
  for (const command of [
    `ls scripts >!${dist}`,
    `ls scripts 1>!${dist}`,
    `ls scripts >>!${dist}`,
    `ls scripts >&!${dist}`,
    `ls scripts >>&!${dist}`,
    `ls scripts &>!${dist}`,
    `ls scripts &>>!${dist}`,
    `head -1 fixture.ts >!/fixture/${dist}`,
    "grep value fixture.ts >!./node_modules/y",
    `echo x >!${dist}`,
  ])
    assert.equal(shellWritePaths(command), null, command);

  // Both operand branches must reject the class, including a separate word.
  // '=' can expand a command path in zsh; neither glyph is a literal prefix
  // that this shell-independent adapter can safely send to gateInputPath.
  for (const operator of [">", ">>", ">&", ">>&", "&>", "&>>"])
    for (const descriptor of ["", "1", "2"])
      for (const spacing of ["", " "])
        for (const prefix of ["!", "="])
          for (const path of [dist, "/fixture/" + dist, "./node_modules/y"]) {
            const command = `echo x ${descriptor}${operator}${spacing}${prefix}${path}`;
            assert.equal(shellWritePaths(command), null, command);
          }

  // Ordinary path prefixes and literal punctuation later in a path retain
  // their destinations. In particular, VER-003's dash append file stays a file.
  for (const path of [
    "scratch",
    "1",
    ".scratch",
    "_scratch",
    "/tmp/scratch",
    "./!scratch",
    "./=scratch",
    "-",
  ])
    for (const operator of [">", ">>", ">>&", "&>", "&>>"])
      assert.deepEqual(shellWritePaths(`echo x ${operator} ${path}`), [path]);
});

test("WO-132 spawn and classification advisories delegate to host permissions while live-gate writes remain denied", (t) => {
  const root = repo(t);
  emitHarness(root);
  const invoke = (extra) => {
    const run = spawnSync(process.execPath, [".claude/hooks/permissions.mjs"], {
      cwd: root,
      encoding: "utf8",
      input: JSON.stringify(input(root, "PreToolUse", `${root}:spawn`, extra)),
    });
    assert.equal(run.status, 0, run.stderr);
    const response = JSON.parse(run.stdout);
    return {
      ...response.hookSpecificOutput,
      systemMessage: response.systemMessage,
    };
  };
  const agent = {
    description: "Read-only survey",
    prompt: "Summarize the orders",
    subagent_type: "Explore",
  };
  const missingCounter = invoke({ tool_name: "Agent", tool_input: agent });
  assert.equal(missingCounter.permissionDecision, undefined);
  assert.match(missingCounter.systemMessage, /subagent.*counter missing/);
  const repeatedBudget = invoke({
    tool_name: "Task",
    tool_input: { ...agent, isolation: "worktree" },
  });
  assert.equal(repeatedBudget.permissionDecision, undefined);
  assert.equal(repeatedBudget.systemMessage, undefined);
  assert.match(
    advisoryRows(root, `${root}:spawn`).at(-1).advisory,
    /subagent.*counter missing/,
  );
  const remote = invoke({
    tool_name: "Agent",
    tool_input: { ...agent, isolation: "remote" },
  });
  assert.equal(remote.permissionDecision, undefined);
  assert.match(remote.systemMessage, /Remote subagents/);
  assert.doesNotMatch(remote.systemMessage, /host facts/);
  const unknown = invoke({
    tool_name: "SomeNewTool",
    tool_input: { anything: true },
  });
  assert.equal(unknown.permissionDecision, undefined);
  assert.equal(
    unknown.systemMessage,
    "DotLn advisory: command classification: Unclassified effectful tool: SomeNewTool; host permissions decide.",
  );
  assert.equal(
    invoke({ tool_name: "SomeNewTool", tool_input: { anything: true } })
      .systemMessage,
    undefined,
  );
  assert.match(
    advisoryRows(root, `${root}:spawn`).at(-1).advisory,
    /Unclassified effectful tool: SomeNewTool/,
  );
  // A spawn during a live gate is admitted too: the subagent's own writes
  // are refused one by one while the gate holds its inputs.
  const active = beginGateRun(root, "npm test");
  try {
    assert.notEqual(
      invoke({ tool_name: "Agent", tool_input: agent }).permissionDecision,
      "deny",
    );
    const refused = invoke({
      tool_name: "Write",
      tool_input: { file_path: join(root, "package.json"), content: "{}" },
    });
    assert.equal(refused.permissionDecision, "deny");
    // WO-044: the session's own route out of its gate is admitted while the
    // gate holds the tree, in both harnesses, and the refusal names it. The
    // harness stop tools and the exact stop command change no gate input; the
    // gate itself stays refused until it ends.
    assert.match(
      refused.permissionDecisionReason,
      /Stop that gate from this session with node scripts\/harness\.mjs evidence --stop \(admitted now; it ends at its next boundary and records no check\) or the harness's own task-stop tool, or wait for it to finish\./,
    );
    for (const name of ["TaskStop", "KillShell"])
      assert.notEqual(
        invoke({ tool_name: name, tool_input: { task_id: "gate" } })
          .permissionDecision,
        "deny",
        name,
      );
    for (const command of [
      "node scripts/harness.mjs evidence --stop",
      "npm run harness -- evidence --stop",
    ])
      assert.notEqual(
        invoke({ tool_name: "Bash", tool_input: { command } })
          .permissionDecision,
        "deny",
        command,
      );
    for (const command of [
      "node scripts/harness.mjs evidence",
      "node scripts/harness.mjs evidence --stop && npm run build",
      "npm run harness -- evidence --stop --force",
    ])
      assert.equal(
        invoke({ tool_name: "Bash", tool_input: { command } })
          .permissionDecision,
        "deny",
        command,
      );
    assert.equal(
      invoke({
        tool_name: "Bash",
        tool_input: {
          command: "node scripts/harness.mjs evidence --stop",
          workdir: "scripts",
        },
      }).permissionDecision,
      "deny",
      "the stop command is reviewed at the root only",
    );
  } finally {
    active.release();
  }
});

const state = (root, session = "fixture") =>
  JSON.parse(readFileSync(statePath(root, session), "utf8"));
const gate = (root, checkId = "fixture:tree-check", exitCode = 0) => ({
  checkId,
  treeHash: gateTreeHash(root),
  subject: checkId === "npm test" ? gateCodeIdentity(root) : gateTreeHash(root),
  ...(checkId === "npm test" ? { codeIdentity: gateCodeIdentity(root) } : {}),
  durationMs: 17,
  exitCode,
  executed: true,
  evidenceRef: "fixture-executable-observation",
  recordedAt: new Date().toISOString(),
});

test("tree evidence matches Git objects, reuses any successful session and invalidates on one byte", (t) => {
  const root = repo(t);
  assert.equal(gateTreeHash(root), git(root, "rev-parse", "HEAD^{tree}"));
  const first = gate(root);
  recordGateChecks(root, [
    { ...first, session: "first" },
    { ...first, exitCode: 1, session: "second" },
  ]);
  assert.equal(
    findGateCheck(root, first.checkId, first.treeHash).session,
    "first",
  );
  assert.equal(requireGateChecks(root, [first.checkId]), first.treeHash);
  write(root, "own.txt", "original!\n");
  assert.throws(() => requireGateChecks(root, [first.checkId]), /stale/);
  write(root, ".gitattributes", "*.txt text eol=lf\n");
  write(root, "line.txt", "windows\r\nline\r\n");
  symlinkSync("line.txt", join(root, "link.txt"));
  git(root, "add", ".");
  assert.equal(gateTreeHash(root), git(root, "write-tree"));
});

test("concurrent evidence writers retain every successful row", async (t) => {
  const root = repo(t),
    path = new URL("./lib/gate-evidence.mjs", import.meta.url).href;
  await Promise.all(
    Array.from(
      { length: 6 },
      (_, id) =>
        new Promise((done, fail) => {
          const child = spawn(
            process.execPath,
            [
              "--input-type=module",
              "-e",
              `import {recordGateChecks} from ${JSON.stringify(path)}; recordGateChecks(process.argv[1], [JSON.parse(process.argv[2])]);`,
              root,
              JSON.stringify({ ...gate(root), evidenceRef: `fixture-${id}` }),
            ],
            { stdio: "ignore" },
          );
          child.on("error", fail);
          child.on("exit", (code) =>
            code ? fail(new Error(`writer ${code}`)) : done(),
          );
        }),
    ),
  );
  assert.equal(
    new Set(readGateChecks(root).map((row) => row.evidenceRef)).size,
    6,
  );
});

test("gate cache bounds hot rows, separates diagnostics and reuses evicted evidence", (t) => {
  const root = repo(t);
  const first = gate(root);
  recordGateChecks(root, [
    { ...first, output: "passing output ".repeat(1000) },
    ...Array.from({ length: gateCacheRows + 10 }, (_, index) => ({
      ...first,
      treeHash: createHash("sha1").update(String(index)).digest("hex"),
      evidenceRef: `fixture-${index}`,
      output: "passing output ".repeat(1000),
    })),
    {
      ...first,
      exitCode: 1,
      evidenceRef: "failed-attempt",
      output: "failed suite diagnostic",
    },
  ]);
  const hot = JSON.parse(
    readFileSync(join(root, "docs/control/local/harness/checks.json"), "utf8"),
  );
  assert.equal(hot.length, gateCacheRows);
  assert.ok(hot.every((row) => row.output === undefined));
  assert.equal(
    findGateCheck(root, first.checkId, first.treeHash).evidenceRef,
    first.evidenceRef,
  );
  assert.equal(readGateChecks(root).length, gateCacheRows + 12);
  const failed = hot.find((row) => row.evidenceRef === "failed-attempt");
  assert.equal(
    readFileSync(join(root, failed.outputRef), "utf8"),
    "failed suite diagnostic",
  );
  assert.ok(Buffer.byteLength(JSON.stringify(hot)) < 200_000);
});

test("session outputs include only two observed edits; generated and oversized files owe checks", async (t) => {
  const root = repo(t, { runtime: true });
  write(root, "inherited.txt", "inherited\n");
  write(root, ".gitattributes", "generated.txt dotln-generated\n");
  emitHarness(root);
  beginHarnessSession(root, "fixture", "executor");
  for (const [tool_name, path, body] of [
    ["Edit", "own.txt", "edit\n"],
    ["Bash", "second.txt", "shell edit\n"],
    ["Write", "generated.txt", "generated\n"],
    ["Write", "large.txt", "x".repeat(65537)],
  ]) {
    const tool_input =
      tool_name === "Bash"
        ? { command: "node fixture-writer.mjs" }
        : { file_path: join(root, path) };
    await evaluateHarnessHook(
      config(root, "write-observer"),
      input(root, "PreToolUse", "fixture", { tool_name, tool_input }),
      root,
      feedbackBoundary,
    );
    write(root, path, body);
    await evaluateHarnessHook(
      config(root, "read-observer"),
      input(root, "PostToolUse", "fixture", {
        tool_name,
        tool_input,
        tool_response: { success: true },
      }),
      root,
      feedbackBoundary,
    );
  }
  const owed = harnessOutputObligations(root, state(root));
  const journal = readFileSync(
    statePath(root).replace(/\.json$/, ".jsonl"),
    "utf8",
  )
    .trim()
    .split("\n")
    .map(JSON.parse);
  const snapshots = journal.filter((row) => row.authorship);
  assert.equal(snapshots.length, 8);
  assert.ok(
    snapshots.every(
      (row) => row.authorship.durationMs >= 0 && row.authorship.commands === 2,
    ),
  );
  assert.ok(snapshots.at(-1).authorship.bytes >= 65537);
  const meta = await collectMeta(root);
  const measured = meta.orders.find((row) => row.workOrder === "WO-999");
  assert.equal(measured.metrics.authorshipSnapshots, 8);
  assert.equal(
    measured.dispatches.find((row) => row.role === "executor")
      .authorshipCommands,
    16,
  );
  assert.deepEqual(
    owed.filter((row) => row.obligation === "read").map((row) => row.path),
    ["own.txt", "second.txt"],
  );
  assert.deepEqual(
    owed.filter((row) => row.obligation === "check").map((row) => row.path),
    ["generated.txt", "large.txt"],
  );
  assert.ok(!owed.some((row) => row.path === "inherited.txt"));
  git(root, "add", ".");
  git(root, "commit", "-qm", "Authored files survive a commit");
  assert.deepEqual(harnessOutputObligations(root, state(root)), owed);
});

test("WO-132 all four completions admit missing gates, reads and counters; Stop advises and releases", async (t) => {
  const root = repo(t, { runtime: true });
  const oldHome = process.env.CODEX_HOME,
    oldThread = process.env.CODEX_THREAD_ID;
  process.env.CODEX_HOME = join(root, ".runtime/codex");
  process.env.CODEX_THREAD_ID = "fixture-usage";
  t.after(() => {
    if (oldHome === undefined) delete process.env.CODEX_HOME;
    else process.env.CODEX_HOME = oldHome;
    if (oldThread === undefined) delete process.env.CODEX_THREAD_ID;
    else process.env.CODEX_THREAD_ID = oldThread;
  });
  emitHarness(root);
  const actions = [
    ["implementation-ready", "executor"],
    ["repair-complete", "executor"],
    ["verification-result", "verifier"],
    ["final-review-result", "reviewer"],
  ];
  write(root, "own.txt", "authored\n");
  for (const [action, role] of actions) {
    const noSession = await requireLifecycleEvidence(
      root,
      action,
      "pass",
      "WO-999",
    );
    if (!existsSync(statePath(root, role))) {
      assert.ok(
        noSession.advisories.some((message) =>
          /authorship and output reads unavailable/.test(message),
        ),
      );
      beginHarnessSession(root, role, role, ["own.txt"]);
    }
    const result = await requireLifecycleEvidence(
      root,
      action,
      "pass",
      "WO-999",
    );
    assert.ok(
      result.advisories.some((message) => /Outputs not read/.test(message)),
    );
    assert.equal(result.productGate, undefined);
    const usage = readFileSync(
      join(root, "docs/control/local/process/usage.jsonl"),
      "utf8",
    )
      .trim()
      .split("\n")
      .map(JSON.parse)
      .at(-1);
    assert.equal(usage.role, role);
    assert.equal(usage.observation.source, "unavailable");
    assert.equal(usage.observation.scope, "dispatch");
    assert.equal(usage.observation.usage.totalTokens, null);
    assert.ok(usage.observation.observedAt);
  }
  assert.ok(
    readGateChecks(root).every((row) => row.checkId === "git diff --check"),
  );
  const checkedTree = gateTreeHash(root);
  for (const [action, role] of actions) {
    observeHarnessDelivery(
      root,
      role,
      json(readHarnessOutput(root, "own.txt", 0, 8192)),
    );
    const timestamp = new Date().toISOString();
    write(
      root,
      ".runtime/codex/sessions/fixture-usage.jsonl",
      [
        {
          type: "session_meta",
          timestamp,
          payload: { id: "fixture-usage", cwd: root },
        },
        {
          type: "event_msg",
          timestamp,
          payload: {
            type: "token_count",
            info: {
              total_token_usage: {
                input_tokens: 100,
                output_tokens: 20,
                total_tokens: 120,
              },
            },
          },
        },
      ]
        .map(JSON.stringify)
        .join("\n") + "\n",
    );
    const completed = await requireLifecycleEvidence(
      root,
      action,
      "pass",
      "WO-999",
    );
    assert.ok(
      !completed.advisories.some((message) => /Outputs not read/.test(message)),
    );
    const usage = readFileSync(
      join(root, "docs/control/local/process/usage.jsonl"),
      "utf8",
    )
      .trim()
      .split("\n")
      .map(JSON.parse)
      .at(-1);
    assert.equal(usage.observation.usage.totalTokens, 120);
    assert.equal(usage.role, role);
    assert.equal(gateTreeHash(root), checkedTree);
    const ownState = state(root, role);
    ownState.remainingWork = ["criterion unresolved"];
    writeFileSync(statePath(root, role), json(ownState));
    const remaining = await requireLifecycleEvidence(
      root,
      action,
      "pass",
      "WO-999",
    );
    assert.ok(
      remaining.advisories.some((message) =>
        /remaining work.*criterion unresolved/.test(message),
      ),
    );
  }
  write(root, "own.txt", "A substantive correction after completion.\n");
  const changed = await requireLifecycleEvidence(
    root,
    "final-review-result",
    "pass",
    "WO-999",
  );
  assert.ok(
    changed.advisories.some((message) => /Outputs not read/.test(message)),
  );
  write(root, "own.txt", "Trailing whitespace remains a completion error. \n");
  await assert.rejects(
    requireLifecycleEvidence(root, "implementation-ready", "pass", "WO-999"),
    /git diff --check failed/,
  );
  write(root, "own.txt", "Valid bytes.\n");
  beginHarnessSession(root, "fixture", "executor");
  await evaluateHarnessHook(
    config(root, "concurrent-work-requires-worktrees"),
    input(root, "PreToolUse", "fixture", {
      tool_name: "Edit",
      tool_input: { file_path: join(root, "own.txt") },
    }),
    root,
    feedbackBoundary,
  );
  assert.ok(existsSync(join(root, "docs/control/local/harness/writer")));
  const stopped = await evaluateHarnessHook(
    config(root, "finish"),
    input(root, "Stop"),
    root,
    feedbackBoundary,
  );
  assert.ok(
    !stopped.decision && !stopped.hookSpecificOutput?.permissionDecision,
  );
  assert.match(stopped.systemMessage, /DotLn advisory: pending /);
  assert.match(stopped.systemMessage, /do not block lifecycle completion/);
  assert.match(stopped.systemMessage, /^Subagents: 0\/20/);
  assert.match(stopped.systemMessage, /^Observed facts/m);
  assert.equal(
    existsSync(join(root, "docs/control/local/harness/writer")),
    false,
  );
});

test("attribution settings and all agent session forms are checked", (t) => {
  const root = repo(t, { runtime: true });
  emitHarness(root);
  for (const text of [
    "Claude-Session: fixture",
    "SomeAgent-Session: fixture",
    "https://claude.ai/code/session_fixture",
    "https://chatgpt.com/codex/tasks/task_fixture",
  ])
    assert.ok(hasAiAttribution(text), text);
  assert.equal(
    hasAiAttribution("Explain a session URL in documentation"),
    false,
  );
  const settings = JSON.parse(
    readFileSync(join(root, ".claude/settings.json"), "utf8"),
  );
  assert.deepEqual(settings.attribution, {
    commit: "",
    pr: "",
    sessionUrl: false,
  });
  delete settings.attribution;
  write(root, ".claude/settings.json", json(settings));
  assert.throws(() => checkHarness(root), /drift|settings|different|stale/);
});

test("WO-132 verification and review observe oversized, generated and unread reports without requiring green code", async (t) => {
  const root = repo(t, { runtime: true });
  write(
    root,
    ".gitattributes",
    readFileSync(new URL("../.gitattributes", import.meta.url), "utf8"),
  );
  write(root, "docs/work-orders/README.md", "Generated verification status\n");
  write(root, "docs/product/03-architecture.md", "a".repeat(65537));
  write(root, "report.md", "FAIL: reproduced fixture failure\n");
  recordGateChecks(root, [gate(root, "npm test", 1)]);
  for (const [action, role] of [
    ["verification-result", "verifier"],
    ["final-review-result", "reviewer"],
  ]) {
    beginHarnessSession(root, role, role, [
      "docs/work-orders/README.md",
      "docs/product/03-architecture.md",
      "report.md",
    ]);
    const obligations = harnessOutputObligations(root, state(root, role));
    assert.deepEqual(
      obligations
        .filter((row) => row.obligation === "check")
        .map((row) => row.path),
      ["docs/product/03-architecture.md", "docs/work-orders/README.md"],
    );
    for (const verdict of ["fail", "pass"]) {
      const result = await requireLifecycleEvidence(
        root,
        action,
        verdict,
        "WO-999",
      );
      assert.ok(
        result.advisories.some((message) =>
          /Outputs not read.*report.md/.test(message),
        ),
      );
      assert.equal(result.productGate, undefined);
    }
    observeHarnessDelivery(
      root,
      role,
      json(readHarnessOutput(root, "report.md")),
    );
    const read = await requireLifecycleEvidence(root, action, "fail", "WO-999");
    assert.ok(
      !read.advisories.some((message) => /Outputs not read/.test(message)),
    );
    write(root, "report.md", `FAIL: ${role} correction after delivery\n`);
    const changed = await requireLifecycleEvidence(
      root,
      action,
      "fail",
      "WO-999",
    );
    assert.ok(
      changed.advisories.some((message) =>
        /Outputs not read.*report.md/.test(message),
      ),
    );
  }
});

test("evidence preparation repairs owned projections before fingerprinting, preserves explicit inputs and is idempotent", (t) => {
  const root = repo(t, { runtime: true });
  write(
    root,
    "docs/work-orders/WO-999-fixture.md",
    "# WO-999 — Fixture (v0.1.0)\n\n**Model:** fixture\n**Effort:** max\n**Cost:** fixture\n**Depends on:** none\n",
  );
  write(
    root,
    "docs/planning/work-order-map.md",
    "<!-- dotln-work-order-sequence:start -->\n<!-- dotln-work-order-sequence:end -->\n",
  );
  const retained = [
    [
      "docs/evidence/WO-999/immutable.json",
      '{"fixture":"historical observation"}\n',
    ],
    [
      "docs/publication/fixture-toc.md",
      "Source lock: intentionally unchanged review input\n",
    ],
    [
      "docs/control/local/private-state.json",
      '{"fixture":"retained control"}\n',
    ],
  ];
  for (const [path, bytes] of retained) write(root, path, bytes);
  write(
    root,
    "docs/product/00-fixture.md",
    "# Fixture\n\n## Candidate — Fixture follow-up\n\nFirst source revision.\n",
  );
  prepareHarnessEvidence(root);
  const originalFollowup = readFollowups(root).entries[0];
  write(
    root,
    "docs/product/00-fixture.md",
    "# Fixture\n\n## Candidate — Fixture follow-up\n\nChanged source revision.\n",
  );
  assert.throws(() => syncFollowups(root, { check: true }), /stale/);
  prepareHarnessEvidence(root);
  assert.equal(readFollowups(root).entries[0].id, originalFollowup.id);
  assert.equal(
    readFollowups(root).entries[0].revisions.length,
    originalFollowup.revisions.length + 1,
  );
  const owned = [
    "docs/work-orders/README.md",
    "docs/lineage/decisions-index.md",
    ".claude/harness-manifest.json",
    ".agents/skills/dotln-executor/SKILL.md",
  ];
  const expected = new Map(
    owned.map((path) => [path, readFileSync(join(root, path), "utf8")]),
  );
  for (const path of owned)
    write(
      root,
      path,
      path.endsWith(".json")
        ? json({
            ...JSON.parse(expected.get(path)),
            compilerPackageVersion: "stale-fixture",
          })
        : "Stale generated bytes\n",
    );
  assert.throws(() => workOrders(["index", "--check"], root), /stale|snapshot/);
  prepareHarnessEvidence(root);
  for (const [path, bytes] of expected)
    assert.equal(readFileSync(join(root, path), "utf8"), bytes);
  workOrders(["index", "--check"], root);
  writeDecisionsIndex(root, { check: true });
  syncFollowups(root, { check: true });
  checkHarness(root);
  const before = snapshot(root);
  const mtimes = owned.map((path) => statSync(join(root, path)).mtimeMs);
  const followupMtime = statSync(join(root, FOLLOWUPS)).mtimeMs;
  prepareHarnessEvidence(root);
  assert.deepEqual(snapshot(root), before);
  assert.deepEqual(
    owned.map((path) => statSync(join(root, path)).mtimeMs),
    mtimes,
  );
  assert.equal(statSync(join(root, FOLLOWUPS)).mtimeMs, followupMtime);
  for (const [path, bytes] of retained)
    assert.equal(readFileSync(join(root, path), "utf8"), bytes);
  const preparedTree = gateTreeHash(root);
  const checks = runHarnessEvidence(root);
  assert.ok(
    checks.every(
      (check) => check.exitCode === 0 && check.treeHash === preparedTree,
    ),
  );
  // Preparation cannot turn a real application failure into a passing receipt.
  write(
    root,
    "package.json",
    json({
      type: "module",
      scripts: { test: "node -e 'process.exit(7)'" },
    }),
  );
  prepareHarnessEvidence(root);
  assert.notEqual(
    runHarnessEvidence(root).find((row) => row.checkId === "npm test").exitCode,
    0,
  );
});

test("every installed hook is wired to a harness event or the Git commit boundary", (t) => {
  const root = repo(t, { runtime: true });
  const installation = harnessInstallation();
  emitHarness(root);
  const settings = JSON.parse(
    readFileSync(join(root, ".claude/settings.json"), "utf8"),
  );
  const commands = Object.values(settings.hooks).flatMap((rows) =>
    rows.flatMap((row) => row.hooks.map((hook) => hook.command)),
  );
  const installed = installation.manifest.installed.filter((file) =>
    file.path.startsWith(".claude/hooks/"),
  );
  assert.equal(installed.length, new Set(commands).size + 1);
  assert.equal(commands.length, new Set(commands).size + 1);
  assert.deepEqual(settings.hooks.SessionStart, [
    { hooks: [settings.hooks.UserPromptSubmit[0].hooks[0]] },
  ]);
  assert.match(
    settings.hooks.UserPromptSubmit[0].hooks[1].command,
    /presence-userpromptsubmit\.mjs/,
  );
  assert.match(settings.hooks.SessionStart[0].hooks[0].command, /session\.mjs/);
  for (const file of installed)
    assert.ok(
      file.path === ".claude/hooks/commit-msg.mjs" ||
        commands.some((command) => command.includes(file.path)),
      file.path,
    );
  for (const name of [
    "no-partial-completion",
    "read-your-own-output",
    "verify-app-before-done",
  ])
    assert.equal(existsSync(join(root, `.claude/hooks/${name}.mjs`)), false);
  const stopHooks = settings.hooks.Stop.flatMap((row) => row.hooks);
  assert.equal(stopHooks.length, 2);
  assert.match(stopHooks[1].command, /presence-stop\.mjs/);
});

test("discovery uses a bounded observed probe and session warns once off the version line", async (t) => {
  const root = repo(t, { runtime: true });
  write(
    root,
    "docs/discovery/environment.json",
    json({
      effortReadbackProbe: {
        harnesses: {
          "claude-code": {
            versions: [{ classification: "observed", value: "2.1.263" }],
            versionLines: [
              {
                classification: "observed",
                line: "2.1",
                newestPatch: "2.1.263",
              },
            ],
          },
        },
      },
    }),
  );
  const calls = [];
  const probe = probeHarness(
    "claude-code",
    (command, args, options) => {
      calls.push({ command, args, timeout: options.timeout });
      return {
        status: 0,
        stdout:
          args[0] === "--version"
            ? "2.1.265 (Claude Code)"
            : "--effort <value>",
      };
    },
    { CLAUDE_EFFORT: "max" },
  );
  assert.equal(probe.value, "2.1.265");
  assert.equal(probe.observedEffort, "max");
  assert.equal(probe.probe.versionChannel, "PATH");
  assert.ok(calls.every((row) => row.timeout === 5000));
  const runningCalls = [];
  const running = probeHarness(
    "claude-code",
    (command, args) => {
      runningCalls.push(command);
      return {
        status: 0,
        stdout:
          args[0] === "--help"
            ? "--effort <value>"
            : command === "/fixture/running-claude"
              ? "2.1.266"
              : "2.2.0",
      };
    },
    { CLAUDE_CODE_EXECPATH: "/fixture/running-claude" },
  );
  assert.equal(running.value, "2.1.266");
  assert.equal(running.probe.versionChannel, "CLAUDE_CODE_EXECPATH");
  assert.deepEqual(runningCalls, [
    "/fixture/running-claude",
    "/fixture/running-claude",
  ]);
  assert.throws(
    () =>
      probeHarness("claude-code", () => ({ status: 1 }), {
        CLAUDE_CODE_EXECPATH: "/fixture/unavailable-running-claude",
      }),
    /version probe failed/,
  );
  discoverHarness(root, "claude-code", () => probe);
  // WO-157 item 11: CLAUDE_EFFORT is the host's selected effort, recorded as a
  // selected-session readback and never as an effective one.
  const stored = JSON.parse(
    readFileSync(join(root, "docs/discovery/environment.json"), "utf8"),
  ).effortReadbackProbe.harnesses["claude-code"];
  assert.equal(stored.effectiveEffortReadback, undefined);
  assert.equal(stored.selectedSessionReadback.channel, "CLAUDE_EFFORT");
  assert.equal(stored.selectedSessionReadback.value, "max");
  assert.equal(stored.selectedSessionReadback.scope, "selected, not effective");
  emitHarness(root);
  const call = (version) =>
    evaluateHarnessHook(
      config(root, "session"),
      input(root, "UserPromptSubmit", "fixture", {
        prompt: "resume: next",
        harness_version: version,
      }),
      root,
      feedbackBoundary,
    );
  assert.equal((await call("2.1.266")).systemMessage, undefined);
  assert.deepEqual(state(root).versionObservation, {
    value: "2.1.266",
    channel: "harness_version",
  });
  assert.match(
    (await call("2.2.0")).systemMessage,
    /leaves observed lines 2\.1/,
  );
  assert.equal((await call("2.2.0")).systemMessage, undefined);
  const runningExecutable = join(root, "running-harness");
  writeFileSync(runningExecutable, "#!/bin/sh\nprintf '%s\\n' '2.2.1'\n", {
    mode: 0o700,
  });
  const oldExecutable = process.env.CLAUDE_CODE_EXECPATH;
  try {
    process.env.CLAUDE_CODE_EXECPATH = runningExecutable;
    const response = await evaluateHarnessHook(
      config(root, "session"),
      input(root, "UserPromptSubmit", "running-probe", { prompt: "continue" }),
      root,
      feedbackBoundary,
    );
    assert.match(
      response.systemMessage,
      /harness 2\.2\.1 leaves observed lines/,
    );
    assert.deepEqual(state(root, "running-probe").versionObservation, {
      value: "2.2.1",
      channel: "CLAUDE_CODE_EXECPATH",
    });
  } finally {
    if (oldExecutable === undefined) delete process.env.CLAUDE_CODE_EXECPATH;
    else process.env.CLAUDE_CODE_EXECPATH = oldExecutable;
  }
  const ancestors = [
    { pid: 501, ppid: 502, command: "/bin/sh", startedAt: "fixture" },
    {
      pid: 502,
      ppid: 503,
      command: "/fixture/claude/versions/2.1.266",
      startedAt: "fixture",
    },
    {
      pid: 503,
      ppid: 1,
      command: "/fixture/claude/versions/2.2.0",
      startedAt: "fixture",
    },
  ];
  const pathBin = join(root, "bin");
  mkdirSync(pathBin);
  writeFileSync(join(pathBin, "claude"), "#!/bin/sh\nprintf '2.2.9'\n", {
    mode: 0o700,
  });
  const env = { PATH: pathBin };
  assert.deepEqual(
    observeSessionHarnessVersion(undefined, env, 501, ancestors),
    { value: "2.1.266", channel: "ancestor-executable" },
  );
  assert.deepEqual(
    observeSessionHarnessVersion(undefined, env, 999, ancestors),
    { value: "2.2.9", channel: "PATH" },
  );
  const basenames = ancestors.map((row) => ({
    ...row,
    command: row.command.split("/").at(-1),
  }));
  assert.deepEqual(
    observeSessionHarnessVersion(
      undefined,
      { ...env, CLAUDE_PID: "502" },
      501,
      basenames,
    ),
    { value: "2.1.266", channel: "ancestor-executable" },
  );
  for (const declared of [undefined, "999", "502x"])
    assert.deepEqual(
      observeSessionHarnessVersion(
        undefined,
        { ...env, CLAUDE_PID: declared },
        501,
        basenames,
      ),
      { value: "2.2.9", channel: "PATH" },
    );
  assert.deepEqual(
    observeSessionHarnessVersion(
      undefined,
      { ...env, CLAUDE_PID: "502" },
      999,
      basenames,
    ),
    { value: "2.2.9", channel: "PATH" },
  );
  assert.deepEqual(
    observeSessionHarnessVersion("2.1.267", env, 501, ancestors),
    { value: "2.1.267", channel: "harness_version" },
  );
  assert.deepEqual(
    observeSessionHarnessVersion(
      undefined,
      { ...env, CLAUDE_CODE_EXECPATH: runningExecutable },
      501,
      ancestors,
    ),
    { value: "2.2.1", channel: "CLAUDE_CODE_EXECPATH" },
  );
  writeFileSync(
    join(pathBin, "ps"),
    `#!/bin/sh\nprintf '%s\\n' '${process.pid} 1 Thu Sep 10 08:00:00 2026 2.1.266'\n`,
    { mode: 0o700 },
  );
  const hookEnv = {
    ...process.env,
    PATH: `${pathBin}:${process.env.PATH}`,
    CLAUDE_PID: String(process.pid),
  };
  delete hookEnv.CLAUDE_CODE_EXECPATH;
  const parentHook = spawnSync(
    process.execPath,
    [".claude/hooks/session.mjs"],
    {
      cwd: root,
      env: hookEnv,
      encoding: "utf8",
      input: json(
        input(root, "UserPromptSubmit", "parent-probe", { prompt: "continue" }),
      ),
    },
  );
  assert.equal(parentHook.status, 0, parentHook.stderr);
  assert.match(
    JSON.parse(parentHook.stdout).hookSpecificOutput.additionalContext,
    /Observed facts/,
  );
  assert.deepEqual(state(root, "parent-probe").versionObservation, {
    value: "2.1.266",
    channel: "ancestor-executable",
  });
});

test("effect inventory refuses opaque tools and classifies invocations instead of quoted data", () => {
  for (const command of [
    "rg 'push|publish|.env' docs/",
    "cat <<'TEXT'\npush publish .env\nTEXT",
    "printf '%s' 'npm publish'",
    "node -e 'const text = \"push\";\nconsole.log(text)'",
    'jq "{value:\n.true}" data.json',
    "git commit -m 'first\nsecond'",
    "git rev-parse --git-dir",
  ])
    assert.deepEqual(invocationEffects(command), ["shell.run"]);
  assert.deepEqual(invocationEffects("git push origin main"), [
    "remote.unapproved",
  ]);
  assert.deepEqual(invocationEffects("cat .env"), ["credentials.access"]);
  assert.deepEqual(invocationEffects("bash <<'SH'\ngit push origin main\nSH"), [
    "shell.run",
    "remote.unapproved",
  ]);
  assert.throws(() => shellInvocations("echo $(git push)"), /Dynamic/);
  for (const name of [
    "Monitor",
    "NotebookEdit",
    "unknown_effectful_tool",
    "write_stdin",
  ])
    assert.throws(
      () => permissionEffect({ tool_name: name, tool_input: {} }),
      /adapter|Unclassified|Unknown|unclassified|unsupported/i,
    );
  // A same-host subagent spawn is a read: its own effects are guarded one by
  // one. Only a remote agent leaves those guards.
  for (const name of ["Agent", "Task", "Workflow"])
    assert.equal(
      permissionEffect({ tool_name: name, tool_input: {} }),
      "repo.read",
    );
  // WO-044: ending a task this session started is its own process control,
  // never an unclassified effect and never a repository write.
  for (const name of ["TaskStop", "KillShell"])
    assert.equal(
      permissionEffect({ tool_name: name, tool_input: { task_id: "gate" } }),
      "shell.run",
    );
  assert.throws(
    () =>
      permissionEffect({
        tool_name: "Agent",
        tool_input: { isolation: "remote" },
      }),
    /Remote subagents/,
  );
});

test("ancestor text mapping resolves an opaque process name once per session", async (t) => {
  const root = repo(t, { runtime: true });
  const bin = join(root, "bin");
  mkdirSync(bin);
  const log = join(root, "lsof-calls.jsonl");
  writeFileSync(join(bin, "claude"), "#!/bin/sh\nprintf '2.2.9'\n", {
    mode: 0o700,
  });
  const lsof = (output, status = 0) =>
    writeFileSync(
      join(bin, "lsof"),
      `#!${process.execPath}\nimport fs from "node:fs";\nfs.appendFileSync(${JSON.stringify(log)}, JSON.stringify(process.argv.slice(2)) + "\\n");\nprocess.stdout.write(${JSON.stringify(output)});\nprocess.exitCode = ${status};\n`,
      { mode: 0o700 },
    );
  const mappings = "p502\nftxt\nn/fixture/claude/versions/2.1.266\n";
  lsof(mappings);
  const env = { PATH: bin, CLAUDE_PID: "502" };
  const rows = [
    { pid: 501, ppid: 502, command: "/bin/sh", startedAt: "fixture" },
    { pid: 502, ppid: 1, command: "claude", startedAt: "fixture" },
  ];
  assert.deepEqual(observeSessionHarnessVersion(undefined, env, 501, rows), {
    value: "2.1.266",
    channel: "ancestor-executable-lsof",
  });
  assert.deepEqual(JSON.parse(readFileSync(log, "utf8").trim()), [
    "-a",
    "-p",
    "502",
    "-d",
    "txt",
    "-Fn",
  ]);
  const before = readFileSync(log, "utf8");
  assert.deepEqual(observeSessionHarnessVersion(undefined, env, 999, rows), {
    value: "2.2.9",
    channel: "PATH",
  });
  assert.equal(
    readFileSync(log, "utf8"),
    before,
    "an unverified PID is never probed",
  );
  for (const [output, status] of [
    ["", 1],
    ["n/unrelated/2.1.266\n", 0],
    [mappings + "n/fixture/claude/versions/2.0.0\n", 0],
  ]) {
    lsof(output, status);
    assert.deepEqual(observeSessionHarnessVersion(undefined, env, 501, rows), {
      value: "2.2.9",
      channel: "PATH",
    });
  }
  lsof(mappings);
  write(
    root,
    "docs/discovery/environment.json",
    json({
      effortReadbackProbe: {
        harnesses: {
          "claude-code": {
            versionLines: [
              {
                classification: "observed",
                line: "2.1",
                newestPatch: "2.1.263",
              },
            ],
          },
        },
      },
    }),
  );
  emitHarness(root);
  writeFileSync(
    join(bin, "ps"),
    `#!/bin/sh\nprintf '%s\\n' '${process.pid} 1 Thu Sep 10 08:00:00 2026 claude'\n`,
    { mode: 0o700 },
  );
  const hookEnv = {
    ...process.env,
    PATH: `${bin}:${process.env.PATH}`,
    CLAUDE_PID: String(process.pid),
  };
  delete hookEnv.CLAUDE_CODE_EXECPATH;
  const beforeHook = readFileSync(log, "utf8").trim().split("\n").length;
  for (let turn = 0; turn < 2; turn++) {
    const hook = spawnSync(process.execPath, [".claude/hooks/session.mjs"], {
      cwd: root,
      env: hookEnv,
      encoding: "utf8",
      input: json(
        input(root, "UserPromptSubmit", "mapping-probe", {
          prompt: "continue",
        }),
      ),
    });
    assert.equal(hook.status, 0, hook.stderr);
    assert.match(
      JSON.parse(hook.stdout).hookSpecificOutput.additionalContext,
      /Observed facts/,
    );
  }
  assert.deepEqual(state(root, "mapping-probe").versionObservation, {
    value: "2.1.266",
    channel: "ancestor-executable-lsof",
  });
  assert.equal(
    readFileSync(log, "utf8").trim().split("\n").length,
    beforeHook + 1,
  );
  assert.doesNotMatch(
    JSON.stringify(state(root, "mapping-probe")),
    /\/fixture\/claude|\/bin\/sh/,
  );
});

test("executable paths and wrappers preserve denied invocation effects", () => {
  for (const [command, effect] of [
    ["/usr/bin/git push origin main", "remote.unapproved"],
    ["/opt/homebrew/bin/gh pr create --fill", "remote.unapproved"],
    ["./node_modules/.bin/gh pr merge", "remote.unapproved"],
    ["/usr/local/bin/npm publish --access public", "package.publish"],
    ["/usr/bin/env git push origin main", "remote.unapproved"],
    [
      "/usr/bin/env -i X=1 /usr/bin/git -c color.ui=false push",
      "remote.unapproved",
    ],
    ["command -p /usr/bin/git push", "remote.unapproved"],
    ["/bin/bash -c '/usr/bin/git push'", "remote.unapproved"],
    ["/bin/bash -lc '/usr/bin/git push'", "remote.unapproved"],
    ["/usr/bin/env /bin/sh -xc 'npm publish'", "package.publish"],
    ["/usr/bin/ssh fixture.invalid", "transport.ssh"],
    ["/usr/bin/cat .env", "credentials.access"],
    [
      "/usr/local/bin/codex --dangerously-bypass-approvals-and-sandbox",
      "sandbox.disable",
    ],
    ["git \\" + "\n" + "push origin main", "remote.unapproved"],
    ...[
      "exec git push",
      "time git push",
      "nohup git push &",
      "timeout 60 git push",
      "nice -n 5 git push",
      "xargs git push",
      "xargs -0 -n1 git push",
      "caffeinate -di git push",
      "builtin exec git push",
      "(git push)",
      "{ git push; }",
      "eval 'git push'",
      "exec /usr/bin/env -i time -p nice -n 5 git push",
      "timeout -k 5s --signal=TERM 60s git push",
      'git "push"',
      "git pu\\sh",
    ].map((command) => [command, "remote.unapproved"]),
    ["exec ssh -V", "transport.ssh"],
    ["time ssh -V", "transport.ssh"],
    ["npx npm publish", "package.publish"],
    ["npx --yes --package npm npm publish", "package.publish"],
    ["eval 'npm' 'publish'", "package.publish"],
  ])
    assert.deepEqual(invocationEffects(command), [effect], command);
  assert.deepEqual(
    invocationEffects("/usr/bin/env /bin/sh <<'SH'\n/usr/bin/git push\nSH"),
    ["shell.run", "remote.unapproved"],
  );
  assert.deepEqual(shellInvocations("printf '%s' 'one\ntwo'\ngit push"), [
    ["printf", "%s", "one\ntwo"],
    ["git", "push"],
  ]);
  for (const command of [
    "if true; then git push; fi",
    "if false; then echo skip; else gh pr merge; fi",
    "while false; do npm publish; done",
    "until true; do exec ssh -V; done",
  ])
    assert.ok(
      invocationEffects(command).some((effect) =>
        ["remote.unapproved", "package.publish", "transport.ssh"].includes(
          effect,
        ),
      ),
      command,
    );
  for (const command of [
    "unknown-wrapper git push",
    "unknown-wrapper gh pr create",
    "unknown-wrapper npm publish",
    "unknown-wrapper ssh -V",
    "printf push | xargs -I{} git {}",
    "printf push | xargs --replace={} git {}",
    "for x in one; do git push; done",
    "timeout --unknown 60 git push",
  ])
    assert.throws(() => invocationEffects(command), /adapter/, command);
  for (const command of [
    "grep -rn 'git push' .",
    "echo git push",
    "printf '%s' 'git' 'push'",
    "command -v git",
    "echo '{ git push; }'",
  ])
    assert.deepEqual(invocationEffects(command), ["shell.run"], command);
  for (const command of [
    "git --git-dir=/tmp/fixture push",
    "git -C /tmp/fixture push",
    "/usr/bin/env -S 'git push'",
    "node -e 'unclosed\nargument",
  ])
    assert.throws(() => invocationEffects(command), /adapter|Unclosed/);
});

test("interpreter programs and their pipeline inputs cannot hide denied literal invocations", () => {
  for (const command of [
    "echo 'git push origin main' | sh",
    "printf 'git push origin main' | bash",
    "printf '%s %s' git push | cat | env dash",
    "echo 'git push' |\nsh",
    "echo 'git push' | (sh)",
    "echo 'git push' | sh -c 'sh'",
    "cat <<'SH' | sh\ngit push origin main\nSH",
    "node -e \"require('child_process').execSync('git push origin main')\"",
    "node --eval=\"require('child_process').execSync('npm publish')\"",
    "node -p \"require('child_process').execSync('ssh fixture.invalid')\"",
    "node <<'JS'\nrequire('child_process').execSync('git push')\nJS",
    "printf '%s' 'require(\"child_process\").execSync(\"git push\")' | node",
    "printf '%s' 'import os; os.system(\"git push\")' | python3",
    "printf '%s' 'import os; os.system(\"git push\")' | sh -c 'python3'",
    "deno eval 'Deno.Command(\"git push\")'",
    "bun -e 'spawn(\"git push\")'",
    "perl -e 'system(\"git push origin main\")'",
    "python3 -c 'import os; os.system(\"git push origin main\")'",
    'python3.13 -c \'subprocess.run(["git", "push"])\'',
    "ruby -e 'system(\"git push origin main\")'",
    "php -r 'system(\"git push origin main\");'",
    "awk 'BEGIN{system(\"git push origin main\")}'",
    "gawk 'BEGIN{system(\"npm publish\")}'",
    "osascript -e 'do shell script \"gh pr merge\"'",
    "expect -c 'spawn scp file fixture.invalid:file'",
    "printf 'gh repo delete fixture' | ksh",
    "echo 'gh api -X POST repos/o/r/pulls' | sh",
    "sh <<< 'git push origin main'",
  ])
    assert.throws(() => invocationEffects(command), /adapter/, command);
  assert.deepEqual(invocationEffects("dash <<'SH'\ngit push\nSH"), [
    "shell.run",
    "remote.unapproved",
  ]);
  for (const command of [
    "echo 'git push' | cat",
    "printf '%s' 'npm publish' | sed -n p",
    "cat <<'TEXT'\ngit push\nTEXT",
    "rg 'git push|npm publish' docs/",
    "echo 'git push'; sh",
    "echo 'git push' && sh",
    "echo 'git push' || sh",
    "echo 'git push'\nsh",
    "printf '%s' 'echo safe' | sh",
    "node -e 'console.log(1)'",
    "printf '%s' 'console.log(1)' | node",
    "python3 -c 'print(1)'",
    "printf '%s' 'print(1)' | python3",
    "awk '{print $1}' input.txt",
    "sh local-script.sh",
    "sh",
  ])
    assert.ok(
      invocationEffects(command).every((effect) => effect === "shell.run"),
      command,
    );
});

test("Git aliases refuse classification and remote writes use the remote effect", () => {
  for (const command of [
    "git -c alias.p=push p origin main",
    "git -calias.p=push p origin main",
    "git --config-env=alias.p=P p origin main",
    "git --config-env alias.p=P p origin main",
    "GIT_CONFIG_PARAMETERS=\"'alias.p=push'\" git p origin main",
    "env GIT_CONFIG_COUNT=1 GIT_CONFIG_KEY_0=alias.p GIT_CONFIG_VALUE_0=push git p",
    "GIT_CONFIG_KEY_0=alias.p; git p",
    "git -c ALIAS.p=push p",
    'git -c "$CONFIG" p',
    "GIT_CONFIG_KEY_0=$KEY git p",
  ])
    assert.throws(() => invocationEffects(command), /adapter/, command);
  for (const command of [
    "git send-pack origin refs/heads/main",
    "gh api -X POST repos/o/r/pulls -f title=x",
    "gh api --method=PATCH repos/o/r/issues/1",
    "gh api -XDELETE repos/o/r/issues/1",
    "gh api repos/o/r/pulls --field title=x",
    "gh api graphql -f query=mutation",
    "gh pr comment 1 --body hello",
    "gh pr review 1 --approve",
    "gh issue create --title x",
    "gh issue close 1",
  ])
    assert.deepEqual(
      invocationEffects(command),
      ["remote.unapproved"],
      command,
    );
  for (const command of [
    "git -c color.ui=false status",
    "git --config-env=color.ui=COLOR status",
    "GIT_CONFIG_COUNT=1 GIT_CONFIG_KEY_0=color.ui GIT_CONFIG_VALUE_0=false git status",
    "gh api repos/o/r/pulls",
    "gh api -X GET search/issues -f q=x",
    "gh api --method=HEAD repos/o/r",
    "gh pr view 1",
    "gh issue list",
    "echo 'git -c alias.p=push p'",
  ])
    assert.deepEqual(invocationEffects(command), ["shell.run"], command);
});

test("literal invocation floor holds across opaque programs, groups and redirections", () => {
  const denied = (command) => {
    try {
      return invocationEffects(command).some((effect) =>
        ["remote.unapproved", "package.publish", "transport.ssh"].includes(
          effect,
        ),
      );
    } catch (error) {
      assert.match(error.message, /adapter/);
      return true;
    }
  };
  const payloads = [
    "git push origin main",
    "git send-pack origin refs/heads/main",
    "gh pr create",
    "gh release upload v1 file",
    "gh repo fork",
    "gh api --input body.json repos/o/r/pulls",
    "npm publish",
    "pnpm publish",
    "yarn publish",
    "ssh fixture.invalid",
    "scp file fixture.invalid:file",
    "sftp fixture.invalid",
  ];
  const routes = [
    (p) => `unknown-program '${p}'`,
    (p) => `unknown-program <<'CODE'\n${p}\nCODE`,
    (p) => `echo '${p}' | unknown-program`,
    (p) => `(echo '${p}') | sh`,
    (p) => `{ echo '${p}'; echo harmless; } | sh`,
    (p) => `{ (echo '${p}'); echo harmless; } | cat | sh`,
    (p) => `echo '${p}' | { cat; cat; } | sh`,
    (p) => `echo '${p}' 2>&1 | sh`,
    (p) => `echo '${p}' 0<&0 | sh`,
    (p) => `echo '${p}' &>/dev/null | sh`,
    (p) => `find . -maxdepth 0 -exec sh -c '${p}' \\;`,
    (p) => `script -q /dev/null sh -c '${p}'`,
    (p) => `sudo -u fixture sh -c '${p}'`,
  ];
  for (const payload of payloads)
    for (const route of routes) {
      const command = route(payload);
      assert.equal(denied(command), true, command);
    }
  for (const command of [
    "csh -c 'git push origin main'",
    "tcsh -c 'git push origin main'",
    "/bin/csh -c 'git push origin main'",
    "echo 'git push origin main' | csh",
    "echo 'git push origin main' | tcsh",
    "csh <<'SH'\ngit push origin main\nSH",
    ...["-Ic", "-uc", "-Bc"].map(
      (flag) =>
        `python3 ${flag} 'import os; os.system("git push origin main")'`,
    ),
    ...["-ne", "-pe"].map(
      (flag) => `ruby ${flag} 'BEGIN{system("git push origin main")}'`,
    ),
    "php -R 'system(\"git push origin main\");'",
    "tclsh <<'TCL'\nexec git push origin main\nTCL",
    "echo 'exec git push origin main' | tclsh",
    "swift -e 'import Foundation; system(\"git push origin main\")'",
    "node -e 'console.log(\"git push.\")'",
    "(echo 'git push') 2>&1 | sh",
    "(echo 'git push') > output | sh",
    "echo 'git push' 2> >(cat) | sh",
  ])
    assert.equal(denied(command), true, command);
  // These payloads match the old literal floor, but are data at this boundary.
  for (const command of [
    ...[
      "echo",
      "printf",
      "grep",
      "rg",
      "cat",
      "sed",
      "sort",
      "wc",
      "jq",
      "head",
      "tail",
      "less",
      "test",
    ].map((p) => `${p} 'git push'`),
    "(echo 'git push') | cat",
    "{ echo 'git push'; echo harmless; } | cat",
    "echo 'git push' 2>&1 | cat",
    "echo 'git push' &>/dev/null",
    "{ echo 'git push'; }; sh",
    "(echo 'git push'); sh",
    "git commit -m 'Refuse git push inside hooks'",
    "git log --grep='git push'",
    "unknown-program 'ordinary data'",
    "python3 -Ic 'print(1)'",
    "ruby -ne 'BEGIN{puts 1}'",
    "csh -c 'echo harmless'",
  ])
    assert.ok(
      invocationEffects(command).every((effect) => effect === "shell.run"),
      command,
    );
});

test("GitHub request body and named remote writes retain remote classification", () => {
  for (const command of [
    "gh api --input body.json repos/o/r/pulls",
    "gh api repos/o/r/pulls --input=body.json",
    'printf \'{"title":"x"}\' | gh api --input - repos/o/r/pulls',
    "gh api graphql --input q.json",
    "gh api graphql -X GET",
    "gh api -H 'Accept: application/json' graphql",
    "gh api graphql",
    "gh api repos/o/r/pulls --input --method=GET",
    "gh release upload v1 file",
    "gh workflow run build.yml",
    "gh secret set FIXTURE",
    "gh variable set FIXTURE",
    "gh gist create file",
    "gh repo fork",
    "gh repo sync",
    "gh label create fixture",
    "gh run cancel 1",
    "gh run rerun 1",
    "gh pr ready 1",
  ])
    assert.ok(
      invocationEffects(command).includes("remote.unapproved"),
      command,
    );
  for (const command of [
    "gh api --input body.json -X GET repos/o/r",
    "gh api repos/o/r --input=body.json --method=OPTIONS",
    "gh api -X=HEAD repos/o/r --input=body.json",
    "gh api repos/o/r --jq graphql",
    "gh api repos/o/r --header graphql",
    "gh release view v1",
    "gh workflow list",
    "gh secret list",
    "gh variable list",
    "gh gist list",
    "gh repo view",
    "gh label list",
    "gh run view 1",
    "gh pr view 1",
  ])
    assert.deepEqual(invocationEffects(command), ["shell.run"], command);
});

test("package execution wrappers retain child effects and literal data controls", () => {
  for (const prefix of [
    "npm exec --",
    "npm x --",
    "npm exec --yes --package=git --",
    "pnpm exec",
    "pnpm dlx",
    "yarn exec",
  ]) {
    for (const [child, effect] of [
      ["git push origin main", "remote.unapproved"],
      ["npm publish", "package.publish"],
      ["gh pr create --fill", "remote.unapproved"],
      ["ssh fixture.invalid", "transport.ssh"],
    ])
      assert.deepEqual(invocationEffects(`${prefix} ${child}`), [effect]);
    assert.deepEqual(invocationEffects(`${prefix} echo 'git push'`), [
      "shell.run",
    ]);
  }
  for (const option of ["-c", "--call", "--call="])
    assert.deepEqual(
      invocationEffects(
        `npm exec ${option}${option.endsWith("=") ? "" : " "}'git push origin main'`,
      ),
      ["remote.unapproved"],
    );
  assert.deepEqual(invocationEffects("yarn npm publish"), ["package.publish"]);
  assert.deepEqual(invocationEffects("npm exec git push --package=git"), [
    "remote.unapproved",
  ]);
  assert.throws(
    () => invocationEffects("npm exec echo --call 'git push'"),
    /adapter/,
  );
  assert.deepEqual(invocationEffects("npm exec echo -- --call 'git push'"), [
    "shell.run",
  ]);
  assert.deepEqual(invocationEffects("npm exec -c \"echo 'git push'\""), [
    "shell.run",
  ]);
  assert.deepEqual(
    commitMessageInputs("npm exec -- git commit -m 'Plain subject'"),
    [{ messages: ["Plain subject"], files: [] }],
  );
  assert.throws(
    () => invocationEffects("npm exec --unsupported echo hi"),
    /adapter/,
  );
});

test("assignments and Git command configuration retain the literal invocation floor", () => {
  for (const payload of [
    "git push origin main",
    "npm publish",
    "ssh fixture.invalid",
  ])
    for (const command of [
      ...[
        "diff.external",
        "core.fsmonitor",
        "core.sshCommand",
        "credential.helper",
        "core.editor",
        "core.pager",
      ].flatMap((key) => [
        `git -c ${key}='${payload} #' diff`,
        `git -c${key}='${payload} #' status`,
        `X='${payload}'; git --config-env=${key}=X diff`,
        `X='${payload}'; git --config-env ${key}=X diff`,
      ]),
      ...[
        "GIT_EXTERNAL_DIFF",
        "GIT_SEQUENCE_EDITOR",
        "GIT_SSH_COMMAND",
        "X",
      ].flatMap((key) => [
        `${key}='${payload}' git diff`,
        `env ${key}='${payload}' unknown-program "$${key}"`,
        `${key}='${payload}'; find . -maxdepth 0 -exec $${key} \\;`,
        `${key}='${payload}'; script -q /dev/null $${key}`,
        `${key}='${payload}'; sudo -u fixture $${key}`,
      ]),
    ])
      assert.throws(() => invocationEffects(command), /adapter/, command);
  for (const command of [
    "git -c core.pager=cat log -1",
    "GIT_PAGER=cat git log -1",
    "X=cat git --config-env=core.pager=X log -1",
    "git commit -m 'Refuse git push inside hooks'",
    "git log --grep='git push'",
    "rg 'X=git push' docs/",
  ])
    assert.deepEqual(invocationEffects(command), ["shell.run"], command);
});

test("case-folded executable names retain effects without folding data operands", () => {
  for (const [command, effect] of [
    ["GIT push origin main", "remote.unapproved"],
    ["Git push origin main", "remote.unapproved"],
    ["/opt/homebrew/bin/GIT push origin main", "remote.unapproved"],
    ["GH pr create --fill", "remote.unapproved"],
    ["NPM publish", "package.publish"],
    ["PNPM publish", "package.publish"],
    ["YARN publish", "package.publish"],
    ["SSH fixture.invalid", "transport.ssh"],
    ["SCP file fixture.invalid:file", "transport.ssh"],
    ["SFTP fixture.invalid", "transport.ssh"],
    ["ENV NPM exec -- GIT push", "remote.unapproved"],
  ])
    assert.deepEqual(invocationEffects(command), [effect], command);
  assert.throws(
    () => invocationEffects("unknown-program 'GIT push'"),
    /adapter/,
  );
  assert.deepEqual(invocationEffects("ECHO 'GIT push'"), ["shell.run"]);
  assert.deepEqual(commitMessageInputs("GIT commit -m 'Mixed Case'"), [
    { messages: ["Mixed Case"], files: [] },
  ]);
});

test("effect-program classification preserves effect distinctions while hooks delegate to host permissions", (t) => {
  const commands = [
    ...["-x", "--exec", "--exec="].map(
      (flag) =>
        `git rebase ${flag}${flag.endsWith("=") ? "" : " "}'git push origin fixture' HEAD~1`,
    ),
    "git bisect run git push origin fixture",
    "git filter-branch --tree-filter 'git push origin fixture' HEAD",
    "git difftool --no-prompt -x 'git push origin fixture #' HEAD~1 -- README.md",
    "git difftool --extcmd='git push origin fixture #' HEAD~1",
    "git submodule foreach 'git push origin fixture'",
    "git submodule foreach git push origin fixture",
    "npm explore typescript -- git push origin fixture",
    "npm explore typescript -- npm publish",
    "yarn workspace @dotln/skeleton exec git push origin fixture",
    "yarn workspaces run exec git push origin fixture",
    "git config diff.external 'git push origin fixture #'; git diff HEAD~1 -- README.md",
    "git config alias.p '!git push origin fixture'; git p",
    "git config core.sshCommand 'git push origin fixture #'; git fetch",
    "git config --local core.pager 'git push origin fixture #'; git log -1",
    "gh alias set --shell p 'git push origin fixture'; gh p",
    // New subcommands and option spellings cannot silently opt out of the floor.
    ...["git", "gh", "npm", "pnpm", "yarn"].flatMap((program) =>
      ["git push", "npm publish", "gh pr create", "ssh fixture.invalid"].map(
        (payload) => `${program} future-command --future-option '${payload}'`,
      ),
    ),
    "git rebase --message='git push' HEAD~1",
    "git log --grep harmless --future-option 'git push'",
    "git grep --open-files-in-pager='git push' pattern",
    "git grep -O 'git push' pattern",
    "git grep --future-option 'git push' pattern",
    "git commit -m harmless --future-option 'git push'",
    "git commit -- -m 'git push'",
    "git -c core.pager='git push' log --grep harmless",
    "echo 'git push' | npm explore typescript -- sh",
  ];
  const controls = [
    "git rebase -x 'echo hi' HEAD~1",
    "npm explore typescript -- ls",
    "git config core.pager cat",
    "git -c core.pager=cat log -1",
    ...["commit", "tag", "notes add", "stash push"].flatMap((subcommand) =>
      ["-m 'git push'", "--message='npm publish'"].map(
        (message) => `git ${subcommand} ${message}`,
      ),
    ),
    "git commit -am'git push'",
    "git commit -F 'git push.txt'",
    "git tag --file='git push.txt' fixture",
    "git notes add -F 'git push.txt'",
    "git log --grep='git push' -S'npm publish' -G 'gh pr create'",
    "git grep -e 'git push' -- README.md",
    "git grep 'git push'",
    "git grep -n -F 'git push'",
    "git grep -- 'git push'",
    "rg 'git push' docs/",
    "cat <<'TEXT'\ngit push\nTEXT",
    "npm exec -- echo 'git push'",
  ];
  const isDenied = (command) => {
    try {
      return invocationEffects(command).some((effect) =>
        ["remote.unapproved", "package.publish", "transport.ssh"].includes(
          effect,
        ),
      );
    } catch (error) {
      assert.match(error.message, /adapter/);
      return true;
    }
  };
  for (const command of commands)
    assert.equal(isDenied(command), true, command);
  for (const command of controls)
    assert.ok(
      invocationEffects(command).every((effect) => effect === "shell.run"),
      command,
    );

  const root = repo(t, { runtime: true });
  emitHarness(root);
  let visible = 0;
  for (const [advised, cases] of [
    [true, commands],
    [false, controls],
  ])
    for (const command of cases) {
      const before = advisoryRows(root).length;
      const result = spawnSync(
        process.execPath,
        [".claude/hooks/permissions.mjs"],
        {
          cwd: root,
          input: json(
            input(root, "PreToolUse", "fixture", {
              tool_name: "Bash",
              tool_input: { command },
            }),
          ),
          encoding: "utf8",
        },
      );
      assert.equal(result.status, 0, result.stderr);
      const response = JSON.parse(result.stdout);
      assert.equal(
        response.hookSpecificOutput?.permissionDecision,
        undefined,
        command,
      );
      const rows = advisoryRows(root);
      assert.equal(rows.length - before, advised ? 1 : 0, command);
      if (advised) {
        assert.match(
          rows.at(-1).advisory,
          /advisory:.*host permissions decide/,
          command,
        );
        if (response.systemMessage) visible++;
      } else assert.deepEqual(response, {}, command);
    }
  assert.equal(visible, 1);
});

test("live-gate hooks count one invariant refusal per tool use without retaining its identity", async (t) => {
  const root = repo(t, { runtime: true });
  emitHarness(root);
  beginHarnessSession(root, "fixture", "executor");
  const settings = JSON.parse(
    readFileSync(join(root, ".claude/settings.json"), "utf8"),
  );
  const hooks = settings.hooks.PreToolUse.flatMap((row) => row.hooks);
  const command = "touch own.txt";
  const active = beginGateRun(root, "npm test");
  t.after(() => active.release());
  const runHooks = (toolUseId, session = "fixture") => {
    let denied = 0;
    for (const hook of hooks) {
      const path = hook.command.match(/\$CLAUDE_PROJECT_DIR\/(.+)"$/)[1];
      const result = spawnSync(process.execPath, [path], {
        cwd: root,
        input: json(
          input(root, "PreToolUse", session, {
            tool_name: "Bash",
            tool_use_id: toolUseId,
            tool_input: { command },
          }),
        ),
        encoding: "utf8",
      });
      assert.equal(result.status, 0, result.stderr);
      if (
        JSON.parse(result.stdout).hookSpecificOutput?.permissionDecision ===
        "deny"
      )
        denied++;
    }
    assert.ok(denied > 1, "reproduce multiple denying hooks for one tool use");
  };
  const count = async () =>
    (await collectMeta(root)).orders.find((row) => row.workOrder === "WO-999")
      .metrics.guardRefusals;
  runHooks("fixture-tool-one");
  assert.equal(await count(), 1);
  runHooks("fixture-tool-one"); // Re-delivering the same event is not a new refusal.
  assert.equal(await count(), 1);
  runHooks("fixture-tool-two"); // Identical command, distinct invocation.
  assert.equal(await count(), 2);
  beginHarnessSession(root, "fixture-other", "executor");
  runHooks("fixture-tool-one", "fixture-other");
  assert.equal(await count(), 3);
  const journal = readFileSync(
    statePath(root).replace(/\.json$/, ".jsonl"),
    "utf8",
  );
  for (const value of [command, "fixture-tool-one", "fixture-tool-two"])
    assert.ok(!journal.includes(value));
});

test("WO-132 delegated advisories are journaled without counting guard refusals or retaining command bytes", async (t) => {
  const root = repo(t, { runtime: true });
  emitHarness(root);
  beginHarnessSession(root, "fixture", "executor");
  const visible = [];
  const invoke = (name, event, tool, command) => {
    const result = spawnSync(process.execPath, [`.claude/hooks/${name}.mjs`], {
      cwd: root,
      input: json(
        input(root, event, "fixture", {
          tool_name: tool,
          tool_input: { command },
        }),
      ),
      encoding: "utf8",
    });
    assert.equal(result.status, 0, result.stderr);
    const response = JSON.parse(result.stdout);
    if (response.systemMessage) visible.push(response.systemMessage);
    return response;
  };
  const commands = ["git push origin refusal-fixture", "git $FIXTURE_COMMAND"];
  for (const command of commands)
    assert.equal(
      invoke("permissions", "PreToolUse", "Bash", command).hookSpecificOutput
        ?.permissionDecision,
      undefined,
    );
  assert.deepEqual(
    invoke("permissions", "PreToolUse", "Bash", "echo admitted-fixture"),
    {},
  );
  assert.equal(
    invoke(
      "no-attribution",
      "PreToolUse",
      "Bash",
      "git commit -m 'Claude-Session: fixture'",
    ).hookSpecificOutput?.permissionDecision,
    undefined,
  );
  const stop = invoke("finish", "Stop", undefined, undefined);
  assert.match(stop.systemMessage, /Observed facts/);
  assert.deepEqual(visible.slice(0, -1), [
    "DotLn advisory: compiled authority does not permit remote.unapproved; host permissions decide.",
    "DotLn advisory: command classification: Dynamic or missing Git subcommand requires an explicit effect adapter; host permissions decide.",
    "DotLn advisory: no-attribution: AI attribution footer or trailer; host permissions decide.",
  ]);
  assert.equal(visible.at(-1), stop.systemMessage);
  assert.equal(stop.decision, undefined);
  const journal = readFileSync(
    statePath(root).replace(/\.json$/, ".jsonl"),
    "utf8",
  );
  const refusals = journal
    .trim()
    .split("\n")
    .map(JSON.parse)
    .filter((row) => row.refusal);
  assert.equal(refusals.length, 0);
  const advisories = journal
    .trim()
    .split("\n")
    .map(JSON.parse)
    .filter((row) => row.delegated);
  assert.equal(
    advisories.filter((row) => row.event === "PreToolUse").length,
    3,
  );
  assert.equal(advisories.filter((row) => row.event === "Stop").length, 1);
  assert.ok(advisories.every((row) => /advisory:/.test(row.advisory)));
  for (const command of [...commands, "Claude-Session: fixture"])
    assert.ok(!journal.includes(command));
  const measured = (await collectMeta(root)).orders.find(
    (row) => row.workOrder === "WO-999",
  );
  assert.equal(measured.metrics.guardRefusals, 0);
  assert.equal(measured.metrics.stopRefusals, 0);
  for (const command of commands)
    assert.equal(
      invoke("permissions", "PreToolUse", "Bash", command).systemMessage,
      undefined,
    );
  assert.equal(
    invoke(
      "no-attribution",
      "PreToolUse",
      "Bash",
      "git commit -m 'Claude-Session: fixture'",
    ).systemMessage,
    undefined,
  );
  assert.equal(
    visible.length,
    4,
    "repeated identities remain quiet after Stop",
  );
});

test("dynamic executable and subcommand operands refuse while literal dollars and paths remain data", () => {
  for (const command of [
    "$G push origin main",
    "git $P origin main",
    "P=push; git $P origin main",
    "git ${X:-push} origin main",
    "git $'push' origin main",
    '"$G" push',
    'git "$P"',
    "exec $G push",
    "npm $P",
    "pnpm ${P}",
    "yarn $P",
    "gh $P create",
    "gh pr $P",
    "git -c color.ui=false $P",
    'eval "$COMMAND"',
    'bash -c "$COMMAND"',
    "printf push | xargs git",
    "printf publish | xargs npm",
    "printf merge | xargs gh pr",
    "printf git | xargs",
  ])
    assert.throws(
      () => invocationEffects(command),
      /Dynamic.*adapter/,
      command,
    );
  for (const command of [
    "cat $TMPDIR/result",
    'cat "$TMPDIR/result"',
    "rg '$G push' docs/",
    "echo ${X:-push}",
    "git log '$P'",
    "git '\\$P'",
    "git '$P'",
    "git \\$P",
    "xargs git status",
  ])
    assert.deepEqual(invocationEffects(command), ["shell.run"], command);
});

test("commit attribution extracts actual invocation messages and hooks give actionable advisories", (t) => {
  for (const command of [
    "echo 'git commit'",
    "echo 'git commit -m x'",
    "grep -n -E 'commit-message-bytes|git commit' source.ts",
    "printf '%s' 'git commit'",
    "git --version",
    "git log",
    "command -v git",
  ])
    assert.deepEqual(commitMessageInputs(command), [], command);
  assert.deepEqual(
    commitMessageInputs(
      "exec git -c color.ui=false commit -m fix --message='details'",
    ),
    [{ messages: ["fix", "details"], files: [] }],
  );
  assert.deepEqual(
    commitMessageInputs("git commit -amfix; eval 'git commit -F message.txt'"),
    [
      { messages: ["fix"], files: [] },
      { messages: [], files: ["message.txt"] },
    ],
  );
  assert.deepEqual(commitMessageInputs("xargs git commit -m fix --"), [
    { messages: ["fix"], files: [] },
  ]);
  for (const command of [
    "git commit",
    "git commit -m",
    'git commit -m "$MESSAGE"',
    "git commit -m valid; git commit",
    "xargs git commit -m fix",
  ])
    assert.throws(
      () => commitMessageInputs(command),
      /Commit message|commit message|commit argument/,
      command,
    );
  const root = repo(t, { runtime: true });
  emitHarness(root);
  const invoke = (command) => {
    const result = spawnSync(
      process.execPath,
      [".claude/hooks/no-attribution.mjs"],
      {
        cwd: root,
        input: json(
          input(root, "PreToolUse", "attribution-fixture", {
            tool_name: "Bash",
            tool_input: { command },
          }),
        ),
        encoding: "utf8",
      },
    );
    assert.equal(result.status, 0, result.stderr);
    return JSON.parse(result.stdout);
  };
  assert.deepEqual(invoke("echo 'git commit'"), {});
  assert.deepEqual(invoke("git commit -m fix"), {});
  assert.deepEqual(invoke("xargs git commit -m fix --"), {});
  const first = invoke("xargs git commit -m fix");
  assert.equal(first.hookSpecificOutput?.permissionDecision, undefined);
  assert.equal(
    first.systemMessage,
    "DotLn advisory: command classification: Dynamic or missing commit argument requires an explicit effect adapter; host permissions decide.",
  );
  assert.equal(invoke("xargs git commit -m fix").systemMessage, undefined);
  const refused = invoke("git commit");
  assert.equal(
    refused.systemMessage,
    "DotLn advisory: command classification: Commit message bytes unavailable; use an explicit message or message file; host permissions decide.",
  );
  assert.equal(invoke("git commit").systemMessage, undefined);
  const advisory = advisoryRows(root, "attribution-fixture").at(-1).advisory;
  assert.match(advisory, /command classification: Commit message/);
  assert.doesNotMatch(advisory, /runtime unavailable/);
  write(root, "message.txt", "Claude-Session: synthetic\n");
  assert.equal(
    invoke("exec git commit -F message.txt").hookSpecificOutput
      ?.permissionDecision,
    undefined,
  );
});

test("installed permission hook distinguishes classification advisories from runtime failure", async (t) => {
  const root = repo(t, { runtime: true });
  emitHarness(root);
  beginHarnessSession(root, "fixture", "executor");
  const visible = [];
  const invoke = (command) => {
    const result = spawnSync(
      process.execPath,
      [".claude/hooks/permissions.mjs"],
      {
        cwd: root,
        input: json(
          input(root, "PreToolUse", "fixture", {
            tool_name: "Bash",
            tool_input: { command },
          }),
        ),
        encoding: "utf8",
      },
    );
    assert.equal(result.status, 0, result.stderr);
    const response = JSON.parse(result.stdout);
    if (response.systemMessage) visible.push(response.systemMessage);
    return response;
  };
  for (const command of [
    "git push",
    "/usr/bin/git push",
    "/usr/bin/env git push",
    "exec git push",
    "if true; then git push; fi",
    "npx npm publish",
    "npm exec -- npm publish",
    "npm x -- git push origin main",
    "pnpm exec git push origin main",
    "pnpm dlx git push origin main",
    "yarn exec git push origin main",
    "yarn npm publish",
    "git -c diff.external='git push origin main #' diff",
    "GIT_EXTERNAL_DIFF='git push origin main #' git diff",
    "X='git push origin main'; find . -maxdepth 0 -exec $X \\;",
    "GIT push origin main",
    "printf push | xargs git",
    "printf push | xargs -I{} git {}",
    "echo 'git push' | sh",
    "node -e \"require('child_process').execSync('git push')\"",
    "git -c alias.p=push p",
    "git send-pack origin refs/heads/main",
    "gh api -X POST repos/o/r/pulls",
    "gh pr comment 1 --body hello",
    "(echo 'git push origin main') | sh",
    "{ echo 'git push origin main'; echo harmless; } | sh",
    "echo 'git push origin main' 2>&1 | sh",
    "csh -c 'git push origin main'",
    "python3 -Ic 'import os; os.system(\"git push origin main\")'",
    "find . -maxdepth 0 -exec sh -c 'git push origin main' \\;",
    "gh api --input body.json repos/o/r/pulls",
    "gh api graphql --input q.json",
    "gh workflow run build.yml",
  ])
    assert.equal(
      invoke(command).hookSpecificOutput?.permissionDecision,
      undefined,
    );
  assert.deepEqual(invoke("node -e 'console.log(\n1)'"), {});
  assert.equal(invoke("git $P").systemMessage, undefined);
  assert.match(
    advisoryRows(root).at(-1).advisory,
    /command classification: Dynamic/,
  );
  const refused = invoke("echo $(git push)");
  assert.equal(refused.hookSpecificOutput?.permissionDecision, undefined);
  assert.equal(
    refused.systemMessage,
    "DotLn advisory: command classification: Dynamic shell substitution requires an explicit effect adapter; host permissions decide.",
  );
  assert.equal(invoke("git push").systemMessage, undefined);
  assert.equal(invoke("echo $(git push)").systemMessage, undefined);
  assert.deepEqual(visible, [
    "DotLn advisory: compiled authority does not permit remote.unapproved; host permissions decide.",
    "DotLn advisory: compiled authority does not permit package.publish; host permissions decide.",
    "DotLn advisory: command classification: Opaque program contains a denied invocation; an explicit effect adapter is required; host permissions decide.",
    "DotLn advisory: command classification: Dynamic or missing Git subcommand requires an explicit effect adapter; host permissions decide.",
    "DotLn advisory: command classification: Xargs substitution requires an explicit effect adapter; host permissions decide.",
    "DotLn advisory: command classification: Git alias configuration requires an explicit effect adapter; host permissions decide.",
    "DotLn advisory: command classification: Dynamic shell substitution requires an explicit effect adapter; host permissions decide.",
  ]);
  assert.match(
    advisoryRows(root).at(-1).advisory,
    /command classification: Dynamic/,
  );
  assert.doesNotMatch(
    advisoryRows(root).at(-1).advisory,
    /runtime unavailable/,
  );
  const timings = readFileSync(
    statePath(root).replace(/\.json$/, ".jsonl"),
    "utf8",
  )
    .trim()
    .split("\n")
    .map(JSON.parse)
    .filter((row) => row.hookTiming);
  assert.ok(timings.length >= 9);
  assert.ok(
    timings.every(
      (row) =>
        row.hookTiming.durationMs > 0 && row.hookTiming.kind === "permission",
    ),
  );
  const measured = (await collectMeta(root)).orders.find(
    (row) => row.workOrder === "WO-999",
  );
  assert.equal(measured.metrics.hookRuns, timings.length);
  assert.equal(
    measured.metrics.hookPeakMs,
    Math.max(...timings.map((row) => row.hookTiming.durationMs)),
  );
  assert.equal(
    measured.dispatches.find((row) => row.role === "executor").hookRuns,
    timings.length,
  );
});

test("harness evidence --fail records only the diff check the failing verdict requires", async (t) => {
  const root = repo(t, { runtime: true });
  for (const name of ["harness.mjs", "harness-entry.mjs", "work-orders.mjs"])
    copyFileSync(join(source, "scripts", name), join(root, "scripts", name));
  // Keep the real preparation dependency graph local so relative imports
  // resolve to the fixture-owned source files.
  cpSync(join(source, "scripts/lib"), join(root, "scripts/lib"), {
    recursive: true,
    dereference: true,
  });
  mkdirSync(join(root, "packages/skeleton/src"), { recursive: true });
  for (const name of [
    "gate-evidence.mjs",
    "gate-deadlines.mjs",
    "usage-observation.mjs",
    "correction-observation.mjs",
  ])
    copyFileSync(
      join(source, "packages/skeleton/src", name),
      join(root, "packages/skeleton/src", name),
    );
  write(
    root,
    "docs/work-orders/WO-999-fixture.md",
    "# WO-999 — Fixture (v0.1.0)\n\n**Model:** fixture\n**Effort:** max\n**Cost:** fixture\n**Depends on:** none\n",
  );
  write(
    root,
    "docs/planning/work-order-map.md",
    "<!-- dotln-work-order-sequence:start -->\n<!-- dotln-work-order-sequence:end -->\n",
  );
  emitHarness(root);
  beginHarnessSession(root, "fixture", "verifier");
  write(
    root,
    "package.json",
    json({
      type: "module",
      scripts: {
        harness: JSON.parse(readFileSync(join(source, "package.json"), "utf8"))
          .scripts.harness,
        build: "node .runtime/check.mjs",
        test: "node .runtime/check.mjs",
      },
    }),
  );
  write(
    root,
    ".runtime/check.mjs",
    "import { appendFileSync } from 'node:fs'; appendFileSync('.runtime/runs.txt', process.env.npm_lifecycle_event + '\\n');\n",
  );
  const runs = () => {
    try {
      return readFileSync(join(root, ".runtime/runs.txt"), "utf8")
        .trim()
        .split("\n")
        .filter(Boolean);
    } catch {
      return [];
    }
  };
  const invoke = (...flags) => {
    const result = spawnSync(
      "npm",
      ["run", "harness", "--", "evidence", ...flags],
      {
        cwd: root,
        encoding: "utf8",
      },
    );
    assert.equal(result.status, 0, result.stdout + result.stderr);
    return readGateChecks(root);
  };
  const failChecks = invoke("--fail");
  assert.deepEqual(
    failChecks.map((check) => check.checkId),
    ["git diff --check"],
    "a failing verdict records only the whitespace check",
  );
  assert.ok(
    failChecks.every((check) => check.executed && check.exitCode === 0),
  );
  assert.deepEqual(
    runs(),
    ["build"],
    "the package wrapper builds but never spawns the suite gate on failure",
  );
  const completion = await requireLifecycleEvidence(
    root,
    "verification-result",
    "pass",
    "WO-999",
  );
  assert.equal(
    completion.productGate,
    undefined,
    "completion does not require a product gate",
  );
  const fullChecks = invoke();
  assert.deepEqual(
    [...new Set(fullChecks.map((check) => check.checkId))].sort(),
    ["git diff --check", "npm test"],
    "an absent verdict explicitly runs the product gate",
  );
  assert.ok(
    fullChecks.every((check) => check.executed && check.exitCode === 0),
  );
  assert.deepEqual(runs(), ["build", "build", "test"]);
});

test("WO-132 harness evidence reuses product results across document edits and invalidates source edits", async (t) => {
  const root = repo(t, { runtime: true });
  emitHarness(root);
  beginHarnessSession(root, "fixture", "executor");
  write(
    root,
    "package.json",
    json({ type: "module", scripts: { test: "node .runtime/check.mjs" } }),
  );
  write(
    root,
    ".runtime/check.mjs",
    "import { appendFileSync } from 'node:fs'; appendFileSync('.runtime/runs.txt', 'test\\n');\n",
  );
  const count = () =>
    readFileSync(join(root, ".runtime/runs.txt"), "utf8").trim().split("\n");
  const initial = runHarnessEvidence(root);
  assert.deepEqual(
    initial.map((row) => row.checkId),
    ["npm test", "git diff --check"],
  );
  assert.equal(initial[0].codeIdentity, gateCodeIdentity(root));
  assert.deepEqual(count(), ["test"]);
  write(root, "docs/receipt.md", "Documentation changed after measurement.\n");
  const reused = runHarnessEvidence(root);
  assert.deepEqual(reused[0], initial[0]);
  assert.deepEqual(
    findGateCheck(root, "npm test", gateTreeHash(root)),
    initial[0],
    "the shared lookup matches product identity independently of the requested tree",
  );
  assert.notEqual(reused[1].treeHash, initial[1].treeHash);
  const review = await requireLifecycleEvidence(
    root,
    "final-review-result",
    "pass",
    "WO-999",
  );
  assert.equal(review.productGate.codeIdentity, initial[0].codeIdentity);
  assert.ok(
    !review.advisories.some((message) =>
      /No passing product gate/.test(message),
    ),
  );
  assert.deepEqual(count(), ["test"]);
  const facts = [];
  await evaluateHarnessHook(
    config(root, "finish"),
    input(root, "Stop"),
    root,
    (policy, fact, effect) => {
      facts.push(fact);
      return feedbackBoundary(policy, fact, effect);
    },
  );
  assert.deepEqual(
    facts.find((fact) => fact.kind === "application-evidence").requiredChecks,
    ["npm test", "git diff --check"],
  );
  write(root, "docs/receipt.md", "New document bytes.\n");
  recordGateChecks(root, [
    { ...initial[0], exitCode: 1, recordedAt: new Date().toISOString() },
    { ...initial[0], executed: false, recordedAt: new Date().toISOString() },
  ]);
  assert.deepEqual(
    runHarnessEvidence(root)[0],
    initial[0],
    "failed or unexecuted later observations do not erase a successful result",
  );
  assert.deepEqual(count(), ["test"]);
  write(root, "changed-source.js", "export const changed = true;\n");
  git(root, "add", "changed-source.js");
  const changed = runHarnessEvidence(root);
  assert.notEqual(changed[0].codeIdentity, initial[0].codeIdentity);
  assert.equal(changed[0].codeIdentity, gateCodeIdentity(root));
  assert.deepEqual(count(), ["test", "test"]);
});

test("concurrent observers publish readable session state and persistent damage is named", async (t) => {
  const root = repo(t, { runtime: true });
  emitHarness(root);
  beginHarnessSession(root, "concurrent-state", "executor");
  const saved = state(root, "concurrent-state");
  saved.beforeOutputs = Object.fromEntries(
    Array.from({ length: 400 }, (_, index) => [
      `inherited-${index}.txt`,
      "a".repeat(64),
    ]),
  );
  writeFileSync(statePath(root, "concurrent-state"), json(saved));
  const read = input(root, "PostToolUse", "concurrent-state", {
    tool_name: "Read",
    tool_input: { file_path: join(root, "CLAUDE.md") },
    tool_response: {
      file: {
        content: readFileSync(join(root, "CLAUDE.md"), "utf8"),
        startLine: 1,
        numLines: 2,
      },
    },
  });
  const worker = join(root, ".runtime/session-race.mjs");
  writeFileSync(
    worker,
    `
    import { readFileSync } from 'node:fs';
    const [root, policyText, inputText] = process.argv.slice(2);
    const policy = JSON.parse(policyText), input = JSON.parse(inputText);
    const runtime = root + '/' + policy.runtime.snapshot;
    const { evaluateHarnessHook } = await import(runtime + '/packages/skeleton/dist/src/harness-host.js');
    const { feedbackBoundary } = await import(runtime + '/packages/skeleton/dist/src/feedback-boundary.js');
    for (let round = 0; round < 100; round++) {
      const response = await evaluateHarnessHook(policy, input, root, feedbackBoundary);
      if (response.decision === 'block' || response.hookSpecificOutput?.permissionDecision === 'deny')
        throw new Error(JSON.stringify(response));
    }
    process.stdout.write('100');
  `,
  );
  const counts = await Promise.all(
    [
      "read-observer",
      "write-observer",
      "no-lint-type-disables-as-fixes",
      "no-lint-type-disables-as-fixes",
    ].map(
      (name) =>
        new Promise((done, fail) => {
          const policy = config(root, name);
          const child = spawn(
            process.execPath,
            [
              worker,
              root,
              JSON.stringify(policy),
              JSON.stringify({ ...read, hook_event_name: policy.event }),
            ],
            {
              cwd: root,
              stdio: ["ignore", "pipe", "pipe"],
            },
          );
          let out = "",
            err = "";
          child.stdout.on("data", (chunk) => {
            out += chunk;
          });
          child.stderr.on("data", (chunk) => {
            err += chunk;
          });
          child.on("error", fail);
          child.on("exit", (code) =>
            code
              ? fail(new Error(err || `hook worker exited ${code}`))
              : done(Number(out)),
          );
        }),
    ),
  );
  assert.equal(
    counts.reduce((sum, count) => sum + count, 0),
    400,
  );
  assert.equal(state(root, "concurrent-state").role, "executor");
  assert.ok(
    !readdirSync(join(root, "docs/control/local/harness")).some((name) =>
      name.endsWith(".tmp"),
    ),
  );
  writeFileSync(statePath(root, "concurrent-state"), "{");
  const failed = spawnSync(
    process.execPath,
    [".claude/hooks/permissions.mjs"],
    {
      cwd: root,
      input: json({ ...read, hook_event_name: "PreToolUse" }),
      encoding: "utf8",
    },
  );
  assert.equal(failed.status, 0, failed.stderr);
  assert.match(
    JSON.parse(failed.stdout).systemMessage,
    /session state unreadable/,
  );
  assert.equal(readFileSync(statePath(root, "concurrent-state"), "utf8"), "{");
});

test("closeout preview and copy preserve collisions, harness state, terms and every intake byte", (t) => {
  const from = repo(t),
    main = repo(t);
  write(from, "docs/control/local/harness/session.json", "subject state");
  write(main, "docs/control/local/harness/session.json", "main state");
  write(main, "docs/control/local/terms.txt", "fixture-only-term\n");
  write(from, "docs/intake/notes/same.md", "same\n");
  write(main, "docs/intake/notes/same.md", "same\n");
  write(from, "docs/intake/notes/new.md", "new\0bytes\n");
  write(from, "docs/intake/notes/collision.md", "subject\n");
  write(main, "docs/intake/notes/collision.md", "main\n");
  const before = [snapshot(from), snapshot(main)];
  const preview = reconcileIntake(from, main, "WO-999", { dryRun: true });
  assert.deepEqual([snapshot(from), snapshot(main)], before);
  assert.equal(preview.files.length, 3);
  const applied = reconcileIntake(from, main, "WO-999");
  assert.deepEqual(snapshot(from), before[0]);
  for (const row of applied.files)
    assert.deepEqual(
      readFileSync(join(from, row.source)),
      readFileSync(join(main, row.destination)),
    );
  assert.equal(
    readFileSync(join(main, "docs/intake/notes/collision.md"), "utf8"),
    "main\n",
  );
  assert.equal(
    readFileSync(
      join(main, "docs/intake/notes/collision.md.from-WO-999"),
      "utf8",
    ),
    "subject\n",
  );
  assert.equal(
    readFileSync(join(main, "docs/control/local/terms.txt"), "utf8"),
    "fixture-only-term\n",
  );
  assert.deepEqual(
    reconcileIntake(from, main, "WO-999").files.map((row) => row.disposition),
    ["identical", "identical", "identical"],
  );
  assert.equal(
    classifyIgnoredMaterial("docs/control/local/harness/a").disposable,
    true,
  );
  assert.equal(
    classifyIgnoredMaterial("docs/control/local/terms.txt").disposable,
    false,
  );
  assert.equal(
    classifyIgnoredMaterial("docs/control/local/terms.txt")
      .releaseEvidenceAllowed,
    true,
  );
  symlinkSync(
    join(main, "docs/intake/notes"),
    join(from, "docs/intake/escape"),
  );
  assert.throws(() => reconcileIntake(from, main, "WO-999"), /symlink|regular/);
});

test("WO-044 closeout classifies nested repositories: empty scaffolding is discarded, content is preserved as a unit, and every blocker names its lane and remedy", (t) => {
  const from = repo(t),
    main = repo(t),
    local = "docs/control/local";
  const mount = `${local}/feedback/verifier/mount`;
  mkdirSync(join(from, mount), { recursive: true });
  git(join(from, mount), "init", "-q");
  const kept = `${local}/prototypes/repo`;
  mkdirSync(join(from, kept), { recursive: true });
  git(join(from, kept), "init", "-q");
  write(from, `${kept}/file.txt`, "kept nested content\n");
  const author = [
    "-c",
    "user.name=Fixture",
    "-c",
    "user.email=f@example.invalid",
  ];
  git(join(from, kept), ...author, "add", "file.txt");
  git(join(from, kept), ...author, "commit", "-qm", "kept");
  write(from, `${local}/terms.txt`, "subject terms\n");
  const preview = reconcileWorktreeMaterial(from, main, "WO-999", {
    dryRun: true,
  });
  assert.deepEqual(
    preview.nestedRepositories.map((row) => [row.source, row.disposition]),
    [
      [mount, "empty-scaffolding"],
      [kept, "preserved-unit"],
    ],
  );
  const sources = preview.files.map((row) => row.source);
  assert.ok(sources.includes(`${kept}/.git/HEAD`));
  assert.ok(sources.includes(`${kept}/file.txt`));
  assert.ok(!sources.some((path) => path.startsWith(mount)));
  const rendered = renderIntakeReconciliation(preview);
  assert.match(
    rendered,
    /nested repository discarded as empty fixture scaffolding/,
  );
  assert.match(rendered, /nested repository preserved as a directory unit/);
  const applied = reconcileWorktreeMaterial(from, main, "WO-999");
  verifyPreservedMaterial(from, main, applied);
  const archive = `${local}/retained/WO-999`;
  assert.equal(
    readFileSync(join(main, archive, "prototypes/repo/file.txt"), "utf8"),
    "kept nested content\n",
  );
  assert.ok(existsSync(join(main, archive, "prototypes/repo/.git/HEAD")));
  assert.equal(existsSync(join(main, archive, "feedback")), false);
  const scaffolding = describeIgnoredMaterial(from, `${mount}/`);
  assert.equal(scaffolding.disposable, true);
  assert.match(scaffolding.classification, /empty nested repository/);
  const unit = describeIgnoredMaterial(from, `${kept}/`);
  assert.equal(unit.disposable, false);
  assert.match(unit.remedy, /preserved as a directory unit/);
  const env = describeIgnoredMaterial(from, ".env");
  assert.equal(env.lane, "other");
  assert.match(env.remedy, /operator terminal/);
  assert.doesNotMatch(env.remedy, /backup:intake/);
  assert.match(
    describeIgnoredMaterial(from, "docs/intake/raw.md").remedy,
    /npm run backup:intake/,
  );
  assert.match(
    describeIgnoredMaterial(from, ".claude/settings.local.json").remedy,
    /never deleted/,
  );
  assert.equal(
    describeIgnoredMaterial(from, "docs/intake/scratch/").disposable,
    false,
    "intake protection outranks scaffolding detection",
  );
});

test("WO-044 VER-001 preserves unborn repositories with refs, staged-only bytes, dangling objects or unreadable metadata", async (t) => {
  const { removeMountScaffolding } =
    await import("../packages/skeleton/dist/src/feedback-selfhost.js");
  for (const kind of ["refs", "index", "objects", "broken-head"]) {
    const from = repo(t),
      main = repo(t);
    const path = `docs/control/local/prototypes/${kind}`;
    const nested = join(from, path);
    mkdirSync(nested, { recursive: true });
    git(nested, "init", "-q");
    if (kind === "refs") {
      git(
        nested,
        "-c",
        "user.name=Fixture",
        "-c",
        "user.email=f@example.invalid",
        "commit",
        "--allow-empty",
        "-qm",
        "saved",
      );
      git(nested, "symbolic-ref", "HEAD", "refs/heads/unborn");
    } else if (kind === "index" || kind === "objects") {
      write(nested, "valuable.txt", "saved fixture bytes\n");
      git(nested, "add", "valuable.txt");
      if (kind === "objects") git(nested, "rm", "--cached", "valuable.txt");
      rmSync(join(nested, "valuable.txt"));
    } else write(nested, ".git/HEAD", "broken\n");
    assert.equal(inspectNestedRepository(from, path + "/").empty, false, kind);
    assert.equal(
      describeIgnoredMaterial(from, path + "/").disposable,
      false,
      kind,
    );
    if (kind === "broken-head")
      assert.match(
        describeIgnoredMaterial(from, path + "/").classification,
        /commit state unknown/,
      );
    const receipt = reconcileWorktreeMaterial(from, main, "WO-999");
    verifyPreservedMaterial(from, main, receipt);
    if (kind !== "broken-head")
      assert.equal(receipt.nestedRepositories[0].disposition, "preserved-unit");
    assert.ok(receipt.files.length > 0);
    if (kind === "index")
      assert.equal(
        git(
          join(main, "docs/control/local/retained/WO-999/prototypes", kind),
          "show",
          ":valuable.txt",
        ),
        "saved fixture bytes",
      );
    removeMountScaffolding(nested);
    assert.ok(existsSync(nested), `feedback mount preserves ${kind}`);
  }
});

test("WO-044 VER-001 registration leases exclude teardown while allowing recovery contenders", async (t) => {
  const {
    withWriterRegistration,
    withWriterReservationLock,
    writerTeardownBlocker,
  } = await import("../packages/skeleton/src/writer-teardown.mjs");
  const root = repo(t);
  withWriterReservationLock(root, () => {
    assert.throws(
      () => seedHarnessWriter(root, { actorId: "contender", worktree: root }),
      (error) => {
        assert.match(error.message, /registration or teardown/);
        assert.ok(error.message.includes("dotln-writer-transition-"));
        return true;
      },
    );
  });
  assert.equal(harnessWriterView(root).reserved, false);
  withWriterRegistration(root, () => {
    withWriterRegistration(root, () => {
      assert.throws(
        () =>
          withWriterReservationLock(root, () => assert.fail("teardown ran")),
        /writer registration in progress/,
      );
    });
  });
  seedHarnessWriter(root, {
    actorId: "writer",
    worktree: root,
    owner: { pid: process.pid, source: "parent" },
  });
  assert.equal(harnessWriterView(root).alive, true);
  assert.match(writerTeardownBlocker(root), /writer reservation/);
});

test("closeout archives retained control files and nested directories without changing active main state", (t) => {
  const from = repo(t),
    main = repo(t);
  const local = "docs/control/local",
    archive = `${local}/retained/WO-999`;
  const retained = [
    "adjacent-work.jsonl",
    "feedback-one/nested/evidence.bin",
    "feedback-two/result.json",
    "feedback-three/record.txt",
    "process/measurements.json",
    "prototypes/nested/source.txt",
    "terms.txt",
  ];
  for (const path of retained)
    write(from, `${local}/${path}`, Buffer.from([0, 255, 13, 10, 1]));
  mkdirSync(join(from, local, "prototypes/empty"), { recursive: true });
  write(from, `${local}/harness/state.json`, "disposable subject session");
  write(main, `${local}/adjacent-work.jsonl`, "active main queue\n");
  write(main, `${local}/terms.txt`, "active main terms\n");
  write(main, `${local}/harness/state.json`, "active main session\n");
  const before = [snapshot(from), snapshot(main)];
  const preview = reconcileWorktreeMaterial(from, main, "WO-999", {
    dryRun: true,
  });
  assert.deepEqual([snapshot(from), snapshot(main)], before);
  assert.equal(
    existsSync(join(main, archive)),
    false,
    "dry run must not create even empty archive directories",
  );
  assert.equal(preview.files.length, retained.length);
  assert.ok(
    preview.directories.some(
      (row) => row.source === `${local}/prototypes/empty`,
    ),
  );
  const rendered = renderIntakeReconciliation(preview);
  assert.ok(
    !/[a-f0-9]{64}/.test(JSON.stringify(preview)),
    "receipt objects must not expose private content digests",
  );
  for (const path of retained)
    assert.ok(rendered.includes(`${archive}/${path}`));
  assert.ok(!rendered.includes("disposable subject session"));
  assert.ok(!rendered.includes("active main terms"));
  assert.ok(
    !/[a-f0-9]{64}/.test(rendered),
    "receipts must not print private content digests",
  );
  const applied = reconcileWorktreeMaterial(from, main, "WO-999");
  assert.deepEqual(snapshot(from), before[0]);
  for (const [path, hash] of Object.entries(before[1]))
    assert.equal(snapshot(main)[path], hash);
  for (const path of retained)
    assert.deepEqual(
      readFileSync(join(main, archive, path)),
      readFileSync(join(from, local, path)),
    );
  assert.ok(existsSync(join(main, archive, "prototypes/empty")));
  assert.equal(existsSync(join(main, archive, "harness")), false);
  verifyPreservedMaterial(from, main, applied);
  assert.equal(
    git(main, "status", "--porcelain"),
    "",
    "no retained records enter Git",
  );
});

test("closeout archive collisions and partial-copy retries retain both versions and verify bytes", (t) => {
  const from = repo(t),
    main = repo(t),
    local = "docs/control/local";
  const archive = `${local}/retained/WO-999`;
  write(from, `${local}/a.bin`, "new-a\0\n");
  write(from, `${local}/b.bin`, "new-b\0\n");
  write(from, `${local}/nested/file.txt`, "nested bytes\n");
  write(main, `${archive}/a.bin`, "existing-a\n");
  write(main, `${archive}/a.bin.from-WO-999`, "earlier archive\n");
  write(main, `${archive}/nested`, "existing file at directory path\n");
  mkdirSync(join(main, archive, "b.bin"), { recursive: true });
  let copied = 0;
  assert.throws(
    () =>
      reconcileWorktreeMaterial(from, main, "WO-999", {
        copyFile(source, destination, flags) {
          if (++copied === 2) {
            writeFileSync(destination, "partial bytes");
            throw new Error("injected copy failure");
          }
          copyFileSync(source, destination, flags);
        },
      }),
    /injected copy failure/,
  );
  assert.equal(readFileSync(join(from, local, "b.bin"), "utf8"), "new-b\0\n");
  const retry = reconcileWorktreeMaterial(from, main, "WO-999");
  verifyPreservedMaterial(from, main, retry);
  assert.equal(
    readFileSync(join(main, archive, "a.bin"), "utf8"),
    "existing-a\n",
  );
  assert.equal(
    readFileSync(join(main, archive, "a.bin.from-WO-999"), "utf8"),
    "earlier archive\n",
  );
  assert.equal(
    readFileSync(join(main, archive, "b.bin.from-WO-999"), "utf8"),
    "partial bytes",
  );
  assert.equal(
    readFileSync(join(main, archive, "nested"), "utf8"),
    "existing file at directory path\n",
  );
  assert.equal(
    readFileSync(join(main, archive, "nested.from-WO-999/file.txt"), "utf8"),
    "nested bytes\n",
  );
  const preserved = snapshot(main);
  assert.ok(
    reconcileWorktreeMaterial(from, main, "WO-999").files.every(
      (row) => row.disposition === "identical",
    ),
  );
  assert.deepEqual(snapshot(main), preserved);
  write(main, retry.files[0].destination, "corrupt preserved bytes");
  assert.throws(() => verifyPreservedMaterial(from, main, retry), /byte proof/);
  const repaired = reconcileWorktreeMaterial(from, main, "WO-999");
  write(from, `${local}/new-after-copy.txt`, "late arrival");
  assert.throws(
    () => verifyPreservedMaterial(from, main, repaired),
    /changed during preservation/,
  );
});

test("closeout refuses source and destination symlinks and unignored archive paths before any copy", (t) => {
  for (const escape of [
    "source-file",
    "source-directory",
    "destination-directory",
    "destination-file",
    "dangling-destination",
  ]) {
    const from = repo(t),
      main = repo(t),
      outside = repo(t);
    write(from, "docs/control/local/a.txt", "source bytes\n");
    write(outside, "outside.txt", "outside sentinel\n");
    const archive = "docs/control/local/retained/WO-999";
    mkdirSync(join(main, archive), { recursive: true });
    if (escape === "source-file")
      symlinkSync(
        join(outside, "outside.txt"),
        join(from, "docs/control/local/z.txt"),
      );
    if (escape === "source-directory")
      symlinkSync(outside, join(from, "docs/control/local/z"));
    if (escape === "destination-directory")
      symlinkSync(outside, join(main, archive, "z"));
    if (escape === "destination-directory")
      write(from, "docs/control/local/z/new.txt", "nested source");
    if (escape === "destination-file")
      symlinkSync(join(outside, "outside.txt"), join(main, archive, "a.txt"));
    if (escape === "dangling-destination")
      symlinkSync(join(outside, "missing.txt"), join(main, archive, "a.txt"));
    const before = [snapshot(from), snapshot(main), snapshot(outside)];
    for (const dryRun of [true, false])
      assert.throws(
        () => reconcileWorktreeMaterial(from, main, "WO-999", { dryRun }),
        /symlink/,
      );
    assert.deepEqual(
      [snapshot(from), snapshot(main), snapshot(outside)],
      before,
    );
  }
  const from = repo(t),
    main = repo(t);
  write(from, "docs/control/local/a.txt", "protected bytes");
  write(main, ".gitignore", "docs/intake/\n");
  const before = snapshot(main);
  assert.throws(
    () => reconcileWorktreeMaterial(from, main, "WO-999"),
    /ignored|check-ignore/,
  );
  assert.deepEqual(snapshot(main), before);
  const literalSource = repo(t),
    literalMain = repo(t);
  const literalPath = "docs/control/local/retained/WO-999/literal[1].txt";
  write(literalSource, "docs/control/local/literal[1].txt", "same bytes");
  write(literalMain, literalPath, "same bytes");
  git(literalMain, "--literal-pathspecs", "add", "--force", "--", literalPath);
  git(literalMain, "commit", "-qm", "Tracked archive collision fixture");
  assert.throws(
    () => reconcileWorktreeMaterial(literalSource, literalMain, "WO-999"),
    /tracked in main/,
  );
});

test("budgets keep unselected caps unset and cold-start measurement ignores product prose", (t) => {
  const root = repo(t);
  write(
    root,
    "docs/control/budgets.json",
    readFileSync(join(source, "docs/control/budgets.json")),
  );
  for (const profile of [".agents", ".claude"])
    for (const role of [
      "executor",
      "verifier",
      "reviewer",
      "release-close",
      "planner",
      "refuter",
    ])
      write(root, `${profile}/skills/dotln-${role}/SKILL.md`, "Brief rule\n");
  const budgets = readBudgets(root);
  assert.equal(
    budgetVerdict(budgets, "executor.tokens", 999999999, null),
    "unset",
  );
  const before = measureColdStarts(root);
  write(
    root,
    "docs/product/03-architecture.md",
    "Unrelated product prose\n".repeat(1000),
  );
  assert.deepEqual(measureColdStarts(root), before);
  const warnings = [];
  const previousWarn = console.warn;
  try {
    console.warn = (message) => warnings.push(String(message));
    assert.doesNotThrow(() =>
      requireBudgets([
        {
          metric: "sequenceBytes",
          value: 8193,
          ceiling: 8192,
          verdict: "breach",
        },
        {
          metric: "executor.tokens",
          value: null,
          ceiling: null,
          verdict: "unset",
        },
      ]),
    );
    requireBudgets([
      {
        metric: "sequenceBytes",
        value: 8192,
        ceiling: 8192,
        verdict: "within",
      },
    ]);
  } finally {
    console.warn = previousWarn;
  }
  assert.deepEqual(warnings, [
    "Advisory: process budget exceeded: sequenceBytes=8193 > 8192",
  ]);
  budgets.acceptances.push({
    date: "2026-09-09",
    metric: "sequenceBytes",
    ceiling: 9000,
    dispatch: "synthetic fixture",
    reason: "fixture",
  });
  assert.equal(budgetVerdict(budgets, "sequenceBytes", 8193, 8192), "accepted");
});

test("WO-132 meta counts tasks from the latest successful aggregate and preserves legacy observations", async (t) => {
  const root = repo(t);
  const workOrder = "WO-999";
  write(
    root,
    `docs/evidence/${workOrder}/meta.json`,
    json({ orders: [{ workOrder, metrics: { gateStepCount: 82 } }] }),
  );
  const gate = {
    workOrder,
    checkId: "npm test",
    treeHash: "1".repeat(40),
    recordedAt: "2026-09-15T12:00:00.000Z",
    executed: true,
    exitCode: 0,
    durationMs: 1000,
  };
  const count = async (rows) => {
    write(root, "docs/control/local/harness/checks.json", json(rows));
    return (await collectMeta(root)).orders.find(
      (row) => row.workOrder === workOrder,
    ).metrics.gateStepCount;
  };
  assert.equal(
    await count([]),
    82,
    "a historical snapshot remains the fallback",
  );
  const successful = { ...gate, freshSuites: 19 };
  assert.equal(
    await count([
      successful,
      {
        ...gate,
        recordedAt: "2026-09-15T12:01:00.000Z",
        freshSuites: 2,
        exitCode: 1,
      },
      {
        ...gate,
        recordedAt: "2026-09-15T12:02:00.000Z",
        freshSuites: 1,
        executed: false,
      },
      {
        ...gate,
        workOrder: "WO-998",
        recordedAt: "2026-09-15T12:03:00.000Z",
        freshSuites: 3,
      },
    ]),
    19,
    "failed, unexecuted and other-order runs do not replace the latest successful count",
  );
  assert.equal(
    await count([
      {
        ...gate,
        taskTimeline: [
          { executed: true },
          { executed: false },
          { executed: true },
        ],
      },
    ]),
    2,
    "timeline fallback counts only executed tasks",
  );
  assert.equal(
    await count([
      { ...gate, checkId: "npm run test:full" },
      { ...gate, checkId: "suite:first" },
      { ...gate, checkId: "suite:second" },
      {
        ...gate,
        checkId: "suite:other-run",
        recordedAt: "2026-09-14T12:00:00.000Z",
      },
    ]),
    2,
    "legacy counts stay bound to the successful aggregate timestamp",
  );
  assert.equal(
    await count([{ ...gate, freshSuites: 7, reusedSuites: 75 }]),
    82,
    "historical reuse remains part of that gate's observed task coverage",
  );
  assert.equal(
    await count([{ ...gate, freshSuites: 0 }]),
    0,
    "an observed zero does not become the old snapshot",
  );
  write(
    root,
    `docs/evidence/${workOrder}/meta.json`,
    json({ orders: [{ workOrder, metrics: {} }] }),
  );
  assert.equal(
    await count([]),
    null,
    "absent task observations remain unknown",
  );
});

test("WO-132 cost reconciliation reads wrapped authority through collection and printed shortfalls", async (t) => {
  const root = repo(t);
  const workOrder = "WO-999";
  const path = "docs/work-orders/WO-999-fixture.md";
  const segment = join(root, "docs/control/orders/WO-999.jsonl");
  writeFileSync(
    segment,
    readFileSync(segment, "utf8") +
      [
        { type: "ImplementationReady" },
        { type: "VerificationRequested", verificationId: "VER-001" },
        {
          type: "VerificationCompleted",
          verificationId: "VER-001",
          verdict: "pass",
        },
        { type: "FinalReviewRequested", finalReviewId: "FINAL-001" },
        {
          type: "FinalReviewCompleted",
          finalReviewId: "FINAL-001",
          verdict: "pass",
        },
      ]
        .map((event) =>
          JSON.stringify({
            schemaVersion: 1,
            workOrderId: workOrder,
            ...event,
          }),
        )
        .join("\n") +
      "\n",
  );
  const measured = {
    workOrder,
    checkId: "npm test",
    treeHash: "1".repeat(40),
    recordedAt: "2026-09-15T11:59:00.000Z",
    durationMs: 150_000,
    exitCode: 0,
    executed: true,
    evidenceRef: "fixture:wrapped-cost-product-gate",
    executionMode: "fresh",
  };
  write(root, "docs/control/local/harness/checks.json", json([measured]));
  const wrapped =
    "adds fixture setup;\nremoves repeated checks, bringing the fresh product gate under 2.5 minutes.";
  for (const ending of [
    "\n\nUnrelated paragraph.",
    "\n**Depends on:** unrelated field.",
    "",
  ]) {
    write(root, path, `# WO-999\n\n**Cost:** ${wrapped}${ending}`);
    const meta = await collectMeta(root);
    const row = meta.costReconciliation.find(
      (entry) => entry.workOrder === workOrder,
    );
    assert.equal(row.promisedRemoval, wrapped.replace("\n", " "));
    assert.equal(row.ceilingMs, 150_000);
    assert.equal(row.outcome, "shortfall");
    assert.equal(row.observedRows[0].evidenceRef, measured.evidenceRef);
    const printed = renderMeta(meta)
      .split("\n")
      .find((line) => line.startsWith(`${workOrder}: promised removal:`));
    assert.ok(printed.includes(row.promisedRemoval));
    assert.ok(printed.includes(measured.evidenceRef));
    assert.match(printed, /PLANNING INPUT/);
    assert.ok(!printed.includes("Unrelated") && !printed.includes("unrelated"));
  }
  const authority = readFileSync(
    join(source, "docs/work-orders/WO-126-process-debt.md"),
    "utf8",
  );
  const costParagraph = authority
    .slice(authority.indexOf("**Cost:**"), authority.indexOf("**Depends on:**"))
    .trim();
  assert.ok(costParagraph.includes("\n") && costParagraph.includes("removes"));
  write(root, path, authority);
  const historical = (await collectMeta(root)).costReconciliation.find(
    (entry) => entry.workOrder === workOrder,
  );
  assert.equal(
    historical.promisedRemoval,
    costParagraph.slice("**Cost:**".length).replace(/\s+/g, " ").trim(),
  );
  assert.equal(
    historical.outcome,
    "unknown",
    "an estimate is not an explicit ceiling",
  );
  write(
    root,
    path,
    "# WO-999\n\n**Cost:**\n**Depends on:** unrelated field.\n",
  );
  assert.equal(
    (await collectMeta(root)).costReconciliation[0].promisedRemoval,
    "unknown",
  );
});

test("WO-132 cost reconciliation keeps missing measurements unknown and makes measured shortfalls planning input", () => {
  const workOrder = "WO-999";
  const observedAt = "2026-09-15T12:00:00.000Z";
  const cost =
    "Bring the fresh product gate under 2.5 minutes by removing redundant checks.";
  const measured = {
    workOrder,
    checkId: "npm test",
    recordedAt: "2026-09-15T11:59:00.000Z",
    durationMs: 149_999,
    exitCode: 0,
    executed: true,
    evidenceRef: "fixture:measured-product-gate",
    executionMode: "fresh",
    output: "Unneeded fixture diagnostic",
  };
  const absent = reconcileCost(workOrder, cost, [], observedAt);
  assert.equal(absent.promisedRemoval, cost);
  assert.equal(absent.observedAt, observedAt);
  assert.equal(absent.ceilingMs, 150_000);
  assert.equal(absent.outcome, "unknown");
  assert.equal(absent.planningInput, null);
  assert.deepEqual(absent.observedRows, []);
  for (const durationMs of [undefined, null, NaN, Infinity, -1, "1000"]) {
    const unavailable = reconcileCost(
      workOrder,
      cost,
      [{ ...measured, durationMs }],
      observedAt,
    );
    assert.equal(
      unavailable.outcome,
      "unknown",
      `invalid duration ${durationMs}`,
    );
    assert.equal(unavailable.planningInput, null);
    assert.equal(
      unavailable.observedRows.length,
      1,
      "retain the observation without treating it as a measurement",
    );
  }
  assert.equal(
    reconcileCost(workOrder, cost, [{ ...measured, durationMs: 0 }], observedAt)
      .outcome,
    "met",
    "an observed zero is valid",
  );
  const met = reconcileCost(
    workOrder,
    cost,
    [
      measured,
      { ...measured, workOrder: "WO-998", durationMs: 300_000 },
      { ...measured, checkId: "git diff --check", durationMs: 300_000 },
      { ...measured, executed: false, durationMs: 300_000 },
    ],
    observedAt,
  );
  assert.equal(met.outcome, "met");
  assert.equal(met.planningInput, null);
  assert.equal(met.observedRows.length, 1);
  assert.equal(met.observedRows[0].evidenceRef, measured.evidenceRef);
  assert.ok(!JSON.stringify(met).includes(measured.output));
  const shortfall = reconcileCost(
    workOrder,
    cost,
    [{ ...measured, durationMs: 150_000 }],
    observedAt,
  );
  assert.equal(
    shortfall.outcome,
    "shortfall",
    "an under target is not met at the boundary",
  );
  assert.match(
    shortfall.planningInput,
    /Measured fresh gate.*promised limit.*planning/,
  );
  assert.equal(shortfall.observedRows[0].durationMs, 150_000);
  const seconds = reconcileCost(
    workOrder,
    "Keep fresh wall-clock below 25 seconds.",
    [],
    observedAt,
  );
  assert.equal(seconds.ceilingMs, 25_000);
  assert.equal(seconds.outcome, "unknown");
  const ambiguous = reconcileCost(
    workOrder,
    "Reduce repeated process overhead.",
    [measured],
    observedAt,
  );
  assert.equal(ambiguous.ceilingMs, null);
  assert.equal(ambiguous.outcome, "unknown");
  assert.equal(ambiguous.planningInput, null);
  assert.equal(
    reconcileCost(workOrder, cost, [{ ...measured, exitCode: 1 }], observedAt)
      .outcome,
    "unknown",
  );
});

test("usage projections collect known counters without transcript text, estimates or invented costs", () => {
  const observed = usageObservation([
    {
      type: "result",
      subtype: "success",
      total_cost_usd: 0.2,
      usage: {
        input_tokens: 10,
        cache_read_input_tokens: 30,
        cache_creation_input_tokens: 5,
        output_tokens: 2,
      },
      result: "PRIVATE_TEXT_SENTINEL",
    },
  ]);
  assert.equal(observed.usage.totalTokens, 47);
  assert.equal(observed.usage.costUsd, 0.2);
  assert.ok(!JSON.stringify(observed).includes("PRIVATE_TEXT_SENTINEL"));
  const rows = [
    {
      type: "event_msg",
      timestamp: "2026-09-09T01:00:00Z",
      payload: {
        type: "token_count",
        info: {
          total_token_usage: {
            input_tokens: 100,
            output_tokens: 10,
            total_tokens: 110,
          },
        },
      },
    },
    {
      type: "event_msg",
      timestamp: "2026-09-09T01:01:00Z",
      payload: {
        type: "token_count",
        info: {
          total_token_usage: {
            input_tokens: 400,
            output_tokens: 30,
            total_tokens: 430,
          },
          last_token_usage: {
            input_tokens: 200,
            output_tokens: 10,
            total_tokens: 210,
          },
          model_context_window: 1000,
        },
      },
    },
  ];
  const delta = usageObservation(rows, { since: "2026-09-09T01:00:30Z" });
  assert.equal(delta.scope, "dispatch");
  assert.equal(delta.usage.totalTokens, 320);
  assert.equal(delta.usage.costUsd, null);
  assert.equal(delta.context.capacityTokens, 1000);
  assert.equal(
    usageObservation([{ text: "no usage" }]).usage.totalTokens,
    null,
  );
  const activity = usageObservation([
    {
      type: "response_item",
      payload: {
        type: "function_call",
        name: "exec_command",
        call_id: "private-dedup-only",
        arguments: "PRIVATE_TEXT_SENTINEL",
      },
    },
  ]);
  assert.equal(activity.activity.stepCount, 1);
  assert.equal(activity.activity.commandsRun, 1);
  assert.ok(!JSON.stringify(activity).includes("PRIVATE_TEXT_SENTINEL"));
  assert.ok(!JSON.stringify(activity).includes("private-dedup-only"));
});

test("meter diff bytes include newly authored untracked source", (t) => {
  const root = repo(t);
  const before = codeDiffBytes(root);
  write(root, "scripts/new.mjs", "export const observed = true;\n");
  const after = codeDiffBytes(root);
  assert.ok(after > before);
  git(root, "add", "scripts/new.mjs");
  assert.ok(
    codeDiffBytes(root) > before,
    "staging source must not lose the measurement",
  );
});

test("WO-145 optional economy support preserves historical snapshots through WO-157 and changes only executor instructions on", () => {
  const historical = JSON.parse(
    readFileSync(
      join(source, "packages/skeleton/fixtures/wo145-role-baseline.json"),
      "utf8",
    ),
  );
  // Authorized role edits get a separate oracle; never rewrite a historical
  // snapshot to make the current generated instruction check pass. WO-149's
  // common role edits affect both settings, so pin contemporaneous default and
  // opt-out bytes separately and preserve the complete historical chain.
  // WO-157's shared role edits follow the same route.
  const baseline = JSON.parse(
    readFileSync(
      join(source, "packages/skeleton/fixtures/wo157-role-baseline.json"),
      "utf8",
    ),
  );
  for (let snapshot = baseline; snapshot.historicalBaseline;) {
    const previousBytes = readFileSync(
      join(source, "packages/skeleton/fixtures", snapshot.historicalBaseline),
    );
    if (snapshot.historicalSha256)
      assert.equal(
        createHash("sha256").update(previousBytes).digest("hex"),
        snapshot.historicalSha256,
        `${snapshot.historicalBaseline} remains byte-exact`,
      );
    snapshot = JSON.parse(previousBytes);
  }
  const on = harnessInstallation();
  const explicitOn = harnessInstallation({
    supports: { "tinkerer-economy": true },
  });
  const off = harnessInstallation({
    supports: { "tinkerer-economy": false },
  });
  const withoutOrigin = (text) => text.replace(/^<!-- Origin: .* -->\n/m, "");
  const roles = on.files.filter((file) => file.path.endsWith("/SKILL.md"));
  assert.equal(roles.length, Object.keys(baseline.roles).length);
  assert.equal(roles.length, Object.keys(baseline.optOutRoles).length);
  for (const file of roles) {
    const released = execFileSync(
      "git",
      ["show", `${historical.release}:${file.path}`],
      { cwd: source },
    );
    assert.equal(
      createHash("sha256").update(released).digest("hex"),
      historical.roles[file.path],
    );
    assert.equal(
      createHash("sha256").update(file.contents).digest("hex"),
      baseline.roles[file.path],
      file.path,
    );
    assert.equal(
      explicitOn.files.find((row) => row.path === file.path).contents,
      file.contents,
    );
    // Shared role edits belong to both settings; only the economy support is
    // removed, not later authorized Codex entry or verifier instructions.
    const optedOut = off.files.find((row) => row.path === file.path);
    assert.equal(
      createHash("sha256").update(optedOut.contents).digest("hex"),
      baseline.optOutRoles[file.path],
      file.path,
    );
    const twin = on.files.find(
      (row) =>
        row.path ===
        (file.path.startsWith(".claude/skills/")
          ? file.path.replace(".claude/skills/", ".agents/skills/")
          : file.path.replace(".agents/skills/", ".claude/skills/")),
    );
    assert.equal(twin.contents, file.contents, `${file.path} both roots`);
    if (file.path.endsWith("dotln-executor/SKILL.md")) {
      assert.match(file.contents, /Tinkerer — Economy: Before implementation/);
      assert.match(
        file.contents,
        /at most 900 s including preparation and recording/,
      );
      assert.match(file.contents, /decline with a reason/);
      assert.match(file.contents, /do not start a second one/);
      assert.equal(file.contents.split("Tinkerer — Economy:").length - 1, 1);
      assert.ok(!optedOut.contents.includes("Tinkerer — Economy:"));
      assert.equal(
        withoutOrigin(file.contents)
          .split("\n")
          .filter((line) => !line.startsWith("Tinkerer — Economy:"))
          .join("\n"),
        withoutOrigin(optedOut.contents),
        "opt-out removes only the executor economy paragraph",
      );
    } else {
      // Origin identifies the whole equipped loadout in the existing compiler;
      // changing equipment must change that hash even for untouched role prose.
      assert.equal(
        withoutOrigin(optedOut.contents),
        withoutOrigin(file.contents),
        file.path,
      );
      assert.notEqual(optedOut.contents, file.contents, file.path);
    }
  }
  for (const [index, bundle] of on.bundles.entries()) {
    const manifest = bundle.manifest;
    assert.ok(JSON.stringify(manifest).includes("tinkerer-economy"));
    assert.ok(
      !JSON.stringify(off.bundles[index].manifest).includes("tinkerer-economy"),
    );
    const executor = bundle.files.find((file) =>
      file.path.endsWith("dotln-executor/SKILL.md"),
    );
    assert.ok(executor.origin.ids.includes("tinkerer-economy"));
  }
});

test("WO-145 experiment decisions retain measured costs, signed effects and unknowns and refuse unsupported evidence", (t) => {
  const root = repo(t);
  const record = {
    id: "WO-999-D001",
    kind: "experiment",
    date: "2026-09-20",
    dispatch: "Synthetic executor trial",
    decision: "Keep the current method",
    evidence: ["fixture"],
    rejected: [],
    reopenWhen: "A cheaper method preserves the outcome",
    question: "Does the alternative save time?",
    alternatives: ["current", "alternative"],
    observation: "Same passing checks and a shorter duration",
    budget: { wallSeconds: 900 },
    execution: "run",
    cost: {
      wallSeconds: 2,
      tokens: null,
      commands: ["node fixture.mjs"],
      source: "fixture elapsed timer",
    },
    effect: {
      wallSecondsPerOrder: -1,
      tokensPerOrder: null,
      commands: ["node fixture.mjs"],
      summary: "Alternative was slower",
    },
    outcome: "kept-current",
    regression: true,
    history: { lastAdoptedImprovementAt: null, experimentsSinceAdoption: null },
  };
  const save = (value) =>
    write(
      root,
      "docs/evidence/WO-999/decisions.md",
      "# Experiment\n\n```json\n" + json(value) + "```\n",
    );
  for (const outcome of ["adopted", "kept-current", "inconclusive"]) {
    save({ ...record, outcome });
    assert.equal(readDecisions(root)[0].outcome, outcome);
    writeDecisionsIndex(root);
    writeDecisionsIndex(root, { check: true });
  }
  save({
    ...record,
    execution: "declined",
    reason: "No worthwhile in-scope alternative",
  });
  assert.equal(readDecisions(root)[0].execution, "declined");
  for (const change of [
    { question: "" },
    { alternatives: ["current"] },
    { observation: "" },
    { outcome: "success" },
    { execution: "declined" },
    { execution: "declined", reason: "expensive", outcome: "adopted" },
    { budget: { wallSeconds: 901 } },
    { budget: { wallSeconds: 0 } },
    { cost: undefined },
    { cost: { ...record.cost, wallSeconds: null } },
    { cost: { ...record.cost, wallSeconds: -1 } },
    { cost: { ...record.cost, wallSeconds: 901 } },
    { cost: { ...record.cost, tokens: "unknown" } },
    { cost: { ...record.cost, commands: [] } },
    { cost: { ...record.cost, source: "" } },
    { effect: undefined },
    { effect: { ...record.effect, commands: [] } },
    { effect: { ...record.effect, commands: [" "] } },
    { effect: { ...record.effect, summary: "" } },
    { effect: { ...record.effect, tokensPerOrder: "unknown" } },
    { history: undefined },
    { regression: undefined },
    { history: { ...record.history, experimentsSinceAdoption: -1 } },
  ]) {
    save({ ...record, ...change });
    assert.throws(
      () => readDecisions(root),
      /experiment/,
      JSON.stringify(change),
    );
  }
  save({ ...record, reopenWhen: null });
  assert.throws(() => readDecisions(root), /reopening condition/);
});

test("decisions require dispatch and reopening source, substitute inherited ledger duties and surface worsening traps", (t) => {
  const root = repo(t),
    ledger = "# Existing operator ideas\nOriginal bytes\n";
  write(root, "docs/lineage/idea-ledger.md", ledger);
  const record = {
    id: "WO-999-D001",
    date: "2026-09-09",
    dispatch: "Operator's synthetic repair",
    decision: "Bounded repair",
    evidence: ["fixture"],
    rejected: [],
    reopenWhen: { metric: "tokens", operator: ">", value: 100, consecutive: 3 },
  };
  const save = (value) =>
    write(
      root,
      "docs/evidence/WO-999/decisions.md",
      "# Repair decision\n\n```json\n" + json(value) + "```\n",
    );
  save({ ...record, dispatch: "" });
  assert.throws(() => readDecisions(root), /dispatch source/);
  save({ ...record, reopenWhen: null });
  assert.throws(() => readDecisions(root), /reopening condition/);
  save(record);
  writeDecisionsIndex(root);
  assert.match(
    readFileSync(join(root, "docs/lineage/decisions-index.md"), "utf8"),
    /decisions\.md#repair-decision/,
  );
  writeDecisionsIndex(root, { check: true });
  assert.equal(
    inheritedLedgerDuty(
      "**Acceptance criteria**\n1. Add a ledger entry.\n**Non-goals:** Elsewhere.",
    ),
    true,
  );
  assert.equal(
    readFileSync(join(root, "docs/lineage/idea-ledger.md"), "utf8"),
    ledger,
  );
  const increasing = [1, 2, 3, 4].map((value, i) => ({
    workOrder: `WO-00${i}`,
    metrics: {
      readAmplification: value,
      machineryShare: value,
      operatorCorrections: value,
      coldStartBytes: value,
      guardRefusals: value,
    },
  }));
  assert.ok(trapRows(increasing).every((row) => row.reopenCandidate));
  assert.ok(trapRows(increasing.slice(1)).every((row) => !row.reopenCandidate));
});

const dispose = (root, entry, status, targets = []) =>
  disposeFollowup(root, {
    expectedRevision: planningFollowups(root).revision,
    id: entry.id,
    sourceRevision: entry.revisions.length,
    status,
    reason: "Synthetic reviewed disposition with explicit coverage",
    reopenWhen:
      status === "open" ? null : "Changed evidence or operator direction",
    targets,
  });

test("follow-ups retain changed, removed and overlapping public sources without importing local prose", (t) => {
  const root = repo(t);
  const path = "docs/product/candidates.md";
  write(
    root,
    path,
    "# Product\n\n## Candidate — Durable item\nPublic first scope.\n\n```md\n## Candidate — Example only\n```\n",
  );
  write(
    root,
    "docs/planning/work-order-map.md",
    "# Map\n\n## Preserved unallocated candidates\n\n- **Durable item.**\n  Same idea, separate source.\n- **Another item.** Remains open.\n",
  );
  write(root, "docs/intake/private.md", "## Candidate — PRIVATE-CANARY\n");
  write(root, "docs/control/local/future.md", "## Candidate — LOCAL-CANARY\n");
  write(
    root,
    "docs/product/guide.md",
    "# Retained planning follow-ups\nProcedure, not a nomination.\n",
  );
  assert.equal(collectFollowupSources(root).length, 3);
  let state = syncFollowups(root);
  assert.doesNotMatch(json(state), /CANARY/);
  assert.ok(
    state.entries.every(
      (row) => !row.revisions[0].title.includes("Example only"),
    ),
  );
  const entry = state.entries.find((row) => row.key.includes(path));
  dispose(root, entry, "deferred");
  assert.equal(planningFollowups(root).pending, 3);
  assert.equal(planningFollowups(root).rows[0].id, entry.id);
  git(root, "add", ".");
  git(root, "commit", "-qm", "fixture follow-ups");
  write(
    root,
    path,
    "# Product\n\n## Candidate — Durable item\nExpanded scope.\n",
  );
  assert.throws(() => syncFollowups(root, { check: true }), /stale/);
  state = syncFollowups(root);
  const changed = state.entries.find((row) => row.id === entry.id);
  assert.equal(changed.revisions.length, 2);
  assert.equal(followupStatus(changed), "needs-review");
  assert.equal(changed.dispositions.length, 1);
  write(root, path, "# Product without candidate\n");
  state = syncFollowups(root);
  const missing = state.entries.find((row) => row.id === entry.id);
  assert.equal(missing.revisions.at(-1).missing, true);
  assert.match(missing.revisions.at(-1).summary, /Expanded scope/);
  assert.equal(state.entries.length, 3);
  syncFollowups(root, { check: true });
  const valid = readFileSync(join(root, FOLLOWUPS), "utf8");
  write(root, FOLLOWUPS, json({ ...state, entries: state.entries.slice(1) }));
  assert.throws(() => readFollowups(root), /identity|history/);
  write(root, FOLLOWUPS, valid);
  state.entries.find((row) => row.id === entry.id).dispositions[0].reason =
    "Rewritten history";
  write(root, FOLLOWUPS, json(state));
  assert.throws(() => readFollowups(root), /history/);
  write(root, FOLLOWUPS, valid);
  const link = join(root, "docs/product/link.md");
  symlinkSync(join(root, "docs/intake/private.md"), link);
  assert.throws(() => collectFollowupSources(root), /symbolic link/);
});

test("only named actions and observed reopenings enter the decision feed; history and heading links survive", (t) => {
  const root = repo(t);
  const base = {
    id: "WO-999-D001",
    date: "2026-09-19",
    dispatch: "Synthetic operator source",
    decision: "Keep the current behavior",
    evidence: ["fixture evidence"],
    rejected: [],
    reopenWhen: "The fixture observation occurs",
  };
  const path = "docs/evidence/WO-999/decisions.md";
  const save = (records) =>
    write(
      root,
      path,
      "# Decisions\n\n" +
        records
          .map(
            (record) =>
              `## ${record.id} — Full title\n\n\`\`\`json\n${json(record)}\`\`\`\n`,
          )
          .join("\n"),
    );
  save([base]);
  assert.equal(
    syncFollowups(root).entries.length,
    0,
    "ordinary decisions are records, not actions",
  );
  const historical = {
    schemaVersion: 1,
    entries: [
      {
        id: "FUP-0001",
        kind: "decision",
        key: `decision:${path}#wo-999-d001`,
        revisions: [
          {
            hash: "0".repeat(64),
            ref: `${path}#wo-999-d001`,
            title: "Historical",
            summary: "Historical decision",
            missing: false,
          },
        ],
        dispositions: [],
      },
    ],
  };
  write(root, FOLLOWUPS, json(historical));
  git(root, "add", ".");
  git(root, "commit", "-qm", "retain historical decision");
  const bytes = readFileSync(join(root, FOLLOWUPS), "utf8");
  syncFollowups(root);
  assert.equal(readFileSync(join(root, FOLLOWUPS), "utf8"), bytes);
  assert.equal(
    planningFollowups(root).rows[0].source,
    `${path}#wo-999-d001--full-title`,
  );
  const action = {
    ...base,
    id: "WO-999-D002",
    followup: "Add the missing fixture",
  };
  save([base, action]);
  let state = syncFollowups(root);
  assert.equal(state.entries.length, 2);
  assert.deepEqual(state.entries[0], historical.entries[0]);
  assert.equal(
    state.entries[1].revisions[0].ref,
    `${path}#wo-999-d002--full-title`,
  );
  const observation = {
    ...base,
    id: "WO-999-D003",
    reopens: {
      decisionId: base.id,
      observation: "The recorded fixture observation occurred",
    },
  };
  save([base, action, observation]);
  state = syncFollowups(root);
  assert.equal(
    state.entries.length,
    2,
    "the observing record does not create a second nomination",
  );
  assert.equal(state.entries[0].revisions.length, 2);
  assert.deepEqual(
    state.entries[0].revisions[0],
    historical.entries[0].revisions[0],
  );
  assert.match(
    state.entries[0].revisions[1].summary,
    /recorded fixture observation occurred/,
  );
  assert.equal(readDecisions(root).length, 3);
  writeDecisionsIndex(root);
  writeDecisionsIndex(root, { check: true });
  assert.match(
    readFileSync(join(root, "docs/lineage/decisions-index.md"), "utf8"),
    /#wo-999-d003--full-title/,
  );
  const duplicate = { ...base, id: "WO-999-D004" };
  write(
    root,
    path,
    readFileSync(join(root, path), "utf8") +
      `\n## WO-999-D003 — Full title\n\n\`\`\`json\n${json(duplicate)}\`\`\`\n`,
  );
  assert.equal(readDecisions(root).at(-1).anchor, "wo-999-d003--full-title-1");
  writeDecisionsIndex(root);
  writeDecisionsIndex(root, { check: true });
  write(root, path, `\`\`\`json\n${json(base)}\`\`\`\n`);
  writeDecisionsIndex(root);
  assert.throws(
    () => writeDecisionsIndex(root, { check: true }),
    /fragment does not resolve/,
  );
});

test("follow-up dispositions refuse stale updates, absent allocation targets and duplicate cycles", (t) => {
  const root = repo(t);
  write(
    root,
    "docs/product/ideas.md",
    "## Candidate — First\nScope one.\n\n## Candidate — Second\nScope two.\n",
  );
  const [first, second] = syncFollowups(root).entries;
  const revision = planningFollowups(root).revision;
  dispose(root, first, "deferred");
  assert.throws(
    () =>
      disposeFollowup(root, {
        expectedRevision: revision,
        id: first.id,
        sourceRevision: 1,
        status: "open",
        reason: "Stale",
        reopenWhen: null,
        targets: [],
      }),
    /stale register/,
  );
  assert.throws(
    () => dispose(root, first, "allocated", ["WO-888"]),
    /no filed work order/,
  );
  write(root, "docs/work-orders/WO-888-fixture.md", "# Filed target\n");
  dispose(root, first, "allocated", ["WO-888"]);
  assert.equal(planningFollowups(root).pending, 1);
  rmSync(join(root, "docs/work-orders/WO-888-fixture.md"));
  assert.throws(() => planningFollowups(root), /no filed work order/);
  write(root, "docs/work-orders/WO-888-fixture.md", "# Filed target\n");
  dispose(root, second, "duplicate", [first.id]);
  assert.equal(planningFollowups(root).pending, 0);
  assert.throws(() => dispose(root, first, "duplicate", [second.id]), /cycle/);
  assert.equal(planningFollowups(root, { all: true }).rows.length, 2);
  const state = readFollowups(root);
  assert.equal(state.entries[0].dispositions.length, 2);
  assert.match(state.entries[0].dispositions[0].reason, /explicit coverage/);
});

test("follow-up planning entry pages reach every pending record within the byte budget", async (t) => {
  const root = repo(t);
  const body = Array.from(
    { length: 41 },
    (_, index) =>
      `## Candidate — ${index} ${"目".repeat(150)}\nPublic scope ${index}.`,
  ).join("\n\n");
  write(root, "docs/product/candidates.md", body);
  await assert.rejects(planMain(["check"], root), /register is stale/);
  syncFollowups(root);
  const before = snapshot(root);
  let page = planningFollowups(root),
    seen = [];
  do {
    assert.ok(Buffer.byteLength(json(page)) <= 8192);
    seen.push(...page.rows.map((row) => row.id));
    if (!page.next) break;
    const cursor = page.next.split(" --cursor ")[1];
    page = await planMain(["followups", "--cursor", cursor], root);
  } while (true);
  assert.equal(new Set(seen).size, 41);
  assert.equal(seen.length, 41);
  assert.deepEqual(snapshot(root), before, "paging is read-only");
  const oldCursor = planningFollowups(root).next.split(" --cursor ")[1];
  dispose(root, readFollowups(root).entries[0], "settled");
  assert.throws(() => planningFollowups(root, { cursor: oldCursor }), /stale/);
  git(root, "add", ".");
  git(root, "commit", "-qm", "fixture feed");
  git(root, "branch", "-m", "main");
  const started = await planMain(["start", "followups"], root);
  assert.equal(started.followups.pending, 40);
  assert.ok(started.followups.next);
  assert.equal(started.authority, "document-only planning dispatch");
});

test("follow-up handoffs require a live public destination without copying local adjacent text", (t) => {
  const root = repo(t),
    wo = "WO-999";
  const apply = (action) =>
    applyAdjacentCommand(root, wo, {
      expectedRevision: readAdjacentQueue(root, wo).revision,
      actor: "executor",
      action,
    });
  const item = apply({
    kind: "queue",
    item: {
      summary: "LOCAL-CANARY",
      cause: "Synthetic local diagnosis",
      fix: "Publicly synthesize an appropriate future candidate",
      paths: ["docs/product/ideas.md"],
      checks: ["fixture check"],
      priority: 0,
    },
  }).items[0];
  apply({
    kind: "dispose",
    itemId: item.id,
    itemRevision: item.revision,
    status: "deferred",
    reason: "Later planning",
    target: "Next planning pass",
  });
  assert.throws(() => requirePlanningHandoffs(root, wo), /public FUP/);
  write(
    root,
    "docs/product/ideas.md",
    "## Candidate — Public follow-up\nReviewed public synthesis.\n",
  );
  const entry = syncFollowups(root).entries[0];
  apply({
    kind: "dispose",
    itemId: item.id,
    itemRevision: item.revision,
    status: "deferred",
    reason: "Later planning",
    target: entry.id,
  });
  assert.deepEqual(requirePlanningHandoffs(root, wo), [
    { item: item.id, followup: entry.id },
  ]);
  assert.doesNotMatch(
    readFileSync(join(root, FOLLOWUPS), "utf8"),
    /LOCAL-CANARY/,
  );
  dispose(root, entry, "declined");
  assert.throws(() => requirePlanningHandoffs(root, wo), /public FUP/);
});

test("follow-up identities survive independent discovery order in sibling worktrees", (t) => {
  const first = repo(t),
    second = repo(t);
  const path = "docs/product/ideas.md";
  write(first, path, "## Candidate — First\nFirst source.\n");
  write(second, path, "## Candidate — Second\nSecond source.\n");
  const a = syncFollowups(first).entries[0],
    b = syncFollowups(second).entries[0];
  assert.notEqual(a.id, b.id);
  const both =
    "## Candidate — First\nFirst source.\n\n## Candidate — Second\nSecond source.\n";
  write(first, path, both);
  write(second, path, both);
  const identities = (root) =>
    syncFollowups(root)
      .entries.map((entry) => [entry.key, entry.id])
      .sort();
  assert.deepEqual(identities(first), identities(second));
});

test("Node-only staged builds keep installed hooks executable throughout publication", async (t) => {
  const root = repo(t, { runtime: true });
  for (const name of ["compiler", "kernel", "skeleton", "console"]) {
    for (const dir of ["src", "test"])
      if (existsSync(join(source, `packages/${name}/${dir}`)))
        cpSync(
          join(source, `packages/${name}/${dir}`),
          join(root, `packages/${name}/${dir}`),
          { recursive: true },
        );
    for (const file of ["package.json", "tsconfig.json"])
      cpSync(
        join(source, `packages/${name}/${file}`),
        join(root, `packages/${name}/${file}`),
      );
  }
  cpSync(join(source, "tsconfig.json"), join(root, "tsconfig.json"));
  mkdirSync(join(root, "scripts"), { recursive: true });
  for (const dependency of readdirSync(join(source, "node_modules")))
    if (![".bin", "@dotln", "typescript"].includes(dependency))
      symlinkSync(
        join(source, "node_modules", dependency),
        join(root, "node_modules", dependency),
      );
  emitHarness(root);
  const payload = input(root, "PreToolUse", "atomic", {
    tool_name: "Read",
    tool_input: { file_path: join(root, "own.txt") },
  });
  const probe = () => {
    const run = spawnSync(
      process.execPath,
      [join(root, ".claude/hooks/permissions.mjs")],
      {
        cwd: root,
        input: JSON.stringify(payload),
        encoding: "utf8",
        timeout: 10000,
      },
    );
    assert.equal(run.status, 0, run.stderr);
    const response = JSON.parse(run.stdout);
    assert.ok(
      response.hookSpecificOutput?.permissionDecision !== "deny",
      JSON.stringify(response),
    );
  };
  const progress = join(root, ".runtime/hook-observations.jsonl"),
    stop = join(root, ".runtime/stop-probe");
  const child = spawn(
    process.execPath,
    [
      "--input-type=module",
      "-e",
      `import{spawnSync}from'node:child_process';import{appendFileSync,existsSync}from'node:fs';while(!existsSync(process.argv[2])){const r=spawnSync(process.execPath,[process.argv[3]],{cwd:process.argv[4],input:process.argv[5],encoding:'utf8'});appendFileSync(process.argv[1],JSON.stringify({status:r.status,out:r.stdout})+'\\n');}`,
      progress,
      stop,
      join(root, ".claude/hooks/permissions.mjs"),
      root,
      JSON.stringify(payload),
    ],
    { stdio: "ignore" },
  );
  const complete = new Promise((done, fail) => {
    child.on("error", fail);
    child.on("exit", (code) =>
      code ? fail(new Error(`probe exited ${code}`)) : done(),
    );
  });
  const stages = [];
  const priorPath = process.env.PATH;
  try {
    // Compilation invokes the absolute Node executable and TypeScript module;
    // no Python, shell, compiler or other PATH prerequisite can satisfy this run.
    process.env.PATH = "/var/empty";
    atomicBuild(root, (stage) => {
      stages.push(stage);
      process.env.PATH = priorPath;
      probe();
      process.env.PATH = "/var/empty";
    });
  } finally {
    process.env.PATH = priorPath;
    writeFileSync(stop, "stop");
  }
  await complete;
  const observations = readFileSync(progress, "utf8")
    .trim()
    .split("\n")
    .map(JSON.parse);
  assert.ok(observations.length > 1);
  assert.ok(
    observations.every(
      (row) =>
        row.status === 0 &&
        JSON.parse(row.out).hookSpecificOutput?.permissionDecision !== "deny",
    ),
  );
  assert.deepEqual(stages, [
    "building",
    ...["compiler", "console", "kernel", "skeleton"].flatMap((name) => [
      `before:${name}`,
      `after:${name}`,
    ]),
  ]);
  probe();
});

test("dist publication replaces whole files, removes stale outputs and refuses symlinks", (t) => {
  const root = repo(t);
  const staging = join(root, "staging"),
    destination = join(root, "dist");
  write(root, "staging/src/main.js", "new complete module\n");
  write(root, "dist/src/main.js", "old complete module\n");
  write(root, "dist/src/stale.js", "stale\n");
  const observations = [];
  publishBuildTree(staging, destination, (stage) =>
    observations.push([
      stage,
      readFileSync(join(destination, "src/main.js"), "utf8"),
    ]),
  );
  assert.deepEqual(observations, [
    ["before", "old complete module\n"],
    ["after", "new complete module\n"],
  ]);
  assert.equal(existsSync(join(destination, "src/stale.js")), false);
  write(root, "staging/src/main.js", "later complete module\n");
  symlinkSync(join(root, "own.txt"), join(destination, "escape.js"));
  assert.throws(() => publishBuildTree(staging, destination), /symlink/);
  assert.equal(
    readFileSync(join(destination, "src/main.js"), "utf8"),
    "new complete module\n",
  );
});

test("strict token collectors reject unavailable sources while usage observations can record unknown counters", async (t) => {
  const root = repo(t);
  const codexDirectory = join(root, ".runtime/codex"),
    claudeDirectory = join(root, ".runtime/claude");
  const since = "2026-09-11T10:00:30Z";
  const codex = (id, cwd = root) => [
    {
      type: "session_meta",
      timestamp: "2026-09-11T10:00:00Z",
      payload: { id, cwd },
    },
    {
      type: "event_msg",
      timestamp: "2026-09-11T10:00:00Z",
      payload: {
        type: "token_count",
        info: {
          total_token_usage: {
            input_tokens: 100,
            cached_input_tokens: 80,
            output_tokens: 10,
            total_tokens: 110,
          },
        },
      },
    },
    {
      type: "event_msg",
      timestamp: "2026-09-11T10:01:00Z",
      payload: {
        type: "token_count",
        info: {
          total_token_usage: {
            input_tokens: 500,
            cached_input_tokens: 380,
            output_tokens: 30,
            total_tokens: 530,
          },
        },
      },
    },
  ];
  const put = (path, rows) =>
    write(root, path, rows.map(JSON.stringify).join("\n") + "\n");
  put(".runtime/codex/current-codex.jsonl", codex("current-codex"));
  put(".runtime/codex/earlier-codex.jsonl", codex("earlier-codex"));
  const options = {
    codexDirectory,
    claudeDirectory,
    since,
    env: {},
    sessionKey: usageSessionKey("current-codex"),
  };
  const observed = collectSessionUsage(root, options);
  assert.equal(observed.usage.totalTokens, 420);
  assert.equal(observed.usage.cachedInputTokens, 300);
  assert.equal(observed.scope, "dispatch");
  assert.equal(observed.source, "codex-transcript-counter");
  assert.throws(
    () =>
      collectSessionUsage(root, {
        ...options,
        transcriptPath: join(codexDirectory, "earlier-codex.jsonl"),
      }),
    /exactly one transcript/,
  );
  assert.throws(
    () =>
      collectSessionUsage(root, { ...options, since: "2026-09-11T10:02:00Z" }),
    /Token measurement required/,
  );
  assert.throws(
    () => collectSessionUsage(root, { ...options, sessionKey: undefined }),
    /session identity/,
  );
  put(
    ".runtime/codex/current-codex.jsonl",
    codex("current-codex", dirname(root)),
  );
  assert.throws(
    () => collectSessionUsage(root, options),
    /exactly one transcript/,
  );
  put(".runtime/codex/current-codex.jsonl", codex("current-codex").slice(0, 1));
  assert.throws(
    () => collectSessionUsage(root, options),
    /Token measurement required/,
  );
  const unknown = usageObservation([]);
  assert.throws(
    () => requireMeasuredUsage(unknown),
    /Token measurement required/,
  );
  recordUsageObservation(root, {
    workOrder: "WO-999",
    role: "executor",
    startedAt: since,
    sessionKey: usageSessionKey("current-claude"),
    observation: unknown,
  });
  const unknownRow = JSON.parse(
    readFileSync(
      join(root, "docs/control/local/process/usage.jsonl"),
      "utf8",
    ).trim(),
  );
  assert.equal(unknownRow.observation.source, "unavailable");
  assert.equal(unknownRow.observation.usage.totalTokens, null);

  const message = (id, output, timestamp = "2026-09-11T10:01:00Z") => ({
    type: "assistant",
    timestamp,
    cwd: root,
    sessionId: "current-claude",
    message: {
      id,
      content: [{ type: "text", text: "PRIVATE_TRANSCRIPT_TEXT" }],
      usage: {
        input_tokens: 10,
        output_tokens: output,
        cache_read_input_tokens: 30,
        cache_creation_input_tokens: 5,
      },
    },
  });
  put(".runtime/claude/current-claude.jsonl", [
    message("old-message", 200, "2026-09-11T10:00:00Z"),
    message("same-message", 1),
    message("same-message", 2),
    message("second-message", 3),
  ]);
  const claude = collectSessionUsage(root, {
    ...options,
    sessionKey: usageSessionKey("current-claude"),
  });
  assert.equal(claude.usage.totalTokens, 95);
  assert.equal(claude.usage.inputTokens, 20);
  assert.equal(claude.usage.cachedInputTokens, 60);
  assert.equal(claude.usage.cacheWriteInputTokens, 10);
  assert.equal(claude.source, "claude-transcript-message-usage");
  assert.ok(!JSON.stringify(claude).includes("PRIVATE_TRANSCRIPT_TEXT"));
  assert.ok(!JSON.stringify(claude).includes("current-claude"));
  for (const total of [
    claude,
    { ...claude, usage: { ...claude.usage, totalTokens: 100 } },
  ])
    recordUsageObservation(root, {
      workOrder: "WO-999",
      role: "executor",
      startedAt: since,
      sessionKey: usageSessionKey("current-claude"),
      observation: total,
    });
  const order = (await collectMeta(root)).orders.find(
    (row) => row.workOrder === "WO-999",
  );
  assert.equal(
    order.usage.length,
    2,
    "unknown and measured source observations remain visible",
  );
  assert.equal(
    order.usage.filter((row) => row.observation.source === "unavailable")
      .length,
    1,
  );
  assert.equal(order.metrics.tokens, 100);
  assert.ok(
    !JSON.stringify(order.usage).includes(usageSessionKey("current-claude")),
  );
});

test("conversation-only questions and scope additions preserve the running lifecycle session", async (t) => {
  const root = repo(t, { runtime: true });
  emitHarness(root);
  const policy = config(root, "session");
  await evaluateHarnessHook(
    policy,
    input(root, "UserPromptSubmit", "side-question", {
      prompt: "resume: next",
    }),
    root,
    feedbackBoundary,
  );
  const before = state(root, "side-question");
  for (const prompt of [
    "conversation only: why is this check needed?",
    "scope expand: add the stated check",
  ])
    await evaluateHarnessHook(
      policy,
      input(root, "UserPromptSubmit", "side-question", { prompt }),
      root,
      feedbackBoundary,
    );
  const after = state(root, "side-question");
  for (const key of [
    "role",
    "workOrder",
    "expectedEvent",
    "startedAt",
    "startingEventCount",
  ])
    assert.equal(after[key], before[key], key);
  assert.equal(after.role, "executor");
  const transcript = join(root, ".runtime/side-question.jsonl");
  write(
    root,
    ".runtime/side-question.jsonl",
    JSON.stringify({
      type: "assistant",
      timestamp: new Date().toISOString(),
      cwd: root,
      sessionId: "side-question",
      message: {
        id: "message-one",
        usage: {
          input_tokens: 10,
          output_tokens: 5,
          cache_read_input_tokens: 20,
          cache_creation_input_tokens: 30,
        },
      },
    }) + "\n",
  );
  await evaluateHarnessHook(
    config(root, "finish"),
    input(root, "Stop", "side-question", { transcript_path: transcript }),
    root,
    feedbackBoundary,
  );
  const rows = readFileSync(
    join(root, "docs/control/local/process/usage.jsonl"),
    "utf8",
  )
    .trim()
    .split("\n")
    .map(JSON.parse);
  assert.equal(rows.at(-1).observation.usage.totalTokens, 65);
  assert.equal(
    rows.at(-1).observation.source,
    "claude-transcript-message-usage",
  );
});

test("bare executor next/fix project installed defaults and completion advises about unfinished adjacent work", async (t) => {
  const root = repo(t, { runtime: true });
  cpSync(join(source, "scripts/lib"), join(root, "scripts/lib"), {
    recursive: true,
  });
  cpSync(join(source, "scripts/resume.mjs"), join(root, "scripts/resume.mjs"));
  installBeaconFixture(root);
  write(
    root,
    "docs/work-orders/WO-999-fixture.md",
    "# WO-999 — fixture\n\n**Model:** any capable model.\n**Effort:** executor any; verifier any; reviewer any.\n\n<!-- dotln-dependencies:start -->\n[]\n<!-- dotln-dependencies:end -->\n",
  );
  const call = (...args) =>
    spawnSync(process.execPath, [join(root, "scripts/resume.mjs"), ...args], {
      cwd: root,
      encoding: "utf8",
    });
  emitHarness(root);
  const next = call("next");
  assert.equal(next.status, 0, next.stderr);
  assert.match(next.stdout, /Adjacent Repair is equipped/);
  assert.match(next.stdout, /Intent to Act is equipped.*'I intend to'/);
  // WO-150: the support is default equipment, so the briefing names it too.
  assert.match(
    next.stdout,
    /Tinkerer — Economy is equipped: before implementation/,
  );
  assert.match(next.stdout, /running none; next none/);
  const before = snapshot(root);
  const status = call("status", "--json");
  assert.equal(status.status, 0, status.stderr);
  assert.doesNotMatch(status.stdout, /Executor entry duties/);
  assert.deepEqual(snapshot(root), before, "status remains read-only");
  emitHarness(root, {
    supports: {
      "adjacent-repair": false,
      "communication-intent": false,
      "tinkerer-economy": false,
    },
  });
  const off = call("next");
  assert.equal(off.status, 0, off.stderr);
  assert.doesNotMatch(
    off.stdout,
    /Adjacent Repair is equipped|Intent to Act is equipped|Tinkerer — Economy is equipped/,
  );
  assert.match(off.stdout, /Follow-up Queue is equipped/);
  emitHarness(root);
  const apply = (action) =>
    applyAdjacentCommand(root, "WO-999", {
      expectedRevision: readAdjacentQueue(root, "WO-999").revision,
      actor: "executor",
      action,
    });
  const item = apply({
    kind: "queue",
    item: {
      summary: "Bounded adjacent fixture",
      cause: "Observed defect",
      fix: "Correct named behavior",
      paths: ["own.txt"],
      checks: ["fixture check"],
      priority: 0,
    },
  }).items[0];
  assert.match(
    call("next").stdout,
    /next adjacent-0001: Bounded adjacent fixture/,
  );
  const segment = "docs/control/orders/WO-999.jsonl";
  const events = [
    { type: "ImplementationReady" },
    {
      type: "VerificationRequested",
      verificationId: "VER-001",
      reportPath: "docs/verifications/WO-999/VER-001.md",
    },
    {
      type: "VerificationCompleted",
      verificationId: "VER-001",
      reportPath: "docs/verifications/WO-999/VER-001.md",
      verdict: "fail",
    },
  ].map((event) => ({
    schemaVersion: 1,
    workOrderId: "WO-999",
    recordedAt: "2026-09-09T00:01:00.000Z",
    ...event,
  }));
  write(
    root,
    segment,
    readFileSync(join(root, segment), "utf8") +
      events.map(JSON.stringify).join("\n") +
      "\n",
  );
  const fix = call("fix");
  assert.equal(fix.status, 0, fix.stderr);
  assert.match(fix.stdout, /Repair .*Adjacent Repair is equipped/s);
  assert.match(fix.stdout, /Intent to Act is equipped/);
  assert.match(fix.stdout, /next adjacent-0001: Bounded adjacent fixture/);
  for (const action of ["implementation-ready", "repair-complete"]) {
    const result = await requireLifecycleEvidence(
      root,
      action,
      undefined,
      "WO-999",
    );
    assert.ok(
      result.advisories.some((message) =>
        /unresolved adjacent work.*queued/.test(message),
      ),
    );
  }
  apply({
    kind: "announce",
    itemId: item.id,
    itemRevision: 1,
    level: "intent",
    statement: "I intend to fix the bounded fixture next.",
  });
  apply({
    kind: "check-in",
    channel: "message-boundary",
    observation: "Synthetic actor-attested steering boundary",
  });
  apply({ kind: "start", itemId: item.id, itemRevision: 1 });
  assert.throws(
    () => requirePlanningHandoffs(root, "WO-999"),
    /unresolved adjacent work.*running/,
  );
  apply({
    kind: "dispose",
    itemId: item.id,
    itemRevision: 1,
    status: "known-issue",
    reason: "Explicit fixture disposition",
    target: null,
  });
  assert.deepEqual(requirePlanningHandoffs(root, "WO-999"), []);
});

test("WO-149 a Codex lifecycle dispatch begins one measurable session and preserves it on repeat", async (t) => {
  const root = repo(t, { runtime: true });
  cpSync(join(source, "scripts/lib"), join(root, "scripts/lib"), {
    recursive: true,
  });
  cpSync(join(source, "scripts/resume.mjs"), join(root, "scripts/resume.mjs"));
  cpSync(
    join(source, "scripts/harness.mjs"),
    join(root, "scripts/harness.mjs"),
  );
  installBeaconFixture(root);
  write(
    root,
    "docs/work-orders/WO-999-fixture.md",
    "# WO-999 — fixture\n\n**Model:** any capable model.\n**Effort:** executor any; verifier any; reviewer any.\n\n<!-- dotln-dependencies:start -->\n[]\n<!-- dotln-dependencies:end -->\n",
  );
  const thread = "00000000-0000-0000-0000-000000000149";
  const codexHome = join(root, ".runtime/codex-home");
  const observedAt = "2030-01-01T00:00:02.000Z";
  write(
    root,
    `.runtime/codex-home/sessions/${thread}.jsonl`,
    [
      {
        type: "session_meta",
        timestamp: "2030-01-01T00:00:00.000Z",
        payload: { id: thread, cwd: root, cli_version: "0.155.1" },
      },
      {
        type: "turn_context",
        timestamp: "2030-01-01T00:00:01.000Z",
        payload: { model: "fixture-model", effort: "xhigh", cwd: root },
      },
      {
        type: "event_msg",
        timestamp: observedAt,
        payload: {
          type: "token_count",
          info: {
            total_token_usage: {
              input_tokens: 11,
              cached_input_tokens: 7,
              output_tokens: 5,
              total_tokens: 16,
            },
          },
        },
      },
    ]
      .map(JSON.stringify)
      .join("\n") + "\n",
  );
  const env = {
    ...process.env,
    CODEX_HOME: codexHome,
    CODEX_THREAD_ID: thread,
    COPILOT_AGENT_SESSION_ID: "",
  };
  const call = (dispatchEnv = env) =>
    spawnSync(process.execPath, [join(root, "scripts/resume.mjs"), "next"], {
      cwd: root,
      encoding: "utf8",
      env: dispatchEnv,
    });
  const key = usageSessionKey(thread);
  const path = join(root, `docs/control/local/harness/${key}.json`);
  const before = Date.now();
  const first = call();
  const after = Date.now();
  assert.equal(first.status, 0, first.stderr);
  const firstBytes = readFileSync(path, "utf8");
  const session = JSON.parse(firstBytes);
  assert.equal(session.role, "executor");
  assert.equal(session.workOrder, "WO-999");
  assert.equal(session.expectedEvent, "ImplementationReady");
  assert.deepEqual(session.authoredPaths, []);
  assert.ok(Date.parse(session.startedAt) >= before);
  assert.ok(Date.parse(session.startedAt) <= after);

  const second = call();
  assert.equal(second.status, 0, second.stderr);
  assert.equal(readFileSync(path, "utf8"), firstBytes);

  const prior = {
    CODEX_HOME: process.env.CODEX_HOME,
    CODEX_THREAD_ID: process.env.CODEX_THREAD_ID,
  };
  process.env.CODEX_HOME = codexHome;
  process.env.CODEX_THREAD_ID = thread;
  let usage;
  try {
    usage = measureHarnessUsage(root, thread);
  } finally {
    for (const [name, value] of Object.entries(prior)) {
      if (value === undefined) delete process.env[name];
      else process.env[name] = value;
    }
  }
  assert.equal(usage.usage.totalTokens, 16);
  assert.equal(usage.source, "codex-transcript-counter");
  assert.equal(usage.observedAt, observedAt);
  const { COST_LINE_PREFIX, judgeCostLine } =
    await import("./lib/receipt-cost.mjs");
  assert.equal(
    judgeCostLine(
      `# Fixture\n\n${COST_LINE_PREFIX} entry ${usage.usage.totalTokens} tokens; handoff ${usage.usage.totalTokens} tokens; source ${usage.source}\n`,
    ),
    null,
  );

  const recordsBefore = readdirSync(
    join(root, "docs/control/local/harness"),
  ).filter((name) => /^[a-f0-9]{64}\.json$/.test(name));
  const withoutThread = call({
    ...env,
    CODEX_THREAD_ID: "",
  });
  assert.equal(withoutThread.status, 0, withoutThread.stderr);
  const noSession = spawnSync(
    process.execPath,
    [join(root, "scripts/harness.mjs"), "usage", "absent-session"],
    { cwd: root, encoding: "utf8", env: { ...env, CODEX_THREAD_ID: "" } },
  );
  assert.equal(noSession.status, 0, noSession.stderr);
  assert.match(noSession.stderr, /unknown; cause no-session/);
  const unknown = JSON.parse(noSession.stdout);
  assert.equal(unknown.source, "unavailable");
  assert.equal(unknown.cause, "no-session");
  assert.equal(unknown.usage.totalTokens, null);
  assert.deepEqual(
    readdirSync(join(root, "docs/control/local/harness")).filter((name) =>
      /^[a-f0-9]{64}\.json$/.test(name),
    ),
    recordsBefore,
  );
  assert.equal(
    judgeCostLine(
      `# Fixture\n\n${COST_LINE_PREFIX} unknown; cause ${unknown.cause}\n`,
    ),
    null,
  );
});

test("WO-149 an unbuilt Codex dispatch reports the missing runtime without blocking the lifecycle", (t) => {
  const root = repo(t);
  cpSync(join(source, "scripts/lib"), join(root, "scripts/lib"), {
    recursive: true,
  });
  cpSync(join(source, "scripts/resume.mjs"), join(root, "scripts/resume.mjs"));
  installBeaconFixture(root);
  write(
    root,
    "docs/work-orders/WO-999-fixture.md",
    "# WO-999 — fixture\n\n**Model:** any.\n**Effort:** executor any; verifier any; reviewer any.\n",
  );
  const dispatch = (thread) =>
    spawnSync(process.execPath, [join(root, "scripts/resume.mjs"), "next"], {
      cwd: root,
      encoding: "utf8",
      env: {
        ...process.env,
        CODEX_THREAD_ID: thread,
        COPILOT_AGENT_SESSION_ID: "",
      },
    });
  const result = dispatch("unbuilt-codex-fixture");
  assert.equal(result.status, 0, result.stderr);
  assert.match(
    result.stderr,
    /Codex session entry unavailable.*runtime is not built.*npm run build.*cause no-session/,
  );
  assert.equal(existsSync(statePath(root, "unbuilt-codex-fixture")), false);
  const withoutThread = dispatch("");
  assert.equal(withoutThread.status, 0, withoutThread.stderr);
  assert.doesNotMatch(withoutThread.stderr, /Codex session entry unavailable/);
});

test("WO-153 a Codex dispatch whose session entry fails names the cause and still delivers its briefing", async (t) => {
  const root = repo(t, { runtime: true });
  cpSync(join(source, "scripts/lib"), join(root, "scripts/lib"), {
    recursive: true,
  });
  cpSync(
    join(source, "scripts/harness.mjs"),
    join(root, "scripts/harness.mjs"),
  );
  const resume = readFileSync(join(source, "scripts/resume.mjs"), "utf8");
  const table = /const codexDispatchRoles = \{[^}]*\};/;
  assert.equal(resume.match(table)?.[0].match(/: "[a-z-]+"/g)?.length, 5);
  const failures = [
    {
      // The host refuses a role outside its list before writing a record;
      // inject one through the copied dispatch table.
      script: resume.replace(table, (block) =>
        block.replace(/: "[a-z-]+"/g, ': "fixture-invalid-role"'),
      ),
      prepare: () => {},
      advisory:
        /^DotLn advisory: Codex session entry failed \(Invalid harness session\); process cost remains unknown; cause no-session\.$/m,
    },
    {
      // A partial begin (VER-001 F1): the host writes the session record, then
      // refuses an observation log that is not a regular file.
      script: resume,
      prepare: (thread) =>
        mkdirSync(statePath(root, thread).replace(/\.json$/, ".jsonl"), {
          recursive: true,
        }),
      advisory:
        /^DotLn advisory: Codex session entry failed \(Host observation log is not a regular file\); process cost remains unknown; cause no-session\.$/m,
    },
  ];
  installBeaconFixture(root);
  write(
    root,
    "docs/work-orders/WO-999-fixture.md",
    "# WO-999 — fixture\n\n**Model:** any.\n**Effort:** executor any; verifier any; reviewer any.\n\n<!-- dotln-dependencies:start -->\n[]\n<!-- dotln-dependencies:end -->\n",
  );
  const segment = "docs/control/orders/WO-999.jsonl";
  const activated = readFileSync(join(root, segment), "utf8");
  const events = (...rows) =>
    rows
      .map(
        (event) =>
          JSON.stringify({
            schemaVersion: 1,
            workOrderId: "WO-999",
            recordedAt: "2026-09-09T00:01:00.000Z",
            ...event,
          }) + "\n",
      )
      .join("");
  const ready = { type: "ImplementationReady" };
  const requested = {
    type: "VerificationRequested",
    verificationId: "VER-001",
    reportPath: "docs/verifications/WO-999/VER-001.md",
  };
  const verified = (verdict) => ({
    type: "VerificationCompleted",
    verificationId: "VER-001",
    reportPath: "docs/verifications/WO-999/VER-001.md",
    verdict,
  });
  const reviewed = [
    {
      type: "FinalReviewRequested",
      finalReviewId: "FINAL-001",
      throughVerificationId: "VER-001",
      reportPath: "docs/final-reviews/WO-999/FINAL-001.md",
    },
    {
      type: "FinalReviewCompleted",
      finalReviewId: "FINAL-001",
      verdict: "pass",
    },
  ];
  const cases = [
    {
      action: "next",
      seed: "",
      briefing: /^Execute docs\/work-orders\/WO-999-fixture\.md\.$/m,
      transition: null,
    },
    {
      action: "verify",
      seed: events(ready),
      briefing:
        /Verify docs\/work-orders\/WO-999-fixture\.md; write the immutable report to (\S+\/VER-001\.md)\./,
      transition: "VerificationRequested",
    },
    {
      action: "fix",
      seed: events(ready, requested, verified("fail")),
      briefing:
        /Repair docs\/work-orders\/WO-999-fixture\.md using docs\/verifications\/WO-999\/VER-001\.md; read both artifacts\./,
      transition: "RepairRequested",
    },
    {
      action: "final-review",
      seed: events(ready, requested, verified("pass")),
      briefing:
        /Final-review docs\/work-orders\/WO-999-fixture\.md, the complete verification sequence, and ideation receipt; write (\S+\/FINAL-001\.md)\./,
      transition: "FinalReviewRequested",
    },
    {
      action: "release-close",
      seed: events(ready, requested, verified("pass"), ...reviewed),
      briefing: /After the operator merges the PR, .* close WO-999 --publish\./,
      transition: null,
    },
  ];
  const codexHome = join(root, ".runtime/codex-home");
  mkdirSync(join(codexHome, "sessions"), { recursive: true });
  const env = {
    ...process.env,
    CODEX_HOME: codexHome,
    COPILOT_AGENT_SESSION_ID: "",
  };
  const run = (script, args, thread) =>
    spawnSync(process.execPath, [join(root, script), ...args], {
      cwd: root,
      encoding: "utf8",
      env: { ...env, CODEX_THREAD_ID: thread },
    });
  const { COST_LINE_PREFIX, judgeCostLine } =
    await import("./lib/receipt-cost.mjs");
  for (const [kind, failure] of failures.entries()) {
    write(root, "scripts/resume.mjs", failure.script);
    for (const { action, seed, briefing, transition } of cases) {
      write(root, segment, activated + seed);
      const thread = `wo153-${kind}-${action}`;
      failure.prepare(thread);
      const result = run("scripts/resume.mjs", [action], thread);
      assert.equal(result.status, 0, `${action}: ${result.stderr}`);
      const printed = result.stdout.match(briefing);
      assert.ok(printed, `${action} briefing:\n${result.stdout}`);
      assert.match(result.stderr, failure.advisory);
      const log = readFileSync(join(root, segment), "utf8");
      assert.ok(log.startsWith(activated + seed), `${action} kept its log`);
      const appended = log
        .slice((activated + seed).length)
        .split("\n")
        .filter(Boolean)
        .map((line) => JSON.parse(line));
      assert.deepEqual(
        appended.map((event) => event.type),
        transition ? [transition] : [],
      );
      if (printed[1]) assert.equal(printed[1], appended[0].reportPath);
      assert.equal(existsSync(statePath(root, thread)), false);
      const usage = run("scripts/harness.mjs", ["usage", thread], "");
      assert.equal(usage.status, 0, usage.stderr);
      assert.match(usage.stderr, /unknown; cause no-session/);
      const observed = JSON.parse(usage.stdout);
      assert.equal(observed.cause, "no-session");
      assert.equal(observed.usage.totalTokens, null);
      assert.equal(
        judgeCostLine(
          `# Fixture\n\n${COST_LINE_PREFIX} unknown; cause ${observed.cause}\n`,
        ),
        null,
      );
      if (action !== "next") continue;
      // A repeat finds no session to treat as begun and names the failure again.
      const repeat = run("scripts/resume.mjs", [action], thread);
      assert.equal(repeat.status, 0, repeat.stderr);
      assert.match(repeat.stderr, failure.advisory);
      assert.equal(existsSync(statePath(root, thread)), false);
    }
  }
  // With the obstruction gone, the withdrawn entry begins on the next dispatch.
  const partial = statePath(root, "wo153-1-next");
  rmSync(partial.replace(/\.json$/, ".jsonl"), { recursive: true });
  write(root, segment, activated);
  const retried = run("scripts/resume.mjs", ["next"], "wo153-1-next");
  assert.equal(retried.status, 0, retried.stderr);
  assert.doesNotMatch(retried.stderr, /Codex session entry/);
  assert.equal(JSON.parse(readFileSync(partial, "utf8")).role, "executor");

  // The real table: a successful begin and its repeat stay silent, and a
  // dispatch without a thread identity writes nothing.
  cpSync(join(source, "scripts/resume.mjs"), join(root, "scripts/resume.mjs"));
  write(root, segment, activated);
  const records = () =>
    readdirSync(join(root, "docs/control/local/harness")).filter((name) =>
      /^[a-f0-9]{64}\.json$/.test(name),
    );
  const begun = run("scripts/resume.mjs", ["next"], "wo153-valid");
  assert.equal(begun.status, 0, begun.stderr);
  assert.doesNotMatch(begun.stderr, /Codex session entry/);
  const bytes = readFileSync(statePath(root, "wo153-valid"), "utf8");
  assert.equal(JSON.parse(bytes).role, "executor");
  const repeat = run("scripts/resume.mjs", ["next"], "wo153-valid");
  assert.equal(repeat.status, 0, repeat.stderr);
  assert.doesNotMatch(repeat.stderr, /Codex session entry/);
  assert.equal(readFileSync(statePath(root, "wo153-valid"), "utf8"), bytes);
  const before = records();
  const threadless = run("scripts/resume.mjs", ["next"], "");
  assert.equal(threadless.status, 0, threadless.stderr);
  assert.doesNotMatch(threadless.stderr, /Codex session entry/);
  assert.deepEqual(records(), before);
});

test("WO-132 caller usage avoids a writer reservation and other main writes reserve normally", async (t) => {
  const root = repo(t, { runtime: true });
  emitHarness(root);
  git(root, "branch", "-m", "main");
  beginHarnessSession(root, "meter-session", "release-close");
  const policy = config(root, "concurrent-work-requires-worktrees");
  const invoke = (command) =>
    evaluateHarnessHook(
      policy,
      input(root, "PreToolUse", "meter-session", {
        tool_name: "Bash",
        tool_input: { command },
      }),
      root,
      feedbackBoundary,
    );
  const allowed = await invoke("node scripts/harness.mjs usage meter-session");
  assert.notEqual(allowed.hookSpecificOutput?.permissionDecision, "deny");
  assert.equal(
    existsSync(join(root, "docs/control/local/harness/writer")),
    false,
  );
  for (const command of [
    "node scripts/harness.mjs usage other-session",
    "node scripts/harness.mjs usage meter-session && touch own.txt",
    "node scripts/harness.mjs usage meter-session --extra",
  ])
    assert.notEqual(
      (await invoke(command)).hookSpecificOutput?.permissionDecision,
      "deny",
      command,
    );
  assert.equal(harnessWriterView(root).reserved, true);
  const foreign = await evaluateHarnessHook(
    policy,
    input(root, "PreToolUse", "another-main-session", {
      tool_name: "Edit",
      tool_input: { file_path: "own.txt" },
    }),
    root,
    feedbackBoundary,
  );
  assert.equal(foreign.hookSpecificOutput?.permissionDecision, "deny");
});

test("source-reconciled overlapping usage replaces aggregation without deleting observations", async (t) => {
  const root = repo(t);
  const observation = usageObservation(
    [
      {
        type: "result",
        timestamp: "2026-09-11T01:01:00Z",
        usage: {
          input_tokens: 30,
          output_tokens: 10,
          cache_read_input_tokens: 0,
          cache_creation_input_tokens: 0,
        },
      },
    ],
    { since: "2026-09-11T01:00:00Z" },
  );
  const base = { workOrder: "WO-999", role: "executor", observation };
  for (const startedAt of ["2026-09-11T01:00:00Z", "2026-09-11T01:00:02Z"])
    recordUsageObservation(root, { ...base, startedAt });
  const path = join(root, "docs/control/local/process/usage.jsonl");
  const before = readFileSync(path, "utf8");
  const refs = before
    .trim()
    .split("\n")
    .map(JSON.parse)
    .map(usageRecordIdentity);
  const replacement = {
    ...base,
    startedAt: "2026-09-11T01:00:00Z",
    sessionKey: usageSessionKey("source-verified-session"),
    supersedes: refs,
  };
  for (const wrong of [
    { supersedes: ["0".repeat(64)] },
    { role: "verifier" },
    { startedAt: "2026-09-11T01:00:01Z" },
  ])
    assert.throws(
      () => recordUsageObservation(root, { ...replacement, ...wrong }),
      /Usage reconciliation/,
    );
  assert.equal(readFileSync(path, "utf8"), before);
  recordUsageObservation(root, replacement);
  assert.ok(readFileSync(path, "utf8").startsWith(before));
  const order = (await collectMeta(root)).orders.find(
    (row) => row.workOrder === "WO-999",
  );
  assert.equal(order.metrics.tokens, 40);
  assert.equal(order.usage.length, 1);
  assert.equal(order.usage[0].supersedes, undefined);
  assert.equal(order.usage[0].sessionKey, undefined);
});

test("WO-131 operator-control precedes runtime, state, Git, gate and writer checks in every generated hook", (t) => {
  const root = repo(t, { runtime: true });
  emitHarness(root);
  const settings = JSON.parse(
    readFileSync(join(root, ".claude/settings.json"), "utf8"),
  );
  const paths = Object.entries(settings.hooks).flatMap(([event, rows]) =>
    rows.flatMap((row) =>
      row.hooks.map((hook) => ({
        event,
        path: join(
          root,
          ".claude/hooks",
          /hooks\/([^"/]+\.mjs)/.exec(hook.command)[1],
        ),
      })),
    ),
  );
  const originals = new Map(
    paths.map(({ path }) => [path, readFileSync(path, "utf8")]),
  );
  const sessionHook = paths.find(
    ({ event }) => event === "UserPromptSubmit",
  ).path;
  const preHook = paths.find(({ event }) => event === "PreToolUse").path;
  const controlLog = join(root, "docs/control/orders/WO-999.jsonl");
  const before = readFileSync(controlLog, "utf8");
  seedHarnessWriter(root, {
    actorId: createHash("sha256").update(`${root}:foreign`).digest("hex"),
    worktree: root,
    owner: { pid: process.pid, source: "parent" },
    reservedAt: new Date().toISOString(),
  });
  const writerBefore = harnessWriterView(root);
  const invoke = (path, event, session, extra = {}) => {
    const run = spawnSync(process.execPath, [path], {
      cwd: root,
      encoding: "utf8",
      timeout: 20_000,
      input: JSON.stringify(
        input(root, event, session, {
          tool_name: "Bash",
          tool_input: { command: "node arbitrary-recovery.mjs" },
          ...extra,
        }),
      ),
    });
    assert.equal(run.status, 0, run.stderr);
    return JSON.parse(run.stdout);
  };
  const accepts = (response) => {
    assert.equal(response.decision, undefined);
    assert.notEqual(response.continue, false);
    assert.notEqual(response.hookSpecificOutput?.permissionDecision, "deny");
    assert.match(response.systemMessage, /operator-control/);
  };
  for (const mode of ["analysis", "operator override"]) {
    const session = `${root}:${mode}`;
    const held = beginGateRun(root, "operator-control fixture gate");
    try {
      // Corruption includes the normal session and journal, not merely an
      // illegal lifecycle phase. Operator control cannot parse either first.
      writeFileSync(statePath(root, session), "{broken");
      writeFileSync(
        statePath(root, session).replace(/\.json$/, ".jsonl"),
        "{broken\n",
      );
      for (const failure of ["healthy-runtime", "missing-runtime", "bad-pin"]) {
        for (const [path, original] of originals)
          writeFileSync(
            path,
            failure === "missing-runtime"
              ? original.replaceAll(
                  "packages/skeleton/dist/src/",
                  "missing-runtime/",
                )
              : failure === "bad-pin"
                ? original.replace(
                    /"hash": "fnv1a64:[^"]+"/,
                    '"hash": "fnv1a64:0000000000000000"',
                  )
                : original,
          );
        accepts(
          invoke(sessionHook, "UserPromptSubmit", session, {
            prompt: `${mode}: explain and repair`,
            cwd: dirname(root),
          }),
        );
        for (const { path, event } of paths) {
          const response = invoke(path, event, session, {
            cwd: dirname(root),
            ...(event === "UserPromptSubmit"
              ? { prompt: "continue the diagnosis" }
              : {}),
          });
          // Presence observers have no governance decision or context response.
          if (/\/presence-[^/]+\.mjs$/.test(path))
            assert.deepEqual(response, {});
          else accepts(response);
        }
      }
      assert.equal(
        readFileSync(controlLog, "utf8"),
        before,
        "no lifecycle event invented",
      );
      assert.equal(
        activeGateRuns(root).length,
        1,
        "opening control preserves the existing gate",
      );
      assert.deepEqual(
        harnessWriterView(root),
        writerBefore,
        "opening control preserves the existing writer",
      );
      const other = invoke(preHook, "PreToolUse", session + ":other");
      assert.equal(other.hookSpecificOutput?.permissionDecision, undefined);
      assert.match(other.systemMessage, /pinned runtime unavailable/);
      assert.doesNotMatch(
        other.systemMessage,
        /operator-control/,
        "another session inherits no override",
      );
      writeFileSync(preHook, originals.get(preHook));
      const guarded = invoke(preHook, "PreToolUse", session + ":other");
      assert.equal(
        guarded.hookSpecificOutput?.permissionDecision,
        "deny",
        "a functioning hook retains the live-gate guard",
      );
      accepts(
        invoke(sessionHook, "UserPromptSubmit", session, {
          prompt: `${mode}: off`,
        }),
      );
      const exited = invoke(preHook, "PreToolUse", session);
      assert.equal(exited.hookSpecificOutput?.permissionDecision, undefined);
      assert.match(exited.systemMessage, /session state unreadable/);
      assert.doesNotMatch(
        exited.systemMessage,
        /operator-control/,
        "explicit exit restores ordinary advisory handling",
      );
    } finally {
      held.release();
      for (const [path, original] of originals) writeFileSync(path, original);
    }
  }
});

test("WO-132 generated release-close handoff and preview use the main writer reservation", (t) => {
  const root = repo(t, { runtime: true });
  git(root, "branch", "-m", "main");
  cpSync(join(source, "scripts/lib"), join(root, "scripts/lib"), {
    recursive: true,
  });
  copyFileSync(
    join(source, "scripts/resume.mjs"),
    join(root, "scripts/resume.mjs"),
  );
  installBeaconFixture(root);
  write(
    root,
    "docs/work-orders/WO-999-fixture.md",
    "# WO-999 — fixture (v0.2.1)\n\n**Objective:** Synthetic closeout.\n",
  );
  write(
    root,
    "scripts/release.mjs",
    "throw new Error('admission must not execute publication');\n",
  );
  const segment = join(root, "docs/control/orders/WO-999.jsonl");
  const events = [
    { type: "ImplementationReady" },
    {
      type: "VerificationRequested",
      verificationId: "VER-001",
      reportPath: "docs/verifications/WO-999/VER-001.md",
    },
    {
      type: "VerificationCompleted",
      verificationId: "VER-001",
      verdict: "pass",
    },
    {
      type: "FinalReviewRequested",
      finalReviewId: "FINAL-001",
      throughVerificationId: "VER-001",
      reportPath: "docs/final-reviews/WO-999/FINAL-001.md",
    },
    {
      type: "FinalReviewCompleted",
      finalReviewId: "FINAL-001",
      verdict: "pass",
    },
  ];
  writeFileSync(
    segment,
    readFileSync(segment, "utf8") +
      events
        .map((event) =>
          JSON.stringify({ schemaVersion: 1, workOrderId: "WO-999", ...event }),
        )
        .join("\n") +
      "\n",
  );
  emitHarness(root);
  const printed = spawnSync(
    process.execPath,
    ["scripts/resume.mjs", "release-close"],
    { cwd: root, encoding: "utf8" },
  );
  assert.equal(printed.status, 0, printed.stderr);
  const handoff = printed.stdout.match(
    /from this main checkout: (.+?)\. This narrowly/,
  )[1];
  assert.doesNotMatch(handoff, /^cd /);
  const invoke = (name, event, extra = {}) => {
    const run = spawnSync(process.execPath, [`.claude/hooks/${name}.mjs`], {
      cwd: root,
      encoding: "utf8",
      input: JSON.stringify(input(root, event, `${root}:close`, extra)),
    });
    assert.equal(run.status, 0, run.stderr);
    return JSON.parse(run.stdout);
  };
  invoke("session", "UserPromptSubmit", { prompt: "resume: release close" });
  const before = readFileSync(segment, "utf8");
  for (const command of [
    handoff,
    handoff.replace(/--publish$/, "--dry-run"),
    "npm run release -- close WO-999 --publish",
  ])
    for (const name of ["permissions", "concurrent-work-requires-worktrees"])
      assert.notEqual(
        invoke(name, "PreToolUse", {
          tool_name: "Bash",
          tool_input: { command },
        }).hookSpecificOutput?.permissionDecision,
        "deny",
        command,
      );
  const extended = invoke("concurrent-work-requires-worktrees", "PreToolUse", {
    tool_name: "Bash",
    tool_input: { command: handoff + " --force" },
  });
  assert.equal(extended.hookSpecificOutput?.permissionDecision, undefined);
  assert.equal(harnessWriterView(root).reserved, true);
  assert.equal(readFileSync(segment, "utf8"), before);
});

test("WO-131 operator-control source adapter works without Git or dependencies and retains session isolation", (t) => {
  const root = repo(t);
  // Copy only the actual dependency-free source paths; no package manifests,
  // node_modules, dist, lifecycle or generated harness is required.
  const bare = join(root, "bare");
  write(
    bare,
    "scripts/operator-control.mjs",
    readFileSync(join(source, "scripts/operator-control.mjs")),
  );
  write(
    bare,
    "packages/compiler/src/operator-control.mjs",
    readFileSync(join(source, "packages/compiler/src/operator-control.mjs")),
  );
  const session = `${root}:adapter`;
  const run = (mode, id = session) =>
    spawnSync(
      process.execPath,
      [join(bare, "scripts/operator-control.mjs"), mode, "--session", id],
      { cwd: bare, encoding: "utf8" },
    );
  for (const mode of ["analysis", "override", "off"]) {
    const result = run(mode);
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /operator-control/);
  }
  assert.match(run("status").stdout, /ordinary workflow/);
  assert.match(run("status", session + ":other").stdout, /ordinary workflow/);
  const unavailable = join(bare, "not-a-directory");
  writeFileSync(unavailable, "fixture\n");
  const failedStore = spawnSync(
    process.execPath,
    [
      join(bare, "scripts/operator-control.mjs"),
      "override",
      "--session",
      session,
    ],
    {
      cwd: bare,
      encoding: "utf8",
      env: {
        ...process.env,
        TMPDIR: unavailable,
        TMP: unavailable,
        TEMP: unavailable,
      },
    },
  );
  assert.equal(failedStore.status, 0, failedStore.stderr);
  assert.match(failedStore.stdout, /could not be read or persisted.*advisory/);
});

test("WO-131 generated prompt hook accepts missing runtime, damaged state and malformed input", (t) => {
  const root = repo(t, { runtime: true });
  emitHarness(root);
  const path = join(root, ".claude/hooks/session.mjs");
  const original = readFileSync(path, "utf8");
  const accepts = (payload, expected) => {
    const run = spawnSync(process.execPath, [path], {
      cwd: root,
      input: payload,
      encoding: "utf8",
      timeout: 20_000,
    });
    assert.equal(run.status, 0, run.stderr);
    const response = JSON.parse(run.stdout);
    assert.equal(response.decision, undefined);
    assert.equal(response.continue, undefined);
    assert.notEqual(response.hookSpecificOutput?.permissionDecision, "deny");
    assert.match(response.systemMessage, /advisory:|prompt accepted;/);
    assert.match(response.systemMessage, expected);
    assert.equal(harnessWriterView(root).reserved, false);
  };
  const payload = JSON.stringify(
    input(root, "UserPromptSubmit", "broken-prompt", {
      prompt: "resume: next",
    }),
  );
  // Exercise the generated bootstrap catch, before the host can even load.
  writeFileSync(
    path,
    original.replaceAll("packages/skeleton/dist/src/", "missing-runtime/"),
  );
  accepts(payload, /built adapter unavailable/);
  writeFileSync(path, original);
  write(
    root,
    "docs/control/local/harness/" +
      createHash("sha256").update("broken-prompt").digest("hex") +
      ".json",
    "{broken",
  );
  accepts(payload, /session state unreadable/);
  accepts("{not-json", /DOTLN_HARNESS_INPUT_REFUSED: INVALID_JSON at \$:/);
  writeFileSync(
    path,
    original.replace(
      /"hash": "fnv1a64:[^"]+"/,
      '"hash": "fnv1a64:0000000000000000"',
    ),
  );
  accepts(payload, /host facts or pinned runtime unavailable/);
});

test("WO-131 bootstrap works without dependencies and stops before a launch handoff when preparation fails", (t) => {
  const root = repo(t);
  write(root, ".claude/harness-manifest.json", "{}\n");
  const calls = [];
  const run = (command, args, options) => {
    assert.equal(options.cwd, root);
    calls.push([command, ...args]);
    return { status: 0, stdout: root + "\n" };
  };
  assert.equal(bootstrapWorktree(root, run), 3);
  assert.deepEqual(calls, [
    ["git", "rev-parse", "--show-toplevel"],
    ["npm", "ci", "--ignore-scripts", "--no-audit", "--no-fund"],
    ["npm", "run", "build", "--silent"],
    [process.execPath, "scripts/harness.mjs", "emit"],
  ]);
  calls.length = 0;
  assert.throws(
    () =>
      bootstrapWorktree(root, (command, args, options) => {
        const result = run(command, args, options);
        return command === "npm" ? { status: 1 } : result;
      }),
    /checkout is preserved.*Retry node scripts\/bootstrap.mjs/,
  );
  assert.equal(calls.length, 2);
});

test("WO-132 missing bootstrap runtime delegates every pre-tool hook to host permissions", (t) => {
  const root = repo(t, { runtime: true });
  emitHarness(root);
  const settings = JSON.parse(
    readFileSync(join(root, ".claude/settings.json"), "utf8"),
  );
  const hooks = settings.hooks.PreToolUse.flatMap((entry) => entry.hooks);
  let invocation = 0;
  for (const hook of hooks) {
    const name = /hooks\/([^"/]+\.mjs)/.exec(hook.command)[1];
    const path = join(root, ".claude/hooks", name);
    const original = readFileSync(path, "utf8");
    for (const broken of [
      original.replaceAll("packages/skeleton/dist/src/", "missing-runtime/"),
      original.replace(
        /"hash": "fnv1a64:[^"]+"/,
        '"hash": "fnv1a64:0000000000000000"',
      ),
    ]) {
      writeFileSync(path, broken);
      for (const [tool_name, tool_input] of [
        ["Read", { file_path: "CLAUDE.md" }],
        ["Bash", { command: "node scripts/bootstrap.mjs" }],
        ["exec_command", { cmd: "node scripts/bootstrap.mjs", workdir: root }],
        ["Bash", { command: "node scripts/bootstrap.mjs && git push" }],
        ["Bash", { command: "node scripts/bootstrap.mjs", cwd: dirname(root) }],
        ["Edit", { file_path: "fixture.ts" }],
        // Joined commands and unknown syntax also delegate to the host.
        ["Bash", { command: "pwd && git status --short" }],
        [
          "Bash",
          {
            command:
              "node scripts/bootstrap.mjs; git rev-parse --show-toplevel",
          },
        ],
        ["Bash", { command: "pwd && ls" }],
        ["Bash", { command: "pwd | cat" }],
        ["Bash", { command: "pwd;" }],
      ]) {
        const run = spawnSync(process.execPath, [path], {
          cwd: root,
          encoding: "utf8",
          timeout: 20_000,
          input: JSON.stringify(
            input(root, "PreToolUse", `bootstrap-session-${++invocation}`, {
              tool_name,
              tool_input,
            }),
          ),
        });
        assert.equal(run.status, 0, run.stderr);
        const response = JSON.parse(run.stdout);
        assert.equal(
          response.hookSpecificOutput?.permissionDecision !== "deny",
          true,
          `${name}: ${JSON.stringify(tool_input)}`,
        );
        if (name.startsWith("presence-")) {
          assert.deepEqual(response, {});
          continue;
        }
        assert.match(response.systemMessage, /advisory:/, name);
        assert.match(
          response.systemMessage,
          /node scripts\/bootstrap\.mjs/,
          name,
        );
        assert.match(response.systemMessage, /host permissions decide/, name);
      }
    }
    writeFileSync(path, original);
  }
});

test("WO-131 prompt submission records legal dispatches and accepts illegal or unbriefed requests with context", async (t) => {
  const root = repo(t, { runtime: true });
  // A lifecycle stub with legal actions: status reports them, fix and verify
  // record their transitions, and anything else refuses as the real command does.
  write(
    root,
    "scripts/resume.mjs",
    `import { appendFileSync, readFileSync, writeFileSync } from "node:fs";
const statePath = "docs/control/local/lifecycle-stub.json";
const state = JSON.parse(readFileSync(statePath, "utf8"));
const legal = { "needs-fix": ["fix"], repairing: ["repair-complete"], "ready-to-verify": ["verify"], verifying: ["verification-result"] };
const briefings = {
  repairing: "Repair docs/work-orders/WO-999-fixture.md using docs/verifications/WO-999/VER-001.md; read both artifacts.\\nExecutor entry duties:\\nIntent to Act is equipped: fixture.",
  verifying: "Verify into docs/verifications/WO-999/VER-002.md.",
};
const [action] = process.argv.slice(2);
if (action === "status") {
  console.log(JSON.stringify({ workOrder: "WO-999", workOrderPath: "docs/work-orders/WO-999-fixture.md", phase: state.phase, latestVerdict: null, legalNextActions: legal[state.phase] ?? [] }));
} else if (action === "briefing") {
  if (!briefings[state.phase]) {
    console.error("error: no dispatch is recorded in phase " + state.phase);
    process.exit(1);
  }
  console.log(briefings[state.phase]);
} else if ((legal[state.phase] ?? []).includes(action)) {
  state.phase = action === "fix" ? "repairing" : "verifying";
  writeFileSync(statePath, JSON.stringify(state));
  appendFileSync("docs/control/orders/WO-999.jsonl", JSON.stringify({ schemaVersion: 1, type: action === "fix" ? "RepairRequested" : "VerificationRequested", workOrderId: "WO-999", recordedAt: new Date().toISOString() }) + "\\n");
  console.log(briefings[state.phase]);
} else {
  console.error("error: cannot perform action in phase " + state.phase + "; run: npm run resume -- " + (legal[state.phase] ?? ["none"])[0]);
  process.exit(1);
}
`,
  );
  write(
    root,
    "docs/control/local/lifecycle-stub.json",
    JSON.stringify({ phase: "needs-fix" }),
  );
  git(root, "add", ".");
  git(root, "commit", "-qm", "Lifecycle stub with legal actions");
  emitHarness(root);
  // The dispatch is judged by the compiled policy the installed writer hook
  // carries: the host compiles the same unit at the same hash, and refuses
  // once the emitted manifest no longer records the inventory it ships with.
  assert.deepEqual(
    dispatchAdmissionPolicy(root),
    config(root, "concurrent-work-requires-worktrees").policy,
  );
  const manifestPath = join(root, ".claude/harness-manifest.json");
  const manifest = readFileSync(manifestPath, "utf8");
  writeFileSync(
    manifestPath,
    manifest
      .replaceAll(
        config(root, "session").runtime.files[0].hash,
        "fnv1a64:0000000000000000",
      )
      .replace(
        /"feedbackPolicyHash": "[^"]+"/,
        '"feedbackPolicyHash": "fnv1a64:0000000000000000"',
      ),
  );
  assert.throws(
    () => dispatchAdmissionPolicy(root),
    /manifest does not record this feedback policy/,
  );
  writeFileSync(manifestPath, manifest);
  const call = (session, prompt) =>
    evaluateHarnessHook(
      config(root, "session"),
      input(root, "UserPromptSubmit", session, { prompt }),
      root,
      feedbackBoundary,
    );
  const events = () =>
    readFileSync(join(root, "docs/control/orders/WO-999.jsonl"), "utf8")
      .trim()
      .split("\n").length;
  const phase = () =>
    JSON.parse(
      readFileSync(
        join(root, "docs/control/local/lifecycle-stub.json"),
        "utf8",
      ),
    ).phase;
  assert.equal(events(), 1);
  const recorded = await call("dispatch-fix", "resume: fix");
  assert.match(
    recorded.hookSpecificOutput.additionalContext,
    /Dispatch recorded by the harness: npm run resume -- fix\. Never repeat it\./,
  );
  assert.match(
    recorded.hookSpecificOutput.additionalContext,
    /Never repeat it\. Open the reply with one line that begins 'I intend to' and names the concrete initial action, before any tool call\.\nRepair docs\/work-orders\/WO-999-fixture\.md/,
  );
  assert.match(
    recorded.hookSpecificOutput.additionalContext,
    /Executor entry duties:\nIntent to Act is equipped: fixture/,
  );
  // The receipt is the operator's terminal evidence of the dispatch and its
  // equipped supports; the briefing above reaches only the model.
  assert.equal(
    recorded.systemMessage,
    "DotLn: recorded npm run resume -- fix for WO-999 (executor); equipped supports: Intent to Act.",
  );
  assert.equal(events(), 2);
  assert.equal(phase(), "repairing");
  assert.equal(state(root, "dispatch-fix").expectedEvent, "RepairCompleted");
  assert.equal(state(root, "dispatch-fix").startingEventCount, 2);
  // A session resuming the recorded repair receives the same briefing and
  // receipt from the lifecycle's read-only projection, without a transition.
  const again = await call("dispatch-again", "resume: fix");
  assert.match(
    again.hookSpecificOutput.additionalContext,
    /Dispatch fix is already recorded \(phase repairing\); continue without repeating it\. Open the reply with one line that begins 'I intend to' and names the concrete initial action, before any tool call\.\nRepair docs\/work-orders\/WO-999-fixture\.md using docs\/verifications\/WO-999\/VER-001\.md; read both artifacts\.\nExecutor entry duties:\nIntent to Act is equipped: fixture\./,
  );
  assert.equal(
    again.systemMessage,
    "DotLn: dispatch fix is already recorded for WO-999 (executor); continuing in phase repairing; equipped supports: Intent to Act.",
  );
  assert.equal(events(), 2);
  assert.equal(phase(), "repairing");
  const illegal = await call("dispatch-verify", "resume: verify");
  assert.equal(illegal.decision, undefined);
  assert.match(
    illegal.hookSpecificOutput.additionalContext,
    /resume: verify is not a legal dispatch in phase repairing; legal actions: repair-complete/,
  );
  assert.match(illegal.systemMessage, /prompt accepted/);
  assert.equal(events(), 2);
  assert.equal(existsSync(statePath(root, "dispatch-verify")), false);
  const status = await call("dispatch-status", "resume: status");
  assert.doesNotMatch(status.hookSpecificOutput.additionalContext, /Dispatch/);
  assert.equal(status.systemMessage, undefined);
  assert.equal(events(), 2);
  // A lifecycle that exposes legal actions but cannot project the recorded
  // dispatch's briefing accepts the prompt and explains that setup failed.
  write(
    root,
    "scripts/resume.mjs",
    `import { readFileSync } from "node:fs";
const state = JSON.parse(readFileSync("docs/control/local/lifecycle-stub.json", "utf8"));
if (process.argv[2] === "status") console.log(JSON.stringify({ workOrder: "WO-999", workOrderPath: "docs/work-orders/WO-999-fixture.md", phase: state.phase, latestVerdict: null, legalNextActions: ["repair-complete"] }));
else { console.error("error: unknown resume action: " + process.argv[2]); process.exit(1); }
`,
  );
  const unbriefed = await call("dispatch-unbriefed", "resume: fix");
  assert.equal(unbriefed.decision, undefined);
  assert.match(
    unbriefed.hookSpecificOutput.additionalContext,
    /dispatch fix is already recorded \(phase repairing\) but its briefing is unavailable: error: unknown resume action: briefing/,
  );
  assert.match(unbriefed.systemMessage, /prompt accepted/);
  assert.equal(events(), 2);
  assert.equal(existsSync(statePath(root, "dispatch-unbriefed")), false);
  // A lifecycle without legal actions (an older projection or a plain stub)
  // leaves the dispatch to the role, as before.
  write(
    root,
    "scripts/resume.mjs",
    'console.log(JSON.stringify({workOrder:"WO-999",workOrderPath:"docs/work-orders/WO-999-fixture.md",phase:"needs-fix"}));\n',
  );
  const legacy = await call("dispatch-legacy", "resume: fix");
  assert.doesNotMatch(legacy.hookSpecificOutput.additionalContext, /Dispatch/);
  assert.equal(legacy.systemMessage, undefined);
  assert.equal(events(), 2);
});

test("WO-131 prompt submission stays open while dispatches retain the ordinary command's gate and writer checks", async (t) => {
  const root = repo(t, { runtime: true });
  // The real lifecycle, its libraries and the source modules they import, so
  // the guarded cases judge actual events, checkpoints and projections.
  cpSync(join(source, "scripts/resume.mjs"), join(root, "scripts/resume.mjs"));
  cpSync(join(source, "scripts/lib"), join(root, "scripts/lib"), {
    recursive: true,
  });
  for (const name of ["compiler", "kernel", "skeleton"])
    cpSync(
      join(source, `packages/${name}/src`),
      join(root, `packages/${name}/src`),
      { recursive: true },
    );
  write(
    root,
    "docs/work-orders/WO-999-fixture.md",
    "# WO-999 fixture\n\n**Model:** any capable model.\n**Effort:** executor any; verifier any; reviewer any.\n",
  );
  git(root, "add", ".");
  git(root, "commit", "-qm", "Real lifecycle");
  emitHarness(root);
  const hook = (name, payload) => {
    const run = spawnSync(
      process.execPath,
      [join(root, `.claude/hooks/${name}.mjs`)],
      {
        cwd: root,
        input: JSON.stringify(payload),
        encoding: "utf8",
        timeout: 20_000,
      },
    );
    assert.equal(run.status, 0, run.stderr);
    return JSON.parse(run.stdout);
  };
  const prompt = (session, text) =>
    hook("session", input(root, "UserPromptSubmit", session, { prompt: text }));
  const tool = (name, session, command) =>
    hook(
      name,
      input(root, "PreToolUse", session, {
        tool_name: "Bash",
        tool_input: { command },
      }),
    );
  const status = () => {
    const run = spawnSync(
      process.execPath,
      ["scripts/resume.mjs", "status", "--json"],
      { cwd: root, encoding: "utf8" },
    );
    assert.equal(run.status, 0, run.stderr);
    return JSON.parse(run.stdout);
  };
  const lifecycle = () => ({
    events: readFileSync(
      join(root, "docs/control/orders/WO-999.jsonl"),
      "utf8",
    ),
    current: existsSync(join(root, "docs/control/current.md"))
      ? readFileSync(join(root, "docs/control/current.md"), "utf8")
      : null,
    refs: git(
      root,
      "for-each-ref",
      "--format=%(refname) %(objectname)",
      "refs/dotln/",
    ),
    reports: existsSync(join(root, "docs/verifications"))
      ? readdirSync(join(root, "docs/verifications"), { recursive: true })
      : [],
    phase: status().phase,
  });
  const actor = (session) => createHash("sha256").update(session).digest("hex");
  const lock = join(root, "docs/control/local/harness/writer");
  const foreign = () => {
    rmSync(lock, { recursive: true, force: true });
    seedHarnessWriter(root, {
      actorId: actor("foreign-session"),
      worktree: root,
      owner: { pid: process.pid, source: "parent" },
      reservedAt: "2026-09-13T00:00:00.000Z",
    });
    assert.equal(harnessWriterView(root).alive, true);
  };
  const equivalent = "npm run resume -- verify";

  // Phase active: next is a metadata command on the tool path, so the prompt
  // dispatch admits it under a live gate and a foreign writer, reserves
  // nothing and appends no event.
  assert.equal(status().phase, "active");
  foreign();
  const gate = beginGateRun(root, "synthetic active evidence gate");
  t.after(() => gate.release());
  assert.deepEqual(
    tool(
      "concurrent-work-requires-worktrees",
      "next-session",
      "npm run resume -- next",
    ),
    {},
  );
  assert.notEqual(
    tool("permissions", "next-session", "npm run resume -- next")
      .hookSpecificOutput?.permissionDecision,
    "deny",
  );
  const activeBefore = lifecycle();
  const next = prompt("next-session", "resume: next");
  assert.match(
    next.hookSpecificOutput.additionalContext,
    /Dispatch recorded by the harness: npm run resume -- next\. Never repeat it\. Open the reply with one line that begins 'I intend to'/,
  );
  assert.match(
    next.hookSpecificOutput.additionalContext,
    /Execute docs\/work-orders\/WO-999-fixture\.md\./,
  );
  assert.match(
    next.systemMessage,
    /^DotLn: recorded npm run resume -- next for WO-999 \(executor\); equipped supports: Adjacent Repair, Intent to Act, /,
  );
  assert.equal(harnessWriterView(root).actorId, actor("foreign-session"));
  const activeAfter = lifecycle();
  assert.equal(activeAfter.events, activeBefore.events);
  assert.equal(activeAfter.refs, activeBefore.refs);
  assert.equal(activeAfter.phase, "active");

  // Phase ready-to-verify: verify appends an event, checkpoints and projects.
  write(
    root,
    "docs/control/orders/WO-999.jsonl",
    activeAfter.events +
      JSON.stringify({
        schemaVersion: 1,
        type: "ImplementationReady",
        workOrderId: "WO-999",
        recordedAt: "2026-09-13T00:00:01.000Z",
        actor: {
          harness: "human",
          harnessVersion: "fixture",
          model: "fixture",
          effort: "max",
          source: "operator-attested",
        },
      }) +
      "\n",
  );
  assert.equal(status().phase, "ready-to-verify");

  // A live evidence gate refuses the dispatch with the reason the permission
  // hook gives the command, reserves nothing and changes no lifecycle byte.
  rmSync(lock, { recursive: true, force: true });
  const gated = lifecycle();
  const gateDenied = tool(
    "permissions",
    "gated-session",
    equivalent,
  ).hookSpecificOutput;
  assert.equal(gateDenied.permissionDecision, "deny");
  const gatedPrompt = prompt("gated-session", "resume: verify");
  assert.equal(gatedPrompt.decision, undefined);
  assert.ok(
    gatedPrompt.hookSpecificOutput.additionalContext.includes(
      gateDenied.permissionDecisionReason,
    ),
  );
  assert.match(
    gatedPrompt.hookSpecificOutput.additionalContext,
    /DOTLN_HARNESS_REFUSED: write may change gate inputs during active gate synthetic active evidence gate \(run [0-9a-f-]{36}, pid \d+\)/,
  );
  assert.match(gatedPrompt.systemMessage, /prompt accepted/);
  assert.deepEqual(lifecycle(), gated);
  assert.equal(activeGateRuns(root).length, 1);
  assert.equal(harnessWriterView(root).reserved, false);
  assert.equal(existsSync(statePath(root, "gated-session")), false);
  gate.release();
  assert.equal(activeGateRuns(root).length, 0);

  // Another session's live reservation refuses it with the reason the writer
  // hook gives the command, and the holder keeps the worktree.
  foreign();
  const reserved = lifecycle();
  const writerDenied = tool(
    "concurrent-work-requires-worktrees",
    "contender",
    equivalent,
  ).hookSpecificOutput;
  assert.equal(writerDenied.permissionDecision, "deny");
  const contended = prompt("contender", "resume: verify");
  assert.equal(contended.decision, undefined);
  assert.ok(
    contended.hookSpecificOutput.additionalContext.includes(
      writerDenied.permissionDecisionReason,
    ),
  );
  assert.match(
    contended.hookSpecificOutput.additionalContext,
    /DOTLN_HARNESS_REFUSED: concurrent-work-requires-worktrees: write dispatch lacks a verified exclusive worktree; the worktree is reserved by another session \(actor [0-9a-f]{12}; host process \d+ is alive\)\. Finish that session/,
  );
  assert.match(contended.systemMessage, /prompt accepted/);
  assert.deepEqual(lifecycle(), reserved);
  assert.equal(harnessWriterView(root).actorId, actor("foreign-session"));
  assert.equal(existsSync(statePath(root, "contender")), false);
  rmSync(lock, { recursive: true, force: true });

  // Uncontended: the dispatch records exactly once, delivers the allocated
  // report path with a terminal receipt, and holds the reservation the
  // session's first write would take.
  const admitted = prompt("verifier", "resume: verify");
  assert.match(
    admitted.hookSpecificOutput.additionalContext,
    /Dispatch recorded by the harness: npm run resume -- verify\. Never repeat it\.\nVerify docs\/work-orders\/WO-999-fixture\.md; write the immutable report to docs\/verifications\/WO-999\/VER-001\.md\./,
  );
  assert.equal(
    admitted.systemMessage,
    "DotLn: recorded npm run resume -- verify for WO-999 (verifier); equipped supports: none named by the briefing.",
  );
  const recorded = lifecycle();
  assert.equal(
    recorded.events.trim().split("\n").length,
    reserved.events.trim().split("\n").length + 1,
  );
  assert.match(
    recorded.events,
    /"type":"VerificationRequested","workOrderId":"WO-999","verificationId":"VER-001"/,
  );
  assert.equal(recorded.phase, "verifying");
  assert.match(
    recorded.refs,
    /^refs\/dotln\/checkpoint\/WO-999\/1 [0-9a-f]{40}$/m,
  );
  assert.equal(harnessWriterView(root).actorId, actor("verifier"));
  assert.deepEqual(
    tool(
      "concurrent-work-requires-worktrees",
      "verifier",
      "touch docs/verifications/WO-999/VER-001.md",
    ),
    {},
  );
  const repeated = prompt("second-verifier", "resume: verify");
  assert.match(
    repeated.hookSpecificOutput.additionalContext,
    /Dispatch verify is already recorded \(phase verifying\); continue without repeating it\.\nVerify docs\/work-orders\/WO-999-fixture\.md; write the immutable report to docs\/verifications\/WO-999\/VER-001\.md\./,
  );
  assert.doesNotMatch(
    repeated.hookSpecificOutput.additionalContext,
    /I intend to/,
  );
  assert.equal(
    repeated.systemMessage,
    "DotLn: dispatch verify is already recorded for WO-999 (verifier); continuing in phase verifying; equipped supports: none named by the briefing.",
  );
  assert.deepEqual(lifecycle(), recorded);
  assert.equal(harnessWriterView(root).actorId, actor("verifier"));

  // Phase needs-fix: the recording session's fix delivers the executor
  // briefing, and a new session that resumes the recorded repair after that
  // session released the worktree receives the same supports and intent
  // instruction, reserves nothing and changes no lifecycle byte.
  write(
    root,
    "docs/control/orders/WO-999.jsonl",
    recorded.events +
      JSON.stringify({
        schemaVersion: 1,
        type: "VerificationCompleted",
        workOrderId: "WO-999",
        verificationId: "VER-001",
        reportPath: "docs/verifications/WO-999/VER-001.md",
        verdict: "fail",
        actor: {
          harness: "human",
          harnessVersion: "fixture",
          model: "fixture",
          effort: "max",
          source: "operator-attested",
        },
        recordedAt: "2026-09-13T00:00:02.000Z",
      }) +
      "\n",
  );
  write(root, "docs/verifications/WO-999/VER-001.md", "# Synthetic failure\n");
  rmSync(lock, { recursive: true, force: true });
  assert.equal(status().phase, "needs-fix");
  // The transition's optional beacon warning belongs to the recording, not
  // to the briefing a resumed session receives. WO-144 prints each session's
  // own scratch path after it, so the warning is no longer last, and the
  // briefings agree only once each session's own key is set aside.
  const briefingOf = (context, session) => {
    const scratch = `/dotln/${actor(session)}/scratch. `;
    assert.ok(context.includes(scratch), `${session} is given its own scratch`);
    // WO-140 prints each session's own id and exact usage command.
    const usage = `\nDotLn session: ${session}. Usage readback: node scripts/harness.mjs usage ${session}`;
    assert.ok(
      context.includes(`${usage}\n`) || context.endsWith(usage),
      `${session} is given its own usage readback`,
    );
    return context
      .replace(usage, "\nDotLn session: <session>. Usage readback: <command>")
      .slice(context.indexOf("\nRepair docs/"))
      .split("\nObserved facts at ", 1)[0]
      .replace(
        /\n+warning: host beacon projection unavailable; transition recorded, do not retry the transition(?=\n|$)/u,
        "",
      )
      .replace(scratch, "/dotln/<session-key>/scratch. ");
  };
  const supportsOf = (message) =>
    /; equipped supports: (.+)\.$/.exec(message)?.[1];
  const repair = prompt("repair-session", "resume: fix");
  assert.match(
    repair.hookSpecificOutput.additionalContext,
    /Dispatch recorded by the harness: npm run resume -- fix\. Never repeat it\. Open the reply with one line that begins 'I intend to' and names the concrete initial action, before any tool call\.\nRepair docs\/work-orders\/WO-999-fixture\.md using docs\/verifications\/WO-999\/VER-001\.md; read both artifacts\.\nExecutor entry duties:\n/,
  );
  assert.match(
    supportsOf(repair.systemMessage),
    /^Adjacent Repair, Intent to Act, /,
  );
  const repairing = lifecycle();
  assert.equal(repairing.phase, "repairing");
  assert.equal(
    repairing.events.trim().split("\n").length,
    recorded.events.trim().split("\n").length + 2,
  );
  assert.equal(harnessWriterView(root).actorId, actor("repair-session"));
  releaseHarnessWriter(
    root,
    input(root, "UserPromptSubmit", "repair-session", {
      prompt: "resume: fix",
    }),
  );
  assert.equal(harnessWriterView(root).reserved, false);
  const resumed = prompt("resumed-repair", "resume: fix");
  assert.match(
    resumed.hookSpecificOutput.additionalContext,
    /Dispatch fix is already recorded \(phase repairing\); continue without repeating it\. Open the reply with one line that begins 'I intend to' and names the concrete initial action, before any tool call\.\nRepair docs\/work-orders\/WO-999-fixture\.md/,
  );
  assert.equal(
    briefingOf(resumed.hookSpecificOutput.additionalContext, "resumed-repair"),
    briefingOf(repair.hookSpecificOutput.additionalContext, "repair-session"),
  );
  assert.match(
    resumed.hookSpecificOutput.additionalContext,
    /Observed facts at /,
  );
  assert.match(
    repair.hookSpecificOutput.additionalContext,
    /Observed facts at /,
  );
  assert.equal(
    resumed.systemMessage,
    `DotLn: dispatch fix is already recorded for WO-999 (executor); continuing in phase repairing; equipped supports: ${supportsOf(repair.systemMessage)}.`,
  );
  assert.deepEqual(lifecycle(), repairing);
  assert.equal(harnessWriterView(root).reserved, false);
});

test("WO-133 source-only runtime diagnosis never builds and refresh verifies the rebuilt pins", (t) => {
  const root = repo(t);
  const file = "packages/skeleton/dist/src/Version_2.js";
  const bytes = 'export const HARNESS_HOST_VERSION = "fixture";\n';
  const snapshot = ".runtime/harness/0000000000000133";
  const runtime = {
    snapshot,
    files: [{ path: file, hash: `fnv1a64:${fnv1a64(bytes)}` }],
  };
  write(
    root,
    ".claude/harness-manifest.json",
    json({ profiles: [{ profile: { runtime } }] }),
  );
  assert.equal(harnessRuntimeCause(root), "runtime-unavailable");
  write(root, file, bytes);
  assert.equal(harnessRuntimeCause(root), "snapshot-missing");
  const stderr = process.stderr.write;
  const lines = [];
  try {
    process.stderr.write = (line) => {
      lines.push(String(line));
      return true;
    };
    assert.equal(reportHarnessRuntime(root), "snapshot-missing");
  } finally {
    process.stderr.write = stderr;
  }
  assert.equal(lines.length, 1);
  assert.match(lines[0], /snapshot-missing.*node scripts\/bootstrap\.mjs/);
  assert.equal(
    existsSync(join(root, snapshot)),
    false,
    "diagnosis does not build",
  );
  let builds = 0;
  assert.equal(
    refreshHarnessRuntime(root, () => {
      builds++;
      write(root, `${snapshot}/${file}`, bytes);
    }),
    true,
  );
  assert.equal(builds, 1);
  assert.equal(harnessRuntimeCause(root), null);
  assert.equal(
    refreshHarnessRuntime(root, () => {
      builds++;
    }),
    false,
  );
  assert.equal(builds, 1);
  write(root, file, "stale runtime\n");
  assert.equal(harnessRuntimeCause(root), "pins-differ");
  assert.throws(
    () =>
      refreshHarnessRuntime(root, () => {
        builds++;
      }),
    /still pins-differ.*checkout preserved/,
  );
  assert.equal(builds, 2);
  assert.equal(readFileSync(join(root, file), "utf8"), "stale runtime\n");
});

test("process table names the observed cutoff and evidence sources", () => {
  const rendered = renderMetaTable({
    orders: [],
    observedAt: "2030-01-02T03:04:05.000Z",
  });
  assert.match(
    rendered,
    /Observation cutoff: 2030-01-02T03:04:05.000Z; source: canonical control events/,
  );
  assert.match(renderMetaTable({ orders: [] }), /Observation cutoff: unknown/);
});

test("WO-142 Beacon staging residue is disposable only at the named staging shape", async () => {
  const { classifyIgnoredMaterial } = await import("./lib/paths.mjs");
  for (const path of [
    ".dotln-beacon-stage-abc123",
    "nested/.dotln-beacon-stage-abc123/value",
  ])
    assert.equal(classifyIgnoredMaterial(path).disposable, true, path);
  for (const path of [
    ".dotln-beacon-stage-important/value",
    "docs/intake/.dotln-beacon-stage-abc123/value",
  ])
    assert.equal(classifyIgnoredMaterial(path).disposable, false, path);
});

test("WO-140 a newly allocated receipt needs counters with their source or one cause code; earlier receipts pass", async (t) => {
  const {
    COST_LINE_PREFIX,
    COST_LINE_REQUIRED,
    checkReceiptCostLines,
    costLineBriefing,
    judgeCostLine,
    usageCauseCodes,
  } = await import("./lib/receipt-cost.mjs");
  assert.deepEqual(Object.keys(usageCauseCodes), [
    "hooks-fallback",
    "no-session",
    "harness-no-readback",
  ]);
  for (const code of Object.keys(usageCauseCodes))
    assert.ok(costLineBriefing.includes(code), code);
  const line = (body) => `# Report\n\n${COST_LINE_PREFIX} ${body}\n`;
  for (const admitted of [
    "entry 120,412 tokens; handoff 388,019 tokens; source transcript message usage",
    "entry 0 tokens; handoff 17 tokens; source: codex-thread",
    "unknown; cause no-session",
    "unknown; cause `hooks-fallback`",
    "entry 120,412 tokens; handoff unknown; cause harness-no-readback",
  ])
    assert.equal(judgeCostLine(line(admitted)), null, admitted);
  for (const [refused, reason] of [
    ["unknown", /neither the entry and handoff counters/],
    ["unknown (counter-unavailable)", /neither the entry and handoff counters/],
    ["entry 120,412 tokens; handoff 388,019 tokens", /neither/],
    ["entry unknown; handoff unknown; source unavailable", /neither/],
    [
      "entry unknown as of 2026-09-19; handoff unknown at 02:50; source none",
      /neither/,
    ],
    ["entry 10 tokens; handoff 20 tokens; source unknown", /neither/],
    ["unknown; cause no-session-yet", /neither/],
    ["unknown; cause no-session and hooks-fallback", /names 2 cause codes/],
    [
      "entry 1 tokens; handoff 2 tokens; source transcript; cause no-session",
      /one or the other/,
    ],
  ])
    assert.match(judgeCostLine(line(refused)), reason, refused);
  assert.match(judgeCostLine("# Report\n\nUsage unknown.\n"), /found 0/);
  assert.match(
    judgeCostLine(line("unknown; cause no-session") + line("unknown")),
    /found 2/,
  );

  const root = realpathSync(mkdtempSync(join(tmpdir(), "dotln-receipt-cost-")));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  execFileSync("git", ["init", "-q"], { cwd: root });
  const write = (path, text) => {
    mkdirSync(dirname(join(root, path)), { recursive: true });
    writeFileSync(join(root, path), text);
  };
  const requested = (id, stamped) => ({
    schemaVersion: 1,
    recordedAt: `2026-09-20T00:00:0${id}.000Z`,
    type: id === 4 ? "FinalReviewRequested" : "VerificationRequested",
    workOrderId: "WO-999",
    reportPath:
      id === 4
        ? "docs/final-reviews/WO-999/FINAL-001.md"
        : `docs/verifications/WO-999/VER-00${id}.md`,
    ...(stamped ? { costLine: COST_LINE_REQUIRED } : {}),
  });
  const segment = (events) =>
    write(
      "docs/control/orders/WO-999.jsonl",
      [
        {
          schemaVersion: 1,
          recordedAt: "2026-09-20T00:00:00.000Z",
          type: "WorkOrderActivated",
          workOrderId: "WO-999",
          workOrderPath: "docs/work-orders/WO-999-fixture.md",
        },
        ...events,
      ]
        .map(JSON.stringify)
        .join("\n") + "\n",
    );
  // An earlier receipt: no stamp, a bare unknown, and it still passes.
  segment([requested(1, false), requested(2, true), requested(3, true)]);
  write(
    "docs/verifications/WO-999/VER-001.md",
    "# VER-001\n\nUsage unknown.\n",
  );
  // VER-002 is allocated and not written yet; VER-003 is a bare unknown.
  write("docs/verifications/WO-999/VER-003.md", line("unknown"));
  assert.throws(
    () => checkReceiptCostLines(root),
    (error) => {
      assert.match(error.message, /VER-003\.md: cost line records neither/);
      assert.doesNotMatch(error.message, /VER-001|VER-002/);
      return true;
    },
  );
  write(
    "docs/verifications/WO-999/VER-003.md",
    line("unknown; cause no-session"),
  );
  assert.deepEqual(checkReceiptCostLines(root), []);
  segment([requested(1, false), requested(3, true), requested(4, true)]);
  write("docs/final-reviews/WO-999/FINAL-001.md", "# FINAL-001\n");
  assert.throws(
    () => checkReceiptCostLines(root),
    /FINAL-001\.md: cost line expected exactly one/,
  );
  write(
    "docs/final-reviews/WO-999/FINAL-001.md",
    line("entry 10 tokens; handoff 20 tokens; source transcript message usage"),
  );
  assert.deepEqual(checkReceiptCostLines(root), []);
  // Every receipt in this repository predates the stamp or satisfies it.
  assert.deepEqual(
    checkReceiptCostLines(resolve(import.meta.dirname, "..")),
    [],
  );
});

test("WO-140 the briefing names the session and the exact usage command the usage guard admits", async (t) => {
  const { usageReadbackCommand, usageReadbackLine } =
    await import("../packages/skeleton/src/usage-observation.mjs");
  assert.equal(
    usageReadbackLine("93de90d8-5649-4449-bcd6-fbbf78bb137b"),
    "DotLn session: 93de90d8-5649-4449-bcd6-fbbf78bb137b. Usage readback: node scripts/harness.mjs usage 93de90d8-5649-4449-bcd6-fbbf78bb137b",
  );
  assert.equal(
    usageReadbackCommand("it's odd"),
    "node scripts/harness.mjs usage 'it'\\''s odd'",
  );
  const { codexSessionReport } = await import("./lib/harness-runtime.mjs");
  const thread = process.env.CODEX_THREAD_ID;
  t.after(() => {
    if (thread === undefined) delete process.env.CODEX_THREAD_ID;
    else process.env.CODEX_THREAD_ID = thread;
  });
  process.env.CODEX_THREAD_ID = "fixture-thread";
  assert.ok(
    (await codexSessionReport("/unused")).text.endsWith(
      "\nDotLn session: fixture-thread. Usage readback: node scripts/harness.mjs usage fixture-thread",
    ),
  );
  delete process.env.CODEX_THREAD_ID;
  assert.doesNotMatch(
    (await codexSessionReport("/unused")).text,
    /Usage readback/,
  );
  // The role text and the document check share one closed list.
  const { usageCauseCodes } = await import("./lib/receipt-cost.mjs");
  const project = resolve(import.meta.dirname, "..");
  for (const role of ["verifier", "reviewer"])
    for (const skills of [".claude/skills", ".agents/skills"]) {
      const skill = readFileSync(
        join(project, skills, `dotln-${role}/SKILL.md`),
        "utf8",
      );
      for (const code of Object.keys(usageCauseCodes))
        assert.ok(skill.includes(`\`${code}\``), `${skills} ${role} ${code}`);
      assert.match(skill, /outside the harness sandbox from the start/);
      assert.match(
        skill,
        /resident-launched verification runs `npm test -- --inside-sandbox` and records its excluded suites as a partial result/,
      );
    }
});

test("WO-140 the cost line is a record and not a mention, and meta --check is wired to refuse it", async (t) => {
  const {
    COST_LINE_PREFIX,
    COST_LINE_REQUIRED,
    judgeCostLine,
    requiredCostReceipts,
    requireReceiptCostLine,
  } = await import("./lib/receipt-cost.mjs");
  const line = (body, lead = "") =>
    `# Report\n\n${lead}${COST_LINE_PREFIX} ${body}\n`;
  const counters = "entry 1 tokens; handoff 2 tokens; source";
  for (const [admitted, lead] of [
    ["unknown; cause no-session", "- "],
    ["unknown; cause no-session", "  * "],
    ["unknown; cause: `harness-no-readback`", ""],
    ["entry=10 tokens; handoff=20 tokens; source=codex-thread", ""],
    ['entry 1 token; handoff 1,234,567 tokens; source "harness usage"', ""],
    [`${counters} claude-transcript-message-usage\r`, ""],
  ])
    assert.equal(judgeCostLine(line(admitted, lead)), null, admitted);
  for (const refused of [
    `${counters} \`unknown\``,
    `${counters} is unknown`,
    `${counters} n/a`,
    `${counters} tbd`,
    `${counters} not available`,
    "unknown; not hooks-fallback, cause not determined",
    "unknown (maybe no-session? unsure)",
    "unknown; cause no-session2",
    "unknown; cause x.no-session",
    "unknown; cause notes_no-session_draft",
    "entry 1,,..__ tokens; handoff 2 tokens; source transcript",
    "re-entry 5 tokens; handoff 2 tokens; source transcript",
    "unknown; cause NO-SESSION",
  ])
    assert.notEqual(judgeCostLine(line(refused)), null, refused);
  // A quoted form inside a code fence is an example, never the line.
  assert.equal(
    judgeCostLine(
      `# Report\n\n\`\`\`text\n${COST_LINE_PREFIX} unknown\n\`\`\`\n\n${COST_LINE_PREFIX} unknown; cause hooks-fallback\n`,
    ),
    null,
  );

  const root = realpathSync(
    mkdtempSync(join(tmpdir(), "dotln-receipt-wiring-")),
  );
  t.after(() => rmSync(root, { recursive: true, force: true }));
  execFileSync("git", ["init", "-q"], { cwd: root });
  const write = (path, text) => {
    mkdirSync(dirname(join(root, path)), { recursive: true });
    writeFileSync(join(root, path), text);
  };
  const event = (reportPath, index) => ({
    schemaVersion: 1,
    recordedAt: `2026-09-20T00:00:0${index}.000Z`,
    type: "VerificationRequested",
    workOrderId: "WO-999",
    reportPath,
    costLine: COST_LINE_REQUIRED,
  });
  const receipt = "docs/verifications/WO-999/VER-001.md";
  write(
    "docs/control/orders/WO-999.jsonl",
    [
      {
        schemaVersion: 1,
        recordedAt: "2026-09-20T00:00:00.000Z",
        type: "WorkOrderActivated",
        workOrderId: "WO-999",
        workOrderPath: "docs/work-orders/WO-999-fixture.md",
      },
      event(receipt, 1),
      // A stamped path outside the receipt directories is never read.
      event("../outside.md", 2),
      event("docs/verifications", 3),
    ]
      .map(JSON.stringify)
      .join("\n") + "\n",
  );
  assert.deepEqual(requiredCostReceipts(root), [receipt]);
  write(receipt, line("unknown"));
  assert.throws(
    () => requireReceiptCostLine(root, receipt),
    /VER-001\.md: cost line records neither/,
  );
  // An unstamped path is not this rule's subject.
  requireReceiptCostLine(root, "docs/verifications/WO-998/VER-001.md");
  const { metaMain } = await import("./meta.mjs");
  const log = console.log;
  console.log = () => {};
  t.after(() => (console.log = log));
  await assert.rejects(
    metaMain(["--check"], root),
    /Receipt cost lines refused:\ndocs\/verifications\/WO-999\/VER-001\.md/,
  );
  write(receipt, line("unknown; cause no-session", "- "));
  requireReceiptCostLine(root, receipt);
  // With the receipt repaired, whatever else this bare root lacks is not a cost-line refusal.
  await metaMain(["--check"], root).catch((error) =>
    assert.doesNotMatch(error.message, /Receipt cost lines refused/),
  );
});
