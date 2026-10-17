// Compare the current coverage boundary with the base boundary in a fixture.
// Imported helpers remain current; this is not a complete build of the base.
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
import { join, dirname } from "node:path";
import { pathToFileURL, fileURLToPath } from "node:url";
const root = realpathSync(process.cwd());
const scratch = realpathSync(
  mkdtempSync(join(tmpdir(), "dotln-ver006-baseline-")),
);
const imp = (name) => import(pathToFileURL(join(root, name)).href);
const { runGate } = await imp("scripts/test-runner.mjs");
const { gateCodeIdentity } = await imp("scripts/lib/gate-evidence.mjs");
const { coveringGateCheck } = await imp("scripts/lib/gate-reuse.mjs");
const { requireGateClaims } = await imp("scripts/lib/handoff-ledger.mjs");
const baseline = execFileSync(
  "git",
  ["show", "HEAD:scripts/lib/gate-reuse.mjs"],
  { cwd: root, encoding: "utf8" },
).replaceAll(/"\.\/([^"\n]+\.mjs)"/gu, (_, name) =>
  JSON.stringify(pathToFileURL(join(root, "scripts/lib", name)).href),
);
const baseFile = join(scratch, "ver006-baseline-reuse.mjs");
writeFileSync(baseFile, baseline);
const { coveringGateCheck: baseCoverage } = await import(
  pathToFileURL(baseFile)
);
const repo = realpathSync(
  mkdtempSync(join(tmpdir(), "dotln-ver006-projection-")),
);
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
  mkdirSync(join(repo, "docs/control"), { recursive: true });
  writeFileSync(join(repo, ".gitignore"), "docs/control/local/\n");
  writeFileSync(
    join(repo, "package.json"),
    '{"private":true,"type":"module"}\n',
  );
  writeFileSync(join(repo, "scripts/build.mjs"), "\n");
  writeFileSync(
    join(repo, "scripts/helper.mjs"),
    'export const fixtureLocation=new URL("../docs/control/current.md",import.meta.url);\n',
  );
  writeFileSync(
    join(repo, "scripts/alpha.mjs"),
    'import "./helper.mjs";process.exit(0);\n',
  );
  writeFileSync(join(repo, "docs/control/current.md"), "Phase: repairing\n");
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
    "Independent projection fixture",
  ]);
  const table = [
    {
      name: "build",
      build: true,
      product: true,
      inputs: [],
      outputs: [],
      command: [process.execPath, "scripts/build.mjs"],
    },
    {
      name: "alpha",
      product: true,
      needsBuild: true,
      inputs: [],
      command: [process.execPath, "scripts/alpha.mjs"],
    },
  ];
  const first = await runGate(["--serial"], repo, { table });
  assert.equal(first.exitCode, 0);
  assert.ok((await coveringGateCheck(repo, "npm test", ["alpha"])).row);
  assert.ok((await baseCoverage(repo, "npm test", ["alpha"])).row);
  writeFileSync(
    join(repo, "docs/control/current.md"),
    "Phase: ready-to-verify\n",
  );
  assert.equal(gateCodeIdentity(repo), first.codeIdentity);
  const current = await coveringGateCheck(repo, "npm test", ["alpha"]);
  const original = await baseCoverage(repo, "npm test", ["alpha"]);
  assert.equal(current.row, undefined);
  assert.ok(original.row);
  await assert.rejects(
    () =>
      requireGateClaims(repo, {
        checked: true,
        claims: { plain: ["17"], review: [], document: [] },
      }),
    /no passing complete npm test row/u,
  );
  assert.equal(
    spawnSync(process.execPath, ["scripts/alpha.mjs"], { cwd: repo }).status,
    0,
  );
  const result = {
    codeIdentityUnchanged: true,
    fixtureTaskReadsProjection: false,
    taskStillPasses: true,
    currentClaimAccepted: false,
    mainCoverageBoundaryAccepts: true,
    mainComparisonScope:
      "HEAD gate-reuse module with relative import locations redirected to current Git and gate-evidence helpers",
    displaced: current.displaced.tasks,
  };
  console.log(JSON.stringify(result, null, 2));
} finally {
  rmSync(repo, { recursive: true, force: true });
  rmSync(scratch, { recursive: true, force: true });
}
