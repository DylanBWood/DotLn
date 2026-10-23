// Run the Release record-link cases of the FINAL-001 repair, each in its own
// synthetic fixture, against the tree named by the first argument (the
// worktree, or a copy holding the pre-repair release.mjs and github-body.mjs).
// Run under scripts/harness.mjs bounded; prints one JSON line per case.
import { readFileSync, writeFileSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { pathToFileURL } from "node:url";
import { resolve, join } from "node:path";
import { spawnSync } from "node:child_process";

const root = resolve(process.argv[2] ?? process.cwd());
const file = join(root, "scripts/test-target-worktree-release.mjs");
const fixture = readFileSync(file, "utf8").replace(
  /from "(\.[^"]+)"/g,
  (_, specifier) =>
    `from ${JSON.stringify(new URL(specifier, pathToFileURL(file)).href)}`,
);
const cases = {
  "absent path at the tagged commit": `
    r.amendMain(notesPath, notesText("See [the implementation](" + at(r.merged, "docs/WO-006-notes.md") + ")."), "docs: author a target link");
    const result = r.close("--publish");
    assert.notEqual(result.status, 0, "the authored identifier must refuse");
    assert.match(result.stderr, /identifier\\.launchpad: WO-006 \\(line 5, reviewed notes\\)/u);
    assert.equal(r.tags(), "");`,
  "authored copy of a record link's bytes": `
    r.amendMain(notesPath, notesText("See [the order](" + at(r.merged, "docs/work-orders/WO-999-fixture.md") + ")."), "docs: copy the record link");
    const result = r.close("--publish");
    assert.notEqual(result.status, 0, "the authored copy must refuse");
    assert.equal(result.stderr.match(/identifier\\.launchpad/gu)?.length, 1, result.stderr);
    assert.match(result.stderr, /identifier\\.launchpad: WO-999 \\(line 5, reviewed notes\\)/u);
    assert.equal(r.tags(), "");`,
  "another order's identifier in a record link's fragment": `
    r.amendMain(notesPath, notesText("See [a decision](../../evidence/WO-999/decisions.md#wo-006-d001)."), "docs: carry another order's anchor");
    const result = r.close("--publish");
    assert.notEqual(result.status, 0, "the authored fragment must refuse");
    assert.equal(result.stderr.match(/identifier\\.launchpad/gu)?.length, 1, result.stderr);
    assert.match(result.stderr, /identifier\\.launchpad: wo-006-d001 \\(line 5, reviewed notes\\)/u);
    assert.equal(r.tags(), "");`,
  "the closing order's identifier in a record link's query": `
    r.amendMain(notesPath, notesText("See [the decisions](../../evidence/WO-999/decisions.md?plain=WO-999)."), "docs: carry an identifier query");
    const result = r.close("--publish");
    assert.notEqual(result.status, 0, "the authored query must refuse");
    assert.equal(result.stderr.match(/identifier\\.launchpad/gu)?.length, 1, result.stderr);
    assert.match(result.stderr, /identifier\\.launchpad: WO-999 \\(line 5, reviewed notes\\)/u);
    assert.equal(r.tags(), "");`,
  "review word in a record link's fragment": `
    r.amendMain(notesPath, notesText("See [the decision](../../evidence/WO-999/decisions.md#wo-999-d001--the-launchpad-board)."), "docs: carry a worded anchor");
    assert.match(f.ok(r.close("--dry-run")), /1 review item waits for --confirm-terms sha256:[0-9a-f]{64}: release-body: vocabulary\\.review: launchpad \\(line 5, reviewed notes\\)\\./u);`,
  "authored address with a review word": `
    r.amendMain(notesPath, notesText("See [the board](" + at(r.merged, "docs/launchpad-board.md") + ")."), "docs: author a worded link");
    assert.match(f.ok(r.close("--dry-run")), /2 review items wait for --confirm-terms sha256:[0-9a-f]{64}: release-body: vocabulary\\.review: DotLn \\(line 5, reviewed notes\\); release-body: vocabulary\\.review: launchpad \\(line 5, reviewed notes\\)\\./u);`,
  "written record links publish": `
    assert.match(f.ok(r.close("--publish")), /Target release body: reviewed; no review items;/u);
    const body = r.releases()["v0.1.0"].body;
    assert.ok(body.includes("[D001](" + at(r.merged, "docs/evidence/WO-999/decisions.md") + "#wo-999-d001)"), body);
    assert.ok(body.includes("[the order](" + at(r.merged, "docs/work-orders/WO-999-fixture.md") + ")"), body);`,
};
let source = fixture;
for (const [name, body] of Object.entries(cases))
  source += `
test(${JSON.stringify(`repair probe: ${name}`)}, () =>
  withFixture((f) => {
    const r = releaseFixture(f, {
      header: "**Target release notes:** reviewed\\n",
      notes: notesText("The fixture product gains a board."),
    });
    const notesPath = "records/final-reviews/WO-999/RELEASE-NOTES.md";
    const at = (revision, path) =>
      "https://github.com/dotln-fixture/target/blob/" + revision + "/" + path;
    ${body}
  }));
`;

const scratch = mkdtempSync(join(tmpdir(), "wo227-repair-release-"));
let failed = 0;
try {
  const probe = join(scratch, "release-link.test.mjs");
  writeFileSync(probe, source);
  for (const name of Object.keys(cases)) {
    const started = Date.now();
    const run = spawnSync(
      process.execPath,
      [
        "--test",
        "--test-concurrency=1",
        `--test-name-pattern=^repair probe: ${name}$`,
        probe,
      ],
      { cwd: root, encoding: "utf8", maxBuffer: 8 * 1024 * 1024 },
    );
    // A pattern that selects no test also exits 0, so the case counts as met
    // only when exactly its one test ran and passed.
    const count = (label) =>
      Number(new RegExp(`ℹ ${label} (\\d+)`, "u").exec(run.stdout ?? "")?.[1]);
    const met = run.status === 0 && count("tests") === 1 && count("pass") === 1;
    if (!met) failed += 1;
    const assertion = /AssertionError[^\n]*\n[^\n]*/u.exec(run.stdout ?? "");
    console.log(
      JSON.stringify({
        case: name,
        met,
        status: run.status,
        tests: count("tests"),
        durationMs: Date.now() - started,
        assertion: assertion
          ? assertion[0]
              .replaceAll(scratch, "<tmp>")
              .replaceAll(root, "<tree>")
              .trim()
          : null,
      }),
    );
  }
} finally {
  rmSync(scratch, { recursive: true, force: true });
}
process.exitCode = failed ? 1 : 0;
