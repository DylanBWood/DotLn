import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync, existsSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { pathToFileURL, fileURLToPath } from "node:url";
const root = process.cwd();
const load = (p) => import(pathToFileURL(join(root, p)));
const { gateCodeIdentity, readGateChecks } = await load(
  "scripts/lib/gate-evidence.mjs",
);
const { coveringGateCheck, buildOutputAttested } = await load(
  "scripts/lib/gate-reuse.mjs",
);
const { suites } = await load("scripts/test-runner.mjs");
const run = (args, extra = {}) => {
  const r = spawnSync("git", args, {
    cwd: root,
    encoding: "utf8",
    maxBuffer: 32 * 1024 * 1024,
    ...extra,
  });
  assert.equal(r.status, 0, "git " + args.slice(0, 2).join(" "));
  return r.stdout;
};
const listed = spawnSync(
  process.execPath,
  ["scripts/test-runner.mjs", "--review", "--list"],
  { cwd: root, encoding: "utf8" },
);
assert.equal(listed.status, 0);
const names = listed.stdout
  .trim()
  .split("\n")
  .map((x) => x.split(" — ")[0]);
const identity = gateCodeIdentity(root);
assert.equal(
  identity,
  "b407908294cb66bc8010ab8dea5f66095dde8971cecb2b1e2d6236640b9efcf3",
);
const cover = await coveringGateCheck(root, "npm test", names, identity);
assert(
  cover.row,
  `no covering row: ${JSON.stringify({ missing: cover.missing, displaced: cover.displaced?.tasks })}`,
);
const row = cover.row;
const results = row.taskTimeline ?? row.cases;
assert.equal(results.length, 103);
assert.equal(new Set(results.map((x) => x.name)).size, 103);
assert(
  results.every((x) => x.executed === true && x.exitCode === 0 && !x.reused),
);
assert.equal(row.requiredSuites.length, 46);
assert.equal(names.length, 46);
assert.equal(row.identityUnchanged, true);
assert.equal(row.buildOutputUnchanged, true);
assert(
  buildOutputAttested(
    root,
    suites.find((x) => x.build),
    results.find((x) => x.name === "build"),
  ),
);
const reconstruction = "a69240cca9f81959ee365c83766f6e51cbc1f2df";
assert.equal(
  gateCodeIdentity(root, reconstruction),
  "e5d529961f02e7fc6bc8287b202969fd4a30bb0029b69276096cb685f441ce88",
);
const tree = run(["ls-tree", "-r", "-z", reconstruction])
  .split("\0")
  .filter(Boolean)
  .map((s) => {
    const m = /^(\d+) blob (\w+)\t(.*)$/s.exec(s);
    assert(m);
    return { mode: m[1], blob: m[2], name: m[3] };
  });
const code = tree.filter(
  (x) =>
    !x.name.startsWith("docs/") &&
    !x.name.startsWith(".claude/") &&
    !x.name.startsWith(".agents/") &&
    !/^[^/]+\.md$/i.test(x.name),
);
const rawDifferent = [];
for (const x of code) {
  assert(existsSync(join(root, x.name)), `missing ${x.name}`);
  const hash = run(["hash-object", "--", x.name]).trim();
  if (hash !== x.blob) rawDifferent.push(x.name);
}
const accepted = [
  "scripts/test-runner.mjs",
  "packages/console/fixtures/manifest.json",
  "packages/console/fixtures/expected/selfhost.html",
  "packages/console/fixtures/expected/selfhost.json",
  "packages/console/fixtures/expected/selfhost.txt",
];
assert.deepEqual(rawDifferent.sort(), accepted.sort());
for (const p of [
  "scripts/lib/task-inputs.mjs",
  "scripts/lib/module-fixtures.mjs",
  "corpus/harness/wo213-role-baseline.test.mjs",
  "scripts/wo213-role-baseline.mjs",
])
  assert(!existsSync(join(root, p)), `withdrawn source exists ${p}`);
const docs = readGateChecks(root)
  .filter((x) => x.checkId === "npm run test:docs")
  .at(-1);
const out = {
  identity,
  selectionCount: names.length,
  coverage: true,
  displaced: cover.displaced?.tasks ?? [],
  recordedAt: row.recordedAt,
  durationMs: row.durationMs,
  evidenceRef: row.evidenceRef,
  freshTasks: results.length,
  buildOutputAttested: true,
  reconstructionIdentity: gateCodeIdentity(root, reconstruction),
  rawComparedFiles: code.length,
  rawDifferences: rawDifferent,
  latestDocument: {
    recordedAt: docs?.recordedAt,
    exitCode: docs?.exitCode,
    durationMs: docs?.durationMs,
  },
};
writeFileSync(
  join(dirname(fileURLToPath(import.meta.url)), "ver007-audit.json"),
  JSON.stringify(out, null, 2) + "\n",
);
console.log(JSON.stringify(out, null, 2));
