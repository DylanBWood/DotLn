// Real lifecycle fixture, also executable against an older resume source.
import assert from "node:assert/strict";
import {
  cpSync,
  mkdirSync,
  readFileSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { dirname, isAbsolute, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { spawnGit } from "./lib/git.mjs";
import { installBeaconFixture } from "./test-beacon-fixture.mjs";
import { findingsAdvisory, reviewFindings } from "./lib/review-findings.mjs";
import { verificationKnownIssues } from "./lib/verification-briefing.mjs";
import { readHandoffLedger } from "./lib/handoff-ledger.mjs";
import {
  finalReviewFindings,
  failuresAtStart,
  planningFailures,
  exportFailures,
} from "./lib/plan-failures.mjs";

const [parent, subject] = process.argv.slice(2);
assert.ok(parent && isAbsolute(parent) && realpathSync(parent) === parent);
assert.ok(readFileSync(join(parent, ".dotln-test-root-owner")));
const scripts = dirname(fileURLToPath(import.meta.url));
const root = join(parent, "verification-review");
mkdirSync(join(root, "scripts"), { recursive: true });
cpSync(
  subject ?? join(scripts, "resume.mjs"),
  join(root, "scripts/resume.mjs"),
);
cpSync(join(scripts, "lib"), join(root, "scripts/lib"), { recursive: true });
cpSync(join(scripts, "../.gitignore"), join(root, ".gitignore"));
installBeaconFixture(root);
const write = (file, text) => {
  mkdirSync(dirname(join(root, file)), { recursive: true });
  writeFileSync(join(root, file), text);
};
write(
  "docs/work-orders/WO-187-fixture.md",
  "# WO-187 — fixture\n\n**Model:** any.\n**Effort:** executor any; verifier any; reviewer any.\n**Objective:** fixture.\n\n**Acceptance criteria (all required)**\n\n1. Prose read.\n\n```md\n**Known issues and carry-ins:**\n\n- fenced-example sentinel.\n```\n\n**Known issues and carry-ins:**\n\n- order-known-issue sentinel.\n```md\n## This heading remains inside the carry-in example\nbody-example sentinel.\n```\n\n**Non-goals:** ignored-section sentinel.\n\n**Known issues and carry-ins:** inline-label sentinel.\n\n**Receipt 038:** bold-paragraph sentinel.\n\n**Operator-review assumptions**\n\n1. assumption sentinel.\n",
);
const receipt = {
  schemaVersion: "plan-refutation-receipt-v1",
  receiptId: "2030-01-01-planning-fixture-001",
  ordinal: 1,
  episode: { completedAt: "2030-01-01T00:00:00.000Z" },
  pass: { kind: "planning" },
  result: {
    orders: [
      {
        workOrderId: "WO-187",
        findings: [
          {
            kind: "known-issue",
            criterionId: "criterion:1",
            reason: "receipt-known-issue sentinel.",
            reopenWhen: "reopening sentinel.",
          },
        ],
      },
    ],
  },
};
write(
  `docs/planning/refutations/${receipt.receiptId}.json`,
  JSON.stringify(receipt),
);
for (const [n, value] of [null, 42, [], {}].entries())
  write(
    `docs/planning/refutations/2030-01-01-planning-shape-${String(n).padStart(3, "0")}.json`,
    JSON.stringify(value),
  );
const env = {
  ...Object.fromEntries(
    Object.entries(process.env).filter(
      ([name]) => !/^(?:CLAUDE|CODEX|COPILOT|DOTLN_|GIT_)/u.test(name),
    ),
  ),
  GIT_AUTHOR_NAME: "fixture",
  GIT_AUTHOR_EMAIL: "fixture@example.invalid",
  GIT_COMMITTER_NAME: "fixture",
  GIT_COMMITTER_EMAIL: "fixture@example.invalid",
};
for (const args of [
  ["init", "-q"],
  ["add", "-A"],
  ["commit", "-q", "-m", "fixture"],
  ["checkout", "-q", "-b", "wo-187"],
])
  assert.equal(spawnGit(["-C", root, ...args], { env }).status, 0);
const actor = {
  harness: "human",
  harnessVersion: "not-applicable",
  model: "human",
  effort: "unknown",
  source: "operator-attested",
};
const flags = Object.entries(actor).flatMap(([key, value]) => [
  `--${key === "harnessVersion" ? "harness-version" : key}`,
  value,
]);
const call = (args, cwd = root) => {
  const result = spawnSync(
    process.execPath,
    [join(root, "scripts/resume.mjs"), ...args],
    { cwd, env, encoding: "utf8" },
  );
  assert.equal(result.status, 0, `${args.join(" ")}: ${result.stderr}`);
  return result;
};
const ledger = "docs/evidence/WO-187/handoff.md";
const SELF_REVIEW_ADVISORY = (path) =>
  `${path} lacks a self-review: line; write a line that starts \`self-review: found <n>; fixed <n>; recorded <n>\` with the fresh review's counts, then the worker or the separate-pass fallback. Completion records all the same.`;
write(ledger, "**Criterion 1:** met. Read.\n");
call(["activate", "WO-187", "docs/work-orders/WO-187-fixture.md"]);
const missing = call(["implementation-ready", ...flags]);
if (!subject)
  assert.equal(
    missing.stderr.split(`Advisory: ${SELF_REVIEW_ADVISORY(ledger)}`).length,
    2,
    missing.stderr,
  );
const verify = call(["verify"]).stdout;
assert.ok(
  verify.includes("order-known-issue sentinel"),
  "verify must print the order's known issues",
);
assert.ok(
  verify.includes("receipt-known-issue sentinel"),
  "verify must print planning known issues",
);
assert.ok(verify.includes("reopening sentinel"));
assert.ok(!verify.includes("ignored-section sentinel"));
assert.ok(!verify.includes("fenced-example sentinel"));
// The briefing prints each section as written, under the lines it printed.
assert.ok(
  verify.includes(
    "Known issues and carry-ins (docs/work-orders/WO-187-fixture.md:17-23; ends before line 25, **Non-goals:**):\n- order-known-issue sentinel.\n```md\n## This heading remains inside the carry-in example\nbody-example sentinel.\n```\n\nKnown issues and carry-ins (docs/work-orders/WO-187-fixture.md:27-29; ends before line 31, **Operator-review assumptions**):\ninline-label sentinel.\n\n**Receipt 038:** bold-paragraph sentinel.\n\nPlanning receipt 2030-01-01-planning-fixture-001 known issues for WO-187:\n- criterion:1: receipt-known-issue sentinel. Reopen when: reopening sentinel.",
  ),
  verify,
);
assert.ok(!verify.includes("assumption sentinel"));
const beforeBriefing = readFileSync(
  join(root, "docs/control/orders/WO-187.jsonl"),
);
assert.equal(
  call(["briefing"]).stdout.replace(/^Observed facts.*$/mu, ""),
  verify.replace(/^Observed facts.*$/mu, ""),
  "read-only briefing retains both inputs",
);
assert.deepEqual(
  readFileSync(join(root, "docs/control/orders/WO-187.jsonl")),
  beforeBriefing,
);
const newerReceipt = structuredClone(receipt);
newerReceipt.receiptId = "2030-01-01-planning-fixture-002";
newerReceipt.ordinal = 2;
newerReceipt.result.orders[0].findings[0].reason = "newer-receipt sentinel.";
write(
  `docs/planning/refutations/${newerReceipt.receiptId}.json`,
  JSON.stringify(newerReceipt),
);
const newerBriefing = call(["briefing"]).stdout;
assert.ok(newerBriefing.includes("newer-receipt sentinel"));
assert.ok(!newerBriefing.includes("receipt-known-issue sentinel"));
const clearedReceipt = structuredClone(newerReceipt);
clearedReceipt.receiptId = "2030-01-01-planning-fixture-003";
clearedReceipt.ordinal = 3;
clearedReceipt.result.orders[0].findings = [];
write(
  `docs/planning/refutations/${clearedReceipt.receiptId}.json`,
  JSON.stringify(clearedReceipt),
);
const clearedBriefing = call(["briefing"]).stdout;
assert.ok(clearedBriefing.includes("order-known-issue sentinel"));
assert.ok(!clearedBriefing.includes("receipt-known-issue sentinel"));
assert.ok(!clearedBriefing.includes("newer-receipt sentinel"));
// Briefing skips non-receipt JSON; planning separately validates its records.
// Remove only these four malformed files created by this private fixture.
for (let n = 0; n < 4; n++)
  rmSync(
    join(
      root,
      `docs/planning/refutations/2030-01-01-planning-shape-${String(n).padStart(3, "0")}.json`,
    ),
  );
const report = (file, findings = "") =>
  write(
    file,
    `# Fixture\n\n**Actor attestation:** ${JSON.stringify(actor)}\n\n**Process cost:** unknown; cause no-session\n\n**Criterion 1:** met. Read.\n\n${findings}\n`,
  );
// The findings block: two marker lines around a JSON array. `entry` omits a
// class given as undefined, and `block` takes entries or the raw text between
// the markers.
const START = "<!-- dotln-findings:start -->";
const END = "<!-- dotln-findings:end -->";
const block = (entries) =>
  `${START}\n${typeof entries === "string" ? entries : JSON.stringify(entries, null, 2)}\n${END}`;
const entry = (id, route, label, summary = "a defect.") => ({
  id,
  route,
  ...(label === undefined ? {} : { class: label }),
  summary,
});
const zero = { escape: 0, integration: 0, "new-scope": 0, unclassed: 0 };
const FORMAT =
  'a `<!-- dotln-findings:start -->` line, a JSON array of {"id": "F1", "route": "blocking|follow-up|operator", "class": "escape|integration|new-scope", "summary": "<one line>"} entries ([] for none) and a `<!-- dotln-findings:end -->` line';
const UNMEASURED = (cause) =>
  `${cause}; its finding counts are recorded as unmeasured. A report lists its findings in one block: ${FORMAT}.`;
// Finding-shaped prose never counts, with a block or without: the canonical
// line of the earlier reader and the eight shapes VER-004 recorded.
const prose = [
  "**Finding F1:** blocking; class: escape; counted control.",
  "**Issue 1:** blocking; class: escape; second defect.",
  "**Finding #2:** blocking; class: escape; second defect.",
  "**Defect A:** blocking; class: integration; second defect.",
  "**Finding F2.1:** blocking; class: escape; second defect.",
  "**F 2:** blocking; class: escape; second defect.",
  "**R1:** route: blocking; class: escape; second defect.",
  "**R1:** class: escape; blocking; second defect.",
  "**Finding F3:** F1's repair regressed the briefing; blocking; class: escape.",
].join("\n\n");
const events = (order = "WO-187") =>
  readFileSync(join(root, `docs/control/orders/${order}.jsonl`), "utf8")
    .trim()
    .split("\n")
    .map(JSON.parse);
// One advisory names what a result's count holds, and the result records.
const recorded = (result, path, advisory, counts, verdict, order) => {
  const line = `${path}: ${advisory} The final-review result records all the same.`;
  assert.equal(
    result.stderr.split(`${path}: `).length - 1,
    advisory ? 1 : 0,
    result.stderr,
  );
  if (advisory) assert.ok(result.stderr.includes(`Advisory: ${line}\n`));
  const event = events(order).at(-1);
  assert.equal(event.type, "FinalReviewCompleted");
  assert.equal(event.verdict, verdict);
  assert.deepEqual(event.findingCounts, counts);
  assert.deepEqual(
    event.evidence.advisories.filter((text) => text.startsWith(`${path}: `)),
    advisory ? [line] : [],
  );
};
report("docs/verifications/WO-187/VER-001.md");
call(["verification-result", "pass", ...flags]);
call(["final-review"]);
report(
  "docs/final-reviews/WO-187/FINAL-001.md",
  `${prose}\n\n${block([
    entry("F1", "blocking", "escape"),
    entry("F2", "follow-up", "integration"),
    entry("F3", "operator", "new-scope"),
    entry("F4", "blocking"),
    entry("F5", "blocking", "typo"),
  ])}`,
);
recorded(
  call(["final-review-result", "fail", ...flags], join(root, "docs")),
  "docs/final-reviews/WO-187/FINAL-001.md",
  "blocking findings F4, F5 have no class or one outside escape, integration, new-scope; counted as unclassed.",
  { escape: 1, integration: 1, "new-scope": 1, unclassed: 2 },
  "fail",
);
call(["fix"]);
write(ledger, "**Criterion 1:** met. Read.\n");
assert.ok(!call(["repair-complete", ...flags]).stderr.includes("self-review"));
call(["verify"]);
report("docs/verifications/WO-187/VER-002.md");
call(["verification-result", "pass", ...flags]);
call(["final-review"]);
// A failed review that writes its findings only as prose is unmeasured, never
// a measured zero or a count of the lines a reader happened to recognise.
report("docs/final-reviews/WO-187/FINAL-002.md", prose);
recorded(
  call(["final-review-result", "fail", ...flags]),
  "docs/final-reviews/WO-187/FINAL-002.md",
  UNMEASURED("the report has no findings block"),
  undefined,
  "fail",
);
call(["fix"]);
write(
  ledger,
  "**Criterion 1:** met. Read.\n- self-review: found 0; fixed 0; recorded 0.\n",
);
assert.ok(!call(["repair-complete", ...flags]).stderr.includes("self-review"));
call(["verify"]);
report("docs/verifications/WO-187/VER-003.md");
call(["verification-result", "pass", ...flags]);
call(["final-review"]);
report(
  "docs/final-reviews/WO-187/FINAL-003.md",
  block([entry("F1", "follow-up", "escape", "on a passing review.")]),
);
recorded(
  call(["final-review-result", "pass", ...flags]),
  "docs/final-reviews/WO-187/FINAL-003.md",
  null,
  { ...zero, escape: 1 },
  "pass",
);
const page = planningFailures(root, { all: true });
assert.equal(page.finalReviewFindings.byOrder["WO-187"].escapes, 2);
assert.equal(page.finalReviewFindings.byOrder["WO-187"].unclassed, 2);
assert.equal(page.finalReviewFindings.byOrder["WO-187"].measured, 2);
// One unmeasured review makes the rate unknown, not a lower measured rate.
assert.equal(page.finalReviewFindings.recent.escapesPerFinalReview, null);
assert.deepEqual(
  exportFailures(root, { all: true }).finalReviewFindings.byOrder,
  page.finalReviewFindings.byOrder,
);
const synthetic = [];
for (let n = 1; n <= 12; n++)
  synthetic.push({
    type: "FinalReviewCompleted",
    workOrderId: `WO-${String(n).padStart(3, "0")}`,
    finalReviewId: "FINAL-001",
    recordedAt: `2999-01-${String(n).padStart(2, "0")}T00:00:00.000Z`,
    findingCounts: {
      escape: n,
      integration: 0,
      "new-scope": 0,
      unclassed: n === 12 ? 1 : 0,
    },
  });
synthetic.push({
  ...synthetic.at(-1),
  finalReviewId: "FINAL-002",
  recordedAt: "2999-01-13T00:00:00.000Z",
  findingCounts: { escape: 1, integration: 0, "new-scope": 0, unclassed: 0 },
});
const counts = finalReviewFindings({
  eventSegments: new Map([["fixture", synthetic]]),
});
assert.deepEqual(counts.recent, {
  orders: 10,
  reviews: 11,
  measured: 11,
  escapes: 76,
  unclassed: 1,
  escapesPerFinalReview: 76 / 11,
});
assert.equal(
  finalReviewFindings({
    eventSegments: new Map([
      ["fixture", [{ type: "FinalReviewCompleted", workOrderId: "WO-001" }]],
    ]),
  }).recent.escapesPerFinalReview,
  null,
);
// WO-187 D019 R1: clean passing reviews, older than the last ten, add no
// failure item; one holding only an unclassed finding adds one.
const clean = ["WO-021", "WO-022", "WO-023", "WO-024"].map((order, n) => ({
  type: "FinalReviewCompleted",
  workOrderId: order,
  finalReviewId: "FINAL-001",
  verdict: "pass",
  recordedAt: `2998-01-0${n + 1}T00:00:00.000Z`,
  findingCounts: {
    escape: 0,
    integration: 0,
    "new-scope": 0,
    unclassed: order === "WO-024" ? 1 : 0,
  },
}));
// Exercise plan start's bounded figure against the same synthetic log.
const logged = [...synthetic, ...clean];
for (const order of new Set(logged.map((event) => event.workOrderId))) {
  const activation = {
    type: "WorkOrderActivated",
    workOrderId: order,
    workOrderPath: `docs/work-orders/${order}-fixture.md`,
    recordedAt: "2999-01-01T00:00:00.000Z",
  };
  write(
    activation.workOrderPath,
    `# ${order} — fixture\n\n**Model:** any.\n**Effort:** executor any; verifier any; reviewer any.\n**Track:** machinery\n`,
  );
  write(
    `docs/control/orders/${order}.jsonl`,
    [activation, ...logged.filter((event) => event.workOrderId === order)]
      .map((event) => JSON.stringify({ schemaVersion: 3, ...event }))
      .join("\n") + "\n",
  );
}
const start = failuresAtStart(root);
assert.ok(start.finalReviewEscapes, JSON.stringify(start));
assert.equal(start.finalReviewEscapes, "76/11 reviews; 10 orders; 1 unclassed");
assert.ok(Buffer.byteLength(JSON.stringify(start, null, 2)) <= 1024);
const reviewItems = exportFailures(root, { all: true })
  .rows.filter((row) => row.kind === "review-findings")
  .map((row) => row.order);
for (const order of ["WO-021", "WO-022", "WO-023"])
  assert.ok(!reviewItems.includes(order), `${order} is a clean review`);
assert.ok(reviewItems.includes("WO-024"));
assert.equal(
  reviewItems.filter((order) => order === "WO-187").length,
  2,
  "the unmeasured failed review adds no review item",
);
// The findings block, one row per outcome: [case, report text, verdict, the
// reading, the advisory]. A measured reading is { counts, unclassed }; an
// unmeasured one is its cause. Every outcome is decided by the block alone.
const measured = (counts, unclassed = []) => ({
  measured: true,
  counts: { ...zero, ...counts },
  unclassed,
});
const NEEDS_ONE = (starts, ends) =>
  `the report needs one findings block, and has a start marker on ${starts} and an end marker on ${ends}`;
const ENTRY = (n, problem, value) =>
  `entry ${n} of the findings block ${problem}: ${JSON.stringify(value)}`;
const NEEDS_ID = "needs an id F<n>, n from 1 with no leading zero";
const NO_BLOCKING =
  "the failed review's findings block lists no blocking finding";
const real = block([entry("F1", "follow-up", "integration")]);
const second = JSON.stringify([entry("F2", "blocking", "escape")]);
const long = entry("F1", "severe", "escape", "x".repeat(200));
const astral = entry("F1", "severe", "escape", "\u{1F600}".repeat(200));
for (const [name, text, verdict, reading, advisory] of [
  [
    "three classes; no class and an unknown class are unclassed",
    block([
      entry("F1", "blocking", "escape"),
      entry("F2", "follow-up", "integration"),
      entry("F3", "operator", "new-scope"),
      entry("F4", "blocking"),
      entry("F5", "blocking", "typo"),
    ]),
    "fail",
    measured({ escape: 1, integration: 1, "new-scope": 1, unclassed: 2 }, [
      { id: "F4", blocking: true },
      { id: "F5", blocking: true },
    ]),
    "blocking findings F4, F5 have no class or one outside escape, integration, new-scope; counted as unclassed.",
  ],
  ["a passing review with none", block([]), "pass", measured({}), null],
  ["a failed review with none", block([]), "fail", NO_BLOCKING],
  // A review fails on a blocking finding, so a failed review's block without
  // one cannot be complete, whatever else it lists.
  ["a failed review with only a follow-up", real, "fail", NO_BLOCKING],
  [
    "a failed review with only an operator finding",
    block([entry("F1", "operator", "new-scope")]),
    "fail",
    NO_BLOCKING,
  ],
  [
    "a passing review with only a follow-up",
    real,
    "pass",
    measured({ integration: 1 }),
    null,
  ],
  ["no block, passing", "", "pass", "the report has no findings block"],
  ["no block, failed", "", "fail", "the report has no findings block"],
  ["prose only, passing", prose, "pass", "the report has no findings block"],
  ["prose only, failed", prose, "fail", "the report has no findings block"],
  [
    "prose beside the block adds nothing",
    `${prose}\n\n${block([entry("F1", "blocking", "integration")])}\n\n${prose}`,
    "fail",
    measured({ integration: 1 }),
    null,
  ],
  [
    "two blocks",
    `${block([entry("F1", "blocking", "escape")])}\n\n${block([])}`,
    "fail",
    NEEDS_ONE("lines 1, 12", "lines 10, 14"),
  ],
  [
    "a fenced example of the block is a second block",
    `\`\`\`md\n${block([])}\n\`\`\`\n\n${block([entry("F1", "blocking", "escape")])}`,
    "pass",
    NEEDS_ONE("lines 2, 7", "lines 4, 16"),
  ],
  // A second block is one in any layout: quoted, in a list item, in another
  // case or spacing, or with its markers alone in inline code.
  [
    "a quoted second block",
    `${real}\n\n> ${START}\n> ${second}\n> ${END}`,
    "pass",
    NEEDS_ONE("lines 1, 12", "lines 10, 14"),
  ],
  [
    "a second block in a list item",
    `${real}\n\n- ${START}\n  ${second}\n  ${END}`,
    "pass",
    NEEDS_ONE("lines 1, 12", "lines 10, 14"),
  ],
  [
    "a second block with markers in another case and spacing",
    `${real}\n\n<!-- DOTLN-FINDINGS:START -->\n${second}\n<!--dotln-findings:end-->`,
    "pass",
    NEEDS_ONE("lines 1, 12", "lines 10, 14"),
  ],
  [
    "marker lines listed alone in inline code",
    `${real}\n\n- \`${START}\`\n- \`${END}\``,
    "pass",
    NEEDS_ONE("lines 1, 12", "lines 10, 13"),
  ],
  [
    "a start marker with no end",
    `${START}\n[]`,
    "pass",
    NEEDS_ONE("line 1", "no line"),
  ],
  [
    "an end marker with no start",
    `[]\n${END}`,
    "pass",
    NEEDS_ONE("no line", "line 2"),
  ],
  [
    "an end marker before its start",
    `${END}\n[]\n${START}`,
    "pass",
    NEEDS_ONE("line 3", "line 1"),
  ],
  [
    "a repeated start marker",
    `${START}\n${START}\n[]\n${END}`,
    "pass",
    NEEDS_ONE("lines 1, 2", "line 4"),
  ],
  [
    "a sentence that mentions the markers holds none",
    `The block opens with \`${START}\` and closes with \`${END}\`.`,
    "pass",
    "the report has no findings block",
  ],
  [
    "a sentence beside the block adds no marker",
    `The block opens with \`${START}\` and closes with \`${END}\`.\n\n${real}`,
    "pass",
    measured({ integration: 1 }),
    null,
  ],
  [
    "a quoted block is the block, and its quoted array is not JSON",
    `> ${START}\n> []\n> ${END}`,
    "pass",
    "the findings block is not valid JSON",
  ],
  [
    "the one block with markers in another case",
    `<!-- Dotln-Findings:Start -->\n${second}\n<!-- Dotln-Findings:End -->`,
    "fail",
    measured({ escape: 1 }),
    null,
  ],
  ["an empty block", block(""), "pass", "the findings block is not valid JSON"],
  [
    "a trailing comma",
    block('[{"id": "F1", "route": "blocking", "summary": "x"},]'),
    "fail",
    "the findings block is not valid JSON",
  ],
  [
    "prose inside the block",
    block("None."),
    "pass",
    "the findings block is not valid JSON",
  ],
  [
    "one object, not an array",
    block(JSON.stringify(entry("F1", "blocking", "escape"))),
    "fail",
    "the findings block is not a JSON array",
  ],
  ["null", block("null"), "pass", "the findings block is not a JSON array"],
  ["a string entry", block(["F1"]), "fail", ENTRY(1, "is not an object", "F1")],
  ["a null entry", block([null]), "fail", ENTRY(1, "is not an object", null)],
  ["an array entry", block([[]]), "fail", ENTRY(1, "is not an object", [])],
  ...[
    "R1",
    "F01",
    "F0",
    "f1",
    "F1.2",
    " F1",
    "Finding F1",
    "",
    1,
    null,
    undefined,
  ].map((id) => {
    const value = { ...entry("F1", "blocking", "escape"), id };
    return [
      `id ${JSON.stringify(id)}`,
      block([entry("F9", "blocking", "escape"), value]),
      "fail",
      ENTRY(2, NEEDS_ID, value),
    ];
  }),
  [
    "a repeated id",
    block([
      entry("F1", "blocking", "escape"),
      entry("F2", "blocking", "escape"),
      entry("F1", "follow-up", "integration"),
    ]),
    "fail",
    ENTRY(3, "repeats id F1", entry("F1", "follow-up", "integration")),
  ],
  ...[
    "Blocking",
    "major",
    "non-blocking",
    "blocking ",
    "",
    ["blocking"],
    undefined,
  ].map((route) => [
    `route ${JSON.stringify(route)}`,
    block([entry("F1", route, "escape")]),
    "pass",
    ENTRY(
      1,
      "needs a route blocking, follow-up, operator",
      entry("F1", route, "escape"),
    ),
  ]),
  ...[
    "",
    "  ",
    "two\nlines",
    "a\u2028b",
    "a\u0085b",
    "a\fb",
    "a\tb",
    5,
    null,
    undefined,
  ].map((summary) => {
    const value = { ...entry("F1", "blocking", "escape"), summary };
    return [
      `summary ${JSON.stringify(summary)}`,
      block([value]),
      "fail",
      ENTRY(1, "needs a one-line summary", value),
    ];
  }),
  [
    "a long entry is shown in part",
    block([long]),
    "pass",
    `entry 1 of the findings block needs a route blocking, follow-up, operator: ${JSON.stringify(long).slice(0, 120)}…`,
  ],
  [
    "a long entry is cut between characters, not inside one",
    block([astral]),
    "pass",
    `entry 1 of the findings block needs a route blocking, follow-up, operator: ${[...JSON.stringify(astral)].slice(0, 120).join("")}…`,
  ],
  [
    "the first problem decides: a counted entry before a bad one is not counted",
    block([entry("F1", "blocking"), entry("R1", "blocking", "escape")]),
    "fail",
    ENTRY(2, NEEDS_ID, entry("R1", "blocking", "escape")),
  ],
  ...[
    "Escape",
    "escape ",
    "unclassed",
    "escape|integration",
    "",
    null,
    7,
    ["escape"],
  ].map((label) => [
    `class ${JSON.stringify(label)}`,
    block([entry("F1", "blocking", label)]),
    "pass",
    measured({ unclassed: 1 }, [{ id: "F1", blocking: true }]),
    "blocking finding F1 has no class or one outside escape, integration, new-scope; counted as unclassed.",
  ]),
  [
    "one unclassed finding that does not block",
    block([entry("F1", "follow-up")]),
    "pass",
    measured({ unclassed: 1 }, [{ id: "F1", blocking: false }]),
    "finding F1 has no class or one outside escape, integration, new-scope; counted as unclassed.",
  ],
  [
    "blocking and other unclassed findings",
    block([
      entry("F1", "follow-up"),
      entry("F2", "operator", "typo"),
      entry("F3", "blocking", "wrong"),
      entry("F4", "blocking", "escape"),
    ]),
    "pass",
    measured({ escape: 1, unclassed: 3 }, [
      { id: "F1", blocking: false },
      { id: "F2", blocking: false },
      { id: "F3", blocking: true },
    ]),
    "blocking finding F3 and findings F1, F2 have no class or one outside escape, integration, new-scope; counted as unclassed.",
  ],
  [
    "a fenced array between the markers",
    block(
      `\n\`\`\`json\n${JSON.stringify([entry("F1", "blocking", "new-scope")])}\n\`\`\`\n`,
    ),
    "fail",
    measured({ "new-scope": 1 }),
    null,
  ],
  [
    "an entry on a fence line is not dropped",
    block(`[\n\`\`\`${JSON.stringify(entry("F1", "blocking", "escape"))}\n]`),
    "fail",
    "the findings block is not valid JSON",
  ],
  [
    "indented markers, CRLF and a byte-order mark",
    `\uFEFF  ${START}  \r\n[${JSON.stringify(entry("F2", "follow-up", "escape"))}]\r\n\t${END}\r\n`,
    "pass",
    measured({ escape: 1 }),
    null,
  ],
  [
    "lines ended by a bare carriage return",
    `${START}\r[${JSON.stringify(entry("F2", "follow-up", "escape"))}]\r${END}\r`,
    "pass",
    measured({ escape: 1 }),
    null,
  ],
  [
    "other keys are not read",
    block([
      { ...entry("F1", "blocking", "integration"), basis: "arose at merge." },
    ]),
    "fail",
    measured({ integration: 1 }),
    null,
  ],
  [
    "identifiers are compared as written",
    block([
      entry("F9007199254740992", "blocking", "escape"),
      entry("F9007199254740993", "blocking", "integration"),
    ]),
    "fail",
    measured({ escape: 1, integration: 1 }),
    null,
  ],
]) {
  const result = reviewFindings(text, { verdict });
  assert.deepEqual(
    result,
    typeof reading === "string" ? { measured: false, cause: reading } : reading,
    name,
  );
  assert.equal(
    findingsAdvisory(result),
    typeof reading === "string" ? UNMEASURED(reading) : advisory,
    name,
  );
}
// The carry-in sections, one row per input: [order number, the order's text
// from its line 5, what the briefing prints]. A `section` is printed under
// its label's line, the last line printed and what ended it, by default the
// `**Non-goals:**` line that follows every row's text; the other entries are
// advisories.
const layout = (n) => `docs/work-orders/WO-${n}-layout.md`;
const section = (lines, body, end) => ({ lines, body, end });
const UNREAD = (n, lines) =>
  `Advisory: ${layout(n)} ${lines.includes(",") ? `lines ${lines} start` : `line ${lines} starts`} with \`Known issue\` in a layout this briefing does not read; nothing is printed from ${lines.includes(",") ? "them" : "it"}.`;
const EMPTY = (line, end) => ({ empty: line, end });
const OPEN_FENCE = (n, line) =>
  `Advisory: ${layout(n)} line ${line} opens a code fence that never closes, so no Known issues label or order field after it is read; read the order from that line for carry-ins.`;
const KI = "**Known issues and carry-ins:**";
for (const [n, text, printed] of [
  // VER-001 F1: text on the label line (WO-123's layout), the colon outside,
  // a heading, a bold-led paragraph and a second section.
  [
    "901",
    `${KI} every duty this order owes that is not a\ncriterion, in one place:\n\n- first duty.\n- second duty.`,
    [
      section(
        "5-9",
        "every duty this order owes that is not a\ncriterion, in one place:\n\n- first duty.\n- second duty.",
      ),
    ],
  ],
  [
    "902",
    "**Known issues and carry-ins**: colon-outside sentinel.",
    [section("5", "colon-outside sentinel.")],
  ],
  [
    "903",
    "## Known issues and carry-ins:\n\n- heading sentinel.\n\n### Receipt 038\n\nsubheading sentinel.\n\n## Later\n\nafter sentinel.",
    [
      section(
        "5-11",
        "- heading sentinel.\n\n### Receipt 038\n\nsubheading sentinel.",
        "before line 13, ## Later",
      ),
    ],
  ],
  [
    "904",
    `${KI}\n\n**Receipt 038:** first-bold sentinel.`,
    [section("5-7", "**Receipt 038:** first-bold sentinel.")],
  ],
  [
    "905",
    `${KI} first section.\n\n**Deliverables:** between.\n\n${KI} second section.`,
    [
      section("5", "first section.", "before line 7, **Deliverables:**"),
      section("9", "second section."),
    ],
  ],
  // VER-002 F1: a quoted fence that never closes, before a top-level label.
  [
    "906",
    `> \`\`\`md\n> ${KI} hidden-example.\n\n${KI} visible-issue.`,
    [UNREAD(906, "6"), section("8", "visible-issue.")],
  ],
  // VER-002 R1: emphasis in the text after the label is that text's.
  [
    "907",
    `${KI} Investigate **critical failure**`,
    [section("5", "Investigate **critical failure**")],
  ],
  // VER-003 F1: a stray backtick on the line before the label hides nothing.
  [
    "908",
    `**Write-back duty:** a stray \` opener\n${KI} hidden whole line\nA stray \` closer`,
    [section("6-7", "hidden whole line\nA stray ` closer")],
  ],
  // VER-003 R3: a paragraph that starts with a bold field word stays.
  [
    "909",
    `${KI}\n\n**Design** for the repair: retain this paragraph.\n\n- later carry-in sentinel.`,
    [
      section(
        "5-9",
        "**Design** for the repair: retain this paragraph.\n\n- later carry-in sentinel.",
      ),
    ],
  ],
  // VER-004 F1: a wrapped line that starts with a field label continues its
  // paragraph, and the carry-in after it prints.
  [
    "910",
    `${KI}\n\n- Receipt 038: the order's estimate in the\n**Cost:** field was wrong; carry in its correction.\n- Receipt 040: second-sentinel.`,
    [
      section(
        "5-9",
        "- Receipt 038: the order's estimate in the\n**Cost:** field was wrong; carry in its correction.\n- Receipt 040: second-sentinel.",
      ),
    ],
  ],
  // A fenced example label is no label; a fence that never closes advises
  // and hides nothing that an open section holds.
  [
    "911",
    `\`\`\`md\n${KI} fenced-example.\n\`\`\`\n\n${KI} real.`,
    [section("9", "real.")],
  ],
  [
    "912",
    `${KI} before the fence.\n\n\`\`\`md\n**Design:** example in a fence.\n\n${KI} inside the fence.`,
    [
      OPEN_FENCE(912, 7),
      section(
        "5-12",
        `before the fence.\n\n\`\`\`md\n**Design:** example in a fence.\n\n${KI} inside the fence.\n\n**Non-goals:** after sentinel.`,
        "with the order",
      ),
    ],
  ],
  ["913", `~~~\nexample\n\n${KI} after an open fence.`, [OPEN_FENCE(913, 5)]],
  // Not quoted by a report. A fence closes only at its own character and
  // length: a shorter fence or a tilde line inside it is its text, so the
  // field label after them ends nothing.
  [
    "914",
    `${KI}\n\n- first carry-in:\n\n\`\`\`\`md\n\`\`\`md\n\n**Design:** example\n\`\`\`\n\`\`\`\`\n\n- second carry-in.`,
    [
      section(
        "5-16",
        "- first carry-in:\n\n````md\n```md\n\n**Design:** example\n```\n````\n\n- second carry-in.",
      ),
    ],
  ],
  [
    "915",
    `${KI}\n\n\`\`\`md\n~~~\n\n**Design:** example\n\`\`\`\n\n- after the fence.`,
    [
      section(
        "5-13",
        "```md\n~~~\n\n**Design:** example\n```\n\n- after the fence.",
      ),
    ],
  ],
  // A closing fence may be indented up to three spaces, so the label after
  // it is read and the later fence is its own.
  [
    "935",
    `**Design:** see:\n\`\`\`md\nexample\n  \`\`\`\n${KI} after an indented closer.\n\`\`\`js\ncode\n\`\`\``,
    [section("9-12", "after an indented closer.\n```js\ncode\n```")],
  ],
  // A line that opens with inline code opens no fence, so the field after
  // it ends the section.
  [
    "916",
    `${KI}\n\n\`\`\`npm test\`\`\` fails in this order.\n\n**Deliverables:** after sentinel.\n\n- not a carry-in.`,
    [
      section(
        "5-7",
        "```npm test``` fails in this order.",
        "before line 9, **Deliverables:**",
      ),
    ],
  ],
  // A fence behind a list marker or indentation is text, with its label.
  [
    "917",
    `- \`\`\`md\n  ${KI} example one.\n  \`\`\`\n\n${KI}\n\n- real carry-in.\n\n- \`\`\`md\n  **Design:** example two.\n  \`\`\``,
    [
      UNREAD(917, "6"),
      section(
        "9-15",
        "- real carry-in.\n\n- ```md\n  **Design:** example two.\n  ```",
      ),
    ],
  ],
  // The stated boundary: an indented fence is text, so a field label at the
  // start of a line inside it, after a blank line, ends the section. So does
  // any heading under a bold label. The header names the line that ended it.
  [
    "918",
    `${KI}\n\n- carry-in:\n\n \`\`\`md\n\n**Design:** at the start of a line.\n \`\`\`\n\n- not printed.`,
    [section("5-9", "- carry-in:\n\n ```md", "before line 11, **Design:**")],
  ],
  [
    "936",
    `${KI}\n\n- first.\n\n#### Carried from WO-150\n\n- not printed.`,
    [section("5-7", "- first.", "before line 9, #### Carried from WO-150")],
  ],
  [
    "938",
    `${KI} kept.\n\n## ${"x".repeat(80)}`,
    [section("5", "kept.", `before line 7, ## ${"x".repeat(57)}…`)],
  ],
  // A field ends the section only after a blank line, in each exact form.
  [
    "919",
    `${KI} kept.\n**Design:** the same paragraph, kept.\n\n**Design**: after sentinel.`,
    [
      section(
        "5-6",
        "kept.\n**Design:** the same paragraph, kept.",
        "before line 8, **Design**:",
      ),
    ],
  ],
  [
    "920",
    `${KI} kept.\n\n**Operator-review assumptions**\n\nafter.`,
    [section("5", "kept.", "before line 7, **Operator-review assumptions**")],
  ],
  [
    "921",
    `${KI} kept.\n\n**Acceptance criteria (all required)**  \n\nafter.`,
    [
      section(
        "5",
        "kept.",
        "before line 7, **Acceptance criteria (all required)**",
      ),
    ],
  ],
  [
    "922",
    `${KI} kept.\n\n**Design (scope discipline):** after.`,
    [section("5", "kept.", "before line 7, **Design (scope discipline):**")],
  ],
  [
    "923",
    `${KI} kept.\n\n# Later\n\nafter.`,
    [section("5", "kept.", "before line 7, # Later")],
  ],
  // No field: an unlisted label, underscores, indentation, a word after the
  // bold name, and a colon after a space.
  [
    "924",
    `${KI}\n\n**Design note:** unlisted.\n\n__Cost:__ underscores.\n\n  **Cost:** indented.\n\n**Cost** continues.\n\n**Cost :** spaced.`,
    [
      section(
        "5-15",
        "**Design note:** unlisted.\n\n__Cost:__ underscores.\n\n  **Cost:** indented.\n\n**Cost** continues.\n\n**Cost :** spaced.",
      ),
    ],
  ],
  // The label's other exact forms.
  [
    "925",
    "**Known issues and carry-ins**\n\n- bare sentinel.",
    [section("5-7", "- bare sentinel.")],
  ],
  [
    "926",
    "**Known issues and carry-ins (receipt 038):** parenthetical sentinel.",
    [section("5", "parenthetical sentinel.")],
  ],
  [
    "927",
    "### Known issues and carry-ins: Investigate **critical failure**",
    [section("5", "Investigate **critical failure**")],
  ],
  [
    "928",
    `${KI} first\u2028second sentinel.`,
    [section("5", "first\u2028second sentinel.")],
  ],
  ["929", KI, [EMPTY(5)]],
  [
    "930",
    `${KI}\n\n\n**Design:** after.`,
    [EMPTY(5, "before line 8, **Design:**")],
  ],
  // A label directly under a label leaves the first one empty, and says so.
  [
    "940",
    `## Known issues and carry-ins\n${KI}\n\n- under the second label.`,
    [
      EMPTY(5, `before line 6, ${KI}`),
      section("6-8", "- under the second label."),
    ],
  ],
  // Every other layout whose first letters are `Known issue(s)` advises
  // with its line, behind any marker and however the words are joined.
  [
    "931",
    `- ${KI} bulleted.\n\n> - > 1. ${KI} nested.\n\n__Known issues and carry-ins:__ underscores.\n\n**Known issues and carry-ins: none**\n\n**Known issue and carry-in:** singular.\n\nKnown issue, operator override: prose.\n\n  ${KI} indented.\n\n## Known issues and carry-ins for this order\n\n**Known issues and carry-ins** follow.`,
    [UNREAD(931, "5, 7, 9, 11, 13, 15, 17, 19, 21")],
  ],
  [
    "937",
    `##Known issues and carry-ins\n\n\u00a0${KI} no-break space.\n\n**Known  issues and carry-ins:** two spaces.\n\nKnown-issues: hyphen.\n\n| Known issues | in a table |\n\nUnknown issues are not flagged.\n\nKnowns issues neither.`,
    [UNREAD(937, "5, 7, 9, 11, 13")],
  ],
  // Inside a section such a line is its text and advises nothing.
  [
    "932",
    `${KI}\n\n- Known issues from receipt 038: kept.\n- ${KI} kept too.`,
    [
      section(
        "5-8",
        `- Known issues from receipt 038: kept.\n- ${KI} kept too.`,
      ),
    ],
  ],
  ["933", "No carry-ins are known for this order.", []],
]) {
  write(
    layout(n),
    `# WO-${n} — layout\n\n**Objective:** fixture.\n\n${text}\n\n**Non-goals:** after sentinel.\n`,
  );
  const tail = `before line ${6 + text.split("\n").length}, **Non-goals:**`;
  assert.equal(
    verificationKnownIssues(root, {
      workOrderId: `WO-${n}`,
      workOrderPath: layout(n),
    }),
    printed
      .map((row) =>
        typeof row === "string"
          ? row
          : row.empty
            ? `Advisory: ${layout(n)}:${row.empty} labels Known issues and carry-ins but holds no text; it ends ${row.end ?? tail}, and nothing is printed from it.`
            : `Known issues and carry-ins (${layout(n)}:${row.lines}; ends ${row.end ?? tail}):\n${row.body}`,
      )
      .map((row) => `\n\n${row}`)
      .join(""),
    n,
  );
}
// CRLF and bare carriage-return line ends read as LF ones.
for (const [n, eol] of [
  [934, "\r\n"],
  [939, "\r"],
]) {
  write(
    layout(n),
    [
      `# WO-${n}`,
      "",
      KI,
      "",
      "- first.",
      "- second.",
      "",
      "**Non-goals:** after.",
      "",
    ].join(eol),
  );
  assert.equal(
    verificationKnownIssues(root, {
      workOrderId: `WO-${n}`,
      workOrderPath: layout(n),
    }),
    `\n\nKnown issues and carry-ins (${layout(n)}:3-6; ends before line 8, **Non-goals:**):\n- first.\n- second.`,
  );
}
// The handoff's self-review line, one row per form: [the handoff's text after
// its criterion line, whether the missing-line advisory prints].
for (const [text, advised] of [
  ["self-review: found 0; fixed 0; recorded 0", false],
  [
    "self-review: found 12; fixed 10; recorded 2 (dotln-worker; see review.md)",
    false,
  ],
  ["self-review: found 1; fixed 1; recorded 0.", false],
  ["- self-review: found 1; fixed 1; recorded 0.", false],
  ["* self-review: found 1; fixed 1; recorded 0", false],
  ["+ self-review: found 1; fixed 1; recorded 0", false],
  ["1. self-review: found 1; fixed 1; recorded 0", false],
  ["2) self-review: found 1; fixed 1; recorded 0", false],
  ["Notes.\r\nself-review: found 1; fixed 1; recorded 0\r\nMore.", false],
  ["Notes.\rself-review: found 1; fixed 1; recorded 0\rMore.", false],
  // The line is read wherever it stands; a copy in a fence is the line too.
  ["```md\nself-review: found 0; fixed 0; recorded 0\n```", false],
  ["", true],
  ["No review ran.", true],
  ["**self-review:** found 1; fixed 1; recorded 0.", true],
  ["**self-review**: found 1; fixed 1; recorded 0.", true],
  ["- **Self-review:** found 1; fixed 1; recorded 0.", true],
  ["> self-review: found 1; fixed 1; recorded 0.", true],
  ["- > self-review: found 1; fixed 1; recorded 0.", true],
  ["  self-review: found 1; fixed 1; recorded 0", true],
  ["-self-review: found 1; fixed 1; recorded 0", true],
  ["Self-review: found 1; fixed 1; recorded 0", true],
  ["`self-review:` found 1; fixed 1; recorded 0", true],
  ["The self-review: found 1; fixed 1; recorded 0", true],
  ["self-review (dotln-worker): found 1; fixed 1; recorded 0", true],
  ["self-review:found 1; fixed 1; recorded 0", true],
  ["self-review:  found 1; fixed 1; recorded 0", true],
  ["self-review: found 1, fixed 1, recorded 0", true],
  ["self-review: found one; fixed one; recorded none", true],
  ["self-review: found **1**; fixed 1; recorded 0", true],
  ["self-review: found 1; fixed 1", true],
  ["self-review: found 1; fixed 1; recorded", true],
  ["self-review: found 1; fixed 1; recorded 0x", true],
  ["self-review: fixed 1; found 1; recorded 0", true],
  ["self-review: found 1;\nfixed 1; recorded 0", true],
  ["self-review: none ran.", true],
]) {
  write(ledger, `**Criterion 1:** met. Read.\n${text}\n`);
  assert.deepEqual(
    readHandoffLedger(root, {
      workOrderId: "WO-187",
      workOrderPath: "docs/work-orders/WO-187-fixture.md",
    }).advisories,
    advised ? [SELF_REVIEW_ADVISORY(ledger)] : [],
    text,
  );
}
// The real lifecycle records every block outcome without refusing a result,
// from the nested docs directory and from the root: [order, verdict, the
// report's findings, the advisory, the recorded counts].
for (const [n, verdict, findings, advisory, counts] of [
  ["811", "pass", block([]), null, zero],
  ["812", "fail", block([]), UNMEASURED(NO_BLOCKING)],
  [
    "813",
    "pass",
    `${block([])}\n\n> ${START}\n> ${second}\n> ${END}`,
    UNMEASURED(NEEDS_ONE("lines 9, 13", "lines 11, 15")),
  ],
  [
    "814",
    "fail",
    block("[{'id': 'F1'}]"),
    UNMEASURED("the findings block is not valid JSON"),
  ],
  [
    "815",
    "pass",
    block([
      entry("F1", "follow-up", "escape"),
      entry("F1", "follow-up", "escape"),
    ]),
    UNMEASURED(ENTRY(2, "repeats id F1", entry("F1", "follow-up", "escape"))),
  ],
  // A partly valid failed block records no count, never the valid part's.
  [
    "816",
    "fail",
    block([
      entry("F1", "blocking", "escape"),
      entry("R1", "blocking", "escape"),
    ]),
    UNMEASURED(ENTRY(2, NEEDS_ID, entry("R1", "blocking", "escape"))),
  ],
  [
    "817",
    "pass",
    block([
      entry("F1", "follow-up"),
      entry("F2", "operator", "typo"),
      entry("F3", "blocking", "wrong"),
    ]),
    "blocking finding F3 and findings F1, F2 have no class or one outside escape, integration, new-scope; counted as unclassed.",
    { ...zero, unclassed: 3 },
  ],
  ["818", "pass", prose, UNMEASURED("the report has no findings block")],
  // A failed review that declares only a follow-up, its blocking finding in
  // prose, records no count.
  ["819", "fail", `${prose}\n\n${real}`, UNMEASURED(NO_BLOCKING)],
]) {
  const workOrderId = `WO-${n}`;
  const workOrderPath = `docs/work-orders/${workOrderId}-block.md`;
  write(
    workOrderPath,
    `# ${workOrderId} — block\n\n**Model:** any.\n**Effort:** executor any; verifier any; reviewer any.\n\n**Acceptance criteria (all required)**\n\n1. Read.\n\n${KI} lifecycle-issue.\n\n**Non-goals:** after.\n`,
  );
  const cwd = Number(n) % 2 ? join(root, "docs") : root;
  const selectedCall = (args) =>
    call([...args, "--work-order", workOrderId], cwd);
  const reportPath = `docs/final-reviews/${workOrderId}/FINAL-001.md`;
  write(
    `docs/evidence/${workOrderId}/handoff.md`,
    "**Criterion 1:** met. Read.\n\nself-review: found 2; fixed 2; recorded 0 (`worker`)\n",
  );
  selectedCall(["activate", workOrderId, workOrderPath]);
  assert.ok(
    !selectedCall(["implementation-ready", ...flags]).stderr.includes(
      "self-review",
    ),
  );
  assert.ok(
    selectedCall(["verify"]).stdout.includes(
      `Known issues and carry-ins (${workOrderPath}:10; ends before line 12, **Non-goals:**):\nlifecycle-issue.`,
    ),
  );
  report(`docs/verifications/${workOrderId}/VER-001.md`);
  selectedCall(["verification-result", "pass", ...flags]);
  selectedCall(["final-review"]);
  report(reportPath, findings);
  recorded(
    selectedCall(["final-review-result", verdict, ...flags]),
    reportPath,
    advisory,
    counts,
    verdict,
    workOrderId,
  );
}
console.log(
  "WO-187 verification briefing, completion advisories, finding classes and planning counts passed",
);
