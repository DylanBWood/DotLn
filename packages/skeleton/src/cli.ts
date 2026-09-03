import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { decodeLog } from "@dotln/kernel";
import { renderAuditProjections } from "./audit.js";
import { runScenario, type FixtureTree } from "./scenario.js";

const fixturePath = fileURLToPath(
  new URL("../../fixtures/repo-tree.json", import.meta.url),
);
const packagePath = fileURLToPath(
  new URL("../../package.json", import.meta.url),
);
const packageManifest = JSON.parse(await readFile(packagePath, "utf8")) as {
  version?: unknown;
};
if (typeof packageManifest.version !== "string")
  throw new Error(`skeleton package version is missing: ${packagePath}`);
const fixture = JSON.parse(await readFile(fixturePath, "utf8")) as FixtureTree;
const result = runScenario(fixture);
console.log(
  `@dotln/skeleton v${packageManifest.version} — Repo Gardener + Seiri`,
);
console.log(result.timeline.join("\n"));
console.log("\n" + result.glyphScene);
if (process.argv.includes("--audit"))
  console.log("\n" + renderAuditProjections(decodeLog(result.log)));
console.log(
  `\nverified=${result.verified} candidates=${result.candidates.length}`,
);
