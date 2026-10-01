// WO-056's synthetic repository, with a behavior-correct candidate and two review defects.
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, realpathSync, existsSync } from "node:fs";
import { homedir, hostname } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { createFixture } from "../WO-056/fixture.mjs";
import { git, launchpad, treeDigest } from "../WO-053/fixture.mjs";
import { compileLoadout } from "../../../packages/compiler/dist/src/index.js";
import { decodeLog } from "../../../packages/kernel/dist/src/index.js";
import {
  VerificationDriver,
  VerificationHost,
} from "../../../packages/skeleton/dist/src/verification-host.js";
import { prepareWorktreeVerification } from "../../../packages/skeleton/dist/src/verification-worktree.js";
import { WorkerStore } from "../../../packages/skeleton/dist/src/worker-store.js";
import { fixtureVerificationResult } from "../../../packages/skeleton/dist/src/verification-fake.js";
import { parseEvidenceResult } from "../../../packages/skeleton/dist/src/verification-protocol.js";
import { repairContract } from "../../../packages/skeleton/dist/src/repair.js";
import { RepairHost } from "../../../packages/skeleton/dist/src/repair-host.js";
import { routeReview } from "../../../packages/skeleton/dist/src/review.js";
import {
  ClaudeCliPrintWorkOrderTransport,
  CodexCliExecWorkOrderTransport,
  runWorkerProcess,
} from "../../../packages/skeleton/dist/src/worker-transport.js";

const directory = fileURLToPath(new URL("./", import.meta.url));
export const conventionRule = "Local variables in sum.mjs use lowerCamelCase.";
export const scopeRule =
  "Change only sum.mjs; never change a test, the README, governance, settings or the commit message";
export const repaired = "export const add = (left, right) => left + right;\n";
const candidate =
  "export const add = (left, right) => { const TOTAL = left + right; return TOTAL; };\n";
const json = (file) => JSON.parse(readFileSync(file, "utf8"));
const digest = (bytes) => createHash("sha256").update(bytes).digest("hex");

export function createReviewFixture({
  scopeDefect = true,
  conventions = true,
} = {}) {
  const root = createFixture();
  const { repo } = json(join(root, "fixture.json"));
  if (conventions) {
    writeFileSync(
      join(repo, "CONVENTIONS.md"),
      `# Declared conventions\n\n${conventionRule}\n`,
    );
    git(repo, "add", "CONVENTIONS.md");
    git(repo, "commit", "-m", "Declare synthetic repository naming convention");
  }
  const baseCommit = git(repo, "rev-parse", "HEAD");
  const loadout = json(
    new URL("../WO-056/worker-loadout.json", import.meta.url),
  );
  loadout.activeMechanics[0].workOrder.workOrderId = "wo181_signed_addition";
  const compiled = compileLoadout(loadout, {
    environmentId: "wo181.scratch",
    version: 1,
    capabilities: [],
    repo,
    baseCommit,
  });
  assert.equal(compiled.ok, true);
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
  const workOrder = compiled.program.workOrder;
  const contract = repairContract(workOrder);
  const criteria = contract.acceptanceCriteria.map((description, index) => ({
    criterionId: index ? "AC-signed" : "AC-positive",
    description,
    claimType: "behavior",
    evidenceSource: "live",
    codeSurfaces: ["sum.mjs"],
    requiredChecks: [index ? "contract" : "superficial"],
  }));
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
  // The implementer is a process double; all writes are in the synthetic target.
  writeFileSync(join(repo, "sum.mjs"), candidate);
  if (scopeDefect)
    writeFileSync(
      join(repo, "README.md"),
      readFileSync(join(repo, "README.md"), "utf8") +
        "\nUnrequested release announcement.\n",
    );
  git(repo, "add", "sum.mjs", "README.md");
  git(
    repo,
    "commit",
    "-m",
    "Plant review defects in behavior-correct candidate",
  );
  const prepared = prepareWorktreeVerification({
    ...options,
    observedCommit: git(repo, "rev-parse", "HEAD"),
    directory: join(root, "candidate"),
  });
  const original = {
    workOrder,
    authorityEnvelope: compiled.program.authorityEnvelope,
    criteria,
    tests,
    surfaces: ["sum.mjs"],
  };
  return {
    root,
    repo,
    options,
    base,
    prepared,
    original,
    artifactIdentity: compiled.artifactIdentity,
    conventionsPath: conventions ? "CONVENTIONS.md" : null,
    scopeDefect,
  };
}

