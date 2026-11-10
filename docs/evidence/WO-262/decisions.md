# WO-262 decisions

Decisions recorded for WO-262. The first precedes its execution: it is the
planning pass's correction of the filed order after receipt 067, on the
operator's direction. Each entry names its evidence, the options it
rejected and the condition that reopens it.

## WO-262-D001 — The second criterion names the test file that exists

```json
{
  "id": "WO-262-D001",
  "date": "2026-11-09",
  "dispatch": "planning: the standard planning pass of 2026-11-09, after receipt 067 and the pass's publication; the operator's direction in that session",
  "decision": "Correct the path in acceptance criterion 2's check. The sentence case that reads the emitted executor root is in packages/skeleton/test/executor-supports.test.ts; the criterion named packages/skeleton/src/executor-supports.test.ts, which the tree does not hold. Nothing else in the order changes. The planner wrote the wrong directory while applying a criteria-review fix and did not list the file. Receipt 067's refuter found the mismatch with WO-264's text, and the planner first left the correction on the catalog row for a later pass. The operator rejected leaving a known defect of the pass's own making in the first order of the sequence, so this amendment binds the corrected criterion to receipt 067 through npm run plan -- amend-order.",
  "evidence": [
    "The operator's message of 2026-11-10T01:58:23Z in the planning session, in paraphrase: carrying a defect the pass itself made forward to a later pass is not acceptable. Ignored capture SHA-256 e9baaba2af6587a90ef5aecabb3dcdeb43cef9cedfc7e4eedddf450dedf10b53, which is the session journal's digest of the message.",
    "ls at 50a1ef99c: packages/skeleton/test/executor-supports.test.ts exists and packages/skeleton/src/executor-supports.test.ts does not; the order's own step 2 and WO-264's cost line name the path under test/.",
    "A scan at 50a1ef99c of every repository path the fourteen orders of the pass name: this is the only one that neither exists nor is created by its own order.",
    "docs/planning/refutations/2026-11-10-planning-64892614a4699ecc-067.md: WO-262's third known issue names the two paths.",
    "npm run plan -- check after an unbound edit of the criterion on 2026-11-10: refused, naming WO-262 criterion:2 as a changed criterion with no text-bound disposition or authorized execution amendment."
  ],
  "rejected": [
    {
      "option": "Leave the criterion as judged and carry the correction on the catalog row until a later pass amends the order",
      "reason": "It was the pass's first course, and the operator rejected it: a verifier judges a criterion as written, WO-262 is first in the sequence, and the defect was the planner's own."
    },
    {
      "option": "A second refutation of the corrected order",
      "reason": "The helper admits one judgment per pass unless observed evidence changes, and a path correction is not new evidence."
    },
    {
      "option": "Amend criterion 4 in the same change, to pin an open order with no ladder line",
      "reason": "That is a known issue of the receipt and not a wrong statement. It stays on the catalog row, and this amendment is bounded to the path the operator's message names."
    }
  ],
  "reopenWhen": "The sentence case is no longer at packages/skeleton/test/executor-supports.test.ts when WO-262 is activated."
}
```
