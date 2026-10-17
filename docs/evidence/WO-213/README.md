# WO-213 — Private paths in committed records

The executor's `resume: next` dispatch extends the existing forward-only
document screen to records and checks the planning and target write paths
before they write. Filed historical records stay as written; the follow-up
register's displayed source excerpts are corrected as projections.

## Base observation

Base: `7b66f8b303a316ff4560b4827d6dc728cd7f504a`.
[Before measurements](before.json) contain counts and repository-relative
filenames only. A literal home-prefix search of committed non-Markdown files
found 292 lines in 38 files: JSON 263 lines in 29 files, log 21 in 5, text 8
in 4, JSONL 0. The literal-prefix search found no WO-210 record.

The configured roots contained 3,555 tracked record files, totaling
217,704,060 bytes. Three bounded, sequential runs of
`node scripts/docs-check.mjs` took 23,253, 21,213 and 21,550 ms. Each passed
with 15 product documents, 412 historical link occurrences, 219 historical
private-path lines and zero failures. These are wall-clock measurements on
this host, including the existing document checks, with no timing threshold.

## Register correction

`npm run plan -- followups --sync` changed only revision 1's summary of
`FUP-de6162b279f66709`, from 700 to 680 characters. The before SHA-256 is
`56b7a86bc33f19b9f21e54dd42e53c62dad658a413f77c9f6e37173f2137fc1e`;
the after SHA-256 is
`440fbb3a6bcc19959a468bd35e06d9bdfa403af735b8c3f5f715767bcda121ab`.
[The correction record](register-correction.json) contains no source text.
All 1,115 entries kept their revision counts and dispositions. This entry
keeps its source hash, ref, title, missing flag, two dispositions and
`deferred` status. The follow-up command's readback confirmed one revision.

## Historical record baseline

[record-baseline.mjs](record-baseline.mjs) prints the proposed fingerprints
without writing a baseline; it requires each current matching line to consume
an identical line in its base blob. [The proof](baseline-proof.json) records
291 added lines in 37 files: JSON 262 in 28, log 21 in 5, text 8 in 4, JSONL 0.
All 128 existing entries (219 lines) are unchanged. Their serialized SHA-256
is `79a4b95f0635918f61b97f8f4d7f7336a77e2131af48c2a43fc90cf86d985b3c`. The corrected register contributes
no fingerprint. No matching WO-210 record was found.

These ten files were first committed after the Markdown screen landed at
`1aea2dea`. They breached the existing records policy, remain filed evidence,
and predate this order's base; no new or edited line is admitted.

| File | First commit | Lines |
| --- | --- | ---: |
| docs/evidence/WO-189/repair-002/markdown-fixtures-before.txt | 1154daa779bfb82deded4d77d65147beb71f3bcf | 3 |
| docs/evidence/WO-189/repair-003/class-probes-after.json | 1154daa779bfb82deded4d77d65147beb71f3bcf | 1 |
| docs/evidence/WO-198/repair4-before-transcript.txt | 5b5ae9459257409c4312f98338cfe9b8a07ee324 | 2 |
| docs/evidence/WO-200/review-gate.json | a37a1bb33e6075b33765a8b929abd6930b0c8ef5 | 1 |
| docs/evidence/WO-200/schema-before.log | a37a1bb33e6075b33765a8b929abd6930b0c8ef5 | 6 |
| docs/evidence/WO-200/schema-restored.log | a37a1bb33e6075b33765a8b929abd6930b0c8ef5 | 2 |
| docs/evidence/WO-203/action-value-before.log | 1c915c1ce1cee5a2b07345947cf66fbc29634593 | 1 |
| docs/evidence/WO-203/copied-fixtures.log | 1c915c1ce1cee5a2b07345947cf66fbc29634593 | 10 |
| docs/evidence/WO-203/launchpad-targeted-final.log | 1c915c1ce1cee5a2b07345947cf66fbc29634593 | 2 |
| docs/evidence/WO-203/repair-review-failed.json | 1c915c1ce1cee5a2b07345947cf66fbc29634593 | 162 |

## After measurements

[After measurements](after.json) record three sequential runs of
`node scripts/docs-check.mjs`: 22,976, 22,159, 22,727 ms.
Each passed with 510 historical private-path lines and zero failures.
The tracked subset contains 3,555 files and
217,728,202 bytes; the full tracked and untracked, non-ignored
record listing contains 3,562 files and 217,745,707 bytes.
These counts were captured before writing the after-measurement record itself.
The before count covered tracked files only, so the tracked subset is the
comparable scope. Three wall-clock observations per version establish the
measured cost on this host, not a causal timing estimate or a threshold.

[The negative baseline probe](baseline-probe.json) shows that a new matching
file, an edited matching line and an extra copy of a matching line all refuse
without changing the fixture tree or writing a baseline.

## Authorized instance repairs

