// Declared-source selection stays the rule (WO-174). This direct closure check
// prevents a suite's declaration from forgetting the entry or a literal input.
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, posix } from "node:path";
import { createRequire } from "node:module";
import { relativeImports } from "./evidence-sources.mjs";

export const machineryCoverageScope =
  "Direct entry files, runtime relative imports and literal first-party script paths in entry code; transitive imports and paths built at run time are outside this check. Script literals are conservative: a copied script can later be spawned through a variable. Shell paths are collected conservatively from the whole source, including comments and heredocs.";

// Shared path/configuration and presentation helpers have product coverage;
// changing them alone need not run every consumer's expensive fixture suite.
// Every other direct import or literal first-party script must be declared.
export const machinerySourceExclusions = {
  "wo107-schema": {
    "scripts/test-runner.mjs":
      "This schema case reads the classified source declaration; runner-fixtures checks runner metadata and selection for runner changes. The collector lane stays selected by its test and pinned collector bytes.",
  },
  "*": {
    "scripts/lib/temporary-roots.mjs":
      "Owned-root creation and removal are covered by harness-fixtures and runner-fixtures; fixture consumers retain their own behavioral selection.",
    "packages/skeleton/src/temporary-root-records.mjs":
      "Shared temporary ownership is exercised by harness-fixtures, shell fixture-temp-root and the runtime tests.",
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
export function* scriptTokens(text) {
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
  const braces = [];
  let previousEnd = -1;
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
    const end = scanner.getTokenEnd();
    if (end <= previousEnd)
      throw new Error(`Source scanner did not advance at byte ${end}`);
    previousEnd = end;
    yield {
      text: scanner.getTokenText(),
      value: scanner.getTokenValue(),
      start: scanner.getTokenStart(),
      identifier: kind === K.Identifier,
      string:
        kind === K.StringLiteral || kind === K.NoSubstitutionTemplateLiteral,
    };
    previous = kind;
  }
}
function scriptLiterals(text, { shell = false } = {}) {
  // Shell comments, quoting and heredocs are not JavaScript tokens. Retain
  // every literal repository script path instead of pretending to parse its
  // execution context; existence and declared coverage are checked below.
  if (shell)
    return Array.from(
      text.matchAll(
        /(?<![\w./-])((?:scripts|packages)\/[\w./-]+\.(?:mjs|cjs|js|ts|sh))(?![\w./-])/gu,
      ),
      (match) => match[1],
    );
  const found = [];
  for (const token of scriptTokens(text))
    if (
      token.string &&
      /^(?:scripts|packages)\/[\w./-]+\.(?:mjs|cjs|js|ts|sh)$/u.test(
        token.value,
      )
    )
      found.push(token.value);
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
// Kits carry compiled package files without their TypeScript sources. The
// same declaration covers the compiler's corresponding output path.
const compiledSourcePath = (source) =>
  source
    .replace(/^packages\/([^/]+)\/(src|test)\//u, "packages/$1/dist/$2/")
    .replace(/\.ts$/u, ".js");
function declaredPathCovers(path, source) {
  return path.startsWith(source) || path.startsWith(compiledSourcePath(source));
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
        { shell: source.endsWith(".sh") },
      )) {
        const file = sourcePath(root, target);
        if (existsSync(join(root, file))) required.add(file);
      }
    }
    for (const path of [...required].sort())
      if (
        !row.sources.some((source) => declaredPathCovers(path, source)) &&
        !Object.hasOwn(excluded, path) &&
        !Object.keys(excluded).some(
          (source) => path === compiledSourcePath(source),
        )
      )
        findings.push({ suite: row.name, path });
  }
  return findings;
}

/** Each narrow source copy keeps a JSON declaration beside its fixture.
 * The fixture consumes that same file when copying, so checking the closure
 * cannot silently drift away from the actual copy list. Recursive trees and
 * explicitly supplied doubles cover imports without expanding those trees. */
export function copiedFixtureClosures(root) {
  const declarations = [];
  const visit = (directory) => {
    if (!existsSync(join(root, directory))) return;
    for (const entry of readdirSync(join(root, directory), {
      withFileTypes: true,
    })) {
      const path = `${directory}/${entry.name}`;
      if (entry.isDirectory()) visit(path);
      else if (entry.name.endsWith(".fixture-inputs.json")) {
        const value = JSON.parse(readFileSync(join(root, path), "utf8"));
        for (const row of Array.isArray(value) ? value : [value]) {
          if (
            typeof row.fixture !== "string" ||
            !Array.isArray(row.files) ||
            !row.files.every((file) => typeof file === "string") ||
            !Array.isArray(row.entries) ||
            !row.entries.length
          )
            throw new Error(`Invalid copied-fixture declaration: ${path}`);
          const include = (name, seen = new Set()) => {
            if (seen.has(name))
              throw new Error(`Cyclic copied-fixture declaration: ${name}`);
            const inherited = JSON.parse(
              readFileSync(join(root, name), "utf8"),
            );
            if (Array.isArray(inherited))
              throw new Error(
                `Included copied-fixture declaration must name one set: ${name}`,
              );
            const parents = (inherited.includes ?? []).map((next) =>
              include(next, new Set([...seen, name])),
            );
            return Object.fromEntries(
              ["files", "directories", "provided"].map((key) => [
                key,
                [
                  ...new Set([
                    ...(inherited[key] ?? []),
                    ...parents.flatMap((parent) => parent[key]),
                  ]),
                ],
              ]),
            );
          };
          const parents = (row.includes ?? []).map((name) =>
            include(name, new Set([path])),
          );
          declarations.push({
            ...row,
            ...Object.fromEntries(
              ["files", "directories", "provided"].map((key) => [
                key,
                [
                  ...new Set([
                    ...(row[key] ?? []),
                    ...parents.flatMap((parent) => parent[key]),
                  ]),
                ],
              ]),
            ),
            declaration: path,
          });
        }
      }
    }
  };
  visit("scripts");
  if (existsSync(join(root, "packages")))
    for (const name of readdirSync(join(root, "packages")))
      visit(`packages/${name}/test`);
  return declarations;
}

export function uncoveredFixtureInputs(
  root,
  closures = copiedFixtureClosures(root),
) {
  const findings = [];
  for (const row of closures) {
    const files = new Set(row.files);
    const covered = (path) =>
      files.has(path) ||
      (row.provided ?? []).includes(path) ||
      (row.directories ?? []).some((directory) =>
        path.startsWith(`${directory.replace(/\/$/u, "")}/`),
      );
    const required = new Set(row.entries);
    for (const file of new Set([...row.files, ...row.entries]))
      if (/\.(?:mjs|cjs|js|ts)$/u.test(file)) {
        if (!existsSync(join(root, file))) required.add(file);
        else
          for (const path of relativeImports(root, file, {
            sourcePaths: false,
          }))
            required.add(path);
      }
    for (const path of [...required].sort())
      if (
        !covered(path) ||
        (!(row.provided ?? []).includes(path) && !existsSync(join(root, path)))
      )
        findings.push({
          fixture: row.fixture,
          path,
          declaration: row.declaration,
        });
  }
  return findings;
}
