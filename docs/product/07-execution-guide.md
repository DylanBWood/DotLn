# Execution guide — for any model session working in this repo

You may be Claude (any tier), Codex, or something newer. The repo, not your
transcript, is the shared memory. This guide is the operating contract.

## Read order for a cold start

1. `CLAUDE.md` / `AGENTS.md` (same file) — boundary rules.
2. Your assigned work order in `docs/work-orders/` — your entire task scope.
3. The blueprint docs it cites (`docs/product/…`) — cited sections only;
   do not bulk-load the corpus into context. The ledger and intake exist for
   lookup, not for reading end-to-end.

## Operator-opened ideation mode

The operator may explicitly pause work-order execution and reopen ideation,
including by expanding the subject of the current work order. That instruction
changes the session's job from implementer/verifier to intake and synthesis;
the work order is then context, not a scope fence, until the operator resumes
execution. Do not make the operator restate the documentation pipeline.

In ideation mode:

1. Capture unedited material in a dated file under `docs/intake/chats/`,
   `docs/intake/notes/`, or `docs/intake/images/`. Intake is local-only and
   gitignored; preserve fragments, repetition, uncertainty, and contradictions.
2. Apply the clean-room boundary before synthesis. If material resembles
   employer code, configuration, identifiers, proprietary API shapes,
   internal services, or managed-work-host details, stop and flag it. Never
   promote suspect material.
3. When the operator asks to synthesize, rewrite rather than copy. Append each
   significant idea to `docs/lineage/idea-ledger.md` with lifecycle status and
   provenance; never rewrite an older ledger entry.
4. Promote only durable product understanding into the relevant
   `docs/product/` document, and update an ADR only through its permitted
   amendment mechanism. Preserve speculative ideas as `raw` or `preserved`
   instead of forcing premature architecture.
5. Treat tensions with settled resolutions as tensions to surface, not license
   to silently overwrite them. A real challenge based on new evidence becomes
   a decision-record proposal.
6. Keep pre-existing implementation changes intact and distinguish them from
   ideation artifacts. Do not resume coding, verification, or work-order
   closeout until the operator asks.

### Ideation breakout receipt and verification

An ideation breakout that changes committed documentation is not complete at
synthesis. Record the operator's explicit scope-expansion authority in the
affected work order (or a new bounded work order), together with a receipt that
names the raw intake batch, ledger entries, product/decision/schema surfaces
changed, unresolved choices, and required review.

The eventual verifier and final reviewer must digest that receipt and the
synthesized documents as part of their subject—not treat them as incidental
notes. They verify clean-room rewriting, traceability to operator intent,
consistency with settled decisions and canonical vocabulary, version/schema
effects, internal cross-references, and whether speculative choices were
accidentally presented as settled. They may propose and apply authorized,
non-substantive handoff/documentation corrections. Any correction affecting
code, contracts, acceptance, schema, compatibility, authority, or prior
evidence fails final review and returns through repair plus a fresh independent
numbered verification before another final-review attempt.
They do not promote raw intake verbatim or expand implementation merely because
the ideation describes a future feature.

Any executable helper, migration, generator, backup utility, or other ad hoc
tool created during an ideation breakout is implementation subject to the same
separation and evidence rules as work-order code. It must have associated
automated tests proportionate to its risks, be named in the breakout receipt,
and be independently inspected and executed by the verifier. The final reviewer
checks both its product fit and whether the tests cover its consequential
failure modes; “small script” is not an evidence exemption.

The default capture path for ideation opened around a work order is
`docs/intake/notes/<work-order>-expanded-ideation-<date>.md`; the naming scheme
is a convenience, not a requirement.

## Workflow closeout and releases

Final review prepares and publishes a clean PR; the operator retains merge
authority. After the PR is merged, the lifecycle helper updates `main`, proves
the reviewed branch is contained in `origin/main`, and removes only its known
worktree and merged branch. Ordinary tracked or untracked dirt is refused by
the clean-worktree gate. Ignored raw material under `docs/intake/` must be
backed up and reconciled into the surviving main intake as appropriate; the
helper separately refuses removal while that protected material exists and
never deletes or auto-promotes it. Known disposable ignored dependency/build
outputs such as `node_modules` and `dist` may leave with the worktree. The last workflow
task then evaluates whether the
completed roadmap rung is a release boundary.

For a release boundary, work from the exact merged commit: rerun the release
evidence, generate and validate the immutable release manifest described in
`06-roadmap.md`, and present the annotated tag and publication command for
explicit operator authorization. Never tag the feature branch, tag failing
evidence, move an existing tag, or imply that npm/binary/hosted distribution
occurred when the release is source-only. A failed release check opens a patch
work order; an intentional defer records why and what will trigger reconsideration.

