# WO-110 — Local-model transport: a third `WorkOrderTransport` over a local inference endpoint joins the actor catalog for the inspection profile, written from WO-027's probe and a fresh availability row (version assigned at activation)

**Cost:** Legacy declaration unavailable: added and removed wall-clock, context bytes, commands, tokens and steps were not measured. No reduction is claimed; the next planning refutation must judge this missing cost evidence (WO-126, 2026-09-09).

**Model:** any capable model; the live row uses the local endpoint the
operator has. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** minor. One transport and one actor kind.
Assigned at activation under the standing opt-out default.
**Nomination provenance:** the operator's 2026-09-08 mid-pass list of actor
kinds ("agents, claude, codex, local, humans, scripts") and WO-027's
local-inference probe. Planner-synthesized draft; captures and hashes in the
ledger section of that date. Opaque identifier, not a priority. Clean-room
screen: no stop condition.
**Depends on:** WO-027 merged (the probe whose endpoint shape this transport
implements; closed); WO-009 merged (the transport port; satisfied at
`v0.10.0`).
**Recommended placement:** any free lane after WO-068 so the catalog
exists; it edits `packages/skeleton/src/worker-transport.ts` and the actor
catalog. The source-change profile for this transport waits for its own
observed rows. A recommendation, not a dependency token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-027",
    "relation": "satisfied-by-close",
    "reason": "the probe whose endpoint shape it implements"
  },
  {
    "workOrderId": "WO-009",
    "relation": "satisfied-by-release",
    "release": "v0.10.0",
    "reason": "the transport port"
  },
  {
    "workOrderId": "WO-068",
    "relation": "reference-only",
    "reason": "the actor catalog it joins"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** 03-architecture.md §Ports
(`WorkOrderTransport`) and §Runtime primitive catalogs; `docs/discovery/local-inference.md`
and `.json` (WO-027's rows); `packages/skeleton/src/worker-transport.ts`;
`docs/work-orders/WO-068-resident-host.md` (the catalog).

**Objective:** Implement the port over the local endpoint shape WO-027
recorded (or the shape a fresh availability row observes), for the
inspection profile: a bounded read-only episode returns the six-field
envelope; an unavailable endpoint yields a typed unavailability the resident
turns into a NoOp; the actor catalog gains `local-model`.

**Observed gap (dated 2026-09-08, `main` at `33e2c25`):**

- Two CLI transports exist; the local model is a probe record only.

**Design (scope discipline):**

- Fresh availability row first (the endpoint, the model, the tool support);
  the transport is written from the row; process doubles in tests.
- **Declined alternatives, recorded:** a source-change profile here (needs
  its own rows); an embedded inference runtime.

**Deliverables:** the row, the transport, the catalog entry, fixtures, a
live smoke, the write-backs below.

**Acceptance criteria (all required)**

1. With a double endpoint, an inspection episode returns the six-field
   envelope and the result validates; an unavailable endpoint yields the
   typed unavailability.
2. A live smoke against the operator's local endpoint returns an envelope,
   recorded with shapes only, or an `unavailable` row.
3. Write-backs land: 03 §Ports, `environment.md` addendum, ledger entry.
4. `npm test` green; `git diff --check` clean; no new dependency.

**Evidence gate:** the transcripts; the smoke; `npm test`.

**Write-back duty:** as listed in criterion 3.

**Non-goals:** a writing profile for the local model; model quality
claims.

**Operator-review assumptions**

1. The local endpoint is the operator's; the sandbox cannot reach it.
