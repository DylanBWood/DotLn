# WO-176 — Release close finishes on the handoff's word: the executor's completion inventories the worktree's scratch repositories with a declared or lane disposition, the close removes what is disposable, preserves what was declared for keeping, blocks only on an undeclared repository with the exact command that settles it, and writes a record of its own outcome (version assigned at activation)

**Model:** any capable model. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh; verifier xhigh; reviewer any.
**Release classification:** patch. One additive field in two existing
lifecycle events, one declaration command, one flag on the close, one
ignored record; no gate step, no refusal of a completion, no change to
what the reviewer gate judges. Assigned at activation under the standing
opt-out default.
**Cost:** adds `npm run worktree -- material <path> --disposable|--preserve
--reason <text>` (one row in the worktree's ignored control-local lane); a
`material` inventory in the evidence `implementation-ready` and
`repair-complete` record (at most one row per nested repository, under
1 KB in the ordinary case); the close's consumption of those rows and a
`--material <path>=disposable|preserve` flag for the operator's word at
close time; one lane rule in `scripts/lib/paths.mjs`; the close record
`docs/control/local/retained/WO-NNN/release-close.json`; fixtures in
`scripts/test-process-debt.mjs` and `scripts/test-release.sh`; at most
500 bytes in product 07 §Workflow closeout and releases, edited in place.
Removes: the blocker a scratch repository under `.runtime/` raises at
every close that left one (WO-117's close on 2026-09-29, where the
session first stopped and then moved the repository itself); the
session's own decision about material the executor knew to be scratch;
the absence of any record of a close's outcome (eleven of 117 closes left
notes under no common name, 2026-09-28 pass; WO-117's and WO-086's closes
of 2026-09-29 left none this pass can read). Re-mints: `scripts/lib/paths.mjs`
is a registered evidence source (build-only in three editions), so the
editions it stales are re-minted deterministically; no judged feedback
source changes, so no live episode. Wall-clock, tokens and context bytes
of the order itself are unknown until run.
**Nomination provenance:** the operator's dispatch of 2026-09-30
(`planning: standard planning pass + small additions`, items 1 and 3 of
the mid-turn message), captured in ignored intake (SHA-256 in the ledger
section); the WO-117 release close of 2026-09-29 (v0.56.0), whose
walkthrough store lived under `.runtime/wo117-walkthrough/`
([VER-001](../verifications/WO-117/VER-001.md), Limits) and whose
cleanup the operator reports as stopped at a nested-repository refusal
and then resolved by the session moving the repository; WO-172's subject
map theme 8 (release close stops short) and theme 2 (halts at a blocker
it could settle); register rows FUP-ecf9d3b703a0b7d9 (release close
records its outcome), whose reopening condition occurred, and
FUP-3a0c4ea52f8d6d08 (worktree lifecycle). Planner-synthesized. Opaque
identifier, not a priority. Clean-room screen: repository records and
the operator's paraphrased report; the walkthrough repository's private
name stays out of the record; no stop condition.
**Depends on:** WO-117 merged (the observation; closed, v0.56.0); WO-166
merged (dispatch reservation and `evidence --wait`; closed, v0.52.3);
WO-171 merged (the prune that finishes; closed, v0.52.6).
**Recommended placement:** paired with WO-180 in the third slot, after
WO-059 and WO-175, as the machinery lane beside the baseline witness
(disjoint: WO-180 edits the skeleton's verification protocol and host). This order edits `scripts/lib/paths.mjs`,
`scripts/lib/intake-reconciliation.mjs`, `scripts/worktree.mjs`,
`scripts/release.mjs`, `scripts/lib/lifecycle-evidence.mjs` and their
fixtures. WO-178, in the next pair, counts the record this order writes
and reports zero until it exists. A recommendation, not a dependency
token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-117",
    "relation": "satisfied-by-close",
    "reason": "the release close whose cleanup met the scratch repository"
  },
  {
    "workOrderId": "WO-166",
    "relation": "satisfied-by-close",
    "reason": "dispatch reservation and the wait command the close relies on"
  },
  {
    "workOrderId": "WO-171",
    "relation": "satisfied-by-close",
    "reason": "the prune that lets a close finish"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** `scripts/lib/paths.mjs`
(`classifyIgnoredMaterial`, `ignoredLane`, `inspectNestedRepository`,
`describeIgnoredMaterial`); `scripts/lib/intake-reconciliation.mjs`
(`inventory`, `reconcile`, `renderIntakeReconciliation`);
`scripts/worktree.mjs` (`ensureNoIgnoredMaterial`,
`reconcileDerivedWorktrees`, the `finish` and `settle` actions);
`scripts/release.mjs` (the close's `finish`/`settle` loop and its
`cleanup blocker` advisories; the retained lane);
`scripts/lib/lifecycle-evidence.mjs` (`requireLifecycleEvidence`);
`scripts/resume.mjs` (`implementation-ready`, `repair-complete`: read
only, the evidence they record); `scripts/test-process-debt.mjs` (the
WO-044 nested-repository case); `docs/evidence/WO-117/witness.md` and
`docs/verifications/WO-117/VER-001.md` §Limits; product 07 §Workflow
closeout and releases and §Operator resume phrases (the release-close
row); `docs/planning/failures-across-phases-2026-09-28.md` §9;
`docs/evidence/WO-172/intervention-subjects.md` themes 2 and 8; register
rows FUP-ecf9d3b703a0b7d9, FUP-3a0c4ea52f8d6d08, FUP-8cfd3ff52146a016.

**Objective:** a release close finishes on the record the executor left:
scratch repositories the executor declared disposable, or that sit in a
lane already marked disposable, leave with the worktree; a repository
declared for keeping is preserved as a unit; only an undeclared
repository outside every known lane blocks, and then the advisory hands
the operator the one command that settles it. Every close leaves a
machine-written record of what it published and what it cleaned, so a
planning pass can count closes that stopped short and say why.

**Observed gap (dated 2026-09-30, `main` at `b51a58a8`):**

1. `describeIgnoredMaterial` (`scripts/lib/paths.mjs`) returns
   `disposable: false` for every nested repository with content outside
   the intake and control lanes, whatever `classifyIgnoredMaterial` says
   of its path; that function marks files under `.runtime/`, build
   output, `docs/control/local/harness/`, `docs/control/local/cache/`
   and the beacon stage disposable. A repository under `.runtime/` is
   therefore a blocker while the files beside it are discarded.
2. WO-117's walkthrough helper created its store under
   `.runtime/wo117-walkthrough/` (VER-001 read it there). The operator
   reports that its release close on 2026-09-29 refused removal for the
   nested repository, that the session stopped at the refusal, and that
   it then preserved the repository outside the worktree by its own
   decision and finished cleanup. The retained lane for WO-117 holds
   `integration.json` and two follow-up files and no close record; the
   session journal of that close holds four rows.
3. Nothing the executor hands off carries a disposition for material it
   created: `ImplementationReady` evidence carries the tree hash, the
   advisories, the two gate rows and the unmet criteria
   (`scripts/lib/lifecycle-evidence.mjs`; `scripts/resume.mjs`
   `implementation-ready`); the reconciliation's `nestedRepositories`
   rows are computed at teardown from lanes alone.
4. Release close reports a cleanup blocker as an advisory and leaves the
   worktree (`scripts/release.mjs`, the `finish`/`settle` loop); the
   remedy names an operator terminal; the role text says "never force
   teardown" and nothing about who performs the remedy.
5. Eleven of 117 closes left logs and notes under no common name and no
   event (2026-09-28 pass §9); FUP-ecf9d3b703a0b7d9 was deferred with the
   condition "a release close fails and the next pass cannot say why",
   which this pass met twice: it cannot say from the record which harness
   ran WO-117's close or what it moved, and it cannot see the host
   denial the WO-086 close met (WO-178 records that class).

**Design (scope discipline):**

- **The lane is the declaration.** `describeIgnoredMaterial` returns
  disposable for a nested repository whose path `classifyIgnoredMaterial`
  already marks disposable, with a classification that says so; intake
  and control lanes keep their preservation; the `other` lane keeps its
  blocker.
- **The executor declares.** `npm run worktree -- material <path>
  --disposable|--preserve --reason <text>` records one row in the
  worktree's ignored control-local lane. `requireLifecycleEvidence`
  inventories the nested repositories `git ls-files --others --ignored
  --exclude-standard` lists in the worktree and records `material` rows
  in the completion evidence: path, lane, disposition, source (`declared`
  or `lane`), reason. An undeclared repository in the `other` lane is
  recorded `undeclared`; the completion message names it with the
  declare command and is not refused (WO-130's boundary: command-time
  guards judge effects, a completion records what it knows).
- **The close consumes.** `worktree finish` and `settle`, through the
  close, read the latest `material` rows from the order's committed log
  on updated main: disposable rows (declared or lane) leave with the
  worktree; `preserve` rows are preserved as directory units into
  `docs/control/local/retained/WO-NNN/`; an `undeclared` row blocks, and
  the advisory prints `node <main>/scripts/release.mjs close WO-NNN
  --publish --material <path>=disposable|preserve` as the one command.
  That flag is the operator's word at close time and is recorded. An
  idempotent retry after publication keeps working as today.
- **The close records.** The helper writes
  `docs/control/local/retained/WO-NNN/release-close.json`: dispatch
  harness and session when known, publication outcome (tag, Release or
  the refusal), cleanup outcome per worktree, material rows consumed,
  blockers with their commands, and a `dryRun` label. WO-178 counts these
  records in `plan failures`; this order writes them.
- **Declined alternatives, recorded:** refusing `implementation-ready` on
  an undeclared repository (a gate step for a state observed once);
  deleting an undeclared repository (never); a committed `ReleaseClosed`
  event (the close pushes nothing to main, so it would ride the next
  pull request; the register row keeps that condition); moving the
  remedy into the session's hands (the fail-conservative rule: material
  of unknown provenance is the operator's decision, and the declaration
  makes the case rare).

