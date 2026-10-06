import assert from "node:assert/strict";
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  knownIssueSections,
  verificationKnownIssues,
} from "../../../../../scripts/lib/verification-briefing.mjs";
import {
  reviewFindings,
  findingsAdvisory,
} from "../../../../../scripts/lib/review-findings.mjs";
import { finalReviewFindings } from "../../../../../scripts/lib/plan-failures.mjs";
const root = process.cwd();
const start = "<!-- dotln-findings:start -->",
  end = "<!-- dotln-findings:end -->";
const classes = ["escape", "integration", "new-scope"];
const labels = [
  ...classes,
  undefined,
  null,
  false,
  1,
  "escaped",
  "escape.",
  [],
  {},
  "ESCAPE",
];
const routes = ["blocking", "follow-up", "operator"];
let findingCases = 0;
for (let size = 0; size <= 24; size++) {
  const entries = Array.from({ length: size }, (_, i) => ({
    id: `F${i + 1}`,
    route: routes[i % 3],
    class: labels[i % labels.length],
    summary: `Finding ${i + 1}: preserve its backtick \` and **markup**.`,
  }));
  const expected = { escape: 0, integration: 0, "new-scope": 0, unclassed: 0 };
  for (const entry of entries)
    expected[classes.includes(entry.class) ? entry.class : "unclassed"]++;
  for (const eol of ["\n", "\r\n", "\r"])
    for (const indent of [undefined, 2, 4]) {
      const block = [start, JSON.stringify(entries, null, indent), end].join(
        "\n",
      );
      const prose =
        "Unmatched ` prose and a class: escape mention.\n**Finding F99:** follow-up; class: escape; this prose does not declare a record.";
      const text = (prose + "\n\n" + block + "\n\n" + prose).replaceAll(
        "\n",
        eol,
      );
      const result = reviewFindings(text, { verdict: "pass" });
      assert.equal(result.measured, true);
      assert.deepEqual(result.counts, expected);
      assert.equal(result.unclassed.length, expected.unclassed);
      assert.equal(Boolean(findingsAdvisory(result)), expected.unclassed > 0);
      findingCases++;
    }
  if (size) {
    const duplicate = [...entries, { ...entries[0] }];
    const repeated = reviewFindings(
      [start, JSON.stringify(duplicate), end].join("\n"),
      { verdict: "pass" },
    );
    assert.equal(repeated.measured, false);
    assert.match(findingsAdvisory(repeated), /repeats id F1/);
    const broken = [
      ...entries,
      {
        id: "F999",
        route: "Blocking",
        class: "escape",
        summary: "Invalid route",
      },
    ];
    assert.equal(
      reviewFindings([start, JSON.stringify(broken), end].join("\n")).measured,
      false,
    );
    findingCases += 2;
  }
}
const headingForms = [
  "**Known issues and carry-ins:**",
  "**Known issues and carry-ins**:",
  "**Known issues and carry-ins**",
  "## Known issues and carry-ins",
  "### Known issues and carry-ins:",
];
const bodies = [
  "- First sentinel.\n**Cost:** continuation stays.\n- Second sentinel.",
  "Investigate **critical failure**\n\n**Receipt 900:** unlisted field stays.",
  "- First sentinel.\n\n````md\n```\n\n**Cost:** fenced example.\n```\n````\n\n- Second sentinel.",
];
let briefingCases = 0;
for (const label of headingForms)
  for (const body of bodies)
    for (const eol of ["\n", "\r\n", "\r"]) {
      const text = [
        "A stray ` prefix.",
        label,
        "",
        body,
        "",
        "**Non-goals:** excluded.",
      ]
        .join("\n")
        .replaceAll("\n", eol);
      const result = knownIssueSections(text);
      assert.equal(result.sections.length, 1);
      assert.equal(result.sections[0].lines.join("\n").trim(), body);
      assert.equal(result.sections[0].end.by, "**Non-goals:**");
      assert.equal(result.openFence, null);
      briefingCases++;
    }
const corpus = [];
for (const name of readdirSync("docs/work-orders")
  .filter((n) => /^WO-\d+.*\.md$/.test(n))
  .sort()) {
  const path = join("docs/work-orders", name),
    text = readFileSync(path, "utf8");
  const lines = text.split("\n");
  const at = lines.findIndex((line) =>
    line.startsWith("**Known issues and carry-ins:**"),
  );
  if (at < 0) continue;
  let stop = lines.findIndex(
    (line, i) => i > at && line.startsWith("**Non-goals:**"),
  );
  if (stop < 0) stop = lines.length;
  const expected = [
    lines[at].slice("**Known issues and carry-ins:**".length).trimStart(),
    ...lines.slice(at + 1, stop),
  ]
    .join("\n")
    .trim();
  const found = knownIssueSections(text);
  assert.equal(found.sections.length, 1, path);
  assert.equal(found.sections[0].lines.join("\n").trim(), expected, path);
  const id = name.match(/^WO-\d+/)[0];
  const briefing = verificationKnownIssues(root, {
    workOrderId: id,
    workOrderPath: path,
  });
  assert.ok(briefing.includes(expected), path);
  corpus.push({
    path,
    labelLine: at + 1,
    endingLine: stop + 1,
    bodyBytes: Buffer.byteLength(expected),
    printedWhole: true,
  });
}
let historical = 0,
  unmeasured = 0;
for (const order of readdirSync("docs/final-reviews", {
  withFileTypes: true,
}).filter((e) => e.isDirectory())) {
  for (const name of readdirSync(join("docs/final-reviews", order.name)).filter(
    (n) => /^FINAL-\d+\.md$/.test(n),
  )) {
    const text = readFileSync(
      join("docs/final-reviews", order.name, name),
      "utf8",
    );
    const result = reviewFindings(text);
    historical++;
    if (!result.measured) unmeasured++;
    assert.equal(
      result.measured,
      false,
      `${order.name}/${name} is a historical prose-only report`,
    );
    assert.ok(findingsAdvisory(result));
  }
}
// The last-ten denominator must include every attempt of those orders, not
// only the ten most recent events. An unmeasured historical attempt poisons
// the rate even when a later measured pass exists for the same order.
const events = [];
for (let n = 1; n <= 12; n++) {
  events.push({
    type: "FinalReviewCompleted",
    workOrderId: `WO-${n}`,
    recordedAt: `2031-01-${String(n).padStart(2, "0")}T00:00:00Z`,
    findingCounts: { escape: n, integration: 0, "new-scope": 0, unclassed: 0 },
  });
}
events.push({
  type: "FinalReviewCompleted",
  workOrderId: "WO-12",
  recordedAt: "2030-01-01T00:00:00Z",
});
const counts = finalReviewFindings(
  { eventSegments: new Map([["test", events]]) },
  () => true,
  { full: true },
);
assert.equal(counts.recent.reviews, 11);
assert.equal(counts.recent.orders, 10);
assert.equal(counts.recent.measured, 10);
assert.equal(counts.recent.escapes, 75);
assert.equal(counts.recent.escapesPerFinalReview, null);
const result = {
  observedAt: new Date().toISOString(),
  findingCases,
  briefingCases,
  corpus,
  history: { reports: historical, unmeasured },
  lastTen: counts.recent,
};
writeFileSync(
  "docs/evidence/WO-187/verification-005/attacks.json",
  JSON.stringify(result, null, 2) + "\n",
);
console.log(
  JSON.stringify({
    findingCases,
    briefingCases,
    realCarryInSections: corpus.length,
    historicalReports: historical,
    unmeasured,
    lastTen: counts.recent,
  }),
);
