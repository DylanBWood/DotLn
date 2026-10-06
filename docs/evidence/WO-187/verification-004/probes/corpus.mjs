// Compare current readers with checkpoint 11 (VER-003's subject) over the real corpus.
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
const [root, base] = process.argv.slice(2);
const cur = await import(join(root, "scripts/lib/review-findings.mjs"));
const old = await import(join(base, "scripts/lib/review-findings.mjs"));
const curB = await import(join(root, "scripts/lib/verification-briefing.mjs"));
const oldB = await import(join(base, "scripts/lib/verification-briefing.mjs"));
const verdicts = new Map();
const logs = join(root, "docs/control/orders");
for (const f of readdirSync(logs))
  for (const l of readFileSync(join(logs, f), "utf8").split("\n"))
    if (l.includes('"FinalReviewCompleted"')) {
      const e = JSON.parse(l);
      verdicts.set(e.reportPath, e.verdict);
    }
const out = {
  finals: 0,
  eventVerdict: 0,
  diffs: [],
  unmeasuredNow: [],
  orders: 0,
  briefingDiffs: [],
};
const fr = join(root, "docs/final-reviews");
for (const d of readdirSync(fr)) {
  if (!existsSync(join(fr, d)) || !/^WO-/.test(d)) continue;
  for (const f of readdirSync(join(fr, d))) {
    if (!/^FINAL-\d{3}\.md$/.test(f)) continue;
    const rel = `docs/final-reviews/${d}/${f}`;
    const text = readFileSync(join(root, rel), "utf8");
    out.finals++;
    const v = verdicts.get(rel);
    if (v) out.eventVerdict++;
    for (const verdict of v ? [v] : ["pass", "fail"]) {
      const a = cur.reviewFindings(text, { verdict });
      const b = old.reviewFindings(text, { verdict });
      const strip = (r) =>
        JSON.stringify({
          c: r.counts,
          m: r.measured,
          f: r.found,
          u: r.unrecognised,
        });
      if (strip(a) !== strip(b))
        out.diffs.push({ rel, verdict, now: a, cp11: b });
      if (!a.measured)
        out.unmeasuredNow.push({
          rel,
          verdict,
          unrecognised: a.unrecognised,
          found: a.found,
        });
    }
  }
}
const wo = join(root, "docs/work-orders");
for (const f of readdirSync(wo)) {
  const m = /^(WO-\d+)-.*\.md$/.exec(f);
  if (!m) continue;
  out.orders++;
  const state = { workOrderId: m[1], workOrderPath: `docs/work-orders/${f}` };
  let a, b;
  try {
    a = curB.verificationKnownIssues(root, state);
  } catch (e) {
    a = `THROW ${e.message}`;
  }
  try {
    b = oldB.verificationKnownIssues(root, state);
  } catch (e) {
    b = `THROW ${e.message}`;
  }
  if (a !== b)
    out.briefingDiffs.push({
      order: m[1],
      now: a.slice(0, 1500),
      cp11: b.slice(0, 1500),
    });
  if (/Advisory/.test(a))
    out.briefingAdvisories = [
      ...(out.briefingAdvisories ?? []),
      {
        order: m[1],
        adv: a.split("\n").filter((x) => x.startsWith("Advisory")),
      },
    ];
}
out.carryInSections = 0;
for (const f of readdirSync(wo)) {
  const m = /^(WO-\d+)-.*\.md$/.exec(f);
  if (!m) continue;
  const a = curB.verificationKnownIssues(root, {
    workOrderId: m[1],
    workOrderPath: `docs/work-orders/${f}`,
  });
  out.carryInSections += (
    a.match(/^Known issues and carry-ins \(/gmu) ?? []
  ).length;
}
console.log(JSON.stringify(out, null, 1));
