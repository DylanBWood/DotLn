# WO-114 — Runtime status projection: the resident writes a `runtime-status-v1` view model of live actors, episodes, presence phase, cadences, holds, budget and work-order statuses on every tick, and the text console renders it (version assigned at activation)

**Cost:** Legacy declaration unavailable: added and removed wall-clock, context bytes, commands, tokens and steps were not measured. No reduction is claimed; the next planning refutation must judge this missing cost evidence (WO-126, 2026-09-09).

**Model:** any capable model. State the model and effort actually run in the
result (07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** minor. A new versioned view-model contract
written by the resident and one render in `packages/console`. Assigned at
activation under the standing opt-out default.
**Nomination provenance:** the operator's 2026-09-08 mid-pass direction
that the always-on runtime has the UI of live agent status and of work-order
statuses; 04-interfaces.md §Plural UI hosts, one projection contract; the
actor board (WO-032) as the existing read-only projection. Planner-
synthesized draft; captures and hashes in the ledger section of that date.
Opaque identifier, not a priority. Clean-room screen: no stop condition.
**Depends on:** WO-068 merged (the resident whose slice this projects);
WO-120 merged (derived orders appear under the same identity as
hand-written ones); WO-032 merged (`uifa-board-v1` and the console host; satisfied at
`v0.14.0`).
**Recommended placement:** immediately after WO-068, in a free lane; it
adds the contract to `packages/compiler` or `packages/console` (the
executor records which and why) and the writer to the resident. A
recommendation, not a dependency token.

**Cites (read these sections):** 04-interfaces.md §Plural UI hosts, one
projection contract, §Actor board v0 and §Later console hosts;
13-uifa-roles.md §UIFA showrunner and §Actor board role service;
02-domain-model.md §Memory and observation; `packages/console/README.md`;
`docs/work-orders/WO-068-resident-host.md`.

**Objective:** `runtime-status-v1` is a versioned, additive view model:
actors (kind, availability, last episode), live episodes (order, actor,
transport, phase, started at, elapsed, launch claims), presence (signal,
phase, next cadence fire times), holds with reasons, budget consumed and
remaining, and every open order's lifecycle phase, dependency state and
verdict from the index's data, derived and UI-filed orders included under
the same identities; the resident writes it atomically to a local
projection file on each tick and on each event; the console's text host
renders it and refreshes when the file changes; the Angular consumer in the
operator's fork reads the same file or its loopback equivalent (WO-115).

**Observed gap (dated 2026-09-08, `main` at `33e2c25`):**

- The actor board projects control state at rest; nothing shows a running
  actor, a phase or a cadence, because nothing runs.

**Design (scope discipline):**

- The file is a projection, never authority; it carries no path or
  identifier the privacy rules exclude; it is rebuilt from the log on
  restart.
- **Declined alternatives, recorded:** a network service (WO-115 decides
  the loopback surface); a second status source beside the index.

**Deliverables:** the contract, the writer, the text render, fixtures, the
write-backs below.

**Acceptance criteria (all required)**

1. Over a fixture resident log with a fake clock, the projection file's
   content is pinned per tick and rebuilt identically after a restart.
2. The text host renders the fixture projection with every section and
   refreshes on a file change; the existing board fixtures are byte-identical.
3. The projection contains no physical path, session id or host name
   (fixture grep).
4. Write-backs land: 04 §Plural UI hosts (the contract), console README,
   ledger entry.
5. `npm test` green; `git diff --check` clean; no new dependency.

**Evidence gate:** the fixture transcripts; `npm test`.

**Write-back duty:** as listed in criterion 4.

**Non-goals:** commands (WO-115); the audit projection (WO-116); the
Angular shell (the fork's).

**Operator-review assumptions**

1. A local file is the first transport for the projection; the loopback
   surface follows in WO-115.
