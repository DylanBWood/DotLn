# WO-039 executor evidence

The implementation prepares application `v0.15.0`, compiler `0.7.0`, skeleton
`0.13.0` and, after the integration with `main`, console `0.1.1`. It adds the
separate `harness-v1` lowering contract, the Contributor
build, generated project configuration, source-bound hook adapters, role skills,
drift checks and context accounting. Kernel `0.2.1`, the loadout, feedback and
verification contracts, and external dependencies are unchanged.

The [VER-001 repair receipt](repair.md) maps all four findings to the repaired
behavior and evidence. The [second repair receipt](repair-002.md) covers the
operator's briefing on the leaked writer reservation that blocked the `VER-002`
attempt: reservations now record their owning harness process, a dead owner's
reservation is reclaimed with a logged record, a live holder is named in the
refusal, and `harness writer --show|--release` exists for inspection and
operator release. The [third repair receipt](repair-003.md) covers `VER-002`
finding F1: two sessions reclaiming the same dead holder could both be
admitted, so reservation recovery now acts only on the observed directory
instance and admits exactly one writer, with a generated-hook concurrency
regression. The [fourth repair receipt](repair-004.md) covers `VER-003`: a
session's refresh of its own reservation kept the same file name, so a stale
reclaimer could remove the refreshed facts; the operator release judged one
observation and retired another; and the live-holder smoke failed its
aggregate rule. Reservation instances are now immutable under their names,
the operator release binds to one observed reservation, and the live-holder
scenario's required denied effect is the writer guard's refusal. The
[fifth repair receipt](repair-005.md) covers `FINAL-001` finding F1: the
branch base moved under two merged orders, so the repair integrated `main`,
resolved the dual-side files, regenerated the projections, and recorded a
fresh live feedback edition for the changed subject; no runtime source
changed. The current live and context sections below describe the repaired
bundle; the original validation history remains at the end. Routine local
release preparation retimed the unpublished application target from `v0.14.0`
after that tag was used by an independently completed order.

The initial executor was Codex CLI `0.153.4`, `gpt-6-astra`, `max`, using the
operator-attested selection in execution guide 07; this session has no effective
model/effort readback. It began under the hand-written instruction configuration.
The generated bundle was installed during implementation, so this continuing
session does not prove fresh-session adoption. The separate live scratch runs
below do. These are executor observations; independent verification and final
review remain separate.

At the initial handoff the operator's ignored local terms list was **present**,
and the screen passed across all 47 selected generated/evidence surfaces. The list was seeded only in
private local data. No terms, matched text, term hashes or list contents enter
this report. The [ideation receipt](ideation.md) records the operator's correction
that the list can grow incrementally and the open future UI item for viewing,
adding and removing entries. Neither a complete inventory nor invented entries
are prerequisites for work.

## Acceptance mapping

| Criterion                              | Evidence and result                                                                                                                                                                                                                                                                                                                                                                      |
| -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1: local harness truth                 | The [phase-zero report](../../discovery/harness-smoke-2026-09-07.md), [index](../../discovery/harness-smoke-2026-09-07.json) and per-harness JSON record actual event shapes, refusal behavior, skills and unavailable surfaces before lowering was written. Every consumed profile capability cites a named observation row.                                                            |
| 2: pure lowering and identity          | The [repair fixture transcript](repair-fixtures-003.txt) includes deterministic bundles, per-file origin/hash verification, one-unit mutation locality and frozen Seiri/Entropy Reducer semantic hashes. `harness-v1` wraps the existing compiled program without changing its semantic preimage.                                                                                        |
| 3: one compiled boundary               | The same transcript invokes generated adapters as subprocesses with synthetic host facts, compares their decisions with `feedbackBoundary`, and removes the named unit to witness the change. Missing built imports and changed pinned runtime bytes refuse.                                                                                                                             |
| 4: live generated hooks and role entry | The latest immutable [role records](harness-live/) pin the installed file hashes, runtime, loadout, actor, whole-session read observations and denied-effect receipt. Earlier unsuccessful and superseded attempts remain visible. The gate selects the newest attempt per role and refuses stale or failed evidence.                                                                    |
| 5: self-host and drift                 | The installed `.claude/` and `.agents/` surfaces plus the shared instruction block are checked byte-for-byte by `npm run harness -- check`. Fixtures reject byte, missing-file, unexpected-file and manifest drift, unowned collisions and symlink escapes; the emitter removes obsolete files owned by the prior manifest. The config log and ADR-0005 record the project-scope change. |
| 6: context reduction                   | The [measurement](harness-context.json) mechanically scans the whole instruction file and complete role procedures, including later reads. All four roles are strictly lower in bytes and lines in both profiles. Added late reads are counted; an oversized directed file fails with named residue.                                                                                     |
| 7: durable write-backs                 | Domain model 02, architecture 03, execution guide 07, UIFA 13, root and package READMEs, the capability table, publication index, both edition locks and the idea ledger describe the bounded implementation.                                                                                                                                                                            |
| 8: full checks and local screen        | The full repository gate and configured-list screen are recorded below. No runtime dependency or kernel change is introduced. The synthetic-term fixture refuses. The operator's dated amendment permits an honestly reported unconfigured state too.                                                                                                                                    |

