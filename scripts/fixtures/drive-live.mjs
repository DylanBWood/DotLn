// An opt-in episode: real phase sessions judge a synthetic registered target.
import assert from "node:assert/strict";
import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readlinkSync,
  readdirSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { randomUUID } from "node:crypto";
import { tmpdir } from "node:os";
import { basename, dirname, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { spawnSync } from "node:child_process";
import { createScratchRoot } from "../lib/temporary-roots.mjs";
import {
  fixture,
  git,
  actor,
  actorArgs,
  restoreFixturePolicies,
} from "../lib/target-worktree-fixture.mjs";
import { redactPaths } from "../lib/git.mjs";
import {
  phaseDefinition,
  driveStatus,
  workerEnvironment,
  requestDriveStop,
} from "../lib/drive-session.mjs";
import { driveHost, launchRole } from "../lib/drive-worker.mjs";
import { readDriveRecord } from "../lib/drive-route.mjs";
import { processRunning } from "../lib/drive-transport.mjs";
import {
  drivenCompletions,
  drivenObservation,
  requireDrivenGates,
  requireDrivenResearch,
} from "../lib/drive-evidence.mjs";
import { write, json } from "../lib/helpers.mjs";
import { TOOL_ROOT, defaultRoots, docPath } from "../lib/config.mjs";

assert.equal(
  process.env.DOTLN_LIVE_HARNESS,
  "1",
  "explicit live fixture opt-in required",
);
const output = resolve(TOOL_ROOT, process.argv[2]);
const host = driveHost(process.argv[3] ?? "claude");
const releaseCloseOnly = process.argv[4] === "--release-close-only";
assert.ok(
  process.argv[4] === undefined || releaseCloseOnly,
  "unknown native qualification mode",
);
const qualificationScope = releaseCloseOnly
  ? "native-router-and-release-close; earlier phases coordinator-seeded"
  : "native-full-lifecycle";
const sandboxDisabled = process.env.DOTLN_LIVE_SANDBOX === "off";
const declaredPermissions =
  process.env.DOTLN_LIVE_PERMISSION_MODE === "default";
const qualificationPermissionReview = declaredPermissions
  ? {
      mode: "default",
      source: "operator-authorized-fixture-local-settings",
      toolAllowance: "native-launcher-declared-tools",
    }
  : { source: "inherited-host-policy" };
const allowDriver = process.env.DOTLN_LIVE_ALLOW_DRIVER === "1";
const driverRule = "Bash(node scripts/drive.mjs WO-999)";
const qualificationLauncherPermission = allowDriver
  ? { source: "operator-approved-fixture-command", rule: driverRule }
  : { source: "inherited-host-policy" };
const qualificationSandbox = sandboxDisabled
  ? {
      enabled: false,
      source: "operator-authorized-fixture-local-settings",
      permissionPolicy: declaredPermissions
        ? "fixture-declared-tools"
        : "inherited",
    }
  : { source: "inherited-host-policy" };
assert.ok(
  process.env.DOTLN_LIVE_SANDBOX === undefined ||
    (sandboxDisabled && host === "claude"),
  "the sandbox-off qualification option requires the Claude fixture",
);
assert.ok(
  process.env.DOTLN_LIVE_ALLOW_DRIVER === undefined ||
    (allowDriver && sandboxDisabled && host === "claude"),
  "the exact launcher grant requires the sandbox-off Claude fixture",
);
assert.ok(
  process.env.DOTLN_LIVE_PERMISSION_MODE === undefined ||
    (declaredPermissions && sandboxDisabled && host === "claude"),
  "declared-tool permission mode requires the sandbox-off Claude fixture",
);
assert.ok(!existsSync(output), "retain prior live observations");
// This fixture exports the same installed kit used by launchpad tests. Its
// document checks and the target's declared tests remain real executable gates.
const exported = await import("../lib/launchpad-fixture.mjs");
const base = realpathSync(
  createScratchRoot(join(tmpdir(), "dotln-drive-live-")),
);
const identities = new Map();
const evidenceJson = (record) =>
  json(
    JSON.parse(
      redactPaths(JSON.stringify(record), [
        [base, "<synthetic-fixture>"],
        [exported.scratch, "<export-fixture>"],
      ]).replace(
        /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi,
        (id) => {
          if (!identities.has(id))
            identities.set(id, `identity-${identities.size + 1}`);
          return identities.get(id);
        },
      ),
    ),
  );
const routerUsage = (rows) => {
  const totals = rows.map((row) =>
    row.usage &&
    Number.isFinite(row.usage.input_tokens) &&
    Number.isFinite(row.usage.output_tokens)
      ? row.usage.input_tokens +
        row.usage.output_tokens +
        (host === "claude"
          ? (row.usage.cache_read_input_tokens ?? 0) +
            (row.usage.cache_creation_input_tokens ?? 0)
          : 0)
      : null,
  );
  return {
    totalTokens: totals.every((value) => value !== null)
      ? totals.reduce((a, b) => a + b, 0)
      : null,
    costUsd: rows.every((row) => row.costUsd !== null)
      ? rows.reduce((sum, row) => sum + row.costUsd, 0)
      : null,
    source: "native-router-result-stream",
    scope: "router sessions only",
  };
};
let stage = "fixture";
let f;
const routers = [];
const driverObservations = [];
const fixturePolicies = [];
let fixtureRetentionReason = null;
const observeDrive = (point) => {
  const observation = { stage, point, observedAt: new Date().toISOString() };
  try {
    observation.state = f
      ? drivenObservation(readDriveRecord(f.main, "WO-999"), processRunning)
      : null;
  } catch {
    observation.unavailable = true;
  }
  driverObservations.push(observation);
};
// Bound the qualification episode independently of the instance's optional
// phase clock; required gates and handoffs can outlast a short probe.
const qualificationTimeoutMs = 150 * 60 * 1000;
const deadline = Date.now() + qualificationTimeoutMs;
const pulse = setInterval(() => {
  if (!f) return;
  try {
    const drive = readDriveRecord(f.main, "WO-999");
    console.log(
      `PROGRESS live fixture ${JSON.stringify({ host, stage, role: drive?.worker?.role ?? null, attempts: drive?.attempts?.length ?? 0, lastCommand: drive?.worker?.lastCommand ?? null })}`,
    );
  } catch {
    /* A final cleanup can remove the observed record. */
  }
}, 30000);
async function stopAndObserve() {
  if (!f) return true;
  requestDriveStop(f.main, "WO-999");
  const until = Date.now() + 15000;
  do {
    const drive = readDriveRecord(f.main, "WO-999");
    if (
      !drive ||
      (!processRunning(drive.driverPid) && !processRunning(drive.worker?.pid))
    )
      return true;
    await new Promise((done) => setTimeout(done, 100));
  } while (Date.now() < until);
  return false;
}
try {
  f = fixture(base, {
    roots: { docs: defaultRoots().docs, control: defaultRoots().control },
    ...(sandboxDisabled
      ? { baseIgnore: "/.claude/settings.local.json\n" }
      : {}),
  });
  const fixtureVocabulary = readFileSync(
    docPath(f.main, "control", "outward-vocabulary.json"),
    "utf8",
  );
  stage = "install-kit";
  for (const name of readdirSync(f.main))
    if (name !== ".git")
      rmSync(join(f.main, name), {
        recursive: true,
        force: true,
        maxRetries: 5,
      });
  for (const name of readdirSync(exported.kit)) {
    if ([".git", "node_modules", ".runtime"].includes(name)) continue;
    cpSync(join(exported.kit, name), join(f.main, name), {
      recursive: true,
      verbatimSymlinks: true,
    });
  }
  assert.equal(
    readlinkSync(join(f.main, "AGENTS.md")),
    readlinkSync(join(exported.kit, "AGENTS.md")),
    "the copied instruction link must retain the kit's relative target",
  );
  assert.equal(
    realpathSync(join(f.main, "AGENTS.md")),
    join(f.main, "CLAUDE.md"),
    "the copied instruction link must resolve inside the fixture",
  );
  stage = "configure-order";
  const kitConfig = JSON.parse(readFileSync(join(f.main, "dotln.config.json")));
  const config = {
    ...kitConfig,
    classes: { ...kitConfig.classes, ...f.config.classes },
    repositories: f.config.repositories,
  };
  config.repositories.target.gate.commands.test.argv = [
    process.execPath,
    "-e",
    "const fs=require('node:fs');if(fs.readFileSync('source.txt','utf8')!=='driven fixture\\n'||!fs.readFileSync(require('node:path').join('docs','README.md'),'utf8').includes('driven fixture'))process.exit(2)",
  ];
  write(f.main, "dotln.config.json", json(config));
  // The kit replaces machinery, while this instance owns publication policy.
  // Keep that fixture input across installation and exercise the same lint
  // that final-review completion uses before spending native-worker time.
  writeFileSync(
    docPath(f.main, "control", "outward-vocabulary.json"),
    fixtureVocabulary,
  );
  const { checkOutwardArtifact } = await import(
    pathToFileURL(join(f.main, "scripts/outward-lint.mjs"))
  );
  const commitLint = (text) =>
    checkOutwardArtifact(f.main, { kind: "commit", text, target: true });
  assert.equal(
    commitLint("feat: set the driven fixture marker").checks.format.status,
    "pass",
  );
  assert.notEqual(
    commitLint("feat: set WO-999 marker").checks.launchpadIdentifiers.status,
    "pass",
  );
  const budgets = JSON.parse(
    readFileSync(docPath(f.main, "control", "budgets.json")),
  );
  // Three required reviewers took one executor to about 15 dollars, and a
  // verifier's repair cycle costs another phase or two.
  budgets.dispatches.router.costUsd = host === "claude" ? 60 : null;
  writeFileSync(docPath(f.main, "control", "budgets.json"), json(budgets));
  write(
    f.main,
    f.order,
    releaseCloseOnly
      ? `# WO-999 — Synthetic native close qualification\n\n**Model:** Use the selected host's generated worker pin.\n**Effort:** executor any; verifier any; reviewer any.\n**Repository:** target @ ${f.baseCommit}\n\nThis isolated fixture's earlier lifecycle is seeded by a deterministic coordinator, not native agents. The only live qualification is the generated router and release-close worker after both synthetic branches are locally merged. Run the canonical no-release close and its normal cleanup. The fixture has no release or external publication.\n`
      : `# WO-999 — Synthetic driven target\n\n**Model:** Use the selected host's generated worker pin.\n**Effort:** executor xhigh; verifier xhigh; reviewer xhigh.\n**Repository:** target @ ${f.baseCommit}\n\nThis is an authorized, isolated live fixture. Change source.txt to exactly "driven fixture" followed by a newline and create docs/README.md documenting that text. Read the registered target profile and documentation root. The research qualification below is the only additional work; retain its public citations in docs/README.md. The target owns the change; the launchpad owns lifecycle records. Use the phase skill and the qualified commands from its briefing. Local commits are authorized at final review. This episode ends immediately after final-review-result pass; target-records, publication and release close are outside this live episode and have separate fixtures. Do not push or open a pull request.\n\n**Acceptance criteria (all required)**\n\n1. source.txt is exactly the required line and docs/README.md documents it.\n2. npm test -- --review passes through this registered target's declared synthetic gate, and npm run test:docs passes in its paired launchpad; no launchpad npm test row supports the target.\n3. The executor performs and cites these actual public lookups: resolve Node.js with npx ctx7@latest library "Node.js" "readFileSync utf8 encoding" and use its returned library ID in npx ctx7@latest docs with the same query; search the public upstash/context7 repository with curl --disable --fail --silent --show-error --max-time 60 "https://api.github.com/search/repositories?q=context7+user:upstash&per_page=1" and read it with curl --disable --fail --silent --show-error --max-time 60 "https://api.github.com/repos/upstash/context7". These public API reads require no GitHub credentials or user configuration. Use the native WebFetch/WebSearch or Codex web search tool to consult the official Node.js fs documentation. Explain in docs/README.md how the retrieved UTF-8 decoding behavior informs the synthetic gate. Run each CLI lookup as its own direct command in the existing cwd, without a compound shell line. A missing adapter, quota or failed lookup is an observed qualification failure; do not substitute a claimed success. Later roles independently judge the retained citations and evidence; they need not repeat successful lookups.\n\n**Evidence gate:** the target gate and the launchpad document gate. The generated phase procedures apply, including independent reviews, actual actor attestations, decisions and one criterion judgment per criterion. Use only source.txt and docs/README.md as product subject; there is no ideation packet. The fixture deliberately has no release. A later fixture coordinator may merge only the local synthetic branches for a separate native release-close episode.\n`,
  );
  git(f.main, "add", "-A");
  git(f.main, "commit", "-qm", "Install synthetic live drive authority");
  git(f.main, "push", "-q", "origin", "main");
  stage = "register-target";
  f.mapClone();
  f.start();
  if (sandboxDisabled)
    for (const checkout of [f.main, f.orderRoot, f.target]) {
      const file = join(checkout, ".claude/settings.local.json");
      const previous = existsSync(file) ? readFileSync(file, "utf8") : null;
      const settings = previous === null ? {} : JSON.parse(previous);
      const applied = json({
        ...settings,
        sandbox: { ...settings.sandbox, enabled: false },
        ...(declaredPermissions || (allowDriver && checkout === f.main)
          ? {
              permissions: {
                ...settings.permissions,
                ...(declaredPermissions ? { defaultMode: "default" } : {}),
                ...(allowDriver && checkout === f.main
                  ? {
                      allow: [
                        ...new Set([
                          ...(settings.permissions?.allow ?? []),
                          driverRule,
                        ]),
                      ],
                    }
                  : {}),
              },
            }
          : {}),
      });
      write(checkout, ".claude/settings.local.json", applied);
      fixturePolicies.push({ checkout, file, previous, applied });
    }
  stage = "hook-health";
  const health = spawnSync(
    process.execPath,
    [join(f.target, ".claude/hooks/permissions.mjs")],
    {
      cwd: f.target,
      env: f.env,
      encoding: "utf8",
      input: JSON.stringify({
        session_id: "synthetic-health",
        cwd: f.target,
        hook_event_name: "PreToolUse",
        tool_name: "Bash",
        tool_input: { command: "pwd" },
      }),
    },
  );
  assert.equal(health.status, 0, health.stderr);
  assert.ok(!JSON.parse(health.stdout).hookSpecificOutput, health.stdout);
  stage = "hook-health-driven";
  const healthBudget = await import(
    pathToFileURL(
      join(f.orderRoot, "packages/skeleton/dist/src/subagent-budget.js"),
    )
  );
  const healthDir = docPath(f.main, "control", "local/drives/health");
  healthBudget.initializeSubagentCounter(healthDir, "synthetic-health");
  const healthContext = join(healthDir, "context.json");
  writeFileSync(
    healthContext,
    json({
      schemaVersion: 1,
      root: f.orderRoot,
      directory: healthDir,
      session: "synthetic-health",
      worker: "synthetic-worker",
      role: "executor",
      workOrder: "WO-999",
      cap: 20,
      ceiling: 80,
    }),
  );
  const drivenHealth = spawnSync(
    process.execPath,
    [join(f.target, ".claude/hooks/permissions.mjs")],
    {
      cwd: f.target,
      env: { ...f.env, DOTLN_DRIVEN_WORKER: healthContext },
      encoding: "utf8",
      input: JSON.stringify({
        session_id: "synthetic-worker",
        cwd: f.target,
        hook_event_name: "PreToolUse",
        tool_name: "Bash",
        tool_input: { command: "pwd" },
      }),
    },
  );
  assert.equal(drivenHealth.status, 0, drivenHealth.stderr);
  assert.ok(
    !JSON.parse(drivenHealth.stdout).hookSpecificOutput,
    drivenHealth.stdout,
  );
  if (releaseCloseOnly) {
    stage = "coordinator-seed";
    write(f.target, "source.txt", "driven fixture\n");
    const targetReadme = join("docs", "README.md");
    write(f.target, targetReadme, "# Synthetic target\n\ndriven fixture\n");
    git(f.target, "add", "source.txt", targetReadme);
    git(f.target, "commit", "-qm", "test: seed the close qualification");
    const report = `# Coordinator-seeded fixture\n\nEarlier phases are synthetic coordinator setup, not native qualification evidence.\n\n**Actor attestation:** ${JSON.stringify(actor)}\n\n**Process cost:** unknown; cause no-session\n\nself-review: found 0; fixed 0; recorded 0\n`;
    const putReport = (root, relative) => {
      const file = docPath(f.orderRoot, root, relative);
      mkdirSync(dirname(file), { recursive: true });
      writeFileSync(file, report);
    };
    putReport("evidence", "WO-999/handoff.md");
    f.ok(f.call(f.target, f.orderRoot, "target-gate", ["WO-999", "--review"]));
    f.ok(f.resume(["implementation-ready", ...actorArgs]));
    f.ok(f.resume(["verify"]));
    putReport("verifications", "WO-999/VER-001.md");
    f.ok(f.resume(["verification-result", "pass", ...actorArgs]));
    f.ok(f.resume(["final-review"]));
    putReport("finalReviews", "WO-999/FINAL-001.md");
    f.ok(f.resume(["final-review-result", "pass", ...actorArgs]));
  }
  stage = "drive";
  const runRouter = async () => {
    const { name, definition, helpers } = await phaseDefinition(
      f.main,
      "router",
      host,
    );
    const worker = randomUUID();
    const definitions = docPath(
      f.main,
      "control",
      `local/${worker}.agents.json`,
    );
    writeFileSync(definitions, json({ [name]: definition, ...helpers }));
    const env = workerEnvironment({
      ...f.env,
      DOTLN_LAUNCHPAD: f.main,
      DOTLN_DRIVE_HOST: host,
      DOTLN_DRIVE_DEADLINE_AT: String(deadline - 15000),
    });
    if (host === "claude") env.CLAUDE_CODE_SESSION_ID = worker;
    const row = await launchRole({
      host,
      launchpad: f.main,
      role: "router",
      definition,
      definitions,
      worker,
      phrase: "drive: WO-999",
      cwd: f.main,
      env,
      deadlineAt: deadline,
    });
    routers.push({
      ...row,
      selectedModel: definition.model,
      selectedEffort: definition.effort,
      role: "router",
      cwd: "main",
    });
    observeDrive("router-ended");
    assert.ok(
      await stopAndObserve(),
      "router must stop its driver and phase before fixture cleanup",
    );
    observeDrive("router-cleanup-ended");
    return readDriveRecord(f.main, "WO-999");
  };
  const result = releaseCloseOnly ? null : await runRouter();
  if (!releaseCloseOnly)
    assert.ok(result, "native router must enter the canonical driver");
  const state = driveStatus(f.main, "WO-999");
  const events = readFileSync(
    docPath(f.orderRoot, "control", "orders/WO-999.jsonl"),
    "utf8",
  )
    .trim()
    .split("\n")
    .map(JSON.parse);
  const record = {
    schemaVersion: 1,
    observedAt: new Date().toISOString(),
    input: "drive: WO-999",
    entrypoint: "generated router's canonical driver",
    qualificationTimeoutMs,
    qualificationScope,
    qualificationSandbox,
    qualificationLauncherPermission,
    qualificationPermissionReview,
    host: spawnSync(host, ["--version"], {
      encoding: "utf8",
    }).stdout.trim(),
    phase: state.phase,
    routers,
    stop: result?.stop ?? null,
    limits: result?.limits ?? null,
    routerUsage: routerUsage(routers),
    budget: result?.budget ?? null,
    workers: result?.attempts ?? [],
    completions: releaseCloseOnly ? [] : drivenCompletions(events),
    ...(releaseCloseOnly
      ? { coordinatorSeed: { phase: state.phase, native: false } }
      : {}),
    publicationExercised: false,
    rawTranscriptsRetained: false,
  };
  mkdirSync(dirname(output), { recursive: true });
  writeFileSync(output, evidenceJson(record), { flag: "wx" });
  assert.equal(
    state.phase,
    "closed",
    "live episode must reach a real passing final review",
  );
  if (!releaseCloseOnly) {
    requireDrivenGates(record.completions);
    requireDrivenResearch(record.workers);
  }
  stage = "restore-phase-fixture-settings";
  restoreFixturePolicies(
    fixturePolicies.filter(({ checkout }) => checkout !== f.main),
  );
  record.fixturePolicyRestoration = {
    count: fixturePolicies.filter(({ checkout }) => checkout !== f.main).length,
    source: "coordinator-owned settings after phase workers ended",
  };
  writeFileSync(output, evidenceJson(record));
  stage = "synthetic-merges";
  for (const [checkout, remote] of [
    [f.main, "launchpad"],
    [f.clone, "target"],
  ]) {
    const expected = join(base, `${remote}.git`);
    assert.equal(git(checkout, "remote", "get-url", "origin"), expected);
    assert.equal(
      git(checkout, "remote", "get-url", "--push", "origin"),
      expected,
    );
  }
  assert.equal(git(f.target, "status", "--porcelain"), "");
  if (git(f.orderRoot, "status", "--porcelain")) {
    git(f.orderRoot, "add", "-A");
    git(f.orderRoot, "commit", "-qm", "Retain synthetic lifecycle records");
  }
  for (const checkout of [f.main, f.clone]) {
    git(
      checkout,
      "merge",
      "-q",
      "--no-ff",
      "-m",
      "Merge synthetic lifecycle",
      "wo-999",
    );
    git(checkout, "push", "-q", "origin", "main");
  }
  stage = "release-close";
  const closed = await runRouter();
  if (releaseCloseOnly) {
    assert.ok(
      closed.attempts.length > 0,
      "native release-close worker must run",
    );
    assert.ok(closed.attempts.every((row) => row.action === "release-close"));
  }
  const receipt = JSON.parse(
    readFileSync(
      docPath(f.main, "control", "local/retained/WO-999/release-close.json"),
      "utf8",
    ),
  );
  Object.assign(record, {
    routers,
    workers: closed.attempts,
    stop: closed.stop,
    budget: closed.budget,
    routerUsage: routerUsage(routers),
    releaseClose: {
      publication: receipt.publication,
      cleanup: receipt.cleanup?.outcome,
      targetCleanup: receipt.targetCleanup?.outcome,
      blockers: (receipt.blockers ?? []).map(({ action, reason }) => ({
        action: ["completion", "publication", "finish"].includes(action)
          ? action
          : "unclassified",
        category: /undeclared ignored material/.test(reason)
          ? "undeclared-ignored-material"
          : /operator-owned settings file/.test(reason)
            ? "operator-settings"
            : "unclassified",
        fixtureSettings: String(reason).includes(".claude/settings.local.json"),
      })),
    },
  });
  writeFileSync(output, evidenceJson(record));
  assert.equal(receipt.publication?.outcome, "no-release");
  assert.equal(receipt.targetCleanup?.outcome, "removed");
  assert.equal(receipt.cleanup?.outcome, "clean");
  assert.equal(git(f.main, "tag", "--list"), "");
  assert.equal(git(f.clone, "tag", "--list"), "");
  console.log(
    json({
      evidence: process.argv[2],
      host,
      phase: state.phase,
      stop: closed.stop,
      workerCount: closed.attempts.length,
      roles: ["router", ...closed.attempts.map((row) => row.action)],
    }),
  );
} catch (error) {
  if (error.code === "FIXTURE_POLICY_CHANGED")
    fixtureRetentionReason = "fixture-policy-changed";
  console.error(`Live fixture ${stage}: ${error.message}`);
  if (!existsSync(output)) {
    mkdirSync(dirname(output), { recursive: true });
    writeFileSync(
      output,
      evidenceJson({
        schemaVersion: 1,
        observedAt: new Date().toISOString(),
        qualificationScope,
        qualificationSandbox,
        qualificationLauncherPermission,
        qualificationPermissionReview,
        stage,
        outcome: "failed",
        cause: redactPaths(error.message, [
          [base, "<synthetic-fixture>"],
          [exported.scratch, "<export-fixture>"],
        ]),
        driveEntered: stage === "drive",
        routers,
        workers: f ? (readDriveRecord(f.main, "WO-999")?.attempts ?? []) : [],
      }),
      { flag: "wx" },
    );
  } else {
    const partial = JSON.parse(readFileSync(output, "utf8"));
    Object.assign(partial, {
      outcome: "failed",
      failedStage: stage,
      cause: redactPaths(error.message, [
        [base, "<synthetic-fixture>"],
        [exported.scratch, "<export-fixture>"],
      ]),
    });
    writeFileSync(output, evidenceJson(partial));
  }
  process.exitCode = 1;
} finally {
  clearInterval(pulse);
  observeDrive("before-final-cleanup");
  const stopped = await stopAndObserve();
  observeDrive("after-final-stop");
  let finalDrive;
  try {
    finalDrive = f ? readDriveRecord(f.main, "WO-999") : null;
  } catch {
    // An incomplete setup can have no readable drive record.
  }
  if (!stopped) {
    process.exitCode = 1;
    console.error(
      "Synthetic fixture retained: a driver or phase is still running; cleanup is refused.",
    );
  }
  // A failed episode's reports are the only account of why it failed. They are
  // synthetic, so they outlive the fixture in ignored local storage.
  if (f)
    for (const records of ["verifications", "finalReviews"]) {
      const reports = docPath(f.orderRoot, records, "WO-999");
      if (existsSync(reports))
        cpSync(
          reports,
          join(
            docPath(TOOL_ROOT, "control", "local/live-drive-reports"),
            basename(output, ".json"),
            records,
          ),
          { recursive: true },
        );
    }
  let removed = stopped && !fixtureRetentionReason;
  if (stopped && !fixtureRetentionReason)
    for (const directory of [base, exported.scratch]) {
      try {
        rmSync(directory, {
          recursive: true,
          force: true,
          maxRetries: 5,
          retryDelay: 100,
        });
      } catch {
        removed = false;
        process.exitCode = 1;
        console.error("Synthetic fixture cleanup remains pending");
      }
    }
  if (existsSync(output)) {
    const record = JSON.parse(readFileSync(output, "utf8"));
    // A later native episode can fail before its success receipt exists.
    // Preserve that router and the latest drive state rather than only the
    // earlier implementation-to-review snapshot.
    const latest = driverObservations.at(-1)?.state;
    record.routers = routers;
    record.routerUsage = routerUsage(routers);
    if (latest) record.stop = latest.stop;
    if (finalDrive) {
      record.workers = finalDrive.attempts;
      record.budget = finalDrive.budget;
      record.limits = finalDrive.limits;
      record.writerConflict = finalDrive.writerConflict ?? null;
    }
    record.driverObservations = driverObservations;
    record.cleanup = {
      workersEnded: stopped,
      outcome: removed ? "removed" : "retained",
      ...(fixtureRetentionReason ? { reason: fixtureRetentionReason } : {}),
    };
    writeFileSync(output, evidenceJson(record));
  }
}