export function doubleResult(request, { minor = false } = {}) {
  if (!request.review) {
    const result = fixtureVerificationResult(
      request.capsule,
      request.episodeId,
      `result_${request.command.commandId}`,
    );
    return {
      ...result,
      findings: result.findings.map((finding) => ({
        ...finding,
        likelySurface: ["sum.mjs"],
      })),
    };
  }
  const findings = [];
  if (
    request.review.conventionsPath &&
    request.capsule.subject.files
      .find((file) => file.path === "sum.mjs")
      .contents.includes("TOTAL")
  )
    findings.push({
      class: "review",
      findingId: "naming",
      criterionId: "AC-signed",
      severity: "blocking",
      observed: "sum.mjs declares local variable TOTAL.",
      expected: conventionRule,
      reproductionSteps: ["Inspect the local variable declaration in sum.mjs."],
      evidenceRefs: ["conventions:CONVENTIONS.md", "file:sum.mjs", "diff"],
      likelySurface: ["sum.mjs"],
    });
  if (
    request.capsule.subject.diff.includes("Unrequested release announcement.")
  )
    findings.push({
      class: "review",
      findingId: "scope",
      criterionId: "AC-signed",
      severity: "blocking",
      observed: "README.md adds an unrequested release announcement.",
      expected: scopeRule,
      reproductionSteps: [
        "Compare the README.md hunk with the contract's allowed file.",
      ],
      evidenceRefs: ["contract", "diff", "file:README.md"],
      likelySurface: ["README.md"],
    });
  if (minor)
    for (const severity of ["should", "nit"])
      findings.push({
        class: "review",
        findingId: severity,
        criterionId: "AC-positive",
        severity,
        observed: "The addition expression could be written more directly.",
        expected: request.capsule.criteria[0].description,
        reproductionSteps: ["Read sum.mjs."],
        evidenceRefs: ["contract", "file:sum.mjs"],
        likelySurface: ["sum.mjs"],
      });
  return {
    kind: "review",
    subjectRevision: request.capsule.subject.revision,
    findings,
    envelope: {
      workOrderId: request.workOrder.workOrderId,
      episodeId: request.episodeId,
      resultId: `result_${request.command.commandId}`,
      status: "completed",
      summary: "Process-double independent code review.",
      requiresHuman: false,
    },
  };
}
export const doubleTransport = (onDispatch = () => {}, options = {}) => ({
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
        parseEvidenceResult(doubleResult(request, options), request),
      ),
      alive: () => false,
      kill() {},
    };
  },
});
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

export async function composeRepairDouble(fixture, review) {
  const route = routeReview(review, fixture.original, fixture.prepared.subject);
  const launches = [];
  const states = [];
  if (route.kind === "RepairAndReverify")
    for (const input of route.repairs) {
      assert.equal(input.derivation.kind, "derived");
      const host = new RepairHost({
        store: new WorkerStore(
          join(fixture.root, `repair-${input.reviewItem.finding.findingId}`),
        ),
        original: input.original,
        reviewItem: input.reviewItem,
        episodeNamespace: input.reviewItem.finding.findingId,
        baseline: fixture.base.subject,
        subject: fixture.prepared.subject,
        snapshotPath: fixture.prepared.snapshotPath,
        directory: join(fixture.root, "repair-children"),
        source: {
          authorityEvidence: [],
          artifactIdentity: fixture.artifactIdentity,
          worktreeParent: join(fixture.root, "trees"),
          launchpadCheckout: launchpad,
          model: "process-double",
          effort: "unknown",
          transport: {
            name: "fake",
            harnessVersion: "not-applicable",
            dispatch(request, now) {
              launches.push({ role: "repairer", episodeId: request.episodeId });
              writeFileSync(join(request.cwd, "sum.mjs"), repaired);
              git(request.cwd, "add", "sum.mjs");
              git(request.cwd, "commit", "-F", request.commitMessagePath);
              return {
                receipt: Promise.resolve({
                  commandId: request.command.commandId,
                  transport: "fake",
                  acceptedAt: now(),
                }),
                completed: Promise.resolve({
                  envelope: {
                    workOrderId: request.workOrder.workOrderId,
                    episodeId: request.episodeId,
                    status: "completed",
                    resultId: `result_${request.command.commandId}`,
                    summary: "Process-double convention repair.",
                    requiresHuman: false,
                    observedCommit: {
                      sha: git(request.cwd, "rev-parse", "HEAD"),
                      branch: git(
                        request.cwd,
                        "symbolic-ref",
                        "--short",
                        "HEAD",
                      ),
                    },
                    observedDenials: "unavailable",
                  },
                }),
                alive: () => false,
                kill() {},
              };
            },
          },
        },
        verifier: {
          model: "process-double",
          effort: "unknown",
          transport: doubleTransport((request) =>
            launches.push({ role: "verifier", episodeId: request.episodeId }),
          ),
        },
      });
      states.push(await host.run());
    }
  return { route, launches, states };
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
    fixture = createReviewFixture();
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
if (
  process.argv[1] &&
  realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const [action, ...args] = process.argv.slice(2);
  assert.equal(
    action,
    "live",
    "usage: fixture.mjs live claude|codex <model> <effort> <label> [verifier-harness]",
  );
  await live(...args);
}
