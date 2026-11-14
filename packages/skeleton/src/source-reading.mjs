// The one reader of JavaScript and TypeScript source. It is build-free: a
// script imports it before any build, and the runtime imports it as it is.
// Tokens, literals, import specifiers and comments are read in the calling
// process with TypeScript's scanner. A caller that must tell a comment from
// the text of a regular expression, a template or JSX by the grammar itself
// takes a syntax tree from `sourceTrees`, which starts the compiler's API
// once for the whole batch it is given. TypeScript is loaded on the first
// read and never when this module is imported, and no other module imports
// TypeScript's reading interfaces.
import { createRequire } from "node:module";

/** @typedef {typeof import("typescript/unstable/ast")} Syntax */
/** @typedef {import("typescript/unstable/ast").Node} SyntaxNode */
/** @typedef {import("typescript/unstable/ast").SourceFile} SyntaxFile */
/** One token: its kind, its text as written, its value as the program reads
 * it, and its offsets; `comment` marks a comment.
 * @typedef {{kind: number, text: string, value: string, start: number, end: number, comment?: true}} SourceToken */
/** @typedef {{start: number, end: number, line: number, block: boolean, body: string}} SourceComment */
/** @typedef {{kind: "regex" | "string" | "template", start: number, end: number, line: number, text: string}} SourceLiteral */
/** @typedef {{path: string, file: SyntaxFile, errors: number[], line: (offset: number) => number}} SourceTree */

const require = createRequire(import.meta.url);
/** The TypeScript version whose scanner rules these readers were judged on. */
export const SOURCE_READER_TYPESCRIPT = "7.0.2";

/** @type {Syntax | undefined} */
let syntax;
/** TypeScript's syntax module (its `SyntaxKind` and scanner), loaded on first
 * use. A version other than the pinned one refuses: the rules below that tell
 * a regular expression from a division were judged on that scanner.
 * @returns {Syntax} */
export function sourceSyntax() {
  if (!syntax) {
    const { version } = require("typescript/package.json");
    if (version !== SOURCE_READER_TYPESCRIPT)
      throw new Error(
        `source reader: typescript ${version} is not the pinned ${SOURCE_READER_TYPESCRIPT}; recheck the scanner rules`,
      );
    syntax = /** @type {Syntax} */ (require("typescript/unstable/ast"));
  }
  return syntax;
}

/** The line, counted from 1, that holds each offset of `text`.
 * @param {string} text
 * @returns {(offset: number) => number} */
export function lineReader(text) {
  const starts = [0];
  for (let at = text.indexOf("\n"); at !== -1; at = text.indexOf("\n", at + 1))
    starts.push(at + 1);
  return (offset) => {
    let low = 0,
      high = starts.length - 1;
    while (low < high) {
      const middle = (low + high + 1) >> 1;
      if (/** @type {number} */ (starts[middle]) <= offset) low = middle;
      else high = middle - 1;
    }
    return low + 1;
  };
}

/**
 * The tokens of a source in order: `{kind, text, value, start, end}`, with
 * `comment` set on a comment, which is yielded only when `comments` is asked
 * for. A `/` after a value is division, otherwise a regular expression; a `}`
 * closing `${` resumes its template; both are decided from the code tokens
 * before them, never from a comment. A position at which the scanner does not
 * advance (a `#` before a blank, which it reads as an empty private name) is
 * stepped over.
 * @param {string} text
 * @param {{comments?: boolean}} [options]
 * @returns {Generator<SourceToken>}
 */
