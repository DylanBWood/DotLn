// WO-248 VER-001 independent probes. Read-only: renders the meter block from
// the real control corpus and from constructed inputs, regenerates stored
// pull-request bodies that carry the old block, and, when given an extracted
// copy of main's scripts/lib and packages/skeleton/src, compares the terminal
// text of npm run meta after the table block.
//
// node scripts/harness.mjs bounded -- node docs/evidence/WO-248/verifier-001-probes.mjs <root> [<main-src>]
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const [root, mainSrc] = process.argv.slice(2);
const load = (base, path) => import(pathToFileURL(join(base, path)));
const meter = await load(root, "scripts/lib/meta.mjs");
const body = await load(root, "scripts/lib/github-body.mjs");
const { formatDuration } = await load(root, "scripts/lib/duration.mjs");
const { gateCodeIdentity } = await load(root, "scripts/lib/gate-evidence.mjs");
const { regeneratedPullRequestBody } = await load(root, "scripts/release.mjs");
const HEADER =
  "| Dispatch | Wall clock | Tokens | USD | Commands | Steps | Bound stops | Bound acceptances |";
const START = "<!-- dotln-process-meter:start -->";
const END = "<!-- dotln-process-meter:end -->";

const shape = (rendered, id) => {
  const rows = rendered.split("\n").filter((line) => line.startsWith("|"));
  const problems = [];
  if (rows[0] !== HEADER) problems.push(`header ${rows[0]}`);
  if (rows.filter((row) => row.startsWith("| Dispatch |")).length !== 1)
    problems.push("table count");
  for (const row of rows.slice(2)) {
    const cells = row
      .split("|")
      .slice(1, -1)
      .map((value) => value.trim());
    if (cells.length !== 8) problems.push(`cells ${row}`);
    if (!cells[0].startsWith(`${id}/`)) problems.push(`foreign row ${row}`);
    if (!/^(unknown|\d+ h \d+ min)$/.test(cells[1]))
      problems.push(`duration ${row}`);
    for (const value of cells.slice(2))
      if (!/^(unknown|[\d,]+(?:\.\d+)?)$/.test(value))
        problems.push(`value ${value} in ${row}`);
  }
  if (/\| Work \||omitted|Δ/.test(rendered)) problems.push("old shape");
  return { rows: rows.slice(2), problems };
};
const sentencesOf = (text) =>
  text.split("\n").filter((line) => line.startsWith("Against "));

const out = { codeIdentity: gateCodeIdentity(root) };

// P1: every order in the collector's selection, rendered as its own subject.
const meta = await meter.collectMeta(root);
out.selection = meta.orders.map((row) => `${row.workOrder}:${row.phase}`);
out.corpus = meta.orders.map((order, index) => {
  const rendered = meter.renderMetaTable(meta, {
    workOrderId: order.workOrder,
  });
  const { rows, problems } = shape(rendered, order.workOrder);
  const previous = meta.orders
    .slice(0, index)
    .findLast((row) => row.phase === "closed");
  const sentences = sentencesOf(rendered);
  for (const sentence of sentences)
    if (
      !previous ||
      !sentence.startsWith(
        `Against ${previous.workOrder}, the previous closed order: `,
      )
    )
      problems.push(`reference ${sentence}`);
  if (rows.length !== order.dispatches.length) problems.push("row count");
  for (const row of order.dispatches)
    if (
      Number.isFinite(row.declaredPromptTokens) &&
      row.observedTokens === row.declaredPromptTokens
    )
      problems.push(`tokens equal declared prompt size for ${row.role}`);
  const wrapped = body.withMeterBlockLast(
    `# ${order.workOrder}\n\nProse.\n`,
    rendered,
  );
  try {
    body.assertPullRequestBodyShape(wrapped, "probe");
    body.assertGitHubBodyProfile(wrapped, "probe");
  } catch (error) {
    problems.push(`profile ${error.message}`);
  }
  const unobservedRoles = rows
    .filter((row) =>
      row
        .split("|")
        .slice(2, 7)
        .every((value) => value.trim() === "unknown"),
    )
    .map((row) => row.split("|")[1].trim());
  return {
    order: `${order.workOrder}:${order.phase}`,
    rows: rows.length,
    previous: previous?.workOrder ?? null,
    sentences: sentences.length,
    unobservedRoles,
    problems,
  };
});
out.subjectBlock = meter.renderMetaTable(meta, { workOrderId: "WO-248" });
out.absentSubject = sentencesOf(
  meter.renderMetaTable(meta, { workOrderId: "WO-000" }),
).length;