The operator expanded this order to correct ordinary instance validation,
address the reported first-order failures, and support an instance release
name. [Decisions D008–D021](decisions.md) record that authority, the corrected
interpretation of sibling work, implementation choices and reopening conditions.
Ordinary instance plain/review gates select `kit-verify` and `harness`;
`test:docs` selects seventeen current coordination checks. Registered target
gates remain the evidence for sibling implementation. Installed-runtime bytes
also bind current gate claims and live publication.

The bounded checks exercise a real exported instance, source-free integration,
runtime and document drift, foreground CLI dispatch, balanced reader guidance,
linked-worktree metering, seed-amendment refusal, and custom release identity. The
release fixture verifies publication through a local forge stub and historical
regeneration after a later rename. Refresh fixtures preserve both a legacy
absent configuration and an explicitly configured display name.

[The host-wait diagnosis](host-wait-diagnosis.json) separates the observed
830,458 ms of scheduler waiting from validator execution and labels the
timing-based contention attribution as an inference. The repairs count initial
lock waits and retain bounded, path-free observations for diagnosing recurrence.

The later component changes reopen D007 through D013. The resulting
`FUP-9b7d3e0de0a4c268` is settled by the compatible compiler and skeleton patch
versions. This adds one source to the register after the 1,115-entry projection
measurement above; it does not alter those entries' revisions or dispositions.

[The worker review record](self-review.md) accounts for the original implementation's twenty workers and seven resolved final-pair findings: four initial findings and three from the later dependency audit. Actual generated surfaces and the complete selected snapshot bind consumer evidence. A source-free release preview now restores the reviewed carried runtime before validating it, using the preview installation even when main has an older runtime. The real export regression proves preview, preparation and altered-runtime refusal.

[Current evidence selections](../current.json) point to this order's authority revision 005, artifact-identity and verification revision 003, and feedback-003. The second repair re-minted them after rebuilding and emitting the changed registered runtime ([D036](decisions.md#wo-213-d036)); the live feedback audit remains carried by reference. [D038](decisions.md#wo-213-d038) advanced authority to 005 after the copied-fixture correction. The withdrawn validation expansion advanced it through 009 (D040, D041, D045, D052, D053 and [D063](decisions.md#wo-213-d063)); [D072](decisions.md#wo-213-d072) returned the selection to 005 with the code that revision binds, and revisions 006 to 009 remain as filed history. The other three edition checks remain current. Earlier editions and their generation decisions D020, D021 and D026 retain their historical subjects. D020 also records the canonical rebind of the corrected D012 dispatch prefix without changing approved scope.

The receipt-prefix correction also produced revision 2 of the new D007 reopening source. Its unchanged resolution was explicitly settled against that revision; all 1,115 original register entries remain preserved.

## Repair after the first final review

