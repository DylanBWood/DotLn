// WO-184 retains WO-181's planted defects and receipt vocabulary, adding the review notice.
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import {
  appendFileSync,
  readFileSync,
  writeFileSync,
  existsSync,
  lstatSync,
  readdirSync,
  chmodSync,
  mkdirSync,
  rmSync,
} from "node:fs";
import { homedir, hostname } from "node:os";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import {
  createReviewFixture,
  doubleTransport,
  doubleResult,
  conventionRule,
  scopeRule,
} from "../WO-181/fixture.mjs";
import { git, launchpad, treeDigest } from "../WO-053/fixture.mjs";
import { decodeLog } from "../../../packages/kernel/dist/src/index.js";
import { verificationSnapshotHash } from "../../../packages/compiler/dist/src/index.js";
import {
  VerificationDriver,
  VerificationHost,
} from "../../../packages/skeleton/dist/src/verification-host.js";
import { WorkerStore } from "../../../packages/skeleton/dist/src/worker-store.js";
import {
  ClaudeCliPrintWorkOrderTransport,
  CodexCliExecWorkOrderTransport,
  runWorkerProcess,
} from "../../../packages/skeleton/dist/src/worker-transport.js";
import { prepareWorktreeVerification } from "../../../packages/skeleton/dist/src/verification-worktree.js";
import {
  parseEvidenceResult,
  transportPrompt,
} from "../../../packages/skeleton/dist/src/verification-protocol.js";
import { foldVerificationRepair } from "../../../packages/skeleton/dist/src/verification-fold.js";
const directory = fileURLToPath(new URL("./", import.meta.url));
const digest = (bytes) => createHash("sha256").update(bytes).digest("hex");
export { createReviewFixture, doubleTransport, conventionRule, scopeRule };
export function openReview(
  fixture,
  { name = "review", transport = doubleTransport(), afterResultSaved } = {},
) {
  const store = new WorkerStore(join(fixture.root, name));
  store.acquire();
  const driver = new VerificationDriver(
    store,
    `ws_${name.replaceAll("-", "_")}`,
  );
  driver.record("VerificationOpened", Date.now(), {
    baseline: fixture.base.subject,
    subject: fixture.prepared.subject,
    criteria: fixture.original.criteria,
    implementerEpisodeId: "ep_synthetic_implementer",
    reviewConventionsPath: fixture.conventionsPath,
    reviewNotice: true,
    maxRepairs: 0,
    authority: {
      authorityEnvelopeId: "auth_review_proof",
      allowedEffects: ["verification.evaluate"],
      deniedEffects: ["repo.write", "repo.delete", "network"],
      resourceLimits: { episodes: 2 },
      requiredEvidence: [],
      expiresAt: Date.now() + 3_600_000,
      revocationEventTypes: [],
    },
  });
  driver.persistNext(Date.now());
  return {
    store,
    driver,
    host: new VerificationHost({
      driver,
      transport,
      now: Date.now,
      ...(afterResultSaved ? { afterResultSaved } : {}),
    }),
  };
}
export async function runReview(fixture, options = {}) {
  const session = openReview(fixture, options);
  const before = treeDigest(fixture.prepared.snapshotPath);
  try {
    const verifier = options.verifier;
    await (
      verifier
        ? new VerificationHost({
            driver: session.driver,
            transport: verifier.transport,
            now: Date.now,
          })
        : session.host
    ).run(
      fixture.prepared.snapshotPath,
      verifier?.model ?? options.model ?? "process-double",
      verifier?.effort ?? options.effort ?? "unknown",
    );
    const behaviorRows = structuredClone(session.driver.state.rows);
    assert.equal(session.driver.state.next, "review");
    session.driver.persistNext(Date.now());
    await session.host.run(
      fixture.prepared.snapshotPath,
      options.model ?? "process-double",
      options.effort ?? "unknown",
    );
    assert.equal(session.driver.state.next, "reviewed");
    assert.deepEqual(session.driver.state.rows, behaviorRows);
    assert.equal(treeDigest(fixture.prepared.snapshotPath), before);
    return {
      ...session,
      behaviorRows,
      snapshotUnchanged: true,
      log: session.driver.log,
      review: session.driver.state.reviewCompleted,
    };
  } finally {
    session.store.release();
  }
}

