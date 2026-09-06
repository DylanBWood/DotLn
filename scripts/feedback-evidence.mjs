#!/usr/bin/env node
import assert from "node:assert/strict";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import { canonicalStringify } from "@dotln/compiler";
import { decodeLog, replay } from "@dotln/kernel";
import { personalFeedback } from "../packages/skeleton/dist/src/loadouts/feedback.js";
import {
  readFeedbackSource,
  runFeedbackRegressions,
} from "../packages/skeleton/dist/src/feedback-audit.js";
import {
  initialState,
  seiriReactor,
  feedbackStateFromRuntime,
} from "../packages/skeleton/dist/src/reactor.js";
import { projectAcceptanceEvidenceMatrices } from "../packages/skeleton/dist/src/verification.js";

const root = fileURLToPath(new URL("../", import.meta.url));
const destination = join(root, "docs/evidence/WO-011");
const args = process.argv.slice(2);
const mode = args[0];
if (!(
  (args.length === 1 && ["--write", "--check"].includes(mode)) ||
  (args.length === 2 && mode === "--record-selfhost")
))
  throw new Error(
    "usage: feedback-evidence.mjs --write|--check|--record-selfhost <store> (build first)",
  );
const json = (value) => JSON.stringify(value, null, 2) + "\n";
function validateSelfhost(auditLog, verifierLog) {
  const audit = feedbackStateFromRuntime(
    replay(initialState(), decodeLog(auditLog), seiriReactor, {}).state,
  );
  assert.equal(
    audit.subject,
    readFeedbackSource(root).subject,
    "selfhost audit source is stale",
  );
  assert.equal(
    audit.program.policyHash,
    personalFeedback().policyHash,
    "selfhost policy is stale",
  );
  assert.equal(
    json(audit.result),
    readFileSync(join(destination, "feedback.json"), "utf8"),
  );
  const events = decodeLog(verifierLog);
  const selection = events.find(
    (event) => event.type === "VerificationHostConfigured",
  )?.payload;
  assert.ok(
    ["claude-cli-print", "codex-cli-exec"].includes(selection?.transport),
    "recorded selfhost requires a live CLI verifier",
  );
  const matrix = projectAcceptanceEvidenceMatrices(events)[0];
  assert.equal(matrix?.phase, "complete");
  assert.ok(matrix.rows.every((row) => row.status === "verified"));
  const opening = events.find(
    (event) => event.type === "VerificationOpened",
  )?.payload;
  const report = opening?.subject.files.find(
    (file) => file.path === "docs/evidence/WO-011/feedback.json",
  );
  assert.equal(
    report?.contents,
    json(audit.result),
    "verifier did not judge this audit",
  );
  const current = readFeedbackSource(root);
  for (const file of current.files)
    assert.equal(
      opening.subject.files.find((entry) => entry.path === file.path)?.contents,
      file.contents,
      "verifier source is stale",
    );
  assert.notEqual(
    matrix.rows[0].evaluations.at(-1).episodeId,
    "ep_feedback_executor",
  );
  return matrix;
}
if (mode === "--record-selfhost") {
  const auditLog = readFileSync(join(args[1], "audit/events.jsonl"), "utf8");
  const verifierLog = readFileSync(
    join(args[1], "verifier/events.jsonl"),
    "utf8",
  );
  validateSelfhost(auditLog, verifierLog);
  writeFileSync(join(destination, "selfhost-audit.jsonl"), auditLog);
  writeFileSync(join(destination, "selfhost-verification.jsonl"), verifierLog);
  console.log(
    "Recorded the audited selfhost and independent verifier event streams.",
  );
} else {
  const report = runFeedbackRegressions(root, personalFeedback());
  if (mode === "--write") {
    mkdirSync(destination, { recursive: true });
    writeFileSync(join(destination, "feedback.json"), json(report));
  } else {
    assert.equal(
      canonicalStringify(
        JSON.parse(readFileSync(join(destination, "feedback.json"), "utf8")),
      ),
      canonicalStringify(report),
      "feedback evidence is stale",
    );
    validateSelfhost(
      readFileSync(join(destination, "selfhost-audit.jsonl"), "utf8"),
      readFileSync(join(destination, "selfhost-verification.jsonl"), "utf8"),
    );
  }
  console.log(
    `${mode === "--write" ? "Recorded" : "Verified"} ten passing regressions, ten removal failures, and ${report.context.savedBytes} fewer instruction bytes in the matched projection.`,
  );
}
