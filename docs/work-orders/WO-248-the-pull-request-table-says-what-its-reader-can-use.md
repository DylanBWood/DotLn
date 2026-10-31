# WO-248 — The pull-request process table says what its reader can use: one table for the order under review, one value per cell, `unknown` spelled out, durations in hours and minutes, the previous-order comparison as one labelled sentence instead of a delta in every cell, and the six-order table and its blank cells out of the body (version assigned at activation)

**Model:** any capable model. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh; verifier xhigh; reviewer high.
**Track:** machinery
**Release classification:** patch. One generated block's rendering and its
pins; no new command, event or phrase; every instance takes it with the
kit, since `scripts/lib/meta.mjs` is a kit file. Assigned at activation
under the standing opt-out default.
**Cost:** adds, in `scripts/lib/meta.mjs` `renderMetaTable` (2299 to 2391),
one table for the pull request's order: a row per dispatch role with eight
columns (dispatch, wall clock, tokens, USD, commands, steps, bound stops,
bound acceptances), each cell one value, an unobserved value spelled
`unknown`, durations as `N h M min`, and below the table one sentence per
metric that has a previous-order figure ("Against WO-NNN, the previous
closed order: …"), so the comparison is labelled where it is read; the Work
table (the last five closed orders beside the active one, `closed.slice(-5)`
at 1587) and the "N unavailable observations omitted as blank cells" line
leave the body, and the terminal output of `npm run meta` (`renderMeta`,
2393 onward, which already lists every metric with its labelled delta)
keeps the figures; the pins in `scripts/test-process-debt.mjs` (the header
regexes at 860 and 11131; the row shapes at 11124 to 11136) follow; a case
that renders the fixture body and asserts no cell holds two values, no cell
is blank, and the comparison sentence names the previous order. Removes:
the body table a reader cannot use (the fork's WO-025 pull request and
core's #258: a nine-column table whose cells wrap one word per line, deltas
against an unnamed previous order reading as negative hours, blank cells
where a value is unknown, a combined USD-and-declared-prompt-tokens cell
reading "/ 768", and six orders listed for a pull request about one).
Wall-clock: the renderer is the same pass over the same collected meta;
no gate step gains work. Context bytes: this file, about 9,000. Commands:
none new. Tokens: unknown until run. Steps: 5. Re-mints: `scripts/lib/meta.mjs`
is not a registered evidence source (`scripts/lib/evidence-sources.mjs`),
so no edition is staled and no live feedback episode is owed; it is read
by `plan-failures.mjs` (`scripts/test-runner.mjs` 428) and is a declared
machinery source through the `meta` and `process-debt` suites, so `npm
test -- --review` runs before handoff.
**Nomination provenance:** the operator's third message of the 2026-10-31
planning dispatch (ignored capture
`docs/intake/notes/planning-kit-guide-home-fork-block-and-drive-returns-2026-10-31-message-3.md`,
SHA-256 `52d78604680f1938af0e1489cbb5dec00b496f54df7188dc2fe9c4adc4c838b7`,
with the screenshot of the fork's WO-025 pull request it attached): the
pull-request charts are broken, in the instance and in core; the filing
pass read core's #258 body and found the same table. Filed by the
[2026-10-31 pass](../planning/kit-guide-home-fork-block-and-drive-returns-2026-10-31.md).
Planner-synthesized. Opaque identifier, not a priority. Clean-room screen:
no stop condition.
**Depends on:** WO-170 (closed: the meter snapshot `release prepare`
writes beside the block); WO-086 (closed: the stored pull-request body with
the meter block as its last block); WO-234 (closed: the bound stops and
acceptances the table lists).

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-170",
    "relation": "satisfied-by-close",
    "reason": "the meter snapshot and block release prepare writes, whose rendering this order changes"
  },
  {
    "workOrderId": "WO-086",
    "relation": "satisfied-by-close",
    "reason": "the stored pull-request body with the meter block last, which withMeterBlockLast keeps"
  },
  {
    "workOrderId": "WO-234",
    "relation": "satisfied-by-close",
    "reason": "the bound stops and acceptances per dispatch the table lists"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** `scripts/lib/meta.mjs` (`display` 2290,
`unobserved` 2298 with its comment that an unavailable observation is a
blank cell, `renderMetaTable` 2299 to 2391, `renderMeta` 2393 onward; the
previous-order delta at 2104 to 2127, `orders[index - 1]`; the order
selection at 1587, `closed.slice(-5)`); `scripts/lib/github-body.mjs`
(`METER_MARKERS` and `withMeterBlockLast` 1371 to 1400);
`scripts/release.mjs` (the stored body rendered from the current meter 2073;
the meter collected before any edit 4220 to 4230; the github-body-profile
check 1069 to 1081: heading first, prose, the meter block last);
`scripts/test-process-debt.mjs` 852 to 866 and 11124 to 11136; the fork's
WO-025 pull request as the operator's screenshot shows it and core's #258
body (`gh pr view 258 --json body`); product 07 §Discipline (operator-facing
durations in hours and minutes; usefulness judged by what the reader can
understand).

**Objective:** A reviewer opening a pull request reads one table about the
order in front of them and understands every cell without a legend: what
each dispatch cost in wall clock, tokens, dollars, commands and steps, and
whether a bound stopped it. An unknown value says so. The comparison with
the previous order is one sentence that names that order.

**Observed gap (dated 2026-10-31 at `main` `c27abd53`):**

- `renderMetaTable` renders two tables into every pull-request body: a Work
  table of ten columns for the last five closed orders and the active one,
  and a Dispatch table of nine columns for the active order's roles. Core's
  #258 body carries both; the fork's WO-025 body carries the second, and
  GitHub renders its Wall cells one word per line ("2 h 18 min (Δ -7 h 6
  min)").
- The Δ in every cell is the previous-order delta (`orders[index - 1]`,
  2104 to 2127); the table never says so, and a reader sees "Δ -7 h 6 min"
  beside a 2 h 18 min phase; the label exists only in `renderMeta`'s
  terminal text ("metrics (value; previous-order delta)").
- An unobserved value is a blank cell by design (the comment at 2296 to
  2298) with one footer line counting the omissions ("54 unavailable
  observations omitted as blank cells or rows" on #258); the fork's table
  shows blank context bytes and commands on two rows, and the USD column
  shows "/ 768" and "/" where the cost is unknown beside the declared prompt
  tokens, a constant repeated on every row.
- The Work table's six orders answer a planning question (the cost
  reconciliation is a planning input) in a pull request about one order.

**Design (scope discipline):**

- **One table, one value per cell, the word for the unknown.** The body
  carries the active order's dispatches only; a cell holds one figure or
  `unknown`; durations are `N h M min`. Rejected: keeping blank cells with
  the footer count (axis: the operator's screenshot is the evidence the
  design's reader did not read the footer; the blank reads as nothing).
- **The comparison is a sentence that names its reference.** The renderer
  takes the subject order (`renderMetaTable(meta, { workOrderId })`;
  `release.mjs` 2081 and 4246 pass it, since release prepare knows its
  order) and compares it with the latest closed order before it in the
  collector's selection, naming that order and its state: "Against WO-239,
  the previous closed order: wall clock 112 h 38 min more; tokens
  361,254,746 more." The collector's per-row delta (`orders[index - 1]`,
  2104 to 2127) stays for the meter's text; the body never compares with an
  open order. Rejected: a Δ column (axis: nine columns already wrap; a delta
  without its reference is what misled the reader). Rejected: rendering
  every open order (axis: with two orders open the body would show two
  dispatch tables, and a closed order's regenerated body none).
- **The six-order table leaves the body and stays in the meter.**
  `renderMeta` already prints every metric with its labelled delta for the
  planner; the pull request loses nothing a reviewer used. Rejected: keeping
  the Work table narrower (axis: a pull request is about one order; the
  planning input has its own reader and command).
- **Live-run surfaces at the base.** The collector, the block markers, the
  stored-body rule and the fixture body of WO-999: exist. The narrow
  rendering: absent.

**Execution plan (the executor follows these steps in order; observed at `c27abd53`, 2026-10-31):**

1. `scripts/lib/meta.mjs` `renderMetaTable(meta, { workOrderId })` (2299
   to 2391): the eight-column dispatch table for the subject order, `unknown`
   cells, hours and minutes, the comparison sentences against the latest
   closed order before the subject; the Work table and the omission footer
   removed from the returned block; `renderMeta` (2393) keeps its figures
   and prints the new block for the latest open order in place of the old
   tables. Check: `npm test -- --only process-debt`; `npm test -- --only
   meta`.
2. `scripts/test-process-debt.mjs` 852 to 866 and 11124 to 11136: the pins
   follow the new shape; cases render the fixture body and assert that no
   cell is blank, no cell holds two values, every duration matches `\d+ h
   \d+ min`, the comparison sentence names the previous closed order or is
   absent when there is none, two open orders in the collection yield one
   table for the named subject, and a closed subject's body regenerates
   with its own rows. Check: `npm test -- --only process-debt`.
3. `scripts/release.mjs` (2081 and 4246: the two callers pass the order's
   id) and `scripts/lib/github-body.mjs` (1371 to 1400, unchanged): the
   stored-body fixture of the `release` suite renders the new block last
   for its order and the github-body-profile check passes. Check: `npm test
   -- --only release`; `npm test -- --only github-body`.
4. Write-backs: product 07 (the sentence that describes the meter block in
   a pull-request body, where it names the tables); `docs/evidence/WO-248/decisions.md`
   (the fork's and core's bodies before, the fixture body after);
   `npm run meta`; `node scripts/lineage.mjs index --check`; `npm run
   publication:check`.
5. Handoff: integrate `main` first when it has moved (WO-233's rule);
   finish source edits; `npm run format` and `npm run sync`; the three
   fresh independent reviewers the executor root requires; one `npm test
   -- --review` in the background awaited with `node scripts/harness.mjs
   evidence --wait`; `docs/evidence/WO-248/handoff.md`; `npm run test:docs`
   once after the last document edit; `npm run resume --
   implementation-ready <flags>` (product 07 §Discipline).

**Deliverables:** the narrow block; the pins and the new case; the
write-backs.

**Acceptance criteria (all required)**

1. The fixture body renders one table with the header `| Dispatch | Wall
   clock | Tokens | USD | Commands | Steps | Bound stops | Bound acceptances
   |`, one row per dispatch of the subject order and none of any other
   order, no blank cell, no cell holding two values, every duration as `N h
   M min`, and `unknown` where a value is unobserved; no Work table and no
   omission footer are in the block; with two orders open the body names one
   subject, and a closed subject's regenerated body carries its own rows.
2. Below the table, one sentence per metric with a figure from the latest
   closed order before the subject names that order, its state and the
   difference in the metric's own unit; with no closed order before it, no
   sentence; an open order is never the comparison.
3. `npm run meta` prints every metric with its labelled delta as before;
   the `meta` and `process-debt` suites pass at the new pins.
4. The stored-body fixture of the `release` suite carries the new block for
   its own order as its last block and the github-body-profile check
   passes; an existing body's old block is replaced by `withMeterBlockLast`
   at the next release prepare.
5. Product 07 names the block's shape; `npm run publication:check` is
   green.
6. `npm test -- --review` and `npm run test:docs` green; `git diff --check`
   clean; no new dependency.

**Preflight:** `npm test -- --only process-debt` and `npm test -- --only
meta` for steps 1 and 2; `npm test -- --only release` and `npm test --
--only github-body` for step 3; `npm run test:docs` when a document
changes; each under `node scripts/harness.mjs bounded --`; then one `npm
test -- --review` (07-execution-guide.md §Preflight before the full gate).

**Evidence gate:** the cases of criteria 1 to 4; `npm test -- --review`
before `implementation-ready`, final review reusing the passing complete row
at the integrated code identity when one exists.

**Write-back duty:** as listed in step 4 and criterion 5.

**Known issues and carry-ins:**

- How GitHub wraps a table depends on the viewer's width; the criteria
  bound what a cell holds, not pixels, and the operator judges the next
  pull request (reopen: the operator reports a wrapped cell after this
  release).
- The declared prompt tokens (768 on every row) leave the body with the
  Work table; they stay in the meter's text (reopen: a reviewer asks for
  them in the body).
- An instance's stored bodies of orders open when the release lands keep
  the old block until their next release prepare rewrites it (reopen: an
  instance asks for a rewrite of closed orders' bodies, which are records).

**Non-goals:** the collector and its metrics; the meter snapshot; the
planning cost table; the work-order index card (WO-238 carries
WO-236-D021); any new metric.

**Operator-review assumptions:** that eight columns of single values is
narrow enough for the operator's viewer, since the screenshot's wrapping
came from compound cells; that the six-order table belongs to the planner's
terminal and not to a pull request. Reopen on the operator's word.
