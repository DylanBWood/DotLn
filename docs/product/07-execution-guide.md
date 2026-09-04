# Execution guide — for any model session working in this repo

You may be Claude (any tier), Codex, or something newer. The repo, not your
transcript, is the shared memory. This guide is the operating contract.

## Read order for a cold start

1. `CLAUDE.md` / `AGENTS.md` (same file) — boundary rules.
2. Your assigned work order in `docs/work-orders/` — your entire task scope.
3. The blueprint docs it cites (`docs/product/…`) — cited sections only; do not
   bulk-load the corpus into context. The ledger and intake exist for lookup,
   not for reading end-to-end.

## Operator resume phrases — how you get dispatched

The operator's entire instruction to you may be a single phrase of the form
`resume: <intent>`. That phrase **is** your dispatch. Do not ask for context and
do not ask which work order: the durable control state answers both, and the
operator is deliberately not repeating themselves.

1. Run `npm run resume --silent -- status --json`. The JSON names the active work order
   and its authoritative path, the current phase, latest verification artifact
   and verdict, final review, latest actor attestation, effort drift, latest
   checkpoint, and legal next actions. Both `status` forms fold the canonical
   append-only `docs/control/resume.jsonl`; both are read-only and neither
   appends an event nor rewrites `docs/control/current.md`. The Markdown file is
   a disposable human projection, never an API: lifecycle peers consume the
   JSON status, while an operator may read the Markdown. If either status form
   warns that the projection disagrees with the fold, trust the returned fold,
   report the mismatch, and let the next legal state-changing command refresh
   the projection; never repair it by hand.
2. Run the matching transition and follow the paths it prints — they are
   authoritative, and they are the whole briefing:

   | Operator says           | You run                                                                                                                                                                                                                    | You then                                                                                                                                                                                                                                                                 |
   | ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
   | `resume: status`        | `npm run resume -- status` (or `npm run resume --silent -- status --json` for a machine consumer)                                                                                                                          | report; both forms are read-only, append nothing, and do not rewrite a stale Markdown projection                                                                                                                                                                         |
   | `resume: next`          | `npm run resume -- next`                                                                                                                                                                                                   | in `active`, execute the emitted work-order path; in `closed`, report that the repo is between work orders and give the exact `worktree start` command                                                                                                                   |
   | `resume: fix`           | `npm run resume -- fix`                                                                                                                                                                                                    | repair, reading BOTH the original work order and named failure source; if a repair was prematurely marked complete, the phrase may reopen it only while that unresolved source remains                                                                                   |
   | `resume: verify`        | `npm run resume -- verify`                                                                                                                                                                                                 | verify, writing the exact `VER-NNN` path it allocates                                                                                                                                                                                                                    |
   | `resume: final review`  | `npm run resume -- final-review`                                                                                                                                                                                           | review into the allocated `FINAL-NNN`; on pass, record it, commit the reviewed state, push only the WO branch, and open its PR                                                                                                                                           |
   | `resume: release close` | run the exact `cd <main> && node <subject>/scripts/release.mjs close WO-NNN --publish` command projected by `resume release-close` or printed by `worktree publish`; after the subject is already removed, use main's copy | finish the merged worktree with the reviewed subject helpers, update main, and either publish the validated annotated tag plus its matching GitHub Release or record the honest no-release result; if Release creation fails after the tag push, rerun from updated main |

   At the dated Codex baseline, run each **state-changing** `resume` command
   with explicit outside-sandbox approval on its first invocation. Codex
   workspace-write protects the resolved Git directory, while each transition's
   recovery checkpoint writes a Git object and ref there. `status` is read-only;
   `next` appends no event and creates no checkpoint but refreshes the workspace
   projection. Neither needs Git escalation. Never run a transition sandboxed
   and then repeat it: the transition records even when its optional checkpoint
   fails. Outside-sandbox approval covers the entire project-controlled `npm`
   process, not only Git. Inspect the exact command, the `resume` mapping in
   `package.json`, and the current `scripts/resume.mjs` diff before requesting a
   one-invocation approval; never persist an allow rule for it. See
   `docs/AI-HARNESS-SECURITY.md` for the tested versions, Claude's current
   behavior, verification, and rollback.

