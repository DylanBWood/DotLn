# WO-239 retained gate-failure audit

The audit covers 2026-10-26T15:47:18.000Z through 2026-10-29T15:47:18.000Z (UTC), a 72 h 0 min window. It inspected 2,622 retained record files across main and the registered WO-192, WO-235 and WO-239 checkouts: 299 unique check rows, including 88 failed rows. Twenty are structural companions; the other 68 are non-structural failed records, including stopped and focused runs. It scanned all 225 referenced failure-output files: 220 distinct top-level/failed-leaf references plus five intermediate `generated` aggregate outputs, now listed in the catalog's `intermediateAggregateOutputs`. Deduplicating both inventories by checkout and output reference reproduces the total. None was missing and no record failed to parse.

The [complete row catalog](gate-failure-audit.json) preserves every failed row, its checkout, timestamp, check, retained output reference, observed failure and classification. This is the retained scope, not a claim about deleted records. A failing assertion alone does not prove the cause was unrelated to product behavior. Mixed, stopped and unresolved observations stay labelled.

## Findings for the consistency brief

| Observed family | Concrete evidence and implication |
| --- | --- |
| Missed consumers of changed generated text and measured bytes | WO-236-D012 and row 54: `scripts/test-gate-followups.mjs` selected the old oracle, comparing 30,874 current bytes with 30,857 historical bytes. Row 39 still required two workers; row 45 pinned the prior emitted Codex paragraph. Trace both literal content and the oracle selector through every consumer. |
| Intentional exact contracts need synchronized expected data | WO-236-D010/D011 and row 53: the grant array omitted the authorized target-worktree effect. Keep the exact authority envelope, denied effects and historical hashes; update data from the requirement, never merely from observed output. |
| Output-shape and command-inventory drift | Rows 0, 1, 3, 6, 49, 55 and 80: lifecycle command phase, split test command, new status route, README command list, human duration parsing, target launch prefix and new planning field. Check every consumer of renamed, moved, added and removed output. |
| Incidental text, root inventory and measurement coupling | Rows 22, 26, 46 and 81: owner-file inventory, a punctuation pin, a sub-minute display expectation and two bytes of observed churn. Test the intended semantics and exact machine fields; normalize only incidental observations, preserving privacy and no-mutation checks. |
| Missing transitive fixture inputs | Rows 13, 19, 45, 63, 65, 72 and 74: copied/exported helpers omitted runtime modules, parser packages, facts or ledger inputs. Trace imports, copy lists, source manifests, fixture setup and export coverage together. |
| Declarations and generated write-backs | Rows 32, 44, 69 and 71 name missing machinery sources or JSONL protocol registration; rows 9, 60, 77 and 83 name stale indexes/locks. Check declarations and regeneration alongside their producers. |
| Host, lifecycle and timing assumptions | Rows 4 and 7 directly report memory-pressure refusal; rows 33 and 38 report containing-gate liveness. Row 37 only establishes a heartbeat assertion failure, not its cause. Keep fixture environment/lifetime assumptions explicit and do not mask real host refusals. |
| Actual defects and deliberate limits must remain visible | Rows 17, 56, 75 and 86 name scanner/API, command-adapter, module-loading and shell-scanner defects. Row 45 also exceeds an intentional plan-start size contract. These are not grounds to weaken assertions or call every failure stale metadata. |

Historical decisions checked as new inputs: WO-236-D010 through D018; WO-234-D008; WO-233-D044, D045, D047 and D052; WO-192-D071 and D074; WO-235-D011, D012, D018 and its target-briefing churn correction. These corroborate the named repairs; historical reports remain unchanged.

## Current-diff review targets

The consistency reviewer receives this audit after implementation/repair is complete. Its existing brief must trace changed documents, emitted instructions, summaries and helpers to their consuming tests by path, symbol, old/new text and counts. It must report concrete producer/consumer pairs, intentional contract pins versus incidental coupling, checked transitive inputs and any unsearched boundary. The executor procedure gains no duplicate audit checklist.

For this diff, inspect `contributor.ts` through both emitted skill roots, the WO-239 oracle, both cost consumers and instruction assertions; `release.mjs` and intake/removal summaries through every default-output and `--list-material` fixture; the new source-only preflight through the refusal-before-build cases; the two new helper exports/copy lists; machinery declarations; version/lock pins; product/kit/PLAYBOOK guidance; publication source locks; authority editions and decision indexes. Criterion attacks and structural design remain with their two reviewers. Current consumer tracing additionally found the overlap fixture injecting at the removed close call and the executor-supports test still requiring post-pass consistency review; both are corrected in this repair batch. Those later observations are outside the catalog cutoff.

