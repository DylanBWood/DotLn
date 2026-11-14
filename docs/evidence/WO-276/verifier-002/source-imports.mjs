import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import {
  createScratchRoot,
  removeTemporaryPath,
} from "../../../../scripts/lib/temporary-roots.mjs";
import {
  sourceImports,
  sourceTrees,
  sourceSyntax,
} from "../../../../packages/skeleton/src/source-reading.mjs";
const root = fileURLToPath(new URL("../../../../", import.meta.url));
const base = "0097fcac608bcaa24c51c8b6d6020fc2382ea141";
const scratch = createScratchRoot(join(tmpdir(), "dotln-ver002-imports-"));
try {
  let old = execFileSync(
    "git",
    ["show", `${base}:scripts/lib/evidence-sources.mjs`],
    { cwd: root, encoding: "utf8" },
  );
  old = old.replace(
    /from "(\.{1,2}\/[^"]+)"/gu,
    (_, specifier) =>
      `from ${JSON.stringify(pathToFileURL(resolve(root, "scripts/lib", specifier)).href)}`,
  );
  old = old.replace(
    "createRequire(import.meta.url)",
    `createRequire(${JSON.stringify(pathToFileURL(join(root, "scripts/lib/evidence-sources.mjs")).href)})`,
  );
  old += "\nexport { runtimeSpecifiers };\n";
  writeFileSync(join(scratch, "baseline.mjs"), old);
  const baseline = await import(
    pathToFileURL(join(scratch, "baseline.mjs")).href
  );
  const inputs = [
    { name: "control", source: 'import "./dep.mjs";\n' },
    {
      name: "conditional-regex",
      source: 'if (true) /[/*]/.test("x");\nimport "./dep.mjs";\n',
    },
    {
      name: "block-regex",
      source: 'function f() {} /[/*]/.test("x");\nimport "./dep.mjs";\n',
    },
    { name: "dynamic-property", source: 'void import("./dep.mjs").default;\n' },
    {
      name: "dynamic-then",
      source: 'void import("./dep.mjs").then(()=>{});\n',
    },
  ];
  const result = [];
  for (const input of inputs) {
    const path = input.name + ".mjs";
    writeFileSync(join(scratch, path), input.source);
    execFileSync(process.execPath, ["--check", join(scratch, path)]);
    const candidate = sourceImports(input.source),
      previous = baseline.runtimeSpecifiers(input.source);
    const [tree] = sourceTrees([{ path, source: input.source }]);
    assert.equal(tree.errors.length, 0);
    const { SyntaxKind: K } = sourceSyntax();
    let astImports = 0;
    const visit = (node) => {
      if (node.kind === K.ImportDeclaration || node.kind === K.ImportKeyword)
        astImports++;
      node.forEachChild(visit);
    };
    visit(tree.file);
    result.push({
      name: input.name,
      expected: ["./dep.mjs"],
      candidate,
      baseline: previous,
      astImports,
      syntaxValid: true,
    });
  }
  assert.deepEqual(result[0].candidate, ["./dep.mjs"]);
  assert.deepEqual(result[1].candidate, []);
  writeFileSync(
    process.argv[2],
    JSON.stringify({ base, inputs: result }, null, 2) + "\n",
  );
} finally {
  removeTemporaryPath(scratch, { recursive: true, force: true });
}
