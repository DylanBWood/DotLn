# WO-054 decisions

## WO-054-D001

```json
{
  "id": "WO-054-D001",
  "date": "2026-09-18",
  "dispatch": "resume: next",
  "decision": "Add a sealed worktree-snapshot profile with a closed WorkOrder contract and host-run named tests in fresh confined copies; preserve legacy verification semantics and the common acceptance fold.",
  "evidence": [
    "docs/work-orders/WO-054-verification-over-real-worktree.md",
    "docs/product/02-domain-model.md#independent-verification-v1",
    "docs/product/03-architecture.md#ports-what-keeps-work-flavored-verticals-pluggable",
    "packages/skeleton/src/source-change-worktree.ts",
    "packages/skeleton/src/discovery-sandbox.ts",
    "packages/compiler/test/verification.test.ts"
  ],
  "rejected": [
    { "option": "NoOp", "reason": "The real source-change handoff would still lack host-run verification evidence." },
    { "option": "Trust the worker testAfter or let the verifier execute arbitrary commands", "reason": "Neither supplies the bounded independent host witness required by the order." },
    { "option": "Execute tests in a shared Git worktree", "reason": "Files-only copies avoid exposing writable shared Git metadata." },
    { "option": "Make legacy compilation reject extra narrative fields", "reason": "Existing WO-010 fixtures require positive projection; strict refusal belongs to the new profile." }
  ],
  "reopenWhen": "A real target exceeds the documented text/command/confinement bounds, or independent verification finds a missing fidelity, authority or compatibility boundary."
}
```

Operator dispatch: `resume: next`, 2026-09-18. Sources: the selected
[order](../../work-orders/WO-054-verification-over-real-worktree.md), product
02 §Independent verification v1, product 03 §Ports, and the existing compiler,
verification host, WO-052 source-change fixture and discovery sandbox.

The mission contribution is an independently evidenced source-to-deliverable
loop: WO-052's committed target can supply a blinded verifier with actual test
results. NoOp leaves that critical-path handoff synthetic-only. Choose an
additive `worktree-snapshot` profile with a closed WorkOrder contract projection,
the declared base and observed commit, complete bounded text-file inventory,
modes, diff, named tests and a content seal. Host tests execute in separate fresh
copies with the existing macOS sandbox policy; the verifier retains no tools.
Missing confinement is unavailable, never an unsandboxed fallback. This is the
order's first-proof isolation, not a hostile-process security guarantee.

Preserve legacy positive construction and the acceptance fold. Existing WO-010
tests require extra implementer context to be discarded; the new profile instead
refuses extra fields with their schema path. A superficial passing test alone
cannot justify a failing finding under the existing result validator: the
planted fixture also needs a genuinely failing, contract-focused named test.
Reject arbitrary verifier commands and implementer `testAfter` evidence.

Policy resistance / fixes that fail: keep the legacy profile and common result
rules intact. Commons: bounded files, subprocess duration and output limit
resource cost; token/cost counters were unavailable at entry. Drift to low performance:
prove actual confined subprocess effects and adverse findings. Escalation:
reuse the existing sandbox and matrix instead of another evaluator or gate.
Success to the successful: compare snapshot copies with shared Git worktrees;
copies avoid writable shared Git metadata during tests. Shifting the burden:
the host checks snapshot integrity and commands, reducing manual reconstruction.
Rule beating: hash checks, strict fields and negative-witness checks prevent
greenwashing. Seeking the wrong goal: the deliverable is a consumable profile,
not more receipts. Naive Interventionism: preserve useful legacy semantics,
bound the text-only profile, isolate execution from the read mount, and first
probe with scratch repositories and verifier doubles. Reopen for real target
requirements beyond these bounds or a measured confinement/compatibility defect.

This decisions file and generated index discharge the pre-2026-09-09 order's
legacy ledger duty under the executor skill; no ideation-ledger edit is needed.

Read-only design audits found and corrected four initial gaps: option-looking
executable names, incomplete declared-criterion coverage, writable snapshot
permissions, and an example worker that had not received the verifier's contract.
Tests now exercise these boundaries. Empty-directory tampering also refuses.
The source worker receives the same contract while retaining its deliberately
superficial focused test. The failing independent command supplies real adverse
evidence; the verifier double does not invent it.

New implementation inputs: `source-change-fixture.ts`, `source-change-host.ts`,
`discovery-sandbox.ts`, `discovery.test.ts`, `worker-store.ts`, the existing
verification fixture, and the evidence/release preparation scripts. Compiler
`0.14.0` and skeleton `0.26.0` are additive minor changes; application target is `v0.30.0`. Kernel, console and external
dependency selections remain unchanged. Component identity changes require new
artifact/verification/feedback editions and regenerated bundle pins.

