// A retained adversarial reproduction. Exit zero means the false admission
// below was observed, not that validation is correct.
import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import {
  mkdtempSync,
  mkdirSync,
  writeFileSync,
  rmSync,
  realpathSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { runGate } from "../../../scripts/test-runner.mjs";
import { gateCodeIdentity } from "../../../scripts/lib/gate-evidence.mjs";
import { taskInputBinder } from "../../../scripts/lib/task-inputs.mjs";
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
  mkdtempSync(join(tmpdir(), "dotln-ver005-alias-")),
);
const git = (args) =>
  execFileSync("git", args, {
    cwd: fixture,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
const write = (name, value) => writeFileSync(join(fixture, name), value);
try {
  git(["init", "-q", "-b", "main"]);
  assert.equal(
    realpathSync(git(["rev-parse", "--show-toplevel"]).trim()),
    fixture,
  );
  mkdirSync(join(fixture, "scripts"));
  write(".gitignore", "docs/control/local/\n");
  write("package.json", '{"private":true,"type":"module"}\n');
  write("scripts/build.mjs", "\n");
  write("scripts/alpha.mjs", "process.exit(0);\n");
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
    "Independent alias fixture",
  ]);
  const task = {
    name: "alpha",
    product: true,
    needsBuild: true,
    inputs: [],
    command: [process.execPath, "scripts/../scripts/alpha.mjs"],
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
  const first = await runGate(["--serial"], fixture, { table });
  assert.equal(first.exitCode, 0);
  const bindingBefore = taskInputBinder(
    fixture,
    gateCodeIdentity(fixture),
  ).bind(task);
  write("scripts/alpha.mjs", "process.exit(13);\n");
  const identityAfter = gateCodeIdentity(fixture);
  assert.notEqual(identityAfter, first.codeIdentity);
  const bindingAfter = taskInputBinder(fixture, identityAfter).bind(task);
  const direct = spawnSync(process.execPath, ["scripts/../scripts/alpha.mjs"], {
    cwd: fixture,
    encoding: "utf8",
  });
  assert.equal(direct.status, 13);
  const second = await runGate(["--serial"], fixture, { table });
  const alpha = second.taskTimeline.find((row) => row.name === "alpha");
  const coverage = await coveringGateCheck(fixture, "npm test", ["alpha"]);
  const claim = await requireGateClaims(fixture, {
    checked: true,
    claims: { plain: ["19"], review: [], document: [] },
  });
  assert.equal(bindingBefore.coverage, "declared");
  assert.deepEqual(bindingBefore.spec.entries, []);
  assert.equal(bindingAfter.digest, bindingBefore.digest);
  assert.equal(second.exitCode, 0);
  assert.equal(alpha.reused, true);
  assert.ok(coverage.row);
  assert.ok(claim.productGate);
  // Positive control: the ordinary spelling binds the changed entry source.
  const ordinary = {
    ...task,
    command: [process.execPath, "scripts/alpha.mjs"],
  };
  const ordinaryBad = taskInputBinder(fixture, identityAfter).bind(ordinary);
  write("scripts/alpha.mjs", "process.exit(0);\n");
  const ordinaryGood = taskInputBinder(fixture, gateCodeIdentity(fixture)).bind(
    ordinary,
  );
  assert.notEqual(ordinaryBad.digest, ordinaryGood.digest);
  const equivalentSpellings = [];
  for (const spelling of [
    "scripts/./alpha.mjs",
    "scripts//alpha.mjs",
    "./scripts/../scripts/alpha.mjs",
  ]) {
    const variant = { ...task, command: [process.execPath, spelling] };
    write("scripts/alpha.mjs", "process.exit(0);\n");
    const good = taskInputBinder(fixture, gateCodeIdentity(fixture)).bind(
      variant,
    );
    write("scripts/alpha.mjs", "process.exit(13);\n");
    const bad = taskInputBinder(fixture, gateCodeIdentity(fixture)).bind(
      variant,
    );
    assert.equal(
      spawnSync(process.execPath, [spelling], { cwd: fixture }).status,
      13,
    );
    assert.equal(good.digest, bad.digest);
    assert.equal(bad.coverage, "declared");
    assert.deepEqual(bad.spec.entries, []);
    equivalentSpellings.push(spelling);
  }
  console.log(
    JSON.stringify(
      {
        class: "task-input binding",
        commandPath: task.command[1],
        codeIdentityChanged: true,
        entryMissingFromBinding: true,
        bindingUnchangedAfterEntryEdit: true,
        directChangedCommandExit: direct.status,
        subsequentFullGateExit: second.exitCode,
        staleAlphaReused: alpha.reused,
        staleSourceAtEarlierIdentity:
          alpha.sourceRow.codeIdentity === first.codeIdentity,
        completeCoverageAccepted: Boolean(coverage.row),
        lifecycleClaimAccepted: Boolean(claim.productGate),
        ordinaryPathControlInvalidates: true,
        equivalentSpellings,
      },
      null,
      2,
    ),
  );
} finally {
  rmSync(fixture, { recursive: true, force: true });
}
