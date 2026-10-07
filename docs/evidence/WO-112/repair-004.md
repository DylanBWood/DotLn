# WO-112 — repair of VER-004

This executor receipt addresses VER-004 F1/F2 under `resume: fix`, with
[D041](decisions.md#wo-112-d041--retry-the-episode-in-its-resident-and-bound-changing-review-bodies)
and the cached-preparation repair and review improvements in
[D042](decisions.md#wo-112-d042--apply-the-same-preparation-boundary-to-cached-resolution-inputs).
It records execution, not an independent verification verdict. Filed reports
and the historical live proof runs retain their bytes. The full review and document gates
pass at the current code identity.

## Repaired rules

| Finding | Rule | Cases beyond the quoted counterexample |
| --- | --- | --- |
| F1 | A retryable triage episode retains its pending resolution command. Its resident defers the continuation with capped exponential backoff and keeps `ResidentHost.run` alive. Only the transport's launch/return marks an undecided episode; host preparation remains a typed stop. Authority expiry bypasses backoff. | Three successive interrupted/unavailable/untyped failures followed by resolution in the same 60-cycle resident run; exact 1/2/4-second delays; repeated failures at a two-second configured cap; expiry before a long retry deadline; initial checkout alias refused without any episode. |
| F2 | One invocation makes at most eight fresh review-body judgments. If the next current subject is unjudged, it stops `needs-human`, names that item and observation, and records no judgment of it. | Continuously changing text, changing head, nine different bodies, settling exactly at the eighth judgment, and a later invocation that judges only the now-stable subject before replaying its recorded result. |
| Adversary finding | Cached and fresh resolution preparation both require the same real child directory; cached input must be an ordinary file. | After an interrupted first episode, replace the prepared child with a symlink, or replace its receipt with a symlink. Both refuse before a second launch and leave destination names/bytes unchanged. |

Replay also validates a judgment's existing schema version and hashes its
stored subject. The checkout regression covers a registration surviving its
missing directory while an unrelated valid worktree remains intact. No new
schema, dependency, scheduler or remote effect is introduced. Restart retains
the existing pending command but resets process-local scheduling memory, so
it may cost one immediate retry. The eight-judgment limit applies per invocation;
the typed stop leaves any unjudged subject open.

## Executable evidence

- Before edits, the normal build and unchanged original
  `verification-004-probes.mjs` ran under one bounded guard in 22.721 s,
  cutoff 2026-10-06T20:29:40.396Z. R1 threw `RetryableTriageError` at tick 19
  with resolution pending and one episode; R2 survived 60 cycles with intake
  deferred. B1 made 26 triage callback calls over 26 observations; the final
  callback threw at the original probe's 25-episode cap. This distinguishes
  callback count from the 25 completed acknowledgements.
- The host-checkout preparation regression and the changing-body bound
  regression passed under one bounded guard in 18.228 s, cutoff
  2026-10-06T20:39:28.825Z.
- Before the D042 changes, the new replay and cached-child tests both failed:
  an altered schema was accepted and symlinked recovery reported `resolved`.
  Bounded duration 14.011 s, cutoff 2026-10-06T20:52:09.448Z. This converts
  the adversary's cached-child inference into a reproduced counterexample.
- After D042, the checkout recovery, replay binding, cached child/receipt
  refusal and capped-backoff/expiry tests all passed: four tests, zero failures,
  58.649 s, cutoff 2026-10-06T20:53:39.356Z. Cached aliases leave the destination
  unchanged and launch no further episode; expiry records the existing
  `NeedsHuman` reason `vertical authority or wall budget expired`.
- The normal build and all three declared repair checks passed under one
  bounded guard in 412.560 s, cutoff 2026-10-06T21:01:51.735Z:
  `node --test scripts/test-vertical-judgment.mjs` (22 passed, 261.514 s),
  `node --test --test-name-pattern=WO-112 scripts/test-target-publish.mjs`
  (18 passed, 149.495 s), and
  `node --test packages/skeleton/dist/test/vertical-judgment.test.js`
  (eight passed, 0.299 s). All 48 tests passed without failure at code identity
  `4ab207c415d1aa97e405a40c5185f2dc893688270a4076c90466fad2192bf51b`.
  The required final review and document gates pass as recorded below.
- The unchanged original verifier probes and current-edition/harness/publication
  checks all completed successfully under one bounded guard in 30.370 s,
  cutoff 2026-10-06T21:03:07.619Z. R1 now survives all 60 cycles and leaves
  resolution pending during the backoff; the advancing-clock regression above
  separately proves eventual resolution in the same run. R2 still survives all
  60 cycles. B1 stops `needs-human` after eight judgments and nine observations,
  below its probe-side cap. [Projected observations](repair-004-observations.json).
  Authority, artifact-identity, verification and feedback revision 007 all check
  current; the existing live feedback audit still binds its unchanged registered
  subject. No new live audit was run. Harness check validates 33 generated
  surfaces, and publication check confirms all 29/45 linked sections current.
- The required `npm test -- --review` gate passed all 38 suites and 88 fresh
  tasks with zero failures in 1,831.434 s, cutoff
  2026-10-06T21:34:53.473Z. Execution mode is `forced-fresh`, with no reused
  tasks, unchanged code/build identities and code identity
  `4ab207c415d1aa97e405a40c5185f2dc893688270a4076c90466fad2192bf51b`.
  Both required vertical files pass together in 822.999 s under the unchanged
  900-second deadline. The document gate also passes as recorded below.

Failed intermediate checks receive no passing claim. The initial transport
type annotation needed an explicit intake/triage union. A preparation test
wrongly assumed hashing validates schema; it now uses an actually throwing
subject getter. The initial host-alias fixture used the ignored `items` key;
the fixture's checked forge contract uses `reviews`. The capped-backoff test
needed the production one-step scheduling setting while its fixture clock
was frozen; its first expectation also used the unsupported terminal label
`expired`, corrected against `vertical-host.ts` to `NeedsHuman`. The corrected
cases are included in the passing checks above and the complete passing suite.

At 20:40 UTC the executor misread `harness evidence` as an observation command.
Reading its implementation showed that it refreshes projections and starts
`npm test`. The owned gate was stopped at 2026-10-06T20:40:35.152Z before further
source edits; its wait result had no run, and no passing row is claimed.
Preparation now calls the checked projection helper explicitly before the
required review command. A first follow-up allocation was refused because a
non-open disposition requires a textual reopening condition; the corrected
request records that condition and allocates D040's blocking repair to WO-112.

## Review and preserved scope

One fresh read-only adversary, selected as Codex `gpt-6.1-sol`/`max`, read only
the order and repair/whole implementation diffs. It reported one supported
medium cached-preparation defect and two improvements. The root reproduced
the cached-child failure and repaired it; both improvements are implemented.
The same worker's final static delta review reports all three addressed and
zero supported additional defects. It ran no tests, edits or descendants;
effective child model/effort readback is unknown. Root executable evidence is
separate from the worker's static judgment.

At the preservation check, 149 historical evidence/verification files matched
repair-entry checkpoint `refs/dotln/checkpoint/WO-112/18`; none differed. All
eight retained repository units remain explicitly declared `preserve`; none
is undeclared. No new retained scratch repository or live PR run was created.
Products 06 and 12 remain byte-identical to that checkpoint. Product 03 has
176,794 bytes against its 176,807-byte ceiling; its retry/bound sentence is
consolidated in place. The 06/12 additions remain 201/163 bytes against their
300/200-byte order bounds. Publication locks are refreshed.

The repaired eight source/test paths match none of the current registered
authority, artifact-identity, verification, feedback or harness evidence
source inventories. Revision 007 stays selected for all four evidence
families and their current-edition checks pass. D002 remains
the order's only economy experiment, declined/kept-current; no new saving is
claimed. Current root readback is `codex-cli` 0.160.1, `gpt-6.1-sol`, `max`,
source `codex-session-readback`. Final usage belongs in the ignored receipt
and operator response.

D040's blocking repair is allocated to WO-112 under FUP-df4a22676759adcc;
an independent VER report owns its judgment. Its two lower items remain
unrepaired, explicitly queued and deferred: command-cleanup failure evidence
under [D043](decisions.md#wo-112-d043--keep-cleanup-error-recovery-as-a-separate-testable-follow-up),
FUP-6b6274b0176af00d; and committed after-test bytes/verification Git
interpretation under [D044](decisions.md#wo-112-d044--retain-the-writer-writable-git-interpretation-review),
FUP-7777b9f12644e560. D033's shared-object protection follow-up and D018's
planning lesson also remain open. This receipt makes no universal confinement,
object-preservation, recovery-parity or efficiency claim.

## Final document gate and handoff

`npm run test:docs` passed all 29 checks and 29 fresh tasks, zero failures,
in 104.975 s, cutoff 2026-10-06T21:38:08.894Z, at the same
code identity as the forced-fresh review. `git diff --check` is clean. All six
criteria are judged met in [handoff.md](handoff.md). The completion command
runs document validation once more against the final authored ledger before
recording the event. No verification verdict, branch commit or publication is
performed by this executor. The local release preparation retains v0.68.0.
