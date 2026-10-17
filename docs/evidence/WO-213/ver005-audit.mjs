// Independent read-only comparison of the verification subject and its evidence.
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFileSync, lstatSync, readlinkSync, realpathSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";
import {
  gateCodeIdentity,
  readGateChecks,
} from "../../../scripts/lib/gate-evidence.mjs";
import {
  coveringGateCheck,
  buildOutputDigest,
} from "../../../scripts/lib/gate-reuse.mjs";
import { runGate, suites } from "../../../scripts/test-runner.mjs";
import {
  HOME_DIRECTORY,
  privatePathLines,
  withoutHomeDirectories,
} from "../../../scripts/lib/private-paths.mjs";

const root = realpathSync(process.cwd());
const git = (args) =>
  execFileSync("git", args, { cwd: root, encoding: "utf8", maxBuffer: 64e6 });
assert.equal(realpathSync(git(["rev-parse", "--show-toplevel"]).trim()), root);
const json = (name) => JSON.parse(readFileSync(join(root, name), "utf8"));
const sha = (value) => createHash("sha256").update(value).digest("hex");
const identity = gateCodeIdentity(root);
const expectedIdentity = /passed at code identity ([a-f0-9]{64})/u.exec(
  readFileSync(join(root, "docs/evidence/WO-213/handoff.md"), "utf8"),
)[1];
assert.equal(identity, expectedIdentity);
const logs = [];
const log = console.log;
try {
  console.log = (...args) => logs.push(args.join(" "));
  await runGate(["--review", "--list"], root);
} finally {
  console.log = log;
}
const required = logs
  .filter((line) => line.includes(" — protects:"))
  .map((line) => line.split(" — ")[0]);
assert.ok(required.length > 0);
const coverage = await coveringGateCheck(root, "npm test", required, identity);
assert.ok(coverage.row, "Current complete review claim must stand");
const row = coverage.row;
const all = readGateChecks(root);
const carried = row.taskTimeline.filter((task) => task.reused);
for (const task of carried) {
  const citation = task.sourceRow;
  assert.equal(citation.location, "worktree");
  const matches = all.filter(
    (source) =>
      source.codeIdentity === citation.codeIdentity &&
      source.recordedAt === citation.recordedAt &&
      source.checkId === citation.checkId &&
      source.evidenceRef === citation.evidenceRef,
  );
  assert.equal(matches.length, 1);
  const source = matches[0];
  assert.equal(source.identityUnchanged, true);
  assert.notEqual(source.partial, true);
  assert.ok(!source.stopped && !source.timedOut && !source.failureKind);
  const results = source.taskTimeline.filter(
    (result) => result.name === task.name,
  );
  assert.equal(results.length, 1);
  const executed = results[0];
  assert.equal(executed.executed, true);
  assert.equal(executed.exitCode, 0);
  assert.ok(!executed.reused && !executed.failureKind);
  assert.equal(executed.taskContract, task.taskContract);
  assert.equal(executed.inputBinding.digest, task.inputBinding.digest);
  assert.equal(citation.inputDigest, task.inputBinding.digest);
  assert.ok(Date.parse(executed.finishedAt) <= Date.parse(source.recordedAt));
}
const build = row.taskTimeline.find((task) => task.name === "build");
assert.equal(
  build.outputDigest,
  buildOutputDigest(root, suites.find((suite) => suite.build).outputs),
);

const checkpoint = "refs/dotln/checkpoint/WO-213/20";
const prior = new Map(
  git(["ls-tree", "-rz", checkpoint])
    .split("\0")
    .filter(Boolean)
    .map((line) => {
      const [metadata, name] = line.split("\t");
      return [name, metadata.split(" ")[2]];
    }),
);
const current = git([
  "ls-files",
  "--cached",
  "--others",
  "--exclude-standard",
  "-z",
])
  .split("\0")
  .filter(Boolean);
const implementation = (name) =>
  /^(?:scripts|packages|corpus|\.agents|\.claude)\//u.test(name);
