# WO-079 — Worktree integrate: `worktree integrate WO-NNN` runs the second lane's integration checklist as one command — checkpoint, named stash, merge main, regenerate every generated surface, union the follow-up register, retime a colliding unpublished release with a dated decision stub — and reports the checks the integrated tree needs (version assigned at activation)

**Model:** any capable model. State the model and effort actually run in the
result (07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** patch. One control-plane helper. Assigned at
activation under the standing opt-out default.
**Cost:** removes the remembered eight-step checklist from every second-lane
final review (07-execution-guide.md, 2026-09-16) and the variance it
produced: final reviews since 2026-09-13 ran 14 to 56 minutes, the five that
integrated a sibling's merge a median of about 32 minutes against about 25
for the rest, and each of the earlier integrations was handled differently
(a sibling's publication read as a defect, two retimes, two union merges of
the register, regenerated bundles every time). Adds one helper with a
real-Git fixture; no gate, no lifecycle event, no recurring step.

**Nomination provenance:** WO-033 phase 4 (the original sync helper, cut at
the operator's 2026-09-08 correction); the R1 replan's decision 7 and its
reopening condition ("an integration that needs a step the list does not
name"); the operator's message 3 in the 2026-09-17 planning dispatch
(parallel work still inconsistent, the todo negating the gain); the
[2026-09-17 pass](../planning/vision-into-use-2026-09-17.md) §4 and §13.
Rewritten by that pass; the order was never activated. Planner-synthesized
draft. Clean-room screen: no stop condition.

**Depends on:** WO-030 merged (per-order segments and checkpoints; satisfied
at `v0.7.0`); WO-133 merged (the runtime rebuild after a fast-forward the
helper invokes; closed).

**Recommended placement:** pair 6 beside WO-099; it edits
`scripts/worktree.mjs`. A recommendation, not a dependency token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-030",
    "relation": "satisfied-by-release",
    "release": "v0.7.0",
    "reason": "per-order segments and checkpoints"
  },
  {
    "workOrderId": "WO-133",
    "relation": "satisfied-by-close",
    "reason": "the runtime rebuild after a fast-forward that changes the pins"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** 07-execution-guide.md §Independent
workflows and integration (the 2026-09-16 checklist and its 2026-09-17
amendment); `docs/final-reviews/WO-122/FINAL-001.md` §Subject and
integration; `docs/final-reviews/WO-047/FINAL-001.md`;
`docs/final-reviews/WO-121/FINAL-001.md`; `scripts/worktree.mjs`;
`scripts/release.mjs` (`prepare`); `scripts/meta.mjs`;
`scripts/lib/planning-followups.mjs` (the register's union by entry id);
`scripts/work-orders.mjs`; `docs/PLAYBOOK.md` §Concurrency.

**Objective:** Inside an order's worktree after a sibling has merged, one
command: mint a recovery checkpoint ref without a lifecycle event; `git
stash push --include-untracked` with a named message; fetch and fast-forward
the branch when it has no commits, or merge `origin/main` into it without
rewriting when it has reviewed commits; `git stash apply` (never `pop` or
`drop`); resolve every conflicting generated projection by regenerating it
(the harness bundle and manifest, the work-order index, `meta`, the
publication locks, the decisions index, the console fixtures the order
selects); union the follow-up register by entry id preserving both
histories; list every authored conflict for explicit resolution; invoke
`release prepare` for a colliding unpublished target and append a dated
integration decision stub to the order's decisions record (both bases, the
resolved paths, the carried-forward claims) for the reviewer to complete;
rebuild the runtime after the fast-forward; print the affected checks (the
one product gate, the `--review` selection when machinery changed,
`publication:check`, `harness check`); append no repair or verification
event; refuse outside a matching `wo-NNN` worktree, when the upstream cannot
be resolved, and when ignored intake is present without a named backup.

**Observed gap (dated 2026-09-17, `main` at `ec502c9`):**

- The checklist is prose that the integrating reviewer runs from memory;
  the record above shows the variance and the operator reports the cost.

**Design (scope discipline):**

- No sibling phase is a prerequisite; the helper installs no gate and runs
  no gate itself; it reuses the existing regenerate commands and adds no
  generator.
- The decision stub is a draft the reviewer edits; judgment stays with the
  reviewer.
- **Declined alternatives, recorded:** a rebase that rewrites reviewed
  commits; running the gate inside the helper; a lane generator; making the
  integration a lifecycle transition.

**Deliverables:** the helper; a real-Git fixture; the write-backs below.

**Acceptance criteria (all required)**

1. Over a real-Git fixture with two orders, a merged sibling, a conflicting
   generated projection, a conflicting authored file, a register both sides
   appended, and a colliding release target: the checkpoint is minted, the
   named stash kept, the base updated without rewriting commits, the
   projections regenerated, the register unioned with both histories, the
   authored conflict listed, the retime applied, the decision stub written,
   and the affected checks printed.
2. The three refusal cases refuse without changing the tree; no control
   event is appended in any case; a third order's lifecycle phase, varied,
   never gates the command.
3. Write-backs land: 07 §Independent workflows and integration (the
   checklist names the command and stays as its definition),
   `docs/PLAYBOOK.md` §Concurrency (the helper replaces the prose
   procedure), the reviewer skill's integration line, ledger entry.
4. `npm test` green; `git diff --check` clean; no new dependency.

**Evidence gate:** the transcripts; `npm test`.

**Write-back duty:** as listed in criterion 3.

**Non-goals:** a lane generator or scheduler; rewriting history; running or
replacing the gate; deciding acceptance.

**Operator-review assumptions**

1. The operator still takes one order at a time through final review and
   release close; this helper installs no gate.
2. The decision stub is a draft; the reviewer owns its content.