function publicReceipt(value) {
  const bytes = JSON.stringify(value);
  for (const privateValue of [
    homedir(),
    hostname(),
    launchpad,
    process.execPath,
  ])
    if (privateValue && bytes.includes(privateValue))
      throw new Error("receipt privacy screen refused");
  if (
    /Bearer\s|-----BEGIN .*PRIVATE KEY|(?:sk-|ghp_)[A-Za-z0-9]{16}|\/var\/folders\/|\/private\/|\/Users\//u.test(
      bytes,
    )
  )
    throw new Error("receipt privacy screen refused");
  return value;
}
export function prepareLiveFixture(label) {
  assert.match(label, /^[a-z][a-z0-9-]*$/u);
  // The material command declares repositories relative to this worktree.
  // Only the fixture child uses this temporary root; the transport host's
  // environment remains unchanged when the verifier and reviewer launch.
  const fixtureTemporary = join(launchpad, ".runtime/wo184/material");
  mkdirSync(fixtureTemporary, { recursive: true });
  const fixtureRecord = join(launchpad, `.runtime/wo184/${label}-fixture.json`);
  execFileSync(
    process.execPath,
    [
      "--input-type=module",
      "-e",
      'import {createReviewFixture} from "./docs/evidence/WO-181/fixture.mjs"; import {writeFileSync} from "node:fs"; writeFileSync(process.env.DOTLN_WO184_FIXTURE_RECORD, JSON.stringify(createReviewFixture())+"\\n", {flag:"wx"});',
    ],
    {
      cwd: launchpad,
      env: {
        ...process.env,
        TMPDIR: fixtureTemporary,
        DOTLN_WO184_FIXTURE_RECORD: fixtureRecord,
      },
      stdio: "pipe",
    },
  );
  const fixture = JSON.parse(readFileSync(fixtureRecord, "utf8"));
  execFileSync(
    process.execPath,
    [
      "scripts/worktree.mjs",
      "material",
      relative(launchpad, fixture.repo),
      "--preserve",
      "--reason",
      `WO-184 criterion 13 ${label}: retained synthetic verifier/reviewer proof`,
    ],
    { cwd: launchpad, stdio: "pipe" },
  );
  appendFileSync(
    join(launchpad, ".runtime/wo184/live-roots.jsonl"),
    JSON.stringify({ label, root: fixture.root }) + "\n",
  );
  return fixture;
}

