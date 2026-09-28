# WO-173 implementation evidence

Dispatch: `resume: next` on 2026-09-28 (UTC). Executor: claude-code 2.1.284,
claude-fable-5-1, effort max (the host's selected effort, read from
`CLAUDE_EFFORT`; the order recommends xhigh), source claude-session-readback.
One writer. One read-only reviewer of the diff ran during the review gate, of
the session cap of 20; it wrote nothing. Operator steering processed during
the dispatch: a direction on the role sentence's byte bound
([D007](decisions.md#wo-173-d007--write-backs-product-07-the-follow-up-procedure-the-register-advisory-and-the-role-sentence))
and two ideation messages, handled as an ideation breakout
([D006](decisions.md#wo-173-d006--ideation-breakout-receipt-product-documents-that-only-grow)).
The follow-up queue held no item at entry and none was added.

## What changed

| Item | Change                                                                                                                                  | Decision   | Fixture                                                                                                                       |
| ---- | --------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ----------------------------------------------------------------------------------------------------------------------------- |
| 1    | `docs/evidence/WO-NNN/handoff.md` read at `implementation-ready` and `repair-complete`; refusals name identifiers and forms             | D002       | scripts/test-off-ramps.mjs WO-099 and WO-105; scripts/test-resume.sh pins; scripts/test-derived-orders.mjs writes the ledger |
| 2    | A met claim stands on its gate's row: `npm test` rows by code identity, the review form by the runner's listing, `test:docs` inline    | D003       | scripts/test-off-ramps.mjs WO-102 and WO-103; scripts/test-runner.test.mjs selection fixture (untracked files)               |
| 3    | The unmet disclosure: `unmetCriteria` on the event, the fold, `resume status`, the verify and final-review briefings with both routes | D002, D005 | scripts/test-off-ramps.mjs WO-101                                                                                             |
| 4    | `npm test` reuses a covering passing row at the current code identity; `--again` runs                                                   | D004       | scripts/test-runner.test.mjs `WO-173 npm test reuses …`                                                                       |
| 5    | Three briefing sentences and the ledger sentence in `next` and `fix`                                                                    | D005       | scripts/test-off-ramps.mjs pins and byte assertions                                                                           |
| 6    | The lock matrix as eight subtests with a 120 s cell deadline and a delay fixture                                                        | D008       | packages/skeleton/test/resident.test.ts `WO-173 a lock-matrix cell …`; [matrix-durations.json](matrix-durations.json)         |
| 7    | The register advisory states the reworded rule; the tree-hash document advisory is gone                                                 | D003, D007 | scripts/test-process-debt.mjs `WO-169 completion advises …`                                                                   |
| 8    | Write-backs: product 07 (two sections), followups.md, the role sentence, publication locks, the release paragraph and README line      | D007, D009 | `npm run test:docs`; cold-start before and after                                                                              |
| 9    | Release v0.53.2, skeleton 0.44.4, authority edition WO-173 revision 001, bundle re-emitted                                              | D009       | `release check-surfaces --local`; the four edition checks                                                                     |

[handoff.md](handoff.md) judges the nine criteria; the
[decisions](decisions.md) carry each choice with its evidence, rejected
options and reopening condition; [fixtures.txt](fixtures.txt) holds the
fixture transcripts the evidence gate names.

## Measurements

- Lock matrix, eight cells: alone 17.0 to 25.5 s a cell, 170.5 s in all
  (2026-09-28T19:53:34Z to 19:56:24Z); beside `npm test -- --review`
  17.54 to 26.25 s a cell, 174.38 s in all. Per-cell deadline 120 s (D008).
- Cold start, installed CLAUDE.md plus role skill, before and after the role
  sentence (+227 bytes): executor 26,286 to 26,513 of 29,246; verifier 23,089
  to 23,316 of 25,151; reviewer 24,171 to 24,398 of 24,576; release-close
  15,195, planner 17,343 and refuter 16,918 unchanged; every verdict
  unchanged in both skill roots ([before](cold-start-before.json),
  [after](cold-start-after.json)).
- Product 07: 154,129 to 154,821 bytes (+692; ceiling 157,212).
- Briefings, fixed growth in bytes: next 254, fix 379, verify 286,
  final-review 130; the unmet disclosure line 440 for one criterion (D005).
- The economy experiment: the runner's review listing 0.04 to 0.05 s against
  a 0.03 s in-process import; the spawn is kept (D001).

## Gates at the subject

- `npm test -- --review`: passed: 37 suites, 640.35 s, recorded 2026-09-28T20:50:02.516Z, code identity 64b907d08ffc7e0c47e0244377c96a913ba2fb33f171912286d16a305d26c29d, host-gate:64b907d08ffc7e0c47e0244377c96a913ba2fb33f171912286d16a305d26c29d:npm test.
- `npm run test:docs`: passed: 23 tasks, 13.16 s, recorded 2026-09-28T20:52:13.884Z, tree cac41d2e6a0d0b45694fc61308d96f3c5a7f6e38 (the completion runs it again inline).
- `git diff --check`: clean at handoff (the completion records its row).

## Follow-up rows this change touches

[D010](decisions.md#wo-173-d010--the-register-rows-this-change-touches)
lists the rows the completion advisory names, with what this order did for
each: two seams opened (the matrix deadline and the untracked-file selection),
the rest matched by text and left as they are for the final review.

## Observations and limits

- Pre-existing and not this order's: `docs/planning/sequence.md` is 13,965
  bytes against its 8,192 ceiling (`npm run meta` reports one budget breach).
- The solo matrix run shared the host with other sessions this executor
  could not observe (load averages 5.51, 5.71 and 4.90 read after it).
- This order's own `implementation-ready` runs the document gate inline,
  because criterion 9 names it; the `npm test -- --review` claim stands on
  the row recorded below.
- No live episode ran; no dependency was added; `packages/skeleton/src`
  changed only in `loadouts/contributor.ts` beside the release label in
  `packages/skeleton/package.json`.
- Process cost: entry 89,647 tokens (2026-09-28T19:15:11.772Z); handoff 49,285,654 tokens (2026-09-28T20:50:15.319Z); source claude-transcript-message-usage; scope dispatch

## Repair after VER-001

Dispatch: `resume: fix` on 2026-09-28 (UTC). Executor: claude-code 2.1.284,
Opus 5.5 (`claude-opus-5-5`), effort xhigh read from `CLAUDE_EFFORT`, source
claude-session-readback. One writer and no subagent. The follow-up queue held
no item at entry and none was added. Operator steering processed during the
dispatch: the byte overage stays waived and filler may be removed (D017); the
comments this repair first labelled with a finding identifier were corrected
and are recorded as an error (D016).

| Finding | Repair                                                                                                           | Decision   | Fixture                                                   |
| ------- | ---------------------------------------------------------------------------------------------------------------- | ---------- | --------------------------------------------------------- |
| F1      | Gate storage a completion cannot read or write is one advisory and the completion records; the inline document gate is not run on an index it could not write | D015       | scripts/test-off-ramps.mjs WO-106 and WO-107              |
| N2      | The concurrent matrix run's companion is the failed gate that overlapped it; the later pass is kept apart        | D015       | [matrix-durations.json](matrix-durations.json)            |
| —       | The unmet disclosure leaves out a criterion the record already waives; filler removed from the verify and final-review text | D017       | scripts/test-off-ramps.mjs WO-101 and WO-103              |
| —       | Comments that carried a finding label now state their rule                                                       | D016       | none; 45 such lines in 25 other files are a follow-up     |

Negative controls in session scratch, the current fixture over the current scripts with one file taken from the fix checkpoint: with the old scripts/lib/lifecycle-evidence.mjs it fails at `implementation-ready under not json` with the JSON parse error, and with the old scripts/lib/handoff-ledger.mjs it fails there with the document gate refused.

- `npm test -- --review`: passed: 37 suites, 642.41 s, recorded 2026-09-28T21:45:15.891Z, code identity 605f737de6a1f4e814af0577cfa7593e16687710b7aa4065542d425067c3c056, host-gate:605f737de6a1f4e814af0577cfa7593e16687710b7aa4065542d425067c3c056:npm test.
- `npm run test:docs`: runs inline at `repair-complete`, since criteria 2 and 9
  name it.
- `git diff --check`: clean before the completion.
- The seven edition and harness checks pass at the repaired subject; nothing is
  re-minted.
- Process cost: entry 87,635 tokens (2026-09-28T21:17:09.524Z); handoff 21,027,413 tokens (2026-09-28T21:49:34.451Z); source claude-transcript-message-usage; scope dispatch. A first review gate was stopped after about 100 s to take the waived-criterion fix; it recorded no row.
