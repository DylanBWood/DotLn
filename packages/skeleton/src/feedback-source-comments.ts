import { createRequire } from "node:module";
import type * as TypeScript from "typescript";

const require = createRequire(import.meta.url);
let parser: typeof TypeScript | undefined;

/** Parse token boundaries first so regex, templates, and JSX text cannot impersonate trivia. */
export function feedbackSourceComments(
  path: string,
  source: string,
): readonly string[] {
  if (!/\.[cm]?[jt]sx?$/u.test(path)) return [];
  const ts = (parser ??= require("typescript") as typeof TypeScript);
  if (ts.version !== "5.4.5")
    throw new Error("feedback source parser version drift");
  const kind = path.endsWith(".tsx")
    ? ts.ScriptKind.TSX
    : path.endsWith(".jsx")
      ? ts.ScriptKind.JSX
      : /\.[cm]?js$/u.test(path)
        ? ts.ScriptKind.JS
        : ts.ScriptKind.TS;
  const file = ts.createSourceFile(
    path,
    source,
    ts.ScriptTarget.Latest,
    true,
    kind,
  );
  const tokens: { start: number; end: number }[] = [];
  const visit = (node: TypeScript.Node): void => {
    // JSDoc is already comment trivia, not another source-token subtree.
    if (
      node.kind >= ts.SyntaxKind.FirstJSDocNode &&
      node.kind <= ts.SyntaxKind.LastJSDocNode
    )
      return;
    if (node.kind <= ts.SyntaxKind.LastToken) {
      tokens.push({ start: node.getStart(file), end: node.end });
      return;
    }
    for (const child of node.getChildren(file)) visit(child);
  };
  visit(file);
  tokens.sort((a, b) => a.start - b.start || a.end - b.end);
  const ranges = new Map<number, TypeScript.CommentRange>();
  let cursor = 0;
  for (const token of [
    ...tokens,
    { start: source.length, end: source.length },
  ]) {
    if (token.start > cursor) {
      for (const range of [
        ...(ts.getLeadingCommentRanges(source, cursor) ?? []),
        ...(ts.getTrailingCommentRanges(source, cursor) ?? []),
      ]) {
        if (range.pos >= cursor && range.end <= token.start)
          ranges.set(range.pos, range);
      }
    }
    cursor = Math.max(cursor, token.end);
  }
  return [...ranges.values()]
    .sort((a, b) => a.pos - b.pos)
    .map((range) =>
      source.slice(
        range.pos + 2,
        range.end -
          (range.kind === ts.SyntaxKind.MultiLineCommentTrivia ? 2 : 0),
      ),
    );
}
