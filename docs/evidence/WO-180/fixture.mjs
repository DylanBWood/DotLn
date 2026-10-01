// Baseline proof on WO-056's synthetic repository; no real source is imported.
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, realpathSync } from "node:fs";
import { homedir, hostname } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { createFixture } from "../WO-056/fixture.mjs";
import { git, launchpad } from "../WO-053/fixture.mjs";
import { decodeLog } from "../../../packages/kernel/dist/src/index.js";
import {
  VerificationDriver,
  VerificationHost,
} from "../../../packages/skeleton/dist/src/verification-host.js";
import { prepareWorktreeVerification } from "../../../packages/skeleton/dist/src/verification-worktree.js";
import { WorkerStore } from "../../../packages/skeleton/dist/src/worker-store.js";
import { fixtureVerificationResult } from "../../../packages/skeleton/dist/src/verification-fake.js";
import {
  baselineDisposition,
  baselineWitnessRows,
  compareBaseline,
  parseEvidenceResult,
} from "../../../packages/skeleton/dist/src/verification-protocol.js";
import { projectAcceptanceEvidenceMatrices } from "../../../packages/skeleton/dist/src/verification.js";
import {
  ClaudeCliPrintWorkOrderTransport,
  CodexCliExecWorkOrderTransport,
  runWorkerProcess,
} from "../../../packages/skeleton/dist/src/worker-transport.js";

const directory = fileURLToPath(new URL("./", import.meta.url));
const planted = "export const add = (left, right) => left + Math.abs(right);\n";
const repaired = "export const add = (left, right) => left + right;\n";
export const story = {
  storyId: "story-signed-addition",
  kind: "defect",
  tests: [
    {
      criterionId: "AC-signed",
      checkId: "contract",
      command: "node contract-test.mjs",
      expectedExitCode: 1,
    },
  ],
};
const tests = [
  {
    criterionId: "AC-positive",
    checkId: "superficial",
    command: "node focused-test.mjs",
  },
  {
    criterionId: "AC-signed",
    checkId: "contract",
    command: "node contract-test.mjs",
  },
];
const original = JSON.parse(
  readFileSync(
    new URL("../WO-056/worker-loadout.json", import.meta.url),
    "utf8",
  ),
).activeMechanics[0].workOrder;
const contract = {
  workOrderId: "wo180_signed_addition",
  objective:
    "Make add return the numeric sum for all signs without changing its named tests.",
  acceptanceCriteria: original.acceptanceCriteria,
  constraints: ["Change only sum.mjs."],
  nonGoals: ["Remote effects"],
  requiredEvidence: tests.map((test) => test.command),
};
const criteria = contract.acceptanceCriteria.map((description, index) => ({
  criterionId: index ? "AC-signed" : "AC-positive",
  description,
  claimType: "behavior",
  evidenceSource: "live",
  codeSurfaces: ["sum.mjs"],
  requiredChecks: [index ? "contract" : "superficial"],
}));

export function createBaselineFixture(variant = "defect") {
  assert.ok(["defect", "passing"].includes(variant));
  const root = createFixture();
  const { repo } = JSON.parse(readFileSync(join(root, "fixture.json"), "utf8"));
  writeFileSync(
    join(repo, "sum.mjs"),
    variant === "defect" ? planted : repaired,
  );
  git(repo, "add", "sum.mjs");
  git(
    repo,
    "commit",
    "-m",
    variant === "defect"
      ? "Plant the signed addition defect"
      : "Prepare the non-reproducing base",
  );
  const baseCommit = git(repo, "rev-parse", "HEAD");
  const options = {
    worktree: repo,
    baseCommit,
    observedCommit: baseCommit,
    repo: "wo056-synthetic-signed-addition",
    contract,
    criteria,
    tests,
  };
  const base = prepareWorktreeVerification({
    ...options,
    directory: join(root, "baseline"),
  });
  return { root, repo, options, base };
}