## Discipline

- **Work only from the current work order.** No opportunistic scope expansion;
  adjacent cleanup only under the bounded boy-scout policy (unambiguous, low
  risk, covered by the same verification, doesn't obscure the diff) —
  otherwise file a candidate task.
- **Evidence gates over prose.** Completion claims require the work order's
  evidence: passing tests you ran, output you captured, behavior you
  witnessed. Read your own diff before reporting. Never infer completion.
- **Verification artifacts are immutable and numbered.** Verifiers write to
  `docs/verifications/WO-NNN/VER-NNN.md`; the first pass is `VER-001.md` and
  every re-verification creates the next number instead of replacing a prior
  report. The original `docs/work-orders/WO-NNN-*.md` remains scope authority.
  A repair episode reads both that original work order and the specific
  verification artifact it was dispatched to fix. A verifier reads the
  original work order, the subject diff, and prior reports needed to establish
  whether findings were repaired, then writes a new report. Final review reads
  the work order and the full numbered verification sequence; no actor treats
  a verifier report as permission to expand scope.
- **We are driving the car while we are still building it.** This project uses
  its own process to build that process; the machinery under construction is
  also the machinery in force. Four consequences bind every session:
  *Time-index the standard.* Judge a past artifact against the process that
  existed when it was made, not today's — and say which you are applying. A
  missing artifact whose convention had not been invented yet is not a defect.
  *The excuse has a hard boundary.* "We were still building it" explains absent
  **process** scaffolding. It never excuses a **behavioral or evidence** defect:
  a test that does not test, a guard that does not guard, work that was lost.
  Process immaturity is not an evidence exemption, exactly as "small script" is
  not one.
  *Expect retroactive non-compliance.* Every hardening makes prior work look
  non-conforming. Record the discontinuity as a dated migration note where a
  reader will hit it; never back-fill artifacts to make history look tidy.
  `docs/verifications/README.md` already does this ("Do not fabricate it to make
  the sequence appear complete") — that is this rule in practice.
  *Prefer forward-only enforcement.* A new guard binds new work. Do not
  retroactively invalidate merged work unless a real defect is demonstrated.
  *Disclose a self-referential instrument.* When the machinery you use to do
  your job — the control log, a lifecycle script, a generator — is itself part
  of the deliverable you are judging, say so explicitly in your report, and
  verify that machinery independently rather than trusting it because it
  appeared to work. A broken instrument records the finding that it is broken.
  This is not hypothetical: `VER-001` was allocated and its verdict recorded
  through `scripts/resume.mjs`, a WO-003 deliverable under verification in that
  same report. **This is a disclosure duty on the verifier, not a reason to
  avoid using new machinery.** Dogfooding a tool in the work order that built it
  is how it hardens, and refusing to would ship control planes nobody has
  driven. Abstain only in the narrow case where the instrument's correctness is
  itself the question *and* its failure would be silent — you do not verify a
  checksum tool with itself. Prefer instruments that fail loudly; an append-only
  log with a regenerated projection is safe to dogfood precisely because
  corruption shows rather than producing a plausible record.
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
- **PR titles carry a gitmoji shortcode.** Open each PR title with the shortcode matching
  the change — `:memo:` for documentation-only deliverables,
  `:adhesive_bandage:` for a simple fix to a non-critical issue, standard
  gitmoji otherwise. Titles only: commit messages stay plain, and a merged
  commit is never rewritten to add one. On a squash merge the platform copies
  the PR title into the commit subject — that inherited emoji is fine; the
  plain rule governs hand-authored messages. Retitle with
  `gh pr edit <n> --title`.
- **Return shape.** End with a compact result: what changed, evidence
  pointers, deviations from the work order, open questions. Terse; no
  narration theater, no apology theater.

## Model-specific notes

- Required model/effort in a work order is a hard constraint (Principle 8) —
  if you are not it, stop and say so; never silently proceed as a substitute.
  Every work order carries a `Model:` line; `Model: any` means any capable
  model. An absent line is a defect in the work order — flag it, don't guess.
  Note the gap: the `Model:` line pins a model family and has no effort field,
  and no executable check compares the configured effort to the documented one.
  State the model **and effort** you actually ran at in your result, so evidence
  is attributable to the configuration that produced it. This is not
  hypothetical — see the effort-drift note in `docs/PLAYBOOK.md` §Who does what.
- Behavioral guidance rots across model generations; that is why it lives here
  as typed mechanisms and docs instead of prompts. If an instruction here
  fights your model's defaults (e.g., built-in verification), flag it in your
  result rather than ignoring it.
