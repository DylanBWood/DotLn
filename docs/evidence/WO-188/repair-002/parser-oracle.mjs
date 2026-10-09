import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";
import { join } from "node:path";
const root = process.cwd();
const { parsers } = await import(
  pathToFileURL(join(root, "node_modules/prettier/plugins/markdown.mjs"))
);
const nodes = (node) => [node, ...(node.children ?? []).flatMap(nodes)];
const show = (text) => {
  const found = nodes(parsers.markdown.parse(text))
    .filter((n) =>
      ["link", "image", "definition", "inlineCode", "code"].includes(n.type),
    )
    .map((n) => ({
      type: n.type,
      url: n.url,
      value: n.value,
      start: n.position.start,
      end: n.position.end,
    }));
  console.log(JSON.stringify(text), "=>", JSON.stringify(found));
};
for (const text of [
  "`` [sample](file.md) ` literal ``",
  "`` [a](b.md) `",
  "` [a](b.md)",
  "`[a](b.md) `` x`",
  "`` [a](b.md) ` x",
  "``` [a](b.md) `` x ```",
  "\\`[a](b.md)`",
  "\\\\`[a](b.md)`",
  "`foo\\`[a](b.md)`",
  "`[a](b.md)\nmore`",
  "text `[a](b.md)\nmore` tail [c](d.md)",
  "> `` [a](b.md) ` q ``",
  "- item `` [a](b.md) ` q ``",
  "[`code]`](file.md)",
  "[empty]()",
  '[empty](<> "title")',
  "![empty]()",
  "[empty][dest]\n\n[dest]: <>",
  "[x](#)",
  "`a`b`",
  "``a``b``",
  "`` `a` ``",
  "`` ` ``",
  "a\r\n`` [a](b.md) ` q ``\r\n",
  "\t`[a](b.md)`",
  "ñ `` [a](b.md) ` q ``",
  "𝒳 `` [a](b.md) ` q ``",
])
  show(text);
