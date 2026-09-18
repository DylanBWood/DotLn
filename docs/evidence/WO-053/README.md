# WO-053 — First live external source change

Recorded 2026-09-17. Both installed harnesses changed only `sum.mjs` in
separate worktrees of one synthetic repository outside DotLn. The host ran the
addition test red before each successful episode and green after it, observed one commit
above the base, and checked that the selected DotLn checkout, target main
checkout and sibling sentinel were unchanged. A separate Codex episode was
killed after its worker committed and exited; recovery observed the same
commit without dispatching a second worker.

These are executor observations awaiting the order's separate verification
and final review. [Decisions](decisions.md) record the operator's bounded
override to repair the failures encountered in this proof. No dependency was
added, no operator repository was used, and no remote effect was authorized.

## Successful episodes

All facts below are observed in the linked receipts except the explicitly
named launch claims. The host's test exit codes were `1 → 0`, with no signal;
each changed-path list is exactly `["sum.mjs"]`. Commit identity agrees across
the host observation, an independent target-branch read and the returned
envelope. Each receipt's before/after protected snapshots are equal.

| Receipt | Launch claims (effective readback unknown) | Commit | Parent handoff growth | Host-process duration |
| --- | --- | --- | ---: | ---: |
| [Claude clean](claude-schema.json) | Claude Code 2.1.274; claude-fable-5; xhigh | `93b656dba6e16f2d24ff5db85923d087afc3cf7f` | 532 bytes | 38,223 ms |
| [Codex clean](codex-runtime.json) | Codex CLI 0.154.0; gpt-6-astra; xhigh | `fa6bac6e4dcb822f1461504a4b7bf92f638f20ea` | 490 bytes | 45,433 ms |
| [Codex killed-host recovery](codex-recovery.json) | Codex CLI 0.154.0; gpt-6-astra; xhigh | `ce52c3eef72fa315ddadad3739e1c5e19cfba3ed` | 523 bytes | 47,202 ms before kill; 2,515 ms recovery |

The recovery kill marker was recorded before `SourceChangeObserved` or a
canonical source-change receipt existed. The first host exited by `SIGKILL`;
after the real lease expired, the second host exited zero. The store records
one `WorkerAttemptStarted`, and the branch has one commit above the base.
The recovery fixture refuses any transport redispatch. This tests host failure
after worker exit; it does not establish fencing of a still-running orphan.

The measured parent is the collector process receiving its child's stdout.
Its append-only transcript starts at zero and contains exactly one serialized
six-field envelope plus host `observedCommit` and `observedDenials`, including
the newline. It receives no raw vendor transcript. Growth of the complete
orchestrating Codex conversation is explicitly `unknown` in every receipt.

Claude reported 58,671 total tokens and USD 0.324308 for its successful clean
episode. Codex reported 103,306 for its clean episode and 117,440 for recovery's
single worker episode; Codex cost is unknown. These are transport-reported
episode counters, not total execution-task cost. Durations above exclude
fixture preparation and, for recovery, lease waiting. Failed attempts add cost;
this record makes no efficiency improvement claim.

## Preserved failures and repairs

Receipts are immutable and failures were retained under distinct names.
`recoveryPass: true` on a clean episode means recovery was not requested;
the separate `requested` field distinguishes it from the kill proof.

| Receipt | Observed result and disposition |
| --- | --- |
| [claude-clean](claude-clean.json) | Writer result rejected as invalid JSON; no envelope. The original collector did not independently inspect Git on this failure, so its commit count is unknown. |
| [codex-clean](codex-clean.json) | Blocked envelope: strict test/add/commit-only instructions prevented the shell inspection required by this harness. |
| [claude-diagnostic](claude-diagnostic.json) | 93 valid wire events and a successful terminal, but terminal display text was not JSON. Independent Git read found one `sum.mjs` commit; the episode still failed. |
| [claude-fixed](claude-fixed.json) | Native schema requested in stream mode, but no structured envelope returned; one source commit, failed host result. |
| [codex-fixed](codex-fixed.json) | Inspection proceeded, but bare `node` was unavailable in the worker environment. The blocked envelope records exit 127; no commit. |
| [claude-json](claude-json.json) | Aggregate JSON mode still lacked `structured_output`; the target guard treated Claude's schema-submission tool as unknown. A source commit alone did not pass the episode. |

The existing writer now explicitly authorizes bounded inspection instructions
while retaining its exact effectful test/add/commit commands. The Codex
instruction is a prompt-level authorization, not an added shell classifier or
proof of filesystem confinement. Claude uses aggregate JSON with its native
schema and the decoder requires `structured_output`; the emitted guard
recognizes the data-only `StructuredOutput` tool. Unknown tools still refuse.
The fixture supplies the current Node executable as its exact focused-test
command, avoiding reliance on the worker's `PATH`; public receipts reduce the
machine-specific executable to `<node-executable>`.

