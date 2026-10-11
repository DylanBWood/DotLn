# WO-072 executor self-review

Two fresh read-only workers received only the work order and the implementation
diff. Both were requested as Codex `gpt-6.1-sol` at `max`, with no inherited
conversation. Effective model and effort readback is unavailable. Their static
reviews do not replace the executor's executable evidence.

## Criteria adversary

Initial review: zero declared-criterion findings. The recovery recheck also
found no declared-criterion failure, but identified one P2 follow-up: two
planned sibling paths differing only by letter case could alias on a
case-insensitive volume and strand the retained start.

Disposition: fixed in the same path preflight. Equal physical parents and
case-folded, NFC-normalized names refuse before the receipt or either worktree
is created. This conservatively refuses case-only sibling pairs on
case-sensitive hosts as well. The real-Git collision fixture exercises both
identical and case-only names and checks for no branch, worktree, pending
receipt or registry residue.

The worker's final two-file diff recheck confirmed the fix and reported zero
remaining findings in that bounded review.

Count: found 1; fixed 1; recorded 0. The finding is outside criterion 3's
declared cases and was repaired without changing the acceptance set.

## Design improver

Initial review found two P2 defects:

1. Target and planned launchpad worktree paths could coincide when the clones
   shared a basename. Fixed by the preflight overlap check and no-residue
   fixture.
2. A bootstrap or bundle-emission failure could leave a target worktree without
   a selection registry or usable retry. Fixed by the ignored pending-start
   receipt and same-command recovery. Retry verifies the pair, branch, base
   ancestry and authority bytes, preserves target commits, resumes preparation,
   registers both launchpads and then clears the receipt. Fixtures inject both
   failures and verify preservation and one activation.

The worker's updated-diff recheck confirmed both fixes and reported zero new
findings or recovery regressions within its static review scope.

Count: found 2; fixed 2; recorded 0.

## Disposition

self-review: found 3; fixed 3; recorded 0

The durable design and reopening conditions are in
[WO-072-D005](decisions.md#wo-072-d005). Final passing commands and their
identity belong in the executor handoff. Earlier source-inspection workers
were separate from this fresh pair; the executor launched four read-only
workers total, reused the review pair and launched no descendants.
