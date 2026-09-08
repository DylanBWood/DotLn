# WO-079 — Worktree sync: `worktree sync WO-NNN` updates an order's worktree after a sibling merges with a checkpoint, a kept stash, no rewritten commits, classified conflicts and collision retiming, and refuses its three unsafe cases (version assigned at activation)

**Model:** any capable model. State the model and effort actually run in the
result (07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** patch. One control-plane helper. Assigned at
activation under the standing opt-out default.
**Nomination provenance:** WO-033 phase 4, cut into a bounded child at the
operator's 2026-09-08 correction; the concurrent plan's rebase-helper
automation candidate. Planner-synthesized draft. Opaque identifier, not a
priority. Clean-room screen: no stop condition.
**Depends on:** WO-030 merged (per-order segments and checkpoints; satisfied
at `v0.7.0`).
**Recommended placement:** any free lane under the dated planning deferral;
it edits `scripts/worktree.mjs`. A recommendation, not a dependency token.

**Cites (read these sections):** `docs/work-orders/WO-033-compiled-starter-export.md`
§Phase 4 (the umbrella's wording, including the 2026-09-07 correction);
`docs/planning/concurrent-work-orders-plan.md` (lane rules; the helper as a
candidate); 07-execution-guide.md §Independent workflows and integration;
`docs/PLAYBOOK.md` §Concurrency; `scripts/worktree.mjs`, `scripts/release.mjs`
(`prepare`).

**Objective:** Inside an order's worktree after a sibling has merged: mint a
recovery checkpoint ref without a lifecycle event; `git stash push
--include-untracked` with a named message; fetch and fast-forward the branch
when it has no commits, or merge `origin/main` into it without rewriting when
it has reviewed commits; `git stash apply` (never `pop` or `drop`); report
every conflicting path as generated projection (regenerated) or authored
(left for explicit resolution); invoke `release prepare` for a colliding
unpublished target; append no repair event for integration-only changes;
refuse outside a matching `wo-NNN` worktree, when the upstream cannot be
resolved, and when ignored intake is present without a named backup.

**Observed gap (dated 2026-09-08, `main` at `33e2c25`):**

- The base update after a sibling merge is a manual sequence described only
  in prose.

**Design (scope discipline):**

- No sibling phase is a prerequisite; the helper installs no gate.
- **Declined alternatives, recorded:** a rebase that rewrites reviewed
  commits.

**Deliverables:** the helper, a real-Git fixture, the write-backs below.

**Acceptance criteria (all required)**

1. Over a real-Git fixture with two orders, a merged sibling, a conflicting
   generated projection, a conflicting authored file and a colliding release
   target: the checkpoint is minted, the named stash kept, the base updated
   without rewriting commits, the projections regenerated, the authored
   conflict reported, collision retiming applied.
2. The three refusal cases refuse without changing the tree; a third order's
   lifecycle phase, varied, never gates the sync or appends control events;
   an integration-only case is distinguished from a behavioral conflict
   requiring affected-claim evidence.
3. Write-backs land: `docs/PLAYBOOK.md` §Concurrency (the helper replaces the
   prose procedure), 07 (one sentence), ledger entry.
4. `npm test` green; `git diff --check` clean; no new dependency.

**Evidence gate:** the transcripts; `npm test`.

**Write-back duty:** as listed in criterion 3.

**Non-goals:** a lane generator or scheduler; rewriting history.

**Operator-review assumptions**

1. The operator voluntarily serializes final review through release close;
   this helper installs no gate.
