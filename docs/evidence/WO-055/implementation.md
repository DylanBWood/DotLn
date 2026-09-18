# WO-055 implementation evidence

WO-055 adds bounded source-writing repair over the existing WO-052 source host
and WO-054 verification snapshot. The executor is Codex CLI 0.155.0,
`gpt-6-astra`, `ultra` (xhigh with subagents), from current-session readback.
The root session is the sole repository writer; two read-only helpers reviewed
integration and implementation. Formal verification remains a separate dispatch.

## Acceptance mapping

| Criterion | Executable evidence |
| --- | --- |
| AC1 — containment and grants | `repair.test.ts`: exact referenced surfaces and reproduction commands, original envelope/operation lists/base/contract hash, no references, outside path/command and unadmitted or broader grant refusals; separate exact path and command grants record provenance IDs. Host refusal fixtures assert byte-identical persisted authority, no derived order and no writer dispatch. |
| AC2 — repair and original-contract re-verification | A WO-052 process double commits the planted defect. A fresh repair double commits only `fixture.txt`; independent confined tests and a fresh verifier judge all original criteria and commands. The plural reproduction case asserts both commands in the parent host observation. Full reactor replay equals live state. |
| AC3 — bounded exhaustion | Two incorrect repair commits produce `RepairExhausted` with the last finding and human next action. There are two writer launches and three verifier launches; no third source store or dispatch exists. |
| AC4 — interruption | Real child host SIGKILL after the repair commit and after snapshot preparation; recovery reaches green without another writer launch. A partial unpublished snapshot directory remains preserved while recovery prepares a fresh copy. Completed-host recovery leaves the log unchanged. |
| AC5 — write-backs | Product 02 §Independent verification v1, skeleton README, release roadmap, and the structured [decision](decisions.md) plus generated decisions index. The latter discharges this old order's ledger duty under the executor skill. |
| AC6 — integration evidence | Build, focused compatibility checks, full `npm test` (20 suites passed, zero failed), regenerated bundle pins, fresh evidence editions, publication/planning/release checks, and clean `git diff --check`. |

The [portable proof](repair-proof.json) is produced by [fixture.mjs](fixture.mjs).
It records observed outcomes, event types, refused inputs, repair diff paths,
launch counts and SIGKILL recovery. It deliberately omits scratch paths, random
commit identities and raw subprocess output. It is an observation projection,
not a raw log or an independent oracle. The tests separately assert actual
commits, envelopes, full contract equality, replay and negative outcomes.

## Interface and recovery

`RepairOriginal` names the original WorkOrder, effective envelope, declared
surfaces, criteria, named tests and `roundLimit` (default two).
`deriveRepairOrder` resolves evidence IDs through the failed subject's witnesses.
Its exact path/test expansion records must match the separately supplied host
registry, including WO-042 provenance and repository identity. It never adds
an effect or operation to the original authority.

The derived order preserves its original contract and base. An explicit
`executionBaseCommit` identifies the failed revision from which WO-052 branches
and measures only the repair diff. Fresh writer input contains the original
contract and finding, with earlier worker facts/decisions removed. The writer's
focused command is the first derived reproduction; the host runs all derived
reproductions and refuses committed input changes before re-verification.

The shared reactor interprets persisted executable `Sequence`, `Invoke`, `Await`
and `Guard` programs. Parent command events carry orchestration ownership;
child stores retain native worker outboxes and immutable commit receipts. Each
verifier uses the complete original contract, named tests and criteria, with a
round-specific physical episode namespace. An interrupted unpublished snapshot
copy is preserved; a prepared snapshot receipt can be reused before dispatch.

`repairNextAction` returns `human` for containment/attention and exhausted states,
`none` for completion, and `run` for an active program. Unavailable or incomplete
verification never becomes a passing result. Explicit child-store and worktree
cleanup remains an operator/host action; the coordinator preserves them.

## Validation and limits

The build and focused group passed all 37 checks, including the existing reactor
identity and architecture contracts. The subsequent two-command reproduction
regression passed. The final `npm test` completed successfully on 2026-09-18:
20 suites passed, zero failed, 64 fresh tasks, 525.51 seconds. An earlier gate
was stopped without recording a pass because a metadata refresh was still
running; the successful run began after that refresh finished and retained fixed
inputs throughout.

Publication (272 of 272 documents), planning, local release-surface checks and
`git diff --check` passed. Regenerated harness bundle checks and fresh WO-055
authority, artifact, verification and feedback evidence checks passed. The live
repository feedback audit completed all ten fixtures using `codex-cli-exec`,
with `gpt-6-astra` and `xhigh` selected; its effective child model/effort readback
is unavailable. The recorded self-host audit and refreshed console fixture
checks passed. Local terms were unavailable; no terms assessment is claimed.

The observed outcome meets the bounded-repair objective: one repair reaches
green, two incorrect repairs stop without a third writer, and interrupted
continuations recover without repeating the committed repair. The session used
two read-only review helpers and one live feedback verifier child, with no known
descendants. The hook's incomplete observation is not evidence of zero agents.
Final usage counters remain in ignored session receipts and the handoff response.

Application target `v0.31.0`, skeleton `0.27.0`; compiler `0.14.0`, kernel `0.5.0`
and console stay unchanged. No dependency was added. The event envelope schema
remains 1; new repair event types are additive. Package publication controls are
preserved, and this executor neither commits nor publishes the branch.

This proof uses synthetic writer and verifier doubles over real scratch Git
repositories and actual confined host verification commands. It is not the
WO-056 live repair loop. The separate required repository feedback audit is not
a live target repair claim. Existing text snapshot bounds, trusted local host
assumptions, and the WO-052/054 confinement and descendant-cleanup limits apply.
Scope grants rely on a trusted host registry, not cryptographic authentication.
The improvement demonstrated here is automatic bounded repair and durable
recovery; no process-cost reduction is claimed.

Reproduction:

```sh
npm run build
node --test packages/skeleton/dist/test/repair.test.js
node docs/evidence/WO-055/fixture.mjs --check
npm run publication:check
npm run plan -- check
node scripts/release.mjs check-surfaces --local
npm test
git diff --check
```
