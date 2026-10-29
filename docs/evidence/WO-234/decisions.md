# WO-234 decisions

## WO-234-D001 — Seed dispatch bounds from the activation record

```json
{
  "id": "WO-234-D001",
  "date": "2026-10-28",
  "dispatch": "resume: next",
  "decision": "Use four times the activation median per phase, three complete runs for executor, repair, verifier and reviewer, and null bounds for the other dispatch kinds. Executor repair overrides live under dispatches.executor.repair and are selected by resume: fix; they do not add a role. Older exports read absent keys as null without rewriting their instance-owned budgets.",
  "evidence": ["completedPhaseAttempts over readControl at activation: implementation n=177 median 4929842 ms; verification n=358 median 1044635 ms; finalReview n=201 median 1545384 ms; repair n=182 median 2801072.5 ms", "scripts/lib/plan-failures.mjs uses the same completed-attempt population and median calculation", "WO-192 meta.json executor: 2 dispatches, 327404836 tokens, 80817117 ms; D023, D076 and D084 name the requested intervention and operator stops"],
  "chosen": "wallClockMs 19719368 / 4178540 / 6181536 / 11204290 for implementation / verification / final review / repair",
  "rejected": ["The filing medians omit closes since filing.", "A new repair role would misstate the executor's role.", "NoOp retains the unbounded dispatch.", "Token and dollar bounds contradict the order's non-goals and unavailable-host policy."],
  "traps": ["Rule beating: preserve exceeded standing across same-phase redispatch instead of resetting the clock.", "Escalation: admit lifecycle reads and focused reproductions after a stop.", "Wrong goal: meter interventions without introducing another lifecycle driver."],
  "reopenWhen": "A dispatch stops within its median, two consecutive closes accept the same metric, or the operator changes a bound."
}
```

## WO-234-D002 — Use hours and minutes for operator-facing durations

```json
{
  "id": "WO-234-D002",
  "date": "2026-10-28",
  "dispatch": "resume: next; explicit operator correction",
  "decision": "Present every duration supplied to the operator in hours and minutes, rounded to the nearest minute. Keep exact numeric units in machine records and numeric flags. Apply one formatter to dispatch messages, lifecycle timing projections, gate progress and timeouts, lane waits and meter prose, and carry the rule in every generated role root.",
  "operatorAuthorization": "The operator explicitly directed hours and minutes for any duration provided to them after the executor posted raw median durations.",
  "evidence": ["The executor's activation update supplied the median durations as raw milliseconds; the operator corrected that presentation during this dispatch", "scripts/lib/duration.mjs reexports packages/skeleton/src/duration.mjs for source and compiled consumers"],
  "rejected": ["Repeating raw millisecond values does not satisfy the requested presentation.", "Changing stored measurement units would break existing numeric record contracts without improving the displayed duration."],
  "reopenWhen": "The operator changes the presentation preference or a consumer needs a declared finer display precision."
}
```

Correction, 2026-10-28: the activation update used raw numeric duration units;
the operator meant readable hours and minutes. The shared formatter and role
rule above correct the output behavior. An initial build probe also found an
import inserted before the executable shebang; the imports were moved after
the shebang, and the bounded runtime build then passed. An earlier source
search used an unquoted zsh glob that matched no path; the subsequent reads
used verified paths and quoted patterns.

## WO-234-D003 — Keep admission and reporting tied to validated observations

```json
{
  "id": "WO-234-D003",
  "date": "2026-10-28",
  "dispatch": "resume: next",
  "decision": "Read acceptances through the canonical control store and fold. Retain a known refusal if stop logging fails, and keep the other hook judgments active if standing is unreadable. Persist selection/start/dispatch identity on refused and interrupted gate rows. Reporting attributes each stop to its order and role, selects the next same-order event in time order, and retains that history during usage recovery. Normalize npm test options through one shared classifier.",
  "evidence": ["The independent design review identified an unvalidated control-file reader and a hook exception path that skipped existing judgments", "The independent criteria review identified interrupted-run omission, conditional acceptance validation, mixed-role attribution, npm option detection and retained-history gaps", "The design reviewer transferred the cross-order afterStop defect for correction"],
  "rejected": ["A second loose control parser could accept ceilings the lifecycle rejects.", "Logging availability must not erase an established refusal.", "A stopped complete run still spent the dispatch's run budget.", "NoOp would preserve the concrete counterexamples raised by review."],
  "reopenWhen": "Executable evidence exposes another admitted command spelling, observation source or recovery route that loses the recorded standing."
}
```

## WO-234-D004

