// Diagnostic counterfactual hashes only; never restores repository bytes or
// supplies a gate claim. The historical row and checkpoint are pinned.
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  readFileSync,
  writeFileSync,
  realpathSync,
  mkdtempSync,
  rmSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { tmpdir } from "node:os";
import { pathToFileURL, fileURLToPath } from "node:url";
const root = realpathSync(process.cwd());
const scratch = realpathSync(
  mkdtempSync(join(tmpdir(), "dotln-ver006-diagnostic-")),
);
const imp = (name) => import(pathToFileURL(join(root, name)).href);
const { gateCodeIdentity, readGateChecks } = await imp(
  "scripts/lib/gate-evidence.mjs",
);
const { suites } = await imp("scripts/test-runner.mjs");
const git = (args) =>
  execFileSync("git", args, {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    maxBuffer: 32e6,
  });
const sourceFile = join(root, "scripts/lib/task-inputs.mjs");
const source = readFileSync(sourceFile, "utf8")
  .replaceAll(
    /from "(\.\/.+?)"/gu,
    (_, name) =>
      `from ${JSON.stringify(pathToFileURL(join(dirname(sourceFile), name)).href)}`,
  )
  .replace(
    "const fileHash = (base, path) => {",
    "const fileHash = (base, path) => { if (globalThis.ver006Override?.has(path)) return globalThis.ver006Override.get(path);",
  )
  .replace(
    "if (named !== undefined && inInventory(named)) found.add(named);",
    'if (named !== undefined && inInventory(named)) { found.add(named); if (named === "docs/control/current.md") globalThis.ver006Origins.add(path); }',
  );
const moduleFile = join(scratch, "ver006-binder-diagnostic.mjs");
writeFileSync(moduleFile, source);
const { taskInputBinder } = await import(pathToFileURL(moduleFile));
const id = gateCodeIdentity(root);
const row = readGateChecks(root)
  .filter(
    (r) =>
      r.checkId === "npm test" &&
      r.codeIdentity === id &&
      r.exitCode === 0 &&
      r.recordedAt === "2026-10-17T06:04:10.935Z",
  )
  .at(-1);
const task = suites.find((s) => s.name === "adjacent-queue");
const expected = row.taskTimeline.find((t) => t.name === task.name).inputBinding
  .digest;
globalThis.ver006Origins = new Set();
const actual = taskInputBinder(root, id).bind(task).digest;
const versions = [];
for (const ordinal of [27, 28, 29]) {
  const bytes = git([
    "show",
    `refs/dotln/checkpoint/WO-213/${ordinal}:docs/control/current.md`,
  ]);
  globalThis.ver006Override = new Map([
    [
      "docs/control/current.md",
      "file:" + createHash("sha256").update(bytes).digest("hex"),
    ],
  ]);
  const digest = taskInputBinder(root, id).bind(task).digest;
  versions.push({
    checkpointOrdinal: ordinal,
    digest,
    matchesRecorded: digest === expected,
  });
}
assert.equal(actual === expected, false);
assert.ok(
  versions.some((v) => v.matchesRecorded),
  "one saved projection alone must reconstruct the recorded binding",
);
const allDeclaredTasks = [];
for (const declared of suites.filter((suite) => Array.isArray(suite.inputs))) {
  globalThis.ver006Override = undefined;
  globalThis.ver006Origins = new Set();
  const current = taskInputBinder(root, id).bind(declared);
  const recorded = row.taskTimeline.find(
    (entry) => entry.name === declared.name,
  ).inputBinding;
  const projection = git([
    "show",
    "refs/dotln/checkpoint/WO-213/28:docs/control/current.md",
  ]);
  globalThis.ver006Override = new Map([
    [
      "docs/control/current.md",
      "file:" + createHash("sha256").update(projection).digest("hex"),
    ],
  ]);
  const reconstructed = taskInputBinder(root, id).bind(declared);
  assert.notEqual(current.digest, recorded.digest);
  assert.equal(reconstructed.digest, recorded.digest);
  allDeclaredTasks.push({
    name: declared.name,
    currentDigest: current.digest,
    recordedDigest: recorded.digest,
    projectionAloneExplainsDrift: true,
    sourceOrigins: [...globalThis.ver006Origins],
  });
}
const result = {
  instrument:
    "scratch copy with read-only single-input digest override; no gate claim consumed and no repository byte restored",
  identity: id,
  task: task.name,
  recordedDigest: expected,
  currentDigest: actual,
  sourceOrigins: [...globalThis.ver006Origins],
  versions,
  allDeclaredTasks,
};
rmSync(scratch, { recursive: true, force: true });
console.log(JSON.stringify(result, null, 2));
