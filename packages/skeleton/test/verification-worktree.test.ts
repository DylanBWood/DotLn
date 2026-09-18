import test, { before, after } from "node:test";
import assert from "node:assert/strict";
import {
  chmodSync,
  existsSync,
  lstatSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  symlinkSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";
import {
  assertVerificationTask,
  compileVerificationTask,
  type VerificationTask,
} from "@dotln/compiler";
import { decodeLog } from "@dotln/kernel";
import {
  VerificationHost,
  preflightVerificationRecovery,
} from "../src/verification-host.js";
import {
  assertWorktreeSnapshot,
  prepareWorktreeVerification,
} from "../src/verification-worktree.js";
import {
  parseEvidenceResult,
  transportPrompt,
  validateTransportRequest,
} from "../src/verification-protocol.js";
import { projectAcceptanceEvidenceMatrices } from "../src/verification.js";
import { fixtureGit } from "./source-change-fixture.js";
import {
  openSnapshotDriver,
  snapshotCriteria,
  snapshotResult,
  snapshotTransport,
  sourceSnapshotFixture,
} from "./verification-worktree-fixture.js";

let fixture: Awaited<ReturnType<typeof sourceSnapshotFixture>>;
before(async () => {
  fixture = await sourceSnapshotFixture();
});
function unlock(path: string): void {
  const stat = lstatSync(path);
  if (stat.isSymbolicLink()) return;
  chmodSync(path, stat.isDirectory() ? 0o700 : 0o600);
  if (stat.isDirectory())
    for (const name of readdirSync(path)) unlock(join(path, name));
}
after(() => {
  if (fixture) {
    unlock(fixture.root);
    rmSync(fixture.root, { recursive: true, force: true });
  }
});
const task = () =>
  compileVerificationTask(
    "wo_snapshot",
    snapshotCriteria,
    fixture.prepared.subject,
  );
let ordinal = 0;
const prepare = () =>
  prepareWorktreeVerification({
    ...fixture.options,
    directory: join(fixture.root, `repeat-${ordinal++}`),
  });

test("WO-054 AC1/2 capsule from a WO-052 episode has a sealed contract, diff and independent live host witnesses", () => {
  const capsule = task(),
    { prepared, result } = fixture;
  assert.equal(capsule.contractVersion, "verification-v1");
  assert.deepEqual(
    capsule.subject.snapshot?.contract,
    fixture.options.contract,
  );
  assert.match(capsule.subject.diff, /changed by synthetic worker/u);
  assert.equal(capsule.subject.revision, result.observation.commit);
  assert.equal(
    capsule.subject.snapshot?.observedCommit,
    result.observation.commit,
  );
  assert.deepEqual(
    capsule.subject.evidence.map((e) => e.outcome),
    process.platform === "darwin"
      ? ["pass", "fail"]
      : ["unavailable", "unavailable"],
  );
  assert.ok(
    capsule.subject.evidence.every(
      (e) =>
        e.source === "live" &&
        e.hostTest?.origin === "host" &&
        e.hostTest.kind === "host-run-test",
    ),
  );
  assert.equal(
    result.observation.testAfter.exitCode,
    0,
    "worker superficial test passed",
  );
  assert.ok(
    prepared.testPaths.every(
      (path) =>
        path !== prepared.snapshotPath && path !== fixture.source.tree.path,
    ),
  );
  assert.equal(
    lstatSync(join(prepared.snapshotPath, "fixture.txt")).mode & 0o222,
    0,
  );
  assert.equal(existsSync(join(prepared.snapshotPath, ".git")), false);
  assert.equal(existsSync(join(prepared.snapshotPath, ".claude")), false);
  assertWorktreeSnapshot(capsule, prepared.snapshotPath);
});

test("WO-054 AC1 nested envelope injection refuses with the exact path, including through protocol validation", () => {
  const { store, host } = openSnapshotDriver(fixture, "injections");
  try {
    const request = host.preflight(
      fixture.prepared.snapshotPath,
      "synthetic",
      "unknown",
    ).request;
    for (const [path, inject] of [
      [
        "$.summary",
        (c: any) => {
          c.summary = "IMPLEMENTER_NARRATIVE";
        },
      ],
      [
        "$.subject.envelope",
        (c: any) => {
          c.subject.envelope = { status: "completed" };
        },
      ],
      [
        "$.subject.files[0].summary",
        (c: any) => {
          c.subject.files[0].summary = "IMPLEMENTER_NARRATIVE";
        },
      ],
      [
        "$.subject.snapshot.contract.resultId",
        (c: any) => {
          c.subject.snapshot.contract.resultId = "worker";
        },
      ],
      [
        "$.subject.evidence[0].hostTest.requiresHuman",
        (c: any) => {
          c.subject.evidence[0].hostTest.requiresHuman = false;
        },
      ],
    ] as const) {
      const capsule = structuredClone(request.capsule);
      inject(capsule);
      assert.throws(
        () => assertVerificationTask(capsule),
        (error) => error instanceof Error && error.message.includes(path),
      );
      assert.throws(
        () => validateTransportRequest({ ...request, capsule }),
        (error) => error instanceof Error && error.message.includes(path),
      );
    }
    assert.doesNotMatch(
      transportPrompt(request),
      /IMPLEMENTER_NARRATIVE|testAfter|observedDenials/u,
    );
    assert.throws(
      () =>
        compileVerificationTask("bad", snapshotCriteria, {
          ...fixture.prepared.subject,
          snapshot: {
            ...fixture.prepared.subject.snapshot!,
            tests: [
              { ...fixture.options.tests[0]!, command: "node unnamed.mjs" },
            ],
          },
        }),
      /absent from contract/u,
    );
    assert.throws(
      () =>
        prepareWorktreeVerification({
          ...fixture.options,
          directory: join(fixture.root, "missing-criterion"),
          contract: {
            ...fixture.options.contract,
            acceptanceCriteria: [
              ...fixture.options.contract.acceptanceCriteria,
              "Unverified extra requirement",
            ],
          },
        }),
      /criterion coverage/u,
    );
    assert.equal(existsSync(join(fixture.root, "missing-criterion")), false);
    assert.throws(
      () =>
        prepareWorktreeVerification({
          ...fixture.options,
          directory: join(fixture.root, "option-command"),
          contract: {
            ...fixture.options.contract,
            requiredEvidence: ["-f outside"],
          },
          tests: [{ ...fixture.options.tests[0]!, command: "-f outside" }],
        }),
      /named test/u,
    );
  } finally {
    store.release();
  }
});

test("WO-054 AC2 on-disk bytes, modes, additions, removals and symlinks cannot retain the sealed input hash", () => {
  for (const mutate of [
    (root: string) => {
      chmodSync(join(root, "fixture.txt"), 0o600);
      writeFileSync(join(root, "fixture.txt"), "tampered\n");
      chmodSync(join(root, "fixture.txt"), 0o400);
    },
    (root: string) => chmodSync(join(root, "fixture.txt"), 0o500),
    (root: string) => chmodSync(join(root, "fixture.txt"), 0o600),
    (root: string) =>
      writeFileSync(join(root, "extra.txt"), "extra", { mode: 0o400 }),
    (root: string) => mkdirSync(join(root, "empty"), { mode: 0o500 }),
    (root: string) => unlinkSync(join(root, "fixture.txt")),
    (root: string) => {
      unlinkSync(join(root, "fixture.txt"));
      symlinkSync(
        join(fixture.root, "target/fixture.txt"),
        join(root, "fixture.txt"),
      );
    },
  ]) {
    const prepared = prepare();
    chmodSync(prepared.snapshotPath, 0o700);
    mutate(prepared.snapshotPath);
    chmodSync(prepared.snapshotPath, 0o500);
    assert.throws(
      () => assertWorktreeSnapshot(task(), prepared.snapshotPath),
      /snapshot (input hash drift|path refused|read mount is writable|contains an empty directory)/u,
    );
  }
});

test("WO-054 AC3 failing contract finding survives a success-shaped implementer event", async () => {
  const { store, driver, host } = openSnapshotDriver(fixture, "matrix");
  try {
    const envelope = await host.run(
      fixture.prepared.snapshotPath,
      "synthetic",
      "unknown",
    );
    assert.equal(envelope.status, "completed");
    const matrix = projectAcceptanceEvidenceMatrices(decodeLog(driver.log))[0]!;
    if (process.platform !== "darwin") {
      assert.notEqual(matrix.rows[0]?.status, "verified");
      return;
    }
    assert.equal(matrix.rows[0]?.status, "failed");
    const result = decodeLog(driver.log).find(
      (e) => e.type === "CommandResult",
    )!;
    const negative = driver.state;
    driver.feed({
      ...result,
      actorId: "implementer",
      episodeId: "ep_source_implementer",
      occurredAt: 13,
      payload: {
        ...(result.payload as object),
        result: "completed",
        value: {
          envelope: { status: "completed", summary: "Everything passed" },
        },
      },
    });
    assert.deepEqual(driver.state, negative);
    const finding = matrix.findings[0]!.finding;
    assert.equal(finding.observed, "exit 1");
    assert.equal(finding.expected, "exit 0");
    assert.ok(finding.reproductionSteps[0]?.includes("node contract-test.mjs"));
    assert.ok(finding.evidenceRefs.length);
  } finally {
    store.release();
  }
});

test("WO-054 adverse witness cannot be omitted from a passing verifier result", () => {
  const { store, host } = openSnapshotDriver(fixture, "adverse");
  try {
    const request = host.preflight(
      fixture.prepared.snapshotPath,
      "synthetic",
      "unknown",
    ).request;
    const result = snapshotResult(request);
    assert.throws(
      () =>
        parseEvidenceResult(
          {
            ...result,
            findings: [],
            evaluations: result.evaluations.map((e) => ({
              ...e,
              verdict: "pass",
              evidenceRefs: [request.capsule.subject.evidence[0]!.evidenceId],
            })),
          },
          request,
        ),
      /unsupported pass|contradictory witness/u,
    );
  } finally {
    store.release();
  }
});

test("WO-054 cached recovery and post-dispatch admission recheck the physical snapshot", async () => {
  for (const cached of [true, false]) {
    const prepared = prepare(),
      { store, driver } = openSnapshotDriver(fixture, `tamper-${cached}`);
    const mutate = () => {
      chmodSync(join(prepared.snapshotPath, "fixture.txt"), 0o600);
      writeFileSync(
        join(prepared.snapshotPath, "fixture.txt"),
        "changed after seal",
      );
      chmodSync(join(prepared.snapshotPath, "fixture.txt"), 0o400);
    };
    try {
      const host = new VerificationHost({
        driver,
        now: () => 12,
        transport: snapshotTransport(() => {
          if (!cached) mutate();
        }),
      });
      if (cached) {
        const request = host.preflight(
          prepared.snapshotPath,
          "synthetic",
          "unknown",
        ).request;
        store.saveResult(request, snapshotResult(request));
        mutate();
        assert.throws(
          () =>
            preflightVerificationRecovery(
              store,
              driver.workstreamId,
              () => prepared.snapshotPath,
              "synthetic",
              "unknown",
            ),
          /snapshot (input hash drift|read mount is writable)/u,
        );
      }
      await assert.rejects(
        host.run(prepared.snapshotPath, "synthetic", "unknown"),
        /profile-refused|snapshot input hash drift|snapshot read mount is writable/u,
      );
      assert.equal(
        decodeLog(driver.log).some((e) => e.type === "CommandResult"),
        false,
      );
    } finally {
      store.release();
    }
  }
});

test("WO-054 host test confinement denies outside reads, writes and network and isolates each execution", () => {
  const repo = join(fixture.root, "confinement-target");
  mkdirSync(repo);
  fixtureGit(repo, "init", "--initial-branch=main");
  const sentinel = join(fixture.root, "sentinel.txt"),
    outside = join(fixture.root, "forbidden.txt");
  writeFileSync(sentinel, "private fixture");
  writeFileSync(
    join(repo, "check.cjs"),
    `const fs=require('node:fs'); const assert=require('node:assert/strict'); for(const op of [()=>fs.readFileSync(${JSON.stringify(sentinel)}),()=>fs.writeFileSync(${JSON.stringify(outside)},'x')]) {assert.throws(op,e=>e.code==='EPERM')} assert.equal(fs.existsSync('own-cache'),false);fs.writeFileSync('own-cache','allowed'); const s=require('node:net').connect(9,'127.0.0.1');s.on('error',e=>process.exit(e.code==='EPERM'?0:8));`,
  );
  fixtureGit(repo, "add", ".");
  fixtureGit(repo, "commit", "-m", "Confinement fixture");
  const commit = fixtureGit(repo, "rev-parse", "HEAD");
  const criterion = {
    ...snapshotCriteria[0]!,
    codeSurfaces: ["check.cjs"],
    requiredChecks: ["one", "two"],
  };
  const result = prepareWorktreeVerification({
    ...fixture.options,
    worktree: repo,
    baseCommit: commit,
    observedCommit: commit,
    directory: join(fixture.root, "confinement"),
    criteria: [criterion],
    contract: {
      ...fixture.options.contract,
      requiredEvidence: ["node check.cjs"],
    },
    tests: ["one", "two"].map((checkId) => ({
      criterionId: criterion.criterionId,
      checkId,
      command: "node check.cjs",
    })),
  });
  assert.deepEqual(
    result.subject.evidence.map((e) => e.outcome),
    process.platform === "darwin"
      ? ["pass", "pass"]
      : ["unavailable", "unavailable"],
  );
  assert.equal(existsSync(outside), false);
  assert.equal(readFileSync(sentinel, "utf8"), "private fixture");
  assert.equal(existsSync(join(result.snapshotPath, "own-cache")), false);
});

test("WO-054 unavailable commands never pass and a named test cannot rewrite its own inputs", () => {
  const repo = join(fixture.root, "unavailable-target");
  mkdirSync(repo);
  fixtureGit(repo, "init", "--initial-branch=main");
  writeFileSync(
    join(repo, "change.cjs"),
    "require('node:fs').writeFileSync('change.cjs','changed input');\n",
  );
  fixtureGit(repo, "add", ".");
  fixtureGit(repo, "commit", "-m", "Unavailable and mutation fixture");
  const commit = fixtureGit(repo, "rev-parse", "HEAD");
  const criterion = {
    ...snapshotCriteria[0]!,
    codeSurfaces: ["change.cjs"],
    requiredChecks: ["check"],
  };
  const options = (command: string, name: string) => ({
    ...fixture.options,
    worktree: repo,
    baseCommit: commit,
    observedCommit: commit,
    directory: join(fixture.root, name),
    criteria: [criterion],
    contract: { ...fixture.options.contract, requiredEvidence: [command] },
    tests: [{ criterionId: criterion.criterionId, checkId: "check", command }],
  });
  const missing = prepareWorktreeVerification(
    options("dotln_missing_test_executable", "unavailable"),
  );
  assert.equal(missing.subject.evidence[0]?.outcome, "unavailable");
  if (process.platform === "darwin")
    assert.throws(
      () =>
        prepareWorktreeVerification(options("node change.cjs", "self-change")),
      /named test changed a snapshot input/u,
    );
  assert.equal(
    readFileSync(join(repo, "change.cjs"), "utf8"),
    "require('node:fs').writeFileSync('change.cjs','changed input');\n",
  );
});
