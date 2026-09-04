import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { decodeLog } from "@dotln/kernel";
import { renderAuditProjections } from "../src/audit.js";
import { runScenario, type FixtureTree } from "../src/scenario.js";

const packagePath = fileURLToPath(
  new URL("../../package.json", import.meta.url),
);
const cliPath = fileURLToPath(new URL("../src/cli.js", import.meta.url));
const fixture = JSON.parse(
  await readFile(
    fileURLToPath(new URL("../../fixtures/repo-tree.json", import.meta.url)),
    "utf8",
  ),
) as FixtureTree;
const manifest = JSON.parse(await readFile(packagePath, "utf8")) as {
  version?: unknown;
};
if (typeof manifest.version !== "string")
  throw new Error("skeleton package version is missing");

const compiledPreview = [
  "code-dsl=fnv1a64:9ca8d0229c6bd8db",
  "function-table=fnv1a64:9ca8d0229c6bd8db",
  "statechart-json=fnv1a64:9ca8d0229c6bd8db",
  "views=equivalent",
  "",
  "Seiri / Sort / 整理",
  "The Evidence-Bound Sort — COMPILED DIFF",
  "",
  "GRANTS",
  "+ Inventory every fixture path",
  "+ Classify every fixture path",
  "+ Analyze references",
  "+ Propose deletion candidates",
  "",
  "RESTRICTIONS",
  "+ Do not mutate repository contents",
  "+ Deletion remains operator-owned",
  "+ Inspect only the bounded fixture repository",
  "",
  "OBLIGATION",
  "+ Attach inventory, classification, and reference evidence to every candidate",
  "+ Independently verify proposed candidates",
  "",
  "PASSIVE",
  "+ Active only while the operator is absent",
  "",
  "PULSE",
  "+ Re-evaluate every 20 virtual minutes",
  "",
  "INTERRUPT",
  "+ Stop on operator return; queued pulses become a traced NoOp",
  "",
  "COST",
  "+ seiri.absence-cadence — statechart-gate; prompt=0 tokens; runtime=2 predicate-evaluations-per-pulse; episodes=0",
  "+ seiri.evidence-capture — evidence-schema; prompt=0 tokens; runtime=1 schema-validations-per-result; episodes=0",
  "+ seiri.independent-verification — verifier-episode; prompt=0 tokens; runtime=1 verifier-dispatches; episodes=1",
  "+ seiri.read-only — permission-guard; prompt=0 tokens; runtime=1 guard-checks-per-effect; episodes=0",
  "+ seiri.repo-scope — work-order; prompt=0 tokens; runtime=0 operations; episodes=0",
  "",
  "SEMANTIC HASH",
  "  before=none",
  "  after=fnv1a64:9ca8d0229c6bd8db",
].join("\n");

const expectedOutput = (audit: boolean, compiledDiff = false): string => {
  const scenario = runScenario(fixture);
  const banner = `@dotln/skeleton v${manifest.version} — Repo Gardener + Seiri`;
  const auditOutput = audit
    ? `\n${renderAuditProjections(decodeLog(scenario.log))}\n`
    : "";
  const previewOutput = compiledDiff ? `\n${compiledPreview}\n` : "";
  return `${banner}\n${scenario.timeline.join("\n")}\n\n${scenario.glyphScene}\n${auditOutput}${previewOutput}\nverified=${scenario.verified} candidates=${scenario.candidates.length}\n`;
};

const runCli = (...args: readonly string[]) =>
  spawnSync(process.execPath, [cliPath, ...args], { encoding: "utf8" });

test("WO-016 AC8 default CLI stdout is exact", () => {
  const result = runCli();
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stderr, "");
  assert.equal(result.stdout, expectedOutput(false));
});

test("WO-016 AC8 --audit CLI stdout is exact and additive", () => {
  const result = runCli("--audit");
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stderr, "");
  assert.equal(result.stdout, expectedOutput(true));
});

test("WO-008 AC5 --compiled-diff CLI stdout is exact", () => {
  const result = runCli("--compiled-diff");
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stderr, "");
  assert.equal(result.stdout, expectedOutput(false, true));
});

test("WO-008 AC5 --audit and --compiled-diff preserve deterministic section order", () => {
  const result = runCli("--compiled-diff", "--audit");
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stderr, "");
  assert.equal(result.stdout, expectedOutput(true, true));
});
