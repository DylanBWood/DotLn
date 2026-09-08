# WO-039 repair of VER-001

The `resume: fix` dispatch repairs the four findings in
[VER-001](../../verifications/WO-039/VER-001.md). The earlier verification and
live attempts remain unchanged. Canonical control records the repair phase and
its recovery checkpoint; independent re-verification remains a separate dispatch.

**Actor attestation:** {"harness":"codex-cli","harnessVersion":"0.153.4","model":"gpt-6-astra","effort":"max","source":"operator-attested"}

The actor uses the repository's recorded Codex selection. No effective-session
model or effort readback is claimed. The generated Codex skills were available
to this session; the profile still declares hooks unavailable. Claude enforcement
is exercised by generated-hook fixtures and fresh isolated live role sessions.

## Repairs and evidence

1. **Aggregate finish parity.** The fixture constructs a separate compiled
   policy for every unit, obtains the same host facts as `finish.mjs`, and
   compares its subprocess verdict with the existing `feedbackBoundary`.
   Assertions require all three eligible Stop boundaries, cover both refusal
   and complete evidence, and prove that removing the policy permits the same
   request. The host retains one predicate owner.
2. **Read comparison that can expose excess reads.** New live records use
   observation-only native Read scope. A read or attempt outside the mechanically
   directed set fails the record. The observer stays active through final Stop;
   attempted relative paths/ranges and refusal counts enter the receipt and are
   recomputed from the journal by the evidence gate. Shell routes and selected
   skills remain bounded. The first observation-only run,
   [executor-008](harness-live/executor-008.json), failed because it opened the
   final-review report, which the executor did not require. Generated procedure
   now says that paths returned by status are metadata until selected by the
   role's directives or the active order's citations. This is an input-scope
   repair, not an expanded measured set or a concealed refusal.
3. **Satisfiable output review.** Verified native Read ranges accumulate only
   at one file hash. The bounded `read-output` CLI supports oversized single
   lines by returning UTF-8 chunks, their byte offsets and the next offset.
   The helper cannot create a receipt: the generated PostToolUse observer must
   receive and verify its stdout against current bytes. The fixture exercises
   more than 128 inherited outputs, a large multiline file and a large Unicode
   single-line file. It reaches both output-review and finish refusals, proves
   named missing paths/counts, and completes after the last delivered range.
   Other cases cover gaps, duplicates, stale hashes, mismatched/truncated
   deliveries, empty files, missing final newlines and UTF-8 boundaries. Direct
   output reads do not reserve a coding writer, including on main, and retain
   credential-path denial. The session-entry revision still defines the whole
   work-order output set across commits; session-only authorship was not adopted.
4. **Actual drift coverage.** Fixtures now reach missing output, unexpected
   output, missing/changed manifest and unowned-replacement refusals, plus
   removal of an obsolete output named by the prior manifest. They preserve
   the existing one-byte and symlink checks. The receipt distinguishes refusing
   unowned files from removing previously owned obsolete files.

The [first repair fixture run](repair-fixtures-001.txt) exposed a missing
fixture-local import for the new CLI; that fixture dependency was supplied.
Its source/scratch paths are reduced to shapes, with the raw local log preserved
outside the public evidence tree. The [scale-only run](repair-scale-001.txt)
passes, followed by [16 passing compiler/harness tests](repair-fixtures-002.txt).
The [reader-isolation regression](repair-read-only-001.txt) reproduces the
previous build incorrectly treating a direct output read as a writer. Later
validation covers its corrected classification as well as the final role prose.
The [next targeted run](repair-fixtures-003.txt) passes all 16 tests. After adding
the fixture for redacted out-of-worktree attempts, [repair-fixtures-004](repair-fixtures-004.txt)
passes 15 tests and records one 20-second `read-observer` subprocess timeout
while reading the fixture manifest. Its cause is not established; the unchanged
affected test [passes unchanged](repair-retry-001.txt). The final
[full gate](repair-checks-003.txt) passes all 13 current harness tests and the
complete repository check sequence with exit 0.

## Validation and limits

Final validation and current live record selection are recorded in the
[executor receipt](README.md). Historical enforced-scope attempts are retained
and their refusal counts are disclosed there; they do not substitute for the
observation-only runs. The context measurement counts the longer repaired role
instructions and remains lower in bytes and lines for every role.

The classified local release preparation retimed the unpublished application
target from `v0.14.0` to `v0.15.0` because the observed local release baseline
advanced. Compiler `0.7.0`, skeleton `0.13.0`, kernel `0.2.1` and the existing
contract/dependency axes remain as assigned. This routine collision handling
does not turn the sibling release into a repair finding.

Live role smokes remain closed synthetic WO-999 entry episodes, not complete
implementation, verification, PR or release episodes. The large-output proof
uses the actual CLI and generated hooks with synthetic post-tool payloads; it
does not claim a model consumed a production-size evidence stream in a live
session. Read receipts witness delivery, not comprehension. The full branch-diff
review cost and same-user writer-reservation model remain unchanged. No user
settings, branch commits, remote publication or package publication are part of
this repair.
