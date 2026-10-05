# WO-186 cost and remaining-time record

Five before and five after-phase observations are retained for each required comparison. The after plain-gate and task medians pool three passes before the independent browser readiness repair with two after; they are not five-run final-source medians. The unchanged harness subcase retains its five pre-repair observations. Reviews pool the first two successful observations before the independent host-fixture repair and the next three at final source. The review median is also an after-phase comparison, not a five-run final-source median. These are ordinary-host-use measurements, including any observed parallel activity; they do not establish equal external load.

| Measurement | Before median, s | After median, s | Change, s | Change |
| --- | ---: | ---: | ---: | ---: |
| Harness subcase | 1.924 | 1.758 | -0.167 | -8.7% |
| Skeleton task in plain gate | 355.779 | 229.754 | -126.025 | -35.4% |
| Integration task in plain gate | 307.349 | 226.064 | -81.285 | -26.4% |
| Fresh plain gate, driver wall | 495.605 | 422.027 | -73.577 | -14.8% |
| Fresh review gate, driver wall | 506.452 | 814.813 | 308.361 | 60.9% |
| Document gate, recorded duration | 38.993 | 66.690 | 27.697 | 71.0% |

The document gate's row compares different samples (VER-001 R4, D036). Before: the main checkout's 140 passing `npm run test:docs` rows from 2026-10-01T00:04:16.363Z to 2026-10-04T16:23:39.155Z, 24 tasks each, with 31 failed rows excluded. After: this worktree's three passing rows at the final pre-repair identity `8f77f8bb…`, 29 tasks each, taking 62.149, 66.690 and 67.380 s; an earlier-source pass took 67.538 s. `resume`, one of the five moved suites, accounts for the rise: it takes 49.369 to 53.736 s, starts after the preflight checks and ends the critical path in every passing row, where `console-docs` ended it in 135 of main's 140 rows. The other four moved suites are not on that path.

Set beside the plain gate: at the order's count of seven document gates the rise is 7 × 27.697 = 193.9 s per order, against a measured 73.577 s less per fresh plain gate. If all three fresh product gates of an order were plain, that is 220.7 s less, so the document rise takes back 88% of it; that product is arithmetic on two medians, not a measurement. The final review runs the review selection, whose after-phase median rose on a different selection. The phases differ in task count, sample size and host load, and no whole-order time was measured.

Plain selection: 29 → 24 suites; added none; moved out `license-surfaces`, `resume`, `resident-bind`, `local-runner-double`, `artifact-corpus`. Review selection: 30 → 36 suites; added `configuration-root`, `authority-evidence`, `harness-fixtures`, `harness`, `harness-evidence`, `artifact-evidence`, `verification-evidence`, `feedback-evidence`, `runner-fixtures`, `process-debt`, `meta`; moved out `license-surfaces`, `resume`, `resident-bind`, `local-runner-double`, `artifact-corpus`. The moved document assertions run in the fresh document gate. Raw review walls therefore compare different selections; they are not an equal-workload causal speed comparison.

The final source identity before the VER-001 repair is `8f77f8bb26e21f212f2f7ffa1a9a098aaaa4a71f9c9d1184539c40f00618ee99`; every figure in this table was measured at or before it, and the repair's own gates are recorded in the handoff. measurements.json retains the five individual observations, task timings, selections, lane peers, host observations and failed/supplemental attempts.

## Measurement contract

D020 retains normal parallel work-order activity. Passing runs are never
removed or repeated merely for contention. Two-second process samples cover
concurrent Node tests, builds and bounded probes; other host work and activity
between samples remain unknown. The original baseline was mostly unsampled.
Internal shared lanes, peers and waits remain in the gate rows.

The canonical conditions listing ran during final plain observation 2. Its
application timer reports 31.779 s from 06:49:43.581Z; conditions.txt retains
the output. That read-only command includes fresh timing probes for plan
checks, source collection, release lists and index rendering under its existing
55-second budget. Its overlap is retained as known parent activity, even
though those commands are outside the process sampler's recognized patterns.

