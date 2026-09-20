import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import type { ActorSpec } from "../src/actor-contract.js";
import { buildMissionCheckRequest } from "../src/mission-check-host.js";
import {
  type MissionCheckObserved,
  type MissionSource,
} from "../src/mission-check-protocol.js";
import {
  missionPinFromSource,
  observeMissionSubject,
} from "../src/mission-check-source.js";
import { decodeResidentConfiguration } from "../src/resident-state.js";
import type { ProcessRunner } from "../src/worker-transport.js";

export const MISSION_SURFACE = "fixture.mission";
const CONTRACT = `# WO-999 — Fixture order

**Objective:** Add the fixture judge to the declared surface and nothing else.

**Acceptance criteria (all required)**

1. The judge reads its capsule and returns a typed verdict.
2. The fixture records what it observed.

**Non-goals:** Editing the product documents; repairing anything.

**Evidence gate:** the fixture transcript.
`;
const VISION = `# Fixture vision

## The core bet

A local-first compiler and runtime the operator owns.

## What DotLn is not

- Not a hosted service that keeps the operator's work on someone else's host.
- Not a chat wrapper.

## Elsewhere

Unrelated.
`;
const DECISIONS = `# WO-999 decisions

## WO-999-D001

\`\`\`json
{ "id": "WO-999-D001", "decision": "Pin the capsule at declaration and observe the diff at dispatch." }
\`\`\`
`;

