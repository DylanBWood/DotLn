// Final review of WO-276: does a dollar figure in each of two header fields
// hide the field label that stands between them? The current reader is run
// beside the base's (the order index's parseHeader at HEAD, extracted with
// `git archive` into scratch by argv[2]).
import { pathToFileURL } from "node:url";
import { join } from "node:path";
const root = process.cwd();
const base = process.argv[2];
const load = (from, path) => import(pathToFileURL(join(from, path)).href);
const { readWorkOrder } = await load(
  root,
  "scripts/lib/work-order-document.mjs",
);
const now = await load(root, "scripts/work-orders.mjs");
const before = await load(base, "scripts/work-orders.mjs");
const order = (cost, classification, track = "machinery") =>
  `# WO-999 — Fixture (v1.0.0)\n\n**Model:** any.\n**Effort:** executor any.\n**Cost:** ${cost}\n**Release classification:** ${classification}\n**Track:** ${track}\n\n**Objective:** The objective.\n`;
const cases = {
  "no dollar figure": order("one session.", "minor."),
  "a dollar figure in one field": order("about $5 of tokens.", "minor."),
  "a dollar figure in two fields": order(
    "about $5 of tokens.",
    "minor. A run costs $6 more.",
  ),
};
const rows = {};
for (const [name, text] of Object.entries(cases)) {
  const path = "docs/work-orders/WO-999-fixture.md";
  const current = now.parseHeader(text, path);
  const earlier = before.parseHeader(text, path);
  rows[name] = {
    classificationFieldsNow: readWorkOrder(text).headerFields(
      "Release classification",
    ).length,
    costNow: current.cost,
    costAtBase: earlier.cost,
    trackNow: current.track,
    trackAtBase: earlier.track,
  };
}
console.log(JSON.stringify(rows, null, 2));