export function* sourceTokens(text, { comments = false } = {}) {
  const { SyntaxKind: K, LanguageVariant, createScanner } = sourceSyntax();
  /** @param {number | undefined} kind */
  const endsValue = (kind) =>
    kind !== undefined &&
    ([
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
        kind !== K.OfKeyword));
  const scanner = createScanner(!comments, LanguageVariant.Standard);
  scanner.setText(text);
  /** @type {boolean[]} */
  const braces = [];
  /** @type {number | undefined} */
  let previous;
  for (let kind = scanner.scan(); kind !== K.EndOfFile; kind = scanner.scan()) {
    if (scanner.getTokenEnd() <= scanner.getTokenStart()) {
      const next = scanner.getTokenStart() + 1;
      if (next >= text.length) break;
      scanner.setText(text, next, text.length - next);
      continue;
    }
    if (kind === K.WhitespaceTrivia || kind === K.NewLineTrivia) continue;
    const comment =
      kind === K.SingleLineCommentTrivia || kind === K.MultiLineCommentTrivia;
    if (!comment) {
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
      previous = kind;
    }
    yield {
      kind,
      text: scanner.getTokenText(),
      value: scanner.getTokenValue(),
      start: scanner.getTokenStart(),
      end: scanner.getTokenEnd(),
      ...(comment ? { comment: true } : {}),
    };
  }
}

/** A source's comments: offsets, line, whether a block comment, and the body
 * between its delimiters.
 * @param {string} text
 * @returns {SourceComment[]} */
export function sourceComments(text) {
  const { SyntaxKind: K } = sourceSyntax();
  const line = lineReader(text);
  /** @type {SourceComment[]} */
  const found = [];
  for (const token of sourceTokens(text, { comments: true })) {
    if (!token.comment) continue;
    const block = token.kind === K.MultiLineCommentTrivia;
    found.push({
      start: token.start,
      end: token.end,
      line: line(token.start),
      block,
      body: text.slice(token.start + 2, token.end - (block ? 2 : 0)),
    });
  }
  return found;
}

/** A source's literal tokens: a regular expression (its text as written,
 * slashes and flags included), a string, or a template's literal piece (its
 * text as the program builds it, escapes read).
 * @param {string} text
 * @returns {SourceLiteral[]} */
export function sourceLiterals(text) {
  const { SyntaxKind: K } = sourceSyntax();
  /** @type {Map<number, SourceLiteral["kind"]>} */
  const kinds = new Map([
    [K.RegularExpressionLiteral, "regex"],
    [K.StringLiteral, "string"],
    [K.NoSubstitutionTemplateLiteral, "string"],
    [K.TemplateHead, "template"],
    [K.TemplateMiddle, "template"],
    [K.TemplateTail, "template"],
  ]);
  const line = lineReader(text);
  /** @type {SourceLiteral[]} */
  const found = [];
  for (const token of sourceTokens(text)) {
    const kind = kinds.get(token.kind);
    if (kind)
      found.push({
        kind,
        start: token.start,
        end: token.end,
        line: line(token.start),
        text: kind === "regex" ? token.text : token.value,
      });
  }
  return found;
}

const IDENTIFIER = /^[\p{ID_Start}$_][\p{ID_Continue}$‌‍]*$/u;
/** The index after the brace group opened at `start`, or -1.
 * @param {SourceToken[]} tokens @param {number} start
 * @param {Syntax["SyntaxKind"]} K */
const afterGroup = (tokens, start, K) => {
  for (let j = start, depth = 0; j < tokens.length; j++) {
    if (tokens[j]?.kind === K.OpenBraceToken) depth++;
    else if (tokens[j]?.kind === K.CloseBraceToken && --depth === 0)
      return j + 1;
  }
  return -1;
};
/** The specifier ending a static import clause that begins at `start`: names,
 * commas, `*`, `as` and brace groups, then `from "x"`, or `= require("x")`.
 * @param {SourceToken[]} tokens @param {number} start
 * @param {Syntax["SyntaxKind"]} K
 * @returns {string | undefined} */
