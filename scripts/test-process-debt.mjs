import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync, spawn, spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  copyFileSync,
  cpSync,
  existsSync,
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
  gateTreeHash,
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
import { classifyIgnoredMaterial } from "./lib/paths.mjs";
import {
  budgetVerdict,
  measureColdStarts,
  readBudgets,
  requireBudgets,
} from "./lib/process-budget.mjs";
import {
  collectMeta,
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
  harnessOutputObligations,
  evaluateHarnessHook,
  permissionEffect,
  observeHarnessDelivery,
  readHarnessOutput,
  runHarnessEvidence,
  observeSessionHarnessVersion,
} from "../packages/skeleton/dist/src/harness-host.js";
import { feedbackBoundary } from "../packages/skeleton/dist/src/feedback-boundary.js";
import { hasAiAttribution } from "../packages/compiler/dist/src/feedback.js";
import {
  invocationEffects,
  shellInvocations,
  commitMessageInputs,
} from "../packages/skeleton/dist/src/harness-command.js";
import { atomicBuild, publishBuildTree } from "./build.mjs";
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
const source = resolve(import.meta.dirname, "..");
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
function repo(t, { runtime = false } = {}) {
  const root = realpathSync(mkdtempSync(join(tmpdir(), "dotln-debt-")));
  t.after(() => rmSync(root, { recursive: true, force: true }));
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
      scripts: { test: "node -e ''", "test:full": "node -e ''" },
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
        { recursive: true },
      );
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
const input = (root, event, session = "fixture", extra = {}) => ({
  cwd: root,
  hook_event_name: event,
  session_id: session,
  ...extra,
});
const config = (root, name) =>
  JSON.parse(
    readFileSync(join(root, `.claude/hooks/${name}.mjs`), "utf8").match(
      /await runHarnessHook\(([\s\S]*), feedbackBoundary\);/,
    )[1],
  );
const statePath = (root, session = "fixture") =>
  join(
    root,
    `docs/control/local/harness/${createHash("sha256").update(session).digest("hex")}.json`,
  );
const state = (root, session = "fixture") =>
  JSON.parse(readFileSync(statePath(root, session), "utf8"));
