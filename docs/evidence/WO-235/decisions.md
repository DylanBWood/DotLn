# WO-235 decisions

## WO-235-D001 — A turn ends only with every operator message answered (operator-authorized amendment after receipt 056)

```json
{
  "id": "WO-235-D001",
  "date": "2026-10-27",
  "dispatch": "planning: FIX THE BULLSHIT FROM WO-192 … (the 2026-10-26 pass, after receipt 056); operator-authorized amendment of the judged order",
  "decision": "Amend WO-235 so that, under Claude, the Stop hook refuses to end a turn while the session journal holds an operator message (never a host task notification) newer than the last direction-ledger entry of the dispatch, naming the unanswered message indexes; the reply that ends the turn answers all of them, so a burst of messages is answered once, after its last, and a message that arrives mid-turn cannot be dropped. `operator override:` suspends it as it does the other refusals. Under Codex and Copilot the rule is role text. The executor reads the host's Stop-hook page for the blocking form and records it.",
  "operatorAuthorization": "The operator directed on 2026-10-27 that when two or more messages arrive in a row the role must not answer each individually but wait for all of them, asked how this recurring issue gets fixed permanently, and then said the session's reply had tangible errors. Captured verbatim in ignored intake, SHA-256 6baae3cbbd738603fad5a6e38caa1753302561399b42cdf9ffa4aecb50806d93 (items 7 to 13).",
  "evidence": [
    "The pass's own record: four operator messages observed between 00:19:13Z and 00:19:24Z and a fifth at 00:19:29Z, after the session had answered the message of 00:19:02Z alone; earlier, the messages of 00:17:26Z, 00:17:48Z, 00:18:14Z and 00:18:31Z were each answered individually",
    "packages/skeleton/src/harness-host.ts 1239 to 1253: the prompt hook journals every operator message with a digest, bytes, class and source; 5689: the Stop hook prints advisories and refuses nothing about messages",
    "the host starts a reply on each message when the role is idle, so only a refusal to end the turn can hold a burst together; a timer in the role cannot",
    "WO-235's direction ledger already gives each message an entry and refuses completion on a missing one; the turn-end refusal is the same check at turn granularity",
    "receipt 056 judged WO-235 aligned-with-findings with no hold; this is a bounded change to one hook judgment and one criterion, recorded through the execution-amendment route"
  ],
  "rejected": [
    { "option": "A waiting period in the role before replying", "reason": "The host starts a turn per message when the role is idle; a habit cannot hold the turn, and the operator asked for a permanent fix, not a habit." },
    { "option": "Refuse every stop until the operator says the exchange is done", "reason": "A lockout; the refusal names only messages without a ledger entry and admits the stop once they have one." },
    { "option": "Count host task notifications as messages", "reason": "Receipt 056's finding on criterion 1: the journal records them under their own source, and they are not the operator's words." },
    { "option": "NoOp", "reason": "The operator's explicit direction; the burst failure recurs in the record of this very session." }
  ],
  "reopenWhen": "A Stop refusal names a message the operator did not send, or a burst is answered in pieces after the rule lands, or the host's Stop hook stops admitting a blocking decision."
}
```

## WO-235-D002

```json
{
  "id": "WO-235-D002",
  "date": "2026-10-29",
  "dispatch": "resume: next",
  "decision": "Implement the authorized record-then-check design. Match every indexed message by digest and session, including holes before later answers; exclude host notifications and unobserved Codex messages. Keep a session-wide monotonic index and bind planning startup to its document. Classifications remain role judgments. NoOp leaves unanswered messages admissible; rule beating and shifting the burden change the implementation toward checked answers rather than prefix inference.",
  "evidence": [
    "docs/work-orders/WO-235-no-artifact-shaped-by-its-predecessor.md: Objective and execution steps 1–4, 10–11",
    "packages/skeleton/src/harness-host.ts: recordOperatorMessage already records digest, attribution and source but no messageIndex",
    "scripts/resume.mjs: completion routes had no direction check"
  ],
  "rejected": [
    "Latest-index-only matching can overlook an earlier hole.",
    "Index and digest without session binding can confuse repeated dispatch phrases across sessions.",
    "Natural-language classification in hooks would claim judgment the hook cannot make."
  ],
  "reopenWhen": "An observed message is attributed to the wrong dispatch or a valid answered message is refused."
}
```

## WO-235-D003

```json
{
  "id": "WO-235-D003",
  "date": "2026-10-29",
  "dispatch": "resume: next",
  "decision": "Compare each artifact class against passing evidence in the previous twenty closes; order files also match track. Report unknown where evidence is absent and keep the comparison advisory. A closed lifecycle precedes merge, so PR comparisons require reachable merge history. Planning comparisons use the receipt revision and the linked registration record. Shape follows the contract; no inherited section template or byte ceiling.",
  "evidence": [
    "scripts/lib/control.mjs: FinalReviewCompleted closes a lifecycle before publication",
    "scripts/lib/plan-receipts.mjs: addressed receipt holds and committed subject revision",
    "docs/product/07-execution-guide.md: Standard artifacts and Discipline"
  ],
  "rejected": [
    "The newest instance normalizes drift.",
    "A hard byte ceiling can suppress required content."
  ],
  "reopenWhen": "A comparator includes failed or unmerged evidence, crosses tracks for order files, or no longer represents the same contract."
}
```

## WO-235-D004

```json
{
  "id": "WO-235-D004",
  "date": "2026-10-29",
  "dispatch": "resume: next",
  "decision": "Use Claude Stop JSON decision:block with a reason and exit zero; re-evaluate unresolved messages on reentry and retain the writer until answers exist. Operator override remains the existing wrapper bypass. The host applies its own continuation limit; this mechanism cannot guarantee grouping future messages after an already admitted stop.",
  "evidence": [
    "https://code.claude.com/docs/en/hooks#stop-decision-control",
    "Context7 /websites/code_claude, fetched 2026-10-29: Stop decision and stop_hook_active",
    "packages/skeleton/src/harness-host.ts: finish releases writer only after the new check"
  ],
  "rejected": [
    "A timed delay cannot observe future messages.",
    "Always admitting stop_hook_active would drop an unanswered message."
  ],
  "reopenWhen": "The host changes its Stop protocol or a reentry refuses after the ledger is current."
}
```

## WO-235-D005

```json
{
  "id": "WO-235-D005",
  "date": "2026-10-29",
  "dispatch": "resume: next",
  "decision": "Re-mint the role oracle from harnessInstallation at both economy settings because the shared shape, ledger, correction and consumer-review duties change generated roots. Preserve the preceding oracle and its branch/upstream hashes. Measure installed instruction-plus-skill bytes before and after. Accept any crossed startup ceiling at measured bytes plus 4096 under the existing product 07 route. Skeleton 0.73.0 and harness host 0.39.0 add behavior; other components retain their versions, with the console dependency pin following skeleton. No package publication.",
  "evidence": [
    "packages/skeleton/src/loadouts/contributor.ts: targetRoles shared duties",
    "docs/evidence/WO-235/cold-start-before.json",
    "docs/evidence/WO-235/cold-start-after.json",
    "packages/skeleton/fixtures/wo234-integration-role-baseline.json",
    "packages/skeleton/fixtures/wo235-role-baseline.json"
  ],
  "rejected": [
    "Rewriting an older oracle would destroy independent history.",
    "Trimming a reviewed duty to a byte ceiling would change its contract."
  ],
  "reopenWhen": "Generated root hashes or measured startup bytes differ, a consumer misses the new duty, or the additive compatibility assessment changes."
}
```

## WO-235-D006

```json
{
  "id": "WO-235-D006",
  "date": "2026-10-29",
  "dispatch": "resume: next; release prepare",
  "decision": "Assign application target v0.103.0, the next minor above the observed release baseline v0.102.0, to the heading and the README version claim.",
  "evidence": [
    "release baseline v0.102.0 (ancestral local release tags, excluding annotated starter refresh tags)",
    "minor classification declared in docs/work-orders/WO-235-no-artifact-shaped-by-its-predecessor.md"
  ],
  "rejected": [
    {
      "option": "An activation-completion paragraph in the roadmap",
      "reason": "The tag is the record and the roadmap's release history is generated from tags (WO-086); this decision keeps the base and the classification."
    }
  ],
  "reopenWhen": "The observed baseline or the classification changes before publication; a later collision is recorded as its own decision."
}
```

## WO-235-D007

```json
{
  "id": "WO-235-D007",
  "date": "2026-10-29",
  "dispatch": "resume: next",
  "kind": "correction",
  "misread": "Treated the tracked decisions file as absent and wrote a new D001 over the existing amendment.",
  "meant": "The committed D001 is the operator-authorized Stop amendment and must remain byte-exact.",
  "changed": "Read HEAD:docs/evidence/WO-235/decisions.md, preserved those original bytes, appended new decisions as D002\u2013D006, and corrected their references. No branch commit or publication occurred.",
  "decision": "Preserve the original amendment and append execution decisions; inspect tracked evidence before creating an output with the same path.",
  "evidence": [
    "git show HEAD:docs/evidence/WO-235/decisions.md: original D001 dated 2026-10-27",
    "docs/work-orders/WO-235-no-artifact-shaped-by-its-predecessor.md: amendment D001 and its planning receipt binding"
  ],
  "rejected": [
    "Leaving a different D001 would invalidate the operator amendment provenance."
  ],
  "reopenWhen": "Any prior decision or amendment is missing or changed in the final diff."
}
```

## WO-235-D008

```json
{
  "id": "WO-235-D008",
  "date": "2026-10-29",
  "dispatch": "resume: next",
  "decision": "Resolve the independent reviews before complete validation. PR qualification follows the exact file through merged ancestry, measuring merged bytes; planning records retain enough history for each comparison window. Receipt eligibility follows the canonical disposition check: an unchanged-text override accepts original committed bytes, while a repaired pass is measured at the committed acceptance snapshot, never its failed or later edited document. Preserve canonical receipt ordinals, exclude pre-mechanism manual records, validate criterion/source bindings per hold and changed Cost bindings once per order. Planning directions have stable append-only pass bindings; answered order messages stay with their order, and later lifecycle messages stay outside the old planning pass. Recheck directions at the durable completion write. Actual planning-branch observations separate ownership from the budget anchor that survives a resumed phase. A planning receipt carries an optional validated direction snapshot so interruption after filing cannot lock out the next pass; recovery reuses the canonical receipt reader, including exact Markdown and committed-byte validation. Update every current guidance consumer to best-comparable wording. Declare the canonical receipt import as planning-only recovery outside evidence-edition execution; the import scanner failure during sync established the missing declaration, and the planning-refutation fixtures judge that path.",
  "evidence": [
    "scripts/lib/artifact-comparison.mjs",
    "scripts/lib/direction-ledger.mjs",
    "scripts/lib/plan-receipts.mjs",
    "scripts/test-harness.mjs: burst, roleless, reused-session and ownership cases",
    "scripts/test-process-debt.mjs: merge ingestion and planning history window cases",
    "scripts/test-plan-refutation.mjs: receipt completion-marker recovery",
    "docs/evidence/WO-235/self-review.md"
  ],
  "rejected": [
    "Matching merge message text misses the actual public titles.",
    "Reusing a single session timestamp reassigns earlier planning directions.",
    "Treating a missing local marker as no canonical receipt turns an observation failure into a lockout."
  ],
  "reopenWhen": "A direction crosses its dispatch boundary, a filed receipt cannot recover its boundary, a comparator excludes an eligible predecessor, or a consumer retains the old contract."
}
```

## WO-235-D009

```json
{
  "id": "WO-235-D009",
  "date": "2026-10-29",
  "dispatch": "resume: next",
  "kind": "experiment",
  "decision": "Use requested-class discovery for writing guidance and reuse the supplied control snapshot. The bounded comparison preserved all 25 PR candidates and reduced measured work for this observation; no future timing promise is made.",
  "evidence": [
    "docs/evidence/WO-235/comparison-probe.mjs",
    "docs/evidence/WO-235/comparison-probe.json"
  ],
  "rejected": [
    "Collecting all classes for PR guidance also reads unrelated planning receipts and reports."
  ],
  "reopenWhen": "Class filtering changes the eligible candidate set or a new caller needs additional classes.",
  "question": "Can writing guidance collect only PR bodies while keeping the same comparison candidates?",
  "alternatives": [
    "Collect every artifact class",
    "Collect only the requested class"
  ],
  "observation": "Both arms produced byte-identical sets of 25 PR candidates within 0 h 1 min. Requested-class collection did less measured work; the JSON evidence retains the numeric durations.",
  "execution": "run",
  "outcome": "adopted",
  "budget": {
    "wallSeconds": 60
  },
  "cost": {
    "wallSeconds": 0.93916225,
    "tokens": null,
    "commands": [
      "node scripts/harness.mjs bounded -- node docs/evidence/WO-235/comparison-probe.mjs"
    ],
    "source": "bounded wrapper exit 0 and comparison-probe.json"
  },
  "effect": {
    "wallSecondsPerOrder": null,
    "tokensPerOrder": null,
    "commands": [
      "artifactHistory(root, control, {classes:[\"prBody\"]})"
    ],
    "summary": "Same PR candidate set with fewer source classes read; repeated-order cost unmeasured."
  },
  "regression": false,
  "history": {
    "lastAdoptedImprovementAt": null,
    "experimentsSinceAdoption": null
  }
}
```

## WO-235-D010

```json
{
  "id": "WO-235-D010",
  "date": "2026-10-29",
  "dispatch": "resume: next",
  "kind": "correction",
  "misread": "Tried to feed an inline module through the bounded wrapper stdin.",
  "meant": "The bounded child does not receive that script input; its zero exit did not execute the comparison.",
  "changed": "Wrote comparison-probe.mjs and reran the same two arms by file. Only the resulting comparison-probe.json is evidence.",
  "decision": "Keep the failed measurement attempt distinct from the executed comparison.",
  "evidence": [
    "bounded wrapper first attempt: no comparison output or artifact",
    "docs/evidence/WO-235/comparison-probe.json: both arms and equality assertion"
  ],
  "rejected": [
    "Treating process exit zero as evidence the script ran."
  ],
  "reopenWhen": "A probe returns success without its expected measurement artifact."
}
```

## WO-235-D011

```json
{
  "id": "WO-235-D011",
  "date": "2026-10-29",
  "dispatch": "resume: next",
  "decision": "Repair validation failures at their cause. Load canonical planning helpers lazily when planning history is requested and a receipt directory exists, preserving dependency-light lifecycle and PR callers. Register the direction-ledger JSONL protocol and validate its typed entries in both registration consumers. Give the five older Stop fixtures explicit answered-message setup before their unrelated obligations are judged; preserve every new unanswered-message negative control. Compile the paired base host with Node 26 type stripping: inspection showed TypeScript 7 exposes only version metadata at its root, so the assumed legacy transpileModule export was invalid.",
  "evidence": [
    "Complete review run 1: configuration-root failed with missing work-orders import in narrow fixture runtimes; other suites were not executed",
    "Focused configuration reproduction: adding work-orders exposed an eager Prettier dependency, so the copy-list addition was removed and the loader boundary corrected",
    "Focused reproduction 2 stopped at formatting preflight; no behavioral pass claimed",
    "Focused reproduction 3: configuration-root passed, registrations rejected unclassified directions.jsonl",
    "scripts/lib/artifact-comparison.mjs: planningHelpers follows the existing synchronous ESM loader under the Node 26 engine contract",
    "scripts/check-registrations.mjs and packages/kernel/test/store-history.test.ts consume the new protocol declaration",
    "scripts/test-harness.mjs: answerFixtureDirections is called only in five named legacy fixtures",
    "node_modules/typescript/package.json: root export lib/version.cjs; no legacy compiler API",
    "https://github.com/nodejs/node/blob/v26.0.0/doc/api/module.md: stripTypeScriptTypes, fetched via Context7 /nodejs/node/v26.0.0 on 2026-10-29"
  ],
  "rejected": [
    "Adding the planning formatter to every lightweight lifecycle fixture would preserve unnecessary production coupling.",
    "Treating direction ledgers as generic EventEnvelope streams would misclassify their declared protocol.",
    "Blanket auto-answering in the hook invocation helper would hide unanswered-direction regressions."
  ],
  "reopenWhen": "A nonplanning caller loads the planning parser, a registered direction ledger bypasses schema validation, or an unrelated Stop fixture no longer reaches its intended judgment."
}
```

## WO-235-D012

```json
{
  "id": "WO-235-D012",
  "date": "2026-10-29",
  "dispatch": "resume: next",
  "decision": "Complete the synthetic reader fixture's passing-example inputs and bind both Stop control arms to their own runtime bytes. The shared seed now supplies fact anchors, illustrations and an explicitly synthetic comparison with source hashes. The baseline arm emits from the fixture runtime root and checks the installed host bytes against stripped historical source before judging Stop. Pin both predecessor entry points to revision 3db7571f1f0c19a935d4cbdff4c05cc3bfdee61f and exact SHA-256 source hashes in wo235-control-baseline.json; moving HEAD would stop being the predecessor after commit.",
  "evidence": [
    "Complete review run 2: release-preparation could not find facts.json; harness-fixtures passed 279 tests and failed the baseline Stop assertion",
    "scripts/lib/harness.mjs: emitHarness defaults runtimeRoot to TOOL_ROOT, so changing a fixture's dist file alone did not select the baseline",
    "Focused Stop reproduction: base exit 0/admit; updated exit 0/block; all answer, reentry, notification and override assertions passed",
    "Focused release-preparation reproduction: structural checks and release-preparation passed",
    "scripts/test-reader-fixture.mjs: complete synthetic comparison inputs without copying product examples",
    "packages/skeleton/fixtures/wo235-control-baseline.json: pre-execution revision and hashes checked from git show"
  ],
  "rejected": [
    "Weakening passing-example validation would let unjudged text become the comparison standard.",
    "Calling an unselected source file the baseline would provide no paired control evidence."
  ],
  "reopenWhen": "A shared fixture omits a required comparison input or a paired arm's installed runtime differs from the source it claims to judge."
}
```

## WO-235-D013

```json
{
  "id": "WO-235-D013",
  "date": "2026-10-29",
  "dispatch": "resume: next",
  "decision": "Close the paired Stop fixture's override in finally before removing its worktree. Operator-control mode is session-local temporary state that intentionally survives repository removal; another fixture reusing the synthetic session must not inherit that mode.",
  "evidence": [
    "Complete review run 3: paired Stop control passed; the later roleless planning test failed because no session record was written",
    "packages/compiler/src/operator-control.mjs: mode storage is keyed by session_id under tmpdir, independent of repository root",
    "scripts/test-harness.mjs: paired control entered override and previously removed only its fixture repository"
  ],
  "rejected": [
    "Changing production override lifetime would weaken recovery across repository failures.",
    "Seeding a session file in the later test would conceal the leaked mode."
  ],
  "reopenWhen": "A fixture leaves operator mode active or passes alone but fails after another fixture sharing its session identifier."
}
```

