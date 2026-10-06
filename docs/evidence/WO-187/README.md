# WO-187 execution evidence

The executor completed the verification attack, whole-implementation review,
fresh-adversary and self-review duties, known-issue briefing, classified finding
counts and pinned worker definition. Independent verification is the next role.

- [Handoff](handoff.md): criterion-by-criterion evidence, actual executor
  attestation and self-review (14 found, 14 fixed, none deferred).
- [Decisions](decisions.md): D001-D018, including operator byte direction,
  implementation choices, repairs and final outcome.
- [Register write-back](close-register.md): the two required dispositions at
  close, both byte follow-ups and the reopened import-closure candidate.
- [Passing lifecycle fixture](review-fixture.json) and
  [baseline failure](baseline-fixture.json): the actual lifecycle and the
  known-input omission at 08845c71.
- [Role bytes before](cold-start-before.json) and
  [after](cold-start-after.json): all twelve roots. Each executor root is
  531 bytes over; the guide is 6,016 over. Both ceilings remain unchanged.
- [Native worker probe](worker-pin-probe.json): the isolation launch predates
  the operator's strict launch direction; effective worker model/effort were
  absent from host metadata. Subsequent Claude launches require
  `claude-opus-5-5` / `xhigh`.
- [Economy observation](economy-observation.json): the one bounded experiment;
  no measured outcome improvement is claimed.

Current editions are [authority 002](authority/002/authority.json)
(re-minted by the VER-004 repair; 001 stays intact),
[artifact identity 001](artifact-identity/001/audit.json),
[verification 001](verification/001/matrix.json) and
[feedback 002](feedback-002/edition.json), plus the regenerated harness.
Prior editions remain intact. Feedback carries the unchanged
WO-184/feedback-003 audit; no new live episode was owed.

The whole product review passed 38 required suites and 88 fresh tasks at
2026-10-05T23:05:23.345Z; the document gate passed 29 fresh required suites at
2026-10-05T23:21:17.230Z. Both hold code identity
`2454d6d5fc6e129c946f08e4df997e6d821c4685febc907868320353aa7cd210`.
D017 and the handoff retain the recorded durations, subject and timing limits.
The completion command checks the final document subject again.

Release preparation is local: application v0.66.4, compiler 0.25.3,
skeleton 0.52.4, harness host 0.34.5, console 0.4.0 with matching workspace
pins. No new dependency or branch commit. Future escaped-defect rates,
verification cost and effective worker settings remain unmeasured.

## Repair after VER-004

VER-004 failed criteria 2 and 4 on one design finding: three readers inferred
records from free-form Markdown. The repair replaces the inference with exact
formats (D044) and fixes nine of twelve self-review findings (D045).

- [Handoff](handoff.md): the criterion ledger and the self-review line for this
  repair.
- [Self-review](repair-004/self-review.md): the fresh adversary's twelve
  findings with the root's judgment of each.
- [VER-004's inputs replayed](repair-004/reproductions.json) on the repaired
  and the pre-repair readers; [probe](repair-004/probes/reproductions.mjs).
- [Real corpus](repair-004/corpus.json): 193 orders and 166 final-review
  reports; [probe](repair-004/probes/corpus.mjs).
- [Fence rules compared](repair-004/fence-rules.json) and
  [weakened rules against the fixture](repair-004/mutations.json), with their
  probes beside the others.
- [Lifecycle fixture](repair-004/fixture.json) at the worktree and against
  `08845c71`; [role bytes](repair-004/cold-start.json);
  [review gate](repair-004/review-gate.json) and
  [document gate](repair-004/document-gate.json).

## Final review

[FINAL-001](../../final-reviews/WO-187/FINAL-001.md) judged the subject
integrated with `main` at `602f7e83` (D048, D049, D052). The sections above
are the executor's handoffs; where they name edition 002, application
v0.66.4 or skeleton 0.52.4, this section is current.

- Editions after integration: [authority 003](authority/003/authority.json),
  [artifact identity 001](artifact-identity/001/audit.json),
  [verification 001](verification/001/matrix.json) and
  [feedback 003](feedback-003/edition.json), which carries the live audit of
  WO-123 feedback-013. Earlier revisions are intact.
- Release preparation: application v0.67.1, compiler 0.25.3, skeleton 0.53.1,
  harness host 0.34.5 and console 0.4.0 with matching workspace pins.
- Integrated gate: `npm test -- --review` passed 39 suites and 89 fresh tasks
  in 1,348.92 s at code identity
  `23cf9cb2d54aca6bacfc46a0036c91f22fb7e26e0e81cc132f960c5907b3ceff`,
  recorded 2026-10-06T14:33:27.454Z.
- Reviewer corrections: D050 (the index) and D053 (a probe copy that filled
  the disk).