const gate = (root, checkId = "npm run test:full", exitCode = 0) => ({
  checkId,
  treeHash: gateTreeHash(root),
  subject: gateTreeHash(root),
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

test("all four completion actions demand full evidence and current reads while Stop advises and releases", async (t) => {
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
    if (!existsSync(statePath(root, role)))
      beginHarnessSession(root, role, role, ["own.txt"]);
    await assert.rejects(
      requireLifecycleEvidence(root, action, "pass", "WO-999"),
      /npm run test:full/,
    );
  }
  recordGateChecks(root, [gate(root), gate(root, "git diff --check")]);
  const deliveredRoles = new Set();
  for (const [action, role] of actions) {
    if (!deliveredRoles.has(role))
      await assert.rejects(
        requireLifecycleEvidence(root, action, "pass", "WO-999"),
        /Output not read/,
      );
    deliveredRoles.add(role);
    const delivered = readHarnessOutput(root, "own.txt", 0, 8192);
    observeHarnessDelivery(root, role, json(delivered));
    if (action === "implementation-ready")
      await assert.rejects(
        requireLifecycleEvidence(root, action, "pass", "WO-999"),
        /Token measurement/,
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
    assert.equal(
      (await requireLifecycleEvidence(root, action, "pass", "WO-999"))
        .readCount,
      1,
    );
    const ownState = state(root, role);
    ownState.remainingWork = ["criterion unresolved"];
    writeFileSync(statePath(root, role), json(ownState));
    await assert.rejects(
      requireLifecycleEvidence(root, action, "pass", "WO-999"),
      /work remains incomplete/,
    );
    ownState.remainingWork = [];
    writeFileSync(statePath(root, role), json(ownState));
  }
  beginHarnessSession(root, "fixture", "executor");
  const request = input(root, "PreToolUse", "fixture", {
    tool_name: "Edit",
    tool_input: { file_path: join(root, "own.txt") },
  });
  await evaluateHarnessHook(
    config(root, "concurrent-work-requires-worktrees"),
    request,
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
  assert.match(stopped.systemMessage, /^DotLn: pending /);
  assert.equal(stopped.systemMessage.split("\n").length, 1);
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

test("failed verification and review validate oversized documents, generated index and report without requiring green code", async (t) => {
  const root = repo(t, { runtime: true });
  const oldHome = process.env.CODEX_HOME,
    oldThread = process.env.CODEX_THREAD_ID;
  process.env.CODEX_HOME = join(root, ".runtime/codex");
  process.env.CODEX_THREAD_ID = "failed-verdict-usage";
  t.after(() => {
    if (oldHome === undefined) delete process.env.CODEX_HOME;
    else process.env.CODEX_HOME = oldHome;
    if (oldThread === undefined) delete process.env.CODEX_THREAD_ID;
    else process.env.CODEX_THREAD_ID = oldThread;
  });
  write(
    root,
    ".gitattributes",
    readFileSync(new URL("../.gitattributes", import.meta.url), "utf8"),
  );
  const roles = [
    ["verification-result", "verifier"],
    ["final-review-result", "reviewer"],
  ];
  write(root, "docs/work-orders/README.md", "Generated verification status\n");
  write(root, "docs/product/03-architecture.md", "a".repeat(65537));
  write(root, "report.md", "FAIL: reproduced fixture failure\n");
  for (const [, role] of roles)
    beginHarnessSession(root, role, role, [
      "docs/work-orders/README.md",
      "docs/product/03-architecture.md",
      "report.md",
    ]);
  const timestamp = new Date().toISOString();
  write(
    root,
    ".runtime/codex/sessions/failed-verdict-usage.jsonl",
    [
      {
        type: "session_meta",
        timestamp,
        payload: { id: "failed-verdict-usage", cwd: root },
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
  const refuses = async (pattern = /Output not read or checked/) => {
    for (const [action] of roles)
      await assert.rejects(
        requireLifecycleEvidence(root, action, "fail", "WO-999"),
        pattern,
      );
  };
  recordGateChecks(root, [
    gate(root, "git diff --check"),
    gate(root, "npm run test:full", 1),
  ]);
  await refuses();
  recordGateChecks(root, [gate(root, "suite:format")]);
  await refuses();
  recordGateChecks(root, [gate(root, "suite:index")]);
  recordGateChecks(root, [gate(root, "suite:publication", 1)]);
  await refuses();
  recordGateChecks(root, [gate(root, "suite:publication")]);
  await refuses();
  for (const [action, role] of roles) {
    observeHarnessDelivery(
      root,
      role,
      json(readHarnessOutput(root, "report.md")),
    );
    const result = await requireLifecycleEvidence(
      root,
      action,
      "fail",
      "WO-999",
    );
    assert.equal(result.checkCount, 2);
    assert.equal(result.readCount, 1);
    await assert.rejects(
      requireLifecycleEvidence(root, action, "pass", "WO-999"),
      /npm run test:full/,
    );
  }
  write(root, "report.md", "FAIL: changed after delivery\n");
  recordGateChecks(root, [
    gate(root, "git diff --check"),
    gate(root, "suite:index"),
    gate(root, "suite:publication"),
  ]);
  await refuses();
  for (const [, role] of roles)
    observeHarnessDelivery(
      root,
      role,
      json(readHarnessOutput(root, "report.md")),
    );
  write(root, "docs/product/03-architecture.md", "b".repeat(65537));
  await refuses(/git diff --check/);
  recordGateChecks(root, [gate(root, "git diff --check")]);
  await refuses();
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
      path.endsWith(".json") ? "{}\n" : "Stale generated bytes\n",
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
      scripts: { "test:full": "node -e 'process.exit(7)'" },
    }),
  );
  prepareHarnessEvidence(root);
  assert.notEqual(
    runHarnessEvidence(root).find((row) => row.checkId === "npm run test:full")
      .exitCode,
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
  assert.equal(installed.length, commands.length + 1);
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
  assert.equal(settings.hooks.Stop.flatMap((row) => row.hooks).length, 1);
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
  assert.deepEqual(JSON.parse(parentHook.stdout), {});
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
    "Agent",
    "unknown_effectful_tool",
    "write_stdin",
  ])
    assert.throws(
      () => permissionEffect({ tool_name: name, tool_input: {} }),
      /adapter|Unclassified|Unknown|unclassified|unsupported/i,
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
    assert.deepEqual(JSON.parse(hook.stdout), {});
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

test("effect-program operands retain the denial floor except proven message and search data", (t) => {
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
  for (const [denied, cases] of [
    [true, commands],
    [false, controls],
  ])
    for (const command of cases) {
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
      assert.equal(
        JSON.parse(result.stdout).hookSpecificOutput?.permissionDecision ===
          "deny",
        denied,
        command,
      );
    }
});

test("all wired hooks count one refusal per tool use without retaining its identity", async (t) => {
  const root = repo(t, { runtime: true });
  emitHarness(root);
  beginHarnessSession(root, "fixture", "executor");
  const settings = JSON.parse(
    readFileSync(join(root, ".claude/settings.json"), "utf8"),
  );
  const hooks = settings.hooks.PreToolUse.flatMap((row) => row.hooks);
  const command = "git $FIXTURE_COMMAND";
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

test("guard refusals are journaled once per installed-hook denial without command bytes", async (t) => {
  const root = repo(t, { runtime: true });
  emitHarness(root);
  beginHarnessSession(root, "fixture", "executor");
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
    return JSON.parse(result.stdout);
  };
  const commands = ["git push origin refusal-fixture", "git $FIXTURE_COMMAND"];
  for (const command of commands)
    assert.equal(
      invoke("permissions", "PreToolUse", "Bash", command).hookSpecificOutput
        .permissionDecision,
      "deny",
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
    ).hookSpecificOutput.permissionDecision,
    "deny",
  );
  const stop = invoke("finish", "Stop", undefined, undefined);
  assert.ok(stop.systemMessage);
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
  assert.equal(refusals.length, 3);
  assert.deepEqual(refusals.map((row) => row.refusal.reasonClass).sort(), [
    "authority",
    "command-classification",
    "feedback",
  ]);
  assert.ok(
    refusals.every((row) => row.event === "PreToolUse" && row.tool === "Bash"),
  );
  for (const command of [...commands, "Claude-Session: fixture"])
    assert.ok(!journal.includes(command));
  const measured = (await collectMeta(root)).orders.find(
    (row) => row.workOrder === "WO-999",
  );
  assert.equal(measured.metrics.guardRefusals, 3);
  assert.equal(measured.metrics.stopRefusals, 0);
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

test("commit attribution extracts actual invocation messages and gives actionable refusals", (t) => {
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
  assert.equal(
    invoke("xargs git commit -m fix").hookSpecificOutput.permissionDecision,
    "deny",
  );
  const refused = invoke("git commit");
  assert.match(
    refused.hookSpecificOutput.permissionDecisionReason,
    /command classification: Commit message/,
  );
  assert.doesNotMatch(
    refused.hookSpecificOutput.permissionDecisionReason,
    /runtime unavailable/,
  );
  write(root, "message.txt", "Claude-Session: synthetic\n");
  assert.equal(
    invoke("exec git commit -F message.txt").hookSpecificOutput
      .permissionDecision,
    "deny",
  );
});

test("installed permission hook distinguishes classifier refusal from runtime failure", async (t) => {
  const root = repo(t, { runtime: true });
  emitHarness(root);
  beginHarnessSession(root, "fixture", "executor");
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
    return JSON.parse(result.stdout);
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
      "deny",
    );
  assert.deepEqual(invoke("node -e 'console.log(\n1)'"), {});
  assert.match(
    invoke("git $P").hookSpecificOutput.permissionDecisionReason,
    /command classification: Dynamic/,
  );
  const refused = invoke("echo $(git push)");
  assert.equal(refused.hookSpecificOutput.permissionDecision, "deny");
  assert.match(
    refused.hookSpecificOutput.permissionDecisionReason,
    /command classification: Dynamic/,
  );
  assert.doesNotMatch(
    refused.hookSpecificOutput.permissionDecisionReason,
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

test("harness evidence reuses the current full gate without relabeling or repeating code checks", async (t) => {
  const root = repo(t, { runtime: true });
  emitHarness(root);
  beginHarnessSession(root, "fixture", "executor");
  write(
    root,
    "package.json",
    json({
      type: "module",
      scripts: {
        test: "node .runtime/check.mjs",
        "test:full": "node .runtime/check.mjs",
      },
    }),
  );
  write(
    root,
    ".runtime/check.mjs",
    "import { appendFileSync } from 'node:fs'; appendFileSync('.runtime/runs.txt', process.env.npm_lifecycle_event + '\\n');\n",
  );
  const count = () =>
    readFileSync(join(root, ".runtime/runs.txt"), "utf8").trim().split("\n");
  assert.equal(runHarnessEvidence(root)[0].checkId, "npm run test:full");
  assert.deepEqual(count(), ["test:full"]);

  write(root, "docs/receipt.md", "Documentation changed after measurement.\n");
  const started = Date.now();
  const executed = spawnSync("npm", ["run", "test:full"], {
    cwd: root,
    encoding: "utf8",
  });
  assert.equal(executed.status, 0, executed.stderr);
  const full = {
    ...gate(root),
    durationMs: Date.now() - started,
    evidenceRef: "fixture:executed-npm-full",
  };
  recordGateChecks(root, [full]);
  const reused = runHarnessEvidence(root);
  assert.equal(reused[0].checkId, "npm run test:full");
  assert.equal(reused[0].evidenceRef, full.evidenceRef);
  assert.equal(reused[0].recordedAt, full.recordedAt);
  assert.equal(reused[0].durationMs, full.durationMs);
  assert.deepEqual(count(), ["test:full", "test:full"]);
  assert.equal(findGateCheck(root, "npm test", full.treeHash), undefined);
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
    ["npm run test:full", "git diff --check"],
  );

  write(root, "docs/receipt.md", "New current tree.\n");
  recordGateChecks(root, [
    gate(root, "npm run test:full", 1),
    { ...gate(root), executed: false },
  ]);
  assert.equal(runHarnessEvidence(root)[0].checkId, "npm run test:full");
  assert.deepEqual(count(), ["test:full", "test:full", "test:full"]);
  write(root, "changed-source.js", "export const changed = true;\n");
  assert.equal(runHarnessEvidence(root)[0].checkId, "npm run test:full");
  assert.deepEqual(count(), [
    "test:full",
    "test:full",
    "test:full",
    "test:full",
  ]);
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
    JSON.parse(failed.stdout).hookSpecificOutput.permissionDecisionReason,
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
  assert.throws(
    () =>
      requireBudgets([
        {
          metric: "sequenceBytes",
          value: 8193,
          ceiling: 8192,
          verdict: "breach",
        },
      ]),
    /without a dated acceptance/,
  );
  budgets.acceptances.push({
    date: "2026-09-09",
    metric: "sequenceBytes",
    ceiling: 9000,
    dispatch: "synthetic fixture",
    reason: "fixture",
  });
  assert.equal(budgetVerdict(budgets, "sequenceBytes", 8193, 8192), "accepted");
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
    /WO-999-D001/,
  );
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

test("current-session token collection measures both harnesses and refuses missing, stale or foreign counters", async (t) => {
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
  assert.throws(
    () =>
      recordUsageObservation(root, {
        workOrder: "WO-999",
        role: "executor",
        observation: usageObservation([]),
      }),
    /Token measurement required/,
  );
  assert.equal(
    existsSync(join(root, "docs/control/local/process/usage.jsonl")),
    false,
  );

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
  assert.equal(order.usage.length, 1);
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

test("bare executor next/fix project installed defaults and completion rejects unfinished adjacent work", async (t) => {
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
  assert.match(next.stdout, /running none; next none/);
  const before = snapshot(root);
  const status = call("status", "--json");
  assert.equal(status.status, 0, status.stderr);
  assert.doesNotMatch(status.stdout, /Executor entry duties/);
  assert.deepEqual(snapshot(root), before, "status remains read-only");
  emitHarness(root, {
    supports: { "adjacent-repair": false, "communication-intent": false },
  });
  const off = call("next");
  assert.equal(off.status, 0, off.stderr);
  assert.doesNotMatch(
    off.stdout,
    /Adjacent Repair is equipped|Intent to Act is equipped/,
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
  for (const action of ["implementation-ready", "repair-complete"])
    await assert.rejects(
      requireLifecycleEvidence(root, action, undefined, "WO-999"),
      /unresolved adjacent work.*queued/,
    );
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

test("usage measurement is available on main only for the calling role session", async (t) => {
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
    assert.equal(
      (await invoke(command)).hookSpecificOutput?.permissionDecision,
      "deny",
      command,
    );
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
