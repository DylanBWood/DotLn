# WO-213 worker self-review

Twenty workers were spawned in the original implementation session, counted explicitly against that session’s twenty-worker budget. Every worker was read-only, with no executable probes, repository writes or descendants. Each used the prescribed Codex launch settings: fork without conversation history, gpt-6.1-sol, max effort. These are recorded launch settings, not an effective-effort claim. The executor remained the only writer and performed all checks.

| Worker | Scope | Disposition |
| --- | --- | --- |
| 1. criteria_review | Original privacy criteria | No finding on the original scope. |
| 2. design_review | Original privacy design | No finding on the original scope. |
| 3. instance_design | Consumer validation boundary | Used the runtime, coordination-document and sibling-subject distinction. |
| 4. instance_adversary | Consumer selection and freshness | Challenged default fixture selection and stale runtime/document reuse. |
| 5. lane_diagnosis | Historical host wait | Timing-supported contention inference; historical lease identity remains unobserved. |
| 6. release_identity_design | Instance release naming | Commit-bound configuration and preserved manifest schema. |
| 7. session_binding_design | Native hook/CLI session binding | Actual session/tool identity, conservative success boundary and preserved observations. |
| 8. recovery_meter_design | Moved-session observations | Registered-main lookup, shared-prefix handling and immutable closed snapshots. |
| 9. release_identity_adversary | Release history and refresh | Malformed custom annotations, historical rename and seed provenance boundaries. |
| 10. session_binding_adversary | CLI dispatch edge cases | Rejected wrapped/background/stale/failed dispatch observations. |
| 11. seed_amendment_adversary | Never-judged seeded order | Useful refusal and structured-decision route; no fabricated planning receipt. |
| 12. instance_gate_review | Implemented consumer selection/evidence | Fixed current installed-input evidence consumption and added real exported integration coverage. |
| 13. host_reader_review | Wait diagnostics and reader fallback | Fixed carried wait observations, retained-child reporting and lock-wait heartbeats. |
| 14. recovery_seed_review | Recovery containment and seed authority | Fixed supplemental observation-file aliases; strict journal parsing retained. |
| 15. release_identity_review | Implemented name/history/refresh behavior | Fixed explicit-null validation and recognition of malformed custom annotations. |
| 16. dispatch_implementation_review | Implemented CLI observer | Fixed combined diagnostic delivery, unrelated interleaved calls and asynchronous/interrupted results. |
| 17. privacy_evidence_review | Privacy, alias containment and evidence consumers | Fixed digest propagation, containment before selection reads and file-length framing. |
| 18. export_evidence_interactions | Real export/integration interactions | Fixed undeclared console-fixture selection and fresh configuration prose; recheck found zero remaining. |
| 19. final_criteria_review | Fresh final criteria adversary | Found 2; fixed 2; recorded 0; recheck: 0 remaining, 0 new. |
| 20. final_design_review | Fresh final design/maintainability review and post-gate dependency audit | Found 5; fixed 5; recorded 0; recheck: 0 remaining. Three findings came from the later dependency audit. |

## Fresh final pair