3. Record your outcome when your evidence exists, not before:
   `npm run resume -- implementation-ready <actor-flags>` (executor: the
   deliverable is built and its work-order evidence is green, so it is ready to
   verify), `npm run resume -- verification-result pass|fail <actor-flags>`,
   `npm run resume -- repair-complete <actor-flags>`, or
   `npm run resume -- final-review-result pass|fail <actor-flags>`. The required
   suffix is
   `--harness <harness> --harness-version <version> --model <model> --effort <effort> --source <source>`;
   use the exact usage printed by a refusal and never infer a value the harness
   did not expose. Before `verification-result` or `final-review-result`, put
   exactly one `**Actor attestation:** {<normalized actor JSON>}` line in the
   allocated report beside the human-readable actor prose. The completion
   command refuses if that header is absent, malformed, or differs from its
   flags; an unrecognized supplied effort appears in the JSON as `unknown` plus
   `raw`. This pre-append check resolves the report/event ordering without
   editing immutable evidence afterward. **A repair episode is not
   finished until `repair-complete` is recorded** — otherwise the next session
   resumes into the wrong phase. The remaining action,
   `npm run resume -- activate WO-NNN docs/work-orders/<file>.md`, opens a work
   order from phase `none` or `closed`; `npm run worktree -- start` runs it
   automatically when creating a work-order worktree, then prints the shell-safe
   absolute `cd`, `codex`, and `resume: next` handoff. It does not launch or
   inspect Codex in this projection; the operator performs those three handoff
   steps manually. If the operator finds that a repair was incomplete after
   `repair-complete` but before re-verification, `resume: fix` may append
   another `RepairRequested` against the preserved failure source. It is refused
   for an initial implementation-ready state with no failure source. The
   corrected executor records a new `repair-complete`, producing a fresh
   checkpoint before the independent verifier is dispatched; it never edits or
   allocates a verification report itself.
4. Illegal transitions refuse and append nothing. A refusal means your
   understanding of the phase is wrong. Run the corrective command named in the
   refusal rather than forcing or working around it.

`resume: next` answers the current slot's lifecycle question; it does not select
a backlog order when the repository is between work orders. For the provisional
portfolio view, read
[`docs/planning/work-order-map.md`](../planning/work-order-map.md). Keep its
three answers separate: legal lifecycle transition, dependency/preflight
eligibility, and recommended choice. Never infer any of them from the next
integer. The map is a dated human projection, so revalidate its candidate
against the authoritative work order and current control evidence before
activation.

`resume: final review` and `resume: release close` carry narrowly scoped
external-effect authority. A passing final reviewer may commit the reviewed
state, push only its work-order branch, and open the mergeable PR; it may never
merge it. Release close may create and push only the validated annotated tag and
create the matching GitHub Release as a projection of that tag's reviewed human
layer; it may never edit a published Release, push `main`, publish
packages/binaries, or change repository settings. The operator retains PR merge
authority and explicitly supplies the release-close phrase before tag and
Release publication.

After recording a passing final review and committing the reviewed state, the
reviewer uses the durable publication mechanism below with a committed,
contained PR body file:

```bash
npm run worktree -- publish WO-NNN --title '<reviewed title>' --body-file <contained-reviewed-body-path>
```

The helper first runs the release-surface preflight and validates the committed
five-section `RELEASE-NOTES.md` beside the final-review report. The current
`PR.md` and notes must use one physical source line per prose paragraph or
list-item paragraph, retaining separate lines only for semantic Markdown
structure; the helper transports those reviewed bytes without reflowing them.
Only then does it preflight GitHub CLI, push the work-order branch, open the PR,
and print the exact post-merge release-close handoff.

`main` is protected by a GitHub ruleset requiring a PR. The classic branch
protection endpoint can return 404 while that ruleset is active, so its result
alone must never justify a direct push. The workflow has no direct-main-push
path; ruleset-aware API preflight remains a separate hardening candidate.

The operator's own copy of this loop lives in `docs/PLAYBOOK.md`; this section
is the executor's half of the same contract.

## Operator-opened ideation mode

