# WO-004 final review FINAL-001

**Subject:** branch `wo-004`, working tree (uncommitted), 2026-09-01. Base
`e33a0d5` (= `origin/main`). Full change set: 38 tracked files, 1,928
insertions / 461 deletions, plus the new `scripts/release.mjs`,
`scripts/test-release.sh`, `docs/releases/`, and `docs/verifications/WO-004/`.
The tree under review is the subject VER-002 passed: its diff against
`refs/dotln/checkpoint/WO-004/8` (minted at the pass verdict) touches only the
two control files, by exactly the two post-pass dispatch events — nothing was
silently patched after the verdict, and VER-002's G1–G6 are all still live as
recorded.
**Authority:** `docs/work-orders/WO-004-environment-truth-addendum.md` —
original checklist, operator-authorized lifecycle addendum, ideation receipts
001/002/003, and the VER-001 repair-authority contract. The work order is
unmodified by this review.
**Inputs reviewed:** the work order end-to-end; the complete verification
sequence `VER-001` (fail) → `HARDENING-001` (implementer receipt) → `VER-002`
(pass); the full diff; executable evidence re-established first-hand; every
surface the three ideation receipts name; the clean-room boundary.
**Reviewer:** Fable 5, ultracode effort, fresh session dispatched by
`resume: final review`. WO-004 requires "any capable model".

**Verdict: WO-004 passes final review.** No blocking finding. One major
reporting omission in VER-002 is recorded and adjudicated below — closure does
not rest on it. Two bounded wording corrections were applied and the full
suite rerun (five shell suites + 68/68 node tests, exit 0). The branch is
ready for operator review and merge.

## Disclosure: self-referential instrument

Required by `07-execution-guide.md` §Discipline. `scripts/resume.mjs` — a
deliverable under review here — allocated this report's path (control-log
`FinalReviewRequested`) and minted `refs/dotln/checkpoint/WO-004/9` at
dispatch. Verified independently rather than trusted: all nine WO-004
checkpoint refs were read with `git for-each-ref` and match their control-log
lines byte-for-byte; checkpoint 9 (`e7533b0`) carries subject
`dotln checkpoint: final-review WO-004` and is parented on unchanged base
`e33a0d5`; the `resume.jsonl` delta against base is a pure nine-event append
with zero deletions. Recording the pass verdict below will mint checkpoint 10
— expected behavior of the verified mechanism, not dirt.

## Final evidence summary

All executable evidence was re-established in this episode, not inherited:

- `npm test` from the repository root, run three times (before review, after
  review, after the corrections): `backup-intake`, `resume`, `checkpoint`,
  `worktree`, and `release` suites all pass, then **68/68 node tests, exit 0**.
- `npm run skeleton`: banner `@dotln/skeleton v0.2.0 — Repo Gardener + Seiri`
  (the batch-003 component-identity contract exactly), receipt
  `verified=true candidates=1`.
- The 25-agent review fan-out modified nothing: the SHA-256 of
  `git status --porcelain=v1 --untracked-files=all` is identical before and
  after (`38cf5f97…`).

## Verification-sequence soundness

The sequence VER-001 (fail; blocking B1 at two sites, F1–F12) → bounded repair
+ `HARDENING-001` → VER-002 (pass; G1–G6, O-a–O-n) soundly supports closure.
Every VER-001 finding is traceably repaired or explicitly dispositioned, and
HARDENING-001's dispositions match the diff. B1's closure was re-checked at
merge altitude: both remote-writing push sites carry `--no-follow-tags` with a
real stimulus fixture (`push.followTags=true` plus a reachable unrelated
annotated tag) and mutation-proof assertions; the worktree side enumerates all
origin refs exactly (the release side scopes to `refs/tags` — G5, carried).
Both VER reports carry the required self-referential-instrument disclosure and
HARDENING-001 states its during-repair timing honestly. VER-002's Disclosure 2
— a subordinate examiner mutated machine-local git config during verification,
outside its declared read-only discipline — was weighed: the revert was
verified first-hand in that report, blast radius was zero, and the evidence
this review relies on was re-established here rather than inherited, so the
conduct breach does not contaminate closure.

