// Re-verification of VER-002: retained reproducer with repaired expectations.
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import {
  createScratchRoot,
  removeTemporaryPath,
} from "../../../../scripts/lib/temporary-roots.mjs";
const root = process.cwd(),
  base = "0097fcac608bcaa24c51c8b6d6020fc2382ea141";
const scratch = createScratchRoot(join(tmpdir(), "dotln-ver002-appendix-"));
try {
  const modules = [];
  for (const variant of ["baseline", "candidate"]) {
    let source =
      variant === "baseline"
        ? execFileSync(
            "git",
            ["show", `${base}:scripts/lib/plan-continuation.mjs`],
            { cwd: root, encoding: "utf8" },
          )
        : readFileSync(join(root, "scripts/lib/plan-continuation.mjs"), "utf8");
    source = source.replace(
      /from "(\.{1,2}\/[^"\n]+)"/gu,
      (_, specifier) =>
        `from ${JSON.stringify(pathToFileURL(resolve(root, "scripts/lib", specifier)).href)}`,
    );
    source = source.replace(
      'from "prettier/plugins/markdown.mjs"',
      "from " +
        JSON.stringify(
          pathToFileURL(
            join(root, "node_modules/prettier/plugins/markdown.mjs"),
          ).href,
        ),
    );
    source += "\nexport {executionAppendix};\n";
    writeFileSync(join(scratch, variant + ".mjs"), source);
    modules.push(
      await import(pathToFileURL(join(scratch, variant + ".mjs")).href),
    );
  }
  const before =
    "# WO-999 — Fixture\n\n**Track:** machinery\n\n## Objective\n\nDo the work.\n";
  const cases = [
    ["ordinary", "Checks passed."],
    ["list", "- **Outcome:** checks passed"],
    ["quote", "> **Outcome:** checks passed"],
    ["fence", "```text\n**Outcome:** checks passed\n```"],
    ["own-field", "**Outcome:** checks passed"],
    ["digit-emphasis", "**3 checks** passed."],
    ["code-emphasis", "**`npm test`** passed."],
    ["continuing-emphasis", "Checks passed.\n**3 of 4** suites ran twice."],
    ["nested-quote", "- > **Outcome:** checks passed"],
  ];
  const results = cases.map(([name, body]) => {
    const after =
      before.trimEnd() + "\n\n## Execution record\n\n" + body + "\n";
    const judge = (module) => {
      try {
        return { accepted: module.executionAppendix(before, after) };
      } catch (error) {
        return { accepted: false, error: error.message };
      }
    };
    return { name, baseline: judge(modules[0]), candidate: judge(modules[1]) };
  });
  assert.equal(results[0].candidate.accepted, true);
  assert.equal(results[1].baseline.accepted, true);
  assert.equal(results[1].candidate.accepted, true);
  assert.equal(results[2].baseline.accepted, true);
  assert.equal(results[2].candidate.accepted, true);
  assert.equal(results[4].candidate.accepted, false);
  for (const row of results.slice(5)) {
    assert.equal(row.baseline.accepted, true, row.name);
    assert.equal(row.candidate.accepted, true, row.name);
  }
  writeFileSync(
    process.argv[2],
    JSON.stringify(
      {
        base,
        results,
        limit:
          "Actual old/current private helper exported from scratch copies; relative imports bound to current shared modules. No whole continuation lifecycle run.",
      },
      null,
      2,
    ) + "\n",
  );
} finally {
  removeTemporaryPath(scratch, { recursive: true, force: true });
}
