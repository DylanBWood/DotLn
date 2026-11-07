# WO-242 decisions

## WO-242-D001

```json
{
  "id": "WO-242-D001",
  "date": "2026-11-04",
  "dispatch": "planning: standard planning pass + (the 2026-11-03 pass); the operator's correction of 2026-11-04 on reading the merged #272, that no operator words are quoted in a committed document",
  "decision": "Rewrite the one quoted operator remark in this order's Design (the private-repository links axis) as a synthesis; no other sentence of the order changes.",
  "evidence": [
    "The clean-room floor in CLAUDE.md: ordinary raw ideation is synthesized and rewritten; exact wording is admitted only for an operator-authored public draft marked ready to file.",
    "The operator's direction of 2026-11-04: every direct quote of the operator leaves the public repository.",
    "WO-254-D001 and WO-254-D002 record the same correction for the 2026-11-03 pass's orders and the older records."
  ],
  "rejected": [
    { "option": "A second refutation of the order", "reason": "A bounded, operator-authorized rewrite of one clause that adds no scope and alters no criterion, design axis or step; the execution-amendment route binds the approved bytes." }
  ],
  "reopenWhen": "A committed surface is found to quote an operator message that was not a public draft marked ready to file.",
  "kind": "correction",
  "misread": "The order's Design quoted the operator's remark as the axis's evidence.",
  "meant": "The axis is stated as a synthesis of the operator's direction, with the words only in ignored intake.",
  "changed": "One clause of the Design's rejected alternative on screening a private target's conversation document."
}
```

## WO-242-D002

The order's criterion 4 and deliverables still name a target closeout sentence,
but its known carry-ins explicitly assign that sentence to WO-243 and say this
order no longer carries it. Preserve that scope fence. Judge the remaining
criterion 4 implementation normally, and report the contradictory closeout part
unmet for the verifier to dispose through its typed criterion route. No waiver,
defect event or acceptance edit is recorded by the executor.

```json
{"id":"WO-242-D002","date":"2026-11-06","dispatch":"resume: next","decision":"Preserve the order's explicit deferral of the target closeout sentence to WO-243 and report the conflicting criterion fragment as unmet, contradiction.","evidence":["docs/work-orders/WO-242-plan-first-mode.md criterion 4 and Known issues and carry-ins"],"rejected":["Implementing WO-243's sentence here overrides the explicit scope fence.","Silently marking the conflicting fragment met would invent evidence."],"reopenWhen":"The operator amends the order or the verifier records the appropriate typed disposition."}
```

## WO-242-D003

Initial compilation exposed an array assumption for the write-destination
iterator. The guard now materializes that iterator and supplies an explicit
path callback. The subsequent build passed. Initial lifecycle fixtures also
lacked the router's required main worktree and target authority profile; the
fixture now supplies both existing contracts. The unchanged production route
continues to refuse an unresolved worktree. The bounded plan-first fixtures and
generated-hook fixture then passed.

```json
{"id":"WO-242-D003","date":"2026-11-06","dispatch":"resume: next","decision":"Correct the guard's iterator use and qualify fixtures with the existing worktree and authority contracts.","evidence":["npm run build: initial TypeScript errors followed by successful build","node scripts/harness.mjs bounded -- node --test --test-name-pattern plan-first scripts/test-plan-first.mjs: four passed","node scripts/harness.mjs bounded -- node --test --test-name-pattern 'plan-first hook' scripts/test-harness.mjs: passed"],"rejected":["Weakening route observation to accommodate an incomplete fixture.","Suppressing TypeScript errors."],"reopenWhen":"A fixture no longer represents the production contract it claims to exercise."}
```

## WO-242-D004

The operator selected GPT Astra for the independent reviewers during this executor phase.
All independent review rounds use fresh Codex Astra workers at max effort.
The parent remains the only repository writer. The planned ladder starts with
three reviewers and reserves rechecks within the 20-use cap. The session's own
readback is Codex CLI 0.167.0, gpt-6-astra, max.

```json
{"id":"WO-242-D004","date":"2026-11-06","dispatch":"resume: next; operator selected GPT Astra reviewers","decision":"Use gpt-6-astra at max for every independent reviewer in this executor phase.","evidence":["Operator message in the active executor session","Canonical resume briefing: codex-session-readback"],"rejected":["Keeping the default Sol reviewer would ignore the operator's selection."],"reopenWhen":"The operator changes the reviewer model selection."}
```

## WO-242-D005

