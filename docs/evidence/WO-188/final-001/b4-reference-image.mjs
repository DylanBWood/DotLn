// Run from the repository root; a temporary base directory is the first argument where one is read.
const repo = process.cwd();
const { absoluteBodyLinks, githubBodyProfileFailures } = await import(
  `${repo}/scripts/lib/github-body.mjs`
);
const opts = {
  from: "docs/final-reviews/WO-001/PR.md",
  repository: { selector: "github.com/o/r" },
  revision: "a".repeat(40),
};
const cases = {
  quotedDefinition: "See [x][r].\n\n> [r]: ../../a.md\n",
  nextLineDefinition: "See [x][r].\n\n[r]:\n  ../../a.md\n",
  referenceImage: "![alt][img]\n\n[img]: pic.png\n",
  footnote: "Note[^1].\n\n[^1]: See [x](../../a.md).\n",
  table: "| a | b |\n| --- | --- |\n| [x](../../a.md) | `[y](z.md)` |\n",
  heading: "## See [x](../../a.md)\n",
  titled: '[x](../../a.md "title")\n',
  angle: "[x](<../../a b.md>)\n",
  percent: "[x](../../a%20b.md)\n",
  queryOnly: "[x](?tab=1)\n",
  directory: "[x](../../)\n",
  htmlAnchor: '<a href="../../a.md">x</a>\n',
  detailsBlock: "<details>\n\n[x](../../a.md)\n\n</details>\n",
  autolinkRel: "<../../a.md>\n",
  linkInCodeInLabel: "[`]`](../../a.md)\n",
  emphasisLabel: "[*x*](../../a.md)\n",
  doubleDefinition: "[x][r]\n\n[r]: ../../a.md\n[r]: ../../b.md\n",
  defTitle: "[x][r]\n\n[r]: ../../a.md 'T'\n",
};
for (const [name, body] of Object.entries(cases)) {
  const out = absoluteBodyLinks(body, opts);
  const fails = githubBodyProfileFailures(out, { links: true }).map(
    (f) => f.kind ?? "softwrap",
  );
  console.log(
    name.padEnd(20),
    JSON.stringify(out),
    "->",
    JSON.stringify(fails),
  );
}
