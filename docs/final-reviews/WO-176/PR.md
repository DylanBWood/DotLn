# WO-176

A release close no longer stops at a scratch repository. WO-117's close stopped at its walkthrough clone under `.runtime/`, because any nested repository with commits blocked cleanup even where every other file is discarded, and the session then moved it by hand. This pull request lands WO-176: a nested repository under a scratch directory (`.runtime/`, build output, the harness and cache lanes, the beacon directories) now leaves with the worktree, and the close finishes.

- **The lane rule.** `describeIgnoredMaterial` reports such a repository disposable; intake and control-lane repositories keep their preservation.
- **Removal.** `worktree finish` and `settle` recompute each repository's lane at close, bundle its commits (unreachable ones included) into main's ignored retained lane, verify the bundle in an empty repository, and only then remove the worktree. If that proof fails, the source is retained.
- **Still blocks once.** A repository outside those directories stops cleanup after publication. The close prints one `--material 'WORKTREE::PATH=disposable'` retry, which finishes without publishing again.

**Judged on its purpose.** During final review the operator amended the order to judge only the case above ([D035](../../evidence/WO-176/decisions.md#wo-176-d035--operator-amendment-judge-the-order-on-deleting-scratch-repositories)), and FINAL-002 ran WO-117's exact repository shape through the subject. The declaration command, completion `material` rows, the `--material` flag and the ignored `release-close.json` record ship as implemented and as VER-001 and VER-002 verified them; their recorded defects are in [D033](../../evidence/WO-176/decisions.md#wo-176-d033--verification-nested-object-stores-escape-the-state-binding-and-the-recovery-bundle), [D034](../../evidence/WO-176/decisions.md#wo-176-d034--verification-close-word-record-accuracy-and-hardening-defects-boarded) and [D037](../../evidence/WO-176/decisions.md#wo-176-d037--final-review-defects-in-the-shipped-machinery-the-amended-order-does-not-judge). FINAL-001 failed the order because a scratch repository that gained a commit was removed; [D036](../../evidence/WO-176/decisions.md#wo-176-d036--correction-the-review-role-judged-scratch-deletion-as-data-loss) records that the operator wants exactly that removal.

**Next.** A scratch repository should not reach the close at all. Follow-up `FUP-a1e36af45f68e3ac` asks the planner to define scratch, have the executor and the reviewer remove it before handoff, and have the close remove any that remain without asking.

**Fixture repair.** The Node-only staged-build fixture now copies the `browser-evidence` workspace v0.59.0 added; production code and other assertions are unchanged, and it is a separate commit.

**Versions and editions.** Application `v0.60.1` is a patch over `v0.60.0`; no component version changes. `scripts/lib/paths.mjs` is a build-only evidence source, so WO-176's deterministic revision-001 editions are committed while main's WO-180 editions stay selected.

**Validation.** `npm test -- --review` passed at code identity `d1c1a362…`: 39 suites, 0 failed, 801.58 s. `npm run test:docs` passes. [VER-001](../../verifications/WO-176/VER-001.md) passed, [FINAL-001](FINAL-001.md) failed, a repair followed, [VER-002](../../verifications/WO-176/VER-002.md) passed and [FINAL-002](FINAL-002.md) passed.

**Known limits.** No real close has run after merge; the evidence is the release fixture and the exact-shape probe. A scratch repository outside the scratch directories still needs the printed retry until the follow-up lands.

<!-- dotln-process-meter:start -->

Observation cutoff: 2026-10-01T13:11:57.018Z; source: canonical control events and the recorded gate, usage and harness observations collected by npm run meta.

| Work | Phase ms / attempts | Gate ms | Read files / bytes | Observed tokens / USD | Declared prompt tokens | Corrections | Directions |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| WO-058 | 5,014,086 (Δ unavailable) / 3 | unavailable (Δ unavailable) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | 1,019 (Δ unavailable) | 0 (Δ unavailable) | 0 (Δ unavailable) |
| WO-174 | 13,456,142 (Δ 8,442,056) / 5 | 2,384,620 (Δ unavailable) | 4 (Δ unavailable) / 59,879 (Δ unavailable) | 50,171,251 (Δ unavailable) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 0 (Δ 0) | 0 (Δ 0) |
| WO-175 | 8,027,049 (Δ -5,429,093) / 3 | 3,483,168 (Δ 1,098,548) | 4 (Δ 0) / 61,796 (Δ 1,917) | 52,710,657 (Δ 2,539,406) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 0 (Δ 0) | 0 (Δ 0) |
| WO-059 | 13,869,681 (Δ 5,842,632) / 8 | 3,716,930 (Δ 233,762) | 3 (Δ -1) / 23,786 (Δ -38,010) | 77,033,040 (Δ 24,322,383) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 1 (Δ 1) | 0 (Δ 0) |
| WO-180 | 5,518,304 (Δ -8,351,377) / 3 | 1,695,186 (Δ -2,021,744) | 3 (Δ 0) / 18,410 (Δ -5,376) | 48,716,481 (Δ -28,316,559) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 1 (Δ 0) | 0 (Δ 0) |
| WO-176 | 35,528,034 (Δ 30,009,730) / 3 | 4,013,405 (Δ 2,318,219) | 4 (Δ 1) / 64,961 (Δ 46,551) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 3 (Δ 2) | 3 (Δ 3) |

Unavailable observations are not zero; unset ceilings are not approvals of a future limit.

| Dispatch | Wall ms (Δ) | Context bytes (Δ) | Commands (Δ) | Tokens (Δ) | Steps (Δ) | USD (Δ) / declared prompt tokens |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| WO-176/executor | 32,383,266 (28,825,804) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / 1,019 |
| WO-176/verifier | 1,420,364 (595,264) | 36,039 (8,904) | 119 (52) | 10,946,366 (606,220) | 126 (48) | unavailable (unavailable) / unavailable |
| WO-176/reviewer | 1,724,404 (588,662) | 30,317 (777) | 180 (74) | 22,184,139 (4,507,331) | 217 (83) | unavailable (unavailable) / unavailable |
| WO-176/release-close | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
| WO-176/planner | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
| WO-176/refuter | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
<!-- dotln-process-meter:end -->
