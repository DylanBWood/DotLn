// FINAL-001 reviewer probes for WO-242. Run from the repository root under
// the bounded wrapper:
//   node scripts/harness.mjs bounded -- node --test docs/evidence/WO-242/final-001/probes.mjs
// Every fixture is a temporary directory holding one configuration file and
// is removed afterwards. The test named F2 reproduces the follow-up recorded
// in WO-242-D032: it asserts the behavior a repair must hold, so it fails
// until that follow-up is taken. The other test passes on the reviewed
// subject.
import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const load = (path) => import(pathToFileURL(join(root, path)));
const { planFirstElected } = await load(
  "packages/skeleton/dist/src/plan-first-boundary.js",
);
const { readFeatures } = await load("scripts/lib/features.mjs");

const read = (reader, dir) => {
  try {
    return { value: reader(dir) };
  } catch {
    return { refused: true };
  }
};
const withConfig = (features, body) => {
  const dir = mkdtempSync(join(tmpdir(), "dotln-election-"));
  try {
    writeFileSync(
      join(dir, "dotln.config.json"),
      JSON.stringify({ version: 1, ...(features ? { features } : {}) }),
    );
    return body(dir);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
};

test("F2 (WO-242-D032): the hook's election reader refuses every plan-first election the lifecycle refuses", () => {
  // Observed on the subject: the hook reads "on", "true" and 1 as not
  // elected and so judges no executor write, and reads {on: "true"} and
  // {on: 1} as elected, while readFeatures refuses each of them as an
  // invalid configuration.
  for (const value of ["on", "true", 1, { on: "true" }, { on: 1 }, null])
    withConfig({ "plan-first": value }, (dir) => {
      const lifecycle = read((d) => readFeatures(d)["plan-first"], dir);
      const hook = read(planFirstElected, dir);
      assert.equal(
        lifecycle.refused,
        true,
        `the lifecycle refuses ${JSON.stringify(value)}`,
      );
      assert.equal(
        hook.refused,
        true,
        `the hook refuses ${JSON.stringify(value)} as the lifecycle does`,
      );
    });
});

test("C3: the hook's and the lifecycle's election readers agree on every supported election", () => {
  for (const [features, expected] of [
    [{ "plan-first": true }, true],
    [{ "plan-first": false }, false],
    [{ "plan-first": { on: true } }, true],
    [{ "plan-first": { on: false, note: "read before it is built" } }, false],
    [undefined, false],
  ])
    withConfig(features, (dir) => {
      assert.equal(planFirstElected(dir), expected);
      assert.equal(readFeatures(dir)["plan-first"], expected);
    });
});
