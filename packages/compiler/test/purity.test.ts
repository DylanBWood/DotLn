import test from "node:test";
import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import ts from "typescript";
import {
  compileLoadout,
  seiriEnvironment,
  seiriLoadout,
  type LoadoutGraph,
} from "../src/index.js";

/** Generated hook text is data; template substitutions are compiler code. */
const assertSourcePurity = (source: string, file = "fixture.ts") => {
  const syntax = ts.createSourceFile(
    file,
    source,
    ts.ScriptTarget.Latest,
    true,
  );
  const imports: string[] = [];
  const ioCalls: string[] = [];
  const module = (expression: ts.Expression | undefined) =>
    imports.push(
      expression && ts.isStringLiteralLike(expression)
        ? expression.text
        : "<dynamic module>",
    );
  const visit = (node: ts.Node): void => {
    if (
      (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
      node.moduleSpecifier
    )
      module(node.moduleSpecifier);
    if (
      ts.isImportEqualsDeclaration(node) &&
      ts.isExternalModuleReference(node.moduleReference)
    )
      module(node.moduleReference.expression);
    if (ts.isCallExpression(node)) {
      let callee: ts.Expression = node.expression;
      while (ts.isParenthesizedExpression(callee)) callee = callee.expression;
      const name = ts.isIdentifier(callee)
        ? callee.text
        : ts.isPropertyAccessExpression(callee)
          ? callee.name.text
          : ts.isElementAccessExpression(callee) &&
              ts.isStringLiteralLike(callee.argumentExpression)
            ? callee.argumentExpression.text
            : undefined;
      if (
        callee.kind === ts.SyntaxKind.ImportKeyword ||
        name === "require" ||
        name === "getBuiltinModule"
      )
        module(node.arguments[0]);
      if (name === "fetch") ioCalls.push(name);
    }
    ts.forEachChild(node, visit);
  };
  visit(syntax);
  assert.ok(
    imports.every((specifier) => specifier.startsWith("./")),
    `${file} imports only compiler-local modules: ${imports.join(", ")}`,
  );
  assert.deepEqual(ioCalls, [], `${file} must not perform I/O`);
};

test("WO-132 compiler purity inspects executable syntax while preserving emitted hook text", () => {
  assert.doesNotThrow(() =>
    assertSourcePurity(
      [
        'import { local } from "./local.js";',
        'export { other } from "./other.js";',
        'const hook = `const fs = await import("node:fs");',
        'process.getBuiltinModule("node:fs"); fetch("fixture");`;',
        '// import hidden from "node:net"; fetch("fixture");',
        'const prose = \'from "node:fs"; fetch("fixture")\';',
        'const dynamicLocal = import("./local.js");',
      ].join("\n"),
    ),
  );
  for (const source of [
    'import fs from "node:fs";',
    'import "node:net";',
    'export { request } from "node:http";',
    'import fs = require("node:fs");',
    'const fs = await import("node:fs");',
    'const fs = require("node:fs");',
    'const fs = process.getBuiltinModule("node:fs");',
    "const loader = import(moduleName);",
    'fetch("fixture");',
    'globalThis.fetch("fixture");',
    'globalThis["fetch"]("fixture");',
    'const hook = `generated ${fetch("fixture")}`;',
    'const hook = `generated ${await import("node:fs")}`;',
  ])
    assert.throws(
      () => assertSourcePurity(source),
      /compiler-local modules|must not perform I\/O/,
      source,
    );
});

const deepFreeze = <T>(value: T): T => {
  if (value !== null && typeof value === "object") {
    Object.freeze(value);
    for (const child of Object.values(value)) deepFreeze(child);
  }
  return value;
};

test("WO-008 constraint compiler is deterministic, input-immutable, I/O-free, and has zero runtime dependencies", async () => {
  const packageRoot = fileURLToPath(new URL("../../", import.meta.url));
  const manifest = JSON.parse(
    await readFile(new URL("../../package.json", import.meta.url), "utf8"),
  ) as Readonly<Record<string, unknown>>;
  assert.equal(manifest["dependencies"], undefined);
  assert.equal(manifest["optionalDependencies"], undefined);
  assert.equal(manifest["peerDependencies"], undefined);

  const sourceDirectory = new URL("../../src/", import.meta.url);
  const sourceFiles = (await readdir(sourceDirectory)).filter((file) =>
    file.endsWith(".ts"),
  );
  for (const file of sourceFiles) {
    const source = await readFile(
      new URL(`../../src/${file}`, import.meta.url),
      "utf8",
    );
    assertSourcePurity(source, file);
  }
  assert.match(packageRoot, /packages\/compiler\/$/u);

  const input = structuredClone(seiriLoadout) as LoadoutGraph;
  const before = structuredClone(input);
  deepFreeze(input);
  const originalNow = Date.now;
  const originalRandom = Math.random;
  Date.now = () => {
    throw new Error("ambient clock read");
  };
  Math.random = () => {
    throw new Error("ambient randomness read");
  };
  try {
    const first = compileLoadout(input, seiriEnvironment());
    const second = compileLoadout(input, seiriEnvironment());
    assert.deepEqual(second, first);
    assert.deepEqual(input, before);
  } finally {
    Date.now = originalNow;
    Math.random = originalRandom;
  }
});
