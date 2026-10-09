import assert from "node:assert/strict";
import { pathToFileURL } from "node:url";
import { join } from "node:path";
const root = process.cwd();
const { parsers } = await import(
  pathToFileURL(join(root, "node_modules/prettier/plugins/markdown.mjs"))
);
const { absoluteBodyLinks, githubBodyProfileFailures } = await import(
  pathToFileURL(join(root, "scripts/lib/github-body.mjs"))
);
const options = {
  from: "docs/final-reviews/WO-188/PR.md",
  repository: { host: "github.com", selector: "github.com/public/fixture" },
  revision: "reviewed",
};
function nodes(n) {
  return [n, ...(n.children ?? []).flatMap(nodes)];
}
let failed = 0;
for (const source of [
  "`` [sample](file.md) ` literal ``",
  "`` literal ` [sample](file.md) ``",
  "``` [sample](file.md) `` literal ```",
  "`[sample](file.md)`",
  "``[sample](file.md)``",
  "    [sample](file.md)",
]) {
  const parsed = nodes(parsers.markdown.parse(source))
    .filter((n) => ["link", "inlineCode", "code"].includes(n.type))
    .map((n) => ({ type: n.type, url: n.url, value: n.value }));
  const rewritten = absoluteBodyLinks(source, options);
  const profile = githubBodyProfileFailures(source, { links: true });
  const met = source === rewritten;
  console.log(
    JSON.stringify({
      source,
      parsed,
      profile,
      rewritten,
      outcome: met ? "pass" : "fail",
    }),
  );
  assert.equal(
    parsed.some((n) => n.type === "link"),
    false,
    "control: source renders no link",
  );
  if (!met) failed++;
}
console.log(JSON.stringify({ probe: "code-span-preservation", failed }));
process.exitCode = failed ? 1 : 0;
