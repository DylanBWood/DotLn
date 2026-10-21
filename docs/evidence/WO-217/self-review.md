# WO-217 executor worker reviews

The executor supplied the order and working diff to two fresh Codex workers,
both `gpt-6.1-sol` at `max`. They reviewed read-only. These are executor
self-review reports, not lifecycle verification or final-review verdicts.

The criteria adversary reported seven findings:

1. Operator-reserved efficiency and contribution-policy rows needed operator
   authority. D061 captures the operator's chosen bounded efficiency pass and
   retention of one exempt author. D053 and D054 apply those choices.
2. A candidate gate row bypassed its own task-validity checks. The shortcut is
   removed; `gate-self-validity` tests failed and malformed self rows.
3. Successful inherited-lease caching did not answer a failed entry lookup.
   One transient read retry is implemented; `inherited-entry-retry` removes it
   in the negative arm.
4. Capacity diagnostics needed consumer coverage. `capacity-diagnostic` now
   exercises `acquireHostLanes` and `memoryBudgets` as well as the parser.
5. Registration runtime remedies lacked a control. `registration-remedies`
   covers missing and stale compiled runtime.
6. The bare-group budget needed its requested synthetic-host guard fixture.
   `base-bare-group-budget` runs the actual guard loop at the base on a
   sixteen-processor, sixteen-GiB host model.
7. The malformed-snapshot clause lacked base evidence.
   `base-malformed-snapshots` runs both existing defensive cases at the base.

The design improver reported two findings:

1. Empty gate identities could make occurrence enumeration loop forever.
   Empty and non-string identities are filtered; `malformed-gate-identity`
   uses a child-process deadline to detect the failure safely.
2. An unknown single-dash suffix could borrow a plain gate's duration.
   `single-flag-identity` independently reverses the suffix correction.

Both workers reviewed the fixes and the fourteen wording changes. Their
follow-ups reported no new findings and no lost duties, exceptions, commands
or authority boundaries. The criteria adversary explicitly left control
execution and installed-role regeneration for the executor to finish.

The control results are filed in [repair-controls.json](repair-controls.json).
The operator subsequently requested an additional temporary attack pass.
The criteria worker ran 64 distinct cases. Twelve counterexample cases
identified four additional findings: completion's remaining own-row shortcut,
missing explicitly declared suites, command-prefix substrings, and negative
durations. All four were repaired. The unchanged temporary script then passed
all 64 expectations in three serial bounded commands, ending at
2026-10-21T03:15:45.809Z. All 30 lease/capacity cases passed in both arms.
[Temporary attack results](temporary-attacks.json) preserve the before/after
observations and replay source digests. Later formatting is outside that
replay cutoff; the current-source regression controls and final gates cover it.

The design worker also reviewed the final two register dispositions and found
one wording defect: the retention reopening condition narrowed the prior
general measured-harm trigger to unrequired captures. D058 now preserves the
broad weekly and measured-harm triggers and limits only the consecutive-order
capture clause, as its source does.

The final generated-skill match added FUP-ea83176e777dd32f under D065. Both
workers reviewed that addition. The criteria worker found one additional
conformance defect: a whitespace-only description met the old raw-length
check. Native validation now requires nonempty text after trimming; the
regression includes three spaces. Both scoped controls were replayed after
this correction and passed with the fix and failed without the respective
guard. The design worker reported no finding in this addition. No new worker
was spawned.

The final authority-reference change was reviewed by both existing workers.
The design worker found two issues: the sync fixture damaged the reference
with malformed JSON while expecting a stale-output regeneration, and a
symlinked destination ancestor could permit an outside write before the
reader refused it. The fixture now damages bundle metadata; the writer checks
its destination ancestors before writing either representation. The new
symlink fixture exercises both a full transcript and a reference and verifies
that the outside fixture directory stays empty. The criteria worker reported
no further finding in the two-row addition.

The design worker subsequently identified two scheduler defects in the eighth
complete review: a blocked row hid a ready exclusive from the drain guard,
and a structural-only aborted row advanced the source-change cutoff. D077
records both controlled failures, their repairs and the passing regressions.
The worker reviewed the resulting source and reported no new finding.

The final readback found one additional cutoff edge: a separate structural
companion could restore the excluded timestamp. D079 records the failing
companion control and the correction. The fixture-environment scoping in
D078 received a separate source review with zero new findings.

The criteria worker reported 12 distinct findings across all passes; the
design worker reported eight. All 20 are addressed. Executable controls and the
complete gate are the validation record; no self-review finding is deferred.
The order’s separately declared operator packet is a product-authority
disposition. No additional worker was spawned for these follow-ups.

## Final scheduling-policy readback

The same two independent workers reviewed the bounded D080 candidate after its failing-before and passing-after controls. The criteria worker found one overclaim that update-first necessarily reduces the tail; the design worker found one strict admission-order claim inconsistent with preserved measured-light overlap. Both product 07 statements are corrected: reduced tail is the aim, and update/export/seeds is the declared order while eligible light work may run first. Neither worker reported a code or test finding. The priority-contract caution before the edit was advice, not a defect count.

Cumulative distinct findings: criteria 13; design 9; total 22; fixed 22; recorded unresolved 0. The actual three fresh complete observations and final document gate remain owed at this readback cutoff; the scheduler replay is not passing gate evidence.
