// Final review of WO-276 (FINAL-002): does a wrapped line of an order's
// leading header that opens a block hide the header fields written after it?
//
// An order's header is one paragraph of labelled lines, wrapped by hand. A
// continuation line can open a block its author did not intend: a
// placeholder spelled as an HTML block element's name (<title>, <dir>,
// <summary>) opens a raw HTML block that runs to the next blank line; a
// greater-than sign opens a quotation and a plus sign, a hyphen, an asterisk
// or `1.` before a space opens a list item, and the lines after it are that
// block's lazy continuation. The base's reader read a label wherever it
// opened a line. The candidate's reads the header's own top-level
// paragraphs.
//
// Each case is one order whose Cost line wraps onto the opener, followed by
// the Release classification, Track, Repository and Depends on fields. The
// candidate's readers are run beside the base's: the index's header
// (parseHeader), which holds the track, the cost, the registered target the
// order declares (absent, the order is the launchpad's own) and the orders
// its Depends on line names; and, for the same opener inside the Preflight
// field's first paragraph, the suites a handoff owes (readPreflightSuites).
// The last row of each case is the criteria list with the same opener on a
// wrapped line of its first item, written at the margin, which the candidate
// refuses by line where the list would read shorter (refuseUnreadList).
//
// Run from the repository root:
//   node docs/evidence/WO-276/final-review-002/header-block-openers.mjs <base> [<output.json>]
// where <base> holds main's files (`git archive main | tar -x -C <base>`,
// with node_modules linked from the worktree).
import { writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const base = resolve(process.argv[2]);
const output = process.argv[3];
const load = (from, file) => import(pathToFileURL(join(from, file)).href);
const sides = {
  candidate: {
    index: await load(root, "scripts/work-orders.mjs"),
    ledger: await load(root, "scripts/lib/handoff-ledger.mjs"),
  },
  base: {
    index: await load(base, "scripts/work-orders.mjs"),
    ledger: await load(base, "scripts/lib/handoff-ledger.mjs"),
  },
};

const path = "docs/work-orders/WO-999-fixture.md";
const order = ({ header, preflight, criterion }) =>
  [
    "# WO-999 — Fixture (v1.0.0)",
    "",
    "**Model:** any.",
    "**Effort:** executor any.",
    "**Cost:** the first line of the cost wraps where it wraps and goes on",
    header,
    "**Release classification:** minor.",
    "**Track:** machinery",
    `**Repository:** fixture @ ${"a".repeat(40)}`,
    "**Depends on:** WO-072 (closed).",
    "",
    "**Objective:** The objective.",
    "",
    "**Acceptance criteria (all required)**",
    "",
    "1. The first criterion wraps where it wraps and goes on",
    criterion,
    "2. `npm test` passes.",
    "",
    "**Preflight:** `--only skeleton` and `--only compiler` come first, and",
    preflight,
    "then `--only resume` and `--only launchpad`.",
    "",
    "**Non-goals:** none.",
    "",
  ].join("\n");
const plain = "with ordinary words to its end.";
const openers = {
  "ordinary words (control)": plain,
  "<title>, a block element's name": "<title> for each publish.",
  "<dir>, a block element's name": "<dir> for each profile.",
  "<summary>, a block element's name": "<summary> of the run.",
  "<path>, no block element's name (control)": "<path> for each part.",
  "a greater-than sign": "> 20 workers in one dispatch.",
  "greater than or equal": ">= 2.31.0 of Git on the host.",
  "a plus sign and a space": "+ 3 more suites for the part.",
  "a hyphen and a space": "- as the record states - for each part.",
  "an asterisk and a space": "* each measured once.",
  "one, a period and a space": "1. the first of two readings.",
  "two, a period and a space (control)": "2. the second of two readings.",
};

const attempt = (read) => {
  try {
    return read();
  } catch (error) {
    return { refused: String(error.message).slice(0, 240) };
  }
};
const header = (side, text) =>
  attempt(() => {
    const read = side.index.parseHeader(text, path);
    return {
      track: read.track,
      cost: read.cost,
      repository: read.repository?.id ?? "none declared: the launchpad's own",
      dependsOn: read.dependencies.entries.map((entry) => entry.workOrderId),
    };
  });
const rows = {};
for (const [name, line] of Object.entries(openers)) {
  const inHeader = order({ header: line, preflight: plain, criterion: plain });
  const inPreflight = order({
    header: plain,
    preflight: line,
    criterion: plain,
  });
  const inCriteria = order({
    header: plain,
    preflight: plain,
    criterion: line,
  });
  const row = {
    header: {
      candidate: header(sides.candidate, inHeader),
      base: header(sides.base, inHeader),
    },
    preflightSuites: {
      candidate: attempt(() =>
        sides.candidate.ledger.readPreflightSuites(inPreflight),
      ),
      base: attempt(() => sides.base.ledger.readPreflightSuites(inPreflight)),
    },
    criteria: {
      candidate: attempt(() =>
        Object.keys(sides.candidate.ledger.declaredCriteria(inCriteria) ?? {}),
      ),
      base: attempt(() =>
        Object.keys(sides.base.ledger.declaredCriteria(inCriteria) ?? {}),
      ),
    },
  };
  for (const reading of Object.values(row))
    reading.equal =
      JSON.stringify(reading.candidate) === JSON.stringify(reading.base);
  rows[name] = row;
}
const text = `${JSON.stringify(rows, null, 2)}\n`;
if (output) writeFileSync(output, text);
else process.stdout.write(text);
