# WO-072 — Target worktree lifecycle: `worktree start` for a registered target creates the worktree from the declared base, emits the governed bundle into it, and `resume` commands run from that worktree select the order through the launchpad (version assigned at activation)

**Cost:** Legacy declaration unavailable: added and removed wall-clock, context bytes, commands, tokens and steps were not measured. No reduction is claimed; the next planning refutation must judge this missing cost evidence (WO-126, 2026-09-09).

**Model:** any capable model. State the model and effort actually run in the
result (07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** minor. Control-plane lifecycle capability over
registered repositories. Assigned at activation under the standing opt-out
default.
**Nomination provenance:** WO-033 phase 2 (the target worktree lifecycle),
cut into a bounded child at the operator's 2026-09-08 correction. Planner-
synthesized draft. Opaque identifier, not a priority. Clean-room screen: no
stop condition.
**Depends on:** WO-071 merged (the registration it starts worktrees from);
WO-049 merged (the emit into the target worktree); WO-030 merged (per-order
segments; satisfied at `v0.7.0`).
**Recommended placement:** after WO-071; it edits `scripts/worktree.mjs`,
`scripts/resume.mjs` and `scripts/release.mjs`. WO-052's worktree creation
helper is reused where it fits; the executor records the sharing. A
recommendation, not a dependency token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-071",
    "relation": "hard",
    "reason": "the registration it starts worktrees from"
  },
  {
    "workOrderId": "WO-049",
    "relation": "hard",
    "reason": "the emit into the target worktree"
  },
  {
    "workOrderId": "WO-030",
    "relation": "satisfied-by-release",
    "release": "v0.7.0",
    "reason": "per-order segments"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** `docs/work-orders/WO-033-compiled-starter-export.md`
§Phase 2; 03-architecture.md §Session lifecycle & resilience (the operator
worktree projection; the tool never rebases, force-deletes, auto-merges or
discards) and §Platform and instance boundary; 07-execution-guide.md
§Workflow closeout and releases; `scripts/worktree.mjs`, `scripts/resume.mjs`,
`scripts/release.mjs`; `docs/work-orders/WO-052-source-change-host.md`
(the programmatic worktree creation).

**Objective:** For a registered target, `worktree start WO-NNN` creates the
worktree from the declared base under the configured parent, activates the
order, emits the harness bundle for the launchpad build into the worktree's
ignored local configuration through WO-049, echoes the repository's
authority profile as a receipt and prints the same handoff as today; a local
ignored registry maps worktree paths to the launchpad and order so `status`,
`next`, `verify` and `final-review` run from the target worktree select the
order by branch through `DOTLN_LAUNCHPAD` or the registry; every report
lands in the launchpad; `release close` for a target order records a
no-release disposition, removes only the target worktree and merged branch
after containment, and creates no tag in either repository.

**Observed gap (dated 2026-09-08, `main` at `33e2c25`):**

- `worktree start` creates sibling worktrees of this repository only;
  `release close` assumes this repository's release surfaces.

**Design (scope discipline):**

- The registry lives under the control local directory, ignored; no path
  enters a control event, the projection or the index.
- **Declined alternatives, recorded:** committing DotLn files into the
  target (camouflage); a per-repository release ladder (out of scope).

**Deliverables:** the lifecycle changes, the registry, a real-Git
launchpad-and-target fixture, the write-backs below.

**Acceptance criteria (all required)**

1. Over a real-Git fixture, `worktree start` for a target order creates the
   worktree from the declared base, emits the bundle (`harness check --out`
   passes there), echoes the profile, and the target worktree's branch and
   every commit it can produce contain no DotLn control, work-order, evidence
   or harness file (a tree grep and `git status --porcelain`).
2. `status`, `next`, `verify` and `final-review` run from the target
   worktree through `DOTLN_LAUNCHPAD` and through the registry select the
   order and write reports only in the launchpad.
3. `release close` for the target order records the no-release disposition,
   removes only the worktree and merged branch after containment, and
   creates no tag in either repository.
4. Write-backs land: 07 §Operator resume phrases (`DOTLN_LAUNCHPAD`; target
   orders) and §Workflow closeout (target orders), `docs/PLAYBOOK.md` §The
   loop, ledger entry.
5. `npm test` green; `git diff --check` clean; no new dependency.

**Evidence gate:** the transcripts; `npm test`.

**Write-back duty:** as listed in criterion 4.

**Non-goals:** publishing (WO-064); sync (WO-079); classes (WO-073).

**Operator-review assumptions**

1. Target repositories receive only conventional branches; their DotLn
   state lives in the launchpad and ignored worktree state.