export function doubleResult(request) {
  if (request.baseline?.kind === "baseline")
    return {
      kind: "baseline",
      subjectRevision: request.capsule.subject.revision,
      envelope: {
        workOrderId: request.workOrder.workOrderId,
        episodeId: request.episodeId,
        resultId: `result_${request.command.commandId}`,
        status: "completed",
        summary: "Process double inspected the supplied baseline witnesses.",
        requiresHuman: false,
      },
    };
  const result = fixtureVerificationResult(
    request.capsule,
    request.episodeId,
    `result_${request.command.commandId}`,
  );
  const baselineFindings = compareBaseline(request.baseline, request.capsule);
  return {
    ...result,
    evaluations: result.evaluations.map((evaluation) =>
      baselineFindings.some(
        (finding) => finding.criterionId === evaluation.criterionId,
      ) && evaluation.verdict === "pass"
        ? { ...evaluation, verdict: "unverified" }
        : evaluation,
    ),
    findings: result.findings.map((finding) => ({
      ...finding,
      likelySurface: ["sum.mjs"],
    })),
    ...(request.baseline?.kind === "comparison" ? { baselineFindings } : {}),
  };
}
export const doubleTransport = (onDispatch = () => {}) => ({
  name: "fake",
  harnessVersion: "not-applicable",
  dispatch(request, now) {
    onDispatch(request);
    return {
      receipt: Promise.resolve({
        commandId: request.command.commandId,
        transport: "fake",
        acceptedAt: now(),
      }),
      completed: Promise.resolve(
        parseEvidenceResult(doubleResult(request), request),
      ),
      alive: () => false,
      kill() {},
    };
  },
});

