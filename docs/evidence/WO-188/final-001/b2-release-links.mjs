// Run from the repository root; a temporary base directory is the first argument where one is read.
const repo = process.cwd();
const { absoluteBodyLinks, githubBodyProfileFailures, relativeLinkFailures } =
  await import(`${repo}/scripts/lib/github-body.mjs`);
const opts = {
  from: "docs/final-reviews/WO-001/release-notes.md",
  repository: { selector: "github.com/o/r" },
  revision: "a".repeat(40),
};
const sections = {
  quotedDefinition:
    "- The fix is described in [the record][r].\n\n> [r]: ../../evidence/WO-001/decisions.md\n",
  nestedEmpty: "- Outer [a [b]() d](../../evidence/WO-001/decisions.md).\n",
  splitLabel: "- See [the\nrecord](../../evidence/WO-001/decisions.md).\n",
};
for (const [name, text] of Object.entries(sections)) {
  const profileWithoutLinks = githubBodyProfileFailures(text);
  const out = absoluteBodyLinks(text, opts);
  console.log(
    name,
    "profile(no links):",
    JSON.stringify(profileWithoutLinks),
    "relative after rewrite:",
    JSON.stringify(relativeLinkFailures(out).map((l) => l.href)),
  );
}