The final review failed on two findings and boarded sixteen follow-ups.
[D024](decisions.md#wo-213-d024) records the repair: an observed CLI
dispatch binding no longer keys the release-close publish admission, which
stays with the dispatch the harness records from the operator's phrase, and
the register's home placeholder substitution reaches a fixed point the record
rule passes. Fourteen follow-ups are repaired inside the Adjacent Repair bound
and two are deferred to planning; the adjacent queue holds each item's cause,
fix, paths, checks and passing results, plus the correction item the two
review workers prompted ([D025](decisions.md#wo-213-d025)), at revision 81.
The compiled runtime was rebuilt, the harness bundle re-emitted and the four
evidence editions re-minted ([D026](decisions.md#wo-213-d026));
`node scripts/harness.mjs check` passes at the new snapshot. The real-tree document check still passes with
510 declared historical home-path lines and no failure under the record rule
that now also reads a home path after a JSON escape sequence. The repair's
worker pair and the final gates are recorded in [the handoff](handoff.md) and
[the worker record](self-review.md).


## Repair after the second final review

[D031–D038](decisions.md#wo-213-d031) record this repair's choices and evidence;
D039 to D042 belong to the withdrawn validation expansion below.
The runtime inventory, snapshot copy/check, instance digest and source selection
now share one policy: metadata is excluded, genuine runtime bytes remain bound,
and executable permission is a boolean. The real exported-instance fixture
passed plain, document and review gates with metadata and mode variation on
2026-10-16T02:42:50.685Z, then checked evidence lookup and release restoration.
The separate publication fixture passed live freshness under the same harmless
changes and retained genuine-drift refusals.

The repair also closes callback cancellation, manual session upgrade and both
canonical-read failure boundaries; routes document readers through typed,
nonblocking, relative-error reads; and covers bare/case-variant record suffixes.
Adjacent cases preserve current-copy journal attribution, refuse malformed
optional declarations, preserve first-export configuration and reject release
names that cannot survive Unicode serialization. The rebuilt lane tests passed
seven cases and the complete foreground-dispatch case passed on 2026-10-16 at
02:43:51.834Z and 02:44:25.893Z. First-export/update/refusal coverage passed at
02:34:49.117Z. These focused results supplemented the second repair's gates;
the handoff now records the undo's final gates.

Four read-only workers audited the second repair, including the operator's
requested independent escape classification. Both earlier final reviews failed
at the preceding verification's code identity; the recorded integrations were
no-ops. The repair therefore targets untested invariants and consumer paths.
The full 72-row touching listing was traversed across ten pages; four rows were
settled and twelve reassessed deferrals recorded in D035. D037 records the
integration preflight's fixture and pending-step recovery corrections. The final
queue disposition and complete gate results appear in the handoff. Broader policy work remains on the named
planning rows rather than being represented as implemented here.

## Withdrawn validation expansion

The operator withdrew everything in this section on 2026-10-17
([D072](decisions.md#wo-213-d072)); it describes what was built and tried, not
the current subject. [The expansion's history](validation-expansion-history.md)
gives planning one account of its ideas, attempts, measurements and failures.

The operator then expanded the repair to remove repeated dependency bookkeeping
and duplicate preflight/full-gate work. Suite selection derived runtime
imports and literal entry-script inputs; module fixtures derived their relative
import closure. The [historical comparison](source-declaration-comparison.json)
covers all 307 literal manual declarations with none missing; the same rows then
needed 52 explicit declarations. Pinned evidence-input expressions are counted
separately. Structural failures
are rejected before expensive tasks. Bound individual-suite executions can
contribute to a complete gate, while changed subjects, invocations, prerequisites
and failed or incomplete observations require fresh work. The paired counter
fixture executes each required task once across targeted and complete requests;
the former forced-fresh sequence executes the targeted task twice. D039 records
the authorization and D040 the implementation and executable comparisons.

The operator-requested fifth worker reviewed the redesign as native
`claude-opus-5-5`. All four required findings are fixed; seven design
recommendations were applied and two existing design/policy boundaries retained
with reasons ([D041](decisions.md#wo-213-d041), [worker record](self-review.md)).
Task reuse bound the effective environment, guard subject, resource limits
and source build bytes. Document-reading tasks remain fresh. The
[real npm comparison](cli-task-composition.json) executes build, alpha and beta
once across two diagnostics and a full request. D041 also records correction of
the evidence selector from authority-005 to the already-validated authority-006;
the other three editions and console fixtures passed without replacement.

The complete review then passed 46 suites and found two watchdog logic cases
whose admission depended on ambient host memory pressure. [D042](decisions.md#wo-213-d042)
records their controlled health samples and new pressure-refusal/stop cases,
with real children and cleanup retained. The targeted suite passed while the
host still reported warning pressure; the pinned collector and real CLI checks
remain unchanged. That attempt's complete result is recorded in D042 and
VER-003; the handoff now records the undo's final gates.

The fourth repair closes VER-004's V4-F1 ([D049](decisions.md#wo-213-d049)) and
V4-F2 ([D050](decisions.md#wo-213-d050)) and, on the operator's directions, adds
multi-suite targeted selection through the complete gate's scheduler (D051,
D053) with live failure lines (D058) and a bounded deadline derived from the
selection's own task clocks (D060). The previous session also built a
compiler-based input analyzer (D053, D055 and parts of D056, D062 and D064). Measured on the real
selection it bound no suite, and its fallback marked every undeclared suite
non-reusable, so no preflight pass could reach the complete gate
([coverage](input-binding-coverage.json), [binding probe](input-binding-coverage.mjs),
[carry probe](input-binding-carry.mjs)). [D065](decisions.md#wo-213-d065)
records the operator's choice to remove it: declared inputs, the derived import
closure and the runner's own sources bind a declared suite across a fix, and an
undeclared suite is bound by the whole code identity and carried there.
[D066](decisions.md#wo-213-d066) records the operator's choice that a targeted
preflight stops at its first failure while the passes that finished stay
eligible. The verifier's own sequence, rerun against the repaired code, then
left the claim refused after the partial pass and the pass under another
contract until a pass under the failed contract follows
([probe](ver004-failure-mask-repaired.mjs), [result](ver004-failure-mask-repaired.json)).
The fifth repair ([D068](decisions.md#wo-213-d068)) and VER-006's three
failures ([D069](decisions.md#wo-213-d069) to [D071](decisions.md#wo-213-d071))
followed.

## Undo of the validation expansion

[D072](decisions.md#wo-213-d072) records the operator's direction to undo every
change related to criteria 15 to 19 and nothing older. The code was rebuilt at
its bytes before the expansion, checked against the code identity of the last
gate rows recorded before it, and one declaration the expansion had replaced was
added: `harness-fixtures` declares `scripts/lib/control-store.mjs`. The order,
product 07, the executor's generated guidance and the authority selection
returned with it. The retained probe scripts of the expansion import modules
the undo removed and no longer run against the current code. The final gates
are recorded in the handoff.
