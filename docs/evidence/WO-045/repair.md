# WO-045 repair

## Execution failures and operator corrections — 2026-09-15

- Treated a normal parallel-release collision as an exceptional defect instead
  of applying the existing integration SOP. Check a finding against current
  workflow instructions before inventing extra work or approvals.
- Added routine version bookkeeping to `10-ir-compatibility.md`. Removed it.
  Keep integration details in the work-order record; product design documents
  are not an execution journal.
- Asked the operator to choose an ordinary evidence-directory layout and added
  optional generator CLI changes before proving they were needed. Removed the
  CLI changes. Use the existing manifest and make routine choices directly.
- Confused preserving old evidence with an obstacle to regeneration. New code
  gets newly generated evidence in separate files; leave old files alone. The
  selector now accepts numbered artifact and verification destinations.
- Interpreted "make a note" as permission to edit `CLAUDE.md`. That authority
  was not given. Removed the entire addition; the note lives here. Do not edit
  repository instruction files on the strength of a generic note request.

The operator requested concrete corrective work, not repeated apologies or
extended process narration. The offending instruction and product-10 edits
are absent from the diff.

## Integrated subject

Integrated published `v0.19.0` by fast-forward, preserving the dirty subject in
checkpoint 5 and the retained stash named `WO-045 repair preserve before
v0.19.0 integration 2026-09-15T1929Z`. Current target: application `v0.20.0`,
compiler `0.11.1`, kernel `0.3.0`, skeleton `0.17.0`. No branch commit created.
Both WO-067's snapshot regression and WO-045's generated-input regression are
retained. Original evidence and VER-001 remain available at their original paths.

Fresh artifact and verification evidence use revision `001`, authority uses
`002`, and feedback uses `001`.

## Executed checks

- `npm test`: 19 passed, 0 failed; 62 fresh tasks, 283.81 seconds.
  [Transcript](repair-npm-test-transcript.txt).
- Generated harness fixtures: 27 passed, 0 failed, including both orders'
  regressions. [Transcript](repair-harness-transcript.txt).
- Decoder/history and presence tests: 20 passed. All 66 committed event streams
  / 3,968 events round-trip byte-identically.
  [Transcript](repair-focused-transcript.txt).
- Evidence destination tests: 4 passed, including unchanged original files and
  separate new results. [Transcript](repair-edition-transcript.txt).
- All four newly generated evidence editions pass their checks. The fresh
  `codex-cli-exec` feedback audit completed with ten passing fixtures and an
  accepted verifier matrix; its launch selected `gpt-6-astra`, effort `max`.
- Harness check: 24 surfaces match. The comparison against integrated
  `v0.19.0` passes; hook text changes are version/runtime pins and the original
  authorized entry fix. [Comparison](repair-bundle-comparison.json).
- Console recordings match; historical harness evidence checks pass;
  `git diff --check` passes. Read-only comparison confirms the original evidence
  and VER-001 are unchanged. No implementation changes followed the passing gate.

Executor harness: `codex-cli 0.154.0`, observed with `codex --version`.
Effective model and effort readback are unavailable and are attested `unknown`.
Read-only advisory agents did not write files. The canonical `repair-complete`
transition hands this subject to the separate verification dispatch.
