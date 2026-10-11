# WO-078 repair evidence

The operator dispatched `resume: fix` for [VER-001 F1](../../verifications/WO-078/VER-001.md#f1--blocking-the-judged-page-supplies-its-own-expected-kit-version).
The executor reproduced the failure, then changed the expected-version input
as recorded in [D010](decisions.md#wo-078-d010--repair-expected-versions-come-from-a-separate-captured-input).
The repair rule is: **page bytes never supply expected kit versions**.
Generation captures Git observations in `tag-observations.json` beside the
page; a check compares the page with that independent input. The declaration,
receipt contract, export/update invocation and later-tag tolerance are retained.

Actor: Codex CLI 0.162.1, `gpt-6-astra`, effort `max`, source
`codex-session-readback`. No worker was launched during repair. The original
implementation's two worker reviews remain in [self-review.md](self-review.md).

## Executed probes

All probes ran one at a time through `node scripts/harness.mjs bounded --`.
Temporary repositories were created under the system temporary directory and
removed by their cleanup handlers. No actual sibling checkout was changed.

| Command after the bounded wrapper | Result | UTC cutoff | Duration |
| --- | --- | --- | ---: |
| `node docs/evidence/WO-078/verification-probe.mjs` before repair | Reproduced F1: forged version plus embedded record exited 0, expected 1; later tag without edit exited 0 | 2026-10-11T15:03:03.001Z | 711 ms |
| `node --test scripts/test-siblings.mjs` | 13 passed, 0 failed | 2026-10-11T15:06:12.441Z | 7,239 ms |
| `node --test --test-name-pattern='WO-078 criterion 1' scripts/test-launchpad.mjs` | 1 passed, 0 failed | 2026-10-11T15:07:30.881Z | 9,734 ms |

The sibling regressions assert refusal and unchanged bytes for the original
invented-version edit. The added case VER-001 did not quote substitutes an
**existing** newer tag at the same commit into both displayed values and the
embedded record: that edit also exits 1, while the unchanged original page
passes after the tag is added. This rules out a repair that merely checks tag
existence. Missing, malformed and incomplete observations refuse without a
write and recover using the ordinary generator. A pre-existing page temporary
prevents either output replacement. Relocating the siblings root places the
observation alongside the relocated page and retains the refusal.

The export fixture asserts the observation file already exists before any
separate generator command, alongside its exact five-field receipt and page;
the update still writes the second receipt. Its generator measurement is
65 ms and the registry is 2,750 bytes. Before the explanatory page sentence
was added, the sibling probe measured 38 ms and 1,615 bytes without receipts,
98 ms and 2,852 bytes with two receipts. The complete gates run after final
formatting; their results belong in the current [handoff](handoff.md).

## Review and cost

The repair used separate executor review passes for correctness and
maintainability, not additional independent workers. The correctness pass
traced every expected-version read to the separate file, tested both invented
and real-tag substitutions and retained all original refusal fixtures. The
maintainability pass reviewed missing-file recovery, validation, both-file
temporary preparation, configured paths and integration regeneration. It
reused `exact`, `json`, `parseJson` and the existing registry/generator flow.
No additional defect was found in these passes. Existing nonblocking rows
retain [D009](decisions.md#wo-078-d009--preserve-the-worker-dispositions-as-structured-follow-ups)'s
route; this repair does not make new claims about them.

The added recurring work is one small JSON file written/read by the existing
generator/check, with no extra operator command or per-export bookkeeping.
It preserves the removed sibling-checkout lookup recorded in D003. No net
time or token saving is claimed. `npm run release -- prepare --local` retained
v0.74.2. The adjacent queue was empty at revision 0. Goal alignment matched
the intended repair: reject edited output while preserving later-tag tolerance.

## Final gates and validation boundary

The formatted repair passed `npm run test:docs` (33 checks, 0 failed,
249,191 ms, recorded 2026-10-11T15:14:22.677Z) and
`npm test -- --review` (38 suites, 0 failed, 90 fresh tasks, 1,479,890 ms,
recorded 2026-10-11T15:39:08.809Z). Both rows have code identity
`569315b50685741e95b7046cda71c010fa3a0fcd04a50757b65ce1edd41a6e34`,
unchanged code identity and unchanged build outputs. The full review ran the
launchpad suite in 119,515 ms, siblings-fixtures in 9,211 ms,
configuration-root in 5,354 ms and worktree-integration in 173,355 ms.
No repository write or worker launch occurred during the gate.

Same-day correction: a progress update attributed direct coverage of the new
observation file to the integration suite. Reading
`scripts/test-worktree-integration.mjs` showed no sibling-specific assertion.
The corrected claim is narrower: sibling and launchpad fixtures directly prove
generation, source inspection establishes the integration registration, and
the general integration suite passes. No criterion or implementation changed
as a result of this evidence clarification.

FUP-88ceacf550262cea and FUP-8c5dc05351e8c130 were settled through the follow-up
helper, citing D010 and the executable regression evidence. The final adjacent
queue remained empty at revision 0.
