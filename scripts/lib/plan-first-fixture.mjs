import {
  appendFileSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
  symlinkSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { TOOL_ROOT, docPath, docRelative } from "./config.mjs";
import { createFixtureRoot, removeTemporaryPath } from "./temporary-roots.mjs";
import { runGit } from "./git.mjs";
import { write } from "./helpers.mjs";
import {
  selectedPlanState,
  planFirstContext,
  draftPlanCandidate,
  candidateDiff,
  planDigest,
  planMarker,
  proposalPatch,
  proposedPlan,
} from "./plan-first.mjs";
const date = "2026-11-06T00:00:00.000Z";
export function planFixture(targetOrder = false) {
  const base = createFixtureRoot(join(tmpdir(), "dotln-plan-test-"));
  const root = join(base, "launchpad");
  const target = targetOrder ? join(base, "target") : root;
  const config = {
    version: 1,
    features: { "plan-first": true },
    ...(targetOrder
      ? {
          classes: { fixture: { checks: [], supports: [] } },
          repositories: {
            fixture: {
              baseBranch: "main",
              worktreeParent: "../targets",
              repositoryClass: "fixture",
              authorityProfile: {
                authorityEnvelopeId: "fixture",
                allowedEffects: ["repo.read", "repo.write", "repo.test"],
                deniedEffects: ["repo.push"],
                resourceLimits: {},
                requiredEvidence: [],
                expiresAt: Number.MAX_SAFE_INTEGER,
                revocationEventTypes: [],
              },
              documentationRoot: "guide",
            },
          },
        }
      : {}),
  };
  for (const repo of new Set([root, target])) {
    mkdirSync(repo);
    runGit(repo, ["init", "--quiet", "-b", "wo-099"]);
    write(
      repo,
      ".gitignore",
      `${docRelative(repo, "control", "local")}/\n${docRelative(repo, "intake")}/\n.dotln-owner.json\n`,
    );
    write(repo, "hello.txt", "Hello.\n");
    runGit(repo, ["add", "."]);
    runGit(repo, [
      "-c",
      "user.name=Fixture",
      "-c",
      "user.email=fixture@example.invalid",
      "-c",
      "commit.gpgsign=false",
      "commit",
      "--quiet",
      "-m",
      "fixture",
    ]);
  }
  runGit(root, [
    "worktree",
    "add",
    "--quiet",
    "-b",
    "main",
    join(base, "main"),
  ]);
  symlinkSync(join(TOOL_ROOT, "scripts"), join(root, "scripts"));
  write(root, "dotln.config.json", JSON.stringify(config));
  write(
    root,
    docRelative(root, "control", "outward-vocabulary.json"),
    JSON.stringify({ types: ["feat"], reviewTerms: [] }),
  );
  write(
    root,
    docRelative(root, "workOrders", "WO-099-test.md"),
    "# Fixture\n\n**Model:** fixture\n**Effort:** executor max; verifier max; reviewer max.\n\n**Objective:** greeting.\n",
  );
  const activation = {
    type: "WorkOrderActivated",
    schemaVersion: 1,
    recordedAt: date,
    workOrderId: "WO-099",
    workOrderPath: docRelative(root, "workOrders", "WO-099-test.md"),
    ...(targetOrder
      ? {
          repositoryId: "fixture",
          baseCommit: runGit(target, ["rev-parse", "HEAD"]),
          documentationRoot: "guide",
        }
      : {}),
  };
  write(
    root,
    docRelative(root, "control", "orders/WO-099.jsonl"),
    JSON.stringify(activation) + "\n",
  );
  if (targetOrder)
    write(
      root,
      docRelative(root, "control", "local/target-worktrees.json"),
      JSON.stringify({
        [target]: {
          workOrderId: "WO-099",
          repositoryId: "fixture",
          branch: "wo-099",
          launchpad: root,
          target,
        },
      }),
    );
  const state = () => selectedPlanState(root, "WO-099");
  const env = Object.fromEntries(
    Object.entries(process.env).filter(
      ([key]) => !/^(?:CLAUDE|CODEX|COPILOT|DOTLN_|GIT_)/.test(key),
    ),
  );
  const call = (args) =>
    spawnSync(
      process.execPath,
      [join(TOOL_ROOT, "scripts/resume.mjs"), ...args],
      { cwd: root, env: { ...env, DOTLN_LAUNCHPAD: root }, encoding: "utf8" },
    );
  const append = (event) =>
    appendFileSync(
      docPath(root, "control", "orders/WO-099.jsonl"),
      JSON.stringify({ recordedAt: date, workOrderId: "WO-099", ...event }) +
        "\n",
    );
  const candidate = draftPlanCandidate(root, state(), base);
  const context = planFirstContext(root, state());
  mkdirSync(context.directory, { recursive: true });
  writeFileSync(
    join(context.directory, "conversation.md"),
    `### ${date} — Operator\n\nPlease improve the greeting.\n`,
  );
  const propose = (transformations = [], revision = date) => {
    const diff = candidateDiff(root, state()).diff;
    const marker = planMarker({
      status: "proposed",
      proposedAt: revision,
      conversationDigest: planDigest(
        readFileSync(join(context.directory, "conversation.md")),
      ),
      transformations,
    });
    writeFileSync(
      join(context.directory, "plan.md"),
      marker +
        "# Greeting plan\n\nChange hello.txt to use a friendly greeting. The text file interface stays the same. Keep the existing greeting or make it friendly; choose friendly as requested. No unresolved questions.\n",
    );
    writeFileSync(
      join(context.directory, "proposal.md"),
      marker +
        "# Greeting proposal\n\nhello.txt: make the greeting friendly.\n\n" +
        proposalPatch(diff),
    );
    return proposedPlan(root, state());
  };
  return {
    base,
    root,
    target,
    config,
    candidate,
    context,
    state,
    call,
    append,
    propose,
    cleanup: () => removeTemporaryPath(base, { recursive: true, force: true }),
  };
}