function opened(
  fixture,
  prepared,
  baselineContext,
  name,
  transport,
  afterResultSaved,
) {
  const store = new WorkerStore(join(fixture.root, name));
  store.acquire();
  const driver = new VerificationDriver(
    store,
    `ws_${name.replaceAll("-", "_")}`,
  );
  driver.record("VerificationOpened", Date.now(), {
    baseline: fixture.base.subject,
    subject: prepared.subject,
    criteria,
    baselineContext,
    implementerEpisodeId: "ep_reserved_future_implementer",
    maxRepairs: 0,
    authority: {
      authorityEnvelopeId: "auth_baseline_proof",
      allowedEffects: ["verification.evaluate"],
      deniedEffects: ["repo.write", "repo.delete", "network"],
      resourceLimits: { episodes: 1 },
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
      now: () => Date.now(),
      ...(afterResultSaved ? { afterResultSaved } : {}),
    }),
  };
}
export async function runBaseline(fixture, options = {}) {
  const session = opened(
    fixture,
    fixture.base,
    { kind: "baseline", story: options.story ?? story },
    options.name ?? "baseline-store",
    options.transport ?? doubleTransport(),
    options.afterResultSaved,
  );
  try {
    const envelope = await session.host.run(
      fixture.base.snapshotPath,
      options.model ?? "process-double",
      options.effort ?? "unknown",
    );
    return {
      envelope,
      witness: session.driver.state.baselineWitness,
      log: session.driver.log,
      state: session.driver.state,
      session,
    };
  } finally {
    session.store.release();
  }
}
export async function runCandidate(fixture, witness, options = {}) {
  // This is a synthetic candidate double, never a source change in DotLn.
  writeFileSync(
    join(fixture.repo, "sum.mjs"),
    repaired + "// Candidate of the synthetic baseline proof.\n",
  );
  git(fixture.repo, "add", "sum.mjs");
  git(
    fixture.repo,
    "commit",
    "-m",
    "Repair the synthetic signed addition defect",
  );
  const prepared = prepareWorktreeVerification({
    ...fixture.options,
    observedCommit: git(fixture.repo, "rev-parse", "HEAD"),
    directory: join(fixture.root, "candidate"),
  });
  const session = opened(
    fixture,
    prepared,
    { kind: "comparison", witness },
    "candidate-store",
    options.transport ?? doubleTransport(),
  );
  try {
    await session.host.run(prepared.snapshotPath, "process-double", "unknown");
    return {
      state: session.driver.state,
      log: session.driver.log,
      prepared,
      session,
      matrix: projectAcceptanceEvidenceMatrices(
        decodeLog(session.driver.log),
      )[0],
    };
  } finally {
    session.store.release();
  }
}
export async function composeDouble(fixture, baselineOptions = {}) {
  const baseline = await runBaseline(fixture, baselineOptions);
  if (!baseline.witness)
    return {
      baseline,
      disposition: {
        kind: "BaselineNeedsHuman",
        storyId: (baselineOptions.story ?? story).storyId,
      },
      implementationDispatched: false,
    };
  const disposition = baselineDisposition(baseline.witness);
  if (disposition.kind !== "Continue")
    return { baseline, disposition, implementationDispatched: false };
  return {
    baseline,
    disposition,
    implementationDispatched: true,
    candidate: await runCandidate(fixture, baseline.witness),
  };
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
async function live(harness, model, effort, label) {
  assert.ok(["claude", "codex"].includes(harness));
  assert.match(label, /^[a-z][a-z0-9-]*$/u);
  if (process.env.DOTLN_LIVE_WORKERS !== "1")
    throw new Error("DOTLN_LIVE_WORKERS=1 is required");
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
    status: "unavailable",
    pendingRow: `baseline-${harness}`,
    failure: null,
    confinement: null,
    baselineEvent: null,
    rows: null,
    candidateComparison: null,
    usage: null,
    runtimeIdentity: {
      skeletonVersion: JSON.parse(
        readFileSync(
          new URL("../../../packages/skeleton/package.json", import.meta.url),
          "utf8",
        ),
      ).version,
      sources: [
        "reactor.ts",
        "verification-protocol.ts",
        "verification-host.ts",
        "verification.ts",
        "verification-worktree.ts",
        "worker-store.ts",
        "worker-transport.ts",
      ].map((name) => ({
        path: `packages/skeleton/src/${name}`,
        sha256: createHash("sha256")
          .update(
            readFileSync(
              new URL(
                `../../../packages/skeleton/src/${name}`,
                import.meta.url,
              ),
            ),
          )
          .digest("hex"),
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
        timeout: 10_000,
      }).match(/\b\d+\.\d+\.\d+\b/u)?.[0] ?? "unknown";
    fixture = createBaselineFixture();
    const Transport =
      harness === "claude"
        ? ClaudeCliPrintWorkOrderTransport
        : CodexCliExecWorkOrderTransport;
    const transport = new Transport(
      (launch) => {
        const args = launch.args;
        receipt.confinement = {
          profile: "worktree-snapshot",
          readMount: "sealed base files only",
          testCopies: "one fresh confined copy per named test",
          testConfinement:
            process.platform === "darwin"
              ? "macOS sandbox-exec"
              : "unavailable",
          actorToolsDisabled:
            harness === "claude"
              ? args[args.indexOf("--tools") + 1] === ""
              : ["shell_tool", "unified_exec"].every((feature) =>
                  args.some(
                    (arg, index) =>
                      arg === "--disable" && args[index + 1] === feature,
                  ),
                ),
          actorNetworkDisabled:
            harness === "claude"
              ? args.includes("--strict-mcp-config") &&
                args.includes("--no-chrome")
              : args.includes("permissions.dotln-worker.network.enabled=false"),
        };
        return runWorkerProcess(launch);
      },
      receipt.actor.harnessVersion,
      (usage) => {
        receipt.usage = usage;
      },
    );
    const baseline = await runBaseline(fixture, { transport, model, effort });
    const event = decodeLog(baseline.log).find(
      (event) => event.type === "BaselineWitnessed",
    );
    const isolation = decodeLog(baseline.log).find(
      (event) => event.type === "WorkerCompleted",
    )?.payload.codexIsolation;
    if (isolation)
      receipt.confinement.codexIsolation = {
        homeRemoved: isolation.homeRemoved,
        userConfigurationUnchanged:
          isolation.userConfig.before === isolation.userConfig.after,
        userTrustTableUnchanged:
          isolation.trustTable.before === isolation.trustTable.after,
      };
    receipt.baselineEvent = event;
    receipt.rows = baselineWitnessRows(baseline.witness);
    assert.equal(baseline.witness.outcome, "reproduced");
    assert.equal(baselineDisposition(baseline.witness).kind, "Continue");
    const candidate = await runCandidate(fixture, baseline.witness);
    receipt.candidateComparison = {
      actor: "process-double",
      findings: candidate.matrix.baselineFindings,
      phase: candidate.state.next,
      rows: candidate.state.rows.map((row) => ({
        criterionId: row.criterion.criterionId,
        status: row.status,
      })),
    };
    assert.equal(candidate.state.next, "complete");
    assert.deepEqual(candidate.matrix.baselineFindings, []);
    assert.equal(receipt.confinement.actorToolsDisabled, true);
    receipt.status = "passed";
    receipt.pendingRow = null;
  } catch (error) {
    receipt.status = fixture ? "failed" : "unavailable";
    receipt.failure = {
      code: typeof error?.code === "string" ? error.code : "proof-incomplete",
      detail: error?.code === "invalid-result" ? error.detail : null,
    };
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
      outcome: receipt.baselineEvent?.payload.outcome ?? null,
      pendingRow: receipt.pendingRow,
      wallSeconds: receipt.wallSeconds,
    }),
  );
  if (receipt.status !== "passed") process.exitCode = 1;
}
if (
  process.argv[1] &&
  realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const [action, harness, model, effort, label] = process.argv.slice(2);
  if (action !== "live" || !harness || !model || !effort || !label)
    throw new Error(
      "usage: fixture.mjs live claude|codex <model> <effort> <label>",
    );
  await live(harness, model, effort, label);
}
