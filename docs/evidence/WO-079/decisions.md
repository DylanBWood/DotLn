# WO-079 decisions

Dispatch: `resume: next`, 2026-09-20. Actual actor: codex-cli 0.155.1,
gpt-6-astra, xhigh; source codex-session-readback. One coding writer; one
separately authorized read-only evidence verifier, as recorded in D003.

## WO-079-D001

```json
{
  "id": "WO-079-D001",
  "date": "2026-09-20",
  "dispatch": "resume: next",
  "decision": "Implement preservation-first integration with existing generators, an immutable checkpoint and retained named stash, and a resumable local receipt for authored conflicts. Leave commits, checks and acceptance judgment to the integrating reviewer.",
  "evidence": ["docs/work-orders/WO-079-worktree-sync.md", "docs/product/07-execution-guide.md#independent-workflows-and-integration", "docs/final-reviews/WO-122/FINAL-001.md#subject-and-integration", "scripts/resume.mjs", "scripts/lib/planning-followups.mjs"],
  "rejected": [
    {"option": "NoOp: retain the manual checklist", "reason": "The order records repeated integration variance and operator coordination cost."},
    {"option": "Automatically choose authored conflict sides or certify carried claims", "reason": "A generated projection is reproducible, but authored intent and acceptance require reviewer judgment."},
    {"option": "Rebase or automatically commit resolutions", "reason": "Reviewed history and an unfinished authored merge must remain inspectable."},
    {"option": "Add a lifecycle transition or run a gate inside integration", "reason": "Neither is needed to remove the mechanical coordination work; both are excluded by the order."}
  ],
  "reopenWhen": "A real integration needs a mechanical step not covered by the command, or a fixture shows loss of authored bytes, recovery material or either register history."
}
```

Mission and critical path: dependable integration removes repeated operator
supervision from the two-lane route to the independently verified runtime.
The useful existing functions are immutable verification, append-only control,
generated surfaces and recoverable work. The smallest useful probe is a real
Git sibling integration, including negative cases and an unfinished merge.

Policy resistance and escalation: do not add phase barriers or a repair event
for bookkeeping. Commons and shifting the burden: replace repeated manual
commands with one bounded helper, retaining the reviewer only for authored
intent. Drift to low performance and rule beating: assert preserved content,
history and refs in real Git, not merely successful subprocess exits. Success
to the successful: reuse existing generators because they define the outputs,
not because a new framework is preferred. Seeking the wrong goal: the result
is an inspectable integrated tree with named remaining checks, not another
passing status. Naive Interventionism: checkpoint and stash make the operation
recoverable; conflicts in mixed documents keep authored content; a failed
generator leaves a pending task and cannot be called success.

## WO-079-D002

```json
{
  "id": "WO-079-D002",
  "date": "2026-09-20",
  "dispatch": "resume: next",
  "decision": "Complete the activation's version assignment at v0.37.1 and bump skeleton to 0.33.1 for its generated reviewer instruction; preserve the order's patch classification.",
  "evidence": ["docs/work-orders/WO-079-worktree-sync.md", "packages/skeleton/src/loadouts/contributor.ts", "packages/skeleton/package.json", "refs/tags/v0.37.0"],
  "rejected": [
    {"option": "No component bump", "reason": "The reviewer instruction is skeleton source and changes the delivered harness loadout."},
    {"option": "Bump all components or add a dependency", "reason": "Compiler, kernel and console behavior do not change; existing first-party helpers suffice."}
  ],
  "reopenWhen": "Upstream publishes either staged version before final review; retime under the same patch compatibility impact."
}
```

This is activation metadata, not a scope amendment. The pre-2026-09-09
ledger-entry duty is discharged by this decisions record and its generated
index row under the executor's standing substitution.

## WO-079-D003

```json
{
  "id": "WO-079-D003",
  "date": "2026-09-20",
  "dispatch": "resume: next; operator authorized the read-only CLI verifier",
  "decision": "Record new immutable authority and feedback editions and select their console selfhost projection after the reviewer instruction and exact workspace pin changed recorded inputs.",
  "evidence": ["docs/evidence/WO-079/authority/001/authority.json", "docs/evidence/WO-079/authority/001/bundle-diff.json", "docs/evidence/WO-079/feedback-001/feedback.json", "docs/evidence/WO-079/feedback-001/selfhost-verification.jsonl"],
  "rejected": [
    {"option": "Rewrite the previous edition", "reason": "Historical evidence must keep its actual subject."},
    {"option": "Treat the stale feedback check as green because the change is small", "reason": "The observed check rejected the changed subject. The fresh read-only verifier completed both criteria against the new audit."}
  ],
  "reopenWhen": "A recorded input changes again; check the evidence projection and create a new edition when required."
}
```

