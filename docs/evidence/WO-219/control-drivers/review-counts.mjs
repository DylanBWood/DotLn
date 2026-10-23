import { resolve, join } from "node:path";
import { pathToFileURL } from "node:url";
const root = resolve(process.argv[2] ?? ".");
const { readControl } = await import(
  pathToFileURL(join(root, "scripts/lib/control-store.mjs"))
);
const { finalReviewFindings } = await import(
  pathToFileURL(join(root, "scripts/lib/plan-failures.mjs"))
);
const { reviewFindings } = await import(
  pathToFileURL(join(root, "scripts/lib/review-findings.mjs"))
);
const control = readControl(root),
  summary = finalReviewFindings(control);
const block = (entries) =>
  `<!-- dotln-findings:start -->\n${JSON.stringify(entries)}\n<!-- dotln-findings:end -->`;
const route = reviewFindings(
  block([
    {
      id: "F1",
      route: "Blocking",
      class: "escape",
      summary: "A bounded finding.",
    },
  ]),
  { verdict: "fail" },
);
const mixed = reviewFindings(
  block([
    { id: "F1", route: "blocking", summary: "A classless blocking finding." },
    { id: "F2", route: "follow-up", class: "escape", summary: "" },
  ]),
  { verdict: "fail" },
);
const all = [...control.eventSegments].flatMap(([path, events]) =>
  events.flatMap((event, index) =>
    event.type === "FinalReviewCompleted"
      ? [{ event, path, ordinal: index + 1 }]
      : [],
  ),
);
all.sort((a, b) =>
  (b.event.recordedAt ?? "").localeCompare(a.event.recordedAt ?? ""),
);
const recentOrders = [
  ...new Set(all.map(({ event }) => event.workOrderId)),
].slice(0, 10);
const recent = all.filter(({ event }) =>
  recentOrders.includes(event.workOrderId),
);
const sinceD045 = all.filter(
  ({ event }) => (event.recordedAt ?? "") >= "2026-10-06",
);
const unmeasuredSinceD045 = sinceD045.filter(
  ({ event }) =>
    !["escape", "integration", "new-scope", "unclassed"].every(
      (key) =>
        Number.isSafeInteger(event.findingCounts?.[key]) &&
        event.findingCounts[key] >= 0,
    ),
);
const checks = {
  noRecordedUnmeasuredReviewSinceD045: unmeasuredSinceD045.length === 0,
  recentWindowFullyMeasured:
    summary.recent.reviews > 0 &&
    summary.recent.measured === summary.recent.reviews,
  malformedRouteRemainsUnmeasured: route.measured === false,
  malformedSummaryDoesNotCreateAPartialCount: mixed.measured === false,
};
console.log(
  JSON.stringify({
    sinceD045: {
      reviews: sinceD045.length,
      unmeasured: unmeasuredSinceD045.length,
    },
    recent: summary.recent,
    orders: recentOrders,
    records: recent.map(({ event, path, ordinal }) => ({
      order: event.workOrderId,
      verdict: event.verdict,
      findingCounts: event.findingCounts ?? null,
      path,
      ordinal,
    })),
    strictControls: { route: route.cause, mixed: mixed.cause },
    checks,
  }),
);
if (Object.values(checks).some((value) => !value)) process.exitCode = 1;
