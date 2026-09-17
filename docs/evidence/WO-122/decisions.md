# WO-122 decisions

## WO-122-D001 — Extend the resident through existing request and presence contracts

```json
{
  "id": "WO-122-D001", "date": "2026-09-17", "dispatch": "resume: next",
  "decision": "Reuse the existing writer/inspection transports and origin stamps; add durable per-order human questions and kind-specific result validation.",
  "evidence": ["docs/work-orders/WO-122-actor-catalog-cli-and-human.md", "docs/discovery/writing-worker-smoke-2026-09-14.md", "packages/skeleton/src/actor-contract.ts", "packages/skeleton/src/resident-state.ts"],
  "rejected": [{"option": "NoOp", "reason": "Leaves resident coding and human decisions unimplemented."}, {"option": "A second transport or a fallback actor", "reason": "Duplicates the observed profiles or changes the explicitly selected actor."}],
  "reopenWhen": "New discovery evidence contradicts C-U1/X-U1, or multi-order scheduling needs a broader resident."
}
```

Dispatch: operator `resume: next`, 2026-09-17. Sources: WO-122; product 03
§Runtime primitive catalogs; WO-051 and WO-068; the 2026-09-14 writing-worker
record, C-U1/X-U1 and C-U6/X-U6; actor-contract, resident-host/state/store,
worker-transport and presence-signals source and their existing fixtures.

The critical-path contribution is resident-initiated coding and durable human
judgment without an operator launching each session. Reuse the writer and
inspection transport validators, canonical argv, result parsing and origin
stamps. Add kind-specific actor observations and replayed handoff state. CLI
completion remains a claim, not independent verification. Human answers are
explicit local operator input. An unavailable launch row yields a named NoOp;
there is no fallback actor or model-written answer.

NoOp preserves the tested script actor but leaves WO-122's two capabilities
absent. A second transport or presence classifier duplicates existing rules
and invites policy resistance/fixes that fail. Common resource budgets and
bounded worker time/output address the commons; retaining observed launch
rows avoids drift to low performance. A small catalog extension avoids process
escalation. Both harnesses retain equal eligibility (success to the successful).
Durable question/answer events reduce recurring operator rescue (shifting the
burden) without pretending judgment is automated. Replay, refusal, restart and
real-process evidence address rule beating. Outcome and authority checks serve
the actual work instead of dispatch counts (seeking the wrong goal).

Naive Interventionism: preserve existing script behavior, inspection argv and
the presence interpreter; use doubles before the single scratch writer live
row. Consumers are the resident fold, local commands and existing worker
transports. Main risks are authority widening, stale human answers and an
orphaned process after resident death. The extension is additive and can be
disabled by selecting another declared actor. Reopen the launch adapter if a
new recorded row contradicts C-U1/X-U1; reopen scheduling only when a tested
multi-order scheduler requires behavior beyond this resident's one policy.

The older order's ledger duty is satisfied here and in the generated decisions
index, per the executor skill's pre-2026-09-09 substitution. Entry process
usage is unknown: source unavailable, dispatch scope, cutoff
2026-09-17T01:55:07Z. Current session readback: Codex CLI 0.154.0,
gpt-6-astra, ultra. No process-cost reduction is claimed.

## WO-122-D002 — Preserve continuation and enforce both authorities

```json
{
  "id": "WO-122-D002", "date": "2026-09-17", "dispatch": "resume: next",
  "decision": "Release the human episode's process slot without a failure transition; bind answers to order, packet, option and policy generation. Authorize worker operations under both phase and nested writer envelopes.",
  "evidence": ["packages/skeleton/src/presence-machine.ts", "packages/skeleton/src/resident-state.ts", "packages/skeleton/test/resident-actors.test.ts"],
  "rejected": [{"option": "Model waiting as failure", "reason": "The existing failure transition resets the generation and loses the continuation."}, {"option": "Trust only the broader phase", "reason": "A narrower writer expiry or evidence requirement could be bypassed."}, {"option": "A permanently pending process", "reason": "Blocks the resident instead of holding only the affected order."}],
  "reopenWhen": "The writer profile represents additional conditional revocation rules or the resident gains concurrent policy continuations."
}
```

The independent read-only design review identified the initial continuation,
nested-authority, packet-publication and inherited-stderr issues before handoff.
Corrections use atomic complete-packet publication, dual authorization, idle
expiry before answer continuation, and bounded pipe closure on cancellation.
The focused tests exercise these behaviors. No new gate or operator ritual is
introduced; this strengthens the requested deliverable rather than expanding it.

