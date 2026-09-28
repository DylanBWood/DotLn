#!/usr/bin/env node
// Historical since WO-163, which closes WO-142 D008. The record beside
// WO-042's evidence is the 2026-09-09 observation of one fixture snapshot.
// --check compared every package file, the lockfile, the mutation instrument
// and this tool with the recorded hashes, so it failed at the first later edit
// to any of them. --write could not rerun the observation: the instrument's
// campaign names a Beacon leaf that has left the skeleton package, and a rerun
// would replace a closed order's record. --check now verifies the record
// against itself, then that the recorded killing-test titles occur in package
// test source, and reports the drift. Lexical title presence does not prove
// active test coverage. The environment scrub is the instrument's.
import { docPath, findLaunchpad } from "./lib/config.mjs";
import assert from "node:assert/strict";
import { tmpdir } from "node:os";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync, realpathSync } from "node:fs";
import { join } from "node:path";

import { cleanEnvironment } from "../corpus/mutation/mutate.mjs";

const [mode, ...extra] = process.argv.slice(2);
assert.ok(
  mode === "--check" && !extra.length,
  "usage: authority-mutation-evidence.mjs --check (historical record; --write is retired)",
);
const root = realpathSync(findLaunchpad());
const git = (cwd, args) =>
  execFileSync("git", args, {
    cwd,
    env: cleanEnvironment(realpathSync(tmpdir())),
    encoding: "utf8",
    maxBuffer: 32 * 1024 * 1024,
  });
assert.equal(
  realpathSync(git(root, ["rev-parse", "--show-toplevel"]).trim()),
  root,
);
const sha256 = (value) => createHash("sha256").update(value).digest("hex");
const destination = docPath(root, "evidence", "WO-042/mutations");
const summary = JSON.parse(
  readFileSync(join(destination, "summary.json"), "utf8"),
);
const transcript = readFileSync(join(destination, "reproduce.log"), "utf8");
assert.equal(sha256(transcript), summary.transcriptSha256);
for (const [index, id] of ["M00001", "M00002"].entries()) {
  const result = summary.results[index];
  assert.equal(result.id, id);
  assert.equal(result.verdict, "killed-by-test");
  assert.equal(result.compiled, true);
  assert.ok(result.killingTests.length > 0);
  assert.ok(transcript.includes(JSON.stringify(result)));
  const baseline = summary.baselines[index];
  assert.equal(baseline.verdict, "survived");
  assert.equal(baseline.failed, 0);
  assert.equal(baseline.cancelled, 0);
  assert.ok(baseline.passed > 0);
  assert.ok(transcript.includes(`baseline ${JSON.stringify(baseline)}`));
}
const inventory = [
  ...new Set(
    git(root, ["ls-files", "-z", "--cached", "--others", "--exclude-standard"])
      .split("\0")
      .filter(Boolean),
  ),
].sort();
// A path the index lists and the working tree lacks counts as changed.
const current = (path) => {
  try {
    return readFileSync(join(root, path));
  } catch {
    return null;
  }
};
const tests = inventory
  .filter((path) => /^packages\/[^/]+\/test\/.*\.ts$/u.test(path))
  .map((path) => current(path)?.toString() ?? "");
for (const title of summary.results.flatMap((result) => result.killingTests))
  assert.ok(
    tests.some((source) => source.includes(title)),
    `the record's killing-test title is absent from package test source: ${title}`,
  );
const subjectPaths = inventory.filter((path) =>
  /^(?:packages\/|(?:package(?:-lock)?|tsconfig)\.json$|corpus\/mutation\/(?:mutate|enumerate)\.mjs$|scripts\/authority-mutation-evidence\.mjs$)/u.test(
    path,
  ),
);
const recorded = new Map(
  summary.subjectFiles.map((file) => [file.path, file.sha256]),
);
const unchanged = subjectPaths.filter((path) => {
  const bytes = current(path);
  return bytes !== null && recorded.get(path) === sha256(bytes);
}).length;
console.log(
  `Historical record verified against itself: snapshot ${summary.snapshot}, two green baselines and two named mutation test kills. Recorded killing-test titles occur in package test source; lexical presence does not establish active test coverage.`,
);
console.log(
  `Executable subject since the record: ${recorded.size} recorded files, ${subjectPaths.length} current, ${unchanged} unchanged. No other claim about current source.`,
);
