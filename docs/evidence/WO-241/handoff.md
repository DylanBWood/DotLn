# WO-241 implementation handoff

Date: 2026-11-03. Dispatch: `resume: next`, resumed by the operator's
`continue` after the requested pause. Executor: Codex CLI 0.166.0,
`gpt-6-astra`, effort `max`, source `codex-session-readback`.
Authority: [WO-241](../../work-orders/WO-241-the-features-file.md).

The implementation adds the feature registry, named elections and validation,
the `features` command, the generated effective-values page, and the kit and
product guidance. Tinkerer economy and the exported instance's private
destination paragraph consume their elections; desktop control retains its
existing election. The inventory identifies unread switches and the pending
WO-242 consumer. Existing keys remain in place. No dependency was added.

**Criterion 1:** met — `scripts/test-features.mjs` covers absent configuration, each named election's boolean and `{ on, note }` forms, diagnostic keys, unknown names, refusal of inventory ids owned by existing keys, and a one-release rename advisory followed by refusal. The `configuration-root` suite passed in the complete review gate below. No existing feature was renamed, so the production alias table is empty; the rename fixture supplies a tombstone explicitly.

**Criterion 2:** met — the registry and `features` checks validate row metadata and reader paths; behavioral fixtures in `scripts/test-harness.mjs` exercise equipment, Secrets, desktop control, overlays, budgets and drive settings, while the launchpad update fixtures exercise instance-action opt-in. The actual CLI regression proves saved build selections are unread. `scripts/test-features.mjs` proves a closed WO-242 produces an advisory, and `scripts/refute-plan.mjs` carries that advisory into planning start. The copied-runtime qualification fixture proves a declared future consumer does not require core's order archive. These suites passed in the complete review gate; the four release surfaces remain explicitly unread.

**Criterion 3:** met — render/check fixtures and the complete gate's generated check passed, including configured roots, stale-page refusal, escaped notes, one row per registry entry and the fixed floor. `npm run meta` rendered the current 18-row page. The passing `npm run test:docs` row below includes its generated check.

**Criterion 4:** met — `scripts/test-harness.mjs` verifies identical absent/default-on roots, removal of Tinkerer economy when off, unchanged or smaller role roots and passing harness checks. The bounded instance measurement below confirms every declared kit cold-start ceiling; it does not claim core's advisory breaches are resolved. The private-destination fixture checks the instance-only Secrets change, restoration when absent and outward refusal of a private term; custom-section regressions refuse unrecognized edits. Both harness suites and outward screening passed in the complete review gate.

**Criterion 5:** met — `scripts/kit/dotln.config.example.json` contains the instance elections and a note-bearing entry; `docs/KIT.md` explains their use. The launchpad export and update suites passed, including the example and carried guide. `npm run publication:check` passed with 256 of 256 product headings indexed and current source locks after the last product-document edit.

**Criterion 6:** met — product 07's “Where the control plane finds its documents” names the section, entry forms, registry, generated page, sources and refresh order. [D001](decisions.md#wo-241-d001) and [the measurement](render-cost.json) record one bounded whole-command `npm run meta` measurement before and after. Both round to 0 h 0 min; the raw difference does not isolate rendering cost from records or host activity.

**Criterion 7:** met — `npm test -- --review` passed at the code identity below, with 46 suites, 120 fresh tasks, no failed or unrun suites, and unchanged code/build identity. `npm run test:docs` passed 27 fresh tasks with zero failures at the same code identity. `git diff --check` is clean; completion also judges the final handoff bytes inline. `package.json` adds only the command and the lockfile is unchanged.

The passing complete row was recorded at `2026-11-03T21:16:56.810Z`:

- Evidence: `host-gate:3fd4e3a32e25dd4e24d9bb3dffb82ebf6e88d06e3430b535cd6b957422ebb2f2:npm test`.
- Code identity: `3fd4e3a32e25dd4e24d9bb3dffb82ebf6e88d06e3430b535cd6b957422ebb2f2`.
- Candidate tree: `76980092a83d3fdaa01142957531c39cd97a6aff`.
- Duration: 0 h 46 min, including finalization. Cleanup removed 2,581 owned roots, retained one and reported zero blockers.

The passing document row was recorded at `2026-11-03T21:22:42.502Z`, after
the last edit outside this order's evidence directory. It ran for 0 h 2 min:

- Evidence: `host-gate:3fd4e3a32e25dd4e24d9bb3dffb82ebf6e88d06e3430b535cd6b957422ebb2f2:npm run test:docs`.
- Candidate tree: `ce3861ad18682bc860a2328c85c5c1f1646a0d09`.
- Document tree excluding `docs/evidence/WO-241`: `6f5cd4456c4778fd6091d2d180318d385778a0c5`. This recorded exclusion keeps the row standing after this handoff's final criterion judgments.
- All 27 tasks ran fresh; none failed or remained unrun. Cleanup reported zero blockers.

