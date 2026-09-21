# WO-150 — Tinkerer economy on by default: the executor's economy experiment is equipped unless an order opts out, its role-text cost is measured against the cold-start ceiling, and the three-trial history is carried forward, because the trials adopted a method with no regression and the operator accepted the pre-registered proposal (version assigned at activation)

**Model:** any. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** minor. The compiled contributor loadout's
executor support default for `tinkerer-economy` flips to on; the generated
executor role text and the regenerated bundle change; the WO-145 baseline
fixture and the executor-supports tests are re-baselined. No kernel,
schema, gate, hook or authority change; the support's own paragraph is
unchanged. Assigned at activation under the standing opt-out default.
**Cost:** adds, to every executor dispatch that does not opt out, one
paragraph of role text (1,173 bytes by WO-145 D003's measurement: 23,347
equipped against 22,174 default at v0.33.2) and at most one experiment per
order inside 900 s, declinable with a reason. On 2026-09-21 the executor's
default cold start reads 23,154 bytes against the 24,576-byte ceiling
(WO-090's after-measurement), so the equipped figure is 24,327 and within
by 249 bytes; a breach follows the standing route. Removes the explicit
per-trial equipment step and the ambiguity it produced (WO-099 D008: the
third trial ran unequipped). Names no new saving in advance beyond the
three recorded per-iteration savings (58.7 s, 238.4 s, and 0.21 s with one
command removed). The dated acceptance for adding cost without a measured
removal is the operator's direction of 2026-09-21, captured verbatim in
ignored intake, on the pre-registered rule's condition being met.
Wall-clock, tokens and context bytes of the order itself are unknown until
run.
**Nomination provenance:** WO-145 D001's pre-registered reading, applied by
the 2026-09-21 standard pass (05-pattern-library.md §Candidate — Tinkerer /
Scientist, the three-trial reading); the operator's same-day answer, "make
tinkerer on by default unless there was a legit reason not to", captured
verbatim in ignored intake (SHA-256 in the ledger section); the operator's
2026-09-11 direction to prioritize the Tinkerer. Planner-synthesized. Opaque
identifier, not a priority. Clean-room screen: no stop condition.
**Depends on:** WO-145 merged (the support, its switches and the trial
record; closed, v0.34.0).
**Recommended placement:** its own one-entry slot directly after the WO-138
and WO-071 pair and before WO-147 and WO-148. It may run in the second lane
beside whichever of WO-138 and WO-071 is still open and must not make
WO-147 or WO-148 wait. It edits `packages/skeleton/src/loadouts/executor-supports.ts`
(`executorSupportDefaults`), `packages/skeleton/test/executor-supports.test.ts`,
`scripts/test-process-debt.mjs` (the WO-145 baseline case),
`packages/skeleton/fixtures/wo145-role-baseline.json`, the regenerated
bundle and product 05; WO-149 also regenerates the bundle and edits the
contributor loadout, so the two are sequential, never a pair. A
recommendation, not a dependency token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-145",
    "relation": "satisfied-by-close",
    "reason": "the support, its immutable switches and the three-trial record"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** `packages/skeleton/src/loadouts/executor-supports.ts`
(`tinkererEconomy`, `executorSupportDefaults`, `defaultExecutorSupportIds`,
`executorSupportIds`); `packages/skeleton/test/executor-supports.test.ts`
(the default-off assertions and the equipped comparison);
`scripts/test-process-debt.mjs` (the WO-145 role-baseline case and the
`harnessInstallation({ supports })` comparison); `docs/evidence/WO-145/decisions.md`
§WO-145-D001 (the pre-registered reading), §WO-145-D002 and §WO-145-D003
(the byte measurements and the Origin-comment distinction);
`docs/evidence/WO-099/decisions.md` §WO-099-D008; 05-pattern-library.md
§Candidate — Tinkerer / Scientist (the 2026-09-21 reading and acceptance);
`docs/control/budgets.json` (`coldStartBytes.executor`);
07-execution-guide.md §Goal-aligned decisions (the cold-start route, the
2026-09-17 pass's decision 11).

**Objective:** `executorSupportDefaults["tinkerer-economy"]` is `true` and
`defaultExecutorSupportIds` includes it; an order opts out with
`{ "tinkerer-economy": false }` and the briefing names the equipped
supports; the generated executor role text carries the support's paragraph
by default, byte-identical in both skill roots; the per-role cold-start
bytes are measured and reported against the ceilings, with a breach raised
by one 4 KB step under the standing route and recorded as a dated
acceptance; the WO-145 baseline fixture is re-baselined to the new default
with the opt-out comparison retained; and this order's decisions file
carries the three trials' history (three adopted methods, the last on
2026-09-20, no regression, zero experiments since) as the starting record
for later experiments, with no adaptive pressure.

**Observed gap (dated 2026-09-21, `main` at `502d85f9`):**

- `executorSupportDefaults` declares `"tinkerer-economy": false`; the
  executor-supports test asserts it is false and absent from the defaults;
  the process-debt case pins the default-off role bytes to the v0.33.2
  baseline (`wo145-role-baseline.json`).
- Equipment was explicit per trial, so the third trial ran without it and
  had to say so (WO-099 D008).
- The pre-registered rule's condition is met and the operator accepted the
  proposal (product 05, the 2026-09-21 paragraphs). The reasons WO-145
  D001 gave for rejecting default-on at the time, "method choices belong
  to the executor; defaults await the three-trial reading", are discharged
  by the reading; the executor keeps the choice through the opt-out and the
  decline-with-reason path.

**Design (scope discipline):**

- Flip the one default; keep the switch and the executor's decline path;
  change nothing in the support's paragraph or in any other role.
- The executor-supports test asserts the new default, the opt-out and that
  no other support changes; the WO-145 baseline case compares default-on
  files with the new release's bytes and opt-out files with the previous
  default, keeping D003's Origin-comment distinction.
- Regenerate both skill roots; measure cold start for every role; report
  the executor figure against 24,576; if a later reviewed rule breaches it
  in this order, raise the ceiling by one 4 KB step with the rule named, as
  the 2026-09-17 direction requires, never trim.
- Carry the history: the decisions file records the three adopted
  improvements with dates and sets the starting `history` values later
  experiment records read; no adaptive modifier, no cadence, no schedule.
- **Declined alternatives, recorded:** the adaptive pressure modifier now
  (a separate candidate that needs the fixed-cadence baseline the default
  creates); equipping other roles (the support is executor-only by design);
  leaving it optional (the operator accepted the proposal, and the only
  cost is bounded bytes and time the executor may decline).

**Deliverables:** the default flip; the test and fixture re-baseline; the
regenerated bundle; the cold-start report; the write-backs in criterion 4.

**Acceptance criteria (all required)**

1. Fixture: the defaults include `tinkerer-economy`;
   `contributorConfiguredProgram({})` equips it and `{ "tinkerer-economy":
   false }` removes it with every other support unchanged; the two
   generated skill roots are byte-identical.
2. Cold start: both roots measured for every role and reported against the
   ceilings; the executor figure is stated with its verdict; a breach is
   raised under the standing route with a dated acceptance in
   `docs/control/budgets.json`, never trimmed around.
3. The WO-145 baseline case passes re-baselined: default-on files match the
   new release's bytes, opt-out files match the previous default apart
   from the Origin comment, as WO-145 D003 distinguishes.
4. Write-backs land: product 05 §Candidate — Tinkerer / Scientist (equipped
   by default from this order's release; the opt-out; the history start);
   the decisions file carries the three trials' history and the operator's
   acceptance; the decisions index refreshed.
5. `npm test` green; `git diff --check` clean; no new dependency.

**Evidence gate:** the fixture transcripts and the cold-start report;
`npm test` once at final review. The first order dispatched under the
default after merge, recording an experiment or a kept-current decline in
its decisions, is the reopening observation.

**Write-back duty:** sources and reopening conditions in the order's
decisions file; the ledger is reserved for planning synthesis.

**Non-goals:** the adaptive pressure modifier and its bad-luck protection;
the other twelve quality aspects; changing the experiment paragraph;
equipping the verifier or reviewer; per-order token accounting for
experiments; any change to what an experiment may do.

**Operator-review assumptions**

1. Default on means every executor dispatch may spend at most 900 s and
   carries 1,173 bytes of role text; an order opts out explicitly.
2. A cold-start breach met by this order is raised under the standing
   route, not trimmed.
