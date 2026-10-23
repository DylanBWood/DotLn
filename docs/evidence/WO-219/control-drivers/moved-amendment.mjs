#!/usr/bin/env node
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  existsSync,
  lstatSync,
  mkdirSync,
  readFileSync,
  realpathSync,
  writeFileSync,
} from "node:fs";
import { isAbsolute, join, resolve, sep } from "node:path";

const args = process.argv.slice(2);
assert.equal(
  args.length,
  4,
  "usage: paired-control-driver.mjs --repo <isolated-copy> --output <new-results-directory>",
);
assert.equal(args[0], "--repo");
assert.equal(args[2], "--output");
const repo = realpathSync(resolve(args[1]));
const output = resolve(args[3]);
const activeRoots = [
  process.cwd(),
  process.env.PWD,
  process.env.DOTLN_LAUNCHPAD,
  process.env.CODEX_WORKSPACE_ROOT,
]
  .filter(
    (value) =>
      typeof value === "string" && isAbsolute(value) && existsSync(value),
  )
  .map((value) => realpathSync(value));
assert.ok(
  !activeRoots.includes(repo),
  "refuse an active source worktree; prepare a separate control copy first",
);
assert.ok(
  lstatSync(join(repo, ".git")).isDirectory(),
  "expect an independent control clone, never a linked worktree Git pointer",
);
assert.ok(!lstatSync(join(repo, ".git")).isSymbolicLink());
assert.ok(
  !existsSync(join(repo, ".git/objects/info/alternates")),
  "expect independent object storage",
);
assert.doesNotMatch(
  readFileSync(join(repo, ".git/config"), "utf8"),
  /^\s*\[remote\s/imu,
  "expect the prepared control copy to have no remotes",
);
assert.ok(!existsSync(output), "results directory must be new");
const runtimePath = join(repo, "scripts/lib/plan-receipts.mjs");
const fixturePath = join(repo, "scripts/test-plan-refutation.mjs");
for (const file of [runtimePath, fixturePath]) {
  assert.ok(lstatSync(file).isFile() && !lstatSync(file).isSymbolicLink());
  assert.ok(realpathSync(file).startsWith(`${repo}${sep}`));
}
const fixed = readFileSync(runtimePath, "utf8");
const fixture = readFileSync(fixturePath, "utf8");
const anchor = `const amendmentDecision = (root, decisionId) => {\n  const workOrderId = decisionId.slice(0, 6);\n`;
const precheck = `  const path = docRelative(root, "evidence", \`${"${workOrderId}"}/decisions.md\`);\n  check(\n    containedRegularFile(join(root, path), root),\n    "execution amendment decision must be a contained regular file",\n  );\n`;
assert.equal(
  fixed.split(anchor).length - 1,
  1,
  "one exact amendmentDecision anchor is required",
);
assert.ok(!fixed.includes(precheck), "overlay the fixed source before replay");
assert.ok(
  fixed.includes(
    "bound.workOrder === event.workOrderId && bound.hash === event.decisionHash",
  ),
  "bound decision identity/hash equality must remain intact",
);
assert.ok(fixture.includes("export async function movedAmendmentFixtures("));
assert.ok(
  fixture.includes("for (const location of locations)"),
  "apply the narrow location selector before replay",
);
assert.ok(
  fixture.includes('decisionId: "WO-901-D999"'),
  "overlay the final missing-decision assertion too",
);
const reverted = fixed.replace(anchor, anchor + precheck);
const hash = (value) => createHash("sha256").update(value).digest("hex");
const fixtureHash = hash(fixture);
const env = Object.fromEntries(
  Object.entries(process.env).filter(
    ([key]) => !/^(?:GIT_|CODEX|COPILOT|CLAUDE|DOTLN_)/u.test(key),
  ),
);
const escape = (value) => value.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
const caseName = (location) =>
  `execution amendment keeps its decision binding for a closed target with ${location} decisions`;
const stateOf = (text, name) => {
  if (
    new RegExp(
      `^\\s*(?:not ok \\d+ - |[✖×] )${escape(name)}(?:\\s|$)`,
      "mu",
    ).test(text)
  )
    return "fail";
  if (
    new RegExp(`^\\s*(?:ok \\d+ - |[✔✓] )${escape(name)}(?:\\s|$)`, "mu").test(
      text,
    )
  )
    return "pass";
  return "absent-or-unrecognized";
};
const scrub = (value) => {
  let text = value;
  for (const [directory, label] of [
    [repo, "<isolated-copy>"],
    ...activeRoots.map((directory) => [directory, "<source-root>"]),
  ])
    text = text.replaceAll(directory, label);
  return text;
};
mkdirSync(output, { recursive: true });
const results = [];
try {
  for (const [arm, location] of [
    ["fixed", "contained"],
    ["reverted", "contained"],
    ["fixed", "moved"],
    ["reverted", "moved"],
  ]) {
    assert.equal(
      hash(readFileSync(fixturePath, "utf8")),
      fixtureHash,
      "fixture assertions must be identical in every leg",
    );
    writeFileSync(runtimePath, arm === "fixed" ? fixed : reverted);
    const expression = `const {movedAmendmentFixtures}=await import('./scripts/test-plan-refutation.mjs'); await movedAmendmentFixtures({locations:[${JSON.stringify(location)}]});`;
    const argv = ["--input-type=module", "-e", expression];
    const started = performance.now();
    const run = spawnSync(process.execPath, argv, {
      cwd: repo,
      env,
      encoding: "utf8",
      maxBuffer: 8 * 1024 * 1024,
      timeout: 120_000,
    });
    const combined = (run.stdout ?? "") + "\n" + (run.stderr ?? "");
    const expected =
      arm === "reverted" && location === "moved"
        ? { exitCode: 1, case: "fail" }
        : { exitCode: 0, case: "pass" };
    const actual = {
      exitCode: run.status,
      case: stateOf(combined, caseName(location)),
    };
    const expectedBehavior =
      expected.case !== "fail" ||
      combined.includes(
        "execution amendment decision must be a contained regular file",
      );
    const matched =
      !run.error &&
      !run.signal &&
      actual.exitCode === expected.exitCode &&
      actual.case === expected.case &&
      expectedBehavior;
    const log = `${arm}-${location}.log`;
    writeFileSync(join(output, log), scrub(combined), { flag: "wx" });
    const result = {
      arm,
      location,
      assertedCase: caseName(location),
      argv: ["node", ...argv],
      expected,
      actual,
      signal: run.signal,
      errorCode: run.error?.code ?? null,
      durationMs: Math.round(performance.now() - started),
      fixtureSha256: fixtureHash,
      runtimeSha256: hash(arm === "fixed" ? fixed : reverted),
      expectedBehavior,
      matched,
      log,
    };
    results.push(result);
    process.stdout.write(`${JSON.stringify(result)}\n`);
  }
} finally {
  writeFileSync(runtimePath, fixed);
  assert.equal(
    hash(readFileSync(fixturePath, "utf8")),
    fixtureHash,
    "the driver must preserve the fixture",
  );
  writeFileSync(
    join(output, "results.json"),
    JSON.stringify(
      {
        schemaVersion: 1,
        control: "moved amendment decision local precheck",
        runtimeOnlyReversion:
          "Insert only the five-line contained-file precheck in amendmentDecision; restore fixed bytes in finally.",
        fixedRuntimeRestored: readFileSync(runtimePath, "utf8") === fixed,
        fixtureSha256: fixtureHash,
        results,
        matched:
          results.length === 4 && results.every((result) => result.matched),
      },
      null,
      2,
    ) + "\n",
    { flag: "wx" },
  );
}
if (results.length !== 4 || results.some((result) => !result.matched))
  process.exitCode = 1;
