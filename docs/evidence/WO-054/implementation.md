# WO-054 implementation evidence

The initial implementation record below is historical. The current repair,
operator clarification and refreshed evidence are in [repair-001.md](repair-001.md).

WO-054 provides a sealed worktree verification profile and Codex continuation
after compaction. The executor is Codex CLI `0.155.0`, `gpt-6-astra`, `ultra`
(normalized xhigh, subagents), from `codex-session-readback`. Read-only helpers
reviewed the design; this session was the sole coding writer. No branch commit
or remote publication is part of this implementation.

## Result and acceptance mapping

The profile captures the WO-052 scratch target's committed files and diff,
seals a closed WorkOrder contract and exact named tests, and runs each test in a
separate confined copy before dispatching the verifier. Both the source worker
and verifier receive the same contract facts. The implementer's superficial
focused test passes, while the host's independent contract check exits 1. The
verifier records a blocking finding and the acceptance matrix preserves failure.

| Criterion | Evidence |
| --- | --- |
| AC1: blinded contract/diff/snapshot/host witnesses; envelope fields refuse with a path | [Focused suite](../../../packages/skeleton/test/verification-worktree.test.ts), including the WO-052 episode and nested envelope injection cases; [portable proof](snapshot-proof.json) |
| AC2: confined named tests; sealed snapshot tampering refuses | Actual subprocesses deny outside read/write/network effects. Separate execution copies isolate caches. Byte/mode/inventory/permission changes refuse before dispatch, cached recovery and admission. Unavailable executables and self-modifying inputs cannot supply passing witnesses. |
| AC3: planted defect and no implementer greenwashing | Expected exit 0, observed exit 1, reproduction and evidence references accompany the finding; replay and a success-shaped implementer event preserve the failed row |
| AC4: existing profile compatibility | Existing compiler and skeleton WO-010 fixtures retain their source and behavior; the current verification edition exercises planted defect, repair, staleness and replay |
| AC5: write-backs | Product 02, 03, 06, 07 and 10, both runbooks, [decisions](decisions.md) and the generated decisions index |
| AC6: checks, pins and fresh feedback | 31 generated harness surfaces; current artifact/verification/authority/feedback editions; publication and release-surface checks; product gate below |

The [fixture runner](fixture.mjs) writes/checks a portable observed projection.
Raw test output, scratch paths, timestamps and random commit identities are
omitted. Snapshot contents, diff, contract, named commands, actual exits, finding
fields and row status remain visible. The executable fixture checks the complete
capsule hash. macOS provides actual confinement; missing confinement never falls
back to unrestricted execution.

## Codex continuation

[Behavior and activation](codex-continuation.md) describe the contributor adapter.
`PostCompact` records the turn, compact `SessionStart` restores the same saved
unfinished task, and `Stop` permits one automatic continuation while completion
remains outstanding. Existing explicit recovery controls remain decisive;
native interruption stays with Codex. The repair removes conversational string
parsing and the extra pause state under the operator's clarification in D005.
The adapter does not dispatch work, change writer ownership or start a worker.
The four repository refusals and root subagent budget remain intact. Executor
completion refreshes the index and releases the current Codex writer; completed
phase and absent ownership both prevent further automatic continuation.

Both the [native capability probe](codex-native-probe.json) and [generated-policy
probe](codex-generated-probe.json) passed on Codex CLI 0.155.0. The latter restored
a work-order ID absent from the user prompt, continued after an initial final
reply, and completed the pending file write without an external wake-up. Exactly
one retry receipt remained after three automatic compactions. Synthetic host
state is identified separately from native runtime behavior. Recorded hashes
identify the pre-repair generated Codex files; the immutable probes are
historical evidence, not a current-byte or native interruption claim.

A direct invocation also restored this worktree's actual executor state. Native
project/hook trust and root-checkout definitions are required for linked-worktree
activation; activation in the running desktop session is not established. No
global setting was changed. Contributor continuation is excluded from ordinary
target-worker profiles.

## Validation

The focused Codex policy suite passed all 7 tests. The selected subagent-cap
and Codex installation checks passed all 4 tests. The portable snapshot proof,
planning check, publication check, harness check, release-surface check and all
console evidence comparisons passed. The full product gate passed on 2026-09-18:
`npm test` reported 20 passing suite groups, zero failures and 64 fresh tasks
in 368.20 seconds. `git diff --check` is clean.

The fresh revision 003 evidence editions preserve historical observations. The
feedback self-hosted audit uses `codex-cli-exec`, `gpt-6-astra`, xhigh as launch
selections; effective child model/effort remain unknown under its transport
contract. Its acceptance matrix completed over ten regression fixtures.
Console expectations select that same current feedback edition. The repository
feedback audit is distinct from WO-056's live target-verifier proof.

```sh
npm run build
node --test scripts/test-codex-continuation.mjs
node --test --test-name-pattern='WO-139|WO-054 Codex' scripts/test-harness.mjs
node docs/evidence/WO-054/fixture.mjs --check
npm run plan -- check
npm run publication:check
node scripts/release.mjs check-surfaces --local
npm test
git diff --check
```

## Compatibility and limits

Application target `v0.30.0`, compiler `0.14.0`, skeleton `0.26.0`; kernel and
console are unchanged. No external dependency was added. `verification-v1` and
accepted-result/event versions are unchanged. Legacy subjects omit new fields;
new-profile inputs are closed and compiler-pinned.

This first proof accepts committed regular UTF-8 snapshots within the documented
100-file, 100,000-byte/file and 100,000-character diff bounds. Commands are bounded
argument vectors. The isolation is not a hostile-process security boundary and
descendant cleanup is not established. Test copies remain available for
inspection. Source-writing repair, a live target verifier, visual/network claims
and independent verification/review are separate work orders or dispatches.

The recorded decision's benefit is executable: a committed source change reaches
the acceptance matrix with independent host tests, and its contract failure
survives worker success. Native continuation restores unfinished work without a
separate wake-up. No process-cost reduction is claimed.