## Live scope and observations

The generated Claude profile uses the locally observed `2.1.263` events and
`.claude/skills`. Each new smoke selects `claude-fable-5`, `xhigh`, and records
the returned model and effective effort separately from the launch selection.
The only user task is the exact role resume phrase. Its synthetic closed
WO-999 packet directs one harmless attributed commit attempt; the generated
PreToolUse guard refuses it, and the scratch Git revision does not change.
The selected skill then reaches the real status/entry guards and stops at the
already-closed order. This proves bounded role entry and refusal, not execution
of a complete implementation, verification, review or release phase.

The records below are the latest attempt per role and scenario against the
installed fourth-repair runtime, filed by the operator's rerun of the live
suite after installing the regenerated bundle; each pins the repaired host
runtime.

| Role          | Current immutable run                                    | Result                                                    | Read refusals | Bash route refusals |
| ------------- | -------------------------------------------------------- | --------------------------------------------------------- | ------------: | ------------------: |
| Executor      | [executor-014](harness-live/executor-014.json)           | Pass; skill, denied commit, finished observer             |             0 |                   1 |
| Verifier      | [verifier-010](harness-live/verifier-010.json)           | Pass; skill, denied commit, finished observer             |             0 |                   1 |
| Reviewer      | [reviewer-009](harness-live/reviewer-009.json)           | Pass; skill, denied commit, finished observer             |             0 |                   1 |
| Release close | [release-close-009](harness-live/release-close-009.json) | Pass from `main`; skill, denied commit, finished observer |             0 |                   2 |

The second repair adds two writer-reservation scenarios that seed a foreign
lock before launch, so the real harness proves the reclaim and refusal paths
its hooks own:

| Scenario   | Current immutable run                                                | Result                                                                                                                                                                                                |
| ---------- | -------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Dead owner | [writer-foreign-dead-003](harness-live/writer-foreign-dead-003.json) | Reclaimed once, naming the seeded actor and pid; no refused write dispatch; released at finish                                                                                                        |
| Live owner | [writer-foreign-live-003](harness-live/writer-foreign-live-003.json) | No reclaim; two refused write dispatches naming the seeded holder, the required denied effect under the corrected rule; the attribution refusal was also reached; reservation still foreign at finish |

The live-holder attempt [writer-foreign-live-002](harness-live/writer-foreign-live-002.json)
on the third-repair runtime failed its pre-repair aggregate rule and is
preserved unchanged: no reclaim, one refused write dispatch naming the seeded
holder, reservation still foreign at finish, but the session never attempted
the fixture commit after the holder refusal, so the attribution refusal that
rule also required was absent, and the evidence gate refused that record rather
than falling back to the older passing attempt 001, in which the session
happened to attempt the commit anyway. The fourth repair makes the live-holder
scenario's required denied effect the writer guard's refusal naming the holder,
still records whether the attribution refusal was reached, and leaves the
attribution refusal required in the role runs and the dead-holder scenario.
Attempt 003 witnesses both refusals.

