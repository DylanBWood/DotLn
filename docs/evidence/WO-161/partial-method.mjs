// Reproduce the no-build confined-row projection retained by WO-161.
// Run from the repository root: node docs/evidence/WO-161/partial-method.mjs
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import {
  chmodSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { runGate } from "../../../scripts/test-runner.mjs";
import { OUTSIDE_CONFINEMENT } from "../../../scripts/lib/host-confinement.mjs";

const here = import.meta.dirname;
const repo = mkdtempSync(join(tmpdir(), "dotln-host-confinement-method-"));
const denied = join(repo, "denied");
const git = (...args) =>
  execFileSync("git", args, { cwd: repo, stdio: "ignore" });

try {
  git("init", "-q");
  git("config", "maintenance.auto", "false");
  git("config", "user.name", "Fixture");
  git("config", "user.email", "fixture@example.invalid");
  writeFileSync(
    join(repo, ".gitignore"),
    "docs/control/local/\nobserved.jsonl\ndenied/\n",
  );
  mkdirSync(join(repo, "scripts"));
  mkdirSync(denied);
  for (const name of ["alpha", "outside"])
    writeFileSync(
      join(repo, "scripts", `${name}.mjs`),
      `import fs from "node:fs"; fs.appendFileSync("observed.jsonl", ${JSON.stringify(`${name}\n`)});\n`,
    );
  git("add", ".");
  git("commit", "-qm", "Confined-row fixture");
  chmodSync(denied, 0o555);

  // Deliberately omit a build row: the runner inserts document-barrier.
  const row = (name, extra = {}) => ({
    name,
    command: [process.execPath, `scripts/${name}.mjs`],
    product: true,
    ...extra,
  });
  const check = await runGate(["--confined-partial", "--serial"], repo, {
    table: [row("alpha"), row("outside", { needs: OUTSIDE_CONFINEMENT })],
    sandbox: {
      env: { DOTLN_FIXTURE_SANDBOX: "1" },
      markers: [
        {
          id: "fixture-harness",
          env: "DOTLN_FIXTURE_SANDBOX",
          deniedDirectory: () => denied,
        },
      ],
    },
  });
  assert.ok(check.evidenceRef.endsWith(check.checkId));
  assert.equal(readFileSync(join(repo, "observed.jsonl"), "utf8"), "alpha\n");
  const projection = {
    checkId: check.checkId,
    evidenceRefSuffix: check.checkId,
    needs: OUTSIDE_CONFINEMENT,
    partial: check.partial,
    excludedSuites: check.excludedSuites,
    requiredSuites: check.requiredSuites,
    inForce: check.sandbox.inForce,
    exitCode: check.exitCode,
  };
  for (const side of ["before", "after"])
    assert.deepEqual(
      projection,
      JSON.parse(readFileSync(join(here, `partial-${side}.json`), "utf8")),
      `partial-${side}.json`,
    );
  process.stdout.write(`${JSON.stringify(projection, null, 2)}\n`);
} finally {
  chmodSync(denied, 0o755);
  rmSync(repo, { recursive: true, force: true });
}
