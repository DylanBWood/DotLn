# WO-076 self-review

Two fresh independent workers received only the order and the implementation
diff. Both ran gpt-6.1-sol at max effort and stayed read-only; neither ran a
probe or gate. The executor owns the fixes and executable evidence.

## Criteria adversary

Found 2; fixed 2; recorded 0.

1. A generated-block-only `CLAUDE.md` passed the pre-strip floor check under
   `build: none`. Validate the remaining handwritten text before any mutation.
   The fixture now asserts refusal and byte preservation for this case.
2. The narrowing fixture logged changed paths but did not constrain all output.
   It now compares every merged and per-profile file after only the declared
   writers/evidence edits and their semantic hash; it checks the complete
   manifest after only derived file/target hashes and overlay metadata change.
   The diagnostic records both envelopes, changed paths and derived differences.

The adversary inspected the corrective diff and reported zero remaining gaps.

## Design improver

Found 1; fixed 1; recorded 0.

1. A decoded overlay and independent stored digest could diverge for a
   programmatic caller. The reader now returns original bytes; installation
   derives both decoded input and SHA-256 from those bytes. The identity fixture
   changes the bytes and checks that both its target hash and overlay digest
   change.

The improver inspected the corrective diff and reported zero remaining gaps.

The six WO-076 fixtures passed after these fixes with
`node scripts/harness.mjs bounded -- node --test --test-name-pattern=WO-076 scripts/test-harness.mjs`
at 2026-10-12T00:11:11.564Z: 6 passed, 0 failed. The final handoff records the
full-suite evidence and its current subject.

After the first full gate exposed an integration fixture revision split, the
executor repaired the source-copy helper (WO-076-D006). The design improver
inspected that corrective diff read-only and reported zero actionable gaps.
The two targeted real Git continuation cases passed after the repair.
