// Reproduce the comment-check regression against the order's main baseline.
// The old check's imports resolve to the candidate's shared adapters; the
// comment recognizer and its invocation remain the bytes recorded on main.
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import {
  createScratchRoot,
  removeTemporaryPath,
} from "../../../../scripts/lib/temporary-roots.mjs";
import * as current from "../../../../scripts/lib/comment-labels.mjs";
import { feedbackSourcesComments } from "../../../../packages/skeleton/dist/src/feedback-source-comments.js";

const root = fileURLToPath(new URL("../../../../", import.meta.url));
const baseline = "0097fcac608bcaa24c51c8b6d6020fc2382ea141";
const scratch = createScratchRoot(join(tmpdir(), "dotln-ver276-comments-"));
try {
  let oldSource = execFileSync(
    "git",
    ["show", `${baseline}:scripts/lib/comment-labels.mjs`],
    { cwd: root, encoding: "utf8" },
  );
  for (const specifier of [
    "./helpers.mjs",
    "./git.mjs",
    "./config.mjs",
    "./paths.mjs",
    "./evidence-sources.mjs",
    "../../packages/skeleton/dist/src/feedback-source-comments.js",
  ])
    oldSource = oldSource.replaceAll(
      JSON.stringify(specifier),
      JSON.stringify(
        pathToFileURL(resolve(root, "scripts/lib", specifier)).href,
      ),
    );
  const oldPath = join(scratch, "baseline-comment-labels.mjs");
  writeFileSync(oldPath, oldSource);
  const old = await import(pathToFileURL(oldPath));
  const fixtures = [
    {
      path: "component.tsx",
      source: "// WO-999: renders a view\nexport const View = () => <div />;\n",
    },
    {
      path: "component.jsx",
      source: "// WO-999: renders a view\nexport const View = () => <div />;\n",
    },
    {
      path: "module.mjs",
      source: "// WO-999: exports a value\nexport const value = 1;\n",
    },
    {
      path: "matcher.mjs",
      source:
        'const ready = true; const text = "sample";\nif (ready) /[/*] D123/.test(text);\n',
    },
  ];
  const bodies = feedbackSourcesComments(fixtures);
  const results = fixtures.map((fixture, index) => ({
    ...fixture,
    baseline: old.commentLabelFindings(
      fixture.path,
      fixture.source,
      bodies[index],
    ),
    candidate: current.commentLabelFindings(fixture.path, fixture.source),
    parsedCommentBodies: bodies[index],
  }));
  const fixtureRoot = join(scratch, "fixture");
  mkdirSync(fixtureRoot);
  execFileSync("git", ["init", "-q", fixtureRoot]);
  writeFileSync(
    join(fixtureRoot, "dotln.config.json"),
    JSON.stringify({ version: 1, roots: {} }),
  );
  for (const fixture of fixtures)
    writeFileSync(join(fixtureRoot, fixture.path), fixture.source);
  execFileSync(process.execPath, ["--check", join(fixtureRoot, "matcher.mjs")]);
  const options = {
    baseline: { schemaVersion: 1, admitted: {}, lines: {} },
    files: fixtures.map((fixture) => fixture.path),
  };
  const checks = {
    baseline: old.checkCommentLabels(fixtureRoot, options),
    candidate: current.checkCommentLabels(fixtureRoot, options),
  };
  assert.equal(results[0].baseline.length, 1);
  assert.equal(results[1].baseline.length, 1);
  assert.equal(results[0].candidate.length, 0);
  assert.equal(results[1].candidate.length, 0);
  assert.equal(results[2].baseline.length, 1);
  assert.equal(results[2].candidate.length, 1);
  assert.equal(results[3].baseline.length, 0);
  assert.equal(results[3].candidate.length, 1);
  assert.equal(checks.baseline.findings.length, 3);
  assert.equal(checks.candidate.findings.length, 2);
  console.log(JSON.stringify({ baseline, results, checks }, null, 2));
} finally {
  removeTemporaryPath(scratch, { recursive: true, force: true });
}
