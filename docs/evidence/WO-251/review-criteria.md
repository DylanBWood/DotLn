# WO-251 criteria review

Independent worker: `codex-spawn-agent`, task `criteria_review`; selected
`gpt-6.1-sol`, effort `max`. Effective runtime selection was not independently
observed. Final read-only recheck completed on 2026-11-02 before the complete
gate. The worker made no repository edits, launched no children and ran no
probes or gates.

Found 3; fixed 3; recorded 0. No new or open findings in the reviewed scope.

- C1: a moved cwd reached the old stand-down before the desktop election.
  The off-election refusal now precedes moved-cwd handling. Regression
  coverage includes stale on-emitted settings with a live off election at the
  root, a nested directory and an outside directory.
- C2: optional observation failure could reach the outer advisory fallback
  and erase the refusal. Election observation is now guarded; a symlinked
  observation log regression preserves the denial.
- C3: the enabled response returned before descendant and router admission.
  It now follows the existing guards. Regressions cover a zero-cap descendant
  and a router whose launcher denial is latched.

The worker reviewed configuration, prefix/Skill classification, emission,
shared role guidance, refusal-row derivation, new regression tests, source
registration, target-adapter boundaries and D010-D012. The final planning-
register dependency declaration introduced no identified criteria issue.
The stricter target adapter remains an observation, not another finding.

The executor observed passing build, four bounded single tests and ordered
format/sync; these were parent-reported to the reviewer. Live desktop behavior
and full-gate execution were outside this review. See [D010](decisions.md#wo-251-d010)
for the corrections and [D012](decisions.md#wo-251-d012) for the target boundary.

After the complete run failed, the same worker rechecked the repaired
worker-profile assertion and D013-D014 before its rerun. The exact eight desktop
entries and effects are asserted before removing them from the historical-hash
input; the original hash and target-worker denial remain. No new or open
finding was identified. The focused repaired-case pass and ordered format/sync
were parent-reported; this recheck ran no probes or gates. The stopped accidental
evidence run supplies no validation.

After the document-gate failure, the same worker rechecked the template and
disabled-mode text removal. The full perception order, browser-test alternative,
default-off election and explicit session request remain; Clean Room and
Secrets are unchanged. New removal selectors preserve legacy forms and leave
the browser rule intact. The final recheck also confirmed the template and
helper source declarations match the disabled-floor consumer. No new criteria
finding arose. D015-D016, the current diff and coverage were read without
probes or gates; fresh complete and document validation remained pending.
