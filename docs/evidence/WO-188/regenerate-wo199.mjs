// Regenerates the last closed order's pull-request body and Release text as
// the publication paths render them now, and records the before/after facts
// criterion 24 names. Run from the repository root:
//   node docs/evidence/WO-188/regenerate-wo199.mjs
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
const root = process.cwd();
const release = await import(
  pathToFileURL(join(root, "scripts/release.mjs")).href
);
const { relativeLinkFailures } = await import(
  pathToFileURL(join(root, "scripts/lib/github-body.mjs")).href
);
const { runGit } = await import(
  pathToFileURL(join(root, "scripts/lib/git.mjs")).href
);
const order = "WO-199",
  tag = "v0.69.2";
const orderFile = readdirSync(join(root, "docs/work-orders")).find(
  (name) => name.startsWith(`${order}-`) && name.endsWith(".md"),
);
const title = readFileSync(join(root, "docs/work-orders", orderFile), "utf8")
  .split("\n")[0]
  .replace(/^# WO-199 — /, "")
  .replace(/ \(v[^)]*\)$/, "");
const facts = (text) => ({
  unavailableTokens: (text.match(/unavailable/g) ?? []).length,
  // Every occurrence of the word on a table row, so a compound cell such as
  // "48,979,236 (Δ unavailable)" counts too.
  unavailableCells: (
    text
      .split("\n")
      .filter((line) => line.startsWith("|"))
      .join("\n")
      .match(/unavailable/g) ?? []
  ).length,
  relativeLinks: relativeLinkFailures(text).length,
  absoluteLinks: (text.match(/\]\(https:\/\//g) ?? []).length,
  titleOccurrences: text.split(title).length - 1,
  countingLine:
    /^\d+ unavailable observations omitted as blank cells or rows;/m.test(text),
});
const storedBody = readFileSync(
  join(root, "docs/final-reviews/WO-199/PR.md"),
  "utf8",
);
const storedRelease = runGit(root, ["cat-file", "-p", tag], { trim: false })
  .split("\n\n")
  .slice(1)
  .join("\n\n")
  .split("\nDOTLN-MANIFEST-BEGIN\n")[0];
const reviewed = runGit(root, ["rev-parse", `${tag}^2`]);
const body = await release.regeneratedPullRequestBody(root, order, reviewed);
const text = release.regeneratedReleaseText(root, tag);
writeFileSync(join(root, "docs/evidence/WO-188/wo199-pr-body.md"), body);
writeFileSync(join(root, "docs/evidence/WO-188/wo199-release.md"), `${text}\n`);
const record = {
  order,
  tag,
  reviewedRevision: reviewed,
  title,
  before: {
    pullRequestBody: facts(storedBody),
    releaseText: facts(storedRelease),
  },
  after: { pullRequestBody: facts(body), releaseText: facts(text) },
  sources: {
    pullRequestBody:
      "docs/final-reviews/WO-199/PR.md with its meter block re-rendered by renderMetaTable over collectMeta at this worktree and links written absolute at the reviewed revision",
    releaseText: `releaseEdition over manifestFromTag(${tag}) with the commit range bound at the tag`,
  },
};
writeFileSync(
  join(root, "docs/evidence/WO-188/wo199-regeneration.json"),
  JSON.stringify(record, null, 2) + "\n",
);
console.log(JSON.stringify(record, null, 2));