export function missionFixture(
  options: {
    outsideSurface?: boolean;
    transport?: "codex-cli-exec" | "claude-cli-print";
    model?: string;
    effort?: string;
    /** The shape the Contributor build actually declares: the check is the
     * only phase, so the cadence keeps judging while a hold stands. */
    missionOnly?: boolean;
    /** The decisions file at the baseline commit, when a test needs one other
     * than the fixture's single decision. */
    history?: string;
    /** Ignore rules and the build and runtime trees they already exclude,
     * written and committed before the capsule is pinned. This is the shape of
     * a real worktree the episode supervises: the baseline exists before the
     * actor is declared, so an ordinary rebuild only moves entries the pin
     * already carries (WO-099 VER-005 F1). */
    ignored?: {
      rules: readonly string[];
      baseline: Readonly<Record<string, string>>;
    };
  } = {},
) {
  const root = realpathSync(mkdtempSync(join(tmpdir(), "dotln-mission-")));
  const work = join(root, "work");
  mkdirSync(work);
  const git = (...args: string[]) =>
    execFileSync(
      "git",
      ["-c", "core.hooksPath=/dev/null", "-c", "commit.gpgsign=false", ...args],
      {
        cwd: work,
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
  git("init", "--initial-branch=main");
  mkdirSync(join(work, "docs/work-orders"), { recursive: true });
  mkdirSync(join(work, "docs/product"), { recursive: true });
  mkdirSync(join(work, "docs/evidence/WO-999"), { recursive: true });
  mkdirSync(join(work, "packages/fixture/src"), { recursive: true });
  const contractPath = "docs/work-orders/WO-999-fixture.md";
  writeFileSync(join(work, contractPath), CONTRACT);
  writeFileSync(join(work, "docs/product/00-vision.md"), VISION);
  writeFileSync(
    join(work, "docs/evidence/WO-999/decisions.md"),
    options.history ?? DECISIONS,
  );
  writeFileSync(
    join(work, "packages/fixture/src/judge.ts"),
    "export const a = 1;\n",
  );
  if (options.ignored)
    writeFileSync(
      join(work, ".gitignore"),
      `${options.ignored.rules.join("\n")}\n`,
    );
  git("add", "-A");
  git("commit", "-m", "fixture baseline");
  const baseCommit = git("rev-parse", "HEAD");
  // The work under judgment: inside the declared surface unless asked otherwise.
  writeFileSync(
    join(work, "packages/fixture/src/judge.ts"),
    "export const a = 2;\n",
  );
  if (options.outsideSurface)
    writeFileSync(
      join(work, "docs/product/00-vision.md"),
      `${VISION}\n## Added by the session\n\nOutside the declared surface.\n`,
    );
  git("add", "-A");
  git("commit", "-m", "fixture work in progress");
  // The excluded trees exist before the capsule is pinned, as they do in a
  // worktree that has already been built once. The rules themselves are part
  // of the base commit, so they are not work this session changed.
  if (options.ignored)
    for (const [path, contents] of Object.entries(options.ignored.baseline)) {
      mkdirSync(dirname(join(work, path)), { recursive: true });
      writeFileSync(join(work, path), contents);
    }
  const source: MissionSource = {
    root: work,
    contractPath,
    decisionsPath: "docs/evidence/WO-999/decisions.md",
    baseCommit,
    declaredSurfaces: ["packages/fixture"],
    decisionLimit: 5,
    visionPath: "docs/product/00-vision.md",
    thesisHeadings: [["the-core-bet", "The core bet"]],
  };
  const pin = missionPinFromSource(source, "WO-999");
  const subject = observeMissionSubject(source, pin);
  const request = buildMissionCheckRequest({
    subject,
    model: options.model ?? "fixture-model",
    effort: options.effort ?? "xhigh",
    cwd: work,
    episodeId: "template_episode",
    at: 0,
  });
  const mission: ActorSpec = {
    kind: "cli-worker",
    effect: "repo.read",
    surface: MISSION_SURFACE,
    resources: { files: 0, lines: 0 },
    worker: { transport: options.transport ?? "codex-cli-exec", request },
    missionSource: source,
  };
  const workActor: ActorSpec = {
    kind: "script",
    effect: "repo.read",
    surface: MISSION_SURFACE,
    resources: { files: 0, lines: 0 },
    command: [process.execPath, "-e", "process.stdout.write('ok\\n')"],
    cwd: work,
    timeoutMs: 1000,
    expectedStdoutSha256: createHash("sha256").update("ok\n").digest("hex"),
  };
  const graph = JSON.parse(
    readFileSync(
      new URL("../../fixtures/wo067-presence.json", import.meta.url),
      "utf8",
    ),
  );
  const effects = ["repo.read"];
  graph.graph.activeMechanics[0].authorityEnvelope.allowedEffects = effects;
  graph.graph.activeMechanics[0].authorityEnvelope.resourceLimits = {
    files: 0,
    lines: 0,
  };
  graph.graph.activeMechanics[0].workOrder.allowedOperations = effects;
  graph.graph.role.permissions = effects;
  graph.graph.presence[0].decay.idleMs = 600_000;
  const phase = (phaseId: string) => ({
    ...structuredClone(graph.graph.presence[0].phases[0]),
    phaseId,
    entry: { cadence: { kind: "After", delayMs: 10 } },
    scope: {
      surfaces: [MISSION_SURFACE],
      changeSize: { files: 0, lines: 0 },
      budget: {},
    },
    envelope: {
      allowedEffects: effects,
      resourceLimits: { files: 0, lines: 0 },
    },
    requiredCapabilities: ["adapter.fixture"],
    discretionary: true,
    inFlightOnReturn: "kill",
  });
  // Work first, then the check: a check that is not `on-mission` never
  // verifies, so the curve resets and the refused dispatch is the work itself.
  // `missionOnly` drops the work phase, which is what the Contributor build
  // declares: the check is then the phase the cadence keeps returning to.
  graph.graph.presence[0].phases = options.missionOnly
    ? [phase("mission-check")]
    : [phase("work"), phase("mission-check")];
  const configuration = decodeResidentConfiguration({
    ...graph,
    policyId: "fixture.progressive",
    actors: options.missionOnly
      ? { "mission-check": mission }
      : { work: workActor, "mission-check": mission },
    evidence: ["verified-input"],
  });
  return {
    root,
    work,
    git,
    source,
    pin,
    subject,
    request,
    contractPath,
    configuration,
    directory: join(root, "resident"),
    editContract: () =>
      writeFileSync(
        join(work, contractPath),
        CONTRACT.replace(
          "The judge reads its capsule and returns a typed verdict.",
          "The judge reads its capsule and returns a typed verdict and a repair.",
        ),
      ),
    restoreContract: () => writeFileSync(join(work, contractPath), CONTRACT),
    /** Undo an `outsideSurface` edit: the work returns inside its contract. */
    restoreVision: () =>
      writeFileSync(join(work, "docs/product/00-vision.md"), VISION),
    dispose: () => rmSync(root, { recursive: true, force: true }),
  };
}

/** A process double that returns the given judgment on the Codex wire format. */
export const missionRunner =
  (
    judgment: (subject: { hash: string }) => MissionCheckObserved,
  ): ProcessRunner =>
  (launch) => {
    const prompt = JSON.parse(launch.input) as {
      subject: { subjectHash: string };
    };
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
            item: {
              type: "agent_message",
              text: JSON.stringify(
                judgment({ hash: prompt.subject.subjectHash }),
              ),
            },
          },
          { type: "turn.completed" },
        ]
          .map((event) => JSON.stringify(event))
          .join("\n"),
      }),
    };
  };
export const unavailableRunner: ProcessRunner = () => ({
  accepted: Promise.resolve(),
  alive: () => false,
  kill: () => {},
  completed: Promise.resolve({
    exitCode: 1,
    stderr: "model not found",
    stdout: "",
  }),
});
