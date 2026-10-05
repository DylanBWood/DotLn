// Keep this script and its output beside WO-186's evidence. It compares the
// committed before source with the working after source using the existing TS
// parser; assertion expressions are listed, not inferred from test counts.
import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { createRequire } from "node:module";
import { execFileSync } from "node:child_process";
const root = resolve(import.meta.dirname, "../../..");
const require = createRequire(join(root, "package.json"));
if (require("typescript/package.json").version !== "7.0.2")
  throw Error("Recheck the pinned TypeScript AST API");
const ts = require("typescript/unstable/ast");
const { API } = require("typescript/unstable/sync");
const { createVirtualFileSystem } = require("typescript/unstable/fs");
const targets = [
  {
    file: "scripts/test-harness.mjs",
    test: "WO-039 an operator release judges, retires and journals one observed reservation",
  },
  { file: "scripts/test-worktree-integration.mjs" },
  {
    file: "packages/skeleton/test/resident.test.ts",
    test: "WO-143 once and loop restart at every acquisition filesystem boundary, including killed reclaimers",
  },
];
function codeTokens(text) {
  const { SyntaxKind: K, LanguageVariant, createScanner } = ts;
  const endsValue = (kind) =>
    [
      K.Identifier,
      K.PrivateIdentifier,
      K.StringLiteral,
      K.NumericLiteral,
      K.BigIntLiteral,
      K.NoSubstitutionTemplateLiteral,
      K.TemplateTail,
      K.RegularExpressionLiteral,
      K.CloseParenToken,
      K.CloseBracketToken,
      K.CloseBraceToken,
      K.ThisKeyword,
      K.SuperKeyword,
      K.NullKeyword,
      K.TrueKeyword,
      K.FalseKeyword,
      K.PlusPlusToken,
      K.MinusMinusToken,
    ].includes(kind) ||
    (kind >= K.FirstContextualKeyword &&
      kind <= K.LastContextualKeyword &&
      kind !== K.AwaitKeyword &&
      kind !== K.OfKeyword);
  const scanner = createScanner(true, LanguageVariant.Standard);
  scanner.setText(text);
  const tokens = [];
  const braces = [];
  for (let kind = scanner.scan(); kind !== K.EndOfFile; kind = scanner.scan()) {
    if (
      (kind === K.SlashToken || kind === K.SlashEqualsToken) &&
      !endsValue(tokens.at(-1)?.kind)
    )
      kind = scanner.reScanSlashToken();
    else if (kind === K.OpenBraceToken) braces.push(false);
    else if (kind === K.TemplateHead) braces.push(true);
    else if (kind === K.CloseBraceToken && braces.pop()) {
      kind = scanner.reScanTemplateToken(false);
      if (kind === K.TemplateMiddle) braces.push(true);
    }
    tokens.push({
      kind,
      text: scanner.getTokenText(),
      value: scanner.getTokenValue(),
    });
  }
  return tokens;
}

const assertions = (file, bytes, testName) => {
  const virtual = "/source." + file.split(".").at(-1);
  const api = new API({
    cwd: root,
    fs: createVirtualFileSystem({
      "/tsconfig.json": JSON.stringify({
        files: [virtual],
        compilerOptions: { allowJs: true, noLib: true },
      }),
      [virtual]: bytes,
    }),
  });
  try {
    const snapshot = api.updateSnapshot({ openProject: "/tsconfig.json" });
    const tree = snapshot
      .getProject("/tsconfig.json")
      ?.program.getSourceFile(virtual);
    if (!tree) throw Error("Missing parsed source: " + file);
    const found = [];
    let selected = testName ? null : tree;
    const walk = (node, visit) => {
      visit(node);
      node.forEachChild((child) => walk(child, visit));
    };
    if (testName)
      walk(tree, (node) => {
        if (
          ts.isCallExpression(node) &&
          node.expression.getText(tree) === "test" &&
          node.arguments[0] &&
          ts.isStringLiteral(node.arguments[0]) &&
          node.arguments[0].text === testName
        )
          selected = node;
      });
    if (!selected) throw Error("Missing selected case: " + testName);
    walk(selected, (node) => {
      if (
        ts.isCallExpression(node) &&
        ts.isPropertyAccessExpression(node.expression) &&
        node.expression.expression.getText(tree) === "assert"
      ) {
        const tokens = codeTokens(node.getText(tree));
        const closes = [
          ts.SyntaxKind.CloseParenToken,
          ts.SyntaxKind.CloseBracketToken,
          ts.SyntaxKind.CloseBraceToken,
        ];
        const pieces = tokens
          .filter(
            (token, index) =>
              !(
                token.kind === ts.SyntaxKind.CommaToken &&
                closes.includes(tokens[index + 1]?.kind)
              ),
          )
          .map((token) => token.text);
        found.push(pieces.join(" "));
      }
    });
    return found;
  } finally {
    api.close();
  }
};
const rows = targets.map(({ file, test }) => {
  const before = assertions(
    file,
    execFileSync("git", ["show", "HEAD:" + file], {
      cwd: root,
      encoding: "utf8",
      maxBuffer: 32000000,
    }),
    test,
  );
  const after = assertions(file, readFileSync(join(root, file), "utf8"), test);
  return {
    file,
    case: test ?? "entire integration suite including assertion helpers",
    before,
    after,
    identical: JSON.stringify(before) === JSON.stringify(after),
  };
});
console.log(
  JSON.stringify(
    {
      subject: "HEAD before and current working sources",
      method:
        "Call expressions on assert, within each selected case or the whole integration file; tokens preserve assertion arguments and ignore formatting and optional trailing commas. Matrix assertDeadPid calls run the unchanged helper's liveness assertion in every cell.",
      rows,
    },
    null,
    2,
  ),
);
if (rows.some((row) => !row.identical)) process.exitCode = 1;