## WO-235-D014

```json
{
  "id": "WO-235-D014",
  "date": "2026-10-29",
  "dispatch": "resume: next",
  "decision": "Supply the four process-debt Stop consumers with their declared script-library runtime. The fixture's package copies alone no longer cover the Stop hook's dynamic direction-ledger import. Keep this setup local to the Stop consumers and preserve their existing assertions. The direct evaluator calls in the session-continuity case do not journal prompts; no direction entries are needed there.",
  "evidence": [
    "Complete review invocation 4: harness-fixtures passed; process-debt passed 178 and failed four, all initially caused by the omitted direction-ledger module",
    "scripts/test-process-debt.mjs: repo runtime setup, three direct Stop calls and the installed finish-hook call",
    "scripts/test-process-debt.fixture-inputs.json: process-debt Stop runtime declaration",
    "packages/skeleton/src/harness-host.ts: recordOperatorMessage runs in the outer hook entry point, not evaluateHarnessHook",
    "Canonical dispatch standing after the run: three complete runs consumed against a bound of three; the first structural-only failure was not counted",
    "First focused reproduction: adding script libraries to every runtime fixture exposed config module-loading races in three prompt cases; restrict installation to the four Stop consumers, after prompts in the session-continuity case",
    "Second focused attempt stopped at the stale decisions index after this record changed; it ran no process-debt cases. Refresh with sync before reproducing.",
    "Third focused reproduction passed 181 cases and failed only the newly added assertion that three direct evaluator prompts had been journaled; remove that mistaken precondition and retain the original session-continuity assertions.",
    "Fourth focused reproduction (wo235-process-debt-repro-4.log): process-debt and all structural checks passed, eight fresh tasks, exit 0; no complete-run allowance consumed.",
    "Preliminary document gate at 2026-10-29T06:12:09.372Z: 27 checks passed, including resume and its four paired completion controls. controls.json records the asserted exit codes. Publication and whitespace checks passed."
  ],
  "correction": "The initial commentary misattributed the fourth failure to unanswered directions. Its checked output instead reported runtime-unavailable from the same missing fixture module. A later source reading wrongly assumed direct evaluator calls journaled those prompts; the third reproduction and the outer hook's finally block establish that they do not. Remove the added ledger setup instead of changing the test's purpose.",
  "resolution": "D015 records the operator's subsequent correction to set the executor allowance to twenty runs. The active dispatch now reports three of twenty, within its run allowance. Full validation and the final handoff continue.",
  "rejected": [
    "Bypassing the import in production would hide an incomplete installed runtime.",
    "Answering every fixture's messages in a shared hook helper would weaken negative controls.",
    "Starting another complete run without recorded operator authorization would exceed the dispatch bound."
  ],
  "reopenWhen": "The focused process-debt reproduction fails, a dynamic Stop dependency is absent from a runtime fixture, or the direction negative controls change."
}
```

## WO-235-D015

```json
{
  "id": "WO-235-D015",
  "date": "2026-10-29",
  "dispatch": "resume: next; operator run-limit correction",
  "decision": "Set the executor's implementation and repair complete-run allowances to twenty, following the operator's final specific instruction. Explain that these are two modes of the same executor running the same full test suite. Continue the original WO-235 objective in the existing session.",
  "authorization": {
    "capture": "docs/intake/wo-235-run-limit-correction-2026-10-29.txt",
    "captureHash": "sha256:c05c0028ee09fb8680d9f16ace7fa57adeb76f6062598dc78e920298fe20c4a8",
    "interpretation": "The operator's message 7 specifies twenty runs and supersedes message 6's earlier request to remove the limit. Messages 2 through 5 challenge the repeated stop and request its explanation; message 8 asks what repair runs mean. These directions preserve the original execution aim."
  },
  "evidence": [
    "docs/control/budgets.json: dispatches.executor.completeRuns and dispatches.executor.repair.completeRuns were three; both are now twenty",
    "scripts/lib/dispatch-bound.mjs: effectiveDispatchLimits reads the implementation entry or the repair override",
    "Canonical usage after the change: complete runs 3 of 20, within",
    "Direct effectiveDispatchLimits readback: implementation 20; repair 20",
    "Consistency review traced scripts/kit/budgets.template.json as a separate instance-owned export seed; this correction changes the current repository's two executor entries"
  ],
  "rejected": [
    "Removing enforcement would disregard the operator's later specific instruction to use twenty.",
    "Changing another role's allowance would exceed the executor correction.",
    "Resetting consumed runs or redispatching would discard the existing execution history."
  ],
  "reopenWhen": "The operator changes the allowance or an executor consumer still applies the old three-run default."
}
```

## WO-235-D016

```json
{
  "id": "WO-235-D016",
  "date": "2026-10-29",
  "dispatch": "resume: next; operator direction to finish",
  "decision": "Return exclusively to completing WO-235. The billing-documentation lookup was an unsolicited detour; it did not answer the complaint about idle execution. Preserve the original dispatch and its elapsed history. Record a phase-local wall-clock extension to 10 h 0 min for the remaining repairs, complete validation and handoff under the operator's direction to finish; the twenty-run allowance and other roles remain unchanged.",
  "authorization": {
    "capture": "docs/intake/wo-235-finish-direction-2026-10-29.txt",
    "captureHash": "sha256:350ad86821c98f40cf8b3fc8bdfbfd9a6a8fcb8c0598532f81411206b1970b3f",
    "interpretation": "Messages 9 and 10 object to counting the idle gap as work; messages 11 through 13 reject the billing detour; message 14 explicitly directs completion for verification. Infer authority to continue the bounded remaining work, not to change global time accounting or perform unrelated tasks."
  },
  "evidence": [
    "The existing canonical complete gate ended at 2026-10-29T12:34:16.058Z; it was admitted before the original eight-hour wall-clock bound.",
    "scripts/lib/dispatch-bound.mjs computes elapsed wall time from the original dispatch start, including the idle interval.",
    "All three existing source reviewers are complete; no new writer or reviewer was created on continuation."
  ],
  "rejected": [
    "A billing lookup does not establish delivered execution work and was not requested.",
    "Resetting the dispatch timestamp or consumed runs would erase history.",
    "Another permission loop would disregard the instruction to finish."
  ],
  "reopenWhen": "The operator changes direction, the remaining work cannot finish within the recorded extension, or evidence contradicts the bounded continuation interpretation."
}
```

## WO-235-D017

```json
{
  "id": "WO-235-D017",
  "date": "2026-10-29",
  "dispatch": "resume: next",
  "decision": "Keep the planning receipt JSON response parseable by sending its comparison advisory to stderr. Extend the exported-instance recovery fixture to inspect and resolve the documented README conflict: verify that the saved change is exactly its synthetic appended note, preserve the complete updated README plus that note, and retain the original stash and order records.",
  "evidence": [
    "Complete review invocation 5: 77 tasks passed; launchpad-planning failed two cases, leaving 47 tasks unrun. Process-debt passed.",
    "The planning receipt exited zero but its new advisory preceded the JSON on stdout; the existing strict JSON consumer consequently returned no verdict.",
    "The legacy exported-instance recovery test appended a README note at the same location as the newly added guidance; git stash apply reported a README conflict.",
    "scripts/kit/README.client.md already requires conflict inspection and preservation during this recovery."
  ],
  "rejected": [
    "Loosening the JSON parser would conceal the receipt command regression.",
    "Removing the saved local README edit or overwriting the updated guidance would weaken the recovery evidence."
  ],
  "reopenWhen": "Receipt stdout ceases to be JSON, the advisory is absent from stderr, or recovery loses either upstream guidance or saved local work."
}
```

## WO-235-D018

```json
{
  "id": "WO-235-D018",
  "date": "2026-10-29",
  "dispatch": "resume: next",
  "decision": "Update the planning-start response fixture for the new document field and assert that its named skeleton exists. Retain the exact failure-count, bounded-size and unavailable-count assertions.",
  "evidence": [
    "Complete review invocation 6 ran every selected task: 124 passed, plan-refutation failed, none unrun. Within that suite, 117 cases passed and one failed.",
    "scripts/refute-plan.mjs start now returns document before branch because it creates the contract-derived planning skeleton.",
    "scripts/test-plan-refutation.mjs: the WO-172 exact-key expectation omitted document; the dedicated planning-start case already checks all ten headings and the marker."
  ],
  "rejected": [
    "Dropping exact-key comparison would hide unrelated response changes.",
    "Removing the new document field would make the created skeleton harder to locate and reverse the intended feature."
  ],
  "reopenWhen": "The start response changes without updating its consumer contract or the returned document does not exist."
}
```

## WO-235-D019

```json
{
  "id": "WO-235-D019",
  "date": "2026-10-29",
  "dispatch": "resume: next; bounded adjacent fixture repair",
  "decision": "Normalize numeric filesCreated, filesDeleted and bytesWritten observations in the target-briefing output comparator, alongside its existing time and resident-memory normalization. Preserve the command status, all observation keys and every non-observational output assertion. The queued repair is adjacent-0001 and changes only scripts/test-target-worktree-start.mjs.",
  "evidence": [
    "Complete review invocation 7: 124 tasks passed, target-worktree start failed, none unrun. Planning-refutation and all previously repaired suites passed.",
    "The target-briefing case compared equivalent document-gate refusal outputs. Both reported the same status, failed structural check, skipped checks and created/deleted counts; only bytesWritten differed: 2845900 versus 2845898.",
    "scripts/test-target-worktree-start.mjs already normalizes observedAt and residentBytes before comparing the two invocation routes."
  ],
  "rejected": [
    "Retrying without correcting the unstable observation comparison leaves the same failure possible.",
    "Removing the full output equality or command-status comparison would weaken the routing contract."
  ],
  "continuation": "D016 captures the operator's direction to finish despite the idle interval. This newly required complete validation cycle needs a phase-local wall ceiling of 11 h 0 min; record that finite extension while retaining the original start and twenty-run allowance. No global timing policy or criterion changes.",
  "reopenWhen": "The comparator masks command behavior rather than measurements, or either invocation route differs after observation normalization."
}
```

## WO-235-D020

```json
{
  "id": "WO-235-D020",
  "date": "2026-10-29",
  "dispatch": "resume: next; readiness on explicit operator direction",
  "decision": "Honor the operator direction to send WO-235 to ready-to-verify without another document gate. Remove the handoff trailing blank line and record the last three directions. Mark criterion 10 unmet only because these final record edits have no current-tree document row; this is a disclosed handoff limitation, not a waiver or an invented passing check.",
  "evidence": [
    "The complete review passed at 2026-10-29T14:36:12.738Z with 125 passing check leaves and none failed or unrun.",
    "The second final document gate passed at 2026-10-29T14:52:36.071Z with exit code 0 and no unrun suites.",
    "The first implementation-ready attempt refused at the inline whitespace check: docs/evidence/WO-235/handoff.md:34: new blank line at EOF.",
    "The operator then-current instruction is JUST SEND IT TO READY TO VERIFY, following the objection to repeated document gates."
  ],
  "rejected": [
    "Starting another document gate would repeat the delay the operator expressly rejected.",
    "Claiming a passing document row for later record edits would overstate the evidence."
  ],
  "reopenWhen": "Independent verification assesses the final document snapshot and criterion 10."
}
```

## WO-235-D021

```json
{
  "id": "WO-235-D021",
  "date": "2026-10-29",
  "dispatch": "resume: next; operator correction of premature execution completion",
  "decision": "D020 incorrectly treated the demand to finish promptly as authorization to leave criterion 10 unmet. The operator explicitly rejected that interpretation and directed running the gate. Restore the met judgment, complete the document gate at the final record snapshot, and record corrected readiness only after its passing evidence is checked.",
  "evidence": [
    "Operator direction entry 20 explicitly requires the gate and rejects the unmet criterion.",
    "ImplementationReady ordinal 4 recorded criterion 10 unmet; no independent verification has begun.",
    "The complete review passed at 2026-10-29T14:36:12.738Z; source is unchanged.",
    "resume correct does not admit unmetCriteria, and implementation-ready admits only active. Recovery therefore preserves ordinal 4 and uses the existing control append, checkpoint and gate-claim checks to append superseding ImplementationReady evidence in the same ready-to-verify phase."
  ],
  "rejected": [
    "Retaining the unmet judgment contradicts the explicit correction.",
    "Editing or deleting ordinal 4 would erase the actual history.",
    "Dispatching a verifier or fabricating a failure would advance another role without authorization."
  ],
  "reopenWhen": "The requested document gate fails or the current source identity differs from the passing complete review."
}
```

## WO-235-D022

```json
{
  "id": "WO-235-D022",
  "date": "2026-10-29",
  "dispatch": "resume: verify; operator report that the executor handoff looped on document gates and record edits for half an hour after the complete gate",
  "decision": "Record the operator's judgment that the WO-235 executor phase is the worst they have seen, and its observed cause. The complete review passed at 14:36:12Z; five npm run test:docs runs then judged five distinct trees (three passed, two failed) before readiness at 15:08:42Z, 0 h 32 min later. A completion consumes only a document row whose tree hash equals the working tree's, that hash covers every tracked and non-ignored untracked file, and this order requires a direction-ledger entry for every recorded message before completion; so each answer written during the handoff staled the passing document row and forced another run of about 0 h 3 min, while the delay drew further messages. The executor compounded it: an unauthorized criterion-10 unmet judgment (D020, corrected by D021) and two failed runs on records it had broken. Not repaired here: verification is read-only, the binding lives outside the order's declared surfaces, and the operator routed the repair to the next planning pass.",
  "followup": "The next planning pass must remove the handoff loop in which a record that completion itself requires (a direction-ledger entry, or the decision and handoff text that answers the operator during a handoff) stales the document row the same completion consumes. Repair rule: answering an operator message after a passing npm run test:docs must not force another document-gate run, and repeated document-gate runs on changed trees within one handoff surface as a failure, never as progress. The operator judged that a pass which leaves this unaddressed also fails.",
  "evidence": [
    "docs/control/local/harness/checks.json (ignored host evidence, read 2026-10-29T15:11Z): npm test exit 0 at 2026-10-29T14:36:12.738Z after 0 h 38 min; npm run test:docs exit 0 at 14:48:26Z and 14:52:36Z, exit 1 at 14:57:49Z (structural failed) and 15:00:37Z, exit 0 at 15:06:32Z; each row names a different tree hash at one code identity",
    "docs/control/orders/WO-235.jsonl: ImplementationReady at 14:54:06Z with criterion 10 unmet; OperatorOverrideRecorded and superseding ImplementationReady at 15:08:42Z",
    "git diff --stat refs/dotln/checkpoint/WO-235/4 refs/dotln/checkpoint/WO-235/5: decisions, ten direction entries, handoff, self-review and the decisions index changed between those runs",
    "docs/evidence/WO-235/directions.jsonl entries 15 to 28: operator messages received during the handoff, most reporting the delay",
    "scripts/lib/handoff-ledger.mjs requireDocumentRow: the consumed row's treeHash must equal gateTreeHash(root)",
    "packages/skeleton/src/gate-evidence.mjs gateTreeHash: the exact candidate tree includes uncommitted and non-ignored untracked files because nothing is committed before final review; gateCodeIdentity excludes docs/, so the complete row survived the same record writes (product 07 §Discipline, Write once, run once)"
  ],
  "rejected": [
    { "option": "Exclude untracked files from the gate key", "reason": "New source, fixtures and records stay untracked until final review stages them; a key without them would let a passing row stand for files no gate judged." },
    { "option": "Fail WO-235 on the loop", "reason": "It breaks no declared criterion; the cost comes from this order's required ledger write meeting the existing exact-tree document row, a binding outside the declared surfaces that the operator routed to planning." },
    { "option": "Repair it during this verification", "reason": "The verifier edits no implementation, and the repair changes gate-evidence rules that are planning's to decide." },
    { "option": "NoOp", "reason": "The operator directed that it be recorded, and every role that answers a message after its document gate meets the same loop, this verification included." }
  ],
  "reopenWhen": "The next planning pass closes without filing or disposing this follow-up, or a later handoff again reruns the document gate after answering an operator message."
}
```

## WO-235-D023

```json
{
  "id": "WO-235-D023",
  "date": "2026-10-29",
  "dispatch": "resume: verify; operator correction rejecting the deferral in D022 and directing VER-001 to fail on the direction ledger's four findings",
  "kind": "correction",
  "misread": "D022 read the direction that the next planning pass must address the handoff loop as routing its repair to that pass, and rejected failing WO-235 on it.",
  "meant": "The loop is not deferred. VER-001 fails WO-235 on four findings about the direction ledger, and the next planning pass still owes the disposition D022 names.",
  "changed": "VER-001 records fail on F1 to F4, each with its class, reproduction and repair rule; D022 stays as the record of the loop and of the planning duty.",
  "decision": "Fail WO-235 in VER-001 on four direction-ledger findings. F1: completion, the planning receipt and Claude Stop accept any row whose index, digest and session match and whose aim, disposition and record are non-empty text, so a message is shown to have a row, not to be answered; the security document and product 07 state that these routes refuse a message without an answer. F2: under Codex only the dispatch phrase is journaled, so the check judged nothing of the executor, and none of the executor's 28 hand-written rows carries the session key the check matches. F3: each required row is a document write inside the exact-tree key of the document row completion consumes, so answering after a passing npm run test:docs forces another run, the loop D022 records. F4: the file repeats the reply the operator already reads and adds no judgment a check can make.",
  "followup": "resume: fix repairs VER-001 F1 to F4 under the repair rules VER-001 names; a repair that changes the order's text first records its authorization and runs npm run plan -- amend-order.",
  "evidence": [
    "scripts/lib/direction-ledger.mjs readDirectionLedger requires only non-empty aim, disposition and record text; unansweredMessages matches index, digest and session",
    "docs/control/local/harness: the executor's Codex journal holds one observation, its codex-dispatch-phrase, which requireAnsweredDirections excludes",
    "docs/evidence/WO-235/directions.jsonl rows 1 to 28: no session field",
    "scripts/lib/handoff-ledger.mjs requireDocumentRow and packages/skeleton/src/gate-evidence.mjs gateTreeHash, with the handoff record of D022",
    "docs/AI-HARNESS-SECURITY.md and docs/product/07-execution-guide.md: the completions and receipt are described as refusing a message without an answer"
  ],
  "rejected": [
    { "option": "Keep the deferral of D022", "reason": "Withdrawn by the operator's correction in message 6 of the verification session; message 8 directed the fail." },
    { "option": "Fail on the loop alone", "reason": "The direction named all four findings; F1, F2 and F4 stand without the loop." }
  ],
  "reopenWhen": "A repair verification finds F1 to F4 resolved under their repair rules, or the operator withdraws the direction."
}
```

