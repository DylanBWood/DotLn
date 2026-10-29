import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { pathToFileURL } from "node:url";
import { spawnSync } from "node:child_process";
import {
  createFixtureRoot,
  removeTemporaryPath,
} from "../../../scripts/lib/temporary-roots.mjs";
import { runGit } from "../../../scripts/lib/git.mjs";

const root = process.cwd();
const fixture = createFixtureRoot(join(tmpdir(), "dotln-bound-controls-"));
try {
  const baseline = runGit(root, ["rev-parse", "HEAD"]);
  const before = join(fixture, "base-host.mjs");
  // Only relative module locations change; the old host judgment stays exact.
  const old = runGit(root, ["show", "HEAD:scripts/structural-checks.mjs"]);
  writeFileSync(
    before,
    old.replaceAll(
      'from "./lib/',
      `from "${pathToFileURL(join(root, "scripts/lib")).href}/`,
    ),
  );
  const directory = join(fixture, "docs/control/local/harness");
  mkdirSync(directory, { recursive: true });
  const session = "paired-bound-control";
  const key = createHash("sha256").update(session).digest("hex");
  writeFileSync(
    join(directory, `${key}.json`),
    JSON.stringify({
      role: "executor",
      intent: "resume: next",
      workOrder: "WO-999",
      startedAt: new Date().toISOString(),
    }),
  );
  const budgets = JSON.parse(
    readFileSync(join(root, "scripts/kit/budgets.template.json"), "utf8"),
  );
  const cases = [];
  for (const metric of ["wallClockMs", "completeRuns"]) {
    budgets.dispatches.executor.wallClockMs = null;
    budgets.dispatches.executor.completeRuns = null;
    budgets.dispatches.executor[metric] = 0;
    writeFileSync(
      join(fixture, "docs/control/budgets.json"),
      JSON.stringify(budgets),
    );
    for (const focused of [false, true]) {
      const arms = {};
      for (const [name, file] of [
        ["base", before],
        ["current", join(root, "scripts/structural-checks.mjs")],
      ]) {
        const program = `import {checkHost} from ${JSON.stringify(pathToFileURL(file).href)};
import {dispatchStanding} from ${JSON.stringify(pathToFileURL(join(root, "scripts/lib/dispatch-bound.mjs")).href)};
const standing=${focused ? "undefined" : `dispatchStanding(${JSON.stringify(fixture)},{session:${JSON.stringify(session)}})`};
const result=checkHost({level:"normal",pressure:0,swapBytes:0,physicalBytes:2**36,source:"paired synthetic sample"},{standing,limits:{taskBytes:2**30,hostLanes:8},requiredPeakBytes:0,fileEvents:{}});
console.log(JSON.stringify({exitCode:result.exitCode,boundStop:result.boundStop??null,output:result.output}));process.exitCode=result.exitCode;`;
        const run = spawnSync(
          process.execPath,
          ["--input-type=module", "-e", program],
          { cwd: root, encoding: "utf8" },
        );
        assert.equal(run.error, undefined);
        arms[name] = { exitCode: run.status, ...JSON.parse(run.stdout) };
      }
      assert.equal(arms.base.exitCode, 0);
      assert.equal(arms.current.exitCode, focused ? 0 : 1);
      cases.push({
        metric,
        selection: focused ? "focused reproduction" : "complete review",
        ...arms,
      });
    }
  }
  writeFileSync(
    join(root, "docs/evidence/WO-234/controls.json"),
    JSON.stringify(
      {
        observedAt: new Date().toISOString(),
        baseline,
        method:
          "The same exported host judgment call with the same synthetic normal-pressure sample, dispatch standing and memory options. Base ignores the new standing option; current refuses a complete selection. Focused controls omit standing as the runner does. Child process exit codes are recorded. This is a deterministic admission comparison, not a live host-memory claim.",
        cases,
      },
      null,
      2,
    ) + "\n",
  );
  console.log(
    "Paired admission controls passed: each exhausted metric is admitted at base, refused currently, and focused reproductions stay admitted.",
  );
} finally {
  removeTemporaryPath(fixture, { recursive: true, force: true });
}
