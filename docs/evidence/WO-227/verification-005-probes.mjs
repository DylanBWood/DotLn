// Independent VER-005 probes; all lists and paths are synthetic.
// Run from the repository root under scripts/harness.mjs bounded.
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const root = resolve(process.argv[2] ?? process.cwd());
const load = (name) => import(pathToFileURL(join(root, name)).href);
const { lintOutwardArtifact } = await load("scripts/lib/outward-lint.mjs");
const { checkOutwardArtifact } = await load("scripts/outward-lint.mjs");
const { composeTargetBody } = await load("scripts/lib/github-body.mjs");
const { lintArtifacts } = await load("scripts/lib/target-publish.mjs");
const { digestOf } = await load("scripts/lib/confirm-terms.mjs");
const scratch = mkdtempSync(join(tmpdir(), "wo227-ver005-"));
const observations = [];
const write = (name, text) => {
  const file = join(scratch, name);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, text);
};
const capture = (fn) => {
  try {
    return { returned: fn() };
  } catch (error) {
    return { error: error.message };
  }
};
try {
  write("dotln.config.json", JSON.stringify({ version: 1 }));
  const composed = composeTargetBody({
    body: "# Result\n\nThe board changes.\n",
    baseCommit: "a".repeat(40),
    headCommit: "b".repeat(40),
    files: [
      { path: "a.txt", added: 1, deleted: 0 },
      { path: "day.md", added: 1, deleted: 0 },
    ],
    baseTree: new Set(["a.txt"]),
  });
  const artifact = { kind: "pr-body", ...composed };
  for (const mode of ["public", "refuse", "review", "unmarked"]) {
    write(
      "docs/control/outward-vocabulary.json",
      JSON.stringify({
        types: ["fix"],
        reviewTerms: mode === "public" ? ["0day"] : [],
      }),
    );
    write(
      "docs/control/local/terms.txt",
      mode === "public"
        ? ""
        : mode === "unmarked"
          ? "0day\n"
          : `${mode}: 0day\n`,
    );
    const direct = checkOutwardArtifact(scratch, artifact);
    const without = capture(() => lintArtifacts(scratch, [artifact]));
    const preview = capture(() =>
      lintArtifacts(scratch, [artifact], { preview: true }),
    );
    const confirmed = capture(() =>
      lintArtifacts(scratch, [artifact], {
        confirmTerms: digestOf(composed.text),
      }),
    );
    const newRowControl = capture(() =>
      lintArtifacts(scratch, [
        {
          ...artifact,
          rows: composed.rows.map((row) => ({ ...row, existed: false })),
        },
      ]),
    );
    observations.push({
      name: `term crossing from a base-held row into an added row: ${mode}`,
      meets:
        Boolean(without.error) &&
        (mode === "refuse"
          ? Boolean(confirmed.error)
          : confirmed.returned?.review?.matches === 1),
      direct: { status: direct.status, findings: direct.findings },
      without,
      preview,
      confirmed,
      newRowControl,
    });
  }
  // Compare section exemptions with a byte-by-byte oracle, including gaps,
  // nested authored parts, and a match exactly touching each boundary.
  // The oracle does no edge sampling.
  const text = "lead md launchpad tail";
  const matchStart = text.indexOf("md");
  const matchEnd = text.indexOf(" tail");
  const vocabulary = { types: ["fix"], reviewTerms: ["md launchpad"] };
  let checked = 0;
  for (let start = 0; start <= text.length; start++) {
    for (let end = start + 1; end <= text.length; end++) {
      for (const nested of [false, true]) {
        const sections = nested
          ? [
              {
                name: "frame",
                start: 0,
                end: text.length,
                exempt: ["vocabulary.review"],
              },
              { name: "authored", start, end },
            ]
          : [{ name: "frame", start, end, exempt: ["vocabulary.review"] }];
        let allExempt = true;
        for (let offset = matchStart; offset < matchEnd; offset++) {
          const part = sections
            .filter(
              (section) => section.start <= offset && offset < section.end,
            )
            .sort((a, b) => a.end - a.start - (b.end - b.start))[0];
          allExempt &&= Boolean(part?.exempt?.includes("vocabulary.review"));
        }
        const result = lintOutwardArtifact({
          kind: "release-body",
          text,
          vocabulary,
          localTerms: { status: "present" },
          sections,
        });
        assert.equal(
          result.status,
          allExempt ? "pass" : "review",
          JSON.stringify(sections),
        );
        checked++;
      }
    }
  }
  observations.push({
    name: "section boundaries versus a byte-by-byte oracle",
    meets: true,
    checked,
  });
  console.log(JSON.stringify({ observations }, null, 2));
  process.exitCode = observations.every((row) => row.meets) ? 0 : 1;
} finally {
  rmSync(scratch, { recursive: true, force: true });
}