## WO-235-D024

```json
{
  "id": "WO-235-D024",
  "date": "2026-10-29",
  "dispatch": "resume: fix; operator correction about premature worker review",
  "decision": "The three required workers were launched before repair implementation. That was premature: executor steps 3 through 6 place implementation before independent review. Their preliminary source observations are not a completed repair review. Stop active review work, implement the repair as the sole writer, then return the completed diff to the same workers for their required independent reviews before validation.",
  "evidence": [
    "The repair session launched criteria, design and consistency workers before any source edit.",
    "The operator immediately challenged that ordering.",
    "The agent inventory showed design and consistency completed; the still-running criteria worker was interrupted."
  ],
  "rejected": [
    "Continuing pre-implementation reviews would repeat the ordering error.",
    "Spawning replacement workers would spend more budget without improving independence."
  ],
  "reopenWhen": "A later implementation change requires another scoped review; reuse the assigned workers."
}
```

## WO-235-D025

```json
{
  "id": "WO-235-D025",
  "date": "2026-10-29",
  "dispatch": "resume: fix, VER-001 F1 through F4",
  "decision": "Keep the shared direction check and strengthen what it can establish. Versioned ledger entries reference a message-bound durable answer block and its digest; disposition becomes add, withdraw or reorder, with explicit earlier aim targets. A fold checks retained aims and permitted priority changes per session and phase. Answer correctness, event classification and prompt reply timing remain review judgments. Preserve historical prose rows without crediting them as checked answers. Report Codex inbox coverage as unobserved; actor-attested records never prove exhaustive observation. Give the document gate a distinct subject identity excluding fixed operational record lanes and only the direction marker in planning documents; keep exact-tree provenance and platform-document protection.",
  "evidence": [
    "VER-001 F1: nonempty x strings were accepted without resolving record.",
    "VER-001 F2: the Codex dispatch phrase was the only observation, and executor rows lacked session binding.",
    "VER-001 F3: gateTreeHash includes conversation and required completion records.",
    "VER-001 F4: free-form disposition duplicates the reply without a checked judgment."
  ],
  "traps": {
    "ruleBeating": "Resolve a bound answer and check a concrete continuity invariant; do not claim semantic or response-time enforcement.",
    "fixesThatFail": "Separate operational records from document identity without letting a ledger select arbitrary excluded source paths.",
    "shiftingTheBurden": "Do not require another document gate for a conversation answer or completion record."
  },
  "rejected": [
    "NoOp leaves all four reproduced failures.",
    "Removing the ledger abandons the current order obligations; the bounded repair preserves them.",
    "Changing gateTreeHash globally would weaken unrelated provenance and evidence consumers.",
    "Excluding any path named by a direction would let a record erase platform document coverage."
  ],
  "reopenWhen": "A bound answer can be absent or changed without refusal, a prior aim disappears without an explicit judgment, or conversation records still stale the document row."
}
```

## WO-235-D026

```json
{
  "id": "WO-235-D026",
  "date": "2026-10-29",
  "dispatch": "resume: fix",
  "decision": "Update only the expected data whose source contract changed. The new linked role oracle pins the repaired instructions and preserves the original WO-235 oracle and its complete chain. Positive direction fixtures now create real message-bound answer blocks; negative cases retain missing or invalid records. Document-gate fixtures record documentIdentity while retaining exact treeHash provenance. Register the new document projection and explicit fixture helper with their consumers. The local release preparation keeps application v0.103.0, skeleton 0.73.0 and harness-host 0.39.0; these are the same unpublished minor release, with no new dependency.",
  "evidence": [
    "npm run build passed after correcting a Buffer generic annotation in the projection callback.",
    "Formatting first caught an extra closing parenthesis in the new direction schema check; corrected before build.",
    "npm run release -- prepare --local: WO-235 target v0.103.0 remains current.",
    "packages/skeleton/fixtures/wo235-role-baseline.json is the preserved predecessor; wo235-repair-role-baseline.json links its SHA-256.",
    "docs/evidence/WO-235/cold-start-after.json and repair-cold-start-after.json provide before/after source-byte measurements."
  ],
  "profiles": {
    "executor": {
      "beforeBytes": 34614,
      "bytes": 34680,
      "growthBytes": 66
    },
    "verifier": {
      "beforeBytes": 31125,
      "bytes": 31184,
      "growthBytes": 59
    },
    "reviewer": {
      "beforeBytes": 33551,
      "bytes": 33685,
      "growthBytes": 134
    },
    "release-close": {
      "beforeBytes": 22314,
      "bytes": 22285,
      "growthBytes": -29
    },
    "planner": {
      "beforeBytes": 23223,
      "bytes": 23194,
      "growthBytes": -29
    },
    "refuter": {
      "beforeBytes": 22037,
      "bytes": 22008,
      "growthBytes": -29
    }
  },
  "rejected": [
    "Rewriting the old oracle would erase the implementation subject VER-001 judged.",
    "Leaving the old empty-record positive fixtures would test the rejected proxy."
  ],
  "reopenWhen": "Any source consumer is absent from the declaration closure, a prior oracle byte changes, or generated role bytes differ from this reviewed source contract."
}
```

## WO-235-D027

```json
{
  "id": "WO-235-D027",
  "date": "2026-10-29",
  "dispatch": "resume: fix",
  "decision": "Resolve the completed-source reviews before full validation. Fold explicit revisions before resolving only effective answer blocks, so a replacement repairs a stale or mistaken reference without deleting history. Exclude only named conversation/completion records, preserving global evidence selections and evidence-edition inputs. Add revision-recovery and lifecycle-phase counterexamples. Clarify the older planning paragraph and every operational product/document identity instruction. Preserve lazy skeleton loading: the conversation-path classifier is dependency-light and document identity is imported only for document lookup.",
  "evidence": [
    "Criteria reviewer: two concrete findings, superseded-answer resolution order and overly broad evidence-root exclusion.",
    "Criteria reviewer requested explicit current-phase and wrong-phase regression coverage.",
    "Consistency reviewer: two findings, old planning enforcement claims and residual codeIdentity wording for document rows; also routed the static-import dependency concern.",
    "Design reviewer: zero design findings; revision concern transferred to criteria.",
    "docs/architecture/gate-execution.md read as newly required input because this repair changes gate reuse and completion; its implemented boundary is updated."
  ],
  "rejected": [
    "Validating obsolete answer targets before their explicit replacements prevents correction.",
    "Excluding every evidence file would hide platform evidence edits.",
    "Loading skeleton source at gate-reuse module entry would break dependency-light callers."
  ],
  "reopenWhen": "The scoped reviewer recheck or complete gate identifies another missed consumer or contradictory behavior."
}
```

## WO-235-D028

```json
{
  "id": "WO-235-D028",
  "date": "2026-10-29",
  "dispatch": "resume: fix; operator direction on the purpose of retaining every direction",
  "decision": "The purpose of no operator direction being dropped is to help the operator. A design that is antagonistic to the operator fails at the outcome level even when its mechanical checks pass. Judge this repair by whether it reduces the operator's burden and preserves ordinary conversation without creating procedural work for them; a mechanically valid ledger is not the objective.",
  "operatorDirection": {
    "capture": "docs/intake/wo235-operator-benefit-2026-10-29.txt",
    "sha256": "227f76582820b781bf8c8f34b3f23e8082d5d2efb1af3ecb9788511d7da9289d"
  },
  "evidence": [
    "The operator explicitly stated this purpose during the repair and asked that it be recorded.",
    "VER-001 F3 records conversation answers repeatedly invalidating the document gate; F4 records duplicate prose without a useful checked judgment."
  ],
  "rejected": [
    "Treating mechanical conformance as success when it makes the operator's work harder.",
    "Requiring the operator to manage the ledger, repeat questions, or authorize routine continuation to satisfy this mechanism."
  ],
  "reopenWhen": "A review or live use finds that the mechanism obstructs the operator, shifts record maintenance onto them, delays answering, or turns normal conversation into additional gate or approval work."
}
```

## WO-235-D029

```json
{
  "id": "WO-235-D029",
  "date": "2026-10-29",
  "dispatch": "resume: fix; applying the operator-benefit standard in D028",
  "decision": "Remove an unnecessary clerical burden found by the design reviewer: an explicit reorder names only directions to move first, including the current message if needed. Preserve every unmentioned direction in relative order instead of requiring an enumeration of the conversation. The retained list is continuity history, not unresolved work. Add the conversation-path classifier to every explicit suite map that already tracks direction-ledger behavior; the common evidence source list alone does not select those fixture consumers.",
  "evidence": [
    "Design reviewer: answered questions inflated the all-targets reorder requirement, creating agent paperwork and potential delay paid by the operator.",
    "Consistency C3: harness-fixtures and related explicit source maps omitted the newly extracted classifier.",
    "The harness regression covers sparse reorder, prioritizing the current request, retention of unmentioned directions and refusal of unknown targets."
  ],
  "rejected": [
    "A new answer-only disposition would add another per-message classification field when sparse ordering solves the concrete burden.",
    "Keeping the full enumeration because tests could enforce it would serve the mechanism instead of the operator."
  ],
  "reopenWhen": "Ordinary conversation adds clerical or gate work, a sparse reorder loses an earlier direction, or source edits fail to select their behavioral fixture consumers."
}
```

## WO-235-D030

```json
{
  "id": "WO-235-D030",
  "date": "2026-10-29",
  "dispatch": "resume: fix; first complete repair validation",
  "decision": "Correct the missed consumers of the reviewed role changes. The startup-cost test now verifies the repair oracle's immutable link to the original WO-235 oracle, compares installed bytes with the repair measurement and preserves historical growth, headroom and current budget checks. Both installed and generated verifier-guidance assertions now require code identity for product evidence and platform-document identity for document evidence. The live verification briefing and document-row refusal name that same split; the refusal prints the document identity it actually judges. Update the diagnostic's three fixture consumers together, preserving legacy-row acceptance behavior. No oracle, budget or role instruction changes are needed.",
  "evidence": [
    "The complete review row at 2026-10-29T16:28:15.881Z failed process-debt: test-gate-followups expected 34614 executor startup bytes while the installed and recorded repair measurement was 34680.",
    "The same suite's WO-140 briefing case still expected the old combined code-identity wording; the installed verifier root already states the separate platform-document identity.",
    "The repair oracle and its source map were already recorded under D026; the pre-repair oracle remains byte-exact. The initial source search missed package tests; the follow-up consistency review found executor-supports.test.ts plus the stale live briefing and refusal wording. The earlier zero-new-finding source disposition did not establish these consumers were current.",
    "The bounded node --test reproduction selected both first-run failures from test-process-debt.mjs; both passed at 2026-10-29T16:30:15.310Z. Complete validation of the additional consumer corrections remains required.",
    "npm run sync regenerated runtime, installed harness snapshots and authority evidence from the corrected resume.mjs and handoff-ledger.mjs sources; the role oracle remains current. The consistency reviewer rechecked the additional source/consumer corrections with no new finding."
  ],
  "rejected": [
    "Rewriting the historical oracle would erase the verification subject.",
    "Weakening the byte or wording assertions would hide the missed dependency.",
    "Changing correct installed guidance to satisfy the old assertion would restore the document-evidence defect."
  ],
  "reopenWhen": "The focused reproduction or subsequent complete run finds another stale consumer or current role bytes exceed their existing accepted ceiling."
}
```

## WO-235-D031

```json
{
  "id": "WO-235-D031",
  "date": "2026-10-29",
  "dispatch": "resume: fix; second complete repair validation",
  "decision": "The platform-document projection explicitly excludes both the fixed physical host-state lane docs/control/local/ and configured control/local/, independently of Git ignore configuration. Recording gate or local operational evidence must never change the subject that evidence judges. Preserve exact-tree provenance and coverage of adjacent platform control documents. Strengthen the two conversation-identity regressions with direct before/after assertions around recording the gate row and relocated operational records; retain the three existing live document-gate cases as additional counterexamples. Update product 07 and the gate architecture with these private-state exceptions.",
  "evidence": [
    "The complete review row at 2026-10-29T16:54:28.457Z failed runner-fixtures: three live document-gate cases reported an identity change or failed exit, and both new conversation/relocated-root cases could no longer find their recorded passing row.",
    "The bounded two-case reproduction failed consistently. Adding the direct identity assertions showed that recordGateChecks alone changes gateDocumentIdentity when the fixture has no host-state Git ignore entry.",
    "gate-evidence.mjs writes its index, outcomes and active markers under the fixed docs/control/local/harness path; the repository .gitignore excludes docs/control/local, but the new document projection had relied on that external ignore rule.",
    "All five failed cases passed the bounded reproduction at 2026-10-29T16:57:24.337Z after the physical-lane fix.",
    "The criteria recheck found configured control/local also carries operational state. Newly required inputs adjacent-queue.mjs and plan-direct.mjs write there, and docs-check.mjs already treats it as private. The consistency recheck required the two standing boundary descriptions to name both exclusions."
  ],
  "rejected": [
    "Adding an ignore entry only to these fixtures would conceal the self-invalidating evidence calculation from consumers without that entry.",
    "Excluding all control documents would hide platform input changes.",
    "NoOp leaves the document-evidence repair unable to preserve its own passing row."
  ],
  "reopenWhen": "Recording host evidence changes the platform-document identity, or a platform control document outside the local lane no longer invalidates a document pass."
}
```

## WO-235-D032

```json
{
  "id": "WO-235-D032",
  "date": "2026-10-29",
  "dispatch": "resume: fix; completing the relocated-record counterexample",
  "decision": "Share the named-record projection between product and document identities. Moving only the document projection left required relocated conversation records in gateCodeIdentity, invalidating the product pass consumed by the same handoff. Put the pure projection in the existing skeleton gate-evidence module; the control-plane document identity supplies its validated roots, and code identity reads the candidate's own root declarations, including when judging a historical revision. Unreadable JSON or invalid projection-root values gain no additional exclusion; full schema validation remains the configuration gate's duty, and the configuration file remains a product input. Keep the dependency-light answer-path classifier and the existing default-root-only live-write admission. Exclude only the already named operational records rather than entire configured document trees.",
  "evidence": [
    "The criteria reviewer traced gateCodeIdentity's default-docs exclusion through requireGateClaims and confirmed the relocated records remained product inputs.",
    "The strengthened relocated-root regression consumed both product and document rows before the record writes, then reproduced a missing product pass after the conversation answer, ledger and local-state writes at 2026-10-29T17:06:45.851Z.",
    "Both projection regressions passed the bounded reproduction after sharing the projection at 2026-10-29T17:08:11.207Z; the relocated case consumes both passes and rejects a real source edit.",
    "Product 07 and the gate architecture now state the two-identity boundary. The bounded projection cases, including the historical-configuration counterexample and changed-configuration refusal, passed at 2026-10-29T17:10:16.322Z.",
    "npm run sync regenerated runtime, installed harness snapshots, authority evidence and publication projections from the shared gate-evidence source and standing-document updates; role-oracle bytes remain current. The criteria and design source rechecks found no additional blocker.",
    "The consistency reviewer caught an overbroad initial claim about invalid declarations. The projection validates only its selected root values, while canonical configuration validation also checks unknown keys and unrelated fields. The source comment and this decision now state that division explicitly."
  ],
  "traps": {
    "shiftingTheBurden": "Preserve every pass the handoff consumes after a required record write; retaining only the document pass would still force another complete run.",
    "fixesThatFail": "Use one projection for both identities, retain actual source/configuration inputs, and preserve the separate live-write grant boundary."
  },
  "rejected": [
    "NoOp leaves normal conversation invalidating a completion's product evidence under supported relocated roots.",
    "Excluding every configured document tree could hide source inputs outside the named operational lanes.",
    "Importing the control-plane configuration implementation into the skeleton would add a dependency to copied runtime fixtures; the projection only needs its narrow root values.",
    "Expanding live gate write admission is outside this correction and is unnecessary to preserve completed evidence."
  ],
  "reopenWhen": "A required operational record invalidates either handoff pass, a source/configuration change preserves product evidence, or historical identity depends on current root declarations."
}
```

## WO-235-D033

```json
{
  "id": "WO-235-D033",
  "date": "2026-10-29",
  "dispatch": "resume: verify; VER-002 judged the repair of VER-001 F1 to F4 and fails WO-235 on three new blocking findings",
  "decision": "VER-002 fails WO-235. The repair resolves VER-001 F1 to F4 under their repair rules; F3 is resolved at the cost F5 records. A decision carrying a follow-up still moves the platform-document identity through docs/planning/followups.json, which is correct: the retained planning queue holds dispositions and history, plan start serves it, and product 07 has the document gate check its freshness. Three defects block. F5: the shared record projection removes every verification and final-review report, every order control log, the generated indexes and the order's decisions, handoff, self-review, ledger and answer records from the platform-document identity, so a completion consumes a passing npm run test:docs row for records that row never judged; no completion runs the document check's record rules instead. F6: each completion judges every session's observed messages of its phase rather than its own dispatch's; VER-001's ten messages carry only pre-repair rows, which no longer count, so verification-result refuses this verification for either verdict. F7: the implementation session's host transcript holds 42 operator messages, of which 14, received from 15:03:29Z to 15:07:38Z before readiness, have no ledger entry (criterion 8). F8: Claude Stop refuses again on re-entry, meeting planning receipt 058's reopening condition for criterion 9; it breaks no criterion and is a follow-up.",
  "followup": "resume: fix repairs VER-002 F5, F6 and F7 under the repair rules VER-002 names, and takes or disposes F8 with its reopening condition. VER-002's fail verdict cannot be recorded until F6 is relieved: the operator's recovery route (operator override: with a recorded override) or a repaired scope must admit the result transition.",
  "evidence": [
    "F3: this verification wrote its ledger row and answer block without moving either identity; this decision then reached docs/planning/followups.json through npm run meta and moved the platform-document identity from 02d44844 to d975c895, a planning-queue change the document gate judges (product 07, Retained planning follow-ups)",
    "F5: a scratch clone of refs/dotln/checkpoint/WO-235/9, whose tree c7e25101 the passing 18:01:31Z document row judged, kept platform-document identity 02d44844 after a decision with an invalid dispatch label and a home-directory path and a broken link in handoff.md were added; requireDocumentRow still returned that row, and checkDocs reported three failures in those records",
    "F5: scripts/resume.mjs verification-result and scripts/lib/lifecycle-evidence.mjs run no private-path, link or decision-shape rule over the excluded records; at the base, requireDocumentRow matched gateTreeHash exactly",
    "F6: npm run resume -- verification-result fail at 2026-10-29T18:25:46Z exited 1 with DOTLN_DIRECTIONS_UNANSWERED naming indexes 1 to 10 of session 5a16a14c, each answered by directions.jsonl rows 29 to 38; this session's own message was answered by a version-2 row and admitted",
    "F7: the implementation session's Codex transcript, read for timestamps and digests only, holds 43 user inputs; one is DotLn's injected continuation; rows 1 to 28 match 28 inputs by digest in order; the repair session's transcript holds three inputs matching rows 39 to 41",
    "F8: scripts/test-harness.mjs asserts decision block for a Stop carrying stop_hook_active true while a message is unanswered; WO-235-D004 records the choice"
  ],
  "rejected": [
    { "option": "Write version-2 rows for VER-001's ten messages so the transition admits", "reason": "This session did not receive or answer them; the rows would satisfy a defective scope with records nobody judged, the rule beating F1 named." },
    { "option": "Pass with F5 to F8 as follow-ups", "reason": "Criteria 3 and 8 are unmet and F5 reproduces a regression of the exact-tree document row." },
    { "option": "Repair during verification", "reason": "The verifier edits no implementation." }
  ],
  "reopenWhen": "A repair verification finds F5, F6 and F7 resolved under their repair rules, or the operator waives criterion 3 or 8 or withdraws the order."
}
```

