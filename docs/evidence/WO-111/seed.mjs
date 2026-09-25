#!/usr/bin/env node
// Create the WO-111 public synthetic target and an isolated control launchpad.
// Physical locations stay in ignored local state; this file is the generator.
import { execFileSync } from "node:child_process";
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { TOOL_ROOT, docRelative } from "../../../scripts/lib/config.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const local = join(TOOL_ROOT, "docs/control/local/wo111");
const fixture = JSON.parse(
  readFileSync(
    join(
      TOOL_ROOT,
      "packages/skeleton/fixtures/wo119-discovery/repository.json",
    ),
    "utf8",
  ),
);
const presence = JSON.parse(
  readFileSync(
    join(TOOL_ROOT, "packages/skeleton/fixtures/wo100-portfolio.json"),
    "utf8",
  ),
);
const WRITE = ["git.local", "repo.read", "repo.write", "shell.run"];
const git = (cwd, ...args) =>
  execFileSync(
    "git",
    [
      "-c",
      "core.hooksPath=/dev/null",
      "-c",
      "commit.gpgsign=false",
      "-c",
      "user.name=Fixture",
      "-c",
      "user.email=fixture@example.invalid",
      ...args,
    ],
    {
      cwd,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
      timeout: 15_000,
    },
  ).trim();
const put = (root, path, value) => {
  const at = join(root, path);
  mkdirSync(dirname(at), { recursive: true });
  writeFileSync(at, value);
};

