# WO-018 — Control-plane consolidation: shared helpers, machine-readable state, manifest from the built kernel, v0.4.1

**Model:** any capable model. State the model and effort actually run in the
result (07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** `v0.4.1`, the compatible patch strictly above the
published `v0.4.0` observed at activation. The activation helper retained the
draft placeholder; under the operator's `resume: next` dispatch, the executor
forward-corrected that mechanical preflight miss on 2026-09-04 without editing
the append-only activation event. The application change remains tooling and
evidence correction. `@dotln/kernel` advances from `0.2.0` to `0.2.1` for the
additive, type-exhaustive `CADENCE_KINDS` compatibility-data export required by
criterion 5; `@dotln/skeleton` source and version remain `0.4.0`, while its exact
kernel dependency advances to `0.2.1`.
**Nomination provenance:** the operator's 2026-09-02 entropy review, including
an independent read of `scripts/`; opaque identifier.
**Direct-draft provenance:** the operator supplied this complete public draft
and explicitly directed that it be filed. The same message was first preserved
in ignored intake only as a compaction-safety copy, so its earlier filesystem
timestamp does not make it the source of an agent-authored synthesis. Both
artifacts descend from one operator-authored filing instruction. The operator
confirmed that direction during VER-001 repair; the clean-room screen found no
employer, credential, internal-service, or other stop condition.
**Depends on:** WO-017 merged; criterion 5 consumes its exported evaluable-kind
constants. WO-013 is recommended sequencing because both orders edit the shell
suites, but hunk overlap is not a semantic dependency. If WO-013 has not landed,
activation must baseline and reconcile the overlapping fixture edits explicitly.

**Cites (read these sections):** 07-execution-guide.md §Operator resume
phrases and §Workflow closeout and releases; 03-architecture.md §Session
lifecycle & resilience (resume control v1: the log is canonical, the Markdown
is a disposable projection); `docs/releases/README.md`; 06-roadmap.md §Release
boundary; `docs/final-reviews/WO-015/FINAL-001.md` §Remaining deviations
(shared refusal message; trace assertion guard; the post-`default:` parser
gap); `docs/work-orders/codex-downtime-series.md` (corpus promotion is a
reviewed change); 01-principles.md Principles 5 and 6.

**Objective:** Stop the four lifecycle scripts diverging. Collapse duplicated
helpers into one library, make control state machine-readable so sibling
scripts stop parsing a Markdown projection, derive the release manifest's
grammar fields from the built kernel instead of a source-text parser, close
one data-loss gap, and make the test chain exercise what it claims, without
losing a single existing guard.

**Observed problems (dated 2026-09-02):**

- `containedRegularFile` exists three times; the git runner four times under
  four conventions; the ignored-material guard twice with different
  allowlists; `ensureClean` twice with different strictness; the work-order
  authority check three times; branch teardown twice. Bare `JSON.parse` on
  `package.json` in two scripts loses the filename on failure.
- `worktree.mjs` gates `publish` and `finish` on
  `stdout.includes("- Phase: closed")`; `release.mjs` regexes `^- <label>:`
  lines out of `current.md`. The projection is being used as the API.
- `release.mjs` derives the manifest's cadence kinds by regex over `core.ts`
  and `types.ts`, and the control-log schema version by matching a source
  literal in `resume.mjs`. That parser refused the first v0.2.3 close; WO-015
  repaired it in place, and its own final review recorded that a `case` after
  `default:` still classifies silently as deferred.
- `resume.mjs`'s `fold` has no `default`: an unknown event type advances the
  log and silently leaves the projection unchanged, while `readEvents`
  refuses malformed JSON.
- Data loss: the disposable classifier treats any path segment named `dist`
  or `node_modules` as disposable, so an ignored file at
  `docs/intake/dist/notes.md` passes the refusal and is destroyed by
  `git worktree remove`. Protecting `docs/intake` is the guard's purpose.
- `scripts/test-publication.sh` asks the script for the correct lock, writes
  it into the fixture, then asserts the script agrees with itself. `npm test`
  never runs `check-publication.mjs` against the real repository. The corpus
  identity lane, the one independent oracle under `corpus/`, runs nowhere.

**Scope discipline:** behavior-preserving except the named fixes; every
existing shell suite passes with its assertions unchanged except where an
acceptance criterion names the change; one isolated, evidenced change stage
per numbered deliverable and no worktree commit before final review.

**Deliverables and acceptance criteria (all required)**

1. `scripts/lib/git.mjs` and `scripts/lib/paths.mjs` hold one `runGit`,
   `failureOf`, `runGitPathList`, `ensureClean`, `parseWorktrees`,
   `mainWorktree`, `containedRegularFile`, `readJsonFile` (names the file on
   failure), and the ignored-material classifier. The four scripts import
   them; a grep proves no duplicate definition remains. The two `ensureClean`
   strictnesses and the two allowlists are reconciled to one each, and the
   result states which was chosen and why.
2. The classifier never treats anything under `docs/intake/` as disposable
   and matches build outputs by anchored path rather than by any segment.
   Test: plant `docs/intake/dist/x.md` and `docs/intake/node_modules/y` in
   the subject worktree; `finish` refuses and both survive; the existing
   disposables-leave-with-the-worktree case stays green.
3. `resume.mjs` gains `status --json` emitting the same fields as
   `current.md`; `worktree.mjs` and `release.mjs` read it and contain no
   substring or regex parse of `current.md`. `status` warns, read-only and
   without writing, when `current.md` disagrees with the fold of
   `resume.jsonl`.
4. `fold` refuses an unknown event type with its ordinal, consistent with
   `readEvents`; test added.
5. The manifest's evaluable and deferred cadence lists come from the built
   kernel's exported constants; the source-text parser and its fixtures are
   deleted; the "malformed cadence source" release test becomes "kernel
   constants missing or inconsistent with the type union" and still proves no
   `mktag` or push occurs. The control-log schema version comes from a
   `resume.mjs` export, not a source-literal match.
6. `npm test` runs `check-publication.mjs` against the real repository and
   runs `corpus/harness/wo101-id-corpus.test.mjs`; the Program-lane corpus
   stays outside the chain and is marked frozen in `corpus/README.md`.
7. `test-publication.sh` computes its expected lock with an independent
   `shasum -a 256` and asserts against that. The WO-015 review's carried
   items land: split refusal messages in the manifest deriver, and `test -s`
   guards on the trace assertions in `test-release.sh`.
8. The line count of `scripts/*.mjs` is lower than on `main` and the result
   reports the delta; every guard enumerated across `scripts/test-*.sh` still
   has a failing negative fixture.

**Evidence gate:** every suite green; the new negative fixtures; `cmp` of
`current.md` before and after each transition in `test-resume.sh`; a
simulated release in the fixture proving the manifest's cadence fields equal
the kernel constants; `git diff --check` clean.

**Write-back duty:** 07-execution-guide.md and `docs/PLAYBOOK.md` for
`status --json`; `docs/releases/README.md` for the manifest source;
`corpus/README.md` for the promoted lane; ledger entry (adopted: control state
is data, and a projection is never parsed as an API).

**Non-goals:** changing any lifecycle phase or transition; `dotln status`
(WO-009); Linux portability of `stat -f`; a `recover` action; rewriting the
shell suites beyond the named lines; a `program` field in the manifest (record
as a candidate); touching `docs/verifications/` or `docs/final-reviews/`.

## Scope clarification — local harness settings (2026-09-03)

The operator's WO-016 ideation identified one persistent false-positive in
release close: the main checkout's exact `.claude/settings.local.json` is
ignored operator-owned harness state, yet `release.mjs` rejects it before
classifying release evidence. Repository scripts and tests do not read that
file. Its contents were not inspected during the diagnosis.

This clarification is part of WO-018's required classifier consolidation:

1. Add the exact root `.claude/settings.local.json` to the repository ignore
   contract and permit only that path in the main-checkout release-influence
   guard. Do not permit `.claude/**`.
2. Keep release influence and destructive cleanup as separate policy
   questions over shared path-classification primitives. A
   subject-worktree-local `.claude/settings.local.json` is non-disposable;
   `finish` and release cleanup must refuse while preserving the file,
   worktree, and branch.
3. Extend the release fixture to prove a no-release close succeeds while the
   main checkout's settings file and `docs/intake/` both survive. Retain the
   foreign ignored-file refusal unchanged.
4. Extend the worktree fixture to prove a subject settings copy blocks removal
   and survives. Retain the intake-protection fixture, including the
   `docs/intake/dist/**` precedence case from criterion 2.
5. Update `docs/PLAYBOOK.md`, `07-execution-guide.md`, and
   `docs/AI-HARNESS-SECURITY.md` with this asymmetric treatment. Do not rewrite
   historical final reviews that correctly described the guard before this
   change.

For criterion 1 above, the original phrase “the two allowlists are reconciled
to one each” means one named implementation of each policy with common parsing
and containment rules. It does not authorize using the release-influence
allowlist as the disposable-worktree list. This clarification adds no right to
copy, display, normalize, replace, or interpret personal harness settings.

## Operator amendment — harness-version attestation slot (2026-09-03)

**Provenance:** the operator directed this amendment during WO-008's final
review. Evidence: `docs/verifications/WO-008/VER-001.md` §Attestation gate and
§Control-plane limitation this exposes; the one-line
`docs/discovery/environment.json` edit in the WO-008 change set.

**Observed problem (dated 2026-09-03):**

- `docs/discovery/environment.json` holds exactly one observed `version` per
  harness under `effortReadbackProbe.harnesses`, and `effortHarnessEvidence()`
  in `scripts/resume.mjs` accepts an actor's `--harness-version` only when it
  equals that single value. Every Claude Code upgrade therefore silently
  invalidates all effort attestation for that harness until discovery is re-run,
  and the failure surfaces only at the next `verification-result` or
  `final-review-result`, after the report exists. WO-008 hit it the same day the
  probe was recorded: the probe observed `2.1.259` at 14:12, the verifier ran
  `2.1.260`, every attestation was refused regardless of `--source`, and the
  operator replaced the datum by hand, which retired the `2.1.259` observation
  instead of adding to it.
- The Claude Code session label `ultracode` is not an effort value and
  normalizes to `unknown`, which cannot satisfy any `xhigh+` role. **Recorded
  mapping:** the operator attested on 2026-09-03 that `ultracode` means dynamic
  workflows plus `xhigh` reasoning effort, two axes of which only the second is
  what the effort ladder measures. A Claude Code session labelled `ultracode`
  therefore attests `--effort xhigh --source operator-attested` unless the
  harness exposes an observed readback. This is a recorded operator attestation,
  not a harness observation, and it does not license treating any other
  unrecognized label as a recognized value.

**Deliverables and acceptance criteria added (all required):**

9. `effortReadbackProbe.harnesses.<harness>.version` becomes an observed
   `versions` list (each entry classified, the newest last); the matcher in
   `resume.mjs` accepts any listed observed version; recording a newly observed
   version appends to the list rather than replacing it; and the attestation
   refusal names the versions on record. Tests: a listed older version still
   attests; an unlisted version still refuses with the recorded versions in the
   message; the existing WO-004 file shape and `--source harness-readback`
   refusal behave as before.
10. The `ultracode` mapping above is recorded in `docs/discovery/environment.json`
    as a documented session-label note beside the `claude-code` entry, and the
    effort refusal for an unrecognized label points the actor at that note.
    `resume` never converts a label into an effort value on its own; the actor
    still supplies `--effort xhigh --source operator-attested`, and the WO-019
    rule that an unrecognized label is stored as `unknown` plus `raw` stands.

The write-back duty extends to 07-execution-guide.md §Model-specific notes and
`docs/PLAYBOOK.md` §Who does what for the versions list and the label note.

## Additional Opinion ideation breakout receipt — 2026-09-04

**Authority:** During the active `resume: next` implementation episode, the
operator opened a bare `ideation:` breakout to consider repeatable
implementation and verification opinions, model/effort experiments, and a
sealed reduction/adjudication stage. The operator preauthorized returning to
this implementation step after the breakout. That authority does not request or
authorize verification, final review, publication, or release close.

**Raw intake and reconciliation:** The unedited message is stored at
`docs/intake/notes/WO-018-expanded-ideation-2026-09-04.md` in the main control-
plane checkout's canonical ignored intake. It was first staged under this
worktree, copied without byte changes to main, compared byte-for-byte, and
included in a validated owner-only backup. The redundant worktree staging copy
was removed only after those checks, so closeout has no single-copy intake to
discard.

**Source treatment and clean-room review:** Ordinary Shape-First Synthesis
promoted the relationship—bounded peer episodes over one frozen subject,
followed by lossless consolidation and a one-way adjudication barrier—rather
than copying the operator's exploratory wording. Public model and workflow
labels were treated as examples, not selected providers or inferred capability
facts. The screen found no employer code, configuration, identifier,
proprietary API shape, internal service, managed-host detail, credential,
private identifier, or other stop condition.

**Promoted surfaces:** `docs/product/05-pattern-library.md` holds the candidate
Additional Opinion support and the two-result Second Opinion preset;
`02-domain-model.md` records the candidate subject/cohort/adjudication terms;
`03-architecture.md` records fan-out, sealed reduction, single-writer control,
and worktree/integration topology; `04-interfaces.md` records the prospective
operator affordance without changing current resume commands;
`06-roadmap.md` recommends a verification-only pilot after WO-009 and WO-010;
`09-audit-resilience-privacy.md` records evidence, minimization, and experiment
provenance; `docs/planning/work-order-map.md` preserves the unallocated
candidate; and the newest idea-ledger section records the transformation.

**Settled boundaries and scope:** This candidate does not reopen ADR-0001's
closed founding architecture tournament. It preserves independent verification,
one writable agent per worktree, statechart/Program ownership of control flow,
hard constraints above preference, actual model/effort attestation, and
disagreement as retained data. WO-018 still changes no lifecycle phase,
transition, event schema, legal resume action, package runtime behavior, or
acceptance criterion for this idea. No implementation of opinion cohorts is
authorized here.

**Unresolved choices:** verification-only pilot versus a generic first
implementation; repeated stage command versus an explicit `another opinion`
intent; exact snapshot/result/cohort schemas; sequential versus parallel
transport; count, concurrency, quorum, deadline, cost, cancellation, and stop
rules; blinding and diversity requirements; deterministic versus judgment-based
deduplication; adjudicator identity, tie, and inconclusive policy; whole-
candidate selection versus a separately authorized synthesis episode; losing-
worktree retention and cleanup; private versus public performance telemetry;
and whether final review later becomes eligible. Implementation adjudication
cannot route directly to final review without independent evidence for the exact
selected artifact; changing that would require an explicit assurance-policy
decision.

**Required review:** WO-018 verification and final review must digest this
receipt and every promoted surface. They check source treatment and canonical
intake reconciliation; fidelity to the operator's repeat-or-proceed and
sealed-adjudication shapes; the distinction between Second Opinion and the
general finite cohort; explicit treatment of same-model replicates,
implementation variants, verification panels, and critiques; worktree and
single-writer safety; lossless duplicate/dissent handling; Eye Dr precedence
and confounders; consistency with the settled boundaries above; publication
locks and links; and that a future candidate never appears as current resume
behavior or hidden WO-018 implementation scope.

## Implementation evidence receipt — 2026-09-04

**Executor attestation:** Codex CLI `0.153.0`, `gpt-5.6-sol`, `xhigh`,
`self-reported`. The implementation started from `162cd12f`, the governed
post-`v0.4.0` mainline base. This is executor evidence only; no independent
verification or final-review result is claimed.

**Implementation subject and policy choices:** `scripts/lib/git.mjs` now owns
the single Git runner, NUL path-list reader, failure formatter, strict
cleanliness guard, worktree parser/main resolver, and merged-branch removal;
`scripts/lib/paths.mjs` owns contained-file, named-JSON, work-order-authority,
and ignored-path classification. The unified cleanliness policy is the stricter
`git status --porcelain --untracked-files=all`: lifecycle mutation must not hide
an untracked file merely because an older caller used Git's default summary.
One classifier supplies shared path parsing and precedence, but exposes two
deliberately different answers. Destructive cleanup permits only anchored build
outputs/metadata and never anything under `docs/intake/` or local harness
settings; release evidence additionally tolerates canonical intake and the exact
root `.claude/settings.local.json` because neither is an evidence input. This
keeps common mechanics without conflating preservation with evidentiary
influence.

`resume status --json` projects the canonical fold with exact stable fields;
both status forms are read-only and warn when the Markdown projection drifts.
Worktree and release consumers use structured state or the committed JSONL at
`HEAD`, never `current.md`, and the fold rejects an unknown event with its
ordinal. `finish` checks committed closed state before destructive cleanup. The
first post-merge close runs the reviewed subject helpers against main, including
when pre-fast-forward main contains stale lifecycle code. Every equal-tag
recovery reproduces evidence before it validates and projects the immutable tag,
replacing ignored built-kernel output whether that output is absent, stale, or
otherwise untrusted.

`@dotln/kernel` `0.2.1` exports the type-exhaustive `CADENCE_KINDS` tuple in
addition to the existing evaluable-kind data. Release compatibility imports the
built module, requires the complete tuple, runtime constructor names and factory
discriminants to agree bidirectionally, requires evaluable kinds to be a unique
nonempty subset, and derives deferred kinds by difference. The control schema
comes from the exported `CONTROL_LOG_SCHEMA_VERSION`. No source-text cadence or
resume-literal parser remains. `@dotln/skeleton` source and version stay at
`0.4.0`; only its exact local kernel dependency advances to `0.2.1`.

**Acceptance evidence:** The exact status-projection tests cover active, drift,
and closed shapes; unknown-event, listed-old-version, unknown-version, and
`ultracode` guidance plus malformed and prototype-label fixtures cover control
refusal. Worktree fixtures cover
canonical intake precedence (including `dist` and `node_modules` beneath it),
the exact settings asymmetry, unrelated nested build-shaped paths, allowed
disposables, a foreign invocation root, stale helpers, and assume-unchanged live
control bytes. Release fixtures cover missing/all-only/constructor-only/unknown-
evaluable cadence data with nonempty Git traces and unchanged refs, a schema
export changed from `1` to `7`, the exact settings exception and sibling
negative, stale-main cleanup, and recovery that replaces stale ignored built
kernel output before importing it.
The real repository publication lane and exact eight-test WO-101 identity corpus
now run inside root `npm test`; the Program corpus remains frozen and outside
that chain.

The final executor gate reports 154 package tests passed with zero failures and
the separate identity corpus reports 8/8. The real publication check reports
169/169 product headings indexed, 27 everyday-user and 42 software-engineer
linked sections current. The network-enabled release-surface check observes
application `v0.4.1` above published `v0.4.0`, changed kernel `0.2.1`, unchanged
compiler `0.1.0`, unchanged skeleton `0.4.0`, and no current final-review body.
Formatting and `git diff --check` pass. Top-level `scripts/*.mjs` total 4,378
lines versus 4,387 on `main`, a reduction of 9 lines despite the added guards.
