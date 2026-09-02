## What this merges

WO-013, the `v0.3.1` patch work order: every shell test suite now creates its
fixture root beneath the runtime-provided temporary base instead of a
hardcoded `/private/tmp`, and cleanup is fail-closed and bound to the
directory the suite itself created. An unchanged `npm test` passes inside a
harness sandbox that permits only its session temporary root, with no source
mirror, no relocated copy, and no approval prompt.

- **The defect:** six suites ran `mktemp -d /private/tmp/dotln-<suite>-test.XXXXXX`
  and guarded cleanup on that literal prefix. Under the tested Claude Code
  sandbox `mkdtemp` under `/private/tmp` is denied, so `npm test` stopped at
  the first suite. Three WO-006 verifications and its final review each ran
  the suites from a disclosed relocated mirror because of this.
- **The fix, base selection and guard only:** a shared sourced helper
  (`scripts/test-temp-root.sh`) resolves `${TMPDIR:-/tmp}` — strips trailing
  slashes, requires an absolute, existing, writable directory, rejects `/`
  and `..` segments, and normalizes with `pwd -P` so a symlinked base (macOS
  `/tmp`) resolves identically at creation and cleanup — then creates
  `dotln-<suite>-test.XXXXXX` beneath the resolved base, records ownership
  (an in-process registry plus a mode-600 marker file), and installs
  `EXIT`/`INT`/`TERM` traps whose cleanup removes only the exact owned root:
  empty, base-itself, symlink, wrong-parent, wrong-shape, unowned, missing- or
  changed-marker targets all refuse with a non-zero exit and remove nothing.
  Each suite's diff is a seven-line preamble plus the removal of its old
  literal guard; no assertion moved.
- **Named behavior change:** `scripts/test-backup-intake.sh` and
  `scripts/test-publication.sh` previously printed a refusal and still exited
  0 when their cleanup guard tripped; all six suites now fail closed.
- **New fixture suite** (`scripts/test-fixture-temp-root.sh`, first in the
  `npm test` chain): 33 assertions over ordinary, space-containing,
  symlinked, trailing-slash, unset, empty, nonexistent, not-a-directory,
  unwritable, `/`, `.`, `..`, relative, `..`-segment, and outward-symlink
  bases; nine cleanup-refusal cases with sentinels; ordinary and refused
  `EXIT` traps; `INT` and `TERM` delivered to a live suite.
- **Docs:** a dated note in `docs/AI-HARNESS-SECURITY.md` records that an
  unchanged `npm test` runs inside the tested Claude Code 2.1.258 sandbox
  without approval; the work-order map row carries the reviewed evidence
  state; the work order's heading carries `v0.3.1` (an activation preflight
  miss the executor forward-corrected and disclosed in place — adjudicated in
  FINAL-001).

## Evidence

Re-established first-hand at final review inside the Claude Code 2.1.258
sandbox, not inherited:

- The pre-change operation still fails live
  (`mktemp: mkdtemp failed on /private/tmp/dotln-publication-test.<suffix>: Operation not permitted`);
  the unchanged `npm test` from this worktree passes: Prettier clean, all
  seven shell suites, `tsc -b --force`, 77/77 node tests, exit 0. `git diff --check`
  clean. `dotln-*` residue beneath the session base identical before and after
  (three pre-existing entries, untouched).
- Five independently written probes that never call the new fixture suite:
  all six real suites × 14 bases (84/84, every sentinel intact, no residue);
  the guard driven directly through the sourced helper (19/19, a correctly
  named unowned sibling refused, the owned root removed exactly); `INT`/`TERM`
  on the five suites the fixture never signals (10/10, exits 130/143, no
  residue); the guard tripped mid-run in the two formerly warn-and-continue
  suites (both exit 1, decoys intact); a symlinked base over precious files
  (byte-identical afterwards).
- Mutation drill on the fixture suite in an isolated mirror: ten single-point
  mutations of the helper (parent check, basename shape, ownership registry,
  marker presence, marker token, `..` rejection, `/` rejection, fail-closed
  exit status, the `INT` trap, an over-broad `rm`) each fail the fixture
  suite; the unmutated control passes.
- Scope: `-U0` hunks for the six suites are confined to lines 5–20; the three
  fenced `stat -f` sites are untouched; `scripts/resume.mjs`,
  `scripts/release.mjs`, `scripts/worktree.mjs`,
  `scripts/check-publication.mjs`, and `scripts/backup-intake.sh` are
  byte-identical to `origin/main`; `package.json` differs by the one `test`
  line; no `.claude/` or `docs/decisions/` path changed; `grep /private/tmp
  scripts/` is empty.

## Verification trail

- `docs/verifications/WO-013/VER-001.md` — pass; nine criteria confirmed in
  full, AC8's in-sandbox half confirmed and its outside-sandbox half disclosed
  as not reproducible under harness policy; no findings; seven independent
  probes across 49 suite × base cells; three observations.
- `docs/final-reviews/WO-013/FINAL-001.md` — pass; one bounded wording
  correction (the work-order map row); the executor's heading amendment
  adjudicated as a disclosed forward-correction of a designated placeholder;
  subject proven byte-identical to the tree VER-001 passed; method and
  instruments disclosed.

## Known open items

- **AC8's outside-sandbox half** rests on the executor's runbook self-report
  (exit 0, 77/77, empty residue listings); neither the verifier nor the
  reviewer can leave the sandbox under current policy. The code path is
  base-agnostic and was exercised across 84 suite × base cells. One
  `npm test` from this worktree in a plain terminal closes it to the letter,
  at the operator's option.
- **Executor model and effort** are not recorded in a committed artifact
  (VER-001 observation 2; the runbook note names only the final evidence
  session); the verifier's and reviewer's are in their report headers. Same
  structural gap as WO-015.
- **Hardening candidate:** activation accepted a work-order heading without a
  strict version, which `scripts/release.mjs` would have refused at close;
  `worktree start`/`resume activate` could preflight the same rule.
- **Portability notes, not defects:** the fixture suite's unwritable-base
  assertion is an environment check that fails deliberately when run as root;
  the helper stays inside bash 3.2 features and every run here used macOS's
  `/bin/bash` 3.2.57; `scripts/test-temp-root.sh` is a sourced library despite
  its `test-*.sh` name.
- **Timing-sensitive fixture:** the signal cases poll at 10 ms with a 15 s
  deadline against `scripts/test-release.sh`; no drift across the three unmutated
  executions here and the seven VER-001 recorded, but a heavily loaded host is
  the plausible future flake source.
- Before `resume: release close`, if the main checkout's globally ignored,
  non-disposable `.claude/settings.local.json` is still present, move it out of
  the repository; the release-close gate refuses it by name.
- After merge, the separately authorized `resume: release close` runs
  `npm run release -- close WO-013 --publish` from the main checkout, reruns
  all merged evidence — including the unrelocated shell suites — and may cut
  annotated `v0.3.1`. This PR performs no release action.