## WO-235-D034

```json
{
  "id": "WO-235-D034",
  "date": "2026-10-29",
  "dispatch": "operator override: record VER-002's fail verdict so WO-235 can return to repair",
  "decision": "Under the operator's override, record VER-002's fail verdict by appending VerificationCompleted through the control log's append path with a recovery checkpoint, because verification-result refuses either verdict on VER-001's ten pre-repair messages (VER-002 F6). The transition's own checks ran first: phase, actor header, cost line, criterion lines, git diff --check and criterion 10's npm test claim, consumed from the 17:55:03Z complete row at the current code identity. Two requirements were bypassed: the direction check, and criterion 10's document row at the final platform-document identity. The last full document pass is 18:33:56Z, before the record corrections that answered the operator's questions; the run after them was stopped under the override after 0 h 12 min waiting on another checkout's host lanes. No other passing check is claimed.",
  "evidence": [
    "docs/control/orders/WO-235.jsonl ordinal 12: VerificationCompleted VER-002 fail at 2026-10-29T18:59:48Z, checkpoint refs/dotln/checkpoint/WO-235/11, productGate npm test exit 0 at 17:55:03Z, no documentGate",
    "docs/control/orders/WO-235.jsonl ordinal 13: OperatorOverrideRecorded naming both bypassed requirements and the stopped document run",
    "docs/control/local/harness/checks.json: npm run test:docs exit 1, stopped by request at 18:54:01Z after 0 h 12 min of host-lane wait held by another checkout; format, configuration-root, registrations, declarations, generated and host passed before the stop",
    "npm run resume -- status: phase needs-fix, legal next action fix",
    "docs/control/orders/WO-235.jsonl ordinal 14: the hook recorded the override at its exit, 18:41:41Z to 19:01:33Z, with effects unobserved; the override changed what ordinal 13 and this decision name and nothing else"
  ],
  "rejected": [
    { "option": "Write version-2 rows for VER-001's ten messages", "reason": "They would be answers this session never gave, written to satisfy the defective scope F6 names." },
    { "option": "Wait for the document gate", "reason": "The operator directed returning the order to repair now, and the run was queued behind another checkout's full review with no bounded end." },
    { "option": "Edit scripts/resume.mjs to skip the check", "reason": "The verifier edits no implementation, and the edit would change the code identity under review." }
  ],
  "reopenWhen": "The repair finds the appended VerificationCompleted differs from what verification-result would record apart from the two bypassed requirements, or the override record is missing."
}
```

## WO-235-D035

```json
{
  "id": "WO-235-D035",
  "date": "2026-10-29",
  "dispatch": "resume: fix; operator correction makes answer coverage private and nonblocking",
  "decision": "The operator explicitly rejects all friction from answer coverage: it must be internal and hidden, with no gates and no refusal to validate a phase; omit it if a useful mechanism cannot satisfy that boundary. Amend the order to replace the public direction ledger, answer-binding protocol and completion/receipt/Stop refusals with a compact private response checklist and an assistant-only prompt reminder. Preserve the artifact-contract and best-comparable work. Restore exact-tree document coverage instead of adding inline checks to sustain the abandoned projection. Historical records remain evidence; no retroactive message reconstruction is owed.",
  "evidence": [
    "Operator correction captured in docs/intake/wo235-answer-coverage-correction-2026-10-29.txt; sha256:302bbc9394c4c507dd471320b8754cea8f5c05fbf66cc21abb9d61ee4d801989",
    "VER-002 F6 reproduces verification-result refusing both verdicts because it checks a completed earlier dispatch; F8 reproduces a repeated Stop refusal.",
    "VER-002 F5 proves that the conversation projection accepts a document row after records gain faults the document checker rejects.",
    "Current harness-host.ts already separates UserPromptSubmit hookSpecificOutput.additionalContext (assistant context) from systemMessage (operator notices); generated roles exist for hosts without that prompt hook.",
    "The operator describes an approximately 85 percent answer rate and a desired 95–100 percent. These are the operator outcome framing, not measured experiment results."
  ],
  "operatorAuthorization": {
    "capture": "docs/intake/wo235-answer-coverage-correction-2026-10-29.txt",
    "captureHash": "sha256:302bbc9394c4c507dd471320b8754cea8f5c05fbf66cc21abb9d61ee4d801989",
    "scope": "Replace answer-coverage enforcement with private nonblocking assistance, removing it if that boundary cannot be met; amend conflicting order requirements."
  },
  "traps": {
    "seekingTheWrongGoal": "A filled ledger does not prove an adequate answer. The mechanism supports actual replies without claiming a checked coverage score.",
    "shiftingTheBurden": "No user command, approval, public record or repeat-question ritual.",
    "fixesThatFail": "Delete the refusal paths and restore record validation rather than adding more exceptions around them."
  },
  "rejected": [
    {
      "option": "Narrow the direction gates to the current dispatch",
      "reason": "Even correctly scoped gates violate the operator correction."
    },
    {
      "option": "Backfill the fourteen historical message entries",
      "reason": "The operator removed the public-record obligation; doing so adds no answer coverage now."
    },
    {
      "option": "Keep projected document identity and add inline record screens",
      "reason": "The projection existed to support mandatory conversation records, now removed; the existing exact-tree rule is simpler and covers all records."
    },
    {
      "option": "NoOp on answer support",
      "reason": "A small assistant-only reminder and private checklist can address the omission risk without a new operator workflow. Remove it if observed behavior fails that purpose."
    }
  ],
  "reopenWhen": "The aid introduces any operator friction, a workflow path still depends on answer state, actual answer omissions persist, or tests reveal loss of unrelated validation."
}
```

## WO-235-D036

```json
{
  "id": "WO-235-D036",
  "date": "2026-10-29",
  "dispatch": "resume: fix; operator limits answer tracking to the current session and existing chat history",
  "decision": "The checklist exists only in the assistant current-session working context. Use the harness conversation history already available; add no scratch file, duplicate message log, public ledger, durable answer block, message index or cross-session question backlog. Remove the feature-added message indexing and candidate direction ledger/answer content. A content-free retirement notice preserves VER-002's immutable link. Remove the newly made D035 raw-chat capture instead of duplicating the harness log; retain D035's material decision and fingerprint as historical authority evidence. Both document and product evidence return to their prefeature identity rules, so no conversation-related projection can hide records or source. Amend the order accordingly.",
  "evidence": [
    "Two operator clarifications in this repair session require answered and unanswered messages to end with their session and reject duplicate chat logs. This records their product effect without copying their text.",
    "The design reviewer traced gateRecordProjection through config.mjs and found arbitrary contained verification roots could exclude executable source from product identity; removing that abandoned projection closes the class.",
    "Only docs/evidence/WO-235/answers/verify-002.md has an immutable report link. Its replacement notice contains no message, answer or pending obligation; the direction ledger and unneeded repair answer file are removed.",
    "The hidden reminder uses hookSpecificOutput.additionalContext and generated role instructions, with no answer-state reader, persistence or lifecycle call."
  ],
  "rejected": [
    {
      "option": "Keep a session scratch checklist until generic cleanup",
      "reason": "It duplicates question state and can survive the asking session; working context needs no file lifecycle."
    },
    {
      "option": "Backfill or migrate earlier message records",
      "reason": "The user rejects retaining these messages across sessions; no live contract requires them."
    },
    {
      "option": "Retain a narrowed product record projection",
      "reason": "No answer-record purpose remains and restoring the established identity avoids arbitrary root exclusions."
    }
  ],
  "reopenWhen": "Any generated guidance asks for persistent answer state, a runtime path consults answer records, the reminder leaks into operator notices, or source/record identity checks regress."
}
```

## WO-235-D037

```json
{
  "id": "WO-235-D037",
  "date": "2026-10-29",
  "dispatch": "resume: fix; regenerate the session-only guidance and resolve independent design findings",
  "decision": "Mint a new role oracle chained to wo235-repair-role-baseline.json for the D035/D036 operator corrections. The changed role text removes persistent answer bookkeeping, adds the private current-session checklist and restores exact-tree document guidance. Keep the previous oracle and its history byte-exact. Update the two current consumers, their fixture/source declarations and generated role roots together. Resolve the design review findings by removing the abandoned product projection and preparing the planning skeleton before switching branches, with cleanup of the invocation-owned file if the switch fails while main remains selected.",
  "evidence": [
    "npm run sync rebuilt runtime, emitted both installed role trees, refreshed authority evidence and publication locks. Its role-oracle check correctly failed on the old executor hash; the required remedy is a new authorized linked oracle, not rewriting the previous one.",
    "npm run publication:check initially reported two stale source locks after the authorized product edits; npm run sync regenerated them.",
    "The fresh design reviewer found two issues: arbitrary configured record roots could hide executable source from the new product projection; planning start could strand a new branch after skeleton I/O failure. The source recheck reports both fixed, zero remaining and zero new findings.",
    "The new branch-collision fixture asserts main stays selected, no skeleton remains and the working tree stays clean after failed creation. The relocated-root fixture changes a script under a declared verification root and requires product identity to change.",
    "Installed root bytes (CLAUDE.md plus each role, UTF-8): executor 34680 -> 34299 (-381); verifier 31184 -> 30820 (-364); reviewer 33685 -> 33268 (-417); release-close 22285 -> 21981 (-304); planner 23194 -> 22890 (-304); refuter 22008 -> 21704 (-304). Both harness roots match; no ceiling changed."
  ],
  "rejected": [
    {
      "option": "Rewrite the prior oracle hashes",
      "reason": "That would erase the source and measurements judged by the earlier verification."
    },
    {
      "option": "Keep the projected identity and narrow its exclusions",
      "reason": "The operator removed its answer-record purpose; the established identity is smaller and cannot hide source through arbitrary record roots."
    },
    {
      "option": "Allow planning start to fail after switching without cleanup",
      "reason": "The normal retry then fails its own clean-main precondition."
    }
  ],
  "reopenWhen": "A current generated role differs from the new oracle, a consumer still expects the retired protocol, or planning start leaves a failed preparation requiring manual recovery."
}
```

## WO-235-D038

```json
{
  "id": "WO-235-D038",
  "date": "2026-10-29",
  "dispatch": "resume: fix; resolve the fresh criteria and consistency reviews before validation",
  "decision": "Bind closed work-order size and track to the latest passing final review's available committed snapshot, and bind PR size to the first merge that published its path. Missing accepted objects remain unavailable. Replace the retired direction-registration test with ordinary relocated evidence-declaration coverage; remove the obsolete receipt import exclusion; update the current dependency rationales and planning catalog to D035/D036, preserving historical receipts separately. Rebind the corrected order under D036's existing authorization.",
  "evidence": [
    "The criteria adversary found two counterexamples: editing a closed order changes its measured size or track despite no new passing judgment; a later merge editing an archived PR replaces the original publication bytes.",
    "The new process-debt cases cover uncommitted and later committed order edits, absent and unavailable accepted snapshots, a document-tree snapshot, a failed review, and a later unrelated PR cleanup merge. Execution results belong to the complete review row, not this source review.",
    "The consistency reviewer found four stale consumers: the direction-registration fixture, work-order dependency rationales and generated index, the standing planning catalog, and the removed direction ledger's plan-receipts import exclusion.",
    "The source now reads accepted order bytes from the review's document tree or checkpoint and reads the first added PR path in first-parent merge history. Product 07 states those same boundaries."
  ],
  "rejected": [
    {
      "option": "Treat every current file of a closed order as passing",
      "reason": "A closed lifecycle does not judge later edits."
    },
    {
      "option": "Use the newest merge touching an archived PR",
      "reason": "That silently assigns later bytes to the original close."
    },
    {
      "option": "Keep old registration expectations or live planning descriptions as history",
      "reason": "Executable consumers and standing catalog rows must describe the current contract; immutable receipts already preserve prior judgments."
    }
  ],
  "reopenWhen": "A later archive edit changes a passing comparator, an unavailable snapshot silently falls back to current bytes, or a live consumer still requires the retired answer protocol."
}
```

## WO-235-D039

```json
{
  "id": "WO-235-D039",
  "date": "2026-10-29",
  "dispatch": "resume: fix; operator correction restores usefulness as the goal and rejects smallest-as-best",
  "decision": "Remove the size-ranking machinery, bestComparable byte columns, selected-example ranking and shorten-to-minimum prompts from this change. The operator explicitly reiterates that useful information is preferable regardless of its volume. The original planning pass substituted smallest passing for best comparable; this executor initially carried that unsupported quality proxy forward, including D038's source repairs. Define the review standard by the intended reader's task: information helps them understand the subject, answer questions, decide or act, verify claims, or recover reasoning. Preserve required content and the context, evidence, examples and alternatives that serve those needs. This is a contextual review judgment, not a new score, classifier or automated proof. Keep the contract-first shape, standing-document rule, planning skeleton and private session-only answer reminder. Amend criteria 5–7 to this authorized scope and trace the removal through callers, tests, manifests, generated roles and current docs.",
  "evidence": [
    "The operator rejects smallest as the goal and restates the priority of useful information over compact useless information during this repair; authority comes from the current session, with no duplicate message capture under D036.",
    "The original order at its filing commit 77cbb014, dated 2026-10-26, defines the best-comparable standard as the smallest passing instance and tells the writer to disclose changed conditions or shorten. Its cited product principle concerned outcome standards and historical performance, which did not establish byte count as quality.",
    "The implementation sorted comparison candidates by bytes and selected the smallest example in reader guidance; a passing structural check cannot establish that one artifact better serves its reader than another.",
    "D038's two comparison repairs were source-reviewed with zero remaining findings before this correction. Their entire component is now removed because its objective was wrong; no execution result for those new cases is claimed.",
    "Historical comparison-probe.json, controls.json, prior role oracles and immutable verification reports retain their original meaning. The comparison probe source and implementation remain available in refs/dotln/checkpoint/WO-235/14; the obsolete executable probe is removed from the proposed tree. These historical instruments are not evidence for the corrected behavior."
  ],
  "traps": {
    "seekingTheWrongGoal": "Minimizing bytes substitutes a measurable proxy for useful information. Remove the ranking rather than relabeling its output.",
    "driftToLowPerformance": "Derive content and structure from the contract and reader needs, not the latest or shortest predecessor.",
    "ruleBeating": "The new fixtures prove guidance delivery and noninterference only; no structural pass is claimed to certify information quality."
  },
  "rejected": [
    {
      "option": "Keep the ranking because it is advisory",
      "reason": "An advisory still pushes the wrong optimization goal."
    },
    {
      "option": "Rename the minimum as a usefulness comparison",
      "reason": "The implementation has no evidence measuring usefulness."
    },
    {
      "option": "Add a universal usefulness score or automated classifier",
      "reason": "Reader needs are contextual and no validated measurement is established by this order."
    }
  ],
  "reopenWhen": "A live caller ranks artifact quality by size, guidance removes context needed by its reader, or actual outcomes show the stated review standard is insufficient."
}
```

## WO-235-D040

```json
{
  "id": "WO-235-D040",
  "date": "2026-10-29",
  "dispatch": "resume: fix; bind the operator usefulness correction to generated roles and their consumers",
  "decision": "Mint a separate role oracle chained to wo235-private-reply-role-baseline.json for D039. The guidance now defines usefulness through the reader task, preserves required content and relevant context, and rejects size or structural passes as a quality score. Remove the size-history module, its meter and lifecycle callers, selected-example guidance and dedicated comparison tests. Preserve the planning skeleton and ordinary malformed-example diagnostics. Update both current oracle consumers and the runner source declaration together. Keep prior measurements and oracles unchanged; resource bytes remain observations, not optimization targets.",
  "evidence": [
    "The operator correction in D039 supplies authority; the source of the new expected role bytes is harnessInstallation from the compiled contributor source at both economy settings.",
    "Reader regression coverage changes the example lengths on every surface and requires unchanged guidance and unchanged supplied context. Completion and exported planning cases reject any return of a size-minimum advisory. These establish delivery and noninterference, not semantic usefulness.",
    "node scripts/harness.mjs emit regenerated 35 installed surfaces from the current source.",
    "Installed root bytes (CLAUDE.md plus each role, UTF-8): executor 34299 -> 34497 (+198); verifier 30820 -> 31018 (+198); reviewer 33268 -> 33466 (+198); release-close 21981 -> 22179 (+198); planner 22890 -> 23088 (+198); refuter 21704 -> 21902 (+198). Both roots match; no ceiling changed."
  ],
  "rejected": [
    {
      "option": "Rewrite the previous oracle",
      "reason": "The prior instruction bytes remain historical evidence."
    },
    {
      "option": "Retain the old comparator tests as live product requirements",
      "reason": "They would enforce the exact size-minimum goal the operator rejected; their source is preserved in the earlier checkpoints."
    },
    {
      "option": "Replace the comparator with an unvalidated usefulness score",
      "reason": "The reader-task standard is contextual judgment, not an established classifier."
    }
  ],
  "reopenWhen": "An installed role differs from its source or oracle, any live path ranks document quality by bytes, or the generated rule omits the operator usefulness boundary."
}
```