The operator may explicitly reopen ideation during work-order execution,
including by expanding the subject of the current work order. A message prefixed
`ideation:` is that dispatch unless the same message says `capture only` or its
equivalent. By default it invokes the complete durable pipeline—capture,
clean-room review, synthesis, ledger append, product-doc write-back, and any
required scope-expansion receipt—not intake persistence alone. Do not make the
operator restate those stages.

The work order becomes context rather than a scope fence during the breakout.
Preserve its existing changes. If the operator also says to continue the work
order, complete the breakout and its receipt, then return to the authorized
work; otherwise wait for an explicit instruction before resuming execution.

Interpret the operator's situations and analogies **shape first**, including in
earlier intake. The intended payload is ordinarily a relationship, interaction,
transition, contrast, feedback loop, or felt user experience; factual or
technical identity with the reference is not required. Extract that shape, then
lower it progressively through observable interaction, domain mechanics,
contracts/evidence, and environment-selected technology. Do not discard a useful
shape because the analogy is imperfect, and do not import incidental source
details as architecture. Verify a literal detail only when it becomes
load-bearing, otherwise retain it as operator recollection or leave it open.
This rule does not authorize a bulk reread of intake, a rewrite of older ledger
entries, or reopening an ADR or settled resolution. Apply it to material already
inside the authorized ideation subject; surface a genuine new tension through
the existing decision process.

In ideation mode:

1. Capture unedited material in a dated file under `docs/intake/chats/`,
   `docs/intake/notes/`, or `docs/intake/images/`. The intended survivor is the
   main control-plane checkout's ignored intake, resolved explicitly rather than
   assumed from a relative path. If the active harness cannot write there, a
   worktree-local capture is provisional staging: preserve it, name the pending
   reconciliation in the receipt, back it up, and reconcile it before worktree
   removal. Intake is local-only and gitignored; preserve fragments, repetition,
   uncertainty, and contradictions.
2. Apply the clean-room boundary before synthesis. If material resembles
   employer code, configuration, identifiers, proprietary API shapes, internal
   services, or managed-work-host details, stop and flag it. Never promote
   suspect material.
3. Synthesis authority is part of a bare `ideation:` dispatch. Rewrite ordinary
   raw material rather than copying it. If the operator instead supplies exact
   public-draft wording, explicitly directs it to be filed as written, and uses
   intake only as a compaction-safe mirror, preserve that authorship and record
   the direct-filing provenance on the committed surface. Never infer this
   exception from polished wording or a filename, and apply the same clean-room
   screen before filing. Append each significant idea to
   `docs/lineage/idea-ledger.md` with lifecycle status and provenance; never
   rewrite an older ledger entry. Only an explicit capture-only instruction
   stops after raw intake.
4. Promote only durable product understanding into the relevant `docs/product/`
   document, and update an ADR only through its permitted amendment mechanism.
   Preserve speculative ideas as `raw` or `preserved` instead of forcing
   premature architecture.
5. Treat tensions with settled resolutions as tensions to surface, not license
   to silently overwrite them. A real challenge based on new evidence becomes a
   decision-record proposal.
6. Keep pre-existing implementation changes intact and distinguish them from
   ideation artifacts. Finish any required breakout receipt before resuming
   coding, verification, or work-order closeout; resume only when the operator
   has explicitly asked to continue.

These steps are the current manual projection of the Clean Room active described
in `05-pattern-library.md`. Bare `ideation:` uses the repository's saved public
destination loadout: the locked employer/secret floor, Shape-First Synthesis,
public vocabulary, provenance, and breakout review. Explicit operator-authored
ready-to-file text replaces the transformation strategy with Direct Draft
Fidelity; it does not remove any guard. Additional context or assurance supports
may deepen review and evidence, but a lighter support set never weakens the
floor. Until the mechanic is compiled, the receipt records the effective
strategy and any extra review support used.

### Ideation breakout receipt and verification

An ideation breakout that changes committed documentation is not complete at
synthesis. Record the operator's explicit scope-expansion authority in the
affected work order (or a new bounded work order), together with a receipt that
names the raw intake batch, ledger entries, product/decision/schema surfaces
changed, unresolved choices, and required review.