function importClauseSource(tokens, start, K) {
  for (let j = start; j > -1 && j < tokens.length;) {
    const token = /** @type {SourceToken} */ (tokens[j]);
    if (
      j > start &&
      token.text === "from" &&
      tokens[j + 1]?.kind === K.StringLiteral
    )
      return tokens[j + 1]?.value;
    if (token.kind === K.EqualsToken)
      return tokens[j + 1]?.text === "require" &&
        tokens[j + 2]?.kind === K.OpenParenToken &&
        tokens[j + 3]?.kind === K.StringLiteral
        ? tokens[j + 3]?.value
        : undefined;
    if (token.kind === K.OpenBraceToken) j = afterGroup(tokens, j, K);
    else if (
      token.kind === K.CommaToken ||
      token.kind === K.AsteriskToken ||
      (IDENTIFIER.test(token.text) &&
        token.kind !== K.ImportKeyword &&
        token.kind !== K.ExportKeyword)
    )
      j++;
    else return undefined;
  }
  return undefined;
}

/** The module specifiers a source loads at run time. Skipped: `import type`,
 * `export type`, a type reference `import("x").T` (in code; JSDoc types are
 * comments), and computed specifiers, which name no file. With `dynamic`
 * false, only what the module loads when it is itself loaded: its import
 * declarations and re-exports, and no `import("x")` call, which runs only
 * where its code does.
 * @param {string} text
 * @param {{dynamic?: boolean}} [options]
 * @returns {string[]} */
export function sourceImports(text, { dynamic = true } = {}) {
  const { SyntaxKind: K } = sourceSyntax();
  const tokens = [...sourceTokens(text)];
  /** @param {SourceToken | undefined} token @returns {token is SourceToken} */
  const string = (token) =>
    token?.kind === K.StringLiteral ||
    token?.kind === K.NoSubstitutionTemplateLiteral;
  /** @type {string[]} */
  const found = [];
  for (let i = 0; i < tokens.length; i++) {
    const { kind } = /** @type {SourceToken} */ (tokens[i]);
    if (kind !== K.ImportKeyword && kind !== K.ExportKeyword) continue;
    // A member or property named import or export is not a declaration.
    const before = tokens[i - 1]?.kind;
    if (before === K.DotToken || before === K.QuestionDotToken) continue;
    const next = tokens[i + 1];
    if (!next || next.kind === K.ColonToken) continue;
    if (kind === K.ImportKeyword) {
      if (next.kind === K.OpenParenToken) {
        const [, , specifier, after, member, name] = tokens.slice(i);
        if (!dynamic || !string(specifier)) continue;
        if (after?.kind === K.CommaToken) found.push(specifier.value);
        else if (
          after?.kind === K.CloseParenToken &&
          !(
            member?.kind === K.DotToken &&
            !["then", "catch", "finally"].includes(name?.text ?? "")
          )
        )
          found.push(specifier.value);
        continue;
      }
      if (next.kind === K.DotToken) continue; // import.meta
      if (next.kind === K.StringLiteral) {
        found.push(next.value);
        continue;
      }
      const third = tokens[i + 2];
      // `import type` unless `type` is the default binding's name.
      const typeOnly =
        next.text === "type" &&
        !(
          third?.kind === K.CommaToken ||
          third?.kind === K.EqualsToken ||
          (third?.text === "from" && tokens[i + 3]?.kind === K.StringLiteral)
        );
      const specifier = importClauseSource(tokens, i + 1, K);
      if (specifier !== undefined && !typeOnly) found.push(specifier);
      continue;
    }
    // Re-exports: `export * [as name] from "x"` or `export {...} from "x"`.
    const typeOnly = next.text === "type";
    let j = typeOnly ? i + 2 : i + 1;
    if (tokens[j]?.kind === K.OpenBraceToken) j = afterGroup(tokens, j, K);
    else if (tokens[j]?.kind === K.AsteriskToken) {
      j++;
      if (tokens[j]?.text === "as") j += 2;
    } else continue;
    const from = tokens[j + 1];
    if (
      j > 0 &&
      tokens[j]?.text === "from" &&
      from?.kind === K.StringLiteral &&
      !typeOnly
    )
      found.push(from.value);
  }
  return found;
}

