import assert from "node:assert/strict";
import { parsers } from "../../../../node_modules/prettier/plugins/markdown.mjs";
import {
  absoluteBodyLinks,
  relativeLinkFailures,
  githubBodyProfileFailures,
} from "../../../../scripts/lib/github-body.mjs";

const nodes = (node) => [node, ...(node.children ?? []).flatMap(nodes)];
const options = {
  from: "docs/final-reviews/WO-188/PR.md",
  repository: { selector: "github.com/public/fixture" },
  revision: "reviewed",
};
const prefix =
  "https://github.com/public/fixture/blob/reviewed/docs/final-reviews/WO-188/";
const literalSamples = [
  "`` [sample](file.md) ` literal ``",
  "Intro\n\n`` [sample](file.md) ` literal ``",
  "- code:\n\n      [sample](file.md)",
  "🧪 café `` [sample](file.md) ` literal ``",
  "\t[sample](file.md)",
  "> `` [sample](file.md) ` literal ``",
  "- `` [sample](file.md) ` literal ``",
  "A span `[sample](file.md)\ncontinuation`.",
  "```md\n[sample](file.md)\n```",
  "> ```md\n> [sample](file.md)\n> ```",
  "<div>\n[sample](file.md)\n</div>",
  'Text <span title="[sample](file.md)">literal</span>.',
];
let preservationCount = 0;
for (const newline of ["\n", "\r\n", "\r"])
  for (const bom of ["", "\uFEFF"])
    for (const sample of literalSamples) {
      const source = bom + sample.replaceAll("\n", newline);
      const parsed = nodes(parsers.markdown.parse(source));
      assert.equal(
        parsed.filter((node) => ["link", "image"].includes(node.type)).length,
        0,
      );
      assert.equal(
        absoluteBodyLinks(source, options),
        source,
        JSON.stringify(source),
      );
      preservationCount += 1;
    }
console.log(
  JSON.stringify({ probe: "literal-preservation", preservationCount }),
);

for (const newline of ["\n", "\r\n", "\r"])
  for (const bom of ["", "\uFEFF"]) {
    const source =
      bom + "Intro" + newline + newline + "A [link](file.md)." + newline;
    const expected =
      bom +
      "Intro" +
      newline +
      newline +
      "A [link](" +
      prefix +
      "file.md)." +
      newline;
    assert.equal(absoluteBodyLinks(source, options), expected);
    assert.deepEqual(relativeLinkFailures(expected), []);
  }
const mixed =
  "\uFEFFIntro\r\r`` [literal](x.md) ` ``\r\n\r\nA [real](file.md).\n";
assert.equal(
  absoluteBodyLinks(mixed, options),
  mixed.replace("[real](file.md)", "[real](" + prefix + "file.md)"),
);

for (const [source, filename] of [
  ["[escaped](file\\(1\\).md)", "file%281%29.md"],
  ["[entity](file&#40;1&#41;.md)", "file%281%29.md"],
  ["[ampersand](a&amp;b.md)", "a&b.md"],
  ["[underscore](file\\_1.md)", "file_1.md"],
]) {
  const output = absoluteBodyLinks(source, options);
  const target = nodes(parsers.markdown.parse(output)).find(
    (node) => node.type === "link",
  )?.url;
  assert.equal(target, prefix + filename);
  console.log(
    JSON.stringify({
      probe: "rendered-destination",
      source,
      target,
      outcome: "pass",
    }),
  );
}
for (const source of [
  "[scheme](&#104;ttps://example.invalid/x)",
  "[scheme](https://example.invalid/x)",
  "[host](//example.invalid/x)",
])
  assert.equal(absoluteBodyLinks(source, options), source);

for (const source of [
  "[empty]()",
  '[empty](<> "title")',
  "![empty]()",
  "[empty][r]\n\n[r]: <>",
  "[nested [a [b]]](file(1).md)",
  "[split\nlabel](file.md)",
  "[space](<file name.md>)",
  "[fragment](#a)",
  "[escape](../../../../../../outside.md)",
]) {
  assert.ok(
    githubBodyProfileFailures(source, { links: true }).some(
      (row) => row.kind === "relative-link",
    ),
  );
  const output = absoluteBodyLinks(source, options);
  console.log(
    JSON.stringify({
      probe: "refusal-or-normalization",
      source,
      output,
      remaining: relativeLinkFailures(output),
    }),
  );
}
for (const source of [
  "Outer [a [b]() d](e.md).",
  "Outer [a [b](#fragment) d](e.md).",
  "Outer [a [b](../../../../../../outside.md) d](e.md).",
  "Outer [a ![b]() d](e.md).",
]) {
  const before = nodes(parsers.markdown.parse(source))
    .filter((node) => ["link", "image"].includes(node.type))
    .map(({ type, url }) => ({ type, url }));
  const output = absoluteBodyLinks(source, options);
  const after = nodes(parsers.markdown.parse(output))
    .filter((node) => ["link", "image"].includes(node.type))
    .map(({ type, url }) => ({ type, url }));
  const failures = githubBodyProfileFailures(output, { links: true });
  assert.ok(failures.some((row) => row.kind === "relative-link"));
  if (source.includes("![b]")) {
    assert.ok(after.some((node) => node.type === "image" && node.url === ""));
    assert.ok(
      after.some(
        (node) => node.type === "link" && node.url === prefix + "e.md",
      ),
    );
  } else {
    assert.deepEqual(after, [{ type: "link", url: "e.md" }]);
    assert.ok(
      !before.some((node) => node.type === "link" && node.url === "e.md"),
    );
  }
  console.log(
    JSON.stringify({
      probe: "nested-null-destination",
      source,
      before,
      output,
      after,
      failures,
    }),
  );
}
console.log(
  JSON.stringify({ probe: "fresh-markdown-attacks", outcome: "pass" }),
);
