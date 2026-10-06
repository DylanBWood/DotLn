// Root reproduction of the fresh adversary's F2 and the other items routed in VER-004.
import { join } from "node:path";
import { mkdirSync, writeFileSync, rmSync } from "node:fs";
const [root, base, scratch] = process.argv.slice(2);
const cur = await import(join(root, "scripts/lib/review-findings.mjs"));
const old = await import(join(base, "scripts/lib/review-findings.mjs"));
const curB = await import(join(root, "scripts/lib/verification-briefing.mjs"));
const oldB = await import(join(base, "scripts/lib/verification-briefing.mjs"));
const short = (r) =>
  `${
    Object.entries(r.counts)
      .filter(([, n]) => n)
      .map(([k, n]) => `${k}=${n}`)
      .join(",") || "none"
  } found=${r.found} unrec=[${r.unrecognised}] measured=${r.measured} ub=[${r.unclassedBlocking}]`;
const control = "**Finding F1:** blocking; class: escape; counted control.\n\n";
const f2 = {
  issueLabel: "**Issue 1:** blocking; class: escape; second defect.",
  hashLabel: "**Finding #2:** blocking; class: escape; second defect.",
  letterLabel: "**Defect A:** blocking; class: integration; second defect.",
  decimalLabel: "**Finding F2.1:** blocking; class: escape; second defect.",
  spacedLabel: "**F 2:** blocking; class: escape; second defect.",
  routeField: "**R1:** route: blocking; class: escape; second defect.",
  classFirst: "**R1:** class: escape; blocking; second defect.",
  recapWithClass:
    "**Finding F3:** F1's repair regressed the briefing; blocking; class: escape.",
  ver002Form: "**R1:** blocking; class: typo; second.",
};
const out = {};
for (const [k, line] of Object.entries(f2))
  for (const verdict of ["pass", "fail"]) {
    const text = control + line;
    out[`${k}/${verdict}`] = {
      now: short(cur.reviewFindings(text, { verdict })),
      cp11: short(old.reviewFindings(text, { verdict })),
    };
  }
const other = {
  F1reverse: [
    "pass",
    "**Verdict:** pass. A ` stray tick here.\n`**Finding F9:** blocking; class: escape; <finding>` is the form.",
  ],
  F3basis: [
    "pass",
    control +
      "Basis: blocking because criterion 4 fails; class: escape since VER-002 judged this subject.",
  ],
  F3followup: [
    "pass",
    control + "Follow-up items carry no class: they are boarded.",
  ],
  F4hiddenRouteFail: [
    "fail",
    "**Finding F1:** ` follow-up; class: new-scope; tick opened here.\nthe closer ` is on the next line.",
  ],
  F5underscore: ["pass", "**Finding F1:** _blocking_; class: escpae; defect."],
  F5underscoreNoClass: ["pass", "**Finding F1:** _follow-up_; boarded."],
  F7fieldZero: [
    "pass",
    "**Finding F2:** blocking — the fixture should have used class: integration; it was in VER-002's subject.",
  ],
  F8paren: [
    "pass",
    "**Finding F2 (follow-up):** blocking the release is not needed; class: typo.",
  ],
  F12bareCR: [
    "fail",
    "**Finding F1:** blocking; class: escape; a.\r**Finding F2:** blocking; class: integration; b.",
  ],
};
for (const [k, [verdict, text]] of Object.entries(other))
  out[k] = {
    verdict,
    now: short(cur.reviewFindings(text, { verdict })),
    cp11: short(old.reviewFindings(text, { verdict })),
  };
const brief = (mod, order) => {
  const dir = join(scratch, "root-" + Math.random().toString(36).slice(2));
  mkdirSync(join(dir, "docs/work-orders"), { recursive: true });
  writeFileSync(join(dir, "docs/work-orders/WO-902-probe.md"), order);
  try {
    return mod.verificationKnownIssues(dir, {
      workOrderId: "WO-902",
      workOrderPath: "docs/work-orders/WO-902-probe.md",
    });
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
};
const f6 =
  "# WO-902 — probe\n\n**Known issues and carry-ins:**\n\n- Receipt 038: the order's estimate in the\n**Cost:** field was wrong; carry in its correction.\n- Receipt 040: second-sentinel.\n\n**Non-goals:** after-sentinel.";
out.F6 = { now: brief(curB, f6), cp11: brief(oldB, f6) };
const f10 =
  "# WO-902 — probe\n\n**Evidence gate:** run:\n\n```sh\nnpm test\n\n**Known issues and carry-ins:**\n\n- Receipt 038: fenced-sentinel.\n";
out.F10 = { now: brief(curB, f10), cp11: brief(oldB, f10) };
console.log(JSON.stringify(out, null, 1));