D023 uses the five actually executed skeleton and integration tasks in each
phase's five forced-fresh plain gates. The five standalone harness-subcase
observations remain separate. Original standalone suites, intermediate source
passes, failed attempts and the prematurely stopped review remain retained.
D026 pools the first three chronological plain passes before the independent
browser readiness repair with the next two passing executions after it. The
result is an after-phase median, not a five-run final-source median. The five
unchanged harness observations precede that repair; D029 retains two successful reviews before the independent host-fixture repair
and the next three after. The review median is also a qualified after-phase
comparison. Each observation retains its actual identity. A task's duration
is not gate wall time. Concurrent or nested durations cannot be summed into a saving.

The fourth attempted plain gate failed in 420.269 s because the browser
recovery fixture read a truncated progress document during its writer's
update. D025 confines the repair to readiness polling and a deterministic
test; missing or incomplete JSON is retried within the unchanged deadline,
while process-record errors and unrelated I/O errors still fail. The complete
browser suite then passed all twenty tests in 16.452 s under the bounded
wrapper. These costs remain outside the passing-run median; repair analysis,
documentation and waiting are additional session work, not measured savings.


The third attempted review failed after 815.174 s at the host fixture’s
detached-child assertion. Its exact historical cause remains unknown because
that fixture removed its diagnostics. D028/D029 repair a separately reproduced
readiness hole and preserve failure diagnostics. host-readiness-checks.json
retains 137.849 s of timed diagnostics, controls and repair checks,
including the final 34-test suite (61.894 s). The successful replacement
review is already included in the passing cohort. The added owner and handshake
change fixture work; their timing effect is unmeasured.

The prescribed passing harness/plain/review observations total 5389.651 s
before and 6207.764 s after. This is the benchmark workload, not an entire
work-order workflow, and review selections differ. The two failed gates in
the final after-phase series total 1235.443 s. measurements.json also retains
an earlier incomplete review that reached its outer-wrapper timeout after
900.119 s, with no recorded gate row; these three distinct failed observations
total 2135.562 s. The 16.452 s browser repair check
and the host-fixture checks above are recorded separately. Analysis, documentation
and unmeasured waiting are additional work. No hypothetical future reuse
saving offsets these costs.

## Cost-line reconciliation

| Cost-line item | Implemented behavior and observed boundary |
| --- | --- |
| About 180 s in the operator-release harness case | The premise was disproved. Five original standalone runs already had a 1.924 s median. Keep its 15 assertions and race protocol; report execution completion promptly so buffered delivery cannot masquerade as case time. The planted live-owner-release defect fails the intended assertion. Claim no 180 s saving. |
| About 150 s added to integration | Fixture clones omit unrelated release tags and branches while retaining real Git operations, generators, fixture-owned tags and all 215 assertion expressions. In the initial parent profile, 42 integration commands fell from 190.058 s to 117.571 s; total parent synchronous command time fell from 244.422 s to 167.207 s. These single-run nested diagnostics do not establish an additive gate saving. The final suite median is the acceptance observation. |
| A 170 s lock matrix | All eight cells use private roots and concurrency four. Profiling exposed 696 remaining synchronous child calls totaling 149.103 s, so discovery and restart calls now await owned asynchronous children. Every deterministic kill boundary, exact prefix, one-Lost and second-restart assertion remains. The diagnostic matrix fell from 162.564 s to 81.616 s; an intermediate shared plain gate measured 92.003 s. Final gate medians judge ordinary cost. |
| Full reruns after a failure or selection growth; historical 14 pairs / 8,384 s | Reuse only passing task observations at the same code identity, including a good task in an otherwise failed row. The second-shell fixture runs only its failed task and composes a claimable row with source pointers. Failed, partial, stopped and timed-out task observations never substitute for a pass. The 8,384 s historical total is exposure, not measured savings from this implementation. |
| Other fresh repeats at an already covered identity | The planning source attributed 16 such repeats since 2026-09-29, 8,555 s: nine had no untracked code and seven may have triggered the former interim untracked-code rule. This order fixes that identity gap and records forced-fresh reasons; WO-179 separately removed the verifier's procedural rerun. Historical records do not prove every repeat was unnecessary. `--again` and full review deliberately remain fresh. |
| A new worktree repeats main's gate | Read main's row through the common Git directory. The actual second-shell/linked-worktree proof starts no suite and leaves main unchanged at identical code; changing code runs the fixture. No production-frequency or aggregate time saving is inferred from that controlled proof. |
| Report-writing time lost while a product gate runs | Admit only the active order's records under the default evidence, verification and final-review roots. Product tasks fail on observed reads of those records. The permission and alias/descriptor fixtures establish this boundary; the parent prepared this report during a real product gate. No invented number of minutes or tokens is assigned to overlap. Mixed review and document gates still protect every input. |
| New identity, selection, observer and reporting work | Include untracked nonignored code, key the vocabulary input, reject unsupported source aliases, select review from the merge base, and record case durations/task provenance/planning growth. Extend the read guard to all product tasks. Duplicate guard installation and expensive absent-leaf traversal caused a measured guarded integration regression; D022's alias-preserving repair reduced the same guarded case from 69.297 s to 12.496 s. That is a diagnostic, not an independent gate saving. |
| Document assertions moved from product | Five suites move to the always-fresh document gate: license-surfaces, resume, resident-bind, local-runner-double and artifact-corpus. The three vocabulary readers remain product tasks with a keyed input. All eight suites actually named by WO-174 D013 are covered, despite the order's count of seven. The document gate's median rose from 38.993 s to 66.690 s with them (the table above); at seven document gates per order that is 193.9 s, set against the plain reduction there. |
| Re-mints and context | Deterministic artifact-identity, authority and verification editions plus generated harness/role roots retain their old editions. Feedback carries the already judged live audit because behavior is unchanged. No additional live episode or dependency. The measured cold starts are executor 29,237 bytes, verifier 25,735, reviewer 27,077, release-close 18,186, planner 20,004 and refuter 19,283. D016 records the sole verifier ceiling adjustment under the standing measured-bytes-plus-one-step authority. |