The eventual verifier and final reviewer must digest that receipt and the
promoted documents as part of their subject—not treat them as incidental notes.
They verify the selected clean-room source treatment and any direct-filing
provenance, traceability to operator intent, consistency with settled decisions
and canonical vocabulary, version/schema effects, internal cross-references, and
whether speculative choices were accidentally presented as settled. They may
propose and apply authorized, non-substantive handoff/documentation corrections.
Any correction affecting code, contracts, acceptance, schema, compatibility,
authority, or prior evidence fails final review and returns through repair plus
a fresh independent numbered verification before another final-review attempt.
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
is a convenience, not a requirement. Today `npm run backup:intake` archives only
the caller's checkout and does not synchronize it with main. Normal closeout
refuses a worktree-local note, but canonical reconciliation remains manual until
the candidate intake control in `03-architecture.md` exists.

## Workflow closeout and releases

Final review prepares and publishes a clean PR; the operator retains merge
authority. After the PR is merged, `resume: release close` runs the guarded
close command. It updates `main`, proves the reviewed branch is contained in
`origin/main`, and removes only its known worktree and merged branch. Ordinary
tracked or untracked dirt is refused by the clean-worktree gate. Ignored raw
material under `docs/intake/` must be backed up and reconciled into the
surviving main intake as appropriate; the helper separately refuses removal
while any non-disposable ignored file exists — protected intake material, a
stray `.env`, any other ignored path — naming the offending file, and never
deletes or auto-promotes it. Known disposable ignored dependency/build outputs
may leave with the worktree only at the anchored root `node_modules/` or
`dist/` paths, at `packages/<name>/node_modules/` or
`packages/<name>/dist/`, by a `.DS_Store` basename, or by a
`.tsbuildinfo` suffix. A matching segment elsewhere is not disposable, and the
`docs/intake/**` protection takes precedence over every build-shaped name. The
same command then evaluates whether the completed roadmap rung is a release
boundary.

The main checkout's exact `.claude/settings.local.json` is persistent
operator-owned harness state, not a release or test input. The main-checkout
release-influence guard permits only that exact root path, protected
`docs/intake/**`, and the anchored disposable outputs above. This is not a
cleanup allowance: a subject-worktree copy of the settings file is
non-disposable, so worktree removal refuses and preserves the file, branch, and
worktree. Never broaden this to `.claude/**`, copy or inspect the settings as
evidence, or treat them as disposable cleanup.

When a planner pins a tagging target above the latest published tag, updating
the root README release block to that target is an executor deliverable, not a
post-tag repair. After synchronization and before dependency installation,
`release close` runs the same `check-surfaces` preflight as `worktree publish`:
the README block must match release truth, every component whose `src/` changed
since the preceding tag must have a different component version, and the
current committed PR/release-note bodies must satisfy the renderer-wrapped
profile. Failure reports observed and expected values and stops before `npm ci`,
tag creation, or GitHub mutation.

For a release boundary, the command works from the fetched `origin/main` HEAD to
which local `main` was fast-forwarded, not a separately resolved work-order
merge commit. The reviewed work-order branch must be contained in that history;
any later commits already present at synchronization are included in the tagged
source. The command runs `npm ci` before release evidence, proves the
install/evidence leave tracked files unchanged, populates and re-validates the
immutable manifest, assembles the five-section edition from reviewed notes in
first-parent order, and creates and pushes only their annotated tag. After that
push succeeds, it creates the matching GitHub Release from the human layer; the
JSON manifest remains in the tag rather than being pasted into the projection.
The current release-note prose remains byte-exact from final review through the
tag and GitHub projection; no close-time formatter inserts a source width.
The publish form is authorized by the operator's phrase; a raw run without
`--publish` performs guarded closeout and validation, then prints the exact
authorized tag command. Never tag the feature branch, tag failing evidence, move
an existing tag, edit a published Release, push `main`, or imply that
npm/binary/hosted distribution occurred when the release is source-only. A
failed release check opens a patch work order. A version strictly below the
latest tag is an explicit no-release outcome and leaves the clean closed
checkout between work orders. An equal version is idempotent only when the
existing validated annotated tag names the exact current commit; a mismatch
refuses.