export function prepare(returnProof = false) {
  if (
    realpathSync(process.cwd()) !== TOOL_ROOT ||
    git(TOOL_ROOT, "rev-parse", "--show-toplevel") !== TOOL_ROOT
  )
    throw new Error("run from the selected DotLn Git root");
  const root = realpathSync(mkdtempSync(join(tmpdir(), "dotln-wo111-")));
  const target = join(root, "target");
  const launchpad = join(root, "launchpad");
  mkdirSync(target);
  mkdirSync(launchpad);
  mkdirSync(join(root, "trees", "sentinel"), { recursive: true });
  put(root, "trees/sentinel/keep.txt", "WO-111 synthetic sentinel\n");
  for (const [path, source] of Object.entries(fixture.files))
    put(target, path, source);
  put(
    target,
    "checks/move.cjs",
    "const fs = require('node:fs'); const assert = require('node:assert/strict'); assert.equal(fs.existsSync('loose/guide.md'), false); assert.equal(fs.readFileSync('docs/guide.md', 'utf8'), 'Move this documented guide into docs.\\n');\n",
  );
  if (returnProof)
    put(
      target,
      "checks/standard.cjs",
      "const assert = require('node:assert/strict'); const fs = require('node:fs'); assert.match(fs.readFileSync('src/main.js', 'utf8'), /assert\\.equal\\(module\\.exports, 1\\)/);\n",
    );
  put(
    target,
    ".dotln/discovery.json",
    `${JSON.stringify(
      {
        checks: ["lint", "test"].map((kind) => ({
          kind,
          argv: [process.execPath, `checks/${kind}.cjs`],
          paths: ["src/main.js"],
        })),
        ...fixture.conventions,
      },
      null,
      2,
    )}\n`,
  );
  git(target, "init", "-q", "--initial-branch=main");
  git(target, "config", "user.name", "Fixture");
  git(target, "config", "user.email", "fixture@example.invalid");
  git(target, "config", "commit.gpgsign", "false");
  git(target, "config", "core.hooksPath", "/dev/null");
  git(target, "add", "-A");
  git(target, "commit", "-qm", "Synthetic 5S baseline");
  const baseCommit = git(target, "rev-parse", "HEAD");

  const graph = structuredClone(presence.graph);
  graph.loadoutId = "wo111.presence";
  graph.activeMechanics[0].authorityEnvelope.expiresAt =
    Date.now() + 24 * 60 * 60 * 1000;
  const policy = graph.presence[0];
  policy.policyId = "wo111.portfolio";
  policy.decay.idleMs = 2 * 60 * 60 * 1000;
  const discovery = structuredClone(policy.phases[0]);
  discovery.phaseId = "discovery";
  const probe = structuredClone(policy.phases[1]);
  probe.phaseId = "probe";
  probe.scope.changeSize.files = 1;
  probe.envelope.resourceLimits.files = 1;
  const widen = structuredClone(policy.phases[1]);
  widen.phaseId = "widen";
  widen.attentionPriority = 3;
  const peak = structuredClone(policy.phases[2]);
  peak.attentionPriority = 4;
  for (const phase of [discovery, probe, widen, peak])
    phase.entry.cadence.delayMs = 1000;
  if (returnProof) probe.entry.cadence.delayMs = 300_000;
  policy.phases = [discovery, probe, widen, peak];
  const template = {
    graph,
    environment: {
      ...presence.environment,
      repo: "scratch",
      baseCommit,
      capabilities: ["adapter.fixture"],
    },
    policyId: policy.policyId,
    actors: {
      discovery: {
        kind: "script",
        effect: "repo.inspect",
        surface: "fixture.source",
        resources: { files: 1, lines: 0, tokens: 0 },
        command: [
          process.execPath,
          join(TOOL_ROOT, "packages/skeleton/dist/src/discovery-cli.js"),
          target,
        ],
        cwd: target,
        timeoutMs: 20_000,
        outputContract: "work-candidates-v1",
      },
      probe: {
        kind: "portfolio",
        effect: "repo.write",
        surface: "fixture.source",
        resources: { files: 1, lines: 0, tokens: 0 },
      },
      widen: {
        kind: "portfolio",
        effect: "repo.write",
        surface: "fixture.source",
        resources: { files: 1, lines: 0, tokens: 0 },
      },
      peak: {
        kind: "portfolio",
        effect: "repo.write",
        surface: "fixture.source",
        resources: { files: 2, lines: 0, tokens: 0 },
      },
    },
    evidence: ["verified-input"],
  };
  put(root, "resident-template.json", `${JSON.stringify(template, null, 2)}\n`);

  const profile = {
    authorityEnvelopeId: "wo111.scratch",
    allowedEffects: [...WRITE, "repo.inspect"],
    deniedEffects: ["repo.delete"],
    resourceLimits: { files: 8, lines: 200, tokens: 1000, writers: 1 },
    requiredEvidence: ["verified-input"],
    expiresAt: graph.activeMechanics[0].authorityEnvelope.expiresAt,
    revocationEventTypes: ["AuthorityRevoked"],
  };
  const definition = {
    version: 1,
    repo: "scratch",
    mechanics: returnProof
      ? ["shine", "sort", "standardize"]
      : ["shine", "sort"],
    surfaces: ["src", "docs", "loose/guide.md"],
    phases: Object.fromEntries(
      ["probe", "widen", "peak"].map((id) => [
        id,
        { effects: WRITE, files: id === "peak" ? 2 : 1 },
      ]),
    ),
    budget: { episodes: returnProof ? 4 : 3, wallMs: 60 * 60 * 1000 },
    verification: {
      "failing-lint": [`${process.execPath} checks/lint.cjs`],
      "failing-test": [`${process.execPath} checks/test.cjs`],
      "misplaced-file": [`${process.execPath} checks/move.cjs`],
      ...(returnProof
        ? { "repeated-repair": [`${process.execPath} checks/standard.cjs`] }
        : {}),
    },
  };
  const config = {
    version: 1,
    repositories: {
      scratch: {
        baseBranch: "main",
        worktreeParent: "../trees",
        repositoryClass: "scratch",
        authorityProfile: profile,
      },
    },
    portfolios: { "gardener-5s": definition },
  };
  put(launchpad, "dotln.config.json", `${JSON.stringify(config, null, 2)}\n`);
  put(launchpad, "packages/skeleton/loadouts/grants.json", "[]\n");
  put(
    launchpad,
    docRelative(launchpad, "planning", "sequence.md"),
    "# Sequence\n\n<!-- dotln-work-order-sequence:start -->\n<!-- dotln-work-order-sequence:end -->\n",
  );
  mkdirSync(join(launchpad, docRelative(launchpad, "workOrders")), {
    recursive: true,
  });
  put(
    launchpad,
    ".gitignore",
    `${docRelative(launchpad, "control", "local")}/\n`,
  );
  git(launchpad, "init", "-q", "--initial-branch=main");
  git(launchpad, "config", "user.name", "Fixture");
  git(launchpad, "config", "user.email", "fixture@example.invalid");
  git(launchpad, "config", "commit.gpgsign", "false");
  git(launchpad, "config", "core.hooksPath", "/dev/null");
  git(launchpad, "add", ".");
  git(launchpad, "commit", "-qm", "Synthetic control launchpad");
  mkdirSync(local, { recursive: true });
  writeFileSync(
    join(local, returnProof ? "return-location.json" : "location.json"),
    `${JSON.stringify({ root, target, launchpad, baseCommit }, null, 2)}\n`,
    { flag: "wx", mode: 0o600 },
  );
  return { root, target, launchpad, baseCommit };
}

if (
  process.argv[1] &&
  realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  if (
    process.argv[2] !== "prepare" ||
    (process.argv[3] && process.argv[3] !== "--return-proof")
  )
    throw new Error(
      "usage: node docs/evidence/WO-111/seed.mjs prepare [--return-proof]",
    );
  prepare(process.argv[3] === "--return-proof");
  console.log(
    "Prepared the WO-111 scratch target and control launchpad; physical location retained in ignored local state.",
  );
}