## The major finding, adjudicated

**VER-002 does not account for the batch-003 independent read-only audit and
post-edit counter-review.** The work order's batch-003 receipt places them in
VER-002's subject explicitly ("It must also account for the independent
read-only audit and the post-edit counter-review rather than treating agent
agreement as evidence"), VER-002 never mentions either review, and no durable
artifact records them anywhere — the VER-001 F2 pattern recurring, unflagged.
Adversarial verification split 2–1 (two upholds, one refutation arguing the
clause is an evidentiary-posture directive that VER-002's
re-verify-everything-first-hand method satisfies, and that the receipt
deliberately allocated no artifact for those in-session reviews).

**Adjudication: recorded, not blocking.** Time-indexed, the clause's
protective purpose — that batch 003 not be closed on agent agreement — was
demonstrably honored: VER-002 assigned the in-session reviews zero evidentiary
weight and independently re-derived every enumerated batch-003 subject item
executably or programmatically. The defect is report-completeness: VER-002
should have flagged that those reviews left no repo trace. VER-002 is
immutable, so this paragraph is now the durable accounting the clause wanted:
the batch-003 in-session audit and counter-review are unrecorded, carry zero
evidentiary weight, and closure rests exclusively on VER-001/VER-002's
independently re-established evidence plus this review's own re-verification.
Failing final review over it would send the work through repair and a fresh
`VER-003` to change one report's prose about reviews whose evidentiary weight
is already zero; that remedy does not fit the defect.

## Corrections applied by this review

Both are wording-only handoff corrections under the final-review gate's own
authority; no code, contract, acceptance behavior, schema, compatibility,
authority, or prior-evidence surface changed. `npm test` was rerun after
applying (five suites + 68/68, exit 0); no executable check reads the
corrected prose (the suites grep `resume.mjs` runtime output, not these
lines).

1. **Release-close dispatch-table caveat**
   (`docs/product/07-execution-guide.md` §Operator resume phrases): the
   `resume: release close` row now carries the one-time WO-004 bootstrap
   caveat and points at §Workflow closeout. Closes the documentation half of
   VER-002 **G1**; the code half (the unconditional `resume.mjs` projection
   string) is carried below.
2. **Shared-stash-stack hazard named**
   (`07-execution-guide.md` §Discipline and `docs/PLAYBOOK.md`): the recovery
   guidance now states that git's stash stack is shared across all worktrees,
   to re-find an entry by its `-m` tag rather than `stash@{n}` position, and
   to restore with `apply`, not `pop`. Closes VER-002 **O-n**.

## Remaining deviations and open questions

Carried non-blocking findings, weighed individually at merge altitude; none
escalated, none silently fixed:

- **G1 (code half):** `resume.mjs`'s release-close projection unconditionally
  prints `npm run release -- close WO-004 --publish`, which cannot run against
  pre-merge main. Loud, non-mutating; `worktree publish` prints the correct
  bootstrap command, the guide table row now carries the caveat, and this
  review's result relays the printed handoff to the operator verbatim.
- **G2:** the runtime publish handoff prints an unquoted `--title <title>`
  placeholder and `worktree publish` silently drops words after the first;
  test-locked at `test-resume.sh:75`. Recoverable via `gh pr edit --title`.
  This review quoted its title when publishing.
- **G3:** the ordinary (post-WO-004) release-handoff arm of `worktree publish`
  has no in-repo assertion (the fixture main never has a `release` script);
  VER-002 proved the arm correct in a modified fixture. Follow-on test
  candidate — it is the arm every later work order will use.
- **G4:** an equal-version refusal can fetch the already-published origin tag
  into a local ref before manifest validation, against the literal "no refusal
  path creates a tag" wording. Byte-identical mirror of a published tag,
  nothing pushed, unreachable for WO-004's strictly-forward target.