**Deliverables:** the lane rule and its fixture; the `material` command,
inventory and event rows with fixtures; the close's consumption, the
`--material` flag and the shell-fixture cases; the close record; the
write-backs.

**Acceptance criteria (all required)**

1. In a worktree fixture, a nested repository with one commit under
   `.runtime/x/` is reported disposable by `worktree finish --dry-run`
   and removed with the worktree by `finish`; the same repository under
   an `other`-lane path blocks with the declare command; under
   `docs/intake/` it is preserved as a unit. The first case fails against
   `main` at `b51a58a8`.
2. `npm run worktree -- material <path> --disposable --reason <text>`
   followed by `implementation-ready` records `material` rows with source
   `declared` in the `ImplementationReady` event; a repository under a
   disposable lane is recorded with source `lane` without a declaration;
   an undeclared `other`-lane repository is recorded `undeclared` and
   named in the completion message; the completion is not refused.
   `repair-complete` records the same rows.
3. In the release fixture: with a declared-disposable repository the
   close publishes and removes the worktree; with a declared-preserve
   repository it preserves the unit into the retained lane and removes
   the worktree; with an undeclared repository publication succeeds, the
   worktree stays, the advisory names `--material <path>=…`, and a rerun
   with that flag finishes cleanup without repeating publication.