## Remaining assertion-bearing time

The after-phase plain-task medians are judged against 200 s for skeleton and 150 s for integration; both exceed those thresholds. The following profile preceding the independent host-fixture repair supplies criterion 1’s record of retained target assertions and observed sharing. It does not establish that every remaining instruction is irreducible.

The profile comes from required review observation 1, recorded 2026-10-05T07:58:48.611Z at af229ba815ff320fcf23943a45afc7c20dc55d7bc6c95d90b4a4e61d2f67a5af. host-readiness-source-delta.json proves that only the unrelated scripts/test-host-guard.test.mjs changes between that key and final source; the profiled target source is unchanged. This is not a final-source whole-gate profile. Its skeleton task took 228.875 s and integration 226.540 s. This review selects more machinery than the plain measurements. final-case-profiles.json retains every captured case, its task wall and peers; measurements.json retains external observations and unknowns.

| Resident case | Profiled review duration, s | Retained asserted behavior |
| --- | ---: | --- |
| Eight-cell acquisition-boundary matrix | 91.349 | Once/loop, lifetime/append, fresh/reclaim; deterministic SIGKILL boundaries, exact surviving prefix, exactly one lost episode, second-restart continuation and no recovery guard. |
| Polling acquisition kill/restart | 44.747 | Exact boundary trace, one dispatched and zero observed episodes before restart, surviving event prefix, and exactly one Lost afterward. |
| Thirty consecutive kill/restart rounds | 42.689 | Repeated once/loop process death, restart and exact prefix/lost-episode checks. |

Matrix cells take 35.654–50.214 s and overlap at concurrency four. Other skeleton files overlap the resident file. Nested case durations and task times must not be summed to infer elapsed savings. Ten-second subprocess bounds and 120-second cell deadlines remain; the actual-child cancellation fixture establishes reaping.

The 21-case integration suite collectively covers real Git merges, authored conflict and stash/recovery preservation, actual generators, continuation after generator failure, blocked PR/stub paths, symlink refusal, and release-collision recovery. Some cases are small direct checks:

