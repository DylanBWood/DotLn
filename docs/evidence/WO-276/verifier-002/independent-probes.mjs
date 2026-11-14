import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { stripTypeScriptTypes } from "node:module";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import {
  createScratchRoot,
  removeTemporaryPath,
} from "../../../../scripts/lib/temporary-roots.mjs";
import { commentLabelFindings } from "../../../../scripts/lib/comment-labels.mjs";
import {
  markdownScreen,
  screenedSources,
  screenSource,
} from "../../../../scripts/lib/markdown-screen.mjs";

const root = fileURLToPath(new URL("../../../../", import.meta.url));
const base = "0097fcac608bcaa24c51c8b6d6020fc2382ea141";
const scratch = createScratchRoot(join(tmpdir(), "dotln-ver002-"));
const git = (...args) =>
  execFileSync("git", args, { cwd: root, encoding: "utf8" });
const rows = (findings) => findings.map(({ line, kind }) => [line, kind]);
try {
  // Extract the baseline's actual grammar reader, not the candidate's adapter.
  let oldBodies = stripTypeScriptTypes(
    git("show", `${base}:packages/skeleton/src/feedback-source-comments.ts`),
    { mode: "strip" },
  );
  oldBodies = oldBodies.replace(
    "createRequire(import.meta.url)",
    `createRequire(${JSON.stringify(pathToFileURL(join(root, "packages/skeleton/src/feedback-source-comments.ts")).href)})`,
  );
  writeFileSync(join(scratch, "baseline-bodies.mjs"), oldBodies);
  const baselineBodies = await import(
    pathToFileURL(join(scratch, "baseline-bodies.mjs")).href
  );
  let oldCheck = git("show", `${base}:scripts/lib/comment-labels.mjs`);
  oldCheck = oldCheck.replace(
    /from "(\.{1,2}\/[^"]+)"/gu,
    (_, specifier) =>
      `from ${JSON.stringify(pathToFileURL(resolve(root, "scripts/lib", specifier)).href)}`,
  );
  writeFileSync(join(scratch, "baseline-check.mjs"), oldCheck);
  const baseline = await import(
    pathToFileURL(join(scratch, "baseline-check.mjs")).href
  );
  const inputs = [];
  const code =
    [
      "// Explains the first value.",
      'const s = "a\u2028b"; // WO-999: a continued explanation',
      "// D123 is a real comment.",
      "if (s) /[/*] D124/.test(s);",
      "function f() {} /[/*] D125/.test(s);",
      "const t = `/* D126 ${1 /* D127 real */}`;",
      "// D128 is a second real comment.",
    ].join("\n") + "\n";
  for (const extension of [
    "js",
    "cjs",
    "mjs",
    "ts",
    "cts",
    "mts",
    "jsx",
    "tsx",
  ])
    for (const ending of ["lf", "crlf"])
      inputs.push({
        path: `case-${ending}.${extension}`,
        source: ending === "lf" ? code : code.replaceAll("\n", "\r\n"),
      });
  for (const extension of ["jsx", "tsx"])
    inputs.push({
      path: `markup.${extension}`,
      source:
        'export const Page = () => <p title="/* D123 */">// D124 text{/* D125 real */}{`// D126 text`}</p>;\n',
    });
  inputs.push({
    path: "script.sh",
    source:
      "#!/bin/sh\nnode - <<'JS'\nif (true) /[/*] D123/.test('x');\n// D124 real\nJS\n",
  });
  writeFileSync(join(scratch, "syntax.mjs"), code);
  execFileSync(process.execPath, ["--check", join(scratch, "syntax.mjs")]);
  const bodies = baselineBodies.feedbackSourcesComments(inputs);
  const comparisons = inputs.map((input, i) => ({
    path: input.path,
    baseline: rows(
      baseline.commentLabelFindings(input.path, input.source, bodies[i]),
    ),
    candidate: rows(commentLabelFindings(input.path, input.source)),
  }));
  for (const comparison of comparisons)
    assert.deepEqual(
      comparison.candidate,
      comparison.baseline,
      comparison.path,
    );

  // The same ordinary source is recognized directly but omitted by checkout discovery.
  const fixture = join(scratch, "screen-fixture");
  mkdirSync(fixture);
  execFileSync("git", ["init", "-q", fixture]);
  const source = "export const reads = text => /^## /.test(text);\n";
  const paths = [
    "scripts/reader.mjs",
    "scripts/reader.js",
    "scripts/reader.cjs",
    "scripts/reader.ts",
    "packages/app/src/reader.ts",
    "packages/app/src/reader.tsx",
    "packages/app/src/reader.jsx",
    "packages/app/src/reader.cts",
  ];
  for (const path of paths) {
    mkdirSync(resolve(fixture, path, ".."), { recursive: true });
    writeFileSync(join(fixture, path), source);
  }
  const selected = screenedSources(fixture);
  const checked = markdownScreen(fixture);
  const extensionReadings = paths.map((path) => ({
    path,
    selected: selected.includes(path),
    direct: screenSource(path, source),
    checkout: checked.filter((f) => f.file === path),
  }));
  for (const row of extensionReadings)
    assert.ok(row.direct.length > 0, `direct screen ${row.path}`);
  assert.ok(selected.includes("scripts/reader.mjs"));
  assert.ok(!selected.includes("scripts/reader.js"));
  assert.ok(!selected.includes("packages/app/src/reader.tsx"));
  const result = {
    base,
    baselineReader:
      "Baseline TypeScript grammar reader stripped without semantic edits; its package require resolves the candidate's installed compiler. Baseline check imports shared utilities from current tree.",
    commentComparisons: comparisons,
    commentParity: true,
    screenExtensions: extensionReadings,
  };
  const out = process.argv[2];
  if (out) writeFileSync(out, JSON.stringify(result, null, 2) + "\n");
  else process.stdout.write(JSON.stringify(result, null, 2) + "\n");
} finally {
  removeTemporaryPath(scratch, { recursive: true, force: true });
}
