// VER-004's recorded inputs (F1, D039 and D040) read by the repaired readers and by
// the pre-repair readers: node reproductions.mjs <worktree> <pre-repair copy of the worktree's scripts/lib parent>
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
const [root, base] = process.argv.slice(2);
const load = async (from, name) => import(join(from, "scripts/lib", name));
const now = {
  findings: await load(root, "review-findings.mjs"),
  briefing: await load(root, "verification-briefing.mjs"),
};
const before = {
  findings: await load(base, "review-findings.mjs"),
  briefing: await load(base, "verification-briefing.mjs"),
};
const control = "**Finding F1:** blocking; class: escape; counted control.\n\n";
// The eight finding-shaped lines VER-004 F1 records, after a counted control.
const lines = {
  issueLabel: "**Issue 1:** blocking; class: escape; second defect.",
  hashLabel: "**Finding #2:** blocking; class: escape; second defect.",
  letterLabel: "**Defect A:** blocking; class: integration; second defect.",
  decimalLabel: "**Finding F2.1:** blocking; class: escape; second defect.",
  spacedLabel: "**F 2:** blocking; class: escape; second defect.",
  routeField: "**R1:** route: blocking; class: escape; second defect.",
  classFirst: "**R1:** class: escape; blocking; second defect.",
  recapWithClass:
    "**Finding F3:** F1's repair regressed the briefing; blocking; class: escape.",
};
// D040's further reader observations.
const more = {
  strayBeforeExample:
    "**Verdict:** pass. A ` stray tick here.\n`**Finding F9:** blocking; class: escape; <finding>` is the form.",
  hiddenRoute:
    "**Finding F1:** ` follow-up; class: new-scope; tick opened here.\nthe closer ` is on the next line.",
  underscoreRoute: "**Finding F1:** _blocking_; class: escpae; defect.",
  bareCarriageReturn:
    "**Finding F1:** blocking; class: escape; a.\r**Finding F2:** blocking; class: integration; b.",
  basisProse:
    "Basis: blocking because criterion 4 fails; class: escape since VER-002 judged this subject.",
  unclosedFence:
    "```md\n**Finding F1:** blocking; class: escape; after an unclosed fence.",
};
const block = (entries) =>
  `<!-- dotln-findings:start -->\n${JSON.stringify(entries, null, 2)}\n<!-- dotln-findings:end -->`;
const out = {
  at: new Date().toISOString(),
  findings: {},
  sameFindingsInTheBlock: {},
  carryIn: {},
};
const old = (text, verdict) => {
  const r = before.findings.reviewFindings(text, { verdict });
  return {
    counts: r.counts,
    measured: r.measured,
    unrecognised: r.unrecognised,
  };
};
for (const [name, line] of Object.entries({ ...lines, ...more }))
  for (const verdict of ["pass", "fail"]) {
    const text = name in lines ? control + line : line;
    const reading = now.findings.reviewFindings(text, { verdict });
    out.findings[`${name}/${verdict}`] = {
      now: reading,
      advisory: now.findings.findingsAdvisory(reading)?.slice(0, 80),
      before: old(text, verdict),
    };
  }
// The same two findings declared in the block count, whatever prose surrounds them.
for (const [name, line] of Object.entries(lines)) {
  const reading = now.findings.reviewFindings(
    `${control}${line}\n\n${block([
      {
        id: "F1",
        route: "blocking",
        class: "escape",
        summary: "counted control.",
      },
      {
        id: "F2",
        route: "blocking",
        class: /integration/u.test(line) ? "integration" : "escape",
        summary: "second defect.",
      },
    ])}`,
    { verdict: "fail" },
  );
  out.sameFindingsInTheBlock[name] = reading;
}
// VER-004 F1, criterion 2: a wrapped line that starts with an order field label.
const order =
  "# WO-902 — probe\n\n**Known issues and carry-ins:**\n\n- Receipt 038: the order's estimate in the\n**Cost:** field was wrong; carry in its correction.\n- Receipt 040: second-sentinel.\n\n**Non-goals:** after.\n";
const state = {
  workOrderId: "WO-902",
  workOrderPath: "docs/work-orders/WO-902-probe.md",
};
const brief = (reader) => {
  // Both readers take the order through the authority path; read it from a
  // scratch root that holds only this order.
  const scratch = mkdtempSync(join(tmpdir(), "wo187-repro-"));
  mkdirSync(join(scratch, "docs/work-orders"), { recursive: true });
  writeFileSync(join(scratch, state.workOrderPath), order);
  return reader.verificationKnownIssues(scratch, state);
};
out.carryIn.now = brief(now.briefing);
out.carryIn.before = brief(before.briefing);
out.carryIn.secondCarryInPrinted = {
  now: out.carryIn.now.includes("Receipt 040: second-sentinel."),
  before: out.carryIn.before.includes("Receipt 040: second-sentinel."),
};
console.log(JSON.stringify(out, null, 1));
