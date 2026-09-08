# WO-122 — Actor catalog, second slice: the `cli-worker` kind launches a harness session through the writer profile by the observed launch path, and the `human-handoff` kind writes a decision packet and waits (version assigned at activation)

**Model:** any capable model; the live row uses the actual harnesses. State
the model and effort actually run (07-execution-guide.md §Model-specific
notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** minor. Two actor kinds in the resident's
catalog. Assigned at activation under the standing opt-out default.
**Nomination provenance:** the external review of the revised plan
(2026-09-08, finding 10): the first resident draft combined the lifecycle,
presence inputs, a hook change and three actor kinds in one order. The
`script` kind stays with the resident; these two are split here. Planner-
synthesized draft; the capture's hash is in the ledger section of that
date. Opaque identifier, not a priority. Clean-room screen: no stop
condition.
**Depends on:** WO-068 merged (the catalog); WO-051 merged (the writer
request and profile the `cli-worker` kind dispatches); WO-044 merged (the
detached-launch rows the launch path is designed from).
**Recommended placement:** after WO-068 and WO-051; it edits the actor
catalog and adds the handoff packet writer. A recommendation, not a
dependency token.

**Cites (read these sections):** 03-architecture.md §Runtime primitive
catalogs; `docs/discovery/writing-worker-smoke-<date>.md` (WO-044's
detached-launch rows); `docs/work-orders/WO-051-source-change-transport-profile.md`;
`docs/work-orders/WO-068-resident-host.md`.

**Objective:** `cli-worker` launches a harness session through the writer
or inspection request by the launch path WO-044 observed for a detached
parent, stamps the session's origin for WO-121, records the launch claims,
and returns the envelope; `human-handoff` writes a decision packet
(question, options, evidence references) under the control local
directory, appends `HandoffRequested`, and the resident dispatches nothing
for that order until `HandoffAnswered` arrives; an unavailable launch path
yields a NoOp with the row that says so.

**Observed gap (dated 2026-09-08, `main` at `33e2c25`):**

- No process launches a harness session without an operator; no packet
  shape exists for a decision the runtime cannot make.

**Design (scope discipline):**

- The launch path is the observed one; if WO-044 recorded no detached path
  for a harness, that harness's kind is `unavailable` and the catalog says
  why.
- **Declined alternatives, recorded:** a fallback from `cli-worker` to
  another kind; answering handoffs from a model.

**Deliverables:** the two kinds, fixtures with doubles, a live row, the
write-backs below.

**Acceptance criteria (all required)**

1. With doubles, `cli-worker` dispatches the writer request through the
   resident, stamps the origin, and returns the envelope as an event; with
   the launch row `unavailable`, it yields the NoOp naming the row.
2. `human-handoff` writes the packet, appends the event, and the resident
   holds that order until the answer event; a fixture answer resumes it.
3. One live row: the resident, with the operator marked away, launches a
   real harness session through the writer profile in a scratch worktree
   and records the envelope, with shapes only.
4. Write-backs land: 03 §Runtime primitive catalogs (the kinds), ledger
   entry.
5. `npm test` green; `git diff --check` clean; no new dependency.

**Evidence gate:** the transcripts; the live row; `npm test`.

**Write-back duty:** as listed in criterion 4.

**Non-goals:** the local model (WO-110); presence (WO-121).

**Operator-review assumptions**

1. The operator runs the live row outside the sandbox.
