// Declared-source selection stays the rule (WO-174). This direct closure check
// prevents a suite's declaration from forgetting the entry or a literal input.
import { existsSync, readFileSync } from "node:fs";
import { join, posix } from "node:path";
import { createRequire } from "node:module";
import { relativeImports } from "./evidence-sources.mjs";

export const machineryCoverageScope =
  "Direct entry files, runtime relative imports and literal first-party script paths in entry code; transitive imports and paths built at run time are outside this check. Script literals are conservative: a copied script can later be spawned through a variable.";

// Shared path/configuration and presentation helpers have product coverage;
// changing them alone need not run every consumer's expensive fixture suite.
// Every other direct import or literal first-party script must be declared.
export const machinerySourceExclusions = {
  "*": {
    "scripts/lib/git.mjs":
      "Git invocation transport is covered by the product worktree, checkpoint and release fixtures; not every machinery consumer needs a rerun for a transport-only edit.",
    "scripts/lib/paths.mjs":
      "Shared path/main-module helpers are exercised by product fixtures; they do not encode the consumer's machinery behavior.",
    "scripts/lib/helpers.mjs":
      "Shared JSON and filesystem formatting helpers have product-fixture consumers; a formatting-only helper edit need not select every machinery suite.",
    "scripts/lib/config.mjs":
      "Launchpad resolution and validation are owned by configuration-root, selected for every scripts/ edit.",
  },
};

const require = createRequire(import.meta.url);
let ast;
function scriptLiterals(text) {
  ast ??= require("typescript/unstable/ast");
  const { SyntaxKind: K, LanguageVariant, createScanner } = ast;
  const scanner = createScanner(true, LanguageVariant.Standard);
  scanner.setText(text);
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
    ].includes(kind);
  let previous;
  const braces = [],
    found = [];
  for (let kind = scanner.scan(); kind !== K.EndOfFile; kind = scanner.scan()) {
    if (
      (kind === K.SlashToken || kind === K.SlashEqualsToken) &&
      !endsValue(previous)
    )
      kind = scanner.reScanSlashToken();
    else if (kind === K.OpenBraceToken) braces.push(false);
    else if (kind === K.TemplateHead) braces.push(true);
    else if (kind === K.CloseBraceToken && braces.pop()) {
      kind = scanner.reScanTemplateToken(false);
      if (kind === K.TemplateMiddle) braces.push(true);
    }
    if (kind === K.StringLiteral || kind === K.NoSubstitutionTemplateLiteral) {
      const path = scanner.getTokenValue();
      if (/^(?:scripts|packages)\/[\w./-]+\.(?:mjs|cjs|js|ts|sh)$/u.test(path))
        found.push(path);
    }
    previous = kind;
  }
  return found;
}
function sourcePath(root, path) {
  path = posix.normalize(path);
  const built = /^packages\/([^/]+)\/dist\/(src|test)\/(.+)\.(?:js|mjs)$/u.exec(
    path,
  );
  if (built) {
    const stem = `packages/${built[1]}/${built[2]}/${built[3]}`;
    path =
      [".ts", ".mjs"]
        .map((extension) => stem + extension)
        .find((file) => existsSync(join(root, file))) ?? path;
  }
  return path;
}
export function uncoveredMachinerySources(
  root,
  table,
  exclusions = machinerySourceExclusions,
) {
  const findings = [];
  for (const row of table.filter((row) => row.machinery)) {
    const excluded = { ...exclusions["*"], ...exclusions[row.name] };
    for (const [path, reason] of Object.entries(excluded))
      if (typeof reason !== "string" || !reason.trim())
        throw new Error(
          `Machinery exclusion needs a reason: ${row.name}: ${path}`,
        );
    const entries = [...row.command.slice(1), ...(row.args ?? [])].filter(
      (path) =>
        /^(?:scripts|corpus|packages)\/[\w./-]+\.(?:mjs|cjs|js|ts|sh)$/u.test(
          path,
        ),
    );
    const required = new Set();
    for (const entry of entries) {
      const source = sourcePath(root, entry);
      required.add(source);
      if (!existsSync(join(root, source))) continue;
      if (/\.(?:mjs|cjs|js|ts)$/u.test(source))
        for (const target of relativeImports(root, source))
          required.add(sourcePath(root, target));
      for (const target of scriptLiterals(
        readFileSync(join(root, source), "utf8"),
      )) {
        const file = sourcePath(root, target);
        if (existsSync(join(root, file))) required.add(file);
      }
    }
    for (const path of [...required].sort())
      if (
        !row.sources.some((source) => path.startsWith(source)) &&
        !Object.hasOwn(excluded, path)
      )
        findings.push({ suite: row.name, path });
  }
  return findings;
}
