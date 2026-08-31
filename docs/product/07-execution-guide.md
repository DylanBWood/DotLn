# Execution guide — for any model session working in this repo

You may be Claude (any tier), Codex, or something newer. The repo, not your
transcript, is the shared memory. This guide is the operating contract.

## Read order for a cold start

1. `CLAUDE.md` / `AGENTS.md` (same file) — boundary rules.
2. Your assigned work order in `docs/work-orders/` — your entire task scope.
3. The blueprint docs it cites (`docs/product/…`) — cited sections only;
   do not bulk-load the corpus into context. The ledger and intake exist for
   lookup, not for reading end-to-end.

## Discipline

- **Work only from the current work order.** No opportunistic scope expansion;
  adjacent cleanup only under the bounded boy-scout policy (unambiguous, low
  risk, covered by the same verification, doesn't obscure the diff) —
  otherwise file a candidate task.
- **Evidence gates over prose.** Completion claims require the work order's
  evidence: passing tests you ran, output you captured, behavior you
  witnessed. Read your own diff before reporting. Never infer completion.
- **Settled is settled.** The idea-ledger Resolutions and `docs/decisions/`
  close their questions. Do not relitigate; a genuine new-evidence challenge
  becomes a new decision record proposal, never an in-place edit. Exception:
  each ADR carries an appendable **Amendments** section for notes within the
  decided constraints (a dev-dependency, a tooling choice) — appending there
  is not an edit of the decision.
- **Precedence.** When a work order's authority clause conflicts with a
  standing duty in this guide, the work order wins; note the skipped duty in
  your result as an open question. Doc-only work lands directly on the
  working branch the operator gave you — code goes to worktrees/branches per
  the isolation rule.
- **Ledger duty.** If your work supersedes, transforms, or adds a design idea,
  append to `docs/lineage/idea-ledger.md` (never rewrite existing entries) and
  update the blueprint doc in the same change.
- **Isolation.** The main checkout is the control plane. Model-authored code
  changes happen on branches/worktrees; verify `pwd` and repo root before any
  git operation.
- **No new dependencies** without a one-paragraph note in the relevant
  decision record. The kernel stays framework-free, period.
- **No config mutation of safety boundaries** (git config, hooks, permissions,
  secrets) unless the work order explicitly authorizes it. Non-safety
  `.claude/` and CLAUDE.md refinement may grow iteratively — one line in the
  config log (docs/README.md) per change; a decision record only when a
  safety boundary moves.
- **Configuration layers** (scope × volatility): shared-stable facts in
  committed project docs/settings; machine-local facts in uncommitted local
  files; path-scoped instructions only once the area exists; the bottom layer
  is executable code and tests, which progressively absorbs the prose layers
  above it (ADR-0001's strangler loop).
- **Boundary rules** (from CLAUDE.md): nothing employer-derived enters this
  repo; intake is read-only raw material — synthesize, never copy verbatim;
  flag anything that smells proprietary rather than incorporating it.
- **Projection boundary.** Internal vocabulary (gems, masks, DotLn taxonomy)
  stays out of artifacts consumed outside the system (PRs to other repos,
  generated reports for third parties).
- **Return shape.** End with a compact result: what changed, evidence
  pointers, deviations from the work order, open questions. Terse; no
  narration theater, no apology theater.

## Model-specific notes

- Required model/effort in a work order is a hard constraint (Principle 8) —
  if you are not it, stop and say so; never silently proceed as a substitute.
  Every work order carries a `Model:` line; `Model: any` means any capable
  model. An absent line is a defect in the work order — flag it, don't guess.
- Behavioral guidance rots across model generations; that is why it lives here
  as typed mechanisms and docs instead of prompts. If an instruction here
  fights your model's defaults (e.g., built-in verification), flag it in your
  result rather than ignoring it.
