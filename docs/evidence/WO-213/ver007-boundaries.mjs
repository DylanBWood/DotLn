import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  mkdtempSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
  rmSync,
  existsSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { pathToFileURL, fileURLToPath } from "node:url";
const source = process.cwd();
const load = (p) => import(pathToFileURL(join(source, p)));
const { runGate } = await load("scripts/test-runner.mjs");
const { gateCodeIdentity } = await load("scripts/lib/gate-evidence.mjs");
const { coveringGateCheck } = await load("scripts/lib/gate-reuse.mjs");
const { requireGateClaims } = await load("scripts/lib/handoff-ledger.mjs");
const repo = mkdtempSync(join(tmpdir(), "dotln-ver007-boundaries-"));
const git = (args) => {
  const r = spawnSync("git", args, { cwd: repo, encoding: "utf8" });
  assert.equal(r.status, 0, "fixture Git operation");
  return r.stdout;
};
const put = (p, text) => {
  mkdirSync(dirname(join(repo, p)), { recursive: true });
  writeFileSync(join(repo, p), text);
};
const claims = {
  checked: true,
  claims: { plain: ["9"], review: [], document: [] },
  advisories: [],
};
const output = [];
try {
  for (const args of [
    ["init", "-q", "-b", "main"],
    ["config", "maintenance.auto", "false"],
    ["config", "user.name", "Fixture"],
    ["config", "user.email", "fixture@example.invalid"],
  ])
    git(args);
  put(".gitignore", "docs/control/local/\nobserved.log\n");
  put("docs/control/current.md", "phase: repairing\n");
  put("scripts/build.mjs", 'console.log("PROGRESS build probe");\n');
  put(
    "scripts/require.mjs",
    'import {createRequire} from "node:module"; const load=createRequire(import.meta.url); load("./leaf");\n',
  );
  put(
    "scripts/url.mjs",
    'await import(new URL("./%75rl-leaf.mjs",import.meta.url));\n',
  );
  put("scripts/leaf.js", "process.exitCode=0;\n");
  put("scripts/url-leaf.mjs", "process.exitCode=0;\n");
  git(["add", "."]);
  git(["commit", "-qm", "verification fixture"]);
  const table = [
    {
      name: "build",
      build: true,
      product: true,
      outputs: [],
      command: [process.execPath, "scripts/build.mjs"],
    },
    ...["require", "url"].map((name) => ({
      name,
      product: true,
      command: [process.execPath, `scripts/${name}.mjs`],
    })),
  ];
  const first = await runGate(["--serial", "--again"], repo, { table });
  assert.equal(first.exitCode, 0);
  assert.equal(first.freshSuites, 3);
  assert(
    (
      await coveringGateCheck(
        repo,
        "npm test",
        table.map((x) => x.name),
      )
    ).row,
  );
  await requireGateClaims(repo, claims);
  put("docs/control/current.md", "phase: ready-to-verify\nphase: verifying\n");
  assert.equal(gateCodeIdentity(repo), first.codeIdentity);
  // Deliberately vary only irrelevant host labels on a separate process. The
  // child executes no replacement work; it reads the restored whole-code claim.
  const script = `import {coveringGateCheck} from ${JSON.stringify(pathToFileURL(join(source, "scripts/lib/gate-reuse.mjs")).href)};import {requireGateClaims} from ${JSON.stringify(pathToFileURL(join(source, "scripts/lib/handoff-ledger.mjs")).href)};const root=process.cwd();const c=await coveringGateCheck(root,'npm test',${JSON.stringify(table.map((x) => x.name))});if(!c.row)process.exit(19);await requireGateClaims(root,${JSON.stringify(claims)});console.log('current coverage and lifecycle accept');`;
  const changedEnv = spawnSync(
    process.execPath,
    ["--input-type=module", "-e", script],
    {
      cwd: repo,
      encoding: "utf8",
      env: {
        ...process.env,
        GIT_EDITOR: "true",
        GIT_PAGER: "cat",
        LC_ALL: "C",
        LC_CTYPE: "C",
        PATH: "/usr/bin:/bin:" + process.env.PATH,
      },
    },
  );
  assert.equal(changedEnv.status, 0, changedEnv.stderr);
  assert.match(changedEnv.stdout, /lifecycle accept/);
  const reused = await runGate(["--serial"], repo, { table });
  assert.equal(reused.exitCode, 0);
  assert.equal(reused.freshSuites, 0);
  assert.equal(reused.reusedSuites, 3);
  output.push({
    case: "lifecycle projection and separate host environment",
    currentCoverage: true,
    lifecycleClaims: true,
    freshTasks: reused.freshSuites,
    reusedTasks: reused.reusedSuites,
  });
  for (const [task, file] of [
    ["require", "leaf.js"],
    ["url", "url-leaf.mjs"],
  ]) {
    put(`scripts/${file}`, "process.exitCode=13;\n");
    assert.notEqual(gateCodeIdentity(repo), first.codeIdentity);
    assert.equal(
      (
        await coveringGateCheck(
          repo,
          "npm test",
          table.map((x) => x.name),
        )
      ).row,
      undefined,
    );
    await assert.rejects(() => requireGateClaims(repo, claims));
    const direct = spawnSync(process.execPath, [`scripts/${task}.mjs`], {
      cwd: repo,
      encoding: "utf8",
    });
    assert.equal(direct.status, 13);
    const failed = await runGate(["--serial"], repo, { table });
    assert.equal(failed.exitCode, 1);
    assert.equal(failed.freshSuites, 3);
    assert.equal(failed.reusedSuites, 0);
    assert.equal(failed.taskTimeline.find((x) => x.name === task).exitCode, 13);
    assert.equal(
      (
        await coveringGateCheck(
          repo,
          "npm test",
          table.map((x) => x.name),
        )
      ).row,
      undefined,
    );
    output.push({
      case:
        task === "require"
          ? "extensionless createRequire load"
          : "URL-decoded dynamic import",
      directExit: 13,
      changedCode: true,
      staleCoverage: false,
      lifecycleRefused: true,
      gateExit: failed.exitCode,
      freshTasks: failed.freshSuites,
      reusedTasks: failed.reusedSuites,
    });
    put(`scripts/${file}`, "process.exitCode=0;\n");
  }
  writeFileSync(
    join(dirname(fileURLToPath(import.meta.url)), "ver007-boundaries.json"),
    JSON.stringify(output, null, 2) + "\n",
  );
  console.log("VER007_BOUNDARIES " + JSON.stringify(output));
} finally {
  rmSync(repo, { recursive: true, force: true });
}
