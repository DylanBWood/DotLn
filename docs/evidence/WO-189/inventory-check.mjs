#!/usr/bin/env node
// Checks the front-page inventory beside this script against the repository.
//
// The inventory classes every top-level block of README.md at one recorded
// revision as keep, move or cut, and names where each block's facts live
// afterwards. This script re-derives the blocks from that revision and proves
// three things: every block has exactly one row with its recorded hash; every
// anchor phrase occurs in the document the row names; and the page that
// replaces the old one holds no work-order identifier, decision identifier,
// date or version outside its one generated line, names every package, and
// keeps "What runs today" between its markers within the recorded budget.
//
//   node docs/evidence/WO-189/inventory-check.mjs            check everything
//   node docs/evidence/WO-189/inventory-check.mjs --readme docs/evidence/WO-189/candidate-2000.md
//                                                            judge a candidate as the page
//   node docs/evidence/WO-189/inventory-check.mjs --write    rewrite inventory.md from inventory.json
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parsers } from "prettier/plugins/markdown.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..", "..", "..");
const args = process.argv.slice(2);
const flag = (name) => {
  const index = args.indexOf(name);
  return index >= 0 ? (args[index + 1] ?? true) : undefined;
};
const readmePath =
  typeof flag("--readme") === "string" ? flag("--readme") : "README.md";
const write = args.includes("--write");

const inventory = JSON.parse(
  readFileSync(join(here, "inventory.json"), "utf8"),
);
const normalized = (text) => text.replace(/\s+/g, " ");
const failures = [];
const fail = (message) => failures.push(message);

// One block per top-level Markdown node; a list contributes one block per item.
function blocks(source) {
  const ast = parsers.markdown.parse(source);
  const rows = [];
  const visit = (node) => {
    if (node.type === "list") {
      for (const item of node.children) visit(item);
      return;
    }
    const raw = source.slice(
      node.position.start.offset,
      node.position.end.offset,
    );
    rows.push({
      type: node.type,
      lines: `${node.position.start.line}-${node.position.end.line}`,
      bytes: Buffer.byteLength(raw),
      sha256: createHash("sha256").update(raw).digest("hex"),
    });
  };
  for (const child of ast.children) visit(child);
  return rows;
}

// Coverage: the recorded revision's blocks and the inventory's rows agree one to one.
const subject = execFileSync(
  "git",
  [
    "-C",
    root,
    "show",
    `${inventory.subject.revision}:${inventory.subject.path}`,
  ],
  { encoding: "utf8", maxBuffer: 1 << 24 },
);
const observed = blocks(subject);
if (observed.length !== inventory.rows.length)
  fail(
    `the page at ${inventory.subject.revision.slice(0, 8)} has ${observed.length} blocks; the inventory has ${inventory.rows.length} rows`,
  );
observed.forEach((block, index) => {
  const row = inventory.rows[index];
  if (!row) return;
  if (
    row.sha256 !== block.sha256 ||
    row.lines !== block.lines ||
    row.type !== block.type
  )
    fail(
      `${row.id}: recorded ${row.type} ${row.lines} ${row.sha256.slice(0, 12)}; observed ${block.type} ${block.lines} ${block.sha256.slice(0, 12)}`,
    );
  if (!["keep", "move", "cut"].includes(row.class))
    fail(`${row.id}: unknown class ${row.class}`);
  if (row.class !== "cut" && !row.destination)
    fail(`${row.id}: a ${row.class} row names its destination`);
  if (row.class === "cut" && !row.destination && row.anchors.length)
    fail(`${row.id}: a cut row without a destination carries no anchors`);
  if (row.class === "move" && !row.anchors.length)
    fail(
      `${row.id}: a moved paragraph proves its facts with at least one anchor`,
    );
});