Correction, 2026-09-17: the first live fixture inherited the inspection order's
“Do not mutate repository contents” constraint. The actual CLI correctly
returned a blocked envelope without changing files. The writer fixture now
supplies consistent writer-specific acceptance, constraints and non-goals.
The first shapes-only row and scratch-worktree location are preserved separately.
Another test failure came from deleting its fixture before releasing the host
lock; cleanup now closes the host first. A nested-revocation test accidentally
mutated shared fixture authority references; it now clones the worker input
before adding its distinct restriction. These were fixture corrections, not
evidence of successful behavior before their reruns.

## WO-122-D003 — Additive runtime release and source evidence

```json
{
  "id": "WO-122-D003", "date": "2026-09-17", "dispatch": "resume: next",
  "decision": "Stage application v0.28.0 and skeleton 0.24.0 under the order's minor classification; refresh runtime pins and current source evidence.",
  "evidence": ["docs/work-orders/WO-122-actor-catalog-cli-and-human.md", "packages/skeleton/package.json", "scripts/lib/harness.mjs", "scripts/lib/evidence-sources.mjs"],
  "rejected": [{"option": "No component bump", "reason": "Two actor capabilities and new persisted events are additive public runtime behavior."}, {"option": "Bump unchanged compiler, kernel or console", "reason": "Their behavior is unchanged."}],
  "reopenWhen": "Integration consumes the staged version or runtime edits invalidate the evidence cutoff."
}
```

Observed local tag maximum: v0.27.0. Additional subject inputs are the new pure
actor contracts, supervisor, handoff writer, actor fixtures/live collector,
runtime pin/source inventories, CLI/runbook, release metadata and generated
evidence/projections. These are necessary consumers and validation of the two
kinds. Existing inspection argv remains byte-pinned. Source changes are confined
to the skeleton and its integration surfaces; there is no new dependency.

## WO-122-D004 — Repair the inherited Codex writer tool host

```json
{
  "id": "WO-122-D004", "date": "2026-09-17", "dispatch": "resume: next; operator confirmed Keep the repair in WO-122",
  "decision": "Remove code_mode_host from source-change-only disabled features, retaining its installed stable default with the two existing shell features.",
  "evidence": ["docs/evidence/WO-122/live-attempt-2.json", "packages/skeleton/src/worker-transport.ts", "packages/skeleton/test/resident-actors.test.ts"],
  "rejected": [{"option": "NoOp", "reason": "The installed CLI returned a blocked envelope because its workspace tools had no code-mode host."}, {"option": "Change the inspection launch", "reason": "Inspection is tool-free and its exact argv remains the required baseline."}, {"option": "Silently select another harness", "reason": "The work order explicitly forbids fallback between actor kinds; fixing the selected writer is bounded."}],
  "reopenWhen": "A subsequent CLI version or live row changes tool-host dependencies."
}
```