Criterion 4's additional [cold-start measurement](cold-start.json) ran after
the gates without changing implementation inputs. A bounded fixture used the
shipped kit floor and budget template with the real `emitHarness`,
`checkHarness` and `measureColdStarts`, first with the section absent and then
with Tinkerer economy off. Both harness checks passed; all fourteen role
roots were measured. Each executor root fell from 42,390 to 42,114 bytes;
other role roots were unchanged. The kit's only declared role ceiling is the
router's 16,384 bytes, and both router roots measured 16,028. The other kit
role ceilings are unset. The raw record also shows that applying core's
different budgets would still report its inherited executor, verifier,
release-close and planner breaches. A passing `harness-context` command
alone is not proof of met ceilings: its budget reports are advisory. This
corrects that overstatement in the draft handoff and earlier progress update.

The five earlier runs failed and were stopped; none supplies a complete pass.
[D008–D012](decisions.md#wo-241-d008) preserve their causes and corrections:
copied fixture inputs, the future-consumer archive assumption, the planning
output inventory, generated-artifact ordering, and the target-worktree
metadata copy. The original consistency review missed those consumers and
the generation dependency. The executor owns that coverage gap; each later
repair review judged its own delta, not the whole implementation.

The first document gate refused the draft D007 and D008 dispatch fields
because they began with steering words instead of the required control
prefix. Those fields now name the original `resume: next` dispatch with a
short description of the steering; their decisions and evidence are
unchanged. The generated index was refreshed before the document retry.

self-review: found 4; fixed 4; recorded 0; rounds 7 (initial rounds 1 and 2, then five repair round-3 reviews); unreviewed 279 lines (post-pass handoff, measurement and dispatch/index text; zero implementation lines; executor-judged)

Round 1 found one criteria issue, one consistency issue and two design issues.
Round 2 confirmed all four fixes and found no new issue. The original round 3
was skipped because round 2 required no further code changes. Each of the five
repairs was under fifty changed source lines and received a fresh combined
round-3 review with zero findings. No reviewer ran after the complete pass.
The eleven local reports are:

- `docs/control/local/reviews/WO-241/round-1-criteria.md`, `round-1-design.md`, and `round-1-consistency.md`.
- `docs/control/local/reviews/WO-241/round-2-criteria.md`, `round-2-design.md`, and `round-2-consistency.md`.
- `docs/control/local/reviews/WO-241/repair-1/round-3-combined.md` through `repair-5/round-3-combined.md`.

The actual workers were Codex `spawn_agent`, `gpt-6.1-sol`, effort `max`.
These are assignment values, not effective-runtime readback. The canonical
Agent recorder incorrectly labels those returns with Claude defaults and
captures a recording-time tree; [D004](decisions.md#wo-241-d004) records the
limitation and the delayed round-1 snapshots. Explicit root accounting is
15 worker uses of the 20-use cap, including eight launches, four follow-ups
and three coordination messages; no descendants were launched. The runtime
counter's zero observed admissions is not a count of the actual workers.

The adjacent queue is revision 4 with no next item. Two separately scoped
issues are deferred with decisions and planning identities:

- [D003](decisions.md#wo-241-d003), `FUP-a0efaae1b9887fde`: the subagent runtime still reads the default budget path. The inventory now reports that actual behavior, including under relocated control roots.
- [D004](decisions.md#wo-241-d004), `FUP-1398fcdb63df23d2`: the Agent review recorder needs attested host/model/subject inputs.

The paginated touching-followups feed was read through its end: 23 textual
matches. The two new rows above retain their planning handoffs. The remaining
rows concern unchanged runtime ownership, cleanup declarations, role limits,
review-worker configuration, publication summaries or planning machinery.
The changes here do not implement or dispose those contracts. In particular,
`FUP-6dfaa29e3f0ba4fd` names this order as a possible future home for worker
limits, not an allocation; the current order's feature inventory leaves that
existing deferral in place. No new failure condition was observed for those
rows in this execution.

Release preparation and canonical integration assigned application target
`v0.114.0`; workspace component versions remain unchanged. `npm run sync`
found the selected evidence editions current, so no deterministic re-mint
or feedback episode was required. Main and HEAD matched before the passing
run, and its shared-ref snapshots remained unchanged. The final material
inventory reports no disposable nested repository. The gate and its evidence
wait have exited; no executor monitor remains running.

Goal alignment: the outcome matches the requested operator-readable feature
elections and inventory. The choice to report actual unread/default-path
behavior preserves compatibility; changing those readers is outside this
inventory's implementation and has a recorded reopening route. The
private-destination election preserves the ownership and credential floor.

Process cost: the handoff readback is available from the ignored harness
receipts, source `codex-transcript-counter`, scope `dispatch`, cutoff
`2026-11-03T21:16:59.410Z`; dollar cost is unknown. At that readback the phase
had used 5 h 12 min of its 8 h 0 min bound and six of twenty complete runs.
Final available token counters remain in the ignored receipt and operator
response. This handoff precedes the separate verification and final-review
dispatches.
