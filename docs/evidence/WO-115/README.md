# WO-115 implementation evidence

Dispatch: `resume: next`. A Codex CLI executor session activated the order and
wrote the first implementation with decisions D001–D004; this completing
session did not observe that session's model or effort. After the Codex
provider became unavailable, the operator directed Claude Code to take over the
same worktree. Codex's tree and decisions were preserved and repaired in place.
Completion: Claude Code, `claude-opus-5-5`, effort `xhigh` from the session's
`CLAUDE_EFFORT` readback.

Codex's recorded `npm test` for its sources failed: 442 passed and 7 failed
(`docs/control/local/harness/checks.json`, 2026-09-25T22:47:57.768Z, exit 1).
Two independent adversarial review passes, each of three read-only finders and
one batch refuter, judged the tree before completion. The first reproduced the
seven failures and found the authority, refusal-shape, robustness and fixture
defects that D005–D009 correct. The second judged the repair, and D010 records
its confirmed corrections. D011 records the harness re-emit and the new
authority evidence edition that the repair required.

| Criterion | Executable evidence |
| --- | --- |
| 1. Same result bytes and same events per contract command | `every contract command keeps its terminal parser, refusal bytes and events over loopback`: all 23 IDs run directly and served with phase-independent parser refusals. Bytes match, the launchpad control digest and the resident's domain events are unchanged both ways, and each receipt's effect equals the terminal classifier's. Success paths with bytes and events are `resume status` and `times` (against adjacent terminal runs), the compiled diff, `dotln status`, `console status`, and `presence away` and `back`, whose domain event deltas are equal. After the repair, a request queued behind a FIFO-blocked `console.status` is answered at once and returns `dotln status`'s terminal bytes when the lane frees (D013). |
| 2. Outside the contract, caller not on the local user's loopback, envelope denial: terminal refusal shape | Recorded `unknown console command` refusals for `unknown.command`, `Resume.Next` and `resume next!`. Missing or wrong token, foreign `Origin` and a `Host` other than `127.0.0.1` get 403 with the refusal body. Under a current fixture envelope, `repo.read` is admitted and `lifecycle.run` and `shell.run` are refused with `compiled authority does not permit <effect>`, after the hooks' decider reports `effect not allowed`. Classification, streaming, invalid-request and oversize refusals are also covered. Every refusal is exit 1, empty stdout and one `error: <reason>` line (D007). |
| 3. Every invocation appends a `console` event; replay reproduces results | Every decoded request has `ConsoleCommandInvoked` and `ConsoleCommandObserved` with actor `console`. Replay equals the served results, including refusals and commands interrupted by a departing caller and by shutdown (exit 143). After the repair, a caller that leaves while its request is queued and a request still queued at shutdown keep their invocation and refusal receipts and appear in replay (D013). A truncated log names its missing result, and console receipts leave the host's change baseline alone. |
| 4. Write-backs | Product 04 §Console parity contract v1 under §Terminal first, console equal, and §Later console hosts; product 07's resume-phrase sentence; console README §Resident command client; the skeleton README resident section; the README release paragraph; the product 06 release note; publication index and source locks. The inherited ledger duty is discharged by [decisions](decisions.md) D001–D011 and their rows in the [decisions index](../../lineage/decisions-index.md). The planning map already marks the wave-5 candidate allocated for its contract half as WO-115 (`docs/planning/work-order-map.md`). |
| 5. `npm test` green, `git diff --check` clean, no new dependency | See the gate below. The package manifests change only component versions, the console's skeleton pin and the console's `./client` export. |

[Focused transcript](console-commands.txt): the WO-115 fixture file after the
repair, 5 tests passed and 0 failed in 16.12 s.

`npm test` passed: 27 suites, 0 failed, 71 fresh tasks in 320.63 s, recorded at
2026-09-26T00:59:10.277Z (canonical runner transcript and its host-gate
receipt). This includes the console suite (21.05 s) and the skeleton suite
(317.95 s) whose seven tests failed in Codex's run. `npm run test:docs` passed
all 21 suites with 0 failures after the evidence re-mint, and passes again
after this report.