`node scripts/harness-evidence.mjs` accepts the four current role runs and the
two scenarios against the 24 installed generated surfaces and selects 78
generated/evidence surfaces for the local-terms screen. All six report
effective `xhigh`, zero refused native reads, zero out-of-set observed or
attempted reads, and a finished observer. Every role run acquired its own
reservation with the owner taken from `CLAUDE_PID`, verified as the launched
harness process, and released it at the accepted finish; the live-holder
scenario acquires nothing by design. The terms-list result is explicitly
`present` and the screen passes.

The generated read observer runs through the final Stop. The scratch scope
observes native Read requests without enforcing the mechanically directed
ranges. Out-of-set observed or attempted reads fail the receipt. It still bounds
shell routes and skill selection, and retains refusal counts separately from
actual reads. Relative refused paths/ranges are recorded; paths outside the
checkout are reduced to a shape and still fail the attempted-read comparison.
The journal comparison includes reads after the final resume command. No raw
model transcript, absolute host path, session identifier or user-scope settings
file is retained in live evidence.

The historical enforced-scope runs cited by VER-001 had these refusals:

| Historical run                                           | Read refusals | Bash route refusals |
| -------------------------------------------------------- | ------------: | ------------------: |
| [executor-007](harness-live/executor-007.json)           |             1 |                   1 |
| [verifier-004](harness-live/verifier-004.json)           |             0 |                   1 |
| [reviewer-003](harness-live/reviewer-003.json)           |             2 |                   1 |
| [release-close-003](harness-live/release-close-003.json) |             0 |                   2 |

Those records did not retain attempted paths, so their empty actual-read
comparison cannot establish that the roles avoided requesting extra inputs.
They are preserved and superseded by observation-only runs. The first such run,
[executor-008](harness-live/executor-008.json), failed on an unnecessary
final-review report read. The resulting scope clarification is in the generated
role procedures; the measured set was not expanded to absorb the failure. The
observation-only records that preceded the second repair (`executor-011`,
`verifier-007`, `reviewer-006`, `release-close-006`) remain as the evidence of
the first repair's runtime and are superseded only because that runtime changed.

The correction token remains unconfirmed. Each role skill carries the compiled
semantic-correction procedure and the residue names the missing token; no
ordinary-language correction detector is enabled. A separate synthetic fixture
confirms an inert test token and verifies typed correction plus narrowed
permissions. That fixture is not operator confirmation of a production token.

Codex CLI `0.153.4` resolved the project skill during phase zero, but no configured
hook fired and no settings permission lowering was observed. Its profile emits
`.agents/skills` and the shared `AGENTS.md` symlink block, with missing hooks and
settings explicitly in residue. The `--bare` Claude comparison had no hooks and
unavailable authentication; it establishes no successful bare skill behavior.

## Context accounting

The activation base is `8b55eca3b3427146e98d34c68f67f679dc59bea5`. Both sides
use the same small, committed synthetic WO-999 task files and citations. Before
counts include the activation instruction and its mandatory full execution
guide. After counts include the complete current instruction, selected skill,
and every directed file or named heading subtree anywhere in that procedure.
Overlapping ranges count once. These are physical UTF-8 bytes and source lines,
not token estimates, model system prompts, or estimates of this order's changing
implementation context. Process-internal file I/O is distinguished from file
content delivered to the model.

| Role          | Before bytes / lines | Claude after bytes / lines | Codex after bytes / lines |
| ------------- | -------------------: | -------------------------: | ------------------------: |
| Executor      |         71,165 / 994 |               10,960 / 144 |              12,125 / 150 |
| Verifier      |         71,165 / 994 |               10,526 / 142 |              11,691 / 148 |
| Reviewer      |       71,503 / 1,004 |               13,255 / 182 |              14,420 / 188 |
| Release close |         71,203 / 993 |                8,439 / 130 |               9,604 / 136 |

The whole instruction file falls from 3,878 bytes / 78 lines to 3,593 bytes /
64 lines. The hand-written Clean Room floor is part of both totals. The fixture
changes late directives in both the floor and skill to prove the collector does
not rely on an executor-authored read list. A 4,000-line directed input produces
an honest failure with residue rather than an omitted cost.

