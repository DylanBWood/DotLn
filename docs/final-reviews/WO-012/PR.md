## What this merges

WO-012, the `v0.2.1` patch work order: the release and worktree gates now
read git path output as the encoded format it is.

- **The defect:** `git ls-files`, `git diff --name-only`, and
  `git ls-tree --name-only` C-quote any path containing non-ASCII bytes
  (default `core.quotePath=true`). All three consumers compared that
  already-quoted string against unquoted prefixes and segments, so a
  protected `docs/intake/` file whose macOS screenshot name carries U+202F
  was classified as release-contaminating material — the false refusal that
  blocked the authorized `v0.2.1` release close on 2026-09-01 — and a
  disposable non-ASCII build path would refuse worktree removal.
- **The fix:** dedicated non-trimming NUL-delimited path-list readers
  (`-z`, split on `\0`, trailing-NUL guarded) feeding the three call sites —
  `ensureNoIgnoredInfluence` (release), `ensureNoIgnoredMaterial`
  (worktree), and `changedFiles` (manifest + tag annotation). Classification
  policy, refusal policy, and tag targeting are unchanged; refusals now name
  the real path unquoted. `ensureClean` was audited and left alone (its
  empty/non-empty decision is encoding-independent).
- **Fixture coverage:** nine non-ASCII fixtures across both suites, every
  one asserting the real `e280af` byte sequence, including the exact
  screenshot-style U+202F intake path, a still-refused foreign ignored
  file, all four disposable classes, a tracked U+202F path plus a
  leading-space path surviving literally into a re-validated manifest, and
  a first-release `ls-tree` arm.
- **Docs:** the roadmap's `v0.2.1` rung names WO-004 + WO-012 with the
  dated deferral reason; the execution guide now accurately says release
  close tags synchronized `origin/main` HEAD (prose corrected to match the
  unchanged code); the idea ledger records the general NUL-delimited
  pathname lesson and the fix-in-place recovery ideation (future design
  task, no executable scope added here).

## Evidence

- `npm test`: five shell suites plus 68/68 node tests, exit 0 —
  re-established twice at final review.
- Before/after classification capture reproduced independently: the U+202F
  intake path is refused by the pre-fix reading and allowed by the
  NUL-delimited reading, byte sequence confirmed.
- Mutation sensitivity: the new suites fail against the pre-fix scripts
  (first failures at `test-release.sh:143`, `test-worktree.sh:111`), and
  single-arm `changedFiles` mutants are each caught by a distinct manifest
  assertion.

## Verification trail

- `docs/verifications/WO-012/VER-001.md` — pass; all six acceptance
  criteria, no findings.
- `docs/final-reviews/WO-012/FINAL-001.md` — pass; no corrections applied;
  VER-001's subject hash re-derived bitwise at review. One refuted-major
  recorded for follow-up: residual "reviewed merged commit" phrasing in
  `06-roadmap.md` and `10-ir-compatibility.md` (pre-existing at base)
  should be harmonized with the corrected guide in a separate scoped
  defect.

## Known open items

Note-grade observations are enumerated in FINAL-001 and carried, not
restated here — the largest are the worktree path-list reader's 1 MB
`maxBuffer` asymmetry, the absent newline-in-filename fixture, and the
checkpoint gap across sandboxed transitions. After this merges, the
separately authorized `resume: release close` runs
`npm run release -- close WO-012 --publish` from the main checkout and cuts
annotated `v0.2.1`, carrying WO-004's content plus this fix.