The harness bundle was re-emitted (31 surfaces) because a pinned runtime file
changed. Authority evidence is recorded as [WO-115 revision 001](authority/001/)
and selected in `docs/evidence/current.json`: its `authority.json` is identical
to WO-160 revision 002, and its bundle diff differs only in digests (D011).

Other checks at this subject: `node scripts/authority-evidence.mjs --check`,
`node scripts/feedback-evidence.mjs --check`
(the WO-159 live audit carried by WO-161 still judges the source, because
`resident-state.ts` is byte-identical to `main`), `npm run publication:check`,
`npm run plan -- check`, `node scripts/release.mjs check-surfaces --local`,
`npm run release -- prepare --local` (target `v0.52.0` current), prettier and
`git diff --check`.

Release: application `v0.52.0`; skeleton `0.44.0` and console `0.3.0`, with the
console's skeleton pin following. Compiler `0.19.1` and kernel `0.6.0` are
unchanged. There is no new dependency, and package publication controls
remain in place.

Limits. Loopback plus a token in an owner-only descriptor is local-user access:
another local user can reach the port but cannot read the token. There is no
streaming; `console status --watch` stays a terminal command. The success paths
of the lifecycle, intent, bind and emit commands are not run against the
repository; their parity rests on the identical entrypoint, arguments, working
directory and environment, and on the refusal inventory (D009). `harness check`
exits 1 in this worktree because its local installed snapshot drifted from its
pins, so its success bytes vary by checkout and only its parser refusal is a
fixture (D010). A resident killed with SIGKILL leaves console children running
unobserved; replay names their invocations as incomplete. Stores bound with
`--portfolio` judge console commands under their own compiled envelope. Prose
that the terminal classifier cannot classify is refused rather than deferred to
host permissions (D010). Process-group interruption assumes a POSIX host.

Goal-alignment outcome: a UI host can list and invoke the terminal's own
commands under the terminal's own classification and decider. The terminal's
parser and lifecycle guards and the resident's private log stay unchanged, and
the judged resident fold is untouched. No token, latency or cost reduction is
claimed. See D005–D011 for alternatives and reopening conditions.

## Repair against VER-001 F1

Dispatch: `resume: fix`. Claude Code 2.1.283, `claude-fable-5-1`, effort
`xhigh` from the session's `CLAUDE_EFFORT` readback. No subagent was
spawned. D002's economy experiment stands; no second one was started.

