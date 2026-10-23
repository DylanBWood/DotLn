# WO-219 criteria adversary review

Input diff SHA-256: `bc2eecf948aa73379428bffa1f0d572d88468e625c2c250003479ccdf99ef689`. Reviewed only `order.md` and `input.diff`; 165 changed paths indexed. No project write, Git command, test/probe, lifecycle call or network access.

## CA-001 — Low — quoted requests containing document terms lose their advisory

Path/hunk: `scripts/docs-check.mjs:434`, `operatorWordClass` (new lines 423–439). Applies to criterion 2 / step 23 / settled row FUP-46deeb2483a9c28d.

The speech-cue expressions recognize a fixed verb list that excludes `requested`. The later `documentTerm` expression exempts the whole candidate if it contains any quoted field/term/etc. For `The operator requested: “Rename the field 'status' to 'state'.”`, the existing candidate screen still matches, neither speech-cue expression matches, and the inner field quote matches `documentTerm`. The new result is `document-term`, so the CLI emits NOTE instead of the previous ADVISORY for actual quoted operator speech. The new fixture tests `replied` and a document-term-only `requested` sentence, but omits this mixed shape.

This is a static inference from the supplied hunk, not an executed reproduction. Bounded remedy: keep uncertain/mixed speech attributed; constrain the document-term exemption to incidental quote occurrences rather than any whole record containing one. Add the requested-instruction and mixed speech/document-term cases to `docs-check-fixtures`; retain historical fingerprints and advisory/typed-refusal boundaries.

## Criteria coverage

1. Static records align: exact same 50 ids in order, summary, before and after; all latest statuses match and are newer than activation; three packet reopening conditions name the WO-219 pull request. Final handoff placement remains later authorized work.
2. All referenced control ids resolve, include the assigned row, run under a declared Preflight suite and record positive 0/reversion 1. There are 107 substantive pairs and three explicitly excluded insensitive mutants; already-met and document-only exceptions are separated. CA-001 identifies uncovered behavior within the settled row 50 claim. Raw log truth and replay were not independently verified.
3. 13 declines plus three operator packets = 16/50, within the floor one-third cap. Decline reasons name present harm/limits, evidence and reopening conditions; no static quota/accounting mismatch found.
4. The retained touching report and README account for 13 pending matches, including three original packets, two new observations and eight unlisted retained rows. The protected matching/status functions have no changed hunks; baseline/current page equality is recorded, not rerun.
5. README holds 50-row before/after tables and records 162 to 167 pending without claiming a reduction.
6. Product write-back hunks cover changed behavior in the reviewed surfaces. Final meta check and document gate remain execution evidence to finish; this review does not treat their pending state as a defect.
7. Package and lockfile hunks add no external dependency; changes are formatting and workspace versions/pins. Complete review gate, last document gate, diff check, deterministic editions and required feedback episode are not independently verified at this pre-handoff stage.
8. The runtime change removes only the local decisions-file precheck. The added fixture models a closed target binding, asserts moved-file absence, checks continuation, and refuses a changed decision hash/missing id. Evidence records contained fixed/reverted 0/0 and moved fixed/reverted 0/1 with a replay driver. README has the required upgrade statement. No additional defect found by static review.

## Limits

- Only the supplied order and diff were read; no other subject files, project writes, Git commands/mutations, tests, probes, lifecycle calls or network access.
- Not an exhaustive regression proof of all 165 changed files. Generated hook/skill/manifest copies were indexed; semantic review focused on source hunks and relevant tests/evidence.
- All 107 control references were parsed for row, suite and exit-code consistency, but retained raw logs and execution claims were not independently replayed.
- The complete gate and final handoff are intentionally later than this review; their absence is not reported as a source defect.

found 1
