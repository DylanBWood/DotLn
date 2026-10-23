// Independent VER-004 probes. Publication effects use temporary synthetic
// repositories and a local fake forge. Run from the repository root under
// node scripts/harness.mjs bounded -- node <this file>.
import { readFileSync, writeFileSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { pathToFileURL } from "node:url";
import { resolve, join } from "node:path";
import { spawnSync } from "node:child_process";

const root = resolve(process.argv[2] ?? process.cwd());
const file = join(root, "scripts/test-target-worktree-release.mjs");
let source = readFileSync(file, "utf8").replace(
  /from "(\.[^"]+)"/g,
  (_, specifier) =>
    "from " + JSON.stringify(new URL(specifier, pathToFileURL(file)).href),
);
source +=
  "\nconst {checkOutwardArtifact} = await import(" +
  JSON.stringify(pathToFileURL(join(root, "scripts/outward-lint.mjs")).href) +
  ");\n";

const cases = [
  [
    "authored destinations stay checked after link rewrites",
    () =>
      withFixture((f) => {
        const r = releaseFixture(f, {
          header: "**Target release notes:** reviewed\n",
          notes: notesText("The fixture product gains a board."),
        });
        const notesPath = "records/final-reviews/WO-999/RELEASE-NOTES.md";
        const url =
          "https://github.com/dotln-fixture/target/blob/" +
          r.merged +
          "/docs/work-orders/WO-999-fixture.md";
        const variants = [
          [
            "inline authored copy after a rewrite and emoji",
            "🧭 See [record](../../evidence/WO-999/decisions.md), then [authored](" +
              url +
              ").",
            "WO-999",
          ],
          [
            "absolute reference definition after a rewrite",
            "See [record](../../evidence/WO-999/decisions.md) and [authored][copy].\n\n[copy]: " +
              url,
            "WO-999",
          ],
          [
            "foreign identifier in a generated image fragment",
            "See ![chart](../../evidence/WO-999/decisions.md#wo-006-d001).",
            "wo-006-d001",
          ],
          [
            "foreign identifier in a reference-style generated fragment",
            "See [record][ref].\n\n[ref]: ../../evidence/WO-999/decisions.md#wo-006-d001",
            "wo-006-d001",
          ],
          [
            "two repeated authored copies",
            "See [a](" + url + ") and [b](" + url + ").",
            "WO-999",
          ],
        ];
        for (const [name, overview, identifier] of variants) {
          r.amendMain(
            notesPath,
            notesText(overview),
            "docs: vary authored link provenance",
          );
          const result = r.close("--publish");
          const observed = {
            name,
            status: result.status,
            diagnostic: result.stderr.trim(),
            tagPublished: r.tags() !== "",
            releaseCreated: Object.keys(r.releases()).length > 0,
          };
          console.log("VER004_PROVENANCE " + JSON.stringify(observed));
          assert.notEqual(result.status, 0, name);
          assert.ok(
            result.stderr.includes("identifier.launchpad: " + identifier),
            result.stderr,
          );
          assert.equal(observed.tagPublished, false, name);
          assert.equal(observed.releaseCreated, false, name);
        }
      }),
  ],
  [
    "a review term crossing into an authored fragment requires confirmation",
    () =>
      withFixture((f) => {
        const r = releaseFixture(f, {
          header: "**Target release notes:** reviewed\n",
          notes: notesText(
            "See [the record](../../evidence/WO-999/decisions.md#launchpad).",
          ),
        });
        const vocabularyPath = docPath(
          f.main,
          "control",
          "outward-vocabulary.json",
        );
        const vocabulary = JSON.parse(readFileSync(vocabularyPath, "utf8"));
        vocabulary.reviewTerms = ["md launchpad"];
        delete vocabulary.terms;
        r.amendMain(
          vocabularyPath.slice(f.main.length + 1),
          JSON.stringify(vocabulary),
          "docs: set a compound review term",
        );
        const controlText =
          "See [the record](https://github.com/dotln-fixture/target/blob/" +
          r.merged +
          "/docs/evidence/WO-999/decisions.md#launchpad).";
        const control = checkOutwardArtifact(f.main, {
          kind: "release-body",
          text: controlText,
          target: true,
        });
        const match = control.findings.find(
          (finding) => finding.rule === "vocabulary.review",
        );
        assert.equal(
          match?.term,
          "md launchpad",
          "the configured term matches the rendered bytes",
        );
        const result = r.close("--publish");
        const release = r.releases()["v0.1.0"];
        console.log(
          "VER004_BOUNDARY " +
            JSON.stringify({
              status: result.status,
              diagnostic: result.stderr.trim(),
              controlReview: {
                term: match.term,
                text: controlText.slice(match.span.start, match.span.end),
              },
              tagPublished: r.tags() !== "",
              releaseCreated: Boolean(release),
              authoredFragmentPublished:
                release?.body.includes("decisions.md#launchpad") ?? false,
              recordedBody: r.record().publication.target.body,
            }),
        );
        assert.notEqual(
          result.status,
          0,
          "the match includes authored fragment bytes and must wait for confirmation",
        );
        assert.match(result.stderr, /vocabulary\.review: md launchpad/u);
        assert.equal(r.tags(), "", "confirmation must precede tag push");
      }),
  ],
];
for (const [name, fn] of cases)
  source +=
    "\ntest(" +
    JSON.stringify("VER-004 " + name) +
    ", " +
    fn.toString() +
    ");\n";
const scratch = mkdtempSync(join(tmpdir(), "wo227-ver004-"));
try {
  const probe = join(scratch, "release-boundaries.test.mjs");
  writeFileSync(probe, source);
  const run = spawnSync(
    process.execPath,
    ["--test", "--test-concurrency=1", "--test-name-pattern=^VER-004 ", probe],
    { cwd: root, encoding: "utf8", maxBuffer: 8 * 1024 * 1024 },
  );
  const redact = (value) =>
    value.replaceAll(scratch, "<tmp>").replaceAll(root, "<worktree>");
  console.log(
    JSON.stringify(
      {
        status: run.status,
        signal: run.signal,
        stdout: redact(run.stdout ?? ""),
        stderr: redact(run.stderr ?? ""),
      },
      null,
      2,
    ),
  );
  process.exitCode = run.status ?? 1;
} finally {
  rmSync(scratch, { recursive: true, force: true });
}