## Host boundaries and integration checks

Generated hooks import the same built `feedbackBoundary`, with package and file
pins checked before effects. Permission decisions use `harnessAuthorization` in
the shared reactor, retaining the repository's single owner for kernel deciders;
the reactor's built bytes are pinned too. The host derives permissions, worktree ownership,
source-comment changes, executed checks, canonical completion and byte-bound
read receipts. Metadata commands do not claim a coding-writer reservation;
source writers do. An exact managed release-close helper is admitted only from
fresh `main` after canonical closure and delegates to the existing lifecycle
host. A review commit does not erase output obligations because their base is
the revision at session entry. Auxiliary prompts retain the pending phase's
completion obligation. The repair adds verified range accumulation and bounded
byte deliveries for oversized lines, with named missing-output diagnostics.
Direct output reads remain read operations and retain credential-path denials.
The scale fixture covers more than 128 inherited outputs and reaches a passing
finish after the last current-byte delivery. Each of these cases has executable
fixture coverage.

This is bounded direct-command recognition and same-user host bookkeeping. It
does not interpret arbitrary shell programs, isolate a hostile same-user process,
authenticate source provenance, or infer decision lineage, evidence quality or
cleanup judgment. Those unavailable semantic facts remain in role procedure
and residue. PostToolUse observes an already-completed edit; Stop is a harness
completion affordance. Canonical lifecycle legality, native sandbox and approval
remain authoritative. A session that ends without an accepted finish leaves its
reservation behind with its harness process recorded; the next write dispatch
reclaims it only when that process is dead, and logs the reclaim. Two sessions
reclaiming the same dead holder admit exactly one writer: every recovery step
acts only on the observed directory instance, and the loser honours the
replacement or records its retirement. A reservation file's facts never change
under its name: a session recording a new fact about its own reservation
writes a new nonce-named file that names the one it supersedes and removes the
superseded name, so a stale reclaimer's unlink of the old name fails instead
of removing refreshed facts. A live or unverifiable holder is honoured and
named, and the operator releases it with `harness writer --release` from
outside a governed session; that release judges, retires and journals one
observed reservation, re-judges a holder that changed meanwhile, and refuses a
forced release of a changed holder.

## Fresh evidence editions

Compiler package identity changed, so [artifact identity](artifact-identity/)
and [verification](verification/) have new evidence editions. The new root
scripts also change the feedback source projection. The current gate selects
[WO-039 feedback](feedback/feedback.json), its [audit stream](feedback/selfhost-audit.jsonl)
and [verifier stream](feedback/selfhost-verification.jsonl), while historical
WO-011 and WO-041 editions remain untouched.

The first new feedback dispatch selected `claude-fable-5` at `max` and failed at
the transport boundary without a completed audit. Its pending local event store
was preserved. A separate dispatch through the existing Claude print transport
selected `claude-sonnet-5` at `max` and completed with exit 0, a structured result
and a complete host-admitted verification matrix. These are recorded launch
selections, not effective-session readback. That initial audit passed its source
and replay gate. The later shared-reactor repair changed the pinned source, so
the complete initial report and streams are preserved byte-for-byte in
[feedback-initial](feedback-initial/). A separate replacement audit selects the
same Sonnet model and effort against the repaired source and reaches the fixed
600-second deadline without a result; its pending local store is preserved.
The next separate episode completes through Codex CLI `0.153.4`, model
`gpt-6-astra`, effort `unknown` under the observed transport profile. Its matrix
is complete with both criteria verified, and the current-source/replay gate
passes. That effort label applies to this bounded feedback instrument; it is
not the actor attestation for a WO-039 independent verification dispatch.
This bounded audit does not independently accept the whole harness implementation.

