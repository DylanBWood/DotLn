// Exercise the combined repair through separate real CLI processes. No gate
// row in the source worktree is changed; only this disposable fixture is used.
import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import {
  mkdtempSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
  rmSync,
  realpathSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import {
  readGateChecks,
  gateCodeIdentity,
} from "../../../scripts/lib/gate-evidence.mjs";
import { coveringGateCheck } from "../../../scripts/lib/gate-reuse.mjs";
import { requireGateClaims } from "../../../scripts/lib/handoff-ledger.mjs";

const source = realpathSync(process.cwd());
assert.equal(
  realpathSync(
    execFileSync("git", ["rev-parse", "--show-toplevel"], {
      cwd: source,
      encoding: "utf8",
    }).trim(),
  ),
  source,
);
const fixture = realpathSync(
  mkdtempSync(join(tmpdir(), "dotln-ver005-process-")),
);
const git = (args) =>
  execFileSync("git", args, {
    cwd: fixture,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
const write = (name, value) => writeFileSync(join(fixture, name), value);
const summary = [];
try {
  git(["init", "-q", "-b", "main"]);
  assert.equal(
    realpathSync(git(["rev-parse", "--show-toplevel"]).trim()),
    fixture,
  );
  mkdirSync(join(fixture, "scripts"));
  write(
    ".gitignore",
    "docs/control/local/\nobserved.jsonl\nsemantic.txt\nfail-alpha\ndist/\n",
  );
  write(
    "package.json",
    JSON.stringify({
      private: true,
      type: "module",
      scripts: { test: "node driver.mjs" },
    }),
  );
  write("semantic.txt", "first\n");
  write("scripts/leaf.mjs", "export const value = 1;\n");
  const counter = (name) =>
    `import fs from 'node:fs';fs.appendFileSync('observed.jsonl',${JSON.stringify(name + "\n")});\n`;
  write(
    "scripts/build.mjs",
    counter("build") +
      "fs.mkdirSync('dist',{recursive:true});fs.writeFileSync('dist/artifact','stable');\n",
  );
  write(
    "scripts/alpha.mjs",
    counter("alpha") +
      "import './leaf.mjs';fs.readFileSync('semantic.txt');if(fs.existsSync('fail-alpha'))process.exit(1);\n",
  );
  write("scripts/beta.mjs", counter("beta") + "process.exit(1);\n");
  write("scripts/gamma.mjs", counter("gamma"));
  const table = [
    {
      name: "build",
      build: true,
      product: true,
      inputs: [],
      outputs: ["dist"],
      command: [process.execPath, "scripts/build.mjs"],
    },
    {
      name: "alpha",
      product: true,
      needsBuild: true,
      inputs: ["semantic.txt"],
      command: [process.execPath, "scripts/alpha.mjs"],
    },
    {
      name: "beta",
      product: true,
      needsBuild: true,
      inputs: [],
      command: [process.execPath, "scripts/beta.mjs"],
    },
    {
      name: "gamma",
      product: true,
      needsBuild: true,
      command: [process.execPath, "scripts/gamma.mjs"],
    },
  ];
  write(
    "driver.mjs",
    `import {runGate} from ${JSON.stringify(pathToFileURL(join(source, "scripts/test-runner.mjs")).href)};const row=await runGate(process.argv.slice(2),process.cwd(),{table:${JSON.stringify(table)}});process.exitCode=row.exitCode;\n`,
  );
  git(["add", "."]);
  git([
    "-c",
    "user.name=Fixture",
    "-c",
    "user.email=fixture@example.invalid",
    "-c",
    "core.hooksPath=",
    "-c",
    "maintenance.auto=false",
    "commit",
    "-qm",
    "Independent process fixture",
  ]);
  const run = (label, args, expected = 0, environment = {}) => {
    const child = spawnSync("npm", ["test", "--silent", "--", ...args], {
      cwd: fixture,
      env: { ...process.env, LC_TIME: "C", ...environment },
      encoding: "utf8",
      maxBuffer: 8e6,
    });
    assert.equal(child.status, expected, `${label}: child exit differs`);
    const row = readGateChecks(fixture).at(-1);
    assert.equal(row.exitCode, expected, label);
    const fresh = row.taskTimeline
      .filter((task) => task.executed && !task.reused)
      .map((task) => task.name)
      .sort();
    const carried = row.taskTimeline
      .filter((task) => task.reused)
      .map((task) => task.name)
      .sort();
    const skipped = row.taskTimeline
      .filter((task) => task.executed === false)
      .map((task) => task.name)
      .sort();
    summary.push({
      label,
      selection: row.gateSelection,
      exitCode: row.exitCode,
      fresh,
      carried,
      skipped,
      durationMs: row.durationMs,
    });
    return { row, fresh, carried, skipped };
  };
  const ledger = {
    checked: true,
    claims: { plain: ["16", "18", "19"], review: [], document: [] },
  };
  const covered = () =>
    coveringGateCheck(fixture, "npm test", ["alpha", "beta", "gamma"]);
  const refused = async () => {
    assert.equal((await covered()).row, undefined);
    await assert.rejects(
      () => requireGateClaims(fixture, ledger),
      /no passing complete npm test row/u,
    );
  };
  const selection = ["--only", "alpha", "beta", "gamma", "--serial"];
  const failed = run("first failure", selection, 1, {
    CLAUDE_PID: "101",
    CLAUDE_EFFORT: "max",
  });
  assert.deepEqual(failed.fresh, ["alpha", "beta", "build"]);
  assert.deepEqual(failed.skipped, ["gamma"]);
  await refused();
  write("scripts/beta.mjs", counter("beta"));
  assert.notEqual(gateCodeIdentity(fixture), failed.row.codeIdentity);
  const repaired = run(
    "fix in a separate process and reordered selection",
    ["--only", "gamma", "--only", "beta", "alpha", "--serial"],
    0,
    { CLAUDE_PID: "202", CLAUDE_EFFORT: "low" },
  );
  assert.deepEqual(repaired.fresh, ["beta", "gamma"]);
  assert.deepEqual(repaired.carried, ["alpha", "build"]);
  await refused();
  const complete = run("complete composed claim", ["--serial"]);
  assert.deepEqual(complete.fresh, []);
  await requireGateClaims(fixture, ledger);
  assert.equal(
    complete.row.taskTimeline.find((task) => task.name === "alpha").sourceRow
      .codeIdentity,
    failed.row.codeIdentity,
  );
  const beforeSemantic = gateCodeIdentity(fixture);
  write("semantic.txt", "second\n");
  assert.equal(gateCodeIdentity(fixture), beforeSemantic);
  await refused();
  assert.deepEqual(run("changed ignored semantic input", selection).fresh, [
    "alpha",
  ]);
  run("new complete claim after semantic change", ["--serial"]);
  await requireGateClaims(fixture, ledger);
  write("fail-alpha", "fail\n");
  run("later genuine failure", ["--only", "alpha", "--serial"], 1);
  await refused();
  rmSync(join(fixture, "fail-alpha"));
  run("passing multi-suite partial", [
    "--only",
    "alpha",
    "beta",
    "--serial",
    "--confined-partial",
  ]);
  await refused();
  run(
    "passing multi-suite other contract",
    ["--only", "alpha", "beta", "--serial"],
    0,
    { LC_TIME: "POSIX" },
  );
  await refused();
  run("eligible original-contract recovery", [
    "--only",
    "alpha",
    "beta",
    "--serial",
  ]);
  await requireGateClaims(fixture, ledger);
  write("unrelated.txt", "changes whole code only\n");
  const unrelated = run(
    "unrelated code change keeps declared passes",
    selection,
  );
  assert.deepEqual(unrelated.fresh, ["gamma"]);
  assert.deepEqual(unrelated.carried, ["alpha", "beta", "build"]);
  assert.deepEqual(run("final complete claim", ["--serial"]).fresh, []);
  await requireGateClaims(fixture, ledger);
  const counts = {};
  for (const name of readFileSync(join(fixture, "observed.jsonl"), "utf8")
    .trim()
    .split("\n"))
    counts[name] = (counts[name] ?? 0) + 1;
  console.log(
    JSON.stringify(
      {
        separateChildProcesses: summary.length,
        combinedPartialFailureResolution:
          "refused until eligible same-contract recovery",
        sourceExecutionAcrossIdentity: true,
        ignoredInputRecheckedAtClaim: true,
        counts,
        runs: summary,
      },
      null,
      2,
    ),
  );
} finally {
  rmSync(fixture, { recursive: true, force: true });
}
