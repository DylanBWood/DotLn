import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync, execFileSync } from "node:child_process";
import {
  mkdtempSync,
  mkdirSync,
  writeFileSync,
  readFileSync,
  rmSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { tmpdir } from "node:os";
import { probeKernelDenial } from "./lib/suite-sandbox.mjs";
import { runGate } from "./test-runner.mjs";
import { readGateChecks } from "./lib/gate-evidence.mjs";

const write = (root, path, text) => {
  mkdirSync(dirname(join(root, path)), { recursive: true });
  writeFileSync(join(root, path), text);
};
function fixture(
  t,
  testSource = 'import test from "node:test"; test("fixture",()=>{});\n',
) {
  const root = mkdtempSync(join(tmpdir(), "dotln-sandbox-fixture-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  for (const args of [
    ["init", "-q"],
    ["config", "user.name", "Fixture"],
    ["config", "user.email", "fixture@example.invalid"],
  ])
    execFileSync("git", args, { cwd: root, stdio: "pipe" });
  write(root, "package.json", '{"type":"module"}\n');
  write(
    root,
    ".gitignore",
    "node_modules/\n.runtime/\n**/dist/\ndocs/control/local/\n",
  );
  write(root, "node_modules/example/index.js", "// installed fixture\n");
  write(root, "packages/kernel/dist/src/index.js", "// built fixture\n");
  write(root, "docs/product/02-domain-model.md", "Declared fixture input\n");
  write(
    root,
    "scripts/build.mjs",
    `import {mkdirSync,writeFileSync} from 'node:fs';mkdirSync('packages/kernel/dist/test',{recursive:true});writeFileSync('packages/kernel/dist/test/fixture.test.js',${JSON.stringify(testSource)});\n`,
  );
  execFileSync("git", ["add", "."], { cwd: root, stdio: "pipe" });
  execFileSync("git", ["commit", "-qm", "Synthetic sandbox subject"], {
    cwd: root,
    stdio: "pipe",
  });
  return root;
}

test("WO-131 sandbox probe distinguishes denied reads from unavailable startup", () => {
  const calls = [];
  const run = (command, args) => {
    calls.push([command, ...args]);
    return calls.length === 3
      ? { status: 1, stderr: "EACCES: permission denied" }
      : { status: 0 };
  };
  assert.equal(
    probeKernelDenial(process.cwd(), { platform: "darwin", run }).available,
    true,
  );
  assert.equal(calls.length, 3);
  assert.equal(calls[1][0], "/usr/bin/sandbox-exec");
  let unavailableCalls = 0;
  assert.equal(
    probeKernelDenial(process.cwd(), {
      platform: "darwin",
      run: () => ({ status: ++unavailableCalls === 2 ? 1 : 0 }),
    }).available,
    false,
  );
  assert.equal(unavailableCalls, 2);
  assert.equal(
    probeKernelDenial(process.cwd(), {
      platform: "linux",
      run: () => {
        throw new Error("must not spawn");
      },
    }).available,
    false,
  );
});

test("WO-131 actual host denies literal absolute candidate reads in parent and descendant processes", (t) => {
  const root = fixture(t);
  const candidate = join(root, "docs/undeclared.txt");
  write(root, "docs/undeclared.txt", "hidden candidate\n");
  const probe = probeKernelDenial(root);
  if (process.argv.includes("--require-host"))
    assert.equal(probe.available, true, probe.reason);
  if (!probe.available) {
    t.skip(probe.reason);
    return;
  }
  const read = `require('node:fs').readFileSync(${JSON.stringify(candidate)},'utf8')`;
  for (const program of [
    read,
    `const r=require('node:child_process').spawnSync(process.execPath,['-e',${JSON.stringify(read)}],{stdio:'inherit'});process.exit(r.status??1);`,
  ]) {
    const result = spawnSync(
      probe.command[0],
      [...probe.command.slice(1), process.execPath, "-e", program],
      { cwd: dirname(root), encoding: "utf8" },
    );
    assert.notEqual(result.status, 0);
    assert.match(
      result.stderr,
      /EACCES|EPERM|Operation not permitted|Permission denied/,
    );
    assert.equal(result.stdout, "");
  }
});

test("WO-131 unavailable denial still narrows, records its provenance and reuses across sessions with or without the denial", async (t) => {
  const root = fixture(t);
  const kernelRow = () =>
    readGateChecks(root).findLast(
      (row) => row.checkId === "suite:kernel" && row.name === "kernel",
    );
  let probes = 0;
  const unavailable = {
    kernelProbe: () => {
      probes++;
      return { available: false, reason: "fixture refuses sandbox startup" };
    },
  };
  const first = await runGate(["--only", "kernel"], root, unavailable);
  assert.equal(first.exitCode, 0);
  assert.equal(first.reusedSuites, 0);
  const executed = kernelRow();
  assert.equal(executed.executionRoot, "replica");
  assert.equal(executed.narrowingRefusal, undefined);
  assert.match(executed.inputHash, /^[a-f0-9]{64}$/);
  assert.deepEqual(executed.kernelDenial, {
    available: false,
    reason: "fixture refuses sandbox startup",
    applied: false,
  });
  // A document-only change in a later session without the denial reuses it.
  write(root, "docs/report.md", "Unrelated report\n");
  const second = await runGate(["--only", "kernel"], root, unavailable);
  assert.equal(second.exitCode, 0);
  assert.equal(second.reusedSuites, 1);
  const reused = kernelRow();
  assert.equal(reused.executionRoot, "replica");
  assert.equal(reused.kernelDenial.applied, false);
  assert.equal(reused.sourceExecution.kernelDenial.applied, false);
  // A session that can apply the denial holds the same key and reuses it too:
  // availability is recorded, never keyed. Its wrapper would fail any execution.
  const third = await runGate(["--only", "kernel"], root, {
    kernelProbe: () => ({
      available: true,
      reason: "synthetic available probe",
      command: [process.execPath, "-e", "process.exit(1)"],
    }),
  });
  assert.equal(third.exitCode, 0);
  assert.equal(third.reusedSuites, 1);
  // A declared input change re-executes, still narrowed and still recorded.
  write(root, "docs/product/02-domain-model.md", "Changed declared input\n");
  const changed = await runGate(["--only", "kernel"], root, unavailable);
  assert.equal(changed.exitCode, 0);
  assert.equal(changed.reusedSuites, 0);
  assert.equal(kernelRow().executionRoot, "replica");
  assert.notEqual(kernelRow().inputHash, executed.inputHash);
  assert.equal(probes, 3, "one probe per gate");
});

test("WO-131 runner applies one probed wrapper, seals its source execution provenance and a session without the denial reuses it", async (t) => {
  const root = fixture(t);
  const wrapperRoot = mkdtempSync(join(tmpdir(), "dotln-wrapper-fixture-"));
  t.after(() => rmSync(wrapperRoot, { recursive: true, force: true }));
  const log = join(wrapperRoot, "executed.txt");
  const wrapper = join(wrapperRoot, "wrapper.cjs");
  writeFileSync(
    wrapper,
    `require('node:fs').appendFileSync(${JSON.stringify(log)},'wrapped\\n');const [command,...args]=process.argv.slice(2);const r=require('node:child_process').spawnSync(command,args,{stdio:'inherit'});process.exit(r.status??1);\n`,
  );
  let probes = 0;
  const options = {
    kernelProbe: () => {
      probes++;
      return {
        available: true,
        reason: "synthetic wrapper probe",
        command: [process.execPath, wrapper],
      };
    },
  };
  const first = await runGate(["--only", "kernel"], root, options);
  assert.equal(first.exitCode, 0);
  assert.equal(readFileSync(log, "utf8"), "wrapped\n");
  write(root, "docs/report.md", "Unrelated report\n");
  const second = await runGate(["--only", "kernel"], root, options);
  assert.equal(second.exitCode, 0);
  assert.equal(second.reusedSuites, 1);
  assert.equal(readFileSync(log, "utf8"), "wrapped\n");
  const row = readGateChecks(root).findLast(
    (row) => row.checkId === "suite:kernel" && row.name === "kernel",
  );
  assert.equal(
    row.kernelDenial.applied,
    false,
    "this gate reused rather than executed",
  );
  assert.equal(row.sourceExecution.kernelDenial.applied, true);
  assert.equal(probes, 2);
  // A later role session whose host refuses sandbox startup reuses the
  // protected record under the same key; the wrapper never runs again.
  write(root, "docs/report.md", "Another unrelated report\n");
  const third = await runGate(["--only", "kernel"], root, {
    kernelProbe: () => ({
      available: false,
      reason: "fixture refuses sandbox startup",
    }),
  });
  assert.equal(third.exitCode, 0);
  assert.equal(third.reusedSuites, 1);
  const later = readGateChecks(root).findLast(
    (row) => row.checkId === "suite:kernel" && row.name === "kernel",
  );
  assert.equal(later.kernelDenial.available, false);
  assert.equal(later.sourceExecution.kernelDenial.applied, true);
  assert.equal(readFileSync(log, "utf8"), "wrapped\n");
});
