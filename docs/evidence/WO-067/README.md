# WO-067 implementation evidence

Dispatch: `resume: next`, plus the operator-authorized bounded snapshot repair.
Prepared release: application `v0.19.0`, compiler `0.11.0`.

Presence policies now compile as optional ordered phase data. Validation refuses
unknown rules and authority widening; each phase preserves the final base's
denials, evidence, expiry and revocation restrictions. Three editable views
round-trip the policy and the tooltip projects its four axes, progression and
return/expiry handling. The compiler schedules no work. The kernel and other
component source versions remain unchanged; no dependency is added.

## Executed evidence

- [Presence fixtures](presence-fixtures.tap): 11 passing tests, including
  present hold, verified-only advancement, failure reset, two peak/reset loops,
  return races with kill/finish, stale completion, separately authorized
  foreground completion, exact idle expiry/rearming, an admitted portfolio
  effect with an unavailable adapter, real kernel cadence and resource checks,
  hostile inputs, exact empty-policy compatibility and serialized views.
- [Snapshot regression](snapshot-regression.tap): a compiler-only version bump
  installs a fresh runtime, preserves the old snapshot, and executes the emitted
  writer hook. `node scripts/harness.mjs check` checks all 24 generated surfaces.
- [Authority edition 002](authority/002/authority.json) and
  [artifact inventory](artifact-identity/semantic-hash-inventory.json) preserve
  existing program hashes and frozen oracles. Edition 001 predates the bounded
  snapshot correction and remains historical; current selection is 002.
- [Verification fixtures](verification/matrix.json) exercise planted failure,
  repair and staleness; [feedback](feedback/feedback.json) carries ten passing
  regressions and ten removal failures. The refreshed live feedback audit uses
  a separate `codex-cli-exec` verifier, supplied model `gpt-6-astra`, effort
  `xhigh`; its event streams are filed with the feedback edition.
- The console selfhost fixture follows that current audit; its manifest and
  JSON, terminal and HTML expectations are refreshed by the existing recorder.
  Historical audit editions remain unchanged.
- Publication coverage and source locks pass, as do local release/component
  checks and `git diff --check`. The full `npm test` result is recorded in the
  canonical local gate receipts at handoff.

## Decisions and limits

[Decisions](decisions.md) records the selected subset, alternatives, reopening
conditions, first-probe correction and the operator's adjacent-repair direction.
For this order filed before 2026-09-09, this file and its generated decisions-index
rows discharge the legacy ledger write-back; the planning ledger is not edited.

The fixture host is a bounded interpreter of emitted data, not the resident
runtime. WO-068 must select a policy, register the emitted predicates, enforce
current presence/capability, count actual changed files/lines, spend budgets,
correlate episode outcomes and execute return dispositions. Other curve languages,
authenticated presence and actual portfolio work remain outside this order.
No claim of production scheduling or live adapter enforcement is made.

One root coding writer performed changes; two read-only helpers supplied design,
compatibility and implementation review. Early explicit session entry did not
reserve a writer; D003 records that correction and subsequent host registration.
Actual effective model/effort readback for the root session is unavailable;
session instructions identify GPT-6, while the repository recommends Astra/max.
Entry token and cost counters were unavailable (source `unavailable`, scope
`dispatch`, cutoff 2026-09-15T17:39:54.930Z). Final counters and gate timing belong
to ignored receipts and the handoff response. No workflow saving is claimed.