VER-001 F1 found that a decoded request waiting in the serial lane received no
response headers until the preceding command finished, so a native fetch timed
out after about 301 s, and that a caller which left while queued was dropped
before admission, leaving no receipt. The repair
([D013](decisions.md#wo-115-d013--repair-ver-001-f1-open-every-decoded-requests-response-before-the-lane-and-keep-its-receipts))
opens the response for every decoded request before it enters the lane, runs
the 30 s keep-alive across the wait and the command, and always admits and
records a queued request: a caller that left is refused with `the caller left
before the command started`, and a request still waiting at shutdown with
`the resident is stopping`. The terminal handlers, the serial lane and the
compiled-authority judgment are unchanged, and no deadline was added.

The bound fixture gained a two-request block and a waiting request at
shutdown. On the unrepaired lane, built once into the same dist for a negative
check, the block failed after 17.66 s with `a queued request got no response
while the lane was busy`; the repaired source was restored byte-identically
and rebuilt. Because a 200 no longer implies admission, the fixtures now wait
for a blocked command's invocation receipt before interrupting it; the
in-process resident appends that receipt and spawns the child in one
event-loop turn.

Write-backs: product 04 §Console parity contract v1 and the console README
state the queued-request behaviour and both refusals; the two publication
source locks were refreshed and `npm run publication:check` passes.
`npm run release -- prepare --local` reports target `v0.52.0` current and
refreshed only the process meter; skeleton `0.44.0` and console `0.3.0` are
unchanged from the implementation, with no new dependency.

Gate at the repaired subject: `npm test` recorded 26 suites passed and 1
failed, 71 fresh tasks, 317.62 s, exit 1, at 2026-09-26T03:08:32.208Z. The
console suite passed in 22.13 s and the skeleton suite in 314.87 s. The failed
suite is `worktree-integration` (2 passed, 7 failed), for the cause VER-001
recorded: its fixture clones the moving `main`, which is four commits ahead
and no longer carries `packages/skeleton/src/control-beacon-fs.mjs`, while this
branch's `scripts/lib/beacons.mjs` still imports it (canonical output
`docs/control/local/harness/check-output/cbd59cddb9a10f542d5b877c1f66d72c1aeda8b5715bceece90d37e103c9bca2.log`,
line 66). The repair touches neither that script nor that fixture, so the
verifier's isolated coherent-revision run was not repeated. Criterion 5 is
therefore not green at this subject; final-review integration with `main`
owns the mixed revision, and no console finding is hidden behind it.
`git diff --check` is clean and `npm run plan -- check` exits 0.

## Repair against VER-002 G1

Dispatch: `resume: fix`. Claude Code 2.1.283, `claude-opus-5-5`, effort
`xhigh` from the session's `CLAUDE_EFFORT` readback. No subagent was
spawned. D002's economy experiment stands; no second one was started.

VER-002 resolved F1 and failed only criterion 5: the `worktree-integration`
suite cloned the source's moving `main`, which WO-070 had moved four commits
ahead, and overlaid this branch's `scripts/lib`, whose `beacons.mjs` imports
`packages/skeleton/src/control-beacon-fs.mjs`, a leaf that `main` no longer
carries. The repair
([D015](decisions.md#wo-115-d015--repair-ver-002-g1-base-the-integration-fixture-on-the-sources-own-committed-revision))
points the fixture origin's `main` at the source's own committed `HEAD`, so
the working-tree overlays and the committed package leaves they import come
from one revision. No console source, acceptance text, `main` or earlier
report changed; routine integration with `main` stays with final review.

[Fixture transcript](worktree-integration.txt): in this session the unchanged
suite failed 7 of 9 in 21.24 s with VER-002's empty-stdout assertions, and the
repaired suite passed 9 of 9 in 83.58 s.

Gate at the repaired subject: `npm test` passed, 27 suites and 0 failed, 71
fresh tasks, 321.67 s, exit 0, recorded at 2026-09-26T03:37:49.801Z with code
identity `0e22ed0f73bcbb8355fac73b9b1a85ddd55b76dec056b781911c8b8fe9290d1a`
(host-gate receipt). The console suite passed in 23.35 s, `worktree-integration`
in 111.20 s and skeleton in 318.69 s. `git diff --check` is clean,
`npm run plan -- check` exits 0, and `npm run release -- prepare --local`
reports target `v0.52.0` current and refreshed only the PR draft's process
meter. Skeleton `0.44.0` and console `0.3.0` are unchanged from the
implementation, with no new dependency; the test script is not a versioned
component.

Limit: a subject that changes an uncommitted `packages/*/src` `.mjs` leaf
imported by `scripts/lib` would split the overlay from the committed `HEAD`
again. No WO-115 change touches such a leaf (D015's reopening condition).

## Repair after integrated FINAL-001

Dispatch: `resume: fix`, expanded by the operator to address the shared WO-114
watcher failure seen in parallel work orders. This Codex CLI 0.157.1 session
ran `gpt-6-sol` at raw effort `ultra` (recorded as xhigh with subagents) from
the session readback. Two read-only subagents inspected the parallel worktrees
and resident matrix; the root session remained the sole writer. D002's economy
experiment stands, and no second one was started.

FINAL-001's two complete integrated gates failed criterion 5 at different
unchanged deadlines: the first on the WO-114 atomic-replacement watcher and
the second on the WO-143 resident acquisition matrix. WO-085 independently
observed the same watcher timeout on byte-identical watcher source. The
operator requested one shared repair and challenged my removal of a measured
six-second test-fixture improvement. I restored that bounded fixture change;
the focused matrix passed all 344 boundaries before and after it, in 180.247
and 174.288 seconds. This is a single-run difference, not proof of the gate
failure's cause.

The repair adds a 250 ms status read fallback alongside filesystem events,
with duplicate suppression and interval cleanup. A new silent-notification
regression passes, and the focused status suite passes all seven cases. The
process-heavy skeleton suite now gets exclusive capacity in the complete gate;
its scheduler fixture passes all 41 cases. Every acquisition assertion and its
240-second deadline remain, as does the watcher's 2-second assertion.

At the repaired code identity
`5444501048f6ea4a2dc1df1c4dff94df8022b5bb9cbd7ff89febbf47236227dd`,
`npm test` passed all 28 suites, 0 failed, 72 fresh tasks in 444.801 seconds
(canonical gate at 2026-09-26T04:46:43.785Z). Skeleton ran alone and passed
in 295.465 seconds; console passed in 20.582 seconds while other shared suites
were active. The gate was 25.802 seconds longer than the prior failed retry,
so this receipt claims a complete passing gate, not a whole-gate speedup.
`git diff --check` is clean, the original minor `v0.52.0` release target
remains, and the repair adds no dependency. The exact historical notification
or scheduling cause is still unknown. [Repair diagnostics](repair-diagnostics.md)
and D019–D020 hold the observations and rejected alternatives. The combined
follow-up remains open until fresh independent verification; sibling worktrees
take the reviewed fix through their normal integration of main.

## Repair against VER-004 F1 and F2

Dispatch: `resume: fix`. Codex CLI 0.157.1, `gpt-6-astra`, effort `xhigh`,
source `codex-session-readback`. This session used no subagents and retained
D002 as the order's only economy experiment.

F1: the [controlled comparison](scheduling-comparison.json) ran the complete
product gate twice with only skeleton's isolation declaration changed. Both
passed all 28 suites and 72 fresh tasks. Shared scheduling took 312.441 seconds;
exclusive scheduling took 430.952 seconds. Snapshots of 3,473 repository paths
confirm the single-file difference and no changes to those inputs during either run. The repair
restores shared scheduling, with scheduler assertions for overlap, priority 80,
one reserved lane and deadline load factor 8. Product 07 now states the
comparison and the effects of both configurations, and its publication source
lock is current. One ordered pair cannot establish universal reliability or
the earlier failures' cause.

F2: `watchRuntimeStatus` now clears its poll on watcher error as well as close.
The new regression reproduced an extra callback on the previous source and
passes after the fix; it models Node's error path that emits no close event.
All eight status tests pass, including recovery when notifications are absent.
The watcher keeps its public FSWatcher return type. The crash-child reduction,
console contract and original deadlines and assertions are retained.

After the final scheduler-test adjustment, `node --test
scripts/test-runner.test.mjs` passed all 41 cases. The final complete `npm test`
passed 28 suites, 0 failed, 72 fresh tasks in **311.970 seconds**, recorded at
2026-09-26T14:14:46.764Z with code identity
`bce54ec869793926a7d7db37d759d0e838daebe965ad1729a85982ea7b5b7949`.
Skeleton passed in 309.013 seconds and console in 22.094 seconds alongside
other suites. The final measurement also observed no changes to snapshotted inputs during
the gate. Formatting, publication, planning and both staged and unstaged diff
checks pass. Local release preparation retains the minor `v0.52.0` target;
this repair adds no dependency.

[Diagnostics](repair-diagnostics.md#ver-004-controlled-scheduling-comparison)
and D022–D023 retain the evidence, alternatives and reopening conditions. The
three complete gates cost 1,055.363 seconds in total. Token observations are
dispatch-scoped `codex-transcript-counter` readings, including cached input;
final counters and their cutoff remain in ignored receipts and the handoff
response, and dollar cost is unknown. Entry total was 44,899 at the
2026-09-26T13:49:14.671Z cutoff. This is a measured gate tradeoff, not a claimed
token saving.

Both filed repair targets have implementation and executable evidence. The
existing follow-ups remain for the independent verifier's judgment; this
executor does not amend any earlier verification or final-review report.
