import { createRequire } from "node:module";
import type { Node, SourceFile } from "typescript/unstable/ast";

const require = createRequire(import.meta.url);
type AST = typeof import("typescript/unstable/ast");
const extension = (path: string): string | null =>
  !/\.[cm]?[jt]sx?$/u.test(path)
    ? null
    : path.endsWith(".tsx")
      ? ".tsx"
      : path.endsWith(".jsx")
        ? ".jsx"
        : /\.[cm]?js$/u.test(path)
          ? ".js"
          : ".ts";

/** The AST identifies context-sensitive literals; the scanner sees only code. */
function sourceComments(file: SourceFile, ast: AST): readonly string[] {
  const { SyntaxKind, createScanner } = ast;
  const opaqueKinds = new Set([
    SyntaxKind.StringLiteral,
    SyntaxKind.RegularExpressionLiteral,
    SyntaxKind.NoSubstitutionTemplateLiteral,
    SyntaxKind.TemplateHead,
    SyntaxKind.TemplateMiddle,
    SyntaxKind.TemplateTail,
    SyntaxKind.JsxText,
    SyntaxKind.JsxTextAllWhiteSpaces,
  ]);
  const source = file.text;
  const opaque: { start: number; end: number }[] = [];
  const visit = (node: Node): void => {
    // JSDoc remains comment trivia, rather than another token subtree.
    if (
      node.kind >= SyntaxKind.FirstJSDocNode &&
      node.kind <= SyntaxKind.LastJSDocNode
    )
      return;
    if (opaqueKinds.has(node.kind)) {
      opaque.push({
        start:
          node.kind === SyntaxKind.JsxText ||
          node.kind === SyntaxKind.JsxTextAllWhiteSpaces
            ? node.pos
            : node.getStart(file),
        end: node.end,
      });
      return;
    }
    node.forEachChild(visit);
  };
  visit(file);
  opaque.sort((a, b) => a.start - b.start || a.end - b.end);
  const comments: string[] = [];
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
      )
        if (
          kind === SyntaxKind.SingleLineCommentTrivia ||
          kind === SyntaxKind.MultiLineCommentTrivia
        )
          comments.push(
            source.slice(
              scanner.getTokenStart() + 2,
              scanner.getTokenEnd() -
                (kind === SyntaxKind.MultiLineCommentTrivia ? 2 : 0),
            ),
          );
    }
    cursor = Math.max(cursor, span.end);
  }
  return comments;
}

/** Parse a boundary's immutable before/after inputs in one short-lived process. */
export function feedbackSourcesComments(
  inputs: readonly { readonly path: string; readonly source: string }[],
): readonly (readonly string[])[] {
  const files = inputs.map((input, index) => ({
    ...input,
    name: extension(input.path)
      ? `/source-${index}${extension(input.path)}`
      : null,
  }));
  const supported = files.filter((file) => file.name !== null);
  if (!supported.length) return inputs.map(() => []);
  if (
    (require("typescript/package.json") as { version: string }).version !==
    "7.0.2"
  )
    throw new Error("feedback source parser version drift");
  // Most hook boundaries need no parser. Target snapshots carry only DotLn
  // packages, so resolve the external compiler only for supported source text.
  const { API } =
    require("typescript/unstable/sync") as typeof import("typescript/unstable/sync");
  const { createVirtualFileSystem } =
    require("typescript/unstable/fs") as typeof import("typescript/unstable/fs");
  const ast = require("typescript/unstable/ast") as AST;
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
    ...Object.fromEntries(supported.map((file) => [file.name!, file.source])),
  });
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
  let snapshot:
    ReturnType<InstanceType<typeof API>["updateSnapshot"]> | undefined;
  try {
    snapshot = api.updateSnapshot({ openProjects: ["/tsconfig.json"] });
    const project = snapshot.getProject("/tsconfig.json");
    if (!project) throw new Error("feedback source project unavailable");
    return files.map((file) => {
      if (file.name === null) return [];
      const parsed = project.program.getSourceFile(file.name);
      if (!parsed) throw new Error("feedback source snapshot unavailable");
      return sourceComments(parsed, ast);
    });
  } finally {
    try {
      snapshot?.dispose();
    } finally {
      api.close();
    }
  }
}

/** Parse token boundaries first so regex, templates, and JSX text cannot impersonate trivia. */
export function feedbackSourceComments(
  path: string,
  source: string,
): readonly string[] {
  return feedbackSourcesComments([{ path, source }])[0]!;
}
