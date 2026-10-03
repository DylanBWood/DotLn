import { write as writeFixture } from "./lib/helpers.mjs";
import { spawnGit, execGit } from "./lib/git.mjs";
// WO-064: target publication over real source-change episodes, a local bare
// origin behind a GitHub URL and the gh stub. No network or vendor CLI.
import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import {
  chmodSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { appendEvent, decodeLog } from "@dotln/kernel";
import { WorkerStore } from "../packages/skeleton/dist/src/worker-store.js";
import { SOURCE_SECRET_SHAPES, SOURCE_URL_FORMS } from "@dotln/compiler";
import { SourceChangeHost } from "../packages/skeleton/dist/src/source-change-host.js";
import {
  runVerificationDemo,
  verificationFixtureCriteria,
} from "../packages/skeleton/dist/src/verification-demo.js";
import { FakeVerificationTransport } from "../packages/skeleton/dist/src/verification-fake.js";
import {
  createSourceFixture,
  fixtureGit,
  sourceFixtureOptions,
} from "../packages/skeleton/dist/test/source-change-fixture.js";
import { compileLoadout } from "@dotln/compiler";
import { compileRegisteredLoadout } from "./lib/authority-grants.mjs";
import {
  writerLoadout,
  readTargetPublishRequest,
  pushRepairedHead,
  disposeReviewThread,
  bindReviewRepairInput,
} from "./lib/target-publish.mjs";
import {
  resolveReviewComments,
  replayReviewItems,
} from "./lib/review-comment-loop.mjs";
import { observePullRequest } from "./lib/pull-request-observer.mjs";
import { RepairHost } from "../packages/skeleton/dist/src/repair-host.js";
import {
  repairTransport,
  disposeRepairFixture,
} from "../packages/skeleton/dist/test/repair-fixture.js";
import {
  snapshotCriteria,
  snapshotTests,
  snapshotContract,
  snapshotTransport,
} from "../packages/skeleton/dist/test/verification-worktree-fixture.js";
import { prepareWorktreeVerification } from "../packages/skeleton/dist/src/verification-worktree.js";
import {
  VerificationDriver,
  VerificationHost,
} from "../packages/skeleton/dist/src/verification-host.js";
import {
  parseEvidenceResult,
  compareBaseline,
} from "../packages/skeleton/dist/src/verification-protocol.js";
import { fixtureVerificationResult } from "../packages/skeleton/dist/src/verification-fake.js";
import { deliveryContractHash } from "./lib/github-body.mjs";
import { lintOutwardArtifact } from "./lib/outward-lint.mjs";

const repoRoot = realpathSync(fileURLToPath(new URL("..", import.meta.url)));
const cli = join(repoRoot, "scripts/worktree.mjs");
const pinned = join(repoRoot, "scripts/fixtures/target-publish");
const loadout = JSON.parse(readFileSync(join(pinned, "loadout.json"), "utf8"));
const vocabulary = JSON.parse(
  readFileSync(join(repoRoot, "docs/control/outward-vocabulary.json"), "utf8"),
);
const BRANCH = "fix/fixture-text";
const MESSAGE = "fix: record the synthetic worker line\n";
const GITHUB = "https://github.com/dotln-fixture/target.git";

const shared = realpathSync(
  mkdtempSync(join(tmpdir(), "dotln-target-publish-")),
);
// The shared stubs outlive every awaited test; a root after() hook runs early.
process.on("exit", () => rmSync(shared, { recursive: true, force: true }));
const bin = join(shared, "bin");
mkdirSync(bin);
const realGit = execFileSync("sh", ["-c", "command -v git"], {
  encoding: "utf8",
}).trim();
// Report configured origin URLs without insteadOf expansion, as the worktree
// shell fixture does, so the push reaches the bare origin behind a GitHub URL.
writeFileSync(
  join(bin, "git"),
  `#!/bin/bash
set -euo pipefail
real_git='${realGit}'
original_args=("$@")
if [[ "$1" == "-C" && "\${3:-}" == "-c" ]]; then
  target_root="$2"; shift 2
  while [[ "\${1:-}" == "-c" ]]; do shift 2; done
  set -- -C "$target_root" "$@"
fi
if [[ "$#" -eq 6 && "$1" == "-C" && "$3 $4 $5 $6" == "remote get-url --all origin" ]]; then
  exec "$real_git" -C "$2" config --get-all remote.origin.url
fi
if [[ "$#" -eq 7 && "$1" == "-C" && "$3 $4 $5 $6 $7" == "remote get-url --push --all origin" ]]; then
  urls="$("$real_git" -C "$2" config --get-all remote.origin.pushurl || true)"
  if [[ -z "$urls" ]]; then urls="$("$real_git" -C "$2" config --get-all remote.origin.url)"; fi
  printf "%s\\n" "$urls"
  exit 0
fi
exec "$real_git" "\${original_args[@]}"
`,
);
writeFileSync(
  join(bin, "gh"),
  `#!/usr/bin/env bash
set -euo pipefail
printf "%s\\n" "$*" >>"$DOTLN_GH_LOG"
if [[ -n "\${GH_REPO:-}" || -n "\${GH_HOST:-}" ]]; then printf "ambient GH target leaked\\n" >&2; exit 65; fi
if [[ "$*" == "--version" ]]; then printf "gh version fixture\\n"; exit 0; fi
if [[ "\${1:-} \${2:-}" == "auth status" ]]; then printf "authenticated fixture\\n"; exit 0; fi
if [[ "\${1:-} \${2:-}" == "api graphql" ]]; then exec "$DOTLN_NODE" "$DOTLN_GH_REPLAY" "$@"; fi
if [[ "\${1:-} \${2:-}" == "pr create" ]]; then
  body_file=""
  while (( "$#" )); do if [[ "$1" == "--body-file" ]]; then body_file="$2"; shift 2; else shift; fi; done
  cp "$body_file" "$DOTLN_GH_BODY"
  printf "https://github.com/dotln-fixture/target/pull/7\\n"
  exit 0
fi
printf "unexpected gh invocation: %s\\n" "$*" >&2
exit 64
`,
);
chmodSync(join(bin, "git"), 0o755);
chmodSync(join(bin, "gh"), 0o755);

const write = (path, text) => writeFixture("", path, text);
const grantFor = (repo, grantedBy) => ({
  ...structuredClone(loadout.authorityGrants[0]),
  grantId: `${grantedBy}.target-publish`,
  grantedBy,
  repo,
});

async function readinessEpisode(
  root,
  name,
  baseline,
  prepared,
  criteria,
  extra = {},
) {
  const store = new WorkerStore(join(root, name));
  store.acquire();
  const driver = new VerificationDriver(
    store,
    `ws_${name.replaceAll("-", "_")}`,
  );
  const clock = extra.baselineContext?.kind === "baseline" ? 2 : 20;
  const transport = {
    name: "fake",
    harnessVersion: "not-applicable",
    dispatch(request, now) {
      let result;
      const envelope = {
        workOrderId: request.workOrder.workOrderId,
        episodeId: request.episodeId,
        resultId: `result_${request.command.commandId}`,
        status: "completed",
        summary: "Deterministic readiness fixture.",
        requiresHuman: false,
      };
      if (request.baseline?.kind === "baseline")
        result = {
          kind: "baseline",
          subjectRevision: request.capsule.subject.revision,
          envelope,
        };
      else if (request.review)
        result = {
          kind: "review",
          subjectRevision: request.capsule.subject.revision,
          findings: [],
          envelope,
        };
      else {
        result = fixtureVerificationResult(
          request.capsule,
          request.episodeId,
          envelope.resultId,
        );
        if (request.baseline?.kind === "comparison")
          result.baselineFindings = compareBaseline(
            request.baseline,
            request.capsule,
          );
      }
      return {
        receipt: Promise.resolve({
          commandId: request.command.commandId,
          transport: "fake",
          acceptedAt: now(),
        }),
        completed: Promise.resolve(parseEvidenceResult(result, request)),
        alive: () => false,
        kill() {},
      };
    },
  };
  try {
    driver.record("VerificationOpened", clock, {
      baseline: baseline.subject,
      subject: prepared.subject,
      criteria,
      implementerEpisodeId: "ep_future_implementer",
      maxRepairs: 0,
      authority: {
        authorityEnvelopeId: `auth_${name}`,
        allowedEffects: ["verification.evaluate"],
        deniedEffects: ["repo.write", "network"],
        resourceLimits: { episodes: 2 },
        requiredEvidence: [],
        expiresAt: 100000,
        revocationEventTypes: [],
      },
      ...extra,
    });
    driver.persistNext(clock);
    const host = new VerificationHost({ driver, transport, now: () => clock });
    await host.run(prepared.snapshotPath, "process-double", "unknown");
    if (driver.state.next === "review") {
      driver.persistNext(clock);
      await host.run(prepared.snapshotPath, "process-double", "unknown");
    }
    return { state: driver.state, events: decodeLog(driver.log) };
  } finally {
    store.release();
  }
}

/** One launchpad root and one real source-change episode per scenario, so the
 * episode's compiled identity binds the same host registry publish reads. */
async function scenario(
  t,
  {
    grantedBy = "operator",
    review = false,
    signed = false,
    readiness = false,
  } = {},
) {
  if (readiness) review = true;
  const criteria = readiness
    ? snapshotCriteria.map((criterion) => ({
        ...criterion,
        requiredChecks: [...criterion.requiredChecks, "build", "lint"],
      }))
    : snapshotCriteria;
  const tests = readiness
    ? [
        ...snapshotTests,
        {
          criterionId: "AC-contract",
          checkId: "build",
          command: "node build-test.mjs",
        },
        {
          criterionId: "AC-contract",
          checkId: "lint",
          command: "node lint-test.mjs",
        },
      ]
    : snapshotTests;
  const contract = {
    ...snapshotContract,
    workOrderId: "WO-064",
    requiredEvidence: tests.map((test) => test.command),
  };
  const root = createSourceFixture();
  t.after(() => disposeRepairFixture(root));
  const target = join(root, "target");
  const origin = join(root, "origin.git");
  if (review) {
    writeFileSync(
      join(target, "fixture-test.mjs"),
      "import assert from 'node:assert/strict'; import {readFileSync} from 'node:fs'; assert.match(readFileSync('fixture.txt','utf8'), /changed by synthetic worker/);\n",
    );
    writeFileSync(
      join(target, "contract-test.mjs"),
      `import assert from 'node:assert/strict'; import {readFileSync} from 'node:fs'; assert.match(readFileSync('fixture.txt','utf8'), /${readiness ? "changed by synthetic worker" : "contract-satisfied"}/);\n`,
    );
    if (readiness) {
      writeFileSync(
        join(target, "CONVENTIONS.md"),
        "Preserve the existing plain-text fixture format.\n",
      );
      for (const kind of ["build", "lint"])
        writeFileSync(
          join(target, `${kind}-test.mjs`),
          "import assert from 'node:assert/strict'; import {readFileSync} from 'node:fs'; assert.equal(readFileSync('fixture.txt','utf8'), 'changed by synthetic worker\\n');\n",
        );
    }
    fixtureGit(target, "add", "-A");
    fixtureGit(target, "commit", "-m", "Name the synthetic repair contract");
    writeFileSync(
      join(root, "base.txt"),
      fixtureGit(target, "rev-parse", "HEAD"),
    );
  }
  const baseCommit = readFileSync(join(root, "base.txt"), "utf8");
  execGit(["init", "--quiet", "--bare", origin]);
  fixtureGit(target, "remote", "add", "origin", GITHUB);
  fixtureGit(target, "config", `url.${origin}.insteadOf`, GITHUB);
  fixtureGit(target, "push", "--quiet", origin, "main");
  // Publication pushes from a host lane that reads only the operator's global
  // and system configuration (WO-157), so the fixture's rewrite lives there.
  const globalConfig = join(root, "global.gitconfig");
  writeFileSync(
    globalConfig,
    `[url "${origin}"]\n\tinsteadOf = ${GITHUB}\n[user]\n\tname = Fixture\n\temail = fixture@example.invalid\n`,
  );

  const launchpad = join(root, "launchpad");
  mkdirSync(launchpad);
  fixtureGit(launchpad, "init", "--quiet", "--initial-branch=main");
  fixtureGit(launchpad, "commit", "--quiet", "--allow-empty", "-m", "fixture");
  write(
    join(launchpad, "docs/control/outward-vocabulary.json"),
    JSON.stringify(vocabulary),
  );
  const terms = (text) =>
    text === null
      ? rmSync(join(launchpad, "docs/control/local/terms.txt"), { force: true })
      : write(join(launchpad, "docs/control/local/terms.txt"), text);
  terms("zephyrcanary\n");
  const grant = grantedBy ? grantFor(target, grantedBy) : null;
  if (review && grant) {
    grant.effects.push("pr.thread.resolve");
    grant.operations.push("pr.thread.resolve");
  }
  write(
    join(launchpad, "packages/skeleton/loadouts/grants.json"),
    JSON.stringify(grantedBy === "operator" ? [grant] : []),
  );
  if (grantedBy === "host-policy")
    write(
      join(launchpad, "docs/control/local/authority-grants.json"),
      JSON.stringify([grant]),
    );

  const source = structuredClone({
    ...loadout,
    authorityGrants: grant ? [grant] : [],
  });
  if (review) Object.assign(source.activeMechanics[0].workOrder, contract);
  const environment = {
    environmentId: "wo064.fixture",
    version: 1,
    capabilities: [],
    repo: target,
    baseCommit,
  };
  // The order's program carries the grant; the writer never does.
  const compiled = compileRegisteredLoadout(source, environment, launchpad);
  assert.equal(compiled.ok, true, JSON.stringify(compiled.diagnostics));
  const writer = compileLoadout(writerLoadout(source), environment);
  assert.equal(writer.ok, true, JSON.stringify(writer.diagnostics));
  assert.equal(
    writer.program.authorityEnvelope.allowedEffects.includes("repo.push"),
    false,
  );
  const host = new SourceChangeHost({
    ...sourceFixtureOptions(root, () => 10, "commit", "codex"),
    workOrder: writer.program.workOrder,
    authorityEnvelope: writer.program.authorityEnvelope,
    authorityEvidence: [],
    artifactIdentity: writer.artifactIdentity,
    branch: BRANCH,
    surfaces: ["fixture.txt"],
    commitMessage: MESSAGE,
    ...(signed
      ? {
          transport: {
            name: "fake",
            harnessVersion: "signature-fixture",
            dispatch(request, now) {
              writeFileSync(
                join(request.cwd, "fixture.txt"),
                "changed by synthetic worker\n",
              );
              fixtureGit(request.cwd, "add", "fixture.txt");
              const tree = fixtureGit(request.cwd, "write-tree");
              const raw = `tree ${tree}\nparent ${baseCommit}\nauthor Fixture <fixture@example.invalid> 1 +0000\ncommitter Fixture <fixture@example.invalid> 1 +0000\ngpgsig -----BEGIN PGP SIGNATURE-----\n fixture\n -----END PGP SIGNATURE-----\n\n${MESSAGE}`;
              const commit = execGit(
                [
                  "-C",
                  request.cwd,
                  "hash-object",
                  "-t",
                  "commit",
                  "-w",
                  "--stdin",
                ],
                { input: raw, encoding: "utf8" },
              ).trim();
              fixtureGit(request.cwd, "update-ref", "HEAD", commit);
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
                    resultId: `result_${request.command.commandId}`,
                    status: "completed",
                    summary: "Signed fixture commit",
                    requiresHuman: false,
                    observedCommit: { sha: commit, branch: BRANCH },
                    observedDenials: "unavailable",
                  },
                }),
                alive: () => false,
                kill() {},
              };
            },
          },
        }
      : {}),
  });
  const baseline = review
    ? prepareWorktreeVerification({
        worktree: target,
        baseCommit,
        observedCommit: baseCommit,
        repo: "review-fixture",
        contract,
        criteria,
        tests,
        directory: join(root, "baseline"),
      })
    : null;
  const baselineEpisode = readiness
    ? await readinessEpisode(
        root,
        "readiness-baseline",
        baseline,
        baseline,
        criteria,
        {
          baselineContext: {
            kind: "baseline",
            story: {
              kind: "defect",
              storyId: "fixture-change",
              tests: [
                {
                  criterionId: "AC-contract",
                  checkId: "superficial",
                  command: "node fixture-test.mjs",
                  expectedExitCode: 1,
                },
              ],
            },
          },
        },
      )
    : null;
  const result = await host.run();
  assert.equal(result.status, "observed", JSON.stringify(result));
  const prepared = review
    ? prepareWorktreeVerification({
        worktree: host.tree.path,
        baseCommit,
        observedCommit: result.observation.commit,
        repo: "review-fixture",
        contract,
        criteria,
        tests,
        directory: join(root, "review-snapshot"),
      })
    : null;
  host.finish();
  if (readiness) {
    const implementationEvents = decodeLog(
      readFileSync(join(root, "store/events.jsonl"), "utf8"),
    );
    const implementerEpisodeId = implementationEvents.find(
      (event) => event.type === "WorkerAttemptStarted",
    ).payload.workerEpisodeId;
    const verified = await readinessEpisode(
      root,
      "readiness-verification",
      baseline,
      prepared,
      criteria,
      {
        implementerEpisodeId,
        reviewConventionsPath: "CONVENTIONS.md",
        baselineContext: {
          kind: "comparison",
          witness: baselineEpisode.state.baselineWitness,
        },
      },
    );
    assert.equal(verified.state.next, "reviewed");
    const evidenceFor = (check) =>
      verified.state.evidence
        .filter((entry) => entry.checkId === check)
        .map((entry) => entry.evidenceId);
    writeFileSync(
      join(root, "store/delivery-preparation.json"),
      JSON.stringify({
        schemaVersion: 1,
        workOrderId: "WO-064",
        subjectRevision: result.observation.commit,
        contractHash: deliveryContractHash(writer.program.workOrder),
        diffHash: result.observation.diffHash,
        unresolvedMaterialAmbiguities: [],
        checks: {
          tests: evidenceFor("superficial"),
          build: evidenceFor("build"),
          lint: evidenceFor("lint"),
        },
        monitoring: {
          owner: "fixture-resident",
          repositoryId: "github.com/dotln-fixture/target",
          headRevision: result.observation.commit,
          command: "worktree resolve-pr",
          ciFailure: "classify-before-repair",
          reviewComments: "triage-by-type",
          sourceDrift: "stop",
          terminalState: "human-controlled",
        },
      }),
    );
  }
  write(join(root, "loadout.json"), JSON.stringify(source));
  const request = {
    schemaVersion: 1,
    loadout: "loadout.json",
    environment,
    store: "store",
    baseBranch: "main",
    repositoryId: "github.com/dotln-fixture/target",
    ...(readiness
      ? {
          baselineStore: "readiness-baseline",
          verificationStore: "readiness-verification",
        }
      : {}),
  };
  const requestPath = join(root, "request.json");
  write(requestPath, JSON.stringify(request));
  const ghLog = join(root, "gh.log");
  const body = join(root, "published-body.md");
  const publish = (...flags) =>
    spawnSync(
      process.execPath,
      [cli, "publish", "WO-064", "--target", requestPath, ...flags],
      {
        cwd: root,
        encoding: "utf8",
        env: {
          ...process.env,
          PATH: `${bin}:${process.env.PATH}`,
          DOTLN_LAUNCHPAD: launchpad,
          DOTLN_GH_LOG: ghLog,
          DOTLN_GH_BODY: body,
          GIT_CONFIG_GLOBAL: globalConfig,
          GH_REPO: "wrong/target",
          GH_HOST: "wrong.example",
        },
      },
    );
  const remoteBranch = () =>
    spawnGit(
      [
        "--git-dir",
        origin,
        "rev-parse",
        "--verify",
        "--quiet",
        `refs/heads/${BRANCH}`,
      ],
      { encoding: "utf8" },
    ).stdout.trim();
  const ghCalls = () =>
    existsSync(ghLog) ? readFileSync(ghLog, "utf8").trim().split("\n") : [];
  return {
    root,
    launchpad,
    host,
    baseline,
    prepared,
    grant,
    source,
    environment,
    writer,
    target,
    baseCommit,
    observation: result.observation,
    request,
    requestPath,
    terms,
    publish,
    remoteBranch,
    ghCalls,
    body,
    publication: join(root, "store/publication"),
  };
}

