// The repository already pins Prettier. Its exported Markdown parser supplies
// block boundaries, decoded destinations and reference identities; no second
// Markdown grammar or new dependency is needed. The pinned parser is
// synchronous. The document check and the document kinds share this reader.
import { parsers } from "prettier/plugins/markdown.mjs";

export function parseMarkdown(source) {
  const ast = parsers.markdown.parse(source);
  if (ast?.type !== "root" || !Array.isArray(ast.children))
    throw new Error(
      "Unsupported Markdown parser AST; check the pinned Prettier version",
    );
  return ast;
}

export function* markdownNodes(node) {
  yield node;
  for (const child of node.children ?? []) yield* markdownNodes(child);
}

/** Every link and image destination in a Markdown source, with its line;
 * a reference resolves through the first definition of its label. */
export function markdownLinks(source) {
  const ast = parseMarkdown(source),
    definitions = new Map();
  for (const node of markdownNodes(ast))
    if (node.type === "definition" && !definitions.has(node.identifier))
      definitions.set(node.identifier, node.url);
  const links = [];
  for (const node of markdownNodes(ast)) {
    const href = ["link", "image"].includes(node.type)
      ? node.url
      : ["linkReference", "imageReference"].includes(node.type)
        ? definitions.get(node.identifier)
        : undefined;
    if (href) links.push({ href, line: node.position.start.line });
  }
  return links;
}

/** The text of every inline code span, with its line. */
export function markdownCodeSpans(source) {
  return [...markdownNodes(parseMarkdown(source))]
    .filter((node) => node.type === "inlineCode")
    .map((node) => ({ value: node.value, line: node.position.start.line }));
}