The inspected Claude target journal contained two refused `StructuredOutput`
calls before the guard correction. That is a local diagnostic observation;
the public `claude-json` receipt preserves only wire structure, not tool
arguments or raw logs. The final emitted-hook regression exercises the
submission and unknown-tool refusal, and `claude-schema.json` records the
successful schema result with zero reported denials.

## Fixture and receipt contract

[fixture.mjs](fixture.mjs) creates one wrong addition module, one assertion
test and a README contract in a new synthetic Git repository. It compiles
[worker-loadout.json](worker-loadout.json) through the existing compiler and
passes the WorkOrder to the existing `SourceChangeHost` API. There is no new
runtime CLI. Authority comes from the explicit base; supports and additional
grants are empty. Remote, credential, settings and sandbox effects remain
denied. The target bundle is emitted by the host before worker dispatch.

The loadout source is filed for final-review publication rather than committed
early. Each receipt records the exact loadout-byte hash and compiled identity.
The initial failed attempts resolve to [worker-loadout-initial.json](worker-loadout-initial.json),
the intermediate inspection attempts to [worker-loadout-inspection.json](worker-loadout-inspection.json),
and `claude-json` plus all successful attempts to the current loadout. No
historical source or receipt was overwritten to make the later run appear clean.

Protected snapshots include HEAD, committed tree, tracked and nonignored
working-file bytes/modes/symlink targets, status, and (in the later receipts)
index bytes represented by its staged-entry digest. The sibling sentinel has
its own tree digest. Ignored runtime stores are intentionally outside these
checkout snapshots. Host tests and independent Git inspection establish the
bounded observed effect; they do not prove no other filesystem access occurred.

[receipt.mjs](receipt.mjs) pins schema version 1, epistemic labels, closed
top-level fields and required nested facts, plus successful-run invariants and
a private-path/credential screen. The [regression fixture](../../../packages/skeleton/test/source-change-receipt.test.ts)
loads every attempt, requires clean successes for both harnesses and a
successful requested recovery, and rejects fabricated pass evidence, mismatched
commit/branch identity, invalid test outcomes, extra fields and private paths.
Unknown facts retain a reason and null value; launch identity is never promoted
to effective readback.

To reproduce on an authorized unrestricted host with both CLIs installed and
authenticated, build first. `prepare` is for a new local fixture; it refuses
to replace an existing location record. Reuse the existing target via `add`
when local state already exists. Choose fresh episode names on every attempt:

```sh
npm run build
node docs/evidence/WO-053/fixture.mjs prepare
node docs/evidence/WO-053/fixture.mjs add claude-repeat claude clean
DOTLN_LIVE_WORKERS=1 node docs/evidence/WO-053/fixture.mjs run claude-repeat
node docs/evidence/WO-053/fixture.mjs add codex-repeat codex clean
DOTLN_LIVE_WORKERS=1 node docs/evidence/WO-053/fixture.mjs run codex-repeat
node docs/evidence/WO-053/fixture.mjs add codex-repeat-recovery codex kill
DOTLN_LIVE_WORKERS=1 node docs/evidence/WO-053/fixture.mjs run codex-repeat-recovery
```

The fixture retains physical paths and private stores only in local ignored
state. It preserves scratch worktrees and commits for inspection. A rerun
requires a still-valid loadout expiry; renew an expired source as a new dated
input edition rather than changing the bytes behind an old receipt.

## Acceptance and write-backs

| Criterion | Evidence |
| --- | --- |
| 1: each harness smoke; host red/green, isolated one-file commit, envelope-only handoff | Claude and Codex clean receipts above; explicit handoff boundary and unknown whole-session growth |
| 2: killed-host identity recovery, exactly one commit | `codex-recovery.json` and the refusing recovery transport wrapper |
| 3: observed / launch-claim / unknown | Every receipt fact group; effective launch readback stays unknown |
| 4: comparable versioned JSON | `receipt.mjs` and `source-change-receipt.test.ts` |
| 5: product write-backs | Root README; roadmap source-to-deliverable opening; capability table's live-evidenced level 1; R2 disposition awaiting WO-111; decisions/index substitution for the pre-2026-09-09 ledger duty |
| 6: runtime repairs and checks | The bounded operator override in the order and D002/D003; final executable results are recorded in `implementation.md` |

Independent verification, remote publication, an operator repository and the
rest of the source-to-deliverable vertical remain separate capabilities. This
proof makes the first external source-change claim concrete.