## WO-235-D041

```json
{
  "id": "WO-235-D041",
  "date": "2026-10-29",
  "dispatch": "resume: fix; resolve the independent rechecks of the usefulness correction",
  "decision": "Keep publication guidance available when an optional example is malformed: append its diagnostic to the valid contract, profile, reader and usefulness text. Preserve strict errors from the explicit profile and preview commands and the ordinary invalid-profile diagnostic. Strengthen the exported planning regression to inspect stdout and stderr for both start and receipt. Replace the exported kit README's stale comparator paragraph with the same reader-task standard. These are the design, coverage and consistency findings from the D039 rechecks, not additional product scope.",
  "evidence": [
    "The design reviewer traced optional example validation through profileGuidance into writingGuidance's catch: after removing example selection, a broken example could still erase the unrelated valid guidance.",
    "The reader fixtures now cover a dangling examples directory and malformed example, retaining the contract/reader/usefulness output plus diagnostic while explicit profile and preview remain strict.",
    "The criteria reviewer found the retired start advisory had used stdout, but the new assertion inspected only receipt.stderr. The export fixture already captures both commands' streams; it now judges both streams for both commands.",
    "The consistency reviewer found the kit README still named a best-comparable size ratio after its implementation was removed. Its current guidance now preserves useful information for the named reader without selecting an example by length."
  ],
  "rejected": [
    {
      "option": "Ignore all malformed examples",
      "reason": "Existing explicit diagnostic routes remain useful and must remain visible."
    },
    {
      "option": "Keep only an unavailable message in publication guidance",
      "reason": "Optional examples no longer contribute to the valid guidance and should not suppress it."
    },
    {
      "option": "Add another command invocation solely to inspect stdout",
      "reason": "The existing exported fixture already captures the required streams."
    }
  ],
  "reopenWhen": "An unrelated example failure suppresses valid publication guidance or a retired size advisory escapes the planning output regression."
}
```

## WO-235-D042

```json
{
  "id": "WO-235-D042",
  "date": "2026-10-29",
  "dispatch": "resume: fix; operator identifies sentence-by-sentence accumulation as the document-maintenance failure",
  "decision": "Make the affected paragraph or section the unit of review when updating an existing document. A single-line change remains valid when the resulting passage is coherent; rewrite or split accumulated prose when necessary while preserving useful information. Preserve an established useful structure, and require a concrete defect or changed reader need for broader reorganization. Touched passages and nearby defects receive bounded maintenance within scope; there is no automatic repository-wide quality sweep or sentence-count target. Amend the shared role rule and criterion 7, regenerate its separately chained oracle and measurements, and return the material changes to the three current reviewers before validation.",
  "evidence": [
    "The operator identifies progressive one-sentence additions to an initially coherent paragraph as the failure to address and asks about local edits, inherited document debt and stability after a quality pass.",
    "The current shared rule describes standing documents as current state, but did not explicitly require integration of each edit into the surrounding passage.",
    "The operator accepted the local proposed Angular profile rewrite as a concrete example of the reader-based approach. That example remains a local proposal; no target repository was edited or published.",
    "Compiled contributor source generates the role text at both economy settings. node scripts/harness.mjs emit regenerated 35 surfaces; wo235-maintenance-role-baseline.json pins all twelve installed roles and chains the unchanged usefulness oracle. Artifact creation and document maintenance occupy separate rules so the shared guidance also integrates the addition coherently.",
    "Installed root bytes (CLAUDE.md plus each role, UTF-8): executor 34497 -> 34892 (+395); verifier 31018 -> 31413 (+395); reviewer 33466 -> 33861 (+395); release-close 22179 -> 22574 (+395); planner 23088 -> 23483 (+395); refuter 21902 -> 22297 (+395). Both roots match; no ceiling changed."
  ],
  "rejected": [
    {
      "option": "Append every new fact as an isolated sentence",
      "reason": "Local correctness does not preserve coherence of the accumulated passage."
    },
    {
      "option": "Let each agent redesign the whole document to its preference",
      "reason": "Useful established structure should remain stable without a concrete reason to change it."
    },
    {
      "option": "Require a full quality pass for every write-back",
      "reason": "Bounded local maintenance addresses the identified failure without turning a small update into unrelated work."
    }
  ],
  "reopenWhen": "Local additions again leave incoherent passages, useful information is lost in cleanup, or agents repeatedly reorganize settled documents without a concrete need."
}
```

## WO-235-D043

```json
{
  "id": "WO-235-D043",
  "date": "2026-10-29",
  "dispatch": "scope expand: add a current-session quality pass command for document targets; pause for a PC restart before completing the expansion",
  "decision": "Add quality pass: as a conversational command in the current session. Accept a file, list, folder, described set of documents, or a specific paragraph/location. Resolve and announce the edit boundary; ask only about material target or reader ambiguity. Apply the reader-based usefulness and coherent-passage rules, including a no-change outcome when the target is already sound. The command authorizes the described documentation edits while preserving the active task, lifecycle phase, protected records, writer isolation, live gates and publication controls. It adds no workflow event, command-specific gate, public message ledger or automated quality score. The operator then requested a pause for a PC restart; preserve the partial implementation without claiming validation or completion.",
  "evidence": [
    "The operator explicitly expands WO-235 to add the command and enumerates all five target forms during this session. This product decision records the scope without duplicating the conversation log.",
    "The existing first-party session-command contract uses generated shared role guidance without a lifecycle event. The prompt hook already identifies the first content line and excludes host task notifications from operator reminders.",
    "The partial implementation adds a shared document-quality.ts instruction, installs it into every role, delivers it on a leading quality pass: prompt, and extends metadata and document-dispatch prefix consumers. Runtime and evidence declarations include the new module. Generated outputs, regression coverage, the amended order and oracle chain are still unfinished and unvalidated.",
    "All three existing repair workers completed the preceding D042 recheck with zero new findings. They have not reviewed the D043 command. No complete review run has started for this repair session."
  ],
  "traps": {
    "seekingTheWrongGoal": "Judge usefulness for the reader, not shorter prose or a quality score.",
    "driftToLowPerformance": "Preserve useful content and settled structure; a local target does not authorize a whole-document rewrite.",
    "shiftingTheBurden": "Resolve descriptive targets from available repository evidence instead of requiring the operator to enumerate every path."
  },
  "rejected": [
    {
      "option": "Leave quality passes to repeated ad hoc instructions",
      "reason": "The operator requested an easy and consistent command."
    },
    {
      "option": "Add a new lifecycle, mandatory review ceremony or numeric quality threshold",
      "reason": "The requested action is a bounded document-editing task in the current session."
    },
    {
      "option": "Treat broad wording as permission to rewrite all documents",
      "reason": "The edit set must match the requested subject and be stated before editing."
    }
  ],
  "reopenWhen": "The target cannot be resolved without a material assumption, the command expands edits beyond the target, or real use shows that it adds friction or loses useful information."
}
```

## WO-235-D044

```json
{
  "id": "WO-235-D044",
  "date": "2026-10-29",
  "dispatch": "resume: fix; continue the paused repair and the operator-authorized D043 quality pass expansion",
  "decision": "Resume the recorded repair without replaying RepairRequested. Reserve this Codex session through the existing writer function and adopt the current authored work. Finish the D043 command with shared role/prompt guidance, all five documented target forms, first-content-line and host-notification tests, and content-free metadata classification. Missing targets require resolution rather than an implicit repository sweep. Preserve the existing lifecycle, immutable records, generated-source editing, writer, live-gate and publication controls. Amend the order under D043 authority and mint a separate quality-pass role oracle chained to the unchanged maintenance oracle. Keep the already prepared minor release and internal component versions; no dependency or publication effect is added.",
  "evidence": [
    "Canonical status at entry is repairing with VER-002 as the failure source and repair-complete as the only legal next action; the saved handoff identifies D043 as partial and unvalidated after the operator restart pause.",
    "The operator resumed with resume: fix. Current session readback is codex-cli 0.165.0, gpt-6-astra, max, codex-session-readback. Writer inspection initially showed no reservation; reserveCodexDispatchWriter and harness begin established the resumed session without appending another lifecycle dispatch.",
    "npm run build and node scripts/harness.mjs emit succeeded after finishing the command and its source declarations. The oracle hashes harnessInstallation at both economy settings; prior oracle files remain unchanged.",
    "Installed root bytes in both trees: executor 34892 -> 36098; verifier 31413 -> 32619; reviewer 33861 -> 35067; release-close 22574 -> 23780; planner 23483 -> 24689; refuter 22297 -> 23503. Each grows by 1206. The standing product 07 route accepts executor 40194, reviewer 39163 and planner 28785 (measured bytes plus 4096); all other effective ceilings remain unchanged. quality-pass-cold-start.json records the measured source, comparison and availability limits.",
    "npm run release -- prepare --local retains v0.103.0. Three fresh independent Codex workers are planned for the resumed subject, with no additional writers. Prior-session review results stay historical; current complete and document validation remain required."
  ],
  "traps": {
    "seekingTheWrongGoal": "Judge usefulness for the intended reader; byte measurements are resource observations, never a quality target.",
    "ruleBeating": "Fixture delivery is not proof of semantic usefulness. Review the actual contract and generated consumers, and claim only observed results.",
    "shiftingTheBurden": "Resolve descriptive targets from repository evidence; ask only about material ambiguity."
  },
  "rejected": [
    {
      "option": "Replay resume fix to obtain a new writer reservation",
      "reason": "The repair dispatch is already recorded; replay is illegal and would misstate lifecycle history."
    },
    {
      "option": "NoOp on the paused command",
      "reason": "D043 records explicit authorization and the operator resumed the unfinished repair."
    },
    {
      "option": "Add a document quality score, new gate or automatic broad rewrite",
      "reason": "The authorized command applies reader judgment to the requested target within existing controls."
    }
  ],
  "reopenWhen": "The prompt route misses a supported leading command, a prose or host-notification mention invokes it, the documented scope widens edits or persists question state, or source/generated consumers disagree."
}
```

## WO-235-D045

```json
{
  "id": "WO-235-D045",
  "date": "2026-10-29",
  "dispatch": "resume: fix; resolve the resumed independent consistency review",
  "decision": "Integrate the current private-session and usefulness contract into the two mutable planning candidate dispositions that still described the withdrawn public ledger and size-ranking columns. Keep the original dated pass and immutable reports unchanged. The skeleton allocation remains with WO-235 until WO-088 moves pass registration; the field case reopens on missed ideation questions/actions or loss of durable product decisions, not on a retired ledger format.",
  "evidence": [
    "The fresh consistency reviewer identified docs/planning/work-order-map.md candidate 11 under the 2026-10-26 pass and candidate 12 under the later field cases as retaining the removed ledger and meter claims.",
    "D036 limits answer support to current-session context and ordinary decision records; D039 removes size-ranking machinery. The current order and catalog row already carry that boundary.",
    "The source change replaces the two obsolete current-state explanations and links D036/D039 while retaining their candidate subjects and allocation rationale."
  ],
  "rejected": [
    {
      "option": "Leave the dated wording in the current candidate register",
      "reason": "A current disposition would continue promising removed machinery and reopen against a nonexistent ledger."
    },
    {
      "option": "Rewrite the original planning pass or filed verification",
      "reason": "Those are historical evidence of the former design and remain immutable."
    }
  ],
  "reopenWhen": "A mutable work-order or candidate surface again assigns current obligations to the removed ledger or size-ranking mechanism."
}
```

## WO-235-D046

```json
{
  "id": "WO-235-D046",
  "date": "2026-10-29",
  "dispatch": "resume: fix; prepare the reviewed candidate for complete validation",
  "decision": "No integration is required while main and this worktree have the same HEAD. The executor unnecessarily invoked the integration helper after observing that equality; its missing-intake-backup refusal made no integration. Preserve intake and the current work, and proceed with the required formatting, synchronization and validation.",
  "evidence": [
    "git rev-parse HEAD main returned 3db7571f1f0c19a935d4cbdff4c05cc3bfdee61f for both refs.",
    "The main checkout scripts/worktree.mjs integrate WO-235 command exited 1: ignored intake requires --intake-backup <named archive.zip>; use npm run backup:intake first. This is a helper precondition, not evidence that main moved."
  ],
  "rejected": [
    {
      "option": "Create an intake archive and retry an integration with identical heads",
      "reason": "The role requires integration when main moves; no upstream change is present and preservation needs no extra copy here."
    },
    {
      "option": "Bypass the intake precondition",
      "reason": "There is no integration to perform and no reason to weaken recovery protection."
    }
  ],
  "reopenWhen": "main gains a commit absent from this worktree before the complete run, requiring the canonical intake-preserving integration route."
}
```

## WO-235-D047

```json
{
  "id": "WO-235-D047",
  "date": "2026-10-29",
  "dispatch": "resume: fix; repair the complete review structural-preflight failure",
  "decision": "Remove the obsolete process-debt Stop-runtime installer, its four calls and its copied-fixture declaration. They were introduced for the removed answer-check path; the retained finish hook matches main and no longer consumes that setup. Preserve the lifecycle and harness CLI declarations and the strict nonempty-entry validation. The failed complete row supplies no passing claim; reproduce its named structural check, then run a fresh complete review.",
  "evidence": [
    "The complete npm test -- --review row at 2026-10-29T21:18:53.111Z exited 1 at declarations: Invalid copied-fixture declaration: scripts/test-process-debt.fixture-inputs.json. Product suites were not run.",
    "copiedFixtureClosures in scripts/lib/machinery-coverage.mjs requires a nonempty entries array. The newly added process-debt Stop runtime row had entries:[] and copied dispatch-journal.mjs, temporary-root-records.mjs and scripts/lib.",
    "The current harness-host.ts diff changes the host version, quality guidance import/prefix and assistant prompt context; the finish path is unchanged from main after the direction checks were removed. The new installStopRuntime helper and calls therefore carried abandoned setup.",
    "node scripts/harness.mjs bounded -- node scripts/structural-checks.mjs declarations passed with STRUCTURAL_RESULT exitCode 0, finishedAt 2026-10-29T21:19:47.865Z."
  ],
  "rejected": [
    {
      "option": "Permit empty fixture entry lists",
      "reason": "That weakens a useful declaration contract to retain obsolete setup."
    },
    {
      "option": "Invent an entry for the abandoned helper",
      "reason": "No current finish-path change requires the new helper; removing the residue keeps the fixture focused."
    }
  ],
  "reopenWhen": "A retained finish-path dependency requires additional fixture installation or the fresh complete run finds another declared-input mismatch."
}
```

## WO-235-D048

```json
{
  "id": "WO-235-D048",
  "date": "2026-10-29",
  "dispatch": "resume: fix; repair the historical ceiling assertion found by complete validation",
  "decision": "Keep historical and current startup-cost assertions on their respective subjects. Compare the initial WO-235 oracle measurement with its recorded historical ceiling; retain the independent budgetVerdict assertion that checks current generated bytes against configured budgets and acceptances. Preserve every oracle and budget byte. This repairs an incomplete oracle-consumer migration, not a change to the command or a relaxation of current cost checking.",
  "evidence": [
    "The second complete review exited 1 at 2026-10-29T21:30:06.799Z. The process-debt suite ran 178 cases: 177 passed, one failed. The failure is assert.ok(measured.ceiling === null || bytes <= measured.ceiling) in scripts/test-gate-followups.mjs.",
    "The test binds measured to the original wo235-role-baseline.json startup cost, while bytes measures the current quality-pass guidance. D044 accepted that new growth in the current budgets; the preceding budgetVerdict assertion already checks it.",
    "The corrected historical assertion uses measured.bytes; current budget checking, the generated-root hash checks, all measurement links and historical headroom checks remain.",
    "The bounded named reproduction executed one passing case with no skips or failures: node scripts/harness.mjs bounded -- node --test --test-name-pattern='bounded role wording preserves prior savings' scripts/test-gate-followups.mjs; finishedAt 2026-10-29T21:30:35.618Z."
  ],
  "rejected": [
    {
      "option": "Raise the historical oracle ceiling or rewrite its measured bytes",
      "reason": "Those bytes record a prior subject and must remain unchanged."
    },
    {
      "option": "Delete the current budget assertion",
      "reason": "Current generated guidance still needs its configured or explicitly accepted ceiling."
    }
  ],
  "reopenWhen": "Another historical oracle assertion is applied to a later subject, or current generated bytes can evade their current budget check."
}
```

## WO-235-D049

```json
{
  "id": "WO-235-D049",
  "date": "2026-10-29",
  "dispatch": "resume: fix; bounded adjacent repair of the oversized-listing fixture found by complete validation",
  "decision": "Let the synthetic Git process drain its stdout before exiting. Wrap its routes in main, return after synthetic output, and use process.exitCode for the delegated Git result. Keep the production 16 MiB limit, generated path count, all three refusal assertions and checkout-preservation checks unchanged. This is adjacent-0002, a fixture-only repair within the existing close tests and complete review; no production behavior, dependency or expected-data oracle changes.",
  "evidence": [
    "The third complete review ended at 2026-10-29T22:06:07.810Z with exit 1: 43 top-level entries passed and two failed. The concrete failure was oversized target-files listing names its checkout role and a runnable close retry; 45 of that file's 46 cases passed. launchpad:file:test-launchpad-export.mjs was unrun after that failure, not a separate observed defect. Code and build output stayed unchanged.",
    "The failed assertion expected a 16 MiB refusal but received ENAMETOOLONG for a synthetic path. The fake Git route queued 19000 stdout writes and immediately called process.exit(0). scripts/lib/git.mjs accepts a successful NUL-terminated list below its buffer limit, so a truncated whole-record prefix can reach ordinary path handling.",
    "Context7's Node.js v26.0.0 primary documentation, https://github.com/nodejs/node/blob/v26.0.0/doc/api/process.md, states that process.exit can terminate pending stdout writes and recommends natural exit with process.exitCode. The local runtime is Node.js v26.9.0.",
    "The first bounded fast-reader probe delivered the complete output and failed its truncation assertion; it did not reproduce the timing defect. An initial delayed-reader instrument attached its counter too late and was excluded. The corrected probe attached the counter before pausing reads: forced exit delivered 137250, 130180 and 133210 bytes; natural exit delivered all 19216890 bytes in each of three runs. Its bounded result passed at 2026-10-29T22:08:08.938Z. This demonstrates the fixture defect under backpressure; the original run's precise scheduling is unobserved.",
    "The intent announcement preceded a safe-boundary message check and reread of queue revision 7. No operator redirection arrived in the available conversation; the check-in is actor-attested, with no independent inbox readback claimed. The bounded named reproduction passed all three oversized-listing cases, with no failures or skips, at 2026-10-29T22:09:44.160Z. A fresh complete review remains required."
  ],
  "traps": {
    "seekingTheWrongGoal": "Preserve the refusal behavior being tested; do not weaken an assertion merely to obtain a green run.",
    "fixesThatFail": "Repair the synthetic producer's exit behavior instead of changing the production size limit in response to incomplete fixture output."
  },
  "rejected": [
    {
      "option": "NoOp and repeatedly rerun the unchanged fixture",
      "reason": "The documented and reproduced output-loss path would remain timing-dependent."
    },
    {
      "option": "Accept ENAMETOOLONG or relax the production size limit",
      "reason": "Neither would prove the intended overflow refusal or repair the fixture's incomplete output."
    },
    {
      "option": "Add a fixed delay before forcing exit",
      "reason": "A delay would still depend on scheduling; natural exit waits for the queued output."
    }
  ],
  "reopenWhen": "The synthetic process loses queued output, a refusal vector no longer reaches the size limit, or complete validation exposes a different close failure."
}
```

