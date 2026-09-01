import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { runScenario, type FixtureTree } from "./scenario.js";

const fixturePath = fileURLToPath(new URL("../../fixtures/repo-tree.json", import.meta.url));
const fixture = JSON.parse(await readFile(fixturePath, "utf8")) as FixtureTree;
const result = runScenario(fixture);
console.log("@dotln/skeleton v0.2.0 — Repo Gardener + Seiri");
console.log(result.timeline.join("\n"));
console.log("\n" + result.glyphScene);
console.log(`\nverified=${result.verified} candidates=${result.candidates.length}`);