```json
{
  "id": "WO-242-D005",
  "date": "2026-11-06",
  "dispatch": "resume: next; release prepare",
  "decision": "Assign application target v0.120.0, the next minor above the observed release baseline v0.119.0, to the heading and the README version claim.",
  "evidence": [
    "release baseline v0.119.0 (ancestral local release tags, excluding annotated starter refresh tags)",
    "minor classification declared in docs/work-orders/WO-242-plan-first-mode.md"
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

## WO-242-D006

The generated refresh refused feedback carry because source-change-host.ts is a judged feedback source. The order’s no-live-episode assumption is contradicted by executable evidence. Perform a fresh live feedback episode under the existing executor duty; retain the old edition. Compaction recovery also needs to recognize an intentional plan wait, and its focused regression passed.

```json
{
  "id": "WO-242-D006",
  "date": "2026-11-06",
  "dispatch": "resume: next",
  "kind": "correction",
  "misread": "The order described its runtime changes as requiring no live feedback episode.",
  "meant": "Actual FEEDBACK_SOURCE_PATHS and the carry check decide whether the evidence remains valid.",
  "changed": "A fresh live feedback episode is required before the final evidence refresh.",
  "decision": "Run the fresh feedback qualification and preserve all prior editions.",
  "evidence": [
    "npm run sync: feedback carry refused for packages/skeleton/src/source-change-host.ts",
    "scripts/feedback-evidence.mjs",
    "node scripts/harness.mjs bounded -- node --test --test-name-pattern \"plan-first awaiting\" scripts/test-codex-continuation.mjs: passed"
  ],
  "rejected": [
    "Ignoring the stale evidence.",
    "Removing the source boundary to preserve an old passing record."
  ],
  "reopenWhen": "The actual judged source set or feedback contract changes."
}
```

## WO-242-D007

The scripted target workflow completed four turns through a question, correction, complete-diff inspection, approval and application. Work and waiting each round to 0 h 0 min; exact timings, byte counts and individual documents are recorded in scripted-mechanism.json. The bounded comparison measures the in-process guard with the election off and awaiting; it does not measure a whole hook process. No human novice participated, so comprehension and reduced burden remain unmeasured. Only true user-role messages are operator turns; tool, host and agent messages cannot authorize approval.

```json
{
  "id": "WO-242-D007",
  "date": "2026-11-06",
  "dispatch": "resume: next",
  "decision": "Report scripted workflow success and the measured guard overhead without claiming human usability or savings.",
  "evidence": [
    "docs/evidence/WO-242/scripted-mechanism.json",
    "scripts/probes/wo242-plan-first.mjs",
    "scripts/test-harness.mjs plan-first hook fixture"
  ],
  "rejected": [
    "Treating scripted waiting as human response time.",
    "Using document length as proof of usefulness."
  ],
  "reopenWhen": "An operator runs the workflow with a novice or a supported host misclassifies a notification as an operator turn."
}
```

## WO-242-D008

Release preparation selected v0.120.0. Skeleton gains the optional mode as 0.87.0; compiler 0.42.1 fixes continuation at an intentional approval wait. Internal dependency pins and the lockfile follow those versions; publication controls remain in place. No third-party dependency is added. New evidence-source exclusions cover only optional plan-first helpers not exercised by historical default-mode editions; dedicated lifecycle and hook fixtures judge those helpers.

```json
{
  "id": "WO-242-D008",
  "date": "2026-11-06",
  "dispatch": "resume: next",
  "decision": "Bump only the changed runtime components and their dependency pins, and retain the existing default-mode evidence boundaries.",
  "evidence": [
    "npm run release -- prepare --local",
    "packages/skeleton/package.json",
    "packages/compiler/package.json",
    "scripts/lib/evidence-sources.mjs"
  ],
  "rejected": [
    "Bumping unchanged packages.",
    "Claiming optional workflow behavior from default-mode historical editions."
  ],
  "reopenWhen": "Integration changes the release baseline or qualification shows a compatibility break."
}
```

## WO-242-D009

The generated executor and installed floor measure 44,358 UTF-8 bytes with the election off and 47,130 with it on, in both harnesses. The previous effective acceptance is 40,194. Under the standing product 07 route, accept the elected measurement plus 4,096 bytes (51,226), preserving every reviewed duty. The acceptance changes no role bytes. The first feedback attempt stopped before launching its verifier because the supplied macOS `/var` store resolved through `/private/var`; retain that store and use a physical path for the next attempt. The compiler package version also requires its source constant to agree; both now name 0.42.1.

```json
{"id":"WO-242-D009","date":"2026-11-06","dispatch":"resume: next","decision":"Accept the measured elected executor cold start under the standing route and correct the feedback store path and compiler version constant before qualification.","evidence":["harnessInstallation({features:{plan-first:true}}) plus installed CLAUDE.md: 47130 bytes in both roots","docs/control/budgets.json previous effective acceptance 40194","feedback verifier store ends at CommandPersisted; mount realpath differs from supplied path","packages/skeleton/src/feedback-selfhost.ts physical mount check","packages/compiler/src/artifact-identity.ts"],"rejected":["Trimming reviewed role duties to satisfy the old ceiling.","Weakening the physical mount check.","Reusing the incomplete feedback attempt as passing evidence."],"reopenWhen":"Another duty exceeds the accepted ceiling or the physical store still fails qualification."}
```

## WO-242-D010

The physical-store retry completed with an independent `gpt-6-astra`, max verifier: ten present passes and ten mechanism-removal assertion failures, with the matched instruction projection 1,192 bytes smaller. The checked feedback-002 edition is selected; feedback-001 and the first incomplete store are retained. The default-mode controls additionally compare the base's retained permission runtime with the candidate for source writes, reads and the push advisory, with both absent and false elections. All six responses are byte-identical. Initial control harness attempts lacked the fixture's floor, ignored runtime paths and independent advisory state; the corrected probe supplies those existing contracts and compares separate sessions so one-time advisories are not consumed by the first arm.

```json
{"id":"WO-242-D010","date":"2026-11-06","dispatch":"resume: next","decision":"Select the independently checked current feedback edition and record base/current controls using equivalent isolated sessions.","evidence":["docs/evidence/WO-242/feedback-002/edition.json","node scripts/feedback-evidence.mjs --check --edition WO-242 --revision 002: passed","docs/evidence/WO-242/controls.json","scripts/probes/wo242-controls.mjs"],"rejected":["Treating the failed first audit as passing evidence.","Comparing a fresh advisory with an already-consumed advisory in the same session."],"reopenWhen":"A judged source changes or a default-mode control ceases to match the base."}
```

## WO-242-D011

The executor implements the optional workflow with one freshness judgment shared
by lifecycle readiness, the observed write hook and the source apply boundary.
The absent election keeps the existing lifecycle fields and procedure. The
candidate lives in an owned scratch repository; its full binary-capable diff is
bound to the three document digests and base commit. The command records the
actor's interpretation of approval, as required by the existing capture trust
model; it does not infer intent from arbitrary text.

```json
{"id":"WO-242-D011","date":"2026-11-06","dispatch":"resume: next","decision":"Use one optional plan-first freshness check and an owned isolated candidate, with exact document and diff binding before approval and application.","evidence":["docs/work-orders/WO-242-plan-first-mode.md design and criteria 1–3","scripts/lib/plan-first.mjs","scripts/test-plan-first.mjs","scripts/test-harness.mjs plan-first hook fixture"],"rejected":["A new phase changes unrelated phase consumers and contradicts the order.","Role text alone cannot enforce the observed hook or helper boundaries.","NoOp leaves the elected mode without a consumer."],"reopenWhen":"A recorded approval fails to bind the intended candidate or a host notification is treated as an operator turn."}
```

## WO-242-D012

The first independent Astra review round found nine issues across criteria (three), design (two) and consistency (four). The implementation had put the wait only in the launchpad hook, blocked required captures and paired evidence, tied the candidate lifetime to a short command, and read two different candidate snapshots during application. The target adapter now uses the same wait and admits the owned candidate; the wait permits ignored intake and both evidence roots. A candidate stays pinned through operator turns and releases that pin when the order is completed or withdrawn. Renewal preserves an absent old candidate's reference. Application validates and applies one snapshot. Nine focused plan-first tests and the driven-note/admission test passed after these changes.

I had replaced the existing D001 while starting this implementation. Its original 2026-11-04 record and bound decision hash must survive: it is restored unchanged, and the new implementation decision is D011. D004 now synthesizes the reviewer selection under the active dispatch prefix. The standing feature descriptions and driven target helper forms are corrected. The old deterministic conversation probe is retained as scripted-mechanism.json; the required live executor conversation is being conducted as distinct model turns, with actual stop and return boundaries, before recheck.

```json
{"id":"WO-242-D012","date":"2026-11-06","dispatch":"resume: next; first independent review corrections","kind":"correction","misread":"The implementation treated the ordinary launchpad hook, a short-lived candidate, a scripted two-sided conversation and a replacement decision identifier as sufficient for the required workflow.","meant":"The installed target adapter, persistent candidate, real executor turns and existing immutable decision identity are distinct obligations.","changed":"Integrated target and capture boundaries; pinned candidates until order disposition; single-snapshot application; restored D001 and corrected current guidance; separated the deterministic probe from live evidence.","decision":"Repair the confirmed behavioral and provenance gaps before the review recheck and complete gate.","evidence":["docs/control/local/reviews/WO-242/round-1-criteria.md","docs/control/local/reviews/WO-242/round-1-design.md","docs/control/local/reviews/WO-242/round-1-consistency.md","scripts/test-plan-first-boundaries.mjs","scripts/test-drive.mjs","nine focused plan-first tests passed","driven profile and admitted-helper forms test passed"],"rejected":["Treating a launchpad-hook call on a target pathname as proof of the installed target adapter.","Rewriting the historical amendment hash to conceal the D001 replacement.","Treating prewritten agent responses as a live executor conversation."],"reopenWhen":"An independent recheck identifies an unclosed finding, or the real multi-turn experiment cannot complete."}
```

## WO-242-D013

A live `dotln-worker-astra` executor completed four distinct model turns in an
isolated target fixture: propose, answer a question, revise the greeting, and
apply after the scripted operator's approval. Each turn's exact three documents
and reply are retained in live-conversation.json. The target remained unchanged
for the first three turns. The final application produced the approved 17 bytes,
including one trailing newline. Ordinary turn cleanup retained the candidate at
all four boundaries. Cumulative conversation prefixes and writer headings were
checked; the measured reading payloads were 10,472, 14,384, 18,294 and 19,906 bytes.
The recorded model work was about 0 hours 4 minutes; automated waiting was under
0 hours 1 minute. The worker's usage readback returned no-session, so its token
cost is unknown; the parent dispatch counter is separately labeled.

On the approval turn the model correctly identified a missing instruction:
paraphrasing approval changes the conversation digest. The driver clarified that
the executor must first capture and paraphrase it, verify the candidate diff and
substantive plan/proposal have not changed, then refresh only revision metadata
and record the same approval. The receipt checks those byte equalities. The
emitted procedure and standing guide now state this transaction and keep the
application-completion report outside the bound conversation. Any substantive
change or later operator entry still needs fresh approval. The actual installed
target-hook regression now includes the approval-paraphrase refresh.

This exercise used a real model and scripted operator turns in this executor
session, with one driver clarification. It establishes the observed workflow,
not a novice's comprehension or reduced reading burden. Those claims remain
unmeasured.

```json
{"id":"WO-242-D013","date":"2026-11-06","dispatch":"resume: next; live executor experiment","decision":"Retain the real four-turn evidence and make approval capture plus metadata refresh an explicit transaction whose substantive proposal stays byte-identical.","evidence":["docs/evidence/WO-242/live-conversation.json","scripts/test-plan-first-boundaries.mjs","packages/skeleton/src/loadouts/contributor.ts"],"rejected":["Skipping the approval paraphrase to avoid digest freshness.","Treating an approval of the reviewed plan as permission for a changed substantive proposal.","Claiming human usability or lower reading burden from an automated exercise."],"reopenWhen":"A real operator turn cannot complete without driver clarification, or human observation supports changing the document reading burden."}
```

## WO-242-D014

After the live experiment's procedure clarification, elected executor cold start
is 47,593 UTF-8 bytes in each harness, within D009's 51,226-byte acceptance. The
off measurement remains 44,358 bytes. Canonical status, current.md and the emitted
off executor still match the captured base controls, and all six absent/false
permission-hook comparisons were rerun and remained byte-identical. The final
installed target-hook approval roundtrip passed with the paraphrase refresh.

```json
{"id":"WO-242-D014","date":"2026-11-06","dispatch":"resume: next; pre-recheck measurements","decision":"Keep the existing accepted ceiling and the unchanged default-mode contract after the clarified approval procedure.","evidence":["docs/evidence/WO-242/cold-start.json","docs/evidence/WO-242/controls.json","scripts/probes/wo242-controls.mjs: six equal base/current responses","scripts/test-harness.mjs: plan-first target-installed hook enforces the same plan wait passed"],"rejected":["Changing the ceiling when the final measurement already fits.","Claiming the original elected byte count after adding procedure guidance."],"reopenWhen":"Another elected duty exceeds the acceptance or a default-mode control changes."}
```

## WO-242-D015

The second design review closed both original findings and noted a separate
setup-failure path: a candidate root is pinned before clone, checkout and local
record creation finish. If setup fails before that record exists, ordinary
completion cannot enumerate it to release the pin. This is a static observation;
no such failure occurred in the recorded workflow. Keep the partial files and
record a focused recovery follow-up. The round-two rule admits new required
fixes only for acceptance or existing-main behavior, so this maintenance note
does not widen this implementation round.

```json
{"id":"WO-242-D015","date":"2026-11-06","dispatch":"resume: next; second design review disposition","decision":"Preserve unsuccessful draft setup for recovery and board the unrecorded pinned-root cleanup path as a focused follow-up.","evidence":["docs/control/local/reviews/WO-242/round-2-design.md","scripts/lib/plan-first.mjs draftPlanCandidate and releasePlanCandidates"],"rejected":["Expanding the final review round with a maintenance-only change.","Deleting partially prepared candidates on failure without recovery evidence."],"followup":"Give failed plan-first candidate setup a finite recovery lifetime when clone, checkout or record creation fails before the local candidate record is saved; retain partial files and test each failure boundary.","reopenWhen":"A failed draft leaves an unrecorded pinned root, or the focused candidate-setup recovery follow-up is selected."}
```

## WO-242-D016

Round two confirmed all nine original fixes and found two new required issues.
The proposal parser counted a marker string inside the diff as another outer
block. It now recognizes line-delimited outer markers, keeps the complete diff
unchanged, and still rejects duplicate outer blocks. The new regression passes
with marker and fence text in the candidate payload.

The feature registry correctly names its implemented source consumer, but two
tests still expected the former pending WO-242 consumer. Both old tests failed
in focused reproductions. The current-feature check now expects no obsolete
advisory, while an explicit synthetic queued inventory preserves coverage of
closed-consumer advisories. The qualification fixture checks the real source
consumer. Both corrected tests pass. Expected values follow the implemented
registry contract, not a replacement baseline chosen to silence a failure.

The consistency report recorder initially rejected the placement of its table
introduction. Moving that unchanged paragraph before the table's heading made
the report recordable; no finding or judgment changed. Prose reports carry no
structured finding objects, so their generated zero-count headers do not replace
the embedded findings or this handoff's explicit counts.

```json
{"id":"WO-242-D016","date":"2026-11-06","dispatch":"resume: next; second review corrections","kind":"correction","misread":"Literal marker text in code was treated as a second proposal block, and two consumers still tested a future feature after its source reader was implemented.","meant":"A complete diff may contain its own marker strings, and current feature tests must follow the source-reader contract while retaining generic future-consumer coverage.","changed":"Anchor outer markers; add payload and duplicate-block regression; update registry consumers and provide an explicit inventory input for advisory checks.","decision":"Apply the two required corrections and take their delta through the final combined Astra review.","evidence":["docs/control/local/reviews/WO-242/round-2-criteria.md","docs/control/local/reviews/WO-242/round-2-consistency.md","scripts/test-plan-first.mjs marker regression passed","scripts/test-features.mjs current and queued consumer check passed","scripts/test-harness-probe.mjs qualification check passed"],"rejected":["Escaping or omitting actual candidate bytes.","Leaving the feature registry pending to preserve obsolete tests.","Dropping future-consumer advisory coverage."],"reopenWhen":"An exact candidate payload still fails parsing, or a generated consumer retains the old feature contract."}
```

## WO-242-D017

The final combined Astra review confirmed the feature-consumer fixes but found
CR4 still reproduced with CR, U+2028 and U+2029 inside a diff line. JavaScript's
multiline anchors treat those characters as line boundaries; the Git patch
wrapper uses LF. Counting now splits only on LF, and extraction uses explicit
LF boundaries. The executor reviewed this last delta under the final-round rule.

The first expanded regression and the unmodified review probe then failed at a
different boundary: the unchanged outward screen refuses U+2028 and U+2029 as
`text.control-character`. The base's outward-lint.mjs contains that same rule.
All three payloads now pass exact proposal parsing; CR also records the proposal.
The two Unicode cases intentionally stop at the existing screen. Correct the
test's unconditional command-success assumption, preserve that screen, and
assert its specific refusal separately from parsing. The corrected regression
passes all four payload variants and duplicate-block rejection. The original
review probe and its observed screen failures remain in session scratch.

```json
{"id":"WO-242-D017","date":"2026-11-06","dispatch":"resume: next; final combined review correction","kind":"correction","misread":"JavaScript multiline boundaries were treated as Git patch LF boundaries; the expanded check then assumed that a correctly parsed Unicode payload must pass every later screen.","meant":"The wrapper delimiter is LF, while the independently required outward screen still judges the exact payload.","changed":"Use explicit LF boundaries and test parser acceptance independently from the existing control-character refusal.","decision":"Close the residual CR4 parser failure without weakening the outward screen, and judge the final delta locally after the last permitted review round.","evidence":["docs/control/local/reviews/WO-242/round-3-combined.md","scripts/lib/plan-first.mjs","scripts/test-plan-first.mjs expanded marker regression passed","base scripts/lib/outward-lint.mjs lines 739-742","unmodified combined R3 probe: CR records; Unicode cases now fail only the existing screen"],"rejected":["Using a broader regular-expression line definition for a byte-preserving patch wrapper.","Removing the existing control-character screen to make an unconditional probe assertion pass.","Launching another reviewer after the final round."],"reopenWhen":"A payload admitted by the screens is falsely rejected as another outer block, or a duplicate outer block is accepted."}
```

## WO-242-D018

The first complete review run stopped at configuration-root's structural
preflight. The new fixture and two retained probe scripts used literal document
paths. Replace those paths with the existing `docPath` and `docRelative` helpers;
do not exempt the new scripts from the guard. This repair changes 28 source
lines across three files and therefore starts its repair review at combined
round three under the standing under-fifty-line route.

I initially started the lifecycle regression while the configuration probe was
still running. Their recorded intervals overlap, so those are not used as
sequential validation evidence. Both were rerun in sequence: all 18
configuration-root tests and the one full-candidate lifecycle test passed.

```json
{"id":"WO-242-D018","date":"2026-11-06","dispatch":"resume: next; first complete-run repair","kind":"correction","misread":"New fixture and probe paths were left as fixed docs literals, and a running bounded probe was mistaken for a completed one before starting the next.","meant":"The control-plane path guard applies to these scripts, and bounded probes run one process at a time.","changed":"Use the shared path resolvers; repeat the configuration and lifecycle checks sequentially after the overlap.","decision":"Repair the named structural preflight failure, review the small repair delta, and run a fresh complete gate.","evidence":["first complete review tree 07f00fc105747af771230a977658f967579ff5ae: configuration-root literal-path failure","scripts/lib/plan-first-fixture.mjs","scripts/probes/wo242-controls.mjs","scripts/probes/wo242-plan-first.mjs","config-repair-1-sequential.log: 18 passed","fixture-repair-1-sequential.log: one passed"],"rejected":["Adding fixture/probe exceptions to the root guard.","Treating overlapped probes as the prescribed sequential validation."],"reopenWhen":"The complete gate finds another literal root or configured paths no longer reproduce the fixture workflow."}
```

## WO-242-D019

The second complete run cleared the configuration failure and then failed three
existing harness cases for ordered outside-write refusals and unreadable grants.
The new plan-first helper eagerly materialized all destinations before checking
the election. A later invalid path such as a child of the null device could
therefore throw before the existing guard judged an earlier ungranted write,
even with the feature off.

The helper now returns immediately when no plan-first refusal stands, before
inspecting destinations. When active, it iterates them in order within its own
error boundary. All three unchanged failing tests pass, as does the installed
target plan-first hook test. The default control adds a malformed-later-path case:
all eight absent/false hook comparisons match the base byte-for-byte. The three
existing projection/role controls are retained, for eleven control rows total.

```json
{"id":"WO-242-D019","date":"2026-11-06","dispatch":"resume: next; second complete-run repair","kind":"correction","misread":"Materializing every destination before the feature check was treated as harmless shared preparation.","meant":"The default mode must return before new processing, and a later unreadable path must not erase an earlier refusal.","changed":"Move destination inspection after the plan-first early return and retain ordered iteration inside its error boundary; extend base/current controls with a malformed later destination.","decision":"Restore default-mode refusal ordering and validate both existing and elected hook paths before the next complete run.","evidence":["second complete review tree 62d9ba62b02c96ea28afb3f5aae59b7b9cead17a: three WO-144 harness failures","scripts/test-harness.mjs unchanged null-discard, role-grant and unreadable-grant tests all passed","scripts/test-plan-first-boundaries.mjs installed target-hook test passed","docs/evidence/WO-242/controls.json: eleven equal controls"],"rejected":["Changing the three existing expected refusals.","Catching the eager scan failure outside the existing guard and thereby retaining the lost refusal.","Claiming the original simple controls covered malformed later paths."],"reopenWhen":"A disabled feature changes a hook judgment or a later destination prevents an earlier refusal."}
```

## WO-242-D020

The repair's final combined Astra review confirmed the three original failures
were fixed and found one new regression: looking up approval state before
classifying an effect could deny diagnostic reads when the dispatched order was
unavailable. The boundary now shares a small election predicate and loads the
approval state only after the destination iterator yields a real write. This
preserves the disabled feature's early return and the ordered refusal while
leaving reads, opaque commands and literal null discards available for diagnosis.

The new actual-hook regression passes with the election on and the order missing:
a Read, `pwd`, a null discard and an opaque command are admitted; a source Write
is refused specifically by the plan-first boundary. After this correction, the
three unchanged WO-144 cases and the installed target-hook test pass again in
sequence. All eight base/current hook controls remain identical. The executor
judged this last correction locally after the repair's final review round.

```json
{"id":"WO-242-D020","date":"2026-11-06","dispatch":"resume: next; second repair final-review correction","kind":"correction","misread":"Checking the full approval boundary before all effect classification was treated as equivalent to checking only the election.","meant":"The write boundary must leave diagnostic reads available when approval state is unavailable, while a disabled election must avoid new destination processing.","changed":"Extract the shared election predicate; lazily load approval state on the first actual write destination; add an actual-hook recovery regression.","decision":"Close R2C-1 with parent-reviewed code after the repair's final combined round, retaining both ordered refusals and diagnostic read admission.","evidence":["docs/control/local/reviews/WO-242/repair-2/round-3-combined.md: one new required finding","scripts/test-plan-first-boundaries.mjs missing approval-state regression passed","scripts/test-harness.mjs three unchanged WO-144 regressions passed sequentially after the final correction","scripts/test-plan-first-boundaries.mjs installed target-hook regression passed after the final correction","docs/evidence/WO-242/controls.json: all eight hook rows equal after the final correction"],"rejected":["Allowing every effect when approval state is unavailable would admit unapproved source writes.","Restoring eager destination materialization would revive the failed default-mode refusals.","Launching a fourth review round would violate the bounded review ladder."],"reopenWhen":"Missing approval state denies a diagnostic read, or a known source write bypasses the plan-first wait."}
```


## WO-242-D021

The third complete run passed the repaired harness suite, then failed the real
regeneration fixture: its release-surface child exceeded the fixed deadline.
The checker, its deadline and the fixture are unchanged from main. The gate row
records one shared slot, four peers at the fixture's start and a declared load
factor of sixteen. The unchanged exact test then passed in a bounded isolated
run in 0 h 4 min. The precise operating-system stall is unestablished; the
comparison supports removing peer contention from this fixed-deadline fixture,
not weakening the stale-output assertion or widening every command's bound.

The adjacent queue records this bounded scheduling repair as adjacent-0001.
The real inventory fixture now uses the existing exclusive admission with no
permitted overlap. Its source, assertions, child deadlines and product commands
are unchanged. The existing scheduler regression now includes this fixture and
passes, checking that its actual declaration reserves every lane and overlaps
no other task. This five-line source/test repair takes one combined final-round
Astra review before another complete run. Its tradeoff is an isolated fixture
interval in return for testing the same commands under the conditions their
fixed deadlines assume. Completion of the queue item still requires the full
review gate.

The first result watcher expired while the third gate continued. An attempted
extension exceeded the watcher's supported maximum and was refused; the next
watcher used its supported 1 h 0 min limit and retrieved the failed gate row.
These observer results remain in scratch and are not counted as additional
complete runs or product failures.

```json
{"id":"WO-242-D021","date":"2026-11-06","dispatch":"resume: next; third complete-run repair","kind":"correction","misread":"The real inventory fixture was scheduled like a lightweight shared task despite executing the complete check-and-regenerate sequence with fixed child deadlines.","meant":"The fixture must retain every real checker and assertion while its scheduler admission accounts for its execution conditions.","changed":"Use exclusive admission for sync-fixtures and exercise that actual declaration in the existing no-overlap scheduler regression.","decision":"Isolate the real regeneration fixture; preserve its fixed child deadlines and judge the next complete run at the resulting source identity.","evidence":["third complete review: tree 6db75e518bcea423507b61274dbf9a9b95a00d15, code eb4f64a9d33052f871152c90e34fcf46a2d7959da098db8a1ea347e52659e558, failedFirst sync-fixtures","scripts/test-sync.mjs:620 release-surfaces child timed out; nine other fixture cases passed","isolated exact unchanged test: exit 0, durationMs 282267","gate row: shared, reservedSlots 1, loadFactor 16, four peers at start","existing exclusive-scheduling regression including sync-fixtures: passed","adjacent-0001: actor-attested intent and message-boundary check-in before starting"],"rejected":["Increasing every artifact deadline without establishing which operation needs a different bound.","Accepting a timed-out checker as ordinary stale output.","Repeating the same shared scheduling without addressing the observed execution-condition difference."],"reopenWhen":"The isolated complete-run fixture still times out, or measured runtime supports a different admission without weakening its checks."}
```

## WO-242-D022

The fourth complete review run passed 119 of 120 tasks, including the isolated
regeneration fixture, and failed the export fixture's configuration assertion.
The exported example correctly contains a disabled plan-first election with a
purpose note, as implementation step 10 requires; the existing consumer still
expected the former boolean `false`. The second consistency review had named
this producer and consumer but incorrectly described those shapes as matching.

Keep the required example and correct the export assertion from the order's
contract. Check the disabled election and note separately: the note must be a
string describing the plan, diff and approval, while the remaining feature
values retain their existing exact assertions. This avoids pinning incidental
wording without losing the required note or off setting. The exact formerly
failing test passes in a sequential bounded run. This nine-line source/test
repair still requires its combined final-round review and a fresh complete run;
the passing focused test does not stand in for either.

```json
{"id":"WO-242-D022","date":"2026-11-06","dispatch":"resume: next; fourth complete-run repair","kind":"correction","misread":"The export fixture's boolean plan-first expectation was left unchanged and the consistency trace treated it as matching the new noted election.","meant":"Implementation step 10 requires the exported example to show plan-first off with a note; both the setting and the note must survive export.","changed":"Assert the disabled plan-first election and its purpose note separately, preserving the exact assertions for the other features.","decision":"Correct the stale expected data from the work-order contract and retain the required configuration example.","evidence":["fourth complete review: tree f46349de87f2e69b0b30394b4e5b7587dd0072c4, code d9682c98c821ceabfff462f73a21ff9ec6a350721f2f6bc36b4138ca385a4e6c, 119 tasks passed, one export task failed","scripts/kit/dotln.config.example.json: disabled plan-first election with purpose note","docs/work-orders/WO-242-plan-first-mode.md implementation step 10","scripts/test-launchpad-export.mjs configuration assertion in WO-074 criterion 1","docs/control/local/reviews/WO-242/round-2-consistency.md Kit delivery row","repair4-export.log: exact formerly failing test passed, exit 0"],"rejected":["Removing the note would violate the work order to satisfy a stale assertion.","Copying the current example into the expected value would not independently check its required meaning.","Changing unrelated feature assertions would widen this repair."],"reopenWhen":"The exported example loses the disabled election or its purpose note, or the fresh review or complete run finds a remaining mismatch."}
```

## WO-242-D023

The executor's manual worker ledger conservatively charges twenty uses against
the phase's twenty-use cap: two feedback launch attempts (including the first
attempt that stopped before its verifier ran), three first-round reviewers,
two first-round messages, five live-experiment uses, three second-round
reviewers, one context-restoration message, the initial combined third round,
and the three completed repair reviews. The native usage observation reports
zero observed admissions and an unknown remainder; it does not replace this
manual ledger or supply a new allowance.

The export repair is prepared and focused-tested before requesting one further
Astra review. That review would be use twenty-one. Preserve the work and the
failed complete rows; await the operator's explicit extension rather than
silently expanding the cap or treating the required independent review as an
executor check. No readiness event is recorded while that review and the
subsequent complete and document gates remain outstanding.

```json
{"id":"WO-242-D023","date":"2026-11-06","dispatch":"resume: next; worker-budget boundary","decision":"Prepare and check the export repair, then request one additional Astra review use before launching its required combined round.","evidence":["Manual session ledger: twenty charged launches or messages, including the failed feedback launch attempt","node scripts/harness.mjs usage: cap 20, zero observed admissions, uncounted remainder unknown","executor skill: explicit Codex session count, each launch or re-task charged, repair review required before the next complete run","WO-242-D022: prepared and focused-tested repair"],"rejected":["Treating the native observer's unknown coverage as a fresh budget.","Dropping the already charged failed launch attempt to evade the boundary.","Substituting the executor's own check for the required independent repair review."],"reopenWhen":"The operator authorizes one additional worker use for the prepared repair, or explicitly changes the review requirement."}
```

## WO-242-D024

The operator authorized the requested additional Astra review while asking why
execution had taken so long. The extension covers this prepared repair's one
combined final-round review, bringing the manual phase allowance to twenty-one
uses. It changes neither the global worker cap nor the still-available dispatch
time and complete-run allowances. The original message and the pending
request's context are retained in one ignored session capture; this record
synthesizes the authorization.

Most executor work time has been repeated full validation after missed
regressions and fixture assumptions. The third and fourth complete attempts
took 0 h 39 min and 0 h 52 min; the fourth passed 119 of 120 tasks. The export
assertion should have been corrected during the earlier consistency trace.
The automatic continuation repeated the pending budget question without new
operator authorization. Continue the remaining review and validation now under
the granted one-use extension, preserving those failures and their repairs.

```json
{"id":"WO-242-D024","date":"2026-11-06","dispatch":"resume: next; operator authorized one additional Astra review","decision":"Use one further dotln-worker-astra combined repair reviewer, for twenty-one manually charged phase uses, and continue the outstanding validation.","evidence":["Operator approval in reply to the explicit one-additional-review request; exact message and context in ignored session capture review4-authorization.json","WO-242-D023: manual twenty-use boundary","WO-242-D022: the prepared export repair and its passing focused test","complete-3-row-wait3.json and complete-4-row.json: retained failed-run durations and results"],"rejected":["Treating an automatic continuation prompt as budget authorization.","Expanding the repository-wide cap or interpreting this approval as unlimited worker use.","Repeating the permission request after the operator authorized the concrete next review."],"reopenWhen":"A different worker use becomes necessary beyond this one-review extension, or the operator changes the instruction."}
```

## WO-242-D025

The fifth complete review run passed all 120 tasks, but the subsequent document
gate failed its exported-guide inventory assertion. The guide correctly adds
the required Plan-first mode section immediately after First steps; the
document test still listed the old headings. The earlier consistency trace and
the executor's export repair missed this second consumer in the same file.

Add the required heading at its prescribed position in the expected inventory,
preserving the exact checks for every other section and for the pinned front
page. The provenance is implementation step 9 and criterion 9, not the failing
output alone. No guide or implementation change is needed. This one-line
document-test correction is parent-judged after the passing complete run,
when the standing procedure admits no further reviewer.

The code-identity implementation hashes the entire mixed test file, so this
correction also makes the previous product row historical for readiness. Run
the document gate to green at the repaired identity, then a fresh complete
review run. The document row can remain standing across the final updates to
this order's own handoff. Preserve every prior passing and failing row; neither
reclassify the mixed test file nor alter the guide to match the stale oracle.

```json
{"id":"WO-242-D025","date":"2026-11-06","dispatch":"resume: next; post-pass document-gate repair","kind":"correction","misread":"The exported-guide heading inventory was left at its prior shape while the same fixture's configuration assertion was corrected.","meant":"The required new guide section has a separate document-test consumer that must name it after First steps.","changed":"Add Plan-first mode to the expected guide-heading inventory at the position prescribed by implementation step 9.","decision":"Correct the one stale document assertion, pass the document gate, and refresh the complete product row because the mixed test file's bytes are part of its source identity.","evidence":["fifth complete review: 120 fresh tasks passed, tree 5281b7f1e26a2fb8861b14837c8cc9e264477062, code 480cf880b45024c47395e2a82d3e75c78eda44e46a3dae73489811fe1b2dd684","document-1-row.json: launchpad-docs failed; entropy unrun; 25 other suite aggregates passed","scripts/test-launchpad-export.mjs document guide inventory assertion","docs/work-orders/WO-242-plan-first-mode.md implementation step 9 and criterion 9","docs/KIT.md: Plan-first mode follows First steps","packages/skeleton/src/gate-evidence.mjs gateCodeIdentity: whole non-documentation source-file bytes"],"rejected":["Changing the guide's section hierarchy only to preserve the stale expected list.","Classifying a mixed product/document test file as documentation to retain a prior product row.","Starting another reviewer after the complete run passed.","Claiming the prior complete row covers changed test-file bytes."],"reopenWhen":"The corrected document gate or fresh complete run finds another concrete failure."}
```

## WO-242-D026 — Verification boards the approval an integrate-first fast-forward clears

```json
{
  "id": "WO-242-D026",
  "date": "2026-11-06",
  "dispatch": "resume: verify",
  "decision": "Record as a follow-up, not a blocking finding, that the executor's own integrate-first duty clears an approval the operator gave. After PlanApproved and application, a fast-forward of main into the order worktree that touches no candidate path moves HEAD, so planFirstView reports changed [\"base commit\"], the approval reads null, the hook refuses implementation writes again, implementation-ready is refused with DOTLN_PLAN_FIRST_REFUSED and the drive stops at awaiting-plan-approval. The route the refusal names, draft --new, clones the new HEAD without the applied working-tree change, so the renewed candidate's diff is empty and cannot show the change the operator approved. Criterion 2 requires that a moved base clear the approval, and the implementation does so as written; main had no plan-first workflow to regress. Planning receipt 064 records this as criterion 2's known issue, and its reopen condition (a fixture shows PlanApproved cleared by an integration after the approval) has now occurred; the 2026-10-30 pass recorded the reading that a clean integration keeps the approval, which the order's text never took in.",
  "evidence": [
    "docs/evidence/WO-242/ver-001/probes.mjs, test F1: after approval, application and a fast-forward of an unrelated main commit, planFirstView changed is [\"base commit\"] and implementation-ready prints DOTLN_PLAN_FIRST_REFUSED ... changed since proposal: base commit",
    "verifier scratch probe p1-integrate.mjs: status legal actions [next, plan-proposed], stop awaiting-plan-approval; draftPlanCandidate(renew) diff 0 bytes while the worktree keeps the applied greeting",
    "scripts/lib/plan-first.mjs planFirstView compares git rev-parse HEAD with PlanProposed.baseCommit; draftPlanCandidate clones the code root's committed HEAD",
    "scripts/lib/worktree-integration.mjs merges with --ff-only when the order branch is an ancestor of main, the ordinary case before final review",
    "docs/planning/refutations/2026-11-06-planning-92d06e6e83aa82b0-064.md criterion:2 known issue; docs/planning/passes/node24-features-config-plan-first-no-work-stream-2026-10-30.md receipt paragraph: a clean integration keeps it"
  ],
  "rejected": [
    {
      "option": "Judge criterion 2 unmet",
      "reason": "Criterion 2's text requires a moved base to clear the approval; the implementation holds it, and a planner's reading the order never adopted is not the criterion."
    },
    {
      "option": "Leave the observation in the report alone",
      "reason": "A defect met and not fixed is recorded with its follow-up and reproduction, and the receipt's reopen condition occurred."
    }
  ],
  "followup": "Keep a plan-first approval across a clean integration after application: when the order worktree moves only by an integration that leaves the approved diff applied and touches none of its paths, readiness and the hook keep the approval (binding it to the applied diff rather than the raw HEAD), while a conflicting or path-touching integration still requires a new proposal whose candidate carries the applied change; test F1 of docs/evidence/WO-242/ver-001/probes.mjs passes.",
  "reopenWhen": "An elected order is refused implementation-ready after an integration with an unchanged proposal, or the follow-up is selected."
}
```

## WO-242-D027 — Verification boards the router role's stop list that omits the plan-approval stop

```json
{
  "id": "WO-242-D027",
  "date": "2026-11-06",
  "dispatch": "resume: verify",
  "decision": "Record as a follow-up that the router role text, with the election on or off, enumerates its stops (awaiting-merge, operator-finding, off-ramp, typed-correction, analysis, operator-override, dispatch-refused, the failure counts and budget-exhausted) and later names awaiting-close, but never names awaiting-plan-approval, the reason routeOrder now returns after PlanProposed. The drive itself stops correctly and its next text tells the operator what to do, so criterion 7's fixture holds; the role text is the only surface that lags. Planning receipt 064's criterion 7 known issue reopens when the stop after PlanProposed reports a reason outside the drive's enumerated stops, which is the observed state.",
  "evidence": [
    "docs/evidence/WO-242/ver-001/probes.mjs, test F2: harnessInstallation with features.plan-first true renders .agents and .claude dotln-router/SKILL.md without awaiting-plan-approval",
    "scripts/lib/drive-route.mjs routeOrder: stopped(\"awaiting-plan-approval\", ...) while active, proposed and unapproved",
    "scripts/test-plan-first.mjs router fixture: driveLoop stops with reason awaiting-plan-approval after one launch"
  ],
  "rejected": [
    {
      "option": "Judge criterion 7 unmet",
      "reason": "Criterion 7 names the router step and its fixture, a worker ending after PlanProposed not followed by another until PlanApproved, which holds; the role text's list is outside its words and main had no such stop."
    }
  ],
  "followup": "Name awaiting-plan-approval in the router role's stop list beside awaiting-close, stating that the operator answers and resumes the executor before driving again; test F2 of docs/evidence/WO-242/ver-001/probes.mjs passes.",
  "reopenWhen": "A driven router reports an awaiting-plan-approval stop as unexpected, or the follow-up is selected."
}
```

## WO-242-D028 — Verification boards canonical status failing for every order when one elected target order lacks its registration

```json
{
  "id": "WO-242-D028",
  "date": "2026-11-06",
  "dispatch": "resume: verify",
  "decision": "Record as a low-severity follow-up that, with plan-first elected, an active target order whose target-worktree registration is absent makes npm run resume -- status --json exit 1 for all orders with plan-first requires the order's registered target worktree, because legalActions and the projections call planFirstView, which calls planFirstContext and throws. The same fixture with the election off answers with exit 0. The input is constructed (the verifier removed the ignored local registry), so it is a follow-up by rule; status is every role's entry point, so it should degrade to a named unavailable plan-first view for that order instead of refusing the whole fold. The hook's fail-closed refusal for that order is correct and unaffected.",
  "evidence": [
    "docs/evidence/WO-242/ver-001/probes.mjs, test F3: status --json exits 1 after removing docs/control/local/target-worktrees.json from an elected target fixture",
    "verifier scratch probe p3-unregistered-off.mjs: the same fixture exits 1 elected and 0 with the election false",
    "scripts/lib/plan-first.mjs planFirstContext throws when targetWorktreeForOrder finds no registration; scripts/resume.mjs legalActions and projectOrder call planFirstView for every active order"
  ],
  "rejected": [
    {
      "option": "Block criterion 1 or 2",
      "reason": "Criterion 1 judges the election off, which answers; the missing registration is outside the supported vocabulary, and main had no plan-first view to regress."
    }
  ],
  "followup": "Make planFirstView report an unavailable plan-first state for an order whose plan-first context cannot be resolved, so canonical status answers for every order while that order's hook and helpers keep refusing; test F3 of docs/evidence/WO-242/ver-001/probes.mjs passes.",
  "reopenWhen": "A supported workflow leaves an active elected target order without its registration, or the follow-up is selected."
}
```

## WO-242-D029 — Verification boards the untested plan-first refusal at the source-change apply boundary

```json
{
  "id": "WO-242-D029",
  "date": "2026-11-06",
  "dispatch": "resume: verify",
  "decision": "Record as a test-coverage follow-up that SourceChangeHost's new plan-first refusal before importCandidate has no fixture. The Design names it as one of the in-process helper boundaries that hold on every host, but no test under packages/skeleton/test or scripts names plan-first beside SourceChangeHost, and the first consistency review recorded that no test or live-hook probe was run for it. Criterion 3's helper clause is met by the plan-first candidate's own apply helper and implementation-ready, which are tested; the source-change route is a second apply path whose refusal is read from source only.",
  "evidence": [
    "packages/skeleton/src/source-change-host.ts: planFirstBoundary(launchpadCheckout, workOrderId) refusal before check(\"import\")",
    "grep for plan-first or planFirst in packages/skeleton/test: no match",
    "docs/control/local/reviews/WO-242/round-1-consistency.md approval-freshness row: no test or live-hook probe was run here"
  ],
  "rejected": [
    {
      "option": "Judge criterion 3 unmet",
      "reason": "Criterion 3's helper clause names applying the plan-first candidate and implementation-ready, both covered by scripts/test-plan-first.mjs; the source-change helper is an additional boundary the criterion does not name."
    }
  ],
  "followup": "Add a SourceChangeHost fixture with plan-first elected that refuses the apply before a proposal and while one awaits, admits it after approval of the current proposal, and leaves the election-off path unchanged.",
  "reopenWhen": "A source-change apply proceeds without a standing approval while plan-first is elected, or the follow-up is selected."
}
```

## WO-242-D030 — Final review: the judgment, one guide sentence and no source change

```json
{
  "id": "WO-242-D030",
  "date": "2026-11-07",
  "dispatch": "resume: final review; the judgment of WO-242 through VER-001, allocated FINAL-001",
  "decision": "Pass WO-242 at code identity 44440e885ce4d30a41c1238cdb986e6c74c8789091ff0084bf91e06aecced8d4, the identity of the complete review row recorded 2026-11-07T02:57:07.633Z and of VER-001's subject, recomputed here before this review's edits. Main and the worktree's merge base stand at the activation base 62b0332abd0e87cbe940c8f392b00586aee6fa33 and the branch carries no commit, so npm run worktree -- integrate WO-242 took in nothing. Criteria 1, 2, 3, 5, 6, 7, 9 and 10 are met on the verifier's probes re-run here, the standing checks and the row; criterion 8 is met on the live record and the novice reading VER-001 made of it; criterion 4 carries its defect record (contradiction, ordinal 4) with this review's own evidence for the class. The four verifier follow-ups stay boarded with their reproductions and this review takes none of them as a source change. Two findings of its own, both follow-ups: the kit guide did not tell the operator that the executor's own integration of main after approval clears the approval, repaired here with one sentence of §Plan-first mode linking D026, a document change that moves no code identity; and the hook's election reader disagrees with the lifecycle's on a malformed election, boarded as D032 with its reproduction.",
  "evidence": [
    "node <session scratch>/gate-audit.mjs: codeIdentity 44440e885ce4d30a41c1238cdb986e6c74c8789091ff0084bf91e06aecced8d4; six rows at it, among them the npm test review row of 2026-11-07T02:57:07.633Z (46 required suites, 120 tasks, exit 0, 3,231,949 ms) and the document rows of 02:02:06Z and 03:23:45Z.",
    "git rev-parse main HEAD and git merge-base main HEAD: all 62b0332abd0e87cbe940c8f392b00586aee6fa33; git log main..HEAD empty; npm run worktree -- integrate WO-242: integration took in nothing, the worktree is not behind main.",
    "node scripts/harness.mjs bounded -- node --test docs/evidence/WO-242/ver-001/probes.mjs: C2, C4 and C5 passed; F1, F2 and F3 failed as their header says they must until their follow-ups are taken, F1 at changed [\"base commit\"], F2 at the router root naming no awaiting-plan-approval stop, F3 at status exit 1.",
    "node scripts/harness-context.mjs --check: executor 44,358 bytes with the election off against the 51,226-byte acceptance, verdict accepted; the verifier, reviewer, release-close, planner, refuter and router breaches pre-date this order (WO-257-D007) and no role byte of theirs changed here; docs/evidence/WO-242/cold-start.json: 47,593 bytes with the election on in both roots.",
    "node scripts/harness.mjs check: 43 generated surfaces; npm run publication:check before and after the guide sentence: 256 of 256 headings, 29 and 45 linked sections current; npm run plan -- documents paged to its end: 338 standing, 5,500 record and 16 generated documents, 324 unread rows and no red tag; npm run work-orders -- index --check, npm run release -- check-surfaces --local, npm run format:check and git diff --check clean.",
    "Criterion 4: docs/work-orders/WO-242-plan-first-mode.md criterion 4 names the target closeout sentence and the Deliverables line repeats it, while the Known issues carry-in for FUP-d1b15b1b3e4dc761 states that the closeout sentence for target orders is WO-243's and that this order no longer carries it; docs/work-orders/WO-243-closeout-checks-follow-the-repositories-an-order-changed.md owns the executor, fix and reviewer closeout sentences; docs/planning/refutations/2026-10-30-planning-46c0f753031f2f52-060.md criterion:4 known issue: an unconditional sentence breaks criterion 1's byte-identical off case and one naming checks collides with WO-243's selection, to be struck at activation, which left the words; every other clause holds on probe C4 and cold-start.json.",
    "Criterion 8: docs/evidence/WO-242/live-conversation.json: classification live model executor conversation in the parent executor session, four scripted operator turns (a request, a trailing-newline question, the correction to Welcome, friend., Looks good, build it.), executor dotln-worker-astra at gpt-6-astra max by operator attestation with no effective readback, bytes per turn 10,472, 14,384, 18,294 and 19,906, workMs 260,215, waitingMs 145, usage unavailable (no-session) with the parent dispatch counter labeled separately, approvalRefresh with byte-identical diff, plan and proposal digests, application of exactly 17 bytes with appliedDiffMatchesApproved true, the turn-4 driver intervention and the hostBoundary matrix; docs/verifications/WO-242/VER-001.md criterion 8: the newcomer reading with seven usability limits and no reduced-burden claim.",
    "docs/KIT.md §Plan-first mode: one sentence added after the renewed-approval sentence stating that the executor's integration of main before its complete run moves the base and asks for the unchanged proposal's approval again, linking D026; npm run publication:check passed after it.",
    "docs/control/orders/WO-242.jsonl: WorkOrderActivated 2026-11-06T21:05:48Z, ImplementationReady 2026-11-07T02:58:48Z with criteria 4 and 8 unmet, VerificationRequested 03:01:19Z, CriterionDefectRecorded 03:19:04Z, VerificationCompleted 03:24:02Z pass with report hash sha256:4997e7c69ae47da6317e0d1cbdde2333bcf86746ad8b1d499b5eda5ce7537db7, FinalReviewRequested 04:57:55Z."
  ],
  "rejected": [
    {
      "option": "Take F2 of VER-001 (one sentence in the router role's stop list) or F4 (a SourceChangeHost fixture) in this review",
      "reason": "Either edit moves the code identity, owes a 0 h 54 min complete run and the repair's own review round, and reaches the merge without independent verification; both are boarded with reproductions and repair rules for the order that takes them."
    },
    {
      "option": "Take F1 of VER-001, binding the approval to the applied diff across a clean integration",
      "reason": "A design change to the approval's binding, outside a final review's authority and the Boy Scout bound; the guide now tells the operator what happens until it lands."
    },
    {
      "option": "Return the order to repair for the guide gap",
      "reason": "One sentence in a declared write-back surface, repairable within the final review's document authority without moving the code identity; a repair dispatch would cost a cycle for a replacement this review can make and record."
    },
    {
      "option": "Leave the guide as written",
      "reason": "An operator who elects the mode would meet the second approval request unexplained; a standing document holds the current state for its reader and the account stays in D026."
    }
  ],
  "reopenWhen": "An elected order's operator reports the re-approval after integration as a blocker before FUP-82ea384c08d3135a is taken, the next final review finds the guide's sentence stale after that follow-up lands, or a planning pass reads the criterion 4 record as needing retraction."
}
```

## WO-242-D031 — Final review: the matched follow-up rows, one deferred again with its met condition

```json
{
  "id": "WO-242-D031",
  "date": "2026-11-07",
  "dispatch": "resume: final review; the follow-up register's rows touching this change",
  "decision": "npm run plan -- followups --touching --work-order WO-242 at register revision ade9fde37d0e7eddc026e8c88a7253980051618e825ede72e12be9abfe3121a7 listed 275 pending rows with 8 matched, all read. One is deferred again with its met condition named: FUP-1fa649b8d330505b, WO-255-D022's third Traced consumers row, whose condition occurred a third time on this order when the fifth complete run passed and the first document gate failed on the hand-written heading inventory in scripts/test-launchpad-export.mjs that two consistency reviews and the export repair did not trace (D025). The seven others are left as they are: FUP-048618f9ee2eb349 and FUP-2fe2709d9b33c9e7 wait for the next target-lifecycle order and the next edit of target-commit-lint.mjs, neither this order; FUP-17ea51254e5a7256 waits for a second gate failing on a sleep, and D021's child timeout was not one; FUP-1b94e79e02e54e70 names scripts/lib/outward-lint.mjs, which this order did not edit, since its selection lives in the command script scripts/outward-lint.mjs; FUP-2ce66cf6a0602982 names the planner's and the entropy review's transport launches, while this order's twenty-one uses were Codex launches counted by the executor's own ledger under the role rule (D023, D024); FUP-369525016cc270e1 names a reused row passing over a changed input, and this order's budgets acceptance (D009) was recorded before its complete runs; FUP-589642d0e0c714c8 names two functions of harness-host.ts this order did not touch.",
  "evidence": [
    "npm run plan -- followups --apply docs/control/local/followup-request.json: one request applied, deferred, revision 4855abf81f8d688ae2b6ec6f4d35fcbbd523689d63468593542f0222d5890a62.",
    "docs/evidence/WO-242/decisions.md D025: the exported-guide heading inventory was left at its prior shape while the same fixture's configuration assertion was corrected; D021: the third complete run's sync-fixtures child exceeded its fixed deadline under shared admission, with no sleep recorded.",
    "git diff main --stat: scripts/outward-lint.mjs changed, scripts/lib/outward-lint.mjs and scripts/lib/target-commit-lint.mjs unchanged; packages/skeleton/src/harness-host.ts changed in harnessFeedbackFacts, planFirstWriteResponse, evaluateHarnessHook and runTargetHarnessHook only."
  ],
  "rejected": [
    {
      "option": "Settle FUP-1fa649b8d330505b here",
      "reason": "The row asks a planning pass to allocate a review-brief row; a final review cannot allocate it and records the third occurrence for that pass."
    },
    {
      "option": "Dispose the seven textual matches",
      "reason": "A textual match is a pointer for judgment, not a condition; none of their conditions occurred on this order."
    }
  ],
  "reopenWhen": "A planning pass allocates the third Traced consumers row, or a fourth order's complete or document gate fails on a hand-written inventory its consistency review did not trace."
}
```

## WO-242-D032 — Final review boards the hook's election reader that disagrees with the lifecycle's on a malformed election

```json
{
  "id": "WO-242-D032",
  "date": "2026-11-07",
  "dispatch": "resume: final review",
  "decision": "Record as a follow-up that the hook's election reader, planFirstElected in packages/skeleton/src/plan-first-boundary.ts, reads dotln.config.json itself and accepts true or an object with a truthy on, while the lifecycle's readFeatures in scripts/lib/features.mjs reads the same key through the registry's election rule and refuses anything else as an invalid configuration. A malformed election the lifecycle refuses (\"on\", \"true\" or 1) reads as not elected in the hook, so the hook makes no plan-first judgment and admits an executor's source writes while every lifecycle command refuses the configuration; {on: \"true\"} and {on: 1} read as elected in the hook while the lifecycle refuses them; null and unparsable JSON throw in both and the hook fails closed. The input is outside the supported vocabulary, which WO-241 refuses at load, criterion 3 judges supported elections and holds, and main had no plan-first judgment, so this is a follow-up by rule. Receipt 064's criterion 3 known issue named this reopening observation, and VER-001's tried variations did not include a malformed features section.",
  "evidence": [
    "docs/evidence/WO-242/final-001/probes.mjs, test F2: for \"on\", \"true\" and 1 readFeatures refuses and planFirstElected returns false; for {on: \"true\"} and {on: 1} readFeatures refuses and planFirstElected returns the truthy on; for null both throw; test C3: both readers agree on true, false, {on: true}, {on: false, note} and an absent section.",
    "packages/skeleton/src/plan-first-boundary.ts planFirstElected: feature === true || (typeof feature === \"object\" && feature.on); scripts/lib/features.mjs readFeatures: election(config.features[entry.id]) after loadConfig, which refuses the malformed value.",
    "docs/planning/refutations/2026-11-06-planning-92d06e6e83aa82b0-064.md criterion:3 known issue: the order does not say how the judgment behaves when the features configuration cannot be loaded; reopen when a fixture with a malformed features section shows the hook admitting source writes with plan-first on or refusing writes with plan-first off."
  ],
  "rejected": [
    {
      "option": "Make the hook's reader throw on a malformed value in this review",
      "reason": "A source edit moves the code identity, owes a 0 h 54 min complete run and the repair's own review round, and reaches the merge without independent verification; the repair is a few lines for the order that takes it."
    },
    {
      "option": "Judge criterion 3 unmet",
      "reason": "Criterion 3 names the election on and the supported states; a malformed election is a constructed input outside the supported vocabulary, which product 07 routes to a follow-up."
    }
  ],
  "followup": "Make the hook's plan-first election reader refuse exactly what the lifecycle's readFeatures refuses, by reading the election through the same election rule or by throwing on any value other than a boolean or an object whose on is a boolean, so the existing boundary fails closed for writes; test F2 of docs/evidence/WO-242/final-001/probes.mjs passes.",
  "reopenWhen": "An instance with a malformed plan-first election sees an executor write admitted while its lifecycle commands refuse the configuration, or the follow-up is selected."
}
```
