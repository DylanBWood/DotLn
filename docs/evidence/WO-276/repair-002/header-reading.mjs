#!/usr/bin/env node
// WO-276, the repair of VER-002's finding on the header read from an order's
// lead: the header reader against the whole-document reader over every
// committed order, and what each costs.
//
//   node docs/evidence/WO-276/repair-002/header-reading.mjs [--write]
//
// For each order under docs/work-orders it reads the header both ways and
// compares the title, where the lead starts, where the header ends and every
// header field with its extents. Before that it times each reader over all
// orders, the header reader first, while the parser has kept no text: the
// parser keeps a tree by its text, and a lead parsed for the comparison
// would be served to the timing. --write records the result beside this
// file as header-reading.json. A difference fails.
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "../../../..");
const { readWorkOrder, readWorkOrderHeader } = await import(
  pathToFileURL(join(root, "scripts/lib/work-order-document.mjs")).href
);
const directory = join(root, "docs/work-orders");
const orders = readdirSync(directory)
  .filter((name) => /^WO-\d{3}-.*\.md$/u.test(name))
  .sort()
  .map((name) => ({ name, text: readFileSync(join(directory, name), "utf8") }));
const timed = (read) => {
  const started = process.hrtime.bigint();
  for (const { text } of orders) read(text);
  return Math.round(Number(process.hrtime.bigint() - started) / 1e6);
};
// The parser itself is loaded by a text no order holds, so neither arm pays
// for its first use.
readWorkOrder("# Loaded\n\n**Model:** none\n\n**Objective:** none\n");
const milliseconds = {
  headerReader: timed((text) => readWorkOrderHeader(text)),
  wholeDocument: timed((text) => readWorkOrder(text)),
};
const reading = (order) =>
  JSON.stringify({
    title: order.title,
    leadStart: order.leadStart,
    headerEnd: order.headerEnd,
    header: order.header,
  });
const differing = [];
let leadAlone = 0;
let fields = 0;
for (const { name, text } of orders) {
  const header = readWorkOrderHeader(text);
  const whole = readWorkOrder(text);
  if (reading(header) !== reading(whole)) differing.push(name);
  if (header.lead.source.length < whole.source.length) leadAlone += 1;
  fields += whole.header.length;
}
const result = {
  schemaVersion: 1,
  observedAt: new Date().toISOString(),
  reads:
    "every work order under docs/work-orders: its header read from its lead and read from the whole document",
  orders: orders.length,
  characters: orders.reduce((sum, { text }) => sum + text.length, 0),
  headerFields: fields,
  equal: orders.length - differing.length,
  differing,
  readFromTheLeadAlone: leadAlone,
  readFromTheWholeDocument: orders.length - leadAlone,
  milliseconds,
};
const output = `${JSON.stringify(result, null, 2)}\n`;
if (process.argv.includes("--write"))
  writeFileSync(join(here, "header-reading.json"), output);
process.stdout.write(output);
if (differing.length) process.exitCode = 1;
