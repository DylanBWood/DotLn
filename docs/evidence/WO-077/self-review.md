# WO-077 executor self-review

Observed 2026-10-10. Two fresh read-only workers received only the work order
and the implementation diff. Both were launched with `gpt-6.1-sol`, effort
`max`, and no inherited conversation; effective model/effort readback is
unobserved. Neither edited files, ran gates or launched descendants. Session
fan-out: 2 of the configured 20-agent cap.

## Criteria adversary report

Reported count: 1 finding.

**P2 — malformed manifest scalar fields pass validation.** The commit and
SHA-256 regular expressions coerce a one-element JSON array containing a
valid hash into a matching string. An array-valued commit can therefore
reach writes; an array-valued file hash instead misclassifies unchanged
bytes as locally modified. Criterion 2 requires malformed manifests to
refuse before any write. Require string types before both regex checks and
add both malformed-field cases, asserting a manifest-path error, exit 1
and an unchanged destination snapshot.

The worker reported no other concrete criterion defect in the supplied
order and diff. Required final gates and handoff were pending evidence,
not findings.

## Design improver report

Reported count: 1 actual defect; 0 optional preferences.

**Medium — malformed manifest scalar fields are accepted.** Independently
identified the same array coercion in the commit and file-hash checks.
Recommended explicit string types and refusal fixtures for both fields,
including an unchanged destination snapshot.

The worker ran no edits or gates and left final validation to the executor.

## Executor disposition

Both reported findings are fixed by one correction: `readPriorManifest`
requires string commit/hash values before checking their formats. The
existing input-refusal fixture now includes `array-commit` and `array-hash`
and asserts exit 1, a `KIT-MANIFEST.json` error and byte-identical destination
snapshots. [handoff.md](handoff.md) records the passing final gate evidence.
Counts sum the two reports: found 2; fixed 2; recorded 0. They represent one
distinct defect, with no deferred finding.

The executor also aligned `scripts/kit/CLAUDE.template.md` with the
already-declared opt-in exception. Its old promise that an upstream update
never rewrites the hand-written contract contradicted the order's declared
`change-phrase` action. This wording and the scalar guards were added after
the reviewed snapshot. [D006](decisions.md#wo-077-d006--independent-review-and-contract-consistency)
records the inputs and decision; the final gates passed at their current bytes.
