import assert from "node:assert/strict";
import { pathToFileURL } from "node:url";
import { join } from "node:path";
import { execFileSync } from "node:child_process";

const root = process.cwd();
const { parsers } = await import(
  pathToFileURL(join(root, "node_modules/prettier/plugins/markdown.mjs"))
);
const { absoluteBodyLinks, relativeLinkFailures, githubBodyProfileFailures } =
  await import(pathToFileURL(join(root, "scripts/lib/github-body.mjs")));
const options = {
  from: "docs/final-reviews/WO-188/PR.md",
  repository: { selector: "github.com/public/fixture" },
  revision: "reviewed",
};
const baselineSource = execFileSync(
  "git",
  ["show", "HEAD:scripts/lib/github-body.mjs"],
  { cwd: root, encoding: "utf8" },
);
const baseline = await import(
  "data:text/javascript;base64," +
    Buffer.from(baselineSource).toString("base64")
);
for (const source of [
  "Intro\r\r`` [sample](file.md) ` literal ``",
  "- code:\r\r      [sample](file.md)",
]) {
  assert.deepEqual(baseline.githubBodyProfileFailures(source), []);
  console.log(
    JSON.stringify({
      probe: "baseline-CR-body-profile",
      source,
      failures: [],
      outcome: "pass",
    }),
  );
}
const nodes = (node) => [node, ...(node.children ?? []).flatMap(nodes)];
let failures = 0;
const codeSources = [
  "`` [sample](file.md) ` literal ``",
  "🧪 café `` [sample](file.md) ` literal ``",
  "\t[sample](file.md)",
  "> `` [sample](file.md) ` literal ``",
  "- `` [sample](file.md) ` literal ``",
  "A span `[sample](file.md)\ncontinuation`.",
  "Intro\n\n`` [sample](file.md) ` literal ``",
  "```md\n[sample](file.md)\n```",
  "> ```md\n> [sample](file.md)\n> ```",
  "- code:\n\n      [sample](file.md)",
  "<div>\n[sample](file.md)\n</div>",
  'Text <span title="[sample](file.md)">literal</span>.',
];
for (const newline of ["\n", "\r\n", "\r"]) {
  for (const sample of codeSources) {
    const source = sample.replaceAll("\n", newline);
    const parsed = nodes(parsers.markdown.parse(source));
    assert.equal(
      parsed.filter((node) => ["link", "image"].includes(node.type)).length,
      0,
    );
    assert.ok(
      parsed.some((node) => ["inlineCode", "code", "html"].includes(node.type)),
    );
    let rewritten;
    let error;
    try {
      rewritten = absoluteBodyLinks(source, options);
    } catch (caught) {
      error = caught.message;
    }
    const met = rewritten === source;
    console.log(
      JSON.stringify({
        probe: "literal-range-preservation",
        newline: JSON.stringify(newline),
        source,
        parsed: parsed
          .filter((node) => ["inlineCode", "code", "html"].includes(node.type))
          .map(({ type, value, position }) => ({ type, value, position })),
        rewritten,
        error,
        outcome: met ? "pass" : "fail",
      }),
    );
    if (!met) failures += 1;
  }
}
for (const source of [
  "[empty]()",
  '[empty](<> "title")',
  "![empty]()",
  "[empty][r]\n\n[r]: <>",
  "[nested [a [b]]](file(1).md)",
  "[split\nlabel](file.md)",
  "[escaped](file\\(1\\).md)",
  "[space](<file name.md>)",
  "[fragment](#a)",
  "[escape](../../../../../../outside.md)",
]) {
  assert.ok(relativeLinkFailures(source).length > 0);
  assert.ok(
    githubBodyProfileFailures(source, { links: true }).some(
      (row) => row.kind === "relative-link",
    ),
  );
  const rewritten = absoluteBodyLinks(source, options);
  const stillRelative = relativeLinkFailures(rewritten);
  assert.ok(
    stillRelative.length === 0 ||
      githubBodyProfileFailures(rewritten, { links: true }).some(
        (row) => row.kind === "relative-link",
      ),
  );
  console.log(
    JSON.stringify({
      probe: "relative-link-refusal",
      source,
      rewritten,
      remaining: stillRelative,
      outcome: "pass",
    }),
  );
}
console.log(
  JSON.stringify({ probe: "expanded-parser-preservation", failures }),
);
const escapedSource = "[escaped](file\\(1\\).md)";
const parsedURL = nodes(parsers.markdown.parse(escapedSource)).find(
  (node) => node.type === "link",
).url;
assert.equal(parsedURL, "file(1).md");
const escapedResult = absoluteBodyLinks(escapedSource, options);
const expectedURL =
  "https://github.com/public/fixture/blob/reviewed/docs/final-reviews/WO-188/file%281%29.md";
console.log(
  JSON.stringify({
    probe: "escaped-destination-rendered-target",
    source: escapedSource,
    parsedURL,
    rewritten: escapedResult,
    expectedURL,
    sameTarget: escapedResult.includes(expectedURL),
  }),
);
assert.ok(
  escapedResult.includes("%5C"),
  "recorded unresolved escape normalization finding still reproduces",
);
process.exitCode = failures ? 1 : 0;
