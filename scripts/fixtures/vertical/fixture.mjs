import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import {
  appendFileSync,
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
import { dirname, join } from "node:path";
import { compileStoryContract } from "@dotln/compiler";
import {
  TOOL_ROOT,
  docPath,
  docRelative,
  loadConfig,
} from "../../lib/config.mjs";
import { fileIntent } from "../../lib/derived-orders.mjs";
import { fetchIssueBundle } from "../../../packages/skeleton/dist/src/github-issue-source.js";
import { decodeResidentConfiguration } from "../../../packages/skeleton/dist/src/resident-state.js";
import { VERTICAL_EFFECTS } from "../../../packages/skeleton/dist/src/vertical.js";
import {
  sourceFixtureOptions,
  createSourceFixture,
  fixtureGit,
} from "../../../packages/skeleton/dist/test/source-change-fixture.js";
import { fixtureVerificationResult } from "../../../packages/skeleton/dist/src/verification-fake.js";
import {
  compareBaseline,
  parseEvidenceResult,
} from "../../../packages/skeleton/dist/src/verification-protocol.js";
import { disposeRepairFixture } from "../../../packages/skeleton/dist/test/repair-fixture.js";
import {
  CodexCliExecWorkOrderTransport,
  runWorkerProcess,
} from "../../../packages/skeleton/dist/src/worker-transport.js";
export const json = (p) => JSON.parse(readFileSync(p, "utf8"));
export const put = (p, v) => {
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(
    p,
    typeof v === "string" ? v : JSON.stringify(v, null, 2) + "\n",
  );
};
const connection = {
  nodes: [],
  pageInfo: { hasNextPage: false, endCursor: null },
};
/** Explicit fixture annotation, never a parser of the fixture's English. */
export function fixtureBaselineAssessment(
  bundle,
  inferences,
  bodyKind = "existing-failure",
) {
  const contract = compileStoryContract(bundle, inferences);
  return {
    schemaVersion: 1,
    contractId: contract.contractId,
    producer: { kind: "operator", name: "explicit fixture annotation" },
    assertions: contract.statements
      .filter((s) => s.status === "active" && s.class !== "non-requirement")
      .map((s) => ({
        statementId: s.statementId,
        kind:
          s.span.sectionId === bundle.sections[0].span.sectionId
            ? "no-existing-failure"
            : bodyKind,
        rationale:
          "The test author explicitly annotates the assertion meaning.",
      })),
  };
}
export async function verticalFixture(options = {}) {
  const root = createSourceFixture();
  const target = join(root, "target"),
    launchpad = join(root, "launchpad"),
    directory = join(root, "resident"),
    bin = join(root, "bin");
  mkdirSync(launchpad);
  mkdirSync(directory);
  mkdirSync(bin);
  if (options.plantReview) {
    put(
      join(target, "fixture-test.mjs"),
      "import assert from 'node:assert/strict'; import {readFileSync} from 'node:fs'; assert.equal(readFileSync('fixture.txt','utf8').trimEnd(), 'changed by synthetic worker');\n",
    );
    fixtureGit(target, "add", "fixture-test.mjs");
    fixtureGit(
      target,
      "commit",
      "-m",
      "Allow terminal whitespace in behavior check",
    );
  }
  put(
    join(target, "CONVENTIONS.md"),
    "# Conventions\n\nKeep fixture.txt as a single line; preserve tests.\n",
  );
  fixtureGit(target, "add", "CONVENTIONS.md");
  fixtureGit(target, "commit", "-m", "Declare fixture conventions");
  const git = execFileSync("/usr/bin/which", ["git"], {
    encoding: "utf8",
  }).trim();
  const remote = join(root, "origin.git");
  fixtureGit(root, "init", "--bare", remote);
  fixtureGit(
    target,
    "remote",
    "add",
    "origin",
    "https://github.com/dotln-fixture/target.git",
  );
  const fixturePath = join(root, "fixture.json");
  put(fixturePath, {
    git,
    target,
    remote,
    plantReview: options.plantReview ?? false,
    calls: join(root, "calls.jsonl"),
    published: join(root, "published.json"),
    body: "The check is failing: make `fixture.txt` contain changed by synthetic worker.",
    ...options.forge,
  });
  put(join(root, "calls.jsonl"), "");
  const previous = {
    PATH: process.env.PATH,
    DOTLN_VERTICAL_FIXTURE: process.env.DOTLN_VERTICAL_FIXTURE,
  };
  for (const name of ["git", "gh"]) {
    put(
      join(bin, name),
      `#!${process.execPath}\nimport ${JSON.stringify(join(TOOL_ROOT, "scripts/fixtures/vertical", `${name}.mjs`))};\n`,
    );
    chmodSync(join(bin, name), 0o755);
  }
  process.env.PATH = `${bin}:${process.env.PATH}`;
  process.env.DOTLN_VERTICAL_FIXTURE = fixturePath;
  let at = 100;
  const now = () => at;
  const grant = {
    grantId: "operator.vertical",
    version: 1,
    grantedBy: "operator",
    effects: ["repo.push", "pr.open", "pr.thread.resolve"],
    operations: ["repo.push", "pr.open", "pr.thread.resolve"],
    repo: target,
    reason: "Synthetic target publication",
  };
  if (options.mixedGrant) {
    grant.effects.push("repo.read");
    grant.operations.push("repo.read");
  }
  const portfolio = {
    class: "intent",
    version: 1,
    repo: "scratch",
    surfaces: ["fixture.txt"],
    phases: { probe: { effects: [...VERTICAL_EFFECTS], files: 1 } },
    budget: { episodes: 2, wallMs: 600000, ...options.budget },
    verification: { intent: ["node fixture-test.mjs"] },
  };
  const envelope = {
    authorityEnvelopeId: "fixture.vertical",
    allowedEffects: [...VERTICAL_EFFECTS],
    deniedEffects: ["repo.delete"],
    resourceLimits: { files: 8, writers: 1, lines: 200, tokens: 1000 },
    requiredEvidence: [],
    expiresAt: 1000000,
    revocationEventTypes: ["AuthorityRevoked"],
  };
  put(join(launchpad, "dotln.config.json"), {
    version: 1,
    repositories: {
      scratch: {
        baseBranch: "main",
        worktreeParent: "../trees",
        repositoryClass: "scratch",
        authorityProfile: envelope,
      },
    },
    portfolios: { vertical: portfolio },
  });
  put(
    docPath(launchpad, "planning", "sequence.md"),
    "# Sequence\n\n<!-- dotln-work-order-sequence:start -->\n<!-- dotln-work-order-sequence:end -->\n",
  );
  mkdirSync(docPath(launchpad, "workOrders"), { recursive: true });
  put(
    join(launchpad, ".gitignore"),
    `${docRelative(launchpad, "control", "local")}/\n`,
  );
  put(join(launchpad, "packages/skeleton/loadouts/grants.json"), [
    grant,
    ...(options.extraHostGrant
      ? [{ ...grant, grantId: "operator.unrelated", repo: "unrelated-target" }]
      : []),
  ]);
  put(
    docPath(launchpad, "control", "outward-vocabulary.json"),
    json(docPath(TOOL_ROOT, "control", "outward-vocabulary.json")),
  );
  put(
    docPath(launchpad, "control", "local", "terms.txt"),
    "fixture-secret-word\n",
  );
  fixtureGit(launchpad, "init", "--initial-branch=main");
  fixtureGit(launchpad, "add", ".");
  fixtureGit(launchpad, "commit", "-m", "Fixture base");
  const filed = await fileIntent(
    "Implement https://github.com/dotln-fixture/target/issues/1",
    { root: launchpad, sourceId: "vertical-fixture" },
  );
  const presence = json(
    join(TOOL_ROOT, "packages/skeleton/fixtures/wo100-portfolio.json"),
  );
  const active = presence.graph.activeMechanics[0];
  active.authorityEnvelope = envelope;
  active.workOrder.allowedOperations = [...VERTICAL_EFFECTS];
  active.workOrder.prohibitedOperations = ["repo.delete"];
  presence.graph.authorityGrants = [grant];
  const policy = presence.graph.presence[0];
  policy.decay.idleMs = options.idleMs ?? 100000;
  policy.phases = [policy.phases[0]];
  const phase = policy.phases[0];
  if (options.onReturn) phase.inFlightOnReturn = options.onReturn;
  phase.envelope.allowedEffects = [...VERTICAL_EFFECTS];
  phase.envelope.resourceLimits.writers = 1;
  presence.environment.repo = target;
  presence.environment.baseCommit = fixtureGit(target, "rev-parse", "HEAD");
  presence.environment.authorityGrantRegistry = [grant];
  const resident = decodeResidentConfiguration({
    ...presence,
    policyId: policy.policyId,
    actors: {
      probe: {
        kind: "portfolio",
        effect: "repo.write",
        surface: "fixture.source",
        resources: { files: 1, lines: 0, tokens: 0 },
      },
    },
    evidence: ["verified-input"],
    portfolio: {
      definition: loadConfig(launchpad).portfolios.vertical,
      baseCommit: presence.environment.baseCommit,
    },
  });
  const result = await fetchIssueBundle(
    "https://github.com/dotln-fixture/target",
    1,
    { directory: join(root, "initial-bundle"), cwd: launchpad },
  );
  const inferences = result.bundle.sections.map((s) => ({
    span: s.span,
    class:
      s === result.bundle.sections[0] || options.failureAsRequirement
        ? "requirement"
        : "current-behavior observation",
    rationale:
      "Fixture classifier double distinguishes the request from observed behavior.",
  }));
  const config = {
    schemaVersion: 1,
    conventionsPath: "CONVENTIONS.md",
    target,
    repositoryId: "github.com/dotln-fixture/target",
    worktreeParent: join(root, "trees"),
    phaseId: "probe",
    profile: {
      architecture: [],
      commands: [{ command: "node fixture-test.mjs", directories: ["."] }],
    },
    issues: [
      {
        number: 1,
        draftId: filed.workOrderId,
        inferences,
        revisionId: result.bundle.revisionId,
        ...(!options.omitBaselineAssessment
          ? {
              baselineAssessment: fixtureBaselineAssessment(
                result.bundle,
                inferences,
                options.baselineKind ?? "existing-failure",
              ),
            }
          : {}),
      },
    ],
    workers: {
      transport: "codex-cli-exec",
      model: "process-double",
      effort: "max",
    },
  };
  put(join(directory, "vertical.json"), config);
  put(join(directory, "resident.json"), resident);
  const counts = { baseline: 0, verification: 0, review: 0 };
  const evidenceTransport = {
    name: "fake",
    harnessVersion: "not-applicable",
    dispatch(request, clock) {
      const kind = request.review
        ? "review"
        : request.baseline?.kind === "baseline"
          ? "baseline"
          : "verification";
      counts[kind]++;
      const envelope = {
        workOrderId: request.workOrder.workOrderId,
        episodeId: request.episodeId,
        resultId: `result_${request.command.commandId}`,
        status: "completed",
        summary: "Fixture independent evidence actor.",
        requiresHuman: false,
      };
      let value;
      if (kind === "baseline")
        value = {
          kind: "baseline",
          subjectRevision: request.capsule.subject.revision,
          envelope,
        };
      else if (kind === "review")
        value = {
          kind: "review",
          subjectRevision: request.capsule.subject.revision,
          findings: options.reviewFindings?.(request, counts.review) ?? [],
          envelope,
        };
      else {
        value = fixtureVerificationResult(
          request.capsule,
          request.episodeId,
          envelope.resultId,
        );
        if (request.baseline?.kind === "comparison")
          value.baselineFindings = compareBaseline(
            request.baseline,
            request.capsule,
          );
      }
      const completed =
        kind === "review" && counts.review <= (options.reviewFailures ?? 0)
          ? Promise.reject(new Error("fixture review unavailable"))
          : Promise.resolve().then(() => parseEvidenceResult(value, request));
      return {
        receipt: Promise.resolve({
          commandId: request.command.commandId,
          transport: "fake",
          acceptedAt: clock(),
        }),
        completed,
        alive: () => false,
        kill() {},
      };
    },
  };
  const writer = new CodexCliExecWorkOrderTransport((launch) => {
    appendFileSync(join(root, "launches.txt"), "dispatch\n");
    return runWorkerProcess({
      ...launch,
      binary: process.execPath,
      args: [join(TOOL_ROOT, "scripts/fixtures/vertical/writer.mjs")],
    });
  }, "0.154.0");
  const external = {
    writer,
    verifier: evidenceTransport,
    reviewer: evidenceTransport,
    waitUntil(deadline) {
      at = Math.max(at, deadline);
    },
    onError(step, error) {
      console.error(`Fixture ${step}:`, error.message);
    },
  };
  console.log(`WO-123 scratch repositories: ${root}`);
  return {
    root,
    launchpad,
    directory,
    filed,
    resident,
    config,
    result,
    now,
    external,
    counts,
    target,
    tick: () => ++at,
    setTime: (value) => {
      at = value;
    },
    close() {
      for (const [key, value] of Object.entries(previous)) {
        if (value === undefined) delete process.env[key];
        else process.env[key] = value;
      }
      if (!process.env.DOTLN_KEEP_VERTICAL) disposeRepairFixture(root);
    },
  };
}