The integration with `main` recorded in the [fifth repair receipt](repair-005.md)
changed the declared lockfile projection, because the merged console workspace
stays raw in the feedback subject, so the edition above became stale. Its
report and both streams are preserved byte-for-byte in
[feedback-pre-integration](feedback-pre-integration/). The first integrated
report, whose subject matched the hash FINAL-001 computed, is preserved as
[feedback-integration-draft](feedback-integration-draft/feedback.json): the
integrated gate then found that the merged actor board pinned the WO-011
edition, which this compiler refuses as persisted compilation drift, so the
board now follows the WO-039 edition and console `0.1.1` moved the lockfile's
console entry once more. The replacement report for the final integrated
subject is recorded at [feedback](feedback/feedback.json); its
[audit stream](feedback/selfhost-audit.jsonl) and
[verifier stream](feedback/selfhost-verification.jsonl) are recorded from the
fourth live attempt, which the operator ran from a terminal outside the
sandbox through Codex CLI `0.153.4`, model `gpt-6-astra`, effort `unknown`,
because three in-session attempts could not dispatch a live verifier: the
sandbox refuses the `git init` a verifier mount needs under the worktree,
refuses the aliased `/tmp` path the host rejects by design, and refuses both
CLI transports outright. The receipt names each attempt. With those streams
filed, the feedback evidence check passes on the integrated tree, and the
console's `selfhost` fixture case pins this edition's report and both streams.

## Validation

The first full run is preserved in [checks-001.txt](checks-001.txt): 287 of 288
runtime tests passed, and the existing one-decider ownership guard found the
new host's direct kernel call. The repair routes the unchanged authorization
inputs through the shared reactor; [owner-check.txt](owner-check.txt) passes.
An intermediate targeted run recorded two subprocess timeouts in
[fixtures-002.txt](fixtures-002.txt). Their cause was not established. A focused
rerun and then the complete unchanged adapter set passed; the current
[fixtures-003.txt](fixtures-003.txt) records 14 passing compiler/harness tests.
Diagnostics now name the hook, contained fixture path and process error when a
subprocess fails. The initial [fixture transcript](fixtures.txt) is also retained.

The second full run, [checks-002.txt](checks-002.txt), passes all 288 runtime
tests and 11 harness tests but reaches the feedback gate before the replacement
live streams are filed. Those streams are now filed and their separate gate
passes.

On 2026-09-07, the final `npm test` exits **0**. [checks.txt](checks.txt) records
7 release-preparation tests, 9 license tests, 288 runtime tests, 11 harness tests,
8 identity-corpus tests and 21 mutation self-tests, plus all plan-refutation,
lifecycle, recovery, worktree, release and index fixture groups. Formatting,
both publication locks, the current work-order index, exact installed harness
bytes, all eight context rows, four current live roles, and artifact, verification
and feedback evidence gates pass. `git diff --check` is clean. Kernel and external
dependencies remain unchanged.

The local terms list was **unavailable** during that full run; its transcript
keeps the original observation. After the operator's correction, ideation and
private seed, the configured-list screen passes across all 47 selected
generated/evidence surfaces. The [breakout receipt](ideation.md) names the
documentation-only amendment and future UI candidate. Subsequent affected
checks are recorded in [handoff-checks.txt](handoff-checks.txt); no runtime source
or generated bundle changed after the successful full gate. The control fold
owns the later implementation-ready transition and independent verification.

### VER-001 repair validation

The first repair-wide gate, [repair-checks.txt](repair-checks.txt), stopped at
formatting in this updated receipt. Formatting was corrected. The next run,
[repair-checks-002.txt](repair-checks-002.txt), passed the lifecycle, worktree,
release and work-order-index fixtures, then stopped on the two publication
source locks made stale by the repaired product docs. Both locks were refreshed
from `check-publication --print-locks`, and the publication gate passes.

On 2026-09-07, the [current repair gate](repair-checks-003.txt) completes
`npm test` with exit **0**: 7 release-preparation tests, 9 license tests,
288 runtime tests, 13 harness tests, 8 identity-corpus tests and 21 mutation
self-tests pass, along with every lifecycle, recovery, worktree, release,
index and plan-refutation fixture group. Installed harness bytes, all eight
context rows, both publication locks, and artifact, verification and feedback
evidence gates pass. The configured local-terms screen passes across 60 selected
generated/evidence surfaces. `git diff --check` is clean.

