// The repaired readers over the real corpus: every order's carry-in briefing against the
// pre-repair reader, and every filed final-review report.
// node corpus.mjs <worktree> <pre-repair copy holding scripts/lib>
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
const [root, base] = process.argv.slice(2);
const cur = await import(join(root, "scripts/lib/verification-briefing.mjs"));
const old = await import(join(base, "scripts/lib/verification-briefing.mjs"));
const { reviewFindings } = await import(
  join(root, "scripts/lib/review-findings.mjs")
);
const out = {
  at: new Date().toISOString(),
  orders: 0,
  carryInSections: 0,
  sectionsNotWhole: [],
  bodyChangesAgainstPreRepair: [],
  advisories: [],
  headers: [],
  finalReports: 0,
  finalReportReadings: {},
  recordedEventsWithCounts: 0,
};
const wo = join(root, "docs/work-orders");
// The header now names the printed lines and what ended the section; everything
// else is compared byte for byte.
const strip = (text) =>
  text.replace(
    /^(Known issues and carry-ins \(\S+?:\d+)(?:-\d+)?; ends .*\):$/gmu,
    "$1):",
  );
for (const file of readdirSync(wo)) {
  const id = /^(WO-\d+)-.*\.md$/u.exec(file)?.[1];
  if (!id) continue;
  out.orders++;
  const state = { workOrderId: id, workOrderPath: `docs/work-orders/${file}` };
  const now = cur.verificationKnownIssues(root, state);
  const before = old.verificationKnownIssues(root, state);
  const headers = now.match(/^Known issues and carry-ins \(.*$/gmu) ?? [];
  out.carryInSections += headers.length;
  out.headers.push(...headers);
  if (strip(now) !== strip(before))
    out.bodyChangesAgainstPreRepair.push({ order: id, now, before });
  for (const line of now.split("\n"))
    if (line.startsWith("Advisory")) out.advisories.push(line);
  // Whole: a section holds exactly the order's lines from its label to the
  // line before the next bold label or heading at the start of a line.
  const source = readFileSync(join(wo, file), "utf8").split(/\r?\n/u);
  for (const { line, lines } of cur.knownIssueSections(source.join("\n"))
    .sections) {
    const next = source.findIndex(
      (text, index) =>
        index >= line && /^(?:\*\*[^*]+(?::\*\*|\*\*:?)|#{1,6} )/u.test(text),
    );
    const expected = source.slice(line, next < 0 ? undefined : next);
    if (JSON.stringify(lines.slice(1)) !== JSON.stringify(expected))
      out.sectionsNotWhole.push({ order: id, line });
  }
}
// No filed report holds a findings block, so each reads unmeasured with one
// cause; the recorded events, which planning reads, are not re-read.
const reviews = join(root, "docs/final-reviews");
for (const order of readdirSync(reviews)) {
  if (!/^WO-\d+$/u.test(order)) continue;
  for (const file of readdirSync(join(reviews, order))) {
    if (!/^FINAL-\d{3}\.md$/u.test(file)) continue;
    out.finalReports++;
    const reading = reviewFindings(
      readFileSync(join(reviews, order, file), "utf8"),
      { verdict: "fail" },
    );
    const key = reading.measured ? "measured" : reading.cause;
    out.finalReportReadings[key] = (out.finalReportReadings[key] ?? 0) + 1;
  }
}
const logs = join(root, "docs/control/orders");
for (const file of readdirSync(logs))
  for (const line of readFileSync(join(logs, file), "utf8").split("\n"))
    if (
      line.includes('"FinalReviewCompleted"') &&
      line.includes('"findingCounts"')
    )
      out.recordedEventsWithCounts++;
console.log(JSON.stringify(out, null, 1));