The first release-preparation invocation rejected this receipt's prose-only
format. The checked parser requires a JSON decision entry, now supplied above;
the prose rationale remains. This was a receipt formatting error, not a product
or authority change.

## WO-054-D002

```json
{
  "id": "WO-054-D002",
  "date": "2026-09-18",
  "dispatch": "scope expand:",
  "decision": "Add a distinct Codex post-compaction continuation adapter for the existing saved session and unfinished work order, with compact context restoration and one automatic premature-stop retry; keep lifecycle dispatch, writer ownership and operator interruption independent.",
  "evidence": [
    "docs/work-orders/WO-054-verification-over-real-worktree.md#operator-scope-expansion--2026-09-18",
    "packages/skeleton/src/harness-host.ts",
    "packages/skeleton/src/loadouts/contributor.ts",
    "https://learn.chatgpt.com/docs/hooks"
  ],
  "rejected": [
    { "option": "NoOp or only stronger role wording", "reason": "The operator reports an actual idle continuation despite existing role duties, and no Codex native hook currently restores saved task state." },
    { "option": "Reuse Claude dispatch and finish hooks", "reason": "The existing finish path releases the writer; redispatch would alter lifecycle state instead of restoring context." },
    { "option": "A polling daemon, repeated unbounded Stop retries, or a new worker", "reason": "They add ongoing cost or duplicate ownership when a native one-shot continuation is sufficient to test the reported failure." }
  ],
  "reopenWhen": "The installed native probe cannot deliver context or continuation, or a recorded session still idles after the bounded retry. Do not claim native behavior from synthetic tests."
}
```