## WO-235-D050

```json
{
  "id": "WO-235-D050",
  "date": "2026-10-29",
  "dispatch": "resume: verify; VER-003 judges the repair of VER-002 F5 to F8 and the amended order's eleven criteria",
  "decision": "VER-003 fails WO-235 on F1: on Claude Code 2.1.312 a host task notification receives the private reply checklist, so criteria 1 and 9 are unmet, and criterion 10 is unmet because the security document and product 07 state the exclusion as built. The host writes a task notification's transcript enqueue row without commandMode and marks the following user row with origin kind task-notification, prompt source system and turn origin task_notification. promptRoute reads only commandMode, returns unattributed from the enqueue row, and never reaches its terminal-envelope check, which accepts the same 409 bytes. The fixtures feed only the shapes the classifier already knows. The acceptance criteria are the standard of good, and each is judged by whether the solution meets it; each document follow-up is judged by this order's own usefulness standard, what its reader can understand, answer, decide, act on, verify or recover. The other eight criteria are met at code identity 15868bbc, the subject of checkpoint 16. VER-002 F5 is resolved: the document row again binds the exact candidate tree, and VER-002's own reproduction, repeated on a scratch clone of checkpoint 16, is now refused once three faults enter decisions.md and handoff.md, while the document check names all three. F6 and F8 are resolved by removal: no completion, planning route or Stop consults answer state. F7's public-record duty is superseded by D035 and D036, and no historical answer is fabricated. Three defects that break no criterion are boarded in D051 to D053. A draft finding on product 05's trap-table example was withdrawn before filing (D054).",
  "followup": "resume: fix repairs VER-003 F1: on the supported Claude Code host a task notification receives no reminder and journals as a host notification, read from the host's own notification metadata, while an operator message, including one that pastes an envelope, keeps the reminder; add a fixture with the 2.1.312 transcript shape. Take or dispose D051 to D053 within the Boy Scout bound.",
  "evidence": [
    "Live in this session: the background npm run test:docs task completed at 2026-10-30T00:16:11Z, and its UserPromptSubmit additional context carried the reply checklist; the journal row records route mid-turn, routeSource transcript-enqueue, attribution unattributed, source claude-prompt-hook, 409 bytes",
    "The session transcript: a queue-operation enqueue row with the notification's exact content and no commandMode at 00:16:11.967Z, then a user row whose origin kind is task-notification, promptSource system and turnOrigin task_notification",
    "A copy of terminalTaskNotification from packages/skeleton/src/harness-host.ts returns true for the same 409 bytes; promptRoute returns from its enqueue branch before reaching it (harness-host.ts 1336 to 1399)",
    "scripts/test-harness.mjs: the notification fixtures use an attachment with commandMode task-notification or no transcript row, and the existing case for an enqueue row without commandMode expects unattributed",
    "npm test -- --review passed at 2026-10-29T22:48:34Z: 45 required suites, 111 fresh, none unrun, at code identity 15868bbc7f7eb4ad221d4dabba554b5bfc08bed5e7f99cde3bec91517de80545, which the current tree keeps",
    "npm run test:docs passed at 22:58:15Z for tree 680bb2b1, the tree of refs/dotln/checkpoint/WO-235/16; the verify dispatch then changed only the control log, docs/control/current.md and the work-order index",
    "F5 probe: on a scratch clone of checkpoint 16 with this worktree's gate index, requireDocumentRow returned the 22:58:15Z row and checkDocs found nothing in decisions.md and handoff.md; after a decision with an unprefixed dispatch and a home path, and a broken link in handoff.md, the tree became f5c9e054, requireDocumentRow refused and checkDocs reported the three faults",
    "The twelve installed role files carry every shared rule and none of the retired ledger or size terms, and match packages/skeleton/fixtures/wo235-quality-pass-role-baseline.json; that oracle chains through five earlier WO-235 oracles to wo234-integration-role-baseline.json, each historical hash matching",
    "The prompt hook gave each of the eleven operator messages this session received before VER-003 was written, one typed and ten untyped, the reply checklist as assistant context only; each journal row keeps the fifteen fields base recorded, with no message index or prompt text",
    "scripts/resume.mjs differs from base only in its handoff-evidence briefing line; no production module reads a direction ledger, answer block or answer state; the Stop path of packages/skeleton/src/harness-host.ts is unchanged from base",
    "This verification ran npm run format:check, git diff --check, node scripts/harness.mjs check, node scripts/meta.mjs --check and npm run publication:check, each passing"
  ],
  "rejected": [
    {
      "option": "Pass, with the notification case as a follow-up",
      "reason": "Criteria 1 and 9 state that host notifications receive no reminder, and on the supported host one did."
    },
    {
      "option": "Fail on the boarded follow-ups",
      "reason": "None breaks a criterion or a behavior main had; product 07 routes such a defect as a follow-up."
    },
    {
      "option": "Repair during verification",
      "reason": "The verifier edits no implementation."
    }
  ],
  "reopenWhen": "A repair verification finds F1 resolved on the supported host, or the operator waives criterion 1, 9 or 10."
}
```

## WO-235-D051

```json
{
  "id": "WO-235-D051",
  "date": "2026-10-29",
  "dispatch": "resume: verify; VER-003 follow-up on the contract writingGuidance names for PR titles and commit subjects",
  "decision": "Board a follow-up. By this order's usefulness standard, the guidance must let its reader, the agent writing a pull-request title or commit subject, act on the rules that judge that text and verify against them. For prTitle and commitSubject it names rules in scripts/lib/github-body.mjs beside product 07. That module holds no shape rule for either: it only takes a target pull request's title from the first line of its commit message. The rules are product 07's title and commit guidance, the reviewer role's title rule, the attribution checks in worktree publish and the commit-msg hook, and, for target repositories, lintOutwardArtifact in scripts/lib/outward-lint.mjs. Criterion 6 holds, because the contract comes first and product 07 is part of it, but a writer who follows the code pointer finds nothing.",
  "followup": "Name, for each writingGuidance surface, the documents and checks that judge it, and add a reader fixture that resolves each named check.",
  "evidence": [
    "writingGuidance output at the subject for prTitle, prBody, commitSubject, releaseNotes and releasePage",
    "scripts/lib/github-body.mjs 1198 to 1202: generateTargetPullRequest takes the title from the commit message's first line; its other title references are link titles",
    "scripts/lib/outward-lint.mjs 691 to 711: subject.shape, subject.type, subject.length, commit.blank-line and title.single-line for the commit and pr-title kinds",
    "scripts/worktree.mjs publish checks the title and body for AI attribution and prints writingGuidance for prTitle and prBody"
  ],
  "rejected": [
    {
      "option": "Fail criterion 6",
      "reason": "The guidance names the contract first, and product 07, which it names, holds the rules."
    }
  ],
  "reopenWhen": "A title or subject rule moves, or a fixture shows a named check absent."
}
```

## WO-235-D052

```json
{
  "id": "WO-235-D052",
  "date": "2026-10-29",
  "dispatch": "resume: verify; VER-003 follow-up on WO-235's sequence title, which still promises the withdrawn guarantee",
  "decision": "Board a follow-up. By this order's usefulness standard, a queue title must let a reader scanning the sequence or the generated work-order index understand what the order delivers and decide on it. docs/planning/sequence.md still titles WO-235 with the withdrawn ledger's promise that no operator direction is dropped, and docs/work-orders/README.md repeats it, while the order now delivers a private reminder and claims no coverage guarantee (its Objective, criterion 8 and Non-goals). D045's reopening condition names mutable surfaces that keep the removed ledger's obligations; the title states that ledger's promise.",
  "followup": "Retitle WO-235's sequence entry to the built outcome, matching the order's heading, and regenerate the work-order index.",
  "evidence": [
    "docs/planning/sequence.md line 84, inside the dotln-work-order-sequence block; docs/work-orders/README.md lines 3 and 7",
    "The order's heading: Derive useful artifacts from their contracts and improve answer coverage privately without workflow gates",
    "WO-235-D045 reopenWhen: a mutable work-order or candidate surface again assigns current obligations to the removed ledger or size-ranking mechanism"
  ],
  "rejected": [
    {
      "option": "Leave the planner's title",
      "reason": "Every reader of the queue sees a guarantee the order disclaims."
    }
  ],
  "reopenWhen": "The sequence title and the order's heading again state different outcomes."
}
```

## WO-235-D053

```json
{
  "id": "WO-235-D053",
  "date": "2026-10-29",
  "dispatch": "resume: verify; VER-003 follow-up on code and declarations left from the withdrawn answer protocol",
  "decision": "Board a follow-up. The live receipt contract is the closed shape base kept, and a maintainer reading validateReceipt should understand from it what a receipt can carry. validateReceipt in scripts/lib/plan-receipts.mjs still admits an optional planning directions snapshot that no producer writes, none of the 64 filed receipts carries and no test exercises, relaxing the closed shape base kept. packages/skeleton/fixtures/wo235-control-baseline.json still pins harness-host.ts for the removed Stop control arm, which nothing reads, and scripts/test-runner.mjs declares that baseline as a harness-fixtures source although only scripts/test-control-segments.mjs reads it, under resume. No result changes.",
  "followup": "Remove the receipt directions admission so validateReceipt matches base's closed shape, drop the unused harness-host.ts pin and the harness-fixtures declaration of wo235-control-baseline.json, and rerun the declarations and plan-refutation checks.",
  "evidence": [
    "scripts/lib/plan-receipts.mjs 224 to 247; no other reference to receipt.directions outside the test that asserts its absence",
    "docs/planning/refutations: 64 receipts, none with a top-level directions field",
    "refs/dotln/checkpoint/WO-235/6 already carried the admission, before VER-001",
    "git grep wo235-control-baseline: read only by scripts/test-control-segments.mjs, which scripts/test-resume.sh runs"
  ],
  "rejected": [
    {
      "option": "Keep the admission for compatibility",
      "reason": "No released version or filed receipt carried the field."
    }
  ],
  "reopenWhen": "A producer writes a receipt directions field, or a consumer reads the baseline's harness-host.ts pin."
}
```

## WO-235-D054

```json
{
  "id": "WO-235-D054",
  "date": "2026-10-29",
  "dispatch": "resume: verify; operator corrections of this verification's trap-row finding, its standard of good and its claim that the usefulness direction was unrecorded",
  "kind": "correction",
  "misread": "Explaining a draft finding, this verification said the words behind D039 were unavailable because D036 left no capture. It judged product 05's drift-to-low-performance row by the literal reach of its example sentence, then answered the correction by reaching for the thirteen aspects of quality recorded for WO-145, proposing a define-good rule for every role, and describing the definition of good as a separate planner step. It also cited WO-145 by number as though the number explained itself.",
  "meant": "D036 removes only DotLn's duplicate capture and relies on the harness's own chat logs, which hold every Codex and Claude message; the repair session's Codex log holds the usefulness direction at 19:34:52Z. The acceptance criteria are the definition of good, provided the planner wrote them correctly, and good work is the solution meeting them. For documents, this order is the definition: information is useful when it helps its reader understand, answer, decide, act, verify or recover reasoning. The trap table's application column gives candidate examples for a lens applied case by case, as meta's own drift metrics show.",
  "changed": "The trap-row finding and two record-wording points were withdrawn before VER-003 was written, and no new role rule is proposed. VER-003 judges each criterion by whether the solution meets it and each document follow-up by this order's usefulness standard, and it names its sources plainly.",
  "decision": "Correct the verification's method before filing: read the harness logs before calling a message unavailable, take the acceptance criteria as the standard of good, and judge documents by this order's usefulness standard.",
  "evidence": [
    "The repair session's Codex log, searched for this direction only: the usefulness direction at 2026-10-29T19:34:52Z",
    "This verification's session: the operator identified the acceptance criteria as the definition of good and this order as the definition for documents",
    "node scripts/meta.mjs --check at the subject files coldStartBytes and gateStepCount under drift-to-low-performance independently of product 05's example",
    "docs/product/05-pattern-library.md: the trap table's second column is headed Candidate application to DotLn; the order's Objective and the shared role rule state the usefulness standard"
  ],
  "rejected": [
    {
      "option": "Keep the trap-row finding with narrower wording",
      "reason": "The example breaks no criterion and costs its reader nothing; the trap is applied case by case."
    },
    {
      "option": "Add a define-good rule to every generated role",
      "reason": "The acceptance criteria already are the standard the roles apply, and this order defines it for documents."
    }
  ],
  "reopenWhen": "A later verification calls a logged message unavailable without reading the harness log, or judges an item against a standard other than its criteria or, for a document, this order's usefulness standard."
}
```

## WO-235-D055

