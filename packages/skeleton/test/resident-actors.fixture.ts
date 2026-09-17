import { execFileSync } from "node:child_process";
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { sourceChangeProfile } from "../src/source-change-environment.js";
import {
  SOURCE_CHANGE_DENIED,
  type WorkerRequest,
  type WriterRequest,
} from "../src/worker-protocol.js";
import { decodeResidentConfiguration } from "../src/resident-state.js";
import type { ActorSpec } from "../src/actor-contract.js";
import type { ProcessRunner } from "../src/worker-transport.js";

export function actorFixture(kind: "writer" | "inspection" = "writer") {
  const root = realpathSync(
    mkdtempSync(join(tmpdir(), "dotln-resident-actors-")),
  );
  const launchpad = join(root, "launchpad"),
    parent = join(root, "trees"),
    cwd = join(parent, "writer");
  mkdirSync(launchpad);
  mkdirSync(parent);
  const git = (directory: string, ...args: string[]) =>
    execFileSync(
      "git",
      ["-c", "core.hooksPath=/dev/null", "-c", "commit.gpgsign=false", ...args],
      {
        cwd: directory,
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
  git(launchpad, "init", "--initial-branch=main");
  writeFileSync(join(launchpad, "fixture.txt"), "baseline\n");
  writeFileSync(
    join(launchpad, "fixture-test.mjs"),
    "import assert from 'node:assert/strict'; import {readFileSync} from 'node:fs'; assert.equal(readFileSync('fixture.txt','utf8'), 'resident changed this fixture\\n');\n",
  );
  git(launchpad, "add", "-A");
  git(launchpad, "commit", "-m", "fixture baseline");
  git(launchpad, "worktree", "add", "-b", "writer", cwd);
  git(cwd, "config", "user.name", "Fixture");
  git(cwd, "config", "user.email", "fixture@example.invalid");
  git(cwd, "config", "commit.gpgsign", "false");
  git(cwd, "config", "core.hooksPath", "/dev/null");
  mkdirSync(join(cwd, ".dotln"));
  writeFileSync(join(launchpad, ".git/info/exclude"), "/.dotln/\n");
  const commitMessagePath = join(cwd, ".dotln/message.txt");
  writeFileSync(commitMessagePath, "Change resident fixture\n");
  const baseline = JSON.parse(
    readFileSync(
      new URL("../../fixtures/wo051-inspection-baseline.json", import.meta.url),
      "utf8",
    ),
  ).request as WorkerRequest;
  const resources = { files: 1, lines: 1, tokens: 200 };
  const effects =
    kind === "writer"
      ? ["repo.inspect", "repo.write", "git.local", "shell.run"]
      : ["repo.inspect", "repo.read"];
  const authority = {
    authorityEnvelopeId: "fixture.resident.writer",
    allowedEffects: effects,
    deniedEffects: [...SOURCE_CHANGE_DENIED],
    resourceLimits: resources,
    requiredEvidence: ["verified-input"],
    expiresAt: Number.MAX_SAFE_INTEGER,
    revocationEventTypes: ["AuthorityRevoked"],
  };
  const request: WriterRequest | WorkerRequest =
    kind === "writer"
      ? {
          kind: "source-change",
          command: {
            ...baseline.command,
            intent: { kind: "Act", effect: "repo.write", payload: {} },
          },
          workOrder: {
            ...baseline.workOrder,
            objective:
              "Change fixture.txt to exactly resident changed this fixture followed by a newline. Run the declared test and commit the change with the host message.",
            acceptanceCriteria: [
              "fixture.txt contains the requested line",
              "The declared test passes",
              "The change is committed with the host message",
            ],
            constraints: [
              "Edit only fixture.txt",
              "Use only the declared test and commit commands",
            ],
            nonGoals: [
              "Remote effects",
              "Any change outside this synthetic worktree",
            ],
            knownFacts: [
              "This is a disposable synthetic fixture",
              `The host verified the physical working directory and Git root as ${realpathSync(cwd)} and ${git(cwd, "rev-parse", "--show-toplevel")}.`,
              "The host wrote fixture.txt with exactly baseline followed by a newline before launch. No other writer is assigned to this worktree.",
            ],
            decisions: ["The host supplied the commit message"],
            repo: cwd,
            baseCommit: git(cwd, "rev-parse", "HEAD"),
            allowedOperations: effects,
            prohibitedOperations: [...SOURCE_CHANGE_DENIED],
          },
          authorityEnvelope: authority,
          artifactIdentity: baseline.artifactIdentity,
          episodeId: "template_episode",
          model: "required-model",
          effort: "xhigh",
          cwd,
          profile: sourceChangeProfile({
            worktree: cwd,
            worktreeParent: parent,
            launchpadCheckout: launchpad,
            commitMessagePath,
          }),
          testCommand: "node fixture-test.mjs",
          commitMessagePath,
        }
      : {
          ...baseline,
          cwd,
          profile: {
            ...baseline.profile,
            mounts: [{ path: cwd, access: "read" }],
          },
          workOrder: { ...baseline.workOrder, allowedOperations: effects },
        };
  const spec: ActorSpec = {
    kind: "cli-worker",
    effect: kind === "writer" ? "repo.write" : "repo.inspect",
    surface: "fixture.source",
    resources,
    worker: { transport: "codex-cli-exec", request },
  };
  const fixture = JSON.parse(
    readFileSync(
      new URL("../../fixtures/wo067-presence.json", import.meta.url),
      "utf8",
    ),
  );
  fixture.graph.activeMechanics[0].authorityEnvelope = authority;
  fixture.graph.activeMechanics[0].workOrder.allowedOperations = effects;
  fixture.graph.activeMechanics[0].workOrder.prohibitedOperations = [
    ...SOURCE_CHANGE_DENIED,
  ];
  fixture.graph.role.permissions = effects;
  fixture.graph.presence[0].decay.idleMs = 600000;
  for (const phase of fixture.graph.presence[0].phases) {
    phase.envelope.allowedEffects = effects;
    phase.envelope.resourceLimits = resources;
    phase.scope = {
      surfaces: ["fixture.source"],
      changeSize: { files: 1, lines: 1 },
      budget: { tokens: 200 },
    };
  }
  const configuration = decodeResidentConfiguration({
    ...fixture,
    policyId: "fixture.progressive",
    actors: { probe: spec, widen: spec, peak: spec },
    evidence: ["verified-input"],
  });
  return {
    root,
    cwd,
    request,
    configuration,
    directory: join(root, "resident"),
    git,
    dispose: () => rmSync(root, { recursive: true, force: true }),
  };
}
export const completedRunner: ProcessRunner = (launch) => {
  const prompt = JSON.parse(launch.input);
  const envelope = {
    workOrderId: prompt.workOrder.workOrderId,
    episodeId: prompt.episodeId,
    resultId: prompt.resultId,
    status: "completed",
    summary: "fixture result",
    requiresHuman: false,
  };
  const result = prompt.mount
    ? { envelope }
    : { envelope, candidates: [], beaconClaim: "inspection-completed" };
  return {
    accepted: Promise.resolve(),
    alive: () => false,
    kill: () => {},
    completed: Promise.resolve({
      exitCode: 0,
      stderr: "",
      stdout: [
        {
          type: "item.completed",
          item: { type: "agent_message", text: JSON.stringify(result) },
        },
        { type: "turn.completed" },
      ]
        .map((e) => JSON.stringify(e))
        .join("\n"),
    }),
  };
};