The operator explicitly expanded the active implementation after reporting that
Codex can answer an old side question following compaction and then remain idle.
The checked contributor profile has no observed generic Codex hook bridge. The
official hook contract distinguishes `PostCompact` notification from immediate
developer context through `SessionStart` with `source: compact`; synchronous
`Stop` can create a continuation prompt. The [native probe](codex-continuation.md#native-probe)
observed project-local hook loading, compact context delivery and a continued
model turn without an external wake-up on Codex CLI 0.155.0. Tagged source shows
linked worktrees obtain hook definitions from the root checkout; activation also
requires native hook trust. Current desktop activation is not established.
The scope is project-local generated support, with no global account settings.

This pays for recurring manual wake-up and lost task continuity on the same
source-to-deliverable path. Policy resistance/fixes that fail: keep explicit
pause, interruption and recovery controls decisive. Commons: one continuation
per compaction, bounded metadata and no polling. Drift: require native delivery
evidence. Escalation: add a narrow adapter rather than another process. Success
to the successful: preserve historical unavailable-hook observations instead of
relabeling them. Shifting the burden: restore canonical task facts automatically.
Rule beating: session/order/writer identity and completion checks scope the retry.
Wrong goal: continue the authorized task, not all chat turns. Naive Interventionism:
do not replay dispatch, release the writer, or install unrelated Codex guards.
The scoped automatic continuation is an operator-authorized exception to the
otherwise advisory Stop behavior; it introduces no new tool or write refusal.

The native generated-policy probe subsequently restored the fixture work-order
ID omitted from the user prompt, continued after Stop, and completed its pending
file write without an external wake-up. Read-only review found and corrected a
pause/compaction race and contributor-only capability inheritance into target
workers. A separate suspension file, late control rechecks and worker-profile
exclusion address those defects. Focused tests cover these boundaries; the
compiled helper is runtime-pinned and the generated entry is installation-hashed.
No wall-clock, token or cost reduction is inferred from the successful behavior.

Correction to the earlier conversation handling: treating `conversation only:`
as a reason to stop the active implementation was wrong. The checked executor
skill says it answers without pausing work; only an explicit pause/stop interrupts.
The operator's `GO` resumed execution. The new continuation context preserves
that distinction after compaction instead of treating an old side question as
completion. New inputs are the official native hook contract, tagged 0.155.0
loader/runtime sources, native capability and generated-policy probes, and the
existing session/writer/control implementation.

## WO-054-D003

**Status correction:** the initial keyword-based F2 proposal below was withdrawn
in D004 and superseded by D005. It was edited and built,
but was not regenerated into the installed bundle, verified or handed off.
The independent format and documentation repairs remain in scope.

```json
{
  "id": "WO-054-D003",
  "date": "2026-09-18",
  "dispatch": "resume: fix",
  "decision": "Repair VER-001 F1/F2/F4 with the existing generated-code format exemption, bounded explicit-stop recognition and independent stop suspension; correct F3/F5/F6/F7 documentation to the observed boundaries.",
  "evidence": [
    "docs/verifications/WO-054/VER-001.md",
    "packages/compiler/src/codex-continuation.mjs",
    "scripts/test-codex-continuation.mjs",
    "packages/skeleton/src/verification-worktree.ts",
    "packages/skeleton/src/reactor.ts",
    "packages/compiler/src/verification.ts"
  ],
  "rejected": [
    { "option": "NoOp", "reason": "Generated code breaks the document gate and ordinary stop directives fail to suspend continuation." },
    { "option": "Format emitted hook bytes independently", "reason": "It breaks the installation hash; generated Claude hooks already use the shared formatter exemption." },
    { "option": "Treat any mention of stop as interruption", "reason": "Questions and negated directives must not silently suspend authorized work." },
    { "option": "Remove the sandbox launch heuristic or narrow it to exit codes 65/71", "reason": "Removal breaks the existing missing-command unavailable result; narrowing still cannot distinguish hostile target stderr/status from the launcher. Disclose the limitation rather than claim an unproved boundary." },
    { "option": "Change VerificationOpened validation in this repair", "reason": "The existing positive projection keeps the capsule blind; the defect is a broader documentation claim. Event-envelope validation would change a separate established boundary." }
  ],
  "reopenWhen": "A required ordinary stop form is missed, a non-directive is wrongly suspended, the format regression fails on another generated root, or a real target needs trustworthy launcher attribution or closed event-envelope validation. Native interruption delivery remains a separately unobserved capability."
}
```

The mission contribution remains reliable operator flow and independent
verification on the source-to-deliverable path. F1 makes the existing document
gate usable; F2/F4 keep explicit interruption stronger than automatic assistance.
The read-only repair audit agrees with the verifier on these defects. Normalize
the right typographic apostrophe, recognize the documented leading directives
with bounded interjections and punctuation, and retain anchoring. Recovery
`off` ends recovery mode; it does not authorize resuming an earlier stop.

Policy resistance/fixes that fail: preserve generated byte identity and separate
stop/recovery state. Commons: one read-only helper, no descendants; focused
regressions precede one current-code product gate. Drift and rule beating:
test every reported stop form, later-turn persistence, non-directive controls
and the emitted entry, not only the source helper. Escalation and shifting the
burden: reuse existing policy and prevent another manual wake-up after a stop.
Success to the successful: compare formatting the emitter and disabling
continuation; neither is necessary for these bounded defects. Wrong goal:
preserve task completion under operator control rather than maximize continuation.
Naive Interventionism: retain useful missing-command classification and legacy
event projection, correct their claims, and leave historical native receipts
unchanged. NoOp on code for F3/F5/F6/F7 is deliberate; precise disclosure is the
bounded repair, reopened by the conditions above.

Same-day correction: the original prose overstated strict event-field rejection,
legacy extra-field compatibility, direct-read confinement and native interruption
coverage. Checked compiler, reactor, sandbox adapter and native event records
establish the narrower claims now documented. New repair inputs are VER-001,
the format policy, Codex policy tests and the existing event projection. The
existing native probe hashes identify the pre-repair implementation, not the
regenerated bytes. No new native interruption or desktop activation claim is made.

## WO-054-D004

```json
{
  "id": "WO-054-D004",
  "date": "2026-09-18",
  "dispatch": "resume: fix; operator conversation-only correction",
  "decision": "Withdraw the expanded natural-language keyword parser as the proposed repair. Record the unnecessary detour and obtain the operator's intended continuation behavior before implementing a replacement.",
  "evidence": [
    "docs/verifications/WO-054/VER-001.md#f2--major-common-explicit-stop-wordings-do-not-suspend-codex-continuation",
    "packages/compiler/src/codex-continuation.mjs",
    "scripts/test-codex-continuation.mjs",
    "https://learn.chatgpt.com/docs/hooks#stop",
    "https://learn.chatgpt.com/docs/hooks#interrupt"
  ],
  "rejected": [
    { "option": "Keep extending stop/pause/cancel and no/actually keyword patterns", "reason": "It guesses operator intent from an arbitrary vocabulary. Passing the verifier's examples does not make the design sound." },
    { "option": "Infer the operator's choice from an ambiguous yes", "reason": "Two different continuation designs were offered. Choosing one without clarification would repeat the reported error." }
  ],
  "reopenWhen": "The operator clarifies whether automatic restart remains required and how pause/resume intent should be recorded; preserve pending work and do not claim the repair complete meanwhile."
}
```

The operator requested this note during the 2026-09-18 repair. Their actual
problem was unfinished work being lost after compaction. They had not issued a
stop instruction. The implementation introduced a speculative natural-language
stop detector to constrain its new automatic continuation. When VER-001 exposed
missed phrasings, the fixer enlarged the regex with punctuation, typographic
apostrophes and leading words such as `no` and `actually`, and added tests around
that vocabulary. That was the wrong abstraction: source code was guessing at
conversational intent. The verifier's concrete examples were defect evidence,
not operator authorization for a language-parser design.

The fixer failed to request the missing behavioral detail before assuming a
solution and editing it. It should have explained the distinction between
restoring task context and forcing another turn, checked native interruption
signals, and clarified the desired behavior where those signals do not resolve
intent. The subsequent official hook check found a native `Interrupt` event,
but no semantic stop-reason input on `Stop`; typed prompts are text, not a
structured pause decision. That gap cannot honestly be filled by a growing
keyword whitelist.

The subsequent questionnaire also offered implementation alternatives before
eliciting the concrete failure sequence. That offloaded the wrong decision to
the operator and required another correction. The operator's later description
of the actual sequence, not an answer to those options, determines D005.

The detour consumed edits, regression-writing, a build and operator attention.
No exact token or wall-clock cost for the detour was measured. No installed
hook regeneration, native probe, passing repair gate or completion transition
occurred for the rejected repair. The independent format exemption was checked;
bundle consistency after the source build still requires regeneration. Work
is preserved. Two alternative designs were presented; the operator's `yes`
did not distinguish them, so a focused clarification remains pending.

Correction to D003's framing: the original parser was not a response to this
operator asking to stop. Treating hypothetical protection as the immediate
product problem displaced the actual compaction-continuity objective. The
repair must return to that objective with a clarified design, rather than
claiming success because a larger list of phrases passes tests.

## WO-054-D005

```json
{
  "id": "WO-054-D005",
  "date": "2026-09-18",
  "dispatch": "operator clarification during resume: fix",
  "decision": "Keep compaction task restoration and its bounded automatic wake-up for the observed old-message-reply then idle failure. Remove conversational parsing, the separate pause latch and the custom Interrupt hook; preserve existing native interruption and explicit recovery controls.",
  "evidence": [
    "docs/work-orders/WO-054-verification-over-real-worktree.md#operator-scope-expansion--2026-09-18",
    "docs/evidence/WO-054/decisions.md#wo-054-d004",
    "https://learn.chatgpt.com/docs/hooks#stop",
    "https://learn.chatgpt.com/docs/hooks#interrupt"
  ],
  "rejected": [
    { "option": "Either option in the fixer's ambiguous questionnaire", "reason": "The operator explicitly did not approve either. Their subsequent concrete description, not an inferred yes, supplies the correction." },
    { "option": "Add a new model-managed pause/resume protocol", "reason": "It continues the speculative detour; the stated defect is an unfinished work order going idle after compaction." },
    { "option": "Restore context but remove the automatic wake-up", "reason": "The operator specifically reports that an external wake-up sometimes restarts work; the bounded Stop continuation supplies that missing wake-up." },
    { "option": "NoOp", "reason": "The reported post-compaction idle behavior would remain unresolved." }
  ],
  "reopenWhen": "The exact compaction, stale side-question response and idle sequence still fails to resume under native hooks, or native hook activation is unavailable in the actual host."
}
```

The operator clarified the sequence: working on an active work order, automatic
compaction, an answer to the last user message regardless of its age, then idle
until another event wakes the session. They explicitly rejected both proposed
options as incomprehensible and gave no approval to either. The authorized
repair is to continue the unfinished task after compaction, without string
parsing. D003's keyword solution and D004's pending questionnaire are superseded
by that concrete clarification.

The adapter now observes compaction, saved task ownership and completion state.
It restores task context and supplies one continuation if the same compacted
turn ends while that work remains unfinished. It does not examine user prose
or the assistant's last reply to determine intent. The pre-existing formal
`analysis:` and `operator override:` controls remain independently available;
native turn interruption remains the host's responsibility. No new pause
protocol or permanent suspension latch is introduced. Ordinary conversational
instructions remain the model's responsibility, as before this adapter.

Goal alignment: test the observed failure sequence directly. Policy resistance
and escalation favor removing the extra state; commons and shifting the burden
favor one automatic wake-up without another operator command or helper agent.
Drift and rule beating are checked by the unfinished task, stale reply and
completion scenarios, not a phrase matrix. Success to the successful and wrong
goal favor deleting the invested-in parser rather than preserving it for its
tests. Naive Interventionism preserves session/writer identity, completion,
native stopping and existing recovery controls while deleting the speculative
intent layer. No additional publication or global configuration is authorized.

## WO-054-D006

```json
{
  "id": "WO-054-D006",
  "date": "2026-09-18",
  "dispatch": "resume: fix; operator budget direction",
  "decision": "Raise the executor cold-start ceiling from 20,480 to 24,576 bytes and release-close from 12,288 to 16,384 bytes; record the measured rule growth and leave efficiency redesign for the operator's later pass.",
  "evidence": [
    "docs/verifications/WO-054/VER-002.md#n1--major-the-generated-role-text-breaches-two-cold-start-ceilings-which-are-left-advisory",
    "docs/product/07-execution-guide.md#goal-aligned-decisions",
    "docs/control/budgets.json",
    "scripts/lib/process-budget.mjs"
  ],
  "rejected": [
    { "option": "NoOp or only accept the breach", "reason": "The operator explicitly chose to increment the ceilings now; leaving the breach advisory repeats N1." },
    { "option": "Trim role rules or redesign the process now", "reason": "The standing route preserves reviewed rules, and the operator reserved efficiency work for a later pass." }
  ],
  "reopenWhen": "The operator begins the efficiency pass or another reviewed rule exceeds a cold-start ceiling."
}
```

The 2026-09-18 operator message explicitly directs incrementing the budget now
and leaves efficiency for a later pass. The fresh `harness-context --check`
reproduces N1 in both roots: executor 20,849 > 20,480 and release-close
12,437 > 12,288. The added shared advisory-boundary and Codex compaction rule
accounts for the growth identified by VER-002. One 4,096-byte ceiling increment
per affected role follows the existing route. Correction: earlier completion
left these measurements advisory without the required budget write-back;
this repair settles the missing record without claiming reduced context cost.

The mission contribution is clearing the bounded verification handoff for the
real source-to-deliverable loop. Policy resistance and rule beating favor a
recorded ceiling change with an actual measurement over an ignored advisory.
Commons and drift require retaining the observed sizes and claiming no
efficiency gain. Escalation and shifting the burden favor this small repair
over another operator rescue or new mechanism. Success to the successful and
seeking the wrong goal favor the operator's later comparison of alternatives,
not an unrequested redesign during N1 repair. Naive Interventionism: preserve
the useful rules, scope the reversible edit to two limits, and use the existing
measurement as the smallest probe. NoOp leaves the same finding unresolved.

## WO-054-D007

```json
{
  "id": "WO-054-D007",
  "date": "2026-09-18",
  "dispatch": "operator ideation: during resume: verify (VER-003), with follow-up corrections at 2026-09-18T20:45Z, 20:46Z and 20:47Z",
  "kind": "correction",
  "decision": "Treat a bare ideation: message as the documented full intake (capture, clean-room screen, synthesis, ledger entry, product write-back and receipt) and nothing beyond it. Record the verifier's handling of this intake as a failure under shifting the burden to the intervenor.",
  "misread": "The verifier began checking this session's sandbox configuration, which the ideation did not ask for. After the operator said to take note of the ideation and that's it, the verifier stopped at raw capture and reported no synthesis or ledger entry, reading 'that's it' as capture-only. It then acknowledged the correction as agreement rather than recording it as a failure.",
  "meant": "Product 07 §Operator-opened ideation mode: a bare ideation: dispatch runs the complete durable pipeline, and only an explicit capture-only instruction stops after raw intake. 'That's it' excluded work outside the intake, not the intake's own stages.",
  "changed": "The synthesis is complete: the ledger entry, the product 03 candidate paragraph and the breakout receipt. The sandbox investigation stopped. The operator needed three corrections to obtain the documented default, which is the burden this failure shifted onto the intervenor.",
  "evidence": [
    "docs/product/07-execution-guide.md#operator-opened-ideation-mode",
    "docs/evidence/WO-054/ideation-2026-09-18.md",
    "docs/lineage/idea-ledger.md#2026-09-18--out-of-project-file-effects-as-an-explicit-grant",
    "docs/intake/notes/WO-054-expanded-ideation-2026-09-18.md in the main checkout's ignored intake"
  ],
  "rejected": [
    { "option": "Report the raw capture alone as a complete ideation intake", "reason": "Product 07 makes synthesis, ledger and write-back the default. Stopping early left the operator to restate the pipeline." },
    { "option": "Continue verifying the sandbox recollection in the message", "reason": "The operator directed that it stay recollection. Investigating it was work outside the intake." }
  ],
  "reopenWhen": "An ideation: message stops before synthesis without an explicit capture-only instruction, or intake work widens into investigation the message did not request."
}
```
