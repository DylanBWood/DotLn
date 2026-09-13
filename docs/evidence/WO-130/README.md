# WO-130 execution evidence

## Repair after VER-003 (2026-09-13, Claude Code session)

VER-003 closed VER-001 and VER-002 on the reproduced surfaces and failed on
one medium-severity finding in the D013 expansion, F1: a new session resuming
an already-recorded repair received neither the support list nor the
opening-intent instruction. The verifier reproduced it through the generated
hooks against the real lifecycle: the recording session's `resume: fix`
delivered five supports and the instruction; after its writer was released, a
new session's `resume: fix` was accepted in phase `repairing` with a receipt
naming only the command, order, role and phase, and a context without either
deliverable.

The repair, recorded in [WO-130-D015](decisions.md#wo-130-d015):

- The lifecycle gains the read-only command `npm run resume -- briefing`,
  which prints the recorded dispatch's briefing for the selected order's
  current phase from the same builders the transitions print: the execution
  briefing in `active`, the repair briefing in `repairing`, the allocated
  verification report in `verifying` and the allocated final-review report in
  `final-review`. It appends no event, creates no checkpoint, refreshes no
  projection, and the host classifies it as a metadata command on the tool
  path.
- When the phrase's dispatch is already recorded, the session hook obtains
  that projection and delivers it through the one delivery the recorded path
  uses, so the context carries the briefing and the intent instruction
  whenever Intent to Act is equipped, and the terminal receipt names the
  equipped supports; the lifecycle stays byte-identical and no reservation is
  taken. A lifecycle that exposes legal actions but cannot project the
  briefing refuses the resumed phrase naming the failure, as a failed
  recording already does.
- Skeleton 0.15.8 within the unchanged v0.17.5 target; the compiler is
  unchanged. The Contributor role text names the resumed delivery and the
  read-only command a resumed Codex session runs.

Focused evidence at the repaired bytes, run in this session:

| Check                                                                              | Result                                                                                         |
| ---------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| process-debt: the two WO-130 dispatch fixtures (lifecycle stub and real lifecycle) | 2 passed, 0 failed                                                                             |
| resume shell suite                                                                 | 8 passed, 0 failed                                                                             |
| harness suite, whole (writer, metadata-command and release fixtures)               | 23 passed, 0 failed                                                                            |
| skeleton feedback-host tests                                                       | 3 passed, 0 failed                                                                             |
| process-debt: WO-129 three-role lifecycle composition through the session hooks    | 1 passed, 0 failed                                                                             |
| VER-003's resumed-repair probe with its two missing-delivery assertions inverted   | five supports and the instruction on both sessions; lifecycle bytes unchanged; no reservation |
| `git diff --check`                                                                 | clean                                                                                          |

The stub fixture now asserts that the resumed `fix` delivers the briefing,
the instruction and the receipt naming Intent to Act with events and phase
unchanged, and that a stub exposing legal actions without a `briefing` command
is refused naming the failure. The real-lifecycle fixture drives the generated
hook files through verify, a synthetic failed verification and the repair: the
resumed verify receives its allocated report path, and a resumed `fix` after
the recording session released the worktree receives the byte-identical
briefing and support list while events, `current.md`, checkpoint refs, report
allocations and phase are unchanged and no reservation is taken. The
[transcript](fixture-transcript.txt) retains the TAP cases and the inverted
probe row. Bundle regeneration writes `.claude/hooks` and `.claude/skills`,
which this session's sandbox denies (`Operation not permitted` on the hooks
directory); the operator ran `npm run harness -- emit` outside the sandbox,
after which authority edition 004 was recorded and selected inside it. The
canonical `npm run harness -- evidence` gate then passed all 37 aggregate
suites and 78 tasks in 793.47 seconds, all fresh, at tree `3ab76ea9`. Its
first attempt stopped at the publication preflight because the
software-engineer edition's source lock still pinned the previous bytes of the
two 07 sections this repair updated; the lock was re-pinned to the current
bytes before the passing run. Per-session projected values still prevent
reuse across sessions ([WO-130-D009](decisions.md#wo-130-d009)).

## Repair after VER-002 (2026-09-13, Claude Code session)

VER-002 closed VER-001's findings and failed on one new blocking finding, F1:
the automatic prompt dispatch added under D011 ran the lifecycle command as
soon as the canonical status allowed it, without the writer-isolation boundary
and the active-gate refusal that reject the same ordinary tool command. The
verifier reproduced both bypasses through the generated hooks against the real
lifecycle: with another live session holding the worktree and with a live gate
marker, `resume: verify` appended `VerificationRequested`, checkpointed
and moved the phase while the equivalent `npm run resume -- verify` was
denied.

The repair, recorded in [WO-130-D012](decisions.md#wo-130-d012):

- The session hook models the dispatch as the Bash invocation it replaces and
  admits it exactly as the pre-tool hooks admit that command: the active-gate
  refusal judges the invocation first, then the writer-isolation boundary runs
  the lifecycle spawn as its guarded effect with the same compiled unit the
  writer hook carries. A refusal carries the pre-tool hook's reason, reserves
  nothing and changes no lifecycle byte; an admitted dispatch holds the
  reservation the session's first write would take.
- The host compiles that unit from the loadout inventory it ships with and
  refuses the dispatch when the inventory's compiled policy hash is not the
  one the emitted bundle's manifest records, so a drifted inventory cannot
  admit. A first attempt carried the policy in the session hook through a
  compiler patch; the compiled policy hash embeds the compiler version, so
  that bump made three recorded evidence editions stale, one of which needs a
  live verifier recording, and it was reverted
  ([WO-130-D014](decisions.md#wo-130-d014)). Skeleton 0.15.7 within the
  unchanged v0.17.5 target; the compiler is unchanged.
- `next` stays the metadata command it is on the tool path, so a closed
  order's `resume: next` on main keeps working; already-recorded, illegal and
  read-only phrases keep D011's behaviour.

An operator direction during the repair is recorded in
[WO-130-D013](decisions.md#wo-130-d013): the briefing that names the equipped
supports reaches only the model, so on every recorded or already-recorded
dispatch the session hook now also prints a one-line terminal receipt naming
the command, work order, role and equipped supports, and the delivered context
requires the reply to open with the `I intend to` line before any tool call.

Focused evidence at the repaired bytes, run in this session:

| Check                                                                           | Result           |
| ------------------------------------------------------------------------------- | ---------------- |
| process-debt: the two WO-130 dispatch fixtures and the other session-hook cases | 9 passed, 0 failed |
| harness suite: writer reservation, race and release fixtures                    | 16 passed, 0 failed |
| compiler package tests                                                          | 97 passed, 0 failed |
| feedback, verification and artifact-identity evidence checks at the final bytes | current             |
| VER-002's real-lifecycle probe with its assertions inverted                     | both guards refuse, no mutation |

The new process-debt fixture drives the generated hook files against the real
lifecycle: a live gate and a live foreign writer each refuse `resume: verify`
with a reason byte-identical to the pre-tool refusal of the equivalent
command, with events, `current.md`, checkpoint refs, report allocations and
phase unchanged and no reservation taken; the uncontended dispatch records
`VerificationRequested` once, checkpoints once and leaves the session holding
the writer; `resume: next` is admitted under both guards without reserving;
and the host's dispatch policy deep-equals the writer hook's policy while a
manifest recording another policy hash makes the host refuse. The
[transcript](fixture-transcript.txt) retains the TAP cases and the inverted
probe rows. Bundle regeneration writes `.claude/hooks` and `.claude/skills`,
which this session's sandbox denies; the operator ran `npm run harness -- emit`
outside the sandbox once per host edition. The canonical
`npm run harness -- evidence` gate then ran inside the sandbox at the repaired
bytes and passed all 37 aggregate suites and 78 tasks in 780.37 seconds, all
fresh, at tree `7b6d6248`; its first attempt, at the reverted compiler-route
bytes, stopped at the evidence preflights after 25 seconds
([WO-130-D014](decisions.md#wo-130-d014)). Per-session projected values still
prevent reuse across sessions ([WO-130-D009](decisions.md#wo-130-d009)).

## Repair after VER-001 (2026-09-13, Claude Code session)

VER-001 failed criterion 7 on one cause. In a Claude Code session on the
operator's host the shell exports a harness-injected Git configuration family:
`GIT_CONFIG_COUNT=4` with four `safe.directory` entries naming the two
checkouts, and `GIT_CONFIG_PARAMETERS` carrying an HTTP proxy authentication
method. The replica projection refused to narrow on that family, and a refusal
left every declared suite without any key, so nothing was reused or cached,
fourteen fixture cases collapsed on null-against-null comparisons, and the
process-debt composition case observed `fresh` where it requires `composed`.
F2 named a fixture that ran Git in the real worktree when replica creation
refused.

The repair, recorded in [WO-130-D007](decisions.md#wo-130-d007):

- The reviewed environment projection drops `GIT_CONFIG_COUNT`,
  `GIT_CONFIG_KEY_*`, `GIT_CONFIG_VALUE_*` and `GIT_CONFIG_PARAMETERS` from
  execution and from the key alike. A harness session's configuration of its
  own checkouts and transports is invocation metadata, not a suite input; the
  same rule already removes rotating proxy variables, and it closes VER-001 O2.
- A refused narrowing is keyed instead of unkeyed. The task runs in the
  candidate tree under the whole-tree contract that these scopes had before
  this order (every non-document candidate file plus the declared documents),
  the fresh explanation and the recorded task row name the refusal, and the
  declaration digest names the execution root, so a candidate-tree success can
  never be reused by a replica run or the reverse. This answers VER-001 O1.
- Replica children carry `GIT_CEILING_DIRECTORIES` at the replica's
  unlistable parent, so a `git: none` replica discovers no repository above
  itself even when the scratch root sits inside one (VER-001 O4). The replica
  mechanism version is now 2, which invalidates every earlier replica key.
- Every fixture asserts replica creation, naming the refusal, before using a
  replica (F2), and asserts a non-null baseline before comparing keys, so a
  refusal fails by name instead of by coincidence. The installed-copy change
  detector that VER-001 O5 called unreachable is now exercised.

Measured in this session, with the injected Git configuration present and
nothing removed from the environment, `npm run test:full -- --fresh` passed
all 37 aggregate suites and all 78 tasks in 798.414 seconds. All 47 narrowed
tasks executed in replicas with zero narrowing refusals; the other 31 ran in
the candidate tree.

| Scope                    | Fresh execution (seconds) | Replica setup (milliseconds) | Outcome       |
| ------------------------ | ------------------------: | ---------------------------: | ------------- |
| kernel                   |                     0.635 |                       28.394 | pass, replica |
| compiler                 |                     0.868 |                       31.824 | pass, replica |
| skeleton                 |                   198.386 |                      634.868 | pass, replica |
| worktree                 |                   292.198 |                      710.245 | pass, replica |
| plan-refutation:fixtures |                   534.742 |                      622.968 | pass, replica |
| process-debt             |                   268.003 |                      418.175 | pass, replica |
| release:prepare          |                     2.333 |                      489.370 | pass, replica |

The single verified read-only installed copy again held 1,099 regular files
and 50,685,411 bytes and took 240.348 milliseconds; per-replica setup totalled
22,665.920 milliseconds across the 47 replicas. The controlled source change
then added only `scripts/wo130-reuse-probe.mjs`, the same comment-only file
as the initial measurement, outside all three package declarations. `npm test`
passed all 12 suites in 51.917 seconds with 9 fresh and 3 reused tasks:
kernel, compiler and skeleton reused the fresh gate's executions at unchanged
keys, with no replica and no installed copy, avoiding 199.889 seconds of
measured package execution. Removing only the probe returned the tree hash to
the fresh measurement's `5f536a49…`. The [measurement rows](replica-measurements.json)
record every task, the replica scopes and the projected environment names.

The focused fixtures at the final source bytes, the eleven WO-130 cases plus
the WO-129 Git case that VER-001 listed among the collapsed ones, all passed;
the [transcript](fixture-transcript.txt) retains the outer TAP cases, the
refused-narrowing explanation and the expected negative diagnostics.

Two operator decisions during this repair are recorded beside it. The format
gate now covers code only: Markdown, JSON and event logs keep their authored
bytes ([WO-130-D008](decisions.md#wo-130-d008)). The operator's mission test
for process checks was applied to the remaining non-code gate tasks and to the
self read-back obligation from the recorded evidence, with the verdicts and
follow-ups in [WO-130-D009](decisions.md#wo-130-d009).

Two lifecycle corrections landed after that measurement. The repair session
began without recording its own `fix` dispatch, which left the lifecycle in
`needs-fix`, kept the harness briefing that carries Intent to Act from
printing, and cost a second composed canonical gate once the dispatch was
recorded ([WO-130-D010](decisions.md#wo-130-d010)). At the operator's
direction the generated Claude session hook now records the dispatch itself
from the `resume:` phrase, delivers the command's briefing, passes an
already-recorded dispatch and refuses an illegal one, proven by a
process-debt fixture against a lifecycle stub with legal actions
([WO-130-D011](decisions.md#wo-130-d011)); skeleton is 0.15.6 and the
regenerated bundle is a new immutable authority edition.

What this repair does not change: this gate ran 78 fresh tasks although the
previous session's successes existed at identical declared bytes, because the
projected environment still carries per-session values. No role reuses another
role's heavy replica work; that limit and its proposed remedy are in D009.

The full and fast gates have different inventories; their durations are not a
speedup ratio, and summed package durations are not elapsed time saved under
parallel scheduling. These measurements were collected by the runner under
review and require the independent verification and final-review roles. The
accepted unprojected absolute-path and same-user residual remains.

## Initial implementation (2026-09-13, Codex session)

On 2026-09-13, `npm run test:full -- --fresh` passed all 37 aggregate suites
and all 78 tasks in 805.284 seconds on the operator's host. Every required
narrowed scope executed in a replica, including release-template preparation
and all 40 release cases. No migrated scope was retained whole-tree.

| Scope                    | Fresh execution (seconds) | Replica setup (milliseconds) | Outcome       |
| ------------------------ | ------------------------: | ---------------------------: | ------------- |
| kernel                   |                     0.621 |                       31.324 | pass, replica |
| compiler                 |                     0.768 |                       32.983 | pass, replica |
| skeleton                 |                   209.022 |                      741.804 | pass, replica |
| worktree                 |                   295.787 |                      601.294 | pass, replica |
| plan-refutation:fixtures |                   559.142 |                      683.057 | pass, replica |
| process-debt             |                   276.395 |                      419.295 | pass, replica |
| release:prepare          |                     2.361 |                      521.501 | pass, replica |

The gate created 47 replicas. Its single verified read-only installed copy
contained 1,099 regular files and 50,685,411 bytes; copying and verification
took 242.173 milliseconds. Per-replica setup totalled 24,402.857 milliseconds,
excluding that shared copy. The controlled source change added only
`scripts/wo130-reuse-probe.mjs`; `npm test` then passed all 12 suites in
48.063 seconds with nine tasks executed and kernel, compiler and skeleton
reused, avoiding 210.411 seconds of measured package work. Those rows were
superseded in the measurement file by the repair measurement above; the
initial values are retained here and in the decision record.

All nine focused WO-130 fixtures passed in 23.351 seconds at that revision.
The local release target is v0.17.5, with skeleton patched from 0.15.4 to
0.15.5 for installed gate-input protection and its generated harness pins.
Other component versions and exported runtime contracts are unchanged; no
dependency was added. Publication remains with the separate review and
release-close dispatches. Sources, corrected failed attempts and reopening
conditions are in [the decision record](decisions.md). Final handoff requires
the canonical `npm run harness -- evidence` gate at the authored subject.
