# WO-013 — Portable temporary roots for shell test fixtures, v0.3.1

**Model:** any capable model. State the model and effort actually run in the
result (07-execution-guide.md §Model-specific notes). The target environment
is a sandboxed harness that permits only its own session temporary root; the
executor should work inside one so the acceptance evidence is first-hand.
**Release classification:** `v0.3.1` tagging patch above the latest published
`v0.3.0`. This is a compatible test-infrastructure correction, the class the
roadmap's §Release boundary assigns to a patch; it adds no exported runtime
capability. Activation on 2026-09-02 accidentally retained the planner
placeholder in this heading and paragraph. The executor forward-corrected that
preflight miss to the work-order map's first suggested patch target without
replaying or editing the append-only activation event. Publication remains
subject to independent verification, final review, operator merge, and a fresh
operator-authorized release close.
**Nomination provenance:** nominated by the operator during the WO-006 final
review and created under operator direction; see
`docs/final-reviews/WO-006/FINAL-001.md` §Follow-up work-order nominations.
The identifier is an opaque stable reference assigned at creation. It is not a
priority, a queue position, or an activation decision; those live in the
control projection and the provisional work-order map.
**Depends on:** WO-006 merged — branch from `origin/main` at or after the
`v0.2.3` close. WO-006 adds the sixth suite (`scripts/test-publication.sh`)
and modifies two others, so every suite this order touches must already be on
`main`. Independent of the mainline rungs and of the WO-10x evidence series.

**Cites (read these sections):** 07-execution-guide.md §Discipline (evidence
gates over prose; recovery point before destruction; "small script" is not an
evidence exemption) and §Model-specific notes; docs/lineage/idea-ledger.md
adopted entry "Tests clean only artifacts they created inside owned fixtures"
(§WO-004 lifecycle hardening additions; cleanup authority follows provenance,
never filename familiarity); docs/AI-HARNESS-SECURITY.md §Current posture and
§Why recovery checkpoints warn under Codex (the sandbox boundaries the suites
must respect); ADR-0003 Decisions 1 and 4 and ADR-0004 Decision 2 (the sandbox
stays on; sandbox-compatibility is not authority); 01-principles.md Principles
5, 6, and 10; `docs/verifications/WO-006/VER-001.md`, `VER-002.md`, and
`VER-003.md` §Evidence gate "Disclosed deviation" (three verifications and the
final review each ran the suites from a relocated mirror because of this
defect).

**Objective:** Make every shell suite create its fixture root beneath the
runtime-provided temporary base — `$TMPDIR`, falling back to `/tmp` — while
keeping cleanup fail-closed and bound to the directory the suite itself
created, so that an unchanged `npm test` passes inside a harness sandbox that
permits only its supplied temporary root, with no outside-sandbox approval and
no disclosed test-copy relocation.

**Observed problem (dated 2026-09-01):** six suites hardcode
`mktemp -d /private/tmp/dotln-<suite>-test.XXXXXX` and guard their cleanup on
that literal prefix:

- `scripts/test-publication.sh`
- `scripts/test-backup-intake.sh`
- `scripts/test-resume.sh`
- `scripts/test-checkpoint.sh`
- `scripts/test-worktree.sh`
- `scripts/test-release.sh`

At the tested Claude Code version the operating-system sandbox denies
`mkdtemp` directly under `/private/tmp` while permitting a session-specific
child that it exports as `$TMPDIR`. An unchanged `npm test` therefore passes
`format:check` and stops at the first suite with
`mktemp: mkdtemp failed on /private/tmp/dotln-publication-test.<suffix>: Operation not permitted`,
where the suffix is the six substituted template characters. VER-001 recorded
the limitation; VER-002, VER-003, and FINAL-001 each ran the
suites from a mirror in which exactly two lines per suite were relocated and
disclosed the residual gap. Substituting `/tmp` would not help on macOS, where
`/tmp` is a symbolic link to `private/tmp`, so the denial resolves to the same
directory. `scripts/resume.mjs` already derives its checkpoint scratch
directory from Node's `os.tmpdir()`, which honors `$TMPDIR`; that is the
nearby precedent. The defect is independent of the harness's accept-edits and
sandboxed-Bash auto-allow settings: it is a path choice inside the suites, not
a permission policy.

**Scope discipline (base selection and guard only):**

- Change how each suite resolves its base and validates cleanup; do not change
  what the suites assert, the code under test, or the order of the `test`
  chain in `package.json`.
- Resolve `tmp_base="${TMPDIR:-/tmp}"`, strip trailing slashes, require an
  existing writable directory, and normalize it with `pwd -P` so a symlinked
  base (macOS `/tmp`) resolves identically at creation and at cleanup. If the
  base is missing, not a directory, or unwritable, fail loudly before creating
  anything, naming the rejected base.
- Create the root with `mktemp -d "${tmp_base}/dotln-<suite>-test.XXXXXX"`
  and derive the cleanup check from the created path, never from a literal
  absolute prefix: `test_root` must be non-empty, a directory and not a
  symlink, its parent must be exactly the resolved base, and its basename must
  match `dotln-<suite>-test.` followed by the six template characters. Only
  then may the trap run `rm -rf -- "$test_root"`; every other case refuses with
  a non-zero exit and removes nothing.