Queue adjacent-0001 records the cause, concrete fix, named paths, checks,
announcement and actor-attested steering. The operator explicitly kept this
repair in WO-122. `codex features list` observed `code_mode_host` stable and
enabled in CLI 0.154.0. Context7's official `/openai/codex` source documents
feature override handling and shell-tool registration; the official
[configuration reference](https://learn.chatgpt.com/docs/config-file/config-reference)
was also consulted. The necessity of this particular host comes from the
actual failed live envelope, not a claim that the public reference names it.
The smallest probe is the same synthetic source-change episode. This removes
an accidental disabling flag and changes no stored user/account configuration,
authority, network permission or sandbox profile. Benefits/risks use D001's
eight-lens comparison: this repair removes an intervention that defeated the
authorized capability; it does not add a process or broaden the work surface.

Correction to evidence interpretation, 2026-09-17: the first collector
incorrectly required successful editing, testing and committing. WO-122 AC3
requires a real resident launch through the writer profile and a recorded
envelope; WO-053 owns the stronger source-change proof. The third real run
returned a valid blocked envelope because the personal Git-root verification
requirement conflicted with the writer prompt's three shell commands. A second
read-only review checked this distinction against both orders. The collector
now records launch observation, envelope validation and the reported status
separately from host-observed edits/tests/commits. No blocked worker is relabeled
completed. The synthetic request also supplies the actual host-observed cwd/Git
root and initial fixture contents as known facts; this changes no command
permission. Preserve all earlier attempts and report any remaining usability
limit before claiming WO-053's stronger result.

Correction, 2026-09-17: the recovery path initially bound a question to the
current generation when its dispatch had survived but its request event had
not. A read-only replay showed that dispatch, crash, return, absence, recovery
and answer could advance a later policy generation. The fold now retains each
episode's generation at dispatch, and the composed real-store regression checks
that the old answer releases its hold without promoting the new generation.
The independent replay confirmed both ordinary continuation and this refusal.
The final focused run passes 20 tests. New pure contracts and native adapters
are included in the source evidence inventory; the required source refresh is
revision 002, preserving the earlier editions. This handoff-only correction
does not change the recorded live CLI launch path or its blocked status.

The executor used explicit writer reservation and output delivery commands;
no automatic Codex hook enforcement is claimed. The initial authorship session
was not itself a writer reservation; inspection exposed that distinction, and
the explicit writer hook reserved the root session before final validation.
Only the root session wrote project files throughout.

Correction, 2026-09-17: the full review run passed 27 suites and failed only
the skeleton suite's existing discovery digest fixture. That fixture cast an
object without an actor kind to ActorSpec; WO-122's kind-specific result path
correctly returned before script digest validation. The fixture now supplies a
complete script declaration and retains the tampered-digest rejection assertion.
Production configuration already validates actor kinds, and the real discovery
replay/tamper case passed. A read-only review confirmed the test-only diagnosis.
The first progress summaries missed the early failure line; the full log
corrected that observation. No runtime change or new evidence edition follows
this test-only correction. The unchanged machinery suites passed in the review
run; the corrected product suite is rerun fresh before handoff.

## WO-122-D005 — Integrate the published sibling and retime the additive release

```json
{
  "id": "WO-122-D005", "date": "2026-09-17", "dispatch": "resume: final review; operator requested main integration, housekeeping and temporary merge-worktree cleanup",
  "decision": "Carry WO-122's verified actor behavior onto main at 352ada5, preserve both orders' records, regenerate shared projections and retime the minor release to application v0.29.0 and skeleton 0.25.0.",
  "evidence": ["docs/product/07-execution-guide.md#independent-workflows-and-integration", "docs/verifications/WO-122/VER-001.md", "docs/evidence/WO-122/decisions.md#wo-122-d003", "docs/final-reviews/WO-122/FINAL-001.md"],
  "rejected": [{"option": "NoOp", "reason": "Leaves the reviewed branch behind merged main with colliding application and component versions."}, {"option": "Repair or a new verification for bookkeeping", "reason": "No behavioral merge resolution is needed; the integration contract carries unchanged claims forward and requires checks of the combined result."}, {"option": "A temporary merge repository or worktree", "reason": "The selected branch can fast-forward with its dirty work preserved in a named stash and canonical checkpoint."}],
  "reopenWhen": "An integrated executable check exposes a changed acceptance claim or a resolution requires behavioral code."
}
```

The original verified base is `6029a4c`; the fetched main base is `352ada5`. Both staged application v0.28.0 and skeleton 0.24.0 were valid at verification; WO-052 has now published them. The existing minor classification is retained. The named integration stash and canonical checkpoint preserve the original subject, and ignored intake stays in place. Follow-ups are unioned by entry id, generated pins and publication locks are regenerated, and historical verification and evidence editions remain immutable. The recovery description identified by VER-001 F1 is scoped to script/CLI recovery; durable handoffs keep their documented restart path.

This enables the critical-path resident and source-change capabilities to coexist in the next reviewed release. D001's eight-lens rationale remains applicable. Policy resistance and fixes that fail are checked through combined runtime tests; rule beating is addressed by a fresh reviewer gate rather than relabeling old evidence. The commons and escalation favor one integration in the existing worktree; success to the successful does not exclude either actor or harness. Preserved records prevent drift to a weaker standard, routine reconciliation reduces operator rescue (shifting the burden), and the outcome is a usable combined release rather than a clean-diff proxy (seeking the wrong goal). Naive Interventionism favors mechanical, reversible reconciliation with no behavioral repair by the reviewer. No temporary merge worktree existed at entry; any created for this integration must be removed after its contents are safely accounted for. No process-cost reduction is claimed.
