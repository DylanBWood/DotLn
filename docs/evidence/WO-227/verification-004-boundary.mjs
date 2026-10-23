// Isolate the section-exemption boundary without editing the implementation.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { absoluteBodyLinks } from "../../../scripts/lib/github-body.mjs";
import { lintOutwardArtifact } from "../../../scripts/lib/outward-lint.mjs";

const source = readFileSync("scripts/lib/outward-lint.mjs", "utf8");
const predicate = "finding.span.start < section.end,";
assert.equal(source.split(predicate).length, 2);
const fullSpan = await import(
  "data:text/javascript;base64," +
    Buffer.from(
      source.replace(
        predicate,
        "finding.span.start < section.end && finding.span.end <= section.end,",
      ),
    ).toString("base64")
);
const results = [];
for (const [name, suffix, term, expected] of [
  [
    "compound term crosses into fragment",
    "#launchpad",
    "md launchpad",
    "review",
  ],
  ["compound term crosses into query", "?launchpad", "md launchpad", "review"],
  ["term wholly in authored fragment", "#launchpad", "launchpad", "review"],
  ["term wholly in generated path", "#plain", "decisions", "pass"],
]) {
  const written = [];
  const text = absoluteBodyLinks(
    "See [record](../../evidence/WO-999/decisions.md" + suffix + ").",
    {
      from: "docs/final-reviews/WO-999/RELEASE-NOTES.md",
      repository: { selector: "github.com/fixture/target" },
      revision: "a".repeat(40),
      map: (resolved) =>
        resolved === "docs/evidence/WO-999/decisions.md" ? resolved : null,
      written,
    },
  );
  assert.equal(written.length, 1);
  const range = written[0];
  const section = {
    name: "record link",
    start: range.start,
    end: range.start + text.slice(range.start, range.end).search(/[?#]|$/u),
    exempt: ["identifier.launchpad", "vocabulary.review"],
  };
  const input = {
    kind: "release-body",
    text,
    target: true,
    vocabulary: { types: ["fix"], reviewTerms: [term] },
    localTerms: { status: "present" },
    sections: [section, { name: "reviewed notes", start: 0, end: text.length }],
  };
  const unexempted = lintOutwardArtifact({ ...input, sections: [] });
  const match = unexempted.findings.find(
    (finding) => finding.rule === "vocabulary.review",
  );
  const actual = lintOutwardArtifact(input);
  const control = fullSpan.lintOutwardArtifact(input);
  assert.equal(control.status, expected);
  results.push({
    name,
    expected,
    actual: actual.status,
    fullSpanControl: control.status,
    match: {
      text: text.slice(match.span.start, match.span.end),
      ...match.span,
    },
    generatedSpan: { start: section.start, end: section.end },
    met: actual.status === expected,
  });
}
console.log(JSON.stringify({ results }, null, 2));
process.exitCode = results.every((row) => row.met) ? 0 : 1;
