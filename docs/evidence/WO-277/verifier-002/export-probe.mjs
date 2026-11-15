import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync, cpSync, existsSync } from "node:fs";
import { join, basename } from "node:path";
import { pathToFileURL } from "node:url";
const root = process.cwd();
const output = process.argv[2];
const hash = (value) => createHash("sha256").update(value).digest("hex");
const { kit, scratch, env } = await import(
  pathToFileURL(join(root, "scripts/lib/launchpad-fixture.mjs"))
);
const bare = join(scratch, "verification export with spaces");
cpSync(kit, bare, {
  recursive: true,
  verbatimSymlinks: true,
  filter: (file) => basename(file) !== "node_modules",
});
assert.equal(existsSync(join(bare, "node_modules")), false);
const expected = readFileSync(join(root, "docs/OPERATOR.md"), "utf8");
const read = (file) => readFileSync(join(bare, file), "utf8");
const run = (args, cwd = bare) => {
  const result = spawnSync(process.execPath, args, {
    cwd,
    env,
    encoding: "utf8",
    maxBuffer: 8 * 1024 * 1024,
  });
  assert.equal(result.status, 0, result.stderr);
  return result.stdout;
};
const printed = run(["scripts/launchpad.mjs", "commands"]);
const nested = run(
  ["../scripts/launchpad.mjs", "commands"],
  join(bare, "docs"),
);
assert.equal(printed, expected);
assert.equal(nested, expected);
const paragraphs = printed.split(/^## \d+\. /mu).slice(1);
assert.equal(paragraphs.length, 7);
const observations = paragraphs.map((step, i) => {
  const lines = step.trim().split("\n\n");
  assert.ok(lines[1].trim().length > 0);
  const blockAt = step.indexOf("\n" + String.fromCharCode(96).repeat(3));
  assert.ok(blockAt > step.indexOf(lines[1]));
  return { step: i + 1, heading: lines[0], paragraphBeforeBlocks: true };
});
const first = paragraphs[0];
const terms = [
  "mkdir -p docs/control/local",
  "cp scripts/kit/terms.example.txt docs/control/local/terms.txt",
  "npm run terms -- check CLAUDE.md README.md",
];
assert.ok(first.indexOf("git clone --no-tags") < first.indexOf(terms[0]));
assert.ok(first.includes(terms.join("\n")));
assert.match(first, /replace the example's entries with your own/u);
assert.match(paragraphs[1].split("\n\n")[1], /WO-001/u);
assert.match(
  paragraphs[4].split("\n\n")[1],
  /git checkout main -- \.claude\/harness-manifest\.json/u,
);
assert.match(paragraphs[4].split("\n\n")[1], /git rm <path>/u);
const front = read("README.md").split(/\n\s*\n/u)[1];
const guide = read("docs/KIT.md").split(/\n\s*\n/u)[1];
assert.match(front, /\[docs\/OPERATOR\.md\]\(docs\/OPERATOR\.md\)/u);
assert.match(guide, /\[OPERATOR\.md\]\(OPERATOR\.md\)/u);
const manifest = JSON.parse(read("KIT-MANIFEST.json"));
for (const file of ["docs/KIT.md", "docs/OPERATOR.md"]) {
  assert.equal(
    manifest.files.find((row) => row.path === file)?.sha256,
    hash(read(file)),
  );
}
const result = {
  recordedAt: new Date().toISOString(),
  fixture: "scripts/lib/launchpad-fixture.mjs",
  noInstall: true,
  pathWithSpaces: true,
  rootAndNestedOutputEqual: true,
  pageSha256: hash(printed),
  pageBytes: Buffer.byteLength(printed),
  sourcePageEqual: true,
  manifestHashesEqual: true,
  termsBlockAfterCloneBeforePlanning: true,
  ownEntriesRequired: true,
  firstPassNamesWO001: true,
  manifestRecoveryNamed: true,
  deletionRecoveryNamed: true,
  readmeFirstParagraph: front,
  guideFirstParagraph: guide,
  steps: observations,
};
writeFileSync(
  join(output, "export-results.json"),
  JSON.stringify(result, null, 2) + "\n",
);
writeFileSync(join(output, "export-commands.txt"), printed);
console.log(
  JSON.stringify({
    result: "pass",
    pageBytes: result.pageBytes,
    pageSha256: result.pageSha256,
    steps: observations.length,
  }),
);
