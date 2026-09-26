# WO-165 implementation evidence

Executor implementation is complete for independent verification. Dispatch:
`resume: next`, followed by `continue` and the operator's request for adversarial
subagents. Actual session readback: codex-cli 0.157.1, gpt-6-astra, ultra
(normalized xhigh with workflows), source `codex-session-readback`.

The supported Entropy Reducer routes now compile serial lens checklists without
delegate authority. New receipts describe that compiled rule, report the worker's
status and explicitly leave checklist completion independently unobserved.
Original lens content, the 32-probe ceiling and refutation selection are preserved.

## Acceptance evidence

| Criterion | Executed evidence and result |
| --- | --- |
| 1. Route, envelope, residue and receipt agree | `scripts/test-entropy-review.mjs` compiles both pinned routes, checks absent delegate effects/resources, serial read operations, checklist residue and matching receipt rendering. It checks actual Claude tool arguments and disabled Codex multi-agent features. Pass. |
| 2. Brief checklist and missing-brief refusal | The same fixture checks every default brief field in the actual prompt and the unchanged protocol's rejection of empty briefs. Loadout tests cover multiline custom text, sparse arrays, non-array iterables, uniqueness and the four-item ceiling. Pass. |
| 3. Identity change and fake end-to-end run | [route-identities.json](route-identities.json) records the fixed environment and before/after hashes. [route-fixture.txt](route-fixture.txt) records the fake review, receipt, blinded refutation, refutation receipt and disposition path. Pass. |
| 4. Deterministic authority evidence; feedback preserved | `node scripts/authority-evidence.mjs --check` passes WO-165/001; `node scripts/artifact-identity-evidence.mjs --check` passes WO-165/002. The document gate passes retained verification and feedback evidence. No feedback behavior source, request protocol or transport changed; package release labels are excluded from feedback behavior identity. No new live episode is required or claimed. |
| 5. Required checks | Final `npm test`: 28 passed, 0 failed, 72 fresh tasks, 378.45 s. `npm run test:docs`: 21 passed, 0 failed, 21 fresh tasks, 29.20 s. `git diff --check`: clean. |

The focused [loadout transcript](loadout-fixture.txt) records 15 passing tests;
the route transcript records 21. Full gate logs are local ignored evidence at
`docs/control/local/wo165-test-final.txt` and
`docs/control/local/wo165-docs-final.txt`; canonical gate rows remain in
`docs/control/local/harness/checks.json`. Publication and planning checks pass.
The final full gate supersedes an earlier passing run made before adversarial
improvements. No code changes followed the final gate.

## Independent adversarial review

Three read-only subagents were used and reused, with no descendants; the root
remained the sole writer. Each confirmed its findings closed:

- Receipt reviewer: blocked and failed outcomes must not claim completed lens
  work. The renderer now qualifies the execution rule and displays worker status.
  All five historical schema-v1 receipts still render byte-identically.
- Route reviewer: embedded line breaks could manufacture checklist items, and
  sparse arrays could admit missing lenses. Escaping preserves structured data;
  explicit array validation rejects holes and non-array iterables. A regression
  input initially hit an existing file-scope refusal and was corrected to reach
  the intended renderer check. Final focused and full tests pass.
- Evidence reviewer: the new artifact migration narration omitted WO-165.
  Artifact edition 002 corrects the description; edition 001 is preserved.
  The reviewer independently reproduced route identities and sibling equality.

Both planning-refuter and mission-check inherited metadata from the changed
reviewer. Bounded adjacent repairs pin their own existing versions and tags.
[sibling-identities.mjs](sibling-identities.mjs) compares complete current
compilations with entry source at
`f73b7e184b38de9cab97b4e86c718b6006f6b19d`, using the same compiler and unchanged
protocols. Both are equal: plan-refuter `fnv1a64:e9f7e0080fcb9810`, mission-check
`fnv1a64:4c09a5d98f6bc433`. All three adjacent queue items are completed.

## Release and decision outcome

Application v0.51.2 and skeleton 0.43.3 are prepared locally; the exact console
dependency and lockfile follow. Other component versions are unchanged. The
current residue, compiler fixtures and console projections are regenerated and
checked. Release notes are in
[RELEASE-NOTES.md](../../final-reviews/WO-165/RELEASE-NOTES.md).

[Decisions D001–D005](decisions.md) record the design, rejected alternatives,
reopening conditions and adversarial corrections. The mission outcome is more
accurate authority and receipts without new runtime authority, workflow gates or
operator rescue. The original trap and NoOp comparisons remain applicable. The
economy experiment was declined before execution; no performance improvement is
claimed. No encountered defect remains deferred.

No live model episode or independently observed per-lens completion is claimed.
The fixture launches the fake route and checks pinned CLI argument construction;
it does not launch Claude or Codex reviews. Independent verification and final
review remain separate dispatches. No commit or publication was performed.
Usage counters are reported at handoff with their source, scope and cutoff and
remain in ignored receipts rather than this committed evidence surface.
