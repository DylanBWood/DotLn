import assert from "node:assert/strict";
import {
  appendFileSync,
  chmodSync,
  cpSync,
  mkdirSync,
  readFileSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { dirname, delimiter, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { suites, expandSuiteTasks, runGate } from "./test-runner.mjs";
import { suiteDeclaration } from "./lib/suite-evidence.mjs";
import { releaseCases } from "./lib/release-fixtures.mjs";
import { readGateChecks, recordGateChecks } from "./lib/gate-evidence.mjs";
import { installLicenseFixture } from "./test-license-fixture.mjs";

const source = resolve(import.meta.dirname, "..");
const write = (root, path, value) => {
  mkdirSync(dirname(join(root, path)), { recursive: true });
  writeFileSync(join(root, path), value);
};
if (process.argv[1] === import.meta.filename) {
  const [action, root, target] = process.argv.slice(2);
  assert.equal(
    JSON.parse(readFileSync(join(root, "package.json"), "utf8")).name,
    "release-fixture",
  );
  if (action === "prepare") {
    // Keep the actual closeout and release checks. Only the fixture suite bodies
    // are synthetic; the scheduler, keys, sealed successes and closeout are real.
    const preserved = new Set([
      "scripts/release.mjs",
      "scripts/worktree.mjs",
      "scripts/resume.mjs",
      "scripts/license-surfaces.mjs",
    ]);
    for (const suite of suites)
      for (const path of suite.command.filter((part) =>
        part.startsWith("scripts/"),
      ))
        if (!preserved.has(path))
          write(
            root,
            path,
            path.endsWith(".sh")
              ? "#!/bin/sh\nexit 0\n"
              : "// Synthetic check.\n",
          );
    for (const path of [
      "scripts/test-suite-evidence.mjs",
      "scripts/test-suite-sandbox.mjs",
      "scripts/test-release-fixtures.mjs",
      "scripts/test-gate-deadlines.mjs",
      "corpus/harness/wo101-id-corpus.test.mjs",
      "corpus/mutation/wo108-selftest.test.mjs",
    ])
      write(root, path, "// Synthetic check.\n");
    write(
      root,
      "scripts/test-release.sh",
      releaseCases(source)
        .map((name) => `release_case_${name}() {\n  :\n}\n`)
        .join("\n"),
    );
    for (const name of ["compiler", "console"])
      write(
        root,
        `packages/${name}/package.json`,
        JSON.stringify({
          name: `@dotln/${name}`,
          version: "0.1.0",
          type: "module",
        }) + "\n",
      );
    const skeletonPath = join(root, "packages/skeleton/package.json");
    const skeleton = JSON.parse(readFileSync(skeletonPath, "utf8"));
    skeleton.type = "module";
    writeFileSync(skeletonPath, JSON.stringify(skeleton, null, 2) + "\n");
    installLicenseFixture(root);
    const packagePath = join(root, "package.json");
    const manifest = JSON.parse(readFileSync(packagePath, "utf8"));
    manifest.scripts["test:full"] = "node scripts/fixture-full-gate.mjs";
    manifest.scripts["format:check"] = "node scripts/fixture-check.mjs";
    writeFileSync(packagePath, JSON.stringify(manifest, null, 2) + "\n");
    write(root, "scripts/fixture-check.mjs", "// Synthetic format check.\n");
    write(
      root,
      "scripts/build.mjs",
      `import {mkdirSync,writeFileSync,copyFileSync,rmSync} from 'node:fs';for(const name of ['kernel','compiler','skeleton','console']) {const dir='packages/'+name+'/dist/test';rmSync('packages/'+name+'/dist',{recursive:true,force:true});mkdirSync(dir,{recursive:true});writeFileSync(dir+'/fixture.test.js',"import test from 'node:test';test('synthetic',()=>{});\\n");}mkdirSync('packages/kernel/dist/src',{recursive:true});copyFileSync('packages/kernel/test-fixtures/runtime-valid.mjs','packages/kernel/dist/src/index.js');mkdirSync('packages/skeleton/dist/src',{recursive:true});writeFileSync('packages/skeleton/dist/src/cli.js',\"console.log('fixture skeleton passed');\\n\");\n`,
    );
    write(
      root,
      "scripts/fixture-full-gate.mjs",
      `import {runReleaseCompositionGate} from ${JSON.stringify(pathToFileURL(import.meta.filename).href)};await runReleaseCompositionGate(process.cwd());\n`,
    );
  } else if (action === "installed") {
    write(
      root,
      "node_modules/typescript/bin/tsc",
      "#!/usr/bin/env node\nconsole.log('Version 5.4.5');\n",
    );
    chmodSync(join(root, "node_modules/typescript/bin/tsc"), 0o755);
    mkdirSync(join(root, "node_modules/.bin"), { recursive: true });
    symlinkSync("../typescript/bin/tsc", join(root, "node_modules/.bin/tsc"));
  } else if (action === "handoff") {
    for (const path of [
      "node_modules",
      "packages/kernel/dist",
      "packages/compiler/dist",
      "packages/skeleton/dist",
      "packages/console/dist",
    ])
      cpSync(join(root, path), join(target, path), {
        recursive: true,
        verbatimSymlinks: true,
      });
    recordGateChecks(target, readGateChecks(root));
  } else if (action === "assert") {
    const rows = readFileSync(join(dirname(root), "composition.jsonl"), "utf8")
      .trim()
      .split("\n")
      .map(JSON.parse);
    assert.equal(rows.length, 2);
    assert.equal(rows[0].reusedSuites, 0);
    assert.notEqual(rows[0].treeHash, rows[1].treeHash);
    assert.equal(
      rows[1].freshSuites,
      rows[1].expectedFresh.length,
      JSON.stringify(rows[1].freshReasons),
    );
    assert.equal(rows[1].reusedSuites, rows[1].expectedReuse.length);
    assert.deepEqual(rows[1].reused, rows[1].expectedReuse);
    console.log(
      `release close after reviewed-branch merge: ${rows[1].freshSuites} fresh / ${rows[1].reusedSuites} reused; source evidence handed off; session environment changed`,
    );
  } else throw new Error("fixture action required");
}

export async function runReleaseCompositionGate(root) {
  // Remove only the release transport's npm/Git doubles. The nested runner uses
  // real npm and Git, while the outer closeout retains its local publication doubles.
  process.env.PATH = (process.env.PATH ?? "")
    .split(delimiter)
    .filter((path) => path !== join(dirname(root), "bin"))
    .join(delimiter);
  const tasks = expandSuiteTasks(
    suites.filter((row) => !row.document || row.fast),
    root,
    "/synthetic-template",
  );
  // The reviewed gate and the release close both run as sandboxed sessions
  // whose host refuses sandbox startup: the reviewed successes must carry
  // without the denial, which is an addition and never a condition of reuse.
  const result = await runGate(["--full"], root, {
    kernelProbe: () => ({
      available: false,
      reason: "synthetic release-close session refuses sandbox startup",
    }),
  });
  const expectedReuse = tasks
    .filter(
      (row) => suiteDeclaration(row)?.paths && row.name !== "release:prepare",
    )
    .map((row) => row.name)
    .sort();
  const reusableNames = new Set(expectedReuse);
  appendFileSync(
    join(dirname(root), "composition.jsonl"),
    JSON.stringify({
      treeHash: result.treeHash,
      freshSuites: result.freshSuites,
      reusedSuites: result.reusedSuites,
      freshReasons: result.freshReasons,
      reused: result.taskTimeline
        .filter((row) => row.reused)
        .map((row) => row.name)
        .sort(),
      expectedFresh: tasks
        .filter((row) => !reusableNames.has(row.name))
        .map((row) => row.name)
        .sort(),
      expectedReuse,
    }) + "\n",
  );
  assert.equal(result.exitCode, 0);
}