| Integration case | Profiled review duration, s |
| --- | ---: |
| real Git fast-forward preserves recovery, histories and authored conflicts with real generators | 14.954 |
| real Git reviewed merge preserves recovery, histories and authored conflicts with real generators | 15.334 |
| three required refusals leave the tree, index, HEAD and recovery refs unchanged | 9.725 |
| an intent-to-add entry is refused before any write, and a failed stash leaves no pending receipt | 7.851 |
| a stash Git stores and then fails to finish resumes with --continue; --continue refuses intent-to-add entries | 9.479 |
| a later stash failure with nothing stashed restores the completed receipt it replaced | 12.770 |
| follow-up union preserves compatible histories and refuses divergent same-entry histories | 0.002 |
| untracked stash collision remains explicit and recoverable until continuation | 11.003 |
| WO-167 --continue judges the recorded phase while the uncommitted control log travels in the stash | 11.086 |
| WO-169 a first invocation with no authored conflict generates at once | 12.219 |
| WO-169 a pass whose generator fails keeps its checks and names the pending step, not a conflict | 9.448 |
| WO-086 a conflicted decisions record refuses the collision's record and writes nothing | 9.151 |
| WO-086 a retime that lands on a continuation is recorded once, in the stub the failed pass withheld | 13.494 |
| WO-086 a blocked PR directory preserves collision inputs for continuation | 13.735 |
| WO-086 a blocked PR file preserves collision inputs for continuation | 13.792 |
| WO-086 a stub blocked by a regular file retains its saved collision through continuation | 13.601 |
| WO-086 a stub blocked by a symlink retains its saved collision through continuation | 18.236 |
| WO-086 a stub blocked by a regular file with a newer tag during retry retains its saved collision through continuation | 15.816 |
| WO-086 a tag that lands after the stub is written is recorded once, by release prepare | 14.603 |
| WO-169 the integration record holds each release message as one line with one full stop | 0.001 |
| printed checks use the runner's declared machinery sources, including package code | 0.095 |

assertions.json preserves all 15 harness, 215 integration and 12 matrix AST assertion expressions, plus the unchanged matrix liveness helper. The final log-truncation mutant fails all eight matrix cells; the harness live-owner defect and integration release-line defect are also detected. The earlier command profiles in profiles.json explain the original cloning, observer and synchronous-child causes; they are supplemental to this retained case profile.

The fifth plain gate’s measured critical path is build, release preparation and its dependent release cases, then integration: 424.403 s, including 0.207 s of scheduler waiting. The target-publish task in the profiled review takes 144.973 s. Its five-plain-run median is 147.558 s before and 145.214 s after. The conditions listing’s 144.957 s versus a historical thirty-day 14.9725 s is therefore a longer-horizon growth signal, not evidence that this order introduced that cost. Integration’s historical comparison likewise does not isolate guard, changed tests or host/lane load.

Task time on the plain gate's other lanes grew while the gate's wall time fell (VER-001 R5, D036). Summed over the 51 release tasks, per-gate task time rose from a 354.286 s median (350.826 to 380.836) to 423.640 s (418.870 to 424.082), and the worktree task from 100.477 to 118.962 s, in the same five before and five after plain gates as the table. These are lane durations, not gate wall time. Four tasks carry 40.2 s of it: `runtime_refresh` 19.790 → 37.359 s, `material` 81.952 → 91.415, `concurrent` 17.681 → 25.700 and `success` 18.293 → 23.414.

The read guard's extension to every product task is not the main cause. In bounded scratch runs at the pre-repair identity it added 1.6 to 2.3 s to `release:case:runtime_refresh` (three alternating pairs; 15.7 to 16.9 s unguarded) and no resolved amount to worktree (two pairs, −1.0 and +4.1 s), with the tasks run alone under a one-minute load average of 4.0 to 6.2 before each run. In the gate rows, package tests guarded since before this order did not grow (kernel −1.6%, compiler −3.3%, console −4.6%), and `target-publish` shrank from 147.558 to 145.214 s although it is the newly guarded task with the most observed processes (561 to 564 distinct process ids per run in the retained read logs, which are ignored local files, by the analyst's count). The review row at `4c3632f07980` (2026-10-05T06:12:03.262Z) already applies the guard to the release tasks while the lock matrix is still serialized: skeleton 327.342 s, release sum 375.496 s, `runtime_refresh` 21.551 s, worktree 102.915 s. The last three are inside the before range; skeleton is 20 s below it and still serialized. The next recorded row, at `f181c507d17f` (06:37:38.504Z), is the first with D024's asynchronous matrix: skeleton 228.841 s, release sum 418.705 s, `runtime_refresh` 35.417 s, worktree 119.088 s, and every later row stays there. In the one row with case timings, 92% of the release growth falls on the 13 release tasks that overlap the matrix's window. That the concurrent matrix slows its lane peers is an inference from these rows: no controlled run isolated it, and whether the contended resource is processor or filesystem is unknown. About 4.7 s of growth on the 36 release tasks that end before the matrix window is unexplained.

