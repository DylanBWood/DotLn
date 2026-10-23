# WO-219 narrow classification repair review

Delta SHA-256: `672f85c8ac98fbc583104e068a7ee7ddb69b78f997e7db2579f9a447822c8248`. Read only the supplied `classification-fix.diff` for this follow-up; the earlier order remains the authority. Original `criteria.md` and `criteria.json` are unchanged. No probes, tests, project writes or Git commands.

CA-001 is addressed by static inspection: replacing only recognized document-token spans leaves the outer quoted request intact, so the requested/instructed examples retain attributed-speech. The added tests also retain the multiple-incidental-term case, baseline fingerprint stability and typed-quote refusal checks.

## CA-002 — Low — inline-code quoted requests still lose attribution

Path/hunk: `scripts/docs-check.mjs`, `operatorWordClass`, early `speechCue` and incidental-code branch (new lines 423–429).

Concrete candidate: ``The operator requested `"retain the original bytes"`.`` The record is still selected by the unchanged operator-word candidate screen. Rendering removes the inline-code span and sets `code = true`; `requested` is absent from the speech-cue list. The remaining prose has no quotes, so the early branch returns `incidental-code` before the repaired document-term handling. The CLI therefore replaces the prior ADVISORY with NOTE for a quoted operator instruction. The new positive inline-code case still uses only `replied`, which the cue list recognizes.

This is a static inference, not an executed reproduction. It is the same step-23 / criterion-2 advisory preservation contract as CA-001. Bounded remedy: preserve attribution for an inline-code span that is itself the quoted operator response while retaining incidental assignment/code handling; add this requested variant and its isolated-reversion control to the existing docs-check-fixtures case. Keep the historical fingerprint and advisory/typed-refusal boundaries.

Coverage is limited to this classification repair and its supplied tests. Full-gate execution is later work and its current absence is not a finding.

found 1 remaining concrete gap
