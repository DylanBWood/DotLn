// Rerun the sequence VER-004 used to reproduce its defect, with real runner rows in
// a disposable Git fixture, and require the repaired behavior: a passing partial run
// and a pass under another contract leave the claim refused until an eligible pass
// under the failed contract follows. A zero exit means the defect is closed; this is
// not a passing gate.
import assert from "node:assert/strict";
import {
  mkdtempSync,
  mkdirSync,
  writeFileSync,
  readFileSync,
  realpathSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { execFileSync, spawnSync } from "node:child_process";
const source = process.cwd();
const fixture = realpathSync(mkdtempSync(join(tmpdir(), "dotln-ver004-")));
const mod = (file) => import(pathToFileURL(resolve(source, file)).href);
const { coveringGateCheck } = await mod("scripts/lib/gate-reuse.mjs");
const { requireGateClaims } = await mod("scripts/lib/handoff-ledger.mjs");
const { readGateChecks } = await mod("scripts/lib/gate-evidence.mjs");
const ledger = {
  checked: true,
  claims: { plain: ["16"], review: [], document: [] },
};
const git = (args) =>
  execFileSync("git", args, { cwd: fixture, encoding: "utf8" });
git(["init", "-q", "-b", "main"]);
assert.equal(
  realpathSync(git(["rev-parse", "--show-toplevel"]).trim()),
  fixture,
);
git(["config", "user.name", "Fixture"]);
git(["config", "user.email", "fixture@example.invalid"]);
git(["config", "maintenance.auto", "false"]);
mkdirSync(join(fixture, "scripts"));
writeFileSync(
  join(fixture, ".gitignore"),
  "docs/control/local/\nobserved.jsonl\nfail-beta\ndist/\n",
);
writeFileSync(
  join(fixture, "package.json"),
  JSON.stringify({
    private: true,
    type: "module",
    scripts: { test: "node driver.mjs" },
  }),
);
const labels = [
  "CLAUDE_PID",
  "CLAUDE_CODE_EXECPATH",
  "CLAUDE_EFFORT",
  "DOTLN_SESSION_ID",
  "DOTLN_RESIDENT_EPISODE_ID",
  "DOTLN_RESIDENT_STORE",
  "LC_TERMINAL",
  "LC_TERMINAL_VERSION",
  "npm_config_loglevel",
];
for (const name of ["build", "alpha", "beta"]) {
  let body = `import fs from 'node:fs'; fs.appendFileSync('observed.jsonl',${JSON.stringify(name + "\n")});\n`;
  body += `if(${JSON.stringify(labels)}.some(x=>process.env[x]!==undefined)) process.exit(7);\n`;
  if (name === "build")
    body +=
      "fs.mkdirSync('dist',{recursive:true});fs.writeFileSync('dist/value','stable');\n";
  if (name === "beta")
    body += "if(fs.existsSync('fail-beta'))process.exit(1);\n";
  writeFileSync(join(fixture, `scripts/${name}.mjs`), body);
}
const table = [
  {
    name: "build",
    build: true,
    product: true,
    outputs: ["dist"],
    command: [process.execPath, "scripts/build.mjs"],
  },
  ...["alpha", "beta"].map((name) => ({
    name,
    product: true,
    needsBuild: true,
    command: [process.execPath, `scripts/${name}.mjs`],
  })),
];
writeFileSync(
  join(fixture, "driver.mjs"),
  `import { runGate } from ${JSON.stringify(pathToFileURL(resolve(source, "scripts/test-runner.mjs")).href)};\nprocess.exitCode=(await runGate(process.argv.slice(2),process.cwd(),{table:${JSON.stringify(table)}})).exitCode;\n`,
);
git(["add", "."]);
git(["commit", "-qm", "Independent verification fixture"]);
const events = [];
const run = (command, extra = {}, expected = 0) => {
  const result = spawnSync("/bin/zsh", ["-lc", command], {
    cwd: fixture,
    env: { ...process.env, ...extra },
    encoding: "utf8",
    maxBuffer: 8e6,
  });
  if (result.status !== expected)
    throw new Error(
      `Fixture command exited ${result.status}, expected ${expected}: ${command}`,
    );
  const row = readGateChecks(fixture).at(-1);
  events.push({
    command,
    exitCode: result.status,
    selection: row.gateSelection,
    partial: row.partial ?? false,
    fresh: row.freshSuites,
    reused: row.reusedSuites,
    notCarried: row.notCarried ?? {},
    taskContracts: row.taskTimeline.map((x) => ({
      name: x.name,
      taskContract: x.taskContract,
      exitCode: x.exitCode,
      reused: x.reused ?? false,
    })),
  });
  return row;
};
const a = {
  CLAUDE_PID: "101",
  CLAUDE_EFFORT: "max",
  CLAUDE_CODE_EXECPATH: "/fixture/session-a",
  LC_TERMINAL: "FixtureA",
  LC_TERMINAL_VERSION: "1",
};
const b = {
  CLAUDE_PID: "202",
  CLAUDE_EFFORT: "low",
  CLAUDE_CODE_EXECPATH: "/fixture/session-b",
  LC_TERMINAL: "FixtureB",
  LC_TERMINAL_VERSION: "2",
};
run("npm test --silent -- --only alpha --serial", a);
const full = run("npm test -- --serial", b);
const observed = () =>
  readFileSync(join(fixture, "observed.jsonl"), "utf8").trim().split("\n");
assert.deepEqual(observed(), ["build", "alpha", "beta"]);
assert.equal(full.reusedSuites, 2);
run("npm test --silent -- --only beta --serial", a);
assert.ok(
  (await coveringGateCheck(fixture, "npm test", ["alpha", "beta"])).row,
);
writeFileSync(join(fixture, "fail-beta"), "fail");
run("npm test -- --only beta --serial", b, 1);
assert.equal(
  (await coveringGateCheck(fixture, "npm test", ["alpha", "beta"])).row,
  undefined,
);
await assert.rejects(
  () => requireGateClaims(fixture, ledger),
  /no passing complete npm test row/,
);
const fs = await import("node:fs");
fs.unlinkSync(join(fixture, "fail-beta"));
run("npm test -- --only beta --confined-partial --serial", b);
const afterPartial = Boolean(
  (await coveringGateCheck(fixture, "npm test", ["alpha", "beta"])).row,
);
run("npm test -- --only beta --serial", { ...b, LC_TIME: "C" });
const afterOtherContract = await coveringGateCheck(fixture, "npm test", [
  "alpha",
  "beta",
]);
let lifecycleRefused = false;
try {
  await requireGateClaims(fixture, ledger);
} catch (error) {
  lifecycleRefused = /no passing complete npm test row/u.test(error.message);
}
assert.equal(afterOtherContract.row, undefined);
assert.ok(lifecycleRefused, "Expected the lifecycle claim to stay refused");
// Only an eligible pass under the failed contract resolves the failure.
run("npm test -- --only beta --serial", b);
const afterSameContract = await coveringGateCheck(fixture, "npm test", [
  "alpha",
  "beta",
]);
assert.equal(afterSameContract.row?.recordedAt, full.recordedAt);
const lifecycle = await requireGateClaims(fixture, ledger);
assert.ok(lifecycle.productGate);
const summary = {
  crossProcessComposition: {
    npmSpellings: ["silent", "ordinary"],
    separateLoginShells: true,
    changedSessionLabels: true,
    observedAfterComposition: ["build", "alpha", "beta"],
    fresh: full.freshSuites,
    reused: full.reusedSuites,
  },
  failureMaskRepaired: {
    afterFailureHasStandingRow: false,
    afterPartialHasStandingRow: afterPartial,
    afterPartialThenOtherContractHasStandingRow: Boolean(
      afterOtherContract.row,
    ),
    lifecycleClaimRefusedAfterOtherContract: lifecycleRefused,
    afterSameContractPassRestoresOriginalRow:
      afterSameContract.row?.recordedAt === full.recordedAt,
    lifecycleClaimAcceptedAfterSameContractPass: Boolean(lifecycle.productGate),
  },
  events,
};
console.log(JSON.stringify(summary, null, 2));
