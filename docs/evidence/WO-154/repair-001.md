# WO-154 repair evidence — VER-001 F1

Dispatch: `resume: fix`, 2026-09-24, recorded by the harness before this
procedure loaded. Source finding:
[VER-001-F1](../../verifications/WO-154/VER-001.md#ver-001-f1--a-rebuilt-compiler-label-prevents-retaining-or-carrying-the-audit),
recorded as [D010](decisions.md#wo-154-d010--ver-001-rebuilt-compiler-labels-prevent-audit-retention).

**Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.281","model":"claude-opus-5-5[1m]","effort":"xhigh","source":"claude-session-readback"}

The model is the session's own identifier. The effort is Claude Code's
selected-effort readback (`CLAUDE_EFFORT=xhigh`), not an effective value. The
harness version is `claude --version`. The session held the worktree's single
writer and spawned no subagent (0 of the cap of 20). It made no branch commit,
push, pull request, tag or publication.

**Process cost:** entry 82,900 tokens (2026-09-24T17:04:32Z); handoff 53,613,237 tokens (2026-09-24T18:10:05Z); source claude-transcript-message-usage (scope dispatch; cost in USD unavailable from this counter)

The live verifier episode's usage is separate (claude-result-envelope):
162,335 ms, 678,751 tokens (17,834 output), USD 1.5991866.

## Operator decisions during the repair

1. **One more live episode.** The fix edits files the live verifier judges, so
   the edition had to be recorded again. The order had authorized one live
   episode, already spent. The operator authorized a second one and folded in
   `FUP-0c86ada82f559914`. The order text gained "Operator authorization —
   2026-09-24" and criterion 8, bound with `plan amend-order`
   ([D011](decisions.md#wo-154-d011--ver-001-f1-repair-a-compiler-release-is-recorded-metadata-at-every-replay-layer)).
2. **Accepting recordings from an older compiler release.** WO-050 and WO-133
   had left this for a later order. The operator confirmed that WO-154 makes
   the decision
   ([D014](decisions.md#wo-154-d014--wo-154-is-the-compatibility-scope-wo-050-d002-reserved),
   [D015](decisions.md#wo-154-d015--wo-133-d004s-rejected-option-is-now-the-contract)).
3. **The merged WO-153** is left to final review's integration
   ([D012](decisions.md#wo-154-d012--the-merged-wo-153-is-integrated-at-final-review)).
   Main changed judged files only by release labels.

## Cause

Every layer that replays a recorded stream recompiled it with the current
compiler release and required an exact match. `assertCompiledFeedback` did
this in the feedback slice, and `compileFeedbackAudit` repeats the check. The
verification slice compared a persisted command's capsule with one compiled
at dispatch, and `assertVerificationTask` did the same at result admission.
The release label is inside the program's `policyHash` and the capsule's
`inputHash`, so any compiler bump made every older recording unreplayable.
The old fixture never rebuilt the compiler, and its copy's symlinked
`node_modules` resolved `@dotln/compiler` to the source checkout, so it missed
the failure. Reproduced in a disposable copy with its own workspace links:
`--check` and `--carry` failed with `compiled policy drift`. The gate's
stored-stream replay also failed three subtests, and the console suite failed
five, which VER-001 had not reached.

## Repair

- `packages/compiler/src/feedback.ts` and `verification.ts`: both assertions
  compare a recorded program or capsule with this compiler's lowering under the
  release label it records, and refuse any other difference. The new
  `isCompilerRelease` checks the label's shape. `@dotln/compiler` moves 0.17.0
  to 0.18.0, a minor bump
  ([D005 correction](decisions.md#wo-154-d005--release-assignment-v0460-skeleton-0390)).
- `packages/skeleton/src/reactor.ts`: the verification slice adopts a persisted
  command whose capsule differs from the dispatched one only in that label, and
  rebuilds its continuation from it. A same-release persist follows the old
  path.
- `scripts/feedback-evidence.mjs`: when a compiler release has moved the
  policy hash, `--check` names the deterministic `--carry` (no live episode).
  The console binds that hash to the current compiled policy. Skeleton and
  console label bumps keep the audit with no action.
- `FUP-0c86ada82f559914`: `liveAuditCandidates` gives the resolver the live
  audit's `pins/` files, and `--record-selfhost` no longer writes Git objects.
- `scripts/reactor-identity.mjs`: WO-050's byte oracle streams its digest,
  because a full replay of WO-011's self-host verifier is longer than any
  string the runtime can build. It also follows a manifest chain, adding
  `packages/skeleton/fixtures/wo154-identity.json` beside the untouched
  `wo050-identity.json`
  ([D014](decisions.md#wo-154-d014--wo-154-is-the-compatibility-scope-wo-050-d002-reserved)).

## Re-mint

Feedback revision 002 was recorded from one live episode after the last
judged-file edit ([D013](decisions.md#wo-154-d013--re-mint-after-the-repair-one-live-episode-and-why-each-edition-changed)).
The command was `DOTLN_LIVE_WORKERS=1 npm run dotln --silent -- feedback-audit
--store .runtime/feedback-audit-wo154-r002 --transport claude-cli-print
--model claude-sonnet-5 --effort xhigh`, run 17:35:07Z to 17:37:50Z. It
completed on the first attempt with ten fixtures and 1,192 saved instruction
bytes. Effective model and effort are unknown. Authority, artifact identity
and verification were re-minted deterministically as WO-154 revision 001,
after the harness surfaces were regenerated (31 surfaces). Each file differs
from its WO-157 predecessor only in the compiler label, the hashes derived
from it and one revision label. Revision 002 is 189,014 bytes against
2,250,286 by value. Revision 001 stays on disk.

## Checks

Executed on 2026-09-24 against the final tree unless stated:

- Before the paid episode, the regressions ran in a disposable copy. There,
  a fake-transport edition was recorded under the final code, and only the copy
  let the check accept that transport. Both end-to-end tests passed there. The
  new rebuilt-compiler test fails on checkpoint 5's source with F1's error:
  [fixtures/rebuilt-compiler-before-repair.txt](fixtures/rebuilt-compiler-before-repair.txt).
- [fixtures/repair-evidence-sources-wo154.tap](fixtures/repair-evidence-sources-wo154.tap):
  2 of 2. The case of a compiler release built in its own copy runs `--check`
  (names the carry), `--carry`, the carried `--check`, the gate's stored-stream
  replay (7 of 7) and the judged-change refusal.
- [fixtures/repair-admission-and-editions.tap](fixtures/repair-admission-and-editions.tap):
  9 of 9. These cover compiler admission and refusal, the verification slice's
  adoption and refusal on the WO-157 stream, historical replays under 0.5.0
  and 0.6.0, the pins snapshot, and the order's earlier edition cases.
- [fixtures/repair-wo050-oracle.tap](fixtures/repair-wo050-oracle.tap): 18
  fixtures under compiler identity 0.11.1. In negative controls, an unexplained
  row change and a missing reason each fail.
- `node --test packages/compiler/dist/test/*.test.js`: 114 of 114. Console
  suite: 21 of 21. `console-fixtures --check`: five cases match, and the
  self-host case keeps its 20 `unavailable` fields.
- `feedback-evidence --check`: "Live feedback audit
  docs/evidence/WO-154/feedback-002 judged the current source." `authority`,
  `artifact-identity` and `verification` `--check`: all pass.
  `harness check --loadout contributor` and `harness-context --check` pass.
  `release check-surfaces --local`: 0 FAIL.
- The gate results and `git diff --check` are recorded under
  [Gate](#gate).

## Gate

- `npm test -- --review`, 18:00:44Z to 18:09:32Z: **38 passed, 0 failed,
  527.48 s, 82 fresh tasks**. The implementation pass's review gate ran 30
  suites. The extra eight are machinery suites `--review` selects because
  scripts they declare changed (`release:case:*`, among others). The product
  gate is still 27 suites, and no suite was added. `evidence-sources` ran
  59.45 s (36.27 s before), with the rebuilt-compiler case added. `skeleton`
  ran 289.96 s. The WO-050 oracle now takes 1.7 s for 18 cases, against about
  100 s had WO-011's self-host verifier stayed in it.
- `npm run test:docs`: 21 passed, 0 failed, 29.90 s, after the last document
  edit before the gate.
- `git diff --check`: clean; the untracked new files carry no trailing
  whitespace. `prettier --check` over every changed and new file: clean.
- `npm run publication:check`: both reader editions current after their
  source locks were refreshed for the 03 and 06 edits.

## Limits

- The feedback slice's own persisted-command comparison uses the recorded
  program's hash, so it needed no change. The replays of the WO-011 and WO-154
  audit streams exercise it. No repair-host stream recorded under an older
  compiler exists, so the repair slice's replay across releases is untested.
  Its capsule check is `assertVerificationTask`, which now accepts the
  recorded release.
- WO-011's self-host verifier left the byte oracle for cost, and its replay is
  asserted in the skeleton verification suite instead (D014).
- Effective model and effort of the live verifier are unknown.
