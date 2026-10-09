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
function nodes(node) {
  return [node, ...(node.children ?? []).flatMap(nodes)];
}
const links = (text) =>
  nodes(parsers.markdown.parse(text))
    .filter((n) => ["link", "image", "definition"].includes(n.type))
    .map((n) => ({ type: n.type, url: n.url }));
let failed = 0;
for (const source of [
  "[empty]()",
  '[empty](<> "title")',
  "[empty][dest]\n\n[dest]: <>",
  "![empty]()",
  "[deep [one [two [three]]]](file.md)",
  "[split\nlabel](file.md)",
  "[fragment](#anchor)",
  "[parent](../../../../../../escape.md)",
  "[root](/absolute-repository.md)",
]) {
  const parsed = links(source);
  const profile = githubBodyProfileFailures(source, { links: true });
  const rewritten = absoluteBodyLinks(source, options);
  const rewrittenLinks = links(rewritten);
  const remaining = rewrittenLinks.filter(
    (n) =>
      !/^[a-z][a-z0-9+.-]*:/i.test(n.url ?? "") &&
      !(n.url ?? "").startsWith("//"),
  );
  const refused = profile.some((n) => n.kind === "relative-link");
  const rewrittenRefused = githubBodyProfileFailures(rewritten, {
    links: true,
  }).some((n) => n.kind === "relative-link");
  const met =
    parsed.length > 0 &&
    (refused || remaining.length === 0) &&
    (rewrittenRefused || remaining.length === 0);
  console.log(
    JSON.stringify({
      source,
      parsed,
      profile,
      rewritten,
      rewrittenLinks,
      remaining,
      outcome: met ? "pass" : "fail",
    }),
  );
  if (!met) failed++;
}
for (const source of [
  "`[code](file.md)`",
  "```md\n[code](file.md)\n```",
  "    [code](file.md)",
  "[absolute](https://example.invalid/file.md)",
  "[protocol](//example.invalid/file.md)",
]) {
  assert.equal(absoluteBodyLinks(source, options), source);
  assert.equal(
    githubBodyProfileFailures(source, { links: true }).filter(
      (n) => n.kind === "relative-link",
    ).length,
    0,
  );
  console.log(
    JSON.stringify({
      source,
      control: "unchanged and no relative-link failure",
      outcome: "pass",
    }),
  );
}
console.log(JSON.stringify({ probe: "rendered-relative-link-class", failed }));
process.exitCode = failed ? 1 : 0;
