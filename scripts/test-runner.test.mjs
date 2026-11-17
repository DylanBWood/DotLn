import {
  excludeFixtureOwnership,
  createFixtureRoot,
  readTemporaryOwner,
  registeredTemporaryRoots,
  removeTemporaryPath as rmSync,
} from "./lib/temporary-roots.mjs";
import { spawnGit, execGit, runGit, runGitPathList } from "./lib/git.mjs";
import {
  sourceImports,
  sourceNodes,
  sourceSyntax,
  sourceTreeStarts,
  sourceTrees,
} from "../packages/skeleton/src/source-reading.mjs";
import { copyFixtureFiles } from "./lib/fixture-inputs.mjs";
import test from "node:test";
import assert from "node:assert/strict";

// A case that runs its selection again at an identity its own earlier run
// made green says why, as the runner asks of any forced complete selection:
// without a reason the runner answers with the standing row and runs nothing.
const WHY = ["--reason", "this case runs its selection again on purpose"];
import { execFileSync, spawn, spawnSync } from "node:child_process";
import { gateLoad } from "../packages/skeleton/src/gate-deadlines.mjs";
import { createHash } from "node:crypto";
import {
  chmodSync,
  cpSync,
  existsSync,
  linkSync,
  mkdirSync,
  openSync,
  readFileSync,
  readdirSync,
  writeFileSync,
  realpathSync,
  symlinkSync,
  utimesSync,
} from "node:fs";
import { tmpdir } from "node:os";
import {
  basename,
  delimiter,
  dirname,
  isAbsolute,
  join,
  resolve,
} from "node:path";
import { pathToFileURL } from "node:url";
import { measurementGateForRun } from "./measure-gates.mjs";
import {
  declaredGitFloor,
  declaredNodeRange,
  judgeGitRuntime,
  judgeNodeRuntime,
  judgeRunningNode,
} from "./lib/node-engines.mjs";
import {
  probeEnvironment,
  suiteEnvironment,
  withoutDrivenContext,
} from "./lib/suite-evidence.mjs";
import {
  suites,
  CORE_STRUCTURAL_TASKS,
  STRUCTURAL_TASKS,
  validateSuites,
  expand,
  executeSuite,
  suiteTimeLimit,
  scheduleSuites,
  runGate,
  expandSuiteTasks,
  aggregateSuiteRows,
  changedMachinery,
  changedSinceLastGate,
  lastFailedSuites,
  suitePriorityLeads,
  lightSuiteNames,
  completeSharedRefs,
  sharedRefChanges,
  isKitRoot,
} from "./test-runner.mjs";
import {
  activeGateRuns,
  beginGateRun,
  gateInputPath,
  gateCodeIdentity,
  gateInstanceInputDigest,
  instanceDigestMismatch,
  gateTreeHash,
  findGateCheck,
  partialGateCheck,
  gateRunLineage,
  gateStopRequested,
  GATE_RUN_ENVIRONMENT,
  recordGateChecks,
  readGateChecks,
  readSharedRefs,
  requestGateStop,
} from "./lib/gate-evidence.mjs";
import {
  CONFINED_PARTIAL_CHECK,
  OUTSIDE_CONFINEMENT,
  deniedWriteCode,
  detectHostConfinement,
  probeDeniedWrite,
  confinementMarkers,
} from "./lib/host-confinement.mjs";
import {
  uncoveredMachinerySources,
  machineryCoverageScope,
} from "./lib/machinery-coverage.mjs";
import { sampleFileEventDaemon } from "./lib/host-resources.mjs";
// The table of time limits and the artifact inventory, by module: cases
// throughout this file read the kit's figures from them.
import * as timeLimitsModule from "../packages/skeleton/src/time-limits.mjs";
import * as generatedArtifactsModule from "./lib/generated-artifacts.mjs";

const root = resolve(import.meta.dirname, "..");
const barrier = { name: "build", command: ["build"], build: true };
test("a driven worker's context never reaches a suite's environment", () => {
  const names = [
    "DOTLN_DRIVEN_WORKER",
    "DOTLN_DRIVE_DEADLINE_AT",
    "DOTLN_DRIVE_PARENT_PID",
  ];
  const env = suiteEnvironment({
    PATH: process.env.PATH,
    ...Object.fromEntries(names.map((name) => [name, "from the worker"])),
  });
  for (const name of names) assert.equal(env[name], undefined, name);
  assert.equal(env.DOTLN_GATE_CHILD, "1");
  // A bounded probe keeps its session's environment, but not this context.
  const probe = withoutDrivenContext({
    PATH: "fixture-path",
    ...Object.fromEntries(names.map((name) => [name, "from the worker"])),
  });
  assert.deepEqual(probe, { PATH: "fixture-path" });
});

test("a session's resident binding never reaches a suite's environment", () => {
  // A suite runs the generated hooks against its fixtures, and the hooks carry
  // the presence heartbeat: an inherited binding would record fixture
  // sessions in the invoking session's resident.
  const env = suiteEnvironment({
    PATH: process.env.PATH,
    DOTLN_RESIDENT_STORE: "/fixture/resident",
    DOTLN_RESIDENT_EPISODE_ID: "fixture-episode",
    DOTLN_FIXTURE_OTHER: "kept",
  });
  assert.equal(env.DOTLN_RESIDENT_STORE, undefined);
  assert.equal(env.DOTLN_RESIDENT_EPISODE_ID, undefined);
  assert.equal(env.DOTLN_FIXTURE_OTHER, "kept");
  // A bounded probe, where a case runs alone, drops the store and the driven
  // context and keeps the rest of its session's environment: the episode's
  // identity among it, by which a resident's actor is known as one.
  assert.deepEqual(
    probeEnvironment({
      PATH: "fixture-path",
      HOME: "/fixture/home",
      DOTLN_RESIDENT_STORE: "/fixture/resident",
      DOTLN_RESIDENT_EPISODE_ID: "fixture-episode",
      DOTLN_DRIVEN_WORKER: "from the worker",
    }),
    {
      PATH: "fixture-path",
      HOME: "/fixture/home",
      DOTLN_RESIDENT_EPISODE_ID: "fixture-episode",
    },
  );
});

test("a gate child that finds node or npm by name runs on the selected runtime", (t) => {
  const decoy = createFixtureRoot(join(tmpdir(), "dotln-runtime-decoy-"));
  t.after(() => rmSync(decoy, { recursive: true, force: true }));
  for (const name of ["node", "npm"]) {
    writeFileSync(join(decoy, name), "#!/bin/sh\necho decoy\n");
    chmodSync(join(decoy, name), 0o755);
  }
  const env = suiteEnvironment({
    PATH: [decoy, "/usr/bin", "/bin"].join(delimiter),
  });
  // A shell line, a shebang and npm's own lookup all resolve the same way.
  assert.equal(
    spawnSync("sh", ["-c", "command -v node"], {
      env,
      encoding: "utf8",
    }).stdout.trim(),
    join(dirname(process.execPath), "node"),
  );
  assert.equal(
    spawnSync("/usr/bin/env", ["node", "-p", "process.version"], {
      env,
      encoding: "utf8",
    }).stdout.trim(),
    process.version,
  );
  assert.notEqual(
    spawnSync("sh", ["-c", "command -v npm"], {
      env,
      encoding: "utf8",
    }).stdout.trim(),
    join(decoy, "npm"),
  );
  // The running directory appears once, ahead of an inherited occurrence.
  const repeated = suiteEnvironment({
    PATH: ["fixture-bin", dirname(process.execPath), "fixture-bin"].join(
      delimiter,
    ),
  });
  assert.deepEqual(repeated.PATH.split(delimiter), [
    dirname(process.execPath),
    "fixture-bin",
  ]);
  assert.equal(suiteEnvironment({}).PATH, dirname(process.execPath));
});

test("the registered harness suite executes the driver route tables", () => {
  const row = suites.find((item) => item.name === "harness-fixtures");
  const result = spawnSync(
    row.command[0],
    [
      "--test-name-pattern=router chooses one action|router stop table",
      ...row.command.slice(1),
      ...(row.args ?? []),
    ],
    {
      cwd: root,
      env: suiteEnvironment(),
      encoding: "utf8",
      timeout: 60_000,
    },
  );
  assert.equal(result.status, 0, result.stderr || result.stdout);
  for (const name of [
    "router chooses one action for every phase and requires both target and launchpad merges",
    "router stop table covers controls, operator disposition, refusals, repair bounds and exhausted budgets",
  ])
    assert.match(result.stdout, new RegExp(`ok \\d+ - ${name}`));
});

test("target runner claims do not change self-order handoff or verification claims", async (t) => {
  const repo = createFixtureRoot(join(tmpdir(), "dotln-self-claims-"));
  t.after(() => rmSync(repo, { recursive: true, force: true }));
  mkdirSync(join(repo, "docs/work-orders"), { recursive: true });
  mkdirSync(join(repo, "docs/evidence/WO-999"), { recursive: true });
  const workOrderPath = "docs/work-orders/WO-999-fixture.md";
  writeFileSync(
    join(repo, workOrderPath),
    "# WO-999 — fixture\n\n**Acceptance criteria (all required)**\n\n1. node scripts/target-gate.mjs WO-999 --review passes.\n",
  );
  const report = "docs/evidence/WO-999/handoff.md";
  writeFileSync(
    join(repo, report),
    "**Criterion 1:** met — fixture.\nself-review: found 0; fixed 0; recorded 0\n",
  );
  const { readHandoffLedger, readReportGateClaims } =
    await import("./lib/handoff-ledger.mjs");
  const state = { workOrderId: "WO-999", workOrderPath };
  for (const read of [
    () => readHandoffLedger(repo, state),
    () => readReportGateClaims(repo, state, report),
  ])
    assert.deepEqual(read().claims, { document: [], review: [], plain: [] });
  state.repositoryId = "target";
  assert.deepEqual(readHandoffLedger(repo, state).claims, {
    document: [],
    review: ["1"],
    plain: ["1"],
  });
});

test("target claims use only current target selection rows and consume the document row", async (t) => {
  const base = realpathSync(
    createFixtureRoot(join(tmpdir(), "dotln-target-claims-")),
  );
  t.after(() => rmSync(base, { recursive: true, force: true }));
  const repo = join(base, "launchpad"),
    target = join(base, "target");
  for (const path of [repo, target]) {
    mkdirSync(path);
    runGit(path, ["init", "-q", "-b", "wo-999"]);
    excludeFixtureOwnership(path);
    runGit(path, ["config", "user.name", "Fixture"]);
    runGit(path, ["config", "user.email", "fixture@example.invalid"]);
    writeFileSync(join(path, ".gitignore"), "/docs/control/local/\n");
    runGit(path, ["add", ".gitignore"]);
    runGit(path, [
      "-c",
      "maintenance.auto=false",
      "commit",
      "-qm",
      "test: base",
    ]);
  }
  const commit = runGit(target, ["rev-parse", "HEAD"]);
  const state = {
    workOrderId: "WO-999",
    repositoryId: "target",
    baseCommit: commit,
  };
  writeFileSync(
    join(repo, "dotln.config.json"),
    JSON.stringify({
      version: 1,
      classes: { fixture: { checks: [], supports: [] } },
      repositories: {
        target: {
          baseBranch: "main",
          worktreeParent: "../targets",
          repositoryClass: "fixture",
          authorityProfile: {
            authorityEnvelopeId: "fixture",
            allowedEffects: ["repo.test"],
            deniedEffects: [],
            resourceLimits: {},
            requiredEvidence: [],
            expiresAt: Number.MAX_SAFE_INTEGER,
            revocationEventTypes: [],
          },
          gate: {
            commands: {
              test: { argv: ["node", "test.mjs"], timeoutMs: 1000 },
              lint: { argv: ["node", "lint.mjs"], timeoutMs: 1000 },
            },
            plain: ["test"],
            review: ["test", "lint"],
          },
        },
      },
    }),
  );
  const { recordTargetWorktree } = await import("./lib/target-worktrees.mjs");
  recordTargetWorktree(repo, {
    ...state,
    target,
    launchpad: repo,
    branch: "wo-999",
  });
  const { requireGateClaims } = await import("./lib/handoff-ledger.mjs");
  const { gateCommandsHash } = await import("./lib/target-gate.mjs");
  const config = JSON.parse(
    readFileSync(join(repo, "dotln.config.json"), "utf8"),
  );
  const ledger = {
    checked: true,
    claims: { plain: ["1"], review: [], document: [] },
  };
  const check = () => requireGateClaims(repo, ledger, { state });
  await assert.rejects(
    check,
    (error) =>
      /plain target gate is missing/u.test(error.message) &&
      error.message.includes(
        `run node '${join(repo, "scripts/target-gate.mjs")}' WO-999`,
      ),
  );
  const row = {
    checkId: "target:target",
    repositoryId: "target",
    commit,
    selection: "plain",
    names: ["test"],
    commandsHash: gateCommandsHash(config.repositories.target.gate, ["test"]),
    treeHash: gateTreeHash(target),
    executed: true,
    exitCode: 0,
    durationMs: 1,
    evidenceRef: "fixture:target",
    recordedAt: "2026-10-14T10:00:00.000Z",
  };
  recordGateChecks(repo, [row]);
  assert.equal((await check()).targetGate.commit, commit);
  assert.equal((await check()).productGate, undefined);
  assert.equal(
    (
      await requireGateClaims(repo, ledger, {
        state,
        gateIndexError: "fixture unavailable",
        log: { warn() {} },
      })
    ).targetGate.commit,
    commit,
  );
  ledger.claims.review = ["2"];
  await assert.rejects(check, /review target gate is missing/u);
  const review = {
    ...row,
    selection: "review",
    names: ["test", "lint"],
    commandsHash: gateCommandsHash(config.repositories.target.gate, [
      "test",
      "lint",
    ]),
    evidenceRef: "fixture:review",
    recordedAt: "2026-10-14T10:00:01.000Z",
  };
  recordGateChecks(repo, [review]);
  assert.deepEqual((await check()).targetGate.names, ["test", "lint"]);
  recordGateChecks(repo, [
    {
      ...review,
      exitCode: 1,
      evidenceRef: "fixture:failure",
      recordedAt: "2026-10-14T10:00:02.000Z",
    },
  ]);
  await assert.rejects(check, /review target gate is failed/u);
  recordGateChecks(repo, [
    {
      ...review,
      evidenceRef: "fixture:repair",
      recordedAt: "2026-10-14T10:00:03.000Z",
    },
  ]);
  assert.ok((await check()).targetGate);
  config.repositories.target.gate.commands.test.argv = [
    "node",
    "changed-test.mjs",
  ];
  writeFileSync(join(repo, "dotln.config.json"), JSON.stringify(config));
  await assert.rejects(check, /review target gate is missing/u);
  config.repositories.target.gate.commands.test.argv = ["node", "test.mjs"];
  writeFileSync(join(repo, "dotln.config.json"), JSON.stringify(config));
  writeFileSync(join(target, "untracked.txt"), "new bytes");
  await assert.rejects(check, /review target gate is stale/u);
  rmSync(join(target, "untracked.txt"));
  // implementation-ready, repair-complete and verification-result all resolve
  // target claims here. A damaged index refuses each selection in one line
  // naming the index relative to the launchpad and the rerun, with or without
  // the diff check's failed write, and leaves the damaged bytes in place.
  const index = join(repo, "docs/control/local/harness/checks.json");
  const indexBytes = readFileSync(index);
  for (const damaged of ['[{"checkId":"target:', '["row"]', '{"rows":[]}'])
    for (const selection of ["plain", "review"])
      for (const gateIndexError of [undefined, "fixture unavailable"]) {
        writeFileSync(index, damaged);
        const warnings = [];
        await assert.rejects(
          () =>
            requireGateClaims(
              repo,
              {
                checked: true,
                claims: {
                  plain: ["1"],
                  review: selection === "review" ? ["2"] : [],
                  document: [],
                },
              },
              {
                state,
                gateIndexError,
                log: { warn: (line) => warnings.push(line) },
              },
            ),
          (error) => {
            assert.equal(
              error.message,
              `target ${selection} target gate index cannot be read: docs/control/local/harness/checks.json or an archive in docs/control/local/harness/check-history is unreadable or malformed; move the damaged file aside, then run node '${join(repo, "scripts/target-gate.mjs")}' WO-999${selection === "review" ? " --review" : ""}`,
            );
            return true;
          },
        );
        assert.deepEqual(warnings, []);
        assert.equal(readFileSync(index, "utf8"), damaged);
      }
  writeFileSync(index, indexBytes);
  assert.ok((await check()).targetGate);
  // A damaged check-history archive beside an intact index refuses the same.
  const archive = join(
    repo,
    "docs/control/local/harness/check-history",
    `${"a".repeat(40)}.json`,
  );
  mkdirSync(dirname(archive), { recursive: true });
  writeFileSync(archive, "{");
  await assert.rejects(
    check,
    (error) =>
      error.message ===
      `target review target gate index cannot be read: docs/control/local/harness/checks.json or an archive in docs/control/local/harness/check-history is unreadable or malformed; move the damaged file aside, then run node '${join(repo, "scripts/target-gate.mjs")}' WO-999 --review`,
  );
  assert.equal(readFileSync(archive, "utf8"), "{");
  rmSync(archive);
  assert.ok((await check()).targetGate);
  // Completion consumes the launchpad's document row and runs no gate: the
  // runner is present but never executed.
  ledger.claims.document = ["3"];
  const runner = join(base, "document-runner.mjs");
  writeFileSync(
    runner,
    "console.error('the document gate must be consumed, not run'); process.exit(1);\n",
  );
  const consume = () =>
    requireGateClaims(repo, ledger, {
      state,
      runner,
      log: { log() {}, warn() {} },
    });
  await assert.rejects(
    consume,
    /Handoff document row missing or failed at the current code identity/u,
  );
  const documentRow = {
    checkId: "npm run test:docs",
    codeIdentity: gateCodeIdentity(repo),
    treeHash: gateTreeHash(repo),
    subject: gateTreeHash(repo),
    requiredSuites: ["docs-check"],
    cases: [
      {
        name: "docs-check",
        executed: true,
        exitCode: 0,
        durationMs: 1,
        startedAt: "2026-10-14T10:00:03.900Z",
        finishedAt: "2026-10-14T10:00:03.901Z",
      },
    ],
    executed: true,
    exitCode: 0,
    durationMs: 1,
    evidenceRef: "fixture:docs",
    recordedAt: "2026-10-14T10:00:05.000Z",
  };
  recordGateChecks(repo, [
    {
      ...documentRow,
      exitCode: 1,
      evidenceRef: "fixture:docs-failed",
      recordedAt: "2026-10-14T10:00:04.000Z",
    },
  ]);
  await assert.rejects(
    consume,
    /Handoff document row missing or failed at the current code identity/u,
  );
  recordGateChecks(repo, [documentRow]);
  assert.equal((await consume()).documentGate.evidenceRef, "fixture:docs");
});

test("document completion requires the exact records judged, including reports and generated indexes", async (t) => {
  const { requireDocumentRow } = await import("./lib/handoff-ledger.mjs");
  const repo = createFixtureRoot(join(tmpdir(), "dotln-document-records-"));
  t.after(() => rmSync(repo, { recursive: true, force: true }));
  runGit(repo, ["init", "-q", "-b", "wo-999"]);
  excludeFixtureOwnership(repo);
  const write = (path, source) => {
    mkdirSync(dirname(join(repo, path)), { recursive: true });
    writeFileSync(join(repo, path), source);
  };
  write(".gitignore", "docs/control/local/\n");
  write("source.mjs", "export const result = 1;\n");
  const paths = [
    "docs/evidence/WO-999/decisions.md",
    "docs/evidence/WO-999/handoff.md",
    "docs/evidence/WO-999/self-review.md",
    "docs/verifications/WO-999/VER-001.md",
    "docs/final-reviews/WO-999/FINAL-001.md",
    "docs/control/orders/WO-999.jsonl",
    "docs/control/current.md",
    "docs/lineage/decisions-index.md",
    "docs/work-orders/README.md",
    "docs/planning/fixture.md",
    "docs/product/contract.md",
    "docs/evidence/current.json",
  ];
  for (const path of paths) write(path, "Original checked record\n");
  const row = {
    checkId: "npm run test:docs",
    codeIdentity: gateCodeIdentity(repo),
    treeHash: gateTreeHash(repo),
    subject: "fixture",
    executed: true,
    exitCode: 0,
    durationMs: 1,
    requiredSuites: ["docs-check"],
    evidenceRef: "fixture:document-pass",
    recordedAt: "2030-01-01T00:00:01Z",
    cases: [
      {
        name: "docs-check",
        executed: true,
        exitCode: 0,
        durationMs: 1,
        finishedAt: "2030-01-01T00:00:00Z",
      },
    ],
  };
  recordGateChecks(repo, [row]);
  assert.equal(
    (await requireDocumentRow(repo)).row.evidenceRef,
    row.evidenceRef,
  );
  for (const path of paths) {
    write(path, "Changed record with [broken link](missing.md)\n");
    assert.notEqual(gateTreeHash(repo), row.treeHash);
    assert.ok((await requireDocumentRow(repo)).refusal, path);
    write(path, "Original checked record\n");
    assert.equal(
      (await requireDocumentRow(repo)).row.evidenceRef,
      row.evidenceRef,
    );
  }
  write("docs/control/local/session-notes.txt", "Ignored local notes\n");
  assert.equal(gateTreeHash(repo), row.treeHash);
  assert.equal(
    (await requireDocumentRow(repo)).row.evidenceRef,
    row.evidenceRef,
  );
  write("source.mjs", "export const result = 2;\n");
  assert.ok((await requireDocumentRow(repo)).refusal);
});

test("WO-238 a document row bound to the tree without the active order's evidence stands after that order's later records, and only there", async (t) => {
  const { requireDocumentRow } = await import("./lib/handoff-ledger.mjs");
  const repo = createFixtureRoot(
    join(tmpdir(), "dotln-document-less-evidence-"),
  );
  t.after(() => rmSync(repo, { recursive: true, force: true }));
  runGit(repo, ["init", "-q", "-b", "wo-999"]);
  excludeFixtureOwnership(repo);
  const write = (path, source) => {
    mkdirSync(dirname(join(repo, path)), { recursive: true });
    writeFileSync(join(repo, path), source);
  };
  write(".gitignore", "docs/control/local/\n");
  write("source.mjs", "export const result = 1;\n");
  for (const path of [
    "docs/evidence/WO-999/decisions.md",
    "docs/evidence/WO-999/handoff.md",
    "docs/evidence/WO-998/decisions.md",
    "docs/product/contract.md",
  ])
    write(path, "Original checked record\n");
  const excludes = "docs/evidence/WO-999";
  recordGateChecks(repo, [
    {
      checkId: "npm run test:docs",
      codeIdentity: gateCodeIdentity(repo),
      treeHash: gateTreeHash(repo),
      documentTreeHash: gateTreeHash(repo, { exclude: [excludes] }),
      documentTreeExcludes: excludes,
      subject: "fixture",
      executed: true,
      exitCode: 0,
      durationMs: 1,
      requiredSuites: ["docs-check"],
      evidenceRef: "fixture:document-less-evidence",
      recordedAt: "2030-01-01T00:00:01Z",
      cases: [
        {
          name: "docs-check",
          executed: true,
          exitCode: 0,
          durationMs: 1,
          finishedAt: "2030-01-01T00:00:00Z",
        },
      ],
    },
  ]);
  // The order's own decisions and handoff, written after its document gate.
  write("docs/evidence/WO-999/handoff.md", "**Criterion 1:** met\n");
  write("docs/evidence/WO-999/self-review.md", "New record\n");
  const standing = await requireDocumentRow(repo);
  assert.equal(standing.row.evidenceRef, "fixture:document-less-evidence");
  assert.equal(standing.candidates.length, 1);
  // Another order's records, a standing document and source are judged as
  // the exact tree.
  for (const [path, original] of [
    ["docs/evidence/WO-998/decisions.md", "Original checked record\n"],
    ["docs/product/contract.md", "Original checked record\n"],
    ["source.mjs", "export const result = 1;\n"],
  ]) {
    write(path, "Changed after the gate\n");
    assert.ok((await requireDocumentRow(repo)).refusal, path);
    write(path, original);
  }
  assert.equal(
    (await requireDocumentRow(repo)).row.evidenceRef,
    "fixture:document-less-evidence",
  );
});

test("WO-238 the repeated document-gate advisory counts the runs of the current handoff only: one required run in each phase is no repetition, two trees in one handoff are", async (t) => {
  const { requireGateClaims } = await import("./lib/handoff-ledger.mjs");
  const { handoffStartedAt } = await import("./lib/control-time.mjs");
  // The handoff begins at the order's latest phase start or reopening.
  assert.equal(
    handoffStartedAt([
      { type: "WorkOrderActivated", recordedAt: "2030-01-01T00:00:00.000Z" },
      { type: "ImplementationReady", recordedAt: "2030-01-01T00:00:30.000Z" },
      { type: "VerificationRequested", recordedAt: "2030-01-01T00:01:00.000Z" },
    ]),
    "2030-01-01T00:01:00.000Z",
  );
  assert.equal(handoffStartedAt([{ type: "RepairRequested" }]), null);
  const repo = createFixtureRoot(join(tmpdir(), "dotln-handoff-repeat-"));
  t.after(() => rmSync(repo, { recursive: true, force: true }));
  runGit(repo, ["init", "-q", "-b", "wo-901"]);
  excludeFixtureOwnership(repo);
  const write = (path, source) => {
    mkdirSync(dirname(join(repo, path)), { recursive: true });
    writeFileSync(join(repo, path), source);
  };
  write(".gitignore", "docs/control/local/\n");
  write("source.mjs", "export const unchanged = true;\n");
  write("docs/evidence/WO-901/handoff.md", "Executor handoff\n");
  const identity = gateCodeIdentity(repo);
  const row = (name, at) => ({
    checkId: "npm run test:docs",
    codeIdentity: identity,
    treeHash: gateTreeHash(repo),
    subject: "fixture",
    executed: true,
    exitCode: 0,
    durationMs: 1,
    requiredSuites: ["docs-check"],
    evidenceRef: `fixture:${name}`,
    recordedAt: at,
    cases: [
      {
        name: "docs-check",
        executed: true,
        exitCode: 0,
        durationMs: 1,
        finishedAt: at,
      },
    ],
  });
  const ledger = {
    checked: true,
    claims: { plain: [], review: [], document: ["13"] },
  };
  const claim = (phase, handoffStart) =>
    requireGateClaims(repo, ledger, {
      runner: join(root, "scripts/test-runner.mjs"),
      state: { workOrderId: "WO-901", phase },
      log: { warn() {} },
      handoffStart,
    });
  // The executor's handoff runs the document gate once.
  recordGateChecks(repo, [row("executor", "2030-01-01T00:00:01.000Z")]);
  assert.deepEqual(
    (await claim("active", "2030-01-01T00:00:00.000Z")).advisories,
    [],
  );
  // The verifier's handoff adds its report and runs the gate once on it.
  write("docs/verifications/WO-901/VER-001.md", "Verifier report\n");
  assert.equal(gateCodeIdentity(repo), identity);
  recordGateChecks(repo, [row("verifier", "2030-01-01T00:01:01.000Z")]);
  const verified = await claim("verifying", "2030-01-01T00:01:00.000Z");
  assert.equal(verified.documentGate.evidenceRef, "fixture:verifier");
  assert.deepEqual(verified.advisories, []);
  // Without a handoff bound the two phases' runs read as one handoff's two.
  assert.match(
    (await claim("verifying", null)).advisories.join("\n"),
    /^Handoff failure: 2 document-gate runs judged 2 trees at this code identity;/mu,
  );
  // A second tree within the verifier's own handoff is a repetition.
  write("docs/verifications/WO-901/VER-001.md", "Verifier report, edited\n");
  recordGateChecks(repo, [row("verifier-again", "2030-01-01T00:02:01.000Z")]);
  const repeated = await claim("verifying", "2030-01-01T00:01:00.000Z");
  assert.equal(repeated.documentGate.evidenceRef, "fixture:verifier-again");
  assert.deepEqual(repeated.advisories, [
    "Handoff failure: 2 document-gate runs judged 2 trees at this code identity since this handoff began at 2030-01-01T00:01:00.000Z; records written into the order's own evidence after a passing document gate keep its row standing, so only a change outside that directory needs another run.",
  ]);
});

test("document completion covers relocated records and configured record roots cannot hide source", async (t) => {
  const { requireDocumentRow } = await import("./lib/handoff-ledger.mjs");
  const repo = createFixtureRoot(join(tmpdir(), "dotln-document-roots-"));
  t.after(() => rmSync(repo, { recursive: true, force: true }));
  runGit(repo, ["init", "-q", "-b", "wo-999"]);
  excludeFixtureOwnership(repo);
  writeFileSync(
    join(repo, ".gitignore"),
    "docs/control/local/\nrecords/control/local/\n",
  );
  writeFileSync(
    join(repo, "dotln.config.json"),
    JSON.stringify({
      version: 1,
      roots: { evidence: "records/evidence", control: "records/control" },
    }),
  );
  mkdirSync(join(repo, "records/evidence/WO-999"), { recursive: true });
  const record = join(repo, "records/evidence/WO-999/handoff.md");
  writeFileSync(record, "Checked report.\n");
  const row = {
    checkId: "npm run test:docs",
    codeIdentity: gateCodeIdentity(repo),
    treeHash: gateTreeHash(repo),
    subject: "fixture",
    executed: true,
    exitCode: 0,
    durationMs: 1,
    evidenceRef: "fixture:relocated",
    recordedAt: "2030-01-01T00:00:01Z",
    requiredSuites: ["docs-check"],
    cases: [
      {
        name: "docs-check",
        executed: true,
        exitCode: 0,
        durationMs: 1,
        finishedAt: "2030-01-01T00:00:00Z",
      },
    ],
  };
  recordGateChecks(repo, [row]);
  assert.equal(
    (await requireDocumentRow(repo)).row.evidenceRef,
    row.evidenceRef,
  );
  writeFileSync(record, "Changed report.\n");
  assert.notEqual(gateCodeIdentity(repo), row.codeIdentity);
  assert.ok((await requireDocumentRow(repo)).refusal);
  mkdirSync(join(repo, "scripts"), { recursive: true });
  writeFileSync(join(repo, "scripts/source.mjs"), "export const value = 1;\n");
  writeFileSync(
    join(repo, "dotln.config.json"),
    JSON.stringify({ version: 1, roots: { verifications: "scripts" } }),
  );
  const before = gateCodeIdentity(repo);
  writeFileSync(join(repo, "scripts/source.mjs"), "export const value = 2;\n");
  assert.notEqual(gateCodeIdentity(repo), before);
});

test("records publication proves unchanged launchpad identity or requires the reviewer gate", async (t) => {
  const repo = realpathSync(
    createFixtureRoot(join(tmpdir(), "dotln-records-identity-")),
  );
  t.after(() => rmSync(repo, { recursive: true, force: true }));
  runGit(repo, ["init", "-q", "-b", "wo-999"]);
  excludeFixtureOwnership(repo);
  runGit(repo, ["config", "user.name", "Fixture"]);
  runGit(repo, ["config", "user.email", "fixture@example.invalid"]);
  writeFileSync(join(repo, "source.txt"), "source\n");
  runGit(repo, ["add", "-A"]);
  runGit(repo, [
    "-c",
    "maintenance.auto=false",
    "commit",
    "-qm",
    "test: source",
  ]);
  runGit(repo, ["update-ref", "refs/remotes/origin/main", "HEAD"]);
  mkdirSync(join(repo, "docs"));
  writeFileSync(join(repo, "docs/record.md"), "record\n");
  runGit(repo, ["add", "-A"]);
  runGit(repo, [
    "-c",
    "maintenance.auto=false",
    "commit",
    "-qm",
    "docs: records",
  ]);
  const { reviewedLaunchpadIdentity } =
    await import("./lib/release-records.mjs");
  const { assertGitHubBodyProfile } = await import("./lib/github-body.mjs");
  const proof = reviewedLaunchpadIdentity(repo, "WO-999");
  assert.equal(proof.unchanged, true);
  assert.equal(proof.headIdentity, proof.baseIdentity);
  assert.ok(proof.body.includes(proof.headIdentity));
  assertGitHubBodyProfile(proof.body, "records publication proof");
  writeFileSync(join(repo, "source.txt"), "changed\n");
  runGit(repo, ["add", "-A"]);
  runGit(repo, [
    "-c",
    "maintenance.auto=false",
    "commit",
    "-qm",
    "fix: source",
  ]);
  assert.throws(
    () => reviewedLaunchpadIdentity(repo, "WO-999"),
    /no recorded passing reviewer npm test row/u,
  );
});
test("bounded command uses the requested cwd and deadline with launchpad budgets", async (t) => {
  const directory = realpathSync(
    createFixtureRoot(join(tmpdir(), "dotln-bounded-cwd-")),
  );
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  const { boundedCommand } = await import("./lib/bounded-command.mjs");
  const lines = [];
  const result = await boundedCommand(
    [
      "--timeout-seconds",
      "1",
      "--",
      process.execPath,
      "-e",
      "console.log(process.cwd()); setTimeout(() => {}, 10000)",
    ],
    root,
    {
      cwd: directory,
      report: (line) => lines.push(line),
      output: () => {},
    },
  );
  assert.match(
    result.output,
    new RegExp(directory.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")),
  );
  assert.notEqual(result.exitCode, 0);
  assert.ok(result.durationMs < 5000);
  const started = JSON.parse(
    lines
      .find((line) => line.startsWith("bounded-start "))
      .slice("bounded-start ".length),
  );
  assert.equal(started.deadlineMs, 1000);
  for (const value of ["0", "-1", "1.5", "21601", "NaN"])
    await assert.rejects(
      boundedCommand(
        ["--timeout-seconds", value, "--", process.execPath, "-e", "0"],
        root,
      ),
      /probe timeout must be/,
    );
});
test("kit defaults separate runtime integrity from documents and explicit platform diagnostics", async (t) => {
  const repo = createFixtureRoot(join(tmpdir(), "dotln-kit-list-"));
  t.after(() => rmSync(repo, { recursive: true, force: true }));
  writeFileSync(join(repo, "KIT-MANIFEST.json"), "{}\n");
  const lines = [];
  const log = console.log;
  try {
    console.log = (line) => lines.push(String(line));
    for (const args of [[], ["--document"]]) {
      lines.length = 0;
      assert.equal((await runGate([...args, "--list"], repo)).exitCode, 0);
      assert.deepEqual(
        lines
          .filter((line) => line.includes(" — protects:"))
          .map((line) => line.split(" — ")[0]),
        args.includes("--document")
          ? [
              ...STRUCTURAL_TASKS,
              "kit-verify",
              "license-surfaces",
              "docs-check",
              // An instance's document gate screens its branch with its own
              // local-terms list (WO-259).
              "terms",
              "harness-context",
              "plan-refutation-current",
              "plan",
              "reader-profiles",
              "entropy",
            ]
          : [...STRUCTURAL_TASKS, "kit-verify"],
      );
      assert.ok(!lines.some((line) => line.startsWith("kit: ")));
    }
    for (const args of [
      ["--only", "target-worktree"],
      ["--machinery"],
      ["--review"],
      ["--full"],
    ]) {
      lines.length = 0;
      assert.equal((await runGate([...args, "--list"], repo)).exitCode, 0);
      const names = lines
        .filter((line) => line.includes(" — protects:"))
        .map((line) => line.split(" — ")[0]);
      assert.deepEqual(names.slice(0, 6), STRUCTURAL_TASKS);
      assert.ok(names.includes("kit-verify"));
      assert.ok(
        names.includes(
          args.includes("--only") ? "target-worktree" : "fixture-temp-root",
        ),
      );
      assert.deepEqual(
        lines.filter((line) => line.startsWith("kit: ")).sort(),
        suites
          .filter((row) => row.kit)
          .map(
            (row) =>
              `kit: ${row.name} not carried (${row.kit.slice("core-only: ".length)})`,
          )
          .sort(),
      );
    }
    lines.length = 0;
    assert.equal((await runGate(["--list"], root)).exitCode, 0);
    assert.ok(
      lines.some((line) => line.startsWith("target-worktree — protects:")),
    );
    assert.ok(lines.some((line) => line.startsWith("build — protects:")));
  } finally {
    console.log = log;
  }
});

test("the installed-runtime digest comparison names a missing recorded digest apart from a different one", () => {
  assert.equal(instanceDigestMismatch({}, undefined), null);
  assert.equal(
    instanceDigestMismatch({ instanceInputDigest: "a" }, undefined),
    null,
  );
  assert.equal(instanceDigestMismatch({ instanceInputDigest: "a" }, "a"), null);
  assert.equal(instanceDigestMismatch({}, "a"), "missing");
  assert.equal(
    instanceDigestMismatch({ instanceInputDigest: "b" }, "a"),
    "different",
  );
});

test("instance runtime digests reject aliases before selection and frame arbitrary file bytes", (t) => {
  const base = createFixtureRoot(join(tmpdir(), "dotln-runtime-digest-"));
  t.after(() => rmSync(base, { recursive: true, force: true }));
  const repo = join(base, "instance"),
    outside = join(base, "outside");
  mkdirSync(repo);
  mkdirSync(outside);
  writeFileSync(join(repo, "KIT-MANIFEST.json"), "{}\n");
  for (const alias of [".claude", "packages", ".runtime"]) {
    symlinkSync(outside, join(repo, alias), "dir");
    assert.throws(
      () => gateInstanceInputDigest(repo),
      /must stay within/u,
      alias,
    );
    rmSync(join(repo, alias));
  }
  mkdirSync(join(repo, "packages"));
  symlinkSync(outside, join(repo, "packages/alias"), "dir");
  assert.throws(() => gateInstanceInputDigest(repo), /must stay within/u);
  rmSync(join(repo, "packages"), { recursive: true });
  for (const path of [
    ".claude/hooks/finish.mjs",
    ".claude/settings.json",
    ".claude/agents/dotln-worker.md",
    ".claude/agents/dotln-worker-fable.md",
    ".claude/agents/dotln-executor.md",
    ".claude/agents/dotln-verifier.md",
    ".claude/agents/dotln-reviewer.md",
    ".claude/agents/dotln-release-close.md",
    ".agents/skills/dotln-executor/SKILL.md",
    ".codex/hooks/continuation.mjs",
    ".codex/agents/dotln-worker-astra.toml",
    "CLAUDE.md",
  ]) {
    mkdirSync(dirname(join(repo, path)), { recursive: true });
    writeFileSync(join(repo, path), "valid\n");
  }
  writeFileSync(
    join(repo, ".claude/harness-manifest.json"),
    JSON.stringify({
      installed: [
        ".claude/hooks/finish.mjs",
        ".claude/settings.json",
        ".claude/agents/dotln-worker.md",
        ".claude/agents/dotln-worker-fable.md",
        ".claude/agents/dotln-executor.md",
        ".claude/agents/dotln-verifier.md",
        ".claude/agents/dotln-reviewer.md",
        ".claude/agents/dotln-release-close.md",
        ".agents/skills/dotln-executor/SKILL.md",
        ".codex/hooks/continuation.mjs",
        ".codex/agents/dotln-worker-astra.toml",
        "CLAUDE.md",
      ].map((path) => ({ path })),
    }),
  );
  const surfaces = gateInstanceInputDigest(repo);
  for (const path of [
    ".claude/hooks/finish.mjs",
    ".claude/settings.json",
    ".claude/agents/dotln-worker.md",
    ".claude/agents/dotln-worker-fable.md",
    ".claude/agents/dotln-executor.md",
    ".claude/agents/dotln-verifier.md",
    ".claude/agents/dotln-reviewer.md",
    ".claude/agents/dotln-release-close.md",
    ".agents/skills/dotln-executor/SKILL.md",
    ".codex/hooks/continuation.mjs",
    ".codex/agents/dotln-worker-astra.toml",
    "CLAUDE.md",
  ]) {
    writeFileSync(join(repo, path), "changed\n");
    assert.notEqual(gateInstanceInputDigest(repo), surfaces, path);
    rmSync(join(repo, path));
    assert.notEqual(gateInstanceInputDigest(repo), surfaces, `missing ${path}`);
    symlinkSync(join(outside, "missing"), join(repo, path));
    assert.throws(
      () => gateInstanceInputDigest(repo),
      /must stay within/u,
      path,
    );
    rmSync(join(repo, path));
    writeFileSync(join(repo, path), "valid\n");
  }
  const manifestPath = join(repo, ".claude/harness-manifest.json");
  const manifest = readFileSync(manifestPath, "utf8");
  const invalid = JSON.parse(manifest);
  invalid.installed.push({ path: ".claude/agents/dotln-worker-custom.md" });
  writeFileSync(manifestPath, JSON.stringify(invalid));
  assert.throws(
    () => gateInstanceInputDigest(repo),
    /not a generated surface/u,
  );
  writeFileSync(manifestPath, manifest);
  writeFileSync(join(repo, ".claude/hooks/unexpected.mjs"), "export {};\n");
  assert.notEqual(gateInstanceInputDigest(repo), surfaces);
  rmSync(join(repo, ".claude/hooks/unexpected.mjs"));
  assert.equal(gateInstanceInputDigest(repo), surfaces);
  const runtime = join(repo, ".runtime/harness");
  mkdirSync(runtime, { recursive: true });
  writeFileSync(join(runtime, "a"), "A\0.runtime/harness/b\0file:0\0B");
  const framed = gateInstanceInputDigest(repo);
  writeFileSync(join(runtime, "a"), "A");
  writeFileSync(join(runtime, "b"), "B");
  assert.notEqual(gateInstanceInputDigest(repo), framed);
  const snapshot = join(runtime, "0123456789abcdef");
  mkdirSync(join(snapshot, "packages/compiler"), { recursive: true });
  mkdirSync(join(snapshot, "node_modules/@dotln"), { recursive: true });
  writeFileSync(join(snapshot, "packages/compiler/index.js"), "export {};\n");
  const link = join(snapshot, "node_modules/@dotln/compiler");
  symlinkSync("../../packages/compiler", link, "dir");
  const installed = gateInstanceInputDigest(repo);
  writeFileSync(
    join(snapshot, "packages/compiler/index.js"),
    "export const changed = true;\n",
  );
  assert.notEqual(gateInstanceInputDigest(repo), installed);
  rmSync(link);
  symlinkSync(outside, link, "dir");
  assert.throws(() => gateInstanceInputDigest(repo), /workspace link differs/u);
  // Package sources make the root core, whose evidence keeps its committed
  // identity: no installed-input digest, as the runner's kit-root test decides.
  mkdirSync(join(repo, "packages/core"), { recursive: true });
  writeFileSync(join(repo, "packages/core/tsconfig.json"), "{}\n");
  assert.equal(gateInstanceInputDigest(repo), undefined);
  rmSync(join(repo, "packages/core"), { recursive: true });
  assert.throws(() => gateInstanceInputDigest(repo), /workspace link differs/u);
});

test("instance runtime identity ignores host metadata and normalizes permissions while retaining real drift", (t) => {
  const repo = createFixtureRoot(join(tmpdir(), "dotln-runtime-inputs-"));
  t.after(() => rmSync(repo, { recursive: true, force: true }));
  execGit(["init", "-q"], { cwd: repo });
  excludeFixtureOwnership(repo);
  const write = (path, text = "incidental\n") => {
    mkdirSync(dirname(join(repo, path)), { recursive: true });
    writeFileSync(join(repo, path), text);
  };
  write("KIT-MANIFEST.json", "{}\n");
  write("packages/runtime/package.json", '{"name":"@dotln/runtime"}\n');
  const module = "packages/runtime/dist/index.js";
  write(module, "export {};\n");
  chmodSync(join(repo, module), 0o755);
  const before = gateInstanceInputDigest(repo);
  for (const path of [
    "packages/.DS_Store",
    "packages/README.txt",
    "packages/runtime/dist/.DS_Store",
    "packages/runtime/dist/.cache/state",
    "packages/runtime/dist/tsconfig.tsbuildinfo",
  ]) {
    write(path);
    assert.equal(gateInstanceInputDigest(repo), before, path);
  }
  chmodSync(join(repo, module), 0o700);
  assert.equal(gateInstanceInputDigest(repo), before);
  chmodSync(join(repo, module), 0o600);
  const regular = gateInstanceInputDigest(repo);
  assert.notEqual(regular, before);
  chmodSync(join(repo, module), 0o644);
  assert.equal(gateInstanceInputDigest(repo), regular);
  write(module, "export const changed = true;\n");
  assert.notEqual(gateInstanceInputDigest(repo), regular);
  write(module, "export {};\n");
  write("packages/runtime/dist/extra.js", "export {};\n");
  assert.notEqual(gateInstanceInputDigest(repo), regular);
  rmSync(join(repo, "packages/runtime/dist/extra.js"));
  assert.equal(gateInstanceInputDigest(repo), regular);
  write("packages/free/package.json", '{"name":"@dotln/free"}\n');
  write("packages/free/src/index.mjs", "export {};\n");
  write(".gitignore", "packages/free/src/local/\n");
  const withSource = gateInstanceInputDigest(repo);
  write("packages/free/src/local/added.mjs", "export {};\n");
  // Compare the review's blanket ignore proposal with the runtime policy:
  // Git excludes a real module, while runtime identity must still bind it.
  assert.equal(
    spawnGit(["check-ignore", "--quiet", "packages/free/src/local/added.mjs"], {
      cwd: repo,
    }).status,
    0,
  );
  assert.notEqual(gateInstanceInputDigest(repo), withSource);
  rmSync(join(repo, "packages/free/src/local"), { recursive: true });
  assert.equal(gateInstanceInputDigest(repo), withSource);
  rmSync(join(repo, "packages/free/package.json"));
  mkdirSync(join(repo, "packages/free/package.json"));
  assert.throws(
    () => gateInstanceInputDigest(repo),
    /metadata must be a regular file/u,
  );
  rmSync(join(repo, "packages/free"), { recursive: true });
  write(".claude/skills", "not a directory\n");
  assert.throws(
    () => gateInstanceInputDigest(repo),
    (error) => {
      assert.match(error.message, /regular directory: \.claude\/skills/u);
      assert.ok(!error.message.includes(repo));
      return true;
    },
  );
});

test("instance selection and evidence agree on malformed package-source declarations", async (t) => {
  const { hasPackageSources } =
    await import("../packages/skeleton/src/runtime-inputs.mjs");
  const repo = createFixtureRoot(join(tmpdir(), "dotln-runtime-shape-"));
  t.after(() => rmSync(repo, { recursive: true, force: true }));
  writeFileSync(join(repo, "KIT-MANIFEST.json"), "{}\n");
  mkdirSync(join(repo, "packages/core"), { recursive: true });
  const config = join(repo, "packages/core/tsconfig.json");
  const readers = [isKitRoot, gateInstanceInputDigest, hasPackageSources];
  for (const kind of ["directory", "link", "dangling"]) {
    if (kind === "directory") mkdirSync(config);
    else
      symlinkSync(
        kind === "link" ? "../../KIT-MANIFEST.json" : "missing",
        config,
      );
    for (const reader of readers)
      assert.throws(
        () => reader(repo),
        (error) => {
          assert.match(error.message, /regular.*tsconfig|tsconfig.*regular/u);
          assert.ok(!error.message.includes(repo));
          return true;
        },
        `${reader.name}: ${kind}`,
      );
    rmSync(config, { recursive: true });
  }
  writeFileSync(config, "{}\n");
  assert.equal(hasPackageSources(repo), true);
  assert.equal(isKitRoot(repo), false);
  assert.equal(gateInstanceInputDigest(repo), undefined);
  rmSync(join(repo, "packages/core"), { recursive: true });
  symlinkSync("../missing", join(repo, "packages/core"));
  for (const reader of readers)
    assert.throws(
      () => reader(repo),
      (error) => {
        assert.ok(!error.message.includes(repo));
        return true;
      },
    );
});

test("kit checks execute fresh against ignored runtime and document inputs under full gate protection", async (t) => {
  const repo = createFixtureRoot(join(tmpdir(), "dotln-kit-current-"));
  t.after(() => rmSync(repo, { recursive: true, force: true }));
  execGit(["init", "-q"], { cwd: repo });
  excludeFixtureOwnership(repo);
  mkdirSync(join(repo, "scripts"));
  mkdirSync(join(repo, "docs"));
  mkdirSync(join(repo, ".runtime/harness"), { recursive: true });
  mkdirSync(join(repo, ".claude/hooks"), { recursive: true });
  writeFileSync(join(repo, ".claude/hooks/finish.mjs"), "valid\n");
  writeFileSync(join(repo, "KIT-MANIFEST.json"), "{}\n");
  writeFileSync(
    join(repo, ".gitignore"),
    ".runtime/\ndocs/control/local/\nobserved.jsonl\n.DS_Store\n*.tsbuildinfo\n",
  );
  writeFileSync(join(repo, "scripts/verify.mjs"), "export {};\n");
  for (const [name, input] of [
    ["harness", ".runtime/harness/snapshot.txt"],
    ["records", "docs/record.md"],
  ]) {
    writeFileSync(join(repo, input), "valid\n");
    writeFileSync(
      join(repo, `scripts/${name}.mjs`),
      `import fs from "node:fs";\nimport { activeGateRuns } from ${JSON.stringify(pathToFileURL(join(root, "scripts/lib/gate-evidence.mjs")).href)};\nfs.appendFileSync("observed.jsonl", JSON.stringify({ name: ${JSON.stringify(name)}, kind: activeGateRuns(process.cwd())[0]?.kind }) + "\\n");\nprocess.exitCode = fs.readFileSync(${JSON.stringify(input)}, "utf8") === "valid\\n" ? 0 : 1;\n`,
    );
  }
  execGit(["add", "."], { cwd: repo });
  execGit(
    [
      "-c",
      "user.name=Fixture",
      "-c",
      "user.email=fixture@example.invalid",
      "-c",
      "maintenance.auto=false",
      "commit",
      "-qm",
      "Kit current inputs",
    ],
    { cwd: repo },
  );
  const table = [
    {
      name: "kit-verify",
      command: [process.execPath, "scripts/verify.mjs"],
      build: true,
      outputs: [],
    },
    {
      name: "harness",
      command: [process.execPath, "scripts/harness.mjs"],
      instance: "runtime",
      document: true,
      needsBuild: true,
    },
    {
      name: "records",
      command: [process.execPath, "scripts/records.mjs"],
      instance: "document",
      document: true,
    },
    {
      name: "new-platform-fixture",
      command: [process.execPath, "-e", "process.exit(99)"],
      product: true,
      document: true,
    },
  ];
  const log = console.log;
  console.log = () => {};
  t.after(() => (console.log = log));
  const identity = gateCodeIdentity(repo);
  // The two fixture scripts journal the live gate run's kind; the verify row
  // writes nothing. Each selection runs twice (the pass, then the drift
  // failure). Every instance selection is a document run: its harness row
  // reads the harness surfaces the product read guard excludes, so the
  // order's record writes stay refused while it runs.
  const observedKinds = [];
  for (const args of [[], ["--review"], ["--full"], ["--document"]]) {
    const document = args.includes("--document");
    const names = document
      ? ["kit-verify", "harness", "records"]
      : ["kit-verify", "harness"];
    const kind = "document";
    const perRun = names
      .filter((name) => name !== "kit-verify")
      .map((name) => `${name}:${kind}`);
    observedKinds.push(...perRun, ...perRun);
    const gate = () => runGate(["--serial", ...args], repo, { table });
    const first = await gate();
    assert.equal(first.exitCode, 0);
    assert.deepEqual(first.requiredSuites, names);
    assert.equal(first.checkId, document ? "npm run test:docs" : "npm test");
    assert.equal(first.partial, undefined);
    assert.equal(first.excludedSuites, undefined);
    let publication;
    if (args.length === 0) {
      const { requireLifecycleEvidence } =
        await import("./lib/lifecycle-evidence.mjs");
      const { requireGateClaims } = await import("./lib/handoff-ledger.mjs");
      const warn = console.warn;
      let carried;
      try {
        console.warn = () => {};
        carried = (
          await requireLifecycleEvidence(
            repo,
            "final-review-result",
            "pass",
            "WO-999",
          )
        ).productGate;
      } finally {
        console.warn = warn;
      }
      assert.equal(carried.instanceInputDigest, first.instanceInputDigest);
      const claimed = await requireGateClaims(repo, {
        checked: true,
        claims: { plain: ["1"], review: [], document: [] },
      });
      assert.equal(
        claimed.productGate.instanceInputDigest,
        first.instanceInputDigest,
      );
      mkdirSync(join(repo, "docs/control/orders"), { recursive: true });
      const base = { schemaVersion: 1, workOrderId: "WO-999" };
      writeFileSync(
        join(repo, "docs/control/orders/WO-999.jsonl"),
        [
          {
            ...base,
            type: "WorkOrderActivated",
            workOrderPath: "docs/work-orders/WO-999-fixture.md",
            recordedAt: "2026-09-20T00:00:01.000Z",
          },
          {
            ...base,
            type: "FinalReviewCompleted",
            finalReviewId: "FINAL-001",
            verdict: "pass",
            evidence: { productGate: carried },
            recordedAt: "2026-09-20T00:00:02.000Z",
          },
        ]
          .map(JSON.stringify)
          .join("\n") + "\n",
      );
      execGit(["add", "docs/control/orders"], { cwd: repo });
      execGit(
        [
          "-c",
          "user.name=Fixture",
          "-c",
          "user.email=fixture@example.invalid",
          "-c",
          "maintenance.auto=false",
          "commit",
          "-qm",
          "Bind instance reviewer observation",
        ],
        { cwd: repo },
      );
      const { reviewedProductGate } = await import("./lib/release-records.mjs");
      publication = () =>
        reviewedProductGate(repo, "WO-999", "HEAD", { liveInstance: true });
      assert.equal(
        publication().instanceInputDigest,
        first.instanceInputDigest,
      );
      // The live publication reader and evidence consumers must accept the
      // same harmless installation changes as the ordinary instance gate.
      const metadata = [
        "packages/.DS_Store",
        ".runtime/harness/.DS_Store",
        ".runtime/harness/local.tsbuildinfo",
      ];
      mkdirSync(join(repo, "packages"));
      for (const path of metadata)
        writeFileSync(join(repo, path), "metadata\n");
      const { gateCandidates, coveringGateCheck } =
        await import("./lib/gate-reuse.mjs");
      assert.equal(gateInstanceInputDigest(repo), first.instanceInputDigest);
      assert.equal(
        findGateCheck(repo, "npm test", first.treeHash).evidenceRef,
        first.evidenceRef,
      );
      assert.equal(
        (await gateCandidates(repo, "npm test")).rows.at(-1).evidenceRef,
        first.evidenceRef,
      );
      assert.equal(
        (await coveringGateCheck(repo, "npm test", names)).row.evidenceRef,
        first.evidenceRef,
      );
      assert.equal(
        publication().instanceInputDigest,
        first.instanceInputDigest,
      );
      for (const path of metadata) rmSync(join(repo, path));
      // A row recorded before this instance bound its installed runtime
      // carries no digest; the refusal names that, not a changed runtime.
      const orders = join(repo, "docs/control/orders/WO-999.jsonl");
      const boundLog = readFileSync(orders, "utf8");
      const undigested = { ...carried };
      delete undigested.instanceInputDigest;
      writeFileSync(
        orders,
        boundLog.replace(JSON.stringify(carried), JSON.stringify(undigested)),
      );
      const recommit = (message) =>
        execGit(
          [
            "-c",
            "user.name=Fixture",
            "-c",
            "user.email=fixture@example.invalid",
            "-c",
            "maintenance.auto=false",
            "commit",
            "-qam",
            message,
          ],
          { cwd: repo },
        );
      recommit("Carry a row without an installed-runtime digest");
      assert.throws(
        publication,
        /WO-999 reviewed npm test row records no installed-runtime digest/u,
      );
      writeFileSync(orders, boundLog);
      recommit("Restore the digest-bearing row");
      assert.equal(
        publication().instanceInputDigest,
        first.instanceInputDigest,
      );
    }
    if (!document) {
      const { coveringGateCheck } = await import("./lib/gate-reuse.mjs");
      const hook = join(repo, ".claude/hooks/finish.mjs");
      for (const contents of ["invalid\n", null]) {
        if (contents === null) rmSync(hook);
        else writeFileSync(hook, contents);
        assert.equal(gateCodeIdentity(repo), identity);
        assert.equal(
          (await coveringGateCheck(repo, "npm test", names)).row,
          undefined,
        );
        assert.equal(
          findGateCheck(repo, "npm test", first.treeHash),
          undefined,
        );
        if (publication)
          assert.throws(publication, /reviewed installed runtime differs/u);
      }
      writeFileSync(hook, "valid\n");
      assert.equal(
        findGateCheck(repo, "npm test", first.treeHash).instanceInputDigest,
        first.instanceInputDigest,
      );
    }
    const input = join(
      repo,
      document ? "docs/record.md" : ".runtime/harness/snapshot.txt",
    );
    writeFileSync(input, "invalid\n");
    assert.equal(gateCodeIdentity(repo), identity);
    if (!document) {
      const { coveringGateCheck } = await import("./lib/gate-reuse.mjs");
      assert.equal(
        (await coveringGateCheck(repo, "npm test", names)).row,
        undefined,
        "a claim cannot consume the earlier pass after ignored runtime drift",
      );
      assert.equal(findGateCheck(repo, "npm test", first.treeHash), undefined);
      if (publication) {
        assert.throws(publication, /reviewed installed runtime differs/u);
        const { reviewedProductGate } =
          await import("./lib/release-records.mjs");
        assert.equal(
          reviewedProductGate(repo, "WO-999").instanceInputDigest,
          first.instanceInputDigest,
          "historical review readers retain their recorded subject",
        );
      }
    }
    const failed = await gate();
    assert.equal(failed.exitCode, 1);
    assert.equal(failed.codeIdentity, identity);
    assert.equal(failed.reusedSuites, 0);
    assert.equal(failed.freshReason, "instance-inputs");
    assert.deepEqual(
      failed.cases.map((row) => row.name),
      names,
    );
    assert.deepEqual(
      failed.taskTimeline.map((row) => row.name),
      names,
    );
    assert.equal(
      failed.cases.find(
        (row) => row.name === (document ? "records" : "harness"),
      ).executed,
      true,
    );
    writeFileSync(input, "valid\n");
  }
  const observed = readFileSync(join(repo, "observed.jsonl"), "utf8")
    .trim()
    .split("\n")
    .map(JSON.parse);
  assert.deepEqual(
    observed.map((row) => `${row.name}:${row.kind}`),
    observedKinds,
  );
});

test("kit --only refuses unavailable suites without running or recording a check, including list requests", async (t) => {
  const repo = createFixtureRoot(join(tmpdir(), "dotln-kit-only-"));
  t.after(() => rmSync(repo, { recursive: true, force: true }));
  writeFileSync(join(repo, "KIT-MANIFEST.json"), "{}\n");
  const lines = [];
  const log = console.log;
  try {
    console.log = (line) => lines.push(String(line));
    for (const name of ["kernel", "release", "runner-fixtures"]) {
      const row = suites.find((row) => row.name === name);
      for (const flags of [[], ["--list"]])
        await assert.rejects(runGate(["--only", name, ...flags], repo), {
          message: `Suite ${name} is not carried in this kit (${row.kit})`,
        });
    }
  } finally {
    console.log = log;
  }
  assert.ok(lines.every((line) => /^kit: .+ not carried \(/u.test(line)));
  assert.deepEqual(readGateChecks(repo), []);
  assert.deepEqual(activeGateRuns(repo), []);
});

test("WO-174 product read guard fails the task and names the case and excluded tracked input, including inherited Node children", async (t) => {
  const repo = createFixtureRoot(join(tmpdir(), "dotln-product-reads-"));
  t.after(() => rmSync(repo, { recursive: true, force: true }));
  execGit(["init", "-q"], { cwd: repo });
  excludeFixtureOwnership(repo);
  mkdirSync(join(repo, "docs"));
  mkdirSync(join(repo, "scripts"));
  writeFileSync(join(repo, "docs/input.md"), "fixture\n");
  writeFileSync(join(repo, "generated.json"), "{}\n");
  writeFileSync(join(repo, "NOTE.md"), "fixture\n");
  for (const directory of [".agents", ".claude"]) {
    mkdirSync(join(repo, directory));
    writeFileSync(join(repo, directory, "fixture.txt"), "fixture\n");
  }
  writeFileSync(
    join(repo, ".gitattributes"),
    "generated.json dotln-generated\n",
  );
  writeFileSync(
    join(repo, "scripts/read.test.mjs"),
    `
import test from "node:test";
import fs from "node:fs";
import promises from "node:fs/promises";
import {spawnSync} from "node:child_process";
test("named async read case", async t => {
  await Promise.resolve();
  fs.readFileSync("docs/input.md");
  const fd = fs.openSync("docs/input.md", "r");
  fs.readFileSync(fd); fs.closeSync(fd);
  fs.readdirSync("docs");
  await promises.readFile(new URL("../docs/input.md", import.meta.url));
  const handle = await promises.open("docs/input.md", "r"); await handle.close();
  await promises.readdir("docs");
  fs.readFileSync("generated.json");
  fs.readFileSync("NOTE.md");
  fs.readFileSync(".agents/fixture.txt");
  fs.readFileSync(".claude/fixture.txt");
  await t.test("nested inherited child", () => {
    spawnSync(process.execPath, ["-e", "require('node:fs').readFileSync('docs/input.md')"]);
  });
  await t.test("child retaining options in a reduced environment", () => {
    spawnSync(process.execPath, ["-e", "require('node:fs').readFileSync('docs/input.md')"], {
      env: {NODE_OPTIONS: process.env.NODE_OPTIONS},
    });
  });
});
`,
  );
  execGit(["add", "."], { cwd: repo });
  const command = [process.execPath, "--test", "scripts/read.test.mjs"];
  const unguarded = await executeSuite({ name: "unguarded", command }, repo);
  assert.equal(unguarded.exitCode, 0, unguarded.output);
  const guarded = await executeSuite(
    { name: "read-fixture", command, product: true, packageTest: true },
    repo,
  );
  assert.equal(guarded.exitCode, 1, "the old runner returns zero here");
  assert.match(guarded.output, /named async read case reads docs\/input\.md/u);
  assert.match(guarded.output, /nested inherited child reads docs\/input\.md/u);
  assert.match(
    guarded.output,
    /child retaining options in a reduced environment reads docs\/input\.md/u,
  );
  assert.match(guarded.output, /reads generated\.json/u);
  for (const path of ["NOTE.md", ".agents/fixture.txt", ".claude/fixture.txt"])
    assert.ok(guarded.output.includes(`reads ${path}`), path);
  assert.equal(isAbsolute(guarded.productReadLog), false);
  const events = readFileSync(join(repo, guarded.productReadLog), "utf8")
    .trim()
    .split("\n")
    .map(JSON.parse);
  for (const method of [
    "readFileSync",
    "openSync",
    "readdirSync",
    "promises.readFile",
    "promises.open",
    "promises.readdir",
  ])
    assert.ok(
      events.some((event) => event.method === method),
      method,
    );
  assert.ok(
    events.some(
      (event) =>
        event.pid !== events.find((row) => row.method === "openSync").pid &&
        event.kind === "excluded-read",
    ),
  );
});

test("WO-174 machinery coverage names an uncovered entry, direct import or literal spawned script, accepts only reasoned exclusions and keeps its stated boundary", (t) => {
  const repo = createFixtureRoot(join(tmpdir(), "dotln-machinery-coverage-"));
  t.after(() => rmSync(repo, { recursive: true, force: true }));
  mkdirSync(join(repo, "scripts"));
  writeFileSync(
    join(repo, "scripts/imported.mjs"),
    'import "./transitive.mjs";\n',
  );
  writeFileSync(join(repo, "scripts/transitive.mjs"), "export {};\n");
  writeFileSync(join(repo, "scripts/spawned.mjs"), "export {};\n");
  writeFileSync(join(repo, "scripts/comment-only.mjs"), "export {};\n");
  writeFileSync(
    join(repo, "scripts/entry.mjs"),
    `
import "./imported.mjs";
import {spawnSync} from "node:child_process";
spawnSync(process.execPath, ["scripts/spawned.mjs"]);
// spawnSync(process.execPath, ["scripts/comment-only.mjs"]);
const text = 'spawnSync(process.execPath, ["scripts/comment-only.mjs"])';
const computed = "scripts/" + "comment-only.mjs";
`,
  );
  const row = {
    name: "fixture",
    machinery: true,
    command: [process.execPath, "scripts/entry.mjs"],
    sources: [],
  };
  assert.deepEqual(uncoveredMachinerySources(repo, [row], {}), [
    { suite: "fixture", path: "scripts/entry.mjs" },
    { suite: "fixture", path: "scripts/imported.mjs" },
    { suite: "fixture", path: "scripts/spawned.mjs" },
  ]);
  const covered = {
    ...row,
    sources: ["scripts/entry.mjs", "scripts/imported.mjs"],
  };
  assert.deepEqual(uncoveredMachinerySources(repo, [covered], {}), [
    { suite: "fixture", path: "scripts/spawned.mjs" },
  ]);
  assert.throws(
    () =>
      uncoveredMachinerySources(repo, [covered], {
        fixture: { "scripts/spawned.mjs": "" },
      }),
    /needs a reason/u,
  );
  assert.deepEqual(
    uncoveredMachinerySources(repo, [covered], {
      fixture: {
        "scripts/spawned.mjs": "Fixture exclusion with a recorded reason",
      },
    }),
    [],
  );
  assert.match(
    machineryCoverageScope,
    /transitive imports and paths built at run time are outside/u,
  );
});

test("machinery coverage reads shell paths conservatively across comments and heredocs", (t) => {
  const repo = createFixtureRoot(join(tmpdir(), "dotln-machinery-shell-"));
  t.after(() => rmSync(repo, { recursive: true, force: true }));
  mkdirSync(join(repo, "scripts"));
  for (const name of ["first", "comment", "embedded", "last"])
    writeFileSync(join(repo, `scripts/${name}.mjs`), "export {};\n");
  writeFileSync(
    join(repo, "scripts/entry.sh"),
    [
      "#!/bin/bash",
      "# Don't tokenize shell comments as JavaScript: scripts/comment.mjs",
      "node scripts/first.mjs",
      "node --input-type=module <<'JS'",
      'const value = `nested ${"value"}`;',
      'run("scripts/embedded.mjs");',
      "JS",
      '# Shell syntax after the heredoc must not hide "scripts/last.mjs".',
      'node "scripts/last.mjs"',
    ].join("\n"),
  );
  const row = {
    name: "fixture-shell",
    machinery: true,
    command: ["bash", "scripts/entry.sh"],
    sources: ["scripts/entry.sh"],
  };
  assert.deepEqual(
    uncoveredMachinerySources(repo, [row], {}),
    ["comment", "embedded", "first", "last"].map((name) => ({
      suite: "fixture-shell",
      path: `scripts/${name}.mjs`,
    })),
  );
  row.sources.push("scripts/");
  assert.deepEqual(uncoveredMachinerySources(repo, [row], {}), []);
});

test("WO-174 every machinery suite covers its direct entry imports and literal script paths", () => {
  const findings = uncoveredMachinerySources(
    root,
    expandSuiteTasks(
      suites.filter((row) => row.machinery),
      root,
    ),
  );
  console.log(machineryCoverageScope);
  assert.deepEqual(
    findings,
    [],
    findings.map((row) => `${row.suite}: uncovered ${row.path}`).join("\n"),
  );
});

test("release shell changes select their inventory guard during review", async (t) => {
  const repo = createFixtureRoot(join(tmpdir(), "dotln-release-selection-"));
  t.after(() => rmSync(repo, { recursive: true, force: true }));
  const fixtureGitOptions = {
    exec: true,
    trim: false,

    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  };
  runGit(repo, ["init", "-b", "main"], fixtureGitOptions);
  excludeFixtureOwnership(repo);
  mkdirSync(join(repo, "scripts"));
  const shell = join(repo, "scripts/test-release.sh");
  const baseline = "release_case_existing() {\n  :\n}\n";
  writeFileSync(shell, baseline);
  runGit(repo, ["add", "."], fixtureGitOptions);
  runGit(
    repo,
    [
      "-c",
      "user.name=Fixture",
      "-c",
      "user.email=fixture@example.invalid",
      "-c",
      "maintenance.auto=false",
      "commit",
      "-m",
      "fixture baseline",
    ],
    fixtureGitOptions,
  );
  assert.deepEqual(changedMachinery(repo, suites, "main"), []);
  writeFileSync(shell, baseline + "release_case_added() {\n  :\n}\n");
  // Every path under scripts/ also selects the configuration-root suite
  // since WO-169 item 5 declared the directory.
  assert.deepEqual(
    changedMachinery(repo, suites, "main").map((row) => row.name),
    ["configuration-root", "runner-fixtures"],
  );
  const messages = [];
  const saved = console.log;
  try {
    console.log = (line) => messages.push(line);
    await runGate(["--review", "--list", "--selected"], repo);
  } finally {
    console.log = saved;
  }
  assert.deepEqual(
    suites
      .filter(
        (row) =>
          row.machinery &&
          row.name !== "registrations" &&
          messages.some((line) => line.startsWith(`${row.name} —`)),
      )
      .map((row) => row.name),
    ["configuration-root", "runner-fixtures"],
  );
  const tasks = expandSuiteTasks(
    suites.filter((row) => row.name === "runner-fixtures"),
    repo,
  );
  assert.ok(
    tasks.some((task) =>
      task.args?.includes("scripts/test-release-fixtures.mjs"),
    ),
  );
  // An untracked script a suite declares selects it before it is staged, so
  // the review gate covers the file an order adds (WO-173, WO-169 D007).
  writeFileSync(shell, baseline);
  assert.deepEqual(changedMachinery(repo, suites, "main"), []);
  writeFileSync(join(repo, "scripts/test-gate-deadlines.mjs"), "export {};\n");
  assert.deepEqual(
    changedMachinery(repo, suites, "main").map((row) => row.name),
    ["configuration-root", "runner-fixtures"],
  );
});

test("npm test composes plain and review task rows; explicit fresh, changed code and unusable observations run fresh", async (t) => {
  const repo = createFixtureRoot(join(tmpdir(), "dotln-gate-reuse-"));
  t.after(() => rmSync(repo, { recursive: true, force: true }));
  const fixtureGitOptions = {
    exec: true,
    trim: false,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  };
  runGit(repo, ["init", "-b", "main"], fixtureGitOptions);
  excludeFixtureOwnership(repo);
  runGit(repo, ["config", "maintenance.auto", "false"], fixtureGitOptions);
  runGit(repo, ["config", "user.name", "Fixture"], fixtureGitOptions);
  runGit(
    repo,
    ["config", "user.email", "fixture@example.invalid"],
    fixtureGitOptions,
  );
  writeFileSync(
    join(repo, ".gitignore"),
    "docs/control/local/\nobserved.jsonl\n",
  );
  mkdirSync(join(repo, "scripts"));
  const source = (name) => join(repo, `scripts/${name}.mjs`);
  for (const name of ["format", "build", "alpha", "machine"])
    writeFileSync(
      source(name),
      `import fs from "node:fs";\nfs.appendFileSync("observed.jsonl", ${JSON.stringify(`${name}\n`)});\n`,
    );
  runGit(repo, ["add", "."], fixtureGitOptions);
  runGit(
    repo,
    ["-c", "maintenance.auto=false", "commit", "-qm", "Gate reuse fixture"],
    fixtureGitOptions,
  );
  // The order's branch: main stays behind, so a machinery source changed
  // here is selected under --review while the code identity stays put.
  runGit(repo, ["checkout", "-q", "-b", "work"], fixtureGitOptions);
  writeFileSync(
    source("machine"),
    readFileSync(source("machine"), "utf8") + "// changed\n",
  );
  runGit(
    repo,
    [
      "-c",
      "maintenance.auto=false",
      "commit",
      "-qam",
      "Change the machinery source",
    ],
    fixtureGitOptions,
  );
  const row = (name, options = {}) => ({
    name,
    command: [process.execPath, `scripts/${name}.mjs`],
    ...options,
  });
  const table = [
    {
      ...suites.find((row) => row.name === "format"),
      command: [process.execPath, "scripts/format.mjs"],
    },
    row("build", { build: true, product: true, outputs: [] }),
    row("alpha", { product: true }),
    row("machine", { machinery: true, sources: ["scripts/machine.mjs"] }),
  ];
  const executions = () =>
    existsSync(join(repo, "observed.jsonl"))
      ? readFileSync(join(repo, "observed.jsonl"), "utf8").trim().split("\n")
      : [];
  const observed = () => executions().filter((name) => name !== "format");
  const formats = () => executions().filter((name) => name === "format").length;
  const rows = () =>
    readGateChecks(repo).filter((check) => check.checkId === "npm test");
  const lines = [];
  const log = console.log;
  console.log = (line) => lines.push(String(line));
  t.after(() => (console.log = log));
  const gate = async (args) => {
    const before = formats();
    const check = await runGate(["--serial", ...args], repo, { table });
    assert.equal(
      formats(),
      before + 1,
      "format runs freshly on every selection",
    );
    return check;
  };
  const identity = gateCodeIdentity(repo);
  const first = await gate([]);
  assert.equal(first.exitCode, 0);
  assert.equal(first.reused, undefined);
  assert.equal(first.codeIdentity, identity);
  assert.deepEqual(first.requiredSuites, ["build", "format", "alpha"]);
  assert.deepEqual(observed(), ["build", "alpha"]);
  assert.equal(rows().length, 1);
  // Only format runs at the same identity; the composed row retains the
  // executed source pointers for every reused product task.
  lines.length = 0;
  const reused = await gate([]);
  assert.equal(reused.exitCode, 0);
  assert.equal(reused.reused, undefined);
  assert.equal(reused.executionMode, "composed");
  assert.equal(reused.gateSelection, "plain");
  assert.equal(reused.freshReason, "always-fresh-preflight");
  assert.equal(reused.freshSuites, 1);
  assert.equal(reused.reusedSuites, 2);
  for (const task of reused.taskTimeline.filter(
    (row) => row.name !== "format",
  )) {
    assert.equal(task.reused, true);
    assert.equal(task.sourceRow.recordedAt, first.recordedAt);
  }
  assert.equal(reused.evidenceRef, first.evidenceRef);
  assert.deepEqual(observed(), ["build", "alpha"]);
  assert.equal(rows().length, 2);
  assert.ok(lines.some((line) => line.startsWith("PASS format ")));
  assert.ok(lines.some((line) => line.startsWith("REUSE build ")));
  assert.ok(lines.some((line) => line.startsWith("REUSE alpha ")));
  assert.equal(
    findGateCheck(repo, "npm test", gateTreeHash(repo)).evidenceRef,
    first.evidenceRef,
  );
  // --again runs the selection.
  const again = await gate(["--again", ...WHY]);
  assert.equal(again.exitCode, 0);
  assert.equal(again.reused, undefined);
  assert.equal(again.executionMode, "forced-fresh");
  assert.equal(again.freshReason, "requested");
  assert.deepEqual(observed(), ["build", "alpha", "build", "alpha"]);
  assert.equal(rows().length, 3);
  // --fresh keeps its meaning and runs the selection too.
  const fresh = await gate(["--fresh", ...WHY]);
  assert.equal(fresh.reused, undefined);
  assert.equal(observed().length, 6);
  assert.equal(rows().length, 4);
  // A review carries the product tasks and executes the uncovered machinery.
  const review = await gate(["--review"]);
  assert.equal(review.exitCode, 0);
  assert.equal(review.reused, undefined);
  assert.deepEqual(review.requiredSuites, [
    "build",
    "format",
    "alpha",
    "machine",
  ]);
  assert.deepEqual(observed().slice(6), ["machine"]);
  assert.equal(review.executionMode, "composed");
  assert.equal(review.gateSelection, "review");
  assert.equal(review.freshReason, "missing-passing-tasks");
  assert.equal(rows().length, 5);
  // Both selections reuse the covering task results.
  lines.length = 0;
  const reviewAgain = await gate(["--review"]);
  assert.equal(reviewAgain.reused, undefined);
  assert.equal(reviewAgain.executionMode, "composed");
  assert.equal(reviewAgain.freshReason, "always-fresh-preflight");
  assert.equal(reviewAgain.freshSuites, 1);
  assert.equal(reviewAgain.reusedSuites, 3);
  assert.equal(reviewAgain.evidenceRef, review.evidenceRef);
  assert.deepEqual(observed().slice(7), []);
  const plainAfterReview = await gate([]);
  assert.equal(plainAfterReview.reused, undefined);
  assert.equal(plainAfterReview.freshReason, "always-fresh-preflight");
  assert.equal(plainAfterReview.evidenceRef, review.evidenceRef);
  assert.equal(observed().length, 7);
  assert.equal(rows().length, 7);
  // A changed source file moves the code identity, and the gate runs.
  writeFileSync(
    source("alpha"),
    readFileSync(source("alpha"), "utf8") + "// edit\n",
  );
  assert.notEqual(gateCodeIdentity(repo), identity);
  const changed = await gate([]);
  assert.equal(changed.reused, undefined);
  assert.equal(observed().length, 9);
  assert.equal(changed.codeIdentity, gateCodeIdentity(repo));
  // A failed row and a partial row at the current identity never satisfy the
  // lookup, whoever recorded them.
  for (const [label, extra] of [
    [
      "failed",
      { exitCode: 1, identityUnchanged: false, evidenceRef: "fixture:failed" },
    ],
    [
      "partial",
      {
        partial: true,
        excludedSuites: ["alpha"],
        evidenceRef: "fixture:partial",
      },
    ],
  ]) {
    writeFileSync(
      source("alpha"),
      readFileSync(source("alpha"), "utf8") + `// ${label}\n`,
    );
    const moved = gateCodeIdentity(repo);
    assert.equal(
      rows().some((check) => check.codeIdentity === moved),
      false,
    );
    recordGateChecks(repo, [
      {
        ...changed,
        codeIdentity: moved,
        recordedAt: new Date().toISOString(),
        ...extra,
      },
    ]);
    const before = observed().length;
    const run = await gate([]);
    assert.equal(run.reused, undefined, label);
    assert.equal(observed().length, before + 2, label);
  }
  // The lookup itself, beside the runner.
  const { coveringGateCheck } = await import("./lib/gate-reuse.mjs");
  const covering = await coveringGateCheck(repo, "npm test", [
    "build",
    "alpha",
    "zeta",
  ]);
  assert.equal(covering.row, undefined);
  assert.deepEqual(covering.missing, ["zeta"]);
  assert.ok(covering.candidates.length >= 1);
  assert.equal(
    (await coveringGateCheck(repo, "npm test", ["alpha"])).row.evidenceRef,
    rows().at(-1).evidenceRef,
  );
  // A complete passing row that names no suites covers an empty requirement,
  // as publication accepts it, and never a named selection, so the runner
  // does not reuse it.
  writeFileSync(
    source("alpha"),
    readFileSync(source("alpha"), "utf8") + "// bare\n",
  );
  const bare = gateCodeIdentity(repo);
  const { requiredSuites: omitted, ...bareRow } = changed;
  assert.ok(omitted.length);
  recordGateChecks(repo, [
    {
      ...bareRow,
      codeIdentity: bare,
      evidenceRef: "fixture:bare",
      recordedAt: new Date().toISOString(),
    },
  ]);
  assert.equal(
    (await coveringGateCheck(repo, "npm test", [], bare)).row.evidenceRef,
    "fixture:bare",
  );
  assert.equal(
    (await coveringGateCheck(repo, "npm test", ["alpha"], bare)).row,
    undefined,
  );
  const beforeBare = observed().length;
  const bareRun = await gate([]);
  assert.equal(
    bareRun.reused,
    undefined,
    "a row naming no suites is not reused",
  );
  assert.equal(observed().length, beforeBare + 2);
  assert.deepEqual(activeGateRuns(repo), [], "every run released its marker");
});

test("WO-169 a changed script outside the former eight sources selects the configuration-root suite", async (t) => {
  const repo = createFixtureRoot(join(tmpdir(), "dotln-script-selection-"));
  t.after(() => rmSync(repo, { recursive: true, force: true }));
  const fixtureGitOptions = {
    exec: true,
    trim: false,

    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  };
  runGit(repo, ["init", "-b", "main"], fixtureGitOptions);
  excludeFixtureOwnership(repo);
  mkdirSync(join(repo, "scripts"));
  mkdirSync(join(repo, "packages/kernel/src"), { recursive: true });
  // The script WO-165 changed while no gate selected the suite that scans
  // it (WO-085 D014), and a source no machinery suite declares.
  const script = join(repo, "scripts/authority-evidence.mjs");
  const other = join(repo, "packages/kernel/src/undeclared.ts");
  writeFileSync(script, "export const route = 1;\n");
  writeFileSync(other, "export const value = 1;\n");
  runGit(repo, ["add", "."], fixtureGitOptions);
  runGit(
    repo,
    [
      "-c",
      "user.name=Fixture",
      "-c",
      "user.email=fixture@example.invalid",
      "-c",
      "maintenance.auto=false",
      "commit",
      "-m",
      "fixture baseline",
    ],
    fixtureGitOptions,
  );
  const listed = async () => {
    const messages = [];
    const saved = console.log;
    try {
      console.log = (line) => messages.push(line);
      await runGate(["--review", "--list", "--selected"], repo);
    } finally {
      console.log = saved;
    }
    return messages;
  };
  writeFileSync(other, "export const value = 2;\n");
  assert.deepEqual(changedMachinery(repo, suites, "main"), []);
  assert.ok(
    (await listed()).some((line) => line.startsWith("configuration-root —")),
    "structural configuration checks run even for a change outside scripts/",
  );
  writeFileSync(script, "export const route = 2;\n");
  assert.ok(
    changedMachinery(repo, suites, "main").some(
      (row) => row.name === "configuration-root",
    ),
  );
  assert.ok(
    (await listed()).some((line) => line.startsWith("configuration-root —")),
    "npm test -- --review --list --selected names the suite",
  );
});

test("WO-133 review selection ignores release-only changes and retains host behavior suites", async () => {
  const repo = createFixtureRoot(join(tmpdir(), "dotln-version-selection-"));
  const fixtureGitOptions = {
    exec: true,
    trim: false,

    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  };
  const version = "packages/skeleton/src/version.ts";
  const compiler = "packages/compiler/src/artifact-identity.ts";
  try {
    runGit(repo, ["init", "-b", "main"], fixtureGitOptions);
    excludeFixtureOwnership(repo);
    mkdirSync(join(repo, "packages/skeleton/src"), { recursive: true });
    mkdirSync(join(repo, "packages/compiler/src"), { recursive: true });
    writeFileSync(
      join(repo, version),
      'export const HARNESS_HOST_VERSION = "1.0.0";\n',
    );
    writeFileSync(
      join(repo, compiler),
      'export const COMPILER_PACKAGE_VERSION = "1.0.0";\n',
    );
    writeFileSync(
      join(repo, "packages/skeleton/src/harness-host.ts"),
      "export const behavior = 1;\n",
    );
    runGit(repo, ["add", "."], fixtureGitOptions);
    runGit(
      repo,
      [
        "-c",
        "user.name=Fixture",
        "-c",
        "user.email=fixture@example.invalid",
        "-c",
        "maintenance.auto=false",
        "commit",
        "-m",
        "fixture baseline",
      ],
      fixtureGitOptions,
    );
    writeFileSync(
      join(repo, version),
      'export const HARNESS_HOST_VERSION = "1.0.1";\n',
    );
    assert.deepEqual(changedMachinery(repo, suites, "main"), []);
    const messages = [];
    const saved = console.log;
    try {
      console.log = (line) => messages.push(line);
      await runGate(["--review", "--list", "--selected"], repo);
    } finally {
      console.log = saved;
    }
    for (const row of suites.filter((row) => row.machinery && !row.structural))
      assert.ok(
        !messages.some((line) => line.startsWith(`${row.name} —`)),
        row.name,
      );
    writeFileSync(
      join(repo, compiler),
      'export const COMPILER_PACKAGE_VERSION = "1.0.1";\n',
    );
    assert.deepEqual(changedMachinery(repo, suites, "main"), []);
    writeFileSync(
      join(repo, "packages/skeleton/src/harness-host.ts"),
      "export const behavior = 2;\n",
    );
    const selected = changedMachinery(repo, suites, "main").map(
      (row) => row.name,
    );
    assert.ok(selected.includes("harness-fixtures"));
    assert.ok(selected.includes("process-debt"));
    const versionConsumers = [
      "harness-fixtures",
      "harness",
      "process-debt",
      "harness-evidence",
      "authority-evidence",
      "artifact-evidence",
      "verification-evidence",
      "feedback-evidence",
    ];
    for (const name of versionConsumers)
      assert.ok(
        suites.find((row) => row.name === name).sources.includes(version),
        name,
      );
    writeFileSync(
      join(repo, "packages/skeleton/src/harness-host.ts"),
      "export const behavior = 1;\n",
    );
    writeFileSync(
      join(repo, version),
      'export const HARNESS_HOST_VERSION = "1.0.1";\nexport const behavior = 2;\n',
    );
    const behaviorSelected = changedMachinery(repo, suites, "main").map(
      (row) => row.name,
    );
    for (const name of versionConsumers)
      assert.ok(behaviorSelected.includes(name), name);
    const host = readFileSync(
      join(root, "packages/skeleton/src/harness-host.ts"),
      "utf8",
    );
    const profiles = readFileSync(
      join(root, "packages/skeleton/src/loadouts/contributor.ts"),
      "utf8",
    );
    assert.doesNotMatch(host, /HARNESS_HOST_VERSION\s*=\s*["']/);
    assert.doesNotMatch(profiles, /skeletonVersion:\s*["']/);
    assert.match(
      readFileSync(join(root, version), "utf8"),
      /HARNESS_HOST_VERSION\s*=\s*"\d+\.\d+\.\d+"/,
    );
  } finally {
    rmSync(repo, { recursive: true, force: true });
  }
});
test("full inventory retains every command in the previous package test chain", () => {
  const before = JSON.parse(
    readFileSync(
      join(root, "scripts/fixtures/runner-baseline-v0.16.0.json"),
      "utf8",
    ),
  ).scripts.test.split(" && ");
  assert.equal(before.length, 37);
  const commands = suites.map((row) =>
    [...row.command, ...(row.args ?? [])]
      .filter(
        (part) =>
          !part.startsWith("--test-concurrency=") &&
          part !== "--test-reporter=tap" &&
          !part.startsWith("--test-name-pattern=") &&
          !part.startsWith("--test-skip-pattern="),
      )
      .map((part) => (part === process.execPath ? "node" : part))
      .join(" "),
  );
  for (const command of before) {
    if (
      command.startsWith("rm -rf ") ||
      command === "tsc -b --force" ||
      command.startsWith("ls packages/")
    ) {
      assert.ok(
        suites.some(
          (row) => row.build && row.command[1] === "scripts/build.mjs",
        ),
      );
      continue;
    }
    if (command.includes("packages/kernel/dist/test")) {
      for (const name of ["kernel", "compiler", "skeleton"])
        assert.ok(suites.some((row) => row.name === name));
      continue;
    }
    const normalized = command
      .replace(
        /^bash scripts\/test-resume\.sh$/,
        "bash scripts/test-resume.sh --fixtures-only",
      )
      .replace(
        "npm run test:mutation --silent",
        "node --test corpus/mutation/wo108-selftest.test.mjs",
      )
      .replace(
        /^(node scripts\/(?:authority|feedback)-evidence\.mjs --check) --edition WO-\d{3}(?: --revision \d{3})?$/,
        "$1",
      )
      .replace(
        /^node scripts\/test-plan-refutation\.mjs$/,
        "node scripts/test-plan-refutation.mjs --fixtures-only",
      )
      .replace(
        /^node --test scripts\/test-harness\.mjs$/,
        "node --test scripts/test-harness.mjs scripts/test-drive.mjs",
      )
      .replace(/^node (scripts\/test-github-body\.mjs)$/, "node --test $1");
    assert.ok(
      commands.includes(normalized),
      `missing prior command: ${command}`,
    );
  }
});
test("package suites bound child-file concurrency as well as outer scheduling", () => {
  for (const row of suites.filter((suite) => suite.command.includes("--test")))
    assert.ok(row.command.includes("--test-reporter=tap"), row.name);
  for (const name of ["kernel", "compiler", "skeleton", "console"]) {
    const row = suites.find((suite) => suite.name === name);
    assert.ok(row.fileConcurrency >= 1 && row.fileConcurrency <= 2);
    assert.ok(
      row.command.includes(`--test-concurrency=${row.fileConcurrency}`),
    );
  }
});
test("build is a barrier, independent suites overlap, shared groups cannot overlap", async () => {
  const events = [],
    active = new Set();
  let built = false,
    overlap = false;
  const table = [
    barrier,
    { name: "a", command: ["a"], group: "shared" },
    { name: "b", command: ["b"], group: "shared" },
    { name: "c", command: ["c"] },
  ];
  const results = await scheduleSuites(table, {
    parallelism: 16,
    concurrency: 3,
    execute: async (row) => {
      events.push(`start:${row.name}`);
      if (!row.build) {
        assert.ok(built);
        if (row.group) assert.ok(!active.has(row.group));
        if (active.size) overlap = true;
      }
      active.add(row.group ?? row.name);
      await new Promise((done) => setTimeout(done, 10));
      active.delete(row.group ?? row.name);
      if (row.build) built = true;
      events.push(`end:${row.name}`);
      return { name: row.name, exitCode: 0 };
    },
  });
  assert.equal(results.length, 4);
  assert.ok(overlap);
  assert.ok(events.indexOf("end:build") < events.indexOf("start:a"));
  assert.ok(events.indexOf("end:a") < events.indexOf("start:b"));
});
test("serial scheduling has one active suite and failed build launches no dependents", async () => {
  let active = 0,
    peak = 0;
  await scheduleSuites(
    [
      barrier,
      { name: "one", command: ["one"] },
      { name: "two", command: ["two"] },
    ],
    {
      concurrency: 1,
      execute: async (row) => {
        peak = Math.max(peak, ++active);
        await Promise.resolve();
        active--;
        return { name: row.name, exitCode: 0 };
      },
    },
  );
  assert.equal(peak, 1);
  const rows = await scheduleSuites(
    [barrier, { name: "never", command: ["never"] }],
    { execute: async (row) => ({ name: row.name, exitCode: 1 }) },
  );
  assert.deepEqual(
    rows.map((row) => row.name),
    ["build"],
  );
  assert.throws(() => validateSuites([barrier, barrier]), /duplicate/);
});
test("stale generated evidence stops the gate before expensive fixtures", async () => {
  const selected = suites.filter((row) =>
    ["build", "authority-evidence", "index", "harness-fixtures"].includes(
      row.name,
    ),
  );
  const started = [];
  const rows = await scheduleSuites(expandSuiteTasks(selected, root), {
    execute: async (row) => {
      started.push(row.name);
      return {
        name: row.name,
        executed: true,
        exitCode: row.name === "authority-evidence" ? 1 : 0,
      };
    },
  });
  assert.ok(started.includes("authority-evidence"));
  assert.ok(started.includes("index"));
  assert.ok(!started.some((name) => name.startsWith("harness-fixtures")));
  const shards = rows.filter((row) =>
    row.name.startsWith("harness-fixtures:shard:"),
  );
  assert.equal(
    shards.length,
    suites.find((row) => row.name === "harness-fixtures").shards,
  );
  for (const row of shards) {
    assert.match(row.output, /Not started after authority-evidence failed/);
    assert.equal(row.executed, false);
  }
});
test("a kit formats before verifying carried code and refuses every later task on drift", async () => {
  const table = [
    { name: "kit-verify", build: true, command: ["verify"], outputs: [] },
    { name: "format", preflight: true, command: ["format"] },
    { name: "test", command: ["test"] },
  ];
  for (const failure of [undefined, "kit-verify", "format"]) {
    const executed = [];
    const result = await scheduleSuites(table, {
      concurrency: 1,
      execute: async (row) => {
        executed.push(row.name);
        return {
          name: row.name,
          exitCode: row.name === failure ? 1 : 0,
          executed: true,
          durationMs: 1,
          output: "",
        };
      },
    });
    assert.deepEqual(
      executed,
      failure === "kit-verify"
        ? ["format", "kit-verify"]
        : failure === "format"
          ? ["format"]
          : ["format", "kit-verify", "test"],
    );
    assert.equal(new Set(result.map((row) => row.name)).size, result.length);
    assert.equal(result[0].name, "format");
    if (failure !== "kit-verify")
      assert.deepEqual(
        result.find((row) => row.name === "format").predecessors,
        [],
      );
    if (!failure)
      assert.deepEqual(result.find((row) => row.name === "test").predecessors, [
        "kit-verify",
      ]);
  }
});

test("package tests and fixtures wait for preflights and never start after a failed preflight", async () => {
  for (const indexExit of [0, 1]) {
    const selected = suites.filter((row) =>
      ["build", "skeleton", "console", "index", "resume"].includes(row.name),
    );
    const events = [];
    const rows = await scheduleSuites(expandSuiteTasks(selected, root), {
      parallelism: 16,
      concurrency: 4,
      execute: async (row) => {
        events.push(`start:${row.name}`);
        if (row.name === "index")
          await new Promise((done) => setTimeout(done, 15));
        events.push(`end:${row.name}`);
        return {
          name: row.name,
          executed: true,
          exitCode: row.name === "index" ? indexExit : 0,
        };
      },
    });
    // The lifecycle fixtures are themselves a preflight: they run beside the
    // index check, never behind it, and the package suites wait for both.
    assert.equal(rows.find((row) => row.name === "resume").executed, true);
    for (const name of ["skeleton", "console"]) {
      if (indexExit) {
        assert.ok(!events.includes(`start:${name}`));
        assert.equal(rows.find((row) => row.name === name).executed, false);
        assert.ok(rows.some((row) => row.exitCode !== 0));
      } else
        for (const preflight of ["index", "resume"])
          assert.ok(
            events.indexOf(`end:${preflight}`) <
              events.indexOf(`start:${name}`),
            `${name} waits for ${preflight}`,
          );
    }
  }
});

test("failed split-case diagnostics survive aggregate evidence as addressed logs", (t) => {
  const repo = createFixtureRoot(join(tmpdir(), "dotln-case-output-"));
  t.after(() => rmSync(repo, { recursive: true, force: true }));
  const selected = [{ name: "release" }];
  const tasks = [
    "release:prepare",
    "release:case:concurrent",
    "release:case:passing",
  ].map((name) => ({ name }));
  const rows = tasks.map(({ name }) => ({
    name,
    executed: true,
    exitCode: name.endsWith(":concurrent") ? 1 : 0,
    output: name.endsWith(":concurrent")
      ? "retained failure details\n"
      : "passing noise\n",
  }));
  recordGateChecks(repo, [
    {
      ...aggregateSuiteRows(selected, tasks, rows)[0],
      checkId: "suite:release",
      treeHash: "a".repeat(40),
      recordedAt: new Date().toISOString(),
    },
  ]);
  const [recorded] = readGateChecks(repo);
  assert.equal(recorded.exitCode, 1);
  const failed = recorded.cases.find((row) => row.name.endsWith(":concurrent"));
  assert.ok(failed.outputRef);
  assert.equal(
    readFileSync(join(repo, failed.outputRef), "utf8"),
    "retained failure details\n",
  );
  assert.ok(recorded.cases.every((row) => !Object.hasOwn(row, "output")));
  assert.ok(
    recorded.cases
      .filter((row) => row.exitCode === 0)
      .every((row) => !row.outputRef),
  );
});
test("product suites describe protection and only declared file and case suites expand", () => {
  for (const row of suites) {
    assert.ok(row.protects?.length > 10, row.name);
    assert.ok(
      !row.protects.includes("validates its declared project surface"),
      row.name,
    );
  }
  const skeleton = suites.find((row) => row.name === "skeleton");
  assert.equal(skeleton.product, true);
  assert.equal(Boolean(skeleton.exclusive), false);
  for (const path of [
    "scripts/reactor-identity.mjs",
    "scripts/fixtures/historical-compiler-loader.mjs",
  ])
    assert.ok(skeleton.sources.includes(path));
  for (const row of suites.filter((row) => row.machinery))
    assert.ok(row.sources.length, row.name);
  const selected = suites.filter(
    (row) =>
      ![
        "release",
        "vertical",
        "launchpad",
        "target-worktree",
        "harness-fixtures",
      ].includes(row.name),
  );
  // The exclusive rows stand together in the expansion, so the names are
  // compared as a set.
  assert.deepEqual(
    expandSuiteTasks(selected, root)
      .map((row) => row.name)
      .sort(),
    selected.map((row) => row.name).sort(),
  );
  const hooks = suites.find((row) => row.name === "harness-fixtures");
  assert.deepEqual(
    expandSuiteTasks([hooks], root).map((row) => row.name),
    Array.from(
      { length: hooks.shards },
      (_, at) => `harness-fixtures:shard:${at + 1}`,
    ),
  );
  for (const name of ["harness-fixtures", "process-debt"])
    assert.equal(suites.find((row) => row.name === name).exclusive, true);
});
test("vertical tasks are one a file and keep the row's guards and the two-task concurrency bound", async () => {
  const suite = suites.find((row) => row.name === "vertical");
  const tasks = expandSuiteTasks([suite], root);
  assert.deepEqual(
    tasks.map((row) => [row.name, row.command.at(-1)]),
    [
      "scripts/test-vertical.mjs",
      "scripts/test-vertical-judgment.mjs",
      "scripts/test-vertical.recovery.mjs",
    ].map((file) => [`vertical:file:${basename(file)}`, file]),
  );
  for (const task of tasks) {
    // No task selects cases by name: each runs every case of its file.
    assert.deepEqual(task.command.slice(0, -1), suite.command.slice(0, -1));
    assert.deepEqual(task.args, []);
    assert.equal(task.product, true);
    assert.equal(task.needs, OUTSIDE_CONFINEMENT);
    assert.equal(task.loadSlots, 2);
  }
  let active = 0,
    peak = 0;
  const rows = await scheduleSuites([barrier, ...tasks], {
    parallelism: 16,
    concurrency: 4,
    execute: async (row) => {
      if (!row.build) {
        peak = Math.max(peak, ++active);
        await new Promise((done) => setTimeout(done, 10));
        active--;
      }
      return { name: row.name, executed: true, exitCode: 0, durationMs: 1 };
    },
  });
  assert.equal(peak, 2);
  const judged = rows.filter((row) => row.name !== "build");
  const verdict = (observed) => aggregateSuiteRows([suite], tasks, observed)[0];
  assert.equal(verdict(judged).exitCode, 0);
  assert.deepEqual(
    verdict(judged).expectedCases,
    tasks.map((row) => row.name),
  );
  assert.equal(verdict([...judged, judged[0]]).exitCode, 1);
  for (const task of tasks) {
    assert.equal(
      verdict(judged.filter((row) => row.name !== task.name)).exitCode,
      1,
    );
    for (const failure of [
      { exitCode: 1 },
      { failureKind: "timeout" },
      { executed: false },
    ])
      assert.equal(
        verdict(
          judged.map((row) =>
            row.name === task.name ? { ...row, ...failure } : row,
          ),
        ).exitCode,
        1,
      );
  }
});
test("exclusive suites without an overlap declaration run alone and shared suites use remaining lanes", async () => {
  const isolatedNames = new Set([
    "harness-fixtures",
    "process-debt",
    "sync-fixtures",
    "launchpad",
    "worktree-integration",
  ]);
  const selected = suites.filter((row) =>
    [
      "build",
      "skeleton",
      "console",
      "harness-fixtures",
      "process-debt",
      "sync-fixtures",
      "launchpad",
      "worktree-integration",
    ].includes(row.name),
  );
  const active = new Map(),
    overlap = new Set();
  let shardPeak = 0;
  const tasks = expandSuiteTasks(
    selected.map((row) => ({
      ...row,
      overlap: row.exclusive ? 0 : row.overlap,
    })),
    root,
  );
  const rows = await scheduleSuites(tasks, {
    parallelism: 16,
    concurrency: 4,
    lightTasks: new Set(),
    execute: async (row) => {
      const shard = row.shard?.row === "harness-fixtures";
      const shardsActive = [...active.keys()].filter((name) =>
        name.startsWith("harness-fixtures:shard:"),
      );
      assert.equal(
        row.gateContext.loadClass,
        row.build || (row.exclusive && !shard) ? "isolated" : "shared",
      );
      assert.ok(
        [...active.values()].reduce((sum, slots) => sum + slots, 0) +
          row.gateContext.reservedSlots <=
          4,
      );
      assert.ok(![...active.keys()].some((name) => isolatedNames.has(name)));
      // A shard runs beside its own row's shards and beside nothing else:
      // with no overlap declared, the four lanes are the row's.
      if (shard) {
        assert.equal(shardsActive.length, active.size);
        assert.equal(row.gateContext.reservedSlots, 1);
        assert.equal(row.gateContext.concurrency, row.shard.count);
        shardPeak = Math.max(shardPeak, shardsActive.length + 1);
      } else assert.equal(shardsActive.length, 0);
      if (isolatedNames.has(row.name)) {
        assert.equal(active.size, 0);
        assert.equal(row.gateContext.reservedSlots, 4);
        assert.equal(row.gateContext.concurrency, 1);
        assert.ok(
          !["harness-fixtures", "process-debt"].some((name) =>
            active.has(name),
          ),
        );
      }
      if (row.name === "skeleton") {
        assert.equal(row.priority, 80);
        assert.equal(row.gateContext.reservedSlots, 1);
        assert.equal(row.gateContext.concurrency, 4);
        assert.equal(row.gateContext.loadFactor, 8);
      }
      active.set(row.name, row.gateContext.reservedSlots);
      if (shard && active.has("process-debt")) overlap.add("hooks");
      if (shard && active.has("console:fixtures")) overlap.add("hook-light");
      if (active.has("skeleton") && active.has("console"))
        overlap.add("heavy-pair");
      await new Promise((done) => setTimeout(done, 10));
      active.delete(row.name);
      return { name: row.name, exitCode: 0, executed: true };
    },
  });
  assert.equal(rows.length, tasks.length);
  assert.equal(overlap.has("hook-light"), false);
  assert.ok(overlap.has("heavy-pair"));
  assert.equal(overlap.has("hooks"), false);
  // Four lanes hold the three shards at once, a lane each.
  assert.equal(shardPeak, 3);
  for (const concurrency of [1, 2, 4]) {
    await scheduleSuites(
      [
        barrier,
        { name: "running", command: ["fixture"], priority: 2 },
        {
          name: "exclusive",
          command: ["fixture"],
          exclusive: true,
          priority: 1,
        },
        { name: "later", command: ["fixture"] },
      ],
      {
        parallelism: 16,
        concurrency,
        execute: async (row) => {
          if (row.exclusive) assert.equal(active.size, 0);
          else assert.ok(!active.has("exclusive"));
          active.set(row.name, row.gateContext.reservedSlots);
          await new Promise((done) => setTimeout(done, 5));
          active.delete(row.name);
          return { name: row.name, exitCode: 0 };
        },
      },
    );
  }
});
for (const blockedBy of ["group", "dependency"])
  test(`priority-regression: a ${blockedBy}-blocked row cannot hide a ready exclusive`, async () => {
    const signal = () => {
      let resolve;
      const promise = new Promise((done) => {
        resolve = done;
      });
      return { promise, resolve };
    };
    const names = ["first", "second", "next", "heavy"];
    const entered = Object.fromEntries(names.map((name) => [name, signal()]));
    const released = Object.fromEntries(names.map((name) => [name, signal()]));
    const events = [];
    const group =
      blockedBy === "group" ? { group: "shared", groupLimit: 2 } : {};
    const waitFor = async (promise, label) => {
      let timer;
      try {
        return await Promise.race([
          promise,
          new Promise((_, reject) => {
            timer = setTimeout(
              () => reject(new Error(`Timed out waiting for ${label}`)),
              5_000,
            );
          }),
        ]);
      } finally {
        clearTimeout(timer);
      }
    };
    const run = scheduleSuites(
      [
        barrier,
        { name: "first", command: ["fixture"], priority: 3000, ...group },
        { name: "second", command: ["fixture"], priority: 3000, ...group },
        {
          name: "next",
          command: ["fixture"],
          priority: 3000,
          ...group,
          ...(blockedBy === "dependency" ? { after: ["first"] } : {}),
        },
        {
          name: "exclusive",
          command: ["fixture"],
          exclusive: true,
          priority: 1200,
        },
        { name: "heavy", command: ["fixture"], loadSlots: 2 },
      ],
      {
        parallelism: 16,
        concurrency: 4,
        keepGoing: true,
        lightTasks: new Set(),
        execute: async (row) => {
          events.push(`start:${row.name}`);
          entered[row.name]?.resolve();
          if (released[row.name]) await released[row.name].promise;
          events.push(`end:${row.name}`);
          return { name: row.name, exitCode: 0, executed: true };
        },
      },
    );
    try {
      await waitFor(
        Promise.all([entered.first.promise, entered.second.promise]),
        "both leading tasks",
      );
      released.first.resolve();
      await waitFor(entered.next.promise, "the newly eligible priority task");
      for (const name of names) released[name].resolve();
      const rows = await waitFor(run, "scheduler completion");
      assert.equal(rows.length, 6);
      assert.ok(rows.every((row) => row.exitCode === 0));
      assert.ok(
        events.indexOf("start:next") < events.indexOf("start:exclusive"),
        events.join(", "),
      );
      assert.ok(
        events.indexOf("end:exclusive") < events.indexOf("start:heavy"),
        events.join(", "),
      );
    } finally {
      for (const name of names) released[name].resolve();
      await waitFor(run, "released scheduler completion");
    }
  });

test("test discovery refuses missing compiled cases instead of silently succeeding", () => {
  const repo = createFixtureRoot(join(tmpdir(), "dotln-runner-"));
  try {
    assert.throws(
      () => expand(["packages/missing/dist/test/*.test.js"], repo),
      /Missing built test suite/,
    );
    mkdirSync(join(repo, "test"));
    writeFileSync(join(repo, "test/one.test.js"), "");
    assert.deepEqual(expand(["test/*.test.js"], repo), ["test/one.test.js"]);
  } finally {
    rmSync(repo, { recursive: true, force: true });
  }
});
test("timeout is an executed failure with suite identity and measured duration", async () => {
  const row = await executeSuite(
    {
      name: "slow-fixture",
      command: [process.execPath, "-e", "setInterval(() => {}, 1000)"],
    },
    root,
    35,
  );
  assert.equal(row.executed, true);
  assert.notEqual(row.exitCode, 0);
  assert.ok(row.durationMs >= 35);
  assert.match(row.output, /Suite slow-fixture timed out/);
});

test("only and document CLI selection execute their declared checks with the projection build", async () => {
  const repo = createFixtureRoot(join(tmpdir(), "dotln-runner-cli-"));
  try {
    const fixtureGitOptions = {
      exec: true,
      trim: false,

      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    };
    runGit(repo, ["init", "-q"], fixtureGitOptions);
    excludeFixtureOwnership(repo);
    runGit(repo, ["config", "user.name", "Fixture"], fixtureGitOptions);
    runGit(
      repo,
      ["config", "user.email", "fixture@example.invalid"],
      fixtureGitOptions,
    );
    writeFileSync(
      join(repo, ".gitignore"),
      "docs/control/local/\n.runtime/\nobserved.jsonl\n",
    );
    mkdirSync(join(repo, "scripts"));
    const observer =
      'require("node:fs").appendFileSync("observed.jsonl", JSON.stringify(process.argv.slice(1))+"\\n");';
    // The stub list is the registration check's own input (WO-157 item 13).
    const { DOCUMENT_GATE_STUBS } =
      await import("./lib/document-gate-stubs.mjs");
    for (const file of DOCUMENT_GATE_STUBS) {
      const target = join(repo, "scripts", file);
      mkdirSync(dirname(target), { recursive: true });
      writeFileSync(
        target,
        file.endsWith(".sh")
          ? "#!/usr/bin/env bash\nexec " +
              JSON.stringify(process.execPath) +
              " --input-type=module -e " +
              "'" +
              observer
                .replace('require("node:fs")', "fs")
                .replace(/^/, 'import fs from "node:fs";\n') +
              "'" +
              ' "$0" "$@"\n'
          : file.endsWith(".mjs")
            ? observer
                .replace('require("node:fs")', "fs")
                .replace(/^/, 'import fs from "node:fs";\n')
            : observer,
      );
    }
    mkdirSync(join(repo, "corpus/harness"), { recursive: true });
    writeFileSync(
      join(repo, "corpus/harness/wo101-id-corpus.test.mjs"),
      observer
        .replace('require("node:fs")', "fs")
        .replace(/^/, 'import fs from "node:fs";\n'),
    );
    for (const name of ["kernel", "skeleton", "console"]) {
      const directory = join(repo, `packages/${name}/dist/test`);
      mkdirSync(directory, { recursive: true });
      writeFileSync(join(directory, "fixture.test.js"), observer);
    }
    writeFileSync(
      join(repo, "package.json"),
      JSON.stringify({
        scripts: { "format:check": "node scripts/format.cjs" },
      }),
    );
    runGit(repo, ["add", "."], fixtureGitOptions);
    runGit(
      repo,
      ["-c", "maintenance.auto=false", "commit", "-qm", "Runner fixture"],
      fixtureGitOptions,
    );
    assert.equal(
      (await runGate(["--only", "format", "--serial"], repo)).exitCode,
      0,
    );
    let observed = readFileSync(join(repo, "observed.jsonl"), "utf8")
      .trim()
      .split("\n")
      .map(JSON.parse);
    assert.equal(observed.length, CORE_STRUCTURAL_TASKS.length);
    assert.ok(observed[0][0].endsWith("format.cjs"));
    assert.equal((await runGate(["--document", "--serial"], repo)).exitCode, 0);
    observed = readFileSync(join(repo, "observed.jsonl"), "utf8")
      .trim()
      .split("\n")
      .map(JSON.parse);
    // An instance's configuration row is a structural row of the other
    // root: core's document selection does not hold it.
    const documentCount =
      suites.filter(
        (row) =>
          row.document &&
          !row.generated &&
          !(row.structural && !CORE_STRUCTURAL_TASKS.includes(row.name)),
      ).length +
      1 +
      suites
        .find((row) => row.name === "local-runner-double")
        .command.filter((part) => part.endsWith(".mjs")).length -
      1;
    assert.equal(observed.length, CORE_STRUCTURAL_TASKS.length + documentCount);
    assert.ok(observed.some((row) => row[0].includes("build")));
    assert.deepEqual(observed.at(-1).slice(1), ["check"]);
    const repeated = await runGate(["--document", "--serial"], repo);
    assert.equal(repeated.reusedSuites, 0, "each requested suite runs fresh");
    assert.equal(
      readFileSync(join(repo, "observed.jsonl"), "utf8").trim().split("\n")
        .length,
      CORE_STRUCTURAL_TASKS.length + 2 * documentCount,
    );
    await assert.rejects(runGate(["--only", "unknown"], repo), /Unknown suite/);
    assert.deepEqual(
      activeGateRuns(repo),
      [],
      "normal and throwing runs release their markers",
    );
  } finally {
    rmSync(repo, { recursive: true, force: true });
  }
});

// The document gate's terms task is the real script over the lines a branch
// adds; every other document task is the stub the CLI-selection case uses.
test("the document gate's terms task fails a line the branch adds with a refused term by file, line and mode, never the term, and advises without a list (WO-259)", async () => {
  const repo = realpathSync(
    createFixtureRoot(join(tmpdir(), "dotln-runner-terms-")),
  );
  try {
    const gitOptions = {
      exec: true,
      trim: false,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    };
    runGit(repo, ["init", "-q", "-b", "main"], gitOptions);
    excludeFixtureOwnership(repo);
    runGit(repo, ["config", "user.name", "Fixture"], gitOptions);
    runGit(
      repo,
      ["config", "user.email", "fixture@example.invalid"],
      gitOptions,
    );
    writeFileSync(
      join(repo, ".gitignore"),
      "docs/control/local/\n.runtime/\nobserved.jsonl\n",
    );
    const observer =
      'import fs from "node:fs";\nfs.appendFileSync("observed.jsonl", JSON.stringify(process.argv.slice(1))+"\\n");';
    const real = join(root, "scripts/terms.mjs");
    const { DOCUMENT_GATE_STUBS } =
      await import("./lib/document-gate-stubs.mjs");
    for (const file of DOCUMENT_GATE_STUBS) {
      const target = join(repo, "scripts", file);
      mkdirSync(dirname(target), { recursive: true });
      writeFileSync(
        target,
        file === "terms.mjs"
          ? `process.argv[1] = ${JSON.stringify(real)};\nawait import(${JSON.stringify(pathToFileURL(real).href)});\n`
          : file.endsWith(".sh")
            ? `#!/usr/bin/env bash\nexec ${JSON.stringify(process.execPath)} --input-type=module -e '${observer}' "$0" "$@"\n`
            : file.endsWith(".mjs")
              ? observer
              : observer.replace(
                  'import fs from "node:fs";',
                  'const fs = require("node:fs");',
                ),
      );
    }
    mkdirSync(join(repo, "corpus/harness"), { recursive: true });
    writeFileSync(
      join(repo, "corpus/harness/wo101-id-corpus.test.mjs"),
      observer,
    );
    for (const name of ["kernel", "skeleton", "console"]) {
      const directory = join(repo, `packages/${name}/dist/test`);
      mkdirSync(directory, { recursive: true });
      writeFileSync(
        join(directory, "fixture.test.js"),
        observer.replace(
          'import fs from "node:fs";',
          'const fs = require("node:fs");',
        ),
      );
    }
    writeFileSync(
      join(repo, "package.json"),
      JSON.stringify({
        scripts: { "format:check": "node scripts/format.cjs" },
      }),
    );
    mkdirSync(join(repo, "docs"), { recursive: true });
    writeFileSync(join(repo, "docs/carried.md"), "# Carried\n\nOn main.\n");
    // The term's two halves, kept apart on main by a guard line.
    writeFileSync(
      join(repo, "docs/joined.md"),
      "# Joined\n\nzephyr\nA guard line.\ncanary\n",
    );
    runGit(repo, ["add", "."], gitOptions);
    runGit(
      repo,
      ["-c", "maintenance.auto=false", "commit", "-qm", "Runner fixture"],
      gitOptions,
    );
    runGit(repo, ["switch", "-q", "-c", "wo-901"], gitOptions);
    // The branch adds a refused term on line 3 of a changed Markdown file.
    writeFileSync(
      join(repo, "docs/carried.md"),
      "# Carried\n\nOn main; the zephyrcanary system.\n",
    );
    // Deleting the guard joins the halves, though no line is added.
    writeFileSync(join(repo, "docs/joined.md"), "# Joined\n\nzephyr\ncanary\n");
    // A staged path holding a space ends its diff header with a tab.
    mkdirSync(join(repo, "docs/space dir"), { recursive: true });
    writeFileSync(
      join(repo, "docs/space dir/notes file.md"),
      "# Notes\n\nThe zephyrcanary notes.\n",
    );
    runGit(repo, ["add", "docs/space dir/notes file.md"], gitOptions);
    mkdirSync(join(repo, "docs/control/local"), { recursive: true });
    writeFileSync(
      join(repo, "docs/control/local/terms.txt"),
      "refuse: zephyrcanary\n",
    );
    const failed = await runGate(["--document", "--serial"], repo);
    assert.notEqual(failed.exitCode, 0);
    assert.equal(failed.failedFirst, "terms");
    assert.match(
      failed.output,
      /^terms: failed\n[\s\S]*FAIL docs\/carried\.md:3: a local term in refuse mode/mu,
    );
    assert.match(
      failed.output,
      /^FAIL docs\/joined\.md:3-4: a local term in refuse mode$/mu,
    );
    assert.match(
      failed.output,
      /^FAIL docs\/space dir\/notes file\.md:3: a local term in refuse mode$/mu,
    );
    assert.doesNotMatch(failed.output, /zephyrcanary/u);
    // A passing terms task's context-mode lines are relayed as advisories
    // are (WO-276 criterion A1): the list holds an entry in each section,
    // one marked review and one unmarked line above both, and the branch
    // adds a line carrying each but the refuse entry.
    writeFileSync(
      join(repo, "docs/control/local/terms.txt"),
      "plainword\nrefuse:\nabsentcanary\ncontext:\nquietharbor\nreview: readword\n",
    );
    writeFileSync(
      join(repo, "docs/classes.md"),
      "# Classes\n\nA plainword line.\nA quiet-harbor line.\nA readword line.\n",
    );
    const printed = [];
    const log = console.log;
    console.log = (line) => printed.push(String(line));
    let listed;
    try {
      listed = await runGate(["--document", "--serial"], repo);
    } finally {
      console.log = log;
    }
    assert.equal(listed.exitCode, 0, listed.output);
    const relayed = printed.join("\n");
    assert.match(
      relayed,
      /^PASS terms .*\n {2}\[terms\] CONTEXT docs\/classes\.md:3: a local term in context mode\n {2}\[terms\] CONTEXT docs\/classes\.md:4: a local term in context mode\n {2}\[terms\] CONTEXT docs\/classes\.md:5: a local term in context mode$/mu,
    );
    assert.doesNotMatch(relayed, /plainword|quiet-?harbor|readword/u);
    rmSync(join(repo, "docs/classes.md"));
    // Without a registered list the task says so, as an advisory, and passes.
    rmSync(join(repo, "docs/control/local/terms.txt"));
    assert.equal((await runGate(["--document", "--serial"], repo)).exitCode, 0);
    const advised = spawnSync(
      process.execPath,
      [join(repo, "scripts/terms.mjs"), "branch"],
      { cwd: repo, encoding: "utf8" },
    );
    assert.equal(advised.status, 0, advised.stderr);
    assert.match(
      advised.stdout,
      /^local-terms list: unavailable\nAdvisory: no local-terms list is registered at docs\/control\/local\/terms\.txt, so the \d+ files this branch changes were not screened/mu,
    );
  } finally {
    rmSync(repo, { recursive: true, force: true });
  }
});

// A repository whose branch adds the given files, for the terms task run as
// the document gate runs it: from the repository's root, against its merge
// base with main, with the given text as the ignored private list.
function termsBranchFixture(t, list, files) {
  const repo = realpathSync(
    createFixtureRoot(join(tmpdir(), "dotln-terms-branch-")),
  );
  t.after(() => rmSync(repo, { recursive: true, force: true }));
  const git = (...args) =>
    runGit(repo, ["-c", "maintenance.auto=false", ...args], {
      exec: true,
      trim: false,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });
  git("init", "-q", "-b", "main");
  excludeFixtureOwnership(repo);
  git("config", "user.name", "Fixture");
  git("config", "user.email", "fixture@example.invalid");
  writeFileSync(join(repo, ".gitignore"), "docs/control/local/\n");
  git("add", ".");
  git("commit", "-qm", "Terms fixture");
  git("switch", "-q", "-c", "wo-901");
  mkdirSync(join(repo, "docs/control/local"), { recursive: true });
  const write = (path, text) => writeFileSync(join(repo, path), text);
  const setList = (text) => write("docs/control/local/terms.txt", text);
  setList(list);
  for (const [path, text] of Object.entries(files)) write(path, text);
  const branch = () =>
    spawnSync(process.execPath, [join(root, "scripts/terms.mjs"), "branch"], {
      cwd: repo,
      encoding: "utf8",
    });
  return { repo, write, setList, branch };
}

test("WO-276 criterion A1: the terms task fails one line for a refuse entry and lists a line for each context entry, sectioned, marked review or unmarked, naming no term", (t) => {
  const lines = [
    "# Classes",
    "",
    "A plainword line.",
    "A quiet harbor line.",
    "A readword line.",
    "The zephyr-canary system.",
  ];
  const { write, branch } = termsBranchFixture(
    t,
    "plainword\nrefuse:\nZephyr Canary\ncontext:\nQuiet Harbor\nreview: readword\n",
    { "docs/classes.md": `${lines.join("\n")}\n` },
  );
  const context = [3, 4, 5].map(
    (line) => `CONTEXT docs/classes.md:${line}: a local term in context mode`,
  );
  const status = (refused) =>
    `local-terms list: present; entries: 1 refuse, 3 context; changed files screened: 1; lines found: ${refused} refuse, 3 context`;
  const refused = branch();
  assert.equal(refused.status, 1);
  assert.equal(
    refused.stderr,
    "FAIL docs/classes.md:6: a local term in refuse mode\n",
  );
  assert.equal(refused.stdout, `${[status(1), ...context].join("\n")}\n`);
  // With the refuse entry's line gone from the branch the task passes and
  // still lists the three.
  write("docs/classes.md", `${lines.slice(0, 5).join("\n")}\n`);
  const passed = branch();
  assert.equal(passed.status, 0, passed.stderr);
  assert.equal(passed.stderr, "");
  assert.equal(passed.stdout, `${[status(0), ...context].join("\n")}\n`);
  for (const result of [refused, passed])
    assert.doesNotMatch(
      result.stdout + result.stderr,
      /plainword|quiet.?harbor|readword|zephyr|canary/iu,
    );
});

test("WO-276 criterion B5: the terms task leaves out the carried parser where its bytes are the recorded ones and screens a copy changed by one byte, and a file beside it, as any added file", (t) => {
  const carried = "scripts/lib/vendor/prettier-LICENSE";
  const text = "Copyright the Zephyr Canary authors.\n";
  const record = (bytes) =>
    `${JSON.stringify({
      schemaVersion: 1,
      package: "prettier",
      version: "0.0.0",
      files: { [carried]: createHash("sha256").update(bytes).digest("hex") },
    })}\n`;
  const { repo, write, branch } = termsBranchFixture(
    t,
    "refuse:\nZephyr Canary\n",
    {},
  );
  mkdirSync(join(repo, "scripts/lib/vendor"), { recursive: true });
  write(carried, text);
  write("scripts/lib/vendored-parser.json", record(text));
  const proven = branch();
  assert.equal(proven.status, 0, proven.stderr);
  assert.equal(proven.stderr, "");
  assert.match(proven.stdout, /changed files screened: 1; /u);
  // One byte more and the file is this branch's text like any other.
  write(carried, `${text}\n`);
  const changed = branch();
  assert.equal(changed.status, 1);
  assert.equal(
    changed.stderr,
    `FAIL ${carried}:1: a local term in refuse mode\n`,
  );
  // A file beside the proven copy is never left out, whatever it holds.
  write(carried, text);
  write("scripts/lib/vendor/other-LICENSE", text);
  const beside = branch();
  assert.equal(beside.status, 1);
  assert.equal(
    beside.stderr,
    "FAIL scripts/lib/vendor/other-LICENSE:1: a local term in refuse mode\n",
  );
});

test("WO-276 criterion A16: the kit's example list answers its sample with the two streams the kit guide shows, and without its section lines every entry is context", (t) => {
  const example = readFileSync(
    join(root, "scripts/kit/terms.example.txt"),
    "utf8",
  );
  const expected = (name) =>
    readFileSync(join(root, "scripts/fixtures/terms-example", name), "utf8");
  const { setList, branch } = termsBranchFixture(t, example, {
    "docs/sample.md": expected("sample.md"),
  });
  const sectioned = branch();
  assert.equal(sectioned.status, 1);
  assert.equal(sectioned.stdout, expected("expected-stdout.txt"));
  assert.equal(sectioned.stderr, expected("expected-stderr.txt"));
  // The same entries with the two section lines removed are all context.
  const plain = example
    .split("\n")
    .filter((line) => line !== "refuse:" && line !== "context:")
    .join("\n");
  assert.notEqual(plain, example);
  setList(plain);
  const unsectioned = branch();
  assert.equal(unsectioned.status, 0, unsectioned.stderr);
  assert.equal(unsectioned.stderr, "");
  assert.equal(
    unsectioned.stdout,
    [
      "local-terms list: present; entries: 0 refuse, 3 context; changed files screened: 1; lines found: 0 refuse, 3 context",
      ...[1, 2, 3].map(
        (line) =>
          `CONTEXT docs/sample.md:${line}: a local term in context mode`,
      ),
      "",
    ].join("\n"),
  );
});

// An unclassified docs JSONL and an unstubbed document suite fail the document
// gate, not only the suite that enumerates them (WO-157 item 13, WO-151 D021).
test("WO-157 the document gate refuses an unregistered docs JSONL and an unstubbed document suite", (t) => {
  const row = suites.find((candidate) => candidate.name === "registrations");
  assert.ok(
    row?.document,
    "test:docs carries the registration row (WO-151 D021)",
  );
  const parent = realpathSync(
    createFixtureRoot(join(tmpdir(), "dotln-registrations-")),
  );
  t.after(() => rmSync(parent, { recursive: true, force: true }));
  const copy = join(parent, "repository");
  execGit([
    "-c",
    "maintenance.auto=false",
    "clone",
    "--quiet",
    "--shared",
    root,
    copy,
  ]);
  const listed = (...args) =>
    execGit(["-C", root, ...args], { encoding: "utf8" })
      .split("\0")
      .filter(Boolean);
  for (const path of [
    ...listed("diff", "-z", "--name-only", "--no-renames", "HEAD"),
    ...listed("ls-files", "-z", "--others", "--exclude-standard"),
  ])
    if (existsSync(join(root, path))) {
      mkdirSync(dirname(join(copy, path)), { recursive: true });
      cpSync(join(root, path), join(copy, path));
    } else rmSync(join(copy, path), { force: true });
  symlinkSync(join(root, "node_modules"), join(copy, "node_modules"));
  const env = Object.fromEntries(
    Object.entries(process.env).filter(([key]) => key !== "DOTLN_LAUNCHPAD"),
  );
  const bootstrap = spawnSync(process.execPath, ["scripts/build.mjs"], {
    cwd: copy,
    encoding: "utf8",
    env,
    timeout: 60_000,
  });
  assert.equal(bootstrap.status, 0, bootstrap.stdout + bootstrap.stderr);
  const check = () =>
    spawnSync(process.execPath, [row.command[1]], {
      cwd: copy,
      encoding: "utf8",
      env,
    });
  const clean = check();
  assert.equal(clean.status, 0, clean.stdout + clean.stderr);
  // Untracked, as entropy-reducer.jsonl was during WO-151's own runs.
  writeFileSync(
    join(copy, "docs/evidence/wo157-planted.jsonl"),
    '{"planted":true}\n',
  );
  const planted = check();
  assert.equal(planted.status, 1);
  assert.match(
    planted.stderr,
    /unregistered JSONL: docs\/evidence\/wo157-planted\.jsonl is not an EventEnvelope stream/u,
  );
  rmSync(join(copy, "docs/evidence/wo157-planted.jsonl"));
  const registryBefore = readFileSync(
    join(copy, "packages/kernel/test/fixtures/jsonl-protocols.json"),
    "utf8",
  );
  mkdirSync(join(copy, "docs/evidence/WO-998"), { recursive: true });
  writeFileSync(join(copy, "docs/evidence/WO-998/raw.jsonl"), '{"raw":true}\n');
  const declaration = join(copy, "docs/evidence/WO-998/jsonl.json");
  writeFileSync(
    declaration,
    JSON.stringify({
      schemaVersion: 1,
      nonEventPaths: {
        "raw.jsonl": "Evidence projection, not an EventEnvelope",
      },
    }),
  );
  const declared = check();
  assert.equal(declared.status, 0, declared.stderr);
  assert.equal(
    readFileSync(
      join(copy, "packages/kernel/test/fixtures/jsonl-protocols.json"),
      "utf8",
    ),
    registryBefore,
  );
  writeFileSync(
    declaration,
    JSON.stringify({
      schemaVersion: 1,
      nonEventPaths: { "../../control/orders/WO-160.jsonl": "escape" },
    }),
  );
  assert.match(check().stderr, /Invalid evidence JSONL target/);
  writeFileSync(
    declaration,
    JSON.stringify({ schemaVersion: 1, nonEventPaths: { "raw.jsonl": "" } }),
  );
  assert.match(check().stderr, /Invalid evidence JSONL target/);
  rmSync(join(copy, "docs/evidence/WO-998"), { recursive: true });
  const stubs = join(copy, "scripts/lib/document-gate-stubs.mjs");
  writeFileSync(
    stubs,
    readFileSync(stubs, "utf8").replace(/^\s*"entropy\.mjs",\n/mu, ""),
  );
  const unstubbed = check();
  assert.equal(unstubbed.status, 1);
  assert.match(
    unstubbed.stderr,
    /unstubbed document suite: entropy runs scripts\/entropy\.mjs/u,
  );
});

test("WO-125 nested gate markers remain independent and local to their worktree", (t) => {
  const repo = createFixtureRoot(join(tmpdir(), "dotln-gate-markers-"));
  const other = createFixtureRoot(join(tmpdir(), "dotln-gate-other-"));
  t.after(() => {
    rmSync(repo, { recursive: true, force: true });
    rmSync(other, { recursive: true, force: true });
  });
  const first = beginGateRun(repo, "outer evidence fixture");
  const second = beginGateRun(repo, "inner runner fixture");
  try {
    assert.equal(activeGateRuns(repo).length, 2);
    assert.deepEqual(activeGateRuns(other), []);
    first.release();
    assert.deepEqual(
      activeGateRuns(repo).map((run) => run.runId),
      [second.run.runId],
    );
  } finally {
    first.release();
    second.release();
  }
  assert.deepEqual(activeGateRuns(repo), []);
});

test("WO-044 a stop request reaches a gate through its marker lineage and is consumed with the marker", async (t) => {
  const repo = createFixtureRoot(join(tmpdir(), "dotln-gate-stop-"));
  const markers = join(repo, "docs/control/local/harness/active-gates");
  const saved = process.env[GATE_RUN_ENVIRONMENT];
  t.after(() => {
    if (saved === undefined) delete process.env[GATE_RUN_ENVIRONMENT];
    else process.env[GATE_RUN_ENVIRONMENT] = saved;
    rmSync(repo, { recursive: true, force: true });
  });
  delete process.env[GATE_RUN_ENVIRONMENT];
  const idle = requestGateStop(repo, { waitMs: 0 });
  assert.deepEqual(idle, {
    contract: "gate-stop-v1",
    requestedAt: idle.requestedAt,
    requested: [],
    stopped: [],
    active: [],
  });
  assert.ok(Number.isFinite(Date.parse(idle.requestedAt)));
  // A stale request left by a dead run is swept, never honoured by a new run.
  mkdirSync(markers, { recursive: true });
  const stale = "00000000-0000-4000-8000-000000000000";
  writeFileSync(join(markers, `${stale}.stop`), "{}\n");
  requestGateStop(repo, { waitMs: 0 });
  assert.equal(existsSync(join(markers, `${stale}.stop`)), false);
  const outer = beginGateRun(repo, "outer evidence fixture");
  assert.deepEqual(gateRunLineage(), [outer.run.runId]);
  const inner = beginGateRun(repo, "inner runner fixture");
  assert.deepEqual(gateRunLineage(), [outer.run.runId, inner.run.runId]);
  try {
    assert.equal(outer.stopRequested(), false);
    assert.equal(inner.stopRequested(), false);
    // This process owns both runs, so they stay active for the bounded wait;
    // each carries a request afterwards and reads it at its next boundary.
    const outcome = requestGateStop(repo, { waitMs: 0 });
    assert.deepEqual(
      outcome.requested.map((run) => run.runId).sort(),
      [outer.run.runId, inner.run.runId].sort(),
    );
    assert.deepEqual(outcome.stopped, []);
    assert.equal(outcome.active.length, 2);
    assert.ok(
      outcome.active.every(
        (run) => run.pid === process.pid && run.command && run.startedAt,
      ),
    );
    assert.equal(outer.stopRequested(), true);
    assert.equal(inner.stopRequested(), true);
    assert.deepEqual(gateStopRequested(repo, [inner.run.runId]), [
      inner.run.runId,
    ]);
    // A child of the inner run inherits both ids and sees the request.
    const child = spawn(
      process.execPath,
      [
        "--input-type=module",
        "-e",
        `import {gateStopRequested} from ${JSON.stringify(resolve(root, "scripts/lib/gate-evidence.mjs"))}; process.stdout.write(JSON.stringify(gateStopRequested(process.cwd())));`,
      ],
      { cwd: repo, stdio: ["ignore", "pipe", "pipe"] },
    );
    let stdout = "";
    child.stdout.on("data", (chunk) => (stdout += chunk));
    await new Promise((resolveExit) => child.once("close", resolveExit));
    assert.deepEqual(
      JSON.parse(stdout).sort(),
      [outer.run.runId, inner.run.runId].sort(),
    );
  } finally {
    inner.release();
    outer.release();
  }
  assert.deepEqual(gateRunLineage(), []);
  assert.equal(process.env[GATE_RUN_ENVIRONMENT], undefined);
  assert.deepEqual(
    readdirSync(markers).filter((name) => /\.(?:json|stop)$/.test(name)),
    [],
    "release removes the marker and its consumed request",
  );
});

test("WO-044 a gate that polls its request ends within the stop command's wait and leaves nothing behind", async (t) => {
  const repo = createFixtureRoot(join(tmpdir(), "dotln-gate-stop-child-"));
  t.after(() => rmSync(repo, { recursive: true, force: true }));
  const markers = join(repo, "docs/control/local/harness/active-gates");
  const child = spawn(
    process.execPath,
    [
      "--input-type=module",
      "-e",
      `import {beginGateRun} from ${JSON.stringify(resolve(root, "scripts/lib/gate-evidence.mjs"))}; const active = beginGateRun(process.cwd(), "polling gate fixture"); process.stdout.write("ready"); const timer = setInterval(() => { if (active.stopRequested()) { clearInterval(timer); active.release(); process.exit(0); } }, 50);`,
    ],
    { cwd: repo, stdio: ["ignore", "pipe", "pipe"] },
  );
  const exited = new Promise((resolveExit) => child.once("close", resolveExit));
  await new Promise((resolveReady, reject) => {
    child.stdout.once("data", resolveReady);
    child.once("error", reject);
    child.once("exit", () => reject(new Error("gate exited before ready")));
  });
  assert.equal(activeGateRuns(repo).length, 1);
  const outcome = requestGateStop(repo, { waitMs: 10_000 });
  assert.equal(outcome.requested.length, 1);
  assert.equal(outcome.requested[0].pid, child.pid);
  assert.deepEqual(outcome.stopped, outcome.requested);
  assert.deepEqual(outcome.active, []);
  assert.equal(await exited, 0);
  assert.deepEqual(activeGateRuns(repo), []);
  assert.deepEqual(
    readdirSync(markers).filter((name) => /\.(?:json|stop)$/.test(name)),
    [],
  );
});

test("WO-044 the runner honours a stop request at its next boundary, ends running suites and records no check", async () => {
  const repo = createFixtureRoot(join(tmpdir(), "dotln-runner-stop-"));
  try {
    const fixtureGitOptions = {
      exec: true,
      trim: false,

      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    };
    runGit(repo, ["init", "-q"], fixtureGitOptions);
    excludeFixtureOwnership(repo);
    runGit(repo, ["config", "user.name", "Fixture"], fixtureGitOptions);
    runGit(
      repo,
      ["config", "user.email", "fixture@example.invalid"],
      fixtureGitOptions,
    );
    writeFileSync(
      join(repo, ".gitignore"),
      "docs/control/local/\nobserved.jsonl\n",
    );
    mkdirSync(join(repo, "scripts"));
    // The suite announces itself, then stays resident long enough for the
    // runner's poll to end it; a run to completion would take five seconds.
    writeFileSync(
      join(repo, "scripts/format.cjs"),
      'require("node:fs").appendFileSync("observed.jsonl", "format\\n"); setTimeout(() => {}, 5000);',
    );
    writeFileSync(
      join(repo, "package.json"),
      JSON.stringify({
        scripts: { "format:check": "node scripts/format.cjs" },
      }),
    );
    runGit(repo, ["add", "."], fixtureGitOptions);
    runGit(
      repo,
      ["-c", "maintenance.auto=false", "commit", "-qm", "Runner stop fixture"],
      fixtureGitOptions,
    );
    // A request already present ends the gate before its first suite.
    await assert.rejects(
      runGate(["--only", "format", "--serial"], repo, {
        stopRequested: () => true,
      }),
      /^Error: Gate stopped by request after \d+ h \d+ min; no check recorded for tree [a-f0-9]{40,64}$/,
    );
    assert.equal(existsSync(join(repo, "observed.jsonl")), false);
    assert.deepEqual(readGateChecks(repo), []);
    assert.deepEqual(activeGateRuns(repo), []);
    // A request that arrives while a suite runs ends that suite through the
    // runner's own abort signal; the suite reports the stop, not a pass.
    const started = Date.now();
    await assert.rejects(
      runGate(["--only", "format", "--serial"], repo, {
        stopRequested: () => existsSync(join(repo, "observed.jsonl")),
      }),
      /Gate stopped by request/,
    );
    assert.ok(
      Date.now() - started < 4000,
      "the resident suite was ended, not awaited",
    );
    assert.equal(
      readFileSync(join(repo, "observed.jsonl"), "utf8"),
      "format\n",
    );
    assert.deepEqual(readGateChecks(repo), []);
    assert.deepEqual(activeGateRuns(repo), []);
  } finally {
    rmSync(repo, { recursive: true, force: true });
  }
});

test("WO-044 an aborted signal ends a running suite and its result names the stop", async () => {
  const controller = new AbortController();
  const started = Date.now();
  setTimeout(() => controller.abort(), 200);
  const result = await executeSuite(
    {
      name: "resident",
      command: [
        process.execPath,
        "-e",
        'process.on("SIGTERM", () => {}); setInterval(() => {}, 1000);',
      ],
    },
    root,
    60_000,
    () => {},
    controller.signal,
  );
  assert.equal(result.exitCode, 1);
  assert.equal(result.stopped, true);
  assert.match(result.output, /Suite resident stopped by gate request/);
  assert.ok(
    Date.now() - started < 10_000,
    "SIGKILL follows an ignored SIGTERM",
  );
  const already = await executeSuite(
    {
      name: "never",
      command: [process.execPath, "-e", "setInterval(() => {}, 1000)"],
    },
    root,
    60_000,
    () => {},
    AbortSignal.abort(),
  );
  assert.equal(already.stopped, true);
  assert.equal(already.exitCode, 1);
});

test("WO-044 VER-001 cancellation ends a grandchild holding inherited output pipes", async (t) => {
  const repo = createFixtureRoot(join(tmpdir(), "dotln-suite-descendants-"));
  let descendant;
  t.after(() => {
    if (descendant)
      try {
        process.kill(descendant, "SIGKILL");
      } catch {}
    rmSync(repo, { recursive: true, force: true });
  });
  const controller = new AbortController();
  const running = executeSuite(
    {
      name: "descendants",
      command: [
        process.execPath,
        "-e",
        `
    const {spawn} = require('node:child_process');
    const child = spawn(process.execPath, ['-e', 'process.on("SIGTERM",()=>{});require("node:fs").writeFileSync("ready", "yes");setInterval(()=>{},1000)'], {stdio:'inherit'});
    require('node:fs').writeFileSync('descendant.pid', String(child.pid));
    setInterval(()=>{},1000);
  `,
      ],
    },
    repo,
    10000,
    () => {},
    controller.signal,
  );
  for (let i = 0; i < 100 && !existsSync(join(repo, "ready")); i++)
    await new Promise((resolve) => setTimeout(resolve, 20));
  descendant = Number(readFileSync(join(repo, "descendant.pid"), "utf8"));
  const started = Date.now();
  controller.abort();
  const result = await running;
  assert.equal(result.stopped, true);
  assert.equal(result.exitCode, 1);
  assert.ok(
    Date.now() - started < 2500,
    "inherited descriptors cannot hang cancellation",
  );
});

test("WO-125 gate inputs include tracked ignored files and new installed roots, excluding scratch", (t) => {
  const repo = createFixtureRoot(join(tmpdir(), "dotln-gate-inputs-"));
  t.after(() => rmSync(repo, { recursive: true, force: true }));
  execGit(["init", "-q"], { cwd: repo });
  excludeFixtureOwnership(repo);
  mkdirSync(join(repo, "scratch"));
  writeFileSync(join(repo, ".gitignore"), "scratch/\nnode_modules/\ndist/\n");
  writeFileSync(join(repo, "scratch/retained.txt"), "tracked\n");
  execGit(["add", "-f", "scratch/retained.txt"], { cwd: repo });
  assert.equal(gateInputPath(repo, "scratch/new.txt"), false);
  assert.equal(gateInputPath(repo, "scratch/retained.txt"), true);
  assert.equal(gateInputPath(repo, "new-source.ts"), true);
  assert.equal(
    gateInputPath(repo, "node_modules/new-dependency/index.js"),
    true,
  );
  assert.equal(gateInputPath(repo, "packages/new-package/dist/index.js"), true);
});

test("WO-125 VER-002 installed input case aliases include prospective roots", (t) => {
  const repo = createFixtureRoot(join(tmpdir(), "dotln-gate-case-"));
  t.after(() => rmSync(repo, { recursive: true, force: true }));
  execGit(["init", "-q"], { cwd: repo });
  excludeFixtureOwnership(repo);
  mkdirSync(join(repo, "node_modules"));
  mkdirSync(join(repo, "packages/skeleton/dist"), { recursive: true });
  mkdirSync(join(repo, "packages/future"));
  writeFileSync(join(repo, ".gitignore"), "node_modules/\ndist/\n");
  if (!existsSync(join(repo, "NODE_MODULES"))) {
    t.skip("requires a case-insensitive filesystem");
    return;
  }
  for (const path of [
    "NODE_MODULES/probe.js",
    "Node_Modules/probe.js",
    "Packages/skeleton/dist/probe.js",
    "packages/skeleton/DIST/probe.js",
    "packages/future/DIST/probe.js",
  ])
    assert.equal(gateInputPath(repo, path), true, path);
});

test("WO-125 VER-002 resolves dangling links and physical parent traversal", (t) => {
  const repo = createFixtureRoot(join(tmpdir(), "dotln-gate-symlink-"));
  t.after(() => rmSync(repo, { recursive: true, force: true }));
  execGit(["init", "-q"], { cwd: repo });
  excludeFixtureOwnership(repo);
  mkdirSync(join(repo, "scratch"));
  mkdirSync(join(repo, "packages/skeleton"), { recursive: true });
  writeFileSync(join(repo, ".gitignore"), "scratch/\n");
  symlinkSync("../new-input.md", join(repo, "scratch/dangling.md"));
  symlinkSync("dangling.md", join(repo, "scratch/chained.md"));
  symlinkSync("../packages/skeleton", join(repo, "scratch/dirlink"));
  symlinkSync("dirlink/../linked.md", join(repo, "scratch/parent.md"));
  for (const path of [
    "scratch/dangling.md",
    "scratch/chained.md",
    "scratch/parent.md",
    "scratch/dirlink/../probe-new.md",
    "scratch/dirlink/../../new-input.md",
  ])
    assert.equal(gateInputPath(repo, path), true, path);
  symlinkSync("new-scratch.md", join(repo, "scratch/local.md"));
  symlinkSync(".", join(repo, "scratch/local-dir"));
  assert.equal(gateInputPath(repo, "scratch/local.md"), false);
  assert.equal(gateInputPath(repo, "scratch/local-dir/new.md"), false);
  symlinkSync("cycle.md", join(repo, "scratch/cycle.md"));
  assert.throws(() => gateInputPath(repo, "scratch/cycle.md"));
});

test("WO-125 VER-003 protects pre-existing hard links while ordinary scratch stays writable", (t) => {
  const repo = createFixtureRoot(join(tmpdir(), "dotln-gate-hardlink-"));
  t.after(() => rmSync(repo, { recursive: true, force: true }));
  execGit(["init", "-q"], { cwd: repo });
  excludeFixtureOwnership(repo);
  mkdirSync(join(repo, "scratch"));
  writeFileSync(join(repo, ".gitignore"), "scratch/\n");
  writeFileSync(join(repo, "input.ts"), "export const value = 1;\n");
  execGit(["add", "input.ts"], { cwd: repo });
  linkSync(join(repo, "input.ts"), join(repo, "scratch/input-link.ts"));
  symlinkSync("input-link.ts", join(repo, "scratch/via-symlink.ts"));
  for (const path of ["scratch/input-link.ts", "scratch/via-symlink.ts"])
    assert.equal(gateInputPath(repo, path), true, path);

  writeFileSync(join(repo, "scratch/local.txt"), "scratch\n");
  assert.equal(gateInputPath(repo, "scratch/local.txt"), false);
  assert.equal(gateInputPath(repo, "scratch/new.txt"), false);
  assert.equal(gateInputPath(repo, "scratch"), false);
  linkSync(
    join(repo, "scratch/local.txt"),
    join(repo, "scratch/local-link.txt"),
  );
  assert.equal(gateInputPath(repo, "scratch/local-link.txt"), true);
});

test("release cases use concurrent lanes, wait for preparation and require complete coverage", async () => {
  const selected = [barrier, suites.find((row) => row.name === "release")];
  const tasks = expandSuiteTasks(selected, root, "/synthetic-template");
  assert.equal(
    tasks.filter((row) => row.name.startsWith("release:case:")).length,
    (await import("./lib/release-fixtures.mjs")).releaseCases(root).length,
  );
  let active = 0,
    activeCases = 0,
    peak = 0,
    prepared = false;
  const rows = await scheduleSuites(tasks, {
    parallelism: 16,
    concurrency: 4,
    execute: async (row) => {
      if (row.name.startsWith("release:case:")) {
        assert.ok(prepared);
        activeCases++;
      }
      peak = Math.max(peak, ++active);
      await new Promise((done) => setTimeout(done, 1));
      active--;
      if (row.name.startsWith("release:case:")) activeCases--;
      if (row.name === "release:prepare") prepared = true;
      return { name: row.name, exitCode: 0, executed: true, durationMs: 1 };
    },
  });
  assert.ok(peak >= 2);
  assert.equal(aggregateSuiteRows(selected, tasks, rows)[1].exitCode, 0);
  assert.equal(
    aggregateSuiteRows(selected, tasks, rows.slice(0, -1))[1].exitCode,
    1,
  );
  assert.equal(
    aggregateSuiteRows(selected, tasks, [...rows, rows.at(-1)])[1].exitCode,
    1,
  );
  const refused = await scheduleSuites(tasks, {
    execute: async (row) => ({
      name: row.name,
      exitCode: row.name === "release:prepare" ? 1 : 0,
      executed: true,
    }),
  });
  assert.equal(
    refused.filter(
      (row) => row.name.startsWith("release:case:") && row.executed,
    ).length,
    0,
  );
  assert.equal(aggregateSuiteRows(selected, tasks, refused)[1].exitCode, 1);
});

test("console product and document selections execute every test exactly once", async (t) => {
  const repo = createFixtureRoot(join(tmpdir(), "dotln-console-dispatch-"));
  execGit(["init", "-q"], { cwd: repo });
  excludeFixtureOwnership(repo);
  t.after(() => rmSync(repo, { recursive: true, force: true }));
  const directory = join(repo, "packages/console/dist/test");
  mkdirSync(directory, { recursive: true });
  const names = [
    "WO-032 AC1/6 fixture",
    "WO-032 schema fixture",
    "[document] WO-032 host collection reads current sources and all shipped exports",
  ];
  writeFileSync(
    join(directory, "board.test.js"),
    `const test = require('node:test');\n${names
      .map((name) => `test(${JSON.stringify(name)}, () => {});`)
      .join("\n")}\n`,
  );
  const tasks = expandSuiteTasks(
    suites.filter((row) => ["console", "console-docs"].includes(row.name)),
    repo,
  );
  const observed = [];
  for (const [index, row] of tasks.entries()) {
    const result = await executeSuite(row, repo);
    assert.equal(result.exitCode, 0, result.output);
    const executed = [...result.output.matchAll(/^ok \d+ - (.+)$/gm)]
      .map((match) => match[1])
      .filter((name) => !name.includes(" # SKIP"));
    assert.deepEqual(
      executed,
      names.filter(
        (name) => row.name.endsWith("-docs") === name.includes("[document]"),
      ),
    );
    observed.push(...executed);
  }
  assert.deepEqual(observed, names);
});

test("planning task dispatch delivers each selection flag to the executable", async (t) => {
  const repo = createFixtureRoot(join(tmpdir(), "dotln-plan-dispatch-"));
  t.after(() => rmSync(repo, { recursive: true, force: true }));
  mkdirSync(join(repo, "scripts"));
  writeFileSync(
    join(repo, "scripts/test-plan-refutation.mjs"),
    "console.log(JSON.stringify(process.argv.slice(2)));\n",
  );
  const tasks = expandSuiteTasks(
    [suites.find((row) => row.name === "plan-refutation")],
    repo,
  );
  assert.equal(tasks.length, 1);
  for (const [index, flag] of ["--fixtures-only"].entries()) {
    const result = await executeSuite(tasks[index], repo);
    assert.equal(result.exitCode, 0);
    assert.deepEqual(JSON.parse(result.output), [flag]);
  }
});

test("product glob reads observe recursive records through sync, callback and promise APIs", async (t) => {
  const repo = realpathSync(
    createFixtureRoot(join(tmpdir(), "dotln-glob-guard-")),
  );
  t.after(() => rmSync(repo, { recursive: true, force: true }));
  runGit(repo, ["init", "-q"]);
  excludeFixtureOwnership(repo);
  mkdirSync(join(repo, "docs/evidence/WO-999"), { recursive: true });
  writeFileSync(
    join(repo, "docs/evidence/WO-999/report.md"),
    "private fixture report\n",
  );
  writeFileSync(join(repo, ".gitignore"), "docs/control/local/\n");
  writeFileSync(
    join(repo, "probe.mjs"),
    `
import fs from 'node:fs';
fs.globSync('**/*');
await new Promise((resolve, reject) => fs.glob('**/*', (error, files) => error ? reject(error) : resolve(files)));
for await (const file of fs.promises.glob('**/*')) void file;
`,
  );
  runGit(repo, ["add", "."]);
  const result = await executeSuite(
    {
      name: "glob",
      product: true,
      activeOrder: "WO-999",
      command: [process.execPath, "probe.mjs"],
    },
    repo,
  );
  assert.equal(result.exitCode, 1, result.output);
  for (const method of ["globSync", "glob", "promises.glob"])
    assert.ok(result.output.includes(`(${method})`), result.output);
});

test("live progress arrives before a running process completes and remains bounded", async () => {
  const observed = [];
  let finished = false;
  let observeStarted;
  const started = new Promise((done) => {
    observeStarted = done;
  });
  const running = executeSuite(
    {
      name: "progress",
      command: [
        process.execPath,
        "-e",
        'console.log("# PROGRESS fixture begun   "); setTimeout(() => console.log("done"), 100);',
      ],
    },
    root,
    1000,
    (row) => {
      observed.push(row);
      assert.equal(finished, false);
      if (row.message === "PROGRESS fixture begun") observeStarted();
    },
  );
  await Promise.race([started, running]);
  assert.ok(observed.some((row) => row.message === "PROGRESS fixture begun"));
  const result = await running;
  finished = true;
  assert.equal(result.exitCode, 0);
  assert.ok(Date.parse(result.finishedAt) >= Date.parse(result.startedAt));
  const lots = [];
  await executeSuite(
    {
      name: "bounded",
      command: [
        process.execPath,
        "-e",
        'for(let i=0;i<100;i++) console.log("PROGRESS "+"x".repeat(500));',
      ],
    },
    root,
    1000,
    (row) => lots.push(row),
  );
  assert.equal(lots.length, 81);
  assert.ok(lots.every((row) => row.message.length <= 200));
});

test("code identity follows tracked source and dependency bytes across processes and revisions", () => {
  const repo = createFixtureRoot(join(tmpdir(), "dotln-code-identity-"));
  const fixtureGitOptions = { encoding: "utf8" };
  try {
    execGit(["-C", repo, "init", "-q"], fixtureGitOptions);
    excludeFixtureOwnership(repo);
    // As in confinementFixture, no detached maintenance may race teardown.
    execGit(
      ["-C", repo, "config", "maintenance.auto", "false"],
      fixtureGitOptions,
    );
    execGit(["-C", repo, "config", "user.name", "Fixture"], fixtureGitOptions);
    execGit(
      ["-C", repo, "config", "user.email", "fixture@example.invalid"],
      fixtureGitOptions,
    );
    mkdirSync(join(repo, "docs"));
    writeFileSync(
      join(repo, ".gitattributes"),
      "projection.js dotln-generated\nlib/README.md dotln-documentation\n",
    );
    writeFileSync(join(repo, "source.js"), "export const result = 1;\n");
    writeFileSync(join(repo, "projection.js"), "generated one\n");
    writeFileSync(join(repo, "docs/report.md"), "report one\n");
    // A README Git marks dotln-documentation is documentation; an unmarked
    // README and a Markdown file a test could read as an input are not
    // (WO-115 D026).
    mkdirSync(join(repo, "lib/other"), { recursive: true });
    writeFileSync(join(repo, "lib/README.md"), "readme one\n");
    writeFileSync(join(repo, "lib/other/README.md"), "input readme one\n");
    writeFileSync(join(repo, "lib/fixture.md"), "fixture one\n");
    writeFileSync(
      join(repo, "package.json"),
      '{"private":true,"dependencies":{"fixture":"1.0.0"}}\n',
    );
    execGit(["-C", repo, "add", "."], fixtureGitOptions);
    execGit(
      ["-C", repo, "-c", "maintenance.auto=false", "commit", "-qm", "fixture"],
      fixtureGitOptions,
    );
    const code = gateCodeIdentity(repo),
      tree = gateTreeHash(repo);
    assert.equal(gateCodeIdentity(repo, "HEAD"), code);
    recordGateChecks(repo, [
      {
        checkId: "npm test",
        codeIdentity: code,
        treeHash: tree,
        subject: tree,
        executed: true,
        exitCode: 0,
        durationMs: 1,
        evidenceRef: "fixture:executed",
        recordedAt: new Date().toISOString(),
      },
    ]);
    writeFileSync(join(repo, "docs/report.md"), "report after gate\n");
    writeFileSync(join(repo, "projection.js"), "generated two\n");
    writeFileSync(join(repo, "lib/README.md"), "readme after gate\n");
    assert.notEqual(gateTreeHash(repo), tree);
    assert.equal(gateCodeIdentity(repo), code);
    writeFileSync(join(repo, "lib/fixture.md"), "fixture two\n");
    assert.notEqual(gateCodeIdentity(repo), code, "a Markdown input counts");
    writeFileSync(join(repo, "lib/fixture.md"), "fixture one\n");
    assert.equal(gateCodeIdentity(repo), code);
    writeFileSync(join(repo, "lib/other/README.md"), "input readme two\n");
    assert.notEqual(gateCodeIdentity(repo), code, "an unmarked README counts");
    writeFileSync(join(repo, "lib/other/README.md"), "input readme one\n");
    assert.equal(gateCodeIdentity(repo), code);
    const module = new URL("./lib/gate-evidence.mjs", import.meta.url).href;
    const command = `import {gateCodeIdentity,findGateCheck} from ${JSON.stringify(module)}; const root=process.argv[1]; console.log(JSON.stringify({code:gateCodeIdentity(root),found:Boolean(findGateCheck(root,"npm test","different-tree"))}));`;
    const readback = JSON.parse(
      execFileSync(
        "bash",
        [
          "-c",
          'exec "$1" --input-type=module -e "$2" "$3"',
          "code-identity",
          process.execPath,
          command,
          repo,
        ],
        { encoding: "utf8" },
      ),
    );
    assert.deepEqual(readback, { code, found: true });
    writeFileSync(join(repo, "source.js"), "export const result = 2;\n");
    assert.notEqual(gateCodeIdentity(repo), code);
    assert.equal(findGateCheck(repo, "npm test", tree), undefined);
    writeFileSync(join(repo, "source.js"), "export const result = 1;\n");
    writeFileSync(
      join(repo, "package.json"),
      '{"private":true,"dependencies":{"fixture":"2.0.0"}}\n',
    );
    assert.notEqual(gateCodeIdentity(repo), code);
    execGit(["-C", repo, "add", "."], fixtureGitOptions);
    execGit(
      [
        "-C",
        repo,
        "-c",
        "maintenance.auto=false",
        "commit",
        "-qm",
        "dependency update",
      ],
      fixtureGitOptions,
    );
    assert.equal(gateCodeIdentity(repo, "HEAD"), gateCodeIdentity(repo));
  } finally {
    rmSync(repo, { recursive: true, force: true });
  }
});

// A fake marker and an owned denied directory stand in for a harness sandbox,
// so the preflight runs the same in and outside a real one (WO-140).
const confinementFixture = (t) => {
  // Under a gate the root carries the run's tag, which the gate's own
  // abandoned-root check judges (WO-157 item 15).
  const tag = process.env.DOTLN_GATE_FIXTURE_TAG;
  const repo = createFixtureRoot(
    join(
      tmpdir(),
      tag ? `dotln-host-confinement-${tag}-` : "dotln-host-confinement-",
    ),
  );
  const denied = join(repo, "denied");
  t.after(() => {
    chmodSync(denied, 0o755);
    rmSync(repo, { recursive: true, force: true });
  });
  const fixtureGitOptions = {
    exec: true,
    trim: false,

    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  };
  runGit(repo, ["init", "-q"], fixtureGitOptions);
  excludeFixtureOwnership(repo);
  // Every commit otherwise starts Git's detached automatic maintenance. Git
  // 2.55 estimates loose objects from objects/17 alone, so two there made a
  // fixture commit start a geometric repack still writing .git/objects/pack
  // when the teardown removed the tree (ENOTEMPTY; WO-063 D005, WO-157). The
  // fixture has no maintenance to exercise.
  runGit(repo, ["config", "maintenance.auto", "false"], fixtureGitOptions);
  runGit(repo, ["config", "user.name", "Fixture"], fixtureGitOptions);
  runGit(
    repo,
    ["config", "user.email", "fixture@example.invalid"],
    fixtureGitOptions,
  );
  writeFileSync(
    join(repo, ".gitignore"),
    "docs/control/local/\nobserved.jsonl\ndenied/\n",
  );
  mkdirSync(join(repo, "scripts"));
  mkdirSync(denied);
  for (const name of ["build", "alpha", "outside"])
    writeFileSync(
      join(repo, `scripts/${name}.mjs`),
      `import fs from "node:fs";\nfs.appendFileSync("observed.jsonl", ${JSON.stringify(`${name}\n`)});\n`,
    );
  runGit(repo, ["add", "."], fixtureGitOptions);
  runGit(
    repo,
    [
      "-c",
      "maintenance.auto=false",
      "commit",
      "-qm",
      "Host-confinement fixture",
    ],
    fixtureGitOptions,
  );
  const row = (name, options = {}) => ({
    name,
    command: [process.execPath, `scripts/${name}.mjs`],
    product: true,
    ...options,
  });
  return {
    repo,
    options: (mode) => {
      chmodSync(denied, mode);
      return {
        table: [
          row("build", { build: true }),
          row("alpha"),
          row("outside", { needs: OUTSIDE_CONFINEMENT }),
        ],
        sandbox: {
          env: { DOTLN_FIXTURE_SANDBOX: "1" },
          markers: [
            {
              id: "fixture-harness",
              env: "DOTLN_FIXTURE_SANDBOX",
              deniedDirectory: () => denied,
            },
          ],
        },
      };
    },
    observed: () =>
      existsSync(join(repo, "observed.jsonl"))
        ? readFileSync(join(repo, "observed.jsonl"), "utf8").trim().split("\n")
        : [],
    denied,
  };
};

test("WO-140 the real inventory declares only the suites with an environmental outside-only cause", () => {
  // Native skeleton/portfolio/vertical cases nest `sandbox-exec`, which an outer
  // Seatbelt sandbox refuses. Browser evidence owns a Chromium process and
  // loopback servers; the native discovery profile denies that network access.
  assert.deepEqual(
    suites.filter((row) => row.needs).map((row) => [row.name, row.needs]),
    [
      ["vertical", OUTSIDE_CONFINEMENT],
      ["skeleton", OUTSIDE_CONFINEMENT],
      ["browser-evidence", OUTSIDE_CONFINEMENT],
      ["skeleton-docs", OUTSIDE_CONFINEMENT],
      ["portfolio", OUTSIDE_CONFINEMENT],
    ],
  );
  // A defect in a release case, found in WO-121's verification, was never a
  // reason for the release suite to declare a need.
  assert.equal(suites.find((row) => row.name === "release").needs, undefined);
  assert.throws(
    () =>
      validateSuites([barrier, { name: "x", command: ["x"], needs: "gpu" }]),
    /Unknown suite need/,
  );
  assert.deepEqual(detectHostConfinement(root, { env: {} }), {
    marker: null,
    inForce: false,
  });
});

test("WO-140 a sandbox in force refuses before any suite runs and names the suites and the outside command", async (t) => {
  const fixture = confinementFixture(t);
  const inForce = fixture.options(0o555);
  await assert.rejects(
    runGate(["--serial"], fixture.repo, inForce),
    (error) => {
      assert.match(error.message, /^Refused before any suite ran/);
      assert.match(
        error.message,
        /carries the fixture-harness marker and a write to \S+denied is denied \(EACCES\), so it is confined by the host/,
      );
      assert.match(error.message, /outside needs the outside/);
      assert.match(
        error.message,
        /Run outside host confinement: npm test -- --serial\./,
      );
      assert.match(
        error.message,
        /evidence: npm test -- --serial --confined-partial$/,
      );
      return true;
    },
  );
  await assert.rejects(
    runGate(["--only", "outside"], fixture.repo, inForce),
    /Run outside host confinement: npm test -- --only outside\.$/,
  );
  await assert.rejects(
    runGate(["--only", "outside", "--confined-partial"], fixture.repo, inForce),
    /Nothing remains to run while confined: outside needs the outside/,
  );
  assert.deepEqual(fixture.observed(), [], "neither the build nor a suite ran");
  assert.deepEqual(
    readGateChecks(fixture.repo),
    [],
    "a refusal records no check",
  );
  assert.deepEqual(activeGateRuns(fixture.repo), []);
  // A selection that needs nothing from the outside runs as before.
  const only = await runGate(
    ["--only", "alpha", "--serial"],
    fixture.repo,
    inForce,
  );
  assert.equal(only.exitCode, 0);
  assert.equal(only.sandbox, undefined, "no probe is paid for that selection");
  assert.deepEqual(fixture.observed(), ["alpha"]);
});

test("WO-140 an inherited marker whose denied-write probe succeeds does not refuse and leaves no probe behind", async (t) => {
  const fixture = confinementFixture(t);
  const check = await runGate(
    ["--serial"],
    fixture.repo,
    fixture.options(0o755),
  );
  assert.equal(check.exitCode, 0);
  assert.equal(check.checkId, "npm test");
  assert.equal(check.partial, undefined);
  assert.deepEqual(check.requiredSuites, ["build", "alpha", "outside"]);
  assert.deepEqual(check.sandbox, {
    marker: "fixture-harness",
    probe: { path: fixture.denied, denied: false, code: "written" },
    inForce: false,
  });
  assert.deepEqual(readdirSync(fixture.denied), []);
  assert.deepEqual(fixture.observed(), ["build", "alpha", "outside"]);
  // No marker at all is today's behavior: no probe and no sandbox field.
  // The first run's row would be reused at this code identity (WO-173), so
  // the second run says --again to run the selection.
  const plain = await runGate(["--serial", "--again", ...WHY], fixture.repo, {
    ...fixture.options(0o555),
    sandbox: { env: {}, markers: fixture.options(0o555).sandbox.markers },
  });
  assert.equal(plain.checkId, "npm test");
  assert.equal(plain.sandbox, undefined);
});

test("WO-140 a confined partial row is rejected by every product-gate consumer at the code identity where a full row is accepted", async (t) => {
  const fixture = confinementFixture(t);
  const { repo } = fixture;
  const partial = await runGate(
    ["--confined-partial", "--serial"],
    repo,
    fixture.options(0o555),
  );
  assert.equal(partial.exitCode, 0);
  // CLI spelling changes, recorded identities and selections do not (WO-161).
  assert.equal(CONFINED_PARTIAL_CHECK, "npm test -- --inside-sandbox");
  assert.equal(OUTSIDE_CONFINEMENT, "outside-sandbox");
  assert.equal(partial.checkId, CONFINED_PARTIAL_CHECK);
  assert.equal(partial.partial, true);
  assert.deepEqual(partial.excludedSuites, ["outside"]);
  assert.deepEqual(partial.requiredSuites, ["build", "alpha"]);
  assert.equal(partial.sandbox.inForce, true);
  assert.equal(partial.evidenceRef.endsWith(CONFINED_PARTIAL_CHECK), true);
  assert.deepEqual(fixture.observed(), ["build", "alpha"]);
  const recorded = readGateChecks(repo);
  assert.deepEqual(
    recorded.map((row) => [row.checkId, row.excludedSuites]),
    [[CONFINED_PARTIAL_CHECK, ["outside"]]],
    "recorded under the distinct identity and never under npm test",
  );
  const code = gateCodeIdentity(repo);
  assert.equal(partial.codeIdentity, code);

  // Consumer 1: the gate lookup, also against a partial row mislabelled npm test.
  assert.equal(findGateCheck(repo, "npm test", gateTreeHash(repo)), undefined);
  const { partial: flag, ...mislabelled } = {
    ...recorded[0],
    checkId: "npm test",
  };
  assert.equal(flag, true);
  recordGateChecks(repo, [mislabelled]);
  assert.equal(
    findGateCheck(repo, "npm test", gateTreeHash(repo)),
    undefined,
    "the exclusions alone mark a partial result",
  );

  // Consumer 2: the lifecycle transition carries no product gate.
  const { requireLifecycleEvidence } =
    await import("./lib/lifecycle-evidence.mjs");
  const warn = console.warn;
  console.warn = () => {};
  t.after(() => (console.warn = warn));
  const refused = await requireLifecycleEvidence(
    repo,
    "final-review-result",
    "pass",
    "WO-999",
  );
  assert.equal(refused.productGate, undefined);
  assert.ok(
    refused.advisories.some((row) => /No passing product gate/.test(row)),
  );

  // Consumers 3 and 4: pull-request publication and release close both read
  // the committed reviewer observation through reviewedProductGate.
  const { reviewedProductGate } = await import("./lib/release-records.mjs");
  const fixtureGitOptions = {
    exec: true,
    trim: false,

    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  };
  mkdirSync(join(repo, "docs/control/orders"), { recursive: true });
  const review = (productGate) => {
    const base = { schemaVersion: 1, workOrderId: "WO-999" };
    writeFileSync(
      join(repo, "docs/control/orders/WO-999.jsonl"),
      [
        {
          ...base,
          recordedAt: "2026-09-20T00:00:01.000Z",
          type: "WorkOrderActivated",
          workOrderPath: "docs/work-orders/WO-999-fixture.md",
        },
        {
          ...base,
          recordedAt: "2026-09-20T00:00:02.000Z",
          type: "FinalReviewCompleted",
          verdict: "pass",
          finalReviewId: "FINAL-001",
          reportPath: "docs/final-reviews/WO-999/FINAL-001.md",
          evidence: { productGate },
        },
      ]
        .map(JSON.stringify)
        .join("\n") + "\n",
    );
    runGit(repo, ["add", "docs/control/orders"], fixtureGitOptions);
    runGit(
      repo,
      ["-c", "maintenance.auto=false", "commit", "-qm", "Reviewer observation"],
      fixtureGitOptions,
    );
  };
  for (const row of [
    recorded[0],
    mislabelled,
    { ...recorded[0], checkId: "npm test" },
  ]) {
    review(row);
    assert.throws(
      () => reviewedProductGate(repo, "WO-999"),
      /no recorded passing reviewer npm test row/,
    );
  }

  // The full gate at the same code identity is still accepted by all four.
  const full = await runGate(["--serial"], repo, fixture.options(0o755));
  assert.equal(full.exitCode, 0);
  assert.equal(full.checkId, "npm test");
  assert.equal(full.codeIdentity, code, "reports and control moved no code");
  assert.equal(
    findGateCheck(repo, "npm test", gateTreeHash(repo)).evidenceRef,
    full.evidenceRef,
  );
  const accepted = await requireLifecycleEvidence(
    repo,
    "final-review-result",
    "pass",
    "WO-999",
  );
  assert.equal(accepted.productGate.checkId, "npm test");
  assert.equal(accepted.productGate.codeIdentity, code);
  review(accepted.productGate);
  assert.equal(
    reviewedProductGate(repo, "WO-999").evidenceRef,
    full.evidenceRef,
  );

  // A review recorded without a gate (the transition only advises) is bound
  // to one by a later correction that carries the whole row, which both
  // publication consumers read from committed control history; a bound row
  // at another code identity is refused like any other (WO-115 D026).
  review(undefined);
  assert.throws(
    () => reviewedProductGate(repo, "WO-999"),
    /no recorded passing reviewer npm test row/,
  );
  const bind = (productGate, at) => {
    writeFileSync(
      join(repo, "docs/control/orders/WO-999.jsonl"),
      JSON.stringify({
        schemaVersion: 1,
        workOrderId: "WO-999",
        recordedAt: at,
        type: "RecordCorrected",
        subject: { ordinal: 2, type: "FinalReviewCompleted" },
        fields: { productGate: productGate.evidenceRef },
        previous: { productGate: "none" },
        reason: "bind the gate",
        evidence: { productGate },
        actor: {
          harness: "human",
          harnessVersion: "not-applicable",
          model: "human",
          effort: "unknown",
          source: "operator-attested",
        },
      }) + "\n",
      { flag: "a" },
    );
    runGit(repo, ["add", "docs/control/orders"], fixtureGitOptions);
    runGit(
      repo,
      [
        "-c",
        "maintenance.auto=false",
        "commit",
        "-qm",
        "Bind the reviewer gate",
      ],
      fixtureGitOptions,
    );
  };
  bind(accepted.productGate, "2026-09-20T00:00:03.000Z");
  assert.equal(
    reviewedProductGate(repo, "WO-999").evidenceRef,
    full.evidenceRef,
  );
  // Use a separate unbound review so its first correction reaches the
  // publication consumer's wrong-code-identity check.
  review(undefined);
  bind(
    {
      ...accepted.productGate,
      codeIdentity: "0".repeat(64),
      evidenceRef: "host-gate:elsewhere:npm test",
    },
    "2026-09-20T00:00:04.000Z",
  );
  assert.throws(
    () => reviewedProductGate(repo, "WO-999"),
    /reviewed code identity differs/,
  );
});

test("WO-140 the recognized markers probe the path their sandbox protects and fail open without one", (t) => {
  assert.deepEqual(
    confinementMarkers.map((row) => [row.id, row.env]),
    [
      ["claude-code", "CLAUDECODE"],
      ["codex-cli", "CODEX_SANDBOX"],
    ],
  );
  const repo = createFixtureRoot(join(tmpdir(), "dotln-confinement-markers-"));
  t.after(() => rmSync(repo, { recursive: true, force: true }));
  execGit(["init", "-q"], { cwd: repo });
  excludeFixtureOwnership(repo);
  const [claude, codex] = confinementMarkers;
  assert.equal(claude.deniedDirectory(repo), join(repo, ".claude/hooks"));
  assert.equal(
    realpathSync(codex.deniedDirectory(repo)),
    realpathSync(join(repo, ".git")),
  );
  // A fixture repository has no protected directory: the marker fails open.
  const missing = detectHostConfinement(repo, { env: { CLAUDECODE: "1" } });
  assert.equal(missing.marker, "claude-code");
  assert.equal(missing.inForce, false);
  assert.equal(missing.probe.code, "ENOENT");
  assert.deepEqual(probeDeniedWrite(null), {
    path: null,
    denied: false,
    code: "no-path",
  });
});

test("WO-140 the probe classifies only a denied write as a sandbox, and every other outcome fails open", (t) => {
  for (const code of ["EPERM", "EACCES", "EROFS"])
    assert.equal(deniedWriteCode(code), true, code);
  for (const code of ["ENOENT", "ENOTDIR", "EEXIST", "ENOSPC", undefined])
    assert.equal(deniedWriteCode(code), false, String(code));
  const directory = createFixtureRoot(
    join(tmpdir(), "dotln-confinement-probe-"),
  );
  t.after(() => {
    chmodSync(directory, 0o755);
    if (existsSync(join(directory, "denied")))
      chmodSync(join(directory, "denied"), 0o755);
    rmSync(directory, { recursive: true, force: true });
  });
  const failing = (code) => () => {
    throw Object.assign(new Error(code), { code });
  };
  // Seatbelt answers EPERM and a read-only bind mount EROFS; chmod gives EACCES.
  for (const code of ["EPERM", "EACCES", "EROFS"])
    assert.deepEqual(probeDeniedWrite(directory, { open: failing(code) }), {
      path: directory,
      denied: true,
      code,
    });
  assert.deepEqual(probeDeniedWrite(directory, { open: failing("ENOSPC") }), {
    path: directory,
    denied: false,
    code: "ENOSPC",
  });
  // A probe file the host will not let us remove is reported, never thrown.
  const unremovable = probeDeniedWrite(directory, {
    open: (path, flags, mode) => {
      const descriptor = openSync(path, flags, mode);
      chmodSync(directory, 0o555);
      return descriptor;
    },
  });
  assert.equal(unremovable.denied, false);
  assert.equal(unremovable.code, "written-unremoved");
  assert.ok(
    unremovable.left.startsWith(join(directory, ".dotln-confinement-probe-")),
  );
  chmodSync(directory, 0o755);
  rmSync(unremovable.left);

  // One harness can inherit another's marker: every present marker is probed.
  const open = join(directory, "open"),
    denied = join(directory, "denied");
  mkdirSync(open);
  mkdirSync(denied);
  chmodSync(denied, 0o555);
  const markers = [
    { id: "first", env: "FIRST", deniedDirectory: () => open },
    { id: "second", env: "SECOND", deniedDirectory: () => denied },
  ];
  const both = detectHostConfinement(directory, {
    env: { FIRST: "1", SECOND: "1" },
    markers,
  });
  assert.equal(both.marker, "second");
  assert.equal(both.inForce, true);
  assert.equal(both.probe.code, "EACCES");
  assert.equal(
    detectHostConfinement(directory, { env: { FIRST: "1" }, markers }).inForce,
    false,
  );
  assert.deepEqual(readdirSync(open), [], "no probe file is left behind");
  // Detection never throws: a probe that cannot even name its path fails open.
  assert.deepEqual(
    detectHostConfinement(directory, {
      env: { FIRST: "1" },
      markers: [
        {
          id: "first",
          env: "FIRST",
          deniedDirectory: () => {
            throw new Error("no path");
          },
        },
      ],
    }),
    {
      marker: null,
      inForce: false,
      probe: { path: null, denied: false, code: "probe-failed" },
    },
  );
});

test("WO-140 a real Seatbelt denial under the real marker reads EPERM and is in force", (t) => {
  const usable =
    process.platform === "darwin" &&
    spawnSync(
      "/usr/bin/sandbox-exec",
      ["-p", "(version 1)(allow default)", "/usr/bin/true"],
      { encoding: "utf8" },
    ).status === 0;
  // Inside a harness sandbox the nested profile is itself refused.
  if (!usable) return t.skip("sandbox-exec is unavailable or nested here");
  const repo = realpathSync(
    createFixtureRoot(join(tmpdir(), "dotln-seatbelt-")),
  );
  t.after(() => rmSync(repo, { recursive: true, force: true }));
  const hooks = join(repo, ".claude/hooks");
  mkdirSync(hooks, { recursive: true });
  const module = new URL("./lib/host-confinement.mjs", import.meta.url).href;
  const run = spawnSync(
    "/usr/bin/sandbox-exec",
    [
      "-p",
      `(version 1)(allow default)(deny file-write* (subpath ${JSON.stringify(hooks)}))`,
      process.execPath,
      "--input-type=module",
      "-e",
      `import {detectHostConfinement} from ${JSON.stringify(module)}; console.log(JSON.stringify(detectHostConfinement(process.argv[1], {env: {CLAUDECODE: "1"}})));`,
      repo,
    ],
    { encoding: "utf8" },
  );
  assert.equal(run.status, 0, run.stderr);
  assert.deepEqual(JSON.parse(run.stdout), {
    marker: "claude-code",
    probe: { path: hooks, denied: true, code: "EPERM" },
    inForce: true,
  });
  assert.deepEqual(readdirSync(hooks), []);
});

test("WO-140 any partial flag or exclusion shape disqualifies a row under the npm test identity", async (t) => {
  for (const shape of [
    { partial: true, excludedSuites: [] },
    { partial: true },
    { partial: "true" },
    { partial: 1 },
    { excludedSuites: ["skeleton"] },
    { excludedSuites: "skeleton" },
    { excludedSuites: {} },
  ])
    assert.equal(partialGateCheck(shape), true, JSON.stringify(shape));
  for (const shape of [{}, { partial: false }, { excludedSuites: [] }])
    assert.equal(partialGateCheck(shape), false, JSON.stringify(shape));
  const fixture = confinementFixture(t);
  const code = gateCodeIdentity(fixture.repo),
    tree = gateTreeHash(fixture.repo);
  const row = (extra) => ({
    checkId: "npm test",
    codeIdentity: code,
    treeHash: tree,
    subject: tree,
    executed: true,
    exitCode: 0,
    durationMs: 1,
    evidenceRef: "fixture:shape",
    recordedAt: new Date().toISOString(),
    ...extra,
  });
  // The runner emits this shape for `--confined-partial --only <suite>`.
  recordGateChecks(fixture.repo, [row({ partial: true, excludedSuites: [] })]);
  assert.equal(findGateCheck(fixture.repo, "npm test", tree), undefined);
  recordGateChecks(fixture.repo, [row({ evidenceRef: "fixture:complete" })]);
  assert.equal(
    findGateCheck(fixture.repo, "npm test", tree).evidenceRef,
    "fixture:complete",
  );
  // The inside listing names only what it would run.
  const lines = [];
  const log = console.log;
  console.log = (line) => lines.push(line);
  t.after(() => (console.log = log));
  await runGate(
    ["--list", "--confined-partial"],
    fixture.repo,
    fixture.options(0o755),
  );
  console.log = log;
  assert.deepEqual(
    lines.map((line) => line.split(" — ")[0]),
    ["build", "alpha"],
  );
});

// A fixture commit started Git's detached automatic maintenance, whose
// geometric repack could still be writing .git/objects/pack when the
// teardown removed the tree (ENOTEMPTY; WO-157 item 15, WO-063 D005).
test("WO-157 the host-confinement fixture's commits start no background Git maintenance that could race its teardown", (t) => {
  const { repo } = confinementFixture(t);
  const fixtureGitOptions = {
    exec: true,
    trim: false,
    stdio: ["pipe", "pipe", "pipe"],
  };
  const format = runGit(
    repo,
    ["rev-parse", "--show-object-format"],
    fixtureGitOptions,
  ).trim();
  // Git 2.55 estimates loose objects from objects/17 alone; two there make a
  // repository's automatic maintenance repack.
  let planted = 0;
  for (let index = 0; planted < 2; index++) {
    const text = `teardown probe ${index}\n`;
    const id = createHash(format)
      .update(`blob ${Buffer.byteLength(text)}\0${text}`)
      .digest("hex");
    if (!id.startsWith("17")) continue;
    runGit(repo, ["hash-object", "-w", "--stdin"], {
      ...fixtureGitOptions,
      ...{ input: text },
    });
    planted += 1;
  }
  const needed = spawnGit(["maintenance", "is-needed", "--auto"], {
    cwd: repo,
  });
  if (needed.status !== 129)
    assert.equal(
      needed.status,
      0,
      "two loose objects under objects/17 are a state automatic maintenance acts on",
    );
  const traces = createFixtureRoot(join(tmpdir(), "dotln-maintenance-trace-"));
  t.after(() => rmSync(traces, { recursive: true, force: true }));
  writeFileSync(join(repo, "teardown.txt"), "teardown probe\n");
  runGit(repo, ["add", "teardown.txt"], fixtureGitOptions);
  runGit(
    repo,
    ["-c", "maintenance.auto=false", "commit", "-qm", "Teardown probe"],
    {
      ...fixtureGitOptions,
      ...{
        env: { ...process.env, GIT_TRACE2_EVENT: join(traces, "commit.jsonl") },
      },
    },
  );
  const started = readFileSync(join(traces, "commit.jsonl"), "utf8")
    .trim()
    .split("\n")
    .map((line) => JSON.parse(line))
    .filter(
      (event) =>
        event.event === "child_start" && event.argv?.includes("maintenance"),
    )
    .map((event) => event.argv.join(" "));
  // A failing run waits for the detached child, so it reports this assertion
  // and not the teardown race it would otherwise cause.
  const lock = join(repo, ".git/objects/maintenance.lock");
  const until = Date.now() + 10_000;
  while (existsSync(lock) && Date.now() < until)
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 20);
  assert.deepEqual(
    started,
    [],
    "a fixture commit started background maintenance that writes .git/objects/pack",
  );
});

test("WO-157 a gate whose suites leave a host-confinement fixture root behind fails and names it, and another run's root does not fail it", async (t) => {
  const fixture = confinementFixture(t);
  const planted = [];
  t.after(() => {
    for (const path of planted) rmSync(path, { recursive: true, force: true });
  });
  // Another run's root in the shared temporary directory is never judged.
  const foreign = createFixtureRoot(
    join(tmpdir(), "dotln-host-confinement-foreign-"),
  );
  planted.push(foreign);
  writeFileSync(
    join(fixture.repo, "scripts/abandon.mjs"),
    'import fs from "node:fs";\nimport os from "node:os";\nimport path from "node:path";\nconst root = fs.mkdtempSync(path.join(os.tmpdir(), `dotln-host-confinement-${process.env.DOTLN_GATE_FIXTURE_TAG}-`));\nfs.appendFileSync("observed.jsonl", `abandoned ${root}\\n`);\n',
  );
  const options = fixture.options(0o755);
  const clean = await runGate(["--serial"], fixture.repo, options);
  assert.equal(clean.exitCode, 0, "another run's root is not this gate's");
  assert.equal(clean.abandonedRoots, undefined);
  const leaky = await runGate(["--serial"], fixture.repo, {
    ...options,
    table: [
      ...options.table,
      {
        name: "abandon",
        command: [process.execPath, "scripts/abandon.mjs"],
        product: true,
      },
    ],
  });
  const left = fixture
    .observed()
    .filter((line) => line.startsWith("abandoned "))
    .map((line) => line.slice("abandoned ".length));
  planted.push(...left);
  assert.equal(left.length, 1);
  assert.equal(
    leaky.exitCode,
    1,
    "a gate whose suites left a dotln-host-confinement root behind must fail",
  );
  assert.deepEqual(leaky.abandonedRoots, left);
  assert.ok(existsSync(foreign), "the check removes nothing");
});

test("WO-160 document failures rerun at the base, retain red status and record introduced/inherited labels", async (t) => {
  const repo = realpathSync(
    createFixtureRoot(join(tmpdir(), "dotln-document-label-")),
  );
  t.after(() => rmSync(repo, { recursive: true, force: true }));
  const fixtureGitOptions = { exec: true, trim: true, encoding: "utf8" };
  runGit(repo, ["init", "-q", "-b", "main"], fixtureGitOptions);
  excludeFixtureOwnership(repo);
  runGit(repo, ["config", "user.name", "Fixture"], fixtureGitOptions);
  runGit(
    repo,
    ["config", "user.email", "fixture@example.invalid"],
    fixtureGitOptions,
  );
  mkdirSync(join(repo, "scripts"));
  writeFileSync(join(repo, ".gitignore"), "docs/control/local/\n.runtime/\n");
  writeFileSync(join(repo, "scripts/inherited.mjs"), "process.exitCode = 1;\n");
  writeFileSync(
    join(repo, "scripts/introduced.mjs"),
    "process.exitCode = 0;\n",
  );
  runGit(repo, ["add", "."], fixtureGitOptions);
  runGit(
    repo,
    ["-c", "maintenance.auto=false", "commit", "-qm", "base checks"],
    fixtureGitOptions,
  );
  const base = runGit(repo, ["rev-parse", "HEAD"], fixtureGitOptions);
  writeFileSync(
    join(repo, "scripts/introduced.mjs"),
    "process.exitCode = 1;\n",
  );
  const table = ["inherited", "introduced"].map((name) => ({
    name,
    document: true,
    command: [process.execPath, `scripts/${name}.mjs`],
  }));
  const before = runGit(repo, ["diff"], fixtureGitOptions);
  for (const flags of [["--against", base], []]) {
    const result = await runGate(
      ["--document", "--keep-going", ...flags],
      repo,
      {
        table,
      },
    );
    assert.equal(result.exitCode, 1);
    assert.deepEqual(
      result.failureComparisons
        .map(({ name, classification }) => ({ name, classification }))
        .sort((a, b) => a.name.localeCompare(b.name)),
      [
        { name: "inherited", classification: "inherited" },
        { name: "introduced", classification: "introduced" },
      ],
    );
    assert.ok(result.failureComparisons.every((row) => row.base === base));
    assert.equal(runGit(repo, ["diff"], fixtureGitOptions), before);
    assert.equal(
      readGateChecks(repo, gateTreeHash(repo)).at(-1).checkId,
      "npm run test:docs",
    );
  }
  const unknown = await runGate(
    ["--document", "--against", "missing-base"],
    repo,
    { table },
  );
  assert.ok(
    unknown.failureComparisons.every((row) => row.classification === "unknown"),
  );
  const unavailable = await runGate(["--document", "--against", base], repo, {
    table: [
      {
        name: "unavailable",
        document: true,
        command: [join(repo, "nonexistent-program")],
      },
    ],
  });
  assert.equal(unavailable.failureComparisons[0].classification, "unknown");
  const missingGlob = await runGate(["--document", "--against", base], repo, {
    table: [
      {
        name: "missing-glob",
        document: true,
        command: [
          process.execPath,
          "--test",
          "packages/missing/dist/test/*.test.js",
        ],
      },
    ],
  });
  assert.equal(missingGlob.failureComparisons[0].classification, "unknown");
});

// Exercise actual child commands and durable rows across shell/session
// boundaries, rather than an in-memory scheduler double (WO-186).
function taskReuseFixture(t) {
  const repo = createFixtureRoot(join(tmpdir(), "dotln-task-reuse-"));
  t.after(() => rmSync(repo, { recursive: true, force: true }));
  for (const args of [
    ["init", "-q", "-b", "main"],
    ["config", "maintenance.auto", "false"],
    ["config", "user.name", "Fixture"],
    ["config", "user.email", "fixture@example.invalid"],
  ])
    runGit(repo, args);
  mkdirSync(join(repo, "scripts"));
  writeFileSync(
    join(repo, ".gitignore"),
    "docs/control/local/\n.runtime/\nobserved.jsonl\nfail-beta\n",
  );
  for (const name of ["build", "alpha", "beta", "machine"])
    writeFileSync(
      join(repo, `scripts/${name}.mjs`),
      `import fs from "node:fs"; fs.appendFileSync("observed.jsonl", ${JSON.stringify(name + "\n")});\n` +
        (name === "beta"
          ? 'if(fs.existsSync("fail-beta"))process.exit(1);\n'
          : ""),
    );
  runGit(repo, ["add", "."]);
  runGit(repo, [
    "-c",
    "maintenance.auto=false",
    "commit",
    "-qm",
    "task reuse fixture",
  ]);
  const table = [
    {
      name: "build",
      build: true,
      product: true,
      // This build publishes nothing a task consumes.
      outputs: [],
      command: [process.execPath, "scripts/build.mjs"],
    },
    ...["alpha", "beta"].map((name) => ({
      name,
      product: true,
      command: [process.execPath, `scripts/${name}.mjs`],
    })),
    {
      name: "machine",
      machinery: true,
      sources: ["scripts/machine.mjs"],
      command: [process.execPath, "scripts/machine.mjs"],
    },
  ];
  const observed = (directory = repo) =>
    existsSync(join(directory, "observed.jsonl"))
      ? readFileSync(join(directory, "observed.jsonl"), "utf8")
          .trim()
          .split("\n")
      : [];
  return { repo, table, observed };
}

function sharedRefsFixture(t) {
  const fixture = taskReuseFixture(t);
  const { repo } = fixture;
  writeFileSync(join(repo, "scripts/branch-value"), "base\n");
  writeFileSync(
    join(repo, "scripts/alpha.mjs"),
    'import fs from "node:fs"; if(fs.readFileSync("scripts/branch-value", "utf8") !== "base\\n") process.exit(1);\n',
  );
  runGit(repo, ["add", "."]);
  runGit(repo, [
    "-c",
    "maintenance.auto=false",
    "commit",
    "-qm",
    "branch-local gate input",
  ]);
  const origin = createFixtureRoot(join(tmpdir(), "dotln-shared-origin-"));
  const worktree = `${repo}-worktree`;
  t.after(() => {
    rmSync(worktree, { recursive: true, force: true });
    rmSync(origin, { recursive: true, force: true });
  });
  runGit(origin, ["init", "--bare", "-q"]);
  runGit(origin, ["config", "maintenance.auto", "false"]);
  runGit(repo, ["remote", "add", "origin", origin]);
  runGit(repo, ["push", "-q", "-u", "origin", "main"]);
  runGit(repo, ["worktree", "add", "-q", "-b", "wo-900", worktree]);
  const table = fixture.table.map((row) =>
    ["alpha", "beta"].includes(row.name)
      ? {
          ...row,
          document: true,
          ...(row.name === "alpha" ? { preflight: true } : {}),
        }
      : row,
  );
  const advance = () => {
    writeFileSync(join(repo, "scripts/branch-value"), "sibling\n");
    runGit(repo, [
      "-c",
      "maintenance.auto=false",
      "commit",
      "-qam",
      "sibling lands on main",
    ]);
    runGit(repo, ["tag", "-a", "v9000.0.1", "-m", "sibling release"]);
    runGit(repo, ["update-ref", "refs/dotln/checkpoint/WO-901/1", "HEAD"]);
    runGit(repo, ["push", "-q", "origin", "main", "refs/tags/v9000.0.1"]);
  };
  return { ...fixture, table, worktree, advance };
}

async function captureGate(args, repo, options) {
  const lines = [];
  const log = console.log;
  console.log = (...values) => {
    lines.push(values.join(" "));
  };
  try {
    return { row: await runGate(args, repo, options), lines };
  } finally {
    console.log = log;
  }
}

test("gate judges abandoned host-confinement roots after owned fixture cleanup", async (t) => {
  const { repo, table } = taskReuseFixture(t);
  const helper = pathToFileURL(
    join(root, "scripts/lib/temporary-roots.mjs"),
  ).href;
  writeFileSync(
    join(repo, "scripts/alpha.mjs"),
    `
      import { createFixtureRoot, removeTemporaryPath } from ${JSON.stringify(helper)};
      import { mkdirSync, writeFileSync } from "node:fs";
      import { tmpdir } from "node:os";
      import { join } from "node:path";
      const fixture = createFixtureRoot(join(tmpdir(), "dotln-host-confinement-" + process.env.DOTLN_GATE_FIXTURE_TAG + "-"));
      process.on("exit", () => removeTemporaryPath(fixture, { recursive: true, force: true }));
      mkdirSync(".runtime", { recursive: true });
      writeFileSync(".runtime/owned-confinement-root.json", JSON.stringify(fixture));
    `,
  );
  const { row } = await captureGate([], repo, { table });
  const fixture = JSON.parse(
    readFileSync(join(repo, ".runtime/owned-confinement-root.json"), "utf8"),
  );
  t.after(() => rmSync(fixture, { recursive: true, force: true }));
  assert.equal(existsSync(fixture), false);
  assert.ok(row.temporaryCleanup.removed.includes(fixture));
  assert.equal(row.exitCode, 0, row.output);
  assert.equal(row.abandonedRoots, undefined);
  const recorded = readGateChecks(repo).findLast(
    (item) => item.temporaryGateId === row.temporaryGateId,
  );
  assert.equal(recorded.exitCode, 0);
  assert.equal(recorded.abandonedRoots, undefined);
});

test("a passed suite's fixture roots leave as the suite ends and a failed suite's stay with their outcome", async (t) => {
  const { repo, table, observed } = taskReuseFixture(t);
  const helper = pathToFileURL(
    join(root, "scripts/lib/temporary-roots.mjs"),
  ).href;
  // Alpha plants two roots under its own suite and leaves them to the runner.
  writeFileSync(
    join(repo, "scripts/alpha.mjs"),
    `
      import { createFixtureRoot } from ${JSON.stringify(helper)};
      import { appendFileSync, mkdirSync, writeFileSync } from "node:fs";
      import { tmpdir } from "node:os";
      import { join } from "node:path";
      appendFileSync("observed.jsonl", "alpha\\n");
      const roots = [1, 2].map(() => createFixtureRoot(join(tmpdir(), "dotln-suite-end-passed-")));
      mkdirSync(".runtime", { recursive: true });
      writeFileSync(".runtime/passed-roots.json", JSON.stringify(roots));
    `,
  );
  // Beta, which fails, looks for alpha's roots as it starts, then plants one.
  writeFileSync(
    join(repo, "scripts/beta.mjs"),
    `
      import { createFixtureRoot } from ${JSON.stringify(helper)};
      import { appendFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
      import { tmpdir } from "node:os";
      import { join } from "node:path";
      appendFileSync("observed.jsonl", "beta\\n");
      const passed = existsSync(".runtime/passed-roots.json")
        ? JSON.parse(readFileSync(".runtime/passed-roots.json", "utf8"))
        : [];
      const failed = createFixtureRoot(join(tmpdir(), "dotln-suite-end-failed-"));
      mkdirSync(".runtime", { recursive: true });
      writeFileSync(".runtime/failed-root.json", JSON.stringify({ failed, seen: passed.map((path) => existsSync(path)) }));
      process.exit(1);
    `,
  );
  const { row } = await captureGate(["--serial", "--keep-going"], repo, {
    table,
  });
  const passed = JSON.parse(
    readFileSync(join(repo, ".runtime/passed-roots.json"), "utf8"),
  );
  const { failed, seen } = JSON.parse(
    readFileSync(join(repo, ".runtime/failed-root.json"), "utf8"),
  );
  t.after(() => {
    for (const path of [...passed, failed])
      rmSync(path, { recursive: true, force: true });
  });
  assert.equal(row.exitCode, 1);
  assert.deepEqual(
    observed().filter((name) => ["alpha", "beta"].includes(name)),
    ["alpha", "beta"],
  );
  // Alpha's roots were gone when beta started: the runner removed them as
  // alpha ended, not at the gate's end.
  assert.deepEqual(seen, [false, false]);
  for (const path of passed) assert.equal(existsSync(path), false, path);
  assert.ok(
    passed.every((path) => row.temporaryCleanup.removed.includes(path)),
  );
  // The failed suite's root stays for diagnosis, its outcome recorded.
  assert.equal(existsSync(failed), true);
  assert.equal(readTemporaryOwner(failed).outcome, "failed");
  assert.equal(readTemporaryOwner(failed).owner.suite, "beta");
  const timeline = (name) =>
    row.taskTimeline.find((entry) => entry.name === name);
  assert.equal(timeline("alpha").temporaryRootsRemoved, 2);
  assert.equal(timeline("beta").temporaryRootsRemoved, 0);
});

test("the macOS daemon sample requests an untruncated command and reads its resident bytes", () => {
  const firstColumn = "/System/Library/  18272\n";
  const lastColumn =
    " 18272 /System/Library/Frameworks/CoreServices.framework/Frameworks/FSEvents.framework/Support/fseventsd\n 4 fseventsd\n 999 fseventsd-helper\n";
  const sample = sampleFileEventDaemon({
    platform: "darwin",
    execFile: (file, args) => {
      assert.equal(file, "ps");
      const commandLast = args.join(" ") === "-A -o rss=,comm=";
      assert.ok(
        commandLast,
        "macOS truncates comm when it is not the last column",
      );
      return commandLast ? lastColumn : firstColumn;
    },
  });
  assert.equal(sample.residentBytes, (18272 + 4) * 1024);
  assert.equal(sample.unavailable, undefined);
  assert.match(sample.source, /rss=,comm=/);
  const truncated = sampleFileEventDaemon({
    platform: "darwin",
    execFile: () => firstColumn,
  });
  assert.equal(truncated.residentBytes, null);
  assert.match(
    truncated.unavailable,
    /not identified in the RSS-first process table/,
  );
  assert.equal(
    sampleFileEventDaemon({
      platform: "linux",
      execFile: () => assert.fail("not macOS"),
    }).source,
    "not-macos",
  );
  const unavailable = sampleFileEventDaemon({
    platform: "darwin",
    execFile: () => {
      throw new Error("process table denied");
    },
  });
  assert.equal(unavailable.residentBytes, null);
  assert.equal(unavailable.unavailable, "process table denied");
});

test("gate cleanup removes seed-derived clones and refuses a passing row with invalid nested ownership", async (t) => {
  const { repo, table } = taskReuseFixture(t);
  const helper = pathToFileURL(
    join(root, "scripts/lib/temporary-roots.mjs"),
  ).href;
  const gitHelper = pathToFileURL(join(root, "scripts/lib/git.mjs")).href;
  writeFileSync(
    join(repo, "scripts/alpha.mjs"),
    `
    import { createFixtureRoot } from ${JSON.stringify(helper)};
    import { runGit } from ${JSON.stringify(gitHelper)};
    import { mkdirSync, writeFileSync } from "node:fs";
    import { tmpdir } from "node:os";
    import { join } from "node:path";
    const parent = createFixtureRoot(join(tmpdir(), "dotln-seed-derived-"));
    const seed = createFixtureRoot(join(parent, "seed-"));
    writeFileSync(join(seed, ".gitignore"), ".dotln-owner.json\\n");
    writeFileSync(join(seed, "payload"), "source material");
    const git = (...args) => runGit(seed, args);
    git("init", "-q"); git("add", ".");
    git("-c", "user.name=Fixture", "-c", "user.email=fixture@example.invalid", "-c", "commit.gpgsign=false", "commit", "-qm", "fixture seed");
    runGit(parent, ["clone", "-q", seed, join(parent, "clone")]);
    mkdirSync(".runtime", {recursive: true});
    writeFileSync(".runtime/seed-parent.json", JSON.stringify(parent));
  `,
  );
  let { row } = await captureGate([], repo, { table });
  const parent = JSON.parse(
    readFileSync(join(repo, ".runtime/seed-parent.json"), "utf8"),
  );
  t.after(() => rmSync(parent, { recursive: true, force: true }));
  assert.equal(row.exitCode, 0, row.output);
  assert.equal(existsSync(parent), false);
  const passingScript = readFileSync(join(repo, "scripts/alpha.mjs"), "utf8");
  writeFileSync(
    join(repo, "scripts/alpha.mjs"),
    passingScript +
      `
    const invalid = join(parent, "clone", ".dotln-owner.json");
    writeFileSync(invalid, "unattributable metadata");
  `,
  );
  ({ row } = await captureGate([], repo, { table }));
  const retained = JSON.parse(
    readFileSync(join(repo, ".runtime/seed-parent.json"), "utf8"),
  );
  t.after(() => rmSync(retained, { recursive: true, force: true }));
  assert.equal(row.exitCode, 1);
  assert.ok(existsSync(retained));
  assert.ok(
    row.temporaryCleanup.blockers.some(
      (item) => item.path === join(retained, "clone"),
    ),
  );
});

test("a passing gate accounts for top-level captures and preserves a live worker", async (t) => {
  const { repo, table } = taskReuseFixture(t);
  const helper = pathToFileURL(
    join(root, "scripts/lib/temporary-roots.mjs"),
  ).href;
  writeFileSync(
    join(repo, "scripts/alpha.mjs"),
    `
      import { createTemporaryRoot } from ${JSON.stringify(helper)};
      import { mkdirSync, writeFileSync } from "node:fs";
      import { tmpdir } from "node:os";
      import { join } from "node:path";
      const dead = createTemporaryRoot(join(tmpdir(), "dotln-gate-dead-capture-"), { class: "worker-capture" });
      const live = createTemporaryRoot(join(tmpdir(), "dotln-gate-live-capture-"), { class: "worker-capture", owner: { pid: ${process.pid} } });
      mkdirSync(".runtime", { recursive: true });
      writeFileSync(".runtime/captures.json", JSON.stringify({ dead, live }));
    `,
  );
  const { row } = await captureGate([], repo, { table });
  const paths = JSON.parse(
    readFileSync(join(repo, ".runtime/captures.json"), "utf8"),
  );
  t.after(() => {
    for (const path of Object.values(paths))
      rmSync(path, { recursive: true, force: true });
  });
  assert.equal(row.exitCode, 0, row.output);
  assert.equal(existsSync(paths.dead), false);
  assert.equal(existsSync(paths.live), true);
  assert.ok(row.temporaryCleanup.removed.includes(paths.dead));
  assert.ok(
    row.temporaryCleanup.retained.some(
      (item) => item.path === paths.live && /live/.test(item.reason),
    ),
  );
  assert.deepEqual(row.temporaryCleanup.blockers, []);
  const recorded = readGateChecks(repo).findLast(
    (item) => item.temporaryGateId === row.temporaryGateId,
  );
  assert.deepEqual(recorded.temporaryCleanup, row.temporaryCleanup);
});

test("nested suites in copied repositories retain the outer gate's ledger and outcome", async (t) => {
  const { repo, table } = taskReuseFixture(t);
  const copy = join(repo, "nested-repository");
  copyFixtureFiles(
    root,
    copy,
    "scripts/test-runner.test.fixture-inputs.json",
    "nested temporary helper",
  );
  assert.equal(existsSync(join(copy, "scripts/lib/host-resources.mjs")), false);
  const report = join(repo, ".runtime/nested-roots.json");
  const helperFile = join(copy, "scripts/nested-helper.mjs");
  writeFileSync(
    helperFile,
    `
    import { createTemporaryRoot, readTemporaryOwner, removeTemporaryPath } from "./lib/temporary-roots.mjs";
    import { existsSync, mkdirSync, writeFileSync } from "node:fs";
    import { dirname } from "node:path";
    const paths = ["teardown", "interrupted"].map((name) =>
      createTemporaryRoot("dotln-nested-" + name + "-", { class: "gate-fixture" }));
    removeTemporaryPath(paths[0], { recursive: true, force: true });
    mkdirSync(dirname(${JSON.stringify(report)}), { recursive: true });
    writeFileSync(${JSON.stringify(report)}, JSON.stringify(paths.map((path) => ({
      path, existsAfterTeardown: existsSync(path), record: readTemporaryOwner(path)
    }))));
  `,
  );
  const runner = pathToFileURL(join(root, "scripts/test-runner.mjs")).href;
  const script = `
    import { executeSuite } from ${JSON.stringify(runner)};
    const result = await executeSuite({
      name: "nested-leaf", command: [process.execPath, "scripts/nested-helper.mjs"]
    }, ${JSON.stringify(copy)}, 30000);
    if (result.exitCode !== 0) throw new Error(result.output);
  `;
  for (const failed of [false, true]) {
    writeFileSync(
      join(repo, "scripts/alpha.mjs"),
      script + (failed ? "process.exitCode = 1;\n" : ""),
    );
    const { row } = await captureGate([], repo, { table });
    assert.equal(row.exitCode, failed ? 1 : 0, row.output);
    const roots = JSON.parse(readFileSync(report, "utf8"));
    for (const { path, existsAfterTeardown, record } of roots) {
      t.after(() => rmSync(path, { recursive: true, force: true }));
      assert.equal(existsAfterTeardown, true);
      assert.equal(record.owner.repository, realpathSync(repo));
      assert.equal(record.owner.gateId, row.temporaryGateId);
      assert.equal(record.owner.suite, "alpha");
      assert.equal(
        record.owner.birth,
        null,
        "the copied helper has no process-table module",
      );
      assert.equal(existsSync(path), failed);
      if (failed) {
        assert.ok(
          row.temporaryCleanup.retained.some(
            (item) => item.path === path && /diagnosis/.test(item.reason),
          ),
        );
        const ended = JSON.parse(
          readFileSync(join(path, ".dotln-owner.json"), "utf8"),
        );
        assert.equal(ended.outcome, "failed");
        assert.equal(ended.retentionHours, 24);
      } else assert.ok(row.temporaryCleanup.removed.includes(path));
    }
    assert.deepEqual(row.temporaryCleanup.blockers, []);
    assert.deepEqual(
      readGateChecks(repo).findLast(
        (item) => item.temporaryGateId === row.temporaryGateId,
      ).temporaryCleanup,
      row.temporaryCleanup,
    );
    assert.equal(
      existsSync(join(copy, ".runtime/temporary-roots/roots")),
      false,
    );
  }
});

test("gate completion removes passing fixtures, retains failed fixtures and records churn", async (t) => {
  const { repo, table } = taskReuseFixture(t);
  const helper = pathToFileURL(
    join(root, "scripts/lib/temporary-roots.mjs"),
  ).href;
  for (const name of ["alpha", "beta"])
    writeFileSync(
      join(repo, `scripts/${name}.mjs`),
      `
      import { createTemporaryRoot, removeTemporaryPath } from ${JSON.stringify(helper)};
      import test from "node:test";
      import assert from "node:assert/strict";
      import { mkdirSync, writeFileSync } from "node:fs";
      import { tmpdir } from "node:os";
      import { join } from "node:path";
      const container = createTemporaryRoot(join(tmpdir(), "dotln-gate-cleanup-${name}-"), { class: "gate-fixture", repository: process.cwd() });
      process.on("exit", () => removeTemporaryPath(container, { recursive: true, force: true }));
      test("ordinary teardown", (t) => {
        const fixture = createTemporaryRoot(join(container, "fixture-"), { class: "gate-fixture", repository: process.cwd() });
        t.after(() => removeTemporaryPath(fixture, { recursive: true, force: true }));
        writeFileSync(join(fixture, "payload"), "fixture payload");
        mkdirSync(".runtime/observed-roots", { recursive: true });
        writeFileSync(".runtime/observed-roots/${name}.json", JSON.stringify({ fixture, container }));
        ${name === "beta" ? 'assert.fail("diagnosis fixture");' : "assert.ok(true);"}
      });
    `,
    );
  const { row } = await captureGate([], repo, { table });
  const paths = Object.fromEntries(
    ["alpha", "beta"].map((name) => [
      name,
      JSON.parse(
        readFileSync(
          join(repo, `.runtime/observed-roots/${name}.json`),
          "utf8",
        ),
      ).fixture,
    ]),
  );
  t.after(() => rmSync(paths.beta, { recursive: true, force: true }));
  assert.equal(row.exitCode, 1);
  assert.equal(existsSync(paths.alpha), false);
  assert.equal(existsSync(paths.beta), true);
  const failedContainer = JSON.parse(
    readFileSync(join(repo, ".runtime/observed-roots/beta.json"), "utf8"),
  ).container;
  assert.ok(
    existsSync(failedContainer),
    "exit teardown also preserves the failing suite's container",
  );
  t.after(() => rmSync(failedContainer, { recursive: true, force: true }));
  const owner = JSON.parse(
    readFileSync(join(paths.beta, ".dotln-owner.json"), "utf8"),
  );
  assert.equal(owner.outcome, "failed");
  assert.equal(owner.retentionHours, 24);
  assert.equal(owner.owner.gateId, row.temporaryGateId);
  assert.ok(row.temporaryCleanup.removed.includes(paths.alpha));
  assert.ok(
    row.temporaryCleanup.retained.some((item) => item.path === paths.beta),
  );
  assert.ok(row.filesCreated > 0);
  assert.ok(row.filesDeleted > 0);
  assert.ok(row.bytesWritten > 0);
  assert.equal(row.filesCreated, row.churn.filesCreated);
  for (const sample of [row.fileEvents.before, row.fileEvents.after])
    assert.ok(sample.residentBytes === null || sample.residentBytes >= 0);
  const recorded = readGateChecks(repo).findLast(
    (item) => item.temporaryGateId === row.temporaryGateId,
  );
  assert.deepEqual(recorded.temporaryCleanup, row.temporaryCleanup);
});

test("WO-198 shared-ref comparisons name absence transitions and isolate unreadable fields", (t) => {
  const before = {
    originMain: "absent",
    main: "absent",
    tags: { count: 0, newest: "absent" },
    dotlnRefs: 0,
  };
  const after = {
    originMain: "origin-commit",
    main: "main-commit",
    tags: { count: 1, newest: "v1.0.0" },
    dotlnRefs: 1,
  };
  const expected = [
    "origin/main absent..origin-commit",
    "main absent..main-commit",
    "tags +v1.0.0 (count 0..1, newest absent..v1.0.0)",
    "refs/dotln/ 0..1",
  ];
  assert.deepEqual(sharedRefChanges(before, after), expected);
  assert.deepEqual(sharedRefChanges(after, before), [
    "origin/main origin-commit..absent",
    "main main-commit..absent",
    "tags (count 1..0, newest v1.0.0..absent)",
    "refs/dotln/ 1..0",
  ]);
  assert.deepEqual(sharedRefChanges(after, after), []);
  const fields = ["originMain", "main", "tags", "dotlnRefs"];
  for (const [index, field] of fields.entries()) {
    for (const side of ["before", "after"]) {
      const left = structuredClone(before);
      const right = structuredClone(after);
      const snapshot = side === "before" ? left : right;
      snapshot[field] =
        field === "tags"
          ? { count: "unreadable", newest: "unreadable" }
          : "unreadable";
      assert.equal(completeSharedRefs(snapshot), true, `${field} ${side}`);
      assert.deepEqual(
        sharedRefChanges(left, right),
        expected.filter((_, expectedIndex) => expectedIndex !== index),
        `${field} ${side} withholds only its own comparison`,
      );
    }
  }
  const unreadable = {
    originMain: "unreadable",
    main: "unreadable",
    tags: { count: "unreadable", newest: "unreadable" },
    dotlnRefs: "unreadable",
  };
  assert.equal(completeSharedRefs(unreadable), true);
  assert.deepEqual(sharedRefChanges(before, unreadable), []);
  assert.deepEqual(sharedRefChanges(unreadable, after), []);
  assert.deepEqual(sharedRefChanges(unreadable, unreadable), []);
  for (const malformed of [
    undefined,
    {},
    { ...before, tags: null },
    { ...before, tags: { count: "absent", newest: "absent" } },
  ]) {
    assert.deepEqual(sharedRefChanges(malformed, after), []);
    assert.deepEqual(sharedRefChanges(before, malformed), []);
  }
  t.diagnostic(
    "PROOF WO-198 comparison: absent creation/removal, both interval directions, each unreadable field on either side, all-unreadable and malformed baselines",
  );
});

test("WO-198 origin/main created between failed linked-worktree gates is named exactly once", async (t) => {
  const { repo, worktree, table } = sharedRefsFixture(t);
  runGit(repo, ["update-ref", "-d", "refs/remotes/origin/main"]);
  writeFileSync(join(worktree, "fail-beta"), "fail\n");
  const options = {
    table: table.filter((row) => ["build", "beta"].includes(row.name)),
  };
  const first = await captureGate(["--serial", "--again"], worktree, options);
  assert.equal(first.row.exitCode, 1);
  assert.equal(first.row.sharedRefs.end.originMain, "absent");
  const retained = readGateChecks(worktree).find(
    (row) => row.recordedAt === first.row.recordedAt,
  );
  assert.equal(
    typeof retained.outputRef,
    "string",
    "failed complete run retains a log reference",
  );
  assert.match(
    readFileSync(join(worktree, retained.outputRef), "utf8"),
    /beta: failed/,
  );
  assert.ok(
    first.lines.every((line) => !line.startsWith("shared refs moved:")),
  );
  const commit = runGit(repo, ["rev-parse", "HEAD"]);
  runGit(repo, ["update-ref", "refs/remotes/origin/main", commit]);
  // A host wrapper can record the same check without the runner's snapshots.
  // That observation must not erase the previous comparable baseline.
  recordGateChecks(worktree, [
    {
      checkId: first.row.checkId,
      codeIdentity: first.row.codeIdentity,
      treeHash: first.row.treeHash,
      subject: first.row.subject,
      durationMs: 1,
      executed: true,
      exitCode: 1,
      evidenceRef: "fixture:host-wrapper-without-refs",
      recordedAt: new Date().toISOString(),
    },
  ]);
  const second = await captureGate(["--serial", "--again"], worktree, options);
  assert.equal(second.row.exitCode, 1);
  assert.equal(second.row.sharedRefs.start.originMain, commit);
  const lines = second.lines.filter((line) =>
    line.startsWith("shared refs moved:"),
  );
  assert.deepEqual(lines, [
    `shared refs moved: since previous: origin/main absent..${commit}`,
  ]);
  const stored = JSON.parse(
    readFileSync(
      join(worktree, "docs/control/local/harness/checks.json"),
      "utf8",
    ),
  );
  assert.equal(stored.length, 3);
  assert.ok(stored.every((row) => row.exitCode === 1));
  assert.deepEqual(stored.at(-1).sharedRefs, second.row.sharedRefs);
  assert.equal(
    second.lines.filter((line) => /^npm test: \d+ passed;/u.test(line)).length,
    1,
  );
  t.diagnostic("PROOF WO-198 branch creation " + lines[0]);
});

test("WO-198 shared refs tolerate absent branches and count only annotated v tags", (t) => {
  const repo = createFixtureRoot(join(tmpdir(), "dotln-shared-absent-"));
  t.after(() => rmSync(repo, { recursive: true, force: true }));
  runGit(repo, ["init", "-q", "-b", "topic"]);
  excludeFixtureOwnership(repo);
  assert.deepEqual(readSharedRefs(repo), {
    originMain: "absent",
    main: "absent",
    tags: { count: 0, newest: "absent" },
    dotlnRefs: 0,
  });
  const fixture = taskReuseFixture(t);
  runGit(fixture.repo, ["tag", "v-lightweight"]);
  runGit(fixture.repo, ["tag", "-a", "unrelated", "-m", "not a v tag"]);
  assert.deepEqual(readSharedRefs(fixture.repo).tags, {
    count: 0,
    newest: "absent",
  });
  for (const [name, date] of [
    ["v9000.0.2", "2020-01-01T00:00:00Z"],
    ["v9000.0.1", "2020-01-02T00:00:00Z"],
  ])
    runGit(fixture.repo, ["tag", "-a", name, "-m", "dated tag"], {
      env: { ...process.env, GIT_COMMITTER_DATE: date },
    });
  assert.deepEqual(readSharedRefs(fixture.repo).tags, {
    count: 2,
    newest: "v9000.0.1",
  });
});

test("WO-198 branch reads distinguish clean unresolved refs from unavailable reads", (t) => {
  const { repo } = taskReuseFixture(t);
  const ref = "refs/remotes/origin/main";
  const quiet = ["rev-parse", "--verify", "--quiet", `${ref}^{commit}`];
  assert.equal(spawnGit(quiet, { cwd: repo }).status, 1);
  assert.equal(readSharedRefs(repo).originMain, "absent");
  runGit(repo, ["update-ref", ref, "HEAD"]);
  assert.equal(
    readSharedRefs(repo).originMain,
    runGit(repo, ["rev-parse", "HEAD"]),
  );
  runGit(repo, ["update-ref", ref, runGit(repo, ["rev-parse", "HEAD^{tree}"])]);
  assert.equal(spawnGit(quiet, { cwd: repo }).status, 1);
  assert.equal(readSharedRefs(repo).originMain, "absent");
  writeFileSync(join(repo, ".git", ref), `${"1".repeat(40)}\n`);
  assert.equal(spawnGit(quiet, { cwd: repo }).status, 1);
  assert.equal(readSharedRefs(repo).originMain, "absent");
  runGit(repo, ["update-ref", "-d", ref]);
  assert.equal(readSharedRefs(repo).originMain, "absent");
  // A missing working directory prevents Git from launching, unlike a
  // completed read that simply cannot resolve the requested branch.
  const unavailable = readSharedRefs(join(repo, "missing-checkout"));
  assert.deepEqual(unavailable, {
    originMain: "unreadable",
    main: "unreadable",
    tags: { count: "unreadable", newest: "unreadable" },
    dotlnRefs: "unreadable",
  });
  assert.deepEqual(sharedRefChanges(readSharedRefs(repo), unavailable), []);
  t.diagnostic(
    "PROOF WO-198 Git reads: missing, removed, dangling and non-commit refs resolve absent; a launch failure records every field unreadable without throwing",
  );
});

test("WO-198 failed shared-ref enumerations retain unknown fields instead of partial counts", (t) => {
  const { repo } = taskReuseFixture(t);
  runGit(repo, ["tag", "-a", "v1.0.0", "-m", "readable tag"]);
  runGit(repo, ["update-ref", "refs/remotes/origin/main", "HEAD"]);
  runGit(repo, ["update-ref", "refs/dotln/fixture", "HEAD"]);
  const healthy = readSharedRefs(repo);
  assert.equal(healthy.tags.count, 1);
  assert.equal(healthy.dotlnRefs, 1);
  const tagFile = join(repo, ".git/refs/tags/v9.9.9");
  writeFileSync(tagFile, `${"1".repeat(40)}\n`);
  assert.notEqual(
    spawnGit(["for-each-ref", "--format=%(objecttype)", "refs/tags/v*"], {
      cwd: repo,
    }).status,
    0,
  );
  assert.deepEqual(readSharedRefs(repo), {
    ...healthy,
    tags: { count: "unreadable", newest: "unreadable" },
  });
  rmSync(tagFile);
  assert.deepEqual(readSharedRefs(repo), healthy);
  runGit(repo, ["pack-refs", "--all"]);
  const packed = join(repo, ".git/packed-refs");
  writeFileSync(packed, readFileSync(packed, "utf8") + "garbage line\n");
  for (const args of [
    ["rev-parse", "--verify", "refs/remotes/origin/main^{commit}"],
    ["rev-parse", "--verify", "refs/heads/main^{commit}"],
    ["for-each-ref", "--format=%(objecttype)", "refs/tags/v*"],
    ["for-each-ref", "--format=%(refname)", "refs/dotln/"],
  ])
    assert.notEqual(spawnGit(args, { cwd: repo }).status, 0);
  const degraded = readSharedRefs(repo);
  assert.deepEqual(degraded, {
    originMain: "unreadable",
    main: "unreadable",
    tags: { count: "unreadable", newest: "unreadable" },
    dotlnRefs: "unreadable",
  });
  assert.equal(completeSharedRefs(degraded), true);
  assert.deepEqual(sharedRefChanges(healthy, degraded), []);
  assert.deepEqual(sharedRefChanges(degraded, healthy), []);
  t.diagnostic(
    "PROOF WO-198 unreadable enumerations: dangling tag degrades only tags; recovery restores counts; damaged packed-refs degrades all four reads without throwing",
  );
});

test("WO-198 unreadable shared tags before and during a passing linked-worktree gate preserve its row and summary", async (t) => {
  for (const during of [false, true]) {
    const { repo, worktree, table, observed } = sharedRefsFixture(t);
    const healthy = readSharedRefs(worktree);
    const breakTag = () => {
      mkdirSync(join(repo, ".git/refs/tags"), { recursive: true });
      writeFileSync(join(repo, ".git/refs/tags/v9.9.9"), `${"1".repeat(40)}\n`);
    };
    if (!during) breakTag();
    let damaged = !during;
    const passed = await captureGate(
      during ? ["--serial", "--again"] : ["--document", "--serial"],
      worktree,
      {
        table,
        stopRequested: () => {
          if (!damaged && observed(worktree).includes("build")) {
            damaged = true;
            breakTag();
          }
          return false;
        },
      },
    );
    assert.ok(damaged);
    assert.equal(passed.row.exitCode, 0);
    const degraded = {
      ...healthy,
      tags: { count: "unreadable", newest: "unreadable" },
    };
    assert.deepEqual(passed.row.sharedRefs, {
      start: during ? healthy : degraded,
      end: degraded,
    });
    const stored = JSON.parse(
      readFileSync(
        join(worktree, "docs/control/local/harness/checks.json"),
        "utf8",
      ),
    );
    assert.equal(stored.length, 1);
    assert.equal(stored[0].exitCode, 0);
    assert.deepEqual(stored[0].sharedRefs, passed.row.sharedRefs);
    assert.equal(
      passed.lines.filter((line) => line.startsWith(`${passed.row.checkId}: `))
        .length,
      1,
    );
    assert.ok(
      passed.lines.every((line) => !line.startsWith("shared refs moved:")),
    );
    t.diagnostic(
      `PROOF WO-198 unreadable tag ${during ? "during plain" : "before document"} gate: exit 0, one durable row, four-field snapshots, one summary, no delta`,
    );
  }
});

test("WO-198 unreadable enumerations and unresolved branches preserve a failed gate and its observed movement", async (t) => {
  for (const during of [false, true]) {
    const { repo, worktree, table, observed } = sharedRefsFixture(t);
    const healthy = readSharedRefs(worktree);
    if (!during) {
      mkdirSync(join(repo, ".git/refs/tags"), { recursive: true });
      writeFileSync(join(repo, ".git/refs/tags/v9.9.9"), `${"1".repeat(40)}\n`);
    }
    writeFileSync(join(worktree, "fail-beta"), "fail\n");
    let damaged = !during;
    const failed = await captureGate(["--serial", "--again"], worktree, {
      table,
      stopRequested: () => {
        if (!damaged && observed(worktree).includes("build")) {
          damaged = true;
          writeFileSync(
            join(repo, ".git/refs/remotes/origin/main"),
            `${"1".repeat(40)}\n`,
          );
        }
        return false;
      },
    });
    assert.ok(damaged);
    assert.equal(failed.row.exitCode, 1);
    const degraded = during
      ? { ...healthy, originMain: "absent" }
      : { ...healthy, tags: { count: "unreadable", newest: "unreadable" } };
    assert.deepEqual(failed.row.sharedRefs, {
      start: during ? healthy : degraded,
      end: degraded,
    });
    const stored = JSON.parse(
      readFileSync(
        join(worktree, "docs/control/local/harness/checks.json"),
        "utf8",
      ),
    );
    assert.equal(stored.length, 1);
    assert.equal(stored[0].exitCode, 1);
    assert.deepEqual(stored[0].sharedRefs, failed.row.sharedRefs);
    assert.equal(
      failed.lines.filter((line) => /^npm test: \d+ passed;/u.test(line))
        .length,
      1,
    );
    assert.deepEqual(
      failed.lines.filter((line) => line.startsWith("shared refs moved:")),
      during
        ? [
            `shared refs moved: during run: origin/main ${healthy.originMain}..absent`,
          ]
        : [],
    );
    t.diagnostic(
      `PROOF WO-198 failed ${during ? "unresolved branch during" : "tag read before"} gate: exit 1, one durable failed row, four-field snapshots, one summary, ${during ? "clean unresolved commit named absent" : "no fabricated delta"}`,
    );
  }
});

test("WO-198 a sibling merge and tag during a worktree's gates change no result and are named on the row", async (t) => {
  const { repo, worktree, table, advance } = sharedRefsFixture(t);
  const selections = [["--document", "--serial"], ["--serial"]];
  const first = [];
  for (const args of selections)
    first.push(await captureGate(args, worktree, { table }));
  advance();
  assert.equal(
    readFileSync(join(repo, "scripts/branch-value"), "utf8"),
    "sibling\n",
  );
  for (const [index, args] of selections.entries()) {
    // Force execution to prove the tasks still pass, beyond merely carrying
    // their old passes; the plain composed run is checked separately below.
    const second = await captureGate([...args, "--again", ...WHY], worktree, {
      table,
    });
    const before = first[index].row;
    assert.equal(before.exitCode, 0);
    assert.equal(second.row.exitCode, 0);
    assert.equal(second.row.codeIdentity, before.codeIdentity);
    assert.deepEqual(
      second.row.cases.map(({ name, exitCode }) => ({ name, exitCode })),
      before.cases.map(({ name, exitCode }) => ({ name, exitCode })),
    );
    for (const row of [before, second.row]) {
      assert.deepEqual(Object.keys(row.sharedRefs.start).sort(), [
        "dotlnRefs",
        "main",
        "originMain",
        "tags",
      ]);
      assert.deepEqual(row.sharedRefs.start, row.sharedRefs.end);
      assert.deepEqual(
        readGateChecks(worktree).find(
          (stored) => stored.recordedAt === row.recordedAt,
        ).sharedRefs,
        row.sharedRefs,
      );
    }
    assert.equal(
      second.row.sharedRefs.start.tags.count,
      before.sharedRefs.start.tags.count + 1,
    );
    assert.notEqual(
      second.row.sharedRefs.start.originMain,
      before.sharedRefs.start.originMain,
    );
    assert.equal(
      second.row.sharedRefs.start.main,
      second.row.sharedRefs.start.originMain,
    );
    assert.equal(
      second.row.sharedRefs.start.dotlnRefs,
      before.sharedRefs.start.dotlnRefs + 1,
    );
    assert.ok(
      [...first[index].lines, ...second.lines].every(
        (line) => !line.startsWith("shared refs moved:"),
      ),
    );
    t.diagnostic(
      "PROOF WO-198 sibling " +
        JSON.stringify({
          checkId: before.checkId,
          before: before.sharedRefs,
          after: second.row.sharedRefs,
          tasks: second.row.cases.map(({ name, exitCode }) => ({
            name,
            exitCode,
          })),
          deltaLines: 0,
        }),
    );
  }
  const composed = await captureGate(["--serial"], worktree, { table });
  assert.equal(composed.row.exitCode, 0);
  assert.equal(composed.row.executionMode, "composed");
  assert.deepEqual(composed.row.sharedRefs.start, readSharedRefs(worktree));
  assert.ok(
    composed.lines.every((line) => !line.startsWith("shared refs moved:")),
  );
});

test("WO-198 a failed row names movement since its own check's previous row exactly once", async (t) => {
  const { worktree, table, advance } = sharedRefsFixture(t);
  const before = await captureGate(["--serial"], worktree, { table });
  advance();
  // A more recent row for another check must not hide the movement.
  await captureGate(["--document", "--serial"], worktree, { table });
  writeFileSync(join(worktree, "fail-beta"), "fail\n");
  const failed = await captureGate(["--serial", "--again", ...WHY], worktree, {
    table,
  });
  assert.equal(failed.row.exitCode, 1);
  const delta = failed.lines.filter((line) =>
    line.startsWith("shared refs moved:"),
  );
  assert.equal(delta.length, 1);
  for (const field of [
    "origin/main",
    "main",
    "tags +v9000.0.1",
    "count 0..1",
    "newest absent..v9000.0.1",
    "refs/dotln/ 0..1",
  ])
    assert.ok(delta[0].includes(field), delta[0]);
  assert.ok(delta[0].includes(before.row.sharedRefs.end.originMain));
  t.diagnostic("PROOF WO-198 forced failure " + delta[0]);
  const unchanged = await captureGate(
    ["--serial", "--again", ...WHY],
    worktree,
    {
      table,
    },
  );
  assert.equal(unchanged.row.exitCode, 1);
  assert.ok(
    unchanged.lines.every((line) => !line.startsWith("shared refs moved:")),
  );
});

test("WO-198 damaged archive JSON cannot prevent recording a failed gate", async (t) => {
  const { repo, table } = taskReuseFixture(t);
  const original = readSharedRefs(repo);
  recordGateChecks(repo, [
    {
      checkId: "npm test",
      treeHash: gateTreeHash(repo),
      subject: "fixture",
      durationMs: 0,
      exitCode: 1,
      executed: true,
      evidenceRef: "fixture:before-damaged-archive",
      recordedAt: new Date(0).toISOString(),
      sharedRefs: { start: original, end: original },
    },
  ]);
  const history = join(repo, "docs/control/local/harness/check-history");
  mkdirSync(history, { recursive: true });
  writeFileSync(join(history, `${"a".repeat(40)}.json`), "not json\n");
  writeFileSync(join(repo, "fail-beta"), "fail\n");
  const failed = await captureGate(["--serial", "--again"], repo, {
    table: table.filter((row) => ["build", "beta"].includes(row.name)),
  });
  assert.equal(failed.row.exitCode, 1);
  // Read the hot index independently: the archive deliberately remains damaged.
  const stored = JSON.parse(
    readFileSync(join(repo, "docs/control/local/harness/checks.json"), "utf8"),
  );
  assert.equal(stored.length, 2);
  assert.equal(stored.at(-1).exitCode, 1);
  assert.equal(stored.at(-1).recordedAt, failed.row.recordedAt);
  assert.deepEqual(stored.at(-1).sharedRefs, {
    start: original,
    end: original,
  });
  assert.equal(
    failed.lines.filter((line) => /^npm test: \d+ passed;/u.test(line)).length,
    1,
  );
  assert.ok(
    failed.lines.every((line) => !line.startsWith("shared refs moved:")),
  );
  t.diagnostic(
    "PROOF WO-198 damaged archive: exit 1, two hot rows, complete snapshot, one summary, no delta",
  );
});

test("WO-198 an unselectable archived timestamp still permits movement during the failed run", async (t) => {
  const { worktree, table, advance, observed } = sharedRefsFixture(t);
  const original = readSharedRefs(worktree);
  const history = join(worktree, "docs/control/local/harness/check-history");
  mkdirSync(history, { recursive: true });
  // One archive row skips sorting and reaches Date.parse in row selection.
  writeFileSync(
    join(history, `${"b".repeat(40)}.json`),
    JSON.stringify([{ checkId: "npm test", recordedAt: { toString: null } }]),
  );
  writeFileSync(join(worktree, "fail-beta"), "fail\n");
  let moved = false;
  const failed = await captureGate(["--serial", "--again"], worktree, {
    table,
    stopRequested: () => {
      if (!moved && observed(worktree).includes("build")) {
        moved = true;
        advance();
      }
      return false;
    },
  });
  assert.ok(moved);
  assert.equal(failed.row.exitCode, 1);
  const stored = JSON.parse(
    readFileSync(
      join(worktree, "docs/control/local/harness/checks.json"),
      "utf8",
    ),
  );
  assert.equal(stored.length, 1);
  assert.equal(stored[0].exitCode, 1);
  assert.equal(stored[0].recordedAt, failed.row.recordedAt);
  assert.deepEqual(stored[0].sharedRefs, {
    start: original,
    end: readSharedRefs(worktree),
  });
  assert.equal(
    failed.lines.filter((line) => /^npm test: \d+ passed;/u.test(line)).length,
    1,
  );
  const delta = failed.lines.filter((line) =>
    line.startsWith("shared refs moved:"),
  );
  assert.equal(delta.length, 1);
  assert.doesNotMatch(delta[0], /since previous:/u);
  for (const field of ["origin/main", "main", "tags +v9000.0.1", "refs/dotln/"])
    assert.ok(delta[0].includes(`during run: ${field}`), delta[0]);
  t.diagnostic("PROOF WO-198 unselectable history " + delta[0]);
});

test("WO-198 snapshot validation rejects malformed shapes without starting a gate", (t) => {
  const complete = {
    originMain: "earlier-origin",
    main: "earlier-main",
    tags: { count: 1, newest: "v-earlier" },
    dotlnRefs: 1,
  };
  const without = (value, field) =>
    Object.fromEntries(Object.entries(value).filter(([key]) => key !== field));
  const variants = [
    ["missing snapshot", undefined],
    ["null snapshot", null],
    ["string snapshot", "not an object"],
    ["array snapshot", []],
    ["empty snapshot", {}],
    ...["originMain", "main", "tags", "dotlnRefs"].map((field) => [
      `missing ${field}`,
      without(complete, field),
    ]),
    ...["count", "newest"].map((field) => [
      `missing tags.${field}`,
      { ...complete, tags: without(complete.tags, field) },
    ]),
    ...[null, "not an object", []].map((tags) => [
      `malformed tags ${JSON.stringify(tags)}`,
      { ...complete, tags },
    ]),
    ["non-string originMain", { ...complete, originMain: null }],
    ["empty main", { ...complete, main: "" }],
    [
      "non-numeric tag count",
      { ...complete, tags: { ...complete.tags, count: "1" } },
    ],
    [
      "negative tag count",
      { ...complete, tags: { ...complete.tags, count: -1 } },
    ],
    [
      "non-string newest tag",
      { ...complete, tags: { ...complete.tags, newest: 1 } },
    ],
    ["fractional ref count", { ...complete, dotlnRefs: 0.5 }],
    [
      "unsafe tag count",
      { ...complete, tags: { ...complete.tags, count: 1e21 } },
    ],
  ];
  for (const [name, snapshot] of variants)
    assert.equal(completeSharedRefs(snapshot), false, name);
  assert.equal(completeSharedRefs(complete), true);
  assert.equal(
    completeSharedRefs({
      originMain: "absent",
      main: "absent",
      tags: { count: 0, newest: "absent" },
      dotlnRefs: 0,
    }),
    true,
  );
  t.diagnostic(
    `PROOF WO-198 snapshot validator: ${variants.length} malformed shapes rejected, two valid controls accepted, no fixture gates`,
  );
});

test("WO-198 incomplete earlier snapshots never prevent recording a failed gate", async (t) => {
  const variants = [
    ["empty snapshot", {}],
    [
      "missing tags",
      { originMain: "earlier-origin", main: "earlier-main", dotlnRefs: 1 },
    ],
  ];
  let confirmed = 0;
  for (const [name, end] of variants)
    await t.test(name, async (t) => {
      const { repo, table } = taskReuseFixture(t);
      recordGateChecks(repo, [
        {
          checkId: "npm test",
          treeHash: gateTreeHash(repo),
          subject: "fixture",
          durationMs: 0,
          exitCode: 1,
          executed: true,
          evidenceRef: "fixture:incomplete-snapshot",
          recordedAt: new Date(0).toISOString(),
          sharedRefs: { start: {}, end },
        },
      ]);
      writeFileSync(join(repo, "fail-beta"), "fail\n");
      const failed = await captureGate(["--serial", "--again"], repo, {
        table: table.filter((row) => ["build", "beta"].includes(row.name)),
      });
      assert.equal(failed.row.exitCode, 1);
      const stored = readGateChecks(repo);
      assert.equal(stored.length, 2);
      assert.equal(stored.at(-1).exitCode, 1);
      assert.equal(stored.at(-1).recordedAt, failed.row.recordedAt);
      assert.deepEqual(stored.at(-1).sharedRefs, {
        start: readSharedRefs(repo),
        end: readSharedRefs(repo),
      });
      assert.equal(
        failed.lines.filter((line) => line.startsWith("npm test:")).length,
        1,
      );
      assert.ok(
        failed.lines.every((line) => !line.startsWith("shared refs moved:")),
      );
      confirmed++;
    });
  assert.equal(confirmed, variants.length);
  t.diagnostic(
    `PROOF WO-198 malformed snapshots: ${variants.length} variants recorded exit 1, complete snapshots and one summary without an invented delta`,
  );
});

test("WO-198 an incomplete earlier snapshot still permits movement during the failed run", async (t) => {
  const { worktree, table, advance, observed } = sharedRefsFixture(t);
  const original = readSharedRefs(worktree);
  recordGateChecks(worktree, [
    {
      checkId: "npm test",
      treeHash: gateTreeHash(worktree),
      subject: "fixture",
      durationMs: 0,
      exitCode: 1,
      executed: true,
      evidenceRef: "fixture:incomplete-snapshot",
      recordedAt: new Date(0).toISOString(),
      sharedRefs: { start: {}, end: { ...original, tags: null } },
    },
  ]);
  writeFileSync(join(worktree, "fail-beta"), "fail\n");
  let moved = false;
  const failed = await captureGate(["--serial", "--again"], worktree, {
    table,
    stopRequested: () => {
      if (!moved && observed(worktree).includes("build")) {
        moved = true;
        advance();
      }
      return false;
    },
  });
  assert.ok(moved);
  assert.equal(failed.row.exitCode, 1);
  assert.equal(readGateChecks(worktree).length, 2);
  const delta = failed.lines.filter((line) =>
    line.startsWith("shared refs moved:"),
  );
  assert.equal(delta.length, 1);
  assert.doesNotMatch(delta[0], /since previous:/);
  for (const field of ["origin/main", "main", "tags +v9000.0.1", "refs/dotln/"])
    assert.ok(delta[0].includes(`during run: ${field}`), delta[0]);
  t.diagnostic("PROOF WO-198 incomplete baseline " + delta[0]);
});

test("WO-198 first and legacy rows detect movement during a failed run, including a return to the previous value", async (t) => {
  const { repo, worktree, table, advance, observed } = sharedRefsFixture(t);
  const original = readSharedRefs(worktree);
  // A historical row supplies no invented baseline.
  recordGateChecks(worktree, [
    {
      checkId: "npm test",
      treeHash: gateTreeHash(worktree),
      subject: "fixture",
      durationMs: 0,
      exitCode: 0,
      executed: true,
      evidenceRef: "fixture:legacy",
      recordedAt: new Date(0).toISOString(),
    },
  ]);
  writeFileSync(join(worktree, "fail-beta"), "fail\n");
  let moved = false;
  const failed = await captureGate(["--serial", "--again"], worktree, {
    table,
    stopRequested: () => {
      if (!moved && observed(worktree).includes("build")) {
        moved = true;
        advance();
      }
      return false;
    },
  });
  assert.ok(moved);
  assert.equal(failed.row.exitCode, 1);
  assert.deepEqual(failed.row.sharedRefs.start, original);
  assert.notDeepEqual(failed.row.sharedRefs.start, failed.row.sharedRefs.end);
  const delta = failed.lines.filter((line) =>
    line.startsWith("shared refs moved:"),
  );
  assert.equal(delta.length, 1);
  assert.match(delta[0], /during run: origin\/main/);
  assert.match(delta[0], /tags \+v9000\.0\.1/);
  assert.doesNotMatch(delta[0], /since previous:/);
  // Move out and back: comparing only the two runs' final values misses it.
  const advanced = failed.row.sharedRefs.end.originMain;
  runGit(repo, ["update-ref", "refs/remotes/origin/main", original.originMain]);
  let returned = false;
  const roundTrip = await captureGate(["--serial", "--again"], worktree, {
    table,
    stopRequested: () => {
      if (!returned) {
        returned = true;
        runGit(repo, ["update-ref", "refs/remotes/origin/main", advanced]);
      }
      return false;
    },
  });
  const roundTripDelta = roundTrip.lines.filter((line) =>
    line.startsWith("shared refs moved:"),
  );
  assert.equal(roundTripDelta.length, 1);
  assert.match(roundTripDelta[0], /since previous: origin\/main/);
  assert.match(roundTripDelta[0], /during run: origin\/main/);
  t.diagnostic("PROOF WO-198 during-run " + delta[0]);
  t.diagnostic("PROOF WO-198 round-trip " + roundTripDelta[0]);
});

const gateProof = (row) => ({
  codeIdentity: row.codeIdentity,
  evidenceRef: row.evidenceRef,
  recordedAt: row.recordedAt,
  executionMode: row.executionMode,
  freshSuites: row.freshSuites,
  reusedSuites: row.reusedSuites,
  exitCode: row.exitCode,
  tasks: row.taskTimeline.map(
    ({ name, executed, exitCode, reused, sourceRow }) => ({
      name,
      executed,
      exitCode,
      ...(reused ? { reused, sourceRow } : {}),
    }),
  ),
});

function gateInAnotherSession(repo, table, session) {
  const code =
    `import {runGate} from ${JSON.stringify(new URL("./test-runner.mjs", import.meta.url).href)};\n` +
    `const row=await runGate(["--serial"],${JSON.stringify(repo)},{table:${JSON.stringify(table)}});console.log("ROW "+JSON.stringify(row));process.exitCode=row.exitCode;`;
  const result = spawnSync(
    "bash",
    [
      "-c",
      'exec "$1" --input-type=module -e "$2"',
      session,
      process.execPath,
      code,
    ],
    {
      cwd: repo,
      encoding: "utf8",
      // Outside a gate the nested gate waits for host lanes like any other.
      timeout: 120000,
      maxBuffer: 16 * 1024 * 1024,
      env: {
        ...process.env,
        DOTLN_SESSION_ID: session,
        CODEX_THREAD_ID: session,
      },
    },
  );
  assert.equal(result.status, 0, result.stdout + result.stderr);
  return JSON.parse(
    result.stdout
      .split("\n")
      .find((line) => line.startsWith("ROW "))
      .slice(4),
  );
}

test("measurement mode records successful task deadlines with the gate row", async (t) => {
  const { repo, table } = taskReuseFixture(t);
  const saved = process.env.DOTLN_GATE_MEASURE_DEADLINES;
  t.after(() => {
    if (saved === undefined) delete process.env.DOTLN_GATE_MEASURE_DEADLINES;
    else process.env.DOTLN_GATE_MEASURE_DEADLINES = saved;
  });
  delete process.env.DOTLN_GATE_MEASURE_DEADLINES;
  const ordinary = await runGate(["--serial", "--again", ...WHY], repo, {
    table,
  });
  assert.equal(ordinary.exitCode, 0);
  assert.deepEqual(ordinary.deadlineDiagnostics, []);
  process.env.DOTLN_GATE_MEASURE_DEADLINES = "1";
  const startedAt = new Date().toISOString();
  const measured = await runGate(
    ["--serial", "--review", "--fresh", ...WHY],
    repo,
    {
      table,
    },
  );
  const finishedAt = new Date().toISOString();
  assert.equal(measured.exitCode, 0);
  const checks = readGateChecks(repo);
  const selected = measurementGateForRun(checks, startedAt, finishedAt);
  assert.equal(selected?.evidenceRef, measured.evidenceRef);
  assert.equal(selected?.checkId, "npm test");
  assert.equal(selected?.gateSelection, "review");
  assert.equal(selected?.executionMode, "forced-fresh");
  assert.equal(
    measurementGateForRun(
      [
        ...checks,
        { ...measured, checkId: "npm run test:full" },
        { ...measured, gateSelection: "plain" },
        {
          ...measured,
          recordedAt: new Date(Date.parse(startedAt) - 1).toISOString(),
        },
        {
          ...measured,
          recordedAt: new Date(Date.parse(finishedAt) + 1).toISOString(),
        },
      ],
      startedAt,
      finishedAt,
    ),
    selected,
  );
  assert.deepEqual(
    measured.deadlineDiagnostics.map((row) => row.task).sort(),
    measured.taskTimeline.map((row) => row.name).sort(),
  );
  for (const task of measured.taskTimeline) {
    const deadline = measured.deadlineDiagnostics.find(
      (row) => row.site === `suite:${task.name}`,
    );
    assert.equal(deadline.timeoutMs, task.timeoutMs);
    assert.equal(deadline.hit, false);
    assert.ok(deadline.durationMs < deadline.timeoutMs);
  }
  assert.deepEqual(
    readGateChecks(repo).at(-1).deadlineDiagnostics,
    measured.deadlineDiagnostics,
  );
});

test("reused task evidence never carries historical host-wait observations", async (t) => {
  const { repo, table } = taskReuseFixture(t);
  const pass = await runGate(["--serial", "--again"], repo, { table });
  assert.equal(pass.exitCode, 0);
  recordGateChecks(repo, [
    {
      ...pass,
      recordedAt: new Date(Date.parse(pass.recordedAt) + 1).toISOString(),
      taskTimeline: pass.taskTimeline.map((row) => ({
        ...row,
        hostLaneWaitMs: 123,
        hostLaneWait: { wallMs: 123 },
        laneWaitMs: 123,
        gapMs: 4,
        hostLaneWaitObservations: [{ waitedMs: 123, holders: [] }],
        hostLaneWaitRelations: [
          { observedAt: "fixture", relations: ["unknown"] },
        ],
      })),
    },
  ]);
  const { coveringTaskResults } = await import("./lib/gate-reuse.mjs");
  const { results } = await coveringTaskResults(repo, "npm test", table);
  assert.deepEqual(
    [...results.keys()].sort(),
    pass.taskTimeline.map((row) => row.name).sort(),
  );
  for (const result of results.values()) {
    assert.equal(result.hostLaneWaitMs, undefined);
    assert.equal(result.hostLaneWait, undefined);
    assert.equal(result.laneWaitMs, undefined);
    assert.equal(result.gapMs, undefined);
    assert.equal(result.hostLaneWaitObservations, undefined);
    assert.equal(result.hostLaneWaitRelations, undefined);
  }
});

test("WO-186 one failed task reruns alone in another shell and session, composes a claimable row and carries it into review", async (t) => {
  const { repo, table, observed } = taskReuseFixture(t);
  writeFileSync(join(repo, "fail-beta"), "fail\n");
  const first = await runGate(["--serial", "--again", ...WHY], repo, { table });
  assert.equal(first.exitCode, 1);
  assert.equal(first.identityUnchanged, true);
  assert.deepEqual(observed(), ["build", "alpha", "beta"]);
  rmSync(join(repo, "fail-beta"));
  const code =
    `import {runGate} from ${JSON.stringify(new URL("./test-runner.mjs", import.meta.url).href)};\n` +
    `const row = await runGate(["--serial"], ${JSON.stringify(repo)}, {table:${JSON.stringify(table)}}); console.log("ROW " + JSON.stringify(row)); process.exitCode = row.exitCode;`;
  const result = spawnSync(
    "bash",
    [
      "-c",
      'exec "$1" --input-type=module -e "$2"',
      "task-reuse-second-session",
      process.execPath,
      code,
    ],
    {
      cwd: repo,
      encoding: "utf8",
      maxBuffer: 16 * 1024 * 1024,
      env: {
        ...process.env,
        DOTLN_SESSION_ID: "task-reuse-second-session",
        CODEX_THREAD_ID: "task-reuse-second-session",
      },
    },
  );
  assert.equal(result.status, 0, result.stdout + result.stderr);
  const second = JSON.parse(
    result.stdout
      .split("\n")
      .find((line) => line.startsWith("ROW "))
      .slice(4),
  );
  assert.deepEqual(observed(), ["build", "alpha", "beta", "beta"]);
  assert.equal(second.freshSuites, 1);
  assert.equal(second.reusedSuites, 2);
  for (const name of ["build", "alpha"]) {
    const pass = second.taskTimeline.find((row) => row.name === name);
    assert.equal(pass.sourceRow.recordedAt, first.recordedAt);
    assert.equal(pass.sourceRow.codeIdentity, first.codeIdentity);
    assert.equal(pass.sourceRow.task, name);
  }
  assert.equal(
    second.taskTimeline.find((row) => row.name === "beta").reused,
    undefined,
  );
  const { requireGateClaims } = await import("./lib/handoff-ledger.mjs");
  const claim = await requireGateClaims(repo, {
    checked: true,
    claims: { plain: ["3"], review: [], document: [] },
  });
  assert.equal(claim.productGate.codeIdentity, second.codeIdentity);
  assert.deepEqual(claim.advisories, []);
  t.diagnostic(
    "PROOF WO-186 task reuse " +
      JSON.stringify({
        shell: "bash",
        session: "task-reuse-second-session",
        first: gateProof(first),
        second: gateProof(second),
        claimAccepted: true,
      }),
  );
  for (const args of [["--again", ...WHY], ["--review"]]) {
    const before = observed().length;
    const fresh = await runGate(["--serial", ...args], repo, { table });
    assert.equal(fresh.exitCode, 0);
    assert.equal(fresh.reusedSuites, args.includes("--again") ? 0 : 3);
    assert.deepEqual(
      observed().slice(before),
      args.includes("--again") ? ["build", "alpha", "beta"] : [],
    );
  }
});

test("WO-186 stopped, partial, timed-out and failed task observations never reuse; untracked edits invalidate and staging is stable", async (t) => {
  const { repo, table, observed } = taskReuseFixture(t);
  const first = await runGate(["--serial", "--again"], repo, { table });
  const { coveringTaskResults } = await import("./lib/gate-reuse.mjs");
  for (const extra of [
    { partial: true },
    { partial: null },
    { partial: 0 },
    { excludedSuites: ["missing"] },
    { timedOut: true },
    { exitCode: 1 },
    { failureKind: "timeout" },
  ]) {
    writeFileSync(join(repo, "scripts/new.mjs"), JSON.stringify(extra));
    const identity = gateCodeIdentity(repo);
    recordGateChecks(repo, [
      {
        ...first,
        codeIdentity: identity,
        evidenceRef: "fixture:unusable-task",
        recordedAt: new Date().toISOString(),
        taskTimeline: first.taskTimeline.map((task) => ({ ...task, ...extra })),
      },
    ]);
    assert.equal(
      (await coveringTaskResults(repo, "npm test", table, identity)).results
        .size,
      0,
      JSON.stringify(extra),
    );
  }
  const green = await runGate(["--serial", "--again"], repo, { table });
  writeFileSync(join(repo, "scripts/new.mjs"), "export const change = 2;\n");
  assert.notEqual(gateCodeIdentity(repo), green.codeIdentity);
  const edited = gateCodeIdentity(repo);
  runGit(repo, ["add", "scripts/new.mjs"]);
  assert.equal(gateCodeIdentity(repo), edited);
  const before = observed().length;
  const fresh = await runGate(["--serial"], repo, { table });
  assert.equal(fresh.reusedSuites, 0);
  assert.deepEqual(observed().slice(before), ["build", "alpha", "beta"]);
});

test("WO-186 a fresh worktree reads main's passes without modifying main, while a changed source runs", async (t) => {
  const { repo, table, observed } = taskReuseFixture(t);
  const first = await runGate(["--serial", "--again"], repo, { table });
  const index = join(repo, "docs/control/local/harness/checks.json");
  const bytes = readFileSync(index);
  const worktree = join(dirname(repo), `${repo.split("/").at(-1)}-worktree`);
  t.after(() => rmSync(worktree, { recursive: true, force: true }));
  runGit(repo, ["worktree", "add", "-q", "-b", "work", worktree]);
  assert.equal(gateCodeIdentity(worktree), first.codeIdentity);
  const reused = gateInAnotherSession(
    worktree,
    table,
    "main-reuse-second-session",
  );
  assert.equal(reused.exitCode, 0);
  assert.equal(reused.freshSuites, 0);
  assert.equal(reused.reusedSuites, 3);
  assert.deepEqual(observed(worktree), []);
  assert.ok(
    reused.taskTimeline.every((row) => row.sourceRow.location === "main"),
  );
  assert.deepEqual(readFileSync(index), bytes);
  t.diagnostic(
    "PROOF WO-186 main reuse " +
      JSON.stringify({
        shell: "bash",
        session: "main-reuse-second-session",
        main: gateProof(first),
        worktree: gateProof(reused),
        mainUnchanged: true,
        suitesStarted: observed(worktree),
      }),
  );
  writeFileSync(
    join(worktree, "scripts/alpha.mjs"),
    readFileSync(join(worktree, "scripts/alpha.mjs"), "utf8") + "// own edit\n",
  );
  const changed = gateInAnotherSession(
    worktree,
    table,
    "main-reuse-changed-session",
  );
  assert.equal(changed.reusedSuites, 0);
  assert.deepEqual(observed(worktree), ["build", "alpha", "beta"]);
  assert.deepEqual(readFileSync(index), bytes);
});

// The build publishes an ignored output from identity-covered source and
// beta judges that output, as a compiled package and its tests do.
function builtOutputFixture(t) {
  const fixture = taskReuseFixture(t);
  const { repo } = fixture;
  writeFileSync(
    join(repo, ".gitignore"),
    readFileSync(join(repo, ".gitignore"), "utf8") + "built-value\n",
  );
  writeFileSync(
    join(repo, "scripts/build.mjs"),
    'import fs from "node:fs"; fs.appendFileSync("observed.jsonl", "build\\n");\n' +
      'fs.copyFileSync("scripts/value.mjs", "built-value");\n',
  );
  writeFileSync(
    join(repo, "scripts/beta.mjs"),
    'import fs from "node:fs"; fs.appendFileSync("observed.jsonl", "beta\\n");\n' +
      'if(fs.existsSync("fail-beta")||fs.readFileSync("built-value","utf8").includes("bad"))process.exit(1);\n',
  );
  const value = (text) =>
    writeFileSync(
      join(repo, "scripts/value.mjs"),
      `export default ${JSON.stringify(text)};\n`,
    );
  const task = (row, name) =>
    row.taskTimeline.find((item) => item.name === name);
  const table = fixture.table.map((row) =>
    row.build ? { ...row, outputs: ["built-value"] } : row,
  );
  return { ...fixture, table, value, task };
}

test("WO-186 VER-001 a build output made at another identity is rebuilt before a task runs, so a returned-to identity keeps its failure", async (t) => {
  const { repo, table, observed, value, task } = builtOutputFixture(t);
  value("bad");
  const a = gateCodeIdentity(repo);
  const failed = await runGate(["--serial"], repo, { table });
  assert.equal(failed.exitCode, 1);
  assert.equal(failed.codeIdentity, a);
  assert.equal(failed.identityUnchanged, true);
  value("good");
  const elsewhere = await runGate(["--serial"], repo, { table });
  assert.equal(elsewhere.exitCode, 0);
  assert.notEqual(elsewhere.codeIdentity, a);
  // Source returns to A while the ignored output still holds B's build.
  value("bad");
  assert.equal(gateCodeIdentity(repo), a);
  assert.match(readFileSync(join(repo, "built-value"), "utf8"), /good/u);
  const before = observed().length;
  const returned = await runGate(["--serial"], repo, { table });
  assert.deepEqual(observed().slice(before), ["build", "beta"]);
  assert.equal(returned.exitCode, 1);
  assert.equal(returned.codeIdentity, a);
  assert.equal(task(returned, "build").reused, undefined);
  assert.equal(task(returned, "beta").exitCode, 1);
  assert.equal(task(returned, "alpha").sourceRow.recordedAt, failed.recordedAt);
  const { requireGateClaims } = await import("./lib/handoff-ledger.mjs");
  await assert.rejects(
    () =>
      requireGateClaims(repo, {
        checked: true,
        claims: { plain: ["3"], review: [], document: [] },
      }),
    /no passing complete npm test row/u,
  );
  // With A's output back on disk the build's pass is carried again: beta
  // alone runs, against A's build, and still fails.
  const again = observed().length;
  const repeated = await runGate(["--serial"], repo, { table });
  assert.deepEqual(observed().slice(again), ["beta"]);
  assert.equal(repeated.exitCode, 1);
  assert.equal(task(repeated, "build").outputAttested, true);
  assert.equal(
    task(repeated, "build").sourceRow.recordedAt,
    returned.recordedAt,
  );
});

test("WO-186 VER-001 a task's latest executed result decides: a forced-fresh failure runs again, and a carried result names the row that executed it", async (t) => {
  const { repo, table, observed, value, task } = builtOutputFixture(t);
  value("good");
  const green = await runGate(["--serial"], repo, { table });
  assert.equal(green.exitCode, 0);
  writeFileSync(join(repo, "fail-beta"), "fail\n");
  const forced = await runGate(["--serial", "--again", ...WHY], repo, {
    table,
  });
  assert.equal(forced.exitCode, 1);
  assert.equal(forced.codeIdentity, green.codeIdentity);
  assert.equal(forced.identityUnchanged, true);
  // The older complete pass no longer answers for beta: the claim check
  // refuses it and names the task, and beta runs alone beside the attested
  // build.
  const { coveringGateCheck } = await import("./lib/gate-reuse.mjs");
  const { requireGateClaims } = await import("./lib/handoff-ledger.mjs");
  const ledger = {
    checked: true,
    claims: { plain: ["3"], review: [], document: [] },
  };
  const refused = await coveringGateCheck(repo, "npm test", []);
  assert.equal(refused.row, undefined);
  assert.equal(refused.displaced.row.recordedAt, green.recordedAt);
  assert.deepEqual(refused.displaced.tasks, ["beta"]);
  await assert.rejects(
    () => requireGateClaims(repo, ledger),
    /no passing complete npm test row stands[^]*names beta, whose latest execution there can no longer be carried/u,
  );
  let before = observed().length;
  const stillFailing = await runGate(["--serial"], repo, { table });
  assert.deepEqual(observed().slice(before), ["beta"]);
  assert.equal(stillFailing.exitCode, 1);
  assert.equal(task(stillFailing, "build").outputAttested, true);
  await assert.rejects(
    () => requireGateClaims(repo, ledger),
    /can no longer be carried/u,
  );
  rmSync(join(repo, "fail-beta"));
  before = observed().length;
  const repaired = await runGate(["--serial"], repo, { table });
  assert.deepEqual(observed().slice(before), ["beta"]);
  assert.equal(repaired.exitCode, 0);
  assert.equal(repaired.executionMode, "composed");
  assert.equal(task(repaired, "beta").reused, undefined);
  // Build and alpha last ran in the forced-fresh attempt, not in the first
  // green row.
  for (const name of ["build", "alpha"])
    assert.equal(task(repaired, name).sourceRow.recordedAt, forced.recordedAt);
  // With every task settled no suite starts, and each carried result names
  // its executing row rather than the composed row it passed through.
  before = observed().length;
  const settled = await runGate(["--serial"], repo, { table });
  assert.deepEqual(observed().slice(before), []);
  assert.equal(settled.exitCode, 0);
  assert.equal(settled.reusedSuites, 3);
  for (const name of ["build", "alpha"])
    assert.equal(task(settled, name).sourceRow.recordedAt, forced.recordedAt);
  assert.equal(task(settled, "beta").sourceRow.recordedAt, repaired.recordedAt);
  const claim = await requireGateClaims(repo, ledger);
  assert.equal(claim.productGate.codeIdentity, green.codeIdentity);
  assert.deepEqual(claim.advisories, []);
  // Once beta's latest run passes, the first green row stands again too, as
  // a review row does after a flaky task is rerun.
  const standing = await coveringGateCheck(repo, "npm test", []);
  assert.equal(standing.displaced, undefined);
  assert.ok(
    standing.candidates.some((row) => row.recordedAt === green.recordedAt),
  );
});

test("WO-186 VER-001 a build output that changes while the gate runs fails the row and none of its passes is carried", async (t) => {
  const { repo, table, observed, value, task } = builtOutputFixture(t);
  writeFileSync(
    join(repo, ".gitignore"),
    readFileSync(join(repo, ".gitignore"), "utf8") + "drift\n",
  );
  // Alpha stands for any writer that replaces the output after the build.
  writeFileSync(
    join(repo, "scripts/alpha.mjs"),
    'import fs from "node:fs"; fs.appendFileSync("observed.jsonl", "alpha\\n");\n' +
      'if(fs.existsSync("drift"))fs.writeFileSync("built-value","export default \\"good\\";\\n");\n',
  );
  value("bad");
  writeFileSync(join(repo, "drift"), "drift\n");
  const drifted = await runGate(["--serial", "--again"], repo, { table });
  // Beta passed against an output this identity's build never made.
  assert.equal(task(drifted, "beta").exitCode, 0);
  assert.equal(drifted.identityUnchanged, true);
  assert.equal(drifted.buildOutputUnchanged, false);
  assert.equal(drifted.exitCode, 1);
  const { coveringTaskResults } = await import("./lib/gate-reuse.mjs");
  assert.equal(
    (await coveringTaskResults(repo, "npm test", table)).results.size,
    0,
  );
  rmSync(join(repo, "drift"));
  const before = observed().length;
  const honest = await runGate(["--serial"], repo, { table });
  assert.deepEqual(observed().slice(before), ["build", "alpha", "beta"]);
  assert.equal(honest.buildOutputUnchanged, true);
  assert.equal(honest.exitCode, 1);
  assert.equal(task(honest, "beta").exitCode, 1);
});

test("WO-186 VER-001 an output changed or removed outside its attested build is rebuilt, and an undeclared output is never carried beside a task", async (t) => {
  const { repo, table, observed, value, task } = builtOutputFixture(t);
  value("good");
  const failBeta = join(repo, "fail-beta");
  writeFileSync(failBeta, "fail\n");
  const first = await runGate(["--serial"], repo, { table });
  assert.equal(first.exitCode, 1);
  assert.match(task(first, "build").outputDigest, /^[a-f0-9]{64}$/u);
  rmSync(failBeta);
  // Another writer replaces the ignored output without a gate build. Carrying
  // the build's pass would hand beta an output no row attested.
  writeFileSync(join(repo, "built-value"), 'export default "bad";\n');
  let before = observed().length;
  const rebuilt = await runGate(["--serial"], repo, { table });
  assert.deepEqual(observed().slice(before), ["build", "beta"]);
  assert.equal(rebuilt.exitCode, 0);
  assert.equal(task(rebuilt, "build").reused, undefined);
  // A removed output is not attested either.
  writeFileSync(failBeta, "fail\n");
  assert.equal(
    (await runGate(["--serial", "--again", ...WHY], repo, { table })).exitCode,
    1,
  );
  rmSync(failBeta);
  rmSync(join(repo, "built-value"));
  before = observed().length;
  const restored = await runGate(["--serial"], repo, { table });
  assert.deepEqual(observed().slice(before), ["build", "beta"]);
  assert.equal(restored.exitCode, 0);
  // A build row that declares no outputs records no digest, so its pass is
  // never carried beside a task that runs.
  const undeclared = table.map(({ outputs, ...row }) =>
    row.build ? row : { ...row, ...(outputs ? { outputs } : {}) },
  );
  writeFileSync(failBeta, "fail\n");
  const unattested = await runGate(["--serial", "--again", ...WHY], repo, {
    table: undeclared,
  });
  assert.equal(unattested.exitCode, 1);
  assert.equal(task(unattested, "build").outputDigest, undefined);
  rmSync(failBeta);
  before = observed().length;
  const fresh = await runGate(["--serial"], repo, { table: undeclared });
  assert.deepEqual(observed().slice(before), ["build", "beta"]);
  assert.equal(fresh.exitCode, 0);
  // A row in which no task runs consumes no output and carries every pass.
  before = observed().length;
  const settled = await runGate(["--serial"], repo, { table: undeclared });
  assert.deepEqual(observed().slice(before), []);
  assert.equal(settled.reusedSuites, 3);
});

test("WO-186 VER-001 a later failed gate displaces older passes, and a carried result is never itself evidence", async (t) => {
  const { repo, table } = taskReuseFixture(t);
  const { coveringTaskResults } = await import("./lib/gate-reuse.mjs");
  const carried = async (identity) =>
    (await coveringTaskResults(repo, "npm test", table, identity)).results;
  // Each gate-level failure follows a clean pass at the same identity. Every
  // task passed inside the failed row, and the older clean row still exists.
  for (const taint of [
    { abandonedRoots: ["/tmp/dotln-host-confinement-left"] },
    { memory: { failure: { failureKind: "memory-budget" } } },
    { identityUnchanged: false },
    { timedOut: true },
    { failureKind: "monitor-unavailable" },
  ]) {
    const clean = await runGate(["--serial", "--again"], repo, { table });
    assert.equal(clean.exitCode, 0);
    assert.equal((await carried(clean.codeIdentity)).size, 3);
    recordGateChecks(repo, [
      {
        ...clean,
        exitCode: 1,
        ...taint,
        evidenceRef: "fixture:failed-gate",
        recordedAt: new Date(Date.parse(clean.recordedAt) + 1).toISOString(),
      },
    ]);
    assert.equal(
      (await carried(clean.codeIdentity)).size,
      0,
      JSON.stringify(taint),
    );
  }
  // One task's later timeout displaces that task alone.
  const clean = await runGate(["--serial", "--again"], repo, { table });
  recordGateChecks(repo, [
    {
      ...clean,
      exitCode: 1,
      identityUnchanged: true,
      evidenceRef: "fixture:one-timeout",
      recordedAt: new Date(Date.parse(clean.recordedAt) + 1).toISOString(),
      taskTimeline: clean.taskTimeline.map((item) =>
        item.name === "beta"
          ? { ...item, exitCode: 1, timedOut: true, failureKind: "timeout" }
          : item,
      ),
    },
  ]);
  assert.deepEqual([...(await carried(clean.codeIdentity)).keys()].sort(), [
    "alpha",
    "build",
  ]);
  // Overlapping gates: the row recorded last holds beta's earlier pass, and
  // the row recorded first holds its later failure. The later run decides.
  writeFileSync(join(repo, "scripts/new.mjs"), "export const overlap = 1;\n");
  const overlapping = gateCodeIdentity(repo);
  const base = Date.now() + 60_000;
  const at = (ms) => new Date(base + ms).toISOString();
  const overlap = (recordedMs, finishedMs, beta) => ({
    ...clean,
    codeIdentity: overlapping,
    exitCode: beta.exitCode ?? 0,
    identityUnchanged: true,
    evidenceRef: `fixture:overlap-${recordedMs}`,
    recordedAt: at(recordedMs),
    taskTimeline: clean.taskTimeline.map((item) =>
      item.name === "beta"
        ? { ...item, ...beta, finishedAt: at(finishedMs) }
        : { ...item, finishedAt: at(500) },
    ),
  });
  recordGateChecks(repo, [
    overlap(10_000, 1_000, {}),
    overlap(8_000, 3_000, { exitCode: 1 }),
  ]);
  assert.deepEqual([...(await carried(overlapping)).keys()].sort(), [
    "alpha",
    "build",
  ]);
  // A result with no finish time cannot be ordered and supplies nothing.
  const identityFor = (text) => {
    writeFileSync(join(repo, "scripts/new.mjs"), text);
    return gateCodeIdentity(repo);
  };
  const stampBase = Date.now();
  const stamp = (ms) => new Date(stampBase + ms).toISOString();
  const unfinished = identityFor("export const unfinished = 1;\n");
  recordGateChecks(repo, [
    {
      ...clean,
      codeIdentity: unfinished,
      evidenceRef: "fixture:unfinished",
      recordedAt: stamp(0),
      taskTimeline: clean.taskTimeline.map(({ finishedAt, ...item }) => item),
    },
  ]);
  assert.equal((await carried(unfinished)).size, 0);
  // A task that never started in a later row leaves its older pass carried.
  const unstarted = identityFor("export const unstarted = 1;\n");
  recordGateChecks(repo, [
    {
      ...clean,
      codeIdentity: unstarted,
      evidenceRef: "fixture:whole",
      recordedAt: stamp(0),
    },
    {
      ...clean,
      codeIdentity: unstarted,
      exitCode: 1,
      identityUnchanged: true,
      evidenceRef: "fixture:unstarted",
      recordedAt: stamp(1000),
      taskTimeline: clean.taskTimeline.map((item) =>
        item.name === "beta"
          ? { name: "beta", exitCode: 1, executed: false, durationMs: 0 }
          : { ...item, finishedAt: stamp(1000) },
      ),
    },
  ]);
  assert.deepEqual([...(await carried(unstarted)).keys()].sort(), [
    "alpha",
    "beta",
    "build",
  ]);
  // A later row that repeats a name cannot say which result ran: it supplies
  // nothing and displaces every task it names.
  recordGateChecks(repo, [
    {
      ...clean,
      codeIdentity: unstarted,
      evidenceRef: "fixture:repeated",
      recordedAt: stamp(2000),
      taskTimeline: [
        ...clean.taskTimeline,
        clean.taskTimeline.find((item) => item.name === "beta"),
      ],
    },
  ]);
  assert.equal((await carried(unstarted)).size, 0);
  // A row holding only carried results supplies nothing at an identity with
  // no execution, whatever source it names.
  writeFileSync(join(repo, "scripts/new.mjs"), "export const lone = 1;\n");
  const lone = gateCodeIdentity(repo);
  recordGateChecks(repo, [
    {
      ...clean,
      codeIdentity: lone,
      evidenceRef: "fixture:carried-only",
      recordedAt: new Date().toISOString(),
      taskTimeline: clean.taskTimeline.map(({ name }) => ({
        name,
        executed: true,
        exitCode: 0,
        durationMs: 0,
        reused: true,
        sourceRow: {
          task: name,
          codeIdentity: lone,
          evidenceRef: "fixture:absent",
          recordedAt: clean.recordedAt,
          location: "worktree",
        },
      })),
    },
  ]);
  assert.equal((await carried(lone)).size, 0);
});

test("WO-186 VER-001 a pass carried from main is re-validated against main's latest execution", async (t) => {
  const { repo, table, observed } = taskReuseFixture(t);
  const first = await runGate(["--serial", "--again", ...WHY], repo, { table });
  const worktree = join(dirname(repo), `${repo.split("/").at(-1)}-revalidate`);
  t.after(() => rmSync(worktree, { recursive: true, force: true }));
  runGit(repo, ["worktree", "add", "-q", "-b", "work", worktree]);
  const carried = await runGate(["--serial"], worktree, { table });
  assert.equal(carried.freshSuites, 0);
  assert.deepEqual(observed(worktree), []);
  // Main then fails beta at the same identity in a forced-fresh run.
  writeFileSync(join(repo, "fail-beta"), "fail\n");
  const mainFailed = await runGate(["--serial", "--again", ...WHY], repo, {
    table,
  });
  assert.equal(mainFailed.exitCode, 1);
  assert.equal(mainFailed.codeIdentity, first.codeIdentity);
  const index = join(repo, "docs/control/local/harness/checks.json");
  const bytes = readFileSync(index);
  const rerun = await runGate(["--serial"], worktree, { table });
  assert.deepEqual(observed(worktree), ["beta"]);
  assert.equal(rerun.exitCode, 0);
  const task = (row, name) =>
    row.taskTimeline.find((item) => item.name === name);
  assert.equal(task(rerun, "beta").reused, undefined);
  assert.equal(task(rerun, "alpha").sourceRow.location, "main");
  assert.equal(
    task(rerun, "alpha").sourceRow.recordedAt,
    mainFailed.recordedAt,
  );
  assert.deepEqual(readFileSync(index), bytes);
  // The worktree's own execution of beta now decides for it.
  const settled = await runGate(["--serial"], worktree, { table });
  assert.deepEqual(observed(worktree), ["beta"]);
  assert.equal(settled.reusedSuites, 3);
  assert.equal(task(settled, "beta").sourceRow.location, "worktree");
  for (const name of ["build", "alpha"]) {
    assert.equal(task(settled, name).sourceRow.location, "main");
    assert.equal(
      task(settled, name).sourceRow.recordedAt,
      mainFailed.recordedAt,
    );
  }
});

test("WO-186 VER-001 an attested output is carried in another session, and a worktree without main's output builds before its task", async (t) => {
  const { repo, table, observed, value, task } = builtOutputFixture(t);
  value("good");
  runGit(repo, ["add", "."]);
  runGit(repo, [
    "-c",
    "maintenance.auto=false",
    "commit",
    "-qm",
    "built output fixture",
  ]);
  writeFileSync(join(repo, "fail-beta"), "fail\n");
  const first = await runGate(["--serial"], repo, { table });
  assert.equal(first.exitCode, 1);
  // A linked worktree at the same identity has never been built: main's
  // build pass does not speak for an output that is not there.
  const worktree = join(dirname(repo), `${repo.split("/").at(-1)}-unbuilt`);
  t.after(() => rmSync(worktree, { recursive: true, force: true }));
  runGit(repo, ["worktree", "add", "-q", "-b", "work", worktree]);
  assert.equal(gateCodeIdentity(worktree), first.codeIdentity);
  assert.equal(existsSync(join(worktree, "built-value")), false);
  const built = gateInAnotherSession(worktree, table, "unbuilt-worktree");
  assert.deepEqual(observed(worktree), ["build", "beta"]);
  assert.equal(task(built, "build").reused, undefined);
  assert.equal(task(built, "alpha").sourceRow.location, "main");
  // With every task settled there, a further session starts no suite.
  const settled = gateInAnotherSession(worktree, table, "settled-worktree");
  assert.deepEqual(observed(worktree), ["build", "beta"]);
  assert.equal(settled.reusedSuites, 3);
  // In main the output is still the one its failed row attested, so another
  // shell and session runs the failed task alone.
  rmSync(join(repo, "fail-beta"));
  const before = observed().length;
  const rerun = gateInAnotherSession(repo, table, "attested-main");
  assert.deepEqual(observed().slice(before), ["beta"]);
  assert.equal(rerun.freshSuites, 1);
  assert.equal(task(rerun, "build").outputAttested, true);
  assert.equal(task(rerun, "build").sourceRow.recordedAt, first.recordedAt);
});

test("WO-186 VER-001 the build output digest covers wildcard directories by bytes and refuses what it cannot cover", async (t) => {
  const { buildOutputDigest } = await import("./lib/gate-reuse.mjs");
  const root = createFixtureRoot(join(tmpdir(), "dotln-output-digest-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  for (const name of ["a", "b"]) {
    mkdirSync(join(root, `pk/${name}/dist/src`), { recursive: true });
    writeFileSync(join(root, `pk/${name}/dist/src/index.js`), `${name}-one\n`);
  }
  mkdirSync(join(root, "pk/unbuilt/src"), { recursive: true });
  // Finder leaves this plain file beside the package directories.
  writeFileSync(join(root, "pk/.DS_Store"), "metadata\n");
  const wildcard = ["pk/*/dist"];
  const digest = buildOutputDigest(root, wildcard);
  assert.match(digest, /^[a-f0-9]{64}$/u);
  // The wildcard names the same files as the directories spelled out.
  assert.equal(buildOutputDigest(root, ["pk/a/dist", "pk/b/dist"]), digest);
  assert.notEqual(buildOutputDigest(root, ["pk/a/dist"]), digest);
  // Bytes decide, also at an unchanged length; metadata beside or inside the
  // output does not.
  writeFileSync(join(root, "pk/b/dist/src/index.js"), "b-two\n");
  const changed = buildOutputDigest(root, wildcard);
  assert.notEqual(changed, digest);
  writeFileSync(join(root, "pk/.DS_Store"), "other metadata\n");
  writeFileSync(join(root, "pk/a/dist/.DS_Store"), "metadata\n");
  assert.equal(buildOutputDigest(root, wildcard), changed);
  writeFileSync(join(root, "pk/a/dist/src/extra.test.js"), "");
  assert.notEqual(buildOutputDigest(root, wildcard), changed);
  // No digest without a declaration, for a declaration that matches no file,
  // and for an output whose content a link or special file would hide.
  assert.equal(buildOutputDigest(root, undefined), undefined);
  assert.equal(buildOutputDigest(root, ["pk/*/missing"]), undefined);
  assert.equal(buildOutputDigest(root, ["pk/.DS_Store/dist"]), undefined);
  symlinkSync("index.js", join(root, "pk/b/dist/src/alias.js"));
  assert.equal(buildOutputDigest(root, wildcard), undefined);
  rmSync(join(root, "pk/b/dist/src/alias.js"));
  symlinkSync("a", join(root, "pk/linked"));
  assert.equal(buildOutputDigest(root, wildcard), undefined);
  rmSync(join(root, "pk/linked"));
  assert.match(buildOutputDigest(root, wildcard), /^[a-f0-9]{64}$/u);
  // An empty list declares a build that publishes nothing.
  assert.match(buildOutputDigest(root, []), /^[a-f0-9]{64}$/u);
  // The real table's build declares the output its tasks consume; without
  // this declaration its pass would be attested trivially or never.
  assert.deepEqual(suites.find((row) => row.build).outputs, [
    "packages/*/dist",
  ]);
});

test("WO-186 VER-001 a wildcard output beside a plain file is attested, a failed task reruns alone, and a carried build's output is still judged at the end", async (t) => {
  const { repo, observed, value, task, table: base } = builtOutputFixture(t);
  // The real table's shape: a wildcard over package directories, with an
  // ignored plain file beside them.
  writeFileSync(
    join(repo, ".gitignore"),
    readFileSync(join(repo, ".gitignore"), "utf8") + "pk/\ndrift\nfail-alpha\n",
  );
  writeFileSync(
    join(repo, "scripts/build.mjs"),
    'import fs from "node:fs"; fs.appendFileSync("observed.jsonl", "build\\n");\n' +
      'fs.mkdirSync("pk/a/dist", { recursive: true }); fs.writeFileSync("pk/.DS_Store", "metadata\\n");\n' +
      'fs.copyFileSync("scripts/value.mjs", "pk/a/dist/value.mjs");\n',
  );
  writeFileSync(
    join(repo, "scripts/alpha.mjs"),
    'import fs from "node:fs"; fs.appendFileSync("observed.jsonl", "alpha\\n");\n' +
      'if(fs.existsSync("drift"))fs.writeFileSync("pk/a/dist/value.mjs","export default \\"evil\\";\\n");\n' +
      'if(fs.existsSync("fail-alpha"))process.exit(1);\n',
  );
  writeFileSync(
    join(repo, "scripts/beta.mjs"),
    'import fs from "node:fs"; fs.appendFileSync("observed.jsonl", "beta\\n");\n' +
      'if(fs.readFileSync("pk/a/dist/value.mjs","utf8").includes("bad"))process.exit(1);\n',
  );
  const table = base.map((row) =>
    row.build ? { ...row, outputs: ["pk/*/dist"] } : row,
  );
  value("good");
  writeFileSync(join(repo, "fail-alpha"), "fail\n");
  const first = await runGate(["--serial", "--keep-going"], repo, { table });
  assert.equal(first.exitCode, 1);
  assert.match(task(first, "build").outputDigest, /^[a-f0-9]{64}$/u);
  assert.equal(first.buildOutputUnchanged, true);
  assert.equal(first.buildOutputAttested, undefined);
  // Alpha reruns alone beside the attested build, and this time replaces the
  // output while the gate runs. Every task has a pass; the row does not.
  rmSync(join(repo, "fail-alpha"));
  writeFileSync(join(repo, "drift"), "drift\n");
  let before = observed().length;
  const drifted = await runGate(["--serial", "--keep-going"], repo, { table });
  assert.deepEqual(observed().slice(before), ["alpha"]);
  assert.equal(task(drifted, "build").outputAttested, true);
  assert.equal(task(drifted, "alpha").exitCode, 0);
  assert.equal(drifted.buildOutputUnchanged, false);
  assert.equal(drifted.exitCode, 1);
  // Nothing of that row is carried, and the output is rebuilt before a task.
  rmSync(join(repo, "drift"));
  before = observed().length;
  const rebuilt = await runGate(["--serial", "--keep-going"], repo, { table });
  assert.deepEqual(observed().slice(before), ["build", "alpha"]);
  assert.equal(rebuilt.exitCode, 0);
  assert.equal(task(rebuilt, "beta").sourceRow.recordedAt, first.recordedAt);
  // A declared output the build cannot attest: the gate may pass, says so,
  // and supplies nothing to a later run.
  const dangling = base.map((row) =>
    row.build ? { ...row, outputs: ["pk/*/absent"] } : row,
  );
  const unattested = await runGate(["--serial", "--again", ...WHY], repo, {
    table: dangling,
  });
  assert.equal(unattested.exitCode, 0);
  assert.equal(task(unattested, "build").outputDigest, undefined);
  assert.equal(unattested.buildOutputAttested, false);
  before = observed().length;
  const again = await runGate(["--serial"], repo, { table: dangling });
  assert.deepEqual(observed().slice(before), ["build", "alpha", "beta"]);
  assert.equal(again.reusedSuites, 0);
});

test("WO-186 VER-001 a failed single-suite, machinery or partial run displaces an older pass, and a run under another check supplies none", async (t) => {
  const { repo, table: base, observed } = taskReuseFixture(t);
  writeFileSync(
    join(repo, ".gitignore"),
    readFileSync(join(repo, ".gitignore"), "utf8") + "fail-machine\n",
  );
  // An uncommitted machinery edit selects its suite for review.
  writeFileSync(
    join(repo, "scripts/machine.mjs"),
    'import fs from "node:fs"; fs.appendFileSync("observed.jsonl", "machine\\n");\n' +
      'if(fs.existsSync("fail-machine"))process.exit(1);\n',
  );
  const table = base;
  const { coveringGateCheck, coveringTaskResults } =
    await import("./lib/gate-reuse.mjs");
  const { requireGateClaims } = await import("./lib/handoff-ledger.mjs");
  const ledger = {
    checked: true,
    claims: { plain: ["3"], review: [], document: [] },
  };
  const review = await runGate(["--serial", "--review"], repo, { table });
  assert.equal(review.exitCode, 0);
  assert.ok(review.requiredSuites.includes("machine"));
  const rows = () => readGateChecks(repo);
  // A passing single-suite run keeps its row under its own check, which
  // answers no claim and changes none.
  let count = rows().length;
  assert.equal(
    (await runGate(["--only", "beta", "--serial"], repo, { table })).exitCode,
    0,
  );
  assert.equal(rows().length, count + 1);
  assert.equal(rows().at(-1).checkId, "suite:beta");
  assert.equal(
    (await coveringGateCheck(repo, "npm test", [])).row.recordedAt,
    review.recordedAt,
  );
  // A failing one is that task's latest run: the claim is refused for it,
  // and the next plain run runs it instead of carrying.
  writeFileSync(join(repo, "fail-beta"), "fail\n");
  const only = await runGate(["--only", "beta", "--serial"], repo, { table });
  assert.equal(only.exitCode, 1);
  assert.equal(only.checkId, "suite:beta");
  assert.equal(rows().length, count + 2);
  const refused = await coveringGateCheck(repo, "npm test", []);
  assert.equal(refused.row, undefined);
  assert.deepEqual(refused.displaced.tasks, ["beta"]);
  await assert.rejects(
    () => requireGateClaims(repo, ledger),
    /no passing complete npm test row stands[^]*beta/u,
  );
  let before = observed().length;
  const masked = await runGate(["--serial"], repo, { table });
  assert.deepEqual(observed().slice(before), ["beta"]);
  assert.equal(masked.exitCode, 1);
  // A later passing single-suite run answers no claim: beta still runs.
  rmSync(join(repo, "fail-beta"));
  assert.equal(
    (await runGate(["--only", "beta", "--serial"], repo, { table })).exitCode,
    0,
  );
  before = observed().length;
  const settled = await runGate(["--serial"], repo, { table });
  assert.deepEqual(observed().slice(before), ["beta"]);
  assert.equal(settled.exitCode, 0);
  assert.deepEqual((await requireGateClaims(repo, ledger)).advisories, []);
  // A failed machinery run displaces the review row for its suite alone.
  assert.equal(
    (await coveringGateCheck(repo, "npm test", ["machine"])).row.recordedAt,
    review.recordedAt,
  );
  writeFileSync(join(repo, "fail-machine"), "fail\n");
  count = rows().length;
  const machinery = await runGate(["--machinery", "--serial"], repo, { table });
  assert.equal(machinery.exitCode, 1);
  assert.equal(rows().length, count + 1);
  const narrowed = await coveringGateCheck(repo, "npm test", ["machine"]);
  assert.equal(narrowed.row, undefined);
  assert.equal(
    (await coveringGateCheck(repo, "npm test", [])).row.recordedAt,
    settled.recordedAt,
  );
  // Once the suite passes again under that check, the review row stands
  // again: no fresh review gate is owed for a failure that was answered.
  rmSync(join(repo, "fail-machine"));
  assert.equal(
    (await runGate(["--machinery", "--serial"], repo, { table })).exitCode,
    0,
  );
  assert.equal(
    (await coveringGateCheck(repo, "npm test", ["machine"])).row.recordedAt,
    review.recordedAt,
  );
  // The document gate follows document bytes the identity excludes and is
  // judged fresh at every completion: its rows neither supply nor displace.
  recordGateChecks(repo, [
    {
      ...settled,
      checkId: "npm run test:docs",
      exitCode: 1,
      evidenceRef: "fixture:document-failure",
      recordedAt: new Date(Date.now() + 500).toISOString(),
      taskTimeline: review.taskTimeline
        .filter((item) => item.name === "alpha")
        .map((item) => ({
          ...item,
          exitCode: 1,
          finishedAt: new Date(Date.now() + 500).toISOString(),
        })),
    },
  ]);
  assert.equal(
    (await coveringGateCheck(repo, "npm test", ["machine"])).row.recordedAt,
    review.recordedAt,
  );
  // A partial run's failure displaces too, and its passes supply nothing.
  recordGateChecks(repo, [
    {
      ...settled,
      checkId: CONFINED_PARTIAL_CHECK,
      partial: true,
      excludedSuites: [],
      exitCode: 1,
      evidenceRef: "fixture:partial-failure",
      recordedAt: new Date(Date.now() + 1000).toISOString(),
      taskTimeline: settled.taskTimeline
        .filter((item) => !item.reused)
        .map((item) => ({
          ...item,
          exitCode: 1,
          finishedAt: new Date(Date.now() + 1000).toISOString(),
        })),
    },
  ]);
  assert.deepEqual(
    [
      ...(
        await coveringTaskResults(
          repo,
          "npm test",
          table.filter((row) => !row.machinery),
        )
      ).results.keys(),
    ].sort(),
    ["alpha", "build"],
  );
  writeFileSync(join(repo, "scripts/new.mjs"), "export const lone = 2;\n");
  const lone = gateCodeIdentity(repo);
  recordGateChecks(repo, [
    {
      ...settled,
      checkId: "suite:beta",
      codeIdentity: lone,
      evidenceRef: "fixture:other-check-pass",
      recordedAt: new Date().toISOString(),
      taskTimeline: review.taskTimeline,
    },
  ]);
  assert.equal(
    (await coveringTaskResults(repo, "npm test", table, lone)).results.size,
    0,
  );
});

test("WO-186 VER-001 an unresolvable main leaves the lookup with the worktree's own rows", async (t) => {
  const { repo, table, observed } = taskReuseFixture(t);
  // Main is checked out in a linked worktree whose directory is then lost
  // while Git still registers it; the primary checkout works on another branch.
  runGit(repo, ["checkout", "-q", "-b", "work"]);
  const gone = join(dirname(repo), `${repo.split("/").at(-1)}-gone-main`);
  t.after(() => rmSync(gone, { recursive: true, force: true }));
  runGit(repo, ["worktree", "add", "-q", gone, "main"]);
  rmSync(gone, { recursive: true, force: true });
  const { mainWorktree } = await import("./lib/git.mjs");
  assert.equal(existsSync(mainWorktree(repo)), false);
  const { coveringGateCheck, coveringTaskResults, gateCandidates } =
    await import("./lib/gate-reuse.mjs");
  // No local row yet: the lookup answers with nothing instead of throwing.
  assert.deepEqual(
    (({ rows, location }) => ({ rows, location }))(
      await gateCandidates(repo, "npm test"),
    ),
    { rows: [], location: "worktree" },
  );
  assert.equal(
    (await coveringTaskResults(repo, "npm test", table)).results.size,
    0,
  );
  assert.equal((await coveringGateCheck(repo, "npm test", [])).row, undefined);
  const { requireGateClaims } = await import("./lib/handoff-ledger.mjs");
  await assert.rejects(
    () =>
      requireGateClaims(repo, {
        checked: true,
        claims: { plain: ["5"], review: [], document: [] },
      }),
    /no passing complete npm test row/u,
  );
  const first = await runGate(["--serial"], repo, { table });
  assert.equal(first.exitCode, 0);
  assert.deepEqual(observed(), ["build", "alpha", "beta"]);
  const second = await runGate(["--serial"], repo, { table });
  assert.equal(second.reusedSuites, 3);
  assert.deepEqual(observed(), ["build", "alpha", "beta"]);
  assert.ok(
    second.taskTimeline.every((row) => row.sourceRow.location === "worktree"),
  );
});

test("WO-186 VER-001 a pass carried from main has no execution to stand on while main cannot be consulted", async (t) => {
  const { repo, table, observed } = taskReuseFixture(t);
  await runGate(["--serial", "--again"], repo, { table });
  const worktree = join(dirname(repo), `${repo.split("/").at(-1)}-orphaned`);
  t.after(() => rmSync(worktree, { recursive: true, force: true }));
  runGit(repo, ["worktree", "add", "-q", "-b", "work", worktree]);
  const carried = await runGate(["--serial"], worktree, { table });
  assert.equal(carried.reusedSuites, 3);
  const { requireGateClaims } = await import("./lib/handoff-ledger.mjs");
  const ledger = {
    checked: true,
    claims: { plain: ["5"], review: [], document: [] },
  };
  assert.deepEqual((await requireGateClaims(worktree, ledger)).advisories, []);
  // The primary checkout leaves main, so no checkout answers for it.
  runGit(repo, ["checkout", "-q", "-b", "parked"]);
  await assert.rejects(
    () => requireGateClaims(worktree, ledger),
    /names build, alpha, beta, whose latest execution there can no longer be carried/u,
  );
  const rerun = await runGate(["--serial"], worktree, { table });
  assert.deepEqual(observed(worktree), ["build", "alpha", "beta"]);
  assert.equal(rerun.exitCode, 0);
  assert.equal(rerun.reusedSuites, 0);
  assert.deepEqual((await requireGateClaims(worktree, ledger)).advisories, []);
});

test("WO-186 code changing between partial lookup and preflight discards every old-identity pass", async (t) => {
  const { repo, table, observed } = taskReuseFixture(t);
  writeFileSync(join(repo, "fail-beta"), "fail\n");
  const first = await runGate(["--serial", "--again"], repo, { table });
  assert.equal(first.exitCode, 1);
  assert.equal(first.identityUnchanged, true);
  rmSync(join(repo, "fail-beta"));
  const selection = table.map((row) =>
    row.name === "beta" ? { ...row, needs: OUTSIDE_CONFINEMENT } : row,
  );
  const before = observed().length;
  const second = await runGate(["--serial"], repo, {
    table: selection,
    sandbox: {
      env: { CHANGE_DURING_PREFLIGHT: "1" },
      markers: [
        {
          id: "fixture-change",
          env: "CHANGE_DURING_PREFLIGHT",
          deniedDirectory() {
            writeFileSync(
              join(repo, "scripts/alpha.mjs"),
              readFileSync(join(repo, "scripts/alpha.mjs"), "utf8") +
                "// changed during preflight\n",
            );
            return repo;
          },
        },
      ],
    },
  });
  assert.equal(second.exitCode, 0);
  assert.notEqual(second.codeIdentity, first.codeIdentity);
  assert.equal(second.identityUnchanged, true);
  assert.equal(second.reusedSuites, 0);
  assert.deepEqual(observed().slice(before), ["build", "alpha", "beta"]);
  const { completeCoverage } = await import("./lib/suite-evidence.mjs");
  const mismatched = {
    name: "alpha",
    executed: true,
    exitCode: 0,
    reused: true,
    sourceRow: {
      task: "alpha",
      codeIdentity: first.codeIdentity,
      evidenceRef: first.evidenceRef,
      recordedAt: first.recordedAt,
    },
  };
  assert.equal(
    completeCoverage([{ name: "alpha" }], [mismatched], second.codeIdentity),
    false,
  );
  assert.equal(
    completeCoverage([{ name: "alpha" }], [mismatched], first.codeIdentity),
    true,
  );
});

test("WO-186 symbolic source aliases cannot reuse a key that omits ignored target bytes", async (t) => {
  const { repo, table } = taskReuseFixture(t);
  const first = await runGate(["--serial", "--again"], repo, { table });
  assert.equal(first.exitCode, 0);
  // This ignored target can change without entering Git's input inventory.
  symlinkSync("../observed.jsonl", join(repo, "scripts/new.mjs"));
  assert.throws(
    () => gateCodeIdentity(repo),
    /symbolic source aliases: scripts\/new\.mjs/,
  );
  await assert.rejects(
    () => runGate(["--serial"], repo, { table }),
    /symbolic source aliases/,
  );
  runGit(repo, ["add", "scripts/new.mjs"]);
  assert.throws(() => gateCodeIdentity(repo), /symbolic source aliases/);
  runGit(repo, [
    "-c",
    "maintenance.auto=false",
    "commit",
    "-qm",
    "unsupported symbolic fixture",
  ]);
  assert.throws(
    () => gateCodeIdentity(repo, "HEAD"),
    /symbolic source aliases/,
  );
});

test("WO-186 sibling advancement leaves merge-base selection and the review claim unchanged; own machinery still selects", async (t) => {
  const { repo, table } = taskReuseFixture(t);
  runGit(repo, ["update-ref", "refs/remotes/origin/main", "HEAD"]);
  const worktree = join(dirname(repo), `${repo.split("/").at(-1)}-selection`);
  t.after(() => rmSync(worktree, { recursive: true, force: true }));
  runGit(repo, ["worktree", "add", "-q", "-b", "work", worktree]);
  const runnerShim =
    `import {runGate} from ${JSON.stringify(new URL("./test-runner.mjs", import.meta.url).href)};\n` +
    `const result=await runGate(process.argv.slice(2),process.cwd(),{table:${JSON.stringify(table)}});process.exitCode=result.exitCode;\n`;
  writeFileSync(join(worktree, "scripts/test-runner.mjs"), runnerShim);
  const passing = await runGate(["--serial", "--review"], worktree, { table });
  const { requireGateClaims } = await import("./lib/handoff-ledger.mjs");
  const reviewLedger = {
    checked: true,
    claims: { plain: [], review: ["6"], document: [] },
  };
  const initialClaim = await requireGateClaims(worktree, reviewLedger);
  assert.deepEqual(initialClaim.advisories, []);
  const before = changedMachinery(worktree, table).map((row) => row.name);
  const { coveringGateCheck } = await import("./lib/gate-reuse.mjs");
  writeFileSync(join(repo, "scripts/machine.mjs"), "// sibling machinery\n");
  runGit(repo, [
    "-c",
    "maintenance.auto=false",
    "commit",
    "-qam",
    "sibling machinery",
  ]);
  runGit(repo, ["update-ref", "refs/remotes/origin/main", "HEAD"]);
  assert.deepEqual(
    changedMachinery(worktree, table).map((row) => row.name),
    before,
  );
  assert.equal(
    (await coveringGateCheck(worktree, "npm test", passing.requiredSuites)).row
      .codeIdentity,
    passing.codeIdentity,
  );
  const advancedClaim = await requireGateClaims(worktree, reviewLedger);
  assert.deepEqual(advancedClaim, initialClaim);
  writeFileSync(join(worktree, "scripts/machine.mjs"), "// own machinery\n");
  assert.deepEqual(
    changedMachinery(worktree, table).map((row) => row.name),
    ["machine"],
  );
  await assert.rejects(
    () => requireGateClaims(worktree, reviewLedger),
    /npm test -- --review/u,
  );
});

test("WO-112 a census that misses the held launcher retries and never reports the handshake exit", async (t) => {
  const { repo } = taskReuseFixture(t);
  const { registerProcess } = await import("./lib/host-resources.mjs");
  let misses = 0;
  const missing = (pid) => {
    throw new Error(`Cannot register exited process ${pid}`);
  };
  const recovered = await executeSuite(
    {
      name: "missed-twice",
      command: [process.execPath, "-e", "console.log('task ran')"],
      registerProcess: (...args) =>
        misses++ < 2 ? missing(args[1]) : registerProcess(...args),
    },
    repo,
  );
  assert.equal(recovered.exitCode, 0, recovered.output);
  assert.match(recovered.output, /task ran/u);
  assert.equal(misses, 3);
  const unseen = await executeSuite(
    {
      name: "never-seen",
      command: [process.execPath, "-e", "console.log('task ran')"],
      registerProcess: (...args) => missing(args[1]),
    },
    repo,
  );
  assert.equal(unseen.exitCode, 1, unseen.output);
  assert.equal(unseen.failureKind, "monitor-unavailable");
  assert.doesNotMatch(unseen.output, /task ran/u);
});

test("WO-186 product tasks reject reads of untracked active-order reports and retain the five longest cases", async (t) => {
  const { repo } = taskReuseFixture(t);
  mkdirSync(join(repo, "docs/evidence/WO-999"), { recursive: true });
  writeFileSync(join(repo, "docs/evidence/WO-999/report.md"), "live report\n");
  writeFileSync(
    join(repo, "scripts/read.mjs"),
    'import fs from "node:fs"; fs.readFileSync("docs/evidence/WO-999/report.md");\n',
  );
  const guarded = await executeSuite(
    {
      name: "read-report",
      product: true,
      activeOrder: "WO-999",
      command: [process.execPath, "scripts/read.mjs"],
    },
    repo,
  );
  assert.equal(guarded.exitCode, 1, guarded.output);
  assert.match(guarded.output, /reads docs\/evidence\/WO-999\/report.md/u);
  writeFileSync(
    join(repo, "scripts/read-metadata.mjs"),
    'import fs from "node:fs"; const file="docs/evidence/WO-999/report.md"; fs.existsSync(file); fs.statSync(file); await fs.promises.access(file);\n',
  );
  const metadata = await executeSuite(
    {
      name: "report-metadata",
      product: true,
      activeOrder: "WO-999",
      command: [process.execPath, "scripts/read-metadata.mjs"],
    },
    repo,
  );
  assert.equal(metadata.exitCode, 1, metadata.output);
  assert.equal(metadata.excludedReads, 3, metadata.output);
  assert.match(metadata.output, /existsSync/);
  assert.match(metadata.output, /statSync/);
  assert.match(metadata.output, /promises.access/);
  writeFileSync(
    join(repo, "scripts/duplicate-observer.mjs"),
    `import fs from "node:fs"; import cp from "node:child_process"; import assert from "node:assert/strict";
const exists=fs.existsSync, spawn=cp.spawnSync;
await import(${JSON.stringify(new URL("./lib/product-read-guard.mjs?same-manifest", import.meta.url).href)});
assert.equal(fs.existsSync,exists); assert.equal(cp.spawnSync,spawn);
cp.spawnSync(process.execPath,["-e","0"]);
fs.existsSync("docs/evidence/WO-999/report.md");
console.log("duplicate observer retains one installation");\n`,
  );
  const duplicate = await executeSuite(
    {
      name: "duplicate-observer",
      product: true,
      activeOrder: "WO-999",
      command: [process.execPath, "scripts/duplicate-observer.mjs"],
    },
    repo,
  );
  assert.equal(duplicate.exitCode, 1, duplicate.output);
  assert.match(duplicate.output, /duplicate observer retains one installation/);
  assert.equal(duplicate.excludedReads, 1, duplicate.output);
  const duplicateEvents = readFileSync(
    join(repo, duplicate.productReadLog),
    "utf8",
  )
    .trim()
    .split("\n")
    .map(JSON.parse);
  assert.equal(
    duplicateEvents.filter((event) => event.kind === "child-command").length,
    1,
  );
  writeFileSync(
    join(repo, "docs/evidence/WO-999/promised.md"),
    "promised metadata\n",
  );
  writeFileSync(
    join(repo, "scripts/read-descriptor.mjs"),
    `import fs from "node:fs";
const file="docs/evidence/WO-999/report.md";
const fd=fs.openSync(file,"a"); fs.fstatSync(fd); fs.closeSync(fd);
await new Promise((resolve,reject)=>fs.open(file,"a",(error,fd)=>{
  if(error)return reject(error);
  fs.fstat(fd,(error)=>fs.close(fd,(closed)=>error||closed?reject(error||closed):resolve()));
}));
const handle=await fs.promises.open("docs/evidence/WO-999/promised.md","a"); await handle.stat(); fs.fstatSync(handle.fd);
await new Promise((resolve,reject)=>fs.fstat(handle.fd,(error)=>error?reject(error):resolve()));
await handle.close();
`,
  );
  const descriptors = await executeSuite(
    {
      name: "report-descriptors",
      product: true,
      activeOrder: "WO-999",
      command: [process.execPath, "scripts/read-descriptor.mjs"],
    },
    repo,
  );
  assert.equal(descriptors.exitCode, 1, descriptors.output);
  assert.equal(descriptors.excludedReads, 5, descriptors.output);
  assert.match(descriptors.output, /fstatSync/);
  assert.match(descriptors.output, /\(fstat\)/);
  assert.match(descriptors.output, /FileHandle.stat/);
  assert.match(descriptors.output, /promised.md \(fstatSync\)/);
  assert.match(descriptors.output, /promised.md \(fstat\)/);
  symlinkSync("report.md", join(repo, "docs/evidence/WO-999/link"));
  writeFileSync(
    join(repo, "scripts/read-link-text.mjs"),
    `import fs from "node:fs"; const file="docs/evidence/WO-999/link";
fs.readlinkSync(file); await new Promise((resolve,reject)=>fs.readlink(file,(error)=>error?reject(error):resolve())); await fs.promises.readlink(file);\n`,
  );
  const linkText = await executeSuite(
    {
      name: "report-link-text",
      product: true,
      activeOrder: "WO-999",
      command: [process.execPath, "scripts/read-link-text.mjs"],
    },
    repo,
  );
  assert.equal(linkText.exitCode, 1, linkText.output);
  for (const method of ["readlinkSync", "readlink", "promises.readlink"])
    assert.ok(linkText.output.includes("(" + method + ")"), linkText.output);
  writeFileSync(
    join(repo, "scripts/copy-report.mjs"),
    `import fs from "node:fs"; const file="docs/evidence/WO-999/report.md";
fs.copyFileSync(file,"copy-sync.txt"); fs.cpSync(file,"cp-sync.txt");
await new Promise((resolve,reject)=>fs.copyFile(file,"copy-callback.txt",(error)=>error?reject(error):resolve()));
await new Promise((resolve,reject)=>fs.cp(file,"cp-callback.txt",(error)=>error?reject(error):resolve()));
await fs.promises.copyFile(file,"copy-promise.txt"); await fs.promises.cp(file,"cp-promise.txt");\n`,
  );
  const copies = await executeSuite(
    {
      name: "copy-reports",
      product: true,
      activeOrder: "WO-999",
      command: [process.execPath, "scripts/copy-report.mjs"],
    },
    repo,
  );
  assert.equal(copies.exitCode, 1, copies.output);
  for (const method of [
    "copyFileSync",
    "cpSync",
    "copyFile",
    "cp",
    "promises.copyFile",
    "promises.cp",
  ])
    assert.ok(copies.output.includes("(" + method + ")"), copies.output);
  mkdirSync(join(repo, "docs/evidence/WO-999/subdir"));
  symlinkSync("docs/evidence/WO-999/subdir", join(repo, "read-alias"));
  symlinkSync("docs/evidence/WO-999", join(repo, "report-alias"));
  symlinkSync(
    "docs/evidence/WO-999/dangling-target.md",
    join(repo, "dangling-report"),
  );
  symlinkSync(
    "docs/evidence/WO-999/not-yet-created-dir",
    join(repo, "dangling-dir"),
  );
  writeFileSync(
    join(repo, "scripts/read-aliases.mjs"),
    'import fs from "node:fs"; fs.readFileSync("read-alias/../report.md"); fs.existsSync("report-alias/not-yet-written.md"); fs.existsSync("dangling-report"); fs.existsSync("dangling-dir/");\n',
  );
  const aliases = await executeSuite(
    {
      name: "report-aliases",
      product: true,
      activeOrder: "WO-999",
      command: [process.execPath, "scripts/read-aliases.mjs"],
    },
    repo,
  );
  assert.equal(aliases.exitCode, 1, aliases.output);
  assert.ok(aliases.excludedReads >= 2, aliases.output);
  assert.match(
    aliases.output,
    /docs\/evidence\/WO-999\/report.md \(readFileSync\)/,
  );
  assert.match(aliases.output, /docs\/evidence\/WO-999\/not-yet-written.md/);
  assert.match(
    aliases.output,
    /docs\/evidence\/WO-999\/dangling-target.md \(existsSync\)/,
  );
  assert.match(
    aliases.output,
    /docs\/evidence\/WO-999\/not-yet-created-dir \(existsSync\)/,
  );
  writeFileSync(
    join(repo, "scripts/cases.test.mjs"),
    'import test from "node:test"; for(let n=0;n<6;n++)test("case " + n, async()=>{await new Promise(r=>setTimeout(r,20+n*30));});\n',
  );
  const measured = await executeSuite(
    {
      name: "cases",
      command: [process.execPath, "--test", "scripts/cases.test.mjs"],
    },
    repo,
  );
  assert.equal(measured.exitCode, 0, measured.output);
  assert.equal(measured.slowestCases.length, 5);
  assert.ok(
    measured.slowestCases.every(
      (row) => row.durationMs >= 8 && row.exitCode === 0,
    ),
  );
  assert.deepEqual(
    measured.slowestCases.map((row) => row.name),
    ["case 5", "case 4", "case 3", "case 2", "case 1"],
  );
});

test("WO-186 VER-001 product tasks reject recursive listings, watches and copies from the root or an ancestor, and blob and link reads of records", async (t) => {
  // A private parent keeps the ancestor walk small and owned by the fixture.
  const parent = realpathSync(
    createFixtureRoot(join(tmpdir(), "dotln-read-ancestor-")),
  );
  t.after(() => rmSync(parent, { recursive: true, force: true }));
  const repo = join(parent, "repo");
  mkdirSync(join(repo, "docs/evidence/WO-999"), { recursive: true });
  mkdirSync(join(repo, "scripts"));
  mkdirSync(join(repo, "out"));
  runGit(repo, ["init", "-q", "-b", "main"]);
  excludeFixtureOwnership(repo);
  writeFileSync(join(repo, ".gitignore"), "docs/control/local/\nout/\n");
  writeFileSync(join(repo, "docs/evidence/WO-999/report.md"), "live report\n");
  writeFileSync(join(repo, "docs/input.md"), "tracked document\n");
  const settle =
    "const settle = (start) => new Promise((resolve, reject) => start((error, value) => (error ? reject(error) : resolve(value))));\n";
  writeFileSync(
    join(repo, "scripts/enumerate.mjs"),
    `import fs from "node:fs";
const recursive = { recursive: true };
${settle}for (const target of [".", ".."]) {
  fs.readdirSync(target, recursive);
  await settle((done) => fs.readdir(target, recursive, done));
  await fs.promises.readdir(target, recursive);
  fs.opendirSync(target, recursive).closeSync();
  await (await settle((done) => fs.opendir(target, recursive, done))).close();
  await (await fs.promises.opendir(target, recursive)).close();
}
`,
  );
  // The same calls without a descent list nothing below the root's entries.
  // A copied or linked excluded tracked input is outside the observed
  // boundary, which product 07 states.
  writeFileSync(
    join(repo, "scripts/list.mjs"),
    `import fs from "node:fs";
${settle}for (const target of [".", ".."]) {
  fs.readdirSync(target);
  fs.readdirSync(target, { withFileTypes: true });
  await settle((done) => fs.readdir(target, done));
  await fs.promises.readdir(target);
  fs.opendirSync(target).closeSync();
  await (await settle((done) => fs.opendir(target, done))).close();
  await (await fs.promises.opendir(target)).close();
  fs.watch(target).close();
}
fs.copyFileSync("docs/input.md", "out/input-copy.md");
fs.linkSync("docs/input.md", "out/input-link.md");
`,
  );
  writeFileSync(
    join(repo, "scripts/forms.mjs"),
    `import fs from "node:fs";
${settle}const report = "docs/evidence/WO-999/report.md";
await (await fs.openAsBlob(report)).text();
await (await fs.openAsBlob("docs/input.md")).text();
fs.statfsSync(report);
await settle((done) => fs.statfs(report, done));
await fs.promises.statfs(report);
fs.linkSync(report, "out/link-sync");
await settle((done) => fs.link(report, "out/link-callback", done));
await fs.promises.link(report, "out/link-promise");
for (const copy of [
  () => fs.cpSync("..", "out/copy-sync", { recursive: true, filter: () => false }),
  () => settle((done) => fs.cp("..", "out/copy-callback", { recursive: true, filter: () => false }, done)),
  () => fs.promises.cp("..", "out/copy-promise", { recursive: true, filter: () => false }),
])
  try {
    await copy();
  } catch {
    // Node refuses a copy into its own source; the attempt is the read.
  }
// A record moved away could be read under another name; each is moved back.
fs.renameSync(report, "out/moved");
fs.renameSync("out/moved", report);
await settle((done) => fs.rename(report, "out/moved", done));
fs.renameSync("out/moved", report);
await fs.promises.rename(report, "out/moved");
fs.renameSync("out/moved", report);
`,
  );
  // Recursive watches. Where Node walks the tree itself to watch it, the
  // walk's own listings are recorded too, so these are judged by inclusion.
  writeFileSync(
    join(repo, "scripts/watches.mjs"),
    `import fs from "node:fs";
fs.watch(".", { recursive: true }).close();
fs.watch("docs", { recursive: true }).close();
const stop = new AbortController();
fs.promises.watch("..", { recursive: true, signal: stop.signal });
stop.abort();
`,
  );
  // Other spellings of the same reads: a byte view and a URL-shaped object as
  // the path, null open flags, and the native realpath behind the callback.
  writeFileSync(
    join(repo, "scripts/spellings.mjs"),
    `import fs from "node:fs";
${settle}const report = "docs/evidence/WO-999/report.md";
// Node 24 refuses a recursive listing of a byte path after the guard saw it,
// and each later spelling must still be judged.
try {
  fs.readdirSync(new TextEncoder().encode("."), { recursive: true });
} catch (error) {
  if (error.code !== "ERR_INVALID_ARG_TYPE") throw error;
}
const { href, protocol, hostname, pathname } = new URL(report, "file://" + process.cwd() + "/");
fs.readFileSync({ href, protocol, hostname, pathname });
fs.closeSync(fs.openSync(report, null));
await settle((done) => fs.realpath.native(report, done));
`,
  );
  runGit(repo, ["add", ".gitignore", "scripts", "docs/input.md"]);
  const run = (name, script) =>
    executeSuite(
      {
        name,
        product: true,
        activeOrder: "WO-999",
        command: [process.execPath, script],
      },
      repo,
    );
  const reads = (result) =>
    result.output
      .split("\n")
      .filter((line) => line.startsWith("Product read guard: <module setup>"))
      .map((line) => / reads (\S+) \(([^)]+)\)/u.exec(line).slice(1).join(" "))
      .sort();
  const plain = await run("plain-root-listing", "scripts/list.mjs");
  assert.equal(plain.exitCode, 0, plain.output);
  assert.equal(plain.excludedReads, 0);
  const enumerated = await run(
    "recursive-enumeration",
    "scripts/enumerate.mjs",
  );
  assert.equal(enumerated.exitCode, 1, enumerated.output);
  assert.deepEqual(
    reads(enumerated),
    [".", ".."]
      .flatMap((target) =>
        [
          "readdirSync",
          "readdir",
          "promises.readdir",
          "opendirSync",
          "opendir",
          "promises.opendir",
        ].map((method) => `${target} ${method}`),
      )
      .sort(),
  );
  const forms = await run("adjacent-forms", "scripts/forms.mjs");
  assert.equal(forms.exitCode, 1, forms.output);
  assert.deepEqual(
    reads(forms),
    [
      ".. cp",
      ".. cpSync",
      ".. promises.cp",
      "docs/evidence/WO-999/report.md link",
      "docs/evidence/WO-999/report.md linkSync",
      "docs/evidence/WO-999/report.md openAsBlob",
      "docs/evidence/WO-999/report.md promises.link",
      "docs/evidence/WO-999/report.md promises.rename",
      "docs/evidence/WO-999/report.md promises.statfs",
      "docs/evidence/WO-999/report.md rename",
      "docs/evidence/WO-999/report.md renameSync",
      "docs/evidence/WO-999/report.md statfs",
      "docs/evidence/WO-999/report.md statfsSync",
      "docs/input.md openAsBlob",
    ].sort(),
  );
  const watches = await run("recursive-watches", "scripts/watches.mjs");
  assert.equal(watches.exitCode, 1, watches.output);
  for (const watch of [". watch", ".. promises.watch", "docs watch"])
    assert.ok(reads(watches).includes(watch), watches.output);
  const spellings = await run("other-spellings", "scripts/spellings.mjs");
  assert.equal(spellings.exitCode, 1, spellings.output);
  assert.deepEqual(reads(spellings), [
    ". readdirSync",
    "docs/evidence/WO-999/report.md openSync",
    "docs/evidence/WO-999/report.md readFileSync",
    "docs/evidence/WO-999/report.md realpath.native",
  ]);
});

test("WO-186 planning performance excludes reused zero durations, compares earlier medians and holds above half growth", async () => {
  const { gatePerformanceConditions } =
    await import("./lib/planning-conditions.mjs");
  const checks = Array.from({ length: 4 }, (_, i) => ({
    checkId: "npm test",
    executed: true,
    exitCode: 0,
    recordedAt: `2026-10-0${i + 1}T00:00:00Z`,
    durationMs: 400000,
    evidenceRef: "fixture:" + i,
    gateSelection: "plain",
    executionMode: "fresh",
    taskTimeline: Array.from({ length: 6 }, (_, n) => ({
      name: "task " + n,
      executed: true,
      exitCode: 0,
      durationMs: i === 3 ? 2000 + n * 100 : 1000 + n * 10,
    })),
  }));
  checks.push({
    ...checks.at(-1),
    recordedAt: "2026-10-05T00:00:00Z",
    durationMs: 0,
    reused: true,
    taskTimeline: checks
      .at(-1)
      .taskTimeline.map((row) => ({ ...row, durationMs: 0, reused: true })),
  });
  const rows = gatePerformanceConditions(checks, "2026-10-06T00:00:00Z");
  assert.equal(rows.length, 6);
  assert.equal(rows[0].value, 400);
  assert.equal(rows[0].holds, true);
  assert.deepEqual(
    rows.slice(1).map((row) => row.id),
    [
      "gate-task:task 5",
      "gate-task:task 4",
      "gate-task:task 3",
      "gate-task:task 2",
      "gate-task:task 1",
    ],
  );
  assert.ok(
    rows.slice(1).every((row) => row.holds === true && row.samples === 3),
  );
  assert.equal(rows[1].median, 1.05);
  const failed = {
    ...checks[3],
    exitCode: 1,
    recordedAt: "2026-10-05T12:00:00Z",
    taskTimeline: checks[3].taskTimeline.map((task) =>
      task.name === "task 5"
        ? { ...task, durationMs: 6000 }
        : { ...task, exitCode: 1 },
    ),
  };
  const includingFailed = gatePerformanceConditions(
    [...checks, failed],
    "2026-10-06T00:00:00Z",
  );
  assert.equal(
    includingFailed[0].value,
    400,
    "failed whole gates are not fresh plain passes",
  );
  assert.equal(includingFailed[1].id, "gate-task:task 5");
  assert.equal(includingFailed[1].value, 6);
  assert.equal(includingFailed[1].samples, 4);
  assert.equal(includingFailed[1].median, 1.05);
  assert.equal(includingFailed[1].holds, true);
});

test("WO-276 criterion D7: the complete-run condition takes a fresh passing row of the review selection as its sample, names the selection, and reads no per-task row for a task that row does not hold", async () => {
  const { gatePerformanceConditions } =
    await import("./lib/planning-conditions.mjs");
  const task = (name, durationMs) => ({
    name,
    executed: true,
    exitCode: 0,
    durationMs,
  });
  const row = (day, selection, tasks, more = {}) => ({
    checkId: "npm test",
    executed: true,
    exitCode: 0,
    recordedAt: `2026-10-0${day}T00:00:00Z`,
    durationMs: 3_000_000,
    evidenceRef: `fixture:${day}`,
    gateSelection: selection,
    executionMode: "fresh",
    taskTimeline: tasks,
    ...more,
  });
  const checks = [
    // A single-suite row and a failed review row are no complete run; the
    // tasks they ran are samples all the same.
    row(1, "single", [task("kept", 1000), task("renamed-away", 9000)]),
    row(2, "review", [task("kept", 1000), task("renamed-away", 9000)], {
      exitCode: 1,
    }),
    row(3, "review", [task("kept", 1200), task("added", 500)]),
  ];
  const [complete, ...tasks] = gatePerformanceConditions(
    checks,
    "2026-10-04T00:00:00Z",
  );
  assert.equal(complete.id, "plain-gate");
  assert.deepEqual(complete.sampleRows, [
    { recordedAt: "2026-10-03T00:00:00Z", selection: "review", value: 3000 },
  ]);
  assert.equal(complete.samples, 1);
  assert.equal(complete.value, 3000);
  assert.equal(complete.holds, true);
  // The newest complete row holds `kept` and `added`: the task an earlier
  // row ran under a name that row no longer holds has no row.
  assert.deepEqual(
    tasks.map((entry) => entry.id),
    ["gate-task:kept", "gate-task:added"],
  );
  assert.equal(tasks[0].samples, 2);
  // Both selections are samples, each named; with no complete row there is
  // no sample and no per-task row.
  const both = gatePerformanceConditions(
    [...checks, row(4, "plain", [task("kept", 1100)], { durationMs: 400_000 })],
    "2026-10-05T00:00:00Z",
  );
  assert.deepEqual(
    both[0].sampleRows.map((sample) => [sample.selection, sample.value]),
    [
      ["review", 3000],
      ["plain", 400],
    ],
  );
  assert.deepEqual(
    both.slice(1).map((entry) => entry.id),
    ["gate-task:kept"],
  );
  const none = gatePerformanceConditions(
    checks.slice(0, 2),
    "2026-10-04T00:00:00Z",
  );
  assert.equal(none.length, 1);
  assert.equal(none[0].value, null);
  assert.equal(
    none[0].unavailable,
    "no fresh complete rows of the plain or the review selection in thirty days",
  );
});

test("WO-186 concurrent duplicate names and runtime skip/todo clear at execution completion", async (t) => {
  const { repo } = taskReuseFixture(t);
  writeFileSync(
    join(repo, "scripts/concurrent.test.mjs"),
    `import test from "node:test"; import {setTimeout as delay} from "node:timers/promises";
test("outer", {concurrency:true}, async(t)=>{
  await Promise.all([
    t.test("same", async()=>{await delay(180);}),
    t.test("same", async()=>{await delay(20);}),
    t.test("runtime skip", t=>t.skip()),
    t.test("runtime todo", t=>t.todo()),
  ]);
});\n`,
  );
  const measured = await executeSuite(
    {
      name: "concurrent",
      command: [process.execPath, "--test", "scripts/concurrent.test.mjs"],
    },
    repo,
  );
  assert.equal(measured.exitCode, 0, measured.output);
  const reports = [...measured.output.matchAll(/^PROGRESS CASE (.+)$/gm)].map(
    (match) => JSON.parse(match[1]),
  );
  const starts = reports.filter(
    (row) => row.event === "start" && row.name === "same",
  );
  assert.equal(starts.length, 2);
  assert.notEqual(starts[0].testId, starts[1].testId);
  assert.ok(
    starts.every((row) => row.entryFile === "scripts/concurrent.test.mjs"),
  );
  const ends = reports.filter(
    (row) => row.event === "end" && row.name === "same",
  );
  assert.equal(ends.length, 2);
  assert.equal(
    ends[0].testId,
    starts[1].testId,
    "fast later sibling completes before slow first sibling",
  );
  assert.equal(ends[1].testId, starts[0].testId);
  const active = new Map();
  for (const report of reports) {
    const key = JSON.stringify([report.entryFile, report.testId]);
    if (report.event === "start") active.set(key, report.name);
    else active.delete(key);
    if (report === ends[0])
      assert.equal(
        [...active.values()].filter((name) => name === "same").length,
        1,
      );
  }
  assert.equal(active.size, 0);
  for (const name of ["runtime skip", "runtime todo"])
    assert.ok(
      reports.some(
        (row) => row.name === name && row.event === "end" && row.skipped,
      ),
    );
  assert.ok(measured.slowestCases.every((row) => !/^runtime /.test(row.name)));
});

test("WO-186 VER-001 the heartbeat names a synchronous case while it runs, after an async one, and never a finished case", async (t) => {
  const { repo, observed } = taskReuseFixture(t);
  // Each body records its own window through a descriptor and functions taken
  // at load, which a mock cannot reach. A synchronous body blocks the test
  // process's event loop, as a spawnSync-heavy case does.
  const long = (label) =>
    `${label} with a name long enough that one heartbeat line holds a single case and no more`;
  writeFileSync(join(repo, "scripts/heartbeat-worker.mjs"), "");
  writeFileSync(
    join(repo, "scripts/heartbeat.test.mjs"),
    `import test from "node:test";
import fs from "node:fs";
import { Worker } from "node:worker_threads";
const out = fs.openSync("observed.jsonl", "a");
const write = fs.writeSync;
const mark = (name, edge) =>
  write(out, JSON.stringify({ name, edge, at: Date.now(), markers: process.env.DOTLN_CASE_MARKERS }) + "\\n");
const block = (ms) => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const long = ${long.toString()};
test("async first", async () => { mark("async first", "begin"); await wait(50); mark("async first", "finish"); });
test("sync one", () => { mark("sync one", "begin"); block(1200); mark("sync one", "finish"); });
test("outer", async (t) => {
  mark("outer", "begin");
  await t.test("inner sync", () => { mark("inner sync", "begin"); block(1200); mark("inner sync", "finish"); });
  mark("outer", "finish");
});
test("leaves writeFileSync mocked", async (t) => {
  mark("leaves writeFileSync mocked", "begin");
  t.mock.method(fs, "writeFileSync", () => {});
  await wait(400);
  mark("leaves writeFileSync mocked", "finish");
});
test("after the mock", () => { mark("after the mock", "begin"); block(1200); mark("after the mock", "finish"); });
test("outlives its worker", async () => {
  mark("outlives its worker", "begin");
  await new Promise((resolve, reject) =>
    new Worker(new URL("./heartbeat-worker.mjs", import.meta.url)).once("exit", resolve).once("error", reject));
  await wait(1200);
  mark("outlives its worker", "finish");
});
test(long("group"), { concurrency: true }, async (t) => {
  mark(long("group"), "begin");
  await Promise.all(["first", "second", "third", "fourth"].map((label) =>
    t.test(long(label), async () => { mark(long(label), "begin"); await wait(1200); mark(long(label), "finish"); })));
  mark(long("group"), "finish");
});
`,
  );
  // A second file runs in its own process beside the first.
  writeFileSync(
    join(repo, "scripts/heartbeat-peer.test.mjs"),
    `import test from "node:test";
import fs from "node:fs";
test("peer sync", () => {
  const mark = (edge) => fs.appendFileSync("observed.jsonl", JSON.stringify({ name: "peer sync", edge, at: Date.now() }) + "\\n");
  mark("begin");
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 1200);
  mark("finish");
});
`,
  );
  // Node publishes the test tracing channels these markers read on its 26
  // line and not at 24.15, where a case cannot be named while it runs.
  const namesCases = Number(process.versions.node.split(".")[0]) >= 26;
  const beats = [];
  const heard = [];
  const measured = await executeSuite(
    {
      name: "heartbeat",
      heartbeatMs: 300,
      command: [
        process.execPath,
        "--test",
        "scripts/heartbeat.test.mjs",
        "scripts/heartbeat-peer.test.mjs",
      ],
    },
    repo,
    900_000,
    ({ message }) => {
      heard.push(message);
      if (!/^running cases?: /u.test(message)) return;
      const at = Date.now();
      for (const [, name] of message.matchAll(
        /(?:: |; )([^;]+?) \(entered \d+ h \d+ min ago\)/gu,
      ))
        beats.push({ name, at });
    },
  );
  assert.equal(measured.exitCode, 0, measured.output);
  // The heartbeat prints the first eighty characters of a name.
  const shown = (name) => name.slice(0, 80);
  const windows = new Map();
  let markers;
  for (const row of observed().map((line) => JSON.parse(line))) {
    windows.set(shown(row.name), {
      ...windows.get(shown(row.name)),
      [row.edge]: row.at,
    });
    markers ??= row.markers;
  }
  // Every case that ran for the interval was named: a synchronous case after
  // an async one, a subtest and its open parent, a case after one that left
  // fs.writeFileSync mocked, a case that outlived a worker thread, five
  // long-named cases open at once, and a case in another file's process.
  if (namesCases)
    for (const name of [
      "sync one",
      "outer",
      "inner sync",
      "after the mock",
      "outlives its worker",
      ...["group", "first", "second", "third", "fourth"].map(long),
      "peer sync",
    ])
      assert.ok(
        beats.some((beat) => beat.name === shown(name)),
        `${name} was never named: ${JSON.stringify(beats)}`,
      );
  // Without the channels the heartbeat says so and reports the last output.
  else if (!beats.length)
    assert.ok(
      heard.some((message) =>
        message.startsWith("no case marker from heartbeat yet; last report: "),
      ),
      heard.join("\n"),
    );
  // Whenever a case was named, its own body was running: no case is named
  // after it ended, the one whose end the mock would have swallowed included.
  for (const beat of beats) {
    const window = windows.get(beat.name);
    assert.ok(
      window && beat.at >= window.begin - 100 && beat.at <= window.finish + 100,
      `${beat.name} named outside its run: ${JSON.stringify({ beat, window })}`,
    );
  }
  // Reporter events still supply the durations.
  assert.equal(measured.slowestCases.length, 5);
  assert.ok(measured.slowestCases.every((row) => row.durationMs >= 1000));
  // A nested task keeps its marker in the completing gate's ledger. Without
  // a gate, explicit task teardown removes the marker immediately.
  assert.match(markers, /dotln-case-markers-/u);
  const markerRoot = dirname(markers);
  if (process.env.DOTLN_TEMP_GATE_REPOSITORY) {
    const marker = readTemporaryOwner(markerRoot);
    assert.equal(marker?.class, "gate-fixture");
    assert.equal(
      marker.owner.repository,
      realpathSync(process.env.DOTLN_TEMP_GATE_REPOSITORY),
    );
    assert.equal(marker.owner.gateId, process.env.DOTLN_TEMP_GATE);
    assert.equal(marker.owner.suite, process.env.DOTLN_TEMP_SUITE);
    assert.ok(
      registeredTemporaryRoots(marker.owner.repository).some(
        (entry) => entry.path === markerRoot && entry.token === marker.token,
      ),
    );
  } else assert.equal(existsSync(markerRoot), false);
  // A test process that dies inside a case leaves a start marker with no
  // end. The heartbeat drops it with the process and names what still runs.
  writeFileSync(
    join(repo, "scripts/heartbeat-dies.test.mjs"),
    'import test from "node:test";\ntest("dies inside", () => { process.kill(process.pid, "SIGKILL"); });\n',
  );
  writeFileSync(
    join(repo, "scripts/heartbeat-survives.test.mjs"),
    'import test from "node:test";\ntest("survivor", () => { Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 1500); });\n',
  );
  const orphaned = [];
  const died = await executeSuite(
    {
      name: "dies",
      heartbeatMs: 300,
      command: [
        process.execPath,
        "--test",
        "scripts/heartbeat-dies.test.mjs",
        "scripts/heartbeat-survives.test.mjs",
      ],
    },
    repo,
    900_000,
    ({ message }) => orphaned.push(message),
  );
  assert.equal(died.exitCode, 1);
  if (namesCases)
    assert.ok(
      orphaned.some((message) =>
        /^running cases?: .*survivor \(/u.test(message),
      ),
      orphaned.join("\n"),
    );
  assert.equal(
    orphaned.some((message) =>
      /^running cases?: .*dies inside \(/u.test(message),
    ),
    false,
    orphaned.join("\n"),
  );
  // A task that reports no cases is never given one.
  const plain = [];
  const quiet = await executeSuite(
    {
      name: "plain",
      heartbeatMs: 150,
      command: [process.execPath, "-e", "setTimeout(() => {}, 600)"],
    },
    repo,
    900_000,
    ({ message }) => plain.push(message),
  );
  assert.equal(quiet.exitCode, 0, quiet.output);
  assert.ok(plain.some((message) => /^running task: plain /u.test(message)));
  assert.equal(
    plain.some((message) => /running case/u.test(message)),
    false,
  );
  // The interval is a fixture control; a declared table cannot carry it.
  assert.throws(
    () =>
      validateSuites([
        { name: "build", build: true, command: ["build"] },
        { name: "slow", command: ["slow"], heartbeatMs: 10 },
      ]),
    /Heartbeat interval is a fixture control: slow/u,
  );
});

test("WO-186 excluded license pins fail their document-routed check and outward vocabulary stays in the product identity", async (t) => {
  const { repo } = taskReuseFixture(t);
  const { licenseSurfaceRules } = await import("./license-surfaces.mjs");
  mkdirSync(join(repo, "docs"), { recursive: true });
  mkdirSync(join(repo, "packages/fixture"), { recursive: true });
  writeFileSync(join(repo, "package.json"), '{"private":false}\n');
  writeFileSync(
    join(repo, "packages/fixture/package.json"),
    '{"name":"fixture","version":"0.0.1","private":false}\n',
  );
  for (const file of ["LICENSE", "LICENSE-docs", "NOTICE", "docs/LEGAL.md"])
    cpSync(join(root, file), join(repo, file));
  const pins = (rules) =>
    rules.filter((row) => row.line.includes("docs/LEGAL.md"));
  assert.ok(pins(licenseSurfaceRules(repo)).every((row) => row.pass));
  const identity = gateCodeIdentity(repo);
  writeFileSync(
    join(repo, "docs/LEGAL.md"),
    readFileSync(join(repo, "docs/LEGAL.md"), "utf8").replace(
      /sha256:[a-f0-9]{64}/,
      "sha256:" + "0".repeat(64),
    ),
  );
  assert.equal(gateCodeIdentity(repo), identity);
  assert.ok(pins(licenseSurfaceRules(repo)).some((row) => !row.pass));
  for (const name of [
    "license-surfaces",
    "resume-docs",
    "resident-bind",
    "local-runner-double",
    "artifact-corpus",
  ]) {
    const suite = suites.find((row) => row.name === name);
    assert.equal(suite.document, true, name);
    assert.equal(suite.product, false, name);
  }
  mkdirSync(join(repo, "docs/control"), { recursive: true });
  writeFileSync(
    join(repo, "docs/control/outward-vocabulary.json"),
    '["first"]\n',
  );
  const vocabulary = gateCodeIdentity(repo);
  writeFileSync(
    join(repo, "docs/control/outward-vocabulary.json"),
    '["second"]\n',
  );
  assert.notEqual(gateCodeIdentity(repo), vocabulary);
  for (const name of ["github-body", "outward-lint", "target-publish"])
    assert.equal(suites.find((row) => row.name === name).product, true, name);
});

test("WO-186 a failed release case reruns alone after its passed disposable template has gone", async (t) => {
  const { repo, table, observed } = taskReuseFixture(t);
  writeFileSync(
    join(repo, ".gitignore"),
    readFileSync(join(repo, ".gitignore"), "utf8") + "fail-release\n",
  );
  writeFileSync(
    join(repo, "scripts/test-release.sh"),
    `#!/bin/bash
set -eu
release_case_good() {
  :
}
release_case_bad() {
  :
}
if [[ "$1" == --prepare-template ]]; then
  printf 'prepare\\n' >> observed.jsonl
  mkdir -p "$2"
elif [[ "$1" == --case ]]; then
  printf '%s\\n' "$2" >> observed.jsonl
  if [[ "$2" == bad && -f fail-release ]]; then exit 1; fi
fi
`,
  );
  runGit(repo, ["add", "."]);
  runGit(repo, [
    "-c",
    "maintenance.auto=false",
    "commit",
    "-qm",
    "release reuse fixture",
  ]);
  const selection = [
    table[0],
    {
      name: "release",
      product: true,
      command: ["bash", "scripts/test-release.sh"],
    },
  ];
  writeFileSync(join(repo, "fail-release"), "fail\n");
  const first = await runGate(["--again", "--serial"], repo, {
    table: selection,
  });
  assert.equal(first.exitCode, 1);
  assert.deepEqual(observed(), ["build", "prepare", "good", "bad"]);
  rmSync(join(repo, "fail-release"));
  const second = await runGate(["--serial"], repo, { table: selection });
  assert.equal(second.exitCode, 0);
  assert.deepEqual(observed(), ["build", "prepare", "good", "bad", "bad"]);
  assert.equal(second.freshSuites, 1);
  assert.equal(second.reusedSuites, 3);
  const preparation = second.taskTimeline.find(
    (row) => row.name === "release:prepare",
  );
  assert.equal(preparation.sourceRow.recordedAt, first.recordedAt);
});

test("WO-186 FINAL-001 a fresh worktree's failed single-suite run displaces main's claim until the task passes", async (t) => {
  const { repo, table, observed } = taskReuseFixture(t);
  const { coveringGateCheck, coveringTaskResults } =
    await import("./lib/gate-reuse.mjs");
  const { requireGateClaims } = await import("./lib/handoff-ledger.mjs");
  const ledger = {
    checked: true,
    claims: { plain: ["3"], review: [], document: [] },
  };
  const main = await runGate(["--serial", "--again"], repo, { table });
  const index = join(repo, "docs/control/local/harness/checks.json");
  const mainBytes = readFileSync(index);
  const worktree = `${repo}-worktree`;
  t.after(() => rmSync(worktree, { recursive: true, force: true }));
  runGit(repo, ["worktree", "add", "-q", "-b", "work", worktree]);
  assert.equal(
    (await coveringGateCheck(worktree, "npm test", [])).location,
    "main",
  );
  assert.equal(
    (await requireGateClaims(worktree, ledger)).productGate.recordedAt,
    main.recordedAt,
  );
  writeFileSync(join(worktree, "fail-beta"), "fail\n");
  assert.equal(
    (await runGate(["--only", "beta", "--serial"], worktree, { table }))
      .exitCode,
    1,
  );
  const tasks = table.filter((row) => !row.machinery);
  assert.deepEqual(
    [
      ...(
        await coveringTaskResults(worktree, "npm test", tasks)
      ).results.keys(),
    ],
    ["build", "alpha"],
  );
  const refused = await coveringGateCheck(worktree, "npm test", []);
  assert.equal(refused.row, undefined);
  assert.deepEqual(refused.displaced.tasks, ["beta"]);
  await assert.rejects(
    () => requireGateClaims(worktree, ledger),
    /no passing complete npm test row stands[^]*beta/u,
  );
  // Recovery under the other check restores main's pass without creating a
  // local npm test row. This arrangement was absent from the failed review.
  rmSync(join(worktree, "fail-beta"));
  assert.equal(
    (await runGate(["--only", "beta", "--serial"], worktree, { table }))
      .exitCode,
    0,
  );
  assert.deepEqual((await requireGateClaims(worktree, ledger)).advisories, []);
  assert.equal(
    (await coveringTaskResults(worktree, "npm test", tasks)).results.size,
    tasks.length,
  );
  assert.ok(
    readGateChecks(worktree).every((row) => row.checkId !== "npm test"),
  );
  // A second failure must still make the next plain run execute beta alone.
  writeFileSync(join(worktree, "fail-beta"), "fail again\n");
  await runGate(["--only", "beta", "--serial"], worktree, { table });
  const before = observed(worktree).length;
  const plain = await runGate(["--serial"], worktree, { table });
  assert.equal(plain.exitCode, 1);
  assert.deepEqual(observed(worktree).slice(before), ["beta"]);
  assert.deepEqual(readFileSync(index), mainBytes);
});

test("WO-186 FINAL-001 runner and claim agree over local/main and same/other-check histories", async (t) => {
  const { coveringGateCheck, coveringTaskResults } =
    await import("./lib/gate-reuse.mjs");
  for (const own of [false, true])
    for (const consultMain of [false, true])
      for (const checkId of ["npm test", "suite:beta"])
        for (const passed of [false, true])
          await t.test(
            JSON.stringify({ own, consultMain, checkId, passed }),
            async (cell) => {
              const { repo, table } = taskReuseFixture(cell);
              let worktree = repo;
              if (consultMain) {
                worktree = `${repo}-worktree`;
                cell.after(() =>
                  rmSync(worktree, { recursive: true, force: true }),
                );
                runGit(repo, ["worktree", "add", "-q", "-b", "work", worktree]);
              }
              const tasks = table.filter((row) => !row.machinery);
              const identity = gateCodeIdentity(worktree);
              const row = (at, id = "npm test", success = true) => ({
                checkId: id,
                codeIdentity: identity,
                treeHash: gateTreeHash(worktree),
                executed: true,
                exitCode: success ? 0 : 1,
                identityUnchanged: true,
                durationMs: 1,
                evidenceRef: `fixture:${at}:${id}`,
                recordedAt: new Date(at).toISOString(),
                requiredSuites:
                  id === "npm test" ? tasks.map((task) => task.name) : ["beta"],
                taskTimeline: (id === "npm test"
                  ? tasks
                  : tasks.filter((task) => task.name === "beta")
                ).map((task) => ({
                  name: task.name,
                  executed: true,
                  exitCode: task.name === "beta" && !success ? 1 : 0,
                  durationMs: 1,
                  finishedAt: new Date(at).toISOString(),
                })),
              });
              if (consultMain) recordGateChecks(repo, [row(1000)]);
              if (own) recordGateChecks(worktree, [row(2000)]);
              recordGateChecks(worktree, [row(3000, checkId, passed)]);
              const carried = await coveringTaskResults(
                worktree,
                "npm test",
                tasks,
              );
              const claim = await coveringGateCheck(
                worktree,
                "npm test",
                tasks.map((task) => task.name),
              );
              assert.equal(
                Boolean(claim.row),
                carried.results.size === tasks.length,
              );
              assert.equal(
                carried.results.has("beta"),
                passed && (own || consultMain || checkId === "npm test"),
              );
            },
          );
});

test("WO-186 FINAL-001 identity and consulted-index errors retain an explicit unproved-claim advisory", async (t) => {
  const { repo, table } = taskReuseFixture(t);
  const { requireGateClaims } = await import("./lib/handoff-ledger.mjs");
  const ledger = {
    checked: true,
    claims: { plain: ["3"], review: [], document: [] },
  };
  await runGate(["--serial", "--again"], repo, { table });
  symlinkSync("../fail-beta", join(repo, "scripts/new.mjs"));
  await assert.rejects(
    () => runGate(["--serial"], repo, { table }),
    /symbolic source aliases/u,
  );
  const symbolic = await requireGateClaims(repo, ledger, {
    log: { warn() {} },
  });
  assert.equal(symbolic.productGate, undefined);
  assert.equal(symbolic.advisories.length, 1);
  assert.match(
    symbolic.advisories[0],
    /symbolic source aliases[^]*criterion 3 is recorded as stated/u,
  );
  rmSync(join(repo, "scripts/new.mjs"));
  const worktree = `${repo}-worktree`;
  t.after(() => rmSync(worktree, { recursive: true, force: true }));
  runGit(repo, ["worktree", "add", "-q", "-b", "work", worktree]);
  writeFileSync(join(repo, "docs/control/local/harness/checks.json"), "{");
  const unreadable = await requireGateClaims(worktree, ledger, {
    log: { warn() {} },
  });
  assert.equal(unreadable.productGate, undefined);
  assert.equal(unreadable.advisories.length, 1);
  assert.match(
    unreadable.advisories[0],
    /Gate index unavailable:[^]*criterion 3 is recorded as stated/u,
  );
});

test("WO-186 FINAL-001 case duration reports leave live diagnostic and suite progress slots available", async (t) => {
  const { repo } = taskReuseFixture(t);
  writeFileSync(
    join(repo, "scripts/many.test.mjs"),
    'import test from "node:test"; import assert from "node:assert/strict"; for(let n=0;n<55;n++)test("passing case "+n,()=>{}); test("late failure",()=>assert.fail("planted late failure"));\n',
  );
  const reporter = new URL("./lib/case-reporter.mjs", import.meta.url).href;
  writeFileSync(
    join(repo, "scripts/report-driver.mjs"),
    `import {spawnSync} from "node:child_process";
const run=spawnSync(process.execPath,["--test","--test-reporter=tap",${JSON.stringify("--test-reporter=" + reporter)},"--test-reporter-destination=stdout","--test-reporter-destination=stdout","scripts/many.test.mjs"],{stdio:"inherit"});
console.log("PROGRESS suite-owned diagnostic after cases"); process.exitCode=run.status;
`,
  );
  const progress = [];
  const result = await executeSuite(
    {
      name: "many-cases",
      command: [process.execPath, "scripts/report-driver.mjs"],
    },
    repo,
    10000,
    ({ message }) => progress.push(message),
  );
  assert.equal(result.exitCode, 1);
  assert.equal(result.slowestCases.length, 5);
  assert.ok(
    progress.some((line) => /not ok \d+ - late failure/u.test(line)),
    progress.join("\n"),
  );
  assert.ok(
    progress.includes("PROGRESS suite-owned diagnostic after cases"),
    progress.join("\n"),
  );
  assert.equal(
    progress.some((line) => line.startsWith("PROGRESS CASE ")),
    false,
  );
  assert.ok(result.slowestCases.some((row) => row.exitCode === 1));
});

test("WO-186 FINAL-001 callback opens without flags observe the default read and register descriptor metadata", async (t) => {
  const { repo } = taskReuseFixture(t);
  mkdirSync(join(repo, "docs/evidence/WO-999"), { recursive: true });
  writeFileSync(join(repo, "docs/evidence/WO-999/report.md"), "report\n");
  for (const metadata of [false, true]) {
    writeFileSync(
      join(repo, "scripts/open-default.mjs"),
      `import fs from "node:fs";
await new Promise((done,fail)=>fs.open("docs/evidence/WO-999/report.md",(e,fd)=>e?fail(e):(${metadata ? "fs.fstatSync(fd)," : ""}fs.close(fd,e=>e?fail(e):done()))));
console.log("default open finished");
`,
    );
    const result = await executeSuite(
      {
        name: "default-open",
        product: true,
        activeOrder: "WO-999",
        command: [process.execPath, "scripts/open-default.mjs"],
      },
      repo,
    );
    assert.equal(result.exitCode, 1, result.output);
    assert.equal(result.excludedReads, metadata ? 2 : 1, result.output);
    assert.match(result.output, /report.md \(open\)/u);
    if (metadata) assert.match(result.output, /report.md \(fstatSync\)/u);
    assert.match(result.output, /default open finished/u);
  }
});

test("WO-186 FINAL-001 another check's row-level failure displaces the tasks it executed", async (t) => {
  const { repo, table } = taskReuseFixture(t);
  const { coveringGateCheck, coveringTaskResults } =
    await import("./lib/gate-reuse.mjs");
  const clean = await runGate(["--serial", "--again"], repo, { table });
  const beta = clean.taskTimeline.find((row) => row.name === "beta");
  let at = Date.parse(clean.recordedAt);
  for (const failure of [
    { abandonedRoots: ["fixture:surviving-root"] },
    { buildOutputUnchanged: false },
    { memory: { failure: { kind: "fixture:memory" } } },
    { identityUnchanged: false },
    { timedOut: true },
  ]) {
    const observation = (extra) => {
      const time = new Date(++at).toISOString();
      return {
        ...clean,
        checkId: "suite:beta",
        requiredSuites: ["beta"],
        taskTimeline: [{ ...beta, finishedAt: time }],
        recordedAt: time,
        ...extra,
      };
    };
    recordGateChecks(repo, [observation({ ...failure, exitCode: 1 })]);
    const carried = await coveringTaskResults(repo, "npm test", table);
    assert.equal(carried.results.has("beta"), false, JSON.stringify(failure));
    const claim = await coveringGateCheck(repo, "npm test", []);
    assert.equal(claim.row, undefined, JSON.stringify(failure));
    assert.deepEqual(claim.displaced.tasks, ["beta"]);
    recordGateChecks(repo, [observation({ exitCode: 0 })]);
    assert.equal(
      (await coveringGateCheck(repo, "npm test", [])).row.recordedAt,
      clean.recordedAt,
    );
  }
});

test("WO-186 FINAL-001 machinery selection preserves removed, quoted and unlistable paths", async (t) => {
  await t.test("a staged rename retains the deleted exact source", () => {
    const { repo, table } = taskReuseFixture(t);
    runGit(repo, ["checkout", "-q", "-b", "work"]);
    runGit(repo, ["mv", "scripts/machine.mjs", "scripts/moved.mjs"]);
    assert.deepEqual(
      changedMachinery(repo, table, "main").map((row) => row.name),
      ["machine"],
    );
  });
  await t.test("a quoted filename retains its declared source prefix", () => {
    const { repo } = taskReuseFixture(t);
    const filename = "scripts/odd\nname.mjs";
    writeFileSync(join(repo, filename), "export const value=1;\n");
    runGit(repo, ["add", filename]);
    runGit(repo, [
      "-c",
      "maintenance.auto=false",
      "commit",
      "-qm",
      "quoted source fixture",
    ]);
    runGit(repo, ["checkout", "-q", "-b", "work"]);
    writeFileSync(join(repo, filename), "export const value=2;\n");
    assert.deepEqual(
      changedMachinery(
        repo,
        [{ name: "quoted", machinery: true, sources: ["scripts/"] }],
        "main",
      ).map((row) => row.name),
      ["quoted"],
    );
  });
  await t.test("an unavailable untracked listing selects all machinery", () => {
    const { repo } = taskReuseFixture(t);
    const bin = join(repo, "bin");
    mkdirSync(bin);
    const actualGit = execFileSync("/usr/bin/which", ["git"], {
      encoding: "utf8",
    }).trim();
    writeFileSync(
      join(bin, "git"),
      `#!/bin/sh\nif [ "$1" = ls-files ]; then exit 1; fi\nexec '${actualGit.replaceAll("'", "'\\''")}' "$@"\n`,
    );
    chmodSync(join(bin, "git"), 0o755);
    const prior = process.env.PATH;
    try {
      process.env.PATH = `${bin}:${prior}`;
      const table = [
        { name: "machine", machinery: true, sources: ["scripts/machine.mjs"] },
        { name: "second", machinery: true, sources: ["other/"] },
      ];
      assert.deepEqual(
        changedMachinery(repo, table, "main").map((row) => row.name),
        ["machine", "second"],
      );
    } finally {
      process.env.PATH = prior;
    }
  });
});

test("WO-186 FINAL-001 a reporter loads from a checkout with URL delimiter characters", async (t) => {
  const directory = createFixtureRoot(join(tmpdir(), "dotln-reporter-url-"));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  const checkout = join(directory, "checkout #?%");
  for (const entry of [
    "scripts",
    "packages/skeleton/src",
    "packages/beacons/src",
  ])
    cpSync(join(root, entry), join(checkout, entry), { recursive: true });
  writeFileSync(
    join(checkout, "scripts/url-case.test.mjs"),
    'import test from "node:test"; test("URL-safe case",()=>{});\n',
  );
  const copied = await import(
    pathToFileURL(join(checkout, "scripts/test-runner.mjs")).href
  );
  const result = await copied.executeSuite(
    {
      name: "url-case",
      command: [process.execPath, "--test", "scripts/url-case.test.mjs"],
    },
    checkout,
  );
  assert.equal(result.exitCode, 0, result.output);
  assert.ok(
    result.slowestCases.some((row) => row.name === "URL-safe case"),
    JSON.stringify(result.slowestCases),
  );
});

test("WO-186 legacy product-only rows remain visible to planning and an even sample median uses both middle observations", async () => {
  const { gatePerformanceConditions } =
    await import("./lib/planning-conditions.mjs");
  const row = {
    checkId: "npm test",
    executed: true,
    exitCode: 0,
    evidenceRef: "fixture:legacy",
    requiredSuites: ["build", "product"],
    taskTimeline: [],
    executionMode: "fresh",
  };
  const checks = [
    { ...row, recordedAt: "2026-10-01T00:00:00Z", durationMs: 300000 },
    { ...row, recordedAt: "2026-10-02T00:00:00Z", durationMs: 500000 },
    {
      ...row,
      recordedAt: "2026-10-03T00:00:00Z",
      durationMs: 900000,
      requiredSuites: ["build", "product", "machine"],
    },
  ];
  const conditions = gatePerformanceConditions(checks, "2026-10-04T00:00:00Z", {
    machinerySuites: ["machine"],
  });
  assert.equal(conditions[0].value, 400);
  assert.equal(conditions[0].samples, 2);
  assert.equal(conditions[0].holds, true);
});

test("format preflight stops plain and review before product tasks, and stays fresh across document edits", async (t) => {
  for (const selection of [[], ["--review"]]) {
    const { repo, table, observed } = taskReuseFixture(t);
    mkdirSync(join(repo, "node_modules"));
    cpSync(
      join(root, "node_modules/prettier"),
      join(repo, "node_modules/prettier"),
      { recursive: true },
    );
    writeFileSync(
      join(repo, ".gitignore"),
      readFileSync(join(repo, ".gitignore"), "utf8") + "node_modules/\n",
    );
    writeFileSync(
      join(repo, "package.json"),
      JSON.stringify({
        scripts: {
          "format:check":
            "node node_modules/prettier/bin/prettier.cjs --check scripts/format-subject.mjs README.md",
          format:
            "node node_modules/prettier/bin/prettier.cjs --write scripts/format-subject.mjs README.md",
        },
      }),
    );
    writeFileSync(
      join(repo, "scripts/format-subject.mjs"),
      "export const value={a:1};\n",
    );
    writeFileSync(join(repo, "README.md"), "# Fixture\n");
    const format = suites.find((row) => row.name === "format");
    const inventory = [format, ...table];
    const gate = (args = selection) =>
      runGate(["--serial", ...args], repo, { table: inventory });
    const started = Date.now();
    const failed = await gate();
    assert.equal(failed.exitCode, 1);
    assert.ok(Date.now() - started < 60_000);
    assert.deepEqual(observed(), []);
    const failure = failed.taskTimeline.find((row) => row.name === "format");
    const output = (row, check = failed) => {
      const value = check.cases.find((item) => item.name === row.name)?.output;
      assert.ok(
        value,
        `Nested gate has no output for ${row.name}: ${JSON.stringify(check.taskTimeline)}`,
      );
      return value;
    };
    assert.match(output(failure), /scripts\/format-subject\.mjs/);
    for (const task of failed.taskTimeline.filter(
      (row) => row.name !== "format",
    )) {
      assert.equal(task.executed, false);
      assert.match(output(task), /scripts\/format-subject\.mjs/);
      assert.match(
        output(task),
        /Run npm run format, then rerun this command\./,
      );
    }
    const formatted = spawnSync("npm", ["run", "format", "--silent"], {
      cwd: repo,
      encoding: "utf8",
    });
    assert.equal(formatted.status, 0, formatted.stdout + formatted.stderr);
    const passed = await gate();
    assert.equal(passed.exitCode, 0);
    assert.deepEqual(observed(), ["build", "alpha", "beta"]);
    assert.ok(
      Date.parse(
        passed.taskTimeline.find((row) => row.name === "build").startedAt,
      ) >=
        Date.parse(
          passed.taskTimeline.find((row) => row.name === "format").finishedAt,
        ),
    );
    const reused = await gate();
    assert.equal(reused.exitCode, 0);
    assert.equal(reused.executionMode, "composed");
    assert.equal(reused.freshReason, "always-fresh-preflight");
    assert.equal(
      reused.taskTimeline.find((row) => row.name === "format").reused,
      undefined,
    );
    assert.deepEqual(observed(), ["build", "alpha", "beta"]);
    writeFileSync(join(repo, "README.md"), "#   Fixture\n");
    assert.equal(gateCodeIdentity(repo), passed.codeIdentity);
    const documentFailure = await gate();
    assert.equal(documentFailure.exitCode, 1);
    assert.match(
      output(
        documentFailure.taskTimeline.find((row) => row.name === "format"),
        documentFailure,
      ),
      /README\.md/,
    );
    assert.deepEqual(observed(), ["build", "alpha", "beta"]);
    // Narrow selections keep the structural formatting preflight.
    for (const args of [["--only", "alpha"], ["--machinery"]]) {
      const narrow = await gate(args);
      assert.equal(narrow.exitCode, 1);
      assert.ok(narrow.requiredSuites.includes("format"));
    }
  }
});

test("lifecycle fixtures use the product preflight while historical record comparisons stay in the document gate", async (t) => {
  const lifecycle = suites.find((row) => row.name === "resume");
  const documents = suites.find((row) => row.name === "resume-docs");
  assert.equal(lifecycle.product, true);
  assert.equal(lifecycle.preflight, true);
  assert.equal(lifecycle.document, false);
  assert.deepEqual(lifecycle.args, ["--fixtures-only"]);
  assert.equal(documents.document, true);
  assert.equal(documents.product, false);
  assert.deepEqual(documents.args, ["--documents-only"]);
  for (const flag of ["--review", "--full"]) {
    const { repo, table, observed } = taskReuseFixture(t);
    const inventory = table.map((row) =>
      row.name === "beta"
        ? { ...row, name: "resume", preflight: lifecycle.preflight }
        : row,
    );
    writeFileSync(join(repo, "fail-beta"), "fail\n");
    const failed = await runGate([flag, "--serial", "--keep-going"], repo, {
      table: inventory,
    });
    assert.equal(failed.exitCode, 1);
    assert.deepEqual(observed(), ["build", "beta"]);
    assert.equal(
      failed.taskTimeline.find((row) => row.name === "alpha").executed,
      false,
    );
    rmSync(join(repo, "fail-beta"));
    const passed = await runGate([flag, "--serial"], repo, {
      table: inventory,
    });
    assert.equal(passed.exitCode, 0);
    const before = observed().length;
    mkdirSync(join(repo, "docs"), { recursive: true });
    writeFileSync(join(repo, "docs/report.md"), "Final report text.\n");
    const reused = await runGate([flag, "--serial"], repo, {
      table: inventory,
    });
    assert.equal(reused.codeIdentity, passed.codeIdentity);
    assert.equal(reused.exitCode, 0);
    assert.deepEqual(observed().slice(before), []);
  }
});

test("review composition retains source rows and reruns a task whose latest single-suite execution failed", async (t) => {
  const { repo, table, observed } = taskReuseFixture(t);
  writeFileSync(join(repo, "scripts/format.mjs"), "export {};\n");
  const inventory = [
    {
      ...suites.find((row) => row.name === "format"),
      command: [process.execPath, "scripts/format.mjs"],
    },
    ...table,
  ];
  runGit(repo, ["checkout", "-qb", "work"]);
  writeFileSync(
    join(repo, "scripts/machine.mjs"),
    readFileSync(join(repo, "scripts/machine.mjs"), "utf8") +
      "// changed machinery\n",
  );
  const gate = (args) =>
    runGate(["--serial", ...args], repo, { table: inventory });
  const plain = await gate([]);
  assert.equal(plain.exitCode, 0);
  const review = await gate(["--review"]);
  assert.equal(review.exitCode, 0);
  assert.equal(review.gateSelection, "review");
  assert.equal(review.executionMode, "composed");
  assert.deepEqual(review.requiredSuites, [
    "build",
    "format",
    "alpha",
    "beta",
    "machine",
  ]);
  for (const name of ["build", "alpha", "beta"]) {
    const task = review.taskTimeline.find((row) => row.name === name);
    assert.equal(task.reused, true);
    assert.equal(task.sourceRow.recordedAt, plain.recordedAt);
  }
  assert.deepEqual(observed(), ["build", "alpha", "beta", "machine"]);
  const second = await captureGate(["--serial", "--review"], repo, {
    table: inventory,
  });
  const onlyFormat = second.row;
  assert.equal(onlyFormat.exitCode, 0);
  // The machine suite changed on this branch and its row is reused whole at
  // the unchanged identity: the schedule line names it as reused, since it
  // does not run, and not as scheduled first (WO-284).
  assert.ok(
    second.lines.includes(
      "scheduled in declared order; reused at the code identity, not run again: machine",
    ),
    second.lines.join("\n"),
  );
  assert.ok(
    !second.lines.some((line) => line.startsWith("scheduled first:")),
    second.lines.join("\n"),
  );
  assert.equal(onlyFormat.executionMode, "composed");
  assert.equal(onlyFormat.gateSelection, "review");
  assert.equal(onlyFormat.freshReason, "always-fresh-preflight");
  assert.equal(onlyFormat.freshSuites, 1);
  assert.equal(onlyFormat.reusedSuites, 4);
  assert.deepEqual(onlyFormat.requiredSuites, review.requiredSuites);
  assert.deepEqual(observed(), ["build", "alpha", "beta", "machine"]);
  const fresh = await gate(["--review", "--again", ...WHY]);
  assert.equal(fresh.executionMode, "forced-fresh");
  assert.equal(fresh.reusedSuites, 0);
  writeFileSync(join(repo, "fail-beta"), "fail\n");
  const failed = await gate(["--only", "beta"]);
  assert.equal(failed.exitCode, 1);
  const before = observed().length;
  const retried = await gate(["--review"]);
  assert.equal(retried.exitCode, 1);
  assert.equal(retried.freshReason, "missing-passing-tasks");
  assert.equal(
    retried.taskTimeline.find((row) => row.name === "beta").reused,
    undefined,
  );
  assert.deepEqual(observed().slice(before), ["beta"]);
  rmSync(join(repo, "fail-beta"));
  const repaired = await gate(["--review"]);
  assert.equal(repaired.exitCode, 0);
  assert.equal(repaired.executionMode, "composed");
  t.diagnostic("review composition " + JSON.stringify(gateProof(review)));
});

test("structural tasks lead every selection exactly once before a suite or build starts", async () => {
  // Core's structural phase adds the recorded Git surface check before host.
  const { CORE_STRUCTURAL_TASKS: STRUCTURAL_TASKS } =
    await import("./test-runner.mjs");
  for (const flags of [
    [],
    ["--review"],
    ["--only", "runner-fixtures"],
    ["--machinery"],
    ["--document"],
  ]) {
    const { lines } = await captureGate([...flags, "--list"], root);
    const names = lines.map((line) => line.split(" — ")[0]);
    assert.deepEqual(names.slice(0, STRUCTURAL_TASKS.length), STRUCTURAL_TASKS);
    for (const name of STRUCTURAL_TASKS)
      assert.equal(names.filter((entry) => entry === name).length, 1);
    if (flags.includes("--document"))
      for (const name of [
        "meta",
        "index",
        "lineage",
        "release-surfaces",
        "harness",
        "authority-evidence",
        "artifact-evidence",
        "verification-evidence",
        "feedback-evidence",
        "harness-evidence",
        "publication",
      ])
        assert.ok(!names.includes(name), name);
  }
  // The table holds a structural row for each root's phase; this is core's,
  // without the configuration row an instance runs in its place.
  const selected = suites.filter(
    (row) =>
      (row.structural && STRUCTURAL_TASKS.includes(row.name)) ||
      ["build", "kernel"].includes(row.name),
  );
  for (const failure of STRUCTURAL_TASKS) {
    const started = [];
    await scheduleSuites(expandSuiteTasks(selected, root), {
      execute: async (row) => {
        started.push(row.name);
        return {
          name: row.name,
          exitCode: row.name === failure ? 1 : 0,
          executed: true,
        };
      },
    });
    assert.deepEqual(
      started,
      STRUCTURAL_TASKS.slice(0, STRUCTURAL_TASKS.indexOf(failure) + 1),
    );
  }
});

test("declarations diagnose missing suite imports and copied fixture inputs before execution", async (t) => {
  const { checkDeclarations } = await import("./structural-checks.mjs");
  const repo = createFixtureRoot(
    join(tmpdir(), "dotln-structural-declarations-"),
  );
  t.after(() => rmSync(repo, { recursive: true, force: true }));
  mkdirSync(join(repo, "scripts"));
  writeFileSync(join(repo, "scripts/entry.mjs"), 'import "./leaf.mjs";\n');
  writeFileSync(join(repo, "scripts/leaf.mjs"), "export {};\n");
  const table = [
    {
      name: "fixture-suite",
      machinery: true,
      command: [process.execPath, "scripts/entry.mjs"],
      sources: ["scripts/entry.mjs"],
    },
  ];
  const closures = [
    {
      fixture: "copied CLI",
      declaration: "scripts/entry.fixture-inputs.json",
      entries: ["scripts/entry.mjs"],
      files: ["scripts/entry.mjs"],
    },
  ];
  const bad = checkDeclarations(repo, table, closures);
  assert.equal(bad.exitCode, 1);
  assert.match(bad.output, /fixture-suite: scripts\/leaf.mjs/);
  assert.match(bad.output, /copied CLI: scripts\/leaf.mjs/);
  table[0].sources.push("scripts/leaf.mjs");
  closures[0].files.push("scripts/leaf.mjs");
  assert.equal(checkDeclarations(repo, table, closures).exitCode, 0);
  mkdirSync(join(repo, "packages/fixture/dist/src"), { recursive: true });
  writeFileSync(
    join(repo, "packages/fixture/dist/src/leaf.js"),
    "export {};\n",
  );
  writeFileSync(
    join(repo, "scripts/entry.mjs"),
    'import "../packages/fixture/dist/src/leaf.js";\n',
  );
  const compiled = checkDeclarations(repo, table, []);
  assert.match(compiled.output, /packages\/fixture\/dist\/src\/leaf\.js/);
  table[0].sources.push("packages/fixture/src/leaf.ts");
  assert.equal(checkDeclarations(repo, table, []).exitCode, 0);
  assert.equal(
    checkDeclarations(
      root,
      expandSuiteTasks(
        suites.filter((row) => row.machinery),
        root,
      ),
    ).exitCode,
    0,
  );
});

test("host structural check refuses warning and critical samples and reports their actual values", async () => {
  const { checkHost } = await import("./structural-checks.mjs");
  for (const [level, pressure] of [
    ["normal", 1],
    ["warning", 2],
    ["critical", 4],
  ]) {
    const sample = {
      level,
      pressure,
      swapBytes: 1234,
      physicalBytes: 8192,
      source: "fixture",
    };
    const fileEvents = {
      residentBytes: 1024,
      source: "fixture",
      observedAt: "2026-10-27T00:00:00.000Z",
    };
    const result = checkHost(sample, { fileEvents });
    assert.equal(result.exitCode, level === "normal" ? 0 : 1);
    assert.deepEqual(result.sample, sample);
    assert.deepEqual(result.fileEvents, fileEvents);
    assert.match(result.output, /swapBytes=1234; physicalBytes=8192/);
    assert.doesNotMatch(result.output, /admitted on the running gate/u);
    // A gate started inside a gate that was admitted stands on that
    // admission at warning pressure, which the run it belongs to may itself
    // have produced, and says so; critical pressure still refuses it, and
    // its sample is reported whichever way it is judged.
    const nested = checkHost(sample, { fileEvents, underRunningGate: true });
    assert.equal(nested.exitCode, level === "critical" ? 1 : 0, level);
    assert.deepEqual(nested.sample, sample);
    assert.match(nested.output, new RegExp(`Host memory: ${level};`, "u"));
    assert.equal(
      /admitted on the running gate that started this one and holds its lanes/u.test(
        nested.output,
      ),
      level === "warning",
      level,
    );
  }
});

test("a gate shows the file-events daemon's sample at every start, refuses above its limit naming the restart, and a gate inside a running gate stands on that gate", async () => {
  const { checkHost, judgeFileEventDaemon, FILE_EVENT_DAEMON_LIMIT_BYTES } =
    await import("./structural-checks.mjs");
  assert.equal(FILE_EVENT_DAEMON_LIMIT_BYTES, 2 ** 30);
  const sampled = (residentBytes) => ({
    residentBytes,
    source: "fixture",
    observedAt: "2026-11-13T00:00:00.000Z",
  });
  // A healthy daemon, small or at the limit itself: shown, and no refusal.
  for (const bytes of [8 * 2 ** 20, 0.17 * 2 ** 30, 2 ** 30]) {
    const judged = judgeFileEventDaemon(sampled(bytes));
    assert.equal(judged.refused, false, String(bytes));
    assert.equal(
      judged.message,
      `File-events daemon: residentBytes=${bytes}; limitBytes=1073741824`,
    );
  }
  // One byte over, and the size it was found at: refused, with the reading,
  // what it means and the one command that clears it.
  for (const bytes of [2 ** 30 + 1, 15 * 2 ** 30]) {
    const judged = judgeFileEventDaemon(sampled(bytes));
    assert.equal(judged.refused, true, String(bytes));
    for (const part of [
      `residentBytes=${bytes}`,
      "over the limit",
      "only when it was restarted",
      "needs an administrator",
      "sudo killall fseventsd",
    ])
      assert.ok(judged.message.includes(part), judged.message);
    // The same reading inside a running gate is reported and not refused.
    const nested = judgeFileEventDaemon(sampled(bytes), {
      underRunningGate: true,
    });
    assert.equal(nested.refused, false);
    for (const part of [
      `residentBytes=${bytes}`,
      "over the limit",
      "admitted on the running gate that started this one",
      "before the next gate",
      "sudo killall fseventsd",
    ])
      assert.ok(nested.message.includes(part), nested.message);
  }
  // No daemon on this host, a sample that could not be taken, or none
  // given: said so, and nothing refused.
  for (const [fileEvents, reason] of [
    [{ residentBytes: null, source: "not-macos" }, "not-macos"],
    [
      {
        residentBytes: null,
        source: "ps",
        unavailable: "fseventsd not identified in the RSS-first process table",
      },
      "fseventsd not identified in the RSS-first process table",
    ],
    [{}, "not sampled"],
    [null, "not sampled"],
    [undefined, "not sampled"],
  ]) {
    const judged = judgeFileEventDaemon(fileEvents);
    assert.equal(judged.refused, false);
    assert.equal(judged.message, `File-events daemon: no sample (${reason})`);
  }
  // Through the host check: its line stands under the host memory line, and
  // it alone can refuse a host that is otherwise admitted.
  const daemonLine = (output) =>
    output.split("\n").find((line) => line.startsWith("File-events daemon:"));
  const sample = {
    level: "normal",
    pressure: 1,
    swapBytes: 0,
    physicalBytes: 2 ** 36,
    source: "fixture",
  };
  const options = {
    limits: { taskBytes: 2 ** 30, hostLanes: 8 },
    requiredPeakBytes: 0,
  };
  const healthy = checkHost(sample, { ...options, fileEvents: sampled(1024) });
  assert.equal(healthy.exitCode, 0);
  assert.equal(
    daemonLine(healthy.output),
    "File-events daemon: residentBytes=1024; limitBytes=1073741824",
  );
  assert.equal(healthy.output.split("\n").length, 5);
  const stuck = checkHost(sample, {
    ...options,
    fileEvents: sampled(15 * 2 ** 30),
  });
  assert.equal(stuck.exitCode, 1);
  assert.match(daemonLine(stuck.output), /sudo killall fseventsd/u);
  assert.equal(
    checkHost(sample, {
      ...options,
      fileEvents: sampled(15 * 2 ** 30),
      underRunningGate: true,
    }).exitCode,
    0,
  );
});

test("a gate tells its host check that it runs inside a running gate only where it validated an inherited lease", async () => {
  const { hostTaskUnder } = await import("./test-runner.mjs");
  const row = { name: "host", args: ["host"], structural: true };
  // No lease was inherited: the task is the one the table names.
  assert.equal(hostTaskUnder(row, null), row);
  assert.equal(hostTaskUnder(row, undefined), row);
  // A validated lease: the same task with the one flag, the table's row
  // left as it was.
  const under = hostTaskUnder(row, { file: "lease.json", record: {} });
  assert.deepEqual(under, {
    name: "host",
    args: ["host", "--under-running-gate"],
    structural: true,
  });
  assert.deepEqual(row.args, ["host"]);
  // A row put in the host task's place keeps its own command whole: a
  // fixture's stand-in is another program, and the word appended to it
  // made Node refuse the command line in every fixture gate started inside
  // a running gate.
  for (const standIn of [
    { name: "host", structural: true, command: [process.execPath, "-e", ""] },
    {
      name: "host",
      structural: true,
      command: [process.execPath, "-e", ""],
      args: [],
    },
    {
      name: "host",
      structural: true,
      command: [process.execPath, "fixture-host.mjs"],
      args: ["--strict"],
    },
  ]) {
    const kept = hostTaskUnder(standIn, { file: "lease.json", record: {} });
    assert.equal(kept, standIn);
    if (kept.command[1] !== "-e") continue;
    const ran = spawnSync(
      kept.command[0],
      [...kept.command.slice(1), ...(kept.args ?? [])],
      { encoding: "utf8" },
    );
    assert.equal(ran.status, 0, ran.stderr);
  }
  // The check takes the flag for the host mode alone, and no other word.
  for (const [args, expected] of [
    [["host", "--under-running-gate"], 0],
    [["host", "--under-running-gate", "again"], 1],
    [["host", "--anything-else"], 1],
    [["declarations", "--under-running-gate"], 1],
  ]) {
    const run = spawnSync(
      process.execPath,
      [join(root, "scripts/structural-checks.mjs"), ...args],
      { cwd: root, encoding: "utf8" },
    );
    // The host's own state decides a well-formed call; a malformed one is
    // refused with the usage whatever the host reads.
    if (expected)
      assert.match(run.stderr + run.stdout, /usage: structural-checks\.mjs/u);
    else assert.doesNotMatch(run.stderr + run.stdout, /usage:/u);
  }
});

test("the Git floor admits a Git at or above engines.git and names the floor and the version read when it refuses", async (t) => {
  const { checkHost } = await import("./structural-checks.mjs");
  const floor = ">=2.31.0";
  for (const version of [
    "git version 2.31.0",
    "git version 2.31.0.windows.1",
    "git version 2.39.3 (Apple Git-146)",
    "git version 2.55.0",
    "git version 3.0.0",
  ]) {
    const { admitted, message } = judgeGitRuntime(version, floor);
    assert.equal(admitted, true, version);
    assert.ok(message.includes(floor), message);
  }
  for (const [version, read] of [
    ["git version 2.30.9", "2.30.9"],
    ["git version 1.99.9", "1.99.9"],
  ]) {
    const { admitted, message } = judgeGitRuntime(version, floor);
    assert.equal(admitted, false, version);
    for (const part of [read, floor, "node scripts/bootstrap.mjs"])
      assert.ok(message.includes(part), message);
  }
  // Git that did not run, an unreadable version, an undeclared, malformed or
  // unreadable floor.
  assert.match(judgeGitRuntime(null, floor).message, /Git did not run/u);
  assert.equal(judgeGitRuntime("git version banana", floor).admitted, false);
  assert.equal(judgeGitRuntime("git version 2.40.0", undefined).admitted, true);
  assert.match(
    judgeGitRuntime("git version 2.40.0", "^2.40.0").message,
    />=major\.minor\.patch/u,
  );
  assert.equal(judgeGitRuntime("git version 2.40.0", null).admitted, false);
  // This checkout declares the floor; the host task judges it beside Node,
  // with a shim's version read through its one git --version spawn.
  assert.equal(declaredGitFloor(root), floor);
  const refused = checkHost(
    {
      level: "normal",
      pressure: 1,
      swapBytes: 0,
      physicalBytes: 8192,
      residentBytes: 1024,
      source: "fixture",
      observedAt: "2026-11-07T00:00:00.000Z",
    },
    {
      limits: { taskBytes: 8192, hostLanes: 1, hostShare: 0.5 },
      requiredPeakBytes: 1,
      fileEvents: null,
      gitVersion: "git version 2.30.9",
    },
  );
  assert.equal(refused.exitCode, 1);
  assert.match(
    refused.output,
    /Git 2\.30\.9 \(git --version\) is below package\.json engines\.git >=2\.31\.0/u,
  );
  t.diagnostic(refused.output.split("\n")[1]);
});

test("the engines reader admits the declared lines and names what it refuses", (t) => {
  const range = "^24.15.0 || ^26.0.0";
  for (const version of ["24.15.0", "24.22.2", "26.0.0", "26.9.0", "v26.9.0"]) {
    const { admitted, message } = judgeNodeRuntime(version, range);
    assert.equal(admitted, true, version);
    assert.ok(message.includes(version) && message.includes(range), message);
  }
  for (const version of [
    "22.2.0",
    "24.14.9",
    "25.9.0",
    "26.0.0-rc.1",
    "27.0.0",
    "v24.15.0-rc.1",
  ]) {
    const { admitted, message } = judgeNodeRuntime(version, range);
    assert.equal(admitted, false, version);
    for (const part of [version, range, "node scripts/bootstrap.mjs"])
      assert.ok(message.includes(part), message);
  }
  for (const version of [
    "not-a-version",
    "",
    "24.15",
    "24.15.0.1",
    "24.015.0",
  ]) {
    const { admitted, message } = judgeNodeRuntime(version, range);
    assert.equal(admitted, false, version);
    assert.ok(message.includes(JSON.stringify(version)), message);
  }
  // The floor's minor and patch both place the start of the line.
  for (const [version, admitted] of [
    ["24.14.9", false],
    ["24.15.2", false],
    ["24.15.3", true],
    ["24.16.0", true],
  ])
    assert.equal(
      judgeNodeRuntime(version, "^24.15.3").admitted,
      admitted,
      version,
    );
  // A range outside the reader's grammar is refused by name, never half read.
  for (const written of [
    ">=26.0.0 <27",
    "^0.2.3",
    "^024.15.0",
    "^24.015.0",
    "^24.15.00",
    "^24.15",
    "24.15.0",
    "^24.15.0 ||",
    "",
    7,
  ]) {
    const { admitted, message } = judgeNodeRuntime("26.9.0", written);
    assert.equal(admitted, false, String(written));
    assert.ok(message.includes(JSON.stringify(written)), message);
  }
  // npm reads an absent range as no constraint, and so does this reader.
  assert.equal(judgeNodeRuntime("not-a-version", undefined).admitted, true);
  const repo = createFixtureRoot(join(tmpdir(), "dotln-engines-range-"));
  t.after(() => rmSync(repo, { recursive: true, force: true }));
  assert.equal(declaredNodeRange(repo), undefined);
  // A file that cannot be read is no claim that nothing is declared, and the
  // refusal says what is wrong with it.
  const unreadable = () => {
    assert.equal(declaredNodeRange(repo), null);
    const { admitted, message } = judgeRunningNode("26.9.0", repo);
    assert.equal(admitted, false);
    assert.match(message, /package\.json could not be read/u);
  };
  writeFileSync(join(repo, "package.json"), "{");
  unreadable();
  writeFileSync(join(repo, "package.json"), "null");
  unreadable();
  rmSync(join(repo, "package.json"));
  mkdirSync(join(repo, "package.json"));
  unreadable();
  rmSync(join(repo, "package.json"), { recursive: true });
  writeFileSync(join(repo, "package.json"), "{}");
  assert.equal(judgeRunningNode("26.9.0", repo).admitted, true);
  // npm skips a byte-order mark, so the range behind one still counts.
  writeFileSync(
    join(repo, "package.json"),
    '\uFEFF{"engines":{"node":"^99.0.0"}}',
  );
  assert.equal(declaredNodeRange(repo), "^99.0.0");
  // A readable file with an empty field declares nothing, as npm reads it.
  writeFileSync(join(repo, "package.json"), '{"engines":{"node":null}}');
  assert.equal(declaredNodeRange(repo), undefined);
  writeFileSync(join(repo, "package.json"), '{"engines":{"node":"^26.0.0"}}');
  assert.equal(declaredNodeRange(repo), "^26.0.0");
  assert.equal(judgeRunningNode("26.9.0", repo).admitted, true);
  assert.equal(judgeRunningNode("24.15.0", repo).admitted, false);
});

test("every package and lock entry declares the root range", () => {
  const read = (path) => JSON.parse(readFileSync(join(root, path), "utf8"));
  const declared = read("package.json").engines.node;
  const lock = read("package-lock.json");
  assert.equal(lock.packages[""].engines.node, declared);
  const packages = readdirSync(join(root, "packages")).filter((name) =>
    existsSync(join(root, "packages", name, "package.json")),
  );
  assert.ok(packages.includes("browser-evidence"), packages.join(" "));
  for (const name of packages) {
    assert.equal(read(`packages/${name}/package.json`).engines.node, declared);
    assert.equal(lock.packages[`packages/${name}`].engines.node, declared);
  }
});

test("host structural check refuses a Node outside the root engines range and names both", async (t) => {
  const { checkHost } = await import("./structural-checks.mjs");
  const declared = JSON.parse(readFileSync(join(root, "package.json"), "utf8"))
    .engines.node;
  const sample = {
    level: "normal",
    pressure: 1,
    swapBytes: 0,
    physicalBytes: 2 ** 36,
    source: "fixture",
  };
  const options = {
    limits: { taskBytes: 2 ** 30, hostLanes: 8 },
    requiredPeakBytes: 0,
    fileEvents: {},
  };
  for (const nodeVersion of ["24.15.0", "24.22.2", "26.9.0"]) {
    const result = checkHost(sample, { ...options, nodeVersion });
    assert.equal(result.exitCode, 0, nodeVersion);
    assert.ok(
      result.output.includes(
        `${nodeVersion} is inside package.json engines.node ${declared}`,
      ),
      result.output,
    );
  }
  for (const nodeVersion of [
    "22.2.0",
    "24.14.0",
    "25.9.0",
    "27.0.0",
    "v24.15.0-rc.1",
  ]) {
    const result = checkHost(sample, { ...options, nodeVersion });
    assert.equal(result.exitCode, 1, nodeVersion);
    assert.ok(
      result.output.includes(
        `${nodeVersion} is outside package.json engines.node ${declared}`,
      ),
      result.output,
    );
    assert.match(result.output, /node scripts\/bootstrap\.mjs is unaffected/u);
    // A refused runtime still records the samples a host row carries.
    assert.deepEqual(result.sample, sample);
    assert.deepEqual(result.fileEvents, options.fileEvents);
  }
  const unparsable = checkHost(sample, {
    ...options,
    nodeVersion: "not-a-version",
  });
  assert.equal(unparsable.exitCode, 1);
  assert.ok(unparsable.output.includes('"not-a-version"'), unparsable.output);
  assert.ok(unparsable.output.includes(declared), unparsable.output);
  // The range comes from the package file and nowhere else.
  const narrow = createFixtureRoot(join(tmpdir(), "dotln-host-range-"));
  t.after(() => rmSync(narrow, { recursive: true, force: true }));
  writeFileSync(
    join(narrow, "package.json"),
    '{"engines":{"node":"^24.15.0"}}',
  );
  const narrowed = checkHost(sample, {
    ...options,
    nodeVersion: "26.9.0",
    packageRoot: narrow,
  });
  assert.equal(narrowed.exitCode, 1);
  assert.ok(
    narrowed.output.includes(
      "26.9.0 is outside package.json engines.node ^24.15.0",
    ),
    narrowed.output,
  );
});

// The real host check, in the child the gate starts, reading a stubbed version.
const stubbedNode = (version) =>
  `data:text/javascript,Object.defineProperty(process,"version",{value:"${version}"})`;

test("a Node outside the range makes the host task the gate's first and only task", async (t) => {
  const repo = createFixtureRoot(join(tmpdir(), "dotln-runtime-gate-"));
  t.after(() => rmSync(repo, { recursive: true, force: true }));
  const gitOptions = { exec: true, stdio: ["ignore", "pipe", "pipe"] };
  runGit(repo, ["init", "-b", "main"], gitOptions);
  excludeFixtureOwnership(repo);
  writeFileSync(
    join(repo, ".gitignore"),
    "docs/control/local/\nran.txt\nbuilt.txt\n",
  );
  // Package sources with no build receipt make the runtime stale, so a gate
  // compiles before its tasks unless the runtime has been refused.
  mkdirSync(join(repo, "packages/skeleton/src"), { recursive: true });
  mkdirSync(join(repo, "scripts"));
  writeFileSync(join(repo, "packages/skeleton/package.json"), "{}\n");
  writeFileSync(join(repo, "packages/skeleton/tsconfig.json"), "{}\n");
  writeFileSync(join(repo, "packages/skeleton/src/index.mjs"), "\n");
  writeFileSync(
    join(repo, "scripts/build.mjs"),
    'import { writeFileSync } from "node:fs";\nwriteFileSync("built.txt", "yes");\n',
  );
  const declare = (range) =>
    writeFileSync(
      join(repo, "package.json"),
      JSON.stringify({ engines: { node: range } }),
    );
  declare("^1.0.0");
  runGit(repo, ["add", "."], gitOptions);
  runGit(
    repo,
    [
      "-c",
      "user.name=Fixture",
      "-c",
      "user.email=fixture@example.invalid",
      "-c",
      "commit.gpgsign=false",
      "commit",
      "-qm",
      "fixture",
    ],
    gitOptions,
  );
  const table = (host) => [
    {
      name: "format",
      command: [
        process.execPath,
        "-e",
        'require("fs").writeFileSync("ran.txt","yes")',
      ],
      structural: true,
      product: true,
    },
    { name: "host", command: host, structural: true, product: true },
    {
      name: "build",
      command: [process.execPath, "-e", "0"],
      build: true,
      product: true,
      outputs: [],
    },
    { name: "alpha", command: [process.execPath, "-e", "0"], product: true },
  ];
  const executed = (row) =>
    row.cases.filter((task) => task.executed).map((task) => task.name);
  const refused = await runGate(["--serial", "--again"], repo, {
    table: table([
      process.execPath,
      "--import",
      stubbedNode("v22.2.0"),
      join(root, "scripts/structural-checks.mjs"),
      "host",
    ]),
  });
  assert.equal(refused.exitCode, 1);
  assert.deepEqual(executed(refused), ["host"]);
  assert.equal(existsSync(join(repo, "ran.txt")), false);
  assert.equal(existsSync(join(repo, "built.txt")), false);
  const host = refused.cases.find((task) => task.name === "host");
  assert.match(
    host.output,
    /Node runtime v22\.2\.0 is outside package\.json engines\.node /u,
  );
  // Inside the range the stale runtime compiles and the declared order stands.
  declare(`^${process.versions.node.split(".")[0]}.0.0`);
  const admitted = await runGate(["--serial", "--again"], repo, {
    table: table([process.execPath, "-e", "0"]),
  });
  assert.equal(admitted.exitCode, 0);
  assert.equal(existsSync(join(repo, "built.txt")), true);
  const task = (name) => admitted.cases.find((row) => row.name === name);
  assert.ok(
    Date.parse(task("format").finishedAt) <= Date.parse(task("host").startedAt),
  );
  assert.equal(existsSync(join(repo, "ran.txt")), true);
});

test("a runner failure before any task on a Node outside the range still names the range", () => {
  // Listing opens no gate on this checkout, and an unknown suite fails it.
  const failed = spawnSync(
    process.execPath,
    [
      "--import",
      stubbedNode("v20.10.0"),
      "scripts/test-runner.mjs",
      "--list",
      "--only",
      "no-such-suite",
    ],
    { cwd: root, encoding: "utf8" },
  );
  assert.equal(failed.status, 1);
  assert.match(
    failed.stderr,
    /Node runtime v20\.10\.0 is outside package\.json engines\.node /u,
  );
  assert.match(failed.stderr, /Unknown suite: no-such-suite/u);
  const inside = spawnSync(
    process.execPath,
    ["scripts/test-runner.mjs", "--list", "--only", "no-such-suite"],
    { cwd: root, encoding: "utf8" },
  );
  assert.equal(inside.status, 1);
  assert.doesNotMatch(inside.stderr, /Node runtime /u);
});

test("harness judges its own checkout's range from any directory, and refuses evidence as it refuses check", (t) => {
  const target = createFixtureRoot(join(tmpdir(), "dotln-runtime-target-"));
  t.after(() => rmSync(target, { recursive: true, force: true }));
  runGit(target, ["init", "-q", "-b", "main"]);
  excludeFixtureOwnership(target);
  writeFileSync(join(target, "package.json"), '{"engines":{"node":">=18"}}');
  const harness = join(root, "scripts/harness.mjs");
  // Neither the directory nor a launchpad override chooses the range.
  const foreign = spawnSync(
    process.execPath,
    [harness, "check", "--target", ".", "--runtime-root", root],
    {
      cwd: target,
      encoding: "utf8",
      env: { ...process.env, DOTLN_LAUNCHPAD: target },
    },
  );
  assert.doesNotMatch(foreign.stderr, /engines\.node/u, foreign.stderr);
  // Evidence can report a pass from a cached row, so it refuses too; the
  // refusal names this checkout's range and a stop stays admitted.
  const stubbed = (...args) =>
    spawnSync(
      process.execPath,
      ["--import", stubbedNode("v22.2.0"), harness, ...args],
      { cwd: target, encoding: "utf8" },
    );
  const evidence = stubbed("evidence");
  assert.equal(evidence.status, 1);
  assert.match(
    evidence.stderr,
    /Node runtime v22\.2\.0 is outside package\.json engines\.node \^/u,
  );
  const stop = stubbed("evidence", "--stop");
  assert.equal(stop.status, 0, stop.stderr);
});

test("harness check refuses a Node outside the range while emit stays open for bootstrap", (t) => {
  const run = (...args) =>
    spawnSync(
      process.execPath,
      ["--import", stubbedNode("v22.2.0"), "scripts/harness.mjs", ...args],
      { cwd: root, encoding: "utf8" },
    );
  const refused = run("check");
  assert.equal(refused.status, 1);
  assert.match(
    refused.stderr,
    /Node runtime v22\.2\.0 is outside package\.json engines\.node /u,
  );
  const out = createFixtureRoot(join(tmpdir(), "dotln-runtime-emit-"));
  t.after(() => rmSync(out, { recursive: true, force: true }));
  const emitted = run("emit", "--out", out);
  assert.equal(emitted.status, 0, emitted.stderr);
});

test("fail-fast keeps running tasks, starts no later task, and keep-going restores scheduling", async () => {
  for (const keepGoing of [false, true]) {
    const started = [],
      finished = [];
    const table = [
      barrier,
      { name: "slow", command: ["slow"] },
      { name: "fail", command: ["fail"] },
      { name: "later", command: ["later"], after: ["slow"] },
    ];
    const rows = await scheduleSuites(table, {
      parallelism: 16,
      concurrency: 2,
      keepGoing,
      execute: async (row) => {
        started.push(row.name);
        if (row.name === "slow")
          await new Promise((done) => setTimeout(done, 30));
        finished.push(row.name);
        return {
          name: row.name,
          executed: true,
          exitCode: row.name === "fail" ? 1 : 0,
          durationMs: 1,
        };
      },
    });
    assert.ok(finished.indexOf("fail") < finished.indexOf("slow"));
    assert.ok(rows.find((row) => row.name === "slow").executed);
    assert.equal(started.includes("later"), keepGoing);
    assert.equal(rows.find((row) => row.name === "later").executed, keepGoing);
  }
});

test("failed runs record the first failure and tasks never started; keep-going records all tasks", async (t) => {
  const fixture = taskReuseFixture(t);
  const table = [
    ...fixture.table,
    {
      name: "later",
      product: true,
      command: [process.execPath, "scripts/alpha.mjs"],
    },
  ];
  writeFileSync(join(fixture.repo, "fail-beta"), "fail");
  const stopped = (await captureGate(["--serial"], fixture.repo, { table }))
    .row;
  assert.equal(stopped.failedFirst, "beta");
  assert.deepEqual(stopped.unrunSuites, ["later"]);
  assert.equal(stopped.exitCode, 1);
  const all = (
    await captureGate(["--serial", "--keep-going", "--again"], fixture.repo, {
      table,
    })
  ).row;
  assert.deepEqual(all.unrunSuites, []);
  assert.ok(all.taskTimeline.every((row) => row.executed));
});

test("recorded rows keep no passing output at any depth and address failed child output", async (t) => {
  const fixture = taskReuseFixture(t);
  const { repo } = fixture;
  writeFileSync(
    join(repo, "scripts/alpha.mjs"),
    'import fs from "node:fs"; fs.appendFileSync("observed.jsonl", "alpha\\n"); console.log("alpha passing noise");\n',
  );
  writeFileSync(
    join(repo, "scripts/beta.mjs"),
    'import fs from "node:fs"; fs.appendFileSync("observed.jsonl", "beta\\n"); if (fs.existsSync("fail-beta")) { console.log("beta failure details"); process.exit(1); }\n',
  );
  // A structural task reports child checks; a passing child's output is
  // transient, a failed child's output is a diagnostic the index addresses.
  writeFileSync(
    join(repo, "scripts/generated.mjs"),
    `console.log("CURRENT child-pass 0.001 s");\nconsole.log("STRUCTURAL_RESULT " + JSON.stringify({ exitCode: 0, stale: [], cases: [ { name: "child-pass", exitCode: 0, executed: true, durationMs: 1, output: "passing child noise" }, { name: "child-fail", exitCode: 1, executed: true, durationMs: 1, output: "kept child failure" } ] }));\n`,
  );
  writeFileSync(join(repo, "fail-beta"), "fail");
  const table = [
    {
      name: "generated",
      structural: true,
      command: [process.execPath, "scripts/generated.mjs"],
    },
    ...fixture.table,
  ];
  const { row } = await captureGate(["--serial"], repo, { table });
  assert.equal(row.exitCode, 1);
  assert.equal(row.failedFirst, "beta");
  const recorded = readGateChecks(repo);
  assert.deepEqual(recorded.map((entry) => entry.checkId).sort(), [
    "npm test",
    "structural",
  ]);
  const walk = (entries, at, visit) => {
    for (const [index, entry] of (entries ?? []).entries()) {
      const here = `${at}[${index}:${entry.name}]`;
      visit(entry, here);
      walk(entry.cases, `${here}.cases`, visit);
    }
  };
  for (const entry of recorded) {
    walk(entry.taskTimeline, `${entry.checkId}.taskTimeline`, (item, at) => {
      assert.ok(!Object.hasOwn(item, "output"), at);
      assert.ok(!Object.hasOwn(item, "outputRef"), at);
    });
    walk(entry.cases, `${entry.checkId}.cases`, (item, at) => {
      assert.ok(!Object.hasOwn(item, "output"), at);
      if (item.exitCode === 0 && item.executed)
        assert.ok(!Object.hasOwn(item, "outputRef"), at);
    });
  }
  const gate = recorded.find((entry) => entry.checkId === "npm test");
  const generated = gate.cases.find((entry) => entry.name === "generated");
  const childFail = generated.cases.find(
    (entry) => entry.name === "child-fail",
  );
  assert.equal(
    readFileSync(join(repo, childFail.outputRef), "utf8"),
    "kept child failure",
  );
  assert.equal(
    readFileSync(
      join(repo, gate.cases.find((entry) => entry.name === "beta").outputRef),
      "utf8",
    ).trim(),
    "beta failure details",
  );
  const companion = recorded.find((entry) => entry.checkId === "structural");
  assert.deepEqual(
    companion.taskTimeline
      .find((entry) => entry.name === "generated")
      .cases.map((entry) => entry.name),
    ["child-pass", "child-fail"],
  );
});

test("impossible future finishes and stopped rows never provide a passing claim", async (t) => {
  const { repo, table } = taskReuseFixture(t);
  const { coveringGateCheck, coveringTaskResults } =
    await import("./lib/gate-reuse.mjs");
  const identity = gateCodeIdentity(repo);
  const now = Date.now();
  const row = (at, exitCode, extra = {}) => ({
    checkId: "npm test",
    codeIdentity: identity,
    treeHash: gateTreeHash(repo),
    durationMs: 1,
    executed: true,
    exitCode,
    identityUnchanged: true,
    requiredSuites: ["alpha"],
    evidenceRef: `fixture:${at}`,
    recordedAt: new Date(at).toISOString(),
    taskTimeline: [
      {
        name: "alpha",
        durationMs: 1,
        executed: true,
        exitCode,
        finishedAt: new Date(at).toISOString(),
      },
    ],
    ...extra,
  });
  recordGateChecks(repo, [
    row(now, 0, {
      taskTimeline: [
        {
          name: "alpha",
          durationMs: 1,
          executed: true,
          exitCode: 0,
          finishedAt: new Date(now + 60_000).toISOString(),
        },
      ],
    }),
  ]);
  assert.equal(
    (await coveringGateCheck(repo, "npm test", ["alpha"])).row,
    undefined,
  );
  recordGateChecks(repo, [row(now + 1, 1)]);
  assert.equal(
    (await coveringTaskResults(repo, "npm test", table, identity)).results.has(
      "alpha",
    ),
    false,
  );
  recordGateChecks(repo, [
    row(now + 2, 0, { stopped: true, stoppedBy: "SIGTERM" }),
  ]);
  assert.equal(
    (await coveringGateCheck(repo, "npm test", ["alpha"])).row,
    undefined,
  );
  // A task result marked stopped inside a row that was not is no execution
  // that can be carried, whatever the row's own exit code says.
  recordGateChecks(repo, [
    row(now + 3, 0, {
      taskTimeline: [
        {
          name: "alpha",
          durationMs: 1,
          executed: true,
          exitCode: 0,
          stopped: true,
          finishedAt: new Date(now + 3).toISOString(),
        },
      ],
    }),
  ]);
  assert.equal(
    (await coveringTaskResults(repo, "npm test", table, identity)).results.has(
      "alpha",
    ),
    false,
  );
});

test("request and interrupt signals preserve only completed tasks, and never record an empty stop", async (t) => {
  for (const stoppedBy of ["request", "SIGINT", "SIGTERM", "SIGHUP"])
    for (const completed of [false, true]) {
      const { repo } = taskReuseFixture(t);
      writeFileSync(
        join(repo, ".gitignore"),
        "docs/control/local/\nobserved.jsonl\nresident-started\n",
      );
      const marker = join(repo, "resident-started");
      const resident = `require("node:fs").writeFileSync(${JSON.stringify(marker)}, "started"); setTimeout(() => {}, 10000);`;
      const table = [
        {
          name: "build",
          build: true,
          product: true,
          command: [
            process.execPath,
            "-e",
            completed ? 'console.log("build passing noise")' : resident,
          ],
        },
        {
          name: "resident",
          product: true,
          command: [process.execPath, "-e", resident],
        },
      ];
      const script = `
import { existsSync } from "node:fs";
import { runGate } from ${JSON.stringify(pathToFileURL(join(root, "scripts/test-runner.mjs")).href)};
const mode = ${JSON.stringify(stoppedBy)};
let sent = false;
const poll = mode === "request" ? undefined : setInterval(() => {
  if (!sent && existsSync(${JSON.stringify(marker)})) { sent = true; process.kill(process.pid, mode); }
}, 20);
try {
  await runGate(["--serial", "--again"], ${JSON.stringify(repo)}, {
    table: ${JSON.stringify(table)},
    stopRequested: () => mode === "request" && existsSync(${JSON.stringify(marker)}),
  });
} catch (error) { console.log(error.message); process.exitCode = 1; }
finally { clearInterval(poll); }
`;
      const result = spawnSync(
        process.execPath,
        ["--input-type=module", "-e", script],
        { cwd: repo, encoding: "utf8", timeout: 15_000 },
      );
      assert.equal(
        result.status,
        1,
        `${stoppedBy}: ${result.stdout}${result.stderr}`,
      );
      const rows = readGateChecks(repo);
      assert.equal(
        rows.length,
        completed ? 1 : 0,
        `${stoppedBy}: ${result.stdout}${result.stderr}`,
      );
      if (completed) {
        assert.equal(rows[0].stopped, true);
        assert.equal(rows[0].gateSelection, "plain");
        assert.ok(Number.isFinite(Date.parse(rows[0].startedAt)));
        const { dispatchStanding } = await import("./lib/dispatch-bound.mjs");
        const standing = dispatchStanding(repo, {
          journal: {
            role: "executor",
            intent: "resume: next",
            startedAt: rows[0].startedAt,
          },
          events: [],
          gates: rows,
        });
        assert.equal(standing.completeRuns, 1);
        assert.equal(
          dispatchStanding(repo, {
            journal: {
              role: "executor",
              intent: "resume: next",
              startedAt: rows[0].startedAt,
            },
            events: [],
            gates: [{ ...rows[0], checkId: "suite:resident" }],
          }).completeRuns,
          0,
        );
        assert.equal(rows[0].stoppedBy, stoppedBy);
        assert.equal(rows[0].exitCode, 1);
        assert.deepEqual(
          rows[0].taskTimeline.map((row) => row.name),
          ["build"],
        );
        for (const entry of [...rows[0].taskTimeline, ...rows[0].cases])
          assert.ok(!Object.hasOwn(entry, "output"), entry.name);
        assert.match(result.stdout, /stopped row recorded:/u);
      }
    }
});

test("launchpad files run as at most two independent deadline tasks", async () => {
  const suite = suites.find((row) => row.name === "launchpad");
  const tasks = expandSuiteTasks([suite], root);
  assert.deepEqual(
    tasks.map((row) => row.name),
    [
      "launchpad:file:test-launchpad-update.mjs",
      "launchpad:file:test-launchpad-export.mjs",
      "launchpad:file:test-launchpad-seeds.mjs",
    ],
  );
  for (const task of tasks) {
    // A file task keeps no figure of its own: its limit is the table's
    // default row, read when it runs.
    assert.equal(task.timeoutMs, undefined);
    assert.deepEqual(suiteTimeLimit(task, root), {
      ms: timeLimitsModule.TIME_LIMITS["suite.default"].ms,
      key: "suite.default",
    });
    assert.equal(task.loadSlots, 2);
  }
  let active = 0,
    peak = 0;
  await scheduleSuites([barrier, ...tasks], {
    parallelism: 16,
    concurrency: 4,
    execute: async (row) => {
      if (!row.build) {
        peak = Math.max(peak, ++active);
        await new Promise((done) => setTimeout(done, 10));
        active--;
      }
      return { name: row.name, executed: true, exitCode: 0, durationMs: 1 };
    },
  });
  assert.equal(peak, 2);
});

test("a malformed kit declaration reaches the CLI refusal instead of failing during import", (t) => {
  const repo = createFixtureRoot(join(tmpdir(), "dotln-runner-import-"));
  t.after(() => rmSync(repo, { recursive: true, force: true }));
  for (const entry of [
    "scripts",
    "packages/skeleton/src",
    "packages/beacons",
  ]) {
    mkdirSync(dirname(join(repo, entry)), { recursive: true });
    cpSync(join(root, entry), join(repo, entry), { recursive: true });
  }
  runGit(repo, ["init", "-q"]);
  excludeFixtureOwnership(repo);
  writeFileSync(join(repo, "KIT-MANIFEST.json"), "{}\n");
  mkdirSync(join(repo, "packages/core/tsconfig.json"), { recursive: true });
  for (const flags of [["--list"], ["--only", "format", "--list"]]) {
    const result = spawnSync(
      process.execPath,
      ["scripts/test-runner.mjs", ...flags],
      { cwd: repo, encoding: "utf8" },
    );
    assert.equal(result.status, 1);
    assert.equal(
      result.stderr.trim(),
      "Package source declaration must be a regular file: packages/core/tsconfig.json",
    );
    assert.ok(!result.stderr.includes(repo));
  }
  rmSync(join(repo, "KIT-MANIFEST.json"));
  symlinkSync("missing", join(repo, "KIT-MANIFEST.json"));
  const result = spawnSync(
    process.execPath,
    ["scripts/test-runner.mjs", "--list"],
    { cwd: repo, encoding: "utf8" },
  );
  assert.equal(result.status, 1);
  assert.equal(
    result.stderr.trim(),
    "KIT-MANIFEST.json must be a regular file",
  );
});

test("fail-fast cancels a pending host lane without discarding completed results", async () => {
  const started = [];
  let waiting;
  const waitingStarted = new Promise((resolve) => {
    waiting = resolve;
  });
  const rows = await scheduleSuites(
    [
      barrier,
      { name: "fail", command: ["fail"] },
      { name: "waiting", command: ["waiting"] },
      { name: "later", command: ["later"] },
    ],
    {
      parallelism: 16,
      concurrency: 2,
      hostLanes: { parentLease: null, directory: "fixture" },
      acquireLanes: async ({ task, signal }) => {
        if (task !== "waiting") return undefined;
        waiting();
        await new Promise((resolve, reject) => {
          signal.addEventListener(
            "abort",
            () => reject(new Error("Host lane wait aborted")),
            { once: true },
          );
        });
      },
      execute: async (row) => {
        started.push(row.name);
        if (row.name === "fail") await waitingStarted;
        return {
          name: row.name,
          exitCode: row.name === "fail" ? 1 : 0,
          durationMs: 1,
          executed: true,
        };
      },
    },
  );
  assert.deepEqual(started, ["build", "fail"]);
  assert.equal(rows.find((row) => row.name === "fail").executed, true);
  assert.equal(rows.find((row) => row.name === "waiting").executed, false);
  assert.equal(rows.find((row) => row.name === "later").executed, false);
});

test("fail-fast retains a running peer's execution exception as a completed failure", async () => {
  let failFinished;
  const failure = new Promise((resolve) => {
    failFinished = resolve;
  });
  const started = [];
  const rows = await scheduleSuites(
    [
      barrier,
      { name: "fail", command: ["fail"] },
      { name: "throws", command: ["throws"] },
      { name: "later", command: ["later"] },
    ],
    {
      parallelism: 16,
      concurrency: 2,
      onResult: (row) => {
        if (row.name === "fail") failFinished();
      },
      execute: async (row) => {
        started.push(row.name);
        if (row.name === "fail")
          await new Promise((resolve) => setImmediate(resolve));
        if (row.name === "throws") {
          await failure;
          throw new Error("running peer failed");
        }
        return {
          name: row.name,
          exitCode: row.name === "fail" ? 1 : 0,
          executed: true,
          durationMs: 1,
        };
      },
    },
  );
  assert.deepEqual(started, ["build", "fail", "throws"]);
  const thrown = rows.find((row) => row.name === "throws");
  assert.equal(thrown.executed, true);
  assert.equal(thrown.exitCode, 1);
  assert.match(thrown.output, /running peer failed/);
  assert.ok(thrown.startedAt && thrown.finishedAt);
});

test("copied fixtures use the checked declaration and directory coverage never supplies absent files", async (t) => {
  const { copyFixtureFiles } = await import("./lib/fixture-inputs.mjs");
  const { uncoveredFixtureInputs, copiedFixtureClosures } =
    await import("./lib/machinery-coverage.mjs");
  const repo = createFixtureRoot(join(tmpdir(), "dotln-declared-copy-"));
  t.after(() => rmSync(repo, { recursive: true, force: true }));
  mkdirSync(join(repo, "scripts"));
  const row = {
    fixture: "copy",
    entries: ["scripts/entry.mjs"],
    files: ["scripts/entry.mjs"],
  };
  const declaration = "scripts/entry.fixture-inputs.json";
  const save = () =>
    writeFileSync(join(repo, declaration), JSON.stringify(row));
  writeFileSync(join(repo, "scripts/entry.mjs"), 'import "./leaf.mjs";\n');
  writeFileSync(
    join(repo, "scripts/leaf.mjs"),
    'console.log("copied dependency");\n',
  );
  save();
  assert.deepEqual(
    uncoveredFixtureInputs(repo).map((row) => row.path),
    ["scripts/leaf.mjs"],
  );
  row.files.push("scripts/leaf.mjs");
  save();
  assert.deepEqual(uncoveredFixtureInputs(repo), []);
  const destination = join(repo, "copied");
  copyFixtureFiles(repo, destination, declaration);
  const run = spawnSync(process.execPath, ["scripts/entry.mjs"], {
    cwd: destination,
    encoding: "utf8",
  });
  assert.equal(run.status, 0, run.stderr);
  assert.match(run.stdout, /copied dependency/);
  row.files = [];
  row.directories = ["scripts"];
  save();
  rmSync(join(repo, "scripts/leaf.mjs"));
  assert.deepEqual(
    uncoveredFixtureInputs(repo).map((row) => row.path),
    ["scripts/leaf.mjs"],
  );
  rmSync(join(repo, "scripts/entry.mjs"));
  assert.deepEqual(
    uncoveredFixtureInputs(repo).map((row) => row.path),
    ["scripts/entry.mjs"],
  );
  row.provided = ["scripts/entry.mjs"];
  save();
  assert.deepEqual(uncoveredFixtureInputs(repo), []);
  // A dependency reached through a helper the fixture copies by directory
  // (WO-276): the entry's own import is covered by the directory, and what
  // the helper loads when it is loaded is the fixture's to hold too. What
  // only an import() call of the helper loads is not, and a declared double
  // of the helper is not read.
  delete row.provided;
  row.directories = ["scripts/lib"];
  row.files = ["scripts/entry.mjs"];
  mkdirSync(join(repo, "scripts/lib"));
  mkdirSync(join(repo, "packages"));
  writeFileSync(
    join(repo, "scripts/entry.mjs"),
    'import "./lib/helper.mjs";\n',
  );
  writeFileSync(
    join(repo, "scripts/lib/helper.mjs"),
    'import "../../packages/leaf.mjs";\nexport const later = () => import("../../packages/lazy.mjs");\nconsole.log("through a helper");\n',
  );
  writeFileSync(join(repo, "packages/leaf.mjs"), "export {};\n");
  writeFileSync(join(repo, "packages/lazy.mjs"), "export {};\n");
  save();
  assert.deepEqual(
    uncoveredFixtureInputs(repo).map((row) => row.path),
    ["packages/leaf.mjs"],
  );
  // The copy as declared fails where the check says it would.
  const partial = join(repo, "copied-partial");
  copyFixtureFiles(repo, partial, declaration);
  cpSync(join(repo, "scripts/lib"), join(partial, "scripts/lib"), {
    recursive: true,
  });
  assert.match(
    spawnSync(process.execPath, ["scripts/entry.mjs"], {
      cwd: partial,
      encoding: "utf8",
    }).stderr,
    /ERR_MODULE_NOT_FOUND/u,
  );
  row.provided = ["scripts/lib/helper.mjs"];
  save();
  assert.deepEqual(uncoveredFixtureInputs(repo), []);
  delete row.provided;
  row.files.push("packages/leaf.mjs");
  save();
  assert.deepEqual(uncoveredFixtureInputs(repo), []);
  const whole = join(repo, "copied-whole");
  copyFixtureFiles(repo, whole, declaration);
  cpSync(join(repo, "scripts/lib"), join(whole, "scripts/lib"), {
    recursive: true,
  });
  const through = spawnSync(process.execPath, ["scripts/entry.mjs"], {
    cwd: whole,
    encoding: "utf8",
  });
  assert.equal(through.status, 0, through.stderr);
  assert.match(through.stdout, /through a helper/u);
  // A listed file that only an import() call of the entry reaches is read
  // as well: what it loads when it is loaded is the fixture's to hold.
  writeFileSync(
    join(repo, "scripts/entry.mjs"),
    'await import("./listed.mjs");\n',
  );
  writeFileSync(
    join(repo, "scripts/listed.mjs"),
    'import "./lib/helper.mjs";\n',
  );
  row.files = ["scripts/entry.mjs", "scripts/listed.mjs"];
  save();
  assert.deepEqual(
    uncoveredFixtureInputs(repo).map((row) => row.path),
    ["packages/leaf.mjs"],
  );
  row.files.push("packages/leaf.mjs");
  save();
  assert.deepEqual(uncoveredFixtureInputs(repo), []);
});

test("priority-regression: a complete selection leads with suites whose inputs changed since the newest gate row", (t) => {
  const repo = createFixtureRoot(join(tmpdir(), "dotln-changed-first-"));
  t.after(() => rmSync(repo, { recursive: true, force: true }));
  const git = (...args) => {
    const run = runGit(
      repo,
      [
        "-c",
        "user.name=fixture",
        "-c",
        "user.email=fixture@example.invalid",
        ...args,
      ],
      { raw: true, encoding: "utf8" },
    );
    assert.equal(run.status, 0, run.stderr);
  };
  git("init", "-q");
  excludeFixtureOwnership(repo);
  mkdirSync(join(repo, "scripts"), { recursive: true });
  mkdirSync(join(repo, "packages/delta/src"), { recursive: true });
  writeFileSync(join(repo, "scripts/alpha.mjs"), "export const alpha = 1;\n");
  writeFileSync(join(repo, "scripts/test-epsilon.sh"), "exit 0\n");
  writeFileSync(join(repo, "packages/delta/src/a.ts"), "export {};\n");
  git("add", "-A");
  git("-c", "maintenance.auto=false", "commit", "-q", "-m", "fixture");
  assert.equal(runGit(repo, ["ls-files", ".dotln-owner.json"]), "");
  const table = [
    { name: "alpha", sources: ["scripts/alpha"] },
    { name: "beta", sources: ["scripts/beta.mjs"] },
    { name: "gamma" },
    // Product suites declare no sources: their script or package stands in.
    {
      name: "delta",
      command: ["node", "--test", "packages/delta/dist/test/a.test.js"],
    },
    { name: "epsilon", command: ["bash", "scripts/test-epsilon.sh"] },
    { name: "zeta", command: ["bash", "scripts/test-zeta.sh"] },
  ];
  const hourAgo = new Date(Date.now() - 3_600_000).toISOString();
  const hourAhead = new Date(Date.now() + 3_600_000).toISOString();
  assert.deepEqual(changedSinceLastGate(repo, table, []), {
    since: undefined,
    files: [],
    suites: [],
  });
  assert.deepEqual(
    changedSinceLastGate(repo, table, [{ recordedAt: hourAhead }]).suites,
    [],
  );
  // An untracked file counts; an unparseable time does not decide.
  writeFileSync(join(repo, "scripts/beta.mjs"), "export const beta = 1;\n");
  const changed = changedSinceLastGate(repo, table, [
    { recordedAt: hourAgo },
    { recordedAt: "not a time" },
  ]);
  assert.equal(changed.since, hourAgo);
  assert.deepEqual(changed.files.sort(), [
    "packages/delta/src/a.ts",
    "scripts/alpha.mjs",
    "scripts/beta.mjs",
    "scripts/test-epsilon.sh",
  ]);
  assert.deepEqual(changed.suites, ["alpha", "beta", "delta", "epsilon"]);
  // The newest row decides, whichever order the rows arrive in.
  assert.deepEqual(
    changedSinceLastGate(repo, table, [
      { recordedAt: hourAgo },
      { recordedAt: hourAhead },
    ]).suites,
    [],
  );
  // A structural failure never exercised these source changes. A legacy row
  // without execution detail still supplies its timestamp, as above.
  const aborted = {
    recordedAt: hourAhead,
    exitCode: 1,
    unrunSuites: ["alpha", "beta"],
    taskTimeline: [
      { name: "format", exitCode: 0, executed: true },
      { name: "generated", exitCode: 1, executed: true },
      { name: "alpha", exitCode: 1, executed: false },
    ],
  };
  const structuralCompanion = {
    recordedAt: hourAhead,
    checkId: "structural",
    exitCode: 1,
    unrunSuites: [],
    taskTimeline: STRUCTURAL_TASKS.map((name) => ({
      name,
      executed: true,
      exitCode: name === "host" ? 1 : 0,
    })),
  };
  for (const ignored of [
    [
      { recordedAt: hourAhead, checkId: "npm run test:docs" },
      {
        ...structuralCompanion,
        exitCode: 0,
        taskTimeline: structuralCompanion.taskTimeline.map((task) => ({
          ...task,
          exitCode: 0,
        })),
      },
    ],
    [aborted],
    [
      { ...aborted, taskTimeline: structuralCompanion.taskTimeline },
      structuralCompanion,
    ],
    [
      {
        ...aborted,
        taskTimeline: [{ name: "build", exitCode: 1, executed: true }],
      },
    ],
  ]) {
    const retained = changedSinceLastGate(repo, table, [
      { recordedAt: hourAgo },
      ...ignored,
    ]);
    assert.equal(retained.since, hourAgo);
    assert.deepEqual(retained.suites, changed.suites);
  }
  // A failed row that did execute a product task still advances the mark.
  const productFailure = {
    ...aborted,
    taskTimeline: [
      ...aborted.taskTimeline,
      { name: "beta", exitCode: 1, executed: true },
    ],
  };
  assert.equal(
    changedSinceLastGate(repo, table, [{ recordedAt: hourAgo }, productFailure])
      .since,
    hourAhead,
  );
});

test("a suite whose latest recorded execution did not pass leads the next run", () => {
  const execution = (name, exitCode, extra = {}) => ({
    name,
    executed: true,
    exitCode,
    ...extra,
  });
  assert.deepEqual(lastFailedSuites([]), []);
  assert.deepEqual(
    lastFailedSuites([
      {
        recordedAt: "2026-10-18T10:00:00.000Z",
        taskTimeline: [
          execution("alpha", 1),
          execution("beta", 0),
          execution("vertical:file:one", 0),
          execution("vertical:file:two", 0, { timedOut: true }),
          { name: "gamma", executed: false },
          execution("delta", 0, { reused: true }),
        ],
      },
      // An older row's failure is superseded by the newer row's pass, and a
      // newer failure supersedes an older pass, whatever order rows arrive in.
      {
        recordedAt: "2026-10-18T11:00:00.000Z",
        cases: [execution("alpha", 0), execution("beta", 0, { stopped: true })],
      },
      {
        recordedAt: "2026-10-18T09:00:00.000Z",
        taskTimeline: [execution("beta", 1), execution("epsilon", 1)],
      },
    ]),
    ["beta", "epsilon", "vertical"],
  );
});

test("priority-regression: branch history preserves exclusive priority while fresh changes lead", async () => {
  const names = [
    "build",
    "target-publish",
    "runner-fixtures",
    "harness-fixtures",
    "worktree-integration",
    "launchpad-planning",
    "worktree",
  ];
  const selected = suites.filter((row) => names.includes(row.name));
  const first = suitePriorityLeads({
    branch: [
      "launchpad-planning",
      "harness-fixtures",
      "runner-fixtures",
      "target-publish",
    ],
    changed: ["runner-fixtures", "target-publish"],
    failed: ["target-publish"],
  });
  const tasks = expandSuiteTasks(selected, root, "<gate-template>", { first });
  // The hook suite's tasks are its shards, which share one priority.
  const named = (name) => (row) =>
    row.name === name || row.name.startsWith(`${name}:shard:`);
  const priority = (name) => tasks.find(named(name)).priority;
  for (const [higher, lower] of [
    ["target-publish", "runner-fixtures"],
    ["runner-fixtures", "harness-fixtures"],
    ["worktree-integration", "launchpad-planning"],
    ["launchpad-planning", "worktree"],
  ])
    assert.ok(
      priority(higher) > priority(lower),
      `${higher} must lead ${lower}`,
    );
  // The exclusive rows share the highest priority any of them holds, the
  // hook suite's branch lead here, and keep the order their own gave.
  assert.equal(priority("harness-fixtures"), 300);
  assert.equal(priority("worktree-integration"), 300);
  assert.ok(
    tasks.findIndex(named("harness-fixtures")) <
      tasks.findIndex(named("worktree-integration")),
  );
  const started = [];
  const result = await scheduleSuites(tasks, {
    concurrency: 8,
    parallelism: 16,
    lightTasks: new Set(),
    execute: async (row) => {
      started.push(row.name);
      return { name: row.name, executed: true, exitCode: 0 };
    },
  });
  assert.equal(result.length, tasks.length);
  const hooksStarted = started.findIndex((name) =>
    name.startsWith("harness-fixtures:shard:"),
  );
  assert.ok(started.indexOf("target-publish") < hooksStarted);
  assert.ok(started.indexOf("runner-fixtures") < hooksStarted);
  assert.ok(hooksStarted < started.indexOf("worktree-integration"));
  assert.ok(
    started.indexOf("worktree-integration") <
      started.indexOf("launchpad-planning"),
  );
});

test("WO-276 criterion D1: the exclusive rows stand together under the highest priority any of them holds, ahead of a heavy row that changed since the last gate and behind a heavy row that failed last", async () => {
  const names = [
    "build",
    "target-publish",
    "runner-fixtures",
    "harness-fixtures",
    "process-debt",
    "worktree-integration",
    "sync-fixtures",
    "launchpad-planning",
  ];
  const selected = suites.filter((row) => names.includes(row.name));
  // Leads that interleaved before: an exclusive row and a heavy row both
  // changed since the last gate, another exclusive row carries the branch
  // lead, two carry none, and a heavy row failed last.
  const first = suitePriorityLeads({
    branch: ["harness-fixtures", "launchpad-planning"],
    changed: ["process-debt", "runner-fixtures"],
    failed: ["target-publish"],
  });
  const tasks = expandSuiteTasks(selected, root, "<gate-template>", { first });
  const exclusive = tasks.filter((row) => row.exclusive);
  const at = tasks.indexOf(exclusive[0]);
  assert.deepEqual(tasks.slice(at, at + exclusive.length), exclusive);
  assert.deepEqual(
    exclusive.map((row) => row.name.replace(/:shard:\d+$/u, "")),
    [
      "process-debt",
      "harness-fixtures",
      "harness-fixtures",
      "harness-fixtures",
      // The two without a lead keep the order the table declares them in.
      ...suites
        .filter((row) =>
          ["worktree-integration", "sync-fixtures"].includes(row.name),
        )
        .map((row) => row.name),
    ],
  );
  const priority = (name) => tasks.find((row) => row.name === name).priority;
  assert.ok(exclusive.every((row) => row.priority === 2200));
  assert.equal(priority("runner-fixtures"), 2000);
  assert.equal(priority("target-publish"), 3000);
  // One exclusive row alone keeps its own priority.
  assert.equal(
    expandSuiteTasks(
      suites.filter((row) => ["build", "process-debt"].includes(row.name)),
      root,
    ).find((row) => row.name === "process-debt").priority,
    200,
  );
  const started = [];
  const result = await scheduleSuites(tasks, {
    concurrency: 8,
    parallelism: 16,
    lightTasks: new Set(),
    execute: async (row) => {
      started.push(row.name);
      return { name: row.name, executed: true, exitCode: 0 };
    },
  });
  assert.equal(result.length, tasks.length);
  const order = started.filter((name) => name !== "build");
  assert.equal(order[0], "target-publish");
  assert.deepEqual(
    order.slice(1, 1 + exclusive.length),
    exclusive.map((row) => row.name),
  );
  assert.equal(order[1 + exclusive.length], "runner-fixtures");
});

test("WO-276 criterion D2: the hook suite's shards expand once each, carry their shard to their process, and are admitted together inside the row's lanes beside light peers only", async (t) => {
  const hooks = suites.find((row) => row.name === "harness-fixtures");
  assert.ok(hooks.shards > 1);
  const light = ["light-1", "light-2", "light-3", "light-4"].map((name) => ({
    name,
    command: ["fixture"],
  }));
  const tasks = expandSuiteTasks(
    [
      barrier,
      { name: "heavy", command: ["fixture"], priority: 500 },
      hooks,
      ...light,
    ],
    root,
  );
  const shards = tasks.filter((row) => row.shard);
  assert.deepEqual(
    shards.map((row) => [row.name, row.shard, row.group, row.groupLimit]),
    Array.from({ length: hooks.shards }, (_, at) => [
      `harness-fixtures:shard:${at + 1}`,
      { row: "harness-fixtures", number: at + 1, count: hooks.shards },
      "harness-fixtures:shards",
      hooks.shards,
    ]),
  );
  for (const row of shards) {
    // Every shard runs the row's own files; its shard is in its environment.
    assert.deepEqual(row.command, hooks.command);
    assert.deepEqual(row.args, hooks.args);
    assert.equal(row.exclusive, true);
    assert.equal(row.overlap, hooks.overlap);
    assert.ok(!Object.hasOwn(row, "shards"));
  }
  assert.throws(
    () =>
      validateSuites([barrier, { name: "x", command: ["fixture"], shards: 2 }]),
    /Invalid shard count: x/u,
  );
  assert.throws(
    () =>
      validateSuites([
        barrier,
        { name: "x", command: ["fixture"], exclusive: true, shards: 1.5 },
      ]),
    /Invalid shard count: x/u,
  );
  for (const [concurrency, slots, together] of [
    [8, 2, 3],
    [4, 1, 2],
  ]) {
    const active = new Map();
    let peak = 0,
      lightBeside = 0;
    const rows = await scheduleSuites(tasks, {
      concurrency,
      parallelism: 16,
      lightTasks: new Set(light.map((row) => row.name)),
      execute: async (row) => {
        const shardsActive = [...active.keys()].filter((name) =>
          name.startsWith("harness-fixtures:shard:"),
        );
        if (row.shard) {
          // Beside a shard: its row's other shards and light peers.
          assert.ok(!active.has("heavy"));
          assert.equal(row.gateContext.reservedSlots, slots);
          assert.equal(
            row.gateContext.concurrency,
            Math.min(hooks.overlap, concurrency - 1) + together,
          );
          peak = Math.max(peak, shardsActive.length + 1);
        } else if (row.name === "heavy") assert.equal(shardsActive.length, 0);
        else if (!row.build && shardsActive.length)
          lightBeside = Math.max(
            lightBeside,
            active.size - shardsActive.length + 1,
          );
        if (row.build) return { name: row.name, executed: true, exitCode: 0 };
        active.set(row.name, true);
        // The first shard ends early: the lanes it frees stay the row's.
        await new Promise((done) =>
          setTimeout(done, row.shard ? (row.shard.number === 1 ? 10 : 60) : 15),
        );
        active.delete(row.name);
        return { name: row.name, executed: true, exitCode: 0 };
      },
    });
    assert.equal(rows.length, tasks.length);
    assert.ok(rows.every((row) => row.exitCode === 0));
    assert.equal(peak, together, `shards together at ${concurrency} lanes`);
    assert.ok(
      lightBeside >= 1 && lightBeside <= hooks.overlap,
      `light peers beside the shards at ${concurrency} lanes: ${lightBeside}`,
    );
  }
  // On every host size the declaration a shard's process is given passes
  // the deadline's own validator: beside a shard run the light peers and
  // the other shards its row's lanes hold at once, never more than the host
  // has lanes (rolling review 7, F5).
  for (const [parallelism, expected] of [
    [2, 1],
    [4, 2],
    [8, 4],
    [16, 5],
  ]) {
    const loads = [];
    await scheduleSuites(tasks, {
      parallelism,
      lightTasks: new Set(light.map((row) => row.name)),
      execute: async (row) => {
        if (row.shard)
          loads.push(gateLoad(suiteEnvironment({}, row.gateContext)));
        return { name: row.name, executed: true, exitCode: 0 };
      },
    });
    assert.deepEqual(
      loads.map((load) => load.concurrency),
      Array(hooks.shards).fill(expected),
      `a shard's declared load at parallelism ${parallelism}`,
    );
  }
  // The shard reaches the task's process, and a file that takes `test` from
  // the helper runs each case in exactly one shard.
  const repo = createFixtureRoot(join(tmpdir(), "dotln-shard-dispatch-"));
  t.after(() => rmSync(repo, { recursive: true, force: true }));
  execGit(["init", "-q"], { cwd: repo });
  excludeFixtureOwnership(repo);
  mkdirSync(join(repo, "scripts/lib"), { recursive: true });
  cpSync(
    join(root, "scripts/lib/test-shards.mjs"),
    join(repo, "scripts/lib/test-shards.mjs"),
  );
  const titles = Array.from({ length: 24 }, (_, at) => `shard case ${at}`);
  // A case registered through a modifier is one case too (rolling review 36).
  const modified = Array.from({ length: 12 }, (_, at) =>
    at % 2 ? `owed ${at}` : `held back ${at}`,
  );
  writeFileSync(
    join(repo, "scripts/imported.mjs"),
    `import test from "./lib/test-shards.mjs";\n${titles
      .slice(12)
      .map((name) => `test(${JSON.stringify(name)}, () => {});`)
      .join("\n")}\n`,
  );
  writeFileSync(
    join(repo, "scripts/entry.mjs"),
    `import "./imported.mjs";\nimport test from "./lib/test-shards.mjs";\n${titles
      .slice(0, 12)
      .map((name) => `test(${JSON.stringify(name)}, () => {});`)
      .join(
        "\n",
      )}\ntest("the shard ends with this process", () => { if (process.env.DOTLN_TEST_SHARD !== undefined) throw new Error("inherited"); });\n${modified
      .map(
        (name) =>
          `test.${name.startsWith("owed") ? "todo" : "skip"}(${JSON.stringify(name)}, () => {});`,
      )
      .join("\n")}\n`,
  );
  const fixtureTasks = expandSuiteTasks(
    [
      {
        name: "fixture-shards",
        command: [process.execPath, "--test", "scripts/entry.mjs"],
        exclusive: true,
        shards: 3,
      },
    ],
    repo,
  );
  const ran = [];
  const heldOrOwed = [];
  for (const task of fixtureTasks) {
    const result = await executeSuite(task, repo);
    assert.equal(result.exitCode, 0, result.output);
    const mine = [
      ...result.output.matchAll(/^ok \d+ - ((?:(?! # ).)+)$/gmu),
    ].map((match) => match[1]);
    assert.ok(mine.length > 0, `${task.name} ran no case`);
    ran.push(...mine);
    heldOrOwed.push(
      ...[...result.output.matchAll(/^ok \d+ - (.+) # (?:SKIP|TODO)\b/gmu)].map(
        (match) => match[1],
      ),
    );
  }
  const all = [...titles, "the shard ends with this process"];
  assert.deepEqual(ran.toSorted(), all.toSorted());
  // Each skipped or owed case registered in one shard, and the title listing
  // names it once beside the others.
  assert.deepEqual(heldOrOwed.toSorted(), modified.toSorted());
  const listing = join(repo, "titles.jsonl");
  const listed = spawnSync(process.execPath, ["scripts/entry.mjs"], {
    cwd: repo,
    env: { ...process.env, DOTLN_TEST_TITLES: listing },
    encoding: "utf8",
  });
  assert.equal(listed.status, 0, listed.stderr);
  assert.deepEqual(
    readFileSync(listing, "utf8")
      .split("\n")
      .filter(Boolean)
      .map((line) => JSON.parse(line))
      .toSorted(),
    [...all, ...modified].toSorted(),
  );
  // With no shard named every case registers, so one runs by its name.
  const single = await executeSuite(
    {
      name: "fixture-single",
      command: [
        process.execPath,
        "--test",
        "--test-name-pattern=^shard case 7$",
        "scripts/entry.mjs",
      ],
    },
    repo,
  );
  assert.equal(single.exitCode, 0, single.output);
  assert.match(single.output, /^ok \d+ - shard case 7$/mu);
});

/** What node:test exports, and what its test function holds as members,
 * that registers no case: the hooks and the module's utilities. */
const NOT_REGISTERING = new Set([
  "after",
  "afterEach",
  "before",
  "beforeEach",
  "getTestContext",
  "run",
  "mock",
  "assert",
  "snapshot",
]);
/** What node:test exports that registers a case or a suite of them, and
 * the members of a registrar that register as it does: every one that is
 * no hook and no utility, so a member node adds later is read as
 * registering and is never passed over. */
const REGISTERING = { has: (name) => !NOT_REGISTERING.has(name) };
/** Those of them the family below runs under node, wherever the node it
 * runs under has them: what each registers is held to node. */
const HELD_REGISTERING = [
  "test",
  "it",
  "describe",
  "suite",
  "skip",
  "only",
  "todo",
  "expectFailure",
];
/** What the kit's shard helper exports that registers a case: `test`, by
 * name and as its default, which it hands on to node:test. */
const SHARD_REGISTERING = new Set(["test", "default"]);
/** An expression without the parentheses written around it. */
const bare = (K, node) => {
  while (node.kind === K.ParenthesizedExpression) node = node.expression;
  return node;
};
/** A member taken by a name the source spells, `a.b` or `a["b"]` with a
 * literal key: its object, without parentheses, and the name. Null for
 * anything else, a member taken by a computed key among them. */
const spelledMember = (K, node) =>
  node.kind === K.PropertyAccessExpression
    ? { object: bare(K, node.expression), name: node.name.text }
    : node.kind === K.ElementAccessExpression &&
        [K.StringLiteral, K.NoSubstitutionTemplateLiteral].includes(
          node.argumentExpression.kind,
        )
      ? { object: bare(K, node.expression), name: node.argumentExpression.text }
      : null;
/** The specifier of the module an expression awaits where it imports it,
 * where the specifier is a text `fixed` gives (a literal, or a name fixed to
 * one); undefined for anything else. */
const awaitedImport = (K, node, fixed) => {
  const awaited =
    node.kind === K.AwaitExpression ? bare(K, node.expression) : undefined;
  const [specifier] =
    awaited?.kind === K.CallExpression &&
    awaited.expression.kind === K.ImportKeyword
      ? awaited.arguments
      : [];
  return specifier ? fixed(specifier) : undefined;
};
/** Whether a token is an assignment: `=`, a compound one or a logical one. */
const assigns = (K, token) =>
  token.kind >= K.FirstAssignment && token.kind <= K.LastAssignment;
/** The names an assignment's left side gives a value to, as the nodes that
 * name them: a name; each name of a destructuring; and for a member written
 * on an object, the object's own name, since what is written on it later
 * is reached through it (left out where `members` is false: the object
 * itself is given no other value). */
const assignmentTargets = (K, left, into = [], members = true) => {
  const node = bare(K, left);
  if (node.kind === K.Identifier) into.push(node);
  else if (
    node.kind === K.PropertyAccessExpression ||
    node.kind === K.ElementAccessExpression
  ) {
    if (members) assignmentTargets(K, node.expression, into, members);
  } else if (node.kind === K.ArrayLiteralExpression)
    for (const element of node.elements)
      assignmentTargets(
        K,
        element.kind === K.SpreadElement ? element.expression : element,
        into,
        members,
      );
  else if (node.kind === K.ObjectLiteralExpression)
    for (const property of node.properties) {
      if (property.kind === K.PropertyAssignment)
        assignmentTargets(K, property.initializer, into, members);
      else if (property.kind === K.ShorthandPropertyAssignment)
        into.push(property.name);
      else if (property.kind === K.SpreadAssignment)
        assignmentTargets(K, property.expression, into, members);
    }
  else if (
    node.kind === K.BinaryExpression &&
    node.operatorToken.kind === K.EqualsToken
  )
    assignmentTargets(K, node.left, into, members);
  return into;
};
/** Which declaration each name of a file stands for, by the scopes the
 * language gives it: a module's imports and top-level declarations; a
 * function's parameters and its `var`s; a block's `let`, `const`, class
 * and function declarations; a loop's own declarations; a catch clause's
 * variable; and the name a function or class expression has inside itself.
 * `key` answers, for a name written as a use or as a declaration, a text
 * that two names share exactly when they stand for one declaration, with
 * every name the file does not declare sharing one for its spelling; and
 * for a name that is no use of a variable (a member's name, a property's
 * key, a label) a text nothing else has. `reference` says which it is. */
const fileBindings = (file) => {
  const { SyntaxKind: K, NodeFlags } = sourceSyntax();
  const FUNCTIONS = functionKinds(K);
  const BLOCKS = new Set([
    K.SourceFile,
    K.Block,
    K.CaseBlock,
    K.ModuleBlock,
    K.ClassStaticBlockDeclaration,
  ]);
  const LOOPS = new Set([K.ForStatement, K.ForOfStatement, K.ForInStatement]);
  const scopes = new Map();
  const home = new Map();
  // The keys of names a scope declares more than once (a `var` again, a
  // `var` and a function): each such name has had more than one value.
  const redeclared = new Set();
  const declare = (scope, identifier) => {
    home.set(identifier, scope);
    if (!scopes.has(scope)) scopes.set(scope, new Map());
    const first = scopes.get(scope).get(identifier.text);
    if (first) redeclared.add(`${identifier.text}@${first.pos}`);
    else scopes.get(scope).set(identifier.text, identifier);
  };
  const enclosing = (node, is) => {
    for (let at = node.parent; at; at = at.parent) if (is(at)) return at;
    return file;
  };
  const block = (node) =>
    enclosing(node, (at) => BLOCKS.has(at.kind) || FUNCTIONS.has(at.kind));
  // Where a `var` belongs: the module, a static block, or a function's
  // body, which is a scope apart from its parameters, so that a
  // parameter's default value does not see the body's own `var`.
  const body = (node) => {
    const holder = enclosing(
      node,
      (at) =>
        at.kind === K.SourceFile ||
        at.kind === K.ClassStaticBlockDeclaration ||
        FUNCTIONS.has(at.kind),
    );
    return holder.body?.kind === K.Block ? holder.body : holder;
  };
  const bound = (pattern, into = []) => {
    if (pattern.kind === K.Identifier) into.push(pattern);
    else
      for (const element of pattern.elements ?? [])
        if (element.name) bound(element.name, into);
    return into;
  };
  for (const node of sourceNodes(file)) {
    if (node.kind === K.ImportClause) {
      if (node.name) declare(file, node.name);
    } else if ([K.NamespaceImport, K.ImportSpecifier].includes(node.kind))
      declare(file, node.name);
    else if (node.kind === K.VariableDeclaration) {
      const list = node.parent;
      const scope =
        list.kind === K.CatchClause
          ? list
          : !(list.flags & (NodeFlags.Let | NodeFlags.Const))
            ? body(node)
            : LOOPS.has(list.parent.kind)
              ? list.parent
              : block(list);
      for (const identifier of bound(node.name)) declare(scope, identifier);
    } else if (node.kind === K.Parameter) {
      for (const identifier of bound(node.name))
        declare(node.parent, identifier);
    } else if (
      [
        K.FunctionDeclaration,
        K.ClassDeclaration,
        K.EnumDeclaration,
        K.ModuleDeclaration,
        K.ImportEqualsDeclaration,
      ].includes(node.kind)
    ) {
      if (node.name?.kind === K.Identifier) declare(block(node), node.name);
    } else if ([K.FunctionExpression, K.ClassExpression].includes(node.kind)) {
      if (node.name) declare(node, node.name);
    }
  }
  const NAMED = new Set([
    K.PropertyAccessExpression,
    K.PropertyAssignment,
    K.MethodDeclaration,
    K.PropertyDeclaration,
    K.GetAccessor,
    K.SetAccessor,
    K.PropertySignature,
    K.MethodSignature,
    K.EnumMember,
  ]);
  const reference = (identifier) => {
    const parent = identifier.parent;
    if (!parent) return false;
    if (NAMED.has(parent.kind) && parent.name === identifier) return false;
    if (parent.kind === K.QualifiedName && parent.right === identifier)
      return false;
    if (
      [K.BindingElement, K.ImportSpecifier].includes(parent.kind) &&
      parent.propertyName === identifier
    )
      return false;
    if (
      parent.kind === K.ExportSpecifier &&
      parent.propertyName &&
      parent.name === identifier
    )
      return false;
    return ![
      K.LabeledStatement,
      K.BreakStatement,
      K.ContinueStatement,
      K.MetaProperty,
    ].includes(parent.kind);
  };
  const keys = new Map();
  const key = (identifier) => {
    if (keys.has(identifier)) return keys.get(identifier);
    let declared = null;
    let found = `\0${identifier.text}`;
    if (home.has(identifier))
      declared = scopes.get(home.get(identifier)).get(identifier.text);
    else if (reference(identifier))
      for (let at = identifier.parent; at && !declared; at = at.parent)
        declared = scopes.get(at)?.get(identifier.text) ?? null;
    if (home.has(identifier) || reference(identifier))
      found = declared
        ? `${identifier.text}@${declared.pos}`
        : `${identifier.text}@`;
    keys.set(identifier, found);
    return found;
  };
  return { key, reference, redeclared };
};
/** The text a node is fixed to in a file: a literal's own, and that of a
 * name declared with `const` or `let`, to a literal, that the file never
 * gives another value (by an assignment of any kind, an increment or a
 * loop). Undefined for anything else: a `var`, which a use can come
 * before; a name given a second value; a name that stands for another
 * declaration than the one with the text. Its `assigned` are the names the
 * file gives another value after declaring them. */
const fixedTexts = (file, key) => {
  const { SyntaxKind: K, NodeFlags } = sourceSyntax();
  const literal = (node) =>
    node?.kind === K.StringLiteral ||
    node?.kind === K.NoSubstitutionTemplateLiteral;
  const constants = new Map();
  const assigned = new Set();
  const assign = (left) => {
    for (const target of assignmentTargets(K, left, [], false))
      assigned.add(key(target));
  };
  for (const node of sourceNodes(file)) {
    if (
      node.kind === K.VariableDeclaration &&
      node.name.kind === K.Identifier &&
      literal(node.initializer) &&
      node.parent.kind === K.VariableDeclarationList &&
      node.parent.flags & (NodeFlags.Let | NodeFlags.Const)
    )
      constants.set(key(node.name), node.initializer.text);
    if (node.kind === K.BinaryExpression && assigns(K, node.operatorToken))
      assign(node.left);
    if (
      [K.PrefixUnaryExpression, K.PostfixUnaryExpression].includes(node.kind) &&
      [K.PlusPlusToken, K.MinusMinusToken].includes(node.operator)
    )
      assign(node.operand);
    if (
      [K.ForOfStatement, K.ForInStatement].includes(node.kind) &&
      node.initializer.kind !== K.VariableDeclarationList
    )
      assign(node.initializer);
  }
  return Object.assign(
    (node) =>
      literal(node)
        ? node.text
        : node?.kind === K.Identifier && !assigned.has(key(node))
          ? constants.get(key(node))
          : undefined,
    { assigned },
  );
};
/** The kinds of node whose body runs when it is called, not where it is
 * written. */
const functionKinds = (K) =>
  new Set([
    K.ArrowFunction,
    K.FunctionExpression,
    K.FunctionDeclaration,
    K.MethodDeclaration,
    K.Constructor,
    K.GetAccessor,
    K.SetAccessor,
  ]);
/** The registering exports of a module a suite imports, or null for a
 * module that registers nothing: node:test, and the shard helper by its
 * file's name wherever the suite stands. */
const registeringExports = (specifier) =>
  specifier === "node:test"
    ? REGISTERING
    : /(?:^|\/)test-shards\.mjs$/u.test(specifier)
      ? SHARD_REGISTERING
      : null;
/** How a read suite file registers its cases. Every name is read as the
 * declaration it stands for (`fileBindings`), so the tables here hold
 * declarations and two things of one spelling are two. `names` maps each
 * declaration a case is registered through to the place of the title among
 * its arguments. They are `test` where the file does not show what it is
 * (undeclared, imported from any module, or taken at the top level out of
 * a call's result), whatever the file imports from node:test or from the
 * shard helper (the default export under any name; a registering export
 * under any alias; a member of the module's namespace, of a registrar or of
 * the module awaited where it is imported, to any depth, taken by a member
 * access, by a literal key or by a destructuring), and the file's own
 * functions that hand a parameter on to one of these as its title, found to
 * a fixed point, so a function declared after its caller is one too.
 * `registration` answers, for a call or a tagged template, the node of its
 * title where it registers a case (null where it names none the rule can
 * read) and undefined where it registers nothing. */
function registrars(read) {
  const K = sourceSyntax().SyntaxKind;
  const { key, reference, redeclared } = fileBindings(read.file);
  const fixed = fixedTexts(read.file, key);
  // A name the file gives a second value, by an assignment or by declaring
  // it again, is not read as what its first value was: it is no registrar,
  // no namespace and no function of the file's whose calls are counted.
  // Where one of its values names a registrar it is a derived name, below.
  const mutable = (name) => fixed.assigned.has(name) || redeclared.has(name);
  const FUNCTIONS = functionKinds(K);
  const holdsCall = (value) => {
    let any = false;
    const visit = (node) => {
      if (any || FUNCTIONS.has(node.kind)) return;
      if (node.kind === K.CallExpression) any = true;
      else node.forEachChild(visit);
    };
    visit(value);
    return any;
  };
  // `test` is read as a registrar by its name where the file declares no
  // such name. Where it imports one from a module that is not the test
  // module, or takes one at its top level out of a call's result, what it
  // is cannot be read: such a `test` is a derived name (`unshown`, made
  // one below unless a read form shows it to be a registrar), so what is
  // called through it is counted as unread and never reported. A `test`
  // the file declares otherwise, a parameter, a local, a function of its
  // own, is what it is declared as.
  const names = new Map([["test@", 0]]);
  const unshown = [];
  const patternNames = (pattern, into = []) => {
    if (pattern.kind === K.Identifier) into.push(pattern);
    else
      for (const element of pattern.elements ?? [])
        if (element.name) patternNames(element.name, into);
    return into;
  };
  for (const statement of read.file.statements) {
    const seeded =
      statement.kind === K.ImportDeclaration
        ? registeringExports(statement.moduleSpecifier.text)
          ? []
          : [
              statement.importClause?.name,
              ...(statement.importClause?.namedBindings?.elements ?? []).map(
                (element) => element.name,
              ),
            ]
        : statement.kind === K.VariableStatement
          ? statement.declarationList.declarations
              .filter(
                (declaration) =>
                  declaration.initializer && holdsCall(declaration.initializer),
              )
              .flatMap((declaration) => patternNames(declaration.name))
          : [];
    for (const name of seeded)
      if (name?.text === "test") unshown.push(key(name));
  }
  const namespaces = new Map();
  // Names the file makes from the test module, a registrar or a namespace
  // in a way that is none of the forms read here (found last, below).
  const derived = new Set();
  for (const statement of read.file.statements) {
    if (statement.kind !== K.ImportDeclaration) continue;
    const registering = registeringExports(statement.moduleSpecifier.text);
    if (!registering) continue;
    const clause = statement.importClause;
    if (clause?.name) names.set(key(clause.name), 0);
    const bindings = clause?.namedBindings;
    if (bindings?.kind === K.NamespaceImport)
      namespaces.set(key(bindings.name), registering);
    else
      for (const element of bindings?.elements ?? [])
        if (registering.has((element.propertyName ?? element.name).text))
          names.set(key(element.name), 0);
  }
  // What an expression is where it is a registrar by the forms read here:
  // a name of one, a registering export of a namespace or of the module
  // awaited in place, or a member of any of these, to any depth, that is
  // no hook and no utility (`test.skip`, `ns.test`, `ns["test"]["skip"]`,
  // `test.describe.only`). It answers the place of the title among the
  // arguments, and the name at its root where that is one of `names`.
  const registrar = (expression) => {
    const chain = [];
    let root = bare(K, expression);
    for (
      let taken = spelledMember(K, root);
      taken;
      taken = spelledMember(K, root)
    ) {
      chain.unshift(taken.name);
      root = taken.object;
    }
    const module = awaitedImport(K, root, fixed);
    const exported =
      root.kind === K.Identifier && namespaces.has(key(root))
        ? namespaces.get(key(root))
        : module !== undefined
          ? registeringExports(module)
          : undefined;
    if (exported !== undefined)
      return exported &&
        chain.length &&
        exported.has(chain[0]) &&
        !chain.slice(1).some((name) => NOT_REGISTERING.has(name))
        ? { index: 0 }
        : undefined;
    return root.kind === K.Identifier &&
      names.has(key(root)) &&
      !chain.some((name) => NOT_REGISTERING.has(name))
      ? { index: names.get(key(root)), root: key(root) }
      : undefined;
  };
  // A registrar used as a template's tag registers a case too, under no
  // title the rule can read.
  const calleeOf = (call) =>
    call.kind === K.TaggedTemplateExpression ? call.tag : call.expression;
  const registration = (call) => {
    const direct = registrar(calleeOf(call));
    if (direct) return call.arguments?.[direct.index] ?? null;
    // None of the read forms. A callee that still reaches a registrar
    // registers a case the rule cannot read, which is counted as unread
    // and never passed over: a derived name or a member of one; a member
    // of a registrar or of a namespace taken by a computed key, which may
    // be any of them; and any other expression that names the test module,
    // a registrar, a namespace or a derived name (one of two chosen in
    // place, the last of a sequence, an element of a list). A hook or a
    // utility taken by its spelled name registers nothing.
    let root = bare(K, calleeOf(call));
    let computed = false;
    let spared = false;
    for (;;) {
      const taken = spelledMember(K, root);
      if (taken) {
        spared ||= NOT_REGISTERING.has(taken.name);
        root = taken.object;
      } else if (root.kind === K.ElementAccessExpression) {
        computed = true;
        root = bare(K, root.expression);
      } else break;
    }
    if (root.kind === K.Identifier && derived.has(key(root))) return null;
    if (spared) return undefined;
    if (root.kind === K.Identifier)
      return computed && (names.has(key(root)) || namespaces.has(key(root)))
        ? null
        : undefined;
    return mentions(root) ? null : undefined;
  };
  // The file's own functions, wherever they are declared.
  const functions = [];
  const inner = new Map();
  for (const node of sourceNodes(read.file)) {
    if (
      node.kind === K.FunctionDeclaration &&
      node.name &&
      node.body &&
      !mutable(key(node.name))
    )
      functions.push([key(node.name), node]);
    if (
      node.kind === K.VariableDeclaration &&
      node.name.kind === K.Identifier &&
      [K.ArrowFunction, K.FunctionExpression].includes(
        node.initializer?.kind,
      ) &&
      !mutable(key(node.name))
    ) {
      functions.push([key(node.name), node.initializer]);
      // The name a function expression has inside itself is that function.
      if (node.initializer.name)
        inner.set(key(node.name), key(node.initializer.name));
    }
  }
  // Whether a value names the test module, a registrar, a namespace or a
  // derived name: what makes a name derived (below), and a callee unread.
  const own = new Set(functions.map(([name]) => name));
  const mentions = (value) => {
    let found = false;
    const visit = (node) => {
      if (found) return;
      // A function written inside the value has parameters of its own,
      // which may bear a registrar's name; what it holds is not the value.
      if (
        [
          K.ArrowFunction,
          K.FunctionExpression,
          K.FunctionDeclaration,
          K.MethodDeclaration,
        ].includes(node.kind)
      )
        return;
      // The result of a registration is no registrar, and its arguments
      // are the case's own.
      if (
        [K.CallExpression, K.TaggedTemplateExpression].includes(node.kind) &&
        registration(node) !== undefined
      )
        return;
      // A module that registers, imported or required in place by a
      // specifier the file fixes; and the test module handed by its name
      // to any call at all, which is how it is required under another name
      // or asked of the process. A path in a list is neither.
      if (node.kind === K.CallExpression) {
        const callee = node.expression;
        const loads =
          callee.kind === K.ImportKeyword ||
          (callee.kind === K.Identifier && callee.text === "require");
        if (
          node.arguments.some((argument) => {
            const specifier = fixed(argument);
            return (
              specifier !== undefined &&
              (specifier === "node:test" ||
                (loads && registeringExports(specifier)))
            );
          })
        ) {
          found = true;
          return;
        }
      }
      if (
        node.kind === K.Identifier &&
        reference(node) &&
        !own.has(key(node)) &&
        (names.has(key(node)) ||
          namespaces.has(key(node)) ||
          derived.has(key(node)))
      ) {
        found = true;
        return;
      }
      // A member's name and a property's key are no uses of a name, and
      // a hook or a utility taken from a registrar is no registrar.
      if (node.kind === K.PropertyAccessExpression) {
        if (!NOT_REGISTERING.has(node.name.text)) visit(node.expression);
      } else if (node.kind === K.PropertyAssignment) visit(node.initializer);
      else node.forEachChild(visit);
    };
    visit(value);
    return found;
  };
  // What one call of a registrar registers at the top level: for node:test's
  // own, its first argument once; for a function of the file's, each
  // argument its body hands on as a title, as often as the body hands that
  // parameter on (a hand-on inside a loop counting twice, and one to
  // another such function as often as that one registers). What stands
  // inside a registration's own arguments is a nested case and is not read.
  const forwards = new Map();
  // A registrar under another name: a variable initialized with one, with
  // a member of one or with a registering member of a namespace registers
  // as it does, and so does a name given to one of the file's own
  // functions that hands a title on. Read until nothing is added, so that
  // a name given to such a name is one too; it answers whether it added
  // any, since a function found to hand a title on may have a name of this
  // kind that was not one a round before.
  const aliases = () => {
    let any = false;
    for (let added = true; added;) {
      added = false;
      for (const node of sourceNodes(read.file)) {
        if (node.kind !== K.VariableDeclaration || !node.initializer) continue;
        const source = bare(K, node.initializer);
        const imported = awaitedImport(K, source, fixed);
        if (node.name.kind === K.ObjectBindingPattern) {
          // A destructuring gives each registering member a name of the
          // file's own: of a module's namespace, of the module awaited
          // where it is imported, or of a registrar.
          const registering =
            source.kind === K.Identifier && namespaces.has(key(source))
              ? namespaces.get(key(source))
              : imported !== undefined
                ? registeringExports(imported)
                : registrar(source)
                  ? REGISTERING
                  : null;
          for (const element of registering ? node.name.elements : []) {
            if (
              element.name.kind !== K.Identifier ||
              names.has(key(element.name)) ||
              mutable(key(element.name)) ||
              !registering.has((element.propertyName ?? element.name).text)
            )
              continue;
            names.set(key(element.name), 0);
            added = any = true;
          }
          continue;
        }
        if (
          node.name.kind !== K.Identifier ||
          names.has(key(node.name)) ||
          mutable(key(node.name))
        )
          continue;
        // A name given to a module's namespace, or to the module awaited
        // where it is imported, is that namespace under the name, and a
        // name given to that one is too.
        const namespace =
          source.kind === K.Identifier && namespaces.has(key(source))
            ? namespaces.get(key(source))
            : imported !== undefined
              ? registeringExports(imported)
              : undefined;
        if (namespace !== undefined) {
          if (namespace && !namespaces.has(key(node.name))) {
            namespaces.set(key(node.name), namespace);
            added = any = true;
          }
          continue;
        }
        const given = registrar(source);
        if (given) {
          names.set(key(node.name), given.index);
          if (given.root && forwards.has(given.root))
            forwards.set(key(node.name), forwards.get(given.root));
          added = any = true;
        }
      }
    }
    return any;
  };
  aliases();
  // Each name a variable gives to another name, as [the name, what it was
  // given]: a function's forwarding, read again in a later round, is its
  // alias's too.
  const aliasTargets = () =>
    [...sourceNodes(read.file)]
      .filter(
        (node) =>
          node.kind === K.VariableDeclaration &&
          node.name.kind === K.Identifier &&
          node.initializer &&
          bare(K, node.initializer).kind === K.Identifier,
      )
      .map((node) => [key(node.name), key(bare(K, node.initializer))]);
  const registrations = (call) => {
    const first = registration(call);
    if (first === undefined) return undefined;
    // A function's name is the name whether or not it is written in
    // parentheses, here as where its call sites are collected.
    const callee = bare(K, calleeOf(call));
    const own =
      callee.kind === K.Identifier ? forwards.get(key(callee)) : undefined;
    return own
      ? [...own].map(([index, times]) => ({
          title: call.arguments?.[index] ?? null,
          times,
        }))
      : [{ title: first, times: 1 }];
  };
  const LOOPS = loopKinds(K);
  const handsOn = (body, parameters) => {
    const handed = new Map();
    const visit = (node, weight) => {
      if (node.kind === K.CallExpression) {
        const registered = registrations(node);
        if (registered) {
          for (const { title, times } of registered) {
            const index =
              title?.kind === K.Identifier
                ? parameters.indexOf(key(title))
                : -1;
            if (index >= 0)
              handed.set(
                index,
                Math.min(1_000_000, (handed.get(index) ?? 0) + weight * times),
              );
          }
          // The callee is read; the arguments are the case's own.
          visit(node.expression, weight);
          return;
        }
        const callee = node.expression;
        if (ITERATING.has(spelledMember(K, bare(K, callee))?.name)) {
          visit(callee, weight);
          for (const argument of node.arguments) visit(argument, 2);
          return;
        }
      }
      const inner = LOOPS.has(node.kind) ? 2 : weight;
      node.forEachChild((child) => visit(child, inner));
    };
    visit(body, 1);
    return handed;
  };
  // Every function is read again until no reading changes: one that hands
  // a title on through a function declared after it is known for what it
  // is only once that one is. A function that hands a title to itself
  // never settles; the rounds end and leave it at a count above one.
  const settled = (handed, before) =>
    handed.size === before?.size &&
    [...handed].every(([index, times]) => before.get(index) === times);
  for (
    let round = 0, grew = true;
    grew && round <= functions.length + 1;
    round++
  ) {
    grew = false;
    for (const [name, written] of functions) {
      const handed = handsOn(
        written.body,
        written.parameters.map((parameter) =>
          parameter.name.kind === K.Identifier ? key(parameter.name) : null,
        ),
      );
      if (!handed.size || settled(handed, forwards.get(name))) continue;
      names.set(name, [...handed.keys()][0]);
      forwards.set(name, handed);
      if (inner.has(name)) {
        names.set(inner.get(name), [...handed.keys()][0]);
        forwards.set(inner.get(name), handed);
      }
      grew = true;
    }
    // A name given to a function this round found, or whose forwarding
    // this round changed.
    for (const [alias, target] of aliasTargets())
      if (
        forwards.has(target) &&
        forwards.get(alias) !== forwards.get(target)
      ) {
        forwards.set(alias, forwards.get(target));
        grew = true;
      }
    if (aliases()) grew = true;
  }
  // The stopping condition of this reading. A name the file declares or
  // assigns with a value that mentions the test module, a registrar, a
  // namespace or another such name, and that is none of the forms read
  // above, is derived: a conditional, a container, a wrapper's result, a
  // required module, a reassignment. What is registered through it is
  // counted as unread. The rule stays silent only where a registrar
  // reaches a call by a route no declaration or assignment of the file
  // or callee names: a function's parameter or return value, a global,
  // another module, and a module loaded by a specifier the file computes.
  const bound = (name, into) => {
    if (name.kind === K.Identifier) into.push(key(name));
    else
      for (const element of name.elements ?? [])
        if (element.name) bound(element.name, into);
    return into;
  };
  for (const name of unshown)
    if (!names.has(name) && !namespaces.has(name) && !own.has(name))
      derived.add(name);
  for (let grew = true; grew;) {
    grew = false;
    const give = (name, value) => {
      if (
        names.has(name) ||
        namespaces.has(name) ||
        derived.has(name) ||
        own.has(name) ||
        !mentions(value)
      )
        return;
      derived.add(name);
      grew = true;
    };
    for (const node of sourceNodes(read.file)) {
      if (
        node.kind === K.VariableDeclaration &&
        node.initializer &&
        ![K.ArrowFunction, K.FunctionExpression].includes(node.initializer.kind)
      )
        for (const name of bound(node.name, [])) give(name, node.initializer);
      // An assignment of any kind, to a name, to the names of a
      // destructuring or to a member of an object, which is then reached
      // through the object.
      if (node.kind === K.BinaryExpression && assigns(K, node.operatorToken))
        for (const target of assignmentTargets(K, node.left))
          give(key(target), node.right);
      // A class that holds one in a field, by its declared name or by
      // the name its expression has inside itself, and a namespace that
      // holds one; a module imported by an assignment.
      if (
        [K.ClassDeclaration, K.ClassExpression].includes(node.kind) &&
        node.name
      )
        give(key(node.name), node);
      // What a catch clause binds, where its try block names one as a
      // value: it may be what was thrown.
      if (
        node.kind === K.CatchClause &&
        node.variableDeclaration &&
        node.parent.kind === K.TryStatement
      )
        for (const name of bound(node.variableDeclaration.name, []))
          give(name, node.parent.tryBlock);
      if (
        node.kind === K.ModuleDeclaration &&
        node.name.kind === K.Identifier &&
        node.body
      )
        give(key(node.name), node.body);
      if (
        node.kind === K.ImportEqualsDeclaration &&
        node.moduleReference.kind === K.ExternalModuleReference &&
        registeringExports(fixed(node.moduleReference.expression) ?? "")
      )
        derived.add(key(node.name));
      // A loop's variable, where the loop runs over them.
      if (
        [K.ForOfStatement, K.ForInStatement].includes(node.kind) &&
        node.initializer.kind === K.VariableDeclarationList
      )
        for (const declaration of node.initializer.declarations)
          for (const name of bound(declaration.name, []))
            give(name, node.expression);
    }
  }
  return { registrations, functions, fixed, key, reference };
}
/** The statements that can run their body more than once, and the array
 * methods that can call what they are handed more than once. */
const loopKinds = (K) =>
  new Set([
    K.ForStatement,
    K.ForOfStatement,
    K.ForInStatement,
    K.WhileStatement,
    K.DoStatement,
  ]);
const ITERATING = new Set([
  "forEach",
  "map",
  "flatMap",
  "filter",
  "find",
  "some",
  "every",
  "reduce",
]);
/** The titles a read suite file registers at its top level, where a name
 * pattern selects a case, each as often as the file's text can register it.
 * The reading is of the text, not of what runs: every call that registers a
 * case counts unless it stands inside another such call's arguments, which
 * is a nested case, or inside a string, which is no code. So a registration
 * in a block, a guard, a `switch`, an expression or a function the module
 * calls is one; one inside a loop, or inside the callback an array's
 * iteration is handed, counts twice, since it can run more than once; and
 * one inside a function of the file's own counts once for each time the
 * file's text calls that function, a call made inside another such function
 * counting as often as that one is called in turn; and a call of a function
 * that hands arguments on as titles counts each as often as that function
 * registers it at the top level, a case it registers inside another's body
 * being nested and not counted. A title is a string, a template with no
 * substitution, or a name the file binds once to either; a title built
 * from a substitution is not read. Two registrations of one title on
 * branches that never both run are counted as two, which asks an author
 * for two titles and never hides a repeat. */
function topLevelTitles(read) {
  const K = sourceSyntax().SyntaxKind;
  const { registrations, functions, fixed, key, reference } = registrars(read);
  const literal = (node) => (node ? fixed(node) : undefined);
  const LOOPS = loopKinds(K);
  const FUNCTIONS = functionKinds(K);
  // The file's own functions: a registration inside one happens where the
  // function is called, as often as it is called. That holds for one that
  // also hands a title on: the title it is handed is counted at its call,
  // and a title its body fixes is counted at each call too.
  const owners = new Map(functions.map(([name, written]) => [written, name]));
  const owned = new Set(owners.values());
  // Another name for one of those functions (`const check = register`) is
  // that function wherever it is called or handed on, and so is a name
  // given to such a name: a call through it is a call of the function, and
  // counts toward how often the titles its body fixes are registered.
  const known = new Map([...owned].map((name) => [name, name]));
  // The name a function expression has inside itself is that function.
  for (const [written, name] of owners)
    if (written.kind === K.FunctionExpression && written.name)
      known.set(key(written.name), name);
  for (let added = true; added;) {
    added = false;
    for (const node of sourceNodes(read.file))
      if (
        node.kind === K.VariableDeclaration &&
        node.name.kind === K.Identifier &&
        node.initializer &&
        bare(K, node.initializer).kind === K.Identifier &&
        !known.has(key(node.name)) &&
        known.has(key(bare(K, node.initializer)))
      ) {
        known.set(key(node.name), known.get(key(bare(K, node.initializer))));
        added = true;
      }
  }
  const sites = [];
  const found = [];
  // Registrations whose title the reading cannot give: one built at run
  // time, or none at all. They are counted and shown, never taken as
  // cleared. A parameter a function hands on is no such title: it is read
  // at that function's calls.
  const parametersOf = new Map(
    functions.map(([name, written]) => [
      name,
      written.parameters.map((parameter) =>
        parameter.name.kind === K.Identifier ? key(parameter.name) : null,
      ),
    ]),
  );
  let unread = 0;
  // The file's functions that a registration is handed by name as its body:
  // what such a function registers is nested in that case, and is counted
  // at the top level only where the file also calls it.
  const bodies = new Set();
  // How often a body runs is known at the top level (once), in one of the
  // file's own named functions (as often as the file calls it), in a
  // function called where it is written (once) and in one handed to a
  // listed iteration (counted twice). Any other function's body, a
  // method's, a property's, a callback's handed to anything else, an
  // instance field's value, runs as often as something the rule does not
  // read calls it: what registers there is counted as unread. `entered`
  // are the functions of the two known kinds; `uncountable` the file's own
  // functions whose calls cannot all be seen, because one is named other
  // than to call it or is called from a body of the unknown kind.
  const entered = new Set();
  const uncountable = new Set();
  const perInstance = (node) =>
    node.kind === K.PropertyDeclaration &&
    !node.modifiers?.some((modifier) => modifier.kind === K.StaticKeyword);
  // A use of one of the file's functions by its name that is no call of
  // it and no declaration, alias or export of it.
  const escapes = (node) => {
    let inner = node;
    let parent = node.parent;
    while (parent?.kind === K.ParenthesizedExpression) {
      inner = parent;
      parent = parent.parent;
    }
    if (!parent) return false;
    if (
      [K.VariableDeclaration, K.FunctionDeclaration].includes(parent.kind) ||
      [K.FunctionExpression, K.ClassDeclaration].includes(parent.kind)
    )
      return false;
    if (
      [
        K.Parameter,
        K.BindingElement,
        K.ExportSpecifier,
        K.TypeQuery,
        K.TypeReference,
      ].includes(parent.kind)
    )
      return false;
    if (parent.kind === K.CallExpression && parent.expression === inner)
      return false;
    if (
      [K.PropertyAccessExpression, K.PropertyAssignment].includes(
        parent.kind,
      ) &&
      parent.name === node
    )
      return false;
    // Handed to a listed iteration by its name: counted there.
    if (
      parent.kind === K.CallExpression &&
      ITERATING.has(spelledMember(K, bare(K, parent.expression))?.name)
    )
      return false;
    return true;
  };
  const visit = (node, weight, owner, counted = true) => {
    if (
      node.kind === K.Identifier &&
      reference(node) &&
      known.has(key(node)) &&
      escapes(node)
    )
      uncountable.add(known.get(key(node)));
    if (node.kind === K.TaggedTemplateExpression && registrations(node)) {
      unread += 1;
      visit(node.tag, weight, owner, counted);
      return;
    }
    if (node.kind === K.CallExpression) {
      // A function called where it is written runs once there.
      {
        const called = bare(K, node.expression);
        if ([K.ArrowFunction, K.FunctionExpression].includes(called.kind))
          entered.add(called);
      }
      // A call of one of the file's functions is a call site of it,
      // whether or not it hands a title on, and whether or not its name is
      // written in parentheses, which the reading of a name's other uses
      // sets aside too.
      const site = bare(K, node.expression);
      if (site.kind === K.Identifier && known.has(key(site))) {
        sites.push({ callee: known.get(key(site)), weight, owner });
        if (!counted) uncountable.add(known.get(key(site)));
      }
      const registered = registrations(node);
      if (registered) {
        // A function of the file's registers each title it hands on, as
        // often as it hands it on, at each call of it.
        for (const { title, times } of registered) {
          const text = literal(title);
          if (text !== undefined)
            found.push({ title: text, weight: weight * times, owner, counted });
          else if (!(
            title?.kind === K.Identifier &&
            owner &&
            parametersOf.get(owner)?.includes(key(title))
          ))
            unread += 1;
        }
        // A function of the file's that the case's own body names, to
        // call it or to hand it on (to an iteration, say), is nested in
        // that case as one handed to the case by name is: what it
        // registers there is no top-level title. A property of that name
        // is another thing and is not read.
        const nested = (inside) => {
          if (inside.kind === K.PropertyAccessExpression)
            return nested(inside.expression);
          if (
            inside.kind === K.Identifier &&
            reference(inside) &&
            known.has(key(inside))
          )
            bodies.add(known.get(key(inside)));
          inside.forEachChild(nested);
        };
        // An argument runs when the registration is made, up to the first
        // function written in it. A registration made there, a function
        // called where it is written and a call of one of the file's
        // functions run at this level, as the same call on a line of its
        // own would, and what they register is counted here. A function
        // written in an argument and not called there is the case's own,
        // with every function it names; so is one named and not called.
        const eager = (inside) => {
          if ([K.ArrowFunction, K.FunctionExpression].includes(inside.kind)) {
            nested(inside);
            return;
          }
          if (inside.kind === K.CallExpression) {
            const called = bare(K, inside.expression);
            if (
              registrations(inside) ||
              [K.ArrowFunction, K.FunctionExpression].includes(called.kind)
            ) {
              visit(inside, weight, owner, counted);
              return;
            }
            if (called.kind === K.Identifier && known.has(key(called))) {
              sites.push({ callee: known.get(key(called)), weight, owner });
              if (!counted) uncountable.add(known.get(key(called)));
              for (const handed of inside.arguments) eager(handed);
              return;
            }
          }
          if (inside.kind === K.PropertyAccessExpression) {
            eager(inside.expression);
            return;
          }
          if (
            inside.kind === K.Identifier &&
            reference(inside) &&
            known.has(key(inside))
          ) {
            bodies.add(known.get(key(inside)));
            return;
          }
          inside.forEachChild(eager);
        };
        for (const argument of node.arguments)
          if (argument.kind === K.Identifier && known.has(key(argument)))
            bodies.add(known.get(key(argument)));
          else eager(argument);
        // The callee is read; a function the arguments hold is the case's
        // own.
        visit(node.expression, weight, owner, counted);
        return;
      }
      const callee = node.expression;
      if (ITERATING.has(spelledMember(K, bare(K, callee))?.name)) {
        visit(callee, weight, owner, counted);
        for (const argument of node.arguments) {
          // A function handed to an iteration by its name is called as
          // often as the iteration runs.
          const handed = bare(K, argument);
          if (handed.kind === K.Identifier && known.has(key(handed))) {
            sites.push({
              callee: known.get(key(handed)),
              weight: 2,
              owner,
            });
            if (!counted) uncountable.add(known.get(key(handed)));
          }
          if (FUNCTIONS.has(bare(K, argument).kind))
            entered.add(bare(K, argument));
          visit(argument, 2, owner, counted);
        }
        return;
      }
    }
    const inner = LOOPS.has(node.kind) ? 2 : weight;
    const within = owners.has(node) ? owners.get(node) : owner;
    // One of the file's own functions is read at the weight of one call
    // of it, and counted by its calls; a body of the unknown kind is not.
    const here = owners.has(node)
      ? true
      : (FUNCTIONS.has(node.kind) && !entered.has(node)) || perInstance(node)
        ? false
        : counted;
    node.forEachChild((child) =>
      visit(child, owners.has(node) ? 1 : inner, within, here),
    );
  };
  visit(read.file, 1, null);
  // A function called from one whose calls cannot all be seen is one too.
  for (let grew = true; grew;) {
    grew = false;
    for (const site of sites)
      if (
        site.owner &&
        uncountable.has(site.owner) &&
        !uncountable.has(site.callee)
      ) {
        uncountable.add(site.callee);
        grew = true;
      }
  }
  // How often each of those functions is called: the sum over its call
  // sites of the site's weight, times how often the function the site
  // stands in is called. A function the file never calls counts once,
  // save one it hands to a registration as that case's body, which then
  // registers nothing at the top level. The sums settle in as many rounds
  // as the calls nest; a function that calls itself never settles, and is
  // left at a count above one.
  const called = new Map([...owners.values()].map((name) => [name, 1]));
  for (let round = 0; round <= called.size; round++) {
    let moved = false;
    for (const name of called.keys()) {
      const own = sites.filter((site) => site.callee === name);
      const count = own.length
        ? Math.min(
            1_000_000,
            own.reduce(
              (sum, site) =>
                sum + site.weight * (site.owner ? called.get(site.owner) : 1),
              0,
            ),
          )
        : bodies.has(name)
          ? 0
          : 1;
      if (count !== called.get(name)) {
        called.set(name, count);
        moved = true;
      }
    }
    if (!moved) break;
  }
  const counts = new Map();
  for (const { title, weight, owner, counted } of found) {
    // A title whose registration runs an unknown number of times is one
    // the rule cannot judge.
    if (!counted || (owner && uncountable.has(owner))) {
      unread += 1;
      continue;
    }
    counts.set(
      title,
      (counts.get(title) ?? 0) + weight * (owner ? called.get(owner) : 1),
    );
  }
  return { counts, unread };
}
/** What each suite file of a batch registers when node loads it: its own
 * top-level registrations with those of every suite file of the batch it
 * loads, by an import declaration or a re-export at any depth. Importing a
 * suite file runs it, so its cases register under the file that imported
 * it; a file reached along two chains is one module and registers once. A
 * typed file names its neighbour by the `.js` its build writes. A module
 * outside the batch is not followed: what it registers is a registration
 * another module holds, which the rule does not read. The files are read
 * as one batch, one start of the reader. */
const loadedTitles = (inputs) => {
  const reads = sourceTrees(inputs);
  const own = new Map(
    reads.map((read, index) => [
      read.path,
      { ...topLevelTitles(read), source: inputs[index].source },
    ]),
  );
  const held = (path) =>
    own.has(path)
      ? path
      : path.endsWith(".js") && own.has(`${path.slice(0, -3)}.ts`)
        ? `${path.slice(0, -3)}.ts`
        : null;
  const loaded = (path, seen = new Set()) => {
    if (seen.has(path)) return seen;
    seen.add(path);
    for (const specifier of sourceImports(own.get(path).source, {
      dynamic: false,
    })) {
      const target = specifier.startsWith(".")
        ? held(join(dirname(path), specifier))
        : null;
      if (target) loaded(target, seen);
    }
    return seen;
  };
  return reads.map((read) => {
    const counts = new Map();
    let unread = 0;
    for (const path of loaded(read.path)) {
      const file = own.get(path);
      unread += file.unread;
      for (const [title, count] of file.counts)
        counts.set(title, (counts.get(title) ?? 0) + count);
    }
    return { path: read.path, counts, unread };
  });
};
/** `<file>: <title>` for each title one of the given suite files can
 * register more than once at its top level, the suite files it loads
 * counted with it. */
const duplicateTitles = (inputs) =>
  loadedTitles(inputs).flatMap(({ path, counts }) =>
    [...counts]
      .filter(([, count]) => count > 1)
      .map(([title]) => `${path}: ${title}`),
  );
/** `<file>: <count>` for each suite file with top-level registrations whose
 * title the rule cannot read. The rule clears no such registration: the
 * case that runs it prints these, so a reader of its output sees what was
 * not judged. */
const unreadTitles = (inputs) =>
  sourceTrees(inputs).flatMap((read) => {
    const { unread } = topLevelTitles(read);
    return unread ? [`${read.path}: ${unread}`] : [];
  });

// Every name the rule reads is resolved to its declaration (fileBindings):
// its tables hold declarations, so two things of one spelling are two.
// A corpus of small suite files. What each registers at its top level is not
// written here: the case below runs each under node and reads the titles
// node reports, so the rule is held to what node does and not to what its
// author expects. `overstated` names the titles the rule reports although
// node registers each once: registrations on branches that never both run.
// So the rule's forms are of three kinds, and the corpus shows the first
// two by example and does not claim to list every form there is: forms it
// reads exactly as node registers them (a direct call, a function the
// module calls, an iteration, a statement, an import under any name, a
// wrapper of the file's own); forms it overstates on purpose, asking for
// two titles where node would register one (alternative branches); and
// forms it does not read (a title built from a substitution, a
// registration made by a function another module holds), which no file
// here holds and which the rule therefore neither reports nor clears. A
// suite file that loads another suite file is read with it; the case holds
// that form to node with two files of its own, since a corpus file is one.
const SHARD_HELPER = JSON.stringify(
  pathToFileURL(join(root, "scripts/lib/test-shards.mjs")).href,
);
// The declared family (the twenty-sixth critic's third point): every way a
// name comes to be a registrar or a module's namespace, crossed with every
// way a case is then registered through it, and each of those again with
// every member access written as a literal key. The members are node's
// own: each registering member the node this runs under has, so what a
// member registers is held to node and not to a list written here. Each
// file registers one title twice and another once, and the case holds the
// rule to what node reports for every one of them, so a form is covered by
// standing here and not by an example somebody thought of.
const TITLE_FAMILY = (() => {
  const held = HELD_REGISTERING.filter(
    (member) => typeof test[member] === "function",
  );
  const body = (member) =>
    member === "expectFailure"
      ? '() => { throw new Error("expected"); }'
      : "() => {}";
  const registrar = {
    "a default import": ['import r from "node:test";'],
    "a named import": ['import { test as r } from "node:test";'],
    "a member of a namespace": [
      'import * as n from "node:test";',
      "const r = n.test;",
    ],
    "a destructured namespace": [
      'import * as n from "node:test";',
      "const { test: r } = n;",
    ],
    "a destructured awaited import": [
      'const { test: r } = await import("node:test");',
    ],
    "the default of an awaited import": [
      'const { default: r } = await import("node:test");',
    ],
    "an alias of an alias": [
      'import test from "node:test";',
      "const a = test;",
      "const r = a;",
    ],
    "a member of an awaited namespace": [
      'const n = await import("node:test");',
      "const r = n.test;",
    ],
    "a member of an aliased namespace": [
      'import * as n0 from "node:test";',
      "const n = n0;",
      "const r = n.test;",
    ],
    "a member of the module awaited in place": [
      'const r = (await import("node:test")).test;',
    ],
  };
  const namespace = {
    "a namespace import": ['import * as ns from "node:test";'],
    "an awaited namespace": ['const ns = await import("node:test");'],
    "an alias of a namespace": [
      'import * as n0 from "node:test";',
      "const ns = n0;",
    ],
    "an alias of an awaited namespace": [
      'const n0 = await import("node:test");',
      "const ns = n0;",
    ],
  };
  // How a title is registered: the lines before, and the call for a title.
  const throughRegistrar = {
    called: [[], (title) => `r(${title}, () => {});`],
    ...Object.fromEntries(
      held.map((member) => [
        `its ${member}`,
        [[], (title) => `r.${member}(${title}, ${body(member)});`],
      ]),
    ),
    "its describe's skip": [
      [],
      (title) => `r.describe.skip(${title}, () => {});`,
    ],
    "a name given to its skip": [
      ["const s = r.skip;"],
      (title) => `s(${title}, () => {});`,
    ],
    "its todo destructured": [
      ["const { todo: s } = r;"],
      (title) => `s(${title});`,
    ],
  };
  const throughNamespace = {
    ...Object.fromEntries(
      [...held, "default"].map((member) => [
        `its ${member}`,
        [[], (title) => `ns.${member}(${title}, ${body(member)});`],
      ]),
    ),
    "its test's skip": [[], (title) => `ns.test.skip(${title}, () => {});`],
    "a name given to its test": [
      ["const s = ns.test;"],
      (title) => `s(${title}, () => {});`,
    ],
    "a name given to its test's skip": [
      ["const s = ns.test.skip;"],
      (title) => `s(${title}, () => {});`,
    ],
    "its it destructured": [
      ["const { it: s } = ns;"],
      (title) => `s(${title}, () => {});`,
    ],
  };
  // A registering export imported by its own name is a registrar for a
  // call, and has no members of its own.
  const named = Object.fromEntries(
    held
      .filter((member) => member !== "test")
      .map((member) => [
        `a named import of ${member}`,
        [
          [`import { ${member} as r } from "node:test";`],
          (title) => `r(${title}, ${body(member)});`,
        ],
      ]),
  );
  const forms = [];
  for (const [bindings, uses] of [
    [registrar, throughRegistrar],
    [namespace, throughNamespace],
  ])
    for (const [binding, bindingLines] of Object.entries(bindings))
      for (const [use, [useLines, call]] of Object.entries(uses))
        forms.push([
          `${binding}, ${use}`,
          [...bindingLines, ...useLines],
          call,
        ]);
  for (const [form, [lines, call]] of Object.entries(named))
    forms.push([`${form}, called`, lines, call]);
  const files = [];
  for (const [form, lines, call] of forms) {
    const source = [...lines, call('"same"'), call('"same"'), call('"once"')];
    files.push({ name: `family-${files.length}`, form, source });
    // The same file with every member taken by a literal key.
    const keyed = source.map((line) =>
      line.replace(/(?<=[\w)\]])\.([A-Za-z]+)/gu, '["$1"]'),
    );
    if (keyed.join("\n") !== source.join("\n"))
      files.push({
        name: `family-${files.length}`,
        form: `${form}, by a literal key`,
        source: keyed,
      });
  }
  return Object.assign(files, {
    held,
    // The cross's size, from its own dimensions: ten bindings of a
    // registrar by the uses of one, four of a namespace by the uses of
    // one, and the named imports; and again by a literal key wherever a
    // form takes a member at all, which is every form but a member-free
    // binding (six of a registrar's ten, all four of a namespace's)
    // with a member-free use (two of a registrar's, one of a namespace's)
    // and the named imports.
    expected: (() => {
      const dotted =
        10 * (held.length + 4) + 4 * (held.length + 5) + (held.length - 1);
      return dotted + (dotted - 6 * 2 - 4 * 1 - (held.length - 1));
    })(),
  });
})();
// The boundary of the reading, held to node as well. It has two sides,
// and each file registers one title twice by a way from one of them.
// `unread` files: the rule reports no repeat it cannot prove and counts
// what it could not read (two registrations, or the number a file states).
// They are a registrar reached through a name the file derives from the
// test module in a way the rule does not read (an assignment of any kind,
// a container, a class's field, a loop over registrars, a wrapper's
// result, the module required or asked of the process under any name), or
// through a callee that reaches one by a computed key or by an expression
// that only names it; a registrar used as a template's tag; a title whose
// name is given a second value; and a registration in a body the rule
// cannot count the runs of (a method, a function kept in a property or a
// list, a callback handed to anything but a listed iteration, an instance
// field's value, one of the file's functions handed on by its name).
// `silent` files: the rule neither reports nor counts them, and they are
// the whole of what it is known not to see, a registrar that reaches a
// call by a route no declaration, assignment or callee of the file names:
// a function's parameter or return value, and a module loaded by a
// specifier the file computes (a global and another module are the same
// side, and no file here can hold them).
const TITLE_BOUNDARY = [
  {
    name: "boundary-thrown-and-caught",
    kind: "unread",
    source: [
      'import test from "node:test";',
      "try {",
      "  throw test;",
      "} catch (r) {",
      '  r("same", () => {});',
      '  r("same", () => {});',
      "}",
    ],
  },
  {
    // The two registrations, and the call of the method that makes them,
    // which is a call through a derived name too.
    name: "boundary-class-expression-by-its-own-name",
    kind: "unread",
    unread: 3,
    source: [
      'import test from "node:test";',
      "const Held = class Inner {",
      "  static r = test;",
      "  static twice() {",
      '    Inner.r("same", () => {});',
      '    Inner.r("same", () => {});',
      "  }",
      "};",
      "Held.twice();",
    ],
  },
  {
    // A title's name that stands, where it is used, for another declaration
    // than the one that holds a text.
    name: "boundary-title-name-declared-again",
    kind: "unread",
    repeats: ["title"],
    unread: 1,
    source: [
      'import test from "node:test";',
      'const title = "a";',
      "const inner = () => {",
      "  function title() {}",
      "  test(title);",
      "};",
      "inner();",
      'test("title", () => {});',
    ],
  },
  {
    // A `var` read before its declaration has no value yet.
    name: "boundary-title-var-read-early",
    kind: "unread",
    repeats: ["b"],
    unread: 1,
    source: [
      'import test from "node:test";',
      "test(title, function b() {});",
      'test("b", () => {});',
      'var title = "a";',
    ],
  },
  {
    name: "boundary-class-field",
    kind: "unread",
    source: [
      'import test from "node:test";',
      "class Cases {",
      "  static register = test;",
      "}",
      'Cases.register("same", () => {});',
      'Cases.register("same", () => {});',
    ],
  },
  {
    name: "boundary-destructuring-assignment",
    kind: "unread",
    source: [
      'import test from "node:test";',
      "let r;",
      "[r] = [test];",
      'r("same", () => {});',
      'r("same", () => {});',
    ],
  },
  {
    name: "boundary-logical-assignment",
    kind: "unread",
    source: [
      'import test from "node:test";',
      "let r = null;",
      "r ??= test;",
      'r("same", () => {});',
      'r("same", () => {});',
    ],
  },
  {
    name: "boundary-required-under-another-name",
    kind: "unread",
    source: [
      'import { createRequire } from "node:module";',
      "const load = createRequire(import.meta.url);",
      'const r = load("node:test");',
      'r("same", () => {});',
      'r("same", () => {});',
    ],
  },
  {
    name: "boundary-asked-of-the-process",
    kind: "unread",
    source: [
      'const r = process.getBuiltinModule("node:test");',
      'r("same", () => {});',
      'r("same", () => {});',
    ],
  },
  {
    name: "boundary-loop-over-registrars",
    kind: "unread",
    unread: 1,
    source: [
      'import test, { it } from "node:test";',
      'for (const r of [test, it]) r("same", () => {});',
    ],
  },
  {
    name: "boundary-tagged-template",
    kind: "unread",
    repeats: ["<anonymous>"],
    source: ['import test from "node:test";', "test`a`;", "test`a`;"],
  },
  {
    name: "boundary-title-given-a-second-value",
    kind: "unread",
    unread: 1,
    source: [
      'import test from "node:test";',
      'let title = "one";',
      'title = "same";',
      "test(title, () => {});",
      'test("same", () => {});',
    ],
  },
  {
    name: "boundary-method",
    kind: "unread",
    unread: 1,
    source: [
      'import test from "node:test";',
      "class Cases {",
      "  static run() {",
      '    test("same", () => {});',
      "  }",
      "}",
      "Cases.run();",
      "Cases.run();",
    ],
  },
  {
    name: "boundary-function-kept-in-a-property",
    kind: "unread",
    unread: 1,
    source: [
      'import test from "node:test";',
      'const held = { run: () => test("same", () => {}) };',
      "held.run();",
      "held.run();",
    ],
  },
  {
    name: "boundary-function-kept-in-a-list",
    kind: "unread",
    unread: 1,
    source: [
      'import test from "node:test";',
      'const held = [() => test("same", () => {})];',
      "held[0]();",
      "held[0]();",
    ],
  },
  {
    name: "boundary-callback",
    kind: "unread",
    unread: 1,
    source: [
      'import test from "node:test";',
      "const twice = (body) => {",
      "  body();",
      "  body();",
      "};",
      'twice(() => test("same", () => {}));',
    ],
  },
  {
    name: "boundary-own-function-handed-on",
    kind: "unread",
    unread: 1,
    source: [
      'import test from "node:test";',
      'const register = () => test("same", () => {});',
      "const twice = (body) => {",
      "  body();",
      "  body();",
      "};",
      "twice(register);",
    ],
  },
  {
    name: "boundary-instance-field",
    kind: "unread",
    unread: 1,
    source: [
      'import test from "node:test";',
      "class Cases {",
      '  made = test("same", () => {});',
      "}",
      "new Cases();",
      "new Cases();",
    ],
  },
  {
    name: "boundary-computed-specifier",
    kind: "silent",
    source: [
      'const r = (await import("node:" + "test")).test;',
      'r("same", () => {});',
      'r("same", () => {});',
    ],
  },
  {
    name: "boundary-hook-parameter",
    kind: "silent",
    source: [
      'import test, { before } from "node:test";',
      "before((t) => {",
      '  t.test("same", () => {});',
      '  t.test("same", () => {});',
      "});",
      'test("once", () => {});',
    ],
  },
  {
    name: "boundary-computed-key-of-a-namespace",
    kind: "unread",
    source: [
      'import * as ns from "node:test";',
      'const key = "test";',
      'ns[key]("same", () => {});',
      'ns[key]("same", () => {});',
    ],
  },
  {
    name: "boundary-computed-key-of-a-registrar",
    kind: "unread",
    source: [
      'import test from "node:test";',
      'const key = "skip";',
      'test[key]("same", () => {});',
      'test[key]("same", () => {});',
    ],
  },
  {
    name: "boundary-computed-key-of-the-module-awaited-in-place",
    kind: "unread",
    source: [
      'const key = "test";',
      '(await import("node:test"))[key]("same", () => {});',
      '(await import("node:test"))[key]("same", () => {});',
    ],
  },
  {
    name: "boundary-chosen-in-place",
    kind: "unread",
    source: [
      'import test, { it } from "node:test";',
      '(process.env.DOTLN_NO_SUCH_VARIABLE ? it : test)("same", () => {});',
      '(process.env.DOTLN_NO_SUCH_VARIABLE ? it : test)("same", () => {});',
    ],
  },
  {
    name: "boundary-last-of-a-sequence",
    kind: "unread",
    source: [
      'import test from "node:test";',
      '(0, test)("same", () => {});',
      '(0, test)("same", () => {});',
    ],
  },
  {
    name: "boundary-element-of-a-list",
    kind: "unread",
    source: [
      'import test from "node:test";',
      '[test][0]("same", () => {});',
      '[test][0]("same", () => {});',
    ],
  },
  {
    name: "boundary-reassigned",
    kind: "unread",
    source: [
      'import test from "node:test";',
      "let r;",
      "r = test;",
      'r("same", () => {});',
      'r("same", () => {});',
    ],
  },
  {
    name: "boundary-conditional",
    kind: "unread",
    source: [
      'import test, { it } from "node:test";',
      "const r = process.env.DOTLN_NO_SUCH_VARIABLE ? it : test;",
      'r("same", () => {});',
      'r("same", () => {});',
    ],
  },
  {
    name: "boundary-container",
    kind: "unread",
    source: [
      'import test from "node:test";',
      "const held = { r: test };",
      'held.r("same", () => {});',
      'held.r("same", () => {});',
    ],
  },
  {
    name: "boundary-wrapped",
    kind: "unread",
    source: [
      'import test from "node:test";',
      "const wrap = (registrar) => registrar;",
      "const r = wrap(test);",
      'r("same", () => {});',
      'r("same", () => {});',
    ],
  },
  {
    name: "boundary-required",
    kind: "unread",
    source: [
      'import { createRequire } from "node:module";',
      "const require = createRequire(import.meta.url);",
      'const r = require("node:test");',
      'r("same", () => {});',
      'r("same", () => {});',
    ],
  },
  {
    name: "boundary-returned",
    kind: "silent",
    source: [
      'import test from "node:test";',
      "const pick = () => test;",
      "const r = pick();",
      'r("same", () => {});',
      'r("same", () => {});',
    ],
  },
  {
    name: "boundary-parameter",
    kind: "silent",
    source: [
      'import test from "node:test";',
      "const twice = (r) => {",
      '  r("same", () => {});',
      '  r("same", () => {});',
      "};",
      "twice(test);",
    ],
  },
  {
    name: "boundary-property-written-later",
    kind: "unread",
    source: [
      'import test from "node:test";',
      "const held = {};",
      "held.r = test;",
      'held.r("same", () => {});',
      'held.r("same", () => {});',
    ],
  },
];
// The scope classes of the resolver (the twenty-eighth critic's first
// point): every place the language lets a file declare a name. For each,
// one file where the module's `r` is the registrar and the inner `r` is
// none, so that what is called through the inner one registers nothing,
// and one where the inner `r` is the registrar and the module's is none.
// Each is run under node, as the corpus and the boundary are, and reads as
// its `reads` says: `exact` (the repeat is reported, or nothing is, as node
// registers), `unread` (counted, with the number) or `silent`. The family
// above crosses bindings with uses at the top level alone; these files are
// what holds the scopes.
const TITLE_SCOPES = (() => {
  const none = "(text) => text";
  // [the class, the lines that declare an inner `r` as `value` and call it
  // twice with "same"]
  const classes = {
    "a function's parameter": (value) => [
      "const inner = (r) => {",
      '  r("same", () => {});',
      '  r("same", () => {});',
      "};",
      `inner(${value});`,
    ],
    "a function body's var": (value) => [
      "const inner = () => {",
      `  var r = ${value};`,
      '  r("same", () => {});',
      '  r("same", () => {});',
      "};",
      "inner();",
    ],
    "a block's const": (value) => [
      "{",
      `  const r = ${value};`,
      '  r("same", () => {});',
      '  r("same", () => {});',
      "}",
    ],
    "a block's function": (value) => [
      "{",
      "  function r(title) {",
      `    return (${value})(title, () => {});`,
      "  }",
      '  r("same");',
      '  r("same");',
      "}",
    ],
    "a block's class": (value) => [
      "{",
      "  class r {",
      `    static register = ${value};`,
      "  }",
      '  r.register("same", () => {});',
      '  r.register("same", () => {});',
      "}",
    ],
    "a loop's declaration": (value) => [
      `for (const r of [${value}]) {`,
      '  r("same", () => {});',
      '  r("same", () => {});',
      "}",
    ],
    "a catch clause": (value) => [
      "try {",
      `  throw ${value};`,
      "} catch (r) {",
      '  r("same", () => {});',
      '  r("same", () => {});',
      "}",
    ],
    "a function expression's own name": (value) => [
      "const outer = function r(title, again) {",
      `  (${value})(title, () => {});`,
      "  if (again) r(title, false);",
      "};",
      'outer("same", true);',
    ],
    "a class expression's own name": (value) => [
      "const Outer = class r {",
      `  static register = ${value};`,
      "  static twice() {",
      '    r.register("same", () => {});',
      '    r.register("same", () => {});',
      "  }",
      "};",
      "Outer.twice();",
    ],
  };
  // How the rule reads the file whose inner `r` is the registrar.
  const inward = {
    "a function's parameter": { reads: "silent" },
    "a function body's var": { reads: "exact" },
    "a block's const": { reads: "exact" },
    "a block's function": { reads: "exact" },
    "a block's class": { reads: "unread", unread: 2 },
    "a loop's declaration": { reads: "unread", unread: 2 },
    "a catch clause": { reads: "unread", unread: 2 },
    "a function expression's own name": { reads: "exact" },
    "a class expression's own name": { reads: "unread", unread: 3 },
  };
  const files = [];
  for (const [scope, lines] of Object.entries(classes)) {
    // The module's `r` is the registrar; the inner one is none.
    files.push({
      name: `scope-${files.length}`,
      scope,
      side: "the module's is the registrar",
      reads: "exact",
      unread: 0,
      source: [
        'import { test as r } from "node:test";',
        ...lines(none),
        'r("once", () => {});',
      ],
    });
    // The inner `r` is the registrar; the module's is none.
    files.push({
      name: `scope-${files.length}`,
      scope,
      side: "the inner one is the registrar",
      ...inward[scope],
      source: [
        'import test from "node:test";',
        `const r = ${none};`,
        ...lines("test"),
        'r("once");',
      ],
    });
  }
  // A parameter's default value stands outside the body's declarations.
  files.push({
    name: `scope-${files.length}`,
    scope: "a parameter's default value",
    side: "the module's is the registrar",
    reads: "exact",
    unread: 0,
    source: [
      'import { test as r } from "node:test";',
      'const inner = (made = r("same", () => {})) => {',
      "  var r = null;",
      "  return [made, r];",
      "};",
      "inner();",
      "inner();",
    ],
  });
  return files;
})();
const TITLE_CORPUS = [
  {
    // A function expression called through the name it has inside itself
    // is called again; scopes of a switch, a block and a label hold.
    name: "scopes",
    source: [
      'import test from "node:test";',
      "const outer = function inner(depth) {",
      '  test("same", () => {});',
      "  if (depth) inner(depth - 1);",
      "};",
      "outer(1);",
      "switch (1) {",
      "  case 1: {",
      "    const r = test;",
      '    r("twice", () => {});',
      '    r("twice", () => {});',
      "  }",
      "}",
      "{",
      "  function register() {",
      '    test("thrice", () => {});',
      "  }",
      "  register();",
      "  register();",
      "  register();",
      "}",
      "test: for (const each of [1]) {",
      "  if (each) break test;",
      "}",
      'const title = "once";',
      "{",
      '  const title = "also once";',
      "  test(title, () => {});",
      "}",
      "test(title, () => {});",
    ],
  },
  {
    // A parameter's default value is outside the body's own declarations:
    // the registrar it names is the module's, whatever the body declares.
    name: "default-value-beside-a-body-var",
    source: [
      'import test from "node:test";',
      'const register = (made = test("same", () => {})) => {',
      "  var test = null;",
      "  return [made, test];",
      "};",
      "register();",
      "register();",
      'test("once", () => {});',
    ],
  },
  {
    // A name given a second value is not read as its first: declared
    // again, or assigned. What is called through it is counted as unread,
    // and no repeat is reported for a title node registers once.
    name: "name-with-a-second-value",
    unread: 2,
    source: [
      'import test, { it } from "node:test";',
      "var again = test;",
      "var again = (text) => text;",
      'again("a");',
      "let given = test;",
      "given = (text) => text;",
      'given("b");',
      'it("a", () => {});',
      'it("b", () => {});',
    ],
  },
  {
    // A `test` the file takes from a module that is not the test module,
    // or out of a call's result: unread, never a report.
    name: "test-of-unshown-origin",
    unread: 1,
    helper: ["export const test = (text) => text.length;"],
    source: [
      'import { it } from "node:test";',
      'import { test } from "./helper-test-of-unshown-origin.mjs";',
      'test("a");',
      'it("a", () => {});',
    ],
  },
  {
    name: "test-out-of-a-call",
    unread: 1,
    source: [
      'import { it } from "node:test";',
      "const test = Boolean.bind(null);",
      'test("a");',
      'it("a", () => {});',
    ],
  },
  {
    // A name stands for the declaration its scope gives it: a local `test`
    // in a function or a block is no registrar, a parameter or a local
    // that shares a helper's name is not the helper, and neither is a
    // method of that name. Nothing here is reported and nothing counted
    // as unread.
    name: "names-by-their-declarations",
    unread: 0,
    source: [
      'import test, { it } from "node:test";',
      "const matches = () => {",
      "  const test = /ok/;",
      '  return test.exec("ok");',
      "};",
      "matches();",
      "{",
      "  const test = /ok/;",
      '  test.exec("ok");',
      "}",
      'it("ok", () => {});',
      "const setup = () => {",
      '  test("a", () => {});',
      "};",
      "const verify = (setup) => setup();",
      "verify(() => {});",
      "const other = () => {",
      "  const setup = () => 1;",
      "  return setup();",
      "};",
      "other();",
      "setup();",
      "const check = () => {",
      '  test("b", () => {});',
      "};",
      "const fixture = {",
      "  check() {",
      "    return 1;",
      "  },",
      "};",
      "const trimmed = (value) => {",
      "  const check = value.trim();",
      "  return check;",
      "};",
      "check();",
      'trimmed(" x ");',
      'test("c", () => fixture.check());',
    ],
  },
  {
    // A module awaited by a specifier the file fixes in a name is read as
    // the module is.
    name: "fixed-specifier",
    source: [
      'const specifier = "node:test";',
      "const runner = await import(specifier);",
      'runner.test("same", () => {});',
      'runner.test("same", () => {});',
      'runner.it("once", () => {});',
    ],
  },
  {
    // A function called where it is written, and a class's static field
    // and static block, run once there.
    name: "run-where-written",
    source: [
      'import test from "node:test";',
      "(() => {",
      '  test("same", () => {});',
      "})();",
      "(function () {",
      '  test("same", () => {});',
      "})();",
      "class Cases {",
      '  static made = test("twice", () => {});',
      "  static {",
      '    test("twice", () => {});',
      "  }",
      "}",
      'test("once", () => {});',
    ],
  },
  {
    // `test` as the file's own name for something that is no registrar,
    // and as a function's parameter: neither registers, nothing is counted.
    name: "own-name-test",
    unread: 0,
    source: [
      'import { it } from "node:test";',
      "const test = /ok/;",
      'test.exec("ok");',
      'it("ok", () => {});',
    ],
  },
  {
    name: "parameter-named-test",
    unread: 0,
    source: [
      'import { it } from "node:test";',
      'const has = (test) => test.includes("ok");',
      'has("okay");',
      'for (const each of ["ok"]) void each.includes("ok");',
      'it("ok", () => {});',
    ],
  },
  {
    // Parentheses around a callee or around the object of a member are no
    // part of it, and the module awaited in place is its namespace.
    name: "parenthesized",
    source: [
      'import test, * as ns from "node:test";',
      '(test)("same", () => {});',
      '(ns.test)("same", () => {});',
      '(ns).it("thrice", () => {});',
      '(test).skip("thrice", () => {});',
      '(await import("node:test")).test("thrice", () => {});',
      'test("once", () => {});',
    ],
  },
  {
    // An iteration named by a literal key runs what it is handed as often
    // as one named by a member access.
    name: "iteration-by-a-literal-key",
    source: [
      'import test from "node:test";',
      '["a", "b"]["forEach"]((each) => test("same", () => void each));',
      'test("once", () => {});',
    ],
  },
  {
    // The hooks and the module's utilities register no case, however they
    // are reached and however often: nothing is reported and nothing is
    // counted as unread.
    name: "hooks-and-utilities",
    unread: 0,
    source: [
      'import test, * as ns from "node:test";',
      "test.before(() => {});",
      "test.before(() => {});",
      'test["after"](() => {});',
      'test["after"](() => {});',
      "ns.beforeEach(() => {});",
      "ns.beforeEach(() => {});",
      "const hook = test.afterEach;",
      "hook(() => {});",
      "hook(() => {});",
      // A member the lower of the two supported nodes does not have.
      ...(typeof test.getTestContext === "function"
        ? ["test.getTestContext();", "test.getTestContext();"]
        : []),
      "const made = ns.mock.fn();",
      "const again = ns.mock.fn();",
      "void made, again;",
      'test("once", () => {});',
    ],
  },
  {
    // A function called from inside a suite's own body, written in place:
    // its cases are nested there, and are top-level only where the file
    // also calls it outside one (rolling review 32).
    name: "helper-in-inline-body",
    source: [
      'import test, { describe, it } from "node:test";',
      "function children() {",
      '  it("same", () => {});',
      '  it("same", () => {});',
      "}",
      'describe("group", () => {',
      "  children();",
      "});",
      "function shared() {",
      '  it("in a group and outside", () => {});',
      "}",
      'describe("second group", () => {',
      "  shared();",
      "});",
      "shared();",
      "shared();",
      // Handed on inside the suite's body, to an iteration (the ladder's
      // first round, criteria).
      "function iterated() {",
      '  it("once for each", () => {});',
      '  it("once for each", () => {});',
      "}",
      'describe("third group", () => {',
      "  [0, 1].forEach(iterated);",
      "});",
    ],
  },
  {
    name: "namespace-aliased",
    source: [
      // A name given to the module's namespace, and a name given to that
      // name (rolling review 39, criteria).
      'import * as runner from "node:test";',
      "const checks = runner;",
      'checks.test("same", () => {});',
      'checks.test("same", () => {});',
      "const again = checks;",
      'again.it("once", () => {});',
      "const { describe: group } = again;",
      'group("a suite twice", () => {});',
      'group("a suite twice", () => {});',
    ],
  },
  {
    name: "registrar-destructured",
    source: [
      // A registrar taken by destructuring the module's namespace, a
      // registrar's own members, and the module awaited where it is
      // imported (rolling review 35, criteria).
      'import * as runner from "node:test";',
      "const { test: check, it } = runner;",
      'check("same", () => {});',
      'check("same", () => {});',
      'it("once", () => {});',
      "const { skip, only: never } = check;",
      'skip("skipped twice", () => {});',
      'skip("skipped twice", () => {});',
      "void never;",
      'const { describe: group } = await import("node:test");',
      'group("a suite twice", () => {});',
      'group("a suite twice", () => {});',
    ],
  },
  {
    // A registrar under another name, a member of one under another name,
    // and a name given to such a name (the ladder's first round,
    // consistency).
    name: "registrar-alias",
    source: [
      'import test, * as runner from "node:test";',
      "const check = test;",
      'check("same", () => {});',
      'check("same", () => {});',
      "const later = test.skip;",
      'later("skipped twice", () => {});',
      'later("skipped twice", () => {});',
      "const group = runner.describe;",
      "const again = check;",
      'group("a suite", () => {});',
      'again("once more", () => {});',
      'again("same", () => {});',
      // A name given to one of the file's own functions that hands a title
      // on (the ladder's recheck round, criteria).
      "function define(title) {",
      "  test(title, () => {});",
      "}",
      "const named = define;",
      'named("through a helper", () => {});',
      'named("through a helper", () => {});',
      // The same, of a function that hands the body on as well (the
      // recheck round, combined).
      "function wrap(title, body) {",
      "  test(title, body);",
      "}",
      "const wrapped = wrap;",
      'wrapped("with its body", () => {});',
      'wrapped("with its body", () => {});',
      // A title the function's own body fixes, registered at each call
      // through the other name (the ladder's last round).
      "function pair(title) {",
      "  test(title, () => {});",
      '  test("fixed in the helper", () => {});',
      "}",
      "const paired = pair;",
      'paired("first of a pair", () => {});',
      'paired("second of a pair", () => {});',
    ],
  },
  {
    // A function handed by its name: to an iteration, which calls it as
    // often as it runs, and to a suite as its body, whose cases are nested
    // (rolling review 30).
    name: "callback-by-name",
    source: [
      'import test, { describe, it } from "node:test";',
      "function register() {",
      '  test("same", () => {});',
      "}",
      "[1, 2].forEach(register);",
      "function children() {",
      '  it("inner", () => {});',
      '  it("inner", () => {});',
      "}",
      'describe("group", children);',
      "function both() {",
      '  it("in both", () => {});',
      "}",
      'describe("other group", both);',
      "both();",
      "both();",
    ],
  },
  {
    // A function that hands a title on through one declared after it, and
    // one whose body fixes a title beside the one it is handed: each call
    // registers both (rolling review 29).
    name: "wrapper-declared-later",
    source: [
      'import test from "node:test";',
      "function register(first, second) {",
      "  test(first, () => {});",
      "  later(second);",
      "}",
      "function later(title) {",
      "  test(title, () => {});",
      "}",
      'register("same", "same");',
      'register("one", "other");',
    ],
  },
  {
    name: "wrapper-fixed-title",
    source: [
      'import test from "node:test";',
      "function register(title) {",
      "  test(title, () => {});",
      '  test("shared", () => {});',
      "}",
      'register("first");',
      'register("second");',
      "function quiet(title) {",
      "  test(title, () => {});",
      '  test("fixed once", () => {});',
      "}",
      'quiet("third");',
      "function unused(title) {",
      "  test(title, () => {});",
      '  test("never registered", () => {});',
      "}",
    ],
  },
  {
    // A function that registers a suite and, inside it, a case of the same
    // title registers one at the top level (rolling review 27).
    name: "wrapper-nested",
    source: [
      'import { describe, it } from "node:test";',
      "function register(title) {",
      "  describe(title, () => {",
      "    it(title, () => {});",
      "  });",
      "}",
      'register("once at the top");',
      'register("another");',
    ],
  },
  {
    // A function that hands two parameters on, each once: a call that gives
    // both one title registers it twice (rolling review 27).
    name: "wrapper-two-parameters",
    source: [
      'import test from "node:test";',
      "function register(first, second) {",
      "  test(first, () => {});",
      "  test(second, () => {});",
      "}",
      'register("same", "same");',
      'register("one", "other");',
      "const swapped = (body, first, second) => {",
      "  test(second, body);",
      "  test(first, body);",
      "};",
      'swapped(() => {}, "left", "left");',
    ],
  },
  {
    // A function that hands its title on more than once registers it that
    // often at each call: directly, through another such function, and in
    // a loop; one that hands it on once registers it once.
    name: "wrapper-repeats",
    source: [
      'import test from "node:test";',
      "function register(title) {",
      "  test(title, () => {});",
      "  test(title, () => {});",
      "}",
      'register("same");',
      "function once(title) {",
      "  test(title, () => {});",
      "}",
      'once("single");',
      "function outer(title) {",
      "  register(title);",
      "}",
      'outer("nested");',
      "function looped(title) {",
      "  for (const each of [1, 2]) test(title, () => void each);",
      "}",
      'looped("in a loop");',
      "const twice = (title) => [1, 2].forEach(() => test(title, () => {}));",
      'twice("iterated");',
    ],
  },
  {
    // The kit's shard helper under other names: its default, its named
    // export and its namespace register as node:test's do, and another
    // member of the namespace registers nothing.
    name: "shard-helper",
    source: [
      `import check, { test as named } from ${SHARD_HELPER};`,
      `import * as shards from ${SHARD_HELPER};`,
      'check("default alias", () => {});',
      'check("default alias", () => {});',
      'named("named alias", () => {});',
      'named("named alias", () => {});',
      'shards.test("spaced", () => {});',
      'shards.default("spaced", () => {});',
      'shards.shardOf("counted once", 2);',
      'check("counted once", () => {});',
    ],
  },
  {
    name: "direct",
    source: [
      'import test from "node:test";',
      'test("one", () => {});',
      'test("two", async (t) => {',
      '  await t.test("one", () => {});',
      '  await t.test("inner", () => {});',
      "});",
      'await test("one", () => {});',
      'test.skip("two", () => {});',
      'test("alone", async (t) => {',
      '  await t.test("inner", () => {});',
      "});",
      'const text = \'test("alone", () => {}); test("alone", () => {});\';',
      "void text;",
    ],
  },
  {
    name: "called-function",
    source: [
      'import test from "node:test";',
      "export async function fixtures() {",
      "  try {",
      '    await test("a", () => {});',
      '    await test("a", () => {});',
      '    await test("b", () => {});',
      "  } finally {",
      "    // nothing to release",
      "  }",
      "}",
      "await fixtures();",
    ],
  },
  {
    name: "function-called-twice",
    source: [
      'import test from "node:test";',
      "function register() {",
      '  test("twice", () => {});',
      "}",
      "register();",
      "register();",
    ],
  },
  {
    // A call made inside another function of the file's counts as often as
    // that function is called (rolling review 19).
    name: "function-inside-a-function",
    source: [
      'import test from "node:test";',
      "function register() {",
      '  test("same", () => {});',
      "}",
      "function cases() {",
      "  register();",
      "}",
      "cases();",
      "cases();",
      "function once() {",
      '  test("single", () => {});',
      "}",
      "function outer() {",
      "  once();",
      "}",
      "outer();",
    ],
  },
  {
    name: "iteration",
    source: [
      'import test from "node:test";',
      '[1, 2].forEach(() => test("eight", () => {}));',
      'test("eight", () => {});',
      'for (const each of [1, 2]) test("loop", () => void each);',
      "for (const each of [1, 2]) test(`case ${each}`, () => {});",
    ],
  },
  {
    name: "statements",
    source: [
      'import test from "node:test";',
      "switch (process.env.DOTLN_NO_SUCH_VARIABLE) {",
      "  default:",
      '    test("same", () => {});',
      '    test("same", () => {});',
      "}",
      'true ? test("ternary", () => {}) : null;',
      'void test("ternary", () => {});',
      'test("comma", () => {}), test("comma", () => {});',
      'test("then", () => {}).then(() => {});',
      'test("then", () => {});',
      'await Promise.all([test("all", () => {}), test("all", () => {})]);',
      "{",
      '  test("block", () => {});',
      "}",
      'test("block", () => {});',
    ],
  },
  {
    name: "imports",
    source: [
      'import nodeTest, { describe, it, test as check } from "node:test";',
      'nodeTest("default", () => {});',
      'nodeTest("default", () => {});',
      'check("alias", () => {});',
      'check("alias", () => {});',
      'describe("group", () => {',
      '  it("inside", () => {});',
      "});",
      'describe("group", () => {',
      '  it("inside", () => {});',
      "});",
      'it("it", () => {});',
      'it("it", () => {});',
    ],
  },
  {
    name: "namespace",
    source: [
      'import * as runner from "node:test";',
      'runner.test("spaced", () => {});',
      'runner.test.skip("spaced", () => {});',
    ],
  },
  {
    name: "wrappers",
    source: [
      'import test from "node:test";',
      'outer("hoisted", () => {});',
      'outer("hoisted", () => {});',
      "function outer(title, body) {",
      "  inner(title, body);",
      "}",
      "function inner(title, body) {",
      "  test(title, body);",
      "}",
      "const second = (body, title) => test(title, body);",
      'second(() => {}, "second place");',
      'second(() => {}, "second place");',
      'const HELD = "held";',
      "test(HELD, () => {});",
      "test(HELD, () => {});",
    ],
  },
  {
    // One of the file's functions called with its name in parentheses is
    // called there, once for each such call.
    name: "parenthesized-calls",
    source: [
      'import test from "node:test";',
      "function register() {",
      '  test("same", () => {});',
      "}",
      "(register)();",
      "((register))();",
      "function named(title) {",
      "  test(title, () => {});",
      "}",
      '(named)("handed");',
      '(named)("handed");',
    ],
  },
  {
    // The positions of a registration's arguments (the closing ladder's
    // combined review). What an argument runs when the registration is
    // made registers at the top level: a call of one of the file's
    // functions, alone, inside another call, in a conditional, in a
    // container or among the options; a function called where it is
    // written; and a registration made in the argument. What runs when the
    // case does is nested in it: a function handed by its name, one written
    // in the argument with what it calls, and one written in the argument
    // of a call that hands it on. Each form has a title of its own, twice,
    // and node says which repeat at the top level.
    name: "argument-positions",
    unread: 0,
    source: [
      'import test from "node:test";',
      "const pass = (value) => value;",
      "function direct() {",
      '  test("called in an argument", () => {});',
      "  return () => {};",
      "}",
      'test("direct one", direct());',
      'test("direct two", direct());',
      "function wrapped() {",
      '  test("called inside another call", () => {});',
      "  return () => {};",
      "}",
      'test("wrapped one", pass(wrapped()));',
      'test("wrapped two", pass(wrapped()));',
      "function chosen() {",
      '  test("called in a conditional", () => {});',
      "  return () => {};",
      "}",
      'test("chosen one", pass ? chosen() : pass);',
      'test("chosen two", pass ? chosen() : pass);',
      "function held() {",
      '  test("called in a container", () => {});',
      "  return () => {};",
      "}",
      'test("held one", [held()][0]);',
      'test("held two", { run: held() }.run);',
      "function option() {",
      '  test("called among the options", () => {});',
      "  return false;",
      "}",
      'test("option one", { skip: option() }, () => {});',
      'test("option two", { skip: option() }, () => {});',
      'test("written one", (() => {',
      '  test("registered where a function is called as it is written", () => {});',
      "  return () => {};",
      "})());",
      'test("written two", (() => {',
      '  test("registered where a function is called as it is written", () => {});',
      "  return () => {};",
      "})());",
      'test("made one", (test("registered in an argument", () => {}), () => {}));',
      'test("made two", (test("registered in an argument", () => {}), () => {}));',
      "async function handed() {",
      '  await test("nested by name", () => {});',
      "}",
      'test("by name one", handed);',
      'test("by name two", handed);',
      "async function inner() {",
      '  await test("nested in a body", () => {});',
      "}",
      'test("in a body one", async () => {',
      "  await inner();",
      "});",
      'test("in a body two", async function () {',
      "  await inner();",
      "});",
      "async function deep() {",
      '  await test("nested in a function handed on", () => {});',
      "}",
      'test("handed on one", pass(async () => {',
      "  await deep();",
      "}));",
      'test("handed on two", pass(async () => {',
      "  await deep();",
      "}));",
    ],
  },
  {
    // The same name in parentheses in the other places the rule reads it:
    // as a call that hands one title on twice, handed to an iteration, and
    // as the initializer of another name for the function.
    name: "parenthesized-names",
    overstated: ["iterated"],
    source: [
      'import test from "node:test";',
      "function twice(title) {",
      "  test(title, () => {});",
      "  test(title, () => {});",
      "}",
      '(twice)("doubled");',
      "function each() {",
      '  test("iterated", () => {});',
      "}",
      "[1].forEach((each));",
      "function once() {",
      '  test("aliased", () => {});',
      "}",
      "const again = (once);",
      "again();",
      "again();",
    ],
  },
  {
    name: "alternatives",
    overstated: ["guarded", "branched", "caught", "single"],
    source: [
      'import test from "node:test";',
      "const on = Boolean(process.env.DOTLN_NO_SUCH_VARIABLE);",
      'if (on) test("guarded", () => {});',
      'if (!on) test("guarded", () => {});',
      'if (on) test("branched", () => {});',
      'else test("branched", () => {});',
      "try {",
      '  test("caught", () => {});',
      "} catch {",
      '  test("caught", () => {});',
      "}",
      'for (const each of [1]) test("single", () => void each);',
    ],
  },
];

test("WO-276 criterion E1: no suite file can register one title twice at its top level, held to what node registers for a corpus of the forms the rule reads, with the titles it overstates on purpose named; a repeat inside a nested case or a fixture's text is none", (t) => {
  // What node registers at the top level of each corpus file.
  const directory = createFixtureRoot(join(tmpdir(), "dotln-titles-"));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  const environment = { ...process.env };
  delete environment.NODE_TEST_CONTEXT;
  // A corpus file runs whole, whatever shard this case itself runs in.
  delete environment.DOTLN_TEST_SHARD;
  delete environment.DOTLN_TEST_TITLES;
  // The family is the whole cross, its size computed from its dimensions,
  // so a cell cannot go missing unseen; and the members it crosses are
  // node's, of which the seven every supported node has must be there.
  for (const member of [
    "test",
    "it",
    "describe",
    "suite",
    "skip",
    "only",
    "todo",
  ])
    assert.ok(TITLE_FAMILY.held.includes(member), member);
  assert.equal(TITLE_FAMILY.length, TITLE_FAMILY.expected);
  assert.equal(
    new Set(TITLE_FAMILY.map((file) => file.form)).size,
    TITLE_FAMILY.length,
  );
  // A function node's test holds that this rule classes neither as
  // registering nor as a hook or a utility is read as registering and is
  // run by no file here: named, so that it is seen.
  const unclassed = Object.keys(test).filter(
    (member) =>
      typeof test[member] === "function" &&
      !HELD_REGISTERING.includes(member) &&
      !NOT_REGISTERING.has(member),
  );
  if (unclassed.length)
    t.diagnostic(
      `members of node's test function the family does not run: ${unclassed.join(", ")}`,
    );
  // Both sides of every scope class are there.
  assert.equal(TITLE_SCOPES.length, 9 * 2 + 1);
  assert.equal(
    new Set(TITLE_SCOPES.map((file) => `${file.scope}, ${file.side}`)).size,
    TITLE_SCOPES.length,
  );
  t.diagnostic(`the scope classes: ${TITLE_SCOPES.length} files`);
  t.diagnostic(
    `the family: ${TITLE_FAMILY.length} files over node's ${TITLE_FAMILY.held.join(", ")}; the boundary: ${TITLE_BOUNDARY.filter((file) => file.kind === "unread").length} unread and ${TITLE_BOUNDARY.filter((file) => file.kind === "silent").length} silent files`,
  );
  // The rule reads every file of the corpus, the family, the boundary and
  // the scope classes as one batch, one start of the source reader for
  // what it reports and one for what it counts as unread. No file of them
  // loads another, so each is read as it would be alone.
  const held = [
    ...TITLE_CORPUS,
    ...TITLE_FAMILY,
    ...TITLE_BOUNDARY,
    ...TITLE_SCOPES,
  ];
  const heldInputs = held.map(({ name, source }) => ({
    path: `scripts/test-${name}.mjs`,
    source: `${source.join("\n")}\n`,
  }));
  assert.equal(
    new Set(heldInputs.map((input) => input.path)).size,
    heldInputs.length,
    "every held file has a name of its own",
  );
  const linesOf = (lines) => (name) =>
    lines
      .filter((line) => line.startsWith(`scripts/test-${name}.mjs: `))
      .map((line) => line.slice(`scripts/test-${name}.mjs: `.length));
  const reportedOf = linesOf(duplicateTitles(heldInputs));
  const unreadOf = linesOf(unreadTitles(heldInputs));
  for (const {
    name,
    source,
    overstated = [],
    form,
    kind,
    unread,
    repeats = ["same"],
    helper,
    reads,
    scope,
    side,
  } of held) {
    const file = join(directory, `test-${name}.mjs`);
    const text = `${source.join("\n")}\n`;
    writeFileSync(file, text);
    // A module of another kind that the file imports, beside it.
    if (helper)
      writeFileSync(
        join(directory, `helper-${name}.mjs`),
        `${helper.join("\n")}\n`,
      );
    const ran = spawnSync(process.execPath, ["--test-reporter=tap", file], {
      encoding: "utf8",
      env: environment,
    });
    assert.equal(ran.status, 0, `${name}: ${ran.stdout}${ran.stderr}`);
    const registered = new Map();
    for (const [, title] of ran.stdout.matchAll(
      /^(?:not ok|ok) \d+ - (.*?)(?: # (?:SKIP|TODO|EXPECTED FAILURE)\b.*)?$/gmu,
    ))
      registered.set(title, (registered.get(title) ?? 0) + 1);
    const repeated = [...registered]
      .filter(([, count]) => count > 1)
      .map(([title]) => title)
      .sort();
    const reported = reportedOf(name).sort();
    // What the rule counts as unread in this file: the count, or none.
    const counted = unreadOf(name).map(
      (found) => `scripts/test-${name}.mjs: ${found}`,
    );
    // Every title node registers twice is reported, and nothing else is
    // but the titles the corpus names as overstated. The corpus is a set
    // of examples: it holds the rule to node on the forms it lists (see
    // TITLE_CORPUS for the three kinds: read exactly, overstated on
    // purpose, and not read), and proves nothing of a form it lacks.
    if (reads) {
      // A file of the scope classes: held to node on what it registers
      // twice, and to the reading its class and side state.
      const label = `${scope}, ${side}: node registered ${JSON.stringify([...registered])}`;
      assert.deepEqual(reported, reads === "exact" ? repeated : [], label);
      assert.deepEqual(
        counted,
        reads === "unread" ? [`scripts/test-${name}.mjs: ${unread}`] : [],
        label,
      );
      // The module's registrar registers "once" alone; the inner
      // registrar registers "same" twice.
      assert.deepEqual(
        repeated,
        side === "the module's is the registrar" &&
          scope !== "a parameter's default value"
          ? []
          : ["same"],
        label,
      );
      continue;
    }
    if (kind) {
      // A boundary file: node registers the title twice, the rule reports
      // nothing it cannot prove, and what it could not read is counted for
      // an unread form and is nothing at all for a silent one.
      assert.deepEqual(repeated, repeats, name);
      assert.deepEqual(reported, [], name);
      assert.deepEqual(
        counted,
        kind === "unread" ? [`scripts/test-${name}.mjs: ${unread ?? 2}`] : [],
        `${name}: ${kind}`,
      );
      continue;
    }
    assert.deepEqual(
      reported,
      [...repeated, ...overstated].sort(),
      `${form ?? name}: node registered ${JSON.stringify([...registered])}`,
    );
    // A family file repeats exactly the one title, so a form the rule read
    // as nothing cannot pass by node registering nothing either.
    if (form) assert.deepEqual(repeated, ["same"], form);
    // A control file states how many registrations the rule may count as
    // unread in it.
    if (unread !== undefined)
      assert.deepEqual(
        counted,
        unread ? [`scripts/test-${name}.mjs: ${unread}`] : [],
        `${name}: unread`,
      );
    assert.ok(
      overstated.every((title) => registered.get(title) === 1),
      `${name}: an overstated title is one node registers once`,
    );
  }
  // A suite file that loads another registers that file's cases too, so a
  // title the two share is registered twice in the one process. Held to
  // node as the corpus is: the importer run under node, and the rule given
  // both files. The imported file alone repeats nothing.
  {
    const imported = [
      'import test from "node:test";',
      'test("shared by both", () => {});',
      'test("the imported file\'s own", () => {});',
    ].join("\n");
    const importer = [
      'import test from "node:test";',
      'import "./test-imported.mjs";',
      'test("shared by both", () => {});',
      'test("the importer\'s own", () => {});',
    ].join("\n");
    writeFileSync(join(directory, "test-imported.mjs"), `${imported}\n`);
    writeFileSync(join(directory, "test-importer.mjs"), `${importer}\n`);
    const ran = spawnSync(
      process.execPath,
      ["--test-reporter=tap", join(directory, "test-importer.mjs")],
      { encoding: "utf8", env: environment },
    );
    assert.equal(ran.status, 0, `${ran.stdout}${ran.stderr}`);
    const registered = new Map();
    for (const [, title] of ran.stdout.matchAll(
      /^(?:not ok|ok) \d+ - (.*)$/gmu,
    ))
      registered.set(title, (registered.get(title) ?? 0) + 1);
    assert.deepEqual(
      [...registered].filter(([, count]) => count > 1).map(([title]) => title),
      ["shared by both"],
      JSON.stringify([...registered]),
    );
    assert.deepEqual(
      duplicateTitles([
        { path: "scripts/test-importer.mjs", source: `${importer}\n` },
        { path: "scripts/test-imported.mjs", source: `${imported}\n` },
      ]),
      ["scripts/test-importer.mjs: shared by both"],
    );
  }
  // Beside the corpus, a file whose only repeats are nested or inside a
  // fixture's text, and a typed file: both sides of the rule are exercised.
  assert.deepEqual(
    duplicateTitles([
      {
        path: "scripts/test-nested.mjs",
        source:
          'import test from "node:test";\ntest("a", async (t) => {\n  await t.test("same", () => {});\n  await t.test("same", () => {});\n});\nconst fixture = `test("a", () => {});`;\nvoid fixture;\n',
      },
      {
        path: "packages/skeleton/test/fixture.test.ts",
        source:
          'import test from "node:test";\ntest("two", (): void => {});\ntest("two", (): void => {});\n',
      },
    ]),
    ["packages/skeleton/test/fixture.test.ts: two"],
  );
  // A typed file's namespace that holds a registrar: what is registered
  // through it is counted as unread. This one is read and not run, since
  // node runs no typed source here.
  assert.deepEqual(
    unreadTitles([
      {
        path: "packages/skeleton/test/namespace.test.ts",
        source:
          'import test from "node:test";\nnamespace Held {\n  export const register = test;\n}\nHeld.register("a", (): void => {});\nHeld.register("a", (): void => {});\n',
      },
    ]),
    ["packages/skeleton/test/namespace.test.ts: 2"],
  );
  // Every suite file of the repository: the scripts' test files and the
  // packages' and the corpus's.
  const files = runGitPathList(root, [
    "ls-files",
    "-z",
    "--cached",
    "--others",
    "--exclude-standard",
  ]).filter(
    (path) =>
      /(?:^|\/)(?:test-[^/]*\.mjs|[^/]*\.test\.(?:mjs|ts))$/u.test(path) &&
      !/(?:^|\/)fixtures\//u.test(path) &&
      existsSync(join(root, path)),
  );
  assert.ok(files.length > 100, `${files.length} suite files`);
  const suiteFiles = files.map((path) => ({
    path,
    source: readFileSync(join(root, path), "utf8"),
  }));
  const starts = sourceTreeStarts();
  assert.deepEqual(duplicateTitles(suiteFiles), []);
  // Every suite file in one batch: one start of the reader, not one a file.
  assert.equal(sourceTreeStarts() - starts, 1);
  // What the rule did not judge is said, not passed over: a registration
  // whose title is built at run time is counted for its file, and the
  // count over the repository's suite files is printed with this case.
  assert.deepEqual(
    unreadTitles([
      {
        path: "scripts/test-computed.mjs",
        source:
          'import test from "node:test";\nfor (const n of [1, 2]) test(`case ${n}`, () => {});\ntest("read", () => {});\n',
      },
    ]),
    ["scripts/test-computed.mjs: 1"],
  );
  const unjudged = unreadTitles(suiteFiles);
  t.diagnostic(
    `titles the rule does not read: ${unjudged.reduce((sum, line) => sum + Number(line.split(": ").at(-1)), 0)} registrations in ${unjudged.length} suite files`,
  );
});

test("WO-276 (the attack on Part D): below eight lanes a shard does not open past a higher-priority heavy row that waits only for lanes, and the hook suite's shards follow one another with no heavy row between them", async () => {
  const hooks = suites.find((row) => row.name === "harness-fixtures");
  const sync = suites.find((row) => row.name === "sync-fixtures");
  // Two light rows that failed last hold three lanes between them, one of
  // them two lanes wide; a heavy row of two lanes changed since the last
  // gate; the hook suite and another exclusive row carry no lead.
  const table = [
    barrier,
    { name: "light-wide", command: ["fixture"], loadSlots: 2 },
    { name: "light-one", command: ["fixture"] },
    { name: "heavy-two", command: ["fixture"], loadSlots: 2 },
    hooks,
    sync,
  ];
  const tasks = expandSuiteTasks(table, root, "<gate-template>", {
    first: suitePriorityLeads({
      failed: ["light-wide", "light-one"],
      changed: ["heavy-two"],
    }),
  });
  const shards = tasks
    .filter((row) => row.name.startsWith("harness-fixtures:shard:"))
    .map((row) => row.name);
  assert.ok(shards.length > 1);
  for (const concurrency of [2, 3, 4, 6, 8]) {
    const started = [];
    await scheduleSuites(tasks, {
      concurrency,
      parallelism: 16,
      lightTasks: new Set(["light-wide", "light-one"]),
      execute: async (row) => {
        if (!row.build) {
          started.push(row.name);
          await new Promise((done) => setTimeout(done, 15));
        }
        return { name: row.name, executed: true, exitCode: 0 };
      },
    });
    // The heavy row, which outranks every exclusive row, starts before any
    // of them, and nothing but a shard starts between two shards.
    const heavy = started.indexOf("heavy-two");
    const first = started.indexOf(shards[0]);
    const last = Math.max(...shards.map((name) => started.indexOf(name)));
    assert.ok(heavy < first, `${concurrency} lanes: ${started.join(" -> ")}`);
    assert.deepEqual(
      started.slice(first, last + 1).filter((name) => !shards.includes(name)),
      [],
      `${concurrency} lanes: ${started.join(" -> ")}`,
    );
    assert.equal(started.length, tasks.filter((row) => !row.build).length);
  }
});

test("WO-276 (rolling review 20): the hook suite's shards share one host reservation until the last of them and its light peers has finished, so a host with lanes for one shard at a time runs them all", async (t) => {
  const { acquireHostLaneCapacity, acquireHostLanes } =
    await import("./lib/host-lanes.mjs");
  const hooks = suites.find((row) => row.name === "harness-fixtures");
  const tasks = expandSuiteTasks(
    [barrier, { name: "light-one", command: ["fixture"] }, hooks],
    root,
    "<gate-template>",
  );
  const shards = tasks
    .filter((row) => row.name.startsWith("harness-fixtures:shard:"))
    .map((row) => row.name);
  assert.ok(shards.length > 1);
  for (const capacity of [2, 3, 4, 8]) {
    const directory = createFixtureRoot(
      join(tmpdir(), `dotln-shard-lease-${capacity}-`),
    );
    t.after(() => rmSync(directory, { recursive: true, force: true }));
    await acquireHostLaneCapacity({ directory, capacity });
    const results = await scheduleSuites(tasks, {
      concurrency: capacity,
      parallelism: 16,
      lightTasks: new Set(["light-one"]),
      hostLanes: { directory, capacity, parentLease: null },
      acquireLanes: acquireHostLanes,
      execute: async (row) => {
        if (!row.build) await new Promise((done) => setTimeout(done, 20));
        return { name: row.name, executed: true, exitCode: 0 };
      },
    });
    assert.deepEqual(
      results
        .filter((result) => result.exitCode !== 0)
        .map((result) => [result.name, result.output]),
      [],
      `${capacity} lanes`,
    );
    for (const name of shards)
      assert.ok(
        results.some((result) => result.name === name && result.executed),
        `${capacity} lanes: ${name}`,
      );
    // Nothing of the gate's is left holding a lane.
    const after = await acquireHostLanes({
      directory,
      parentLease: null,
      slots: capacity,
      task: "after",
      worktree: root,
    });
    await after.release();
  }
});

test("priority-regression: launchpad admits update first when only one file fits", async () => {
  const launchpad = suites.find((row) => row.name === "launchpad");
  const busy = {
    name: "busy",
    command: ["fixture"],
    loadSlots: 2,
    priority: 100,
  };
  const tasks = expandSuiteTasks(
    [barrier, busy, launchpad],
    root,
    "<gate-template>",
  );
  const files = tasks.filter((row) => row.name.startsWith("launchpad:file:"));
  assert.deepEqual(files.map((row) => row.command.at(-1)).sort(), [
    "scripts/test-launchpad-export.mjs",
    "scripts/test-launchpad-seeds.mjs",
    "scripts/test-launchpad-update.mjs",
  ]);
  assert.ok(files.every((row) => row.loadSlots === 2 && row.groupLimit === 2));
  const release = Promise.withResolvers(),
    firstFile = Promise.withResolvers();
  let deadline;
  const result = scheduleSuites(tasks, {
    concurrency: 4,
    parallelism: 8,
    execute: async (row) => {
      if (row.name !== "build") {
        if (row.name.startsWith("launchpad:file:")) firstFile.resolve(row.name);
        await release.promise;
      }
      return { name: row.name, executed: true, exitCode: 0 };
    },
  });
  try {
    const first = await Promise.race([
      firstFile.promise,
      new Promise((_, reject) => {
        deadline = setTimeout(
          () => reject(new Error("launchpad admission did not begin")),
          5000,
        );
      }),
    ]);
    assert.equal(first, "launchpad:file:test-launchpad-update.mjs");
  } finally {
    clearTimeout(deadline);
    release.resolve();
    const completed = await result;
    assert.equal(completed.length, tasks.length);
    assert.ok(completed.every((row) => row.executed && row.exitCode === 0));
  }
});

test("a lead raises a suite's tasks above every other priority while their own order holds", () => {
  const selected = suites.filter((row) =>
    ["build", "release", "skeleton", "harness-fixtures", "console"].includes(
      row.name,
    ),
  );
  const first = new Map([
    ["release", 1000],
    ["harness-fixtures", 2000],
  ]);
  const tasks = expandSuiteTasks(selected, root, "<gate-template>", { first });
  const priority = (name) => tasks.find((row) => row.name === name).priority;
  const shards = (rows) =>
    rows.filter((row) => row.name.startsWith("harness-fixtures:shard:"));
  assert.equal(shards(tasks).length, 3);
  assert.ok(shards(tasks).every((row) => row.priority === 2200));
  assert.equal(priority("release:prepare"), 1100);
  const cases = tasks.filter((row) => row.name.startsWith("release:case:"));
  assert.ok(cases.length > 0);
  assert.ok(cases.every((row) => row.priority === 1060));
  assert.equal(priority("skeleton"), 80);
  assert.equal(priority("console"), 0);
  const plain = expandSuiteTasks(selected, root, "<gate-template>");
  assert.equal(
    plain.find((row) => row.name === "release:prepare").priority,
    100,
  );
  assert.ok(shards(plain).every((row) => row.priority === 200));
});

test("host parallelism derives scheduler defaults and bounds explicit concurrency", async () => {
  const { hostLaneCapacity } = await import("./lib/host-resources.mjs");
  for (const [parallelism, expected] of [
    [2, 1],
    [4, 2],
    [8, 4],
    [16, 8],
    [32, 8],
  ]) {
    assert.equal(hostLaneCapacity(parallelism), expected);
    const rows = await scheduleSuites([barrier], {
      parallelism,
      execute: async (row) => {
        assert.equal(row.gateContext.slotCapacity, expected);
        assert.equal(row.gateContext.hostCapacity, expected);
        assert.equal(row.gateContext.reservedSlots, expected);
        return { name: row.name, executed: true, exitCode: 0 };
      },
    });
    assert.equal(rows[0].slotCapacity, expected);
    await assert.rejects(
      scheduleSuites([barrier], { parallelism, concurrency: expected + 1 }),
      new RegExp(
        `concurrency ${expected + 1} exceeds host capacity ${expected}`,
      ),
    );
  }
});

test("per-lane host admission compares the divided gate share with measured task RSS", async (t) => {
  const { hostLaneCapacity, largestTaskPeakRss, memoryBudgets } =
    await import("./lib/host-resources.mjs");
  const { checkHost } = await import("./structural-checks.mjs");
  const repo = createFixtureRoot(join(tmpdir(), "dotln-host-budget-"));
  t.after(() => rmSync(repo, { recursive: true, force: true }));
  const sample = {
    level: "normal",
    pressure: 1,
    swapBytes: 0,
    physicalBytes: 1600,
    source: "fixture",
  };
  const requiredPeakBytes = largestTaskPeakRss([
    { peakRssBytes: 90 },
    { peakRssBytes: 110 },
    { peakRssBytes: 100 },
  ]);
  for (const parallelism of [2, 4, 8, 16, 32]) {
    const capacity = hostLaneCapacity(parallelism);
    const limits = memoryBudgets(repo, { capacity, physicalBytes: 1600 });
    assert.equal(limits.taskBytes, Math.floor(limits.gateBytes / capacity));
    const result = checkHost(sample, {
      limits,
      requiredPeakBytes,
      fileEvents: {},
    });
    assert.equal(result.exitCode, limits.taskBytes < requiredPeakBytes ? 1 : 0);
    assert.ok(result.output.includes(`budget ${limits.taskBytes} bytes`));
    assert.ok(result.output.includes("peak RSS 110 bytes"));
  }
  assert.throws(
    () => largestTaskPeakRss([{ peakRssBytes: null }]),
    /Invalid measured/,
  );
});

test("WO-276 criterion H4: on a host of 16 GB and twelve processors the host task passes in a kit root, whose gate carries lighter tasks, and refuses in core with the per-lane shortfall; the kit's peak is the suite table's own reading", async (t) => {
  const {
    carriedTaskPeak,
    hostLaneCapacity,
    judgeLaneMemory,
    largestTaskPeakRss,
    memoryBudgets,
    requiredTaskPeakRss,
    schedulingBaseline,
  } = await import("./lib/host-resources.mjs");
  const { checkHost } = await import("./structural-checks.mjs");
  // A kit root: a manifest and no package sources.
  const kit = createFixtureRoot(join(tmpdir(), "dotln-host-kit-"));
  t.after(() => rmSync(kit, { recursive: true, force: true }));
  writeFileSync(join(kit, "KIT-MANIFEST.json"), "{}\n");
  // The baseline's kit peak is the largest sample among the tasks of the
  // suites this table does not mark core-only: a suite that changes sides,
  // or a heavier carried sample, moves it here and fails until it follows.
  const coreOnly = new Set(
    suites
      .filter((row) => row.kit?.startsWith("core-only: "))
      .map((row) => row.name),
  );
  assert.deepEqual(
    schedulingBaseline.kitTaskPeak,
    carriedTaskPeak((name) => !coreOnly.has(name.split(":")[0])),
  );
  assert.equal(
    requiredTaskPeakRss(kit),
    schedulingBaseline.kitTaskPeak.peakRssBytes,
  );
  assert.equal(requiredTaskPeakRss(root), largestTaskPeakRss());
  assert.ok(requiredTaskPeakRss(kit) < requiredTaskPeakRss(root));
  const physicalBytes = 16 * 2 ** 30;
  const sample = {
    level: "normal",
    pressure: 1,
    swapBytes: 0,
    physicalBytes,
    source: "fixture",
  };
  const limits = memoryBudgets(kit, {
    capacity: hostLaneCapacity(12),
    physicalBytes,
  });
  assert.equal(limits.hostLanes, 6);
  const inKit = checkHost(sample, { root: kit, limits, fileEvents: {} });
  assert.equal(inKit.exitCode, 0, inKit.output);
  assert.ok(
    inKit.output.includes(
      `Per-lane memory budget ${limits.taskBytes} bytes covers measured task peak RSS ${schedulingBaseline.kitTaskPeak.peakRssBytes} bytes (6 host lanes)`,
    ),
    inKit.output,
  );
  const inCore = checkHost(sample, { root, limits, fileEvents: {} });
  assert.equal(inCore.exitCode, 1);
  assert.match(
    inCore.output,
    new RegExp(
      `Per-lane memory budget ${limits.taskBytes} bytes is below measured task peak RSS ${largestTaskPeakRss()} bytes \\(6 host lanes\\); memory\\.gateShare must be at least 0\\.\\d+ to admit this peak at 6 lanes; set it in docs/control/budgets\\.json`,
      "u",
    ),
  );
  // The host task prints what the one comparison returns.
  const lane = judgeLaneMemory({
    limits,
    requiredPeakBytes: largestTaskPeakRss(),
    physicalBytes,
  });
  assert.equal(lane.underBudget, true);
  assert.ok(inCore.output.endsWith(lane.message));
});

test("WO-276 criterion H6: a compiler that cannot be run fails the lock helper's first use naming the compiler tried, what the kit needs it for and the platform's remedy, with the tool's own message", async (t) => {
  const { compilerRemedy, nativeCompiler, taskLauncher } =
    await import("./lib/host-resources.mjs");
  const directory = createFixtureRoot(join(tmpdir(), "dotln-host-compiler-"));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  chmodSync(directory, 0o700);
  const missing = join(directory, "no-such-compiler");
  assert.throws(
    () =>
      taskLauncher(directory, {
        compiler: () => ({ compiler: missing, args: [] }),
      }),
    (error) => {
      assert.ok(
        error.message.includes(`The native compiler ${missing} was not found.`),
      );
      assert.ok(
        error.message.includes("the lock every gate task starts through"),
      );
      assert.ok(error.message.includes(compilerRemedy()));
      assert.match(error.message, /The tool's own message: .*ENOENT/u);
      assert.equal(error.cause.code, "ENOENT");
      return true;
    },
  );
  // A compiler that runs and fails keeps its own words.
  assert.throws(
    () =>
      taskLauncher(directory, {
        compiler: () => ({ compiler: "cc-fixture", args: [] }),
        run: () => {
          throw Object.assign(new Error("Command failed: cc-fixture"), {
            stderr: "fatal error: 'stdio.h' file not found",
          });
        },
      }),
    /The native compiler cc-fixture could not be run\..*The tool's own message: fatal error: 'stdio\.h' file not found \| Command failed: cc-fixture/su,
  );
  // The remedy is the platform's, and on macOS a missing SDK lookup is the
  // same error.
  assert.match(compilerRemedy("darwin"), /xcode-select --install/u);
  assert.match(compilerRemedy("linux"), /answers to cc/u);
  assert.match(compilerRemedy("win32"), /WSL2/u);
  assert.throws(
    () =>
      nativeCompiler({
        platform: "darwin",
        run: () => {
          throw Object.assign(new Error("spawn /usr/bin/xcrun ENOENT"), {
            code: "ENOENT",
          });
        },
      }),
    /The native compiler \/usr\/bin\/xcrun was not found\..*xcode-select --install/su,
  );
  assert.deepEqual(nativeCompiler({ platform: "linux" }), {
    compiler: "cc",
    args: [],
  });
  // Nothing was left behind by a failed build.
  assert.deepEqual(
    readdirSync(directory).filter((name) => name.includes("host-lock")),
    [],
  );
});

// Injected facts for the host report: every assumption met, on a host whose
// name, user, home directory and origin must never be printed.
const doctorFacts = (over = {}) => ({
  root,
  nodeVersion: process.version,
  gitVersion: "git version 2.55.0",
  platform: "darwin",
  wsl: false,
  processors: 16,
  memoryBytes: 48 * 2 ** 30,
  compile: () => {},
  symlink: () => {},
  laneCapacity: () => 8,
  gitConfig: () => null,
  lineAttributes: () => [{ text: "unset", eol: "unspecified" }],
  originUrl: () =>
    "git@forge.example.net:synthetic-owner/synthetic-repository.git",
  pushTarget: () => ({
    host: "forge.example.net",
    selector: "forge.example.net/synthetic-owner/synthetic-repository",
  }),
  tool: (command) =>
    command === "gh"
      ? "gh version 2.98.0 (2026-01-01)"
      : command === "claude"
        ? "2.1.322 (Claude Code)"
        : null,
  electedHosts: () => ({ "host-codex": false, "host-copilot": false }),
  hostName: "build-host-17.corp.example.net",
  userName: "synthetic-user",
  homeDirectory: "/Users/synthetic-user",
  ...over,
});

test("WO-276 criteria H1 to H3: the host report gives a row for each assumption with its observed value, verdict, dependant and remedy; three unmet at once exit 1; a fact it cannot read is unknown and changes no exit code; and no row carries the host's name, the user's, the home directory, the origin or an absolute path", async () => {
  const { hostReport, renderHostReport, reportExitCode } =
    await import("./lib/host-doctor.mjs");
  const { compilerFailure } = await import("./lib/host-resources.mjs");
  const met = hostReport(root, doctorFacts());
  assert.deepEqual(
    met.map((row) => [row.id, row.verdict]),
    [
      ["node", "met"],
      ["git", "met"],
      ["compiler", "met"],
      ["lane-memory", "met"],
      ["symlinks", "met"],
      ["line-endings", "met"],
      ["forge", "met"],
      ["platform", "met"],
      ["agent-claude", "reported"],
    ],
  );
  for (const row of met)
    for (const field of [
      "assumption",
      "observed",
      "verdict",
      "dependsOn",
      "remedy",
    ])
      assert.ok(row[field].length > 0, `${row.id}: ${field}`);
  assert.equal(reportExitCode(met), 0);
  // A Node below the floor, a Git below the floor and a compiler that
  // fails, all at once: three rows unmet in one run, each with its remedy.
  const failing = () => {
    throw new Error(
      "spawn /usr/bin/cc ENOENT in /Users/synthetic-user/work on build-host-17.corp.example.net",
    );
  };
  const unmet = hostReport(
    root,
    doctorFacts({
      nodeVersion: "v18.20.0",
      gitVersion: "git version 2.20.1",
      // The helpers' own error for a compiler that cannot be run.
      compile: () => {
        try {
          failing();
        } catch (error) {
          throw compilerFailure("/usr/bin/cc", error, "darwin");
        }
      },
    }),
  );
  assert.deepEqual(
    unmet.filter((row) => row.verdict === "unmet").map((row) => row.id),
    ["node", "git", "compiler"],
  );
  assert.equal(reportExitCode(unmet), 1);
  const remedyOf = (rows, id) => rows.find((row) => row.id === id).remedy;
  assert.match(remedyOf(unmet, "node"), /engines\.node/u);
  assert.match(remedyOf(unmet, "git"), /engines\.git >=2\.31\.0/u);
  assert.match(remedyOf(unmet, "compiler"), /xcode-select --install/u);
  // A fact that cannot be read is unknown, and unknown changes no exit code.
  const unknown = hostReport(
    root,
    doctorFacts({
      gitConfig: failing,
      originUrl: () => null,
      symlink: failing,
    }),
  );
  assert.deepEqual(
    unknown
      .map((row) => [row.id, row.verdict])
      .filter(([, verdict]) => verdict !== "met" && verdict !== "reported"),
    [
      ["symlinks", "unmet"],
      ["line-endings", "unknown"],
      ["forge", "unknown"],
    ],
  );
  const onlyUnknown = hostReport(
    root,
    doctorFacts({ gitConfig: failing, originUrl: () => null }),
  );
  assert.equal(reportExitCode(onlyUnknown), 0);
  // An origin the publish helpers refuse, a conversion that is on, and the
  // other platforms.
  const other = hostReport(
    root,
    doctorFacts({
      originUrl: () => "https://forge.example.net/a/b/c/d",
      pushTarget: failing,
      gitConfig: () => "true",
      lineAttributes: () => [{ text: "unspecified", eol: "unspecified" }],
      platform: "win32",
    }),
  );
  assert.deepEqual(
    other.filter((row) => row.verdict === "unmet").map((row) => row.id),
    ["line-endings", "forge", "platform"],
  );
  assert.match(
    hostReport(root, doctorFacts({ platform: "linux", wsl: 2 })).find(
      (row) => row.id === "platform",
    ).observed,
    /^WSL2, which the kit is designed for and not exercised on$/u,
  );
  // Nothing of the host: its name, the user's, the home directory, the
  // origin's host or owner, any host name, any URL, any absolute path.
  for (const rows of [met, unmet, unknown, onlyUnknown, other]) {
    const printed = `${renderHostReport(rows)}\n${JSON.stringify(rows, null, 2)}`;
    for (const withheld of [
      "build-host-17",
      "synthetic-user",
      "/Users/",
      "forge.example.net",
      "synthetic-owner",
      "synthetic-repository",
    ])
      assert.ok(!printed.includes(withheld), withheld);
    assert.doesNotMatch(
      printed,
      /\b[a-z0-9-]+(?:\.[a-z0-9-]+)*\.(?:com|net|org|io|dev|local|internal|corp|lan)\b/iu,
    );
    assert.doesNotMatch(printed, /[a-z][a-z0-9+.-]*:\/\//iu);
    assert.doesNotMatch(printed, /(?:^|[\s"'(|:=])\/(?:[\w.@+-]+\/)+/mu);
    assert.doesNotMatch(printed, /\b[A-Za-z]:\\/u);
  }
});

test("WO-276 criteria H2 and H3: host elections that cannot be read are one unknown row that changes no exit code and no elected host's CLI is looked for; and a path, an address or a share written in any script is withheld from the table and the JSON", async () => {
  const { hostReport, renderHostReport, reportExitCode } =
    await import("./lib/host-doctor.mjs");
  const verdicts = (rows) => rows.map((row) => [row.id, row.verdict]);
  // The elections read: a host that is on has its CLI looked for.
  const asked = [];
  const tool = (command) => {
    asked.push(command);
    return command === "codex" ? "codex-cli 0.167.2" : "1.0.0";
  };
  const on = hostReport(
    root,
    doctorFacts({
      tool,
      electedHosts: () => ({ "host-codex": true, "host-copilot": false }),
    }),
  );
  assert.deepEqual(verdicts(on).slice(-2), [
    ["agent-claude", "reported"],
    ["agent-codex", "reported"],
  ]);
  // The elections unreadable, whatever the read's failure says: one unknown
  // row, no row for a host that may or may not be on, and its CLI not asked.
  asked.length = 0;
  const unread = hostReport(
    root,
    doctorFacts({
      tool,
      electedHosts: () => {
        throw new Error(
          "dotln.config.json: Unexpected token in /Users/synthetic-user/work/dotln.config.json",
        );
      },
    }),
  );
  assert.deepEqual(verdicts(unread).slice(-3), [
    ["platform", "met"],
    ["host-elections", "unknown"],
    ["agent-claude", "reported"],
  ]);
  assert.deepEqual(asked, ["gh", "claude"]);
  assert.equal(reportExitCode(unread), 0);
  assert.match(
    renderHostReport(unread),
    /^0 unmet, 1 unknown, of 10 rows\.$/mu,
  );
  const elections = unread.find((row) => row.id === "host-elections");
  for (const field of ["assumption", "observed", "dependsOn", "remedy"])
    assert.ok(elections[field].length > 0, field);
  assert.ok(!JSON.stringify(unread).includes("synthetic-user"));
  // With a floor unmet beside it the exit code is the floor's, not its.
  assert.equal(
    reportExitCode(
      hostReport(
        root,
        doctorFacts({
          nodeVersion: "v18.20.0",
          electedHosts: () => {
            throw new Error("unreadable");
          },
        }),
      ),
    ),
    1,
  );
  // A tool that is on the path and does not answer for its version is a
  // fact that could not be read: the forge row is unknown and the exit code
  // unchanged. A tool that is not there is still unmet.
  const silent = (names) => (command) => {
    if (names.includes(command))
      throw new Error(
        "Command failed: gh --version in /Users/synthetic-user/work",
      );
    return doctorFacts().tool(command);
  };
  const unanswered = hostReport(root, doctorFacts({ tool: silent(["gh"]) }));
  const forgeOf = (rows) => rows.find((row) => row.id === "forge");
  assert.equal(forgeOf(unanswered).verdict, "unknown");
  assert.match(
    forgeOf(unanswered).observed,
    /; gh found, and its version could not be read$/u,
  );
  assert.match(forgeOf(unanswered).remedy, /gh --version/u);
  assert.equal(reportExitCode(unanswered), 0);
  assert.ok(!JSON.stringify(unanswered).includes("synthetic-user"));
  const absent = hostReport(
    root,
    doctorFacts({
      tool: (command) =>
        command === "gh" ? null : doctorFacts().tool(command),
    }),
  );
  assert.deepEqual(
    [forgeOf(absent).verdict, reportExitCode(absent)],
    ["unmet", 1],
  );
  // An origin the helpers refuse is unmet whatever the tool answers.
  assert.equal(
    forgeOf(
      hostReport(
        root,
        doctorFacts({
          tool: silent(["gh"]),
          pushTarget: () => {
            throw new Error("two targets");
          },
        }),
      ),
    ).verdict,
    "unmet",
  );
  // An agent CLI that does not answer is reported so, and judged no more
  // than one that does.
  const quiet = hostReport(root, doctorFacts({ tool: silent(["claude"]) }));
  const agent = quiet.find((row) => row.id === "agent-claude");
  assert.deepEqual(
    [agent.observed, agent.verdict],
    ["found, and its version could not be read", "reported"],
  );
  assert.equal(reportExitCode(quiet), 0);
  // A fact that reaches a row as the host gave it, in scripts other than
  // ASCII: each of these is withheld whole, with the words around it kept.
  for (const [given, withheld] of [
    ["from /équipe", ["équipe"]],
    ["from /文書/проект/", ["文書", "проект"]],
    ["at /Users/Ünïcödé/work", ["Ünïcödé", "/Users"]],
    ['in "/tmp/π"', ["π", "/tmp"]],
    ["by utilisateur-é@hôte-ü:/chemin/π", ["utilisateur", "hôte", "chemin"]],
    ["on \\\\sërveur\\partagé\\x", ["sërveur", "partagé"]],
    ["on C:\\Üsers\\ñ", ["Üsers", "ñ"]],
    ["via ssh://hôte.example/répertoire", ["hôte", "répertoire"]],
  ]) {
    const rows = hostReport(root, doctorFacts({ nodeVersion: given }));
    const printed = `${renderHostReport(rows)}\n${JSON.stringify(rows, null, 2)}`;
    for (const text of withheld) assert.ok(!printed.includes(text), given);
    // No slash opens a path anywhere in what is printed.
    assert.doesNotMatch(printed, /(?:^|[\s"'(|:=])\/[^\s/]/mu, given);
    assert.ok(printed.includes(`Node ${given.split(" ")[0]} `), given);
  }
  // The report's own words that hold a slash stand.
  const own = renderHostReport(hostReport(root, doctorFacts()));
  assert.ok(own.includes("HOST/OWNER/REPO"));
});

test("WO-276 criteria H2 and H9: the doctor's entry prints the table or the same rows as JSON; with its library unable to load it still prints the Node row with the floor and exits 1; it lists the agent CLI of a host only when the instance has that host on, and asks no other tool its version; and its imports are Node's own modules and build-free modules", async () => {
  const { hostReport } = await import("./lib/host-doctor.mjs");
  const { doctor, nodeRowAlone, KIT_PACKAGE } = await import("./doctor.mjs");
  const { judgeRunningNode } = await import("./lib/node-engines.mjs");
  // The entry derives no root of its own: the one file it reads before the
  // library loads is the package.json at the configuration module's root,
  // and without a root it judges Node by that file.
  const { TOOL_ROOT } = await import("./lib/config.mjs");
  const { fileURLToPath } = await import("node:url");
  assert.equal(fileURLToPath(KIT_PACKAGE), join(TOOL_ROOT, "package.json"));
  assert.deepEqual(
    nodeRowAlone(process.version),
    nodeRowAlone(process.version, TOOL_ROOT),
  );
  const run = async (argv, options) => {
    const lines = [];
    const exitCode = await doctor(argv, {
      root,
      write: (text) => lines.push(text),
      ...options,
    });
    return { exitCode, output: lines.join("\n") };
  };
  const table = await run([], { facts: doctorFacts() });
  const json = await run(["--json"], { facts: doctorFacts() });
  assert.equal(table.exitCode, 0);
  assert.deepEqual(JSON.parse(json.output), hostReport(root, doctorFacts()));
  for (const row of JSON.parse(json.output))
    assert.ok(
      table.output.includes(
        `| ${row.assumption} | ${row.observed} | ${row.verdict} |`,
      ),
      row.id,
    );
  assert.equal(
    (await run(["--verbose"], { facts: doctorFacts() })).exitCode,
    2,
  );
  // A Node below the floor and a library that cannot be loaded under it:
  // the Node row is printed with the floor, from package.json alone.
  const range = JSON.parse(readFileSync(join(root, "package.json"), "utf8"))
    .engines.node;
  const old = await run([], {
    nodeVersion: "v18.20.0",
    load: () => Promise.reject(new SyntaxError("Unexpected token")),
  });
  assert.equal(old.exitCode, 1);
  assert.ok(old.output.includes("Node v18.20.0"), old.output);
  assert.ok(old.output.includes(range), old.output);
  const unloadable = await run(["--json"], {
    load: () => Promise.reject(new Error("Cannot find module")),
  });
  assert.equal(unloadable.exitCode, 0);
  assert.deepEqual(
    JSON.parse(unloadable.output).map((row) => [row.id, row.verdict]),
    [
      ["node", "met"],
      ["modules", "unknown"],
    ],
  );
  // The entry's own judgment of Node and the kit's agree, version by
  // version, so the row is the same whichever module printed it.
  for (const version of [
    "v18.20.0",
    "v24.14.9",
    "v24.15.0",
    "v25.1.0",
    "v26.0.0",
    process.version,
    "v27.0.0",
    // A prerelease of an admitted version is admitted by neither.
    "v24.15.0-rc.1",
    "v26.0.0-nightly20260101abcdef",
  ])
    assert.equal(
      nodeRowAlone(version, root).verdict === "met",
      judgeRunningNode(version, root).admitted,
      version,
    );
  // A host's agent CLI is looked for only when the instance has the host
  // on; no other tool is asked its version.
  const asked = [];
  const tool = (command) => {
    asked.push(command);
    return `${command} 1.2.3`;
  };
  const claudeOnly = hostReport(root, doctorFacts({ tool }));
  assert.deepEqual(asked.sort(), ["claude", "gh"]);
  assert.deepEqual(
    claudeOnly
      .filter((row) => row.id.startsWith("agent-"))
      .map((row) => row.id),
    ["agent-claude"],
  );
  asked.length = 0;
  const withCodex = hostReport(
    root,
    doctorFacts({
      tool,
      electedHosts: () => ({ "host-codex": true, "host-copilot": false }),
    }),
  );
  assert.deepEqual(asked.sort(), ["claude", "codex", "gh"]);
  assert.deepEqual(
    withCodex
      .filter((row) => row.id.startsWith("agent-"))
      .map((row) => [row.id, row.verdict]),
    [
      ["agent-claude", "reported"],
      ["agent-codex", "reported"],
    ],
  );
  // The imports, followed from the entry: Node's own modules, and files of
  // this repository that need no build and no install (no compiled output,
  // no package a registry supplies).
  const seen = new Set();
  const outside = [];
  const visit = (file) => {
    if (seen.has(file)) return;
    seen.add(file);
    if (!/\.m?js$/u.test(file)) return;
    for (const specifier of sourceImports(
      readFileSync(join(root, file), "utf8"),
    )) {
      if (specifier.startsWith("node:")) continue;
      if (!specifier.startsWith(".")) {
        outside.push(`${file}: ${specifier}`);
        continue;
      }
      const target = join(dirname(file), specifier);
      if (/(?:^|\/)dist\//u.test(target) || !existsSync(join(root, target)))
        outside.push(`${file}: ${specifier}`);
      else visit(target);
    }
  };
  assert.deepEqual(
    sourceImports(
      readFileSync(join(root, "scripts/doctor.mjs"), "utf8"),
    ).sort(),
    ["./lib/host-doctor.mjs", "node:fs", "node:path", "node:url"],
  );
  visit("scripts/doctor.mjs");
  assert.deepEqual(outside, []);
  assert.ok(seen.has("scripts/lib/host-doctor.mjs"));
  assert.ok(seen.size > 5, `${seen.size} modules`);
});

test("WO-276 (the attack on Part H): the report sizes a lane by the host's own record, judges the origin as the publish helpers do, reads core.autocrlf as Git reads it and every kit file's attributes, calls a build that never reached the compiler unknown, prints with no user name to withhold and through a linked path, withholds a name of two letters, an address and a path of one segment, and reads a prerelease, an unknown platform and WSL1 as unmet", async (t) => {
  const {
    autocrlfWord,
    hostFacts,
    hostReport,
    renderHostReport,
    reportExitCode,
    wslGeneration,
  } = await import("./lib/host-doctor.mjs");
  const { recordedHostLaneCapacity, checkHost } =
    await import("./lib/host-resources.mjs");
  const { nodeRowAlone } = await import("./doctor.mjs");
  const rowOf = (rows, id) => rows.find((row) => row.id === id);
  const failing = (message) => () => {
    throw new Error(message);
  };

  // The lane row and the host task read one record: a host of four
  // processors whose record says eight lanes is judged at eight, and one of
  // sixteen whose record says two at two.
  const sized = (processors, capacity) =>
    rowOf(
      hostReport(
        root,
        doctorFacts({
          processors,
          memoryBytes: 16 * 2 ** 30,
          laneCapacity: () => capacity,
        }),
      ),
      "lane-memory",
    );
  assert.equal(sized(4, 8).verdict, "unmet", sized(4, 8).observed);
  // A lane's size follows the root's own gate share, the owner's line in
  // docs/control/budgets.json (the kit's half where the file sets none): on
  // a 16 GiB host of eight lanes each lane has an eighth of that share. The
  // case pinned 1.0 GiB while the share was a half, and went red when the
  // owner raised it.
  const gateShare =
    JSON.parse(readFileSync(join(root, "docs/control/budgets.json"), "utf8"))
      .memory?.gateShare ?? 0.5;
  assert.ok(
    sized(4, 8).observed.endsWith(
      `, 8 lanes of ${((16 * gateShare) / 8).toFixed(1)} GiB each`,
    ),
    sized(4, 8).observed,
  );
  assert.equal(sized(16, 2).verdict, "met", sized(16, 2).observed);
  assert.match(sized(16, 2).observed, /, 2 lanes of /u);
  assert.equal(hostFacts(root).laneCapacity(), recordedHostLaneCapacity());
  const noRecord = rowOf(
    hostReport(
      root,
      doctorFacts({ laneCapacity: failing("lane-capacity.json is malformed") }),
    ),
    "lane-memory",
  );
  assert.equal(noRecord.verdict, "unknown");
  assert.match(noRecord.remedy, /lane-capacity\.json/u);

  // A clone of its own: the facts as the report reads them from Git.
  const clone = createFixtureRoot(join(tmpdir(), "dotln-doctor-facts-"));
  t.after(() => rmSync(clone, { recursive: true, force: true }));
  runGit(clone, ["init", "-q", "-b", "main"]);
  writeFileSync(join(clone, "package.json"), "{}\n");
  writeFileSync(join(clone, "reader.mjs"), "export {};\n");
  writeFileSync(join(clone, "notes.md"), "# Notes\n");
  writeFileSync(join(clone, ".gitattributes"), "* -text\n");
  runGit(clone, [
    "add",
    "package.json",
    "reader.mjs",
    "notes.md",
    ".gitattributes",
  ]);
  const facts = () => hostFacts(clone);
  const judged = (over = {}) => hostReport(root, doctorFacts({ ...over }));
  // The origin: one target for fetch and push, as the helpers require.
  runGit(clone, [
    "remote",
    "add",
    "origin",
    "https://github.com/example/reader.git",
  ]);
  assert.equal(facts().pushTarget().selector, "github.com/example/reader");
  runGit(clone, [
    "remote",
    "set-url",
    "--push",
    "origin",
    "https://github.com/example/writer.git",
  ]);
  assert.throws(() => facts().pushTarget());
  const split = rowOf(
    judged({
      originUrl: facts().originUrl,
      pushTarget: facts().pushTarget,
    }),
    "forge",
  );
  assert.equal(split.verdict, "unmet");
  assert.match(split.remedy, /for both fetch and push/u);
  runGit(clone, [
    "remote",
    "set-url",
    "--push",
    "origin",
    "https://github.com/example/reader.git",
  ]);
  runGit(clone, [
    "config",
    "--add",
    "remote.origin.url",
    "https://github.com/example/second.git",
  ]);
  assert.throws(() => facts().pushTarget(), "two fetch addresses");

  // core.autocrlf in each spelling Git reads as a boolean.
  for (const [raw, word] of [
    [null, "unset"],
    ["true", "true"],
    ["True", "true"],
    ["yes", "true"],
    ["on", "true"],
    ["1", "true"],
    ["", "true"],
    ["false", "false"],
    ["No", "false"],
    ["off", "false"],
    ["0", "false"],
    ["input", "input"],
    ["sometimes", "of a value Git does not read"],
  ])
    assert.equal(autocrlfWord(raw), word, String(raw));
  runGit(clone, ["config", "core.autocrlf", "yes"]);
  assert.equal(facts().gitConfig("core.autocrlf"), "yes");
  assert.equal(facts().gitConfig("core.no-such-key"), null);
  const lineRow = (over) => rowOf(judged(over), "line-endings");
  // With every file `-text` nothing converts, whatever core.autocrlf says.
  assert.deepEqual(facts().lineAttributes(), [
    { text: "unset", eol: "unspecified" },
    { text: "unset", eol: "unspecified" },
    { text: "unset", eol: "unspecified" },
    { text: "unset", eol: "unspecified" },
  ]);
  assert.equal(
    lineRow({
      gitConfig: facts().gitConfig,
      lineAttributes: facts().lineAttributes,
    }).verdict,
    "met",
  );
  // An attribute under that line that converts the kit's scripts, while
  // package.json stays `-text`.
  writeFileSync(
    join(clone, ".gitattributes"),
    "* -text\n*.mjs text eol=crlf\n",
  );
  const scripts = lineRow({
    gitConfig: () => "false",
    lineAttributes: facts().lineAttributes,
  });
  assert.equal(scripts.verdict, "unmet");
  assert.match(
    scripts.observed,
    /^core\.autocrlf false; 1 of 4 tracked kit files open to conversion$/u,
  );
  // An `eol` with `text` unspecified converts too, and so does a file the
  // attributes say nothing of once core.autocrlf is on.
  writeFileSync(join(clone, ".gitattributes"), "* eol=crlf\n");
  assert.equal(
    lineRow({ gitConfig: () => null, lineAttributes: facts().lineAttributes })
      .verdict,
    "unmet",
  );
  writeFileSync(join(clone, ".gitattributes"), "*.json -text\n");
  assert.equal(
    lineRow({ gitConfig: () => null, lineAttributes: facts().lineAttributes })
      .verdict,
    "met",
  );
  assert.match(
    lineRow({ gitConfig: () => "On", lineAttributes: facts().lineAttributes })
      .observed,
    /^core\.autocrlf true; 3 of 4 tracked kit files open to conversion$/u,
  );
  // core.autocrlf input changes no file on checkout, and on add only
  // toward the line endings the kit ships: the row says so and is met
  // (rolling review 25).
  const input = lineRow({
    gitConfig: () => "input",
    lineAttributes: facts().lineAttributes,
  });
  assert.equal(input.verdict, "met");
  assert.equal(
    input.observed,
    "core.autocrlf input (Git then converts on add alone, toward the line endings the kit ships); 0 of 4 tracked kit files open to conversion",
  );
  // In an instance the kit's files are the manifest's: an attribute on a
  // file of the instance's own is no conversion of a kit file.
  writeFileSync(join(clone, ".gitattributes"), "* -text\n*.md text\n");
  writeFileSync(
    join(clone, "KIT-MANIFEST.json"),
    `${JSON.stringify({ files: [{ path: "package.json" }, { path: "reader.mjs" }] })}\n`,
  );
  assert.deepEqual(facts().lineAttributes(), [
    { text: "unset", eol: "unspecified" },
    { text: "unset", eol: "unspecified" },
  ]);

  // A build that stopped before the compiler says nothing of the compiler.
  const stopped = hostReport(
    root,
    doctorFacts({
      compile: () => {
        throw new TypeError(
          'The "path" argument must be of type string. Received undefined',
        );
      },
    }),
  );
  assert.equal(rowOf(stopped, "compiler").verdict, "unknown");
  assert.doesNotMatch(rowOf(stopped, "compiler").remedy, /xcode-select/u);
  assert.equal(reportExitCode(stopped), 0);

  // The entry itself, started through a linked path, and on a host that
  // gives no user name: the rows are printed either way.
  const linked = createFixtureRoot(join(tmpdir(), "dotln-doctor-link-"));
  t.after(() => rmSync(linked, { recursive: true, force: true }));
  symlinkSync(root, join(linked, "kit"));
  const preload = join(linked, "no-user.cjs");
  writeFileSync(
    preload,
    'const os = require("node:os");\nos.userInfo = () => {\n  throw new Error("uv_os_get_passwd returned ENOENT");\n};\nrequire("node:module").syncBuiltinESMExports();\n',
  );
  for (const [label, args] of [
    ["a linked path", [join(linked, "kit/scripts/doctor.mjs"), "--json"]],
    [
      "no user name",
      ["--require", preload, join(root, "scripts/doctor.mjs"), "--json"],
    ],
  ]) {
    const ran = spawnSync(process.execPath, args, {
      cwd: linked,
      encoding: "utf8",
    });
    assert.notEqual(ran.status, 2, `${label}: ${ran.stderr}`);
    assert.ok(
      JSON.parse(ran.stdout).some((row) => row.id === "platform"),
      label,
    );
  }

  // A host or a user named for one of the report's own words changes no
  // verdict, no row's identity and so not the exit status (rolling review
  // 26): the redaction is of what a row shows, never of how it is judged.
  const namesake = hostReport(
    root,
    doctorFacts({
      hostName: "unmet",
      userName: "met",
      homeDirectory: "/Users/met",
      gitVersion: "git version 2.20.1",
    }),
  );
  assert.equal(reportExitCode(namesake), 1);
  assert.ok(namesake.some((row) => row.verdict === "unmet"));
  assert.ok(namesake.some((row) => row.verdict === "met"));
  assert.ok(
    namesake.every((row) => !/withheld/u.test(`${row.id} ${row.verdict}`)),
  );
  // What a row must not carry, put where a row prints a fact as the host
  // gave it (the Node version's own text), in each form.
  const host = {
    hostName: "Build-Host",
    userName: "dw",
    homeDirectory: "/Users/dw",
  };
  for (const [secret, kept] of [
    ["built by dw today", "built by <withheld> today"],
    ["on build-host now", "on <withheld> now"],
    ["a hardware window", "a hardware window"],
    ["in /Users/dw/work", null],
    ["in /dw", null],
    ["from \\\\fileserver\\share\\dw", null],
    ["git@forge.example.net:synthetic-owner/synthetic-repository.git", null],
    ["at fe80::1ff:fe23:4567:890a", null],
    ["at [2001:db8::1]:8443", null],
    ["https://forge.example.net/synthetic-owner", null],
    ["C:\\Users\\dw", null],
  ]) {
    const rows = hostReport(
      root,
      doctorFacts({ ...host, nodeVersion: secret }),
    );
    const printed = `${renderHostReport(rows)}\n${JSON.stringify(rows)}`;
    if (kept) assert.ok(printed.includes(`Node ${kept}`), secret);
    else
      for (const part of [
        secret,
        "fileserver",
        "forge.example.net",
        "synthetic-owner",
        "fe80",
        "2001:db8",
        "/dw",
        "Users",
      ])
        assert.ok(!printed.includes(part), `${secret}: ${part}`);
  }
  // A Git version line the judge cannot read is not repeated.
  const odd = hostReport(
    root,
    doctorFacts({ gitVersion: "git from /Users/dw/bin on Build-Host" }),
  );
  assert.equal(rowOf(odd, "git").verdict, "unmet");
  assert.match(rowOf(odd, "git").remedy, /a line this report does not repeat/u);

  // A prerelease is outside the range in the entry's own judgment, as in
  // the kit's; a platform that was read and is not one the kit runs on is
  // unmet; so is the first generation of WSL.
  assert.equal(nodeRowAlone("v24.15.0-rc.1", root).verdict, "unmet");
  assert.equal(
    nodeRowAlone("v26.0.0-nightly20260101abcdef", root).verdict,
    "unmet",
  );
  assert.equal(
    rowOf(hostReport(root, doctorFacts({ platform: "freebsd" })), "platform")
      .verdict,
    "unmet",
  );
  assert.equal(
    wslGeneration(
      "Linux version 5.15.90.1-microsoft-standard-WSL2 (oe-user@oe-host)",
    ),
    2,
  );
  assert.equal(
    wslGeneration(
      "Linux version 4.4.0-19041-Microsoft (Microsoft@Microsoft.com)",
    ),
    1,
  );
  assert.equal(wslGeneration("Linux version 6.8.0-45-generic"), null);
  const first = rowOf(
    hostReport(root, doctorFacts({ platform: "linux", wsl: 1 })),
    "platform",
  );
  assert.equal(first.verdict, "unmet");
  assert.match(first.observed, /^WSL1, /u);
  void checkHost;
});

test("exclusive overlap uses only measured light peers and preserves its nested lease", async (t) => {
  const { acquireHostLaneCapacity, acquireHostLanes } =
    await import("./lib/host-lanes.mjs");
  const dir = createFixtureRoot(join(tmpdir(), "dotln-overlap-"));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  await acquireHostLaneCapacity({ directory: dir, capacity: 8 });
  const samples = [
    {
      name: "light-a",
      loadClass: "shared",
      durationMs: 59_999,
      peakRssBytes: 512 * 2 ** 20 - 1,
    },
    { name: "light-b", loadClass: "shared", durationMs: 1, peakRssBytes: 1 },
    { name: "heavy", loadClass: "shared", durationMs: 60_000, peakRssBytes: 1 },
    {
      name: "memory-heavy",
      loadClass: "shared",
      durationMs: 1,
      peakRssBytes: 512 * 2 ** 20,
    },
    { name: "isolated", loadClass: "isolated", durationMs: 1, peakRssBytes: 1 },
    { name: "unknown", loadClass: "shared", durationMs: 1, peakRssBytes: null },
  ];
  const lightTasks = lightSuiteNames(samples);
  assert.deepEqual([...lightTasks], ["light-a", "light-b"]);
  const active = new Set(),
    events = [];
  let peakPeers = 0;
  let releaseExclusive, releasePeers;
  const exclusiveEntered = new Promise((resolve) => {
    releaseExclusive = resolve;
  });
  const peersEntered = new Promise((resolve) => {
    releasePeers = resolve;
  });
  const waitFor = async (promise, label) => {
    let timer;
    try {
      await Promise.race([
        promise,
        new Promise((_, reject) => {
          timer = setTimeout(
            () => reject(new Error(`Timed out waiting for ${label}`)),
            5_000,
          );
        }),
      ]);
    } finally {
      clearTimeout(timer);
    }
  };
  const rows = await scheduleSuites(
    [
      barrier,
      {
        name: "exclusive",
        command: ["fixture"],
        exclusive: true,
        overlap: 2,
        priority: 200,
      },
      { name: "heavy", command: ["fixture"], priority: 100 },
      { name: "light-a", command: ["fixture"] },
      { name: "light-b", command: ["fixture"] },
    ],
    {
      parallelism: 16,
      lightTasks,
      hostLanes: { directory: dir, capacity: 8, parentLease: null },
      acquireLanes: async (options) => {
        // Delay admission so entry signals, rather than host timing, prove overlap.
        if (lightTasks.has(options.task))
          await new Promise((done) => setTimeout(done, 150));
        return acquireHostLanes(options);
      },
      execute: async (row) => {
        if (lightTasks.has(row.name))
          await waitFor(exclusiveEntered, "exclusive nested lease");
        events.push(`start:${row.name}`);
        active.add(row.name);
        if (row.name === "exclusive") {
          assert.equal(row.gateContext.reservedSlots, 6);
          assert.equal(row.gateContext.concurrency, 3);
          assert.equal(row.gateContext.loadFactor, 6);
          const nested = await acquireHostLanes({
            directory: dir,
            parentLease: row.hostLease,
            slots: 6,
            task: "nested",
            worktree: root,
          });
          try {
            assert.equal(nested.record.parent, row.hostLease.file);
            assert.equal(nested.record.slots, 6);
            await assert.rejects(
              acquireHostLanes({
                directory: dir,
                parentLease: row.hostLease,
                slots: 7,
              }),
              /inherited lane reservation/,
            );
            releaseExclusive();
            await waitFor(peersEntered, "both light entries");
          } finally {
            await nested.release();
          }
        } else if (!row.build) {
          if (active.has("exclusive")) {
            assert.ok(lightTasks.has(row.name));
            peakPeers = Math.max(peakPeers, active.size - 1);
            if (peakPeers === 2) releasePeers();
          }
          if (lightTasks.has(row.name))
            await waitFor(peersEntered, "both light entries");
        }
        active.delete(row.name);
        events.push(`end:${row.name}`);
        return { name: row.name, executed: true, exitCode: 0 };
      },
    },
  );
  assert.ok(
    rows.every((row) => row.exitCode === 0),
    JSON.stringify(rows),
  );
  assert.equal(peakPeers, 2, JSON.stringify(events));
  assert.ok(events.indexOf("start:heavy") > events.indexOf("end:exclusive"));
  assert.equal(rows.find((row) => row.name === "exclusive").hostLaneSlots, 6);
});

test("an exclusive gate reserves unused overlap slots against an independent gate", async (t) => {
  const { acquireHostLaneCapacity, acquireHostLanes } =
    await import("./lib/host-lanes.mjs");
  const directory = createFixtureRoot(join(tmpdir(), "dotln-exclusive-host-"));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  await acquireHostLaneCapacity({ directory, capacity: 8 });
  const rows = await scheduleSuites(
    [
      barrier,
      { name: "exclusive", command: ["fixture"], exclusive: true, overlap: 2 },
    ],
    {
      hostLanes: { directory, capacity: 8, parentLease: null },
      execute: async (row) => {
        if (row.name === "exclusive") {
          assert.equal(row.hostLease.record.slots, 6);
          const stop = new AbortController();
          let acquired = false;
          const other = acquireHostLanes({
            directory,
            slots: 1,
            parentLease: null,
            task: "independent heavy task",
            signal: stop.signal,
            onWait: () => {},
          }).then(
            async (lease) => {
              acquired = true;
              await lease.release();
            },
            (error) => {
              assert.match(error.message, /wait stopped/);
            },
          );
          await new Promise((done) => setTimeout(done, 150));
          stop.abort();
          await other;
          assert.equal(
            acquired,
            false,
            "unused overlap slots remain reserved for light peers of this gate",
          );
        }
        return { name: row.name, exitCode: 0, executed: true, durationMs: 1 };
      },
    },
  );
  assert.ok(
    rows.every((row) => row.exitCode === 0),
    JSON.stringify(rows),
  );
});

test("a light latest sample never erases an earlier heavy sample", () => {
  const sample = {
    name: "task",
    loadClass: "shared",
    durationMs: 1,
    peakRssBytes: 1,
  };
  for (const earlier of [
    { ...sample, durationMs: 60_000 },
    { ...sample, peakRssBytes: 512 * 2 ** 20 },
    { ...sample, loadClass: "isolated" },
  ])
    assert.equal(lightSuiteNames([earlier, sample]).has("task"), false);
  assert.equal(lightSuiteNames([sample, sample]).has("task"), true);
});

test("each hand-copied control entry is declared and copy drift is refused", async () => {
  const { copiedFixtureClosures, uncoveredFixtureInputs } =
    await import("./lib/machinery-coverage.mjs");
  const labels = [
    "configured publication check",
    "configured profile activation",
    "configured target effects",
    "concurrent work-order projection",
    "harness completion ownership",
    "harness control observation",
  ];
  const rows = copiedFixtureClosures(root);
  for (const label of labels) {
    const row = rows.find((entry) => entry.fixture === label);
    assert.ok(row, label);
    assert.deepEqual(uncoveredFixtureInputs(root, [row]), [], label);
    for (const entry of row.entries) {
      const drift = {
        ...row,
        files: row.files.filter((file) => file !== entry),
      };
      assert.ok(
        uncoveredFixtureInputs(root, [drift]).some(
          (finding) => finding.path === entry,
        ),
        `${label}: ${entry}`,
      );
    }
  }
});

test("target-worktree file tasks run under two independent deadlines at eight lanes", async () => {
  const suite = suites.find((row) => row.name === "target-worktree");
  const tasks = expandSuiteTasks([suite], root);
  assert.deepEqual(
    tasks.map((row) => row.name),
    ["close", "start", "publish", "release"].map(
      (group) => `target-worktree:file:test-target-worktree-${group}.mjs`,
    ),
  );
  let active = 0,
    peak = 0;
  const observed = await scheduleSuites([barrier, ...tasks], {
    parallelism: 16,
    execute: async (row) => {
      if (!row.build) {
        // Each file runs under the table's default row, with its own clock.
        assert.deepEqual(suiteTimeLimit(row, root), {
          ms: timeLimitsModule.TIME_LIMITS["suite.default"].ms,
          key: "suite.default",
        });
        peak = Math.max(peak, ++active);
        await new Promise((done) => setTimeout(done, 10));
        active--;
      }
      return { name: row.name, executed: true, exitCode: 0, durationMs: 1 };
    },
  });
  assert.equal(peak, 2);
  const cases = observed.filter((row) => !row.name.startsWith("build"));
  assert.equal(aggregateSuiteRows([suite], tasks, cases)[0].exitCode, 0);
  for (const task of tasks)
    assert.equal(
      aggregateSuiteRows(
        [suite],
        tasks,
        cases.filter((row) => row.name !== task.name),
      )[0].exitCode,
      1,
    );
});

test("review listing includes every available machinery declaration without a change selection", async (t) => {
  const repo = createFixtureRoot(join(tmpdir(), "dotln-review-list-"));
  t.after(() => rmSync(repo, { recursive: true, force: true }));
  runGit(repo, ["init", "-q", "-b", "main"]);
  excludeFixtureOwnership(repo);
  writeFileSync(join(repo, "README.md"), "Fixture\n");
  runGit(repo, ["add", "."]);
  runGit(repo, [
    "-c",
    "user.name=Fixture",
    "-c",
    "user.email=fixture@example.invalid",
    "-c",
    "commit.gpgsign=false",
    "commit",
    "-qm",
    "Fixture",
  ]);
  runGit(repo, ["update-ref", "refs/remotes/origin/main", "HEAD"]);
  const lines = [];
  const log = console.log;
  try {
    console.log = (line) => lines.push(String(line));
    for (const kit of [false, true]) {
      if (kit) writeFileSync(join(repo, "KIT-MANIFEST.json"), "{}\n");
      lines.length = 0;
      assert.equal((await runGate(["--list", "--review"], repo)).exitCode, 0);
      const names = new Set(
        lines
          .filter((line) => line.includes(" — protects:"))
          .map((line) => line.split(" — ")[0]),
      );
      for (const suite of suites.filter((row) => row.machinery)) {
        if (kit && suite.kit?.startsWith("core-only: "))
          assert.ok(!names.has(suite.name), suite.name);
        else assert.ok(names.has(suite.name), suite.name);
      }
      if (!kit) {
        lines.length = 0;
        assert.equal(
          (await runGate(["--list", "--review", "--selected"], repo)).exitCode,
          0,
        );
        const selected = new Set(
          lines
            .filter((line) => line.includes(" — protects:"))
            .map((line) => line.split(" — ")[0]),
        );
        for (const suite of suites.filter(
          (row) => row.machinery && !row.structural,
        ))
          assert.ok(!selected.has(suite.name), suite.name);
      }
    }
  } finally {
    console.log = log;
  }
});

test("Preflight keeps a complete structural pass after a passing partial and refuses a failing partial", async (t) => {
  const repo = realpathSync(
    createFixtureRoot(join(tmpdir(), "dotln-partial-preflight-")),
  );
  t.after(() => rmSync(repo, { recursive: true, force: true }));
  execGit(["init", "-q", "-b", "main", repo]);
  excludeFixtureOwnership(repo);
  writeFileSync(join(repo, "fixture.mjs"), "export const value = 1;\n");
  execGit(["add", "."], { cwd: repo });
  execGit(
    [
      "-c",
      "user.name=Fixture",
      "-c",
      "user.email=fixture@example.invalid",
      "commit",
      "-qm",
      "Fixture",
    ],
    { cwd: repo },
  );
  const { preflightRows, structuralSuites } =
    await import("./lib/gate-reuse.mjs");
  // Core's structural row holds the kit's tests of its configuration loader
  // and the recorded Git surface check before host, as the runner's own
  // structural phase runs them.
  const STRUCTURAL_SUITES = structuralSuites(repo);
  assert.deepEqual(STRUCTURAL_SUITES, CORE_STRUCTURAL_TASKS);
  // An instance's holds its own configuration row in their place, and the
  // handoff's list is the runner's there too: a root with a kit manifest and
  // no package source is an instance.
  const instance = createFixtureRoot(join(tmpdir(), "dotln-kit-structural-"));
  t.after(() => rmSync(instance, { recursive: true, force: true }));
  writeFileSync(join(instance, "KIT-MANIFEST.json"), "{}\n");
  assert.equal(isKitRoot(instance), true);
  assert.deepEqual(structuralSuites(instance), STRUCTURAL_TASKS);
  assert.deepEqual(STRUCTURAL_TASKS, [
    "format",
    "configuration",
    "registrations",
    "declarations",
    "generated",
    "host",
  ]);
  assert.ok(!STRUCTURAL_TASKS.includes("configuration-root"));
  assert.ok(!CORE_STRUCTURAL_TASKS.includes("configuration"));
  // Both lists name rows the runner declares, each structural by its name.
  for (const name of new Set([...STRUCTURAL_TASKS, ...CORE_STRUCTURAL_TASKS]))
    assert.equal(
      suites.find((row) => row.name === name)?.structural,
      true,
      name,
    );
  const codeIdentity = gateCodeIdentity(repo),
    treeHash = gateTreeHash(repo);
  const time = Date.now();
  const row = (delta, partial = false, exitCode = 0) => ({
    checkId: "structural",
    gateSelection: "structural",
    codeIdentity,
    treeHash,
    executed: true,
    exitCode,
    durationMs: 1,
    recordedAt: new Date(time + delta).toISOString(),
    evidenceRef: `fixture:structural:${delta}`,
    requiredSuites: [...STRUCTURAL_SUITES],
    ...(partial ? { partial: true } : {}),
    taskTimeline: STRUCTURAL_SUITES.map((name) => ({
      name,
      executed: true,
      exitCode: name === "generated" ? exitCode : 0,
      durationMs: 1,
      finishedAt: new Date(time + delta).toISOString(),
    })),
  });
  // A row of the six a kit runs does not cover core's structural phase.
  recordGateChecks(repo, [
    {
      ...row(-1),
      requiredSuites: STRUCTURAL_SUITES.filter(
        (name) => name !== "git-surface",
      ),
      taskTimeline: row(-1).taskTimeline.filter(
        (task) => task.name !== "git-surface",
      ),
    },
  ]);
  assert.equal(
    (await preflightRows(repo, codeIdentity, [])).missing[0]?.suite,
    "structural",
  );
  recordGateChecks(repo, [row(0)]);
  assert.deepEqual((await preflightRows(repo, codeIdentity, [])).missing, []);
  recordGateChecks(repo, [row(1, true)]);
  assert.deepEqual(
    (await preflightRows(repo, codeIdentity, [])).missing,
    [],
    "a passing partial observes tasks without replacing or revoking their complete pass",
  );
  recordGateChecks(repo, [row(2, true, 1)]);
  const refused = await preflightRows(repo, codeIdentity, []);
  assert.equal(refused.missing[0].suite, "structural");
  assert.ok(refused.missing[0].displaced.includes("generated"));
});

test("dispatch bounds stop complete host admission on each metric and preserve focused reproduction", async (t) => {
  const repo = createFixtureRoot(join(tmpdir(), "dotln-dispatch-gate-"));
  t.after(() => rmSync(repo, { recursive: true, force: true }));
  const gitOptions = { exec: true, stdio: ["ignore", "pipe", "pipe"] };
  runGit(repo, ["init", "-b", "main"], gitOptions);
  excludeFixtureOwnership(repo);
  mkdirSync(join(repo, "scripts"));
  writeFileSync(join(repo, ".gitignore"), "docs/control/local/\nran.txt\n");
  writeFileSync(
    join(repo, "scripts/host.mjs"),
    `import {checkHost} from ${JSON.stringify(pathToFileURL(join(root, "scripts/structural-checks.mjs")).href)};
import {dispatchStanding} from ${JSON.stringify(pathToFileURL(join(root, "scripts/lib/dispatch-bound.mjs")).href)};
const sample={level:"normal",pressure:0,swapBytes:0,physicalBytes:2**36,source:"fixture"};
const standing=process.argv.includes("--dispatch-bound")?dispatchStanding(process.cwd()):undefined;
const result=checkHost(sample,{standing,limits:{taskBytes:2**30,hostLanes:8},requiredPeakBytes:0,fileEvents:{}});
console.log("STRUCTURAL_RESULT "+JSON.stringify(result)); process.exitCode=result.exitCode;`,
  );
  const budgets = JSON.parse(
    readFileSync(join(root, "scripts/kit/budgets.template.json"), "utf8"),
  );
  budgets.dispatches.executor.wallClockMs = 0;
  budgets.dispatches.executor.completeRuns = 0;
  mkdirSync(join(repo, "docs/control/local/harness"), { recursive: true });
  writeFileSync(
    join(repo, "docs/control/budgets.json"),
    JSON.stringify(budgets),
  );
  const session = "dispatch-gate-fixture",
    key = createHash("sha256").update(session).digest("hex");
  writeFileSync(
    join(repo, `docs/control/local/harness/${key}.json`),
    JSON.stringify({
      role: "executor",
      intent: "resume: next",
      workOrder: "WO-999",
      startedAt: new Date().toISOString(),
    }),
  );
  runGit(repo, ["add", "."], gitOptions);
  runGit(
    repo,
    [
      "-c",
      "user.name=Fixture",
      "-c",
      "user.email=fixture@example.invalid",
      "-c",
      "commit.gpgsign=false",
      "commit",
      "-qm",
      "fixture",
    ],
    gitOptions,
  );
  const prior = process.env.CODEX_THREAD_ID;
  process.env.CODEX_THREAD_ID = session;
  t.after(() =>
    prior === undefined
      ? delete process.env.CODEX_THREAD_ID
      : (process.env.CODEX_THREAD_ID = prior),
  );
  const table = [
    {
      name: "host",
      command: [process.execPath, "scripts/host.mjs"],
      args: ["host"],
      structural: true,
      product: true,
    },
    {
      name: "build",
      command: [process.execPath, "-e", "0"],
      build: true,
      product: true,
      outputs: [],
    },
    {
      name: "alpha",
      command: [
        process.execPath,
        "-e",
        'require("fs").writeFileSync("ran.txt","yes")',
      ],
      product: true,
    },
  ];
  const stopped = await runGate(["--review", "--serial", "--again"], repo, {
    table,
  });
  assert.equal(stopped.exitCode, 1);
  assert.equal(stopped.boundStop.metric, "wallClockMs");
  assert.deepEqual(
    stopped.boundStop.exceeded.map((entry) => entry.metric),
    ["wallClockMs", "completeRuns"],
  );
  assert.equal(stopped.dispatchBound.role, "executor");
  const stopLog = () =>
    readFileSync(join(repo, `docs/control/local/harness/${key}.jsonl`), "utf8")
      .trim()
      .split("\n")
      .map(JSON.parse);
  assert.equal(stopLog().length, 1, "one gate refusal records one stop");
  assert.equal(stopLog()[0].source, "gate");
  assert.deepEqual(stopLog()[0].boundStop.exceeded, stopped.boundStop.exceeded);
  assert.equal(existsSync(join(repo, "ran.txt")), false);
  const focused = await runGate(["--only", "alpha", "--serial"], repo, {
    table,
  });
  assert.equal(focused.exitCode, 0);
  budgets.dispatches.executor.wallClockMs = null;
  budgets.dispatches.executor.completeRuns = 0;
  writeFileSync(
    join(repo, "docs/control/budgets.json"),
    JSON.stringify(budgets),
  );
  const runs = await runGate(["--review", "--serial", "--again"], repo, {
    table,
  });
  assert.equal(runs.exitCode, 1);
  assert.equal(runs.boundStop.metric, "completeRuns");
  assert.equal(stopLog().length, 2, "the second refusal adds one stop");
  const { dispatchStanding } = await import("./lib/dispatch-bound.mjs");
  const consumed = () => dispatchStanding(repo, { session }).completeRuns;
  assert.equal(
    consumed(),
    0,
    "bound stops and focused reproductions consume no complete runs",
  );
  budgets.dispatches.executor.completeRuns = 3;
  writeFileSync(
    join(repo, "docs/control/budgets.json"),
    JSON.stringify(budgets),
  );
  const hostFile = join(repo, "scripts/host.mjs");
  const normalHost = readFileSync(hostFile, "utf8");
  writeFileSync(
    hostFile,
    normalHost.replace('level:"normal"', 'level:"critical"'),
  );
  const memory = await runGate(["--review", "--serial", "--again"], repo, {
    table,
  });
  assert.equal(memory.exitCode, 1);
  assert.equal(
    memory.taskTimeline.find((row) => row.name === "host").exitCode,
    1,
  );
  assert.equal(
    consumed(),
    0,
    "a real memory admission refusal consumes no run",
  );
  writeFileSync(hostFile, normalHost);
  const sessionFile = join(repo, `docs/control/local/harness/${key}.json`);
  const saved = readFileSync(sessionFile, "utf8");
  const damaged = join(
    repo,
    `docs/control/local/harness/${"c".repeat(64)}.json`,
  );
  writeFileSync(damaged, "{ truncated");
  const journal = JSON.parse(saved);
  writeFileSync(
    sessionFile,
    JSON.stringify({
      ...journal,
      boundDispatch: {
        ...journal,
        phaseBoundary: "WO-999:WorkOrderActivated:-1",
        unavailable: "damaged history",
      },
    }),
  );
  const unavailable = await runGate(["--review", "--serial", "--again"], repo, {
    table,
  });
  assert.equal(unavailable.exitCode, 1);
  const failedHost = unavailable.taskTimeline.find(
    (row) => row.name === "host",
  );
  assert.equal(failedHost.exitCode, 1);
  assert.equal(unavailable.boundStop, undefined);
  rmSync(damaged);
  writeFileSync(sessionFile, saved);
  assert.equal(
    consumed(),
    0,
    "an unavailable-standing admission refusal consumes no run",
  );
  const admitted = await runGate(["--review", "--serial", "--again"], repo, {
    table,
  });
  assert.equal(admitted.exitCode, 0);
  assert.equal(consumed(), 1, "one admitted review consumes exactly one run");
});

// A sharded row runs one process a shard, and a case runs in one of them
// only where its file takes `test` from the shard helper: a file that
// registered through node:test would run every case in every shard. The
// row's files are its entry files and the test files they import.
test("WO-276: no test file a sharded row loads registers its cases through node:test", async () => {
  const { relativeImportsOf } = await import("./lib/evidence-sources.mjs");
  const testFile = /^scripts\/test-[\w.-]+\.mjs$/u;
  const sharded = suites.filter((row) => row.shards !== undefined);
  assert.ok(sharded.length > 0, "a row declares shards");
  for (const row of sharded) {
    const entries = [...row.command.slice(1), ...(row.args ?? [])].filter(
      (path) => testFile.test(path),
    );
    assert.ok(entries.length > 0, `${row.name} names its test files`);
    const loaded = new Set(entries);
    let batch = entries;
    while (batch.length) {
      const next = [];
      for (const imports of relativeImportsOf(root, batch).values())
        for (const target of imports)
          if (testFile.test(target) && !loaded.has(target)) {
            loaded.add(target);
            next.push(target);
          }
      batch = next;
    }
    for (const file of loaded)
      assert.doesNotMatch(
        readFileSync(join(root, file), "utf8"),
        /\bfrom\s+["']node:test["']/u,
        `${row.name}: ${file} registers through node:test`,
      );
  }
});

// The time limits a root's owner sets in one file of its control root.
const writeLimits = (repo, body) => {
  mkdirSync(join(repo, "docs/control"), { recursive: true });
  writeFileSync(
    join(repo, "docs/control/time-limits.json"),
    `${JSON.stringify(body, null, 2)}\n`,
  );
};

test("WO-284 criteria 1 and 2: a structural row that outlives its time limit is reported as time with its key, figure, file and command; a raised key, a scale, a null and enforce false let it finish", async (t) => {
  const { TIME_LIMITS } = timeLimitsModule;
  const { repo, table: base } = taskReuseFixture(t);
  // A structural row that takes a second, among rows that take none.
  const table = [
    {
      name: "registrations",
      structural: true,
      document: true,
      command: [process.execPath, "-e", "setTimeout(() => {}, 1000)"],
    },
    ...base,
  ];
  const structural = (row) =>
    row.taskTimeline.find((task) => task.name === "registrations");
  const miss =
    "Time limit suite.registrations reached: 200 ms. docs/control/time-limits.json raises it, scales every limit or turns them off; npm run limits lists every key.";

  // With no file the row runs under the kit's figure and its record says so.
  const kit = await captureGate([], repo, { table });
  assert.equal(kit.row.exitCode, 0, kit.row.output);
  assert.equal(
    structural(kit.row).timeoutMs,
    TIME_LIMITS["suite.registrations"].ms,
  );
  assert.equal(structural(kit.row).timeLimitKey, "suite.registrations");
  assert.equal(
    kit.row.taskTimeline.find((task) => task.name === "alpha").timeoutMs,
    TIME_LIMITS["suite.default"].ms,
  );
  assert.equal(
    kit.row.taskTimeline.find((task) => task.name === "alpha").timeLimitKey,
    "suite.default",
  );

  // A figure the row outlives ends it: time, named, and no failed check.
  writeLimits(repo, { limits: { "suite.registrations": { set: 200 } } });
  const missed = await captureGate([], repo, { table });
  assert.equal(missed.row.exitCode, 1);
  assert.equal(missed.row.failedFirst, "registrations");
  assert.deepEqual(
    [
      structural(missed.row).failureKind,
      structural(missed.row).timeoutMs,
      structural(missed.row).timeLimitKey,
    ],
    ["timeout", 200, "suite.registrations"],
  );
  assert.ok(
    missed.row.output.includes("registrations: timeout\n"),
    missed.row.output,
  );
  assert.ok(
    missed.row.output.includes(
      `Suite registrations timed out after 0 h 0 min. ${miss}`,
    ),
    missed.row.output,
  );
  const skipped = missed.lines.filter((line) => line.startsWith("  [alpha] "));
  assert.equal(
    skipped[0],
    `  [alpha] Required registrations structural preflight was ended for time before it finished: nothing was judged, and this is its time limit, not a failed check. ${miss}`,
  );
  assert.ok(
    !missed.lines.some((line) => line.includes("structural preflight failed")),
    missed.lines.join("\n"),
  );
  // The row's own line says time, where a failed check says FAIL.
  assert.ok(missed.lines.includes("TIME registrations 0 h 0 min"));
  assert.ok(!missed.lines.some((line) => line.startsWith("FAIL ")));
  assert.deepEqual(missed.row.unrunSuites, ["build", "alpha", "beta"]);

  // The same row finishes and passes once its key is raised, and its record
  // names the figure that applied; a scale reaches the same figure.
  for (const [body, applied] of [
    [{ limits: { "suite.registrations": { set: 60_000 } } }, 60_000],
    [{ scale: 300, limits: { "suite.registrations": { set: 200 } } }, 60_000],
    [{ limits: { "suite.registrations": { set: null } } }, null],
    [{ enforce: false, limits: { "suite.registrations": { set: 200 } } }, null],
  ]) {
    writeLimits(repo, body);
    const passed = await captureGate([], repo, { table });
    assert.equal(
      passed.row.exitCode,
      0,
      `${JSON.stringify(body)}: ${passed.row.output}`,
    );
    assert.equal(
      structural(passed.row).timeoutMs,
      applied,
      JSON.stringify(body),
    );
    assert.equal(structural(passed.row).timeLimitKey, "suite.registrations");
    assert.ok(structural(passed.row).durationMs >= 900, JSON.stringify(body));
  }
});

test("WO-284 criterion 2: an ordinary row ended for time names its key, and a fixture row's own figure names none", async (t) => {
  const { repo } = taskReuseFixture(t);
  const row = {
    name: "alpha",
    command: [process.execPath, "-e", "setTimeout(() => {}, 5000)"],
  };
  writeLimits(repo, { limits: { "suite.default": { set: 250 } } });
  const missed = await executeSuite(row, repo);
  assert.deepEqual(
    [
      missed.exitCode,
      missed.failureKind,
      missed.timeoutMs,
      missed.timeLimitKey,
    ],
    [1, "timeout", 250, "suite.default"],
  );
  assert.ok(
    missed.output.endsWith(
      "Suite alpha timed out after 0 h 0 min. Time limit suite.default reached: 250 ms. docs/control/time-limits.json raises it, scales every limit or turns them off; npm run limits lists every key.",
    ),
    missed.output,
  );
  // A file task of an expanded suite follows its suite's key.
  assert.equal(
    (await executeSuite({ ...row, name: "launchpad:file:fixture.mjs" }, repo))
      .timeLimitKey,
    "suite.default",
  );
  // A fixture row's own figure, and a caller's, are no key of the table.
  for (const own of [
    await executeSuite({ ...row, timeoutMs: 200 }, repo),
    await executeSuite(row, repo, 200),
  ]) {
    assert.deepEqual(
      [own.failureKind, own.timeoutMs, own.timeLimitKey],
      ["timeout", 200, undefined],
    );
    assert.ok(
      own.output.endsWith("Suite alpha timed out after 0 h 0 min"),
      own.output,
    );
  }
  // The pause between telling a task to stop and killing it is the table's:
  // a task that ignores the stop is killed after it, however limits are set.
  writeLimits(repo, {
    enforce: false,
    limits: { "suite.stop-grace": { set: 300 } },
  });
  const stubborn = {
    name: "alpha",
    timeoutMs: 200,
    command: [
      process.execPath,
      "-e",
      "process.on('SIGTERM', () => {}); setInterval(() => {}, 1000)",
    ],
  };
  const killed = await executeSuite(stubborn, repo);
  assert.equal(killed.failureKind, "timeout");
  assert.ok(
    killed.durationMs >= 500 && killed.durationMs < 4000,
    String(killed.durationMs),
  );
});

test("WO-284 criterion 7: at an identity that holds a passing complete row, --again without a reason prints that row, runs no task and exits 0; with a reason it runs and the row keeps it; and a reused suite whose changed sources are documents is named as reused, not as changed", async (t) => {
  const { repo, table: base, observed } = taskReuseFixture(t);
  // The alpha suite also reads a document, which lies outside the identity.
  const table = base.map((row) =>
    row.name === "alpha" ? { ...row, sources: ["docs/guide.md"] } : row,
  );
  mkdirSync(join(repo, "docs"), { recursive: true });
  writeFileSync(join(repo, "docs/guide.md"), "# Guide\n");
  const rows = () =>
    readGateChecks(repo).filter((row) => row.checkId === "npm test");

  // With no passing row at the identity a forced selection runs as it did.
  const first = await captureGate(["--review", "--again"], repo, { table });
  assert.equal(first.row.exitCode, 0, first.row.output);
  assert.equal(first.row.executionMode, "forced-fresh");
  assert.equal(first.row.forcedReason, undefined);
  assert.equal(rows().length, 1);
  const ran = observed().length;
  assert.ok(ran > 0);

  // Forced again there with no reason: the standing row, no task, exit 0.
  const answered = await captureGate(["--review", "--again"], repo, { table });
  assert.deepEqual(answered.row, {
    exitCode: 0,
    executed: false,
    satisfiedBy: first.row.evidenceRef,
  });
  assert.ok(
    answered.lines.includes(
      `npm test: a passing complete row already stands at this code identity: recorded ${rows()[0].recordedAt}, 0 h 0 min, ${rows()[0].requiredSuites.length} suites, ${first.row.evidenceRef}.`,
    ),
    answered.lines.join("\n"),
  );
  assert.ok(
    answered.lines.some(
      (line) =>
        line.startsWith("Nothing was run. ") &&
        line.includes(
          "an edit to documents alone owes npm run test:docs and no complete run",
        ) &&
        line.endsWith('npm test -- --review --again --reason "<why>".'),
    ),
    answered.lines.join("\n"),
  );
  assert.equal(observed().length, ran, "no task ran");
  assert.equal(rows().length, 1, "no row was recorded");
  assert.ok(
    !answered.lines.some((line) => /^(?:PASS|FAIL|REUSE) /u.test(line)),
  );
  // --fresh is the same request, and a plain selection is answered too.
  for (const args of [["--review", "--fresh"], ["--again"]])
    assert.equal(
      (await captureGate(args, repo, { table })).row.executed,
      false,
      args.join(" "),
    );
  assert.equal(observed().length, ran);

  // With a reason it runs every task again and its row keeps the words.
  const forced = await captureGate(
    ["--review", "--again", "--reason", "comparing two hosts"],
    repo,
    { table },
  );
  assert.equal(forced.row.exitCode, 0, forced.row.output);
  assert.equal(forced.row.forcedReason, "comparing two hosts");
  assert.equal(forced.row.executionMode, "forced-fresh");
  assert.equal(forced.row.reusedSuites, 0);
  assert.equal(rows().length, 2);
  assert.equal(rows()[1].forcedReason, "comparing two hosts");
  assert.ok(observed().length > ran);
  // A reason states why a selection is run again and means nothing alone.
  await assert.rejects(
    runGate(["--review", "--reason", "no --again"], repo, { table }),
    /--reason states why --again runs a selection again/u,
  );
  await assert.rejects(
    runGate(["--review", "--again", "--reason"], repo, { table }),
    /^Error: usage: test-runner /u,
  );

  // A document the alpha suite declares changes after the row. The plain
  // review selection reuses alpha's row at the unchanged identity, and its
  // schedule line says so instead of calling the suite changed.
  const identity = gateCodeIdentity(repo);
  const future = new Date(Date.now() + 60_000);
  writeFileSync(join(repo, "docs/guide.md"), "# Guide\n\nA new paragraph.\n");
  utimesSync(join(repo, "docs/guide.md"), future, future);
  assert.equal(gateCodeIdentity(repo), identity);
  assert.deepEqual(changedSinceLastGate(repo, table).suites, ["alpha"]);
  const composed = await captureGate(["--review"], repo, { table });
  assert.equal(composed.row.exitCode, 0, composed.row.output);
  assert.ok(composed.lines.some((line) => line.startsWith("REUSE alpha ")));
  assert.ok(
    composed.lines.includes(
      "scheduled in declared order; reused at the code identity, not run again: alpha (its sources changed since the last gate row are documents outside that identity)",
    ),
    composed.lines.join("\n"),
  );
  assert.ok(
    !composed.lines.some((line) =>
      line.includes("changed since the last gate row)"),
    ),
    composed.lines.join("\n"),
  );
  // A changed source inside the identity is still named changed and runs.
  const later = new Date(Date.now() + 120_000);
  writeFileSync(
    join(repo, "scripts/alpha.mjs"),
    `${readFileSync(join(repo, "scripts/alpha.mjs"), "utf8")}// changed\n`,
  );
  utimesSync(join(repo, "scripts/alpha.mjs"), later, later);
  const changed = await captureGate(["--review"], repo, { table });
  assert.equal(changed.row.exitCode, 0, changed.row.output);
  assert.ok(
    changed.lines.includes(
      "scheduled first: alpha (changed since the last gate row)",
    ),
    changed.lines.join("\n"),
  );
  assert.ok(changed.lines.some((line) => line.startsWith("PASS alpha ")));
  // A plain row does not answer a review selection. The closeout's satisfied
  // form and the final review's claim consume a review row in which every
  // named suite ran and passed, so at an identity that holds only a plain
  // row the forced review selection runs; once its own row stands it is
  // answered, with the selection repeated as it was typed.
  const further = new Date(Date.now() + 180_000);
  writeFileSync(
    join(repo, "scripts/alpha.mjs"),
    `${readFileSync(join(repo, "scripts/alpha.mjs"), "utf8")}// changed again\n`,
  );
  utimesSync(join(repo, "scripts/alpha.mjs"), further, further);
  const plain = await captureGate(["--again"], repo, { table });
  assert.equal(plain.row.exitCode, 0, plain.row.output);
  assert.equal(rows().at(-1).gateSelection, "plain");
  const before = observed().length;
  const review = await captureGate(["--full", "--again"], repo, { table });
  assert.equal(review.row.exitCode, 0, review.row.output);
  assert.equal(review.row.executionMode, "forced-fresh");
  assert.equal(rows().at(-1).gateSelection, "review");
  assert.ok(observed().length > before, "the review selection ran");
  const repeated = await captureGate(["--full", "--again"], repo, { table });
  assert.deepEqual(repeated.row, {
    exitCode: 0,
    executed: false,
    satisfiedBy: review.row.evidenceRef,
  });
  assert.ok(
    repeated.lines.some((line) =>
      line.endsWith('npm test -- --full --again --reason "<why>".'),
    ),
    repeated.lines.join("\n"),
  );
});

test("WO-284 criterion 1, after a pass: a changed time limit is applied by a fresh run whose record names it; a pass recorded under other limits is neither reused nor standing for the closeout, a forced run, a claim or the evidence command; an edit that changes no figure changes nothing", async (t) => {
  const { TIME_LIMITS, timeLimitsDigest } = timeLimitsModule;
  const { coveringGateCheck } = await import("./lib/gate-reuse.mjs");
  const { closeoutStandingFor } = await import("./lib/closeout-scope.mjs");
  const { repo, table: base, observed } = taskReuseFixture(t);
  // A suite that runs for as long as an ignored file says, so a lowered
  // figure can end a run that an earlier pass would otherwise answer for;
  // and the review selection as the closeout lists it.
  writeFileSync(
    join(repo, "scripts/slow.mjs"),
    'import fs from "node:fs"; fs.appendFileSync("observed.jsonl", "slow\\n"); const ms = fs.existsSync("slow-ms") ? Number(fs.readFileSync("slow-ms", "utf8")) : 0; setTimeout(() => {}, ms);\n',
  );
  writeFileSync(
    join(repo, "scripts/test-runner.mjs"),
    ["alpha", "beta", "slow"]
      .map(
        (name) =>
          `console.log(${JSON.stringify(`${name} — protects: the ${name} fixture`)});`,
      )
      .join("\n") + "\n",
  );
  writeFileSync(
    join(repo, ".gitignore"),
    `${readFileSync(join(repo, ".gitignore"), "utf8")}slow-ms\n`,
  );
  runGit(repo, ["add", "."]);
  runGit(repo, [
    "-c",
    "maintenance.auto=false",
    "commit",
    "-qm",
    "a slow suite and the review listing",
  ]);
  const table = [
    ...base,
    {
      name: "slow",
      product: true,
      command: [process.execPath, "scripts/slow.mjs"],
    },
  ];
  const names = ["alpha", "beta", "slow"];
  const task = (row, name) =>
    row.taskTimeline.find((entry) => entry.name === name);
  // Rows at one identity share an evidence reference; the closeout's row is
  // told apart by when it was recorded.
  const standing = async () => (await closeoutStandingFor(repo))?.recordedAt;
  const evidence = () => findGateCheck(repo, "npm test", gateTreeHash(repo));
  const limitsFile = join(repo, "docs/control/time-limits.json");

  // Under the kit's figures the pass stands, and its row names no limits.
  const first = await captureGate(["--review"], repo, { table });
  assert.equal(first.row.exitCode, 0, first.row.output);
  assert.equal(first.row.timeLimitsDigest, undefined);
  assert.equal(
    task(first.row, "slow").timeoutMs,
    TIME_LIMITS["suite.default"].ms,
  );
  assert.equal(await standing(), first.row.recordedAt);

  // An edit that changes no figure changes nothing: a note, a key set to
  // the kit's own figure, an explicit "kit" and a stale record of the kit's
  // figure. The forced selection is answered and the plain one reuses.
  writeLimits(repo, {
    note: "the owner's own words",
    scale: 1,
    enforce: true,
    limits: {
      "suite.default": { set: "kit", kit: 1 },
      "suite.host": { set: TIME_LIMITS["suite.host"].ms },
    },
  });
  assert.equal(timeLimitsDigest(repo), undefined);
  assert.equal(await standing(), first.row.recordedAt);
  assert.equal(
    (await captureGate(["--review", "--again"], repo, { table })).row.executed,
    false,
  );
  const before = observed().length;
  const composed = await captureGate(["--review"], repo, { table });
  assert.equal(composed.row.exitCode, 0, composed.row.output);
  for (const name of names)
    assert.ok(
      composed.lines.some((line) => line.startsWith(`REUSE ${name} `)),
      composed.lines.join("\n"),
    );
  assert.equal(observed().length, before, "no task ran");

  // A raised key: no earlier pass ran under it, so none is carried or
  // stands; every task runs under the raised figure and its record names
  // it, and that row then answers a forced selection.
  writeLimits(repo, { limits: { "suite.default": { set: 5_400_000 } } });
  const raisedDigest = timeLimitsDigest(repo);
  assert.equal(typeof raisedDigest, "string");
  assert.equal(await standing(), undefined);
  const lookup = await coveringGateCheck(repo, "npm test", names);
  assert.equal(lookup.row, undefined);
  assert.equal(lookup.otherLimits?.recordedAt, composed.row.recordedAt);
  assert.equal(evidence(), undefined);
  const raised = await captureGate(["--review"], repo, { table });
  assert.equal(raised.row.exitCode, 0, raised.row.output);
  assert.equal(raised.row.timeLimitsDigest, raisedDigest);
  assert.equal(raised.row.reusedSuites, 0);
  assert.equal(raised.row.freshReason, "time-limits-changed");
  assert.ok(!raised.lines.some((line) => line.startsWith("REUSE ")));
  assert.ok(
    raised.lines.some((line) =>
      /^npm test: \d+ passing tasks at this code identity ran under time limits other than those docs\/control\/time-limits\.json sets now, and run again under the figures that apply$/u.test(
        line,
      ),
    ),
    raised.lines.join("\n"),
  );
  for (const name of names)
    assert.equal(task(raised.row, name).timeoutMs, 5_400_000, name);
  assert.equal(await standing(), raised.row.recordedAt);
  assert.equal(evidence()?.recordedAt, raised.row.recordedAt);
  assert.equal(
    (await captureGate(["--review", "--again"], repo, { table })).row.executed,
    false,
  );

  // A scale either way, one limit turned off and every limit turned off
  // each leave that row standing nowhere.
  for (const body of [
    { scale: 2 },
    { scale: 0.5 },
    { limits: { "suite.default": { set: null } } },
    { enforce: false },
  ]) {
    writeLimits(repo, body);
    const label = JSON.stringify(body);
    assert.equal(await standing(), undefined, label);
    const found = await coveringGateCheck(repo, "npm test", names);
    assert.equal(found.row, undefined, label);
    assert.equal(found.otherLimits?.recordedAt, raised.row.recordedAt, label);
    assert.equal(evidence(), undefined, label);
  }
  // With every limit off, a forced selection with no reason runs, since no
  // row stands under the limits in force, and its record names no figure.
  const forced = await captureGate(["--review", "--again"], repo, { table });
  assert.equal(forced.row.executed, true);
  assert.equal(forced.row.exitCode, 0, forced.row.output);
  assert.equal(forced.row.forcedReason, undefined);
  assert.equal(task(forced.row, "slow").timeoutMs, null);

  // Back at the kit's figures the earlier kit rows do not stand again: a
  // later run of each task, under other limits, decides it.
  rmSync(limitsFile);
  assert.equal(await standing(), undefined);

  // Limits changed while a selection ran: the row records its results and
  // says so, and no pass of it is carried or stands, even under the limits
  // it started with.
  const editor = {
    name: "editor",
    product: true,
    command: [
      process.execPath,
      "-e",
      `require("node:fs").writeFileSync(${JSON.stringify(limitsFile)}, JSON.stringify({ scale: 3 }))`,
    ],
  };
  const during = await captureGate(["--review"], repo, {
    table: [...table, editor],
  });
  assert.equal(during.row.exitCode, 0, during.row.output);
  assert.equal(during.row.timeLimitsDigest, undefined);
  assert.equal(during.row.timeLimitsUnchanged, false);
  assert.ok(
    during.lines.some((line) =>
      line.includes(
        "; the time limits docs/control/time-limits.json sets changed during the gate, so no pass of this row is carried or stands: run it again under the limits now in force",
      ),
    ),
    during.lines.join("\n"),
  );
  rmSync(limitsFile);
  const afterwards = await coveringGateCheck(repo, "npm test", names);
  assert.equal(afterwards.row, undefined);
  assert.equal(afterwards.otherLimits?.recordedAt, during.row.recordedAt);

  // A lowered figure ends what an earlier pass would have answered for: the
  // slow suite passes in four seconds under the kit's figures, and with its
  // figure lowered to two the selection that would have reused that pass
  // runs it, and it is ended for time.
  writeFileSync(join(repo, "slow-ms"), "4000");
  const kit = await captureGate(["--review"], repo, { table });
  assert.equal(kit.row.exitCode, 0, kit.row.output);
  assert.ok(task(kit.row, "slow").durationMs >= 3900);
  assert.equal(await standing(), kit.row.recordedAt);
  writeLimits(repo, { limits: { "suite.default": { set: 2000 } } });
  const ranSlow = observed().filter((line) => line === "slow").length;
  const lowered = await captureGate(["--review"], repo, { table });
  assert.equal(lowered.row.exitCode, 1);
  assert.deepEqual(
    [
      task(lowered.row, "slow").failureKind,
      task(lowered.row, "slow").timeoutMs,
      task(lowered.row, "slow").timeLimitKey,
    ],
    ["timeout", 2000, "suite.default"],
  );
  assert.equal(
    observed().filter((line) => line === "slow").length,
    ranSlow + 1,
  );
  assert.ok(!lowered.lines.some((line) => line.startsWith("REUSE slow ")));
  assert.equal(await standing(), undefined);
});

test("WO-284 criterion 1 at an installed instance: a complete row stands for a claim, the closeout and the evidence command only under the time limits it ran under, and a later run under other limits leaves it standing nowhere", async (t) => {
  const { timeLimitsDigest } = timeLimitsModule;
  const { coveringGateCheck, standingReviewCandidate } =
    await import("./lib/gate-reuse.mjs");
  const { closeoutStandingFor } = await import("./lib/closeout-scope.mjs");
  const repo = createFixtureRoot(join(tmpdir(), "dotln-instance-limits-"));
  t.after(() => rmSync(repo, { recursive: true, force: true }));
  execGit(["init", "-q"], { cwd: repo });
  excludeFixtureOwnership(repo);
  mkdirSync(join(repo, "scripts"));
  writeFileSync(join(repo, "KIT-MANIFEST.json"), "{}\n");
  writeFileSync(join(repo, ".gitignore"), ".runtime/\ndocs/control/local/\n");
  writeFileSync(join(repo, "scripts/verify.mjs"), "export {};\n");
  writeFileSync(join(repo, "scripts/harness.mjs"), "export {};\n");
  // The review selection as the closeout lists it.
  writeFileSync(
    join(repo, "scripts/test-runner.mjs"),
    'console.log("kit-verify — protects: the kit files");\nconsole.log("harness — protects: the installed harness");\n',
  );
  execGit(["add", "."], { cwd: repo });
  execGit(
    [
      "-c",
      "user.name=Fixture",
      "-c",
      "user.email=fixture@example.invalid",
      "-c",
      "maintenance.auto=false",
      "commit",
      "-qm",
      "An installed instance",
    ],
    { cwd: repo },
  );
  assert.equal(isKitRoot(repo), true);
  const table = [
    {
      name: "kit-verify",
      command: [process.execPath, "scripts/verify.mjs"],
      build: true,
      outputs: [],
    },
    {
      name: "harness",
      command: [process.execPath, "scripts/harness.mjs"],
      instance: "runtime",
      document: true,
      needsBuild: true,
    },
  ];
  const names = ["kit-verify", "harness"];
  const log = console.log;
  console.log = () => {};
  t.after(() => (console.log = log));
  // What stands at the identity for each reader, by when its row was
  // recorded, and the newest passing row recorded under other limits.
  const stands = async () => {
    const found = await coveringGateCheck(repo, "npm test", names);
    return {
      claim: found.row?.recordedAt,
      review: standingReviewCandidate(found, names)?.recordedAt,
      evidence: findGateCheck(repo, "npm test", gateTreeHash(repo))?.recordedAt,
      closeout: (await closeoutStandingFor(repo))?.recordedAt,
      otherLimits: found.otherLimits?.recordedAt,
    };
  };
  const everywhere = (row, otherLimits) => ({
    claim: row.recordedAt,
    review: row.recordedAt,
    evidence: row.recordedAt,
    closeout: row.recordedAt,
    otherLimits: otherLimits?.recordedAt,
  });
  const nowhere = (otherLimits) => ({
    claim: undefined,
    review: undefined,
    evidence: undefined,
    closeout: undefined,
    otherLimits: otherLimits.recordedAt,
  });

  const first = await runGate(["--review"], repo, { table });
  assert.equal(first.exitCode, 0);
  assert.equal(first.gateSelection, "review");
  assert.equal(first.timeLimitsDigest, undefined);
  assert.equal(typeof first.instanceInputDigest, "string");
  assert.deepEqual(await stands(), everywhere(first));
  // An edit that changes no figure leaves it standing.
  writeLimits(repo, {
    note: "kept",
    limits: { "suite.default": { set: "kit" } },
  });
  assert.deepEqual(await stands(), everywhere(first));
  // A raised key, a scale up and down, one limit off and every limit off.
  for (const body of [
    { limits: { "suite.default": { set: 5_400_000 } } },
    { scale: 3 },
    { scale: 1 / 3 },
    { limits: { "suite.host": { set: null } } },
    { enforce: false },
  ]) {
    writeLimits(repo, body);
    assert.deepEqual(await stands(), nowhere(first), JSON.stringify(body));
  }
  // Back at the kit's figures with no run between, it stands again.
  rmSync(join(repo, "docs/control/time-limits.json"));
  assert.deepEqual(await stands(), everywhere(first));
  // A run under a scale stands under that scale alone, and as the later
  // execution of each task it leaves the first row standing nowhere.
  writeLimits(repo, { scale: 3 });
  const scaled = await runGate(["--review"], repo, { table });
  assert.equal(scaled.exitCode, 0);
  assert.equal(scaled.timeLimitsDigest, timeLimitsDigest(repo));
  assert.deepEqual(await stands(), everywhere(scaled, first));
  rmSync(join(repo, "docs/control/time-limits.json"));
  assert.deepEqual(await stands(), nowhere(scaled));
});

test("WO-284 criterion 2: the Git version read, a helper compile and the lane reader that are ended for time name their limit and send the reader nowhere else", async (t) => {
  const { judgeGitRuntime, judgeRunningGit, readGitVersionOutcome } =
    await import("./lib/node-engines.mjs");
  const { compilerFailure, underHostLimit } =
    await import("./lib/host-resources.mjs");
  const { laneReaderFailure } = await import("./lib/host-lanes.mjs");
  const { describeTimeLimit, timeLimit } = timeLimitsModule;
  const repo = realpathSync(
    createFixtureRoot(join(tmpdir(), "dotln-limit-miss-")),
  );
  t.after(() => rmSync(repo, { recursive: true, force: true }));
  writeFileSync(
    join(repo, "package.json"),
    JSON.stringify({ engines: { git: ">=2.0.0" } }),
  );
  mkdirSync(join(repo, "docs/control"), { recursive: true });
  // The owner's file gives the Git version read one millisecond.
  writeFileSync(
    join(repo, "docs/control/time-limits.json"),
    JSON.stringify({ limits: { "host.git-version": { set: 1 } } }),
  );
  const said = (key) =>
    `Time limit ${key} reached: ${describeTimeLimit(timeLimit(repo, key))}. docs/control/time-limits.json raises it, scales every limit or turns them off; npm run limits lists every key.`;
  const outcome = readGitVersionOutcome(repo);
  assert.deepEqual(outcome, {
    version: null,
    miss: said("host.git-version"),
  });
  const judged = judgeRunningGit(repo);
  assert.equal(judged.admitted, false);
  assert.ok(judged.message.includes(said("host.git-version")), judged.message);
  assert.match(judged.message, /was ended for time before it printed/u);
  assert.doesNotMatch(judged.message, /Git did not run|on PATH/u);
  // A Git that cannot be run at all still says so, with its remedy.
  assert.match(
    judgeGitRuntime(null, ">=2.0.0").message,
    /Git did not run.*first on PATH/u,
  );
  // A host step ended for time keeps the text that names its limit, and the
  // helper compile's own message leads with it and names no install remedy.
  const ended = () => {
    throw Object.assign(new Error("spawnSync clang ETIMEDOUT"), {
      code: "ETIMEDOUT",
    });
  };
  let thrown;
  try {
    underHostLimit("host.helper-compile", ended, repo);
  } catch (error) {
    thrown = error;
  }
  assert.equal(thrown.timeLimitMiss, said("host.helper-compile"));
  assert.ok(thrown.message.endsWith(said("host.helper-compile")));
  const compile = compilerFailure("clang", thrown);
  assert.ok(
    compile.message.startsWith(
      "The native compiler clang was ended for time before it finished; nothing says it cannot run. ",
    ),
    compile.message,
  );
  assert.ok(compile.message.includes(said("host.helper-compile")));
  assert.doesNotMatch(compile.message, /could not be run|was not found/u);
  assert.match(
    compilerFailure(
      "clang",
      Object.assign(new Error("none"), { code: "ENOENT" }),
    ).message,
    /^The native compiler clang was not found\./u,
  );
  // The lane reader says which limit ended its read; any other failure says
  // the reader is unavailable, as before.
  let read;
  try {
    underHostLimit("host.lane-reader", ended, repo);
  } catch (error) {
    read = error;
  }
  assert.equal(
    laneReaderFailure(read).message,
    `Host process reader was ended for time before it answered. ${said("host.lane-reader")}`,
  );
  assert.equal(
    laneReaderFailure(Object.assign(new Error("none"), { code: "ENOENT" }))
      .message,
    "Host process reader unavailable; an ordinary gate prepares it (ENOENT)",
  );
});

// The files on the gate path: what a gate run or a bounded probe executes
// before and around its suites. Each is read whole unless it names one
// function, and each time limit in it reads the table, apart from the sites
// listed with what they are: an interval between polls, a heartbeat, a
// sampling delay, fixture data, or a limit of a command that is no gate.
const GATE_PATH_FILES = [
  [
    "scripts/test-runner.mjs",
    [
      [
        "GUARD_RECORD_WAIT_MS = 20",
        "the interval between reads for the guard's record; the wait's length is suite.guard-record",
      ],
      [
        "setTimeout(() => finish(code), GUARD_RECORD_WAIT_MS)",
        "one read's wait of that interval; the whole wait is suite.guard-record",
      ],
      [
        "Date.now() - lastProgressAt >= 1000",
        "the least time between two progress lines of one task, which ends nothing",
      ],
      [
        "heartbeatMs = row.heartbeatMs ?? 15_000",
        "the progress heartbeat of a running task, which ends nothing",
      ],
      ["setInterval(stopping, 500)", "the poll for a stop request"],
      [
        "}, heartbeatMs / 3)",
        "how often a running task's progress is read for that heartbeat",
      ],
    ],
  ],
  ["scripts/lib/generated-artifacts.mjs", []],
  ["scripts/sync.mjs", []],
  ["scripts/license-surfaces.mjs", []],
  ["scripts/lib/bounded-command.mjs", []],
  [
    "scripts/work-orders.mjs",
    [
      [
        "timeout: 10_000",
        "the Git reads of a target's facts, made by explicit index generation alone; the index check opens no target",
      ],
    ],
  ],
  ["scripts/structural-checks.mjs", []],
  ["scripts/check-registrations.mjs", []],
  [
    "scripts/harness.mjs",
    [
      [
        "Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 250)",
        "the poll of evidence --wait, the session's own wait for a gate: it ends nothing and takes --timeout",
      ],
      [
        "Date.now() + timeout * 1000",
        "the deadline of evidence --wait, its --timeout in seconds: the same wait, which ends no gate",
      ],
    ],
  ],
  // The harness host also holds the hooks' own limits, which are not on the
  // gate path; its evidence gate is the function named here.
  ["packages/skeleton/src/harness-host.ts", [], "runHarnessEvidenceChecks"],
  ["scripts/lib/host-resources.mjs", []],
  [
    "scripts/lib/host-guard-state.mjs",
    [["delay(50)", "the interval between observations of a starting guard"]],
  ],
  [
    "scripts/lib/host-lanes.mjs",
    [
      [
        "waitHeartbeatMs = 30000",
        "how often a lane wait says it is still waiting, which ends nothing",
      ],
      ["delay(100)", "the interval between reads of the lane holders"],
    ],
  ],
  ["scripts/lib/node-engines.mjs", []],
  [
    "scripts/lib/process-monitor.mjs",
    [
      [
        "Math.min(100, limits.signalIntervalMs)",
        "the delay before a launched task's first sample, a sampling interval the budgets set",
      ],
    ],
  ],
  [
    "scripts/host-guard.mjs",
    [
      [
        "Date.now() - emptySince > 3000",
        "how long the guard stays up with nothing registered before it retires itself: it ends an idle guard and no gate, probe or task",
      ],
    ],
  ],
  [
    "packages/skeleton/src/gate-evidence.mjs",
    [
      [
        "Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 250)",
        "the interval between reads of the active gate runs while a stop is awaited",
      ],
      [
        "Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 10)",
        "the interval between attempts on the gate record's lock",
      ],
    ],
  ],
  [
    "scripts/test-configuration-root.mjs",
    [
      [
        'test: { argv: ["node", "test.mjs"], timeoutMs: 5000 }',
        "fixture data: a target gate command's declared limit, which the loader validates and nothing runs",
      ],
      [
        'lint: { argv: ["node", "lint.mjs"], timeoutMs: 1000 }',
        "fixture data: a target gate command's declared limit",
      ],
      [
        'test: { argv: ["node", "test.mjs"], timeoutMs: 1000 }',
        "fixture data: a target gate command's declared limit",
      ],
    ],
  ],
];

/** Every site in a parsed file that passes a number as a length of time: a
 * `timeout` or `timeoutMs` property, a timer's delay, a deadline's figure,
 * a clock reading plus a number, and a name ending in Ms given a number. */
function timeFigureSites(read, withinFunction) {
  const { SyntaxKind: K } = sourceSyntax();
  const text = (node) =>
    read.file.text
      .slice(node.pos, node.end)
      .replace(/^(?:\s|\/\/[^\n]*\n|\/\*[\s\S]*?\*\/)*/u, "")
      .replace(/\s+/gu, " ");
  // A figure of its own: a number above one written in the expression.
  const figure = (node) =>
    node &&
    [...sourceNodes(node)].some(
      (inner) =>
        inner.kind === K.NumericLiteral &&
        Number(inner.text.replaceAll("_", "")) > 1,
    );
  const named = (node) => (node?.kind === K.Identifier ? node.text : undefined);
  // A constant of the same file whose value is a figure, used by its name: a
  // delay or a timeout written as `LIMIT` is the figure `LIMIT` was given.
  const constants = new Map();
  for (const node of sourceNodes(read.file))
    if (
      node.kind === K.VariableDeclaration &&
      named(node.name) &&
      node.initializer &&
      figure(node.initializer) &&
      ![...sourceNodes(node.initializer)].some(
        (inner) => inner.kind === K.CallExpression,
      )
    )
      constants.set(named(node.name), node.initializer);
  const figured = (node) =>
    figure(node) || (named(node) !== undefined && constants.has(named(node)));
  // A reading of the clock, and a number written out with no name in it.
  const clock = (node) => /\b(?:Date|performance)\.now\(\)/u.test(text(node));
  const bare = (node) =>
    figure(node) &&
    ![...sourceNodes(node)].some((inner) => inner.kind === K.Identifier);
  const callee = (node) =>
    node.expression.kind === K.Identifier
      ? node.expression.text
      : node.expression.kind === K.PropertyAccessExpression
        ? `${named(node.expression.expression) ?? "?"}.${node.expression.name.text}`
        : undefined;
  let scope = read.file;
  if (withinFunction) {
    scope = [...sourceNodes(read.file)].find(
      (node) =>
        node.kind === K.FunctionDeclaration &&
        named(node.name) === withinFunction,
    );
    assert.ok(scope, `${read.path} declares ${withinFunction}`);
  }
  const sites = [];
  const add = (node) =>
    sites.push({ line: read.line(node.pos + 1), text: text(node) });
  for (const node of sourceNodes(scope)) {
    if (
      node.kind === K.PropertyAssignment &&
      ["timeout", "timeoutMs", "killTimeout"].includes(named(node.name)) &&
      figured(node.initializer)
    )
      // Reported with the object it is written in, which names its use.
      add(
        node.parent.parent?.kind === K.PropertyAssignment
          ? node.parent.parent
          : node,
      );
    else if (node.kind === K.CallExpression) {
      const name = callee(node);
      const delay = {
        setTimeout: 1,
        setInterval: 1,
        delay: 0,
        startDeadline: 1,
        "Atomics.wait": 3,
      }[name];
      if (delay !== undefined && figured(node.arguments[delay])) add(node);
      else if (name === "deadlineLimit" && node.arguments.some(figure))
        add(node);
    } else if (
      (node.kind === K.Parameter ||
        node.kind === K.VariableDeclaration ||
        node.kind === K.BindingElement) &&
      /(?:Ms|_MS)$/u.test(named(node.name) ?? "") &&
      figure(node.initializer)
    )
      add(node);
    else if (
      node.kind === K.BinaryExpression &&
      node.operatorToken.kind === K.PlusToken &&
      [node.left, node.right].some((side) =>
        /^Date\.now\(\)$/u.test(text(side)),
      ) &&
      [node.left, node.right].some(figure)
    )
      add(node);
    // Time passed, compared with a figure: `Date.now() - since >= 1000`.
    else if (
      node.kind === K.BinaryExpression &&
      [
        K.GreaterThanToken,
        K.GreaterThanEqualsToken,
        K.LessThanToken,
        K.LessThanEqualsToken,
      ].includes(node.operatorToken.kind) &&
      ((clock(node.left) && bare(node.right)) ||
        (clock(node.right) && bare(node.left)))
    )
      add(node);
  }
  return sites;
}

test("WO-284 criterion 4: no file on the gate path passes a time limit that is not read from the table, and every key of the table is read on that path", () => {
  const { TIME_LIMITS } = timeLimitsModule;
  const inputs = GATE_PATH_FILES.map(([path]) => ({
    path,
    source: readFileSync(join(root, path), "utf8"),
  }));
  const reads = sourceTrees(inputs);
  const unread = [];
  const unused = [];
  GATE_PATH_FILES.forEach(([path, known, withinFunction], index) => {
    const read = reads[index];
    assert.ok(read, path);
    assert.deepEqual(read.errors, [], path);
    const sites = timeFigureSites(read, withinFunction);
    const used = new Set();
    for (const site of sites) {
      const match = known.find(([snippet]) => site.text.includes(snippet));
      if (match) used.add(match[0]);
      else unread.push(`${path}:${site.line}: ${site.text.slice(0, 160)}`);
    }
    for (const [snippet, reason] of known) {
      assert.ok(reason.length > 20, `${path}: ${snippet} says what it is`);
      if (!used.has(snippet)) unused.push(`${path}: ${snippet}`);
    }
  });
  assert.deepEqual(
    unread,
    [],
    "each of these passes a time limit of its own; read it from packages/skeleton/src/time-limits.mjs",
  );
  assert.deepEqual(unused, [], "a listed site that no longer exists");
  // The scan sees what it is for: the same figure written back is found.
  const [planted] = sourceTrees([
    {
      path: "planted.mjs",
      source:
        'spawnSync("x", [], { timeout: 30_000 });\nsetTimeout(stop, 1_000);\nconst deadline = Date.now() + 5000;\nfunction wait(root, { waitMs = 20_000 } = {}) {}\nstartDeadline("site", 5000);\nspawnSync("x", [], { timeout: timeLimit(root, "host.census") ?? undefined });\nsetTimeout(stop, stopGraceMs);\nif (Date.now() - started > 30_000) stop();\nconst STOP_AFTER = 1000;\nsetTimeout(stop, STOP_AFTER);\nconst LIMIT = 30_000;\nspawnSync("x", [], { timeout: LIMIT });\nif (Date.now() - started >= hostTimeLimit("guard.runner-stop")) stop();\n',
    },
  ]);
  // Lines 6, 7 and 13 read their figure from the table or a name that holds
  // no figure of its own; 8, 10 and 12 are a clock difference compared with
  // a figure and a constant used as a delay and as a timeout.
  assert.deepEqual(
    timeFigureSites(planted).map((site) => site.line),
    [1, 2, 3, 4, 5, 8, 10, 12],
  );
  // No declared suite row and no generated artifact keeps a figure.
  for (const row of suites) assert.equal(row.timeoutMs, undefined, row.name);
  assert.ok(
    generatedArtifactsModule
      .generatedArtifacts(root)
      .every((row) => row.timeoutMs === undefined),
  );
  // Every key is read on the path: a suite's by the row of its name, the
  // default by every other row, and each other key by its own spelling.
  const sources = inputs.map((input) => input.source).join("\n");
  for (const key of Object.keys(TIME_LIMITS)) {
    const suite = /^suite\.(.+)$/u.exec(key)?.[1];
    assert.ok(
      suite === "default" ||
        (suite && suites.some((row) => row.name === suite)) ||
        sources.includes(`"${key}"`),
      `${key} is read by no file on the gate path`,
    );
  }
});
