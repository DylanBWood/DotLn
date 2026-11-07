// A scripted conversation in the executing session, against an owned fixture.
// It measures the workflow, not a human novice's comprehension or time.
import assert from "node:assert/strict";
import { appendFileSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { performance } from "node:perf_hooks";
import { planFixture } from "../lib/plan-first-fixture.mjs";
import {
  planDigest,
  applyPlanCandidate,
  candidateDiff,
} from "../lib/plan-first.mjs";
import { planFirstBoundary } from "../../packages/skeleton/dist/src/plan-first-boundary.js";
import { write } from "../lib/helpers.mjs";
import { findLaunchpad, docPath, docRelative } from "../lib/config.mjs";

const actor = {
  harness: "codex-cli",
  harnessVersion: "fixture",
  model: "scripted-operator",
  effort: "max",
  source: "operator-attested",
};
const flags = Object.entries(actor).flatMap(([key, value]) => [
  `--${key === "harnessVersion" ? "harness-version" : key}`,
  value,
]);
const f = planFixture(true);
const started = performance.now();
const turns = [];
const call = (args) => {
  const result = f.call(args);
  assert.equal(result.status, 0, result.stderr);
  return result.stdout.replaceAll(f.base, "<fixture>");
};
const record = (operator, agent, diffChanged) => {
  const at = new Date().toISOString();
  appendFileSync(
    join(f.context.directory, "conversation.md"),
    `\n### ${at} — Operator\n\n${operator}\n\n### ${at} — Agent\n\n${agent}\n`,
  );
  f.propose([], at);
  const output = call(["plan-proposed", "WO-099", ...flags]);
  const documents = Object.fromEntries(
    f.context.documents.map(({ name, path }) => [
      name,
      readFileSync(path, "utf8"),
    ]),
  );
  const bytes = Object.fromEntries(
    Object.entries(documents).map(([name, text]) => [
      name,
      Buffer.byteLength(text),
    ]),
  );
  turns.push({
    operator,
    agent,
    diffChanged,
    bytes,
    totalBytes: Object.values(bytes).reduce((a, b) => a + b, 0),
    documents,
    output,
  });
};
try {
  assert.throws(
    () => applyPlanCandidate(f.root, f.state()),
    /PLAN_FIRST_REFUSED/,
  );
  const measure = (enabled) => {
    write(
      f.root,
      "dotln.config.json",
      JSON.stringify({ ...f.config, features: { "plan-first": enabled } }),
    );
    const samples = [];
    for (let i = 0; i < 20; i++) {
      const start = performance.now();
      planFirstBoundary(f.root, "WO-099");
      samples.push(performance.now() - start);
    }
    return {
      samplesMs: samples,
      meanMs: samples.reduce((a, b) => a + b, 0) / samples.length,
    };
  };
  const guardCost = {
    off: measure(false),
    awaiting: measure(true),
    scope:
      "in-process approval judgment called by the hook, 20 sequential calls each; not a whole hook subprocess",
  };
  writeFileSync(join(f.candidate.path, "hello.txt"), "Hello, friend.\n");
  record(
    "Please improve the greeting.",
    "I propose a friendly greeting, preserving the text file and its newline.",
    true,
  );
  record(
    "Does this keep the trailing newline?",
    "Yes. The proposal preserves one trailing newline.",
    false,
  );
  writeFileSync(join(f.candidate.path, "hello.txt"), "Welcome, friend.\n");
  record(
    "Use Welcome, friend. instead.",
    "The greeting now uses Welcome, friend. The complete revised diff follows.",
    true,
  );
  const approval = "Looks good, build it.";
  const capturePath = docRelative(f.root, "intake", "approval.txt");
  write(f.root, capturePath, approval);
  record(
    approval,
    `The operator approved this revision in the scripted terminal turn (capture sha256:${planDigest(approval)}).`,
    false,
  );
  call([
    "plan-approved",
    "WO-099",
    "--capture",
    capturePath,
    "--capture-hash",
    `sha256:${planDigest(approval)}`,
    ...flags,
  ]);
  const acceptedDiff = candidateDiff(f.root, f.state()).diff;
  assert.match(acceptedDiff, /\+Welcome, friend\./);
  const application = applyPlanCandidate(f.root, f.state());
  assert.equal(
    readFileSync(join(f.target, "hello.txt"), "utf8"),
    "Welcome, friend.\n",
  );
  const result = {
    classification: "deterministic mechanism probe",
    operatorKind: "synthetic scripted turns supplied by the work order",
    turns,
    acceptedDiff,
    application,
    guardCost,
    workMs: performance.now() - started,
    waitingMs: 0,
    usage: {
      tokens: null,
      costUsd: null,
      source: "scripted run; model usage belongs to the parent session",
    },
    hostBoundary: {
      claude:
        "generated hook fixture observes refusals; no live Claude session in this run",
      codex:
        "direct writes are a role duty; this session observed the in-process apply refusal and approved application",
      helpers:
        "same freshness judgment as the hook; apply refused before proposal and admitted the approved candidate",
    },
    limitations: [
      "No human novice participated; comprehension and reduced operator burden are unmeasured.",
      "Waiting is zero because every operator turn was scripted.",
    ],
  };
  writeFileSync(
    docPath(findLaunchpad(), "evidence", "WO-242/scripted-mechanism.json"),
    JSON.stringify(result, null, 2) + "\n",
  );
  console.log(
    "Recorded four scripted turns, complete-diff inspection, current approval and successful application; human usability unmeasured.",
  );
} finally {
  f.cleanup();
}