// Anchors: each phrase occurs in the document it names, whitespace collapsed.
const cache = new Map();
const documentText = (path) => {
  const file = path === "README.md" ? readmePath : path;
  if (!cache.has(file)) {
    const absolute = resolve(root, file);
    cache.set(
      file,
      existsSync(absolute) ? normalized(readFileSync(absolute, "utf8")) : null,
    );
  }
  return cache.get(file);
};
for (const row of inventory.rows)
  for (const anchor of row.anchors) {
    const text = typeof anchor === "string" ? anchor : anchor.text;
    const file = typeof anchor === "string" ? row.destination : anchor.in;
    if (!file) {
      fail(`${row.id}: anchor ${JSON.stringify(text)} names no document`);
      continue;
    }
    const body = documentText(file);
    if (body === null) fail(`${row.id}: ${file} does not exist`);
    else if (!body.includes(normalized(text)))
      fail(
        `${row.id}: ${JSON.stringify(text)} is not in ${file === "README.md" ? readmePath : file}`,
      );
  }

// The page itself: no identifiers, dates or versions outside the generated line.
const page = readFileSync(resolve(root, readmePath), "utf8");
const lines = page.split("\n");
const releaseBegin = lines.indexOf("<!-- DOTLN-RELEASE-BEGIN -->");
const releaseEnd = lines.indexOf("<!-- DOTLN-RELEASE-END -->");
const markerLines = lines.filter((line) =>
  /DOTLN-RELEASE-(?:BEGIN|END)/.test(line),
).length;
if (
  releaseBegin < 0 ||
  releaseEnd < 0 ||
  releaseEnd <= releaseBegin ||
  markerLines !== 2
)
  fail(`${readmePath}: needs exactly one ordered pair of release marker lines`);
else {
  const between = lines.slice(releaseBegin + 1, releaseEnd);
  if (
    between.length !== 1 ||
    !/^This source prepares DotLn `v\d+\.\d+\.\d+`\.$/.test(between[0])
  )
    fail(
      `${readmePath}: the release block holds ${between.length} line(s); expected exactly the generated version line`,
    );
}
lines.forEach((line, index) => {
  if (index > releaseBegin && index < releaseEnd) return;
  const number = index + 1;
  for (const [pattern, label] of [
    [/\bWO-\d{3}\b/, "a work-order identifier"],
    [/\bD\d{3}\b/, "a decision identifier"],
    [/\b\d{4}-\d{2}-\d{2}\b/, "a date"],
    [/\bv\d+\.\d+\.\d+(?!\w|\.\d)/, "a version"],
    [/(?<![\w.])\d+\.\d+\.\d+(?!\w|\.\d)/, "a version number"],
  ])
    if (pattern.test(line))
      fail(`${readmePath}:${number}: ${label} outside the generated line`);
});

// The map names every package directory.
for (const name of readdirSync(join(root, "packages")).sort())
  if (!page.includes(`packages/${name}/`))
    fail(`${readmePath}: the map does not name packages/${name}/`);

// "What runs today" sits between its markers, one sentence per line, within budget.
const controlPath = join(root, "docs/control/front-page.json");
const control = existsSync(controlPath)
  ? JSON.parse(readFileSync(controlPath, "utf8"))
  : null;
const runsStart =
  control?.whatRunsToday?.start ?? "<!-- dotln-what-runs:start -->";
const runsEnd = control?.whatRunsToday?.end ?? "<!-- dotln-what-runs:end -->";
const starts = lines.filter((line) => line === runsStart).length;
const ends = lines.filter((line) => line === runsEnd).length;
const runsBegin = lines.indexOf(runsStart);
const runsFinish = lines.indexOf(runsEnd);
let sentences = null;
if (starts !== 1 || ends !== 1 || runsFinish <= runsBegin)
  fail(
    `${readmePath}: needs exactly one ordered pair of What runs today markers`,
  );
