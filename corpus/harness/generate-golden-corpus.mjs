import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { runScenario } from "../../packages/skeleton/dist/src/scenario.js";
import {
  args,
  BASE,
  demoTree,
  exactFiles,
  GOLDEN,
  isMain,
  jsonBytes,
  ROOT,
  SEED,
} from "./wo105-common.mjs";
import { assertScenarioIdentity } from "./generate-tree-corpus.mjs";

export function buildGoldenFiles() {
  const live = runScenario(demoTree());
  assertScenarioIdentity(live);
  return {
    [GOLDEN]: jsonBytes({
      workOrder: "WO-105",
      baseCommit: BASE,
      seed: SEED,
      scenario: {
        module: "packages/skeleton/dist/src/scenario.js",
        export: "runScenario",
        fixture: "packages/skeleton/fixtures/repo-tree.json",
        options: {},
      },
      regenerationCommand: `npm run build && node corpus/harness/generate-golden-corpus.mjs --seed ${SEED} --write`,
      provenance:
        "Generated from the unchanged source tree at baseCommit; the corpus harness is additive to that base. Run this harness with those package sources to re-derive the golden.",
      decisionTraces: live.decisions.map((decision) => decision.trace),
      eventLog: live.log,
      glyphScene: live.glyphScene,
    }),
  };
}
export function assertBaseSources() {
  const diff = execFileSync(
    "git",
    [
      "diff",
      "--no-ext-diff",
      "--no-textconv",
      "--name-only",
      BASE,
      "--",
      "packages/kernel/src",
      "packages/compiler/src",
      "packages/skeleton/src",
      "packages/skeleton/fixtures/repo-tree.json",
    ],
    { cwd: ROOT, encoding: "utf8" },
  );
  assert.equal(
    diff,
    "",
    "golden generation requires the recorded base's package sources",
  );
}
if (isMain(import.meta.url)) {
  const { mode } = args(process.argv.slice(2), ["write", "check"]);
  if (mode === "write") assertBaseSources();
  exactFiles(buildGoldenFiles(), mode);
  console.log(
    JSON.stringify({ lane: "golden", mode, baseCommit: BASE, fixture: GOLDEN }),
  );
}