4. Every close, publish or dry run, writes `release-close.json` with the
   fields the design names; a fixture covers one blocked and one clean
   close and one dry run.
5. Write-backs: product 07 §Workflow closeout and releases, the cleanup
   paragraph edited in place within 500 bytes; the release-close row of
   §Operator resume phrases names the record; `docs/evidence/WO-176/decisions.md`;
   the decisions index; register rows FUP-ecf9d3b703a0b7d9 and
   FUP-3a0c4ea52f8d6d08 retargeted at close.
6. `npm test -- --review` and `npm run test:docs` green; `git diff
   --check` clean; no new dependency.

**Evidence gate:** the fixtures of criteria 1 to 4; `npm test -- --review`
before `implementation-ready`, because `scripts/lib/paths.mjs`,
`scripts/lib/intake-reconciliation.mjs` and `scripts/release.mjs` are
declared sources of machinery suites; the editions `paths.mjs` stales
re-minted deterministically; no live row. The first real close after this
order merges is the observation the next planning pass reads from
`release-close.json`.

**Write-back duty:** product 07, in place; the order's decisions with
sources and reopening conditions; the register rows. Record corrections
the same day as what was misread, meant and changed.

**Non-goals:** deleting undeclared material; a committed close event;
the host's admission of the publish command and the journal of its
denials (WO-178); the role sentences (WO-179); the release-close fixture
against the real harness runtime in a linked pair
(FUP-8cfd3ff52146a016 keeps its condition); the withdrawn-order teardown
route (FUP-3a0c4ea52f8d6d08 is retargeted, not built, unless a withdrawn
order exists on a branch when this order runs); WO-086 D024's hardening
items.

**Operator-review assumptions**

1. A repository under `.runtime/`, build output or the harness and cache
   lanes is scratch by lane, as its files already are; an executor that
   needs one kept declares `--preserve`.
2. The executor's declaration in a committed event is the handoff the
   operator asked for: the close reads it from main after the merge and
   needs no session memory.
3. An undeclared repository outside every lane still stops cleanup, and
   the operator's word at close time is a flag, not a terminal move.