// P2: constructed edges the executor fixture held constant.
const order = (workOrder, phase, metrics) => ({
  workOrder,
  phase,
  metrics,
  boundStops: { count: 0 },
  boundAcceptances: [],
  dispatches: [],
});
const compare = (orders, id) =>
  sentencesOf(meter.renderMetaTable({ orders }, { workOrderId: id }));
out.edges = {
  durations: [29_999, 30_000, 3_599_999].map(
    (ms) => `${ms} ms -> ${formatDuration(ms)}`,
  ),
  subMinute: compare(
    [
      order("WO-001", "closed", { elapsedMs: 100_000 }),
      order("WO-002", "active", { elapsedMs: 70_000 }),
    ],
    "WO-002",
  )[0],
  subMill: compare(
    [
      order("WO-001", "closed", { costUsd: 1.2344 }),
      order("WO-002", "active", { costUsd: 1.2345 }),
    ],
    "WO-002",
  )[0],
  subjectUnknown: compare(
    [
      order("WO-001", "closed", { tokens: 10 }),
      order("WO-002", "active", { tokens: null }),
    ],
    "WO-002",
  ).filter((line) => line.includes("tokens")).length,
  openBetween: compare(
    [
      order("WO-001", "closed", { tokens: 1 }),
      order("WO-003", "active", { tokens: 5 }),
      order("WO-002", "active", { tokens: 3 }),
    ],
    "WO-002",
  )[0],
  subjectFirst: compare(
    [
      order("WO-002", "active", { tokens: 3 }),
      order("WO-001", "closed", { tokens: 1 }),
    ],
    "WO-002",
  ).length,
};

// P3: stored bodies that carry the old block, regenerated for their subject.
out.stored = {};
for (const id of ["WO-249", "WO-251"]) {
  const stored = readFileSync(
    join(root, "docs/final-reviews", id, "PR.md"),
    "utf8",
  );
  const regenerated = await regeneratedPullRequestBody(root, id, "HEAD");
  const block = regenerated.slice(regenerated.indexOf(START));
  const problems = [];
  try {
    body.assertPullRequestBodyShape(regenerated, id);
    body.assertGitHubBodyProfile(regenerated, id);
  } catch (error) {
    problems.push(error.message);
  }
  if (!regenerated.trimEnd().endsWith(END)) problems.push("block not last");
  if (regenerated.split(START).length !== 2) problems.push("block count");
  problems.push(...shape(block, id).problems);
  out.stored[id] = {
    storedHadOldBlock: /\| Work \|/.test(stored),
    rows: shape(block, id).rows.length,
    sentences: sentencesOf(block).length,
    problems,
  };
}

// P4: terminal text after the table block, candidate against main.
if (mainSrc) {
  const old = await load(mainSrc, "scripts/lib/meta.mjs");
  const latestOpen = meta.orders.findLast(
    (row) => !["closed", "withdrawn"].includes(row.phase),
  )?.workOrder;
  const candidate = meter
    .renderMeta(meta)
    .slice(meter.renderMetaTable(meta, { workOrderId: latestOpen }).length);
  const before = old.renderMeta(meta).slice(old.renderMetaTable(meta).length);
  out.terminal = {
    restEqualToMain: candidate === before,
    restBytes: candidate.length,
    labelledDeltaSections: (
      candidate.match(/metrics \(value; previous-order delta\):/g) ?? []
    ).length,
  };
}
console.log(JSON.stringify(out, null, 1));