- Quote every expansion. A base containing spaces is a required case, not an
  edge case.
- A shared sourced helper (for example `scripts/test-temp-root.sh`) is
  permitted only if it reduces the duplicated safety logic without hiding each
  suite's fixture root and guard from a reader of that suite. If introduced,
  it is implementation with its own negative fixtures and is named in the
  result.
- Two suites, `scripts/test-backup-intake.sh` and
  `scripts/test-publication.sh`, currently print a refusal and continue with
  exit status 0 when their cleanup guard trips, while the other four exit 1.
  Acceptance criterion 4 makes all six fail closed with a non-zero exit; that
  behavior change is in scope and must be named in the result.
- Leave the three macOS-specific `stat -f` call sites alone
  (`scripts/test-backup-intake.sh:27`, `scripts/test-resume.sh:101`, and
  `:103`); their portability is a separate question.

**Deliverables:** the six modified suites, each with a diff limited to base
resolution, the `mktemp` template, the guard, and the trap; the optional shared
helper; a new fixture suite (for example `scripts/test-fixture-temp-root.sh`)
wired into the `test` chain ahead of the six suites that proves the positive
and negative cases below; and a dated note in `docs/AI-HARNESS-SECURITY.md`
recording that an unchanged `npm test` runs inside the tested Claude sandbox
without approval, so future verifiers stop disclosing a relocation.

**Acceptance criteria (all required)**

1. No suite under `scripts/` hardcodes `/private/tmp`, a harness-specific
   temporary path, or any absolute temporary base other than the documented
   `/tmp` fallback inside the base-resolution expression. A grep over
   `scripts/` for `/private/tmp` returns nothing.
2. Each suite honors a valid writable `$TMPDIR`, including a value containing
   spaces and a value that is a symbolic link to a directory; fixture roots
   are created beneath its resolved form.
3. Behavior is defined when `$TMPDIR` is unset or empty (fallback to `/tmp`),
   nonexistent, not a directory, or unwritable (loud failure before any
   fixture is created; non-zero exit; message names the rejected base).
4. Cleanup is fail-closed: it removes only the exact generated
   `dotln-<suite>-test.XXXXXX` directory beneath the resolved base and refuses
   — non-zero, nothing removed — when `test_root` is empty, is the base
   itself, is a symlink, has a different parent, or has a different basename
   shape.
5. A malformed or adversarial base cannot redirect cleanup outside the
   generated directory. Negative fixtures cover at least `TMPDIR=/`,
   `TMPDIR=.`, `TMPDIR=..`, a relative path, a path with `..` segments, a
   trailing slash, and a symlink pointing outside the intended tree; each
   plants a sentinel file outside the fixture root and asserts it survives.
6. Interrupt (`INT`, `TERM`) and ordinary-exit traps still remove fixture
   data: a suite terminated mid-run leaves no `dotln-<suite>-test.*` residue
   beneath the base, and no repository or ignored material is left behind.
7. Every individual shell suite passes with its assertions unchanged; the
   result enumerates each suite's diff and shows it touches only the lines the
   scope clause names.
8. A full, unchanged `npm test` passes inside a harness sandbox that permits
   its supplied temporary root, without source mirroring, relocation, or
   outside-sandbox approval, and also passes outside any sandbox. The
   in-sandbox transcript is captured with the harness name and version.
9. Existing checkpoint, worktree, release, intake-backup, publication, and
   resume semantics remain unchanged: `scripts/resume.mjs`,
   `scripts/release.mjs`, `scripts/worktree.mjs`,
   `scripts/check-publication.mjs`, and `scripts/backup-intake.sh` are
   byte-identical before and after this order (`cmp`).
10. No personal harness setting, persistent allow rule, dependency, production
    API, or runtime schema is added: `package.json` dependencies are unchanged,
    no `.claude/` or Codex configuration changes, and no `docs/decisions/`
    body is edited.

**Evidence gate:** the before/after reproduction in a restricted writable
temporary root (the unchanged `npm test` failure transcript from before the
change and the passing one after it, both captured inside the sandbox); the new
fixture suite's output covering ordinary, space-containing, symlinked, unset,
empty, nonexistent, unwritable, and adversarial bases; the sentinel-survival
negative fixtures; the interrupt-trap fixture; `git diff --check` clean; a
residue check listing `dotln-*` entries beneath the resolved base before and
after the full run. Pre-existing `dotln-*` residue under `/private/tmp` from
earlier sessions was observed during the WO-006 final review; this order must
not delete anything it did not create and records such residue as an
observation, not as its own cleanup target.

**Write-back duty:** the dated runbook note above; the provisional work-order
map row for this order moves from draft to its evidence state at close. The
ledger's fixture-hygiene rule is unchanged by this order (the cleanup guard
becomes provenance-derived, which is what the rule already says), so no ledger
entry is due; state that skipped duty in the result.

**Non-goals:** broadly rewriting the shell suites; solving the `stat -f`
call sites or other macOS-specific commands; changing product runtime
behavior; weakening sandbox settings or adding a persistent command exception
in any harness; editing WO-006, its verification reports, or its final review;
changing Node-side temporary handling in `scripts/resume.mjs`, which is already
portable.
