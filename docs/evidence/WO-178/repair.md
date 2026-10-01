# WO-178 repair — FINAL-001

The provenance reader now treats a field as one record within grouped headers
and standalone paragraphs. It reads from the bold provenance label to the next
bold header label at a line boundary or the paragraph end. Inline bold prose
stays in the field; adjacent captures and quotations stay outside it. Existing
decision, dispatch, fingerprint and same-record capture checks remain active.

**Actor attestation:** {"harness":"codex-cli","harnessVersion":"0.159.3","model":"gpt-6.1-sol","effort":"max","source":"codex-session-readback"}

The two new regression tests failed before the fix. All 32 document-check
tests pass afterward. Beyond FINAL-001's example, they cover the alternative
Provenance label, placement after Track, a following Depends on field, captures
in Model and Cost, inline bold labels and fenced examples.

The [full candidate record](operator-word-repair.json) holds 61 judgments using
identifiers and digests. This repair paraphrases 20 provenance fields and seven
decision records. With D006's three earlier paraphrases, the order reaches its
30-record bound. The baseline retains 34 fingerprints and reports zero new
advisories. The lexical count does not establish semantic operator attribution.

The first proposed pass changed seven protected fields. Planning checks
identified their execution-amendment or current-horizon bindings. Those fields
retain their original bytes; the final planning check passes. D018 records the
error and correction. Filed reports and planning events are intact.
FUP-71fc2efc208f597a owns the residual sweep; FUP-de7e15d4444da75b stays allocated
through independent verification and review.

| Executed check | Result and cutoff |
| --- | --- |
| `node --test scripts/test-docs-check.mjs` | 32 passed; zero failed |
| `node scripts/docs-check.mjs` | Zero current advisories; 34 historical exceptions |
| `npm test -- --review` | 44 suites passed; zero failed; 89 fresh tasks; 847.979 s; 2026-10-01T18:06:05.066Z |
| `npm run test:docs` | 24 tasks passed; zero failed; 38.803 s; 2026-10-01T18:07:08.033Z |
| Planning, publication, release surfaces, generated harness | Passed; 32 generated surfaces |
| Candidate manifest | All 61 dispositions present; all 27 changed-file digests match |
| `git diff --check` | Clean; completion checks it again |

Both gates name code identity
`7706376b6be30fef3db8734d37d32b25d4ed98882a57b6949a4b221cf5e182fc`.
The [criterion handoff](handoff.md) carries all eight executor judgments;
completion checks the final documents again. The selected evidence editions
remain current. D019 records local release preparation at v0.61.1; the repair
requires no additional component bump or live evidence episode.

New repair inputs: the header reader and fixtures, planning continuation and
amendment-binding readers, the 61 records listed in the manifest, the document
baseline and follow-up register. D017 compares the goal and alternatives;
D020 judges the outcome. D001 remains the sole economy experiment. One writer
and zero subagents performed the repair. Entry and handoff usage come from
Codex transcript counters with dispatch scope; final counters stay in ignored
receipts and the response, and dollar cost is unavailable.

The first merged Claude auto-mode close remains the live admission observation.
Earlier boarded admission, notification-attribution and shell-observer limits
retain their named routes. This is executor evidence; next is `resume: verify`.
