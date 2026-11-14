import assert from "node:assert/strict";
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
const [baseRoot, output] = process.argv.slice(2);
const load = (root) =>
  import(pathToFileURL(join(root, "scripts/lib/markdown-links.mjs")).href);
const base = await load(baseRoot),
  candidate = await load(process.cwd());
const inputs = [
  "Price _net_$5.",
  "Price _net_${amount}.",
  "Price _net_{{amount}}.",
  "Price **net**$5.",
  "Price _net_ $5.",
  "See [[DRAFT] the plan](missing.md).",
  "Cost $5 for [the guide](missing.md), plus $2.",
  "Price $5 and glyph &#xE000; here.",
];
const rows = inputs.map((input) => ({
  input,
  mainText: candidate.markdownText(base.parseMarkdown(input)),
  candidateText: candidate.markdownText(candidate.parseMarkdown(input)),
  mainLinks: base.markdownLinks(input),
  candidateLinks: candidate.markdownLinks(input),
}));
assert.equal(rows[0].mainText, "Price net$5.");
assert.equal(rows[0].candidateText, "Price _net_$5.");
assert.equal(rows[3].candidateText, rows[3].mainText);
assert.equal(rows[4].candidateText, rows[4].mainText);
assert.deepEqual(rows[5].candidateLinks, rows[5].mainLinks);
assert.equal(rows[6].candidateLinks[0].href, "missing.md");
assert.equal(rows[7].candidateText, rows[7].mainText);
writeFileSync(
  output,
  JSON.stringify(
    {
      scope:
        "Parsed text only; no wrong gate, missing obligation or lost link reproduced from underscore emphasis.",
      rows,
    },
    null,
    2,
  ) + "\n",
);
console.log(
  JSON.stringify(
    rows.map(({ input, mainText, candidateText }) => ({
      input,
      mainText,
      candidateText,
    })),
    null,
    2,
  ),
);