The first after-phase review also selects machinery absent from its baseline selection, including these tasks that each reserve all scheduler slots: harness-fixtures 306.503 s; process-debt 98.846 s. Their durations are visible new selected work in that observation. The other added machinery and five suites moved to the document gate are listed above. No equal-workload causal review comparison was constructed, and these task durations are not subtracted to manufacture one.

The last standalone document-gate observation before later test-source repairs was 67.538 s at 2026-10-05T05:01:35.249Z. Three passing rows at the final pre-repair identity followed, at 09:43:49.996Z (62.149 s), 13:45:05.658Z (66.690 s) and 14:36:45.417Z (67.380 s); their median is the table's after figure. Five moved suites still execute there. Fresh plain/review selection changes, document work, failed attempts and real session effort prevent treating the plain reduction or hypothetical future reuse as a verified reduction of total work-order time.

## Gates of the VER-001 repair

The repair ran three complete review gates and none is part of the medians above. The first, recorded 2026-10-05T16:43:28.504Z at `8b9a1181…`, took 911.71 s and failed one task, `process-debt`, on a fixture that depended on the gate's process ancestry (D040). The second, recorded 2026-10-05T17:03:01.036Z at `5b87201e…`, passed in 899.61 s; a review of that state then found one more defect, so the third, recorded 2026-10-05T17:27:45.668Z at the repair's final identity `dea58b07…`, is the one the handoff stands on: 36 suites and 86 tasks fresh in 899.49 s. All three are longer than the after-phase review median of 814.813 s. In the third, skeleton took 241.188 s, integration 259.228 s, `harness-fixtures` 326.028 s, `process-debt` 102.239 s and the release tasks 452.461 s in sum, each 3% to 15% above its after-phase figure. A sibling worktree's gate and this repair's read-only reviewers were running on the host during the first two, what else ran during the third was not sampled, and the repair adds a marker preload to every `--test` task and further wrappers to the read guard; how much of the difference is host load and how much is the repair is not separated, and three observations of different code are not a median. The document gate took 67.357 s at an intermediate repair identity and 67.92 s at the final one, against 62.149 to 67.380 s in the three rows before the repair.

## Affected-input replay

replay.json retains 30 recent closed orders, of which 30 have attributable local release boundaries. The median affected task-time share is 100.00%. Weights are medians of three fresh review executions, drawn only from complete passing rows at the implementation's pre-repair identity `8f77f8bb26e21f212f2f7ffa1a9a098aaaa4a71f9c9d1184539c40f00618ee99`, recorded 2026-10-05T09:02:13.201Z, 09:15:43.198Z and 09:29:18.318Z. The replay has not been re-measured by either repair. These are distinct from the five-observation after-phase comparison. Relative imports, first-party workspace imports and literal paths are scanned; shell copies include all scripts and integration includes all code. Dynamic/native reads remain unknown, and an attributed release interval can include sibling changes. Version literals remain unnormalized and the graph is the implementation's task graph, so this result is not directly comparable with the earlier normalized 99% planning estimate. This is a conservative retrospective estimate, not an installed cache, task selector or measured wall saving.

## Register and accounting limits

close-register.md preserves allocations until close and gives a disposition
for every provenance row. The disproved harness premise leaves
FUP-331423b3559f5cfa's real selected-suite cost question pending. The after-phase
plain median of 422.027 s triggers FUP-e96221b106cd136a's above-360-second
reopening condition at close. The existing committed-input boundary remains
FUP-dc1335f4d10f6a75. The document gate's 66.690 s median passes
FUP-fb8cbeabbddef397's 60-second reopening condition; the document check alone
takes 11.787 to 12.872 s, under its 20-second condition. The order's carry-in
describes that row as open with the gate untouched at 38 s: the register holds
it as deferred, and this order's moved suites changed the gate.