```json
{
  "id": "WO-234-D004",
  "date": "2026-10-28",
  "dispatch": "resume: next; release prepare",
  "decision": "Assign application target v0.101.0, the next minor above the observed release baseline v0.100.0, to the heading and the README version claim.",
  "evidence": [
    "release baseline v0.100.0 (ancestral local release tags, excluding annotated starter refresh tags)",
    "minor classification declared in docs/work-orders/WO-234-a-dispatch-cannot-run-away.md"
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

## WO-234-D005 — Version the new refusal and preserve the role-oracle chain

```json
{
  "id": "WO-234-D005",
  "date": "2026-10-28",
  "dispatch": "resume: next",
  "decision": "Prepare the assigned minor application release v0.101.0. Bump compiler to 0.32.0 for the generated sixth-refusal contract and skeleton to 0.71.0 with harness host 0.38.0 for dispatch admission, shared guidance and duration presentation. Update exact workspace pins and lock metadata, preserving private packages and publication refusals. Mint WO-234's role oracle with WO-233 as its byte-exact historical parent and the existing upstream chain; record each installed role's before/after bytes.",
  "evidence": ["release prepare --local assigned the next minor above local v0.100.0 and recorded D004", "packages/compiler/src/harness.ts changes generated instructions; packages/skeleton/src/harness-host.ts adds an observed refusal and Stop standing", "The new duration preference is the operator's explicit correction in D002"],
  "rejected": ["Leaving changed component versions at the released values would conceal changed behavior.", "A major bump is unnecessary for additive local budget keys; missing keys retain old export compatibility.", "Rewriting the previous role oracle would erase the reviewed historical subject."],
  "reopenWhen": "An upstream release consumes an assigned version before integration, or a compatibility test identifies a breaking contract change."
}
```

Cold-start bytes (CLAUDE.md plus installed role skill; UTF-8, measured before
and after emission; both roots are recorded separately in [cold-start.json](cold-start.json)):

| Root | Role | Before bytes | After bytes |
| --- | --- | ---: | ---: |
| .claude/skills | executor | 30857 | 31546 |
| .claude/skills | verifier | 27385 | 28074 |
| .claude/skills | reviewer | 29811 | 30500 |
| .claude/skills | release-close | 18574 | 19263 |
| .claude/skills | planner | 19483 | 20172 |
| .claude/skills | refuter | 18297 | 18986 |
| .agents/skills | executor | 30857 | 31546 |
| .agents/skills | verifier | 27385 | 28074 |
| .agents/skills | reviewer | 29811 | 30500 |
| .agents/skills | release-close | 18574 | 19263 |
| .agents/skills | planner | 19483 | 20172 |
| .agents/skills | refuter | 18297 | 18986 |

The reviewer root's added rules measure 30,500 bytes. Under product 07's
standing cold-start route, the budgets file records an acceptance at 34,596
bytes (measured bytes plus one 4,096-byte step). The executor remains within
its existing 34,953 acceptance, and the other bounded roots remain within
ceiling. Raw ceilings and earlier oracle records stay unchanged; this is the
new rules' measured cost, not a disposition of WO-233's deferred residue.

D003 implementation refinement: a separate `boundDispatch` journal anchor
records the observed role, intent, order, phase boundary and start. A new phase
attempt renews that anchor; repeated entry to the same unfinished attempt keeps
it. Original session timing, reads and authorship remain intact. Effective
acceptances are read only after the matching phase's latest completion; a
`needs-fix` acceptance extends the upcoming repair, while completed attempts'
acceptances remain historical meter/control data.

The anchor also retains the orders this session executed. Off-ramp authority
reads the current anchor and that execution history: changing roles does not
grant an executor authority to accept or waive its own work. The independent
criteria reviewer confirmed this follows the existing own-executor exclusion.
The real CLI fixtures cover current-executor and prior-executor refusals, both
`next` and `fix`, and an invalid capture digest.

The three fresh worker reviews and their source rechecks report criteria
14 found/14 fixed, design 3/3 and consistency 19/19: 36 findings fixed, none
recorded or deferred. Their source-only limits and the one transferred finding
are recorded in [criteria-review.md](criteria-review.md),
[design-review.md](design-review.md) and [consistency-review.md](consistency-review.md). Bounded build probes also
caught missing JavaScript parameter annotations and use of a newer array helper
outside the declared TypeScript library target; parameter types and a backward
scan corrected them, preserving the existing compiler target. The runtime build
then passed. No scratch repository was present at the checked census, and
`git rev-list --count HEAD..main` returned zero before complete validation.

The first complete review run stopped in declaration preflight, before any
application suite: `harness-fixtures` lacked the `scripts/lib/off-ramps.mjs`
dependency introduced by the real prompt/authority regression. The named
machinery-source declaration was added. Evidence:
`host-gate:572af62d25dc5fb6db9d646fe5cb67a62c98a6b812d120ecfa4ff49f46e8d34e:npm test`,
recorded 2026-10-28T05:09:10.379Z. The next complete review uses the existing
`--keep-going` mode to collect all suite outcomes within the remaining complete
run budget; this changes neither task deadlines nor the bound.


## WO-234-D006 — Repair complete-review failures without changing the bounds

```json
{
  "id": "WO-234-D006",
  "date": "2026-10-28",
  "dispatch": "resume: next; named complete-review failures",
  "decision": "Repair missing build-free fixture leaves and stale presentation assertions. Preserve the original Subagents prefix by appending standing, and remove the unrequested startup bound count while retaining the required full plan-failures block. Judge dispatch admission in the runner parent, whose session identity is observable, rather than forwarding harness identity to isolated suite children. Keep capture provenance tied to original session birth when the phase anchor renews. Convert deadline errors under the operator's D002 correction and run the required new live feedback self-host and edition.",
  "evidence": [
    "Complete review host-gate:1335bd647b6a1d527eee0db636f9dd1bdebddea5fd6b6761a939e7aecb0764dc:npm test recorded 2026-10-28T05:46:49.573Z: 103 tasks passed, eight failed.",
    "The named failures were release concurrent, beacon portability, compiler, harness fixtures, process debt, plan refutation, runner fixtures and skeleton.",
    "suiteEnvironment deliberately strips invoking harness identity; the actual runner admission regression exposed child-side observation as ineffective.",
    "The plan-start assertion exposed the added count exceeding its existing 1 KB contract; that startup addition was not an acceptance requirement.",
    "gate-deadlines.mjs is a judged feedback source; product 07 requires a live self-host for the duration-error change."
  ],
  "rejected": [
    "Increasing the complete-run cap or recording an executor acceptance would bypass the operator-owned stop.",
    "Forwarding session variables into fixture suites would weaken their isolation.",
    "Raising the startup byte ceiling would weaken its established contract.",
    "Retaining a raw duration in a human error would leave the operator's explicit correction incomplete."
  ],
  "reopenWhen": "Focused reproduction or the remaining complete run exposes another concrete failure."
}
```

## WO-234-D007 — File the duration-source live feedback audit

```json
{
  "id": "WO-234-D007",
  "date": "2026-10-28",
  "dispatch": "resume: next; D002 operator-authorized duration correction",
  "decision": "Select immutable feedback revision 002 after the native Codex self-host verifies the final deadline-message source and its registered formatter. Keep revision 001 and all earlier evidence intact. The audit completed in 0 h 1 min; exact timing remains in ignored machine receipts.",
  "evidence": [
    "PlanExecutionAmended binds the operator's D002 presentation correction and required audit to the order at 2026-10-28T06:05:13.631Z.",
    "One native codex-cli-exec verifier was launched at gpt-6.1-sol/max with no planned descendants; the verifier stream records one WorkerAttemptStarted. This makes four planned workers including the three fresh source reviewers, below subagentCap 20. Effective worker model/effort and otherwise unobserved descendants are unknown.",
    "The bounded feedback-audit command exited 0 at 2026-10-28T06:07:20.749Z: phase complete, ten fixtures, 1192 saved instruction bytes.",
    "feedback-evidence --write and --record-selfhost filed feedback-002; --check reported that its live audit judged the current source and verified ten passing regressions and ten removal failures.",
    "Focused reproduction passed all 26 dispatch, duration, deadline, lane and portability tests; the actual runner-admission regression passed; all 12 compiler harness and control-beacon CLI tests passed. The declaration probe additionally exposed the control-beacon fixture's compiler attribution leaf, now added to the manifest consumed by its actual copy loop."
  ],
  "rejected": [
    "Carrying the old feedback audit after changing judged deadline behavior would claim a verdict for another subject.",
    "Replacing revision 001 would erase its historical record.",
    "A source-only review of skeleton leaves does not establish the fixture's complete cross-package import closure; the executable declaration check judges that closure."
  ],
  "reopenWhen": "Another change alters the judged feedback sources or regenerated feedback report before handoff."
}
```

Validation correction: the direct harness test invocation passed the original
failed cases but also exposed three pruning-fixture failures involving host
session roots. `suiteEnvironment` strips invoking session metadata for official
gate children. With no source change, `npm test -- --only harness-fixtures`
passed at 2026-10-28T06:25:14.381Z, evidence
`host-gate:999af0160adaaae5af5e9936c59c74e9c17a817187688e8080a9607348ece06a:harness-fixtures`.
This supports an invocation-environment cause for that direct-run difference;
no protection assertion was removed or relaxed.

Probe sequencing correction: the executor started that direct reproduction
before confirming the sync command's completion. A process-list read then
showed only the reproduction, and the retained sync result subsequently
confirmed exit 0. This establishes the confirmation error, not an observed
concurrent-write failure. Each later probe waits for the preceding exit.

The official focused process-debt and plan-refutation gates also passed at the
same code identity, recorded 2026-10-28T06:28:55.492Z and
2026-10-28T06:30:48.438Z. Their evidence references use the same identity above
with `process-debt` and `plan-refutation` suffixes. The standalone concurrent
release case passed under `suiteEnvironment`, the paired host controls were
refreshed against HEAD, and the current planning check passed with the D002
execution amendment recognized. Every original failing trigger now has a
passing focused reproduction; the next complete review still judges the whole
candidate. These probes did not increase or bypass the complete-run ceiling.

## WO-234-D008 — Preserve the bound and repair the final presentation failures

```json
{
  "id": "WO-234-D008",
  "date": "2026-10-28",
  "dispatch": "resume: next; failed complete review and focused diagnosis",
  "decision": "Keep the configured three-run ceiling. Repair the lane-wait assertion to honor minute rounding while retaining exact positive wait evidence and checkout-path privacy assertions. Give the dispatch-extension fixtures unused order IDs, and compare rounded usage text separately from its exact numeric aggregates. Preserve the existing own-executor and writer-reservation exclusion, and explain the canonical operator takeover before recording an extension. Stop before another complete review until the operator records an extension; return the material changes to the existing reviewers only after that bound permits it.",
  "evidence": [
    "Complete review host-gate:999af0160adaaae5af5e9936c59c74e9c17a817187688e8080a9607348ece06a:npm test ended 2026-10-28T07:17:34.794Z with only runner-fixtures failing; code identity and build outputs were unchanged.",
    "The failed lane assertion expected a printed wait for a positive raw interval that rounds to 0 h 0 min. The numeric union, relation and persisted-row checks remain intact.",
    "Focused resume diagnosis exposed the reused WO-106 fixture ID. The extension fixtures now use WO-108 and WO-109, preserving the existing cases.",
    "An actual separate-process CLI fixture confirmed that a live executor reservation preserves the exclusion even with no invoking session variables. The canonical forced operator release then permitted the captured extension without changing phase. The error and product 07 now state that recovery sequence; no authority guard was relaxed.",
    "The resume text parser still expected numeric JSON in its elapsed field. Exact machine totals and actor groups remain checked; the human grouping comparison now checks rounded duration labels.",
    "Focused resume passed at 2026-10-28T07:50:29.141Z and runner-fixtures passed at 2026-10-28T07:53:12.603Z, both at code identity e252787b9f96ea20feef6a4b24a563228d32d2c625385ee68cb8816192ae41c1. Their evidence references use that identity with resume and runner-fixtures suffixes."
  ],
  "rejected": [
    "Increasing the global ceiling or recording an executor-authored acceptance would bypass the operator-owned stop.",
    "Discarding exact wait evidence would weaken the lane-union regression.",
    "Replacing the writer exclusion with an inferred human identity would relax an existing authority guard.",
    "Passing focused rows do not substitute for a passing complete review."
  ],
  "reopenWhen": "The operator records a higher ceiling and resumes this execution, or another focused reproduction exposes a concrete failure."
}
```

The prior independent source-review count remains 36 findings fixed at its
recorded cutoff. The post-complete changes above still need the existing
reviewers' recheck, a passing complete review and the final handoff/document
sequence. No fourth complete review, additional worker admission,
ImplementationReady event or completion handoff has been recorded. The local
operator action adopts explicit capture wording only when the operator runs
it outside a governed session; it does not manufacture an approval here.

## WO-234-D009 — Record contextual continuation inside the running session

```json
{
  "id": "WO-234-D009",
  "date": "2026-10-28",
  "dispatch": "resume: next; explicit operator workflow correction",
  "operatorAuthorization": "The operator directed immediate repair of the failed manual recovery workflow, rejected leaving the session to run scripts, required continuation intent to be inferred from ordinary language and context, requested max(4 times the median, 8 hours), rejected sharing source-repository measurements with every consumer, and requested early authorization for a run to continue as long as needed.",
  "decision": "The current agent records digest-checked contextual operator authorization with its actual actor identity and existing writer. No fixed phrase, separate terminal, manual script or session exit is required. The same route admits finite extensions and early unlimited authorization for both dispatch metrics, stored as null acceptance ceilings scoped to the current phase attempt. Export local-median policy, deriving max(4 times the consumer's own completed phase median, 8 hours) with an 8-hour fallback and the original dispatch start as history cutoff. Preserve explicit numeric/null budgets, recorded consumption, phase expiry and independent criterion-waiver authority.",
  "evidence": [
    "npm run resume -- next refused this request with DOTLN_DISPATCH_BOUND: the prior dispatch had exceeded both wall clock and three complete runs; no gate was active.",
    "scripts/resume.mjs explicitly refused the executor recording accept-overrun and instructed an operator terminal, writer release and session re-entry; product 07 repeated the session-exit procedure.",
    "Both docs/control/budgets.json and scripts/kit/budgets.template.json contained the same four fixed timing measurements from this source repository. They did not compute consumer-local medians.",
    "The user corrected the procedure during this conversation; the exact words and context are retained only in ignored intake.",
    "The canonical writer recovery retired the prior reservation and reserved this session as the sole writer, preserving source, intake, checkpoints and recorded evidence; no lifecycle pass or dispatch was invented."
  ],
  "traps": [
    "A parser allowlist would reproduce the rejected exact-phrase requirement; the agent interprets operator meaning in context and records that authority.",
    "A capture does not turn the agent into a human or waive a criterion; keep the actual actor and the existing waiver exclusion.",
    "Replacing exported measurements with another fixed historical median still couples consumers; derive from each consumer's own canonical phase record.",
    "An as-needed authorization must not reset counters or leak into another phase."
  ],
  "rejected": [
    "NoOp retains the observed manual-recovery failure and contradicts the operator's correction.",
    "Requiring another session or a writer release for ordinary continuation contradicts the authorized workflow.",
    "Disabling all consumers' bounds globally would discard the requested local median policy and per-run authority.",
    "Treating an early as-needed authorization as a large guessed finite number would not implement its meaning."
  ],
  "reopenWhen": "An executed consumer or recovery scenario fails to preserve contextual operator authority, consumer-local timing, the sole writer, counters or phase expiry."
}
```

Correction, 2026-10-28: D008's terminal-and-takeover procedure and D001's
exported numeric timing seeds were the wrong workflow. The inspected route,
product guide and kit template establish the errors. D009 replaces them with
in-session recording and consumer-local timing under the operator's explicit
correction. Earlier decisions, failed runs and review reports remain historical;
they do not claim to judge this new source. No completion is recorded here.

D009 implementation refinement: the new shared native dispatch-journal reader
keeps synchronous harness and build-free lifecycle reads aligned and names a
damaged journal in its error. A new thread inherits the earliest matching
unfinished phase anchor, including a legacy journal within the current request
boundary, while retaining its own usage lifetime and actor identity. The actual
Codex-dispatch regression preserves three consumed runs under an extension to
four, admits one more, refuses the next, and renews only on reactivation. The
current session was rebound through this tested binder after its initial entry
revealed the reset; its original three complete runs remain consumed.

The operator's contextual direction was captured and recorded with this agent's
actual Codex attestation, not a human identity. The two finite acceptances allow
room for the requested repair and complete validation with one retry. The new
as-needed feature was requested as a capability; it was tested in fixtures and
was not silently applied to this live run. Default complete-run limits remain
three; the current activation's recorded extension is five. Installed guidance
adds 729 bytes per role relative to the preserved WO-234 oracle, measured in the
new linked recovery oracle; every bounded root remains inside its existing
ceiling or recorded acceptance.

Validation corrections during this change: the first focused resume invocation
stopped at formatting before running its suite. A direct invocation of the full
control-segment test file omitted its required fixture-root argument; its new
fold case passed, while the fixture-dependent cases had no root. The proper
resume suite owns that setup and is the required evidence. An initial build of
the shared reader exposed optional-time and event-time type errors; explicit
optional handling and the recordedAt event field fixed them, and the bounded
build passed. These observations are not passing evidence for the whole order.

D009 portability refinement: the installed harness still physically stores its
journals under the existing ignored `docs/control/local/harness` lane. The new
shared directory function aligns standing and recording-session reads with that
actual lane; the binder reads request boundaries through the equipped configured
roots. The meter also retains configured historical journal copies and uses its
existing common-prefix deduplication, so no copied observation is counted twice.
The configured-root binder/standing and meter regressions both passed. This is
not the full harness loader migration: that remains the existing
FUP-a058e82c0bbd9b6d, reopening under WO-069-D005/WO-070-D009 when that migration
is taken up. No new deferral is created here.

The fresh review pass found criteria 2, design 2 and consistency 6, including
cross-thread consumption, configured-root observation alignment, one shared
ceiling fold, named corrupt journals, five metadata/fixture corrections and the
meter's physical lane. All ten source findings were fixed and returned to their
responsible reviewer; the earlier 36 findings remain historical counts for the
prior subject. Paired host controls were rerun on the final contextual route:
the baseline admits both exhausted metrics, current refuses complete starts,
and both admit focused reproductions. Controls retain their exact source and
observation cutoff; they are admission evidence, not a live host-memory claim.

## WO-234-D010

<!-- integration refs/dotln/checkpoint/WO-234/4 -->

```json
{
  "id": "WO-234-D010",
  "date": "2026-10-28",
  "dispatch": "resume: next; worktree integrate WO-234",
  "decision": "Integrate the operator-requested local main at 22ce7799 into the active execution, preserving the original base and recovery refs. Resolve additive budget acceptances by retaining both, preserve both role histories in a new combined oracle, and regenerate projections. The executor owns the integrated validation; independent verification and final review retain their separate dispatches.",
  "evidence": [
    "refs/dotln/checkpoint/WO-234/4",
    "base 2b872abc11157f04718d60c3bdf8b9836e4e0f24",
    "upstream 22ce7799cce61db93f5852069dacf2409373adbd",
    "release preparation: Retimed WO-234: v0.101.0 → v0.102.0 above the observed release baseline v0.101.0. Files changed: docs/work-orders/WO-234-a-dispatch-cannot-run-away.md, README.md, docs/evidence/WO-234/meta.json. Meter snapshot: docs/evidence/WO-234/meta.json, 4747 bytes. Tag observation: local snapshot only."
  ],
  "rejected": [
    {
      "option": "Rewrite reviewed commits or drop a stash before application completes",
      "reason": "Both histories and unfinished recovery material must remain available."
    }
  ],
  "reopenWhen": "An authored resolution changes behavior, contracts, authority or acceptance; return that finding through repair and fresh independent verification."
}
```

Integration date: 2026-10-28. Original base: `2b872abc11157f04718d60c3bdf8b9836e4e0f24`.
Integrated local main: `22ce7799cce61db93f5852069dacf2409373adbd`. Checkpoint: `refs/dotln/checkpoint/WO-234/4`.
Named stash dropped after completed application: `44c17d292954536196cfad08c9d6466720d35e24` (WO-234 integrate 2026-10-28).
Resolved projections: docs/publication/software-engineer-toc.md, docs/work-orders/HISTORY.md, docs/work-orders/README.md, packages/console/fixtures/expected/selfhost.html, packages/console/fixtures/expected/selfhost.json, packages/console/fixtures/expected/selfhost.txt.
Release preparation: Retimed WO-234: v0.101.0 → v0.102.0 above the observed release baseline v0.101.0. Files changed: docs/work-orders/WO-234-a-dispatch-cannot-run-away.md, README.md, docs/evidence/WO-234/meta.json. Meter snapshot: docs/evidence/WO-234/meta.json, 4747 bytes. Tag observation: local snapshot only.
Carried-forward claims: no independent verification has judged WO-234 yet. Preserve its implementation obligations and original controls; refresh source-sensitive editions and execute the complete review on the integrated candidate before implementation-ready.
Authored conflicts resolved: docs/control/budgets.json, docs/evidence/current.json, packages/console/fixtures/manifest.json, scripts/test-gate-followups.mjs, scripts/test-process-debt.mjs and scripts/test-runner.mjs. Generated conflicts were regenerated by the canonical helper.
Affected checks are printed by the command; results remain untested until executed.


## WO-234-D011 — Preserve both integrated histories and retime collided components

```json
{
  "id": "WO-234-D011",
  "date": "2026-10-28",
  "dispatch": "resume: next; operator: integrate latest main",
  "decision": "Retain main's executor target-worktree grant with WO-234's dispatch bounds and contextual continuation. Mint a new linked integration oracle, with WO-236 as its historical parent and the byte-exact WO-234 recovery chain as its branch parent. Preserve both recorded reviewer cold-start acceptances. Retime compiler 0.32.0 to 0.33.0 and skeleton 0.71.0 to 0.72.0 because upstream published the staged component versions; retain the original additive minor compatibility impact, harness host 0.38.0, exact pins, private packages and publication controls. The canonical helper retimed the application to v0.102.0.",
  "evidence": [
    "User instruction: integrate latest main; local main and origin/main both 22ce7799cce61db93f5852069dacf2409373adbd at entry; original HEAD 2b872abc11157f04718d60c3bdf8b9836e4e0f24.",
    "Main's current integration entry refused the new DispatchBoundAccepted event before mutation. git diff HEAD..main -- scripts/lib/worktree-integration.mjs showed identical integration modules, so the matching-worktree canonical entry used the compatible control reader.",
    "The canonical helper preserved refs/dotln/checkpoint/WO-234/4 and the digest-checked external intake backup. Its first stash-application continuation met conflict markers in budgets JSON; explicit additive resolution enabled --continue. The helper reported complete regeneration and dropped only its named applied stash.",
    "Upstream packages already declare compiler 0.32.0 and skeleton 0.71.0; upstream harness host is 0.37.0. Current behavior adds new compiler instructions and skeleton admission, so collided package labels must move while the valid host bump remains.",
    "The combined harness and contributor sources require their registered deterministic evidence updates. Feedback editions002 and003 have identical declared behavior identities; only release pins changed, so a deterministic carry would have sufficed. This run paid for extra live audits before checking that projection; the correction below records the error."
  ],
  "traps": [
    "A generated-file conflict is not a verdict on acceptance; regenerate from the combined authored sources.",
    "Selecting one branch oracle would drop the other reviewed history; retain and check both hash chains.",
    "A component-label collision does not change compatibility impact; retime without widening scope."
  ],
  "rejected": [
    "NoOp leaves the worktree behind the explicitly requested main.",
    "Editing main to teach it an unmerged event would create another writer and unnecessary cross-worktree changes.",
    "Rewriting either historical oracle or an immutable evidence edition would erase its judged subject."
  ],
  "reopenWhen": "A concrete integrated check or independent review finds changed acceptance behavior or a stale source declaration."
}
```


## WO-234-D012 — Resolve the fresh integrated reviews before complete validation

```json
{
  "id": "WO-234-D012",
  "date": "2026-10-28",
  "dispatch": "resume: next; integrated independent reviews",
  "decision": "Resolve the three criteria findings, two design findings and one consistency finding before the complete run. Reuse the existing executable command normalizer for bound-start admission; label unlimited acceptance as needed; preserve stop phase attribution; isolate damaged historical snapshots with an unreadable count; name the earliest unfinished phase anchor accurately; and distinguish accepted startup growth from deferred work in the fixture. Preserve all historical reviews and source editions.",
  "evidence": [
    "Fresh independent criteria, design and consistency workers reviewed the integrated diff and untracked implementation without writes or execution. Their respective source rechecks confirmed 3/3, 2/2 and 1/1 findings fixed. Reports: integration-criteria-review.md, integration-design-review.md and integration-consistency-review.md.",
    "Regressions cover both unlimited projections, implementation/repair stop phases, malformed historical snapshots alongside a retained valid stop, environment assignment/env wrapper and nested-shell starts, and their focused diagnostic controls. Runtime results remain untested until the complete gate.",
    "The first native feedback command lacked its required opt-in environment and launched no worker. The opted-in invocation then stopped before WorkerAttemptStarted because the supplied /var temporary path resolved through /private/var; the physical-path retry completed ten fixtures. The executor then incorrectly inferred that hook-source fixes required another live episode; FEEDBACK_SOURCE_PATHS excludes those hook modules, so that inference was wrong."
  ],
  "rejected": [
    "NoOp retains concrete review findings.",
    "A second shell parser would diverge from the already-reviewed wrapper and nested-shell normalization.",
    "Requiring an invented follow-up for accepted growth misstates the recorded disposition."
  ],
  "reopenWhen": "The complete review, final source recheck or document gate reveals a concrete defect."
}
```

The current planned fan-out is three read-only reviewers and two native feedback verifier admissions, with no reviewer descendants, below subagentCap 20. The first completed integration audit is retained in session scratch; a second audit was filed in feedback003. Both were unnecessary for the pins-only feedback change, and neither is counted as new behavior coverage. Effective worker readback and unobserved descendants remain unknown.

Validation observation: one source search used an unquoted nonexistent directory glob and zsh refused it; the corrected search named packages/skeleton/src and quoted file patterns. No file effect occurred.


The final integrated source was audited by one native codex-cli-exec verifier at selected gpt-6.1-sol/max. The physical-path final audit completed in 0 h 1 min with ten fixtures and 1,192 saved instruction bytes; feedback revision 003 records its by-reference verifier stream and pins. Authority revision 007 and artifact-identity/verification revision 002 were deterministically re-minted after their checks named stale output from the combined sources. Every older edition remains intact. The final controls.json records the paired admission comparison against integrated main 22ce7799. A full repository census excluding node_modules and preserved intake found no nested repository outside intake.


## WO-234-D013 — Record the attended-session reading from the integrated catalog

```json
{
  "id": "WO-234-D013",
  "date": "2026-10-28",
  "dispatch": "resume: next; integrate latest main",
  "decision": "Keep elapsed wall clock anchored at the earliest unfinished dispatch. It includes operator-attended work and idle time; operator messages do not renew the clock. Consumer-local max(4 times median, 8 hours) provides the requested floor. A contextual finite acceptance can be recorded before a stop, and explicit early as-needed authorization records both metrics as unlimited for this phase. Do not infer attendance from tool-active intervals or introduce another clock. Focused diagnosis remains admitted after a bound. Preserve the recorded startup-growth acceptances rather than trim the reviewed rules. Refine the catalog's stronger unreadable-record proposal: absence yields unset, while a malformed present consumption record remains a named unavailable diagnostic. Preserve the record and original anchor; do not invent either zero consumption or an exceeded verdict.",
  "evidence": [
    "New input: docs/planning/work-order-map.md WO-234 catalog row, receipt056 known issues and receipt057 attended-session field case; docs/planning/target-write-grant-and-fork-block-2026-10-28.md item4a and FUP-632348a91b2ae9d8.",
    "The recorded attended comparison spans 6 h 32 min, inside the 8 h 0 min no-history floor. This one case does not prove every attended or idle session will fit.",
    "dispatchStanding computes now minus journal.startedAt; phaseDispatchAnchor preserves the earliest unfinished start; the anchor regression preserves observations and consumption across re-entry.",
    "The contextual acceptance regressions cover pre-stop unlimited authority, phase expiry, cross-thread consumed runs and an ordinary finite extension.",
    "wo234-integration-role-baseline.json measures the combined roots against configured or expressly accepted ceilings; all bounded roots fit.",
    "The source-only criteria reviewer judged this planning-input disagreement as an explicit decision duty, not an unmet filed criterion: criterion2 names the missing-journal case; the damaged-journal regression and D009 preserve malformed records as named errors. scripts/test-runner.mjs names Dispatch standing unavailable; the wrapper/lifecycle error and Claude advisory preserve the distinction from exceeded."
  ],
  "rejected": [
    "NoOp leaves the newly imported field-case duty unanswered.",
    "A tool-active or attendance clock is unobserved, would change the declared wall-clock policy, and could erase the source comparison instead of recording its limitation.",
    "Resetting at an operator message would replenish a live bound.",
    "Failing open on an unreadable consumed-history record could admit a fresh anchor and replenish budget without evidence. The catalog proposal is not claimed as implemented."
  ],
  "reopenWhen": "The first attended-session stop occurs, an observed stop followed by acceptance had tool-active time below its ceiling, or most initial stops end in acceptance; planning then judges the recorded outcomes under the catalog conditions."
}
```

Planning-check correction: importing receipt057 made the existing D009 execution amendment, previously bound to receipt056, insufficient for the new horizon. The first check named a changed Cost declaration without its text-bound disposition. The canonical amend-order command rebound the same approved order bytes and unchanged D009 decision to receipt057; it granted no new scope or hold disposition.


Feedback-duty correction, 2026-10-28: I incorrectly claimed that the combined
harness and contributor changes, then the hook normalization fix, demanded a new
live feedback episode. The checked FEEDBACK_SOURCE_PATHS excludes those modules.
Feedback002 and feedback003 both record behavior identity
`sha256:d3764463d12009c2598c2cea136abdac50432fb53e149941c571a3ca6472939c`;
only their pins differ. The declared pins-only route was a deterministic carry
and console re-pin. Feedback003 is valid current evidence, but this execution
paid for two unnecessary live audits instead of taking that route. No further
live audit is owed for the hook refinement. This corrects the cause claim, not
merely its wording.

Current integrated cold-start comparison (each cell is before → after UTF-8
bytes; before is the preserved WO-236 parent and after is the integrated oracle):

| Role | .claude/skills | .agents/skills |
| --- | ---: | ---: |
| executor | 30,874 → 32,292 | 30,874 → 32,292 |
| verifier | 27,385 → 28,803 | 27,385 → 28,803 |
| reviewer | 29,811 → 31,229 | 29,811 → 31,229 |
| release-close | 18,574 → 19,992 | 18,574 → 19,992 |
| planner | 19,483 → 20,901 | 19,483 → 20,901 |
| refuter | 18,297 → 19,715 | 18,297 → 19,715 |

## WO-234-D014 — Separate operand normalization from effect screening

```json
{
  "id": "WO-234-D014",
  "date": "2026-10-28",
  "dispatch": "resume: next; named complete-review failure",
  "decision": "Use the existing wrapper and nested-shell operand normalization for dispatch admission while leaving full effect screening enabled by default for its existing callers. Propagate the selected screening mode through every recursive shell path. Keep the real hook regressions for bare, assignment/env-prefixed and nested npm options, with diagnostic focused controls. Use the existing complete-review keep-going mode for the remaining permitted run so every suite reports its outcome.",
  "evidence": [
    "Complete review host-gate:ffc7da2166c1b587615f60f0c39a0130e19627a4c06745b49a3c344561a81843:npm test ended2026-10-28T19:34:30.161Z with one actual failing harness fixture; 265 other harness tests passed and later suites were not started.",
    "The failing diagnostic was Command options before the subcommand require an explicit effect adapter; the bound refusal was absent.",
    "A bounded direct reproduction returned that error for npm --silent, npm --prefix and an env-prefixed option form. After separating screening, all five operand forms normalized successfully.",
    "The exact failing hook case ran under suiteEnvironment and passed. Its expanded nested env/--silent case and focused control also passed, one executed case with zero failures.",
    "The criteria reviewer identified the missing recursive-mode regression and retained the same original finding count; the initial Python test-edit assertion stopped before writing, after which the formatted block was inspected and patched explicitly."
  ],
  "rejected": [
    "Removing npm-option assertions would hide the observed regression.",
    "Keeping a full effect-adapter requirement in the admission view incorrectly treats an observable expensive start as unclassified.",
    "Relaxing the default screening of actual effect-classification callers would change authority outside this fix.",
    "A further live feedback audit would repeat the corrected source-projection mistake."
  ],
  "reopenWhen": "A focused case or complete review exposes another command form whose admission and effect classification are conflated."
}
```

The final refinement staled only authority revision007's generated bundle diff; revision008 replaces it as current. Artifact-identity002, verification002 and feedback003 each passed their own check on the refined source and were retained. No evidence edition was overwritten and no additional live worker was launched.


D014 complete-validation outcome: `npm test -- --review --keep-going` passed at
code identity `25d5f232ac530d0f697e5f96ea379009c08998b01a08761c16ab4725fb819acf`,
evidence `host-gate:25d5f232ac530d0f697e5f96ea379009c08998b01a08761c16ab4725fb819acf:npm test`,
recorded 2026-10-28T20:17:19.934Z. All 45 suite groups and 111 fresh tasks passed
in 0 h 37 min; no suite was unrun, no artifact was stale, and code/build outputs
were unchanged. The runner's terminal cleanup removed 2,345 roots, retained one
and reported zero blockers before filing the passing row. No further complete
run, bounded probe or new worker is required for this implementation. The
already-admitted consistency review and final document gate finish its handoff.
The post-run nested-repository census again found none outside preserved intake,
excluding node_modules. The intended preservation and integration outcome matched.

Final metadata correction: plain npm run meta refreshed the decision/follow-up/work-order projections and printed the current observation, but did not replace the release-preparation meter snapshot. The checked scripts/meta.mjs requires --write for that bounded snapshot. The explicit --write docs/evidence/WO-234/meta.json route refreshed its cutoff and current gate observations; no immutable baseline was changed.

## WO-234-D015 — VER-001 F1: one damaged journal leaves every later dispatch without its role or its bound

```json
{
  "id": "WO-234-D015",
  "date": "2026-10-28",
  "dispatch": "resume: verify",
  "decision": "VER-001 fails on a reproduced regression in a declared surface: the dispatch binder, bindDispatchBound (packages/skeleton/src/harness-host.ts 400), with readDispatchJournals (packages/skeleton/src/dispatch-journal.mjs 24). To find the phase anchor, bindDispatchBound reads every session journal in the lane through readDispatchJournals, which throws on the first file it cannot parse. Every caller runs it before the session's role is stored: the prompt hook's role binding (5730, before session.role at 5737), the CLI dispatch observation (1052, before 1059), harness begin (3738, before its journal write) and the Codex dispatch record (1453, before its journal write). So one damaged journal of any other session leaves every session dispatched afterwards in the checkout without its role. The hook's catch classes the untyped error as runtime-unavailable, cuts its message to 120 characters and sends the operator to scripts/bootstrap.mjs (6568 to 6577). Without a role the session loses its role's grants. Its dispatch standing reads unset with cause no-journal, so the PreToolUse refusal does not stop its exhausted bound; by code reading, neither does the gate's host task, which reads the same standing. main's runtime at the same commit binds the role and admits the grant beside the same damaged file. Journal writes are atomic (writeJson, 689, writes a temporary file and renames it), so only outside damage triggers this. Product 07 nevertheless decides by the reproduced regression, not by likelihood. Product 07's new sentence that Claude 'reports an advisory while retaining its other judgments' for a malformed record does not hold at entry. The lifecycle's refusal of next and fix, naming the damaged file, is D013's recorded design and the planning receipt's accepted criterion 2 known issue. It is not part of this finding. The verifier leaves the implementation unchanged.",
  "evidence": [
    "docs/evidence/WO-234/verification-001-probe.mjs entry exits 1 (bounded, 2026-10-28T21:16:12Z to 21:16:16Z). Each arm builds the fixture the harness-fixtures cases use and emits its harness. A fresh session enters with SessionStart and the prompt resume: verify, first in a clean lane, then beside one journal-named file holding '{ truncated'. Base arm (HEAD's scripts with the main checkout's runtime built from 22ce7799, harness host 0.37.0, read without modification): in both lanes the role is verifier and the verifier's system-temp write is admitted. Current arm, clean lane: role verifier, the write admitted, and npm test -- --review refused with DOTLN_DISPATCH_BOUND at verifier completeRuns 0. Current arm, damaged lane: role null, with the advisory 'runtime-unavailable: host facts or pinned runtime unavailable (Error: Invalid dispatch journal <fixture>/docs…); run node scripts/…'. The system-temp write is refused with DOTLN_HARNESS_REFUSED (outside-project write), npm test -- --review is admitted, and dispatchStanding is unset with cause no-journal.",
    "HEAD's packages/skeleton/src/harness-host.ts contains neither readDispatchJournals nor bindDispatchBound. Its directory scans read the writer lock, gate runs and operator-control records, and the last skips an unreadable record ('An unreadable recovery record is not a new workflow gate').",
    "scripts/resume.mjs 2586 catches a recordCodexDispatch failure as 'Codex session entry failed …; cause no-session', so a Codex dispatch beside a damaged journal records no session journal and no bound. This is a code reading; I did not execute it.",
    "The executor's damaged-journal case (scripts/test-dispatch-bound.mjs 'a damaged journal names its file while refusing the read') covers only the lifecycle reader. No harness case enters a session beside a damaged journal, and no worker report examined that path."
  ],
  "rejected": [
    "Follow-up, because only outside damage triggers it: under product 07 §Verification review and attack, a change that breaks behavior main had, shown by a probe, is blocking. The consequence is not cosmetic: every later dispatch in the checkout loses its role and grants, its bound is silently unset, and the advisory points at the wrong remedy.",
    "Treat it as D013's fail-closed design: D013 fails closed by reporting unavailable standing without inventing a fresh anchor. Here the role binding fails and the bound reads unset, which is the fail-open outcome D013 rejected, and product 07 says Claude keeps its other judgments.",
    "Remove or repair the damaged file: the verifier is read-only, and the probe's file is synthetic."
  ],
  "followup": "WO-234 repair. Class: an unreadable journal of another session breaks dispatch binding for every later session in the checkout. Rule: a dispatch binds its role, intent and order, and keeps its role's grants, whether or not other journals in the lane parse. An unreadable journal can make only that dispatch's bound anchor unavailable. The standing then reads unavailable and names the damaged file. Complete and review gates, bounded probes and worker launches are refused or advised exactly as D013 states for a malformed record. The standing is never computed as unset, from a fresh anchor, or with zero consumption. Reads, focused reproductions and role grants stay available. The diagnostic names the damaged path within its bounded length; it is not classed as runtime-unavailable and does not send the operator to bootstrap. The rule holds at every binder call site: prompt entry, CLI dispatch observation, harness begin and the Codex dispatch record. Regression: harness-fixtures cases for a clean and a damaged lane at prompt entry and at Codex dispatch, and docs/evidence/WO-234/verification-001-probe.mjs entry exits 0. Product 07's malformed-record sentence states the entry behavior as built.",
  "reopenWhen": "verification-001-probe.mjs entry exits 0 on the repaired subject, and a fixture shows a Codex dispatch beside a damaged journal recording its session journal and role."
}
```

## WO-234-D016 — VER-001 F2: an unparseable session journal's standing error names no file

```json
{
  "id": "WO-234-D016",
  "date": "2026-10-28",
  "dispatch": "resume: verify",
  "decision": "A follow-up in a declared surface that breaks no criterion and no behavior main had. dispatchStanding (scripts/lib/dispatch-bound.mjs 107) reads the session's own journal with a bare JSON.parse (121), so an unparseable journal raises the parser's message without its path. An invalid boundDispatch anchor raises 'Invalid dispatch-bound journal anchor', also without its path. The gate's host task then reports 'Dispatch standing unavailable: Expected property name or '}' in JSON at position 2 (line 1 column 3). Use analysis: to diagnose.', and the bounded wrapper returns the same message, naming no file. readDispatchJournals, the lifecycle's reader, names the file. D013 and product 07 say the gate names unavailable standing and the wrapper returns the read error. Both hold, but the operator must find the file.",
  "evidence": [
    "docs/evidence/WO-234/verification-001-probe.mjs functions (bounded, 2026-10-28T21:13:23Z), C2-malformed-journal: invalid JSON throws 'Expected property name or '}' in JSON at position 2 (line 1 column 3)', and the message omits the journal's name. The invalid anchor throws 'Invalid dispatch-bound journal anchor'.",
    "The same run's C5-unrelated-malformed-journal: the lifecycle reader throws 'Invalid dispatch journal <fixture>/docs/control/local/harness/c…c.json: …', naming the file.",
    "scripts/test-runner.mjs host admission wraps any standing error as 'Dispatch standing unavailable: <message>. Use analysis: to diagnose.'; scripts/lib/bounded-command.mjs propagates requireDispatchBound's error."
  ],
  "rejected": [
    "Blocking: criterion 2 names the missing-journal case, the refusal itself is D013's recorded design, and main had no standing to name."
  ],
  "followup": "In a repair of WO-234, or else the next order that touches scripts/lib/dispatch-bound.mjs: read the session journal through the shared journal reader's error form, so every unavailable-standing diagnostic from the gate, the bounded wrapper and harness usage names the damaged journal's path, for invalid JSON and for an invalid boundDispatch anchor alike. Add both cases to scripts/test-dispatch-bound.mjs.",
  "reopenWhen": "An unavailable-standing message names the damaged journal's path, for invalid JSON and for an invalid anchor."
}
```

## WO-234-D017 — VER-001 F3: a stop past both bounds records only its first metric

```json
{
  "id": "WO-234-D017",
  "date": "2026-10-28",
  "dispatch": "resume: verify",
  "decision": "A follow-up in the declared surfaces that breaks no criterion. When both bounds are exhausted, dispatchBoundResult (scripts/lib/dispatch-bound.mjs 197) and recordBoundStop (225) keep only standing.exceeded[0]. So the gate row's boundStop, the stop log, the meter's boundStops and the stops in plan failures carry the wall-clock metric alone, although the refusal message names both metrics. The order's only recorded stop shows it. The executor's redispatch stop at 2026-10-28T12:42:58.992Z records wallClockMs 30,115,363 of 19,719,368. Yet three complete reviews had started after that dispatch's 04:21:03.619Z start (05:08:52Z, 05:16:48Z and 06:42:54Z) and had used the three-run bound, and D009's evidence says both bounds were exceeded. A planning pass reading the boundStops block sees a wall-clock stop and cannot tell that the run bound was exhausted too. That bears on the default's reopening condition and on the planning receipt's criterion 1 known issue about idle time.",
  "evidence": [
    "docs/evidence/WO-234/verification-001-probe.mjs functions, C2-both: with both bounds exhausted, exceeded lists wallClockMs and completeRuns, and the message reads 'wall clock=0 h 0 min, bound=0 h 0 min; complete runs=2, bound=2'.",
    "The executor session's local stop log holds one row: source redispatch, boundStop {metric wallClockMs, value 30115363, bound 19719368}, dispatchStartedAt 2026-10-28T04:21:03.619Z. readGateChecks holds three review rows started after it and before the stop, each exit 1 (evidence references host-gate:572af62d…, host-gate:1335bd64…, host-gate:999af016…).",
    "docs/evidence/WO-234/meta.json and npm run plan -- failures --since 2026-10-28T00:00:00.000Z (bounded, 20:47:23.806Z) both report that stop with metric wallClockMs only; afterStop names DispatchBoundAccepted after 604,443 ms."
  ],
  "rejected": [
    "Blocking: criterion 7 and the order's design name one metric per stop, the stated cases pass, and nothing main had changes."
  ],
  "followup": "In a repair of WO-234, or else the next order that touches the dispatch meter: a stop records every exceeded metric with its value and bound, on the gate row, in the stop log, in the meter's boundStops and in the stops in plan failures. Old single-metric records stay readable. Add a both-bounds case to scripts/test-dispatch-bound.mjs and to the plan-failures fixture.",
  "reopenWhen": "A stop past both bounds records both metrics in the meter and in plan failures."
}
```

## WO-234-D018 — Bind the role even when dispatch history is damaged

```json
{
  "id": "WO-234-D018",
  "date": "2026-10-28",
  "dispatch": "resume: fix",
  "decision": "Repair VER-001 F1 at the shared binder. A typed, path-bearing journal read error is recorded as unavailable evidence on the new dispatch while its role, intent, order, usage lifetime and role grants survive at prompt entry, CLI observation, explicit begin and Codex recording. Standing rescans marked history before computing consumption: remaining damage throws the named diagnostic, while restored history selects the original earliest phase anchor without rebinding or resetting consumption. The existing gate/wrapper refusal and Claude advisory policy remain. Codex recording explicitly persists its role and selected order, including a fresh roleless journal.",
  "evidence": [
    "New input: docs/verifications/WO-234/VER-001.md F1 and D015; current binder and all four callers, dispatch-journal.mjs, dispatch-bound.mjs and the existing entry/anchor tests.",
    "The original verification-001-probe.mjs entry passes on the repaired source: both base and current damaged lanes retain verifier role and system-temp grants; the current standing is unavailable and names the damaged path.",
    "Added regressions exercise prompt, begin, Codex and CLI entry, both clean and damaged history, preserved grants, diagnostic selections, recorded advisories and restoration of the prior consumed anchor. The complete repair review passed all 45 suite groups and 111 fresh tasks at code identity 1176301f97d412956b3f8be27fd31e7786b16c506eb8960d6e1f51b7595cdfdb on 2026-10-28T22:41:49.629Z.",
    "The first recovery test used a future anchor without an activation boundary; corrected the fixture to an actual earlier timestamp and activation event. The CLI regression initially left its unavailable marker in place for unrelated later cases; it now exercises rebinding after repairing the file.",
    "Correction: the bounded-probe advisory was initially misdiagnosed as dropped by response composition. The checked runHarnessHook records every response and then suppresses repeated terminal advisories. The unnecessary response-composition edit was removed; the regression checks the recorded judgment for each call. The first direct test invocation also selected the dispatch tests twice because test-harness imports them; subsequent invocations select only that entry file."
  ],
  "traps": [
    "Skipping corrupt journals or silently renewing the budget would turn unavailable consumption into unearned capacity; keep a named unavailable marker.",
    "Refusing role binding to enforce the budget removes diagnostic grants and repeats the regression; bind the role independently.",
    "A passing terminal receipt alone could hide a missing role or reset anchor; assert the stored role, grants and consumed history."
  ],
  "rejected": [
    "NoOp preserves the blocking regression.",
    "Skipping malformed journals or treating them as zero consumption violates the recorded unavailable-evidence policy.",
    "A new global refusal policy would change D013 and the order's diagnostic-access contract."
  ],
  "reopens": {"decisionId": "WO-234-D015", "observation": "The named entry probe passes; the shared binder and all four entry paths retain role binding while standing remains unavailable. The complete repair gate passed, including the entry and normal redispatch recovery regressions; the immutable verification report remains unchanged for independent re-verification."},
  "reopenWhen": "A damaged-history entry loses its role or grants, an unavailable marker becomes unset, or repair of the history resets a known earlier anchor."
}
```

## WO-234-D019 — Name the journal on every standing read error

```json
{
  "id": "WO-234-D019",
  "date": "2026-10-28",
  "dispatch": "resume: fix",
  "decision": "Resolve F2 with the same shared single-journal reader required by F1. Parsing and anchor validation both identify the actual journal path. Bound the cause text rather than truncating the path, and retain the existing unavailable-standing outcome.",
  "evidence": ["VER-001 F2 and D016; the earlier session read called JSON.parse directly while the lane reader named the path.", "New regression covers malformed JSON and an invalid boundDispatch anchor at the session's own file; both pass the targeted reproduction and the complete repair review recorded at 2026-10-28T22:41:49.629Z."],
  "rejected": ["NoOp leaves a known diagnostic defect on the path already being repaired.", "A second parser/error convention would let entry and standing diagnostics diverge again."],
  "reopens": {"decisionId": "WO-234-D016", "observation": "The shared reader and passing malformed-JSON/anchor regression name the damaged file for both errors."},
  "reopenWhen": "A standing read error omits the file that must be repaired."
}
```

## WO-234-D020 — Preserve all causes of one budget stop

```json
{
  "id": "WO-234-D020",
  "date": "2026-10-28",
  "dispatch": "resume: fix; Adjacent Repair",
  "decision": "Resolve F3 as adjacent-0001: preserve every exceeded measurement inside boundStop.exceeded while retaining the legacy first metric/value/bound fields. Gate rows, stop logs and the meter already carry that object. Planning's closed-order snapshot projection now also retains the list. One refusal stays one stop; old single-metric records remain readable and are not retroactively inferred to have additional causes.",
  "evidence": ["VER-001 F3 and D017; dispatchBoundResult and recordBoundStop previously selected exceeded[0].", "Source read of test-runner.mjs and meta.mjs confirms both propagate the boundStop object. plan-failures.mjs explicitly projected three fields for closed snapshots and needed the additional list.", "Regressions cover a simultaneous two-bound stop, one log row, meter activity, live planning and a filed closed-order snapshot, plus a real runner both-bound stop. The complete repair review passed all 45 suite groups and 111 fresh tasks, including harness-fixtures, runner-fixtures, process-debt and plan-refutation; adjacent-0001 is completed at queue revision 6 with that passing row."],
  "rejected": ["NoOp leaves a small in-scope reporting defect already diagnosed by verification.", "Two stop rows would inflate intervention counts.", "Replacing the old object with an array would unnecessarily break single-metric readers."],
  "reopens": {"decisionId": "WO-234-D017", "observation": "The queued bounded repair carries both metrics through the existing stop shape and the closed-order projection; the targeted regression and complete repair review both pass."},
  "reopenWhen": "A new two-bound stop loses either measurement in gate, meter or planning output, or counts as two interventions."
}
```

D018 independent-design refinement: the first repair made the stored unavailable
marker permanent for a normal redispatch when it was the phase's earliest anchor.
The design reviewer traced `next`/`fix` admission before the internal rebinder;
`harness begin` also refuses an already-bound session. Standing now rereads the
whole lane on an unavailable marker and selects the earliest recorded phase
anchor. Remaining damage still produces its named error. Repaired history admits
normal redispatch without rewriting journals or replenishing consumption. The
new bounded regression passes for admission before the configured bound,
refusal at that bound, three previously consumed reviews and unchanged journal
bytes. The criteria recheck also requested a restored earlier same-phase anchor
without internal rebinding; that case is included. The separate two-bound
log/meter/planning regression also passes.

## WO-234-D021 — VER-002 F4: a dispatch bound beside a damaged journal loses its usage readback

```json
{
  "id": "WO-234-D021",
  "date": "2026-10-28",
  "dispatch": "resume: verify",
  "decision": "VER-002 fails on a reproduced regression that repair 001 introduced in a declared surface. The repair stores an unavailable marker on any dispatch bound while a journal in the lane cannot be read (bindDispatchBound, packages/skeleton/src/harness-host.ts 401 to 480). While the damage remains, dispatchStanding (scripts/lib/dispatch-bound.mjs 119 to 131) rethrows the named read error. harness usage (scripts/harness.mjs 129) measures usage, then calls dispatchStanding at 142 without a catch. For every session dispatched while one journal of another session is damaged, it therefore prints only the named error, exits 1 and prints no usage observation. main's runtime at the same commit prints the usage observation and exits 0 beside the same file. Those sessions lose the roles' Process Cost readback until the file is repaired, and criterion 6's 'harness usage prints it' fails in that state. Product 07's 'node scripts/harness.mjs usage <session> prints the standing' is untrue there. So are the kit README's 'returns the same standing on all hosts' and 'Reads, listings and focused reproductions stay available'. In the same state, the gate's host refusal, the wrapper's refusal and the hook's advisory are D013 and D018's recorded design and are not part of this finding. The verifier leaves the implementation unchanged.",
  "evidence": [
    "docs/evidence/WO-234/verification-002-probe.mjs entry (bounded, 2026-10-28T23:12:21Z to 23:12:35Z) exits 1 on its U1 rows only. Each arm builds the harness-fixtures fixture and enters resume: verify in a clean lane. It then enters again beside one journal-named file of each of four kinds: truncated JSON, an invalid boundDispatch anchor, mode 000 and a directory. With the damage still present, it runs node scripts/harness.mjs usage <session>. Base arm (HEAD's scripts with the main checkout's runtime built from 22ce7799, read without modification): exit 0 with the usage JSON in all five lanes. Current arm: exit 0 with the usage JSON and the standing in the clean lane. In each damaged lane: exit 1, no JSON, and stderr 'Invalid dispatch journal <fixture>/docs/control/local/harness/<damaged>.json: …'.",
    "The same run's E1 rows pass for all four kinds. Role, intent, order and the system-temp grant are retained. The marker, prompt advisory, gate-start advisories, Stop line and standing name the damaged file. Only the usage readback fails.",
    "scripts/harness.mjs is unchanged since VER-001's subject (refs/dotln/checkpoint/WO-234/6). At that subject the same session bound no role, its standing read unset, and usage printed. The failure arises from the marker repair 001 added."
  ],
  "rejected": [
    "Follow-up so that the repair loop ends: product 07 routes a change that breaks behavior main had, shown by a probe, as blocking, and criterion 6 names harness usage printing the standing.",
    "D013's fail-closed design: D013 governs gate, wrapper and lifecycle starts and keeps Claude's other judgments. It does not remove a read surface main had.",
    "Count the stderr error as printing the standing: it is not a standing line, the usage observation is lost, and the Stop hook already prints the expected form."
  ],
  "followup": "WO-234 repair. Class: an unavailable dispatch standing removes the usage readback. Rule: node scripts/harness.mjs usage <session> prints its usage observation with main's exit status whatever the standing. An unavailable standing is reported inside the same output in the Stop hook's form, 'dispatch standing: unavailable (<named read error>)', naming the damaged path. It is never reported as unset, from a fresh anchor or with zero consumption. The Codex and Copilot currentSession field is unchanged. Regression: a usage case beside a damaged journal of another session, and docs/evidence/WO-234/verification-002-probe.mjs entry exits 0.",
  "reopenWhen": "verification-002-probe.mjs entry exits 0 on the repaired subject, and harness usage prints both the usage observation and the named unavailable standing beside a damaged journal."
}
```

## WO-234-D022 — VER-002 F5: a marked dispatch repeats its stale marker after its phase completes

```json
{
  "id": "WO-234-D022",
  "date": "2026-10-28",
  "dispatch": "resume: verify",
  "decision": "A follow-up in a declared surface that breaks no criterion and no behavior main had. Repair 001's rescan (dispatchStanding, scripts/lib/dispatch-bound.mjs 119 to 131) looks for a marked dispatch's anchor through phaseDispatchAnchor (264). That function's boundary is the latest WorkOrderActivated or phase-completion event (285). If the phase completes after the dispatch started, every anchor of that phase falls before the boundary and nothing is recovered. The standing then rethrows the stored marker, naming a journal that may already read correctly. An unmarked dispatch in the same state computes its standing. After completion, the Stop line names a healthy file as damaged. With D021 unrepaired, harness usage also fails.",
  "evidence": [
    "docs/evidence/WO-234/verification-002-probe.mjs recovery (bounded, 2026-10-28T23:12:35Z to 23:12:39Z), R4: A's bytes are restored and VerificationCompleted is recorded after B's start. The marked dispatch B then throws 'Invalid dispatch journal docs/control/local/harness/<A>.json: Expected property name …' while A reads. The unmarked dispatch C reads within.",
    "The same run's R1 to R3 pass. While A is damaged, B reads a named unavailable error. Once A is restored before completion, B reads A's start and A's two consumed runs. The recovered bound refuses a third complete review, and a 1 h 0 min wall clock is exceeded from A's start. A's bytes and B's stored anchor are unchanged."
  ],
  "rejected": [
    "Blocking: no criterion covers the standing after its phase completes, main had no standing, and no costly start is admitted or refused differently."
  ],
  "followup": "In a repair of WO-234, or else the next order that touches scripts/lib/dispatch-bound.mjs: a stored unavailable marker is repeated only while a journal in the lane still fails to read. Once the lane reads, a marked dispatch's standing is computed as an unmarked dispatch's is: from the earliest readable anchor of the phase it was bound in, or else its own, including after that phase completes. Add a case to scripts/test-dispatch-bound.mjs that marks a dispatch, restores the lane, then completes the phase.",
  "reopenWhen": "Once its lane reads, a marked dispatch never reports its stored marker, before or after its phase completes."
}
```

## WO-234-D023 — VER-002 F6: a complete selection refused at host admission consumes a run

```json
{
  "id": "WO-234-D023",
  "date": "2026-10-28",
  "dispatch": "resume: verify",
  "decision": "A follow-up in the declared surfaces that breaks no criterion and no behavior main had. dispatchStanding (scripts/lib/dispatch-bound.mjs 160 to 168) counts every executed npm test row with a plain or review selection since the dispatch start. It excludes only rows with a boundStop and partial rows, and the runner records every gate row as executed (scripts/test-runner.mjs 3675). A complete selection the host task refuses for another reason, measured memory pressure or an unavailable standing, therefore consumes one of the dispatch's complete runs although no product suite started. Product 07 §Preflight before the full gate qualifies consumption by admission: 'Failed and interrupted admitted complete selections consume a run.' The order's Observed gap records two host memory refusals on 2026-10-26. A dispatch can spend its three runs on refusals and need an operator acceptance without having run a complete selection. Criterion 2's 'the gate rows since the dispatch start' and the design's 'the complete and review rows recorded for this checkout since that start' do not exclude refused rows, so no criterion is unmet. The count is the defect, and product 07's sentence is the rule it must meet.",
  "evidence": [
    "docs/evidence/WO-234/verification-002-probe.mjs gate (bounded, 2026-10-28T23:12:39Z to 23:12:41Z), G3: in G1's lane, the refused review row (review, executed true, exit 1, no boundStop) and one admitted review read as two complete runs. In a second fixture, the real checkHost refuses a review on a synthetic critical memory sample and the product suite does not run. That dispatch reads 'dispatch standing: 0 h 0 min of 8 h 0 min; complete runs 1 of 3; within'.",
    "The same run's G1, G2 and W1 pass. The host refusal names unavailable standing and the file, and focused selections run. A stop past both bounds is recorded once, with both measurements. The wrapper refuses a probe for a marked dispatch."
  ],
  "rejected": [
    "Blocking: criterion 2 and the design name the rows since the start without an admission rule, and main had no bound.",
    "Correct product 07 instead: charging refused selections spends the bound on host conditions outside the dispatch, which the order's 'the bound lives where the cost is paid' rejects."
  ],
  "followup": "In a repair of WO-234, or else the next order that touches scripts/lib/dispatch-bound.mjs or the gate row: only a complete or review selection that the host task admitted consumes a complete run. A selection refused at host admission consumes none, whether by measured memory pressure, an unavailable standing or an exhausted bound. Failed and interrupted admitted selections still count, and existing rows stay readable. Add memory-pressure and unavailable-standing refusal cases beside the existing bound-stop case.",
  "reopenWhen": "A complete selection refused at host admission no longer changes the dispatch's complete-run count."
}
```

## WO-234-D024 — Keep usage available when standing cannot be read

```json
{
  "id": "WO-234-D024",
  "date": "2026-10-28",
  "dispatch": "resume: fix",
  "decision": "Catch a standing read failure only at the usage presentation boundary. Keep the usage observation and optional Codex/Copilot currentSession field, report dispatchStanding.state unavailable with its named cause and the Stop-style text, and retain exit 0. Admission consumers continue to throw on unavailable consumption evidence.",
  "evidence": [
    "VER-002 F4/D021 names the uncaught dispatchStanding call in scripts/harness.mjs after measureHarnessUsage.",
    "The unchanged verification-002-probe.mjs entry section passes all 11 checks after the fix, including four damaged journal kinds, against main at 22ce7799.",
    "The added usage regression passes for Claude, Codex and Copilot environment forms and after restoring history."
  ],
  "rejected": [
    "NoOp leaves the blocking regression and removes process-cost observations during diagnosis.",
    "Returning unset or numeric zero would invent evidence and permit a fresh budget.",
    "Catching the failure inside dispatchStanding would weaken admission consumers."
  ],
  "reopens": {
    "decisionId": "WO-234-D021",
    "observation": "The named entry probe and the new cross-host usage regression pass; independent re-verification remains separate."
  },
  "reopenWhen": "A standing failure removes observable usage, loses a host session field, or is presented as unset or zero consumption."
}
```

## WO-234-D025 — Recover a marked dispatch within its original attempt

```json
{
  "id": "WO-234-D025",
  "date": "2026-10-28",
  "dispatch": "resume: fix",
  "decision": "Resolve a marked dispatch against its recorded phase-request boundary and journal starts at or before its recorded start. The stored request index distinguishes later completion events with the same timestamp; legacy markers retain the time-based fallback. Rescan the whole journal lane so remaining damage still raises its current named error, then use the earliest anchor in the original activation and phase, or the dispatch own recorded start if no earlier anchor survives. Keep the read nonmutating after completion and reactivation.",
  "evidence": [
    "VER-002 F5/D022: phaseDispatchAnchor selected the latest completion even when it followed the marked dispatch.",
    "The original recovery section passes all 7 checks after adding the cutoff. Added regression also covers reactivation, a later same-phase journal, retained consumption, and fallback to the recorded own start."
  ],
  "rejected": [
    "NoOp would keep a stale corruption diagnosis on a healthy lane already being repaired.",
    "Clearing the marker without rescanning could hide remaining damage.",
    "Rebinding from the current phase would reset or borrow another attempt budget."
  ],
  "reopens": {
    "decisionId": "WO-234-D022",
    "observation": "Queued adjacent-0002 carries the bounded repair; the original recovery reproduction passes."
  },
  "reopenWhen": "Recovery adopts a later attempt, a restored lane stays unavailable, or a read rewrites history."
}
```

## WO-234-D026 — Count complete selections from existing host-admission evidence

```json
{
  "id": "WO-234-D026",
  "date": "2026-10-28",
  "dispatch": "resume: fix",
  "decision": "Before counting a complete/review gate row, read its host result from taskTimeline or legacy cases. Require an executed successful host when recorded, and exclude an explicitly unrun host. Keep the historical interpretation only for older rows with neither observation. Failed and interrupted admitted runs still count; no new row schema or runner state is needed.",
  "evidence": [
    "VER-002 F6/D023: executed true describes the gate attempt and includes host refusals.",
    "scripts/test-runner.mjs already records host results, skipped hosts and interrupted selections in taskTimeline, cases and unrunSuites.",
    "The unchanged verification-002-probe.mjs gate section passes all 4 checks after the fix, including synthetic critical memory through real checkHost and unavailable standing."
  ],
  "rejected": [
    "NoOp makes an admission refusal consume the run budget.",
    "Excluding every failed or interrupted gate would hide consumed admitted work.",
    "Assuming missing legacy evidence means no run would retroactively reset historical consumption."
  ],
  "reopens": {
    "decisionId": "WO-234-D023",
    "observation": "Queued adjacent-0002 repairs accounting from existing evidence; the named gate reproduction passes."
  },
  "reopenWhen": "A refused host consumes a run, an admitted failed/interrupted complete selection is omitted, or a historical row becomes unreadable."
}
```

Repair 002 goal alignment: preserve diagnostic availability without inventing consumption (rule beating), and close the two bounded nearby defects without changing lifecycle authority or adding a supervisor (escalation). The NoOp would leave the reproduced regression and two defects on the same read path.

Correction, 2026-10-28: the new usage fixture initially omitted its budgets and incorrectly expected within instead of unset; it now supplies the kit budgets. Its next run tried to begin an already-started session; the supported redispatch recorder now binds the damaged-history marker. The corrected case passes. The entry lifecycle-diff search also used an unmatched unquoted zsh glob; the subsequent command read the exact scripts/resume.mjs path and its HEAD diff before dispatch.

D025 review refinement: the fresh criteria adversary found a completion appended
at the exact marked-dispatch timestamp. The added regression reproduced a reset
from the original start to the provisional start (exit 1). Recovery now uses the
recorded phaseBoundary request when identifiable and requires matching boundary
identifiers on modern candidates. The regression, normal redispatch recovery and
completed/reactivated recovery pass (three cases, exit 0). The fresh design reviewer then identified that lifecycle callers pass an
activation-trimmed acceptance array, while the recorded request index belongs
to full order history. Recovery now reads full history independently; the
regression covers both the first activation and reactivation with trimmed
acceptance events. Both reviewers rechecked the material refinement, with
one finding each fixed. Existing acceptance expiry remains the same for
marked and unmarked standings.

## WO-234-D027 — Maintain the gate architecture record for the existing boundary

```json
{
  "id": "WO-234-D027",
  "date": "2026-10-28",
  "dispatch": "resume: fix",
  "decision": "Update docs/architecture/gate-execution.md with the already implemented shared dispatch admission boundary, operator extension, admitted-only complete-run accounting and diagnostic recovery. Cite the original controls and this repair evidence. Preserve the judged order bytes: its existing citation to product 07 Preflight before the full gate already selects this maintained-record duty.",
  "evidence": [
    "The fresh consistency reviewer identified the missing write-back; gate-execution.md requires affected orders to update the record, and product 07 reiterates that duty.",
    "The repair changes no scheduling policy, task deadline or host-memory admission threshold. The recorded probes are behavior checks, not performance comparisons.",
    "release prepare --local retained v0.102.0; package and lockfile versions/dependencies remain those already staged for this order. Sync reported existing evidence editions current because deterministic judged output matched; only publication required regeneration at the first repair sync."
  ],
  "rejected": [
    "NoOp would leave a required architecture description incomplete.",
    "Adding a new scheduling benchmark or implementation would exceed this write-back need.",
    "Changing the sealed order criteria or scope is unnecessary for an existing cited duty."
  ],
  "reopenWhen": "The shared dispatch boundary, admission evidence, extension authority or recovery behavior changes."
}
```

## WO-234-D028 — VER-003 F7: a damaged gate-row store's standing error names no file

```json
{
  "id": "WO-234-D028",
  "date": "2026-10-28",
  "dispatch": "resume: verify",
  "decision": "A follow-up in the declared surfaces that breaks no criterion and no behavior main had. dispatchStanding (scripts/lib/dispatch-bound.mjs 162) reads the gate rows through readGateChecks. Its file reader (packages/skeleton/src/gate-evidence.mjs readChecksFile, 1050 to 1055) parses docs/control/local/harness/checks.json and the check-history archives with a bare JSON.parse. When that store holds unparseable bytes, the standing's unavailable error carries only the parser's message. harness usage then prints 'dispatch standing: unavailable (Expected property name or '}' in JSON at position 2 (line 1 column 3))', which names no file. A damaged journal's error names its path (D019), and a damaged budget names its key. The kit README states generally that when standing cannot be read, usage prints 'dispatch standing: unavailable (<named read error>)'. For this store, that is not exact. The usage observation and its exit status are unaffected, so F4's repair holds. main's Stop hook already reports the same unnamed parse error for this store, classed runtime-unavailable, and the base and current Stop results are identical. The verifier leaves the implementation unchanged.",
  "evidence": [
    "docs/evidence/WO-234/verification-003-probe.mjs usage (bounded, 2026-10-29T00:57:06Z to 00:57:17Z), U4. In each arm a fresh resume: verify session enters, then docs/control/local/harness/checks.json is overwritten with '{ broken'. Base arm (HEAD's scripts with the main checkout's runtime built from 22ce7799): usage exits 0 with its JSON, and Stop prints only 'DotLn advisory: runtime-unavailable: host facts or pinned runtime unavailable (SyntaxError: Expected property name or '}' in JSON at position 2 (line 1 column 3'. Current arm: usage exits 0 with its JSON and the standing 'dispatch standing: unavailable (Expected property name or '}' in JSON at position 2 (line 1 column 3))'. Its Stop result is identical to the base arm's.",
    "The same run's U3 names an invalid budget's key ('dispatch standing: unavailable (Invalid budget: verifier.wallClockMs)'). VER-002's unchanged entry section names each of the four damaged journal kinds and passes 11 of 11 checks at this subject."
  ],
  "rejected": [
    "Blocking: usage keeps main's output and exit status, no criterion names this store's diagnostic, and main reports the same unnamed error.",
    "No record: the defect was met and reproduced, and the kit README promises a named read error whenever standing cannot be read."
  ],
  "followup": "In a repair of WO-234, or else the next order that touches scripts/lib/dispatch-bound.mjs or the gate-row reader: a standing read error from the gate-row store names the file it could not read (docs/control/local/harness/checks.json or its check-history archive) wherever the standing is reported: harness usage, the Stop line, the gate's host refusal and the wrapper's refusal. Journal errors already name their file (D019). Naming the file in the shared reader also names it in the Stop hook's existing runtime advisory. Add a case with a truncated checks.json.",
  "reopenWhen": "verification-003-probe.mjs usage U4's current standing names docs/control/local/harness/checks.json."
}
```

## WO-234-D029 — FINAL-001 passes at the repair-002 identity; main is not integrated because read-only ancestry shows nothing to take in; VER-003's F7 stays a deferred follow-up and six register rows are disposed

```json
{
  "id": "WO-234-D029",
  "date": "2026-10-28",
  "dispatch": "resume: final review",
  "decision": "Pass WO-234 on all ten criteria at code identity 7ad68947b597d2f0449c7add8183c679591384f9dbb3fd91222752af139ab2d4, the identity repair 002 handed off and VER-003 judged, consuming the passing complete review row recorded at 2026-10-29T00:10:57.995Z (review selection, 45 required suites, 111 fresh tasks, exit 0). Run no integration helper: HEAD, main, the local origin/main ref and the remote main all read 22ce7799, so in final-review the helper would fetch, stash the 194 changed and untracked paths and merge nothing, which is the invocation WO-236-D014 recorded the operator's objection to and the no-op product 07 describes for a worktree not behind main; the integrated identity is therefore the handoff identity and every verified claim is carried forward unchanged. Keep the release as D011 retimed it: application v0.102.0 above the newest tag v0.101.0, compiler 0.33.0, skeleton 0.72.0, harness host 0.38.0 and the console's pins, with no collision. Judge VER-003's F7 (D028) as a follow-up in the declared surfaces that breaks no criterion and no behavior main had, reproduced here, and keep it on its route by disposing its untriaged register row as deferred. Re-dispose five rows whose reopening condition this change met: FUP-957602bc42e32e1d and FUP-e08668268dea62b1 (another role edit changed the measured overrun: every role root grows by 1,418 bytes; the executor reads 32,292 against the nominal 29,246 and within the 34,953 accepted on 2026-10-27, the reviewer 31,229 against the nominal 28,884 and within the 34,596 D005 accepted on 2026-10-28), FUP-eed385be08e5bdd9 (this order touches scripts/test-gate-followups.mjs and re-mints the role oracle), FUP-632348a91b2ae9d8 (the first bound stop landed in an attended session, at the executor's redispatch on 2026-10-28T12:42:58.992Z, and D013 records a reading the attended case does not contradict) and FUP-34bee344f576ba39 (this order edits scripts/lib/plan-failures.mjs, adding the boundStops block beside the escape counts it does not sum). Leave the other 24 matched rows as they are: none of their seams is opened by this change and none of their conditions occurred. Record the meter's standing sequenceBytes breach and its drift-to-low-performance reopen candidate, the release surface check's advisory on three untracked component sources, and cold-start.json's pre-integration after-values as observations, not findings. Write no source byte, so no fresh complete run is owed.",
  "evidence": [
    "git rev-parse HEAD, main and origin/main and git ls-remote origin refs/heads/main all read 22ce7799cce61db93f5852069dacf2409373adbd at 01:17Z to 01:31Z; git merge-base HEAD main reads the same commit; the complete row's sharedRefs start and end read the same main and origin main with 188 tags, newest v0.101.0; scripts/lib/worktree-integration.mjs skips its not-behind-main no-op only in phase active, so in final-review it would fetch and stash before merging nothing.",
    "gateCodeIdentity recomputed at 01:36Z reads 7ad68947b597d2f0449c7add8183c679591384f9dbb3fd91222752af139ab2d4, equal to the RepairCompleted productGate identity, repair-002-validation.json and VER-003's identity; docs/control/local/harness/checks.json holds six rows at that identity: the npm test review row of 00:10:57.995Z (exit 0, 2,141,012 ms, fresh, 45 required suites, 111 fresh tasks, none unrun or stale), its structural row, and two npm run test:docs rows with their structural rows (00:17:54Z and 01:12:56Z, exit 0).",
    "Checks under node scripts/harness.mjs bounded, each exit 0, 01:38Z to 01:40Z: harness check (35 generated surfaces), publication:check (255 of 255 headings; both editions current), format:check, release check-surfaces --local (one advisory: untracked source not compared for 3 component source paths), meta --check (one standing breach, current/sequenceBytes 18,914 against 8,192; one reopen candidate, drift-to-low-performance on coldStartBytes 32,292 with a 1,418-byte delta), plan check (57 receipts, 46 passes, no advisory; the order's D009 amendment and WO-236's release assignment are the workspace updates), lineage index --check (186 sections), work-orders index --check and siblings index --check; git diff --check clean against the index and against main, and no trailing whitespace in untracked text files.",
    "docs/evidence/WO-234/verification-003-probe.mjs rerun under the bounded wrapper at the reviewed tree, 01:40:41Z to 01:40:58Z: count 5 of 5, usage 5 of 5 and lane 2 of 2, exit 0 each; U4's current standing still reads dispatch standing: unavailable (Expected property name or '}' in JSON at position 2 (line 1 column 3)) while U3's names Invalid budget: verifier.wallClockMs, which reproduces F7; L1 reads 9 journals with 3 changed by the admitted-only count and none throwing; verification-002-probe.mjs entry 11 of 11 and verification-001-probe.mjs hooks 6 of 6 at 01:41Z to 01:42Z.",
    "Installed roots measured as CLAUDE.md (7,316 bytes) plus each role skill: executor 32,292, verifier 28,803, reviewer 31,229, release-close 19,992, planner 20,901, refuter 19,715 in both roots, equal to D013's table and the integration oracle's startupCost; all twelve role hashes equal packages/skeleton/fixtures/wo234-integration-role-baseline.json, whose wo236, wo185 and wo234-recovery digests match their files.",
    "npm run plan -- failures --since 2026-10-28T00:00:00.000Z lists one bound stop (WO-234, implementation, wallClockMs 30,115,363 against 19,719,368 at 12:42:58.992Z, source redispatch), the two acceptances and afterStop naming DispatchBoundAccepted after 604,443 ms; the window holds two DispatchBoundAccepted off-ramp events and no failed final review.",
    "npm run plan -- followups --touching over 194 changed paths and WO-234 at register revision c4aa166df99bce1fde5029b630f396059db6b2673e813de0d406b926d2a617d8: 225 pending rows, 30 matched over four pages; the six disposed rows are named in FINAL-001's register table.",
    "WO-236-D014 and D031 and product 07 §Independent workflows and integration: a worktree not behind main takes in nothing, and the operator objected to invoking the helper when read-only ancestry shows that."
  ],
  "rejected": [
    {
      "option": "Run npm run worktree -- integrate WO-234 because the role procedure lists it",
      "reason": "With HEAD, main and the remote main equal the helper has nothing to take in; in final-review it would still fetch, stash every changed and untracked path on the shared stash stack and apply it back, which risks the work for no integration result, and the operator's recorded objection in WO-236-D014 names exactly that invocation."
    },
    {
      "option": "Repair F7 in this review within the Boy Scout bound",
      "reason": "A reviewer never writes a behavioral fix and certifies it; a source edit would move the code identity and owe a fresh complete run over bytes no verifier judged."
    },
    {
      "option": "Route F7 as blocking",
      "reason": "Usage keeps main's output and exit status, no criterion names the gate-row store's diagnostic, and main's Stop hook reports the same unnamed parser error for that store; it breaks no criterion and no behavior main had."
    },
    {
      "option": "Spawn reviewers to re-read the diff",
      "reason": "The subject is 101 tracked files and 93 untracked paths with three verifications that each spawned nothing and three fresh worker reviews per execution and repair; every claim the verdict rests on was reproduced in this session, so the plan was 0 of the 20-agent cap and none was spawned."
    }
  ],
  "reopenWhen": "A repair of WO-234 happens, in which case F7 is its first Boy Scout candidate; main moves before the branch is published, in which case the integration helper runs and the integrated identity is re-derived; WO-192's later integration finds its router's bound shape disagrees with these keys; or a planning pass reads the boundStops block for the first attended-session stop and cannot answer whether the intervention helped."
}
```