- **G5:** the release suite's remote-ref enumeration scopes to `refs/tags`;
  the worktree suite's full enumeration is the intended standard.
- **G6 / O-g / O-h:** the discovery JSON's two-tier `wo004Observed` encoding
  is undeclared and applied non-uniformly; every individual label matches a
  Markdown row (re-enumerated here: 74 Markdown, 71 JSON rows, no
  contradictory pair). Form defect only; declare or unify in a follow-on.
- **O-a root cause, explicitly deferred by the work order:** a sandboxed
  in-worktree executor cannot write the linked worktree's shared object store,
  so checkpoint minting can fail while the transition still exits 0 with a
  stderr warning (WO-004's own `implementation-ready` and `fix` events carry
  no refs). The fail-closed projection is proven; retention/recovery remains
  the named follow-on candidate.
- **New notes from this review:** the upstream-present arm of
  `worktree finish` is never exercised in its own suite (the equivalent path
  is covered via `release.mjs`'s duplicated `updateMainAndFinish`); the real
  WO-004 bootstrap will execute pre-merge main's *old* `worktree.mjs` for the
  finish step — inspected against `e33a0d5` and compatible (the branch has an
  upstream from `publish -u`, the status projection contains `- Phase:
  closed`, finish performs no push); two vestigial test affordances
  (the malformed-version scenario asserts the default `v0.2.1` tag name, and
  the `DOTLN_FIXTURE_NPM_FAIL=skeleton` hook is never exercised); acceptance
  bullet 2 has no dedicated confirmation row in either VER report (its
  substance is covered piecemeal across F10, O-e, and the docs↔code mapping
  rows); the `release-close` resume action remains outside the documented
  inventory (deliberate per VER-002 O-e).
- **Clean-room: pass, no violations.** Broad category sweep over the full diff
  (tracker/ALM product names, predecessor-system names, managed-host/gateway
  and employer terms, hostnames, identifiers) — every hit a false positive on
  context read; the predecessor appears only generically; intake is cited by
  path only, never quoted; `.gitignore` still excludes it; the release tooling
  actively protects intake (allowed-untracked classification, fixture-proven
  survival). External URLs are public vendor documentation and RFC-reserved
  fixture domains only.
- **Release:** tagging `v0.2.1` is a separately authorized post-merge action
  via `resume: release close`; nothing in this review performs or implies it.

## Proposed PR

- **Title:** `:sparkles: WO-004: environment truth addendum, release close,
  and lifecycle hardening`
- **Body:** `docs/final-reviews/WO-004/PR.md` (committed alongside this
  report).

## Ready to merge

Closeout from here, per the playbook: record `final-review-result pass`
(mints checkpoint 10), commit the reviewed state, publish the PR with the
guarded `worktree publish` step. The operator retains merge authority. After
the merge, `resume: release close` runs the **one-time WO-004 bootstrap** —
use the exact command `worktree publish` prints, not the generic
`npm run release -- close` form.

## Method

Review orchestrated as a 25-agent workflow at ultracode effort: six
independent lenses (verification-sequence integrity, lifecycle control-plane
code, release tooling, documentation consistency and version retiming,
clean-room, discovery deliverable), 39 candidate findings, every
blocker/major-grade candidate attacked by three adversarial refuters on
distinct lenses (reproduce / contract-text / independent skeptic), minors by
one. Two candidates were refuted — both attempted major re-gradings of
findings VER-002 had already reproduced and dispositioned non-blocking (G1,
G4) — and the survivors consolidate to the one major and the carried/new items
above. No agent modified the repository (status-hash identical before and
after). The lead reviewer read the work order, all three verification-sequence
artifacts, and the control log directly; re-established all executable
evidence; verified the checkpoint refs and control-log append-integrity
first-hand; and applied the two corrections after the workflow returned.