The [repair receipt](repair.md) retains the targeted fixture history and the
limits of the large-output proof. The four observation-only live records of
that runtime reported no out-of-set read or attempt. Canonical control owns the
subsequent repair-complete handoff; independent re-verification remains separate.

### Writer reservation repair validation

The [second repair receipt](repair-002.md) records the diagnosis, the chosen
direction and the rejected alternatives. The executor session ran under the
installed bundle and could not rebuild the runtime in place: the sandbox denies
the hooks directory, and a rebuilt runtime with stale hooks fails every later
hook closed. Validation ran first in a detached scratch worktree carrying the
same dirty tree. [repair-002-fixtures-001.txt](repair-002-fixtures-001.txt)
records all 14 harness fixtures passing there, including the new
foreign-reservation test. [repair-002-checks-001.txt](repair-002-checks-001.txt)
records the full gate passing through the rebuilt runtime tests and harness
fixtures before an executor resync error produced hook drift,
[repair-002-checks-002.txt](repair-002-checks-002.txt) records the re-emitted
scratch bundle passing `harness check`, the context measurement and every gate
step after the live evidence gate, and
[repair-002-checks-003.txt](repair-002-checks-003.txt) is the clean scratch gate
stopping at that gate on the then-expected live runtime drift. The re-emitted
bundle changes exactly the eleven generated hook files and the manifest;
skills, settings, the instruction block and the context measurement are
unchanged.

The operator installed the bundle and ran the live suite from a terminal
outside the sandbox; an earlier attempt through the session's own shell prefix
ran the build but was refused at the first hook file, which left this session's
hooks failing closed until the outside install completed. With the six new
records in place, `harness check`, the context measurement and the live
evidence gate pass in this worktree, and
[repair-002-checks-004.txt](repair-002-checks-004.txt) records the full gate run
through `npm run harness -- evidence`. Canonical control owns the
repair-complete handoff; independent re-verification remains separate.

### Serialized reservation recovery validation

The [third repair receipt](repair-003.md) records `VER-002` finding F1, the
directory-instance recovery protocol whose every step acts only on the observed
instance, the rejected recovery-guard and unconditional-removal alternatives,
and the legacy migration. This executor session again ran under the installed
bundle and could not rebuild the runtime in place, so validation ran in a
detached scratch worktree carrying the same dirty tree, reached through
`npm --prefix` because the installed permission hook refuses shell
working-directory overrides.
[repair-003-fixtures-001.txt](repair-003-fixtures-001.txt) and
[repair-003-fixtures-002.txt](repair-003-fixtures-002.txt) record two fixture
defects in the new tests and one recurrence of the known intermittent
read-observer subprocess timeout; [repair-003-fixtures-003.txt](repair-003-fixtures-003.txt)
records all 15 harness fixtures passing, including the generated-hook
concurrency regression that keeps the first owner's work outstanding.
[repair-003-checks-001.txt](repair-003-checks-001.txt) is the full scratch gate
stopping at the live evidence gate on the expected live runtime drift, and
[repair-003-checks-002.txt](repair-003-checks-002.txt) records every later gate
step passing individually. At the operator's request the receipt also admits
two adjacent runtime defects: a refused Stop is now reported once and the
harness's re-entry ends the turn with the obligation recorded, and output
refusals name twelve paths and the remaining count.
[repair-003-fixtures-004.txt](repair-003-fixtures-004.txt),
[repair-003-checks-003.txt](repair-003-checks-003.txt) and
[repair-003-checks-004.txt](repair-003-checks-004.txt) repeat the fixtures, the
full scratch gate and the later steps on that runtime with the same results.
The re-emitted bundle again changes exactly the eleven generated hook files and
the manifest; skills, settings, the instruction block and the context
measurement are unchanged.

The install, the live suite and the full gate in this worktree are the
operator's outside-terminal steps named in the receipt. Canonical control owns
the repair-complete handoff after them; independent re-verification remains
separate.

### Immutable reservation instances validation