const refusedBeforeRemote = (subject, run, pattern) => {
  assert.equal(run.status, 1, run.stdout);
  assert.match(run.stderr, pattern);
  assert.doesNotMatch(run.stderr, /\n\s+at /u, "no stack trace");
  assert.deepEqual(subject.ghCalls(), []);
  assert.equal(subject.remoteBranch(), "");
  assert.equal(existsSync(subject.publication), false);
};

await test("WO-182 AC3: readiness refusal precedes every remote call; operator publication shows the same gaps", async (t) => {
  const subject = await scenario(t);
  refusedBeforeRemote(
    subject,
    subject.publish("--require-deliverable-ready"),
    /deliverable-ready evidence absent: .*Reproduced baseline.*Independent verification and review/u,
  );
  const published = subject.publish();
  assert.equal(published.status, 0, published.stderr);
  const body = readFileSync(subject.body, "utf8");
  assert.match(body, /## Deliverable-ready\n\nDeliverable-ready: not ready;/u);
  assert.match(body, /\| Reproduced baseline \| absent \| BaselineWitnessed/u);
  assert.match(
    body,
    /\| Independent verification and review \| absent \| .*ReviewCompleted/u,
  );
  assert.equal(subject.ghCalls().length, 3);
});

await test(
  "WO-182 AC3: one absent item names its gap; the same store publishes a proposal without the flag",
  { skip: process.platform !== "darwin" },
  async (t) => {
    const subject = await scenario(t, { readiness: true });
    const file = join(subject.root, "store/delivery-preparation.json");
    const preparation = JSON.parse(readFileSync(file, "utf8"));
    writeFileSync(
      file,
      JSON.stringify({
        ...preparation,
        unresolvedMaterialAmbiguities: ["unanswered-choice"],
      }),
    );
    const run = subject.publish("--require-deliverable-ready");
    refusedBeforeRemote(
      subject,
      run,
      /deliverable-ready evidence absent: No unresolved material ambiguity\s*$/u,
    );
    const published = subject.publish();
    assert.equal(published.status, 0, published.stderr);
    const body = readFileSync(subject.body, "utf8");
    assert.match(body, /Deliverable-ready: not ready; 1 item absent\./u);
    assert.equal(body.match(/\| evidenced \|/gu).length, 12);
    assert.match(
      body,
      /\| Visual claims visually inspected \| not-applicable \|/u,
    );
    assert.equal(subject.ghCalls().length, 3);
    const again = subject.publish();
    assert.equal(again.status, 0, again.stderr);
    assert.equal(subject.ghCalls().length, 3);
  },
);

await test(
  "WO-182 current replayed baseline, verification and review permit required publication",
  { skip: process.platform !== "darwin" },
  async (t) => {
    const subject = await scenario(t, { readiness: true });
    const published = subject.publish("--require-deliverable-ready");
    assert.equal(published.status, 0, published.stderr);
    const body = readFileSync(subject.body, "utf8");
    assert.match(
      body,
      /Deliverable-ready: ready; every applicable item is evidenced\./u,
    );
    assert.equal(body.match(/\| evidenced \|/gu).length, 13);
    assert.match(
      body,
      /\| Visual claims visually inspected \| not-applicable \|/u,
    );
    assert.equal(subject.ghCalls().length, 3);
  },
);

await test(
  "WO-182 stale preparation and forged baseline/review events cannot bypass readiness",
  { skip: process.platform !== "darwin" },
  async (t) => {
    const subject = await scenario(t, { readiness: true });
    const file = join(subject.root, "store/delivery-preparation.json");
    const original = readFileSync(file, "utf8");
    writeFileSync(
      file,
      JSON.stringify({
        ...JSON.parse(original),
        subjectRevision: subject.baseCommit,
      }),
    );
    refusedBeforeRemote(
      subject,
      subject.publish("--require-deliverable-ready"),
      /deliverable-ready evidence absent: .*No unresolved material ambiguity.*Tests\/build\/lint.*Monitored loop/u,
    );
    writeFileSync(file, original);
    for (const [store, type] of [
      ["readiness-baseline", "BaselineWitnessed"],
      ["readiness-verification", "ReviewCompleted"],
    ]) {
      const log = join(subject.root, store, "events.jsonl");
      const bytes = readFileSync(log, "utf8");
      const events = decodeLog(bytes);
      const event = events.find((entry) => entry.type === type);
      writeFileSync(
        log,
        bytes.replace(
          JSON.stringify(event),
          JSON.stringify({ ...event, actorId: "implementer" }),
        ),
      );
      refusedBeforeRemote(
        subject,
        subject.publish("--require-deliverable-ready"),
        /target publish refused: (?:the verification store cannot be replayed|deliverable-ready evidence absent)/u,
      );
      writeFileSync(log, bytes);
    }
    writeFileSync(
      file,
      JSON.stringify({ ...JSON.parse(original), ready: true }),
    );
    refusedBeforeRemote(
      subject,
      subject.publish("--require-deliverable-ready"),
      /invalid typed preparation shape/u,
    );
  },
);

await test("WO-064 AC1: publish refuses without an operator grant before any remote call", async (t) => {
  const subject = await scenario(t, { grantedBy: null });
  refusedBeforeRemote(
    subject,
    subject.publish(),
    /target publish refused: repo\.push is not granted in effects and operations by an authority grant with operator provenance/u,
  );
  // A changed loadout cannot supply authority for the earlier change.
  const loadoutPath = join(subject.root, "loadout.json");
  const edited = JSON.parse(readFileSync(loadoutPath, "utf8"));
  edited.activeMechanics[0].workOrder.nonGoals = ["Everything else"];
  writeFileSync(loadoutPath, JSON.stringify(edited));
  refusedBeforeRemote(
    subject,
    subject.publish(),
    /target publish refused: the episode was not dispatched from this loadout's writer compilation/u,
  );
});

await test("WO-064 AC1: a host-policy grant is not operator provenance", async (t) => {
  const subject = await scenario(t, { grantedBy: "host-policy" });
  refusedBeforeRemote(
    subject,
    subject.publish(),
    /target publish refused: repo\.push is not granted .* with operator provenance/u,
  );
});

await test("WO-064 AC1/AC2: lint and target refusals name their rule; the granted publish pushes and opens the pull request with the pinned body", async (t) => {
  const subject = await scenario(t);
  const { target, observation, baseCommit } = subject;

  subject.terms("baseline\n");
  refusedBeforeRemote(
    subject,
    subject.publish(),
    /target publish refused: outward lint: pr-body refused: vocabulary\.local \(line 3\)/mu,
  );
  subject.terms(null);
  refusedBeforeRemote(
    subject,
    subject.publish(),
    /outward lint: branch unavailable: local-terms list absent; commit unavailable: local-terms list absent; pr-title unavailable: local-terms list absent; pr-body unavailable: local-terms list absent/u,
  );
  subject.terms("zephyrcanary\n");

  fixtureGit(target, "update-ref", `refs/heads/${BRANCH}`, baseCommit);
  refusedBeforeRemote(
    subject,
    subject.publish(),
    /target publish refused: branch fix\/fixture-text no longer names the observed commit/u,
  );
  fixtureGit(target, "update-ref", `refs/heads/${BRANCH}`, observation.commit);

  // A current, replayable matrix for another revision is not this head's.
  const verification = join(subject.root, "verification");
  const other = await runVerificationDemo({
    directory: verification,
    transport: new FakeVerificationTransport(),
    model: "synthetic",
    effort: "unknown",
  });
  assert.notEqual(other.matrix.subjectRevision, observation.commit);
  writeFileSync(
    subject.requestPath,
    JSON.stringify({ ...subject.request, verificationStore: "verification" }),
  );
  refusedBeforeRemote(
    subject,
    subject.publish(),
    /target publish refused: the verification store has no single acceptance matrix for the published head/u,
  );
  writeFileSync(subject.requestPath, JSON.stringify(subject.request));

  const configBefore = readFileSync(join(target, ".git/config"), "utf8");
  const published = subject.publish();
  assert.equal(published.status, 0, published.stderr);
  assert.equal(
    published.stdout,
    `Pushed ${BRANCH} at ${observation.commit} and opened pull request #7 on github.com/dotln-fixture/target.\n`,
  );
  const calls = subject.ghCalls();
  assert.deepEqual(calls.slice(0, 2), [
    "--version",
    "auth status --hostname github.com",
  ]);
  assert.match(
    calls[2],
    /^pr create --repo github\.com\/dotln-fixture\/target --head fix\/fixture-text --base main --title fix: record the synthetic worker line --body-file \S+\/PR\.md$/u,
  );
  assert.equal(calls.length, 3);
  assert.equal(subject.remoteBranch(), observation.commit);
  assert.equal(
    execGit(["--git-dir", join(subject.root, "origin.git"), "tag", "--list"], {
      encoding: "utf8",
    }),
    "",
  );
  assert.equal(readFileSync(join(target, ".git/config"), "utf8"), configBefore);

  const body = readFileSync(subject.body, "utf8");
  assert.equal(
    `${body.split("## Deliverable-ready")[0].trimEnd()}\n`,
    readFileSync(join(pinned, "body.md"), "utf8")
      .split("## Deliverable-ready")[0]
      .replaceAll("<base>", baseCommit)
      .replaceAll("<head>", observation.commit),
  );
  // AC2: no launchpad vocabulary, no DotLn or store path, no worker narrative.
  assert.equal(
    lintOutwardArtifact({
      kind: "pr-body",
      text: body,
      vocabulary,
      localTerms: { status: "present" },
    }).status,
    "pass",
  );
  for (const forbidden of [
    /dotln/iu,
    /launchpad/iu,
    /\b(?:docs|scripts|packages)\//u,
    /\.dotln|\.claude/u,
    new RegExp(subject.root.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&"), "u"),
    /node fixture-test\.mjs/u,
    /Synthetic source change\./u,
    /The synthetic change is complete\./u,
  ])
    assert.doesNotMatch(body, forbidden);

  const events = decodeLog(
    readFileSync(join(subject.publication, "events.jsonl"), "utf8"),
  );
  assert.equal(events.length, 1);
  assert.equal(events[0].type, "PullRequestOpened");
  assert.equal(events[0].actorId, "target-publish-host");
  assert.deepEqual(events[0].payload, {
    repositoryId: "github.com/dotln-fixture/target",
    number: 7,
    headSha: observation.commit,
  });

  const again = subject.publish();
  assert.equal(again.status, 0, again.stderr);
  assert.match(
    again.stdout,
    /^Already published fix\/fixture-text at [0-9a-f]{40}: pull request #7 on github\.com\/dotln-fixture\/target; nothing pushed\.$/mu,
  );
  assert.equal(subject.ghCalls().length, 3);
  assert.equal(
    decodeLog(readFileSync(join(subject.publication, "events.jsonl"), "utf8"))
      .length,
    1,
  );
  process.stdout.write(
    `target publish gh stub transcript (temporary path normalized):\n${calls
      .map((line) =>
        line.replace(
          /--body-file \S+\/PR\.md$/u,
          "--body-file <generated-PR-body>",
        ),
      )
      .join("\n")}\n`,
  );
});

await test("WO-064 AC1 (VER-001 F1): a same-head acceptance matrix must verify this WorkOrder's criteria", async (t) => {
  const subject = await scenario(t);
  const { commit } = subject.observation;
  const demo = join(subject.root, "demo");
  await runVerificationDemo({
    directory: demo,
    transport: new FakeVerificationTransport(),
    model: "synthetic",
    effort: "unknown",
  });
  // The real host's opening event, moved to the published head. An opened
  // workstream replays with incomplete rows; rewriting any later event fails
  // replay as compilation drift, so no fixture verdict is forged.
  const lines = readFileSync(join(demo, "events.jsonl"), "utf8")
    .split("\n")
    .filter(Boolean);
  const end = lines.findIndex(
    (line) => JSON.parse(line).type === "VerificationOpened",
  );
  const opened = lines
    .slice(0, end + 1)
    .join("\n")
    .replaceAll(JSON.parse(lines[end]).payload.subject.revision, commit);
  const store = (name, renamed = []) => {
    let log = opened;
    renamed.forEach((description, index) => {
      log = log.replaceAll(
        JSON.stringify(verificationFixtureCriteria[index].description),
        JSON.stringify(description),
      );
    });
    write(join(subject.root, name, "events.jsonl"), `${log}\n`);
    writeFileSync(
      subject.requestPath,
      JSON.stringify({ ...subject.request, verificationStore: name }),
    );
  };

  store("unrelated");
  refusedBeforeRemote(
    subject,
    subject.publish(),
    /target publish refused: the acceptance matrix for the published head does not verify this WorkOrder's acceptance criteria/u,
  );

  // The same criteria in another order publish in the contract's order.
  const criteria = loadout.activeMechanics[0].workOrder.acceptanceCriteria;
  store("matching", [criteria[2], criteria[0], criteria[1]]);
  const published = subject.publish();
  assert.equal(published.status, 0, published.stderr);
  const body = readFileSync(subject.body, "utf8");
  assert.ok(
    body.includes(
      `| Criterion | Status |
| --- | --- |
| Only fixture.txt changes | incomplete |
| The focused fixture test passes after the change | incomplete |
| Exactly one commit above the base | incomplete |

Independent verification: acceptance matrix for ${commit}: 0 verified, 0 failed, 0 stale, 3 incomplete.
`,
    ),
    body,
  );
  assert.equal(
    lintOutwardArtifact({
      kind: "pr-body",
      text: body,
      vocabulary,
      localTerms: { status: "present" },
    }).status,
    "pass",
  );
  assert.equal(subject.remoteBranch(), commit);
});

await test("WO-157: publication runs no hook or repository configuration the target holds", async (t) => {
  const subject = await scenario(t);
  const sentinel = join(subject.root, "target-hook-ran");
  for (const hook of ["pre-push", "reference-transaction"]) {
    const path = join(subject.target, ".git/hooks", hook);
    write(path, `#!/bin/sh\necho ${hook} >> '${sentinel}'\n`);
    chmodSync(path, 0o755);
  }
  // The planted hooks are live for an ordinary push from the target.
  execGit(
    [
      "-C",
      subject.target,
      "push",
      "--quiet",
      "origin",
      "HEAD:refs/heads/probe",
    ],
    { stdio: "pipe" },
  );
  assert.match(readFileSync(sentinel, "utf8"), /pre-push/u);
  rmSync(sentinel);
  // Repository configuration a writer could also plant runs code during a
  // push from the target: a receive-pack override for the origin remote, an
  // SSH command, and an include of a file the writer controls.
  const logger = (label) => {
    const path = join(subject.root, `${label}.sh`);
    write(
      path,
      `#!/bin/sh\necho ${label} >> '${sentinel}'\nexec git-receive-pack "$@"\n`,
    );
    chmodSync(path, 0o755);
    return path;
  };
  execGit([
    "-C",
    subject.target,
    "config",
    "remote.origin.receivepack",
    logger("receivepack"),
  ]);
  execGit([
    "-C",
    subject.target,
    "config",
    "core.sshCommand",
    logger("sshcommand"),
  ]);
  const included = join(subject.root, "included.gitconfig");
  write(included, `[core]\n\tfsmonitor = ${logger("fsmonitor")}\n`);
  execGit(["-C", subject.target, "config", "include.path", included]);
  const published = subject.publish();
  assert.equal(published.status, 0, published.stderr);
  assert.equal(subject.remoteBranch(), subject.observation.commit);
  assert.equal(
    existsSync(sentinel),
    false,
    existsSync(sentinel) ? readFileSync(sentinel, "utf8") : "",
  );
});

await test("WO-064: the CLI names its usage for a malformed target request", () => {
  const run = spawnSync(
    process.execPath,
    [cli, "publish", "WO-064", "--target"],
    {
      encoding: "utf8",
    },
  );
  assert.equal(run.status, 1);
  assert.match(
    run.stderr,
    /usage: worktree publish WO-NNN --target <target-publish-request\.json>/u,
  );
});

await test("WO-066 AC5: a signed-header commit runs planted gpg on ordinary log, never publication; request binds origin before remote calls", async (t) => {
  const subject = await scenario(t, { signed: true });
  const sentinel = join(subject.root, "signature-program-ran");
  const program = join(subject.root, "gpg-probe.sh");
  writeFileSync(program, `#!/bin/sh\necho ran >> '${sentinel}'\nexit 1\n`);
  chmodSync(program, 0o755);
  fixtureGit(subject.target, "config", "log.showSignature", "true");
  fixtureGit(subject.target, "config", "gpg.program", program);
  execGit(
    [
      "-C",
      subject.target,
      "log",
      "-1",
      "--format=%B",
      subject.observation.commit,
    ],
    { stdio: "pipe" },
  );
  assert.equal(readFileSync(sentinel, "utf8"), "ran\n");
  rmSync(sentinel);
  fixtureGit(
    subject.target,
    "config",
    "remote.origin.url",
    "https://github.com/dotln-fixture/other.git",
  );
  refusedBeforeRemote(
    subject,
    subject.publish(),
    /origin's configured push URL names .*other, but its resolved target is .*target/,
  );
  fixtureGit(subject.target, "config", "remote.origin.url", GITHUB);
  const published = subject.publish();
  assert.equal(published.status, 0, published.stderr);
  assert.equal(existsSync(sentinel), false);
  assert.equal(subject.remoteBranch(), subject.observation.commit);
  process.stdout.write(
    "WO-066 signature positive control ran; guarded publication did not run it; changed repository refused before gh or push.\n",
  );
});

// WO-065: recorded, synthetic GraphQL response shapes, replayed by the same
// gh boundary. The fixture never talks to GitHub and never executes a mutation.
const observationFixture = JSON.parse(
  readFileSync(join(pinned, "observation.json"), "utf8"),
);
const replay = join(shared, "replay.mjs");
writeFileSync(
  replay,
  `
import { readFileSync } from 'node:fs';
const args = process.argv.slice(2);
const vars = {};
for (let i = 2; i < args.length; i += 2) {
  if (args[i] === '--hostname') { if (args[i + 1] !== 'github.com') process.exit(64); continue; }
  if (!['-f', '-F'].includes(args[i])) process.exit(64);
  const field = args[i + 1], equal = field.indexOf('=');
  vars[field.slice(0, equal)] = field.slice(equal + 1);
}
const operation = /^query (Dotln[A-Za-z]+)\\(/.exec(vars.query)?.[1];
if (!operation || /mutation/.test(vars.query)) process.exit(64);
if (/author/.test(vars.query) && !/author \\{ __typename login \\}/.test(vars.query)) process.exit(65);
if (operation !== 'DotlnThreadComments' && (vars.owner !== 'dotln-fixture' || vars.name !== 'target')) process.exit(64);
const fixture = JSON.parse(readFileSync(process.env.DOTLN_GH_RESPONSES, 'utf8'));
const response = fixture[operation]?.[vars.cursor ?? 'first'];
if (!response) { process.stderr.write('missing response'); process.exit(66); }
if (response.exit) { process.stderr.write(response.stderr); process.exit(response.exit); }
process.stdout.write(response.raw ?? JSON.stringify(response));
`,
);
function observationScenario(
  t,
  fixture = observationFixture,
  repositoryId = "github.com/dotln-fixture/target",
) {
  const root = mkdtempSync(join(shared, "observe-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const store = join(root, "store");
  const publication = new WorkerStore(join(store, "publication"));
  publication.acquire();
  const { event: opened } = appendEvent("", {
    schemaVersion: 1,
    type: "PullRequestOpened",
    occurredAt: 1,
    actorId: "target-publish-host",
    workstreamId: "fixture",
    correlationId: "cmd_fixture",
    payload: {
      repositoryId,
      number: 7,
      headSha: "a".repeat(40),
    },
  });
  publication.append(opened);
  publication.release();
  const responsePath = join(root, "responses.json"),
    ghLog = join(root, "gh.log");
  const set = (value) => writeFileSync(responsePath, JSON.stringify(value));
  set(fixture);
  const run = (number = "7", extra = []) =>
    spawnSync(
      process.execPath,
      [cli, "observe-pr", "--store", store, "--number", number, ...extra],
      {
        cwd: repoRoot,
        encoding: "utf8",
        env: {
          ...process.env,
          PATH: `${bin}:${process.env.PATH}`,
          DOTLN_NODE: process.execPath,
          DOTLN_GH_REPLAY: replay,
          DOTLN_GH_RESPONSES: responsePath,
          DOTLN_GH_LOG: ghLog,
          GH_REPO: "wrong/target",
          GH_HOST: "wrong.example",
        },
      },
    );
  return {
    root,
    store,
    publication,
    opened,
    set,
    run,
    events: () => decodeLog(publication.read()),
    calls: () => (existsSync(ghLog) ? readFileSync(ghLog, "utf8") : ""),
  };
}
const pullOf = (fixture, operation, cursor = "first") =>
  fixture[operation][cursor].data.repository.pullRequest;
const checksOf = (fixture) =>
  fixture.DotlnChecks.first.data.repository.object.statusCheckRollup.contexts;
const pageOf = (nodes, hasNextPage = false, endCursor = null) => ({
  nodes,
  pageInfo: { hasNextPage, endCursor },
});
const fixtureComment = (id, body) => ({
  id,
  body,
  author: { __typename: "User", login: "reviewer" },
});
const succeeded = (result) => assert.equal(result.status, 0, result.stderr);

await test("WO-065 AC1: typed classes, correlation, roles and latest normalized-state dedup through the CLI", (t) => {
  const subject = observationScenario(t);
  succeeded(subject.run());
  assert.equal(subject.events().length, 2);
  const observed = subject.events()[1];
  assert.equal(observed.type, "PullRequestStateObserved");
  assert.equal(observed.actorId, "pull-request-observer");
  assert.equal(observed.causationId, subject.opened.eventId);
  assert.equal(observed.correlationId, subject.opened.correlationId);
  assert.equal(observed.workstreamId, subject.opened.workstreamId);
  assert.deepEqual(observed.payload.checks, [
    { name: "build", state: "IN_PROGRESS" },
    { name: "lint", state: "SUCCESS" },
    { name: "unit", state: "FAILURE" },
  ]);
  const byId = Object.fromEntries(
    observed.payload.comments.map((item) => [item.id, item]),
  );
  assert.deepEqual(byId["ci:CR_1"], {
    id: "ci:CR_1",
    role: "automation",
    resolved: false,
    class: "ci-failure",
    text: "unit",
  });
  assert.equal(byId.PRRC_1.class, "automated-review");
  assert.equal(byId.PRRC_1.role, "automation");
  assert.equal(byId.PRRC_2.class, "human-review");
  assert.equal(byId.PRRC_3.class, "resolved");
  assert.equal(byId.PRRC_3.role, "automation");
  assert.equal(byId.PRRC_3.resolved, true);
  assert.equal(byId.IC_1.role, "reporter");
  assert.equal(byId.PRR_1.role, "reviewer");
  assert.equal(byId.PRR_2, undefined);
  assert.equal(byId.PRRC_1.path, "fixture.txt");
  assert.equal(byId.PRRC_1.line, 1);
  const logBefore = subject.publication.read();
  succeeded(subject.run());
  assert.equal(subject.publication.read(), logBefore);
  const reordered = structuredClone(observationFixture);
  checksOf(reordered).nodes.reverse();
  pullOf(reordered, "DotlnThreads").reviewThreads.nodes.reverse();
  subject.set(reordered);
  succeeded(subject.run());
  assert.equal(subject.publication.read(), logBefore);
  const newHead = JSON.parse(
    JSON.stringify(observationFixture).replaceAll(
      "a".repeat(40),
      "b".repeat(40),
    ),
  );
  subject.set(newHead);
  succeeded(subject.run());
  assert.equal(subject.events().length, 3);
  subject.set(observationFixture);
  succeeded(subject.run());
  assert.equal(subject.events().length, 4, "A to B to A must record A again");
  const changed = structuredClone(observationFixture);
  pullOf(changed, "DotlnComments").comments.nodes.push(
    fixtureComment("IC_2", "New comment"),
  );
  subject.set(changed);
  succeeded(subject.run());
  assert.equal(subject.events().length, 5);
  pullOf(changed, "DotlnComments").comments.nodes[1].body = "Edited comment";
  subject.set(changed);
  succeeded(subject.run());
  assert.equal(subject.events().length, 6);
  pullOf(changed, "DotlnThreads").reviewThreads.nodes[0].isResolved = true;
  subject.set(changed);
  succeeded(subject.run());
  assert.equal(subject.events().length, 7);
  assert.doesNotMatch(subject.calls(), /pr create|mutation|auth status/);
});

await test("WO-065 F1: actor types decide roles on every comment connection and pagination path", (t) => {
  const fixture = structuredClone(observationFixture);
  for (const operation of [
    "DotlnPullRequest",
    "DotlnComments",
    "DotlnReviews",
    "DotlnThreads",
  ])
    pullOf(fixture, operation).author = {
      __typename: "Bot",
      login: "fixture-agent",
    };
  const nodes = pullOf(fixture, "DotlnComments").comments.nodes;
  for (const type of [
    "Bot",
    "User",
    "Mannequin",
    "Organization",
    "EnterpriseUserAccount",
  ])
    nodes.push({
      ...fixtureComment(`IC_${type}`, "Review this."),
      author: { __typename: type, login: "fixture-agent" },
    });
  pullOf(fixture, "DotlnReviews").reviews.nodes[0].author = {
    __typename: "Bot",
    login: "review-agent",
  };
  const thread = pullOf(fixture, "DotlnThreads").reviewThreads.nodes[0];
  const more = thread.comments.nodes.pop();
  more.author = { __typename: "Bot", login: "paged-agent" };
  thread.comments.pageInfo = { hasNextPage: true, endCursor: "thread-second" };
  fixture.DotlnThreadComments = {
    "thread-second": {
      data: {
        node: { id: thread.id, isResolved: false, comments: pageOf([more]) },
      },
    },
  };
  const subject = observationScenario(t, fixture);
  succeeded(subject.run());
  const byId = Object.fromEntries(
    subject.events()[1].payload.comments.map((item) => [item.id, item]),
  );
  for (const id of ["IC_Bot", "PRR_1", "PRRC_1", "PRRC_2"])
    assert.deepEqual(
      [byId[id].role, byId[id].class],
      ["automation", "automated-review"],
      id,
    );
  for (const type of [
    "User",
    "Mannequin",
    "Organization",
    "EnterpriseUserAccount",
  ])
    assert.deepEqual(
      [byId[`IC_${type}`].role, byId[`IC_${type}`].class],
      ["reviewer", "human-review"],
      type,
    );
  assert.equal(byId.PRRC_3.class, "resolved");
});

await test("WO-065 AC2: every declared secret and URL form is refused without persisted text; safe peers survive", (t) => {
  const declared = JSON.parse(
    readFileSync(
      join(repoRoot, "packages/compiler/fixtures/wo060-source-bundles.json"),
      "utf8",
    ),
  );
  assert.deepEqual(
    declared.screened.map((item) => item.case).sort(),
    [
      ...SOURCE_SECRET_SHAPES.map((item) => item.shapeId),
      ...SOURCE_URL_FORMS.map((item) => item.formId),
    ].sort(),
  );
  const fixture = structuredClone(observationFixture);
  const planted = declared.screened.map((item, index) => ({
    item,
    id: `IC_secret_${index}`,
    body: `é ${item.matched} tail`,
  }));
  pullOf(fixture, "DotlnComments").comments.nodes.push(
    ...planted.map(({ id, body }) => fixtureComment(id, body)),
  );
  const subject = observationScenario(t, fixture);
  succeeded(subject.run());
  const comments = subject.events()[1].payload.comments;
  for (const { item, id, body } of planted) {
    const result = comments.find((entry) => entry.id === id);
    assert.equal(result.text, undefined, item.case);
    assert.deepEqual(result.refused, {
      shape: item.case,
      path: `$.data.repository.pullRequest.comments.nodes[${planted.findIndex((entry) => entry.id === id) + 1}].body`,
      span: {
        entryId: "comment",
        start: 3,
        end: 3 + Buffer.byteLength(item.matched),
      },
    });
    assert.equal(
      subject.publication.read().includes(item.matched),
      false,
      item.case,
    );
    assert.equal(subject.publication.read().includes(body), false);
  }
  assert.match(
    comments.find((entry) => entry.id === "IC_1").text,
    /https:\/\/github.com/,
  );
  assert.equal(comments.find((entry) => entry.id === "PRRC_2").text, "Agreed.");
  // No response files or refusal body hashes inside the store.
  assert.deepEqual(
    execFileSync("find", [subject.store, "-type", "f"], { encoding: "utf8" })
      .trim()
      .split("\n"),
    [subject.publication.logPath],
  );
});

await test("WO-065 AC1/AC2: all connections and nested thread comments paginate", (t) => {
  const fixture = structuredClone(observationFixture);
  for (const [operation, field] of [
    ["DotlnComments", "comments"],
    ["DotlnReviews", "reviews"],
    ["DotlnThreads", "reviewThreads"],
  ]) {
    fixture[operation].second = structuredClone(fixture[operation].first);
    const connection = pullOf(fixture, operation)[field];
    pullOf(fixture, operation, "second")[field] = pageOf(
      connection.nodes.slice(1),
    );
    connection.nodes = connection.nodes.slice(0, 1);
    connection.pageInfo = { hasNextPage: true, endCursor: "second" };
  }
  fixture.DotlnChecks.second = structuredClone(fixture.DotlnChecks.first);
  fixture.DotlnChecks.second.data.repository.object.statusCheckRollup.contexts =
    pageOf(checksOf(fixture).nodes.slice(1));
  checksOf(fixture).nodes = checksOf(fixture).nodes.slice(0, 1);
  checksOf(fixture).pageInfo = { hasNextPage: true, endCursor: "second" };
  const thread = pullOf(fixture, "DotlnThreads").reviewThreads.nodes[0];
  const more = thread.comments.nodes.pop();
  more.body = "https://outside.invalid/secret-fixture";
  thread.comments.pageInfo = { hasNextPage: true, endCursor: "thread-second" };
  fixture.DotlnThreadComments = {
    "thread-second": {
      data: {
        node: { id: thread.id, isResolved: false, comments: pageOf([more]) },
      },
    },
  };
  const subject = observationScenario(t, fixture);
  succeeded(subject.run());
  const payload = subject.events()[1].payload;
  assert.equal(payload.checks.length, 3);
  assert.equal(payload.comments.length, 6);
  assert.equal(
    payload.comments.find((c) => c.id === "PRRC_2").refused.shape,
    "scheme-authority",
  );
  assert.equal(subject.publication.read().includes(more.body), false);
  assert.match(subject.calls(), /cursor=thread-second/);
});

await test("WO-065 AC3: unknown PR, malformed JSON/fields, partial errors and gh failure append nothing", (t) => {
  const subject = observationScenario(t);
  const before = subject.publication.read();
  const unknown = subject.run("8");
  assert.equal(unknown.status, 1);
  assert.match(unknown.stderr, /recorded PullRequestOpened/);
  assert.equal(subject.calls(), "");
  const cases = [
    [
      (f) => {
        f.DotlnPullRequest.first = { raw: '{"secret-fixture":' };
      },
      /\$: gh DotlnPullRequest returned invalid JSON/,
    ],
    [
      (f) => {
        pullOf(f, "DotlnPullRequest").headRefOid = false;
      },
      /\$\.data\.repository\.pullRequest\.headRefOid/,
    ],
    [
      (f) => {
        pullOf(f, "DotlnComments").comments.nodes[0].body = null;
      },
      /comments\.nodes\[0\]\.body/,
    ],
    ...[
      "DotlnPullRequest",
      "DotlnComments",
      "DotlnReviews",
      "DotlnThreads",
    ].map((operation) => [
      (f) => {
        pullOf(f, operation).author.__typename = "UnknownActor";
      },
      /pullRequest\.author\.__typename/,
    ]),
    [
      (f) => {
        delete pullOf(f, "DotlnComments").comments.nodes[0].author.__typename;
      },
      /comments\.nodes\[0\]\.author\.__typename/,
    ],
    [
      (f) => {
        pullOf(
          f,
          "DotlnThreads",
        ).reviewThreads.nodes[0].comments.nodes[0].author.__typename =
          "UnknownActor";
      },
      /comments\.nodes\[0\]\.author\.__typename/,
    ],
    [
      (f) => {
        pullOf(f, "DotlnComments").author.__typename = "Bot";
      },
      /head or author changed/,
    ],
    [
      (f) => {
        checksOf(f).nodes[0].conclusion = "UNKNOWN";
      },
      /contexts\.nodes\[0\]\.conclusion/,
    ],
    [
      (f) => {
        pullOf(f, "DotlnThreads").reviewThreads.nodes[0].isResolved = "false";
      },
      /reviewThreads\.nodes\[0\]\.isResolved/,
    ],
    [
      (f) => {
        f.DotlnComments.first.errors = [{ message: "secret-fixture" }];
      },
      /\$\.errors/,
    ],
    [
      (f) => {
        f.DotlnReviews.first = { exit: 9, stderr: "secret-fixture" };
      },
      /gh DotlnReviews failed \(exit 9\)/,
    ],
    [
      (f) => {
        pullOf(f, "DotlnComments").number = 8;
      },
      /number: pull request mismatch/,
    ],
    [
      (f) => {
        pullOf(f, "DotlnComments").headRefOid = "b".repeat(40);
      },
      /head or author changed/,
    ],
    [
      (f) => {
        pullOf(f, "DotlnThreads").reviewThreads.pageInfo = {
          hasNextPage: true,
          endCursor: null,
        };
      },
      /pageInfo\.endCursor/,
    ],
  ];
  for (const [change, expected] of cases) {
    const fixture = structuredClone(observationFixture);
    change(fixture);
    subject.set(fixture);
    const run = subject.run();
    assert.equal(run.status, 1, run.stdout);
    assert.match(run.stderr, expected);
    assert.doesNotMatch(run.stderr, /secret-fixture|\n\s+at /);
    assert.equal(subject.publication.read(), before);
    assert.equal(
      existsSync(join(subject.publication.directory, "host.lock")),
      false,
    );
  }
});

await test("WO-065: duplicate nodes, stalled pagination and concurrent writer refuse", (t) => {
  const subject = observationScenario(t);
  const before = subject.publication.read();
  for (const change of [
    (f) => {
      const c = pullOf(f, "DotlnComments").comments;
      c.nodes.push(c.nodes[0]);
    },
    (f) => {
      const c = pullOf(f, "DotlnComments").comments;
      c.pageInfo = { hasNextPage: true, endCursor: "loop" };
      f.DotlnComments.loop = structuredClone(f.DotlnComments.first);
      f.DotlnComments.loop.data.repository.pullRequest.comments.nodes[0].id =
        "other";
    },
  ]) {
    const fixture = structuredClone(observationFixture);
    change(fixture);
    subject.set(fixture);
    assert.equal(subject.run().status, 1);
    assert.equal(subject.publication.read(), before);
  }
  subject.set(observationFixture);
  subject.publication.acquire();
  try {
    const observed = subject.run();
    assert.equal(observed.status, 1);
    assert.match(
      observed.stderr,
      /pull request observation refused: publication store already has a live host/,
    );
  } finally {
    subject.publication.release();
  }
  assert.equal(subject.publication.read(), before);
});

await test("WO-065 F2: malformed screened bodies remain refused items while safe peers survive", (t) => {
  const fixture = structuredClone(observationFixture);
  const bodies = [
    "escape-fixture\u001b[31m",
    "nul-fixture\u0000",
    "del-fixture\u007f",
    "unicode-fixture\ud800",
  ];
  pullOf(fixture, "DotlnComments").comments.nodes.push(
    ...bodies.map((body, index) =>
      fixtureComment(`IC_malformed_${index}`, body),
    ),
    fixtureComment("IC_whitespace", "ordinary\ttext\nnext\rline"),
  );
  const subject = observationScenario(t, fixture);
  succeeded(subject.run());
  const comments = subject.events()[1].payload.comments;
  for (const [index, body] of bodies.entries()) {
    const item = comments.find((c) => c.id === `IC_malformed_${index}`);
    assert.deepEqual(item, {
      id: `IC_malformed_${index}`,
      role: "reviewer",
      resolved: false,
      class: "human-review",
      refused: {
        shape: "malformed-text",
        path: `$.data.repository.pullRequest.comments.nodes[${index + 1}].body`,
      },
    });
    assert.equal(
      subject.publication
        .read()
        .includes(body.split("-fixture")[0] + "-fixture"),
      false,
    );
  }
  assert.equal(
    comments.find((c) => c.id === "IC_whitespace").text,
    "ordinary\ttext\nnext\rline",
  );
  assert.equal(comments.find((c) => c.id === "PRRC_2").text, "Agreed.");
  const before = subject.publication.read();
  succeeded(subject.run());
  assert.equal(subject.publication.read(), before);
});

await test("WO-065 F3: refused metadata stays local, preserves check states, and retains no rejected content", (t) => {
  const fixture = structuredClone(observationFixture);
  const thread = pullOf(fixture, "DotlnThreads").reviewThreads.nodes[0];
  const unsafePath = "www.example.org/index.html";
  thread.comments.nodes[0].path = unsafePath;
  thread.comments.nodes[0].body = "body-omitted-for-refused-path";
  const unsafeId = "https://outside.invalid/comment-identifier";
  const unsafeId2 = "second-id\u001b";
  pullOf(fixture, "DotlnComments").comments.nodes.push(
    fixtureComment(unsafeId, "body-omitted-for-refused-id"),
    fixtureComment(unsafeId2, "second-body-omitted-for-refused-id"),
    fixtureComment(
      "refused:1",
      "A real opaque id must not collide with a placeholder.",
    ),
  );
  const unsafeCheck = "https://outside.invalid/check-name";
  const unsafeContext = "www.example.org/check-context";
  checksOf(fixture).nodes[0].name = unsafeCheck;
  checksOf(fixture).nodes[1].context = unsafeContext;
  const subject = observationScenario(t, fixture);
  succeeded(subject.run());
  const { checks, comments } = subject.events()[1].payload;
  assert.deepEqual(
    checks
      .filter((c) => c.name === "[refused]")
      .map((c) => c.state)
      .sort(),
    ["FAILURE", "SUCCESS"],
  );
  const pathItem = comments.find((c) => c.id === "PRRC_1");
  assert.equal(pathItem.path, undefined);
  assert.equal(pathItem.line, undefined);
  assert.equal(pathItem.text, undefined);
  assert.equal(pathItem.refused.shape, "www-autolink");
  assert.match(pathItem.refused.path, /comments\.nodes\[0\]\.path$/);
  const idItems = comments.filter((c) => c.refused?.path.endsWith(".id"));
  assert.equal(idItems.length, 2);
  assert.ok(
    idItems.every(
      (c) => /^refused:\d+$/u.test(c.id) && !Object.hasOwn(c, "text"),
    ),
  );
  assert.equal(new Set(comments.map((c) => c.id)).size, comments.length);
  assert.equal(comments.find((c) => c.id === "refused:1").refused, undefined);
  assert.equal(comments.find((c) => c.id === "ci:CR_1").class, "ci-failure");
  const context = comments.find((c) => c.id === "check:SC_1");
  assert.equal(context.class, "automated-review");
  assert.equal(context.refused.shape, "www-autolink");
  assert.match(context.refused.path, /contexts\.nodes\[1\]\.context$/);
  assert.equal(comments.find((c) => c.id === "PRRC_2").text, "Agreed.");
  for (const raw of [
    unsafePath,
    unsafeId,
    unsafeId2,
    unsafeCheck,
    unsafeContext,
    "body-omitted-for-refused",
  ])
    assert.equal(
      subject.publication.read().includes(raw),
      false,
      "refused strings must not persist",
    );
  assert.deepEqual(
    execFileSync("find", [subject.store, "-type", "f"], { encoding: "utf8" })
      .trim()
      .split("\n"),
    [subject.publication.logPath],
  );
  const before = subject.publication.read();
  succeeded(subject.run());
  assert.equal(subject.publication.read(), before);
});

await test("WO-065 F3: forge hosts incompatible with the screen refuse before gh", (t) => {
  for (const host of [
    "localhost",
    "github..com",
    "127.0.0.1",
    "-forge.example",
  ]) {
    const subject = observationScenario(
      t,
      observationFixture,
      `${host}/dotln-fixture/target`,
    );
    const before = subject.publication.read();
    const run = subject.run();
    assert.equal(run.status, 1);
    assert.match(
      run.stderr,
      /pull request observation refused: \$\.PullRequestOpened\.repositoryId: forge host is not admitted by source-bundle screen/,
    );
    assert.equal(subject.calls(), "");
    assert.equal(subject.publication.read(), before);
    assert.equal(
      existsSync(join(subject.publication.directory, "host.lock")),
      false,
    );
  }
});

await test("WO-065: draft comments stay transient, deleted authors and opaque padded ids remain readable, empty checks are valid", (t) => {
  const fixture = structuredClone(observationFixture);
  const nodes = pullOf(fixture, "DotlnThreads").reviewThreads.nodes[0].comments
    .nodes;
  nodes.push({
    ...nodes[0],
    id: "PRRC_draft",
    body: "unpublished-draft-fixture",
    state: "PENDING",
  });
  nodes[1].id = "opaque/" + "x".repeat(130) + "==";
  nodes[1].author = null;
  nodes[1].line = null;
  fixture.DotlnChecks.first.data.repository.object.statusCheckRollup = null;
  const subject = observationScenario(t, fixture);
  succeeded(subject.run());
  const state = subject.events()[1].payload;
  assert.deepEqual(state.checks, []);
  assert.equal(
    state.comments.some((c) => c.id === "PRRC_draft"),
    false,
  );
  assert.equal(
    subject.publication.read().includes("unpublished-draft-fixture"),
    false,
  );
  assert.equal(
    state.comments.find((c) => c.id === "opaque/" + "x".repeat(130) + "==")
      .role,
    "reviewer",
  );
  assert.equal(
    state.comments.find((c) => c.id === "opaque/" + "x".repeat(130) + "==")
      .line,
    undefined,
  );
});

await test("WO-065: a valid page over the default child-process buffer is decoded and stored", (t) => {
  const fixture = structuredClone(observationFixture);
  const body = "ordinary fixture text ".repeat(2200);
  pullOf(fixture, "DotlnComments").comments.nodes = Array.from(
    { length: 30 },
    (_, i) => fixtureComment(`IC_large_${i}`, body),
  );
  assert.ok(
    Buffer.byteLength(JSON.stringify(fixture.DotlnComments.first)) >
      1024 * 1024,
  );
  const subject = observationScenario(t, fixture);
  succeeded(subject.run());
  assert.equal(
    subject
      .events()[1]
      .payload.comments.filter((c) => c.id.startsWith("IC_large_")).length,
    30,
  );
});

// WO-066: the remote is a local bare repository behind fake gh. Triage and
// workers are labeled doubles; RepairHost runs the real derivation, snapshot
// tests and acceptance fold before the publication helper sees a head.
async function reviewScenario(
  t,
  {
    items = [{ id: "R1", path: "fixture.txt", line: 1, role: "automation" }],
    check = null,
    repairedCheck = "SUCCESS",
    wrong = false,
  } = {},
) {
  const subject = await scenario(t, { review: true });
  const published = subject.publish();
  assert.equal(published.status, 0, published.stderr);
  const response = join(subject.root, "remote-state.json"),
    replay = join(subject.root, "review-replay.mjs"),
    ghLog = join(subject.root, "review-gh.log");
  writeFileSync(
    response,
    JSON.stringify({
      items,
      check,
      repairedCheck,
      initialHead: subject.observation.commit,
      resolved: [],
    }),
  );
  writeFileSync(
    replay,
    `
import {readFileSync,writeFileSync} from 'node:fs'; import {execFileSync} from 'node:child_process';
const args=process.argv.slice(2), vars={};
for(let i=0;i<args.length;i++) if(args[i]==='-f'||args[i]==='-F'){const value=args[++i], at=value.indexOf('=');vars[value.slice(0,at)]=value.slice(at+1);}
const raw=JSON.parse(readFileSync(process.env.DOTLN_GH_RESPONSES,'utf8'));
const operation=/^(?:query|mutation) (Dotln[A-Za-z]+)\\(/.exec(vars.query)?.[1];
const head=execFileSync(${JSON.stringify(realGit)},['--git-dir',${JSON.stringify(join(subject.root, "origin.git"))},'rev-parse',${JSON.stringify(`refs/heads/${BRANCH}`)}],{encoding:'utf8'}).trim();
const page=nodes=>({nodes,pageInfo:{hasNextPage:false,endCursor:null}});
const author={__typename:'User',login:'fixture-author'};
const pull={number:7,headRefOid:head,author}; let data;
if(operation==='DotlnRejectReview') data={addPullRequestReviewThreadReply:{comment:{id:'REPLY_1'}}};
else if(operation==='DotlnResolveReview') {raw.resolved.push(vars.thread);writeFileSync(process.env.DOTLN_GH_RESPONSES,JSON.stringify(raw));data={resolveReviewThread:{thread:{id:vars.thread,isResolved:true}}};}
else if(operation==='DotlnChecks') data={repository:{object:{oid:head,statusCheckRollup:{contexts:page(raw.check?[{__typename:'CheckRun',id:'CHECK_1',name:raw.check,status:head!==raw.initialHead&&raw.repairedCheck==='IN_PROGRESS'?'IN_PROGRESS':'COMPLETED',conclusion:head===raw.initialHead?'FAILURE':raw.repairedCheck==='IN_PROGRESS'?null:raw.repairedCheck}]:[])}}}};
else {
 if(operation==='DotlnComments') pull.comments=page([]);
 if(operation==='DotlnReviews') pull.reviews=page([]);
 if(operation==='DotlnThreads') pull.reviewThreads=page(raw.items.map(item=>({id:'T_'+item.id,isResolved:raw.resolved.includes('T_'+item.id),comments:page([{id:item.id,body:item.text??'Synthetic automated finding',author:item.role==='human'?{__typename:'User',login:'human-reviewer'}:{__typename:'Bot',login:'fixture-bot'},path:item.path,line:item.line??null,state:'SUBMITTED'}])})));
 if(!['DotlnPullRequest','DotlnComments','DotlnReviews','DotlnThreads'].includes(operation)) process.exit(64);
 data={repository:{nameWithOwner:'dotln-fixture/target',pullRequest:pull}};
}
process.stdout.write(JSON.stringify({data}));
`,
  );
  const changes = {
    PATH: `${bin}:${process.env.PATH}`,
    GIT_CONFIG_GLOBAL: join(subject.root, "global.gitconfig"),
    DOTLN_GH_LOG: ghLog,
    DOTLN_NODE: process.execPath,
    DOTLN_GH_REPLAY: replay,
    DOTLN_GH_RESPONSES: response,
  };
  const previous = Object.fromEntries(
    Object.keys(changes).map((key) => [key, process.env[key]]),
  );
  Object.assign(process.env, changes);
  t.after(() => {
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  });
  writeFileSync(join(subject.root, "repair-launches.jsonl"), "");
  const original = {
    workOrder: subject.writer.program.workOrder,
    authorityEnvelope: subject.writer.program.authorityEnvelope,
    surfaces: ["fixture.txt", "fixture-test.mjs", "contract-test.mjs"],
    tests: snapshotTests,
    criteria: snapshotCriteria,
  };
  const publication = {
    launchpad: subject.launchpad,
    workOrderId: "WO-064",
    request: readTargetPublishRequest(subject.requestPath),
    registry: [subject.grant],
  };
  let preparedCount = 0;
  const config = {
    launchpad: subject.launchpad,
    store: join(subject.root, "store"),
    number: 7,
    repositoryId: "github.com/dotln-fixture/target",
    original,
    checkTests: { unit: "node contract-test.mjs" },
    judgments: Object.fromEntries(
      [...items.map((item) => item.id), ...(check ? ["ci:CHECK_1"] : [])].map(
        (id) => [
          id,
          {
            kind: "accept",
            criterionId: "AC-contract",
            evidenceRefs: ["synthetic-contract", "synthetic-diff"],
          },
        ],
      ),
    ),
    publication,
    now: () => 20,
    prepareRepair(active) {
      preparedCount++;
      return {
        baseline: subject.baseline.subject,
        subject: subject.prepared.subject,
        snapshotPath: subject.prepared.snapshotPath,
        store: new WorkerStore(
          join(subject.root, `review-${active.key.slice(8)}`),
        ),
        directory: join(subject.root, `children-${active.key.slice(8)}`),
        source: {
          authorityEvidence: [],
          artifactIdentity: subject.writer.artifactIdentity,
          worktreeParent: join(subject.root, "trees"),
          launchpadCheckout: repoRoot,
          model: "fixture-double",
          effort: "xhigh",
          transport: repairTransport(subject.root, wrong),
        },
        verifier: {
          model: "fixture-double",
          effort: "xhigh",
          transport: snapshotTransport(),
        },
        now: () => 20,
      };
    },
  };
  return {
    ...subject,
    response,
    ghLog,
    config,
    preparedCount: () => preparedCount,
    events: () =>
      decodeLog(
        new WorkerStore(join(subject.root, "store/publication")).read(),
      ),
    launches: () =>
      readFileSync(join(subject.root, "repair-launches.jsonl"), "utf8")
        .trim()
        .split("\n")
        .filter(Boolean),
    calls: () => (existsSync(ghLog) ? readFileSync(ghLog, "utf8") : ""),
  };
}

await test("WO-066 AC1/AC3: an accepted automated thread repairs, verifies, pushes, disposes and records fresh resolution; recovery never pushes twice", async (t) => {
  const subject = await reviewScenario(t);
  const pinned = {
    original: subject.config.original,
    baseline: subject.baseline.subject,
    subject: subject.prepared.subject,
    source: { artifactIdentity: subject.writer.artifactIdentity },
  };
  bindReviewRepairInput(subject.config.publication, pinned);
  assert.throws(
    () =>
      bindReviewRepairInput(subject.config.publication, {
        ...pinned,
        original: {
          ...pinned.original,
          authorityEnvelope: {
            ...pinned.original.authorityEnvelope,
            allowedEffects: ["repo.push"],
          },
        },
      }),
    /repair input differs/,
  );
  assert.throws(
    () =>
      bindReviewRepairInput(subject.config.publication, {
        ...pinned,
        original: { ...pinned.original, tests: [] },
      }),
    /repair input differs/,
  );
  assert.equal(subject.launches().length, 0);
  assert.equal(subject.calls(), "");
  const repairFile = join(subject.root, "review-input.json");
  const requestFile = join(subject.root, "review-command.json");
  writeFileSync(
    repairFile,
    JSON.stringify({
      ...pinned,
      source: {
        ...pinned.source,
        transport: "claude-cli-print",
        model: "claude-opus-5-5",
        effort: "xhigh",
      },
      verifier: {
        transport: "claude-cli-print",
        model: "claude-opus-5-5",
        effort: "xhigh",
      },
    }),
  );
  writeFileSync(
    requestFile,
    JSON.stringify({
      schemaVersion: 1,
      workOrderId: "WO-064",
      number: 7,
      targetRequest: subject.requestPath,
      repairInput: repairFile,
      children: "review-command-children",
    }),
  );
  const disabled = spawnSync(
    process.execPath,
    [cli, "resolve-pr", "--request", requestFile],
    {
      cwd: subject.launchpad,
      env: {
        ...process.env,
        DOTLN_LAUNCHPAD: subject.launchpad,
        DOTLN_LIVE_WORKERS: "0",
      },
      encoding: "utf8",
    },
  );
  assert.equal(disabled.status, 1);
  assert.match(disabled.stderr, /DOTLN_LIVE_WORKERS=1/);
  assert.equal(
    existsSync(join(subject.root, "review-command-children")),
    false,
  );
  assert.equal(subject.calls(), "");
  let killed = false;
  await assert.rejects(
    resolveReviewComments({
      ...subject.config,
      afterPush() {
        if (!killed) {
          killed = true;
          throw new Error("fixture kill after push");
        }
      },
    }),
    /fixture kill/,
  );
  assert.equal(subject.launches().length, 1);
  assert.equal(
    subject.events().filter((e) => e.type === "PullRequestRepairPushed").length,
    1,
  );
  const result = await resolveReviewComments(subject.config);
  assert.equal(result.status, "resolved");
  assert.equal(subject.launches().length, 1);
  assert.equal(
    subject.events().filter((e) => e.type === "PullRequestRepairPushed").length,
    1,
  );
  assert.equal(
    (subject.calls().match(/mutation DotlnResolveReview/g) ?? []).length,
    1,
  );
  const events = subject.events(),
    pushed = events.find((e) => e.type === "PullRequestRepairPushed"),
    disposed = events.find((e) => e.type === "PullRequestThreadDisposed");
  const observed = events
    .filter((e) => e.type === "PullRequestStateObserved")
    .at(-1);
  assert.ok(events.indexOf(observed) > events.indexOf(disposed));
  assert.equal(observed.payload.headSha, pushed.payload.headSha);
  assert.equal(observed.payload.comments[0].class, "resolved");
  const item = [...replayReviewItems(events).values()][0];
  const repairLog = decodeLog(
    new WorkerStore(
      item.results.repair.repairStore.replace(/source-1$/, "verification-1"),
    ).read(),
  );
  assert.ok(repairLog.some((e) => e.type === "CommandResult"));
  assert.equal(subject.remoteBranch(), pushed.payload.headSha);
  process.stdout.write(
    "WO-066 accepted-thread transcript: one fresh writer; WO-054 pass; one push; granted disposition; recorded resolved observation; interrupted push resumed.\n",
  );
});

await test("WO-066 AC1: a mapped failing check repairs and is freshly observed successful at the new head", async (t) => {
  const subject = await reviewScenario(t, { items: [], check: "unit" });
  const result = await resolveReviewComments(subject.config);
  assert.equal(result.status, "resolved");
  assert.equal(subject.launches().length, 1);
  assert.equal(
    subject.events().filter((e) => e.type === "PullRequestThreadDisposed")
      .length,
    0,
  );
  const latest = subject
    .events()
    .filter((e) => e.type === "PullRequestStateObserved")
    .at(-1);
  assert.deepEqual(latest.payload.checks, [{ name: "unit", state: "SUCCESS" }]);
  assert.equal(latest.payload.headSha, subject.remoteBranch());
});

await test("WO-066 AC2: reject carries evidence to the thread; human comments never dispatch or dispose; outside paths and unmapped checks name NeedsHuman", async (t) => {
  const reject = await reviewScenario(t);
  reject.config.judgments.R1.kind = "reject";
  assert.equal((await resolveReviewComments(reject.config)).status, "resolved");
  assert.equal(reject.launches().length, 0);
  assert.equal(
    reject.events().find((e) => e.type === "PullRequestRejectionPosted").payload
      .disposition,
    "reject",
  );
  assert.match(
    reject.calls(),
    /body=\{"disposition":"rejected","evidenceRefs":\["synthetic-contract","synthetic-diff"\]\}/,
  );
  const human = await reviewScenario(t, {
    items: [{ id: "H1", role: "human", path: "fixture.txt", line: 1 }],
  });
  assert.equal(
    (await resolveReviewComments(human.config)).status,
    "needs-human",
  );
  assert.equal(human.launches().length, 0);
  assert.doesNotMatch(human.calls(), /mutation/);
  const outside = await reviewScenario(t, {
    items: [{ id: "OUTSIDE", path: "outside.txt", line: 1 }],
  });
  assert.equal(
    (await resolveReviewComments(outside.config)).status,
    "needs-human",
  );
  assert.equal(outside.launches().length, 0);
  assert.match(
    [...replayReviewItems(outside.events()).values()][0].terminal.reason,
    /outside.txt/,
  );
  const unknown = await reviewScenario(t, {
    items: [],
    check: "unknown-check",
  });
  assert.equal(
    (await resolveReviewComments(unknown.config)).status,
    "needs-human",
  );
  assert.equal(unknown.launches().length, 0);
  assert.match(
    [...replayReviewItems(unknown.events()).values()][0].terminal.reason,
    /unknown-check/,
  );
});

await test("WO-066 AC2: a refused comment stops with its identifier; failed repair verification cannot push or dispatch a second round", async (t) => {
  const refused = await reviewScenario(t, {
    items: [
      {
        id: "REFUSED",
        path: "fixture.txt",
        line: 1,
        text: "https://off-list.example/path",
      },
    ],
  });
  const stop = await resolveReviewComments(refused.config);
  assert.equal(stop.status, "refused");
  assert.equal(stop.itemId, "REFUSED");
  assert.equal(refused.launches().length, 0);
  assert.doesNotMatch(refused.calls(), /mutation/);
  const failed = await reviewScenario(t, { wrong: true });
  assert.equal(
    (await resolveReviewComments(failed.config)).status,
    "needs-human",
  );
  assert.equal(failed.launches().length, 1);
  assert.equal(
    failed.events().filter((e) => e.type === "PullRequestRepairPushed").length,
    0,
  );
  assert.equal(
    (await resolveReviewComments(failed.config)).status,
    "needs-human",
  );
  assert.equal(failed.launches().length, 1);
});

await test("WO-066 AC3: later comments enter at observation, but a local resolved bit without an observer event proves nothing", async (t) => {
  const subject = await reviewScenario(t, { items: [] });
  assert.equal(
    (await resolveReviewComments(subject.config)).status,
    "resolved",
  );
  const remote = JSON.parse(readFileSync(subject.response, "utf8"));
  remote.items = [{ id: "LATE", path: "fixture.txt", line: 1 }];
  writeFileSync(subject.response, JSON.stringify(remote));
  subject.config.judgments.LATE = {
    kind: "reject",
    evidenceRefs: ["synthetic-contract"],
  };
  let observations = 0;
  const result = await resolveReviewComments({
    ...subject.config,
    observe() {
      observations++;
      if (observations === 1)
        return observePullRequest({
          cwd: subject.launchpad,
          store: subject.config.store,
          number: 7,
          repositoryId: subject.config.repositoryId,
          now: 20,
        });
      return {
        appended: false,
        payload: {
          comments: [{ id: "LATE", resolved: true, class: "resolved" }],
        },
      };
    },
  });
  assert.equal(result.status, "needs-human");
  const late = [...replayReviewItems(subject.events()).values()][0];
  assert.match(late.terminal.reason, /no fresh post-disposition/);
  assert.equal(subject.launches().length, 0);
});

await test("WO-066 AC4: push and every thread disposition require their operator effect before gh; a foreign repaired head cannot push", async (t) => {
  const subject = await reviewScenario(t);
  // Derive a verified real child once; the injected cut is before disposition.
  await assert.rejects(
    resolveReviewComments({
      ...subject.config,
      afterPush() {
        throw new Error("fixture cut");
      },
    }),
    /fixture cut/,
  );
  const item = [...replayReviewItems(subject.events()).values()][0],
    child = item.results.repair;
  const source = JSON.parse(
    readFileSync(join(subject.root, "loadout.json"), "utf8"),
  );
  const writeGrant = (effects) => {
    const grant = { ...subject.grant, effects, operations: effects };
    source.authorityGrants = [grant];
    writeFileSync(join(subject.root, "loadout.json"), JSON.stringify(source));
    return [grant];
  };
  writeFileSync(subject.ghLog, "");
  assert.throws(
    () =>
      pushRepairedHead({
        ...subject.config.publication,
        registry: writeGrant(["pr.open", "pr.thread.resolve"]),
        itemKey: "missing-push",
        ...child,
        now: 20,
      }),
    /repo.push is not granted/,
  );
  assert.equal(subject.calls(), "");
  for (const kind of ["accept", "reject"]) {
    assert.throws(
      () =>
        disposeReviewThread({
          ...subject.config.publication,
          registry: writeGrant(["repo.push", "pr.open"]),
          itemKey: "missing-dispose",
          item: item.item,
          judgment: { kind, evidenceRefs: ["synthetic-contract"] },
          now: 20,
        }),
      /pr.thread.resolve is not granted/,
    );
    assert.equal(subject.calls(), "");
  }
  writeGrant(["repo.push", "pr.open", "pr.thread.resolve"]);
  const childStore = new WorkerStore(child.repairStore);
  // A fixture foreign commit is an actual Git commit, with a correspondingly
  // host-recorded child observation; ancestry refusal precedes any remote IO.
  const originalLog = childStore.read(),
    childObservation = decodeLog(originalLog).find(
      (e) => e.type === "SourceChangeObserved",
    ).payload;
  const tree = fixtureGit(
    subject.target,
    "rev-parse",
    `${subject.baseCommit}^{tree}`,
  );
  const foreign = execGit(["-C", subject.target, "commit-tree", tree], {
    input: "Foreign fixture root\n",
    encoding: "utf8",
    env: {
      ...process.env,
      GIT_AUTHOR_NAME: "Fixture",
      GIT_AUTHOR_EMAIL: "fixture@example.invalid",
      GIT_COMMITTER_NAME: "Fixture",
      GIT_COMMITTER_EMAIL: "fixture@example.invalid",
    },
  }).trim();
  const receiptPath = join(
    childStore.directory,
    `${decodeLog(originalLog).find((e) => e.type === "CommandPersisted").payload.command.commandId}.source-change.json`,
  );
  const originalReceipt = readFileSync(receiptPath, "utf8");
  writeFileSync(
    join(childStore.directory, "events.jsonl"),
    originalLog.replaceAll(childObservation.commit, foreign),
  );
  writeFileSync(
    receiptPath,
    originalReceipt.replaceAll(childObservation.commit, foreign),
  );
  try {
    assert.throws(
      () =>
        pushRepairedHead({
          ...subject.config.publication,
          itemKey: "foreign-head",
          ...child,
          now: 20,
        }),
      /does not descend/,
    );
    assert.equal(subject.calls(), "");
  } finally {
    writeFileSync(join(childStore.directory, "events.jsonl"), originalLog);
    writeFileSync(receiptPath, originalReceipt);
  }
});

await test("WO-184 criterion 7: response-derived argument tokens refuse before reuse without echo", (t) => {
  for (const source of ["cursor", "thread-id"]) {
    const fixture = structuredClone(observationFixture);
    const tainted = `response-fixture-${source}\u0000suffix`;
    if (source === "cursor") {
      pullOf(fixture, "DotlnComments").comments.pageInfo = {
        hasNextPage: true,
        endCursor: tainted,
      };
    } else {
      const thread = pullOf(fixture, "DotlnThreads").reviewThreads.nodes[0];
      thread.id = tainted;
      thread.comments.pageInfo = { hasNextPage: true, endCursor: "second" };
    }
    const subject = observationScenario(t, fixture);
    const run = subject.run();
    assert.equal(run.status, 1);
    assert.match(
      run.stderr,
      source === "cursor"
        ? /comments\.pageInfo\.endCursor/
        : /reviewThreads\.nodes\[0\]\.id/,
    );
    assert.doesNotMatch(
      run.stderr,
      /response-fixture-|ERR_INVALID_ARG|Received/,
    );
    assert.equal(subject.events().length, 1);
    assert.doesNotMatch(subject.calls(), /response-fixture-/);
    assert.equal(
      existsSync(join(subject.publication.directory, ".lock")),
      false,
    );
  }
});

await test("WO-184 criterion 7: screen overflow refuses only the item, preserving its safe peer", (t) => {
  const fixture = structuredClone(observationFixture);
  pullOf(fixture, "DotlnComments").comments = pageOf([
    fixtureComment("overflow-item", "Bearer " + "A".repeat(6_000_000)),
    fixtureComment("safe-peer", "Safe peer remains readable."),
  ]);
  const subject = observationScenario(t, fixture);
  succeeded(subject.run());
  assert.equal(subject.events().length, 2);
  const items = subject.events()[1].payload.comments;
  const refused = items.find((item) => item.id === "overflow-item");
  assert.deepEqual(refused.refused, {
    shape: "unscreenable-text",
    path: "$.data.repository.pullRequest.comments.nodes[0].body",
  });
  assert.equal(refused.text, undefined);
  assert.equal(
    items.find((item) => item.id === "safe-peer").text,
    "Safe peer remains readable.",
  );
  assert.doesNotMatch(subject.publication.read(), /AAAAAA/);
});

await test(
  "WO-184 criterion 8: required publication rechecks a recorded head without remote calls",
  { skip: process.platform !== "darwin" },
  async (t) => {
    const subject = await scenario(t, { readiness: true });
    const file = join(subject.root, "store/delivery-preparation.json");
    const preparation = JSON.parse(readFileSync(file, "utf8"));
    writeFileSync(
      file,
      JSON.stringify({
        ...preparation,
        unresolvedMaterialAmbiguities: ["unanswered-choice"],
      }),
    );
    succeeded(subject.publish());
    const calls = subject.ghCalls().length;
    const repeat = subject.publish("--require-deliverable-ready");
    assert.equal(repeat.status, 1);
    assert.match(repeat.stderr, /No unresolved material ambiguity/);
    assert.doesNotMatch(repeat.stdout, /Already published/u);
    assert.equal(subject.ghCalls().length, calls);
    writeFileSync(file, JSON.stringify(preparation));
    const ready = subject.publish("--require-deliverable-ready");
    succeeded(ready);
    assert.match(ready.stdout, /Already published/u);
    assert.equal(subject.ghCalls().length, calls);
    fixtureGit(
      subject.target,
      "update-ref",
      `refs/heads/${BRANCH}`,
      subject.baseCommit,
    );
    const moved = subject.publish("--require-deliverable-ready");
    assert.equal(moved.status, 1);
    assert.match(moved.stderr, /no longer names the observed commit/u);
    assert.doesNotMatch(moved.stdout, /Already published/u);
    assert.equal(subject.ghCalls().length, calls);
    assert.equal(subject.remoteBranch(), subject.observation.commit);
  },
);

await test(
  "WO-184 criterion 8: lint not-applicable carries its reason, while tests always require evidence",
  { skip: process.platform !== "darwin" },
  async (t) => {
    const subject = await scenario(t, { readiness: true });
    const file = join(subject.root, "store/delivery-preparation.json");
    const preparation = JSON.parse(readFileSync(file, "utf8"));
    preparation.checks.lint = {
      status: "not-applicable",
      reason: "This fixture target has no lint step.",
    };
    preparation.checks.tests = {
      status: "not-applicable",
      reason: "Attempted bypass.",
    };
    writeFileSync(file, JSON.stringify(preparation));
    refusedBeforeRemote(
      subject,
      subject.publish("--require-deliverable-ready"),
      /invalid typed preparation shape/,
    );
    preparation.checks.tests = JSON.parse(
      readFileSync(file, "utf8"),
    ).checks.build;
    writeFileSync(file, JSON.stringify(preparation));
    succeeded(subject.publish("--require-deliverable-ready"));
    assert.match(
      readFileSync(subject.body, "utf8"),
      /lint not-applicable: This fixture target has no lint step\./,
    );
  },
);

await test("WO-184 criterion 9: pending and cancelled mapped checks stop needs-human with their item", async (t) => {
  for (const repairedCheck of ["IN_PROGRESS", "CANCELLED"]) {
    const subject = await reviewScenario(t, {
      items: [],
      check: "unit",
      repairedCheck,
    });
    const result = await resolveReviewComments(subject.config);
    assert.equal(result.status, "needs-human");
    assert.equal(result.itemId, "ci:CHECK_1");
    const item = [...replayReviewItems(subject.events()).values()][0];
    assert.equal(item.terminal.status, "needs-human");
    assert.equal(subject.launches().length, 1);
  }
});

await test("WO-184 criterion 9: interruption after the observer append resumes from the last effect receipt", async (t) => {
  const subject = await reviewScenario(t);
  let observations = 0;
  const observe = () => {
    const result = observePullRequest({
      cwd: repoRoot,
      store: subject.config.store,
      number: 7,
      repositoryId: subject.config.repositoryId,
      now: 20,
      log() {},
    });
    if (++observations === 2)
      throw new Error("fixture interruption after observer append");
    return result;
  };
  await assert.rejects(
    resolveReviewComments({ ...subject.config, observe }),
    /fixture interruption/,
  );
  const result = await resolveReviewComments(subject.config);
  assert.equal(result.status, "resolved");
  assert.deepEqual(
    [...replayReviewItems(subject.events()).values()].map(
      (item) => item.terminal?.status,
    ),
    ["resolved"],
    "the resumed item's terminal resolves, independently of the loop's stop status",
  );
  assert.equal(subject.launches().length, 1);
  assert.equal(
    subject.events().filter((event) => event.type === "PullRequestRepairPushed")
      .length,
    1,
  );
  assert.equal(
    subject
      .events()
      .filter((event) => event.type === "PullRequestThreadDisposed").length,
    1,
  );
});

await test("WO-184 criterion 9: missing lines and unmatched required checks end human, allowing later items", async (t) => {
  const subject = await reviewScenario(t, {
    items: [
      { id: "no-line", path: "fixture.txt", role: "automation" },
      { id: "later", path: "fixture.txt", line: 1, role: "automation" },
    ],
  });
  const result = await resolveReviewComments(subject.config);
  assert.equal(result.status, "needs-human");
  assert.equal(result.itemId, "no-line");
  assert.match(result.reason, /positive integer line/);
  const items = [...replayReviewItems(subject.events()).values()];
  assert.equal(
    items.find((item) => item.item.id === "later").terminal.status,
    "resolved",
  );
  assert.equal(subject.launches().length, 1);
  const unmatched = await reviewScenario(t);
  unmatched.config.original = {
    ...unmatched.config.original,
    criteria: unmatched.config.original.criteria.map((criterion) => ({
      ...criterion,
      requiredChecks: [],
    })),
  };
  const refused = await resolveReviewComments(unmatched.config);
  assert.equal(refused.status, "needs-human");
  assert.match(refused.reason, /repair derivation:/);
  assert.equal(unmatched.launches().length, 0);
});

await test("WO-184 criterion 9: pushRepairedHead refuses a failing exact-head matrix before any push", async (t) => {
  const subject = await reviewScenario(t, { wrong: true });
  const result = await resolveReviewComments(subject.config);
  assert.equal(result.status, "needs-human");
  const item = [...replayReviewItems(subject.events()).values()][0];
  const before = subject.remoteBranch();
  assert.throws(
    () =>
      pushRepairedHead({
        ...subject.config.publication,
        itemKey: item.key,
        ...item.results.repair,
        now: 20,
      }),
    /repaired head is not independently verified/,
  );
  assert.equal(subject.remoteBranch(), before);
  assert.equal(
    subject.events().filter((event) => event.type === "PullRequestRepairPushed")
      .length,
    0,
  );
});

test("WO-184 criterion 7: every observer caller gets a fixed reason for unexpected errors", () => {
  const marker = "synthetic-caller-marker\u0000";
  assert.throws(
    () => observePullRequest({ cwd: marker, store: marker, number: 7 }),
    (error) => {
      assert.equal(
        error.message,
        "pull request observation refused: observer execution failed",
      );
      assert.ok(!error.message.includes(marker));
      return true;
    },
  );
});
