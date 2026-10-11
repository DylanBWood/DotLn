import { pathToFileURL } from "node:url";
import { join } from "node:path";
const root = process.argv[2];
const { githubBodyProfileFailures, relativeLinkFailures } = await import(
  pathToFileURL(join(root, "scripts/lib/github-body.mjs"))
);
const { readExample, variants } = await import(
  pathToFileURL(join(root, "scripts/lib/reader-profiles.mjs"))
);
for (const surface of ["prBody", "releaseNotes", "releasePage"])
  for (const variant of variants) {
    const { text } = readExample(root, surface, variant);
    const f = githubBodyProfileFailures(text, { links: true });
    const r = relativeLinkFailures(text);
    console.log(
      `${surface}/${variant}: profileFailures=${f.length} relativeLinks=${r.length}${f.length ? " :: " + JSON.stringify(f).slice(0, 300) : ""}`,
    );
  }