const changed = [];
for (const name of new Set(
  [...prior.keys(), ...current].filter(implementation),
)) {
  let actual;
  try {
    const stat = lstatSync(join(root, name));
    const bytes = stat.isSymbolicLink()
      ? Buffer.from(readlinkSync(join(root, name)))
      : readFileSync(join(root, name));
    actual = createHash("sha1")
      .update(`blob ${bytes.length}\0`)
      .update(bytes)
      .digest("hex");
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
  if (actual !== prior.get(name)) changed.push(name);
}
for (const name of [
  "scripts/lib/private-paths.mjs",
  "scripts/docs-check.mjs",
  "scripts/lib/planning-followups.mjs",
  "scripts/lib/plan-receipts.mjs",
  "scripts/lib/target-records.mjs",
  "scripts/lib/target-planning.mjs",
  "packages/skeleton/src/runtime-inputs.mjs",
  "scripts/lib/release-kit-runtime.mjs",
  "scripts/lib/module-fixtures.mjs",
  "scripts/lib/host-lanes.mjs",
  "scripts/lib/config.mjs",
  "scripts/lib/harness.mjs",
  "packages/skeleton/src/harness-host.ts",
  "scripts/lib/reader-profiles.mjs",
  "scripts/lib/release-records.mjs",
  "scripts/lib/starter-refresh.mjs",
])
  assert.ok(
    !changed.includes(name),
    `${name} changed since the prior verified subject`,
  );

const baselineName = "docs/control/doc-baseline.json";
const baseline = json(baselineName);
const original = JSON.parse(git(["show", `HEAD:${baselineName}`]));
const proof = JSON.parse(
  execFileSync(process.execPath, ["docs/evidence/WO-213/record-baseline.mjs"], {
    cwd: root,
    encoding: "utf8",
    maxBuffer: 8e6,
  }),
);
assert.deepEqual(baseline, {
  ...original,
  homePaths: { ...original.homePaths, ...proof.homePaths },
});
const register = json("docs/planning/followups.json");
assert.equal(HOME_DIRECTORY.test(JSON.stringify(register)), false);
const originalRegister = JSON.parse(
  git(["show", "HEAD:docs/planning/followups.json"]),
);
const originalEntries = originalRegister.entries;
const currentEntries = register.entries;
const revisionChanges = [];
for (const old of originalEntries) {
  const now = currentEntries.find((entry) => entry.id === old.id);
  assert.ok(now);
  assert.ok(now.revisions.length >= old.revisions.length);
  for (let i = 0; i < old.revisions.length; i++) {
    const before = old.revisions[i];
    const after = now.revisions[i];
    if (JSON.stringify(before) === JSON.stringify(after)) continue;
    assert.deepEqual(after, {
      ...before,
      summary: withoutHomeDirectories(before.summary),
    });
    revisionChanges.push({
      id: old.id,
      revision: i + 1,
      field: "summary",
      before: { length: before.summary.length, sha256: sha(before.summary) },
      after: { length: after.summary.length, sha256: sha(after.summary) },
    });
  }
  assert.deepEqual(
    now.dispositions.slice(0, old.dispositions.length),
    old.dispositions,
  );
}
assert.deepEqual(
  revisionChanges,
  json("docs/evidence/WO-213/register-correction.json").changes,
);

let patternCases = 0;
const homeNames = ["/" + "Users/fixture-user", "/" + "home/fixture-user"];
for (const prefix of homeNames)
  for (const extension of [
    "json",
    "jsonl",
    "log",
    "txt",
    "JSON",
    "JsOnL",
    "LOG",
    "TXT",
  ])
    for (const boundary of ["", " ", '"', "\\n", "\\t", "\\u001b"])
      for (const repeats of [1, 2, 4]) {
        const value = `${boundary}${prefix.repeat(repeats)}/x`;
        assert.deepEqual(
          privatePathLines(`record.${extension}`, `safe\n${value}\n`),
          [2],
        );
        const safe = withoutHomeDirectories(value);
        assert.equal(HOME_DIRECTORY.test(safe), false);
        assert.equal(withoutHomeDirectories(safe), safe);
        patternCases++;
      }
assert.deepEqual(privatePathLines("record.log", "/tmp/fixture/x"), []);
assert.deepEqual(privatePathLines("record.md", "/tmp/fixture/x"), [1]);
const changedFiles = [
  ...new Set(
    [
      ...git(["diff", "--name-only", "HEAD", "-z"]).split("\0"),
      ...git(["ls-files", "--others", "--exclude-standard", "-z"]).split("\0"),
    ].filter(Boolean),
  ),
];
for (const name of changedFiles) {
  const stat = lstatSync(join(root, name), { throwIfNoEntry: false });
  if (stat?.isFile())
    assert.equal(
      readFileSync(join(root, name)).includes(Buffer.from(`${homedir()}/`)),
      false,
      `${name}: literal operator-home prefix`,
    );
}
console.log(
  JSON.stringify(
    {
      identity,
      review: {
        recordedAt: row.recordedAt,
        evidenceRef: row.evidenceRef,
        suites: required.length,
        tasks: row.taskTimeline.length,
        fresh: row.freshSuites,
        carried: carried.length,
        durationMs: row.durationMs,
        citedExecutionsChecked: carried.map((task) => task.name),
        buildOutputMatches: true,
      },
      changedImplementationSincePriorSubject: changed.sort(),
      baseline: {
        counts: proof.counts,
        originalEntries: Object.keys(original.homePaths).length,
        addedFiles: proof.files.length,
      },
      register: { originalEntries: originalEntries.length, revisionChanges },
      patternCases,
      literalHomeScanFiles: changedFiles.length,
    },
    null,
    2,
  ),
);