/** The dialect a path is parsed in, or null for a path that is not source.
 * The rule reads the path's suffix alone: whatever stands before it, a name
 * of any shape or none, changes nothing. A caller that selects the sources
 * to read asks this, so that it selects exactly what `sourceTrees` parses.
 * @param {string} path */
export const sourceDialect = (path) =>
  !/\.[cm]?[jt]sx?$/u.test(path)
    ? null
    : path.endsWith(".tsx")
      ? ".tsx"
      : path.endsWith(".jsx")
        ? ".jsx"
        : /\.[cm]?js$/u.test(path)
          ? ".js"
          : ".ts";

/** Every node under `node`, itself first, in source order. JSDoc is comment
 * text and is not walked.
 * @param {SyntaxNode} node
 * @returns {Generator<SyntaxNode>} */
export function* sourceNodes(node) {
  const stack = [node];
  while (stack.length) {
    const current = /** @type {SyntaxNode} */ (stack.pop());
    yield current;
    /** @type {SyntaxNode[]} */
    const children = [];
    current.forEachChild((child) => {
      children.push(child);
    });
    for (let index = children.length - 1; index >= 0; index--)
      stack.push(/** @type {SyntaxNode} */ (children[index]));
  }
}

/** How many times this process has started the compiler's API. */
let apiStarts = 0;
export const sourceTreeStarts = () => apiStarts;

/**
 * Syntax trees for a batch of sources, from one start of the compiler's API:
 * for each input `{path, source}`, `{path, file, errors, line}` with the
 * parsed file (every node carries its parent), the line of each syntax error
 * the parser reported and a reader from offsets to lines; null for a path
 * that is not JavaScript or TypeScript. The sources are given to the compiler
 * as text in a virtual file system: it never reads the working tree.
 * @param {readonly {readonly path: string, readonly source: string}[]} inputs
 * @returns {(SourceTree | null)[]}
 */
export function sourceTrees(inputs) {
  const files = inputs.map((input, index) => ({
    ...input,
    name: sourceDialect(input.path)
      ? `/source-${index}${sourceDialect(input.path)}`
      : null,
  }));
  const supported = files.filter((file) => file.name !== null);
  if (!supported.length) return inputs.map(() => null);
  sourceSyntax();
  const { API } = /** @type {typeof import("typescript/unstable/sync")} */ (
    require("typescript/unstable/sync")
  );
  const { createVirtualFileSystem } =
    /** @type {typeof import("typescript/unstable/fs")} */ (
      require("typescript/unstable/fs")
    );
  const virtual = createVirtualFileSystem({
    "/tsconfig.json": JSON.stringify({
      compilerOptions: {
        noLib: true,
        noResolve: true,
        allowJs: true,
        checkJs: false,
        jsx: "preserve",
        target: "ESNext",
        types: [],
      },
      files: supported.map((file) => file.name),
    }),
    ...Object.fromEntries(
      supported.map((file) => [/** @type {string} */ (file.name), file.source]),
    ),
  });
  apiStarts += 1;
  const api = new API({
    cwd: "/",
    fs: {
      ...virtual,
      // Snapshot text must never fall through to the real source tree.
      readFile: (path) => virtual.readFile?.(path) ?? null,
      getAccessibleEntries: (path) =>
        virtual.getAccessibleEntries?.(path) ?? { files: [], directories: [] },
    },
  });
  /** @type {ReturnType<InstanceType<typeof API>["updateSnapshot"]> | undefined} */
  let snapshot;
  try {
    snapshot = api.updateSnapshot({ openProjects: ["/tsconfig.json"] });
    const project = snapshot.getProject("/tsconfig.json");
    if (!project) throw new Error("source reading project unavailable");
    return files.map((input) => {
      if (input.name === null) return null;
      const file = project.program.getSourceFile(input.name);
      if (!file) throw new Error("source reading snapshot unavailable");
      /** @param {number} offset */
      const line = (offset) =>
        file.getLineAndCharacterOfPosition(offset).line + 1;
      return {
        path: input.path,
        file,
        errors: project.program
          .getSyntacticDiagnostics(input.name)
          .map((diagnostic) => line(diagnostic.pos)),
        line,
      };
    });
  } finally {
    try {
      snapshot?.dispose();
    } finally {
      api.close();
    }
  }
}

