// Exit zero establishes the recorded false admissions and repaired controls.
// Disposable fixtures only; this program never updates the source gate index.
import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import {
  mkdtempSync,
  mkdirSync,
  writeFileSync,
  readFileSync,
  rmSync,
  realpathSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { pathToFileURL, fileURLToPath } from "node:url";
const root = realpathSync(process.cwd());
const imp = (name) => import(pathToFileURL(join(root, name)).href);
const { runGate } = await imp("scripts/test-runner.mjs");
const { gateCodeIdentity } = await imp("scripts/lib/gate-evidence.mjs");
const { taskInputBinder } = await imp("scripts/lib/task-inputs.mjs");
const { coveringGateCheck } = await imp("scripts/lib/gate-reuse.mjs");
const { requireGateClaims } = await imp("scripts/lib/handoff-ledger.mjs");
const output = [];
const cases = [
  {
    name: "repaired-command-alias",
    entry: "process.exit(0);\n",
    changed: "scripts/alpha.mjs",
    next: "process.exit(13);\n",
    command: "scripts/../scripts/alpha.mjs",
    expectStale: false,
  },
  {
    name: "renamed-require-extensionless",
    entry:
      'import {createRequire} from "node:module"; const load=createRequire(import.meta.url); load("./leaf");\n',
    changed: "scripts/leaf.js",
    initial: "process.exitCode=0;\n",
    next: "process.exit(13);\n",
    expectStale: true,
  },
  {
    name: "encoded-module-url",
    entry: 'await import(new URL("./%6ceaf.mjs", import.meta.url));\n',
    changed: "scripts/leaf.mjs",
    initial: "process.exitCode=0;\n",
    next: "process.exit(13);\n",
    expectStale: true,
  },
  {
    name: "explicit-semantic-control",
    entry:
      'import {createRequire} from "node:module"; const load=createRequire(import.meta.url); load("./leaf");\n',
    changed: "scripts/leaf.js",
    initial: "process.exitCode=0;\n",
    next: "process.exit(13);\n",
    inputs: ["scripts/leaf.js"],
    expectStale: false,
  },
];
for (const scenario of cases) {
  const repo = realpathSync(mkdtempSync(join(tmpdir(), "dotln-ver006-")));
  const git = (args) =>
    execFileSync("git", args, {
      cwd: repo,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });
  try {
    git(["init", "-q", "-b", "main"]);
    assert.equal(
      realpathSync(git(["rev-parse", "--show-toplevel"]).trim()),
      repo,
    );
    mkdirSync(join(repo, "scripts"));
    writeFileSync(join(repo, ".gitignore"), "docs/control/local/\n");
    writeFileSync(
      join(repo, "package.json"),
      '{"private":true,"type":"module"}\n',
    );
    writeFileSync(join(repo, "scripts/build.mjs"), "\n");
    writeFileSync(join(repo, "scripts/alpha.mjs"), scenario.entry);
    if (scenario.initial)
      writeFileSync(join(repo, scenario.changed), scenario.initial);
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
      "Independent verification fixture",
    ]);
    const task = {
      name: "alpha",
      product: true,
      needsBuild: true,
      inputs: scenario.inputs ?? [],
      command: [process.execPath, scenario.command ?? "scripts/alpha.mjs"],
    };
    const table = [
      {
        name: "build",
        build: true,
        product: true,
        inputs: [],
        outputs: [],
        command: [process.execPath, "scripts/build.mjs"],
      },
      task,
    ];
    const first = await runGate(["--serial"], repo, { table });
    assert.equal(first.exitCode, 0);
    const before = taskInputBinder(repo, gateCodeIdentity(repo)).bind(task);
    writeFileSync(join(repo, scenario.changed), scenario.next);
    const after = taskInputBinder(repo, gateCodeIdentity(repo)).bind(task);
    const direct = spawnSync(task.command[0], task.command.slice(1), {
      cwd: repo,
      encoding: "utf8",
    });
    assert.equal(direct.status, 13);
    const second = await runGate(["--serial"], repo, { table });
    const covered = await coveringGateCheck(repo, "npm test", ["alpha"]);
    let claimAccepted = false;
    try {
      await requireGateClaims(repo, {
        checked: true,
        claims: { plain: ["19"], review: [], document: [] },
      });
      claimAccepted = true;
    } catch (error) {
      assert.match(error.message, /no passing complete npm test row/u);
    }
    const result = {
      scenario: scenario.name,
      coverage: after.coverage,
      reusable: after.reusable !== false,
      codeIdentityChanged: first.codeIdentity !== second.codeIdentity,
      bindingChanged: before.digest !== after.digest,
      directChangedExit: direct.status,
      secondGateExit: second.exitCode,
      staleAlphaReused:
        second.taskTimeline.find((t) => t.name === "alpha").reused === true,
      completeCoverageAccepted: Boolean(covered.row),
      lifecycleClaimAccepted: claimAccepted,
    };
    output.push(result);
    assert.equal(claimAccepted, scenario.expectStale);
    assert.equal(result.staleAlphaReused, scenario.expectStale);
  } finally {
    rmSync(repo, { recursive: true, force: true });
  }
}
console.log(JSON.stringify(output, null, 2));