```json
{
  "id": "WO-235-D055",
  "date": "2026-10-29",
  "dispatch": "resume: fix; repair VER-003 F1, a host task notification that received the private reply checklist on Claude Code 2.1.312",
  "decision": "The reminder reaches only the operator's own prompts, and a prompt's text never decides where it came from. On Claude Code 2.1.312 the hook receives only the prompt and session title. The host queues a message it delivers itself, a task notification or another agent's report, as a queue-operation enqueue row with the prompt's exact bytes before running the hook, and writes nothing for an operator's prompt until the hook returns. The router walks the transcript's queue entries with the prompt's bytes: a delivery row with the same bytes consumes the oldest waiting entry, and an operator observation of the same bytes that this session's hook journaled no later than an entry accounts for it as the operator's own, sent again while the first copy waited; because the two times come from two processes' clocks, a tie or an unreadable entry time counts as the operator's. Any other waiting entry makes the prompt host-delivered: no reminder, and a host source in the journal that the operator intervention count leaves out, host-task-notification when the bytes open the task-notification envelope, whatever its status, host-agent-message when they open an agent-message envelope, and host-queued otherwise. The entry need not be the last row: an idle notice leaves it last, as VER-003 observed, and a notice absorbed mid-turn leaves it earlier with the turn's rows after it, the case VER-003 did not quote. A delivery row already written belongs to an earlier message, so the branch that attributed such a row is removed, as are the envelope-only fallback and the reading of a command mode on queue entries, which the host never writes. The reminder and the journal row share one transcript reading per hook input. Following the operator's direction during this fix that older Claude Code versions need no support, a launch-record fallback built for a notice that reaches its hook before its queue entry, a timing observed only on 2.1.308, was removed before validation.",
  "evidence": [
    "The installed Claude Code 2.1.312 bundle builds the UserPromptSubmit input from the session's base fields, hook_event_name, prompt and session_title; no origin, prompt source or command mode reaches the hook.",
    "Session journals and transcripts on 2.1.312: every operator prompt journaled before its own queue or user row (51 of 51 rows in this worktree; the criteria adversary found the journal row 4 to 7 ms ahead of the queue entry for all 22 queued operator prompts); seven task notifications reached their hook after their queue entry, four idle with it as the last message row and three absorbed mid-turn with later rows after it; two agent reports in this repair session reached their hook after their queue entry, which carries the agent-message bytes the hook received, while the later delivery row wraps them in the host's own text; agent-completion notices absorbed mid-turn fired no prompt hook.",
    "Replay of every 2.1.312 prompt in the local DotLn transcripts through the final router, with the transcript cut where that host's hook reads it: 113 operator prompts keep the reminder and stay unattributed; 14 agent reports and 42 task notifications get no reminder and journal under their host sources. Checkpoint 19's router gave every idle notice the reminder; it took a notice absorbed mid-turn for the host's only by its envelope text, the rule that also took pastes for host notices.",
    "Fixture comparison with checkpoint 19's router: VER-003's shape received the reminder there, and all four pasted envelopes of the fixture were taken for host notices; the repaired router reverses both.",
    "`node scripts/harness.mjs bounded -- node --test --test-name-pattern=\"host's own queue entry, not the envelope text|a notice is the host's when the host queued it|private reply reminders reach operator prompts|a host queue entry makes other words host-queued|delivery row already in the transcript|WO-178 prompt rows retain digest\" scripts/test-harness.mjs`: six tests passed, finishedAt 2026-10-30T01:46:04.529Z. They drive the generated session hook with the 2.1.312 shapes for idle and mid-turn notices, an agent report, four pastes, a copy delivered just before the paste, notices of every status, a typed prompt, and the same words sent twice while the first copy waits, with a readable and an unreadable entry time, and assert the reminder, journal source and intervention count."
  ],
  "traps": {
    "fixesThatFail": "Accepting any envelope after an enqueue row would pass the quoted shape while leaving mid-turn notices and agent reports to envelope text and taking pastes for the host's; one queue-entry rule with the operator's own journal row covers every observed host shape and keeps pastes and repeats the operator's.",
    "seekingTheWrongGoal": "A green fixture for the one quoted transcript is not the class; fixtures replay every hook-time shape the host produces, and the replay covers every 2.1.312 prompt recorded locally."
  },
  "rejected": [
    {
      "option": "Keep the envelope-only fallback for prompts without transcript evidence",
      "reason": "A pasted envelope would lose the reminder, which the repair rule forbids, and every observed 2.1.312 notice already has its queue entry when the hook reads."
    },
    {
      "option": "Identify a notice that reaches its hook before its queue entry by the recorded tool call it names",
      "reason": "Built and then removed: the timing was observed only on 2.1.308, the operator directed that older versions need no support, and every 2.1.312 observation had the queue entry."
    },
    {
      "option": "Attribute only terminal notices, giving other host-queued messages the reminder",
      "reason": "Agent reports and non-terminal notices are not operator prompts; the reminder would frame another agent's suggestions as operator requests."
    },
    {
      "option": "Read commandMode or origin on queue entries, or attribute the latest delivery row",
      "reason": "Claude Code writes neither field on queue entries, and on 2.1.312 a delivery row present at hook time can only belong to an earlier message."
    }
  ],
  "reopens": {
    "decisionId": "WO-219-D042",
    "observation": "VER-003 met WO-219-D042's reopening condition on Claude Code 2.1.312: a host task notification whose queue entry carried no command mode journaled unattributed under the prompt hook and counted as an operator intervention. D055 replaces that rule, which settled WO-188-D009's follow-up FUP-d4493f4251e69c87: a waiting queue entry that the operator's own journal row does not account for makes the prompt host-delivered, and an already-written delivery row, the explicit transcript attribution D042 preserved, belongs to an earlier message on that host, so it no longer attributes the prompt."
  },
  "reopenWhen": "A Claude Code message reaches its hook without its queue entry, the host passes origin metadata to UserPromptSubmit or moves its queue entry, an operator's prompt is journaled after its own queue entry or its hook journals nothing for a copy the operator then repeats while it waits, or the host delivers another kind of message through the prompt hook."
}
```

## WO-235-D056

```json
{
  "id": "WO-235-D056",
  "date": "2026-10-29",
  "dispatch": "resume: fix; take D051, the writing guidance that named the wrong module for PR titles and commit subjects",
  "decision": "writingGuidance opens with each surface's contract: the product sections that state its rules, resolved under the repository's configured product root, and the functions that judge or render a draft, each with what it does. PR titles and commit subjects name product 08 §PRs and commits, product 07 §Discipline, hasAiAttribution, which publish and the commit-msg hook apply, and for a target repository lintOutwardArtifact. The PR body adds pullRequestBodyShapeFailures and githubBodyProfileFailures. Release notes name product 08 §Release-note edition and parseReleaseNotes, and the Release page names releaseEdition, which renders it at release close. The contracts are exported, fully frozen named records; the reader suite resolves every named section and function, keeps github-body.mjs off the title and subject contracts, and follows a relocated product root. Product 08, the examples guide and the kit README describe the contract line.",
  "evidence": [
    "The commit-msg hook's attribution kind returns hasAiAttribution(request.message) in packages/compiler/src/feedback.ts; worktree publish refuses AI attribution in the title or body and applies assertPullRequestBodyShape and assertGitHubBodyProfile.",
    "product 08 §PRs and commits holds the headline and gitmoji title rules; product 07 §Discipline holds the PR-title, reviewer-writing and ratchet rules; product 08 §Release-note edition holds the five-section notes contract that parseReleaseNotes enforces; releaseEdition in scripts/release.mjs renders the Release page and refuses a relative link.",
    "node scripts/harness.mjs bounded -- node --test scripts/test-reader.mjs: 16 tests passed, finishedAt 2026-10-30T00:56:02.099Z; after the contract became named records under the product root, node scripts/harness.mjs bounded -- node --test --test-name-pattern=\"each surface's contract names product sections|profile and preview cover every surface\" scripts/test-reader.mjs: both passed, finishedAt 2026-10-30T01:24:02.638Z."
  ],
  "rejected": [
    {
      "option": "Name product 07 alone",
      "reason": "The writer could not test a draft against the checks that judge it."
    },
    {
      "option": "Name modules without the function that applies the rule, or fixed docs/ paths",
      "reason": "A module can hold no rule for the surface, as github-body.mjs held none for titles or subjects, and a repository that relocates its product root would be sent to files it does not have."
    }
  ],
  "reopenWhen": "A named section or function moves or is renamed, or a surface gains a check its contract does not name."
}
```

## WO-235-D057

```json
{
  "id": "WO-235-D057",
  "date": "2026-10-29",
  "dispatch": "resume: fix; dispose D052, WO-235's sequence title that still promises the withdrawn guarantee",
  "decision": "Leave the sequence to planning. docs/planning/sequence.md is part of the planning subject that refutation receipt 058 judged, and a planning pass judges its orders plus the sequence, so an executor's retitle is not this repair's to make. The retitle and the serial-order prose this repair first wrote made the plan check refuse the document gate, and the judged sequence bytes are restored; the regenerated work-order index again shows the planned title. D052's follow-up stays open for the next planning pass, which should retitle WO-235's entry and its serial-order line to the order's heading, as D052 and the consistency review asked.",
  "evidence": [
    "npm run test:docs recorded 2026-10-30T02:50:53.518Z failed plan-refutation-current and plan with: planning pass needs a receipt matching the current subject: sequence, vision, roles or order inventory changed (scripts/lib/plan-continuation.mjs requireSamePlan).",
    "docs/product/07-execution-guide.md: the default pass scope judges orders created or changed by the latest dated planning pass, plus the sequence.",
    "After the judged bytes were restored, git diff 3db7571f -- docs/planning/sequence.md is empty and node scripts/harness.mjs bounded -- node scripts/refute-plan.mjs check exits 0."
  ],
  "rejected": [
    {
      "option": "Keep the retitle and file a new planning receipt from this repair",
      "reason": "Refutation is a planning dispatch; the executor's role cannot open one."
    },
    {
      "option": "Exempt the sequence from the plan subject",
      "reason": "That would weaken the planning binding to admit an edit outside this role's authority."
    }
  ],
  "reopens": {
    "decisionId": "WO-235-D052",
    "observation": "The executor cannot take this follow-up: the sequence is a planning-subject input bound by receipt 058, and retitling it outside a planning pass fails the plan check. It remains for the next planning pass, together with the serial-order line in the same file that paraphrases the withdrawn guarantee."
  },
  "reopenWhen": "A planning pass retitles WO-235's sequence entry and serial-order line, or the plan subject stops binding the sequence."
}
```

## WO-235-D058

```json
{
  "id": "WO-235-D058",
  "date": "2026-10-29",
  "dispatch": "resume: fix; take D053, code and declarations left from the withdrawn answer protocol",
  "decision": "validateReceipt is byte-identical to base again: the closed receipt shape admits no directions field, and plan-refutation gains a case refusing a receipt that carries one. wo235-control-baseline.json keeps only the scripts/resume.mjs pin that test-control-segments reads under resume, and harness-fixtures no longer declares the file. docs/evidence/WO-235/controls.json stays as the dated record of the withdrawn control arm; nothing reads it.",
  "evidence": [
    "git diff 3db7571f -- scripts/lib/plan-receipts.mjs is empty.",
    "The remaining pin still matches: git show 3db7571f:scripts/resume.mjs hashes to sha256 9e31658b6d23024ce455dbfeaf657af89863ea49c7b0fa6a79e9791f57050656.",
    "node scripts/harness.mjs bounded -- node scripts/structural-checks.mjs declarations: STRUCTURAL_RESULT exitCode 0, finishedAt 2026-10-30T00:57:15.182Z.",
    "git grep finds no reader of docs/evidence/WO-235/controls.json."
  ],
  "rejected": [
    {
      "option": "Keep the directions admission for compatibility",
      "reason": "No released version or filed receipt carried the field."
    }
  ],
  "reopenWhen": "A producer writes a receipt directions field, or a consumer reads a harness-host.ts pin from the control baseline."
}
```

## WO-235-D059

```json
{
  "id": "WO-235-D059",
  "date": "2026-10-29",
  "dispatch": "resume: fix; resolve the three independent reviews of the VER-003 repair",
  "decision": "Resolve the thirty-one findings of the three reviews, their two rechecks and the final write-back check; the first round found eighteen, and two are recorded rather than fixed. The criteria adversary's three, an agent report receiving the reminder and counting as an intervention, a paste repeated while its first copy waits losing the reminder, and host-queued notices without a terminal status, are fixed by D055's final rule and its fixtures. Nine of the design improver's ten are taken: the branch that attributed an already-written delivery row is removed; the whole reading sits inside its guard; the memo and comments say what the code does; the route fields are literal unions read through one host-delivered helper; the writing contract became frozen named records under the configured product root with honest verbs (D056); report labels and withdrawn vocabulary left the changed comments; and the test builders were consolidated. Its sixth finding is boarded: observed facts still recognizes a background task's terminal notice from a prompt's envelope text and spells the host's queue and delivery rows separately from the prompt router. Four of the consistency reviewer's five are fixed in the two standing paragraphs, D055 and the three reader-profile descriptions; its fifth, the sequence prose, stays with planning together with VER-003 F3 (D057). The route label mid-turn stays for every host-queued message, since plan failures reads route values only for operator rows. The rechecks found ten more, all fixed: the adversary's and the design improver's shared case of unrecognized host-queued text, now journaled as host-queued and left out of the count; the journal path, tie rule and comment wording; a product 07 bullet that still described the removed router; the security document's journaling sentence; D055's checkpoint-19 replay claim and D057's search claim; and WO-219-D042, which D055 now reopens. The final write-back check found three record and wording points, all fixed: the handoff's live count, this decision's host-source wording and two over-long lines.",
  "followup": "Read the host's queue and delivery rows through shared helpers in observed-facts.ts and have the background-task notice observation follow the prompt router's queue-entry rule instead of a prompt's envelope text, with a fixture in which a pasted envelope records no task timing.",
  "evidence": [
    "First round: criteria adversary found 3, each with a 2.1.312 transcript or binary shape, fixed 3; design improver found 10, fixed 9, recorded 1 (its sixth); consistency reviewer found 5, fixed 4, recorded 1 (the sequence prose, D057). Rechecks: criteria adversary found 1 then 0; design improver found 4 then 1; consistency reviewer found 4, then 3 in the final write-back check; all fixed. Totals: found 31, fixed 29, recorded 2. All three were dotln-worker agents, 3 of the 20-agent cap, given the order, VER-003, D050 to D058 and candidate tree 48e3191ad8aa3994d01f2e87979188418de433c7 against refs/dotln/checkpoint/WO-235/19.",
    "packages/skeleton/src/observed-facts.ts transcriptTasks calls observeNotice(prompt, now) for every prompt and reads enqueue, queued-command and user rows with its own conditions; the prompt router reads the same row kinds in packages/skeleton/src/harness-host.ts.",
    "scripts/lib/plan-failures.mjs keeps route only on intervention rows and skips every host- source (task notifications, agent messages, other host-queued prompts) before it."
  ],
  "rejected": [
    {
      "option": "Give host-queued messages a new route value such as queued",
      "reason": "Host rows never reach the route tally, and a new value would change the journal vocabulary that older rows and plan failures share without changing any count."
    },
    {
      "option": "Change the background-task timing observation in this repair",
      "reason": "It records task timing, not who sent a prompt; no acceptance criterion covers it, and it predates this order."
    }
  ],
  "reopenWhen": "A pasted envelope changes a background task's observed terminal time, or a host-queued row reaches the intervention count through its route."
}
```

## WO-235-D060

```json
{
  "id": "WO-235-D060",
  "date": "2026-10-29",
  "dispatch": "resume: fix; bounded adjacent repair of the hedged-quantity scanner found during this fix",
  "decision": "scanHedges takes a number as a quantity only when neither a word character nor a dot precedes it and no dot and digit follows it, so a dotted version or identifier such as 2.1.312 or v0.103.0 is never a hedged quantity, while a decimal such as 2.5 minutes still is. This is adjacent-0003, completed through the worktree queue with its announcement, check-in and passing check; no other scanner rule changes.",
  "evidence": [
    "The session journal's HedgedQuantityObserved row at 2026-10-30T01:03:17.144Z took quantity 2.1 from the version 2.1.312 beside the preposition about, and the next prompt's context asked for an observed value of that version.",
    "node scripts/harness.mjs bounded -- node --test --test-name-pattern='lexical scanner excludes quotes' scripts/test-observed-facts.mjs: one test passed, finishedAt 2026-10-30T01:22:39.607Z, with two version phrases beside hedge markers unreported and a decimal hedge still reported."
  ],
  "rejected": [
    {
      "option": "Tell the preposition about from the hedge about",
      "reason": "That is a semantic reading of prose; the version number is the observed false quantity, and excluding it is exact."
    }
  ],
  "reopenWhen": "A dotted version is still reported as a hedged quantity, or a hedged decimal quantity stops being reported."
}
```

## WO-235-D061

```json
{
  "id": "WO-235-D061",
  "date": "2026-10-29",
  "dispatch": "resume: fix; repair the release-preparation case that the first complete review of this repair failed",
  "decision": "Keep release preparation's no-product-write assertion and exclude only the writing guidance's own contract line from it. D056 made that line name the product sections that state the release notes' rules, and the case's substring check for docs/product/ in the whole output read that name as a product write. Every other line of the output, the changed-file list and recorded-decision lines included, is still checked, and the case's byte comparison of the roadmap still proves the product document unchanged. A fresh complete review is required; the failed run supplies no passing claim.",
  "evidence": [
    "The complete npm test -- --review row recorded at 2026-10-30T02:00:43.826Z failed after 0 h 7 min: harness-fixtures and nine other checks passed, release:case:prepare_independent failed, and the remaining thirty-four were not started after that failure.",
    "node scripts/harness.mjs bounded -- bash -x scripts/test-release.sh --case prepare_independent traced the exit to `if grep -Fq 'docs/product/' <<<\"$prepared\"; then exit 1; fi`, after release prepare printed `Contract: docs/product/08-publication-compiler.md §Release-note edition; ...` and a changed-file list naming only docs/work-orders/WO-099-fixture.md, README.md and docs/evidence/WO-099/decisions.md.",
    "After the change, node scripts/harness.mjs bounded -- bash scripts/test-release.sh --case prepare_independent passed, finishedAt 2026-10-30T02:03:00.264Z; a shell check of the new condition detects a changed-file line under docs/product/ and passes a contract line alone."
  ],
  "rejected": [
    {
      "option": "Drop the product path from the writing guidance",
      "reason": "The path is what lets the writer find the rules, which is D051's repair."
    },
    {
      "option": "Pipe the output through grep -v into grep -q",
      "reason": "Under pipefail an early grep -q exit can end the pipeline with the first grep's broken-pipe status and hide a real product write."
    }
  ],
  "reopenWhen": "Release preparation writes or reports a product document, or another guidance line names a product path that an output check reads as a write."
}
```

## WO-235-D062

```json
{
  "id": "WO-235-D062",
  "date": "2026-10-29",
  "dispatch": "resume: verify; independently judge the repaired subject in VER-004",
  "decision": "Fail VER-004 on one blocking routing defect, affecting criteria 1, 9, 10 and 11. An idle operator prompt that was delivered without a queue entry leaves its digest observation available to account for a later identical host queue entry. The generated hook consequently supplies a host notification with the private checklist and supplies identical host-queued quality-pass words with document-editing guidance. Keep implementation unchanged in the read-only verification role and route the repair to WO-235. Match observations to completed deliveries as well as outstanding queues, so only an outstanding operator prompt accounts for an operator queue entry. Preserve the already-tested queued-repeat and paste behavior, host-message exclusion, existing telemetry shape and the session-only, nonblocking boundary.",
  "evidence": [
    "docs/evidence/WO-235/verification-004-route-probe.mjs: node scripts/harness.mjs bounded -- node docs/evidence/WO-235/verification-004-route-probe.mjs exited 1 at 2026-10-30T03:20:48.795Z. Expected host-task-notification; observed claude-prompt-hook, unattributed, host-route-unavailable.",
    "docs/evidence/WO-235/verification-004.json: the generated session hook delivered the checklist after the completed paste and delivered quality-pass guidance after the completed operator command. A fresh host notification received neither; four Stop cases admitted absent and malformed legacy ledgers and both re-entry values.",
    "packages/skeleton/src/harness-host.ts readPromptRoute, lines 1393 to 1405: operatorObservations includes every same-digest operator row, but a direct delivery with no waiting queue retires none of them. The next enqueue consumes that already-delivered observation and is marked as the operator's.",
    "The independent content audit matched twelve installed role hashes, both economy settings and the six WO-235 oracle links; all five writing surfaces were independent of example length and followed a relocated product root. validateReceipt is back to the closed base shape.",
    "The current code identity remains c95c868b54706d5a36347ebe0c5336196811c32bc430e212eac4d2f0a727ae59. The passing complete review row of 2026-10-30T02:36:55.614Z covers all forty-five current selected suites; reuse it rather than repeat the complete gate.",
    "VER-003 F2 and F4 are repaired. F3 stays planning-owned under D057; D059's task-timing follow-up remains boarded. VER-002 F5 is restored, F6 and F8 are removed, and F7 is superseded by D035 and D036.",
    "The scratch probe setup and output-budget corrections are recorded in verification-004.json; their corrected probes and targeted readbacks, not their failed or clipped attempts, support this verdict."
  ],
  "traps": {
    "ruleBeating": "A complete green fixture row does not cover the reversed history: the existing fixtures deliver the host notice before the paste or repeat an operator prompt that still waits. Probe an already-delivered operator prompt before the host notice.",
    "seekingTheWrongGoal": "Judge the stated exclusion and guidance behavior, not a coverage percentage or amount of evidence produced.",
    "shiftingTheBurden": "The verifier owns the verdict and defensive repair rule. No operator arbitration, answer ledger or new approval step is required."
  },
  "rejected": [
    {
      "option": "NoOp: credit the prior green fixture row without varying prompt history",
      "reason": "The independent generated-hook capture falsifies the stated host-message exclusion at that same code identity."
    },
    {
      "option": "Change the implementation during verification",
      "reason": "This role independently judges the submitted subject; implementation repair belongs to the next repair dispatch."
    },
    {
      "option": "Add persistent question state, a message index or a new gate to disambiguate routing",
      "reason": "D035 and D036 forbid those mechanisms. The repair must use existing host observations and retain the nonblocking boundary."
    },
    {
      "option": "Repeat the complete product gate",
      "reason": "All selected suites already pass at the unchanged code identity. A targeted counterexample establishes the defect, and a fresh document gate will judge the final records."
    }
  ],
  "reopenWhen": "The router retires observations for completed direct deliveries and the durable replay plus generated-hook history variations with host notifications and host-queued commands satisfy their expected results, while existing operator repeat and paste cases remain correct."
}
```

## WO-235-D063

```json
{
  "id": "WO-235-D063",
  "date": "2026-10-29",
  "dispatch": "resume: fix; the operator directs removing what WO-235 adds for operator messages, limited to this order's own additions",
  "operatorAuthorization": "Paraphrase: during this repair of VER-004 the operator directed that everything WO-235 adds concerning operator messages be removed, because its implementation failed. After this session's first reply described the removal as reaching all of DotLn, a second message limited it to what this work order newly adds; DotLn's existing operator-message machinery stays.",
  "decision": "Remove WO-235's operator-message work and amend the order to its remaining scope. Removed: the prompt hook's private reply-checklist reminder; the shared role sentence on direct questions, the private checklist, host notifications, earlier aims, the correction freeze and register; the prompt router that had replaced main's promptRoute to keep that reminder off host notifications, with its journal-path helper, host-agent-message and host-queued sources and the plan-failures host-source rule; the fixtures built for answer state, including the completion parity fixture and its base pin; and the product, security, architecture, kit and planning-map text that described them. main's router, journal sources, intervention count, completions, planning receipt and Stop return unchanged. Kept: contract-first writing guidance, the planning skeleton, exact-tree document rows, the hedge-scanner fix and the quality pass command. Quality pass guidance had been gated by the removed router; it now follows the rule every dispatch prefix follows, the prompt's own first content line, reads no journal or transcript history, and yields to an active operator control as all session context does. That closes the class VER-004 F1 names, prompt observations reused after their delivery, because no prompt guidance reads any history: a task notification or another agent's report opens with its envelope on that line and never receives the guidance, whatever came before it. VER-004's other quality pass expectation, that un-enveloped words queued with the command's bytes receive none, is withdrawn with the sender inference rather than met: words that open with the command are read as the command, queued or not, because under main's router a queue entry without a command mode has unknown authorship and the hook no longer infers a sender. Completion parity and the absence of a completion size advisory are judged from source: scripts/resume.mjs is base's except the evidence-briefing sentence. The removal lowers every role root by 1123 bytes, so the reviewer and planner ceilings this order raised for quality pass are retired; the executor, verifier and release-close raises stay because those roots still exceed their earlier ceilings. The order's decisions, evidence and filed reports stay as the record of what was built and withdrawn.",
  "evidence": [
    "git diff 3db7571f -- packages/skeleton/src/harness-host.ts: ten added lines, the qualityPassGuidance import, the quality pass: journal class and the first-content-line delivery with its comment; git diff 3db7571f -- scripts/lib/plan-failures.mjs, scripts/lib/plan-receipts.mjs and scripts/test-control-segments.mjs are empty; scripts/resume.mjs differs only by the evidence-briefing sentence. The criteria adversary and consistency reviewer confirmed each.",
    "VER-004 F1 and D062: the reversed history let an already-delivered operator observation account for a later host queue entry. The router that read that history is removed rather than repaired a third time.",
    "scripts/test-harness.mjs, quality pass guidance is read from each prompt's own first content line: after an operator's command delivered without a queue entry, idle and mid-turn task notices and an agent report carrying the command behind their envelopes receive no guidance; the command queued with the same bytes does, which pins the withdrawn VER-004 expectation; analysis: suppresses the guidance until analysis: off. node scripts/harness.mjs bounded -- node --test --test-name-pattern='quality pass guidance is read from each prompt' scripts/test-harness.mjs passed after the precedence case was added.",
    "node scripts/harness.mjs bounded -- node docs/evidence/WO-235/verification-004-route-probe.mjs exited 1 at 2026-10-30T03:55:55.534Z: no checklist exists to deliver, and main's router journals the later queue entry, which carries no command mode, as claude-prompt-hook, unattributed, transcript-enqueue, not host-task-notification. That is main's WO-219-D042 rule, whose reopening VER-003 observed on Claude Code 2.1.312.",
    "Installed root bytes (CLAUDE.md plus each role, UTF-8), measured from harnessInstallation(): executor 36098 -> 34975; verifier 32619 -> 31496; reviewer 35067 -> 33944; release-close 23780 -> 22657; planner 24689 -> 23566; refuter 23503 -> 22380, each -1123 for the removed sentence. Both harness roots match. wo235-removal-role-baseline.json chains to wo235-quality-pass-role-baseline.json, sha256 699f1dcfee672649e2424bb4995a325b7dc302039114be36b2ba24c43e3da7be, whose bytes are unchanged. scripts/test-gate-followups.mjs now checks this order's seven oracles as one ordered chain, and its bounded probe passed.",
    "docs/control/budgets.json before this decision: reviewer's earlier acceptance 34596 and planner's limit 24576 now hold 33944 and 23566, so D044's reviewer 39163 and planner 28785 raises are retired; executor 34975 still exceeds its earlier 34953, verifier 31496 its 29831 and release-close 22657 its 21266, so D044's executor raise and D005's verifier and release-close raises stay. D005's reasons name the direction-ledger rule withdrawn by D035; the remaining artifact-contract, expected-data and quality pass rules still need those ceilings.",
    "packages/compiler/src/operator-control.mjs returns the control's message while a mode is active, and the generated session hook then writes it without running runHarnessHook, so no harness context is added; product 07 and the security document now say so.",
    "Three fresh dotln-worker reviews, a criteria adversary, a design improver and a consistency reviewer, judged this repair; self-review.md records their counts and each disposition."
  ],
  "traps": {
    "fixesThatFail": "A third router repair would answer F1's quoted history while keeping attribution by history; removing every history read from prompt guidance closes the class.",
    "escalation": "Widening the removal to DotLn's existing operator-message machinery after a correction would turn a scoped removal into an unrequested redesign; the operator's clarification fixed the boundary at this order's additions.",
    "ruleBeating": "Calling VER-004's queued-words expectation closed would pass a green fixture while the behavior VER-004 expected is absent; the decision states that expectation is withdrawn and the fixture pins the new behavior.",
    "seekingTheWrongGoal": "Deleting the order's decisions and reports would shrink the text about operator messages without removing any behavior; the behavior, guidance, fixtures and standing text are what go.",
    "shiftingTheBurden": "The removal boundary is resolved from the diff against main, not by asking the operator to list files."
  },
  "rejected": [
    {
      "option": "Repair the router under VER-004's repair rule",
      "reason": "The operator directed removal; another revision would keep the mechanism that failed two verifications."
    },
    {
      "option": "Remove DotLn's existing operator-message machinery as well: the journal, check-in, operator controls and the earlier aim rule",
      "reason": "The operator's clarification limits the removal to this order's additions; those predate WO-235 and other orders' records and checks depend on them."
    },
    {
      "option": "Remove the quality pass command with the router",
      "reason": "It is the operator's own document command (D043), not operator-message handling; only its delivery depended on the router, and the first-line prefix rule needs none."
    },
    {
      "option": "Keep a narrower router for quality pass alone, so queued un-enveloped words receive no guidance",
      "reason": "It would retain the failed history-based attribution; an envelope already keeps host notices off the first content line, and on main the remaining queued text has unknown authorship."
    },
    {
      "option": "Keep the completion parity fixture without its answer state",
      "reason": "It was built for the removed answer-state design, ran base's resume.mjs against current libraries and a reachable base commit, and asserted the absence of an advisory base never had; the source diff establishes the same parity directly."
    },
    {
      "option": "Restore main's product 07 planning-pass sentence describing a direction ledger",
      "reason": "It promises checks this order was to build and no longer will; D035 already withdrew that design, so the standing text stays without it."
    },
    {
      "option": "Retitle the sequence entry that still promises no operator direction is dropped",
      "reason": "The sequence is planning-subject input bound by receipt 058 (D057); it stays with FUP-7d3d2e7566c8923e for the next planning pass."
    },
    {
      "option": "Delete the order's decisions, evidence and filed reports about the withdrawn feature",
      "reason": "Filed reports are immutable, their links must resolve, and the decisions are the record of what was built, verified and withdrawn; deleting them removes no behavior."
    },
    {
      "option": "NoOp",
      "reason": "The operator's explicit direction."
    }
  ],
  "reopens": {
    "decisionId": "WO-235-D055",
    "observation": "D055's router and its host sources are removed with the rest of this order's operator-message work. main's promptRoute and WO-219-D042's rule stand again, with the 2.1.312 reopening that VER-003 observed unrepaired here."
  },
  "followup": "Return to planning the operator-message follow-ups WO-235 no longer carries, and dispose them together: the WO-219-D042 reopening (FUP-0f2a756698374d7e), under which main's router journals a Claude Code 2.1.312 task notification without a command mode as unattributed and counts it as an operator intervention; D055's reopening (FUP-4a7c27e6c428ea55); D059's observed-facts follow-up (FUP-92f34e24a8f975b4), which assumed the removed router; D050's VER-003 reminder repair (FUP-c47eeb041f0952c4) and D022's direction-ledger handoff loop (FUP-8cc18bcfb0197284), whose subject is gone; WO-236-D020's prompt-answer action (FUP-d1b15b1b3e4dc761), deferred from WO-235; and the sequence title that still promises no operator direction is dropped (FUP-7d3d2e7566c8923e).",
  "reopenWhen": "A task notification or agent report receives quality pass guidance, the host delivers un-enveloped text through the prompt hook, a later order reintroduces operator-message handling under WO-235's scope, or a standing document of this order again describes the removed mechanism."
}
```

## WO-235-D064

```json
{
  "id": "WO-235-D064",
  "date": "2026-10-30",
  "dispatch": "resume: verify",
  "decision": "VER-005 judges D063's operator-amended scope and passes all eleven criteria, with no new blocking or follow-up defect. Consume the executor's standing complete review at the unchanged code identity and independently attack current-prompt delivery, restored base behavior, planning preparation, writing guidance, generated roots and exact-tree document coverage. Preserve earlier immutable reports and existing planning follow-ups; do not revive the removed router or reconstruct retired message records. Complete the exact-candidate document check after the final verification records before recording the result.",
  "evidence": [
    "verification-005-probe.mjs passed eight independent check groups at 2026-10-30T05:17:42.828Z. verification-005.json retains the selected observations. All mutated repositories were registered synthetic temporary fixtures and were removed.",
    "The independent gate lookup matches code identity 3ca0cfc162d216be36ba9544001b08e3c6d59d6bb2f7c01397e31f709cd2b362 and all 45 current review checks to the complete pass recorded 2026-10-30T05:00:11.640Z; no selected task is missing or displaced.",
    "Generated hooks withhold quality-pass guidance from later task and agent envelopes after direct command delivery, idle and mid-turn, and while analysis mode is active. Queued un-enveloped command words retain the amended first-line behavior. Normal and re-entered Stop admit malformed retired ledger data; the synthetic lifecycle log is unchanged.",
    "Actual planning start creates the declared nine-heading skeleton. A branch collision leaves main and a clean tree with no preparation file; a pre-existing document is refused and preserved. Writing guidance remains unchanged through fifteen example-length variations and retains valid guidance with malformed optional examples. Both generated economy settings and all twelve installed roles match their oracle; 37 historical hash links match.",
    "Independent synthetic decision, report, generated-index and new-record mutations each invalidate their old document row. The subject's current consumer refuses the repair's document row because dispatch and verification records changed its candidate. No identity projection is introduced.",
    "Bounded npm run format:check, npm run publication:check, git diff --check and the lexical-scanner regression for D060 all passed. The source comparisons show only the allowed ten harness-host additions and evidence-briefing sentence, unchanged plan-failures, receipt validator, gate identity and PR meter, and no external dependency change.",
    "Process correction: unfiltered status/diff batches exceeded tool output budgets repeatedly, and npm run meta also emitted an oversized process table. Verdict-relevant fields and affected source sections were reread with smaller selections; the meta command's successful exit and generated D064 index entry establish its required refresh, and its truncated process table supports no verdict claim. Subsequent gate output is retained in session scratch and read by selected result fields. The first dependency assertion also omitted console's internal skeleton pin and failed; the checked package-lock diff changes only that pin and the skeleton package version. The corrected evidence assertion verifies both against their respective versions and compares every other field unchanged. No implementation repair was made.",
    "The current criteria, design and consistency worker summaries and dispositions in self-review.md were read: 41 found, 30 fixed, 11 recorded. Verdict-relevant parity, history, control precedence, oracle, writing and document-coverage claims were independently reproduced. No worker was needed in verification. The sequence title and base-router attribution gap retain D063's existing planning routes."
  ],
  "traps": {
    "ruleBeating": "A green complete row does not establish changed history cases or semantic usefulness; independently probe the former and state the latter's limit.",
    "escalation": "D063 removed operator-message machinery. Reinstating its old acceptance obligations would widen this verification beyond the authorized subject.",
    "seekingTheWrongGoal": "The measured root reductions are resource observations, not evidence that the documents are useful. Judge the retained contract and reader guidance."
  },
  "rejected": [
    {
      "option": "NoOp: accept the executor's handoff without independent attacks",
      "reason": "It would leave the changed current-prompt boundary, cleanup and stale-record claims untested by this verifier."
    },
    {
      "option": "Repeat the complete product gate despite a standing row at the same identity",
      "reason": "The existing row covers every current selected check without displacement; independent probes and the final exact-tree document gate supply the evidence this phase still owes."
    },
    {
      "option": "Reopen withdrawn message-coverage criteria or repair the known base-router gap here",
      "reason": "The operator removed that subject. D063 preserves the gap and related work in named planning follow-ups; neither a new unmet criterion nor a new operator decision is justified."
    }
  ],
  "reopenWhen": "A current acceptance criterion fails, a regression from base is reproduced, a current prompt envelope receives document-editing guidance, a later public record inherits document evidence for different bytes, or the subject identity changes before acceptance."
}
```

## WO-235-D065

```json
{
  "id": "WO-235-D065",
  "date": "2026-10-30",
  "dispatch": "resume: final review",
  "decision": "FINAL-001 passes WO-235 on the amended scope D063 records: all eleven criteria met, one follow-up boarded. Nothing is integrated, because main, origin/main and HEAD read one commit, 3db7571f; the integration helper is not run for a worktree that read-only ancestry shows is not behind main, the invocation the operator objected to in WO-236-D014. The complete review row at the unchanged code identity 3ca0cfc162d216be36ba9544001b08e3c6d59d6bb2f7c01397e31f709cd2b362 is consumed rather than rerun; the exact-tree document row is taken after this review's last document edit. No worker is spawned: final review is acceptance, and the reviewer reproduces the durable VER-005 probe, the role oracle, base parity and the removal search itself. The release surfaces are written from their contracts and the reader profiles, with v0.103.0 current. F1, a stale evidence-source declaration, is boarded and not fixed here, because a source edit would move the code identity and owe a fresh complete run for a declaration that changes no behavior, and a reviewer never implements and certifies a change.",
  "evidence": [
    "git rev-parse main origin/main HEAD, git ls-remote origin refs/heads/main and git merge-base HEAD main all print 3db7571f1f0c19a935d4cbdff4c05cc3bfdee61f at this review. In phase final-review the helper would fetch, checkpoint, stash the 83 changed and every untracked path on the shared stack, merge nothing, regenerate ten projections and write a draft decision; product 07 describes the not-behind-main no-op, which the helper applies only in phase active.",
    "gateCodeIdentity of the working tree equals the executor's complete row host-gate:3ca0cfc162d216be36ba9544001b08e3c6d59d6bb2f7c01397e31f709cd2b362:npm test, recorded 2026-10-30T05:00:11.640Z, exit 0, 45 required suites, durationMs 1866842; the two document rows at that identity (05:10:42Z and 05:23:13Z) judged trees the dispatch has since changed and are not credited.",
    "node scripts/harness.mjs bounded -- node docs/evidence/WO-235/verification-005-probe.mjs: eight of eight groups passed, exit 0, finishedAt 2026-10-30T05:35:16.003Z, durationMs 29588.",
    "All twelve installed role hashes equal wo235-removal-role-baseline.json and the installed root bytes equal its startupCost profiles; diff -rq .claude/skills .agents/skills reports no difference.",
    "git diff 3db7571f --stat is empty for scripts/lib/plan-failures.mjs, scripts/lib/plan-receipts.mjs, packages/skeleton/src/gate-evidence.mjs and scripts/lib/github-body.mjs; the harness-host.ts diff adds 10 lines and removes none; the resume.mjs diff is one hunk. A search of packages/skeleton/src, both hook and role trees, CLAUDE.md, the manifest and every non-test script for the removed vocabulary finds nothing.",
    "npm run format:check, git diff --check, npm run publication:check, node scripts/harness.mjs check and npm run release -- check-surfaces --local passed in this review; no nested repository exists under the worktree.",
    "F1: git show refs/dotln/checkpoint/WO-235/4:scripts/lib/evidence-sources.mjs registers scripts/lib/direction-ledger.mjs and scripts/lib/off-ramps.mjs at lines 9 and 10, and that ledger imported sessionJournalKey from off-ramps.mjs; base registers neither; the working tree still registers off-ramps.mjs while no registered source imports it (its importers are resume.mjs, handoff-ledger.mjs, planning-followups.mjs and target-publish.mjs). No record of this order names the registration's cause."
  ],
  "traps": {
    "ruleBeating": "Running the integration helper, or rerunning the complete review, to satisfy a step's letter when read-only ancestry and the identity probe already establish its purpose; the evidence is recorded instead.",
    "tragedyOfTheCommons": "Spawning three workers against a subject five verifications attacked would spend the subagent budget on a judgment the reviewer owns; the reproductions are run here.",
    "shiftingTheBurden": "Putting the recorded bound acceptances and override records back to the operator; they are judged from the record.",
    "seekingTheWrongGoal": "Fixing F1 in review to make the subject tidier would move the code identity and certify the reviewer's own change; the follow-up route keeps acceptance honest."
  },
  "rejected": [
    {
      "option": "Run npm run worktree -- integrate WO-235 because the procedure lists it",
      "reason": "The bases are equal; the helper would stash and regenerate for nothing, which the operator objected to in WO-236-D014."
    },
    {
      "option": "Start a fresh complete review before passing",
      "reason": "The standing row covers every selected check at the unchanged identity; the rule reuses it, and the exact-tree document row still runs after the last edit."
    },
    {
      "option": "Remove the off-ramps registration here and re-mint the editions",
      "reason": "A reviewer never implements and certifies; the edit changes code identity and would owe a complete run for no behavioral change. Boarded as F1 instead."
    },
    {
      "option": "NoOp: pass on VER-005 and the standing rows without reading the subject",
      "reason": "The reviewer owns the acceptance judgment, the integration assessment and the release surfaces; the reading found F1."
    }
  ],
  "followup": "Remove scripts/lib/off-ramps.mjs from commonSources in scripts/lib/evidence-sources.mjs, since no registered evidence source imports it after the direction ledger's removal, and re-mint the affected evidence editions under a dated decision that names the cause; run npm run evidence:artifact --check and the evidence-sources suite to confirm no registered import becomes unregistered.",
  "reopenWhen": "A current acceptance criterion is found unmet, a regression from base is reproduced, main moves before the pull request merges so that an integration is owed, or the pull request's checks fail on the reviewed commits."
}
```
