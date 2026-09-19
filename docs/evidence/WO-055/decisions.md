# WO-055 decisions

## WO-055-D001 — Bound the repair coordinator to existing host contracts

```json
{
  "id": "WO-055-D001",
  "date": "2026-09-18",
  "dispatch": "resume: next",
  "decision": "Compose existing source-change and verification hosts through a bounded persisted repair program; keep original contract and authority, exact admitted scope expansions, and separate execution baseline.",
  "evidence": [
    "docs/work-orders/WO-055-repair-continuation.md",
    "docs/product/02-domain-model.md#independent-verification-v1",
    "packages/skeleton/src/source-change-host.ts",
    "packages/skeleton/src/verification-host.ts",
    "packages/kernel/src/core.ts"
  ],
  "rejected": [
    {
      "option": "NoOp",
      "reason": "Leaves repair coordination manual and does not satisfy the selected order."
    },
    {
      "option": "Let verifier references grant scope",
      "reason": "Read-only verification is not an authority source."
    },
    {
      "option": "Generalize both existing hosts into a workflow engine",
      "reason": "Adds coupling beyond the bounded continuation."
    }
  ],
  "reopenWhen": "A consumer needs broader effects, non-command reproduction steps, or a different worker host."
}
```

Operator dispatch: `resume: next`, 2026-09-18. Sources: WO-055; product 02
§Independent verification v1 and §Events and decisions; product 03 §Session
lifecycle & resilience; `source-change-host.ts`, `source-change-worktree.ts`,
`verification-host.ts`, `verification-worktree.ts`, `reactor.ts`, kernel
`stepProgram`, and their existing fixtures. Additional implementation inputs:
`worker-protocol.ts`, compiler verification/grant types, architecture ownership
tests, and the evidence/bundle source inventories.

The critical-path contribution is a recoverable, bounded source-to-verification
repair loop, removing the operator's repeated handoff between the existing two
hosts. NoOp leaves that handoff manual and does not satisfy the selected order.
Use a separate repair slice and store, with deterministic child stores for the
existing source-change and verification hosts. Their current single-order state
and immutable receipts remain useful; generalizing either host into another
workflow engine would add unnecessary coupling.

Preserve the original contract and base in the derived order. An explicit
execution baseline identifies the failed commit from which the source-change
episode branches and measures its repair diff. Finding evidence IDs resolve
against host witnesses; their files and reproduction commands pass containment
before any dispatch. A path/test grant pairs WO-042 provenance with exact scope
and must match a separate host registry record in full. Envelope and operation
lists remain unchanged: these grants extend exact scope within already admitted
effects. The writer gets the finding and contract, never an earlier transcript.

Policy resistance/fixes that fail: retain existing authority checks and receipt
recovery rather than competing guards. Commons: a declared default of two rounds
bounds worker use; two read-only agent slots are planned out of 20, including
descendants (none planned). Drift: require actual committed diff and independent
host test witnesses. Escalation: add no approval cycle or retry beyond the order.
Success to the successful: reuse is justified by tested host boundaries, not
investment alone; a generic workflow engine is unnecessary for this proof.
Shifting the burden: persist the continuation and reuse child receipts after a
kill. Rule beating: test unauthorized references, grant spoofing, false repairs,
and interruption against actual fixture Git commits. Seeking the wrong goal:
the outcome is a verified repair, not event or agent counts.

Naive Interventionism: keep the established synthetic verification route and
source host defaults compatible. Probe first with pure derivation and fixture
hosts; no live loop, publication, or new dependency. Reopen if another consumer
needs broader effects, non-command reproduction steps, or a different worker
host. The public interface and serialized continuation carry the contract so a
consumer need not reconstruct this session.

The structured decision and generated index discharge this pre-2026-09-09 order's legacy ledger duty. Skeleton advances 0.26.0 → 0.27.0, application target v0.31.0 above local v0.30.0; no other component or dependency changes. Recovery tests exposed generic parent command decoding, corrected with orchestration-specific events. Review added durable snapshot preparation and host execution of every derived reproduction command.