The final criteria and design workers received only the current work order and diff. Their four findings are resolved by [D019](decisions.md#wo-213-d019): actual generated-surface freshness, auxiliary-session CLI binding, release preparation/preview installation ordering, and complete snapshot identity. Each worker rechecked the repairs and returned zero remaining and zero new findings. Earlier implementation findings are resolved in D014–D018 and their executable regressions. No finding is deferred.

self-review: found 7; fixed 7; recorded 0

The six focused final-repair regressions passed. The real export, updated-console integration, actual older-main release preview/preparation and altered-runtime refusal passed. The final full review gate remains a separate required executor check and is reported in the handoff from its retained passing row. No static worker opinion substitutes for it.

Later executable checks exposed two old harness-fixture assumptions: borrowed package-directory symlinks and an overlay comparison between different installed runtimes. The executor corrected the fixture setup; all eight target-harness tests and all six overlay tests passed. The existing design worker inspected the corrections and related installation helpers, finding zero additional issues. Byte equality, exact overlay changes, envelope checks, repeated emission and runtime containment remain asserted.

The next expanded run exposed an excluded-directory read in worktree and release-close cases. Reusing the design worker for a dependency audit found three more issues: Codex fixtures also constructed an unnecessary installation, real target workflows reached the same broad package discovery, and the first declared-lock correction accepted malformed workspace values. All three are resolved in [D021](decisions.md#wo-213-d021); the worker's final static recheck reports five cumulative findings fixed and zero remaining. The affected product groups include worktree, release, Codex continuation, target publication, skeleton, vertical and portfolio. Complete runtime validation remains real, and the product-read guard is unchanged. The executor ran the affected groups through the guarded runner; their retained results and the final complete gate are recorded in the handoff.

The collected diagnostic batch also exposed a compiler-contract error in a trial printer-fixture simplification, an outdated legacy README setup, and two missing test declarations. The printer fixture retains its real pinned installation; declared workspace selection removes its excluded-directory read. The legacy fixture now uses its absent-configuration default, and both test inventories include the added inputs. These executor-found corrections are separate from the workers' seven findings. Both final workers inspected the corrections and reported zero new findings. The complete guarded worktree, release and runner-fixtures reruns then passed; the handoff records the final review gate separately.

## Repair review pair

After the first final review's findings were addressed, two read-only
`dotln-worker` agents reviewed the complete repair diff against the
pre-repair checkpoint, counted against the repair session's fresh
twenty-worker budget (two used; the prescribed Claude launch settings, with
no effective-effort readback). Neither wrote under the repository, ran a
gate or spawned descendants; their probes ran in their own temporary
directories. [D024](decisions.md#wo-213-d024) and
[D025](decisions.md#wo-213-d025) record what their findings changed.

| Worker | Scope | Disposition |
| --- | --- | --- |
| 21. repair_criteria_adversary | Criteria 3 and 12, the fourteen repaired follow-ups and the two deferrals | Found both blocking findings closed for their class: the substitution stable and match-free over 300,000 generated strings and every stored register revision, and the admission's field set only by the operator's phrase route in source, compiled runtime and the active snapshot. Eight items: the instance plain gate relabelled product without a read guard (fixed, D025); the build's bin mode unpinned (fixed); the staging remedy naming a removed directory (fixed); the observer's catch absorbing every failure (fixed, narrowed to the lifecycle's own refusal); escaped shapes the record rule still passes, the correct refusal unpinned beyond its shared comparison, the kit-root link layouts and the loop's quadratic cost on capped input (recorded in D024). |
| 22. repair_design_improver | Simplicity, fixtures, scope and maintainability of the diff | Fifteen recommendations; fourteen applied: one reader for every Markdown reader so a document refuses the same way, the display-name bound moved to configuration intake, the kind correction and its record, journal assertions for the dispatch pattern, the build's chmod pinned and tightened, the executable-bit comment, the reader-profile regular-file check, one name predicate and rule-level line matching, the shared digest comparison, order-free comments, the loop and look-behind comments, the observer helper, the predicate comment and the completed record. One recorded as declined: three fixture helper extractions that would widen the diff. |

self-review: found 23; fixed 18; recorded 5

The repair's focused suites were rerun after these changes and pass:
runner-fixtures, docs-check-fixtures, process-debt, configuration-root,
reader-fixtures, harness-fixtures and target-worktree. The document gate and
the full review gate are reported in [the handoff](handoff.md).

## Second repair audits

The second repair used four distinct read-only Codex workers, all launched as
`gpt-6.1-sol` at `max` with no conversation fork. These are launch settings;
no effective-effort readback is claimed. Existing workers were reused across
passes. None wrote files, executed probes or started descendants. The executor
ran the regressions and remains the sole writer. These four workers are separate
from the original twenty and the first repair's two, as corrected in
[D031](decisions.md#wo-213-d031).

| Audit | Findings carried into the repair |
| --- | --- |
| Runtime and document boundaries | Metadata selection and relative errors; malformed declarations; excluded-root inspection ordering; private diagnostic values; source-free dependency closure. |
| Gate and release design | Build-free source participation in the digest; exact inventory copying; preserved first-export configuration; a stale named-README assertion; ignored local configuration before publication. |
| Dispatch, waits and adjacent consumers | Cancellation cleanup; manual state-path presence; separate observation-read failures; stronger rejection/retained-observation test oracles; copied-prefix attribution; dangling optional inputs; Unicode serialization. |
| Independent escape classification, explicitly requested by the operator | Same-identity failures rule out integration drift. Authority composition, fixed-point behavior, semantic input selection, asynchronous/read boundaries and the test oracle explain the observed gaps; the exported consumer sequence needed executable coverage. |

Overlapping findings are grouped by invariant, not added to the earlier workers'
23-item total. The disposition of each group is in D032–D034; D035 records the
remaining planning dispositions. The executor's new tests also caught its own
wrong bin-path assumption, a malformed Git query in the first-export guard and
missing formatting before the copied kit's document gate. All were corrected
and their complete focused fixtures rerun. Static audit conclusions do not stand
in for the preflight and review gates recorded in the handoff.

The complete preflight exposed a mixed-revision integration fixture and two
recovery fixtures that expected preparation to bypass unreadable evidence.
D037 records the corrected fixtures, the early refusal proof and an additional
pending-step boundary repair. All nine required preflights then passed against
the repaired code on 2026-10-16, ending with target-worktree at 03:20:59.585Z.
These executor findings are separate from the four workers' static audits.

The first full-review attempt then found an omitted runtime-inputs dependency
in the skeleton control-beacon CLI fixture. D038 records its isolated failure,
the copy-list audit, the passing rebuilt fixture and the new authority edition.
The run was stopped through the canonical gate command and supplies no full-gate
pass; the later complete result belongs in the handoff.

The second full attempt found a missing machinery input declaration. The
operator expanded scope to remove the repeated dependency bookkeeping and the
mandatory duplicate preflight execution. D039 records that authority. The
executor's separate source and behavioral pass checked derived imports,
source-free consumers, historical fixture boundaries, task and build contracts,
missing/cyclic prerequisites, evidence recency and complete-claim admission.
D040 records the paired executable comparisons and the first complete runner
check's document-barrier, lease-capture and fabricated-evidence corrections.
Those corrections passed twenty focused cases. This is executor verification,
not another independent worker review; the count at that point was four.

## Independent Opus review of the validation redesign

Withdrawn on 2026-10-17: this section and the paragraphs that follow it
describe the review of the validation expansion, which
[D072](decisions.md#wo-213-d072) withdrew together with the mechanisms it
reviewed; the counts and dispositions stay as history and describe no current
mechanism.

At the operator's request, a fifth read-only worker reviewed the amended order,
the captured implementation diff and current source. It received no earlier
reports or evidence narratives. Native Claude `dotln-worker` startup and result
readback identify `claude-opus-5-5`, using CLI 2.1.301; effort `xhigh` was requested,
with no effective-effort readback. Its only observed tools were Read, Glob and
Grep. It made no edits, ran no probes and spawned no descendants. Five workers
have been used in this repair session, within its twenty-worker budget.

The executor reproduced counterexamples, applied the changes and ran the checks.
The worker did not re-review the final corrections. [D041](decisions.md#wo-213-d041)
records the source, tests, alternatives and remaining boundaries.

| Required finding | Disposition |
| --- | --- |
| M1: environment, guard subject and resource settings absent from task identity | Fixed: the actual filtered child environment and execution context are bound; changes between runs force fresh tasks and changes during a run refuse a pass. |
| M2: real-inventory test merely re-derived its own answer | Fixed: concrete dependency assertions and a retained comparison against 307 historical literal declarations, with none missing. |
| M3: later ambiguous single-suite rows failed to displace old passes | Fixed: all later ambiguous executions displace; prerequisites also require executed passes. |
| M4: canonical release-case contract concealed different actual arguments | Fixed: documented setup normalization and a separately recorded actual invocation digest, with an equivalence/reuse regression. |

self-review: found 4; fixed 4; recorded 0

This line counts the worker's four required findings only. Its nine design
recommendations have separate dispositions:

| Recommendation | Disposition |
| --- | --- |
| 1. Bind build bytes across composed rows | Applied: a consumer's source build digest must equal the current build output. |
| 2. Share attested builds between targeted diagnostics | Applied: the requested diagnostic stays fresh; a matching build may carry. |
| 3. Isolate targeted source discovery and validate the graph sooner | Applied: unrelated machinery imports cannot block a targeted diagnostic; graph validation precedes reuse and confinement. |
| 4. Traverse declared modules, excluded helpers' children and corpus scripts | Applied with explicit distinction between global file omission and suite-specific branch exclusion. |
| 5. Remove repeated derivation, expansion and overlapping predicates | Applied: shared resolved tables, expanded tasks and integrity predicates; unused self-confirming audit removed. |
| 6. Keep document-reading tasks fresh | Applied because document bytes are outside product code identity. |
| 7. Preserve per-task performance samples from diagnostics | Applied for intact bound single-suite rows; complete-gate timing still requires fresh complete executions. |
| 8. Reconsider the pinned scanner and repeated closure scans | Retained as a reviewed grammar contract; exported packages carry the exact dependency. Cache work requires measured cost and an invalidation design. |
| 9. Detect ANSI and escaped-solidus path shapes | Existing planning disposition retained on FUP-6125f53234c75af3 (D024 and D035); no new detection claim. |

The independent historical comparison and real npm CLI composition are retained
in [source-declaration-comparison.json](source-declaration-comparison.json) and
[cli-task-composition.json](cli-task-composition.json). The executor additionally
reproduced and fixed CommonJS fixture closure and unexecuted-prerequisite gaps.
The dependency/reuse group passed 25 cases and the context/performance group
passed four cases. Current complete-runner, document and review evidence belongs
in the handoff; these focused results and static review do not substitute for it.

The complete runner subsequently exposed six older cases outside those focused
groups. D041 records preservation of the aggregation/lease injection boundaries,
the confinement message's original-selection fix and omission of the unused
agent session label from offline child execution. All six existing assertions
remain. They and the new environment/context cases passed together in a ten-case
correction run at 2026-10-16T06:19:29.840Z.

The next complete attempt passed the application groups but failed two watchdog
logic cases at their native host-pressure admission. [D042](decisions.md#wo-213-d042)
records the executor's additional test-only repair: controlled health samples,
explicit warning/critical refusal and rising-pressure stop coverage, actual
children and cleanup retained, and no change to the pinned collector. This is
executed follow-through by the executor, separate from the worker's four findings.