The source audit reproduced ten present/removal pairs and the same 1,192-byte
instruction projection saving. One authorized Codex CLI verifier used
gpt-6-astra/xhigh in an isolated worktree. No collaboration agent or descendant
was requested. This validates feedback evidence, not WO-079's independent
work-order verification. Existing artifact-identity and verification editions
passed unchanged. The fresh edition's cost is evidence maintenance; no measured
end-to-end operator-time reduction is claimed.

## WO-079-D004

```json
{
  "id": "WO-079-D004",
  "date": "2026-09-20",
  "dispatch": "resume: next",
  "decision": "Preserve the WO-145 and WO-146 role snapshots and add a separate WO-079 oracle for the authorized reviewer instruction. Continue checking optional economy support against current roles and byte-check the historical WO-146 snapshot.",
  "evidence": ["scripts/test-process-debt.mjs", "packages/skeleton/fixtures/wo079-role-baseline.json", "packages/skeleton/fixtures/wo146-role-baseline.json", "packages/skeleton/src/loadouts/contributor.ts"],
  "rejected": [
    {"option": "Overwrite the WO-146 baseline or remove the snapshot assertion", "reason": "Either would erase historical evidence or stop checking exact current role bytes."},
    {"option": "Ignore the failure", "reason": "The full review run and a focused rerun both reproduced the mismatch after this order's authorized prose change."}
  ],
  "reopenWhen": "Another authorized role edit changes the generated default/off bytes; retain historical snapshots and bind the new subject separately."
}
```

Correction: the initial implementation missed the process-debt suite's exact
default-role snapshot. The generated origin hash identifies the whole loadout,
so it changed in all default roles; comparison with HEAD after removing only
that origin line showed changed prose in the two reviewer skill projections
alone. The running gate was stopped before editing its inputs. This test
maintenance completes the reviewer-line deliverable; it changes no additional
role behavior and requires no second live verifier.

## WO-079-D005

```json
{
  "id": "WO-079-D005",
  "date": "2026-09-20",
  "dispatch": "resume: final review",
  "decision": "Within the reviewer's bounded cleanup, assert the release retime and the draft decision stub after `--continue` in both fixture cases, and read the per-case JSON line back from the integrated tree instead of printing literals. VER-001 L1 recorded that the reviewed-merge case asserted neither, because its generators only run after the authored resolution, while the printed line stated `retimed: v9000.0.2` for both cases as a hardcoded value. The reviewed case now observes the retime rather than implying it.",
  "evidence": ["scripts/test-worktree-integration.mjs", "docs/verifications/WO-079/VER-001.md#limits-recorded", "node --test scripts/test-worktree-integration.mjs: 6 passed, 0 failed, 35.95 s", "npm test -- --review: 30 passed, 0 failed, 497.36 s, 74 fresh tasks"],
  "rejected": [
    {"option": "Leave L1 as a recorded limit and board it up as a follow-up", "reason": "The gap was one guarded assertion in this order's own new test file, and the misleading line was evidence output. Boarding it up would ship a merged test that prints a value it never observed, against this order's own D001 rule to assert preserved content rather than successful subprocess exits."},
    {"option": "Also drive VER-001 L3, the divergent same-entry register history, through resolveProjections", "reason": "That needs a new fixture path rather than an assertion move, and it changes what the fixture proves. It stays a recorded limit of the shipped evidence, not a reviewer edit at final review."},
    {"option": "Delete the printed JSON line entirely", "reason": "The line is useful per-case evidence in the gate transcript. Deriving its values from the tree keeps the evidence and removes the invented part."}
  ],
  "reopenWhen": "A fixture case is added whose generators cannot run before the assertion point, or the printed per-case record is read as evidence for a property the case does not assert."
}
```

Correction: no defect in the helper was found or changed. This edit is confined
to the order's own test file; the reviewed helper, its write-backs and every
generated surface are the bytes VER-001 judged. The full product gate was rerun
after this edit, and the `worktree-integration` suite passed inside it at
53.13 s.
