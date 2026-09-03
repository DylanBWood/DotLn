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

const expectedOutput = (audit: boolean): string => {
  const scenario = runScenario(fixture);
  const banner = `@dotln/skeleton v${manifest.version} — Repo Gardener + Seiri`;
  const auditOutput = audit
    ? `\n${renderAuditProjections(decodeLog(scenario.log))}\n`
    : "";
  return `${banner}\n${scenario.timeline.join("\n")}\n\n${scenario.glyphScene}\n${auditOutput}\nverified=${scenario.verified} candidates=${scenario.candidates.length}\n`;
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
