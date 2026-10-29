# WO-234 repair 002 handoff

This repair addresses [VER-002](../../verifications/WO-234/VER-002.md) F4–F6.
Usage remains readable when dispatch standing is unavailable, with the named
journal error and host session readback. Restored history recovers the original
phase request and earliest anchor, including completion at the same timestamp
and reactivation. Complete selections refused by host admission consume no run;
admitted failures and interruptions still count.

The subject retains integrated main `22ce7799cce61db93f5852069dacf2409373adbd`.
Main and origin/main did not move before or during the complete run. Local
release preparation retains v0.102.0, compiler 0.33.0, skeleton 0.72.0 and
harness host 0.38.0; this repair adds no dependency or component bump. The
verification reports and their probe/evidence remain byte-identical to checkpoint
11. Work, intake and recovery refs are preserved.

These judgments apply at lifecycle recording. `repair-complete` must consume
both the passing complete row below and the final passing document row at the
handoff tree. The document check follows the last authored document edit.

**Criterion 1:** met — budgets and the kit template retain both dispatch keys,
consumer-local medians with the 8 h 0 min floor and original-start cutoff,
missing-key compatibility and old-export update behavior. The complete review
passed process-debt, harness, launchpad and their declared dependencies.

**Criterion 2:** met — standing retains all three ordinary states, both metrics,
null bounds, acceptances and missing-journal behavior. Restored marked history
recovers within its recorded attempt without rewriting journals or resetting
consumption. New cases cover completion, reactivation, timestamp ties and trimmed
acceptance-history callers. Harness fixtures passed; D025 records the two
independent review refinements.

**Criterion 3:** met — runner fixtures passed complete/review refusal, focused
admission and stop recording. [controls.json](controls.json) retains the paired
base controls. New real-runner cases establish that host refusals for memory
pressure or unavailable standing consume no run, while one admitted review
consumes one.
The counting matrix preserves admitted failures, interruptions and legacy rows.

**Criterion 4:** met — the complete review passed the wrapper refusal and
in-bound result cases. The original verification gate probe also confirms that
unavailable standing refuses a bounded launch while diagnostic selections remain
available.

**Criterion 5:** met — checkpoint, work-order, harness and runner suites passed
the typed scoped acceptance, captured authorization, finite/unlimited ceilings,
legal-phase refusal, expiry, projections and redispatch checks. Recovery reads
full anchor history independently of the current activation's acceptance events.

**Criterion 6:** met — usage catches standing failures at its output boundary,
keeps its observation and optional currentSession field, and names the unavailable
standing without inventing zero or unset consumption. The original entry probe
passed all 11 checks beside four damage kinds. The added CLI case covers Claude,
Codex and Copilot environment forms and restored history. The complete review
passed hook starts, overrides, Stop standing and role/grant preservation.

**Criterion 7:** met — complete meta/process-debt, harness, runner and planning
coverage preserves every exceeded metric as one stop, scoped acceptances and the
next same-order lifecycle event with delay. Older single-metric records remain
readable. D020's earlier repair remains intact.

**Criterion 8:** met — installed role roots and the oracle chain retain the bound,
standing command and routes. D005/D009 retain cold-start observations and accepted
ceilings. Generated, process-debt and role-oracle checks passed. The consistency
review checked current surface hashes, runtime pins and oracle parent digests.

**Criterion 9:** met — the six-refusal security and generated guidance remains
consistent across hosts. `npm run harness -- check` passed with 35 generated
surfaces. The complete generated/compiler/harness checks passed. Authority 009,
artifact-identity 002, verification 002 and feedback 003 remain current under
their existing evidence contracts. All 61 judged feedback sources are unchanged
from checkpoint 11, so this repair owes no new live feedback episode.

**Criterion 10:** met — product 07, the kit README and the maintained
[gate architecture record](../../architecture/gate-execution.md) describe the
built mechanism; D024–D027 record the decisions. Publication checks passed
255/255 headings with both editions current. The complete review passed and
`git diff --check` is clean. The final document check is required and consumed
at recording as stated above; no dependency was added.

[Complete validation](repair-002-validation.json):
`host-gate:7ad68947b597d2f0449c7add8183c679591384f9dbb3fd91222752af139ab2d4:npm test`,
recorded 2026-10-29T00:10:57.995Z. The first complete repair review passed all
45 suite groups and 111 fresh tasks in 0 h 36 min, with no reused tasks,
failures, unrun suites or stale artifacts. Code identity and build output
remained unchanged. Cleanup reported no blockers. A post-run census found no
nested repository outside preserved intake (node_modules excluded).

[Probe evidence](repair-002-probes.json) records 11 entry, 7 recovery and 4 gate
checks, plus the added regressions. The recovery section was rerun successfully
after the final source refinement. Damage and critical memory are synthetic
fixture conditions through the real readers and host checker; no live operator
journal was damaged and no live host-pressure result is claimed.

self-review: found 4; fixed 4; recorded 0

Three fresh independent codex-spawn-agent reviewers, selected gpt-6.1-sol/max,
returned [criteria 1/1/0](repair-002-criteria-review.md),
[design 1/1/0](repair-002-design-review.md) and
[consistency 2/2/0](repair-002-consistency-review.md), in found/fixed/recorded
order. All material refinements were returned to the responsible reviewer.
The same consistency reviewer cleared these final write-backs with no open
finding before the last document gate. Effective worker values beyond launch
metadata are unobserved.

Queued adjacent-0002 is completed at revision 11 with the complete passing row;
no queue item remains running or next. The three repaired VER-002 follow-ups are
settled at their current source revisions with that evidence and explicit
reopening conditions. Three workers were admitted explicitly,
with no descendants, within the cap of 20. Codex's observed count omits these
launches, so the explicit count does not claim full tool coverage; the uncounted
remainder is unknown. This repair used one complete run within its three-run
and 8 h 0 min bounds; no overrun acceptance was needed.

Goal alignment: the outcome matches the repair aim: diagnostic availability
and known consumption survive damaged history, without another lifecycle driver
or a change in authority. The NoOp, invented-budget and indiscriminate failed-run
exclusion alternatives remain rejected in D024–D026. Separate verification will
judge this repaired subject; this handoff does not revise an immutable verdict.

Attestation: codex-cli 0.165.0; model gpt-6-astra; effort max;
source codex-session-readback. Entry and handoff usage are available from
codex-transcript-counter with dispatch scope. Final numeric counters and cutoff
remain in ignored receipts and the operator response; USD cost is unknown.
