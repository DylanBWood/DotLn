# WO-120 — Derived work identity: a runtime-derived or UI-filed order becomes a durable work-order record with the same identity, authority file, lifecycle, index row and status as a hand-written one, and `dotln intent` files a draft the same way (version assigned at activation)

**Cost:** Legacy declaration unavailable: added and removed wall-clock, context bytes, commands, tokens and steps were not measured. No reduction is claimed; the next planning refutation must judge this missing cost evidence (WO-126, 2026-09-09).

**Model:** any capable model. State the model and effort actually run in the
result (07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** minor. A control-plane contract: a reserved
identity range, a generated authority file, and one command. Assigned at
activation under the standing opt-out default.
**Nomination provenance:** the external review of the revised plan
(2026-09-08, finding 5): derived orders had no durable identity or path
into the document control plane, and the parity contract promised commands
no order owned. Planner-synthesized draft; the capture's hash is in the
ledger section of that date. Opaque identifier, not a priority. Clean-room
screen: no stop condition.
**Depends on:** WO-043 merged (generated authority files carry typed
dependency blocks); WO-069 merged (the derived root and identity range are
configuration).
**Recommended placement:** after WO-069, before WO-100 and WO-115; it edits
`scripts/resume.mjs`, `scripts/work-orders.mjs`, adds
`scripts/lib/derived-orders.mjs` and the `dotln intent` command. A
recommendation, not a dependency token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-043",
    "relation": "hard",
    "reason": "generated authority files carry typed dependency blocks"
  },
  {
    "workOrderId": "WO-069",
    "relation": "hard",
    "reason": "the derived root and identity range are configuration"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** 07-execution-guide.md §Operator resume
phrases (activation requires `WO-NNN` and an authority path);
06-roadmap.md §Work-order navigation and identity; `scripts/resume.mjs`
(`activate`); `packages/compiler/src/types.ts` (the compiled `WorkOrder`);
`docs/work-orders/WO-113-work-order-files-stable-contracts.md` (the allowed
section set the generated file must satisfy).

**Objective:** The configuration declares a derived identity range (for
example `WO-900` to `WO-999`) and a derived root; `materializeOrder(compiled, provenance)`
allocates the next identity from control state, writes an authority file in
the stable-contract shape (title, metadata with the provenance and the typed
dependency block, objective, criteria from the contract, non-goals,
surfaces) under the derived root, and activates it through the same
`resume activate`, so the index, `status --json`, the runtime status
projection and every lifecycle command see it; the compiled `WorkOrder`'s
`workOrderId` equals that identity; `dotln intent "<prose>"` files a draft
in the same shape for a human to review before activation; a derived order
survives a resident restart under the same identity.

**Observed gap (dated 2026-09-08, `main` at `33e2c25`):**

- `resume activate` requires a `WO-NNN` identity and an authority file; the
  compiled `WorkOrder` is a different contract; nothing bridges them.

**Design (scope discipline):**

- Allocation is an event (`WorkOrderIdentityAllocated`), so replay
  reproduces identities and two residents cannot collide (the lock in
  WO-068 already serializes).
- The generated file passes WO-113's section check and WO-043's typed block
  check.
- **Declined alternatives, recorded:** a second identity family outside the
  index (the operator's window must show all work in one place); free-form
  identities.

**Deliverables:** the range and root configuration, the materializer, the
event, the `intent` command, fixtures, the write-backs below.

**Acceptance criteria (all required)**

1. A fixture compiled `WorkOrder` materializes into an authority file that
   passes the index, section and typed-block checks, activates through
   `resume activate`, and appears in the index and `status --json` with its
   provenance.
2. Identities allocate deterministically from control events; a replay
   reproduces them; a range exhaustion refuses with the reason.
3. `dotln intent` files a draft in the same shape and does not activate it.
4. A fixture resident restart resumes a derived order under the same
   identity.
5. Write-backs land: 07 §Operator resume phrases (`intent`; the derived
   range), 06 §Work-order navigation and identity, ledger entry.
6. `npm test` green; `git diff --check` clean; no new dependency.

**Evidence gate:** the transcripts; `npm test`.

**Write-back duty:** as listed in criterion 5.

**Non-goals:** deriving work (WO-100); the UI (WO-115); changing lifecycle
legality.

**Operator-review assumptions**

1. A reserved range inside the existing `WO-NNN` family is preferable to a
   new family; the reviewer may prefer a prefix.
