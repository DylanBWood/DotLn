# WO-282 implementation handoff

The update repairs are implemented. An emit recognizes unchanged generated Codex files through `main`'s recorded hashes after a starter merge; an update preview explains the conflicted manifest; runtime checks cover prior, incoming and pending files; history and stale-register refusals name their causes; and a newly re-keyed candidate keeps its current disposition history. The update guide and staged v1.2.0 release notes describe those behaviors.

This is the executor's handoff. Independent verification and final review remain separate phases. The final completion status is observed only after `implementation-ready`, as the order requests.

## Criterion judgments

**Criterion 1:** met — The complete review run covers harness-fixtures, including the WO-282 CLI emit/check and the existing WO-054 refusal case. [Recorded evidence](update-evidence.json) shows different old/emitted hashes, emit/check exit 0, refusal exit 1 and zero writes on refusal. The tests alter each of the three Codex files and check preservation before any write; nested-root and inherited-environment arms also passed.

**Criterion 2:** met — The complete run's launchpad suite passes the I6 preview assertions, runtime-union/removal cases and I1/I2 grafts cases, including an alternate grafts file. The recorded real CLI preview retains the bare manifest row below the instruction. D003–D005 and D014 identify the paths and assertions.

**Criterion 3:** met — The complete run's process-debt suite passes current carry, stale disposition, changed body, already-missing and deterministic projection cases, plus R3's removed-target stale revision and recovery apply. The recorded before/after projection has the old duplicate, preserved history/timestamps on the new row and pending count zero.

