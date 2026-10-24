# WO-224 executor handoff

**Actor attestation:** {"harness":"codex-cli","harnessVersion":"0.164.0","model":"gpt-6-astra","effort":"max","source":"codex-session-readback"}

Registered targets and workstream repository sets now use the existing frozen
review, blinded refutation and immutable receipt paths. The launchpad owns the
receipts and dispositions; each target receipt identifies its registration and
commit. Local release preparation assigns v0.97.0.

The earlier document gate exposed a historical-receipt compatibility defect.
[D016](decisions.md#wo-224-d016--preserve-historical-launchpad-subject-semantics)
records its correction and passing focused reproductions. The fresh complete
run below validates the corrected code; the final document gate follows this
finished handoff.

## Criterion judgments

**Criterion 1:** met — The registered-subject fixture in
`scripts/test-entropy-review.mjs` checks the already-fetched base default, a
different explicit commit, registration-bound subject hashes, the frozen path,
and separate launchpad status/drift. Target-fit lens scopes name actual target
paths, including implementation after 32 documentation files. The
existing launchpad fixture still records `repository: "."`. A synthetic older
absolute-path receipt also retains launchpad semantics through rendering,
pending reporting, refutation, consumption and acceptance. These fixtures pass
in the complete run's `plan-refutation` suite.

**Criterion 2:** met — The same fixture refutes the target at the reviewed
commit, checks the filed pair with `entropy check`, and compares the clone's
refs and tracked status before and after both episodes. Separate cases check
concurrent source drift, a missing bound tree, and a changed clone mapping.
All pass in `plan-refutation`.

**Criterion 3:** met — The workstream fixture accepts a target survivor and
asserts both its heading and bold title name the review and repository@commit.
It runs `plan followups --sync`, checks the minted row's subject-qualified
title, and applies an allocation to a fixture workstream member order. The
fixture passes in `plan-refutation`.

**Criterion 4:** met — The workstream fixture uses two distinct repositories,
duplicate membership and a non-default `outcomes` document root. It checks one
pending dispatch, separately filed receipts carrying the workstream id and
sequence, next/pending/refute/consume/complete subject states, and partial
dispositions. Further cases check `self`, a second explicit sequence and
unregistered members refusing before a frozen copy is allocated. These pass in
`plan-refutation`.

**Criterion 5:** met — Review and refutation target copies have no remotes;
push attempts from each fail. Clone lookup fixtures check running, primary
and main checkout maps, plus a missing-map refusal naming that order before
cloning. Pending work and consumable receipts remain reportable without the
map, including selection by a full recorded commit. All pass in
`plan-refutation`.

**Criterion 6:** met — `launchpad-planning` passes with the real export fixture
registering a target, selecting it, running a fake review, filing the receipt
and checking the chain through the exported runtime. The review guide and
product 05, 07 and 12 carry the requested subject and cost contracts.
`npm run meta -- --check` exits 0 after the last decision edits.
`npm run publication:check` exits 0 for the product write-backs, covering all
255 product headings and both current edition source locks.

**Criterion 7:** met at ImplementationReady — The corrected complete review passes at
the code identity below, and `git diff --check` is clean. The final
`npm run test:docs` is recorded after this handoff is finalized;
ImplementationReady consumes its passing canonical row before recording this
judgment. No dependency, `entropy-review-protocol.ts` or
`loadouts/entropy-reducer.ts` change exists, so no re-mint or live feedback
episode is owed.

## Executable evidence and scope

[gate-runs.json](gate-runs.json) extracts all four complete attempts from the
canonical host journal. The passing run recorded at
`2026-10-24T22:50:23.392Z` took 1,310.057 seconds: 37 suites passed, 103 fresh
tasks, no reused or unrun tasks, and unchanged code identity
`d79b29bb685f09198299c42bab18ca42aaf718ed78956ce1b27e13bc1dcedbee`.
This complete run covers the order's named preflights, including target
worktrees, exported instances and configuration-root behavior.

The first run failed the configuration-root guard; [D014](decisions.md#wo-224-d014--resolve-lens-boundary-paths-through-the-configuration-owner)
records its repair. The second failed two new fixture inputs;
[D015](decisions.md#wo-224-d015--repair-fixture-inputs-and-rerun-the-complete-gate)
records their repairs and the subsequent bounded 32-test passing
reproduction. The third complete run passed, but the subsequent document gate
found the historical-receipt defect recorded in D016. After its correction and
worker recheck, all 33 entropy fixtures passed, and the fourth complete run
above passed at the corrected identity. The current receipt reproduction also
checked all 13 immutable receipts, two pre-mechanism records, 35 dispositions
and 12 packets with no interrupted filing. Earlier runs and focused
reproductions do not substitute for the current complete result. The final
document gate's authoritative result remains in the canonical journal and
the completion evidence.

All new worker episodes use `fake` transport. This proves selection, Git
confinement, receipt binding, disposition and kit carriage; it does not claim
the quality of a live target review. The first live review remains the
operator's separately opened planning pass.

## Independent review and alignment

self-review: found 4; fixed 4; recorded 0

Two fresh `codex-spawn-agent` workers ran GPT-6.1 Sol at max effort, read-only,
with no descendants: the criteria adversary confirmed three corrections
(two formal findings and one concern confirmed against the existing crash
contract), and the design improver confirmed one correction. Both final
rechecks reported zero residual findings. [self-review.md](self-review.md)
records their reports; [D013](decisions.md#wo-224-d013--repair-the-independent-review-findings)
records the fixes and reopening conditions. Explicit session fan-out: 2 of
the cap of 20; no further workers were started.

**Goal alignment:** matched. The implementation reuses one freeze and receipt
chain, uses the registered clone's named commit, fits existing lenses to the
target, and dispatches workstream members sequentially. The [baseline](README.md)
and [decisions](decisions.md) retain the source observations and alternatives.
There are no unresolved implementation findings carried to verification.

**Process cost:** Entry 36,567 total tokens, `codex-transcript-counter`,
dispatch scope, cutoff `2026-10-24T21:29:57.677Z`; cost unavailable.
The failed attempts and fresh full rerun add validation time rather than
composing older passes into a completion claim. Final counters remain in the
ignored usage receipt and final response, with their source, scope and cutoff.