Session work includes failed invocations, repairs, required repetitions and
waiting; it is not offset against hypothetical future reuse savings. Final
available token counters, their scope/source/cutoff and unknown dollar cost
belong to ignored usage receipts and the handoff response, not a new durable
counter estimate. The original implementation used exactly two explicitly
admitted critics, with no descendants and no second writer, as recorded in
implementation-reviews.json; automatic observation remains incomplete.
The current FINAL-001 repair used one writer and zero subagents.

## FINAL-001 repair observations

These checks repair correctness and are not new five-run performance medians.
The final forced-fresh review row at code identity
`3743c14b5afa554cf2517c23833d0bb807cc204f1ac9f637adcebbc9f1bcd718`,
recorded 2026-10-05T19:25:49.225Z, passed 36 suites and 86 tasks in
932.703 s with none reused. Code identity and build output stayed unchanged.
Its skeleton, integration, harness-fixtures and process-debt tasks took
254.003, 259.657, 333.471 and 120.168 s; release task durations totaled
467.960 s, which is lane work rather than elapsed saving. Recorded host-lane
wait was zero, while other external activity was not continuously sampled.
Four deadline diagnostics remain cause-unestablished; every task passed.

The first document attempt failed in 27.907 s on product 07's existing byte
ceiling, with dependent checks unexecuted. Compressing the same rules in place
restored 30 bytes of headroom without raising the ceiling. The next document
gate passed all 29 tasks in 66.971 s at 19:10:04.781Z; completion runs the
document gate again after the final records. The complete runner fixture file
passed 99 results in 51.894 s, and the full review's final-source runner task
passed in 65.618 s. repair-final001-checks.json retains the preceding red/green
checks, qualified timeout/cancellation probe, publication and planning checks.
These one-time repair observations remain separate from recurring operation.

## Operating value across fifty future orders

The order's purpose is recurring savings. Planning §4 identified fourteen
unchanged-identity rerun pairs costing 8384 s, where tasks lacking a pass were
9–36% of task time, and fifteen first gates on five corpus/document orders
costing 10129 s. Refutation receipt 038 accepted the removal case, with an
environment-identity finding, and explicitly treated the prescribed measurement
work as paid once; receipts 039 and 040 retain that verdict. These historical
costs support the opportunity rather than proving this implementation's savings.

For the operator's fifty-order horizon, use recurring plain/document changes,
eligible task/main reuse and report-writing overlap, with a comparable review
term. Do not count development or repair time as a penalty paid by each later
order, or use the unequal review selections' raw increase as a matched penalty.
No aggregate measured saving is available; that does not establish uselessness
or an irreducible test runtime.

One conditional calculation uses two fresh plain gates and seven document gates
per order, with the recorded phase differences treated as representative:

`50 × (2 × 73.577 − 7 × 27.697 + net reuse seconds/order − matched review increase seconds/order)`.

Across fifty orders this gives 7357.7 s less plain work and 9693.95 s more
document work: a 2336.25 s (38.94 minute) gap before reuse and matched review
effects. If the matched review delta is zero, average net reuse benefit of
46.725 s per order breaks even. With that same assumption, 100 s of net reuse
benefit per order would save 2663.75 s (44.40 minutes) across fifty; one
422.027-second gate avoided per order would save 18765.1 s (5.21 hours),
before its lookup overhead. Reuse benefit here counts only work beyond the
two fresh plain gates, so no invocation is both fresh and skipped.

The counts are illustrative. Phase workloads/load differ; actual eligibility,
reuse frequency, overhead, report overlap and matched review effects remain
unknown. The checks file keeps these assumptions and unknowns explicitly.
Historical development and failure costs stay recorded separately; no
hypothetical gain is booked as a realized offset. FINAL-001 marked the written
timing/profile criteria 1 and 9 met and failed criterion 3 on false reuse.
Completing this repair establishes the corrected behavior; the recurring
operating benefit is the whole order's investment case.