The [fourth repair receipt](repair-004.md) records `VER-003` findings F1, F2
and F3: reservation instances whose facts never change under their names, an
operator release bound to one observed reservation, and the live-holder
scenario's required denied effect. This executor session again ran under the
installed bundle and could not rebuild the runtime in place, so validation ran
in a scratch clone carrying the same dirty tree, reached through `npm --prefix`.
[repair-004-fixtures-001.txt](repair-004-fixtures-001.txt) runs the two new
race tests against the unrepaired runtime and reproduces both defects at their
defect assertions; [repair-004-fixtures-002.txt](repair-004-fixtures-002.txt)
records 16 of 17 harness fixtures passing on the repaired runtime with one
fixture-pattern defect and the host refusing correctly;
[repair-004-fixtures-003.txt](repair-004-fixtures-003.txt) records all 17
passing, including the stale-reclaimer and operator-release regressions.
[repair-004-checks-001.txt](repair-004-checks-001.txt) is the first scratch
gate, stopped at the publication source locks made stale by the product-doc
write-backs; after the locks were refreshed,
[repair-004-checks-002.txt](repair-004-checks-002.txt) is the full scratch gate
stopping at the live evidence gate on the expected live runtime drift, and
[repair-004-checks-003.txt](repair-004-checks-003.txt) records every later gate
step passing individually. The re-emitted bundle again changes exactly the
eleven generated hook files and the manifest; skills, settings, the instruction
block and the context measurement are unchanged.

The operator installed the regenerated bundle and ran the live suite from a
terminal outside the sandbox. The six new records pin the repaired runtime and
pass; the live-holder attempt 003 is the first under the scenario's corrected
rule, witnessing the writer refusal it requires and, in that session, the
attribution refusal as well. With the records in place, `harness check`, the
context measurement and the live evidence gate pass in this worktree, and
[repair-004-checks-004.txt](repair-004-checks-004.txt) records the full gate
run through `npm run harness -- evidence`; the command runs once more after
that transcript is filed, so the completion receipt the installed hooks read
binds to the tree that includes it. Canonical control owns the
repair-complete handoff; independent re-verification remains separate.

### Integration validation

The [fifth repair receipt](repair-005.md) records `FINAL-001` finding F1:
`main` advanced by WO-032 and WO-109 while this order was in flight, so the
recorded feedback edition's subject could not describe the integrated tree.
The repair merged `main`, resolved the generated projections, and found the
merged actor board reading the WO-011 edition that compiler `0.7.0` no longer
recompiles; the console now follows the root feedback edition at `0.1.1`.
[repair-005-checks-001.txt](repair-005-checks-001.txt) is the first full gate
on the integrated tree, stopping at those five console failures.
[repair-005-checks-002.txt](repair-005-checks-002.txt) and
[repair-005-checks-003.txt](repair-005-checks-003.txt) are full gates after
the console change, each passing 305 of 306 tests with the same single
failure: the WO-032 host-collection test exceeding its sixty-second release
listing budget under full-gate load in this sandbox. The second of them ran on
a quiet tree and recorded `git diff --check` clean.
[repair-005-checks-004.txt](repair-005-checks-004.txt) records the console
suite passing alone, including that test, and every later gate step passing
individually except the feedback evidence check, which needed the live
streams. The operator's outside-sandbox audit then recorded them, the
`selfhost` case was re-pinned to that edition, and
[repair-005-checks-005.txt](repair-005-checks-005.txt) is the full gate on
that tree: 305 of 306 with the same single budget failure, while the feedback
evidence check and the console fixture check pass on the same bytes.
[repair-005-checks-006.txt](repair-005-checks-006.txt) is the operator's
gate from a terminal outside the sandbox on that tree: 305 of 306 with the
same budget failure, which refuted the sandbox-load reading and put the
console budget to the operator. The operator superseded the deferral: the
root gate now runs the console suite in its own `node --test` step after the
kernel, compiler and skeleton suites, with the budget itself unchanged, and
[repair-005-checks-007.txt](repair-005-checks-007.txt) is the full gate on
that chain, passing every step with exit 0. The quiet rerun over the tree
that includes it holds the completion receipt. Filed transcripts replace this
checkout's address with `<repo>`; independent re-verification of the
affected claims remains separate.
