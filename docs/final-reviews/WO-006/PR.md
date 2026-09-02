## What this merges

WO-006, the `v0.2.3` patch rung: the publication bootstrap (steps 1–4 of
`docs/product/08-publication-compiler.md` §Bootstrap path) plus the thirteen
operator-authorized same-release expansions the work order enumerates.
Documentation, process guidance, and dev tooling only: no exported runtime
capability, no runtime dependency, and every `packages/` source and test file
is a pure Prettier re-print of `main`.

- **Publication bootstrap** (`docs/publication/`): an audience/status index
  covering all 134 blueprint headings, the base outline and implementation
  overlay template, two sharply different tables of contents (everyday AI user
  and software engineer) over shared committed sources, a dual-voice sample
  with identical claim links, and a captured staleness demonstration.
  `scripts/check-publication.mjs` plus `npm run publication:check` prove index
  coverage, dual-voice link identity, and per-edition source locks;
  `scripts/test-publication.sh` pins the checker.
- **Prettier** as an exact `3.9.6` dev dependency, `.prettierrc.json`,
  `.prettierignore` with documented exclusions for raw, append-only,
  generated, hash-sensitive, and immutable surfaces, `format` / `format:check`
  scripts wired into `npm test`, an ADR-0002 amendment, and the
  repository-wide formatter pass.
- **Personal AI-harness security runbook** (`docs/AI-HARNESS-SECURITY.md`),
  ADR-0003, ADR-0004, and ADR-0005 recording the sandboxed, fail-closed Claude
  and Codex posture, its dated corrections, and the recorded fault sequence
  without shifting blame onto the operator or the verifier.
- **Lifecycle hardening** in `scripts/resume.mjs`: an actionable checkpoint
  degradation warning and the bounded `resume: fix` reopen path (legal only
  while a preserved verification or final-review failure source remains),
  with fixtures in `scripts/test-resume.sh` and `scripts/test-checkpoint.sh`.
- **Ideation write-backs** (clean-room, receipted, ledger append-only): the
  Malcolm Check and restraint accounting, `ideation:` dispatch semantics,
  external rule-source import plans, the Embodied Explorer, work-order
  navigation and the provisional work-order map, the Team Topologies research
  nomination, the operator-flow mission, binary quench, the Flow Steward,
  temporal interaction and the RxJS `expand()` hypothesis, and the
  brain/hands, isolation, and foundation-first synthesis.

## Operator-directed planning additions at final review

Outside the verified WO-006 subject and disclosed in FINAL-001: two draft
follow-up work orders the operator nominated during final review, created
under operator direction with the next free identifiers and no version, slot,
or release promise. They are unverified planning drafts, not reviewed
deliverables; no verification report covers them.

- `docs/work-orders/WO-013-portable-fixture-temp-roots.md` — make the six
  shell suites use the runtime temporary root with fail-closed cleanup, so an
  unchanged `npm test` runs inside a harness sandbox.
- `docs/work-orders/WO-014-approval-burden-contract.md` — an approval-burden
  baseline, remediation, and fresh-session acceptance contract per harness; it
  also carries the harness/posture reconciliation WO-006 deferred and VER-003
  scored neither way.
- `docs/planning/work-order-map.md` — catalog rows for both, the WO-006 row
  advanced to its closeout state, and the "Now and after this close" block
  made transition-agnostic (VER-003 finding 2).

## Evidence

Re-established first-hand at final review, not inherited:

- `npm run format:check` clean; `npm run publication:check` reports 134/134
  headings indexed, three identical dual-voice claim links, and both editions
  `CURRENT` at 27 and 42 linked source sections.
- `tsc -b --force` then `node --test` over kernel and skeleton: 68/68.
  Corpus harness: 22/22.
- All six shell suites and the complete `npm test` chain green from a mirror
  whose code under test was proved byte-identical, with exactly two temp-root
  lines relocated per suite because the reviewing sandbox denies
  `/private/tmp`; the unchanged command's in-sandbox failure was captured and
  is the subject of WO-013.
- `git diff --check` clean; VER-001, VER-002, and VER-003 byte-frozen across
  every checkpoint since each was written; the control log is a strict append
  over `main`.

## Verification trail

- `docs/verifications/WO-006/VER-001.md` — fail; one blocking finding
  (harness posture record), one material (stale staleness capture), two
  non-blocking checker defects. Two repair episodes, including the bounded
  reopen the work order's AC19 now pins.
- `docs/verifications/WO-006/VER-002.md` — fail; two material honesty
  findings (one index label, three stale statements) and three minor. One
  repair episode.
- `docs/verifications/WO-006/VER-003.md` — pass; all twenty acceptance
  criteria met, the operator-deferred AC8 clause recorded without scoring,
  four minor hardening findings carried.
- `docs/final-reviews/WO-006/FINAL-001.md` — pass; details the review method,
  the two bounded wording corrections applied (the work-order map's lifecycle
  block and WO-006 row; the software-engineer edition's missing lossy
  self-label), the VER-003 errata, and the carried items.

## Known open items

- The harness posture axes the operator deferred during WO-006 (fresh-session
  startup evidence, checkout-local allow count, present-tense runbook and
  receipt claims, ADR back-pointers) are unscored here and assigned to WO-014.
- The six shell suites still hardcode `/private/tmp`; every verification and
  this review disclosed a relocated mirror run. WO-013 closes that gap.
- VER-003's four minor findings are carried, not repaired: the kernel-loop
  section's missing co-located deferral note (a lock input, so a future pass
  must refresh both edition locks), the one surviving AC19 fixture mutant, and
  the two receipts without an Unresolved-choices bullet.
- Post-merge, the separately authorized `resume: release close` evaluates
  `v0.2.3` as the next boundary above the published `v0.2.2` tag. This PR
  performs no release action.
