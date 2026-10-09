// The installed Markdown parser's reading of line endings, columns, a leading
// byte-order mark and link destinations, recorded for the body rewriter's
// line inventory: a lone carriage return ends a line as a newline or a
// carriage return and newline does; columns count UTF-16 code units from the
// start of such a line, a tab as one; offsets index the source string, except
// that a leading byte-order mark is outside both counts; and a link's url is
// its destination with backslash escapes and character references resolved,
// while a percent-encoded sequence passes through unchanged. Run from the
// repository root, which supplies the parser.
import { createRequire } from "node:module";
import { join } from "node:path";

const parser = createRequire(join(process.cwd(), "package.json"))(
  "prettier/plugins/markdown",
).parsers.markdown;
const nodes = (node) => [node, ...(node.children ?? []).flatMap(nodes)];
const show = (label, source) => {
  const found = nodes(parser.parse(source)).filter((node) =>
    ["inlineCode", "code", "html", "link", "image", "definition"].includes(
      node.type,
    ),
  );
  console.log(label, JSON.stringify(source));
  for (const node of found) {
    const { start, end } = node.position;
    console.log(
      "  ",
      node.type,
      `line ${start.line} column ${start.column} offset ${start.offset} to line ${end.line} column ${end.column} offset ${end.offset}`,
      `url=${JSON.stringify(node.url)}`,
      `byOffset=${JSON.stringify(source.slice(start.offset, end.offset))}`,
    );
  }
};
show("newline", "Intro\n\n`` [sample](file.md) ` literal ``\n");
show(
  "carriage return and newline",
  "Intro\r\n\r\n`` [sample](file.md) ` literal ``\r\n",
);
show("lone carriage return", "Intro\r\r`` [sample](file.md) ` literal ``\r");
show("link after carriage return and newline", "a\r\nb [t](file.md) c\r\n");
show("link after lone carriage return", "a\rb [t](file.md) c\r");
show(
  "mixed endings with a definition",
  "a\r\nb\rc\n[t](x.md) `code` ![i](p.png)\r\n\r\n[r]: <y.md>\n   [s]: z.md 'title'\n",
);
show(
  "indented code in a list after lone carriage returns",
  "- code:\r\r      [sample](file.md)\r\rafter [t](u.md)\r",
);
show("tab before a code span and a link", "a\tb `c` [t](u.md)");
show("byte-order mark", "﻿[t](u.md) `c`");
show(
  "destinations spelled with escapes, references and percent-encoding",
  "[escaped](file\\(1\\).md) [reference](file&#40;1&#41;.md) [amp](a&amp;b.md) [under](file\\_1.md) [pct](file%281%29.md)",
);
show(
  "scheme spelled by reference; a backslash before a letter stays",
  "[x](&#104;ttps://example.invalid/a) [y](h\\ttp://example.invalid)",
);
show("brackets around a link", "[a [b](c.md) d](e.md)");
show("image inside a link label", "[![alt](img.png)](page.md)");
show("definition with an escaped destination", "   [r]: file\\(1\\).md\n\n[r]");