export async function live(
  harness,
  model,
  effort,
  label,
  verifierHarness = harness,
) {
  assert.ok(["claude", "codex"].includes(harness));
  assert.ok(["claude", "codex"].includes(verifierHarness));
  assert.match(label, /^[a-z][a-z0-9-]*$/u);
  assert.equal(process.env.DOTLN_LIVE_WORKERS, "1");
  const receipt = {
    schemaVersion: 1,
    label,
    repository: "WO-056 synthetic signed addition",
    actor: {
      harness,
      harnessVersion: "unknown",
      model,
      effort,
      source: "host-launch",
      effectiveModel: "unknown",
      effectiveEffort: "unknown",
    },
    verifierActor: {
      harness: verifierHarness,
      harnessVersion: "unknown",
      model:
        verifierHarness === harness
          ? model
          : verifierHarness === "codex"
            ? "gpt-6.1-sol"
            : "claude-opus-5-5",
      effort:
        verifierHarness === harness
          ? effort
          : verifierHarness === "codex"
            ? "max"
            : "xhigh",
      source: "host-launch",
      effectiveModel: "unknown",
      effectiveEffort: "unknown",
    },
    lastResultObserved: null,
    status: "unavailable",
    pendingRow: `review-${harness}`,
    failure: null,
    sessions: null,
    reviewCompleted: null,
    behaviorRows: null,
    baselineRows: null,
    candidateRows: null,
    snapshotUnchanged: null,
    confinement: [],
    usage: [],
    runtimeIdentity: {
      sources: [
        "packages/compiler/src/verification.ts",
        ...[
          "reactor.ts",
          "verification-fold.ts",
          "verification-protocol.ts",
          "verification-host.ts",
          "verification.ts",
          "verification-worktree.ts",
          "review.ts",
          "repair.ts",
          "worker-store.ts",
          "worker-transport.ts",
        ].map((name) => `packages/skeleton/src/${name}`),
      ].map((path) => ({
        path,
        sha256: digest(readFileSync(join(launchpad, path))),
      })),
    },
  };
  let fixture;
  const started = Date.now();
  try {
    receipt.actor.harnessVersion =
      execFileSync(harness, ["--version"], {
        encoding: "utf8",
        stdio: ["ignore", "pipe", "pipe"],
        timeout: 10000,
      }).match(/\b\d+\.\d+\.\d+\b/u)?.[0] ?? "unknown";
    fixture = prepareLiveFixture(label);
    receipt.verifierActor.harnessVersion =
      verifierHarness === harness
        ? receipt.actor.harnessVersion
        : (execFileSync(verifierHarness, ["--version"], {
            encoding: "utf8",
            stdio: ["ignore", "pipe", "pipe"],
            timeout: 10000,
          }).match(/\b\d+\.\d+\.\d+\b/u)?.[0] ?? "unknown");
    const makeTransport = (actor, role) => {
      const Transport =
        actor.harness === "claude"
          ? ClaudeCliPrintWorkOrderTransport
          : CodexCliExecWorkOrderTransport;
      return new Transport(
        (launch) => {
          const args = launch.args;
          receipt.confinement.push({
            role,
            harness: actor.harness,
            profile: "worktree-snapshot",
            freshProcess:
              !args.includes("resume") &&
              !args.includes("--resume") &&
              !args.includes("--continue"),
            actorToolsDisabled:
              actor.harness === "claude"
                ? args[args.indexOf("--tools") + 1] === ""
                : ["shell_tool", "unified_exec"].every((feature) =>
                    args.some(
                      (arg, index) =>
                        arg === "--disable" && args[index + 1] === feature,
                    ),
                  ),
          });
          return runWorkerProcess(launch);
        },
        actor.harnessVersion,
        (usage) => receipt.usage.push({ ...usage, episodeKind: role }),
      );
    };
    const transport = makeTransport(receipt.actor, "review");
    const result = await runReview(fixture, {
      transport,
      model,
      effort,
      verifier: {
        transport: makeTransport(receipt.verifierActor, "verifier"),
        model: receipt.verifierActor.model,
        effort: receipt.verifierActor.effort,
      },
    });
    receipt.sessions = {
      implementer: {
        kind: "process-double",
        episodeId: "ep_synthetic_implementer",
      },
      episodes: decodeLog(result.log)
        .filter((event) => event.type === "WorkerAttemptStarted")
        .map((event) => ({
          episodeId: event.payload.workerEpisodeId,
          kind: event.payload.episodeKind ?? event.payload.role,
          transport: event.payload.transport,
        })),
    };
    receipt.reviewCompleted = decodeLog(result.log).find(
      (event) => event.type === "ReviewCompleted",
    );
    receipt.behaviorRows = result.behaviorRows;
    receipt.baselineRows = fixture.base.subject.evidence;
    receipt.candidateRows = fixture.prepared.subject.evidence;
    receipt.snapshotUnchanged = result.snapshotUnchanged;
    const findings = result.review.findings.filter(
      (finding) => finding.severity === "blocking",
    );
    assert.equal(findings.length, 2);
    assert.ok(
      findings.some(
        (finding) =>
          finding.likelySurface.includes("sum.mjs") &&
          finding.evidenceRefs.includes("conventions:CONVENTIONS.md") &&
          finding.expected === conventionRule,
      ),
    );
    assert.ok(
      findings.some(
        (finding) =>
          finding.likelySurface.includes("README.md") &&
          finding.evidenceRefs.includes("contract") &&
          finding.expected === scopeRule,
      ),
    );
    assert.equal(
      new Set(receipt.sessions.episodes.map((episode) => episode.episodeId))
        .size,
      2,
    );
    assert.ok(
      receipt.confinement.every(
        (row) => row.freshProcess && row.actorToolsDisabled,
      ),
    );
    receipt.status = "passed";
    receipt.pendingRow = null;
  } catch (error) {
    writeFileSync(
      join(launchpad, `.runtime/wo184/${label}-failure.txt`),
      String(error?.stack ?? error),
      { flag: "wx", mode: 0o600 },
    );
    receipt.status = fixture ? "failed" : "unavailable";
    receipt.failure = {
      code: typeof error?.code === "string" ? error.code : "proof-incomplete",
      detail: error?.code === "invalid-result" ? error.detail : null,
    };
  }
  if (fixture && existsSync(join(fixture.root, "review", "events.jsonl"))) {
    const events = decodeLog(
      readFileSync(join(fixture.root, "review", "events.jsonl"), "utf8"),
    );
    receipt.lastResultObserved =
      events
        .filter((event) => event.type === "VerificationWorkerResultObserved")
        .at(-1) ?? null;
    if (
      receipt.status === "failed" &&
      receipt.lastResultObserved?.payload.value.envelope.requiresHuman
    )
      receipt.failure = { code: "episode-needs-human", detail: null };
  }
  receipt.wallSeconds = (Date.now() - started) / 1000;
  writeFileSync(
    join(directory, `${label}.json`),
    JSON.stringify(publicReceipt(receipt), null, 2) + "\n",
    { flag: "wx" },
  );
  console.log(
    JSON.stringify({
      label,
      status: receipt.status,
      failure: receipt.failure,
      wallSeconds: receipt.wallSeconds,
    }),
  );
  if (receipt.status === "failed") process.exitCode = 1;
  return receipt;
}
if (process.argv[2] === "--live")
  await live("claude", "claude-opus-5-5", "xhigh", process.argv[3]);