else {
  const body = lines
    .slice(runsBegin + 1, runsFinish)
    .filter((line) => line.trim());
  sentences = body.length;
  for (const line of body)
    if (!/[.!?]["”)`]*$/.test(line.trim()))
      fail(
        `${readmePath}: a What runs today line does not end a sentence: ${line.slice(0, 60)}`,
      );
  // The recorded budget belongs to the chosen page; another candidate judged
  // with --readme reports its own count, which would set its own budget.
  const budget = control?.whatRunsToday?.lineBudget;
  if (
    readmePath === "README.md" &&
    Number.isSafeInteger(budget) &&
    sentences > budget
  )
    fail(
      `${readmePath}: What runs today holds ${sentences} sentences; the budget is ${budget}`,
    );
}

// inventory.md is a rendering of inventory.json and stays in step with it.
const totals = {};
for (const row of inventory.rows) {
  totals[row.class] ??= { rows: 0, bytes: 0 };
  totals[row.class].rows++;
  totals[row.class].bytes += row.bytes;
}
const cell = (text) =>
  String(text ?? "—")
    .replace(/\|/g, "\\|")
    .replace(/\n/g, " ");
const anchorCell = (row) =>
  row.anchors
    .map((anchor) =>
      typeof anchor === "string"
        ? `\`${anchor}\``
        : `\`${anchor.text}\` in ${anchor.in}`,
    )
    .join("; ");
const rendered = [
  "# WO-189 front-page inventory",
  "",
  `Every top-level block of \`${inventory.subject.path}\` at \`${inventory.subject.revision}\` (${inventory.subject.bytes.toLocaleString("en-US")} bytes, ${inventory.subject.lines} lines, ${inventory.subject.blocks} blocks; a list counts one block per item), classed keep, move or cut. Rendered from [inventory.json](inventory.json) by [inventory-check.mjs](inventory-check.mjs), which also proves the anchors.`,
  "",
  "| Class | Meaning | Blocks | Bytes |",
  "| --- | --- | ---: | ---: |",
  ...["keep", "move", "cut"].map(
    (name) =>
      `| ${name} | ${cell(inventory.classes[name])} | ${totals[name]?.rows ?? 0} | ${(totals[name]?.bytes ?? 0).toLocaleString("en-US")} |`,
  ),
  "",
  `Anchor rule: ${inventory.anchorRule}.`,
  "",
  "| Block | Lines | Type | Bytes | Class | Destination | Anchors | Note |",
  "| --- | --- | --- | ---: | --- | --- | --- | --- |",
  ...inventory.rows.map(
    (row) =>
      `| ${row.id} | ${row.lines} | ${row.type} | ${row.bytes} | ${row.class} | ${cell(row.destination)} | ${cell(anchorCell(row))} | ${cell(row.note)} |`,
  ),
  "",
].join("\n");
const inventoryMarkdown = join(here, "inventory.md");
if (write) writeFileSync(inventoryMarkdown, rendered);
else if (!existsSync(inventoryMarkdown))
  fail("inventory.md is missing; run with --write");
else if (readFileSync(inventoryMarkdown, "utf8") !== rendered)
  fail("inventory.md differs from its rendering; run with --write");

console.log(
  `inventory: ${inventory.rows.length} rows over ${observed.length} blocks at ${inventory.subject.revision.slice(0, 8)}; ` +
    Object.entries(totals)
      .map(([name, total]) => `${name} ${total.rows} rows/${total.bytes} bytes`)
      .join(", ") +
    `; page ${readmePath}: ${Buffer.byteLength(page)} bytes, What runs today ${sentences ?? "unmeasured"} sentences` +
    (control?.whatRunsToday?.lineBudget
      ? ` of ${control.whatRunsToday.lineBudget}`
      : ""),
);
for (const failure of failures) console.error(`FAIL ${failure}`);
console.log(
  `${failures.length ? "FAIL" : "PASS"} inventory check: ${failures.length} failures`,
);
process.exitCode = failures.length ? 1 : 0;
