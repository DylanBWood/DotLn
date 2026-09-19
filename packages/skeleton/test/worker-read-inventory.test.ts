import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import * as ts from "typescript/unstable/ast";
import { API } from "typescript/unstable/sync";
import { createVirtualFileSystem } from "typescript/unstable/fs";

// The native compiler owns parsing; the returned tree is local after close.
function parseSource(fileName: string, source: string): ts.SourceFile {
  const path = `/source/${fileName.replaceAll("\\", "/").split("/").at(-1)}`;
  const api = new API({
    cwd: "/source",
    fs: createVirtualFileSystem({
      "/source/tsconfig.json": JSON.stringify({
        files: [path],
        compilerOptions: { noLib: true, noResolve: true, allowJs: true },
      }),
      [path]: source,
    }),
  });
  try {
    const snapshot = api.updateSnapshot({
      openProject: "/source/tsconfig.json",
    });
    const tree = snapshot
      .getProject("/source/tsconfig.json")
      ?.program.getSourceFile(path);
    assert.ok(tree, `native compiler parsed ${fileName}`);
    return tree;
  } finally {
    api.close();
  }
}

interface ReadSite {
  module: string;
  method: string;
  api: string;
  argument: string;
}
const manifest: (ReadSite & {
  shape: string;
  decoder: string;
  consumer: string;
})[] = JSON.parse(
  readFileSync(
    new URL("../../fixtures/worker-store-read-paths.json", import.meta.url),
    "utf8",
  ),
);
const modules = ["worker-store.ts", "worker-host.ts", "verification-host.ts"];
const normalize = (value: string) => value.replace(/\s+/gu, " ").trim();

function inventory(module: string, source: string): ReadSite[] {
  const ast = parseSource(module, source);
  const aliases = new Map<string, string>();
  for (const statement of ast.statements) {
    if (
      !ts.isImportDeclaration(statement) ||
      !ts.isStringLiteral(statement.moduleSpecifier)
    )
      continue;
    const specifier = statement.moduleSpecifier.text;
    if (
      !["node:fs", "fs", "node:fs/promises", "fs/promises"].includes(specifier)
    )
      continue;
    const bindings = statement.importClause?.namedBindings;
    if (bindings && ts.isNamedImports(bindings))
      for (const element of bindings.elements)
        aliases.set(
          element.name.text,
          element.propertyName?.text ?? element.name.text,
        );
  }
  // Track module-local rebinding too: importing a reader and assigning it a
  // different local name must not remove its boundary from the inventory.
  const unwrapped = (node: ts.Expression): ts.Expression =>
    ts.isAsExpression(node) ||
    ts.isTypeAssertion(node) ||
    ts.isParenthesizedExpression(node)
      ? unwrapped(node.expression)
      : node;
  let changed = true;
  while (changed) {
    changed = false;
    const bind = (node: ts.Node): void => {
      if (
        ts.isVariableDeclaration(node) &&
        ts.isIdentifier(node.name) &&
        node.initializer
      ) {
        const value = unwrapped(node.initializer);
        const name = ts.isIdentifier(value)
          ? aliases.get(value.text)
          : ts.isPropertyAccessExpression(value)
            ? value.name.text
            : undefined;
        if (
          name &&
          /^(readFileSync|readFile|readSync|read|readvSync|readv|createReadStream|openSync|open)$/u.test(
            name,
          ) &&
          !aliases.has(node.name.text)
        ) {
          aliases.set(node.name.text, name);
          changed = true;
        }
      }
      node.forEachChild(bind);
    };
    bind(ast);
  }
  const sites: ReadSite[] = [];
  const visit = (node: ts.Node) => {
    if (ts.isCallExpression(node)) {
      const expression = node.expression;
      const api = ts.isIdentifier(expression)
        ? (aliases.get(expression.text) ?? expression.text)
        : expression.getText(ast);
      // Include sync/async, file-descriptor, stream and namespace forms; an
      // added boundary cannot evade the inventory by changing import style.
      const name = api.split(".").at(-1)!;
      if (
        api === "JSON.parse" ||
        (!["this.read", "store.read", "driver.store.read"].includes(api) &&
          /^(readFileSync|readFile|readSync|read|readvSync|readv|createReadStream|openSync|open)$/u.test(
            name,
          ))
      ) {
        // openSync in this store supplies durable writes/fsync, not byte reads.
        if (
          name === "openSync" &&
          ts.isIdentifier(expression) &&
          aliases.get(expression.text) === "openSync"
        ) {
          assert.ok(
            ['"wx"', '"r"', '"a"'].includes(
              node.arguments[1]?.getText(ast) ?? "",
            ),
          );
        } else {
          let ancestor: ts.Node | undefined = node.parent;
          let method = "module";
          let guarded = false;
          while (ancestor) {
            if (
              ts.isCallExpression(ancestor) &&
              ancestor.expression.getText(ast) === "atPath"
            )
              guarded = true;
            if (ts.isMethodDeclaration(ancestor)) {
              method = ancestor.name.getText(ast);
              break;
            }
            ancestor = ancestor.parent;
          }
          assert.ok(
            guarded,
            `${module}: ${api} must be within a path-named decoder`,
          );
          sites.push({
            module,
            method,
            api,
            argument: normalize(node.arguments[0]?.getText(ast) ?? ""),
          });
        }
      }
    }
    node.forEachChild(visit);
  };
  visit(ast);
  return sites.sort((a, b) =>
    JSON.stringify(a).localeCompare(JSON.stringify(b)),
  );
}
const keys = ({ module, method, api, argument }: ReadSite): ReadSite => ({
  module,
  method,
  api,
  argument,
});
test("WO-048 every host disk/JSON read is inventoried inside a path-named decoder", () => {
  const sites = modules.flatMap((module) =>
    inventory(
      module,
      readFileSync(new URL(`../../src/${module}`, import.meta.url), "utf8"),
    ),
  );
  assert.deepEqual(
    sites,
    manifest
      .map(keys)
      .sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b))),
  );
  assert.ok(manifest.every((row) => row.shape && row.decoder && row.consumer));
});
test("WO-048 inventory tripwire detects newly added and aliased unguarded reads", () => {
  for (const source of [
    'import {readFileSync} from "node:fs"; readFileSync("new.json", "utf8");',
    'import {readFile as bytes} from "node:fs/promises"; bytes("new.json");',
    'import * as fs from "node:fs"; fs.readFileSync("new.json");',
    'JSON.parse("null");',
    'import {readFileSync} from "node:fs"; const readBytes = readFileSync; readBytes("new.json");',
    'import {readFileSync} from "node:fs"; const first = readFileSync; const second = first; second("new.json");',
    'import * as fs from "node:fs"; const bytes = fs.readFileSync; bytes("new.json");',
  ])
    assert.throws(
      () => inventory("worker-host.ts", source),
      /path-named decoder/u,
    );
});
