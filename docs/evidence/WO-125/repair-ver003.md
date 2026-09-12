# WO-125 repair of VER-003

Operator dispatch: `resume: fix`, 2026-09-12. Failure source:
[VER-003 F1](../../verifications/WO-125/VER-003.md#f1--pre-existing-hard-links-let-in-place-shell-writes-change-tracked-inputs-during-a-live-gate-blocking-low).
The operator directed wrapping up or recording a known issue, permitting a
straightforward repair that improves DotLn DevEx. [D005](decisions.md#wo-125-d005)
records why the small repair was selected, its limits and reopening condition.

The classifier now protects an existing non-directory destination with multiple
hard links. Other names for that inode are unknown and may be gate inputs.
Ordinary scratch files and directories retain their previous behavior. The
intentional conservative case is a multiply-linked file whose names are all
scratch: writes still refuse while a gate runs. No filesystem scan, dependency,
transport change or further repair scope was added.

The new runner regression failed against inherited code, admitting
`scratch/input-link.ts`. After repair, it covers a tracked file linked into
scratch, a symlink to that hard link, ordinary existing/new scratch, a scratch
directory and multiply-linked scratch. The generated-hook matrix includes
Write, Edit, redirects, append and `tee` through the hard link, including the
Codex shell adapter. Admitted attempts execute inside the disposable fixture;
each protected attempt now refuses with the active run named and an unchanged
gate fingerprint. Existing scratch, gate-lifetime and dead-owner controls pass.

Executed evidence:

- Build passed with atomic file replacement.
- `node --test scripts/test-runner.test.mjs`: 19 passed, zero failed or skipped,
  8.08 seconds.
- `node --test --test-name-pattern=WO-125 scripts/test-harness.mjs`: four passed,
  zero failed or skipped, 93.89 seconds.
- Harness emission regenerated 24 surfaces. Authority revision 004 records four
  unchanged programs, four widening refusals, nine runtime denials and 27 bundle
  comparisons; the current selector names it.
- The feedback check passed its ten regressions and ten removal controls.
  Revision 001 remains valid because none of `FEEDBACK_SOURCE_PATHS` changed;
  it does not claim to audit gate classification or represent a new live audit.
- Local release preparation retained application `v0.17.2` and skeleton `0.15.2`.
  Product 07 and the affected publication source lock reflect the repair.

The required `npm run harness -- evidence` runs after these authored bytes and
preparations. Its full-gate and diff records govern `repair-complete`; the final
input comparison remains necessary for unhooked writes and tool-boundary races.
The prior transport observations and separate verification/review duties remain.
Other VER-003 observations retain their recorded dispositions, including O3's
separate console-timeout nomination. No additional bug hunt is part of this repair.

Actor: Codex CLI `0.154.0`, GPT-6 Astra at `max`, source `operator-attested`
under the repository default, not effective-session readback. This session uses
the explicit begin/observe/delivered adapter; its sole writer reservation has
liveness unavailable in the sandbox.

Entry usage retry measured 75,311 total tokens. The pre-report observation at
2026-09-12T13:54:07.524Z measured 1,026,657 total tokens, including 981,376 cached
input, across 11 observed tool steps. Source: `codex-transcript-counter`; scope:
`dispatch`, beginning at explicit session entry and excluding earlier routing
reads. Counts include useful work and waiting. Wrapped command counts and
monetary cost are unavailable. The handoff collector retains later counters;
no equivalent alternative was measured or efficiency saving claimed.