Both release-close forms perform guarded synchronization and cleanup before
evaluating the release boundary: they may fast-forward local `main` and remove
the known merged worktree and local branch. At a new eligible boundary they also
run `npm ci` and the evidence gate; lower or already-published targets return
after their own validation. Under `--publish`, GitHub CLI availability and
authentication are checked before tag-object creation. If GitHub Release
creation fails after the validated tag was pushed, the command exits non-zero,
leaves that immutable tag intact, and names the recoverable state. Rerunning the
same close command validates the equal tag byte for byte, creates the missing
Release, or refuses at the first differing body line; it never edits the
Release. Every equal-tag retry reproduces release evidence before re-deriving
compatibility, so ignored built output is never trusted merely because it
already exists.
Omitting `--publish` withholds tag and Release creation; it is preparation, not
a read-only command.

The first post-merge close always runs the reviewed helper from the still-
present subject worktree while the shell's working directory is the main
checkout. `worktree publish` and `resume release-close` print that exact
absolute command. The loaded subject `release.mjs` delegates cleanup to its
sibling subject `worktree.mjs`, so a policy change in the just-merged work order
cannot be bypassed by stale pre-fast-forward main helpers. The helper validates
and fast-forwards main before safely removing its own source worktree. If a
recoverable failure happens after that removal—such as GitHub Release creation
after a successful tag push—the updated main copy owns reruns through ordinary
`npm run release -- close WO-NNN --publish`. WO-004 first needed the shape
because pre-merge main had no release helper; the reviewed-helper rule applies
to every later close as well.

A deliberately deferred eligible release must retain a durable reason in the
follow-on patch work order or another reviewed repository artifact; silence is
not a release disposition.

`npm run release -- notes vX.Y.Z` and `npm run release -- list` inspect local
annotated release records without network access. Historical tags that predate
the reviewed edition may receive a GitHub projection only through the separate
operator-run `release publish-notes vX.Y.Z` command; agents test that path with
a stub but never perform a backfill against origin.

## Discipline