/** Synthetic kernel/driver repair admission; native snapshot repair is not granted. */
export async function repairReviewDriverFixture() {
  const fixture = createReviewFixture({ scopeDefect: false });
  let store;
  try {
    const readme = readFileSync(join(fixture.repo, "README.md"), "utf8");
    writeFileSync(
      join(fixture.repo, "descriptor-test.mjs"),
      `import assert from 'node:assert/strict'; import {readFileSync} from 'node:fs'; assert.equal(readFileSync('README.md','utf8'),${JSON.stringify(readme)});\n`,
    );
    writeFileSync(
      join(fixture.repo, "sum.mjs"),
      "export const add = (left, right) => left + right;\n",
    );
    git(fixture.repo, "add", "sum.mjs", "descriptor-test.mjs");
    git(
      fixture.repo,
      "commit",
      "-m",
      "Declare independent synthetic descriptor criterion",
    );
    const baseCommit = git(fixture.repo, "rev-parse", "HEAD");
    const criteria = [
      fixture.original.criteria[1],
      {
        criterionId: "AC-description",
        description: "Reading README returns its declared descriptor.",
        claimType: "behavior",
        evidenceSource: "live",
        codeSurfaces: ["README.md"],
        requiredChecks: ["descriptor"],
      },
    ];
    const options = {
      ...fixture.options,
      baseCommit,
      criteria,
      contract: {
        ...fixture.options.contract,
        acceptanceCriteria: criteria.map((criterion) => criterion.description),
        requiredEvidence: [
          "node contract-test.mjs",
          "node descriptor-test.mjs",
        ],
      },
      tests: [
        fixture.original.tests[1],
        {
          criterionId: "AC-description",
          checkId: "descriptor",
          command: "node descriptor-test.mjs",
        },
      ],
    };
    const base = prepareWorktreeVerification({
      ...options,
      observedCommit: baseCommit,
      directory: join(fixture.root, "driver-baseline"),
    });
    writeFileSync(
      join(fixture.repo, "sum.mjs"),
      "export const add = (left, right) => left + Math.abs(right);\n",
    );
    git(fixture.repo, "add", "sum.mjs");
    git(
      fixture.repo,
      "commit",
      "-m",
      "Plant one-criterion synthetic behavior failure",
    );
    const candidate = prepareWorktreeVerification({
      ...options,
      observedCommit: git(fixture.repo, "rev-parse", "HEAD"),
      directory: join(fixture.root, "driver-candidate"),
    });
    store = new WorkerStore(join(fixture.root, "driver-store"));
    store.acquire();
    const driver = new VerificationDriver(store, "wo184_review_repair");
    driver.record("VerificationOpened", Date.now(), {
      baseline: base.subject,
      subject: candidate.subject,
      criteria,
      implementerEpisodeId: "ep_synthetic_implementer",
      reviewConventionsPath: null,
      reviewNotice: true,
      maxRepairs: 1,
      authority: {
        authorityEnvelopeId: "auth_wo184_driver",
        allowedEffects: ["verification.evaluate", "repair.propose"],
        deniedEffects: ["repo.write", "repo.delete", "network"],
        resourceLimits: { episodes: 4 },
        requiredEvidence: [],
        expiresAt: Date.now() + 3_600_000,
        revocationEventTypes: [],
      },
    });
    driver.persistNext(Date.now());
    const host = new VerificationHost({
      driver,
      transport: doubleTransport(),
      now: Date.now,
    });
    assert.match(
      transportPrompt(
        host.preflight(candidate.snapshotPath, "process-double", "unknown")
          .request,
      ),
      /independent review follows.*[Ss]cope and convention defects/u,
    );
    await host.run(candidate.snapshotPath, "process-double", "unknown");
    assert.equal(driver.state.next, "repair");
    driver.persistNext(Date.now());
    const pending = driver.state.pending,
      episodeId = "ep_synthetic_kernel_repair";
    assert.equal(pending.capsule.role, "repairer");
    assert.ok(!("reviewNotice" in pending.command.intent.payload));
    driver.record("WorkerAttemptStarted", Date.now(), {
      commandId: pending.command.commandId,
      workerEpisodeId: episodeId,
      role: "repairer",
      inputHash: pending.capsule.inputHash,
      leaseExpiresAt: Date.now() + 60_000,
      mode: "synthetic-kernel-driver",
    });
    const request = {
      kind: "evidence-worker",
      command: pending.command,
      capsule: pending.capsule,
      workOrder: pending.capsule.workOrder,
      episodeId,
      model: "process-double",
      effort: "unknown",
      cwd: candidate.snapshotPath,
      profile: {
        profileId: "worktree-snapshot",
        mounts: [{ path: candidate.snapshotPath, access: "read" }],
      },
    };
    const result = parseEvidenceResult(
      {
        kind: "repair",
        subjectRevision: candidate.subject.revision,
        replacements: [
          {
            path: "sum.mjs",
            contents: "export const add = (left, right) => left + right;\n",
          },
        ],
        envelope: {
          workOrderId: pending.capsule.workOrder.workOrderId,
          episodeId,
          resultId: `result_${pending.command.commandId}`,
          status: "completed",
          summary: "Synthetic kernel/driver data repair.",
          requiresHuman: false,
        },
      },
      request,
    );
    const payload = {
      commandId: pending.command.commandId,
      workerEpisodeId: episodeId,
      verificationResultVersion: 1,
      result: "completed",
      value: result,
    };
    const observed = driver.record(
      "VerificationWorkerResultObserved",
      Date.now(),
      payload,
      pending.command.commandId,
    );
    assert.ok(
      driver.admitResult({
        schemaVersion: 1,
        type: "CommandResult",
        actorId: "verification-host",
        workstreamId: driver.workstreamId,
        occurredAt: Date.now(),
        correlationId: pending.command.commandId,
        causationId: observed.eventId,
        payload,
      }),
    );
    driver.drainContinuation(Date.now());
    assert.equal(driver.state.next, "apply-repair");
    writeFileSync(
      join(fixture.repo, "sum.mjs"),
      result.replacements[0].contents,
    );
    git(fixture.repo, "add", "sum.mjs");
    git(fixture.repo, "commit", "-m", "Apply admitted synthetic driver repair");
    const repaired = prepareWorktreeVerification({
      ...options,
      observedCommit: git(fixture.repo, "rev-parse", "HEAD"),
      directory: join(fixture.root, "driver-repaired"),
    });
    // The extension may fill proposal metadata from the prior subject, but it
    // must not admit a submitted mode change that the proposal never authorized.
    const forged = structuredClone(repaired.subject);
    const changedFile = forged.files.find((file) => file.path === "sum.mjs");
    changedFile.mode = changedFile.mode === "100644" ? "100755" : "100644";
    forged.snapshot.snapshotHash = verificationSnapshotHash(
      forged,
      forged.snapshot,
    );
    for (const evidence of forged.evidence)
      if (evidence.hostTest)
        evidence.hostTest.snapshotHash = forged.snapshot.snapshotHash;
    assert.throws(
      () =>
        foldVerificationRepair(
          driver.state,
          { type: "VerificationSubjectSubmitted" },
          { subject: forged },
        ),
      /applied repair differs from proposal/u,
    );
    // Ordinary streams retain surface-based staleness after the same repair.
    const ordinary = { ...driver.state };
    delete ordinary.reviewConventionsPath;
    delete ordinary.reviewNotice;
    const ordinaryRepair = foldVerificationRepair(
      ordinary,
      { type: "VerificationSubjectSubmitted", eventId: "ordinary-repair" },
      { subject: repaired.subject },
    );
    assert.equal(
      ordinaryRepair.rows.find(
        (row) => row.criterion.criterionId === "AC-description",
      ).status,
      "verified",
    );
    assert.deepEqual(ordinaryRepair.staleness.at(-1).criterionIds, [
      criteria[0].criterionId,
    ]);
    driver.record("VerificationSubjectSubmitted", Date.now(), {
      subject: repaired.subject,
      producingEpisodeId: episodeId,
    });
    assert.deepEqual(driver.state.staleness.at(-1).changedSurfaces, [
      "sum.mjs",
    ]);
    assert.deepEqual(
      driver.state.staleness.at(-1).criterionIds,
      criteria.map((criterion) => criterion.criterionId),
    );
    assert.equal(
      criteria.filter((criterion) => criterion.codeSurfaces.includes("sum.mjs"))
        .length,
      1,
    );
    assert.ok(driver.state.rows.every((row) => row.status === "stale"));
    driver.persistNext(Date.now());
    assert.deepEqual(
      driver.state.pending.capsule.criteria.map(
        (criterion) => criterion.criterionId,
      ),
      criteria.map((criterion) => criterion.criterionId),
    );
    await host.run(repaired.snapshotPath, "process-double", "unknown");
    assert.equal(driver.state.next, "review");
    driver.persistNext(Date.now());
    assert.ok(driver.state.pending.review);
    assert.ok(
      driver.state.rows.every(
        (row) =>
          row.evaluations.at(-1).subjectRevision === repaired.subject.revision,
      ),
    );
    return {
      kind: "synthetic-kernel-driver",
      nativeSnapshotRepairClaimed: false,
      criteria: criteria.map((criterion) => criterion.criterionId),
      changedSurfaces: ["sum.mjs"],
      allReverified: true,
      reviewDispatched: true,
    };
  } finally {
    store?.release();
    const unlock = (file) => {
      const info = lstatSync(file);
      if (info.isSymbolicLink()) return;
      if (info.isDirectory()) {
        chmodSync(file, 0o700);
        for (const name of readdirSync(file)) unlock(join(file, name));
      } else chmodSync(file, 0o600);
    };
    unlock(fixture.root);
    rmSync(fixture.root, { recursive: true, force: true });
  }
}
