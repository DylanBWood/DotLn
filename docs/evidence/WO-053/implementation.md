# WO-053 — Implementation evidence

Dispatch: `resume: next`, continued under the operator's bounded scope override
recorded in [D002 and D003](decisions.md). Executor session readback at dispatch:
Codex CLI 0.154.0, gpt-6-astra, ultra (normalized xhigh/subagents). This report
records implementation evidence, not independent verification or publication.

The [live proof](README.md) contains both clean writer successes, the killed-host
recovery and all six failed attempts. The existing transport and target guard
now support native Claude schema submission and explicit bounded writer
inspection. The fixture uses an exact executable path for its focused test.
Inspection profiles, effectful host routes, event schemas and external
dependencies retain their existing contracts.

## Executed checks

- `npm test`: passed, 19 suites, zero failed, 63 fresh tasks, 519.51 seconds.
  The complete run is retained in ignored local state at
  `docs/control/local/wo053/npm-test.log`; its success row is recorded by the
  canonical runner. No gate input changed during the run.
- `npm run build --silent`: passed after the final runtime changes.
- `node --test packages/skeleton/dist/test/writer.test.js packages/skeleton/dist/test/source-change-host.test.js`:
  22 passed, zero failed; 111,608 ms. Includes pinned inspection behavior,
  writer launch/result rejection tests and the emitted target guard's native
  schema submission plus unknown-tool refusal.
- `node --test packages/skeleton/dist/test/source-change-receipt.test.js`:
  one passed; all nine live receipts validate, with required per-harness clean
  successes and killed-host recovery plus negative evidence mutations.
- `node scripts/artifact-identity-evidence.mjs --check` and
  `node scripts/verification-evidence.mjs --check`: passed against the selected
  immutable WO-122 revision 003 editions; their generated content is unchanged.
- `npm run publication:check`: passed after the roadmap write-back and source
  lock update; 272/272 headings indexed and both editions current.
- `node scripts/harness.mjs check`, `node scripts/authority-evidence.mjs --check`,
  `node scripts/feedback-evidence.mjs --check`, and
  `node scripts/console-fixtures.mjs --check`: passed. The new feedback selfhost
  completed all ten fixture rows with a live Codex verifier before recording.
- `npm run format:check`: passed. `git diff --check`: clean.

## Evidence and release surfaces

Fresh WO-053 authority and feedback editions bind the changed runtime and
generated bundle. Historical evidence and live receipt bytes are preserved.
The selected current-evidence manifest changes only authority and feedback;
artifact identity and verification remain on their passing existing editions.
The console selfhost fixture follows the newly recorded feedback edition.

The product write-backs link the proof and retain a live-evidenced level 1 for
`worker.source-change`. R2's combined decision still awaits WO-111. The
decisions index supplies this older order's ledger substitution.

The classified release is application `v0.29.3`, skeleton `0.25.2`; the
release notes are [a provisional draft for final review](../../final-reviews/WO-053/RELEASE-NOTES.md).
The draft is not a verification result or an additional implementation gate.
No commit was made on the DotLn work-order branch, and no push, PR, merge,
deployment or release publication was made.
The loadout source awaits the same final-review commit as the implementation.

## Limits

The recovery kill occurs after the worker exits. Protected checkout and
sentinel equality establishes the observed bounded episode, not universal
filesystem confinement or orphan-worker fencing. Parent growth refers to the
collector's measured child-stdout transcript; complete executor-conversation
growth is unknown. Model, effort and installed version in the live receipts
remain launch claims with unknown effective readback.