- **Work only from the current work order.** No opportunistic scope expansion;
  adjacent cleanup only under the bounded boy-scout policy (unambiguous, low
  risk, covered by the same verification, doesn't obscure the diff) — otherwise
  file a candidate task.
- **Evidence gates over prose.** Completion claims require the work order's
  evidence: passing tests you ran, output you captured, behavior you witnessed.
  Read your own diff before reporting. Never infer completion.
- **Recovery point before destruction.** Never run `git checkout .`,
  `git restore .`, `git reset --hard`, `git clean` (any flags), or
  `git stash drop` in a work-order worktree. Until final review, the
  deliverable, every `VER-NNN`, and `docs/control/resume.jsonl` are typically
  uncommitted, and `docs/intake` is gitignored single-copy raw material that is
  in no commit at all. Valid control transitions create the only
  pre-final-review checkpoint commits as local `refs/dotln/checkpoint/...` refs;
  do not add hand-written checkpoint commits to the work-order branch. Before
  any rollback, preserve the current dirty tree with a named
  `git stash push --include-untracked -m 'WO-NNN recovery before rollback'` and
  never drop that stash. Git's stash stack is shared across every worktree of
  this repository, so a concurrent session can reorder or consume entries;
  re-find yours by its `-m` tag, never by `stash@{n}` position, and restore with
  `git stash apply`, not `pop`. Restore only from the exact latest checkpoint
  ref advertised by the current control projection, and say in your result which
  recovery point you used. Ignored intake is outside both mechanisms and must be
  backed up separately.
- **Verification artifacts are immutable and numbered.** Verifiers write to
  `docs/verifications/WO-NNN/VER-NNN.md`; the first pass is `VER-001.md` and
  every re-verification creates the next number instead of replacing a prior
  report. The original `docs/work-orders/WO-NNN-*.md` remains scope authority. A
  repair episode reads both that original work order and the specific
  verification artifact it was dispatched to fix. A verifier reads the original
  work order, the subject diff, and prior reports needed to establish whether
  findings were repaired, then writes a new report. Final review reads the work
  order and the full numbered verification sequence; no actor treats a verifier
  report as permission to expand scope.
- **We are driving the car while we are still building it.** This project uses
  its own process to build that process; the machinery under construction is
  also the machinery in force. Four consequences bind every session: _Time-index
  the standard._ Judge a past artifact against the process that existed when it
  was made, not today's — and say which you are applying. A missing artifact
  whose convention had not been invented yet is not a defect. _The excuse has a
  hard boundary._ "We were still building it" explains absent **process**
  scaffolding. It never excuses a **behavioral or evidence** defect: a test that
  does not test, a guard that does not guard, work that was lost. Process
  immaturity is not an evidence exemption, exactly as "small script" is not one.
  _Expect retroactive non-compliance._ Every hardening makes prior work look
  non-conforming. Record the discontinuity as a dated migration note where a
  reader will hit it; never back-fill artifacts to make history look tidy.
  `docs/verifications/README.md` already does this ("Do not fabricate it to make
  the sequence appear complete") — that is this rule in practice. _Prefer
  forward-only enforcement._ A new guard binds new work. Do not retroactively
  invalidate merged work unless a real defect is demonstrated. _Disclose a
  self-referential instrument._ When the machinery you use to do your job — the
  control log, a lifecycle script, a generator — is itself part of the
  deliverable you are judging, say so explicitly in your report, and verify that
  machinery independently rather than trusting it because it appeared to work. A
  broken instrument records the finding that it is broken. This is not
  hypothetical: `VER-001` was allocated and its verdict recorded through
  `scripts/resume.mjs`, a WO-003 deliverable under verification in that same
  report. **This is a disclosure duty on the verifier, not a reason to avoid
  using new machinery.** Dogfooding a tool in the work order that built it is
  how it hardens, and refusing to would ship control planes nobody has driven.
  Abstain only in the narrow case where the instrument's correctness is itself
  the question _and_ its failure would be silent — you do not verify a checksum
  tool with itself. Prefer instruments that fail loudly; an append-only log with
  a regenerated projection is safe to dogfood precisely because corruption shows
  rather than producing a plausible record.
- **Settled is settled.** The idea-ledger Resolutions and `docs/decisions/`
  close their questions. Do not relitigate; a genuine new-evidence challenge
  becomes a new decision record proposal, never an in-place edit. Exception:
  each ADR carries an appendable **Amendments** section for notes within the
  decided constraints (a dev-dependency, a tooling choice) — appending there is
  not an edit of the decision.
- **Precedence.** When a work order's authority clause conflicts with a standing
  duty in this guide, the work order wins; note the skipped duty in your result
  as an open question. Doc-only work lands directly on the working branch the
  operator gave you — code goes to worktrees/branches per the isolation rule.
- **Ledger duty.** If your work supersedes, transforms, or adds a design idea,
  append to `docs/lineage/idea-ledger.md` (never rewrite existing entries) and
  update the blueprint doc in the same change.
- **Isolation.** The main checkout is the control plane. Model-authored code
  changes happen on branches/worktrees; verify `pwd` and repo root before any
  git operation.
- **No new dependencies** without a one-paragraph note in the relevant decision
  record. The kernel stays framework-free, period.
- **No config mutation of safety boundaries** (git config, hooks, permissions,
  secrets) unless the work order explicitly authorizes it. Non-safety `.claude/`
  and CLAUDE.md refinement may grow iteratively — one line in the config log
  (docs/README.md) per change; a decision record only when a safety boundary
  moves.
- **Configuration layers** (scope × volatility): shared-stable facts in
  committed project docs/settings; machine-local facts in uncommitted local
  files; path-scoped instructions only once the area exists; the bottom layer is
  executable code and tests, which progressively absorbs the prose layers above
  it (ADR-0001's strangler loop).
- **Boundary rules** (from CLAUDE.md): nothing employer-derived enters this
  repo. Ordinary raw ideation is synthesized; exact operator-authored public
  draft text is filed only with explicit direction and recorded provenance. Both
  use the locked Clean Room floor, and anything that smells proprietary is
  flagged rather than incorporated.
- **Projection boundary.** Internal vocabulary (gems, masks, DotLn taxonomy)
  stays out of artifacts consumed outside the system (PRs to other repos,
  generated reports for third parties).
- **PR titles carry a gitmoji shortcode.** Open each PR title with the shortcode
  matching the change — `:memo:` for documentation-only deliverables,
  `:adhesive_bandage:` for a simple fix to a non-critical issue, standard
  gitmoji otherwise. Titles only: commit messages stay plain, and a merged
  commit is never rewritten to add one. On a squash merge the platform copies
  the PR title into the commit subject — that inherited emoji is fine; the plain
  rule governs hand-authored messages. Retitle with `gh pr edit <n> --title`.
- **Return shape.** End with a compact result: what changed, evidence pointers,
  deviations from the work order, open questions. Terse; no narration theater,
  no apology theater.

## Model-specific notes

- A required model is a hard constraint under Principle 8, and declared effort
  is a hard constraint under the active work order and WO-019 mechanism. If you
  do not meet either, stop and say so; never silently proceed as a substitute. Every
  newly activated work order carries both a `Model:` line and an `Effort:` line
  declaring `executor`, `verifier`, and `reviewer` as `any` or a minimum on
  `low < medium < high < xhigh < max`. `Model: any` means any capable model;
  effort remains independently constrained. The leading metadata region
  contains exactly one of each field, with the complete Effort field following
  Model apart from blank lines; duplicate, body-buried, reordered, missing, or
  malformed declarations refuse. `resume -- next` repeats both complete source
  fields in the dispatch briefing.
- The four completion events carry an `actor` attestation: harness and version,
  model, effort, and epistemic source. Recognized ladder values remain exact; an
  unrecognized label is stored as `effort: unknown` plus its verbatim `raw`
  value. A recognized claim is accepted only when bounded discovery records
  that value for a harness version listed as observed through a versioned
  selector or readback; otherwise the actor must attest `unknown`. Each
  harness's `versions` array is observation history in oldest-to-newest order,
  with the newest entry last. Any listed observed version remains valid; append
  a newly observed version rather than replacing an earlier one. Refusals name
  the observed versions on record so an upgrade gap is visible before a report
  is filed. `unknown` satisfies only a role declared `any`. A below-minimum
  transition appends nothing and can proceed only after a dated operator
  amendment to the work order—not an override flag. `harness-readback` is valid only where
  `docs/discovery/environment.json` records an observed effective session
  readback for that exact harness/version; a persisted setting or accepted
  launch selector alone is not readback. `self-reported` deliberately records a claim rather than
  surveilling the session to prove it: the declared-effort gate compares that
  claim, and the source label states the evidence limit. This does not authorize
  silent degradation; it prevents an unobserved value from masquerading as
  observed fact. Echo the attested values in the session result, but the log is
  the durable record and `current.md` projects the latest value and within-order
  drift.
- A session label can describe more than reasoning effort. The documented
  Claude Code `ultracode` note means dynamic workflows plus `xhigh` reasoning;
  only the latter occupies the effort ladder. When that dated operator
  attestation applies, the actor still supplies both `--effort xhigh` and
  `--source operator-attested`. `resume` points an unrecognized `ultracode` claim to the
  note but never converts it automatically, and no other unknown label inherits
  the mapping.
- Actor flag values are one-line data. Control characters and Unicode line
  separators refuse rather than entering the Markdown projection. Use
  `not-applicable` when a field is structurally absent, and `unknown` when a
  value exists but cannot be known. The conventional unassisted-human tuple is
  harness `human`, harness version `not-applicable`, model `human`, effort
  `unknown`, and source `operator-attested`.
- **Migration note (2026-09-02):** effort enforcement is forward-only from
  WO-019. Historical work-order headers, completion events, and report prose are
  not backfilled or invalidated. New activations carry
  `effortDeclarationValidated: true`; a still-active pre-WO-019 event without it
  can finish against a visibly synthesized `any` declaration if Effort is
  absent, while WO-019 and every marked activation remain strict. In particular, WO-001 through WO-003 retain the
  disclosed low-versus-documented-xhigh drift, and historical free-form labels
  remain what their reports said rather than being rewritten into the new
  ladder. See `docs/PLAYBOOK.md` §Who does what.
- Behavioral guidance rots across model generations; that is why it lives here
  as typed mechanisms and docs instead of prompts. If an instruction here fights
  your model's defaults (e.g., built-in verification), flag it in your result
  rather than ignoring it.
