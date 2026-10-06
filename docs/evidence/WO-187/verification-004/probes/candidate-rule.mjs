// Probe a candidate repair rule without editing the implementation: checkpoint 11's broad
// detector (route word and class field anywhere), restricted only so a route word must
// precede the class field. Applied to every uncounted, unfenced line of the current reader.
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
const [root] = process.argv.slice(2);
const cur = await import(join(root, "scripts/lib/review-findings.mjs"));
const CLASS_FIELD = /\bclass[*_`\s]*:/iu;
const candidate = (prose) => {
  const m = /\b(?:blocking|follow-up|operator)\b/iu.exec(prose);
  return Boolean(m && CLASS_FIELD.test(prose.slice(m.index)));
};
// Lines the current reader leaves uncounted: compare the counted set with every unfenced line.
const flagged = (text, verdict) => {
  const r = cur.reviewFindings(text, { verdict });
  const extra = [];
  for (const { prose, fenced, number } of cur.markdownLines(text)) {
    if (fenced) continue;
    const solo = cur.reviewFindings(prose, { verdict: "pass" });
    if (solo.found === 0 && candidate(prose.replace(/`/gu, "")))
      extra.push(number);
  }
  return { measuredNow: r.measured, candidateFlags: extra };
};
const control = "**Finding F1:** blocking; class: escape; counted control.\n\n";
const cases = {
  issueLabel: control + "**Issue 1:** blocking; class: escape; second defect.",
  hashLabel:
    control + "**Finding #2:** blocking; class: escape; second defect.",
  letterLabel:
    control + "**Defect A:** blocking; class: integration; second defect.",
  decimalLabel:
    control + "**Finding F2.1:** blocking; class: escape; second defect.",
  spacedLabel: control + "**F 2:** blocking; class: escape; second defect.",
  routeField:
    control + "**R1:** route: blocking; class: escape; second defect.",
  recapWithClass:
    control +
    "**Finding F3:** F1's repair regressed the briefing; blocking; class: escape.",
  ver002Form: control + "**R1:** blocking; class: typo; second.",
  classFirst: control + "**R1:** class: escape; blocking; second defect.",
  basisSubBullet:
    "- **Finding F1:** blocking; class: escape; the reader drops a line.\n  - Basis for class: present in the subject VER-002 judged; blocking because criterion 4.",
  wo186Final002: readFileSync(
    join(root, "docs/final-reviews/WO-186/FINAL-002.md"),
    "utf8",
  ),
};
const out = {};
for (const [k, text] of Object.entries(cases)) out[k] = flagged(text, "pass");
let corpusFlagged = [];
const fr = join(root, "docs/final-reviews");
for (const d of readdirSync(fr)) {
  if (!/^WO-/.test(d)) continue;
  for (const f of readdirSync(join(fr, d))) {
    if (!/^FINAL-\d{3}\.md$/.test(f)) continue;
    const r = flagged(readFileSync(join(fr, d, f), "utf8"), "pass");
    if (r.candidateFlags.length)
      corpusFlagged.push(`${d}/${f}:${r.candidateFlags}`);
  }
}
out.realCorpusReportsTheCandidateWouldFlag = corpusFlagged;
console.log(JSON.stringify(out, null, 1));
