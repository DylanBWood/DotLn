import { sourceTrees, treeTokens } from "./source-reading.mjs";

/** Parse a boundary's immutable before/after inputs in one short-lived
 * process; each source's comment bodies, in order. The parser identifies
 * context-sensitive literals, so regex, templates and JSX text cannot
 * impersonate trivia. */
export function feedbackSourcesComments(
  inputs: readonly { readonly path: string; readonly source: string }[],
): readonly (readonly string[])[] {
  return sourceTrees(inputs).map((read) =>
    read ? treeTokens(read.file).comments.map((comment) => comment.body) : [],
  );
}

/** Parse token boundaries first so regex, templates, and JSX text cannot impersonate trivia. */
export function feedbackSourceComments(
  path: string,
  source: string,
): readonly string[] {
  return feedbackSourcesComments([{ path, source }])[0]!;
}