**Criterion 4:** met — `npm run test:docs` passed. The [update guide](../../KIT.md#taking-upstream-updates) states the manifest conflict choice, host-surface behavior, instance release-note contract and private-list forms with its First steps link. The obsolete `remove. rows` search has no matches; D003, D011 and D014 identify the write-backs.

**Criterion 5:** met — `npm test -- --review --keep-going` and `npm run test:docs` passed at the unchanged code identity recorded below. The complete review selection covers plain `npm test` and the declared product preflights through the canonical gate lookup; the briefing selects no additional plain run.

## Validation

Complete review: exit 0, recorded 2026-11-16T08:46:10.834Z; code identity `f6f4596eaa1a4dda49bcfc16a850832b3161d1b880423f574bee804eaee89030`; 122 fresh tasks; no unrun suites; code and build output unchanged. Canonical evidence: `host-gate:f6f4596eaa1a4dda49bcfc16a850832b3161d1b880423f574bee804eaee89030:npm test`. The row covers the structural checks and all declared product preflights. Run 1's compatibility inventory omission, run 2's fixture failure and run 3's dependency omission are retained in D017, D018 and D020. The sync-fixture repair's single-case probe also passed, as did the declaration check after its dependency was added.

Document validation: `npm run test:docs`, exit 0, 29 fresh tasks, recorded 2026-11-16T08:54:18.164Z; candidate tree `0106668af846313c15a4df703755deae805c8b7f`; document projection `1ec85a10954dff34607433671c5fcd3c0a270990` excludes only `docs/evidence/WO-282`, so these final evidence write-backs retain the row. Canonical evidence: `host-gate:f6f4596eaa1a4dda49bcfc16a850832b3161d1b880423f574bee804eaee89030:npm run test:docs`.

Local-terms review: `node scripts/terms.mjs branch` passed with 29 changed files screened, zero refuse findings and zero context findings. Zero context lines required reading; the private list was not printed.

The required [update evidence](update-evidence.json) was regenerated at its recorded observation time from actual emit/check/preview commands and follow-up projection. The later gate repairs change only the Git-form inventory, sync fixture setup and its suite dependency declaration; the three implementation modules it copies have not changed since that observation. The evidence generator removes its temporary clone in `finally`. The worktree material inventory returned no nested repositories both before the complete rerun and before the document gate.

## Independent reviews and remaining limits

self-review: found 21; fixed 9; recorded 12; rounds 2 (round 3 skipped after documentation-only fixes); unreviewed 559 lines (delta since round 2 through this handoff, before completion; failed-gate repairs and executor records)

The unreviewed count is added plus removed lines against the round-2 tree, including this handoff and the generated index.

| Round | Scope | Distinct findings | Fixed | Recorded | Reports |
| --- | --- | --- | --- | --- | --- |
| 1 | Paired criteria, design, consistency and combined review | 15 | 8 | 7 | `docs/control/local/reviews/WO-282/since-fa545b24a285/round-1-criteria.md`, `docs/control/local/reviews/WO-282/since-fa545b24a285/round-1-design.md`, `docs/control/local/reviews/WO-282/since-fa545b24a285/round-1-consistency.md`, `docs/control/local/reviews/WO-282/since-fa545b24a285/round-1-combined.md` |
| 2 | Four fresh rechecks, each given its own prior report | 6 | 1 | 5 | `docs/control/local/reviews/WO-282/since-fa545b24a285/round-2-criteria.md`, `docs/control/local/reviews/WO-282/since-fa545b24a285/round-2-design.md`, `docs/control/local/reviews/WO-282/since-fa545b24a285/round-2-consistency.md`, `docs/control/local/reviews/WO-282/since-fa545b24a285/round-2-combined.md` |

Round 1 read tree `38522dabf23c117b6d5415dc7409be5f80bb7dcc`; round 2 read tree `26563b5e925ff239430df79144245cd24e5a48bd`, both against base `b77e5173ec8564f3f1f0ddda432edac53ad9098f`. All eight host readbacks were `claude-opus-5-5`, selected effort `xhigh`, effective effort unknown. D013–D016 record the unions and corrections. The consistency reports contain their Traced consumers tables and identify read-only or refused command boundaries. No third round was owed for the round-2 record-schema correction. After the ladder, the complete gates judged the one Git inventory line, five sync-fixture setup lines and one suite dependency line; these were not independently re-reviewed. Later executor evidence, critic records, handoff and generated-index lines also count in the stated delta. Automatic completion projections and the specifically required post-transition status capture are outside that count's cutoff.

Recorded limits matter when using the changes:

- The ownership extension covers `.codex/`. A future removal of other generated host paths may require the D002 reopening. A full emit in a linked-worktree fixture remains untested; the exact Git lookup was checked in this gitfile worktree.
- Conditional merge advice also appears in applied from-core output. A changed pending-only runtime file receives a generic runtime diagnostic without its own plan row. The runtime guard still blocks executing its altered bytes.
- A carry is limited to a unique pair created and retired in one projection with unchanged body and section and a current prior disposition. A carry on one branch concurrent with an authored old-row disposition on another may require authored resolution under the existing union rule. The duplicate's timestamp preserves the prior disposition's time, not the time of re-keying.
- The order's no-tightening header conflicts with its required runtime guard. D013 and the release notes disclose the stricter byte-trust boundary; the filed classification and criteria were not changed.
- The release-note summary omits the private-list `review:` alias, while the changed guide states it. The fixture evidence copy list covers the current three modules and must be updated if later implementation moves to another module. D016 records both limits.
- The roadmap table is generated through a recorded boundary and may intentionally lag the tag inventory. D018 replaces D013's incorrect curated-table premise. The sync test now establishes a reconstructible table before testing loss of that record.

The two requested conduct critics ran on host-reported `claude-opus-5-5` with selected `xhigh`. Their complete reports were delivered before responses. [Criticisms](criticisms.md) and D015/D019 record the judgments; the second was deferred during run 2. The next critic fell due during run 4 and was held; the cadence ended at the passing complete run, and the owned timer was stopped before handoff. Eight review uses and two critic uses are known, with no descendants.

## Attestation, goal and usage

Executor: `codex-cli` 0.169.0, model `gpt-6-astra`, effort `max`, source `codex-session-readback`. This records the actual host observation rather than the order's suggested effort.

Goal alignment: the supported update paths remove the two reported manual repairs while retaining byte-based ownership and current-source disposition checks. Doing nothing would preserve those failures; path-only ownership could overwrite operator changes; indiscriminate disposition transfer could close a changed item. The implemented hash/identity checks and the refusal/negative-case evidence address those traps. The explicitly recorded concurrent and historical limits bound the outcome.

Usage: the available executor counter comes from `codex-transcript-counter`, scope `dispatch`; the handoff observation cutoff is 2026-11-16T08:54:19.471Z. The final totals remain in ignored session receipts and the final response. Separate review and critic provider usage is not aggregated into that counter. Validation made four complete-run attempts: two stopped in structural checks, one completed with a fixture failure and one passed. The harness budget counter counts the two fully executed complete runs; none of the failed results was composed into the passing row. The single focused sync-case run established the repair before the third complete run, whose missing suite declaration was then repaired before run 4.