/**
 * The literal tokens and comments of one parsed file, read with the grammar:
 * the tree tells a literal from code, so the scanner reads only the code
 * between literals, where a comment can stand. The feedback audit reads its
 * boundary's comments this way, as it did before this module existed, since
 * code misread as a comment would hide a behavior change from it.
 * @param {SyntaxFile} file
 * @returns {{literals: (SourceLiteral & {node: SyntaxNode})[], comments: SourceComment[]}}
 */
export function treeTokens(file) {
  const { SyntaxKind, createScanner } = sourceSyntax();
  const source = file.text;
  /** @param {number} offset */
  const line = (offset) => file.getLineAndCharacterOfPosition(offset).line + 1;
  /** @type {Map<number, SourceLiteral["kind"] | null>} */
  const kinds = new Map([
    [SyntaxKind.RegularExpressionLiteral, "regex"],
    [SyntaxKind.StringLiteral, "string"],
    [SyntaxKind.NoSubstitutionTemplateLiteral, "string"],
    [SyntaxKind.TemplateHead, "template"],
    [SyntaxKind.TemplateMiddle, "template"],
    [SyntaxKind.TemplateTail, "template"],
    [SyntaxKind.JsxText, null],
    [SyntaxKind.JsxTextAllWhiteSpaces, null],
  ]);
  /** @type {(SourceLiteral & {node: SyntaxNode})[]} */
  const literals = [];
  /** @type {{start: number, end: number}[]} */
  const opaque = [];
  /** @param {SyntaxNode} node */
  const visit = (node) => {
    // JSDoc remains comment trivia, rather than another token subtree.
    if (
      node.kind >= SyntaxKind.FirstJSDocNode &&
      node.kind <= SyntaxKind.LastJSDocNode
    )
      return;
    const kind = kinds.get(node.kind);
    if (kind !== undefined) {
      const start = kind === null ? node.pos : node.getStart(file);
      opaque.push({ start, end: node.end });
      if (kind !== null)
        literals.push({
          node,
          kind,
          start,
          end: node.end,
          line: line(start),
          text: /** @type {SyntaxNode & {text: string}} */ (node).text,
        });
      return;
    }
    node.forEachChild(visit);
  };
  visit(file);
  opaque.sort((a, b) => a.start - b.start || a.end - b.end);
  /** @type {SourceComment[]} */
  const comments = [];
  const scanner = createScanner(false, file.languageVariant);
  let cursor = 0;
  for (const span of [
    ...opaque,
    { start: source.length, end: source.length },
  ]) {
    if (span.start > cursor) {
      scanner.setText(source, cursor, span.start - cursor);
      for (
        let kind = scanner.scan();
        kind !== SyntaxKind.EndOfFile;
        kind = scanner.scan()
      ) {
        // The scanner reads a `#` before a blank as an empty private name
        // and never moves past it; step over that character.
        if (scanner.getTokenEnd() <= scanner.getTokenStart()) {
          const next = scanner.getTokenStart() + 1;
          if (next >= span.start) break;
          scanner.setText(source, next, span.start - next);
          continue;
        }
        if (
          kind === SyntaxKind.SingleLineCommentTrivia ||
          kind === SyntaxKind.MultiLineCommentTrivia
        ) {
          const start = scanner.getTokenStart();
          const end = scanner.getTokenEnd();
          const block = kind === SyntaxKind.MultiLineCommentTrivia;
          comments.push({
            start,
            end,
            line: line(start),
            block,
            body: source.slice(start + 2, end - (block ? 2 : 0)),
          });
        }
      }
    }
    cursor = Math.max(cursor, span.end);
  }
  return { literals, comments };
}