## All non-structural failed records

| Rows (including structural companion) | UTC observation | Check | Classification and observation |
| --- | --- | --- | --- |
| 0 | 2026-10-26T17:14:11.885Z | npm test / review | expectation-drift: The post-review command-list assertion expected integration after that command had moved to the pre-review handoff. WO-192 decisions explain the shared expected array. |
| 1 | 2026-10-26T18:32:30.373Z | npm test / unspecified | expectation-drift: The historical command inventory still expected the single-file harness command after its two-file split. |
| 2 | 2026-10-26T19:10:31.672Z | npm run test:docs / document | record-validation: A decision dispatch exceeded its one-line control-prefix contract. |
| 3 | 2026-10-26T19:17:55.216Z | npm run test:docs / document | expectation-drift: Exact status-object expectations omitted the new route field; WO-192-D071 preserves exact checks with the authorized field. |
| 4 | 2026-10-26T20:12:03.651Z | npm test / unspecified | mixed: One failure is host-memory pressure in an exported instance; another is the review-listing expectation for harness-context. The two causes must not be conflated. |
| 5 | 2026-10-26T20:48:06.228Z | npm test / review | needs-cause-evidence: A preflight scheduling assertion failed. The retained assertion alone does not prove this was unrelated to behavior. |
| 6 | 2026-10-26T21:35:44.365Z | npm test / review | expectation-drift: The exported README consumer still required resume-docs after its command inventory changed. |
| 7 | 2026-10-26T22:10:38.619Z | npm test / review | environment: The nested document gate refused host memory pressure; no product assertion was reached at that boundary. |
| 8 | 2026-10-26T22:18:12.540Z | npm test / unspecified | stopped: The record says stopped by request and contains no executed failing case. It is not a diagnosed product regression. |
| 9, 10 | 2026-10-26T23:12:03.287Z | npm run test:docs / document | generated-drift: The lineage index and publication source lock were stale. |
| 11 | 2026-10-26T23:14:12.359Z | npm run test:docs / document | record-validation: Planning and work-order documents contained absolute home or temporary paths. |
| 12, 13 | 2026-10-27T02:11:14.488Z | npm test / review | fixture-dependencies: The synthetic-root inventory omitted its owner file, and a copied lifecycle fixture omitted a now-transitive built runtime import. |
| 14, 15 | 2026-10-27T02:15:28.807Z | npm test / review | fixture-state: The fixture treated the new runtime metadata marker as unexpected worktree dirt. |
| 16, 17 | 2026-10-27T02:16:50.139Z | npm test / review | code-defect: The declaration scanner called an unavailable getTokenPos API. This is an implementation defect, not a stale text pin. |
| 18 | 2026-10-27T02:29:09.310Z | npm test / review | mixed: Product-only cases read excluded budget input; prune fixtures also had owner/lane/terminal-row failures and old exact root inventories. These include behavior questions as well as fixture setup. |
| 19 | 2026-10-27T03:57:58.673Z | npm test / review | mixed: Broad release failures included missing copied runtime/source modules; other cases show owner-file inventory drift, target cleanup and update behavior failures. Blank shell failures remain cause-unestablished. |
| 20 | 2026-10-27T05:26:23.626Z | npm test / review | needs-cause-evidence: Several release shell cases failed with only their start line retained. Similarity to the previous runtime failures is insufficient to establish the same cause. |
| 21 | 2026-10-27T06:25:18.920Z | npm test / review | cleanup: No task assertion failed; the top-level retained output says fixture roots remain after teardown. The row records abandoned confinement roots. |
| 22 | 2026-10-27T07:12:08.092Z | npm run test:docs / document | expectation-drift: The console read-only file inventory omitted the fixture owner metadata file. |
| 23, 24 | 2026-10-27T12:29:32.877Z | npm run test:docs / document | formatting: Two newly authored evidence scripts failed formatting. |
| 25 | 2026-10-27T12:31:14.968Z | npm run test:docs / document | record-validation: Decisions and their generated index exposed absolute home paths. |
| 26 | 2026-10-27T14:13:13.770Z | npm test / review | mixed: Prune tests exposed live-capture and orphan-window behavior; one assertion also pinned an obsolete colon in the live-gate refusal wording. |
| 27 | 2026-10-27T14:29:07.448Z | npm test / review | code-policy: A test spawned Git outside the shared library; the policy check named its source file. |
| 28 | 2026-10-27T14:57:25.754Z | npm test / review | needs-cause-evidence: Instance-history failed a status assertion; the retained assertion alone does not establish an incidental cause. |
| 29 | 2026-10-27T15:06:29.375Z | suite:instance-history / single | cleanup: Instance-history found a stale coordination root after integration and close. |
| 30 | 2026-10-27T16:05:45.958Z | npm test / review | behavior-or-fixture: Source-change recovery reported transport-failed at launch-gate identity. Causality outside product behavior is not established by the log. |
| 31, 32 | 2026-10-27T16:44:55.646Z | npm test / review | declaration-drift: plan-refutation omitted the temporary-roots source from machinerySources. |
| 33 | 2026-10-27T17:04:41.888Z | npm test / review | fixture-state: A nested-root fixture expected a retention-window reason while its containing fixture gate was still live. |
| 34 | 2026-10-27T18:17:51.154Z | npm run test:docs / document | record-validation: New repair JSON records contained absolute home paths. |
| 35, 36 | 2026-10-27T19:15:47.064Z | npm test / review | mixed: The structural check found literal configured-document roots; the relocated legacy seed also missed rewriting its new ownership-helper import. WO-233-D047 records both repairs. |
| 37 | 2026-10-27T21:54:51.590Z | npm test / review | timing-unproven: The heartbeat case failed a boolean assertion. Timing is a suspected shape, not a proven host cause. |
| 38 | 2026-10-28T00:27:45.541Z | npm test / review | fixture-state: Synthetic temporary roots were judged under the containing gate rather than their intended scenario; failures repeatedly report containing fixture gate is live. Other nested-cleanup cases need their owner/lifetime contract retained. |
| 39 | 2026-10-28T01:08:52.634Z | npm test / review | expectation-drift: The role test still required the old two-worker implementation-only wording after the execution/fix three-worker rule changed. |
| 40 | 2026-10-28T02:08:24.795Z | npm run test:docs / document | record-validation: Three decision dispatch fields violated the compact control-prefix contract. |
| 41, 42 | 2026-10-28T03:46:52.835Z | npm run test:docs / document | record-validation: Reviewed release notes contained raw HTML forbidden by their profile. |
| 43, 44 | 2026-10-28T05:09:10.379Z | npm test / review | declaration-drift: harness-fixtures omitted off-ramps from machinerySources. |
| 45 | 2026-10-28T05:46:49.573Z | npm test / review | mixed: Duration-format and table-column assertions used old output; copied fixtures missed duration/gate-evidence/dispatch-bound modules; the plan-start 1 KB limit also failed. The size limit is an intentional contract, not a pin to discard. |
| 46 | 2026-10-28T07:17:34.794Z | npm test / review | expectation-drift: The lane-wait fixture expected text for a wait that rounds to zero minutes; exact numeric wait evidence remains required by WO-234-D008. |
| 47 | 2026-10-28T07:24:46.677Z | suite:resume / single | fixture-state: The off-ramp fixture reused an order already activated in its shared scenario. |
| 48 | 2026-10-28T07:28:02.391Z | suite:resume / single | authority: The extension attempt met the then-current own-executor exclusion. This is recorded authority behavior, not cosmetic drift. |
| 49 | 2026-10-28T07:46:00.941Z | suite:resume / single | expectation-drift: A usage test attempted JSON.parse on rounded human duration text. Numeric aggregates and display wording need separate assertions. |
| 50, 51 | 2026-10-28T12:54:09.230Z | suite:resume / single | formatting: Seven new or edited control and dispatch files needed formatting. |
| 52 | 2026-10-28T14:07:13.271Z | npm run test:docs / document | planning-state: A planning gate could not resolve one committed WO-236 authority file. |
| 53 | 2026-10-28T15:10:59.612Z | npm test / unspecified | expectation-drift: The exact Contributor grant array omitted the newly authorized target-worktree effect; WO-236-D010 and D011 preserve exact authority checks. |
| 54 | 2026-10-28T15:31:19.303Z | npm test / review | expectation-drift: The second role-cost consumer read the prior oracle: observed 30,874 bytes versus old 30,857; WO-236-D012 identifies scripts/test-gate-followups.mjs. |
| 55 | 2026-10-28T16:05:48.011Z | npm test / unspecified | expectation-drift: A target close fixture pinned the prior Codex launch prefix; WO-236-D015 ties the replacement to the original target-directory requirement. |
| 56 | 2026-10-28T19:34:30.161Z | npm test / review | code-defect: The dispatch-bound hook returned an advisory instead of a denial because command options lacked the needed effect adapter. |
| 57, 58 | 2026-10-29T01:57:54.664Z | npm run test:docs / document | record-validation: Reviewed release notes contained raw HTML forbidden by their profile. |
| 59, 60 | 2026-10-29T03:33:01.391Z | npm run test:docs / document | generated-drift: The lineage index and publication source lock were stale. |
| 61 | 2026-10-29T03:36:50.018Z | npm run test:docs / document | planning-state: The planning pass lacked its required refutation receipt. |
| 62, 63 | 2026-10-29T05:07:14.857Z | npm test / review | fixture-dependencies: Configuration-root fixtures could not load newly transitive planning modules and the Markdown parser. |
| 64, 65 | 2026-10-29T05:07:53.760Z | suite:configuration-root / single | fixture-dependencies: The focused reproduction still lacked work-orders.mjs and prettier in copied fixtures. |
| 66, 67 | 2026-10-29T05:09:07.085Z | suite:configuration-root / single | formatting: artifact-comparison.mjs needed formatting. |
| 68, 69 | 2026-10-29T05:09:45.618Z | suite:configuration-root / single | declaration-drift: The new directions JSONL protocol lacked a registration. |
| 70, 71 | 2026-10-29T05:15:24.771Z | suite:configuration-root / single | declaration-drift: process-debt omitted plan-subject.mjs from machinerySources. |
| 72 | 2026-10-29T05:24:02.070Z | npm test / review | mixed: The release-note reader seed omitted facts.json; a Stop fixture also lacked new answered-message setup. WO-235-D011/D012 describe the fixture repairs. |
| 73 | 2026-10-29T05:36:28.113Z | npm test / review | fixture-state: The older Stop scenario lacked the newly required answered-message setup; a later expected journal was absent. |
| 74 | 2026-10-29T05:51:51.382Z | npm test / review | fixture-dependencies: Several process-debt fixtures omitted direction-ledger.mjs from the copied helper closure. |
| 75 | 2026-10-29T05:57:58.009Z | suite:process-debt / single | code-defect: The runtime mixed synchronous require with an incompletely loaded ES module; the log names ERR_REQUIRE_ESM_RACE_CONDITION. |
| 76, 77 | 2026-10-29T06:00:11.327Z | suite:process-debt / single | generated-drift: The decisions index was stale. |
| 78 | 2026-10-29T06:03:45.622Z | suite:process-debt / single | behavior-or-fixture: The conversation-only fixture observed zero expected events instead of three; the assertion alone does not prove unrelated causality. |
| 79 | 2026-10-29T12:34:16.058Z | npm test / review | mixed: The planning output expected a prior shape; the legacy-update scenario also hit a README stash conflict. Preserve the update behavior question separately. |
| 80 | 2026-10-29T13:13:07.010Z | npm test / review | expectation-drift: The exact plan-start field list omitted the new document field; WO-235-D018 retains count and size contracts and asserts the named skeleton. |
| 81 | 2026-10-29T13:49:07.623Z | npm test / review | observation-noise: Equivalent target-briefing outputs differed in bytesWritten (2,845,900 versus 2,845,898); WO-235-D019 normalizes observed churn numbers while keeping keys and statuses. |
| 82, 83 | 2026-10-29T14:57:49.679Z | npm run test:docs / document | generated-drift: The decisions index was stale after handoff edits. |
| 84 | 2026-10-29T15:00:37.691Z | npm run test:docs / document | record-validation: A decision dispatch violated its one-line control-prefix contract. |
| 85, 86 | 2026-10-29T15:18:36.095Z | npm test / review | code-defect: The JavaScript scanner did not advance on shell source at byte 20899; WO-239-D008 records the language-boundary repair. |
| 87 | 2026-10-29T15:46:06.849Z | npm test / review | mixed: surfaceclose and surfaceclose_linked failed. Retained fixture records and the focused trace show a build before source-surface refusal; old full-path output assertions also needed compact-output updates. The executor stopped the remaining run. |
