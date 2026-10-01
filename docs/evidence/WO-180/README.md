# WO-180 — Baseline witness

The baseline episode runs the existing confined named tests on a sealed base
snapshot before an implementation effect. `BaselineWitnessed` preserves the
compiler-pinned capsule, producing episode, outcome, limitation and witness
identities. Its matrix exposes host/live rows with `subject: baseline`; baseline
completion leaves acceptance incomplete.

For a defect story the caller names each regression by criterion, check, exact
command and expected nonzero exit. Every named regression must fail as specified
for `reproduced`. A passing, unavailable or differently failing test records
`not-reproduced` with the observed limitation. `baselineDisposition` returns the
typed `BaselineNotReproduced` stop naming that story. A new story records `walked`
and its existing-test outcomes; unavailable tests retain their limitation.

The later verifier receives pinned comparison context. It compares the same
criterion/check/command on both subjects and reports `baseline-test-did-not-fail`
when the base did not witness the named defect. That criterion cannot pass.
Comparison findings remain separate from the candidate's actual test outcomes,
so a passing candidate is unverified rather than a fabricated test failure.

## Consumer interface

Use `prepareWorktreeVerification` with `observedCommit === baseCommit`. Open the
existing `VerificationDriver` with that subject as both baseline and subject,
and `baselineContext: { kind: "baseline", story }`. Persist and run the existing
`VerificationHost` on the returned read-only snapshot. Read its
`state.baselineWitness` and consume `baselineDisposition` before implementation.
A completed actor requesting human attention enters `attention` without a
witness. The composition double returns `BaselineNeedsHuman` and holds before
implementation; an absent witness supplies no permission to continue.
For candidate verification, open the driver with the original base subject and
`baselineContext: { kind: "comparison", witness }`. Both snapshot contracts and
named test lists must match. All types and helpers live in
[verification-protocol.ts](../../../packages/skeleton/src/verification-protocol.ts).

The [fixture](fixture.mjs) doubles WO-123's future sequence and imports WO-056's
synthetic repository generator and tests. It commits the planted signed-addition
defect as the base, witnesses its failure, then commits the repaired synthetic
candidate and verifies it. All target writes and commits belong to the synthetic
temporary repository. The non-reproducing fixture stops before that candidate
effect. The composition itself remains WO-123's deliverable; its existing catalog
dependency already names this step before the change.

## Live rows

Commands run from the selected DotLn Git root after a build. Each label files a
new receipt and refuses replacement.

```sh
DOTLN_LIVE_WORKERS=1 node docs/evidence/WO-180/fixture.mjs live codex gpt-6.1-sol max codex-live-004
DOTLN_LIVE_WORKERS=1 node docs/evidence/WO-180/fixture.mjs live claude claude-opus-5-5 xhigh claude-live-004
```

The current rows are [Codex](codex-live-004.json) and
[Claude Code](claude-live-004.json). Earlier 001–003 rows are historical
observations before the human-attention hold correction. Receipts name
runtime source hashes, skeleton version, host-run row identities and confinement.
The model and effort fields are host launch selections; effective readback is
unknown. Tool access is disabled, and the harness uses its authenticated model
service. The repaired candidate actor is a process double.

## Validation and limits

The focused suites passed 43 tests, including all eight new baseline document cases,
the unchanged worktree confinement fixtures and legacy capsule/stream replay.
All five evidence-source cases also pass after preserving uncommitted audit
source blobs within their temporary fixture repositories.
The document gate owns the baseline cases because they reuse historical fixture
inputs; the product selection lazily skips them without reading those inputs.
The document gate passed all 24 checks, including the eight baseline cases.
All 19 browser and 21 real integration cases pass after their fixture setup was
completed. The full review gate passed all 37 checks. Both required gates have
passing rows at the current code identity, and `git diff --check` is clean.

Application target v0.60.0 and skeleton 0.48.0 are prepared locally.
`verification-v1` and result version 1 are retained; absent context keeps old
capsules and result shapes. Compiler claim types are unchanged. The product 03
write-back adds 106 bytes, and publication and local release-surface checks pass.

This proof covers existing host-run behavior tests on the synthetic repository,
with the current worktree snapshot bounds and macOS confinement. Browser
baseline witnesses and the full delivery composition remain their declared
later work. An operator waiver belongs to that composition's per-run receipt;
this primitive returns the stop and supplies no waiver or implementation authority.
The [decisions](decisions.md) record choices, corrections and reopening conditions.
