import { join } from "node:path";
const [root, base] = process.argv.slice(2);
const cur = await import(join(root, "scripts/lib/review-findings.mjs"));
const old = await import(join(base, "scripts/lib/review-findings.mjs"));
const cp8 = await import(
  join(base, "../cp8/scripts/lib/review-findings.mjs")
).catch(() => null);
const short = (r) =>
  `${
    Object.entries(r.counts)
      .filter(([, n]) => n)
      .map(([k, n]) => `${k}=${n}`)
      .join(",") || "none"
  } found=${r.found} unrec=[${r.unrecognised}] measured=${r.measured} ub=[${r.unclassedBlocking}]`;
const cases = {
  // a stray backtick on the line before a genuine single-line example of the format
  strayBeforeExample: [
    "pass",
    "The reader takes `npm test -- --review output.\n`**Finding F1:** blocking; class: escape; <finding>` is the canonical form.",
  ],
  strayBeforeExampleControl: [
    "pass",
    "The reader takes npm test output.\n`**Finding F1:** blocking; class: escape; <finding>` is the canonical form.",
  ],
  // genuine two-line inline example (D028 shape)
  genuineMultiline: [
    "pass",
    "Write `**Finding F1:** blocking;\nclass: escape; x` as one line.",
  ],
  // class value hidden by a span across lines
  classHidden: [
    "fail",
    "**Finding F1:** blocking; class: `escape\n**Finding F2:** blocking; class: integration`",
  ],
  // escaped backtick before label line
  escaped: [
    "fail",
    "A literal \\` here.\n**Finding F1:** blocking; class: escape; `x` ok.",
  ],
  // double-backtick run across lines
  doubleRun: [
    "fail",
    "Run ``npm test\n**Finding F1:** blocking; class: escape; ``y``.",
  ],
  // lazy quote continuation
  lazyQuote: [
    "fail",
    "> a `stray\n**Finding F1:** blocking; class: escape; `x` z.",
  ],
  // list item continuation
  listCont: [
    "fail",
    "- a `stray\n  **Finding F1:** blocking; class: escape; `x` z.",
  ],
  // explicit route precedence and narrative class
  narrativeClass: [
    "pass",
    "**Finding F1:** follow-up; class: escape; the old `class: integration` form and blocking words.",
  ],
  routeInParen: ["pass", "**Finding F1 (blocking):** class: escape; prose."],
  leadingZero: [
    "fail",
    "**Finding F01:** blocking; class: escape; a.\n\n**Finding F1:** blocking; class: escape; b.",
  ],
  zeroId: [
    "fail",
    "**Finding F0:** blocking; class: escape; a.\n\n**Finding F00:** blocking; class: integration; b.",
  ],
  // prose a summary line might carry: count word then route then class field
  summaryProse: [
    "pass",
    "Two blocking findings, both class: escape, were fixed in place.",
  ],
  verdictLine: ["pass", "**Verdict:** pass; no blocking finding; class: none."],
  basisAfter: [
    "pass",
    "Basis: class: escape because the subject held it; blocking for criterion 4.",
  ],
};
for (const [k, [verdict, text]] of Object.entries(cases))
  console.log(
    `${k} (${verdict})\n  now : ${short(cur.reviewFindings(text, { verdict }))}\n  cp11: ${short(old.reviewFindings(text, { verdict }))}${cp8 ? `\n  cp8 : ${short(cp8.reviewFindings(text, { verdict }))}` : ""}`,
  );
