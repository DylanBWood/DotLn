import { execFileSync } from "node:child_process";
import {
  appendFileSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { WorkerStore } from "../src/worker-store.js";
import {
  SOURCE_CHANGE_DENIED,
  type WorkerRequest,
} from "../src/worker-protocol.js";
import {
  ClaudeCliPrintWorkOrderTransport,
  CodexCliExecWorkOrderTransport,
  runWorkerProcess,
  type ProcessRunner,
} from "../src/worker-transport.js";
import type { SourceChangeHostOptions } from "../src/source-change-host.js";

export const launchpad = realpathSync(
  fileURLToPath(new URL("../../../../", import.meta.url)),
);
export const fixtureGit = (cwd: string, ...args: string[]): string =>
  execFileSync(
    "git",
    ["-c", "core.hooksPath=/dev/null", "-c", "commit.gpgsign=false", ...args],
    {
      cwd,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
      env: {
        ...process.env,
        GIT_AUTHOR_NAME: "Fixture",
        GIT_AUTHOR_EMAIL: "fixture@example.invalid",
        GIT_COMMITTER_NAME: "Fixture",
        GIT_COMMITTER_EMAIL: "fixture@example.invalid",
      },
    },
  ).trim();
export function createSourceFixture(): string {
  const root = realpathSync(mkdtempSync(join(tmpdir(), "dotln-source-host-")));
  const repo = join(root, "target");
  mkdirSync(repo);
  mkdirSync(join(root, "trees"));
  mkdirSync(join(root, "trees", "sentinel"));
  writeFileSync(join(root, "trees", "sentinel", "keep.txt"), "untouched\n");
  fixtureGit(repo, "init", "--initial-branch=main");
  writeFileSync(join(repo, "fixture.txt"), "baseline\n");
  writeFileSync(
    join(repo, "fixture-test.mjs"),
    "import assert from 'node:assert/strict'; import {readFileSync} from 'node:fs'; assert.equal(readFileSync('fixture.txt','utf8'), 'changed by synthetic worker\\n');\n",
  );
  fixtureGit(repo, "add", "-A");
  fixtureGit(repo, "commit", "-m", "Synthetic target baseline");
  writeFileSync(join(root, "base.txt"), fixtureGit(repo, "rev-parse", "HEAD"));
  writeFileSync(join(root, "launches.txt"), "");
  return root;
}
export function sourceFixtureOptions(
  root: string,
  now: () => number,
  behavior = "commit",
  name: "claude" | "codex" = "codex",
): SourceChangeHostOptions {
  const baseline = JSON.parse(
    readFileSync(
      join(
        launchpad,
        "packages/skeleton/fixtures/wo051-inspection-baseline.json",
      ),
      "utf8",
    ),
  ) as { request: WorkerRequest };
  const runner: ProcessRunner = (launch) => {
    appendFileSync(join(root, "launches.txt"), "dispatch\n");
    return runWorkerProcess({
      ...launch,
      binary: process.execPath,
      args: [
        join(launchpad, "packages/skeleton/fixtures/source-change-cli.mjs"),
        name,
        behavior,
      ],
    });
  };
  return {
    store: new WorkerStore(join(root, "store")),
    workOrder: {
      ...baseline.request.workOrder,
      workOrderId: "wo_source_fixture",
      repo: join(root, "target"),
      baseCommit: readFileSync(join(root, "base.txt"), "utf8"),
      allowedOperations: ["repo.write", "git.local", "shell.run"],
      prohibitedOperations: [...SOURCE_CHANGE_DENIED],
      requiredEvidence: [],
    },
    authorityEnvelope: {
      authorityEnvelopeId: "fixture.source",
      allowedEffects: ["repo.write", "git.local", "shell.run"],
      deniedEffects: [...SOURCE_CHANGE_DENIED],
      resourceLimits: { writers: 1 },
      requiredEvidence: [],
      expiresAt: 1_000_000,
      revocationEventTypes: [],
    },
    authorityEvidence: [],
    artifactIdentity: baseline.request.artifactIdentity,
    branch: "source-fixture",
    surfaces: ["fixture.txt"],
    worktreeParent: join(root, "trees"),
    launchpadCheckout: launchpad,
    testCommand: "node fixture-test.mjs",
    commitMessage: "Synthetic source change\n",
    model: "required-model",
    effort: "xhigh",
    transport:
      name === "claude"
        ? new ClaudeCliPrintWorkOrderTransport(runner, "2.1.270")
        : new CodexCliExecWorkOrderTransport(runner, "0.154.0"),
    now,
  };
}
